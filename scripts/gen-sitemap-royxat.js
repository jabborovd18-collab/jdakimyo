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
const { execFileSync } = require('child_process')
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
  // Shaxsiy yozishma: sarlavhasi bor (brauzer yorlig'i uchun), lekin
  // qidiruvga chiqmaydi
  'chat',
  'hamkorlar',
  'sertifikat',
])

/** Fayl o'z metadata'sini eksport qiladimi. */
function metadataBormi(kod) {
  return /export\s+(const\s+metadata\b|async\s+function\s+generateMetadata\b)/.test(kod)
}

/**
 * Sahifa canonical bilan BOSHQA manzilga yo'naltirganmi.
 *
 * Takroriy birikma sahifalari shunday: o'zi turadi, lekin qidiruv
 * tizimiga "asosiy nusxa u yerda" deydi. Bunday manzilni sitemapga
 * qo'yish qarama-qarshi ishora bo'lardi.
 *
 * MUHIM FARQ: canonical o'ziga qaratilgan bo'lsa — bu takrorlanish
 * belgisi emas, aksincha to'g'ri yozilgan sahifa. Ilgari bu funksiya
 * canonical borligining O'ZIGA qarab tashlab yuborardi va o'ziga
 * canonical qo'ygan sahifa sitemapga umuman tushmasdi. Endi qiymat
 * o'qiladi va sahifaning o'z manzili bilan solishtiriladi.
 *
 * @param {string} kod   sahifa fayli
 * @param {string} ozYol sahifaning manzili ('/ishlashi')
 */
function canonicalBoshqami(kod, ozYol) {
  const m = /canonical:\s*['"`]([^'"`]+)['"`]/.exec(kod)
  if (!m) {
    // Canonical bor, lekin qiymati satr emas (o'zgaruvchi yoki shablon).
    // Bunda aniqlay olmaymiz — ehtiyot yuzasidan chetda qoldiramiz.
    return /alternates:\s*\{\s*canonical:/.test(kod)
  }

  const qiymat = m[1].replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '') || '/'
  return qiymat !== (ozYol || '/')
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

/**
 * Sahifa oxirgi marta qachon o'zgargani — git tarixidan.
 *
 * NEGA KERAK. Sitemap ilgari HAR BIR manzilga `lastModified: hozir` deb
 * yozardi, ya'ni Google har safar so'raganda "hamma 600 sahifa hozirgina
 * o'zgardi" degan javob olardi. Bu yolg'on signal: Google bir necha marta
 * tekshirib ko'radi, o'zgarish topmaydi va shundan keyin `lastmod` ni
 * BUTUNLAY e'tiborsiz qoldiradi. Natijada haqiqatan yangilangan sahifa
 * ham navbatda turaveradi.
 *
 * Git sanasi — sahifa matni oxirgi marta o'zgargan kun. Uni o'ylab
 * topish shart emas, u allaqachon tarixda yozilgan.
 *
 * Git javob bermasa (masalan repo nusxasi tarixsiz klonlangan bo'lsa)
 * `null` qaytadi va sitemap o'sha manzil uchun yig'ilish sanasini
 * ishlatadi — bu xato emas, shunchaki aniqroq ma'lumot yo'q.
 */
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

    const m = manzil(bolaklar)
    if (m === null) continue
    if (YOPIQ_BOLIMLAR.has(bolaklar.find((b) => !b.startsWith('(')))) continue

    const yol = m === '' ? '/' : m
    if (canonicalBoshqami(kod, yol)) continue

    // Sahifaning o'zi bilan bir qatorda ko'rinish fayli ham hisobga
    // olinadi: matnning katta qismi `korinish.js` da yashaydi va
    // ko'pincha faqat o'sha o'zgaradi.
    const papka = path.dirname(toliq)
    const sanalar = [oxirgiOzgarish(toliq)]
    for (const qoshni of ['korinish.js', 'korinish.jsx', 'malumot.js']) {
      const q = path.join(papka, qoshni)
      if (fs.existsSync(q)) sanalar.push(oxirgiOzgarish(q))
    }
    const sana = sanalar.filter(Boolean).sort().pop() || null

    royxat.push({ yol, sana })
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
  if (fan.holat !== 'ochiq') continue
  const fayl = path.join(APP, 'fan', '[slug]', 'page.js')
  royxat.push({ yol: `/fan/${fan.slug}`, sana: oxirgiOzgarish(fayl) })
}

royxat.sort((a, b) => (a.yol < b.yol ? -1 : a.yol > b.yol ? 1 : 0))

fs.writeFileSync(CHIQISH, JSON.stringify(royxat, null, 2) + '\n', 'utf8')
console.log(`lib/sitemap-royxat.json — ${royxat.length} ta manzil yozildi`)
