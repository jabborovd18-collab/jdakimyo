// scripts/ms-kalibrla.js
//
// Yig'ilgan javoblardan savol qiyinligini hisoblaydi.
//
//   npm run ms:eksport                       javoblarni output/ ga chiqaradi
//   npm run ms:kalibrla -- <slug>            hisobot, hech narsa yozilmaydi
//   npm run ms:kalibrla -- <slug> --yoz      natijani savol bankiga ulaydi
//
// Bazaga tegmaydi: faqat output/ dagi CSV ni o'qiydi.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { kalibrla } from '../lib/rasch-kalibrlash.js'
import { KALIBRLASH } from '../data/milliy-sertifikat/kalibrlash.js'

// Nega 100: bundan kam javobda qiyinlik xatosi yarim logitdan katta bo'ladi va
// taxminiy qiymatdan yaxshi emas. Bu amaliy mo'ljal, aniq qoida emas.
const MIN_QATOR = 100

const [slug, ...bayroqlar] = process.argv.slice(2)
const yoz = bayroqlar.includes('--yoz')

if (!slug) {
  console.error('Foydalanish: npm run ms:kalibrla -- <slug> [--yoz]')
  process.exit(1)
}

const fayl = join('output', `ms-javoblar-${slug}.csv`)
if (!existsSync(fayl)) {
  console.error(`${fayl} topilmadi. Avval: npm run ms:eksport`)
  process.exit(1)
}

const [sarlavha, ...satrlar] = readFileSync(fayl, 'utf8').trim().split('\n')
const ustunlar = sarlavha.split(',').slice(1)
// Bo'sh katakli qator tashlanadi: CML hamma savol berilganini talab qiladi
const toliq = satrlar
  .map((s) => s.split(',').slice(1))
  .filter((q) => q.length === ustunlar.length && q.every((x) => x === '0' || x === '1'))
  .map((q) => q.map(Number))

console.log(`${toliq.length} ta to'liq urinish, ${ustunlar.length} ta savol`)
if (toliq.length < MIN_QATOR) {
  console.error(`Kamida ${MIN_QATOR} ta urinish kerak. Hozircha taxminiy qiyinlik qoladi.`)
  process.exit(1)
}

const natija = kalibrla(toliq, ustunlar)
if (!natija.yaqinlashdi) {
  console.error("Hisob yaqinlashmadi, natija yozilmaydi. Ma'lumotni tekshiring.")
  process.exit(1)
}

console.log(`Ishonchlilik: ${natija.ishonchlilik} (0.8 dan yuqori bo'lishi kerak)`)
console.log(`Chetga olingan o'quvchilar: ${natija.tashlangan}`)
if (natija.chetda.length) console.log(`Chetga olingan savollar: ${natija.chetda.join(', ')}`)

const muammoli = natija.savollar.filter((s) => s.muammo.length)
console.log(`Ko'rib chiqish kerak: ${muammoli.length} ta savol`)
for (const s of muammoli) {
  console.log(
    `  ${s.kalit}: ${s.muammo.join(', ')} ` +
      `(b=${s.qiyinlik}, infit=${s.infit}, outfit=${s.outfit}, bog'lanish=${s.korrelyatsiya}, ${s.togriFoiz}% to'g'ri)`
  )
}

mkdirSync('output', { recursive: true })
const hisobot = join('output', `ms-kalibrlash-${slug}.csv`)
writeFileSync(
  hisobot,
  ['kalit,qiyinlik,se,infit,outfit,boglanish,togri_foiz,muammo']
    .concat(natija.savollar.map((s) =>
      [s.kalit, s.qiyinlik, s.se, s.infit, s.outfit, s.korrelyatsiya, s.togriFoiz, s.muammo.join(' ')].join(',')
    ))
    .join('\n') + '\n'
)
console.log(`Hisobot: ${hisobot}`)

if (!yoz) {
  console.log('Bankka yozilmadi. Yozish uchun --yoz qo\'shing.')
  process.exit(0)
}

const qiymatlar = Object.fromEntries(natija.savollar.map((s) => [s.kalit.split('#')[1], s.qiyinlik]))
const yangi = { ...KALIBRLASH, [slug]: qiymatlar }
writeFileSync(
  join('data', 'milliy-sertifikat', 'kalibrlash.js'),
  `// data/milliy-sertifikat/kalibrlash.js
//
// AVTOMATIK YARATILGAN. Qo'lda tahrirlamang: npm run ms:kalibrla -- <slug> --yoz
//
// Haqiqiy javoblardan hisoblangan qiyinliklar: { slug: { savolId: logit } }.
// Bu yerdagi qiymat savol faylidagi taxminiy qiyinlikdan ustun turadi.
export const KALIBRLASH = ${JSON.stringify(yangi, null, 2)}
`
)
console.log(`${slug}: ${natija.savollar.length} ta savol qiyinligi yangilandi`)
