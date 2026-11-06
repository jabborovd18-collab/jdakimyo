// lib/milliy-sertifikat-bank.js
//
// Savol bankining sifat darvozasi.
//   xatolar         — sinov ochiq turishi mumkin emas (test yiqiladi)
//   ogohlantirishlar — ishlaydi, lekin mazmun hali tayyor emas
//
// Nega kerak: "hamma javob A" va "katalog 50 deydi, savol 30 ta" kabi nuqsonlar
// oylab bilinmay turgan. Ularni ko'z bilan emas, tekshiruv bilan tutish kerak.

const HARFLAR = ["A", "B", "C", "D", "E", "F"]

// Nega 80: bundan qisqa izoh odatda yechimni emas, faqat javobni aytadi
const YECHIM_MIN_UZUNLIK = 80
// Nega 0.5: 4 variantda bir harf yarmidan ko'p bo'lsa, taxmin bilan ball olinadi
const HARF_MAKS_ULUSH = 0.5

/** Rasmli savollar variantlari rasm ichida, ularni aralashtirib bo'lmaydi. */
function aralashadimi(savol) {
  return typeof savol.correct === "number" && Array.isArray(savol.options)
}

/**
 * @param {{ slug: string, savollarSoni: number }} variant
 * @param {object[]} savollar
 * @param {(rasm: string) => boolean} [rasmBormi]
 * @returns {{ xatolar: string[], ogohlantirishlar: string[] }}
 */
export function tekshirBank(variant, savollar, rasmBormi = () => true) {
  const xatolar = []
  const ogohlantirishlar = []

  if (savollar.length !== variant.savollarSoni) {
    xatolar.push(`Katalogda ${variant.savollarSoni} ta, bankda ${savollar.length} ta savol`)
  }
  if (new Set(savollar.map((s) => s.id)).size !== savollar.length) {
    xatolar.push("Takroriy savol ID si bor")
  }

  const harflar = {}
  let izohsiz = 0
  let qisqaIzoh = 0

  for (const s of savollar) {
    if (!s.question && !s.rasm) xatolar.push(`${s.id}: savol matni ham, rasmi ham yo'q`)
    if (s.correct === undefined || s.correct === null || s.correct === "") {
      xatolar.push(`${s.id}: to'g'ri javob yo'q`)
      continue
    }
    if (!Number.isFinite(Number(s.qiyinlik))) xatolar.push(`${s.id}: qiyinlik son emas`)

    for (const rasm of [s.rasm, s.kontekstRasm]) {
      if (rasm && !rasmBormi(rasm)) xatolar.push(`${s.id}: rasm topilmadi (${rasm})`)
    }

    if (!s.explanation) izohsiz++
    else if (s.explanation.length < YECHIM_MIN_UZUNLIK) qisqaIzoh++

    if (s.turi === "ochiq") {
      if (Number.isNaN(parseFloat(String(s.correct).replace(",", ".")))) {
        xatolar.push(`${s.id}: ochiq savol javobi son emas`)
      }
      continue
    }

    const soni = (s.options || HARFLAR.slice(0, 4)).length
    const indeks =
      typeof s.correct === "number" ? s.correct : HARFLAR.indexOf(String(s.correct).toUpperCase())
    if (indeks < 0 || indeks >= soni) {
      xatolar.push(`${s.id}: javob variantlardan tashqarida (${s.correct})`)
    } else if (!aralashadimi(s)) {
      harflar[HARFLAR[indeks]] = (harflar[HARFLAR[indeks]] || 0) + 1
    }
  }

  const jamiHarf = Object.values(harflar).reduce((a, b) => a + b, 0)
  for (const [harf, soni] of Object.entries(harflar)) {
    if (soni / jamiHarf > HARF_MAKS_ULUSH) {
      xatolar.push(`To'g'ri javoblarning ${soni}/${jamiHarf} tasi ${harf}: taxmin bilan ball olinadi`)
    }
  }

  if (izohsiz) ogohlantirishlar.push(`${izohsiz} ta savolda izoh yo'q`)
  if (qisqaIzoh) ogohlantirishlar.push(`${qisqaIzoh} ta izoh yechim emas, juda qisqa`)

  return { xatolar, ogohlantirishlar }
}
