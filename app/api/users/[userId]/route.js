// app/api/users/[userId]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    // ⚠️ MUHIM: params ni await qilish kerak (Next.js 15+)
    const { userId } = await params
    
    console.log('[Public Profile] Requested userId:', userId)

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID ko\'rsatilmagan' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)

    // Foydalanuvchini topish
    const user = await prisma.user.findUnique({
      where: { userId },
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
        }
      }
    })

    if (!user) {
      console.log('[Public Profile] User not found:', userId)
      return NextResponse.json(
        { error: 'Foydalanuvchi topilmadi' },
        { status: 404 }
      )
    }

    // Do'stlar ro'yxati
    const friends = [
      ...user.friendships1.map(f => ({
        id: f.user2.id,
        userId: f.user2.userId,
        username: f.user2.username,
        fullName: f.user2.fullName,
        avatar: f.user2.avatar,
        university: f.user2.university
      })),
      ...user.friendships2.map(f => ({
        id: f.user1.id,
        userId: f.user1.userId,
        username: f.user1.username,
        fullName: f.user1.fullName,
        avatar: f.user1.avatar,
        university: f.user1.university
      }))
    ]

    // Do'stlik holatini aniqlash
    let friendshipStatus = 'none'
    let requestId = null

    if (session && session.user.id !== user.id) {
      // Do'stmi?
      const friendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { user1Id: session.user.id, user2Id: user.id },
            { user1Id: user.id, user2Id: session.user.id }
          ]
        }
      })

      if (friendship) {
        friendshipStatus = 'friend'
      } else {
        // Yuborilgan taklif bormi?
        const sentRequest = await prisma.friendRequest.findFirst({
          where: {
            senderId: session.user.id,
            receiverId: user.id,
            status: 'pending'
          }
        })

        if (sentRequest) {
          friendshipStatus = 'sent'
          requestId = sentRequest.id
        } else {
          // Qabul qilinadigan taklif bormi?
          const receivedRequest = await prisma.friendRequest.findFirst({
            where: {
              senderId: user.id,
              receiverId: session.user.id,
              status: 'pending'
            }
          })

          if (receivedRequest) {
            friendshipStatus = 'received'
            requestId = receivedRequest.id
          }
        }
      }
    }

    console.log('[Public Profile] Success:', {
      username: user.username,
      friendshipStatus,
      friendsCount: friends.length
    })

    return NextResponse.json({
      user: {
        id: user.id,
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        university: user.university,
        faculty: user.faculty,
        specialty: user.specialty,
        level_points: user.level_points,
        totalPoints: user.totalPoints,
        createdAt: user.createdAt,
      },
      friends,
      quizResults: user.quizResults,
      certificates: user.certificates,
      achievements: user.achievements,
      friendshipStatus,
      requestId
    })

  } catch (error) {
    console.error('[Public Profile] Error:', error)
    return NextResponse.json(
      { error: 'Profilni yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}