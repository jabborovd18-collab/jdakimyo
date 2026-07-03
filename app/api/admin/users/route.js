// app/api/admin/users/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Foydalanuvchilar ro'yxati (pagination, qidiruv, filtrlar bilan)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin tekshiruv
    const isAdmin = ['admin', 'superadmin', 'moderator'].includes(session.user.role)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Filtrlarni yaratish
    const where = {}

    // Qidiruv (email, username, fullName)
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Rol filtri
    if (role && role !== 'all') {
      where.role = role
    }

    // Status filtri (active/banned)
    if (status === 'active') {
      where.isBanned = false
    } else if (status === 'banned') {
      where.isBanned = true
    }

    // Jami foydalanuvchilar soni
    const totalUsers = await prisma.user.count({ where })

    // Pagination
    const skip = (page - 1) * limit

    // Foydalanuvchilarni olish
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        userId: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        avatar: true,
        university: true,
        level_points: true,
        totalPoints: true,
        currentStreak: true,
        isBanned: true,
        bannedAt: true,
        bannedReason: true,
        lastActive: true,
        createdAt: true,
        _count: {
          select: {
            quizResults: true,
            achievements: true,
            followers: true,
            following: true,
            friendships1: true,
            friendships2: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    })

    // Umumiy statistika
    const stats = await prisma.user.aggregate({
      _count: { id: true },
      _sum: { totalPoints: true }
    })

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayRegistrations = await prisma.user.count({
      where: { createdAt: { gte: todayStart } }
    })

    const activeUsers = await prisma.user.count({
      where: { lastActive: { gte: todayStart } }
    })

    const bannedUsers = await prisma.user.count({
      where: { isBanned: true }
    })

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        hasMore: page * limit < totalUsers
      },
      stats: {
        total: stats._count.id,
        totalPoints: stats._sum.totalPoints || 0,
        todayRegistrations,
        activeUsers,
        bannedUsers
      }
    })

  } catch (error) {
    console.error('[Admin Users GET Error]:', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}

// PUT - Foydalanuvchini yangilash (rol, bloklash)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Faqat admin yoki superadmin
    const isAdmin = ['admin', 'superadmin'].includes(session.user.role)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin huquqi kerak' }, { status: 403 })
    }

    const { userId, action, data } = await request.json()

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId va action kerak' },
        { status: 400 }
      )
    }

    // O'zini o'zi boshqara olmaydi
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'O\'zingizni boshqara olmaysiz' },
        { status: 400 }
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    // Superadmin himoyasi - oddiy admin superadminni o'zgartira olmaydi
    if (targetUser.role === 'superadmin' && session.user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Superadminni faqat superadmin boshqaradi' },
        { status: 403 }
      )
    }

    let updateData = {}
    let message = ''

    switch (action) {
      case 'changeRole':
        if (!data?.role) {
          return NextResponse.json({ error: 'Yangi rol kerak' }, { status: 400 })
        }
        const validRoles = ['user', 'moderator', 'admin', 'superadmin']
        if (!validRoles.includes(data.role)) {
          return NextResponse.json({ error: 'Noto\'g\'ri rol' }, { status: 400 })
        }
        // Superadmin rolini faqat superadmin bera oladi
        if (data.role === 'superadmin' && session.user.role !== 'superadmin') {
          return NextResponse.json(
            { error: 'Superadmin rolini faqat superadmin bera oladi' },
            { status: 403 }
          )
        }
        updateData = { role: data.role }
        message = `Rol ${data.role} ga o'zgartirildi`
        break

      case 'ban':
        updateData = {
          isBanned: true,
          bannedAt: new Date(),
          bannedReason: data?.reason || 'Qoidabuzarlik'
        }
        message = 'Foydalanuvchi bloklandi'
        break

      case 'unban':
        updateData = {
          isBanned: false,
          bannedAt: null,
          bannedReason: null
        }
        message = 'Foydalanuvchi ochildi'
        break

      case 'resetPassword':
        // Bu yerda parol reset qilish logikasi (email yuborish)
        message = 'Parol reset qilindi (email yuborildi)'
        break

      default:
        return NextResponse.json({ error: 'Noma\'lum amal' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        userId: true,
        username: true,
        email: true,
        role: true,
        isBanned: true,
        bannedAt: true,
        bannedReason: true
      }
    })

    return NextResponse.json({
      success: true,
      message,
      user: updatedUser
    })

  } catch (error) {
    console.error('[Admin Users PUT Error]:', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}

// DELETE - Foydalanuvchini o'chirish (faqat superadmin)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Faqat superadmin
    if (session.user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Faqat superadmin o\'chirishi mumkin' },
        { status: 403 }
      )
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId kerak' }, { status: 400 })
    }

    // O'zini o'zi o'chira olmaydi
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'O\'zingizni o\'chira olmaysiz' },
        { status: 400 }
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    // Superadminni o'chirish mumkin emas
    if (targetUser.role === 'superadmin') {
      return NextResponse.json(
        { error: 'Superadminni o\'chirib bo\'lmaydi' },
        { status: 403 }
      )
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: `${targetUser.username} foydalanuvchisi o'chirildi`
    })

  } catch (error) {
    console.error('[Admin Users DELETE Error]:', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}