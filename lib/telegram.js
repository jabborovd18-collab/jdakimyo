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
  xabarlar: '🔔 Xabarlar',
  holat: '👤 Holat',
  yordam: 'ℹ️ Yordam',
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
      [{ text: BOT_TUGMALARI.quiz }, { text: BOT_TUGMALARI.pdf }],
      [{ text: BOT_TUGMALARI.taqdimot }],
      [{ text: TUGMALAR.xabarlar }, { text: TUGMALAR.holat }],
      [{ text: TUGMALAR.yordam }],
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
      allowed_updates: ['message', 'callback_query', 'my_chat_member'],
      // Eski to'planib qolgan yangiliklar tashlab yuborilsin
      drop_pending_updates: true,
    },
    10000
  )
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
