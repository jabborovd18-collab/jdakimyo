import { randomInt } from 'node:crypto'
import { ELEMENT_BAZA } from './element-baza.js'
import { aralashtir, ochHolat, ortachaMs, qisqaId, shifrlaHolat } from './oyin-token.js'

const NOMSPACE = 'element-duel/v1'
const VAQT_GRACE_MS = 1500
const DUEL_BLOK_MS = 1200

const RUXSAT_REJIMLAR = new Set(['yakka', 'duel-savol', 'duel-vaqt'])
const RUXSAT_DARAJALAR = new Set(['oson', 'orta', 'qiyin', 'aralash'])
const RUXSAT_MAVZULAR = new Set(['barchasi', 'metall', 'metallmas'])
const RUXSAT_VAQTLAR = new Set([60, 90, 120])

const SAVOL_TURLARI = ['belgi', 'tartib', 'massa', 'oila', 'qobiq', 'guruh']
const BARCHA_OILALAR = [...new Set(ELEMENT_BAZA.map((e) => e.toifa))]
const BARCHA_GURUHLAR = [...new Set(ELEMENT_BAZA.map((e) => e.guruhNom))]

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

function elementToplami(daraja, mavzu = 'barchasi') {
  let royxat = ELEMENT_BAZA
  if (daraja === 'oson') royxat = royxat.filter((e) => e.daraja === 'oson')
  else if (daraja === 'orta') royxat = royxat.filter((e) => e.daraja !== 'qiyin')

  if (mavzu === 'metall') {
    const filtr = royxat.filter((e) => e.toifa.toLowerCase().includes('metall') && e.toifa !== 'Metallmas')
    if (filtr.length >= 6) return filtr
  } else if (mavzu === 'metallmas') {
    const filtr = royxat.filter((e) => !e.toifa.toLowerCase().includes('metall') || e.toifa === 'Metallmas')
    if (filtr.length >= 6) return filtr
  }
  return royxat
}

function yaqinElementlar(maqsad, soni = 3) {
  const boshqalar = ELEMENT_BAZA.filter((e) => e.belgi !== maqsad.belgi)
  const saralangan = [...boshqalar].sort((a, b) => {
    const aBall = Math.abs(a.z - maqsad.z) + (a.toifa === maqsad.toifa ? -6 : 0) + (a.belgi[0] === maqsad.belgi[0] ? -4 : 0)
    const bBall = Math.abs(b.z - maqsad.z) + (b.toifa === maqsad.toifa ? -6 : 0) + (b.belgi[0] === maqsad.belgi[0] ? -4 : 0)
    return aBall - bBall
  })
  return aralashtir(saralangan.slice(0, 8)).slice(0, soni)
}

function savolYarat(daraja, oxirgiBelgi = null, mavzu = 'barchasi') {
  const toplam = elementToplami(daraja, mavzu)
  const nomzodlar = toplam.filter((e) => e.belgi !== oxirgiBelgi)
  const el = nomzodlar[randomInt(nomzodlar.length)]
  const tur = SAVOL_TURLARI[randomInt(SAVOL_TURLARI.length)]
  const qiyinYashir = daraja === 'qiyin'

  let savolMatni = ''
  let yordamMatn = ''
  let variantlar = []
  let togri = ''
  let korinadiganBelgi = el.belgi
  let korinadiganZ = el.z
  let korinadiganNom = el.nom

  if (tur === 'belgi') {
    savolMatni = `${el.nom} elementining kimyoviy belgisi qaysi?`
    yordamMatn = `${el.davr}-davr (${el.qator}-qator) · ${el.guruhNom} guruhcha · Ar ≈ ${el.yaxlitMassa}`
    korinadiganBelgi = '?'
    togri = el.belgi
    const chalg = yaqinElementlar(el, 3).map((x) => x.belgi)
    variantlar = aralashtir([togri, ...chalg])
  } else if (tur === 'tartib') {
    savolMatni = `${el.nom} (${el.belgi}) elementining tartib raqami (Z) nechaga teng?`
    yordamMatn = qiyinYashir ? `${el.davr}-davr · ${el.guruhNom} · ${el.toifa}` : `Elektron qobiqlar: ${el.elektronMatn}`
    korinadiganZ = '?'
    togri = String(el.z)
    const chalg = yaqinElementlar(el, 3).map((x) => String(x.z))
    variantlar = aralashtir([togri, ...chalg])
  } else if (tur === 'massa') {
    savolMatni = `${el.nom} (${el.belgi}) ning yaxlitlangan nisbiy atom massasi (Ar) qaysi?`
    yordamMatn = `Z = ${el.z} · ${el.guruhNom} · ${el.toifa}`
    togri = String(el.yaxlitMassa)
    const chalgSet = new Set([togri])
    const yaqin = yaqinElementlar(el, 8)
    for (const x of yaqin) {
      if (chalgSet.size >= 4) break
      chalgSet.add(String(x.yaxlitMassa))
    }
    while (chalgSet.size < 4) {
      chalgSet.add(String(Math.max(1, el.yaxlitMassa + randomInt(3, 18))))
    }
    variantlar = aralashtir([...chalgSet])
  } else if (tur === 'oila') {
    savolMatni = `${el.nom} (${el.belgi}) qaysi kimyoviy oilaga kiradi?`
    yordamMatn = `${el.davr}-davr · ${el.guruhNom} guruhcha · Z = ${el.z}`
    togri = el.toifa
    const chalg = aralashtir(BARCHA_OILALAR.filter((o) => o !== togri)).slice(0, 3)
    variantlar = aralashtir([togri, ...chalg])
  } else if (tur === 'guruh') {
    savolMatni = `${el.nom} (${el.belgi}) qisqa davriy jadvalning qaysi guruhchasiga kiradi?`
    yordamMatn = `${el.davr}-davr (${el.qator}-qator) · Z = ${el.z} · ${el.toifa}`
    togri = el.guruhNom
    const qarama = `${el.rimGuruh}${el.guruhcha === 'A' ? 'B' : 'A'}`
    const chalgSet = new Set([togri])
    if (BARCHA_GURUHLAR.includes(qarama)) chalgSet.add(qarama)
    for (const g of aralashtir(BARCHA_GURUHLAR)) {
      if (chalgSet.size >= 4) break
      chalgSet.add(g)
    }
    variantlar = aralashtir([...chalgSet])
  } else {
    savolMatni = `Qobiqlardagi elektronlar taqsimoti [${el.elektronMatn}] bo‘lgan element qaysi?`
    yordamMatn = qiyinYashir ? 'Elektron qobiqlar soni davrga teng!' : `${el.davr}-davr · ${el.guruhNom} guruhcha`
    korinadiganBelgi = '?'
    korinadiganNom = 'Noma’lum element'
    korinadiganZ = '?'
    togri = `${el.belgi} (${el.nom})`
    const chalg = yaqinElementlar(el, 3).map((x) => `${x.belgi} (${x.nom})`)
    variantlar = aralashtir([togri, ...chalg])
  }

  return {
    savolId: qisqaId(),
    tur,
    savolMatni,
    yordamMatn,
    variantlar,
    togri,
    ochilganVaqt: Date.now(),
    element: {
      z: el.z,
      belgi: el.belgi,
      nom: el.nom,
      davr: el.davr,
      qator: el.qator,
      guruh8: el.guruh8,
      guruhcha: el.guruhcha,
      guruhNom: el.guruhNom,
      toifa: el.toifa,
      qobiq: el.qobiq,
      massa: el.massa,
      izoh: el.izoh,
    },
    korinish: {
      z: korinadiganZ,
      belgi: korinadiganBelgi,
      nom: korinadiganNom,
      davr: el.davr,
      qator: el.qator,
      guruh8: tur === 'guruh' ? null : el.guruh8,
      guruhcha: tur === 'guruh' ? null : el.guruhcha,
      guruhNom: tur === 'guruh' ? '?' : el.guruhNom,
      toifa: tur === 'oila' ? 'Noma’lum oila' : el.toifa,
      qobiq: el.qobiq,
    },
  }
}

function boshOyinchi(ism) {
  return {
    ism,
    ball: 0,
    togri: 0,
    xato: 0,
    seriya: 0,
    engUzunSeriya: 0,
    yordamQoldi: 2,
    blokTugaydi: 0,
    vaqtlar: [],
    yashirilgan: [],
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
    yordamQoldi: p.yordamQoldi,
    blokTugaydi: p.blokTugaydi,
    yashirilgan: p.yashirilgan || [],
  }
}

function ommaviySavol(s) {
  if (!s) return null
  return {
    savolId: s.savolId,
    tur: s.tur,
    savolMatni: s.savolMatni,
    yordamMatn: s.yordamMatn,
    variantlar: s.variantlar,
    korinish: s.korinish,
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
    mavzu: holat.mavzu || 'barchasi',
    tugashVaqti: holat.tugashVaqti,
    p1: ommaviyOyinchi(holat.p1),
    p2: holat.rejim === 'yakka' ? null : ommaviyOyinchi(holat.p2),
    umumiySavol: holat.rejim === 'duel-savol' ? ommaviySavol(holat.umumiySavol) : null,
    p1Savol: holat.rejim !== 'duel-savol' ? ommaviySavol(holat.p1Savol) : null,
    p2Savol: holat.rejim === 'duel-vaqt' ? ommaviySavol(holat.p2Savol) : null,
    natija: tugagan ? yakunXisobot(holat) : null,
    ...qoshimcha,
  }
}

export function elementDuelBoshla(sozlama = {}) {
  const rejim = RUXSAT_REJIMLAR.has(sozlama.rejim) ? sozlama.rejim : 'yakka'
  const daraja = RUXSAT_DARAJALAR.has(sozlama.daraja) ? sozlama.daraja : 'orta'
  const mavzu = RUXSAT_MAVZULAR.has(sozlama.mavzu) ? sozlama.mavzu : 'barchasi'
  const vaqtSoniya = RUXSAT_VAQTLAR.has(Number(sozlama.vaqtSoniya)) ? Number(sozlama.vaqtSoniya) : 90
  const p1 = boshOyinchi(ismTozala(sozlama.p1Ism, rejim === 'yakka' ? 'Kimyogar' : '1-o‘yinchi'))
  const p2 = boshOyinchi(ismTozala(sozlama.p2Ism, '2-o‘yinchi'))
  const hozir = Date.now()

  const holat = {
    rejim,
    daraja,
    mavzu,
    vaqtSoniya,
    tugashVaqti: hozir + vaqtSoniya * 1000,
    tugagan: false,
    p1,
    p2,
    umumiySavol: rejim === 'duel-savol' ? savolYarat(daraja, null, mavzu) : null,
    p1Savol: rejim !== 'duel-savol' ? savolYarat(daraja, null, mavzu) : null,
    p2Savol: rejim === 'duel-vaqt' ? savolYarat(daraja, null, mavzu) : null,
  }
  return javobHolati(holat)
}

export function elementDuelJavob({ token, oyinchi = 'p1', javob, savolId }) {
  const holat = och(token)
  if (!holat) return { ok: false, status: 400, xato: 'O‘yin sessiyasi topilmadi yoki muddati tugagan.' }
  if (holat.tugagan) return javobHolati(holat)

  const hozir = Date.now()
  if (hozir > holat.tugashVaqti + VAQT_GRACE_MS) {
    holat.tugagan = true
    return javobHolati(holat, { yakunSabab: 'Ajratilgan vaqt yakunlandi.' })
  }

  const kalit = holat.rejim === 'yakka' ? 'p1' : oyinchi === 'p2' ? 'p2' : 'p1'
  const p = holat[kalit]
  if (p.blokTugaydi && hozir < p.blokTugaydi) {
    return javobHolati(holat, { echelon: 'blok', natijaKod: 'blok' })
  }

  const savolMaydoni =
    holat.rejim === 'duel-savol' ? 'umumiySavol' : kalit === 'p1' ? 'p1Savol' : 'p2Savol'
  const savol = holat[savolMaydoni]
  if (!savol || savol.savolId !== savolId) {
    return javobHolati(holat, { natijaKod: 'eskirgan' })
  }

  const sarfMs = Math.max(250, Math.min(25000, hozir - (savol.ochilganVaqt || hozir)))
  const togri = String(javob) === String(savol.togri)
  let qoshilganBall = 0

  if (togri) {
    p.togri += 1
    p.seriya += 1
    if (p.seriya > p.engUzunSeriya) p.engUzunSeriya = p.seriya
    const tezBonus = sarfMs <= 3500 ? 8 : 0
    qoshilganBall = 20 + Math.min(25, (p.seriya - 1) * 5) + tezBonus
    p.ball += qoshilganBall
    p.vaqtlar.push(sarfMs)
    p.yashirilgan = []
    if (holat.rejim === 'duel-savol') {
      holat.p1.yashirilgan = []
      holat.p2.yashirilgan = []
      holat.p1.blokTugaydi = 0
      holat.p2.blokTugaydi = 0
    }
    const izoh = {
      belgi: savol.element.belgi,
      nom: savol.element.nom,
      z: savol.element.z,
      massa: savol.element.massa,
      izoh: savol.element.izoh,
    }
    holat[savolMaydoni] = savolYarat(holat.daraja, savol.element.belgi, holat.mavzu || 'barchasi')
    return javobHolati(holat, {
      natijaKod: 'togri',
      javobOyinchi: kalit,
      qoshilganBall,
      elementIzoh: izoh,
    })
  }

  p.xato += 1
  p.seriya = 0
  p.ball = Math.max(0, p.ball - 5)
  if (holat.rejim === 'duel-savol') {
    p.blokTugaydi = hozir + DUEL_BLOK_MS
    return javobHolati(holat, {
      natijaKod: 'xato',
      javobOyinchi: kalit,
      xatoIzoh: `Noto‘g‘ri tanlov (-5 ball, ${(DUEL_BLOK_MS / 1000).toFixed(1)} s tanaffus).`,
    })
  }

  const togriJavob = savol.togri
  p.yashirilgan = []
  holat[savolMaydoni] = savolYarat(holat.daraja, savol.element.belgi, holat.mavzu || 'barchasi')
  return javobHolati(holat, {
    natijaKod: 'xato',
    javobOyinchi: kalit,
    xatoIzoh: `To‘g‘ri javob: ${togriJavob}. (${savol.element.izoh})`,
  })
}

export function elementDuelYordam({ token, oyinchi = 'p1' }) {
  const holat = och(token)
  if (!holat) return { ok: false, status: 400, xato: 'Sessiya topilmadi.' }
  if (holat.tugagan) return javobHolati(holat)

  const kalit = holat.rejim === 'yakka' ? 'p1' : oyinchi === 'p2' ? 'p2' : 'p1'
  const p = holat[kalit]
  if (p.yordamQoldi <= 0) {
    return { ok: false, status: 400, xato: '50/50 Skaner imkoniyati qolmadi.' }
  }

  const savol =
    holat.rejim === 'duel-savol' ? holat.umumiySavol : kalit === 'p1' ? holat.p1Savol : holat.p2Savol
  if (!savol || (p.yashirilgan && p.yashirilgan.length >= 2)) {
    return javobHolati(holat)
  }

  const xatolar = aralashtir(savol.variantlar.filter((v) => v !== savol.togri))
  p.yordamQoldi -= 1
  p.yashirilgan = xatolar.slice(0, 2)
  return javobHolati(holat, { natijaKod: 'yordam50', javobOyinchi: kalit })
}

export function elementDuelTugat({ token }) {
  const holat = och(token)
  if (!holat) return { ok: false, status: 400, xato: 'Sessiya topilmadi.' }
  holat.tugagan = true
  return javobHolati(holat, { yakunSabab: 'O‘yin yakunlandi.' })
}
