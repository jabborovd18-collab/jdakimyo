// lib/sertifikat.js
//
// Sertifikatni tekshirish mantig'ining YAGONA joyi. Ikkita chaqiruvchi bor:
//   1) /sertifikat/verify/[certId]   — QR kod olib keladigan sahifa
//   2) /api/sertifikat/[certId]      — tashqi tekshiruv uchun ochiq endpoint
// Ikkisi bir-biridan farq qilib qolmasligi uchun mantiq shu yerda saqlanadi.
import { prisma } from './prisma'
import { tozala } from './maxfiylik'

/**
 * Profildan havola qo'yish mumkinmi?
 *
 * privacySettings bazada bir xil saqlanmagan: ba'zi yozuvlarda obyekt, ba'zida
 * JSON matn (ikki marta kodlangan). O'qish va o'girish lib/maxfiylik.js da,
 * matnni ochib bo'lmasa u eng yopiq holatni tanlaydi.
 */
export function profilOchiqmi(privacySettings) {
  // Uch darajali sozlama (lib/maxfiylik.js) bilan bir xil o'qish.
  // Bu yerdagi savol tor: sertifikat sahifasidan profilga HAVOLA
  // qo'yiladimi. Faqat "hamma" darajasida qo'yiladi — "do'stlarga"
  // deganda havolani ochgan odam kim ekani noma'lum, ya'ni havola
  // ko'pchilik uchun yopiq sahifaga olib borardi.
  const sozlama = tozala(privacySettings)
  return sozlama.profil === 'hamma'
}

/**
 * Sertifikatni raqami bo'yicha topadi va tekshiruv natijasini qaytaradi.
 *
 * Qaytadigan ma'lumot OCHIQ ko'rsatiladi, shuning uchun faqat sertifikatning
 * o'zida yozilgan narsalar qaytariladi — email va userId bu yerdan chiqmaydi.
 *
 * @returns {Promise<{valid: boolean, invalidReason: string|null, certificate: object}|null>}
 *          Topilmasa null.
 */
export async function sertifikatniTekshir(certId) {
  // Raqam qog'ozdan qo'lda ko'chiriladi — kichik harfda yozilsa ham topilsin.
  // Yaratilgan raqamlar doim katta harfda (JDA-2026-K7M2QP).
  const raqam = String(certId || '').trim().toUpperCase()
  if (!raqam) return null

  const certificate = await prisma.certificate.findUnique({
    where: { certId: raqam },
    include: {
      // userId — ommaviy profil manzilida ishlatiladigan identifikator
      // (/profil/<userId>), bazadagi ichki id emas.
      user: { select: { userId: true, username: true, avatar: true, privacySettings: true } },
    },
  })

  if (!certificate) return null

  const muddatiTugagan =
    certificate.expiresAt !== null && new Date() > certificate.expiresAt
  const valid = certificate.status === 'valid' && !muddatiTugagan

  const profilOchiq = profilOchiqmi(certificate.user?.privacySettings)

  return {
    valid,
    invalidReason: valid
      ? null
      : muddatiTugagan
        ? 'Sertifikat muddati tugagan'
        : 'Sertifikat bekor qilingan',
    certificate: {
      certId: certificate.certId,
      fullName: certificate.fullName,
      fan: certificate.fan,
      reason: certificate.reason,
      description: certificate.description,
      seals: certificate.seals,
      examName: certificate.examName,
      grade: certificate.grade,
      score: certificate.score,
      percentage: certificate.percentage,
      percentile: certificate.percentile,
      issuedAt: certificate.issuedAt,
      expiresAt: certificate.expiresAt,
      status: certificate.status,
      username: profilOchiq ? certificate.user?.username || null : null,
      profilId: profilOchiq ? certificate.user?.userId || null : null,
      avatar: profilOchiq ? certificate.user?.avatar || null : null,
    },
  }
}
