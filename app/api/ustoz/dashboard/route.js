// app/api/ustoz/dashboard/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const teacherId = session.user.id

    const [
      totalStudents,
      totalGroups,
      activeAssignments,
      totalQuizzes,
      pendingAssignSubmissions,
      pendingClosedSubmissions,
      recentAssignSubmissions,
      recentQuizAttempts,
      recentClosedSubmissions,
      topStudentsRaw
    ] = await Promise.all([
      prisma.teacherStudent.count({
        where: { teacherId, holat: 'faol' }
      }),

      prisma.teacherGroup.count({
        where: { teacherId }
      }),

      prisma.assignment.count({
        where: {
          teacherId,
          isDraft: false,
          deadline: { gte: new Date() }
        }
      }),

      prisma.teacherQuiz.count({
        where: { teacherId }
      }),

      prisma.assignmentSubmission.count({
        where: {
          assignment: { teacherId },
          status: 'pending'
        }
      }),

      prisma.closedQuizSubmission.count({
        where: {
          quiz: { teacherId },
          status: 'pending'
        }
      }),

      prisma.assignmentSubmission.findMany({
        where: {
          assignment: { teacherId }
        },
        include: {
          student: {
            select: {
              fullName: true,
              username: true,
              avatar: true
            }
          },
          assignment: {
            select: {
              title: true,
              maxScore: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' },
        take: 10
      }),

      prisma.teacherQuizAttempt.findMany({
        where: {
          quiz: { teacherId }
        },
        include: {
          student: {
            select: {
              fullName: true,
              username: true,
              avatar: true
            }
          },
          quiz: {
            select: {
              title: true
            }
          }
        },
        orderBy: { completedAt: 'desc' },
        take: 10
      }),

      prisma.closedQuizSubmission.findMany({
        where: {
          quiz: { teacherId }
        },
        include: {
          student: {
            select: {
              fullName: true,
              username: true,
              avatar: true
            }
          },
          quiz: {
            select: {
              title: true,
              maxScore: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' },
        take: 10
      }),

      prisma.teacherStudent.findMany({
        where: { teacherId, holat: 'faol' },
        include: {
          student: {
            select: {
              id: true,
              userId: true,
              fullName: true,
              username: true,
              avatar: true,
              totalPoints: true,
              experience: true,
              level: true,
              isVerified: true,
              premiumUslub: true,
            }
          },
          group: {
            select: { name: true, color: true }
          }
        },
        take: 25
      })
    ])

    const topStudents = topStudentsRaw
      .sort((a, b) => (b.student.totalPoints || 0) - (a.student.totalPoints || 0))
      .slice(0, 5)
      .map(ts => ({
        ...ts.student,
        groupName: ts.group?.name || 'Guruhsiz',
        groupColor: ts.group?.color || 'blue'
      }))

    const mergedActivity = [
      ...recentAssignSubmissions.map(sub => ({
        id: `assign-${sub.id}`,
        studentName: sub.student.fullName || sub.student.username,
        studentAvatar: sub.student.avatar,
        assignmentTitle: `Vazifa: ${sub.assignment.title}`,
        score: sub.score,
        maxScore: sub.assignment.maxScore,
        status: sub.status,
        submittedAt: sub.submittedAt
      })),
      ...recentQuizAttempts.map(att => ({
        id: `quiz-${att.id}`,
        studentName: att.student.fullName || att.student.username,
        studentAvatar: att.student.avatar,
        assignmentTitle: `Ochiq quiz: ${att.quiz.title}`,
        score: att.score,
        maxScore: att.maxScore,
        status: 'graded',
        submittedAt: att.completedAt
      })),
      ...recentClosedSubmissions.map(sub => ({
        id: `closed-${sub.id}`,
        studentName: sub.student.fullName || sub.student.username,
        studentAvatar: sub.student.avatar,
        assignmentTitle: `Yopiq quiz: ${sub.quiz.title}`,
        score: sub.score,
        maxScore: sub.maxScore,
        status: sub.status,
        submittedAt: sub.submittedAt
      }))
    ]
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        totalGroups,
        activeAssignments,
        totalQuizzes,
        pendingSubmissions: pendingAssignSubmissions + pendingClosedSubmissions
      },
      recentActivity: mergedActivity,
      topStudents
    })
  } catch (error) {
    console.error('[Ustoz Dashboard]', error)
    return NextResponse.json(
      { error: 'Dashboard ma\'lumotlarini yuklashda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
