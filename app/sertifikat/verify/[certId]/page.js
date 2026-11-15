// app/sertifikat/verify/[certId]/page.js
//
// QR kod aynan shu canonical sahifaga olib keladi. Server komponenti:
// ma'lumot sahifa bilan birga keladi, telefonda skanerlashda darhol ko'rinadi.
import { sertifikatniTekshir } from '@/lib/sertifikat'
import SertifikatTekshiruvKorinish from '@/components/SertifikatTekshiruvKorinish'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { certId } = await params
  const natija = await sertifikatniTekshir(certId)

  if (!natija) {
    return { title: 'Sertifikat topilmadi — JDA KIMYO' }
  }

  return {
    title: `${natija.certificate.fullName} — sertifikat ${natija.certificate.certId}`,
    description: `${natija.certificate.fan} — ${natija.certificate.reason}`,
  }
}

export default async function SertifikatVerify({ params }) {
  const { certId } = await params
  const natija = await sertifikatniTekshir(certId)

  return <SertifikatTekshiruvKorinish natija={natija} qidiruvId={certId} />
}
