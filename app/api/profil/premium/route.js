// app/api/profil/premium/route.js
//
// Tasdiqlangan hisobning profil bezagini almashtirish.
//
// Alohida endpoint, `/api/profil` PUT ichida emas: u yerdagi ruxsat
// etilgan maydonlar ro'yxati hamma uchun bir xil, bu esa faqat
// tasdiqlangan hisobga tegishli. Ikkalasini aralashtirish "kim nimani
// o'zgartira oladi" degan qoidani xiralashtirardi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { PREMIUM_USLUBLAR, uslubBormi } from '@/lib/premium'

// GET — mavjud uslublar va hozir tanlangani
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isVerified: true, premiumUslub: true },
    })

    return NextResponse.json({
      success: true,
      tasdiqlangan: Boolean(user?.isVerified),
      tanlangan: user?.premiumUslub || 'kosmik',
      // Ro'yxat tasdiqlanmaganlarga ham qaytariladi: nima borligini
      // ko'rsatmasdan turib "tasdiqlansangiz shu bo'ladi" deyish
      // ma'nosiz. Faqat saqlash yopiq.
      uslublar: PREMIUM_USLUBLAR.map(({ kalit, nom, tavsif, namuna }) => ({
        kalit, nom, tavsif, namuna,
      })),
    })
  } catch (error) {
    console.error('[Premium GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT — uslubni saqlash
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { uslub } = await request.json()

    if (!uslubBormi(uslub)) {
      return NextResponse.json({ error: 'Bunday bezak yo\'q' }, { status: 400 })
    }

    // Tasdiqlanganlikni SESSIYADAN emas, bazadan tekshiramiz: sessiya
    // besh daqiqada bir yangilanadi va tasdiq olib tashlangandan keyin
    // qisqa vaqt eskirgan qiymat bilan turishi mumkin.
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isVerified: true },
    })

    if (!user?.isVerified) {
      return NextResponse.json(
        { error: 'Bezakni faqat tasdiqlangan hisoblar tanlaydi' },
        { status: 403 }
      )
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { premiumUslub: uslub },
    })

    return NextResponse.json({ success: true, message: '✓ Bezak o\'zgartirildi' })
  } catch (error) {
    console.error('[Premium PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
