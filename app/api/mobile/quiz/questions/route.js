// app/api/mobile/quiz/questions/route.js
// Tanlangan kategoriyadan tasodifiy savollar.
//
// Eslatma: javob (correct) va izoh (explanation) ham yuboriladi — ilova
// natijani o'zi hisoblaydi va darhol izoh ko'rsatadi. Bu saytdagi bilan
// bir xil model (saytda ham savollar bank sifatida brauzerga yuklanadi)
// va internetsiz ishlash imkonini beradi.
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { findQuizCategory } from '@/lib/quiz-categories'

export { OPTIONS } from '@/lib/cors'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

export async function GET(request) {
  try {
    const auth = await getAuthUser(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('category') || 'aralash'

    const category = findQuizCategory(slug)
    if (!category) {
      return NextResponse.json({ error: 'Bunday kategoriya yo\'q' }, { status: 400 })
    }

    const requested = parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10)
    const limit = Math.min(
      Math.max(Number.isFinite(requested) ? requested : DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    )

    const where = {
      isActive: true,
      ...(slug === 'aralash' ? {} : { category: slug }),
    }

    // Tasodifiy tanlash: avval faqat id'larni olamiz (yengil), aralashtiramiz,
    // keyin kerakligini to'liq o'qiymiz. Bu ORDER BY RANDOM() ga qaraganda
    // bashorat qilinadigan va Prisma bilan portativ.
    const ids = await prisma.quizQuestion.findMany({ where, select: { id: true } })

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'Bu kategoriyada savol topilmadi' },
        { status: 404 }
      )
    }

    // Fisher-Yates
    const pool = ids.map((row) => row.id)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    const chosen = pool.slice(0, limit)

    const rows = await prisma.quizQuestion.findMany({
      where: { id: { in: chosen } },
      select: {
        id: true,
        category: true,
        question: true,
        options: true,
        correct: true,
        explanation: true,
        difficulty: true,
      },
    })

    // findMany tartibi aralashtirilgan tartibga mos kelmaydi — qayta tiklaymiz
    const byId = new Map(rows.map((row) => [row.id, row]))
    const questions = chosen.map((id) => byId.get(id)).filter(Boolean)

    return NextResponse.json({
      success: true,
      category: { slug: category.slug, name: category.name, icon: category.icon },
      total: ids.length,
      questions,
    })
  } catch (error) {
    console.error('[Mobile quiz questions]', error)
    return NextResponse.json(
      { error: 'Savollarni yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}
