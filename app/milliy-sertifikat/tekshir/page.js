// app/milliy-sertifikat/tekshir/page.js
//
// Milliy Sertifikat sinovi sertifikatlarini qidirish va tekshirish sahifasi.
import SertifikatQidiruvPortal from '@/components/SertifikatQidiruvPortal'

export const metadata = {
  title: 'Milliy Sertifikat tekshiruvi — JDA KIMYO',
  description:
    'JDA KIMYO Milliy Sertifikat tayyorlik sinovlari natija sertifikatini ID raqami orqali rasmiy tekshirish.',
  alternates: { canonical: '/milliy-sertifikat/tekshir' },
}

export default function MilliySertifikatTekshirPortali() {
  return (
    <SertifikatQidiruvPortal
      qaytishHref="/milliy-sertifikat"
      qaytishMatn="Milliy sertifikat markazi"
      msFokus
    />
  )
}
