// lib/missions.js
import { prisma } from './prisma'
import { trackActivity } from './streak'

/**
 * Missiya uchun beriladigan tanga.
 *
 * XP ga bog'lab qo'yamiz, shunda yangi missiya qo'shilganda tanga miqdorini
 * alohida o'ylash shart emas: qiyinroq missiya ko'proq XP beradi, demak
 * ko'proq tanga ham beradi.
 */
function tangaMiqdori(xpReward) {
  const xp = Number(xpReward) || 0
  return Math.max(1, Math.round(xp / 2))
}

/** Barcha kunlik missiyani bajarganga beriladigan qo'shimcha tanga */
const HAMMASI_BONUS_TANGA = 15

/**
 * Kunlik missiya shablonlari — YAGONA ro'yxat.
 *
 * Avval bu ro'yxat ikki joyda edi: cron (yaratadi) va /api/missions/daily
 * (ko'rsatadi). Missiya qaysi yo'l bilan yaratilganiga qarab har xil bo'lib
 * qolishi mumkin edi.
 *
 * Video missiyasi ataylab yo'q: video ko'rish faoliyat grafigida qayd
 * etiladi, lekin kunlik missiya sifatida berilmaydi.
 */
export const MISSIYA_SHABLONLARI = [
  {
    type: 'quiz',
    title: 'Quiz yeching',
    description: "Har qanday quizni yechib, bilimingizni sinab ko'ring",
    xpReward: 10,
    icon: '📝',
    difficulty: 'easy',
  },
  {
    type: 'friend',
    title: "Do'st qo'shing",
    description: "Yangi do'st qo'shing yoki do'stlik taklifini yuboring",
    xpReward: 20,
    icon: '👥',
    difficulty: 'hard',
  },
]

/**
 * Missiya kunining boshi — UTC yarim tuni.
 *
 * UTC ataylab: missiyalarni yaratadigan cron ham UTC ishlatadi. Avval
 * tekshiruvlar `setHours` (server mahalliy vaqti) bilan qilinardi va
 * server UTC bo'lmasa mos kelmasdi — foydalanuvchi bugungi missiyani
 * ko'rardi, lekin bajarmoqchi bo'lganda "bu missiya bugungi emas"
 * degan xato olardi.
 */
export function missiyaKuni() {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  return d
}

/**
 * Missiyani bajarilgan deb belgilaydi va mukofotni beradi.
 *
 * MUKOFOT MANTIG'INING YAGONA JOYI. Ikkita chaqiruvchi bor:
 *   1) completeMission()            — quiz yechilganda avtomatik
 *   2) POST /api/missions/complete  — foydalanuvchi tugmani bosganda
 *
 * Avval ikkalasida ham nusxa kod turardi va ikkalasida ham bir xil xato
 * bor edi: yulduz `todayCompletions === 3` shartida berilardi, kunlik
 * missiya esa 2 ta (cron shabloni). Ya'ni shart hech qachon bajarilmasdi
 * va tizim ishga tushganidan beri bironta ham yulduz berilmagan.
 *
 * @param {string} userId
 * @param {object} mission — chaqiruvchi tomonidan tekshirilgan Mission yozuvi
 */
export async function missiyaniBelgila(userId, mission) {
  const today = missiyaKuni()

  await prisma.missionCompletion.create({
    data: { userId, missionId: mission.id },
  })

  const tanga = tangaMiqdori(mission.xpReward)
  await prisma.user.update({
    where: { id: userId },
    data: {
      experience: { increment: mission.xpReward },
      totalMissions: { increment: 1 },
      coins: { increment: tanga },
    },
  })

  // Faoliyat grafigi uchun qayd
  await trackActivity(userId, 'mission', mission.xpReward)

  const bajarilgan = await prisma.missionCompletion.count({
    where: { userId, mission: { date: today } },
  })

  // Bugun umuman nechta missiya bor edi — shart shunga bog'lanadi, qattiq
  // songa emas: cron shabloni o'zgarsa mantiq o'zi moslashadi.
  const bugungiMissiyalar = await prisma.mission.count({ where: { date: today } })

  let starEarned = false
  let bonusTanga = 0

  if (bugungiMissiyalar > 0 && bajarilgan === bugungiMissiyalar) {
    bonusTanga = HAMMASI_BONUS_TANGA
    await prisma.user.update({
      where: { id: userId },
      data: {
        stars: { increment: 1 },
        weeklyStars: { increment: 1 },
        monthlyStars: { increment: 1 },
        coins: { increment: bonusTanga },
      },
    })
    starEarned = true
  }

  const jamiTanga = tanga + bonusTanga

  return {
    success: true,
    message: `✓ Missiya bajarildi: ${mission.title} (+${mission.xpReward} XP, +${jamiTanga} 🪙)`,
    mission: {
      id: mission.id,
      title: mission.title,
      xpReward: mission.xpReward,
    },
    coinsEarned: jamiTanga,
    starEarned,
    todayCompleted: bajarilgan,
    todayTotal: bugungiMissiyalar,
  }
}

/**
 * Turi bo'yicha bugungi missiyani topib bajaradi.
 * Quiz yechilgandek hodisalarda avtomatik chaqiriladi.
 *
 * @param {string} userId
 * @param {string} missionType — 'quiz', 'video', 'friend'
 */
export async function completeMission(userId, missionType) {
  try {
    const today = missiyaKuni()

    const mission = await prisma.mission.findFirst({
      where: { date: today, type: missionType },
    })

    if (!mission) {
      return { success: false, message: 'Bugungi missiya topilmadi' }
    }

    const mavjud = await prisma.missionCompletion.findUnique({
      where: { userId_missionId: { userId, missionId: mission.id } },
    })

    if (mavjud) {
      return { success: false, message: 'Missiya allaqachon bajarilgan' }
    }

    return await missiyaniBelgila(userId, mission)
  } catch (error) {
    console.error('[Mission Complete Error]:', error)
    return { success: false, message: 'Xatolik: ' + error.message }
  }
}
