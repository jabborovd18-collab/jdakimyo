// app/api/oquv/ustoz-quiz/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const search = searchParams.get('search') || ''

    const studentId = session.user.id

    // Talabaning guruhlari (ustozlari).
    // `holat: 'faol'` SHART: qabul qilinmagan taklif a'zolik emas va
    // guruh quizlarini ochib qo'ymasligi kerak.
    const teacherStudents = await prisma.teacherStudent.findMany({
      where: { studentId, holat: 'faol' },
      select: { 
        teacherId: true, 
        groupId: true 
      }
    })

    const teacherIds = teacherStudents.map(ts => ts.teacherId)
    const groupIds = teacherStudents.map(ts => ts.groupId).filter(Boolean)

    // WHERE shartlari
    let where = {
      isDraft: false, // Faqat e'lon qilinganlar
      OR: [
        { isPublic: true },
        { groupId: { in: groupIds } },
        { teacherId: { in: teacherIds } }
      ]
    }

    if (filter === 'mine') {
      where.teacherId = { in: teacherIds }
    }

    if (search) {
      where.AND = [
        where,
        {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { teacher: { fullName: { contains: search, mode: 'insensitive' } } }
          ]
        }
      ]
    }

    const quizzes = await prisma.teacherQuiz.findMany({
      where,
      include: {
        teacher: { 
          select: { 
            id: true, 
            fullName: true, 
            avatar: true,
            university: true 
          } 
        },
        group: { select: { name: true } },
        _count: { select: { questions: true, attempts: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Har bir quiz uchun foydalanuvchining urinishlarini tekshirish
    const quizzesWithUserData = await Promise.all(
      quizzes.map(async (quiz) => {
        const userAttempt = await prisma.teacherQuizAttempt.findFirst({
          where: {
            quizId: quiz.id,
            studentId
          },
          orderBy: { completedAt: 'desc' }
        })

        // Maxfiy kod tekshirish (session storage orqali)
        const hasAccess = !quiz.accessCode || quiz.groupId && groupIds.includes(quiz.groupId)

        return {
          ...quiz,
          userAttempt,
          hasAccess
        }
      })
    )

    // Filter by completed
    let filtered = quizzesWithUserData
    if (filter === 'completed') {
      filtered = quizzesWithUserData.filter(q => q.userAttempt)
    } else if (filter === 'new') {
      filtered = quizzesWithUserData.filter(q => !q.userAttempt)
    }

    return NextResponse.json({
      success: true,
      quizzes: filtered,
      total: filtered.length
    })
  } catch (error) {
    console.error('[Ustoz Quiz GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}