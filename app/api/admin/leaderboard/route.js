// app/api/admin/leaderboard/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// GET - Leaderboard ma'lumotlari
export async function GET(request) {
  try {
    const { isAdmin } = await checkAdminAuth('gamifikatsiya')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'xp' // xp, streak, stars, achievements, quizzes
    const period = searchParams.get('period') || 'all' // all, weekly, monthly
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''

    // Qidiruv sharti
    const searchWhere = search ? {
      OR: [
        { username: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {}

    // Vaqt oralig'i (streak va yulduzlar uchun)
    const periodWhere = {}
    if (period === 'weekly') {
      // Haftalik yulduzlar uchun alohida maydon bor
    } else if (period === 'monthly') {
      // Oylik yulduzlar uchun alohida maydon bor
    }

    let users = []
    let total = 0

    // Kategoriya bo'yicha saralash
    switch (category) {
      case 'xp':
        // XP bo'yicha reyting
        [users, total] = await Promise.all([
          prisma.user.findMany({
            where: searchWhere,
            select: {
              id: true,
              userId: true,
              username: true,
              fullName: true,
              email: true,
              avatar: true,
              role: true,
              totalPoints: true,
              level_points: true,
              experience: true,
              currentStreak: true,
              longestStreak: true,
              stars: true,
              weeklyStars: true,
              monthlyStars: true,
              createdAt: true,
              _count: {
                select: {
                  quizResults: true,
                  achievements: true,
                  followers: true
                }
              }
            },
            orderBy: { totalPoints: 'desc' },
            skip: (page - 1) * limit,
            take: limit
          }),
          prisma.user.count({ where: searchWhere })
        ])
        break

      case 'streak':
        // Streak bo'yicha reyting
        [users, total] = await Promise.all([
          prisma.user.findMany({
            where: searchWhere,
            select: {
              id: true,
              userId: true,
              username: true,
              fullName: true,
              email: true,
              avatar: true,
              role: true,
              totalPoints: true,
              level_points: true,
              currentStreak: true,
              longestStreak: true,
              lastActive: true,
              _count: {
                select: {
                  quizResults: true,
                  achievements: true
                }
              }
            },
            orderBy: { currentStreak: 'desc' },
            skip: (page - 1) * limit,
            take: limit
          }),
          prisma.user.count({ where: searchWhere })
        ])
        break

      case 'stars':
        // Yulduzlar bo'yicha reyting
        case 'stars': {
  const starsField = period === 'weekly' ? 'weeklyStars' : 
                    period === 'monthly' ? 'monthlyStars' : 'stars'
  
  const [starsUsers, starsTotal] = await Promise.all([
    prisma.user.findMany({
      where: searchWhere,
      select: {
        id: true, userId: true, username: true, fullName: true,
        email: true, avatar: true, role: true, totalPoints: true,
        stars: true, weeklyStars: true, monthlyStars: true,
        _count: { select: { achievements: true } }
      },
      orderBy: { [starsField]: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.user.count({ where: searchWhere })
  ])
  
  users = starsUsers
  total = starsTotal
  break
}

      case 'achievements':
        // Yutuqlar soni bo'yicha reyting
        [users, total] = await Promise.all([
          prisma.user.findMany({
            where: searchWhere,
            select: {
              id: true,
              userId: true,
              username: true,
              fullName: true,
              email: true,
              avatar: true,
              role: true,
              totalPoints: true,
              _count: {
                select: {
                  achievements: true,
                  quizResults: true
                }
              }
            },
            orderBy: {
              achievements: { _count: 'desc' }
            },
            skip: (page - 1) * limit,
            take: limit
          }),
          prisma.user.count({ where: searchWhere })
        ])
        break

      case 'quizzes':
        // Quiz yechganlar soni bo'yicha
        [users, total] = await Promise.all([
          prisma.user.findMany({
            where: searchWhere,
            select: {
              id: true,
              userId: true,
              username: true,
              fullName: true,
              email: true,
              avatar: true,
              role: true,
              totalPoints: true,
              _count: {
                select: {
                  quizResults: true,
                  achievements: true
                }
              }
            },
            orderBy: {
              quizResults: { _count: 'desc' }
            },
            skip: (page - 1) * limit,
            take: limit
          }),
          prisma.user.count({ where: searchWhere })
        ])
        break

      default:
        return NextResponse.json({ error: 'Noto\'g\'ri kategoriya' }, { status: 400 })
    }

    // Umumiy statistika
    const [totalUsers, avgXP, maxStreak, totalAchievements] = await Promise.all([
      prisma.user.count(),
      prisma.user.aggregate({ _avg: { totalPoints: true } }),
      prisma.user.aggregate({ _max: { currentStreak: true } }),
      prisma.achievement.count()
    ])

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        totalUsers,
        avgXP: Math.round(avgXP._avg.totalPoints || 0),
        maxStreak: maxStreak._max.currentStreak || 0,
        totalAchievements
      }
    })
  } catch (error) {
    console.error('[Admin Leaderboard GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}