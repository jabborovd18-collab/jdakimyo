// app/api/profil/privacy/route.js
//
// Maxfiylik sozlamalari — uch daraja (lib/maxfiylik.js).
//
// Eski ha/yo'q qiymatlar bazada qolgan bo'lishi mumkin; ular o'qish
// paytida o'giriladi, migratsiya talab qilinmaydi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { BOLIMLAR, DARAJALAR, ODDIY_MAXFIYLIK, tozala } from '@/lib/maxfiylik'
import { profilLogYoz } from '@/lib/profil-log'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { privacySettings: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      sozlama: tozala(user.privacySettings),
      bolimlar: BOLIMLAR,
      darajalar: DARAJALAR,
    })
  } catch (error) {
    console.error('[Maxfiylik GET]', error)
    return NextResponse.json({ error: "Maxfiylik sozlamalarini yuklab bo'lmadi" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }
    if (session.user.doskaTugaydi) {
      return NextResponse.json({ error: "Elektron doskada maxfiylikni o'zgartirib bo'lmaydi" }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const kelgan = body?.sozlama && typeof body.sozlama === 'object' ? body.sozlama : body

    const joriy = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { privacySettings: true },
    })

    // Avvalgi saqlangan sozlama ustiga yangilash: qisman yuborilganda boshqa
    // bo'limlar sukutdagi ('hamma') holatga tushib qolmasin
    const yangi = tozala({
      ...(joriy ? tozala(joriy.privacySettings) : ODDIY_MAXFIYLIK),
      ...(kelgan && typeof kelgan === 'object' ? kelgan : {}),
    })

    await prisma.user.update({
      where: { id: session.user.id },
      data: { privacySettings: yangi },
    })

    const eskiMaxfiylik = joriy ? tozala(joriy.privacySettings) : ODDIY_MAXFIYLIK
    const ozgarganBolimlar = BOLIMLAR
      .filter((b) => eskiMaxfiylik[b.kalit] !== yangi[b.kalit])
      .map((b) => `${b.nom}: ${yangi[b.kalit]}`)

    await profilLogYoz({
      userId: session.user.id,
      toifa: 'maxfiylik',
      amal: 'MAXFIYLIK_YANGILANDI',
      sarlavha: 'Maxfiylik sozlamalari yangilandi',
      tafsilot: ozgarganBolimlar.join(', ') || 'Sozlamalar saqlandi',
      holat: 'muvaffaqiyat',
      request,
    })

    return NextResponse.json({
      success: true,
      message: 'Maxfiylik sozlamalari saqlandi',
      sozlama: yangi,
    })
  } catch (error) {
    console.error('[Maxfiylik PUT]', error)
    return NextResponse.json({ error: "Maxfiylik sozlamalarini saqlab bo'lmadi" }, { status: 500 })
  }
}
