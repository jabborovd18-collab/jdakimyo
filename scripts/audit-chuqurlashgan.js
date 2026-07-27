// scripts/audit-chuqurlashgan.js
//
// Chuqurlashgan bo'limidagi ichki havolalarni tekshiradi:
//   • qaysi havola mavjud bo'lmagan sahifaga ketadi (404)
//   • qaysi sahifaga hech kim havola qilmaydi (yetib bo'lmaydigan sahifa)
//
// Ishga tushirish: node scripts/audit-chuqurlashgan.js

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const APP = path.join(ROOT, 'app')
const BOLIM = path.join(APP, 'ilmiy', 'chuqurlashgan')

/** Ichma-ich barcha page.js fayllarini yig'adi. */
function sahifalar(dir, natija = []) {
  if (!fs.existsSync(dir)) return natija
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name)
    if (d.isDirectory()) sahifalar(p, natija)
    else if (d.name === 'page.js' || d.name === 'page.jsx') natija.push(p)
  }
  return natija
}

/** Fayl yo'lidan URL yo'lini chiqaradi: app/ilmiy/x/page.js -> /ilmiy/x */
const urlYoli = (fayl) =>
  '/' + path.relative(APP, path.dirname(fayl)).split(path.sep).join('/')

/**
 * Sahifa matnidan ichki havolalarni ajratadi.
 *
 * Havolalar ikki xil yozilgan: to'g'ridan-to'g'ri JSX'da (href="/...") va
 * ma'lumot massivida (href: "/..."), keyin href={s.href} bilan ishlatiladi.
 * Faqat birinchisini qidirsak, massiv orqali ulangan sahifalar "yetilmagan"
 * bo'lib ko'rinadi.
 */
function havolalar(matn) {
  const topilgan = new Set()

  // href="/..." , href={"/..."} va href: "/..."
  for (const m of matn.matchAll(/href\s*[:=]\s*\{?["'`](\/[^"'`{}\s]+)["'`]/g)) {
    topilgan.add(m[1])
  }
  // href={`/...${...}`} — dinamik qism bo'lsa, o'zgaruvchigacha bo'lgani
  for (const m of matn.matchAll(/href\s*[:=]\s*\{?`(\/[^`$]*)\$\{/g)) {
    topilgan.add(m[1] + '*')
  }

  return [...topilgan]
}

const barchaSahifalar = sahifalar(BOLIM)
const mavjudYollar = new Set(sahifalar(APP).map(urlYoli))

const buzuq = []
const havolaQilingan = new Set()

for (const fayl of barchaSahifalar) {
  const matn = fs.readFileSync(fayl, 'utf8')
  const manba = urlYoli(fayl)

  for (const h of havolalar(matn)) {
    // Dinamik havolalarni tekshirmaymiz — qiymat ish vaqtida ma'lum bo'ladi
    if (h.endsWith('*')) continue

    const toza = h.split('#')[0].split('?')[0].replace(/\/$/, '')
    if (!toza.startsWith('/ilmiy')) continue

    havolaQilingan.add(toza)
    if (!mavjudYollar.has(toza)) buzuq.push({ manba, havola: toza })
  }
}

// Bosh sahifadan boshlab yetib boradigan sahifalar
const bolimYollari = barchaSahifalar.map(urlYoli)
const yetilmagan = bolimYollari.filter(
  (y) => y !== '/ilmiy/chuqurlashgan' && !havolaQilingan.has(y)
)

// Bo'sh papkalar (page.js yo'q)
const boshPapkalar = fs
  .readdirSync(BOLIM, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((n) => sahifalar(path.join(BOLIM, n)).length === 0)

console.log(`Jami sahifa: ${barchaSahifalar.length}`)

console.log(`\n── Buzuq havolalar: ${buzuq.length} ──`)
const guruh = {}
for (const b of buzuq) (guruh[b.havola] ||= []).push(b.manba)
for (const [havola, manbalar] of Object.entries(guruh).sort()) {
  console.log(`  ${havola}`)
  console.log(`      ${manbalar.length} joydan: ${manbalar.slice(0, 3).join(', ')}${manbalar.length > 3 ? ' ...' : ''}`)
}

console.log(`\n── Hech kim havola qilmagan sahifalar: ${yetilmagan.length} ──`)
yetilmagan.sort().forEach((y) => console.log(`  ${y}`))

console.log(`\n── Sahifasi yo'q bo'sh papkalar: ${boshPapkalar.length} ──`)
boshPapkalar.forEach((n) => console.log(`  ${n}`))
