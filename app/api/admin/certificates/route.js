// app/api/admin/certificates/route.js
//
// Sertifikatni FAQAT admin beradi. Avval sertifikat bazaga umuman yozilmasdi —
// foydalanuvchi sahifada o'z ismini va ballini kiritib PDF yasab olardi, ya'ni
// u hech narsani tasdiqlamasdi. Endi har bir sertifikat bazada yozuv, uni QR
// orqali tekshirish mumkin va kim bergani qaydnomaga tushadi.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'
import { xabarYubor } from '@/lib/bildirishnoma'

/**
 * Sertifikat raqamini yaratadi: JDA-2026-K7M2QP
 *
 * Adashtiradigan belgilar (0/O, 1/I) ataylab olib tashlangan — raqam
 * qog'ozdagi sertifikatdan qo'lda ko'chiriladi va og'zaki aytiladi.
 * Vaqtinchalik parol yaratishdagi bilan bir xil mulohaza.
 */
function raqamYarat() {
  const belgilar = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const uzunlik = 6

  const baytlar = new Uint32Array(uzunlik)
  crypto.getRandomValues(baytlar)

  let qism = ''
  for (let i = 0; i < uzunlik; i++) {
    qism += belgilar[baytlar[i] % belgilar.length]
  }
  return `JDA-${new Date().getFullYear()}-${qism}`
}

/**
 * Ball maydonlari ixtiyoriy: bo'sh forma maydoni ('' yoki null) 0 emas, null
 * bo'lishi kerak — aks holda ball qo'yilmagan sertifikatda "0 ball" chiqadi.
 */
function raqamYoNull(qiymat, butun = false) {
  if (qiymat === null || qiymat === undefined || qiymat === '') return null
  const son = Number(qiymat)
  if (!Number.isFinite(son)) return null
  return butun ? Math.trunc(son) : son
}

/** Qaydnoma uchun so'rov manbasi */
function sorovManbasi(request) {
  return {
    ipAddress:
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      null,
    userAgent: request.headers.get('user-agent') || null,
  }
}

// GET - Berilgan sertifikatlar ro'yxati
export async function GET(request) {
  try {
    const { isAdmin } = await checkAdminAuth('sertifikatlar')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const fan = searchParams.get('fan') || ''
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''

    const where = {}
    if (fan && fan !== 'all') where.fan = fan
    if (status && status !== 'all') where.status = status
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { certId: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
      ]
    }

    const certificates = await prisma.certificate.findMany({
      where,
      orderBy: { issuedAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, fullName: true, avatar: true } },
        issuedBy: { select: { id: true, username: true, fullName: true } },
      },
    })

    // Fan bo'yicha statistika — admin panelidagi filtr uchun
    const stats = await prisma.certificate.groupBy({
      by: ['fan'],
      _count: true,
    })

    return NextResponse.json({
      success: true,
      certificates,
      stats: stats.reduce((acc, s) => {
        acc[s.fan] = s._count
        return acc
      }, {}),
      total: certificates.length,
    })
  } catch (error) {
    console.error('[Admin Certificates GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Yangi sertifikat berish
export async function POST(request) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth('sertifikatlar')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    const fullName = data.fullName?.trim()
    const fan = data.fan?.trim()
    const reason = data.reason?.trim()

    if (!data.userId || !fullName || !fan || !reason) {
      return NextResponse.json(
        { error: 'Foydalanuvchi, ism-familya, fan va sabab majburiy' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { id: data.userId } })
    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    // Pechatlar: [{url, label}] — noto'g'ri shakl kelsa e'tiborsiz qoldiriladi
    const seals = Array.isArray(data.seals)
      ? data.seals
          .filter((s) => s && typeof s.url === 'string' && s.url.trim())
          .map((s) => ({ url: s.url.trim(), label: (s.label || '').trim() }))
      : []

    const asos = {
      userId: user.id,
      fullName,
      fan,
      reason,
      description: data.description?.trim() || null,
      seals: seals.length > 0 ? seals : null,
      issuedById: admin.id,
      examName: data.examName?.trim() || null,
      grade: data.grade?.trim() || null,
      score: raqamYoNull(data.score, true),
      percentage: raqamYoNull(data.percentage),
      percentile: raqamYoNull(data.percentile),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    }

    // Sertifikat va qaydnoma BIRGA yoziladi. Qaydnomasiz sertifikat qolib
    // ketsa, uni kim bergani ma'lum bo'lmaydi — sertifikatning butun ma'nosi
    // esa aynan javobgarlikda.
    //
    // Raqam noyob bo'lishi shart: ehtimollik past bo'lsa ham to'qnashuvda
    // qayta urinamiz, chunki unique cheklovi yagona haqiqiy himoya.
    let certificate = null
    for (let urinish = 0; urinish < 5; urinish++) {
      try {
        certificate = await prisma.$transaction(async (tx) => {
          const cert = await tx.certificate.create({
            data: { ...asos, certId: raqamYarat() },
          })

          await tx.auditLog.create({
            data: {
              adminId: admin.id,
              action: 'issueCertificate',
              targetType: 'Certificate',
              targetId: cert.certId,
              details: `${user.username} ga "${fan}" bo'yicha sertifikat berildi: ${reason}`,
              ...sorovManbasi(request),
            },
          })

          return cert
        })
        break
      } catch (e) {
        const certIdToqnashuvi = e?.code === 'P2002' && e?.meta?.target?.includes('certId')
        if (!certIdToqnashuvi) throw e
      }
    }

    if (!certificate) {
      return NextResponse.json(
        { error: 'Sertifikat raqamini yaratib bo\'lmadi, qayta urinib ko\'ring' },
        { status: 500 }
      )
    }

    await xabarYubor(user.id, {
      turi: 'sertifikat',
      sarlavha: `📜 Sizga "${fan}" bo'yicha sertifikat berildi`,
      matn: `${reason}. Sertifikat raqami: ${certificate.certId}`,
      havola: '/profil/sertifikatlar',
      adminId: admin.id,
    })

    return NextResponse.json({
      success: true,
      certificate,
      message: `✓ ${fullName} ga sertifikat berildi (${certificate.certId})`,
    })
  } catch (error) {
    console.error('[Admin Certificates POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Sertifikatni tahrirlash yoki bekor qilish (status)
export async function PUT(request) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth('sertifikatlar')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const mavjud = await prisma.certificate.findUnique({ where: { id: data.id } })
    if (!mavjud) {
      return NextResponse.json({ error: 'Sertifikat topilmadi' }, { status: 404 })
    }

    // certId hech qachon o'zgarmaydi: u QR kodda va tarqatilgan PDF'da turadi.
    // userId ham o'zgarmaydi: berilgan sertifikatni boshqa odamga o'tkazish
    // tahrir emas — kerak bo'lsa eskisi bekor qilinib, yangisi beriladi.
    const yangilanish = {}
    if (data.fullName !== undefined) yangilanish.fullName = data.fullName.trim()
    if (data.fan !== undefined) yangilanish.fan = data.fan.trim()
    if (data.reason !== undefined) yangilanish.reason = data.reason.trim()
    if (data.description !== undefined) yangilanish.description = data.description?.trim() || null
    if (data.examName !== undefined) yangilanish.examName = data.examName?.trim() || null
    if (data.grade !== undefined) yangilanish.grade = data.grade?.trim() || null
    if (data.score !== undefined) yangilanish.score = raqamYoNull(data.score, true)
    if (data.percentage !== undefined) yangilanish.percentage = raqamYoNull(data.percentage)
    if (data.percentile !== undefined) yangilanish.percentile = raqamYoNull(data.percentile)
    if (data.seals !== undefined) {
      const seals = Array.isArray(data.seals)
        ? data.seals
            .filter((s) => s && typeof s.url === 'string' && s.url.trim())
            .map((s) => ({ url: s.url.trim(), label: (s.label || '').trim() }))
        : []
      yangilanish.seals = seals.length > 0 ? seals : null
    }
    if (data.status !== undefined) yangilanish.status = data.status
    if (data.expiresAt !== undefined) {
      yangilanish.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null
    }

    const certificate = await prisma.certificate.update({
      where: { id: data.id },
      data: yangilanish,
    })

    // Bekor qilish — sertifikat tarqatilgandan keyin uni yaroqsiz deb belgilash.
    // Bu tekshirish natijasini o'zgartiradi, shuning uchun qaydnomaga tushadi.
    if (data.status !== undefined && data.status !== mavjud.status) {
      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'updateCertificateStatus',
          targetType: 'Certificate',
          targetId: certificate.certId,
          details: `Holat "${mavjud.status}" dan "${certificate.status}" ga o'zgartirildi`,
          ...sorovManbasi(request),
        },
      })
    }

    return NextResponse.json({
      success: true,
      certificate,
      message: '✓ Sertifikat yangilandi',
    })
  } catch (error) {
    console.error('[Admin Certificates PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Sertifikatni o'chirish
export async function DELETE(request) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth('sertifikatlar')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const mavjud = await prisma.certificate.findUnique({ where: { id } })
    if (!mavjud) {
      return NextResponse.json({ error: 'Sertifikat topilmadi' }, { status: 404 })
    }

    await prisma.certificate.delete({ where: { id } })

    // O'chirilgan sertifikatning QR kodi endi "topilmadi" beradi — bu
    // tarqatilgan qog'ozga ta'sir qiladi, shuning uchun izi qolishi kerak.
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'deleteCertificate',
        targetType: 'Certificate',
        targetId: mavjud.certId,
        details: `${mavjud.fullName} ning "${mavjud.fan}" sertifikati o'chirildi`,
        ...sorovManbasi(request),
      },
    })

    return NextResponse.json({
      success: true,
      message: '✓ Sertifikat o\'chirildi',
    })
  } catch (error) {
    console.error('[Admin Certificates DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
