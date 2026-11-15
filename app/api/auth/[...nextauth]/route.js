// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { createCustomAuthAdapter } from '@/lib/auth-adapter'
import { prisma } from '@/lib/prisma'
import { verifyCredentials } from '@/lib/credentials'
import { profilLogYoz } from '@/lib/profil-log'
import { tokenniAlmashtir, doskaSessiyaYaroqlimi } from '@/lib/doska'
import { soravchiIp } from '@/lib/ip-cheklov'
import { authMaxfiyKaliti } from '@/lib/auth-maxfiy-kalit'
import { parolIzi, sessiyaYaroqlimi } from '@/lib/auth-sessiya'
import {
  nextAuthYonaltirishManzili,
  sessiyaYaroqliPayload,
  xavfsizJwtAvatar,
} from '@/lib/auth-tekshiruv'

export const authOptions = {
  adapter: createCustomAuthAdapter(),
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || '').trim().replace(/^["']|["']$/g, ''),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || '').trim().replace(/^["']|["']$/g, ''),
      // Uzoq tarmoqda openid-client 3.5s sukutdagi timeout bilan uzilib qolmasligi uchun
      httpOptions: { timeout: 15000 },
      // Nega allowDangerousEmailAccountLinking: Agar foydalanuvchi ilgari
      // oddiy email/parol bilan ro'yxatdan o'tgan bo'lsa, xuddi shu email'dagi
      // tasdiqlangan Google akkauntini xatoliksiz avtomatik bog'laydi.
      // Xavfi shu yerda yopilgan: signIn callback tasdiqlanmagan Google emailini
      // rad etadi, lib/auth-sessiya.js esa hisobning eski parolini bekor qiladi.
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        login: { label: "Username yoki email", type: "text" },
        password: { label: "Parol", type: "password" }
      },
      // Ikkinchi argument — NextAuth ning ichki so'rov obyekti. Undan
      // faqat sarlavhalar kerak: IP cheklovi shu yerda hisoblanadi.
      // Diqqat: bu `Request` emas, `headers` oddiy obyekt — shuning
      // uchun `soravchiIp` ikkala shaklni ham tushunadi.
      async authorize(credentials, req) {
        // Mantiq lib/credentials.js da — mobil login endpoint'i ham shuni ishlatadi
        return await verifyCredentials(
          credentials?.login,
          credentials?.password,
          soravchiIp(req),
          { userAgent: req?.headers?.['user-agent'] || null, manba: 'veb' }
        )
      }
    }),
    // ─── ELEKTRON DOSKA (QR) ───
    //
    // Parol o'rniga bir martalik token qabul qiladi. Ma'ruza zalida
    // o'qituvchi 100 talaba oldida parol tera olmaydi; token esa
    // telefonda TASDIQLANGANDAN keyingina kuchga kiradi.
    CredentialsProvider({
      id: 'doska',
      name: 'Elektron doska',
      credentials: {
        token: { label: 'QR token', type: 'text' },
      },
      async authorize(credentials) {
        const natija = await tokenniAlmashtir(credentials?.token)
        if (!natija) return null
        // `doskaTugaydi` va `doskaSessiyaId` tokenga tushadi va jwt callback ularni tekshiradi
        return {
          ...natija.user,
          doskaTugaydi: natija.tugaydi?.getTime() || null,
          doskaSessiyaId: natija.sessiyaId || null,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 kun
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  logger: {
    error(code, metadata) {
      console.error(`[auth-xato] ${code}:`, metadata)
    },
    warn(code) {
      console.warn(`[auth-ogoh] ${code}`)
    },
  },
  callbacks: {
    // BLOKLANGAN FOYDALANUVCHILAR VA TASDIQLANMAGAN GOOGLE POCHTASI TO'SIG'I:
    // Umumiy AccessDenied o'rniga aniq xato kodi bilan /login ga yo'naltiramiz.
    async signIn({ user, account, profile }) {
      if (user?.isBanned) {
        return '/login?error=HisobBloklangan'
      }
      const email = (user?.email || profile?.email || '').trim().toLowerCase()
      if (account?.provider === 'google') {
        if (profile?.email_verified === false) {
          return '/login?error=TasdiqlanmaganGoogleEmail'
        }
        if (!email) {
          return '/login?error=GoogleEmailTopilmadi'
        }
      }
      // Credentials va doska authorize() ichida allaqachon isBanned tekshirilgan —
      // bu yerda ortiqcha DB so'rovini qaytarmaymiz.
      const qoshimchaTekshiruv =
        email &&
        account?.provider !== 'credentials' &&
        account?.provider !== 'doska' &&
        user?.isBanned === undefined
      if (qoshimchaTekshiruv) {
        try {
          const existing = await prisma.user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } },
            select: { isBanned: true },
          })
          if (existing?.isBanned) {
            return '/login?error=HisobBloklangan'
          }
        } catch (e) {
          console.error('[auth] signIn tekshiruvida xatolik:', e.message)
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      return nextAuthYonaltirishManzili(url, baseUrl)
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        let dbUser = user

        // NextAuth v4 ba'zan adapter qaytargan qo'shimcha maydonlarni tozalab
        // faqat standart obyekt uzatadi. Shu sababli userId yoki username
        // bo'lmasa, bazadan zudlik bilan to'liq profilni tortib olamiz.
        if (!dbUser.userId || !dbUser.username) {
          try {
            const shartlar = []
            if (user.id) shartlar.push({ id: user.id })
            if (user.email) shartlar.push({ email: { equals: user.email.toLowerCase(), mode: 'insensitive' } })

            if (shartlar.length > 0) {
              const fetched = await prisma.user.findFirst({
                where: { OR: shartlar },
                select: {
                  id: true,
                  userId: true,
                  username: true,
                  role: true,
                  fullName: true,
                  avatar: true,
                  isTeacher: true,
                  isVerified: true,
                  isBanned: true,
                  password: true,
                },
              })
              if (fetched) dbUser = fetched
            }
          } catch (e) {
            console.error('[auth] foydalanuvchini jwt uchun yuklab bo\'lmadi:', e.message)
          }
        }

        if (!dbUser?.id || dbUser.isBanned) {
          return {}
        }

        token.sub = dbUser.id
        token.userId = dbUser.userId
        token.username = dbUser.username
        token.role = dbUser.role || 'bakalavr'
        token.fullName = dbUser.fullName || dbUser.name || null
        token.avatar = xavfsizJwtAvatar(dbUser.avatar || dbUser.image)
        token.isTeacher = Boolean(dbUser.isTeacher)
        token.isVerified = Boolean(dbUser.isVerified)
        // Doska sessiyasi bo'lsa — muddati va baza yozuvi ID si. Oddiy kirishda `null`.
        token.doskaTugaydi = dbUser.doskaTugaydi || null
        token.doskaSessiyaId = dbUser.doskaSessiyaId || null
        token.yangilangan = Date.now()

        // Agar dbUser da password allaqachon olingan bo'lsa (Credentials yoki yuqoridagi select),
        // ortiqcha bazaga murojaat qilmaymiz.
        if (typeof dbUser.password === 'string') {
          token.parolIzi = parolIzi(dbUser.password)
        } else {
          try {
            const hisob = await prisma.user.findUnique({
              where: { id: token.sub },
              select: { password: true },
            })
            token.parolIzi = parolIzi(hisob?.password)
          } catch (e) {
            console.error('[auth] parol izini olib bo\'lmadi:', e.message)
          }
        }
        return token
      }

      // Oldin bekor qilingan yoki sub siz tokenni bo'sh qoldiramiz
      if (!token?.sub) {
        return {}
      }

      // DOSKA SESSIYASI MUDDATI VA TELEFONDAN UZISH ("Uzish") NAZORATI.
      if (token.doskaTugaydi) {
        if (Date.now() > token.doskaTugaydi) {
          return {}
        }
        if (!token.doskaSessiyaId || !(await doskaSessiyaYaroqlimi(token.doskaSessiyaId))) {
          return {}
        }
      }

      const ESKIRISH = 5 * 60 * 1000
      const eski = !token.yangilangan || Date.now() - token.yangilangan > ESKIRISH

      if (trigger === 'update' || eski) {
        try {
          const yangi = await prisma.user.findUnique({
            where: { id: token.sub },
            select: {
              userId: true,
              role: true,
              isTeacher: true,
              isVerified: true,
              username: true,
              fullName: true,
              avatar: true,
              isBanned: true,
              password: true,
              emailVerified: true,
            },
          })
          if (!yangi) {
            return {}
          }
          if (yangi.isBanned) {
            return {}
          }
          if (!sessiyaYaroqlimi(token.parolIzi, token.iat, yangi)) {
            return {}
          }
          token.parolIzi = parolIzi(yangi.password)
          if (yangi.userId) token.userId = yangi.userId
          token.role = yangi.role
          token.isTeacher = yangi.isTeacher
          token.isVerified = yangi.isVerified
          token.username = yangi.username
          token.fullName = yangi.fullName
          token.avatar = xavfsizJwtAvatar(yangi.avatar)
          token.yangilangan = Date.now()
        } catch (e) {
          console.error('[auth] tokenni yangilab bo\'lmadi:', e.message)
        }
      }

      return token
    },
    async session({ session, token }) {
      // NextAuth v4 mijozida bo'sh obyekt kirilmagan sessiyani bildiradi.
      // null qaytsa, mijoz Object.keys(null) chaqirib xato beradi.
      if (!sessiyaYaroqliPayload(token)) {
        return {}
      }
      if (session?.user) {
        session.user.userId = token.userId
        session.user.username = token.username
        session.user.role = token.role
        session.user.fullName = token.fullName
        session.user.avatar = token.avatar || null
        session.user.image = token.avatar || null
        session.user.id = token.sub
        session.user.isTeacher = Boolean(token.isTeacher)
        session.user.isVerified = Boolean(token.isVerified)
        session.user.doskaTugaydi = token.doskaTugaydi || null
      }
      return session
    }
  },
  events: {
    async signIn({ user, account }) {
      if (!user?.id || !account?.provider || account.provider === 'credentials') return
      const sarlavha =
        account.provider === 'google'
          ? 'Google orqali kirildi'
          : account.provider === 'doska'
          ? 'Elektron doska orqali kirildi'
          : 'Tizimga kirildi'
      await profilLogYoz({
        userId: user.id,
        toifa: 'xavfsizlik',
        amal: 'KIRISH_MUVAFFAQIYAT',
        sarlavha,
        tafsilot: `Usul: ${account.provider}`,
        holat: 'muvaffaqiyat',
        meta: { usul: account.provider },
      })
    },
  },
  secret: authMaxfiyKaliti()
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
