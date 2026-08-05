// lib/iqtibos.js
//
// Kunlik iqtibos — Telegram guruhlariga yuboriladigan matn.
//
// NEGA SAYTDAGIDAN ALOHIDA. `/api/quotes` iqtibosni HAR SO'ROVDA
// tasodifiy tanlaydi: sahifani ikki marta ochsangiz ikki xil gap
// chiqadi. Sayt uchun bu muhim emas, guruh uchun esa yaramaydi —
// cron ishlamay qolib qayta chaqirilsa yoki admin "hozir yubor"
// tugmasini bossa, o'sha kuni ikkinchi, boshqa gap ketardi.
//
// Shuning uchun tanlov SANADAN hisoblanadi: kun bir xil bo'lsa,
// natija ham bir xil. Xuddi kunlik missiyalardagi kabi.
import { prisma } from './prisma'

/**
 * Bazada iqtibos bo'lmaganda ishlatiladigan gaplar.
 *
 * `/api/quotes` dagi ro'yxatning nusxasi emas, balki O'SHA fikr:
 * jadval bo'sh bo'lsa ham guruh har kuni yangi gap olsin. Admin
 * panelidan gap qo'shilgach bu ro'yxatga murojaat qilinmaydi.
 */
const ZAXIRA = [
  { textUz: 'Kimyo — bu hayotning tili.', author: 'JDA KIMYO', icon: '🧪' },
  {
    textUz: "Hech narsa yo'qolmaydi, hech narsa yaratilmaydi — hammasi o'zgaradi.",
    author: 'Antuan Lavuazye', icon: '⚗️',
  },
  {
    textUz: "Tajribasiz nazariya — quruq gap, nazariyasiz tajriba — ko'r harakat.",
    author: 'JDA KIMYO', icon: '🔬',
  },
  {
    textUz: "Elementlarning xossalari ularning atom massalariga davriy bog'liqdir.",
    author: 'Dmitriy Mendeleyev', icon: '📊',
  },
  {
    textUz: "Kuzatishda tasodif faqat tayyorlangan aqlga yor bo'ladi.",
    author: 'Lui Paster', icon: '💡',
  },
  { textUz: 'Bir tajriba ming taxminga arziydi.', author: 'JDA KIMYO', icon: '🧫' },
  {
    textUz: "Har bir murakkab birikma oddiy bog'lanishdan boshlanadi.",
    author: 'JDA KIMYO', icon: '🔗',
  },
]

/**
 * Kun raqami — TOSHKENT vaqtida (UTC+5).
 *
 * UTC bo'lsa, iqtibos Toshkentda ertalab soat beshda almashardi:
 * kechqurun o'qigan odam va tunda o'qigan odam boshqa gap ko'rardi,
 * garchi ular uchun bu bitta kun bo'lsa ham.
 */
export function iqtibosKuni(sana = new Date()) {
  return Math.floor((sana.getTime() + 5 * 60 * 60 * 1000) / 86400000)
}

/**
 * Bugungi iqtibos. Bir kun ichida hamma uchun BIR XIL.
 *
 * Tartib: aniq sanaga belgilangan gap → faol gaplar orasidan sana
 * bo'yicha tanlangani → zaxira ro'yxati.
 *
 * @returns {Promise<{textUz: string, author: string, icon: string,
 *   id?: string, manba: 'sana'|'aylanma'|'zaxira'}>}
 */
export async function bugungiIqtibos(sana = new Date()) {
  const kunBoshi = new Date(sana)
  kunBoshi.setHours(0, 0, 0, 0)

  // 1. Shu sanaga ATAYLAB belgilangan gap ustun turadi — bayram yoki
  // muhim kun uchun admin shunday qo'yadi
  const sanali = await prisma.dailyQuote.findFirst({
    where: { isActive: true, displayDate: kunBoshi },
  })
  if (sanali) return { ...sanali, manba: 'sana' }

  // 2. Faol gaplar orasidan sana bo'yicha
  const gaplar = await prisma.dailyQuote.findMany({
    where: { isActive: true, OR: [{ displayDate: null }, { displayDate: { lt: kunBoshi } }] },
    // Tartib BARQAROR bo'lishi shart: `timesShown` bo'yicha saralasak,
    // sanoq o'zgarishi bilan bugungi gap ham o'zgarib ketardi
    orderBy: { createdAt: 'asc' },
  })

  if (gaplar.length > 0) {
    return { ...gaplar[iqtibosKuni(sana) % gaplar.length], manba: 'aylanma' }
  }

  return { ...ZAXIRA[iqtibosKuni(sana) % ZAXIRA.length], manba: 'zaxira' }
}

/** Telegram uchun tayyor matn (HTML rejimi) */
export function iqtibosMatni(iqtibos, himoyala) {
  const q = himoyala
  return (
    `${iqtibos.icon || '💡'} <b>Kunlik iqtibos</b>\n\n` +
    `<i>${q(iqtibos.textUz)}</i>\n\n` +
    `— ${q(iqtibos.author)}`
  )
}
