// app/api/profil/export/route.js
// "Ma'lumotlarimni yuklab olish" (GDPR-uslubidagi to'liq eksport). Faqat foydalanuvchi
// o'zi so'raganda chaqiriladi (sozlamalar sahifasi) — shuning uchun bu yerda to'liq,
// hajmi katta so'rovga yo'l qo'yiladi; asosiy dashboard bu yo'ldan foydalanmaydi.
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        quizResults: { orderBy: { completedAt: 'desc' } },
        certificates: { orderBy: { issuedAt: 'desc' } },
        achievements: { orderBy: { earnedAt: 'desc' } },
        friendships1: { select: { createdAt: true, user2: { select: SAFE_USER_SELECT } } },
        friendships2: { select: { createdAt: true, user1: { select: SAFE_USER_SELECT } } },
        followers: { select: { createdAt: true, follower: { select: SAFE_USER_SELECT } } },
        following: { select: { createdAt: true, following: { select: SAFE_USER_SELECT } } }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const friends = [
      ...user.friendships1.map(f => ({ ...f.user2, since: f.createdAt })),
      ...user.friendships2.map(f => ({ ...f.user1, since: f.createdAt }))
    ]
    const followers = user.followers.map(f => ({ ...f.follower, since: f.createdAt }))
    const following = user.following.map(f => ({ ...f.following, since: f.createdAt }))

    const {
      password,
      friendships1, friendships2,
      followers: _rawFollowers, following: _rawFollowing,
      quizResults: _rawQuizResults, certificates: _rawCertificates, achievements: _rawAchievements,
      ...userFields
    } = user

    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      user: userFields,
      quizResults: user.quizResults,
      certificates: user.certificates,
      achievements: user.achievements,
      friends,
      followers,
      following
    })
  } catch (error) {
    console.error('Profile export error:', error)
    return NextResponse.json(
      { error: "Ma'lumotlarni eksport qilishda xatolik: " + error.message },
      { status: 500 }
    )
  }
}
