// app/api/bot/tanga/route.js
//
// Python bot (quiz xizmati) uchun tanga hisobi.
//
// NEGA BOT SAYTGA MUROJAAT QILADI, TESKARISI EMAS. Tanga saytning
// bazasida yashaydi va uni missiya, sandiq, sovg'a ham o'zgartiradi.
// Bot o'z nusxasini yuritganda ikkita haqiqat paydo bo'lardi va ular
// albatta ajralib ketardi. Shu sababli bot faqat so'raydi, yechishni
// esa sayt bajaradi.
//
// NEGA CHAT ID BO'YICHA. Bot foydalanuvchini faqat Telegram chatId
// orqali biladi. Bog'lanish `TelegramUlanish` jadvalida.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  quizNarxi,
  taqdimotNarxi,
  TANGA_SAVOLGA,
  TANGA_SLAYDGA,
  TANGA_TOPISH,
} from '@/lib/bot-tanga'

/**
 * Narxni xizmat turiga qarab hisoblaydi.
 *
 * Bot faqat "nechta va qanday" deb aytadi, summani hisoblash esa shu
 * yerda — iqtisodiy qoida bir joyda tursin.
 */
function narxHisobla(tana) {
  if (tana.xizmat === 'taqdimot') {
    return {
      narx: taqdimotNarxi(tana.slaydlar, Boolean(tana.ikkiFormat)),
      birlikNarxi: TANGA_SLAYDGA,
    }
  }
  return { narx: quizNarxi(tana.savollar), birlikNarxi: TANGA_SAVOLGA }
}

/** Ko'prik kaliti — webhook uzatishida ishlatiladigan kalitning o'zi */
function kalitTogrimi(request) {
  const kutilgan = String(process.env.BOT_KOPRUK_SIR || '').trim()
  if (!kutilgan) return false
  const kelgan = String(request.headers.get('x-bridge-secret') || '').trim()
  // Uzunligi teng bo'lmasa taqqoslash ham shart emas
  return kelgan.length === kutilgan.length && kelgan === kutilgan
}

async function foydalanuvchiniTop(chatId) {
  const ulangan = await prisma.telegramUlanish.findUnique({
    where: { chatId: String(chatId) },
    select: {
      userId: true,
      user: { select: { coins: true, isBanned: true, emailVerified: true } },
    },
  })
  return ulangan
}

export async function POST(request) {
  if (!kalitTogrimi(request)) {
    return NextResponse.json({ ok: false, xato: 'kalit' }, { status: 401 })
  }

  const tana = await request.json().catch(() => null)
  if (!tana?.chatId) {
    return NextResponse.json({ ok: false, xato: 'chatId yo\'q' }, { status: 400 })
  }

  const ulangan = await foydalanuvchiniTop(tana.chatId)
  if (!ulangan) {
    return NextResponse.json({ ok: false, sabab: 'ulanmagan' })
  }
  if (ulangan.user.isBanned) {
    return NextResponse.json({ ok: false, sabab: 'bloklangan' })
  }
  if (!ulangan.user.emailVerified) {
    return NextResponse.json({ ok: false, sabab: 'email-tasdiqlanmagan' })
  }

  const { narx, birlikNarxi } = narxHisobla(tana)

  // ── Holat: narx va balansni bilish (hech narsa o'zgarmaydi) ──
  if (tana.amal === 'holat') {
    return NextResponse.json({
      ok: true,
      coins: ulangan.user.coins,
      narx,
      savolNarxi: birlikNarxi,
      yetadi: ulangan.user.coins >= narx,
      topishYollari: TANGA_TOPISH,
    })
  }

  // ── Yechish ──
  if (tana.amal === 'yech') {
    if (narx <= 0) {
      return NextResponse.json({ ok: false, sabab: 'miqdor yo\'q' }, { status: 400 })
    }

    // ATOMAR YECHISH. Avval o'qib, keyin yozish xavfli: odam ikkita
    // qurilmadan bir vaqtda tasdiqlasa, ikkalasi ham "yetadi" deb
    // ko'rib, balans manfiyga tushardi. `updateMany` sharti bazaning
    // o'zida tekshiriladi va faqat bittasi o'tadi.
    const natija = await prisma.user.updateMany({
      where: { id: ulangan.userId, coins: { gte: narx } },
      data: { coins: { decrement: narx } },
    })

    if (natija.count === 0) {
      return NextResponse.json({
        ok: false,
        sabab: 'yetarli-emas',
        coins: ulangan.user.coins,
        narx,
        topishYollari: TANGA_TOPISH,
      })
    }

    const yangi = await prisma.user.findUnique({
      where: { id: ulangan.userId },
      select: { coins: true },
    })

    return NextResponse.json({ ok: true, coins: yangi?.coins ?? 0, narx })
  }

  return NextResponse.json({ ok: false, xato: 'noma\'lum amal' }, { status: 400 })
}
