// app/api/cron/iqtibos/route.js
//
// Kunlik iqtibosni Telegram guruhlariga yuboradi.
//
// NEGA ERTALAB. Iqtibos — kunning boshlanishi uchun; kechqurun
// yuborilgani o'qilmay qoladi. Toshkent ertalab soati 08:00 = UTC
// 03:00, shuning uchun jadval `0 3 * * *`.
//
// QAYTA CHAQIRILSA XAVFSIZ: iqtibos SANADAN hisoblanadi (lib/iqtibos.js),
// ya'ni cron ikki marta ishga tushsa ham o'sha kuni o'sha gap ketadi.
// Ikki xil gap yuborilib qolmaydi.
import { NextResponse } from 'next/server'
import { iqtibosniTarqat } from '@/lib/iqtibos-yubor'

export const dynamic = 'force-dynamic'
// Ko'p guruhga yuborish sekin — sukutdagi chegara buni yarmida uzardi
export const maxDuration = 60

export async function GET(request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const natija = await iqtibosniTarqat()

    return NextResponse.json({
      success: true,
      message: natija.jami
        ? `${natija.yetdi}/${natija.jami} guruhga yuborildi`
        : 'Guruh yo\'q',
      ...natija,
      // Iqtibosning to'liq matni javobda kerak emas — faqat manbasi
      iqtibos: { manba: natija.iqtibos.manba, author: natija.iqtibos.author },
    })
  } catch (error) {
    console.error('[Cron iqtibos]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
