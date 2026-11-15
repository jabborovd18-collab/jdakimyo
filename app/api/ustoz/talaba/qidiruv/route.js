// app/api/ustoz/talaba/qidiruv/route.js
// Ustoz talabani guruhga taklif qilishdan oldin qidiradi
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!ustozPaneliOchiqmi(session.user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    const groupId = searchParams.get('groupId') || null

    if (q.length < 2) {
      return NextResponse.json({ users: [] })
    }

    // Faqat allaqachon faol yoki javob kutilayotgan ('sorov') talabalarni ro'yxatdan chiqaramiz.
    // Rad etgan ('rad') talabani ustoz qayta qidirib taklif yubora olishi kerak.
    const mavjud = await prisma.teacherStudent.findMany({
      where: {
        teacherId: session.user.id,
        holat: { in: ['faol', 'sorov'] },
        ...(groupId ? { groupId } : {}),
      },
      select: { studentId: true },
    })
    const mavjudIdlar = mavjud.map((m) => m.studentId)

    const users = await prisma.user.findMany({
      where: {
        id: { notIn: [session.user.id, ...mavjudIdlar] },
        isBanned: false,
        OR: [
          { fullName: { contains: q, mode: 'insensitive' } },
          { username: { contains: q, mode: 'insensitive' } },
          { userId: { contains: q } },
        ],
      },
      select: {
        id: true,
        userId: true,
        username: true,
        fullName: true,
        avatar: true,
        role: true,
        university: true,
        level: true,
        totalPoints: true,
        isVerified: true,
        premiumUslub: true,
      },
      orderBy: { totalPoints: 'desc' },
      take: 15,
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('[Talaba Qidiruv]', error)
    return NextResponse.json({ error: 'Qidiruvda xatolik' }, { status: 500 })
  }
}
