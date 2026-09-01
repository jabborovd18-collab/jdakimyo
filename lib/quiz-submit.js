// Quiz natijasi va XP ni saqlashning YAGONA joyi.
// Ball bu funksiyaga faqat serverdagi baholashdan keyin keladi; urinish kaliti
// esa bir so'rov qayta yuborilganda mukofot takrorlanmasligini kafolatlaydi.
import { prisma } from './prisma'
import { completeMission } from './missions'
import { trackActivity } from './streak'

/**
 * @param {string} userId
 * @param {{attemptId:string, quizName:string, score:number, totalQuestions:number, timeSpent?:number}} payload
 */
export async function saveQuizResult(userId, payload) {
  const attemptId = typeof payload.attemptId === 'string' ? payload.attemptId.trim() : ''
  const quizName = typeof payload.quizName === 'string' ? payload.quizName.trim() : ''
  const safeTotal = Number(payload.totalQuestions)
  const safeScore = Number(payload.score)

  if (!userId || !attemptId || attemptId.length > 191 || !quizName) {
    throw new Error("Quiz natijasi ma'lumoti to'liq emas")
  }
  if (!Number.isInteger(safeTotal) || safeTotal <= 0) {
    throw new Error("Savollar soni noto'g'ri")
  }
  if (!Number.isInteger(safeScore) || safeScore < 0 || safeScore > safeTotal) {
    throw new Error("Ball noto'g'ri")
  }

  const percentage = Math.round((safeScore / safeTotal) * 100)
  const timeSpentRaw = Number(payload.timeSpent)
  const timeSpent = Number.isFinite(timeSpentRaw) && timeSpentRaw >= 0
    ? Math.min(Math.floor(timeSpentRaw), 24 * 60 * 60)
    : 0
  const xpGained = Math.round((percentage / 100) * 50)

  let quizResult
  try {
    quizResult = await prisma.$transaction(async (tx) => {
      const result = await tx.quizResult.create({
        data: {
          attemptId,
          userId,
          quizName,
          score: safeScore,
          totalQuestions: safeTotal,
          percentage,
          timeSpent,
        },
      })

      await tx.user.update({
        where: { id: userId },
        data: {
          experience: { increment: xpGained },
          totalPoints: { increment: xpGained },
        },
      })
      return result
    })
  } catch (error) {
    // Unique indeks bir vaqtda kelgan ikkita bir xil so'rovni ham yopadi.
    // Mavjud natijani qaytarish tarmoq uzilgandan keyingi xavfsiz qayta
    // urinishni qo'llab-quvvatlaydi, lekin XP qayta berilmaydi.
    if (error?.code === 'P2002') {
      const existing = await prisma.quizResult.findUnique({ where: { attemptId } })
      if (existing?.userId === userId) {
        return {
          quizResult: existing,
          xpGained: 0,
          missionResult: null,
          alreadySaved: true,
        }
      }
    }
    throw error
  }

  await trackActivity(userId, 'quiz', xpGained)
  const missionResult = await completeMission(userId, 'quiz')

  return { quizResult, xpGained, missionResult, alreadySaved: false }
}
