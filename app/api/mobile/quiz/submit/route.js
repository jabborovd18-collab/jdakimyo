// Mobil quiz ham veb bilan bir xil server baholashidan foydalanadi.
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/api-auth'
import { quizniServerdaBahola } from '@/lib/quiz-server'

export { OPTIONS } from '@/lib/cors'

export async function POST(request) {
  try {
    const auth = await getAuthUser(request)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 })
    if (!body.attemptToken || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: "Ilova eskirgan: quizni yangidan yuklab, javoblar bilan yuboring" },
        { status: 400 },
      )
    }

    const result = await quizniServerdaBahola({
      attemptToken: body.attemptToken,
      answers: body.answers,
      currentUserId: auth.id,
      timeSpent: body.timeSpent,
    })

    return NextResponse.json({
      success: true,
      ...result,
      missionCompleted: Boolean(result.missionResult?.success),
      missionMessage: result.missionResult?.message ?? null,
    })
  } catch (error) {
    console.error('[Mobile quiz submit]', error)
    return NextResponse.json(
      { error: error.message || 'Natijani saqlashda xatolik' },
      { status: error.statusCode || 500 },
    )
  }
}
