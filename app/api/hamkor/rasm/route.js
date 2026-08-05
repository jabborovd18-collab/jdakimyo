// app/api/hamkor/rasm/route.js
//
// Kanal avatari va bannerini yuklaydi.
//
// NEGA KERAK EDI. Sozlamalarda "Avatar havolasi" degan matn maydoni
// turardi — ya'ni kanal egasi rasmni avval boshqa joyga yuklab,
// keyin uning manzilini ko'chirib kelishi kerak edi. Amalda buni
// hech kim qilmadi va ikkala kanal ham avatarsiz qoldi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { put } from '@vercel/blob'
import { isPartnerRole } from '@/lib/roles'
import { KanalXatosi, kanalimniOl, sorovdanKanalId } from '@/lib/kanal'

/** Avatar kichik, banner kattaroq — ikkalasi uchun bitta chegara yetadi */
const ENG_KATTA = 4 * 1024 * 1024

const TURLAR = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }
    if (!isPartnerRole(session.user.role)) {
      return NextResponse.json({ error: 'Hamkor huquqi kerak' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const maqsad = formData.get('maqsad') === 'banner' ? 'banner' : 'avatar'
    const kanalId = formData.get('kanalId') || sorovdanKanalId(request)

    // EGALIK TEKSHIRUVI. Busiz hamkor boshqa kanalning rasmini
    // almashtira olardi — `kanalimniOl` id ni `egaId` sharti bilan
    // qidiradi.
    const kanal = await kanalimniOl(session.user.id, kanalId || null)

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Rasm topilmadi' }, { status: 400 })
    }

    const kengaytma = TURLAR[file.type]
    if (!kengaytma) {
      return NextResponse.json(
        { error: 'Faqat JPG, PNG yoki WEBP rasm yuklang' },
        { status: 400 }
      )
    }

    if (file.size > ENG_KATTA) {
      return NextResponse.json(
        { error: `Rasm ${Math.round(ENG_KATTA / 1024 / 1024)} MB dan oshmasligi kerak` },
        { status: 400 }
      )
    }

    // Yo'lda kanal id si bor — fayllar aralashib ketmaydi va keyin
    // kimning rasmi ekanini manzilning o'zidan bilish mumkin
    const blob = await put(
      `kanal/${kanal.id}/${maqsad}-${Date.now()}.${kengaytma}`,
      file,
      { access: 'public', addRandomSuffix: true }
    )

    return NextResponse.json({ success: true, url: blob.url, maqsad })
  } catch (error) {
    if (error instanceof KanalXatosi) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('[Hamkor rasm]', error)
    return NextResponse.json({ error: 'Yuklashda xatolik' }, { status: 500 })
  }
}
