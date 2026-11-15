// app/api/testlar/ustoz/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  ustozKirishTokeniniOqi,
  ustozQuizCookieNomi,
  ustozQuizKodHashi,
} from '@/lib/quiz-urinish'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const search = (searchParams.get('search') || '').trim()

    const studentId = session.user.id

    // Talabaning guruhlari (ustozlari).
    // `holat: 'faol'` SHART: qabul qilinmagan taklif a'zolik emas va
    // guruh quizlarini ochib qo'ymasligi kerak.
    const teacherStudents = await prisma.teacherStudent.findMany({
      where: { studentId, holat: 'faol' },
      select: {
        teacherId: true,
        groupId: true,
      },
    })

    const teacherIds = [...new Set(teacherStudents.map((ts) => ts.teacherId))]
    const groupIds = [...new Set(teacherStudents.map((ts) => ts.groupId).filter(Boolean))]

    // Kirish chegarasi:
    // - Ommaviy quizlar
    // - O'zi a'zo bo'lgan guruh quizlari
    // - Guruhga bog'lanmagan (`groupId: null`), o'z ustozining quizlari
    // - Agar foydalanuvchining o'zi ustoz bo'lsa — o'zi yaratgan quizlar
    const accessOr = [
      { isPublic: true },
      ...(groupIds.length > 0 ? [{ groupId: { in: groupIds } }] : []),
      ...(teacherIds.length > 0 ? [{ teacherId: { in: teacherIds }, groupId: null }] : []),
      { teacherId: studentId },
    ]

    const andConditions = [
      { isDraft: false },
      { OR: accessOr },
    ]

    if (filter === 'mine') {
      andConditions.push({
        OR: [
          ...(teacherIds.length > 0 ? [{ teacherId: { in: teacherIds } }] : []),
          { teacherId: studentId },
        ],
      })
    }

    if (search) {
      andConditions.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { teacher: { fullName: { contains: search, mode: 'insensitive' } } },
          { teacher: { username: { contains: search, mode: 'insensitive' } } },
        ],
      })
    }

    const quizzes = await prisma.teacherQuiz.findMany({
      where: { AND: andConditions },
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
            university: true,
          },
        },
        group: { select: { name: true } },
        _count: { select: { questions: true, attempts: true } },
        attempts: {
          where: { studentId },
          orderBy: { completedAt: 'desc' },
          take: 1,
          select: {
            id: true,
            score: true,
            maxScore: true,
            percentage: true,
            timeSpent: true,
            completedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const quizzesWithUserData = quizzes.map((quiz) => {
      const { attempts, accessCode: rawAccessCode, ...safeQuiz } = quiz
      const userAttempt = attempts?.[0] || null

      let codeVerified = false
      if (rawAccessCode) {
        const cookieVal = request.cookies.get(ustozQuizCookieNomi(quiz.id))?.value
        if (cookieVal) {
          try {
            const parsed = ustozKirishTokeniniOqi(cookieVal)
            if (
              parsed.quizId === quiz.id &&
              parsed.userId === studentId &&
              parsed.codeHash === ustozQuizKodHashi(rawAccessCode)
            ) {
              codeVerified = true
            }
          } catch {
            codeVerified = false
          }
        }
      }

      const hasAccess =
        quiz.teacherId === studentId ||
        !rawAccessCode ||
        codeVerified

      return {
        ...safeQuiz,
        // Maxfiy kodning o'zi hech qachon brauzerga ochiq yuborilmaydi
        accessCode: Boolean(rawAccessCode),
        userAttempt,
        hasAccess,
      }
    })

    let filtered = quizzesWithUserData
    if (filter === 'completed') {
      filtered = quizzesWithUserData.filter((q) => q.userAttempt)
    } else if (filter === 'new') {
      filtered = quizzesWithUserData.filter((q) => !q.userAttempt)
    }

    return NextResponse.json({
      success: true,
      quizzes: filtered,
      total: filtered.length,
    })
  } catch (error) {
    console.error('[Ustoz Quiz GET]', error)
    return NextResponse.json({ error: 'Testlarni yuklashda xatolik yuz berdi' }, { status: 500 })
  }
}