/**
 * data/reactions dagi reaksiyalarni bazaga ko'chiradi.
 *
 * Ishga tushirish:
 *   node scripts/seed-reactions.js            — yangilarini qo'shadi, eskisini yangilaydi
 *   node scripts/seed-reactions.js --quruq    — hech narsa yozmaydi, faqat ko'rsatadi
 *   node scripts/seed-reactions.js --reset    — bazani tozalab qaytadan to'ldiradi
 *
 * MUHIM QOIDA: kimyogar tasdiqlagan yozuv (isVerified = true) YANGILANMAYDI.
 * Aks holda admin panelda kiritilgan tuzatish keyingi seed'da yo'qolib ketardi.
 * Bunday yozuvlar hisobotda alohida ko'rsatiladi.
 *
 * Xavfsizlik (hazards) fayllarda yozilmagan — u PubChem'dan olinadi
 * (scripts/fetch-pubchem-hazards.js). Ya'ni ogohlantirishlar o'ylab topilmagan,
 * manbasi ko'rsatilgan.
 *
 * Eslatma: ilgari bu skript mobil ilovadagi reactions.json dan o'qirdi. U
 * faylda "1000 ta reaksiya" bor edi, lekin ular 33 ta noyob tenglamaning
 * nusxasi bo'lib chiqdi va boy maydonlari umuman yo'q edi. Endi manba —
 * data/reactions/ ichidagi tekshirilgan fayllar.
 */
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const esmRequire = require('./_esm-require')

const { buildSearchIndex } = esmRequire('lib/chem-search.js', [
  'normalizeChemText',
  'compactChemText',
  'buildSearchIndex',
  'normalizeQuery',
])

const { balansTekshir, balansIzohi, azoniOqi } = esmRequire('lib/chem-balance.js', [
  'balansTekshir',
  'balansIzohi',
  'azoniOqi',
])

const { OILALAR } = require(path.join(__dirname, '..', 'data', 'reactions'))
const { oilaniYoy } = require(path.join(__dirname, '..', 'data', 'reactions', '_umumiy'))

const prisma = new PrismaClient()

const XAVF_FAYLI = path.join(__dirname, '..', 'data', 'pubchem-hazards.json')
const quruq = process.argv.includes('--quruq')
const reset = process.argv.includes('--reset')

// ─────────────────────────────────────────────────────────────
// Xavflarni jiddiyligi bo'yicha tartiblash
// ─────────────────────────────────────────────────────────────

/** Eng jiddiy kodlar oldinda — kartada faqat muhimlari ko'rinadi */
const JIDDIYLIK = [
  'H300', 'H310', 'H330', 'H350', 'H340', 'H360', 'H370', 'H372',
  'H314', 'H318', 'H301', 'H311', 'H331', 'H351', 'H341', 'H361', 'H371', 'H373',
  'H224', 'H225', 'H220', 'H221', 'H240', 'H250', 'H260', 'H271', 'H270',
  'H302', 'H312', 'H332', 'H304', 'H334', 'H317',
  'H290', 'H315', 'H319', 'H335', 'H336',
  'H400', 'H410', 'H411', 'H412',
]

const jiddiylikOrni = (kod) => {
  const orin = JIDDIYLIK.indexOf(kod)
  return orin === -1 ? JIDDIYLIK.length : orin
}

const PASTKI = '₀₁₂₃₄₅₆₇₈₉'

/** "H2SO4" -> "H₂SO₄" — ekranda chiroyli ko'rinishi uchun */
function chiroyliFormula(formula) {
  return formula.replace(/(?<=[A-Za-z)\]])\d+/g, (raqamlar) =>
    [...raqamlar].map((r) => PASTKI[Number(r)]).join(''),
  )
}

/** Tenglamadagi moddalarni ajratadi (koeffitsientsiz, ionlarsiz) */
function moddalar(tenglama) {
  const tomonlar = String(tenglama).split(/(?:⇌|⇄|⇋|↔|⟷|<->|<=>|→|⟶|⇒|⟹|➔|➜|->|=>)/)
  const royxat = []

  for (const tomon of tomonlar) {
    for (const xom of tomon.split(/\s+\+\s+/)) {
      if (!xom.trim()) continue
      try {
        const azo = azoniOqi(xom.trim())
        if (azo.zaryad !== 0) continue

        let sodda = ''
        for (const belgi of azo.formula) {
          const i = PASTKI.indexOf(belgi)
          sodda += i >= 0 ? String(i) : belgi
        }
        royxat.push(sodda.replace(/[↓↑]/g, '').trim())
      } catch {
        // O'qib bo'lmadi — check-reactions.js buni aytadi
      }
    }
  }

  return [...new Set(royxat)]
}

/**
 * Reaksiya uchun xavfsizlik ogohlantirishlarini yig'adi.
 * @returns {{ hazards: string[], sourceUrl: string|null }}
 */
function xavflarniYig(tenglama, xavfBazasi) {
  const yigilgan = []
  let engXavfliCid = null
  let engXavfliOrin = Infinity

  for (const formula of moddalar(tenglama)) {
    const yozuv = xavfBazasi[formula]
    if (!yozuv?.xavflar?.length) continue

    const saralangan = [...yozuv.xavflar].sort(
      (a, b) => jiddiylikOrni(a.kod) - jiddiylikOrni(b.kod),
    )

    // Har moddadan eng jiddiy ikkitasi — aks holda ro'yxat o'qib bo'lmas bo'ladi
    for (const xavf of saralangan.slice(0, 2)) {
      yigilgan.push({
        matn: `${chiroyliFormula(formula)} — ${xavf.matn} (${xavf.kod})`,
        orin: jiddiylikOrni(xavf.kod),
      })
    }

    const eng = jiddiylikOrni(saralangan[0].kod)
    if (eng < engXavfliOrin) {
      engXavfliOrin = eng
      engXavfliCid = yozuv.cid
    }
  }

  const hazards = yigilgan
    .sort((a, b) => a.orin - b.orin)
    .slice(0, 8)
    .map((x) => x.matn)

  return {
    hazards,
    sourceUrl: engXavfliCid
      ? `https://pubchem.ncbi.nlm.nih.gov/compound/${engXavfliCid}`
      : null,
  }
}

/** Prisma kutgan ko'rinishga keltiradi */
function yozuvGaAylantir(r, xavfBazasi) {
  const { hazards, sourceUrl } = xavflarniYig(r.equation, xavfBazasi)

  const bosh = (qiymat) =>
    Array.isArray(qiymat) ? (qiymat.length ? qiymat : null) : qiymat || null

  return {
    equation: r.equation,
    name: r.name,
    description: r.description,
    category: r.category,
    reactionType: bosh(r.reactionType),

    ...buildSearchIndex([r.equation, r.name, r.category, r.reactionType, r.catalyst]),

    temperature: bosh(r.temperature),
    pressure: bosh(r.pressure),
    catalyst: bosh(r.catalyst),
    environment: bosh(r.environment),

    mechanism: bosh(r.mechanism),
    intermediates: bosh(r.intermediates),

    solvents: bosh(r.solvents),
    bestSolvent: bosh(r.bestSolvent),
    solventEffect: bosh(r.solventEffect),

    scale: bosh(r.scale),
    scaleNote: bosh(r.scaleNote),
    rateFactors: bosh(r.rateFactors),

    techniques: bosh(r.techniques),
    equipment: bosh(r.equipment),
    hazards: hazards.length ? hazards : null,
    observations: bosh(r.observations),
    yieldInfo: bosh(r.yieldInfo),

    source: hazards.length ? `${r.source} · Xavfsizlik: PubChem GHS` : r.source,
    sourceUrl,

    isActive: true,
  }
}

async function main() {
  const reaksiyalar = OILALAR.flatMap(oilaniYoy)
  console.log(`Fayllarda: ${reaksiyalar.length} ta reaksiya\n`)

  // ─── 1. Balans tekshiruvi — muvozanatsiz tenglama bazaga kirmaydi ───
  const buzuq = []
  for (const r of reaksiyalar) {
    const balans = balansTekshir(r.equation)
    if (!balans.muvozanatli) buzuq.push({ r, izoh: balansIzohi(balans) })
  }

  if (buzuq.length > 0) {
    console.error(`TO'XTATILDI: ${buzuq.length} ta muvozanatsiz tenglama bor:\n`)
    buzuq.forEach(({ r, izoh }) => console.error(`  ${r.equation}\n    ${izoh}`))
    console.error('\nAvval tuzating: node scripts/check-reactions.js')
    process.exitCode = 1
    return
  }
  console.log(`Balans tekshiruvi: ${reaksiyalar.length}/${reaksiyalar.length} muvozanatli`)

  // ─── 2. Xavfsizlik ma'lumoti ───
  const xavfBazasi = fs.existsSync(XAVF_FAYLI)
    ? JSON.parse(fs.readFileSync(XAVF_FAYLI, 'utf8'))
    : {}

  if (Object.keys(xavfBazasi).length === 0) {
    console.log(
      "Ogohlantirish: data/pubchem-hazards.json yo'q — xavfsizlik bo'limi bo'sh qoladi.\n" +
        "  To'ldirish uchun: node scripts/fetch-pubchem-hazards.js",
    )
  } else {
    console.log(`Xavfsizlik bazasi: ${Object.keys(xavfBazasi).length} ta modda`)
  }

  if (reset && !quruq) {
    const ochirildi = await prisma.reaction.deleteMany({})
    console.log(`\n--reset: ${ochirildi.count} ta eski yozuv o'chirildi`)
  }

  // ─── 3. Bazadagi holat ───
  const mavjud = await prisma.reaction.findMany({
    select: { id: true, equation: true, isVerified: true },
  })
  const mavjudXarita = new Map(mavjud.map((m) => [m.equation, m]))

  let qoshildi = 0
  let yangilandi = 0
  let tegilmadi = 0
  let xavfliSoni = 0

  for (const r of reaksiyalar) {
    const yozuv = yozuvGaAylantir(r, xavfBazasi)
    if (yozuv.hazards) xavfliSoni++

    const eski = mavjudXarita.get(r.equation)

    if (!eski) {
      if (!quruq) {
        await prisma.reaction.create({ data: { ...yozuv, isVerified: false } })
      }
      qoshildi++
      continue
    }

    // Kimyogar tasdiqlagan yozuvga tegilmaydi
    if (eski.isVerified) {
      tegilmadi++
      continue
    }

    if (!quruq) {
      await prisma.reaction.update({ where: { id: eski.id }, data: yozuv })
    }
    yangilandi++
  }

  // ─── 4. Hisobot ───
  console.log(`\n${quruq ? "[QURUQ ISHLASH — baza o'zgarmadi]" : 'Bazaga yozildi'}`)
  console.log(`  qo'shildi:                     ${qoshildi}`)
  console.log(`  yangilandi:                    ${yangilandi}`)
  console.log(`  tasdiqlangani uchun tegilmadi: ${tegilmadi}`)
  console.log(`  xavfsizlik ma'lumoti bilan:    ${xavfliSoni}/${reaksiyalar.length}`)

  if (!quruq) {
    const jami = await prisma.reaction.count()
    const tasdiqlangan = await prisma.reaction.count({ where: { isVerified: true } })
    console.log(`\nBazada jami: ${jami} ta reaksiya, shundan ${tasdiqlangan} tasi tasdiqlangan`)

    // Fayllarda yo'q, lekin bazada qolgan yozuvlar
    const fayldagilar = new Set(reaksiyalar.map((r) => r.equation))
    const yetim = mavjud.filter((m) => !fayldagilar.has(m.equation))

    if (yetim.length > 0) {
      console.log(
        `\nEslatma: bazada fayllarda yo'q ${yetim.length} ta yozuv bor ` +
          "(admin panelda qo'lda kiritilgan bo'lishi mumkin) — ular saqlanib qoldi.",
      )

      // Ular orasida muvozanatsizi bo'lsa — ko'rinmas qilamiz.
      // Noto'g'ri tenglama talabaga ko'rsatilmasligi kerak, lekin o'chirmaymiz:
      // admin uni ko'rib tuzatishi mumkin.
      const buzuqYetim = yetim.filter(
        (m) => !m.isVerified && !balansTekshir(m.equation).muvozanatli,
      )

      if (buzuqYetim.length > 0) {
        await prisma.reaction.updateMany({
          where: { id: { in: buzuqYetim.map((m) => m.id) } },
          data: { isActive: false },
        })
        console.log(
          `\n${buzuqYetim.length} ta eski yozuv muvozanatsiz — ko'rinmas qilindi ` +
            '(isActive = false, o\'chirilmadi):',
        )
        buzuqYetim.forEach((m) =>
          console.log(`  ${m.equation}\n    ${balansIzohi(balansTekshir(m.equation))}`),
        )
      }
    }
  }
}

main()
  .catch((xato) => {
    console.error('XATO:', xato.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
