// app/api/mobile/auth/me/route.js
// Ilova ochilganda saqlangan token hali yaroqlimi — shuni tekshiradi.
// Token muddati o'tgan yoki hisob bloklangan bo'lsa 401 qaytadi va
// ilova login ekraniga qaytaradi.
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

// CORS preflight (sarlavhalar next.config.mjs da)
export { OPTIONS } from '@/lib/cors'

export async function GET(request) {
  const auth = await getAuthUser(request)

  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: {
      id: true,
      userId: true,
      username: true,
      fullName: true,
      email: true,
      avatar: true,
      role: true,
      university: true,
      level_points: true,
      experience: true,
      totalPoints: true,
      currentStreak: true,
      longestStreak: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
  }

  return NextResponse.json({ success: true, user })
}
