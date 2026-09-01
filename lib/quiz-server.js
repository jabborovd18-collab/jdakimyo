import { prisma } from './prisma'
import { findQuizCategory } from './quiz-categories'
import { quizJavoblariniBahola } from './quiz-baho'
import { quizUrinishTokeniniOqi } from './quiz-urinish'
import { saveQuizResult } from './quiz-submit'

function sorovXatosi(message, statusCode = 400) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}
/** Veb va mobil yo'l uchun yagona server baholashi. */
export async function quizniServerdaBahola({ attemptToken, answers, currentUserId = null, timeSpent = 0 }) {
  let attempt
  try {
    attempt = quizUrinishTokeniniOqi(attemptToken)
  } catch (error) {
    throw sorovXatosi(error.message)
  }

  // Mehmon tokenini keyin tizimga kirib mukofotli tokenga aylantirib bo'lmaydi;
  // tizimdagi urinish esa aynan token yaratilgan hisobga tegishli.
  if ((attempt.userId || null) !== (currentUserId || null)) {
    throw sorovXatosi("Quiz urinish boshqa hisobga tegishli, yangi test boshlang", 403)
  }

  const category = findQuizCategory(attempt.category)
  if (!category) throw sorovXatosi("Quiz kategoriyasi topilmadi")

  const questions = await prisma.quizQuestion.findMany({
    where: { id: { in: attempt.questionIds }, isActive: true },
    select: {
      id: true,
      category: true,
      options: true,
      correct: true,
      explanation: true,
    },
  })

  if (questions.length !== attempt.questionIds.length) {
    throw sorovXatosi("Quiz savollaridan biri endi mavjud emas, yangi test boshlang", 409)
  }
  if (
    category.slug !== 'aralash' &&
    questions.some((question) => question.category !== category.slug)
  ) {
    throw sorovXatosi("Quiz savollari kategoriyaga mos emas")
  }

  let baho
  try {
    baho = quizJavoblariniBahola(questions, answers, attempt.questionIds)
  } catch (error) {
    throw sorovXatosi(error.message)
  }

  let saved = null
  if (currentUserId) {
    saved = await saveQuizResult(currentUserId, {
      attemptId: `oddiy:${attempt.id}`,
      quizName: category.resultName,
      score: baho.score,
      totalQuestions: baho.totalQuestions,
      timeSpent,
    })
  }

  return {
    ...baho,
    saved: Boolean(saved),
    quizResult: saved?.quizResult || null,
    xpGained: saved?.xpGained || 0,
    missionResult: saved?.missionResult || null,
    alreadySaved: Boolean(saved?.alreadySaved),
  }
}
