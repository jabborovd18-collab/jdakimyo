// app/api/profil/postlar/route.js
//
// Profil postlari:
// - GET: o'z postlarim (`rejim=meniki`), obunalarim lentasi (`rejim=obunalar`),
//        va shaxsiylashtirilgan rekomendatsiya lentasi (`rejim=tavsiyalar`)
// - POST: yangi post joylash (ixtiyoriy `#teg` bilan)
// - PUT: postni tahrirlash (`amal='tahrir'`), qadash (`amal='qadash'`),
//        yoki "Foydali" bosish (`amal='foydali'`)
// - DELETE: postni o'chirish

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { xabarYuborKopga } from '@/lib/bildirishnoma'
import { tozala, korinadimi } from '@/lib/maxfiylik'
import { postOluvchilarniAjrat } from '@/lib/profil-tahrir'
import { profilLogYoz } from '@/lib/profil-log'
import {
  tegniTekshir,
  matndanTegniTop,
  postlarniTartibla,
  tavsiyalarniSarala,
} from '@/lib/post-tavsiyalar'
import {
  postlarniBoyit,
  postTeginiSaqla,
  postQadashniAlmashtir,
  postFoydaliAlmashtir,
} from '@/lib/post-baza'

const MAX_UZUNLIK = 1000
const KUNLIK_CHEGARA = 20

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
  specialty: true,
  academicDegree: true,
  privacySettings: true,
  isBanned: true,
}

function muallifniTozala(u, obunaIdlarSet = new Set(), dostIdlarSet = new Set()) {
  if (!u) return null
  return {
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
    specialty: u.specialty,
    academicDegree: u.academicDegree,
    obunami: obunaIdlarSet.has(u.id),
    dostmi: dostIdlarSet.has(u.id),
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const rejim = searchParams.get('rejim') || 'meniki'
    const joriyId = session.user.id

    // ─── 1. MENING POSTLARIM ───
    if (rejim === 'meniki') {
      const xomPostlar = await prisma.profilePost.findMany({
        where: { userId: joriyId },
        orderBy: { createdAt: 'desc' },
        take: 60,
      })

      const boyitilgan = await postlarniBoyit(xomPostlar, joriyId)
      const postlar = postlarniTartibla(boyitilgan, { tartib: 'standart' })

      return NextResponse.json({ success: true, rejim: 'meniki', postlar })
    }

    // `obunalar` va `tavsiyalar` uchun foydalanuvchining obunalari, do'stlari va bloklarini olamiz
    const koruvchi = await prisma.user.findUnique({
      where: { id: joriyId },
      select: {
        id: true,
        role: true,
        university: true,
        specialty: true,
        following: { select: { followingId: true } },
        friendships1: { select: { user2Id: true } },
        friendships2: { select: { user1Id: true } },
        bloklaganlarim: { select: { blockedId: true } },
        meniBloklagan: { select: { blockerId: true } },
      },
    })

    const obunaIdlar = (koruvchi?.following || []).map((f) => f.followingId)
    const dostIdlar = [
      ...(koruvchi?.friendships1 || []).map((f) => f.user2Id),
      ...(koruvchi?.friendships2 || []).map((f) => f.user1Id),
    ]
    const bloklanganIdlar = new Set([
      ...(koruvchi?.bloklaganlarim || []).map((b) => b.blockedId),
      ...(koruvchi?.meniBloklagan || []).map((b) => b.blockerId),
    ])

    const obunaSet = new Set(obunaIdlar)
    const dostSet = new Set(dostIdlar)

    // ─── 2. OBUNALARIM VA DO'STLARIM LENTASI ───
    if (rejim === 'obunalar') {
      const aloqadorIdlar = [...new Set([...obunaIdlar, ...dostIdlar])].filter(
        (id) => id && id !== joriyId && !bloklanganIdlar.has(id)
      )

      if (aloqadorIdlar.length === 0) {
        return NextResponse.json({ success: true, rejim: 'obunalar', postlar: [] })
      }

      const xomPostlar = await prisma.profilePost.findMany({
        where: { userId: { in: aloqadorIdlar } },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { user: { select: MUALLIF_SELECT } },
      })

      const ruxsatli = xomPostlar.filter((p) => {
        if (!p.user || p.user.isBanned || bloklanganIdlar.has(p.userId)) return false
        const maxfiy = tozala(p.user.privacySettings)
        const dost = dostSet.has(p.userId)
        return (
          korinadimi(maxfiy, 'profil', { dost }) &&
          korinadimi(maxfiy, 'postlar', { dost })
        )
      })

      const boyitilgan = await postlarniBoyit(ruxsatli, joriyId)
      const postlar = boyitilgan.map((p) => ({
        id: p.id,
        userId: p.userId,
        matn: p.matn,
        teg: p.teg,
        isPinned: p.isPinned,
        pinnedAt: p.pinnedAt,
        likesCount: p.likesCount,
        yoqdimi: p.yoqdimi,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        muallif: muallifniTozala(p.user, obunaSet, dostSet),
      }))

      return NextResponse.json({ success: true, rejim: 'obunalar', postlar })
    }

    // ─── 3. REKOMENDATSIYA (TAVSIYALAR) LENTASI ───
    const xomPostlar = await prisma.profilePost.findMany({
      where: {
        userId: { not: joriyId },
      },
      orderBy: { createdAt: 'desc' },
      take: 80,
      include: { user: { select: MUALLIF_SELECT } },
    })

    const ruxsatli = xomPostlar.filter((p) => {
      if (!p.user || p.user.isBanned || bloklanganIdlar.has(p.userId)) return false
      const maxfiy = tozala(p.user.privacySettings)
      const dost = dostSet.has(p.userId)
      return (
        korinadimi(maxfiy, 'profil', { dost }) &&
        korinadimi(maxfiy, 'postlar', { dost })
      )
    })

    const boyitilgan = await postlarniBoyit(ruxsatli, joriyId)
    const tayyor = boyitilgan.map((p) => ({
      id: p.id,
      userId: p.userId,
      matn: p.matn,
      teg: p.teg,
      isPinned: p.isPinned,
      pinnedAt: p.pinnedAt,
      likesCount: p.likesCount,
      yoqdimi: p.yoqdimi,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      muallif: muallifniTozala(p.user, obunaSet, dostSet),
    }))

    const tavsiyalar = tavsiyalarniSarala(tayyor, koruvchi || session.user, {
      obunaIdlar,
      dostIdlar,
      limit: 30,
    })

    return NextResponse.json({
      success: true,
      rejim: 'tavsiyalar',
      postlar: tavsiyalar,
    })
  } catch (error) {
    console.error('[Profil postlar GET]', error)
    return NextResponse.json({ error: "Postlarni yuklab bo'lmadi" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const toza = String(body?.matn || '').trim()
    const tanlanganTeg = tegniTekshir(body?.teg) || matndanTegniTop(toza)

    if (!toza) {
      return NextResponse.json({ error: "Post matni bo'sh" }, { status: 400 })
    }
    if (toza.length > MAX_UZUNLIK) {
      return NextResponse.json(
        { error: `Post ${MAX_UZUNLIK} belgidan oshmasligi kerak` },
        { status: 400 }
      )
    }

    const kunBoshi = new Date()
    kunBoshi.setUTCHours(0, 0, 0, 0)
    const bugungi = await prisma.profilePost.count({
      where: { userId: session.user.id, createdAt: { gte: kunBoshi } },
    })
    if (bugungi >= KUNLIK_CHEGARA) {
      return NextResponse.json(
        { error: `Bir kunda ko'pi bilan ${KUNLIK_CHEGARA} ta post yozish mumkin` },
        { status: 429 }
      )
    }

    const post = await prisma.profilePost.create({
      data: { userId: session.user.id, matn: toza },
    })

    if (tanlanganTeg) {
      await postTeginiSaqla(post.id, tanlanganTeg)
    }

    const [obunachilar, muallif, dostliklar] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: session.user.id },
        select: { followerId: true },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { privacySettings: true },
      }),
      prisma.friendship.findMany({
        where: { OR: [{ user1Id: session.user.id }, { user2Id: session.user.id }] },
        select: { user1Id: true, user2Id: true },
      }),
    ])

    const dostIdlar = dostliklar.map((d) =>
      d.user1Id === session.user.id ? d.user2Id : d.user1Id
    )
    const xabarOluvchilar = postOluvchilarniAjrat({
      obunachiIdlar: obunachilar.map((o) => o.followerId),
      dostIdlar,
      maxfiylik: tozala(muallif?.privacySettings),
    })

    await xabarYuborKopga(xabarOluvchilar, {
      turi: 'post',
      icon: '✍️',
      sarlavha: `${session.user.fullName || session.user.username} yangi post yozdi`,
      matn: toza.slice(0, 160),
      havola: `/profil/${session.user.userId}`,
    })

    await profilLogYoz({
      userId: session.user.id,
      toifa: 'profil',
      amal: 'POST_JOYLANDI',
      sarlavha: 'Profilga post joylandi',
      tafsilot: toza.slice(0, 120),
      holat: 'muvaffaqiyat',
      request,
      meta: { postId: post.id, teg: tanlanganTeg },
    })

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        teg: tanlanganTeg,
        isPinned: false,
        pinnedAt: null,
        likesCount: 0,
        yoqdimi: false,
      },
      message: xabarOluvchilar.length
        ? `Post joylandi — ${xabarOluvchilar.length} ta obunachiga xabar berildi`
        : 'Post joylandi',
    })
  } catch (error) {
    console.error('[Profil postlar POST]', error)
    return NextResponse.json({ error: "Postni joylab bo'lmadi" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { id, amal } = body
    if (!id) {
      return NextResponse.json({ error: 'Post id majburiy' }, { status: 400 })
    }

    // ─── 1. "FOYDALI" (LIKE) BOSISH ───
    if (amal === 'foydali') {
      const natija = await postFoydaliAlmashtir(id, session.user.id)

      // Muallifning o'zi bo'lmasa va muhim chegaraga yetsa bildirishnoma yuboramiz
      if (
        natija.yoqdimi &&
        natija.postUserId !== session.user.id &&
        [1, 5, 10, 25, 50].includes(natija.likesCount)
      ) {
        const kim = session.user.fullName || `@${session.user.username}`
        await xabarYuborKopga([natija.postUserId], {
          turi: 'post',
          icon: '🔥',
          sarlavha:
            natija.likesCount === 1
              ? `${kim} postingizni foydali deb belgiladi`
              : `Postingiz ${natija.likesCount} marta foydali deb topildi!`,
          matn: String(natija.postMatn || '').slice(0, 120),
          havola: '/profil',
        }).catch(() => {})
      }

      return NextResponse.json({
        success: true,
        id,
        yoqdimi: natija.yoqdimi,
        likesCount: natija.likesCount,
      })
    }

    // ─── 2. POSTNI TEPAGA QADASH / QADASHDAN OLISH ───
    if (amal === 'qadash') {
      const natija = await postQadashniAlmashtir(id, session.user.id, body.isPinned)
      return NextResponse.json({
        success: true,
        id,
        isPinned: natija.isPinned,
        pinnedAt: natija.pinnedAt,
        message: natija.isPinned ? 'Post tepaga qadaldi' : 'Post qadashdan olindi',
      })
    }

    // ─── 3. POST MATNI VA TEGINI TAHRIRLASH ───
    const toza = String(body.matn || '').trim()
    if (!toza) {
      return NextResponse.json({ error: "Post matni bo'sh bo'lmasligi kerak" }, { status: 400 })
    }
    if (toza.length > MAX_UZUNLIK) {
      return NextResponse.json(
        { error: `Post ${MAX_UZUNLIK} belgidan oshmasligi kerak` },
        { status: 400 }
      )
    }

    const mavjud = await prisma.profilePost.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!mavjud) {
      return NextResponse.json({ error: 'Post topilmadi' }, { status: 404 })
    }

    const yangiTeg =
      body.teg !== undefined ? tegniTekshir(body.teg) : matndanTegniTop(toza)

    const yangilangan = await prisma.profilePost.update({
      where: { id },
      data: { matn: toza },
    })
    await postTeginiSaqla(id, yangiTeg)

    const [boyitilgan] = await postlarniBoyit([yangilangan], session.user.id)

    return NextResponse.json({
      success: true,
      post: boyitilgan,
      message: 'Post yangilandi',
    })
  } catch (error) {
    console.error('[Profil postlar PUT]', error)
    return NextResponse.json(
      { error: error.message || 'Amalni bajarib bo‘lmadi' },
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
    if (!id) return NextResponse.json({ error: 'id majburiy' }, { status: 400 })

    const natija = await prisma.profilePost.deleteMany({
      where: { id, userId: session.user.id },
    })

    if (natija.count === 0) {
      return NextResponse.json({ error: 'Post topilmadi' }, { status: 404 })
    }

    await profilLogYoz({
      userId: session.user.id,
      toifa: 'profil',
      amal: 'POST_OCHIRILDI',
      sarlavha: "Profil posti o'chirildi",
      holat: 'ogohlantirish',
      request,
      meta: { postId: id },
    })

    return NextResponse.json({ success: true, message: "Post o'chirildi" })
  } catch (error) {
    console.error('[Profil postlar DELETE]', error)
    return NextResponse.json({ error: "Postni o'chirib bo'lmadi" }, { status: 500 })
  }
}
