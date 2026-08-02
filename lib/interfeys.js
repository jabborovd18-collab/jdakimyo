// lib/interfeys.js
//
// Interfeys sozlamalari: qiymatlar ro'yxati va ularni sahifaga qo'llash.
//
// NEGA FAQAT SHU TO'RTTASI. Saytda 585 ta faylda ranglar to'g'ridan-to'g'ri
// Tailwind sinflari bilan yozilgan (`bg-purple-900`, `text-yellow-400`).
// Ya'ni "mavzuni almashtirish" degani o'sha 585 faylni qayta yozish degani.
// Shuning uchun bu yerda faqat BUTUN SAYTGA haqiqatan ta'sir qiladigan
// sozlamalar bor:
//
//   shrift    — html ning font-size i, Tailwind o'lchamlari rem da,
//               shuning uchun hamma narsa birga kattalashadi
//   urgu      — CSS o'zgaruvchisi: fokus halqasi, matn ajratish, scrollbar
//   animatsiya— bitta global qoida hamma o'tishlarni o'chiradi
//   kontrast  — xira matn sinflarini yorug'roq qiladi
//
// Yolg'on va'da bermaslik uchun sozlamalar sahifasida ham shu aytilgan.
//
// Qo'llash `document.documentElement` ustidagi `data-*` atributlari orqali
// ketadi, chunki CSS ularni o'qiy oladi va React qayta chizishini kutmaydi.

export const SHRIFTLAR = [
  { id: 'kichik', nom: 'Kichik', px: 15 },
  { id: 'oddiy', nom: 'Oddiy', px: 16 },
  { id: 'katta', nom: 'Katta', px: 17 },
  { id: 'juda-katta', nom: 'Juda katta', px: 19 },
]

export const URGU_RANGLARI = [
  { id: 'sariq', nom: 'Sariq', rang: '#facc15' },
  { id: 'siyohrang', nom: 'Siyohrang', rang: '#a855f7' },
  { id: 'moviy', nom: 'Moviy', rang: '#38bdf8' },
  { id: 'zumrad', nom: 'Zumrad', rang: '#34d399' },
  { id: 'marjon', nom: 'Marjon', rang: '#fb7185' },
]

export const ODDIY_INTERFEYS = {
  language: 'uz',
  timezone: 'Asia/Tashkent',
  dateFormat: 'DD.MM.YYYY',
  theme: 'dark',
  shrift: 'oddiy',
  urgu: 'sariq',
  animatsiya: true,
  kontrast: false,
}

/** Brauzerda saqlash kaliti — sahifa ochilishida darhol qo'llash uchun */
export const KESH_KALITI = 'jda-interfeys'

/** Kelgan ma'lumotni to'ldiradi va noto'g'ri qiymatlarni tashlaydi */
export function tozala(xom) {
  const s = { ...ODDIY_INTERFEYS, ...(xom && typeof xom === 'object' ? xom : {}) }

  if (!SHRIFTLAR.some((x) => x.id === s.shrift)) s.shrift = ODDIY_INTERFEYS.shrift
  if (!URGU_RANGLARI.some((x) => x.id === s.urgu)) s.urgu = ODDIY_INTERFEYS.urgu
  s.animatsiya = s.animatsiya !== false
  s.kontrast = s.kontrast === true

  return s
}

/**
 * Oxirgi qo'llash vaqti.
 *
 * Nega kerak: serverdan sozlama kelishi sekin bo'lishi mumkin. Shu orada
 * foydalanuvchi sozlamalar sahifasida shriftni o'zgartirsa, kechikkan
 * javob uning tanlovini ustidan bosib, o'zgarish "orqaga qaytib" ketardi.
 * Sinovda aynan shunday bo'ldi. Endi kechikkan javob o'zidan keyin
 * qo'llangan sozlamani bosmaydi.
 */
let oxirgiQollash = 0

export function oxirgiQollashVaqti() {
  return oxirgiQollash
}

/**
 * Sozlamani sahifaga qo'llaydi.
 *
 * Sozlamalar sahifasida ham shu chaqiriladi — o'zgarish darhol ko'rinadi,
 * saqlashni kutmaydi. "Saqlash" tugmasi faqat serverga yozadi.
 */
export function qoll(xom) {
  if (typeof document === 'undefined') return

  oxirgiQollash = Date.now()

  const s = tozala(xom)
  const el = document.documentElement

  el.dataset.shrift = s.shrift
  el.dataset.urgu = s.urgu
  el.dataset.animatsiya = s.animatsiya ? 'yoniq' : 'ochiq'
  el.dataset.kontrast = s.kontrast ? 'yuqori' : 'oddiy'

  const shrift = SHRIFTLAR.find((x) => x.id === s.shrift)
  el.style.fontSize = `${shrift.px}px`

  const urgu = URGU_RANGLARI.find((x) => x.id === s.urgu)
  el.style.setProperty('--jda-urgu', urgu.rang)

  return s
}

/** Brauzer nusxasiga yozadi, shunda keyingi ochilishda kutish bo'lmaydi */
export function keshlaVaQoll(xom) {
  const s = qoll(xom)
  try {
    localStorage.setItem(KESH_KALITI, JSON.stringify(s))
  } catch {
    // Maxfiy rejimda localStorage yopiq bo'lishi mumkin — sozlama baribir
    // qo'llandi, faqat keyingi ochilishda serverdan kutiladi
  }
  return s
}
