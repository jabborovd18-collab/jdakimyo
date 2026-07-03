// Xavfsizlik: faqat Vercel Cron chaqira oladi
// const authHeader = request.headers.get('authorization')
// if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
// }
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    // Xavfsizlik: faqat Vercel Cron chaqira oladi
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Bugungi missiyalar allaqachon mavjudmi?
    const existingMissions = await prisma.mission.findMany({
      where: { date: today }
    })

    if (existingMissions.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Bugungi missiyalar allaqachon mavjud',
        count: existingMissions.length
      })
    }

    // Missiya shablonlari
    const MISSION_TEMPLATES = [
      {
        type: 'quiz',
        title: 'Quiz yeching',
        description: 'Har qanday quizni yechib, bilimingizni sinab ko\'ring',
        xpReward: 10,
        icon: '📝',
        difficulty: 'easy'
      },
      {
        type: 'video',
        title: 'Video dars ko\'ring',
        description: 'Kamida bitta video darsni to\'liq ko\'ring',
        xpReward: 15,
        icon: '🎬',
        difficulty: 'medium'
      },
      {
        type: 'friend',
        title: 'Do\'st qo\'shing',
        description: 'Yangi do\'st qo\'shing yoki do\'stlik taklifini yuboring',
        xpReward: 20,
        icon: '👥',
        difficulty: 'hard'
      }
    ]

    // Yangi missiyalar yaratish
    const createdMissions = []
    for (const template of MISSION_TEMPLATES) {
      const mission = await prisma.mission.create({
        data: {
          date: today,
          type: template.type,
          title: template.title,
          description: template.description,
          xpReward: template.xpReward,
          icon: template.icon,
          difficulty: template.difficulty
        }
      })
      createdMissions.push(mission)
    }

    return NextResponse.json({
      success: true,
      message: `${createdMissions.length} ta missiya yaratildi`,
      missions: createdMissions
    })

  } catch (error) {
    console.error('[Cron Create Missions Error]:', error)
    return NextResponse.json(
      { error: 'Missiyalar yaratishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}