// lib/chem-search.js
//
// Kimyoviy formulalarni qidirish uchun normalizatsiya.
//
// Muammo: formulalar chiroyli ko'rinishi uchun pastki indeks bilan yoziladi
// ("H₂SO₄"), lekin ko'pchilik klaviaturada "₂" belgisi yo'q. Foydalanuvchi
// "H2SO4" deb yozadi va hech narsa topilmaydi.
//
// Yechim: saqlashda ham, qidirishda ham formulani bir xil "oddiy" ko'rinishga
// keltiramiz — indekslar oddiy raqamga, strelkalar "->" ga aylanadi.
//
//   "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O"  ->  "h2so4 + 2naoh -> na2so4 + 2h2o"
//   "H2SO4"                          ->  "h2so4"          (mos keladi)
//   "H2"                             ->  "h2"             (ichida bor)

const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉'
const SUPERSCRIPTS = '⁰¹²³⁴⁵⁶⁷⁸⁹'

// Belgi -> almashtiruv jadvali
const CHAR_MAP = new Map()

for (let digit = 0; digit <= 9; digit++) {
  CHAR_MAP.set(SUBSCRIPTS[digit], String(digit))
  CHAR_MAP.set(SUPERSCRIPTS[digit], String(digit))
}

// Yuqori indeksdagi zaryad belgilari: [Co(NH₃)₆]³⁺ -> [co(nh3)6]3+
CHAR_MAP.set('⁺', '+')
CHAR_MAP.set('⁻', '-')
CHAR_MAP.set('₊', '+')
CHAR_MAP.set('₋', '-')

// Reaksiya strelkalarining barcha ko'rinishi bir xil bo'lsin
for (const arrow of ['→', '⟶', '⇒', '⟹', '➔', '➜']) CHAR_MAP.set(arrow, '->')
for (const arrow of ['⇌', '⇄', '⇋', '↔', '⟷']) CHAR_MAP.set(arrow, '<->')

// Gidratlardagi nuqta: CuSO₄·5H₂O -> cuso4*5h2o
for (const dot of ['·', '•', '⋅', '∙']) CHAR_MAP.set(dot, '*')

// Turli tire va qo'shtirnoqlar
for (const dash of ['–', '—', '−']) CHAR_MAP.set(dash, '-')

/**
 * Formulani qidirishga yaroqli ko'rinishga keltiradi.
 * Bo'sh joylar saqlanadi (so'zlar ajralib tursin).
 */
export function normalizeChemText(input) {
  if (!input) return ''

  let result = ''
  for (const char of String(input)) {
    result += CHAR_MAP.has(char) ? CHAR_MAP.get(char) : char
  }

  return result
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Zich ko'rinish: bo'sh joylar va qavslar olib tashlanadi.
 *
 * Buning sababi — foydalanuvchi "[Co(NH₃)₆]³⁺" ni turlicha yozishi mumkin:
 * "Co(NH3)6", "co nh3 6", "CoNH36". Qavs va bo'shliqni tashlab yuborsak,
 * uchalasi ham bir xil "conh36..." bo'ladi.
 *
 * DIQQAT: "+", "-", "*" va strelka ATAYLAB saqlanadi. Agar ularni ham
 * tashlaganimizda "H₂ + O₂" -> "h2o2" bo'lib, vodorod peroksid (H₂O₂)
 * qidirilganda noto'g'ri topilardi.
 */
export function compactChemText(input) {
  return normalizeChemText(input)
    .replace(/[()[\]{}]/g, '')
    .replace(/\s+/g, '')
}

/**
 * Bitta reaksiya (yoki birikma) uchun qidiruv matnini yig'adi.
 * Bir nechta maydonni birlashtiradi, shunda nomi bo'yicha ham topiladi.
 *
 * @param {string[]} parts — equation, name, category, mahsulotlar va h.k.
 * @returns {{ searchText: string, searchCompact: string }}
 */
export function buildSearchIndex(parts) {
  const joined = parts.filter(Boolean).join(' | ')
  return {
    searchText: normalizeChemText(joined),
    searchCompact: compactChemText(joined),
  }
}

/**
 * Foydalanuvchi so'rovini ikki ko'rinishda qaytaradi —
 * biri bo'sh joyli, ikkinchisi bo'shliqsiz.
 */
export function normalizeQuery(query) {
  return {
    text: normalizeChemText(query),
    compact: compactChemText(query),
  }
}
