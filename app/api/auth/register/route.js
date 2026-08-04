// app/api/auth/register/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SELF_REGISTER_ROLES, DEFAULT_ROLE } from '@/lib/roles'
import { emailniTekshir, kodYuboroq } from '@/lib/email-tasdiq'
import { soravchiIp, chekloqniTekshir, urinishniQayd, kutishMatni } from '@/lib/ip-cheklov'

// Username uchun ruxsat etilgan ko'rinish. "@" ataylab taqiqlangan:
// login username YOKI email bo'yicha ishlagani uchun, "@" li username
// boshqa foydalanuvchining email'iga teng bo'lib qolishi mumkin edi.
const USERNAME_PATTERN = /^[a-z0-9._]{3,30}$/

function generateUserId() {
  return Math.floor(100000000 + Math.random() * 900000000).toString()
}

export async function POST(request) {
  try {
    // IP CHEKLOVI eng boshida: bitta kompyuterdan istalgancha hisob
    // ochish mumkin edi va har biri tasdiqlash xatini yuborardi.
    // Tekshiruv bazaga tegishdan oldin turadi — to'silgan skript
    // ortiqcha so'rov qildirmasin.
    const ip = soravchiIp(request)
    const cheklov = await chekloqniTekshir('royxat', ip)
    if (!cheklov.ok) {
      return NextResponse.json(
        {
          error: `Bu tarmoqdan juda ko'p hisob ochildi. ${kutishMatni(cheklov.kutish)}dan keyin urinib ko'ring.`,
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { password, role } = body

    // Normalizatsiya: bo'sh joy va registr sababli keyinchalik
    // login qilib bo'lmay qolmasligi uchun.
    const username = (body.username || '').trim().toLowerCase()
    const email = (body.email || '').trim().toLowerCase()
    const fullName = (body.fullName || '').trim()
    const university = (body.university || '').trim()

    // Validatsiya
    if (!username || !email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Barcha majburiy maydonlarni to\'ldiring' },
        { status: 400 }
      )
    }

    // Email FORMATI avval umuman tekshirilmasdi — "asdasd" ham
    // qabul qilinardi va bir odam istalgancha akkaunt ocha olardi.
    const emailHolati = emailniTekshir(email)
    if (!emailHolati.ok) {
      return NextResponse.json({ error: emailHolati.xato }, { status: 400 })
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username kamida 3 ta belgidan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    if (!USERNAME_PATTERN.test(username)) {
      return NextResponse.json(
        { error: 'Username faqat kichik harflar, raqamlar, "." va "_" dan iborat bo\'lishi kerak (3-30 ta belgi)' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' },
        { status: 400 }
      )
    }

    // Username tekshirish (registrni hisobga olmagan holda)
    const existingUsername = await prisma.user.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } }
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Bu username band' },
        { status: 400 }
      )
    }

    // Email tekshirish (registrni hisobga olmagan holda)
    const existingEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
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

    // Ro'yxatdan o'tishda faqat akademik rollarga ruxsat beriladi.
    // Ustoz/moderator/admin kabi imtiyozli rollar faqat admin panel orqali beriladi
    // (ro'yxat lib/roles.js da — barcha joy uchun yagona manba).
    const safeRole = SELF_REGISTER_ROLES.includes(role) ? role : DEFAULT_ROLE

    // Foydalanuvchini yaratish
    const user = await prisma.user.create({
      data: {
        userId,
        username,
        email,
        password: hashedPassword,
        fullName,
        role: safeRole,
        university: university || null,
      }
    })

    // Sanoq AYNAN shu yerda — hisob yaratilgandan keyin. Forma
    // xatolari (band username, qisqa parol) sanalmaydi: aks holda
    // bir-ikki marta adashgan odam o'z kvotasini yeb qo'yardi,
    // holbuki xat ham, hisob ham yaratilmagan edi.
    await urinishniQayd('royxat', ip)

    // Tasdiqlash kodini yuboramiz. Xat ketmasa ham RO'YXATDAN O'TISH
    // BEKOR BO'LMAYDI: hisob yaratilgan, odam keyin kodni qayta
    // so'rashi mumkin. Aks holda pochta xizmati bir daqiqaga
    // to'xtaganda ro'yxatdan o'tish butunlay ishlamay qolardi.
    const pochta = await kodYuboroq(user)

    return NextResponse.json({
      success: true,
      // Sahifa shu bo'yicha "kodni kiriting" oynasiga o'tadi
      tasdiqKerak: true,
      xatYuborildi: pochta.yuborildi,
      // Yuborilmasa sababini yashirmaymiz — odam nima qilishini bilsin
      xatXatosi: pochta.yuborildi ? null : pochta.sabab,
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