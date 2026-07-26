// app/api/activity/track/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { updateStreak, trackActivity } from '@/lib/streak'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { activityType, xp = 0 } = await request.json()

    // 'visit' — shunchaki saytga kirish. Seriyani yangilaydi, lekin kunlik
    // sanoqchilarga (quiz/video/...) qo'shilmaydi, chunki bu alohida ish emas.
    // Busiz seriyani yangilaydigan hech narsa yo'q edi: hamma foydalanuvchida
    // lastActive null, currentStreak va longestStreak 0 bo'lib qolgandi.
    const validTypes = ['visit', 'quiz', 'video', 'compound', 'mission']
    if (!validTypes.includes(activityType)) {
      return NextResponse.json(
        { error: 'Noto\'g\'ri faoliyat turi' },
        { status: 400 }
      )
    }

    // Streak'ni yangilash
    const streakResult = await updateStreak(session.user.id)

    // Faoliyatni qayd etish
    const activityResult =
      activityType === 'visit'
        ? { success: true, skipped: true }
        : await trackActivity(session.user.id, activityType, xp)

    return NextResponse.json({
      success: true,
      streak: streakResult,
      activity: activityResult
    })

  } catch (error) {
    console.error('[Activity Track API Error]:', error)
    return NextResponse.json(
      { error: 'Faoliyatni qayd etishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}