// app/api/ustoz/natijalar/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

// GET - O'qituvchining barcha natijalari
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
    // `type` (quiz/vazifa) ataylab yo'q: uni sahifaning o'zi ro'yxatni
    // chizishda qo'llaydi. Bu yerda o'qilardi-yu, hech qayerda
    // ishlatilmasdi — kim o'qisa, filtr serverda ishlaydi deb o'ylardi.

    // Quiz natijalari
    // DIQQAT: shart `quiz` obyektining ICHIDA turishi shart.
    // Avval u tashqarida edi va `...(shart && { quiz: { groupId } })`
    // bir xil kalitni ikkinchi marta yozib, `teacherId` cheklovini
    // butunlay o'chirib yuborardi. Natijada guruh bo'yicha filtrlanganda
    // ustoz boshqa ustozning natijalarini ko'rar edi.
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
            // maxScore bu yerda YO'Q: u TeacherQuiz'da emas, urinishning
            // o'zida (TeacherQuizAttempt.maxScore) saqlanadi. Uni tanlashga
            // urinish "Unknown field `maxScore`" xatosini berardi va
            // natijalar sahifasi umuman ochilmasdi.
            group: {
              select: { id: true, name: true, color: true }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    })

    // Vazifa natijalari (topshiriqlar)
    const assignmentSubmissions = await prisma.assignmentSubmission.findMany({
      // Yuqoridagi bilan bir xil sabab: shart `assignment` ichida turadi,
      // aks holda egalik cheklovi ustiga yozilib yo'qoladi.
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
      orderBy: { submittedAt: 'desc' }
    })

    // Guruhlar (filter uchun)
    const groups = await prisma.teacherGroup.findMany({
      where: { teacherId: session.user.id },
      select: { id: true, name: true, color: true },
      orderBy: { name: 'asc' }
    })

    // Statistika
    const stats = {
      totalQuizAttempts: quizAttempts.length,
      totalAssignmentSubmissions: assignmentSubmissions.length,
      avgQuizScore: quizAttempts.length > 0
        ? quizAttempts.reduce((sum, a) => sum + a.percentage, 0) / quizAttempts.length
        : 0,
      pendingGrading: assignmentSubmissions.filter(s => s.status === 'pending').length
    }

    return NextResponse.json({
      success: true,
      quizAttempts,
      assignmentSubmissions,
      groups,
      stats
    })
  } catch (error) {
    console.error('[Natijalar GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}