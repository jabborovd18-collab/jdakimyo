import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const canonical = `/kanallar/${encodeURIComponent(slug)}`

  try {
    const kanal = await prisma.channel.findUnique({
      where: { slug },
      select: { nom: true, tavsif: true, ochiq: true, faol: true },
    })

    if (!kanal || !kanal.faol) {
      return {
        title: 'Kanal topilmadi — Kanallar',
        alternates: { canonical },
        robots: { index: false, follow: false },
      }
    }

    const tavsif = (kanal.tavsif || `${kanal.nom} — JDA KIMYO ta'lim kanali.`)
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 155)

    return {
      title: `${kanal.nom} — Kanallar`,
      description: tavsif,
      alternates: { canonical },
      ...(kanal.ochiq === false ? { robots: { index: false, follow: true } } : {}),
      openGraph: {
        title: `${kanal.nom} | JDA KIMYO`,
        description: tavsif,
      },
    }
  } catch {
    return {
      title: 'Kimyo kanali',
      alternates: { canonical },
    }
  }
}

export default function KanalSahifaLayout({ children }) {
  return children
}
