// app/api/ustoz-profil/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Ommaviy o'qituvchi profili
export async function GET(request, { params }) {
  try {
    const { id: paramId } = await params

    if (!paramId) {
      return NextResponse.json({ error: 'ID berilmadi' }, { status: 400 })
    }

    // 1. Foydalanuvchini topish: CUID id, public userId yoki username bo'yicha
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: paramId },
          { userId: paramId },
          { username: paramId }
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
        isTeacher: true,
        isVerified: true,
        bio: true,
        email: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Foydalanuvchi topilmadi' },
        { status: 404 }
      )
    }

    const session = await getServerSession(authOptions)
    const isOwner = session?.user?.id === user.id

    // 2. Ustoz profilini bazadan olish
    let profile = await prisma.teacherPublicProfile.findUnique({
      where: { userId: user.id }
    })

    // Agar profil yashirilgan bo'lsa va ko'rayotgan odam ustozning o'zi bo'lmasa
    if (profile && !profile.isActive && !isOwner) {
      return NextResponse.json(
        { error: 'O\'qituvchi profili hozirda yashirilgan' },
        { status: 404 }
      )
    }

    // Agar profil yozuvi hali yaratilmagan bo'lsa (boshlang'ich holat)
    if (!profile) {
      profile = {
        id: 'temp-' + user.id,
        userId: user.id,
        displayName: user.fullName || user.username,
        title: 'Kimyo o\'qituvchisi',
        bio: user.bio || '',
        university: user.university || '',
        department: user.faculty || '',
        position: 'O\'qituvchi',
        experienceYears: null,
        specialties: ['Koordinatsion kimyo', 'Oliy kimyo'],
        education: [],
        publications: null,
        citations: null,
        hIndex: null,
        awards: [],
        researchAreas: [],
        currentProjects: [],
        courses: [],
        website: null,
        googleScholar: null,
        researchGate: null,
        orcid: null,
        scopus: null,
        showEmail: false,
        showPhone: false,
        showStats: true,
        showCourses: true,
        showPublications: true,
        themeColor: 'purple',
        coverImage: null,
        bannerQuote: null,
        isActive: true,
        isVerified: user.isVerified || false,
        views: 0
      }
    }

    // Email faqat ustoz ruxsat berganda ochiq ko'rinadi
    const userCopy = { ...user }
    if (!profile.showEmail) {
      delete userCopy.email
    }
    profile.user = userCopy

    // Ko'rishlar sonini oshirish (faqat begonalar ko'rganda)
    if (!isOwner && profile.id && !profile.id.startsWith('temp-')) {
      await prisma.teacherPublicProfile.update({
        where: { id: profile.id },
        data: { views: { increment: 1 } }
      }).catch(() => {})
      profile.views = (profile.views || 0) + 1
    }

    // 3. Statistika
    const [studentsCount, groupsCount, activeQuizzes, activeAssignments] = await Promise.all([
      prisma.teacherStudent.count({ where: { teacherId: user.id, holat: 'faol' } }),
      prisma.teacherGroup.count({ where: { teacherId: user.id } }),
      prisma.teacherQuiz.count({ 
        where: { teacherId: user.id, isDraft: false } 
      }),
      prisma.assignment.count({ 
        where: { 
          teacherId: user.id, 
          isDraft: false,
          deadline: { gte: new Date() }
        } 
      })
    ])

    const stats = {
      students: studentsCount,
      groups: groupsCount,
      quizzes: activeQuizzes,
      assignments: activeAssignments
    }

    // 4. Ochiq testlar
    const publicQuizzes = await prisma.teacherQuiz.findMany({
      where: {
        teacherId: user.id,
        isDraft: false,
        isPublic: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        timeLimit: true,
        maxAttempts: true,
        _count: { select: { questions: true, attempts: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    })

    return NextResponse.json({
      success: true,
      profile,
      stats,
      activeCourses: profile.courses || [],
      publicQuizzes
    })
  } catch (error) {
    console.error('[Teacher Public Profile GET Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
