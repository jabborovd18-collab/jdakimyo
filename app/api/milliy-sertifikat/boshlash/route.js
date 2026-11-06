// app/api/milliy-sertifikat/boshlash/route.js
//
// Imtihon sessiyasini ochadi yoki sahifa yangilanganda davom ettiradi.
// Brauzerga faqat javobsiz savollar ketadi (AGENTS.md 2-band).
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { boshlaSessiya, ommaviySavol } from '@/lib/milliy-sertifikat-boshqaruvchi'
import { imzolaSessiya, ochSessiya } from '@/lib/milliy-sertifikat-sessiya'
import { sessiyaSavollari } from '@/lib/milliy-sertifikat-aralashtirish'
import { getSavollarBySlug } from '@/data/milliy-sertifikat/savollar-ombromi'

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null)
    const slug = body?.slug
    const sir = process.env.NEXTAUTH_SECRET
    const authSessiya = await getServerSession(authOptions)
    const uid = authSessiya?.user?.id || null
    const hozir = Date.now()

    // Bank bo'sh bo'lsa eski token bilan ham ochilmaydi: bo'sh sinovni boshlab bo'lmaydi
    const bank = getSavollarBySlug(slug)
    if (bank.length === 0) {
      return NextResponse.json({ error: 'Bu sinov hozircha ochiq emas' }, { status: 404 })
    }

    const eski = ochSessiya(body?.token, sir)
    const davomEtadi =
      eski && eski.slug === slug && eski.uid === uid && hozir < eski.tugash

    let token = body?.token
    let tugash = eski?.tugash
    let sid = eski?.sid

    if (!davomEtadi) {
      const sessiya = boshlaSessiya(slug, { id: uid })
      if (!sessiya) {
        return NextResponse.json({ error: 'Bu sinov hozircha ochiq emas' }, { status: 404 })
      }
      sid = sessiya.sessiyaId
      tugash = sessiya.boshlanganVaqt + sessiya.vaqtSoniya * 1000
      token = imzolaSessiya({ sid, slug, uid, bosh: sessiya.boshlanganVaqt, tugash }, sir)
    }

    return NextResponse.json({
      token,
      qolganSoniya: Math.max(0, Math.floor((tugash - hozir) / 1000)),
      savollar: sessiyaSavollari(bank, sid, sir).map(ommaviySavol),
    })
  } catch (err) {
    console.error('[Milliy Sertifikat Boshlash]', err)
    return NextResponse.json({ error: 'Sinovni boshlab bo\'lmadi' }, { status: 500 })
  }
}
