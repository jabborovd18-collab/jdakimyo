// JDA KIMYO NEWS — yopiq kanaldagi xabarni guruhlarga tarqatish.
//
// ISHLASH TARTIBI:
//   1. Egasi yopiq kanalga xabar yozadi (rasm bilan yoki rasmsiz)
//   2. Bot o'sha kanalga "Guruhlarga yuborish (N ta)" tugmasini chiqaradi
//   3. Tugma bosilsa, xabar `copyMessage` bilan guruhlarga ko'chiriladi
//
// NEGA TASDIQ TUGMASI BOR. Kanalga yozilgan har xabar darhol hamma
// guruhga ketsa, bitta xato yozuv — barchaga tarqalgan xato bo'lardi
// va uni qaytarib olishning iloji yo'q. Tugma bosilmasa hech qayerga
// ketmaydi.
//
// NEGA `copyMessage`. `forwardMessage` "Forwarded from ..." yozuvini
// qoldiradi: u yopiq kanalning borligini oshkor qiladi va begona
// ko'rinadi. Nusxa esa botning o'z xabari bo'lib chiqadi.
import { prisma } from '@/lib/prisma'
import { isSuperAdmin } from '@/lib/roles'
import {
  nusxaYubor,
  tugmalarBilanYubor,
  xabarniTahrirla,
} from '@/lib/telegram'

/** Tugma qiymatlari — `sayt:` bilan boshlangani saytda ishlanadi */
export const TUGMA = {
  yangilikYubor: (xabarId) => `sayt:yangilik:${xabarId}`,
  guruhIqtibos: 'sayt:guruh:iqtibos',
  guruhYangilik: 'sayt:guruh:yangilik',
}

/** Yangilik yuboriladigan guruhlar */
async function nishonGuruhlar() {
  return prisma.telegramGuruh.findMany({
    where: { faol: true, yangiliklar: true },
    select: { chatId: true, nom: true },
  })
}

/**
 * Kanalga yangi post tushdi — tasdiq tugmasini chiqaramiz.
 *
 * Bot admin bo'lgan HAR QANDAY kanaldan post kelishi mumkin, shuning
 * uchun bu yerda hech narsa yuborilmaydi: xavfsizlik tugmani BOSISH
 * paytida tekshiriladi (faqat superadmin).
 */
export async function yangilikTaklifi({ kanalId, xabarId }) {
  const guruhlar = await nishonGuruhlar()

  if (guruhlar.length === 0) {
    return tugmalarBilanYubor(
      kanalId,
      '⚠️ Yangilik yuboriladigan guruh yo\'q.\n\n' +
        'Botni guruhga qo\'shing yoki admin panelda yangiliklarni yoqing.',
      []
    )
  }

  return tugmalarBilanYubor(
    kanalId,
    `📤 Shu xabarni <b>${guruhlar.length} ta guruhga</b> yuborasizmi?\n\n` +
      'Xabar botning o\'z nomidan boradi — "uzatilgan" yozuvi bo\'lmaydi.',
    [[{ matn: `📤 Yuborish (${guruhlar.length} ta)`, qiymat: TUGMA.yangilikYubor(xabarId) }]]
  )
}

/**
 * Tasdiqlangan yangilikni guruhlarga tarqatadi.
 *
 * @returns {Promise<{ok: boolean, sabab?: string, yetdi?: number, jami?: number}>}
 */
export async function yangilikniTarqat({ kanalId, xabarId, bosganTgId }) {
  // HUQUQ TEKSHIRUVI SHU YERDA. Bot begona kanalga admin qilingan
  // bo'lsa ham, tugmani faqat saytdagi superadmin bosa oladi.
  const ulangan = await prisma.telegramUlanish.findUnique({
    where: { chatId: String(bosganTgId) },
    select: { user: { select: { role: true } } },
  })

  if (!ulangan || !isSuperAdmin(ulangan.user.role)) {
    return { ok: false, sabab: 'ruxsat' }
  }

  const guruhlar = await nishonGuruhlar()
  if (guruhlar.length === 0) return { ok: false, sabab: 'guruh-yoq' }

  // Beshtadan yuboriladi: Telegram tez ketma-ket so'rovlarda cheklaydi
  // va bir necha guruh javobsiz qolib ketardi.
  const BOLAK = 5
  const TANAFFUS = 400

  let yetdi = 0
  const olik = []

  for (let i = 0; i < guruhlar.length; i += BOLAK) {
    const bolak = guruhlar.slice(i, i + BOLAK)
    const natijalar = await Promise.allSettled(
      bolak.map((g) => nusxaYubor(g.chatId, kanalId, xabarId))
    )

    natijalar.forEach((n, j) => {
      const javob = n.status === 'fulfilled' ? n.value : { ok: false }
      if (javob.ok) yetdi++
      else olik.push(bolak[j].chatId)
    })

    if (i + BOLAK < guruhlar.length) {
      await new Promise((r) => setTimeout(r, TANAFFUS))
    }
  }

  // Bot chiqarilgan guruhlar `faol=false` ga o'tadi. Yozuv
  // O'CHIRILMAYDI: bot qayta qo'shilsa sozlamalari joyida qolsin.
  if (olik.length) {
    await prisma.telegramGuruh
      .updateMany({ where: { chatId: { in: olik } }, data: { faol: false } })
      .catch(() => {})
  }

  return { ok: true, yetdi, jami: guruhlar.length }
}

/** Tugma bosilgach kanaldagi xabarni natija bilan almashtiradi */
export async function yangilikNatijasi({ kanalId, xabarId, natija }) {
  const matn = natija.ok
    ? `✅ Yuborildi: <b>${natija.yetdi}</b> / ${natija.jami} guruh` +
      (natija.yetdi < natija.jami
        ? '\n\n⚠️ Yetib bormaganlari botdan chiqarilgan bo\'lishi mumkin — ' +
          'ular ro\'yxatda "chiqarilgan" deb belgilandi.'
        : '')
    : {
        ruxsat: '🔒 Faqat superadmin yubora oladi.',
        'guruh-yoq': '⚠️ Yangilik yoqilgan guruh yo\'q.',
      }[natija.sabab] || '⚠️ Yuborib bo\'lmadi.'

  // Tugma olib tashlanadi: ikkinchi marta bosilsa xabar guruhlarga
  // takror ketardi.
  return xabarniTahrirla(kanalId, xabarId, matn, null)
}

// ─── Guruh sozlamalari ────────────────────────────────────────────

/** `/sozlama` — guruhdagi joriy holat va almashtirish tugmalari */
export async function guruhSozlamasi(chatId) {
  const guruh = await prisma.telegramGuruh.findUnique({
    where: { chatId: String(chatId) },
  })

  if (!guruh) {
    return tugmalarBilanYubor(
      chatId,
      '⚠️ Bu guruh ro\'yxatda yo\'q. Botni guruhdan chiqarib, qayta qo\'shing.',
      []
    )
  }

  const belgi = (yoqilgan) => (yoqilgan ? '🟢 yoqilgan' : '⚪️ o\'chirilgan')

  return tugmalarBilanYubor(
    chatId,
    '⚙️ <b>Bot sozlamalari</b>\n\n' +
      `📜 Kunlik iqtibos: ${belgi(guruh.iqtiboslar)}\n` +
      `📰 Yangiliklar: ${belgi(guruh.yangiliklar)}\n\n` +
      'O\'zgartirish uchun tugmani bosing.',
    [
      [{ matn: `📜 Iqtibos: ${guruh.iqtiboslar ? 'o\'chirish' : 'yoqish'}`, qiymat: TUGMA.guruhIqtibos }],
      [{ matn: `📰 Yangilik: ${guruh.yangiliklar ? 'o\'chirish' : 'yoqish'}`, qiymat: TUGMA.guruhYangilik }],
    ]
  )
}

/**
 * Sozlamani almashtiradi.
 *
 * Guruhda BUYRUQNI KIM YOZGANI tekshirilmaydi: guruh a'zolari
 * o'zlari kelishib oladi va bu botning o'z sozlamasi, saytdagi
 * ma'lumotga ta'sir qilmaydi. Guruh administratorini so'rash
 * qo'shimcha API chaqiruvi bo'lardi va foydasi kam.
 */
export async function guruhSozlamaAlmashtir(chatId, maydon) {
  const guruh = await prisma.telegramGuruh.findUnique({
    where: { chatId: String(chatId) },
  })
  if (!guruh) return { ok: false }

  const yangi = maydon === 'iqtibos'
    ? { iqtiboslar: !guruh.iqtiboslar }
    : { yangiliklar: !guruh.yangiliklar }

  await prisma.telegramGuruh.update({ where: { chatId: String(chatId) }, data: yangi })
  return { ok: true, yoqildi: Object.values(yangi)[0] }
}
