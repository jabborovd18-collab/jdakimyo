// app/api/milliy-sertifikat/saqlash/route.js
//
// Faqat sertifikatdagi ismni o'zgartiradi. Ball va daraja bu yerdan
// o'zgarmaydi: ularni yakunlash route'i hisoblaydi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const ISM_MAKS_UZUNLIK = 80

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const certId = typeof body?.certId === 'string' ? body.certId.trim().toUpperCase() : ''
    const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : ''

    if (!certId.startsWith('JDA-MS-') || !fullName || fullName.length > ISM_MAKS_UZUNLIK) {
      return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 })
    }

    // Nega prefiks tekshiriladi: admin bergan sertifikatlardagi ismni egasi
    // o'zi o'zgartira olmasligi kerak. userId sharti birovnikini yopadi.
    const { count } = await prisma.certificate.updateMany({
      where: { certId, userId: session.user.id },
      data: { fullName },
    })

    if (count === 0) {
      return NextResponse.json({ error: 'Sertifikat topilmadi' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Milliy Sertifikat Saqlash]', err)
    return NextResponse.json({ error: 'Ismni saqlab bo\'lmadi' }, { status: 500 })
  }
}
