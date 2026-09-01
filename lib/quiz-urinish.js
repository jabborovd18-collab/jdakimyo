import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { authMaxfiyKaliti } from '@/lib/auth-maxfiy-kalit'

const TOKEN_VERSIYASI = 1
const TOKEN_MUDDATI_MS = 6 * 60 * 60 * 1000

function imzo(matn) {
  return createHmac('sha256', authMaxfiyKaliti()).update(matn).digest('base64url')
}

/** Server tasdiqlaydigan, mijoz o'zgartira olmaydigan urinish tokeni. */
export function quizUrinishTokeniniYarat({ category, questionIds, userId = null }) {
  if (!category || !Array.isArray(questionIds) || questionIds.length === 0) {
    throw new Error("Quiz urinish ma'lumoti to'liq emas")
  }

  const payload = {
    v: TOKEN_VERSIYASI,
    turi: 'oddiy',
    id: randomUUID(),
    category,
    questionIds,
    userId,
    expiresAt: Date.now() + TOKEN_MUDDATI_MS,
  }
  const qism = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${qism}.${imzo(qism)}`
}

/** Imzo, tur va muddatni tekshiradi; yaroqsiz token hech qachon qisman qabul qilinmaydi. */
export function quizUrinishTokeniniOqi(token) {
  const payload = imzolanganTokenniOqi(token)

  if (
    payload?.v !== TOKEN_VERSIYASI ||
    payload?.turi !== 'oddiy' ||
    typeof payload.id !== 'string' ||
    typeof payload.category !== 'string' ||
    !Array.isArray(payload.questionIds) ||
    payload.questionIds.length === 0 ||
    new Set(payload.questionIds).size !== payload.questionIds.length
  ) {
    throw new Error("Quiz urinish tokeni yaroqsiz")
  }

  return payload
}

function imzolanganTokenniYarat(payload) {
  const qism = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${qism}.${imzo(qism)}`
}

function imzolanganTokenniOqi(token) {
  if (typeof token !== 'string' || token.length > 30000) {
    throw new Error("Quiz urinish tokeni noto'g'ri")
  }

  const [qism, berilganImzo, ortiqcha] = token.split('.')
  if (!qism || !berilganImzo || ortiqcha) {
    throw new Error("Quiz urinish tokeni noto'g'ri")
  }

  const kutilganImzo = imzo(qism)
  const a = Buffer.from(berilganImzo)
  const b = Buffer.from(kutilganImzo)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error("Quiz urinish tokeni o'zgartirilgan")
  }

  let payload
  try {
    payload = JSON.parse(Buffer.from(qism, 'base64url').toString('utf8'))
  } catch {
    throw new Error("Quiz urinish tokeni o'qilmadi")
  }

  if (payload?.v !== TOKEN_VERSIYASI || !Number.isFinite(payload.expiresAt)) {
    throw new Error("Quiz urinish tokeni yaroqsiz")
  }
  if (payload.expiresAt < Date.now()) {
    throw new Error("Quiz urinish muddati tugagan, yangi test boshlang")
  }

  return payload
}

export function ustozQuizKodHashi(code) {
  if (typeof code !== 'string' || !code.trim()) return null
  return imzo(`ustoz-kod:${code.trim().toUpperCase()}`)
}

export function ustozQuizCookieNomi(quizId) {
  if (typeof quizId !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(quizId)) {
    throw new Error("Quiz ID noto'g'ri")
  }
  return `jda_uq_${quizId}`
}

/** Kirish kodi to'g'ri tekshirilganini HTTP-only cookie orqali isbotlaydi. */
export function ustozKirishTokeniniYarat({ quizId, userId, accessCode }) {
  return imzolanganTokenniYarat({
    v: TOKEN_VERSIYASI,
    turi: 'ustoz-kirish',
    quizId,
    userId,
    codeHash: ustozQuizKodHashi(accessCode),
    expiresAt: Date.now() + TOKEN_MUDDATI_MS,
  })
}

export function ustozKirishTokeniniOqi(token) {
  const payload = imzolanganTokenniOqi(token)
  if (
    payload?.turi !== 'ustoz-kirish' ||
    typeof payload.quizId !== 'string' ||
    typeof payload.userId !== 'string' ||
    typeof payload.codeHash !== 'string'
  ) {
    throw new Error("Quiz kirish tokeni yaroqsiz")
  }
  return payload
}

/** Aralashtirilgan variantlarning asl indekslarini servergacha saqlaydi. */
export function ustozQuizUrinishTokeniniYarat({
  quizId,
  userId,
  questionIds,
  optionMaps,
  accessKind,
  codeHash = null,
}) {
  return imzolanganTokenniYarat({
    v: TOKEN_VERSIYASI,
    turi: 'ustoz-quiz',
    id: randomUUID(),
    quizId,
    userId,
    questionIds,
    optionMaps,
    accessKind,
    codeHash,
    expiresAt: Date.now() + TOKEN_MUDDATI_MS,
  })
}

export function ustozQuizUrinishTokeniniOqi(token) {
  const payload = imzolanganTokenniOqi(token)
  if (
    payload?.turi !== 'ustoz-quiz' ||
    typeof payload.id !== 'string' ||
    typeof payload.quizId !== 'string' ||
    typeof payload.userId !== 'string' ||
    !Array.isArray(payload.questionIds) ||
    payload.questionIds.length === 0 ||
    new Set(payload.questionIds).size !== payload.questionIds.length ||
    !payload.optionMaps || typeof payload.optionMaps !== 'object' ||
    typeof payload.accessKind !== 'string'
  ) {
    throw new Error("Ustoz quizi urinish tokeni yaroqsiz")
  }
  return payload
}
