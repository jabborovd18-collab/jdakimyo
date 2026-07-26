import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Kirish talab qilinadi' }, { status: 401 })
    }

    const memberships = await prisma.teacherStudent.findMany({
      where: { studentId: session.user.id },
      include: {
        teacher: { select: { id: true, fullName: true, username: true, avatar: true, university: true } },
        group: { select: { id: true, name: true, color: true } }
      },
      orderBy: { joinedAt: 'desc' }
    })
    const groupIds = memberships.map((membership) => membership.groupId).filter(Boolean)
    const teacherIds = memberships.map((membership) => membership.teacherId)

    const [assignments, announcements, quizzes] = await Promise.all([
      prisma.assignment.findMany({
        where: { groupId: { in: groupIds }, isDraft: false },
        include: {
          teacher: { select: { fullName: true, username: true } },
          group: { select: { name: true } },
          submissions: { where: { studentId: session.user.id }, select: { id: true, score: true, status: true, submittedAt: true } }
        },
        orderBy: { deadline: 'asc' },
        take: 30
      }),
      prisma.announcement.findMany({
        where: { groupId: { in: groupIds } },
        include: {
          teacher: { select: { fullName: true, username: true } },
          group: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 30
      }),
      prisma.teacherQuiz.findMany({
        where: { OR: [{ isPublic: true }, { groupId: { in: groupIds } }, { teacherId: { in: teacherIds } }] },
        include: {
          teacher: { select: { fullName: true, username: true } },
          group: { select: { name: true } },
          _count: { select: { questions: true } },
          attempts: { where: { studentId: session.user.id }, select: { percentage: true, completedAt: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 30
      })
    ])

    return NextResponse.json({ success: true, memberships, assignments, announcements, quizzes })
  } catch (error) {
    console.error('[Profile learning]', error)
    return NextResponse.json({ error: "O'quv ma'lumotlarini yuklab bo'lmadi" }, { status: 500 })
  }
}
