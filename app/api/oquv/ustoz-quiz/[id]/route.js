import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { saveQuizResult } from '@/lib/quiz-submit'
import {
  ustozKirishTokeniniOqi,
  ustozQuizCookieNomi,
  ustozQuizKodHashi,
  ustozQuizUrinishTokeniniOqi,
  ustozQuizUrinishTokeniniYarat,
} from '@/lib/quiz-urinish'
import {
  indekslarniAralashtir,
  ustozQuizJavoblariniBahola,
  ustozQuizMeta,
  ustozQuizVariantlari,
} from '@/lib/ustoz-quiz'

function sorovXatosi(message, statusCode = 400) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function aralashtir(array) {
  const nusxa = [...array]
  for (let i = nusxa.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[nusxa[i], nusxa[j]] = [nusxa[j], nusxa[i]]
  }
  return nusxa
}

async function kirishRuxsatiniTop(quiz, studentId, kirishToken = null) {
  if (quiz.teacherId === studentId) return { bor: true, turi: 'teacher', sabab: "Quiz muallifi" }
  if (quiz.isPublic && !quiz.accessCode) return { bor: true, turi: 'public', sabab: 'Ochiq quiz' }

  if (quiz.groupId) {
    const membership = await prisma.teacherStudent.findFirst({
      where: { studentId, groupId: quiz.groupId, holat: 'faol' },
      select: { id: true },
    })
    if (membership) return { bor: true, turi: 'group', sabab: "Guruh a'zosi" }
  }

  const teacherStudent = await prisma.teacherStudent.findFirst({
    where: { studentId, teacherId: quiz.teacherId, holat: 'faol' },
    select: { id: true },
  })
  if (teacherStudent) return { bor: true, turi: 'student', sabab: 'Ustozning talabasi' }

  if (quiz.accessCode && kirishToken) {
    try {
      const access = ustozKirishTokeniniOqi(kirishToken)
      if (
        access.quizId === quiz.id &&
        access.userId === studentId &&
        access.codeHash === ustozQuizKodHashi(quiz.accessCode)
      ) {
        return { bor: true, turi: 'code', sabab: 'Kirish kodi', codeHash: access.codeHash }
      }
    } catch {
      // Eskirgan yoki buzilgan cookie ruxsat emas; foydalanuvchi kodni qayta kiritadi.
    }
  }

  return { bor: false }
}

async function tokenRuxsatiHaliBormi(quiz, studentId, attempt) {
  if (attempt.accessKind === 'teacher') return quiz.teacherId === studentId
  if (attempt.accessKind === 'public') return quiz.isPublic && !quiz.accessCode
  if (attempt.accessKind === 'code') {
    return Boolean(quiz.accessCode && attempt.codeHash === ustozQuizKodHashi(quiz.accessCode))
  }
  if (attempt.accessKind === 'group' && quiz.groupId) {
    return Boolean(await prisma.teacherStudent.findFirst({
      where: { studentId, groupId: quiz.groupId, holat: 'faol' },
      select: { id: true },
    }))
  }
  if (attempt.accessKind === 'student') {
    return Boolean(await prisma.teacherStudent.findFirst({
      where: { studentId, teacherId: quiz.teacherId, holat: 'faol' },
      select: { id: true },
    }))
  }
  return false
}

// Talabaga javobsiz, kerak bo'lsa aralashtirilgan quizni beradi.
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: quizId } = await params
    const studentId = session.user.id
    const quiz = await prisma.teacherQuiz.findUnique({
      where: { id: quizId },
      include: {
        teacher: { select: { id: true, fullName: true, username: true, avatar: true, university: true } },
        group: { select: { name: true } },
        questions: { orderBy: { order: 'asc' } },
      },
    })

    if (!quiz) return NextResponse.json({ error: 'Quiz topilmadi' }, { status: 404 })
    if (quiz.isDraft) return NextResponse.json({ error: "Quiz hali e'lon qilinmagan" }, { status: 403 })
    if (quiz.deadline && quiz.deadline < new Date()) {
      return NextResponse.json({ error: 'Quiz topshirish muddati tugagan' }, { status: 403 })
    }

    const cookie = request.cookies.get(ustozQuizCookieNomi(quizId))?.value || null
    const access = await kirishRuxsatiniTop(quiz, studentId, cookie)
    if (!access.bor) {
      return NextResponse.json({
        error: "Sizda bu quizga kirish huquqi yo'q",
        needCode: Boolean(quiz.accessCode),
        quizTitle: quiz.title,
      }, { status: 403 })
    }

    const userAttempts = await prisma.teacherQuizAttempt.findMany({
      where: { quizId, studentId },
      orderBy: { completedAt: 'desc' },
      select: { id: true, score: true, maxScore: true, percentage: true, timeSpent: true, completedAt: true },
    })
    const maxAttemptsReached = quiz.maxAttempts !== 99 && userAttempts.length >= quiz.maxAttempts
    const meta = ustozQuizMeta(quiz.description)
    const orderedQuestions = quiz.shuffleQuestions ? aralashtir(quiz.questions) : quiz.questions
    const optionMaps = {}

    const questions = orderedQuestions.map((question) => {
      const options = ustozQuizVariantlari(question.options)
      const optionMap = indekslarniAralashtir(options.length, meta.shuffleOptions)
      optionMaps[question.id] = optionMap
      return {
        id: question.id,
        questionText: question.questionText,
        options: optionMap.map((originalIndex) => options[originalIndex]),
        points: question.points,
      }
    })
    const questionIds = questions.map((question) => question.id)
    const attemptToken = ustozQuizUrinishTokeniniYarat({
      quizId,
      userId: studentId,
      questionIds,
      optionMaps,
      accessKind: access.turi,
      codeHash: access.codeHash || null,
    })

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: meta.originalDescription,
        timeLimit: quiz.timeLimit,
        maxAttempts: quiz.maxAttempts,
        passingScore: quiz.passingScore,
        showResults: quiz.showResults,
        showCorrectAnswers: meta.showCorrectAnswers,
        allowReview: meta.allowReview,
        teacher: quiz.teacher,
        group: quiz.group,
        questions,
        totalQuestions: questions.length,
        maxScore: orderedQuestions.reduce((sum, question) => sum + question.points, 0),
        attemptToken,
      },
      userAttempts,
      maxAttemptsReached,
      canAttempt: !maxAttemptsReached,
      accessReason: access.sabab,
    })
  } catch (error) {
    console.error('[Ustoz Quiz GET]', error)
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 })
  }
}
// Server tokenidagi variant xaritasi bilan baholaydi va ruxsatni qayta tekshiradi.
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: quizId } = await params
    const studentId = session.user.id
    const body = await request.json().catch(() => null)
    if (!body || !Array.isArray(body.answers)) throw sorovXatosi("Javoblar noto'g'ri shaklda")

    let token
    try {
      token = ustozQuizUrinishTokeniniOqi(body.attemptToken)
    } catch (error) {
      throw sorovXatosi(error.message)
    }
    if (token.quizId !== quizId || token.userId !== studentId) {
      throw sorovXatosi("Quiz urinish boshqa foydalanuvchi yoki quizga tegishli", 403)
    }

    const quiz = await prisma.teacherQuiz.findUnique({
      where: { id: quizId },
      include: { questions: { orderBy: { order: 'asc' } } },
    })
    if (!quiz) throw sorovXatosi('Quiz topilmadi', 404)
    if (quiz.isDraft) throw sorovXatosi("Quiz hali e'lon qilinmagan", 403)
    if (quiz.deadline && quiz.deadline < new Date()) {
      throw sorovXatosi('Quiz topshirish muddati tugagan', 403)
    }
    if (!(await tokenRuxsatiHaliBormi(quiz, studentId, token))) {
      throw sorovXatosi("Sizda bu quizga kirish huquqi qolmagan", 403)
    }

    const currentIds = new Set(quiz.questions.map((question) => question.id))
    if (currentIds.size !== token.questionIds.length || token.questionIds.some((id) => !currentIds.has(id))) {
      throw sorovXatosi("Quiz savollari o'zgargan, testni yangidan boshlang", 409)
    }

    let baho
    try {
      baho = ustozQuizJavoblariniBahola(
        quiz.questions,
        body.answers,
        token.questionIds,
        token.optionMaps,
      )
    } catch (error) {
      throw sorovXatosi(error.message)
    }

    const timeRaw = Number(body.timeSpent)
    const timeSpent = Number.isFinite(timeRaw) && timeRaw >= 0
      ? Math.min(Math.floor(timeRaw), 24 * 60 * 60)
      : 0

    let attempt
    let alreadySubmitted = false
    try {
      attempt = await prisma.$transaction(async (tx) => {
        const existingAttempts = await tx.teacherQuizAttempt.count({ where: { quizId, studentId } })
        if (quiz.maxAttempts !== 99 && existingAttempts >= quiz.maxAttempts) {
          throw sorovXatosi('Maksimal urinishlar soniga yetdingiz')
        }
        return await tx.teacherQuizAttempt.create({
          data: {
            attemptId: `ustoz:${token.id}`,
            quizId,
            studentId,
            answers: baho.normalizedAnswers,
            score: baho.score,
            maxScore: baho.maxScore,
            percentage: baho.percentage,
            timeSpent,
          },
        })
      }, { isolationLevel: 'Serializable' })
    } catch (error) {
      if (error?.code !== 'P2002') throw error
      attempt = await prisma.teacherQuizAttempt.findUnique({
        where: { attemptId: `ustoz:${token.id}` },
      })
      if (!attempt || attempt.studentId !== studentId) throw error
      alreadySubmitted = true
    }

    if (!alreadySubmitted) {
      const stats = await prisma.teacherQuizAttempt.aggregate({
        where: { quizId },
        _count: { _all: true },
        _avg: { percentage: true },
      })
      await prisma.teacherQuiz.update({
        where: { id: quizId },
        data: { totalAttempts: stats._count._all, avgScore: stats._avg.percentage || 0 },
      })
    }

    let xpEarned = 0
    let missionResult = null
    try {
      const saved = await saveQuizResult(studentId, {
        attemptId: `ustoz:${attempt.id}`,
        quizName: `Ustoz quizi: ${quiz.title}`,
        score: attempt.score,
        totalQuestions: attempt.maxScore,
        timeSpent: attempt.timeSpent,
      })
      xpEarned = saved.xpGained
      missionResult = saved.missionResult
    } catch (error) {
      console.error("[Ustoz Quiz] Umumiy statistikaga yozib bo'lmadi:", error.message)
    }

    const meta = ustozQuizMeta(quiz.description)
    const passed = baho.percentage >= (quiz.passingScore || 60)
    const canReview = quiz.showResults && meta.allowReview
    const reviewResults = canReview
      ? baho.results.map((result) => meta.showCorrectAnswers
        ? result
        : {
            questionId: result.questionId,
            questionText: result.questionText,
            options: result.options,
            userAnswer: result.userAnswer,
            isCorrect: result.isCorrect,
            points: result.points,
            maxPoints: result.maxPoints,
          })
      : null

    return NextResponse.json({
      success: true,
      attempt: quiz.showResults
        ? { id: attempt.id, score: attempt.score, maxScore: attempt.maxScore, percentage: attempt.percentage, completedAt: attempt.completedAt }
        : { id: attempt.id, completedAt: attempt.completedAt },
      results: reviewResults,
      score: quiz.showResults ? attempt.score : null,
      maxScore: quiz.showResults ? attempt.maxScore : null,
      percentage: quiz.showResults ? attempt.percentage : null,
      passed: quiz.showResults ? passed : null,
      showResults: quiz.showResults,
      xpEarned,
      alreadySubmitted,
      missionCompleted: Boolean(missionResult?.success),
      missionMessage: missionResult?.message ?? null,
      message: quiz.showResults
        ? passed
          ? `Tabriklaymiz! ${attempt.percentage.toFixed(1)}% to'pladingiz va ${xpEarned} XP oldingiz`
          : `Natija: ${attempt.percentage.toFixed(1)}%. O'tish balidan past, lekin ${xpEarned} XP oldingiz`
        : `Javoblaringiz saqlandi${xpEarned > 0 ? ` va ${xpEarned} XP berildi` : ''}`,
    })
  } catch (error) {
    console.error('[Ustoz Quiz POST]', error)
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 })
  }
}
