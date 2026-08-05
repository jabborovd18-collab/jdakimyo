// app/api/cron/iqtibos/route.js
//
// Kunlik iqtibosni Telegram guruhlariga yuboradi.
//
// DIQQAT: bu marshrut endi cron jadvalida YO'Q. Uni har kuni
// `/api/cron/ertalab` chaqiradi (Hobby tarifida ikkitadan ortiq cron
// bo'lmagani uchun ishlar dispetcherlarga yig'ilgan).
//
// QAYTA CHAQIRILSA XAVFSIZ: iqtibos SANADAN hisoblanadi
// (lib/iqtibos.js), ya'ni bir kunda necha marta chaqirilsa ham
// o'sha gap ketadi.
import { NextResponse } from 'next/server'
import { cronRuxsati } from '@/lib/cron-ishlar'
import { iqtibosniTarqat } from '@/lib/iqtibos-yubor'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request) {
  if (!cronRuxsati(request)) {
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
      iqtibos: { manba: natija.iqtibos.manba, author: natija.iqtibos.author },
    })
  } catch (error) {
    console.error('[Cron iqtibos]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
