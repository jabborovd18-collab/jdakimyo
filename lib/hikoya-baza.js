// lib/hikoya-baza.js
//
// 24 soatlik "Ilmiy Hikoyalar" (ProfileStory va ProfileStoryView)
// ma'lumotlar bazasi qatlami. Serverni qayta ishga tushirmasdan ishlashi
// uchun jadvallarni birinchi murojaatda IF NOT EXISTS bilan yaratadi.

import { prisma } from '@/lib/prisma'
import {
  MAX_FAOL_HIKOYA,
  MAX_HIKOYA_MATN,
  HIKOYA_MUDDATI_SOAT,
  hikoyaTuriniTekshir,
  hikoyaUslubiniTekshir,
} from '@/lib/hikoya-turlari'

let hikoyaJadvalPromise = null

export async function hikoyaJadvaliniTayyorla() {
  if (hikoyaJadvalPromise) return hikoyaJadvalPromise

  hikoyaJadvalPromise = (async () => {
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ProfileStory" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "turi" TEXT NOT NULL DEFAULT 'dolzarb',
          "uslub" TEXT NOT NULL DEFAULT 'kosmik',
          "matn" TEXT NOT NULL,
          "postId" TEXT,
          "postMatn" TEXT,
          "postTeg" TEXT,
          "postMuallifId" TEXT,
          "postMuallifUserId" TEXT,
          "postMuallifUsername" TEXT,
          "postMuallifIsm" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "expiresAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "ProfileStory_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "ProfileStory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `)

      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "ProfileStory_expiresAt_idx"
        ON "ProfileStory"("expiresAt");
      `)

      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "ProfileStory_userId_expiresAt_idx"
        ON "ProfileStory"("userId", "expiresAt");
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ProfileStoryView" (
          "id" TEXT NOT NULL,
          "storyId" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "yoqdi" BOOLEAN NOT NULL DEFAULT false,
          "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "ProfileStoryView_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "ProfileStoryView_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "ProfileStory"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "ProfileStoryView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `)

      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "ProfileStoryView_storyId_userId_key"
        ON "ProfileStoryView"("storyId", "userId");
      `)

      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "ProfileStoryView_storyId_idx"
        ON "ProfileStoryView"("storyId");
      `)
    } catch (err) {
      hikoyaJadvalPromise = null
      console.warn('[hikoyaJadvaliniTayyorla ogohlantirish]:', err?.message || err)
    }
  })()

  return hikoyaJadvalPromise
}

/**
 * Muddati o'tmagan (`expiresAt > NOW()`) hikoyalarni ko'rish va reaksiya
 * statistikasi bilan birga qaytaradi.
 */
export async function faolHikoyalarniOl({ joriyUserId = null, muallifId = null, limit = 80 } = {}) {
  await hikoyaJadvaliniTayyorla()
  const koruvchiId = joriyUserId ? String(joriyUserId) : ''

  if (muallifId) {
    const qatorlar = await prisma.$queryRaw`
      SELECT
        s."id",
        s."userId",
        s."turi",
        s."uslub",
        s."matn",
        s."postId",
        s."postMatn",
        s."postTeg",
        s."postMuallifId",
        s."postMuallifUserId",
        s."postMuallifUsername",
        s."postMuallifIsm",
        s."createdAt",
        s."expiresAt",
        COUNT(v."id")::int AS "korishlarSoni",
        COUNT(CASE WHEN v."yoqdi" = true THEN 1 END)::int AS "yoqdiSoni",
        COALESCE(BOOL_OR(v."userId" = ${koruvchiId}), false) AS "korildimi",
        COALESCE(BOOL_OR(v."userId" = ${koruvchiId} AND v."yoqdi" = true), false) AS "yoqdimi"
      FROM "ProfileStory" s
      LEFT JOIN "ProfileStoryView" v ON v."storyId" = s."id"
      WHERE s."userId" = ${String(muallifId)}
        AND s."expiresAt" > NOW()
      GROUP BY s."id"
      ORDER BY s."createdAt" ASC
      LIMIT ${limit}
    `
    return qatorlar || []
  }

  const qatorlar = await prisma.$queryRaw`
    SELECT
      s."id",
      s."userId",
      s."turi",
      s."uslub",
      s."matn",
      s."postId",
      s."postMatn",
      s."postTeg",
      s."postMuallifId",
      s."postMuallifUserId",
      s."postMuallifUsername",
      s."postMuallifIsm",
      s."createdAt",
      s."expiresAt",
      COUNT(v."id")::int AS "korishlarSoni",
      COUNT(CASE WHEN v."yoqdi" = true THEN 1 END)::int AS "yoqdiSoni",
      COALESCE(BOOL_OR(v."userId" = ${koruvchiId}), false) AS "korildimi",
      COALESCE(BOOL_OR(v."userId" = ${koruvchiId} AND v."yoqdi" = true), false) AS "yoqdimi"
    FROM "ProfileStory" s
    LEFT JOIN "ProfileStoryView" v ON v."storyId" = s."id"
    WHERE s."expiresAt" > NOW()
    GROUP BY s."id"
    ORDER BY s."createdAt" DESC
    LIMIT ${limit}
  `
  return qatorlar || []
}

/**
 * Yangi 24 soatlik hikoya yaratadi (mustaqil dolzarb mavzu yoki postni hikoyaga ulashish).
 */
export async function hikoyaYarat({
  userId,
  turi = 'dolzarb',
  uslub = 'kosmik',
  matn = '',
  post = null,
}) {
  await hikoyaJadvaliniTayyorla()

  const sanoqQator = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS "soni"
    FROM "ProfileStory"
    WHERE "userId" = ${userId} AND "expiresAt" > NOW()
  `
  const faolSoni = Number(sanoqQator?.[0]?.soni) || 0
  if (faolSoni >= MAX_FAOL_HIKOYA) {
    throw new Error(
      `Bir vaqtda ko'pi bilan ${MAX_FAOL_HIKOYA} ta faol hikoya joylash mumkin`
    )
  }

  const tozaTuri = post ? 'repost' : hikoyaTuriniTekshir(turi)
  const tozaUslub = hikoyaUslubiniTekshir(uslub)
  const tozaMatn = String(matn || '').trim().slice(0, MAX_HIKOYA_MATN)

  if (!post && !tozaMatn) {
    throw new Error("Hikoya matni bo'sh bo'lmasligi kerak")
  }

  const id = `hst_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
  const hozir = new Date()
  const tugashVaqti = new Date(hozir.getTime() + HIKOYA_MUDDATI_SOAT * 60 * 60 * 1000)

  const postId = post?.id || null
  const postMatn = post?.matn ? String(post.matn).slice(0, 600) : null
  const postTeg = post?.teg || null
  const postMuallifId = post?.muallif?.id || post?.userId || null
  const postMuallifUserId = post?.muallif?.userId || null
  const postMuallifUsername = post?.muallif?.username || null
  const postMuallifIsm = post?.muallif?.fullName || post?.muallif?.username || null

  await prisma.$executeRaw`
    INSERT INTO "ProfileStory" (
      "id",
      "userId",
      "turi",
      "uslub",
      "matn",
      "postId",
      "postMatn",
      "postTeg",
      "postMuallifId",
      "postMuallifUserId",
      "postMuallifUsername",
      "postMuallifIsm",
      "createdAt",
      "expiresAt"
    ) VALUES (
      ${id},
      ${userId},
      ${tozaTuri},
      ${tozaUslub},
      ${tozaMatn},
      ${postId},
      ${postMatn},
      ${postTeg},
      ${postMuallifId},
      ${postMuallifUserId},
      ${postMuallifUsername},
      ${postMuallifIsm},
      ${hozir},
      ${tugashVaqti}
    )
  `

  return {
    id,
    userId,
    turi: tozaTuri,
    uslub: tozaUslub,
    matn: tozaMatn,
    postId,
    postMatn,
    postTeg,
    postMuallifId,
    postMuallifUserId,
    postMuallifUsername,
    postMuallifIsm,
    createdAt: hozir,
    expiresAt: tugashVaqti,
    korishlarSoni: 0,
    yoqdiSoni: 0,
    korildimi: true,
    yoqdimi: false,
  }
}

/**
 * Hikoyani ko'rildi deb belgilash (`amal='korildi'`) yoki 🔥 reaksiya bosish (`amal='yoqdi'`).
 */
export async function hikoyaKorildiYokiYoqdi({ storyId, userId, amal = 'korildi' }) {
  await hikoyaJadvaliniTayyorla()

  const hikoyaQator = await prisma.$queryRaw`
    SELECT "id", "userId", "matn", "postMatn"
    FROM "ProfileStory"
    WHERE "id" = ${storyId}
    LIMIT 1
  `
  if (!hikoyaQator || hikoyaQator.length === 0) {
    throw new Error('Hikoya topilmadi')
  }
  const hikoya = hikoyaQator[0]

  const mavjud = await prisma.$queryRaw`
    SELECT "id", COALESCE("yoqdi", false) AS "yoqdi"
    FROM "ProfileStoryView"
    WHERE "storyId" = ${storyId} AND "userId" = ${userId}
    LIMIT 1
  `

  let yoqdimi = Boolean(mavjud?.[0]?.yoqdi)

  if (!mavjud || mavjud.length === 0) {
    yoqdimi = amal === 'yoqdi'
    const viewId = `hsv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
    await prisma.$executeRaw`
      INSERT INTO "ProfileStoryView" ("id", "storyId", "userId", "yoqdi", "viewedAt")
      VALUES (${viewId}, ${storyId}, ${userId}, ${yoqdimi}, NOW())
      ON CONFLICT ("storyId", "userId") DO NOTHING
    `
  } else if (amal === 'yoqdi') {
    yoqdimi = !yoqdimi
    await prisma.$executeRaw`
      UPDATE "ProfileStoryView"
      SET "yoqdi" = ${yoqdimi}, "viewedAt" = NOW()
      WHERE "storyId" = ${storyId} AND "userId" = ${userId}
    `
  }

  const statQator = await prisma.$queryRaw`
    SELECT
      COUNT("id")::int AS "korishlarSoni",
      COUNT(CASE WHEN "yoqdi" = true THEN 1 END)::int AS "yoqdiSoni"
    FROM "ProfileStoryView"
    WHERE "storyId" = ${storyId}
  `

  return {
    storyId,
    storyUserId: hikoya.userId,
    storyMatn: hikoya.matn || hikoya.postMatn || '',
    korildimi: true,
    yoqdimi,
    korishlarSoni: Number(statQator?.[0]?.korishlarSoni) || 0,
    yoqdiSoni: Number(statQator?.[0]?.yoqdiSoni) || 0,
  }
}

/**
 * Foydalanuvchining o'z hikoyasini o'chirish.
 */
export async function hikoyaOchir({ storyId, userId }) {
  await hikoyaJadvaliniTayyorla()
  const natija = await prisma.$executeRaw`
    DELETE FROM "ProfileStory"
    WHERE "id" = ${storyId} AND "userId" = ${userId}
  `
  if (!natija) {
    throw new Error('Hikoya topilmadi')
  }
  return true
}
