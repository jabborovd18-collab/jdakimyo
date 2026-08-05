// app/api/cron/ertalab/route.js
//
// TOSHKENT ERTALAB SOAT 08:00 da bajariladigan ishlar (UTC 03:00).
//
// Kunlik iqtibos — har kuni. Haftalik ishlar shu yerdan, KUNGA
// QARAB chaqiriladi: Hobby tarifida ikkitadan ortiq cron bo'lmaydi,
// shuning uchun ular uchun alohida jadval ajratib bo'lmaydi.
//
// Hafta kuni TOSHKENT vaqtida hisoblanadi (`toshkentHaftaKuni`) —
// UTC bo'yicha olinsa, dushanba ishlari yakshanba kechqurun
// bajarilardi.
import { NextResponse } from 'next/server'
import {
  cronRuxsati, haftalikniTozala, chatniTozala, toshkentHaftaKuni,
} from '@/lib/cron-ishlar'
import { iqtibosniTarqat } from '@/lib/iqtibos-yubor'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request) {
  if (!cronRuxsati(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const kun = toshkentHaftaKuni()
  const natija = { haftaKuni: kun }

  // Har bir ish alohida ushlanadi: biri yiqilsa qolganlari bajarilsin
  try {
    const t = await iqtibosniTarqat()
    natija.iqtibos = { jami: t.jami, yetdi: t.yetdi, manba: t.iqtibos.manba }
  } catch (e) {
    natija.iqtibos = { xato: e.message }
  }

  // Dushanba — haftalik yulduzlar nolga qaytadi
  if (kun === 1) {
    try {
      natija.haftalik = await haftalikniTozala()
    } catch (e) {
      natija.haftalik = { xato: e.message }
    }
  }

  // Yakshanba — eski chat xabarlari o'chadi
  if (kun === 0) {
    try {
      natija.chat = await chatniTozala()
    } catch (e) {
      natija.chat = { xato: e.message }
    }
  }

  return NextResponse.json({ success: true, ...natija })
}
