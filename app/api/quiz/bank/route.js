// app/api/quiz/bank/route.js
//
// Sayt quizlari uchun savollar bazasi.
//
// Avval savollar `data.js` fayllarida qotirilgan edi va admin paneldagi
// o'zgarishlar saytga umuman ta'sir qilmasdi. Endi sayt ham, mobil ilova ham
// bitta manbadan — QuizQuestion jadvalidan o'qiydi.
//
// Ochiq endpoint (auth talab qilinmaydi), chunki mehmonlar ham quiz yecha
// oladi. Savollar avval ham JS bundle ichida brauzerga yuborilardi, shuning
// uchun bu maxfiylik jihatidan holatni yomonlashtirmaydi.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { findQuizCategory } from '@/lib/quiz-categories'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('category')

    const category = findQuizCategory(slug)
    if (!category) {
      return NextResponse.json(
        { error: 'Bunday kategoriya yo\'q' },
        { status: 400 }
      )
    }

    const questions = await prisma.quizQuestion.findMany({
      where: {
        isActive: true,
        // "aralash" bazada kategoriya emas — barcha savollardan iborat
        ...(category.slug === 'aralash' ? {} : { category: category.slug }),
      },
      select: {
        id: true,
        question: true,
        options: true,
        correct: true,
        explanation: true,
        difficulty: true,
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      category: { slug: category.slug, name: category.name, resultName: category.resultName },
      total: questions.length,
      questions,
    })
  } catch (error) {
    console.error('[Quiz bank]', error)
    return NextResponse.json(
      { error: 'Savollarni yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}
