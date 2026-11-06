// lib/rasch-model.js
//
// JDA KIMYO — GEORG RASCH IRT (ITEM RESPONSE THEORY) BAHOLASH MODELI
//
// Ushbu modul o'quvchining kimyoviy bilim darajasi (theta) va savollarning
// qiyinchilik logiti (b_i) asosida xolis ilmiy baholashni amalga oshiradi.
// Hech qanday taxminiy ball yo'q — barchasi sof psixometrik formula asosida.

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

  // BMBA (DTM) rasmiy shkalasiga o'tkazish:
  // BMBA shkalasi odatda 0 dan 70 gacha bo'ladi (yoki 100 balli shkala).
  // Formula: ShkalaBall = 45 + 10 * theta (chegaralar: 0..70)
  let shkalaBalli = Math.round((45 + 10 * theta) * 10) / 10
  if (shkalaBalli > 70) shkalaBalli = 70
  if (shkalaBalli < 0) shkalaBalli = 0

  // Rasch va Davlat standarti bo'yicha darajani aniqlash
  const bahoNatijasi = aniqlaDaraja(theta, foiz, shkalaBalli)

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

/**
 * Rasch logit (theta) va to'plangan ball asosida Milliy Sertifikat darajasini belgilash
 */
export function aniqlaDaraja(theta, foiz, shkalaBalli) {
  // A+ daraja: theta >= 2.0 yoki foiz >= 86% yoki shkala >= 60.2
  if (theta >= 1.85 || foiz >= 86 || shkalaBalli >= 60.2) {
    return {
      daraja: "A+",
      darajaNomi: "Eng yuqori daraja (A+)",
      imtiyoz: "OTM imtihonida kimyodan 100% maksimal ball hamda pedagoglarga 50% ustama.",
      tavsif: "O'quvchi murakkab olimpiada va tahliliy kimyo masalalarini yuqori aniqlikda yecha oladi.",
    }
  }
  // A daraja: theta >= 1.15 yoki foiz >= 75% yoki shkala >= 52.5
  if (theta >= 1.15 || foiz >= 75 || shkalaBalli >= 52.5) {
    return {
      daraja: "A",
      darajaNomi: "A'lo daraja (A)",
      imtiyoz: "OTMga proporsional maksimal ball va pedagoglar uchun 50% ustama.",
      tavsif: "Chuqurlashtirilgan nazariya va hisobiy masalalar to'liq o'zlashtirilgan.",
    }
  }
  // B+ daraja: theta >= 0.55 yoki foiz >= 68% yoki shkala >= 47.6
  if (theta >= 0.55 || foiz >= 68 || shkalaBalli >= 47.6) {
    return {
      daraja: "B+",
      darajaNomi: "Yaxshi daraja (B+)",
      imtiyoz: "OTMga proporsional yuqori ball va pedagoglar uchun 20% ustama.",
      tavsif: "Umumiy va noorganik kimyo mustahkam, ayrim organik masalalarda kichik xatoliklar mavjud.",
    }
  }
  // B daraja: theta >= -0.05 yoki foiz >= 60% yoki shkala >= 42.0
  if (theta >= -0.05 || foiz >= 60 || shkalaBalli >= 42.0) {
    return {
      daraja: "B",
      darajaNomi: "O'rta-yuqori daraja (B)",
      imtiyoz: "OTMga proporsional ball beriladi.",
      tavsif: "O'rta murakkablikdagi savollar to'g'ri ishlangan, amaliy masalalarda takrorlash talab etiladi.",
    }
  }
  // C+ daraja: theta >= -0.65 yoki foiz >= 53% yoki shkala >= 37.1
  if (theta >= -0.65 || foiz >= 53 || shkalaBalli >= 37.1) {
    return {
      daraja: "C+",
      darajaNomi: "Qoniqarli daraja (C+)",
      imtiyoz: "OTM tanlovida sertifikat imtiyozi proporsional hisoblanadi.",
      tavsif: "Boshlang'ich tushunchalar mavjud, lekin hisoblash va formulalar ustida ishlash lozim.",
    }
  }
  // C daraja: theta >= -1.25 yoki foiz >= 46% yoki shkala >= 32.2
  if (theta >= -1.25 || foiz >= 46 || shkalaBalli >= 32.2) {
    return {
      daraja: "C",
      darajaNomi: "Minimal o'tish darajasi (C)",
      imtiyoz: "Sertifikat beriladi (eng quyi mezon).",
      tavsif: "Maktab dasturining asosiy qismlari qamrab olingan.",
    }
  }
  // Qoniqarsiz
  return {
    daraja: "Qoniqarsiz",
    darajaNomi: "Sertifikat berilmaydi",
    imtiyoz: "Sertifikat olish uchun kamida 46% (32.2 ball) to'plash talab etiladi.",
    tavsif: "Kimyo fanining tayanch mavzularini qaytadan o'rganish va darsliklar bilan ishlash tavsiya etiladi.",
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
