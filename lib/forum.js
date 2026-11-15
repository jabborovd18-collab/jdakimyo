// lib/forum.js
// Muhokama (forum) uchun umumiy mantiq — API route'lar shu yerdan foydalanadi.
import { prisma } from './prisma.js'

export const POST_MAX = 3000
export const TITLE_MAX = 160

/** Postlarni ko'rsatishda mijozga chiqadigan maydonlar */
export const POST_SELECT = {
  id: true,
  articleId: true,
  title: true,
  content: true,
  parentId: true,
  isPinned: true,
  createdAt: true,
  author: {
    // `isVerified` — muhokamada kim yozayotgani ishonchli ko'rinsin
    select: {
      id: true, userId: true, username: true, fullName: true, avatar: true,
      role: true, isVerified: true,
    },
  },
  _count: {
    select: {
      likes: true,
      // Faqat tasdiqlangan javoblar sanaladi; aks holda lenta va mavzu ichidagi
      // javoblar soni mos kelmay qoladi.
      replies: { where: { status: 'approved' } },
    },
  },
}

/**
 * Matnni tozalash va tekshirish.
 * @returns {{ok: true, value: string} | {ok: false, error: string}}
 */
export function cleanText(raw, { max, min = 2, label = 'Matn' }) {
  if (typeof raw !== 'string') return { ok: false, error: `${label} kiritilmadi` }
  const value = raw.trim().replace(/\r\n/g, '\n').replace(/\n{4,}/g, '\n\n\n')
  if (value.length < min) return { ok: false, error: `${label} juda qisqa` }
  if (value.length > max) return { ok: false, error: `${label} ${max} belgidan oshmasligi kerak` }
  return { ok: true, value }
}

/**
 * Spamga qarshi oddiy cheklov: bir foydalanuvchi qisqa vaqtda
 * juda ko'p post yubora olmasin.
 */
export async function tezlikChekloviOshdimi(userId) {
  const bir_daqiqa = new Date(Date.now() - 60_000)
  const bir_soat = new Date(Date.now() - 3_600_000)

  const [oxirgiDaqiqa, oxirgiSoat] = await Promise.all([
    prisma.forumPost.count({ where: { authorId: userId, createdAt: { gte: bir_daqiqa } } }),
    prisma.forumPost.count({ where: { authorId: userId, createdAt: { gte: bir_soat } } }),
  ])

  if (oxirgiDaqiqa >= 3) return 'Juda tez yozyapsiz — bir daqiqa kuting'
  if (oxirgiSoat >= 20) return 'Soatlik cheklovga yetdingiz — keyinroq urinib ko\'ring'
  return null
}

/** Foydalanuvchi qaysi postlarga layk bosganini aniqlash */
export async function laykBosilganlar(userId, postIds) {
  if (!userId || postIds.length === 0) return new Set()
  const rows = await prisma.forumLike.findMany({
    where: { userId, postId: { in: postIds } },
    select: { postId: true },
  })
  return new Set(rows.map((r) => r.postId))
}

/** Mijozga yuborish uchun postni tayyorlash */
export function postniTayyorla(post, laykSet, userId = null) {
  const { _count, authorId, rejectReason, ...rest } = post
  const muallifmi = Boolean(userId && (authorId === userId || rest.author?.id === userId))
  return {
    ...rest,
    // Rad etish sababini faqat muallif o'zi ko'radi; boshqalarga va
    // tasdiqlangan postlarga sirg'alib chiqmasligi kerak.
    rejectReason: muallifmi && rest.status === 'rejected' ? rejectReason || null : null,
    likes: _count?.likes ?? 0,
    replyCount: _count?.replies ?? 0,
    likedByMe: laykSet.has(post.id),
  }
}

/** Bloklangan yoki yozish taqiqlangan foydalanuvchi uchun xabar qaytaradi. */
export function taqiqXabari(user, hozir = Date.now()) {
  if (!user || user.isBanned) return 'Hisobingiz bloklangan'
  if (user.chatBlockedUntil && new Date(user.chatBlockedUntil).getTime() > hozir) {
    const sana = new Date(user.chatBlockedUntil).toLocaleString('uz-UZ', {
      timeZone: 'Asia/Tashkent',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
    return (
      `Yozish vaqtincha to'xtatilgan (${sana} gacha)` +
      (user.chatBlockedReason ? `. Sabab: ${user.chatBlockedReason}` : '')
    )
  }
  return null
}

// ═══════════════════════════════════════════════════════════════
// MAVZULAR RO'YXATI
// ═══════════════════════════════════════════════════════════════
//
// Bu mantiq avval faqat /api/forum/posts ichida edi. Mobil ilova ham
// o'sha lentani ko'rsatishi kerak, lekin u Bearer token bilan ishlaydi
// (veb esa cookie sessiyasi bilan) — ya'ni route boshqa, ro'yxat bir xil.
// Ikki nusxa saqlamaslik uchun bu yerga ko'chirildi.

export const DEFAULT_LIMIT = 20
export const MAX_LIMIT = 50

const BALLI_TARTIBLAR = ['dolzarb', 'ommabop']
const RUHSATLI_TARTIBLAR = new Set(['dolzarb', 'yangi', 'ommabop'])

/**
 * Mavzu og'irligi va "dolzarblik" bali.
 *
 *   ball = (1 + layklar + 2 × javoblar) / (soat + 2)^1.5
 *
 * Javobga ikki barobar vazn: muhokamada javob laykdan kuchliroq signal.
 *
 * Boshdagi 1 — yangi mavzu hali hech kim javob bermaganda ham tepada
 * ko'rinishi uchun. Aks holda u pastda qolib ketadi va shu sababli hech
 * qachon javob olmaydi.
 *
 * Bo'luvchi mavzuni vaqt o'tishi bilan pastga tushiradi: "ommabop" uchun
 * susayish qo'llanmaydi — u butun tarix bo'yicha eng og'irini ko'rsatadi.
 */
export function ball(p, susayish, hozir = Date.now()) {
  const ogirlik = 1 + (p._count?.likes ?? 0) + 2 * (p._count?.replies ?? 0)
  if (!susayish) return ogirlik

  const soat = Math.max(0, (hozir - new Date(p.createdAt).getTime()) / 3_600_000)
  return ogirlik / Math.pow(soat + 2, 1.5)
}

/** Yengil ball yozuvlarini qadalgan + tanlangan tartib bo'yicha saralaydi. */
export function mavzularniTartibla(rows, sort = 'dolzarb', hozir = Date.now()) {
  const nusxa = [...rows]
  if (BALLI_TARTIBLAR.includes(sort)) {
    const susayish = sort === 'dolzarb'
    return nusxa.sort(
      (a, b) =>
        Number(b.isPinned) - Number(a.isPinned) ||
        ball(b, susayish, hozir) - ball(a, susayish, hozir) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
  return nusxa.sort(
    (a, b) =>
      Number(b.isPinned) - Number(a.isPinned) ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

/** So'rov parametrlarini xavfsiz sonlarga keltiradi. */
export function royxatParametrlari(searchParams, { articleId } = {}) {
  // Umumiy lentada standart tartib "dolzarb". Maqola ostidagi muhokama
  // xronologik o'qiladi, shuning uchun u yerda "yangi".
  const xomSort = searchParams.get('sort')
  const sort = RUHSATLI_TARTIBLAR.has(xomSort)
    ? xomSort
    : articleId
      ? 'yangi'
      : 'dolzarb'

  const solingan = parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10)
  const limit = Math.min(
    Math.max(Number.isFinite(solingan) ? solingan : DEFAULT_LIMIT, 1),
    MAX_LIMIT
  )
  const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0)
  const q = String(searchParams.get('q') || '').trim().slice(0, 100)

  return { sort, limit, offset, q }
}

/** Forum lentasi uchun Prisma `where` filtri. */
export function mavzuQidiruvWhere({ articleId = null, userId = null, q = '' } = {}) {
  const qToza = String(q || '').trim().slice(0, 100)
  return {
    parentId: null,
    articleId: articleId || null,
    // Tasdiqlangan mavzular hammaga; kutayotgan va rad etilganlari faqat
    // muallifning o'ziga ko'rinadi (rad etish sababini bilib tuzatishi uchun).
    OR: userId
      ? [{ status: 'approved' }, { authorId: userId, status: { in: ['pending', 'rejected'] } }]
      : [{ status: 'approved' }],
    ...(qToza
      ? {
          AND: [
            {
              OR: [
                { title: { contains: qToza, mode: 'insensitive' } },
                { content: { contains: qToza, mode: 'insensitive' } },
              ],
            },
          ],
        }
      : {}),
  }
}

/**
 * Mavzular ro'yxati — veb va mobil uchun bir xil.
 * @returns {{ sort, total, hasMore, posts, signedIn }}
 */
export async function mavzularniOl({ articleId = null, sort, limit, offset, userId = null, q = '' }) {
  const where = mavzuQidiruvWhere({ articleId, userId, q })
  const select = { ...POST_SELECT, status: true, rejectReason: true, authorId: true }

  let total
  let rows

  if (BALLI_TARTIBLAR.includes(sort)) {
    // 200 talik oyna o'rniga barcha nomzodlardan faqat ball uchun kerakli yengil
    // ustunlarni olamiz; shunda eski mashhur/qadalgan mavzular kesilib qolmaydi.
    const nomzodlar = await prisma.forumPost.findMany({
      where,
      select: {
        id: true,
        isPinned: true,
        createdAt: true,
        _count: POST_SELECT._count,
      },
    })

    const tartiblangan = mavzularniTartibla(nomzodlar, sort)
    total = tartiblangan.length
    const sahifaIdlar = tartiblangan.slice(offset, offset + limit).map((r) => r.id)

    if (sahifaIdlar.length === 0) {
      rows = []
    } else {
      const toliq = await prisma.forumPost.findMany({
        where: { id: { in: sahifaIdlar } },
        select,
      })
      const xarita = new Map(toliq.map((r) => [r.id, r]))
      rows = sahifaIdlar.map((id) => xarita.get(id)).filter(Boolean)
    }
  } else {
    // "Yangi": tartiblash ham, sahifalash ham bazada.
    const [soni, sahifa] = await Promise.all([
      prisma.forumPost.count({ where }),
      prisma.forumPost.findMany({
        where,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip: offset,
        take: limit,
        select,
      }),
    ])
    total = soni
    rows = sahifa
  }

  const laykSet = await laykBosilganlar(userId, rows.map((r) => r.id))

  return {
    sort,
    total,
    hasMore: offset + rows.length < total,
    posts: rows.map((p) => postniTayyorla(p, laykSet, userId)),
    signedIn: Boolean(userId),
  }
}
