// app/api/mobile/auth/login/route.js
// Mobil ilova uchun login. Veb saytdagi login bilan bir xil mantiq
// (lib/credentials.js), farqi — cookie o'rniga token qaytaradi.
import { NextResponse } from 'next/server'
import { verifyCredentials } from '@/lib/credentials'
import { issueMobileToken, MOBILE_TOKEN_MAX_AGE } from '@/lib/mobile-auth'
import { soravchiIp } from '@/lib/ip-cheklov'

// CORS preflight (sarlavhalar next.config.mjs da)
export { OPTIONS } from '@/lib/cors'

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null)

    if (!body) {
      return NextResponse.json({ error: 'Noto\'g\'ri so\'rov' }, { status: 400 })
    }

    // Mobil ilova ham veb bilan bir xil IP cheklovini oladi: aks holda
    // to'siqni aylanib o'tish uchun shu endpoint yetarli bo'lardi.
    const user = await verifyCredentials(body.login, body.password, soravchiIp(request))
    const token = await issueMobileToken(user)

    return NextResponse.json({
      success: true,
      token,
      expiresIn: MOBILE_TOKEN_MAX_AGE,
      user: {
        id: user.id,
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        level_points: user.level_points,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak,
      },
    })
  } catch (error) {
    // verifyCredentials foydalanuvchiga ko'rsatish uchun mo'ljallangan
    // xabar tashlaydi ("Parol noto'g'ri", "Hisobingiz bloklangan"...)
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}
