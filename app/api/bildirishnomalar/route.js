// app/api/bildirishnomalar/route.js
//
// GET  — bildirishnomalar ro'yxati va sonlar.
// POST — o'qilgan deb belgilash.
//
// `?sanoq=1` bilan chaqirilsa faqat sonlar qaytadi: menyudagi qizil
// nuqtalar shu yengil so'rov bilan yangilanadi, butun ro'yxatni tortmaydi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { royxatniOl, sanoqniOl, oqilganDebBelgila } from '@/lib/bildirishnoma'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sanoq = await sanoqniOl(session.user.id)

    if (searchParams.get('sanoq')) {
      return NextResponse.json({ success: true, sanoq })
    }

    const royxat = await royxatniOl(session.user.id, {
      chegara: searchParams.get('chegara') || 30,
      faqatOqilmagan: searchParams.get('oqilmagan') === '1',
    })

    return NextResponse.json({ success: true, royxat, sanoq })
  } catch (error) {
    console.error('[Bildirishnomalar GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    // `idlar` bo'lmasa — hammasi o'qilgan deb belgilanadi
    const { idlar } = await request.json().catch(() => ({}))
    const soni = await oqilganDebBelgila(session.user.id, idlar || null)
    const sanoq = await sanoqniOl(session.user.id)

    return NextResponse.json({ success: true, soni, sanoq })
  } catch (error) {
    console.error('[Bildirishnomalar POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
