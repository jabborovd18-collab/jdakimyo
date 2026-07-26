// app/api/quiz/submit/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { saveQuizResult } from '@/lib/quiz-submit'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Mantiq lib/quiz-submit.js da — mobil ilova ham shuni ishlatadi
    const { quizResult, xpGained, missionResult } = await saveQuizResult(
      session.user.id,
      body,
    )

    if (missionResult?.success) {
      console.log('[Quiz] Mission completed:', missionResult.message)
    }

    return NextResponse.json({
      success: true,
      quizResult,
      xpGained,
      missionResult,
    })
  } catch (error) {
    console.error('[Quiz Submit Error]:', error)
    return NextResponse.json(
      { error: 'Quiz yuborishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}
