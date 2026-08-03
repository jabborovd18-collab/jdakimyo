// app/api/admin/achievements/award/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// POST - Foydalanuvchiga yutuq berish
export async function POST(request) {
  try {
    const { isAdmin } = await checkAdminAuth('gamifikatsiya')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { userId, achievementKey } = await request.json()

    if (!userId || !achievementKey) {
      return NextResponse.json(
        { error: 'userId va achievementKey majburiy' },
        { status: 400 }
      )
    }

    // Foydalanuvchini topish
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    // Yutuqni topish
    const achievement = await prisma.achievementDefinition.findUnique({
      where: { key: achievementKey }
    })
    if (!achievement) {
      return NextResponse.json({ error: 'Yutuq topilmadi' }, { status: 404 })
    }

    // Allaqachon olganmi?
    const existing = await prisma.achievement.findFirst({
      where: {
        userId,
        achievementKey
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Bu foydalanuvchi allaqachon bu yutuqni olgan' },
        { status: 400 }
      )
    }

    // Yutuqni berish
    const newAchievement = await prisma.achievement.create({
      data: {
        userId,
        achievementKey: achievement.key,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        rarity: achievement.rarity
      }
    })

    // XP mukofotini qo'shish
    if (achievement.xpReward > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          experience: { increment: achievement.xpReward },
          totalPoints: { increment: achievement.xpReward }
        }
      })
    }

    return NextResponse.json({
      success: true,
      achievement: newAchievement,
      message: `✓ ${user.fullName || user.username} ga "${achievement.name}" yutug'i berildi`
    })
  } catch (error) {
    console.error('[Award Achievement]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}