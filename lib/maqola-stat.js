// lib/maqola-stat.js
//
// Maqola ko'rish/yuklash sanoqchilari — bazaga yozish qismi.
// Veb (/api/maqolalar/stats) va mobil (/api/mobile/maqolalar) yo'llari
// shu yerdagi funksiyalarni ishlatadi, shunda sanoqchi ikkalasida bir xil.
import { prisma } from '@/lib/prisma'
import { maqolaIdlar } from '@/lib/maqolalar'

export const TURLAR = ['korish', 'yuklash']

/**
 * Barcha maqolalarning sanoqchilari:
 *   { "1": { views: 12, downloads: 3 }, ... }
 *
 * Bazada yozuvi yo'q maqola javobda ham bo'lmaydi — klient bunday holatda
 * JSON'dagi boshlang'ich raqamni ko'rsatadi (lib/maqolalar.js: statQoshilgan).
 */
export async function statlarniOl() {
  const yozuvlar = await prisma.articleStat.findMany({
    where: { articleId: { in: maqolaIdlar } },
    select: { articleId: true, views: true, downloads: true },
  })

  const natija = {}
  for (const y of yozuvlar) {
    natija[y.articleId] = { views: y.views, downloads: y.downloads }
  }
  return natija
}

// ─── Takroriy so'rovlardan himoya ─────────────────────────────────────────
//
// Xotiradagi oddiy qulf. Vercel'da har bir instansiyaning o'z xotirasi bor,
// ya'ni bu mutlaq to'siq emas — maqsadi bitta odam sahifani qayta-qayta
// yangilab sanoqchini shishirib yuborishini to'xtatish. Klient tomonda ham
// sessiyaga bir marta yozadigan qo'shimcha tekshiruv bor.
const OYNA_MS = 30 * 60 * 1000 // 30 daqiqa
const oxirgi = new Map()

function tezOtdi(kalit) {
  const endi = Date.now()

  // Xotira cheksiz o'smasligi uchun eskirganlarni tozalab turamiz.
  if (oxirgi.size > 5000) {
    for (const [k, v] of oxirgi) if (endi - v > OYNA_MS) oxirgi.delete(k)
  }

  const avvalgi = oxirgi.get(kalit)
  if (avvalgi && endi - avvalgi < OYNA_MS) return true
  oxirgi.set(kalit, endi)
  return false
}

/**
 * Sanoqchini bittaga oshiradi va yangi qiymatni qaytaradi.
 *
 * @param articleId  maqola id (faqat mavjud maqolalar qabul qilinadi)
 * @param tur        'korish' | 'yuklash'
 * @param kimdan     IP yoki sessiya kaliti — takrorni aniqlash uchun
 * @returns { ok, views, downloads } yoki { ok: false, xato }
 */
export async function sanoqchiOshir(articleId, tur, kimdan = 'nomalum') {
  const id = String(articleId ?? '')

  // Faqat ro'yxatdagi id'lar: aks holda so'rov bilan bazaga xohlagancha
  // yangi qator qo'shib yuborish mumkin bo'lardi.
  if (!maqolaIdlar.includes(id)) {
    return { ok: false, xato: 'Maqola topilmadi', status: 404 }
  }
  if (!TURLAR.includes(tur)) {
    return { ok: false, xato: 'Tur notogri', status: 400 }
  }

  const maydon = tur === 'korish' ? 'views' : 'downloads'

  // Tez takrorlangan so'rov: sanoqchi oshmaydi, lekin joriy holat qaytadi,
  // shunda klientda raqam "yo'qolib" qolmaydi.
  if (tezOtdi(`${kimdan}:${id}:${tur}`)) {
    const bor = await prisma.articleStat.findUnique({
      where: { articleId: id },
      select: { views: true, downloads: true },
    })
    return {
      ok: true,
      takror: true,
      views: bor?.views ?? 0,
      downloads: bor?.downloads ?? 0,
    }
  }

  const yozuv = await prisma.articleStat.upsert({
    where: { articleId: id },
    create: { articleId: id, [maydon]: 1 },
    update: { [maydon]: { increment: 1 } },
    select: { views: true, downloads: true },
  })

  return { ok: true, views: yozuv.views, downloads: yozuv.downloads }
}

/** So'rov yuboruvchini taxminan aniqlash (proxy sarlavhalari orqali). */
export function kimdan(request) {
  const h = request.headers
  return (
    h.get('x-forwarded-for')?.split(',')[0].trim() ||
    h.get('x-real-ip') ||
    'nomalum'
  )
}
