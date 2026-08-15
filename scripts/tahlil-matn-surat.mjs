// scripts/tahlil-matn-surat.mjs
//
// ESKI monolit sahifadagi ilmiy matn YANGI sahifada ham borligini
// tekshiradi.
//
// NEGA KERAK. `tahlil-malumot-tekshir.js` ma'lumot to'liq ko'chganini
// isbotlaydi, lekin ma'lumot faylda turib, sahifada KO'RSATILMASLIGI
// mumkin: yangi ko'rinish biror maydonni chizishni unutgan bo'lsa,
// hech qanday xato chiqmaydi — matn shunchaki sahifada yo'q bo'ladi.
// Bunday yo'qotishni na build, na ko'z tutadi.
//
// USULI. Eski `page.js` dagi COMPOUND obyektining har bir MATNLI
// bargi olinadi va yangi sahifaning render qilingan HTML matnida
// qidiriladi. Topilmagani — yo'qolgan ma'lumot.
//
// NEGA BARGLAR, SAHIFA MATNI EMAS. Eski sahifani render qilib
// bo'lmaydi: u "use client", holat va hodisalarga tayanadi. Lekin
// mazmunning deyarli hammasi COMPOUND dan keladi, ya'ni barglar
// ro'yxati amalda sahifa mazmunining o'zi.
//
// Ishlatish:
//   node scripts/tahlil-matn-surat.mjs nmr
//
// Eski sahifalar allaqachon o'chirilgan bo'lsa, ularni git tarixidan
// oladi (ko'chirish tugagach ham tekshiruvni qayta yurgizish uchun):
//   node scripts/tahlil-matn-surat.mjs nmr --commit HEAD~1

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { transform } from 'sucrase'

const require = createRequire(import.meta.url)
const ILDIZ = process.cwd()

const asliyJs = require.extensions['.js']
require.extensions['.js'] = function (modul, fayl) {
  if (fayl.includes('node_modules')) return asliyJs(modul, fayl)
  const manba = readFileSync(fayl, 'utf8')
  const { code } = transform(manba, {
    transforms: ['jsx', 'imports'],
    jsxRuntime: 'automatic',
    filePath: fayl,
  })
  modul._compile(code, fayl)
}
require.extensions['.jsx'] = require.extensions['.js']

const Module = require('node:module')
const asliyResolve = Module._resolveFilename
Module._resolveFilename = function (soralgan, ...qolgan) {
  if (soralgan.startsWith('@/')) soralgan = path.join(ILDIZ, soralgan.slice(2))
  return asliyResolve.call(this, soralgan, ...qolgan)
}

require.cache[require.resolve('next/link')] = {
  id: 'next/link',
  filename: 'next/link',
  loaded: true,
  exports: {
    __esModule: true,
    default: ({ href, children, ...q }) =>
      require('react').createElement('a', { href, ...q }, children),
  },
}

const usul = process.argv[2]
if (!usul) {
  console.error('Ishlatish: node scripts/tahlil-matn-surat.mjs <usul> [--commit <ref>]')
  process.exit(1)
}

// Eski sahifalar o'chirilgach ham tekshiruvni qayta yurgizish
// mumkin bo'lsin: `--commit` berilsa fayllar git tarixidan olinadi.
const commitBelgisi = process.argv.indexOf('--commit')
const COMMIT = commitBelgisi !== -1 ? process.argv[commitBelgisi + 1] : null

function git(...arg) {
  return execFileSync('git', arg, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
}

/** Faylni ish daraxtidan yoki (COMMIT berilgan bo'lsa) git tarixidan o'qiydi. */
function faylniOqi(yol) {
  if (COMMIT) return git('show', `${COMMIT}:${yol}`)
  return readFileSync(yol, 'utf8')
}

/** Eski birikma papkalarining ro'yxati. */
function eskiSluglar(papka) {
  if (COMMIT) {
    // `-d` — faqat papkalar. Busiz ro'yxatga o'sha darajadagi
    // fayllar (masalan birikmalar/page.js) ham tushardi.
    const chiqish = git('ls-tree', '-d', '--name-only', `${COMMIT}:${papka}`)
    return chiqish.split('\n').filter(Boolean).sort()
  }
  return readdirSync(papka)
    .filter((d) => statSync(path.join(papka, d)).isDirectory())
    .sort()
}

/* ── Eski sahifadan COMPOUND ni olish ── */
function eskiCompound(sahifa) {
  const src = faylniOqi(sahifa)
  const i = src.indexOf('export default')
  const kod = src
    .slice(0, i)
    .replace(/^\s*["']use client["'];?\s*$/m, '')
    .replace(/^\s*import\s+[^\n]*$/gm, '')
  return new Function(`${kod}\n;return typeof COMPOUND !== "undefined" ? COMPOUND : null;`)()
}

/** Obyektdagi barcha matnli barglarni "yo'l → matn" ro'yxati qilib yig'adi. */
function matnliBarglar(qiymat, yol = '', natija = []) {
  if (typeof qiymat === 'string') {
    natija.push([yol, qiymat])
    return natija
  }
  if (typeof qiymat === 'number') {
    natija.push([yol, String(qiymat)])
    return natija
  }
  if (qiymat && typeof qiymat === 'object') {
    if (Array.isArray(qiymat)) {
      qiymat.forEach((x, i) => matnliBarglar(x, `${yol}[${i}]`, natija))
    } else {
      for (const k of Object.keys(qiymat)) {
        matnliBarglar(qiymat[k], yol ? `${yol}.${k}` : k, natija)
      }
    }
  }
  return natija
}

/**
 * Matnni solishtirish uchun normallashtiradi.
 *
 * HTML teglari olib tashlanadi (`<sub>` sahifada tegga aylanadi),
 * bo'shliqlar bir xillashtiriladi va tipografik belgilar oddiylashadi —
 * aks holda "—" va "–" farqi soxta yo'qotish ko'rsatardi.
 */
function normal(matn) {
  return String(matn)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/[\u2018\u2019\u02bc]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

const { renderToStaticMarkup } = require('react-dom/server')
const sahifaModuli = require(
  path.join(ILDIZ, 'app/ilmiy/tahlil/[usul]/birikmalar/[birikma]/page.js')
)
const Sahifa = sahifaModuli.default

// Git tarixida yo'l har doim "/" bilan yoziladi, shuning uchun
// path.join emas.
const eskiPapka = `app/ilmiy/tahlil/${usul}/birikmalar`
const sluglar = eskiSluglar(eskiPapka)

let jamiBarg = 0
let jamiYoqolgan = 0
const yoqolganlar = []

for (const slug of sluglar) {
  const sahifa = `${eskiPapka}/${slug}/page.js`
  if (!COMMIT && !existsSync(sahifa)) continue

  let compound
  try {
    compound = eskiCompound(sahifa)
  } catch {
    continue // papka bor, lekin page.js yo'q (masalan faqat components/)
  }
  const barglar = matnliBarglar(compound)

  const html = renderToStaticMarkup(
    await Sahifa({ params: Promise.resolve({ usul, birikma: slug }) })
  )
  const sahifaMatni = normal(html)

  const yoq = []
  for (const [yol, matn] of barglar) {
    const n = normal(matn)
    // Juda qisqa qiymatlar (raqam, bitta harf) tasodifan mos kelishi
    // mumkin — ular tekshiruvga hissa qo'shmaydi, shuning uchun
    // tashlanadi. Ma'noli matn 12 belgidan uzun bo'ladi.
    if (n.length < 12) continue
    jamiBarg++
    if (!sahifaMatni.includes(n)) {
      yoq.push([yol, n])
      jamiYoqolgan++
    }
  }

  if (yoq.length) {
    yoqolganlar.push([slug, yoq])
    console.log(`✗ ${slug.padEnd(22)} ${yoq.length} ta matn sahifada yo'q`)
  } else {
    console.log(`✓ ${slug.padEnd(22)} ${barglar.length} barg — hammasi sahifada`)
  }
}

console.log(`\n${jamiBarg} ta ma'noli matn tekshirildi, ${jamiYoqolgan} tasi yangi sahifada yo'q.`)

if (yoqolganlar.length) {
  console.log('\nYO\'QOLGAN MATNLAR (yo\'l bo\'yicha guruhlangan):\n')
  const yollarBoyicha = new Map()
  for (const [slug, yoq] of yoqolganlar) {
    for (const [yol, matn] of yoq) {
      // Massiv indekslarini birlashtiramiz: `nmrSignals[0].shift` va
      // `nmrSignals[1].shift` bitta muammo.
      const kalit = yol.replace(/\[\d+\]/g, '[]')
      if (!yollarBoyicha.has(kalit)) yollarBoyicha.set(kalit, [])
      yollarBoyicha.get(kalit).push([slug, matn])
    }
  }
  const tartib = [...yollarBoyicha].sort((a, b) => b[1].length - a[1].length)
  for (const [yol, holatlar] of tartib) {
    console.log(`  ${yol}  — ${holatlar.length} holat`)
    console.log(`      ${holatlar[0][0]}: ${holatlar[0][1].slice(0, 150)}`)
  }
  process.exit(1)
}

console.log("Yo'qotish yo'q.")
