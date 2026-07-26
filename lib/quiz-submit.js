// lib/quiz-submit.js
// Quiz natijasini saqlashning YAGONA joyi — veb sayt ham, mobil ilova ham
// shu funksiyani chaqiradi. Shunda XP, missiya va statistika ikkalasida
// bir xil hisoblanadi.
import { prisma } from './prisma'
import { completeMission } from './missions'
import { trackActivity } from './streak'

/**
 * @param {string} userId
 * @param {{quizName:string, score:number, totalQuestions:number, percentage?:number, timeSpent?:number}} payload
 */
export async function saveQuizResult(userId, payload) {
  const { quizName, score, totalQuestions } = payload

  if (!quizName || score === undefined || !totalQuestions) {
    throw new Error("Ma'lumotlar to'liq emas")
  }

  const safeTotal = Number(totalQuestions)
  const safeScore = Number(score)

  if (!Number.isFinite(safeTotal) || safeTotal <= 0) {
    throw new Error("Savollar soni noto'g'ri")
  }
  if (!Number.isFinite(safeScore) || safeScore < 0 || safeScore > safeTotal) {
    throw new Error("Ball noto'g'ri")
  }

  // Foizni mijozga ishonmasdan o'zimiz hisoblaymiz
  const percentage = Math.round((safeScore / safeTotal) * 100)
  const timeSpent = Number.isFinite(Number(payload.timeSpent)) ? Number(payload.timeSpent) : 0

  const quizResult = await prisma.quizResult.create({
    data: {
      userId,
      quizName,
      score: safeScore,
      totalQuestions: safeTotal,
      percentage,
      timeSpent,
    },
  })

  // Foydalanuvchiga XP qo'shish (foiz bo'yicha 0-50 XP)
  const xpGained = Math.round((percentage / 100) * 50)
  await prisma.user.update({
    where: { id: userId },
    data: {
      experience: { increment: xpGained },
      totalPoints: { increment: xpGained },
    },
  })

  // Faoliyat grafigi uchun qayd — busiz DailyActivity hech qachon
  // to'ldirilmasdi va profildagi faollik grafigi doim bo'sh turardi.
  await trackActivity(userId, 'quiz', xpGained)

  // Kunlik missiyani avtomatik bajarish
  const missionResult = await completeMission(userId, 'quiz')

  return { quizResult, xpGained, missionResult }
}
