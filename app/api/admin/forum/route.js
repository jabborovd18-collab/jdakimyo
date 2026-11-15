// app/api/admin/forum/route.js
// Muhokama postlarini moderatsiya qilish: navbat, tasdiqlash, rad etish.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'
import { qaydEt } from '@/lib/qaydnoma'
import { xabarYubor } from '@/lib/bildirishnoma'

async function adminTekshir() {
  const { isAdmin, user } = await checkAdminAuth('moderatsiya')
  return isAdmin && user ? user : null
}

// ─── GET: moderatsiya navbati ───
export async function GET(request) {
  const admin = await adminTekshir()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const q = String(searchParams.get('q') || '').trim().slice(0, 100)
    const sahifa = Math.max(parseInt(searchParams.get('page') || '1', 10) || 1, 1)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '25', 10) || 25, 1), 50)
    const skip = (sahifa - 1) * limit

    const where = {
      ...(status === 'all' ? {} : { status }),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { content: { contains: q, mode: 'insensitive' } },
              { author: { username: { contains: q, mode: 'insensitive' } } },
              { author: { fullName: { contains: q, mode: 'insensitive' } } },
            ],
          }
        : {}),
    }

    const [posts, jami, hisob] = await Promise.all([
      prisma.forumPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
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
      prisma.forumPost.count({ where }),
      prisma.forumPost.groupBy({ by: ['status'], _count: { _all: true } }),
    ])

    const stats = Object.fromEntries(hisob.map((r) => [r.status, r._count._all]))

    return NextResponse.json({
      success: true,
      posts,
      jami,
      sahifa,
      sahifalar: Math.max(1, Math.ceil(jami / limit)),
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

    const post = await prisma.forumPost.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        isPinned: true,
        parentId: true,
        authorId: true,
        title: true,
      },
    })
    if (!post) return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })

    let data
    let xabar
    const sababMatni = (body.reason || '').trim().slice(0, 500) || null

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
          rejectReason: sababMatni,
          isPinned: false,
        }
        xabar = '✓ Rad etildi'
        break

      case 'pin':
        if (post.parentId) {
          return NextResponse.json(
            { error: 'Javobni yuqoriga qadab bo\'lmaydi — faqat asosiy mavzu qadaladi' },
            { status: 400 }
          )
        }
        if (!post.isPinned && post.status !== 'approved') {
          return NextResponse.json(
            { error: 'Faqat tasdiqlangan mavzuni yuqoriga qadash mumkin' },
            { status: 400 }
          )
        }
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
      details: sababMatni,
      request,
    })

    // Muallif postining taqdirini bilsin (ayniqsa rad etish sababini).
    if (action === 'approve' || action === 'reject') {
      const mavzuId = post.parentId || post.id
      if (action === 'approve') {
        await xabarYubor(post.authorId, {
          turi: 'tizim',
          icon: '✅',
          sarlavha: post.parentId ? 'Muhokamadagi javobingiz tasdiqlandi' : 'Mavzuingiz tasdiqlandi',
          matn: post.title
            ? `"${post.title}" endi Dolzarb mavzularda ko'rinadi.`
            : 'Fikringiz endi barcha ishtirokchilarga ko\'rinadi.',
          havola: `/dolzarb/${mavzuId}`,
          adminId: admin.id,
        })
      } else {
        await xabarYubor(post.authorId, {
          turi: 'tizim',
          icon: '⚠️',
          sarlavha: post.parentId ? 'Muhokamadagi javobingiz rad etildi' : 'Mavzuingiz rad etildi',
          matn: sababMatni
            ? `Sabab: ${sababMatni}`
            : 'Post moderator tekshiruvidan o\'tmadi. Uni tahrirlab qayta yuborishingiz mumkin.',
          havola: post.parentId ? `/dolzarb/${mavzuId}` : '/dolzarb',
          adminId: admin.id,
        })
      }
    }

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
