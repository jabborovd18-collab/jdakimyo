// app/api/friends/request/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function PUT(request, { params }) {
  try {
    // ⚠️ MUHIM: params ni await qilish kerak!
    const { id } = await params
    
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id },
      include: {
        sender: true,
        receiver: true
      }
    })

    if (!friendRequest) {
      return NextResponse.json(
        { error: 'Taklif topilmadi' },
        { status: 404 }
      )
    }

    if (friendRequest.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: 'Ruxsat yo\'q' },
        { status: 403 }
      )
    }

    if (friendRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Taklif allaqachon ko\'rib chiqilgan' },
        { status: 400 }
      )
    }

    if (action === 'accept') {
      await prisma.$transaction(async (tx) => {
        await tx.friendRequest.update({
          where: { id },
          data: { status: 'accepted' }
        })

        const [user1Id, user2Id] = [friendRequest.senderId, friendRequest.receiverId].sort()
        
        await tx.friendship.create({
          data: { user1Id, user2Id }
        })
      })

      return NextResponse.json({ 
        success: true, 
        message: `✓ ${friendRequest.sender.fullName || friendRequest.sender.username} bilan do'st bo'ldingiz!`
      })

    } else if (action === 'reject') {
      await prisma.friendRequest.update({
        where: { id },
        data: { status: 'rejected' }
      })

      return NextResponse.json({ 
        success: true, 
        message: 'Taklif rad etildi' 
      })

    } else {
      return NextResponse.json(
        { error: 'Noto\'g\'ri action' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('[Friend Request] Error:', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}