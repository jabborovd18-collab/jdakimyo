// lib/lab-tenglama.js
//
// Reaksiya tenglamasini laboratoriya katalogining kalitlariga aylantiradi.
//
// NEGA ALOHIDA FAYL. Bu qoida ikki joyda kerak: katalogni yasaydigan
// skript (qanday kalitlar bo'lishini u hal qiladi) va tajriba dvigateli
// (foydalanuvchi tanlagan reagentni o'sha kalitlar bilan solishtiradi).
// Ikkalasida alohida yozilsa, ular bir kun kelib bir-biridan uzilib
// qoladi va tajriba "reagent inventarda yo'q" deb turib oladi, holbuki u
// bor — faqat kaliti boshqacha yozilgan.
//
// lib/chem-balance.js dan farqi: u atomlarni sanaydi va formulani ASCII
// ga o'tkazadi ("H₂SO₄" → "H2SO4"). Bu yerda esa formula KO'RINISHI
// saqlanadi, chunki katalog kaliti ham, ekranda ko'rinadigan nom ham
// aynan o'sha yozuv.

/**
 * Tenglamani ikkiga bo'ladigan belgilar.
 *
 * `⇌` va `↔` shart: qaytar reaksiyada ular yo'q bo'lsa, tenglamaning o'ng
 * tomoni ham reagent bo'lib qolardi ("N₂ + H₂ ⇌ 2NH₃" dan "H₂ ⇌ 2NH₃").
 */
const STRELKA = /→|⇌|↔|⟶|->|<->|=/

/** Reaksiya sxemasidagi shartli belgilar — modda emas, egallik qilinmaydi */
const MODDA_EMAS = new Set(['[O]', '[H]', 'e⁻', 'hv', 'hν', 't°', 'kat', 'kat.'])

/**
 * Bitta a'zoni katalog kalitiga aylantiradi: "2NaOH" → "NaOH".
 *
 * Cho'kma (↓) va gaz (↑) belgilari OLIB TASHLANADI. Ular moddaning emas,
 * reaksiyaning xossasi: "H₂↑" bilan "H₂" bitta modda. Belgi qolsa katalogda
 * ikkita alohida yozuv paydo bo'lardi va bir reaksiyada hosil bo'lgan
 * vodorodni boshqasida ishlatib bo'lmasdi.
 *
 * @returns {{kalit: string, koef: number}|null} — modda bo'lmasa null
 */
export function azoniKalitla(xom) {
  const matn = String(xom ?? '').trim()
  if (!matn) return null

  // Koeffitsient faqat boshida turadi: "16HCl" → 16 va "HCl"
  const koefMoslik = matn.match(/^(\d+)\s*/)
  const koef = koefMoslik ? Number(koefMoslik[1]) : 1

  const kalit = matn
    .slice(koefMoslik ? koefMoslik[0].length : 0)
    .replace(/\((dilute|conc|kons|suyultirilgan|konsentrlangan)\.?\)/gi, '')
    .replace(/[↓↑⇓⇑]/g, '')
    .replace(/\s+/g, '')
    .trim()

  if (!kalit || MODDA_EMAS.has(kalit)) return null
  if (!Number.isFinite(koef) || koef < 1) return null

  return { kalit, koef }
}

/** Tenglamaning bir tomonini a'zolarga ajratadi va bir xillarini qo'shadi */
function tomonniKalitla(matn) {
  const yigindi = new Map()

  // Faqat ASCII "+" bo'linadi. Iondagi "⁺" boshqa belgi, shuning uchun
  // "Ag⁺ + Cl⁻" ikkiga to'g'ri bo'linadi.
  for (const bolak of String(matn ?? '').split('+')) {
    const azo = azoniKalitla(bolak)
    if (!azo) continue
    yigindi.set(azo.kalit, (yigindi.get(azo.kalit) ?? 0) + azo.koef)
  }

  return [...yigindi.entries()].map(([kalit, koef]) => ({ kalit, koef }))
}

/**
 * Tenglamani ikki tomonga ajratadi.
 *
 * @param {string} tenglama — "2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂↑ + 8H₂O"
 * @returns {{chap: {kalit,koef}[], ong: {kalit,koef}[]}|null}
 *          strelka topilmasa yoki tomonlardan biri bo'sh bo'lsa null
 */
export function tenglamaniAjrat(tenglama) {
  const matn = String(tenglama ?? '')
  const bolaklar = matn.split(STRELKA)
  if (bolaklar.length < 2) return null

  // Ikkitadan ko'p strelka bo'lsa tenglama tushunarsiz — taxmin qilmaymiz
  if (bolaklar.length > 2) return null

  const chap = tomonniKalitla(bolaklar[0])
  const ong = tomonniKalitla(bolaklar[1])
  if (chap.length === 0 || ong.length === 0) return null

  return { chap, ong }
}

/**
 * Reagent to'plamining barmoq izi — tartibdan qat'i nazar bir xil bo'ladi.
 *
 * Tajribada foydalanuvchi reagentlarni istalgan tartibda tanlaydi, shuning
 * uchun solishtirish uchun ikkalasi ham shu ko'rinishga keltiriladi.
 */
export function toplamKaliti(kalitlar) {
  return [...new Set(kalitlar)].sort().join(' + ')
}
