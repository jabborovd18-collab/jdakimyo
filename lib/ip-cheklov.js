// lib/ip-cheklov.js
//
// IP bo'yicha tezlik cheklovi — hisob ochish, kirish va tasdiqlash
// xatini qayta yuborish uchun.
//
// NEGA KERAK EDI. Hisob bo'yicha to'siq bor edi (`lib/credentials.js`),
// lekin IP bo'yicha yo'q. Ya'ni bitta kompyuterdan:
//   - istalgancha yangi hisob ochish mumkin edi va HAR BIRI xat
//     yuborardi — Resend kvotasini yoqib yuborishning eng oson yo'li;
//   - ko'p hisobni ketma-ket sinash mumkin edi: har biriga besh
//     urinish, to'silgach keyingisiga o'tish.
//
// NEGA UPSTASH/REDIS EMAS. Yangi tashqi xizmat, yangi kalit, yangi
// to'lov va nosozlikning yangi manbai. Bu yerdagi yuk kichik (kuniga
// bir necha yuz so'rov), Postgres uni sezmaydi ham.
//
// CHEKLOV ANIQ EMAS va shunday bo'lishi kerak. Bir vaqtda kelgan ikki
// so'rov ikkalasi ham o'tib ketishi mumkin (o'qish va yozish orasida
// tranzaksiya yo'q). Bu muhim emas: maqsad yuzlab so'rovni to'sish,
// bittasini ham qo'ymaslik emas. Tranzaksiya qo'ysak, har login uchun
// qulf olardik.
import { prisma } from './prisma'

/**
 * CHEGARALAR MAKTABNI HISOBGA OLADI.
 *
 * Bitta maktab yoki universitetning butun sinfi tashqaridan BITTA IP
 * bo'lib ko'rinadi (NAT). Chegara tor bo'lsa, 30 kishilik guruh birga
 * ro'yxatdan o'tganda oxirgilari to'silib qolardi — ya'ni himoya
 * haqiqiy foydalanuvchini yo'qotardi. Shuning uchun raqamlar keng
 * olingan: maqsad — bitta skript yuzlab hisob ochishini to'sish,
 * sinfni emas.
 *
 * `oyna` — soniyada. Oyna to'lgach sanoq o'zi noldan boshlanadi.
 */
const QOIDALAR = {
  // Hisob yaratish. Ikki oyna: qisqasi to'p-to'p urinishni, uzuni
  // kun davomida sekin yig'ishni to'sadi.
  royxat: [
    { nom: 'soat', oyna: 60 * 60, chegara: 25 },
    { nom: 'kun', oyna: 24 * 60 * 60, chegara: 60 },
  ],
  // FAQAT MUVAFFAQIYATSIZ urinishlar sanaladi. Muvaffaqiyatli kirish
  // sanoqqa tegmaydi — aks holda ertalab birga kirgan sinf o'zi
  // o'zini to'sib qo'yardi.
  kirish: [
    { nom: 'chorak', oyna: 15 * 60, chegara: 40 },
  ],
  // Tasdiqlash kodini qayta yuborish. Har biri haqiqiy xat, ya'ni
  // to'g'ridan-to'g'ri Resend kvotasi.
  kod: [
    { nom: 'soat', oyna: 60 * 60, chegara: 15 },
  ],
}

/**
 * So'rov kelgan IP.
 *
 * SARLAVHALAR TARTIBI MUHIM. `x-forwarded-for` ni MIJOZNING O'ZI ham
 * yubora oladi — u shunchaki oddiy HTTP sarlavhasi. Agar birinchi
 * bo'lib shuni o'qisak, skript har so'rovda boshqa soxta IP yozib,
 * butun cheklovni bir qatorda aylanib o'tardi. Shuning uchun avval
 * Vercel o'zi qo'yadigan va mijoz almashtira olmaydigan sarlavhalarga
 * qaraymiz, `x-forwarded-for` esa eng oxirgi chora.
 *
 * (Loyihaning boshqa joylarida — qaydnoma, maqola statistikasi —
 * to'g'ridan-to'g'ri `x-forwarded-for` o'qiladi. U yerda IP faqat
 * ma'lumot uchun, bu yerda esa himoya asosi.)
 *
 * Manba har xil bo'lishi mumkin: App Router'da `Request`, NextAuth
 * `authorize(credentials, req)` da esa `headers` oddiy obyekt.
 *
 * @returns {string|null} topilmasa null
 */
export function soravchiIp(manba) {
  const h = manba?.headers || manba
  if (!h) return null

  // Headers obyekti (get bor) yoki oddiy obyekt
  const olish = typeof h.get === 'function'
    ? (nom) => h.get(nom)
    : (nom) => h[nom] || h[nom.toLowerCase()]

  for (const nom of ['x-vercel-forwarded-for', 'x-real-ip', 'x-forwarded-for']) {
    const qiymat = olish(nom)
    if (!qiymat) continue
    // Zanjir bo'lsa birinchisi — eng chetdagi mijoz
    const birinchi = String(qiymat).split(',')[0].trim()
    if (birinchi) return birinchi
  }

  return null
}

/**
 * Chegaradan oshganmi — SANOQQA TEGMAYDI.
 *
 * Tekshirish va qayd qilish ataylab ajratilgan: login'da faqat xato
 * urinish sanaladi, ro'yxatdan o'tishda esa faqat haqiqatan hisob
 * yaratilgani. Bitta funksiya bo'lsa, forma xatosi ham kvotani
 * yeb qo'yardi.
 *
 * @param {'royxat'|'kirish'|'kod'} amal
 * @param {string|null} ip
 * @returns {Promise<{ok: true} | {ok: false, kutish: number}>} kutish — soniyada
 */
export async function chekloqniTekshir(amal, ip) {
  const qoidalar = QOIDALAR[amal]

  // IP topilmasa cheklamaymiz. Vercel'da bu sarlavha doim bor;
  // yo'qolsa hammani bitta "nomalum" chelakka solish butun saytni
  // to'sib qo'yardi — ochiq qolgani xavfsizroq.
  if (!ip || !qoidalar) return { ok: true }

  const endi = Date.now()

  for (const qoida of qoidalar) {
    const yozuv = await prisma.sorovLimit
      .findUnique({ where: { kalit: kalitYasa(amal, qoida.nom, ip) } })
      .catch(() => null)

    if (!yozuv) continue

    // Oyna eskirgan — bu qoida bo'yicha sanoq allaqachon nolga teng
    const otgan = (endi - yozuv.oynaBoshi.getTime()) / 1000
    if (otgan >= qoida.oyna) continue

    if (yozuv.soni >= qoida.chegara) {
      return { ok: false, kutish: Math.ceil(qoida.oyna - otgan) }
    }
  }

  return { ok: true }
}

/**
 * Urinishni sanaydi. Chegarani tekshirmaydi — buni qiluvchi
 * `chekloqniTekshir` bilan oldindan tekshiradi.
 */
export async function urinishniQayd(amal, ip) {
  const qoidalar = QOIDALAR[amal]
  if (!ip || !qoidalar) return

  const endi = new Date()

  for (const qoida of qoidalar) {
    const kalit = kalitYasa(amal, qoida.nom, ip)

    try {
      const yozuv = await prisma.sorovLimit.findUnique({ where: { kalit } })
      const eskirgan =
        !yozuv || (endi - yozuv.oynaBoshi.getTime()) / 1000 >= qoida.oyna

      if (eskirgan) {
        // Yangi oyna. `upsert` kerak, chunki yozuv umuman bo'lmasligi
        // ham mumkin.
        await prisma.sorovLimit.upsert({
          where: { kalit },
          create: { kalit, soni: 1, oynaBoshi: endi },
          update: { soni: 1, oynaBoshi: endi },
        })
      } else {
        // `increment` — bir vaqtda kelgan so'rovlar bir-birining
        // sanog'ini yo'qotmasligi uchun
        await prisma.sorovLimit.update({
          where: { kalit },
          data: { soni: { increment: 1 } },
        })
      }
    } catch {
      // Sanay olmasak kirishni yoki ro'yxatdan o'tishni to'xtatmaymiz:
      // baza xatosi butun saytni yopib qo'ymasin
    }
  }

  await eskiniTozala()
}

/** `royxat:soat:1.2.3.4` */
function kalitYasa(amal, oynaNomi, ip) {
  return `${amal}:${oynaNomi}:${ip}`
}

/**
 * Eski yozuvlarni o'chiradi.
 *
 * Alohida cron qo'shilmadi: bu yana bitta eskiradigan joy bo'lardi va
 * `vercel.json` da allaqachon to'rtta cron bor. Tozalash arzon, shuning
 * uchun uni qayd qilish paytida yuz martadan bir marta bajaramiz —
 * jadval o'sib ketishi uchun bu yetarli.
 *
 * Eng uzun oyna bir kun, shuning uchun ikki kundan eski yozuv
 * hech kimga kerak emas.
 */
async function eskiniTozala() {
  if (Math.random() >= 0.01) return

  await prisma.sorovLimit
    .deleteMany({
      where: { yangilandi: { lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } },
    })
    .catch(() => {})
}

/**
 * Kutish vaqtini odam o'qiydigan matnga aylantiradi.
 * Soniyada aytish ("847 soniyadan keyin") tushunarsiz.
 */
export function kutishMatni(soniya) {
  if (soniya < 60) return `${soniya} soniya`
  const daqiqa = Math.ceil(soniya / 60)
  if (daqiqa < 60) return `${daqiqa} daqiqa`
  return `${Math.ceil(daqiqa / 60)} soat`
}
