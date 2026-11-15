// app/api/milliy-sertifikat/saqlash/route.js
//
// Faqat MS sertifikatdagi ismni egasi tomonidan 1 marta to'g'rilash uchun.
// Tasdiqlangach fullNameLocked = true bo'ladi va qayta o'zgartirish faqat admin orqali bo'ladi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  ajratSertifikatTavsifi,
  sertifikatIsmSaqlashQarori,
} from '@/lib/sertifikat-tahlil'
import { foydalanuvchilargaSertifikatPdfYubor } from '@/lib/telegram-sertifikat'
import { profilLogYoz } from '@/lib/profil-log'

const ISM_MAKS_UZUNLIK = 80

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const certId = typeof body?.certId === 'string' ? body.certId.trim().toUpperCase() : ''

    if (!certId) {
      return NextResponse.json({ error: "Noto'g'ri sertifikat raqami" }, { status: 400 })
    }

    const mavjud = await prisma.certificate.findFirst({
      where: { certId, userId: session.user.id },
      select: {
        id: true,
        certId: true,
        fullName: true,
        turi: true,
        metadata: true,
        fullNameLocked: true,
        description: true,
      },
    })

    if (!mavjud) {
      return NextResponse.json({ error: 'Sertifikat topilmadi' }, { status: 404 })
    }

    if (!ajratSertifikatTavsifi(mavjud).isMs) {
      return NextResponse.json(
        { error: "Bu endpoint faqat Milliy Sertifikat yozuvlari uchun" },
        { status: 400 }
      )
    }

    const qaror = sertifikatIsmSaqlashQarori({
      mavjud,
      yangiIsm: body?.fullName,
      maksUzunlik: ISM_MAKS_UZUNLIK,
    })

    if (!qaror.ok) {
      return NextResponse.json(
        { error: qaror.error, locked: Boolean(qaror.locked) },
        { status: qaror.status }
      )
    }

    if (qaror.ozgardi) {
      const yangilangan = await prisma.certificate.update({
        where: { id: mavjud.id },
        data: {
          fullName: qaror.fullName,
          fullNameLocked: qaror.fullNameLocked,
          metadata: qaror.nextMetadata,
          description: qaror.nextDescription,
        },
      })

      // F.I.SH tasdiqlangach yangilangan PDF nusxasini Telegram botga ham yuboramiz
      try {
        await foydalanuvchilargaSertifikatPdfYubor([yangilangan])
      } catch (tgErr) {
        console.warn('[Milliy Sertifikat Saqlash Telegram PDF]', tgErr?.message)
      }

      await profilLogYoz({
        userId: session.user.id,
        toifa: 'sertifikat',
        amal: 'SERTIFIKAT_ISM_TASDIQLANDI',
        sarlavha: `Sertifikatdagi ism tasdiqlandi (${certId})`,
        tafsilot: qaror.fullName,
        holat: 'muvaffaqiyat',
        request,
        meta: { certId, fullNameLocked: qaror.fullNameLocked },
      })
    }

    return NextResponse.json({
      success: true,
      fullName: qaror.fullName,
      fullNameLocked: qaror.fullNameLocked,
      unchanged: !qaror.ozgardi,
    })
  } catch (err) {
    console.error('[Milliy Sertifikat Saqlash]', err)
    return NextResponse.json({ error: "Ismni saqlab bo'lmadi" }, { status: 500 })
  }
}
