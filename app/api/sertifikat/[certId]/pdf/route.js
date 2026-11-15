// app/api/sertifikat/[certId]/pdf/route.js
//
// OCHIQ endpoint: har qanday sertifikat (MS sinov, Hamkorlik, Klassik) uchun
// serverda vektorli PDF yaratib beradi.
// Bekor qilingan yoki muddati tugagan sertifikatlar ham hujjat ichida tegishli
// tamg'a ("BEKOR QILINGAN" / "MUDDATI TUGAGAN") bilan qaytariladi — xuddi
// brauzerdagi yuklab olish va tekshiruv sahifasi bilan bir xil qoida.

import { NextResponse } from 'next/server'
import { sertifikatniTekshir } from '@/lib/sertifikat'
import {
  generatsiyaSertifikatPDFBaytlar,
  sertifikatFaylNomi,
} from '@/lib/sertifikat-pdf-universal'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  try {
    const { certId } = await params
    if (!certId) {
      return NextResponse.json({ error: 'Sertifikat raqami kerak' }, { status: 400 })
    }

    const natija = await sertifikatniTekshir(certId)
    if (!natija?.certificate) {
      return NextResponse.json(
        { error: 'Bunday raqamli sertifikat topilmadi' },
        { status: 404 }
      )
    }

    const pdfBaytlar = await generatsiyaSertifikatPDFBaytlar(natija.certificate)
    const faylNomi = sertifikatFaylNomi(natija.certificate.certId)
    const inline = new URL(request.url).searchParams.get('inline') === '1'

    return new Response(Buffer.from(pdfBaytlar), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${faylNomi}"`,
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('[Sertifikat PDF GET]', error)
    return NextResponse.json(
      { error: 'Sertifikat PDF yaratishda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}
