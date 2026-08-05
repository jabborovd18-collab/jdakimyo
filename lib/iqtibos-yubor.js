// lib/iqtibos-yubor.js
//
// Kunlik iqtibosni barcha guruhlarga yuborish.
//
// NEGA ALOHIDA FAYL. Buni ikki joy chaqiradi — cron va admin
// panelidagi "Hozir yuborish" tugmasi. Mantiq ikkalasida alohida
// yozilsa, biri o'zgarganda ikkinchisi eskirib qolardi.
import { prisma } from './prisma'
import { telegramYubor, tgHimoyala, ulanishOlikmi } from './telegram'
import { bugungiIqtibos, iqtibosMatni } from './iqtibos'

const SAYT = 'https://www.jdakimyo.uz'

/** Bir bo'lakdagi guruh soni — Telegram sekundiga ~30 xabar qabul qiladi */
const BOLAK = 20
const TANAFFUS = 1100

/**
 * @param {object} [p]
 * @param {boolean} [p.sanoqniOshir] Iqtibosning ko'rsatilish sanog'ini
 *   oshirsinmi. Sinov yuborishda oshirilmaydi.
 * @returns {Promise<{jami: number, yetdi: number, yetmadi: number,
 *   tozalandi: number, iqtibos: object}>}
 */
export async function iqtibosniTarqat({ sanoqniOshir = true } = {}) {
  const iqtibos = await bugungiIqtibos()

  const guruhlar = await prisma.telegramGuruh.findMany({
    where: { faol: true, iqtiboslar: true },
    select: { id: true, chatId: true },
  })

  if (guruhlar.length === 0) {
    return { jami: 0, yetdi: 0, yetmadi: 0, tozalandi: 0, iqtibos }
  }

  const matn = iqtibosMatni(iqtibos, tgHimoyala)
  let yetdi = 0
  const olik = []

  for (let i = 0; i < guruhlar.length; i += BOLAK) {
    const bolak = guruhlar.slice(i, i + BOLAK)

    const natijalar = await Promise.allSettled(
      bolak.map((g) =>
        telegramYubor(g.chatId, matn, { havola: { matn: 'JDA KIMYO', url: SAYT } })
      )
    )

    natijalar.forEach((n, j) => {
      const javob = n.status === 'fulfilled' ? n.value : { ok: false, sabab: 'yiqildi' }
      if (javob.ok) return yetdi++
      // Botni guruhdan chiqarib yuborishgan yoki guruh o'chirilgan.
      // Bunday xatolar o'tkinchi emas — qayta urinish yordam bermaydi.
      if (ulanishOlikmi(javob)) olik.push(g.chatId)
    })

    if (i + BOLAK < guruhlar.length) {
      await new Promise((r) => setTimeout(r, TANAFFUS))
    }
  }

  // O'chirmaymiz, faqat `faol: false`: bot qayta qo'shilsa sozlama
  // saqlanib qolsin
  if (olik.length > 0) {
    await prisma.telegramGuruh
      .updateMany({ where: { chatId: { in: olik } }, data: { faol: false } })
      .catch(() => {})
  }

  // Sanoq FAQAT haqiqiy tarqatishda oshadi va bir marta — har guruh
  // uchun emas. Aks holda "nechta odam ko'rdi" degan raqam guruhlar
  // soniga ko'payib, ma'nosini yo'qotardi.
  if (sanoqniOshir && iqtibos.id && yetdi > 0) {
    await prisma.dailyQuote
      .update({ where: { id: iqtibos.id }, data: { timesShown: { increment: 1 } } })
      .catch(() => {})
  }

  return {
    jami: guruhlar.length,
    yetdi,
    yetmadi: guruhlar.length - yetdi,
    tozalandi: olik.length,
    iqtibos,
  }
}
