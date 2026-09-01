// Quiz javoblarini tekshirishning sof qismi.
//
// Nega alohida: HTTP yo'llari, veb va mobil ilova bir xil tekshiruvdan
// foydalanadi. Shunda mijoz yuborgan tayyor ballni qabul qiladigan ikkinchi
// yo'l paydo bo'lmaydi va mantiqni bazasiz birlik sinovida tekshirish mumkin.

function variantlar(options) {
  if (Array.isArray(options)) return options
  if (Array.isArray(options?.texts)) return options.texts
  return []
}
/**
 * @param {Array} questions Bazadan olingan, to'g'ri javobi bor savollar.
 * @param {Array} answers Mijoz tanlovlari: { questionId, selected }.
 * @param {string[]} expectedIds Token ichidagi savollar tartibi.
 */
export function quizJavoblariniBahola(questions, answers, expectedIds) {
  if (!Array.isArray(questions) || !Array.isArray(answers) || !Array.isArray(expectedIds)) {
    throw new Error("Quiz javoblari noto'g'ri shaklda")
  }

  if (expectedIds.length === 0 || new Set(expectedIds).size !== expectedIds.length) {
    throw new Error("Quiz savollari to'plami yaroqsiz")
  }
  if (answers.length !== expectedIds.length) {
    throw new Error("Barcha savollarga bittadan javob berilishi shart")
  }

  const questionById = new Map(questions.map((question) => [question.id, question]))
  const answerById = new Map()

  for (const answer of answers) {
    if (!answer || typeof answer.questionId !== 'string' || answerById.has(answer.questionId)) {
      throw new Error("Bir savolga takroriy yoki yaroqsiz javob yuborildi")
    }
    answerById.set(answer.questionId, answer)
  }

  let score = 0
  const results = expectedIds.map((questionId) => {
    const question = questionById.get(questionId)
    const answer = answerById.get(questionId)

    if (!question || !answer) {
      throw new Error("Javoblar urinishdagi savollarga mos emas")
    }

    const options = variantlar(question.options)
    const selectedAnswer = Number(answer.selected)
    const correctAnswer = Number(question.correct)

    if (!Number.isInteger(selectedAnswer) || selectedAnswer < 0 || selectedAnswer >= options.length) {
      throw new Error("Tanlangan variant noto'g'ri")
    }
    if (!Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer >= options.length) {
      throw new Error("Savol bazasidagi to'g'ri javob noto'g'ri")
    }

    const isCorrect = selectedAnswer === correctAnswer
    if (isCorrect) score += 1

    return {
      questionId,
      selectedAnswer,
      correctAnswer,
      isCorrect,
      explanation: question.explanation || null,
      category: question.category,
    }
  })

  return {
    score,
    totalQuestions: expectedIds.length,
    percentage: Math.round((score / expectedIds.length) * 100),
    results,
  }
}
