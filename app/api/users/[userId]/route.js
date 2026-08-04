// app/api/users/[userId]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { korinadimi, tozala } from '@/lib/maxfiylik'

export async function GET(request, { params }) {
  try {
    const { userId } = await params
    console.log('[Public Profile] Requested userId:', userId)

    if (!userId) {
      return NextResponse.json(
        { error: "User ID ko'rsatilmagan" },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)

    // Foydalanuvchini topish
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        quizResults: {
          orderBy: { completedAt: 'desc' },
          take: 10
        },
        certificates: {
          orderBy: { issuedAt: 'desc' }
        },
        achievements: {
          orderBy: { earnedAt: 'desc' }
        },
        friendships1: {
          include: { user2: true }
        },
        friendships2: {
          include: { user1: true }
        },
        followers: {
          include: { follower: true }
        },
        following: {
          include: { following: true }
        }
      }
    })

    if (!user) {
      console.log('[Public Profile] User not found:', userId)
      return NextResponse.json(
        { error: 'Foydalanuvchi topilmadi' },
        { status: 404 }
      )
    }

    // ─── BLOKLASH ───
    //
    // Bloklangan odam uchun profil egasi umuman yo'q bo'lib qoladi.
    // "Sizni bloklashgan" deb aytilmaydi: bu bloklovchini fosh qiladi va
    // ko'pincha janjalning davomiga aylanadi.
    if (session?.user?.id && session.user.id !== user.id) {
      const bloklagan = await prisma.userBlock.findUnique({
        where: {
          blockerId_blockedId: { blockerId: user.id, blockedId: session.user.id },
        },
        select: { id: true },
      })
      if (bloklagan) {
        return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
      }
    }

    // ─── MAXFIYLIK ───
    //
    // Uch daraja: hamma | dostlar | hech-kim (lib/maxfiylik.js). Eski
    // ha/yo'q qiymatlar o'qish paytida o'giriladi.
    //
    // Avval bu yerda har bir bo'lim uchun
    // `sozlama.X || isOwnProfile || isFriend` deb yozilgan edi — ya'ni
    // "yashirin" degani aslida "do'stlardan tashqari hammadan yashirin"
    // edi va "hech kim ko'rmasin" degan holat umuman yo'q edi.
    const maxfiylik = tozala(user.privacySettings)

    const isOwnProfile = Boolean(session && session.user.id === user.id)
    const isFriend = session ? Boolean(await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, user2Id: user.id },
          { user1Id: user.id, user2Id: session.user.id }
        ]
      }
    })) : false

    const kim = { ozimniki: isOwnProfile, dost: isFriend }
    const koradi = (bolim) => korinadimi(maxfiylik, bolim, kim)

    // Profil sahifasining o'zi yopiqmi
    if (!koradi('profil')) {
      return NextResponse.json({
        user: {
          id: user.id,
          userId: user.userId,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          // Tasdiq belgisi maxfiy profilda ham ko'rinadi: u shaxsiy
          // ma'lumot emas, hisobning haqiqiyligi haqidagi belgi.
          isVerified: user.isVerified,
          avatar: user.avatar,
          university: user.university,
        },
        error: 'PROFILE_PRIVATE',
        message: 'Bu profil maxfiy'
      })
    }

    // Do'stlar ro'yxati
    let friends = []
    if (koradi('dostlar')) {
      friends = [
        ...user.friendships1.map(f => ({
          id: f.user2.id,
          userId: f.user2.userId,
          username: f.user2.username,
          fullName: f.user2.fullName,
          avatar: f.user2.avatar,
          university: f.user2.university
        })),
        ...user.friendships2.map(f => ({
          id: f.user1.id,
          userId: f.user1.userId,
          username: f.user1.username,
          fullName: f.user1.fullName,
          avatar: f.user1.avatar,
          university: f.user1.university
        }))
      ]
    }

    const quizResults = koradi('quiz') ? user.quizResults : []
    const achievements = koradi('yutuqlar') ? user.achievements : []
    const certificates = koradi('sertifikatlar') ? user.certificates : []

    // Obunachilar soni yopiq bo'lsa `null` qaytadi — sahifa uni noldan
    // farqlay olishi kerak ("0 obunachi" bilan "ko'rsatilmaydi" bir xil
    // narsa emas)
    const followersCount = koradi('obunachilar') ? user.followers.length : null
    const followingCount = koradi('obunachilar') ? user.following.length : null

    // Profil postlari — obunachilar tizimi aynan shu uchun bor
    const postlar = koradi('postlar')
      ? await prisma.profilePost.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          take: 20,
        })
      : []

    // Do'stlik holatini aniqlash
    let friendshipStatus = 'none'
    let requestId = null
    let followStatus = 'none'

    if (session && session.user.id !== user.id) {
      // Do'stmi?
      const friendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { user1Id: session.user.id, user2Id: user.id },
            { user1Id: user.id, user2Id: session.user.id }
          ]
        }
      })

      if (friendship) {
        friendshipStatus = 'friend'
      } else {
        // Yuborilgan taklif bormi?
        const sentRequest = await prisma.friendRequest.findFirst({
          where: {
            senderId: session.user.id,
            receiverId: user.id,
            status: 'pending'
          }
        })

        if (sentRequest) {
          friendshipStatus = 'sent'
          requestId = sentRequest.id
        } else {
          // Qabul qilinadigan taklif bormi?
          const receivedRequest = await prisma.friendRequest.findFirst({
            where: {
              senderId: user.id,
              receiverId: session.user.id,
              status: 'pending'
            }
          })

          if (receivedRequest) {
            friendshipStatus = 'received'
            requestId = receivedRequest.id
          }
        }
      }

      // Follow holati
      const myFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: user.id
          }
        }
      })

      followStatus = myFollow ? 'following' : 'not_following'
    }

    return NextResponse.json({
      user: {
        id: user.id,
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
        isTeacher: user.isTeacher,
        avatar: user.avatar,
        bio: user.bio,
        university: user.university,
        faculty: user.faculty,
        specialty: user.specialty,
        level_points: user.level_points,
        totalPoints: user.totalPoints,
        createdAt: user.createdAt,

        // Ochiq profilda ko'rsatiladigan qo'shimchalar. Ular bazada
        // allaqachon bor edi — sozlamalarda to'ldirilardi-yu, hech qayerda
        // ko'rinmasdi, ya'ni kiritishning ma'nosi yo'q edi.
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
      friendsCount: friends.length,
      quizResults,
      certificates,
      achievements,
      postlar,
      friendshipStatus,
      requestId,
      followersCount,
      followingCount,
      followStatus,
      // Sahifa "yashirilgan" bilan "bo'sh" ni farqlashi uchun
      korinadi: {
        dostlar: koradi('dostlar'),
        quiz: koradi('quiz'),
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
      { error: "Profilni yuklashda xatolik: " + error.message },
      { status: 500 }
    )
  }
}