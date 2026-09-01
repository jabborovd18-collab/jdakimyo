// lib/mobile-auth.js
// Mobil ilova uchun token-autentifikatsiya.
//
// Nega alohida? NextAuth brauzerda HTTP-only cookie sessiyasi bilan ishlaydi —
// React Native'da bu qulay emas. Shuning uchun mobil ilova login qilganda
// token oladi, uni expo-secure-store'da saqlaydi va har so'rovda
// "Authorization: Bearer <token>" sarlavhasida yuboradi.
//
// Token formati — NextAuth'ning O'Z formati (next-auth/jwt encode/decode),
// brauzer sessiyasi bilan bir xil markaziy kalitda. Ya'ni yangi kutubxona
// ham, ikkinchi maxfiy kalit ham kerak emas.
import { encode, decode } from 'next-auth/jwt'
import { authMaxfiyKaliti } from '@/lib/auth-maxfiy-kalit'

// Mobil qurilmada tez-tez qayta login qilish noqulay — 30 kun.
// Eslatma: bloklangan hisob token muddati tugashini kutmaydi, chunki
// getAuthUser() har so'rovda bazadan isBanned'ni qayta tekshiradi.
export const MOBILE_TOKEN_MAX_AGE = 60 * 60 * 24 * 30

/** Login muvaffaqiyatli bo'lgach, mobil ilovaga beriladigan token */
export async function issueMobileToken(user) {
  return await encode({
    secret: authMaxfiyKaliti(),
    maxAge: MOBILE_TOKEN_MAX_AGE,
    token: {
      sub: user.id,
      userId: user.userId,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
    },
  })
}

/**
 * So'rovdagi Bearer tokenni o'qib, ichidagi ma'lumotni qaytaradi.
 * Token yo'q yoki yaroqsiz bo'lsa — null (xato tashlamaydi).
 */
export async function readBearerToken(request) {
  const header = request.headers.get('authorization') || ''
  if (!header.toLowerCase().startsWith('bearer ')) return null

  const token = header.slice(7).trim()
  if (!token) return null

  try {
    const payload = await decode({ token, secret: authMaxfiyKaliti() })
    return payload?.sub ? payload : null
  } catch {
    // Yaroqsiz yoki muddati o'tgan token
    return null
  }
}
