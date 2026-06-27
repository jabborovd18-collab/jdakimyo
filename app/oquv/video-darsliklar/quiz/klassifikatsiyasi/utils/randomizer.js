// app/oquv/video-darsliklar/quiz/nomlanishi/utils/randomizer.js

/**
 * Array ni aralashtirish (Fisher-Yates shuffle algoritmi)
 * @param {Array} array - aralashtiriladigan massiv
 * @returns {Array} - aralashtirilgan massiv (yangi nusxa)
 */
export function shuffle(array) {
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
 * @returns {Array} - tanlangan savollar
 */
export function getRandomQuestions(bank, count = 20, previousIds = []) {
  // 1. Oldingi savollarni chiqarib tashlash
  const available = bank.filter(q => !previousIds.includes(q.id))
  
  // 2. Agar yetarli bo'lmasa, eski savollarni qayta qo'shish
  if (available.length < count) {
    console.log(`[Randomizer] Yetarli savol yo'q (${available.length}/${count}). Eski savollar qayta qo'shilmoqda.`)
    return shuffle([...bank]).slice(0, count)
  }
  
  // 3. Qiyinlik bo'yicha guruhlash
  const easy = available.filter(q => q.difficulty === "oson")
  const medium = available.filter(q => q.difficulty === "o'rta")
  const hard = available.filter(q => q.difficulty === "qiyin")
  
  // 4. Proporsional tanlash (30% oson, 50% o'rta, 20% qiyin)
  const easyCount = Math.floor(count * 0.3)
  const mediumCount = Math.floor(count * 0.5)
  const hardCount = count - easyCount - mediumCount
  
  console.log(`[Randomizer] Savollar taqsimoti: ${easyCount} oson, ${mediumCount} o'rta, ${hardCount} qiyin`)
  
  const result = [
    ...shuffle(easy).slice(0, easyCount),
    ...shuffle(medium).slice(0, mediumCount),
    ...shuffle(hard).slice(0, hardCount)
  ]
  
  // 5. Yakuniy aralashtirish
  return shuffle(result)
}

/**
 * Weighted random (adaptive testing uchun)
 * Oldingi natijaga qarab qiyinlikni sozlash
 * 
 * @param {Array} bank - savol bazasi
 * @param {number} count - nechta savol kerak
 * @param {number} previousScore - oldingi test natijasi (0-1)
 * @param {number[]} previousIds - oldingi savollar ID lari
 * @returns {Array} - tanlangan savollar
 */
export function getAdaptiveQuestions(bank, count = 20, previousScore = 0.5, previousIds = []) {
  // Oldingi savollarni chiqarib tashlash
  const available = bank.filter(q => !previousIds.includes(q.id))
  
  // Qiyinlik bo'yicha guruhlash
  const easy = available.filter(q => q.difficulty === "oson")
  const medium = available.filter(q => q.difficulty === "o'rta")
  const hard = available.filter(q => q.difficulty === "qiyin")
  
  // Adaptive taqsimot
  let easyRatio, mediumRatio, hardRatio
  
  if (previousScore < 0.5) {
    // Yomon natija → ko'proq oson savollar
    easyRatio = 0.7
    mediumRatio = 0.3
    hardRatio = 0.0
  } else if (previousScore > 0.8) {
    // Yaxshi natija → ko'proq qiyin savollar
    easyRatio = 0.2
    mediumRatio = 0.4
    hardRatio = 0.4
  } else {
    // O'rtacha natija → standart taqsimot
    easyRatio = 0.3
    mediumRatio = 0.5
    hardRatio = 0.2
  }
  
  const easyCount = Math.floor(count * easyRatio)
  const mediumCount = Math.floor(count * mediumRatio)
  const hardCount = count - easyCount - mediumCount
  
  console.log(`[Adaptive] Score: ${previousScore}, Taqsimot: ${easyCount} oson, ${mediumCount} o'rta, ${hardCount} qiyin`)
  
  const result = [
    ...shuffle(easy).slice(0, easyCount),
    ...shuffle(medium).slice(0, mediumCount),
    ...shuffle(hard).slice(0, hardCount)
  ]
  
  return shuffle(result)
}

/**
 * Tag-based filtering (mavzu bo'yicha savollar)
 * 
 * @param {Array} bank - savol bazasi
 * @param {string[]} tags - kerakli taglar massivi
 * @param {number} count - nechta savol kerak
 * @param {number[]} previousIds - oldingi savollar ID lari
 * @returns {Array} - tanlangan savollar
 */
export function getQuestionsByTag(bank, tags, count = 20, previousIds = []) {
  // Tag bo'yicha filtrlash
  const filtered = bank.filter(q => 
    q.tags.some(tag => tags.includes(tag))
  )
  
  // Oldingi savollarni chiqarib tashlash
  const available = filtered.filter(q => !previousIds.includes(q.id))
  
  // Agar yetarli bo'lmasa, barcha filtrlangan savollarni qaytarish
  if (available.length < count) {
    console.log(`[Tag] Yetarli savol yo'q (${available.length}/${count}). Barcha filtrlangan savollar qaytarilmoqda.`)
    return shuffle(filtered).slice(0, count)
  }
  
  return shuffle(available).slice(0, count)
}

/**
 * Aralash strategiya (tag + difficulty)
 * 
 * @param {Array} bank - savol bazasi
 * @param {string[]} tags - kerakli taglar (ixtiyoriy)
 * @param {string} difficulty - qiyinlik (ixtiyoriy)
 * @param {number} count - nechta savol kerak
 * @param {number[]} previousIds - oldingi savollar ID lari
 * @returns {Array} - tanlangan savollar
 */
export function getMixedQuestions(bank, tags = [], difficulty = null, count = 20, previousIds = []) {
  let available = bank
  
  // Tag bo'yicha filtrlash (agar berilgan bo'lsa)
  if (tags.length > 0) {
    available = available.filter(q => 
      q.tags.some(tag => tags.includes(tag))
    )
  }
  
  // Qiyinlik bo'yicha filtrlash (agar berilgan bo'lsa)
  if (difficulty) {
    available = available.filter(q => q.difficulty === difficulty)
  }
  
  // Oldingi savollarni chiqarib tashlash
  available = available.filter(q => !previousIds.includes(q.id))
  
  // Agar yetarli bo'lmasa, barcha savollarni qaytarish
  if (available.length < count) {
    console.log(`[Mixed] Yetarli savol yo'q (${available.length}/${count}). Barcha savollar qaytarilmoqda.`)
    return shuffle(bank.filter(q => !previousIds.includes(q.id))).slice(0, count)
  }
  
  return shuffle(available).slice(0, count)
}

/**
 * Randomizatsiya statistikasini hisoblash
 * 
 * @param {Array} selected - tanlangan savollar
 * @returns {Object} - statistika
 */
export function getRandomizationStats(selected) {
  const stats = {
    total: selected.length,
    easy: 0,
    medium: 0,
    hard: 0,
    tags: {}
  }
  
  selected.forEach(q => {
    // Qiyinlik statistikasi
    if (q.difficulty === "oson") stats.easy++
    else if (q.difficulty === "o'rta") stats.medium++
    else if (q.difficulty === "qiyin") stats.hard++
    
    // Tag statistikasi
    q.tags.forEach(tag => {
      stats.tags[tag] = (stats.tags[tag] || 0) + 1
    })
  })
  
  return stats
}