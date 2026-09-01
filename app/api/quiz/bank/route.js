// Sayt quizlari uchun javobsiz savollar to'plami va imzolangan urinish.
// Kimyoning o'zi QuizQuestion jadvalida qoladi; bu yo'l faqat tanlaydi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { findQuizCategory } from '@/lib/quiz-categories'
import { QUIZ_ENG_KOP_SAVOL, QUIZ_SAVOL_SONI, quizSavollariniTanla } from '@/lib/quiz-bank'
import { quizUrinishTokeniniYarat } from '@/lib/quiz-urinish'

async function toplamYarat({ slug, count, previousIds }) {
  const category = findQuizCategory(slug)
  if (!category) {
    return NextResponse.json({ error: "Bunday kategoriya yo'q" }, { status: 400 })
  }
  if (!Number.isInteger(count) || count < 1 || count > QUIZ_ENG_KOP_SAVOL) {
    return NextResponse.json({ error: "Savollar soni noto'g'ri" }, { status: 400 })
  }

  const xavfsizTarix = Array.isArray(previousIds)
    ? previousIds.filter((id) => typeof id === 'string').slice(-100)
    : []

  const bank = await prisma.quizQuestion.findMany({
    where: {
      isActive: true,
      ...(category.slug === 'aralash' ? {} : { category: category.slug }),
    },
    select: {
      id: true,
      question: true,
      options: true,
      difficulty: true,
      category: true,
    },
  })

  const questions = quizSavollariniTanla(bank, category.slug, count, xavfsizTarix)
  const session = await getServerSession(authOptions)
  const attemptToken = quizUrinishTokeniniYarat({
    category: category.slug,
    questionIds: questions.map((question) => question.id),
    userId: session?.user?.id || null,
  })

  return NextResponse.json({
    success: true,
    category: { slug: category.slug, name: category.name, resultName: category.resultName },
    total: questions.length,
    questions,
    attemptToken,
  })
}

// Eski mijozlar buzilmasligi uchun GET ham qoladi, ammo u ham to'g'ri
// javoblarni bermaydi va faqat server tanlagan bitta to'plamni qaytaradi.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    return await toplamYarat({
      slug: searchParams.get('category'),
      count: Number(searchParams.get('count') || QUIZ_SAVOL_SONI),
      previousIds: [],
    })
  } catch (error) {
    console.error('[Quiz bank GET]', error)
    return NextResponse.json({ error: 'Savollarni yuklashda xatolik: ' + error.message }, { status: 500 })
  }
}
export async function POST(request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 })

    return await toplamYarat({
      slug: body.category,
      count: Number(body.count || QUIZ_SAVOL_SONI),
      previousIds: body.previousIds,
    })
  } catch (error) {
    console.error('[Quiz bank POST]', error)
    return NextResponse.json({ error: 'Savollarni yuklashda xatolik: ' + error.message }, { status: 500 })
  }
}
