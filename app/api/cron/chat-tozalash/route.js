// app/api/cron/chat-tozalash/route.js
//
// Eski xabarlarni o'chiradi.
//
// NEGA SAQLASH MUDDATI BOR. Matn juda kam joy egallaydi va 72 soatda
// o'chirish chatni ishlatib bo'lmaydigan qiladi — o'tgan haftagi
// kelishuvni topib bo'lmaydi. Lekin cheksiz saqlash ham to'g'ri emas:
// baza o'sadi va eski shaxsiy yozishmalar hech kimga kerak emas.
// lib/chat.js dagi SAQLASH_KUNI — yarim yil.
//
// DIQQAT: bu marshrut endi cron jadvalida YO'Q. Uni yakshanba kuni
// `/api/cron/ertalab` chaqiradi (Hobby tarifida ikkitadan ortiq cron
// bo'lmagani uchun ishlar dispetcherlarga yig'ilgan).
import { NextResponse } from 'next/server'
import { cronRuxsati, chatniTozala } from '@/lib/cron-ishlar'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  if (!cronRuxsati(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const natija = await chatniTozala()
    return NextResponse.json({ success: true, ...natija })
  } catch (error) {
    console.error('[Chat tozalash]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
