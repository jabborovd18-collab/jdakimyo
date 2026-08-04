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

    // Rad etilganlar ro'yxatga kirmaydi — ustoz uchun ular yopilgan
    // savol, ko'rinib turishi faqat chalkashtiradi.
    const where = { teacherId: session.user.id, holat: { in: ['faol', 'sorov'] } }

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

    // Holat bo'yicha ajratamiz: kutilayotgan taklif hali talaba emas,
    // lekin ustoz kimga yuborganini ko'rib turishi kerak — aks holda
    // javob kelmasa, u taklif yuborganini ham unutib qo'yardi.
    return NextResponse.json({
      success: true,
      students: studentsWithStats.filter((s) => s.holat === 'faol'),
      kutilayotgan: studentsWithStats.filter((s) => s.holat === 'sorov'),
      groups,
      total: studentsWithStats.filter((s) => s.holat === 'faol').length
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

    // Allaqqachon taklif qilinganmi yoki a'zomi?
    const existing = await prisma.teacherStudent.findFirst({
      where: {
        teacherId: session.user.id,
        studentId,
        groupId
      }
    })

    if (existing) {
      const nom = student.fullName || student.username
      // Rad etilganini QAYTA taklif qilishga ruxsat bermaymiz: aks holda
      // ustoz taklifni cheksiz yuboraverib, rad etishning ma'nosi
      // qolmasdi. Ustoz avval yozuvni o'chirib, keyin qaytadan
      // taklif qilishi mumkin — bu ongli harakat bo'ladi.
      const sabab = {
        faol: `"${nom}" allaqachon "${group.name}" guruhida`,
        sorov: `"${nom}" ga taklif yuborilgan, javob kutilmoqda`,
        rad: `"${nom}" taklifni rad etgan`,
      }
      return NextResponse.json(
        { error: sabab[existing.holat] || sabab.faol },
        { status: 400 }
      )
    }

    // TAKLIF sifatida yaratiladi — talaba qabul qilmaguncha guruh a'zosi
    // hisoblanmaydi. Avval u darhol a'zo bo'lib qolardi va o'zining
    // kimningdir ro'yxatida turganini bilmasdi ham.
    await prisma.teacherStudent.create({
      data: {
        teacherId: session.user.id,
        studentId,
        groupId,
        holat: 'sorov',
      }
    })

    await xabarYubor(studentId, {
      turi: 'tizim',
      sarlavha: `👨‍🏫 "${group.name}" guruhiga taklif`,
      matn: `${session.user.fullName || session.user.username} sizni o'z guruhiga taklif qilmoqda. Qabul qilsangiz, guruh vazifalari sizga ko'rinadi va natijalaringiz ustozga ochiladi.`,
      havola: '/profil/ustozim',
      icon: '👨‍🏫',
      adminId: session.user.id,
    })

    return NextResponse.json({
      success: true,
      message: `✓ "${student.fullName || student.username}" ga taklif yuborildi`
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