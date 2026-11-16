import { randomInt } from 'node:crypto'
import { createRequire } from 'node:module'
import { azoniOqi, balansTekshir } from '../chem-balance.js'
import { ochHolat, ortachaMs, qisqaId, shifrlaHolat } from './oyin-token.js'

const NOMSPACE = 'reaksiya-balans/v1'
const VAQT_GRACE_MS = 1500
const DUEL_BLOK_MS = 1200

const RUXSAT_REJIMLAR = new Set(['yakka', 'duel-savol', 'duel-vaqt'])
const RUXSAT_DARAJALAR = new Set(['oson', 'orta', 'qiyin', 'aralash'])
const RUXSAT_VAQTLAR = new Set([90, 120, 180])

const require = createRequire(import.meta.url)

function ekub(a, b) {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

function ekubRoyxat(sonlar) {
  return sonlar.reduce((acc, s) => ekub(acc, s), sonlar[0] || 1)
}

function bittaQismTahlil(xom) {
  const toza = xom.trim()
  const ajratilgan = toza.match(/^(\d+)\s*(.+)$/)
  const koeff = ajratilgan ? Number(ajratilgan[1]) : 1
  const formula = ajratilgan ? ajratilgan[2].trim() : toza
  const bitta = azoniOqi(formula)
  return {
    formula,
    togriKoeff: koeff,
    atomlar: bitta.atomlar,
  }
}

let KESH_REAKSIYALAR = null

function balansBazaniOl() {
  if (KESH_REAKSIYALAR) return KESH_REAKSIYALAR

  const xom = require('../../data/reactions/index.js').barchaReaksiyalar()
  const tayyor = []

  for (const r of xom) {
    const tenglama = r?.equation
    if (!tenglama || /[⁺⁻\[\]]/.test(tenglama) || /\bn\b/.test(tenglama)) continue
    if (!balansTekshir(tenglama).muvozanatli) continue

    const bolaklar = tenglama.split(/\s*(→|⇌)\s*/)
    if (bolaklar.length !== 3) continue

    try {
      const chap = bolaklar[0].split(/\s+\+\s+/).map(bittaQismTahlil)
      const ong = bolaklar[2].split(/\s+\+\s+/).map(bittaQismTahlil)
      if (chap.length === 0 || ong.length === 0 || chap.length > 4 || ong.length > 4) continue

      const koefflar = [...chap, ...ong].map((q) => q.togriKoeff)
      const maxK = Math.max(...koefflar)
      if (maxK < 2 || maxK > 18) continue

      const qismSoni = chap.length + ong.length
      let daraja = 'oson'
      if (maxK >= 4 || qismSoni >= 5 || r.category === 'Redoks') daraja = 'qiyin'
      else if (maxK >= 3 || qismSoni >= 5) daraja = 'orta'

      tayyor.push({
        tenglama,
        nom: r.name || 'Kimyoviy reaksiya',
        toifa: r.category || 'Umumiy kimyo',
        izoh: r.description || '',
        strelka: bolaklar[1],
        chap,
        ong,
        maxK,
        daraja,
      })
    } catch {
      // Koeffitsientga mos kelmaydigan maxsus yozuvlar o'tkazib yuboriladi.
    }
  }

  KESH_REAKSIYALAR = tayyor
  return KESH_REAKSIYALAR
}

function reaksiyaToplami(daraja) {
  const hammasi = balansBazaniOl()
  if (daraja === 'oson') return hammasi.filter((r) => r.daraja === 'oson')
  if (daraja === 'orta') return hammasi.filter((r) => r.maxK <= 6)
  if (daraja === 'qiyin') return hammasi.filter((r) => r.daraja === 'qiyin' || r.maxK >= 3)
  return hammasi
}

function savolYarat(daraja, oxirgiTenglama = null) {
  const toplam = reaksiyaToplami(daraja)
  const nomzodlar = toplam.filter((r) => r.tenglama !== oxirgiTenglama)
  const tanlov = (nomzodlar.length > 0 ? nomzodlar : toplam)[randomInt(Math.max(1, nomzodlar.length || toplam.length))]
  return {
    savolId: qisqaId(),
    tenglama: tanlov.tenglama,
    nom: tanlov.nom,
    toifa: tanlov.toifa,
    izoh: tanlov.izoh,
    strelka: tanlov.strelka,
    chap: tanlov.chap.map((q) => ({ formula: q.formula, atomlar: q.atomlar })),
    ong: tanlov.ong.map((q) => ({ formula: q.formula, atomlar: q.atomlar })),
    maxK: tanlov.maxK,
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

function ommaviySavol(s) {
  if (!s) return null
  return {
    savolId: s.savolId,
    nom: s.nom,
    toifa: s.toifa,
    strelka: s.strelka,
    chap: s.chap,
    ong: s.ong,
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
    hisoblagich: holat.hisoblagich,
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

export function reaksiyaBalansBoshla(sozlama = {}) {
  const rejim = RUXSAT_REJIMLAR.has(sozlama.rejim) ? sozlama.rejim : 'yakka'
  const daraja = RUXSAT_DARAJALAR.has(sozlama.daraja) ? sozlama.daraja : 'orta'
  const vaqtSoniya = RUXSAT_VAQTLAR.has(Number(sozlama.vaqtSoniya)) ? Number(sozlama.vaqtSoniya) : 120
  const hisoblagich = sozlama.hisoblagich !== false

  const p1 = boshOyinchi(ismTozala(sozlama.p1Ism, rejim === 'yakka' ? 'Kimyogar' : '1-o‘yinchi'))
  const p2 = boshOyinchi(ismTozala(sozlama.p2Ism, '2-o‘yinchi'))
  const hozir = Date.now()

  const holat = {
    rejim,
    daraja,
    vaqtSoniya,
    hisoblagich,
    tugashVaqti: hozir + vaqtSoniya * 1000,
    tugagan: false,
    p1,
    p2,
    umumiySavol: rejim === 'duel-savol' ? savolYarat(daraja) : null,
    p1Savol: rejim !== 'duel-savol' ? savolYarat(daraja) : null,
    p2Savol: rejim === 'duel-vaqt' ? savolYarat(daraja) : null,
  }
  return javobHolati(holat)
}

export function reaksiyaBalansTekshir({ token, oyinchi = 'p1', chapKoeff = [], ongKoeff = [], savolId }) {
  const holat = och(token)
  if (!holat) return { ok: false, status: 400, xato: 'Sessiya topilmadi yoki muddati tugagan.' }
  if (holat.tugagan) return javobHolati(holat)

  const hozir = Date.now()
  if (hozir > holat.tugashVaqti + VAQT_GRACE_MS) {
    holat.tugagan = true
    return javobHolati(holat, { yakunSabab: 'Ajratilgan vaqt tugadi.' })
  }

  const kalit = holat.rejim === 'yakka' ? 'p1' : oyinchi === 'p2' ? 'p2' : 'p1'
  const p = holat[kalit]
  if (p.blokTugaydi && hozir < p.blokTugaydi) {
    return javobHolati(holat, { natijaKod: 'blok' })
  }

  const savolMaydoni =
    holat.rejim === 'duel-savol' ? 'umumiySavol' : kalit === 'p1' ? 'p1Savol' : 'p2Savol'
  const savol = holat[savolMaydoni]
  if (!savol || savol.savolId !== savolId) {
    return javobHolati(holat, { natijaKod: 'eskirgan' })
  }

  if (
    !Array.isArray(chapKoeff) ||
    !Array.isArray(ongKoeff) ||
    chapKoeff.length !== savol.chap.length ||
    ongKoeff.length !== savol.ong.length
  ) {
    return { ok: false, status: 400, xato: 'Koeffitsientlar soni tenglama tarkibiga mos emas.' }
  }

  const kChap = chapKoeff.map((n) => Math.max(1, Math.min(25, Math.floor(Number(n) || 1))))
  const kOng = ongKoeff.map((n) => Math.max(1, Math.min(25, Math.floor(Number(n) || 1))))

  const tuzilgan = `${savol.chap
    .map((q, i) => `${kChap[i] > 1 ? kChap[i] : ''}${q.formula}`)
    .join(' + ')} ${savol.strelka} ${savol.ong
    .map((q, i) => `${kOng[i] > 1 ? kOng[i] : ''}${q.formula}`)
    .join(' + ')}`

  const tekshiruv = balansTekshir(tuzilgan)
  const ekubQiymat = ekubRoyxat([...kChap, ...kOng])

  if (tekshiruv.muvozanatli && ekubQiymat === 1) {
    const sarfMs = Math.max(500, Math.min(45000, hozir - (savol.ochilganVaqt || hozir)))
    p.togri += 1
    p.seriya += 1
    if (p.seriya > p.engUzunSeriya) p.engUzunSeriya = p.seriya
    const murakkabBonus = Math.min(24, Math.max(0, (savol.maxK - 2) * 3))
    const qoshilganBall = 35 + Math.min(30, (p.seriya - 1) * 6) + murakkabBonus
    p.ball += qoshilganBall
    p.vaqtlar.push(sarfMs)
    if (holat.rejim === 'duel-savol') {
      holat.p1.blokTugaydi = 0
      holat.p2.blokTugaydi = 0
    }

    const tasdiq = `${savol.tenglama} (${savol.nom})`
    holat[savolMaydoni] = savolYarat(holat.daraja, savol.tenglama)
    return javobHolati(holat, {
      natijaKod: 'togri',
      javobOyinchi: kalit,
      qoshilganBall,
      tasdiqIzoh: tasdiq,
    })
  }

  p.xato += 1
  p.seriya = 0
  p.ball = Math.max(0, p.ball - 5)

  let xatoIzoh = 'Tenglama hali muvozanatlashmadi.'
  if (tekshiruv.muvozanatli && ekubQiymat > 1) {
    xatoIzoh = `Atomlar soni teng, lekin barcha koeffitsientlarni ${ekubQiymat} ga bo‘lib eng kichik nisbatga (EKUB = 1) keltiring!`
  } else if (tekshiruv.farqlar.length > 0) {
    const fMatn = tekshiruv.farqlar
      .slice(0, 3)
      .map((f) => `${f.element}: chap ${f.chap}, o‘ng ${f.ong}`)
      .join(' · ')
    xatoIzoh = `Teng emas — ${fMatn}`
  }

  if (holat.rejim === 'duel-savol') {
    p.blokTugaydi = hozir + DUEL_BLOK_MS
  }

  return javobHolati(holat, {
    natijaKod: 'xato',
    javobOyinchi: kalit,
    xatoIzoh,
  })
}

export function reaksiyaBalansOtkaz({ token, oyinchi = 'p1', savolId }) {
  const holat = och(token)
  if (!holat) return { ok: false, status: 400, xato: 'Sessiya topilmadi.' }
  if (holat.tugagan || holat.rejim === 'duel-savol') return javobHolati(holat)

  const kalit = holat.rejim === 'yakka' ? 'p1' : oyinchi === 'p2' ? 'p2' : 'p1'
  const savolMaydoni = kalit === 'p1' ? 'p1Savol' : 'p2Savol'
  const savol = holat[savolMaydoni]
  if (!savol || savol.savolId !== savolId) return javobHolati(holat)

  const javobi = savol.tenglama
  holat[kalit].seriya = 0
  holat[savolMaydoni] = savolYarat(holat.daraja, savol.tenglama)
  return javobHolati(holat, {
    natijaKod: 'otkaz',
    javobOyinchi: kalit,
    xatoIzoh: `O‘tkazildi. To‘g‘ri tenglama: ${javobi}`,
  })
}

export function reaksiyaBalansTugat({ token }) {
  const holat = och(token)
  if (!holat) return { ok: false, status: 400, xato: 'Sessiya topilmadi.' }
  holat.tugagan = true
  return javobHolati(holat, { yakunSabab: 'Tenglashtirish musobaqasi yakunlandi.' })
}
