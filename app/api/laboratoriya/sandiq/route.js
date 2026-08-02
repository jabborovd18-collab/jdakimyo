// app/api/laboratoriya/sandiq/route.js
//
// Sandiqlar ro'yxati (GET) va ochish (POST).
//
// Nima tushgani lib/sandiq.js da, server tomonda hal qilinadi. Client
// faqat natijani ko'radi — aks holda javobni brauzerda o'zgartirib
// istalgan buyumni "chiqarib olish" mumkin bo'lardi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { sandiqRoyxati, sandiqniOch } from '@/lib/sandiq'
import { LabXatosi } from '@/lib/laboratoriya'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const sandiqlar = await sandiqRoyxati(session.user.id)
    return NextResponse.json({ success: true, sandiqlar })
  } catch (error) {
    console.error('[Sandiq GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { kalit } = await request.json()
    if (!kalit) {
      return NextResponse.json({ error: 'Sandiq ko\'rsatilmagan' }, { status: 400 })
    }

    const natija = await sandiqniOch(session.user.id, kalit)

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true, gems: true },
    })

    return NextResponse.json({ success: true, ...natija, balans: user })
  } catch (error) {
    if (error instanceof LabXatosi) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (error?.code === 'P2034' || error?.code === 'P2028') {
      return NextResponse.json(
        { error: 'Baza hozir band. Bir soniyadan keyin qayta urinib ko\'ring.' },
        { status: 409 },
      )
    }
    console.error('[Sandiq POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
