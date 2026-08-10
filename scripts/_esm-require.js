/**
 * lib/ ichidagi ESM modulni oddiy node skriptida yuklash.
 *
 * Sabab: lib/*.js fayllari ESM sintaksisida (Next.js ularni o'zi kompilyatsiya
 * qiladi), loyihaning package.json'ida esa "type": "module" yo'q. Shuning uchun
 * skriptlarda ularni to'g'ridan-to'g'ri require qilib bo'lmaydi.
 *
 * Yon ta'sirsiz (sof) modullar uchun. Ruxsat etilgan importlar:
 *   - qo'shni JSON fayl:  import X from './y.json'
 *   - qo'shni ESM modul:  import { a } from './y.js'
 *
 * Qo'shni modul REKURSIV ravishda ichkariga ko'chiriladi va bog'liqlik
 * tartibida joylashtiriladi. Nega kerak bo'ldi: `lib/lab-birlik.js`
 * o'lchov birligini `lib/lab-modda.js` dagi agregat holatdan chiqaradi.
 * Ikkalasini alohida yuklab bo'lmaydi — birinchisi ikkinchisisiz ishlamaydi,
 * qoidani esa skriptda takrorlash ikkinchi haqiqat manbai yaratardi.
 */
const fs = require('fs')
const os = require('os')
const path = require('path')

/** Bitta faylni CJS da bajariladigan holga keltiradi (importlarsiz). */
function manbaniTayyorla(toliqYol) {
  const papka = path.dirname(toliqYol)

  return fs
    .readFileSync(toliqYol, 'utf8')
    // JSON importi mutlaq yo'lga aylantiriladi. Nisbiy qoldirilsa
    // ishlamaydi: kod vaqtinchalik faylda, tizimning temp papkasida
    // bajariladi va `./y.json` u yerdan izlanardi.
    .replace(
      /import\s+(\w+)\s+from\s+['"](\.[^'"]+\.json)['"];?/g,
      (_, nom, yol) => `const ${nom} = require(${JSON.stringify(path.join(papka, yol))});`,
    )
    // Qo'shni ESM modul importi olib tashlanadi — uning kodi allaqachon
    // yuqorida turadi, ya'ni nomlar shu qamrovda mavjud.
    .replace(/^\s*import\s+[^;]*?\s+from\s+['"]\.[^'"]+\.js['"];?\s*$/gm, '')
    // `async` ham qamrab olinadi: `export async function` shaklini
    // hisobga olmasa, u o'zgarishsiz qolib "Unexpected token 'export'"
    // beradi va sabab moduldan izlanadi, holbuki ayb shu yerda.
    .replace(/export\s+(async\s+)?(function|const|class|let)\s+/g, '$1$2 ')
    .replace(/export\s+default\s+[^\n;]+;?/g, '')
    // `export { A, B }` — qayta eksport shakli (module.exports quyida qo'shiladi)
    .replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm, '')
}

/** Fayldagi qo'shni `.js` importlarining mutlaq yo'llari. */
function qoshniModullar(toliqYol) {
  const papka = path.dirname(toliqYol)
  const manba = fs.readFileSync(toliqYol, 'utf8')
  const yollar = []
  const naqsh = /^\s*import\s+[^;]*?\s+from\s+['"](\.[^'"]+\.js)['"];?\s*$/gm
  let moslik
  while ((moslik = naqsh.exec(manba)) !== null) {
    yollar.push(path.resolve(papka, moslik[1]))
  }
  return yollar
}

module.exports = function esmRequire(relativePath, exportNames) {
  const ildiz = path.join(__dirname, '..', relativePath)

  // Bog'liqlik tartibida yig'amiz: `const` ko'tarilmaydi (hoisting yo'q),
  // shuning uchun modul o'zini ishlatadigan koddan OLDIN turishi shart.
  const korilgan = new Set()
  const boliklar = []

  const yigh = (yol) => {
    if (korilgan.has(yol)) return
    korilgan.add(yol)
    for (const qoshni of qoshniModullar(yol)) yigh(qoshni)
    boliklar.push(manbaniTayyorla(yol))
  }
  yigh(ildiz)

  const withExports = `${boliklar.join('\n')}\nmodule.exports = { ${exportNames.join(', ')} };\n`

  const tempFile = path.join(
    os.tmpdir(),
    `jda-esm-${Date.now()}-${Math.random().toString(36).slice(2)}.cjs`,
  )
  fs.writeFileSync(tempFile, withExports, 'utf8')

  try {
    return require(tempFile)
  } finally {
    fs.unlinkSync(tempFile)
  }
}
