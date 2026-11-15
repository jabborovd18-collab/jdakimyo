// app/api/activity/track/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { updateStreak } from '@/lib/streak'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const activityType = body?.activityType

    // Mijoz ping'idan faqat 'visit' qabul qilinadi: quiz, mission va XP serverning
    // o'z ichida tekshirilib yoziladi (mijozdan kelgan soxta XP/faoliyatga yo'l yo'q).
    if (activityType !== 'visit') {
      return NextResponse.json(
        { error: 'Noto\'g\'ri faoliyat turi' },
        { status: 400 }
      )
    }

    const streakResult = await updateStreak(session.user.id)

    return NextResponse.json({
      success: true,
      streak: streakResult,
      activity: { success: true, skipped: true }
    })

  } catch (error) {
    console.error('[Activity Track API Error]:', error)
    return NextResponse.json(
      { error: 'Faoliyatni qayd etishda xatolik' },
      { status: 500 }
    )
  }
}