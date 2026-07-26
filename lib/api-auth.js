// lib/api-auth.js
// API route'lar uchun yagona auth kirish nuqtasi.
//
// Ikkala mijozni ham qo'llab-quvvatlaydi:
//   • Veb sayt   — NextAuth cookie sessiyasi
//   • Mobil ilova — Authorization: Bearer <token>
//
// Foydalanish:
//   const user = await getAuthUser(request)
//   if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { readBearerToken } from './mobile-auth'
import { prisma } from './prisma'

/**
 * Joriy foydalanuvchini qaytaradi yoki null.
 * @returns {Promise<{id:string,userId:string,username:string,role:string,fullName:string|null,source:'web'|'mobile'}|null>}
 */
export async function getAuthUser(request) {
  // 1) Mobil token
  const payload = request ? await readBearerToken(request) : null
  if (payload) {
    // Token 30 kun yashaydi, shuning uchun bloklanish va rol o'zgarishi
    // darhol kuchga kirishi uchun bazadan qayta o'qiymiz.
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        userId: true,
        username: true,
        role: true,
        fullName: true,
        isBanned: true,
      },
    })

    if (!user || user.isBanned) return null

    return {
      id: user.id,
      userId: user.userId,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      source: 'mobile',
    }
  }

  // 2) Veb sessiya
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  return {
    id: session.user.id,
    userId: session.user.userId,
    username: session.user.username,
    role: session.user.role,
    fullName: session.user.fullName ?? null,
    source: 'web',
  }
}
