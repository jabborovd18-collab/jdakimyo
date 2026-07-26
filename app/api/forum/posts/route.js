// app/api/forum/posts/route.js
//
// Muhokama postlari: o'qish (GET) va yozish (POST).
//
// Postlar admin tasdiqlagandan keyingina ko'rinadi — POST yaratganda
// status "pending" bo'ladi. Muallif o'z kutayotgan postini ko'ra oladi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  POST_SELECT, POST_MAX, TITLE_MAX,
  cleanText, tezlikChekloviOshdimi, laykBosilganlar, postniTayyorla,
} from '@/lib/forum'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

// "Dolzarb" va "Ommabop" tartiblari layklar bilan javoblar yig'indisiga
// tayanadi, Prisma esa ikki sanoqning yig'indisi bo'yicha tartiblay olmaydi.
// Shuning uchun bu ikki tartib eng yangi shu qadar mavzu ichida hisoblanadi.
// "Yangi" tartibi esa bazada tartiblanadi — to'liq tarix bo'yicha.
const BALL_OYNASI = 200

const BALLI_TARTIBLAR = ['dolzarb', 'ommabop']

/**
 * Mavzu og'irligi va "dolzarblik" bali.
 *
 *   ball = (1 + layklar + 2 × javoblar) / (soat + 2)^1.5
 *
 * Javobga ikki barobar vazn: muhokamada javob laykdan kuchliroq signal.
 *
 * Boshdagi 1 — yangi mavzu hali hech kim javob bermaganda ham tepada
 * ko'rinishi uchun. Aks holda u pastda qolib ketadi va shu sababli hech
 * qachon javob olmaydi.
 *
 * Bo'luvchi mavzuni vaqt o'tishi bilan pastga tushiradi: "ommabop" uchun
 * susayish qo'llanmaydi — u butun tarix bo'yicha eng og'irini ko'rsatadi.
 */
function ball(p, susayish) {
  const ogirlik = 1 + p._count.likes + 2 * p._count.replies
  if (!susayish) return ogirlik

  const soat = (Date.now() - new Date(p.createdAt).getTime()) / 3_600_000
  return ogirlik / Math.pow(soat + 2, 1.5)
}

// ─── GET: mavzular ro'yxati ───
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null

    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('articleId') // null bo'lsa — umumiy lenta

    // Umumiy lentada standart tartib "dolzarb". Maqola ostidagi muhokama
    // xronologik o'qiladi, shuning uchun u yerda "yangi".
    const sortParam = searchParams.get('sort')
    const sort = sortParam || (articleId ? 'yangi' : 'dolzarb')

    const requested = parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10)
    const limit = Math.min(Math.max(Number.isFinite(requested) ? requested : DEFAULT_LIMIT, 1), MAX_LIMIT)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0)

    // Faqat tasdiqlangan asosiy mavzular (javoblar alohida olinadi).
    // Muallif o'zining kutayotgan postini ham ko'radi.
    const where = {
      parentId: null,
      articleId: articleId || null,
      OR: userId
        ? [{ status: 'approved' }, { authorId: userId, status: 'pending' }]
        : [{ status: 'approved' }],
    }

    const select = { ...POST_SELECT, status: true }

    let total
    let rows

    if (BALLI_TARTIBLAR.includes(sort)) {
      // Oynani olib, ballab, JS'da tartiblaymiz va so'ng bo'lamiz.
      const oyna = await prisma.forumPost.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        take: BALL_OYNASI,
        select,
      })

      const susayish = sort === 'dolzarb'
      oyna.sort(
        (a, b) =>
          Number(b.isPinned) - Number(a.isPinned) ||
          ball(b, susayish) - ball(a, susayish)
      )

      total = oyna.length
      rows = oyna.slice(offset, offset + limit)
    } else {
      // "Yangi": tartiblash ham, sahifalash ham bazada.
      const [soni, sahifa] = await Promise.all([
        prisma.forumPost.count({ where }),
        prisma.forumPost.findMany({
          where,
          orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
          skip: offset,
          take: limit,
          select,
        }),
      ])
      total = soni
      rows = sahifa
    }

    const laykSet = await laykBosilganlar(userId, rows.map((r) => r.id))

    return NextResponse.json({
      success: true,
      sort,
      total,
      hasMore: offset + rows.length < total,
      posts: rows.map((p) => postniTayyorla(p, laykSet)),
      signedIn: Boolean(userId),
    })
  } catch (error) {
    console.error('[Forum GET]', error)
    return NextResponse.json({ error: 'Muhokamani yuklashda xatolik' }, { status: 500 })
  }
}

// ─── POST: yangi mavzu yoki javob ───
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yozish uchun tizimga kiring' }, { status: 401 })
    }

    // Bloklangan foydalanuvchi yoza olmasligi kerak
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isBanned: true },
    })
    if (!user || user.isBanned) {
      return NextResponse.json({ error: 'Hisobingiz bloklangan' }, { status: 403 })
    }

    const tezlik = await tezlikChekloviOshdimi(session.user.id)
    if (tezlik) return NextResponse.json({ error: tezlik }, { status: 429 })

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Noto\'g\'ri so\'rov' }, { status: 400 })

    const matn = cleanText(body.content, { max: POST_MAX, min: 2, label: 'Matn' })
    if (!matn.ok) return NextResponse.json({ error: matn.error }, { status: 400 })

    // Javobmi yoki yangi mavzumi?
    let parentId = null
    let articleId = body.articleId ? String(body.articleId) : null
    let title = null

    if (body.parentId) {
      const parent = await prisma.forumPost.findUnique({
        where: { id: String(body.parentId) },
        select: { id: true, articleId: true, status: true, parentId: true },
      })
      if (!parent) return NextResponse.json({ error: 'Mavzu topilmadi' }, { status: 404 })
      if (parent.status !== 'approved') {
        return NextResponse.json({ error: 'Bu mavzu hali tasdiqlanmagan' }, { status: 400 })
      }
      // Javobga javob ham asosiy mavzuga biriktiriladi (bir daraja)
      parentId = parent.parentId || parent.id
      articleId = parent.articleId
    } else {
      // Yangi mavzu — umumiy lentada sarlavha majburiy
      if (!articleId) {
        const sarlavha = cleanText(body.title, { max: TITLE_MAX, min: 5, label: 'Sarlavha' })
        if (!sarlavha.ok) return NextResponse.json({ error: sarlavha.error }, { status: 400 })
        title = sarlavha.value
      } else if (body.title) {
        const sarlavha = cleanText(body.title, { max: TITLE_MAX, min: 5, label: 'Sarlavha' })
        if (sarlavha.ok) title = sarlavha.value
      }
    }

    const post = await prisma.forumPost.create({
      data: {
        authorId: session.user.id,
        articleId,
        parentId,
        title,
        content: matn.value,
        status: 'pending',
      },
      select: { ...POST_SELECT, status: true },
    })

    return NextResponse.json({
      success: true,
      post: postniTayyorla(post, new Set()),
      message: 'Yuborildi. Admin tasdiqlagandan keyin barchaga ko\'rinadi.',
    })
  } catch (error) {
    console.error('[Forum POST]', error)
    return NextResponse.json({ error: 'Yuborishda xatolik' }, { status: 500 })
  }
}
