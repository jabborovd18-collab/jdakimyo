// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { verifyCredentials } from '@/lib/credentials'
import { tokenniAlmashtir } from '@/lib/doska'
import { soravchiIp } from '@/lib/ip-cheklov'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
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
          soravchiIp(req)
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
        // `doskaTugaydi` tokenga tushadi va jwt callback uni tekshiradi
        return { ...natija.user, doskaTugaydi: natija.tugaydi?.getTime() || null }
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
        // Doska sessiyasi bo'lsa — muddati. Oddiy kirishda `undefined`.
        token.doskaTugaydi = user.doskaTugaydi || null
        token.yangilangan = Date.now()
        return token
      }

      // DOSKA SESSIYASI MUDDATI.
      //
      // Dars tugagach ekran ochiq qolmasligi kerak: auditoriyadagi
      // doskani keyingi guruh ham, tozalovchi ham ko'radi. Muddat
      // o'tgach tokenni bo'shatamiz — NextAuth buni "kirilmagan" deb
      // qabul qiladi va sahifa login'ga qaytadi.
      if (token.doskaTugaydi && Date.now() > token.doskaTugaydi) {
        return {}
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
        // Sahifa "doska rejimi" ni bilishi kerak: qolgan vaqtni
        // ko'rsatadi va xavfli sozlamalarni yashiradi
        session.user.doskaTugaydi = token.doskaTugaydi || null
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }