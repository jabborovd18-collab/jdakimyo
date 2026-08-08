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
