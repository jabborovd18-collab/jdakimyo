// app/api/mobile/quiz/submit/route.js
// Ilovada yechilgan quiz natijasini saqlaydi. Veb saytdagi bilan bir xil
// mantiq (lib/quiz-submit.js) — XP, missiya va reyting bir xil yangilanadi.
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/api-auth'
import { saveQuizResult } from '@/lib/quiz-submit'
import { findQuizCategory } from '@/lib/quiz-categories'

export { OPTIONS } from '@/lib/cors'

export async function POST(request) {
  try {
    const auth = await getAuthUser(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Noto\'g\'ri so\'rov' }, { status: 400 })
    }

    // Quiz nomini mijozdan olmaymiz — kategoriya slug'idan o'zimiz aniqlaymiz,
    // shunda statistikada nomlar aralashib ketmaydi.
    const category = findQuizCategory(body.category)
    if (!category) {
      return NextResponse.json({ error: 'Bunday kategoriya yo\'q' }, { status: 400 })
    }

    const { quizResult, xpGained, missionResult } = await saveQuizResult(auth.id, {
      // Saytdagi bilan bir xil nom — aks holda bitta quizning natijalari
      // bazada ikki xil nom ostida bo'linib ketadi (lib/quiz-categories.js)
      quizName: category.resultName,
      score: body.score,
      totalQuestions: body.totalQuestions,
      timeSpent: body.timeSpent,
    })

    return NextResponse.json({
      success: true,
      quizResult,
      xpGained,
      missionCompleted: Boolean(missionResult?.success),
      missionMessage: missionResult?.message ?? null,
    })
  } catch (error) {
    console.error('[Mobile quiz submit]', error)
    return NextResponse.json(
      { error: error.message || 'Natijani saqlashda xatolik' },
      { status: 400 }
    )
  }
}
