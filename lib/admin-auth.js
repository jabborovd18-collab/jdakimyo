// lib/admin-auth.js
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
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

  if (!session?.user?.id) {
    return {
      authenticated: false,
      isAdmin: false,
      isSuperAdmin: false,
      huquq: adminHuquqlari(null),
      user: null,
    }
  }

  // Vaqtinchalik elektron doska sessiyasi admin/boshqaruv huquqiga ega bo'lmasligi shart.
  if (session.user.doskaTugaydi) {
    return {
      authenticated: true,
      isAdmin: false,
      isSuperAdmin: false,
      huquq: adminHuquqlari(null),
      user: null,
    }
  }

  // Rol va ban holatini real vaqtda bazadan tekshiramiz (JWT 5 daqiqalik keshini kutmaymiz).
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, isBanned: true },
  })
  if (!dbUser || dbUser.isBanned) {
    return {
      authenticated: true,
      isAdmin: false,
      isSuperAdmin: false,
      huquq: adminHuquqlari(null),
      user: null,
    }
  }

  const role = dbUser.role
  const huquq = adminHuquqlari(role)

  return {
    authenticated: true,
    isAdmin: kerakliHuquq ? Boolean(huquq[kerakliHuquq]) : isAdminRole(role),
    isSuperAdmin: isSuperAdmin(role),
    huquq,
    user: { ...session.user, role },
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
