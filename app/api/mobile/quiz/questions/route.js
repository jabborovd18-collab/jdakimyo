// Mobil ilova uchun javobsiz savollar va foydalanuvchiga bog'langan urinish.
// Yakuniy ball ilovada emas, submit yo'lida bazadagi javoblar bilan hisoblanadi.
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { findQuizCategory } from '@/lib/quiz-categories'
import { QUIZ_ENG_KOP_SAVOL, QUIZ_SAVOL_SONI, quizSavollariniTanla } from '@/lib/quiz-bank'
import { quizUrinishTokeniniYarat } from '@/lib/quiz-urinish'

export { OPTIONS } from '@/lib/cors'

export async function GET(request) {
  try {
    const auth = await getAuthUser(request)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('category') || 'aralash'
    const category = findQuizCategory(slug)
    if (!category) return NextResponse.json({ error: "Bunday kategoriya yo'q" }, { status: 400 })

    const requested = Number.parseInt(searchParams.get('limit') || String(QUIZ_SAVOL_SONI), 10)
    const limit = Math.min(
      Math.max(Number.isFinite(requested) ? requested : QUIZ_SAVOL_SONI, 1),
      QUIZ_ENG_KOP_SAVOL,
    )

    const bank = await prisma.quizQuestion.findMany({
      where: {
        isActive: true,
        ...(category.slug === 'aralash' ? {} : { category: category.slug }),
      },
      select: {
        id: true,
        category: true,
        question: true,
        options: true,
        difficulty: true,
      },
    })
    const questions = quizSavollariniTanla(bank, category.slug, limit)
    const attemptToken = quizUrinishTokeniniYarat({
      category: category.slug,
      questionIds: questions.map((question) => question.id),
      userId: auth.id,
    })

    return NextResponse.json({
      success: true,
      category: { slug: category.slug, name: category.name, icon: category.icon },
      total: questions.length,
      questions,
      attemptToken,
    })
  } catch (error) {
    console.error('[Mobile quiz questions]', error)
    return NextResponse.json(
      { error: 'Savollarni yuklashda xatolik: ' + error.message },
      { status: 500 },
    )
  }
}
