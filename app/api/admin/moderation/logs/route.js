// app/api/admin/moderation/logs/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// GET - Audit loglarni olish
export async function GET(request) {
  try {
    const { isSuperAdmin, user: adminUser } = await checkAdminAuth()
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: 'Faqat SuperAdmin ko\'ra oladi' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const action = searchParams.get('action') || ''
    const adminId = searchParams.get('adminId') || ''
    const targetType = searchParams.get('targetType') || ''
    const search = searchParams.get('search') || ''
    const dateFrom = searchParams.get('dateFrom') || ''
    const dateTo = searchParams.get('dateTo') || ''

    const where = {}

    // Amal filtri
    if (action && action !== 'all') {
      where.action = { contains: action, mode: 'insensitive' }
    }

    // Admin filtri
    if (adminId && adminId !== 'all') {
      where.adminId = adminId
    }

    // Target type filtri
    if (targetType && targetType !== 'all') {
      where.targetType = targetType
    }

    // Qidiruv (details yoki admin nomi bo'yicha)
    if (search) {
      where.OR = [
        { details: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } },
        { admin: { username: { contains: search, mode: 'insensitive' } } },
        { admin: { fullName: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Sana oralig'i
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) {
        const endDate = new Date(dateTo)
        endDate.setHours(23, 59, 59, 999)
        where.createdAt.lte = endDate
      }
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          admin: {
            select: { 
              id: true,
              username: true, 
              fullName: true, 
              avatar: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.auditLog.count({ where })
    ])

    // Statistika
    const [totalLogs, todayLogs, uniqueAdmins, actionStats] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      }),
      prisma.auditLog.groupBy({
        by: ['adminId'],
        _count: true
      }),
      prisma.auditLog.groupBy({
        by: ['action'],
        _count: true,
        orderBy: { _count: { action: 'desc' } },
        take: 10
      })
    ])

    // Adminlar ro'yxati (filter uchun)
    const admins = await prisma.user.findMany({
      where: {
        role: { in: ['admin', 'superadmin', 'moderator'] }
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatar: true,
        role: true
      },
      orderBy: { username: 'asc' }
    })

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        totalLogs,
        todayLogs,
        uniqueAdmins: uniqueAdmins.length,
        topActions: actionStats
      },
      admins
    })
  } catch (error) {
    console.error('[AuditLog GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Eski loglarni tozalash (faqat SuperAdmin)
export async function DELETE(request) {
  try {
    const { isSuperAdmin, user: adminUser } = await checkAdminAuth()
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: 'Faqat SuperAdmin o\'chira oladi' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const daysOld = parseInt(searchParams.get('daysOld') || '90')

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    })

    // O'chirish haqida log yozish
    await prisma.auditLog.create({
      data: {
        adminId: adminUser.id,
        action: 'cleanup_logs',
        targetType: 'system',
        details: `${result.count} ta eski log o'chirildi (${daysOld} kundan eski)`
      }
    })

    return NextResponse.json({
      success: true,
      message: `✓ ${result.count} ta eski log o'chirildi`,
      deleted: result.count
    })
  } catch (error) {
    console.error('[AuditLog DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}