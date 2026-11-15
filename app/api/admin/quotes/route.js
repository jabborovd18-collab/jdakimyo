// app/api/admin/quotes/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'
import { qaydEt } from '@/lib/qaydnoma'

// GET - Barcha gaplarni olish
export async function GET(request) {
  try {
    const { isAdmin } = await checkAdminAuth('kontent')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''

    const where = {}
    if (category && category !== 'all') where.category = category
    if (search) {
      where.OR = [
        { textUz: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ]
    }

    const quotes = await prisma.dailyQuote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const stats = await prisma.dailyQuote.groupBy({
      by: ['category'],
      _count: true,
    })

    return NextResponse.json({
      success: true,
      quotes,
      stats: stats.reduce((acc, s) => {
        acc[s.category] = s._count
        return acc
      }, {}),
      total: quotes.length,
    })
  } catch (error) {
    console.error('[Admin Quotes GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Yangi gap qo'shish
export async function POST(request) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth('kontent')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.textUz?.trim() || !data.author?.trim()) {
      return NextResponse.json(
        { error: 'Gap va muallif majburiy' },
        { status: 400 }
      )
    }

    const quote = await prisma.dailyQuote.create({
      data: {
        textUz: data.textUz.trim(),
        textEn: data.textEn?.trim() || null,
        author: data.author.trim(),
        authorInfo: data.authorInfo?.trim() || null,
        category: data.category || 'motivation',
        tags: Array.isArray(data.tags) ? data.tags : [],
        icon: data.icon || '💡',
        color: data.color || 'purple',
        isActive: data.isActive !== false,
        displayDate: data.displayDate ? new Date(data.displayDate) : null,
      },
    })

    await qaydEt({
      adminId: admin.id,
      action: 'create_quote',
      targetType: 'DailyQuote',
      targetId: quote.id,
      details: `${quote.author}: ${quote.textUz.slice(0, 100)}`,
      request,
    })

    return NextResponse.json({
      success: true,
      quote,
      message: "Gap muvaffaqiyatli qo'shildi",
    })
  } catch (error) {
    console.error('[Admin Quotes POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Gapni tahrirlash
export async function PUT(request) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth('kontent')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const quote = await prisma.dailyQuote.update({
      where: { id: data.id },
      data: {
        textUz: data.textUz?.trim(),
        textEn: data.textEn?.trim() || null,
        author: data.author?.trim(),
        authorInfo: data.authorInfo?.trim() || null,
        category: data.category || 'motivation',
        tags: Array.isArray(data.tags) ? data.tags : [],
        icon: data.icon || '💡',
        color: data.color || 'purple',
        isActive: Boolean(data.isActive),
        displayDate: data.displayDate ? new Date(data.displayDate) : null,
      },
    })

    await qaydEt({
      adminId: admin.id,
      action: 'update_quote',
      targetType: 'DailyQuote',
      targetId: quote.id,
      details: `${quote.author}: ${quote.textUz.slice(0, 100)}`,
      request,
    })

    return NextResponse.json({
      success: true,
      quote,
      message: 'Gap yangilandi',
    })
  } catch (error) {
    console.error('[Admin Quotes PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Gapni o'chirish
export async function DELETE(request) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth('kontent')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const ochirilgan = await prisma.dailyQuote.delete({ where: { id } })
    await qaydEt({
      adminId: admin.id,
      action: 'delete_quote',
      targetType: 'DailyQuote',
      targetId: id,
      details: ochirilgan.author,
      request,
    })

    return NextResponse.json({
      success: true,
      message: "Gap o'chirildi",
    })
  } catch (error) {
    console.error('[Admin Quotes DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
