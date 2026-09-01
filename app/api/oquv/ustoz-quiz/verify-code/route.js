import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  ustozKirishTokeniniYarat,
  ustozQuizCookieNomi,
  ustozQuizKodHashi,
} from '@/lib/quiz-urinish'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { quizId, code } = await request.json()
    if (!quizId || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Quiz ID va kod majburiy' }, { status: 400 })
    }

    const quiz = await prisma.teacherQuiz.findUnique({
      where: { id: quizId },
      select: { accessCode: true, title: true, isDraft: true, deadline: true },
    })
    if (!quiz) return NextResponse.json({ error: 'Quiz topilmadi' }, { status: 404 })
    if (quiz.isDraft) return NextResponse.json({ error: "Quiz hali e'lon qilinmagan" }, { status: 403 })
    if (quiz.deadline && quiz.deadline < new Date()) {
      return NextResponse.json({ error: 'Quiz topshirish muddati tugagan' }, { status: 403 })
    }
    if (!quiz.accessCode || ustozQuizKodHashi(quiz.accessCode) !== ustozQuizKodHashi(code)) {
      return NextResponse.json({ error: "Noto'g'ri kod!" }, { status: 400 })
    }

    const response = NextResponse.json({
      success: true,
      message: `"${quiz.title}" ga kirish ruxsati berildi`,
    })
    response.cookies.set({
      name: ustozQuizCookieNomi(quizId),
      value: ustozKirishTokeniniYarat({
        quizId,
        userId: session.user.id,
        accessCode: quiz.accessCode,
      }),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: `/api/oquv/ustoz-quiz/${quizId}`,
      maxAge: 6 * 60 * 60,
    })
    return response
  } catch (error) {
    console.error('[Verify Code]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
