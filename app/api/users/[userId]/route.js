// app/api/users/[userId]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

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

    // 🆕 MAXFIYLIK SOZLAMALARINI TEKSHIRISH
    let privacySettings = {
      profilePublic: true,
      showFriends: true,
      showQuizResults: true,
      showAchievements: true,
      showFollowers: true
    }

    try {
      if (user.privacySettings) {
        privacySettings = typeof user.privacySettings === 'string'
          ? JSON.parse(user.privacySettings)
          : user.privacySettings
      }
    } catch (e) {
      console.error('Privacy parse error:', e)
    }

    // O'z profili yoki do'stmi?
    const isOwnProfile = session && session.user.id === user.id
    const isFriend = session ? await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, user2Id: user.id },
          { user1Id: user.id, user2Id: session.user.id }
        ]
      }
    }) : null

    // Profil maxfiymi va bu o'z profili emasmi?
    if (!privacySettings.profilePublic && !isOwnProfile && !isFriend) {
      return NextResponse.json({
        user: {
          id: user.id,
          userId: user.userId,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          avatar: user.avatar,
          university: user.university,
        },
        error: 'PROFILE_PRIVATE',
        message: 'Bu profil maxfiy'
      })
    }

    // Do'stlar ro'yxati
    let friends = []
    if (privacySettings.showFriends || isOwnProfile || isFriend) {
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

    // Quiz natijalari
    const quizResults = (privacySettings.showQuizResults || isOwnProfile || isFriend)
      ? user.quizResults
      : []

    // Yutuqlar
    const achievements = (privacySettings.showAchievements || isOwnProfile || isFriend)
      ? user.achievements
      : []

    // Obunachilar
    const followersCount = (privacySettings.showFollowers || isOwnProfile || isFriend)
      ? user.followers.length
      : null

    const followingCount = (privacySettings.showFollowers || isOwnProfile || isFriend)
      ? user.following.length
      : null

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
      certificates: user.certificates,
      achievements,
      friendshipStatus,
      requestId,
      followersCount,
      followingCount,
      followStatus,
      // 🆕 Maxfiylik holati
      isPrivate: !privacySettings.profilePublic
    })
  } catch (error) {
    console.error('[Public Profile] Error:', error)
    return NextResponse.json(
      { error: "Profilni yuklashda xatolik: " + error.message },
      { status: 500 }
    )
  }
}