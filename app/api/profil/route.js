// app/api/profil/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Profil ma'lumotlarini olish
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        quizResults: {
          orderBy: { completedAt: 'desc' },
          take: 10
        },
        certificates: {
          orderBy: { issuedAt: 'desc' }
        },
        achievements: {
          orderBy: { earnedAt: 'desc' }
        },
        friendships1: {
          include: { user2: true }
        },
        friendships2: {
          include: { user1: true }
        },
        receivedRequests: {
          where: { status: 'pending' },
          include: { sender: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Do'stlar ro'yxatini tayyorlash
    const friends = [
      ...user.friendships1.map(f => ({
        id: f.user2.id,
        userId: f.user2.userId,
        username: f.user2.username,
        fullName: f.user2.fullName,
        avatar: f.user2.avatar,
        university: f.user2.university,
        role: f.user2.role
      })),
      ...user.friendships2.map(f => ({
        id: f.user1.id,
        userId: f.user1.userId,
        username: f.user1.username,
        fullName: f.user1.fullName,
        avatar: f.user1.avatar,
        university: f.user1.university,
        role: f.user1.role
      }))
    ]

    return NextResponse.json({
      user: {
        id: user.id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        university: user.university,
        faculty: user.faculty,
        specialty: user.specialty,
        level: user.level,
        telegram: user.telegram,
        instagram: user.instagram,
        linkedin: user.linkedin,
        location: user.location,
        level_points: user.level_points,
        experience: user.experience,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastActive: user.lastActive,
        createdAt: user.createdAt,
      },
      friends,
      friendRequests: user.receivedRequests,
      quizResults: user.quizResults,
      certificates: user.certificates,
      achievements: user.achievements
    })

  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { error: 'Profilni yuklashda xatolik' },
      { status: 500 }
    )
  }
}

// PUT - Profilni yangilash
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName: body.fullName,
        bio: body.bio,
        university: body.university,
        faculty: body.faculty,
        specialty: body.specialty,
        level: body.level ? parseInt(body.level) : null,
        telegram: body.telegram,
        instagram: body.instagram,
        linkedin: body.linkedin,
        location: body.location,
      }
    })

    return NextResponse.json({ success: true, user })

  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json(
      { error: 'Profilni yangilashda xatolik' },
      { status: 500 }
    )
  }
}