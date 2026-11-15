// lib/profil-tekshiruv.js
//
// Profil ma'lumotlarini tekshirish va tayyorlash yordamchilari.
//
// NEGA ALOHIDA MODUL. `/api/profil`, `/api/profil/collection`,
// `/api/users/[userId]`, `/api/profil/ustozlarim` va `/api/avatar/upload`
// ichidagi kiritilgan qiymatlarni tozalash va cheklovlar bitta joyda
// bo'lsa, takrorlash yo'qoladi va `node --test` bilan to'g'ridan-to'g'ri
// sinab ko'rish mumkin bo'ladi.
import { tozala as interfeysTozala } from './interfeys.js'

export function isPlainObject(val) {
  return Boolean(val && typeof val === 'object' && !Array.isArray(val))
}

const STRING_LIMITS = {
  fullName: 120,
  bio: 1000,
  location: 120,
  university: 180,
  faculty: 150,
  specialty: 150,
  academicDegree: 100,
  studentId: 80,
  telegram: 100,
  instagram: 100,
  linkedin: 200,
  github: 100,
  twitter: 100,
  website: 250,
  googleScholar: 300,
  orcid: 60,
}

export const NOTIFICATION_KEYS = [
  'email_new_assignment',
  'email_quiz_result',
  'email_friend_request',
  'email_announcement',
  'browser_enabled',
  'daily_digest',
  'weekly_report',
]

export const ODDIY_BILDIRISHNOMA = Object.freeze({
  email_new_assignment: true,
  email_quiz_result: true,
  email_friend_request: true,
  email_announcement: true,
  browser_enabled: false,
  daily_digest: false,
  weekly_report: true,
})

export const ODDIY_OQUV_MAQSADLARI = Object.freeze({
  dailyGoalMinutes: 30,
  dailyGoalQuestions: 20,
  learningStyle: 'visual',
  difficultyPreference: 'adaptive',
  language: 'uz',
})

const LEARNING_STYLES = ['visual', 'reading', 'kinesthetic']
const DIFFICULTIES = ['adaptive', 'easy', 'medium', 'hard']
const LANGUAGES = ['uz', 'ru', 'en']

export function bildirishnomaTozala(xom) {
  const natija = { ...ODDIY_BILDIRISHNOMA }
  if (!xom || typeof xom !== 'object' || Array.isArray(xom)) return natija
  for (const k of NOTIFICATION_KEYS) {
    if (xom[k] !== undefined) {
      natija[k] = Boolean(xom[k])
    }
  }
  return natija
}

export function oquvMaqsadTozala(xom) {
  if (!xom || typeof xom !== 'object' || Array.isArray(xom)) {
    return { ...ODDIY_OQUV_MAQSADLARI }
  }
  const daqiqa = Number(xom.dailyGoalMinutes)
  const savol = Number(xom.dailyGoalQuestions)
  return {
    dailyGoalMinutes: Number.isFinite(daqiqa)
      ? Math.min(720, Math.max(5, Math.round(daqiqa)))
      : ODDIY_OQUV_MAQSADLARI.dailyGoalMinutes,
    dailyGoalQuestions: Number.isFinite(savol)
      ? Math.min(500, Math.max(5, Math.round(savol)))
      : ODDIY_OQUV_MAQSADLARI.dailyGoalQuestions,
    learningStyle: LEARNING_STYLES.includes(xom.learningStyle)
      ? xom.learningStyle
      : ODDIY_OQUV_MAQSADLARI.learningStyle,
    difficultyPreference: DIFFICULTIES.includes(xom.difficultyPreference)
      ? xom.difficultyPreference
      : ODDIY_OQUV_MAQSADLARI.difficultyPreference,
    language: LANGUAGES.includes(xom.language)
      ? xom.language
      : ODDIY_OQUV_MAQSADLARI.language,
  }
}

function clampInt(raw, min, max, fallback) {
  const num = typeof raw === 'number' ? raw : parseInt(String(raw ?? ''), 10)
  if (!Number.isFinite(num) || !Number.isInteger(num)) return fallback
  return Math.min(max, Math.max(min, num))
}

/**
 * `PUT /api/profil` so'rov tanasidan faqat ruxsat etilgan maydonlarni ajratadi
 * va noto'g'ri/haddan tashqari qiymatlarni tozalaydi.
 */
export function profilYangilashTayyorla(data) {
  if (!isPlainObject(data)) return {}

  const updateData = {}

  for (const [key, maxLen] of Object.entries(STRING_LIMITS)) {
    if (data[key] === undefined) continue
    if (data[key] === null) {
      updateData[key] = null
      continue
    }
    if (typeof data[key] === 'string') {
      const trimmed = data[key].trim()
      updateData[key] = trimmed ? trimmed.slice(0, maxLen) : null
    }
  }

  if (data.birthDate !== undefined) {
    if (data.birthDate === null || data.birthDate === '') {
      updateData.birthDate = null
    } else if (typeof data.birthDate === 'string') {
      const date = new Date(data.birthDate)
      const yil = date.getUTCFullYear()
      const joriyYil = new Date().getUTCFullYear()
      if (!Number.isNaN(date.getTime()) && yil >= 1900 && yil <= joriyYil) {
        updateData.birthDate = date
      }
    }
  }

  if (data.level !== undefined) {
    if (data.level === null || data.level === '') {
      updateData.level = null
    } else {
      const parsed = Number(data.level)
      if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 10) {
        updateData.level = parsed
      }
    }
  }

  if (data.enrollmentYear !== undefined) {
    if (data.enrollmentYear === null || data.enrollmentYear === '') {
      updateData.enrollmentYear = null
    } else {
      const parsed = Number(data.enrollmentYear)
      if (Number.isInteger(parsed) && parsed >= 1950 && parsed <= 2100) {
        updateData.enrollmentYear = parsed
      }
    }
  }

  if (isPlainObject(data.notificationSettings)) {
    const cleanNotif = {}
    for (const k of NOTIFICATION_KEYS) {
      if (data.notificationSettings[k] !== undefined) {
        cleanNotif[k] = Boolean(data.notificationSettings[k])
      }
    }
    if (Object.keys(cleanNotif).length > 0) {
      updateData.notificationSettings = cleanNotif
    }
  }

  if (isPlainObject(data.interfaceSettings)) {
    updateData.interfaceSettings = interfeysTozala(data.interfaceSettings)
  }

  if (isPlainObject(data.learningPreferences)) {
    const lp = data.learningPreferences
    updateData.learningPreferences = {
      dailyGoalMinutes: clampInt(lp.dailyGoalMinutes, 5, 720, 30),
      dailyGoalQuestions: clampInt(lp.dailyGoalQuestions, 5, 500, 20),
      learningStyle: LEARNING_STYLES.includes(lp.learningStyle) ? lp.learningStyle : 'visual',
      difficultyPreference: DIFFICULTIES.includes(lp.difficultyPreference) ? lp.difficultyPreference : 'adaptive',
      language: LANGUAGES.includes(lp.language) ? lp.language : 'uz',
    }
  }

  return updateData
}

/**
 * `Friendship` yozuvlaridan qarama-qarshi foydalanuvchi obyektini ajratadi.
 * Ikkala tomondagi bog'lanish bitta `OR` so'rovidan kelganda ham ishlaydi.
 */
export function dostRoyxatidanAjrat(friendships, currentUserId) {
  if (!Array.isArray(friendships)) return []
  return friendships
    .map((f) => {
      const peer = f.user1Id === currentUserId ? f.user2 : f.user1
      if (!peer) return null
      return f.createdAt ? { ...peer, createdAt: f.createdAt } : peer
    })
    .filter(Boolean)
}

const MIME_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

/** Fayl nomidagi kengaytma o'rniga tekshirilgan MIME turidan xavfsiz kengaytma oladi. */
export function xavfsizRasmKengaytmasi(mimeType) {
  return MIME_EXTENSIONS[mimeType] || null
}

/**
 * Talaba ustoz guruhi havolasidan o'tganda mavjud yozuvga ko'ra qaror qabul qiladi.
 * Avval 'rad' bo'lgan yozuvda qayta `create` P2002 xatosini beradi — uni yangilash kerak.
 */
export function ustozQoshilQarori(existing) {
  if (!existing) return { amal: 'yarat' }
  if (existing.holat === 'faol') return { amal: 'allaqachon_faol' }
  return { amal: 'yangila', id: existing.id }
}

/**
 * Qayta do'stlik taklifi yuborilganda `@@unique([senderId, receiverId])`
 * tufayli P2002 xatosi chiqmasligi uchun mavjud yozuvni qayta faollashtirish kerak.
 */
export function dostTaklifQarori(existing) {
  if (!existing) return { amal: 'yarat' }
  if (existing.status === 'pending') return { amal: 'kutilmoqda' }
  return { amal: 'yangila', id: existing.id }
}

/** Ko'chat bosqichi ichidagi foizni bo'lish/NaN xatosiz [0..100] oralig'ida hisoblaydi. */
export function plantProgressPercent(plant) {
  if (!plant) return 0
  if (Number(plant.stage) >= 10) return 100
  const min = Number(plant.stageInfo?.min)
  const max = Number(plant.stageInfo?.max)
  const growth = Number(plant.growth)
  if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(growth) || max <= min) {
    return 0
  }
  return Math.min(100, Math.max(0, ((growth - min) / (max - min)) * 100))
}

/** Faoliyat tarixi so'rovidagi kunlar sonini xavfsiz [1..365] diapazonga cheklaydi. */
export function kunlarChegarasi(raw, fallback = 365) {
  return clampInt(raw, 1, 365, fallback)
}
