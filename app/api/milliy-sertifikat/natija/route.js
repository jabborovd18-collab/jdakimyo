// app/api/milliy-sertifikat/natija/route.js
//
// Belgilangan imtihonning hozirgi holatini va foydalanuvchi natijasini beradi.
// QAT'IY QOIDA: isAnnounced === false bo'lsa hech qanday ball, kalit yoki
// to'g'ri javoblar chiqarilmaydi — faqat "qabul qilindi, e'lon kutilmoqda".
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { jadvalHolatiAniqlash } from '@/lib/milliy-sertifikat-kohort'
import { qurPublishedNatija } from '@/lib/milliy-sertifikat-yakunlash'
import { isSuperAdmin } from '@/lib/roles'
import { getSavollarBySlug } from '@/data/milliy-sertifikat/savollar-ombromi'

export const dynamic = 'force-dynamic'

function xavfsizImtihonInfo(imtihon, holatInfo) {
  if (!imtihon) {
    return {
      holat: holatInfo.holat,
      rejim: 'jadval',
      isAnnounced: false,
      xabar: holatInfo.xabar,
    }
  }
  return {
    id: imtihon.id,
    slug: imtihon.slug,
    sarlavha: imtihon.sarlavha,
    tavsif: imtihon.tavsif,
    startsAt: imtihon.startsAt ? new Date(imtihon.startsAt).toISOString() : null,
    endsAt: imtihon.endsAt ? new Date(imtihon.endsAt).toISOString() : null,
    vaqtMin: imtihon.vaqtMin,
    rejim: imtihon.rejim,
    faol: imtihon.faol,
    isAnnounced: Boolean(imtihon.isAnnounced),
    publishedAt: imtihon.publishedAt ? new Date(imtihon.publishedAt).toISOString() : null,
    holat: holatInfo.holat,
    qolganSoniya: holatInfo.qolganSoniya ?? null,
    xabar: holatInfo.xabar,
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = (searchParams.get('slug') || '').trim()
    if (!slug) {
      return NextResponse.json({ error: 'Slug kiritilmadi' }, { status: 400 })
    }

    const aslSavollar = getSavollarBySlug(slug)
    if (aslSavollar.length === 0) {
      return NextResponse.json({ error: 'Bu sinov topilmadi' }, { status: 404 })
    }

    const imtihon = await prisma.msImtihon.findUnique({ where: { slug } }).catch(() => null)
    const holatInfo = jadvalHolatiAniqlash(imtihon)
    const info = xavfsizImtihonInfo(imtihon, holatInfo)
    const serverVaqt = new Date().toISOString()

    const authSessiya = await getServerSession(authOptions)
    const userId = authSessiya?.user?.id || null
    const superadminmi = isSuperAdmin(authSessiya?.user?.role)

    if (superadminmi) {
      return NextResponse.json({
        holat: 'superadmin_sinov',
        superadminRejimi: true,
        imtihon: info,
        serverVaqt,
      })
    }

    if (!userId) {
      return NextResponse.json({
        holat: 'kirilmagan',
        kirilmagan: true,
        imtihon: info,
        serverVaqt,
      })
    }

    const urinish = await prisma.msUrinish.findFirst({
      where: {
        userId,
        OR: [imtihon ? { imtihonId: imtihon.id } : undefined, { slug }].filter(Boolean),
      },
      include: { javoblar: true },
      orderBy: { yakunlanganVaqt: 'desc' },
    })

    if (!urinish) {
      return NextResponse.json({
        holat: 'topshirilmagan',
        imtihon: info,
        serverVaqt,
      })
    }

    // E'LON QILINMAGUNChA NATIJALAR QAT'IY YASHIRIN
    if (imtihon?.rejim === 'jadval' && !imtihon?.isAnnounced) {
      return NextResponse.json({
        holat: 'kutilmoqda_elon',
        imtihon: info,
        qabulQilindi: {
          urinishId: urinish.id,
          slug: urinish.slug,
          sarlavha: imtihon.sarlavha,
          topshirilganVaqt: new Date(urinish.yakunlanganVaqt).toISOString(),
          javobBerilganSoni: urinish.javoblar.filter((j) => j.javobBerildi).length,
          jamiSavollar: urinish.jamiSavollar,
          sarflanganVaqt: urinish.sarflanganVaqt,
          kechikkan: urinish.kechikkan,
          endsAt: imtihon.endsAt ? new Date(imtihon.endsAt).toISOString() : null,
        },
        serverVaqt,
      })
    }

    const cert = urinish.certId
      ? await prisma.certificate.findUnique({ where: { certId: urinish.certId } })
      : null

    const natija = qurPublishedNatija({
      urinish,
      imtihon,
      aslSavollar,
      user: authSessiya.user,
      cert,
    })

    return NextResponse.json({
      holat: 'elon_qilindi',
      imtihon: info,
      natija,
      savollar: natija.savollar,
      serverVaqt,
    })
  } catch (err) {
    console.error('[Milliy Sertifikat Natija]', err)
    return NextResponse.json({ error: "Natijani tekshirib bo'lmadi" }, { status: 500 })
  }
}
