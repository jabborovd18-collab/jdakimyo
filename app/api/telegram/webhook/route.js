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
  tugmaJavobi,
} from '@/lib/telegram'
import {
  TUGMA,
  guruhSozlamaAlmashtir,
  guruhSozlamasi,
  yangilikNatijasi,
  yangilikTaklifi,
  yangilikniTarqat,
} from '@/lib/telegram-yangilik'
import { bugungiIqtibos, iqtibosMatni } from '@/lib/iqtibos'
import { xabarYubor } from '@/lib/bildirishnoma'
import { koprukkaUzat, kopruSozlanganmi, saytniki } from '@/lib/telegram-kopruk'
import { TANGA_TOPISH, TANGA_SAVOLGA } from '@/lib/bot-tanga'
import {
  aiRejimdami,
  aiRejimniBoshla,
  aiRejimniTugat,
  shaxsiyAiXabariniBajar,
  guruhAiXabariniBajar,
} from '@/lib/telegram-ai-handler'

const SAYT = 'https://www.jdakimyo.uz'

/** Ilova kanali — APK va yangilanishlar shu yerda e'lon qilinadi */
const ILOVA_KANALI = process.env.ILOVA_KANALI || 'https://t.me/jdakimyo_ilova'

/** Platformaning rasmiy kanali — darslar va yangiliklar */
const RASMIY_KANAL = process.env.RASMIY_KANAL || 'https://t.me/jdakimyouz'

/**
 * Botning @nomi — guruhdan shaxsiy chatga havola qo'yish uchun.
 *
 * Guruhda "menga shaxsiy yozing" deb aytish yetarli emas: odam botni
 * qidirib topishi kerak bo'ladi va ko'pchilik shu joyda to'xtaydi.
 */
function botNominiTozala(raw) {
  if (!raw) return 'jdakimyouzbot'
  return String(raw)
    .replace(/^https?:\/\/t\.me\//i, '')
    .replace(/^@/, '')
    .trim()
    .toLowerCase()
}

const BOT_NOMI = botNominiTozala(process.env.TELEGRAM_BOT_USERNAME || 'jdakimyouzbot')

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
    // KANALGA YANGI POST — JDA KIMYO NEWS. Bot admin bo'lgan har
    // qanday kanaldan kelishi mumkin; xavfsizlik tugma bosilganda
    // tekshiriladi (faqat superadmin tarqata oladi).
    if (yangilik?.channel_post) {
      const post = yangilik.channel_post
      // Botning O'Z xabari (tasdiq tugmasi) qayta ishlanmasin —
      // aks holda cheksiz halqa hosil bo'lardi.
      if (!post.from?.is_bot && post.chat?.id) {
        await yangilikTaklifi({
          kanalId: String(post.chat.id),
          xabarId: post.message_id,
        }).catch((e) => console.error('[Yangilik taklifi]', e.message))
      }
      return NextResponse.json({ ok: true })
    }

    if (yangilik?.callback_query) {
      const cb = yangilik.callback_query
      const cbChat = cb.message?.chat

      // SAYT O'ZI ISHLAYDIGAN TUGMALAR. `sayt:` old qo'shimchasi
      // bo'lgani ko'prikka uzatilmaydi: yangilik tarqatish va guruh
      // sozlamalari saytning bazasida yashaydi.
      if (String(cb.data || '').startsWith('sayt:')) {
        await saytTugmasi(cb).catch((e) => console.error('[Sayt tugmasi]', e.message))
        return NextResponse.json({ ok: true })
      }

      // Guruh va kanaldagi tugmalar uchun hisob tekshirilmaydi —
      // u yerda "ulangan hisob" tushunchasi yo'q.
      await koprukka(yangilik, cbChat?.id, {
        hisobTekshir: cbChat?.type === 'private',
      })
      return NextResponse.json({ ok: true })
    }

    // QUIZ JAVOBI. Guruhda so'rovnomani bosgan odamning javobi —
    // chat'i yo'q, faqat `poll_id` va `user` bor. Hisob TEKSHIRILMAYDI:
    // guruhdagi o'quvchi quizni yechish uchun avval ro'yxatdan
    // o'tishga majbur bo'lsa, quizning ma'nosi qolmaydi. Aynan
    // shu — botning guruhdagi asosiy jozibasi.
    if (yangilik?.poll_answer) {
      await koprukka(yangilik, null, { hisobTekshir: false })
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
      const guruhMatn = (xabar.text || xabar.caption || '').trim()
      const kichikMatn = guruhMatn.toLowerCase()

      // GURUHDA JDA KIMYO AI GA MUROJAAT (@jdakimyouzbot, bot nomi yoki Bot xabariga Reply)
      const botTegQilindi =
        kichikMatn.includes(`@${BOT_NOMI}`) ||
        kichikMatn.includes('jdakimyouzbot') ||
        kichikMatn.includes('@jdakimyo') ||
        Boolean(xabar.reply_to_message?.from?.is_bot) ||
        (xabar.entities || []).some((e) => e.type === 'mention' || e.type === 'text_mention')

      if (botTegQilindi) {
        await guruhAiXabariniBajar({
          chatId: String(chatId),
          xabar,
          botUsername: BOT_NOMI,
        }).catch((e) => console.error('[Guruh AI xatosi]', e.message))
        return NextResponse.json({ ok: true })
      }

      if (/^\/iqtibos(@\w+)?$/.test(guruhMatn)) {
        await guruhgaIqtibos(String(chatId))
        return NextResponse.json({ ok: true })
      }

      // GURUH SOZLAMALARI saytniki — iqtibos va yangilik bayroqlari
      // `TelegramGuruh` jadvalida. Shuning uchun bu buyruq ko'prikka
      // uzatilmaydi.
      if (/^\/(sozlama|settings|setings)(@\w+)?$/i.test(guruhMatn)) {
        await guruhSozlamasi(String(chatId))
        return NextResponse.json({ ok: true })
      }

      if (guruhMatn.startsWith('/')) {
        await koprukka(yangilik, chatId, { hisobTekshir: false })
      }
      return NextResponse.json({ ok: true })
    }

    if (xabar.chat?.type !== 'private') {
      return NextResponse.json({ ok: true })
    }

    const matn = (xabar.text || xabar.caption || '').trim()

    // 1. AI REJIMINI BOSHLASH TUGMASI YOKI /ai BUYRUG'I
    if (matn === TUGMALAR.ai || matn === '/ai') {
      await aiRejimniBoshla(String(chatId), xabar.from?.first_name)
      return NextResponse.json({ ok: true })
    }

    // 2. AI REJIMIDAN CHIQISH TUGMASI YOKI /chiqish BUYRUG'I
    if (matn === '🚪 AI rejimidan chiqish' || matn === '/chiqish') {
      await aiRejimniTugat(String(chatId))
      return NextResponse.json({ ok: true })
    }

    // 3. AGAR FOYDALANUVCHI AI REJIMIDA BO'LSA
    if (aiRejimdami(String(chatId))) {
      await shaxsiyAiXabariniBajar({
        chatId: String(chatId),
        xabar,
        username: xabar.from?.username,
        ism: xabar.from?.first_name,
      }).catch((e) => console.error('[Shaxsiy AI xatosi]', e.message))
      return NextResponse.json({ ok: true })
    }

    // MATNSIZ XABAR (va AI rejimida bo'lmagan holatda) — Python botga uzatiladi
    if (!xabar.text) {
      await koprukka(yangilik, chatId)
      return NextResponse.json({ ok: true })
    }

    // Sayt o'ziniki bo'lmagan HAMMA narsani Python botga uzatadi
    if (!saytniki(matn, Object.values(TUGMALAR))) {
      await koprukka(yangilik, chatId)
      return NextResponse.json({ ok: true })
    }

    await buyruqniBajar({
      chatId: String(chatId),
      matn,
      username: xabar.from?.username || null,
      ism: xabar.from?.first_name || null,
      yangilik,
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
async function koprukka(yangilik, chatId, { hisobTekshir = true } = {}) {
  const id = chatId ? String(chatId) : ''

  // Javob yozib bo'lmaydigan yangiliklar ham bor (`poll_answer` da
  // chat yo'q). Ular jimgina uzatiladi.
  const javobBer = (matn, qoshimcha) =>
    id ? telegramYubor(id, matn, qoshimcha) : undefined

  if (!kopruSozlanganmi()) {
    return javobBer(
      'Bunday buyruq yo\'q. Pastdagi tugmalardan foydalaning yoki /yordam yozing.',
      { klaviatura: true }
    )
  }

  // KIRISH TALABI — faqat SHAXSIY chatda. Quiz va PDF hisobga
  // bog'langan xizmatlar: tanga sarflaydi va tarix kabinetda ko'rinadi.
  // Guruh va quiz javoblarida esa bu tekshiruv o'rinsiz: guruhning
  // o'zi hech qachon "ulangan" bo'lmaydi, o'quvchini esa javob
  // berishdan oldin ro'yxatdan o'tishga majburlash quizning ma'nosini
  // yo'qotadi.
  //
  // Tekshiruv ATAYLAB shu yerda, Python botda emas — u holda har
  // handler o'zi tekshirishi kerak bo'lardi va yangi imkoniyat
  // qo'shilganda esdan chiqib, xizmat ochilib qolardi.
  if (hisobTekshir) {
    const ruxsat = await botRuxsati(id)
    if (!ruxsat.ok) return ruxsat.javob
  }

  const natija = await koprukkaUzat(yangilik)
  if (natija.ok) return

  if (natija.sabab === 'uxlayapti') {
    return javobBer(
      '⏳ Xizmat uyg\'onmoqda — bir daqiqadan keyin qayta yuboring.\n\n' +
        'Bu uzoq vaqt foydalanilmaganda bir marta sodir bo\'ladi.',
      { klaviatura: true }
    )
  }

  return javobBer(
    '⚠️ Quiz va PDF xizmati hozir ishlamayapti. Birozdan keyin urinib ko\'ring.',
    { klaviatura: true }
  )
}

/**
 * Bu Telegram quiz va PDF xizmatidan foydalana oladimi?
 *
 * Uch shart: hisob ulangan bo'lsin, bloklanmagan bo'lsin va emaili
 * tasdiqlangan bo'lsin. Oxirgisi saytdagi qoida bilan bir xil —
 * tasdiqlanmagan hisob tanga ham topa olmaydi, ya'ni botda tanga
 * sarflay olishi mantiqsiz bo'lardi.
 *
 * @returns {Promise<{ok: true} | {ok: false, javob: Promise<any>}>}
 */
async function botRuxsati(chatId) {
  const ulangan = await prisma.telegramUlanish.findUnique({
    where: { chatId },
    select: {
      user: { select: { isBanned: true, emailVerified: true } },
    },
  })

  if (!ulangan) {
    return {
      ok: false,
      javob: telegramYubor(
        chatId,
        '🔒 <b>Bu xizmat uchun hisob kerak</b>\n\n' +
          'Quiz yaratish va PDF xizmatidan jdakimyo.uz saytida ro\'yxatdan ' +
          'o\'tgan va shu botga ulangan hisob foydalana oladi.\n\n' +
          '<b>Ulash juda oson:</b>\n' +
          '/kod yozing — men sizga kod beraman, uni saytga kiritasiz.\n\n' +
          'Hisobingiz bo\'lmasa, avval saytda ro\'yxatdan o\'ting.',
        { havola: { matn: 'Ro\'yxatdan o\'tish', url: `${SAYT}/register` } }
      ),
    }
  }

  if (ulangan.user.isBanned) {
    return {
      ok: false,
      javob: telegramYubor(
        chatId,
        '🚫 Hisobingiz bloklangan. Xizmatlardan foydalana olmaysiz.\n\n' +
          'Sabab va murojaat uchun kabinetdagi bildirishnomalarni ko\'ring.',
        { havola: { matn: 'Kabinetni ochish', url: `${SAYT}/profil` } }
      ),
    }
  }

  if (!ulangan.user.emailVerified) {
    return {
      ok: false,
      javob: telegramYubor(
        chatId,
        '📧 <b>Emailingiz tasdiqlanmagan</b>\n\n' +
          'Tasdiqlanmagan hisob tanga topa olmaydi, shuning uchun pullik ' +
          'xizmatlar ham ochilmaydi.\n\n' +
          'Kabinetdagi sozlamalardan tasdiqlash xatini qayta yuboring.',
        { havola: { matn: 'Sozlamalarni ochish', url: `${SAYT}/profil/sozlama` } }
      ),
    }
  }

  return { ok: true }
}

/**
 * Sayt o'zi ishlaydigan inline tugmalar (`sayt:` bilan boshlanadi).
 *
 * Telegram tugma bosilganini TASDIQLASHNI kutadi — `answerCallbackQuery`
 * yuborilmasa foydalanuvchi ekranida soat aylanaverib, tugma buzuq
 * bo'lib ko'rinadi. Shuning uchun har yo'lda javob beriladi.
 */
async function saytTugmasi(cb) {
  const qiymat = String(cb.data || '')
  const chat = cb.message?.chat

  // ── Yangilikni guruhlarga tarqatish ──
  if (qiymat.startsWith('sayt:yangilik:')) {
    const xabarId = Number(qiymat.split(':')[2])
    if (!chat?.id || !Number.isFinite(xabarId)) {
      return tugmaJavobi(cb.id, 'Xato so\'rov', true)
    }

    await tugmaJavobi(cb.id, 'Yuborilmoqda...')
    const natija = await yangilikniTarqat({
      kanalId: String(chat.id),
      xabarId,
      bosganTgId: cb.from?.id,
    })
    // Tugma o'sha xabarda emas, TASDIQ xabarida turadi
    return yangilikNatijasi({
      kanalId: String(chat.id),
      xabarId: cb.message.message_id,
      natija,
    })
  }

  // ── Guruh sozlamalari ──
  if (qiymat === TUGMA.guruhIqtibos || qiymat === TUGMA.guruhYangilik) {
    const maydon = qiymat === TUGMA.guruhIqtibos ? 'iqtibos' : 'yangilik'
    const natija = await guruhSozlamaAlmashtir(String(chat?.id || ''), maydon)
    if (!natija.ok) return tugmaJavobi(cb.id, 'Guruh topilmadi', true)

    await tugmaJavobi(cb.id, natija.yoqildi ? 'Yoqildi' : 'O\'chirildi')
    // Xabar yangilanadi — holat darhol ko'rinsin
    return guruhSozlamasi(String(chat.id))
  }

  return tugmaJavobi(cb.id, '')
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
    return guruhOzgardi({
      chatId,
      chat,
      holat,
      // Eski holat kerak: usiz oddiy a'zodan adminga ko'tarilish ham
      // "yangi qo'shildi" deb qabul qilinardi
      eskiHolat: hodisa?.old_chat_member?.status,
      kim: hodisa?.from,
    })
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
async function guruhOzgardi({ chatId, chat, holat, eskiHolat, kim }) {
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

  if (!ichkarida) return

  // SALOM FAQAT HAQIQIY QO'SHILISHDA.
  //
  // `my_chat_member` bot rolining HAR o'zgarishida keladi — jumladan
  // oddiy a'zodan administratorga ko'tarilganda ham. Ilgari bu yerda
  // faqat yangi holat tekshirilardi va botni adminlikka ko'targan
  // odam salomni ikkinchi marta ko'rardi. Eski holat "chiqarilgan"
  // yoki "yo'q" bo'lsagina bu haqiqiy kirish.
  const yangiKirdi = !eskiHolat || eskiHolat === 'left' || eskiHolat === 'kicked'
  if (!yangiKirdi) return

  await telegramYubor(
    chatId,
    '👋 Salom! Men — <b>JDA KIMYO</b> boti.\n' +
      'jdakimyo.uz — o\'zbek tilidagi oliy kimyo platformasi.\n\n' +
      '<b>Shu guruhda nima qila olaman:</b>\n' +
      '🧩 <code>/quiz KOD</code> — test o\'tkazaman, oxirida reyting chiqaraman\n' +
      '📊 <code>/natija</code> — oxirgi testning reytingi\n' +
      '📜 Har kuni bitta kimyoviy iqtibos yuboraman\n' +
      '📰 Platforma yangiliklarini yetkazaman\n\n' +
      '⚙️ <code>/sozlama</code> — iqtibos va yangiliklarni yoqib-o\'chirish\n\n' +
      '<b>Test qanday yasaladi:</b>\n' +
      'Menga <b>shaxsiy</b> yozib test faylini yuborasiz, men undan quiz ' +
      'yasab kod beraman. Keyin shu yerda <code>/quiz KOD</code> deb ' +
      'ishga tushirasiz.\n\n' +
      'Suhbatga aralashmayman — faqat buyruqlarga javob beraman.',
    {
      havolalar: [
        { matn: '🤖 Menga shaxsiy yozish', url: `https://t.me/${BOT_NOMI}` },
        { matn: '🌐 jdakimyo.uz', url: SAYT },
      ],
    }
  ).catch(() => {})
}

async function buyruqniBajar({ chatId, matn, username, ism, yangilik }) {
  // `/start ABC123` — deep link orqali kelgan kod
  const start = matn.match(/^\/start(?:@\w+)?\s+(\S+)$/)
  if (start) {
    // `q_` — QUIZ havolasi, hisob ulash kodi emas. Bu farq muhim:
    // ulashilgan quiz havolasini bosgan odamning kodi hisob ulash
    // kodi deb o'qilsa, "kod noto'g'ri" xatosi chiqib, quiz esa
    // ochilmasdi.
    if (/^q_/i.test(start[1])) {
      await koprukka(yangilik, chatId)
      return
    }
    return bogla({ chatId, kod: start[1], username })
  }

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

/**
 * Salomlashuv — botning birinchi taassuroti.
 *
 * IKKI XABAR YUBORILADI. Telegram bitta xabarga bittagina
 * `reply_markup` qo'yishga ruxsat beradi: yo inline havolalar, yo
 * doimiy klaviatura. Yangi kelgan odamga ikkalasi ham kerak —
 * havolalar (sayt va kanal) va tugmalar. Shuning uchun avval
 * tanishtiruv havolalar bilan, keyin qisqa xabar klaviatura bilan
 * yuboriladi.
 *
 * Xabar nima uchun uzun: bu bot endi faqat bildirishnoma emas —
 * quiz, PDF va prezentatsiya xizmatlari bor va ularning barchasi
 * SAYT HISOBIGA bog'langan. Odam nima uchun ro'yxatdan o'tishi
 * kerakligini bilmasa, birinchi qadamdayoq to'xtaydi.
 */
async function salomlash({ chatId, ism }) {
  const ulangan = await prisma.telegramUlanish.findUnique({ where: { chatId } })
  const salom = `Assalomu alaykum${ism ? `, <b>${tgHimoyala(ism)}</b>` : ''}!`

  if (ulangan) {
    await telegramYubor(
      chatId,
      `${salom}\n\n` +
        'Hisobingiz allaqachon ulangan — hamma xizmat ochiq.\n\n' +
        '🧩 <b>Quiz yaratish</b> — test faylingizdan Telegram testlari\n' +
        '📑 <b>PDF yaratish</b> — rasmlardan bitta hujjat (bepul)\n' +
        '🎓 <b>Prezentatsiya</b> — AI yordamida kimyoviy slaydlar\n' +
        '🔔 <b>Xabarlar</b> — saytdagi bildirishnomalar\n\n' +
        'Pastdagi tugmalardan boshlang.',
      { klaviatura: true }
    )
    return
  }

  await telegramYubor(
    chatId,
    `${salom}\n\n` +
      'Bu — <b>jdakimyo.uz</b> platformasining rasmiy boti.\n' +
      'O\'zbek tilidagi oliy kimyo platformasi.\n\n' +
      '<b>Bot nima qila oladi:</b>\n' +
      '🧩 Test faylingizni (.txt, .docx, .xlsx) Telegram quizlariga aylantiradi\n' +
      '📑 Rasmlaringizni bitta PDF hujjatga yig\'adi — bepul\n' +
      '🎓 Kimyoviy mavzuda prezentatsiya tayyorlaydi (PPTX va PDF)\n' +
      '🔔 Saytdagi bildirishnomalarni shu yerga yetkazadi\n\n' +
      '<b>Foydalanish tartibi — uch qadam:</b>\n\n' +
      '<b>1.</b> jdakimyo.uz saytida hisob oching\n' +
      '<b>2.</b> Shu yerga <code>/kod</code> deb yozing — men sizga bir martalik ' +
      'kod beraman, uni saytdagi <b>Sozlamalar → Telegram</b> bo\'limiga kiritasiz\n' +
      '<b>3.</b> Tayyor — pastdagi tugmalar ishlay boshlaydi\n\n' +
      '<b>Nega hisob kerak?</b>\n' +
      'Quiz va prezentatsiya <b>tanga</b> bilan ishlaydi, tanga esa saytda ' +
      'topiladi: kunlik missiyalar, bepul sandiq va testlar orqali. ' +
      'PDF bepul, lekin u ham ulangan hisobni talab qiladi — xizmatlardan ' +
      'foydalanish tarixi kabinetingizda saqlanadi.\n\n' +
      'Yangiliklar va darslar rasmiy kanalimizda.',
    {
      havolalar: [
        { matn: '🌐 Saytda ro\'yxatdan o\'tish', url: `${SAYT}/register` },
        { matn: '📢 Rasmiy kanal', url: RASMIY_KANAL },
        { matn: '📱 Mobil ilova', url: ILOVA_KANALI },
      ],
    }
  )

  // Klaviatura ALOHIDA xabarda — yuqoridagi havolalar bilan bir
  // xabarda bo'la olmaydi. Qisqa qilingan: uzun matn ikki marta
  // takrorlansa, xabar oqimi bosib ketardi.
  return telegramYubor(
    chatId,
    'Boshlash uchun <code>/kod</code> deb yozing.',
    { klaviatura: true }
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

  // Tanga qanday topilishi SHU YERDA aytiladi. Quiz — botdagi yagona
  // pullik xizmat va odam narxni ko'rgan zahoti "buni qayerdan
  // olaman?" deb so'raydi. Javobni faqat saytdan qidirishga majburlash
  // xizmatdan voz kechishning eng qisqa yo'li.
  const topish = TANGA_TOPISH.map((y) => `• ${y}`).join('\n')

  return telegramYubor(
    chatId,
    `<b>${tgHimoyala(u.fullName || u.username)}</b>\n` +
      `👛 Tanga: ${u.coins ?? 0}\n` +
      `⭐ Ball: ${u.level_points ?? 0}\n\n` +
      `Xabarlar: ${ulangan.xabarlar ? 'yoqilgan' : 'o\'chirilgan'}\n\n` +
      `<b>Tanga qanday topiladi:</b>\n${topish}\n\n` +
      `Quiz yaratish ${TANGA_SAVOLGA} tanga/savol turadi.`,
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
    '<b>JDA KIMYO boti</b> — jdakimyo.uz ning rasmiy boti\n\n' +
      'Xizmatlar ulangan hisob orqali ishlaydi. Hisobingiz bo\'lmasa, ' +
      'jdakimyo.uz da ro\'yxatdan o\'ting va <code>/kod</code> yozing.\n\n' +
      '<b>Buyruqlar</b>\n' +
      '/kod — hisobni ulash uchun kod olish\n' +
      '/xabarlar — oxirgi bildirishnomalar\n' +
      '/holat — tanga, ball va sozlamalar\n' +
      '/ilova — mobil ilovani yuklab olish\n' +
      '/sozlama — xabar oqimini yoqish yoki o\'chirish\n' +
      '/uzish — hisobni uzish\n\n' +
      '<b>🧩 Quiz yaratish</b> (tanga bilan)\n' +
      'Test faylini yuboring (.txt, .docx, .xlsx). To\'g\'ri javob ' +
      '<code>+</code>, noto\'g\'rilari <code>-</code> bilan belgilanadi.\n' +
      '/newquiz — yangi quiz · /myquiz — saqlanganlari\n\n' +
      '<b>👥 Guruhda o\'tkazish</b>\n' +
      'Botni guruhga qo\'shing va u yerda <code>/quiz KOD</code> deb yozing. ' +
      'Kodni /myquiz dan olasiz. Savollar birma-bir chiqadi, oxirida ' +
      'reyting e\'lon qilinadi.\n' +
      'Guruhda: /quizstats — statistika, /natija — oxirgi reyting\n\n' +
      '<b>📑 PDF yaratish</b> (bepul)\n' +
      'Rasmlarni ketma-ket yuboring, keyin tugmani bosing.\n\n' +
      '<b>🎓 Prezentatsiya</b> (tanga bilan)\n' +
      'Mavzu yozing, slayd sonini tanlang — PPTX yoki PDF olasiz.\n\n' +
      `Yangiliklar va darslar: <a href="${RASMIY_KANAL}">rasmiy kanal</a>\n` +
      'Saytni yozuv maydoni yonidagi <b>Platforma</b> tugmasi orqali oching.',
    // Havola MATN ichida, tugmada emas: /yordam ning ikkinchi vazifasi —
    // yo'qolgan klaviaturani qaytarish, u esa inline tugma bilan bir
    // xabarda bo'la olmaydi.
    { klaviatura: true }
  )
}

function ulanmagan(chatId) {
  return telegramYubor(
    chatId,
    '🔒 <b>Hisobingiz ulanmagan</b>\n\n' +
      'Bot xizmatlari jdakimyo.uz hisobiga bog\'langan holda ishlaydi.\n\n' +
      '<b>1.</b> Saytda ro\'yxatdan o\'ting (agar hisobingiz bo\'lmasa)\n' +
      '<b>2.</b> Shu yerga <code>/kod</code> deb yozing\n' +
      '<b>3.</b> Kodni saytdagi <b>Sozlamalar → Telegram</b> ga kiriting',
    {
      havolalar: [
        { matn: '🌐 Ro\'yxatdan o\'tish', url: `${SAYT}/register` },
        { matn: '🔗 Telegramni ulash', url: `${SAYT}/profil/telegram` },
      ],
    }
  )
}
