// app/api/video/track/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { completeMission } from '@/lib/missions'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId, videoTitle, watchTime, totalDuration } = await request.json()

    // Validatsiya
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID kerak' },
        { status: 400 }
      )
    }

    // Video ko'rilgan deb hisoblash uchun minimal vaqt (masalan, 30 soniya)
    const MIN_WATCH_TIME = 30 // soniya
    
    if (watchTime && watchTime < MIN_WATCH_TIME) {
      return NextResponse.json({
        success: false,
        message: `Video kamida ${MIN_WATCH_TIME} soniya ko'rilishi kerak`
      })
    }

    // 🆕 MISSIYANI AVTOMATIK BAJARISH
    const missionResult = await completeMission(session.user.id, 'video')
    
    if (missionResult.success) {
      console.log(`[Video] Mission completed for user ${session.user.id}:`, missionResult.message)
    }

    // Bu yerda video statistikasini saqlash mumkin (ixtiyoriy)
    // Masalan: qaysi videoni qancha vaqt ko'rganini saqlash

    return NextResponse.json({
      success: true,
      message: 'Video kuzatildi',
      missionResult
    })

  } catch (error) {
    console.error('[Video Track Error]:', error)
    return NextResponse.json(
      { error: 'Video kuzatishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}