// app/api/kanallar/[slug]/route.js
//
// Bitta kanal: lenta, video darsliklar va obuna holati.
//
// Yopiq kanal ham shu yerdan ochiladi — u faqat KATALOGDA ko'rinmaydi,
// havolasi bo'lgan odam kira oladi. Butunlay to'xtatilgan kanal (faol =
// false) esa ochilmaydi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { slug } = await params

    const kanal = await prisma.channel.findUnique({
      where: { slug },
      select: {
        id: true, slug: true, nom: true, tavsif: true, avatar: true,
        banner: true, turi: true, ochiq: true, faol: true, createdAt: true,
        egaId: true,
        ega: { select: { username: true, fullName: true, userId: true, avatar: true } },
        _count: { select: { obunalar: true } },
      },
    })

    if (!kanal || !kanal.faol) {
      return NextResponse.json({ error: 'Kanal topilmadi' }, { status: 404 })
    }

    const session = await getServerSession(authOptions)
    const ozimniki = session?.user?.id === kanal.egaId

    const [postlar, videolar, obuna] = await Promise.all([
      prisma.channelPost.findMany({
        // Qoralamani faqat egasi ko'radi
        where: { channelId: kanal.id, ...(ozimniki ? {} : { nashr: true }) },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
      prisma.channelVideo.findMany({
        where: { channelId: kanal.id, ...(ozimniki ? {} : { nashr: true }) },
        orderBy: [{ tartib: 'asc' }, { createdAt: 'desc' }],
      }),
      session?.user
        ? prisma.channelSubscription.findUnique({
            where: { channelId_userId: { channelId: kanal.id, userId: session.user.id } },
            select: { id: true },
          })
        : null,
    ])

    return NextResponse.json({
      success: true,
      kanal: {
        ...kanal,
        obunachilar: kanal._count.obunalar,
        _count: undefined,
        egaId: undefined,
      },
      postlar,
      videolar,
      obunaman: Boolean(obuna),
      ozimniki,
    })
  } catch (error) {
    console.error('[Kanal GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
