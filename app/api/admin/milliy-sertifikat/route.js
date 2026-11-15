// app/api/admin/milliy-sertifikat/route.js
//
// Admin panel uchun MS imtihonlarini rejalashtirish (sana/soat),
// ishtirokchilarni kuzatish, kohort Rasch kalibrlashni sinab ko'rish va
// natijalarni barcha ishtirokchilarga bir vaqtda e'lon qilish API'si.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'
import { isSuperAdmin } from '@/lib/roles'
import { MILLIY_SERTIFIKAT_VARIANTLARI } from '@/lib/milliy-sertifikat-data'
import { getSavollarBySlug } from '@/data/milliy-sertifikat/savollar-ombromi'
import { tekshirBank } from '@/lib/milliy-sertifikat-bank'
import { javoblarCsv } from '@/lib/milliy-sertifikat-eksport'
import { xabarYubor } from '@/lib/bildirishnoma'
import { foydalanuvchilargaSertifikatPdfYubor } from '@/lib/telegram-sertifikat'
import {
  jadvalHolatiAniqlash,
  kohortKalibrlaVaHisobla,
  MS_REAL_URINISH_FILTR,
  superadminUrinishimi,
} from '@/lib/milliy-sertifikat-kohort'
import { kalibrlaVaElonQil } from '@/lib/milliy-sertifikat-yakunlash'

export const dynamic = 'force-dynamic'

function sorovManbasi(request) {
  return {
    ipAddress:
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      null,
    userAgent: request.headers.get('user-agent') || null,
  }
}

async function auditYoz(request, adminId, action, targetId, details) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId,
        action,
        targetType: 'MsImtihon',
        targetId,
        details,
        ...sorovManbasi(request),
      },
    })
  } catch (e) {
    console.error('[Admin MS AuditLog]', e.message)
  }
}

function toshkentSanaParsla(qiymat) {
  if (!qiymat || typeof qiymat !== 'string') return null
  const matn = qiymat.trim()
  if (!matn) return null
  if (/([Zz]|[+-]\d{2}:\d{2})$/.test(matn)) {
    const d = new Date(matn)
    return Number.isNaN(d.getTime()) ? null : d
  }
  // Zona bo'lmasa Toshkent UTC+5 (+05:00) deb olamiz
  const toliq = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(matn)
    ? `${matn}:00+05:00`
    : `${matn}+05:00`
  const d = new Date(toliq)
  return Number.isNaN(d.getTime()) ? null : d
}

async function ruxsatliAdminOlish() {
  const { isAdmin, user } = await checkAdminAuth('sertifikatlar')
  return isAdmin && user ? { user } : null
}

export async function GET(request) {
  try {
    const session = await ruxsatliAdminOlish()
    if (!session) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const slugDetal = (searchParams.get('slug') || '').trim()

    let imtihonlar = []
    let migratsiyaXato = null
    const realSanoqMap = new Map()
    let msSertifikatlarSoni = 0
    try {
      imtihonlar = await prisma.msImtihon.findMany({
        orderBy: { createdAt: 'desc' },
      })
      const [guruhlangan, certSoni] = await Promise.all([
        prisma.msUrinish.groupBy({
          by: ['slug'],
          where: MS_REAL_URINISH_FILTR,
          _count: { _all: true },
        }),
        prisma.certificate.count({
          where: {
            certId: { startsWith: 'JDA-MS-' },
            user: { role: { not: 'superadmin' } },
          },
        }),
      ])
      guruhlangan.forEach((g) => realSanoqMap.set(g.slug, g._count?._all ?? 0))
      msSertifikatlarSoni = certSoni
    } catch (e) {
      migratsiyaXato = e.message
    }

    const imtihonMap = new Map(imtihonlar.map((i) => [i.slug, i]))
    const banklar = MILLIY_SERTIFIKAT_VARIANTLARI.map((v) => {
      const bank = getSavollarBySlug(v.slug)
      const tekshiruv = bank.length > 0 ? tekshirBank(v, bank) : { xatolar: ['Savollar kiritilmagan'] }
      const dbImtihon = imtihonMap.get(v.slug) || null
      const holatInfo = jadvalHolatiAniqlash(dbImtihon)

      return {
        slug: v.slug,
        nom: v.nom,
        qisqa: v.qisqa,
        vaqtMin: v.vaqtMin,
        savollarSoni: v.savollarSoni,
        mavjudSavollar: bank.length,
        bankTayyor: bank.length > 0 && tekshiruv.xatolar.length === 0,
        imtihon: dbImtihon
          ? {
              ...dbImtihon,
              urinishlarSoni: realSanoqMap.get(v.slug) ?? 0,
              holat: holatInfo.holat,
            }
          : null,
      }
    })

    const msUmumiyStat = {
      tayyorBanklar: banklar.filter((b) => b.bankTayyor).length,
      jamiBanklar: banklar.length,
      rejalanganlar: banklar.filter((b) => b.imtihon && b.imtihon.holat !== 'belgilanmagan').length,
      ochiqSinovlar: banklar.filter((b) => b.imtihon?.holat === 'ochiq').length,
      elonKutilayotgan: banklar.filter((b) => b.imtihon?.holat === 'tekshirilmoqda').length,
      elonQilingan: banklar.filter((b) => b.imtihon?.isAnnounced).length,
      jamiIshtirokchilar: Array.from(realSanoqMap.values()).reduce((a, b) => a + b, 0),
      msSertifikatlarSoni,
    }

    let tanlanganDetal = null
    if (slugDetal && !migratsiyaXato) {
      const imtihon = await prisma.msImtihon.findUnique({ where: { slug: slugDetal } })
      const bank = getSavollarBySlug(slugDetal)
      const xomUrinishlar = await prisma.msUrinish.findMany({
        where: {
          AND: [
            { OR: [imtihon ? { imtihonId: imtihon.id } : undefined, { slug: slugDetal }].filter(Boolean) },
            MS_REAL_URINISH_FILTR,
          ],
        },
        include: {
          javoblar: true,
          user: { select: { id: true, userId: true, username: true, fullName: true, role: true } },
        },
        orderBy: [{ shkalaBalli: 'desc' }, { yakunlanganVaqt: 'asc' }],
      })
      const urinishlar = xomUrinishlar.filter((u) => !superadminUrinishimi(u))

      let kalibrlashOldindan = null
      let csvAnonim = null
      if (bank.length > 0 && urinishlar.length > 0) {
        const hisob = kohortKalibrlaVaHisobla(bank, urinishlar, { slug: slugDetal })
        const natijaMap = new Map(hisob.yangilanganUrinishlar.map((y) => [y.urinishId, y]))
        csvAnonim = javoblarCsv(
          urinishlar.map((u) => ({
            ...u,
            urinishTartibi: u.urinishTartibi ?? 1,
          }))
        )
        kalibrlashOldindan = {
          kalibrlashUsuli: hisob.kalibrlashUsuli,
          stats: hisob.kalibrlashStats,
          qatnashchilar: urinishlar.map((u) => {
            const k = natijaMap.get(u.id)
            return {
              id: u.id,
              userId: u.userId,
              profilId: u.user?.userId || null,
              ism: u.user?.fullName || u.user?.username || 'Mehmon',
              username: u.user?.username || null,
              holat: u.holat,
              kechikkan: u.kechikkan,
              sarflanganVaqt: u.sarflanganVaqt,
              yakunlanganVaqt: u.yakunlanganVaqt,
              certId: u.certId,
              rasch: k
                ? {
                    shkalaBalli: k.rasch.shkalaBalli,
                    daraja: k.rasch.daraja,
                    darajaNomi: k.rasch.darajaNomi,
                    theta: k.rasch.theta,
                    se: k.rasch.se,
                    zBaho: k.rasch.zBaho,
                    infit: k.rasch.infitMNSQ,
                    outfit: k.rasch.outfitMNSQ,
                    ishonchsiz: k.rasch.ishonchsiz,
                    rank: k.cohortRank,
                    cohortTotal: k.cohortTotal,
                    percentile: k.percentile,
                  }
                : null,
              oddiy: k ? k.oddiy : null,
              taqqoslash: k ? k.taqqoslash : null,
              sohalarStatistikasi: k?.sohalarStatistikasi || [],
              savolNatijalari: k?.savolNatijalari || [],
            }
          }),
        }
      }

      tanlanganDetal = {
        slug: slugDetal,
        imtihon,
        urinishlarSoni: urinishlar.length,
        kalibrlashOldindan,
        csvAnonim,
      }
    }

    return NextResponse.json({
      banklar,
      imtihonlar,
      msUmumiyStat,
      tanlanganDetal,
      migratsiyaXato,
      superadminRejimi: isSuperAdmin(session.user.role),
      serverVaqt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[Admin MS GET]', err)
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await ruxsatliAdminOlish()
    if (!session) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const body = await request.json().catch(() => null)
    const action = body?.action

    // 1. Imtihon sanasi va sozlamalarini saqlash
    if (action === 'save_exam') {
      const slug = (body?.slug || '').trim()
      const variant = MILLIY_SERTIFIKAT_VARIANTLARI.find((v) => v.slug === slug)
      if (!variant) {
        return NextResponse.json({ error: 'Noto\'g\'ri sinov slug' }, { status: 400 })
      }

      const rejim = body?.rejim === 'erkin' ? 'erkin' : 'jadval'
      const sarlavha = (body?.sarlavha || variant.nom).trim()
      const tavsif = body?.tavsif ? String(body.tavsif).trim() : variant.tavsif
      const vaqtMin = Math.max(10, Math.min(300, parseInt(body?.vaqtMin, 10) || variant.vaqtMin || 100))
      const faol = body?.faol !== false

      let startsAt = null
      let endsAt = null

      if (rejim === 'jadval') {
        startsAt = toshkentSanaParsla(body?.startsAt)
        endsAt = toshkentSanaParsla(body?.endsAt)
        if (!startsAt || !endsAt) {
          return NextResponse.json(
            { error: "Belgilangan rejim uchun boshlanish va tugash sanasini kiriting" },
            { status: 400 }
          )
        }
        if (endsAt.getTime() <= startsAt.getTime()) {
          return NextResponse.json(
            { error: "Tugash vaqti boshlanish vaqtidan keyin bo'lishi kerak" },
            { status: 400 }
          )
        }
      }

      const imtihon = await prisma.msImtihon.upsert({
        where: { slug },
        update: {
          sarlavha,
          tavsif,
          startsAt,
          endsAt,
          rejim,
          vaqtMin,
          faol,
        },
        create: {
          slug,
          sarlavha,
          tavsif,
          startsAt,
          endsAt,
          rejim,
          vaqtMin,
          faol,
        },
      })

      await auditYoz(
        request,
        session.user.id,
        'ms_jadval_saqlandi',
        slug,
        `${sarlavha} (${rejim}, ${vaqtMin} daqiqa, faol=${faol})`
      )

      return NextResponse.json({
        success: true,
        message: 'Imtihon jadvali saqlandi',
        imtihon,
      })
    }

    // 2. Kohort Rasch kalibrlash va barcha natijalarni hammaga bir vaqtda e'lon qilish
    if (action === 'publish_results') {
      const slug = (body?.slug || '').trim()
      const imtihon = await prisma.msImtihon.findUnique({ where: { slug } })
      if (!imtihon) {
        return NextResponse.json({ error: 'Avval imtihon jadvalini saqlang' }, { status: 404 })
      }
      const bank = getSavollarBySlug(slug)
      if (bank.length === 0) {
        return NextResponse.json({ error: "Savol banki bo'sh" }, { status: 400 })
      }

      const oldinElonQilingan = Boolean(imtihon.isAnnounced)
      const natija = await kalibrlaVaElonQil({
        db: prisma,
        imtihon,
        aslSavollar: bank,
      })

      if (natija.urinishlarSoni === 0) {
        return NextResponse.json(
          { error: "Hozircha ushbu imtihonni haqiqiy ishtirokchilar topshirmagan." },
          { status: 400 }
        )
      }

      // Ishtirokchilarga sayt + Telegram bildirishnomasi (birinchi e'lon paytida)
      let xabarYuborilganSoni = 0
      if (!oldinElonQilingan || body?.xabarYuborish === true) {
        const xabarlar = (natija.kalibrlash.yangilanganUrinishlar || [])
          .filter((item) => Boolean(item.userId))
          .map((item) =>
            xabarYubor(item.userId, {
              turi: 'sertifikat',
              sarlavha: `📢 "${imtihon.sarlavha}" natijalari e'lon qilindi!`,
              matn: `Rasch: ${item.rasch.shkalaBalli} ball (${item.rasch.daraja}) | Oddiy: ${item.oddiy.oddiyFoiz}% (${item.oddiy.rawScore}/${item.oddiy.jamiSavollar}). Ikki tizim taqqoslamasini ko'ring.`,
              havola: `/milliy-sertifikat/${slug}`,
              adminId: session.user.id,
            })
          )
        const javoblar = await Promise.allSettled(xabarlar)
        xabarYuborilganSoni = javoblar.filter((r) => r.status === 'fulfilled' && r.value).length
      }

      // Telegram ulangan ishtirokchilarga tayyor sertifikat PDF faylini yuborish
      const pdfCertIdlar =
        !oldinElonQilingan || body?.xabarYuborish === true
          ? natija.barchaCertIdlar || []
          : natija.yangiCertIdlar || []
      let telegramPdfSoni = 0
      if (pdfCertIdlar.length > 0) {
        const sertifikatYozuvlari = await prisma.certificate.findMany({
          where: { certId: { in: pdfCertIdlar } },
        })
        const pdfNatija = await foydalanuvchilargaSertifikatPdfYubor(sertifikatYozuvlari)
        telegramPdfSoni = pdfNatija.yuborildi
      }

      await auditYoz(
        request,
        session.user.id,
        'ms_natija_elon',
        slug,
        `${imtihon.sarlavha}: ${natija.urinishlarSoni} ta ishtirokchi kalibrlandi (${natija.kalibrlash.kalibrlashUsuli}), ${natija.yaratilganSertifikatlar} ta sertifikat, ${xabarYuborilganSoni} ta xabar, ${telegramPdfSoni} ta Telegram PDF`
      )

      return NextResponse.json({
        success: true,
        message: `Natijalar hammaga bir vaqtda e'lon qilindi! (${natija.urinishlarSoni} ta ishtirokchi, usul: ${natija.kalibrlash.kalibrlashUsuli}, ${natija.yaratilganSertifikatlar} ta yangi sertifikat, ${xabarYuborilganSoni} ta bildirishnoma, ${telegramPdfSoni} ta Telegram PDF).`,
        imtihon: natija.imtihon,
        urinishlarSoni: natija.urinishlarSoni,
        yaratilganSertifikatlar: natija.yaratilganSertifikatlar,
        xabarYuborilganSoni,
        telegramPdfSoni,
        kalibrlashStats: natija.kalibrlash.kalibrlashStats,
      })
    }

    // 3. Natijalar e'lonini vaqtincha yopish (yashirish)
    if (action === 'unpublish_results') {
      const slug = (body?.slug || '').trim()
      const imtihon = await prisma.msImtihon.update({
        where: { slug },
        data: { isAnnounced: false },
      })

      await auditYoz(
        request,
        session.user.id,
        'ms_natija_yashirildi',
        slug,
        `${imtihon.sarlavha} umumiy natijalar e'loni vaqtincha yashirildi`
      )

      return NextResponse.json({
        success: true,
        message: 'Natijalar yashirildi (umumiy e\'lon bekor qilindi).',
        imtihon,
      })
    }

    return NextResponse.json({ error: "Noma'lum amal" }, { status: 400 })
  } catch (err) {
    console.error('[Admin MS POST]', err)
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 })
  }
}
