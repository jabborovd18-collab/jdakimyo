// lib/qaydnoma.js
//
// Admin harakatlarini AuditLog ga yozish.
//
// NEGA KERAK. Qaydnoma jadvali bor edi, lekin unga faqat bir nechta yo'l
// yozardi: sertifikat, parol tiklash, valyuta, sozlamalar. Quiz qo'shish,
// birikma o'chirish yoki izohni yo'q qilish hech qayerda qolmasdi — ya'ni
// "oxirgi amallar" oynasi ochilganda u deyarli bo'sh bo'lardi va
// moderatorning ishi umuman ko'rinmasdi.
//
// MUHIM QOIDA: qaydnoma yozilmagani asosiy amalni YIQITMAYDI. Quiz
// qo'shildi-yu qayd yozilmadi — bu quiz qo'shilmagani degani emas.
// Shuning uchun xatolar yutiladi va faqat konsolga chiqadi.
import { prisma } from './prisma'

/** So'rovdan IP va brauzer ma'lumotini oladi */
export function sorovManbasi(request) {
  return {
    ipAddress:
      request?.headers?.get('x-forwarded-for')?.split(',')[0].trim() ||
      request?.headers?.get('x-real-ip') ||
      null,
    userAgent: request?.headers?.get('user-agent') || null,
  }
}

/**
 * Qaydnomaga yozadi.
 *
 * @param {object} p
 * @param {string} p.adminId
 * @param {string} p.action     — "createQuiz", "deleteComment", "updateCompound"...
 * @param {string} p.targetType — "QuizQuestion", "Compound", "ForumComment"...
 * @param {string=} p.targetId
 * @param {string=} p.details   — odam o'qiydigan izoh
 * @param {Request=} p.request  — IP va brauzer uchun
 */
export async function qaydEt({ adminId, action, targetType, targetId, details, request }) {
  if (!adminId || !action) return null

  try {
    return await prisma.auditLog.create({
      data: {
        adminId,
        action,
        targetType: targetType || 'Tizim',
        targetId: targetId || null,
        details: details ? String(details).slice(0, 500) : null,
        ...sorovManbasi(request),
      },
    })
  } catch (e) {
    console.error('[Qaydnoma] yozilmadi:', e.message)
    return null
  }
}
