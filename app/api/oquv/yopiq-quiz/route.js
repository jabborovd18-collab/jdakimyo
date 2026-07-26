// app/api/oquv/yopiq-quiz/route.js
//
// TALABA uchun yopiq (variantsiz) quizlar ro'yxati.
//
// Bu endpoint umuman yo'q edi: ustoz yopiq quiz yarata olardi, lekin talaba
// uni ko'ra ham, topshira ham olmasdi. Sayt esa mavjud bo'lmagan
// /oquv/video-darsliklar/ustoz-yopiq-quiz sahifasiga havola qilardi.
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

    const studentId = session.user.id

    // Talaba qaysi guruh va ustozlarga biriktirilgan
    const memberships = await prisma.teacherStudent.findMany({
      where: { studentId },
      select: { groupId: true, teacherId: true },
    })

    const groupIds = memberships.map((m) => m.groupId).filter(Boolean)
    const teacherIds = [...new Set(memberships.map((m) => m.teacherId))]

    // Yopiq quiz ochiq (public) bo'lmaydi — faqat guruh yoki ustoz orqali
    if (groupIds.length === 0 && teacherIds.length === 0) {
      return NextResponse.json({ success: true, quizzes: [], total: 0 })
    }

    const quizzes = await prisma.closedQuiz.findMany({
      where: {
        isDraft: false,
        OR: [
          { groupId: { in: groupIds } },
          { teacherId: { in: teacherIds } },
        ],
      },
      orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        description: true,
        instructions: true,
        timeLimit: true,
        maxAttempts: true,
        maxScore: true,
        deadline: true,
        createdAt: true,
        teacher: { select: { fullName: true, username: true } },
        group: { select: { name: true } },
        _count: { select: { questions: true } },
        submissions: {
          where: { studentId },
          select: {
            id: true,
            status: true,
            score: true,
            maxScore: true,
            submittedAt: true,
            gradedAt: true,
          },
          orderBy: { submittedAt: 'desc' },
        },
      },
    })

    const now = new Date()

    const result = quizzes.map((quiz) => {
      const { submissions, ...rest } = quiz
      const expired = quiz.deadline ? new Date(quiz.deadline) < now : false

      return {
        ...rest,
        questionCount: quiz._count.questions,
        mySubmissions: submissions,
        attemptsUsed: submissions.length,
        expired,
        canSubmit:
          !expired &&
          quiz._count.questions > 0 &&
          submissions.length < quiz.maxAttempts,
      }
    })

    return NextResponse.json({ success: true, quizzes: result, total: result.length })
  } catch (error) {
    console.error('[Talaba yopiq quiz ro\'yxati]', error)
    return NextResponse.json(
      { error: 'Quizlarni yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}
