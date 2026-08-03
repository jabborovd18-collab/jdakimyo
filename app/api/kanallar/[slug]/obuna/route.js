// app/api/kanallar/[slug]/obuna/route.js
//
// Obuna bo'lish (POST) va bekor qilish (DELETE).
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { xabarYubor } from '@/lib/bildirishnoma'

async function kanalniOl(slug) {
  return prisma.channel.findUnique({
    where: { slug },
    select: { id: true, nom: true, slug: true, faol: true, egaId: true },
  })
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { slug } = await params
    const kanal = await kanalniOl(slug)
    if (!kanal || !kanal.faol) {
      return NextResponse.json({ error: 'Kanal topilmadi' }, { status: 404 })
    }

    if (kanal.egaId === session.user.id) {
      return NextResponse.json({ error: 'O\'z kanalingizga obuna bo\'lolmaysiz' }, { status: 400 })
    }

    // Ikki marta bosilsa xato bermasin — natija bir xil bo'lishi kerak
    await prisma.channelSubscription.upsert({
      where: { channelId_userId: { channelId: kanal.id, userId: session.user.id } },
      create: { channelId: kanal.id, userId: session.user.id },
      update: {},
    })

    const obunachilar = await prisma.channelSubscription.count({ where: { channelId: kanal.id } })

    // Kanal egasiga xabar: obunachi orttirish uning asosiy maqsadi
    await xabarYubor(kanal.egaId, {
      turi: 'kanal',
      icon: '📢',
      sarlavha: `${session.user.fullName || session.user.username} kanalingizga obuna bo'ldi`,
      matn: `${kanal.nom} — endi ${obunachilar} ta obunachi`,
      havola: `/kanallar/${kanal.slug}`,
    })

    return NextResponse.json({ success: true, obunaman: true, obunachilar })
  } catch (error) {
    console.error('[Kanal obuna POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { slug } = await params
    const kanal = await kanalniOl(slug)
    if (!kanal) return NextResponse.json({ error: 'Kanal topilmadi' }, { status: 404 })

    await prisma.channelSubscription.deleteMany({
      where: { channelId: kanal.id, userId: session.user.id },
    })

    const obunachilar = await prisma.channelSubscription.count({ where: { channelId: kanal.id } })

    return NextResponse.json({ success: true, obunaman: false, obunachilar })
  } catch (error) {
    console.error('[Kanal obuna DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
