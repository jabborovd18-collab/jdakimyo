// app/milliy-sertifikat/tekshir/[id]/page.js
//
// Oldin tarqatilgan MS QR kodlari shu yo'lga olib keladi. Yagona V4 Safir
// SertifikatTekshiruvKorinish komponentini serverda darhol ko'rsatadi.
import { sertifikatniTekshir } from '@/lib/sertifikat'
import SertifikatTekshiruvKorinish from '@/components/SertifikatTekshiruvKorinish'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { id } = await params
  const natija = await sertifikatniTekshir(id)

  if (!natija) {
    return { title: 'Sertifikat topilmadi — JDA KIMYO' }
  }

  return {
    title: `${natija.certificate.fullName} — sertifikat ${natija.certificate.certId}`,
    description: `${natija.certificate.fan} — ${natija.certificate.reason}`,
  }
}

export default async function MilliySertifikatTekshirishSahifasi({ params }) {
  const { id } = await params
  const natija = await sertifikatniTekshir(id)

  return <SertifikatTekshiruvKorinish natija={natija} qidiruvId={id} />
}
