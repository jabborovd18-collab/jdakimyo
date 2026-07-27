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
  cleanText, tezlikChekloviOshdimi, postniTayyorla,
  royxatParametrlari, mavzularniOl,
} from '@/lib/forum'

// ─── GET: mavzular ro'yxati ───
//
// Ro'yxat mantiqi lib/forum.js da — mobil route (/api/mobile/forum) ham
// o'shani ishlatadi. Farqi faqat autentifikatsiyada: bu yerda cookie
// sessiyasi, mobil tomonda Bearer token.
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null

    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('articleId') // null bo'lsa — umumiy lenta
    const { sort, limit, offset } = royxatParametrlari(searchParams, { articleId })

    const natija = await mavzularniOl({ articleId, sort, limit, offset, userId })

    return NextResponse.json({ success: true, ...natija })
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
