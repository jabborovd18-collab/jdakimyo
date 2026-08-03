// app/api/kanallar/route.js
//
// Ochiq kanallar katalogi.
//
// Telegram'da kanal ochgan odam uni o'zi reklama qilishi kerak. Bu yerda
// ochiq kanal katalogda va tavsiyalarda o'zi chiqadi — kanal tizimining
// asosiy afzalligi shu, shuning uchun bu yo'l hammaga (kirmaganlarga ham)
// ochiq.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const qidiruv = (searchParams.get('qidiruv') || '').trim()
    const turi = searchParams.get('turi') || 'all'

    const where = { ochiq: true, faol: true }
    if (turi !== 'all') where.turi = turi
    if (qidiruv) {
      where.OR = [
        { nom: { contains: qidiruv, mode: 'insensitive' } },
        { tavsif: { contains: qidiruv, mode: 'insensitive' } },
      ]
    }

    const kanallar = await prisma.channel.findMany({
      where,
      // Tavsiya etilganlar oldinda, keyin obunachisi ko'pi
      orderBy: [{ tavsiyada: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true, slug: true, nom: true, tavsif: true, avatar: true,
        banner: true, turi: true, tavsiyada: true, createdAt: true,
        ega: { select: { username: true, fullName: true, userId: true, avatar: true } },
        _count: { select: { obunalar: true, postlar: true, videolar: true } },
      },
    })

    // Kirgan foydalanuvchi qaysi kanallarga obuna ekani — tugmalar
    // to'g'ri holatda chizilishi uchun
    const session = await getServerSession(authOptions)
    let obunalarim = []
    if (session?.user) {
      const yozuvlar = await prisma.channelSubscription.findMany({
        where: { userId: session.user.id },
        select: { channelId: true },
      })
      obunalarim = yozuvlar.map((o) => o.channelId)
    }

    return NextResponse.json({
      success: true,
      kanallar: kanallar.map((k) => ({
        ...k,
        obunachilar: k._count.obunalar,
        postSoni: k._count.postlar,
        videoSoni: k._count.videolar,
        obunaman: obunalarim.includes(k.id),
        _count: undefined,
      })),
    })
  } catch (error) {
    console.error('[Kanallar GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
