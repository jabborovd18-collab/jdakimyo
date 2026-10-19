// lib/auth-adapter.js
//
// NextAuth PrismaAdapter uchun moslashtirilgan o'ram (wrapper).
//
// Nega kerak: Standart NextAuth Prisma adapteri 'name' va 'image' maydonlarini
// kutadi va 'userId', 'username', 'password' maydonlarini bilmaydi.
// Bizning User modelimizda esa bu maydonlar majburiy (NOT NULL).
// Google OAuth orqali kirganda xatolik chiqmasligi uchun ushbu adapter
// yangi foydalanuvchiga avtomatik 9 xonali userId, toza username va
// xavfsiz vaqtinchalik parol xeshini biriktirib bazaga yozadi.
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export function createCustomAuthAdapter() {
  const baseAdapter = PrismaAdapter(prisma)

  return {
    ...baseAdapter,

    // Google orqali birinchi marta kirgan yangi foydalanuvchini yaratish
    async createUser(data) {
      if (!data?.email) {
        throw new Error("Email manzil topilmadi")
      }
      const email = data.email.toLowerCase().trim()

      // Agar ushbu email bilan foydalanuvchi allaqachon mavjud bo'lsa (masalan credentials orqali ochilgan),
      // qayta yaratmasdan mavjudini qaytaramiz (idempotentlik)
      const existingUser = await prisma.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
      })
      if (existingUser) {
        return {
          ...existingUser,
          name: existingUser.fullName,
          image: existingUser.avatar,
        }
      }

      // 1. Tizim standarti bo'yicha 9 xonali unikal userId generatsiya qilish
      let userId = Math.floor(100000000 + Math.random() * 900000000).toString()
      let isUnique = false
      let userIdAttempts = 0
      while (!isUnique && userIdAttempts < 20) {
        userIdAttempts++
        const existing = await prisma.user.findUnique({ where: { userId } })
        if (!existing) isUnique = true
        else userId = Math.floor(100000000 + Math.random() * 900000000).toString()
      }
      if (!isUnique) {
        userId = `${Date.now()}`.slice(-9)
      }

      // 2. Email prefiksidan foydalanib yaroqli username yaratish
      let baseUsername = (email.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9._]/g, '')
        .replace(/^[._]+|[._]+$/g, '')
      if (baseUsername.length < 3) baseUsername = 'user_' + (baseUsername || 'chem')
      let username = baseUsername.slice(0, 24)
      let count = 1
      let usernameAttempts = 0
      while (
        usernameAttempts < 50 &&
        await prisma.user.findFirst({
          where: { username: { equals: username, mode: 'insensitive' } },
        })
      ) {
        usernameAttempts++
        username = `${baseUsername.slice(0, 20)}_${count++}`
      }
      if (usernameAttempts >= 50) {
        username = `user_${Date.now().toString(36)}`
      }

      // 3. PostgreSQL NOT NULL cheklovini qondirish uchun xavfsiz tasodifiy parol xeshi
      const randomPassword = await bcrypt.hash(crypto.randomUUID(), 10)

      const user = await prisma.user.create({
        data: {
          email,
          emailVerified: data.emailVerified || new Date(),
          fullName: data.name || username,
          avatar: data.image || null,
          userId,
          username,
          password: randomPassword,
          role: 'bakalavr',
        },
      })

      return {
        ...user,
        name: user.fullName,
        image: user.avatar,
      }
    },

    // ID bo'yicha foydalanuvchini NextAuth talab qilgan formatda qaytarish
    async getUser(id) {
      if (!id) return null
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) return null
      return {
        ...user,
        name: user.fullName,
        image: user.avatar,
      }
    },

    // Email bo'yicha foydalanuvchini olish (harflar kattaligiga sezgir bo'lmagan holda)
    async getUserByEmail(email) {
      if (!email) return null
      const cleanEmail = email.toLowerCase().trim()
      const user = await prisma.user.findFirst({
        where: { email: { equals: cleanEmail, mode: 'insensitive' } },
      })
      if (!user) return null
      return {
        ...user,
        name: user.fullName,
        image: user.avatar,
      }
    },

    // Bog'langan Google akkaunt bo'yicha foydalanuvchini topish
    async getUserByAccount(provider_providerAccountId) {
      const provider =
        provider_providerAccountId?.provider ||
        provider_providerAccountId?.provider_providerAccountId?.provider
      const providerAccountId =
        provider_providerAccountId?.providerAccountId ||
        provider_providerAccountId?.provider_providerAccountId?.providerAccountId
      if (!provider || !providerAccountId) return null

      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId: String(providerAccountId),
          },
        },
        include: { user: true },
      })
      if (!account?.user) return null
      return {
        ...account.user,
        name: account.user.fullName,
        image: account.user.avatar,
      }
    },

    // Foydalanuvchi profilini yangilash
    async updateUser(data) {
      if (!data?.id) return null
      const updateData = {}
      if (data.name !== undefined) updateData.fullName = data.name
      if (data.image !== undefined) updateData.avatar = data.image
      if (data.email !== undefined) updateData.email = data.email.toLowerCase().trim()
      if (data.emailVerified !== undefined) updateData.emailVerified = data.emailVerified

      const user = await prisma.user.update({
        where: { id: data.id },
        data: updateData,
      })
      return {
        ...user,
        name: user.fullName,
        image: user.avatar,
      }
    },

    // Google OAuth akkauntini User ga bog'lash (linkAccount)
    //
    // Nega maxsus yozildi: Google OAuth token qaytarganda 'expires_in' maydoni ham
    // keladi. Standart @auth/prisma-adapter barcha maydonlarni to'g'ridan-to'g'ri
    // Prisma ga uzatadi va Prisma 'Unknown argument expires_in' xatosi bilan yiqiladi.
    // Bu yerda faqat Prisma Account modelidagi ustunlar olinadi, expires_at 32-bit
    // butun songa (Int) keltiriladi va upsert orqali takroriy bog'lashda ham xatosiz ishlaydi.
    async linkAccount(account) {
      if (!account?.userId || !account?.provider || !account?.providerAccountId) {
        throw new Error("Akkaunt ma'lumotlari to'liq emas")
      }

      // expires_at hisoblash: Google 'expires_in' (sekund) yoki 'expires_at' (timestamp) beradi
      let expires_at = null
      if (account.expires_at !== undefined && account.expires_at !== null) {
        const num = Number(account.expires_at)
        if (!Number.isNaN(num)) expires_at = Math.round(num)
      } else if (account.expires_in !== undefined && account.expires_in !== null) {
        const num = Number(account.expires_in)
        if (!Number.isNaN(num)) expires_at = Math.round(Date.now() / 1000 + num)
      }

      // PostgreSQL Int chegarasi: 32-bit signed int [-2147483648, 2147483647]
      if (expires_at !== null && (expires_at < 0 || expires_at > 2147483647)) {
        expires_at = null
      }

      // Faqat Prisma Account modelidagi ruxsat etilgan maydonlar:
      const cleanData = {
        userId: account.userId,
        type: account.type || 'oauth',
        provider: account.provider,
        providerAccountId: String(account.providerAccountId),
        refresh_token: account.refresh_token ? String(account.refresh_token) : null,
        access_token: account.access_token ? String(account.access_token) : null,
        expires_at,
        token_type: account.token_type ? String(account.token_type).toLowerCase() : null,
        scope: account.scope ? String(account.scope) : null,
        id_token: account.id_token ? String(account.id_token) : null,
        session_state: account.session_state ? String(account.session_state) : null,
      }

      return await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: cleanData.provider,
            providerAccountId: cleanData.providerAccountId,
          },
        },
        update: cleanData,
        create: cleanData,
      })
    },

    // Akkauntni uzish (unlinkAccount)
    async unlinkAccount(provider_providerAccountId) {
      const provider =
        provider_providerAccountId?.provider ||
        provider_providerAccountId?.provider_providerAccountId?.provider
      const providerAccountId =
        provider_providerAccountId?.providerAccountId ||
        provider_providerAccountId?.provider_providerAccountId?.providerAccountId
      if (!provider || !providerAccountId) return null

      try {
        return await prisma.account.delete({
          where: {
            provider_providerAccountId: {
              provider,
              providerAccountId: String(providerAccountId),
            },
          },
        })
      } catch (e) {
        return null
      }
    },

    // Akkauntni olish (getAccount)
    async getAccount(providerAccountId, provider) {
      if (!providerAccountId || !provider) return null
      return await prisma.account.findFirst({
        where: {
          providerAccountId: String(providerAccountId),
          provider,
        },
      })
    },
  }
}
