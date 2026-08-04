// app/api/ustoz/fayl/route.js
//
// Vazifaga biriktiriladigan fayllarni Vercel Blob'ga yuklaydi.
//
// NEGA KERAK EDI. Avval `new-vazifa` sahifasi `URL.createObjectURL`
// bilan `blob:` manzil yasab, uni bazaga yozardi va "fayl qo'shildi"
// deb yashil xabar ko'rsatardi. Bunday manzil FAQAT o'sha brauzer
// oynasida yashaydi: sahifa yangilangach ustozning o'zida ham,
// talabalarda esa hech qachon ochilmaydi.
//
// Blob allaqachon ulangan (avatar yuklash shuni ishlatadi), faqat
// vazifalar uchun kod yozilmagan edi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { put, del } from '@vercel/blob'
import { ustozPaneliOchiqmi } from '@/lib/roles'

/** Eng katta hajm — Vercel funksiyasining so'rov chegarasidan pastda */
const ENG_KATTA = 8 * 1024 * 1024

/**
 * Ruxsat etilgan turlar.
 *
 * Oq ro'yxat, qora emas: yangi xavfli tur paydo bo'lganda uni eslab
 * qolish shart bo'lmasin. Bajariladigan fayllar (exe, js, html) ataylab
 * yo'q — Blob manzillari ochiq va ular to'g'ridan-to'g'ri ochilardi.
 */
const TURLAR = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'text/plain': 'txt',
  'application/zip': 'zip',
}

/** Fayl nomini xavfsiz holga keltiradi */
function nomniTozala(nom) {
  return String(nom || 'fayl')
    .replace(/\.[^.]+$/, '')              // kengaytmani olib tashlaymiz
    .replace(/[^\p{L}\p{N}\s._-]/gu, '')  // faqat harf, raqam va oddiy belgilar
    .trim()
    .slice(0, 80) || 'fayl'
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    if (!ustozPaneliOchiqmi(session.user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 })
    }

    const kengaytma = TURLAR[file.type]
    if (!kengaytma) {
      return NextResponse.json(
        { error: 'Bu fayl turi qabul qilinmaydi. PDF, rasm, Word, Excel, PowerPoint yoki ZIP yuklang.' },
        { status: 400 }
      )
    }

    if (file.size > ENG_KATTA) {
      return NextResponse.json(
        { error: `Fayl hajmi ${Math.round(ENG_KATTA / 1024 / 1024)} MB dan oshmasligi kerak` },
        { status: 400 }
      )
    }

    // Yo'lda ustoz id si bor: kim yuklaganini keyin manzilning o'zidan
    // bilish mumkin va fayllar aralashib ketmaydi.
    const yol = `vazifa/${session.user.id}/${Date.now()}-${nomniTozala(file.name)}.${kengaytma}`

    const blob = await put(yol, file, {
      access: 'public',
      // Vercel nomga tasodifiy qo'shimcha qo'shadi — bir xil nomli
      // fayllar bir-birini o'chirib yubormaydi
      addRandomSuffix: true,
    })

    return NextResponse.json({
      success: true,
      fayl: {
        nom: file.name,
        url: blob.url,
        // Hajmni kilobaytda saqlaymiz — ro'yxatda shu ko'rinishda kerak
        size: Math.round(file.size / 1024),
        type: file.type,
        uploadedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[Vazifa fayl POST]', error)
    return NextResponse.json(
      { error: 'Yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}

// DELETE — yuklangan faylni o'chirish
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    if (!ustozPaneliOchiqmi(session.user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { url } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'Manzil kerak' }, { status: 400 })
    }

    // FAQAT O'Z FAYLINI. Yo'lda ustoz id si bo'lgani uchun buni
    // manzilning o'zidan tekshira olamiz — aks holda manzilni bilgan
    // odam boshqa ustozning faylini o'chirib yuborardi.
    if (!url.includes(`/vazifa/${session.user.id}/`)) {
      return NextResponse.json({ error: 'Bu fayl sizga tegishli emas' }, { status: 403 })
    }

    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Vazifa fayl DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
