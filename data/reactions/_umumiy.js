/**
 * data/reactions — reaksiyalar bazasining manbasi.
 *
 * Nega alohida fayllarda: baza ichida tahrirlash qiyin, git'da ko'rinmaydi va
 * xatoni topib bo'lmaydi. Bu yerda esa har bir reaksiya matn ko'rinishida
 * turadi, o'zgarish tarixi saqlanadi va HAR BIR TENGLAMA balans tekshiruvidan
 * o'tadi (scripts/check-reactions.js).
 *
 * Qoidalar:
 *
 * 1. Tenglama muvozanatli bo'lishi shart. Tekshiruvchi o'tkazmasa — baza
 *    yangilanmaydi.
 *
 * 2. Bilinmagan maydon BO'SH qoldiriladi. Mexanizmni yoki unumni o'ylab topish
 *    — talabaga soxta kimyo o'rgatish. Ilova bo'sh maydonni "to'ldirilmoqda"
 *    deb ko'rsatadi, bu halolroq.
 *
 * 3. Xavfsizlik (hazards) bu yerda yozilmaydi — u PubChem'dan avtomatik
 *    olinadi (scripts/enrich-reactions-pubchem.js). Sababi: xavfsizlik
 *    ma'lumoti eng jiddiy qismi va uning manbasi ko'rsatilishi kerak.
 *
 * 4. isVerified — bu yerda emas, kimyogar admin panelda qo'yadi.
 */

/** Har bir reaksiyada bo'lishi mumkin bo'lgan maydonlar (schema.prisma bilan bir xil) */
const MAYDONLAR = [
  'equation', 'name', 'description', 'category', 'reactionType',
  'temperature', 'pressure', 'catalyst', 'environment',
  'mechanism', 'intermediates',
  'solvents', 'bestSolvent', 'solventEffect',
  'scale', 'scaleNote',
  'rateFactors',
  'techniques', 'equipment', 'hazards', 'observations', 'yieldInfo',
  'source', 'sourceUrl',
]

/**
 * Oila faylini bitta ro'yxatga yoyadi: umumiy maydonlar har bir reaksiyaga
 * qo'shiladi, reaksiyaning o'z qiymati ustun turadi.
 */
function oilaniYoy(oila) {
  const { kategoriya, umumiy = {}, reaksiyalar } = oila

  return reaksiyalar.map((r) => {
    const natija = { category: kategoriya, ...umumiy, ...r }

    const notogri = Object.keys(natija).filter((k) => !MAYDONLAR.includes(k))
    if (notogri.length > 0) {
      throw new Error(
        `"${r.equation}" da noma'lum maydon: ${notogri.join(', ')}\n` +
          `Ruxsat etilganlari: ${MAYDONLAR.join(', ')}`,
      )
    }

    return natija
  })
}

module.exports = { MAYDONLAR, oilaniYoy }
