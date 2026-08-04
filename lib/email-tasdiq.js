// lib/email-tasdiq.js
//
// Email formatini tekshirish va tasdiqlash kodi bilan ishlash.
//
// NEGA KERAK EDI. Ro'yxatdan o'tishda email umuman tekshirilmasdi —
// "asdasd" ham qabul qilinardi. Ya'ni bir odam istalgancha akkaunt
// ochib, tanga yig'ib olishi mumkin edi. Bitta emailga bitta akkaunt
// qoidasi bazada allaqachon bor edi (`email @unique`), lekin email
// HAQIQIY ekanini hech kim tekshirmagani uchun u qoida hech narsani
// to'smasdi.
import { prisma } from './prisma'
import { xatYubor, tasdiqXati, pochtaSozlanganmi } from './pochta'

/** Kod necha daqiqa amal qiladi */
const AMAL_DAQIQA = 30

/** Ketma-ket qayta yuborish orasidagi eng kam vaqt (soniya) */
export const QAYTA_YUBORISH_KUTISH = 60

/** Nechta noto'g'ri urinishdan keyin kod bekor qilinadi */
const ENG_KOP_URINISH = 5

/**
 * Bir martalik ("chiqindi") pochta domenlari.
 *
 * To'liq ro'yxat bo'lishi mumkin emas — yangilari har kuni paydo
 * bo'ladi. Maqsad ham to'liqlik emas: eng ko'p ishlatiladiganlarini
 * to'ssak, ko'p akkaunt ochish qulaylikdan chiqadi. Tasdiqlash kodining
 * o'zi asosiy to'siq bo'lib qoladi.
 */
const BIR_MARTALIK_DOMENLAR = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', '10minutemail.com',
  'tempmail.com', 'temp-mail.org', 'throwawaymail.com', 'yopmail.com',
  'trashmail.com', 'sharklasers.com', 'getnada.com', 'maildrop.cc',
  'dispostable.com', 'fakeinbox.com', 'mohmal.com', 'emailondeck.com',
  'moakt.com', 'tempail.com', 'mailnesia.com', 'spamgourmet.com',
])

// Amaliy naqsh: RFC ga to'liq mos emas, lekin haqiqiy hayotdagi
// manzillarni o'tkazib, aniq axlatni to'sadi. To'liq RFC namunasi
// o'qib bo'lmaydigan darajada uzun va foyda bermaydi.
const NAQSH = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/

/**
 * Email shaklan to'g'rimi va ruxsat etilganmi.
 * @returns {{ok: true} | {ok: false, xato: string}}
 */
export function emailniTekshir(email) {
  const manzil = (email || '').trim().toLowerCase()

  if (!manzil) return { ok: false, xato: 'Email kiriting' }
  if (manzil.length > 254) return { ok: false, xato: 'Email juda uzun' }
  if (!NAQSH.test(manzil)) return { ok: false, xato: 'Email manzili noto\'g\'ri yozilgan' }

  const domen = manzil.split('@')[1]
  if (BIR_MARTALIK_DOMENLAR.has(domen)) {
    return {
      ok: false,
      xato: 'Vaqtinchalik pochta xizmatlari qabul qilinmaydi. Doimiy manzilingizni kiriting.',
    }
  }

  return { ok: true }
}

/** Olti xonali kod. Birinchi raqam 0 bo'lmasligi uchun 100000 dan boshlanadi. */
function kodYarat() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

/**
 * Kod yaratadi, saqlaydi va xat yuboradi.
 *
 * Kod bazada OCHIQ saqlanadi. Parol emas — u 30 daqiqa yashaydigan va
 * bir marta ishlatiladigan qiymat; xeshlash bu yerda himoya bermaydi,
 * lekin admin muammoni tekshirishini qiyinlashtirardi.
 *
 * @returns {Promise<{yuborildi: boolean, sabab?: string, kutish?: number}>}
 */
export async function kodYuboroq(user) {
  const mavjud = await prisma.emailTasdiq.findUnique({ where: { userId: user.id } })

  // Ketma-ket bosishdan himoya: aks holda tugmani bosib turib
  // birovning pochtasini xat bilan to'ldirish mumkin edi.
  if (mavjud) {
    const otgan = (Date.now() - mavjud.yuborilgan.getTime()) / 1000
    if (otgan < QAYTA_YUBORISH_KUTISH) {
      return {
        yuborildi: false,
        sabab: 'tez',
        kutish: Math.ceil(QAYTA_YUBORISH_KUTISH - otgan),
      }
    }
  }

  const kod = kodYarat()
  const amalQiladi = new Date(Date.now() + AMAL_DAQIQA * 60 * 1000)

  await prisma.emailTasdiq.upsert({
    where: { userId: user.id },
    create: { userId: user.id, kod, amalQiladi },
    // Qayta yuborilganda urinishlar nolga qaytadi: yangi kod — yangi imkon
    update: { kod, amalQiladi, urinish: 0, yuborilgan: new Date() },
  })

  const xat = tasdiqXati({ ism: user.fullName || user.username, kod })
  const natija = await xatYubor({ kimga: user.email, ...xat })

  // Kalit qo'yilmagan bo'lsa kodni konsolga chiqaramiz — ishlab chiqish
  // paytida ro'yxatdan o'tishni sinab ko'rish uchun.
  if (!natija.yuborildi && !pochtaSozlanganmi()) {
    console.log(`[Email tasdiq] ${user.email} uchun kod: ${kod}`)
  }

  return natija
}

/**
 * Kodni tekshiradi va to'g'ri bo'lsa hisobni tasdiqlaydi.
 * @returns {Promise<{ok: true} | {ok: false, xato: string}>}
 */
export async function kodniTekshir(userId, kiritilgan) {
  const kod = String(kiritilgan || '').trim()

  const yozuv = await prisma.emailTasdiq.findUnique({ where: { userId } })
  if (!yozuv) {
    return { ok: false, xato: 'Kod topilmadi. Yangisini so\'rang.' }
  }

  if (yozuv.amalQiladi < new Date()) {
    return { ok: false, xato: 'Kod muddati tugagan. Yangisini so\'rang.' }
  }

  if (yozuv.urinish >= ENG_KOP_URINISH) {
    return { ok: false, xato: 'Juda ko\'p noto\'g\'ri urinish. Yangi kod so\'rang.' }
  }

  if (yozuv.kod !== kod) {
    await prisma.emailTasdiq.update({
      where: { userId },
      data: { urinish: { increment: 1 } },
    })
    const qolgan = ENG_KOP_URINISH - yozuv.urinish - 1
    return {
      ok: false,
      xato: qolgan > 0
        ? `Kod noto'g'ri. Yana ${qolgan} ta urinish qoldi.`
        : 'Kod noto\'g\'ri. Yangi kod so\'rang.',
    }
  }

  // Tasdiqlandi — yozuvni o'chiramiz, u endi kerak emas
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailTasdiq.delete({ where: { userId } }),
  ])

  return { ok: true }
}

/**
 * Tanga topishga ruxsat bormi.
 *
 * TASDIQLANMAGAN HISOB TANGA TOPMAYDI. Saytni o'qiydi, quiz yechadi,
 * ammo missiya mukofoti, sovg'a va laboratoriya xaridi yopiq — ya'ni
 * ko'p akkaunt ochishning ma'nosi qolmaydi. Butunlay kiritmaslik ham
 * mumkin edi, lekin xat spam papkasiga tushsa odam butunlay yo'qolardi.
 */
export function tangaTopaOladimi(user) {
  return Boolean(user?.emailVerified)
}
