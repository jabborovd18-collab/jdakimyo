// lib/premium.js
//
// Tasdiqlangan hisoblar uchun profil bezaklari.
//
// NEGA TANLOV BOR. Avval bitta ko'rinish bor edi va barcha tasdiqlangan
// hisoblar bir xil ko'rinardi. Belgi pullik obuna bilan berilishi
// rejalashtirilgan — pul to'lagan odam o'zini ifodalay olishi kerak,
// aks holda "premium" hamma uchun bir xil qolip bo'lib qoladi.
//
// NEGA FAQAT KO'RINISH. Uslub hech qanday huquq bermaydi, shuning
// uchun uni foydalanuvchining o'zi almashtiradi — admin aralashuvi
// shart emas. Tanlash imkoni esa tasdiqlangan hisobga bog'liq.
//
// YANGI USLUB QO'SHISH: shu ro'yxatga yozuv qo'shing va app/globals.css
// da `jda-uslub-<kalit>` sinflarini yarating. Boshqa joyga tegish
// shart emas — sozlash sahifasi ro'yxatni shu yerdan oladi.

export const PREMIUM_USLUBLAR = [
  {
    kalit: 'kosmik',
    nom: 'Kosmik',
    tavsif: "Moviy va binafsha — saytning asosiy ohangi",
    // Tanlash oynasida ko'rsatiladigan namunali ranglar
    namuna: ['#22d3ee', '#a78bfa', '#f472b6'],
    chegara: 'border-cyan-400/40',
    yorliqMatn: 'Tasdiqlangan',
  },
  {
    kalit: 'guluzor',
    nom: 'Guluzor',
    tavsif: 'Pushti va qizil — issiq, yorqin ohang',
    namuna: ['#fb7185', '#f472b6', '#c084fc'],
    chegara: 'border-pink-400/40',
    yorliqMatn: 'Tasdiqlangan',
  },
  {
    kalit: 'oltin',
    nom: 'Oltin',
    tavsif: "Sariq va kahrabo — klassik, jiddiy ko'rinish",
    namuna: ['#fbbf24', '#f59e0b', '#fb923c'],
    chegara: 'border-amber-400/40',
    yorliqMatn: 'Tasdiqlangan',
  },
  {
    kalit: 'zumrad',
    nom: 'Zumrad',
    tavsif: "Yashil va moviy — tinch, sovuq ohang",
    namuna: ['#34d399', '#22d3ee', '#818cf8'],
    chegara: 'border-emerald-400/40',
    yorliqMatn: 'Tasdiqlangan',
  },
  {
    kalit: 'tungi',
    nom: 'Tungi',
    tavsif: "Kul va kumush — bezaksiz, sokin variant",
    namuna: ['#94a3b8', '#cbd5e1', '#64748b'],
    chegara: 'border-slate-400/40',
    yorliqMatn: 'Tasdiqlangan',
  },
]

export const USLUB_SUKUT = 'kosmik'

/** Kalit bo'yicha topadi. Noma'lum kalitda sukutdagisini qaytaradi. */
export function uslubniTop(kalit) {
  return PREMIUM_USLUBLAR.find((u) => u.kalit === kalit) || PREMIUM_USLUBLAR[0]
}

/** Kalit haqiqiymi — saqlashdan oldin tekshirish uchun */
export function uslubBormi(kalit) {
  return PREMIUM_USLUBLAR.some((u) => u.kalit === kalit)
}

/**
 * Foydalanuvchi uchun amaldagi uslub kaliti.
 * Tasdiqlanmagan hisobda premium ko'rinish umuman qo'llanmaydi.
 */
export function uslubKaliti(user) {
  if (!user?.isVerified) return null
  return uslubBormi(user.premiumUslub) ? user.premiumUslub : USLUB_SUKUT
}
