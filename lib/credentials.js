// lib/credentials.js
// Login tekshiruvining YAGONA joyi. Buni ikkita chaqiruvchi ishlatadi:
//   1) NextAuth authorize()          — veb sayt uchun (cookie sessiya)
//   2) /api/mobile/auth/login        — mobil ilova uchun (Bearer token)
// Ikkisi bir-biridan farq qilib qolmasligi uchun mantiq shu yerda saqlanadi.
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

/**
 * Username yoki email + parol bo'yicha foydalanuvchini tekshiradi.
 * Muvaffaqiyatsizlikda Error tashlaydi (xabar foydalanuvchiga ko'rsatiladi).
 * @returns {Promise<import('@prisma/client').User>}
 */
export async function verifyCredentials(login, password) {
  const identifier = login?.trim()

  if (!identifier || !password) {
    throw new Error('Username (yoki email) va parol kiriting')
  }

  // Username yoki email bo'yicha qidiramiz (Instagram uslubi).
  // Registr (katta/kichik harf) hisobga olinmaydi.
  const candidates = await prisma.user.findMany({
    where: {
      OR: [
        { username: { equals: identifier, mode: 'insensitive' } },
        { email: { equals: identifier, mode: 'insensitive' } },
      ]
    }
  })

  if (candidates.length === 0) {
    throw new Error('Bunday foydalanuvchi topilmadi')
  }

  // Kiritma "@" ni o'z ichiga olsa, avval email mos kelganini tekshiramiz.
  // Bu — kimningdir username'i boshqa birovning email'iga teng bo'lib qolgan
  // holatda natija tasodifiy bo'lib qolmasligi uchun.
  const looksLikeEmail = identifier.includes('@')
  const ordered = [...candidates].sort((a, b) => {
    const aMatch = looksLikeEmail
      ? a.email.toLowerCase() === identifier.toLowerCase()
      : a.username.toLowerCase() === identifier.toLowerCase()
    const bMatch = looksLikeEmail
      ? b.email.toLowerCase() === identifier.toLowerCase()
      : b.username.toLowerCase() === identifier.toLowerCase()
    return (bMatch ? 1 : 0) - (aMatch ? 1 : 0)
  })

  let user = null
  for (const candidate of ordered) {
    if (await bcrypt.compare(password, candidate.password)) {
      user = candidate
      break
    }
  }

  if (!user) {
    throw new Error('Parol noto\'g\'ri')
  }

  // Bloklangan hisob tizimga kira olmasligi kerak.
  if (user.isBanned) {
    throw new Error(
      user.bannedReason
        ? `Hisobingiz bloklangan. Sabab: ${user.bannedReason}`
        : 'Hisobingiz bloklangan. Administrator bilan bog\'laning.'
    )
  }

  return user
}
