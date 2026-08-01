// lib/sana.js
//
// Sanani o'zbekcha va O'zbekiston vaqtida ko'rsatish.
//
// Nega kerak: `toLocaleDateString('uz-UZ', { month: 'long' })` Node va
// brauzerlarning ICU ma'lumotlar bazasida to'liq o'zbek oy nomlari
// bo'lmagani uchun "2026 M07 26" deb chiqaradi — oy nomi o'rniga "M07".
// Bu sertifikat PDF'ida ham, profilda ham ko'rinardi.
//
// Nega zona qat'iy: avval getDate() ishlatilardi, u esa MAHALLIY zonani
// oladi. Vercel serveri UTC'da ishlaydi, foydalanuvchi brauzeri UTC+5 da —
// natijada yarim tundan keyin berilgan sertifikat tekshirish sahifasida
// (server) "1 avgust", profilda (brauzer) "2 avgust" deb ko'rinardi.
// Sertifikat uchun bunday nomuvofiqlik qabul qilib bo'lmaydi.

const OYLAR = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
]

const OYLAR_QISQA = [
  'yan', 'fev', 'mar', 'apr', 'may', 'iyn',
  'iyl', 'avg', 'sen', 'okt', 'noy', 'dek',
]

// O'zbekiston UTC+5, yozgi vaqt yo'q — shuning uchun oddiy siljish yetarli.
const TOSHKENT_SILJISH_MS = 5 * 60 * 60 * 1000

function xomDate(value) {
  // null/undefined/'' ni ham rad etamiz: `new Date(null)` NaN emas, epoch
  // qaytaradi — ya'ni bo'sh maydon "1 yanvar 1970" bo'lib ko'rinardi.
  if (value === null || value === undefined || value === '') return null

  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * Vaqtni Toshkent zonasiga suradi. Undan keyin qismlar getUTC* bilan
 * o'qiladi — shunda natija server ham, brauzer ham qayerda ishlashidan
 * qat'i nazar bir xil bo'ladi.
 */
function toDate(value) {
  const d = xomDate(value)
  return d ? new Date(d.getTime() + TOSHKENT_SILJISH_MS) : null
}

/** "26 iyul 2026" */
export function sana(value) {
  const d = toDate(value)
  if (!d) return ''
  return `${d.getUTCDate()} ${OYLAR[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** "26 iyl 2026" */
export function sanaQisqa(value) {
  const d = toDate(value)
  if (!d) return ''
  return `${d.getUTCDate()} ${OYLAR_QISQA[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** "26 iyul 2026, 14:30" */
export function sanaVaqt(value) {
  const d = toDate(value)
  if (!d) return ''
  const soat = String(d.getUTCHours()).padStart(2, '0')
  const daqiqa = String(d.getUTCMinutes()).padStart(2, '0')
  return `${d.getUTCDate()} ${OYLAR[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${soat}:${daqiqa}`
}

/** "3 kun oldin", "hozir" — lenta uchun */
export function qachon(value) {
  // Farq — ikki lahza orasidagi masofa, u zonaga bog'liq emas.
  // Shuning uchun bu yerda SILJITILMAGAN sana kerak.
  const d = xomDate(value)
  if (!d) return ''

  const farq = Math.floor((Date.now() - d.getTime()) / 1000)
  if (farq < 60) return 'hozirgina'
  if (farq < 3600) return `${Math.floor(farq / 60)} daqiqa oldin`
  if (farq < 86400) return `${Math.floor(farq / 3600)} soat oldin`
  if (farq < 604800) return `${Math.floor(farq / 86400)} kun oldin`
  return sana(d)
}

export { OYLAR, OYLAR_QISQA }
