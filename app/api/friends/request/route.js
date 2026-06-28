// app/api/friends/request/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { receiverId, message } = await request.json()

    if (!receiverId) {
      return NextResponse.json(
        { error: 'Receiver ID kerak' },
        { status: 400 }
      )
    }

    // O'ziga o'zi taklif yubora olmaydi
    if (receiverId === session.user.id) {
      return NextResponse.json(
        { error: 'O\'zingizga taklif yubora olmaysiz' },
        { status: 400 }
      )
    }

    // Foydalanuvchi mavjudligini tekshirish
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver) {
      return NextResponse.json(
        { error: 'Foydalanuvchi topilmadi' },
        { status: 404 }
      )
    }

    // Allaқachon do'stmi?
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, user2Id: receiverId },
          { user1Id: receiverId, user2Id: session.user.id }
        ]
      }
    })

    if (existingFriendship) {
      return NextResponse.json(
        { error: 'Allaqachon do\'stsiz' },
        { status: 400 }
      )
    }

    // Allaқachon taklif yuborilganmi?
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, receiverId, status: 'pending' },
          { senderId: receiverId, receiverId: session.user.id, status: 'pending' }
        ]
      }
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Taklif allaqachon yuborilgan' },
        { status: 400 }
      )
    }

    // Yangi taklif yaratish
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: session.user.id,
        receiverId,
        message: message || null
      },
      include: {
        sender: {
          select: {
            id: true,
            userId: true,
            username: true,
            fullName: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      request: friendRequest 
    })

  } catch (error) {
    console.error('Friend request error:', error)
    return NextResponse.json(
      { error: 'Taklif yuborishda xatolik' },
      { status: 500 }
    )
  }
}