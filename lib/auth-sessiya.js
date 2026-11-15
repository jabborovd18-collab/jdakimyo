// lib/auth-sessiya.js
//
// Hisob egasi almashganda eski sessiyalarni bekor qilish.
//
// Nega kerak: sessiya JWT, ya'ni serverda saqlanmaydi va 30 kun yashaydi.
// Parolni o'zgartirishning o'zi eski tokenni to'xtatmaydi. Birov boshqaning
// emaili bilan ro'yxatdan o'tgan bo'lsa, haqiqiy egasi Google bilan kirgandan
// keyin ham u ichkarida qolardi.
//
// Nega parol izi, alohida ustun emas: yangi ustun migratsiyani talab qiladi va
// u qo'llanmaguncha hisobni o'qiydigan har bir so'rov yiqiladi. Parol xeshi esa
// allaqachon bor va hisob egasi almashganda aynan u o'zgaradi.
import { createHash } from 'node:crypto'

/** Tokenga yoziladigan qisqa iz. Xeshning o'zi tokenga tushmaydi. */
export function parolIzi(parolXeshi) {
  if (!parolXeshi) return null
  return createHash('sha256').update(parolXeshi).digest('base64url').slice(0, 22)
}

/**
 * @param {string|null|undefined} tokenIzi Tokendagi parol izi
 * @param {number|undefined} tokenIat Token berilgan vaqt (soniya)
 * @param {{ password: string, emailVerified: Date|null }} user
 * @returns {boolean}
 */
export function sessiyaYaroqlimi(tokenIzi, tokenIat, user) {
  if (tokenIzi) return tokenIzi === parolIzi(user.password)

  // Nega izsiz token darhol bekor qilinmaydi: bu o'zgarishdan oldin berilgan
  // tokenlarda iz yo'q, hammani birdan chiqarib yuborish shart emas. Ammo email
  // token berilgandan keyin tasdiqlangan bo'lsa, u hisob egasi almashgan bo'lishi
  // mumkin bo'lgan yagona payt.
  if (user.emailVerified && tokenIat) {
    return user.emailVerified.getTime() / 1000 <= tokenIat
  }
  return true
}

/**
 * Google akkauntini hisobga bog'laydi.
 *
 * Email tasdiqlanmagan hisobni kim ochgani noma'lum: parolni email egasi emas,
 * begona odam qo'ygan bo'lishi mumkin. Google email egaligini tasdiqlaydi,
 * shuning uchun eski parol bekor qilinadi va hisob egasi Google'ning egasi bo'ladi.
 *
 * @param {object} db Prisma mijozi
 * @param {object} akkaunt Account yozuvi
 * @param {() => Promise<string>} yangiParolXeshi Tasodifiy parol xeshini yasaydi
 */
export async function hisobniBogla(db, akkaunt, yangiParolXeshi) {
  const hisob = await db.user.findUnique({
    where: { id: akkaunt.userId },
    select: { emailVerified: true },
  })
  // Nega oldindan: bcrypt sekin va tranzaksiya ichida ulanishni band qilib turadi
  const xesh = hisob && !hisob.emailVerified ? await yangiParolXeshi() : null

  const { userId: _u, provider: _p, providerAccountId: _pa, ...yangilanadigan } = akkaunt

  return await db.$transaction(async (tx) => {
    const natija = await tx.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: akkaunt.provider,
          providerAccountId: akkaunt.providerAccountId,
        },
      },
      update: Object.keys(yangilanadigan).length > 0 ? yangilanadigan : { type: akkaunt.type || 'oauth' },
      create: akkaunt,
    })

    if (xesh) {
      // Shart `emailVerified: null`: shu orada tasdiqlangan hisobga tegmaydi
      await tx.user.updateMany({
        where: { id: akkaunt.userId, emailVerified: null },
        data: { password: xesh, emailVerified: new Date() },
      })
    }

    return natija
  })
}
