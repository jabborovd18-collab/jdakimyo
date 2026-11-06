// app/api/milliy-sertifikat/yakunlash/route.js
//
// Brauzer faqat tokenni va tanlangan javoblarni yuboradi. Mantiq
// lib/milliy-sertifikat-yakunlash.js da.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ochSessiya } from '@/lib/milliy-sertifikat-sessiya'
import { yakunlaSinov } from '@/lib/milliy-sertifikat-yakunlash'

export async function POST(request) {
  try {
    const sir = process.env.NEXTAUTH_SECRET
    const body = await request.json().catch(() => null)
    const sessiya = ochSessiya(body?.token, sir)
    if (!sessiya) {
      return NextResponse.json({ error: 'Sinov sessiyasi yaroqsiz' }, { status: 400 })
    }

    const javoblar =
      body.javoblar && typeof body.javoblar === 'object' && !Array.isArray(body.javoblar)
        ? body.javoblar
        : {}

    const authSessiya = await getServerSession(authOptions)
    const natija = await yakunlaSinov({
      db: prisma,
      sessiya,
      javoblar,
      userId: authSessiya?.user?.id || null,
      toliqIsm: authSessiya?.user?.name || 'Ishtirokchi',
      sir,
    })

    return NextResponse.json(natija.body, { status: natija.status })
  } catch (err) {
    console.error('[Milliy Sertifikat Yakunlash]', err)
    return NextResponse.json({ error: 'Natijani hisoblab bo\'lmadi' }, { status: 500 })
  }
}
