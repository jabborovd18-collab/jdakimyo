// app/api/oquv/ustoz-quiz/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { saveQuizResult } from '@/lib/quiz-submit'

// GET - Quiz ma'lumotlarini olish (talaba uchun)
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Next 16 da `params` — Promise. Avval `params.id` await'siz o'qilardi
    // va undefined qaytarardi, ya'ni findUnique xato bilan tugardi.
    const { id: quizId } = await params
    const studentId = session.user.id

    // Quizni topish
    const quiz = await prisma.teacherQuiz.findUnique({
      where: { id: quizId },
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            university: true
          }
        },
        group: {
          select: { name: true }
        },
        questions: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { attempts: true }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz topilmadi' }, { status: 404 })
    }

    if (quiz.isDraft) {
      return NextResponse.json({ error: 'Quiz hali e\'lon qilinmagan' }, { status: 403 })
    }

    // Kirish ruxsati tekshirish
    let hasAccess = false
    let accessReason = ''

    // 1. Ochiq quiz
    if (quiz.isPublic && !quiz.accessCode) {
      hasAccess = true
      accessReason = 'Ochiq quiz'
    }

    // 2. Talabaning guruhi orqali
    if (!hasAccess && quiz.groupId) {
      const membership = await prisma.teacherStudent.findFirst({
        where: {
          studentId,
          groupId: quiz.groupId
        }
      })
      if (membership) {
        hasAccess = true
        accessReason = 'Guruh a\'zosi'
      }
    }

    // 3. Ustozning talabasi (umumiy)
    if (!hasAccess) {
      const teacherStudent = await prisma.teacherStudent.findFirst({
        where: {
          studentId,
          teacherId: quiz.teacherId
        }
      })
      if (teacherStudent) {
        hasAccess = true
        accessReason = 'Ustozning talabasi'
      }
    }

    if (!hasAccess) {
      return NextResponse.json({
        error: 'Sizda bu quizga kirish huquqi yo\'q',
        needCode: !!quiz.accessCode,
        quizTitle: quiz.title
      }, { status: 403 })
    }

    // Talabaning urinishlarini olish
    const userAttempts = await prisma.teacherQuizAttempt.findMany({
      where: {
        quizId,
        studentId
      },
      orderBy: { completedAt: 'desc' }
    })

    const maxAttemptsReached = quiz.maxAttempts !== 99 && userAttempts.length >= quiz.maxAttempts

    // Savollarni aralashtirish (agar sozlangan bo'lsa)
    let questions = quiz.questions
    if (quiz.shuffleQuestions) {
      questions = [...questions].sort(() => Math.random() - 0.5)
    }

    // Variantlarni ham aralashtirish
    questions = questions.map(q => {
      if (quiz.shuffleOptions) {
        const indexedOptions = q.options.map((opt, idx) => ({ opt, idx }))
        const shuffled = indexedOptions.sort(() => Math.random() - 0.5)
        const newOptions = shuffled.map(x => x.opt)
        const newCorrectAnswer = shuffled.findIndex(x => x.idx === q.correctAnswer)
        return { ...q, options: newOptions, correctAnswer: newCorrectAnswer }
      }
      return q
    })

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        maxAttempts: quiz.maxAttempts,
        passingScore: quiz.passingScore,
        showResults: quiz.showResults,
        showCorrectAnswers: quiz.showCorrectAnswers,
        allowReview: quiz.allowReview,
        teacher: quiz.teacher,
        group: quiz.group,
        questions: questions.map(q => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options,
          points: q.points,
          // To'g'ri javobni yashirish (natijada ochiladi)
          correctAnswer: null
        })),
        totalQuestions: questions.length,
        maxScore: questions.reduce((sum, q) => sum + q.points, 0)
      },
      userAttempts,
      maxAttemptsReached,
      canAttempt: !maxAttemptsReached,
      accessReason
    })
  } catch (error) {
    console.error('[Ustoz Quiz GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Quiz natijasini saqlash
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Next 16 da `params` — Promise. Avval `params.id` await'siz o'qilardi
    // va undefined qaytarardi, ya'ni findUnique xato bilan tugardi.
    const { id: quizId } = await params
    const studentId = session.user.id
    const { answers, timeSpent } = await request.json()

    // Quizni to'liq ma'lumotlar bilan olish (to'g'ri javoblar bilan)
    const quiz = await prisma.teacherQuiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz topilmadi' }, { status: 404 })
    }

    // Urinishlar sonini tekshirish
    const existingAttempts = await prisma.teacherQuizAttempt.count({
      where: { quizId, studentId }
    })

    if (quiz.maxAttempts !== 99 && existingAttempts >= quiz.maxAttempts) {
      return NextResponse.json(
        { error: 'Maksimal urinishlar soniga yetdingiz' },
        { status: 400 }
      )
    }

    // Ballarni hisoblash
    let score = 0
    let maxScore = 0
    const results = []

    for (const question of quiz.questions) {
      maxScore += question.points
      const userAnswer = answers.find(a => a.questionId === question.id)
      const isCorrect = userAnswer?.selected === question.correctAnswer

      if (isCorrect) {
        score += question.points
      }

      results.push({
        questionId: question.id,
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: userAnswer?.selected ?? -1,
        isCorrect,
        points: isCorrect ? question.points : 0,
        maxPoints: question.points,
        explanation: question.explanation
      })
    }

    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
    const passed = percentage >= (quiz.passingScore || 60)

    // Urinishni saqlash
    const attempt = await prisma.teacherQuizAttempt.create({
      data: {
        quizId,
        studentId,
        answers,
        score,
        maxScore,
        percentage,
        timeSpent: timeSpent || 0
      }
    })

    // Quiz statistikasini yangilash
    const allAttempts = await prisma.teacherQuizAttempt.findMany({
      where: { quizId },
      select: { percentage: true }
    })
    const avgScore = allAttempts.reduce((sum, a) => sum + a.percentage, 0) / allAttempts.length

    await prisma.teacherQuiz.update({
      where: { id: quizId },
      data: {
        totalAttempts: allAttempts.length,
        avgScore
      }
    })

    // Natijani UMUMIY statistikaga ham yozamiz.
    //
    // Avval bu yerda faqat XP berilardi (score × 2, ya'ni savol soniga bog'liq)
    // va faqat o'tgan bo'lsa. Natijada:
    //   • ustoz quizi profildagi "Quiz statistika" da ko'rinmasdi
    //   • kunlik missiya bajarilmasdi
    //   • 59% olgan talaba umuman XP olmasdi, saytda esa 29 XP olardi
    //
    // Endi sayt va mobil bilan bir xil mantiq ishlatiladi (lib/quiz-submit.js):
    // XP foizga proporsional (0–50) va har doim beriladi.
    let xpEarned = 0
    let missionResult = null

    try {
      const saved = await saveQuizResult(studentId, {
        quizName: `Ustoz quizi: ${quiz.title}`,
        score,
        totalQuestions: maxScore,
        timeSpent: timeSpent || 0,
      })
      xpEarned = saved.xpGained
      missionResult = saved.missionResult
    } catch (error) {
      // Statistika yozilmasa ham urinish saqlangan — quizni buzmaymiz
      console.error('[Ustoz Quiz] Umumiy statistikaga yozib bo\'lmadi:', error.message)
    }

    return NextResponse.json({
      success: true,
      attempt,
      results,
      score,
      maxScore,
      percentage,
      passed,
      xpEarned,
      missionCompleted: Boolean(missionResult?.success),
      missionMessage: missionResult?.message ?? null,
      message: passed
        ? `🎉 Tabriklaymiz! ${percentage.toFixed(1)}% to'pladingiz va ${xpEarned} XP oldingiz`
        : `Natija: ${percentage.toFixed(1)}%. O'tish balidan (${quiz.passingScore || 60}%) past, lekin ${xpEarned} XP oldingiz`
    })
  } catch (error) {
    console.error('[Ustoz Quiz POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}