// app/api/cron/reset-weekly/route.js
//
// DIQQAT: bu marshrut endi cron jadvalida YO'Q. Uni dushanba kuni
// `/api/cron/ertalab` chaqiradi (Hobby tarifida ikkitadan ortiq cron
// bo'lmagani uchun ishlar dispetcherlarga yig'ilgan).
//
// Marshrut qo'lda chaqirish uchun qoldirildi.
import { NextResponse } from 'next/server'
import { cronRuxsati, haftalikniTozala } from '@/lib/cron-ishlar'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  if (!cronRuxsati(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { tozalandi } = await haftalikniTozala()
    return NextResponse.json({
      success: true,
      message: `${tozalandi} ta foydalanuvchining haftalik yulduzlari reset qilindi`,
    })
  } catch (error) {
    console.error('[Cron reset-weekly]', error)
    return NextResponse.json(
      { error: 'Haftalik yulduzlarni reset qilishda xatolik' },
      { status: 500 }
    )
  }
}
