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
import { bugungiIqtibos, iqtibosMatni } from '@/lib/iqtibos'
import { xabarYubor } from '@/lib/bildirishnoma'
import { koprukkaUzat, kopruSozlanganmi, saytniki } from '@/lib/telegram-kopruk'

const SAYT = 'https://www.jdakimyo.uz'

/** Ilova kanali — APK va yangilanishlar shu yerda e'lon qilinadi */
const ILOVA_KANALI = process.env.ILOVA_KANALI || 'https://t.me/jdakimyo_ilova'

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

    // BOT BLOKLANGANI. Odam botni bloklaganda Telegram xabar emas,
    // `my_chat_member` yuboradi. Buni ushlamasak, yozuv bazada tirik
    // bo'lib qolaverar va har e'londa o'sha o'lik manzilga urinib
    // ko'rilardi.
    if (yangilik?.my_chat_member) {
      await azolikOzgardi(yangilik.my_chat_member)
      return NextResponse.json({ ok: true })
    }

    // INLINE TUGMALAR butunlay Python botniki: saytning birorta
    // xabarida inline tugma yo'q (faqat havolalar bor, ular bosilganda
    // Telegram hech narsa yubormaydi). Demak callback kelgan bo'lsa, u
    // aniq quiz yoki PDF oqimidan.
    if (yangilik?.callback_query) {
      await koprukka(yangilik, yangilik.callback_query.message?.chat?.id)
      return NextResponse.json({ ok: true })
    }

    const xabar = yangilik?.message
    const chatId = xabar?.chat?.id

    if (!chatId) {
      return NextResponse.json({ ok: true })
    }

    // GURUHDA bot suhbatga aralashmaydi — faqat bitta buyruqqa javob
    // beradi. Har xabarga javob yozadigan bot guruhdan darrov
    // chiqarib yuboriladi.
    if (xabar.chat?.type === 'group' || xabar.chat?.type === 'supergroup') {
      if (/^\/iqtibos(@\w+)?$/.test(xabar.text.trim())) {
        await guruhgaIqtibos(String(chatId))
      }
      return NextResponse.json({ ok: true })
    }

    if (xabar.chat?.type !== 'private') {
      return NextResponse.json({ ok: true })
    }

    // MATNSIZ XABAR — hujjat, rasm, ovoz. Sayt ularning birortasini
    // ishlatmaydi; test fayli va PDF uchun rasmlar aynan shu yo'l bilan
    // keladi. Ilgari bu yerda `return` turardi va fayllar jimgina
    // tashlab yuborilardi.
    if (!xabar.text) {
      await koprukka(yangilik, chatId)
      return NextResponse.json({ ok: true })
    }

    const matn = xabar.text.trim()

    // Sayt o'ziniki bo'lmagan HAMMA narsani Python botga uzatadi —
    // quiz oqimidagi erkin matn (fayl nomi va h.k.) ham shu yo'ldan
    // o'tadi.
    if (!saytniki(matn, Object.values(TUGMALAR))) {
      await koprukka(yangilik, chatId)
      return NextResponse.json({ ok: true })
    }

    await buyruqniBajar({
      chatId: String(chatId),
      matn,
      username: xabar.from?.username || null,
      ism: xabar.from?.first_name || null,
    })
  } catch (e) {
    console.error('[Telegram webhook]', e.message)
  }

  return NextResponse.json({ ok: true })
}

/**
 * Yangilikni Python botga (quiz va PDF xizmati) uzatadi.
 *
 * Muvaffaqiyatli bo'lsa BU YERDA hech narsa yozilmaydi — javobni
 * Python bot o'zi yozadi. Faqat uzatib bo'lmagan holatda foydalanuvchi
 * sababini biladi: aks holda bot butunlay jim qolib, odam "buzilibdi"
 * deb o'ylardi.
 */
async function koprukka(yangilik, chatId) {
  const id = String(chatId || '')
  if (!id) return

  if (!kopruSozlanganmi()) {
    return telegramYubor(
      id,
      'Bunday buyruq yo\'q. Pastdagi tugmalardan foydalaning yoki /yordam yozing.',
      { klaviatura: true }
    )
  }

  const natija = await koprukkaUzat(yangilik)
  if (natija.ok) return

  if (natija.sabab === 'uxlayapti') {
    return telegramYubor(
      id,
      '⏳ Xizmat uyg\'onmoqda — bir daqiqadan keyin qayta yuboring.\n\n' +
        'Bu uzoq vaqt foydalanilmaganda bir marta sodir bo\'ladi.',
      { klaviatura: true }
    )
  }

  return telegramYubor(
    id,
    '⚠️ Quiz va PDF xizmati hozir ishlamayapti. Birozdan keyin urinib ko\'ring.',
    { klaviatura: true }
  )
}

/** Guruhga bugungi iqtibosni yuboradi (/iqtibos buyrug'i) */
async function guruhgaIqtibos(chatId) {
  const iqtibos = await bugungiIqtibos()
  return telegramYubor(chatId, iqtibosMatni(iqtibos, tgHimoyala), {
    havola: { matn: 'JDA KIMYO', url: SAYT },
  })
}

/**
 * Kod necha daqiqa yashaydi.
 *
 * AVVAL IKKI DAQIQA EDI VA BU XATO EDI. Odam kodni telefonda o'qiydi,
 * kompyuterga o'tadi, sozlamalarni topadi va teradi — birinchi safar
 * bu ikki daqiqadan uzoq davom etadi. Natijada kod ishlatilishidan
 * oldin kuyar va foydalanuvchi "bot kod berdi, sayt noto'g'ri deydi"
 * degan holatga tushardi.
 *
 * O'n daqiqa xavfsizlikni deyarli pasaytirmaydi: kod bir martalik,
 * olti belgili (31 belgidan — 887 million variant) va uni ishlatish
 * uchun saytdagi tayyor sessiya kerak. Saytdan botga yuboriladigan
 * kod ham o'n daqiqa yashaydi.
 */
const BOT_KOD_DAQIQA = 10

/**
 * Chalkashadigan belgilarsiz alifbo (0/O, 1/I/L yo'q) — kodni odam
 * telefondan o'qib kompyuterga ko'chiradi.
 */
const ALIFBO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function kodYarat() {
  let kod = ''
  for (let i = 0; i < 6; i++) kod += ALIFBO[Math.floor(Math.random() * ALIFBO.length)]
  return kod
}

/**
 * IKKINCHI ULANISH USULI — botdan kod olish.
 *
 * Birinchi usulda odam avval saytga kirib, sozlamalarni topib, kod
 * olishi kerak edi. Amalda odam botni oldin topadi (Telegram doim
 * ochiq) va o'sha yerdan boshlashni xohlaydi.
 *
 * Xabarda kod HAM, havola HAM beriladi: havolani bosgan odam hech
 * narsa termaydi, kod esa boshqa qurilmada ochgan odam uchun.
 */
async function kodBer({ chatId, username }) {
  const ulangan = await prisma.telegramUlanish.findUnique({
    where: { chatId },
    select: { id: true },
  })
  if (ulangan) {
    // UZISHGA UNDAMAYMIZ. Bu yerda avval "uzish uchun /uzish yozing"
    // deb turardi va odam kod olish uchun shu yo'ldan yurib,
    // ishlab turgan ulanishini yo'qotardi.
    return telegramYubor(
      chatId,
      '✅ Hisobingiz allaqachon ulangan — yangi kod kerak emas.\n\n' +
        'Pastdagi tugmalardan foydalaning.',
      { klaviatura: true }
    )
  }

  const kod = kodYarat()
  const amalQiladi = new Date(Date.now() + BOT_KOD_DAQIQA * 60 * 1000)

  // Har so'rovda eski kod almashtiriladi: bir vaqtda ikkita amal
  // qiluvchi kod qolsa, birinchisini ko'rib qolgan odam keyin ham
  // ishlatib qolardi.
  await prisma.telegramBotKod.upsert({
    where: { chatId },
    create: { chatId, kod, username, amalQiladi },
    update: { kod, username, amalQiladi, urinish: 0 },
  })

  return telegramYubor(
    chatId,
    `<b>Ulanish kodi</b>\n\n<code>${kod}</code>\n\n` +
      `Kodni saytdagi <b>Sozlamalar → Telegram</b> bo'limiga kiriting.\n` +
      `Kod ${BOT_KOD_DAQIQA} daqiqa amal qiladi.\n\n` +
      'Yoki pastdagi tugmani bosing — kod o\'zi kiritiladi.',
    { havola: { matn: 'Ulash', url: `${SAYT}/profil/telegram?kod=${kod}` } }
  )
}

/**
 * Bot bilan a'zolik holati o'zgardi (bloklandi yoki qayta ochildi).
 *
 * Bloklanganda ulanish O'CHIRILMAYDI, faqat xabar oqimi to'xtaydi.
 * Sabab: odam botni qayta ochsa, hisobini boshqatdan ulashga
 * majburlash ortiqcha — saytdagi bog'lanish saqlanib qolgani yaxshi.
 * O'lik yozuvni e'lon yuborish paytida ham tozalaymiz.
 */
async function azolikOzgardi(hodisa) {
  const chat = hodisa?.chat
  const chatId = String(chat?.id || '')
  const holat = hodisa?.new_chat_member?.status
  if (!chatId || !holat) return

  // GURUH — botni qo'shishgan yoki chiqarishgan
  if (chat.type === 'group' || chat.type === 'supergroup') {
    return guruhOzgardi({ chatId, chat, holat, kim: hodisa?.from })
  }

  // `kicked` — bloklangan, `member` — qayta ochilgan
  if (holat !== 'kicked' && holat !== 'member') return

  await prisma.telegramUlanish
    .updateMany({ where: { chatId }, data: { xabarlar: holat === 'member' } })
    .catch(() => {})
}

/**
 * Bot guruhga qo'shildi yoki chiqarildi.
 *
 * Yozuv O'CHIRILMAYDI, faqat `faol` almashadi: bot qayta qo'shilsa,
 * "iqtibos yuborilmasin" degan sozlama saqlanib qolgani yaxshi —
 * aks holda uni har safar qaytadan o'chirishga to'g'ri kelardi.
 */
async function guruhOzgardi({ chatId, chat, holat, kim }) {
  const ichkarida = holat === 'member' || holat === 'administrator'
  const nom = chat.title || null
  const qoshgan = kim?.username ? `@${kim.username}` : kim?.first_name || null

  await prisma.telegramGuruh
    .upsert({
      where: { chatId },
      create: { chatId, nom, qoshgan, faol: ichkarida },
      // Nom o'zgarishi mumkin — har hodisada yangilanadi
      update: { nom, faol: ichkarida },
    })
    .catch(() => {})

  if (ichkarida) {
    await telegramYubor(
      chatId,
      '👋 Salom! Men <b>JDA KIMYO</b> botiman.\n\n' +
        'Har kuni shu guruhga bitta kimyoviy iqtibos yuboraman.\n\n' +
        'Shaxsiy bildirishnomalar uchun menga alohida yozing.',
      { havola: { matn: 'Saytni ochish', url: SAYT } }
    ).catch(() => {})
  }
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
    case '/kod':
      return kodBer({ chatId, username })
    case '/xabarlar':
      return xabarlarMarkazi({ chatId })
    case '/holat':
      return holat({ chatId })
    case '/sozlama':
      return xabarlarniAlmashtir({ chatId })
    case '/uzish':
      return uzish({ chatId, matn })
    case '/ilova':
      return ilova({ chatId })
    case '/yordam':
    case '/help':
      return yordam({ chatId })
    default:
      // Bu yerga faqat SAYT_BUYRUQLARI dagi, lekin yuqorida
      // ushlanmagan buyruq tushishi mumkin — ya'ni amalda hech qachon.
      return yordam({ chatId })
  }
}

/**
 * Mobil ilova — kanal havolasi.
 *
 * APK botning O'ZI orqali yuborilmaydi: Bot API fayl chegarasi 50 MB
 * va Expo bilan yasalgan ilova undan katta. Kanalga fayl egasi oddiy
 * foydalanuvchi sifatida yuklaydi (u yerda chegara 2 GB), bot esa
 * faqat havolani beradi. Yon foyda: kanal obunachilari har
 * yangilanishdan avtomatik xabardor bo'ladi.
 */
function ilova({ chatId }) {
  return telegramYubor(
    chatId,
    '📱 <b>JDA KIMYO mobil ilovasi</b>\n\n' +
      'Ilovaning oxirgi versiyasi, o\'rnatish yo\'riqnomasi va yangiliklar ' +
      'rasmiy kanalda joylanadi.\n\n' +
      'Android uchun APK faylni o\'sha yerdan yuklab olasiz. ' +
      'App Store va Play Market havolalari chiqishi bilan shu kanalda e\'lon qilinadi.',
    { havola: { matn: '📥 Kanalga o\'tish', url: ILOVA_KANALI } }
  )
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
      '<b>Hisobni ulashning ikki yo\'li:</b>\n' +
      '1. Shu yerda /kod yozing va kodni saytga kiriting\n' +
      '2. Yoki saytdan kod olib, shu yerga yuboring\n\n' +
      'Birinchisi qulayroq — saytda faqat kodni kiritasiz.',
    { havola: { matn: 'Kod olish', url: `${SAYT}/profil/telegram` } }
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

/**
 * Ulanishni uzish — TASDIQ TALAB QILADI.
 *
 * Avval bitta so'z yetardi va uzish darhol bajarilardi. Bu haqiqiy
 * muammoga aylandi: bot ulangan holatda /kod so'ralganda "uzish
 * uchun /uzish yozing" deb maslahat berardi va odam shuni bajarib,
 * ulanishini yo'qotardi — keyin "profil o'zidan o'zi chiqib ketdi"
 * bo'lib ko'rinardi.
 *
 * Tasdiq matni ATAYLAB uzunroq (`/uzish tasdiq`): tasodifan yozib
 * yuborib bo'lmaydi.
 */
async function uzish({ chatId, matn }) {
  const ulangan = await prisma.telegramUlanish.findUnique({ where: { chatId } })
  if (!ulangan) return ulanmagan(chatId)

  const tasdiqlandi = /^\/uzish(@\w+)?\s+tasdiq$/i.test(String(matn || '').trim())
  if (!tasdiqlandi) {
    return telegramYubor(
      chatId,
      '⚠️ <b>Ulanishni uzasizmi?</b>\n\n' +
        'Bildirishnomalar bu yerga kelmay qoladi va hisobni qaytadan ' +
        'ulash kerak bo\'ladi.\n\n' +
        'Rostdan uzmoqchi bo\'lsangiz, <code>/uzish tasdiq</code> deb yozing.\n\n' +
        'Faqat xabarlar bezovta qilayotgan bo\'lsa, ulanishni uzish shart emas — ' +
        '/sozlama yozing, oqim to\'xtaydi va ulanish saqlanadi.',
      { klaviatura: true }
    )
  }

  await prisma.telegramUlanish.delete({ where: { chatId } })

  // UZILISH IZSIZ QOLMASIN. Ulanish yo'qolganda odam buni faqat
  // keyinroq, xabar kelmay qo'yganda sezardi va sababi noma'lum
  // bo'lardi ("o'zidan o'zi chiqib ketdi"). Endi kabinetda yozuv
  // qoladi. Bildirishnoma ulanish O'CHIRILGANDAN keyin yuboriladi —
  // aks holda ko'prik uni yana shu chatga jo'natardi.
  xabarYubor(ulangan.userId, {
    turi: 'tizim',
    icon: '✈️',
    sarlavha: 'Telegram ulanishi uzildi',
    matn: 'Bu botdagi /uzish buyrug\'i orqali bajarildi. Siz qilmagan bo\'lsangiz, hisobingiz xavfsizligini tekshiring.',
    havola: '/profil/telegram',
  }).catch(() => {})

  return telegramYubor(
    chatId,
    'Ulanish uzildi. Bildirishnomalar endi bu yerga kelmaydi.\n\n' +
      'Qaytadan ulash uchun /kod yozing yoki saytdan kod oling.',
    // Tugmalar ham olib tashlanadi: ulanmagan odamga ular ishlamaydi
    { klaviaturaniOchir: true }
  )
}

function yordam(p) {
  return telegramYubor(
    p.chatId,
    '<b>JDA KIMYO boti</b>\n\n' +
      'Saytdagi bildirishnomalarni shu yerda olasiz, test to\'plamingizdan ' +
      'Telegram quiz yasayman va rasmlardan PDF yig\'aman.\n\n' +
      '<b>Buyruqlar</b>\n' +
      '/xabarlar — oxirgi bildirishnomalar\n' +
      '/holat — hisob ma\'lumotlari\n' +
      '/ilova — mobil ilovani yuklab olish\n' +
      '/sozlama — xabar oqimini yoqish yoki o\'chirish\n' +
      '/uzish — hisobni uzish\n\n' +
      '<b>Quiz va PDF</b>\n' +
      'Pastdagi <b>🧩 Quiz yaratish</b> tugmasini bosing va test faylini ' +
      '(.txt, .docx yoki .xlsx) yuboring. To\'g\'ri javob <code>+</code> ' +
      'belgisi bilan belgilanadi.\n\n' +
      'Saytni yozuv maydoni yonidagi <b>Platforma</b> tugmasi orqali oching.',
    { klaviatura: true }
  )
}

function ulanmagan(chatId) {
  return telegramYubor(
    chatId,
    'Hisobingiz ulanmagan.\n\n/kod yozing — men sizga kod beraman, uni saytga kiritasiz.',
    { havola: { matn: 'Saytni ochish', url: `${SAYT}/profil/telegram` } }
  )
}
