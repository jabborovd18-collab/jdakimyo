import { randomInt } from 'node:crypto'
import { createRequire } from 'node:module'
import { aralashtir, ochHolat, ortachaMs, qisqaId, shifrlaHolat } from './oyin-token.js'

const NOMSPACE = 'sifat-detektiv/v1'
const VAQT_GRACE_MS = 1500
const DUEL_BLOK_MS = 1200

const RUXSAT_REJIMLAR = new Set(['yakka', 'duel-savol', 'duel-vaqt'])
const RUXSAT_DARAJALAR = new Set(['oson', 'orta', 'qiyin'])
const RUXSAT_VAQTLAR = new Set([120, 180, 240])

const require = createRequire(import.meta.url)
let SIFAT_KESH = null
function sifatBazasi() {
  if (!SIFAT_KESH) {
    SIFAT_KESH = require('../../data/reactions/sifat-reaksiyalar.js').reaksiyalar || []
  }
  return SIFAT_KESH
}

export const REAGENTLAR = [
  { id: 'AgNO3', formula: 'AgNO₃', nom: 'Kumush nitrat', rang: '#cbd5e1' },
  { id: 'BaCl2', formula: 'BaCl₂', nom: 'Bariy xlorid', rang: '#e2e8f0' },
  { id: 'NaOH', formula: 'NaOH', nom: 'Natriy gidroksid', rang: '#93c5fd' },
  { id: 'HCl', formula: 'HCl', nom: 'Xlorid kislota', rang: '#fca5a5' },
  { id: 'KSCN', formula: 'KSCN', nom: 'Kaliy rodanid', rang: '#fde68a' },
  { id: 'KI', formula: 'KI', nom: 'Kaliy yodid', rang: '#fef08a' },
  { id: 'FF', formula: 'Fenolftalein', nom: 'Indikator', rang: '#f472b6' },
]

const REAGENT_HARITA = Object.fromEntries(REAGENTLAR.map((r) => [r.id, r]))

const NAMUNALAR = [
  {
    id: 'NaCl',
    formula: 'NaCl',
    nom: 'Natriy xlorid',
    daraja: 'oson',
    boshRang: 'rgba(186, 230, 253, 0.28)',
    boshIzoh: 'Tiniq, rangsiz va hidsiz eritma',
    tenglamaRef: 'Ag⁺ + Cl⁻ → AgCl↓',
    sinovlar: {
      AgNO3: { turi: 'chokma', chokmaRang: '#f8fafc', suyuqlikRang: 'rgba(241, 245, 249, 0.45)', gaz: false, hid: 'Yo‘q', xulosa: 'Oq suzmasimon cho‘kma tushdi (kislotada erimaydi).' },
    },
  },
  {
    id: 'NaI',
    formula: 'NaI',
    nom: 'Natriy yodid',
    daraja: 'orta',
    boshRang: 'rgba(186, 230, 253, 0.28)',
    boshIzoh: 'Tiniq, rangsiz eritma',
    tenglamaRef: 'Ag⁺ + I⁻ → AgI↓',
    sinovlar: {
      AgNO3: { turi: 'chokma', chokmaRang: '#facc15', suyuqlikRang: 'rgba(254, 249, 195, 0.36)', gaz: false, hid: 'Yo‘q', xulosa: 'To‘q sariq cho‘kma tushdi.' },
    },
  },
  {
    id: 'Na2SO4',
    formula: 'Na₂SO₄',
    nom: 'Natriy sulfat',
    daraja: 'oson',
    boshRang: 'rgba(186, 230, 253, 0.28)',
    boshIzoh: 'Tiniq, rangsiz eritma',
    tenglamaRef: 'Ba²⁺ + SO₄²⁻ → BaSO₄↓',
    sinovlar: {
      BaCl2: { turi: 'chokma', chokmaRang: '#f1f5f9', suyuqlikRang: 'rgba(226, 232, 240, 0.45)', gaz: false, hid: 'Yo‘q', xulosa: 'Oq mayda kristall cho‘kma hosil bo‘ldi (HCl da erimaydi).' },
    },
  },
  {
    id: 'Na2CO3',
    formula: 'Na₂CO₃',
    nom: 'Natriy karbonat',
    daraja: 'oson',
    boshRang: 'rgba(186, 230, 253, 0.28)',
    boshIzoh: 'Tiniq, rangsiz eritma',
    tenglamaRef: 'CO₃²⁻ + 2H⁺ → H₂O + CO₂↑',
    sinovlar: {
      HCl: { turi: 'gaz', chokmaRang: null, suyuqlikRang: 'rgba(186, 230, 253, 0.34)', gaz: true, hid: 'Hidsiz', xulosa: 'Shiddatli pufakchalar bilan hidsiz gaz ajralib chiqdi.' },
      BaCl2: { turi: 'chokma', chokmaRang: '#e2e8f0', suyuqlikRang: 'rgba(226, 232, 240, 0.42)', gaz: false, hid: 'Yo‘q', xulosa: 'Oq cho‘kma tushdi.' },
      FF: { turi: 'rang', chokmaRang: null, suyuqlikRang: 'rgba(236, 72, 153, 0.56)', gaz: false, hid: 'Yo‘q', xulosa: 'Eritma pushti-malina rangga kirdi (ishqoriy gidroliz).' },
    },
  },
  {
    id: 'Na2SO3',
    formula: 'Na₂SO₃',
    nom: 'Natriy sulfit',
    daraja: 'qiyin',
    boshRang: 'rgba(186, 230, 253, 0.28)',
    boshIzoh: 'Tiniq, rangsiz eritma',
    tenglamaRef: 'SO₃²⁻ + 2H⁺ → SO₂↑ + H₂O',
    sinovlar: {
      HCl: { turi: 'gaz', chokmaRang: null, suyuqlikRang: 'rgba(186, 230, 253, 0.36)', gaz: true, hid: 'Kuygan gugurt hidi', xulosa: 'Kuygan gugurt hidli o‘tkir gaz pufakchalari ajraldi.' },
      BaCl2: { turi: 'chokma', chokmaRang: '#e2e8f0', suyuqlikRang: 'rgba(226, 232, 240, 0.42)', gaz: false, hid: 'Yo‘q', xulosa: 'Oq cho‘kma hosil bo‘ldi.' },
      FF: { turi: 'rang', chokmaRang: null, suyuqlikRang: 'rgba(244, 114, 182, 0.44)', gaz: false, hid: 'Yo‘q', xulosa: 'Eritma kuchsiz pushti tus oldi.' },
    },
  },
  {
    id: 'Na2S',
    formula: 'Na₂S',
    nom: 'Natriy sulfid',
    daraja: 'orta',
    boshRang: 'rgba(186, 230, 253, 0.3)',
    boshIzoh: 'Tiniq, rangsiz eritma',
    tenglamaRef: 'Na₂S + 2HCl → 2NaCl + H₂S↑',
    sinovlar: {
      HCl: { turi: 'gaz', chokmaRang: null, suyuqlikRang: 'rgba(186, 230, 253, 0.35)', gaz: true, hid: 'Chirigan tuxum hidi', xulosa: 'Chirigan tuxum hidli zaharli gaz pufakchalari chiqdi.' },
      AgNO3: { turi: 'chokma', chokmaRang: '#1e293b', suyuqlikRang: 'rgba(148, 163, 184, 0.35)', gaz: false, hid: 'Yo‘q', xulosa: 'Darhol qora cho‘kma tushdi.' },
      FF: { turi: 'rang', chokmaRang: null, suyuqlikRang: 'rgba(236, 72, 153, 0.56)', gaz: false, hid: 'Yo‘q', xulosa: 'Eritma to‘q pushti rangga bo‘yaldi.' },
    },
  },
  {
    id: 'CuSO4',
    formula: 'CuSO₄',
    nom: 'Mis (II) sulfat',
    daraja: 'oson',
    boshRang: 'rgba(56, 189, 248, 0.52)',
    boshIzoh: 'Tiniq havorang (zangori) eritma',
    tenglamaRef: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓',
    sinovlar: {
      NaOH: { turi: 'chokma', chokmaRang: '#0284c7', suyuqlikRang: 'rgba(56, 189, 248, 0.35)', gaz: false, hid: 'Yo‘q', xulosa: 'Quyuq zangori (ko‘k) cho‘kma hosil bo‘ldi.' },
      BaCl2: { turi: 'chokma', chokmaRang: '#f1f5f9', suyuqlikRang: 'rgba(56, 189, 248, 0.42)', gaz: false, hid: 'Yo‘q', xulosa: 'Oq cho‘kma (kislotada erimaydi) tushdi.' },
      KI: { turi: 'chokma', chokmaRang: '#fef08a', suyuqlikRang: 'rgba(180, 83, 9, 0.48)', gaz: false, hid: 'Yo‘q', xulosa: 'Yod ajralib eritma qo‘ng‘irlashdi va oq-sarg‘ish cho‘kma tushdi.' },
    },
  },
  {
    id: 'CuCl2',
    formula: 'CuCl₂',
    nom: 'Mis (II) xlorid',
    daraja: 'qiyin',
    boshRang: 'rgba(45, 212, 191, 0.48)',
    boshIzoh: 'Havorang-yashil eritma',
    tenglamaRef: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓',
    sinovlar: {
      NaOH: { turi: 'chokma', chokmaRang: '#0284c7', suyuqlikRang: 'rgba(45, 212, 191, 0.3)', gaz: false, hid: 'Yo‘q', xulosa: 'Zangori cho‘kma tushdi.' },
      AgNO3: { turi: 'chokma', chokmaRang: '#f8fafc', suyuqlikRang: 'rgba(56, 189, 248, 0.38)', gaz: false, hid: 'Yo‘q', xulosa: 'Oq suzmasimon cho‘kma hosil bo‘ldi.' },
    },
  },
  {
    id: 'FeCl3',
    formula: 'FeCl₃',
    nom: 'Temir (III) xlorid',
    daraja: 'oson',
    boshRang: 'rgba(245, 158, 11, 0.48)',
    boshIzoh: 'Sarg‘ish-qo‘ng‘ir eritma',
    tenglamaRef: 'Fe³⁺ + 3SCN⁻ → Fe(SCN)₃',
    sinovlar: {
      KSCN: { turi: 'rang', chokmaRang: null, suyuqlikRang: 'rgba(185, 28, 28, 0.82)', gaz: false, hid: 'Yo‘q', xulosa: 'Eritma bir zumda qon-qizil tusga kirdi!' },
      NaOH: { turi: 'chokma', chokmaRang: '#9a3412', suyuqlikRang: 'rgba(251, 191, 36, 0.3)', gaz: false, hid: 'Yo‘q', xulosa: 'Qizg‘ish-qo‘ng‘ir cho‘kma tushdi.' },
      AgNO3: { turi: 'chokma', chokmaRang: '#f8fafc', suyuqlikRang: 'rgba(245, 158, 11, 0.38)', gaz: false, hid: 'Yo‘q', xulosa: 'Oq suzmasimon cho‘kma hosil bo‘ldi.' },
    },
  },
  {
    id: 'FeSO4',
    formula: 'FeSO₄',
    nom: 'Temir (II) sulfat',
    daraja: 'orta',
    boshRang: 'rgba(74, 222, 128, 0.34)',
    boshIzoh: 'Och yashil tiniq eritma',
    tenglamaRef: 'Fe²⁺ + 2OH⁻ → Fe(OH)₂↓',
    sinovlar: {
      NaOH: { turi: 'chokma', chokmaRang: '#4d7c0f', suyuqlikRang: 'rgba(134, 239, 172, 0.3)', gaz: false, hid: 'Yo‘q', xulosa: 'Kir yashil cho‘kma tushdi (havoda asta qo‘ng‘irlashadi).' },
      BaCl2: { turi: 'chokma', chokmaRang: '#f1f5f9', suyuqlikRang: 'rgba(74, 222, 128, 0.3)', gaz: false, hid: 'Yo‘q', xulosa: 'Oq kristall cho‘kma hosil bo‘ldi.' },
    },
  },
  {
    id: 'PbNO3',
    formula: 'Pb(NO₃)₂',
    nom: 'Qo‘rg‘oshin (II) nitrat',
    daraja: 'orta',
    boshRang: 'rgba(186, 230, 253, 0.28)',
    boshIzoh: 'Tiniq, rangsiz og‘ir tuz eritmasi',
    tenglamaRef: 'Pb²⁺ + 2I⁻ → PbI₂↓',
    sinovlar: {
      KI: { turi: 'chokma', chokmaRang: '#facc15', suyuqlikRang: 'rgba(254, 240, 138, 0.34)', gaz: false, hid: 'Yo‘q', xulosa: 'Yorqin oltin-sariq cho‘kma tushdi!' },
      HCl: { turi: 'chokma', chokmaRang: '#f8fafc', suyuqlikRang: 'rgba(226, 232, 240, 0.42)', gaz: false, hid: 'Yo‘q', xulosa: 'Oq kristall cho‘kma tushdi.' },
      NaOH: { turi: 'chokma', chokmaRang: '#f8fafc', suyuqlikRang: 'rgba(226, 232, 240, 0.38)', gaz: false, hid: 'Yo‘q', xulosa: 'Oq amfoter cho‘kma hosil bo‘ldi.' },
    },
  },
  {
    id: 'NH4Cl',
    formula: 'NH₄Cl',
    nom: 'Ammoniy xlorid',
    daraja: 'qiyin',
    boshRang: 'rgba(186, 230, 253, 0.28)',
    boshIzoh: 'Tiniq, rangsiz eritma',
    tenglamaRef: 'NH₄⁺ + OH⁻ → NH₃↑ + H₂O',
    sinovlar: {
      NaOH: { turi: 'gaz', chokmaRang: null, suyuqlikRang: 'rgba(186, 230, 253, 0.34)', gaz: true, hid: 'O‘tkir nashatir (ammiak) hidi', xulosa: 'Qizdirilganda o‘tkir ammiak hidli gaz ajraldi (nam lakmusni ko‘kartiradi).' },
      AgNO3: { turi: 'chokma', chokmaRang: '#f8fafc', suyuqlikRang: 'rgba(226, 232, 240, 0.44)', gaz: false, hid: 'Yo‘q', xulosa: 'Oq suzmasimon cho‘kma hosil bo‘ldi.' },
    },
  },
]

const NAMUNA_HARITA = Object.fromEntries(NAMUNALAR.map((n) => [n.id, n]))

function namunaToplami(daraja) {
  if (daraja === 'oson') return NAMUNALAR.filter((n) => n.daraja === 'oson')
  if (daraja === 'orta') return NAMUNALAR.filter((n) => n.daraja !== 'qiyin')
  return NAMUNALAR
}

function namunaYarat(daraja, oxirgiId = null) {
  const toplam = namunaToplami(daraja)
  const nomzodlar = toplam.filter((n) => n.id !== oxirgiId)
  const maqsad = nomzodlar[randomInt(nomzodlar.length)]

  // O'xshash ko'rinishga ega chalg'ituvchi nomzodlarni birinchi navbatda qo'shamiz.
  const boshqalar = aralashtir(NAMUNALAR.filter((n) => n.id !== maqsad.id))
  const tanlovlar = aralashtir([maqsad, ...boshqalar.slice(0, 3)]).map((n) => ({
    id: n.id,
    formula: n.formula,
    nom: n.nom,
  }))

  return {
    namunaId: qisqaId(),
    togriId: maqsad.id,
    boshRang: maqsad.boshRang,
    boshIzoh: maqsad.boshIzoh,
    tanlovlar,
    sinovTarixi: [],
    ochilganVaqt: Date.now(),
  }
}

function ismTozala(matn, zaxira) {
  const toza = String(matn || '').trim().replace(/\s+/g, ' ').slice(0, 24)
  return toza || zaxira
}

function shifrla(holat) {
  return shifrlaHolat(holat, NOMSPACE)
}

function och(token) {
  return ochHolat(token, NOMSPACE)
}

function boshOyinchi(ism) {
  return {
    ism,
    ball: 0,
    togri: 0,
    xato: 0,
    seriya: 0,
    engUzunSeriya: 0,
    blokTugaydi: 0,
    vaqtlar: [],
  }
}

function ommaviyOyinchi(p) {
  return {
    ism: p.ism,
    ball: p.ball,
    togri: p.togri,
    xato: p.xato,
    seriya: p.seriya,
    engUzunSeriya: p.engUzunSeriya,
    blokTugaydi: p.blokTugaydi,
  }
}

function ommaviyNamuna(s) {
  if (!s) return null
  return {
    namunaId: s.namunaId,
    boshRang: s.boshRang,
    boshIzoh: s.boshIzoh,
    tanlovlar: s.tanlovlar,
    sinovTarixi: s.sinovTarixi,
  }
}

function yakunXisobot(holat) {
  const p1 = holat.p1
  const p2 = holat.p2
  let golib = 'p1'
  if (holat.rejim !== 'yakka') {
    if (p1.ball > p2.ball) golib = 'p1'
    else if (p2.ball > p1.ball) golib = 'p2'
    else golib = p1.togri >= p2.togri ? (p1.togri > p2.togri ? 'p1' : 'durang') : 'p2'
  }
  return {
    golib,
    p1: { ...ommaviyOyinchi(p1), ortachaVaqtMs: ortachaMs(p1.vaqtlar) },
    p2: holat.rejim === 'yakka' ? null : { ...ommaviyOyinchi(p2), ortachaVaqtMs: ortachaMs(p2.vaqtlar) },
  }
}

function javobHolati(holat, qoshimcha = {}) {
  const tugagan = Boolean(holat.tugagan)
  return {
    ok: true,
    token: shifrla(holat),
    tugagan,
    rejim: holat.rejim,
    daraja: holat.daraja,
    tugashVaqti: holat.tugashVaqti,
    reagentlar: REAGENTLAR,
    p1: ommaviyOyinchi(holat.p1),
    p2: holat.rejim === 'yakka' ? null : ommaviyOyinchi(holat.p2),
    umumiyNamuna: holat.rejim === 'duel-savol' ? ommaviyNamuna(holat.umumiyNamuna) : null,
    p1Namuna: holat.rejim !== 'duel-savol' ? ommaviyNamuna(holat.p1Namuna) : null,
    p2Namuna: holat.rejim === 'duel-vaqt' ? ommaviyNamuna(holat.p2Namuna) : null,
    natija: tugagan ? yakunXisobot(holat) : null,
    ...qoshimcha,
  }
}

export function sifatDetektivBoshla(sozlama = {}) {
  sifatBazasi()
  const rejim = RUXSAT_REJIMLAR.has(sozlama.rejim) ? sozlama.rejim : 'yakka'
  const daraja = RUXSAT_DARAJALAR.has(sozlama.daraja) ? sozlama.daraja : 'orta'
  const vaqtSoniya = RUXSAT_VAQTLAR.has(Number(sozlama.vaqtSoniya)) ? Number(sozlama.vaqtSoniya) : 180

  const p1 = boshOyinchi(ismTozala(sozlama.p1Ism, rejim === 'yakka' ? 'Detektiv' : '1-detektiv'))
  const p2 = boshOyinchi(ismTozala(sozlama.p2Ism, '2-detektiv'))
  const hozir = Date.now()

  const holat = {
    rejim,
    daraja,
    vaqtSoniya,
    tugashVaqti: hozir + vaqtSoniya * 1000,
    tugagan: false,
    p1,
    p2,
    umumiyNamuna: rejim === 'duel-savol' ? namunaYarat(daraja) : null,
    p1Namuna: rejim !== 'duel-savol' ? namunaYarat(daraja) : null,
    p2Namuna: rejim === 'duel-vaqt' ? namunaYarat(daraja) : null,
  }
  return javobHolati(holat)
}

export function sifatDetektivSinov({ token, oyinchi = 'p1', reagentId, namunaId }) {
  const holat = och(token)
  if (!holat) return { ok: false, status: 400, xato: 'Sessiya topilmadi yoki muddati tugagan.' }
  if (holat.tugagan) return javobHolati(holat)

  const hozir = Date.now()
  if (hozir > holat.tugashVaqti + VAQT_GRACE_MS) {
    holat.tugagan = true
    return javobHolati(holat, { yakunSabab: 'Laboratoriya tekshiruv vaqti yakunlandi.' })
  }

  const kalit = holat.rejim === 'yakka' ? 'p1' : oyinchi === 'p2' ? 'p2' : 'p1'
  const maydon = holat.rejim === 'duel-savol' ? 'umumiyNamuna' : kalit === 'p1' ? 'p1Namuna' : 'p2Namuna'
  const namuna = holat[maydon]
  if (!namuna || namuna.namunaId !== namunaId) {
    return javobHolati(holat, { natijaKod: 'eskirgan' })
  }

  const reagent = REAGENT_HARITA[reagentId]
  if (!reagent) return { ok: false, status: 400, xato: 'Noma’lum reagent.' }

  const mavjud = namuna.sinovTarixi.find(
    (t) => t.reagentId === reagentId && (holat.rejim !== 'duel-savol' || t.oyinchi === kalit),
  )
  if (mavjud) {
    return javobHolati(holat, { natijaKod: 'sinov', javobOyinchi: kalit, oxirgiKuzatuv: mavjud })
  }

  const haqiqiy = NAMUNA_HARITA[namuna.togriId]
  const taqvim = haqiqiy.sinovlar[reagentId]
  const kuzatuv = taqvim
    ? {
        reagentId,
        reagentFormula: reagent.formula,
        oyinchi: kalit,
        ...taqvim,
      }
    : {
        reagentId,
        reagentFormula: reagent.formula,
        oyinchi: kalit,
        turi: 'yoq',
        chokmaRang: null,
        suyuqlikRang: haqiqiy.boshRang,
        gaz: false,
        hid: 'Yo‘q',
        xulosa: `${reagent.formula} qo‘shilganda ko‘zga ko‘rinarli o‘zgarish kuzatilmadi.`,
      }

  namuna.sinovTarixi.push(kuzatuv)
  return javobHolati(holat, {
    natijaKod: taqvim ? 'reaksiya' : 'sinov',
    javobOyinchi: kalit,
    oxirgiKuzatuv: kuzatuv,
  })
}

export function sifatDetektivAniqla({ token, oyinchi = 'p1', tanlovId, namunaId }) {
  const holat = och(token)
  if (!holat) return { ok: false, status: 400, xato: 'Sessiya topilmadi yoki muddati tugagan.' }
  if (holat.tugagan) return javobHolati(holat)

  const hozir = Date.now()
  if (hozir > holat.tugashVaqti + VAQT_GRACE_MS) {
    holat.tugagan = true
    return javobHolati(holat, { yakunSabab: 'Laboratoriya tekshiruv vaqti yakunlandi.' })
  }

  const kalit = holat.rejim === 'yakka' ? 'p1' : oyinchi === 'p2' ? 'p2' : 'p1'
  const p = holat[kalit]
  if (p.blokTugaydi && hozir < p.blokTugaydi) {
    return javobHolati(holat, { natijaKod: 'blok' })
  }

  const maydon = holat.rejim === 'duel-savol' ? 'umumiyNamuna' : kalit === 'p1' ? 'p1Namuna' : 'p2Namuna'
  const namuna = holat[maydon]
  if (!namuna || namuna.namunaId !== namunaId) {
    return javobHolati(holat, { natijaKod: 'eskirgan' })
  }

  const haqiqiy = NAMUNA_HARITA[namuna.togriId]
  const bazaReaksiya = sifatBazasi().find((r) => r.equation === haqiqiy.tenglamaRef)

  if (tanlovId === namuna.togriId) {
    const sarfMs = Math.max(600, Math.min(45000, hozir - (namuna.ochilganVaqt || hozir)))
    const sinovSoni = holat.rejim === 'duel-savol'
      ? namuna.sinovTarixi.filter((s) => s.oyinchi === kalit).length
      : namuna.sinovTarixi.length

    p.togri += 1
    p.seriya += 1
    if (p.seriya > p.engUzunSeriya) p.engUzunSeriya = p.seriya

    let qoshilganBall = 45
    if (sinovSoni === 0) qoshilganBall = 25
    else if (sinovSoni <= 2) qoshilganBall = 65
    else qoshilganBall = Math.max(25, 55 - (sinovSoni - 2) * 8)

    qoshilganBall += Math.min(20, (p.seriya - 1) * 5)
    p.ball += qoshilganBall
    p.vaqtlar.push(sarfMs)
    if (holat.rejim === 'duel-savol') {
      holat.p1.blokTugaydi = 0
      holat.p2.blokTugaydi = 0
    }

    const tasdiq = `${haqiqiy.formula} (${haqiqiy.nom}) — ${bazaReaksiya?.equation || haqiqiy.tenglamaRef}`
    holat[maydon] = namunaYarat(holat.daraja, haqiqiy.id)
    return javobHolati(holat, {
      natijaKod: 'togri',
      javobOyinchi: kalit,
      qoshilganBall,
      tasdiqIzoh: tasdiq,
    })
  }

  p.xato += 1
  p.seriya = 0
  p.ball = Math.max(0, p.ball - 10)
  if (holat.rejim === 'duel-savol') {
    p.blokTugaydi = hozir + DUEL_BLOK_MS
  }

  return javobHolati(holat, {
    natijaKod: 'xato',
    javobOyinchi: kalit,
    xatoIzoh: 'Bu taxmin mos kelmadi (−10 ball). Yana bir reaktiv bilan tekshirib ko‘ring!',
  })
}

export function sifatDetektivTugat({ token }) {
  const holat = och(token)
  if (!holat) return { ok: false, status: 400, xato: 'Sessiya topilmadi.' }
  holat.tugagan = true
  return javobHolati(holat, { yakunSabab: 'Detektiv tahlili yakunlandi.' })
}
