import { notFound } from "next/navigation"
import { mavzuTop, YETTI_SINF_MAVZULARI, SAKKIZ_SINF_MAVZULARI } from "@/lib/fanlar"
import MavzuKorinish from "./korinish"

export function generateStaticParams() {
  return [
    ...YETTI_SINF_MAVZULARI.map((m) => ({
      sinf: "7sinf",
      mavzu: m.slug,
    })),
    ...SAKKIZ_SINF_MAVZULARI.map((m) => ({
      sinf: "8sinf",
      mavzu: m.slug,
    })),
  ]
}

export async function generateMetadata({ params }) {
  const { sinf: sinfParam, mavzu: mavzuParam } = await params
  const malumot = mavzuTop(sinfParam, mavzuParam)
  if (!malumot) return {}

  const { sinf, mavzu, bob } = malumot
  return {
    title: `${mavzu.raqam}. ${mavzu.nom} — ${sinf.nom}`,
    description: `${bob ? `${bob.bob}-bob: ${bob.nom}. ` : ""}${sinf.sinf}-sinf kimyo fani davlat ta'lim standarti darsligi (${mavzu.sahifa}-bet).`,
    alternates: { canonical: `/maktabkimyo/${sinf.sinf}sinf/${mavzu.slug}` },
    openGraph: {
      title: `${mavzu.raqam}. ${mavzu.nom} | JDA KIMYO`,
      description: `${sinf.nom} — ${mavzu.nom} (${mavzu.sahifa}-bet).`,
      url: `https://www.jdakimyo.uz/maktabkimyo/${sinf.sinf}sinf/${mavzu.slug}`,
    },
  }
}

export default async function MavzuSahifa({ params }) {
  const { sinf: sinfParam, mavzu: mavzuParam } = await params
  const malumot = mavzuTop(sinfParam, mavzuParam)
  if (!malumot) notFound()

  return <MavzuKorinish {...malumot} />
}
