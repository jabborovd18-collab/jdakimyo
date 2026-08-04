import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { kunlikMissiyalar, missiyaYozuvi, missiyaKuni } from '@/lib/missions'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const today = missiyaKuni()

    // Uchlik sanadan kelib chiqadi — cron va sahifa mustaqil chaqirilsa
    // ham bir xil missiyalarni beradi.
    const result = await prisma.mission.createMany({
      data: kunlikMissiyalar(today).map((shablon) => missiyaYozuvi(shablon, today)),
      skipDuplicates: true
    })

    return NextResponse.json({
      success: true,
      message: result.count ? `${result.count} ta missiya yaratildi` : 'Bugungi missiyalar allaqachon mavjud',
      count: result.count
    })
  } catch (error) {
    console.error('[Cron Create Missions Error]:', error)
    return NextResponse.json({ error: 'Missiyalar yaratishda xatolik' }, { status: 500 })
  }
}
