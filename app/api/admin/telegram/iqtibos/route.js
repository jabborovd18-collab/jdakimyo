// app/api/admin/telegram/iqtibos/route.js
//
// Kunlik iqtibos nazorati: bugun qaysi gap ketishi, qaysi guruhlarga
// va uni qo'lda yuborish.
//
// NEGA QO'LDA YUBORISH KERAK. Cron kuniga bir marta ishlaydi va u
// ishlamay qolsa (yoki guruh keyinroq qo'shilsa), o'sha kun butunlay
// o'tkazib yuborilardi. Qayta yuborish XAVFSIZ: iqtibos sanadan
// hisoblanadi, ya'ni ikkinchi marta ham o'sha gap ketadi.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'
import { qaydEt } from '@/lib/qaydnoma'
import { bugungiIqtibos } from '@/lib/iqtibos'
import { iqtibosniTarqat } from '@/lib/iqtibos-yubor'

export const maxDuration = 60

/** Iqtibos — gamifikatsiya emas, kontent; shu huquq bilan boshqariladi */
async function ruxsat() {
  const { isAdmin, user } = await checkAdminAuth('kontent')
  return { ok: isAdmin, user }
}

// GET — bugungi iqtibos va guruhlar
export async function GET() {
  const { ok } = await ruxsat()
  if (!ok) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })

  const [iqtibos, guruhlar, jamiGap, faolGap] = await Promise.all([
    bugungiIqtibos(),
    prisma.telegramGuruh.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.dailyQuote.count(),
    prisma.dailyQuote.count({ where: { isActive: true } }),
  ])

  return NextResponse.json({
    success: true,
    iqtibos: {
      textUz: iqtibos.textUz,
      author: iqtibos.author,
      icon: iqtibos.icon,
      // `manba` nima uchun aynan shu gap chiqqanini tushuntiradi:
      // sana — atayin belgilangan, aylanma — faol gaplar orasidan,
      // zaxira — bazada gap yo'q
      manba: iqtibos.manba,
    },
    guruhlar,
    gaplar: { jami: jamiGap, faol: faolGap },
  })
}

// POST — hozir yuborish
export async function POST(request) {
  const { ok, user } = await ruxsat()
  if (!ok) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })

  try {
    const natija = await iqtibosniTarqat()

    if (natija.jami === 0) {
      return NextResponse.json(
        { error: 'Botga qo\'shilgan guruh yo\'q. Botni guruhga qo\'shing.' },
        { status: 400 }
      )
    }

    await qaydEt({
      adminId: user.id,
      action: 'Kunlik iqtibos qo\'lda yuborildi',
      targetType: 'Telegram',
      details: `${natija.yetdi}/${natija.jami} guruhga — "${natija.iqtibos.textUz?.slice(0, 100)}"`,
      request,
    })

    return NextResponse.json({ success: true, ...natija, iqtibos: undefined })
  } catch (error) {
    console.error('[Admin iqtibos POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT — guruhni yoqish/o'chirish
export async function PUT(request) {
  const { ok } = await ruxsat()
  if (!ok) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })

  const { id, iqtiboslar } = await request.json().catch(() => ({}))
  if (!id) return NextResponse.json({ error: 'id kerak' }, { status: 400 })

  const guruh = await prisma.telegramGuruh.update({
    where: { id },
    data: { iqtiboslar: Boolean(iqtiboslar) },
  })

  return NextResponse.json({
    success: true,
    guruh,
    message: guruh.iqtiboslar ? '✓ Iqtibos yoqildi' : '✓ Iqtibos o\'chirildi',
  })
}
