// app/api/missions/daily/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { MISSIYA_SHABLONLARI, missiyaKuni } from '@/lib/missions'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = missiyaKuni()

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
      for (const template of MISSIYA_SHABLONLARI) {
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
        totalMissions: true,
        coins: true,
        gems: true
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
        coins: user.coins,
        gems: user.gems,
        todayCompleted: completedCount,
        todayTotal: formattedMissions.length,
        // Bugungi missiyalar soniga bog'landi. Avval bu yerda qattiq `=== 3`
        // turardi, kunlik missiya esa 2 ta — shart hech qachon bajarilmasdi.
        canClaimStars:
          formattedMissions.length > 0 && completedCount === formattedMissions.length
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