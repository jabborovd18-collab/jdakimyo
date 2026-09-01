import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { quizniServerdaBahola } from '@/lib/quiz-server'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 })

    const result = await quizniServerdaBahola({
      attemptToken: body.attemptToken,
      answers: body.answers,
      currentUserId: session?.user?.id || null,
      timeSpent: body.timeSpent,
    })

    if (result.missionResult?.success) {
      console.log('[Quiz] Mission completed:', result.missionResult.message)
    }

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('[Quiz Submit Error]:', error)
    return NextResponse.json(
      { error: error.message || 'Quiz yuborishda xatolik' },
      { status: error.statusCode || 500 },
    )
  }
}
