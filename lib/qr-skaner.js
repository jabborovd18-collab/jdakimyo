// lib/qr-skaner.js
//
// Sayt ichidagi QR skaner uchun URL, token va PIN tahlili.
// Tashqi saytlarga open-redirect bo'lmasligi uchun faqat JDA Kimyo
// yo'llarini va ruxsat etilgan hostlarni qabul qiladi.

const RUXSAT_HOSTLAR = new Set([
  'jdakimyo.uz',
  'www.jdakimyo.uz',
  'localhost',
  '127.0.0.1',
])

function manbaHosti(origin) {
  if (!origin || typeof origin !== 'string') return null
  try {
    return new URL(origin).hostname.toLowerCase()
  } catch {
    return null
  }
}

function yolniTahlilQil(pathname, searchParams) {
  const path = typeof pathname === 'string' ? pathname : ''

  const doskaAuthMatch = path.match(/^\/doska\/auth\/([A-Za-z0-9_-]{8,128})\/?$/)
  if (doskaAuthMatch) {
    const token = doskaAuthMatch[1]
    return {
      ok: true,
      tur: 'doska-auth',
      token,
      manzil: `/doska/auth/${encodeURIComponent(token)}`,
      nomi: 'Elektron doskaga kirish',
    }
  }

  if (/^\/doska(?:\/auth)?\/?$/.test(path)) {
    return {
      ok: false,
      xato: 'Bu umumiy doska sahifasi. Doska ekranidagi maxsus QR kodni skanerlang.',
    }
  }

  const jangMatch = path.match(/^\/doska\/jang\/([A-Za-z0-9_-]{3,32})\/?$/)
  if (jangMatch) {
    const xonaId = jangMatch[1]
    const rawJamoa = searchParams?.get('jamoa') || ''
    const jamoa = /^[A-Za-z0-9_-]{1,24}$/.test(rawJamoa) ? rawJamoa : null
    const manzil = jamoa
      ? `/doska/jang/${encodeURIComponent(xonaId)}?jamoa=${encodeURIComponent(jamoa)}`
      : `/doska/jang/${encodeURIComponent(xonaId)}`
    return {
      ok: true,
      tur: 'doska-jang',
      xonaId,
      jamoa,
      manzil,
      nomi: 'Smart Jang xonasi',
    }
  }

  const sertifikatMatch = path.match(/^\/sertifikat\/verify\/([A-Za-z0-9_-]{3,80})\/?$/)
  if (sertifikatMatch) {
    const certId = sertifikatMatch[1]
    return {
      ok: true,
      tur: 'sertifikat',
      certId,
      manzil: `/sertifikat/verify/${encodeURIComponent(certId)}`,
      nomi: 'Sertifikat tekshiruvi',
    }
  }

  const msMatch = path.match(/^\/milliy-sertifikat\/tekshir\/([A-Za-z0-9_-]{3,80})\/?$/)
  if (msMatch) {
    const certId = msMatch[1]
    return {
      ok: true,
      tur: 'sertifikat',
      certId,
      manzil: `/milliy-sertifikat/tekshir/${encodeURIComponent(certId)}`,
      nomi: 'Milliy sertifikat tekshiruvi',
    }
  }

  return {
    ok: false,
    xato: 'Bu QR kodi Elektron doska yoki Sertifikat bo\'limiga mos emas.',
  }
}

/**
 * Skanerlangan yoki qo'lda kiritilgan QR matnini tekshiradi va xavfsiz ichki
 * yo'nalishga aylantiradi.
 *
 * @param {string} rawText
 * @param {string | null} currentOrigin
 */
export function qrMatniniTahlilQil(rawText, currentOrigin = null) {
  const matn = typeof rawText === 'string' ? rawText.trim() : ''
  if (!matn) {
    return { ok: false, xato: 'QR kodi yoki havola kiritilmadi.' }
  }

  // Nisbiy ichki yo'l (`//evil.com` bundan mustasno)
  if (matn.startsWith('/') && !matn.startsWith('//')) {
    try {
      const u = new URL(matn, 'https://www.jdakimyo.uz')
      return yolniTahlilQil(u.pathname, u.searchParams)
    } catch {
      return { ok: false, xato: 'QR havolasi noto\'g\'ri formatda.' }
    }
  }

  // To'liq URL
  if (/^https?:\/\//i.test(matn)) {
    let u
    try {
      u = new URL(matn)
    } catch {
      return { ok: false, xato: 'QR havolasi noto\'g\'ri formatda.' }
    }

    if (u.protocol !== 'https:' && u.protocol !== 'http:') {
      return { ok: false, xato: 'Bu QR havolasi qo\'llab-quvvatlanmaydi.' }
    }

    const host = u.hostname.toLowerCase()
    const joriyHost = manbaHosti(currentOrigin)
    const ruxsat = RUXSAT_HOSTLAR.has(host) || (Boolean(joriyHost) && host === joriyHost)
    if (!ruxsat) {
      return {
        ok: false,
        tashqi: true,
        xato: 'Bu JDA Kimyo tizimiga tegishli QR kodi emas.',
      }
    }

    return yolniTahlilQil(u.pathname, u.searchParams)
  }

  // javascript:, data:, file: va boshqa sxemalarni rad etish
  if (/^[a-z][a-z0-9+.-]*:/i.test(matn) || matn.startsWith('//')) {
    return { ok: false, xato: 'Bu QR havolasi qo\'llab-quvvatlanmaydi.' }
  }

  // Smart Jang 4-6 raqamli PIN kodi
  if (/^\d{4,6}$/.test(matn)) {
    return {
      ok: true,
      tur: 'doska-jang',
      xonaId: matn,
      jamoa: null,
      manzil: `/doska/jang/${matn}`,
      nomi: 'Smart Jang xonasi',
    }
  }

  // Doska tokenining o'zi qo'lda kiritilsa
  if (/^[A-Za-z0-9_-]{32,128}$/.test(matn)) {
    return {
      ok: true,
      tur: 'doska-auth',
      token: matn,
      manzil: `/doska/auth/${encodeURIComponent(matn)}`,
      nomi: 'Elektron doskaga kirish',
    }
  }

  return {
    ok: false,
    xato: 'Tanilmagan QR kodi. Doska ekranidagi QR kodni ramkaga kiriting.',
  }
}

/**
 * User-Agent satridan o'qishli qisqa qurilma nomini chiqaradi.
 */
export function qurilmaQisqaNomi(userAgent) {
  const ua = typeof userAgent === 'string' ? userAgent.trim() : ''
  if (!ua) return 'Elektron doska'

  let brauzer = 'Brauzer'
  if (/Edg\//i.test(ua)) brauzer = 'Edge'
  else if (/YaBrowser/i.test(ua)) brauzer = 'Yandex Brauzer'
  else if (/OPR\/|Opera/i.test(ua)) brauzer = 'Opera'
  else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) brauzer = 'Chrome'
  else if (/Firefox\//i.test(ua)) brauzer = 'Firefox'
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) brauzer = 'Safari'

  let tizim = ''
  if (/Windows/i.test(ua)) tizim = 'Windows'
  else if (/Android/i.test(ua)) tizim = 'Android'
  else if (/iPhone|iPad|iOS/i.test(ua)) tizim = 'iOS'
  else if (/Macintosh|Mac OS/i.test(ua)) tizim = 'macOS'
  else if (/Linux|X11|CrOS/i.test(ua)) tizim = 'Linux / Doska'

  return tizim ? `${brauzer} · ${tizim}` : brauzer
}
