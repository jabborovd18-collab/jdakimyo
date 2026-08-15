// scripts/tahlil-malumot-ajrat.js
//
// Eski monolit tahlil sahifasidan `COMPOUND` obyektini AJRATIB olib,
// `data/ilmiy/tahlil/<usul>/<slug>.js` fayliga yozadi.
//
// NEGA SKRIPT, QO'LDA EMAS. Bitta YaMR sahifasida 400–500 qator ilmiy
// ma'lumot bor, 12 sahifada esa ~5 400 qator. Qo'lda ko'chirilganda
// bitta tashlab ketilgan maydon na build'da, na ko'z bilan tutiladi —
// u shunchaki sahifadan yo'qoladi va buni oylab hech kim sezmaydi.
// Skript esa obyektni HAQIQATAN ishga tushirib oladi: yo hammasi
// ko'chadi, yo xato beradi.
//
// NEGA `eval` (aniqrog'i `new Function`). Matnni regex bilan kesish
// mumkin emas: ma'lumot ichida jingalak qavs, apostrof va shablon
// satrlari bor ("O'zbek", `${x}`). Yagona ishonchli tahlilchi —
// JavaScript dvigatelining o'zi. Fayl ishonchli manba (o'z
// repozitoriyamiz), shuning uchun bu yerda xavf yo'q.
//
// Ishlatish:
//   node scripts/tahlil-malumot-ajrat.js nmr
//   node scripts/tahlil-malumot-ajrat.js nmr --quruq   (yozmaydi, ko'rsatadi)

const fs = require('fs')
const path = require('path')

const usul = process.argv[2]
const quruq = process.argv.includes('--quruq')

if (!usul) {
  console.error("Ishlatish: node scripts/tahlil-malumot-ajrat.js <usul> [--quruq]")
  process.exit(1)
}

const manba = path.join('app', 'ilmiy', 'tahlil', usul, 'birikmalar')
const chiqish = path.join('data', 'ilmiy', 'tahlil', usul)

if (!fs.existsSync(manba)) {
  console.error(`Topilmadi: ${manba}`)
  process.exit(1)
}

/**
 * Sahifa matnidan `export default` gacha bo'lgan qismni oladi.
 *
 * Nega aynan shu chegara: barcha ma'lumot komponentdan OLDIN e'lon
 * qilingan (12 sahifaning hammasida tekshirildi). Komponentning o'zi
 * JSX bo'lgani uchun uni Node tushunmaydi — shuning uchun kesiladi.
 */
function malumotQismi(src) {
  const i = src.indexOf('export default')
  if (i === -1) throw new Error("`export default` topilmadi")
  return src.slice(0, i)
}

/**
 * Kodni ishga tushirib, `COMPOUND` obyektini qaytaradi.
 *
 * Import qatorlari olib tashlanadi: ular brauzer uchun kerak, ma'lumot
 * uchun emas. `"use client"` ham shunday.
 */
function compoundniOl(kod) {
  const tozalangan = kod
    .replace(/^\s*["']use client["'];?\s*$/m, '')
    .replace(/^\s*import\s+[^\n]*$/gm, '')

  // Nega `return typeof COMPOUND ...`: ba'zi sahifalarda obyekt
  // `const COMPOUND` bilan, ba'zilarida keyin `COMPOUND.x = {...}`
  // bilan to'ldiriladi. Ikkalasi ham shu nuqtada tayyor bo'ladi.
  const fn = new Function(`${tozalangan}\n;return typeof COMPOUND !== "undefined" ? COMPOUND : null;`)
  return fn()
}

/**
 * Obyektni o'qiladigan JS manba matniga aylantiradi.
 *
 * Nega `JSON.stringify` emas: u apostrof va Unicode'ni qochiradi,
 * natijada "O'zbek" o'qib bo'lmaydigan holga keladi va faylni keyin
 * qo'lda tahrirlash azobga aylanadi. Bu yerda satrlar qo'shtirnoq
 * ichida, faqat zarur belgilar qochiriladi.
 */
function jsGa(qiymat, chuqurlik = 0) {
  const bosh = '  '.repeat(chuqurlik)
  const ich = '  '.repeat(chuqurlik + 1)

  if (qiymat === null) return 'null'
  if (qiymat === undefined) return 'undefined'
  if (typeof qiymat === 'number' || typeof qiymat === 'boolean') return String(qiymat)

  if (typeof qiymat === 'string') {
    const q = qiymat.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
    return `"${q}"`
  }

  if (Array.isArray(qiymat)) {
    if (qiymat.length === 0) return '[]'
    // Sonlardan iborat qisqa massiv bir qatorda qolsin — jadval
    // qiymatlari (masalan xarakterlar jadvali) shunda o'qiladi.
    const hammasiSon = qiymat.every((x) => typeof x === 'number')
    if (hammasiSon && qiymat.length <= 12) return `[${qiymat.join(', ')}]`
    const bandlar = qiymat.map((x) => ich + jsGa(x, chuqurlik + 1))
    return `[\n${bandlar.join(',\n')},\n${bosh}]`
  }

  const kalitlar = Object.keys(qiymat)
  if (kalitlar.length === 0) return '{}'
  const bandlar = kalitlar.map((k) => {
    // Yaroqli identifikator bo'lsa tirnoqsiz — fayl toza ko'rinadi.
    const kalit = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : `"${k}"`
    return `${ich}${kalit}: ${jsGa(qiymat[k], chuqurlik + 1)}`
  })
  return `{\n${bandlar.join(',\n')},\n${bosh}}`
}

/** Sahifa boshidagi izoh blokini (manbalar ro'yxati) saqlab qoladi. */
function sarlavhaIzohi(src) {
  const qatorlar = src.split('\n')
  const yigilgan = []
  for (const q of qatorlar) {
    const t = q.trim()
    if (t === '' || t === '"use client"' || t.startsWith('import ')) continue
    if (t.startsWith('//')) { yigilgan.push(q); continue }
    break
  }
  return yigilgan.join('\n')
}

const sluglar = fs
  .readdirSync(manba)
  .filter((d) => fs.statSync(path.join(manba, d)).isDirectory())
  .sort()

if (!quruq) fs.mkdirSync(chiqish, { recursive: true })

let jamiKalit = 0
const hisobot = []

for (const slug of sluglar) {
  const sahifa = path.join(manba, slug, 'page.js')
  if (!fs.existsSync(sahifa)) continue

  const src = fs.readFileSync(sahifa, 'utf8')
  let compound
  try {
    compound = compoundniOl(malumotQismi(src))
  } catch (e) {
    console.error(`✗ ${slug}: ${e.message}`)
    process.exitCode = 1
    continue
  }
  if (!compound) {
    console.error(`✗ ${slug}: COMPOUND topilmadi`)
    process.exitCode = 1
    continue
  }

  const kalitlar = Object.keys(compound)
  jamiKalit += kalitlar.length

  const izoh = sarlavhaIzohi(src)
  const matn =
    `${izoh ? izoh + '\n' : ''}//\n` +
    `// Bu fayl eski monolit sahifadan avtomatik ajratilgan:\n` +
    `//   app/ilmiy/tahlil/${usul}/birikmalar/${slug}/page.js\n` +
    `// Ma'lumot ko'rinishdan ajratildi — endi uni bitta joyda tuzatish\n` +
    `// kifoya va u boshqa tahlil usullariga ham ulanadi.\n` +
    `//\n` +
    `// Bu yerda JSX ham, rang ham, className ham YO'Q — faqat kimyo.\n\n` +
    `export const malumot = ${jsGa(compound, 0)}\n\n` +
    `export default malumot\n`

  const chiqishFayl = path.join(chiqish, `${slug}.js`)
  if (quruq) {
    console.log(`· ${slug.padEnd(22)} ${String(kalitlar.length).padStart(3)} kalit  →  ${chiqishFayl}`)
  } else {
    fs.writeFileSync(chiqishFayl, matn, 'utf8')
    const qator = matn.split('\n').length
    console.log(`✓ ${slug.padEnd(22)} ${String(kalitlar.length).padStart(3)} kalit  ${String(qator).padStart(5)} qator`)
  }
  hisobot.push({ slug, kalitlar })
}

console.log(`\n${hisobot.length} ta birikma, jami ${jamiKalit} ta yuqori darajali kalit.`)

// Qaysi kalit qaysi sahifada bor — sxemani ko'rish uchun.
const barcha = new Map()
for (const { slug, kalitlar } of hisobot) {
  for (const k of kalitlar) barcha.set(k, (barcha.get(k) || 0) + 1)
}
const n = hisobot.length
const hammada = [...barcha].filter(([, v]) => v === n).map(([k]) => k)
const qisman = [...barcha].filter(([, v]) => v < n).sort((a, b) => b[1] - a[1])

console.log(`\nHamma ${n} sahifada bor (${hammada.length}): ${hammada.join(', ')}`)
console.log(`\nQisman (boyitish kerak bo'lishi mumkin):`)
for (const [k, v] of qisman) console.log(`  ${String(v).padStart(2)}/${n}  ${k}`)
