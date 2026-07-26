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
    select: { id: true, userId: true, username: true, fullName: true, avatar: true, role: true },
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
