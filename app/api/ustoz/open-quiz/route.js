// app/api/ustoz/open-quiz/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

// GET - O'qituvchining barcha quizlari
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
    const groupId = searchParams.get('groupId') || ''
    const search = searchParams.get('search') || ''

    const where = { teacherId: session.user.id }

    if (groupId && groupId !== 'all') where.groupId = groupId
    if (search) {
      where.title = { contains: search, mode: 'insensitive' }
    }

    const quizzes = await prisma.teacherQuiz.findMany({
      where,
      include: {
        group: { select: { name: true, color: true } },
        _count: { select: { questions: true, attempts: true } },
        questions: {
          select: {
            id: true,
            questionText: true,
            correctAnswer: true,
            explanation: true,
            points: true,
            options: true,
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const groups = await prisma.teacherGroup.findMany({
      where: { teacherId: session.user.id },
      select: { id: true, name: true, color: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      quizzes,
      groups,
      total: quizzes.length
    })
  } catch (error) {
    console.error('[Open Quiz GET]', error)
    return NextResponse.json({ error: 'Testlarni yuklashda xatolik yuz berdi' }, { status: 500 })
  }
}

// POST - Yangi quiz yaratish
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

    // ═══════════════════════════════════════════
    // VALIDATSIYA
    // ═══════════════════════════════════════════
    if (!data.title || data.title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Quiz sarlavhasi kamida 3 ta harfdan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    if (!data.questions || !Array.isArray(data.questions) || data.questions.length < 1) {
      return NextResponse.json(
        { error: 'Kamida 1 ta savol bo\'lishi kerak' },
        { status: 400 }
      )
    }

    // Har bir savolni tekshirish
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i]
      const questionText = q.text || q.questionText || ''
      if (!questionText || questionText.trim().length < 3) {
        return NextResponse.json(
          { error: `${i + 1}-savol matni kamida 3 ta harfdan iborat bo'lishi kerak` },
          { status: 400 }
        )
      }

      if (q.type !== 'fill') {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
          return NextResponse.json(
            { error: `${i + 1}-savolda kamida 2 ta variant bo'lishi kerak` },
            { status: 400 }
          )
        }

        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j] || String(q.options[j]).trim().length === 0) {
            return NextResponse.json(
              { error: `${i + 1}-savol ${j + 1}-varianti bo'sh` },
              { status: 400 }
            )
          }
        }

        let correctAnswer = q.correctAnswer
        if (correctAnswer === undefined || correctAnswer === null) {
          if (Array.isArray(q.correctAnswers) && q.correctAnswers.length > 0) {
            correctAnswer = q.correctAnswers[0]
          }
        }

        if (
          correctAnswer === undefined ||
          correctAnswer === null ||
          correctAnswer < 0 ||
          correctAnswer >= q.options.length
        ) {
          return NextResponse.json(
            { error: `${i + 1}-savolda to'g'ri javobni belgilang` },
            { status: 400 }
          )
        }
      }
    }

    // Guruh tekshiruv
    if (data.groupId) {
      const group = await prisma.teacherGroup.findFirst({
        where: { id: data.groupId, teacherId: session.user.id }
      })
      if (!group) {
        return NextResponse.json(
          { error: 'Guruh topilmadi yoki sizga tegishli emas' },
          { status: 404 }
        )
      }
    }

    // ═══════════════════════════════════════════
    // QUIZ YARATISH (transaction bilan)
    // ═══════════════════════════════════════════
    const quiz = await prisma.$transaction(async (tx) => {
      const extendedMeta = {
        originalDescription: data.description || '',
        category: data.category || 'general',
        difficulty: data.difficulty || 'medium',
        tags: data.tags || [],
        references: data.references || [],
        shuffleOptions: data.shuffleOptions !== false,
        showCorrectAnswers: data.showCorrectAnswers !== false,
        allowReview: data.allowReview !== false
      }

      const newQuiz = await tx.teacherQuiz.create({
        data: {
          teacherId: session.user.id,
          groupId: data.groupId || null,
          title: data.title.trim(),
          description: JSON.stringify(extendedMeta),
          timeLimit: data.timeLimit ? parseInt(data.timeLimit) : null,
          isPublic: data.isPublic || false,
          accessCode: data.accessCode?.trim() || null,
          shuffleQuestions: data.shuffleQuestions !== false,
          showResults: data.showResults !== false,
          isDraft: data.isDraft === true,
          maxAttempts: parseInt(data.maxAttempts) || 1,
          passingScore: parseInt(data.passingScore) || 60,
          deadline: data.deadline ? new Date(data.deadline) : null,
        }
      })

      const questionsData = data.questions.map((q, idx) => {
        const questionText = (q.text || q.questionText || '').trim()
        let correctAnswer = q.correctAnswer
        if (correctAnswer === undefined || correctAnswer === null) {
          if (Array.isArray(q.correctAnswers) && q.correctAnswers.length > 0) {
            correctAnswer = q.correctAnswers[0]
          } else {
            correctAnswer = 0
          }
        }

        const optionsPayload = {
          texts: q.options || [],
          type: q.type || 'single',
          hints: q.hints || [],
          timePerQuestion: q.timePerQuestion || 60,
          imageUrl: q.imageUrl || ''
        }

        return {
          quizId: newQuiz.id,
          questionText,
          options: optionsPayload,
          correctAnswer: parseInt(correctAnswer) || 0,
          explanation: q.explanation?.trim() || null,
          points: parseInt(q.points) || 1,
          order: idx
        }
      })

      await tx.teacherQuizQuestion.createMany({ data: questionsData })

      return newQuiz
    })

    return NextResponse.json({
      success: true,
      quiz,
      message: `✓ "${quiz.title}" quiz muvaffaqiyatli yaratildi (${data.questions.length} ta savol)`
    })
  } catch (error) {
    console.error('[Open Quiz POST]', error)
    return NextResponse.json({ error: 'Quiz yaratishda xatolik yuz berdi' }, { status: 500 })
  }
}

// PUT - Quizni yangilash
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

    if (!data.id) {
      return NextResponse.json({ error: 'Quiz ID kerak' }, { status: 400 })
    }

    const existing = await prisma.teacherQuiz.findFirst({
      where: { id: data.id, teacherId: session.user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Quiz topilmadi' }, { status: 404 })
    }

    if (data.groupId) {
      const group = await prisma.teacherGroup.findFirst({
        where: { id: data.groupId, teacherId: session.user.id },
        select: { id: true }
      })
      if (!group) {
        return NextResponse.json({ error: 'Guruh topilmadi yoki sizga tegishli emas' }, { status: 404 })
      }
    }

    let nextDescription = existing.description
    if (data.description !== undefined || data.shuffleOptions !== undefined) {
      nextDescription = JSON.stringify({
        originalDescription: data.description?.trim() ?? '',
        shuffleOptions: data.shuffleOptions !== undefined ? Boolean(data.shuffleOptions) : true,
        showCorrectAnswers: data.showCorrectAnswers !== undefined ? Boolean(data.showCorrectAnswers) : true,
        allowReview: data.allowReview !== undefined ? Boolean(data.allowReview) : true,
      })
    }

    const quiz = await prisma.$transaction(async (tx) => {
      const updatedQuiz = await tx.teacherQuiz.update({
        where: { id: data.id },
        data: {
          title: data.title?.trim() || existing.title,
          description: nextDescription,
          groupId: data.isPublic ? null : (data.groupId !== undefined ? (data.groupId || null) : existing.groupId),
          timeLimit: data.timeLimit !== undefined ? (data.timeLimit ? parseInt(data.timeLimit) : null) : existing.timeLimit,
          maxAttempts: data.maxAttempts !== undefined ? (parseInt(data.maxAttempts) || 1) : existing.maxAttempts,
          passingScore: data.passingScore !== undefined ? (parseInt(data.passingScore) || 60) : existing.passingScore,
          deadline: data.deadline !== undefined ? (data.deadline ? new Date(data.deadline) : null) : existing.deadline,
          isPublic: data.isPublic !== undefined ? Boolean(data.isPublic) : existing.isPublic,
          accessCode: data.accessCode !== undefined ? (data.accessCode?.trim() || null) : existing.accessCode,
          shuffleQuestions: data.shuffleQuestions !== undefined ? Boolean(data.shuffleQuestions) : existing.shuffleQuestions,
          showResults: data.showResults !== undefined ? Boolean(data.showResults) : existing.showResults,
        }
      })

      if (Array.isArray(data.questions) && data.questions.length > 0) {
        await tx.teacherQuizQuestion.deleteMany({ where: { quizId: data.id } })
        const questionsData = data.questions.map((q, idx) => {
          const questionText = (q.questionText || q.text || '').trim()
          const rawOptions = Array.isArray(q.options) ? q.options : (q.options?.texts || [])
          const correctAnswer = q.correctAnswer !== undefined ? q.correctAnswer : 0
          return {
            quizId: data.id,
            questionText,
            options: {
              texts: rawOptions.map(o => String(o).trim()),
              type: q.type || 'single',
              hints: q.hints || [],
              timePerQuestion: q.timePerQuestion || 60,
              imageUrl: q.imageUrl || ''
            },
            correctAnswer: parseInt(correctAnswer) || 0,
            explanation: q.explanation?.trim() || null,
            points: parseInt(q.points) || 1,
            order: idx
          }
        })
        await tx.teacherQuizQuestion.createMany({ data: questionsData })
      }

      return updatedQuiz
    })

    return NextResponse.json({
      success: true,
      quiz,
      message: `✓ "${quiz.title}" quiz yangilandi`
    })
  } catch (error) {
    console.error('[Open Quiz PUT]', error)
    return NextResponse.json({ error: 'Quizni yangilashda xatolik yuz berdi' }, { status: 500 })
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

    const existing = await prisma.teacherQuiz.findFirst({
      where: { id, teacherId: session.user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Quiz topilmadi' }, { status: 404 })
    }

    // Urinishlar va quizni bitta tranzaksiyada o'chirish (FK xatosini oldini olish)
    await prisma.$transaction([
      prisma.teacherQuizAttempt.deleteMany({ where: { quizId: id } }),
      prisma.teacherQuiz.delete({ where: { id } })
    ])

    return NextResponse.json({
      success: true,
      message: `✓ "${existing.title}" quiz o'chirildi`
    })
  } catch (error) {
    console.error('[Open Quiz DELETE]', error)
    return NextResponse.json({ error: 'Quizni o\'chirishda xatolik yuz berdi' }, { status: 500 })
  }
}
