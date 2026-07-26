/**
 * Quiz savollarini data.js fayllaridan bazaga ko'chirish.
 *
 * Nega kerak: 450 ta haqiqiy savol Next.js kodida qotirilgan edi, bazadagi
 * QuizQuestion jadvali esa bo'sh turardi. Natijada:
 *   • admin paneldagi "Quiz savollari" bo'limi hech narsani boshqarmasdi
 *   • mobil ilova savollarni ololmasdi
 *
 * Ishga tushirish:
 *   node scripts/seed-quiz-questions.js
 *   node scripts/seed-quiz-questions.js --reset   (avval eskisini o'chiradi)
 *
 * Skript idempotent: bir xil savol ikki marta qo'shilmaydi.
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const QUIZ_DIR = path.join(__dirname, '..', 'app', 'oquv', 'video-darsliklar', 'quiz')

const CATEGORIES = [
  { slug: 'nomlanishi', name: 'Nomlanishi' },
  { slug: 'klassifikatsiyasi', name: 'Klassifikatsiyasi' },
  { slug: 'fazoviy', name: 'Fazoviy tuzilishi' },
  { slug: 'izomeriya', name: 'Izomeriya' },
]

/**
 * data.js — ESM sintaksisidagi sof ma'lumot fayli. Loyihaning package.json'i
 * CommonJS bo'lgani uchun uni to'g'ridan-to'g'ri require qilib bo'lmaydi,
 * shuning uchun vaqtinchalik .cjs nusxaga aylantirib o'qiymiz.
 */
function loadQuizBank(slug) {
  const source = fs.readFileSync(path.join(QUIZ_DIR, slug, 'data.js'), 'utf8')

  const converted = source
    .replace(/export\s+const\s+QUIZ_BANK\s*=/, 'module.exports =')
    .replace(/export\s+default\s+QUIZ_BANK\s*;?/g, '')

  const tempFile = path.join(os.tmpdir(), `jda-quiz-${slug}-${Date.now()}.cjs`)
  fs.writeFileSync(tempFile, converted, 'utf8')

  try {
    const bank = require(tempFile)
    if (!Array.isArray(bank)) {
      throw new Error(`${slug}/data.js dan massiv olinmadi`)
    }
    return bank
  } finally {
    fs.unlinkSync(tempFile)
  }
}

function isValidQuestion(q) {
  return (
    q &&
    typeof q.question === 'string' &&
    q.question.trim().length > 0 &&
    Array.isArray(q.options) &&
    q.options.length >= 2 &&
    Number.isInteger(q.correct) &&
    q.correct >= 0 &&
    q.correct < q.options.length
  )
}

async function main() {
  const reset = process.argv.includes('--reset')

  if (reset) {
    const deleted = await prisma.quizQuestion.deleteMany({})
    console.log(`--reset: ${deleted.count} ta eski savol o'chirildi\n`)
  }

  let totalAdded = 0
  let totalSkipped = 0
  let totalInvalid = 0

  for (const { slug, name } of CATEGORIES) {
    const bank = loadQuizBank(slug)

    // Bazada shu kategoriyada nima bor — matn bo'yicha solishtiramiz
    const existing = await prisma.quizQuestion.findMany({
      where: { category: slug },
      select: { question: true },
    })
    const existingSet = new Set(existing.map((q) => q.question))

    const rows = []
    let invalid = 0

    for (const q of bank) {
      if (!isValidQuestion(q)) {
        invalid++
        continue
      }
      if (existingSet.has(q.question)) continue

      rows.push({
        category: slug,
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation || null,
        difficulty: q.difficulty || "o'rta",
        tags: Array.isArray(q.tags) ? q.tags : null,
        isActive: true,
      })
      existingSet.add(q.question)
    }

    if (rows.length > 0) {
      await prisma.quizQuestion.createMany({ data: rows })
    }

    const skipped = bank.length - rows.length - invalid
    totalAdded += rows.length
    totalSkipped += skipped
    totalInvalid += invalid

    console.log(
      `${name.padEnd(20)} faylda ${String(bank.length).padStart(3)} | ` +
        `qo'shildi ${String(rows.length).padStart(3)} | ` +
        `mavjud ${String(skipped).padStart(3)}` +
        (invalid ? ` | YAROQSIZ ${invalid}` : ''),
    )
  }

  const total = await prisma.quizQuestion.count()
  console.log(
    `\nJami: +${totalAdded} qo'shildi, ${totalSkipped} allaqachon bor` +
      (totalInvalid ? `, ${totalInvalid} yaroqsiz` : ''),
  )
  console.log(`Bazadagi umumiy savollar soni: ${total}`)
}

main()
  .catch((error) => {
    console.error('XATO:', error.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
