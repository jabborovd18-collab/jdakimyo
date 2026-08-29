// lib/telegram.js
//
// Telegram bot bilan ishlashning yagona joyi.
//
// NEGA WEBHOOK, POLLING EMAS. Klassik botlar Telegramdan yangiliklarni
// uzluksiz so'rab turadi (long polling) — buning uchun doim ishlab
// turadigan jarayon kerak. Vercel funksiyalari esa so'rov kelganda
// uyg'onadi va javob bergach o'chadi, ya'ni polling u yerda UMUMAN
// ishlamaydi. Webhook'da esa Telegram o'zi bizga so'rov yuboradi —
// bu serverless bilan tabiiy mos keladi va alohida hosting kerak emas.
//
// NEGA PAKET YO'Q. `node-telegram-bot-api` va shunga o'xshashlar
// polling, fayl tizimi va uzoq yashaydigan holatga mo'ljallangan.
// Bizga kerak bo'lgani — ikkita HTTP so'rov. lib/pochta.js bilan bir xil
// yondashuv.

// Sukut bo'yicha haqiqiy Telegram. `TELEGRAM_API_BASE` faqat sinov
// uchun: soxta token bilan bot NIMA YOZISHINI ko'rib bo'lmaydi —
// Telegram 401 qaytaradi va matn hech qayerda ko'rinmaydi. Mahalliy
// mock server qo'yilsa, xabar matni o'qib ko'riladi.
const API = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org/bot'

/** Bot tokeni qo'yilganmi */
export function telegramSozlanganmi() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN)
}

/**
 * Telegram HTML rejimi uchun matnni zararsizlantiradi.
 *
 * Foydalanuvchi nomi va sayt matnlari xabarga tushadi. Himoyalanmasa
 * `<` belgisi bo'lgan har qanday matn Telegram tomonidan rad etiladi
 * (400 Bad Request) — ya'ni bu faqat xavfsizlik emas, ishlashi
 * masalasi ham.
 */
export function tgHimoyala(matn) {
  return String(matn ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Telegram API ga so'rov.
 *
 * MUDDAT QO'YILGAN. Bu funksiya foydalanuvchi kutayotgan so'rov
 * ichidan chaqiriladi (masalan admin tanga berganda). Telegram sekin
 * javob bersa, butun amal shunga bog'lanib qolardi.
 */
async function sora(usul, tana, muddatMs = 4000, qaytaUrindi = false) {
  if (!telegramSozlanganmi()) {
    return { ok: false, sabab: 'sozlanmagan' }
  }

  const uzgich = new AbortController()
  const soat = setTimeout(() => uzgich.abort(), muddatMs)

  try {
    const javob = await fetch(`${API}${process.env.TELEGRAM_BOT_TOKEN}/${usul}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tana),
      signal: uzgich.signal,
    })

    const natija = await javob.json().catch(() => null)

    if (!javob.ok || !natija?.ok) {
      // TEZLIK CHEGARASI. Telegram ko'p xabar yuborilganda 429 va
      // `retry_after` qaytaradi. Bu xato emas — "biroz kutib turing"
      // degani. Bir marta kutib qayta urinamiz; qayta-qayta urinsak
      // funksiya vaqt chegarasiga urilardi.
      const kutish = natija?.parameters?.retry_after
      if (natija?.error_code === 429 && kutish && kutish <= 5 && !qaytaUrindi) {
        clearTimeout(soat)
        await new Promise((r) => setTimeout(r, (kutish + 0.5) * 1000))
        return sora(usul, tana, muddatMs, true)
      }

      // Telegram xatolari ko'p va o'tkinchi (odam botni bloklagan,
      // chat o'chirilgan). Ularni konsolga yozamiz, lekin chaqiruvchi
      // amalni yiqitmaymiz.
      console.error('[Telegram]', usul, javob.status, natija?.description || '')
      return { ok: false, sabab: natija?.description || `holat ${javob.status}`, kod: natija?.error_code }
    }

    return { ok: true, natija: natija.result }
  } catch (e) {
    console.error('[Telegram]', usul, e.name === 'AbortError' ? 'vaqt tugadi' : e.message)
    return { ok: false, sabab: e.name === 'AbortError' ? 'vaqt tugadi' : e.message }
  } finally {
    clearTimeout(soat)
  }
}

/**
 * Ulanishni bazadan o'chirish kerakmi.
 *
 * NEGA KERAK. Odam botni bloklasa yoki chatni o'chirsa, Telegram har
 * safar xato qaytaradi. Yozuv bazada qolaversa, har e'londa o'sha
 * o'lik manzilga urinib, vaqt va tezlik kvotasi behuda sarflanadi.
 * Bu xatolar O'TKINCHI EMAS — qayta urinish yordam bermaydi, yozuvni
 * olib tashlash kerak.
 */
export function ulanishOlikmi(natija) {
  if (natija.ok) return false
  const s = String(natija.sabab || '').toLowerCase()
  return (
    natija.kod === 403 ||
    s.includes('bot was blocked') ||
    s.includes('user is deactivated') ||
    s.includes('chat not found')
  )
}

/**
 * Sarlavha oldiga qo'yiladigan belgi.
 *
 * NEGA KERAK. Bildirishnoma turining o'z ikonkasi bor (`TURLAR`),
 * lekin sarlavhaning O'ZI ham ko'pincha emoji bilan boshlanadi —
 * "🎁 falonchi sizga sovg'a yubordi". Ikkalasi qo'shilsa "🎁 🎁 ..."
 * bo'lib chiqadi. Saytdagi ro'yxatda ikonka alohida ustunda turadi,
 * shuning uchun u yerda bu ko'rinmaydi; Telegramda esa hammasi
 * bitta qatorda.
 *
 * @returns {string} bo'sh satr yoki "ikonka + probel"
 */
export function sarlavhaBelgisi(icon, sarlavha) {
  if (!icon) return ''
  // `Extended_Pictographic` — barcha emoji, jumladan birlashgan
  // shakllar (👨‍🏫). Oddiy diapazon tekshiruvi ularni o'tkazib yuborardi.
  if (/^\p{Extended_Pictographic}/u.test(String(sarlavha || '').trim())) return ''
  return `${icon} `
}

/**
 * Yozuv maydoni ostidagi doimiy tugmalar.
 *
 * NEGA KERAK. Buyruqni eslab qolish va qo'lda yozish — telefonda
 * ortiqcha ish. Doimiy tugmalar botni menyuga aylantiradi: odam
 * "/xabarlar" deb terib o'tirmaydi, tugmani bosadi.
 *
 * Matnlar webhook'dagi tugmalar bilan AYNAN bir xil bo'lishi kerak —
 * bot kelgan matnni shu bo'yicha taniydi.
 */
export const TUGMALAR = {
  ai: '🧪 JDA Kimyo AI (Beta)',
  xabarlar: '🔔 Xabarlar',
  holat: '👤 Holat',
  yordam: 'ℹ️ Yordam',
}

/**
 * AI Suhbat rejimidagi klaviatura (faqat chiqish tugmasi)
 */
export function aiKlaviatura() {
  return {
    keyboard: [
      [{ text: '🚪 AI rejimidan chiqish' }],
    ],
    resize_keyboard: true,
    is_persistent: true,
  }
}

/**
 * Python botdagi (quiz va PDF xizmati) tugmalar.
 *
 * Ular sayt tomonidan BAJARILMAYDI — klaviaturada ko'rinadi, lekin
 * bosilganda ko'prik orqali Python botga uzatiladi. Matnlar
 * `bot/keyboards/reply.py` dagilar bilan AYNAN bir xil bo'lishi shart:
 * aiogram tugmani matn bo'yicha taniydi, bitta emoji farq qilsa ham
 * tugma jimgina ishlamay qo'yadi.
 */
export const BOT_TUGMALARI = {
  quiz: '🧩 Quiz yaratish',
  pdf: '📑 PDF yaratish',
  taqdimot: '🎓 Prezentatsiya',
}

/**
 * Doimiy klaviatura tuzilishi.
 *
 * Ikkala botning tugmasi BITTA klaviaturada: Telegram bir chatda
 * bittagina doimiy klaviatura tutadi, ya'ni ikki servis o'z
 * klaviaturasini yuborsa ular navbat bilan bir-birini o'chirardi.
 */
export function doimiyKlaviatura() {
  return {
    keyboard: [
      [{ text: TUGMALAR.ai }],
      [{ text: BOT_TUGMALARI.quiz }, { text: BOT_TUGMALARI.pdf }],
      [{ text: BOT_TUGMALARI.taqdimot }],
      [
        { text: TUGMALAR.xabarlar },
        { text: TUGMALAR.holat },
        { text: TUGMALAR.yordam },
      ],
    ],
    // Telefonda klaviatura joyni yemasin
    resize_keyboard: true,
    is_persistent: true,
  }
}

/**
 * Xabar yuboradi.
 *
 * @param {string} chatId
 * @param {string} matn HTML rejimida (chaqiruvchi tgHimoyala qiladi)
 * @param {{havola?: {matn: string, url: string},
 *          havolalar?: {matn: string, url: string}[],
 *          klaviatura?: boolean, klaviaturaniOchir?: boolean}} [qoshimcha]
 */
export async function telegramYubor(chatId, matn, qoshimcha = {}) {
  const tana = {
    chat_id: chatId,
    text: matn,
    parse_mode: 'HTML',
    // Havolalar oldindan ko'rsatilmasin: xabar qisqa bo'lib qolsin
    link_preview_options: { is_disabled: true },
  }

  // Inline tugma va doimiy klaviatura BIR XABARDA bo'la olmaydi —
  // Telegram `reply_markup` ni bittagina qabul qiladi. Inline havola
  // ustunroq: u aynan shu xabarga tegishli.
  //
  // `havolalar` — bir nechta tugma kerak bo'lganda (masalan salomlashuv
  // xabarida sayt va kanal birga). Har biri alohida qatorda: telefon
  // ekranida yonma-yon turgan uzun yozuvli tugmalar kesilib ko'rinadi.
  if (Array.isArray(qoshimcha.havolalar) && qoshimcha.havolalar.length) {
    tana.reply_markup = {
      inline_keyboard: qoshimcha.havolalar
        .filter((h) => h?.url)
        .map((h) => [{ text: h.matn, url: h.url }]),
    }
  } else if (qoshimcha.havola?.url) {
    tana.reply_markup = {
      inline_keyboard: [[{ text: qoshimcha.havola.matn, url: qoshimcha.havola.url }]],
    }
  } else if (qoshimcha.klaviatura) {
    tana.reply_markup = doimiyKlaviatura()
  } else if (qoshimcha.klaviaturaniOchir) {
    tana.reply_markup = { remove_keyboard: true }
  }

  return sora('sendMessage', tana)
}

/** Telegram chegaralari — xabar rad etilmasin uchun oldindan bilamiz */
export const CHEGARA = {
  /** sendMessage matni */
  matn: 4096,
  /** sendPhoto izohi — matndan TO'RT BARAVAR qisqa */
  izoh: 1024,
}

/**
 * Rasmli xabar.
 *
 * NEGA URL BILAN, FAYL YUKLAMASDAN. Telegram rasmni manzil bo'yicha
 * o'zi yuklab oladi — bizga faylni ikkinchi marta uzatish shart emas.
 * Rasm allaqachon Vercel Blob'da yotadi va manzili ochiq.
 *
 * DIQQAT: izoh chegarasi 1024 belgi, oddiy xabarda esa 4096. Uzun
 * matnni rasm bilan yuborib bo'lmaydi — chaqiruvchi buni oldindan
 * tekshirishi kerak.
 */
export async function telegramRasmYubor(chatId, rasmUrl, izoh, qoshimcha = {}) {
  const tana = {
    chat_id: chatId,
    photo: rasmUrl,
    caption: izoh || undefined,
    parse_mode: 'HTML',
  }

  if (qoshimcha.havola?.url) {
    tana.reply_markup = {
      inline_keyboard: [[{ text: qoshimcha.havola.matn, url: qoshimcha.havola.url }]],
    }
  }

    // Rasmni Telegram tashqi manzildan yuklab oladi — bu oddiy
    // xabardan sekinroq, shuning uchun muddat uzunroq
    return sora('sendPhoto', tana, 15000)
  }

  /**
   * PDF yoki boshqa hujjatni Telegramga to'g'ridan-to'g'ri fayl qilib yuboradi.
   */
  export async function telegramHujjatYubor(chatId, buffer, faylNomi = 'JDA-Kimyo-Yechim.pdf', izoh = '') {
    if (!telegramSozlanganmi()) return { ok: false, sabab: 'sozlanmagan' }

    try {
      const formData = new FormData()
      formData.append('chat_id', String(chatId))
      if (izoh) {
        formData.append('caption', izoh)
        formData.append('parse_mode', 'HTML')
      }
      const blob = new Blob([buffer], { type: 'application/pdf' })
      formData.append('document', blob, faylNomi)

      const javob = await fetch(`${API}${process.env.TELEGRAM_BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        body: formData,
      })

      const natija = await javob.json().catch(() => null)
      if (!javob.ok || !natija?.ok) {
        console.error('[Telegram sendDocument]', javob.status, natija?.description || '')
        return { ok: false, sabab: natija?.description || `holat ${javob.status}` }
      }
      return { ok: true, natija: natija.result }
    } catch (e) {
      console.error('[Telegram sendDocument]', e.message)
      return { ok: false, sabab: e.message }
    }
  }

  /**
   * Telegram faylini (rasmni) yuklab oladi va Base64 formatga o'giradi.
   */
  export async function telegramRasmBase64Yukla(fileId) {
    if (!telegramSozlanganmi()) return null

    try {
      const infoRes = await fetch(`${API}${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`)
      const info = await infoRes.json().catch(() => null)
      if (!info?.ok || !info.result?.file_path) return null

      const faylRes = await fetch(`https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${info.result.file_path}`)
      if (!faylRes.ok) return null

      const arrBuf = await faylRes.arrayBuffer()
      const b64 = Buffer.from(arrBuf).toString('base64')
      const mime = info.result.file_path.endsWith('.png') ? 'image/png' : 'image/jpeg'
      return `data:${mime};base64,${b64}`
    } catch (e) {
      console.error('[Telegram rasm yuklash]', e.message)
      return null
    }
  }

/**
 * Yozuv maydoni yonidagi MENYU TUGMASI — botni saytga kirish
 * nuqtasiga aylantiradi.
 *
 * Sukut bo'yicha u yerda "/" (buyruqlar ro'yxati) turadi. `web_app`
 * turi qo'yilsa, o'rniga nomlangan tugma chiqadi va bosilganda sayt
 * Telegram ichida ochiladi — brauzerga chiqmaydi, ya'ni odam
 * suhbatdan uzilmaydi.
 *
 * Bir marta o'rnatiladi va Telegram uni saqlaydi.
 */
export async function menyuTugmasiQoy(matn, url) {
  return sora(
    'setChatMenuButton',
    { menu_button: { type: 'web_app', text: matn, web_app: { url } } },
    10000
  )
}

/**
 * Buyruqlar ro'yxati — "/" bosilganda chiqadigan menyu.
 * Tavsifsiz buyruqni odam topa olmaydi.
 */
export async function buyruqlarniQoy(buyruqlar) {
  return sora('setMyCommands', { commands: buyruqlar }, 10000)
}

/** Botning tavsifi — "Start" bosilishidan oldin ko'rinadi */
export async function tavsifQoy({ tavsif, qisqa }) {
  const natijalar = []
  if (tavsif) natijalar.push(await sora('setMyDescription', { description: tavsif }, 10000))
  if (qisqa) natijalar.push(await sora('setMyShortDescription', { short_description: qisqa }, 10000))
  return natijalar
}

/**
 * Webhook manzilini ro'yxatdan o'tkazadi.
 * `scripts/telegram-webhook.js` chaqiradi, ish vaqtida emas.
 */
export async function webhookQoy(url, sirKalit) {
  return sora(
    'setWebhook',
    {
      url,
      secret_token: sirKalit,
      // Keraksiz turlarni so'ramaslik ortiqcha so'rovlarni to'sadi.
      //
      // `my_chat_member` — odam botni bloklagani yoki qayta ochgani.
      // Usiz bloklangan foydalanuvchi bazada tirik bo'lib qolaverardi
      // va har e'londa unga urinib ko'rilardi.
      //
      // `callback_query` — quiz va PDF oqimidagi inline tugmalar
      // (vaqt tanlash, bo'lak hajmi, tasdiqlash). So'ralmasa Telegram
      // ularni UMUMAN yubormaydi va tugmalar hech qanday xatosiz,
      // jimgina ishlamay qo'yadi — sababini topish juda qiyin.
      //
      // `poll_answer` — guruhda quiz yechayotgan odamning javobi.
      // So'ralmasa Telegram uni UMUMAN yubormaydi va reyting doim
      // bo'sh chiqardi.
      //
      // `channel_post` — JDA KIMYO NEWS kanalidagi yangi xabar.
      // Usiz bot kanalga yozilgan postni ko'rmaydi va yangilik
      // tizimi umuman ishga tushmaydi.
      allowed_updates: [
        'message',
        'callback_query',
        'my_chat_member',
        'poll_answer',
        'channel_post',
      ],
      // Eski to'planib qolgan yangiliklar tashlab yuborilsin
      drop_pending_updates: true,
    },
    10000
  )
}

/**
 * Xabarni boshqa chatga NUSXALAYDI.
 *
 * NEGA `forwardMessage` EMAS. Uzatilgan xabar ustida "Forwarded from
 * JDA KIMYO NEWS" yozuvi turadi va u yopiq kanalning borligini
 * oshkor qiladi hamda begona ko'rinadi. `copyMessage` esa xabarni
 * botning O'Z nomidan yuboradi — manbaga havola qolmaydi. Rasm,
 * izoh va formatlash saqlanadi.
 */
export async function nusxaYubor(chatId, manbaChatId, xabarId) {
  return sora(
    'copyMessage',
    { chat_id: chatId, from_chat_id: manbaChatId, message_id: xabarId },
    15000
  )
}

/**
 * Tugmali xabar — bosilganda `callback_data` qaytaradi.
 *
 * `telegramYubor` dagi `havola` faqat URL tugmasini qo'yadi; bu yerda
 * esa botga qaytadigan tugma kerak (masalan "Guruhlarga yuborish").
 */
export async function tugmalarBilanYubor(chatId, matn, qatorlar) {
  return sora('sendMessage', {
    chat_id: chatId,
    text: matn,
    parse_mode: 'HTML',
    link_preview_options: { is_disabled: true },
    reply_markup: {
      inline_keyboard: qatorlar.map((qator) =>
        qator.map((t) => ({ text: t.matn, callback_data: t.qiymat }))
      ),
    },
  })
}

/** Bosilgan tugmaga javob — usiz Telegramda "soat" aylanaveradi */
export async function tugmaJavobi(callbackId, matn, ogohlantirish = false) {
  return sora('answerCallbackQuery', {
    callback_query_id: callbackId,
    text: matn ? String(matn).slice(0, 200) : undefined,
    show_alert: Boolean(ogohlantirish),
  })
}

/** Xabar matnini almashtiradi — tugma bosilgach holatni ko'rsatish uchun */
export async function xabarniTahrirla(chatId, xabarId, matn, qatorlar) {
  return sora('editMessageText', {
    chat_id: chatId,
    message_id: xabarId,
    text: matn,
    parse_mode: 'HTML',
    link_preview_options: { is_disabled: true },
    reply_markup: qatorlar
      ? {
          inline_keyboard: qatorlar.map((qator) =>
            qator.map((t) => ({ text: t.matn, callback_data: t.qiymat }))
          ),
        }
      : undefined,
  })
}

/**
 * Guruhdagi a'zolar soni.
 *
 * NEGA KERAK. Guruhlar ro'yxatida faqat nom turgan bo'lsa, qaysi biri
 * 12 kishilik sinf, qaysi biri 3000 kishilik kanal ekani bilinmaydi.
 * Bot uchun bu asosiy o'lchov: har bir xabar necha kishiga yetayotgani.
 *
 * Xato bo'lsa `null` qaytaradi — bot guruhdan chiqarilgan bo'lishi
 * mumkin va bu butun ro'yxatni buzmasligi kerak.
 */
export async function guruhAzolari(chatId) {
  const javob = await sora('getChatMemberCount', { chat_id: chatId }, 5000)
  return javob.ok && typeof javob.natija === 'number' ? javob.natija : null
}

/** Webhook holati — sozlashni tekshirish uchun */
export async function webhookHolati() {
  return sora('getWebhookInfo', {}, 10000)
}
