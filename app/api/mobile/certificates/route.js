// app/api/mobile/certificates/route.js
//
// Mobil ilova uchun foydalanuvchining barcha sertifikatlarini normallashtirilgan
// holat, metadata va PDF/tekshiruv havolalari bilan qaytaradi.
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { SERTIFIKAT_DOMEN, formatMobileSertifikat } from '@/lib/sertifikat-tahlil'

export { OPTIONS } from '@/lib/cors'

export async function GET(request) {
  try {
    const auth = await getAuthUser(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sertifikatlar = await prisma.certificate.findMany({
      where: { userId: auth.id },
      orderBy: { issuedAt: 'desc' },
      select: {
        id: true,
        certId: true,
        fullName: true,
        fan: true,
        reason: true,
        examName: true,
        turi: true,
        metadata: true,
        description: true,
        fullNameLocked: true,
        grade: true,
        score: true,
        percentage: true,
        percentile: true,
        status: true,
        issuedAt: true,
        expiresAt: true,
        seals: true,
      },
    })

    const origin =
      process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || SERTIFIKAT_DOMEN
    const certificates = sertifikatlar.map((c) => formatMobileSertifikat(c, origin))

    return NextResponse.json({
      success: true,
      total: certificates.length,
      certificates,
    })
  } catch (error) {
    console.error('[Mobile Certificates GET]', error)
    return NextResponse.json(
      { error: "Sertifikatlarni yuklashda xatolik: " + error.message },
      { status: 500 }
    )
  }
}
