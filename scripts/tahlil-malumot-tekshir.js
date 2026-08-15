// scripts/tahlil-malumot-tekshir.js
//
// Ajratilgan ma'lumot eski sahifadagi ma'lumot bilan BIR XIL ekanini
// isbotlaydi.
//
// NEGA KERAK. Ko'chirishda eng katta xavf — jimgina yo'qolgan maydon.
// U xato bermaydi, build'ni to'xtatmaydi: sahifadan bitta ilmiy
// paragraf shunchaki g'oyib bo'ladi va buni oylab hech kim sezmaydi.
// Bu skript ikkala manbani chuqur solishtiradi va farqni ko'rsatadi.
//
// NEGA MATN EMAS, TUZILMA. Faylni satrma-satr solishtirish foydasiz —
// formatlash o'zgargan. Bu yerda obyektning har bir bargigacha yo'li
// ("crystalField.racahParameter") va qiymati solishtiriladi.
//
// Ishlatish:
//   node scripts/tahlil-malumot-tekshir.js nmr

const fs = require('fs')
const path = require('path')

const usul = process.argv[2]
if (!usul) {
  console.error("Ishlatish: node scripts/tahlil-malumot-tekshir.js <usul>")
  process.exit(1)
}

const manba = path.join('app', 'ilmiy', 'tahlil', usul, 'birikmalar')
const yangi = path.join('data', 'ilmiy', 'tahlil', usul)

function malumotQismi(src) {
  const i = src.indexOf('export default')
  if (i === -1) throw new Error("`export default` topilmadi")
  return src.slice(0, i)
}

function compoundniOl(kod) {
  const tozalangan = kod
    .replace(/^\s*["']use client["'];?\s*$/m, '')
    .replace(/^\s*import\s+[^\n]*$/gm, '')
  const fn = new Function(`${tozalangan}\n;return typeof COMPOUND !== "undefined" ? COMPOUND : null;`)
  return fn()
}

/** Obyektni "yo'l → qiymat" tekis xaritasiga yoyadi. */
function yoyish(qiymat, yol = '', xarita = new Map()) {
  if (qiymat === null || typeof qiymat !== 'object') {
    xarita.set(yol, qiymat)
    return xarita
  }
  if (Array.isArray(qiymat)) {
    qiymat.forEach((x, i) => yoyish(x, `${yol}[${i}]`, xarita))
    return xarita
  }
  for (const k of Object.keys(qiymat)) {
    yoyish(qiymat[k], yol ? `${yol}.${k}` : k, xarita)
  }
  return xarita
}

const sluglar = fs
  .readdirSync(manba)
  .filter((d) => fs.statSync(path.join(manba, d)).isDirectory())
  .sort()

let xato = 0
let jamiBarg = 0

for (const slug of sluglar) {
  const sahifa = path.join(manba, slug, 'page.js')
  const dataFayl = path.join(yangi, `${slug}.js`)
  if (!fs.existsSync(sahifa)) continue

  if (!fs.existsSync(dataFayl)) {
    console.error(`✗ ${slug}: ${dataFayl} yo'q`)
    xato++
    continue
  }

  const eski = compoundniOl(malumotQismi(fs.readFileSync(sahifa, 'utf8')))

  // Ajratilgan fayl ESM — uni CommonJS ichida o'qish uchun
  // `export const malumot =` ni oddiy e'longa aylantiramiz.
  const dataSrc = fs
    .readFileSync(dataFayl, 'utf8')
    .replace(/^export const malumot =/m, 'const malumot =')
    .replace(/^export default malumot\s*$/m, '')
  const yangiObj = new Function(`${dataSrc}\n;return malumot;`)()

  const a = yoyish(eski)
  const b = yoyish(yangiObj)
  jamiBarg += a.size

  const yoqolgan = []
  const farqli = []
  for (const [yol, qiymat] of a) {
    if (!b.has(yol)) { yoqolgan.push(yol); continue }
    const yangiQiymat = b.get(yol)
    if (String(qiymat) !== String(yangiQiymat)) farqli.push(yol)
  }
  const ortiqcha = [...b.keys()].filter((k) => !a.has(k))

  if (yoqolgan.length || farqli.length || ortiqcha.length) {
    xato++
    console.error(`✗ ${slug}`)
    for (const y of yoqolgan.slice(0, 10)) console.error(`    YO'QOLGAN: ${y}`)
    for (const y of farqli.slice(0, 10)) {
      console.error(`    FARQLI:   ${y}`)
      console.error(`      eski:   ${String(a.get(y)).slice(0, 120)}`)
      console.error(`      yangi:  ${String(b.get(y)).slice(0, 120)}`)
    }
    for (const y of ortiqcha.slice(0, 10)) console.error(`    ORTIQCHA: ${y}`)
  } else {
    console.log(`✓ ${slug.padEnd(22)} ${String(a.size).padStart(4)} barg — bir xil`)
  }
}

console.log(`\n${sluglar.length} ta birikma, ${jamiBarg} ta barg tekshirildi.`)
if (xato) {
  console.error(`\n${xato} ta birikmada farq bor.`)
  process.exit(1)
}
console.log('Farq yo\'q — ma\'lumot to\'liq ko\'chgan.')
