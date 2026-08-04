// app/api/admin/users/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { ASSIGNABLE_ROLES, huquqiBormi, roleInfo, tasdiqlashHuquqiBormi } from '@/lib/roles'
import { xabarYubor } from '@/lib/bildirishnoma'

/**
 * Vaqtinchalik parol yaratadi.
 *
 * Adashtiradigan belgilar (0/O, 1/l/I) ataylab olib tashlangan: parol
 * og'zaki aytiladi yoki qo'lda ko'chiriladi, "0" bilan "O" ni chalkashtirish
 * eng ko'p uchraydigan xato.
 */
function parolYarat() {
  const belgilar = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  const uzunlik = 12

  // Math.random() emas — parol uchun kriptografik tasodif kerak
  const baytlar = new Uint32Array(uzunlik)
  crypto.getRandomValues(baytlar)

  let parol = ''
  for (let i = 0; i < uzunlik; i++) {
    parol += belgilar[baytlar[i] % belgilar.length]
  }
  return parol
}

// GET - Foydalanuvchilar ro'yxati (pagination, qidiruv, filtrlar bilan)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Foydalanuvchilar ro'yxati moderatorga YOPIQ: bu nazorat ma'lumoti
    // (email, oxirgi faollik, ballar), moderatorning ishi esa kontent va
    // izohlarni tozalash.
    if (!huquqiBormi(session.user.role, 'foydalanuvchilar')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Filtrlarni yaratish
    const where = {}

    // Qidiruv (email, username, fullName)
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Rol filtri
    if (role && role !== 'all') {
      where.role = role
    }

    // Status filtri (active/banned)
    if (status === 'active') {
      where.isBanned = false
    } else if (status === 'banned') {
      where.isBanned = true
    }

    // Jami foydalanuvchilar soni
    const totalUsers = await prisma.user.count({ where })

    // Pagination
    const skip = (page - 1) * limit

    // Foydalanuvchilarni olish
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        userId: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        isTeacher: true,
        isVerified: true,
        avatar: true,
        university: true,
        level_points: true,
        totalPoints: true,
        currentStreak: true,
        isBanned: true,
        bannedAt: true,
        bannedReason: true,
        lastActive: true,
        createdAt: true,
        _count: {
          select: {
            quizResults: true,
            achievements: true,
            followers: true,
            following: true,
            friendships1: true,
            friendships2: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    })

    // Umumiy statistika
    const stats = await prisma.user.aggregate({
      _count: { id: true },
      _sum: { totalPoints: true }
    })

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayRegistrations = await prisma.user.count({
      where: { createdAt: { gte: todayStart } }
    })

    const activeUsers = await prisma.user.count({
      where: { lastActive: { gte: todayStart } }
    })

    const bannedUsers = await prisma.user.count({
      where: { isBanned: true }
    })

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        hasMore: page * limit < totalUsers
      },
      stats: {
        total: stats._count.id,
        totalPoints: stats._sum.totalPoints || 0,
        todayRegistrations,
        activeUsers,
        bannedUsers
      }
    })

  } catch (error) {
    console.error('[Admin Users GET Error]:', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}

// PUT - Foydalanuvchini yangilash (rol, bloklash)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Faqat admin yoki superadmin
    const isAdmin = ['admin', 'superadmin'].includes(session.user.role)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin huquqi kerak' }, { status: 403 })
    }

    const { userId, action, data } = await request.json()

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId va action kerak' },
        { status: 400 }
      )
    }

    // O'zini o'zi boshqara olmaydi
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'O\'zingizni boshqara olmaysiz' },
        { status: 400 }
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    // Superadmin himoyasi - oddiy admin superadminni o'zgartira olmaydi
    if (targetUser.role === 'superadmin' && session.user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Superadminni faqat superadmin boshqaradi' },
        { status: 403 }
      )
    }

    let updateData = {}
    let message = ''
    // Foydalanuvchiga yuboriladigan xabar. Har bir amal uni o'zi to'ldiradi:
    // admin hisobga tegsa, egasi buni bilishi kerak. Avval hech qanday
    // xabar bo'lmasdi — odam roli o'zgarganini tasodifan sezardi.
    let xabar = null
    // Faqat parol tiklanganda to'ladi va javobda BIR MARTA qaytariladi —
    // bazada xesh saqlanadi, ya'ni keyin uni hech qayerdan ko'rib bo'lmaydi.
    let vaqtinchalikParol = null

    switch (action) {
      case 'changeRole':
        if (!data?.role) {
          return NextResponse.json({ error: 'Yangi rol kerak' }, { status: 400 })
        }
        if (!ASSIGNABLE_ROLES.includes(data.role)) {
          return NextResponse.json({ error: 'Noto\'g\'ri rol' }, { status: 400 })
        }
        // Superadmin rolini faqat superadmin bera oladi
        if (data.role === 'superadmin' && session.user.role !== 'superadmin') {
          return NextResponse.json(
            { error: 'Superadmin rolini faqat superadmin bera oladi' },
            { status: 403 }
          )
        }
        updateData = { role: data.role }
        message = `Rol ${data.role} ga o'zgartirildi`
        xabar = {
          turi: 'rol',
          sarlavha: `🎖️ Rolingiz o'zgardi: ${roleInfo(data.role).label}`,
          matn: 'Yangi huquqlar keyingi kirishda kuchga kiradi.',
          havola: '/profil',
        }
        break

      case 'ban':
        updateData = {
          isBanned: true,
          bannedAt: new Date(),
          bannedReason: data?.reason || 'Qoidabuzarlik'
        }
        message = 'Foydalanuvchi bloklandi'
        xabar = {
          turi: 'blok',
          sarlavha: '⛔ Hisobingiz bloklandi',
          matn: `Sabab: ${data?.reason || 'Qoidabuzarlik'}`,
        }
        break

      case 'unban':
        updateData = {
          isBanned: false,
          bannedAt: null,
          bannedReason: null
        }
        message = 'Foydalanuvchi ochildi'
        xabar = {
          turi: 'blok-olindi',
          sarlavha: '🔓 Hisobingiz blokdan chiqarildi',
          matn: 'Saytdan yana to\'liq foydalanishingiz mumkin.',
          havola: '/profil',
        }
        break

      case 'toggleTeacher': {
        // USTOZLIK — IKKILAMCHI. U asosiy rolni almashtirmaydi, yoniga
        // qo'shiladi. Avval ustozlik `role` ning qiymati edi va shuning
        // uchun adminlik bilan birga tura olmasdi: odamga admin berilishi
        // bilan ustoz paneli yo'qolardi.
        const yoqilsinmi = !targetUser.isTeacher
        updateData = { isTeacher: yoqilsinmi }
        message = yoqilsinmi ? 'Ustoz paneli ochildi' : 'Ustoz paneli yopildi'
        xabar = yoqilsinmi
          ? {
              turi: 'rol',
              sarlavha: '👨‍🏫 Sizga ustoz paneli ochildi',
              matn: 'Endi guruh yaratish, vazifa berish va quiz o\'tkazish mumkin.',
              havola: '/ustoz',
            }
          : {
              turi: 'rol',
              sarlavha: 'Ustoz paneli yopildi',
              matn: 'Guruhlaringiz va vazifalaringiz o\'chirilmadi.',
              havola: '/profil',
            }
        break
      }

      case 'toggleVerified': {
        // TASDIQ BELGISI — FAQAT SUPERADMIN. Belgining butun ma'nosi
        // "bu haqiqiy odam, tekshirilgan" degani; uni ko'p odam tarqata
        // olsa, belgi soxta hisobni ajratish uchun ishlamay qoladi.
        if (!tasdiqlashHuquqiBormi(session.user.role)) {
          return NextResponse.json(
            { error: 'Hisobni faqat superadmin tasdiqlaydi' },
            { status: 403 }
          )
        }

        const tasdiqlansinmi = !targetUser.isVerified
        updateData = tasdiqlansinmi
          ? {
              isVerified: true,
              verifiedAt: new Date(),
              verifiedById: session.user.id,
            }
          : {
              isVerified: false,
              verifiedAt: null,
              verifiedById: null,
            }
        message = tasdiqlansinmi ? 'Hisob tasdiqlandi' : 'Tasdiq olib tashlandi'
        xabar = tasdiqlansinmi
          ? {
              turi: 'tizim',
              sarlavha: '✅ Hisobingiz tasdiqlandi',
              matn: 'Endi ismingiz yonida tasdiq belgisi ko\'rinadi.',
              havola: '/profil',
              icon: '✅',
            }
          : {
              turi: 'tizim',
              sarlavha: 'Hisobingiz tasdig\'i olib tashlandi',
              havola: '/profil',
            }

        // Kim kimni tasdiqlagani keyin so'raladigan savol — qaydnomaga
        // yozamiz, `verifiedById` ning o'zi tasdiq olib tashlanganda
        // tozalanadi va tarix yo'qoladi.
        await prisma.auditLog.create({
          data: {
            adminId: session.user.id,
            action: tasdiqlansinmi ? 'verifyUser' : 'unverifyUser',
            targetType: 'User',
            targetId: userId,
            details: `${targetUser.username} ${tasdiqlansinmi ? 'tasdiqlandi' : 'tasdig\'i olindi'}`,
            ipAddress:
              request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
              request.headers.get('x-real-ip') ||
              null,
            userAgent: request.headers.get('user-agent') || null,
          },
        })
        break
      }

      case 'resetPassword': {
        // Avval bu amal hech narsa qilmasdan "email yuborildi" deb
        // qaytarardi — admin muvaffaqiyat xabarini ko'rardi-yu, parol
        // o'zgarmasdi va foydalanuvchi baribir hisobiga kira olmasdi.
        //
        // Parolni KO'RSATIB bo'lmaydi: u bcrypt bilan xeshlangan, bu bir
        // tomonlama amal. Shuning uchun yagona to'g'ri yordam — yangi
        // vaqtinchalik parol o'rnatib, uni foydalanuvchiga berish.
        if (session.user.role !== 'superadmin') {
          return NextResponse.json(
            { error: 'Parolni faqat superadmin tiklaydi' },
            { status: 403 }
          )
        }

        vaqtinchalikParol = parolYarat()
        updateData = { password: await bcrypt.hash(vaqtinchalikParol, 12) }
        message = 'Yangi vaqtinchalik parol yaratildi'
        // Parolning o'zi xabarga YOZILMAYDI: bildirishnoma bazada ochiq
        // matnda turadi va uni ko'rgan har kim hisobga kira olardi. Admin
        // parolni foydalanuvchiga boshqa yo'l bilan yetkazadi.
        xabar = {
          turi: 'parol',
          sarlavha: '🔑 Parolingiz administrator tomonidan tiklandi',
          matn: 'Yangi vaqtinchalik parolni administratordan oling va kirgach uni o\'zgartiring.',
          havola: '/profil/sozlama',
        }

        // Kim, kimga va qachon — javobgarlik uchun qaydnomaga yoziladi
        await prisma.auditLog.create({
          data: {
            adminId: session.user.id,
            action: 'resetPassword',
            targetType: 'User',
            targetId: userId,
            details: `${targetUser.username} uchun vaqtinchalik parol o'rnatildi`,
            ipAddress:
              request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
              request.headers.get('x-real-ip') ||
              null,
            userAgent: request.headers.get('user-agent') || null,
          },
        })
        break
      }

      default:
        return NextResponse.json({ error: 'Noma\'lum amal' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        userId: true,
        username: true,
        email: true,
        role: true,
        isTeacher: true,
        isVerified: true,
        isBanned: true,
        bannedAt: true,
        bannedReason: true
      }
    })

    if (xabar) {
      await xabarYubor(userId, { ...xabar, adminId: session.user.id })
    }

    return NextResponse.json({
      success: true,
      message,
      user: updatedUser,
      // Faqat parol tiklangan holatda keladi
      ...(vaqtinchalikParol ? { temporaryPassword: vaqtinchalikParol } : {}),
    })

  } catch (error) {
    console.error('[Admin Users PUT Error]:', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}

// DELETE - Foydalanuvchini o'chirish (faqat superadmin)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Faqat superadmin
    if (session.user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Faqat superadmin o\'chirishi mumkin' },
        { status: 403 }
      )
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId kerak' }, { status: 400 })
    }

    // O'zini o'zi o'chira olmaydi
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'O\'zingizni o\'chira olmaysiz' },
        { status: 400 }
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }

    // Superadminni o'chirish mumkin emas
    if (targetUser.role === 'superadmin') {
      return NextResponse.json(
        { error: 'Superadminni o\'chirib bo\'lmaydi' },
        { status: 403 }
      )
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: `${targetUser.username} foydalanuvchisi o'chirildi`
    })

  } catch (error) {
    console.error('[Admin Users DELETE Error]:', error)
    return NextResponse.json(
      { error: 'Xatolik: ' + error.message },
      { status: 500 }
    )
  }
}