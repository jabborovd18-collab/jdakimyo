// data/milliy-sertifikat/savollar-ombromi.js
//
// Tayyorgarlik sinovlarining savol banki. FAQAT serverda import qilinadi.
//
// Bank bo'sh: eski savollar olib tashlangan, yangilari kiritilmoqda. Savol
// qo'shilgach, lib/milliy-sertifikat-data.js da sinovning holati "ochiq"
// qilinadi va `npm run ms:bank` xatosiz o'tishi kerak.
//
// Savol shakli:
//   Matnli (variantlar har sessiyada aralashadi, correct — to'g'ri variant indeksi):
//     { id: 1, mavzu, soha, qiyinlik: 0.5, question: "...",
//       options: ["...", "...", "...", "..."], correct: 0, explanation: "..." }
//   Rasmli (variantlar rasm ichida, aralashmaydi, correct — harf):
//     { id: 2, turi: "variant", mavzu, soha, qiyinlik: 0.5, rasm: "/images/...",
//       options: ["A", "B", "C", "D"], correct: "C", explanation: "..." }
//   Ochiq (sonli javob):
//     { id: 3, turi: "ochiq", mavzu, soha, qiyinlik: 1.5, rasm: "/images/...",
//       correct: "22.3", explanation: "..." }

const SAVOLLAR_BANKI = {
  "rasch-diagnostika": [],
  "milliy-sertifikat-simulyator": [],
  "milliy-sertifikat-simulyator-2": [],
  "attestatsiya-sinov": [],
}

/**
 * Nega noma'lum slug bo'sh qaytadi: avval boshqa sinovga jim o'tib ketardi va
 * foydalanuvchi so'ramagan savollarni ishlardi.
 */
export function getSavollarBySlug(slug) {
  return SAVOLLAR_BANKI[slug] || []
}

/**
 * Javobning to'g'ri yoki noto'g'ri ekanini tekshiruvchi universal funksiya.
 * Harflar (A-D, A-F), indekslar (0-3) va sonli oraliqlar (±0.05) bilan to'liq ishlaydi.
 */
export function tekshirJavob(savol, berilganJavob) {
  if (!savol || berilganJavob === undefined || berilganJavob === null || berilganJavob === "") {
    return false
  }

  // OCHIQ SONLI SAVOLLAR
  if (savol.turi === "ochiq") {
    const tozaBerilgan = String(berilganJavob).trim().replace(",", ".")
    const tozaKutilgan = String(savol.correct).trim().replace(",", ".")
    const bSon = parseFloat(tozaBerilgan)
    const kSon = parseFloat(tozaKutilgan)

    if (!isNaN(bSon) && !isNaN(kSon)) {
      return Math.abs(bSon - kSon) <= 0.05001
    }
    // Agar altCorrect bo'lsa
    if (savol.altCorrect) {
      const altSon = parseFloat(String(savol.altCorrect).trim().replace(",", "."))
      if (!isNaN(bSon) && !isNaN(altSon)) {
        return Math.abs(bSon - altSon) <= 0.05001
      }
    }
    return tozaBerilgan === tozaKutilgan
  }

  // VARIANTLI VA MOSLASHTIRISH SAVOLLARI
  const kutilgan = savol.correct

  // Agar kutilgan raqam (0, 1, 2, 3) bo'lsa (rasch-diagnostika)
  if (typeof kutilgan === "number") {
    // Berilgan javob raqam bo'lsa
    if (typeof berilganJavob === "number") {
      return kutilgan === berilganJavob
    }
    // Berilgan javob 'A', 'B', 'C', 'D' bo'lsa
    const harf = String(berilganJavob).trim().toUpperCase()
    const harfIndeks = ["A", "B", "C", "D"].indexOf(harf)
    if (harfIndeks !== -1) {
      return kutilgan === harfIndeks
    }
    // Berilgan javob matn bo'lsa
    if (savol.options && savol.options[kutilgan]) {
      return String(savol.options[kutilgan]).trim().toLowerCase() === String(berilganJavob).trim().toLowerCase()
    }
  }

  // Agar kutilgan harf ('A', 'B', 'C', 'D', 'E', 'F') bo'lsa
  const kutilganHarf = String(kutilgan).trim().toUpperCase()
  if (typeof berilganJavob === "number") {
    const harflar = ["A", "B", "C", "D", "E", "F"]
    return harflar[berilganJavob] === kutilganHarf
  }

  return String(berilganJavob).trim().toUpperCase() === kutilganHarf
}
