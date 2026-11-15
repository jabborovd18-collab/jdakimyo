import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/bildirishnoma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Kirish talab qilinadi' }, { status: 401 })
    }

    // Faqat qabul qilingan a'zoliklar — kutilayotgan taklif
    // "mening ustozim" degani emas.
    const memberships = await prisma.teacherStudent.findMany({
      where: { studentId: session.user.id, holat: 'faol' },
      include: {
        teacher: { select: { id: true, userId: true, fullName: true, username: true, avatar: true, university: true, isVerified: true } },
        group: { select: { id: true, name: true, color: true } }
      },
      orderBy: { joinedAt: 'desc' }
    })
    const groupIds = [...new Set(memberships.map((membership) => membership.groupId).filter(Boolean))]
    const teacherIds = [...new Set(memberships.map((membership) => membership.teacherId))]

    const [assignments, announcements, quizzes] = await Promise.all([
      prisma.assignment.findMany({
        where: { groupId: { in: groupIds }, isDraft: false },
        include: {
          teacher: { select: { fullName: true, username: true, isVerified: true } },
          group: { select: { name: true } },
          submissions: {
            where: { studentId: session.user.id },
            orderBy: { submittedAt: 'desc' },
            select: {
              id: true,
              score: true,
              status: true,
              feedback: true,
              textAnswer: true,
              fileUrls: true,
              attemptNumber: true,
              isLate: true,
              submittedAt: true,
              gradedAt: true
            }
          }
        },
        orderBy: { deadline: 'asc' },
        take: 30
      }),
      prisma.announcement.findMany({
        where: { groupId: { in: groupIds } },
        include: {
          teacher: { select: { fullName: true, username: true, isVerified: true } },
          group: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 30
      }),
      prisma.teacherQuiz.findMany({
        where: {
          isDraft: false,
          OR: [
            { isPublic: true, groupId: null },
            ...(groupIds.length > 0 ? [{ groupId: { in: groupIds } }] : []),
            ...(teacherIds.length > 0 ? [{ teacherId: { in: teacherIds }, groupId: null }] : [])
          ]
        },
        include: {
          teacher: { select: { fullName: true, username: true, isVerified: true } },
          group: { select: { name: true } },
          _count: { select: { questions: true } },
          attempts: {
            where: { studentId: session.user.id },
            orderBy: { completedAt: 'desc' },
            take: 1,
            select: { percentage: true, completedAt: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 30
      })
    ])

    return NextResponse.json({ success: true, memberships, assignments, announcements, quizzes })
  } catch (error) {
    console.error('[Profile learning GET]', error)
    return NextResponse.json({ error: "O'quv ma'lumotlarini yuklab bo'lmadi" }, { status: 500 })
  }
}

// POST - Talaba tomonidan vazifa topshirig'ini yuborish (AssignmentSubmission)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Kirish talab qilinadi' }, { status: 401 })
    }

    const studentId = session.user.id
    const body = await request.json()
    const assignmentId = body?.assignmentId
    const textAnswer = typeof body?.textAnswer === 'string' ? body.textAnswer.trim() : ''
    const fileUrls = Array.isArray(body?.fileUrls) ? body.fileUrls : []

    if (!assignmentId) {
      return NextResponse.json({ error: 'Vazifa tanlanmagan' }, { status: 400 })
    }

    const assignment = await prisma.assignment.findFirst({
      where: { id: assignmentId, isDraft: false },
      include: {
        group: { select: { id: true, name: true } }
      }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Vazifa topilmadi' }, { status: 404 })
    }

    // Talaba shu guruhning faol a'zosimi?
    const membership = await prisma.teacherStudent.findFirst({
      where: {
        studentId,
        groupId: assignment.groupId,
        holat: 'faol'
      },
      select: { id: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Siz ushbu vazifa biriktirilgan guruh a\'zosi emassiz' }, { status: 403 })
    }

    const now = new Date()
    const isLate = assignment.deadline ? now > new Date(assignment.deadline) : false
    if (isLate && !assignment.allowLateSubmission) {
      return NextResponse.json(
        { error: 'Vazifa topshirish muddati tugagan va kech topshirishga ruxsat berilmagan' },
        { status: 400 }
      )
    }

    const existingCount = await prisma.assignmentSubmission.count({
      where: { assignmentId, studentId }
    })

    if (assignment.maxAttempts !== 99 && existingCount >= assignment.maxAttempts) {
      return NextResponse.json(
        { error: `Urinishlar soni tugagan (${assignment.maxAttempts} marta)` },
        { status: 400 }
      )
    }

    if (assignment.requireFile && fileUrls.length === 0) {
      return NextResponse.json(
        { error: 'Ushbu vazifa uchun fayl yuklash majburiy' },
        { status: 400 }
      )
    }

    if (!textAnswer && fileUrls.length === 0) {
      return NextResponse.json(
        { error: 'Javob matnini yozing yoki fayl biriktiring' },
        { status: 400 }
      )
    }

    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId,
        textAnswer: textAnswer || null,
        fileUrls: fileUrls.length > 0 ? fileUrls : null,
        status: 'pending',
        attemptNumber: existingCount + 1,
        isLate,
      }
    })

    const studentName = session.user.fullName || session.user.name || session.user.username || 'Talaba'
    createNotification({
      userId: assignment.teacherId,
      title: '📥 Yangi vazifa topshirildi',
      message: `${studentName} "${assignment.title}" vazifasiga javob yubordi.`,
      type: 'system',
      icon: '📥',
      link: `/ustoz/natijalar?groupId=${assignment.groupId}&tab=assignments`,
      sentBy: studentId,
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      submission,
      message: '✓ Vazifa javobingiz ustozga yuborildi!'
    })
  } catch (error) {
    console.error('[Profile learning POST]', error)
    return NextResponse.json({ error: 'Vazifani yuborishda xatolik yuz berdi' }, { status: 500 })
  }
}
