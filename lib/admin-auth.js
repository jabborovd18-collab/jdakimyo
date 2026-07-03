// lib/admin-auth.js
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * Admin yoki moderator ekanligini tekshirish
 * @returns {Promise<{isAdmin: boolean, user: object|null}>}
 */
export async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return { isAdmin: false, user: null }
  }

  // Admin yoki moderator roli tekshirish
  const isAdmin = session.user.role === 'admin' || session.user.role === 'superadmin'
  const isModerator = session.user.role === 'moderator'

  return {
    isAdmin: isAdmin || isModerator,
    isSuperAdmin: session.user.role === 'superadmin',
    user: session.user
  }
}

/**
 * Admin sahifalari uchun himoya (middleware sifatida ishlatiladi)
 */
export async function requireAdmin() {
  const { isAdmin, user } = await checkAdminAuth()
  
  if (!isAdmin) {
    throw new Error('Bu sahifaga kirish uchun admin huquqi kerak')
  }

  return user
}