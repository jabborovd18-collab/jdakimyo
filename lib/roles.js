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

/** Ustoz panelga kirish huquqi ('ustoz' — eski yozuvlar uchun qoldirilgan) */
export function isTeacherRole(role) {
  return ['teacher', 'ustoz', 'superadmin'].includes(role)
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
