/**
 * scripts/lab-miqdor-toldir.js
 *
 * Mavjud inventardagi `LabItem.soni` (dona) dan `LabItem.miqdor` (ml/gr)
 * ni hisoblab yozadi.
 *
 * Nega migratsiya SQL'ida emas: miqdor buyumning birligiga bog'liq, birlik
 * esa moddaning agregat holatidan chiqadi (lib/lab-modda.js). Bu qoidani
 * SQL ichida takrorlash ikkinchi haqiqat manbai yaratardi — jadval
 * tuzatilganda SQL eskiligicha qolardi.
 *
 * XAVFSIZ QAYTA ISHGA TUSHIRILADI. Sukut bo'yicha faqat `miqdor = 0`
 * bo'lgan yozuvlar to'ldiriladi, ya'ni ikkinchi marta ishga tushirilsa
 * allaqachon sarflangan yoki to'ldirilgan miqdorlar ustidan yozilmaydi.
 *
 * Ishlatish:
 *   node scripts/seed-lab-katalog.js      (avval LabItemDef.birlik yozilsin)
 *   node scripts/lab-miqdor-toldir.js
 *   node scripts/lab-miqdor-toldir.js --hammasi   (hammasini qayta hisoblash)
 */
const { PrismaClient } = require('@prisma/client')
const esmRequire = require('./_esm-require')

const { donadanMiqdor, miqdorniFormatla } = esmRequire('lib/lab-birlik.js', [
  'donadanMiqdor',
  'miqdorniFormatla',
])

const prisma = new PrismaClient()

const HAMMASI = process.argv.includes('--hammasi')

async function main() {
  const deflar = await prisma.labItemDef.findMany({
    select: { kalit: true, birlik: true, turi: true },
  })
  const birlikBoyicha = new Map(deflar.map((d) => [d.kalit, d.birlik]))

  const birliksiz = deflar.filter((d) => !d.birlik || d.birlik === 'dona')
  console.log(`Katalog: ${deflar.length} ta yozuv`)
  console.log(`  dona bilan o'lchanadigan: ${birliksiz.length} ta (jihoz va texnika)`)

  const yozuvlar = await prisma.labItem.findMany({
    where: HAMMASI ? {} : { miqdor: 0 },
    select: { id: true, kalit: true, soni: true, miqdor: true },
  })

  if (yozuvlar.length === 0) {
    console.log('\nTo\'ldiriladigan yozuv topilmadi — hammasi joyida.')
    return
  }

  console.log(`\nTo'ldiriladi: ${yozuvlar.length} ta inventar yozuvi`)

  // Bir xil (birlik, soni) juftligi ko'p takrorlanadi, shuning uchun
  // har biriga alohida so'rov yubormasdan guruhlab yangilaymiz: 10 mingta
  // yozuv uchun 10 mingta so'rov Neon'ga uzoq masofadan chidab bo'lmas.
  const guruhlar = new Map()
  const nomalum = []

  for (const y of yozuvlar) {
    const birlik = birlikBoyicha.get(y.kalit)
    if (!birlik) {
      nomalum.push(y.kalit)
      continue
    }
    const miqdor = donadanMiqdor(y.soni, birlik)
    if (!guruhlar.has(miqdor)) guruhlar.set(miqdor, [])
    guruhlar.get(miqdor).push(y.id)
  }

  let yangilandi = 0
  for (const [miqdor, idlar] of guruhlar) {
    const natija = await prisma.labItem.updateMany({
      where: { id: { in: idlar } },
      data: { miqdor },
    })
    yangilandi += natija.count
  }

  console.log(`\n✓ ${yangilandi} ta yozuv yangilandi`)

  if (nomalum.length > 0) {
    // Katalogdan chiqarilgan modda: inventar yozuvi qolgan, ta'rifi yo'q.
    // O'chirilmaydi — foydalanuvchining buyumi, katalog esa qayta
    // yasalganda tiklanishi mumkin.
    const noyob = [...new Set(nomalum)]
    console.log(`\n! Katalogda topilmagan ${noyob.length} ta kalit tegilmadi:`)
    console.log(`  ${noyob.slice(0, 10).join(', ')}${noyob.length > 10 ? ' ...' : ''}`)
  }

  // Namuna: nima bo'lganini ko'z bilan tekshirish uchun
  const namuna = await prisma.labItem.findMany({
    take: 6,
    where: { miqdor: { gt: 0 } },
    select: { kalit: true, soni: true, miqdor: true },
    orderBy: { miqdor: 'desc' },
  })
  if (namuna.length > 0) {
    console.log('\nNamuna:')
    for (const n of namuna) {
      const birlik = birlikBoyicha.get(n.kalit) || 'dona'
      console.log(`  ${n.kalit.padEnd(14)} ${n.soni} dona → ${miqdorniFormatla(n.miqdor, birlik)}`)
    }
  }
}

main()
  .catch((e) => {
    console.error('Xato:', e.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
