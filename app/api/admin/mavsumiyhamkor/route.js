// app/api/admin/mavsumiyhamkor/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'
import { toshkentSanaParsla } from '@/lib/sana'
import {
  ALCHEMIQ_LOGO,
  SERTIFIKAT_TURLARI,
  normallashtirHamkorLogoUrl,
} from '@/lib/sertifikat-tahlil'
import { foydalanuvchilargaSertifikatPdfYubor } from '@/lib/telegram-sertifikat'
import { qaydEt } from '@/lib/qaydnoma'

function sinovTestimi(event) {
  return event?.slug === 'sea-ms-sinov' || event?.slug === 'sea-ms-sinov-2'
}

const ODDIY_ISHTIROKCHI_ROLLARI = {
  role: { notIn: ['admin', 'superadmin', 'moderator', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR'] },
}

// Bazadagi noyoblikni tekshirib unikal sertifikat raqami yaratish
async function noyobCertIdYarat(prefiks = 'AK-JK-2025-') {
  const belgilar = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  for (let urinish = 0; urinish < 8; urinish++) {
    const baytlar = new Uint32Array(5)
    crypto.getRandomValues(baytlar)
    let kod = ''
    for (let i = 0; i < baytlar.length; i++) {
      kod += belgilar[baytlar[i] % belgilar.length]
    }
    const nomzod = `${prefiks}${kod}`
    const bor = await prisma.certificate.findUnique({ where: { certId: nomzod }, select: { id: true } })
    if (!bor) return nomzod
  }
  return `${prefiks}${Date.now().toString(36).toUpperCase()}`
}

export async function GET(req) {
  try {
    const { isAdmin } = await checkAdminAuth('sertifikatlar')
    if (!isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const event = await prisma.seasonalPartnership.findUnique({
        where: { id },
        include: {
          attempts: {
            where: { user: ODDIY_ISHTIROKCHI_ROLLARI },
            include: {
              user: {
                select: { id: true, userId: true, username: true, fullName: true, avatar: true },
              },
            },
            orderBy: [{ score: 'desc' }, { timeSpentSec: 'asc' }],
            take: 100,
          },
        },
      })
      if (!event) return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })
      return NextResponse.json({
        event: {
          ...event,
          partnerLogo: normallashtirHamkorLogoUrl(event.partnerLogo),
        },
      })
    }

    const [events, attemptsCount, certsCount] = await Promise.all([
      prisma.seasonalPartnership.findMany({
        include: {
          _count: { select: { attempts: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.partnershipAttempt.count(),
      prisma.certificate.count(),
    ])

    const normEvents = events.map((ev) => ({
      ...ev,
      partnerLogo: normallashtirHamkorLogoUrl(ev.partnerLogo),
    }))

    return NextResponse.json({
      events: normEvents,
      stats: {
        totalEvents: events.length,
        totalAttempts: attemptsCount,
        totalCertificates: certsCount,
      },
    })
  } catch (error) {
    console.error('[Admin Mavsumiyhamkor GET Error]:', error)
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth('sertifikatlar')
    if (!isAdmin) {
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
        customCertId,
      } = body

      if (!userId || !fullName) {
        return NextResponse.json({ error: "Foydalanuvchi va to'liq ism kiritilishi shart" }, { status: 400 })
      }

      let partnership = null
      if (partnershipId) {
        partnership = await prisma.seasonalPartnership.findUnique({ where: { id: partnershipId } })
      }

      if (sinovTestimi(partnership)) {
        return NextResponse.json({ error: 'Sinov testi uchun sertifikat berilmaydi' }, { status: 400 })
      }

      const certId = (customCertId && customCertId.trim())
        ? customCertId.trim().toUpperCase()
        : await noyobCertIdYarat(partnership?.certPrefix || 'AK-JK-2025-')

      const certReason = partnership?.certReason ||
        `${partnership?.partnerName || 'AlchemIQ'} va JDA Kimyo tomonidan tashkil etilgan ${partnership?.title || '1 KUNLIK SINOV TESTIDA'} yuqori natija ko'rsatganligi va bilim darajasining a'lo darajada ekanligi uchun taqdim etiladi.`

      const numericScore = parseInt(score, 10) || 30
      const numericPercent = parseFloat(percentage) || 100.0

      const cert = await prisma.certificate.create({
        data: {
          certId,
          userId,
          fullName: fullName.trim(),
          fan: `Mavsumiy Hamkorlik: ${partnership?.title || 'Sinov Testi'}`,
          reason: certReason,
          turi: SERTIFIKAT_TURLARI.hamkor,
          metadata: {
            partnershipId: partnership?.id || null,
            partnerName: partnership?.partnerName || 'AlchemIQ',
            badgeText: partnership?.badgeText || 'YUKORI NATIJA',
            isManual: true,
          },
          examName: partnership?.title || 'Mavsumiy Sinov Testi',
          grade: numericPercent >= 90 ? "A'lo (1-daraja)" : 'Yuqori natija',
          score: numericScore,
          percentage: numericPercent,
          issuedById: admin.id,
          seals: {
            partnerName: partnership?.partnerName || 'AlchemIQ',
            partnerLogo: normallashtirHamkorLogoUrl(partnership?.partnerLogo) || ALCHEMIQ_LOGO,
            partnerSignName: partnership?.partnerSignName || 'AlchemIQ Sardor Ergashev',
            partnerSignUrl: partnership?.partnerSignUrl || null,
            jdaSignName: partnership?.jdaSignName || 'JDA Kimyo Jamoasi',
            jdaSignUrl: partnership?.jdaSignUrl || null,
            badgeText: partnership?.badgeText || 'YUKORI NATIJA',
            isManual: true,
          },
        },
      })

      const pdfNatija = await foydalanuvchilargaSertifikatPdfYubor([cert])

      await qaydEt({
        adminId: admin.id,
        action: 'issue_manual_partnership_cert',
        targetType: 'Certificate',
        targetId: cert.id,
        details: `${cert.certId} -> ${fullName.trim()}`,
        request: req,
      })

      return NextResponse.json({
        success: true,
        message: 'Mavsumiy sertifikat muvaffaqiyatli berildi!',
        certificate: cert,
        telegramPdfSoni: pdfNatija.yuborildi,
      })
    }

    // 2. NATIJALARNI RASMAN E'LON QILISH
    if (action === 'publish_results') {
      const { partnershipId } = body
      if (!partnershipId) {
        return NextResponse.json({ error: 'Hamkorlik ID kiritilmadi' }, { status: 400 })
      }

      const event = await prisma.seasonalPartnership.findUnique({
        where: { id: partnershipId },
        include: {
          attempts: {
            where: { user: ODDIY_ISHTIROKCHI_ROLLARI },
            include: {
              user: { select: { id: true, userId: true, username: true, fullName: true } },
            },
          },
        },
      })
      if (!event) return NextResponse.json({ error: 'Tadbir topilmadi' }, { status: 404 })

      await prisma.seasonalPartnership.update({
        where: { id: partnershipId },
        data: {
          isAnnounced: true,
          publishedAt: new Date(),
        },
      })

      let certsCreated = 0
      const yaratilganSertifikatlar = []
      if (!sinovTestimi(event)) {
        for (const attempt of event.attempts) {
          if (attempt.passed && !attempt.certId) {
            const certId = await noyobCertIdYarat(event.certPrefix || 'AK-JK-2025-')
            const certReason = event.certReason ||
              `${event.partnerName || 'AlchemIQ'} va JDA Kimyo tomonidan tashkil etilgan ${event.title || '1 KUNLIK SINOV TESTIDA'} yuqori natija ko'rsatganligi va bilim darajasining a'lo darajada ekanligi uchun taqdim etiladi.`

            const yangiCert = await prisma.certificate.create({
              data: {
                certId,
                userId: attempt.userId,
                fullName: attempt.user.fullName || attempt.user.username,
                fan: `Mavsumiy Hamkorlik: ${event.title}`,
                reason: certReason,
                turi: SERTIFIKAT_TURLARI.hamkor,
                metadata: {
                  partnershipId: event.id,
                  attemptId: attempt.id,
                  partnerName: event.partnerName || null,
                  badgeText: event.badgeText || 'YUKORI NATIJA',
                  passed: Boolean(attempt.passed),
                },
                examName: event.title,
                grade: attempt.percentage >= 90 ? "A'lo (1-daraja)" : 'Yuqori natija',
                score: attempt.score,
                percentage: attempt.percentage,
                issuedById: admin.id,
                seals: {
                  partnerName: event.partnerName,
                  partnerLogo: normallashtirHamkorLogoUrl(event.partnerLogo) || ALCHEMIQ_LOGO,
                  partnerSignName: event.partnerSignName || 'AlchemIQ Sardor Ergashev',
                  partnerSignUrl: event.partnerSignUrl || null,
                  jdaSignName: event.jdaSignName || 'JDA Kimyo Jamoasi',
                  jdaSignUrl: event.jdaSignUrl || null,
                  badgeText: event.badgeText || 'YUKORI NATIJA',
                },
              },
            })

            await prisma.partnershipAttempt.update({
              where: { id: attempt.id },
              data: { certId },
            })
            yaratilganSertifikatlar.push(yangiCert)
            certsCreated++
          }
        }
      }

      const pdfNatija = await foydalanuvchilargaSertifikatPdfYubor(yaratilganSertifikatlar)

      await qaydEt({
        adminId: admin.id,
        action: 'publish_partnership_results',
        targetType: 'Certificate',
        targetId: event.id,
        details: `${event.title}: ${certsCreated} ta sertifikat`,
        request: req,
      })

      return NextResponse.json({
        success: true,
        certsCreated,
        telegramPdfSoni: pdfNatija.yuborildi,
        message: sinovTestimi(event)
          ? "Natijalar rasman e'lon qilindi. Bu sinov testi uchun sertifikat berilmaydi."
          : `Natijalar rasman e'lon qilindi! ${certsCreated} ta sertifikat rasmiylashtirildi${pdfNatija.yuborildi > 0 ? ` (${pdfNatija.yuborildi} ta Telegram PDF yuborildi)` : ''}.`,
      })
    }

    // 3. NATIJALAR E'LONINI BEKOR QILISH (YASHIRISH)
    if (action === 'unpublish_results') {
      const { partnershipId } = body
      if (!partnershipId) {
        return NextResponse.json({ error: 'Hamkorlik ID kiritilmadi' }, { status: 400 })
      }

      await prisma.seasonalPartnership.update({
        where: { id: partnershipId },
        data: { isAnnounced: false },
      })

      await qaydEt({
        adminId: admin.id,
        action: 'unpublish_partnership_results',
        targetType: 'Certificate',
        targetId: partnershipId,
        details: "Natijalar e'loni bekor qilindi",
        request: req,
      })

      return NextResponse.json({
        success: true,
        message: "Natijalar yashirildi (e'lon bekor qilindi).",
      })
    }

    // 4. TADBIR YARATISH / TAHRIRLASH
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
      isActive = true,
    } = body

    if (!slug || !title || !partnerName || !startsAt || !endsAt) {
      return NextResponse.json({ error: "Barcha asosiy maydonlarni to'ldiring" }, { status: 400 })
    }

    const boshlanishSana = toshkentSanaParsla(startsAt) || new Date(startsAt)
    const tugashSana = toshkentSanaParsla(endsAt) || new Date(endsAt)
    if (Number.isNaN(boshlanishSana.getTime()) || Number.isNaN(tugashSana.getTime())) {
      return NextResponse.json({ error: "Sana formati noto'g'ri" }, { status: 400 })
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-')

    const data = {
      slug: cleanSlug,
      title: title.trim(),
      partnerName: partnerName.trim(),
      partnerLogo: normallashtirHamkorLogoUrl(partnerLogo),
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
      startsAt: boshlanishSana,
      endsAt: tugashSana,
      isActive: Boolean(isActive),
    }

    let result
    if (id) {
      result = await prisma.seasonalPartnership.update({
        where: { id },
        data,
      })
    } else {
      result = await prisma.seasonalPartnership.create({
        data,
      })
    }

    await qaydEt({
      adminId: admin.id,
      action: id ? 'update_partnership' : 'create_partnership',
      targetType: 'Certificate',
      targetId: result.id,
      details: `${result.title} (${result.slug})`,
      request: req,
    })

    return NextResponse.json({
      success: true,
      message: id ? 'Hamkorlik yangilandi' : 'Yangi mavsumiy hamkorlik yaratildi',
      event: result,
    })
  } catch (error) {
    console.error('[Admin Mavsumiyhamkor POST Error]:', error)
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth('sertifikatlar')
    if (!isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID kiritilmadi' }, { status: 400 })

    const ochirilgan = await prisma.seasonalPartnership.delete({ where: { id } })
    await qaydEt({
      adminId: admin.id,
      action: 'delete_partnership',
      targetType: 'Certificate',
      targetId: id,
      details: ochirilgan.title,
      request: req,
    })
    return NextResponse.json({ success: true, message: "O'chirildi" })
  } catch (error) {
    console.error('[Admin Mavsumiyhamkor DELETE Error]:', error)
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 })
  }
}
