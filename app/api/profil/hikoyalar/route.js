// app/api/profil/hikoyalar/route.js
//
// 24 soatlik "Ilmiy Hikoyalar" (Stories) API:
// - GET: faol hikoyalar tasmasi (mualliflar bo'yicha guruhlangan)
// - POST: yangi hikoya yaratish (dolzarb mavzu yoki postni hikoyaga ulashish)
// - PUT: hikoyani ko'rildi deb belgilash (`amal='korildi'`) yoki 🔥 bosish (`amal='yoqdi'`)
// - DELETE: o'z hikoyasini o'chirish

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { tozala, korinadimi } from '@/lib/maxfiylik'
import { xabarYuborKopga } from '@/lib/bildirishnoma'
import { hikoyalarniGuruhla } from '@/lib/hikoya-turlari'
import {
  faolHikoyalarniOl,
  hikoyaYarat,
  hikoyaKorildiYokiYoqdi,
  hikoyaOchir,
} from '@/lib/hikoya-baza'
import { postlarniBoyit } from '@/lib/post-baza'

const MUALLIF_SELECT = {
  id: true,
  userId: true,
  username: true,
  fullName: true,
  avatar: true,
  role: true,
  isTeacher: true,
  isVerified: true,
  premiumUslub: true,
  university: true,
  privacySettings: true,
  isBanned: true,
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    const joriyId = session?.user?.id || null

    const { searchParams } = new URL(request.url)
    const muallifId = searchParams.get('muallifId') || null

    const xomHikoyalar = await faolHikoyalarniOl({
      joriyUserId: joriyId,
      muallifId,
      limit: muallifId ? 20 : 80,
    })

    if (xomHikoyalar.length === 0) {
      return NextResponse.json({
        success: true,
        guruhlar: [],
        hikoyalar: [],
      })
    }

    const muallifIdlar = [...new Set(xomHikoyalar.map((h) => h.userId).filter(Boolean))]

    const [mualliflar, koruvchi] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: muallifIdlar } },
        select: MUALLIF_SELECT,
      }),
      joriyId
        ? prisma.user.findUnique({
            where: { id: joriyId },
            select: {
              following: { select: { followingId: true } },
              friendships1: { select: { user2Id: true } },
              friendships2: { select: { user1Id: true } },
              bloklaganlarim: { select: { blockedId: true } },
              meniBloklagan: { select: { blockerId: true } },
            },
          })
        : null,
    ])

    const obunaSet = new Set((koruvchi?.following || []).map((f) => f.followingId))
    const dostSet = new Set([
      ...(koruvchi?.friendships1 || []).map((f) => f.user2Id),
      ...(koruvchi?.friendships2 || []).map((f) => f.user1Id),
    ])
    const blokSet = new Set([
      ...(koruvchi?.bloklaganlarim || []).map((b) => b.blockedId),
      ...(koruvchi?.meniBloklagan || []).map((b) => b.blockerId),
    ])

    const muallifMap = new Map(mualliflar.map((u) => [u.id, u]))

    const ruxsatli = []
    for (const h of xomHikoyalar) {
      const u = muallifMap.get(h.userId)
      if (!u || u.isBanned) continue
      if (blokSet.has(u.id)) continue

      const ozimniki = Boolean(joriyId && u.id === joriyId)
      const dost = dostSet.has(u.id)
      const maxfiy = tozala(u.privacySettings)

      if (
        !ozimniki &&
        (!korinadimi(maxfiy, 'profil', { ozimniki, dost }) ||
          !korinadimi(maxfiy, 'postlar', { ozimniki, dost }))
      ) {
        continue
      }

      ruxsatli.push({
        ...h,
        korildimi: ozimniki ? true : Boolean(h.korildimi),
        muallif: {
          id: u.id,
          userId: u.userId,
          username: u.username,
          fullName: u.fullName,
          avatar: u.avatar,
          role: u.role,
          isTeacher: Boolean(u.isTeacher),
          isVerified: Boolean(u.isVerified),
          premiumUslub: u.premiumUslub,
          university: u.university,
          obunami: obunaSet.has(u.id),
          dostmi: dost,
        },
      })
    }

    const guruhlar = hikoyalarniGuruhla(ruxsatli, joriyId)

    return NextResponse.json({
      success: true,
      guruhlar,
      hikoyalar: ruxsatli,
    })
  } catch (error) {
    console.error('[Hikoyalar GET]', error)
    return NextResponse.json(
      { error: "Hikoyalarni yuklab bo'lmadi" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { turi, uslub, matn, postId } = body

    let ulashilganPost = null

    if (postId) {
      const xomPost = await prisma.profilePost.findUnique({
        where: { id: String(postId) },
        include: { user: { select: MUALLIF_SELECT } },
      })
      if (!xomPost || !xomPost.user || xomPost.user.isBanned) {
        return NextResponse.json({ error: 'Post topilmadi' }, { status: 404 })
      }

      const [boyitilgan] = await postlarniBoyit([xomPost], session.user.id)
      ulashilganPost = {
        ...boyitilgan,
        muallif: {
          id: xomPost.user.id,
          userId: xomPost.user.userId,
          username: xomPost.user.username,
          fullName: xomPost.user.fullName,
        },
      }
    }

    const hikoya = await hikoyaYarat({
      userId: session.user.id,
      turi,
      uslub,
      matn,
      post: ulashilganPost,
    })

    // Agar boshqa foydalanuvchining posti hikoyaga ulashilgan bo'lsa, muallifni xabardor qilamiz
    if (ulashilganPost && ulashilganPost.userId !== session.user.id) {
      const kim = session.user.fullName || `@${session.user.username}`
      await xabarYuborKopga([ulashilganPost.userId], {
        turi: 'post',
        icon: '✨',
        sarlavha: `${kim} postingizni o'z hikoyasiga ulashdi!`,
        matn: String(ulashilganPost.matn || '').slice(0, 120),
        havola: `/profil/${session.user.userId}`,
      }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      hikoya: {
        ...hikoya,
        muallif: {
          id: session.user.id,
          userId: session.user.userId,
          username: session.user.username,
          fullName: session.user.fullName,
          avatar: session.user.avatar,
          role: session.user.role,
          isTeacher: Boolean(session.user.isTeacher),
          isVerified: Boolean(session.user.isVerified),
        },
      },
      message: ulashilganPost
        ? 'Post 24 soatlik hikoyangizga joylandi!'
        : 'Hikoya 24 soatga joylandi!',
    })
  } catch (error) {
    console.error('[Hikoyalar POST]', error)
    return NextResponse.json(
      { error: error.message || "Hikoyani joylab bo'lmadi" },
      { status: 400 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { id, amal = 'korildi' } = body
    if (!id) {
      return NextResponse.json({ error: 'Hikoya id majburiy' }, { status: 400 })
    }

    const natija = await hikoyaKorildiYokiYoqdi({
      storyId: String(id),
      userId: session.user.id,
      amal,
    })

    if (
      amal === 'yoqdi' &&
      natija.yoqdimi &&
      natija.storyUserId !== session.user.id &&
      [1, 5, 10, 25].includes(natija.yoqdiSoni)
    ) {
      const kim = session.user.fullName || `@${session.user.username}`
      await xabarYuborKopga([natija.storyUserId], {
        turi: 'post',
        icon: '🔥',
        sarlavha:
          natija.yoqdiSoni === 1
            ? `${kim} hikoyangizga olovcha bosdi`
            : `Hikoyangiz ${natija.yoqdiSoni} ta olovcha oldi!`,
        matn: String(natija.storyMatn || '').slice(0, 120),
        havola: '/profil',
      }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      ...natija,
    })
  } catch (error) {
    console.error('[Hikoyalar PUT]', error)
    return NextResponse.json(
      { error: error.message || 'Amal bajarilmadi' },
      { status: 400 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'id majburiy' }, { status: 400 })
    }

    await hikoyaOchir({ storyId: id, userId: session.user.id })
    return NextResponse.json({
      success: true,
      message: "Hikoya o'chirildi",
    })
  } catch (error) {
    console.error('[Hikoyalar DELETE]', error)
    return NextResponse.json(
      { error: error.message || "Hikoyani o'chirib bo'lmadi" },
      { status: 400 }
    )
  }
}
