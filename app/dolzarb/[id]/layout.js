import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }) {
  try {
    const { id } = await params
    const post = await prisma.forumPost.findUnique({
      where: { id },
      select: { title: true, content: true, status: true },
    })

    if (!post || post.status !== 'approved') {
      return {
        title: 'Muhokama — Dolzarb mavzular | JDA Kimyo',
        alternates: { canonical: `/dolzarb/${encodeURIComponent(id)}` },
      }
    }

    const sarlavha = (post.title || post.content.slice(0, 60)).trim()
    const tavsif = post.content.replace(/\s+/g, ' ').trim().slice(0, 155)

    return {
      title: `${sarlavha} — Dolzarb mavzular | JDA Kimyo`,
      description: tavsif,
      alternates: { canonical: `/dolzarb/${encodeURIComponent(id)}` },
      openGraph: {
        title: sarlavha,
        description: tavsif,
      },
    }
  } catch {
    return {
      title: 'Dolzarb mavzular | JDA Kimyo',
      alternates: { canonical: `/dolzarb/${encodeURIComponent(id)}` },
    }
  }
}

export default function MavzuLayout({ children }) {
  return children
}
