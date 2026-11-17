// app/api/hamkorlik/[slug]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { isAdminRole } from '@/lib/roles'
import { normallashtirHamkorLogoUrl } from '@/lib/sertifikat-tahlil'
import { MILLIY_SERTIFIKAT_1_SAVOLLAR, javobniTekshir } from '@/data/hamkorlik/milliy-sertifikat-1-savollar'
import { MILLIY_SERTIFIKAT_2_SAVOLLAR } from '@/data/hamkorlik/milliy-sertifikat-2-savollar'

const SERTIFIKAT_SAVOLLARI = {
  'sea-ms-sinov': MILLIY_SERTIFIKAT_1_SAVOLLAR,
  'sea-ms-sinov-2': MILLIY_SERTIFIKAT_2_SAVOLLAR,
}

export async function GET(req, { params }) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)
    const isAdmin = Boolean(session?.user && !session.user.doskaTugaydi && isAdminRole(session.user.role))

    const partnership = await prisma.seasonalPartnership.findUnique({
      where: { slug },
      include: {
        attempts: {
          where: {
            passed: true,
            user: {
              role: { notIn: ['admin', 'superadmin', 'moderator', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR'] }
            }
          },
          select: {
            id: true,
            score: true,
            percentage: true,
            totalQuestions: true,
            timeSpentSec: true,
            completedAt: true,
            user: {
              select: { userId: true, username: true, fullName: true, avatar: true }
            }
          },
          orderBy: [{ score: 'desc' }, { timeSpentSec: 'asc' }],
          take: 50
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
        // Faqat javoblar topshirilgan bo'lsa haqiqiy topshirilgan hisoblanadi
        const isActuallySubmitted = attempt.answers !== null || (attempt.score > 0 && !attempt.startedAt)
        hasSubmitted = isActuallySubmitted

        if (partnership.isAnnounced || isAdmin) {
          // Umumiy reytingdagi o'rnini hisoblaymiz (adminlar hisoblanmaydi)
          let rank = null
          if (!isAdmin && isActuallySubmitted) {
            const betterCount = await prisma.partnershipAttempt.count({
              where: {
                partnershipId: partnership.id,
                user: {
                  role: { notIn: ['admin', 'superadmin', 'moderator', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR'] }
                },
                OR: [
                  { score: { gt: attempt.score } },
                  {
                    score: attempt.score,
                    timeSpentSec: { lt: attempt.timeSpentSec }
                  }
                ]
              }
            })
            rank = betterCount + 1
          }

          userAttempt = {
            id: attempt.id,
            score: attempt.score,
            percentage: attempt.percentage,
            totalQuestions: attempt.totalQuestions,
            timeSpentSec: attempt.timeSpentSec,
            passed: attempt.passed,
            completedAt: attempt.completedAt,
            startedAt: attempt.startedAt,
            hasSubmitted: isActuallySubmitted,
            rank,
            answers: attempt.answers || null
          }
        } else {
          // Natija e'lon qilinmagan bo'lsa, ball va javoblar yashirin bo'ladi
          userAttempt = {
            hasSubmitted: isActuallySubmitted,
            startedAt: attempt.startedAt,
            completedAt: isActuallySubmitted ? attempt.completedAt : null,
            totalQuestions: attempt.totalQuestions
          }
        }
      }
    }

    // Leaderboard faqat natijalar e'lon qilinganda to'liq ko'rsatiladi
    const leaderboard = partnership.isAnnounced ? (partnership.attempts || []) : []

    const now = new Date()
    const ruxsatSavollar = isAdmin || (partnership.startsAt && now >= new Date(partnership.startsAt))

    const savollarManbai = SERTIFIKAT_SAVOLLARI[slug]

    return NextResponse.json({
      partnership: {
        id: partnership.id,
        slug: partnership.slug,
        title: partnership.title,
        partnerName: partnership.partnerName,
        partnerLogo: normallashtirHamkorLogoUrl(partnership.partnerLogo),
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
      isAdmin,
      savollar: (savollarManbai && ruxsatSavollar)
        ? savollarManbai.map((s) => ({
            id: s.id,
            turi: s.turi,
            rasm: s.rasm,
            options: s.options || null,
            optionLabels: s.optionLabels || null,
          }))
        : [],
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
    const isAdmin = Boolean(session?.user && !session.user.doskaTugaydi && isAdminRole(session.user.role))

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Iltimos, avval tizimga kiring' }, { status: 401 })
    }

    const partnership = await prisma.seasonalPartnership.findUnique({
      where: { slug }
    })

    if (!partnership) {
      return NextResponse.json({ error: 'Hamkorlik topilmadi' }, { status: 404 })
    }

    // 1. BIR PROFIL FAQAT BIR MARTA TOPSHIRA OLADI (Adminlar mustasno)
    const existingAttempt = await prisma.partnershipAttempt.findUnique({
      where: {
        partnershipId_userId: {
          partnershipId: partnership.id,
          userId: session.user.id
        }
      }
    })

    const now = new Date()
    if (!isAdmin && (!partnership.isActive || now < partnership.startsAt || now > partnership.endsAt)) {
      return NextResponse.json({ error: 'Ushbu sinov muddati yakunlangan yoki nofaol' }, { status: 400 })
    }

    const body = await req.json()

    // Admin sinovi faqat tekshirish uchun: u urinish, reyting yoki hisobot yaratmaydi.
    if (isAdmin) {
      return NextResponse.json({
        success: true,
        startedAt: new Date(),
        completedAt: new Date(),
        isAnnounced: partnership.isAnnounced,
        message: body.action === 'start' ? 'Admin sinovi boshlandi' : 'Admin sinovi yakunlandi'
      })
    }

    // A) TESTNI BOSHLASH SIGNALINI QAYD ETISH (startedAt)
    if (body.action === 'start') {
      let attempt = existingAttempt
      if (!attempt) {
        attempt = await prisma.partnershipAttempt.create({
          data: {
            partnershipId: partnership.id,
            userId: session.user.id,
            score: 0,
            percentage: 0,
            totalQuestions: SERTIFIKAT_SAVOLLARI[slug] ? 40 : 30,
            timeSpentSec: 0,
            startedAt: new Date(),
            passed: false
          }
        })
      } else if (!attempt.startedAt) {
        attempt = await prisma.partnershipAttempt.update({
          where: { id: attempt.id },
          data: { startedAt: new Date() }
        })
      }

      return NextResponse.json({
        success: true,
        startedAt: attempt.startedAt,
        message: 'Sinov rasman boshlandi'
      })
    }

    // B) TESTNI TOPSHIRISH (SUBMIT)
    // 1. BIR PROFIL FAQAT BIR MARTA TOPSHIRA OLADI (Adminlar mustasno)
    if (existingAttempt && existingAttempt.answers !== null && !isAdmin) {
      return NextResponse.json({
        error: 'Siz ushbu sinov testini allaqachon topshirgansiz. Qayta topshirishga ruxsat berilmaydi.'
      }, { status: 400 })
    }

    if (!existingAttempt?.startedAt) {
      return NextResponse.json({ error: 'Avval testni boshlang' }, { status: 400 })
    }

    const maxAllowedSec = (partnership.timeLimitMin || 100) * 60
    const rawTimeSpent = parseInt(body.timeSpentSec, 10) || 0
    const timeSpentSecClamped = Math.min(Math.max(1, rawTimeSpent), maxAllowedSec)

    // SERVER TOMONIDA HAQIQIY SARFLANGAN VAQTNI ANIQ HISOBLASH
    let finalTimeSpentSec = timeSpentSecClamped
    if (existingAttempt?.startedAt) {
      const serverElapsed = Math.floor((now.getTime() - new Date(existingAttempt.startedAt).getTime()) / 1000)
      finalTimeSpentSec = Math.min(Math.max(1, serverElapsed), maxAllowedSec)
    }

    const savollarManbai = SERTIFIKAT_SAVOLLARI[slug]
    if (!savollarManbai) {
      return NextResponse.json(
        { error: 'Ushbu sinov uchun server savollar banki topilmadi' },
        { status: 400 }
      )
    }

    let togri = 0
    savollarManbai.forEach((savol) => {
      const berilgan = body.javoblar?.[savol.id]
      if (javobniTekshir(savol, berilgan)) {
        togri++
      }
    })
    const totalSavollarSoni = savollarManbai.length || 40
    const numericScore = togri
    const numericPercent = Math.round((togri / totalSavollarSoni) * 100 * 10) / 10

    // Sinov testlarida o'tish bali yo'q: ular sertifikat emas, tayyorgarlik uchun.
    const passed = true

    const attempt = await prisma.$transaction(async (tx) => {
      const joriy = await tx.partnershipAttempt.findUnique({
        where: { id: existingAttempt.id },
        select: { id: true, answers: true },
      })
      if (!joriy || joriy.answers !== null) {
        throw new Error('ALLAQACHON_TOPSHIRILGAN')
      }
      return tx.partnershipAttempt.update({
        where: { id: existingAttempt.id },
        data: {
          score: numericScore,
          percentage: numericPercent,
          totalQuestions: totalSavollarSoni,
          timeSpentSec: finalTimeSpentSec,
          answers: body.javoblar && typeof body.javoblar === 'object' ? body.javoblar : {},
          passed,
          completedAt: new Date(),
        },
      })
    }, { isolationLevel: 'Serializable' })

    return NextResponse.json({
      success: true,
      hasSubmitted: true,
      isAnnounced: partnership.isAnnounced,
      message: "Javoblaringiz qabul qilindi. Natijalar sinov yakunlangach rasman e'lon qilinadi.",
      completedAt: attempt.completedAt,
      score: partnership.isAnnounced ? numericScore : undefined,
      percentage: partnership.isAnnounced ? numericPercent : undefined
    })
  } catch (error) {
    if (error?.message === 'ALLAQACHON_TOPSHIRILGAN' || error?.code === 'P2034') {
      return NextResponse.json(
        { error: 'Siz ushbu sinov testini allaqachon topshirgansiz. Qayta topshirishga ruxsat berilmaydi.' },
        { status: 400 }
      )
    }
    console.error('[Hamkorlik POST Error]:', error)
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 })
  }
}
