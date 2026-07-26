// app/api/mobile/home/route.js
// Mobil bosh sahifa uchun barcha ma'lumot BITTA so'rovda.
// Mobil tarmoqda har bir qo'shimcha so'rov sezilarli kechikish bergani uchun
// veb versiyadagidek alohida-alohida emas, jamlab qaytariladi.
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

// CORS preflight (sarlavhalar next.config.mjs da)
export { OPTIONS } from '@/lib/cors'

export async function GET(request) {
  try {
    const auth = await getAuthUser(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = auth.id

    const [user, quizAgg, bestQuiz, leaders, recentQuizzes] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          userId: true,
          username: true,
          fullName: true,
          avatar: true,
          role: true,
          level_points: true,
          experience: true,
          totalPoints: true,
          currentStreak: true,
          longestStreak: true,
          weeklyStars: true,
          stars: true,
        },
      }),

      // O'tkazilgan testlar soni va o'rtacha natija
      prisma.quizResult.aggregate({
        where: { userId },
        _count: { id: true },
        _avg: { percentage: true },
      }),

      // Eng yaxshi natija
      prisma.quizResult.findFirst({
        where: { userId },
        orderBy: { percentage: 'desc' },
        select: { percentage: true, quizName: true, completedAt: true },
      }),

      // Global reyting (veb saytdagi /api/leaderboard bilan bir xil mezon)
      prisma.user.findMany({
        where: { weeklyStars: { gt: 0 } },
        orderBy: { weeklyStars: 'desc' },
        take: 10,
        select: {
          id: true,
          userId: true,
          username: true,
          fullName: true,
          avatar: true,
          weeklyStars: true,
        },
      }),

      prisma.quizResult.findMany({
        where: { userId },
        orderBy: { completedAt: 'desc' },
        take: 5,
        select: { id: true, quizName: true, percentage: true, completedAt: true },
      }),
    ])

    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    // Foydalanuvchining reytingdagi o'rni: undan ko'proq yulduzi borlar soni + 1
    const ahead = await prisma.user.count({
      where: { weeklyStars: { gt: user.weeklyStars } },
    })

    return NextResponse.json({
      success: true,
      user,
      quizStats: {
        total: quizAgg._count.id,
        average: quizAgg._avg.percentage !== null ? Math.round(quizAgg._avg.percentage) : 0,
        best: bestQuiz ? Math.round(bestQuiz.percentage) : 0,
        bestQuizName: bestQuiz?.quizName ?? null,
      },
      leaderboard: {
        top: leaders.map((leader, index) => ({
          rank: index + 1,
          userId: leader.userId,
          username: leader.username,
          fullName: leader.fullName,
          avatar: leader.avatar,
          weeklyStars: leader.weeklyStars,
          isMe: leader.id === userId,
        })),
        myRank: user.weeklyStars > 0 ? ahead + 1 : null,
        myWeeklyStars: user.weeklyStars,
      },
      recentQuizzes,
    })
  } catch (error) {
    console.error('[Mobile home]', error)
    return NextResponse.json(
      { error: 'Ma\'lumotlarni yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}
