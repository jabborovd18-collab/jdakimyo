// app/api/oyinlar/kalloid-kimyo-amaliy/statistika/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Prisma } from '@prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  STAT_COOKIE_NOMI,
  ensureKalloidDars,
  kirishKodiniTekshir,
  prismaXatosiniIzohla,
  statTokenTekshir,
  statTokenYarat,
  statistikaRoyxatiniTuz,
  ustozRuxsatiniTekshir,
} from '@/lib/oyinlar/kalloid-amaliy-server'

export const dynamic = 'force-dynamic'

async function statistikaOlish(dars) {
  const ishtirokchilar = await prisma.ochiqDarsIshtirokchi.findMany({
    where: { darsId: dars.id },
    select: {
      id: true,
      ism: true,
      holat: true,
      foiz: true,
      sarflanganSoniya: true,
      yakunlanganVaqt: true,
    },
  })
  return statistikaRoyxatiniTuz(dars, ishtirokchilar)
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    const ruxsat = await ustozRuxsatiniTekshir(session, prisma)
    if (!ruxsat.ok) {
      return NextResponse.json(
        { ok: false, holat: ruxsat.holat, xato: ruxsat.xato },
        { status: ruxsat.status },
      )
    }

    const dars = await ensureKalloidDars(prisma)
    const token = request.cookies.get(STAT_COOKIE_NOMI)?.value || ''
    if (!statTokenTekshir(token, ruxsat.user.id, dars)) {
      return NextResponse.json(
        {
          ok: false,
          holat: 'kod_kerak',
          darsNom: dars.nom,
          xato: 'Ochiq dars statistikasi uchun kirish kodini kiriting.',
        },
        { status: 403 },
      )
    }

    const statistika = await statistikaOlish(dars)
    return NextResponse.json({ ok: true, ...statistika })
  } catch (error) {
    console.error('[Kalloid Statistika GET]', error)
    const xato = prismaXatosiniIzohla(error)
    return NextResponse.json({ ok: false, xato: xato.xato }, { status: xato.status })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const ruxsat = await ustozRuxsatiniTekshir(session, prisma)
    if (!ruxsat.ok) {
      return NextResponse.json(
        { ok: false, holat: ruxsat.holat, xato: ruxsat.xato },
        { status: ruxsat.status },
      )
    }

    const body = await request.json().catch(() => ({}))
    const dars = await ensureKalloidDars(prisma)

    if (body?.amal === 'natijalarni_tozalash') {
      const token = request.cookies.get(STAT_COOKIE_NOMI)?.value || ''
      if (!statTokenTekshir(token, ruxsat.user.id, dars)) {
        return NextResponse.json(
          { ok: false, holat: 'kod_kerak', xato: 'Avval statistika kirish kodini tasdiqlang.' },
          { status: 403 },
        )
      }

      const ishtirokchiId = body?.ishtirokchiId ? String(body.ishtirokchiId) : 'barchasi'
      const qayer = ishtirokchiId === 'barchasi'
        ? { darsId: dars.id }
        : { id: ishtirokchiId, darsId: dars.id }

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

      const statistika = await statistikaOlish(dars)
      return NextResponse.json({ ok: true, ...statistika })
    }

    if (!kirishKodiniTekshir(body?.kirishKodi, dars.kirishKodi)) {
      return NextResponse.json(
        { ok: false, holat: 'kod_xato', xato: 'Kirish kodi noto‘g‘ri. Qaytadan tekshirib kiriting.' },
        { status: 403 },
      )
    }

    const statToken = statTokenYarat(ruxsat.user.id, dars)
    const statistika = await statistikaOlish(dars)
    const javob = NextResponse.json({ ok: true, ...statistika })
    javob.cookies.set(STAT_COOKIE_NOMI, statToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 12 * 60 * 60,
    })
    return javob
  } catch (error) {
    console.error('[Kalloid Statistika POST]', error)
    const xato = prismaXatosiniIzohla(error)
    return NextResponse.json({ ok: false, xato: xato.xato }, { status: xato.status })
  }
}

export async function DELETE() {
  const javob = NextResponse.json({ ok: true })
  javob.cookies.delete(STAT_COOKIE_NOMI)
  return javob
}
