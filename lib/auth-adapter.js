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

      // 2. Email prefiksidan foydalanib yaroqli username yaratish
      let baseUsername = (data.email?.split('@')[0] || 'user')
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

      // 3. PostgreSQL NOT NULL cheklovini qondirish uchun xavfsiz tasodifiy parol xeshi
      const randomPassword = await bcrypt.hash(crypto.randomUUID(), 10)

      const user = await prisma.user.create({
        data: {
          email: data.email?.toLowerCase(),
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
      const user = await prisma.user.findFirst({
        where: { email: { equals: email.toLowerCase(), mode: 'insensitive' } },
      })
      if (!user) return null
      return {
        ...user,
        name: user.fullName,
        image: user.avatar,
      }
    },

    // Bog'langan Google akkaunt bo'yicha foydalanuvchini topish
    async getUserByAccount({ providerAccountId, provider }) {
      if (!providerAccountId || !provider) return null
      const account = await prisma.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        select: { user: true },
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
      if (data.email !== undefined) updateData.email = data.email.toLowerCase()
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
  }
}
