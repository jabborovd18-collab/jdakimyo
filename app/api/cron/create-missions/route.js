import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const MISSION_TEMPLATES = [
  { type: 'quiz', title: 'Quiz yeching', description: "Har qanday quizni yechib, bilimingizni sinab ko'ring", xpReward: 10, icon: '📝', difficulty: 'easy' },
  { type: 'video', title: "Video dars ko'ring", description: "Kamida bitta video darsni to'liq ko'ring", xpReward: 15, icon: '🎬', difficulty: 'medium' },
  { type: 'friend', title: "Do'st qo'shing", description: "Yangi do'st qo'shing yoki do'stlik taklifini yuboring", xpReward: 20, icon: '👥', difficulty: 'hard' }
]

export async function GET(request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const result = await prisma.mission.createMany({
      data: MISSION_TEMPLATES.map((mission) => ({ ...mission, date: today })),
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
