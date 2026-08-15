// Xotiradagi tezlik cheklovi — bazaga yozilmaydigan yo'llar uchun.
//
// NEGA ALOHIDA MODUL. Forum uchun cheklov `lib/forum.js` dagi
// `tezlikChekloviOshdimi` da — u `forumPost` qatorlarini sanaydi, chunki
// postlar baza jadvalida yotadi. AI yechimi va TTS so'rovlari esa hech
// qayerga yozilmaydi: ularni sanash uchun yangi jadval va migratsiya
// kerak bo'lardi. Shuning uchun bu yerda xotira ishlatiladi.
//
// CHEKLOVINI BILIB TURING. Vercel'da har bir funksiya nusxasi o'z
// xotirasiga ega — nusxa ko'paysa, amaldagi chegara ham shuncha marta
// ko'payadi. Bu qat'iy kafolat emas. Maqsadi: bitta odam sikl yozib
// Gemini kalitini bir kechada quritib qo'ymasin. Qat'iy kafolat kerak
// bo'lsa Redis yoki baza jadvali kerak bo'ladi.

const jurnal = new Map()

// Xotira cheksiz o'smasin: eskirgan kalitlarni vaqti-vaqti bilan tozalaymiz.
// Har chaqiruvda emas — 500 kalitdan oshgandagina, aks holda har so'rovda
// butun Map aylanib chiqilardi.
const TOZALASH_CHEGARASI = 500

function eskilarniTozala(hozir) {
  for (const [kalit, vaqtlar] of jurnal) {
    // Eng katta oyna 1 soat — undan eski yozuv hech kimga kerak emas
    const tirik = vaqtlar.filter((v) => hozir - v < 3_600_000)
    if (tirik.length === 0) jurnal.delete(kalit)
    else jurnal.set(kalit, tirik)
  }
}

/**
 * Cheklov oshgan bo'lsa xato matnini, aks holda `null` qaytaradi.
 *
 * Bir kalit uchun bir necha oyna berish mumkin (daqiqalik + soatlik):
 * qisqa oyna to'satdan portlashni, uzun oyna kun bo'yi sekin so'rishni
 * to'xtatadi.
 *
 * @param {string} kalit — odatda `masala:${userId}`
 * @param {Array<{soni: number, oynaMs: number, xabar: string}>} qoidalar
 */
export function tezlikOshdimi(kalit, qoidalar) {
  const hozir = Date.now()

  if (jurnal.size > TOZALASH_CHEGARASI) eskilarniTozala(hozir)

  const engUzunOyna = Math.max(...qoidalar.map((q) => q.oynaMs))
  const vaqtlar = (jurnal.get(kalit) || []).filter((v) => hozir - v < engUzunOyna)

  for (const qoida of qoidalar) {
    const sanoq = vaqtlar.filter((v) => hozir - v < qoida.oynaMs).length
    if (sanoq >= qoida.soni) {
      // Yozib qo'ymaymiz: rad etilgan so'rov chegarani yana surib
      // yubormasligi kerak, aks holda tez-tez urinish jazoni cho'zardi.
      jurnal.set(kalit, vaqtlar)
      return qoida.xabar
    }
  }

  vaqtlar.push(hozir)
  jurnal.set(kalit, vaqtlar)
  return null
}

/** AI yechimi — qimmat, shuning uchun qattiq cheklov */
export const AI_QOIDASI = [
  { soni: 5, oynaMs: 60_000, xabar: 'Juda tez so\'rayapsiz — bir daqiqa kuting' },
  { soni: 40, oynaMs: 3_600_000, xabar: 'Soatlik cheklovga yetdingiz — keyinroq urinib ko\'ring' },
]

/** Ovoz (TTS) — arzonroq, lekin baribir tashqi xizmat */
export const OVOZ_QOIDASI = [
  { soni: 20, oynaMs: 60_000, xabar: 'Juda ko\'p ovoz so\'rovi — biroz kuting' },
  { soni: 200, oynaMs: 3_600_000, xabar: 'Soatlik ovoz cheklovi' },
]
