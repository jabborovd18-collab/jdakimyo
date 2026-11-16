import { createCipheriv, createDecipheriv, createHmac, randomBytes, randomInt } from 'node:crypto'
import { authMaxfiyKaliti } from './auth-maxfiy-kalit.js'
import { FORMULA_TOP_MODDALAR, formulaTopAudioNomi, formulaTopIshora } from '../data/formulani-top.js'

const VARIANTLAR_SONI = 24
const TOKEN_YAROQLILIK_MS = 90 * 60 * 1000
const KARTA_AMAL_MS = 6500
const BOMBA_AMAL_MS = 4800
const KARTA_GRACE_MS = 1800
const KOMBO_2X_MS = 16000
const TESKARI_MS = 11000
const TUMAN_MS = 6000
const MUZ_DUEL_MS = 3500
const MUZ_YAKKA_MS = 2500
const BLOK_MS = 1800
const TUZOQ_BLOK_MS = 2200
const QOSHIMCHA_VAQT_MS = 15000
const BOMBA_JARIMA_VAQT_MS = 10000
const VAQT_GRACE_MS = 1500

const RITM_ORALIQLARI = {
  sokin: { min: 7000, max: 13000, tezkorMin: 5000, tezkorMax: 8500 },
  orta: { min: 4000, max: 8800, tezkorMin: 3000, tezkorMax: 6200 },
  tez: { min: 2200, max: 5200, tezkorMin: 1800, tezkorMax: 3800 },
}

const RUXSAT_REJIMLAR = new Set(['yakka', 'duel-savol', 'duel-vaqt'])
const RUXSAT_KARTA_TARTIBI = new Set(['bir-xil', 'har-xil'])
const RUXSAT_SAVOLLAR_SONI = new Set([7, 10, 15])
const RUXSAT_VAQTLAR = new Set([0, 60, 90, 120])

export const KARTA_KALITLARI = [
  'kombo2x',
  'vaqt15',
  'yordam50',
  'qalqon',
  'sirli',
  'notogriBos',
  'muzlatish',
  'tuman',
  'aralashtir',
  'bomba',
]

function qisqaId() {
  return randomBytes(6).toString('base64url')
}

function kalit() {
  return createHmac('sha256', authMaxfiyKaliti()).update('formulani-top/v2').digest()
}

function shifrla(holat) {
  const nonce = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', kalit(), nonce)
  const tana = Buffer.concat([cipher.update(JSON.stringify(holat)), cipher.final()])
  // Savol javobi, seriya va tuzoq ma'lumotlari klientga ochiq chiqmasin.
  return Buffer.concat([nonce, cipher.getAuthTag(), tana]).toString('base64url')
}

function och(token) {
  if (typeof token !== 'string' || token.length > 32768) return null
  try {
    const baytlar = Buffer.from(token, 'base64url')
    const cipher = createDecipheriv('aes-256-gcm', kalit(), baytlar.subarray(0, 12))
    cipher.setAuthTag(baytlar.subarray(12, 28))
    const holat = JSON.parse(Buffer.concat([cipher.update(baytlar.subarray(28)), cipher.final()]))
    return Date.now() < holat.tokenTugaydi ? holat : null
  } catch {
    return null
  }
}

function aralashtir(royxat) {
  const nusxa = [...royxat]
  for (let i = nusxa.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1)
    const qiymat = nusxa[i]
    nusxa[i] = nusxa[j]
    nusxa[j] = qiymat
  }
  return nusxa
}

function ortachaMs(vaqtlar) {
  if (!Array.isArray(vaqtlar) || vaqtlar.length === 0) return null
  const jami = vaqtlar.reduce((s, v) => s + v, 0)
  return Math.round(jami / vaqtlar.length)
}

function sozlamaNormallashtir(kirish) {
  // Eski chaqiruvlar faqat raqam (1..4) yuborishi mumkin — moslik saqlanadi.
  const manba = typeof kirish === 'number' ? { daraja: kirish } : (kirish || {})
  const daraja = [1, 2, 3, 4, 5].includes(manba.daraja) ? manba.daraja : 1
  const rejim = RUXSAT_REJIMLAR.has(manba.rejim) ? manba.rejim : 'yakka'
  const savollarSoni = RUXSAT_SAVOLLAR_SONI.has(manba.savollarSoni) ? manba.savollarSoni : 7
  const kartaRitm = Object.hasOwn(RITM_ORALIQLARI, manba.kartaRitm) ? manba.kartaRitm : 'orta'
  let vaqtSekund = RUXSAT_VAQTLAR.has(manba.vaqtSekund) ? manba.vaqtSekund : 0
  if (rejim === 'duel-vaqt' && vaqtSekund === 0) {
    vaqtSekund = 90
  }

  const standartTartib = rejim === 'duel-vaqt' ? 'har-xil' : 'bir-xil'
  const duelKartaTartibi = RUXSAT_KARTA_TARTIBI.has(manba.duelKartaTartibi)
    ? manba.duelKartaTartibi
    : standartTartib

  const k = manba.kartalar || {}
  const kartalar = {
    kombo2x: Boolean(k.kombo2x),
    vaqt15: vaqtSekund > 0 && Boolean(k.vaqt15),
    yordam50: Boolean(k.yordam50),
    qalqon: Boolean(k.qalqon),
    sirli: Boolean(k.sirli),
    notogriBos: Boolean(k.notogriBos),
    muzlatish: Boolean(k.muzlatish),
    tuman: Boolean(k.tuman),
    aralashtir: Boolean(k.aralashtir),
    bomba: Boolean(k.bomba),
  }

  return { daraja, rejim, duelKartaTartibi, kartaRitm, savollarSoni, vaqtSekund, kartalar }
}

function darajaSavollari(daraja) {
  if (daraja !== 5) {
    return FORMULA_TOP_MODDALAR.flatMap((modda, moddaIdx) =>
      formulaTopIshora(modda, daraja) ? [{ moddaIdx, savolDaraja: daraja }] : []
    )
  }
  // Aralash rejimda barcha 4 darajadan tengroq ulush olinadi va bitta modda takrorlanmaydi.
  const guruhlar = [4, 3, 2, 1].map((d) =>
    aralashtir(
      FORMULA_TOP_MODDALAR.flatMap((modda, moddaIdx) =>
        formulaTopIshora(modda, d) ? [{ moddaIdx, savolDaraja: d }] : []
      )
    )
  )
  const natija = []
  const tanlanganModdalar = new Set()
  let qadam = 0
  while (guruhlar.some((g) => g.length > 0)) {
    const g = guruhlar[qadam % guruhlar.length]
    while (g.length > 0) {
      const nomzod = g.shift()
      if (!tanlanganModdalar.has(nomzod.moddaIdx)) {
        tanlanganModdalar.add(nomzod.moddaIdx)
        natija.push(nomzod)
        break
      }
    }
    qadam += 1
  }
  return natija
}

function savollarRoyxatiniTuz(daraja, miqdor) {
  const hammasi = aralashtir(darajaSavollari(daraja))
  return hammasi.slice(0, Math.min(miqdor, hammasi.length))
}

function variantlarniTuz(togriIdx, model) {
  const nomzodlar = FORMULA_TOP_MODDALAR.flatMap((modda, indeks) =>
    indeks !== togriIdx && (!model || modda.tuzilma) ? [indeks] : []
  )
  return aralashtir([togriIdx, ...aralashtir(nomzodlar).slice(0, VARIANTLAR_SONI - 1)])
    .map((indeks) => ({ indeks, id: qisqaId() }))
}

function variantKorinishi(variantlar, model) {
  return variantlar.map(({ indeks, id }) => ({
    id,
    ...(model
      ? { tuzilma: FORMULA_TOP_MODDALAR[indeks].tuzilma }
      : { formula: FORMULA_TOP_MODDALAR[indeks].formula }),
  }))
}

function yangiTaklif(kartalar, hozir, tezkor = false, ritm = 'orta') {
  const turlar = KARTA_KALITLARI.filter((t) => kartalar[t])
  if (turlar.length === 0) return null

  const oraliq = RITM_ORALIQLARI[ritm] || RITM_ORALIQLARI.orta
  const turi = turlar[randomInt(turlar.length)]
  const minKechikish = tezkor ? oraliq.tezkorMin : oraliq.min
  const maxKechikish = tezkor ? oraliq.tezkorMax : oraliq.max
  const paydoBoladi = hozir + randomInt(minKechikish, maxKechikish)
  const davom = turi === 'bomba' ? BOMBA_AMAL_MS : KARTA_AMAL_MS
  return {
    id: qisqaId(),
    turi,
    paydoBoladi,
    tugaydi: paydoBoladi + davom,
  }
}

function taklifKorinishi(taklif, hozir) {
  if (!taklif || hozir >= taklif.tugaydi) return null
  return {
    id: taklif.id,
    turi: taklif.turi,
    kechikishMs: Math.max(0, taklif.paydoBoladi - hozir),
    davomiylikMs: Math.max(500, taklif.tugaydi - Math.max(hozir, taklif.paydoBoladi)),
  }
}

function tuzoqJuftlikTuz(variantlar, togriIdx, ochirilganlar = []) {
  const ochirilganSet = new Set(ochirilganlar)
  const togri = variantlar.find((v) => v.indeks === togriIdx)
  const xatolar = variantlar.filter((v) => v.indeks !== togriIdx && !ochirilganSet.has(v.id))
  const nomzod = xatolar.length > 0 ? xatolar : variantlar.filter((v) => v.indeks !== togriIdx)
  const xato = nomzod[randomInt(nomzod.length)]
  return {
    togriId: togri.id,
    xatoId: xato.id,
    juftlik: aralashtir([togri.id, xato.id]),
  }
}

function yordam50Tuz(variantlar, togriIdx, mavjudOchir = [], teskariJuftlik = []) {
  const mavjudSet = new Set([...mavjudOchir, ...(teskariJuftlik || [])])
  const xatolar = aralashtir(
    variantlar.filter((v) => v.indeks !== togriIdx && !mavjudSet.has(v.id)).map((v) => v.id)
  )
  const kerak = Math.max(0, 12 - mavjudOchir.length)
  return [...mavjudOchir, ...xatolar.slice(0, kerak)]
}

function sirliNatijaTanla(vaqtBormi) {
  const nomzodlar = ['bonus3', 'kombo2x', 'yordam50', 'qalqon', 'tuman', 'aralashtir']
  if (vaqtBormi) nomzodlar.push('vaqt15')
  return nomzodlar[randomInt(nomzodlar.length)]
}

function yakkaJavobPayload(holat, hozir) {
  const joriy = holat.savollar[holat.indeks]
  const modda = FORMULA_TOP_MODDALAR[joriy.moddaIdx]
  const model = joriy.savolDaraja >= 3
  const qolganMs = holat.vaqtSekund > 0 ? Math.max(0, holat.vaqtTugaydi - hozir) : null
  const kombo2xQolganMs = Math.max(0, (holat.kombo2xTugaydi || 0) - hozir)
  const blokQolganMs = Math.max(0, (holat.blokTugaydi || 0) - hozir)
  const tumanQolganMs = Math.max(0, (holat.tumanTugaydi || 0) - hozir)
  const teskariFaol = holat.teskariHolat && hozir < holat.teskariHolat.tugaydi

  return {
    rejim: holat.rejim,
    daraja: holat.daraja,
    savolDaraja: joriy.savolDaraja,
    model,
    token: shifrla(holat),
    ishora: formulaTopIshora(modda, joriy.savolDaraja),
    audio: `/oyinlar/formulani-top/ovoz/${formulaTopAudioNomi(joriy.savolDaraja, joriy.moddaIdx)}`,
    tartib: holat.indeks + 1,
    jami: holat.cheksizNavbat ? null : holat.savollar.length,
    ball: holat.ball,
    seriya: holat.seriya,
    engUzunSeriya: holat.engUzunSeriya,
    togriSoni: holat.togriSoni,
    urinishlarSoni: holat.urinishlarSoni || 0,
    kartalarSoni: holat.kartalarSoni || 0,
    ortachaVaqtMs: ortachaMs(holat.javobVaqtlariMs),
    qalqon: Boolean(holat.qalqon),
    ochirilganlar: holat.ochirilganlar || [],
    vaqtSekund: holat.vaqtSekund,
    qolganMs,
    kombo2xQolganMs,
    blokQolganMs,
    tumanQolganMs,
    teskariJuftlik: teskariFaol ? holat.teskariHolat.juftlik : null,
    teskariQolganMs: teskariFaol ? Math.max(0, holat.teskariHolat.tugaydi - hozir) : 0,
    kartaTaklif: taklifKorinishi(holat.faolTaklif, hozir),
    variantlar: variantKorinishi(holat.variantlar, model),
  }
}

function duelOyinchiKorinishi(p, model, hozir, alohidaTaklif = false) {
  const kombo2xQolganMs = Math.max(0, (p.kombo2xTugaydi || 0) - hozir)
  const blokQolganMs = Math.max(0, (p.blokTugaydi || 0) - hozir)
  const tumanQolganMs = Math.max(0, (p.tumanTugaydi || 0) - hozir)
  const teskariFaol = p.teskariHolat && hozir < p.teskariHolat.tugaydi

  return {
    ball: p.ball,
    seriya: p.seriya,
    engUzunSeriya: p.engUzunSeriya,
    togriSoni: p.togriSoni,
    kartalarSoni: p.kartalarSoni || 0,
    ortachaVaqtMs: ortachaMs(p.javobVaqtlariMs),
    qalqon: Boolean(p.qalqon),
    ochirilganlar: p.ochirilganlar || [],
    kombo2xQolganMs,
    blokQolganMs,
    tumanQolganMs,
    teskariJuftlik: teskariFaol ? p.teskariHolat.juftlik : null,
    teskariQolganMs: teskariFaol ? Math.max(0, p.teskariHolat.tugaydi - hozir) : 0,
    ...(alohidaTaklif ? { kartaTaklif: taklifKorinishi(p.faolTaklif, hozir) } : {}),
    variantlar: variantKorinishi(p.variantlar, model),
  }
}

function duelSavolPayload(holat, hozir) {
  const joriy = holat.savollar[holat.indeks]
  const modda = FORMULA_TOP_MODDALAR[joriy.moddaIdx]
  const model = joriy.savolDaraja >= 3
  const qolganMs = holat.vaqtSekund > 0 ? Math.max(0, holat.vaqtTugaydi - hozir) : null
  const harXil = holat.duelKartaTartibi === 'har-xil'

  return {
    rejim: 'duel-savol',
    duelKartaTartibi: holat.duelKartaTartibi,
    daraja: holat.daraja,
    savolDaraja: joriy.savolDaraja,
    model,
    token: shifrla(holat),
    ishora: formulaTopIshora(modda, joriy.savolDaraja),
    audio: `/oyinlar/formulani-top/ovoz/${formulaTopAudioNomi(joriy.savolDaraja, joriy.moddaIdx)}`,
    tartib: holat.indeks + 1,
    jami: holat.savollar.length,
    vaqtSekund: holat.vaqtSekund,
    qolganMs,
    kartaTaklif: harXil ? null : taklifKorinishi(holat.faolTaklif, hozir),
    p1: duelOyinchiKorinishi(holat.p1, model, hozir, harXil),
    p2: duelOyinchiKorinishi(holat.p2, model, hozir, harXil),
  }
}

function yakkaOqimBoshla(sozlama, cheksizNavbat, hozir, boshTaklif = null) {
  const savollar = savollarRoyxatiniTuz(sozlama.daraja, cheksizNavbat ? 50 : sozlama.savollarSoni)
  if (savollar.length === 0) return null
  const birinchi = savollar[0]
  const model = birinchi.savolDaraja >= 3
  const holat = {
    turi: 'yakka-oqim',
    rejim: cheksizNavbat ? 'duel-vaqt' : 'yakka',
    cheksizNavbat,
    duelKartaTartibi: sozlama.duelKartaTartibi,
    kartaRitm: sozlama.kartaRitm,
    daraja: sozlama.daraja,
    savollar,
    indeks: 0,
    savolBoshlandi: hozir,
    javobVaqtlariMs: [],
    urinishlarSoni: 0,
    ball: 0,
    seriya: 0,
    engUzunSeriya: 0,
    togriSoni: 0,
    kartalarSoni: 0,
    qalqon: false,
    ochirilganlar: [],
    xatolar: [],
    kartalar: sozlama.kartalar,
    vaqtSekund: sozlama.vaqtSekund,
    vaqtTugaydi: sozlama.vaqtSekund > 0 ? hozir + sozlama.vaqtSekund * 1000 : 0,
    tokenTugaydi: hozir + TOKEN_YAROQLILIK_MS,
    kombo2xTugaydi: 0,
    blokTugaydi: 0,
    tumanTugaydi: 0,
    pauzaBoshlandi: 0,
    teskariHolat: null,
    qabulNoncelar: [],
    faolTaklif: boshTaklif ?? yangiTaklif(sozlama.kartalar, hozir, true, sozlama.kartaRitm),
    variantlar: variantlarniTuz(birinchi.moddaIdx, model),
  }
  return yakkaJavobPayload(holat, hozir)
}

export function oyinniBoshla(kirish) {
  const sozlama = sozlamaNormallashtir(kirish)
  const hozir = Date.now()

  if (sozlama.rejim === 'yakka') {
    return yakkaOqimBoshla(sozlama, false, hozir)
  }

  if (sozlama.rejim === 'duel-vaqt') {
    const birXilTaklif =
      sozlama.duelKartaTartibi === 'bir-xil'
        ? yangiTaklif(sozlama.kartalar, hozir, true, sozlama.kartaRitm)
        : null
    const p1 = yakkaOqimBoshla(sozlama, true, hozir, birXilTaklif)
    const p2 = yakkaOqimBoshla(sozlama, true, hozir, birXilTaklif)
    if (!p1 || !p2) return null
    return {
      rejim: 'duel-vaqt',
      duelKartaTartibi: sozlama.duelKartaTartibi,
      daraja: sozlama.daraja,
      vaqtSekund: sozlama.vaqtSekund,
      p1,
      p2,
    }
  }

  const savollar = savollarRoyxatiniTuz(sozlama.daraja, sozlama.savollarSoni)
  if (savollar.length === 0) return null
  const birinchi = savollar[0]
  const model = birinchi.savolDaraja >= 3
  const harXil = sozlama.duelKartaTartibi === 'har-xil'

  const boshOyinchi = () => ({
    ball: 0,
    seriya: 0,
    engUzunSeriya: 0,
    togriSoni: 0,
    kartalarSoni: 0,
    javobVaqtlariMs: [],
    qalqon: false,
    ochirilganlar: [],
    kombo2xTugaydi: 0,
    blokTugaydi: 0,
    tumanTugaydi: 0,
    teskariHolat: null,
    faolTaklif: harXil ? yangiTaklif(sozlama.kartalar, hozir, true, sozlama.kartaRitm) : null,
    variantlar: variantlarniTuz(birinchi.moddaIdx, model),
  })

  const holat = {
    turi: 'duel-savol',
    rejim: 'duel-savol',
    duelKartaTartibi: sozlama.duelKartaTartibi,
    kartaRitm: sozlama.kartaRitm,
    daraja: sozlama.daraja,
    savollar,
    indeks: 0,
    savolBoshlandi: hozir,
    xatolar: [],
    kartalar: sozlama.kartalar,
    vaqtSekund: sozlama.vaqtSekund,
    vaqtTugaydi: sozlama.vaqtSekund > 0 ? hozir + sozlama.vaqtSekund * 1000 : 0,
    tokenTugaydi: hozir + TOKEN_YAROQLILIK_MS,
    pauzaBoshlandi: 0,
    faolTaklif: harXil ? null : yangiTaklif(sozlama.kartalar, hozir, true, sozlama.kartaRitm),
    p1: boshOyinchi(),
    p2: boshOyinchi(),
  }

  return duelSavolPayload(holat, hozir)
}

function vaqtTugadimi(holat, hozir) {
  return holat.vaqtSekund > 0 && hozir > holat.vaqtTugaydi + VAQT_GRACE_MS
}

function keyingiSavolgaOt(holat, hozir) {
  let indeks = holat.indeks + 1
  let savollar = holat.savollar

  if (indeks >= savollar.length) {
    if (!holat.cheksizNavbat) return null
    savollar = aralashtir(darajaSavollari(holat.daraja))
    indeks = 0
  }

  const keyingiSavol = savollar[indeks]
  const model = keyingiSavol.savolDaraja >= 3
  const yangiTaklifHolati = (!holat.faolTaklif || hozir >= holat.faolTaklif.tugaydi)
    ? yangiTaklif(holat.kartalar, hozir, false, holat.kartaRitm)
    : holat.faolTaklif

  return {
    ...holat,
    savollar,
    indeks,
    savolBoshlandi: hozir,
    ochirilganlar: [],
    faolTaklif: yangiTaklifHolati,
    teskariHolat: null,
    variantlar: variantlarniTuz(keyingiSavol.moddaIdx, model),
  }
}

function yakkaOqimJavob(holat, tanlov, hozir) {
  if (holat.pauzaBoshlandi) return null
  if (vaqtTugadimi(holat, hozir)) {
    return {
      vaqtTugadi: true,
      ball: holat.ball,
      togriSoni: holat.togriSoni,
      urinishlarSoni: holat.urinishlarSoni || 0,
      engUzunSeriya: holat.engUzunSeriya,
      kartalarSoni: holat.kartalarSoni || 0,
      ortachaVaqtMs: ortachaMs(holat.javobVaqtlariMs),
      xatolar: holat.xatolar,
      keyingi: null,
    }
  }

  if (hozir < (holat.blokTugaydi || 0) && tanlov !== null) {
    return {
      blokda: true,
      blokQolganMs: holat.blokTugaydi - hozir,
      token: shifrla(holat),
    }
  }

  const joriy = holat.savollar[holat.indeks]
  const modda = FORMULA_TOP_MODDALAR[joriy.moddaIdx]
  const javob = { nom: modda.nom, formula: modda.formula, trivial: modda.trivial }
  const togriId = holat.variantlar.find((v) => v.indeks === joriy.moddaIdx).id
  const ketganMs = Math.max(100, hozir - (holat.savolBoshlandi || hozir))

  const teskariFaol = holat.teskariHolat && hozir < holat.teskariHolat.tugaydi
  if (teskariFaol && tanlov !== null) {
    if (!holat.teskariHolat.juftlik.includes(tanlov)) {
      const bor = holat.variantlar.some((v) => v.id === tanlov)
      if (!bor) return null
      return {
        tuzoqKutilyapti: true,
        token: shifrla(holat),
        teskariJuftlik: holat.teskariHolat.juftlik,
        teskariQolganMs: Math.max(0, holat.teskariHolat.tugaydi - hozir),
      }
    }
    const yutdimi = tanlov === holat.teskariHolat.xatoId
    const qalqonIshladi = !yutdimi && holat.qalqon
    const kombo2xFaol = hozir < (holat.kombo2xTugaydi || 0)
    const seriya = yutdimi ? holat.seriya + 1 : (qalqonIshladi ? holat.seriya : 0)
    const engUzunSeriya = Math.max(holat.engUzunSeriya, seriya)
    const qoshilgan = yutdimi ? 2 * (kombo2xFaol ? 2 : 1) : 0
    const ball = holat.ball + qoshilgan
    const togriSoni = holat.togriSoni + Number(yutdimi)
    const urinishlarSoni = (holat.urinishlarSoni || 0) + 1
    const javobVaqtlariMs = [...(holat.javobVaqtlariMs || []), ketganMs]
    const xatolar = (yutdimi || qalqonIshladi) ? holat.xatolar : [...holat.xatolar, javob]
    const yangiHolat = keyingiSavolgaOt(
      { ...holat, ball, seriya, engUzunSeriya, togriSoni, urinishlarSoni, javobVaqtlariMs, xatolar, qalqon: qalqonIshladi ? false : holat.qalqon },
      hozir
    )

    return {
      javob,
      togrimi: yutdimi,
      qalqonIshladi,
      teskariNatija: yutdimi ? 'bajarildi' : 'tuzoqqa-tushdi',
      qoshilganBall: qoshilgan,
      togriId,
      manba: joriy.savolDaraja === 4 ? modda.tarix?.manba || null : null,
      ball,
      seriya,
      engUzunSeriya,
      togriSoni,
      urinishlarSoni,
      kartalarSoni: holat.kartalarSoni || 0,
      ortachaVaqtMs: ortachaMs(javobVaqtlariMs),
      qalqon: qalqonIshladi ? false : Boolean(holat.qalqon),
      xatolar,
      keyingi: yangiHolat ? yakkaJavobPayload(yangiHolat, hozir) : null,
    }
  }

  const tanlangan = holat.variantlar.find(({ id }) => id === tanlov)
  if (tanlov !== null && !tanlangan) return null

  const togrimi = tanlangan?.indeks === joriy.moddaIdx
  if (!togrimi && tanlov !== null && holat.qalqon) {
    const yangiOchir = holat.ochirilganlar?.includes(tanlov)
      ? holat.ochirilganlar
      : [...(holat.ochirilganlar || []), tanlov]
    const yangiHolat = { ...holat, qalqon: false, ochirilganlar: yangiOchir }
    return {
      qalqonIshladi: true,
      qalqon: false,
      ochirilganlar: yangiOchir,
      token: shifrla(yangiHolat),
    }
  }

  const kombo2xFaol = hozir < (holat.kombo2xTugaydi || 0)
  const seriya = togrimi ? holat.seriya + 1 : 0
  const engUzunSeriya = Math.max(holat.engUzunSeriya, seriya)
  const asosBall = togrimi ? 1 + (seriya >= 3 ? 1 : 0) : 0
  const qoshilgan = asosBall * (kombo2xFaol ? 2 : 1)
  const ball = holat.ball + qoshilgan
  const togriSoni = holat.togriSoni + Number(togrimi)
  const urinishlarSoni = (holat.urinishlarSoni || 0) + 1
  const javobVaqtlariMs = togrimi ? [...(holat.javobVaqtlariMs || []), ketganMs] : (holat.javobVaqtlariMs || [])
  const xatolar = togrimi ? holat.xatolar : [...holat.xatolar, javob]

  const yangiHolat = keyingiSavolgaOt(
    { ...holat, ball, seriya, engUzunSeriya, togriSoni, urinishlarSoni, javobVaqtlariMs, xatolar },
    hozir
  )

  return {
    javob,
    togrimi,
    qoshilganBall: qoshilgan,
    togriId,
    manba: joriy.savolDaraja === 4 ? modda.tarix?.manba || null : null,
    ball,
    seriya,
    engUzunSeriya,
    togriSoni,
    urinishlarSoni,
    kartalarSoni: holat.kartalarSoni || 0,
    ortachaVaqtMs: ortachaMs(javobVaqtlariMs),
    qalqon: Boolean(holat.qalqon),
    xatolar,
    keyingi: yangiHolat ? yakkaJavobPayload(yangiHolat, hozir) : null,
  }
}

function duelSavolKeyingi(holat, hozir) {
  const indeks = holat.indeks + 1
  if (indeks >= holat.savollar.length) return null
  const keyingiSavol = holat.savollar[indeks]
  const model = keyingiSavol.savolDaraja >= 3
  const harXil = holat.duelKartaTartibi === 'har-xil'
  const yangiTaklifHolati = !harXil && (!holat.faolTaklif || hozir >= holat.faolTaklif.tugaydi)
    ? yangiTaklif(holat.kartalar, hozir, false, holat.kartaRitm)
    : holat.faolTaklif

  const tozalabBer = (p) => ({
    ...p,
    blokTugaydi: 0,
    teskariHolat: null,
    ochirilganlar: [],
    faolTaklif: harXil && (!p.faolTaklif || hozir >= p.faolTaklif.tugaydi)
      ? yangiTaklif(holat.kartalar, hozir, false, holat.kartaRitm)
      : p.faolTaklif,
    variantlar: variantlarniTuz(keyingiSavol.moddaIdx, model),
  })

  return {
    ...holat,
    indeks,
    savolBoshlandi: hozir,
    faolTaklif: yangiTaklifHolati,
    p1: tozalabBer(holat.p1),
    p2: tozalabBer(holat.p2),
  }
}

function duelSavolJavob(holat, oyinchi, tanlov, hozir) {
  if (holat.pauzaBoshlandi) return null
  if (vaqtTugadimi(holat, hozir)) {
    return {
      vaqtTugadi: true,
      halQilindi: true,
      p1: duelOyinchiKorinishi(holat.p1, false, hozir),
      p2: duelOyinchiKorinishi(holat.p2, false, hozir),
      xatolar: holat.xatolar,
      keyingi: null,
    }
  }

  const joriy = holat.savollar[holat.indeks]
  const modda = FORMULA_TOP_MODDALAR[joriy.moddaIdx]
  const javob = { nom: modda.nom, formula: modda.formula, trivial: modda.trivial }
  const model = joriy.savolDaraja >= 3
  const harXil = holat.duelKartaTartibi === 'har-xil'
  const togriId1 = holat.p1.variantlar.find((v) => v.indeks === joriy.moddaIdx).id
  const togriId2 = holat.p2.variantlar.find((v) => v.indeks === joriy.moddaIdx).id

  if (oyinchi === 0 && tanlov === null) {
    const xatolar = [...holat.xatolar, javob]
    const yangiHolat = duelSavolKeyingi({ ...holat, xatolar }, hozir)
    return {
      halQilindi: true,
      otkazildi: true,
      golib: 0,
      javob,
      togriId1,
      togriId2,
      manba: joriy.savolDaraja === 4 ? modda.tarix?.manba || null : null,
      xatolar,
      p1: duelOyinchiKorinishi(holat.p1, model, hozir, harXil),
      p2: duelOyinchiKorinishi(holat.p2, model, hozir, harXil),
      keyingi: yangiHolat ? duelSavolPayload(yangiHolat, hozir) : null,
    }
  }

  if (oyinchi !== 1 && oyinchi !== 2) return null
  const kalitNom = oyinchi === 1 ? 'p1' : 'p2'
  const oyinchiHolat = holat[kalitNom]

  if (hozir < (oyinchiHolat.blokTugaydi || 0)) {
    return {
      halQilindi: false,
      blokda: true,
      oyinchi,
      blokQolganMs: oyinchiHolat.blokTugaydi - hozir,
      token: shifrla(holat),
    }
  }

  const teskariFaol = oyinchiHolat.teskariHolat && hozir < oyinchiHolat.teskariHolat.tugaydi
  if (teskariFaol && tanlov !== null) {
    if (!oyinchiHolat.teskariHolat.juftlik.includes(tanlov)) {
      const bor = oyinchiHolat.variantlar.some((v) => v.id === tanlov)
      if (!bor) return null
      return {
        halQilindi: false,
        tuzoqKutilyapti: true,
        oyinchi,
        token: shifrla(holat),
        p1: duelOyinchiKorinishi(holat.p1, model, hozir, harXil),
        p2: duelOyinchiKorinishi(holat.p2, model, hozir, harXil),
      }
    }
    const yechdimi = tanlov === oyinchiHolat.teskariHolat.xatoId
    const qalqonIshladi = !yechdimi && oyinchiHolat.qalqon
    const yangiOyinchi = yechdimi || qalqonIshladi
      ? { ...oyinchiHolat, teskariHolat: null, qalqon: qalqonIshladi ? false : oyinchiHolat.qalqon }
      : {
          ...oyinchiHolat,
          ball: Math.max(0, oyinchiHolat.ball - 1),
          seriya: 0,
          blokTugaydi: hozir + TUZOQ_BLOK_MS,
          teskariHolat: null,
        }
    const yangiHolat = { ...holat, [kalitNom]: yangiOyinchi }
    return {
      halQilindi: false,
      tuzoqYechimi: yechdimi ? 'qutuldi' : (qalqonIshladi ? 'qalqon' : 'tushdi'),
      oyinchi,
      token: shifrla(yangiHolat),
      p1: duelOyinchiKorinishi(yangiHolat.p1, model, hozir, harXil),
      p2: duelOyinchiKorinishi(yangiHolat.p2, model, hozir, harXil),
    }
  }

  const tanlangan = oyinchiHolat.variantlar.find(({ id }) => id === tanlov)
  if (!tanlangan) return null

  const togrimi = tanlangan.indeks === joriy.moddaIdx
  if (togrimi) {
    const ketganMs = Math.max(100, hozir - (holat.savolBoshlandi || hozir))
    const kombo2xFaol = hozir < (oyinchiHolat.kombo2xTugaydi || 0)
    const seriya = oyinchiHolat.seriya + 1
    const qoshilgan = (1 + (seriya >= 3 ? 1 : 0)) * (kombo2xFaol ? 2 : 1)
    const yangiOyinchi = {
      ...oyinchiHolat,
      ball: oyinchiHolat.ball + qoshilgan,
      seriya,
      engUzunSeriya: Math.max(oyinchiHolat.engUzunSeriya, seriya),
      togriSoni: oyinchiHolat.togriSoni + 1,
      javobVaqtlariMs: [...(oyinchiHolat.javobVaqtlariMs || []), ketganMs],
    }
    const yangiHolat = duelSavolKeyingi({ ...holat, [kalitNom]: yangiOyinchi }, hozir)
    return {
      halQilindi: true,
      golib: oyinchi,
      qoshilganBall: qoshilgan,
      javob,
      togriId1,
      togriId2,
      manba: joriy.savolDaraja === 4 ? modda.tarix?.manba || null : null,
      xatolar: holat.xatolar,
      p1: duelOyinchiKorinishi(oyinchi === 1 ? yangiOyinchi : holat.p1, model, hozir, harXil),
      p2: duelOyinchiKorinishi(oyinchi === 2 ? yangiOyinchi : holat.p2, model, hozir, harXil),
      keyingi: yangiHolat ? duelSavolPayload(yangiHolat, hozir) : null,
    }
  }

  if (oyinchiHolat.qalqon) {
    const yangiOchir = oyinchiHolat.ochirilganlar?.includes(tanlov)
      ? oyinchiHolat.ochirilganlar
      : [...(oyinchiHolat.ochirilganlar || []), tanlov]
    const yangiOyinchi = { ...oyinchiHolat, qalqon: false, ochirilganlar: yangiOchir }
    const yangiHolat = { ...holat, [kalitNom]: yangiOyinchi }
    return {
      halQilindi: false,
      qalqonIshladi: true,
      oyinchi,
      token: shifrla(yangiHolat),
      p1: duelOyinchiKorinishi(yangiHolat.p1, model, hozir, harXil),
      p2: duelOyinchiKorinishi(yangiHolat.p2, model, hozir, harXil),
    }
  }

  const yangiOyinchi = {
    ...oyinchiHolat,
    seriya: 0,
    blokTugaydi: hozir + BLOK_MS,
  }
  const yangiHolat = { ...holat, [kalitNom]: yangiOyinchi }
  return {
    halQilindi: false,
    xatoOyinchi: oyinchi,
    xatoKartaId: tanlov,
    token: shifrla(yangiHolat),
    p1: duelOyinchiKorinishi(yangiHolat.p1, model, hozir, harXil),
    p2: duelOyinchiKorinishi(yangiHolat.p2, model, hozir, harXil),
  }
}

export function javobniBaho(token, tanlov, qoshimcha = {}) {
  const holat = och(token)
  if (!holat) return null
  const hozir = Date.now()
  if (holat.turi === 'yakka-oqim') {
    return yakkaOqimJavob(holat, tanlov, hozir)
  }
  if (holat.turi === 'duel-savol') {
    return duelSavolJavob(holat, qoshimcha.oyinchi ?? 0, tanlov, hozir)
  }
  return null
}

function bombaQolla(holat, hozir) {
  if (holat.qalqon) {
    return { qalqonHimoya: true, qalqon: false, ball: holat.ball, seriya: holat.seriya, vaqtTugaydi: holat.vaqtTugaydi }
  }
  const ball = Math.max(0, holat.ball - 1)
  const vaqtTugaydi = holat.vaqtSekund > 0
    ? Math.max(hozir + 1000, holat.vaqtTugaydi - BOMBA_JARIMA_VAQT_MS)
    : holat.vaqtTugaydi
  return { qalqonHimoya: false, qalqon: false, ball, seriya: 0, vaqtTugaydi }
}

function yakkaKartaBosish(holat, kartaId, hozir) {
  const taklif = holat.faolTaklif
  if (!taklif || taklif.id !== kartaId) {
    return { qabul: false, sabab: 'eskirgan', token: shifrla(holat) }
  }
  if (hozir < taklif.paydoBoladi - 500 || hozir > taklif.tugaydi + KARTA_GRACE_MS) {
    return { qabul: false, sabab: 'vaqt-otdi', token: shifrla(holat) }
  }

  const joriy = holat.savollar[holat.indeks]
  const model = joriy.savolDaraja >= 3
  let yangi = {
    ...holat,
    kartalarSoni: (holat.kartalarSoni || 0) + (taklif.turi === 'bomba' ? 0 : 1),
    faolTaklif: yangiTaklif(holat.kartalar, hozir, false, holat.kartaRitm),
  }
  let raqibTuzoqToken = null
  let qalqonHimoya = false
  let zararsizlantirildi = false
  let sirliNatija = null

  const amaliyTuri = taklif.turi === 'sirli'
    ? (sirliNatija = sirliNatijaTanla(holat.vaqtSekund > 0))
    : taklif.turi

  if (amaliyTuri === 'bonus3') {
    yangi.ball = holat.ball + 3
  } else if (amaliyTuri === 'kombo2x') {
    yangi.kombo2xTugaydi = Math.max(hozir, holat.kombo2xTugaydi || 0) + KOMBO_2X_MS
  } else if (amaliyTuri === 'vaqt15' && holat.vaqtSekund > 0) {
    yangi.vaqtTugaydi = Math.max(hozir, holat.vaqtTugaydi) + QOSHIMCHA_VAQT_MS
  } else if (amaliyTuri === 'yordam50') {
    yangi.ochirilganlar = yordam50Tuz(
      holat.variantlar,
      joriy.moddaIdx,
      holat.ochirilganlar || [],
      holat.teskariHolat?.juftlik
    )
  } else if (amaliyTuri === 'qalqon') {
    yangi.qalqon = true
  } else if (amaliyTuri === 'bomba') {
    const nat = bombaQolla(holat, hozir)
    qalqonHimoya = nat.qalqonHimoya
    yangi.qalqon = nat.qalqon
    yangi.ball = nat.ball
    yangi.seriya = nat.seriya
    yangi.vaqtTugaydi = nat.vaqtTugaydi
  } else if (['notogriBos', 'muzlatish', 'tuman', 'aralashtir'].includes(amaliyTuri)) {
    if (holat.cheksizNavbat) {
      raqibTuzoqToken = shifrla({
        turi: 'raqib-hujum',
        hujumTuri: amaliyTuri,
        nonce: qisqaId(),
        tokenTugaydi: hozir + 15000,
      })
    } else if (taklif.turi === 'sirli') {
      if (holat.qalqon) {
        yangi.qalqon = false
        qalqonHimoya = true
      } else if (amaliyTuri === 'tuman') {
        yangi.tumanTugaydi = Math.max(hozir, holat.tumanTugaydi || 0) + TUMAN_MS
      } else if (amaliyTuri === 'aralashtir') {
        yangi.variantlar = aralashtir(holat.variantlar)
      }
    } else if (amaliyTuri === 'notogriBos') {
      const juftlik = tuzoqJuftlikTuz(holat.variantlar, joriy.moddaIdx, holat.ochirilganlar)
      yangi.teskariHolat = { ...juftlik, tugaydi: hozir + TESKARI_MS }
    } else {
      zararsizlantirildi = true
    }
  }

  const teskariFaol = yangi.teskariHolat && hozir < yangi.teskariHolat.tugaydi
  return {
    qabul: true,
    turi: taklif.turi,
    sirliNatija,
    qalqonHimoya,
    zararsizlantirildi,
    token: shifrla(yangi),
    ball: yangi.ball,
    seriya: yangi.seriya,
    qalqon: Boolean(yangi.qalqon),
    ochirilganlar: yangi.ochirilganlar || [],
    qolganMs: yangi.vaqtSekund > 0 ? Math.max(0, yangi.vaqtTugaydi - hozir) : null,
    kombo2xQolganMs: Math.max(0, (yangi.kombo2xTugaydi || 0) - hozir),
    blokQolganMs: Math.max(0, (yangi.blokTugaydi || 0) - hozir),
    tumanQolganMs: Math.max(0, (yangi.tumanTugaydi || 0) - hozir),
    teskariJuftlik: teskariFaol ? yangi.teskariHolat.juftlik : null,
    teskariQolganMs: teskariFaol ? Math.max(0, yangi.teskariHolat.tugaydi - hozir) : 0,
    raqibTuzoqToken,
    kartaTaklif: taklifKorinishi(yangi.faolTaklif, hozir),
    variantlar: variantKorinishi(yangi.variantlar, model),
  }
}

function duelSavolKartaBosish(holat, oyinchi, kartaId, hozir) {
  if (oyinchi !== 1 && oyinchi !== 2) return null
  const harXil = holat.duelKartaTartibi === 'har-xil'
  const kalitNom = oyinchi === 1 ? 'p1' : 'p2'
  const raqibKalit = oyinchi === 1 ? 'p2' : 'p1'
  const taklif = harXil ? holat[kalitNom].faolTaklif : holat.faolTaklif

  if (!taklif || taklif.id !== kartaId) {
    return { qabul: false, sabab: 'olib-ketildi', token: shifrla(holat) }
  }
  if (hozir < taklif.paydoBoladi - 500 || hozir > taklif.tugaydi + KARTA_GRACE_MS) {
    return { qabul: false, sabab: 'vaqt-otdi', token: shifrla(holat) }
  }

  const joriy = holat.savollar[holat.indeks]
  const model = joriy.savolDaraja >= 3
  let ozHolat = {
    ...holat[kalitNom],
    kartalarSoni: (holat[kalitNom].kartalarSoni || 0) + (taklif.turi === 'bomba' ? 0 : 1),
    ...(harXil ? { faolTaklif: yangiTaklif(holat.kartalar, hozir, false, holat.kartaRitm) } : {}),
  }
  let raqibHolat = { ...holat[raqibKalit] }
  let vaqtTugaydi = holat.vaqtTugaydi
  let qalqonHimoya = false
  let sirliNatija = null

  const amaliyTuri = taklif.turi === 'sirli'
    ? (sirliNatija = sirliNatijaTanla(holat.vaqtSekund > 0))
    : taklif.turi

  if (amaliyTuri === 'bonus3') {
    ozHolat.ball += 3
  } else if (amaliyTuri === 'kombo2x') {
    ozHolat.kombo2xTugaydi = Math.max(hozir, ozHolat.kombo2xTugaydi || 0) + KOMBO_2X_MS
  } else if (amaliyTuri === 'vaqt15' && holat.vaqtSekund > 0) {
    vaqtTugaydi = Math.max(hozir, vaqtTugaydi) + QOSHIMCHA_VAQT_MS
  } else if (amaliyTuri === 'yordam50') {
    ozHolat.ochirilganlar = yordam50Tuz(
      ozHolat.variantlar,
      joriy.moddaIdx,
      ozHolat.ochirilganlar || [],
      ozHolat.teskariHolat?.juftlik
    )
  } else if (amaliyTuri === 'qalqon') {
    ozHolat.qalqon = true
  } else if (amaliyTuri === 'bomba') {
    if (ozHolat.qalqon) {
      ozHolat.qalqon = false
      qalqonHimoya = true
    } else {
      ozHolat.ball = Math.max(0, ozHolat.ball - 1)
      ozHolat.seriya = 0
    }
  } else if (['notogriBos', 'muzlatish', 'tuman', 'aralashtir'].includes(amaliyTuri)) {
    if (raqibHolat.qalqon) {
      raqibHolat.qalqon = false
      qalqonHimoya = true
    } else if (amaliyTuri === 'notogriBos') {
      const juftlik = tuzoqJuftlikTuz(raqibHolat.variantlar, joriy.moddaIdx, raqibHolat.ochirilganlar)
      raqibHolat.teskariHolat = { ...juftlik, tugaydi: hozir + TESKARI_MS }
    } else if (amaliyTuri === 'muzlatish') {
      raqibHolat.blokTugaydi = Math.max(hozir, raqibHolat.blokTugaydi || 0) + MUZ_DUEL_MS
    } else if (amaliyTuri === 'tuman') {
      raqibHolat.tumanTugaydi = Math.max(hozir, raqibHolat.tumanTugaydi || 0) + TUMAN_MS
    } else if (amaliyTuri === 'aralashtir') {
      raqibHolat.variantlar = aralashtir(raqibHolat.variantlar)
    }
  }

  const yangiHolat = {
    ...holat,
    vaqtTugaydi,
    faolTaklif: harXil ? null : yangiTaklif(holat.kartalar, hozir, false, holat.kartaRitm),
    [kalitNom]: ozHolat,
    [raqibKalit]: raqibHolat,
  }

  return {
    qabul: true,
    turi: taklif.turi,
    sirliNatija,
    oyinchi,
    qalqonHimoya,
    token: shifrla(yangiHolat),
    qolganMs: yangiHolat.vaqtSekund > 0 ? Math.max(0, yangiHolat.vaqtTugaydi - hozir) : null,
    p1: duelOyinchiKorinishi(yangiHolat.p1, model, hozir, harXil),
    p2: duelOyinchiKorinishi(yangiHolat.p2, model, hozir, harXil),
    kartaTaklif: harXil ? null : taklifKorinishi(yangiHolat.faolTaklif, hozir),
  }
}

function yakkaKartaMuddatiOtgan(holat, kartaId, hozir) {
  const taklif = holat.faolTaklif
  if (!taklif || taklif.id !== kartaId) {
    return { qollandi: false, token: shifrla(holat), kartaTaklif: taklifKorinishi(taklif, hozir) }
  }
  if (hozir < taklif.tugaydi - 400) {
    return { qollandi: false, token: shifrla(holat), kartaTaklif: taklifKorinishi(taklif, hozir) }
  }

  const joriy = holat.savollar[holat.indeks]
  const model = joriy.savolDaraja >= 3
  let yangi = {
    ...holat,
    faolTaklif: yangiTaklif(holat.kartalar, hozir, false, holat.kartaRitm),
  }
  let qollandiTuri = null
  let qalqonHimoya = false

  if (!holat.cheksizNavbat && ['muzlatish', 'tuman', 'aralashtir'].includes(taklif.turi)) {
    if (holat.qalqon) {
      yangi.qalqon = false
      qalqonHimoya = true
    } else {
      qollandiTuri = taklif.turi
      if (taklif.turi === 'muzlatish') {
        yangi.blokTugaydi = Math.max(hozir, holat.blokTugaydi || 0) + MUZ_YAKKA_MS
      } else if (taklif.turi === 'tuman') {
        yangi.tumanTugaydi = Math.max(hozir, holat.tumanTugaydi || 0) + TUMAN_MS
      } else if (taklif.turi === 'aralashtir') {
        yangi.variantlar = aralashtir(holat.variantlar)
      }
    }
  }

  return {
    qollandi: Boolean(qollandiTuri),
    qollandiTuri,
    qalqonHimoya,
    qalqon: Boolean(yangi.qalqon),
    token: shifrla(yangi),
    blokQolganMs: Math.max(0, (yangi.blokTugaydi || 0) - hozir),
    tumanQolganMs: Math.max(0, (yangi.tumanTugaydi || 0) - hozir),
    kartaTaklif: taklifKorinishi(yangi.faolTaklif, hozir),
    variantlar: variantKorinishi(yangi.variantlar, model),
  }
}

export function kartaAmali(token, amal, qoshimcha = {}) {
  const holat = och(token)
  if (!holat) return null
  const hozir = Date.now()

  if (amal === 'karta') {
    if (holat.pauzaBoshlandi) return null
    if (holat.turi === 'yakka-oqim') return yakkaKartaBosish(holat, qoshimcha.kartaId, hozir)
    if (holat.turi === 'duel-savol') return duelSavolKartaBosish(holat, qoshimcha.oyinchi, qoshimcha.kartaId, hozir)
    return null
  }

  if (amal === 'karta-muddat' && holat.turi === 'yakka-oqim') {
    if (holat.pauzaBoshlandi) return null
    return yakkaKartaMuddatiOtgan(holat, qoshimcha.kartaId, hozir)
  }

  if (amal === 'karta-bekor' && holat.turi === 'yakka-oqim') {
    const yangiTaklifHolati = yangiTaklif(holat.kartalar, hozir, false, holat.kartaRitm)
    const yangiHolat = { ...holat, faolTaklif: yangiTaklifHolati }
    return {
      token: shifrla(yangiHolat),
      kartaTaklif: taklifKorinishi(yangiTaklifHolati, hozir),
    }
  }

  if (amal === 'karta-yangi') {
    if (holat.pauzaBoshlandi) return null
    if (holat.turi === 'duel-savol' && holat.duelKartaTartibi === 'har-xil') {
      const yangiP = (p) => {
        const faol = p.faolTaklif && hozir < p.faolTaklif.tugaydi
        return faol ? p : { ...p, faolTaklif: yangiTaklif(holat.kartalar, hozir, false, holat.kartaRitm) }
      }
      const p1 = yangiP(holat.p1)
      const p2 = yangiP(holat.p2)
      const yangiHolat = { ...holat, p1, p2 }
      const model = holat.savollar[holat.indeks].savolDaraja >= 3
      return {
        token: shifrla(yangiHolat),
        p1: duelOyinchiKorinishi(p1, model, hozir, true),
        p2: duelOyinchiKorinishi(p2, model, hozir, true),
      }
    }

    const joriyFaol = holat.faolTaklif && hozir < holat.faolTaklif.tugaydi
    const yangiHolat = joriyFaol
      ? holat
      : { ...holat, faolTaklif: yangiTaklif(holat.kartalar, hozir, false, holat.kartaRitm) }
    return {
      token: shifrla(yangiHolat),
      kartaTaklif: taklifKorinishi(yangiHolat.faolTaklif, hozir),
    }
  }

  if (amal === 'tuzoq-qabul' && holat.turi === 'yakka-oqim') {
    const tuzoq = och(qoshimcha.tuzoqToken)
    if (!tuzoq || (tuzoq.turi !== 'raqib-hujum' && tuzoq.turi !== 'raqib-tuzoq')) return null
    if (holat.qabulNoncelar?.includes(tuzoq.nonce)) return null

    const joriy = holat.savollar[holat.indeks]
    const model = joriy.savolDaraja >= 3
    const hujumTuri = tuzoq.hujumTuri || 'notogriBos'
    let yangi = {
      ...holat,
      qabulNoncelar: [...(holat.qabulNoncelar || []).slice(-12), tuzoq.nonce],
    }
    let qalqonHimoya = false

    if (holat.qalqon) {
      yangi.qalqon = false
      qalqonHimoya = true
    } else if (hujumTuri === 'notogriBos') {
      const juftlik = tuzoqJuftlikTuz(holat.variantlar, joriy.moddaIdx, holat.ochirilganlar)
      yangi.teskariHolat = { ...juftlik, tugaydi: hozir + TESKARI_MS }
    } else if (hujumTuri === 'muzlatish') {
      yangi.blokTugaydi = Math.max(hozir, holat.blokTugaydi || 0) + MUZ_DUEL_MS
    } else if (hujumTuri === 'tuman') {
      yangi.tumanTugaydi = Math.max(hozir, holat.tumanTugaydi || 0) + TUMAN_MS
    } else if (hujumTuri === 'aralashtir') {
      yangi.variantlar = aralashtir(holat.variantlar)
    }

    const teskariFaol = yangi.teskariHolat && hozir < yangi.teskariHolat.tugaydi
    return {
      token: shifrla(yangi),
      hujumTuri,
      qalqonHimoya,
      qalqon: Boolean(yangi.qalqon),
      blokQolganMs: Math.max(0, (yangi.blokTugaydi || 0) - hozir),
      tumanQolganMs: Math.max(0, (yangi.tumanTugaydi || 0) - hozir),
      teskariJuftlik: teskariFaol ? yangi.teskariHolat.juftlik : null,
      teskariQolganMs: teskariFaol ? Math.max(0, yangi.teskariHolat.tugaydi - hozir) : 0,
      variantlar: variantKorinishi(yangi.variantlar, model),
    }
  }

  if (amal === 'pauza') {
    if (holat.pauzaBoshlandi) return { token: shifrla(holat) }
    return { token: shifrla({ ...holat, pauzaBoshlandi: hozir }) }
  }

  if (amal === 'davom') {
    if (!holat.pauzaBoshlandi) return { token: shifrla(holat) }
    const delta = Math.min(Math.max(0, hozir - holat.pauzaBoshlandi), 30 * 60 * 1000)
    const siljit = (ts) => (ts && ts > 0 ? ts + delta : ts)
    const taklifSiljit = (t) =>
      t ? { ...t, paydoBoladi: t.paydoBoladi + delta, tugaydi: t.tugaydi + delta } : null

    let yangiHolat = {
      ...holat,
      pauzaBoshlandi: 0,
      savolBoshlandi: siljit(holat.savolBoshlandi),
      vaqtTugaydi: siljit(holat.vaqtTugaydi),
      faolTaklif: taklifSiljit(holat.faolTaklif),
    }

    if (holat.turi === 'yakka-oqim') {
      yangiHolat = {
        ...yangiHolat,
        kombo2xTugaydi: siljit(holat.kombo2xTugaydi),
        blokTugaydi: siljit(holat.blokTugaydi),
        tumanTugaydi: siljit(holat.tumanTugaydi),
        teskariHolat: holat.teskariHolat
          ? { ...holat.teskariHolat, tugaydi: siljit(holat.teskariHolat.tugaydi) }
          : null,
      }
    } else if (holat.turi === 'duel-savol') {
      const oyinchiSiljit = (p) => ({
        ...p,
        kombo2xTugaydi: siljit(p.kombo2xTugaydi),
        blokTugaydi: siljit(p.blokTugaydi),
        tumanTugaydi: siljit(p.tumanTugaydi),
        faolTaklif: taklifSiljit(p.faolTaklif),
        teskariHolat: p.teskariHolat
          ? { ...p.teskariHolat, tugaydi: siljit(p.teskariHolat.tugaydi) }
          : null,
      })
      yangiHolat = {
        ...yangiHolat,
        p1: oyinchiSiljit(holat.p1),
        p2: oyinchiSiljit(holat.p2),
      }
    }

    const harXil = yangiHolat.turi === 'duel-savol' && yangiHolat.duelKartaTartibi === 'har-xil'
    const model = yangiHolat.savollar[yangiHolat.indeks].savolDaraja >= 3
    return {
      token: shifrla(yangiHolat),
      qolganMs: yangiHolat.vaqtSekund > 0 ? Math.max(0, yangiHolat.vaqtTugaydi - hozir) : null,
      kartaTaklif: harXil ? null : taklifKorinishi(yangiHolat.faolTaklif, hozir),
      ...(yangiHolat.turi === 'duel-savol'
        ? {
            p1: duelOyinchiKorinishi(yangiHolat.p1, model, hozir, harXil),
            p2: duelOyinchiKorinishi(yangiHolat.p2, model, hozir, harXil),
          }
        : {}),
    }
  }

  if (amal === 'tugat') {
    if (holat.turi === 'yakka-oqim') {
      return {
        vaqtTugadi: true,
        ball: holat.ball,
        togriSoni: holat.togriSoni,
        urinishlarSoni: holat.urinishlarSoni || 0,
        engUzunSeriya: holat.engUzunSeriya,
        kartalarSoni: holat.kartalarSoni || 0,
        ortachaVaqtMs: ortachaMs(holat.javobVaqtlariMs),
        xatolar: holat.xatolar,
      }
    }
    if (holat.turi === 'duel-savol') {
      return {
        vaqtTugadi: true,
        p1: duelOyinchiKorinishi(holat.p1, false, hozir),
        p2: duelOyinchiKorinishi(holat.p2, false, hozir),
        p1Kartalar: holat.p1.kartalarSoni || 0,
        p2Kartalar: holat.p2.kartalarSoni || 0,
        xatolar: holat.xatolar,
      }
    }
  }

  return null
}
