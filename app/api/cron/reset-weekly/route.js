import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await prisma.user.updateMany({ data: { weeklyStars: 0 } })
    return NextResponse.json({ success: true, message: `${result.count} ta foydalanuvchining haftalik yulduzlari reset qilindi` })
  } catch (error) {
    console.error('[Cron Reset Weekly Error]:', error)
    return NextResponse.json({ error: 'Haftalik yulduzlarni reset qilishda xatolik' }, { status: 500 })
  }
}
