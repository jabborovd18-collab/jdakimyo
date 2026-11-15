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
import { soravchiIp, chekloqniTekshir, urinishniQayd, kutishMatni } from '@/lib/ip-cheklov'
import { profilLogYoz } from '@/lib/profil-log'

// GET — holat: tasdiqlanganmi, qaysi manzilga yuborilgan
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Kirish talab qilinadi' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, emailVerified: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      tasdiqlangan: Boolean(user.emailVerified),
      // Manzilni qisqartirib ko'rsatamiz: ekran auditoriyada ochiq
      // turishi mumkin
      email: user.email ? yashir(user.email) : null,
      pochtaIshlaydi: pochtaSozlanganmi(),
    })
  } catch (error) {
    console.error('[Tasdiqlash GET]', error)
    return NextResponse.json({ error: "Tekshirish holatini olib bo'lmadi" }, { status: 500 })
  }
}

// POST — kodni tekshirish
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Kirish talab qilinadi' }, { status: 401 })
    }
    if (session.user.doskaTugaydi) {
      return NextResponse.json({ error: 'Elektron doskada email tasdiqlanmaydi' }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const natija = await kodniTekshir(session.user.id, body?.kod)

    if (!natija.ok) {
      return NextResponse.json({ error: natija.xato }, { status: 400 })
    }

    await profilLogYoz({
      userId: session.user.id,
      toifa: 'xavfsizlik',
      amal: 'EMAIL_TASDIQLANDI',
      sarlavha: 'Email manzil tasdiqlandi',
      holat: 'muvaffaqiyat',
      request,
    })

    return NextResponse.json({
      success: true,
      message: 'Email tasdiqlandi. Endi tanga topa olasiz.',
    })
  } catch (error) {
    console.error('[Tasdiqlash POST]', error)
    return NextResponse.json({ error: "Kodni tekshirib bo'lmadi" }, { status: 500 })
  }
}

// PUT — kodni qayta yuborish
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Kirish talab qilinadi' }, { status: 401 })
    }
    if (session.user.doskaTugaydi) {
      return NextResponse.json({ error: 'Elektron doskada kod yuborib bo\'lmaydi' }, { status: 403 })
    }

    const ip = soravchiIp(request)
    const cheklov = await chekloqniTekshir('kod', ip)
    if (!cheklov.ok) {
      return NextResponse.json(
        { error: `Bu tarmoqdan juda ko'p xat so'raldi. ${kutishMatni(cheklov.kutish)}dan keyin urinib ko'ring.` },
        { status: 429 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, fullName: true, username: true, emailVerified: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    if (user.emailVerified) {
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
        {
          error: natija.sabab === 'sozlanmagan'
            ? "Pochta xizmati hozircha sozlanmagan. Administrator bilan bog'laning."
            : "Xat yuborilmadi. Birozdan keyin urinib ko'ring.",
        },
        { status: 502 }
      )
    }

    // Sanoq faqat xat HAQIQATAN ketganda oshadi
    await urinishniQayd('kod', ip)

    return NextResponse.json({ success: true, message: 'Yangi kod yuborildi' })
  } catch (error) {
    console.error('[Tasdiqlash PUT]', error)
    return NextResponse.json({ error: "Xat yuborishda xatolik yuz berdi" }, { status: 500 })
  }
}

/** ali@example.com -> a**@example.com */
function yashir(email) {
  const [nom, domen] = email.split('@')
  if (!domen) return email
  const ochiq = nom.slice(0, 1)
  return `${ochiq}${'*'.repeat(Math.max(2, nom.length - 1))}@${domen}`
}
