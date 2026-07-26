import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { authOptions } from '../[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Kirish talab qilinadi' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()
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
      return NextResponse.json({ error: "Joriy parol noto'g'ri" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: await bcrypt.hash(newPassword, 12) }
    })

    return NextResponse.json({ success: true, message: "Parol muvaffaqiyatli o'zgartirildi" })
  } catch (error) {
    console.error('[Change password]', error)
    return NextResponse.json({ error: "Parolni o'zgartirib bo'lmadi" }, { status: 500 })
  }
}
