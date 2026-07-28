/**
 * Reaksiyalarda qatnashadigan moddalarning xavfsizlik ma'lumotini PubChem'dan
 * yuklaydi.
 *
 * Nega bu alohida skript: xavfsizlik — bazadagi eng jiddiy ma'lumot. Uni
 * o'ylab topib bo'lmaydi, manbasi ko'rsatilishi shart. PubChem (AQSh Milliy
 * salomatlik instituti) GHS klassifikatsiyasini ochiq beradi — H-kodlar
 * xalqaro standart.
 *
 * Ishga tushirish:
 *   node scripts/fetch-pubchem-hazards.js
 *   node scripts/fetch-pubchem-hazards.js --yangila   (keshni e'tiborsiz qoldiradi)
 *
 * Natija: data/pubchem-hazards.json — formula -> {cid, nom, xavflar[]}
 * Kesh borligi uchun qayta ishga tushirish tez tugaydi.
 */
const fs = require('fs')
const path = require('path')
const esmRequire = require('./_esm-require')

const { azoniOqi } = esmRequire('lib/chem-balance.js', [
  'balansTekshir',
  'balansIzohi',
  'azoniOqi',
])

const { OILALAR } = require(path.join(__dirname, '..', 'data', 'reactions'))
const { oilaniYoy } = require(path.join(__dirname, '..', 'data', 'reactions', '_umumiy'))

const CHIQISH = path.join(__dirname, '..', 'data', 'pubchem-hazards.json')
const PUG = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug'
const PUG_VIEW = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug_view'

const yangila = process.argv.includes('--yangila')

// ─────────────────────────────────────────────────────────────
// H-kodlarning o'zbekcha tarjimasi.
// Tarjima qilinmagan kod uchun PubChem'ning inglizcha matni qoladi —
// noto'g'ri tarjimadan ko'ra shu yaxshi.
// ─────────────────────────────────────────────────────────────
const H_KODLAR = {
  H200: 'Beqaror portlovchi modda',
  H220: 'Juda tez alangalanuvchi gaz',
  H221: 'Alangalanuvchi gaz',
  H222: 'Juda tez alangalanuvchi aerozol',
  H224: 'Juda tez alangalanuvchi suyuqlik va bug\'',
  H225: 'Tez alangalanuvchi suyuqlik va bug\'',
  H226: 'Alangalanuvchi suyuqlik va bug\'',
  H228: 'Alangalanuvchi qattiq modda',
  H240: 'Qizdirilganda portlashi mumkin',
  H242: 'Qizdirilganda yonishi mumkin',
  H250: 'Havoda o\'z-o\'zidan alangalanadi',
  H260: 'Suv bilan alangalanuvchi gaz ajratadi',
  H261: 'Suv bilan alangalanuvchi gaz hosil qiladi',
  H270: 'Yong\'inni kuchaytiradi — oksidlovchi',
  H271: 'Yong\'in yoki portlashga sabab bo\'lishi mumkin — kuchli oksidlovchi',
  H272: 'Yong\'inni kuchaytirishi mumkin — oksidlovchi',
  H280: 'Bosim ostidagi gaz — qizdirilsa portlaydi',
  H290: 'Metallarni yemirishi mumkin',
  H300: 'Yutilsa halokatli',
  H301: 'Yutilsa zaharli',
  H302: 'Yutilsa zararli',
  H304: 'Nafas yo\'liga tushsa halokatli bo\'lishi mumkin',
  H310: 'Teriga tegsa halokatli',
  H311: 'Teriga tegsa zaharli',
  H312: 'Teriga tegsa zararli',
  H314: 'Teriga og\'ir kuyish va ko\'zga jiddiy shikast yetkazadi',
  H315: 'Terini qitiqlaydi',
  H317: 'Teri allergiyasiga sabab bo\'lishi mumkin',
  H318: 'Ko\'zga jiddiy shikast yetkazadi',
  H319: 'Ko\'zni kuchli qitiqlaydi',
  H330: 'Nafas olinsa halokatli',
  H331: 'Nafas olinsa zaharli',
  H332: 'Nafas olinsa zararli',
  H334: 'Nafas olinsa allergiya yoki astma keltirib chiqarishi mumkin',
  H335: 'Nafas yo\'llarini qitiqlashi mumkin',
  H336: 'Uyquchanlik yoki bosh aylanishiga sabab bo\'lishi mumkin',
  H340: 'Genetik nuqsonlarga olib kelishi mumkin',
  H341: 'Genetik nuqson keltirib chiqarishi ehtimoli bor',
  H350: 'Saraton kasalligini keltirib chiqarishi mumkin',
  H351: 'Saraton keltirib chiqarishi ehtimoli bor',
  H360: 'Homiladorlikka yoki nasl qoldirishga zarar yetkazishi mumkin',
  H361: 'Nasl qoldirishga zarar yetkazishi ehtimoli bor',
  H370: 'A\'zolarga shikast yetkazadi',
  H371: 'A\'zolarga shikast yetkazishi mumkin',
  H372: 'Uzoq ta\'sirda a\'zolarga shikast yetkazadi',
  H373: 'Uzoq ta\'sirda a\'zolarga shikast yetkazishi mumkin',
  H400: 'Suv organizmlari uchun o\'ta zaharli',
  H410: 'Suv organizmlari uchun uzoq muddat zaharli',
  H411: 'Suv organizmlari uchun zaharli',
  H412: 'Suv organizmlari uchun uzoq muddat zararli',
}

/** Pastki indeksli formulani PubChem tushunadigan ko'rinishga keltiradi */
function oddiyFormula(formula) {
  const PASTKI = '₀₁₂₃₄₅₆₇₈₉'
  let natija = ''
  for (const belgi of formula) {
    const i = PASTKI.indexOf(belgi)
    if (i >= 0) natija += String(i)
    else if ('·•⋅∙'.includes(belgi)) natija += '.'
    else if ('↓↑'.includes(belgi)) continue
    else natija += belgi
  }
  return natija.trim()
}

/**
 * Tenglamadan moddalar ro'yxatini ajratadi (koeffitsientsiz).
 * @returns {{formula: string, atomlar: Record<string, number>}[]}
 */
function moddalarniAjrat(tenglama) {
  const tomonlar = String(tenglama).split(/(?:⇌|⇄|⇋|↔|⟷|<->|<=>|→|⟶|⇒|⟹|➔|➜|->|=>)/)
  const moddalar = []

  for (const tomon of tomonlar) {
    for (const xom of tomon.split(/\s+\+\s+/)) {
      const tozalangan = xom.trim()
      if (!tozalangan) continue
      try {
        const azo = azoniOqi(tozalangan)
        // Ionlar va radikallar PubChem'da boshqacha nomlanadi — tashlab ketamiz
        if (azo.zaryad !== 0) continue
        if (/[•]/.test(azo.formula)) continue

        // azoniOqi atomlarni koeffitsientga ko'paytirib qaytaradi — bittasiga bo'lamiz
        const bittasi = {}
        for (const [symbol, soni] of Object.entries(azo.atomlar)) {
          bittasi[symbol] = soni / azo.koeffitsient
        }

        moddalar.push({ formula: oddiyFormula(azo.formula), atomlar: bittasi })
      } catch {
        // O'qib bo'lmagan a'zo — balans tekshiruvchisi buni allaqachon aytadi
      }
    }
  }

  return moddalar
}

const kutish = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function soragich(url) {
  const javob = await fetch(url, { headers: { 'User-Agent': 'jda-kimyo/1.0' } })
  if (javob.status === 404) return null
  if (!javob.ok) throw new Error(`${javob.status} ${url}`)
  return javob.json()
}

/**
 * Atomlar sonini Hill yozuviga keltiradi: avval C, keyin H, qolgani alifbo
 * tartibida. PubChem'ning formula bo'yicha qidiruvi shu ko'rinishni kutadi.
 *
 *   Al(OH)₃        -> AlH3O3
 *   [Cu(NH₃)₄]SO₄  -> CuH12N4O4S
 */
function hillYozuvi(atomlar) {
  const belgilar = Object.keys(atomlar)
  const tartib = []

  if (belgilar.includes('C')) tartib.push('C')
  if (belgilar.includes('H')) tartib.push('H')
  tartib.push(...belgilar.filter((s) => s !== 'C' && s !== 'H').sort())

  return tartib.map((s) => (atomlar[s] === 1 ? s : `${s}${atomlar[s]}`)).join('')
}

/**
 * Formula bo'yicha PubChem CID ni topadi.
 *
 * Ikki urinish: avval formulani nom sifatida qidiramiz ("H2SO4" ni PubChem
 * sulfat kislota deb tanidi), topilmasa Hill yozuvida formula bo'yicha
 * qidiramiz. Ikkinchisi "Al(OH)3" kabi yozuvlarni ham topadi.
 */
async function cidTop(formula, atomlar) {
  const nomJavobi = await soragich(
    `${PUG}/compound/name/${encodeURIComponent(formula)}/cids/JSON`,
  )
  const nomdan = nomJavobi?.IdentifierList?.CID?.[0]
  if (nomdan) return { cid: nomdan, usul: 'nom' }

  if (!atomlar) return { cid: null, usul: null }

  await kutish(220)
  const hill = hillYozuvi(atomlar)
  const formulaJavobi = await soragich(
    `${PUG}/compound/fastformula/${encodeURIComponent(hill)}/cids/JSON?MaxRecords=1`,
  )
  const formuladan = formulaJavobi?.IdentifierList?.CID?.[0]

  return formuladan ? { cid: formuladan, usul: `formula (${hill})` } : { cid: null, usul: null }
}

/** CID bo'yicha GHS xavflarini oladi */
async function xavflarniOl(cid) {
  const url = `${PUG_VIEW}/data/compound/${cid}/JSON?heading=GHS+Classification`
  const javob = await soragich(url)
  if (!javob) return []

  // Javob chuqur ichma-ich — H-kodlarni butun matndan qidirgan qulayroq
  const matn = JSON.stringify(javob)
  const topilgan = new Map()

  for (const moslik of matn.matchAll(/(H\d{3})[^"]{0,120}/g)) {
    const kod = moslik[1]
    if (topilgan.has(kod)) continue

    // "H314: Causes severe skin burns..." dan izohni ajratamiz
    const izoh = moslik[0].replace(/^H\d{3}\s*(\([^)]*\))?\s*:?\s*/, '').split(' [')[0].trim()
    topilgan.set(kod, H_KODLAR[kod] || izoh || kod)
  }

  return [...topilgan.entries()].map(([kod, matn]) => ({ kod, matn }))
}

async function main() {
  const reaksiyalar = OILALAR.flatMap(oilaniYoy)

  const moddalar = new Map()
  for (const r of reaksiyalar) {
    for (const m of moddalarniAjrat(r.equation)) {
      if (!moddalar.has(m.formula)) moddalar.set(m.formula, m.atomlar)
    }
  }

  console.log(`${reaksiyalar.length} ta reaksiyada ${moddalar.size} ta noyob modda`)

  const kesh = !yangila && fs.existsSync(CHIQISH)
    ? JSON.parse(fs.readFileSync(CHIQISH, 'utf8'))
    : {}

  let yangi = 0
  let topilmadi = 0
  let sanoq = 0

  for (const [formula, atomlar] of [...moddalar].sort((a, b) => a[0].localeCompare(b[0]))) {
    sanoq++

    // Topilgan yozuv keshdan olinadi. Topilmagani qayta urinib ko'riladi —
    // qidiruv usuli yaxshilangan bo'lishi mumkin.
    if (kesh[formula]?.cid) continue

    try {
      const { cid, usul } = await cidTop(formula, atomlar)
      await kutish(220) // PubChem: sekundiga 5 tadan ko'p so'rov yubormaslik kerak

      if (!cid) {
        kesh[formula] = { cid: null, xavflar: [] }
        topilmadi++
        console.log(`  —    ${formula.padEnd(16)} PubChem'da topilmadi`)
        continue
      }

      const xavflar = await xavflarniOl(cid)
      await kutish(220)

      kesh[formula] = { cid, xavflar }
      yangi++
      console.log(
        `  ok   ${formula.padEnd(16)} CID ${String(cid).padEnd(9)} ${xavflar.length} ta ogohlantirish` +
          `  (${usul}) [${sanoq}/${moddalar.size}]`,
      )
    } catch (xato) {
      console.log(`  XATO ${formula.padEnd(16)} ${xato.message}`)
      // Keshga yozmaymiz — keyingi urinishda qayta so'raladi
    }
  }

  fs.writeFileSync(CHIQISH, JSON.stringify(kesh, null, 2) + '\n')

  const xavfliSoni = Object.values(kesh).filter((q) => q.xavflar.length > 0).length
  console.log(`\nYozildi: data/pubchem-hazards.json`)
  console.log(`  yangi yuklandi:      ${yangi}`)
  console.log(`  PubChem'da yo'q:     ${topilmadi}`)
  console.log(`  xavf ma'lumoti bor:  ${xavfliSoni}/${Object.keys(kesh).length}`)
}

main().catch((xato) => {
  console.error('XATO:', xato.message)
  process.exitCode = 1
})
