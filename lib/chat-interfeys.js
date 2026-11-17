/**
 * Shaxsiy chat (`/chat`) interfeysi uchun sof yordamchi funksiyalar.
 * Server va mijoz muhitlarida bir xil ishlaydi.
 */

const DEFAULT_PROFIL_QAYTISH = '/profil'
export const MAX_QADALGAN_SUHBAT = 5

/**
 * `/chat` sahifasidan "Profilga qaytish" tugmasi uchun xavfsiz qaytish manzilini tekshiradi.
 * Faqat `/profil` va uning ichki sahifalariga ruxsat beradi (open-redirect/XSS oldini oladi).
 *
 * @param {string | null | undefined} rawPath
 * @returns {string}
 */
export function xavfsizProfilQaytishManzili(rawPath) {
  if (typeof rawPath !== 'string') return DEFAULT_PROFIL_QAYTISH
  const path = rawPath.trim()
  if (!path) return DEFAULT_PROFIL_QAYTISH

  // Boshqaruv belgilari, protokollar va `//` ko'rinishidagi tashqi havolalarni rad etish
  if (
    /[\u0000-\u001F\u007F\\]/.test(path) ||
    path.startsWith('//') ||
    path.includes('://')
  ) {
    return DEFAULT_PROFIL_QAYTISH
  }

  // Faqat `/profil` yoki `/profil/...`, `/profil?...`, `/profil#...` bo'lishi shart
  if (!path.startsWith('/profil')) {
    return DEFAULT_PROFIL_QAYTISH
  }

  const keyingiBelgi = path.charAt('/profil'.length)
  if (
    keyingiBelgi !== '' &&
    keyingiBelgi !== '/' &&
    keyingiBelgi !== '?' &&
    keyingiBelgi !== '#'
  ) {
    return DEFAULT_PROFIL_QAYTISH
  }

  return path
}

/**
 * `/chat` sahifasiga qulay chuqur havola (deep link) yaratadi.
 *
 * @param {{ suhbatId?: string | null, yozishUserId?: string | null, qaytish?: string | null }} [opts]
 * @returns {string}
 */
export function chatKirishHavolasi(opts = {}) {
  const { suhbatId, yozishUserId, qaytish } = opts || {}
  const params = new URLSearchParams()

  if (typeof suhbatId === 'string' && suhbatId.trim()) {
    params.set('suhbat', suhbatId.trim())
  } else if (typeof yozishUserId === 'string' && yozishUserId.trim()) {
    params.set('yozish', yozishUserId.trim())
  }

  if (typeof qaytish === 'string' && qaytish.trim()) {
    const xavfsiz = xavfsizProfilQaytishManzili(qaytish)
    if (xavfsiz !== DEFAULT_PROFIL_QAYTISH) {
      params.set('qaytish', xavfsiz)
    }
  }

  const query = params.toString()
  return query ? `/chat?${query}` : '/chat'
}

/**
 * Suhbat obyekti uchun mos UI bo'limini (`faol`, `sorov`, `yuborilgan`) aniqlaydi.
 *
 * @param {{ holat?: string, menBoshladim?: boolean } | null | undefined} suhbatItem
 * @returns {'faol' | 'sorov' | 'yuborilgan'}
 */
export function suhbatBolimi(suhbatItem) {
  if (suhbatItem?.holat === 'sorov') {
    return suhbatItem.menBoshladim ? 'yuborilgan' : 'sorov'
  }
  return 'faol'
}

/**
 * Suhbat qadalganmi (pin qilinganmi) ekanini tekshiradi.
 *
 * @param {{ qadalgan?: boolean, qadalganVaqt?: string | Date | null } | null | undefined} suhbatItem
 * @returns {boolean}
 */
export function suhbatQadalganmi(suhbatItem) {
  return Boolean(suhbatItem?.qadalgan || suhbatItem?.qadalganVaqt)
}

/**
 * Suhbatlarni tartiblaydi: avval qadalganlar (`qadalganVaqt` kamayish bo'yicha),
 * so'ng oxirgi faollik (`updatedAt` kamayish bo'yicha).
 *
 * @param {Array<any>} royxat
 * @returns {Array<any>}
 */
export function suhbatTartibla(royxat) {
  if (!Array.isArray(royxat)) return []
  return [...royxat].sort((a, b) => {
    const aPin = suhbatQadalganmi(a) ? 1 : 0
    const bPin = suhbatQadalganmi(b) ? 1 : 0
    if (aPin !== bPin) return bPin - aPin

    if (aPin && bPin) {
      const aPinTime = a?.qadalganVaqt ? new Date(a.qadalganVaqt).getTime() : 0
      const bPinTime = b?.qadalganVaqt ? new Date(b.qadalganVaqt).getTime() : 0
      if (aPinTime !== bPinTime) return bPinTime - aPinTime
    }

    const aTime = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0
    const bTime = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0
    return bTime - aTime
  })
}

/**
 * Chat ro'yxatini ism, username, ID, oxirgi xabar matni va ixtiyoriy
 * o'qilmagan holati bo'yicha filtrlaydi.
 *
 * @param {Array<any>} royxat
 * @param {string | null | undefined} qidiruv
 * @param {{ faqatOqilmagan?: boolean }} [opts]
 * @returns {Array<any>}
 */
export function chatQatorFiltr(royxat, qidiruv, opts = {}) {
  if (!Array.isArray(royxat)) return []
  const { faqatOqilmagan = false } = opts || {}

  let natija = faqatOqilmagan
    ? royxat.filter((q) => (Number(q?.oqilmagan) || 0) > 0)
    : royxat

  const xom = typeof qidiruv === 'string' ? qidiruv.trim().toLowerCase() : ''
  if (!xom) return natija

  const toza = xom.startsWith('@') ? xom.slice(1) : xom
  if (!toza) return natija

  natija = natija.filter((qator) => {
    const odam = qator?.odam || {}
    const maydonlar = [
      odam.fullName,
      odam.username,
      odam.userId,
      qator?.oxirgiXabar?.matn,
    ]
    return maydonlar.some((qiymat) => {
      if (typeof qiymat !== 'string' && typeof qiymat !== 'number') return false
      const satr = String(qiymat).toLowerCase()
      return satr.includes(xom) || satr.includes(toza)
    })
  })

  return natija
}

/**
 * Ochiq suhbat ichidagi xabarlardan qidiradi (o'chirilmagan xabarlar bo'yicha).
 *
 * @param {Array<any>} xabarlar
 * @param {string | null | undefined} sorov
 * @returns {Array<{ id: string, index: number }>}
 */
export function ichkiXabarQidir(xabarlar, sorov) {
  if (!Array.isArray(xabarlar)) return []
  const q = typeof sorov === 'string' ? sorov.trim().toLowerCase() : ''
  if (!q) return []

  const topilgan = []
  for (let i = 0; i < xabarlar.length; i += 1) {
    const x = xabarlar[i]
    if (!x || x.ochirilgan || typeof x.matn !== 'string') continue
    if (x.matn.toLowerCase().includes(q)) {
      topilgan.push({ id: x.id, index: i })
    }
  }
  return topilgan
}

/**
 * Iqtibos (javob berish) uchun xabar matnini bir qatorli ixcham ko'rinishga keltiradi.
 *
 * @param {{ matn?: string | null, ochirilgan?: boolean } | null | undefined} xabar
 * @param {number} [maxLen]
 * @returns {string}
 */
export function xabarQisqaMatn(xabar, maxLen = 72) {
  if (!xabar) return ''
  if (xabar.ochirilgan) return "Xabar o'chirildi"
  const raw = typeof xabar.matn === 'string' ? xabar.matn : ''
  if (!raw.trim()) return ''

  const quizMatch = raw.match(/\[quiz:[a-zA-Z0-9_\-]+:([^\]]+)\]/)
  let matn = raw
  if (quizMatch) {
    const prefix = raw.replace(/🧪?\s*\[quiz:[a-zA-Z0-9_\-]+:[^\]]+\]/g, '').trim()
    matn = prefix ? `${prefix} — Ustoz testi: ${quizMatch[1]}` : `Ustoz testi: ${quizMatch[1]}`
  }

  const birQator = matn.replace(/\s+/g, ' ').trim()
  if (birQator.length <= maxLen) return birQator
  return birQator.slice(0, Math.max(1, maxLen - 1)).trimEnd() + '…'
}

/**
 * "Yangi suhbat" paneli uchun do'stlar va global qidiruv natijalarini birlashtiradi.
 * Takrorlarni olib tashlaydi va o'z profilini chiqarib tashlaydi.
 *
 * @param {Array<any>} dostlar
 * @param {Array<any>} qidiruvNatija
 * @param {string | null | undefined} ozUserId
 * @returns {Array<any>}
 */
export function dostVaQidiruvBirlashtir(dostlar = [], qidiruvNatija = [], ozUserId = null) {
  const selfId = ozUserId ? String(ozUserId) : null
  const xarita = new Map()

  const qosh = (item, dostmiDefault) => {
    if (!item || typeof item !== 'object') return
    const publicId = item.userId ? String(item.userId) : ''
    if (!publicId) return
    if (selfId && publicId === selfId) return

    const dostmi = Boolean(dostmiDefault || item.status === 'ACCEPTED')
    const avvalgi = xarita.get(publicId)
    if (avvalgi) {
      xarita.set(publicId, {
        ...avvalgi,
        ...item,
        userId: publicId,
        dostmi: avvalgi.dostmi || dostmi,
      })
      return
    }

    xarita.set(publicId, {
      ...item,
      userId: publicId,
      dostmi,
    })
  }

  for (const d of Array.isArray(dostlar) ? dostlar : []) {
    qosh(d, true)
  }
  for (const u of Array.isArray(qidiruvNatija) ? qidiruvNatija : []) {
    qosh(u, u?.status === 'ACCEPTED')
  }

  return Array.from(xarita.values())
}

function odamOzgardimi(a, b) {
  if (a === b) return false
  if (!a || !b) return true
  return (
    a.id !== b.id ||
    a.fullName !== b.fullName ||
    a.username !== b.username ||
    a.avatar !== b.avatar ||
    Boolean(a.isVerified) !== Boolean(b.isVerified)
  )
}

function bolimRoyxatiOzgardimi(aArr = [], bArr = []) {
  if (aArr.length !== bArr.length) return true
  for (let i = 0; i < aArr.length; i += 1) {
    const a = aArr[i]
    const b = bArr[i]
    if (!a || !b) return true
    if (
      a.id !== b.id ||
      a.holat !== b.holat ||
      Boolean(a.qadalgan) !== Boolean(b.qadalgan) ||
      String(a.qadalganVaqt || '') !== String(b.qadalganVaqt || '') ||
      Boolean(a.menBoshladim) !== Boolean(b.menBoshladim) ||
      (Number(a.oqilmagan) || 0) !== (Number(b.oqilmagan) || 0) ||
      String(a.updatedAt || '') !== String(b.updatedAt || '') ||
      odamOzgardimi(a.odam, b.odam)
    ) {
      return true
    }

    const ax = a.oxirgiXabar
    const bx = b.oxirgiXabar
    if (Boolean(ax) !== Boolean(bx)) return true
    if (
      ax &&
      bx &&
      (ax.matn !== bx.matn ||
        Boolean(ax.ochirilgan) !== Boolean(bx.ochirilgan) ||
        Boolean(ax.meniki) !== Boolean(bx.meniki) ||
        String(ax.createdAt || '') !== String(bx.createdAt || ''))
    ) {
      return true
    }
  }
  return false
}

/**
 * 4 soniyalik polling javobi oldingi suhbatlar ro'yxatidan farq qiladimi tekshiradi.
 * Farq bo'lmasa `setRoyxat` ni o'tkazib yuborish qayta render va scroll qotishini kamaytiradi.
 */
export function chatRoyxatOzgardimi(oldingi, yangi) {
  if (oldingi === yangi) return false
  if (!oldingi || !yangi) return true
  if ((Number(oldingi.oqilmagan) || 0) !== (Number(yangi.oqilmagan) || 0)) return true

  return (
    bolimRoyxatiOzgardimi(oldingi.faol, yangi.faol) ||
    bolimRoyxatiOzgardimi(oldingi.sorovlar, yangi.sorovlar) ||
    bolimRoyxatiOzgardimi(oldingi.yuborilgan, yangi.yuborilgan)
  )
}

/**
 * 4 soniyalik polling javobi ochiq suhbatning joriy holatidan farq qiladimi tekshiradi.
 */
export function suhbatOzgardimi(oldingi, yangi) {
  if (oldingi === yangi) return false
  if (!oldingi || !yangi) return true

  const aSuhbat = oldingi.suhbat
  const bSuhbat = yangi.suhbat
  if (!aSuhbat || !bSuhbat) return true

  if (
    aSuhbat.id !== bSuhbat.id ||
    aSuhbat.holat !== bSuhbat.holat ||
    Boolean(aSuhbat.menBoshladim) !== Boolean(bSuhbat.menBoshladim) ||
    Boolean(aSuhbat.qadalgan) !== Boolean(bSuhbat.qadalgan) ||
    String(aSuhbat.qadalganVaqt || '') !== String(bSuhbat.qadalganVaqt || '') ||
    odamOzgardimi(aSuhbat.odam, bSuhbat.odam)
  ) {
    return true
  }

  if (
    Boolean(oldingi.blok?.meniBlokladi) !== Boolean(yangi.blok?.meniBlokladi) ||
    Boolean(oldingi.blok?.menBlokladim) !== Boolean(yangi.blok?.menBlokladim)
  ) {
    return true
  }

  const aXabarlar = Array.isArray(oldingi.xabarlar) ? oldingi.xabarlar : []
  const bXabarlar = Array.isArray(yangi.xabarlar) ? yangi.xabarlar : []
  if (aXabarlar.length !== bXabarlar.length) return true

  for (let i = 0; i < aXabarlar.length; i += 1) {
    const ax = aXabarlar[i]
    const bx = bXabarlar[i]
    if (!ax || !bx) return true
    if (
      ax.id !== bx.id ||
      Boolean(ax.oqilgan) !== Boolean(bx.oqilgan) ||
      Boolean(ax.ochirilgan) !== Boolean(bx.ochirilgan) ||
      Boolean(ax.meniki) !== Boolean(bx.meniki) ||
      ax.matn !== bx.matn ||
      Boolean(ax.replyTo?.ochirilgan) !== Boolean(bx.replyTo?.ochirilgan)
    ) {
      return true
    }
  }

  return false
}
