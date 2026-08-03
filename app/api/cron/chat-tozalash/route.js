// app/api/cron/chat-tozalash/route.js
//
// Eski xabarlarni o'chiradi (vercel.json dagi cron chaqiradi).
//
// NEGA SAQLASH MUDDATI BOR. Matn juda kam joy egallaydi va 72 soatda
// o'chirish chatni ishlatib bo'lmaydigan qiladi — o'tgan haftagi
// kelishuvni topib bo'lmaydi. Lekin cheksiz saqlash ham to'g'ri emas:
// baza o'sadi va eski shaxsiy yozishmalar hech kimga kerak emas.
// lib/chat.js dagi SAQLASH_KUNI — yarim yil.
//
// Shikoyat ochiq turgan suhbatlar TEGILMAYDI: dalil o'chib ketsa,
// admin qaror qabul qila olmaydi.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SAQLASH_KUNI } from '@/lib/chat'

export async function GET(request) {
  // Vercel cron so'roviga sarlavha qo'shadi; tashqaridan chaqirilsa
  // CRON_SECRET talab qilinadi (o'rnatilgan bo'lsa)
  const sir = process.env.CRON_SECRET
  if (sir) {
    const kelgan = request.headers.get('authorization')
    if (kelgan !== `Bearer ${sir}`) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  try {
    const chegara = new Date(Date.now() - SAQLASH_KUNI * 24 * 60 * 60 * 1000)

    const ochiqShikoyatlar = await prisma.chatReport.findMany({
      where: { holat: { in: ['yangi', 'korildi'] } },
      select: { conversationId: true },
    })
    const tegilmaydi = [...new Set(ochiqShikoyatlar.map((s) => s.conversationId))]

    const natija = await prisma.message.deleteMany({
      where: {
        createdAt: { lt: chegara },
        ...(tegilmaydi.length ? { conversationId: { notIn: tegilmaydi } } : {}),
      },
    })

    // Xabarsiz qolgan bo'sh suhbatlar ham ketadi
    const boshSuhbatlar = await prisma.conversation.deleteMany({
      where: {
        xabarlar: { none: {} },
        createdAt: { lt: chegara },
      },
    })

    return NextResponse.json({
      success: true,
      ochirilganXabar: natija.count,
      ochirilganSuhbat: boshSuhbatlar.count,
      chegara,
      saqlanganSuhbat: tegilmaydi.length,
    })
  } catch (error) {
    console.error('[Chat tozalash]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
