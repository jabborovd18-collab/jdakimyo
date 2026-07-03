// app/api/missions/complete/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { missionId, actionType } = await request.json()

    if (!missionId) {
      return NextResponse.json(
        { error: 'Mission ID kerak' },
        { status: 400 }
      )
    }

    // Missiya mavjudligini tekshirish
    const mission = await prisma.mission.findUnique({
      where: { id: missionId }
    })

    if (!mission) {
      return NextResponse.json(
        { error: 'Missiya topilmadi' },
        { status: 404 }
      )
    }

    // Bugungi missiyami?
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const missionDate = new Date(mission.date)
    missionDate.setHours(0, 0, 0, 0)

    if (missionDate.getTime() !== today.getTime()) {
      return NextResponse.json(
        { error: 'Bu missiya bugungi emas' },
        { status: 400 }
      )
    }

    // Allaqachon bajarilganmi?
    const existingCompletion = await prisma.missionCompletion.findUnique({
      where: {
        userId_missionId: {
          userId: session.user.id,
          missionId: missionId
        }
      }
    })

    if (existingCompletion) {
      return NextResponse.json(
        { error: 'Bu missiya allaqachon bajarilgan' },
        { status: 400 }
      )
    }

    // Action type'ni tekshirish (ixtiyoriy - keyinroq qo'shish mumkin)
    // Masalan: actionType === 'quiz' bo'lsa, haqiqatan ham quiz yechilganini tekshirish

    // Missiyani bajarish
    const completion = await prisma.missionCompletion.create({
      data: {
        userId: session.user.id,
        missionId: missionId
      },
      include: {
        mission: true
      }
    })

    // Foydalanuvchiga XP qo'shish
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        experience: { increment: mission.xpReward },
        totalMissions: { increment: 1 }
      }
    })

    // Bugungi bajarilgan missiyalar sonini tekshirish
    const todayCompletions = await prisma.missionCompletion.count({
      where: {
        userId: session.user.id,
        mission: {
          date: today
        }
      }
    })

    // Agar 3 ta missiya bajarilsa, avtomatik ⭐ berish
    let starEarned = false
    if (todayCompletions === 3) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          stars: { increment: 1 },
          weeklyStars: { increment: 1 },
          monthlyStars: { increment: 1 }
        }
      })
      starEarned = true
    }

    return NextResponse.json({
      success: true,
      message: `✓ Missiya bajarildi! +${mission.xpReward} XP`,
      completion: {
        id: completion.id,
        missionId: completion.missionId,
        missionTitle: completion.mission.title,
        xpEarned: mission.xpReward,
        completedAt: completion.completedAt
      },
      starEarned,
      stats: {
        todayCompleted: todayCompletions,
        canClaimStars: todayCompletions === 3
      }
    })

  } catch (error) {
    console.error('[Mission Complete Error]:', error)
    return NextResponse.json(
      { error: 'Missiyani bajarishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}