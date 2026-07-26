// lib/missions.js
import { prisma } from './prisma'
import { trackActivity } from './streak'

/**
 * Foydalanuvchi uchun missiyani avtomatik bajarish
 * @param {string} userId - Foydalanuvchi ID
 * @param {string} missionType - Missiya turi: 'quiz', 'video', 'friend'
 * @returns {Promise<object>} - Natija
 */
export async function completeMission(userId, missionType) {
  try {
    // Bugungi sanani olish
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Bugungi mos missiyani topish
    const mission = await prisma.mission.findFirst({
      where: {
        date: today,
        type: missionType
      }
    })

    // Agar missiya mavjud bo'lmasa, hech narsa qilmaymiz
    if (!mission) {
      return { success: false, message: 'Bugungi missiya topilmadi' }
    }

    // Allaqachon bajarilganmi?
    const existingCompletion = await prisma.missionCompletion.findUnique({
      where: {
        userId_missionId: {
          userId: userId,
          missionId: mission.id
        }
      }
    })

    if (existingCompletion) {
      return { success: false, message: 'Missiya allaqachon bajarilgan' }
    }

    // Missiyani bajarish
    const completion = await prisma.missionCompletion.create({
      data: {
        userId: userId,
        missionId: mission.id
      },
      include: {
        mission: true
      }
    })

    // Foydalanuvchiga XP qo'shish
    await prisma.user.update({
      where: { id: userId },
      data: {
        experience: { increment: mission.xpReward },
        totalMissions: { increment: 1 }
      }
    })

    // Faoliyat grafigi uchun qayd
    await trackActivity(userId, 'mission', mission.xpReward)

    // Bugungi bajarilgan missiyalar sonini tekshirish
    const todayCompletions = await prisma.missionCompletion.count({
      where: {
        userId: userId,
        mission: {
          date: today
        }
      }
    })

    // Agar 3 ta missiya bajarilsa, avtomatik ⭐ berish
    let starEarned = false
    if (todayCompletions === 3) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          stars: { increment: 1 },
          weeklyStars: { increment: 1 },
          monthlyStars: { increment: 1 }
        }
      })
      starEarned = true
    }

    return {
      success: true,
      message: `✓ Missiya bajarildi: ${mission.title} (+${mission.xpReward} XP)`,
      mission: {
        id: mission.id,
        title: mission.title,
        xpReward: mission.xpReward
      },
      starEarned,
      todayCompleted: todayCompletions
    }

  } catch (error) {
    console.error('[Mission Complete Error]:', error)
    return { success: false, message: 'Xatolik: ' + error.message }
  }
}