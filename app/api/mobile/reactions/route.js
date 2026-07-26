// app/api/mobile/reactions/route.js
// Reaksiyalar ro'yxati — qidiruv va filtrlar bilan.
//
// Qidiruv formula yozilishiga bog'liq emas: "H2SO4" ham, "H₂SO₄" ham,
// "h2so4" ham bir xil natija beradi (lib/chem-search.js).
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { normalizeQuery } from '@/lib/chem-search'

export { OPTIONS } from '@/lib/cors'

const DEFAULT_LIMIT = 30
const MAX_LIMIT = 100

export async function GET(request) {
  try {
    const auth = await getAuthUser(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const rawQuery = (searchParams.get('q') || '').trim()
    const category = searchParams.get('category') || ''
    const scale = searchParams.get('scale') || ''

    const requestedLimit = parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10)
    const limit = Math.min(
      Math.max(Number.isFinite(requestedLimit) ? requestedLimit : DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    )
    const requestedOffset = parseInt(searchParams.get('offset') || '0', 10)
    const offset = Math.max(Number.isFinite(requestedOffset) ? requestedOffset : 0, 0)

    const where = { isActive: true }

    if (category && category !== 'all') where.category = category
    if (scale && scale !== 'all') where.scale = scale

    if (rawQuery) {
      const q = normalizeQuery(rawQuery)
      // Ikki ko'rinishda ham qidiramiz: bo'sh joyli va zich.
      // searchText/searchCompact bazada allaqachon kichik harfda saqlangan.
      where.OR = [
        { searchText: { contains: q.text } },
        { searchCompact: { contains: q.compact } },
      ]
    }

    const [total, reactions, categoryGroups] = await Promise.all([
      prisma.reaction.count({ where }),
      prisma.reaction.findMany({
        where,
        orderBy: [{ isVerified: 'desc' }, { category: 'asc' }, { equation: 'asc' }],
        skip: offset,
        take: limit,
        select: {
          id: true,
          equation: true,
          name: true,
          category: true,
          reactionType: true,
          temperature: true,
          catalyst: true,
          scale: true,
          isVerified: true,
        },
      }),
      // Filtr uchun kategoriyalar (qidiruvdan qat'i nazar hammasi)
      prisma.reaction.groupBy({
        by: ['category'],
        where: { isActive: true },
        _count: { _all: true },
      }),
    ])

    const categories = categoryGroups
      .map((row) => ({ name: row.category, count: row._count._all }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      success: true,
      total,
      offset,
      limit,
      hasMore: offset + reactions.length < total,
      query: rawQuery || null,
      categories,
      reactions,
    })
  } catch (error) {
    console.error('[Mobile reactions]', error)
    return NextResponse.json(
      { error: 'Reaksiyalarni yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}
