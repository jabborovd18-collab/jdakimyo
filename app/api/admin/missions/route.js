// app/api/admin/missions/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// GET - Barcha missiyalarni olish
export async function GET(request) {
  try {
    const { isAdmin } = await checkAdminAuth('gamifikatsiya')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const date = searchParams.get('date') || ''

    const where = {}

    if (type && type !== 'all') where.type = type
    if (difficulty && difficulty !== 'all') where.difficulty = difficulty
    
    if (date) {
      where.date = new Date(date)
    }

    const missions = await prisma.mission.findMany({
      where,
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        _count: {
          select: { completions: true }
        }
      }
    })

    // Statistika
    const stats = {
      total: missions.length,
      byType: {},
      byDifficulty: {},
      todayMissions: missions.filter(m => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const missionDate = new Date(m.date)
        missionDate.setHours(0, 0, 0, 0)
        return today.getTime() === missionDate.getTime()
      }).length
    }

    missions.forEach(m => {
      stats.byType[m.type] = (stats.byType[m.type] || 0) + 1
      stats.byDifficulty[m.difficulty] = (stats.byDifficulty[m.difficulty] || 0) + 1
    })

    return NextResponse.json({
      success: true,
      missions,
      stats
    })
  } catch (error) {
    console.error('[Admin Missions GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Yangi missiya qo'shish
export async function POST(request) {
  try {
    const { isAdmin } = await checkAdminAuth('gamifikatsiya')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    // Validatsiya
    if (!data.title || !data.type || !data.xpReward) {
      return NextResponse.json(
        { error: 'Sarlavha, tur va XP majburiy' },
        { status: 400 }
      )
    }

    const mission = await prisma.mission.create({
      data: {
        date: new Date(data.date || new Date()),
        type: data.type,
        title: data.title,
        description: data.description || '',
        xpReward: parseInt(data.xpReward),
        icon: data.icon || '🎯',
        difficulty: data.difficulty || 'easy'
      }
    })

    return NextResponse.json({
      success: true,
      mission,
      message: '✓ Missiya muvaffaqiyatli qo\'shildi'
    })
  } catch (error) {
    console.error('[Admin Missions POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Missiyani tahrirlash
export async function PUT(request) {
  try {
    const { isAdmin } = await checkAdminAuth('gamifikatsiya')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const mission = await prisma.mission.update({
      where: { id: data.id },
      data: {
        date: new Date(data.date),
        type: data.type,
        title: data.title,
        description: data.description || '',
        xpReward: parseInt(data.xpReward),
        icon: data.icon,
        difficulty: data.difficulty
      }
    })

    return NextResponse.json({
      success: true,
      mission,
      message: '✓ Missiya yangilandi'
    })
  } catch (error) {
    console.error('[Admin Missions PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Missiyani o'chirish
export async function DELETE(request) {
  try {
    const { isAdmin } = await checkAdminAuth('gamifikatsiya')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    await prisma.mission.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: '✓ Missiya o\'chirildi'
    })
  } catch (error) {
    console.error('[Admin Missions DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}