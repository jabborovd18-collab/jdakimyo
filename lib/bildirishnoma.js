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
import {
  telegramYubor, tgHimoyala, telegramSozlanganmi, sarlavhaBelgisi,
} from './telegram'

const SAYT = 'https://www.jdakimyo.uz'

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

  let yozuv = null
  try {
    yozuv = await prisma.notification.create({
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

  // Telegram — QO'SHIMCHA yo'l, asosiysi emas. Saytdagi yozuv
  // yaratilgandan KEYIN va alohida try ichida: Telegram ishlamasa
  // ham kabinetdagi qo'ng'iroqda xabar turishi kerak.
  await telegramgaTashla(userId, xabar)

  return yozuv
}

/**
 * Xabarni Telegramga ham yuboradi (ulangan va yoqilgan bo'lsa).
 *
 * NEGA HECH QACHON XATO TASHLAMAYDI. Bu funksiya admin amali yoki
 * do'stlik so'rovi ichidan chaqiriladi. Telegram javob bermagani
 * uchun tanga berilmay qolishi mumkin emas.
 */
async function telegramgaTashla(userId, xabar) {
  if (!telegramSozlanganmi()) return

  try {
    const ulanish = await prisma.telegramUlanish.findUnique({
      where: { userId },
      select: { chatId: true, xabarlar: true },
    })

    if (!ulanish || !ulanish.xabarlar) return
    await bittaChatga(ulanish.chatId, xabar)
  } catch (e) {
    console.error('[Bildirishnoma] Telegramga ketmadi:', e.message)
  }
}

/**
 * Ommaviy xabar uchun.
 *
 * NEGA ALOHIDA. Har foydalanuvchi uchun `telegramgaTashla` chaqirilsa,
 * 200 kishilik e'lon bazaga 200 ta alohida so'rov qilardi — holbuki
 * ulanganlar ro'yxati BITTA so'rov bilan olinadi. Aksariyat
 * foydalanuvchi Telegramni ulamaydi, ya'ni o'sha so'rovlarning
 * ko'pchiligi bo'sh qaytardi.
 */
async function telegramgaTashlaKopga(userIdlar, xabar) {
  if (!telegramSozlanganmi()) return

  try {
    const ulanganlar = await prisma.telegramUlanish.findMany({
      where: { userId: { in: userIdlar }, xabarlar: true },
      select: { chatId: true },
    })

    if (ulanganlar.length === 0) return

    // Telegram sekundiga ~30 xabar qabul qiladi; undan tez yuborilsa
    // ortiqchasiga 429 qaytaradi. Yigirmatalik bo'laklar bilan
    // yuboramiz — navbat qurishdan ancha sodda va shu hajmda yetarli.
    for (let i = 0; i < ulanganlar.length; i += 20) {
      const bolak = ulanganlar.slice(i, i + 20)
      // `allSettled` — bittasi yiqilsa (odam botni bloklagan)
      // qolganlari to'xtamasin
      await Promise.allSettled(bolak.map((u) => bittaChatga(u.chatId, xabar)))
    }
  } catch (e) {
    console.error('[Bildirishnoma] ommaviy Telegram yiqildi:', e.message)
  }
}

/** Xabarni Telegram ko'rinishiga o'girib yuboradi */
function bittaChatga(chatId, xabar) {
  const icon = xabar.icon || TURLAR[xabar.turi]?.icon || TURLAR.tizim.icon
  // Sarlavhaning o'zi emoji bilan boshlansa ikonka qo'shilmaydi —
  // aks holda "🎁 🎁 falonchi sizga sovg'a yubordi" bo'lib chiqadi
  const qatorlar = [
    `${sarlavhaBelgisi(icon, xabar.sarlavha)}<b>${tgHimoyala(xabar.sarlavha)}</b>`,
  ]
  if (xabar.matn) qatorlar.push(tgHimoyala(xabar.matn))

  return telegramYubor(
    chatId,
    qatorlar.join('\n'),
    // `havola` bazada nisbiy saqlanadi ("/profil/dostlar"), Telegram
    // esa to'liq manzil talab qiladi
    xabar.havola
      ? { havola: { matn: 'Saytda ochish', url: `${SAYT}${xabar.havola}` } }
      : {}
  )
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
    await telegramgaTashlaKopga(royxat, xabar)

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

