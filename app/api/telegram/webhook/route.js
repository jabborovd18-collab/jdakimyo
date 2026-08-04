// app/api/telegram/webhook/route.js
//
// Telegram bot yangiliklarini qabul qiladi.
//
// NEGA SIR KALIT SHART. Bu manzil internetda ochiq turadi va uni
// topgan har kim o'zini Telegram deb ko'rsatib soxta "xabar" yubora
// olardi — masalan `/start <begona-kod>` yozib, birovning hisobini
// o'z Telegramiga ulab olardi. Telegram `setWebhook` da berilgan
// kalitni har so'rovda sarlavhada qaytaradi; shuni tekshiramiz.
//
// NEGA DOIM 200. Telegram 200 dan boshqa javob olsa, o'sha yangilikni
// qayta-qayta yuboraveradi. Bizning ichki xatoyimiz tufayli bitta
// buzuq xabar cheksiz takrorlanib, navbatni to'sib qo'yardi. Shuning
// uchun xatolar konsolga yoziladi, javob esa baribir 200 bo'ladi.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  telegramYubor, tgHimoyala, telegramSozlanganmi, TUGMALAR, sarlavhaBelgisi,
} from '@/lib/telegram'

const SAYT = 'https://www.jdakimyo.uz'

export async function POST(request) {
  // Sozlanmagan bo'lsa jimgina qaytamiz: bu holat faqat kalit
  // qo'yilmagan muhitda bo'ladi va xato yozib navbatni to'ldirish
  // hech narsa bermaydi.
  if (!telegramSozlanganmi() || !process.env.TELEGRAM_WEBHOOK_SIR) {
    return NextResponse.json({ ok: true })
  }

  const kalit = request.headers.get('x-telegram-bot-api-secret-token')
  if (kalit !== process.env.TELEGRAM_WEBHOOK_SIR) {
    // Bu YAGONA joy 200 emas: haqiqiy Telegram bunday javob olmaydi,
    // demak qayta yuborish muammosi ham yo'q.
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
  }

  try {
    const yangilik = await request.json()
    const xabar = yangilik?.message
    const chatId = xabar?.chat?.id

    // Bizni faqat shaxsiy chatdagi matn qiziqtiradi. Guruhga qo'shilgan
    // bot uchun mantiq boshqacha bo'lishi kerak, hozir u yo'q.
    if (!chatId || xabar.chat?.type !== 'private' || !xabar.text) {
      return NextResponse.json({ ok: true })
    }

    await buyruqniBajar({
      chatId: String(chatId),
      matn: xabar.text.trim(),
      username: xabar.from?.username || null,
      ism: xabar.from?.first_name || null,
    })
  } catch (e) {
    console.error('[Telegram webhook]', e.message)
  }

  return NextResponse.json({ ok: true })
}

async function buyruqniBajar({ chatId, matn, username, ism }) {
  // `/start ABC123` — deep link orqali kelgan kod
  const start = matn.match(/^\/start(?:@\w+)?\s+(\S+)$/)
  if (start) return bogla({ chatId, kod: start[1], username })

  // Doimiy klaviaturadagi tugmalar oddiy MATN bo'lib keladi, buyruq
  // emas — shuning uchun ular buyruqlar bilan bir qatorda tekshiriladi.
  switch (matn) {
    case TUGMALAR.xabarlar:
      return xabarlarMarkazi({ chatId })
    case TUGMALAR.holat:
      return holat({ chatId })
    case TUGMALAR.yordam:
      return yordam({ chatId })
  }

  const buyruq = matn.split(/\s+/)[0].toLowerCase().replace(/@\w+$/, '')

  switch (buyruq) {
    case '/start':
      return salomlash({ chatId, ism })
    case '/xabarlar':
      return xabarlarMarkazi({ chatId })
    case '/holat':
      return holat({ chatId })
    case '/sozlama':
      return xabarlarniAlmashtir({ chatId })
    case '/uzish':
      return uzish({ chatId })
    case '/yordam':
    case '/help':
      return yordam({ chatId })
    default:
      return telegramYubor(
        chatId,
        'Bunday buyruq yo\'q. Pastdagi tugmalardan foydalaning yoki /yordam yozing.',
        { klaviatura: true }
      )
  }
}

/** Kod bo'yicha sayt hisobiga bog'lash */
async function bogla({ chatId, kod, username }) {
  const yozuv = await prisma.telegramKod.findUnique({
    where: { kod: kod.toUpperCase() },
    include: { user: { select: { id: true, fullName: true, username: true } } },
  })

  if (!yozuv || yozuv.amalQiladi < new Date()) {
    return telegramYubor(
      chatId,
      'Kod noto\'g\'ri yoki muddati tugagan.\n\nSaytdagi sozlamalar bo\'limidan yangi kod oling.',
      { havola: { matn: 'Sozlamalarni ochish', url: `${SAYT}/profil/sozlama` } }
    )
  }

  // Bu Telegram allaqachon boshqa hisobga ulanganmi.
  // `chatId` unique bo'lgani uchun buni oldindan ushlamasak,
  // yozuv yaratishda tushunarsiz baza xatosi chiqardi.
  const mavjud = await prisma.telegramUlanish.findUnique({ where: { chatId } })
  if (mavjud && mavjud.userId !== yozuv.userId) {
    return telegramYubor(
      chatId,
      'Bu Telegram hisobi allaqachon boshqa JDA KIMYO hisobiga ulangan.\n\n' +
        'Avval /uzish buyrug\'i bilan uzing, keyin qaytadan ulang.'
    )
  }

  await prisma.$transaction([
    prisma.telegramUlanish.upsert({
      where: { userId: yozuv.userId },
      create: { userId: yozuv.userId, chatId, username },
      // Odam Telegramini almashtirgan bo'lishi mumkin
      update: { chatId, username },
    }),
    // Kod bir martalik
    prisma.telegramKod.delete({ where: { id: yozuv.id } }),
  ])

  const nom = yozuv.user.fullName || yozuv.user.username
  return telegramYubor(
    chatId,
    `✅ Ulandi.\n\nSalom, <b>${tgHimoyala(nom)}</b>! Endi saytdagi bildirishnomalar shu yerga ham keladi.\n\n` +
      'Pastdagi tugmalardan foydalaning, saytni esa yozuv maydoni yonidagi ' +
      '<b>Platforma</b> tugmasi orqali oching.',
    { klaviatura: true }
  )
}

async function salomlash({ chatId, ism }) {
  const ulangan = await prisma.telegramUlanish.findUnique({ where: { chatId } })

  if (ulangan) {
    return telegramYubor(
      chatId,
      'Hisobingiz allaqachon ulangan. Pastdagi tugmalardan foydalaning.',
      { klaviatura: true }
    )
  }

  return telegramYubor(
    chatId,
    `Salom${ism ? `, <b>${tgHimoyala(ism)}</b>` : ''}!\n\n` +
      'Bu — <b>JDA KIMYO</b> boti. Saytdagi bildirishnomalarni shu yerda olasiz.\n\n' +
      'Ulash uchun saytga kiring → Sozlamalar → Telegram → kodni oling va shu yerga yuboring.',
    { havola: { matn: 'Saytni ochish', url: `${SAYT}/profil/sozlama` } }
  )
}

/**
 * BILDIRISHNOMALAR MARKAZI — botning asosiy vazifasi.
 *
 * Saytdagi qo'ng'iroqning ko'chma nusxasi: oxirgi xabarlar va
 * o'qilmaganlar soni. Bu yerda O'QILGAN deb belgilanmaydi — odam
 * xabarni saytda ochib, o'sha yerda o'qiydi. Botda belgilansa,
 * kabinetdagi qizil nishon o'zidan-o'zi yo'qolib, odam nimadir
 * o'tkazib yuborganini bilmay qolardi.
 */
async function xabarlarMarkazi({ chatId }) {
  const ulangan = await prisma.telegramUlanish.findUnique({
    where: { chatId },
    select: { userId: true },
  })
  if (!ulangan) return ulanmagan(chatId)

  const [xabarlar, oqilmagan] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: ulangan.userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { icon: true, sarlavha: true, matn: true, oqilgan: true, createdAt: true },
    }),
    prisma.notification.count({ where: { userId: ulangan.userId, oqilgan: false } }),
  ])

  if (xabarlar.length === 0) {
    return telegramYubor(
      chatId,
      '🔔 <b>Bildirishnomalar</b>\n\nHozircha xabar yo\'q.',
      { havola: { matn: 'Kabinetni ochish', url: `${SAYT}/profil` } }
    )
  }

  const qatorlar = [
    `🔔 <b>Bildirishnomalar</b>${oqilmagan > 0 ? ` — ${oqilmagan} ta o'qilmagan` : ''}`,
    '',
  ]

  for (const x of xabarlar) {
    const belgi = sarlavhaBelgisi(x.icon, x.sarlavha)
    // O'qilmagani SO'Z bilan belgilanadi. Avval `•` va `·` ishlatilgan
    // edi — telefon ekranida ikkalasi bir xil ko'rinardi va farqi
    // umuman bilinmasdi.
    const yangi = x.oqilgan ? '' : ' — <i>yangi</i>'
    qatorlar.push(`${belgi}<b>${tgHimoyala(x.sarlavha)}</b>${yangi}`)
    if (x.matn) qatorlar.push(`<i>${tgHimoyala(qisqart(x.matn, 90))}</i>`)
    qatorlar.push(`<i>${vaqtFarqi(x.createdAt)}</i>`)
    qatorlar.push('')
  }

  return telegramYubor(chatId, qatorlar.join('\n').trim(), {
    havola: { matn: 'Hammasini ko\'rish', url: `${SAYT}/profil/bildirishnomalar` },
  })
}

/** "3 soat oldin" — aniq sana telefonda o'qishga noqulay */
function vaqtFarqi(sana) {
  const daqiqa = Math.floor((Date.now() - new Date(sana).getTime()) / 60000)
  if (daqiqa < 1) return 'hozirgina'
  if (daqiqa < 60) return `${daqiqa} daqiqa oldin`
  const soat = Math.floor(daqiqa / 60)
  if (soat < 24) return `${soat} soat oldin`
  return `${Math.floor(soat / 24)} kun oldin`
}

function qisqart(matn, uzunlik) {
  const t = String(matn).replace(/\s+/g, ' ').trim()
  return t.length > uzunlik ? `${t.slice(0, uzunlik - 1)}…` : t
}

async function holat({ chatId }) {
  const ulangan = await prisma.telegramUlanish.findUnique({
    where: { chatId },
    include: {
      user: {
        select: { fullName: true, username: true, coins: true, level_points: true },
      },
    },
  })

  if (!ulangan) return ulanmagan(chatId)

  const u = ulangan.user
  return telegramYubor(
    chatId,
    `<b>${tgHimoyala(u.fullName || u.username)}</b>\n` +
      `Tanga: ${u.coins ?? 0}\n` +
      `Ball: ${u.level_points ?? 0}\n\n` +
      `Xabarlar: ${ulangan.xabarlar ? 'yoqilgan' : 'o\'chirilgan'}`,
    { havola: { matn: 'Kabinetni ochish', url: `${SAYT}/profil` } }
  )
}

async function xabarlarniAlmashtir({ chatId }) {
  const ulangan = await prisma.telegramUlanish.findUnique({ where: { chatId } })
  if (!ulangan) return ulanmagan(chatId)

  const yangi = !ulangan.xabarlar
  await prisma.telegramUlanish.update({
    where: { chatId },
    data: { xabarlar: yangi },
  })

  return telegramYubor(
    chatId,
    yangi
      ? '🔔 Xabar oqimi yoqildi.'
      : '🔕 Xabar oqimi o\'chirildi. Ulanish saqlanib qoldi — qaytarish uchun yana /sozlama yozing.',
    { klaviatura: true }
  )
}

async function uzish({ chatId }) {
  const ulangan = await prisma.telegramUlanish.findUnique({ where: { chatId } })
  if (!ulangan) return ulanmagan(chatId)

  await prisma.telegramUlanish.delete({ where: { chatId } })
  return telegramYubor(
    chatId,
    'Ulanish uzildi. Bildirishnomalar endi bu yerga kelmaydi.\n\n' +
      'Qaytadan ulash uchun saytdan yangi kod oling.',
    // Tugmalar ham olib tashlanadi: ulanmagan odamga ular ishlamaydi
    { klaviaturaniOchir: true }
  )
}

function yordam(p) {
  return telegramYubor(
    p.chatId,
    '<b>JDA KIMYO boti</b>\n\n' +
      'Saytdagi bildirishnomalarni shu yerda olasiz.\n\n' +
      '<b>Buyruqlar</b>\n' +
      '/xabarlar — oxirgi bildirishnomalar\n' +
      '/holat — hisob ma\'lumotlari\n' +
      '/sozlama — xabar oqimini yoqish yoki o\'chirish\n' +
      '/uzish — hisobni uzish\n\n' +
      'Saytni yozuv maydoni yonidagi <b>Platforma</b> tugmasi orqali oching.',
    { klaviatura: true }
  )
}

function ulanmagan(chatId) {
  return telegramYubor(
    chatId,
    'Hisobingiz ulanmagan. Saytdan kod olib, shu yerga yuboring.',
    { havola: { matn: 'Sozlamalarni ochish', url: `${SAYT}/profil/sozlama` } }
  )
}
