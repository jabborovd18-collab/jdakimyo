// lib/xavfsiz.js
//
// Kriptografik va kirish-tekshiruv yordamchilari.
//
// Barcha maxfiy kalit taqqoslashlari, tasodifiy kodlar va yuklangan
// fayllarning haqiqiy bayt sarlavhasi (magic bytes) tekshiruvi shu yerda
// jamlanadi — shunda loyihada zaif `Math.random()` yoki `===` qolmaydi.
import crypto from 'node:crypto'

/**
 * Ikki satrni vaqt bo'yicha doimiy tarzda (constant-time) solishtiradi.
 *
 * SHA-256 orqali bir xil uzunlikdagi xeshlarga o'tkazib `timingSafeEqual`
 * chaqiriladi, shuning uchun satr uzunligi har xil bo'lganda ham erta
 * qaytish (timing oracle) yuz bermaydi.
 *
 * Muhim: chaqiruvchi bo'sh kalit (`!expected`) ni alohida rad etishi kerak.
 */
export function vaqtBoyichaTeng(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const hA = crypto.createHash('sha256').update(a, 'utf8').digest()
  const hB = crypto.createHash('sha256').update(b, 'utf8').digest()
  return crypto.timingSafeEqual(hA, hB)
}

/**
 * CSPRNG (`crypto.randomInt`) orqali belgilangan alifbodan tasodifiy kod tuzadi.
 */
export function tasodifiyKod(alifbo, uzunlik) {
  if (typeof alifbo !== 'string' || alifbo.length === 0) {
    throw new Error("Alifbo bo'sh bo'lishi mumkin emas")
  }
  if (!Number.isInteger(uzunlik) || uzunlik < 1) {
    throw new Error("Uzunlik musbat butun son bo'lishi kerak")
  }
  let natija = ''
  for (let i = 0; i < uzunlik; i++) {
    natija += alifbo[crypto.randomInt(0, alifbo.length)]
  }
  return natija
}

/**
 * CSPRNG orqali `[min, maxExclusive)` oraliqda tasodifiy butun son qaytaradi.
 */
export function tasodifiySon(min, maxExclusive) {
  return crypto.randomInt(min, maxExclusive)
}

/**
 * Kriptografik tasodifiy hex satr yaratadi (masalan, xona egasi tokeni).
 */
export function tasodifiyBelgilar(baytlar = 24) {
  return crypto.randomBytes(baytlar).toString('hex')
}

function bufferGaOtkaz(manba) {
  if (!manba) return null
  if (Buffer.isBuffer(manba)) return manba
  if (manba instanceof ArrayBuffer) return Buffer.from(manba)
  if (ArrayBuffer.isView(manba)) {
    return Buffer.from(manba.buffer, manba.byteOffset, manba.byteLength)
  }
  return null
}

/**
 * Yuklangan rasmning haqiqiy MIME turini sehrli baytlar (magic bytes)
 * bo'yicha aniqlaydi. Brauzer yuborgan `file.type` ga ishonib bo'lmaydi.
 *
 * @returns {'image/jpeg'|'image/png'|'image/gif'|'image/webp'|null}
 */
export function rasmSehrliBaytTuri(manba) {
  const buf = bufferGaOtkaz(manba)
  if (!buf || buf.length < 4) return null

  // JPEG: FF D8 FF
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return 'image/jpeg'
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return 'image/png'
  }

  // GIF: GIF87a yoki GIF89a
  if (buf.length >= 6) {
    const sig = buf.subarray(0, 6).toString('ascii')
    if (sig === 'GIF87a' || sig === 'GIF89a') {
      return 'image/gif'
    }
  }

  // WebP: RIFF....WEBP
  if (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buf.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp'
  }

  return null
}

/**
 * Yuklangan PDF faylning haqiqiy `%PDF-` sarlavhasini tekshiradi.
 */
export function pdfSehrliBaytmi(manba) {
  const buf = bufferGaOtkaz(manba)
  if (!buf || buf.length < 5) return false
  return buf.subarray(0, 5).toString('ascii') === '%PDF-'
}
