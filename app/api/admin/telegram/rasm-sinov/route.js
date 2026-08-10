// app/api/admin/telegram/rasm-sinov/route.js
//
// Slayd rasmlari manbalarining xom tashxisi.
//
// NEGA `ai-sinov` DAN ALOHIDA. U faqat MATN modelini tekshiradi. Rasm
// esa butunlay boshqa ikki manbadan keladi: tuzilma formulasi
// PubChem'dan (kalitsiz, Google'ga aloqasi yo'q), muqova bezagi esa
// Gemini'ning ALOHIDA rasm modelidan. Matn modeli ishlab tursa ham
// rasm modeli yopilgan bo'lishi mumkin — 2026-08-10 dagi "rasmlar
// ishlamayapti" shikoyatining sababini aynan shu ajratish ko'rsatdi.
import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'

// PubChem to'rtta so'rov + Gemini rasm modeli: matn sinovidan
// sekinroq bo'lishi tabiiy
const KUTISH_MS = 60000

export async function POST() {
  const { isSuperAdmin } = await checkAdminAuth()
  if (!isSuperAdmin) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  const manzil = process.env.BOT_ISHCHI_URL
  const kalit = String(process.env.BOT_KOPRUK_SIR || '').trim()
  if (!manzil || !kalit) {
    return NextResponse.json({ success: false, sabab: 'kopruk-sozlanmagan' })
  }

  const toxtatgich = new AbortController()
  const soat = setTimeout(() => toxtatgich.abort(), KUTISH_MS)

  try {
    const javob = await fetch(`${manzil.replace(/\/$/, '')}/rasm-sinov`, {
      headers: { 'X-Bridge-Secret': kalit },
      signal: toxtatgich.signal,
    })
    if (javob.status === 401) {
      return NextResponse.json({ success: false, sabab: 'kalit-mos-emas' })
    }
    if (javob.status === 404) {
      return NextResponse.json({ success: false, sabab: 'eski-kod' })
    }
    return NextResponse.json({ success: true, natija: await javob.json() })
  } catch (e) {
    return NextResponse.json({
      success: false,
      sabab: e.name === 'AbortError' ? 'uxlayapti' : 'ulanmadi',
    })
  } finally {
    clearTimeout(soat)
  }
}
