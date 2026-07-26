/**
 * Reaksiyalarni mobil ilovaning reactions.json faylidan bazaga ko'chirish.
 *
 * MUHIM: manba faylda "1000 ta reaksiya" bor, lekin ular aslida 33 ta noyob
 * tenglamaning nusxalari — har biri ~31 marta takrorlangan. Nusxalar orasidagi
 * yagona farq "intensity" maydonidagi tasodifiy son bo'lib, u hech qanday
 * kimyoviy ma'noga ega emas. Shuning uchun:
 *   • takrorlar tashlab yuboriladi
 *   • "intensity" maydoni umuman ko'chirilmaydi
 *
 * Boy maydonlar (oraliq moddalar, erituvchi samaradorligi, tezlik omillari,
 * mexanizm) ATAYLAB bo'sh qoldiriladi — ularni o'ylab topish talabaga
 * noto'g'ri kimyo o'rgatish bo'lardi. Admin paneldan to'ldiriladi.
 * Shu sababli barcha yozuv isVerified = false bilan kiradi.
 *
 * Ishga tushirish:
 *   node scripts/seed-reactions.js
 *   node scripts/seed-reactions.js --reset
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

const prisma = new PrismaClient()

const SOURCE_FILE = path.join(
  __dirname,
  '..',
  '..',
  'jda-kimyo-mobile',
  'lib',
  'data',
  'reactions.json',
)

/** "Yo'q" kabi ma'nosiz qiymatlarni null ga aylantirish */
function clean(value) {
  if (!value) return null
  const trimmed = String(value).trim()
  if (!trimmed) return null
  if (/^(yo'q|yoq|none|-)$/i.test(trimmed)) return null
  return trimmed
}

async function main() {
  const reset = process.argv.includes('--reset')

  if (!fs.existsSync(SOURCE_FILE)) {
    throw new Error(
      `Manba fayl topilmadi: ${SOURCE_FILE}\n` +
        'jda-kimyo-mobile loyihasi sayt yonida turishi kerak.',
    )
  }

  const raw = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf8'))
  console.log(`Manba faylda: ${raw.length} ta yozuv`)

  // Tenglama bo'yicha guruhlash
  const groups = new Map()
  for (const row of raw) {
    if (!row.equation) continue
    if (!groups.has(row.equation)) groups.set(row.equation, [])
    groups.get(row.equation).push(row)
  }

  console.log(`Noyob tenglama: ${groups.size} ta (${raw.length - groups.size} ta takror tashlandi)\n`)

  // Nusxalar orasida metama'lumot ziddiyati bormi?
  let conflicts = 0
  for (const [equation, rows] of groups) {
    for (const field of ['category', 'conditions', 'catalyst', 'technique']) {
      const values = new Set(rows.map((r) => r[field]))
      if (values.size > 1) {
        conflicts++
        console.log(
          `  ZIDDIYAT: "${equation.slice(0, 40)}" — ${field}: ${[...values].join(' / ')}`,
        )
      }
    }
  }
  if (conflicts === 0) {
    console.log('Nusxalar orasida metama\'lumot ziddiyati yo\'q — birinchisi olinadi.\n')
  }

  if (reset) {
    const deleted = await prisma.reaction.deleteMany({})
    console.log(`--reset: ${deleted.count} ta eski reaksiya o'chirildi\n`)
  }

  const existing = await prisma.reaction.findMany({ select: { equation: true } })
  const existingSet = new Set(existing.map((r) => r.equation))

  const rowsToInsert = []

  for (const [equation, rows] of groups) {
    if (existingSet.has(equation)) continue

    const first = rows[0]
    const technique = clean(first.technique)

    const { searchText, searchCompact } = buildSearchIndex([
      equation,
      first.category,
      first.products,
      clean(first.catalyst),
    ])

    rowsToInsert.push({
      equation,
      name: null,
      category: first.category || 'Boshqa',
      searchText,
      searchCompact,
      temperature: clean(first.conditions),
      catalyst: clean(first.catalyst),
      techniques: technique ? [technique] : undefined,
      // Boy maydonlar ataylab bo'sh — admin paneldan to'ldiriladi
      isVerified: false,
      isActive: true,
      source: 'jda-kimyo-mobile / reactions.json',
    })
  }

  if (rowsToInsert.length > 0) {
    await prisma.reaction.createMany({ data: rowsToInsert })
  }

  console.log(`Qo'shildi: ${rowsToInsert.length} ta`)
  console.log(`Allaqachon bor edi: ${groups.size - rowsToInsert.length} ta`)
  console.log(`\nBazadagi umumiy reaksiyalar: ${await prisma.reaction.count()}`)
  console.log(
    `Tasdiqlangan (isVerified): ${await prisma.reaction.count({ where: { isVerified: true } })} ta`,
  )
  console.log(
    '\nEslatma: boy maydonlar (oraliq moddalar, erituvchi, tezlik omillari,\n' +
      'mexanizm) bo\'sh — ularni admin paneldan to\'ldirish kerak.',
  )
}

main()
  .catch((error) => {
    console.error('XATO:', error.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
