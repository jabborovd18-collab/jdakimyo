// app/api/maqolalar/stats/route.js
//
// Maqola sanoqchilari (ko'rish / yuklash).
//
// GET  — barcha maqolaning sanoqchisi bitta so'rovda. Ro'yxat sahifalari
//        har bir maqola uchun alohida so'rov yubormasin.
// POST — { articleId, tur: 'korish' | 'yuklash' } — bittaga oshiradi.
//
// Auth talab qilinmaydi: maqolalar ochiq kontent, mehmon ham o'qiydi va
// uning ko'rishi ham hisoblanishi kerak. Suiiste'moldan himoya
// lib/maqola-stat.js ichida (IP + maqola bo'yicha oyna).
import { NextResponse } from 'next/server'
import { statlarniOl, sanoqchiOshir, kimdan } from '@/lib/maqola-stat'

export async function GET() {
  try {
    const stat = await statlarniOl()
    return NextResponse.json({ success: true, stat })
  } catch (e) {
    console.error('[maqolalar/stats] GET:', e)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { articleId, tur } = await request.json().catch(() => ({}))

    const natija = await sanoqchiOshir(articleId, tur, kimdan(request))
    if (!natija.ok) {
      return NextResponse.json({ error: natija.xato }, { status: natija.status })
    }

    return NextResponse.json({
      success: true,
      views: natija.views,
      downloads: natija.downloads,
    })
  } catch (e) {
    console.error('[maqolalar/stats] POST:', e)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
