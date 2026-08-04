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
import { telegramYubor, tgHimoyala, telegramSozlanganmi } from '@/lib/telegram'

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

  const buyruq = matn.split(/\s+/)[0].toLowerCase().replace(/@\w+$/, '')

  switch (buyruq) {
    case '/start':
      return salomlash({ chatId, ism })
    case '/holat':
      return holat({ chatId })
    case '/xabarlar':
      return xabarlarniAlmashtir({ chatId })
    case '/uzish':
      return uzish({ chatId })
    case '/yordam':
    case '/help':
      return yordam({ chatId })
    default:
      return telegramYubor(
        chatId,
        'Bunday buyruq yo\'q. /yordam yozing.'
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
      'Buyruqlar: /holat · /xabarlar · /uzish'
  )
}

async function salomlash({ chatId, ism }) {
  const ulangan = await prisma.telegramUlanish.findUnique({ where: { chatId } })

  if (ulangan) {
    return telegramYubor(
      chatId,
      'Hisobingiz allaqachon ulangan. Buyruqlar: /holat · /xabarlar · /uzish'
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
      ? '🔔 Xabarlar yoqildi.'
      : '🔕 Xabarlar o\'chirildi. Ulanish saqlanib qoldi — qaytarish uchun yana /xabarlar yozing.'
  )
}

async function uzish({ chatId }) {
  const ulangan = await prisma.telegramUlanish.findUnique({ where: { chatId } })
  if (!ulangan) return ulanmagan(chatId)

  await prisma.telegramUlanish.delete({ where: { chatId } })
  return telegramYubor(
    chatId,
    'Ulanish uzildi. Bildirishnomalar endi bu yerga kelmaydi.\n\n' +
      'Qaytadan ulash uchun saytdan yangi kod oling.'
  )
}

function yordam(p) {
  return telegramYubor(
    p.chatId,
    '<b>Buyruqlar</b>\n\n' +
      '/holat — hisob ma\'lumotlari\n' +
      '/xabarlar — bildirishnomalarni yoqish yoki o\'chirish\n' +
      '/uzish — hisobni uzish\n\n' +
      'Ulash uchun saytdagi Sozlamalar bo\'limidan kod oling.'
  )
}

function ulanmagan(chatId) {
  return telegramYubor(
    chatId,
    'Hisobingiz ulanmagan. Saytdan kod olib, shu yerga yuboring.',
    { havola: { matn: 'Sozlamalarni ochish', url: `${SAYT}/profil/sozlama` } }
  )
}
