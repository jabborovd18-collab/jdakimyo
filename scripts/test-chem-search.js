/**
 * lib/chem-search.js uchun test.
 *
 * Ishga tushirish: node scripts/test-chem-search.js
 *
 * Eslatma: lib/chem-search.js ESM sintaksisida (Next.js uni o'zi kompilyatsiya
 * qiladi), loyihaning package.json'i esa CommonJS. Shuning uchun testda
 * vaqtinchalik .cjs nusxaga aylantirib yuklaymiz.
 */
const fs = require('fs')
const os = require('os')
const path = require('path')

function loadModule() {
  const source = fs
    .readFileSync(path.join(__dirname, '..', 'lib', 'chem-search.js'), 'utf8')
    .replace(/export\s+function\s+/g, 'function ')
    .replace(/export\s+const\s+/g, 'const ')

  const withExports =
    source +
    '\nmodule.exports = { normalizeChemText, compactChemText, buildSearchIndex, normalizeQuery };\n'

  const tempFile = path.join(os.tmpdir(), `chem-search-test-${Date.now()}.cjs`)
  fs.writeFileSync(tempFile, withExports, 'utf8')
  try {
    return require(tempFile)
  } finally {
    fs.unlinkSync(tempFile)
  }
}

const { normalizeChemText, compactChemText, normalizeQuery } = loadModule()

let passed = 0
let failed = 0

function check(label, actual, expected) {
  const ok = actual === expected
  if (ok) passed++
  else failed++
  console.log(
    `${ok ? 'OK  ' : 'XATO'} ${label.padEnd(46)} ${JSON.stringify(actual)}` +
      (ok ? '' : `   (kutilgan: ${JSON.stringify(expected)})`),
  )
}

/** Foydalanuvchi so'rovi formulani topa oladimi? */
function matches(storedFormula, userQuery) {
  const stored = {
    text: normalizeChemText(storedFormula),
    compact: compactChemText(storedFormula),
  }
  const q = normalizeQuery(userQuery)
  return stored.text.includes(q.text) || stored.compact.includes(q.compact)
}

function checkMatch(storedFormula, userQuery, expected) {
  const actual = matches(storedFormula, userQuery)
  const ok = actual === expected
  if (ok) passed++
  else failed++
  console.log(
    `${ok ? 'OK  ' : 'XATO'} "${userQuery}" -> "${storedFormula}"`.padEnd(58) +
      (actual ? 'TOPILDI' : 'topilmadi') +
      (ok ? '' : '   <-- KUTILGANI BOSHQA'),
  )
}

console.log('=== Normalizatsiya ===')
check('pastki indeks', normalizeChemText('H₂SO₄'), 'h2so4')
check('yuqori indeks + zaryad', normalizeChemText('[Co(NH₃)₆]³⁺'), '[co(nh3)6]3+')
check('manfiy zaryad', normalizeChemText('[Fe(CN)₆]⁴⁻'), '[fe(cn)6]4-')
check('strelka', normalizeChemText('A → B'), 'a -> b')
check('qaytar strelka', normalizeChemText('A ⇌ B'), 'a <-> b')
check('gidrat nuqtasi', normalizeChemText('CuSO₄·5H₂O'), 'cuso4*5h2o')
check('ortiqcha bo\'shliq', normalizeChemText('  H₂   +   O₂  '), 'h2 + o2')
check('zich ko\'rinish', compactChemText('H₂SO₄ + 2NaOH'), 'h2so4+2naoh')
check('zich: qavslar olinadi', compactChemText('[Co(NH₃)₆]³⁺'), 'conh363+')

console.log('\n=== Foydalanuvchi qidiruvi (klaviaturada indeks yo\'q) ===')
checkMatch('H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', 'H2', true)
checkMatch('H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', 'h2so4', true)
checkMatch('H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', 'H2SO4', true)
checkMatch('H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', 'NaOH', true)
checkMatch('H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', 'na2so4', true)
checkMatch('H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', 'H₂SO₄', true)
checkMatch('H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', 'KMnO4', false)

console.log('\n=== Kompleks birikmalar ===')
checkMatch('[Co(NH₃)₆]³⁺', 'Co(NH3)6', true)
checkMatch('[Co(NH₃)₆]³⁺', 'co nh3 6', true)
checkMatch('[Co(NH₃)₆]³⁺', 'NH3', true)
checkMatch('[Fe(CN)₆]⁴⁻', 'fe(cn)6', true)
checkMatch('[Cu(H₂O)₄]²⁺', 'H2O', true)
checkMatch('[Ni(CO)₄]', 'ni(co)4', true)

console.log('\n=== Strelka variantlari ===')
checkMatch('2H₂ + O₂ → 2H₂O', 'h2+o2', true)
checkMatch('2H₂ + O₂ → 2H₂O', 'H2 + O2 -> H2O', false) // koeffitsientlar boshqacha

console.log('\n=== Noto\'g\'ri moslik BO\'LMASLIGI kerak ===')
// "H₂ + O₂" dan "H₂O₂" (vodorod peroksid) kelib chiqmasligi shart
checkMatch('2H₂ + O₂ → 2H₂O', 'H2O2', false)
checkMatch('H₂SO₄', 'H2SO3', false)

console.log(`\nNatija: ${passed} ta o'tdi, ${failed} ta xato`)
process.exit(failed ? 1 : 0)
