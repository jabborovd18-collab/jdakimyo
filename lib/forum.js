// lib/forum.js
// Muhokama (forum) uchun umumiy mantiq — API route'lar shu yerdan foydalanadi.
import { prisma } from './prisma'

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
  _count: { select: { likes: true, replies: true } },
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
export function postniTayyorla(post, laykSet) {
  const { _count, ...rest } = post
  return {
    ...rest,
    likes: _count.likes,
    replyCount: _count.replies,
    likedByMe: laykSet.has(post.id),
  }
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

// "Dolzarb" va "Ommabop" tartiblari layklar bilan javoblar yig'indisiga
// tayanadi, Prisma esa ikki sanoqning yig'indisi bo'yicha tartiblay olmaydi.
// Shuning uchun bu ikki tartib eng yangi shu qadar mavzu ichida hisoblanadi.
// "Yangi" tartibi esa bazada tartiblanadi — to'liq tarix bo'yicha.
const BALL_OYNASI = 200

const BALLI_TARTIBLAR = ['dolzarb', 'ommabop']

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
function ball(p, susayish) {
  const ogirlik = 1 + p._count.likes + 2 * p._count.replies
  if (!susayish) return ogirlik

  const soat = (Date.now() - new Date(p.createdAt).getTime()) / 3_600_000
  return ogirlik / Math.pow(soat + 2, 1.5)
}

/** So'rov parametrlarini xavfsiz sonlarga keltiradi. */
export function royxatParametrlari(searchParams, { articleId }) {
  // Umumiy lentada standart tartib "dolzarb". Maqola ostidagi muhokama
  // xronologik o'qiladi, shuning uchun u yerda "yangi".
  const sort = searchParams.get('sort') || (articleId ? 'yangi' : 'dolzarb')

  const solingan = parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10)
  const limit = Math.min(
    Math.max(Number.isFinite(solingan) ? solingan : DEFAULT_LIMIT, 1),
    MAX_LIMIT
  )
  const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0)

  return { sort, limit, offset }
}

/**
 * Mavzular ro'yxati — veb va mobil uchun bir xil.
 * @returns {{ sort, total, hasMore, posts, signedIn }}
 */
export async function mavzularniOl({ articleId = null, sort, limit, offset, userId = null }) {
  // Faqat tasdiqlangan asosiy mavzular (javoblar alohida olinadi).
  // Muallif o'zining kutayotgan postini ham ko'radi.
  const where = {
    parentId: null,
    articleId: articleId || null,
    OR: userId
      ? [{ status: 'approved' }, { authorId: userId, status: 'pending' }]
      : [{ status: 'approved' }],
  }

  const select = { ...POST_SELECT, status: true }

  let total
  let rows

  if (BALLI_TARTIBLAR.includes(sort)) {
    // Oynani olib, ballab, JS'da tartiblaymiz va so'ng bo'lamiz.
    const oyna = await prisma.forumPost.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      take: BALL_OYNASI,
      select,
    })

    const susayish = sort === 'dolzarb'
    oyna.sort(
      (a, b) =>
        Number(b.isPinned) - Number(a.isPinned) || ball(b, susayish) - ball(a, susayish)
    )

    total = oyna.length
    rows = oyna.slice(offset, offset + limit)
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
    posts: rows.map((p) => postniTayyorla(p, laykSet)),
    signedIn: Boolean(userId),
  }
}
