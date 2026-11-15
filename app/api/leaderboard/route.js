// app/api/leaderboard/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const LEADER_SELECT = {
  id: true,
  userId: true,
  username: true,
  fullName: true,
  avatar: true,
  isVerified: true,
  university: true,
  weeklyStars: true,
  stars: true,
  totalPoints: true,
  totalMissions: true,
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const tur = searchParams.get('tur') || 'stars'

    const orderField =
      tur === 'weekly'
        ? 'weeklyStars'
        : tur === 'points'
        ? 'totalPoints'
        : 'stars'

    const session = await getServerSession(authOptions)
    const viewerId = session?.user?.id || null

    const [leaders, myUser] = await Promise.all([
      prisma.user.findMany({
        where: {
          isBanned: false,
          [orderField]: { gt: 0 },
        },
        orderBy: [{ [orderField]: 'desc' }, { totalPoints: 'desc' }],
        take: 20,
        select: LEADER_SELECT,
      }),
      viewerId
        ? prisma.user.findUnique({
            where: { id: viewerId },
            select: LEADER_SELECT,
          })
        : Promise.resolve(null),
    ])

    let myRank = null
    if (myUser) {
      const myVal = myUser[orderField] || 0
      const aheadCount = await prisma.user.count({
        where: {
          isBanned: false,
          id: { not: myUser.id },
          OR: [
            { [orderField]: { gt: myVal } },
            ...(orderField !== 'totalPoints'
              ? [
                  {
                    [orderField]: myVal,
                    totalPoints: { gt: myUser.totalPoints || 0 },
                  },
                ]
              : []),
          ],
        },
      })
      myRank = {
        rank: aheadCount + 1,
        ...myUser,
      }
    }

    return NextResponse.json({
      success: true,
      tur,
      leaders,
      myRank,
    })
  } catch (error) {
    console.error('[Leaderboard Error]:', error)
    return NextResponse.json(
      { error: 'Reytingni yuklashda xatolik' },
      { status: 500 }
    )
  }
}
