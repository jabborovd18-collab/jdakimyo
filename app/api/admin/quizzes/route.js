// app/api/admin/quizzes/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Barcha savollarni olish (filter, search, pagination bilan)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = ['admin', 'superadmin', 'moderator'].includes(session.user.role)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where = {}

    if (category && category !== 'all') where.category = category
    if (difficulty && difficulty !== 'all') where.difficulty = difficulty
    if (search) {
      where.question = { contains: search, mode: 'insensitive' }
    }

    const [questions, total] = await Promise.all([
      prisma.quizQuestion.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.quizQuestion.count({ where })
    ])

    // Kategoriyalar bo'yicha statistika
    const categoryStats = await prisma.quizQuestion.groupBy({
      by: ['category'],
      _count: true
    })

    return NextResponse.json({
      success: true,
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: categoryStats.reduce((acc, s) => {
        acc[s.category] = s._count
        return acc
      }, {})
    })
  } catch (error) {
    console.error('[Admin Quizzes GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Yangi savol qo'shish
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = ['admin', 'superadmin'].includes(session.user.role)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    // Validatsiya
    if (!data.question || !data.options || !Array.isArray(data.options) || data.options.length !== 4) {
      return NextResponse.json(
        { error: 'Savol va 4 ta variant majburiy' },
        { status: 400 }
      )
    }

    if (data.correct < 0 || data.correct > 3) {
      return NextResponse.json(
        { error: 'To\'g\'ri javob indeksi 0-3 orasida bo\'lishi kerak' },
        { status: 400 }
      )
    }

    const question = await prisma.quizQuestion.create({
      data: {
        category: data.category,
        question: data.question,
        options: data.options,
        correct: parseInt(data.correct),
        explanation: data.explanation || null,
        difficulty: data.difficulty || "o'rta",
        tags: data.tags || [],
        isActive: data.isActive !== false
      }
    })

    return NextResponse.json({
      success: true,
      question,
      message: '✓ Savol muvaffaqiyatli qo\'shildi'
    })
  } catch (error) {
    console.error('[Admin Quizzes POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Savolni tahrirlash
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = ['admin', 'superadmin'].includes(session.user.role)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const question = await prisma.quizQuestion.update({
      where: { id: data.id },
      data: {
        category: data.category,
        question: data.question,
        options: data.options,
        correct: parseInt(data.correct),
        explanation: data.explanation || null,
        difficulty: data.difficulty,
        tags: data.tags || [],
        isActive: data.isActive
      }
    })

    return NextResponse.json({
      success: true,
      question,
      message: '✓ Savol yangilandi'
    })
  } catch (error) {
    console.error('[Admin Quizzes PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Savolni o'chirish
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = ['admin', 'superadmin'].includes(session.user.role)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    await prisma.quizQuestion.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: '✓ Savol o\'chirildi'
    })
  } catch (error) {
    console.error('[Admin Quizzes DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}