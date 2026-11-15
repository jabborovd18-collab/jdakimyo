// app/api/ustoz/yopiq-quiz/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { saveQuizResult } from '@/lib/quiz-submit'
import { ustozPaneliOchiqmi } from '@/lib/roles'
import { bahoTekshir } from '@/lib/ustoz-quiz'
import { createNotification } from '@/lib/bildirishnoma'

// GET - Barcha yopiq quizlar + tekshirish kerak bo'lgan topshiriqlar
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
    const view = searchParams.get('view') || 'list' // list | drafts | pending | graded
    const quizId = searchParams.get('quizId')

    // Bitta quiz topshiriqlarini olish (tekshirish uchun)
    if (quizId) {
      const quiz = await prisma.closedQuiz.findFirst({
        where: { id: quizId, teacherId: session.user.id },
        include: {
          group: { select: { name: true } },
          questions: { orderBy: { order: 'asc' } },
          submissions: {
            include: {
              student: {
                select: {
                  id: true, fullName: true, username: true, avatar: true, userId: true
                }
              }
            },
            orderBy: { submittedAt: 'desc' }
          }
        }
      })

      if (!quiz) {
        return NextResponse.json({ error: 'Quiz topilmadi' }, { status: 404 })
      }

      return NextResponse.json({ success: true, quiz })
    }

    // Barcha quizlar ro'yxati
    const where = { teacherId: session.user.id }

    if (view === 'drafts') where.isDraft = true
    else where.isDraft = false

    const quizzes = await prisma.closedQuiz.findMany({
      where,
      include: {
        group: { select: { name: true, color: true } },
        _count: { select: { questions: true, submissions: true } },
        submissions: {
          where: { status: 'pending' },
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const groups = await prisma.teacherGroup.findMany({
      where: { teacherId: session.user.id },
      select: { id: true, name: true, color: true }
    })

    // Umumiy statistika
    const [pendingCount, gradedCount] = await Promise.all([
      prisma.closedQuizSubmission.count({
        where: {
          quiz: { teacherId: session.user.id },
          status: 'pending'
        }
      }),
      prisma.closedQuizSubmission.count({
        where: {
          quiz: { teacherId: session.user.id },
          status: 'graded'
        }
      })
    ])

    return NextResponse.json({
      success: true,
      quizzes: quizzes.map(q => ({
        ...q,
        pendingCount: q.submissions.length,
        submissions: undefined
      })),
      groups,
      stats: {
        total: quizzes.length,
        pending: pendingCount,
        graded: gradedCount
      }
    })
  } catch (error) {
    console.error('[Yopiq Quiz GET]', error)
    return NextResponse.json({ error: 'Yopiq quizlarni yuklashda xatolik yuz berdi' }, { status: 500 })
  }
}

// POST - Yangi yopiq quiz yaratish
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    // Validatsiya
    if (!data.title || data.title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Quiz sarlavhasi kamida 3 ta harfdan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    if (!data.questions || data.questions.length < 1) {
      return NextResponse.json(
        { error: 'Kamida 1 ta savol bo\'lishi kerak' },
        { status: 400 }
      )
    }

    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i]
      if (!q.questionText || q.questionText.trim().length < 5) {
        return NextResponse.json(
          { error: `${i + 1}-savol kamida 5 ta harfdan iborat bo'lishi kerak` },
          { status: 400 }
        )
      }
    }

    if (data.groupId) {
      const group = await prisma.teacherGroup.findFirst({
        where: { id: data.groupId, teacherId: session.user.id }
      })
      if (!group) {
        return NextResponse.json(
          { error: 'Guruh topilmadi' },
          { status: 404 }
        )
      }
    }

    // Quiz yaratish
    const quiz = await prisma.$transaction(async (tx) => {
      const maxScore = data.questions.reduce((sum, q) => sum + (parseInt(q.maxPoints) || 10), 0)

      const newQuiz = await tx.closedQuiz.create({
        data: {
          teacherId: session.user.id,
          groupId: data.groupId || null,
          title: data.title.trim(),
          description: data.description?.trim() || null,
          instructions: data.instructions?.trim() || null,
          timeLimit: data.timeLimit ? parseInt(data.timeLimit) : null,
          maxAttempts: parseInt(data.maxAttempts) || 1,
          maxScore,
          isDraft: data.isDraft || false,
          deadline: data.deadline ? new Date(data.deadline) : null
        }
      })

      const questions = data.questions.map((q, idx) => ({
        quizId: newQuiz.id,
        questionText: q.questionText.trim(),
        maxPoints: parseInt(q.maxPoints) || 10,
        hint: q.hint?.trim() || null,
        order: idx
      }))

      await tx.closedQuizQuestion.createMany({ data: questions })

      return newQuiz
    })

    return NextResponse.json({
      success: true,
      quiz,
      message: `✓ "${quiz.title}" yopiq quiz yaratildi (${data.questions.length} ta savol)`
    })
  } catch (error) {
    console.error('[Yopiq Quiz POST]', error)
    return NextResponse.json({ error: 'Yopiq quiz yaratishda xatolik yuz berdi' }, { status: 500 })
  }
}

// PUT - Topshiriqni tekshirish (baho berish)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    if (!data.submissionId) {
      return NextResponse.json({ error: 'submissionId kerak' }, { status: 400 })
    }

    // Topshiriq va quiz tekshiruv
    const submission = await prisma.closedQuizSubmission.findFirst({
      where: {
        id: data.submissionId,
        quiz: { teacherId: session.user.id }
      },
      include: {
        student: { select: { fullName: true, username: true } },
        quiz: { select: { title: true, maxScore: true } }
      }
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Topshiriq topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    const baho = bahoTekshir(data.score, submission.quiz.maxScore)
    if (!baho.valid) {
      return NextResponse.json(
        { error: baho.error },
        { status: 400 }
      )
    }
    const score = baho.score

    // Yangilash — status doim 'graded' bo'ladi
    const updated = await prisma.closedQuizSubmission.update({
      where: { id: data.submissionId },
      data: {
        status: 'graded',
        score,
        feedback: data.feedback?.trim() || null,
        gradedBy: session.user.id,
        gradedAt: new Date()
      }
    })

    // Natijani umumiy statistikaga yozish va XP berish (faqat 1-marta baholashda)
    const alreadyGraded = submission.status === 'graded'
    let xpEarned = 0
    let missionResult = null

    if (!alreadyGraded) {
      try {
        const saved = await saveQuizResult(submission.studentId, {
          attemptId: `yopiq:${submission.id}`,
          quizName: `Yopiq quiz: ${submission.quiz.title}`,
          score,
          totalQuestions: submission.quiz.maxScore,
          timeSpent: submission.timeSpent || 0,
        })
        xpEarned = saved.xpGained
        missionResult = saved.missionResult
      } catch (error) {
        console.error('[Yopiq Quiz] Statistikaga yozib bo\'lmadi:', error.message)
      }
    }

    createNotification({
      userId: submission.studentId,
      title: 'Yozma ishingiz baholandi',
      message: `"${submission.quiz.title}" yozma ishingiz ${score}/${submission.quiz.maxScore} ball bilan baholandi.${data.feedback?.trim() ? ` Ustoz izohi: ${data.feedback.trim()}` : ''}`,
      type: 'system',
      icon: '✅',
      link: `/testlar/yozma/${submission.quizId}`,
      sentBy: session.user.id,
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      submission: updated,
      message: `✓ ${submission.student.fullName || submission.student.username} ga ${score}/${submission.quiz.maxScore} ball berildi`,
      xpEarned,
      alreadyGraded,
      missionCompleted: Boolean(missionResult?.success),
    })
  } catch (error) {
    console.error('[Yopiq Quiz PUT]', error)
    return NextResponse.json({ error: 'Baholashda xatolik yuz berdi' }, { status: 500 })
  }
}

// DELETE - Quizni o'chirish
export async function DELETE(request) {
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Quiz ID kerak' }, { status: 400 })
    }

    const existing = await prisma.closedQuiz.findFirst({
      where: { id, teacherId: session.user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Quiz topilmadi' }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.closedQuizSubmission.deleteMany({ where: { quizId: id } }),
      prisma.closedQuiz.delete({ where: { id } })
    ])

    return NextResponse.json({
      success: true,
      message: `✓ "${existing.title}" quiz o'chirildi`
    })
  } catch (error) {
    console.error('[Yopiq Quiz DELETE]', error)
    return NextResponse.json({ error: 'Quizni o\'chirishda xatolik yuz berdi' }, { status: 500 })
  }
}
