/**
 * element-analiz bo'limidagi raqamlarni tekshirish.
 *
 * Ikki xil tekshiruv:
 *   1) Ichki izchillik — e'lon qilingan nazariy % element soni va M dan
 *      hisoblangan qiymatga mos keladimi?
 *   2) Molyar massa — formuladagi atomlardan hisoblangan M ga mos keladimi?
 *
 * Ishga tushirish: node scripts/check-element-analiz.js
 */
const fs = require('fs')
const os = require('os')
const path = require('path')

// IUPAC 2021 atom massalari
const A = {
  H: 1.008, C: 12.011, N: 14.007, O: 15.999, S: 32.06,
  Cl: 35.45, K: 39.0983, Fe: 55.845, Co: 58.933, Ni: 58.693,
  Cu: 63.546, Zn: 65.38, Ru: 101.07, Pt: 195.084,
}

/** Har bir birikmaning to'liq atom tarkibi — formuladan qo'lda yozilgan */
const COMPOSITION = {
  'k4-fe-cn6-3h2o':   { K: 4, Fe: 1, C: 6, N: 6, O: 3, H: 6 },      // K₄[Fe(CN)₆]·3H₂O
  'k3-fe-cn6':        { K: 3, Fe: 1, C: 6, N: 6 },                   // K₃[Fe(CN)₆]
  'fe-h2o6-so4':      { Fe: 1, O: 10, H: 12, S: 1 },                 // [Fe(H₂O)₆]SO₄
  'cu-nh3-4-so4-h2o': { Cu: 1, N: 4, H: 14, S: 1, O: 5 },            // [Cu(NH₃)₄]SO₄·H₂O
  'co-nh3-6-cl3':     { Co: 1, N: 6, H: 18, Cl: 3 },                 // [Co(NH₃)₆]Cl₃
  'ni-en3-cl2':       { Ni: 1, C: 6, H: 24, N: 6, Cl: 2 },           // [Ni(en)₃]Cl₂
  'sisplatin':        { Pt: 1, N: 2, H: 6, Cl: 2 },                  // Pt(NH₃)₂Cl₂
  'ferrosen':         { Fe: 1, C: 10, H: 10 },                       // Fe(C₅H₅)₂
  'k2-ptcl4':         { K: 2, Pt: 1, Cl: 4 },                        // K₂[PtCl₄]
  'ni-co-4':          { Ni: 1, C: 4, O: 4 },                         // Ni(CO)₄
  'ru-bipy3':         { Ru: 1, C: 30, H: 36, N: 6, Cl: 2, O: 6 },    // [Ru(bipy)₃]Cl₂·6H₂O
  'cu-cn-4':          { K: 3, Cu: 1, C: 4, N: 4 },                   // K₃[Cu(CN)₄]
}

function molarMass(composition) {
  return Object.entries(composition).reduce(
    (sum, [element, count]) => sum + A[element] * count,
    0,
  )
}

/** Katalog faylidan birikmalar massivini o'qish */
function loadCatalog() {
  const file = path.join(
    __dirname, '..', 'app', 'ilmiy', 'tahlil', 'element-analiz', 'birikmalar', 'page.js',
  )
  const source = fs.readFileSync(file, 'utf8')

  const start = source.indexOf('const birikmalar = [')
  const end = source.indexOf('\n]', start)
  if (start === -1 || end === -1) throw new Error('birikmalar massivi topilmadi')

  const snippet = source.slice(start, end + 2).replace('const birikmalar =', 'module.exports =')

  const tempFile = path.join(os.tmpdir(), `ea-check-${Date.now()}.cjs`)
  fs.writeFileSync(tempFile, snippet, 'utf8')
  try {
    return require(tempFile)
  } finally {
    fs.unlinkSync(tempFile)
  }
}

const catalog = loadCatalog()
console.log(`Katalogda ${catalog.length} ta birikma\n`)

let problems = 0

// ─── 1) Ichki izchillik ───
console.log('═══ 1. Nazariy % element soni va M ga mos keladimi? ═══')
for (const item of catalog) {
  const issues = []
  for (const element of ['C', 'H', 'N']) {
    const count = item.elements[element] ?? 0
    const expected = (count * A[element] / item.M) * 100
    const declared = item.theoretical[element]
    if (Math.abs(expected - declared) > 0.05) {
      issues.push(`${element}: e'lon ${declared}% ≠ hisob ${expected.toFixed(2)}%`)
    }
  }
  if (issues.length) {
    problems++
    console.log(`  ✗ ${item.formula.padEnd(24)} ${issues.join(' | ')}`)
  }
}
if (problems === 0) console.log('  ✓ Barchasi izchil\n')
else console.log('')

// ─── 2) Molyar massa ───
console.log('═══ 2. Molyar massa formuladagi atomlarga mos keladimi? ═══')
let massProblems = 0
for (const item of catalog) {
  const composition = COMPOSITION[item.id]
  if (!composition) {
    console.log(`  ? ${item.formula} — tarkibi skriptda yo'q`)
    continue
  }
  const computed = molarMass(composition)
  const diff = Math.abs(computed - item.M)
  if (diff > 0.5) {
    massProblems++
    console.log(
      `  ✗ ${item.formula.padEnd(24)} e'lon M=${item.M}  ≠  hisob M=${computed.toFixed(2)}  (farq ${diff.toFixed(2)})`,
    )
    // To'g'ri M bilan foizlar qanday bo'lardi
    const corrected = ['C', 'H', 'N']
      .map((e) => {
        const count = item.elements[e] ?? 0
        return `${e}=${((count * A[e] / computed) * 100).toFixed(2)}%`
      })
      .join('  ')
    console.log(`      to'g'ri M bilan:  ${corrected}`)
  }
}
if (massProblems === 0) console.log('  ✓ Barchasi to\'g\'ri')

console.log(`\nJami muammo: ${problems + massProblems}`)
process.exit(problems + massProblems > 0 ? 1 : 0)
