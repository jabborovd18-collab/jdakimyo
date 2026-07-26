// app/api/ustoz/elonlar/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Barcha e'lonlar
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ['teacher', 'admin', 'superadmin', 'moderator'].includes(session.user.role)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId') || ''

    const where = { teacherId: session.user.id }
    if (groupId && groupId !== 'all') {
      where.groupId = groupId
    }

    const announcements = await prisma.announcement.findMany({
      where,
      include: {
        group: {
          select: { id: true, name: true, color: true }
        },
        teacher: {
          select: { fullName: true, username: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const groups = await prisma.teacherGroup.findMany({
      where: { teacherId: session.user.id },
      select: { id: true, name: true, color: true }
    })

    return NextResponse.json({
      success: true,
      announcements,
      groups,
      total: announcements.length
    })
  } catch (error) {
    console.error('[E\'lonlar GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Yangi e'lon yaratish
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ['teacher', 'admin', 'superadmin', 'moderator'].includes(session.user.role)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    // Validatsiya
    if (!data.title || data.title.trim().length < 3) {
      return NextResponse.json(
        { error: 'E\'lon sarlavhasi kamida 3 ta harfdan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    if (!data.content || data.content.trim().length < 10) {
      return NextResponse.json(
        { error: 'E\'lon matni kamida 10 ta harfdan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    if (!data.groupId) {
      return NextResponse.json(
        { error: 'Guruhni tanlang' },
        { status: 400 }
      )
    }

    // Guruh tekshiruv
    const group = await prisma.teacherGroup.findFirst({
      where: { id: data.groupId, teacherId: session.user.id }
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Guruh topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    // E'lon yaratish
    const announcement = await prisma.announcement.create({
      data: {
        teacherId: session.user.id,
        groupId: data.groupId,
        title: data.title.trim(),
        content: data.content.trim()
      }
    })

    return NextResponse.json({
      success: true,
      announcement,
      message: `✓ "${announcement.title}" e'loni "${group.name}" guruhiga yuborildi`
    })
  } catch (error) {
    console.error('[E\'lonlar POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - E'lonni tahrirlash
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ['teacher', 'admin', 'superadmin', 'moderator'].includes(session.user.role)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'E\'lon ID kerak' }, { status: 400 })
    }

    const existing = await prisma.announcement.findFirst({
      where: { id: data.id, teacherId: session.user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'E\'lon topilmadi' }, { status: 404 })
    }

    const announcement = await prisma.announcement.update({
      where: { id: data.id },
      data: {
        title: data.title?.trim() || existing.title,
        content: data.content?.trim() || existing.content,
        groupId: data.groupId || existing.groupId
      }
    })

    return NextResponse.json({
      success: true,
      announcement,
      message: `✓ E'lon yangilandi`
    })
  } catch (error) {
    console.error('[E\'lonlar PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - E'lonni o'chirish
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ['teacher', 'admin', 'superadmin', 'moderator'].includes(session.user.role)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'E\'lon ID kerak' }, { status: 400 })
    }

    const existing = await prisma.announcement.findFirst({
      where: { id, teacherId: session.user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'E\'lon topilmadi' }, { status: 404 })
    }

    await prisma.announcement.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: `✓ "${existing.title}" e'loni o'chirildi`
    })
  } catch (error) {
    console.error('[E\'lonlar DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}