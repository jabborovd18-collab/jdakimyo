/**
 * lib/ ichidagi ESM modulni oddiy node skriptida yuklash.
 *
 * Sabab: lib/*.js fayllari ESM sintaksisida (Next.js ularni o'zi kompilyatsiya
 * qiladi), loyihaning package.json'ida esa "type": "module" yo'q. Shuning uchun
 * skriptlarda ularni to'g'ridan-to'g'ri require qilib bo'lmaydi.
 *
 * Faqat sof modullar uchun: yon ta'sirsiz va yagona ruxsat etilgan import —
 * qo'shni JSON fayl (`import X from './y.json'`).
 */
const fs = require('fs')
const os = require('os')
const path = require('path')

module.exports = function esmRequire(relativePath, exportNames) {
  const toliqYol = path.join(__dirname, '..', relativePath)
  const papka = path.dirname(toliqYol)

  const source = fs
    .readFileSync(toliqYol, 'utf8')
    // JSON importi mutlaq yo'lga aylantiriladi. Nisbiy qoldirilsa
    // ishlamaydi: kod vaqtinchalik faylda, tizimning temp papkasida
    // bajariladi va `./y.json` u yerdan izlanardi.
    .replace(
      /import\s+(\w+)\s+from\s+['"](\.[^'"]+\.json)['"];?/g,
      (_, nom, yol) => `const ${nom} = require(${JSON.stringify(path.join(papka, yol))});`,
    )
    // `async` ham qamrab olinadi: `export async function` shaklini
    // hisobga olmasa, u o'zgarishsiz qolib "Unexpected token 'export'"
    // beradi va sabab moduldan izlanadi, holbuki ayb shu yerda.
    .replace(/export\s+(async\s+)?(function|const|class|let)\s+/g, '$1$2 ')
    .replace(/export\s+default\s+[^\n;]+;?/g, '')
    // `export { A, B }` — qayta eksport shakli (module.exports quyida qo'shiladi)
    .replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm, '')

  const withExports = `${source}\nmodule.exports = { ${exportNames.join(', ')} };\n`

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
