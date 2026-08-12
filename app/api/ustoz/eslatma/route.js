// app/api/ustoz/eslatma/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'
import { xabarYubor } from '@/lib/bildirishnoma'
import { sanaVaqt } from '@/lib/sana'

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

    const { type, id } = await request.json()
    if (!type || !id) {
      return NextResponse.json({ error: 'type va id majburiy' }, { status: 400 })
    }

    let title = ''
    let deadline = null
    let groupId = null
    let havola = ''
    let submittedStudentIds = new Set()

    if (type === 'quiz') {
      const quiz = await prisma.teacherQuiz.findFirst({
        where: { id, teacherId: session.user.id },
        include: { attempts: { select: { studentId: true } } }
      })
      if (!quiz) return NextResponse.json({ error: 'Test topilmadi' }, { status: 404 })
      title = quiz.title
      deadline = quiz.deadline
      groupId = quiz.groupId
      havola = `/oquv/video-darsliklar/ustoz-quiz/${quiz.id}`
      quiz.attempts.forEach(a => submittedStudentIds.add(a.studentId))
    } else if (type === 'yopiq_quiz') {
      const quiz = await prisma.closedQuiz.findFirst({
        where: { id, teacherId: session.user.id },
        include: { submissions: { select: { studentId: true } } }
      })
      if (!quiz) return NextResponse.json({ error: 'Yozma test topilmadi' }, { status: 404 })
      title = quiz.title
      deadline = quiz.deadline
      groupId = quiz.groupId
      havola = `/oquv/video-darsliklar/ustoz-yopiq-quiz/${quiz.id}`
      quiz.submissions.forEach(s => submittedStudentIds.add(s.studentId))
    } else if (type === 'assignment') {
      const assignment = await prisma.assignment.findFirst({
        where: { id, teacherId: session.user.id },
        include: { submissions: { select: { studentId: true } } }
      })
      if (!assignment) return NextResponse.json({ error: 'Vazifa topilmadi' }, { status: 404 })
      title = assignment.title
      deadline = assignment.deadline
      groupId = assignment.groupId
      havola = `/profil/vazifalar`
      assignment.submissions.forEach(s => submittedStudentIds.add(s.studentId))
    } else {
      return NextResponse.json({ error: 'Noma\'lum tur' }, { status: 400 })
    }

    // Topshirmagan talabalarni topish
    const targetStudents = await prisma.teacherStudent.findMany({
      where: {
        teacherId: session.user.id,
        holat: 'faol',
        ...(groupId && { groupId })
      },
      select: { studentId: true }
    })

    const unsubmittedStudents = targetStudents
      .map(ts => ts.studentId)
      .filter(sid => !submittedStudentIds.has(sid))

    if (unsubmittedStudents.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: 'Barcha talabalar ushbu topshiriqni allaqachon topshirgan yoki faol talaba yo\'q'
      })
    }

    const teacherName = session.user.fullName || session.user.username
    const muddatMatni = deadline ? sanaVaqt(deadline) : 'yaqin orada'

    // Har bir topshirmagan talabaga bildirishnoma yuborish
    await Promise.all(
      unsubmittedStudents.map(studentId =>
        xabarYubor(studentId, {
          turi: 'tizim',
          sarlavha: `⏰ Eslatma: "${title}"`,
          matn: `Ustoz ${teacherName} eslatadi: Topshirish muhlati — ${muddatMatni}. Iltimos, topshiriqni o'z vaqtida bajaring.`,
          havola,
          icon: '⏰',
          adminId: session.user.id
        })
      )
    )

    return NextResponse.json({
      success: true,
      count: unsubmittedStudents.length,
      message: `✓ Topshirmagan ${unsubmittedStudents.length} ta talabaga eslatma yuborildi`
    })
  } catch (error) {
    console.error('[Ustoz Eslatma Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
