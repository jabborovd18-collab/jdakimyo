// scripts/count-ilmiy.js
//
// Ilmiy bo'limdagi mazmun hajmini sanaydi va lib/ilmiy-hajm.json ga yozadi.
//
// Nega kerak: sahifadagi raqamlar qo'lda yozilgan edi va vaqt o'tib
// haqiqatdan uzoqlashgan — "50+ kompleks birikma" deb turardi, aslida 34 ta;
// footer "20+ tahlil usuli" deydi, aslida roppa-rosa 20. Endi raqamlar
// fayllardan sanaladi, ya'ni noto'g'ri bo'lishi uchun kimdir ataylab
// JSON'ni tahrirlashi kerak.
//
// Yangi birikma yoki usul qo'shilgach ishga tushiring:
//   node scripts/count-ilmiy.js

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const ILMIY = path.join(ROOT, 'app', 'ilmiy')

/** Papka ichidagi papkalar nomi (fayllar hisobga olinmaydi). */
function papkalar(...bolaklar) {
  const p = path.join(...bolaklar)
  if (!fs.existsSync(p)) return []
  return fs
    .readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    // Next.js'ning maxsus papkalari sanoqqa kirmasin
    .filter((n) => !n.startsWith('_') && !n.startsWith('[') && !n.startsWith('('))
}

/** Ichma-ich yurib berilgan shartga mos narsalarni sanaydi. */
function chuqurSana(boshlanish, moslikmi) {
  let soni = 0
  const yur = (joriy) => {
    for (const d of fs.readdirSync(joriy, { withFileTypes: true })) {
      const toliq = path.join(joriy, d.name)
      if (d.isDirectory()) {
        if (moslikmi({ nom: d.name, papka: true })) soni++
        yur(toliq)
      } else if (moslikmi({ nom: d.name, papka: false })) {
        soni++
      }
    }
  }
  if (fs.existsSync(boshlanish)) yur(boshlanish)
  return soni
}

const birikmalar = papkalar(ILMIY, 'birikmalar')
const usullar = papkalar(ILMIY, 'tahlil')

// Har bir tahlil usulida nechta birikma tahlil qilingan
const usulHajmi = {}
for (const u of usullar) {
  usulHajmi[u] = papkalar(ILMIY, 'tahlil', u, 'birikmalar').length
}

const mavzular = papkalar(ILMIY, 'chuqurlashgan')

const hajm = {
  // Sanoq qachon olingani — raqam eskirganini bilish uchun
  sanalgan: new Date().toISOString().slice(0, 10),

  birikmalar: birikmalar.length,
  usullar: usullar.length,
  usulHajmi,
  usulBirikmaTahlili: Object.values(usulHajmi).reduce((a, b) => a + b, 0),

  mavzular: mavzular.length,
  mavzuSahifalari: chuqurSana(
    path.join(ILMIY, 'chuqurlashgan'),
    ({ nom, papka }) => !papka && nom === 'page.js'
  ),

  modellar3d: chuqurSana(ILMIY, ({ nom, papka }) => papka && nom === '3d'),
}

hajm.jamiTahlilVaMavzu = hajm.usulBirikmaTahlili + hajm.mavzuSahifalari

const chiqish = path.join(ROOT, 'lib', 'ilmiy-hajm.json')
fs.writeFileSync(chiqish, JSON.stringify(hajm, null, 2) + '\n')

console.log('lib/ilmiy-hajm.json yangilandi:')
console.log(`  birikmalar            ${hajm.birikmalar}`)
console.log(`  tahlil usullari       ${hajm.usullar}`)
console.log(`  usul x birikma        ${hajm.usulBirikmaTahlili}`)
console.log(`  chuqur mavzular       ${hajm.mavzular} (${hajm.mavzuSahifalari} sahifa)`)
console.log(`  3D modellar           ${hajm.modellar3d}`)
