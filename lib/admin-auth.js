// lib/admin-auth.js
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { adminHuquqlari, isAdminRole, isSuperAdmin } from '@/lib/roles'

/**
 * Admin panelga kirish huquqi bor-yo'qligini tekshiradi.
 *
 * @param {string=} kerakliHuquq — aniq huquq nomi (lib/roles.js dagi
 *        jadvaldan: 'foydalanuvchilar', 'gamifikatsiya', 'sertifikatlar'...).
 *        Berilsa, `isAdmin` aynan shu huquqni bildiradi.
 *
 * NEGA SHUNDAY. Avval bu funksiya "admin panelga kira oladimi" degan
 * yagona savolga javob berardi va moderator hamma joyga o'ta olardi.
 * Endi chaqiruvchi nima kerakligini aytadi, tekshiruv esa bitta jadvaldan
 * o'qiydi — moderatorga yangi bo'lim yopilganda o'nlab faylni eslab
 * qolish shart emas.
 *
 * Menyudan yashirish yetarli emas: manzilni qo'lda yozib kirish mumkin,
 * shuning uchun haqiqiy to'siq har doim shu yerda — server tomonda.
 *
 * @returns {Promise<{isAdmin: boolean, isSuperAdmin: boolean, huquq: object, user: object|null}>}
 */
export async function checkAdminAuth(kerakliHuquq = null) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { isAdmin: false, isSuperAdmin: false, huquq: adminHuquqlari(null), user: null }
  }

  const role = session.user.role
  const huquq = adminHuquqlari(role)

  return {
    isAdmin: kerakliHuquq ? Boolean(huquq[kerakliHuquq]) : isAdminRole(role),
    isSuperAdmin: isSuperAdmin(role),
    huquq,
    user: session.user,
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
