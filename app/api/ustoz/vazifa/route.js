// app/api/ustoz/vazifa/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'
import { createNotification } from '@/lib/bildirishnoma'

// GET - Barcha vazifalar (filter bilan)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId') || ''
    const status = searchParams.get('status') || 'all' // all | active | expired | drafts
    const search = (searchParams.get('search') || '').trim()

    const where = { teacherId: session.user.id }

    if (groupId && groupId !== 'all') {
      where.groupId = groupId
    }

    if (status === 'active') {
      where.isDraft = false
      where.deadline = { gte: new Date() }
    } else if (status === 'expired') {
      where.isDraft = false
      where.deadline = { lt: new Date() }
    } else if (status === 'drafts') {
      where.isDraft = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        group: {
          select: {
            id: true,
            name: true,
            color: true,
            _count: { select: { students: { where: { holat: 'faol' } } } }
          }
        },
        _count: {
          select: { submissions: true }
        },
        submissions: {
          select: {
            id: true,
            status: true,
            score: true,
            studentId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Statistika qo'shish
    const enriched = assignments.map(a => {
      const totalStudents = a.group?._count?.students || 0
      const submittedCount = a.submissions.length
      const gradedCount = a.submissions.filter(s => s.status === 'graded').length
      const pendingCount = a.submissions.filter(s => s.status === 'pending').length
      const avgScore = gradedCount > 0
        ? Math.round(a.submissions.filter(s => s.score !== null).reduce((sum, s) => sum + s.score, 0) / gradedCount)
        : null

      return {
        ...a,
        submissions: undefined,
        stats: {
          totalStudents,
          submittedCount,
          gradedCount,
          pendingCount,
          avgScore,
          completionRate: totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0
        }
      }
    })

    // Guruhlar ro'yxati
    const groups = await prisma.teacherGroup.findMany({
      where: { teacherId: session.user.id },
      select: { id: true, name: true, color: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      assignments: enriched,
      groups,
      total: enriched.length
    })
  } catch (error) {
    console.error('[Vazifa GET]', error)
    return NextResponse.json({ error: 'Vazifalarni yuklashda xatolik yuz berdi' }, { status: 500 })
  }
}

// POST - Yangi vazifa yaratish
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    // Validatsiya
    if (!data.title || data.title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Vazifa sarlavhasi kamida 3 ta harfdan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    if (!data.description || data.description.trim().length < 5) {
      return NextResponse.json(
        { error: 'Vazifa tavsifi kamida 5 ta harfdan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    if (!data.groupId) {
      return NextResponse.json(
        { error: 'Guruhni tanlang' },
        { status: 400 }
      )
    }

    if (!data.deadline) {
      return NextResponse.json(
        { error: 'Topshirish muddatini belgilang' },
        { status: 400 }
      )
    }

    // Guruh o'qituvchiga tegishlimi?
    const group = await prisma.teacherGroup.findFirst({
      where: {
        id: data.groupId,
        teacherId: session.user.id
      }
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Guruh topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    const assignment = await prisma.assignment.create({
      data: {
        teacherId: session.user.id,
        groupId: data.groupId,
        title: data.title.trim(),
        description: data.description.trim(),
        type: data.type || 'homework',
        deadline: new Date(data.deadline),
        maxScore: parseInt(data.maxScore) || 100,
        passingScore: data.passingScore ? parseInt(data.passingScore) : null,
        maxAttempts: parseInt(data.maxAttempts) || 1,
        allowLateSubmission: data.allowLateSubmission || false,
        latePenalty: parseFloat(data.latePenalty) || 10,
        instructions: data.instructions?.trim() || null,
        isDraft: data.isDraft || false
      },
      include: {
        group: { select: { name: true, color: true } }
      }
    })

    if (!assignment.isDraft) {
      const activeMembers = await prisma.teacherStudent.findMany({
        where: { groupId: group.id, holat: 'faol' },
        select: { studentId: true }
      })
      for (const m of activeMembers) {
        createNotification({
          userId: m.studentId,
          title: `📝 Yangi vazifa: ${assignment.title}`,
          message: `"${group.name}" guruhida yangi vazifa e'lon qilindi. Topshirish muddati: ${new Date(assignment.deadline).toLocaleDateString('uz-UZ')}.`,
          type: 'system',
          icon: '📝',
          link: '/profil/vazifalar',
          sentBy: session.user.id,
        }).catch(() => {})
      }
    }

    return NextResponse.json({
      success: true,
      assignment,
      message: `✓ "${assignment.title}" vazifasi "${group.name}" guruhiga berildi`
    })
  } catch (error) {
    console.error('[Vazifa POST]', error)
    return NextResponse.json({ error: 'Vazifa yaratishda xatolik yuz berdi' }, { status: 500 })
  }
}

// DELETE - Vazifani o'chirish
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const assignmentId = searchParams.get('id')

    if (!assignmentId) {
      return NextResponse.json({ error: 'Vazifa ID kerak' }, { status: 400 })
    }

    const existing = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        teacherId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Vazifa topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    // Topshiriqlar va vazifani tranzaksiyada o'chirish (FK xatosini oldini olish)
    await prisma.$transaction([
      prisma.assignmentSubmission.deleteMany({
        where: { assignmentId }
      }),
      prisma.assignment.delete({
        where: { id: assignmentId }
      })
    ])

    return NextResponse.json({
      success: true,
      message: `✓ "${existing.title}" vazifasi o'chirildi`
    })
  } catch (error) {
    console.error('[Vazifa DELETE]', error)
    return NextResponse.json({ error: 'Vazifani o\'chirishda xatolik yuz berdi' }, { status: 500 })
  }
}
