// app/api/admin/moderation/reports/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// GET - Barcha reportlarni olish
export async function GET(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where = {}
    if (status && status !== 'all') where.status = status
    if (priority && priority !== 'all') where.priority = priority
    if (category && category !== 'all') where.category = category

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reporter: {
            select: { id: true, username: true, fullName: true, avatar: true }
          },
          target: {
            select: { 
              id: true, userId: true, username: true, fullName: true, 
              avatar: true, email: true, isBanned: true, role: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.report.count({ where })
    ])

    // Statistika
    const [pending, urgent, todayReports, resolved] = await Promise.all([
      prisma.report.count({ where: { status: 'pending' } }),
      prisma.report.count({ where: { priority: 'urgent' } }),
      prisma.report.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      }),
      prisma.report.count({ where: { status: 'resolved' } })
    ])

    return NextResponse.json({
      success: true,
      reports,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: { pending, urgent, todayReports, resolved, total }
    })
  } catch (error) {
    console.error('[Reports GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Reportni ko'rib chiqish (resolve/dismiss)
export async function PUT(request) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { reportId, action, resolution } = await request.json()

    if (!reportId || !action) {
      return NextResponse.json({ error: 'reportId va action majburiy' }, { status: 400 })
    }

    const report = await prisma.report.findUnique({ where: { id: reportId } })
    if (!report) {
      return NextResponse.json({ error: 'Report topilmadi' }, { status: 404 })
    }

    const newStatus = action === 'resolve' ? 'resolved' : 
                      action === 'dismiss' ? 'dismissed' : 'reviewed'

    const updated = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: newStatus,
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        resolution: resolution || null
      }
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: `${action}_report`,
        targetType: 'report',
        targetId: reportId,
        details: `Report #${reportId} ${action}ed. Target: ${report.targetId}`
      }
    })

    return NextResponse.json({
      success: true,
      report: updated,
      message: `✓ Report ${action} qilindi`
    })
  } catch (error) {
    console.error('[Reports PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}