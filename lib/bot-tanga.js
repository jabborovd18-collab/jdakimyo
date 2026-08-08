// Botdagi pullik xizmatlar uchun tanga narxi va hisob-kitobi.
//
// NEGA NARX SAYTDA HISOBLANADI, BOTDA EMAS. Tanga — saytning
// iqtisodiyoti: u missiya, sandiq va sovg'a bilan bir tizimda yashaydi.
// Narx bot tomonida turganda ikki joyda ikki xil qoida paydo bo'lardi
// va Render'dagi o'zgaruvchini o'zgartirish saytdagi balansni jimgina
// buzardi. Bu yerda esa hamma iqtisodiy qoida bir joyda.

/**
 * Har bir savol uchun tanga.
 *
 * Qiymat ataylab baland. Taqqoslash uchun: kunlik uchala missiyani
 * bajargan odam bonusi bilan ~45–75 tanga topadi, arzon sandiq esa
 * 20 tanga turadi. Ya'ni 50 savollik test (100 tanga) — ikki kunlik
 * faollik. Xizmat qimmat, chunki u Word fayldan 50 ta tayyor Telegram
 * so'rovnomasi yasab beradi.
 */
export const TANGA_SAVOLGA = 2

/**
 * Eng kam to'lov.
 *
 * Usiz 3 savollik fayl 6 tangaga tushardi va odam bitta katta testni
 * bo'lak-bo'lak yuborib narxni aylanib o'tardi.
 */
export const ENG_KAM_NARX = 20

export function quizNarxi(savollar) {
  const soni = Math.max(0, Number(savollar) || 0)
  if (soni === 0) return 0
  return Math.max(ENG_KAM_NARX, soni * TANGA_SAVOLGA)
}

/**
 * Tanga qanday topiladi — botda ko'rsatiladigan matn.
 *
 * Manbalar `lib/missions.js`, `lib/sandiq.js` va `lib/sovga.js` dagi
 * haqiqiy qoidalardan olingan. Bu yerda saqlanadi, chunki bot va sayt
 * bir xil gapni aytishi kerak: ikki joyda alohida yozilsa, qoida
 * o'zgarganda biri eskirib qolardi.
 */
export const TANGA_TOPISH = [
  'Kunlik missiyalarni bajarish — har biri uchun tanga, uchalasi uchun qo\'shimcha bonus',
  'Kunlik bepul sandiqni ochish',
  'Quiz testlarni yechish va ball to\'plash',
  'Do\'stlardan sovg\'a olish',
]
