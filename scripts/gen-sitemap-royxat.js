// scripts/gen-sitemap-royxat.js
//
// Sitemap uchun indekslanadigan sahifalar ro'yxatini yig'adi va
// lib/sitemap-royxat.json ga yozadi.
//
// Mezon:
//   1. Statik sahifalar — `page.js(x)` yoki o'sha papkadagi `layout.js(x)`
//      o'z `metadata` / `generateMetadata` eksportiga ega bo'lishi kerak;
//      `redirect(...)` chaqiradigan, `robots: { index: false }` qo'yilgan,
//      `YOPIQ_BOLIMLAR` va `app/robots.js` da taqiqlangan manzillar kirmaydi.
//   2. Dinamik `/fan/[slug]` — faqat `holat === 'ochiq'` fanlar.
//   3. Dinamik `/maktabkimyo/[sinf]` va `/maktabkimyo/[sinf]/[mavzu]` —
//      faqat `ochiq === true` sinflar (7–8-sinf) va `mavzuTayyormi(...)`
//      tasdiqlagan tayyor mavzular (`ochiq !== false`).
//
// Ishga tushirish:
//   npm run sitemap:yangila

const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const { execFileSync } = require('child_process')
const esmRequire = require('./_esm-require')

const ROOT = path.join(__dirname, '..')
const APP = path.join(ROOT, 'app')
const CHIQISH = path.join(ROOT, 'lib', 'sitemap-royxat.json')

const { robotsTaqiqlaganmi } = esmRequire('lib/sitemap-qoidalari.js', [
  'robotsTaqiqlaganmi',
])
const {
  FANLAR,
  MAKTAB_SINFLARI,
  mavzuTayyormi,
  sinfHavolasi,
  mavzuHavolasi,
} = esmRequire('lib/fanlar.js', [
  'FANLAR',
  'MAKTAB_SINFLARI',
  'mavzuTayyormi',
  'sinfHavolasi',
  'mavzuHavolasi',
])

// Shaxsiy, xizmat yoki kirish talab qiladigan bo'limlar — bularda sarlavha
// bo'lsa ham qidiruv tizimi sitemapiga kirmaydi.
const YOPIQ_BOLIMLAR = new Set([
  'admin',
  'api',
  'profil',
  'ustoz',
  'ustoz-profil',
  // Auth talab qiladi (/api/plant 401 qaytaradi)
  'kochat',
  // Shaxsiy yozishma (robots.js + metadata robots: index: false)
  'chat',
  'hamkorlar',
  'login',
  'register',
])

/** `app/robots.js` dan barcha `disallow` yo'llarini oladi. */
async function robotsDisallowOl() {
  const robotsFayl = path.join(ROOT, 'app', 'robots.js')
  try {
    const mod = await import(pathToFileURL(robotsFayl).href)
    const natija = typeof mod.default === 'function' ? mod.default() : mod.default
    return (natija?.rules || []).flatMap((r) => r.disallow || [])
  } catch {
    const kod = fs.readFileSync(robotsFayl, 'utf8')
    const blok = /disallow:\s*\[([\s\S]*?)\]/.exec(kod)
    if (!blok) return []
    return [...blok[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1])
  }
}

/** Fayl o'z `metadata` yoki `generateMetadata` eksport qiladimi. */
function metadataBormi(kod) {
  return /export\s+(?:async\s+function\s+generateMetadata\b|(?:const|let|var)\s+metadata\b)/.test(kod)
}

/** Sahifa boshqa manzilga `redirect(...)` / `permanentRedirect(...)` qiladimi. */
function redirectBormi(kod) {
  return /\b(?:permanentRedirect|redirect)\s*\(/.test(kod)
}

/** Metadata ichida `robots: { index: false ... }` bormi. */
function noindexBormi(kod) {
  return /\brobots\s*:\s*\{[^}]*\bindex\s*:\s*false\b/.test(kod)
}

/**
 * Sahifa canonical bilan BOSHQA manzilga yo'naltirganmi.
 */
function canonicalBoshqami(kod, ozYol) {
  const m = /canonical:\s*['"`]([^'"`]+)['"`]/.exec(kod)
  if (!m) {
    return /alternates:\s*\{\s*canonical:/.test(kod)
  }

  const qiymat = m[1].replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '') || '/'
  return qiymat !== (ozYol || '/')
}

/**
 * Yo'l bo'laklarini manzilga aylantiradi.
 */
function manzil(bolaklar) {
  const chiqadi = []
  for (const b of bolaklar) {
    if (b.startsWith('[')) return null
    if (b.startsWith('(') || b.startsWith('_')) continue
    chiqadi.push(b)
  }
  return '/' + chiqadi.join('/')
}

/** Faylning oxirgi git commit sanasini (`YYYY-MM-DD`) oladi. */
function oxirgiOzgarish(faylYoli) {
  try {
    const sana = execFileSync(
      'git',
      ['log', '-1', '--format=%cs', '--', faylYoli],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim()
    return sana || null
  } catch {
    return null
  }
}

function engSonggiSana(fayllar) {
  const sanalar = fayllar
    .filter((f) => f && fs.existsSync(f))
    .map((f) => oxirgiOzgarish(f))
    .filter(Boolean)
    .sort()
  return sanalar.pop() || null
}

async function main() {
  const disallowQoidalari = await robotsDisallowOl()
  const royxat = []

  function yur(joriy, bolaklar) {
    const kirishlar = fs.readdirSync(joriy, { withFileTypes: true })

    for (const d of kirishlar) {
      if (d.isDirectory()) {
        yur(path.join(joriy, d.name), [...bolaklar, d.name])
      }
    }

    const pageKirish = kirishlar.find(
      (d) => d.isFile() && (d.name === 'page.js' || d.name === 'page.jsx'),
    )
    if (!pageKirish) return

    const pageFayl = path.join(joriy, pageKirish.name)
    const pageKod = fs.readFileSync(pageFayl, 'utf8')
    if (redirectBormi(pageKod)) return

    const layoutKirish = kirishlar.find(
      (d) => d.isFile() && (d.name === 'layout.js' || d.name === 'layout.jsx'),
    )
    const layoutFayl = layoutKirish ? path.join(joriy, layoutKirish.name) : null
    const layoutKod = layoutFayl ? fs.readFileSync(layoutFayl, 'utf8') : ''

    const pageMeta = metadataBormi(pageKod)
    const layoutMeta = layoutKod ? metadataBormi(layoutKod) : false
    if (!pageMeta && !layoutMeta) return

    if (noindexBormi(pageKod) || (layoutKod && noindexBormi(layoutKod))) return

    const m = manzil(bolaklar)
    if (m === null) return

    const birinchiBolak = bolaklar.find((b) => !b.startsWith('('))
    if (birinchiBolak && YOPIQ_BOLIMLAR.has(birinchiBolak)) return

    const yol = m === '' ? '/' : m
    if (robotsTaqiqlaganmi(yol, disallowQoidalari)) return

    const metaKod = pageMeta ? pageKod : layoutKod
    if (canonicalBoshqami(metaKod, yol)) return

    const sanaFayllari = [pageFayl]
    if (layoutFayl) sanaFayllari.push(layoutFayl)
    if (bolaklar.length > 0) {
      for (const d of kirishlar) {
        if (!d.isFile() || !/\.(js|jsx)$/.test(d.name)) continue
        if (d.name === pageKirish.name || d.name === layoutKirish?.name) continue
        sanaFayllari.push(path.join(joriy, d.name))
      }
    }

    royxat.push({ yol, sana: engSonggiSana(sanaFayllari) })
  }

  yur(APP, [])

  // 1) Oliy kimyo fanlari: faqat holat === 'ochiq'
  const fanSahifa = path.join(APP, 'fan', '[slug]', 'page.js')
  const fanSana = engSonggiSana([fanSahifa, path.join(ROOT, 'lib', 'fanlar.js')])
  for (const fan of FANLAR) {
    if (fan.holat !== 'ochiq') continue
    const yol = `/fan/${fan.slug}`
    if (robotsTaqiqlaganmi(yol, disallowQoidalari)) continue
    royxat.push({ yol, sana: fanSana })
  }

  // 2) Maktab kimyosi: faqat ochiq === true sinflar va tayyor mavzular
  const sinfSana = engSonggiSana([
    path.join(APP, 'maktabkimyo', '[sinf]', 'page.js'),
    path.join(APP, 'maktabkimyo', '[sinf]', 'korinish.js'),
    path.join(ROOT, 'lib', 'fanlar.js'),
  ])
  const mavzuSana = engSonggiSana([
    path.join(APP, 'maktabkimyo', '[sinf]', '[mavzu]', 'page.js'),
    path.join(APP, 'maktabkimyo', '[sinf]', '[mavzu]', 'korinish.js'),
    path.join(ROOT, 'lib', 'fanlar.js'),
  ])

  for (const sinf of MAKTAB_SINFLARI) {
    if (sinf.ochiq !== true) continue
    const sinfYoli = sinfHavolasi(sinf)
    if (!robotsTaqiqlaganmi(sinfYoli, disallowQoidalari)) {
      royxat.push({ yol: sinfYoli, sana: sinfSana })
    }

    for (const mavzu of sinf.mavzular || []) {
      if (!mavzu?.slug || mavzu.ochiq === false) continue
      if (!mavzuTayyormi(sinf.sinf, mavzu.slug)) continue
      const mavzuYoli = mavzuHavolasi(sinf, mavzu)
      if (!robotsTaqiqlaganmi(mavzuYoli, disallowQoidalari)) {
        royxat.push({ yol: mavzuYoli, sana: mavzuSana })
      }
    }
  }

  const noyob = new Map()
  for (const r of royxat) {
    if (!noyob.has(r.yol)) {
      noyob.set(r.yol, r)
    }
  }

  const yakuniy = [...noyob.values()].sort((a, b) =>
    a.yol < b.yol ? -1 : a.yol > b.yol ? 1 : 0,
  )

  fs.writeFileSync(CHIQISH, JSON.stringify(yakuniy, null, 2) + '\n', 'utf8')
  console.log(`lib/sitemap-royxat.json — ${yakuniy.length} ta manzil yozildi`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
