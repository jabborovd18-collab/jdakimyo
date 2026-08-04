// app/api/missions/complete/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { missiyaniBelgila, missiyaKuni, bajarildimi } from '@/lib/missions'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { missionId, actionType } = await request.json()

    if (!missionId) {
      return NextResponse.json(
        { error: 'Mission ID kerak' },
        { status: 400 }
      )
    }

    // Missiya mavjudligini tekshirish
    const mission = await prisma.mission.findUnique({
      where: { id: missionId }
    })

    if (!mission) {
      return NextResponse.json(
        { error: 'Missiya topilmadi' },
        { status: 404 }
      )
    }

    // Bugungi missiyami?
    //
    // Ikkala sana ham UTC yarim tuniga keltiriladi — missiyani yaratadigan
    // cron ham shunday qiladi. Avval `setHours` (server mahalliy vaqti)
    // ishlatilardi va server UTC bo'lmasa, /api/missions/daily ko'rsatgan
    // missiyani bu yerda bajarib bo'lmasdi.
    const today = missiyaKuni()
    const missionDate = new Date(mission.date)
    missionDate.setUTCHours(0, 0, 0, 0)

    if (missionDate.getTime() !== today.getTime()) {
      return NextResponse.json(
        { error: 'Bu missiya bugungi emas' },
        { status: 400 }
      )
    }

    // Allaqachon bajarilganmi?
    const existingCompletion = await prisma.missionCompletion.findUnique({
      where: {
        userId_missionId: {
          userId: session.user.id,
          missionId: missionId
        }
      }
    })

    if (existingCompletion) {
      return NextResponse.json(
        { error: 'Bu missiya allaqachon bajarilgan' },
        { status: 400 }
      )
    }

    // AMAL HAQIQATAN BAJARILGANMI.
    //
    // Avval bu tekshiruv yo'q edi va shu yerda "keyinroq qo'shish mumkin"
    // degan izoh turardi: endpoint faqat missiya id sini olib mukofot
    // berardi. Ya'ni hech narsa qilmasdan tugmani bosgan odam ham XP,
    // tanga va (uchalasini bosgach) yulduz olardi. Tanga laboratoriya
    // iqtisodiyotining asosi, shuning uchun bu shunchaki aldash emas —
    // butun muvozanatni buzadi.
    const haqiqatanBajarilgan = await bajarildimi(session.user.id, mission.type, today)
    if (!haqiqatanBajarilgan) {
      return NextResponse.json(
        { error: `Avval amalni bajaring: ${mission.description}` },
        { status: 400 }
      )
    }

    // Mukofot mantig'i lib/missions.js da — u yerda ham, quiz yechilganda
    // avtomatik chaqiriladigan yo'lda ham bir xil bo'lishi uchun.
    const natija = await missiyaniBelgila(session.user.id, mission)

    return NextResponse.json({
      success: true,
      message: natija.message,
      completion: {
        missionId: mission.id,
        missionTitle: mission.title,
        xpEarned: mission.xpReward,
        coinsEarned: natija.coinsEarned
      },
      starEarned: natija.starEarned,
      stats: {
        todayCompleted: natija.todayCompleted,
        todayTotal: natija.todayTotal,
        canClaimStars: natija.starEarned
      }
    })

  } catch (error) {
    console.error('[Mission Complete Error]:', error)
    return NextResponse.json(
      { error: 'Missiyani bajarishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}