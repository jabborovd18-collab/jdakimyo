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

const API = 'https://api.telegram.org/bot'

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
async function sora(usul, tana, muddatMs = 4000) {
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
 * Xabar yuboradi.
 *
 * @param {string} chatId
 * @param {string} matn HTML rejimida (chaqiruvchi tgHimoyala qiladi)
 * @param {{havola?: {matn: string, url: string}}} [qoshimcha]
 */
export async function telegramYubor(chatId, matn, qoshimcha = {}) {
  const tana = {
    chat_id: chatId,
    text: matn,
    parse_mode: 'HTML',
    // Havolalar oldindan ko'rsatilmasin: xabar qisqa bo'lib qolsin
    link_preview_options: { is_disabled: true },
  }

  if (qoshimcha.havola?.url) {
    tana.reply_markup = {
      inline_keyboard: [[{ text: qoshimcha.havola.matn, url: qoshimcha.havola.url }]],
    }
  }

  return sora('sendMessage', tana)
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
      // Bizga faqat xabarlar kerak. Qolgan turlarni so'ramaslik —
      // keraksiz so'rovlarni butunlay to'sadi.
      allowed_updates: ['message'],
      // Eski to'planib qolgan yangiliklar tashlab yuborilsin
      drop_pending_updates: true,
    },
    10000
  )
}

/** Webhook holati — sozlashni tekshirish uchun */
export async function webhookHolati() {
  return sora('getWebhookInfo', {}, 10000)
}
