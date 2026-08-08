// app/api/admin/telegram/foydalanuvchilar/route.js
//
// Botga ulangan foydalanuvchilar ro'yxati.
//
// NEGA ALOHIDA YO'L. Asosiy `/api/admin/telegram` holat uchun — u
// sahifa ochilishi bilan chaqiriladi va Telegramga ikkita so'rov
// yuboradi. Foydalanuvchilar ro'yxati esa sahifalanadi va qidiriladi,
// ya'ni har safar boshqa parametr bilan qayta so'raladi. Bittaga
// qo'shilsa, har qidiruvda webhook holati ham keraksiz tekshirilardi.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

const SAHIFADA = 25

export async function GET(request) {
  // Bot butun sayt uchun bitta — uni ko'rish ham superadmin ishi
  const { isSuperAdmin } = await checkAdminAuth()
  if (!isSuperAdmin) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const qidiruv = (searchParams.get('q') || '').trim()
  const sahifa = Math.max(1, Number(searchParams.get('sahifa')) || 1)

  // Qidiruv foydalanuvchi nomi, to'liq ismi va Telegram username
  // bo'yicha. chatId ham qidiriladi: shikoyat kelganda admin qo'lida
  // ko'pincha faqat shu raqam bo'ladi.
  const shart = qidiruv
    ? {
        OR: [
          { username: { contains: qidiruv, mode: 'insensitive' } },
          { chatId: { contains: qidiruv } },
          { user: { username: { contains: qidiruv, mode: 'insensitive' } } },
          { user: { fullName: { contains: qidiruv, mode: 'insensitive' } } },
        ],
      }
    : {}

  const [jami, xabarlarYoqilgan, yozuvlar] = await Promise.all([
    prisma.telegramUlanish.count({ where: shart }),
    prisma.telegramUlanish.count({ where: { ...shart, xabarlar: true } }),
    prisma.telegramUlanish.findMany({
      where: shart,
      orderBy: { bogladi: 'desc' },
      skip: (sahifa - 1) * SAHIFADA,
      take: SAHIFADA,
      select: {
        id: true,
        chatId: true,
        username: true,
        xabarlar: true,
        bogladi: true,
        user: {
          select: {
            id: true,
            userId: true,
            username: true,
            fullName: true,
            role: true,
            coins: true,
            isBanned: true,
            emailVerified: true,
          },
        },
      },
    }),
  ])

  return NextResponse.json({
    success: true,
    jami,
    xabarlarYoqilgan,
    sahifa,
    sahifalar: Math.max(1, Math.ceil(jami / SAHIFADA)),
    foydalanuvchilar: yozuvlar.map((y) => ({
      id: y.id,
      chatId: y.chatId,
      tgUsername: y.username,
      xabarlar: y.xabarlar,
      bogladi: y.bogladi,
      userId: y.user.userId,
      username: y.user.username,
      fullName: y.user.fullName,
      role: y.user.role,
      coins: y.user.coins,
      bloklangan: y.user.isBanned,
      // Sana emas, faqat "tasdiqlanganmi" — aniq vaqt admin uchun
      // ahamiyatsiz, xizmatga ruxsat esa shunga bog'liq
      emailTasdiqlangan: Boolean(y.user.emailVerified),
    })),
  })
}
