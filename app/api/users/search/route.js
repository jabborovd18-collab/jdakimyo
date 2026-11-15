// app/api/users/search/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { korinadimi, tozala } from '@/lib/maxfiylik'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = (searchParams.get('q') || '').trim()

    if (query.length < 2 || query.length > 100) {
      return NextResponse.json({ users: [] })
    }

    // Ikki tomonlama bloklangan foydalanuvchilar qidiruvda ham ko'rinmaydi
    const bloklar = await prisma.userBlock.findMany({
      where: {
        OR: [
          { blockerId: session.user.id },
          { blockedId: session.user.id }
        ]
      },
      select: { blockerId: true, blockedId: true }
    })
    const istisnoIdlar = Array.from(
      new Set([
        session.user.id,
        ...bloklar.map((b) => (b.blockerId === session.user.id ? b.blockedId : b.blockerId))
      ])
    )

    // Qisman email qidiruvi manzilni taxmin qilishga yo'l ochmasligi uchun email faqat to'liq moslikda
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { notIn: istisnoIdlar } },
          { isBanned: false },
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { fullName: { contains: query, mode: 'insensitive' } },
              { email: { equals: query, mode: 'insensitive' } },
              { userId: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: {
        id: true,
        userId: true,
        username: true,
        fullName: true,
        isVerified: true,
        avatar: true,
        university: true,
        role: true,
        bio: true,
        privacySettings: true,
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

      // Taklifni qabul qilish uchun uning id'si kerak: qabul qilish yangi
      // taklif yuborish emas, mavjudini PUT bilan tasdiqlash.
      let requestId = null

      if (user.friendships1.length > 0 || user.friendships2.length > 0) {
        status = 'friend'
      } else if (user.receivedRequests.length > 0) {
        status = 'sent' // Siz yuborgansiz
      } else if (user.sentRequests.length > 0) {
        status = 'received' // Sizga yuborilgan
        requestId = user.sentRequests[0].id
      }

      const dostmi = status === 'friend'
      const maxfiylik = tozala(user.privacySettings)
      const profilOchiq = korinadimi(maxfiylik, 'profil', { ozimniki: false, dost: dostmi })

      return {
        id: user.id,
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        isVerified: user.isVerified,
        avatar: user.avatar,
        university: user.university,
        role: user.role,
        bio: profilOchiq ? user.bio : null,
        status,
        requestId
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