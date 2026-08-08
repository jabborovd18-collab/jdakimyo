// Telegram yangiliklarini Python botga (quiz va PDF xizmati) uzatish.
//
// NEGA IKKI SERVIS. Bitta bot tokenini ikkita jarayon bir vaqtda tinglay
// olmaydi — Telegram webhook'ni ham, polling'ni ham bittagina egaga
// beradi. Shu sababli webhook shu saytda qoladi (bildirishnomalar,
// e'lonlar va guruh iqtiboslari shu yerda), og'ir buyruqlar esa doim
// ishlab turadigan Python servisiga uzatiladi. Xabar YUBORISH
// cheklanmagan, shuning uchun Python bot foydalanuvchiga o'sha token
// bilan o'zi javob yozaveradi.
//
// NEGA VERCEL O'ZI QILA OLMAYDI. Quiz oqimi holat saqlaydi (fayl → vaqt
// → tasdiq) va 200 ta so'rovnoma yuborish funksiya umridan uzoq davom
// etadi. Serverless chaqiruvlar orasida bu holat yo'qoladi.

/**
 * Kutish muddati.
 *
 * Render'ning bepul xizmati 15 daqiqa jimlikdan keyin uxlaydi va
 * uyg'onishi ~50 soniya oladi. Vercel funksiyasi esa bir daqiqada
 * uziladi, ya'ni to'liq uyg'onishni kutib bo'lmaydi. Kutmaymiz ham:
 * muddat tugasa foydalanuvchiga ochiq aytamiz.
 *
 * Uyqu deyarli bo'lmasligi uchun servisga tashqi ping qo'yiladi
 * (UptimeRobot — har 10 daqiqada /health).
 */
const KUTISH_MS = 20000

export function kopruSozlanganmi() {
  return Boolean(process.env.BOT_ISHCHI_URL && process.env.BOT_KOPRUK_SIR)
}

/**
 * Yangilikni Python botga uzatadi.
 *
 * Hech qachon xato tashlamaydi — chaqiruvchi webhook har doim 200
 * qaytarishi kerak, aks holda Telegram o'sha yangilikni qayta-qayta
 * yuborib navbatni to'sib qo'yadi.
 *
 * @returns {Promise<{ok: boolean, sabab?: 'sozlanmagan'|'uxlayapti'|'xato'}>}
 */
export async function koprukkaUzat(yangilik) {
  if (!kopruSozlanganmi()) return { ok: false, sabab: 'sozlanmagan' }

  const manzil = process.env.BOT_ISHCHI_URL.replace(/\/$/, '')
  const toxtatgich = new AbortController()
  const soat = setTimeout(() => toxtatgich.abort(), KUTISH_MS)

  try {
    const javob = await fetch(`${manzil}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bridge-Secret': process.env.BOT_KOPRUK_SIR,
      },
      body: JSON.stringify(yangilik),
      signal: toxtatgich.signal,
    })

    if (!javob.ok) {
      console.error('[Ko\'prik] javob:', javob.status)
      return { ok: false, sabab: 'xato' }
    }
    return { ok: true }
  } catch (e) {
    // AbortError — servis uxlab qolgan va uyg'onishga ulgurmadi.
    // Boshqa xatolar tarmoq yoki servis o'chgani.
    const uxlayapti = e.name === 'AbortError'
    console.error('[Ko\'prik]', uxlayapti ? 'muddat tugadi' : e.message)
    return { ok: false, sabab: uxlayapti ? 'uxlayapti' : 'xato' }
  } finally {
    clearTimeout(soat)
  }
}

/**
 * Ko'prik holatini tekshiradi — `/admin/telegram` uchun.
 *
 * NEGA KERAK. Foydalanuvchiga ko'rinadigan xabar ataylab umumiy
 * ("xizmat ishlamayapti"), lekin sabab bir nechta bo'lishi mumkin va
 * ularni tashqaridan ajratib bo'lmaydi: kalit mos emasmi, manzil
 * xatomi, yoki Python botda ko'prik rejimi o'chirilganmi. Bu loyihada
 * xuddi shu xil "ikki joydagi sir kalit" muammosi bir marta bo'lgan va
 * uni topish bir kun olgan edi.
 *
 * Sinov TANASI ataylab yaroqsiz: Python bot uni Update deb o'qiy
 * olmaydi va dispetcherga UMUMAN bermaydi — ya'ni tekshiruv hech
 * kimga xabar yubormaydi va hech qanday oqimni buzmaydi.
 */
export async function kopruTekshir() {
  if (!process.env.BOT_ISHCHI_URL) return { holat: 'manzil-yoq' }
  if (!process.env.BOT_KOPRUK_SIR) return { holat: 'kalit-yoq' }

  const manzil = process.env.BOT_ISHCHI_URL.replace(/\/$/, '')
  const toxtatgich = new AbortController()
  const soat = setTimeout(() => toxtatgich.abort(), KUTISH_MS)

  try {
    // 1) AVVAL /health. Render noma'lum havola uchun ham 404 qaytaradi,
    // ya'ni `/update` dagi 404 ikki ma'noli: "ko'prik o'chirilgan" ham,
    // "manzil butunlay boshqa" ham bo'lishi mumkin. `/health` faqat
    // bizning servisimizda "ok" deydi va ikkalasini ajratadi.
    const salomat = await fetch(`${manzil}/health`, { signal: toxtatgich.signal })
    const tanasi = salomat.ok ? (await salomat.text()).trim() : ''
    if (tanasi !== 'ok') {
      return { holat: 'notogri-manzil', manzil, kod: salomat.status }
    }

    // 2) Endi kalitni tekshiramiz
    const javob = await fetch(`${manzil}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bridge-Secret': process.env.BOT_KOPRUK_SIR,
      },
      body: JSON.stringify({ kopruk_tekshiruvi: true }),
      signal: toxtatgich.signal,
    })

    if (javob.status === 200) return { holat: 'ishlayapti', manzil }
    if (javob.status === 401) return { holat: 'kalit-mos-emas', manzil }
    if (javob.status === 404) {
      // Servis bizniki, lekin yo'l ro'yxatdan o'tmagan =
      // Python botda BRIDGE_SECRET qo'yilmagan
      return { holat: 'kopruk-ochirilgan', manzil }
    }
    return { holat: 'kutilmagan-javob', manzil, kod: javob.status }
  } catch (e) {
    return {
      holat: e.name === 'AbortError' ? 'javob-bermadi' : 'ulanib-bolmadi',
      manzil,
      sabab: e.name === 'AbortError' ? 'muddat tugadi' : e.message,
    }
  } finally {
    clearTimeout(soat)
  }
}

/** Tashxis natijasini odam o'qiydigan matnga aylantiradi */
export function kopruIzohi(natija) {
  switch (natija.holat) {
    case 'ishlayapti':
      return 'Ko\'prik ishlayapti — kalitlar mos.'
    case 'manzil-yoq':
      return 'Saytda BOT_ISHCHI_URL qo\'yilmagan.'
    case 'kalit-yoq':
      return 'Saytda BOT_KOPRUK_SIR qo\'yilmagan.'
    case 'notogri-manzil':
      return `Bu manzilda bizning servisimiz yo'q — BOT_ISHCHI_URL ni tekshiring. (${natija.kod})`
    case 'kalit-mos-emas':
      return 'Kalitlar mos emas: Render\'dagi BRIDGE_SECRET va saytdagi BOT_KOPRUK_SIR bir xil bo\'lishi kerak.'
    case 'kopruk-ochirilgan':
      return 'Manzil to\'g\'ri, lekin Python botda ko\'prik rejimi yoqilmagan — Render\'da BRIDGE_SECRET yo\'q yoki servis eski kod bilan ishlayapti.'
    case 'javob-bermadi':
      return 'Servis javob bermadi (uxlab qolgan bo\'lishi mumkin). Qayta urinib ko\'ring.'
    case 'ulanib-bolmadi':
      return `Manzilga ulanib bo'lmadi — BOT_ISHCHI_URL ni tekshiring. (${natija.sabab})`
    default:
      return `Kutilmagan javob: ${natija.kod}`
  }
}

/**
 * Saytning O'ZI bajaradigan buyruqlar va tugmalar.
 *
 * Ro'yxat ataylab shu tomonda: sayt nimani bilishini aniq sanab
 * bo'ladi, qolgan HAMMASI Python botga ketadi. Teskarisi qilinsa
 * (Python buyruqlarini sanash) botga har yangi imkoniyat qo'shilganda
 * shu ro'yxatni ham yangilash esdan chiqib, buyruq jimgina
 * "Bunday buyruq yo'q" javobiga tushib qolardi.
 */
const SAYT_BUYRUQLARI = new Set([
  '/start',
  '/kod',
  '/xabarlar',
  '/holat',
  '/sozlama',
  '/uzish',
  '/yordam',
  '/help',
  '/ilova',
])

/**
 * Shu matnni sayt o'zi bajaradimi?
 *
 * @param {string} matn Xabar matni (trim qilingan)
 * @param {string[]} tugmalar Doimiy klaviaturadagi sayt tugmalari
 */
export function saytniki(matn, tugmalar) {
  if (tugmalar.includes(matn)) return true
  const buyruq = matn.split(/\s+/)[0].toLowerCase().replace(/@\w+$/, '')
  return SAYT_BUYRUQLARI.has(buyruq)
}
