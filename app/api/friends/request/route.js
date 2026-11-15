// app/api/friends/request/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { completeMission } from '@/lib/missions' // 🆕 Import
import { xabarYubor } from '@/lib/bildirishnoma'
import { dostTaklifQarori } from '@/lib/profil-tekshiruv'

// ─── GET: menga kelgan, javob kutayotgan do'stlik takliflari ───
//
// /api/profil faqat takliflar SONINI qaytaradi, ro'yxatni emas — shu sababli
// components/FriendRequests.jsx ni to'ldiradigan manba yo'q edi va taklifni
// qabul qilishning yagona yo'li yuboruvchining profiliga kirish bo'lgan.
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requests = await prisma.friendRequest.findMany({
      where: { receiverId: session.user.id, status: 'pending' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        message: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            userId: true,
            username: true,
            fullName: true,
            isVerified: true,
            avatar: true,
            university: true,
          },
        },
      },
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('[Friends GET]', error)
    return NextResponse.json(
      { error: 'Takliflarni yuklashda xatolik' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const receiverId = typeof body?.receiverId === 'string' ? body.receiverId.trim() : ''
    const cleanMessage = typeof body?.message === 'string' ? body.message.trim().slice(0, 300) || null : null

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

    // Foydalanuvchi mavjudligini va bloklanmaganligini tekshirish
    const [receiver, blok] = await Promise.all([
      prisma.user.findUnique({
        where: { id: receiverId },
        select: { id: true, isBanned: true }
      }),
      prisma.userBlock.findFirst({
        where: {
          OR: [
            { blockerId: session.user.id, blockedId: receiverId },
            { blockerId: receiverId, blockedId: session.user.id }
          ]
        },
        select: { id: true }
      })
    ])

    if (!receiver || receiver.isBanned || blok) {
      return NextResponse.json(
        { error: 'Foydalanuvchi topilmadi' },
        { status: 404 }
      )
    }

    // Allaqachon do'stmi?
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

    // Allaqachon taklif yuborilganmi? (qarama-qarshi pending va eski rejected yozuvlarni hisobga olish)
    const [reversePending, samePair] = await Promise.all([
      prisma.friendRequest.findFirst({
        where: { senderId: receiverId, receiverId: session.user.id, status: 'pending' },
        select: { id: true }
      }),
      prisma.friendRequest.findUnique({
        where: {
          senderId_receiverId: { senderId: session.user.id, receiverId }
        },
        select: { id: true, status: true }
      })
    ])

    const qaror = dostTaklifQarori(samePair)
    if (reversePending || qaror.amal === 'kutilmoqda') {
      return NextResponse.json(
        { error: 'Taklif allaqachon yuborilgan' },
        { status: 400 }
      )
    }

    const senderInclude = {
      sender: {
        select: {
          id: true,
          userId: true,
          username: true,
          fullName: true,
          isVerified: true,
          avatar: true
        }
      }
    }

    const friendRequest = qaror.amal === 'yangila'
      ? await prisma.friendRequest.update({
          where: { id: qaror.id },
          data: { status: 'pending', message: cleanMessage, createdAt: new Date() },
          include: senderInclude
        })
      : await prisma.friendRequest.create({
          data: {
            senderId: session.user.id,
            receiverId,
            message: cleanMessage
          },
          include: senderInclude
        })

    // Qabul qiluvchi taklif kelganini bilsin: kabinetdagi qizil belgi
    // aynan shu yozuvdan chiqadi
    await xabarYubor(receiverId, {
      turi: 'dost',
      sarlavha: `👥 ${friendRequest.sender.fullName || friendRequest.sender.username} do'stlik taklifi yubordi`,
      matn: cleanMessage,
      havola: '/profil/dostlar',
    })

    // 🆕 MISSIYANI AVTOMATIK BAJARISH
    const missionResult = await completeMission(session.user.id, 'friend')
    
    if (missionResult.success) {
      console.log(`[Friend] Mission completed for user ${session.user.id}:`, missionResult.message)
    }

    return NextResponse.json({ 
      success: true, 
      request: friendRequest,
      missionResult // 🆕 Missiya natijasini qaytarish
    })

  } catch (error) {
    console.error('Friend request error:', error)
    return NextResponse.json(
      { error: 'Taklif yuborishda xatolik' },
      { status: 500 }
    )
  }
}