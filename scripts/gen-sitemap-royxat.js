// scripts/gen-sitemap-royxat.js
//
// Sitemap uchun indekslanadigan sahifalar ro'yxatini yig'adi va
// lib/sitemap-royxat.json ga yozadi.
//
// NEGA SHU SHART. Sitemap qo'lda 15 ta bo'lim sanardi, saytda esa 600 dan
// ortiq sahifa bor — chuqurdagilariga Google oylab yetib bormasligi mumkin.
// Lekin hammasini sanab tashlash ham noto'g'ri: sarlavhasi yo'q sahifa
// qidiruv tizimiga "JDA KIMYO — Kompleks birikmalar kimyosi" degan o'sha
// bitta nom bilan boradi va takroriy hujjat muammosini kuchaytiradi.
//
// Shuning uchun mezon bitta: sahifa O'Z metadata'siga ega bo'lsa,
// ro'yxatga tushadi. Bu o'z-o'zini boqadigan qoida — yangi sahifaga
// sarlavha yozilishi bilan u sitemapda ham paydo bo'ladi, alohida
// eslab qolish shart emas.
//
// Sarlavha qo'shgandan keyin ishga tushiring:
//   node scripts/gen-sitemap-royxat.js

const fs = require('fs')
const path = require('path')
const esmRequire = require('./_esm-require')

const ROOT = path.join(__dirname, '..')
const APP = path.join(ROOT, 'app')
const CHIQISH = path.join(ROOT, 'lib', 'sitemap-royxat.json')

// Shaxsiy yoki xizmat bo'limlari — bularda sarlavha bo'lsa ham
// qidiruv tizimiga chiqmasligi kerak.
const YOPIQ_BOLIMLAR = new Set([
  'admin',
  'api',
  'profil',
  'ustoz',
  'ustoz-profil',
  'kochat',
  'hamkorlar',
  'sertifikat',
])

/** Fayl o'z metadata'sini eksport qiladimi. */
function metadataBormi(kod) {
  return /export\s+(const\s+metadata\b|async\s+function\s+generateMetadata\b)/.test(kod)
}

/**
 * Sahifa canonical bilan boshqa manzilga yo'naltirganmi.
 * Takroriy birikma sahifalari shunday: o'zi turadi, lekin qidiruv
 * tizimiga "asosiy nusxa u yerda" deydi. Bunday manzilni sitemapga
 * qo'yish qarama-qarshi ishora bo'lardi.
 */
function canonicalBoshqami(kod) {
  return /alternates:\s*\{\s*canonical:/.test(kod)
}

/**
 * Yo'l bo'laklarini manzilga aylantiradi.
 * Qavsli papkalar ((auth) kabi) manzilda ko'rinmaydi — Next.js qoidasi.
 * Dinamik bo'lak ([id]) uchraydigan yo'l umuman qaytarilmaydi: uning
 * aniq qiymatlari bu yerdan bilinmaydi.
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

const royxat = []

function yur(joriy, bolaklar) {
  for (const d of fs.readdirSync(joriy, { withFileTypes: true })) {
    const toliq = path.join(joriy, d.name)

    if (d.isDirectory()) {
      yur(toliq, [...bolaklar, d.name])
      continue
    }

    if (d.name !== 'page.js' && d.name !== 'page.jsx') continue

    const kod = fs.readFileSync(toliq, 'utf8')
    if (!metadataBormi(kod)) continue
    if (canonicalBoshqami(kod)) continue

    const m = manzil(bolaklar)
    if (m === null) continue
    if (YOPIQ_BOLIMLAR.has(bolaklar.find((b) => !b.startsWith('(')))) continue

    royxat.push(m === '' ? '/' : m)
  }
}

yur(APP, [])

/**
 * Dinamik marshrutlar.
 *
 * `manzil()` `[slug]` uchraydigan yo'lni tashlab yuboradi — to'g'ri qaror,
 * chunki qiymatlar fayl tizimida yo'q. Lekin `/fan/[slug]` ning qiymatlari
 * MA'LUM: ular `lib/fanlar.js` dagi ro'yxatdan keladi va sahifa
 * `generateMetadata` bilan o'z sarlavhasini beradi. Ya'ni bu sahifalar
 * ro'yxatga tushishi kerak, aks holda platformaning yangi kirish nuqtasi
 * sitemapda umuman ko'rinmay qolardi.
 *
 * Faqat OCHIQ fanlar: yopig'ining marshruti yo'q (`dynamicParams = false`)
 * va u 404 qaytaradi.
 */
const { FANLAR } = esmRequire('lib/fanlar.js', ['FANLAR'])
for (const fan of FANLAR) {
  if (fan.holat === 'ochiq') royxat.push(`/fan/${fan.slug}`)
}

royxat.sort()

fs.writeFileSync(CHIQISH, JSON.stringify(royxat, null, 2) + '\n', 'utf8')
console.log(`lib/sitemap-royxat.json — ${royxat.length} ta manzil yozildi`)
