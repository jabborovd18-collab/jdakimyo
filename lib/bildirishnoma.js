// lib/bildirishnoma.js
//
// Bildirishnoma yuborishning YAGONA joyi.
//
// Nega alohida fayl: xabar yuborish har xil joydan chaqiriladi (admin
// tanga berganda, taqiq qo'yganda, rol o'zgarganda). Har birida alohida
// `prisma.notification.create` yozilsa, turi va matn shakli bir-biridan
// farq qilib ketardi va keyin ularni bir joyda o'zgartirib bo'lmasdi.
//
// MUHIM QOIDA: bildirishnoma yuborilmagani asosiy amalni YIQITMAYDI.
// Admin tanga berdi, lekin xabar yozilmadi — bu tanga berilmagani degani
// emas. Shuning uchun bu yerdagi xatolar yutiladi va faqat konsolga
// yoziladi.
import { prisma } from './prisma'

/**
 * Turlar ro'yxati. Faqat guruhlash va ikonka uchun — baza uni
 * tekshirmaydi, ya'ni yangi tur qo'shish migratsiya talab qilmaydi.
 */
export const TURLAR = {
  tanga: { icon: '🪙', rang: 'amber' },
  olmos: { icon: '💎', rang: 'cyan' },
  taqiq: { icon: '🚫', rang: 'red' },
  'taqiq-olindi': { icon: '✅', rang: 'green' },
  rol: { icon: '🎖️', rang: 'purple' },
  blok: { icon: '⛔', rang: 'red' },
  'blok-olindi': { icon: '🔓', rang: 'green' },
  parol: { icon: '🔑', rang: 'orange' },
  sertifikat: { icon: '📜', rang: 'yellow' },
  dost: { icon: '👥', rang: 'blue' },
  tizim: { icon: '🔔', rang: 'purple' },
}

/**
 * Bitta foydalanuvchiga xabar yuboradi.
 *
 * @param {string} userId
 * @param {{turi: string, sarlavha: string, matn?: string, havola?: string,
 *          icon?: string, adminId?: string}} xabar
 * @returns {Promise<object|null>} yozuv, yoki yozilmasa null
 */
export async function xabarYubor(userId, xabar) {
  if (!userId || !xabar?.sarlavha) return null

  try {
    return await prisma.notification.create({
      data: {
        userId,
        turi: xabar.turi || 'tizim',
        sarlavha: xabar.sarlavha,
        matn: xabar.matn || null,
        havola: xabar.havola || null,
        icon: xabar.icon || TURLAR[xabar.turi]?.icon || TURLAR.tizim.icon,
        adminId: xabar.adminId || null,
      },
    })
  } catch (e) {
    console.error('[Bildirishnoma] yozilmadi:', e.message)
    return null
  }
}

/** Bir nechta foydalanuvchiga bir xil xabar (e'lon, tizim xabari) */
export async function xabarYuborKopga(userIdlar, xabar) {
  const royxat = [...new Set(userIdlar || [])].filter(Boolean)
  if (royxat.length === 0 || !xabar?.sarlavha) return 0

  try {
    const natija = await prisma.notification.createMany({
      data: royxat.map((userId) => ({
        userId,
        turi: xabar.turi || 'tizim',
        sarlavha: xabar.sarlavha,
        matn: xabar.matn || null,
        havola: xabar.havola || null,
        icon: xabar.icon || TURLAR[xabar.turi]?.icon || TURLAR.tizim.icon,
        adminId: xabar.adminId || null,
      })),
    })
    return natija.count
  } catch (e) {
    console.error('[Bildirishnoma] ommaviy yozuv yiqildi:', e.message)
    return 0
  }
}

/**
 * Qizil nuqtalar uchun sonlar.
 *
 * Bir so'rovda hammasi: kabinet menyusidagi har bir belgi uchun alohida
 * so'rov yuborilsa, sahifa ochilishida beshta ortiqcha so'rov bo'lardi.
 */
export async function sanoqniOl(userId) {
  const [oqilmagan, dostTaklifi, chat] = await Promise.all([
    prisma.notification.count({ where: { userId, oqilgan: false } }),
    prisma.friendRequest.count({ where: { receiverId: userId, status: 'pending' } }),
    // O'qilmagan xabar — faqat faol suhbatlarda. So'rovlar alohida
    // bo'limda turadi va ular qizil nishon chiqarmaydi: notanish odam
    // yozgani bilan e'tiborni majburan tortib olmasligi kerak.
    prisma.message.count({
      where: {
        oqilgan: false,
        senderId: { not: userId },
        conversation: {
          holat: 'faol',
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
      },
    }),
  ])

  return { oqilmagan, dostTaklifi, chat, jami: oqilmagan + dostTaklifi + chat }
}

/** Ro'yxat — eng yangisi birinchi */
export async function royxatniOl(userId, { chegara = 30, faqatOqilmagan = false } = {}) {
  return prisma.notification.findMany({
    where: { userId, ...(faqatOqilmagan ? { oqilgan: false } : {}) },
    orderBy: { createdAt: 'desc' },
    take: Math.min(Math.max(Number(chegara) || 30, 1), 100),
    select: {
      id: true, turi: true, sarlavha: true, matn: true, havola: true,
      icon: true, oqilgan: true, createdAt: true,
      admin: { select: { username: true, fullName: true } },
    },
  })
}

/**
 * O'qilgan deb belgilaydi.
 *
 * `userId` shart WHERE ichida: aks holda id ni bilgan odam boshqaning
 * xabarini o'qilgan qilib qo'yishi mumkin bo'lardi.
 */
export async function oqilganDebBelgila(userId, idlar = null) {
  const where = { userId, oqilgan: false }
  if (Array.isArray(idlar) && idlar.length > 0) where.id = { in: idlar }

  const natija = await prisma.notification.updateMany({
    where,
    data: { oqilgan: true, oqilganVaqt: new Date() },
  })
  return natija.count
}

