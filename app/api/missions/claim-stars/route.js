// app/api/missions/claim-stars/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Bugungi bajarilgan missiyalar sonini tekshirish
    const todayCompletions = await prisma.missionCompletion.count({
      where: {
        userId: session.user.id,
        mission: {
          date: today
        }
      }
    })

    if (todayCompletions < 3) {
      return NextResponse.json(
        { error: `Yulduz olish uchun 3 ta missiya bajarish kerak. Hozir: ${todayCompletions}/3` },
        { status: 400 }
      )
    }

    // Foydalanuvchining hozirgi yulduzlari
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stars: true, weeklyStars: true, monthlyStars: true }
    })

    // Yulduz allaqachon berilganmi? (bugun uchun)
    // Buni tekshirish uchun alohida jadval kerak, lekin hozircha soddalashtiramiz
    // Chunki complete API'da avtomatik beriladi

    return NextResponse.json({
      success: true,
      message: '🌟 Tabriklaymiz! Siz bugungi yulduzni oldingiz!',
      stats: {
        stars: user.stars,
        weeklyStars: user.weeklyStars,
        monthlyStars: user.monthlyStars
      }
    })

  } catch (error) {
    console.error('[Claim Stars Error]:', error)
    return NextResponse.json(
      { error: 'Yulduz olishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}