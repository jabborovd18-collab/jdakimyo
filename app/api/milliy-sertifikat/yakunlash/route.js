// app/api/milliy-sertifikat/yakunlash/route.js
//
// Ball, daraja va sertifikat FAQAT shu yerda aniqlanadi. Brauzer faqat tokenni
// va tanlangan javoblarni yuboradi (AGENTS.md 2-band).
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { hisoblaYakuniyNatija } from '@/lib/milliy-sertifikat-boshqaruvchi'
import { ochSessiya } from '@/lib/milliy-sertifikat-sessiya'
import { MILLIY_SERTIFIKAT_VARIANTLARI } from '@/lib/milliy-sertifikat-data'
import { getSavollarBySlug } from '@/data/milliy-sertifikat/savollar-ombromi'

// Nega zaxira kerak: taymer nolga yetganda brauzer javoblarni o'zi yuboradi va
// so'rov tarmoqda bir necha soniya yo'lda bo'ladi.
const KECHIKISH_ZAXIRASI_MS = 60 * 1000

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null)
    const sessiya = ochSessiya(body?.token, process.env.NEXTAUTH_SECRET)
    if (!sessiya) {
      return NextResponse.json({ error: 'Sinov sessiyasi yaroqsiz' }, { status: 400 })
    }

    const javoblar =
      body.javoblar && typeof body.javoblar === 'object' && !Array.isArray(body.javoblar)
        ? body.javoblar
        : {}

    const authSessiya = await getServerSession(authOptions)
    const userId = authSessiya?.user?.id || null
    const egasi = Boolean(userId) && sessiya.uid === userId

    const hozir = Date.now()
    const kechikkan = hozir > sessiya.tugash + KECHIKISH_ZAXIRASI_MS
    const sarflanganVaqt = Math.floor((Math.min(hozir, sessiya.tugash) - sessiya.bosh) / 1000)

    const natija = hisoblaYakuniyNatija(
      getSavollarBySlug(sessiya.slug),
      javoblar,
      sarflanganVaqt,
      { toliqIsm: authSessiya?.user?.name || 'Ishtirokchi' }
    )

    if (!egasi || kechikkan) {
      const darajaYetdi = Boolean(natija.sertifikat)
      natija.sertifikat = null
      if (darajaYetdi) {
        natija.sertifikatIzoh = kechikkan
          ? 'Vaqt tugaganidan keyin topshirilgani uchun sertifikat berilmadi.'
          : 'Sertifikat olish uchun sinovni tizimga kirib topshiring.'
      }
      return NextResponse.json({ natija })
    }

    const examName =
      MILLIY_SERTIFIKAT_VARIANTLARI.find((v) => v.slug === sessiya.slug)?.nom ||
      'Kimyo tayyorgarlik sinovi'

    try {
      await prisma.$transaction(async (tx) => {
        // Nega natija ham yoziladi: attemptId unique, ya'ni shu qator tokenni
        // bir martalik qiladi. U bo'lmasa javoblarni ko'rib, o'sha sessiyani
        // qayta yuborish mumkin bo'lardi.
        await tx.quizResult.create({
          data: {
            attemptId: `ms-${sessiya.sid}`,
            userId,
            quizName: examName,
            score: natija.rawScore,
            totalQuestions: natija.jamiSavollar,
            percentage: natija.foiz,
            timeSpent: sarflanganVaqt,
          },
        })

        if (natija.sertifikat) {
          await tx.certificate.create({
            data: {
              certId: natija.sertifikat.certId,
              userId,
              fullName: natija.sertifikat.fullName,
              fan: 'Kimyo',
              reason: "JDA Kimyo tayyorgarlik sinovi natijasi (davlat sertifikati emas)",
              description: JSON.stringify({
                theta: natija.theta,
                se: natija.se,
                infitMnsq: natija.infitMNSQ,
                outfitMnsq: natija.outfitMNSQ,
                shkalaBalli: natija.shkalaBalli,
                rawScore: natija.rawScore,
                jamiSavollar: natija.jamiSavollar,
                sarflanganVaqt,
                daraja: natija.daraja,
                model: 'Georg Rasch IRT',
                examSlug: sessiya.slug,
              }),
              examName,
              grade: natija.daraja,
              score: Math.round(natija.shkalaBalli),
              percentage: natija.foiz,
              expiresAt: new Date(natija.sertifikat.expiresAt),
              status: 'valid',
            },
          })
        }
      })
    } catch (error) {
      if (error?.code === 'P2002') {
        return NextResponse.json(
          { error: 'Bu sinov allaqachon topshirilgan', takroriy: true },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({ natija })
  } catch (err) {
    console.error('[Milliy Sertifikat Yakunlash]', err)
    return NextResponse.json({ error: 'Natijani hisoblab bo\'lmadi' }, { status: 500 })
  }
}
