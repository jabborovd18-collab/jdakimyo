// app/api/auth/tasdiqlash/route.js
//
// Email tasdiqlash kodini tekshirish va qayta yuborish.
//
// Kirgan foydalanuvchi uchun ishlaydi: ro'yxatdan o'tgach sahifa avval
// tizimga kiritadi, keyin kod so'raydi. Shunday qilinmasa, kodni
// tekshirish uchun email+parolni qayta yuborish kerak bo'lardi va
// bu parolni ortiqcha joyda aylantirish degani.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { kodniTekshir, kodYuboroq } from '@/lib/email-tasdiq'
import { pochtaSozlanganmi } from '@/lib/pochta'

// GET — holat: tasdiqlanganmi, qaysi manzilga yuborilgan
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, emailVerified: true },
    })

    return NextResponse.json({
      success: true,
      tasdiqlangan: Boolean(user?.emailVerified),
      // Manzilni qisqartirib ko'rsatamiz: ekran auditoriyada ochiq
      // turishi mumkin
      email: user?.email ? yashir(user.email) : null,
      pochtaIshlaydi: pochtaSozlanganmi(),
    })
  } catch (error) {
    console.error('[Tasdiqlash GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — kodni tekshirish
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { kod } = await request.json()
    const natija = await kodniTekshir(session.user.id, kod)

    if (!natija.ok) {
      return NextResponse.json({ error: natija.xato }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: '✓ Email tasdiqlandi. Endi tanga topa olasiz.',
    })
  } catch (error) {
    console.error('[Tasdiqlash POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT — kodni qayta yuborish
export async function PUT() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, fullName: true, username: true, emailVerified: true },
    })

    if (user?.emailVerified) {
      return NextResponse.json({ error: 'Email allaqachon tasdiqlangan' }, { status: 400 })
    }

    const natija = await kodYuboroq(user)

    if (!natija.yuborildi && natija.sabab === 'tez') {
      return NextResponse.json(
        { error: `Juda tez. ${natija.kutish} soniyadan keyin urinib ko'ring.` },
        { status: 429 }
      )
    }

    if (!natija.yuborildi) {
      return NextResponse.json(
        { error: 'Xat yuborilmadi. Birozdan keyin urinib ko\'ring.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, message: '✓ Yangi kod yuborildi' })
  } catch (error) {
    console.error('[Tasdiqlash PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/** ali@example.com -> a**@example.com */
function yashir(email) {
  const [nom, domen] = email.split('@')
  if (!domen) return email
  const ochiq = nom.slice(0, 1)
  return `${ochiq}${'*'.repeat(Math.max(2, nom.length - 1))}@${domen}`
}
