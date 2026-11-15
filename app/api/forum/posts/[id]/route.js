// app/api/forum/posts/[id]/route.js
// Bitta mavzu va uning javoblari. O'chirish ham shu yerda.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  POST_SELECT, POST_MAX, TITLE_MAX,
  cleanText, laykBosilganlar, postniTayyorla, taqiqXabari,
} from '@/lib/forum'
import { isAdminRole } from '@/lib/roles'

// ─── GET: mavzu + javoblari ───
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null
    const { id } = await params

    const post = await prisma.forumPost.findUnique({
      where: { id },
      select: { ...POST_SELECT, status: true, authorId: true, rejectReason: true },
    })

    if (!post) return NextResponse.json({ error: 'Mavzu topilmadi' }, { status: 404 })

    // Tasdiqlanmagan postni faqat muallif va admin ko'radi
    const korishMumkin =
      post.status === 'approved' ||
      Boolean(userId && post.authorId === userId) ||
      Boolean(session?.user && isAdminRole(session.user.role))

    if (!korishMumkin) {
      return NextResponse.json({ error: 'Bu mavzu hali tasdiqlanmagan' }, { status: 403 })
    }

    const replies = await prisma.forumPost.findMany({
      where: {
        parentId: id,
        OR: userId
          ? [{ status: 'approved' }, { authorId: userId, status: { in: ['pending', 'rejected'] } }]
          : [{ status: 'approved' }],
      },
      orderBy: { createdAt: 'asc' },
      select: { ...POST_SELECT, status: true, authorId: true, rejectReason: true },
    })

    const laykSet = await laykBosilganlar(userId, [post.id, ...replies.map((r) => r.id)])

    return NextResponse.json({
      success: true,
      post: postniTayyorla(post, laykSet, userId),
      replies: replies.map((r) => postniTayyorla(r, laykSet, userId)),
      signedIn: Boolean(userId),
    })
  } catch (error) {
    console.error('[Forum post GET]', error)
    return NextResponse.json({ error: 'Yuklashda xatolik' }, { status: 500 })
  }
}

// ─── PATCH: muallif yoki admin post/javobni tahrirlaydi ───
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const post = await prisma.forumPost.findUnique({
      where: { id },
      select: { id: true, authorId: true, parentId: true, articleId: true, status: true },
    })
    if (!post) return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })

    const ozi = post.authorId === session.user.id
    const admin = isAdminRole(session.user.role)
    if (!ozi && !admin) {
      return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })
    }

    if (!admin) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isBanned: true, chatBlockedUntil: true, chatBlockedReason: true },
      })
      const taqiq = taqiqXabari(user)
      if (taqiq) return NextResponse.json({ error: taqiq }, { status: 403 })
    }

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Noto\'g\'ri so\'rov' }, { status: 400 })

    const matn = cleanText(body.content, { max: POST_MAX, min: 2, label: 'Matn' })
    if (!matn.ok) return NextResponse.json({ error: matn.error }, { status: 400 })

    let titleUpdate
    if (!post.parentId && !post.articleId) {
      const sarlavha = cleanText(body.title, { max: TITLE_MAX, min: 5, label: 'Sarlavha' })
      if (!sarlavha.ok) return NextResponse.json({ error: sarlavha.error }, { status: 400 })
      titleUpdate = sarlavha.value
    } else if (!post.parentId && body.title !== undefined) {
      if (body.title) {
        const sarlavha = cleanText(body.title, { max: TITLE_MAX, min: 5, label: 'Sarlavha' })
        if (!sarlavha.ok) return NextResponse.json({ error: sarlavha.error }, { status: 400 })
        titleUpdate = sarlavha.value
      } else {
        titleUpdate = null
      }
    }

    // Oddiy muallif tahrirlasa, moderatsiyadan chetlab o'tishning oldini olish uchun
    // post qayta tekshiruvga tushadi.
    const data = {
      content: matn.value,
      ...(titleUpdate !== undefined ? { title: titleUpdate } : {}),
      ...(admin
        ? {}
        : {
            status: 'pending',
            rejectReason: null,
            moderatedById: null,
            moderatedAt: null,
            isPinned: false,
          }),
    }

    const updated = await prisma.forumPost.update({
      where: { id },
      data,
      select: { ...POST_SELECT, status: true, authorId: true, rejectReason: true },
    })

    const laykSet = await laykBosilganlar(session.user.id, [id])

    return NextResponse.json({
      success: true,
      post: postniTayyorla(updated, laykSet, session.user.id),
      message: admin
        ? 'Yangilandi'
        : 'Tahrir saqlandi. Admin tasdiqlagandan keyin barchaga ko\'rinadi.',
    })
  } catch (error) {
    console.error('[Forum post PATCH]', error)
    return NextResponse.json({ error: 'Tahrirlashda xatolik' }, { status: 500 })
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
