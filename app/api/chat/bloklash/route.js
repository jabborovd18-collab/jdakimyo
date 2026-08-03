// app/api/chat/bloklash/route.js
//
// POST   — bloklash
// DELETE — blokni ochish
// GET    — bloklaganlarim ro'yxati
//
// Bloklangan odam yoza olmaydi va bloklovchining profilini ko'ra olmaydi
// (/api/users/[userId] uni "topilmadi" deb qaytaradi). Unga xabar
// BERILMAYDI: bloklanganini bilish bloklovchini fosh qiladi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ODAM } from '@/lib/chat'

async function odamniTop(userId) {
  return prisma.user.findFirst({
    where: { OR: [{ id: String(userId) }, { userId: String(userId) }] },
    select: { id: true, username: true },
  })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
  }

  const royxat = await prisma.userBlock.findMany({
    where: { blockerId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { blocked: { select: ODAM } },
  })

  return NextResponse.json({
    success: true,
    bloklanganlar: royxat.map((b) => ({
      id: b.id,
      sabab: b.sabab,
      createdAt: b.createdAt,
      odam: b.blocked,
    })),
  })
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { userId, sabab } = await request.json()
    const odam = await odamniTop(userId)
    if (!odam) return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    if (odam.id === session.user.id) {
      return NextResponse.json({ error: 'O\'zingizni bloklab bo\'lmaydi' }, { status: 400 })
    }

    await prisma.userBlock.upsert({
      where: { blockerId_blockedId: { blockerId: session.user.id, blockedId: odam.id } },
      create: {
        blockerId: session.user.id,
        blockedId: odam.id,
        sabab: sabab?.trim()?.slice(0, 300) || null,
      },
      update: {},
    })

    return NextResponse.json({
      success: true,
      message: `${odam.username} bloklandi — endi u sizga yoza olmaydi va profilingizni ko'rmaydi`,
    })
  } catch (error) {
    console.error('[Bloklash POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const odam = await odamniTop(searchParams.get('userId'))
    if (!odam) return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })

    await prisma.userBlock.deleteMany({
      where: { blockerId: session.user.id, blockedId: odam.id },
    })

    return NextResponse.json({ success: true, message: `${odam.username} blokdan chiqarildi` })
  } catch (error) {
    console.error('[Bloklash DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
