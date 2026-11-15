// app/api/repititorlar/route.js
//
// Kimyo-biologiya repititorlari interaktiv xaritasi API:
// - GET: barcha faol repititor nuqtalarini olish
// - POST: xaritadan nuqta tanlab yangi repititor qo'shish
// - PUT: superadmin tomonidan tasdiqlash / holatni o'zgartirish
// - DELETE: o'z nuqtasini yoki superadmin tomonidan o'chirish

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  repititorlarniOl,
  repititorQosh,
  repititorOchir,
  repititorHolatYangila,
} from '@/lib/repititor-baza'

async function joriyFoydalanuvchiHolati(session) {
  if (!session?.user?.id) {
    return {
      kirganmi: false,
      id: null,
      ism: '',
      username: '',
      superadmin: false,
      ustoz: false,
      tasdiqlangan: false,
    }
  }

  const u = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      userId: true,
      username: true,
      fullName: true,
      role: true,
      isTeacher: true,
      isVerified: true,
    },
  })

  if (!u) {
    return {
      kirganmi: false,
      id: null,
      ism: '',
      username: '',
      superadmin: false,
      ustoz: false,
      tasdiqlangan: false,
    }
  }

  const superadmin = u.role === 'superadmin' || String(u.userId) === '343229943'
  const ustoz = Boolean(u.isTeacher || u.role === 'teacher' || u.role === 'admin' || superadmin)

  return {
    kirganmi: true,
    id: u.id,
    userId: u.userId,
    ism: u.fullName || u.username || '',
    username: u.username || '',
    superadmin,
    ustoz,
    tasdiqlangan: Boolean(u.isVerified || superadmin || ustoz),
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    const foydalanuvchi = await joriyFoydalanuvchiHolati(session)

    const { searchParams } = new URL(request.url)
    const hudud = searchParams.get('hudud') || null
    const fan = searchParams.get('fan') || null

    const repititorlar = await repititorlarniOl({
      hudud,
      fan,
      faqatFaol: !foydalanuvchi.superadmin,
    })

    return NextResponse.json({
      repititorlar,
      foydalanuvchi,
    })
  } catch (err) {
    console.error('[GET /api/repititorlar xato]:', err)
    return NextResponse.json(
      { error: "Repititorlar ro'yxatini yuklashda xatolik yuz berdi" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const foydalanuvchi = await joriyFoydalanuvchiHolati(session)

    if (!foydalanuvchi.kirganmi || !foydalanuvchi.id) {
      return NextResponse.json(
        { error: "Xaritaga repititor qo'shish uchun avval tizimga kiring" },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Oddiy foydalanuvchi ko'pi bilan 3 ta nuqta qo'sha oladi (superadminda cheklov yo'q)
    if (!foydalanuvchi.superadmin) {
      const barcha = await repititorlarniOl({ faqatFaol: false })
      const meningSoni = barcha.filter((r) => r.userId === foydalanuvchi.id).length
      if (meningSoni >= 3) {
        return NextResponse.json(
          { error: "Siz ko'pi bilan 3 ta o'quv markazi nuqtasini qo'sha olasiz" },
          { status: 400 }
        )
      }
    }

    const yangi = await repititorQosh({
      userId: foydalanuvchi.id,
      ism: body.ism || foydalanuvchi.ism,
      fan: body.fan,
      sertifikat: body.sertifikat,
      markaz: body.markaz,
      hudud: body.hudud,
      tuman: body.tuman,
      moljal: body.moljal,
      lat: body.lat,
      lng: body.lng,
      telefon: body.telefon,
      telegram: body.telegram || foydalanuvchi.username,
      narx: body.narx,
      tavsif: body.tavsif,
      tasdiqlangan: foydalanuvchi.tasdiqlangan,
      holat: 'faol',
    })

    return NextResponse.json({
      ok: true,
      repititor: yangi,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Repititor nuqtasini saqlashda xatolik yuz berdi" },
      { status: 400 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    const foydalanuvchi = await joriyFoydalanuvchiHolati(session)

    if (!foydalanuvchi.superadmin) {
      return NextResponse.json(
        { error: 'Faqat superadmin tasdiqlash holatini o‘zgartira oladi' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const natija = await repititorHolatYangila({
      id: body.id,
      holat: body.holat || 'faol',
      tasdiqlangan: Boolean(body.tasdiqlangan),
    })

    return NextResponse.json(natija)
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Yangilashda xatolik yuz berdi" },
      { status: 400 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    const foydalanuvchi = await joriyFoydalanuvchiHolati(session)

    if (!foydalanuvchi.kirganmi) {
      return NextResponse.json({ error: 'Ruxsat berilmadi' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const natija = await repititorOchir({
      id,
      joriyUserId: foydalanuvchi.id,
      superadmin: foydalanuvchi.superadmin,
    })

    return NextResponse.json(natija)
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "O'chirishda xatolik yuz berdi" },
      { status: 400 }
    )
  }
}
