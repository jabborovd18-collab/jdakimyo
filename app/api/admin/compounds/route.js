// app/api/admin/compounds/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// GET - Barcha birikmalarni olish
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const geometry = searchParams.get('geometry') || ''

    const where = {}

    if (search) {
      where.OR = [
        { formula: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { centralAtom: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (geometry && geometry !== 'all') {
      where.geometry = geometry
    }

    const compounds = await prisma.compound.findMany({
      where,
      orderBy: { formula: 'asc' }
    })

    return NextResponse.json({
      success: true,
      compounds,
      total: compounds.length
    })
  } catch (error) {
    console.error('[Compounds GET Error]:', error)
    return NextResponse.json(
      { error: 'Birikmalarni yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}

// POST - Yangi birikma qo'shish
export async function POST(request) {
  try {
    const { isAdmin } = await checkAdminAuth('kontent')
    if (!isAdmin) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })

    const data = await request.json()
    if (!data.formula || !data.name) {
      return NextResponse.json({ error: 'Formula va Nomi majburiy' }, { status: 400 })
    }

    const compound = await prisma.compound.create({
      data: {
        formula: data.formula.trim(),
        name: data.name.trim(),
        centralAtom: data.centralAtom?.trim() || null,
        ligands: data.ligands?.trim() || null,
        coordinationNumber: parseInt(data.coordinationNumber) || 4,
        geometry: data.geometry?.trim() || 'Oktaedr',
        oxidationState: parseInt(data.oxidationState) || 2,
        color: data.color?.trim() || null,
        category: data.category?.trim() || 'Kation',
        description: data.description?.trim() || null,
      }
    })

    return NextResponse.json({
      success: true,
      compound,
      message: `✓ "${compound.formula}" birikmasi qo'shildi`
    })
  } catch (error) {
    console.error('[Compounds POST Error]:', error)
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 })
  }
}

// PUT - Birikmani tahrirlash
export async function PUT(request) {
  try {
    const { isAdmin } = await checkAdminAuth('kontent')
    if (!isAdmin) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })

    const data = await request.json()
    if (!data.id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const compound = await prisma.compound.update({
      where: { id: data.id },
      data: {
        formula: data.formula?.trim(),
        name: data.name?.trim(),
        centralAtom: data.centralAtom?.trim(),
        ligands: data.ligands?.trim(),
        coordinationNumber: data.coordinationNumber ? parseInt(data.coordinationNumber) : undefined,
        geometry: data.geometry?.trim(),
        oxidationState: data.oxidationState ? parseInt(data.oxidationState) : undefined,
        color: data.color?.trim(),
        category: data.category?.trim(),
        description: data.description?.trim(),
      }
    })

    return NextResponse.json({
      success: true,
      compound,
      message: `✓ "${compound.formula}" yangilandi`
    })
  } catch (error) {
    console.error('[Compounds PUT Error]:', error)
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 })
  }
}

// DELETE - Birikmani o'chirish
export async function DELETE(request) {
  try {
    const { isAdmin } = await checkAdminAuth('kontent')
    if (!isAdmin) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID kerak' }, { status: 400 })

    await prisma.compound.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: '✓ Birikma o\'chirildi'
    })
  } catch (error) {
    console.error('[Compounds DELETE Error]:', error)
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 })
  }
}
