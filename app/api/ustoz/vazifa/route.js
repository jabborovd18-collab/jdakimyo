// app/api/ustoz/vazifa/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

// GET - Barcha vazifalar ro'yxati
export async function GET(request) {
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
    const groupId = searchParams.get('groupId') || ''
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || ''

    const where = { teacherId: session.user.id }

    if (groupId && groupId !== 'all') where.groupId = groupId
    if (type && type !== 'all') where.type = type
    if (status === 'active') where.deadline = { gte: new Date() }
    if (status === 'expired') where.deadline = { lt: new Date() }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        group: {
          select: { id: true, name: true, color: true }
        },
        _count: {
          select: { submissions: true }
        },
        submissions: {
          where: { status: 'pending' },
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Guruhlar (filter uchun)
    const groups = await prisma.teacherGroup.findMany({
      where: { teacherId: session.user.id },
      select: { id: true, name: true, color: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      assignments: assignments.map(a => ({
        ...a,
        pendingCount: a.submissions.length,
        submissions: undefined
      })),
      groups,
      total: assignments.length
    })
  } catch (error) {
    console.error('[Vazifa GET]', error)
    return NextResponse.json({ error: 'Xatolik: ' + error.message }, { status: 500 })
  }
}

// POST - Yangi vazifa yaratish
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
    if (!data.title || data.title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Vazifa sarlavhasi kamida 3 ta harfdan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }
    if (!data.groupId) {
      return NextResponse.json(
        { error: 'Guruhni tanlang' },
        { status: 400 }
      )
    }
    if (!data.deadline) {
      return NextResponse.json(
        { error: 'Muddatni belgilang' },
        { status: 400 }
      )
    }
    if (!data.type) {
      return NextResponse.json(
        { error: 'Vazifa turini tanlang' },
        { status: 400 }
      )
    }

    // Guruh o'qituvchiga tegishlimi?
    const group = await prisma.teacherGroup.findFirst({
      where: {
        id: data.groupId,
        teacherId: session.user.id
      }
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Guruh topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    // Vazifani yaratish
    const assignment = await prisma.assignment.create({
      data: {
        teacherId: session.user.id,
        groupId: data.groupId,
        title: data.title.trim(),
        description: data.description?.trim() || '',
        type: data.type,
        deadline: new Date(data.deadline),
        maxScore: parseInt(data.maxScore) || 100
      }
    })

    return NextResponse.json({
      success: true,
      assignment,
      message: `✓ "${assignment.title}" vazifasi muvaffaqiyatli yaratildi`
    })
  } catch (error) {
    console.error('[Vazifa POST]', error)
    return NextResponse.json({ error: 'Xatolik: ' + error.message }, { status: 500 })
  }
}

// PUT - Vazifani tahrirlash
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
      return NextResponse.json({ error: 'Vazifa ID kerak' }, { status: 400 })
    }

    // Vazifa o'qituvchiga tegishlimi?
    const existing = await prisma.assignment.findFirst({
      where: {
        id: data.id,
        teacherId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Vazifa topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    // Yangi guruh ham SHU ustozniki bo'lishi kerak. Avval `groupId`
    // tekshirilmasdan qabul qilinardi: ustoz o'z vazifasini begona
    // guruhga ko'chirib yuborishi va u yerda ko'rinib qolishi mumkin edi.
    if (data.groupId && data.groupId !== existing.groupId) {
      const guruh = await prisma.teacherGroup.findFirst({
        where: { id: data.groupId, teacherId: session.user.id },
        select: { id: true },
      })
      if (!guruh) {
        return NextResponse.json(
          { error: 'Guruh topilmadi yoki sizga tegishli emas' },
          { status: 404 }
        )
      }
    }

    const assignment = await prisma.assignment.update({
      where: { id: data.id },
      data: {
        title: data.title?.trim() || existing.title,
        description: data.description?.trim() ?? existing.description,
        type: data.type || existing.type,
        deadline: data.deadline ? new Date(data.deadline) : existing.deadline,
        maxScore: data.maxScore ? parseInt(data.maxScore) : existing.maxScore,
        groupId: data.groupId || existing.groupId
      }
    })

    return NextResponse.json({
      success: true,
      assignment,
      message: `✓ "${assignment.title}" vazifasi yangilandi`
    })
  } catch (error) {
    console.error('[Vazifa PUT]', error)
    return NextResponse.json({ error: 'Xatolik: ' + error.message }, { status: 500 })
  }
}

// DELETE - Vazifani o'chirish
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Vazifa ID kerak' }, { status: 400 })
    }

    const existing = await prisma.assignment.findFirst({
      where: {
        id,
        teacherId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Vazifa topilmadi' },
        { status: 404 }
      )
    }

    await prisma.assignment.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: `✓ "${existing.title}" vazifasi o'chirildi`
    })
  } catch (error) {
    console.error('[Vazifa DELETE]', error)
    return NextResponse.json({ error: 'Xatolik: ' + error.message }, { status: 500 })
  }
}