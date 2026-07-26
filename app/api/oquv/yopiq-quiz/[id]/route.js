// app/api/oquv/yopiq-quiz/[id]/route.js
//
// TALABA uchun: bitta yopiq quizni ochish (GET) va topshirish (POST).
//
// Yopiq quiz variantsiz — talaba matn bilan javob yozadi, ustoz keyin
// qo'lda baholaydi. Shuning uchun bu yerda ball hisoblanmaydi;
// XP va statistika ustoz baho qo'yganda beriladi
// (app/api/ustoz/yopiq-quiz/route.js).
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

/** Talaba shu quizga kira oladimi — guruh yoki ustoz orqali biriktirilganmi */
async function loadQuizForStudent(quizId, studentId) {
  const quiz = await prisma.closedQuiz.findFirst({
    where: { id: quizId, isDraft: false },
    include: {
      teacher: { select: { id: true, fullName: true, username: true } },
      group: { select: { id: true, name: true } },
      questions: {
        orderBy: { order: 'asc' },
        select: { id: true, questionText: true, maxPoints: true, order: true, hint: true },
      },
    },
  })

  if (!quiz) return { quiz: null, allowed: false }

  const membership = await prisma.teacherStudent.findFirst({
    where: {
      studentId,
      OR: [
        ...(quiz.groupId ? [{ groupId: quiz.groupId }] : []),
        { teacherId: quiz.teacherId },
      ],
    },
  })

  return { quiz, allowed: Boolean(membership) }
}

// ─── GET: quizni ochish ───
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const studentId = session.user.id
    const { quiz, allowed } = await loadQuizForStudent(id, studentId)

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz topilmadi' }, { status: 404 })
    }
    if (!allowed) {
      return NextResponse.json(
        { error: 'Bu quiz sizga biriktirilmagan' },
        { status: 403 }
      )
    }

    const submissions = await prisma.closedQuizSubmission.findMany({
      where: { quizId: id, studentId },
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true,
        answers: true,
        status: true,
        score: true,
        maxScore: true,
        feedback: true,
        submittedAt: true,
        gradedAt: true,
      },
    })

    const expired = quiz.deadline ? new Date(quiz.deadline) < new Date() : false

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        instructions: quiz.instructions,
        timeLimit: quiz.timeLimit,
        maxAttempts: quiz.maxAttempts,
        maxScore: quiz.maxScore,
        deadline: quiz.deadline,
        teacher: quiz.teacher,
        group: quiz.group,
        questions: quiz.questions,
      },
      mySubmissions: submissions,
      attemptsUsed: submissions.length,
      expired,
      canSubmit:
        !expired && quiz.questions.length > 0 && submissions.length < quiz.maxAttempts,
    })
  } catch (error) {
    console.error('[Talaba yopiq quiz GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── POST: javoblarni topshirish ───
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const studentId = session.user.id
    const { quiz, allowed } = await loadQuizForStudent(id, studentId)

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz topilmadi' }, { status: 404 })
    }
    if (!allowed) {
      return NextResponse.json(
        { error: 'Bu quiz sizga biriktirilmagan' },
        { status: 403 }
      )
    }

    // Muddat tugaganmi
    if (quiz.deadline && new Date(quiz.deadline) < new Date()) {
      return NextResponse.json(
        { error: 'Topshirish muddati tugagan' },
        { status: 400 }
      )
    }

    // Urinishlar soni
    const used = await prisma.closedQuizSubmission.count({
      where: { quizId: id, studentId },
    })
    if (used >= quiz.maxAttempts) {
      return NextResponse.json(
        { error: `Urinishlar soni tugadi (${quiz.maxAttempts} ta)` },
        { status: 400 }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body || !Array.isArray(body.answers)) {
      return NextResponse.json({ error: 'Javoblar yuborilmadi' }, { status: 400 })
    }

    // Faqat shu quizga tegishli savollarga javoblarni qabul qilamiz
    const questionIds = new Set(quiz.questions.map((q) => q.id))
    const answers = body.answers
      .filter((a) => a && questionIds.has(a.questionId))
      .map((a) => ({
        questionId: a.questionId,
        answer: typeof a.answer === 'string' ? a.answer.trim() : '',
      }))

    if (answers.length === 0) {
      return NextResponse.json(
        { error: 'Kamida bitta savolga javob yozing' },
        { status: 400 }
      )
    }

    const submission = await prisma.closedQuizSubmission.create({
      data: {
        quizId: id,
        studentId,
        answers,
        maxScore: quiz.maxScore,
        timeSpent: Number.isFinite(Number(body.timeSpent)) ? Number(body.timeSpent) : 0,
        status: 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      submission: { id: submission.id, status: submission.status, submittedAt: submission.submittedAt },
      message: 'Javoblaringiz yuborildi. Ustoz baholagach natija ko\'rinadi.',
      attemptsLeft: quiz.maxAttempts - (used + 1),
    })
  } catch (error) {
    console.error('[Talaba yopiq quiz POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
