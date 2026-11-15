// app/api/milliy-sertifikat/yakunlash/route.js
//
// Brauzer faqat tokenni va tanlangan javoblarni yuboradi. Mantiq
// lib/milliy-sertifikat-yakunlash.js da.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ochSessiya } from '@/lib/milliy-sertifikat-sessiya'
import { yakunlaSinov } from '@/lib/milliy-sertifikat-yakunlash'
import { isSuperAdmin } from '@/lib/roles'
import { foydalanuvchilargaSertifikatPdfYubor } from '@/lib/telegram-sertifikat'
import { authMaxfiyKaliti } from '@/lib/auth-maxfiy-kalit'

export async function POST(request) {
  try {
    const authSessiya = await getServerSession(authOptions)
    if (!authSessiya?.user?.id) {
      return NextResponse.json(
        {
          error: 'Milliy Sertifikat sinovini yakunlash uchun profilingizga kiring.',
          loginKerak: true,
        },
        { status: 401 }
      )
    }

    const sir = authMaxfiyKaliti()
    const body = await request.json().catch(() => null)
    const sessiya = ochSessiya(body?.token, sir)
    if (!sessiya) {
      return NextResponse.json({ error: 'Sinov sessiyasi yaroqsiz' }, { status: 400 })
    }

    const javoblar =
      body.javoblar && typeof body.javoblar === 'object' && !Array.isArray(body.javoblar)
        ? body.javoblar
        : {}

    const superadminmi = isSuperAdmin(authSessiya.user.role)
    const toliqIsm =
      authSessiya.user.fullName ||
      authSessiya.user.username ||
      authSessiya.user.name ||
      'Ishtirokchi'

    const natija = await yakunlaSinov({
      db: prisma,
      sessiya,
      javoblar,
      userId: authSessiya.user.id,
      toliqIsm,
      sir,
      superadminmi,
    })

    // Erkin sinov darhol sertifikat yaratsa va foydalanuvchi Telegram botni ulagan bo'lsa,
    // PDF hujjatini Telegram orqali yuboramiz (xato bo'lsa asosiy javobni yiqitmaydi).
    const certId = natija.body?.natija?.sertifikat?.certId
    if (natija.status === 200 && certId && !natija.body?.superadminSinovi) {
      try {
        const sertifikat = await prisma.certificate.findUnique({ where: { certId } })
        if (sertifikat) {
          await foydalanuvchilargaSertifikatPdfYubor([sertifikat])
        }
      } catch (tgErr) {
        console.warn('[Milliy Sertifikat Yakunlash Telegram PDF]', tgErr?.message)
      }
    }

    return NextResponse.json(natija.body, { status: natija.status })
  } catch (err) {
    console.error('[Milliy Sertifikat Yakunlash]', err)
    return NextResponse.json({ error: "Natijani hisoblab bo'lmadi" }, { status: 500 })
  }
}
