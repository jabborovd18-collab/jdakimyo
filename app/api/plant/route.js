// app/api/plant/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const STAGES = [
  { min: 0, max: 9, name: 'Urug\'', emoji: '🌰' },
  { min: 10, max: 19, name: 'Nish', emoji: '🌱' },
  { min: 20, max: 29, name: 'Yosh o\'simlik', emoji: '🌿' },
  { min: 30, max: 39, name: 'O\'simlik', emoji: '🪴' },
  { min: 40, max: 49, name: 'Katta o\'simlik', emoji: '🌾' },
  { min: 50, max: 59, name: 'Daraxt', emoji: '🌲' },
  { min: 60, max: 69, name: 'Katta daraxt', emoji: '🌳' },
  { min: 70, max: 79, name: 'Gullagan', emoji: '🌸' },
  { min: 80, max: 89, name: 'Mevali', emoji: '🍎' },
  { min: 90, max: 100, name: 'Afsonaviy', emoji: '👑' }
]

function getStage(growth) {
  const stageIndex = STAGES.findIndex(
    (s) => growth >= s.min && (s.max === 100 ? growth <= 100 : growth < s.max + 1)
  )
  return stageIndex >= 0 ? stageIndex + 1 : 1
}

function getStageInfo(stage) {
  return STAGES[stage - 1] || STAGES[0]
}

// GET - Foydalanuvchining ko'chatini olish
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let plant = await prisma.plant.findUnique({
      where: { userId: session.user.id },
      include: {
        waterings: {
          orderBy: { createdAt: 'desc' },
          take: 30
        }
      }
    })

    // Agar plant yo'q bo'lsa, yaratish
    if (!plant) {
      plant = await prisma.plant.create({
        data: {
          userId: session.user.id,
          name: `${session.user.fullName || session.user.username}ning ko'chati`,
          stage: 1,
          growth: 0
        },
        include: {
          waterings: {
            orderBy: { createdAt: 'desc' },
            take: 30
          }
        }
      })
    }

    // Streak tekshirish (oxirgi suv berishdan beri)
    let streakStatus = 'active'
    if (plant.lastWatered) {
      const now = new Date()
      const lastWatered = new Date(plant.lastWatered)
      const daysDiff = Math.floor((now.setHours(0, 0, 0, 0) - lastWatered.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        streakStatus = 'can_water' // Bugun suv berish mumkin
      } else if (daysDiff === 0) {
        streakStatus = 'already_watered' // Bugun allaqachon suv berilgan
      } else if (daysDiff === 2) {
        streakStatus = 'warning_1day' // 1 kun o'tdi
      } else if (daysDiff <= 4) {
        streakStatus = 'warning_3days' // 3 kungacha
      } else {
        streakStatus = 'dead' // 7+ kun - so'ligan
      }
    } else {
      streakStatus = 'can_water'
    }

    // Bugun suv berilganmi?
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const wateredToday = plant.waterings.some(w => {
      const wDate = new Date(w.createdAt)
      wDate.setHours(0, 0, 0, 0)
      return wDate.getTime() === today.getTime()
    })

    const stageInfo = getStageInfo(plant.stage)

    return NextResponse.json({
      success: true,
      plant: {
        ...plant,
        stageInfo,
        canWaterToday: !wateredToday,
        wateredToday,
        streakStatus,
        nextStage: plant.stage < 10 ? STAGES[plant.stage] : null
      }
    })
  } catch (error) {
    console.error('[Plant GET]', error)
    return NextResponse.json({ error: 'Ko\'chat ma\'lumotlarini yuklashda xatolik' }, { status: 500 })
  }
}

// POST - Suv berish
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const result = await prisma.$transaction(async (tx) => {
      let plant = await tx.plant.findUnique({
        where: { userId: session.user.id }
      })

      if (!plant) {
        plant = await tx.plant.create({
          data: {
            userId: session.user.id,
            name: `${session.user.fullName || session.user.username}ning ko'chati`,
            stage: 1,
            growth: 0
          }
        })
      }

      const wateredToday = await tx.plantWatering.findFirst({
        where: {
          plantId: plant.id,
          createdAt: { gte: today }
        }
      })

      if (wateredToday) {
        throw new Error('BUGUN_SUV_BERILGAN')
      }

      // Streak va o'sish hisoblash
      let newGrowth = plant.growth
      let newStreak = plant.currentStreak
      let growthAmount = 2 // Asosiy +2%
      let boostUsed = null

      if (plant.lastWatered) {
        const now = new Date()
        const lastWatered = new Date(plant.lastWatered)
        const daysDiff = Math.floor((now.setHours(0, 0, 0, 0) - lastWatered.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24))

        if (daysDiff === 1) {
          newStreak += 1
          growthAmount = 2
        } else if (daysDiff === 2) {
          newStreak = 1
          newGrowth = Math.max(0, newGrowth - 5)
          growthAmount = 2
        } else if (daysDiff <= 4) {
          newStreak = 1
          newGrowth = Math.max(0, newGrowth - 20)
          growthAmount = 2
        } else {
          newStreak = 1
          newGrowth = 0
          growthAmount = 2
        }
      } else {
        newStreak = 1
      }

      // Active boost tekshirish
      if (plant.activeBoosts && Array.isArray(plant.activeBoosts)) {
        const now = new Date()
        const validBoosts = plant.activeBoosts.filter(b => new Date(b.expiresAt) > now)

        if (validBoosts.length > 0) {
          const bestBoost = validBoosts.reduce((best, b) =>
            (b.multiplier || 1) > (best.multiplier || 1) ? b : best
          )
          growthAmount *= (bestBoost.multiplier || 1)
          boostUsed = bestBoost.type
        }
      }

      newGrowth = Math.min(100, newGrowth + growthAmount)
      const newLongest = Math.max(plant.longestStreak, newStreak)
      const newStage = getStage(newGrowth)

      const updatedPlant = await tx.plant.update({
        where: { id: plant.id },
        data: {
          growth: newGrowth,
          stage: newStage,
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastWatered: new Date(),
          totalWaterings: { increment: 1 }
        }
      })

      await tx.plantWatering.create({
        data: {
          plantId: plant.id,
          growth: growthAmount,
          boostUsed
        }
      })

      // XP mukofoti (har suv berish = 5 XP)
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          experience: { increment: 5 },
          totalPoints: { increment: 5 }
        }
      })

      return { updatedPlant, growthAmount, stageUp: newStage > plant.stage, newStage }
    }, { isolationLevel: 'Serializable' })

    const stageInfo = getStageInfo(result.newStage)

    return NextResponse.json({
      success: true,
      plant: {
        ...result.updatedPlant,
        stageInfo,
        canWaterToday: false,
        wateredToday: true
      },
      message: result.stageUp
        ? `🎉 Tabriklaymiz! Ko'chatingiz ${stageInfo.emoji} ${stageInfo.name} bosqichiga o'tdi!`
        : `💧 Ko'chatingiz +${result.growthAmount}% o'sdi!`,
      stageUp: result.stageUp,
      xpEarned: 5
    })
  } catch (error) {
    if (error?.message === 'BUGUN_SUV_BERILGAN' || error?.code === 'P2034' || error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Bugun allaqachon suv bergansiz! Ertaga qayta keling.' },
        { status: 400 }
      )
    }
    console.error('[Plant POST]', error)
    return NextResponse.json({ error: 'Suv berishda xatolik' }, { status: 500 })
  }
}