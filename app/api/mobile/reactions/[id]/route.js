// app/api/mobile/reactions/[id]/route.js
// Bitta reaksiyaning to'liq ma'lumoti — sharoit, oraliq moddalar,
// erituvchi ta'siri, tezlik omillari, texnikalar va h.k.
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export { OPTIONS } from '@/lib/cors'

export async function GET(request, { params }) {
  try {
    const auth = await getAuthUser(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const reaction = await prisma.reaction.findFirst({
      where: { id, isActive: true },
    })

    if (!reaction) {
      return NextResponse.json({ error: 'Reaksiya topilmadi' }, { status: 404 })
    }

    // Qidiruv indeksi mijozga kerak emas
    const { searchText, searchCompact, ...rest } = reaction

    return NextResponse.json({ success: true, reaction: rest })
  } catch (error) {
    console.error('[Mobile reaction detail]', error)
    return NextResponse.json(
      { error: 'Reaksiyani yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}
