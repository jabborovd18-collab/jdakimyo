// app/api/mobile/forum/route.js
//
// Mobil ilova uchun "Dolzarb mavzular" lentasi.
//
// Ro'yxat mantiqi lib/forum.js da va u veb bilan bir xil — dolzarblik bali,
// qadalgan mavzular, sahifalash. Farqi faqat autentifikatsiyada: veb cookie
// sessiyasi bilan, mobil esa Authorization: Bearer tokeni bilan ishlaydi,
// shuning uchun /api/forum/posts ni to'g'ridan-to'g'ri chaqirib bo'lmaydi.
//
// Auth majburiy emas: lenta ochiq kontent, mehmon ham o'qiy oladi. Token
// bo'lsa, foydalanuvchining o'z layklari va tasdiq kutayotgan posti ham
// ko'rinadi.
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/api-auth'
import { royxatParametrlari, mavzularniOl } from '@/lib/forum'

// CORS preflight (sarlavhalar next.config.mjs da)
export { OPTIONS } from '@/lib/cors'

export async function GET(request) {
  try {
    const auth = await getAuthUser(request)
    const userId = auth?.id ?? null

    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('articleId') // null bo'lsa — umumiy lenta
    const { sort, limit, offset } = royxatParametrlari(searchParams, { articleId })

    const natija = await mavzularniOl({ articleId, sort, limit, offset, userId })

    return NextResponse.json({ success: true, ...natija })
  } catch (error) {
    console.error('[mobile/forum] GET:', error)
    return NextResponse.json(
      { error: 'Mavzularni yuklashda xatolik' },
      { status: 500 }
    )
  }
}
