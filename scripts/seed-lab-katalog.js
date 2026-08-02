/**
 * scripts/seed-lab-katalog.js
 *
 * data/laboratoriya/ dagi katalogni LabItemDef jadvaliga ko'chiradi.
 * scripts/seed-reactions.js bilan bir xil naqsh.
 *
 * Qayta ishga tushirish xavfsiz: `kalit` bo'yicha upsert qilinadi, ya'ni
 * mavjud yozuv yangilanadi, yangisi qo'shiladi. Katalogdan olib tashlangan
 * yozuv esa `isActive: false` bo'ladi — o'chirilmaydi, chunki unga
 * foydalanuvchi inventari ishora qilayotgan bo'lishi mumkin.
 *
 * Ishlatish:
 *   node scripts/gen-lab-reagentlar.js   (avval reagentlarni yangilash)
 *   node scripts/seed-lab-katalog.js
 */
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const DATA = path.join(__dirname, '..', 'data', 'laboratoriya')
const reagentlar = require(path.join(DATA, 'reagentlar.js'))
const jihozlar = require(path.join(DATA, 'jihozlar.js'))
const texnikalar = require(path.join(DATA, 'texnikalar.js'))

/** Uch xil manbani bitta jadval shakliga keltiradi */
function yozuvlarniTayyorla() {
  const yozuvlar = []

  for (const r of reagentlar) {
    yozuvlar.push({
      kalit: r.kalit,
      nom: r.nom,
      turi: 'reagent',
      guruh: null,
      icon: '⚗️',
      tavsif: null,
      nodirlik: r.nodirlik,
      uchraydi: r.uchraydi,
      chiqadi: r.chiqadi ?? 0,
      narx: r.narx,
      sotishNarxi: r.sotishNarxi,
      gemsNarxi: r.gemsNarxi ?? null,
      sarflanadi: true, // reagent reaksiyada sarflanadi
      sanoat: false,
      daraja: 1,
      xom: null,
      oilalar: r.oilalar ?? null,
    })
  }

  for (const j of jihozlar) {
    // Jihoz nodirligi ham reagentnikidek: kam uchraydigan jihoz kam
    // reaksiyani ochadi, lekin o'sha reaksiya boshqa yo'l bilan qilinmaydi.
    const n = j.sanoat ? 'noyob' : j.uchraydi >= 10 ? 'oddiy' : j.uchraydi >= 4 ? 'kam' : 'nodir'

    yozuvlar.push({
      kalit: j.kalit,
      nom: j.nom,
      turi: 'jihoz',
      guruh: j.guruh ?? null,
      icon: j.icon ?? null,
      tavsif: j.tavsif ?? null,
      nodirlik: n,
      uchraydi: j.uchraydi ?? 0,
      chiqadi: 0, // jihoz reaksiyada hosil bo'lmaydi
      narx: j.narx ?? 0,
      // Jihoz sotilmaydi: sotib olingan asbob laboratoriyada qoladi.
      sotishNarxi: 0,
      gemsNarxi: j.gemsNarxi ?? null,
      sarflanadi: Boolean(j.sarflanadi),
      sanoat: Boolean(j.sanoat),
      daraja: j.daraja ?? 1,
      xom: j.xom ?? null,
      oilalar: null,
    })
  }

  for (const t of texnikalar) {
    yozuvlar.push({
      kalit: t.kalit,
      nom: t.nom,
      turi: 'texnika',
      guruh: t.sanoat ? 'sanoat' : 'usul',
      icon: t.icon ?? null,
      tavsif: t.tavsif ?? null,
      nodirlik: 'oddiy',
      uchraydi: t.uchraydi ?? 0,
      chiqadi: 0,
      // Texnika sotib olinmaydi — laboratoriya darajasi bilan ochiladi.
      narx: 0,
      sotishNarxi: 0,
      gemsNarxi: null,
      sarflanadi: false,
      sanoat: Boolean(t.sanoat),
      daraja: t.daraja ?? 1,
      xom: t.xom ?? null,
      oilalar: t.jihoz ? { jihoz: t.jihoz } : null,
    })
  }

  return yozuvlar
}

async function main() {
  const yozuvlar = yozuvlarniTayyorla()

  // Kalitlar noyobligini bazaga bormasdan tekshiramiz — upsert xatosi
  // o'rniga tushunarli xabar chiqsin.
  const kalitlar = yozuvlar.map((y) => y.kalit)
  const takror = kalitlar.filter((k, i) => kalitlar.indexOf(k) !== i)
  if (takror.length) {
    throw new Error('Takrorlangan kalit: ' + [...new Set(takror)].join(', '))
  }

  let yangi = 0
  let yangilandi = 0

  for (const y of yozuvlar) {
    const mavjud = await prisma.labItemDef.findUnique({ where: { kalit: y.kalit } })
    await prisma.labItemDef.upsert({
      where: { kalit: y.kalit },
      create: { ...y, isActive: true },
      update: { ...y, isActive: true },
    })
    if (mavjud) yangilandi++
    else yangi++
  }

  // Katalogdan chiqarilganlar o'chirilmaydi, faqat yashiriladi
  const ochirilgan = await prisma.labItemDef.updateMany({
    where: { kalit: { notIn: kalitlar }, isActive: true },
    data: { isActive: false },
  })

  console.log(`✓ Katalog seed qilindi`)
  console.log(`   yangi        : ${yangi}`)
  console.log(`   yangilandi   : ${yangilandi}`)
  console.log(`   yashirildi   : ${ochirilgan.count}`)

  const bolinish = await prisma.labItemDef.groupBy({
    by: ['turi'],
    _count: true,
    where: { isActive: true },
  })
  console.log('\nJadvaldagi holat:')
  for (const b of bolinish) console.log(`   ${b.turi.padEnd(9)} ${b._count} ta`)
}

main()
  .catch((e) => { console.error('XATO:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
