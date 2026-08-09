import { notFound } from 'next/navigation'
import { fanTop, ochiqFanlar } from '@/lib/fanlar'
import Korinish from './korinish'

/**
 * FAN SAHIFASI — v3.0.0
 *
 * Bu sahifa mavjud bo'limlar USTIDAGI qobiq: `/oquv` va `/ilmiy` daraxti
 * o'z joyida qoladi. Sabab SEO: o'sha daraxtdagi 117 sahifaga alohida
 * sarlavha berilgan va sitemapda 125 manzil turibdi — papkani ko'chirish
 * o'sha ishning hammasini bekor qilardi.
 *
 * FAQAT OCHIQ FANLARGA MARSHRUT BOR. Yopiq fan uchun `notFound()` —
 * "tez orada" sahifasi ataylab yaratilmadi: mazmuni yo'q sahifa
 * indeksga tushsa, saytdagi bo'sh hujjatlar sonini oshiradi va bosh
 * sahifadagi qulf allaqachon shu xabarni beradi.
 */

// Ro'yxatda yo'q slug — 404. Yopiq fan manzilini qo'lda yozib kirish
// yo'lini shu yopadi.
export const dynamicParams = false

export function generateStaticParams() {
  return ochiqFanlar().map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const fan = fanTop(slug)
  if (!fan || fan.holat !== 'ochiq') return {}

  return {
    title: `${fan.nom} — ${fan.qisqa}`,
    description: fan.kirish,
    alternates: { canonical: `/fan/${fan.slug}` },
    openGraph: {
      title: `${fan.nom} | JDA KIMYO`,
      description: fan.kirish,
      url: `https://www.jdakimyo.uz/fan/${fan.slug}`,
    },
  }
}

export default async function FanSahifa({ params }) {
  const { slug } = await params
  const fan = fanTop(slug)
  if (!fan || fan.holat !== 'ochiq') notFound()

  return <Korinish fan={fan} />
}
