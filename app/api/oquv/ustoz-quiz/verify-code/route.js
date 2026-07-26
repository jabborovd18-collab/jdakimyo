// app/api/oquv/ustoz-quiz/verify-code/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quizId, code } = await request.json()

    if (!quizId || !code) {
      return NextResponse.json(
        { error: 'Quiz ID va kod majburiy' },
        { status: 400 }
      )
    }

    const quiz = await prisma.teacherQuiz.findUnique({
      where: { id: quizId },
      select: { accessCode: true, title: true }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz topilmadi' }, { status: 404 })
    }

    if (quiz.accessCode?.toUpperCase() !== code.toUpperCase()) {
      return NextResponse.json(
        { error: 'Noto\'g\'ri kod!' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `"${quiz.title}" ga kirish ruxsati berildi`
    })
  } catch (error) {
    console.error('[Verify Code]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}