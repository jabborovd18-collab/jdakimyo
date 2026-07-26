// app/api/mobile/quiz/categories/route.js
// Ilovadagi quiz bo'limi uchun kategoriyalar ro'yxati va har birida
// nechta savol borligi.
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { QUIZ_CATEGORIES } from '@/lib/quiz-categories'

export { OPTIONS } from '@/lib/cors'

export async function GET(request) {
  try {
    const auth = await getAuthUser(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const counts = await prisma.quizQuestion.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { _all: true },
    })

    const countBySlug = Object.fromEntries(
      counts.map((row) => [row.category, row._count._all]),
    )

    const total = counts.reduce((sum, row) => sum + row._count._all, 0)

    // Foydalanuvchining har bir kategoriya bo'yicha eng yaxshi natijasi
    const results = await prisma.quizResult.findMany({
      where: { userId: auth.id },
      select: { quizName: true, percentage: true },
    })

    const bestByName = {}
    for (const row of results) {
      const current = bestByName[row.quizName]
      if (current === undefined || row.percentage > current) {
        bestByName[row.quizName] = row.percentage
      }
    }

    const categories = QUIZ_CATEGORIES.map((category) => ({
      ...category,
      questionCount:
        category.slug === 'aralash' ? total : countBySlug[category.slug] || 0,
      // Eng yaxshi natija saytda yechilganini ham qamrab olishi uchun
      // resultName bo'yicha qidiramiz (lib/quiz-categories.js)
      bestPercentage: bestByName[category.resultName] ?? null,
    })).filter((category) => category.questionCount > 0)

    return NextResponse.json({ success: true, categories, total })
  } catch (error) {
    console.error('[Mobile quiz categories]', error)
    return NextResponse.json(
      { error: 'Kategoriyalarni yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}
