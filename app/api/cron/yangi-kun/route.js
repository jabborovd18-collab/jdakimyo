// app/api/cron/yangi-kun/route.js
//
// TOSHKENT YARIM TUNIDA bajariladigan ishlar (UTC 19:00).
//
// NEGA DISPETCHER. Vercel'ning Hobby tarifida atigi IKKITA cron
// bo'ladi, loyihada esa beshta yozilgan edi. Ortiqchalari jimgina
// ro'yxatga olinmaydi — xato chiqmaydi, shunchaki ishlamaydi va
// qaysi biri qolgani ham noma'lum. Shuning uchun ishlar ikkita
// dispetcherga yig'ildi.
//
// NEGA AYNAN YARIM TUNDA. Sovg'a Toshkent yarim tunida kuyadi va
// yangi kun missiyalari ham o'sha payt boshlanadi. Ertalabki
// dispetcherga qo'shsak, tunda kirgan odam kechagi missiyalarni
// ko'rardi.
import { NextResponse } from 'next/server'
import { cronRuxsati, missiyalarniYarat } from '@/lib/cron-ishlar'
import { kuyganlarniBelgila } from '@/lib/sovga'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request) {
  if (!cronRuxsati(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const natija = {}

  // Har bir ish ALOHIDA ushlanadi: biri yiqilsa qolganlari
  // bajarilaversin. Avval hammasi bitta `try` da bo'lganda birinchi
  // xato qolgan ishlarni ham to'xtatib qo'yardi.
  try {
    natija.missiyalar = await missiyalarniYarat()
  } catch (e) {
    natija.missiyalar = { xato: e.message }
  }

  try {
    natija.sovgalar = { kuydi: await kuyganlarniBelgila() }
  } catch (e) {
    natija.sovgalar = { xato: e.message }
  }

  return NextResponse.json({ success: true, ...natija })
}
