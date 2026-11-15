// lib/profil-kesh.js
//
// Tezkor profil tizimi: xotira + localStorage keshi, parallel so'rovlarni
// birlashtirish (deduplikatsiya) va session asosida 0ms zahira profil.

const KESH_KALITI = 'jda-profil-kesh-v1'
const KESH_MUDDATI_MS = 45 * 1000 // 45 soniya ichida qayta sahifaga o'tilganda fon so'rovisiz ham yangi hisoblanadi

let xotiraKesh = null // { userIdKey, timestamp, data }
let joriySorov = null // Promise
const tinglovchilar = new Set()

function brauzermi() {
  return typeof window !== 'undefined'
}

function foydalanuvchiKaliti(sessionUser) {
  if (!sessionUser) return null
  return String(sessionUser.id || sessionUser.userId || sessionUser.username || '')
}

/**
 * Session ma'lumotlaridan 0ms da ko'rsatish mumkin bo'lgan boshlang'ich profil.
 * Server javob berguncha yoki tarmoq uzilganda "Profil yuklanmadi" chiqmasligi uchun.
 */
export function sessiondanZahiraProfil(sessionUser) {
  if (!sessionUser) return null
  const username = sessionUser.username || sessionUser.email?.split('@')[0] || 'foydalanuvchi'
  return {
    user: {
      id: sessionUser.id || '',
      userId: sessionUser.userId || '---',
      username,
      email: sessionUser.email || '',
      fullName: sessionUser.fullName || sessionUser.name || username,
      role: sessionUser.role || 'bakalavr',
      isTeacher: Boolean(sessionUser.isTeacher),
      isVerified: Boolean(sessionUser.isVerified),
      premiumUslub: sessionUser.premiumUslub || 'kosmik',
      avatar: sessionUser.avatar || sessionUser.image || null,
      bio: sessionUser.bio || null,
      university: sessionUser.university || null,
      faculty: sessionUser.faculty || null,
      specialty: sessionUser.specialty || null,
      level: sessionUser.level || null,
      enrollmentYear: sessionUser.enrollmentYear || null,
      academicDegree: sessionUser.academicDegree || null,
      location: sessionUser.location || null,
      telegram: sessionUser.telegram || null,
      instagram: sessionUser.instagram || null,
      linkedin: sessionUser.linkedin || null,
      github: sessionUser.github || null,
      twitter: sessionUser.twitter || null,
      website: sessionUser.website || null,
      googleScholar: sessionUser.googleScholar || null,
      orcid: sessionUser.orcid || null,
      stars: Number(sessionUser.stars) || 0,
      coins: Number(sessionUser.coins) || 0,
      gems: Number(sessionUser.gems) || 0,
      currentStreak: Number(sessionUser.currentStreak) || 0,
      longestStreak: Number(sessionUser.longestStreak) || 0,
      totalPoints: Number(sessionUser.totalPoints) || 0,
      emailVerified: sessionUser.emailVerified ?? true,
    },
    quizResults: [],
    counts: {
      quizzes: 0,
      certificates: 0,
      achievements: 0,
      followers: 0,
      following: 0,
      friends: 0,
      pendingFriendRequests: 0,
    },
    _zahiradan: true,
  }
}

/**
 * Keshdan (xotira yoki localStorage) profilni 0ms da o'qiydi.
 * Agar kesh bo'lmasa va `sessionUser` berilsa, zahira profil qaytaradi.
 */
export function keshdanProfilniOl(sessionUser = null) {
  const kalit = foydalanuvchiKaliti(sessionUser)

  if (xotiraKesh?.data?.user) {
    if (!kalit || xotiraKesh.userIdKey === kalit || xotiraKesh.data.user.id === kalit) {
      return xotiraKesh.data
    }
  }

  if (brauzermi()) {
    try {
      const raw = localStorage.getItem(KESH_KALITI)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.data?.user) {
          const mos =
            !kalit ||
            parsed.userIdKey === kalit ||
            parsed.data.user.id === kalit ||
            parsed.data.user.userId === sessionUser?.userId
          if (mos) {
            xotiraKesh = parsed
            return parsed.data
          }
        }
      }
    } catch {
      // localStorage yopiq yoki buzuq bo'lsa o'tkazib yuboramiz
    }
  }

  return sessionUser ? sessiondanZahiraProfil(sessionUser) : null
}

/**
 * Keshni yangilash va barcha ochiq komponentlarni xabardor qilish.
 */
export function profilKeshniSaqla(data, sessionUser = null) {
  if (!data?.user) return
  const userIdKey =
    foydalanuvchiKaliti(sessionUser) ||
    String(data.user.id || data.user.userId || data.user.username || '')

  const yozuv = {
    userIdKey,
    timestamp: Date.now(),
    data: {
      ...data,
      _zahiradan: false,
    },
  }

  xotiraKesh = yozuv

  if (brauzermi()) {
    try {
      localStorage.setItem(KESH_KALITI, JSON.stringify(yozuv))
    } catch {
      // Quota xatosi bo'lsa xotira keshi ishlayveradi
    }
  }

  for (const fn of tinglovchilar) {
    try {
      fn(yozuv.data)
    } catch {
      // Tinglovchi xatosi boshqalarga ta'sir qilmasin
    }
  }
}

/**
 * Faqat `user` maydonlarini qisman yangilash (masalan, bio, avatar yoki sozlamalar saqlanganda).
 */
export function profilKeshUserYangila(qismanUser) {
  if (!qismanUser || typeof qismanUser !== 'object') return
  const joriy = keshdanProfilniOl()
  if (!joriy?.user) return

  profilKeshniSaqla({
    ...joriy,
    user: {
      ...joriy.user,
      ...qismanUser,
    },
  })
}

export function profilKeshgaObuna(fn) {
  tinglovchilar.add(fn)
  return () => tinglovchilar.delete(fn)
}

export function profilKeshniTozala() {
  xotiraKesh = null
  joriySorov = null
  if (brauzermi()) {
    try {
      localStorage.removeItem(KESH_KALITI)
    } catch {
      // e'tiborsiz qoldiramiz
    }
  }
}

/**
 * Serverdan `/api/profil` ni oladi:
 * - Parallel chaqiruvlarni bitta so'rovga birlashtiradi (deduplikatsiya);
 * - Vaqtinchalik xatoda 1 marta avtomatik qayta urinadi;
 * - Muvaffaqiyatli javobni keshga yozadi.
 */
export async function profilniYuklabOl({ majburiy = false, sessionUser = null, timeoutMs = 25000 } = {}) {
  if (!majburiy && xotiraKesh?.data?.user && !xotiraKesh.data._zahiradan) {
    const yosh = Date.now() - (xotiraKesh.timestamp || 0)
    if (yosh < KESH_MUDDATI_MS) {
      return xotiraKesh.data
    }
  }

  if (joriySorov) {
    return joriySorov
  }

  joriySorov = (async () => {
    let oxirgiXato = null

    for (let urinish = 0; urinish < 2; urinish++) {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const res = await fetch('/api/profil', {
          signal: controller.signal,
          headers: { 'Cache-Control': 'no-cache' },
        })
        const data = await res.json().catch(() => null)

        if (!res.ok) {
          throw new Error(data?.error || `Xatolik (${res.status})`)
        }
        if (!data?.user) {
          throw new Error("Profil ma'lumotlari to'liq emas")
        }

        profilKeshniSaqla(data, sessionUser)
        return data
      } catch (err) {
        oxirgiXato = err
        // 401/403 bo'lsa qayta urinishning foydasi yo'q
        if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
          break
        }
        if (urinish === 0) {
          await new Promise((r) => setTimeout(r, 800))
        }
      } finally {
        clearTimeout(timer)
      }
    }

    throw oxirgiXato || new Error('Profilni yuklab bo\'lmadi')
  })()

  try {
    return await joriySorov
  } finally {
    joriySorov = null
  }
}
