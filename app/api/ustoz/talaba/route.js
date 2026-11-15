// app/api/ustoz/talaba/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/bildirishnoma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

// GET - Barcha talabalar (filter va search bilan)
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
    const search = (searchParams.get('search') || '').trim()
    const holatFilter = searchParams.get('holat') || ''

    // Where shartlari
    const where = {
      teacherId: session.user.id,
      holat: holatFilter && ['faol', 'sorov', 'rad'].includes(holatFilter)
        ? holatFilter
        : { in: ['faol', 'sorov'] }
    }

    if (groupId && groupId !== 'all') {
      where.groupId = groupId === 'ungrouped' ? null : groupId
    }

    const teacherStudents = await prisma.teacherStudent.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            userId: true,
            username: true,
            fullName: true,
            email: true,
            avatar: true,
            role: true,
            university: true,
            faculty: true,
            level: true,
            totalPoints: true,
            experience: true,
            level_points: true,
            currentStreak: true,
            lastActive: true,
            createdAt: true,
            isVerified: true,
            premiumUslub: true,
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

    // Qidiruv filter (client yoki server)
    let filtered = teacherStudents
    if (search) {
      const q = search.toLowerCase()
      filtered = teacherStudents.filter(ts =>
        ts.student.fullName?.toLowerCase().includes(q) ||
        ts.student.username?.toLowerCase().includes(q) ||
        ts.student.userId?.includes(q)
      )
    }

    // Talabalarning shu ustozdagi topshiriqlari (vazifa + ochiq quiz + yopiq quiz) statistikasini
    // N+1 so'rovsiz, bitta partiyada hisoblash
    const studentIds = [...new Set(filtered.map(ts => ts.student.id))]

    let statsByStudent = new Map()
    if (studentIds.length > 0) {
      const [assignSubs, openAttempts, closedSubs] = await Promise.all([
        prisma.assignmentSubmission.findMany({
          where: {
            studentId: { in: studentIds },
            assignment: { teacherId: session.user.id }
          },
          select: {
            studentId: true,
            score: true,
            status: true,
            assignment: { select: { maxScore: true } }
          }
        }),
        prisma.teacherQuizAttempt.findMany({
          where: {
            studentId: { in: studentIds },
            quiz: { teacherId: session.user.id }
          },
          select: {
            studentId: true,
            percentage: true
          }
        }),
        prisma.closedQuizSubmission.findMany({
          where: {
            studentId: { in: studentIds },
            quiz: { teacherId: session.user.id }
          },
          select: {
            studentId: true,
            score: true,
            maxScore: true,
            status: true
          }
        })
      ])

      for (const sId of studentIds) {
        statsByStudent.set(sId, { count: 0, pctSum: 0, pctCount: 0 })
      }

      for (const sub of assignSubs) {
        const entry = statsByStudent.get(sub.studentId)
        if (!entry) continue
        entry.count += 1
        if (sub.status === 'graded' && sub.score !== null && sub.assignment?.maxScore > 0) {
          entry.pctSum += (sub.score / sub.assignment.maxScore) * 100
          entry.pctCount += 1
        }
      }

      for (const att of openAttempts) {
        const entry = statsByStudent.get(att.studentId)
        if (!entry) continue
        entry.count += 1
        if (Number.isFinite(att.percentage)) {
          entry.pctSum += att.percentage
          entry.pctCount += 1
        }
      }

      for (const sub of closedSubs) {
        const entry = statsByStudent.get(sub.studentId)
        if (!entry) continue
        entry.count += 1
        if (sub.status === 'graded' && sub.score !== null && sub.maxScore > 0) {
          entry.pctSum += (sub.score / sub.maxScore) * 100
          entry.pctCount += 1
        }
      }
    }

    const studentsWithStats = filtered.map((ts) => {
      const st = statsByStudent.get(ts.student.id) || { count: 0, pctSum: 0, pctCount: 0 }
      return {
        ...ts,
        stats: {
          totalSubmissions: st.count,
          avgScore: st.pctCount > 0 ? Math.round(st.pctSum / st.pctCount) : null
        }
      }
    })

    // Guruhlar ro'yxati (filter uchun)
    const groups = await prisma.teacherGroup.findMany({
      where: { teacherId: session.user.id },
      select: {
        id: true,
        name: true,
        color: true,
        _count: { select: { students: { where: { holat: 'faol' } } } }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      students: studentsWithStats,
      groups,
      total: studentsWithStats.length
    })
  } catch (error) {
    console.error('[Talaba GET]', error)
    return NextResponse.json({ error: 'Talabalarni yuklashda xatolik yuz berdi' }, { status: 500 })
  }
}

// POST - Talabani qo'shish (userId, username yoki email orqali)
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
    const identifier = data.identifier?.trim()
    const groupId = data.groupId || null

    if (!identifier) {
      return NextResponse.json(
        { error: 'Talabaning ID, username yoki emailini kiriting' },
        { status: 400 }
      )
    }

    // Talabani topish (userId, username yoki email orqali)
    const student = await prisma.user.findFirst({
      where: {
        isBanned: false,
        OR: [
          { id: identifier },
          { userId: identifier },
          { username: { equals: identifier, mode: 'insensitive' } },
          { email: { equals: identifier, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        userId: true,
        username: true,
        fullName: true,
        email: true,
        avatar: true,
        role: true,
        university: true,
        totalPoints: true
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: `"${identifier}" bo'yicha foydalanuvchi topilmadi` },
        { status: 404 }
      )
    }

    // O'zini qo'sha olmaydi
    if (student.id === session.user.id) {
      return NextResponse.json(
        { error: 'O\'zingizni talaba sifatida qo\'sha olmaysiz' },
        { status: 400 }
      )
    }

    // Guruh tekshiruvi
    let guruh = null
    if (groupId) {
      guruh = await prisma.teacherGroup.findFirst({
        where: { id: groupId, teacherId: session.user.id },
        select: { id: true, name: true }
      })
      if (!guruh) {
        return NextResponse.json(
          { error: 'Tanlangan guruh topilmadi' },
          { status: 404 }
        )
      }
    }

    // Allaqachon shu guruhga yozuv bormi?
    const existing = await prisma.teacherStudent.findFirst({
      where: {
        teacherId: session.user.id,
        studentId: student.id,
        groupId: groupId
      }
    })

    if (existing) {
      if (existing.holat === 'sorov') {
        return NextResponse.json(
          { error: `${student.fullName || student.username} ga taklif allaqachon yuborilgan (javob kutilmoqda)` },
          { status: 400 }
        )
      }
      if (existing.holat === 'faol') {
        return NextResponse.json(
          { error: `${student.fullName || student.username} allaqachon shu guruhda bor` },
          { status: 400 }
        )
      }
    }

    // Agar ilgari rad etilgan ('rad') yozuv bo'lsa, uni qayta 'sorov'ga o'tkazamiz;
    // aks holda yangi taklif yozuvi yaratamiz.
    const teacherStudent = existing
      ? await prisma.teacherStudent.update({
          where: { id: existing.id },
          data: {
            holat: 'sorov',
            joinedAt: new Date(),
            javobVaqt: null,
          },
          include: {
            student: true,
            group: { select: { id: true, name: true, color: true } }
          }
        })
      : await prisma.teacherStudent.create({
          data: {
            teacherId: session.user.id,
            studentId: student.id,
            groupId: groupId,
            holat: 'sorov',
          },
          include: {
            student: true,
            group: { select: { id: true, name: true, color: true } }
          }
        })

    // Talabaga bildirishnoma — u /profil/ustozim da qabul qiladi
    const ustozNomi = session.user.fullName || session.user.name || session.user.username || 'Ustoz'
    const guruhMatni = guruh ? `"${guruh.name}" guruhiga` : "o'z guruhiga"
    createNotification({
      userId: student.id,
      title: 'Ustozdan guruhga taklif',
      message: `${ustozNomi} sizni ${guruhMatni} taklif qildi. Qabul qilish uchun "Mening ustozim" bo'limiga o'ting.`,
      type: 'system',
      icon: '🎓',
      link: '/profil/ustozim',
      sentBy: session.user.id,
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      teacherStudent,
      message: `✓ ${student.fullName || student.username} ga taklif yuborildi (qabul qilishi kutilmoqda)`
    })
  } catch (error) {
    console.error('[Talaba POST]', error)
    return NextResponse.json({ error: 'Talabani taklif qilishda xatolik yuz berdi' }, { status: 500 })
  }
}

// PUT - Talabaning guruhini o'zgartirish
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
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const existing = await prisma.teacherStudent.findFirst({
      where: { id: data.id, teacherId: session.user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })
    }

    const nextGroupId = data.groupId || null
    if (nextGroupId) {
      const ownedGroup = await prisma.teacherGroup.findFirst({
        where: { id: nextGroupId, teacherId: session.user.id },
        select: { id: true }
      })
      if (!ownedGroup) {
        return NextResponse.json({ error: 'Guruh topilmadi yoki sizga tegishli emas' }, { status: 404 })
      }
    }

    const updated = await prisma.teacherStudent.update({
      where: { id: data.id },
      data: { groupId: nextGroupId },
      include: {
        student: true,
        group: { select: { id: true, name: true, color: true } }
      }
    })

    return NextResponse.json({
      success: true,
      teacherStudent: updated,
      message: '✓ Talaba guruhi yangilandi'
    })
  } catch (error) {
    console.error('[Talaba PUT]', error)
    return NextResponse.json({ error: 'Talaba guruhini yangilashda xatolik yuz berdi' }, { status: 500 })
  }
}

// DELETE - Talabani ro'yxatdan chiqarish
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
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const existing = await prisma.teacherStudent.findFirst({
      where: { id, teacherId: session.user.id },
      include: { student: { select: { fullName: true, username: true } } }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })
    }

    await prisma.teacherStudent.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: `✓ ${existing.student.fullName || existing.student.username} ro'yxatdan chiqarildi`
    })
  } catch (error) {
    console.error('[Talaba DELETE]', error)
    return NextResponse.json({ error: 'Talabani chiqarishda xatolik yuz berdi' }, { status: 500 })
  }
}
