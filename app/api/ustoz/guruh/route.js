// app/api/ustoz/guruh/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

// GET - O'qituvchining barcha guruhlari
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
    const search = searchParams.get('search') || ''

    const where = { teacherId: session.user.id }
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    const groups = await prisma.teacherGroup.findMany({
      where,
      include: {
        _count: {
          select: { 
            students: true,
            assignments: true,
            announcements: true
          }
        },
        students: {
          take: 5,
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatar: true
              }
            }
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
    console.error('[Ustoz Guruh GET]', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
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

    const { name, description, color } = await request.json()

    // Validatsiya
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Guruh nomi kamida 2 ta harfdan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    // Bir xil nomli guruh borligini tekshirish
    const existingGroup = await prisma.teacherGroup.findFirst({
      where: {
        teacherId: session.user.id,
        name: { equals: name.trim(), mode: 'insensitive' }
      }
    })

    if (existingGroup) {
      return NextResponse.json(
        { error: `"${name}" nomli guruh allaqachon mavjud` },
        { status: 400 }
      )
    }

    const group = await prisma.teacherGroup.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color || 'blue',
        teacherId: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      group,
      message: `✓ "${group.name}" guruhi muvaffaqiyatli yaratildi`
    })
  } catch (error) {
    console.error('[Ustoz Guruh POST]', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
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

    const { id, name, description, color } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Guruh ID kerak' }, { status: 400 })
    }

    // Guruh mavjudligini va o'qituvchiga tegishli ekanligini tekshirish
    const existingGroup = await prisma.teacherGroup.findFirst({
      where: {
        id,
        teacherId: session.user.id
      }
    })

    if (!existingGroup) {
      return NextResponse.json(
        { error: 'Guruh topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    // Bir xil nomli boshqa guruh borligini tekshirish
    if (name && name.trim() !== existingGroup.name) {
      const duplicateGroup = await prisma.teacherGroup.findFirst({
        where: {
          teacherId: session.user.id,
          name: { equals: name.trim(), mode: 'insensitive' },
          id: { not: id }
        }
      })

      if (duplicateGroup) {
        return NextResponse.json(
          { error: `"${name}" nomli guruh allaqachon mavjud` },
          { status: 400 }
        )
      }
    }

    const group = await prisma.teacherGroup.update({
      where: { id },
      data: {
        name: name?.trim() || existingGroup.name,
        description: description?.trim() || null,
        color: color || existingGroup.color
      }
    })

    return NextResponse.json({
      success: true,
      group,
      message: `✓ "${group.name}" guruhi yangilandi`
    })
  } catch (error) {
    console.error('[Ustoz Guruh PUT]', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Guruh ID kerak' }, { status: 400 })
    }

    // Guruh mavjudligini va o'qituvchiga tegishli ekanligini tekshirish
    const existingGroup = await prisma.teacherGroup.findFirst({
      where: {
        id,
        teacherId: session.user.id
      }
    })

    if (!existingGroup) {
      return NextResponse.json(
        { error: 'Guruh topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    // Guruhni o'chirish (cascade orqali bog'liq yozuvlar ham o'chadi)
    await prisma.teacherGroup.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: `✓ "${existingGroup.name}" guruhi o'chirildi`
    })
  } catch (error) {
    console.error('[Ustoz Guruh DELETE]', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}