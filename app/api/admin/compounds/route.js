// app/api/compounds/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Barcha birikmalarni olish (public, auth kerak emas)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const geometry = searchParams.get('geometry') || ''

    const where = {}

    // Qidiruv (formula, nom, markaziy atom)
    if (search) {
      where.OR = [
        { formula: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { centralAtom: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Kategoriya filtri
    if (category && category !== 'all') {
      where.category = category
    }

    // Geometriya filtri
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