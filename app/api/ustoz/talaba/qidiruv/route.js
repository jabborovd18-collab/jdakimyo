// app/api/ustoz/talaba/qidiruv/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

// GET - O'qituvchi o'z talabalarini topishi uchun foydalanuvchilarni qidirish
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

    // EMAIL BO'YICHA QIDIRILMAYDI VA QAYTARILMAYDI.
    //
    // Avval ikkalasi ham bor edi: ustoz huquqiga ega har qanday odam
    // butun bazani email bo'yicha varaqlab chiqishi va har bir
    // foydalanuvchining pochtasini ko'rishi mumkin edi. Email profilning
    // ochiq qismi emas va `lib/maxfiylik.js` sozlamalari ham bu yerda
    // hisobga olinmasdi.
    //
    // Talabani topish uchun username va ism yetarli; noaniqlik qolsa
    // universitet va fakultet ajratib beradi.
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: search, mode: 'insensitive' } },
              { fullName: { contains: search, mode: 'insensitive' } }
            ]
          },
          { id: { not: session.user.id } },
          { id: { notIn: existingIds } },
          // Bloklangan hisoblar guruhga qo'shilmasin
          { isBanned: false }
        ]
      },
      select: {
        id: true,
        userId: true,
        username: true,
        fullName: true,
        avatar: true,
        university: true,
        faculty: true,
        role: true,
        isVerified: true
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