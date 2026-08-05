// lib/cron-ishlar.js
//
// Cron bajaradigan ishlar — HAR BIRI ALOHIDA FUNKSIYA.
//
// NEGA YIG'ILDI. Vercel'ning Hobby tarifida atigi IKKITA cron
// bo'ladi, loyihada esa beshta yozilgan edi. Ortiqchalari jimgina
// ro'yxatga olinmaydi: hech qanday xato chiqmaydi, shunchaki
// ishlamaydi. Qaysi biri qolgani ham noma'lum.
//
// Shuning uchun ishlar marshrutlardan ajratildi va endi ikkita
// "dispetcher" cron ularni kerakli kunda chaqiradi. Eski
// marshrutlar ham qoldi — ular shu funksiyalarni chaqiradi, ya'ni
// mantiq bir joyda. Ularni qo'lda ham chaqirish mumkin.
import { prisma } from './prisma'
import { kunlikMissiyalar, missiyaYozuvi, missiyaKuni } from './missions'
import { SAQLASH_KUNI } from './chat'

/** Bugungi uchta missiyani yaratadi (allaqachon bo'lsa tegmaydi) */
export async function missiyalarniYarat() {
  const bugun = missiyaKuni()

  // Uchlik sanadan kelib chiqadi — cron va sahifa mustaqil chaqirilsa
  // ham bir xil missiyalarni beradi.
  const natija = await prisma.mission.createMany({
    data: kunlikMissiyalar(bugun).map((shablon) => missiyaYozuvi(shablon, bugun)),
    skipDuplicates: true,
  })

  return { yaratildi: natija.count }
}

/** Haftalik yulduzlarni nolga qaytaradi */
export async function haftalikniTozala() {
  const natija = await prisma.user.updateMany({ data: { weeklyStars: 0 } })
  return { tozalandi: natija.count }
}

/**
 * Eski chat xabarlarini o'chiradi.
 *
 * Shikoyat ochiq turgan suhbatlar TEGILMAYDI: dalil o'chib ketsa,
 * admin qaror qabul qila olmaydi.
 */
export async function chatniTozala() {
  const chegara = new Date(Date.now() - SAQLASH_KUNI * 24 * 60 * 60 * 1000)

  const ochiqShikoyatlar = await prisma.chatReport.findMany({
    where: { holat: { in: ['yangi', 'korildi'] } },
    select: { conversationId: true },
  })
  const tegilmaydi = [...new Set(ochiqShikoyatlar.map((s) => s.conversationId))]

  const xabarlar = await prisma.message.deleteMany({
    where: {
      createdAt: { lt: chegara },
      ...(tegilmaydi.length ? { conversationId: { notIn: tegilmaydi } } : {}),
    },
  })

  const suhbatlar = await prisma.conversation.deleteMany({
    where: { xabarlar: { none: {} }, createdAt: { lt: chegara } },
  })

  return {
    ochirilganXabar: xabarlar.count,
    ochirilganSuhbat: suhbatlar.count,
    saqlanganSuhbat: tegilmaydi.length,
  }
}

/**
 * Toshkent vaqtidagi hafta kuni (0 — yakshanba, 1 — dushanba).
 *
 * UTC bo'yicha olinsa, dushanba ishlari yakshanba kechqurun
 * bajarilardi: cron UTC 19:00 da ishlaydi va Toshkentda bu
 * allaqachon ertangi kun.
 */
export function toshkentHaftaKuni(sana = new Date()) {
  return new Date(sana.getTime() + 5 * 60 * 60 * 1000).getUTCDay()
}

/** Cron so'rovining haqiqiyligini tekshiradi */
export function cronRuxsati(request) {
  const sir = process.env.CRON_SECRET
  if (!sir) return false
  return request.headers.get('authorization') === `Bearer ${sir}`
}
