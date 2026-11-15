// lib/auth-tekshiruv.js
// Kirish, ro'yxatdan o'tish va Google OAuth uchun sof yordamchi funksiyalar.
// Brauzerda ham, serverda ham, node:test da ham birdek ishlaydi (Prisma yo'q).

export const USERNAME_PATTERN = /^[a-z0-9._]{3,30}$/
export const PAROL_MIN = 6
export const PAROL_MAX = 128

const BIR_MARTALIK_DOMENLAR = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', '10minutemail.com',
  'tempmail.com', 'temp-mail.org', 'throwawaymail.com', 'yopmail.com',
  'trashmail.com', 'sharklasers.com', 'getnada.com', 'maildrop.cc',
  'dispostable.com', 'fakeinbox.com', 'mohmal.com', 'emailondeck.com',
  'moakt.com', 'tempail.com', 'mailnesia.com', 'spamgourmet.com',
])

const EMAIL_NAQSH = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/
const QAYTISH_TAQIQ_YOLLARI = ['/login', '/register', '/api/auth']

/**
 * Email shaklan to'g'rimi va bir martalik domen emasmi.
 * @param {string} email
 * @returns {{ok: true} | {ok: false, xato: string}}
 */
export function emailniTekshir(email) {
  const manzil = String(email || '').trim().toLowerCase()

  if (!manzil) return { ok: false, xato: 'Email kiriting' }
  if (manzil.length > 254) return { ok: false, xato: 'Email juda uzun' }
  if (!EMAIL_NAQSH.test(manzil)) return { ok: false, xato: "Email manzili noto'g'ri yozilgan" }

  const domen = manzil.split('@')[1]
  if (BIR_MARTALIK_DOMENLAR.has(domen)) {
    return {
      ok: false,
      xato: 'Vaqtinchalik pochta xizmatlari qabul qilinmaydi. Doimiy manzilingizni kiriting.',
    }
  }

  return { ok: true }
}

function manzilHalqasimi(pathname) {
  return QAYTISH_TAQIQ_YOLLARI.some(
    (y) => pathname === y || pathname.startsWith(`${y}/`)
  )
}

/**
 * Ochiq yo'naltirish (open redirect) va login-halqa xavfini to'sadi.
 * Faqat sayt ichidagi xavfsiz yo'lni qaytaradi.
 */
export function xavfsizQaytishManzili(raw, fallback = '/profil', hozirgiOrigin = null) {
  if (typeof raw !== 'string') return fallback
  const matn = raw.trim()
  if (!matn || matn.startsWith('//') || matn.includes('\\')) return fallback

  try {
    const asos = hozirgiOrigin || 'https://www.jdakimyo.uz'
    if (matn.startsWith('/')) {
      const parsed = new URL(matn, asos)
      if (parsed.origin !== asos) return fallback
      if (manzilHalqasimi(parsed.pathname)) return fallback
      return `${parsed.pathname}${parsed.search}${parsed.hash}`
    }

    if (hozirgiOrigin) {
      const parsed = new URL(matn)
      if (parsed.origin !== hozirgiOrigin) return fallback
      if (manzilHalqasimi(parsed.pathname)) return fallback
      return `${parsed.pathname}${parsed.search}${parsed.hash}`
    }
  } catch {
    return fallback
  }

  return fallback
}

/**
 * NextAuth callbacks.redirect uchun bir xil origin va halqa himoyasi.
 */
export function nextAuthYonaltirishManzili(url, baseUrl) {
  const asos = (baseUrl || 'https://www.jdakimyo.uz').replace(/\/+$/, '')
  const nisbiy = xavfsizQaytishManzili(url, '/profil', asos)
  return `${asos}${nisbiy}`
}

const NEXTAUTH_XATOLARI = {
  AccessDenied: "Google orqali kirish rad etildi. Jarayonni bekor qilgan bo'lishingiz yoki hisobga ruxsat yopiq bo'lishi mumkin.",
  HisobBloklangan: "Hisobingiz bloklangan. Batafsil ma'lumot uchun administrator bilan bog'laning.",
  GoogleEmailTopilmadi: "Google hisobingizdan elektron pochta manzili olinmadi.",
  TasdiqlanmaganGoogleEmail: "Google pochtangiz tasdiqlanmagan. Avval Google hisobingizda pochtani tasdiqlang.",
  OAuthAccountNotLinked: "Ushbu email bilan boshqa kirish usuli bog'langan. Login va parol bilan kirib ko'ring.",
  Configuration: "Google kirish sozlamalarida xatolik bor. Administratorga murojaat qiling.",
  OAuthCallback: "Google bilan bog'lanishda xatolik yuz berdi. Qayta urinib ko'ring yoki oddiy login bilan kiring.",
  OAuthSignin: "Google kirish oynasini ochib bo'lmadi. Internet va qayta urinishni tekshiring.",
  OAuthCreateAccount: "Google hisobi uchun profil yaratishda muammo chiqdi. Qayta urinib ko'ring.",
  EmailCreateAccount: "Email orqali hisob yaratishda xatolik yuz berdi.",
  EmailSignin: "Email havolasi orqali kirib bo'lmadi.",
  Callback: "Tasdiqlash jarayonida xatolik yuz berdi. Qayta urinib ko'ring.",
  CredentialsSignin: "Login yoki parol noto'g'ri.",
  SessionRequired: "Davom etish uchun hisobingizga kiring.",
  Verification: "Tasdiqlash muddati tugagan. Qayta urinib ko'ring.",
  Default: "Kirishda kutilmagan xatolik yuz berdi.",
}

/**
 * NextAuth xato kodi yoki server xabarini tushunarli o'zbekcha matnga aylantiradi.
 */
export function authXatoMatni(xato, { kontekst = 'kirish' } = {}) {
  if (!xato || typeof xato !== 'string') {
    return kontekst === 'royxat'
      ? "Ro'yxatdan o'tishda xatolik yuz berdi"
      : "Kirishda xatolik yuz berdi"
  }

  const toza = xato.trim()
  if (NEXTAUTH_XATOLARI[toza]) {
    return NEXTAUTH_XATOLARI[toza]
  }

  // Texnik inglizcha/baza xabarlarini foydalanuvchiga chiqarmaymiz
  const texnikBelgilar = /(prisma|econnrefused|fetch failed|unexpected token|syntaxerror|invalid `prisma|p20\d{2}|stack|jwt|secret|oauth)/i
  if (texnikBelgilar.test(toza)) {
    return NEXTAUTH_XATOLARI.Default
  }

  return toza.slice(0, 240)
}

/**
 * JWT cookie hajmi kichik qolishi uchun faqat qisqa URL ni saqlaydi.
 */
export function xavfsizJwtAvatar(avatar) {
  if (typeof avatar !== 'string') return null
  const toza = avatar.trim()
  if (!toza || toza.length > 512 || toza.startsWith('data:')) return null
  return toza
}

/**
 * Bo'shatilgan JWT ({}) yoki muddati o'tgan doska sessiyasini rad etadi.
 */
export function sessiyaYaroqliPayload(token, hozir = Date.now()) {
  if (!token || typeof token !== 'object' || !token.sub) return false
  if (token.doskaTugaydi && hozir > Number(token.doskaTugaydi)) return false
  return true
}

/**
 * Brauzer parol menejeri React onChange ni ishga tushirmay to'ldirib qo'ygan
 * holatlarda ham yuborish vaqtida haqiqiy DOM maydon qiymatlarini oladi.
 */
export function loginFormQiymatlari(stateData, domFormData = null) {
  const holat = stateData && typeof stateData === 'object' ? stateData : {}
  const domLogin = domFormData?.get?.('login')
  const domParol = domFormData?.get?.('password')
  const login = String(
    typeof domLogin === 'string' && domLogin ? domLogin : holat.login || ''
  ).trim()
  const password = String(
    typeof domParol === 'string' && domParol ? domParol : holat.password || ''
  )
  return { login, password }
}

/**
 * Ro'yxatdan o'tish maydonlarini bir xilda normallashtiradi
 * (qo'lda yozilganda ham, brauzer autofill qilganida ham).
 */
export function registerMaydonNormallashtir(name, value) {
  const matn = typeof value === 'string' ? value : ''
  if (name === 'username') return matn.toLowerCase().replace(/\s/g, '')
  if (name === 'email') return matn.replace(/\s/g, '')
  return matn
}
