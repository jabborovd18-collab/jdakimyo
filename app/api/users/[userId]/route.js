// app/api/users/[userId]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { korinadimi, tozala } from '@/lib/maxfiylik'
import { dostRoyxatidanAjrat } from '@/lib/profil-tekshiruv'
import { QUIZ_NATIJA_TARTIBI, quizNatijaniBoyit } from '@/lib/quiz-natija-boshqaruv'
import { MILLIY_SERTIFIKAT_VARIANTLARI } from '@/lib/milliy-sertifikat-data'
import { postlarniBoyit } from '@/lib/post-baza'
import { postlarniTartibla } from '@/lib/post-tavsiyalar'

const MS_NOM_MAP = new Map(MILLIY_SERTIFIKAT_VARIANTLARI.map((v) => [v.slug, v.nom]))

const SAFE_FRIEND_SELECT = {
  id: true,
  userId: true,
  username: true,
  fullName: true,
  avatar: true,
  university: true,
  isVerified: true,
}

export async function GET(request, { params }) {
  try {
    const { userId: rawParam } = await params
    const cleanParam = typeof rawParam === 'string' ? rawParam.trim().replace(/^@/, '') : ''
    if (!cleanParam) {
      return NextResponse.json(
        { error: "User ID ko'rsatilmagan" },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    const viewerId = session?.user?.id || null

    // userId (9 xonali raqam), ichki id (cuid) yoki @username orqali qidirish
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { userId: cleanParam },
          { id: cleanParam },
          { username: { equals: cleanParam, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        userId: true,
        username: true,
        fullName: true,
        role: true,
        isTeacher: true,
        isVerified: true,
        isBanned: true,
        premiumUslub: true,
        avatar: true,
        bio: true,
        university: true,
        faculty: true,
        specialty: true,
        level: true,
        enrollmentYear: true,
        level_points: true,
        totalPoints: true,
        createdAt: true,
        location: true,
        academicDegree: true,
        stars: true,
        currentStreak: true,
        longestStreak: true,
        telegram: true,
        instagram: true,
        linkedin: true,
        github: true,
        twitter: true,
        website: true,
        googleScholar: true,
        orcid: true,
        privacySettings: true,
        _count: {
          select: {
            followers: true,
            following: true,
            friendships1: true,
            friendships2: true,
          },
        },
      },
    })

    if (!user || user.isBanned) {
      return NextResponse.json(
        { error: 'Foydalanuvchi topilmadi' },
        { status: 404 }
      )
    }

    const isOwnProfile = Boolean(viewerId && viewerId === user.id)

    // ─── BLOKLASH, DO'STLIK VA OBUNA (ketma-ket 1 issiq ulanishda, poolni band qilmasdan) ───
    let isFriend = false
    let pendingReq = null
    let myFollow = null

    if (viewerId && !isOwnProfile) {
      const bloklagan = await prisma.userBlock.findUnique({
        where: {
          blockerId_blockedId: { blockerId: user.id, blockedId: viewerId },
        },
        select: { id: true },
      })

      if (bloklagan) {
        return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
      }

      const friendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { user1Id: viewerId, user2Id: user.id },
            { user1Id: user.id, user2Id: viewerId },
          ],
        },
        select: { id: true },
      })
      isFriend = Boolean(friendship)

      if (!isFriend) {
        pendingReq = await prisma.friendRequest.findFirst({
          where: {
            status: 'pending',
            OR: [
              { senderId: viewerId, receiverId: user.id },
              { senderId: user.id, receiverId: viewerId },
            ],
          },
          select: { id: true, senderId: true },
        })
      }

      myFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: { followerId: viewerId, followingId: user.id },
        },
        select: { id: true },
      })
    }

    const maxfiylik = tozala(user.privacySettings)
    const kim = { ozimniki: isOwnProfile, dost: isFriend }
    const koradi = (bolim) => korinadimi(maxfiylik, bolim, kim)

    // Profil sahifasining o'zi yopiqmi — og'ir ro'yxatlarni so'ramasdan qaytaramiz
    if (!koradi('profil')) {
      return NextResponse.json({
        user: {
          id: user.id,
          userId: user.userId,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          isVerified: user.isVerified,
          premiumUslub: user.premiumUslub,
          avatar: user.avatar,
          university: user.university,
        },
        error: 'PROFILE_PRIVATE',
        message: 'Bu profil maxfiy',
      })
    }

    // 9 ta parallel so'rov o'rniga bitta jamlangan user relation so'rovi + do'stlar ro'yxati:
    // Neon connection pool (limit=8) to'lib qolishi ("Profilni yuklab bo'lmadi") oldini oladi.
    const kerakBoglanishlar =
      koradi('quiz') || koradi('yutuqlar') || koradi('sertifikatlar') || koradi('postlar')

    const boglangan = kerakBoglanishlar
      ? await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            ...(koradi('quiz')
              ? {
                  quizResults: {
                    where: { isHidden: false },
                    orderBy: QUIZ_NATIJA_TARTIBI,
                    take: 15,
                  },
                }
              : {}),
            ...(koradi('yutuqlar')
              ? {
                  achievements: {
                    orderBy: { earnedAt: 'desc' },
                  },
                }
              : {}),
            ...(koradi('sertifikatlar')
              ? {
                  certificates: {
                    orderBy: { issuedAt: 'desc' },
                  },
                }
              : {}),
            ...(koradi('postlar')
              ? {
                  profilePosts: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                  },
                }
              : {}),
          },
        }).catch(() => null)
      : null

    const friendRows = koradi('dostlar')
      ? await prisma.friendship.findMany({
          where: { OR: [{ user1Id: user.id }, { user2Id: user.id }] },
          select: {
            createdAt: true,
            user1Id: true,
            user1: { select: SAFE_FRIEND_SELECT },
            user2: { select: SAFE_FRIEND_SELECT },
          },
          orderBy: { createdAt: 'desc' },
          take: 100,
        }).catch(() => [])
      : []

    const quizResults = boglangan?.quizResults || []
    const achievements = boglangan?.achievements || []
    const certificates = boglangan?.certificates || []
    const xomPostlar = boglangan?.profilePosts || []
    const boyitilganPostlar = await postlarniBoyit(xomPostlar, session?.user?.id || null)
    const postlar = postlarniTartibla(boyitilganPostlar, { tartib: 'standart' })

    const msUrinishlar = koradi('msNatijalar')
      ? await prisma.msUrinish
          .findMany({
            where: { userId: user.id, holat: 'elon_qilindi' },
            orderBy: { yakunlanganVaqt: 'desc' },
            take: 20,
            select: {
              id: true,
              slug: true,
              shkalaBalli: true,
              daraja: true,
              theta: true,
              oddiyFoiz: true,
              cohortRank: true,
              cohortTotal: true,
              percentile: true,
              certId: true,
              yakunlanganVaqt: true,
            },
          })
          .then((rows) =>
            rows.map((u) => ({
              ...u,
              examName: MS_NOM_MAP.get(u.slug) || u.slug,
              shkalaBalli: Number(Number(u.shkalaBalli).toFixed(1)),
              theta: Number(Number(u.theta).toFixed(2)),
            })),
          )
          .catch(() => [])
      : []
    const friendsTotal = koradi('dostlar')
      ? (user._count.friendships1 || 0) + (user._count.friendships2 || 0)
      : null

    const friends = koradi('dostlar') ? dostRoyxatidanAjrat(friendRows, user.id) : []
    const followersCount = koradi('obunachilar') ? user._count.followers : null
    const followingCount = koradi('obunachilar') ? user._count.following : null

    let friendshipStatus = 'none'
    let requestId = null
    if (isFriend) {
      friendshipStatus = 'friend'
    } else if (pendingReq && pendingReq.senderId === viewerId) {
      friendshipStatus = 'sent'
      requestId = pendingReq.id
    } else if (pendingReq && pendingReq.senderId === user.id) {
      friendshipStatus = 'received'
      requestId = pendingReq.id
    }

    const followStatus = myFollow ? 'following' : 'none'

    return NextResponse.json({
      user: {
        id: user.id,
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
        premiumUslub: user.premiumUslub,
        isTeacher: user.isTeacher,
        avatar: user.avatar,
        bio: user.bio,
        university: user.university,
        faculty: user.faculty,
        specialty: user.specialty,
        level: user.level,
        enrollmentYear: user.enrollmentYear,
        level_points: user.level_points,
        totalPoints: user.totalPoints,
        createdAt: user.createdAt,
        location: user.location,
        academicDegree: user.academicDegree,
        stars: user.stars,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        telegram: user.telegram,
        instagram: user.instagram,
        linkedin: user.linkedin,
        github: user.github,
        twitter: user.twitter,
        website: user.website,
        googleScholar: user.googleScholar,
        orcid: user.orcid,
      },
      friends,
      friendsCount: friendsTotal,
      quizResults: quizResults.map(quizNatijaniBoyit),
      msUrinishlar,
      certificates,
      achievements,
      postlar,
      friendshipStatus,
      requestId,
      followersCount,
      followingCount,
      followStatus,
      korinadi: {
        dostlar: koradi('dostlar'),
        quiz: koradi('quiz'),
        msNatijalar: koradi('msNatijalar'),
        yutuqlar: koradi('yutuqlar'),
        sertifikatlar: koradi('sertifikatlar'),
        obunachilar: koradi('obunachilar'),
        postlar: koradi('postlar'),
      },
      ozimniki: isOwnProfile,
      dost: isFriend,
      isPrivate: maxfiylik.profil !== 'hamma',
    })
  } catch (error) {
    console.error('[Public Profile] Error:', error)
    return NextResponse.json(
      { error: 'Profilni yuklashda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
