import { MILLIY_SERTIFIKAT_VARIANTLARI } from "@/lib/milliy-sertifikat-data"

export async function generateMetadata({ params }) {
  const { slug } = await params
  const variant = MILLIY_SERTIFIKAT_VARIANTLARI.find((v) => v.slug === slug)
  const canonical = `/milliy-sertifikat/${encodeURIComponent(slug)}`

  if (!variant) {
    return {
      title: "Milliy Sertifikat sinovi",
      description:
        "Kimyo fanidan Rasch modeli asosidagi Milliy Sertifikat tayyorgarlik sinovi va natija tahlili.",
      alternates: { canonical },
    }
  }

  return {
    title: variant.nom,
    description: variant.tavsif || variant.qisqa,
    alternates: { canonical },
  }
}

export default function MilliySertifikatVariantLayout({ children }) {
  return children
}
