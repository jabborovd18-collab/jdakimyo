// app/api/admin/moderation/banned/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// GET - Bloklangan foydalanuvchilar
export async function GET() {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const bannedUsers = await prisma.user.findMany({
      where: { isBanned: true },
      select: {
        id: true,
        userId: true,
        username: true,
        fullName: true,
        email: true,
        avatar: true,
        role: true,
        bannedAt: true,
        bannedReason: true,
        createdAt: true,
        _count: {
          select: {
            quizResults: true,
            achievements: true,
            reportsReceived: true
          }
        }
      },
      orderBy: { bannedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      users: bannedUsers,
      total: bannedUsers.length
    })
  } catch (error) {
    console.error('[Banned GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Foydalanuvchini ochish (unban)
export async function PUT(request) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId majburiy' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isBanned: false,
        bannedAt: null,
        bannedReason: null
      }
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'unban_user',
        targetType: 'user',
        targetId: userId,
        details: `User ${user.username} unbanned`
      }
    })

    return NextResponse.json({
      success: true,
      message: `✓ ${user.username} ochildi`
    })
  } catch (error) {
    console.error('[Banned PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}