// app/api/missions/daily/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  kunlikMissiyalar, missiyaYozuvi, missiyaKuni, shablonniTop, bajarildimi,
} from '@/lib/missions'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = missiyaKuni()

    // Bugungi missiyalar mavjudmi?
    let missions = await prisma.mission.findMany({
      where: { date: today },
      include: {
        completions: {
          where: { userId: session.user.id },
          select: { id: true, completedAt: true }
        }
      }
    })

    // Agar mavjud bo'lmasa, yaratish. Cron ishlamay qolsa ham sahifa
    // bo'sh qolmasin; uchlik sanadan chiqqani uchun ikkalasi bir xil
    // natija beradi.
    if (missions.length === 0) {
      await prisma.mission.createMany({
        data: kunlikMissiyalar(today).map((shablon) => missiyaYozuvi(shablon, today)),
        skipDuplicates: true,
      })

      // Qayta olish
      missions = await prisma.mission.findMany({
        where: { date: today },
        include: {
          completions: {
            where: { userId: session.user.id },
            select: { id: true, completedAt: true }
          }
        }
      })
    }

    // Foydalanuvchining bugungi statistikasi
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        stars: true,
        weeklyStars: true,
        monthlyStars: true,
        totalMissions: true,
        coins: true,
        gems: true
      }
    })

    // Missiyalarni formatlash.
    //
    // `tayyor` — amal HAQIQATAN bajarilganmi. Buni oldindan aytmasak,
    // odam tugmani bosib "avval bajaring" degan xatoni olardi va nima
    // qilish kerakligini o'zi topib olishi kerak bo'lardi. `havola` esa
    // uni to'g'ridan-to'g'ri kerakli sahifaga olib boradi.
    const formattedMissions = await Promise.all(
      missions.map(async (mission) => {
        const bajarilgan = mission.completions.length > 0
        const shablon = shablonniTop(mission.type)
        return {
          id: mission.id,
          type: mission.type,
          title: mission.title,
          description: mission.description,
          xpReward: mission.xpReward,
          icon: mission.icon,
          difficulty: mission.difficulty,
          havola: shablon?.havola || null,
          completed: bajarilgan,
          // Mukofot olingan bo'lsa qayta tekshirish shart emas
          tayyor: bajarilgan || (await bajarildimi(session.user.id, mission.type, today)),
          completedAt: mission.completions[0]?.completedAt || null
        }
      })
    )

    // Bajarilgan missiyalar soni
    const completedCount = formattedMissions.filter(m => m.completed).length

    return NextResponse.json({
      missions: formattedMissions,
      stats: {
        stars: user.stars,
        weeklyStars: user.weeklyStars,
        monthlyStars: user.monthlyStars,
        totalMissions: user.totalMissions,
        coins: user.coins,
        gems: user.gems,
        todayCompleted: completedCount,
        todayTotal: formattedMissions.length,
        // Bugungi missiyalar soniga bog'landi. Avval bu yerda qattiq `=== 3`
        // turardi, kunlik missiya esa 2 ta — shart hech qachon bajarilmasdi.
        canClaimStars:
          formattedMissions.length > 0 && completedCount === formattedMissions.length
      }
    })

  } catch (error) {
    console.error('[Missions Daily Error]:', error)
    return NextResponse.json(
      { error: 'Missiyalarni yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}