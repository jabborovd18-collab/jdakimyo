// app/api/laboratoriya/route.js
//
// Foydalanuvchining laboratoriyasi: inventar va balans.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { labHolati } from '@/lib/laboratoriya'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const holat = await labHolati(session.user.id)
    return NextResponse.json({ success: true, ...holat })
  } catch (error) {
    console.error('[Laboratoriya GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
