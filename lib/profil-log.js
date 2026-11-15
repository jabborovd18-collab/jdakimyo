// lib/profil-log.js
//
// Shaxsiy profil harakatlari, xavfsizlik hodisalari va tizim tarixini yozish hamda olish.
// Neon bazada `ProfilLog` jadvali hali migratsiya qilinmagan holatda ham (P2021)
// asosiy tizim ishdan chiqmaydi — mavjud jadvallardan tarixni birlashtirib beradi.

import { prisma } from './prisma.js'
import { MILLIY_SERTIFIKAT_VARIANTLARI } from './milliy-sertifikat-data.js'
import {
  LOG_HOLATLARI,
  LOG_TOIFALARI,
  LOG_TOIFA_TARIFLARI,
  birlashtirProfilLoglar,
  ipTozala,
  labTranzaksiyadanLog,
  msUrinishdanLog,
  profilLogCsvYasa,
  quizdanLog,
  sertifikatdanLog,
  tarjimaLogHodisa,
} from './profil-log-yordamchi.js'

export {
  LOG_HOLATLARI,
  LOG_TOIFALARI,
  LOG_TOIFA_TARIFLARI,
  birlashtirProfilLoglar,
  profilLogCsvYasa,
}

const IMTIHON_NOM_MAP = new Map(
  MILLIY_SERTIFIKAT_VARIANTLARI.map((v) => [v.slug, v.nom]),
)

function sarlavhaOqi(request, kalit) {
  const headers = request?.headers
  if (!headers) return null
  if (typeof headers.get === 'function') return headers.get(kalit)
  return headers[kalit] || headers[kalit.toLowerCase()] || null
}

export function sorovMetaAjrat(request, qoshimcha = {}) {
  const xff = sarlavhaOqi(request, 'x-forwarded-for')
  const ip =
    ipTozala(qoshimcha.ipAddress) ||
    ipTozala(typeof xff === 'string' ? xff.split(',')[0] : null) ||
    ipTozala(sarlavhaOqi(request, 'x-real-ip')) ||
    null

  const ua =
    (typeof qoshimcha.userAgent === 'string' && qoshimcha.userAgent.trim()) ||
    sarlavhaOqi(request, 'user-agent') ||
    null

  return {
    ipAddress: ip,
    userAgent: ua ? String(ua).slice(0, 300) : null,
  }
}

export function jadvalYoqmiXatosi(err) {
  if (!err) return false
  if (err.code === 'P2021' || err.code === 'P2022') return true
  const msg = String(err.message || '')
  return msg.includes('ProfilLog') && msg.includes('does not exist')
}

/**
 * Shaxsiy profil logiga hodisani yozadi. Hech qachon throw qilmaydi —
 * asosiy kirish, sozlama saqlash yoki imtihon oqimini to'xtatmasligi kerak.
 */
export async function profilLogYoz({
  userId,
  toifa = 'hisob',
  amal,
  sarlavha,
  tafsilot = null,
  holat = 'muvaffaqiyat',
  ipAddress = null,
  userAgent = null,
  request = null,
  meta = null,
  db = prisma,
}) {
  if (!userId || !amal || !sarlavha) return null
  if (!db?.profilLog?.create) return null

  const { ipAddress: ip, userAgent: ua } = sorovMetaAjrat(request, { ipAddress, userAgent })

  try {
    return await db.profilLog.create({
      data: {
        userId,
        toifa: LOG_TOIFALARI.includes(toifa) ? toifa : 'hisob',
        amal: String(amal).slice(0, 64),
        sarlavha: String(sarlavha).slice(0, 200),
        tafsilot: tafsilot ? String(tafsilot).slice(0, 1000) : null,
        holat: LOG_HOLATLARI.includes(holat) ? holat : 'muvaffaqiyat',
        ipAddress: ip,
        userAgent: ua,
        meta: meta && typeof meta === 'object' ? meta : undefined,
      },
    })
  } catch (err) {
    if (!jadvalYoqmiXatosi(err)) {
      console.warn('[profilLogYoz]', err?.message || err)
    }
    return null
  }
}

/**
 * Foydalanuvchi uchun birlashtirilgan loglar (ProfilLog + tarixiy DB voqealari) va statistikani qaytaradi.
 */
export async function profilLoglarOlish(
  userId,
  {
    toifa = 'barchasi',
    holat = 'barchasi',
    qidiruv = '',
    page = 1,
    limit = 30,
  } = {},
) {
  let logJadvalTayyor = true
  let xomSaqlangan = []

  try {
    xomSaqlangan = await prisma.profilLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 250,
    })
  } catch (err) {
    if (jadvalYoqmiXatosi(err)) {
      logJadvalTayyor = false
    } else {
      throw err
    }
  }

  // Tarixiy jadvallarni juftlab so'raymiz (Neon pool chekloviga mos)
  const [msUrinishlar, sertifikatlar] = await Promise.all([
    prisma.msUrinish
      .findMany({
        where: { userId },
        select: {
          id: true,
          slug: true,
          holat: true,
          shkalaBalli: true,
          daraja: true,
          oddiyFoiz: true,
          boshlanganVaqt: true,
          yakunlanganVaqt: true,
        },
        orderBy: { boshlanganVaqt: 'desc' },
        take: 40,
      })
      .catch(() => []),
    prisma.certificate
      .findMany({
        where: { userId },
        select: {
          id: true,
          certId: true,
          fan: true,
          reason: true,
          examName: true,
          grade: true,
          turi: true,
          status: true,
          issuedAt: true,
        },
        orderBy: { issuedAt: 'desc' },
        take: 40,
      })
      .catch(() => []),
  ])

  const [quizlar, labTranzaksiyalar] = await Promise.all([
    prisma.quizResult
      .findMany({
        where: { userId, isHidden: false },
        select: {
          id: true,
          quizName: true,
          score: true,
          totalQuestions: true,
          percentage: true,
          completedAt: true,
        },
        orderBy: { completedAt: 'desc' },
        take: 40,
      })
      .catch(() => []),
    prisma.labTransaction
      .findMany({
        where: { lab: { userId } },
        select: {
          id: true,
          turi: true,
          valyuta: true,
          miqdor: true,
          kalit: true,
          izoh: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 40,
      })
      .catch(() => []),
  ])

  const saqlangan = xomSaqlangan.map(tarjimaLogHodisa).filter(Boolean)
  const tizim = [
    ...msUrinishlar.map((u) => msUrinishdanLog(u, { imtihonNom: IMTIHON_NOM_MAP.get(u.slug) })),
    ...sertifikatlar.map(sertifikatdanLog),
    ...quizlar.map(quizdanLog),
    ...labTranzaksiyalar.map(labTranzaksiyadanLog),
  ].filter(Boolean)

  const barchasi = birlashtirProfilLoglar({ saqlangan, tizim })
  const filtrlangan = birlashtirProfilLoglar({
    saqlangan,
    tizim,
    toifa,
    holat,
    qidiruv,
  })

  const xavfsizLimit = Math.min(200, Math.max(1, Number(limit) || 30))
  const xavfsizPage = Math.max(1, Number(page) || 1)
  const boshlash = (xavfsizPage - 1) * xavfsizLimit
  const sahifa = filtrlangan.slice(boshlash, boshlash + xavfsizLimit)

  const songgiKirish = barchasi.find((x) => x.amal === 'KIRISH_MUVAFFAQIYAT') || null

  return {
    logJadvalTayyor,
    items: sahifa,
    barchaFiltrlangan: filtrlangan,
    total: filtrlangan.length,
    jamiBirlashgan: barchasi.length,
    page: xavfsizPage,
    limit: xavfsizLimit,
    hasMore: boshlash + sahifa.length < filtrlangan.length,
    xulosa: {
      xavfsizlikSoni: barchasi.filter((x) => x.toifa === 'xavfsizlik').length,
      sozlamaSoni: barchasi.filter((x) => x.toifa === 'sozlama' || x.toifa === 'maxfiylik').length,
      sertifikatSoni: barchasi.filter((x) => x.toifa === 'sertifikat').length,
      natijaSoni: barchasi.filter((x) => x.toifa === 'natija').length,
      xatoSoni: barchasi.filter((x) => x.holat === 'xato' || x.holat === 'ogohlantirish').length,
      songgiKirish: songgiKirish
        ? {
            createdAt: songgiKirish.createdAt,
            qurilma: songgiKirish.qurilma,
            ipAddress: songgiKirish.ipAddress,
          }
        : null,
    },
  }
}
