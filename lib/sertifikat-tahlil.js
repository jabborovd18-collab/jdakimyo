// lib/sertifikat-tahlil.js
//
// Sertifikatlar metadata tahlili, holat tekshiruvi va URL formatlash uchun
// yagona sof helper modul (mijoz va serverda birdek ishlaydi).

export const SERTIFIKAT_DOMEN = 'https://www.jdakimyo.uz'
export const ALCHEMIQ_LOGO = '/images/hamkorlik/alchemiq-logo.jpg'
export const ESKI_ALCHEMIQ_LOGO = '/images/alchemiq-logo.png'

export const SERTIFIKAT_TURLARI = Object.freeze({
  milliy: 'milliy_sertifikat',
  hamkor: 'mavsumiy_hamkor',
  maxsus: 'admin_maxsus',
})

const OY_NOMLARI = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
]

/**
 * ISO sanani "13-noyabr 2026" shaklida chiqaradi.
 */
export function sanaUzFormat(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getDate()}-${OY_NOMLARI[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * Certificate.metadata / Certificate.description (JSON yoki oddiy matn) va turi
 * maydonlarini birlashtirib tahlil qiladi. Ekranda xom JSON chiqib ketishini
 * oldini olish hamda MS/Hamkorlik/Klassik turlarini ajratish uchun yagona parser.
 */
export function ajratSertifikatTavsifi(sertifikat) {
  const certId = String(sertifikat?.certId || '').trim().toUpperCase()
  const turi = String(sertifikat?.turi || '').trim()
  const prefixMs = certId.startsWith('JDA-MS-')
  const runtimeMs =
    sertifikat?.theta !== undefined ||
    sertifikat?.shkalaBalli !== undefined ||
    Boolean(sertifikat?.daraja && !sertifikat?.reason)

  const colMeta =
    sertifikat?.metadata &&
    typeof sertifikat.metadata === 'object' &&
    !Array.isArray(sertifikat.metadata)
      ? sertifikat.metadata
      : null

  let descMeta = null
  let matn = null
  const xom = sertifikat?.description
  if (typeof xom === 'string') {
    const tozalangan = xom.trim()
    if (tozalangan.startsWith('{') && tozalangan.endsWith('}')) {
      try {
        const parsed = JSON.parse(tozalangan)
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          descMeta = parsed
        }
      } catch {
        // Yaroqsiz JSON bo'lsa oddiy matn sifatida qoldiramiz
      }
    }
    if (!descMeta && tozalangan) {
      matn = tozalangan
    }
  }

  const birlashganMeta =
    colMeta || descMeta ? { ...(descMeta || {}), ...(colMeta || {}) } : null

  const hasMsKey =
    prefixMs ||
    turi === SERTIFIKAT_TURLARI.milliy ||
    runtimeMs ||
    Boolean(
      birlashganMeta &&
        (birlashganMeta.examSlug ||
          birlashganMeta.theta !== undefined ||
          birlashganMeta.shkalaBalli !== undefined ||
          birlashganMeta.kalibrlashUsuli !== undefined ||
          birlashganMeta.infitMnsq !== undefined)
    )

  if (hasMsKey) {
    return {
      isMs: true,
      meta: birlashganMeta,
      matn: typeof birlashganMeta?.izoh === 'string' ? birlashganMeta.izoh : matn,
      fullNameLocked: Boolean(sertifikat?.fullNameLocked || birlashganMeta?.fullNameLocked),
    }
  }

  return {
    isMs: false,
    meta: birlashganMeta,
    matn,
    fullNameLocked: Boolean(sertifikat?.fullNameLocked || birlashganMeta?.fullNameLocked),
  }
}

/**
 * Sertifikatning rasmiy turini yagona tartibda aniqlaydi.
 */
export function sertifikatTuriAniqlash(sertifikat) {
  if (!sertifikat) return SERTIFIKAT_TURLARI.maxsus
  if (
    sertifikat.turi === SERTIFIKAT_TURLARI.milliy ||
    sertifikat.turi === SERTIFIKAT_TURLARI.hamkor ||
    sertifikat.turi === SERTIFIKAT_TURLARI.maxsus
  ) {
    return sertifikat.turi
  }

  const { isMs } = ajratSertifikatTavsifi(sertifikat)
  if (isMs) return SERTIFIKAT_TURLARI.milliy

  const isHamkor = Boolean(
    sertifikat.seals?.partnerName ||
      sertifikat.fan?.includes('Mavsumiy Hamkorlik') ||
      sertifikat.fan?.includes('DTM sinov testi') ||
      String(sertifikat.certId || '').toUpperCase().startsWith('AK-') ||
      sertifikat.examName?.includes('Sinov') ||
      sertifikat.examName?.includes('DTM')
  )
  return isHamkor ? SERTIFIKAT_TURLARI.hamkor : SERTIFIKAT_TURLARI.maxsus
}

/**
 * Sertifikatning haqiqiylik holatini yagona qoida bilan aniqlaydi.
 */
export function sertifikatHolati(sertifikat, hozir = new Date()) {
  if (!sertifikat) {
    return {
      holat: 'missing',
      yaroqli: false,
      sabab: 'Sertifikat topilmadi',
      belgi: 'Topilmadi',
    }
  }

  if (sertifikat.status && sertifikat.status !== 'valid') {
    return {
      holat: 'revoked',
      yaroqli: false,
      sabab: 'Sertifikat bekor qilingan',
      belgi: 'Bekor qilingan',
    }
  }

  if (sertifikat.expiresAt !== null && sertifikat.expiresAt !== undefined) {
    const tugash = new Date(sertifikat.expiresAt)
    const joriy = new Date(hozir)
    if (!Number.isNaN(tugash.getTime()) && joriy > tugash) {
      return {
        holat: 'expired',
        yaroqli: false,
        sabab: 'Sertifikat muddati tugagan',
        belgi: 'Muddati tugagan',
      }
    }
  }

  return {
    holat: 'valid',
    yaroqli: true,
    sabab: null,
    belgi: 'Haqiqiy va faol',
  }
}

/**
 * Amal qilish muddatini issuedAt va expiresAt dan dinamik formatlaydi.
 */
export function formatAmalMuddati(issuedAt, expiresAt) {
  if (!expiresAt) return 'Muddatsiz'
  const end = new Date(expiresAt)
  if (Number.isNaN(end.getTime())) return 'Muddatsiz'

  const endStr = sanaUzFormat(end)
  if (issuedAt) {
    const start = new Date(issuedAt)
    if (!Number.isNaN(start.getTime())) {
      const diffDays = Math.round((end.getTime() - start.getTime()) / 86_400_000)
      const yillar = Math.round(diffDays / 365.25)
      if (yillar >= 1 && Math.abs(diffDays - yillar * 365.25) <= 5) {
        return `${yillar} yil (${endStr} gacha)`
      }
    }
  }

  return `${endStr} gacha`
}

/**
 * Bazadagi Certificate yoki MS natija obyektini MS vektor PDF uchun normallashtiradi.
 */
export function milliySertifikatPdfMalumoti(sertifikat) {
  if (!sertifikat) return {}
  const { meta } = ajratSertifikatTavsifi(sertifikat)

  return {
    certId: sertifikat.certId || 'JDA-MS-2026-00000',
    fullName: sertifikat.fullName || 'Ishtirokchi',
    fan: sertifikat.fan || 'Kimyo',
    turi: SERTIFIKAT_TURLARI.milliy,
    metadata: meta || null,
    examName: sertifikat.examName || null,
    daraja: sertifikat.daraja || meta?.daraja || sertifikat.grade || 'C',
    shkalaBalli:
      sertifikat.shkalaBalli ?? meta?.shkalaBalli ?? sertifikat.score ?? '0.0',
    theta: sertifikat.theta ?? meta?.theta ?? 0,
    se: sertifikat.se ?? meta?.se ?? '0.35',
    oddiyBall: sertifikat.oddiyBall ?? meta?.oddiyBall ?? null,
    oddiyFoiz: sertifikat.oddiyFoiz ?? meta?.oddiyFoiz ?? sertifikat.percentage ?? null,
    rawScore: sertifikat.rawScore ?? meta?.rawScore ?? null,
    jamiSavollar: sertifikat.jamiSavollar ?? meta?.jamiSavollar ?? null,
    percentile: sertifikat.percentile ?? null,
    kalibrlashUsuli: sertifikat.kalibrlashUsuli || meta?.kalibrlashUsuli || null,
    issuedAt: sertifikat.issuedAt || new Date().toISOString(),
    expiresAt: sertifikat.expiresAt ?? null,
    status: sertifikat.status || 'valid',
    seals: Array.isArray(sertifikat.seals) ? sertifikat.seals : [],
    imtiyoz: sertifikat.imtiyoz || null,
  }
}

/**
 * Sertifikat F.I.SH ni 1 marta tahrirlash qoidasi uchun sof qaror funksiyasi.
 * Takroriy tahrirni oldini olish uchun lock holatini description JSON ichida saqlaydi.
 */
export function sertifikatIsmSaqlashQarori({
  mavjud,
  yangiIsm,
  hozirIso = new Date().toISOString(),
  maksUzunlik = 80,
}) {
  const tozaIsm = String(yangiIsm || '').replace(/\s+/g, ' ').trim()
  if (!tozaIsm || tozaIsm.length > maksUzunlik) {
    return { ok: false, status: 400, error: "Noto'g'ri F.I.SH" }
  }

  const { meta, matn, fullNameLocked } = ajratSertifikatTavsifi(mavjud)
  const joriyIsm = String(mavjud?.fullName || '').replace(/\s+/g, ' ').trim()

  if (tozaIsm === joriyIsm) {
    return {
      ok: true,
      status: 200,
      ozgardi: false,
      fullName: tozaIsm,
      fullNameLocked,
      nextMetadata: meta || (matn ? { izoh: matn } : null),
      nextDescription: mavjud?.description ?? null,
    }
  }

  if (fullNameLocked) {
    return {
      ok: false,
      status: 403,
      locked: true,
      error:
        "Sertifikatdagi F.I.SH allaqachon tasdiqlangan (1 marta tahrirlash limiti ishlatilgan). O'zgartirish uchun admin bilan bog'laning.",
    }
  }

  const yangiMeta = {
    ...(meta || (matn ? { izoh: matn } : {})),
    fullNameLocked: true,
    fullNameEditedAt: hozirIso,
    oldFullName: joriyIsm || null,
  }

  return {
    ok: true,
    status: 200,
    ozgardi: true,
    fullName: tozaIsm,
    fullNameLocked: true,
    nextMetadata: yangiMeta,
    nextDescription: JSON.stringify(yangiMeta),
  }
}

/**
 * Sertifikat tekshiruvining yagona canonical yo'li.
 */
export function sertifikatVerifyYoli(certId) {
  const toza = String(certId || '').trim().toUpperCase()
  return `/sertifikat/verify/${encodeURIComponent(toza)}`
}

/**
 * QR-kodga yoziladigan to'liq tekshiruv URLi.
 */
export function sertifikatQrHavolasi(certId, origin = null) {
  const asos =
    origin ||
    (typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || SERTIFIKAT_DOMEN)
  return `${String(asos).replace(/\/+$/, '')}${sertifikatVerifyYoli(certId)}`
}

/**
 * Admin sertifikatlar jadvali va statistikasi uchun to'qnashuvsiz Prisma filtrlarini quradi.
 * `ms`, `hamkor` va `qolda` shartlari o'zaro ajratilgan (jami === ms + hamkor + qolda).
 */
export function qurAdminSertifikatFiltr({
  fan = '',
  status = '',
  manba = '',
  search = '',
  hozir = new Date(),
} = {}) {
  const realUserFiltr = { user: { role: { not: 'superadmin' } } }
  const msShart = {
    OR: [{ turi: SERTIFIKAT_TURLARI.milliy }, { certId: { startsWith: 'JDA-MS-' } }],
  }
  const hamkorShart = {
    AND: [
      { NOT: msShart },
      { OR: [{ turi: SERTIFIKAT_TURLARI.hamkor }, { certId: { startsWith: 'AK-' } }] },
    ],
  }
  const qoldaShart = {
    AND: [{ NOT: msShart }, { NOT: hamkorShart }],
  }

  const shartlar = [realUserFiltr]
  const fanToza = String(fan || '').trim()
  if (fanToza && fanToza !== 'all') {
    shartlar.push({ fan: fanToza })
  }

  const hozirSana = hozir instanceof Date ? hozir : new Date(hozir)
  const statusToza = String(status || '').trim()
  if (statusToza === 'valid') {
    shartlar.push({
      status: 'valid',
      OR: [{ expiresAt: null }, { expiresAt: { gt: hozirSana } }],
    })
  } else if (statusToza === 'expired') {
    shartlar.push({
      status: 'valid',
      expiresAt: { lte: hozirSana },
    })
  } else if (statusToza === 'revoked') {
    shartlar.push({ status: { not: 'valid' } })
  } else if (statusToza && statusToza !== 'all') {
    shartlar.push({ status: statusToza })
  }

  const manbaToza = String(manba || '').trim()
  if (manbaToza === 'ms') {
    shartlar.push(msShart)
  } else if (manbaToza === 'hamkor') {
    shartlar.push(hamkorShart)
  } else if (manbaToza === 'qolda') {
    shartlar.push(qoldaShart)
  }

  const qidiruv = String(search || '').trim()
  if (qidiruv) {
    shartlar.push({
      OR: [
        { fullName: { contains: qidiruv, mode: 'insensitive' } },
        { certId: { contains: qidiruv, mode: 'insensitive' } },
        { reason: { contains: qidiruv, mode: 'insensitive' } },
        { examName: { contains: qidiruv, mode: 'insensitive' } },
      ],
    })
  }

  return {
    realUserFiltr,
    where: shartlar.length === 1 ? shartlar[0] : { AND: shartlar },
    msWhere: { AND: [realUserFiltr, msShart] },
    hamkorWhere: { AND: [realUserFiltr, hamkorShart] },
    qoldaWhere: { AND: [realUserFiltr, qoldaShart] },
  }
}

/**
 * Mobil API uchun sertifikat yozuvini normallashtirilgan maydonlar va havolalar bilan formatlaydi.
 */
export function formatMobileSertifikat(sertifikat, origin = SERTIFIKAT_DOMEN) {
  if (!sertifikat) return null
  const { isMs, meta, matn, fullNameLocked } = ajratSertifikatTavsifi(sertifikat)
  const holatInfo = sertifikatHolati(sertifikat)
  const turi = sertifikatTuriAniqlash(sertifikat)
  const certId = String(sertifikat.certId || '').trim().toUpperCase()
  const asos = String(origin || SERTIFIKAT_DOMEN).replace(/\/+$/, '')

  return {
    id: sertifikat.id ?? null,
    certId,
    fullName: sertifikat.fullName || '',
    fan: sertifikat.fan || '',
    reason: sertifikat.reason || '',
    examName: sertifikat.examName ?? null,
    turi,
    isMs,
    meta,
    matn,
    fullNameLocked,
    holat: holatInfo.holat,
    yaroqli: holatInfo.yaroqli,
    sabab: holatInfo.sabab,
    belgi: holatInfo.belgi,
    grade: sertifikat.grade ?? meta?.daraja ?? null,
    score: sertifikat.score ?? meta?.shkalaBalli ?? null,
    percentage: sertifikat.percentage ?? meta?.oddiyFoiz ?? null,
    percentile: sertifikat.percentile ?? null,
    status: sertifikat.status || 'valid',
    issuedAt: sertifikat.issuedAt ?? null,
    expiresAt: sertifikat.expiresAt ?? null,
    seals: normallashtirSertifikatSeals(sertifikat.seals),
    verifyUrl: `${asos}${sertifikatVerifyYoli(certId)}`,
    pdfUrl: `${asos}/api/sertifikat/${encodeURIComponent(certId)}/pdf`,
  }
}

/**
 * Hamkor logotipi URLini normallashtiradi: eski mavjud bo'lmagan
 * `/images/alchemiq-logo.png` yo'lini haqiqiy `/images/hamkorlik/alchemiq-logo.jpg` ga almashtiradi.
 */
export function normallashtirHamkorLogoUrl(url) {
  if (typeof url !== 'string') return null
  const toza = url.trim()
  if (!toza) return null
  if (/^\/?images\/alchemiq-logo\.png$/i.test(toza)) {
    return ALCHEMIQ_LOGO
  }
  return toza
}

/**
 * `Certificate.seals` maydonidagi (massiv yoki hamkor muhr obyekti) eskirgan
 * logo manzillarini xavfsiz normallashtiradi.
 */
export function normallashtirSertifikatSeals(seals) {
  if (Array.isArray(seals)) {
    return seals
      .filter((s) => s && typeof s.url === 'string' && s.url.trim())
      .map((s) => ({
        ...s,
        url: normallashtirHamkorLogoUrl(s.url) || s.url.trim(),
      }))
  }
  if (seals && typeof seals === 'object') {
    if ('partnerLogo' in seals) {
      return {
        ...seals,
        partnerLogo: normallashtirHamkorLogoUrl(seals.partnerLogo),
      }
    }
    return seals
  }
  return null
}

/**
 * Certificate.seals maydonini normallashtiradi:
 * - MS / Admin maxsus sertifikatlarda rasm muhrlar massivi: [{ url, label }]
 * - Mavsumiy hamkorlikda esa hamkor imzo/logotip obyekti: { partnerName, badgeText, ... }
 */
export function ajratSertifikatMuhrlar(seals) {
  const norm = normallashtirSertifikatSeals(seals)
  if (Array.isArray(norm)) {
    return { rasmlar: norm, hamkorMuhri: null }
  }
  if (norm && typeof norm === 'object') {
    return { rasmlar: [], hamkorMuhri: norm }
  }
  return { rasmlar: [], hamkorMuhri: null }
}
