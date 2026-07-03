// app/api/admin/analysis/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// GET - Barcha tahlil usullarini olish
export async function GET(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where = {}

    if (category && category !== 'all') where.category = category
    if (activeOnly) where.isActive = true
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameUz: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const methods = await prisma.analysisMethod.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    // Kategoriyalar bo'yicha statistika
    const categoryStats = await prisma.analysisMethod.groupBy({
      by: ['category'],
      _count: true
    })

    const stats = categoryStats.reduce((acc, s) => {
      acc[s.category] = s._count
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      methods,
      stats,
      total: methods.length
    })
  } catch (error) {
    console.error('[Admin Analysis GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Yangi tahlil usuli qo'shish
export async function POST(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.name || !data.category || !data.description) {
      return NextResponse.json(
        { error: 'Nomi, kategoriyasi va tavsifi majburiy' },
        { status: 400 }
      )
    }

    const method = await prisma.analysisMethod.create({
      data: {
        name: data.name,
        nameUz: data.nameUz || data.name,
        nameEn: data.nameEn || null,
        category: data.category,
        description: data.description,
        application: data.application || null,
        advantages: data.advantages || null,
        disadvantages: data.disadvantages || null,
        accuracy: data.accuracy || null,
        cost: data.cost || null,
        time: data.time || null,
        icon: data.icon || '🔬',
        color: data.color || 'blue',
        isActive: data.isActive !== false
      }
    })

    return NextResponse.json({
      success: true,
      method,
      message: '✓ Tahlil usuli muvaffaqiyatli qo\'shildi'
    })
  } catch (error) {
    console.error('[Admin Analysis POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Tahlil usulini tahrirlash
export async function PUT(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const method = await prisma.analysisMethod.update({
      where: { id: data.id },
      data: {
        name: data.name,
        nameUz: data.nameUz,
        nameEn: data.nameEn || null,
        category: data.category,
        description: data.description,
        application: data.application || null,
        advantages: data.advantages || null,
        disadvantages: data.disadvantages || null,
        accuracy: data.accuracy || null,
        cost: data.cost || null,
        time: data.time || null,
        icon: data.icon,
        color: data.color,
        isActive: data.isActive
      }
    })

    return NextResponse.json({
      success: true,
      method,
      message: '✓ Tahlil usuli yangilandi'
    })
  } catch (error) {
    console.error('[Admin Analysis PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Tahlil usulini o'chirish
export async function DELETE(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    await prisma.analysisMethod.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: '✓ Tahlil usuli o\'chirildi'
    })
  } catch (error) {
    console.error('[Admin Analysis DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}