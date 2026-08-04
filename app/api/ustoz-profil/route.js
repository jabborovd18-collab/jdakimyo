// app/api/ustoz-profil/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

// GET - O'qituvchi o'z ommaviy profilini olish (sozlash uchun)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let profile = await prisma.teacherPublicProfile.findUnique({
      where: { userId: session.user.id }
    })

    // PROFIL BU YERDA YARATILMAYDI.
    //
    // Avval GET so'rovining o'zi yozuv yaratardi va `isActive` sukut
    // bo'yicha `true` bo'lgani uchun sozlash sahifasini bir marta ochgan
    // odam — masalan atrofni ko'rib chiqayotgan admin — bilmagan holda
    // OMMAVIY ustoz profiliga ega bo'lib qolardi. O'qish so'rovi hech
    // narsa nashr qilmasligi kerak.
    //
    // Endi shakl bo'sh qiymatlar bilan to'ldiriladi, yozuv esa odam
    // "Saqlash" ni bosganda (PUT) yaratiladi.
    if (!profile) {
      // Bazadan o'qiymiz: sessiyada `university`/`faculty`/`bio` yo'q va
      // avval ular har doim `undefined` bo'lib, hech narsa to'ldirmasdi.
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { fullName: true, username: true, university: true, faculty: true, bio: true },
      })

      profile = {
        userId: session.user.id,
        displayName: user?.fullName || user?.username || '',
        university: user?.university || null,
        department: user?.faculty || null,
        bio: user?.bio || null,
        specialties: [],
        education: [],
        awards: [],
        researchAreas: [],
        currentProjects: [],
        courses: [],
        themeColor: 'purple',
        showEmail: false,
        showPhone: false,
        showStats: true,
        showCourses: true,
        showPublications: true,
        // Yangi profil sukut bo'yicha YOPIQ: nashr qilish ongli qaror
        // bo'lsin, tasodifan yoqilib qolmasin.
        isActive: false,
        views: 0,
        saqlanmagan: true,
      }
    }

    // Qo'shimcha statistika (dashboard uchun)
    const [studentsCount, groupsCount, quizzesCount, assignmentsCount] = await Promise.all([
      prisma.teacherStudent.count({ where: { teacherId: session.user.id, holat: 'faol' } }),
      prisma.teacherGroup.count({ where: { teacherId: session.user.id } }),
      prisma.teacherQuiz.count({ where: { teacherId: session.user.id } }),
      prisma.assignment.count({ where: { teacherId: session.user.id } })
    ])

    return NextResponse.json({
      success: true,
      profile,
      stats: {
        students: studentsCount,
        groups: groupsCount,
        quizzes: quizzesCount,
        assignments: assignmentsCount
      }
    })
  } catch (error) {
    console.error('[Teacher Profile GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * Butun songa aylantiradi, aylanmasa null qaytaradi.
 *
 * Avval hamma joyda to'g'ridan-to'g'ri `parseInt(...)` yozilgan edi:
 * bo'sh bo'lmagan, lekin son bo'lmagan qiymat (masalan "ikki") NaN
 * berardi va Prisma uni qabul qilmay 500 bilan yiqilardi. Foydalanuvchi
 * "Xatolik" dan boshqa hech narsa ko'rmasdi.
 */
function son(qiymat) {
  if (qiymat === null || qiymat === undefined || qiymat === '') return null
  const n = parseInt(qiymat, 10)
  return Number.isNaN(n) ? null : n
}

// PUT - O'qituvchi o'z ommaviy profilini yangilashi
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

    // Validatsiya
    if (data.displayName && data.displayName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Ism kamida 2 ta harfdan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    // Mavjud profilni tekshirish
    const existing = await prisma.teacherPublicProfile.findUnique({
      where: { userId: session.user.id }
    })

    let profile
    if (existing) {
      profile = await prisma.teacherPublicProfile.update({
        where: { userId: session.user.id },
        data: {
          displayName: data.displayName?.trim() || null,
          title: data.title?.trim() || null,
          bio: data.bio?.trim() || null,
          university: data.university?.trim() || null,
          department: data.department?.trim() || null,
          position: data.position?.trim() || null,
          experienceYears: son(data.experienceYears),
          specialties: data.specialties || [],
          education: data.education || [],
          publications: son(data.publications),
          citations: son(data.citations),
          hIndex: son(data.hIndex),
          awards: data.awards || [],
          researchAreas: data.researchAreas || [],
          currentProjects: data.currentProjects || [],
          courses: data.courses || [],
          website: data.website?.trim() || null,
          googleScholar: data.googleScholar?.trim() || null,
          researchGate: data.researchGate?.trim() || null,
          orcid: data.orcid?.trim() || null,
          scopus: data.scopus?.trim() || null,
          showEmail: data.showEmail ?? false,
          showPhone: data.showPhone ?? false,
          showStats: data.showStats ?? true,
          showCourses: data.showCourses ?? true,
          showPublications: data.showPublications ?? true,
          themeColor: data.themeColor || 'purple',
          coverImage: data.coverImage?.trim() || null,
          bannerQuote: data.bannerQuote?.trim() || null,
          isActive: data.isActive ?? true
        }
      })
    } else {
      profile = await prisma.teacherPublicProfile.create({
        data: {
          userId: session.user.id,
          displayName: data.displayName?.trim() || session.user.fullName || session.user.username,
          title: data.title?.trim() || null,
          bio: data.bio?.trim() || null,
          university: data.university?.trim() || null,
          department: data.department?.trim() || null,
          position: data.position?.trim() || null,
          experienceYears: son(data.experienceYears),
          specialties: data.specialties || [],
          education: data.education || [],
          publications: son(data.publications),
          citations: son(data.citations),
          hIndex: son(data.hIndex),
          awards: data.awards || [],
          researchAreas: data.researchAreas || [],
          currentProjects: data.currentProjects || [],
          courses: data.courses || [],
          website: data.website?.trim() || null,
          googleScholar: data.googleScholar?.trim() || null,
          researchGate: data.researchGate?.trim() || null,
          orcid: data.orcid?.trim() || null,
          scopus: data.scopus?.trim() || null,
          showEmail: data.showEmail ?? false,
          showPhone: data.showPhone ?? false,
          showStats: data.showStats ?? true,
          showCourses: data.showCourses ?? true,
          showPublications: data.showPublications ?? true,
          themeColor: data.themeColor || 'purple',
          coverImage: data.coverImage?.trim() || null,
          bannerQuote: data.bannerQuote?.trim() || null,
          isActive: data.isActive ?? true
        }
      })
    }

    return NextResponse.json({
      success: true,
      profile,
      message: '✓ Ommaviy profil muvaffaqiyatli yangilandi'
    })
  } catch (error) {
    console.error('[Teacher Profile PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}