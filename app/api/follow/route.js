// app/api/follow/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// POST - Obuna bo'lish (Follow)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { followingId } = await request.json()

    if (!followingId) {
      return NextResponse.json(
        { error: 'followingId kerak' },
        { status: 400 }
      )
    }

    // O'ziga o'zi obuna bo'la olmaydi
    if (followingId === session.user.id) {
      return NextResponse.json(
        { error: 'O\'zingizga obuna bo\'la olmaysiz' },
        { status: 400 }
      )
    }

    // Foydalanuvchi mavjudligini tekshirish
    const targetUser = await prisma.user.findUnique({
      where: { id: followingId }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Foydalanuvchi topilmadi' },
        { status: 404 }
      )
    }

    // Allaqachon obuna bo'lganmi?
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: followingId
        }
      }
    })

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Allaqachon obuna bo\'lgansiz' },
        { status: 400 }
      )
    }

    // Yangi obuna yaratish
    const follow = await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: followingId
      },
      include: {
        following: {
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
      message: 'Obuna bo\'ldingiz!',
      follow 
    })

  } catch (error) {
    console.error('[Follow POST Error]:', error)
    return NextResponse.json(
      { error: 'Obuna bo\'lishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}

// DELETE - Obunani bekor qilish (Unfollow)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { followingId } = await request.json()

    if (!followingId) {
      return NextResponse.json(
        { error: 'followingId kerak' },
        { status: 400 }
      )
    }

    // Obunani topish va o'chirish
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: followingId
        }
      }
    })

    if (!follow) {
      return NextResponse.json(
        { error: 'Obuna topilmadi' },
        { status: 404 }
      )
    }

    await prisma.follow.delete({
      where: { id: follow.id }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Obuna bekor qilindi'
    })

  } catch (error) {
    console.error('[Follow DELETE Error]:', error)
    return NextResponse.json(
      { error: 'Obunani bekor qilishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}