// app/api/missions/daily/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// Bugungi sanani YYYY-MM-DD formatida olish
function getTodayDate() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

// Missiya shablonlari (har kuni shu 3 ta missiya yaratiladi)
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = getTodayDate()

    // Bugungi missiyalar mavjudmi?
    let missions = await prisma.mission.findMany({
      where: { date: today },
      include: {
        completions: {
          where: { userId: session.user.id },
          select: { id: true, completedAt: true }
        }
      }
    })

    // Agar mavjud bo'lmasa, yaratish
    if (missions.length === 0) {
      for (const template of MISSION_TEMPLATES) {
        await prisma.mission.create({
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
      }

      // Qayta olish
      missions = await prisma.mission.findMany({
        where: { date: today },
        include: {
          completions: {
            where: { userId: session.user.id },
            select: { id: true, completedAt: true }
          }
        }
      })
    }

    // Foydalanuvchining bugungi statistikasi
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        stars: true,
        weeklyStars: true,
        monthlyStars: true,
        totalMissions: true
      }
    })

    // Missiyalarni formatlash
    const formattedMissions = missions.map(mission => ({
      id: mission.id,
      type: mission.type,
      title: mission.title,
      description: mission.description,
      xpReward: mission.xpReward,
      icon: mission.icon,
      difficulty: mission.difficulty,
      completed: mission.completions.length > 0,
      completedAt: mission.completions[0]?.completedAt || null
    }))

    // Bajarilgan missiyalar soni
    const completedCount = formattedMissions.filter(m => m.completed).length

    return NextResponse.json({
      missions: formattedMissions,
      stats: {
        stars: user.stars,
        weeklyStars: user.weeklyStars,
        monthlyStars: user.monthlyStars,
        totalMissions: user.totalMissions,
        todayCompleted: completedCount,
        todayTotal: formattedMissions.length,
        canClaimStars: completedCount === 3 // 3 ta bajarilsa, ⭐ olish mumkin
      }
    })

  } catch (error) {
    console.error('[Missions Daily Error]:', error)
    return NextResponse.json(
      { error: 'Missiyalarni yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}