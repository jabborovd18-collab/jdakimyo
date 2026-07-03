// app/api/compounds/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Bitta birikma ma'lumotlarini olish
export async function GET(request, { params }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID kerak' },
        { status: 400 }
      )
    }

    const compound = await prisma.compound.findUnique({
      where: { id }
    })

    if (!compound) {
      return NextResponse.json(
        { error: 'Birikma topilmadi' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      compound
    })

  } catch (error) {
    console.error('[Compound GET Error]:', error)
    return NextResponse.json(
      { error: 'Birikmani yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}