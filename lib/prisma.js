// lib/prisma.js
import { PrismaClient } from '@prisma/client'
import { prismaUlanishManzili } from './prisma-manzil.js'

const globalForPrisma = globalThis
const dbUrl = prismaUlanishManzili(process.env.DATABASE_URL)

// Dev HMR qayta yuklanganda eski 5s timeoutli client xotirada qolib ketmasin
if (globalForPrisma.prisma && globalForPrisma.__prismaUrl !== dbUrl) {
  globalForPrisma.prisma.$disconnect?.().catch(() => {})
  globalForPrisma.prisma = undefined
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(dbUrl ? { datasources: { db: { url: dbUrl } } } : undefined)

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.__prismaUrl = dbUrl
}

export default prisma