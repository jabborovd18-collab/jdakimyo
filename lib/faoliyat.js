// lib/faoliyat.js
//
// Faollik grafigi va kunlik seriyalar (streak) uchun sof hisoblash yordamchilari.
// Prisma ga bog'liq emas — serverda (`lib/streak.js`), mijozda
// (`components/ActivityHeatmap.jsx`) va `node --test` da bir xil ishlaydi.

export const TOSHKENT_SILJISH_MS = 5 * 60 * 60 * 1000
const KUN_MS = 86400000
const SANA_KALITI_RE = /^\d{4}-\d{2}-\d{2}$/

export const QISQA_OYLAR = [
  'Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn',
  'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek',
]

export const HAFTA_KUNLARI = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

export const FAOLLIK_TURLARI = ['quiz', 'video', 'compound', 'mission']

/**
 * Berilgan vaqtni O'zbekiston (UTC+5) kalendar sanasi kalitiga ("YYYY-MM-DD") aylantiradi.
 * Tayyor "YYYY-MM-DD" matn kelsa, brauzer mahalliy zonasiga surmasdan o'zini qaytaradi.
 */
export function toshkentSanaKaliti(value = new Date()) {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (SANA_KALITI_RE.test(trimmed)) return trimmed
  }

  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ''

  const toshkent = new Date(d.getTime() + TOSHKENT_SILJISH_MS)
  return toshkent.toISOString().slice(0, 10)
}

/**
 * Toshkent kalendar sanasiga mos `00:00:00.000Z` Date obyektini qaytaradi.
 * Postgres `@db.Date` ustunlari bilan TZ siljishisiz aniq tenglik beradi.
 */
export function toshkentUtcKun(value = new Date()) {
  const kalit = toshkentSanaKaliti(value)
  if (!kalit) return null
  const [yil, oy, kun] = kalit.split('-').map(Number)
  return new Date(Date.UTC(yil, oy - 1, kun))
}

/** "YYYY-MM-DD" kalitidan butun kun indeksini oladi (vaqt mintaqasidan mustaqil). */
export function kunIndeks(dateKey) {
  if (typeof dateKey !== 'string' || !SANA_KALITI_RE.test(dateKey.trim())) return null
  const [yil, oy, kun] = dateKey.trim().split('-').map(Number)
  const dt = new Date(Date.UTC(yil, oy - 1, kun))
  if (
    dt.getUTCFullYear() !== yil ||
    dt.getUTCMonth() !== oy - 1 ||
    dt.getUTCDate() !== kun
  ) {
    return null
  }
  return Math.floor(dt.getTime() / KUN_MS)
}

/** Ikki "YYYY-MM-DD" kaliti orasidagi kunlar farqi (`toKey - fromKey`). */
export function kunFarqi(fromKey, toKey) {
  const a = kunIndeks(fromKey)
  const b = kunIndeks(toKey)
  if (a === null || b === null) return null
  return b - a
}

/** Berilgan kalitdan `offsetDays` kun oldingi (yoki manfiy bo'lsa keyingi) sana kaliti. */
export function kunKalitidanOldin(dateKey, offsetDays = 0) {
  const idx = kunIndeks(dateKey)
  if (idx === null) return ''
  return new Date((idx - offsetDays) * KUN_MS).toISOString().slice(0, 10)
}

export function faollikDarajasi(totalActivities) {
  const n = Number(totalActivities) || 0
  if (n <= 0) return 0
  if (n === 1) return 1
  if (n <= 3) return 2
  if (n <= 6) return 3
  return 4
}

function normallashKun(entry) {
  if (!entry || typeof entry.date !== 'string') return null
  const date = entry.date.trim()
  if (kunIndeks(date) === null) return null

  const quizCount = Math.max(0, Number(entry.quizCount) || 0)
  const videoCount = Math.max(0, Number(entry.videoCount) || 0)
  const compoundCount = Math.max(0, Number(entry.compoundCount) || 0)
  const missionCount = Math.max(0, Number(entry.missionCount) || 0)
  const sum = quizCount + videoCount + compoundCount + missionCount
  const totalActivities = Math.max(sum, Number(entry.totalActivities) || 0)
  const totalXP = Math.max(0, Number(entry.totalXP) || 0)

  return {
    date,
    quizCount,
    videoCount,
    compoundCount,
    missionCount,
    totalXP,
    totalActivities,
  }
}

/**
 * Kunlik amallardan hozirgi va eng uzun o'quv seriyasini hisoblaydi.
 *
 * Agar kecha faol bo'lib, bugun hali amal bajarilmagan bo'lsa,
 * hozirgi seriya 0 ga tushirib yuborilmaydi (kun tugaguncha davom etadi).
 */
export function streakHisobla(activities = [], todayKey = toshkentSanaKaliti()) {
  const byIdx = new Map()
  for (const raw of Array.isArray(activities) ? activities : []) {
    const item = normallashKun(raw)
    if (!item || item.totalActivities <= 0) continue
    const idx = kunIndeks(item.date)
    if (idx !== null) byIdx.set(idx, item.totalActivities)
  }

  const sortedIdx = Array.from(byIdx.keys()).sort((a, b) => a - b)
  let maxStreak = 0
  let run = 0
  let prev = null
  for (const idx of sortedIdx) {
    run = prev !== null && idx === prev + 1 ? run + 1 : 1
    if (run > maxStreak) maxStreak = run
    prev = idx
  }

  const todayIdx = kunIndeks(todayKey)
  if (todayIdx === null) {
    return { currentStreak: 0, maxStreak, bugunFaolmi: false }
  }

  const bugunFaolmi = byIdx.has(todayIdx)
  let cursor = bugunFaolmi ? todayIdx : byIdx.has(todayIdx - 1) ? todayIdx - 1 : null
  let currentStreak = 0
  while (cursor !== null && byIdx.has(cursor)) {
    currentStreak += 1
    cursor -= 1
  }

  return { currentStreak, maxStreak, bugunFaolmi }
}

/**
 * Saytga kirish seriyasi (`User.currentStreak`) 2+ kun kirmaganda eskirib qolgan
 * bo'lsa (hali `ActivityPing` yetib kelmasdan oldin) haqiqiy holatni ko'rsatadi.
 */
export function effectiveVisitStreak(user, todayKey = toshkentSanaKaliti()) {
  if (!user) return 0
  const streak = Math.max(0, Number(user.currentStreak) || 0)
  if (!streak || !user.lastActive) return 0
  const lastKey = toshkentSanaKaliti(user.lastActive)
  const diff = kunFarqi(lastKey, todayKey)
  if (diff === null || diff > 1) return 0
  return streak
}

/**
 * Tanlangan kunlar oralig'i bo'yicha Dush–Yak ustunli heatmap to'rini va
 * ustunlar bilan sinxron oy yorliqlarini tuzadi.
 */
export function faollikJadvaliTuz(
  activities = [],
  { todayKey = toshkentSanaKaliti(), days = 365 } = {}
) {
  const endIdx = kunIndeks(todayKey)
  if (endIdx === null) return { weeks: [], monthLabels: [] }

  const safeDays = Math.min(365, Math.max(7, Math.floor(Number(days) || 365)))
  const startIdx = endIdx - (safeDays - 1)

  const mapByKey = new Map()
  for (const raw of Array.isArray(activities) ? activities : []) {
    const item = normallashKun(raw)
    if (item) mapByKey.set(item.date, item)
  }

  // Boshlanish haftasining dushanbasiga tekislaymiz (UTC day: 0=Yak..6=Shan -> Mon=0..Sun=6)
  const startDt = new Date(startIdx * KUN_MS)
  const mondayOffset = (startDt.getUTCDay() + 6) % 7
  const gridStartIdx = startIdx - mondayOffset

  const endDt = new Date(endIdx * KUN_MS)
  const endDayIndex = (endDt.getUTCDay() + 6) % 7
  const gridEndIdx = endIdx + (6 - endDayIndex)

  const weeks = []
  let currentWeek = []

  for (let idx = gridStartIdx; idx <= gridEndIdx; idx++) {
    if (idx < startIdx || idx > endIdx) {
      currentWeek.push(null)
    } else {
      const dateKey = new Date(idx * KUN_MS).toISOString().slice(0, 10)
      const activity = mapByKey.get(dateKey)
      const totalActivities = activity ? activity.totalActivities : 0
      currentWeek.push({
        date: dateKey,
        totalActivities,
        level: faollikDarajasi(totalActivities),
        quizCount: activity?.quizCount || 0,
        videoCount: activity?.videoCount || 0,
        compoundCount: activity?.compoundCount || 0,
        missionCount: activity?.missionCount || 0,
        totalXP: activity?.totalXP || 0,
        isToday: idx === endIdx,
      })
    }

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  // Ustun boshida yangi oy boshlanganda ustma-ust tushmaydigan oy belgilari
  const rawLabels = []
  let prevMonth = -1
  weeks.forEach((week, weekIndex) => {
    const firstDay = week.find(Boolean)
    if (!firstDay) return
    const monthIndex = Number(firstDay.date.slice(5, 7)) - 1
    if (monthIndex !== prevMonth) {
      rawLabels.push({ weekIndex, label: QISQA_OYLAR[monthIndex], monthIndex })
      prevMonth = monthIndex
    }
  })

  const labelByWeek = new Map()
  let lastPlacedWeek = -99
  for (const item of rawLabels) {
    // Birinchi ustunda atigi 1–2 kunlik eski oy qolgan bo'lsa va keyingi
    // ustunda yangi oy boshlansa, eski qisqa yorliqni o'chirib yangisini qo'yamiz
    if (item.weekIndex - lastPlacedWeek < 2) {
      if (lastPlacedWeek === 0) {
        labelByWeek.delete(0)
        labelByWeek.set(item.weekIndex, item.label)
        lastPlacedWeek = item.weekIndex
      }
      continue
    }
    labelByWeek.set(item.weekIndex, item.label)
    lastPlacedWeek = item.weekIndex
  }

  const monthLabels = weeks.map((_, idx) => labelByWeek.get(idx) || '')

  return { weeks, monthLabels }
}

/**
 * Faoliyat massivi bo'yicha jamlanma statistika va tur tarkibini hisoblaydi.
 */
export function faollikXulosasi(activities = [], todayKey = toshkentSanaKaliti()) {
  const items = (Array.isArray(activities) ? activities : [])
    .map(normallashKun)
    .filter(Boolean)

  let totalActivities = 0
  let activeDays = 0
  let totalXP = 0
  let quizCount = 0
  let videoCount = 0
  let compoundCount = 0
  let missionCount = 0
  let engFaolKun = null
  let bugungi = {
    date: todayKey,
    quizCount: 0,
    videoCount: 0,
    compoundCount: 0,
    missionCount: 0,
    totalXP: 0,
    totalActivities: 0,
  }

  for (const item of items) {
    totalActivities += item.totalActivities
    if (item.totalActivities > 0) activeDays += 1
    totalXP += item.totalXP
    quizCount += item.quizCount
    videoCount += item.videoCount
    compoundCount += item.compoundCount
    missionCount += item.missionCount

    if (item.date === todayKey) {
      bugungi = item
    }

    if (item.totalActivities > 0) {
      if (
        !engFaolKun ||
        item.totalActivities > engFaolKun.totalActivities ||
        (item.totalActivities === engFaolKun.totalActivities && item.totalXP > engFaolKun.totalXP) ||
        (item.totalActivities === engFaolKun.totalActivities &&
          item.totalXP === engFaolKun.totalXP &&
          item.date > engFaolKun.date)
      ) {
        engFaolKun = item
      }
    }
  }

  return {
    totalActivities,
    activeDays,
    totalXP,
    quizCount,
    videoCount,
    compoundCount,
    missionCount,
    bugungi,
    engFaolKun,
  }
}
