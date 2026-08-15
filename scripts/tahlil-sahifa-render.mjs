// scripts/tahlil-sahifa-render.mjs
//
// Yangi dinamik tahlil sahifasini Next.js siz, to'g'ridan-to'g'ri
// render qiladi va HTML ni qaytaradi.
//
// NEGA KERAK. `next build` bu muhitda Prisma binarlari yuklanmagani
// uchun ishlamayapti (tarmoq cheklovi). Lekin AGENTS.md 8-bandi aniq:
// "da'vo qilishdan oldin ishga tushiring". Sahifa server komponenti va
// hech qanday bazaga tegmaydi, shuning uchun uni React'ning o'zi bilan
// render qilib, natijani KO'RISH mumkin.
//
// Bu skript ikki narsani isbotlaydi:
//   1) sahifa xatosiz render bo'ladi (12 birikmaning hammasi);
//   2) ma'lumotdagi matn HTML ga HAQIQATAN tushadi — matn-surat
//      solishtiruvi shu chiqishdan oziqlanadi.
//
// Ishlatish:
//   node scripts/tahlil-sahifa-render.mjs nmr co-nh3-6 > /tmp/sahifa.html

import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { transform } from 'sucrase'

const require = createRequire(import.meta.url)
const ILDIZ = process.cwd()

// JSX va `@/` yo'llarini Node tushunmaydi — ularni yuklashda
// o'giramiz. `sucrase` loyihada allaqachon bor (Tailwind bog'liqligi),
// shuning uchun yangi paket qo'shilmaydi.
const asliyJs = require.extensions['.js']
require.extensions['.js'] = function (modul, fayl) {
  if (fayl.includes('node_modules')) return asliyJs(modul, fayl)
  const manba = readFileSync(fayl, 'utf8')
  const { code } = transform(manba, {
    transforms: ['jsx', 'imports'],
    jsxRuntime: 'automatic',
    filePath: fayl,
  })
  modul._compile(code, fayl)
}
require.extensions['.jsx'] = require.extensions['.js']

// `@/...` — loyiha ildizidan boshlanadigan yo'l (jsconfig.json).
const Module = require('node:module')
const asliyResolve = Module._resolveFilename
Module._resolveFilename = function (soralgan, ...qolgan) {
  if (soralgan.startsWith('@/')) {
    soralgan = path.join(ILDIZ, soralgan.slice(2))
  }
  return asliyResolve.call(this, soralgan, ...qolgan)
}

// `next/link` server renderda oddiy <a> bo'lishi kifoya — bizga
// navigatsiya emas, chiqqan matn kerak.
require.cache[require.resolve('next/link')] = {
  id: 'next/link',
  filename: 'next/link',
  loaded: true,
  exports: {
    __esModule: true,
    default: ({ href, children, ...q }) =>
      require('react').createElement('a', { href, ...q }, children),
  },
}

const [, , usul, birikma] = process.argv
if (!usul) {
  console.error('Ishlatish: node scripts/tahlil-sahifa-render.mjs <usul> [birikma]')
  process.exit(1)
}

const { renderToStaticMarkup } = require('react-dom/server')
const sahifaModuli = require(
  path.join(ILDIZ, 'app/ilmiy/tahlil/[usul]/birikmalar/[birikma]/page.js')
)
const Sahifa = sahifaModuli.default
const { generateStaticParams, generateMetadata } = sahifaModuli

const royxat = generateStaticParams().filter(
  (p) => p.usul === usul && (!birikma || p.birikma === birikma)
)

if (!royxat.length) {
  console.error(`Topilmadi: ${usul}${birikma ? '/' + birikma : ''}`)
  process.exit(1)
}

let xato = 0
for (const params of royxat) {
  try {
    const element = await Sahifa({ params: Promise.resolve(params) })
    const html = renderToStaticMarkup(element)
    const meta = await generateMetadata({ params: Promise.resolve(params) })

    if (birikma) {
      // Bitta birikma so'ralgan — HTML ni chiqaramiz (surat olish uchun).
      process.stdout.write(html)
    } else {
      const matn = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      console.error(
        `✓ ${params.birikma.padEnd(22)} ${String(html.length).padStart(6)} bayt HTML, ` +
          `${String(matn.length).padStart(5)} belgi matn · "${meta.title}"`
      )
    }
  } catch (e) {
    xato++
    console.error(`✗ ${params.birikma}: ${e.message}`)
    if (process.env.BATAFSIL) console.error(e.stack)
  }
}

if (xato) process.exit(1)
