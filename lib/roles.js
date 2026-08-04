// lib/roles.js
// Rollarning YAGONA manbasi. Avval ular register sahifasi, register API,
// admin panel va profil layout'ida alohida-alohida (va bir-biriga zid) ta'riflangan edi.
//
// Rollar ikki turga bo'linadi:
//   AKADEMIK   — foydalanuvchi ro'yxatdan o'tishda o'zi tanlaydi, hech qanday imtiyoz bermaydi
//   IMTIYOZLI  — panellarga kirish huquqini beradi, FAQAT admin panel orqali beriladi
//
// ⚠️ Yangi rol qo'shganda diqqat: AKADEMIK ro'yxatdagi rol hech qachon
// isAdminRole/isTeacherRole tekshiruvidan o'tmasligi kerak, aks holda
// ro'yxatdan o'tishning o'zi imtiyoz olish yo'liga aylanadi.

export const ACADEMIC_ROLES = {
  bakalavr:  { label: 'Bakalavr',              icon: '🎓', badge: 'bg-blue-600/20 text-blue-400 border-blue-600/30' },
  magistr:   { label: 'Magistr',               icon: '📚', badge: 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30' },
  doktorant: { label: 'Doktorant',             icon: '🔬', badge: 'bg-teal-600/20 text-teal-400 border-teal-600/30' },
  professor: { label: 'Professor',             icon: '🎖️', badge: 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30' },
  mustaqil:  { label: "Mustaqil o'rganuvchi",  icon: '🧭', badge: 'bg-purple-600/20 text-purple-400 border-purple-600/30' },
}

export const PRIVILEGED_ROLES = {
  teacher:    { label: 'Ustoz',       icon: '👨‍🏫', badge: 'bg-green-600/20 text-green-400 border-green-600/30' },
  hamkor:     { label: 'Hamkor',      icon: '🤝',   badge: 'bg-pink-600/20 text-pink-400 border-pink-600/30' },
  moderator:  { label: 'Moderator',   icon: '🛡️',   badge: 'bg-purple-600/20 text-purple-400 border-purple-600/30' },
  admin:      { label: 'Admin',       icon: '⚡',   badge: 'bg-orange-600/20 text-orange-400 border-orange-600/30' },
  superadmin: { label: 'Super Admin', icon: '👑',   badge: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30' },
}

export const ALL_ROLES = { ...ACADEMIC_ROLES, ...PRIVILEGED_ROLES }

/** Ro'yxatdan o'tishda o'zi tanlashi mumkin bo'lgan rollar */
export const SELF_REGISTER_ROLES = Object.keys(ACADEMIC_ROLES)

/** Admin panelda berilishi mumkin bo'lgan barcha rollar */
export const ASSIGNABLE_ROLES = Object.keys(ALL_ROLES)

export const DEFAULT_ROLE = 'bakalavr'

/** Admin panelga kirish huquqi */
export function isAdminRole(role) {
  return ['admin', 'superadmin', 'moderator'].includes(role)
}

/**
 * Ustoz panelga kirish huquqi.
 *
 * USTOZLIK — IKKILAMCHI. Avval u `role` maydonining qiymati edi va
 * shuning uchun adminlik bilan birga tura olmasdi: odamga admin berilishi
 * bilan ustoz paneli yo'qolardi. Endi `isTeacher` alohida bayroq, asosiy
 * rol esa o'zgarmaydi.
 *
 * Foydalanuvchi obyektini ham, eski usulda rol satrini ham qabul qiladi —
 * chaqiruv joylari ko'p, hammasini bir vaqtda o'zgartirish shart emas.
 * Satr berilganda faqat eski `teacher`/`ustoz` qiymatlari tanib olinadi.
 *
 * Superadmin har doim kiradi: u tizimni sozlaydigan odam va unga
 * alohida bayroq qo'yishni talab qilish faqat chalkashtiradi.
 */
export function isTeacherRole(userOrRole) {
  if (userOrRole && typeof userOrRole === 'object') {
    if (userOrRole.isTeacher) return true
    return isSuperAdmin(userOrRole.role)
  }
  // Eski chaqiruvlar: rol satri. `teacher`/`ustoz` — migratsiyagacha
  // yaratilgan hisoblar uchun.
  return ['teacher', 'ustoz', 'superadmin'].includes(userOrRole)
}

/**
 * Ustoz paneli API'lari uchun yagona tekshiruv.
 *
 * NEGA ALOHIDA. Bu ro'yxat 26 ta marshrutda qo'lda takrorlangan edi va
 * `isTeacherRole` bilan zid tushib qolgandi: API'lar `admin` va
 * `moderator` ni kiritardi, UI esa ularga havolani ko'rsatmasdi. Odam
 * panelga kira olardi-yu, unga yo'l topa olmasdi.
 *
 * MODERATOR ATAYLAB CHIQARILDI. `adminHuquqlari` bo'yicha unda
 * `foydalanuvchilar: false`, ya'ni u foydalanuvchi ma'lumotini ko'rmasligi
 * kerak. Ustoz paneli esa aynan shuni ochadi: talabalar ro'yxati, email,
 * natijalar. Ikki qoida bir-biriga zid turmasin.
 */
export function ustozPaneliOchiqmi(user) {
  if (!user) return false
  if (user.isTeacher) return true
  return ['teacher', 'ustoz', 'admin', 'superadmin'].includes(user.role)
}

/** Hamkor dashboardiga kirish huquqi — kanal shu yerdan yuritiladi */
export function isPartnerRole(role) {
  return ['hamkor', 'superadmin'].includes(role)
}

export function isSuperAdmin(role) {
  return role === 'superadmin'
}

/**
 * Hisobni tasdiqlash (galochka) huquqi — FAQAT superadminda.
 *
 * Nega shunchalik tor: galochkaning butun ma'nosi "bu haqiqiy odam,
 * tekshirilgan" degani. Uni ko'p odam tarqata olsa, belgi qiymatini
 * yo'qotadi va soxta hisobni ajratish uchun ishlamay qoladi.
 */
export function tasdiqlashHuquqiBormi(role) {
  return isSuperAdmin(role)
}

/**
 * Admin panel ichida kim nimani ko'radi.
 *
 * NEGA ALOHIDA JADVAL. Avval tekshiruv har bir sahifa va API ichida
 * qo'lda yozilgan edi (`['admin','superadmin','moderator'].includes(...)`),
 * ya'ni moderatorga nimadir yopilishi kerak bo'lsa, uni o'nlab joyda
 * eslab qolish kerak edi. Bitta joyda bo'lsa, unutib qoldirish qiyin.
 *
 * MODERATOR — kontent va tozalash uchun: quiz qo'shadi, ma'lumot
 * kiritadi, noto'g'ri izohni o'chiradi. Foydalanuvchilar ro'yxati,
 * valyuta, kanal statistikasi va qaydnoma unga YOPIQ: bular nazorat
 * ma'lumoti va ular uchun javobgarlik boshqa darajada.
 */
const HUQUQLAR = {
  superadmin: {
    kontent: true, moderatsiya: true, gamifikatsiya: true,
    foydalanuvchilar: true, sertifikatlar: true, pul: true,
    kanallar: true, qaydnoma: true, sozlamalar: true, statistika: true,
  },
  admin: {
    kontent: true, moderatsiya: true, gamifikatsiya: true,
    foydalanuvchilar: true, sertifikatlar: true, pul: true,
    // Kanal ochish va qaydnoma — faqat superadminda
    kanallar: false, qaydnoma: false, sozlamalar: true, statistika: true,
  },
  moderator: {
    kontent: true, moderatsiya: true, gamifikatsiya: false,
    foydalanuvchilar: false, sertifikatlar: false, pul: false,
    kanallar: false, qaydnoma: false, sozlamalar: false, statistika: false,
  },
}

/** Rolga tegishli huquqlar to'plami. Noma'lum rol — hech narsa. */
export function adminHuquqlari(role) {
  return HUQUQLAR[role] || {
    kontent: false, moderatsiya: false, gamifikatsiya: false,
    foydalanuvchilar: false, sertifikatlar: false, pul: false,
    kanallar: false, qaydnoma: false, sozlamalar: false, statistika: false,
  }
}

/** Bitta huquqni tekshirish: `huquqiBormi(role, 'foydalanuvchilar')` */
export function huquqiBormi(role, huquq) {
  return Boolean(adminHuquqlari(role)[huquq])
}

/** Noma'lum rol kelsa ham UI buzilmasligi uchun xavfsiz qaytaruvchi */
export function roleInfo(role) {
  return ALL_ROLES[role] || {
    label: role || 'Foydalanuvchi',
    icon: '👤',
    badge: 'bg-slate-600/20 text-slate-300 border-slate-600/30',
  }
}

/** Badge + nom bilan birga ko'rsatish uchun: "🎓 Bakalavr" */
export function roleLabel(role) {
  const info = roleInfo(role)
  return `${info.icon} ${info.label}`
}
