// app/api/ustoz/new-vazifa/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

// POST - Yangi vazifa yaratish (kengaytirilgan)
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

    // ═══ VALIDATSIYA ═══
    if (!data.title || data.title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Sarlavha kamida 3 ta harfdan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    if (!data.groupId) {
      return NextResponse.json({ error: 'Guruhni tanlang' }, { status: 400 })
    }

    if (!data.deadline) {
      return NextResponse.json({ error: 'Muddatni belgilang' }, { status: 400 })
    }

    if (!data.type) {
      return NextResponse.json({ error: 'Vazifa turini tanlang' }, { status: 400 })
    }

    // Guruh o'qituvchiga tegishlimi?
    const group = await prisma.teacherGroup.findFirst({
      where: { id: data.groupId, teacherId: session.user.id }
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Guruh topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    // ═══ VAZIFANI YARATISH ═══
    const assignment = await prisma.assignment.create({
      data: {
        teacherId: session.user.id,
        groupId: data.groupId,
        
        // Asosiy
        title: data.title.trim(),
        description: data.description?.trim() || '',
        type: data.type,
        
        // Muddat va vaqt
        deadline: new Date(data.deadline),
        timeLimit: data.timeLimit ? parseInt(data.timeLimit) : null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        
        // Baholash
        maxScore: parseInt(data.maxScore) || 100,
        passingScore: data.passingScore ? parseInt(data.passingScore) : null,
        gradingCriteria: data.gradingCriteria || null,
        
        // Urinishlar
        maxAttempts: parseInt(data.maxAttempts) || 1,
        allowLateSubmission: data.allowLateSubmission || false,
        latePenalty: parseFloat(data.latePenalty) || 10,
        
        // Qo'shimcha mazmun
        instructions: data.instructions?.trim() || null,
        attachments: data.attachments || null,
        hints: data.hints || null,
        resources: data.resources || null,
        
        // Sozlamalar
        isDraft: data.isDraft || false,
        visibility: data.visibility || 'group',
        requireFile: data.requireFile || false,
        allowedFileTypes: data.allowedFileTypes || null,
        maxFileSize: data.maxFileSize ? parseInt(data.maxFileSize) : null,
      }
    })

    // ═══════════════════════════════════════════
    // AVTOMATIK E'LON YARATISH (agar draft bo'lmasa)
    // ═══════════════════════════════════════════
    if (!assignment.isDraft) {
      await prisma.announcement.create({
        data: {
          teacherId: session.user.id,
          groupId: data.groupId,
          title: `📝 Yangi vazifa: ${assignment.title}`,
          content: `${assignment.description}\n\n📅 Muddat: ${new Date(assignment.deadline).toLocaleString('uz-UZ')}\n⭐ Ball: ${assignment.maxScore}`
        }
      })
    }

    return NextResponse.json({
      success: true,
      assignment,
      message: assignment.isDraft 
        ? `✓ "${assignment.title}" qoralama sifatida saqlandi` 
        : `✓ "${assignment.title}" vazifasi yaratildi va e'lon qilindi`
    })
  } catch (error) {
    console.error('[New Vazifa POST]', error)
    return NextResponse.json({ error: 'Xatolik: ' + error.message }, { status: 500 })
  }
}

// GET - Mavjud vazifani olish (tahrirlash uchun)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Vazifa ID kerak' }, { status: 400 })
    }

    const assignment = await prisma.assignment.findFirst({
      where: { id, teacherId: session.user.id },
      include: {
        group: { select: { name: true } },
        _count: { select: { submissions: true } }
      }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Vazifa topilmadi' }, { status: 404 })
    }

    return NextResponse.json({ success: true, assignment })
  } catch (error) {
    console.error('[New Vazifa GET]', error)
    return NextResponse.json({ error: 'Xatolik: ' + error.message }, { status: 500 })
  }
}

// PUT - Mavjud vazifani yangilash
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'Vazifa ID kerak' }, { status: 400 })
    }

    const existing = await prisma.assignment.findFirst({
      where: { id: data.id, teacherId: session.user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Vazifa topilmadi' }, { status: 404 })
    }

    const assignment = await prisma.assignment.update({
      where: { id: data.id },
      data: {
        title: data.title?.trim() || existing.title,
        description: data.description?.trim() ?? existing.description,
        type: data.type || existing.type,
        deadline: data.deadline ? new Date(data.deadline) : existing.deadline,
        timeLimit: data.timeLimit !== undefined ? (data.timeLimit ? parseInt(data.timeLimit) : null) : existing.timeLimit,
        startDate: data.startDate ? new Date(data.startDate) : existing.startDate,
        maxScore: data.maxScore ? parseInt(data.maxScore) : existing.maxScore,
        passingScore: data.passingScore !== undefined ? (data.passingScore ? parseInt(data.passingScore) : null) : existing.passingScore,
        gradingCriteria: data.gradingCriteria !== undefined ? data.gradingCriteria : existing.gradingCriteria,
        maxAttempts: data.maxAttempts ? parseInt(data.maxAttempts) : existing.maxAttempts,
        allowLateSubmission: data.allowLateSubmission !== undefined ? data.allowLateSubmission : existing.allowLateSubmission,
        latePenalty: data.latePenalty !== undefined ? parseFloat(data.latePenalty) : existing.latePenalty,
        instructions: data.instructions !== undefined ? data.instructions : existing.instructions,
        attachments: data.attachments !== undefined ? data.attachments : existing.attachments,
        hints: data.hints !== undefined ? data.hints : existing.hints,
        resources: data.resources !== undefined ? data.resources : existing.resources,
        isDraft: data.isDraft !== undefined ? data.isDraft : existing.isDraft,
        visibility: data.visibility || existing.visibility,
        requireFile: data.requireFile !== undefined ? data.requireFile : existing.requireFile,
        allowedFileTypes: data.allowedFileTypes !== undefined ? data.allowedFileTypes : existing.allowedFileTypes,
        maxFileSize: data.maxFileSize !== undefined ? (data.maxFileSize ? parseInt(data.maxFileSize) : null) : existing.maxFileSize,
      }
    })

    return NextResponse.json({
      success: true,
      assignment,
      message: `✓ "${assignment.title}" yangilandi`
    })
  } catch (error) {
    console.error('[New Vazifa PUT]', error)
    return NextResponse.json({ error: 'Xatolik: ' + error.message }, { status: 500 })
  }
}