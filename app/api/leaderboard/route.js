// app/api/leaderboard/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Haftalik yulduzlar bo'yicha top 10 foydalanuvchi
    const leaders = await prisma.user.findMany({
      where: {
        weeklyStars: { gt: 0 }
      },
      orderBy: {
        weeklyStars: 'desc'
      },
      take: 10,
      select: {
        id: true,
        userId: true,
        username: true,
        fullName: true,
        avatar: true,
        weeklyStars: true,
        stars: true,
        totalMissions: true
      }
    })

    return NextResponse.json({
      success: true,
      leaders
    })
  } catch (error) {
    console.error('[Leaderboard Error]:', error)
    return NextResponse.json(
      { error: 'Reytingni yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}