/**
 * data/reactions dagi har bir reaksiyani tekshiradi.
 *
 * Ishga tushirish:
 *   node scripts/check-reactions.js            — hammasi
 *   node scripts/check-reactions.js kislota    — nomida "kislota" bor faylni
 *
 * Nimalarni tekshiradi:
 *   1. Tenglama muvozanatli (atomlar va zaryad)
 *   2. Majburiy maydonlar bor (equation, name, description, category)
 *   3. Tenglama takrorlanmagan
 *   4. Ro'yxat maydonlari (techniques, hazards...) haqiqatan ro'yxat
 *
 * Muvozanatsiz tenglama topilsa skript 1 bilan tugaydi — bazaga bunday
 * yozuvni kiritib bo'lmaydi.
 */
const path = require('path')
const esmRequire = require('./_esm-require')

const { balansTekshir, balansIzohi } = esmRequire('lib/chem-balance.js', [
  'balansTekshir',
  'balansIzohi',
  'azoniOqi',
])

const { OILALAR } = require(path.join(__dirname, '..', 'data', 'reactions'))
const { oilaniYoy } = require(path.join(__dirname, '..', 'data', 'reactions', '_umumiy'))

const filtr = (process.argv[2] || '').toLowerCase()

const MAJBURIY = ['equation', 'name', 'description', 'category']
const ROYXAT_MAYDONLARI = [
  'intermediates', 'solvents', 'rateFactors',
  'techniques', 'equipment', 'hazards',
]

let jami = 0
let xatolar = 0
const korilganTenglamalar = new Map()

for (const oila of OILALAR) {
  if (filtr && !oila.kategoriya.toLowerCase().includes(filtr)) continue

  const reaksiyalar = oilaniYoy(oila)
  let oilaXatosi = 0

  for (const r of reaksiyalar) {
    jami++
    const muammolar = []

    // 1. Balans
    const balans = balansTekshir(r.equation)
    if (!balans.muvozanatli) muammolar.push(balansIzohi(balans))

    // 2. Majburiy maydonlar
    for (const maydon of MAJBURIY) {
      if (!r[maydon] || !String(r[maydon]).trim()) {
        muammolar.push(`"${maydon}" bo'sh`)
      }
    }

    // 3. Takror
    if (korilganTenglamalar.has(r.equation)) {
      muammolar.push(`takror — "${korilganTenglamalar.get(r.equation)}" oilasida ham bor`)
    } else {
      korilganTenglamalar.set(r.equation, oila.kategoriya)
    }

    // 4. Ro'yxat maydonlari
    for (const maydon of ROYXAT_MAYDONLARI) {
      if (r[maydon] !== undefined && !Array.isArray(r[maydon])) {
        muammolar.push(`"${maydon}" ro'yxat bo'lishi kerak`)
      }
    }

    if (muammolar.length > 0) {
      xatolar++
      oilaXatosi++
      console.log(`\nXATO  ${r.equation}`)
      muammolar.forEach((m) => console.log(`      → ${m}`))
    }
  }

  console.log(
    `${oilaXatosi === 0 ? 'OK  ' : 'XATO'} ${oila.kategoriya.padEnd(24)} ` +
      `${String(reaksiyalar.length).padStart(3)} ta reaksiya` +
      (oilaXatosi ? `, ${oilaXatosi} ta xato` : ''),
  )
}

// To'ldirilganlik darajasi — qaysi maydonlar bo'sh qolgani ko'rinsin
const BOYLIK = [
  'temperature', 'catalyst', 'mechanism', 'intermediates',
  'observations', 'techniques', 'equipment', 'rateFactors', 'scaleNote',
]

if (!filtr) {
  const hammasi = OILALAR.flatMap(oilaniYoy)
  console.log('\n─── Maydonlarning to\'ldirilganligi ───')
  for (const maydon of BOYLIK) {
    const bor = hammasi.filter((r) => {
      const q = r[maydon]
      return Array.isArray(q) ? q.length > 0 : Boolean(q)
    }).length
    const foiz = Math.round((bor / hammasi.length) * 100)
    console.log(`  ${maydon.padEnd(16)} ${String(bor).padStart(3)}/${hammasi.length}  ${foiz}%`)
  }
}

console.log(`\nJami: ${jami} ta reaksiya, ${xatolar} ta xato`)
process.exitCode = xatolar > 0 ? 1 : 0
