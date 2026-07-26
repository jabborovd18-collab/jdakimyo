// app/api/forum/posts/[id]/route.js
// Bitta mavzu va uning javoblari. O'chirish ham shu yerda.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { POST_SELECT, laykBosilganlar, postniTayyorla } from '@/lib/forum'
import { isAdminRole } from '@/lib/roles'

// ─── GET: mavzu + javoblari ───
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null
    const { id } = await params

    const post = await prisma.forumPost.findUnique({
      where: { id },
      select: { ...POST_SELECT, status: true, authorId: true },
    })

    if (!post) return NextResponse.json({ error: 'Mavzu topilmadi' }, { status: 404 })

    // Tasdiqlanmagan postni faqat muallif va admin ko'radi
    const korishMumkin =
      post.status === 'approved' ||
      post.authorId === userId ||
      (session?.user && isAdminRole(session.user.role))

    if (!korishMumkin) {
      return NextResponse.json({ error: 'Bu mavzu hali tasdiqlanmagan' }, { status: 403 })
    }

    const replies = await prisma.forumPost.findMany({
      where: {
        parentId: id,
        OR: userId
          ? [{ status: 'approved' }, { authorId: userId, status: 'pending' }]
          : [{ status: 'approved' }],
      },
      orderBy: { createdAt: 'asc' },
      select: { ...POST_SELECT, status: true },
    })

    const laykSet = await laykBosilganlar(userId, [post.id, ...replies.map((r) => r.id)])
    const { authorId, ...postPublic } = post

    return NextResponse.json({
      success: true,
      post: postniTayyorla(postPublic, laykSet),
      replies: replies.map((r) => postniTayyorla(r, laykSet)),
      signedIn: Boolean(userId),
    })
  } catch (error) {
    console.error('[Forum post GET]', error)
    return NextResponse.json({ error: 'Yuklashda xatolik' }, { status: 500 })
  }
}

// ─── DELETE: muallif yoki admin o'chiradi ───
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const post = await prisma.forumPost.findUnique({
      where: { id },
      select: { authorId: true },
    })
    if (!post) return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })

    const ozi = post.authorId === session.user.id
    const admin = isAdminRole(session.user.role)
    if (!ozi && !admin) {
      return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
    }

    // Javoblar onDelete: Cascade orqali o'zi o'chadi
    await prisma.forumPost.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Forum post DELETE]', error)
    return NextResponse.json({ error: 'O\'chirishda xatolik' }, { status: 500 })
  }
}
