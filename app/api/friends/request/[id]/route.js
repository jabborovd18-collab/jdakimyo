// app/api/friends/request/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { xabarYubor } from '@/lib/bildirishnoma'

export async function PUT(request, { params }) {
  try {
    // ⚠️ MUHIM: params ni await qilish kerak!
    const { id } = await params
    
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const action = body?.action

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

    if (friendRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Taklif allaqachon ko\'rib chiqilgan' },
        { status: 400 }
      )
    }

    // Yuboruvchi o'zi yuborgan taklifni bekor qilishi mumkin
    if (action === 'cancel') {
      if (friendRequest.senderId !== session.user.id) {
        return NextResponse.json(
          { error: 'Ruxsat yo\'q' },
          { status: 403 }
        )
      }

      await prisma.friendRequest.delete({
        where: { id }
      })

      return NextResponse.json({
        success: true,
        message: "Do'stlik taklifi bekor qilindi"
      })
    }

    if (friendRequest.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: 'Ruxsat yo\'q' },
        { status: 403 }
      )
    }

    if (action === 'accept') {
      const blok = await prisma.userBlock.findFirst({
        where: {
          OR: [
            { blockerId: friendRequest.senderId, blockedId: session.user.id },
            { blockerId: session.user.id, blockedId: friendRequest.senderId }
          ]
        },
        select: { id: true }
      })
      if (blok) {
        return NextResponse.json(
          { error: 'Bu foydalanuvchi bilan do\'stlashib bo\'lmaydi' },
          { status: 403 }
        )
      }

      const natija = await prisma.$transaction(async (tx) => {
        const yangilangan = await tx.friendRequest.updateMany({
          where: { id, receiverId: session.user.id, status: 'pending' },
          data: { status: 'accepted' }
        })
        if (yangilangan.count === 0) return false

        const [user1Id, user2Id] = [friendRequest.senderId, friendRequest.receiverId].sort()

        await tx.friendship.upsert({
          where: { user1Id_user2Id: { user1Id, user2Id } },
          create: { user1Id, user2Id },
          update: {}
        })
        return true
      })

      if (!natija) {
        return NextResponse.json(
          { error: 'Taklif allaqachon ko\'rib chiqilgan' },
          { status: 400 }
        )
      }

      // Taklif yuborgan odam javobni ko'rsin — u kutib turgan tomon
      await xabarYubor(friendRequest.senderId, {
        turi: 'dost',
        sarlavha: `👥 ${session.user.fullName || session.user.username} do'stlik taklifingizni qabul qildi`,
        havola: '/profil/dostlar',
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
      { error: 'Taklifni qayta ishlashda xatolik' },
      { status: 500 }
    )
  }
}