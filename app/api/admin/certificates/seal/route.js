// app/api/admin/certificates/seal/route.js
//
// Sertifikat pechati (muhr) rasmini yuklaydi va URL qaytaradi.
//
// Avatar yuklovchidan alohida: u rasmni darhol User.avatar ga yozadi, bu yerda
// esa rasm hech qanday yozuvga bog'lanmaydi — admin uni formada bir necha
// pechat orasidan tanlaydi va sertifikat saqlanganda seals ichiga tushadi.
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { checkAdminAuth } from '@/lib/admin-auth'

export async function POST(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'Rasm topilmadi' }, { status: 400 })
    }

    // FAQAT PNG va JPEG.
    //
    // Sabab texnik: pechat sertifikat PDF'iga joylanadi, pdf-lib esa boshqa
    // formatni umuman bilmaydi. WebP yoki SVG qabul qilinsa, pechat saytda
    // ko'rinib, PDF'da jimgina yo'qolardi — eng yomon xato turi.
    // Shaffof fon uchun PNG ishlating.
    const ruxsatEtilgan = ['image/png', 'image/jpeg']
    if (!ruxsatEtilgan.includes(file.type)) {
      return NextResponse.json(
        { error: 'Faqat PNG yoki JPEG. Pechat PDF ichiga joylanadi, boshqa format qo\'llab-quvvatlanmaydi.' },
        { status: 400 }
      )
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Pechat hajmi 2MB dan oshmasligi kerak' },
        { status: 400 }
      )
    }

    const kengaytma = file.name.split('.').pop()
    const blob = await put(`sertifikat-muhrlari/${Date.now()}.${kengaytma}`, file, {
      access: 'public',
    })

    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
    console.error('[Certificate Seal Upload]', error)
    return NextResponse.json(
      { error: 'Pechat yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}
