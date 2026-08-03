// app/api/admin/forum/route.js
// Muhokama postlarini moderatsiya qilish: navbat, tasdiqlash, rad etish.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { huquqiBormi } from '@/lib/roles'
import { qaydEt } from '@/lib/qaydnoma'

async function adminTekshir() {
  const session = await getServerSession(authOptions)
  if (!session?.user || !huquqiBormi(session.user.role, 'moderatsiya')) return null
  return session.user
}

// ─── GET: moderatsiya navbati ───
export async function GET(request) {
  const admin = await adminTekshir()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'

    const where = status === 'all' ? {} : { status }

    const [posts, hisob] = await Promise.all([
      prisma.forumPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
          id: true,
          articleId: true,
          title: true,
          content: true,
          parentId: true,
          status: true,
          rejectReason: true,
          isPinned: true,
          createdAt: true,
          author: {
            select: { id: true, username: true, fullName: true, avatar: true, role: true },
          },
          parent: { select: { id: true, title: true } },
        },
      }),
      prisma.forumPost.groupBy({ by: ['status'], _count: { _all: true } }),
    ])

    const stats = Object.fromEntries(hisob.map((r) => [r.status, r._count._all]))

    return NextResponse.json({
      success: true,
      posts,
      stats: {
        pending: stats.pending || 0,
        approved: stats.approved || 0,
        rejected: stats.rejected || 0,
      },
    })
  } catch (error) {
    console.error('[Admin forum GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── PUT: tasdiqlash / rad etish / qadash ───
export async function PUT(request) {
  const admin = await adminTekshir()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    const { id, action } = body

    if (!id || !action) {
      return NextResponse.json({ error: 'id va action majburiy' }, { status: 400 })
    }

    const post = await prisma.forumPost.findUnique({ where: { id }, select: { id: true, isPinned: true } })
    if (!post) return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })

    let data
    let xabar

    switch (action) {
      case 'approve':
        data = {
          status: 'approved',
          moderatedById: admin.id,
          moderatedAt: new Date(),
          rejectReason: null,
        }
        xabar = '✓ Tasdiqlandi'
        break

      case 'reject':
        data = {
          status: 'rejected',
          moderatedById: admin.id,
          moderatedAt: new Date(),
          rejectReason: (body.reason || '').trim() || null,
        }
        xabar = '✓ Rad etildi'
        break

      case 'pin':
        data = { isPinned: !post.isPinned }
        xabar = post.isPinned ? '✓ Qadash olib tashlandi' : '✓ Yuqoriga qadaldi'
        break

      default:
        return NextResponse.json({ error: 'Noma\'lum amal' }, { status: 400 })
    }

    const updated = await prisma.forumPost.update({ where: { id }, data })

    await qaydEt({
      adminId: admin.id,
      action: `forum:${action}`,
      targetType: 'ForumPost',
      targetId: id,
      details: body.reason || null,
      request,
    })

    return NextResponse.json({ success: true, post: updated, message: xabar })
  } catch (error) {
    console.error('[Admin forum PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── DELETE ───
export async function DELETE(request) {
  const admin = await adminTekshir()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id majburiy' }, { status: 400 })

    // Nima o'chirilgani qaydnomada qolishi kerak: izohni o'chirish
    // qaytarib bo'lmaydigan amal va "nega o'chirilgan" degan savol
    // keyinroq berilishi mumkin
    const oldingi = await prisma.forumPost.findUnique({
      where: { id },
      select: { content: true, authorId: true },
    })

    await prisma.forumPost.delete({ where: { id } })

    await qaydEt({
      adminId: admin.id,
      action: 'deleteForumPost',
      targetType: 'ForumPost',
      targetId: id,
      details: oldingi ? String(oldingi.content).slice(0, 200) : null,
      request,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Admin forum DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
