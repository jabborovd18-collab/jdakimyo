// app/api/admin/telegram/hisobot/route.js
//
// Quiz va prezentatsiya statistikasi.
//
// NEGA BOTDAN SO'RALADI, BAZADAN O'QILMAYDI. Bu yozuvlar Python
// botning ALOHIDA bazasida turadi (Render'dagi o'z Neon bazasi).
// Sayt unga to'g'ridan ulansa, ikkita sxema bir Prisma mijozida
// yashashi kerak bo'lardi va bot jadvali o'zgarganda saytning
// migratsiyasi buzilardi. HTTP orqali esa ikkala tomon mustaqil
// rivojlanaveradi.
import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'

const KUTISH_MS = 20000

export async function GET() {
  const { isSuperAdmin } = await checkAdminAuth()
  if (!isSuperAdmin) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
  }

  const manzil = process.env.BOT_ISHCHI_URL
  const kalit = String(process.env.BOT_KOPRUK_SIR || '').trim()
  if (!manzil || !kalit) {
    return NextResponse.json({ success: true, sozlanmagan: true })
  }

  const toxtatgich = new AbortController()
  const soat = setTimeout(() => toxtatgich.abort(), KUTISH_MS)

  try {
    const javob = await fetch(`${manzil.replace(/\/$/, '')}/hisobot`, {
      headers: { 'X-Bridge-Secret': kalit },
      signal: toxtatgich.signal,
    })

    if (javob.status === 401) {
      return NextResponse.json({ success: false, sabab: 'kalit-mos-emas' })
    }
    if (!javob.ok) {
      return NextResponse.json({ success: false, sabab: 'xato', kod: javob.status })
    }

    const malumot = await javob.json()
    return NextResponse.json({ success: true, hisobot: malumot })
  } catch (e) {
    // Render'ning bepul xizmati uxlab qolgan bo'lishi mumkin
    return NextResponse.json({
      success: false,
      sabab: e.name === 'AbortError' ? 'uxlayapti' : 'ulanmadi',
    })
  } finally {
    clearTimeout(soat)
  }
}
