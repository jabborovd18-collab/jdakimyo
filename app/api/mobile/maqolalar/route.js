// app/api/mobile/maqolalar/route.js
//
// Mobil ilova uchun maqolalar. Veb'dagidek "avval JSON, keyin sanoqchi"
// deb ikki so'rov qilmaydi — ro'yxat va sanoqchilar jamlab qaytariladi.
//
// GET  — maqolalar ro'yxati, sanoqchilar qo'shilgan holda.
// POST — { articleId, tur: 'korish' | 'yuklash' } — sanoqchini oshiradi.
//
// Auth talab qilinmaydi (maqolalar ochiq kontent) va cookie ishlatilmaydi,
// shuning uchun CORS ochiqligi xavf tug'dirmaydi.
import { NextResponse } from 'next/server'
import { statQoshilgan } from '@/lib/maqolalar'
import { statlarniOl, sanoqchiOshir, kimdan } from '@/lib/maqola-stat'

// CORS preflight (sarlavhalar next.config.mjs da)
export { OPTIONS } from '@/lib/cors'

export async function GET() {
  try {
    const stat = await statlarniOl()
    return NextResponse.json({
      success: true,
      maqolalar: statQoshilgan(stat),
    })
  } catch (e) {
    console.error('[mobile/maqolalar] GET:', e)
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
    console.error('[mobile/maqolalar] POST:', e)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
