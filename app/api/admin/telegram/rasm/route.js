// app/api/admin/telegram/rasm/route.js
//
// E'lon rasmini Vercel Blob'ga yuklaydi.
//
// NEGA BLOB. Telegram rasmni MANZIL bo'yicha o'zi yuklab oladi —
// unga ochiq havola kerak. Faylni to'g'ridan-to'g'ri uzatish ham
// mumkin edi, lekin u holda har bir foydalanuvchi uchun rasm qaytadan
// yuborilardi; manzil bilan Telegram uni bir marta oladi va o'zida
// keshlaydi.
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { checkAdminAuth } from '@/lib/admin-auth'

/** Telegram tashqi manzildan 5 MB gacha rasm oladi */
const ENG_KATTA = 5 * 1024 * 1024

// Faqat rasm. Hujjat va boshqa turlar `sendPhoto` da baribir
// ishlamaydi, GIF esa alohida usul talab qiladi.
const TURLAR = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export async function POST(request) {
  try {
    const { isSuperAdmin } = await checkAdminAuth()
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

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

    const blob = await put(`telegram-elon/${Date.now()}.${kengaytma}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      olcham: Math.round(file.size / 1024),
    })
  } catch (error) {
    console.error('[Telegram rasm]', error)
    return NextResponse.json({ error: 'Yuklashda xatolik' }, { status: 500 })
  }
}
