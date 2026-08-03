// app/api/chat/shikoyat/route.js
//
// Chat shikoyati. Yozishma admin va superadminga ochiladi — shikoyatning
// ma'nosi shu: admin nima yozilganini KO'RISHI kerak, aks holda qaror
// qabul qilib bo'lmaydi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ChatXatosi, qatnashchimi, sherik } from '@/lib/chat'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { suhbatId, sabab } = await request.json()
    if (!suhbatId || !sabab?.trim()) {
      return NextResponse.json({ error: 'Suhbat va sabab majburiy' }, { status: 400 })
    }

    const suhbat = await prisma.conversation.findUnique({ where: { id: suhbatId } })
    if (!suhbat || !qatnashchimi(suhbat, session.user.id)) {
      return NextResponse.json({ error: 'Suhbat topilmadi' }, { status: 404 })
    }

    const kimUstidan = sherik(suhbat, session.user.id)

    // Bir suhbat bo'yicha ochiq shikoyat turgan bo'lsa, ikkinchisi
    // yaratilmaydi — navbat bir xil shikoyat bilan to'lib ketmasin
    const ochiq = await prisma.chatReport.findFirst({
      where: {
        reporterId: session.user.id,
        conversationId: suhbatId,
        holat: { in: ['yangi', 'korildi'] },
      },
    })
    if (ochiq) {
      return NextResponse.json(
        { error: 'Bu suhbat bo\'yicha shikoyatingiz allaqachon ko\'rib chiqilmoqda' },
        { status: 400 },
      )
    }

    await prisma.chatReport.create({
      data: {
        reporterId: session.user.id,
        reportedId: kimUstidan,
        conversationId: suhbatId,
        sabab: sabab.trim().slice(0, 1000),
      },
    })

    return NextResponse.json({
      success: true,
      message: '✓ Shikoyat yuborildi. Administrator yozishmani ko\'rib chiqadi.',
    })
  } catch (error) {
    if (error instanceof ChatXatosi) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('[Chat shikoyat POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
