import { createCipheriv, createDecipheriv, createHmac, randomBytes, randomInt } from 'node:crypto'
import { authMaxfiyKaliti } from '../auth-maxfiy-kalit.js'

const STANDART_YAROQLILIK_MS = 90 * 60 * 1000

function kalitOl(nomSpace) {
  return createHmac('sha256', authMaxfiyKaliti()).update(String(nomSpace)).digest()
}

export function qisqaId(bayt = 6) {
  return randomBytes(bayt).toString('base64url')
}

export function shifrlaHolat(holat, nomSpace, yaroqlilikMs = STANDART_YAROQLILIK_MS) {
  const payload = holat.tokenTugaydi
    ? holat
    : { ...holat, tokenTugaydi: Date.now() + yaroqlilikMs }
  const nonce = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', kalitOl(nomSpace), nonce)
  const tana = Buffer.concat([cipher.update(JSON.stringify(payload)), cipher.final()])
  // Yopiq ma'lumotlar klientda o'zgartirilmasligi uchun AES-256-GCM teg bilan muhrlanadi.
  return Buffer.concat([nonce, cipher.getAuthTag(), tana]).toString('base64url')
}

export function ochHolat(token, nomSpace) {
  if (typeof token !== 'string' || token.length > 32768) return null
  try {
    const baytlar = Buffer.from(token, 'base64url')
    if (baytlar.length < 29) return null
    const cipher = createDecipheriv('aes-256-gcm', kalitOl(nomSpace), baytlar.subarray(0, 12))
    cipher.setAuthTag(baytlar.subarray(12, 28))
    const holat = JSON.parse(Buffer.concat([cipher.update(baytlar.subarray(28)), cipher.final()]))
    return typeof holat?.tokenTugaydi === 'number' && Date.now() < holat.tokenTugaydi
      ? holat
      : null
  } catch {
    return null
  }
}

export function aralashtir(royxat) {
  const nusxa = [...royxat]
  for (let i = nusxa.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1)
    const vaqtincha = nusxa[i]
    nusxa[i] = nusxa[j]
    nusxa[j] = vaqtincha
  }
  return nusxa
}

export function ortachaMs(vaqtlar) {
  if (!Array.isArray(vaqtlar) || vaqtlar.length === 0) return null
  const jami = vaqtlar.reduce((yigindi, qiymat) => yigindi + qiymat, 0)
  return Math.round(jami / vaqtlar.length)
}
