// app/api/oquv/progress/route.js
//
// O'quv bo'limlari bo'yicha HAQIQIY progress.
//
// Avval sahifa localStorage'dagi 'oquv-progress' kalitini o'qirdi, lekin
// unga hech kim hech qachon yozmasdi — natijada progress doim 0% edi.
// Endi progress talabaning haqiqiy quiz natijalaridan olinadi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { QUIZ_CATEGORIES } from '@/lib/quiz-categories'

// O'quv bo'limi -> quiz kategoriyasi.
// "kimyoviy-boglanish" uchun quiz yo'q, "video-darsliklar" esa quizlarning o'zi.
const BOLIM_QUIZ = {
  nomlanishi: 'nomlanishi',
  klassifikatsiyasi: 'klassifikatsiyasi',
  fazoviy: 'fazoviy',
  izomeriyasi: 'izomeriya',
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Mehmon uchun progress yo'q — sahifa buni ochiq ko'rsatadi
    if (!session?.user?.id) {
      return NextResponse.json({ success: true, signedIn: false, progress: {} })
    }

    const results = await prisma.quizResult.findMany({
      where: { userId: session.user.id },
      select: { quizName: true, percentage: true },
    })

    // Har bir quiz nomi bo'yicha eng yaxshi natija
    const bestByName = {}
    for (const row of results) {
      const current = bestByName[row.quizName]
      if (current === undefined || row.percentage > current) {
        bestByName[row.quizName] = row.percentage
      }
    }

    const resultNameBySlug = Object.fromEntries(
      QUIZ_CATEGORIES.map((c) => [c.slug, c.resultName]),
    )

    const progress = {}
    for (const [bolim, quizSlug] of Object.entries(BOLIM_QUIZ)) {
      const resultName = resultNameBySlug[quizSlug]
      const best = resultName ? bestByName[resultName] : undefined
      if (best !== undefined) progress[bolim] = Math.round(best)
    }

    // Aralash test barcha mavzularni qamrab olgani uchun alohida ko'rsatiladi
    const aralash = bestByName[resultNameBySlug.aralash]

    return NextResponse.json({
      success: true,
      signedIn: true,
      progress,
      aralash: aralash !== undefined ? Math.round(aralash) : null,
      totalQuizzes: results.length,
    })
  } catch (error) {
    console.error('[O\'quv progress]', error)
    return NextResponse.json(
      { error: 'Progressni yuklashda xatolik' },
      { status: 500 }
    )
  }
}
