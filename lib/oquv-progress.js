// lib/oquv-progress.js
//
// "O'qildi" belgilarining yakka manbasi.
//
// Nega kerak: chuqurlashgan bo'limida to'rtta bir-biridan xabarsiz
// localStorage kaliti bor edi — bosh sahifa `jda-chuqurlashgan-progress` ni
// o'qirdi, kristall-maydon, kimyoviy-boglanish va simmetriya sahifalari esa
// har biri o'zining alohida kalitiga yozardi. Natijada talaba mavzu ichidagi
// kichik bo'limlarni haqiqatan o'qib chiqsa ham, bosh sahifadagi progress
// joyida turardi: u faqat bosh sahifadagi katakchani qo'lda bosganda
// o'zgarardi.
//
// Endi hamma belgi bitta xaritada: { [sahifa href]: true }. Mavzu va uning
// kichik bo'limlari bir xil bo'shliqda yashaydi, chunki href'lar noyob.

const KALIT = 'jda-oquv-progress'

// Avvalgi kalitlar. Birinchi o'qishda ular yangi kalitga ko'chiriladi,
// shunda foydalanuvchining eski belgilari yo'qolmaydi.
const ESKI_KALITLAR = [
  'jda-chuqurlashgan-progress',
  'jda-kimyoviy-progress',
  'jda-kristall-progress',
  'jda-simmetriya-progress',
]

const oqi = (kalit) => {
  try {
    const xom = localStorage.getItem(kalit)
    const q = xom ? JSON.parse(xom) : null
    return q && typeof q === 'object' ? q : {}
  } catch {
    return {}
  }
}

const yoz = (xarita) => {
  try {
    localStorage.setItem(KALIT, JSON.stringify(xarita))
  } catch {
    // localStorage yopiq (private rejim) — belgi shu sessiyada qoladi
  }
}

/** Faqat `true` bo'lgan yozuvlarni qoldiradi. */
function tozala(xarita) {
  const natija = {}
  for (const [k, v] of Object.entries(xarita)) if (v) natija[k] = true
  return natija
}

/**
 * Barcha "o'qildi" belgilari: { href: true }.
 * Server tomonda chaqirilsa bo'sh obyekt qaytadi (localStorage yo'q).
 */
export function oqilganlar() {
  if (typeof window === 'undefined') return {}

  const joriy = oqi(KALIT)
  if (Object.keys(joriy).length > 0) return tozala(joriy)

  // Yangi kalit hali bo'sh — eski kalitlardan yig'ib olamiz
  const kochirilgan = {}
  for (const eski of ESKI_KALITLAR) Object.assign(kochirilgan, oqi(eski))

  const toza = tozala(kochirilgan)
  if (Object.keys(toza).length > 0) yoz(toza)
  return toza
}

/** Belgini almashtiradi va yangi xaritani qaytaradi. */
export function belginiAlmashtir(href) {
  const xarita = oqilganlar()
  if (xarita[href]) delete xarita[href]
  else xarita[href] = true
  yoz(xarita)
  return xarita
}

/**
 * Mavzuni uning kichik bo'limlariga qarab belgilaydi.
 *
 * Hammasi o'qilgan bo'lsa mavzuning o'zi ham "o'qildi" bo'ladi — shu tufayli
 * bosh sahifadagi progress mavzu ichidagi ishdan o'zi o'sadi. Bittasi
 * bekor qilinsa, mavzu belgisi ham olinadi.
 */
export function mavzuniYangila(mavzuHref, bandHreflar) {
  const xarita = oqilganlar()
  const hammasi = bandHreflar.length > 0 && bandHreflar.every((h) => xarita[h])

  if (hammasi) xarita[mavzuHref] = true
  else delete xarita[mavzuHref]

  yoz(xarita)
  return xarita
}
