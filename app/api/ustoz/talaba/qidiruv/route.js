// app/api/ustoz/talaba/qidiruv/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - O'qituvchi o'z talabalarini topishi uchun foydalanuvchilarni qidirish
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ['teacher', 'admin', 'superadmin', 'moderator'].includes(session.user.role)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const groupId = searchParams.get('groupId') || ''

    if (!search || search.length < 2) {
      return NextResponse.json({ users: [] })
    }

    // O'qituvchining allaqachon guruhiga qo'shilgan talabalarini olish
    const existingStudents = groupId 
      ? await prisma.teacherStudent.findMany({
          where: {
            teacherId: session.user.id,
            groupId
          },
          select: { studentId: true }
        })
      : []

    const existingIds = existingStudents.map(s => s.studentId)

    // Foydalanuvchilarni qidirish (o'qituvchining o'zi va allaqachon qo'shilganlar chiqariladi)
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { fullName: { contains: search, mode: 'insensitive' } }
            ]
          },
          { id: { not: session.user.id } },
          { id: { notIn: existingIds } }
        ]
      },
      select: {
        id: true,
        userId: true,
        username: true,
        fullName: true,
        email: true,
        avatar: true,
        university: true,
        faculty: true,
        role: true
      },
      take: 10,
      orderBy: { fullName: 'asc' }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('[Talaba Qidiruv GET]', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}