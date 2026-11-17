// app/api/oyinlar/kalloid-kimyo-amaliy/qr/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  KALLOID_STANDART_TALABALAR,
  ensureKalloidDars,
  prismaXatosiniIzohla,
  qolganSoniyaHisobla,
  talabaSavollariniTayyorla,
  tasodifiySavolTanla,
  urinishniBahola,
} from '@/lib/oyinlar/kalloid-amaliy-server'

export const dynamic = 'force-dynamic'

async function qrOrqaliIshtirokchiTop(token) {
  let ishtirokchi = await prisma.ochiqDarsIshtirokchi
    .findUnique({
      where: { qrToken: token },
      include: { dars: true },
    })
    .catch(() => null)

  if (!ishtirokchi) {
    const dars = await ensureKalloidDars(prisma)
    const standart = KALLOID_STANDART_TALABALAR.find((t) => t.qrToken === token)
    if (standart) {
      await prisma.ochiqDarsIshtirokchi.createMany({
        data: [{ darsId: dars.id, ism: standart.ism, qrToken: standart.qrToken }],
        skipDuplicates: true,
      })
    }
    ishtirokchi = await prisma.ochiqDarsIshtirokchi.findUnique({
      where: { qrToken: token },
      include: { dars: true },
    })
  }
  return ishtirokchi
}

function yakuniyJavob(ishtirokchi) {
  return {
    ok: true,
    holat: 'yakunlandi',
    ism: ishtirokchi.ism,
    darsNom: ishtirokchi.dars.nom,
    foiz: typeof ishtirokchi.foiz === 'number' ? Math.round(ishtirokchi.foiz) : 0,
    sarflanganSoniya: typeof ishtirokchi.sarflanganSoniya === 'number'
      ? ishtirokchi.sarflanganSoniya
      : ishtirokchi.dars.vaqtLimitSoniya,
  }
}

async function muddatiOtganBolsaYakunla(ishtirokchi, hozir = new Date()) {
  const dars = ishtirokchi.dars
  const baho = urinishniBahola({
    savolIndekslari: ishtirokchi.savolIndekslari,
    variantTartibi: ishtirokchi.variantTartibi,
    javoblar: Array.isArray(ishtirokchi.javoblar) ? ishtirokchi.javoblar : [],
    boshlanganVaqt: ishtirokchi.boshlanganVaqt,
    hozir,
    vaqtLimitSoniya: dars.vaqtLimitSoniya,
  })

  await prisma.ochiqDarsIshtirokchi.updateMany({
    where: { id: ishtirokchi.id, holat: 'boshlandi' },
    data: {
      holat: 'yakunlandi',
      yakunlanganVaqt: hozir,
      javoblar: baho.tozalanganJavoblar,
      foiz: baho.foiz,
      sarflanganSoniya: baho.sarflanganSoniya,
    },
  })

  const yangi = await prisma.ochiqDarsIshtirokchi.findUnique({
    where: { id: ishtirokchi.id },
    include: { dars: true },
  })
  return yakuniyJavob(yangi || { ...ishtirokchi, foiz: baho.foiz, sarflanganSoniya: baho.sarflanganSoniya })
}

function boshlanganJavob(ishtirokchi, qolganSoniya) {
  return {
    ok: true,
    holat: 'boshlandi',
    ism: ishtirokchi.ism,
    darsNom: ishtirokchi.dars.nom,
    savollar: talabaSavollariniTayyorla(ishtirokchi.savolIndekslari, ishtirokchi.variantTartibi),
    qolganSoniya,
    vaqtLimitSoniya: ishtirokchi.dars.vaqtLimitSoniya,
  }
}

export async function GET(request) {
  try {
    const token = request.nextUrl.searchParams.get('token')?.trim() || ''
    if (!token) {
      return NextResponse.json(
        { ok: false, holat: 'topilmadi', xato: 'QR kod ko‘rsatilmagan.' },
        { status: 400 },
      )
    }

    const ishtirokchi = await qrOrqaliIshtirokchiTop(token)
    if (!ishtirokchi) {
      return NextResponse.json(
        { ok: false, holat: 'topilmadi', xato: 'Ushbu QR kod tizimda topilmadi.' },
        { status: 404 },
      )
    }

    if (ishtirokchi.holat === 'yakunlandi') {
      return NextResponse.json(yakuniyJavob(ishtirokchi))
    }

    if (!ishtirokchi.dars.faol) {
      return NextResponse.json(
        {
          ok: false,
          holat: 'yopiq',
          ism: ishtirokchi.ism,
          darsNom: ishtirokchi.dars.nom,
          xato: 'Ochiq dars testi hozircha faol emas.',
        },
        { status: 403 },
      )
    }

    if (ishtirokchi.holat === 'boshlandi') {
      const hozir = new Date()
      const qolganSoniya = qolganSoniyaHisobla(ishtirokchi.boshlanganVaqt, ishtirokchi.dars.vaqtLimitSoniya, hozir)
      if (qolganSoniya <= 0) {
        return NextResponse.json(await muddatiOtganBolsaYakunla(ishtirokchi, hozir))
      }
      return NextResponse.json(boshlanganJavob(ishtirokchi, qolganSoniya))
    }

    return NextResponse.json({
      ok: true,
      holat: 'kutmoqda',
      ism: ishtirokchi.ism,
      darsNom: ishtirokchi.dars.nom,
      savolSoni: ishtirokchi.dars.savolSoni,
      vaqtLimitSoniya: ishtirokchi.dars.vaqtLimitSoniya,
    })
  } catch (error) {
    console.error('[Kalloid QR GET]', error)
    const xato = prismaXatosiniIzohla(error)
    return NextResponse.json({ ok: false, xato: xato.xato }, { status: xato.status })
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const token = String(body?.token || '').trim()
    const amal = String(body?.amal || '').trim()

    if (!token || (amal !== 'boshlash' && amal !== 'topshirish')) {
      return NextResponse.json({ ok: false, xato: 'So‘rov noto‘g‘ri.' }, { status: 400 })
    }

    const ishtirokchi = await qrOrqaliIshtirokchiTop(token)
    if (!ishtirokchi) {
      return NextResponse.json(
        { ok: false, holat: 'topilmadi', xato: 'Ushbu QR kod tizimda topilmadi.' },
        { status: 404 },
      )
    }

    if (ishtirokchi.holat === 'yakunlandi') {
      return NextResponse.json(yakuniyJavob(ishtirokchi))
    }

    if (!ishtirokchi.dars.faol) {
      return NextResponse.json(
        { ok: false, holat: 'yopiq', xato: 'Ochiq dars testi hozircha faol emas.' },
        { status: 403 },
      )
    }

    const hozir = new Date()

    if (amal === 'boshlash') {
      if (ishtirokchi.holat === 'kutmoqda') {
        const { savolIndekslari, variantTartibi } = tasodifiySavolTanla(ishtirokchi.dars.savolSoni)
        await prisma.ochiqDarsIshtirokchi.updateMany({
          where: { id: ishtirokchi.id, holat: 'kutmoqda' },
          data: {
            holat: 'boshlandi',
            savolIndekslari,
            variantTartibi,
            boshlanganVaqt: hozir,
          },
        })
      }

      const yangilangan = await prisma.ochiqDarsIshtirokchi.findUnique({
        where: { id: ishtirokchi.id },
        include: { dars: true },
      })
      if (!yangilangan) {
        return NextResponse.json({ ok: false, xato: 'Ishtirokchi topilmadi.' }, { status: 404 })
      }
      if (yangilangan.holat === 'yakunlandi') {
        return NextResponse.json(yakuniyJavob(yangilangan))
      }

      const qolganSoniya = qolganSoniyaHisobla(yangilangan.boshlanganVaqt, yangilangan.dars.vaqtLimitSoniya, hozir)
      if (qolganSoniya <= 0) {
        return NextResponse.json(await muddatiOtganBolsaYakunla(yangilangan, hozir))
      }
      return NextResponse.json(boshlanganJavob(yangilangan, qolganSoniya))
    }

    // amal === 'topshirish'
    if (ishtirokchi.holat !== 'boshlandi' || !ishtirokchi.boshlanganVaqt) {
      return NextResponse.json(
        { ok: false, xato: 'Test hali boshlanmagan.' },
        { status: 400 },
      )
    }

    const baho = urinishniBahola({
      savolIndekslari: ishtirokchi.savolIndekslari,
      variantTartibi: ishtirokchi.variantTartibi,
      javoblar: body?.javoblar,
      boshlanganVaqt: ishtirokchi.boshlanganVaqt,
      hozir,
      vaqtLimitSoniya: ishtirokchi.dars.vaqtLimitSoniya,
    })

    await prisma.ochiqDarsIshtirokchi.updateMany({
      where: { id: ishtirokchi.id, holat: 'boshlandi' },
      data: {
        holat: 'yakunlandi',
        yakunlanganVaqt: hozir,
        javoblar: baho.tozalanganJavoblar,
        foiz: baho.foiz,
        sarflanganSoniya: baho.sarflanganSoniya,
      },
    })

    const yakuniy = await prisma.ochiqDarsIshtirokchi.findUnique({
      where: { id: ishtirokchi.id },
      include: { dars: true },
    })

    return NextResponse.json(
      yakuniy
        ? yakuniyJavob(yakuniy)
        : {
            ok: true,
            holat: 'yakunlandi',
            ism: ishtirokchi.ism,
            darsNom: ishtirokchi.dars.nom,
            foiz: baho.foiz,
            sarflanganSoniya: baho.sarflanganSoniya,
          },
    )
  } catch (error) {
    console.error('[Kalloid QR POST]', error)
    const xato = prismaXatosiniIzohla(error)
    return NextResponse.json({ ok: false, xato: xato.xato }, { status: xato.status })
  }
}
