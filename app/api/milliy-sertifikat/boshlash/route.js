// app/api/milliy-sertifikat/boshlash/route.js
//
// Imtihon sessiyasini ochadi yoki sahifa yangilanganda davom ettiradi.
// Barcha MS sinov testlariga kirish uchun foydalanuvchi profiliga kirgan bo'lishi shart.
// Brauzerga faqat javobsiz savollar ketadi (AGENTS.md 2-band).
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { boshlaSessiya, ommaviySavol } from '@/lib/milliy-sertifikat-boshqaruvchi'
import { imzolaSessiya, ochSessiya } from '@/lib/milliy-sertifikat-sessiya'
import { sessiyaSavollari } from '@/lib/milliy-sertifikat-aralashtirish'
import { sinovKatalogi } from '@/lib/milliy-sertifikat-katalog'
import { jadvalHolatiAniqlash } from '@/lib/milliy-sertifikat-kohort'
import { isSuperAdmin } from '@/lib/roles'
import { getSavollarBySlug } from '@/data/milliy-sertifikat/savollar-ombromi'
import { authMaxfiyKaliti } from '@/lib/auth-maxfiy-kalit'

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null)
    const slug = body?.slug
    const sir = authMaxfiyKaliti()
    const authSessiya = await getServerSession(authOptions)
    const uid = authSessiya?.user?.id || null
    const superadminmi = isSuperAdmin(authSessiya?.user?.role)
    const hozir = Date.now()

    if (!uid) {
      return NextResponse.json(
        {
          error: "MS sinov testiga kirish uchun shaxsiy profilingizga kiring.",
          loginKerak: true,
        },
        { status: 401 }
      )
    }

    const bank = getSavollarBySlug(slug)
    if (bank.length === 0) {
      return NextResponse.json({ error: 'Bu sinov hozircha ochiq emas' }, { status: 404 })
    }

    let imtihon = null
    try {
      imtihon = await prisma.msImtihon.findUnique({ where: { slug } })
    } catch (e) {
      console.error('[Milliy Sertifikat Boshlash Jadval]', e.message)
      return NextResponse.json(
        { error: "Imtihon jadvali tizimi hali sozlanmagan (migratsiya kerak)." },
        { status: 503 }
      )
    }

    const holatInfo = jadvalHolatiAniqlash(imtihon, hozir)
    if (!superadminmi && !holatInfo.ruxsatOlish) {
      return NextResponse.json(
        {
          error: holatInfo.xabar,
          holat: holatInfo.holat,
          startsAt: imtihon?.startsAt ? new Date(imtihon.startsAt).toISOString() : null,
          endsAt: imtihon?.endsAt ? new Date(imtihon.endsAt).toISOString() : null,
          qolganSoniya: holatInfo.qolganSoniya ?? null,
        },
        { status: 403 }
      )
    }

    const jadvalRejimi = !superadminmi && imtihon?.rejim === 'jadval'
    if (jadvalRejimi) {
      const mavjudUrinish = await prisma.msUrinish.findFirst({
        where: {
          userId: uid,
          OR: [{ imtihonId: imtihon.id }, { slug }],
        },
        select: { id: true },
      })

      if (mavjudUrinish) {
        return NextResponse.json(
          {
            error: "Siz bu imtihonni allaqachon topshirgansiz.",
            allaqachonTopshirilgan: true,
          },
          { status: 409 }
        )
      }
    }

    const eski = ochSessiya(body?.token, sir)
    const endsAtMs = imtihon?.endsAt ? new Date(imtihon.endsAt).getTime() : Infinity
    const davomEtadi =
      eski &&
      eski.slug === slug &&
      eski.uid === uid &&
      hozir < eski.tugash &&
      (!jadvalRejimi || hozir <= endsAtMs)

    let token = body?.token
    let tugash = eski?.tugash
    let sid = eski?.sid

    if (!davomEtadi) {
      const katalog = sinovKatalogi().map((v) =>
        v.slug === slug
          ? { ...v, vaqtMin: imtihon?.vaqtMin || v.vaqtMin, holat: 'ochiq' }
          : v
      )
      const sessiya = boshlaSessiya(
        slug,
        {
          id: uid,
          ism: authSessiya?.user?.fullName || authSessiya?.user?.username || 'Ishtirokchi',
        },
        katalog
      )
      if (!sessiya) {
        return NextResponse.json({ error: 'Bu sinov hozircha ochiq emas' }, { status: 404 })
      }
      sid = sessiya.sessiyaId
      const sessiyaTugash = sessiya.boshlanganVaqt + sessiya.vaqtSoniya * 1000
      tugash = jadvalRejimi ? Math.min(sessiyaTugash, endsAtMs) : sessiyaTugash
      token = imzolaSessiya(
        { sid, slug, uid, bosh: sessiya.boshlanganVaqt, tugash, sa: superadminmi ? 1 : 0 },
        sir
      )
    } else if (jadvalRejimi) {
      tugash = Math.min(eski.tugash, endsAtMs)
    }

    return NextResponse.json({
      token,
      qolganSoniya: Math.max(0, Math.floor((tugash - hozir) / 1000)),
      savollar: sessiyaSavollari(bank, sid, sir).map(ommaviySavol),
      rejim: imtihon?.rejim || 'jadval',
      sarlavha: imtihon?.sarlavha || null,
      endsAt: imtihon?.endsAt ? new Date(imtihon.endsAt).toISOString() : null,
      superadminRejimi: superadminmi,
    })
  } catch (err) {
    console.error('[Milliy Sertifikat Boshlash]', err)
    return NextResponse.json({ error: "Sinovni boshlab bo'lmadi" }, { status: 500 })
  }
}
