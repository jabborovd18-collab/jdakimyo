/**
 * lib/chem-balance.js uchun test.
 *
 * Ishga tushirish: node scripts/test-chem-balance.js
 *
 * Sinov misollari ikki xil: to'g'ri yozilgan tenglamalar (o'tishi kerak) va
 * ATAYLAB buzilgan tenglamalar (tutilishi kerak). Ikkinchisi muhimroq —
 * tekshiruvchining o'zi buzuq bo'lsa, hammasini "muvozanatli" deb o'tkazib
 * yuboradi va biz buni sezmaymiz.
 */
const esmRequire = require('./_esm-require')

const { balansTekshir, balansIzohi, azoniOqi } = esmRequire('lib/chem-balance.js', [
  'balansTekshir',
  'balansIzohi',
  'azoniOqi',
  'BalansXatosi',
])

let otdi = 0
let yiqildi = 0

function tekshir(nom, shart, izoh = '') {
  if (shart) {
    otdi++
    console.log(`OK   ${nom}`)
  } else {
    yiqildi++
    console.log(`XATO ${nom}${izoh ? `  — ${izoh}` : ''}`)
  }
}

/** Muvozanatli bo'lishi kerak */
function muvozanatli(tenglama) {
  const natija = balansTekshir(tenglama)
  tekshir(tenglama, natija.muvozanatli, balansIzohi(natija))
}

/** Muvozanatsiz deb topilishi kerak */
function muvozanatsiz(tenglama, kutilganElement) {
  const natija = balansTekshir(tenglama)
  const tutildi =
    !natija.muvozanatli &&
    (!kutilganElement || natija.farqlar.some((f) => f.element === kutilganElement))
  tekshir(
    `[buzuq] ${tenglama}`,
    tutildi,
    natija.muvozanatli ? "muvozanatli deb o'tkazib yubordi" : balansIzohi(natija),
  )
}

console.log('\n─── To\'g\'ri tenglamalar ───')

muvozanatli('H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O')
muvozanatli('HCl + NaOH → NaCl + H₂O')
muvozanatli('2H₂ + O₂ → 2H₂O')
muvozanatli('N₂ + 3H₂ ⇌ 2NH₃')
muvozanatli('2SO₂ + O₂ ⇌ 2SO₃')
muvozanatli('4P + 5O₂ → 2P₂O₅')
muvozanatli('2H₃PO₄ + 3Ca(OH)₂ → Ca₃(PO₄)₂ + 6H₂O')
muvozanatli('C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂')
muvozanatli('3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O')
muvozanatli('CH₄ + 2O₂ → CO₂ + 2H₂O')
muvozanatli('Fe₂O₃ + 3CO → 2Fe + 3CO₂')
muvozanatli('2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂ + 8H₂O')

console.log('\n─── Oddiy yozuv (pastki indekssiz) ham o\'qiladi ───')

muvozanatli('H2SO4 + 2NaOH -> Na2SO4 + 2H2O')
muvozanatli('CaCO3 -> CaO + CO2')

console.log('\n─── Cho\'kma, gaz va holat belgilari ───')

muvozanatli('AgNO₃ + NaCl → AgCl↓ + NaNO₃')
muvozanatli('BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl')
muvozanatli('Zn + 2HCl → ZnCl₂ + H₂↑')
muvozanatli('3Cu + 8HNO₃(dilute) → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O')
muvozanatli('NaCl(aq) + AgNO₃(aq) → AgCl(s) + NaNO₃(aq)')

console.log('\n─── Gidratlar ───')

muvozanatli('CuSO₄·5H₂O → CuSO₄ + 5H₂O')
tekshir(
  'CuSO₄·5H₂O tarkibi',
  azoniOqi('CuSO₄·5H₂O').atomlar.O === 9 && azoniOqi('CuSO₄·5H₂O').atomlar.H === 10,
  JSON.stringify(azoniOqi('CuSO₄·5H₂O').atomlar),
)

console.log('\n─── Zaryad ───')

muvozanatli('CuSO₄ + 4NH₃ → [Cu(NH₃)₄]²⁺ + SO₄²⁻')
muvozanatli('Ag⁺ + Cl⁻ → AgCl↓')
muvozanatli('Fe²⁺ + Ce⁴⁺ → Fe³⁺ + Ce³⁺')
muvozanatli('MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O')

console.log('\n─── Ataylab buzilgan tenglamalar ───')

// Bazadagi haqiqiy xato: chapda 12 H, o'ngda 18 H
muvozanatsiz('C₆H₁₂O₆ → 3C₂H₄O + 3H₂O', 'H')
muvozanatsiz('H₂ + O₂ → H₂O', 'O')
muvozanatsiz('Na + Cl₂ → NaCl', 'Cl')
muvozanatsiz('H₂SO₄ + NaOH → Na₂SO₄ + H₂O', 'Na')
muvozanatsiz('Fe + O₂ → Fe₂O₃', 'Fe')
// Zaryad muvozanatsiz: chapda +2, o'ngda +3
muvozanatsiz('Fe²⁺ → Fe³⁺')
// Element umuman yo'qolib qolgan
muvozanatsiz('CaCO₃ → CaO', 'C')

console.log('\n─── Noto\'g\'ri yozuvlar ───')

const strelkasiz = balansTekshir('H₂ + O₂ H₂O')
tekshir('strelkasiz tenglama rad etiladi', strelkasiz.xato !== null, strelkasiz.xato)

const ikkiStrelka = balansTekshir('A → B → C')
tekshir('ikki strelkali tenglama rad etiladi', ikkiStrelka.xato !== null, ikkiStrelka.xato)

const yoqElement = balansTekshir('Xy₂ + O₂ → XyO₂')
tekshir('mavjud bo\'lmagan element rad etiladi', yoqElement.xato !== null, yoqElement.xato)

const bosh = balansTekshir('')
tekshir('bo\'sh tenglama rad etiladi', bosh.xato !== null, bosh.xato)

const qavs = balansTekshir('Ca(OH₂ → CaO + H₂O')
tekshir('yopilmagan qavs rad etiladi', qavs.xato !== null, qavs.xato)

console.log('\n─── Izoh matni ───')

const buzuq = balansTekshir('H₂ + O₂ → H₂O')
tekshir(
  'izohda farq ko\'rsatiladi',
  balansIzohi(buzuq).includes('O') && balansIzohi(buzuq).includes('Muvozanatsiz'),
  balansIzohi(buzuq),
)

console.log(`\nJami: ${otdi} o'tdi, ${yiqildi} yiqildi`)
process.exitCode = yiqildi > 0 ? 1 : 0
