// app/api/admin/achievements/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// GET - Barcha yutuqlarni olish
export async function GET(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const rarity = searchParams.get('rarity') || ''
    const search = searchParams.get('search') || ''

    const where = {}
    if (category && category !== 'all') where.category = category
    if (rarity && rarity !== 'all') where.rarity = rarity
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { key: { contains: search, mode: 'insensitive' } }
      ]
    }

    const achievements = await prisma.achievementDefinition.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { rarity: 'asc' },
        { name: 'asc' }
      ]
    })

    // Har bir yutuqni nechta foydalanuvchi olganini hisoblash
    const achievementsWithStats = await Promise.all(
      achievements.map(async (achievement) => {
        const earnedCount = await prisma.achievement.count({
          where: { achievementKey: achievement.key }
        })
        return { ...achievement, earnedCount }
      })
    )

    // Statistika
    const categoryStats = await prisma.achievementDefinition.groupBy({
      by: ['category'],
      _count: true
    })

    const rarityStats = await prisma.achievementDefinition.groupBy({
      by: ['rarity'],
      _count: true
    })

    const stats = {
      total: achievements.length,
      byCategory: categoryStats.reduce((acc, s) => {
        acc[s.category] = s._count
        return acc
      }, {}),
      byRarity: rarityStats.reduce((acc, s) => {
        acc[s.rarity] = s._count
        return acc
      }, {})
    }

    return NextResponse.json({
      success: true,
      achievements: achievementsWithStats,
      stats
    })
  } catch (error) {
    console.error('[Admin Achievements GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Yangi yutuq qo'shish
export async function POST(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.key || !data.name || !data.description) {
      return NextResponse.json(
        { error: 'Kalit, nom va tavsif majburiy' },
        { status: 400 }
      )
    }

    // Kalit uniqiligini tekshirish
    const existing = await prisma.achievementDefinition.findUnique({
      where: { key: data.key }
    })

    if (existing) {
      return NextResponse.json(
        { error: `"${data.key}" kaliti allaqachon mavjud` },
        { status: 400 }
      )
    }

    const achievement = await prisma.achievementDefinition.create({
      data: {
        key: data.key,
        name: data.name,
        description: data.description,
        icon: data.icon || '🏆',
        rarity: data.rarity || 'common',
        category: data.category || 'general',
        requirement: data.requirement || null,
        xpReward: parseInt(data.xpReward) || 0,
        isActive: data.isActive !== false
      }
    })

    return NextResponse.json({
      success: true,
      achievement,
      message: '✓ Yutuq muvaffaqiyatli qo\'shildi'
    })
  } catch (error) {
    console.error('[Admin Achievements POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Yutuqni tahrirlash
export async function PUT(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const achievement = await prisma.achievementDefinition.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        rarity: data.rarity,
        category: data.category,
        requirement: data.requirement || null,
        xpReward: parseInt(data.xpReward) || 0,
        isActive: data.isActive
      }
    })

    return NextResponse.json({
      success: true,
      achievement,
      message: '✓ Yutuq yangilandi'
    })
  } catch (error) {
    console.error('[Admin Achievements PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Yutuqni o'chirish
export async function DELETE(request) {
  try {
    const { isSuperAdmin } = await checkAdminAuth()
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: 'Faqat SuperAdmin o\'chirishi mumkin' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    // Avval bu yutuqni olganlarni o'chirish
    const achievement = await prisma.achievementDefinition.findUnique({
      where: { id }
    })

    if (achievement) {
      await prisma.achievement.deleteMany({
        where: { achievementKey: achievement.key }
      })
    }

    await prisma.achievementDefinition.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: '✓ Yutuq va uni olgan barcha yozuvlar o\'chirildi'
    })
  } catch (error) {
    console.error('[Admin Achievements DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}