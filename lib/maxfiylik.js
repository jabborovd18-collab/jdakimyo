// lib/maxfiylik.js
//
// Maxfiylik sozlamalari: uch daraja va ularni tekshirish.
//
// NEGA UCH DARAJA. Avval har bir sozlama ha/yo'q edi va "faqat do'stlarga"
// degan oraliq yo'q edi. Natijada mantiq ham chalkash bo'lgan: sahifada
// "do'stlaringiz har doim to'liq profilingizni ko'radi" deb yozilgan edi,
// ya'ni "yashirin" degani aslida "do'stlardan tashqari hammadan yashirin"
// edi — foydalanuvchi buni sozlamadan bilolmasdi.
//
// Endi har bir bo'lim uchun daraja aniq tanlanadi:
//
//   hamma    — istalgan odam ko'radi (kirmagan mehmon ham)
//   dostlar  — faqat do'stlar ko'radi
//   hech-kim — hech kim ko'rmaydi
//
// Egasining o'zi har doim hammasini ko'radi — bu daraja emas, o'z-o'zidan
// ravshan qoida.

export const DARAJALAR = [
  { id: 'hamma', nom: 'Hamma', icon: '🌍', tavsif: 'Istalgan odam ko\'radi' },
  { id: 'dostlar', nom: "Faqat do'stlar", icon: '👥', tavsif: 'Faqat do\'stlaringiz ko\'radi' },
  { id: 'hech-kim', nom: 'Hech kim', icon: '🔒', tavsif: 'Hech kimga ko\'rinmaydi' },
]

const DARAJA_IDLARI = DARAJALAR.map((d) => d.id)

/**
 * Sozlanadigan bo'limlar.
 *
 * `profil` alohida: u butun sahifaning kaliti. Yopiq bo'lsa qolganlari
 * baribir ko'rinmaydi, shuning uchun ro'yxatda birinchi turadi.
 */
export const BOLIMLAR = [
  {
    kalit: 'profil',
    nom: 'Profil sahifasi',
    tavsif: 'Ismingiz, universitet, bio va statistika',
    icon: '👤',
    asosiy: true,
  },
  { kalit: 'dostlar', nom: "Do'stlar ro'yxati", tavsif: 'Kimlar bilan do\'stligingiz', icon: '👥' },
  { kalit: 'obunachilar', nom: 'Obunachilar va obunalar', tavsif: 'Obunachilar soni va ro\'yxati', icon: '👁️' },
  { kalit: 'quiz', nom: 'Quiz natijalari', tavsif: 'Yechilgan testlar va foizlar', icon: '📝' },
  { kalit: 'yutuqlar', nom: 'Yutuqlar', tavsif: 'To\'plangan nishonlar', icon: '🏆' },
  { kalit: 'sertifikatlar', nom: 'Sertifikatlar', tavsif: 'Berilgan sertifikatlar ro\'yxati', icon: '📜' },
  { kalit: 'postlar', nom: 'Profil postlari', tavsif: 'Profilingizga yozgan yozuvlaringiz', icon: '✍️' },
]

export const ODDIY_MAXFIYLIK = {
  profil: 'hamma',
  dostlar: 'hamma',
  obunachilar: 'hamma',
  quiz: 'dostlar',
  yutuqlar: 'hamma',
  sertifikatlar: 'hamma',
  postlar: 'hamma',
}

/**
 * Eski ha/yo'q sozlamalarni uch darajaga o'tkazadi.
 *
 * Bazadagi yozuvlar migratsiya bilan o'zgartirilmadi — ular JSON va
 * har xil shaklda bo'lishi mumkin. Shuning uchun o'girish O'QISH paytida
 * bajariladi: eski `true` → "hamma", `false` → "hech-kim".
 *
 * Eskisida "yashirin" aslida do'stlarga ochiq edi. Uni "dostlar" ga
 * o'girish ham mumkin edi, lekin bu foydalanuvchi TANLAMAGAN narsani
 * ochib qo'yish bo'lardi. Maxfiylikda shubha yopiq tomonga hal qilinadi.
 */
export function tozala(xom) {
  const kelgan = (() => {
    if (!xom) return {}
    if (typeof xom === 'string') {
      try { return JSON.parse(xom) } catch { return {} }
    }
    return typeof xom === 'object' ? xom : {}
  })()

  const eski = {
    profil: kelgan.profilePublic,
    dostlar: kelgan.showFriends,
    obunachilar: kelgan.showFollowers,
    quiz: kelgan.showQuizResults,
    yutuqlar: kelgan.showAchievements,
  }

  const natija = { ...ODDIY_MAXFIYLIK }

  for (const b of BOLIMLAR) {
    const yangi = kelgan[b.kalit]
    if (DARAJA_IDLARI.includes(yangi)) {
      natija[b.kalit] = yangi
      continue
    }
    if (typeof eski[b.kalit] === 'boolean') {
      natija[b.kalit] = eski[b.kalit] ? 'hamma' : 'hech-kim'
    }
  }

  return natija
}

/**
 * Shu bo'lim ko'rinadimi.
 *
 * @param {object} maxfiylik — tozala() dan o'tgan sozlama
 * @param {string} bolim
 * @param {{ozimniki?: boolean, dost?: boolean}} kim
 */
export function korinadimi(maxfiylik, bolim, kim = {}) {
  if (kim.ozimniki) return true

  const daraja = maxfiylik?.[bolim] || ODDIY_MAXFIYLIK[bolim] || 'hech-kim'
  if (daraja === 'hamma') return true
  if (daraja === 'dostlar') return Boolean(kim.dost)
  return false
}

/** Sozlamalar sahifasidagi qisqa izoh uchun */
export function darajaMalumoti(id) {
  return DARAJALAR.find((d) => d.id === id) || DARAJALAR[0]
}
