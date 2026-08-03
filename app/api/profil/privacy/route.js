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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const body = await request.json()

    // tozala() noma'lum kalit va noto'g'ri darajani o'zi tashlab yuboradi,
    // ya'ni mijoz yuborgan ortiqcha maydon bazaga tushmaydi
    const yangi = tozala({ ...ODDIY_MAXFIYLIK, ...(body?.sozlama || body) })

    await prisma.user.update({
      where: { id: session.user.id },
      data: { privacySettings: yangi },
    })

    return NextResponse.json({
      success: true,
      message: '✓ Maxfiylik sozlamalari saqlandi',
      sozlama: yangi,
    })
  } catch (error) {
    console.error('[Maxfiylik PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
