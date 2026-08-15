// app/api/ustoz/natijalar/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

// GET - O'qituvchining o'zi yaratgan barcha test va vazifa natijalari
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
    const groupId = searchParams.get('groupId') || 'all'

    // 1. Variantli Quiz natijalari (Faqat shu o'qituvchining testlari)
    const quizAttempts = await prisma.teacherQuizAttempt.findMany({
      where: {
        quiz: {
          teacherId: session.user.id,
          ...(groupId !== 'all' && { groupId }),
        },
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
            userId: true
          }
        },
        quiz: {
          select: {
            id: true,
            title: true,
            isPublic: true,
            passingScore: true,
            group: {
              select: { id: true, name: true, color: true }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 200,
    })

    // 2. Yopiq Yozma Quiz natijalari (Faqat shu o'qituvchining testlari)
    const closedQuizSubmissions = await prisma.closedQuizSubmission.findMany({
      where: {
        quiz: {
          teacherId: session.user.id,
          ...(groupId !== 'all' && { groupId }),
        },
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
            userId: true
          }
        },
        quiz: {
          select: {
            id: true,
            title: true,
            maxScore: true,
            group: {
              select: { id: true, name: true, color: true }
            }
          }
        }
      },
      orderBy: { submittedAt: 'desc' },
      take: 200,
    })

    // 3. Vazifa natijalari (topshiriqlar)
    const assignmentSubmissions = await prisma.assignmentSubmission.findMany({
      where: {
        assignment: {
          teacherId: session.user.id,
          ...(groupId !== 'all' && { groupId }),
        },
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
            userId: true
          }
        },
        assignment: {
          select: {
            id: true,
            title: true,
            type: true,
            maxScore: true,
            group: {
              select: { id: true, name: true, color: true }
            }
          }
        }
      },
      orderBy: { submittedAt: 'desc' },
      take: 200,
    })

    // Guruhlar
    const groups = await prisma.teacherGroup.findMany({
      where: { teacherId: session.user.id },
      select: { id: true, name: true, color: true },
      orderBy: { name: 'asc' }
    })

    // Hisob-kitoblar
    const totalAttempts = quizAttempts.length
    const avgScore = totalAttempts > 0
      ? quizAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAttempts
      : 0
    const pendingGrading = closedQuizSubmissions.filter(s => s.status === 'pending').length +
                           assignmentSubmissions.filter(s => s.status === 'pending').length

    return NextResponse.json({
      success: true,
      quizAttempts,
      closedQuizSubmissions,
      assignmentSubmissions,
      groups,
      stats: {
        totalQuizAttempts: totalAttempts,
        totalClosedSubmissions: closedQuizSubmissions.length,
        totalAssignmentSubmissions: assignmentSubmissions.length,
        avgQuizScore: avgScore,
        pendingGrading
      }
    })
  } catch (error) {
    console.error('[Natijalar GET]', error)
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 })
  }
}
