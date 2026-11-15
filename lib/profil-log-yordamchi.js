// lib/profil-log-yordamchi.js
//
// Shaxsiy profil harakatlari, xavfsizlik va sozlama loglari uchun
// sof (bazaga bog'liq bo'lmagan) yordamchi funksiyalar.

export const LOG_TOIFALARI = Object.freeze([
  'xavfsizlik',
  'sozlama',
  'maxfiylik',
  'profil',
  'sertifikat',
  'natija',
  'hisob',
])

export const LOG_TOIFA_TARIFLARI = Object.freeze({
  barchasi: { nom: 'Barchasi', ikon: 'royxat' },
  xavfsizlik: { nom: 'Xavfsizlik', ikon: 'qalqon' },
  sozlama: { nom: 'Sozlamalar', ikon: 'sozlama' },
  maxfiylik: { nom: 'Maxfiylik', ikon: 'qulf' },
  profil: { nom: 'Profil', ikon: 'odam' },
  sertifikat: { nom: 'Sertifikatlar', ikon: 'sertifikat' },
  natija: { nom: 'Natijalar', ikon: 'quiz' },
  hisob: { nom: 'Hisob', ikon: 'vaqt' },
})

export const LOG_HOLATLARI = Object.freeze([
  'muvaffaqiyat',
  'ogohlantirish',
  'xato',
])

const MAYDON_NOMLARI = Object.freeze({
  fullName: 'Ism',
  bio: 'Bio',
  university: 'OTM / Maktab',
  faculty: 'Fakultet',
  specialty: "Yo'nalish",
  level: 'Kurs',
  location: 'Manzil',
  academicDegree: 'Daraja',
  studentId: 'Talaba ID',
  enrollmentYear: 'Kirish yili',
  birthDate: "Tug'ilgan sana",
  telegram: 'Telegram',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  twitter: 'X',
  website: 'Veb-sayt',
  googleScholar: 'Google Scholar',
  orcid: 'ORCID',
  interfaceSettings: 'Interfeys',
  learningPreferences: "O'quv maqsadlari",
  notificationSettings: 'Bildirishnomalar',
})

const SOZLAMA_MAYDONLARI = new Set([
  'interfaceSettings',
  'learningPreferences',
  'notificationSettings',
])

export function ipTozala(ip) {
  if (typeof ip !== 'string') return null
  const toza = ip.trim().replace(/^::ffff:/i, '')
  if (!toza || toza === 'unknown') return null
  return toza.slice(0, 64)
}

export function ipNiMaskala(ip) {
  const toza = ipTozala(ip)
  if (!toza) return null
  if (toza.includes('.')) {
    const q = toza.split('.')
    if (q.length === 4) return `${q[0]}.${q[1]}.${q[2]}.*`
  }
  if (toza.includes(':')) {
    const q = toza.split(':').filter(Boolean)
    if (q.length >= 2) return `${q.slice(0, 2).join(':')}:*`
  }
  return toza
}

export function qurilmaniAniqlash(ua) {
  if (typeof ua !== 'string' || !ua.trim()) return "Noma'lum qurilma"
  const s = ua.toLowerCase()

  if (s.includes('jda-kimyo-mobile') || s.includes('expo') || s.includes('okhttp')) {
    const os = s.includes('iphone') || s.includes('ios') ? 'iOS' : 'Android'
    return `Mobil ilova · ${os}`
  }

  let brauzer = 'Brauzer'
  if (s.includes('edg/') || s.includes('edge')) brauzer = 'Edge'
  else if (s.includes('opr/') || s.includes('opera')) brauzer = 'Opera'
  else if (s.includes('chrome/') && !s.includes('chromium')) brauzer = 'Chrome'
  else if (s.includes('firefox/')) brauzer = 'Firefox'
  else if (s.includes('safari/') && !s.includes('chrome/')) brauzer = 'Safari'
  else if (s.includes('telegram')) brauzer = 'Telegram'
  else if (s.includes('curl') || s.includes('node')) brauzer = 'API'

  let os = ''
  if (s.includes('windows')) os = 'Windows'
  else if (s.includes('iphone') || s.includes('ipad') || s.includes('ios')) os = 'iOS'
  else if (s.includes('android')) os = 'Android'
  else if (s.includes('mac os') || s.includes('macintosh')) os = 'macOS'
  else if (s.includes('linux')) os = 'Linux'

  return os ? `${brauzer} · ${os}` : brauzer
}

function qiymatBirXilmi(a, b) {
  if (a === b) return true
  if ((a === null || a === undefined || a === '') && (b === null || b === undefined || b === '')) {
    return true
  }
  if (a instanceof Date || b instanceof Date) {
    const ta = a ? new Date(a).getTime() : NaN
    const tb = b ? new Date(b).getTime() : NaN
    return Number.isFinite(ta) && Number.isFinite(tb) && Math.abs(ta - tb) < 1000
  }
  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
    try {
      const ka = Object.keys(a).sort()
      const kb = Object.keys(b).sort()
      if (ka.length !== kb.length) return false
      return ka.every((k, i) => k === kb[i] && qiymatBirXilmi(a[k], b[k]))
    } catch {
      return false
    }
  }
  return false
}

/**
 * PUT /api/profil yangilashlaridan inson o'qiydigan log xulosasini tuzadi.
 */
export function ozgarganMaydonlarXulosasi(eski = {}, updateData = {}) {
  const kalitlar = Object.keys(updateData || {})
  const ozgargan = kalitlar.filter((k) => !qiymatBirXilmi(eski?.[k], updateData[k]))
  if (ozgargan.length === 0) return null

  const nomlar = ozgargan.map((k) => MAYDON_NOMLARI[k] || k)
  const faqatSozlama = ozgargan.every((k) => SOZLAMA_MAYDONLARI.has(k))
  const toifa = faqatSozlama ? 'sozlama' : 'profil'

  const qisqaRoyxat = nomlar.slice(0, 4).join(', ')
  const qoldiq = nomlar.length > 4 ? ` +${nomlar.length - 4}` : ''
  const sarlavha = faqatSozlama
    ? nomlar.length === 1
      ? `${nomlar[0]} yangilandi`
      : 'Sozlamalar yangilandi'
    : 'Profil yangilandi'

  const qoshimcha = []
  if (updateData.learningPreferences && ozgargan.includes('learningPreferences')) {
    const lp = updateData.learningPreferences
    qoshimcha.push(`kuniga ${lp.dailyGoalQuestions} savol / ${lp.dailyGoalMinutes} daq`)
  }

  const tafsilot = qoshimcha.length > 0
    ? `${qisqaRoyxat}${qoldiq} (${qoshimcha.join(', ')})`
    : `${qisqaRoyxat}${qoldiq}`

  return {
    maydonlar: ozgargan,
    toifa,
    sarlavha,
    tafsilot,
  }
}

export function tarjimaLogHodisa(row) {
  if (!row) return null
  return {
    id: row.id,
    manba: 'profil_log',
    toifa: LOG_TOIFALARI.includes(row.toifa) ? row.toifa : 'hisob',
    amal: row.amal,
    sarlavha: row.sarlavha,
    tafsilot: row.tafsilot || null,
    holat: LOG_HOLATLARI.includes(row.holat) ? row.holat : 'muvaffaqiyat',
    ipAddress: ipTozala(row.ipAddress),
    qurilma: row.userAgent ? qurilmaniAniqlash(row.userAgent) : null,
    meta: row.meta || null,
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
  }
}

export function msUrinishdanLog(u, { imtihonNom } = {}) {
  if (!u) return null
  const nom = imtihonNom || u.slug
  const turiMatn = u.slug === 'rasch-diagnostika' ? 'Diagnostika' : 'Imtihon'
  if (u.holat !== 'elon_qilindi') {
    return {
      id: `ms-${u.id}`,
      manba: 'ms_urinish',
      toifa: 'natija',
      amal: 'MS_SINOV_TOPSHIRILDI',
      sarlavha: `MS sinovi topshirildi: ${nom}`,
      tafsilot: `${turiMatn} · Natija kutilmoqda`,
      holat: 'ogohlantirish',
      ipAddress: null,
      qurilma: null,
      meta: { slug: u.slug, holat: u.holat, refId: u.id },
      createdAt: new Date(u.yakunlanganVaqt || u.boshlanganVaqt || Date.now()).toISOString(),
    }
  }

  const qismlar = []
  if (u.daraja) qismlar.push(`Daraja: ${u.daraja}`)
  if (Number.isFinite(u.shkalaBalli)) qismlar.push(`T-ball: ${Number(u.shkalaBalli).toFixed(1)}`)
  if (Number.isFinite(u.oddiyFoiz)) qismlar.push(`${u.oddiyFoiz}%`)

  return {
    id: `ms-${u.id}`,
    manba: 'ms_urinish',
    toifa: 'natija',
    amal: 'MS_NATIJA_ELON',
    sarlavha: `MS natijasi: ${nom}`,
    tafsilot: qismlar.join(' · ') || 'Natija e’lon qilindi',
    holat: 'muvaffaqiyat',
    ipAddress: null,
    qurilma: null,
    meta: { slug: u.slug, holat: u.holat, daraja: u.daraja || null, refId: u.id },
    createdAt: new Date(u.yakunlanganVaqt || u.boshlanganVaqt || Date.now()).toISOString(),
  }
}

export function sertifikatdanLog(c) {
  if (!c) return null
  const sarlavhaNomi = c.examName || c.reason || c.fan || 'Sertifikat'
  const qismlar = [c.certId]
  if (c.grade) qismlar.push(`Daraja: ${c.grade}`)
  if (c.fan && c.fan !== sarlavhaNomi) qismlar.push(c.fan)

  const bekor = c.status === 'revoked' || c.status === 'bekor'

  return {
    id: `cert-${c.id}`,
    manba: 'sertifikat',
    toifa: 'sertifikat',
    amal: 'SERTIFIKAT_BERILDI',
    sarlavha: `Sertifikat: ${sarlavhaNomi}`,
    tafsilot: qismlar.join(' · '),
    holat: bekor ? 'xato' : 'muvaffaqiyat',
    ipAddress: null,
    qurilma: null,
    meta: { certId: c.certId, turi: c.turi || 'umumiy', refId: c.id },
    createdAt: new Date(c.issuedAt || Date.now()).toISOString(),
  }
}

export function quizdanLog(q) {
  if (!q) return null
  return {
    id: `quiz-${q.id}`,
    manba: 'quiz',
    toifa: 'natija',
    amal: 'QUIZ_YECHILDI',
    sarlavha: `Test: ${q.quizName}`,
    tafsilot: `${q.score}/${q.totalQuestions} to'g'ri (${q.percentage}%)`,
    holat: 'muvaffaqiyat',
    ipAddress: null,
    qurilma: null,
    meta: { percentage: q.percentage, refId: q.id },
    createdAt: new Date(q.completedAt || Date.now()).toISOString(),
  }
}

export function labTranzaksiyadanLog(t) {
  if (!t) return null
  const valyutaNomi = t.valyuta === 'gems' ? 'olmos' : 'tanga'
  const miqdor = Number(t.miqdor) || 0
  const miqdorMatni = miqdor ? `${miqdor > 0 ? '+' : ''}${miqdor} ${valyutaNomi}` : null

  return {
    id: `lab-${t.id}`,
    manba: 'lab_tranzaksiya',
    toifa: 'hisob',
    amal: `BALANS_${String(t.turi || 'AMAL').toUpperCase()}`,
    sarlavha: t.izoh || (t.kalit ? `Lab: ${t.kalit}` : 'Balans harakati'),
    tafsilot: miqdorMatni,
    holat: 'muvaffaqiyat',
    ipAddress: null,
    qurilma: null,
    meta: { refId: t.id },
    createdAt: new Date(t.createdAt || Date.now()).toISOString(),
  }
}

export function birlashtirProfilLoglar({
  saqlangan = [],
  tizim = [],
  toifa = 'barchasi',
  holat = 'barchasi',
  qidiruv = '',
} = {}) {
  const korilganRef = new Set()
  const korilganId = new Set()
  const jami = []

  for (const x of saqlangan) {
    if (!x || !x.id) continue
    if (korilganId.has(x.id)) continue
    korilganId.add(x.id)
    if (x.meta?.refId) korilganRef.add(`${x.amal}:${x.meta.refId}`)
    jami.push(x)
  }

  for (const t of tizim) {
    if (!t || !t.id) continue
    if (korilganId.has(t.id)) continue
    if (t.meta?.refId && korilganRef.has(`${t.amal}:${t.meta.refId}`)) continue
    korilganId.add(t.id)
    jami.push(t)
  }

  const q = typeof qidiruv === 'string' ? qidiruv.trim().toLowerCase() : ''

  return jami
    .filter((item) => {
      if (toifa && toifa !== 'barchasi' && item.toifa !== toifa) return false
      if (holat && holat !== 'barchasi' && item.holat !== holat) return false
      if (q) {
        const matn = [item.sarlavha, item.tafsilot, item.amal, item.qurilma, item.ipAddress]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!matn.includes(q)) return false
      }
      return true
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function csvHujayra(qiymat) {
  const xom = qiymat === null || qiymat === undefined ? '' : String(qiymat)
  const himoyalangan = /^[=+\-@\t\r]/.test(xom) ? `'${xom}` : xom
  return `"${himoyalangan.replace(/"/g, '""').replace(/[\r\n]+/g, ' ')}"`
}

export function profilLogCsvYasa(items = []) {
  const sarlavha = ['Vaqt', 'Toifa', 'Amal', 'Holat', 'Sarlavha', 'Tafsilot', 'Qurilma', 'IP']
  const qatorlar = items.map((x) =>
    [
      csvHujayra(x.createdAt),
      csvHujayra(x.toifa),
      csvHujayra(x.amal),
      csvHujayra(x.holat),
      csvHujayra(x.sarlavha),
      csvHujayra(x.tafsilot),
      csvHujayra(x.qurilma),
      csvHujayra(x.ipAddress),
    ].join(','),
  )
  return `\uFEFF${[sarlavha.map(csvHujayra).join(','), ...qatorlar].join('\n')}`
}
