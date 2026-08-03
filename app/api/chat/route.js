// app/api/chat/route.js
//
// GET  — suhbatlar ro'yxati (faol va so'rovlar alohida).
// POST — suhbat boshlash: `{ userId }` (profil sahifasidagi "Yozish").
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ChatXatosi, ODAM, sherik, suhbatniOl } from '@/lib/chat'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const menId = session.user.id

    const suhbatlar = await prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: menId }, { user2Id: menId }],
        holat: { not: 'rad' },
      },
      orderBy: [{ oxirgiXabar: 'desc' }, { createdAt: 'desc' }],
      take: 100,
      include: {
        user1: { select: ODAM },
        user2: { select: ODAM },
        xabarlar: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    })

    // O'qilmagan xabarlar soni — har bir suhbat uchun alohida so'rov
    // yubormaslik uchun bitta groupBy bilan
    const oqilmaganlar = await prisma.message.groupBy({
      by: ['conversationId'],
      where: {
        conversationId: { in: suhbatlar.map((s) => s.id) },
        senderId: { not: menId },
        oqilgan: false,
      },
      _count: true,
    })
    const oqilmaganXarita = new Map(oqilmaganlar.map((o) => [o.conversationId, o._count]))

    const royxat = suhbatlar.map((s) => {
      const sherikId = sherik(s, menId)
      const odam = s.user1Id === sherikId ? s.user1 : s.user2
      const oxirgi = s.xabarlar[0] || null

      return {
        id: s.id,
        holat: s.holat,
        // So'rovni kim boshlagani muhim: men boshlagan so'rov "kutilmoqda",
        // menga kelgani esa javob talab qiladi
        menBoshladim: s.boshlovchiId === menId,
        odam,
        oxirgiXabar: oxirgi
          ? {
              matn: oxirgi.ochirilgan ? null : oxirgi.matn.slice(0, 120),
              ochirilgan: oxirgi.ochirilgan,
              meniki: oxirgi.senderId === menId,
              createdAt: oxirgi.createdAt,
            }
          : null,
        oqilmagan: oqilmaganXarita.get(s.id) || 0,
        updatedAt: s.oxirgiXabar || s.createdAt,
      }
    })

    return NextResponse.json({
      success: true,
      faol: royxat.filter((s) => s.holat === 'faol'),
      // Menga kelgan so'rovlar alohida bo'limda turadi
      sorovlar: royxat.filter((s) => s.holat === 'sorov' && !s.menBoshladim),
      yuborilgan: royxat.filter((s) => s.holat === 'sorov' && s.menBoshladim),
      oqilmagan: royxat.reduce((s, x) => s + x.oqilmagan, 0),
    })
  } catch (error) {
    console.error('[Chat GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { userId } = await request.json()
    if (!userId) return NextResponse.json({ error: 'userId majburiy' }, { status: 400 })

    // Manzilda ommaviy userId (raqam) keladi, bazadagi ichki id emas
    const odam = await prisma.user.findUnique({
      where: { userId: String(userId) },
      select: { id: true },
    })
    if (!odam) return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })

    const suhbat = await suhbatniOl(session.user.id, odam.id)

    return NextResponse.json({ success: true, suhbatId: suhbat.id, holat: suhbat.holat })
  } catch (error) {
    if (error instanceof ChatXatosi) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('[Chat POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
