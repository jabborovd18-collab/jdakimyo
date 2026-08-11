// lib/chat.js
//
// Shaxsiy chatning qoidalari BIR JOYDA.
//
// Nega: "kim kimga yoza oladi" degan savolga to'rt joyda javob kerak
// bo'ladi (suhbat boshlash, xabar yuborish, so'rovni qabul qilish, admin
// paneli). Har birida alohida yozilsa, bloklashni yoki taqiqni bir joyda
// unutib qoldirish deyarli muqarrar.
import { prisma } from './prisma'
import { sanaVaqt } from './sana'

// Chegara alohida faylda: uni chat sahifasi (brauzer) ham o'qiydi, bu
// fayl esa prisma bilan birga faqat serverda ishlaydi.
export { MAX_UZUNLIK } from './chat-chegara'

/**
 * Xabarlar shuncha kundan keyin o'chiriladi (cron).
 *
 * 72 soat ham o'ylandi, lekin u chatni ishlatib bo'lmaydigan qiladi:
 * o'tgan haftagi kelishuvni topib bo'lmaydi. Matn juda kam joy egallaydi
 * (o'rtacha xabar ~100 bayt), shuning uchun yarim yil saqlash bazaga
 * sezilarli yuk bermaydi — 10 000 ta xabar ~1 MB.
 */
export const SAQLASH_KUNI = 180

export class ChatXatosi extends Error {
  constructor(message, status = 400) {
    super(message)
    this.name = 'ChatXatosi'
    this.status = status
  }
}

/** Juftlikni har doim bir xil tartibda saqlaymiz — ikkita suhbat bo'lmasin */
export function juftlik(a, b) {
  return [a, b].sort()
}

/** Ikkalasi do'stmi */
export async function dostmi(aId, bId) {
  const [user1Id, user2Id] = juftlik(aId, bId)
  const bor = await prisma.friendship.findFirst({
    where: { user1Id, user2Id },
    select: { id: true },
  })
  return Boolean(bor)
}

/**
 * Bloklash holati.
 *
 * Ikki tomonni ham qaytaramiz: "men uni bloklaganman" bilan "u meni
 * bloklagan" boshqa-boshqa natija beradi — birinchisida men blokni
 * ocholaman, ikkinchisida u umuman ko'rinmaydi.
 */
export async function blokHolati(menId, uId) {
  const yozuvlar = await prisma.userBlock.findMany({
    where: {
      OR: [
        { blockerId: menId, blockedId: uId },
        { blockerId: uId, blockedId: menId },
      ],
    },
    select: { blockerId: true },
  })

  return {
    menBlokladim: yozuvlar.some((y) => y.blockerId === menId),
    meniBlokladi: yozuvlar.some((y) => y.blockerId === uId),
  }
}

/** Yozish taqiqi kuchdami (admin qo'ygan) */
export function yozishTaqiqi(user) {
  const gacha = user?.chatBlockedUntil
  if (!gacha) return null
  const sana = new Date(gacha)
  if (sana <= new Date()) return null
  return { gacha: sana, sabab: user.chatBlockedReason || null }
}

/**
 * Xabar yuborish mumkinmi — barcha to'siqlar shu yerda.
 *
 * @returns {{holat: 'faol'|'sorov'}} yangi suhbat qanday boshlanishi
 * @throws {ChatXatosi}
 */
export async function yozishMumkinmi(menId, uId) {
  if (menId === uId) throw new ChatXatosi('O\'zingizga yozib bo\'lmaydi')

  const [men, u] = await Promise.all([
    prisma.user.findUnique({
      where: { id: menId },
      select: { chatBlockedUntil: true, chatBlockedReason: true },
    }),
    prisma.user.findUnique({
      where: { id: uId },
      select: { id: true, isBanned: true },
    }),
  ])

  if (!u) throw new ChatXatosi('Foydalanuvchi topilmadi', 404)
  if (u.isBanned) throw new ChatXatosi('Bu foydalanuvchi bloklangan', 403)

  const taqiq = yozishTaqiqi(men)
  if (taqiq) {
    throw new ChatXatosi(
      `Yozish vaqtincha to'xtatilgan (${sanaVaqt(taqiq.gacha)} gacha)` +
        (taqiq.sabab ? `. Sabab: ${taqiq.sabab}` : ''),
      403,
    )
  }

  const blok = await blokHolati(menId, uId)
  if (blok.menBlokladim) {
    throw new ChatXatosi('Siz bu foydalanuvchini bloklagansiz. Avval blokni oching.', 403)
  }
  if (blok.meniBlokladi) {
    // Bloklangan odam buni bilmaydi: "u sizni bloklagan" deb aytish
    // bloklovchini fosh qiladi. Xabar shunchaki ketmaydi.
    throw new ChatXatosi('Xabar yuborib bo\'lmadi', 403)
  }

  return { holat: (await dostmi(menId, uId)) ? 'faol' : 'sorov' }
}

/**
 * Suhbatni topadi yoki yaratadi.
 *
 * Do'stlar orasida darhol "faol", boshqalarda "sorov" bo'lib boshlanadi.
 */
export async function suhbatniOl(menId, uId) {
  const { holat } = await yozishMumkinmi(menId, uId)
  const [user1Id, user2Id] = juftlik(menId, uId)

  const mavjud = await prisma.conversation.findUnique({
    where: { user1Id_user2Id: { user1Id, user2Id } },
  })

  if (mavjud) {
    // Rad etilgan so'rovga yana yozib bo'lmaydi — bu rad etishning
    // ma'nosi. Do'st bo'lib qolishsa, holat "faol" ga o'tadi.
    if (mavjud.holat === 'rad') {
      if (!(await dostmi(menId, uId))) {
        throw new ChatXatosi('Bu foydalanuvchi so\'rovingizni rad etgan', 403)
      }
      return prisma.conversation.update({
        where: { id: mavjud.id },
        data: { holat: 'faol' },
      })
    }

    // So'rov davomida do'st bo'lib qolishgan bo'lsa, uni faol qilamiz
    if (mavjud.holat === 'sorov' && holat === 'faol') {
      return prisma.conversation.update({
        where: { id: mavjud.id },
        data: { holat: 'faol' },
      })
    }

    return mavjud
  }

  return prisma.conversation.create({
    data: { user1Id, user2Id, holat, boshlovchiId: menId },
  })
}

/** Suhbat shu odamnikimi va sherigi kim */
export function sherik(suhbat, menId) {
  return suhbat.user1Id === menId ? suhbat.user2Id : suhbat.user1Id
}

export function qatnashchimi(suhbat, menId) {
  return suhbat.user1Id === menId || suhbat.user2Id === menId
}

/** Ro'yxat va sarlavha uchun qisqa foydalanuvchi ma'lumoti */
export const ODAM = {
  id: true, userId: true, username: true, fullName: true, avatar: true, role: true,
  // Tasdiq belgisi chatda ham ko'rinadi: notanish odam yozganda uning
  // haqiqiy hisob ekanini aynan shu yerda bilish kerak.
  isVerified: true,
}
