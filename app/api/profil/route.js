// app/api/profil/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const USER_FIELDS = {
  id: true,
  userId: true,
  username: true,
  email: true,
  fullName: true,
  role: true,
  avatar: true,
  bio: true,
  university: true,
  faculty: true,
  specialty: true,
  level: true,
  telegram: true,
  instagram: true,
  linkedin: true,
  location: true,
  level_points: true,
  experience: true,
  totalPoints: true,
  currentStreak: true,
  longestStreak: true,
  // Yulduz akkaunt darajasini belgilaydi, lekin kabinetda ko'rinmasdi —
  // foydalanuvchi nechta yulduzi borligini faqat reyting sahifasidan
  // bilardi
  stars: true,
  lastActive: true,
  createdAt: true,
  birthDate: true,
  academicDegree: true,
  studentId: true,
  enrollmentYear: true,
  github: true,
  twitter: true,
  website: true,
  googleScholar: true,
  orcid: true,
  notificationSettings: true,
  interfaceSettings: true,
  learningPreferences: true,
}

// GET - Dashboard uchun yengil profil ma'lumotlari (to'liq ro'yxatlar emas, sonlar)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const [user, friendsAsUser1, friendsAsUser2, pendingFriendRequests] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          ...USER_FIELDS,
          quizResults: {
            orderBy: { completedAt: 'desc' },
            take: 5
          },
          _count: {
            select: {
              certificates: true,
              achievements: true,
              followers: true,
              following: true,
              quizResults: true
            }
          }
        }
      }),
      prisma.friendship.count({ where: { user1Id: userId } }),
      prisma.friendship.count({ where: { user2Id: userId } }),
      prisma.friendRequest.count({ where: { receiverId: userId, status: 'pending' } })
    ])

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { quizResults, _count, ...userFields } = user

    return NextResponse.json({
      user: userFields,
      quizResults,
      counts: {
        quizzes: _count.quizResults,
        certificates: _count.certificates,
        achievements: _count.achievements,
        followers: _count.followers,
        following: _count.following,
        friends: friendsAsUser1 + friendsAsUser2,
        pendingFriendRequests
      }
    })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { error: 'Profilni yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}

// PUT - Profilni yangilash (KENGAYTIRILGAN)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Ruxsat etilgan maydonlar (whitelist)
    const allowedFields = {
      // Shaxsiy
      fullName: 'string',
      bio: 'string',
      location: 'string',
      birthDate: 'string',

      // Akademik
      university: 'string',
      faculty: 'string',
      specialty: 'string',
      level: 'number',
      academicDegree: 'string',
      studentId: 'string',
      enrollmentYear: 'number',

      // Ijtimoiy
      telegram: 'string',
      instagram: 'string',
      linkedin: 'string',
      github: 'string',
      twitter: 'string',
      website: 'string',
      googleScholar: 'string',
      orcid: 'string',

      // Sozlamalar (JSON)
      notificationSettings: 'object',
      interfaceSettings: 'object',
      learningPreferences: 'object',
    }

    // Ma'lumotlarni tozalash
    const updateData = {}
    for (const [key, type] of Object.entries(allowedFields)) {
      if (data[key] !== undefined) {
        if (type === 'string' && typeof data[key] === 'string') {
          if (key === 'birthDate') {
            const date = new Date(data[key])
            if (!Number.isNaN(date.getTime())) updateData[key] = date
          } else {
            updateData[key] = data[key].trim() || null
          }
        } else if (type === 'number') {
          const num = parseInt(data[key])
          if (!isNaN(num)) updateData[key] = num
        } else if (type === 'object' && typeof data[key] === 'object') {
          updateData[key] = data[key]
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Yangilanishi kerak bo'lgan ma'lumot yo'q" },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        bio: true,
        location: true,
        university: true,
        faculty: true,
        specialty: true,
        level: true,
        avatar: true,
        role: true,
        telegram: true,
        instagram: true,
        linkedin: true,
        github: true,
        twitter: true,
        website: true,
        googleScholar: true,
        orcid: true,
        birthDate: true,
        academicDegree: true,
        studentId: true,
        enrollmentYear: true,
        notificationSettings: true,
        interfaceSettings: true,
        learningPreferences: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "✓ Ma'lumotlar muvaffaqiyatli yangilandi"
    })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json(
      { error: 'Profilni yangilashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}
