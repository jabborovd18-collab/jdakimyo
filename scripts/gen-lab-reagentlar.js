/**
 * scripts/gen-lab-reagentlar.js
 *
 * Reaksiyalar bazasidan laboratoriya reagentlari katalogini yasaydi va
 * data/laboratoriya/reagentlar.js ga yozadi.
 *
 * Nega generatsiya, qo'lda emas: reagentlar ro'yxati reaksiyalarning
 * hosilasi. Qo'lda yozilsa, yangi reaksiya qo'shilganda ro'yxat undan
 * uzilib qoladi. Natija faylga yoziladi (git'da ko'rinadi va tekshiriladi),
 * shunda ilova ishlashda bazaga qarab hisoblamaydi.
 *
 * Ishlatish:
 *   node scripts/gen-lab-reagentlar.js
 */
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Tenglamani ikkiga bo'ladigan belgilar.
// `⇌` va `↔` shart: qaytar reaksiyada ular yo'q bo'lsa, tenglamaning o'ng
// tomoni ham reagent bo'lib qolardi ("N₂ + H₂ ⇌ 2NH₃" dan "H₂ ⇌ 2NH₃").
const STRELKA = /→|⇌|↔|⟶|->|<->|=/

// Reaksiya sxemasidagi shartli belgilar — modda emas, egallik qilinmaydi.
const MODDA_EMAS = new Set(['[O]', '[H]', 'e⁻', 'hv', 'hν', 't°', 'kat', 'kat.'])

/**
 * Nodirlik — modda nechta reaksiyada uchrashiga qarab.
 *
 * Ma'no shunda: kam uchraydigan reagent kam reaksiyani ochadi, lekin
 * o'sha reaksiya boshqa yo'l bilan qilinmaydi. Ko'p uchraydigani esa
 * doim kerak bo'ladi va tez tugaydi.
 */
function nodirlik(uchraydi) {
  if (uchraydi >= 8) return 'oddiy'
  if (uchraydi >= 4) return 'kam'
  if (uchraydi >= 2) return 'nodir'
  return 'noyob'
}

// Sotib olish narxi (coins). Arzon reagent tez sarflanadi, qimmati — darvoza.
const NARX = { oddiy: 4, kam: 10, nodir: 25, noyob: 60 }

// Sotish narxi ataylab pastroq: sotib olib qayta sotish foyda bermasin.
const SOTISH_ULUSHI = 0.4

// Faqat eng nodirini olmosga to'g'ridan-to'g'ri olish mumkin. Bu sandiqqa
// muqobil yo'l: foydalanuvchi kerakli reagentni tasodifga tashlamay olsin.
const GEMS_NARXI = { noyob: 3, nodir: 1 }

function normalize(xom) {
  return xom
    .trim()
    .replace(/^\d+\s*/, '')
    .replace(/\((dilute|conc|kons|suyultirilgan|konsentrlangan)\.?\)/gi, '')
    .replace(/\s+/g, '')
    .trim()
}

async function main() {
  const reaksiyalar = await prisma.reaction.findMany({
    where: { isActive: true },
    select: { equation: true, category: true },
  })

  const hisob = new Map() // formula → { uchraydi, oilalar:Set }

  for (const r of reaksiyalar) {
    const chap = r.equation.split(STRELKA)[0]
    if (!chap) continue

    for (const bolak of chap.split('+')) {
      const formula = normalize(bolak)
      if (!formula || MODDA_EMAS.has(formula)) continue

      if (!hisob.has(formula)) hisob.set(formula, { uchraydi: 0, oilalar: new Set() })
      const y = hisob.get(formula)
      y.uchraydi++
      if (r.category) y.oilalar.add(r.category)
    }
  }

  const reagentlar = [...hisob.entries()]
    .map(([formula, y]) => {
      const n = nodirlik(y.uchraydi)
      const narx = NARX[n]
      return {
        kalit: formula,
        nom: formula,
        nodirlik: n,
        uchraydi: y.uchraydi,
        narx,
        sotishNarxi: Math.max(1, Math.round(narx * SOTISH_ULUSHI)),
        gemsNarxi: GEMS_NARXI[n] || null,
        oilalar: [...y.oilalar].sort(),
      }
    })
    .sort((a, b) => b.uchraydi - a.uchraydi || a.kalit.localeCompare(b.kalit))

  const sanoq = reagentlar.reduce((acc, r) => {
    acc[r.nodirlik] = (acc[r.nodirlik] || 0) + 1
    return acc
  }, {})

  const sarlavha = `// data/laboratoriya/reagentlar.js
//
// AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
// Yangilash: node scripts/gen-lab-reagentlar.js
//
// Manba: Reaction jadvalidagi tenglamalarning chap tomoni (reagentlar).
// Nodirlik va narx modda nechta reaksiyada uchrashidan kelib chiqadi —
// bu son o'ylab topilmagan, kimyo bazasining o'zidan chiqqan.
//
// Jami: ${reagentlar.length} ta
${Object.entries(sanoq).map(([k, v]) => `//   ${k.padEnd(10)} ${v} ta`).join('\n')}

module.exports = `

  const yol = path.join(__dirname, '..', 'data', 'laboratoriya', 'reagentlar.js')
  fs.writeFileSync(yol, sarlavha + JSON.stringify(reagentlar, null, 2) + '\n', 'utf8')

  console.log(`✓ ${reagentlar.length} ta reagent yozildi: data/laboratoriya/reagentlar.js`)
  for (const [k, v] of Object.entries(sanoq)) console.log(`   ${k.padEnd(10)} ${v} ta`)
}

main()
  .catch((e) => { console.error('XATO:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
