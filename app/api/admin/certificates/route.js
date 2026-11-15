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
import { SERTIFIKAT_TURLARI, qurAdminSertifikatFiltr } from '@/lib/sertifikat-tahlil'
import { foydalanuvchilargaSertifikatPdfYubor } from '@/lib/telegram-sertifikat'

const RUXSAT_ETILGAN_TURLAR = new Set(Object.values(SERTIFIKAT_TURLARI))

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
    const manba = searchParams.get('manba') || ''
    const search = searchParams.get('search') || ''

    const { realUserFiltr, where, msWhere, hamkorWhere, qoldaWhere } =
      qurAdminSertifikatFiltr({ fan, status, manba, search })

    const [certificates, stats, msCount, hamkorCount, qoldaCount] = await Promise.all([
      prisma.certificate.findMany({
        where,
        orderBy: { issuedAt: 'desc' },
        include: {
          user: { select: { id: true, username: true, fullName: true, avatar: true } },
          issuedBy: { select: { id: true, username: true, fullName: true } },
        },
      }),
      // Fan bo'yicha statistika — admin panelidagi filtr uchun (superadmin sinovisiz)
      prisma.certificate.groupBy({
        by: ['fan'],
        where: realUserFiltr,
        _count: true,
      }),
      prisma.certificate.count({ where: msWhere }),
      prisma.certificate.count({ where: hamkorWhere }),
      prisma.certificate.count({ where: qoldaWhere }),
    ])

    return NextResponse.json({
      success: true,
      certificates,
      stats: stats.reduce((acc, s) => {
        acc[s.fan] = s._count
        return acc
      }, {}),
      manbaCounts: {
        jami: msCount + hamkorCount + qoldaCount,
        ms: msCount,
        hamkor: hamkorCount,
        qolda: qoldaCount,
      },
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

    const turi =
      typeof data.turi === 'string' && RUXSAT_ETILGAN_TURLAR.has(data.turi.trim())
        ? data.turi.trim()
        : SERTIFIKAT_TURLARI.maxsus
    const metadata =
      data.metadata && typeof data.metadata === 'object' && !Array.isArray(data.metadata)
        ? data.metadata
        : null

    const asos = {
      userId: user.id,
      fullName,
      fan,
      reason,
      turi,
      metadata,
      fullNameLocked: Boolean(data.fullNameLocked),
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

    const pdfNatija = await foydalanuvchilargaSertifikatPdfYubor([certificate])

    return NextResponse.json({
      success: true,
      certificate,
      telegramPdfSoni: pdfNatija.yuborildi,
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
    if (typeof data.turi === 'string' && RUXSAT_ETILGAN_TURLAR.has(data.turi.trim())) {
      yangilanish.turi = data.turi.trim()
    }
    if (data.metadata !== undefined) {
      yangilanish.metadata =
        data.metadata && typeof data.metadata === 'object' && !Array.isArray(data.metadata)
          ? data.metadata
          : null
    }
    if (typeof data.fullNameLocked === 'boolean') {
      yangilanish.fullNameLocked = data.fullNameLocked
      // Eski JSON/metadata ichidagi qulf bayrog'ini ham sinxron saqlaymiz
      if (
        yangilanish.metadata === undefined &&
        mavjud.metadata &&
        typeof mavjud.metadata === 'object' &&
        !Array.isArray(mavjud.metadata)
      ) {
        yangilanish.metadata = {
          ...mavjud.metadata,
          fullNameLocked: data.fullNameLocked,
        }
      }
      if (
        yangilanish.description === undefined &&
        typeof mavjud.description === 'string' &&
        mavjud.description.trim().startsWith('{')
      ) {
        try {
          const parsed = JSON.parse(mavjud.description)
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            yangilanish.description = JSON.stringify({
              ...parsed,
              fullNameLocked: data.fullNameLocked,
            })
          }
        } catch {
          // Yaroqsiz JSON bo'lsa, asl description qoldiriladi
        }
      }
    }
    if (data.examName !== undefined) yangilanish.examName = data.examName?.trim() || null
    if (data.grade !== undefined) yangilanish.grade = data.grade?.trim() || null
    if (data.score !== undefined) yangilanish.score = raqamYoNull(data.score, true)
    if (data.percentage !== undefined) yangilanish.percentage = raqamYoNull(data.percentage)
    if (data.percentile !== undefined) yangilanish.percentile = raqamYoNull(data.percentile)
    if (data.seals !== undefined) {
      if (Array.isArray(data.seals)) {
        const seals = data.seals
          .filter((s) => s && typeof s.url === 'string' && s.url.trim())
          .map((s) => ({ url: s.url.trim(), label: (s.label || '').trim() }))
        if (seals.length > 0) {
          yangilanish.seals = seals
        } else if (Array.isArray(mavjud.seals) || mavjud.seals === null) {
          // Hamkorlik muhr obyekti bo'sh massiv kelganda tasodifan o'chib ketmasin
          yangilanish.seals = null
        }
      } else if (data.seals && typeof data.seals === 'object') {
        yangilanish.seals = data.seals
      } else if (data.seals === null) {
        yangilanish.seals = null
      }
    }
    if (data.status !== undefined) yangilanish.status = data.status
    if (data.expiresAt !== undefined) {
      yangilanish.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null
    }

    const certificate = await prisma.certificate.update({
      where: { id: data.id },
      data: yangilanish,
    })

    // Bekor qilish, F.I.SH o'zgartirish yoki tahrir qulfini ochish tekshiruv natijasiga
    // bevosita ta'sir qiladi — barchasi audit qaydnomaga yoziladi.
    const manba = sorovManbasi(request)
    const auditYozuvlar = []

    if (data.status !== undefined && data.status !== mavjud.status) {
      auditYozuvlar.push({
        adminId: admin.id,
        action: 'updateCertificateStatus',
        targetType: 'Certificate',
        targetId: certificate.certId,
        details: `Holat "${mavjud.status}" dan "${certificate.status}" ga o'zgartirildi`,
        ...manba,
      })
    }

    if (data.fullName !== undefined && certificate.fullName !== mavjud.fullName) {
      auditYozuvlar.push({
        adminId: admin.id,
        action: 'updateCertificateName',
        targetType: 'Certificate',
        targetId: certificate.certId,
        details: `F.I.SH "${mavjud.fullName}" dan "${certificate.fullName}" ga o'zgartirildi`,
        ...manba,
      })
    }

    if (
      typeof data.fullNameLocked === 'boolean' &&
      certificate.fullNameLocked !== mavjud.fullNameLocked
    ) {
      auditYozuvlar.push({
        adminId: admin.id,
        action: 'updateCertificateLock',
        targetType: 'Certificate',
        targetId: certificate.certId,
        details: certificate.fullNameLocked
          ? 'F.I.SH 1 martalik tahrirlash qulfi yoqildi'
          : 'F.I.SH qayta tahrirlash qulfi admin tomonidan ochildi',
        ...manba,
      })
    }

    if (auditYozuvlar.length > 0) {
      await Promise.all(auditYozuvlar.map((entry) => prisma.auditLog.create({ data: entry })))
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
