// app/api/users/search/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] })
    }

    // Foydalanuvchilarni qidirish (username, fullName, email bo'yicha)
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: session.user.id } }, // O'zini chiqarib tashlash
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { fullName: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
              { userId: { contains: query } }
            ]
          }
        ]
      },
      select: {
        id: true,
        userId: true,
        username: true,
        fullName: true,
        avatar: true,
        university: true,
        role: true,
        bio: true,
        // Do'stlik holatini tekshirish
        friendships1: {
          where: { user2Id: session.user.id },
          select: { id: true }
        },
        friendships2: {
          where: { user1Id: session.user.id },
          select: { id: true }
        },
        receivedRequests: {
          where: { 
            senderId: session.user.id,
            status: 'pending'
          },
          select: { id: true }
        },
        sentRequests: {
          where: { 
            receiverId: session.user.id,
            status: 'pending'
          },
          select: { id: true }
        }
      },
      take: 20 // Limit
    })

    // Har bir foydalanuvchi uchun do'stlik holatini aniqlash
    const usersWithStatus = users.map(user => {
      let status = 'none' // none, friend, sent, received
      
      if (user.friendships1.length > 0 || user.friendships2.length > 0) {
        status = 'friend'
      } else if (user.receivedRequests.length > 0) {
        status = 'sent' // Siz yuborgansiz
      } else if (user.sentRequests.length > 0) {
        status = 'received' // Sizga yuborilgan
      }

      return {
        id: user.id,
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        university: user.university,
        role: user.role,
        bio: user.bio,
        status
      }
    })

    return NextResponse.json({ users: usersWithStatus })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Qidiruvda xatolik' },
      { status: 500 }
    )
  }
}