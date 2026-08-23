// scripts/gen-ochiq-lugat.js
//
// OCHIQ LUG'AT GENERATORI — GitHub'da e'lon qilinadigan ma'lumot to'plami.
//
// NEGA BU ISH QILINADI. Sun'iy intellekt qidiruvi saytning O'ZI haqidagi
// da'vosiga emas, mustaqil manbalardagi eslatishga ishonadi. Bo'sh GitHub
// hisobi bunday eslatma bermaydi — foydali ochiq ma'lumot beradi. O'zbek
// tilida kimyoviy formula/nom/rang to'plami ochiq holda yo'q, JDA KIMYO
// bazasida esa u allaqachon bor.
//
// NEGA GENERATOR, QO'LDA EMAS. Lug'at qo'lda yozilsa, u saytdagi
// ma'lumotning ikkinchi nusxasi bo'lardi va birinchi o'zgarishdayoq
// undan uzilib qolardi (AGENTS.md 1-band). Bu skript esa har safar
// jonli manbadan yig'adi:
//
//   lib/lab-modda.js       — 242 modda: rang, agregat holat, shaffoflik
//   lib/kimyo-fonetika.js  — formula → o'zbekcha nom
//   lib/fazoviy/atom-malumot.js — elementlar: massa, konfiguratsiya
//   app/ilmiy/birikmalar/*/page.js — birikma sahifalarining sarlavhasi
//
// NEGA CHIQISH REPOGA COMMIT QILINMAYDI. `ochiq-lugat/` — bu boshqa
// repozitoriyga (github.com/<hisob>/uzbek-kimyo-lugat) ko'chiriladigan
// natija. Uni bu yerda ham saqlash uchinchi nusxa yaratardi. Shuning
// uchun `.gitignore` da turadi: kerak bo'lganda qayta yasaladi.
//
// ISHLATISH:
//   node scripts/gen-ochiq-lugat.js

const fs = require('fs')
const path = require('path')
const esmRequire = require('./_esm-require')

const ROOT = path.join(__dirname, '..')
const CHIQISH = path.join(ROOT, 'ochiq-lugat')
const SANA = new Date().toISOString().slice(0, 10)

const { PALITRA, jadvalKalitlari, jadvaldanOl } = esmRequire('lib/lab-modda.js', [
  'PALITRA',
  'jadvalKalitlari',
  'jadvaldanOl',
])
const { BIRIKMALAR_LUGATI } = esmRequire('lib/kimyo-fonetika.js', ['BIRIKMALAR_LUGATI'])
const { ATOM_INFO } = esmRequire('lib/fazoviy/atom-malumot.js', ['ATOM_INFO'])

/** 0xRRGGBB sonini "#rrggbb" ga o'giradi. */
function hex(son) {
  return '#' + son.toString(16).padStart(6, '0')
}

/**
 * Fonetika lug'atida bir modda bir necha yozuvda turadi: "CuSO4",
 * "CuSO₄", "CuSO4*5H2O" — chunki u MATNDAN kelgan har xil yozilishni
 * tanishi kerak. Lug'at uchun esa pastki indeksli shakl kifoya.
 */
function ozbekchaNom(formula) {
  return BIRIKMALAR_LUGATI[formula] || null
}

/**
 * Manbadagi LaTeX belgilarini oddiy matnga o'giradi.
 *
 * NEGA. `atom-malumot.js` da tavsiflar `$\\pi$-akseptor` shaklida
 * yozilgan. Saytda ular matematik ko'rsatgich orqali chiziladi, lekin
 * ochiq lug'atni o'qigan dastur bunday belgini tushunmaydi va
 * foydalanuvchiga `$\\pi$` bo'lib ko'rinadi.
 */
function latexsiz(matn) {
  if (!matn) return null

  return matn
    .replace(/[$]\\sigma[$]/g, 'σ')
    .replace(/[$]\\pi[$]/g, 'π')
    .replace(/[$]\\delta[$]/g, 'δ')
}

// ── 1. BIRIKMALAR ───────────────────────────────────────────────────
const birikmalar = []
let nomliSoni = 0

for (const formula of jadvalKalitlari()) {
  const m = jadvaldanOl(formula)
  const nom = ozbekchaNom(formula)
  if (nom) nomliSoni++

  birikmalar.push({
    formula,
    nom_uz: nom,
    holat: m.holat,
    rang_nomi: m.rangNomi,
    rang_hex: hex(m.rang),
  })
}

birikmalar.sort((a, b) => a.formula.localeCompare(b.formula, 'en'))

// ── 1b. BIRIKMA SAHIFALARI ──────────────────────────────────────────
//
// Saytdagi har bir birikma sahifasi o'z sarlavhasida formulani va
// o'zbekcha nomni saqlaydi: "K₃[Fe(CN)₆] — qizil qon tuzi". Bu nomlar
// qo'lda yozilgan va tekshirilgan — lug'atning eng qimmatli qismi.
//
// Har yozuvga sahifa manzili ham qo'shiladi: lug'atni ishlatgan odam
// tushuntirishni qayerdan topishini bilsin.
const BIRIKMA_PAPKA = path.join(ROOT, 'app', 'ilmiy', 'birikmalar')
const sahifalar = []

for (const nom of fs.readdirSync(BIRIKMA_PAPKA)) {
  const fayl = path.join(BIRIKMA_PAPKA, nom, 'page.js')
  if (!fs.existsSync(fayl)) continue

  const kod = fs.readFileSync(fayl, 'utf8')
  const yol = `/ilmiy/birikmalar/${nom}`

  // Takroriy sahifalar (masalan `k3-fe-cn6`) canonical bilan boshqa
  // manzilga ishora qiladi. Ularni qo'shish lug'atda bir moddani ikki
  // marta ko'rsatardi.
  const canonical = kod.match(/canonical:\s*'([^']+)'/)
  if (canonical && canonical[1] !== yol) continue

  const sarlavha = kod.match(/title:\s*(["'])((?:\\.|(?!\1).)*)\1/)
  if (!sarlavha) continue

  // "K₃[Fe(CN)₆] — qizil qon tuzi" → formula va nom
  const bolak = sarlavha[2].split(/\s+[—–-]\s+/)
  if (bolak.length < 2) continue

  // Tirnoq turi ESLAB QOLINADI va yopilishi ham o'sha bo'lishi shart.
  // Aks holda o'zbekcha matndagi apostrof ("ko'zgu") qatorni erta
  // yopadi va tavsif yarmida kesiladi.
  const tavsif = kod.match(/description:\s*(["'])((?:\\.|(?!\1).)*)\1/)

  sahifalar.push({
    formula: bolak[0].trim(),
    nom_uz: bolak.slice(1).join(' — ').trim(),
    tavsif: tavsif ? tavsif[2].trim() : null,
    sahifa: `https://www.jdakimyo.uz${yol}`,
  })
}

sahifalar.sort((a, b) => a.formula.localeCompare(b.formula, 'en'))

// Lab jadvalidagi birikmaning nomi bo'lmasa, sahifadan to'ldiramiz.
const sahifaNomi = new Map(sahifalar.map((s) => [s.formula, s]))
for (const b of birikmalar) {
  const s = sahifaNomi.get(b.formula)
  if (!s) continue
  if (!b.nom_uz) {
    b.nom_uz = s.nom_uz
    nomliSoni++
  }
  b.sahifa = s.sahifa
}

// ── 2. ELEMENTLAR ───────────────────────────────────────────────────
// ATOM_INFO koordinatsion kimyoda uchraydigan elementlarni qamraydi —
// butun davriy jadval emas. Shuning uchun README da soni aniq aytiladi:
// "23 ta element" deb yozish "davriy jadval" deb yozishdan halolroq.
const elementlar = Object.entries(ATOM_INFO).map(([belgi, e]) => ({
  belgi,
  nom_uz: e.name.replace(/\s*\([^)]*\)\s*$/, ''),
  atom_raqami: e.atomic,
  atom_massasi: e.mass,
  elektron_konfiguratsiya: e.config,
  oksidlanish_darajalari: e.oxidation,
  cpk_rang: e.color,
  roli: e.role || null,
  // Tavsif atomning KOORDINATSION BIRIKMADAGI xatti-harakatini
  // aytadi (masalan σ-donor yoki π-akseptor), elementning umumiy
  // ta'rifi emas. Maydon nomi shuni ochiq bildiradi.
  koordinatsion_izoh: latexsiz(e.description),
}))

elementlar.sort((a, b) => a.atom_raqami - b.atom_raqami)

// ── 3. RANGLAR ──────────────────────────────────────────────────────
// O'zbekcha rang nomi → hex. Bu to'plamning eng kam uchraydigan qismi:
// "qonQizil", "gishtQizil", "qahrabo" kabi nomlar hech qayerda
// raqamli qiymat bilan bog'lanmagan.
const ranglar = Object.entries(PALITRA).map(([nom, son]) => ({
  nom,
  hex: hex(son),
}))

// ── YOZISH ──────────────────────────────────────────────────────────
fs.mkdirSync(CHIQISH, { recursive: true })

function yoz(fayl, malumot) {
  fs.writeFileSync(
    path.join(CHIQISH, fayl),
    JSON.stringify(malumot, null, 2) + '\n',
    'utf8',
  )
}

yoz('birikmalar.json', birikmalar)
yoz('birikma-sahifalari.json', sahifalar)
yoz('elementlar.json', elementlar)
yoz('ranglar.json', ranglar)

const README = `# O'zbekcha kimyo lug'ati / Uzbek Chemistry Dataset

Kimyoviy birikmalarning o'zbekcha nomlari, ranglari va agregat
holatlari — ochiq, mashina o'qiy oladigan shaklda.

Uzbek names, colors and physical states of chemical compounds, in an
open machine-readable format.

Manba / Source: [JDA KIMYO](https://www.jdakimyo.uz) — o'zbek tilidagi
oliy kimyo ta'lim platformasi.

Oxirgi yangilanish / Last updated: ${SANA}

## Nima uchun

O'zbek tilida kimyoviy atamalarning ochiq to'plami yo'q edi. Dasturchi
"mis kuporosi" ni \`CuSO₄·5H₂O\` ga bog'lamoqchi bo'lsa, buni qo'lda
yozib chiqishga majbur bo'lardi. Bu to'plam shu ishni bir marta
bajaradi.

Ma'lumot o'ylab topilmagan: u ishlayotgan virtual laboratoriyaning
ma'lumot bazasidan olingan va o'sha yerda har kuni ishlatiladi.

## Fayllar

### \`birikmalar.json\` — ${birikmalar.length} ta birikma

\`\`\`json
{
  "formula": "CuSO₄",
  "nom_uz": "Mis sulfat",
  "holat": "suyuq",
  "rang_nomi": "kokOch",
  "rang_hex": "#7ec8e3"
}
\`\`\`

| Maydon | Ma'nosi |
|---|---|
| \`formula\` | Kimyoviy formula, pastki indekslar Unicode belgilari bilan |
| \`nom_uz\` | O'zbekcha nomi. ${nomliSoni} ta birikmada mavjud, qolganida \`null\` |
| \`holat\` | \`qattiq\`, \`suyuq\` yoki \`gaz\` |
| \`rang_nomi\` | Rangning nomi (palitra kaliti) |
| \`rang_hex\` | O'sha rangning hex qiymati |

Ranglar haqiqiy: mis kuporosi ko'k, temir(III) gidroksid qizil-jigarrang.
Ular ekran uchun tanlanmagan, moddaning ko'rinishidan olingan.

### \`birikma-sahifalari.json\` — ${sahifalar.length} ta batafsil birikma

Har biri uchun to'liq tushuntirish sahifasi bor. Nomlar qo'lda
yozilgan va tekshirilgan.

\`\`\`json
{
  "formula": "K₃[Fe(CN)₆]",
  "nom_uz": "qizil qon tuzi",
  "tavsif": "Kaliy geksatsianoferrat(III): quyi spinli d⁵ kompleks...",
  "sahifa": "https://www.jdakimyo.uz/ilmiy/birikmalar/k3-fe-cn-6"
}
\`\`\`

### \`elementlar.json\` — ${elementlar.length} ta element

Koordinatsion kimyoda uchraydigan elementlar. Butun davriy jadval emas.

\`\`\`json
{
  "belgi": "Cu",
  "nom_uz": "Mis",
  "atom_raqami": 29,
  "atom_massasi": "63.55 u",
  "elektron_konfiguratsiya": "[Ar] 3d¹⁰ 4s¹",
  "oksidlanish_darajalari": "+1, +2",
  "cpk_rang": "#C08040"
}
\`\`\`

### \`ranglar.json\` — ${ranglar.length} ta rang

O'zbekcha rang nomlari va ularning hex qiymatlari: \`qonQizil\`,
\`gishtQizil\`, \`qahrabo\`, \`sariqOch\`. Kimyoviy kuzatuv matnini
rangga o'girish uchun.

## Ishlatish

\`\`\`js
const birikmalar = require('./birikmalar.json')

const nomi = birikmalar.find((b) => b.formula === 'CuSO₄').nom_uz
// "Mis sulfat"
\`\`\`

## Litsenziya

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.uz) —
ishlatishingiz, o'zgartirishingiz va tarqatishingiz mumkin, faqat
manbani ko'rsating:

> Manba: JDA KIMYO — https://www.jdakimyo.uz

## Hissa qo'shish

Xato topsangiz yoki nom qo'shmoqchi bo'lsangiz — issue oching.
O'zbekcha kimyoviy atamalar bo'yicha kelishuv hali to'liq emas, shuning
uchun muhokama qadrli.

Aloqa: [Telegram](https://t.me/diyorbek_jabborov) ·
[jdakimyo.uz](https://www.jdakimyo.uz)
`

fs.writeFileSync(path.join(CHIQISH, 'README.md'), README, 'utf8')

console.log(`ochiq-lugat/ yozildi:`)
console.log(`  birikmalar.json  — ${birikmalar.length} ta (${nomliSoni} tasida o'zbekcha nom bor)`)
console.log(`  birikma-sahifalari.json — ${sahifalar.length} ta`)
console.log(`  elementlar.json  — ${elementlar.length} ta`)
console.log(`  ranglar.json     — ${ranglar.length} ta`)
console.log(`  README.md`)
