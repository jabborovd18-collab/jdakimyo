// lib/admin-yordamchi.js
// Admin paneli va API'lari uchun umumiy, sof yordamchi funksiyalar.
import { MISSIYA_TURLARI, MISSIYA_TUR_KODI } from './missions-turlari.js'
import { TARIF } from './sayt-malumot.js'

/** Foydalanuvchilar ro'yxatida ruxsat etilgan tartiblash ustunlari */
export const USER_SORT_FIELDS = [
  'createdAt',
  'lastActive',
  'totalPoints',
  'level_points',
  'coins',
  'gems',
  'stars',
  'currentStreak',
  'username',
  'fullName',
]

export function adminUsersSortQuery(sortBy, sortOrder) {
  const field = USER_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt'
  const order = sortOrder === 'asc' ? 'asc' : 'desc'
  return { [field]: order }
}

/**
 * Dashboard va MS sahifasida `jadvalHolatiAniqlash` qaytargan holatlar
 * bilan 100% mos badge ma'lumoti.
 */
const MS_HOLAT_JADVALI = {
  ochiq: { matn: 'Ochiq (online)', tone: 'success' },
  kutilmoqda: { matn: 'Kutilmoqda', tone: 'info' },
  kutish: { matn: 'Kutilmoqda', tone: 'info' },
  tekshirilmoqda: { matn: "E'lon kutmoqda", tone: 'warning' },
  elon_qilindi: { matn: "E'lon qilingan", tone: 'primary' },
  yopiq: { matn: 'Yakunlangan', tone: 'neutral' },
  belgilanmagan: { matn: 'Belgilanmagan', tone: 'neutral' },
}

export function msDashboardHolatInfo(holat) {
  return MS_HOLAT_JADVALI[holat] || MS_HOLAT_JADVALI.belgilanmagan
}

/** v4 kunlik missiyalar uchun ruxsat etilgan turlar (`lib/missions-turlari.js` dan) */
export const MISSION_VALID_TYPES = MISSIYA_TUR_KODI
export const ADMIN_MISSION_TYPES = MISSIYA_TURLARI

export function isValidMissionType(type) {
  return MISSION_VALID_TYPES.includes(type)
}

/** Audit log targetType filtrlari — haqiqiy DB qiymatlariga moslangan */
export const AUDIT_TARGET_TURLARI = [
  { id: 'User', label: 'Foydalanuvchilar', dbValues: ['User', 'user'] },
  { id: 'MsImtihon', label: 'Milliy Sertifikat', dbValues: ['MsImtihon'] },
  { id: 'Certificate', label: 'Sertifikatlar', dbValues: ['Certificate'] },
  { id: 'QuizQuestion', label: 'Quiz savollari', dbValues: ['QuizQuestion', 'quiz'] },
  { id: 'Reaction', label: 'Reaksiyalar', dbValues: ['Reaction'] },
  { id: 'DailyQuote', label: 'Kunlik iqtiboslar', dbValues: ['DailyQuote'] },
  { id: 'DailyMission', label: 'Kunlik missiyalar', dbValues: ['DailyMission'] },
  { id: 'ForumPost', label: 'Muhokama', dbValues: ['ForumPost'] },
  { id: 'ChatReport', label: 'Chat nazorati', dbValues: ['ChatReport'] },
  { id: 'Channel', label: 'Kanallar', dbValues: ['Channel'] },
  { id: 'Telegram', label: 'Telegram bot', dbValues: ['Telegram'] },
  { id: 'ai_gateway', label: 'JDA AI Gateway', dbValues: ['ai_gateway', 'ai_cache', 'ai_settings'] },
  { id: 'report', label: 'Shikoyatlar', dbValues: ['report', 'Report'] },
  { id: 'settings', label: 'Sayt sozlamalari', dbValues: ['settings', 'Settings'] },
  { id: 'system', label: 'Tizim', dbValues: ['system', 'Tizim'] },
]

export function normalizeLogTargetWhere(targetType) {
  if (!targetType || targetType === 'all') return undefined
  const guruh = AUDIT_TARGET_TURLARI.find(
    (t) => t.id.toLowerCase() === String(targetType).toLowerCase()
  )
  if (guruh) {
    return guruh.dbValues.length === 1 ? guruh.dbValues[0] : { in: guruh.dbValues }
  }
  return targetType
}

/** `SiteSettings` uchun mijozdan keladigan maydonlarning qat'iy oq ro'yxati */
export function buildSiteSettingsData(data = {}) {
  const num = (v, fallback) => {
    const n = Number.parseInt(v, 10)
    return Number.isFinite(n) ? Math.max(0, n) : fallback
  }
  const questionsPerQuiz = Math.min(100, Math.max(1, num(data.questionsPerQuiz, 20)))
  const rawTime = data.quizTimeLimit === '' || data.quizTimeLimit === null || data.quizTimeLimit === undefined
    ? null
    : Math.min(300, Math.max(5, num(data.quizTimeLimit, 30)))

  return {
    siteName: typeof data.siteName === 'string' && data.siteName.trim()
      ? data.siteName.trim().slice(0, 80)
      : 'JDA KIMYO',
    siteDescription: typeof data.siteDescription === 'string' && data.siteDescription.trim()
      ? data.siteDescription.trim().slice(0, 500)
      : TARIF,
    logo: typeof data.logo === 'string' && data.logo.trim() ? data.logo.trim().slice(0, 500) : null,
    favicon: typeof data.favicon === 'string' && data.favicon.trim() ? data.favicon.trim().slice(0, 500) : null,
    maintenanceMode: Boolean(data.maintenanceMode),
    maintenanceMessage: typeof data.maintenanceMessage === 'string' && data.maintenanceMessage.trim()
      ? data.maintenanceMessage.trim().slice(0, 500)
      : null,
    footerText: typeof data.footerText === 'string' && data.footerText.trim()
      ? data.footerText.trim().slice(0, 300)
      : null,
    contactEmail: typeof data.contactEmail === 'string' && data.contactEmail.trim()
      ? data.contactEmail.trim().slice(0, 120)
      : null,
    contactPhone: typeof data.contactPhone === 'string' && data.contactPhone.trim()
      ? data.contactPhone.trim().slice(0, 60)
      : null,
    telegramGroup: typeof data.telegramGroup === 'string' && data.telegramGroup.trim()
      ? data.telegramGroup.trim().slice(0, 200)
      : null,
    instagramLink: typeof data.instagramLink === 'string' && data.instagramLink.trim()
      ? data.instagramLink.trim().slice(0, 200)
      : null,
    defaultXpCommon: num(data.defaultXpCommon, 10),
    defaultXpRare: num(data.defaultXpRare, 50),
    defaultXpEpic: num(data.defaultXpEpic, 100),
    defaultXpLegendary: num(data.defaultXpLegendary, 500),
    questionsPerQuiz,
    quizTimeLimit: rawTime,
  }
}

export function formatKompaktSon(qiymat) {
  const n = Number(qiymat) || 0
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString('uz-UZ')
}
