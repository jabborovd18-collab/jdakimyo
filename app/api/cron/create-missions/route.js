// app/api/cron/create-missions/route.js
//
// DIQQAT: bu marshrut endi cron jadvalida YO'Q. Uni
// `/api/cron/yangi-kun` chaqiradi (Hobby tarifida ikkitadan ortiq
// cron bo'lmagani uchun ishlar dispetcherlarga yig'ilgan).
//
// Marshrut qoldirildi, chunki uni qo'lda chaqirib sinash qulay.
// Mantiq `lib/cron-ishlar.js` da — ikki joyda takrorlanmasligi uchun.
import { NextResponse } from 'next/server'
import { cronRuxsati, missiyalarniYarat } from '@/lib/cron-ishlar'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  if (!cronRuxsati(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { yaratildi } = await missiyalarniYarat()
    return NextResponse.json({
      success: true,
      message: yaratildi
        ? `${yaratildi} ta missiya yaratildi`
        : 'Bugungi missiyalar allaqachon mavjud',
      count: yaratildi,
    })
  } catch (error) {
    console.error('[Cron create-missions]', error)
    return NextResponse.json({ error: 'Missiyalar yaratishda xatolik' }, { status: 500 })
  }
}
