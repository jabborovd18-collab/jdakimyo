// lib/telegram-sertifikat.js
//
// Sertifikatlarni Telegram bot orqali yuborish, ro'yxatini tuzish va
// yuklab olish tugmalarida egalik huquqini tekshirish uchun yagona modul.
// Bildirishnoma qoidasi: Telegram/PDF xatolari asosiy imtihon e'lonini yiqitmaydi.

import { prisma } from './prisma.js'
import {
  CHEGARA,
  telegramHujjatYubor,
  telegramSozlanganmi,
  tgHimoyala,
} from './telegram.js'
import {
  ajratSertifikatTavsifi,
  formatAmalMuddati,
  milliySertifikatPdfMalumoti,
  sanaUzFormat,
  sertifikatHolati,
  sertifikatQrHavolasi,
} from './sertifikat-tahlil.js'
import {
  generatsiyaSertifikatPDFBaytlar,
  sertifikatFaylNomi,
} from './sertifikat-pdf-universal.js'

const TELEGRAM_CALLBACK_CHEGARA = 64
const CERT_PDF_PREFIX = 'sayt:certpdf:'

/**
 * Telegram sendDocument izohi (maksimal 1024 belgi, HTML xavfsiz).
 */
export function sertifikatTelegramIzohi(sertifikat) {
  if (!sertifikat) return ''

  const { isMs } = ajratSertifikatTavsifi(sertifikat)
  const holat = sertifikatHolati(sertifikat)
  const certId = tgHimoyala(String(sertifikat.certId || '').trim())
  const fullName = tgHimoyala(sertifikat.fullName || 'Ishtirokchi')
  const sarlavhaNomi = tgHimoyala(
    sertifikat.examName || sertifikat.fan || (isMs ? 'Milliy Sertifikat Sinovi' : 'JDA Kimyo')
  )

  const qatorlar = [
    isMs
      ? '🏛 <b>JDA Kimyo — Tayyorlik Sinovi Sertifikati</b>'
      : '🎓 <b>JDA Kimyo — Sertifikat tayyor!</b>',
    '',
    `👤 <b>Egasi:</b> ${fullName}`,
    `📘 <b>Yo'nalish:</b> ${sarlavhaNomi}`,
  ]

  if (isMs) {
    const ms = milliySertifikatPdfMalumoti(sertifikat)
    const daraja = tgHimoyala(ms.daraja || '—')
    const ball = tgHimoyala(ms.shkalaBalli ?? '—')
    const oddiyQism =
      ms.oddiyFoiz !== null && ms.oddiyFoiz !== undefined
        ? ` | Oddiy: ${tgHimoyala(ms.oddiyFoiz)}%`
        : ''
    qatorlar.push(`🏅 <b>Natija:</b> ${ball} ball (${daraja} daraja)${oddiyQism}`)
  } else {
    const qismlar = []
    if (sertifikat.grade) qismlar.push(`Daraja: ${tgHimoyala(sertifikat.grade)}`)
    if (sertifikat.score !== null && sertifikat.score !== undefined) {
      qismlar.push(`${tgHimoyala(sertifikat.score)} ball`)
    }
    if (sertifikat.percentage !== null && sertifikat.percentage !== undefined) {
      qismlar.push(`${tgHimoyala(sertifikat.percentage)}%`)
    }
    if (qismlar.length) {
      qatorlar.push(`🏅 <b>Natija:</b> ${qismlar.join(' · ')}`)
    }
  }

  const berilgan = sanaUzFormat(sertifikat.issuedAt)
  if (berilgan) {
    const muddat = formatAmalMuddati(sertifikat.issuedAt, sertifikat.expiresAt)
    qatorlar.push(
      `📅 <b>Berilgan:</b> ${tgHimoyala(berilgan)} · <i>${tgHimoyala(muddat)}</i>`
    )
  }

  if (!holat.yaroqli && holat.sabab) {
    qatorlar.push(`⚠️ <b>Holati:</b> ${tgHimoyala(holat.sabab)}`)
  }

  qatorlar.push(`🪪 <b>ID:</b> <code>${certId}</code>`)

  return qatorlar.join('\n').slice(0, CHEGARA.izoh)
}

/**
 * `/sertifikatlar` buyrug'i uchun xabar matni va PDF yuklash tugmalari.
 */
export function sertifikatRoyxatiXabari(sertifikatlar = []) {
  const royxat = Array.isArray(sertifikatlar) ? sertifikatlar.slice(0, 10) : []
  if (!royxat.length) {
    return {
      matn: [
        '🎓 <b>Sertifikatlaringiz</b>',
        '',
        "Sizda hozircha rasmiy sertifikatlar yo'q.",
        "Milliy sertifikat sinovlari yoki hamkorlik imtihonlarida qatnashib, sertifikat qo'lga kiritishingiz mumkin.",
      ].join('\n'),
      reply_markup: null,
    }
  }

  const qatorlar = [
    `🎓 <b>Sertifikatlaringiz (${royxat.length} ta oxirgisi):</b>`,
    '',
  ]
  const tugmalar = []

  royxat.forEach((c, idx) => {
    const { isMs } = ajratSertifikatTavsifi(c)
    const holat = sertifikatHolati(c)
    const nomi = c.examName || c.fan || (isMs ? 'MS Sinov' : 'JDA Kimyo')
    const daraja = c.grade ? ` · ${tgHimoyala(c.grade)}` : ''
    const sanaMatn = sanaUzFormat(c.issuedAt)
    const belgi = holat.yaroqli ? '✅' : '⚠️'

    qatorlar.push(
      `${idx + 1}. ${belgi} <b>${tgHimoyala(nomi)}</b>${daraja}` +
        (sanaMatn ? ` (${tgHimoyala(sanaMatn)})` : '') +
        `\n    ID: <code>${tgHimoyala(c.certId)}</code>`
    )

    const callbackData = `${CERT_PDF_PREFIX}${c.certId}`
    if (c.certId && Buffer.byteLength(callbackData, 'utf8') <= TELEGRAM_CALLBACK_CHEGARA) {
      const qisqa = nomi.length > 22 ? `${nomi.slice(0, 19)}...` : nomi
      tugmalar.push([
        {
          text: `📄 ${idx + 1}. ${qisqa} (${c.certId})`,
          callback_data: callbackData,
        },
      ])
    }
  })

  qatorlar.push('', '👇 PDF shaklini olish uchun quyidagi tugmani bosing:')

  return {
    matn: qatorlar.join('\n').slice(0, CHEGARA.matn),
    reply_markup: tugmalar.length ? { inline_keyboard: tugmalar } : null,
  }
}

/**
 * Callback orqali PDF so'ralganda Telegram chat egasi shu sertifikatning haqiqiy egasimi tekshiradi.
 */
export async function sertifikatEgasiniTekshir({ chatId, certId, db = prisma }) {
  const tozaId = String(certId || '').trim().toUpperCase()
  if (!chatId || !tozaId) {
    return { ok: false, sabab: 'notogri_sorov' }
  }

  const [ulanish, sertifikat] = await Promise.all([
    db.telegramUlanish.findUnique({
      where: { chatId: String(chatId) },
      select: { userId: true },
    }),
    db.certificate.findUnique({
      where: { certId: tozaId },
    }),
  ])

  if (!ulanish) {
    return { ok: false, sabab: 'ulanmagan' }
  }
  if (!sertifikat) {
    return { ok: false, sabab: 'topilmadi' }
  }
  if (sertifikat.userId !== ulanish.userId) {
    return { ok: false, sabab: 'egasi_emas' }
  }

  return { ok: true, sertifikat }
}

/**
 * Bitta sertifikatni PDF qilib Telegram chatga yuboradi (xatolarni yutadi).
 */
export async function sertifikatTelegramgaYubor({ chatId, sertifikat, customRank = null }) {
  if (!chatId || !sertifikat?.certId) {
    return { ok: false, sabab: 'notogri_parametr' }
  }
  if (!telegramSozlanganmi()) {
    return { ok: false, sabab: 'sozlanmagan' }
  }

  try {
    const pdfBaytlar = await generatsiyaSertifikatPDFBaytlar(sertifikat, customRank)
    const faylNomi = sertifikatFaylNomi(sertifikat.certId)
    const izoh = sertifikatTelegramIzohi(sertifikat)
    const tekshirUrl = sertifikatQrHavolasi(sertifikat.certId)

    return await telegramHujjatYubor(chatId, Buffer.from(pdfBaytlar), faylNomi, izoh, {
      havola: { matn: '🔍 Onlayn tekshirish', url: tekshirUrl },
    })
  } catch (error) {
    console.error('[Telegram sertifikat PDF]', sertifikat.certId, error)
    return { ok: false, sabab: error.message || 'xato' }
  }
}

/**
 * Bir nechta foydalanuvchiga ularning tayyor sertifikat PDF larini Telegramdan yuboradi.
 * Faqat Telegram ulangan va `xabarlar === true` bo'lganlarga yuboriladi.
 */
export async function foydalanuvchilargaSertifikatPdfYubor(
  sertifikatlar = [],
  { maxParallel = 4, db = prisma } = {}
) {
  const royxat = Array.isArray(sertifikatlar)
    ? sertifikatlar.filter((s) => Boolean(s?.userId && s?.certId))
    : []

  if (!royxat.length || !telegramSozlanganmi()) {
    return { yuborildi: 0, jami: royxat.length, otkazildi: royxat.length, xatolar: 0 }
  }

  try {
    const userIdlar = [...new Set(royxat.map((s) => s.userId))]
    const ulanishlar = await db.telegramUlanish.findMany({
      where: { userId: { in: userIdlar }, xabarlar: true },
      select: { userId: true, chatId: true },
    })

    const chatXarita = new Map(ulanishlar.map((u) => [u.userId, u.chatId]))
    const yuboriladigan = royxat.filter((s) => chatXarita.has(s.userId))

    let yuborildi = 0
    let xatolar = 0
    const qadam = Math.max(1, Number(maxParallel) || 4)

    for (let i = 0; i < yuboriladigan.length; i += qadam) {
      const guruh = yuboriladigan.slice(i, i + qadam)
      const natijalar = await Promise.allSettled(
        guruh.map((s) =>
          sertifikatTelegramgaYubor({
            chatId: chatXarita.get(s.userId),
            sertifikat: s,
          })
        )
      )
      for (const r of natijalar) {
        if (r.status === 'fulfilled' && r.value?.ok) {
          yuborildi += 1
        } else {
          xatolar += 1
        }
      }
    }

    return {
      yuborildi,
      jami: royxat.length,
      otkazildi: royxat.length - yuboriladigan.length,
      xatolar,
    }
  } catch (error) {
    console.error('[Telegram ommaviy sertifikat PDF]', error)
    return { yuborildi: 0, jami: royxat.length, otkazildi: 0, xatolar: royxat.length }
  }
}
