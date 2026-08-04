// app/api/sovga/route.js
//
// Kunlik sovg'a: yuborish, ro'yxat va qabul qilish.
// Qoidalar va sabablar lib/sovga.js da.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  SOVGA_TANGA, toshkentKuni, kunTugashigaQolgan,
  kuyganlarniBelgila, sovgaYubor, sovganiQabulQil,
} from '@/lib/sovga'

const ODAM = {
  select: {
    id: true, userId: true, username: true, fullName: true,
    avatar: true, isVerified: true,
  },
}

// GET — bugungi holat: kelgan sovg'alar, yuborilgani, do'stlar ro'yxati
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const menId = session.user.id
    const bugun = toshkentKuni()

    // Muddati o'tganlarni AVVAL belgilaymiz — aks holda kechagi sovg'a
    // ro'yxatda "kutilmoqda" bo'lib chiqib, uni qabul qilish mumkin
    // bo'lib qolardi.
    await kuyganlarniBelgila(menId)

    const [kelganlar, bugungiYuborilgan, dostliklar] = await Promise.all([
      prisma.gift.findMany({
        where: { receiverId: menId, holat: 'kutilmoqda' },
        include: { sender: ODAM },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.gift.findFirst({
        where: { senderId: menId, kun: bugun },
        include: { receiver: ODAM },
      }),
      prisma.friendship.findMany({
        where: { OR: [{ user1Id: menId }, { user2Id: menId }] },
        include: { user1: ODAM, user2: ODAM },
      }),
    ])

    // Do'stlar ro'yxatini bitta tomonga keltiramiz
    const dostlar = dostliklar.map((d) => (d.user1Id === menId ? d.user2 : d.user1))

    return NextResponse.json({
      success: true,
      tanga: SOVGA_TANGA,
      kelganlar,
      bugungiYuborilgan,
      dostlar,
      // Sahifada "necha soat qoldi" ni ko'rsatish uchun
      kunTugashigaMs: kunTugashigaQolgan(),
    })
  } catch (error) {
    console.error('[Sovga GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — sovg'a yuborish
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { dostId } = await request.json()
    if (!dostId) {
      return NextResponse.json({ error: 'Kimga yuborish kerakligini tanlang' }, { status: 400 })
    }

    // Daraja tekshiruvi uchun bazadan o'qiymiz: sessiyada `level_points` yo'q
    const men = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, username: true, fullName: true, level_points: true },
    })

    const { qabulQiluvchi } = await sovgaYubor(men, dostId)

    return NextResponse.json({
      success: true,
      message: `🎁 "${qabulQiluvchi.fullName || qabulQiluvchi.username}" ga sovg'a yuborildi`,
    })
  } catch (error) {
    // lib/sovga.js dagi xatolar foydalanuvchiga ko'rsatiladigan sabablar
    console.error('[Sovga POST]', error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// PUT — sovg'ani qabul qilish
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'Sovg\'a tanlanmadi' }, { status: 400 })
    }

    const { tanga, yuboruvchi } = await sovganiQabulQil(session.user.id, id)

    return NextResponse.json({
      success: true,
      message: `🪙 +${tanga} tanga! "${yuboruvchi.fullName || yuboruvchi.username}" ham ${tanga} tanga oldi.`,
      tanga,
    })
  } catch (error) {
    console.error('[Sovga PUT]', error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
