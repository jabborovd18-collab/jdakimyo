// app/api/admin/mavsumiyhamkor/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { isAdminRole } from '@/lib/roles'

// Yagona unikal sertifikat raqami yasovchi
function certIdGeneratsiya(prefiks = 'AK-JK-2025-') {
  const tasodif = Math.floor(1000 + Math.random() * 9000)
  return `${prefiks}${tasodif}`
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !isAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const event = await prisma.seasonalPartnership.findUnique({
        where: { id },
        include: {
          attempts: {
            include: {
              user: {
                select: { id: true, userId: true, username: true, fullName: true, avatar: true }
              }
            },
            orderBy: [{ score: 'desc' }, { timeSpentSec: 'asc' }],
            take: 100
          }
        }
      })
      if (!event) return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })
      return NextResponse.json({ event })
    }

    const [events, attemptsCount, certsCount] = await Promise.all([
      prisma.seasonalPartnership.findMany({
        include: {
          _count: { select: { attempts: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.partnershipAttempt.count(),
      prisma.partnershipAttempt.count({ where: { passed: true } })
    ])

    return NextResponse.json({
      events,
      stats: {
        totalEvents: events.length,
        totalAttempts: attemptsCount,
        totalCertificates: certsCount
      }
    })
  } catch (error) {
    console.error('[Admin Mavsumiyhamkor GET Error]:', error)
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !isAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const body = await req.json()
    const { action } = body

    // 1. ADMIN TOMONIDAN QO'LDA SERTIFIKAT BERISH
    if (action === 'issue_manual_cert') {
      const {
        partnershipId,
        userId,
        fullName,
        score,
        percentage,
        timeSpentSec = 1200,
        customCertId
      } = body

      if (!userId || !fullName) {
        return NextResponse.json({ error: 'Foydalanuvchi va to\'liq ism kiritilishi shart' }, { status: 400 })
      }

      let partnership = null
      if (partnershipId) {
        partnership = await prisma.seasonalPartnership.findUnique({ where: { id: partnershipId } })
      }

      const certId = (customCertId && customCertId.trim()) 
        ? customCertId.trim().toUpperCase() 
        : certIdGeneratsiya(partnership?.certPrefix || 'AK-JK-2025-')

      const certReason = partnership?.certReason || 
        `${partnership?.partnerName || 'AlchemIQ'} va JDA Kimyo tomonidan tashkil etilgan ${partnership?.title || '1 KUNLIK SINOV TESTIDA'} yuqori natija ko'rsatganligi va bilim darajasining a'lo darajada ekanligi uchun taqdim etiladi.`

      const numericScore = parseInt(score, 10) || 30
      const numericPercent = parseFloat(percentage) || 100.0

      // Sertifikatni Certificate jadvaliga rasmiylashtirish
      const cert = await prisma.certificate.create({
        data: {
          certId,
          userId,
          fullName: fullName.trim(),
          fan: `Mavsumiy Hamkorlik: ${partnership?.title || 'Sinov Testi'}`,
          reason: certReason,
          examName: partnership?.title || 'Mavsumiy Sinov Testi',
          grade: numericPercent >= 90 ? "A'lo (1-daraja)" : "Yuqori natija",
          score: numericScore,
          percentage: numericPercent,
          issuedById: session.user.id,
          seals: {
            partnerName: partnership?.partnerName || 'AlchemIQ',
            partnerLogo: partnership?.partnerLogo || '/images/alchemiq-logo.png',
            partnerSignName: partnership?.partnerSignName || 'AlchemIQ Sardor Ergashev',
            partnerSignUrl: partnership?.partnerSignUrl || null,
            jdaSignName: partnership?.jdaSignName || 'JDA Kimyo Jamoasi',
            jdaSignUrl: partnership?.jdaSignUrl || null,
            badgeText: partnership?.badgeText || 'YUKORI NATIJA'
          }
        }
      })

      // Agar tadbir biriktirilgan bo'lsa, urinish sifatida ham yozib qo'yamiz
      if (partnership) {
        await prisma.partnershipAttempt.create({
          data: {
            partnershipId: partnership.id,
            userId,
            score: numericScore,
            percentage: numericPercent,
            totalQuestions: 30,
            timeSpentSec: parseInt(timeSpentSec, 10) || 0,
            passed: true,
            certId: cert.certId
          }
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Mavsumiy sertifikat muvaffaqiyatli berildi!',
        certificate: cert
      })
    }

    // 2. TADBIY YARATISH / TAHRIRLASH
    const {
      id,
      slug,
      title,
      partnerName,
      partnerLogo,
      partnerSignName,
      partnerSignUrl,
      jdaSignName = 'JDA Kimyo Jamoasi',
      jdaSignUrl,
      description,
      certReason,
      certPrefix = 'AK-JK-2025-',
      badgeText = 'YUKORI NATIJA',
      minPassPercent = 75.0,
      timeLimitMin = 40,
      startsAt,
      endsAt,
      isActive = true
    } = body

    if (!slug || !title || !partnerName || !startsAt || !endsAt) {
      return NextResponse.json({ error: 'Barcha asosiy maydonlarni to\'ldiring' }, { status: 400 })
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-')

    const data = {
      slug: cleanSlug,
      title: title.trim(),
      partnerName: partnerName.trim(),
      partnerLogo: partnerLogo || null,
      partnerSignName: partnerSignName ? partnerSignName.trim() : null,
      partnerSignUrl: partnerSignUrl || null,
      jdaSignName: jdaSignName ? jdaSignName.trim() : 'JDA Kimyo Jamoasi',
      jdaSignUrl: jdaSignUrl || null,
      description: description || null,
      certReason: certReason || null,
      certPrefix: certPrefix ? certPrefix.trim().toUpperCase() : 'AK-JK-2025-',
      badgeText: badgeText ? badgeText.trim().toUpperCase() : 'YUKORI NATIJA',
      minPassPercent: parseFloat(minPassPercent) || 75.0,
      timeLimitMin: parseInt(timeLimitMin, 10) || 40,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      isActive: Boolean(isActive)
    }

    let result
    if (id) {
      result = await prisma.seasonalPartnership.update({
        where: { id },
        data
      })
    } else {
      result = await prisma.seasonalPartnership.create({
        data
      })
    }

    return NextResponse.json({
      success: true,
      message: id ? 'Hamkorlik yangilandi' : 'Yangi mavsumiy hamkorlik yaratildi',
      event: result
    })
  } catch (error) {
    console.error('[Admin Mavsumiyhamkor POST Error]:', error)
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !isAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID kiritilmadi' }, { status: 400 })

    await prisma.seasonalPartnership.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'O\'chirildi' })
  } catch (error) {
    console.error('[Admin Mavsumiyhamkor DELETE Error]:', error)
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 })
  }
}
