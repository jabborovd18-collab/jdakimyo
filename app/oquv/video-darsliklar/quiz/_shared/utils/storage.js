// app/oquv/video-darsliklar/quiz/nomlanishi/utils/storage.js

/**
 * LocalStorage kalitlari
 */
const STORAGE_KEYS = {
  nomlanishi: 'quiz_history_nomlanishi',
  fazoviy: 'quiz_history_fazoviy',
  izomeriyasi: 'quiz_history_izomeriyasi',
  kimyoviy_boglanish: 'quiz_history_kimyoviy_boglanish',
  video_darsliklar: 'quiz_history_video_darsliklar'
}

/**
 * Oldingi savollar ID larini olish
 * @param {string} quizName - quiz nomi (masalan: "nomlanishi")
 * @returns {number[]} - oldingi savollar ID lari massivi
 */
export function getPreviousIds(quizName) {
  if (typeof window === 'undefined') return []
  
  const key = STORAGE_KEYS[quizName] || `quiz_history_${quizName}`
  const stored = localStorage.getItem(key)
  
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error('[Storage] LocalStorage parse error:', error)
    return []
  }
}

/**
 * Quiz tarixini saqlash
 * @param {string} quizName - quiz nomi
 * @param {number[]} questionIds - yangi savollar ID lari
 */
export function saveQuizHistory(quizName, questionIds) {
  if (typeof window === 'undefined') return
  
  const key = STORAGE_KEYS[quizName] || `quiz_history_${quizName}`
  const previousIds = getPreviousIds(quizName)
  
  // Oxirgi 100 ta savolni saqlash
  const updatedIds = [...previousIds, ...questionIds].slice(-100)
  
  try {
    localStorage.setItem(key, JSON.stringify(updatedIds))
    console.log(`[Storage] ${questionIds.length} ta savol saqlandi. Jami: ${updatedIds.length}`)
  } catch (error) {
    console.error('[Storage] LocalStorage save error:', error)
  }
}

/**
 * Array ni aralashtirish (Fisher-Yates shuffle)
 * @param {Array} array - aralashtiriladigan massiv
 * @returns {Array} - aralashtirilgan massiv (yangi nusxa)
 */
function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Tasodifiy savollarni tanlash (smart randomization)
 * Oldingi savollarni chiqarib tashlaydi va qiyinlik bo'yicha balans qiladi
 * 
 * @param {Array} bank - savol bazasi (150 ta savol)
 * @param {number} count - nechta savol kerak (default: 20)
 * @param {number[]} previousIds - oldingi savollar ID lari
 * @returns {Array} - tanlangan savollar (har doim count ta!)
 */
export function getRandomQuestions(bank, count = 20, previousIds = []) {
  // 1. Oldingi savollarni chiqarib tashlash
  const available = bank.filter(q => !previousIds.includes(q.id))
  
  console.log(`[Randomizer] Mavjud savollar: ${available.length}/${bank.length}`)
  
  // 2. Agar yetarli bo'lmasa, eski savollarni qayta qo'shish
  if (available.length < count) {
    console.log(`[Randomizer] Yetarli savol yo'q (${available.length}/${count}). Barcha savollardan tanlanmoqda.`)
    return shuffle([...bank]).slice(0, count)
  }
  
  // 3. Qiyinlik bo'yicha guruhlash
  const easy = shuffle(available.filter(q => q.difficulty === "oson"))
  const medium = shuffle(available.filter(q => q.difficulty === "o'rta"))
  const hard = shuffle(available.filter(q => q.difficulty === "qiyin"))
  
  console.log(`[Randomizer] Qiyinlik bo'yicha: ${easy.length} oson, ${medium.length} o'rta, ${hard.length} qiyin`)
  
  // 4. Proporsional tanlash (30% oson, 50% o'rta, 20% qiyin)
  // Lekin mavjud bo'lganlaridan oshmaslik uchun Math.min ishlatamiz
  const easyCount = Math.min(Math.floor(count * 0.3), easy.length)
  const mediumCount = Math.min(Math.floor(count * 0.5), medium.length)
  const hardCount = Math.min(count - easyCount - mediumCount, hard.length)
  
  console.log(`[Randomizer] Tanlangan: ${easyCount} oson, ${mediumCount} o'rta, ${hardCount} qiyin`)
  
  const result = [
    ...easy.slice(0, easyCount),
    ...medium.slice(0, mediumCount),
    ...hard.slice(0, hardCount)
  ]
  
  console.log(`[Randomizer] Jami tanlangan: ${result.length}/${count}`)
  
  // 5. Agar yetarli bo'lmasa, qo'shimcha savollar qo'shish
  const remaining = count - result.length
  if (remaining > 0) {
    console.log(`[Randomizer] ${remaining} ta qo'shimcha savol kerak`)
    
    // Qolgan barcha savollarni yig'ish
    const allRemaining = [
      ...easy.slice(easyCount),
      ...medium.slice(mediumCount),
      ...hard.slice(hardCount)
    ]
    
    // Aralashtirib, keraklicha qo'shish
    const additionalQuestions = shuffle(allRemaining).slice(0, remaining)
    result.push(...additionalQuestions)
    
    console.log(`[Randomizer] ${additionalQuestions.length} ta qo'shimcha savol qo'shildi`)
  }
  
  // 6. Yakuniy aralashtirish
  const finalResult = shuffle(result)
  
  console.log(`[Randomizer] Yakuniy natija: ${finalResult.length} ta savol`)
  
  return finalResult
}

/**
 * Quiz tarixini tozalash
 * @param {string} quizName - quiz nomi
 */
export function clearQuizHistory(quizName) {
  if (typeof window === 'undefined') return
  
  const key = STORAGE_KEYS[quizName] || `quiz_history_${quizName}`
  
  try {
    localStorage.removeItem(key)
    console.log(`[Storage] ${quizName} tarixi tozalandi`)
  } catch (error) {
    console.error('[Storage] LocalStorage remove error:', error)
  }
}

/**
 * Barcha quiz tarixlarini tozalash
 */
export function clearAllQuizHistory() {
  if (typeof window === 'undefined') return
  
  Object.values(STORAGE_KEYS).forEach(key => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('[Storage] LocalStorage remove error:', error)
    }
  })
  
  console.log('[Storage] Barcha quiz tarixlari tozalandi')
}

/**
 * Quiz statistikasini olish
 * @param {string} quizName - quiz nomi
 * @returns {Object|null} - statistika yoki null
 */
export function getQuizStats(quizName) {
  if (typeof window === 'undefined') return null
  
  const key = `quiz_stats_${quizName}`
  const stored = localStorage.getItem(key)
  
  if (!stored) return null
  
  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error('[Storage] LocalStorage parse error:', error)
    return null
  }
}

/**
 * Quiz statistikasini yangilash
 * @param {string} quizName - quiz nomi
 * @param {Object} result - test natijasi {total, correct}
 */
export function updateQuizStats(quizName, result) {
  if (typeof window === 'undefined') return
  
  const key = `quiz_stats_${quizName}`
  const currentStats = getQuizStats(quizName) || {
    totalTests: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    averageScore: 0
  }
  
  const updatedStats = {
    totalTests: currentStats.totalTests + 1,
    totalQuestions: currentStats.totalQuestions + result.total,
    correctAnswers: currentStats.correctAnswers + result.correct,
    averageScore: (currentStats.correctAnswers + result.correct) / (currentStats.totalQuestions + result.total)
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(updatedStats))
    console.log(`[Storage] ${quizName} statistikasi yangilandi: ${updatedStats.averageScore.toFixed(2)}`)
  } catch (error) {
    console.error('[Storage] LocalStorage save error:', error)
  }
}