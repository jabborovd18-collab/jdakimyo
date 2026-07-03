// app/api/quiz/submit/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { completeMission } from '@/lib/missions'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quizName, score, totalQuestions, percentage, timeSpent } = await request.json()

    // Validatsiya
    if (!quizName || score === undefined || !totalQuestions) {
      return NextResponse.json(
        { error: 'Ma\'lumotlar to\'liq emas' },
        { status: 400 }
      )
    }

    // Quiz natijasini database'ga saqlash
    const quizResult = await prisma.quizResult.create({
      data: {
        userId: session.user.id,
        quizName,
        score,
        totalQuestions,
        percentage: percentage || Math.round((score / totalQuestions) * 100),
        timeSpent: timeSpent || 0
      }
    })

    // Foydalanuvchiga XP qo'shish (foiz bo'yicha 0-50 XP)
    const xpGained = Math.round((percentage / 100) * 50)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        experience: { increment: xpGained },
        totalPoints: { increment: xpGained }
      }
    })

    // 🎯 MISSIYANI AVTOMATIK BAJARISH
    const missionResult = await completeMission(session.user.id, 'quiz')
    
    if (missionResult.success) {
      console.log(`[Quiz] Mission completed:`, missionResult.message)
    }

    return NextResponse.json({
      success: true,
      quizResult,
      xpGained,
      missionResult
    })

  } catch (error) {
    console.error('[Quiz Submit Error]:', error)
    return NextResponse.json(
      { error: 'Quiz yuborishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}