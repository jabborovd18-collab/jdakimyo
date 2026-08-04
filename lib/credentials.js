// lib/credentials.js
// Login tekshiruvining YAGONA joyi. Buni ikkita chaqiruvchi ishlatadi:
//   1) NextAuth authorize()          — veb sayt uchun (cookie sessiya)
//   2) /api/mobile/auth/login        — mobil ilova uchun (Bearer token)
// Ikkisi bir-biridan farq qilib qolmasligi uchun mantiq shu yerda saqlanadi.
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { chekloqniTekshir, urinishniQayd, kutishMatni } from './ip-cheklov'

/**
 * Login xatosining YAGONA matni.
 *
 * "Foydalanuvchi topilmadi" va "Parol noto'g'ri" ni ajratish istalgan
 * email saytda borligini tekshirish yo'lini ochib qo'yadi.
 */
const UMUMIY_XATO = 'Login yoki parol noto\'g\'ri'

/** Nechta xatodan keyin to'siladi */
const CHEGARA = 5

/** To'siq davomiyligi (daqiqa) — takrorlanganda uzayadi */
const TAQIQ_DAQIQA = 15

/**
 * Noto'g'ri urinishni yozadi va chegaradan oshsa hisobni to'sadi.
 *
 * To'siq VAQTINCHALIK: doimiy blok bo'lsa, birovning parolini ataylab
 * xato kiritib, uni hisobidan butunlay mahrum qilish mumkin bo'lardi.
 */
async function xatoniQayd(user) {
  const yangi = (user.kirishXatolari || 0) + 1
  const oshdi = yangi >= CHEGARA

  await prisma.user.update({
    where: { id: user.id },
    data: {
      kirishXatolari: oshdi ? 0 : yangi,
      // Har to'siqdan keyin muddat ikki barobar: avtomatik taxmin
      // qilish tobora qimmatlashsin
      kirishTaqiqUntil: oshdi
        ? new Date(Date.now() + TAQIQ_DAQIQA * 60 * 1000)
        : user.kirishTaqiqUntil,
    },
  }).catch(() => {
    // Yozib bo'lmasa kirishni to'xtatmaymiz: himoya qulaylikdan
    // ustun, lekin baza xatosi hammani tizimdan chiqarib yubormasin
  })
}

/**
 * Username yoki email + parol bo'yicha foydalanuvchini tekshiradi.
 * Muvaffaqiyatsizlikda Error tashlaydi (xabar foydalanuvchiga ko'rsatiladi).
 *
 * @param {string} login
 * @param {string} password
 * @param {string|null} [ip] So'rov kelgan IP. Berilmasa IP cheklovi
 *   ishlamaydi — chaqiruvchi uni `soravchiIp()` bilan olib beradi.
 * @returns {Promise<import('@prisma/client').User>}
 */
export async function verifyCredentials(login, password, ip = null) {
  const identifier = login?.trim()

  if (!identifier || !password) {
    throw new Error('Username (yoki email) va parol kiriting')
  }

  // IP CHEKLOVI. Hisob bo'yicha to'siq (pastda) bitta hisobni himoya
  // qiladi, lekin bitta IP dan ko'p hisobni ketma-ket sinashni to'smasdi:
  // har biriga besh urinish, to'silgach keyingisiga o'tish mumkin edi.
  const cheklov = await chekloqniTekshir('kirish', ip)
  if (!cheklov.ok) {
    throw new Error(
      `Bu tarmoqdan juda ko'p urinish bo'ldi. ${kutishMatni(cheklov.kutish)}dan keyin qayta urinib ko'ring.`
    )
  }

  // Username yoki email bo'yicha qidiramiz (Instagram uslubi).
  // Registr (katta/kichik harf) hisobga olinmaydi.
  const candidates = await prisma.user.findMany({
    where: {
      OR: [
        { username: { equals: identifier, mode: 'insensitive' } },
        { email: { equals: identifier, mode: 'insensitive' } },
      ]
    }
  })

  // ENUMERATSIYA. Avval "Bunday foydalanuvchi topilmadi" va "Parol
  // noto'g'ri" alohida xabarlar edi. Shu farq orqali istalgan email
  // yoki username saytda ro'yxatdan o'tganini tekshirib olish mumkin
  // edi — ya'ni kimning pochtasi bu yerda borligini bilib olish.
  // Endi ikkala holatda ham bir xil xabar chiqadi.
  if (candidates.length === 0) {
    // Mavjud bo'lmagan nom ham sanaladi: nom ro'yxatini sinab
    // chiqish aynan shu yo'l bilan qilinadi.
    await urinishniQayd('kirish', ip)
    throw new Error(UMUMIY_XATO)
  }

  // Kiritma "@" ni o'z ichiga olsa, avval email mos kelganini tekshiramiz.
  // Bu — kimningdir username'i boshqa birovning email'iga teng bo'lib qolgan
  // holatda natija tasodifiy bo'lib qolmasligi uchun.
  const looksLikeEmail = identifier.includes('@')
  const ordered = [...candidates].sort((a, b) => {
    const aMatch = looksLikeEmail
      ? a.email.toLowerCase() === identifier.toLowerCase()
      : a.username.toLowerCase() === identifier.toLowerCase()
    const bMatch = looksLikeEmail
      ? b.email.toLowerCase() === identifier.toLowerCase()
      : b.username.toLowerCase() === identifier.toLowerCase()
    return (bMatch ? 1 : 0) - (aMatch ? 1 : 0)
  })

  // TAQIQ TEKSHIRUVI parolni solishtirishdan OLDIN: aks holda
  // to'silgan hisobda ham har urinish bcrypt hisobini ishlatib,
  // serverni yuklab turardi.
  const taqiqlangan = ordered.find(
    (c) => c.kirishTaqiqUntil && c.kirishTaqiqUntil > new Date()
  )
  if (taqiqlangan) {
    const daqiqa = Math.ceil((taqiqlangan.kirishTaqiqUntil - Date.now()) / 60000)
    throw new Error(
      `Juda ko'p noto'g'ri urinish. ${daqiqa} daqiqadan keyin qayta urinib ko'ring.`
    )
  }

  let user = null
  for (const candidate of ordered) {
    if (await bcrypt.compare(password, candidate.password)) {
      user = candidate
      break
    }
  }

  if (!user) {
    // Xatoni AYNAN kiritilgan nomga mos hisobga yozamiz. Barcha
    // nomzodlarga yozsak, bir odam boshqasining hisobini ataylab
    // to'sib qo'ya olardi.
    const nishon = ordered[0]
    if (nishon) await xatoniQayd(nishon)
    // IP sanog'i FAQAT xato urinishda oshadi. Muvaffaqiyatli kirishni
    // sanasak, ertalab birga kirgan sinf o'zi o'zini to'sib qo'yardi.
    await urinishniQayd('kirish', ip)
    throw new Error(UMUMIY_XATO)
  }

  // Muvaffaqiyatli kirish sanoqni nolga qaytaradi
  if (user.kirishXatolari > 0 || user.kirishTaqiqUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: { kirishXatolari: 0, kirishTaqiqUntil: null },
    }).catch(() => {})
  }

  // Bloklangan hisob tizimga kira olmasligi kerak.
  if (user.isBanned) {
    throw new Error(
      user.bannedReason
        ? `Hisobingiz bloklangan. Sabab: ${user.bannedReason}`
        : 'Hisobingiz bloklangan. Administrator bilan bog\'laning.'
    )
  }

  return user
}
