// lib/sitemap-qoidalari.js
//
// Sitemap va robots qoidalarini birlashtiruvchi yagona sof yordamchi modul.
// `app/sitemap.js`, `scripts/gen-sitemap-royxat.js` va `test/sitemap-seo.test.js`
// aynan shu mantiqdan foydalanadi.

export const SAYT_DOMEN = 'https://www.jdakimyo.uz'

/**
 * Muhimlik (`priority`) va yangilanish chastotasi alohida belgilangan asosiy
 * ommaviy kirish sahifalari. `app/robots.js` taqiqlagan manzillar (/login,
 * /register, /chat, /profil/, /ustoz/, /admin/, /hamkorlar, /doska/auth,
 * /doska/skaner) va kirish talab qiladigan /kochat bu ro'yxatga kiritilmaydi.
 */
export const ASOSIY_SAHIFALAR = [
  { yol: '/', muhimlik: 1.0, yangilanish: 'daily' },
  { yol: '/jda-kimyo', muhimlik: 0.9, yangilanish: 'monthly' },
  { yol: '/maktabkimyo', muhimlik: 0.9, yangilanish: 'weekly' },
  { yol: '/milliy-sertifikat', muhimlik: 0.9, yangilanish: 'daily' },
  { yol: '/oyinlar', muhimlik: 0.8, yangilanish: 'weekly' },
  { yol: '/laboratoriya', muhimlik: 0.8, yangilanish: 'weekly' },
  { yol: '/masala', muhimlik: 0.8, yangilanish: 'weekly' },
  { yol: '/doska', muhimlik: 0.8, yangilanish: 'weekly' },
  { yol: '/testlar', muhimlik: 0.8, yangilanish: 'weekly' },
  { yol: '/repititorlar', muhimlik: 0.8, yangilanish: 'daily' },
  { yol: '/dolzarb', muhimlik: 0.8, yangilanish: 'daily' },
  { yol: '/kanallar', muhimlik: 0.7, yangilanish: 'daily' },
  { yol: '/kimyogarlar', muhimlik: 0.7, yangilanish: 'monthly' },
  { yol: '/oliykimyo', muhimlik: 0.7, yangilanish: 'monthly' },
  { yol: '/sertifikat', muhimlik: 0.7, yangilanish: 'monthly' },
  { yol: '/milliy-sertifikat/tekshir', muhimlik: 0.6, yangilanish: 'monthly' },
  { yol: '/ishlashi', muhimlik: 0.6, yangilanish: 'monthly' },
  { yol: '/hamkorlik', muhimlik: 0.6, yangilanish: 'monthly' },
  { yol: '/dokon', muhimlik: 0.5, yangilanish: 'monthly' },
  { yol: '/hamkorlik/sayt-hamkorlari', muhimlik: 0.5, yangilanish: 'monthly' },
  { yol: '/hamkorlik/faq', muhimlik: 0.5, yangilanish: 'monthly' },
  { yol: '/hamkorlik/yangiliklar', muhimlik: 0.5, yangilanish: 'weekly' },
  { yol: '/hamkorlik/boglanish', muhimlik: 0.5, yangilanish: 'monthly' },
  { yol: '/hamkorlik/jamoaga-taklif', muhimlik: 0.5, yangilanish: 'monthly' },
  { yol: '/qidiruv', muhimlik: 0.4, yangilanish: 'monthly' },
]

/**
 * Yo'lni kanonik ko'rinishga keltiradi: bosh sahifa uchun `''`, qolganlar uchun
 * boshida `/` bo'lgan, oxirida `/` bo'lmagan ko'rinish (`/oyinlar`).
 */
export function yolniNormallashtir(yol) {
  const matn = String(yol || '').trim()
  if (!matn || matn === '/') return ''
  const toza = (matn.startsWith('/') ? matn : `/${matn}`).replace(/\/+$/, '')
  return toza === '/' ? '' : toza
}

/**
 * `app/robots.js` dagi `disallow` qoidalari ro'yxatidan tekshiradi.
 */
export function robotsTaqiqlaganmi(yol, disallowQoidalari = []) {
  const norm = yolniNormallashtir(yol)
  const tekshiruvYoli = norm || '/'

  for (const xomQoida of disallowQoidalari) {
    const qoida = String(xomQoida || '').trim()
    if (!qoida) continue
    if (qoida === '/') return true

    if (qoida.endsWith('/')) {
      const qisqa = qoida.slice(0, -1)
      if (tekshiruvYoli === qisqa || tekshiruvYoli.startsWith(qoida)) {
        return true
      }
    } else if (tekshiruvYoli === qoida || tekshiruvYoli.startsWith(`${qoida}/`)) {
      return true
    }
  }

  return false
}

function royxatUstunligi(yol) {
  if (/^\/maktabkimyo\/\d+sinf$/.test(yol)) {
    return { yangilanish: 'monthly', muhimlik: 0.8 }
  }
  if (/^\/maktabkimyo\/\d+sinf\//.test(yol)) {
    return { yangilanish: 'monthly', muhimlik: 0.8 }
  }
  if (yol.startsWith('/oyinlar/') || yol.startsWith('/testlar/')) {
    return { yangilanish: 'monthly', muhimlik: 0.7 }
  }
  if (yol.startsWith('/hamkorlik/')) {
    return { yangilanish: 'monthly', muhimlik: 0.5 }
  }
  return { yangilanish: 'monthly', muhimlik: 0.7 }
}

/**
 * `ASOSIY_SAHIFALAR`, `lib/sitemap-royxat.json` va ochiq kanallarni
 * dublikatlarsiz hamda `robots.js` qoidalariga mos ravishda yagona ro'yxatga yig'adi.
 */
export function sitemapYozuvlariniTuz({
  mavzular = [],
  kanallar = [],
  disallowQoidalari = [],
  hozir = new Date(),
  sayt = SAYT_DOMEN,
} = {}) {
  const sanaXaritasi = new Map()
  for (const item of mavzular) {
    const norm = yolniNormallashtir(item?.yol)
    if (!item?.sana) continue
    const d = new Date(item.sana)
    if (!Number.isNaN(d.getTime())) {
      sanaXaritasi.set(norm, d)
    }
  }

  const korilgan = new Set()
  const royxat = []

  const qosh = ({ yol, lastModified, changeFrequency, priority }) => {
    const norm = yolniNormallashtir(yol)
    if (robotsTaqiqlaganmi(norm, disallowQoidalari)) return
    const url = `${sayt}${norm}`
    if (korilgan.has(url)) return
    korilgan.add(url)
    royxat.push({ url, lastModified, changeFrequency, priority })
  }

  for (const s of ASOSIY_SAHIFALAR) {
    const norm = yolniNormallashtir(s.yol)
    qosh({
      yol: norm,
      lastModified: sanaXaritasi.get(norm) || hozir,
      changeFrequency: s.yangilanish,
      priority: s.muhimlik,
    })
  }

  for (const mavzu of mavzular) {
    const norm = yolniNormallashtir(mavzu?.yol)
    const { yangilanish, muhimlik } = royxatUstunligi(norm)
    const d = mavzu?.sana ? new Date(mavzu.sana) : null
    qosh({
      yol: norm,
      lastModified: d && !Number.isNaN(d.getTime()) ? d : hozir,
      changeFrequency: yangilanish,
      priority: muhimlik,
    })
  }

  for (const k of kanallar) {
    if (!k?.slug) continue
    qosh({
      yol: `/kanallar/${k.slug}`,
      lastModified: k.updatedAt || hozir,
      changeFrequency: 'daily',
      priority: 0.6,
    })
  }

  return royxat
}
