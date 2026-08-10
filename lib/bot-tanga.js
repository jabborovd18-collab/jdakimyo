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

// ─── AI prezentatsiya ───────────────────────────────────────────

/**
 * Slaydiga tanga. Quizdan qimmatroq: har taqdimot AI so'rovini
 * sarflaydi va uning kunlik kvotasi cheklangan.
 */
export const TANGA_SLAYDGA = 4

/** Eng kam to'lov — 10 slayddan kichigi ham shu narxda */
export const ENG_KAM_TAQDIMOT = 40

/**
 * Ikkinchi format (PPTX ustiga PDF yoki aksincha).
 *
 * Ataylab arzon: mazmun allaqachon tayyor va AI so'rovi QAYTA
 * sarflanmaydi — faqat ikkinchi chizish qo'shiladi.
 */
export const IKKINCHI_FORMAT_NARXI = 6

/**
 * "Kuchli ilmiy" rejim koeffitsiyenti.
 *
 * Bu rejimda AI slayd sonini O'ZI belgilaydi (8–16) va mavzuni
 * chuqurroq ochadi: mexanizm, aniq shart, raqam va taqqoslash bilan.
 * Model uzunroq o'ylaydi va ko'proq token sarflaydi — narx ham
 * shunga yarasha.
 */
export const ILMIY_KOEF = 1.5

export function taqdimotNarxi(slaydlar, ikkiFormat = false, ilmiy = false) {
  const soni = Math.max(0, Number(slaydlar) || 0)
  if (soni === 0) return 0
  let asos = Math.max(ENG_KAM_TAQDIMOT, soni * TANGA_SLAYDGA)
  if (ilmiy) asos = Math.round(asos * ILMIY_KOEF)
  return asos + (ikkiFormat ? IKKINCHI_FORMAT_NARXI : 0)
}

/**
 * Kuchli ilmiy rejim uchun narx ORALIG'I.
 *
 * Slayd soni oldindan noma'lum, lekin foydalanuvchi to'lashdan oldin
 * qancha turishini bilishi kerak. Shuning uchun eng kam va eng ko'p
 * slayd bo'yicha ikkita raqam ko'rsatiladi. Haqiqiy summa mazmun
 * tayyor bo'lgach, ANIQ slayd soni bo'yicha yechiladi.
 */
export const ILMIY_ENG_KAM_SLAYD = 8
export const ILMIY_ENG_KOP_SLAYD = 16

export function ilmiyNarxOraligi(ikkiFormat = false) {
  return {
    past: taqdimotNarxi(ILMIY_ENG_KAM_SLAYD, ikkiFormat, true),
    yuqori: taqdimotNarxi(ILMIY_ENG_KOP_SLAYD, ikkiFormat, true),
  }
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
