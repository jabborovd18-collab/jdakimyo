// app/api/ustoz/ochiq-dars/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import QRCode from 'qrcode'
import { Prisma } from '@prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  KALLOID_DARS_SLUG,
  ensureKalloidDars,
  kirishKodiniNormallashtir,
  prismaXatosiniIzohla,
  qrTokenYarat,
  talabalarRoyxatiniAjrat,
  ustozRuxsatiniTekshir,
} from '@/lib/oyinlar/kalloid-amaliy-server'

export const dynamic = 'force-dynamic'

function asosiyOriginTop(request) {
  const fwdHost = request.headers.get('x-forwarded-host') || request.headers.get('host')
  if (fwdHost && !fwdHost.includes('undefined')) {
    const cleanHost = fwdHost.split(',')[0].trim()
    const fwdProto = request.headers.get('x-forwarded-proto')?.split(',')[0].trim()
      || (cleanHost.startsWith('localhost') || cleanHost.startsWith('127.0.0.1') ? 'http' : 'https')
    return `${fwdProto}://${cleanHost}`.replace(/\/$/, '')
  }
  const envUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || ''
  return String(envUrl || 'https://www.jdakimyo.uz').replace(/\/$/, '')
}

async function toliqJavobTuz(dars, origin) {
  const ishtirokchilar = await prisma.ochiqDarsIshtirokchi.findMany({
    where: { darsId: dars.id },
    orderBy: [{ createdAt: 'asc' }, { ism: 'asc' }],
  })

  const qrBilan = await Promise.all(
    ishtirokchilar.map(async (item) => {
      const qrHavola = `${origin}/oyinlar/${KALLOID_DARS_SLUG}/qr/${item.qrToken}`
      const qrDataUrl = await QRCode.toDataURL(qrHavola, {
        width: 320,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#0b101d',
          light: '#ffffff',
        },
      })
      return {
        id: item.id,
        ism: item.ism,
        qrToken: item.qrToken,
        qrHavola,
        qrDataUrl,
        holat: item.holat,
        foiz: typeof item.foiz === 'number' ? Math.round(item.foiz) : null,
        sarflanganSoniya: item.sarflanganSoniya ?? null,
        boshlanganVaqt: item.boshlanganVaqt,
        yakunlanganVaqt: item.yakunlanganVaqt,
      }
    }),
  )

  return {
    ok: true,
    dars: {
      id: dars.id,
      slug: dars.slug,
      nom: dars.nom,
      kirishKodi: dars.kirishKodi,
      vaqtLimitSoniya: dars.vaqtLimitSoniya,
      savolSoni: dars.savolSoni,
      faol: dars.faol,
    },
    ishtirokchilar: qrBilan,
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    const ruxsat = await ustozRuxsatiniTekshir(session, prisma)
    if (!ruxsat.ok) {
      return NextResponse.json({ ok: false, xato: ruxsat.xato }, { status: ruxsat.status })
    }

    const dars = await ensureKalloidDars(prisma)
    return NextResponse.json(await toliqJavobTuz(dars, asosiyOriginTop(request)))
  } catch (error) {
    console.error('[Ustoz OchiqDars GET]', error)
    const xato = prismaXatosiniIzohla(error)
    return NextResponse.json({ ok: false, xato: xato.xato }, { status: xato.status })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const ruxsat = await ustozRuxsatiniTekshir(session, prisma)
    if (!ruxsat.ok) {
      return NextResponse.json({ ok: false, xato: ruxsat.xato }, { status: ruxsat.status })
    }

    const body = await request.json().catch(() => ({}))
    const amal = String(body?.amal || '').trim()
    let dars = await ensureKalloidDars(prisma)

    if (amal === 'sozlash') {
      const yangiKod = kirishKodiniNormallashtir(body?.kirishKodi)
      if (!yangiKod || yangiKod.length < 3) {
        return NextResponse.json(
          { ok: false, xato: 'Kirish kodi kamida 3 ta belgidan iborat bo‘lishi kerak.' },
          { status: 400 },
        )
      }
      const faol = typeof body?.faol === 'boolean' ? body.faol : dars.faol
      dars = await prisma.ochiqDars.update({
        where: { id: dars.id },
        data: { kirishKodi: yangiKod, faol },
      })
    } else if (amal === 'qoshish') {
      const ismlar = talabalarRoyxatiniAjrat(body?.royxatMatni)
      if (ismlar.length === 0) {
        return NextResponse.json(
          { ok: false, xato: 'Kamida bitta o‘quvchi ismini kiriting.' },
          { status: 400 },
        )
      }

      const mavjud = await prisma.ochiqDarsIshtirokchi.findMany({
        where: { darsId: dars.id },
        select: { ism: true },
      })
      const mavjudSet = new Set(mavjud.map((x) => x.ism.toLocaleLowerCase('uz')))
      const yangiIsmlar = ismlar.filter((ism) => !mavjudSet.has(ism.toLocaleLowerCase('uz')))

      if (yangiIsmlar.length > 0) {
        await prisma.ochiqDarsIshtirokchi.createMany({
          data: yangiIsmlar.map((ism) => ({
            darsId: dars.id,
            ism,
            qrToken: qrTokenYarat(),
          })),
          skipDuplicates: true,
        })
      }
    } else if (amal === 'qayta_boshlash') {
      const ishtirokchiId = body?.ishtirokchiId ? String(body.ishtirokchiId) : null
      const qayer = ishtirokchiId === 'barchasi'
        ? { darsId: dars.id }
        : { id: ishtirokchiId, darsId: dars.id }
      if (!ishtirokchiId) {
        return NextResponse.json({ ok: false, xato: 'Ishtirokchi tanlanmadi.' }, { status: 400 })
      }

      await prisma.ochiqDarsIshtirokchi.updateMany({
        where: qayer,
        data: {
          holat: 'kutmoqda',
          savolIndekslari: Prisma.DbNull,
          variantTartibi: Prisma.DbNull,
          javoblar: Prisma.DbNull,
          boshlanganVaqt: null,
          yakunlanganVaqt: null,
          foiz: null,
          sarflanganSoniya: null,
        },
      })
    } else if (amal === 'ochirish') {
      const ishtirokchiId = String(body?.ishtirokchiId || '')
      if (!ishtirokchiId) {
        return NextResponse.json({ ok: false, xato: 'Ishtirokchi tanlanmadi.' }, { status: 400 })
      }
      await prisma.ochiqDarsIshtirokchi.deleteMany({
        where: { id: ishtirokchiId, darsId: dars.id },
      })
    } else {
      return NextResponse.json({ ok: false, xato: 'Noma’lum amal.' }, { status: 400 })
    }

    return NextResponse.json(await toliqJavobTuz(dars, asosiyOriginTop(request)))
  } catch (error) {
    console.error('[Ustoz OchiqDars POST]', error)
    const xato = prismaXatosiniIzohla(error)
    return NextResponse.json({ ok: false, xato: xato.xato }, { status: xato.status })
  }
}
