// app/sertifikat/page.js
//
// Ommaviy sertifikat tekshiruv portali.
import SertifikatQidiruvPortal from '@/components/SertifikatQidiruvPortal'

export const metadata = {
  title: 'Sertifikatni tekshirish — JDA KIMYO',
  description:
    'JDA KIMYO platformasida berilgan Milliy Sertifikat, Olimpiada va hamkorlik sertifikatlarini raqam orqali rasmiy tekshirish.',
}

export default function SertifikatTekshirishPortali() {
  return <SertifikatQidiruvPortal />
}
