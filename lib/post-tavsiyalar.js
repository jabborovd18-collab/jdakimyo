// lib/post-tavsiyalar.js
//
// Profil postlarini mavzu tegi bo'yicha ajratish, saralash (qadalgan,
// eng foydali, eng yangi) va shaxsiylashtirilgan rekomendatsiya algoritmi.

export const MAX_QADALGAN_POSTLAR = 3

export const POST_TEGLARI = [
  { kalit: 'konspekt', nom: '#konspekt', qisqa: 'Konspekt', ikon: 'kitob' },
  { kalit: 'masala', nom: '#masala', qisqa: 'Masala', ikon: 'chaqmoq' },
  { kalit: 'olimpiada', nom: '#olimpiada', qisqa: 'Olimpiada', ikon: 'kubok' },
  { kalit: 'sertifikat', nom: '#sertifikat', qisqa: 'Sertifikat', ikon: 'sertifikat' },
  { kalit: 'laboratoriya', nom: '#laboratoriya', qisqa: 'Laboratoriya', ikon: 'mikroskop' },
  { kalit: 'motivatsiya', nom: '#motivatsiya', qisqa: 'Motivatsiya', ikon: 'olov' },
  { kalit: 'savol', nom: '#savol', qisqa: 'Savol', ikon: 'xabar' },
]

const TEG_KALITLARI = new Set(POST_TEGLARI.map((t) => t.kalit))
const TEG_LUGAT = Object.fromEntries(POST_TEGLARI.map((t) => [t.kalit, t]))

/**
 * Teg kalitini tekshiradi va tozalaydi. Noto'g'ri yoki bo'sh bo'lsa `null` qaytaradi.
 */
export function tegniTekshir(teg) {
  if (!teg || typeof teg !== 'string') return null
  const toza = teg.trim().toLowerCase().replace(/^#+/, '')
  return TEG_KALITLARI.has(toza) ? toza : null
}

/**
 * Teg kaliti bo'yicha to'liq ma'lumotni qaytaradi.
 */
export function tegHaqida(teg) {
  const toza = tegniTekshir(teg)
  return toza ? TEG_LUGAT[toza] : null
}

/**
 * Matn ichida uchraydigan `#konspekt` kabi xeshtegdan avtomatik teg ajratib olish
 * (agar foydalanuvchi alohida teg tugmasini bosmagan bo'lsa).
 */
export function matndanTegniTop(matn) {
  if (!matn || typeof matn !== 'string') return null
  const kichik = matn.toLowerCase()
  for (const t of POST_TEGLARI) {
    if (kichik.includes(`#${t.kalit}`)) {
      return t.kalit
    }
  }
  return null
}

/**
 * Postlarni tartiblash va filtrlash:
 * - `standart`: avval qadalganlar (`isPinned`), keyin eng yangilari
 * - `foydali`: eng ko'p "Foydali" (`likesCount`) olganlar, teng bo'lsa yangilari
 * - `yangi`: faqat vaqt bo'yicha yangidan eskiga
 * - `eski`: eskidan yangiga
 */
export function postlarniTartibla(
  postlar = [],
  { tartib = 'standart', teg = '', qidiruv = '' } = {}
) {
  if (!Array.isArray(postlar)) return []

  const tozaTeg = tegniTekshir(teg)
  const soz = String(qidiruv || '').trim().toLowerCase()

  const filtrlangan = postlar.filter((p) => {
    if (!p) return false
    if (tozaTeg && p.teg !== tozaTeg) return false
    if (soz) {
      const matnMos = String(p.matn || '').toLowerCase().includes(soz)
      const muallifMos =
        String(p.muallif?.fullName || '').toLowerCase().includes(soz) ||
        String(p.muallif?.username || '').toLowerCase().includes(soz)
      const tegMos = String(p.teg || '').toLowerCase().includes(soz)
      if (!matnMos && !muallifMos && !tegMos) return false
    }
    return true
  })

  return [...filtrlangan].sort((a, b) => {
    const vaqtA = new Date(a.createdAt || 0).getTime()
    const vaqtB = new Date(b.createdAt || 0).getTime()
    const foydaliA = Number(a.likesCount) || 0
    const foydaliB = Number(b.likesCount) || 0

    if (tartib === 'foydali') {
      if (foydaliB !== foydaliA) return foydaliB - foydaliA
      if (Boolean(b.isPinned) !== Boolean(a.isPinned)) return b.isPinned ? 1 : -1
      return vaqtB - vaqtA
    }

    if (tartib === 'yangi') {
      return vaqtB - vaqtA
    }

    if (tartib === 'eski') {
      return vaqtA - vaqtB
    }

    // 'standart' (qadalganlar tepada, keyin eng yangilari)
    if (Boolean(b.isPinned) !== Boolean(a.isPinned)) {
      return b.isPinned ? 1 : -1
    }
    if (a.isPinned && b.isPinned) {
      const pinA = new Date(a.pinnedAt || a.createdAt || 0).getTime()
      const pinB = new Date(b.pinnedAt || b.createdAt || 0).getTime()
      if (pinB !== pinA) return pinB - pinA
    }
    return vaqtB - vaqtA
  })
}

function birXilMatn(a, b) {
  if (!a || !b) return false
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase()
}

/**
 * Bitta post uchun tavsiya balli va foydalanuvchiga tushunarli tavsiya sababini hisoblaydi.
 */
export function tavsiyaBalliniHisobla(
  post,
  koruvchi = {},
  { obunaIdlarSet = new Set(), dostIdlarSet = new Set(), hozir = Date.now() } = {}
) {
  const muallif = post?.muallif || post?.user || {}
  const foydali = Number(post?.likesCount) || 0
  const yaratilgan = new Date(post?.createdAt || hozir).getTime()
  const yoshSoat = Math.max(0, (hozir - yaratilgan) / (1000 * 60 * 60))

  let xomBall = 4 // boshlang'ich tayanch ball
  let sabab = 'Yangi faol post'
  let engKuchliBonus = 0

  const sababniYangila = (bonus, yangiSabab) => {
    if (bonus > engKuchliBonus) {
      engKuchliBonus = bonus
      sabab = yangiSabab
    }
  }

  // 1. "Foydali" reaksiyalar og'irligi
  if (foydali > 0) {
    const foydaliBonus = Math.min(foydali * 3.2, 32)
    xomBall += foydaliBonus
    if (foydali >= 2) {
      sababniYangila(foydaliBonus, `${foydali} kishi foydali deb topdi`)
    }
  }

  // 2. Ustoz va Tasdiqlangan muallif bonusi
  if (muallif.isTeacher) {
    xomBall += 4.5
    sababniYangila(4.5, 'Ustoz tavsiyasi')
  }
  if (muallif.isVerified) {
    xomBall += 3.2
    sababniYangila(3.2, 'Tasdiqlangan muallif')
  }

  // 3. O'quv yurti / Mutaxassislik / Bosqich mosligi
  if (koruvchi?.university && birXilMatn(koruvchi.university, muallif.university)) {
    xomBall += 4.0
    sababniYangila(4.0, "O'quv yurtingizdan")
  }
  if (koruvchi?.specialty && birXilMatn(koruvchi.specialty, muallif.specialty)) {
    xomBall += 2.5
    sababniYangila(2.5, 'Yo‘nalishingizga mos')
  }
  if (koruvchi?.role && birXilMatn(koruvchi.role, muallif.role)) {
    xomBall += 1.5
  }

  // 4. Do'st yoki obuna aloqasi
  if (dostIdlarSet.has(muallif.id)) {
    xomBall += 3.0
    sababniYangila(3.0, "Do'stingiz yozuvi")
  } else if (obunaIdlarSet.has(muallif.id)) {
    xomBall += 2.2
    sababniYangila(2.2, 'Obunangizdan')
  }

  // 5. Mazmun boyligi va teg
  const uzunlik = String(post?.matn || '').trim().length
  if (uzunlik >= 100) {
    xomBall += 1.5
  }
  if (post?.teg) {
    xomBall += 1.2
    const tegInfo = tegHaqida(post.teg)
    if (tegInfo && engKuchliBonus < 2) {
      sabab = `${tegInfo.qisqa} mavzusida`
    }
  }
  if (post?.isPinned) {
    xomBall += 1.0
  }

  // Vaqt bo'yicha so'nish: yangi postlar yuqoriga chiqadi, lekin ko'p yoqqanlari ham tez tushib ketmaydi
  const vaqtBoluvchi = Math.pow(yoshSoat + 2, 1.25)
  const yakuniyBall = Number((xomBall / vaqtBoluvchi).toFixed(4))

  return {
    ball: yakuniyBall,
    sabab,
  }
}

/**
 * Postlar ro'yxatini rekomendatsiya algoritmi bo'yicha saralaydi va
 * bitta muallif lentani to'ldirib yubormasligi uchun diversifikatsiya qiladi.
 */
export function tavsiyalarniSarala(
  postlar = [],
  koruvchi = {},
  { obunaIdlar = [], dostIdlar = [], limit = 30, hozir = Date.now() } = {}
) {
  if (!Array.isArray(postlar) || postlar.length === 0) return []

  const obunaIdlarSet = new Set(obunaIdlar)
  const dostIdlarSet = new Set(dostIdlar)

  const baholangan = postlar
    .filter((p) => p && p.matn)
    .map((p) => {
      const { ball, sabab } = tavsiyaBalliniHisobla(p, koruvchi, {
        obunaIdlarSet,
        dostIdlarSet,
        hozir,
      })
      return {
        ...p,
        tavsiyaBalli: ball,
        tavsiyaSababi: p.tavsiyaSababi || sabab,
      }
    })
    .sort((a, b) => b.tavsiyaBalli - a.tavsiyaBalli)

  // Diversifikatsiya: bitta muallifdan ko'pi bilan 2 ta post,
  // va imkon qadar ketma-ket bir xil muallif tushmasin.
  const muallifSanoq = new Map()
  const tanlangan = []
  const keyingaQoldirilgan = []

  for (const post of baholangan) {
    const muallifId = post.muallif?.id || post.userId || ''
    const soni = muallifSanoq.get(muallifId) || 0
    if (soni >= 2) continue

    const oxirgiMuallif =
      tanlangan.length > 0
        ? tanlangan[tanlangan.length - 1].muallif?.id || tanlangan[tanlangan.length - 1].userId
        : null

    if (muallifId && oxirgiMuallif === muallifId) {
      keyingaQoldirilgan.push(post)
      continue
    }

    tanlangan.push(post)
    muallifSanoq.set(muallifId, soni + 1)
    if (tanlangan.length >= limit) break
  }

  for (const post of keyingaQoldirilgan) {
    if (tanlangan.length >= limit) break
    const muallifId = post.muallif?.id || post.userId || ''
    const soni = muallifSanoq.get(muallifId) || 0
    if (soni >= 2) continue
    tanlangan.push(post)
    muallifSanoq.set(muallifId, soni + 1)
  }

  return tanlangan
}
