// app/api/hamkorlik/[slug]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

function certIdGeneratsiya(prefiks = 'AK-JK-2025-') {
  const tasodif = Math.floor(1000 + Math.random() * 9000)
  return `${prefiks}${tasodif}`
}

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
    if (session?.user?.id) {
      userAttempt = await prisma.partnershipAttempt.findFirst({
        where: {
          partnershipId: partnership.id,
          userId: session.user.id
        },
        orderBy: { completedAt: 'desc' }
      })
    }

    return NextResponse.json({
      partnership,
      leaderboard: partnership.attempts || [],
      userAttempt
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

    const now = new Date()
    if (!partnership.isActive || now < partnership.startsAt || now > partnership.endsAt) {
      return NextResponse.json({ error: 'Ushbu sinov muddati yakunlangan yoki nofaol' }, { status: 400 })
    }

    const body = await req.json()
    const { score = 0, percentage = 0, totalQuestions = 30, timeSpentSec = 0 } = body

    const numericScore = parseInt(score, 10)
    const numericPercent = parseFloat(percentage)
    const passed = numericPercent >= (partnership.minPassPercent || 75.0)

    let cert = null
    let certId = null

    // Agar o'tgan bo'lsa, rasmiy sertifikat yaratamiz
    if (passed) {
      certId = certIdGeneratsiya(partnership.certPrefix || 'AK-JK-2025-')
      const certReason = partnership.certReason || 
        `${partnership.partnerName} va JDA Kimyo tomonidan tashkil etilgan ${partnership.title}da yuqori natija ko'rsatganligi va bilim darajasining a'lo darajada ekanligi uchun taqdim etiladi.`

      // User ma'lumotini olamiz
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { fullName: true, username: true }
      })

      const ism = user?.fullName || user?.username || session.user.name || 'Ishtirokchi'

      cert = await prisma.certificate.create({
        data: {
          certId,
          userId: session.user.id,
          fullName: ism,
          fan: `Mavsumiy Hamkorlik: ${partnership.title}`,
          reason: certReason,
          examName: partnership.title,
          grade: numericPercent >= 90 ? "A'lo (1-daraja)" : "Yuqori natija",
          score: numericScore,
          percentage: numericPercent,
          seals: {
            partnerName: partnership.partnerName,
            partnerLogo: partnership.partnerLogo || '/images/alchemiq-logo.png',
            partnerSignName: partnership.partnerSignName || 'AlchemIQ Sardor Ergashev',
            partnerSignUrl: partnership.partnerSignUrl || null,
            jdaSignName: partnership.jdaSignName || 'JDA Kimyo Jamoasi',
            jdaSignUrl: partnership.jdaSignUrl || null,
            badgeText: partnership.badgeText || 'YUKORI NATIJA'
          }
        }
      })
    }

    // Urinishni bazaga yozamiz
    const attempt = await prisma.partnershipAttempt.create({
      data: {
        partnershipId: partnership.id,
        userId: session.user.id,
        score: numericScore,
        percentage: numericPercent,
        totalQuestions: parseInt(totalQuestions, 10) || 30,
        timeSpentSec: parseInt(timeSpentSec, 10) || 0,
        passed,
        certId: certId || null
      }
    })

    return NextResponse.json({
      success: true,
      passed,
      certId,
      certificate: cert,
      attempt
    })
  } catch (error) {
    console.error('[Hamkorlik POST Error]:', error)
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 })
  }
}
