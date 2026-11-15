// app/api/forum/posts/[id]/like/route.js
// Layk bosish / olib tashlash (toggle).
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Layk uchun tizimga kiring' }, { status: 401 })
    }

    const { id } = await params
    const userId = session.user.id

    const post = await prisma.forumPost.findUnique({
      where: { id },
      select: { id: true, status: true },
    })
    if (!post) return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })
    if (post.status !== 'approved') {
      return NextResponse.json({ error: 'Bu post hali tasdiqlanmagan' }, { status: 400 })
    }

    // Ikki marta tez bosilganda P2002 (500 xato) chiqmasligi uchun atomar almashtirish
    let liked = false
    const deleted = await prisma.forumLike.deleteMany({
      where: { postId: id, userId },
    })
    if (deleted.count === 0) {
      try {
        await prisma.forumLike.create({ data: { postId: id, userId } })
      } catch (e) {
        if (e?.code !== 'P2002') throw e
      }
      liked = true
    }

    const likes = await prisma.forumLike.count({ where: { postId: id } })

    return NextResponse.json({ success: true, liked, likes })
  } catch (error) {
    console.error('[Forum like]', error)
    return NextResponse.json({ error: 'Xatolik' }, { status: 500 })
  }
}
