// lib/profil-tahrir.js
//
// Profilni tahrirlash, tashqi havolalarni xavfsizlashtirish va maxfiylik
// qoidalarini bir joyda ushlash uchun sof yordamchi funksiyalar.

import { korinadimi } from './maxfiylik.js'

export const TASHQI_HAVOLA_SXEMALARI = {
  telegram: { nom: 'Telegram', oldi: 'https://t.me/', domanlar: ['t.me', 'telegram.me'] },
  instagram: { nom: 'Instagram', oldi: 'https://instagram.com/', domanlar: ['instagram.com'] },
  twitter: { nom: 'X', oldi: 'https://x.com/', domanlar: ['x.com', 'twitter.com'] },
  github: { nom: 'GitHub', oldi: 'https://github.com/', domanlar: ['github.com'] },
  linkedin: { nom: 'LinkedIn', oldi: 'https://linkedin.com/in/', domanlar: ['linkedin.com/in', 'linkedin.com'] },
  orcid: { nom: 'ORCID', oldi: 'https://orcid.org/', domanlar: ['orcid.org'] },
  googleScholar: { nom: 'Google Scholar', toliq: true },
  scopus: { nom: 'Scopus', toliq: true },
  researchGate: { nom: 'ResearchGate', toliq: true },
  website: { nom: 'Sayt', toliq: true },
}

const XAVFLI_SXEMA = /^\s*(javascript|data|vbscript|file)\s*:/i
const ENG_KICHIK_TUGILGAN = new Date('1930-01-01T00:00:00.000Z')

export const ILMIY_DARAJA_TANLOVLARI = [
  "Maktab o'quvchisi",
  'Abituriyent',
  'Bakalavr',
  'Magistr',
  'PhD / Doktorant',
  'DSc',
  "O'qituvchi / Dotsent",
]

function domenQoshimchasiniKes(matn, domanlar = []) {
  let natija = matn.replace(/^@+/, '').replace(/^www\./i, '')
  for (const domen of domanlar) {
    const prefiks = domen.toLowerCase() + '/'
    if (natija.toLowerCase().startsWith(prefiks)) {
      natija = natija.slice(prefiks.length)
      break
    }
  }
  return natija.replace(/^\/+/, '').replace(/^@+/, '')
}

/**
 * Tashqi havolani xavfsiz `https://` yoki `http://` ko'rinishga keltiradi.
 * `javascript:` kabi xavfli yoki buzuq manzillar uchun `null` qaytaradi.
 */
export function xavfsizTashqiHavola(kalit, qiymat) {
  if (qiymat == null) return null
  const xom = String(qiymat).trim()
  if (!xom || XAVFLI_SXEMA.test(xom) || /\s/.test(xom)) return null

  const meta = TASHQI_HAVOLA_SXEMALARI[kalit]
  if (!meta) return null

  if (/^https?:\/\//i.test(xom)) {
    try {
      const url = new URL(xom)
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
      if (!url.hostname || !url.hostname.includes('.')) return null
      return url.href
    } catch {
      return null
    }
  }

  // `http:` / `https:` bo'lmagan boshqa protokolli matn (masalan `ftp://` yoki `mailto:`)
  if (/^[a-z][a-z0-9+.-]*:/i.test(xom)) {
    return null
  }

  if (meta.toliq || !meta.oldi) {
    try {
      const url = new URL(`https://${xom}`)
      if (!url.hostname || !url.hostname.includes('.')) return null
      return url.href
    } catch {
      return null
    }
  }

  const foydalanuvchi = domenQoshimchasiniKes(xom, meta.domanlar)
  if (!foydalanuvchi || XAVFLI_SXEMA.test(foydalanuvchi)) return null

  try {
    const url = new URL(meta.oldi + foydalanuvchi)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    return url.href
  } catch {
    return null
  }
}

/**
 * Formdan kelgan ijtimoiy tarmoq qiymatini bazada saqlash uchun normallashtiradi.
 */
export function havolaMatniniNormallashtir(kalit, qiymat) {
  if (qiymat == null) return { ok: true, qiymat: null }
  const xom = String(qiymat).trim()
  if (!xom) return { ok: true, qiymat: '' }

  const meta = TASHQI_HAVOLA_SXEMALARI[kalit]
  const manzil = xavfsizTashqiHavola(kalit, xom)
  if (!manzil || !meta) {
    return {
      ok: false,
      xato: `${meta?.nom || kalit} havolasi noto'g'ri formatda`,
    }
  }

  if (meta.toliq) {
    return { ok: true, qiymat: manzil }
  }

  // Agar foydalanuvchi to'liq manzil kiritsa, asosiy domen mos bo'lsa toza username ni ajratamiz
  if (/^https?:\/\//i.test(xom)) {
    try {
      const u = new URL(manzil)
      const host = u.hostname.replace(/^www\./i, '').toLowerCase()
      const domangaMos = (meta.domanlar || []).some((d) => host === d.split('/')[0])
      if (domangaMos) {
        const qisqa = domenQoshimchasiniKes(host + u.pathname, meta.domanlar)
        if (qisqa && !qisqa.includes('/')) {
          return { ok: true, qiymat: qisqa }
        }
      }
      return { ok: true, qiymat: manzil }
    } catch {
      return { ok: true, qiymat: xom }
    }
  }

  const toza = domenQoshimchasiniKes(xom, meta.domanlar)
  return { ok: true, qiymat: toza }
}

/**
 * PUT /api/profil kirish ma'lumotlaridagi xatolarni aniq o'zbekcha matnda aniqlaydi.
 * Sukut bilan tashlab yuborish o'rniga foydalanuvchiga aniq sababni qaytarish uchun.
 */
export function profilKiritishXatolari(body, hozir = new Date()) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { xato: "Yangilanishi kerak bo'lgan ma'lumot topilmadi", tozalangan: {} }
  }

  const tozalangan = { ...body }

  if (body.birthDate !== undefined && body.birthDate !== null && body.birthDate !== '') {
    const sana = new Date(body.birthDate)
    if (Number.isNaN(sana.getTime()) || sana < ENG_KICHIK_TUGILGAN || sana > hozir) {
      return {
        xato: "Tug'ilgan sana noto'g'ri yoki kelajak sanasi kiritilgan",
        tozalangan,
      }
    }
  }

  if (body.level !== undefined && body.level !== null && body.level !== '') {
    const kurs = Number(body.level)
    if (!Number.isInteger(kurs) || kurs < 1 || kurs > 6) {
      return {
        xato: "Kurs / bosqich 1 dan 6 gacha butun son bo'lishi kerak",
        tozalangan,
      }
    }
  }

  if (
    body.enrollmentYear !== undefined &&
    body.enrollmentYear !== null &&
    body.enrollmentYear !== ''
  ) {
    const maxYil = hozir.getFullYear() + 1
    const yil = Number(body.enrollmentYear)
    if (!Number.isInteger(yil) || yil < 1980 || yil > maxYil) {
      return {
        xato: `O'qishga kirgan yil 1980 dan ${maxYil} gacha bo'lishi kerak`,
        tozalangan,
      }
    }
  }

  const havolaKalitlari = [
    'telegram',
    'instagram',
    'twitter',
    'github',
    'linkedin',
    'orcid',
    'googleScholar',
    'website',
  ]
  for (const kalit of havolaKalitlari) {
    if (body[kalit] === undefined) continue
    const tek = havolaMatniniNormallashtir(kalit, body[kalit])
    if (!tek.ok) {
      return { xato: tek.xato, tozalangan }
    }
    tozalangan[kalit] = tek.qiymat
  }

  return { xato: null, tozalangan }
}

/**
 * Post yozilganda maxfiylik sozlamasiga ko'ra xabar olishi mumkin bo'lgan
 * obunachilar ID larini ajratadi.
 */
export function postOluvchilarniAjrat({ obunachiIdlar = [], dostIdlar = [], maxfiylik }) {
  const dostToplam = new Set(dostIdlar)
  const ruxsatli = []
  const kordik = new Set()

  for (const id of obunachiIdlar) {
    if (!id || kordik.has(id)) continue
    kordik.add(id)
    const kontekst = { ozimniki: false, dost: dostToplam.has(id) }
    if (
      korinadimi(maxfiylik, 'profil', kontekst) &&
      korinadimi(maxfiylik, 'postlar', kontekst)
    ) {
      ruxsatli.push(id)
    }
  }

  return ruxsatli
}

const PROFIL_TABLAR = [
  { id: 'haqida', kalit: 'yutuqlar' },
  { id: 'postlar', kalit: 'postlar' },
  { id: 'quizlar', kalit: 'quiz' },
  { id: 'sertifikatlar', kalit: 'sertifikatlar' },
  { id: 'ms', kalit: 'msNatijalar', faqatAniq: true },
  { id: 'dostlar', kalit: 'dostlar' },
]

/**
 * Boshqa odam profilini ochganda birinchi ochiq bo'limni topadi,
 * aks holda yashirilgan birinchi tabga tushib qolmaslik uchun.
 */
export function birinchiOchiqTab(korinadi = {}) {
  const ochiq = PROFIL_TABLAR.find((t) =>
    t.faqatAniq ? korinadi?.[t.kalit] === true : korinadi?.[t.kalit] !== false,
  )
  return ochiq ? ochiq.id : 'haqida'
}
