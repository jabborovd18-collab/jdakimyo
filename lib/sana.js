// lib/sana.js
//
// Sanani o'zbekcha ko'rsatish.
//
// Nega kerak: `toLocaleDateString('uz-UZ', { month: 'long' })` Node va
// brauzerlarning ICU ma'lumotlar bazasida to'liq o'zbek oy nomlari
// bo'lmagani uchun "2026 M07 26" deb chiqaradi — oy nomi o'rniga "M07".
// Bu sertifikat PDF'ida ham, profilda ham ko'rinardi.

const OYLAR = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
]

const OYLAR_QISQA = [
  'yan', 'fev', 'mar', 'apr', 'may', 'iyn',
  'iyl', 'avg', 'sen', 'okt', 'noy', 'dek',
]

function toDate(value) {
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

/** "26 iyul 2026" */
export function sana(value) {
  const d = toDate(value)
  if (!d) return ''
  return `${d.getDate()} ${OYLAR[d.getMonth()]} ${d.getFullYear()}`
}

/** "26 iyl 2026" */
export function sanaQisqa(value) {
  const d = toDate(value)
  if (!d) return ''
  return `${d.getDate()} ${OYLAR_QISQA[d.getMonth()]} ${d.getFullYear()}`
}

/** "26 iyul 2026, 14:30" */
export function sanaVaqt(value) {
  const d = toDate(value)
  if (!d) return ''
  const soat = String(d.getHours()).padStart(2, '0')
  const daqiqa = String(d.getMinutes()).padStart(2, '0')
  return `${sana(d)}, ${soat}:${daqiqa}`
}

/** "3 kun oldin", "hozir" — lenta uchun */
export function qachon(value) {
  const d = toDate(value)
  if (!d) return ''

  const farq = Math.floor((Date.now() - d.getTime()) / 1000)
  if (farq < 60) return 'hozirgina'
  if (farq < 3600) return `${Math.floor(farq / 60)} daqiqa oldin`
  if (farq < 86400) return `${Math.floor(farq / 3600)} soat oldin`
  if (farq < 604800) return `${Math.floor(farq / 86400)} kun oldin`
  return sana(d)
}

export { OYLAR, OYLAR_QISQA }
