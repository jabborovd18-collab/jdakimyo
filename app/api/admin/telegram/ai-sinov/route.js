// app/api/admin/telegram/ai-sinov/route.js
//
// AI (Gemini) ulanishining xom tashxisi.
//
// NEGA ALOHIDA TUGMA. "AI bo'sh javob qaytardi" xabari foydalanuvchiga
// ko'rinadi, lekin sababi — qaysi model, qaysi finishReason, nechta
// token o'ylashga ketgani — faqat Render qaydnomasida qolardi. Uni
// o'qish uchun har safar hosting panelini titish kerak bo'lardi va
// tuzatish taxmin bilan olib borilardi.
import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'

// Gemini "o'ylab" javob berishi mumkin, shuning uchun ko'prik
// tekshiruvidan uzunroq kutamiz
const KUTISH_MS = 50000

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
    const javob = await fetch(`${manzil.replace(/\/$/, '')}/ai-sinov`, {
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
