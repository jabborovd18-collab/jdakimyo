// lib/sovga.js
//
// Do'stlar orasidagi kunlik sovg'a.
//
// QOIDALAR:
//   1. Bir kunda bitta akkaunt FAQAT BITTA sovg'a yubora oladi
//   2. Qabul qiluvchiga bir necha sovg'a kelishi mumkin (10 do'st = 50 tanga)
//   3. Tanga YUBORILGANDA emas, QABUL QILINGANDA beriladi — ikkala tomonga
//   4. Toshkent vaqti bilan 00:00 gacha olinmagan sovg'a kuyadi
//
// NEGA QABUL QILISH SHART. Yuborilishi bilan tanga berilsa, sovg'a
// bir tomonlama "pul chiqarish" tugmasiga aylanardi: yuboruvchi hech
// kimning roziligisiz o'ziga ham, boshqaga ham tanga yasab bera olardi.
// Qabul qilish talabi ikkala tomonni ham faol qiladi va tanga faqat
// haqiqiy muomaladan paydo bo'ladi.
//
// NEGA KUYADI. Muddatsiz turgan sovg'alar yig'ilib qolardi va odam bir
// kunda yuzta sovg'ani qabul qilib, bir zarbada katta tanga olardi —
// kunlik limitning ma'nosi qolmasdi.
import { prisma } from './prisma'
import { xabarYubor } from './bildirishnoma'

/** Har bir tomonga beriladigan tanga */
export const SOVGA_TANGA = 5

/**
 * Yubora olish uchun eng kam daraja.
 *
 * NEGA BOR. Bepul ro'yxatdan o'tish + sovg'a = bitta odam o'nta akkaunt
 * ochib hammasini asosiy hisobiga yig'ishi mumkin. Do'st bo'lish sharti
 * buni biroz qiyinlashtiradi, lekin butunlay to'xtatmaydi.
 *
 * Hozircha 1 — ya'ni hech kimni to'smaydi. Ko'p akkaunt muammosi
 * ko'rinsa, shu raqamni ko'tarish yetarli: mexanizm allaqachon joyida.
 */
export const ENG_KAM_DARAJA = 1

/** Toshkent — UTC+5, yozgi vaqt o'tishi yo'q */
const TOSHKENT_OFSET_MS = 5 * 60 * 60 * 1000

/**
 * Hozirgi Toshkent kunining boshi.
 *
 * Qiymat `@db.Date` ustuniga yoziladi, ya'ni faqat sana qismi muhim.
 * UTC ishlatilmadi: kechqurun yuborilgan sovg'a odam uxlab turganda
 * emas, kunduzi kuyib ketardi.
 */
export function toshkentKuni(vaqt = new Date()) {
  const siljitilgan = new Date(vaqt.getTime() + TOSHKENT_OFSET_MS)
  siljitilgan.setUTCHours(0, 0, 0, 0)
  return siljitilgan
}

/** Toshkent kuni tugashiga necha millisekund qolgani */
export function kunTugashigaQolgan(vaqt = new Date()) {
  const ertaga = new Date(toshkentKuni(vaqt).getTime() + 24 * 60 * 60 * 1000)
  // `toshkentKuni` siljitilgan vaqtni qaytaradi, shuning uchun taqqoslash
  // ham siljitilgan vaqt bilan bo'ladi.
  return ertaga.getTime() - (vaqt.getTime() + TOSHKENT_OFSET_MS)
}

/**
 * Muddati o'tgan sovg'alarni kuygan deb belgilaydi.
 *
 * Cron emas, SO'ROV PAYTIDA chaqiriladi. Sabab: cron kechiksa yoki
 * ishlamay qolsa, kechagi sovg'a bugun ham "kutilmoqda" bo'lib turardi
 * va uni qabul qilib tanga olish mumkin bo'lardi. Ro'yxat olinayotganda
 * tozalash bu holatni butunlay yo'q qiladi.
 */
export async function kuyganlarniBelgila(userId = null) {
  const bugun = toshkentKuni()
  const where = { holat: 'kutilmoqda', kun: { lt: bugun } }
  if (userId) where.receiverId = userId

  const natija = await prisma.gift.updateMany({
    where,
    data: { holat: 'kuygan' },
  })
  return natija.count
}

/** Ikki odam do'stmi */
export async function dostmi(aId, bId) {
  const n = await prisma.friendship.count({
    where: {
      OR: [
        { user1Id: aId, user2Id: bId },
        { user1Id: bId, user2Id: aId },
      ],
    },
  })
  return n > 0
}

/**
 * Sovg'a yuborish.
 * @throws {Error} sabab bilan — chaqiruvchi uni foydalanuvchiga ko'rsatadi
 */
export async function sovgaYubor(yuboruvchi, qabulQiluvchiId) {
  if (yuboruvchi.id === qabulQiluvchiId) {
    throw new Error("O'zingizga sovg'a yubora olmaysiz")
  }

  // Tasdiqlanmagan hisob sovg'a yubora olmaydi: aks holda o'nta soxta
  // akkaunt ochib asosiy hisobga tanga yig'ish yo'li ochiq qolardi.
  if (!yuboruvchi.emailVerified) {
    throw new Error("Sovg'a yuborish uchun avval emailingizni tasdiqlang")
  }

  if ((yuboruvchi.level_points || 1) < ENG_KAM_DARAJA) {
    throw new Error(`Sovg'a yuborish uchun ${ENG_KAM_DARAJA}-daraja kerak`)
  }

  if (!(await dostmi(yuboruvchi.id, qabulQiluvchiId))) {
    throw new Error("Sovg'ani faqat do'stlaringizga yubora olasiz")
  }

  const qabulQiluvchi = await prisma.user.findUnique({
    where: { id: qabulQiluvchiId },
    select: { id: true, username: true, fullName: true, isBanned: true },
  })
  if (!qabulQiluvchi || qabulQiluvchi.isBanned) {
    throw new Error('Foydalanuvchi topilmadi')
  }

  const kun = toshkentKuni()

  let sovga
  try {
    sovga = await prisma.gift.create({
      data: { senderId: yuboruvchi.id, receiverId: qabulQiluvchiId, kun },
    })
  } catch (e) {
    // P2002 — `(senderId, kun)` unikal cheklovi. Bu xato emas, qoida:
    // bugungi sovg'a allaqachon yuborilgan.
    if (e?.code === 'P2002') {
      throw new Error("Bugun sovg'angizni allaqachon yuborgansiz. Ertaga yana urinib ko'ring.")
    }
    throw e
  }

  await xabarYubor(qabulQiluvchiId, {
    turi: 'tanga',
    sarlavha: `🎁 ${yuboruvchi.fullName || yuboruvchi.username} sizga sovg'a yubordi`,
    matn: `Qabul qilsangiz ikkalangiz ham ${SOVGA_TANGA} tangadan olasiz. Sovg'a bugun yarim tunda kuyadi.`,
    havola: '/profil/sovgalar',
    icon: '🎁',
    adminId: yuboruvchi.id,
  })

  return { sovga, qabulQiluvchi }
}

/**
 * Sovg'ani qabul qilish — ikkala tomonga tanga beriladi.
 *
 * Tranzaksiya ichida: holat va ikkala balans birga o'zgarishi kerak.
 * Aks holda tanga berilib, holat yangilanmay qolsa, bitta sovg'ani
 * qayta-qayta qabul qilish mumkin bo'lardi.
 */
export async function sovganiQabulQil(userId, sovgaId) {
  const bugun = toshkentKuni()

  // Qabul qiluvchi ham tasdiqlangan bo'lishi kerak — tanga ikkala
  // tomonga beriladi, ya'ni tasdiqlanmagan hisob qabul qilish orqali
  // ham tanga topa olardi.
  const qabulQiluvchi = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  })
  if (!qabulQiluvchi?.emailVerified) {
    throw new Error('Sovg\'ani olish uchun avval emailingizni tasdiqlang')
  }

  const sovga = await prisma.gift.findFirst({
    where: { id: sovgaId, receiverId: userId },
    include: { sender: { select: { id: true, username: true, fullName: true } } },
  })

  if (!sovga) throw new Error('Sovg\'a topilmadi')
  if (sovga.holat === 'qabul') throw new Error('Bu sovg\'a allaqachon olingan')
  if (sovga.holat === 'kuygan' || sovga.kun < bugun) {
    // Kechikkan bo'lsa yozuvni ham to'g'rilab qo'yamiz
    if (sovga.holat !== 'kuygan') {
      await prisma.gift.update({ where: { id: sovgaId }, data: { holat: 'kuygan' } })
    }
    throw new Error('Bu sovg\'aning muddati o\'tgan')
  }

  // TRANZAKSIYA FUNKSIYA SHAKLIDA, massiv emas.
  //
  // Massivda barcha amallar shartsiz bajariladi: `updateMany` hech
  // nimaga mos kelmasa ham tanga qo'shilaverardi. Ikki so'rov bir
  // vaqtda kelganda bitta sovg'a uchun tanga IKKI MARTA berilardi.
  // Bu yerda esa mos kelmasa darhol to'xtaymiz va hech narsa yozilmaydi.
  await prisma.$transaction(async (tx) => {
    const yangilandi = await tx.gift.updateMany({
      where: { id: sovgaId, holat: 'kutilmoqda' },
      data: { holat: 'qabul', javobVaqt: new Date() },
    })

    if (yangilandi.count === 0) {
      throw new Error('Bu sovg\'a allaqachon olingan')
    }

    await tx.user.update({
      where: { id: userId },
      data: { coins: { increment: SOVGA_TANGA } },
    })
    await tx.user.update({
      where: { id: sovga.senderId },
      data: { coins: { increment: SOVGA_TANGA } },
    })
  })

  await xabarYubor(sovga.senderId, {
    turi: 'tanga',
    sarlavha: `🎁 Sovg'angiz qabul qilindi`,
    matn: `Ikkalangiz ham ${SOVGA_TANGA} tangadan oldingiz.`,
    havola: '/profil/sovgalar',
    icon: '🪙',
  })

  return { tanga: SOVGA_TANGA, yuboruvchi: sovga.sender }
}
