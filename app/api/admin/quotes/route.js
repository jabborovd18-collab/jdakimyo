// app/api/admin/quotes/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// GET - Barcha gaplarni olish
export async function GET(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''

    const where = {}
    if (category && category !== 'all') where.category = category
    if (search) {
      where.OR = [
        { textUz: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } }
      ]
    }

    const quotes = await prisma.dailyQuote.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    // Statistika
    const stats = await prisma.dailyQuote.groupBy({
      by: ['category'],
      _count: true
    })

    return NextResponse.json({
      success: true,
      quotes,
      stats: stats.reduce((acc, s) => {
        acc[s.category] = s._count
        return acc
      }, {}),
      total: quotes.length
    })
  } catch (error) {
    console.error('[Admin Quotes GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Yangi gap qo'shish
export async function POST(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.textUz || !data.author) {
      return NextResponse.json(
        { error: 'Gap va muallif majburiy' },
        { status: 400 }
      )
    }

    const quote = await prisma.dailyQuote.create({
      data: {
        textUz: data.textUz,
        textEn: data.textEn || null,
        author: data.author,
        authorInfo: data.authorInfo || null,
        category: data.category || 'motivation',
        tags: data.tags || [],
        icon: data.icon || '💡',
        color: data.color || 'purple',
        isActive: data.isActive !== false,
        displayDate: data.displayDate ? new Date(data.displayDate) : null
      }
    })

    return NextResponse.json({
      success: true,
      quote,
      message: '✓ Gap muvaffaqiyatli qo\'shildi'
    })
  } catch (error) {
    console.error('[Admin Quotes POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Gapni tahrirlash
export async function PUT(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const quote = await prisma.dailyQuote.update({
      where: { id: data.id },
      data: {
        textUz: data.textUz,
        textEn: data.textEn || null,
        author: data.author,
        authorInfo: data.authorInfo || null,
        category: data.category,
        tags: data.tags || [],
        icon: data.icon,
        color: data.color,
        isActive: data.isActive,
        displayDate: data.displayDate ? new Date(data.displayDate) : null
      }
    })

    return NextResponse.json({
      success: true,
      quote,
      message: '✓ Gap yangilandi'
    })
  } catch (error) {
    console.error('[Admin Quotes PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Gapni o'chirish
export async function DELETE(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    await prisma.dailyQuote.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: '✓ Gap o\'chirildi'
    })
  } catch (error) {
    console.error('[Admin Quotes DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}