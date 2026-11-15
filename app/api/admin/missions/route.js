// app/api/admin/missions/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'
import { isValidMissionType, MISSION_VALID_TYPES } from '@/lib/admin-yordamchi'
import { qaydEt } from '@/lib/qaydnoma'

function parseMissionUtcDate(raw) {
  if (!raw) {
    const d = new Date()
    d.setUTCHours(0, 0, 0, 0)
    return d
  }
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return null
  d.setUTCHours(0, 0, 0, 0)
  return d
}

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
      const parsedDate = parseMissionUtcDate(date)
      if (parsedDate) where.date = parsedDate
    }

    const missions = await prisma.mission.findMany({
      where,
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        _count: {
          select: { completions: true },
        },
      },
    })

    const today = parseMissionUtcDate(null)
    const stats = {
      total: missions.length,
      byType: {},
      byDifficulty: {},
      todayMissions: missions.filter((m) => {
        const missionDate = parseMissionUtcDate(m.date)
        return missionDate && today.getTime() === missionDate.getTime()
      }).length,
    }

    missions.forEach((m) => {
      stats.byType[m.type] = (stats.byType[m.type] || 0) + 1
      stats.byDifficulty[m.difficulty] = (stats.byDifficulty[m.difficulty] || 0) + 1
    })

    return NextResponse.json({
      success: true,
      missions,
      stats,
    })
  } catch (error) {
    console.error('[Admin Missions GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Yangi missiya qo'shish
export async function POST(request) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth('gamifikatsiya')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.title?.trim() || !data.type || !data.xpReward) {
      return NextResponse.json(
        { error: 'Sarlavha, tur va XP majburiy' },
        { status: 400 }
      )
    }

    if (!isValidMissionType(data.type)) {
      return NextResponse.json(
        { error: `Noto'g'ri missiya turi. Ruxsat etilgan: ${MISSION_VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    const sana = parseMissionUtcDate(data.date)
    if (!sana) {
      return NextResponse.json({ error: "Sana formati noto'g'ri" }, { status: 400 })
    }

    const mission = await prisma.mission.create({
      data: {
        date: sana,
        type: data.type,
        title: data.title.trim(),
        description: (data.description || '').trim(),
        xpReward: Math.max(1, parseInt(data.xpReward, 10) || 10),
        icon: data.icon || '🎯',
        difficulty: data.difficulty || 'easy',
      },
    })

    await qaydEt({
      adminId: admin.id,
      action: 'create_mission',
      targetType: 'DailyMission',
      targetId: mission.id,
      details: `${mission.type}: ${mission.title}`,
      request,
    })

    return NextResponse.json({
      success: true,
      mission,
      message: "Missiya muvaffaqiyatli qo'shildi",
    })
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Bu sana va tur uchun missiya allaqachon mavjud' },
        { status: 409 }
      )
    }
    console.error('[Admin Missions POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Missiyani tahrirlash
export async function PUT(request) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth('gamifikatsiya')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    if (!isValidMissionType(data.type)) {
      return NextResponse.json(
        { error: `Noto'g'ri missiya turi. Ruxsat etilgan: ${MISSION_VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    const sana = parseMissionUtcDate(data.date)
    if (!sana) {
      return NextResponse.json({ error: "Sana formati noto'g'ri" }, { status: 400 })
    }

    const mission = await prisma.mission.update({
      where: { id: data.id },
      data: {
        date: sana,
        type: data.type,
        title: (data.title || '').trim(),
        description: (data.description || '').trim(),
        xpReward: Math.max(1, parseInt(data.xpReward, 10) || 10),
        icon: data.icon || '🎯',
        difficulty: data.difficulty || 'easy',
      },
    })

    await qaydEt({
      adminId: admin.id,
      action: 'update_mission',
      targetType: 'DailyMission',
      targetId: mission.id,
      details: `${mission.type}: ${mission.title}`,
      request,
    })

    return NextResponse.json({
      success: true,
      mission,
      message: 'Missiya yangilandi',
    })
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Bu sana va tur uchun missiya allaqachon mavjud' },
        { status: 409 }
      )
    }
    console.error('[Admin Missions PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Missiyani o'chirish
export async function DELETE(request) {
  try {
    const { isAdmin, user: admin } = await checkAdminAuth('gamifikatsiya')
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const oldingi = await prisma.mission.delete({ where: { id } })
    await qaydEt({
      adminId: admin.id,
      action: 'delete_mission',
      targetType: 'DailyMission',
      targetId: id,
      details: oldingi.title,
      request,
    })

    return NextResponse.json({
      success: true,
      message: "Missiya o'chirildi",
    })
  } catch (error) {
    console.error('[Admin Missions DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
