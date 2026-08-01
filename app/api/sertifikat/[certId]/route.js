// app/api/sertifikat/[certId]/route.js
//
// Sertifikatni tekshirish — OCHIQ endpoint, sessiya talab qilmaydi.
// Sertifikatni qo'lida ushlab turgan har kim uning haqiqiyligini tekshira
// olishi kerak.
//
// Mantiqning o'zi lib/sertifikat.js da: shu endpoint va QR kod olib keladigan
// /sertifikat/verify sahifasi bir xil javob berishi shart.
import { NextResponse } from 'next/server'
import { sertifikatniTekshir } from '@/lib/sertifikat'

export async function GET(request, { params }) {
  try {
    const { certId } = await params

    if (!certId) {
      return NextResponse.json({ error: 'Sertifikat raqami kerak' }, { status: 400 })
    }

    const natija = await sertifikatniTekshir(certId)

    if (!natija) {
      return NextResponse.json(
        { error: 'Bunday raqamli sertifikat topilmadi' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, ...natija })
  } catch (error) {
    console.error('[Sertifikat Verify GET]', error)
    return NextResponse.json(
      { error: 'Sertifikatni tekshirishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}
