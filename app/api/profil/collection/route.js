// app/api/profil/collection/route.js
// Profil sahifalaridagi ro'yxatlar (do'stlar, obunachilar, obunalar, sertifikat, yutuq, quiz)
// uchun sahifalangan, faqat kerakli turdagi ma'lumotni qaytaradigan endpoint.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const SAFE_USER_SELECT = {
  id: true,
  userId: true,
  username: true,
  fullName: true,
  avatar: true,
  university: true,
  role: true
}

const MAX_LIMIT = 50

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get('limit') || '20') || 20))
    const skip = (page - 1) * limit

    let items = []
    let total = 0

    switch (type) {
      case 'achievements': {
        [items, total] = await Promise.all([
          prisma.achievement.findMany({
            where: { userId },
            orderBy: { earnedAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.achievement.count({ where: { userId } })
        ])
        break
      }

      case 'certificates': {
        [items, total] = await Promise.all([
          prisma.certificate.findMany({
            where: { userId },
            orderBy: { issuedAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.certificate.count({ where: { userId } })
        ])
        break
      }

      case 'quizzes': {
        [items, total] = await Promise.all([
          prisma.quizResult.findMany({
            where: { userId },
            orderBy: { completedAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.quizResult.count({ where: { userId } })
        ])
        break
      }

      case 'friends': {
        const [asUser1, asUser2, totalUser1, totalUser2] = await Promise.all([
          prisma.friendship.findMany({
            where: { user1Id: userId },
            select: { createdAt: true, user2: { select: SAFE_USER_SELECT } },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.friendship.findMany({
            where: { user2Id: userId },
            select: { createdAt: true, user1: { select: SAFE_USER_SELECT } },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.friendship.count({ where: { user1Id: userId } }),
          prisma.friendship.count({ where: { user2Id: userId } })
        ])
        items = [
          ...asUser1.map(f => ({ ...f.user2, createdAt: f.createdAt })),
          ...asUser2.map(f => ({ ...f.user1, createdAt: f.createdAt }))
        ]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit)
        total = totalUser1 + totalUser2
        break
      }

      case 'followers': {
        [items, total] = await Promise.all([
          prisma.follow.findMany({
            where: { followingId: userId },
            select: { createdAt: true, follower: { select: SAFE_USER_SELECT } },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.follow.count({ where: { followingId: userId } })
        ])
        items = items.map(f => ({ ...f.follower, createdAt: f.createdAt }))
        break
      }

      case 'following': {
        [items, total] = await Promise.all([
          prisma.follow.findMany({
            where: { followerId: userId },
            select: { createdAt: true, following: { select: SAFE_USER_SELECT } },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.follow.count({ where: { followerId: userId } })
        ])
        items = items.map(f => ({ ...f.following, createdAt: f.createdAt }))
        break
      }

      default:
        return NextResponse.json({ error: "Noto'g'ri turdagi so'rov" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      items,
      total,
      page,
      limit,
      hasMore: skip + items.length < total
    })
  } catch (error) {
    console.error('[Profile Collection GET]', error)
    return NextResponse.json(
      { error: "Ma'lumotlarni yuklashda xatolik: " + error.message },
      { status: 500 }
    )
  }
}
