// app/api/ustoz-profil/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Ommaviy o'qituvchi profili (har kim ko'ra oladi)
export async function GET(request, { params }) {
  try {
    const userId = params.id

    // Profilni olish (faqat isActive bo'lsa)
    const profile = await prisma.teacherPublicProfile.findFirst({
      where: { 
        userId,
        isActive: true
      },
      include: {
        user: {
          select: {
            id: true,
            userId: true,
            username: true,
            fullName: true,
            avatar: true,
            university: true,
            faculty: true,
            role: true,
            // Sozlamada "email ko'rsatilsin" yoqilgan bo'lsagina qaytariladi —
            // pastda tekshiriladi va aks holda javobdan olib tashlanadi.
            email: true
          }
        }
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'O\'qituvchi profili topilmadi yoki yashirilgan' },
        { status: 404 }
      )
    }

    // Email ochiq kontentga faqat ustozning o'zi ruxsat berganda chiqadi
    if (!profile.showEmail) {
      delete profile.user.email
    }

    // Ko'rishlar sonini oshirish
    await prisma.teacherPublicProfile.update({
      where: { id: profile.id },
      data: { views: { increment: 1 } }
    })

    // Statistika (agar showStats yoqilgan bo'lsa)
    let stats = null
    if (profile.showStats) {
      const [studentsCount, groupsCount, activeQuizzes, activeAssignments] = await Promise.all([
        prisma.teacherStudent.count({ where: { teacherId: userId } }),
        prisma.teacherGroup.count({ where: { teacherId: userId } }),
        prisma.teacherQuiz.count({ 
          where: { teacherId: userId, isDraft: false } 
        }),
        prisma.assignment.count({ 
          where: { 
            teacherId: userId, 
            isDraft: false,
            deadline: { gte: new Date() }
          } 
        })
      ])

      stats = {
        students: studentsCount,
        groups: groupsCount,
        quizzes: activeQuizzes,
        assignments: activeAssignments
      }
    }

    // Aktiv kurslar (agar showCourses yoqilgan bo'lsa)
    let activeCourses = []
    if (profile.showCourses && profile.courses) {
      activeCourses = profile.courses
    }

    // Ochiq quizlar (talabalar yechishi mumkin)
    const publicQuizzes = await prisma.teacherQuiz.findMany({
      where: {
        teacherId: userId,
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
      activeCourses,
      publicQuizzes
    })
  } catch (error) {
    console.error('[Teacher Public Profile GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}