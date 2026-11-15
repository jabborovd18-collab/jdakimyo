// lib/prisma-manzil.js
//
// PostgreSQL ulanish manzilini uzoq tarmoq (masalan localhost -> Neon AWS) va
// Serverless muhitlar uchun xavfsiz tayyorlaydi:
//   - sukutdagi 5 soniyalik connect_timeout va 10s pool_timeout uzoq TLS
//     qo'l berishida uzilib qolmasligi uchun 30s ga ko'tariladi;
//   - ishlab chiqish muhitida connection_limit=8 cheklanadi, shunda sahifa
//     yuklanishida 20+ parallel TLS ulanish birdan ochilib poolni bo'g'maydi.

const LOKAL_XOSTLAR = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

export function prismaUlanishManzili(
  rawUrl,
  { isDev = process.env.NODE_ENV !== 'production' } = {}
) {
  if (typeof rawUrl !== 'string') return rawUrl
  const toza = rawUrl.trim()
  if (!toza || !/^postgres(ql)?:\/\//i.test(toza)) {
    return rawUrl
  }

  try {
    const parsed = new URL(toza)
    const host = (parsed.hostname || '').toLowerCase()
    if (!host || LOKAL_XOSTLAR.has(host)) {
      return toza
    }

    if (!parsed.searchParams.has('connect_timeout')) {
      parsed.searchParams.set('connect_timeout', '30')
    }
    if (!parsed.searchParams.has('pool_timeout')) {
      parsed.searchParams.set('pool_timeout', '30')
    }
    if (isDev && !parsed.searchParams.has('connection_limit')) {
      parsed.searchParams.set('connection_limit', '8')
    }

    return parsed.toString()
  } catch {
    return rawUrl
  }
}
