// app/api/profil/collection/route.js
// Profil sahifalaridagi ro'yxatlar (do'stlar, obunachilar, obunalar, sertifikat, yutuq, quiz)
// uchun sahifalangan, faqat kerakli turdagi ma'lumotni qaytaradigan endpoint.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { dostRoyxatidanAjrat } from '@/lib/profil-tekshiruv'
import { QUIZ_NATIJA_TARTIBI, quizNatijaniBoyit } from '@/lib/quiz-natija-boshqaruv'
import { MILLIY_SERTIFIKAT_VARIANTLARI } from '@/lib/milliy-sertifikat-data'

const MS_NOM_MAP = new Map(MILLIY_SERTIFIKAT_VARIANTLARI.map((v) => [v.slug, v.nom]))

const SAFE_USER_SELECT = {
  id: true,
  userId: true,
  username: true,
  fullName: true,
  isVerified: true,
  avatar: true,
  university: true,
  role: true
}

const MAX_LIMIT = 50

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get('limit') || '20') || 20))
    const skip = (page - 1) * limit

    let items = []
    let total = 0

    switch (type) {
      case 'achievements': {
        [items, total] = await Promise.all([
          prisma.achievement.findMany({
            where: { userId },
            orderBy: { earnedAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.achievement.count({ where: { userId } })
        ])
        break
      }

      case 'certificates': {
        [items, total] = await Promise.all([
          prisma.certificate.findMany({
            where: { userId },
            orderBy: { issuedAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.certificate.count({ where: { userId } })
        ])
        break
      }

      case 'quizzes': {
        const [quizRows, totalQuizzes] = await Promise.all([
          prisma.quizResult.findMany({
            where: { userId },
            orderBy: QUIZ_NATIJA_TARTIBI,
            skip,
            take: limit
          }),
          prisma.quizResult.count({ where: { userId } })
        ])
        items = quizRows.map(quizNatijaniBoyit)
        total = totalQuizzes
        break
      }

      case 'friends': {
        const whereFriends = { OR: [{ user1Id: userId }, { user2Id: userId }] }
        const [friendships, totalFriends] = await Promise.all([
          prisma.friendship.findMany({
            where: whereFriends,
            select: {
              createdAt: true,
              user1Id: true,
              user1: { select: SAFE_USER_SELECT },
              user2: { select: SAFE_USER_SELECT }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.friendship.count({ where: whereFriends })
        ])
        items = dostRoyxatidanAjrat(friendships, userId)
        total = totalFriends
        break
      }

      case 'followers': {
        [items, total] = await Promise.all([
          prisma.follow.findMany({
            where: { followingId: userId },
            select: { createdAt: true, follower: { select: SAFE_USER_SELECT } },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.follow.count({ where: { followingId: userId } })
        ])
        items = items.map(f => ({ ...f.follower, createdAt: f.createdAt }))
        break
      }

      case 'following': {
        [items, total] = await Promise.all([
          prisma.follow.findMany({
            where: { followerId: userId },
            select: { createdAt: true, following: { select: SAFE_USER_SELECT } },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.follow.count({ where: { followerId: userId } })
        ])
        items = items.map(f => ({ ...f.following, createdAt: f.createdAt }))
        break
      }

      case 'ms_urinishlar': {
        const [xomUrinishlar, jamiUrinishlar] = await Promise.all([
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
              kechikkan: true,
              boshlanganVaqt: true,
              yakunlanganVaqt: true,
            },
            orderBy: { boshlanganVaqt: 'desc' },
            skip,
            take: limit,
          }),
          prisma.msUrinish.count({ where: { userId } }),
        ])

        items = xomUrinishlar.map((u) => {
          const elonQilingan = u.holat === 'elon_qilindi'
          const examName = MS_NOM_MAP.get(u.slug) || u.slug
          if (!elonQilingan) {
            return {
              id: u.id,
              slug: u.slug,
              examName,
              holat: u.holat,
              elonQilingan: false,
              jamiSavollar: u.jamiSavollar,
              kechikkan: u.kechikkan,
              boshlanganVaqt: u.boshlanganVaqt,
              yakunlanganVaqt: u.yakunlanganVaqt,
            }
          }
          return {
            id: u.id,
            slug: u.slug,
            examName,
            holat: u.holat,
            elonQilingan: true,
            shkalaBalli: Number(Number(u.shkalaBalli).toFixed(1)),
            daraja: u.daraja,
            theta: Number(Number(u.theta).toFixed(2)),
            se: Number(Number(u.se).toFixed(2)),
            rawScore: u.rawScore,
            jamiSavollar: u.jamiSavollar,
            oddiyFoiz: u.oddiyFoiz,
            cohortRank: u.cohortRank,
            cohortTotal: u.cohortTotal,
            percentile: u.percentile,
            certId: u.certId,
            kechikkan: u.kechikkan,
            boshlanganVaqt: u.boshlanganVaqt,
            yakunlanganVaqt: u.yakunlanganVaqt,
          }
        })
        total = jamiUrinishlar
        break
      }

      default:
        return NextResponse.json({ error: "Noto'g'ri turdagi so'rov" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      items,
      total,
      page,
      limit,
      hasMore: skip + items.length < total
    })
  } catch (error) {
    console.error('[Profile Collection GET]', error)
    return NextResponse.json(
      { error: "Ma'lumotlarni yuklashda xatolik" },
      { status: 500 }
    )
  }
}
