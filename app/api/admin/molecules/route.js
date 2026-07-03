// app/api/admin/molecules/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/admin-auth'

// GET - Barcha molekulalarni olish
export async function GET(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const centralAtom = searchParams.get('centralAtom') || ''
    const search = searchParams.get('search') || ''
    const featured = searchParams.get('featured')

    const where = {}

    if (category && category !== 'all') where.category = category
    if (centralAtom && centralAtom !== 'all') where.centralAtom = centralAtom
    if (featured === 'true') where.isFeatured = true
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { formula: { contains: search, mode: 'insensitive' } },
        { centralAtom: { contains: search, mode: 'insensitive' } }
      ]
    }

    const molecules = await prisma.molecule3D.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        compound: {
          select: { id: true, name: true, formula: true }
        }
      }
    })

    // Kategoriyalar bo'yicha statistika
    const categoryStats = await prisma.molecule3D.groupBy({
      by: ['category'],
      _count: true
    })

    const stats = {
      total: molecules.length,
      featured: molecules.filter(m => m.isFeatured).length,
      byCategory: categoryStats.reduce((acc, s) => {
        acc[s.category] = s._count
        return acc
      }, {})
    }

    return NextResponse.json({
      success: true,
      molecules,
      stats
    })
  } catch (error) {
    console.error('[Admin Molecules GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Yangi molekula qo'shish
export async function POST(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    // Validatsiya
    if (!data.name || !data.molData || !data.category || !data.centralAtom) {
      return NextResponse.json(
        { error: 'Nomi, MOL ma\'lumotlari, kategoriya va markaziy atom majburiy' },
        { status: 400 }
      )
    }

    const molecule = await prisma.molecule3D.create({
      data: {
        name: data.name,
        formula: data.formula || data.name,
        smiles: data.smiles || null,
        molData: data.molData,
        pdbData: data.pdbData || null,
        category: data.category,
        centralAtom: data.centralAtom,
        ligands: data.ligands || '',
        coordinationNumber: parseInt(data.coordinationNumber) || 6,
        geometry: data.geometry || '',
        description: data.description || null,
        color: data.color || 'blue',
        isFeatured: data.isFeatured || false,
        isActive: data.isActive !== false,
        compoundId: data.compoundId || null
      }
    })

    return NextResponse.json({
      success: true,
      molecule,
      message: '✓ 3D molekula muvaffaqiyatli qo\'shildi'
    })
  } catch (error) {
    console.error('[Admin Molecules POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Molekulani tahrirlash
export async function PUT(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    const molecule = await prisma.molecule3D.update({
      where: { id: data.id },
      data: {
        name: data.name,
        formula: data.formula,
        smiles: data.smiles || null,
        molData: data.molData,
        pdbData: data.pdbData || null,
        category: data.category,
        centralAtom: data.centralAtom,
        ligands: data.ligands || '',
        coordinationNumber: parseInt(data.coordinationNumber) || 6,
        geometry: data.geometry || '',
        description: data.description || null,
        color: data.color || 'blue',
        isFeatured: data.isFeatured || false,
        isActive: data.isActive !== false,
        compoundId: data.compoundId || null
      }
    })

    return NextResponse.json({
      success: true,
      molecule,
      message: '✓ Molekula yangilandi'
    })
  } catch (error) {
    console.error('[Admin Molecules PUT]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Molekulani o'chirish
export async function DELETE(request) {
  try {
    const { isAdmin } = await checkAdminAuth()
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 })
    }

    await prisma.molecule3D.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: '✓ Molekula o\'chirildi'
    })
  } catch (error) {
    console.error('[Admin Molecules DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}