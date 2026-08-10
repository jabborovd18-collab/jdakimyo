// app/api/laboratoriya/dokon/route.js
//
// Do'kon: katalogni ko'rsatadi (GET) va savdo qiladi (POST).
//
// Savdo mantig'i lib/laboratoriya.js da — u yerda hamma hisob tranzaksiya
// ichida bajariladi. Bu route faqat sessiyani tekshiradi va so'rovni uzatadi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { xarid, sotish, LabXatosi } from '@/lib/laboratoriya'

// GET - sotiladigan buyumlar
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const turi = searchParams.get('turi') || 'all'
    const guruh = searchParams.get('guruh') || 'all'
    const qidiruv = searchParams.get('qidiruv') || ''

    // Texnika sotilmaydi (daraja bilan ochiladi), faqat tajribada hosil
    // bo'ladigan moddalar ham sotilmaydi — narxi yo'q. Ular do'konda
    // tugmasiz kartochka bo'lib turishi chalkash bo'lardi.
    const where = {
      isActive: true,
      turi: { not: 'texnika' },
      OR: [{ narx: { gt: 0 } }, { gemsNarxi: { gt: 0 } }],
    }
    if (turi !== 'all') where.turi = turi
    if (guruh !== 'all') where.guruh = guruh
    if (qidiruv) where.nom = { contains: qidiruv, mode: 'insensitive' }

    const buyumlar = await prisma.labItemDef.findMany({
      where,
      orderBy: [{ turi: 'asc' }, { narx: 'asc' }, { nom: 'asc' }],
      select: {
        kalit: true, nom: true, turi: true, guruh: true, icon: true, tavsif: true,
        nodirlik: true, narx: true, sotishNarxi: true, gemsNarxi: true,
        sarflanadi: true, sanoat: true, daraja: true, uchraydi: true,
        birlik: true,
      },
    })

    // Filtr menyusi uchun guruhlar
    const guruhlar = await prisma.labItemDef.groupBy({
      by: ['guruh'],
      where: { isActive: true, turi: 'jihoz' },
      _count: true,
    })

    return NextResponse.json({
      success: true,
      buyumlar,
      guruhlar: guruhlar.filter((g) => g.guruh).map((g) => ({ guruh: g.guruh, soni: g._count })),
    })
  } catch (error) {
    console.error('[Dokon GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - sotib olish yoki sotish
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { amal, kalit, soni, valyuta } = await request.json()

    if (!kalit) {
      return NextResponse.json({ error: 'Buyum ko\'rsatilmagan' }, { status: 400 })
    }

    let natija
    if (amal === 'xarid') {
      natija = await xarid(session.user.id, kalit, soni ?? 1, valyuta ?? 'coins')
    } else if (amal === 'sotish') {
      natija = await sotish(session.user.id, kalit, soni ?? 1)
    } else {
      return NextResponse.json({ error: 'Amal noto\'g\'ri' }, { status: 400 })
    }

    // Yangi balansni ham qaytaramiz — sahifa uni qayta so'ramasin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true, gems: true },
    })

    const xabar =
      amal === 'xarid'
        ? `✓ ${natija.nom} × ${natija.soni} olindi (−${natija.sarflandi} ${natija.valyuta === 'gems' ? '💎' : '🪙'})`
        : `✓ ${natija.nom} × ${natija.soni} sotildi (+${natija.olindi} 🪙)`

    return NextResponse.json({ success: true, natija, balans: user, message: xabar })
  } catch (error) {
    // Foydalanuvchi xatosi (pul yetmadi, daraja past) — 400, server xatosi emas
    if (error instanceof LabXatosi) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Baza band bo'lgani uchun uzilgan tranzaksiya — bu ham server nosozligi
    // emas. Foydalanuvchiga "server xatosi" o'rniga nima qilishni aytamiz.
    if (error?.code === 'P2034' || error?.code === 'P2028') {
      return NextResponse.json(
        { error: 'Baza hozir band. Bir soniyadan keyin qayta urinib ko\'ring.' },
        { status: 409 },
      )
    }

    console.error('[Dokon POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
