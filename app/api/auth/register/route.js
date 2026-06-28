// app/api/auth/register/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

function generateUserId() {
  return Math.floor(100000000 + Math.random() * 900000000).toString()
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { username, email, password, fullName, role, university } = body

    // Validatsiya
    if (!username || !email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Barcha majburiy maydonlarni to\'ldiring' },
        { status: 400 }
      )
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username kamida 3 ta belgidan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    // Username tekshirish
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Bu username band' },
        { status: 400 }
      )
    }

    // Email tekshirish
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Bu email allaqachon ro\'yxatdan o\'tgan' },
        { status: 400 }
      )
    }

    // Parolni hash qilish
    const hashedPassword = await bcrypt.hash(password, 10)

    // 9 xonalik unique userId yaratish
    let userId = generateUserId()
    let isUnique = false
    
    while (!isUnique) {
      const existing = await prisma.user.findUnique({ where: { userId } })
      if (!existing) {
        isUnique = true
      } else {
        userId = generateUserId()
      }
    }

    // Foydalanuvchini yaratish
    const user = await prisma.user.create({
      data: {
        userId,
        username,
        email,
        password: hashedPassword,
        fullName,
        role: role || 'bakalavr',
        university: university || null,
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      }
    })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Ro\'yxatdan o\'tishda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}