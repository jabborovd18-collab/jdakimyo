// lib/chem-balance.js
//
// Reaksiya tenglamasining balansini tekshiradi.
//
// Nega kerak: bazaga tenglama qo'lda kiritiladi va koeffitsientni tushirib
// qoldirish juda oson. Noto'g'ri tenglama esa talabani o'rgatmaydi, chalg'itadi.
// Bazadagi eski ma'lumot orasida shundaylari topildi, masalan:
//
//   C₆H₁₂O₆ → 3C₂H₄O + 3H₂O     (chapda 12 H, o'ngda 18 H)
//
// Bu tekshiruvchi har bir elementning atomlari va umumiy zaryad ikki tomonda
// teng ekanini sanaydi. Tenglamani O'ZI muvozanatlashtirmaydi — faqat
// tekshiradi va farqni ko'rsatadi.
//
// Ishlatilishi:
//   import { balansTekshir } from '@/lib/chem-balance'
//   const natija = balansTekshir('H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O')
//   natija.muvozanatli  // true

/** Davriy jadvaldagi barcha element belgilari (1–118) */
const ELEMENTLAR = new Set(
  ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni ' +
    'Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I ' +
    'Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt ' +
    'Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr ' +
    'Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'
  ).split(' '),
)

/**
 * Formulaga tegishli bo'lmagan, holat yoki sharoitni bildiruvchi qavs ichidagi
 * so'zlar. Ca(OH)₂ dagi qavsdan farqlash uchun ro'yxat aniq bo'lishi kerak.
 */
const HOLAT_BELGILARI = new Set([
  'aq', 'q', 's', 'g', 'l', 'sol', 'aqueous',
  'gaz', 'suyuq', 'qattiq', 'eritma', 'suvda',
  'dilute', 'dil', 'conc', 'concentrated',
  'suyultirilgan', 'konsentrlangan', 'quyuq',
  'tv', 'tverd', 'cr', 'amorf', 'kristall',
])

const PASTKI_INDEKS = '₀₁₂₃₄₅₆₇₈₉'
const YUQORI_INDEKS = '⁰¹²³⁴⁵⁶⁷⁸⁹'

/** Reaksiya strelkasi — hamma ko'rinishi */
const STRELKA = /(⇌|⇄|⇋|↔|⟷|<->|<=>|→|⟶|⇒|⟹|➔|➜|->|=>|=)/

export class BalansXatosi extends Error {
  constructor(message) {
    super(message)
    this.name = 'BalansXatosi'
  }
}

/**
 * Pastki/yuqori indekslarni oddiy yozuvga o'tkazadi.
 * Yuqori indeks zaryadni bildirgani uchun "^" bilan belgilanadi.
 */
function tayyorla(matn) {
  let natija = ''
  let yuqoridamiz = false

  for (const belgi of String(matn)) {
    const yuqoriRaqam = YUQORI_INDEKS.indexOf(belgi)
    const yuqoriBelgi = belgi === '⁺' ? '+' : belgi === '⁻' ? '-' : null

    if (yuqoriRaqam >= 0 || yuqoriBelgi) {
      if (!yuqoridamiz) {
        natija += '^'
        yuqoridamiz = true
      }
      natija += yuqoriBelgi ?? String(yuqoriRaqam)
      continue
    }

    yuqoridamiz = false

    const pastki = PASTKI_INDEKS.indexOf(belgi)
    if (pastki >= 0) natija += String(pastki)
    else if ('·•⋅∙'.includes(belgi)) natija += '*'
    else if ('↓↑⇓⇑'.includes(belgi)) continue // cho'kma va gaz belgisi
    else natija += belgi
  }

  return natija.trim()
}

/**
 * Holat belgilarini olib tashlaydi: "HNO₃(dilute)" -> "HNO3".
 * Ca(OH)₂ dagi qavs tegilmaydi — ichida element belgisi bor.
 */
function holatniTashla(formula) {
  return formula.replace(/\(([^()]*)\)/g, (butun, ichi) => {
    const tozalangan = ichi.trim().toLowerCase().replace(/[.\s]/g, '')
    if (!tozalangan) return ''
    if (HOLAT_BELGILARI.has(tozalangan)) return ''
    // "t°", "25°C", "kat." kabi izohlar ham formulaga kirmaydi
    if (/[°]/.test(ichi) || /^kat/i.test(tozalangan)) return ''
    return butun
  })
}

/** Raqam o'qiydi, bo'lmasa 1 */
function sonniOqi(matn, i) {
  let raqamlar = ''
  while (i < matn.length && matn[i] >= '0' && matn[i] <= '9') {
    raqamlar += matn[i]
    i++
  }
  return [raqamlar ? Number(raqamlar) : 1, i]
}

function qoshish(nishon, manba, karra) {
  for (const [symbol, soni] of Object.entries(manba)) {
    nishon[symbol] = (nishon[symbol] ?? 0) + soni * karra
  }
}

const OCHUVCHI = '(['
const YOPUVCHI = ')]'
const YAKKA_ELEMENT = /^[A-Z][a-z]?$/

/** Formula oxiridagi zaryadni ajratadi. Qoidalar mobil ilovadagi bilan bir xil. */
function zaryadniAjrat(qism) {
  const moslik = qism.match(/(\^?)(\d*)([+-])$/)
  if (!moslik) return [qism, 0]

  const [, karet, raqamlar, belgi] = moslik
  const oldi = qism.slice(0, moslik.index)
  if (!oldi) throw new BalansXatosi(`Zaryaddan oldin formula yo'q: "${qism}"`)

  const ishora = belgi === '+' ? 1 : -1

  if (karet) return [oldi, ishora * (raqamlar ? Number(raqamlar) : 1)]
  if (!raqamlar) return [oldi, ishora]
  if (/[)\]]$/.test(oldi) || YAKKA_ELEMENT.test(oldi)) {
    return [oldi, ishora * Number(raqamlar)]
  }
  if (raqamlar.length >= 2) {
    return [oldi + raqamlar.slice(0, -1), ishora * Number(raqamlar.slice(-1))]
  }
  return [oldi + raqamlar, ishora]
}

/** Qavslarni ochib atomlarni sanaydi */
function guruhniOqi(matn, boshlanish, qavsIchida) {
  const atomlar = {}
  let i = boshlanish

  while (i < matn.length) {
    const belgi = matn[i]

    if (OCHUVCHI.includes(belgi)) {
      const [ich, keyingi] = guruhniOqi(matn, i + 1, true)
      const [karra, oxiri] = sonniOqi(matn, keyingi)
      qoshish(atomlar, ich, karra)
      i = oxiri
      continue
    }

    if (YOPUVCHI.includes(belgi)) {
      if (!qavsIchida) throw new BalansXatosi(`Ortiqcha yopuvchi qavs: "${belgi}"`)
      return [atomlar, i + 1]
    }

    if (belgi === '*') {
      // Gidrat: CuSO₄*5H₂O — qolgan qismi koeffitsient bilan qo'shiladi
      const [karra, keyingi] = sonniOqi(matn, i + 1)
      const [qolgan, oxiri] = guruhniOqi(matn, keyingi, qavsIchida)
      qoshish(atomlar, qolgan, karra)
      i = oxiri
      continue
    }

    if (belgi >= 'A' && belgi <= 'Z') {
      const keyingiBelgi = matn[i + 1]
      const ikkiHarfli =
        keyingiBelgi >= 'a' && keyingiBelgi <= 'z' ? belgi + keyingiBelgi : null

      let symbol
      if (ikkiHarfli && ELEMENTLAR.has(ikkiHarfli)) {
        symbol = ikkiHarfli
        i += 2
      } else if (ikkiHarfli) {
        throw new BalansXatosi(`"${ikkiHarfli}" degan element yo'q`)
      } else if (ELEMENTLAR.has(belgi)) {
        symbol = belgi
        i += 1
      } else {
        throw new BalansXatosi(`"${belgi}" degan element yo'q`)
      }

      const [soni, keyingi] = sonniOqi(matn, i)
      atomlar[symbol] = (atomlar[symbol] ?? 0) + soni
      i = keyingi
      continue
    }

    if (belgi === ' ') {
      i++
      continue
    }

    throw new BalansXatosi(`Formulada tushunarsiz belgi: "${belgi}"`)
  }

  if (qavsIchida) throw new BalansXatosi('Qavs yopilmagan')
  return [atomlar, i]
}

/**
 * Bitta a'zoni o'qiydi: "2Na₂SO₄" -> koeffitsient 2, atomlar {Na:2,S:1,O:4}
 *
 * @returns {{ koeffitsient: number, formula: string, atomlar: Record<string,number>, zaryad: number }}
 */
export function azoniOqi(xom) {
  const tayyor = holatniTashla(tayyorla(xom)).trim()
  if (!tayyor) throw new BalansXatosi("A'zo bo'sh")

  const [tana, zaryad] = zaryadniAjrat(tayyor)

  // Oldidagi koeffitsient
  const [koeffitsient, boshlanish] = sonniOqi(tana, 0)
  const [atomlar] = guruhniOqi(tana, boshlanish, false)

  if (Object.keys(atomlar).length === 0) {
    throw new BalansXatosi(`"${xom}" da element topilmadi`)
  }

  const natija = {}
  qoshish(natija, atomlar, koeffitsient)

  return {
    koeffitsient,
    formula: tana.slice(boshlanish),
    atomlar: natija,
    zaryad: zaryad * koeffitsient,
  }
}

/** Tenglamaning bir tomonini o'qiydi */
function tomonniOqi(matn) {
  const azolar = matn
    .split(/\s+\+\s+/)
    .map((a) => a.trim())
    .filter(Boolean)

  if (azolar.length === 0) throw new BalansXatosi("Tenglama tomoni bo'sh")

  const atomlar = {}
  let zaryad = 0
  const formulalar = []

  for (const xom of azolar) {
    const azo = azoniOqi(xom)
    qoshish(atomlar, azo.atomlar, 1)
    zaryad += azo.zaryad
    formulalar.push(xom.trim())
  }

  return { atomlar, zaryad, formulalar }
}

/**
 * Reaksiya tenglamasini tekshiradi.
 *
 * @param {string} tenglama — "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O"
 * @returns {{
 *   muvozanatli: boolean,
 *   xato: string|null,
 *   farqlar: {element: string, chap: number, ong: number}[],
 *   zaryad: {chap: number, ong: number},
 *   chap: Record<string, number>,
 *   ong: Record<string, number>,
 * }}
 */
export function balansTekshir(tenglama) {
  const bosh = {
    muvozanatli: false,
    xato: null,
    farqlar: [],
    zaryad: { chap: 0, ong: 0 },
    chap: {},
    ong: {},
  }

  if (!tenglama || !String(tenglama).trim()) {
    return { ...bosh, xato: 'Tenglama kiritilmagan' }
  }

  const bolaklar = String(tenglama).split(STRELKA)
  // split strelkani ham qaytaradi: [chap, strelka, o'ng]
  const tomonlar = bolaklar.filter((_, i) => i % 2 === 0)

  if (tomonlar.length !== 2) {
    return {
      ...bosh,
      xato:
        tomonlar.length < 2
          ? 'Reaksiya strelkasi (→ yoki ⇌) topilmadi'
          : 'Tenglamada bir nechta strelka bor',
    }
  }

  let chap
  let ong
  try {
    chap = tomonniOqi(tomonlar[0])
    ong = tomonniOqi(tomonlar[1])
  } catch (xato) {
    if (xato instanceof BalansXatosi) return { ...bosh, xato: xato.message }
    throw xato
  }

  const elementlar = new Set([...Object.keys(chap.atomlar), ...Object.keys(ong.atomlar)])
  const farqlar = []

  for (const element of [...elementlar].sort()) {
    const chapSoni = chap.atomlar[element] ?? 0
    const ongSoni = ong.atomlar[element] ?? 0
    if (chapSoni !== ongSoni) farqlar.push({ element, chap: chapSoni, ong: ongSoni })
  }

  const zaryadTeng = chap.zaryad === ong.zaryad

  return {
    muvozanatli: farqlar.length === 0 && zaryadTeng,
    xato: null,
    farqlar,
    zaryad: { chap: chap.zaryad, ong: ong.zaryad },
    chap: chap.atomlar,
    ong: ong.atomlar,
  }
}

/**
 * Tekshiruv natijasini odam o'qiydigan matnga aylantiradi.
 * Admin panelda va skriptlarda ishlatiladi.
 */
export function balansIzohi(natija) {
  if (natija.xato) return `Tenglamani o'qib bo'lmadi: ${natija.xato}`
  if (natija.muvozanatli) return 'Muvozanatli'

  const qismlar = natija.farqlar.map(
    (f) => `${f.element}: chapda ${f.chap}, o'ngda ${f.ong}`,
  )

  if (natija.zaryad.chap !== natija.zaryad.ong) {
    qismlar.push(`zaryad: chapda ${natija.zaryad.chap}, o'ngda ${natija.zaryad.ong}`)
  }

  return `Muvozanatsiz — ${qismlar.join('; ')}`
}
