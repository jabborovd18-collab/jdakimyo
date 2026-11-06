// lib/rasch-model.js
//
// JDA KIMYO — GEORG RASCH IRT (ITEM RESPONSE THEORY) BAHOLASH MODELI
//
// Ushbu modul o'quvchining bilim darajasi (theta) va savollarning qiyinlik
// logiti (b_i) asosida baholaydi.
//
// Nega natija "taxminiy": b_i hozircha ekspert bahosi, haqiqiy javoblardan
// kalibrlanmagan. Rasmiy logitni ballga o'tkazish formulasi ham e'lon
// qilinmagan, shuning uchun ball rasmiy ball bilan bir xil bo'lmasligi mumkin.

// Daraja chegaralarining YAGONA manbai (AGENTS.md 1-band).
// Qiymatlar gov.uz e'lonlaridagi rasmiy shkaladan olingan. Nega 70 maksimum
// emas: rasmiy shkalada 70 A+ darajaning QUYI chegarasi.
export const DARAJA_CHEGARALARI = [
  { daraja: "A+", minBall: 70 },
  { daraja: "A", minBall: 65 },
  { daraja: "B+", minBall: 60 },
  { daraja: "B", minBall: 55 },
  { daraja: "C+", minBall: 50 },
  { daraja: "C", minBall: 46 },
]

// Nega bu sonlar: rasmiy o'tkazish formulasi noma'lum, bu vaqtinchalik chiziqli
// bog'lanish. Kalibrlashdan keyin haqiqiy ma'lumot asosida qayta tanlanadi.
const SHKALA_MARKAZ = 45
const SHKALA_QADAM = 10
const SHKALA_MAKS = 100

/**
 * Rasch dixotomik modeli bo'yicha to'g'ri javob berish ehtimolligi (P)
 * P(X = 1 | theta, b) = 1 / (1 + exp(-(theta - b)))
 *
 * @param {number} theta O'quvchining bilim darajasi (logit)
 * @param {number} b     Savolning qiyinchilik darajasi (logit)
 * @returns {number}     0 dan 1 gacha ehtimollik
 */
export function raschEhtimollik(theta, b) {
  const d = theta - b
  // Sonlar toshib ketmasligi uchun chegara
  if (d > 35) return 0.999999
  if (d < -35) return 0.000001
  return 1 / (1 + Math.exp(-d))
}

/**
 * O'quvchining qobiliyati (theta) ni Newton-Raphson usuli bilan baholash (MLE)
 *
 * @param {Array<{ qiyinlik: number }>} savollar Savollar parametrlari (b_i)
 * @param {number[]} javoblar 1 (to'g'ri) yoki 0 (noto'g'ri) massivi
 * @param {number} [maxIter=25] Maksimal iteratsiyalar soni
 * @param {number} [aniqlik=0.001] To'xtash mezoni (epsilon)
 * @returns {{
 *   theta: number,
 *   se: number,
 *   rawScore: number,
 *   total: number,
 *   foiz: number,
 *   shkalaBalli: number,
 *   daraja: string,
 *   tavsif: string,
 *   infitMNSQ: number,
 *   outfitMNSQ: number
 * }}
 */
export function hisoblaRaschTheta(savollar, javoblar, maxIter = 25, aniqlik = 0.001) {
  if (!Array.isArray(savollar) || !Array.isArray(javoblar) || savollar.length === 0) {
    throw new Error("Savollar va javoblar to'liq kiritilishi shart")
  }
  if (savollar.length !== javoblar.length) {
    throw new Error("Savollar soni va berilgan javoblar soni teng bo'lishi shart")
  }

  const n = savollar.length
  const rawScore = javoblar.reduce((yigindi, x) => yigindi + (Number(x) === 1 ? 1 : 0), 0)
  const foiz = Number(((rawScore / n) * 100).toFixed(1))

  // Chekka holatlar (Barcha savollar to'g'ri yoki barcha savollar xato)
  // Sof MLE chekka holatlarda cheksizlikka intiladi, shuning uchun Wright-Stone tuzatmasi qo'llaniladi (0.5 yoki n - 0.5)
  let boshlangichTheta = 0
  if (rawScore === 0) {
    // Eng past daraja (taxminan -3.5 logit)
    const ortachaQiyinlik = savollar.reduce((s, q) => s + (q.qiyinlik || 0), 0) / n
    const sozScore = 0.3
    boshlangichTheta = ortachaQiyinlik + Math.log(sozScore / (n - sozScore))
  } else if (rawScore === n) {
    // Eng yuqori daraja (taxminan +3.5 logit)
    const ortachaQiyinlik = savollar.reduce((s, q) => s + (q.qiyinlik || 0), 0) / n
    const sozScore = n - 0.3
    boshlangichTheta = ortachaQiyinlik + Math.log(sozScore / (n - sozScore))
  } else {
    // Boshlang'ich proportsional baho
    const p = rawScore / n
    boshlangichTheta = Math.log(p / (1 - p))
  }

  let theta = boshlangichTheta

  // Agar barcha savol 0 yoki barchasi 1 bo'lmasa, Newton-Raphson konvergentsiyasi
  if (rawScore > 0 && rawScore < n) {
    for (let iter = 0; iter < maxIter; iter++) {
      let f = 0 // Birinchi hosila (Score funksiyasi: sum(X_i - P_i))
      let info = 0 // Ikkinchi hosila / Fisher axboroti: sum(P_i * (1 - P_i))

      for (let i = 0; i < n; i++) {
        const b_i = Number(savollar[i].qiyinlik) || 0
        const P_i = raschEhtimollik(theta, b_i)
        f += (javoblar[i] - P_i)
        info += P_i * (1 - P_i)
      }

      if (info < 1e-7) break

      const delta = f / info
      theta += delta

      // Logit chegarasini [-4.5, +4.5] oralig'ida ushlash
      if (theta > 4.5) theta = 4.5
      if (theta < -4.5) theta = -4.5

      if (Math.abs(delta) < aniqlik) break
    }
  }

  // Standart xatolik (Standard Error - SE): 1 / sqrt(Info)
  let jamiInfo = 0
  let infitKvadratYigindi = 0
  let outfitKvadratYigindi = 0
  let kutilganDisp = 0

  for (let i = 0; i < n; i++) {
    const b_i = Number(savollar[i].qiyinlik) || 0
    const P_i = raschEhtimollik(theta, b_i)
    const W_i = P_i * (1 - P_i)
    jamiInfo += W_i

    // Qoldiq (Residual) va fit statistikasi (Z^2)
    const residual = javoblar[i] - P_i
    const zKvadrat = W_i > 1e-6 ? (residual * residual) / W_i : 0

    outfitKvadratYigindi += zKvadrat
    infitKvadratYigindi += residual * residual
    kutilganDisp += W_i
  }

  const se = jamiInfo > 0 ? Number((1 / Math.sqrt(jamiInfo)).toFixed(2)) : 0.99
  const outfitMNSQ = n > 0 ? Number((outfitKvadratYigindi / n).toFixed(2)) : 1.0
  const infitMNSQ = kutilganDisp > 0 ? Number((infitKvadratYigindi / kutilganDisp).toFixed(2)) : 1.0

  let shkalaBalli = Math.round((SHKALA_MARKAZ + SHKALA_QADAM * theta) * 10) / 10
  if (shkalaBalli > SHKALA_MAKS) shkalaBalli = SHKALA_MAKS
  if (shkalaBalli < 0) shkalaBalli = 0

  const bahoNatijasi = aniqlaDaraja(shkalaBalli)

  return {
    theta: Number(theta.toFixed(2)),
    se,
    rawScore,
    total: n,
    foiz,
    shkalaBalli,
    daraja: bahoNatijasi.daraja,
    darajaNomi: bahoNatijasi.darajaNomi,
    imtiyoz: bahoNatijasi.imtiyoz,
    tavsif: bahoNatijasi.tavsif,
    infitMNSQ,
    outfitMNSQ,
  }
}

const MAKSIMAL_BALL_MATNI = "Rasmiy sertifikatda bu daraja ixtisoslik fanidan maksimal ball beradi."
const PROPORSIONAL_BALL_MATNI = "Rasmiy sertifikatda bu daraja ixtisoslik fanidan proporsional ball beradi."

const DARAJA_MATNLARI = {
  "A+": {
    darajaNomi: "Eng yuqori daraja (A+)",
    imtiyoz: MAKSIMAL_BALL_MATNI,
    tavsif: "Murakkab tahliliy va hisoblash masalalarini yuqori aniqlikda yecha oladi.",
  },
  A: {
    darajaNomi: "A'lo daraja (A)",
    imtiyoz: MAKSIMAL_BALL_MATNI,
    tavsif: "Chuqurlashtirilgan nazariya va hisobiy masalalar yaxshi o'zlashtirilgan.",
  },
  "B+": {
    darajaNomi: "Yaxshi daraja (B+)",
    imtiyoz: PROPORSIONAL_BALL_MATNI,
    tavsif: "Umumiy va noorganik kimyo mustahkam, ayrim masalalarda kichik xatoliklar bor.",
  },
  B: {
    darajaNomi: "O'rta-yuqori daraja (B)",
    imtiyoz: PROPORSIONAL_BALL_MATNI,
    tavsif: "O'rta murakkablikdagi savollar ishlangan, amaliy masalalarni takrorlash kerak.",
  },
  "C+": {
    darajaNomi: "Qoniqarli daraja (C+)",
    imtiyoz: PROPORSIONAL_BALL_MATNI,
    tavsif: "Boshlang'ich tushunchalar bor, hisoblash va formulalar ustida ishlash lozim.",
  },
  C: {
    darajaNomi: "Minimal daraja (C)",
    imtiyoz: PROPORSIONAL_BALL_MATNI,
    tavsif: "Maktab dasturining asosiy qismlari qamrab olingan.",
  },
}

/**
 * Darajani faqat ball belgilaydi. Nega foiz va theta bu yerda yo'q: avval uchtasi
 * "yoki" bilan bog'langan edi va daraja eng yengil shartdan chiqardi.
 *
 * @param {number} shkalaBalli
 */
export function aniqlaDaraja(shkalaBalli) {
  const topilgan = DARAJA_CHEGARALARI.find((c) => shkalaBalli >= c.minBall)
  if (topilgan) {
    return { daraja: topilgan.daraja, ...DARAJA_MATNLARI[topilgan.daraja] }
  }
  const minimal = DARAJA_CHEGARALARI[DARAJA_CHEGARALARI.length - 1].minBall
  return {
    daraja: "Qoniqarsiz",
    darajaNomi: "Sertifikat berilmaydi",
    imtiyoz: `JDA Kimyo sertifikati uchun kamida ${minimal} ball kerak.`,
    tavsif: "Tayanch mavzularni qaytadan o'rganish tavsiya etiladi.",
  }
}

/**
 * Wright Map (Persona-Savol Xaritasi) ma'lumotlarini shakllantirish.
 * Bu grafik o'quvchining qobiliyati (theta) qaysi savollardan yuqori va qaysilaridan past ekanini ko'rsatadi.
 *
 * @param {number} theta O'quvchining bilim logiti
 * @param {Array<{ id: number|string, mavzu: string, qiyinlik: number }>} savollar
 * @param {number[]} javoblar
 */
export function tuzWrightMap(theta, savollar, javoblar) {
  return savollar.map((s, index) => {
    const b = Number(s.qiyinlik) || 0
    const togridanTogri = javoblar[index] === 1
    const p = raschEhtimollik(theta, b)

    // Holat:
    // O'zlashtirilgan: o'quvchining thetasi savol qiyinligidan yuqori (theta > b)
    // Chegara: theta taxminan b ga teng (|theta - b| <= 0.4)
    // O'rganish kerak: savol qiyinroq (theta < b)
    let holat = "chegara"
    if (theta - b > 0.4) holat = "ozlashtirilgan"
    else if (b - theta > 0.4) holat = "murakkab"

    return {
      id: s.id,
      mavzu: s.mavzu || `${index + 1}-savol`,
      qiyinlik: b,
      ehtimollikFoiz: Math.round(p * 100),
      togri: togridanTogri,
      holat,
    }
  })
}
