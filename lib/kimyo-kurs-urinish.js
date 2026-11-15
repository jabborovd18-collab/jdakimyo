import { createHmac, randomInt, randomUUID, timingSafeEqual } from 'node:crypto'
import { authMaxfiyKaliti } from '@/lib/auth-maxfiy-kalit'
import { KURS_SAVOL_SONI } from '@/lib/kimyo-kurs-test'

function imzo(tana) {
  return createHmac('sha256', authMaxfiyKaliti()).update(`kimyo-kurs/v1/${tana}`).digest()
}

export function kursUrinishiniYarat(testId, ism, jami) {
  const tartib = Array.from({ length: jami }, (_, i) => i)
  for (let i = 0; i < KURS_SAVOL_SONI; i += 1) {
    const j = randomInt(i, jami)
    const indeks = tartib[i]
    tartib[i] = tartib[j]
    tartib[j] = indeks
  }
  const savolTartibi = tartib.slice(0, KURS_SAVOL_SONI)
  const tana = Buffer.from(JSON.stringify({ testId, ism, savolTartibi, topshirishId: randomUUID() })).toString('base64url')
  // Mijoz savollarni belgilangan tartibda oladi, topshirishda shu tanlov server imzosi bilan tekshiriladi.
  return { token: `${tana}.${imzo(tana).toString('base64url')}`, savolTartibi }
}

export function kursUrinishiniOch(token) {
  if (typeof token !== 'string' || token.length > 2048) return null
  const qismlar = token.split('.')
  if (qismlar.length !== 2) return null
  const [tana, yozuv] = qismlar
  const kelgan = Buffer.from(yozuv, 'base64url')
  const kutilgan = imzo(tana)
  if (kelgan.length !== kutilgan.length || !timingSafeEqual(kelgan, kutilgan)) return null
  try {
    return JSON.parse(Buffer.from(tana, 'base64url').toString('utf8'))
  } catch {
    return null
  }
}
