// app/api/profil/quizlar/route.js
// Shaxsiy kabinetdagi quiz natijalarini filtrlash, qidirish va boshqarish uchun ro'yxat.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  quizNatijaFiltrSharti,
  quizNatijaSaralashTartibi,
  quizNatijaXulosaHisobla,
  quizNatijaniBoyit,
} from '@/lib/quiz-natija-boshqaruv'

const VALID_FILTERS = new Set(['all', 'visible', 'pinned', 'hidden'])
const VALID_SOURCES = new Set(['all', 'erkin', 'rasmiy'])
const VALID_SORTS = new Set(['default', 'best', 'oldest'])
const MAX_LIMIT = 50

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)

    const rawFilter = searchParams.get('filter') || 'all'
    const rawSource = searchParams.get('source') || 'all'
    const rawSort = searchParams.get('sort') || 'default'
    const filter = VALID_FILTERS.has(rawFilter) ? rawFilter : 'all'
    const source = VALID_SOURCES.has(rawSource) ? rawSource : 'all'
    const sort = VALID_SORTS.has(rawSort) ? rawSort : 'default'
    const search = (searchParams.get('search') || '').trim().slice(0, 100)

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20))
    const skip = (page - 1) * limit

    const where = quizNatijaFiltrSharti(userId, { filter, source, search })
    const orderBy = quizNatijaSaralashTartibi(sort)

    const [summaryRows, rows, total] = await Promise.all([
      prisma.quizResult.findMany({
        where: { userId },
        select: {
          attemptId: true,
          percentage: true,
          isPinned: true,
          isHidden: true,
        },
      }),
      prisma.quizResult.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.quizResult.count({ where }),
    ])

    return NextResponse.json({
      items: rows.map(quizNatijaniBoyit),
      summary: quizNatijaXulosaHisobla(summaryRows),
      page,
      limit,
      total,
      hasMore: skip + rows.length < total,
    })
  } catch (error) {
    console.error('[Profil quizlar GET]', error)
    return NextResponse.json(
      { error: 'Quiz natijalarini yuklashda xatolik' },
      { status: 500 },
    )
  }
}
