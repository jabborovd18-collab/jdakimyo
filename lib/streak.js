// lib/streak.js
import { prisma } from './prisma'

/**
 * Foydalanuvchining streak'ini yangilash
 * Har safar foydalanuvchi saytga kirganda yoki harakat qilganda chaqiriladi
 * 
 * @param {string} userId - Foydalanuvchi ID
 * @returns {Promise<object>} - Yangilangan streak ma'lumotlari
 */
export async function updateStreak(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentStreak: true,
        longestStreak: true,
        lastActive: true
      }
    })

    if (!user) {
      throw new Error('Foydalanuvchi topilmadi')
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    let newStreak = user.currentStreak || 0
    let newLongest = user.longestStreak || 0

    if (user.lastActive) {
      const lastActiveDate = new Date(user.lastActive)
      const lastActiveDay = new Date(
        lastActiveDate.getFullYear(),
        lastActiveDate.getMonth(),
        lastActiveDate.getDate()
      )

      // Kunlar farqini hisoblash
      const daysDiff = Math.floor((today - lastActiveDay) / (1000 * 60 * 60 * 24))

      if (daysDiff === 0) {
        // Bugun allaqachon kirgan - streak o'zgarmaydi
        console.log(`[Streak] User ${userId} already active today`)
      } else if (daysDiff === 1) {
        // Kecha kirgan - streak +1
        newStreak = (user.currentStreak || 0) + 1
        console.log(`[Streak] User ${userId} streak increased to ${newStreak}`)
      } else {
        // 2+ kun o'tgan - streak reset
        newStreak = 1
        console.log(`[Streak] User ${userId} streak reset to 1 (was away ${daysDiff} days)`)
      }
    } else {
      // Birinchi marta kirish
      newStreak = 1
      console.log(`[Streak] User ${userId} first login, streak = 1`)
    }

    // Eng uzun streak'ni yangilash
    if (newStreak > newLongest) {
      newLongest = newStreak
      console.log(`[Streak] New longest streak: ${newLongest}`)
    }

    // Database'ni yangilash
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActive: now
      },
      select: {
        currentStreak: true,
        longestStreak: true,
        lastActive: true
      }
    })

    return {
      success: true,
      currentStreak: updatedUser.currentStreak,
      longestStreak: updatedUser.longestStreak,
      lastActive: updatedUser.lastActive
    }

  } catch (error) {
    console.error('[Streak Update Error]:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Foydalanuvchining kunlik faoliyatini qayd etish
 * 
 * @param {string} userId - Foydalanuvchi ID
 * @param {string} activityType - Faoliyat turi: 'quiz', 'video', 'compound', 'mission'
 * @param {number} xp - Olingan XP (ixtiyoriy)
 * @returns {Promise<object>} - Yangilangan faoliyat
 */
export async function trackActivity(userId, activityType, xp = 0) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Bugungi faoliyat mavjudmi?
    let activity = await prisma.dailyActivity.findUnique({
      where: {
        userId_date: {
          userId: userId,
          date: today
        }
      }
    })

    if (activity) {
      // Mavjud faoliyatni yangilash
      const updateData = {}
      
      switch (activityType) {
        case 'quiz':
          updateData.quizCount = { increment: 1 }
          break
        case 'video':
          updateData.videoCount = { increment: 1 }
          break
        case 'compound':
          updateData.compoundCount = { increment: 1 }
          break
        case 'mission':
          updateData.missionCount = { increment: 1 }
          break
      }

      if (xp > 0) {
        updateData.totalXP = { increment: xp }
      }

      activity = await prisma.dailyActivity.update({
        where: { id: activity.id },
        data: updateData
      })
    } else {
      // Yangi faoliyat yaratish
      const createData = {
        userId: userId,
        date: today,
        quizCount: activityType === 'quiz' ? 1 : 0,
        videoCount: activityType === 'video' ? 1 : 0,
        compoundCount: activityType === 'compound' ? 1 : 0,
        missionCount: activityType === 'mission' ? 1 : 0,
        totalXP: xp
      }

      activity = await prisma.dailyActivity.create({
        data: createData
      })
    }

    console.log(`[Activity] Tracked ${activityType} for user ${userId}`)

    return {
      success: true,
      activity
    }

  } catch (error) {
    console.error('[Activity Track Error]:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Foydalanuvchining oxirgi N kunlik faoliyatini olish (heatmap uchun)
 * 
 * @param {string} userId - Foydalanuvchi ID
 * @param {number} days - Necha kun oldingi (default: 365)
 * @returns {Promise<Array>} - Faoliyat massivi
 */
export async function getActivityHistory(userId, days = 365) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    const activities = await prisma.dailyActivity.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Har bir kun uchun ma'lumot (bo'sh kunlar uchun 0)
    const activityMap = new Map()
    activities.forEach(activity => {
      const dateKey = activity.date.toISOString().split('T')[0]
      activityMap.set(dateKey, {
        date: dateKey,
        quizCount: activity.quizCount,
        videoCount: activity.videoCount,
        compoundCount: activity.compoundCount,
        missionCount: activity.missionCount,
        totalXP: activity.totalXP,
        totalActivities: activity.quizCount + activity.videoCount + 
                        activity.compoundCount + activity.missionCount
      })
    })

    // Oxirgi N kun uchun massiv yaratish
    const result = []
    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const dateKey = date.toISOString().split('T')[0]

      result.push(activityMap.get(dateKey) || {
        date: dateKey,
        quizCount: 0,
        videoCount: 0,
        compoundCount: 0,
        missionCount: 0,
        totalXP: 0,
        totalActivities: 0
      })
    }

    return {
      success: true,
      activities: result
    }

  } catch (error) {
    console.error('[Activity History Error]:', error)
    return {
      success: false,
      error: error.message,
      activities: []
    }
  }
}