// app/api/ustoz/guruh/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

const ALLOWED_COLORS = ['blue', 'green', 'purple', 'orange', 'pink', 'red', 'cyan', 'yellow']

// GET - Barcha guruhlar ro'yxati
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden - Faqat o\'qituvchilar uchun' }, { status: 403 })
    }

    const groups = await prisma.teacherGroup.findMany({
      where: { teacherId: session.user.id },
      include: {
        _count: {
          select: {
            students: { where: { holat: 'faol' } },
            assignments: { where: { isDraft: false } },
            announcements: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      groups,
      total: groups.length
    })
  } catch (error) {
    console.error('[Guruh GET]', error)
    return NextResponse.json({ error: 'Guruhlarni yuklashda xatolik yuz berdi' }, { status: 500 })
  }
}

// POST - Yangi guruh yaratish
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    // Validatsiya
    if (!data.name || data.name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Guruh nomi kamida 2 ta harfdan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    if (data.name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Guruh nomi 100 ta harfdan oshmasligi kerak' },
        { status: 400 }
      )
    }

    // Bir xil nomdagi guruh bormi?
    const existing = await prisma.teacherGroup.findFirst({
      where: {
        teacherId: session.user.id,
        name: { equals: data.name.trim(), mode: 'insensitive' }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: `"${data.name.trim()}" nomli guruh allaqachon mavjud` },
        { status: 400 }
      )
    }

    const color = ALLOWED_COLORS.includes(data.color) ? data.color : 'blue'

    const group = await prisma.teacherGroup.create({
      data: {
        teacherId: session.user.id,
        name: data.name.trim(),
        description: data.description?.trim() || null,
        color
      },
      include: {
        _count: {
          select: {
            students: { where: { holat: 'faol' } },
            assignments: { where: { isDraft: false } },
            announcements: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      group,
      message: `✓ "${group.name}" guruhi muvaffaqiyatli yaratildi`
    })
  } catch (error) {
    console.error('[Guruh POST]', error)
    return NextResponse.json({ error: 'Guruh yaratishda xatolik yuz berdi' }, { status: 500 })
  }
}

// PUT - Guruhni tahrirlash
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'Guruh ID kerak' }, { status: 400 })
    }

    // Guruh o'qituvchiga tegishlimi?
    const existing = await prisma.teacherGroup.findFirst({
      where: {
        id: data.id,
        teacherId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Guruh topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    if (data.name !== undefined && data.name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Guruh nomi kamida 2 ta harfdan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    const color = data.color && ALLOWED_COLORS.includes(data.color) ? data.color : existing.color

    const group = await prisma.teacherGroup.update({
      where: { id: data.id },
      data: {
        name: data.name ? data.name.trim() : existing.name,
        description: data.description !== undefined ? (data.description?.trim() || null) : existing.description,
        color
      },
      include: {
        _count: {
          select: {
            students: { where: { holat: 'faol' } },
            assignments: { where: { isDraft: false } },
            announcements: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      group,
      message: `✓ "${group.name}" guruhi yangilandi`
    })
  } catch (error) {
    console.error('[Guruh PUT]', error)
    return NextResponse.json({ error: 'Guruhni yangilashda xatolik yuz berdi' }, { status: 500 })
  }
}

// DELETE - Guruhni o'chirish
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('id')

    if (!groupId) {
      return NextResponse.json({ error: 'Guruh ID kerak' }, { status: 400 })
    }

    // Guruh o'qituvchiga tegishlimi?
    const existing = await prisma.teacherGroup.findFirst({
      where: {
        id: groupId,
        teacherId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Guruh topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    // Guruhga bog'liq barcha ma'lumotlarni tozalab o'chirish (FK xatolarini oldini olish)
    await prisma.$transaction([
      prisma.teacherStudent.deleteMany({ where: { groupId } }),
      prisma.announcement.deleteMany({ where: { groupId } }),
      prisma.assignmentSubmission.deleteMany({
        where: { assignment: { groupId } }
      }),
      prisma.assignment.deleteMany({ where: { groupId } }),
      prisma.teacherQuiz.updateMany({
        where: { groupId },
        data: { groupId: null }
      }),
      prisma.closedQuiz.updateMany({
        where: { groupId },
        data: { groupId: null }
      }),
      prisma.teacherGroup.delete({ where: { id: groupId } })
    ])

    return NextResponse.json({
      success: true,
      message: `✓ "${existing.name}" guruhi va unga bog'liq ma'lumotlar o'chirildi`
    })
  } catch (error) {
    console.error('[Guruh DELETE]', error)
    return NextResponse.json({ error: 'Guruhni o\'chirishda xatolik yuz berdi' }, { status: 500 })
  }
}
