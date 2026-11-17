// app/api/profil/export/route.js
// "Ma'lumotlarimni yuklab olish" (GDPR-uslubidagi to'liq eksport). Faqat foydalanuvchi
// o'zi so'raganda chaqiriladi (sozlamalar sahifasi) — shuning uchun bu yerda to'liq,
// hajmi katta so'rovga yo'l qo'yiladi; asosiy dashboard bu yo'ldan foydalanmaydi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { profilLogYoz, profilLoglarOlish } from '@/lib/profil-log'
import { postJadvaliniTayyorla } from '@/lib/post-baza'

const SAFE_USER_SELECT = {
  id: true,
  userId: true,
  username: true,
  fullName: true,
  avatar: true,
  university: true,
  role: true
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.doskaTugaydi) {
      return NextResponse.json({ error: "Elektron doskada ma'lumotlarni eksport qilib bo'lmaydi" }, { status: 403 })
    }

    const userId = session.user.id

    await postJadvaliniTayyorla().catch(() => {})

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        quizResults: { orderBy: { completedAt: 'desc' } },
        certificates: { orderBy: { issuedAt: 'desc' } },
        achievements: { orderBy: { earnedAt: 'desc' } },
        profilePosts: { orderBy: { createdAt: 'desc' } },
        assignmentSubmissions: {
          orderBy: { submittedAt: 'desc' },
          include: {
            assignment: { select: { id: true, title: true, maxScore: true } },
          },
        },
        quizAttempts: {
          orderBy: { completedAt: 'desc' },
          include: {
            quiz: { select: { id: true, title: true } },
          },
        },
        friendships1: { select: { createdAt: true, user2: { select: SAFE_USER_SELECT } } },
        friendships2: { select: { createdAt: true, user1: { select: SAFE_USER_SELECT } } },
        followers: { select: { createdAt: true, follower: { select: SAFE_USER_SELECT } } },
        following: { select: { createdAt: true, following: { select: SAFE_USER_SELECT } } }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const friends = [
      ...user.friendships1.map(f => ({ ...f.user2, since: f.createdAt })),
      ...user.friendships2.map(f => ({ ...f.user1, since: f.createdAt }))
    ]
    const followers = user.followers.map(f => ({ ...f.follower, since: f.createdAt }))
    const following = user.following.map(f => ({ ...f.following, since: f.createdAt }))

    const {
      password,
      kirishXatolari,
      kirishTaqiqUntil,
      friendships1, friendships2,
      followers: _rawFollowers, following: _rawFollowing,
      quizResults: _rawQuizResults, certificates: _rawCertificates, achievements: _rawAchievements,
      profilePosts: _rawPosts,
      assignmentSubmissions: _rawSubmissions,
      quizAttempts: _rawQuizAttempts,
      ...userFields
    } = user

    const [msUrinishlar, logMalumot] = await Promise.all([
      prisma.msUrinish.findMany({
        where: { userId },
        select: {
          id: true,
          slug: true,
          holat: true,
          shkalaBalli: true,
          daraja: true,
          theta: true,
          se: true,
          rawScore: true,
          jamiSavollar: true,
          oddiyFoiz: true,
          cohortRank: true,
          cohortTotal: true,
          percentile: true,
          certId: true,
          boshlanganVaqt: true,
          yakunlanganVaqt: true,
        },
        orderBy: { boshlanganVaqt: 'desc' },
      }).catch(() => []),
      profilLoglarOlish(userId, { limit: 100 }).catch(() => ({ barchaFiltrlangan: [] })),
    ])

    const xavfsizMsUrinishlar = msUrinishlar.map((u) =>
      u.holat === 'elon_qilindi'
        ? u
        : {
            id: u.id,
            slug: u.slug,
            holat: u.holat,
            boshlanganVaqt: u.boshlanganVaqt,
            yakunlanganVaqt: u.yakunlanganVaqt,
          },
    )

    await profilLogYoz({
      userId,
      toifa: 'hisob',
      amal: 'MALUMOT_EKSPORT_QILINDI',
      sarlavha: "Shaxsiy ma'lumotlar eksport qilindi",
      holat: 'muvaffaqiyat',
      request,
    })

    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      user: userFields,
      quizResults: user.quizResults,
      msUrinishlar: xavfsizMsUrinishlar,
      certificates: user.certificates,
      achievements: user.achievements,
      profilePosts: user.profilePosts,
      assignmentSubmissions: user.assignmentSubmissions,
      teacherQuizAttempts: user.quizAttempts,
      profilLoglar: (logMalumot?.barchaFiltrlangan || []).slice(0, 100),
      friends,
      followers,
      following
    })
  } catch (error) {
    console.error('Profile export error:', error)
    return NextResponse.json(
      { error: "Ma'lumotlarni eksport qilishda xatolik" },
      { status: 500 }
    )
  }
}
