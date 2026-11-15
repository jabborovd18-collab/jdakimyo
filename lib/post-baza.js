// lib/post-baza.js
//
// ProfilePost ning kengaytirilgan ustunlari (`teg`, `isPinned`, `pinnedAt`)
// va `ProfilePostLike` ("Foydali" reaksiyalar) bilan ishlash qatlami.
//
// Nega xom SQL (`$queryRaw` / `$executeRaw`) orqali:
// Windows'da `next dev` ishlab turgan paytda `query_engine-windows.dll.node`
// band bo'ladi va `prisma generate` qayta ishga tushmaguncha eski Prisma Client
// yangi ustunlarni tanimasligi mumkin. Shu qatlam jadval ustunlarini avtomatik
// yaratadi va serverni o'chirmasdan 100% ishonchli ishlaydi.

import { prisma } from '@/lib/prisma'
import { tegniTekshir, MAX_QADALGAN_POSTLAR } from '@/lib/post-tavsiyalar'

let tayyorPromise = null

export async function postJadvaliniTayyorla() {
  if (tayyorPromise) return tayyorPromise

  tayyorPromise = (async () => {
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "ProfilePost"
        ADD COLUMN IF NOT EXISTS "teg" TEXT,
        ADD COLUMN IF NOT EXISTS "isPinned" BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS "pinnedAt" TIMESTAMP(3);
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ProfilePostLike" (
          "id" TEXT NOT NULL,
          "postId" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "ProfilePostLike_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "ProfilePostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ProfilePost"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "ProfilePostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `)

      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "ProfilePostLike_postId_userId_key"
        ON "ProfilePostLike"("postId", "userId");
      `)

      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "ProfilePostLike_postId_idx"
        ON "ProfilePostLike"("postId");
      `)
    } catch (err) {
      tayyorPromise = null
      console.warn('[postJadvaliniTayyorla ogohlantirish]:', err?.message || err)
    }
  })()

  return tayyorPromise
}

/**
 * Postlar ro'yxatini `teg`, `isPinned`, `pinnedAt`, `likesCount`, `yoqdimi`
 * maydonlari bilan boyitadi (bitta tezkor SQL so'rov orqali).
 */
export async function postlarniBoyit(postlar = [], joriyUserId = null) {
  if (!Array.isArray(postlar) || postlar.length === 0) return []

  const idlar = postlar.map((p) => p.id).filter(Boolean)
  if (idlar.length === 0) return postlar

  try {
    await postJadvaliniTayyorla()
    const userIdParam = joriyUserId ? String(joriyUserId) : ''

    const qatorlar = await prisma.$queryRaw`
      SELECT
        p."id",
        p."teg",
        COALESCE(p."isPinned", false) AS "isPinned",
        p."pinnedAt",
        COUNT(l."id")::int AS "likesCount",
        COALESCE(BOOL_OR(l."userId" = ${userIdParam}), false) AS "yoqdimi"
      FROM "ProfilePost" p
      LEFT JOIN "ProfilePostLike" l ON l."postId" = p."id"
      WHERE p."id" = ANY(${idlar}::text[])
      GROUP BY p."id", p."teg", p."isPinned", p."pinnedAt"
    `

    const metaMap = new Map(
      (qatorlar || []).map((q) => [
        q.id,
        {
          teg: tegniTekshir(q.teg),
          isPinned: Boolean(q.isPinned),
          pinnedAt: q.pinnedAt || null,
          likesCount: Number(q.likesCount) || 0,
          yoqdimi: Boolean(q.yoqdimi),
        },
      ])
    )

    return postlar.map((p) => {
      const m = metaMap.get(p.id)
      return {
        ...p,
        teg: m?.teg ?? tegniTekshir(p.teg) ?? null,
        isPinned: m?.isPinned ?? Boolean(p.isPinned),
        pinnedAt: m?.pinnedAt ?? p.pinnedAt ?? null,
        likesCount: m?.likesCount ?? Number(p.likesCount || 0),
        yoqdimi: m?.yoqdimi ?? Boolean(p.yoqdimi),
      }
    })
  } catch (err) {
    console.warn('[postlarniBoyit zaxira]:', err?.message || err)
    return postlar.map((p) => ({
      ...p,
      teg: tegniTekshir(p.teg) ?? null,
      isPinned: Boolean(p.isPinned),
      pinnedAt: p.pinnedAt || null,
      likesCount: Number(p.likesCount) || 0,
      yoqdimi: Boolean(p.yoqdimi),
    }))
  }
}

/**
 * Postning `teg` ustunini yangilaydi.
 */
export async function postTeginiSaqla(postId, teg) {
  const tozaTeg = tegniTekshir(teg)
  await postJadvaliniTayyorla()
  await prisma.$executeRaw`
    UPDATE "ProfilePost"
    SET "teg" = ${tozaTeg}, "updatedAt" = NOW()
    WHERE "id" = ${postId}
  `
  return tozaTeg
}

/**
 * Postni tepaga qadash (`isPinned = true`) yoki qadashdan olish (`isPinned = false`).
 * Bir foydalanuvchi ko'pi bilan `MAX_QADALGAN_POSTLAR` ta postni qaday oladi.
 */
export async function postQadashniAlmashtir(postId, userId, qadalsinmi) {
  await postJadvaliniTayyorla()

  const mavjud = await prisma.$queryRaw`
    SELECT "id", "userId", COALESCE("isPinned", false) AS "isPinned"
    FROM "ProfilePost"
    WHERE "id" = ${postId} AND "userId" = ${userId}
    LIMIT 1
  `
  if (!mavjud || mavjud.length === 0) {
    throw new Error('Post topilmadi')
  }

  const yangiHolat =
    typeof qadalsinmi === 'boolean' ? qadalsinmi : !Boolean(mavjud[0].isPinned)

  if (yangiHolat) {
    const sanoqQator = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS "soni"
      FROM "ProfilePost"
      WHERE "userId" = ${userId} AND "isPinned" = true AND "id" <> ${postId}
    `
    const joriyQadalgan = Number(sanoqQator?.[0]?.soni) || 0
    if (joriyQadalgan >= MAX_QADALGAN_POSTLAR) {
      throw new Error(
        `Ko'pi bilan ${MAX_QADALGAN_POSTLAR} ta postni tepaga qadash mumkin`
      )
    }

    const hozir = new Date()
    await prisma.$executeRaw`
      UPDATE "ProfilePost"
      SET "isPinned" = true, "pinnedAt" = ${hozir}
      WHERE "id" = ${postId} AND "userId" = ${userId}
    `
    return { isPinned: true, pinnedAt: hozir }
  } else {
    await prisma.$executeRaw`
      UPDATE "ProfilePost"
      SET "isPinned" = false, "pinnedAt" = NULL
      WHERE "id" = ${postId} AND "userId" = ${userId}
    `
    return { isPinned: false, pinnedAt: null }
  }
}

/**
 * Postga "Foydali" (`like`) bosish yoki qaytarib olish.
 */
export async function postFoydaliAlmashtir(postId, userId) {
  await postJadvaliniTayyorla()

  const postQator = await prisma.$queryRaw`
    SELECT "id", "userId", "matn"
    FROM "ProfilePost"
    WHERE "id" = ${postId}
    LIMIT 1
  `
  if (!postQator || postQator.length === 0) {
    throw new Error('Post topilmadi')
  }
  const post = postQator[0]

  const bor = await prisma.$queryRaw`
    SELECT "id"
    FROM "ProfilePostLike"
    WHERE "postId" = ${postId} AND "userId" = ${userId}
    LIMIT 1
  `

  let yoqdimi = false
  if (bor && bor.length > 0) {
    await prisma.$executeRaw`
      DELETE FROM "ProfilePostLike"
      WHERE "postId" = ${postId} AND "userId" = ${userId}
    `
    yoqdimi = false
  } else {
    const yangiId = `ppl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
    await prisma.$executeRaw`
      INSERT INTO "ProfilePostLike" ("id", "postId", "userId", "createdAt")
      VALUES (${yangiId}, ${postId}, ${userId}, NOW())
      ON CONFLICT ("postId", "userId") DO NOTHING
    `
    yoqdimi = true
  }

  const sanoqQator = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS "likesCount"
    FROM "ProfilePostLike"
    WHERE "postId" = ${postId}
  `
  const likesCount = Number(sanoqQator?.[0]?.likesCount) || 0

  return {
    yoqdimi,
    likesCount,
    postUserId: post.userId,
    postMatn: post.matn,
  }
}
