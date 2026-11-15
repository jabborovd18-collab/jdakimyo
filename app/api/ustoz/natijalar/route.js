// app/api/ustoz/natijalar/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'
import { bahoTekshir } from '@/lib/ustoz-quiz'
import { saveQuizResult } from '@/lib/quiz-submit'
import { createNotification } from '@/lib/bildirishnoma'

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

    const teacherId = session.user.id

    // 1. Ochiq quiz urinishlari
    const openQuizWhere = {
      quiz: {
        teacherId,
        ...(groupId && groupId !== 'all' ? { groupId } : {})
      }
    }

    const openQuizAttempts = await prisma.teacherQuizAttempt.findMany({
      where: openQuizWhere,
      include: {
        student: {
          select: {
            id: true,
            userId: true,
            fullName: true,
            username: true,
            avatar: true
          }
        },
        quiz: {
          select: {
            id: true,
            title: true,
            passingScore: true,
            group: { select: { name: true } }
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 100
    })

    // 2. Yopiq quiz topshiriqlari
    const closedQuizWhere = {
      quiz: {
        teacherId,
        ...(groupId && groupId !== 'all' ? { groupId } : {})
      }
    }

    const closedQuizSubmissions = await prisma.closedQuizSubmission.findMany({
      where: closedQuizWhere,
      include: {
        student: {
          select: {
            id: true,
            userId: true,
            fullName: true,
            username: true,
            avatar: true
          }
        },
        quiz: {
          select: {
            id: true,
            title: true,
            maxScore: true,
            group: { select: { name: true } }
          }
        }
      },
      orderBy: { submittedAt: 'desc' },
      take: 100
    })

    // 3. Vazifa topshiriqlari
    const assignmentWhere = {
      assignment: {
        teacherId,
        ...(groupId && groupId !== 'all' ? { groupId } : {})
      }
    }

    const assignmentSubmissions = await prisma.assignmentSubmission.findMany({
      where: assignmentWhere,
      include: {
        student: {
          select: {
            id: true,
            userId: true,
            fullName: true,
            username: true,
            avatar: true
          }
        },
        assignment: {
          select: {
            id: true,
            title: true,
            type: true,
            maxScore: true,
            passingScore: true,
            group: { select: { name: true } }
          }
        }
      },
      orderBy: { submittedAt: 'desc' },
      take: 100
    })

    // 4. Guruhlar
    const groups = await prisma.teacherGroup.findMany({
      where: { teacherId },
      select: { id: true, name: true, color: true }
    })

    // 5. Umumiy statistika
    const totalQuizAttempts = openQuizAttempts.length + closedQuizSubmissions.length
    const avgOpenQuizScore = openQuizAttempts.length > 0
      ? openQuizAttempts.reduce((sum, a) => sum + a.percentage, 0) / openQuizAttempts.length
      : 0

    const pendingGrading = closedQuizSubmissions.filter(s => s.status === 'pending').length +
                           assignmentSubmissions.filter(s => s.status === 'pending').length

    return NextResponse.json({
      success: true,
      openQuizAttempts,
      closedQuizSubmissions,
      assignmentSubmissions,
      groups,
      stats: {
        totalQuizAttempts,
        avgOpenQuizScore: Math.round(avgOpenQuizScore * 10) / 10,
        pendingGrading,
        totalAssignmentSubmissions: assignmentSubmissions.length
      }
    })
  } catch (error) {
    console.error('[Natijalar GET]', error)
    return NextResponse.json({ error: 'Natijalarni yuklashda xatolik yuz berdi' }, { status: 500 })
  }
}

// PUT - Vazifa topshirig'ini baholash (AssignmentSubmission)
export async function PUT(request) {
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
    if (!data.submissionId) {
      return NextResponse.json({ error: 'submissionId kerak' }, { status: 400 })
    }

    const submission = await prisma.assignmentSubmission.findFirst({
      where: {
        id: data.submissionId,
        assignment: { teacherId: session.user.id }
      },
      include: {
        student: { select: { id: true, fullName: true, username: true } },
        assignment: { select: { id: true, title: true, maxScore: true } }
      }
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Topshiriq topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    const baho = bahoTekshir(data.score, submission.assignment.maxScore)
    if (!baho.valid) {
      return NextResponse.json({ error: baho.error }, { status: 400 })
    }
    const score = baho.score

    const updated = await prisma.assignmentSubmission.update({
      where: { id: submission.id },
      data: {
        status: 'graded',
        score,
        feedback: data.feedback?.trim() || null,
        gradedBy: session.user.id,
        gradedAt: new Date()
      },
      include: {
        student: {
          select: {
            id: true,
            userId: true,
            fullName: true,
            username: true,
            avatar: true
          }
        },
        assignment: {
          select: {
            id: true,
            title: true,
            type: true,
            maxScore: true,
            passingScore: true,
            group: { select: { name: true } }
          }
        }
      }
    })

    const alreadyGraded = submission.status === 'graded'
    let xpEarned = 0
    if (!alreadyGraded) {
      try {
        const saved = await saveQuizResult(submission.studentId, {
          attemptId: `vazifa:${submission.id}`,
          quizName: `Vazifa: ${submission.assignment.title}`,
          score,
          totalQuestions: submission.assignment.maxScore,
          timeSpent: 0,
        })
        xpEarned = saved.xpGained
      } catch (err) {
        console.error('[Vazifa baholash XP]', err.message)
      }
    }

    createNotification({
      userId: submission.studentId,
      title: 'Vazifangiz baholandi',
      message: `"${submission.assignment.title}" vazifangiz ${score}/${submission.assignment.maxScore} ball bilan baholandi.${data.feedback?.trim() ? ` Ustoz izohi: ${data.feedback.trim()}` : ''}`,
      type: 'system',
      icon: '⭐',
      link: '/profil/vazifalar',
      sentBy: session.user.id,
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      submission: updated,
      xpEarned,
      message: `✓ ${submission.student.fullName || submission.student.username} ga ${score}/${submission.assignment.maxScore} ball qo'yildi`
    })
  } catch (error) {
    console.error('[Natijalar PUT]', error)
    return NextResponse.json({ error: 'Vazifani baholashda xatolik yuz berdi' }, { status: 500 })
  }
}
