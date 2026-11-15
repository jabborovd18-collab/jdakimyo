/** Description ichida qolgan eski sozlamalarni bitta joyda xavfsiz o'qiydi. */
export function ustozQuizMeta(description) {
  try {
    const meta = typeof description === 'string' && description.trim().startsWith('{')
      ? JSON.parse(description)
      : {}
    return {
      originalDescription: meta.originalDescription || (typeof description === 'string' ? description : ''),
      shuffleOptions: meta.shuffleOptions !== false,
      showCorrectAnswers: meta.showCorrectAnswers !== false,
      allowReview: meta.allowReview !== false,
    }
  } catch {
    return {
      originalDescription: typeof description === 'string' ? description : '',
      shuffleOptions: true,
      showCorrectAnswers: true,
      allowReview: true,
    }
  }
}

export function ustozQuizVariantlari(options) {
  if (Array.isArray(options)) return options
  if (Array.isArray(options?.texts)) return options.texts
  return []
}

export function indekslarniAralashtir(length, shuffle = true) {
  const indexes = Array.from({ length }, (_, index) => index)
  if (!shuffle) return indexes
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indexes[i], indexes[j]] = [indexes[j], indexes[i]]
  }
  return indexes
}

/** Ustoz quizida ko'rsatilgan indeksni token xaritasi orqali asl indeksga qaytarib baholaydi. */
export function ustozQuizJavoblariniBahola(questions, answers, questionIds, optionMaps) {
  if (!Array.isArray(questions) || !Array.isArray(answers) || !Array.isArray(questionIds)) {
    throw new Error("Quiz javoblari noto'g'ri shaklda")
  }

  const questionById = new Map(questions.map((question) => [question.id, question]))
  const answerById = new Map()
  for (const answer of answers) {
    if (!answer || typeof answer.questionId !== 'string' || answerById.has(answer.questionId)) {
      throw new Error("Bir savolga takroriy yoki yaroqsiz javob yuborildi")
    }
    if (!questionIds.includes(answer.questionId)) {
      throw new Error("Javob urinishdagi savollarga mos emas")
    }
    answerById.set(answer.questionId, answer)
  }

  let score = 0
  let maxScore = 0
  const normalizedAnswers = []
  const results = questionIds.map((questionId) => {
    const question = questionById.get(questionId)
    const options = ustozQuizVariantlari(question?.options)
    const optionMap = optionMaps[questionId]
    if (
      !question ||
      !Array.isArray(optionMap) ||
      optionMap.length !== options.length ||
      new Set(optionMap).size !== options.length ||
      optionMap.some((index) => !Number.isInteger(index) || index < 0 || index >= options.length)
    ) {
      throw new Error("Quiz varianti xaritasi yaroqsiz")
    }

    const selectedShown = answerById.has(questionId) ? Number(answerById.get(questionId).selected) : -1
    if (selectedShown !== -1 && (!Number.isInteger(selectedShown) || selectedShown >= optionMap.length || selectedShown < 0)) {
      throw new Error("Tanlangan variant noto'g'ri")
    }

    const selectedOriginal = selectedShown === -1 ? -1 : optionMap[selectedShown]
    const correctOriginal = Number(question.correctAnswer)
    const correctShown = optionMap.indexOf(correctOriginal)
    if (correctShown < 0) throw new Error("Savol bazasidagi to'g'ri javob noto'g'ri")

    const points = Number.isFinite(Number(question.points)) ? Number(question.points) : 1
    const isCorrect = selectedOriginal === correctOriginal
    maxScore += points
    if (isCorrect) score += points
    normalizedAnswers.push({ questionId, selected: selectedOriginal })

    return {
      questionId,
      questionText: question.questionText,
      options: optionMap.map((originalIndex) => options[originalIndex]),
      correctAnswer: correctShown,
      userAnswer: selectedShown,
      isCorrect,
      points: isCorrect ? points : 0,
      maxPoints: points,
      explanation: question.explanation,
    }
  })

  return {
    score,
    maxScore,
    percentage: maxScore > 0 ? (score / maxScore) * 100 : 0,
    normalizedAnswers,
    results,
  }
}

export function ustozQuizKirishTekshir(
  quiz,
  { userId, activeGroupIds = [], activeTeacherIds = [], codeValid = false } = {}
) {
  if (!quiz) {
    return { bor: false, sabab: null, needCode: false }
  }

  if (userId && quiz.teacherId === userId) {
    return { bor: true, sabab: "O'qituvchi (o'z testi)", needCode: false }
  }

  if (quiz.isDraft) {
    return { bor: false, sabab: null, needCode: false, draft: true }
  }

  let auditoriyaBor = false
  let sabab = null

  if (quiz.isPublic) {
    auditoriyaBor = true
    sabab = 'Ommaviy test'
  } else if (quiz.groupId) {
    if (activeGroupIds.includes(quiz.groupId)) {
      auditoriyaBor = true
      sabab = 'Guruh talabasi'
    }
  } else if (activeTeacherIds.includes(quiz.teacherId)) {
    auditoriyaBor = true
    sabab = 'Ustozning talabasi'
  }

  // Maxsus guruhga biriktirilgan yopiq testga begona guruh talabasi kira olmaydi
  if (!quiz.isPublic && quiz.groupId && !auditoriyaBor) {
    return { bor: false, sabab: null, needCode: false }
  }

  if (quiz.accessCode) {
    if (codeValid) {
      return { bor: true, sabab: 'Maxfiy kod orqali', needCode: false }
    }
    if (auditoriyaBor || !quiz.groupId) {
      return { bor: false, sabab: null, needCode: true }
    }
    return { bor: false, sabab: null, needCode: false }
  }

  if (auditoriyaBor) {
    return { bor: true, sabab, needCode: false }
  }

  return { bor: false, sabab: null, needCode: false }
}

export function yopiqQuizKirishTekshir(
  quiz,
  { userId, activeGroupIds = [], activeTeacherIds = [] } = {}
) {
  if (!quiz) {
    return { bor: false, isTeacher: false }
  }

  if (userId && quiz.teacherId === userId) {
    return { bor: true, isTeacher: true }
  }

  if (quiz.isDraft) {
    return { bor: false, isTeacher: false, draft: true }
  }

  if (quiz.groupId) {
    return { bor: activeGroupIds.includes(quiz.groupId), isTeacher: false }
  }

  return { bor: activeTeacherIds.includes(quiz.teacherId), isTeacher: false }
}

export function bahoTekshir(score, maxScore = 100) {
  const limit = Number(maxScore) > 0 ? Number(maxScore) : 100
  const parsed = Number(score)
  if (score === null || score === undefined || score === '' || !Number.isFinite(parsed)) {
    return { valid: false, error: "Ball son ko'rinishida kiritilishi kerak" }
  }
  const rounded = Math.round(parsed)
  if (rounded < 0 || rounded > limit) {
    return { valid: false, error: `Ball 0 dan ${limit} gacha bo'lishi kerak` }
  }
  return { valid: true, score: rounded }
}

