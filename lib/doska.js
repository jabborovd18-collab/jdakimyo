// lib/doska.js
//
// Elektron doskaga QR orqali kirish.
//
// MUAMMO. Ma'ruza zalida o'qituvchi 100 talaba oldida parol tera
// olmaydi — parol ekranda ham, klaviaturada ham ko'rinadi.
//
// YECHIM (WhatsApp Web naqshi):
//   1. Doska /doska ni ochadi, server qisqa umrli token yaratadi
//   2. Ekranda QR chiqadi, ichida /doska/<token>
//   3. O'qituvchi telefonidan skanerlaydi (telefonda allaqachon kirgan)
//   4. Telefonda TASDIQLAYDI — qaysi qurilma so'rayotgani ko'rsatiladi
//   5. Doska so'rab turadi va tasdiqlangach o'zi kiradi
//
// NEGA TASDIQLASH SHART. QR ni zaldagi har kim skanerlashi mumkin.
// Tasdiqlash bo'lmasa, birinchi skanerlagan talaba o'qituvchi hisobiga
// kirib olardi. Tasdiqlash telefonda bo'lgani uchun ekranni ko'rgan
// odam emas, TELEFON EGASI qaror qiladi.
import crypto from 'crypto'
import { prisma } from './prisma'

/** QR necha daqiqa amal qiladi — skanerlashga yetadigan vaqt */
const QR_DAQIQA = 3

/** Doska sessiyasi uchun ruxsat etilgan davomiylik (soat) */
export const DAVOMIYLIKLAR = [1, 2, 4]

/** Sukutdagi davomiylik */
export const SUKUT_SOAT = 2

/**
 * Yangi QR sessiyasi ochadi.
 * Token 32 baytli tasodifiy qiymat — taxmin qilib bo'lmaydi.
 */
export async function sessiyaYarat({ qurilma, ip }) {
  const token = crypto.randomBytes(32).toString('base64url')

  const sessiya = await prisma.doskaSessiya.create({
    data: {
      token,
      amalQiladi: new Date(Date.now() + QR_DAQIQA * 60 * 1000),
      // Brauzer qatorini qisqartiramiz: telefonda ko'rsatish uchun
      // uzun satr keraksiz va u yerda joy kam
      qurilma: (qurilma || '').slice(0, 200) || null,
      ip: ip || null,
    },
  })

  return { token: sessiya.token, amalQiladi: sessiya.amalQiladi }
}

/** Token bo'yicha sessiyani topadi va muddatini tekshiradi */
export async function sessiyaniOl(token) {
  const s = await prisma.doskaSessiya.findUnique({ where: { token } })
  if (!s) return null

  // Muddati o'tgan va hali tasdiqlanmagan bo'lsa — bekor.
  // Tasdiqlangandan keyin `amalQiladi` ahamiyatsiz: u faqat
  // SKANERLASHGA berilgan vaqt edi.
  if (s.holat === 'kutilmoqda' && s.amalQiladi < new Date()) {
    return { ...s, holat: 'muddati-otgan' }
  }

  return s
}

/**
 * Telefon egasi doskaga ruxsat beradi.
 *
 * @param {string} token
 * @param {string} userId — telefonda kirgan foydalanuvchi
 * @param {number} soat — sessiya necha soat yashaydi
 */
export async function tasdiqla(token, userId, soat = SUKUT_SOAT) {
  const s = await sessiyaniOl(token)

  if (!s) throw new Error('Bunday QR topilmadi')
  if (s.holat === 'muddati-otgan') throw new Error('QR muddati o\'tgan — doskada yangisini oching')
  if (s.holat !== 'kutilmoqda') throw new Error('Bu QR allaqachon ishlatilgan')

  const davomiylik = DAVOMIYLIKLAR.includes(Number(soat)) ? Number(soat) : SUKUT_SOAT

  // `holat: 'kutilmoqda'` shartini yangilashning o'ziga qo'yamiz:
  // ikki telefon bir vaqtda tasdiqlasa, faqat biri o'tadi.
  const natija = await prisma.doskaSessiya.updateMany({
    where: { token, holat: 'kutilmoqda' },
    data: {
      holat: 'tasdiqlangan',
      userId,
      tugaydi: new Date(Date.now() + davomiylik * 60 * 60 * 1000),
    },
  })

  if (natija.count === 0) throw new Error('Bu QR allaqachon ishlatilgan')

  return { davomiylik }
}

/**
 * Doska tokenni sessiyaga almashtiradi.
 *
 * BIR MARTALIK: almashtirilgach holat 'ishlatilgan' ga o'tadi va
 * o'sha token bilan ikkinchi marta kirib bo'lmaydi. Token doska
 * ekranida ko'rinib turgan bo'lishi mumkin, shuning uchun uni qayta
 * ishlatish yo'li ochiq qolmasligi kerak.
 */
export async function tokenniAlmashtir(token) {
  const s = await sessiyaniOl(token)
  if (!s || s.holat !== 'tasdiqlangan' || !s.userId) return null

  const natija = await prisma.doskaSessiya.updateMany({
    where: { token, holat: 'tasdiqlangan' },
    data: { holat: 'ishlatilgan' },
  })
  if (natija.count === 0) return null

  const user = await prisma.user.findUnique({
    where: { id: s.userId },
    select: {
      id: true, userId: true, username: true, fullName: true,
      role: true, isTeacher: true, isVerified: true, isBanned: true,
    },
  })

  if (!user || user.isBanned) return null

  return { user, tugaydi: s.tugaydi }
}

/** Sessiyani bekor qilish — doskadagi "Darsni tugatish" yoki telefondan */
export async function bekorQil(token, userId = null) {
  const where = { token, ...(userId ? { userId } : {}) }
  const natija = await prisma.doskaSessiya.updateMany({
    where,
    data: { holat: 'bekor' },
  })
  return natija.count > 0
}

/** Foydalanuvchining faol doska sessiyalari — telefondan boshqarish uchun */
export async function faolSessiyalar(userId) {
  return prisma.doskaSessiya.findMany({
    where: {
      userId,
      holat: { in: ['tasdiqlangan', 'ishlatilgan'] },
      tugaydi: { gt: new Date() },
    },
    select: { id: true, token: true, qurilma: true, tugaydi: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
}
