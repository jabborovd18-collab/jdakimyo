// app/api/avatar/upload/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'

export async function POST(request) {
  try {
    // 1. Autentifikatsiya tekshirish
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Tizimga kirmagansiz' },
        { status: 401 }
      )
    }

    // 2. Faylni olish
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json(
        { error: 'Rasm topilmadi' },
        { status: 400 }
      )
    }

    // 3. Fayl turini tekshirish
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Faqat JPEG, PNG, WebP yoki GIF formatlar ruxsat etilgan' },
        { status: 400 }
      )
    }

    // 4. Fayl hajmini tekshirish (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Rasm hajmi 5MB dan oshmasligi kerak' },
        { status: 400 }
      )
    }

    // 5. Vercel Blob'ga yuklash
    const blob = await put(`avatars/${session.user.id}-${Date.now()}.${file.name.split('.').pop()}`, file, {
      access: 'public',
    })

    // 6. Database'ni yangilash
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: blob.url }
    })

    // 7. Muvaffaqiyatli javob
    return NextResponse.json({
      success: true,
      avatarUrl: blob.url
    })

  } catch (error) {
    console.error('[Avatar Upload Error]:', error)
    return NextResponse.json(
      { error: 'Rasm yuklashda xatolik: ' + error.message },
      { status: 500 }
    )
  }
}