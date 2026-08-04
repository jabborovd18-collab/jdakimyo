// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { verifyCredentials } from '@/lib/credentials'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        login: { label: "Username yoki email", type: "text" },
        password: { label: "Parol", type: "password" }
      },
      async authorize(credentials) {
        // Mantiq lib/credentials.js da — mobil login endpoint'i ham shuni ishlatadi
        return await verifyCredentials(credentials?.login, credentials?.password)
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 kun
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.userId = user.userId
        token.username = user.username
        token.role = user.role
        token.fullName = user.fullName
        token.isTeacher = user.isTeacher
        token.isVerified = user.isVerified
        token.yangilangan = Date.now()
        return token
      }

      // TOKEN ESKIRADI. JWT strategiyasida token faqat kirish paytida
      // to'ldiriladi va 30 kun yashaydi. Ya'ni admin kimgadir ustozlik
      // yoki tasdiq bersa, u odam qayta kirmaguncha buni ko'rmasdi —
      // "berdim, lekin ishlamayapti" degan holat aynan shundan chiqadi.
      //
      // Har so'rovda bazaga borish qimmat (Neon serverless), shuning
      // uchun besh daqiqada bir marta yangilaymiz. Sozlama sahifasi
      // darhol ko'rsatishi kerak bo'lsa, `update()` chaqirsa ham bo'ladi.
      const ESKIRISH = 5 * 60 * 1000
      const eski = !token.yangilangan || Date.now() - token.yangilangan > ESKIRISH

      if (token.sub && (trigger === 'update' || eski)) {
        try {
          const yangi = await prisma.user.findUnique({
            where: { id: token.sub },
            select: {
              role: true, isTeacher: true, isVerified: true,
              username: true, fullName: true,
            },
          })
          if (yangi) {
            token.role = yangi.role
            token.isTeacher = yangi.isTeacher
            token.isVerified = yangi.isVerified
            token.username = yangi.username
            token.fullName = yangi.fullName
          }
          // Yozuv topilmasa token o'zgarmaydi: baza javob bermay qolganda
          // hammani tizimdan chiqarib yuborish xatoni battar qiladi.
          token.yangilangan = Date.now()
        } catch (e) {
          console.error('[auth] tokenni yangilab bo\'lmadi:', e.message)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.userId = token.userId
        session.user.username = token.username
        session.user.role = token.role
        session.user.fullName = token.fullName
        session.user.id = token.sub
        session.user.isTeacher = Boolean(token.isTeacher)
        session.user.isVerified = Boolean(token.isVerified)
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }