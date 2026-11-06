// app/api/milliy-sertifikat/saqlash/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Noto'g'ri so'rov formati" }, { status: 400 })
    }

    const {
      certId,
      fullName,
      daraja,
      shkalaBalli,
      theta,
      se,
      infitMnsq,
      outfitMnsq,
      rawScore,
      jamiSavollar,
      sarflanganVaqt,
      examSlug,
      examName,
      imtiyoz,
    } = body

    if (!certId || !daraja) {
      return NextResponse.json({ error: "Kerakli parametrlar yetarli emas" }, { status: 400 })
    }

    // Agar foydalanuvchi tizimga kirgan bo'lsa va sertifikat olgan bo'lsa (C yoki yuqori), Certificate jadvaliga saqlaymiz
    if (session?.user?.id && daraja !== "Qoniqarsiz") {
      const expires = new Date()
      expires.setFullYear(expires.getFullYear() + 3) // 3 yil amal qilish muddati

      const descriptionObj = {
        theta,
        se,
        infitMnsq,
        outfitMnsq,
        shkalaBalli,
        rawScore,
        jamiSavollar,
        sarflanganVaqt,
        daraja,
        imtiyoz,
        model: "Georg Rasch IRT",
        standart: "BMBA 70 ball",
        examSlug,
      }

      await prisma.certificate.upsert({
        where: { certId },
        update: {
          fullName: fullName || session.user.name || "Ishtirokchi",
          score: Math.round(shkalaBalli || 0),
          grade: daraja,
          percentage: Math.round(((shkalaBalli || 0) / 70) * 1000) / 10,
          description: JSON.stringify(descriptionObj),
        },
        create: {
          certId,
          userId: session.user.id,
          fullName: fullName || session.user.name || "Ishtirokchi",
          fan: "Kimyo",
          reason: "Kimyo fani bo'yicha Davlat Milliy Sertifikati (Georg Rasch IRT modeli)",
          description: JSON.stringify(descriptionObj),
          examName: examName || "Kimyo Milliy Sertifikat Sinovi",
          grade: daraja,
          score: Math.round(shkalaBalli || 0),
          percentage: Math.round(((shkalaBalli || 0) / 70) * 1000) / 10,
          expiresAt: expires,
          status: "valid",
        },
      })
    }

    return NextResponse.json({
      success: true,
      certId,
      saqlandi: Boolean(session?.user?.id && daraja !== "Qoniqarsiz"),
    })
  } catch (err) {
    console.error("[Milliy Sertifikat Saqlash]", err)
    return NextResponse.json(
      { error: "Natijani saqlashda xatolik yuz berdi" },
      { status: 500 }
    )
  }
}
