// app/api/profil/postlar/route.js
//
// Profil postlari: yozish, ro'yxat va o'chirish.
//
// Post yozilganda OBUNACHILARGA bildirishnoma boradi — obunachilar
// tizimining ma'nosi shu. Do'stlarga emas: do'stlik ikki tomonlama
// aloqa, obuna esa "yozganingni o'qiyman" degani.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { xabarYuborKopga } from '@/lib/bildirishnoma'

/** Bir post uzunligi — uzun matn kanal uchun, profil posti qisqa yozuv */
const MAX_UZUNLIK = 1000

/** Kuniga shuncha post — spamga qarshi oddiy chegara */
const KUNLIK_CHEGARA = 20

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const postlar = await prisma.profilePost.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ success: true, postlar })
  } catch (error) {
    console.error('[Profil postlar GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { matn } = await request.json()
    const toza = String(matn || '').trim()

    if (!toza) {
      return NextResponse.json({ error: 'Post matni bo\'sh' }, { status: 400 })
    }
    if (toza.length > MAX_UZUNLIK) {
      return NextResponse.json(
        { error: `Post ${MAX_UZUNLIK} belgidan oshmasligi kerak` },
        { status: 400 },
      )
    }

    const kunBoshi = new Date()
    kunBoshi.setUTCHours(0, 0, 0, 0)
    const bugungi = await prisma.profilePost.count({
      where: { userId: session.user.id, createdAt: { gte: kunBoshi } },
    })
    if (bugungi >= KUNLIK_CHEGARA) {
      return NextResponse.json(
        { error: `Bir kunda ko'pi bilan ${KUNLIK_CHEGARA} ta post yozish mumkin` },
        { status: 429 },
      )
    }

    const post = await prisma.profilePost.create({
      data: { userId: session.user.id, matn: toza },
    })

    const obunachilar = await prisma.follow.findMany({
      where: { followingId: session.user.id },
      select: { followerId: true },
    })

    await xabarYuborKopga(
      obunachilar.map((o) => o.followerId),
      {
        turi: 'post',
        icon: '✍️',
        sarlavha: `${session.user.fullName || session.user.username} yangi post yozdi`,
        matn: toza.slice(0, 160),
        havola: `/profil/${session.user.userId}`,
      },
    )

    return NextResponse.json({
      success: true,
      post,
      message: obunachilar.length
        ? `✓ Post joylandi — ${obunachilar.length} ta obunachiga xabar berildi`
        : '✓ Post joylandi',
    })
  } catch (error) {
    console.error('[Profil postlar POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id majburiy' }, { status: 400 })

    // `userId` sharti muhim: id ni bilgan odam boshqaning postini
    // o'chira olmasligi kerak
    const natija = await prisma.profilePost.deleteMany({
      where: { id, userId: session.user.id },
    })

    if (natija.count === 0) {
      return NextResponse.json({ error: 'Post topilmadi' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: '✓ Post o\'chirildi' })
  } catch (error) {
    console.error('[Profil postlar DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
