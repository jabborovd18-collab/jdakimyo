// Erkin sandboxdagi ikki reagentli aralashmalarning deklarativ qoidalari.
//
// Bu tenglamalar bazasining o'rnini bosmaydi: u yerda aniq mahsulot, nisbat va
// xavfsizlik bor. Matritsa faqat tenglama topilmaganda sandboxga "nima
// kuzatildi" degan xavfsiz javob qaytaradi; shu sabab noma'lum mahsulot
// inventarga hech qachon qo'shilmaydi.

const ERKIN_ARALASHMA_MATRITSASI = Object.freeze({
  kislotalar: Object.freeze(["HCl", "H₂SO₄", "HNO₃", "H₃PO₄", "CH₃COOH"]),
  asoslar: Object.freeze(["NaOH", "KOH", "Ca(OH)₂", "Ba(OH)₂", "NH₃·H₂O"]),
  ionlar: Object.freeze({
    "AgNO₃": Object.freeze(["Ag⁺", "NO₃⁻"]),
    "BaCl₂": Object.freeze(["Ba²⁺", "Cl⁻"]),
    "Ba(NO₃)₂": Object.freeze(["Ba²⁺", "NO₃⁻"]),
    "CaCl₂": Object.freeze(["Ca²⁺", "Cl⁻"]),
    "Pb(NO₃)₂": Object.freeze(["Pb²⁺", "NO₃⁻"]),
    "CuSO₄": Object.freeze(["Cu²⁺", "SO₄²⁻"]),
    "FeCl₃": Object.freeze(["Fe³⁺", "Cl⁻"]),
    "NaOH": Object.freeze(["Na⁺", "OH⁻"]),
    "KOH": Object.freeze(["K⁺", "OH⁻"]),
    "NaCl": Object.freeze(["Na⁺", "Cl⁻"]),
    "KI": Object.freeze(["K⁺", "I⁻"]),
    "Na₂SO₄": Object.freeze(["Na⁺", "SO₄²⁻"]),
    "Na₂CO₃": Object.freeze(["Na⁺", "CO₃²⁻"]),
  }),
  chokmalar: Object.freeze([
    Object.freeze({ ionlar: Object.freeze(["Ag⁺", "Cl⁻"]), kuzatuv: "Oq suzmasimon cho'kma tushadi." }),
    Object.freeze({ ionlar: Object.freeze(["Ag⁺", "I⁻"]), kuzatuv: "Sariq cho'kma tushadi." }),
    Object.freeze({ ionlar: Object.freeze(["Ba²⁺", "SO₄²⁻"]), kuzatuv: "Oq bariy sulfat cho'kmasi tushadi." }),
    Object.freeze({ ionlar: Object.freeze(["Ca²⁺", "CO₃²⁻"]), kuzatuv: "Oq kalsiy karbonat cho'kmasi tushadi." }),
    Object.freeze({ ionlar: Object.freeze(["Pb²⁺", "I⁻"]), kuzatuv: "Sariq qo'rg'oshin(II) yodid cho'kmasi tushadi." }),
    Object.freeze({ ionlar: Object.freeze(["Cu²⁺", "OH⁻"]), kuzatuv: "Och ko'k jelesimon cho'kma tushadi." }),
    Object.freeze({ ionlar: Object.freeze(["Fe³⁺", "OH⁻"]), kuzatuv: "Qizil-jigarrang cho'kma tushadi." }),
  ]),
})

module.exports = { ERKIN_ARALASHMA_MATRITSASI }
