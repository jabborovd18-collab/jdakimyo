// app/api/ustoz/dashboard/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ustozPaneliOchiqmi } from '@/lib/roles'

// GET - O'qituvchi dashboard ma'lumotlari
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // O'qituvchi yoki admin roli tekshiruv
    const isTeacher = ustozPaneliOchiqmi(session.user)
    if (!isTeacher) {
      return NextResponse.json({ error: 'Forbidden - O\'qituvchi huquqi kerak' }, { status: 403 })
    }

    const teacherId = session.user.id

    // Parallel ravishda barcha statistikalarni olish
    const [
      totalStudents,
      totalGroups,
      activeAssignments,
      pendingSubmissions,
      totalAnnouncements,
      recentAssignments,
      recentSubmissions,
      recentAnnouncements
    ] = await Promise.all([
      // Jami talabalar — faqat taklifni qabul qilganlar. Kutilayotgan
      // taklifni sanash raqamni haqiqatdan uzoqlashtirardi.
      prisma.teacherStudent.count({
        where: { teacherId, holat: 'faol' }
      }),

      // Jami guruhlar
      prisma.teacherGroup.count({
        where: { teacherId }
      }),

      // Faol vazifalar (deadline hali o'tmagan)
      prisma.assignment.count({
        where: {
          teacherId,
          deadline: { gte: new Date() }
        }
      }),

      // Tekshirish kerak bo'lgan topshiriqlar
      prisma.assignmentSubmission.count({
        where: {
          assignment: { teacherId },
          status: 'pending'
        }
      }),

      // Jami e'lonlar
      prisma.announcement.count({
        where: { teacherId }
      }),

      // Oxirgi 5 ta vazifa
      prisma.assignment.findMany({
        where: { teacherId },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          group: { select: { name: true } },
          _count: { select: { submissions: true } }
        }
      }),

      // Oxirgi 5 ta topshiriq
      prisma.assignmentSubmission.findMany({
        where: {
          assignment: { teacherId }
        },
        orderBy: { submittedAt: 'desc' },
        take: 3,
        include: {
          student: { select: { fullName: true, username: true } },
          assignment: { select: { title: true } }
        }
      }),

      // Oxirgi e'lonlar
      prisma.announcement.findMany({
        where: { teacherId },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          group: { select: { name: true } }
        }
      })
    ])

    // Oxirgi faoliyat: uch manbani birlashtirib, vaqt bo'yicha saralaymiz.
    //
    // Avval bu yerda ikkita xato bor edi. Birinchisi — saralashdan OLDIN
    // `.slice(0, 5)` chaqirilardi, ya'ni ro'yxat qirqilib, eng yangi
    // yozuvlar tushib qolishi mumkin edi. Ikkinchisi — saralash
    // `new Date(a.time)` bo'yicha ketardi, `time` esa allaqachon
    // "3 daqiqa oldin" degan MATN edi: `new Date(...)` dan NaN chiqib,
    // taqqoslash hech narsa qilmasdi.
    //
    // Shuning uchun xom sanani (`vaqt`) alohida saqlaymiz: saralash
    // shu bo'yicha ketadi, ko'rsatiladigan matn esa oxirida yasaladi.
    const recentActivity = [
      ...recentSubmissions.map(s => ({
        icon: '📝',
        title: `${s.student.fullName || s.student.username} "${s.assignment.title}" ni topshirdi`,
        vaqt: s.submittedAt,
        count: s.status === 'pending' ? '⏳ Kutilmoqda' : '✓'
      })),
      ...recentAssignments.map(a => ({
        icon: '➕',
        title: `Yangi vazifa: "${a.title}"`,
        vaqt: a.createdAt,
        count: `${a._count.submissions} topshiriq`
      })),
      ...recentAnnouncements.map(an => ({
        icon: '📢',
        title: `E'lon: "${an.title}"`,
        vaqt: an.createdAt,
        count: an.group?.name || 'Barcha'
      }))
    ]
      .sort((a, b) => new Date(b.vaqt) - new Date(a.vaqt))
      .slice(0, 5)
      .map(({ vaqt, ...qolgani }) => ({ ...qolgani, time: formatTimeAgo(vaqt) }))

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        totalGroups,
        activeAssignments,
        pendingSubmissions,
        totalAnnouncements
      },
      recentActivity
    })

  } catch (error) {
    console.error('[Ustoz Dashboard GET]', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}

// Yordamchi funksiya: "necha daqiqa/soat/kun oldin"
function formatTimeAgo(date) {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'hozirgina'
  if (diffMin < 60) return `${diffMin} daqiqa oldin`
  if (diffHour < 24) return `${diffHour} soat oldin`
  if (diffDay < 7) return `${diffDay} kun oldin`
  return then.toLocaleDateString('uz-UZ')
}