// app/api/profil/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { bildirishnomaTozala, profilYangilashTayyorla } from '@/lib/profil-tekshiruv'
import { profilKiritishXatolari } from '@/lib/profil-tahrir'
import { QUIZ_NATIJA_TARTIBI, quizNatijaniBoyit } from '@/lib/quiz-natija-boshqaruv'
import { tozala as maxfiylikTozala } from '@/lib/maxfiylik'
import { qurAqlliProfilXulosa } from '@/lib/profil-aqlli'
import { toshkentUtcKun } from '@/lib/faoliyat'
import { MILLIY_SERTIFIKAT_VARIANTLARI } from '@/lib/milliy-sertifikat-data'
import { profilLogYoz } from '@/lib/profil-log'
import { ozgarganMaydonlarXulosasi } from '@/lib/profil-log-yordamchi'

const MS_NOM_MAP = new Map(MILLIY_SERTIFIKAT_VARIANTLARI.map((v) => [v.slug, v.nom]))

const USER_FIELDS = {
  id: true,
  userId: true,
  username: true,
  email: true,
  fullName: true,
  role: true,
  isTeacher: true,
  isVerified: true,
  premiumUslub: true,
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
  coins: true,
  gems: true,
  emailVerified: true,
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
  privacySettings: true,
}

const BOSh_HISOBLAGICHLAR = {
  quizzes: 0,
  certificates: 0,
  achievements: 0,
  followers: 0,
  following: 0,
  friends: 0,
  pendingFriendRequests: 0,
}

async function bazadanQaytaUrinishBilan(amal) {
  try {
    return await amal()
  } catch (err) {
    const xabar = String(err?.message || '')
    const kod = String(err?.code || '')
    const ulanishXatosi =
      ['P1001', 'P1002', 'P1008', 'P1017', 'P2024'].includes(kod) ||
      /Timed out|closed the connection|ConnectionReset|Can't reach database/i.test(xabar)
    if (!ulanishXatosi) throw err
    await new Promise((r) => setTimeout(r, 500))
    return await amal()
  }
}

// GET - Dashboard uchun yengil profil ma'lumotlari (to'liq ro'yxatlar emas, sonlar)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id && !session?.user?.userId && !session?.user?.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const qidiruvSharti = session.user.id
      ? { id: session.user.id }
      : session.user.userId
      ? { userId: String(session.user.userId) }
      : { username: String(session.user.username) }

    let user = null

    try {
      // Bitta so'rov bilan barcha hisoblagichlarni olamiz — 4 ta parallel
      // ulanish ochib localhost/Neon poolini band qilmaslik uchun
      user = await bazadanQaytaUrinishBilan(() =>
        prisma.user.findUnique({
          where: qidiruvSharti,
          select: {
            ...USER_FIELDS,
            quizResults: {
              where: { isHidden: false },
              orderBy: QUIZ_NATIJA_TARTIBI,
              take: 5,
            },
            _count: {
              select: {
                certificates: true,
                achievements: true,
                followers: true,
                following: true,
                quizResults: { where: { isHidden: false } },
                friendships1: true,
                friendships2: true,
                receivedRequests: { where: { status: 'pending' } },
              },
            },
          },
        })
      )
    } catch (subQueryError) {
      console.warn('[Profile GET] Bog\'langan jadvallar so\'rovida xato, asosiy profil olinmoqda:', subQueryError?.message)
      user = await bazadanQaytaUrinishBilan(() =>
        prisma.user.findUnique({
          where: qidiruvSharti,
          select: USER_FIELDS,
        })
      )
    }

    // Agar id bo'yicha topilmasa, userId yoki username orqali zahira qidiruv
    if (!user && session.user.userId) {
      user = await prisma.user.findUnique({
        where: { userId: String(session.user.userId) },
        select: USER_FIELDS,
      }).catch(() => null)
    }

    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    const { quizResults = [], _count, ...userFields } = user

    const bugunBoshi = toshkentUtcKun(new Date())
    const ikkiHaftaOldin = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)

    const [msUrinishlar, telegramUlanish, oqilmaganSanoq] = await Promise.all([
      prisma.msUrinish
        .findMany({
          where: { userId: user.id },
          select: {
            id: true,
            slug: true,
            holat: true,
            shkalaBalli: true,
            daraja: true,
            theta: true,
            oddiyFoiz: true,
            cohortRank: true,
            cohortTotal: true,
            percentile: true,
            certId: true,
            boshlanganVaqt: true,
            yakunlanganVaqt: true,
          },
          orderBy: { boshlanganVaqt: 'desc' },
          take: 25,
        })
        .catch(() => []),
      prisma.telegramUlanish
        .findUnique({
          where: { userId: user.id },
          select: { username: true, bogladi: true, xabarlar: true },
        })
        .catch(() => null),
      prisma.notification
        .count({ where: { userId: user.id, oqilgan: false } })
        .catch(() => 0),
    ])

    const [bugungiQuizlar, sertifikatMuddatlar, accounts] = await Promise.all([
      prisma.quizResult
        .findMany({
          where: { userId: user.id, completedAt: { gte: bugunBoshi } },
          select: { totalQuestions: true, timeSpent: true },
        })
        .catch(() => []),
      prisma.certificate
        .findMany({
          where: { userId: user.id, status: { not: 'revoked' }, expiresAt: { not: null } },
          select: { id: true, expiresAt: true, status: true },
        })
        .catch(() => []),
      prisma.account
        .findMany({
          where: { userId: user.id },
          select: { provider: true },
        })
        .catch(() => []),
    ])

    const [azolar, xavfsizlikOgohlantirishSoni] = await Promise.all([
      prisma.teacherStudent
        .findMany({
          where: { studentId: user.id, holat: 'faol', groupId: { not: null } },
          select: { groupId: true },
        })
        .catch(() => []),
      prisma.profilLog
        .count({
          where: {
            userId: user.id,
            toifa: 'xavfsizlik',
            holat: { in: ['xato', 'ogohlantirish'] },
            createdAt: { gte: ikkiHaftaOldin },
          },
        })
        .catch(() => 0),
    ])

    const guruhIdlar = azolar.map((a) => a.groupId).filter(Boolean)
    const topshiriqSanoq =
      guruhIdlar.length > 0
        ? await prisma.assignment
            .count({
              where: {
                groupId: { in: guruhIdlar },
                isDraft: false,
                deadline: { gte: new Date() },
                submissions: { none: { studentId: user.id } },
              },
            })
            .catch(() => 0)
        : 0

    const bugungiSavollar = bugungiQuizlar.reduce((s, q) => s + (Number(q.totalQuestions) || 0), 0)
    const bugungiDaqiqalar = Math.round(
      bugungiQuizlar.reduce((s, q) => s + (Number(q.timeSpent) || 0), 0) / 60,
    )

    const maxfiylik = maxfiylikTozala(userFields.privacySettings)
    const aqlliXulosa = qurAqlliProfilXulosa({
      user: userFields,
      bugungiFaollik: { quizzesTaken: bugungiSavollar, studyMinutes: bugungiDaqiqalar },
      msUrinishlar: msUrinishlar.map((u) => ({
        ...u,
        examName: MS_NOM_MAP.get(u.slug) || u.slug,
      })),
      sertifikatlar: sertifikatMuddatlar,
      topshiriqSanoq,
      oqilmaganSanoq,
      telegramUlangan: Boolean(telegramUlanish),
      parolBor: true,
      maxfiylik,
      xavfsizlikOgohlantirishSoni,
    })

    if (aqlliXulosa?.msXulosa?.engYaxshi?.slug) {
      aqlliXulosa.msXulosa.engYaxshi.examName =
        MS_NOM_MAP.get(aqlliXulosa.msXulosa.engYaxshi.slug) || aqlliXulosa.msXulosa.engYaxshi.slug
    }
    if (aqlliXulosa?.msXulosa?.songgi?.slug) {
      aqlliXulosa.msXulosa.songgi.examName =
        MS_NOM_MAP.get(aqlliXulosa.msXulosa.songgi.slug) || aqlliXulosa.msXulosa.songgi.slug
    }

    return NextResponse.json({
      user: userFields,
      quizResults: Array.isArray(quizResults) ? quizResults.map(quizNatijaniBoyit) : [],
      counts: _count
        ? {
            quizzes: _count.quizResults || 0,
            certificates: _count.certificates || 0,
            achievements: _count.achievements || 0,
            followers: _count.followers || 0,
            following: _count.following || 0,
            friends: (_count.friendships1 || 0) + (_count.friendships2 || 0),
            pendingFriendRequests: _count.receivedRequests || 0,
            msUrinishlar: msUrinishlar.length,
            oqilmagan: oqilmaganSanoq,
          }
        : BOSh_HISOBLAGICHLAR,
      aqlliXulosa,
      boglanganHisoblar: {
        telegram: telegramUlanish
          ? {
              ulangan: true,
              username: telegramUlanish.username || null,
              xabarlar: Boolean(telegramUlanish.xabarlar),
              bogladi: telegramUlanish.bogladi,
            }
          : { ulangan: false },
        providerlar: accounts.map((a) => a.provider),
      },
    })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { error: 'Profilni yuklashda xatolik' },
      { status: 500 }
    )
  }
}

// PUT - Profilni yangilash (KENGAYTIRILGAN)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.doskaTugaydi) {
      return NextResponse.json(
        { error: 'Elektron doskada hisob ma\'lumotlarini tahrirlab bo\'lmaydi' },
        { status: 403 }
      )
    }

    const data = await request.json().catch(() => null)
    const { xato, tozalangan } = profilKiritishXatolari(data)
    if (xato) {
      return NextResponse.json({ error: xato }, { status: 400 })
    }

    const updateData = profilYangilashTayyorla(tozalangan)

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Yangilanishi kerak bo'lgan ma'lumot yo'q" },
        { status: 400 }
      )
    }

    const oldSelect = Object.fromEntries(Object.keys(updateData).map((k) => [k, true]))
    const mavjud = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: oldSelect,
    }).catch(() => null)

    if (updateData.notificationSettings) {
      updateData.notificationSettings = {
        ...bildirishnomaTozala(mavjud?.notificationSettings),
        ...updateData.notificationSettings,
      }
    }

    const ozgargan = ozgarganMaydonlarXulosasi(mavjud || {}, updateData)

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

    if (ozgargan) {
      await profilLogYoz({
        userId: session.user.id,
        toifa: ozgargan.toifa,
        amal: ozgargan.toifa === 'sozlama' ? 'SOZLAMA_YANGILANDI' : 'PROFIL_YANGILANDI',
        sarlavha: ozgargan.sarlavha,
        tafsilot: ozgargan.tafsilot,
        holat: 'muvaffaqiyat',
        request,
        meta: { maydonlar: ozgargan.maydonlar },
      })
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Ma'lumotlar muvaffaqiyatli yangilandi"
    })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json(
      { error: 'Profilni yangilashda xatolik' },
      { status: 500 }
    )
  }
}
