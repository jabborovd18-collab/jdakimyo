// app/api/cron/reset-weekly/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    // Xavfsizlik
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Barcha foydalanuvchilarning weeklyStars'ini reset qilish
    const result = await prisma.user.updateMany({
      data: { weeklyStars: 0 }
    })

    return NextResponse.json({
      success: true,
      message: `${result.count} ta foydalanuvchining haftalik yulduzlari reset qilindi`
    })

  } catch (error) {
    console.error('[Cron Reset Weekly Error]:', error)
    return NextResponse.json(
      { error: 'Reset qilishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}