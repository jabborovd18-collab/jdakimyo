import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { authOptions } from '../[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { profilLogYoz } from '@/lib/profil-log'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Kirish talab qilinadi' }, { status: 401 })
    }
    if (session.user.doskaTugaydi) {
      return NextResponse.json(
        { error: "Elektron doskada parolni o'zgartirib bo'lmaydi" },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => null)
    const { currentPassword, newPassword } = body || {}
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return NextResponse.json({ error: "Parol ma'lumotlari noto'g'ri" }, { status: 400 })
    }
    if (newPassword.length < 8 || newPassword.length > 128) {
      return NextResponse.json({ error: "Yangi parol 8–128 ta belgidan iborat bo'lishi kerak" }, { status: 400 })
    }
    if (currentPassword === newPassword) {
      return NextResponse.json({ error: 'Yangi parol avvalgi paroldan farq qilishi kerak' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true }
    })
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      await profilLogYoz({
        userId: session.user.id,
        toifa: 'xavfsizlik',
        amal: 'PAROL_XATO_URINISH',
        sarlavha: "Parol o'zgartirishda xato joriy parol",
        holat: 'ogohlantirish',
        request,
      })
      return NextResponse.json({ error: "Joriy parol noto'g'ri" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: await bcrypt.hash(newPassword, 12) }
    })

    await profilLogYoz({
      userId: session.user.id,
      toifa: 'xavfsizlik',
      amal: 'PAROL_OZGARDI',
      sarlavha: "Hisob paroli o'zgartirildi",
      holat: 'muvaffaqiyat',
      request,
    })

    return NextResponse.json({ success: true, message: "Parol muvaffaqiyatli o'zgartirildi" })
  } catch (error) {
    console.error('[Change password]', error)
    return NextResponse.json({ error: "Parolni o'zgartirib bo'lmadi" }, { status: 500 })
  }
}
