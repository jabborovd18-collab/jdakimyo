/**
 * scripts/gen-lab-reagentlar.js
 *
 * Reaksiyalar bazasidan laboratoriya moddalari katalogini yasaydi va
 * data/laboratoriya/reagentlar.js ga yozadi.
 *
 * Nega generatsiya, qo'lda emas: ro'yxat reaksiyalarning hosilasi. Qo'lda
 * yozilsa, yangi reaksiya qo'shilganda ro'yxat undan uzilib qoladi. Natija
 * faylga yoziladi (git'da ko'rinadi va tekshiriladi), shunda ilova ishlashda
 * bazaga qarab hisoblamaydi.
 *
 * Tenglamadan kalit ajratish qoidasi lib/lab-tenglama.js da — tajriba
 * dvigateli ham o'shani ishlatadi, shuning uchun kalitlar hech qachon
 * bir-biridan uzilib qolmaydi.
 *
 * Ishlatish:
 *   node scripts/gen-lab-reagentlar.js
 */
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const esmRequire = require('./_esm-require')

const { tenglamaniAjrat } = esmRequire('lib/lab-tenglama.js', [
  'azoniKalitla',
  'tenglamaniAjrat',
  'toplamKaliti',
])

const prisma = new PrismaClient()

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

/**
 * Tajribadan qaytadigan ulush.
 *
 * Reaksiya mahsulotini sotib kirim qilish MUMKIN, lekin sarflangan
 * reagentning qiymatidan ko'p emas: aks holda bitta foydali reaksiya
 * topilsa, uni takrorlab cheksiz tanga yasash mumkin bo'lardi va missiya
 * bajarishning ma'nosi qolmasdi.
 *
 * Quyidagi hisob har bir reaksiya uchun shu shartni KAFOLATLAYDI (pastdagi
 * mahsulotNarxi ga qarang), ya'ni tajribaning maqsadi foyda emas — modda
 * olish, kuzatuvni ko'rish va daraja ko'tarish.
 */
const QAYTIM_ULUSHI = 0.5

async function main() {
  const reaksiyalar = await prisma.reaction.findMany({
    where: { isActive: true },
    select: { equation: true, category: true },
  })

  // formula → { uchraydi (chapda), chiqadi (o'ngda), oilalar }
  const hisob = new Map()
  const yozuv = (formula) => {
    if (!hisob.has(formula)) {
      hisob.set(formula, { uchraydi: 0, chiqadi: 0, oilalar: new Set() })
    }
    return hisob.get(formula)
  }

  // Iqtisod tekshiruvi uchun: har reaksiyaning ikki tomoni kalit ko'rinishida
  const ajratilgan = []

  for (const r of reaksiyalar) {
    const t = tenglamaniAjrat(r.equation)
    if (!t) continue
    ajratilgan.push({ ...t, equation: r.equation })

    for (const a of t.chap) {
      const y = yozuv(a.kalit)
      y.uchraydi++
      if (r.category) y.oilalar.add(r.category)
    }
    for (const a of t.ong) {
      const y = yozuv(a.kalit)
      y.chiqadi++
      if (r.category) y.oilalar.add(r.category)
    }
  }

  // ─── Nodirlik va xarid narxi ───
  //
  // Faqat reagent sifatida ishlatiladigan modda sotib olinadi. Faqat
  // mahsulot bo'lgani sotilmaydi (narx: 0) — uni YASASH kerak. Shu bilan
  // katalog o'yinning maqsadini aytib turadi: hamma narsani pulga olib
  // bo'lmaydi.
  const moddalar = new Map()

  // Nominal qiymat — narxlash uchun, katalogga yozilmaydi. Sotib
  // bo'lmaydigan moddada ham qiymat bor, aks holda undan yasaladigan
  // reaksiya "bepul" ko'rinardi.
  const qiymat = new Map()

  for (const [formula, y] of hisob) {
    const n = y.uchraydi > 0 ? nodirlik(y.uchraydi) : nodirlik(y.chiqadi)
    qiymat.set(formula, NARX[n])
    moddalar.set(formula, {
      kalit: formula,
      nom: formula,
      nodirlik: n,
      uchraydi: y.uchraydi,
      chiqadi: y.chiqadi,
      narx: y.uchraydi > 0 ? NARX[n] : 0,
      gemsNarxi: y.uchraydi > 0 ? GEMS_NARXI[n] || null : null,
      oilalar: [...y.oilalar].sort(),
    })
  }

  // ─── Sotish narxi ───
  //
  // Ikki tomondan chegaralanadi:
  //   1. Xarid narxining 40% i — sotib olib qayta sotish zarar bo'lsin.
  //   2. Uni YASASH qiymatining ulushi — tajriba mahsulotini sotish ham
  //      zarar bo'lsin.
  //
  // Ikkinchisi shunday taqsimlanadi: reaksiya sarfining QAYTIM_ULUSHI qismi
  // mahsulotlar orasida teng bo'linadi. Shuning uchun bitta reaksiyaning
  // BARCHA mahsulotini sotsa ham, sarflangan reagent qiymatining yarmidan
  // ko'pi qaytmaydi. Modda bir necha reaksiyadan chiqsa, eng arzon yo'l
  // hisobga olinadi.
  const sarf = (t) => t.chap.reduce((s, a) => s + a.koef * (qiymat.get(a.kalit) ?? 0), 0)

  const chegara = new Map()
  for (const t of ajratilgan) {
    const jamiSarf = sarf(t)
    const ulush = (QAYTIM_ULUSHI * jamiSarf) / t.ong.length
    for (const a of t.ong) {
      const shu = Math.floor(ulush / a.koef)
      const eski = chegara.get(a.kalit)
      chegara.set(a.kalit, eski === undefined ? shu : Math.min(eski, shu))
    }
  }

  for (const m of moddalar.values()) {
    const xariddan = Math.round(qiymat.get(m.kalit) * SOTISH_ULUSHI)
    const yasashdan = chegara.has(m.kalit) ? chegara.get(m.kalit) : Infinity
    m.sotishNarxi = Math.max(1, Math.min(xariddan, yasashdan))
  }

  const reagentlar = [...moddalar.values()].sort(
    (a, b) =>
      b.uchraydi - a.uchraydi || b.chiqadi - a.chiqadi || a.kalit.localeCompare(b.kalit),
  )

  // ─── Iqtisod tekshiruvi ───
  //
  // Yuqoridagi hisob nazariy jihatdan foydali reaksiya qoldirmaydi, lekin
  // yaxlitlash va "kamida 1 tanga" qoidasi tufayli chetga chiqishi mumkin.
  // Shuning uchun har bir reaksiya sanab tekshiriladi.
  const foydali = []
  for (const t of ajratilgan) {
    const kirim = t.ong.reduce((s, a) => s + a.koef * (moddalar.get(a.kalit)?.sotishNarxi ?? 0), 0)
    const chiqim = sarf(t)
    if (kirim > chiqim) foydali.push({ equation: t.equation, kirim, chiqim })
  }

  const sanoq = reagentlar.reduce((acc, r) => {
    acc[r.nodirlik] = (acc[r.nodirlik] || 0) + 1
    return acc
  }, {})
  const faqatMahsulot = reagentlar.filter((r) => r.uchraydi === 0).length

  const sarlavha = `// data/laboratoriya/reagentlar.js
//
// AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
// Yangilash: node scripts/gen-lab-reagentlar.js
//
// Manba: Reaction jadvalidagi tenglamalarning IKKALA tomoni.
// Nodirlik va narx modda nechta reaksiyada uchrashidan kelib chiqadi —
// bu son o'ylab topilmagan, kimyo bazasining o'zidan chiqqan.
//
// \`uchraydi\` — nechta reaksiyada reagent (chap tomonda)
// \`chiqadi\`  — nechta reaksiyada mahsulot (o'ng tomonda)
//
// narx = 0 bo'lgani sotib olinmaydi: uni faqat tajribada YASASH mumkin.
//
// Jami: ${reagentlar.length} ta (shundan ${faqatMahsulot} tasi faqat mahsulot)
${Object.entries(sanoq).map(([k, v]) => `//   ${k.padEnd(10)} ${v} ta`).join('\n')}

module.exports = `

  const yol = path.join(__dirname, '..', 'data', 'laboratoriya', 'reagentlar.js')
  fs.writeFileSync(yol, sarlavha + JSON.stringify(reagentlar, null, 2) + '\n', 'utf8')

  console.log(`✓ ${reagentlar.length} ta modda yozildi: data/laboratoriya/reagentlar.js`)
  for (const [k, v] of Object.entries(sanoq)) console.log(`   ${k.padEnd(10)} ${v} ta`)
  console.log(`   faqat mahsulot: ${faqatMahsulot} ta (sotib olinmaydi)`)

  console.log(`\nIqtisod: ${ajratilgan.length} ta reaksiya tekshirildi`)
  if (foydali.length === 0) {
    console.log('   ✓ mahsulotni sotib foyda ko\'rish mumkin bo\'lgan reaksiya yo\'q')
  } else {
    console.log(`   ⚠ ${foydali.length} ta reaksiyada mahsulot sarfdan qimmat:`)
    for (const f of foydali.slice(0, 10)) {
      console.log(`      ${f.equation}  (sarf ${f.chiqim}, qaytim ${f.kirim})`)
    }
    process.exitCode = 1
  }
}

main()
  .catch((e) => { console.error('XATO:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
