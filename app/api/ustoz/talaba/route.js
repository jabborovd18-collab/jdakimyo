// app/api/ustoz/talaba/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'
import { xabarYubor } from '@/lib/bildirishnoma'

// GET - O'qituvchining barcha talabalari
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
    const search = searchParams.get('search') || ''

    const where = { teacherId: session.user.id }
    
    if (groupId && groupId !== 'all') {
      where.groupId = groupId
    }

    // Talabalar ro'yxati
    const teacherStudents = await prisma.teacherStudent.findMany({
      where,
      include: {
        student: {
          // Email yo'q: u profilning ochiq qismi emas va ustozga
          // talabani tanish uchun kerak emas. Qidiruv ham username va
          // ism bo'yicha ketadi.
          select: {
            id: true,
            userId: true,
            username: true,
            fullName: true,
            avatar: true,
            university: true,
            faculty: true,
            level_points: true,
            totalPoints: true,
            isVerified: true
          }
        },
        group: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    })

    // Qidiruv bo'yicha filtrlash
    let filteredStudents = teacherStudents
    if (search) {
      const q = search.toLowerCase()
      filteredStudents = teacherStudents.filter(ts =>
        ts.student.fullName?.toLowerCase().includes(q) ||
        ts.student.username.toLowerCase().includes(q)
      )
    }

    // Har bir talaba uchun statistika
    const studentsWithStats = await Promise.all(
      filteredStudents.map(async (ts) => {
        const [submissionCount, avgScore] = await Promise.all([
          prisma.assignmentSubmission.count({
            where: {
              studentId: ts.studentId,
              assignment: { teacherId: session.user.id }
            }
          }),
          prisma.assignmentSubmission.aggregate({
            where: {
              studentId: ts.studentId,
              assignment: { teacherId: session.user.id },
              score: { not: null }
            },
            _avg: { score: true }
          })
        ])

        return {
          ...ts,
          stats: {
            submissions: submissionCount,
            avgScore: avgScore._avg.score || 0
          }
        }
      })
    )

    // Guruhlar (filter uchun)
    const groups = await prisma.teacherGroup.findMany({
      where: { teacherId: session.user.id },
      select: { id: true, name: true, color: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      students: studentsWithStats,
      groups,
      total: studentsWithStats.length
    })
  } catch (error) {
    console.error('[Talabalar GET]', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}

// POST - Talabani guruhga qo'shish
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

    const { studentId, groupId } = await request.json()

    if (!studentId || !groupId) {
      return NextResponse.json(
        { error: 'studentId va groupId majburiy' },
        { status: 400 }
      )
    }

    // Guruh o'qituvchiga tegishlimi?
    const group = await prisma.teacherGroup.findFirst({
      where: {
        id: groupId,
        teacherId: session.user.id
      }
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Guruh topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      )
    }

    // Talaba mavjudmi?
    const student = await prisma.user.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Talaba topilmadi' },
        { status: 404 }
      )
    }

    // Allaqqachon qo'shilganmi?
    const existing = await prisma.teacherStudent.findFirst({
      where: {
        teacherId: session.user.id,
        studentId,
        groupId
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: `"${student.fullName || student.username}" allaqachon "${group.name}" guruhida` },
        { status: 400 }
      )
    }

    // Qo'shish
    await prisma.teacherStudent.create({
      data: {
        teacherId: session.user.id,
        studentId,
        groupId
      }
    })

    // Talabaga xabar beramiz. Avval qo'shilish butunlay jimgina
    // bo'lardi: odam o'zining kimningdir guruhida turganini, vazifa
    // olishini va natijalari ustozga ko'rinishini bilmasdi ham.
    // To'liq rozilik oqimi (taklif — qabul qilish) alohida ish, lekin
    // hech bo'lmasa xabardor bo'lsin.
    await xabarYubor(studentId, {
      turi: 'tizim',
      sarlavha: `Siz "${group.name}" guruhiga qo'shildingiz`,
      matn: `${session.user.fullName || session.user.username} sizni o'z guruhiga qo'shdi. Endi guruh vazifalari va quizlari sizga ko'rinadi.`,
      havola: '/profil',
      icon: '👨‍🏫',
      adminId: session.user.id,
    })

    return NextResponse.json({
      success: true,
      message: `✓ "${student.fullName || student.username}" "${group.name}" guruhiga qo'shildi`
    })
  } catch (error) {
    console.error('[Talaba POST]', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}

// DELETE - Talabani guruhdan olib tashlash
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
      return NextResponse.json(
        { error: 'TeacherStudent ID majburiy' },
        { status: 400 }
      )
    }

    // Yozuv o'qituvchiga tegishlimi?
    const ts = await prisma.teacherStudent.findFirst({
      where: {
        id,
        teacherId: session.user.id
      },
      include: {
        student: { select: { fullName: true, username: true } },
        group: { select: { name: true } }
      }
    })

    if (!ts) {
      return NextResponse.json(
        { error: 'Yozuv topilmadi' },
        { status: 404 }
      )
    }

    await prisma.teacherStudent.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: `✓ "${ts.student.fullName || ts.student.username}" "${ts.group.name}" guruhidan olib tashlandi`
    })
  } catch (error) {
    console.error('[Talaba DELETE]', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}