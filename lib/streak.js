// lib/streak.js
import { prisma } from './prisma'
import {
  FAOLLIK_TURLARI,
  effectiveVisitStreak,
  faollikXulosasi,
  kunFarqi,
  kunKalitidanOldin,
  streakHisobla,
  toshkentSanaKaliti,
  toshkentUtcKun,
} from './faoliyat'

const MAYDON_NOMI = {
  quiz: 'quizCount',
  video: 'videoCount',
  compound: 'compoundCount',
  mission: 'missionCount',
}

/**
 * Foydalanuvchining kunlik kirish seriyasini (streak) Toshkent vaqtida yangilaydi.
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
        lastActive: true,
      },
    })

    if (!user) {
      throw new Error('Foydalanuvchi topilmadi')
    }

    const now = new Date()
    const todayKey = toshkentSanaKaliti(now)

    let newStreak = user.currentStreak || 0
    let newLongest = user.longestStreak || 0

    if (user.lastActive) {
      const lastKey = toshkentSanaKaliti(user.lastActive)
      const daysDiff = kunFarqi(lastKey, todayKey)

      if (daysDiff === 0) {
        if (newStreak <= 0) newStreak = 1
      } else if (daysDiff === 1) {
        newStreak = (user.currentStreak || 0) + 1
      } else if (daysDiff === null || daysDiff > 1) {
        newStreak = 1
      }
    } else {
      newStreak = 1
    }

    if (newStreak > newLongest) {
      newLongest = newStreak
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActive: now,
      },
      select: {
        currentStreak: true,
        longestStreak: true,
        lastActive: true,
      },
    })

    return {
      success: true,
      currentStreak: updatedUser.currentStreak,
      longestStreak: updatedUser.longestStreak,
      lastActive: updatedUser.lastActive,
    }
  } catch (error) {
    console.error('[Streak Update Error]:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Foydalanuvchining kunlik o'quv faoliyatini (`DailyActivity`) atomik tarzda qayd etadi.
 *
 * @param {string} userId - Foydalanuvchi ID
 * @param {'quiz'|'video'|'compound'|'mission'} activityType - Faoliyat turi
 * @param {number} xp - Olingan XP (ixtiyoriy)
 * @returns {Promise<object>} - Yangilangan faoliyat
 */
export async function trackActivity(userId, activityType, xp = 0) {
  try {
    if (!userId || !FAOLLIK_TURLARI.includes(activityType)) {
      return {
        success: false,
        error: "Noto'g'ri faoliyat turi",
      }
    }

    const today = toshkentUtcKun()
    const safeXp = Number.isFinite(Number(xp)) && Number(xp) > 0 ? Math.round(Number(xp)) : 0
    const counterField = MAYDON_NOMI[activityType]

    const updateData = {
      [counterField]: { increment: 1 },
      ...(safeXp > 0 ? { totalXP: { increment: safeXp } } : {}),
    }

    const createData = {
      userId,
      date: today,
      quizCount: activityType === 'quiz' ? 1 : 0,
      videoCount: activityType === 'video' ? 1 : 0,
      compoundCount: activityType === 'compound' ? 1 : 0,
      missionCount: activityType === 'mission' ? 1 : 0,
      totalXP: safeXp,
    }

    const activity = await prisma.dailyActivity.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: updateData,
      create: createData,
    })

    return {
      success: true,
      activity,
    }
  } catch (error) {
    console.error('[Activity Track Error]:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Foydalanuvchining oxirgi N kunlik faoliyatini va jamlanma ko'rsatkichlarini oladi.
 *
 * @param {string} userId - Foydalanuvchi ID
 * @param {number} days - Necha kunlik tarix (1..365, sukutda 365)
 */
export async function getActivityHistory(userId, days = 365) {
  try {
    const safeDays = Math.min(365, Math.max(1, Math.floor(Number(days) || 365)))
    const todayKey = toshkentSanaKaliti()
    const startKey = kunKalitidanOldin(todayKey, safeDays - 1)
    const startDate = toshkentUtcKun(startKey)

    const activities = await prisma.dailyActivity.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentStreak: true,
        longestStreak: true,
        lastActive: true,
        experience: true,
        stars: true,
        learningPreferences: true,
      },
    })

    const activityMap = new Map()
    for (const activity of activities) {
      const dateKey = activity.date.toISOString().slice(0, 10)
      activityMap.set(dateKey, {
        date: dateKey,
        quizCount: activity.quizCount,
        videoCount: activity.videoCount,
        compoundCount: activity.compoundCount,
        missionCount: activity.missionCount,
        totalXP: activity.totalXP,
        totalActivities:
          activity.quizCount +
          activity.videoCount +
          activity.compoundCount +
          activity.missionCount,
      })
    }

    const result = []
    for (let i = safeDays - 1; i >= 0; i--) {
      const dateKey = kunKalitidanOldin(todayKey, i)
      result.push(
        activityMap.get(dateKey) || {
          date: dateKey,
          quizCount: 0,
          videoCount: 0,
          compoundCount: 0,
          missionCount: 0,
          totalXP: 0,
          totalActivities: 0,
        }
      )
    }

    const streak = streakHisobla(result, todayKey)
    const xulosa = faollikXulosasi(result, todayKey)
    const prefs =
      user?.learningPreferences && typeof user.learningPreferences === 'object'
        ? user.learningPreferences
        : {}

    return {
      success: true,
      todayKey,
      activities: result,
      summary: {
        ...xulosa,
        ...streak,
        visitStreak: effectiveVisitStreak(user, todayKey),
        longestVisitStreak: user?.longestStreak || 0,
        lastActive: user?.lastActive || null,
        totalExperience: user?.experience || 0,
        stars: user?.stars || 0,
        dailyGoalQuestions: Number(prefs.dailyGoalQuestions) || 20,
        dailyGoalMinutes: Number(prefs.dailyGoalMinutes) || 30,
      },
    }
  } catch (error) {
    console.error('[Activity History Error]:', error)
    return {
      success: false,
      error: error.message,
      activities: [],
    }
  }
}
