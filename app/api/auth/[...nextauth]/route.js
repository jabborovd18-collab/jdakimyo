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
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.userId
        token.username = user.username
        token.role = user.role
        token.fullName = user.fullName
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
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }