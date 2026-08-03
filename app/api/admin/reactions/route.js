// app/api/admin/reactions/route.js
// Reaksiyalarni admin paneldan boshqarish.
//
// Qidiruv indeksi (searchText/searchCompact) har saqlashda avtomatik
// qayta hisoblanadi — admin bu haqda o'ylamaydi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { buildSearchIndex, normalizeQuery } from '@/lib/chem-search'
import { isAdminRole } from '@/lib/roles'
import { keshniTozala } from '@/lib/tajriba'
import { qaydEt } from '@/lib/qaydnoma'

// Mijozdan qabul qilinadigan maydonlar (whitelist)
const TEXT_FIELDS = [
  'equation', 'name', 'description', 'category', 'reactionType',
  'temperature', 'pressure', 'catalyst', 'environment',
  'mechanism', 'bestSolvent', 'solventEffect',
  'scale', 'scaleNote', 'observations', 'yieldInfo',
  'source', 'sourceUrl',
]

const JSON_FIELDS = ['intermediates', 'solvents', 'rateFactors', 'techniques', 'equipment', 'hazards']

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || !isAdminRole(session.user.role)) return null
  return session.user
}

/** Mijoz yuborgan ma'lumotdan xavfsiz update obyekti yasash */
function buildData(body) {
  const data = {}

  for (const field of TEXT_FIELDS) {
    if (body[field] === undefined) continue
    const value = typeof body[field] === 'string' ? body[field].trim() : body[field]
    data[field] = value || null
  }

  for (const field of JSON_FIELDS) {
    if (body[field] === undefined) continue
    const value = body[field]
    data[field] = Array.isArray(value) && value.length > 0 ? value : null
  }

  if (body.isVerified !== undefined) data.isVerified = Boolean(body.isVerified)
  if (body.isActive !== undefined) data.isActive = Boolean(body.isActive)

  return data
}

/**
 * Tasdiqlash holati o'zgargan bo'lsa, kim va qachon qilganini yozadi.
 *
 * Nega kerak: "tasdiqlangan" yorlig'i talabaga ma'lumot ishonchli degan
 * signal beradi. Kim tasdiqlaganini bilmasak, bu yorliq javobgarliksiz qoladi.
 * Tasdiq olib tashlansa maydonlar tozalanadi.
 */
function tasdiqniBelgila(data, admin, oldingiHolat) {
  if (data.isVerified === undefined) return data
  if (data.isVerified === oldingiHolat) return data

  return {
    ...data,
    verifiedById: data.isVerified ? admin.id : null,
    verifiedAt: data.isVerified ? new Date() : null,
  }
}

/** Ro'yxatda va javobda tasdiqlovchining nomi ko'rinsin */
const TASDIQLOVCHI = {
  verifiedBy: { select: { id: true, username: true, fullName: true } },
}

/** Qidiruv indeksini qayta hisoblash */
function withSearchIndex(data, current = {}) {
  const equation = data.equation ?? current.equation
  const name = data.name ?? current.name
  const category = data.category ?? current.category
  const catalyst = data.catalyst ?? current.catalyst

  return { ...data, ...buildSearchIndex([equation, name, category, catalyst]) }
}

// ─── GET: ro'yxat ───
export async function GET(request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    const category = searchParams.get('category') || ''
    const verified = searchParams.get('verified') || ''

    const where = {}
    if (category && category !== 'all') where.category = category
    if (verified === 'yes') where.isVerified = true
    if (verified === 'no') where.isVerified = false

    if (q) {
      const nq = normalizeQuery(q)
      where.OR = [
        { searchText: { contains: nq.text } },
        { searchCompact: { contains: nq.compact } },
      ]
    }

    const [reactions, total, categoryGroups, verifiedCount] = await Promise.all([
      prisma.reaction.findMany({
        where,
        orderBy: [{ isVerified: 'asc' }, { updatedAt: 'desc' }],
        take: 200,
        include: TASDIQLOVCHI,
      }),
      prisma.reaction.count({ where }),
      prisma.reaction.groupBy({ by: ['category'], _count: { _all: true } }),
      prisma.reaction.count({ where: { isVerified: true } }),
    ])

    return NextResponse.json({
      success: true,
      total,
      verifiedCount,
      categories: categoryGroups
        .map((row) => ({ name: row.category, count: row._count._all }))
        .sort((a, b) => b.count - a.count),
      reactions,
    })
  } catch (error) {
    console.error('[Admin reactions GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── POST: yangi reaksiya ───
export async function POST(request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    const data = buildData(body)

    if (!data.equation) {
      return NextResponse.json({ error: 'Tenglama majburiy' }, { status: 400 })
    }
    if (!data.category) data.category = 'Boshqa'

    const reaction = await prisma.reaction.create({
      data: withSearchIndex(tasdiqniBelgila(data, admin, false)),
      include: TASDIQLOVCHI,
    })

    // Laboratoriya reaksiyalar ro'yxatini xotirada saqlaydi. Tozalash —
    // shu jarayon uchun; boshqa nusxalarda ro'yxat baribir bir necha
    // daqiqada yangilanadi.
    keshniTozala()

    await qaydEt({
      adminId: admin.id,
      action: 'createReaction',
      targetType: 'Reaction',
      targetId: reaction.id,
      details: reaction.equation,
      request,
    })

    return NextResponse.json({ success: true, reaction })
  } catch (error) {
    console.error('[Admin reactions POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── PUT: tahrirlash ───
export async function PUT(request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    if (!body.id) {
      return NextResponse.json({ error: 'id majburiy' }, { status: 400 })
    }

    const current = await prisma.reaction.findUnique({ where: { id: body.id } })
    if (!current) {
      return NextResponse.json({ error: 'Reaksiya topilmadi' }, { status: 404 })
    }

    const data = tasdiqniBelgila(buildData(body), admin, current.isVerified)
    const reaction = await prisma.reaction.update({
      where: { id: body.id },
      data: withSearchIndex(data, current),
      include: TASDIQLOVCHI,
    })

    keshniTozala()

    await qaydEt({
      adminId: admin.id,
      action: reaction.isVerified && !current.isVerified ? 'verifyReaction' : 'updateReaction',
      targetType: 'Reaction',
      targetId: reaction.id,
      details: reaction.equation,
      request,
    })

    return NextResponse.json({ success: true, reaction })
  } catch (error) {
    console.error('[Admin reactions PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── DELETE ───
export async function DELETE(request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id majburiy' }, { status: 400 })

    const oldingi = await prisma.reaction.findUnique({
      where: { id },
      select: { equation: true },
    })

    await prisma.reaction.delete({ where: { id } })
    keshniTozala()

    await qaydEt({
      adminId: admin.id,
      action: 'deleteReaction',
      targetType: 'Reaction',
      targetId: id,
      details: oldingi?.equation || null,
      request,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Admin reactions DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
