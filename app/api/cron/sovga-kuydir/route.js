// app/api/cron/sovga-kuydir/route.js
//
// Olinmagan sovg'alarni kuygan deb belgilaydi.
//
// NEGA CRON HAM KERAK. Muddat tekshiruvi so'rov paytida ham bor
// (lib/sovga.js dagi `kuyganlarniBelgila`), ya'ni to'g'rilik shusiz ham
// ta'minlangan — kechagi sovg'ani qabul qilib bo'lmaydi. Lekin
// YUBORUVCHI tomonida holat qabul qiluvchi sahifani ochmaguncha
// "kutilmoqda" bo'lib turardi va odam behuda kutardi.
//
// Toshkent yarim tuni = UTC 19:00, shuning uchun jadval `0 19 * * *`.
import { NextResponse } from 'next/server'
import { kuyganlarniBelgila } from '@/lib/sovga'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const soni = await kuyganlarniBelgila()
    return NextResponse.json({
      success: true,
      message: soni ? `${soni} ta sovg'a kuydi` : 'Kuyadigan sovg\'a yo\'q',
      soni,
    })
  } catch (error) {
    console.error('[Cron Sovga Kuydir]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
