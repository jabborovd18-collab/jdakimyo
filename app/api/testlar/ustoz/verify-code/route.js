import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  ustozKirishTokeniniYarat,
  ustozQuizCookieNomi,
  ustozQuizKodHashi,
} from '@/lib/quiz-urinish'
import { soravchiIp, chekloqniTekshir, urinishniQayd, kutishMatni } from '@/lib/ip-cheklov'
import { vaqtBoyichaTeng } from '@/lib/xavfsiz'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const ip = soravchiIp(request)
    const cheklov = await chekloqniTekshir('ustozkod', ip)
    if (!cheklov.ok) {
      return NextResponse.json(
        { error: `Juda ko'p noto'g'ri kod urinib ko'rildi. ${kutishMatni(cheklov.kutish)} dan keyin qayta urining.` },
        { status: 429 }
      )
    }

    const { quizId, code } = await request.json()
    if (!quizId || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Quiz ID va kod majburiy' }, { status: 400 })
    }

    const quiz = await prisma.teacherQuiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        teacherId: true,
        groupId: true,
        isPublic: true,
        accessCode: true,
        title: true,
        isDraft: true,
        deadline: true,
      },
    })
    if (!quiz) return NextResponse.json({ error: 'Quiz topilmadi' }, { status: 404 })
    if (quiz.isDraft && quiz.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Quiz hali e'lon qilinmagan" }, { status: 403 })
    }
    if (quiz.deadline && quiz.deadline < new Date() && quiz.teacherId !== session.user.id) {
      return NextResponse.json({ error: 'Quiz topshirish muddati tugagan' }, { status: 403 })
    }
    if (!quiz.isPublic && quiz.groupId && quiz.teacherId !== session.user.id) {
      const inGroup = await prisma.teacherStudent.findFirst({
        where: { studentId: session.user.id, groupId: quiz.groupId, holat: 'faol' },
        select: { id: true },
      })
      if (!inGroup) {
        return NextResponse.json({ error: "Siz bu guruh a'zosi emassiz" }, { status: 403 })
      }
    }
    if (!quiz.accessCode || !vaqtBoyichaTeng(ustozQuizKodHashi(quiz.accessCode), ustozQuizKodHashi(code))) {
      await urinishniQayd('ustozkod', ip)
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
      path: '/api/testlar/ustoz',
      maxAge: 6 * 60 * 60,
    })
    return response
  } catch (error) {
    console.error('[Verify Code]', error)
    return NextResponse.json({ error: 'Kodni tekshirishda xatolik yuz berdi' }, { status: 500 })
  }
}
