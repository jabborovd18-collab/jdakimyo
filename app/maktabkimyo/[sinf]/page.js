import { notFound } from 'next/navigation'
import { sinfTop, MAKTAB_SINFLARI } from '@/lib/fanlar'
import SinfKorinish from './korinish'

export function generateStaticParams() {
  return MAKTAB_SINFLARI.map((s) => ({
    sinf: `${s.sinf}sinf`,
  }))
}

export async function generateMetadata({ params }) {
  const { sinf: sinfParam } = await params
  const sinf = sinfTop(sinfParam)
  if (!sinf) return {}

  return {
    title: `${sinf.nom} — ${sinf.qisqa}`,
    description: sinf.tavsif,
    alternates: { canonical: `/maktabkimyo/${sinf.sinf}sinf` },
    openGraph: {
      title: `${sinf.nom} | JDA KIMYO`,
      description: sinf.tavsif,
      url: `https://www.jdakimyo.uz/maktabkimyo/${sinf.sinf}sinf`,
    },
  }
}

export default async function SinfSahifa({ params }) {
  const { sinf: sinfParam } = await params
  const sinf = sinfTop(sinfParam)
  if (!sinf) notFound()

  return <SinfKorinish sinf={sinf} />
}
