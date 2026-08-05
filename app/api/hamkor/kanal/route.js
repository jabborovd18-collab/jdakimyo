// app/api/hamkor/kanal/route.js
//
// Hamkorning o'z kanali: holat va sozlamalar.
//
// Kanalni bu yerdan OCHIB bo'lmaydi — uni superadmin ochadi va egasini
// tayinlaydi (/api/admin/kanallar). Hamkor faqat o'ziga biriktirilgan
// kanalni to'ldiradi va yuritadi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { isPartnerRole } from '@/lib/roles'
import {
  KANAL_TURLARI, KanalXatosi, kanalimniOl, kanallarim, sorovdanKanalId,
} from '@/lib/kanal'

async function hamkorTekshir() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { xato: NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 }) }
  if (!isPartnerRole(session.user.role)) {
    return {
      xato: NextResponse.json(
        { error: 'Bu bo\'lim hamkorlar uchun. Unvon sayt administratori tomonidan beriladi.' },
        { status: 403 },
      ),
    }
  }
  return { user: session.user }
}

export async function GET(request) {
  const { user, xato } = await hamkorTekshir()
  if (xato) return xato

  try {
    const kanal = await kanalimniOl(user.id, sorovdanKanalId(request))
    // Almashtirgich uchun — faqat nomi va manzili yetarli
    const barchasi = await kanallarim(user.id)

    const [obunachilar, postlar, videolar, oxirgiObunachilar, korishlar] = await Promise.all([
      prisma.channelSubscription.count({ where: { channelId: kanal.id } }),
      prisma.channelPost.count({ where: { channelId: kanal.id } }),
      prisma.channelVideo.count({ where: { channelId: kanal.id } }),
      prisma.channelSubscription.findMany({
        where: { channelId: kanal.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          createdAt: true,
          user: { select: { username: true, fullName: true, userId: true, avatar: true } },
        },
      }),
      prisma.channelPost.aggregate({
        where: { channelId: kanal.id },
        _sum: { korishlar: true },
      }),
    ])

    // Bir haftada nechta yangi obunachi — o'sish ko'rinsin
    const haftaOldin = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const haftalikOsish = await prisma.channelSubscription.count({
      where: { channelId: kanal.id, createdAt: { gte: haftaOldin } },
    })

    return NextResponse.json({
      success: true,
      kanal,
      kanallar: barchasi.map((k) => ({
        id: k.id,
        nom: k.nom,
        slug: k.slug,
        avatar: k.avatar,
        faol: k.faol,
      })),
      turlar: KANAL_TURLARI,
      statistika: {
        obunachilar,
        haftalikOsish,
        postlar,
        videolar,
        korishlar: korishlar._sum.korishlar || 0,
      },
      oxirgiObunachilar,
    })
  } catch (error) {
    if (error instanceof KanalXatosi) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('[Hamkor kanal GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT — kanal sozlamalari. Slug va faollik hamkorga berilmaydi: manzil
// o'zgarsa tarqatilgan havolalar ishlamay qoladi, faollik esa admin
// qarori.
export async function PUT(request) {
  const { user, xato } = await hamkorTekshir()
  if (xato) return xato

  try {
    const body = await request.json()
    const kanal = await kanalimniOl(user.id, sorovdanKanalId(request, body))

    const data = {}
    if (typeof body.nom === 'string' && body.nom.trim()) data.nom = body.nom.trim().slice(0, 80)
    if (typeof body.tavsif === 'string') data.tavsif = body.tavsif.trim().slice(0, 2000) || null
    if (typeof body.avatar === 'string') data.avatar = body.avatar.trim() || null
    if (typeof body.banner === 'string') data.banner = body.banner.trim() || null
    if (KANAL_TURLARI.some((t) => t.id === body.turi)) data.turi = body.turi

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'O\'zgartirish uchun ma\'lumot yo\'q' }, { status: 400 })
    }

    const yangi = await prisma.channel.update({ where: { id: kanal.id }, data })

    return NextResponse.json({ success: true, kanal: yangi, message: '✓ Kanal sozlamalari saqlandi' })
  } catch (error) {
    if (error instanceof KanalXatosi) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('[Hamkor kanal PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
