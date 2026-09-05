// app/api/hamkorlik/[slug]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { MILLIY_SERTIFIKAT_1_SAVOLLAR, javobniTekshir } from '@/data/hamkorlik/milliy-sertifikat-1-savollar'

export async function GET(req, { params }) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)

    const partnership = await prisma.seasonalPartnership.findUnique({
      where: { slug },
      include: {
        attempts: {
          where: { passed: true },
          include: {
            user: {
              select: { userId: true, username: true, fullName: true, avatar: true }
            }
          },
          orderBy: [{ score: 'desc' }, { timeSpentSec: 'asc' }],
          take: 20
        }
      }
    })

    if (!partnership) {
      return NextResponse.json({ error: 'Mavsumiy hamkorlik topilmadi' }, { status: 404 })
    }

    let userAttempt = null
    let hasSubmitted = false

    if (session?.user?.id) {
      const attempt = await prisma.partnershipAttempt.findUnique({
        where: {
          partnershipId_userId: {
            partnershipId: partnership.id,
            userId: session.user.id
          }
        }
      })

      if (attempt) {
        hasSubmitted = true
        if (partnership.isAnnounced) {
          userAttempt = attempt
        } else {
          // Natija e'lon qilinmagan bo'lsa, ball va javoblar yashirin bo'ladi
          userAttempt = {
            hasSubmitted: true,
            completedAt: attempt.completedAt,
            totalQuestions: attempt.totalQuestions
          }
        }
      }
    }

    // Leaderboard faqat natijalar e'lon qilinganda to'liq ko'rsatiladi
    const leaderboard = partnership.isAnnounced ? (partnership.attempts || []) : []

    return NextResponse.json({
      partnership: {
        id: partnership.id,
        slug: partnership.slug,
        title: partnership.title,
        partnerName: partnership.partnerName,
        partnerLogo: partnership.partnerLogo,
        partnerSignName: partnership.partnerSignName,
        jdaSignName: partnership.jdaSignName,
        description: partnership.description,
        badgeText: partnership.badgeText,
        minPassPercent: partnership.minPassPercent,
        timeLimitMin: partnership.timeLimitMin,
        startsAt: partnership.startsAt,
        endsAt: partnership.endsAt,
        isActive: partnership.isActive,
        isAnnounced: partnership.isAnnounced,
        publishedAt: partnership.publishedAt
      },
      leaderboard,
      hasSubmitted,
      userAttempt,
      savollar: slug === 'sea-ms-sinov'
        ? MILLIY_SERTIFIKAT_1_SAVOLLAR.map((s) => ({
            id: s.id,
            turi: s.turi,
            rasm: s.rasm,
            options: s.options || null,
          }))
        : undefined,
    })
  } catch (error) {
    console.error('[Hamkorlik GET Error]:', error)
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 })
  }
}

export async function POST(req, { params }) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Iltimos, avval tizimga kiring' }, { status: 401 })
    }

    const partnership = await prisma.seasonalPartnership.findUnique({
      where: { slug }
    })

    if (!partnership) {
      return NextResponse.json({ error: 'Hamkorlik topilmadi' }, { status: 404 })
    }

    // 1. BIR PROFIL FAQAT BIR MARTA TOPSHIRA OLADI
    const existingAttempt = await prisma.partnershipAttempt.findUnique({
      where: {
        partnershipId_userId: {
          partnershipId: partnership.id,
          userId: session.user.id
        }
      }
    })

    if (existingAttempt) {
      return NextResponse.json({
        error: 'Siz ushbu sinov testini allaqachon topshirgansiz. Qayta topshirishga ruxsat berilmaydi.'
      }, { status: 400 })
    }

    const now = new Date()
    if (!partnership.isActive || now < partnership.startsAt || now > partnership.endsAt) {
      return NextResponse.json({ error: 'Ushbu sinov muddati yakunlangan yoki nofaol' }, { status: 400 })
    }

    const body = await req.json()
    const { timeSpentSec = 0 } = body

    let numericScore = 0
    let numericPercent = 0
    let totalSavollarSoni = 30

    if (slug === 'sea-ms-sinov') {
      let togri = 0
      MILLIY_SERTIFIKAT_1_SAVOLLAR.forEach((savol) => {
        const berilgan = body.javoblar?.[savol.id]
        if (javobniTekshir(savol, berilgan)) {
          togri++
        }
      })
      numericScore = togri
      numericPercent = Math.round((togri / 40) * 100 * 10) / 10
      totalSavollarSoni = 40
    } else {
      numericScore = parseInt(body.score, 10) || 0
      numericPercent = parseFloat(body.percentage) || 0
      totalSavollarSoni = parseInt(body.totalQuestions, 10) || 30
    }

    const passed = numericPercent >= (partnership.minPassPercent || 60.0)

    // Urinishni bazaga saqlaymiz
    const attempt = await prisma.partnershipAttempt.create({
      data: {
        partnershipId: partnership.id,
        userId: session.user.id,
        score: numericScore,
        percentage: numericPercent,
        totalQuestions: totalSavollarSoni,
        timeSpentSec: parseInt(timeSpentSec, 10) || 0,
        passed,
        certId: null
      }
    })

    return NextResponse.json({
      success: true,
      hasSubmitted: true,
      isAnnounced: partnership.isAnnounced,
      message: "Javoblaringiz qabul qilindi. Natijalar sinov yakunlangach rasman e'lon qilinadi.",
      completedAt: attempt.completedAt
    })
  } catch (error) {
    console.error('[Hamkorlik POST Error]:', error)
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 })
  }
}
