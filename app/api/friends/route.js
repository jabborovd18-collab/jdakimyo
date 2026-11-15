// app/api/friends/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// DELETE — Do'stlikdan chiqarish (unfriend) yoki yuborilgan do'stlik taklifini bekor qilish (cancel)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const url = new URL(request.url)
    const rawTargetId = body?.friendId || body?.userId || url.searchParams.get('friendId') || ''
    const targetId = typeof rawTargetId === 'string' ? rawTargetId.trim() : ''
    const action = typeof body?.action === 'string' ? body.action.trim() : 'unfriend'

    if (!targetId) {
      return NextResponse.json(
        { error: 'Foydalanuvchi ID ko\'rsatilmagan' },
        { status: 400 }
      )
    }

    if (targetId === session.user.id) {
      return NextResponse.json(
        { error: 'Noto\'g\'ri so\'rov' },
        { status: 400 }
      )
    }

    if (action === 'cancel') {
      const deletedReq = await prisma.friendRequest.deleteMany({
        where: {
          senderId: session.user.id,
          receiverId: targetId,
          status: 'pending',
        },
      })

      if (deletedReq.count === 0) {
        return NextResponse.json(
          { error: 'Kutilayotgan taklif topilmadi' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Do'stlik taklifi bekor qilindi",
      })
    }

    // Do'stlikdan chiqarish (unfriend)
    const deletedCount = await prisma.$transaction(async (tx) => {
      const removed = await tx.friendship.deleteMany({
        where: {
          OR: [
            { user1Id: session.user.id, user2Id: targetId },
            { user1Id: targetId, user2Id: session.user.id },
          ],
        },
      })

      await tx.friendRequest.deleteMany({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: targetId },
            { senderId: targetId, receiverId: session.user.id },
          ],
        },
      })

      return removed.count
    })

    if (deletedCount === 0) {
      return NextResponse.json(
        { error: "Do'stlik bog'lanishi topilmadi" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Do'stlar ro'yxatidan chiqarildi",
    })
  } catch (error) {
    console.error('[Friends DELETE Error]:', error)
    return NextResponse.json(
      { error: "Amalni bajarishda xatolik yuz berdi" },
      { status: 500 }
    )
  }
}
