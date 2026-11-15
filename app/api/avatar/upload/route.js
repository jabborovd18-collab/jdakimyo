// app/api/avatar/upload/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'
import { xavfsizRasmKengaytmasi } from '@/lib/profil-tekshiruv'
import { profilLogYoz } from '@/lib/profil-log'
import { rasmSehrliBaytTuri } from '@/lib/xavfsiz'

export async function POST(request) {
  try {
    // 1. Autentifikatsiya tekshirish
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Tizimga kirmagansiz' },
        { status: 401 }
      )
    }
    if (session.user.doskaTugaydi) {
      return NextResponse.json(
        { error: 'Elektron doskada profil rasmini almashtirib bo\'lmaydi' },
        { status: 403 }
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
    const ext = xavfsizRasmKengaytmasi(file.type)
    if (!ext) {
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

    // 4.1 Haqiqiy bayt sarlavhasini tekshirish (soxta MIME turidan himoya)
    const baytlar = Buffer.from(await file.arrayBuffer())
    const haqiqiyTur = rasmSehrliBaytTuri(baytlar)
    const haqiqiyExt = xavfsizRasmKengaytmasi(haqiqiyTur)
    if (!haqiqiyExt || haqiqiyExt !== ext) {
      return NextResponse.json(
        { error: 'Fayl tarkibi haqiqiy rasm formatiga mos kelmadi' },
        { status: 400 }
      )
    }

    // 5. Vercel Blob'ga yuklash (tekshirilgan kengaytma va Content-Type bilan)
    const blob = await put(`avatars/${session.user.id}-${Date.now()}.${haqiqiyExt}`, baytlar, {
      access: 'public',
      addRandomSuffix: true,
      contentType: haqiqiyTur,
    })

    // 6. Database'ni yangilash
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: blob.url }
    })

    await profilLogYoz({
      userId: session.user.id,
      toifa: 'profil',
      amal: 'AVATAR_YUKLANDI',
      sarlavha: 'Profil rasmi yangilandi',
      holat: 'muvaffaqiyat',
      request,
    })

    // 7. Muvaffaqiyatli javob
    return NextResponse.json({
      success: true,
      avatarUrl: blob.url
    })

  } catch (error) {
    console.error('[Avatar Upload Error]:', error)
    return NextResponse.json(
      { error: 'Rasm yuklashda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}