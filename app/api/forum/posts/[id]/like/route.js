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

    const mavjud = await prisma.forumLike.findUnique({
      where: { postId_userId: { postId: id, userId } },
    })

    if (mavjud) {
      await prisma.forumLike.delete({ where: { id: mavjud.id } })
    } else {
      await prisma.forumLike.create({ data: { postId: id, userId } })
    }

    const likes = await prisma.forumLike.count({ where: { postId: id } })

    return NextResponse.json({ success: true, liked: !mavjud, likes })
  } catch (error) {
    console.error('[Forum like]', error)
    return NextResponse.json({ error: 'Xatolik' }, { status: 500 })
  }
}
