// data/laboratoriya/reagentlar.js
//
// AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
// Yangilash: node scripts/gen-lab-reagentlar.js
//
// Manba: Reaction jadvalidagi tenglamalarning IKKALA tomoni.
// Nodirlik va narx modda nechta reaksiyada uchrashidan kelib chiqadi —
// bu son o'ylab topilmagan, kimyo bazasining o'zidan chiqqan.
//
// `uchraydi` — nechta reaksiyada reagent (chap tomonda)
// `chiqadi`  — nechta reaksiyada mahsulot (o'ng tomonda)
//
// narx = 0 bo'lgani sotib olinmaydi: uni faqat tajribada YASASH mumkin.
//
// Jami: 242 ta (shundan 94 tasi faqat mahsulot)
//   oddiy      13 ta
//   kam        30 ta
//   nodir      50 ta
//   noyob      149 ta

module.exports = [
  {
    "kalit": "H₂O",
    "nom": "H₂O",
    "nodirlik": "oddiy",
    "uchraydi": 32,
    "chiqadi": 89,
    "narx": 4,
    "gemsNarxi": null,
    "oilalar": [
      "Asid-baza",
      "Biokimyo",
      "Cho'ktirish",
      "Kislota-asos",
      "Metall reaksiyalari",
      "Oksidlanish",
      "Oksidlar va galogenlar",
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar",
      "Redoks",
      "Sanoat jarayonlari",
      "Sifat reaksiyalari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 1
  },
  {
    "kalit": "NaOH",
    "nom": "NaOH",
    "nodirlik": "oddiy",
    "uchraydi": 31,
    "chiqadi": 3,
    "narx": 4,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Kompleks birikmalar",
      "Metall reaksiyalari",
      "Oksidlar va galogenlar",
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar",
      "Redoks",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "HCl",
    "nom": "HCl",
    "nodirlik": "oddiy",
    "uchraydi": 25,
    "chiqadi": 9,
    "narx": 4,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Metall reaksiyalari",
      "Oksidlar va galogenlar",
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar",
      "Precipitatsiya",
      "Redoks",
      "Sifat reaksiyalari",
      "Sintez",
      "Termik parchalanish"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "O₂",
    "nom": "O₂",
    "nodirlik": "oddiy",
    "uchraydi": 17,
    "chiqadi": 12,
    "narx": 4,
    "gemsNarxi": null,
    "oilalar": [
      "Biokimyo",
      "Oksidlanish",
      "Oksidlar va galogenlar",
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar",
      "Redoks",
      "Sanoat jarayonlari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 1
  },
  {
    "kalit": "H₂SO₄",
    "nom": "H₂SO₄",
    "nodirlik": "oddiy",
    "uchraydi": 15,
    "chiqadi": 1,
    "narx": 4,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Metall reaksiyalari",
      "Oksidlanish",
      "Redoks",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "NH₃",
    "nom": "NH₃",
    "nodirlik": "oddiy",
    "uchraydi": 14,
    "chiqadi": 7,
    "narx": 4,
    "gemsNarxi": null,
    "oilalar": [
      "Biokimyo",
      "Kislota-asos",
      "Kompleks",
      "Kompleks birikmalar",
      "Organik: funksional guruhlar",
      "Sanoat jarayonlari",
      "Sifat reaksiyalari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "Cl₂",
    "nom": "Cl₂",
    "nodirlik": "oddiy",
    "uchraydi": 11,
    "chiqadi": 2,
    "narx": 4,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlar va galogenlar",
      "Organik: uglevodorodlar",
      "Redoks",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "H₂",
    "nom": "H₂",
    "nodirlik": "oddiy",
    "uchraydi": 9,
    "chiqadi": 26,
    "narx": 4,
    "gemsNarxi": null,
    "oilalar": [
      "Metall reaksiyalari",
      "Oksidlar va galogenlar",
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar",
      "Redoks",
      "Sanoat jarayonlari",
      "Sintez"
    ],
    "sotishNarxi": 1
  },
  {
    "kalit": "CO₂",
    "nom": "CO₂",
    "nodirlik": "oddiy",
    "uchraydi": 9,
    "chiqadi": 24,
    "narx": 4,
    "gemsNarxi": null,
    "oilalar": [
      "Biokimyo",
      "Cho'ktirish",
      "Kislota-asos",
      "Oksidlanish",
      "Oksidlar va galogenlar",
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar",
      "Redoks",
      "Sanoat jarayonlari",
      "Sifat reaksiyalari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 1
  },
  {
    "kalit": "HNO₃",
    "nom": "HNO₃",
    "nodirlik": "oddiy",
    "uchraydi": 9,
    "chiqadi": 3,
    "narx": 4,
    "gemsNarxi": null,
    "oilalar": [
      "Kislota-asos",
      "Metall reaksiyalari",
      "Oksidlanish",
      "Oksidlar va galogenlar",
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar",
      "Precipitatsiya",
      "Sanoat jarayonlari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "AgNO₃",
    "nom": "AgNO₃",
    "nodirlik": "oddiy",
    "uchraydi": 9,
    "chiqadi": 0,
    "narx": 4,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Kompleks birikmalar",
      "Metall reaksiyalari",
      "Precipitatsiya",
      "Termik parchalanish"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "CH₃COOH",
    "nom": "CH₃COOH",
    "nodirlik": "oddiy",
    "uchraydi": 8,
    "chiqadi": 1,
    "narx": 4,
    "gemsNarxi": null,
    "oilalar": [
      "Kislota-asos",
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "C₂H₅OH",
    "nom": "C₂H₅OH",
    "nodirlik": "kam",
    "uchraydi": 6,
    "chiqadi": 5,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Biokimyo",
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "Ca(OH)₂",
    "nom": "Ca(OH)₂",
    "nodirlik": "kam",
    "uchraydi": 6,
    "chiqadi": 3,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Asid-baza",
      "Kislota-asos",
      "Metall reaksiyalari",
      "Organik: uglevodorodlar",
      "Sanoat jarayonlari",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "CuSO₄",
    "nom": "CuSO₄",
    "nodirlik": "kam",
    "uchraydi": 6,
    "chiqadi": 2,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Kompleks",
      "Kompleks birikmalar",
      "Metall reaksiyalari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "H₃PO₄",
    "nom": "H₃PO₄",
    "nodirlik": "kam",
    "uchraydi": 6,
    "chiqadi": 1,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Asid-baza",
      "Kislota-asos",
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Zn",
    "nom": "Zn",
    "nodirlik": "kam",
    "uchraydi": 6,
    "chiqadi": 1,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Metall reaksiyalari",
      "Organik: funksional guruhlar",
      "Sanoat jarayonlari",
      "Sintez"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Br₂",
    "nom": "Br₂",
    "nodirlik": "kam",
    "uchraydi": 6,
    "chiqadi": 0,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlar va galogenlar",
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar",
      "Redoks"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "KI",
    "nom": "KI",
    "nodirlik": "kam",
    "uchraydi": 6,
    "chiqadi": 0,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Kompleks birikmalar",
      "Redoks"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "C₂H₄",
    "nom": "C₂H₄",
    "nodirlik": "kam",
    "uchraydi": 5,
    "chiqadi": 4,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "Cu",
    "nom": "Cu",
    "nodirlik": "kam",
    "uchraydi": 5,
    "chiqadi": 4,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Metall reaksiyalari",
      "Oksidlanish",
      "Redoks",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "C₂H₂",
    "nom": "C₂H₂",
    "nodirlik": "kam",
    "uchraydi": 5,
    "chiqadi": 2,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Fe",
    "nom": "Fe",
    "nodirlik": "kam",
    "uchraydi": 5,
    "chiqadi": 2,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Metall reaksiyalari",
      "Redoks",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Al",
    "nom": "Al",
    "nodirlik": "kam",
    "uchraydi": 5,
    "chiqadi": 1,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Metall reaksiyalari",
      "Redoks",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "C",
    "nom": "C",
    "nodirlik": "kam",
    "uchraydi": 5,
    "chiqadi": 0,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlanish",
      "Redoks",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "KMnO₄",
    "nom": "KMnO₄",
    "nodirlik": "kam",
    "uchraydi": 5,
    "chiqadi": 0,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Redoks",
      "Termik parchalanish"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "SO₂",
    "nom": "SO₂",
    "nodirlik": "kam",
    "uchraydi": 4,
    "chiqadi": 5,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Kislota-asos",
      "Metall reaksiyalari",
      "Oksidlanish",
      "Oksidlar va galogenlar",
      "Sanoat jarayonlari",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 1
  },
  {
    "kalit": "CaCO₃",
    "nom": "CaCO₃",
    "nodirlik": "kam",
    "uchraydi": 4,
    "chiqadi": 4,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Oksidlar va galogenlar",
      "Sanoat jarayonlari",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "Na₂CO₃",
    "nom": "Na₂CO₃",
    "nodirlik": "kam",
    "uchraydi": 4,
    "chiqadi": 3,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Organik: uglevodorodlar",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "C₆H₆",
    "nom": "C₆H₆",
    "nodirlik": "kam",
    "uchraydi": 4,
    "chiqadi": 2,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Cu(OH)₂",
    "nom": "Cu(OH)₂",
    "nodirlik": "kam",
    "uchraydi": 4,
    "chiqadi": 2,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Kompleks birikmalar",
      "Organik: funksional guruhlar",
      "Sifat reaksiyalari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "FeSO₄",
    "nom": "FeSO₄",
    "nodirlik": "kam",
    "uchraydi": 4,
    "chiqadi": 2,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Kompleks birikmalar",
      "Metall reaksiyalari",
      "Redoks"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "CH₄",
    "nom": "CH₄",
    "nodirlik": "kam",
    "uchraydi": 4,
    "chiqadi": 1,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: uglevodorodlar",
      "Redoks",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "KOH",
    "nom": "KOH",
    "nodirlik": "kam",
    "uchraydi": 4,
    "chiqadi": 1,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Kislota-asos",
      "Metall reaksiyalari",
      "Organik: funksional guruhlar",
      "Redoks"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "H⁺",
    "nom": "H⁺",
    "nodirlik": "kam",
    "uchraydi": 4,
    "chiqadi": 0,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Redoks",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Mg",
    "nom": "Mg",
    "nodirlik": "kam",
    "uchraydi": 4,
    "chiqadi": 0,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Metall reaksiyalari",
      "Redoks"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "OH⁻",
    "nom": "OH⁻",
    "nodirlik": "kam",
    "uchraydi": 4,
    "chiqadi": 0,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "SiO₂",
    "nom": "SiO₂",
    "nodirlik": "kam",
    "uchraydi": 4,
    "chiqadi": 0,
    "narx": 10,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlar va galogenlar",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "NaCl",
    "nom": "NaCl",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 12,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Redoks",
      "Sanoat jarayonlari",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 1
  },
  {
    "kalit": "Na₂SO₄",
    "nom": "Na₂SO₄",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 6,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "Al₂O₃",
    "nom": "Al₂O₃",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 3,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Oksidlar va galogenlar",
      "Redoks",
      "Sanoat jarayonlari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "CH₃CHO",
    "nom": "CH₃CHO",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 3,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Oksidlanish",
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "C₂H₅Br",
    "nom": "C₂H₅Br",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 2,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 8
  },
  {
    "kalit": "C₆H₁₂O₆",
    "nom": "C₆H₁₂O₆",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 2,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Biokimyo"
    ],
    "sotishNarxi": 7
  },
  {
    "kalit": "FeCl₃",
    "nom": "FeCl₃",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 2,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Cho'ktirish",
      "Kompleks birikmalar",
      "Redoks"
    ],
    "sotishNarxi": 8
  },
  {
    "kalit": "NaHCO₃",
    "nom": "NaHCO₃",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 2,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Kislota-asos",
      "Organik: funksional guruhlar",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Al(OH)₃",
    "nom": "Al(OH)₃",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 1,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Termik parchalanish"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "CaO",
    "nom": "CaO",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 1,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Oksidlar va galogenlar",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "BaCl₂",
    "nom": "BaCl₂",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 0,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Cho'ktirish"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "C₆H₅OH",
    "nom": "C₆H₅OH",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 0,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "Fe²⁺",
    "nom": "Fe²⁺",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 0,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Redoks",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "Na",
    "nom": "Na",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 0,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Metall reaksiyalari",
      "Organik: funksional guruhlar",
      "Redoks"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "Na₂S₂O₃",
    "nom": "Na₂S₂O₃",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 0,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Kompleks birikmalar",
      "Redoks"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "Pb(NO₃)₂",
    "nom": "Pb(NO₃)₂",
    "nodirlik": "nodir",
    "uchraydi": 3,
    "chiqadi": 0,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Cho'ktirish",
      "Termik parchalanish"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "CO",
    "nom": "CO",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 5,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Organik: funksional guruhlar",
      "Redoks",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "HBr",
    "nom": "HBr",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 3,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Oksidlar va galogenlar",
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "Fe³⁺",
    "nom": "Fe³⁺",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 2,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Redoks",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 8
  },
  {
    "kalit": "Mg(OH)₂",
    "nom": "Mg(OH)₂",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 2,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Metall reaksiyalari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "NH₄Cl",
    "nom": "NH₄Cl",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 2,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Kislota-asos",
      "Sanoat jarayonlari",
      "Sifat reaksiyalari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "C₂H₆",
    "nom": "C₂H₆",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 1,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 7
  },
  {
    "kalit": "CH₃Cl",
    "nom": "CH₃Cl",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 1,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "CuO",
    "nom": "CuO",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 1,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Oksidlar va galogenlar",
      "Redoks",
      "Termik parchalanish"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "Fe₂O₃",
    "nom": "Fe₂O₃",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 1,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Redoks",
      "Sanoat jarayonlari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "Zn(OH)₂",
    "nom": "Zn(OH)₂",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 1,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Cho'ktirish",
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "C₁₂H₂₂O₁₁",
    "nom": "C₁₂H₂₂O₁₁",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 0,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Biokimyo"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "CO₃²⁻",
    "nom": "CO₃²⁻",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 0,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "H₂O₂",
    "nom": "H₂O₂",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 0,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "K₂CrO₄",
    "nom": "K₂CrO₄",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 0,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Cho'ktirish"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "Na₂S",
    "nom": "Na₂S",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 0,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Cho'ktirish",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "ZnO",
    "nom": "ZnO",
    "nodirlik": "nodir",
    "uchraydi": 2,
    "chiqadi": 0,
    "narx": 25,
    "gemsNarxi": 1,
    "oilalar": [
      "Oksidlar va galogenlar",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "NaNO₃",
    "nom": "NaNO₃",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 5,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Termik parchalanish"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "NO₂",
    "nom": "NO₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 5,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Metall reaksiyalari",
      "Sanoat jarayonlari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 1
  },
  {
    "kalit": "CH₃COONa",
    "nom": "CH₃COONa",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 4,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Kislota-asos",
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 1
  },
  {
    "kalit": "NO",
    "nom": "NO",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 4,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Metall reaksiyalari",
      "Oksidlanish",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "AgCl",
    "nom": "AgCl",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 3,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Cho'ktirish",
      "Kompleks birikmalar",
      "Precipitatsiya",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "AlCl₃",
    "nom": "AlCl₃",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 3,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Metall reaksiyalari",
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 5
  },
  {
    "kalit": "CaCl₂",
    "nom": "CaCl₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 3,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "I₂",
    "nom": "I₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 3,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Oksidlar va galogenlar",
      "Redoks"
    ],
    "sotishNarxi": 6
  },
  {
    "kalit": "KBr",
    "nom": "KBr",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 3,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Cho'ktirish",
      "Organik: funksional guruhlar",
      "Redoks"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "MgCl₂",
    "nom": "MgCl₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 3,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Metall reaksiyalari",
      "Redoks"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Fe(OH)₃",
    "nom": "Fe(OH)₃",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 2,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Cho'ktirish",
      "Sifat reaksiyalari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 9
  },
  {
    "kalit": "ZnSO₄",
    "nom": "ZnSO₄",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 2,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Cho'ktirish",
      "Metall reaksiyalari"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "AgBr",
    "nom": "AgBr",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Cho'ktirish",
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 16
  },
  {
    "kalit": "AgI",
    "nom": "AgI",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Cho'ktirish",
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "Ba(NO₃)₂",
    "nom": "Ba(NO₃)₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos"
    ],
    "sotishNarxi": 17
  },
  {
    "kalit": "Ba(OH)₂",
    "nom": "Ba(OH)₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Kislota-asos",
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "C₆H₅CH₃",
    "nom": "C₆H₅CH₃",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 8
  },
  {
    "kalit": "C₆H₅NH₂",
    "nom": "C₆H₅NH₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 18
  },
  {
    "kalit": "C₆H₅NO₂",
    "nom": "C₆H₅NO₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: funksional guruhlar",
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "CH₃COOC₂H₅",
    "nom": "CH₃COOC₂H₅",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "CO(NH₂)₂",
    "nom": "CO(NH₂)₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Biokimyo"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "FeCl₂",
    "nom": "FeCl₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Metall reaksiyalari",
      "Redoks"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "H₂S",
    "nom": "H₂S",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Oksidlar va galogenlar",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 8
  },
  {
    "kalit": "HgI₂",
    "nom": "HgI₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 20
  },
  {
    "kalit": "KClO₃",
    "nom": "KClO₃",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 12
  },
  {
    "kalit": "N₂",
    "nom": "N₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sanoat jarayonlari",
      "Termik parchalanish"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "Na₂SO₃",
    "nom": "Na₂SO₃",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Kislota-asos",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Na₃PO₄",
    "nom": "Na₃PO₄",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos"
    ],
    "sotishNarxi": 5
  },
  {
    "kalit": "P₂O₅",
    "nom": "P₂O₅",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Oksidlar va galogenlar",
      "Redoks"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "SO₃",
    "nom": "SO₃",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 6
  },
  {
    "kalit": "SO₄²⁻",
    "nom": "SO₄²⁻",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 1,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Kompleks",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 6
  },
  {
    "kalit": "(C₁₇H₃₅COO)₃C₃H₅",
    "nom": "(C₁₇H₃₅COO)₃C₃H₅",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "(NH₄)₂Cr₂O₇",
    "nom": "(NH₄)₂Cr₂O₇",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Termik parchalanish"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "[Ag(NH₃)₂]OH",
    "nom": "[Ag(NH₃)₂]OH",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Ag⁺",
    "nom": "Ag⁺",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Ba²⁺",
    "nom": "Ba²⁺",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "BaO",
    "nom": "BaO",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "C₃H₈",
    "nom": "C₃H₈",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "C₆H₁₄",
    "nom": "C₆H₁₄",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Ca",
    "nom": "Ca",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Metall reaksiyalari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Ca²⁺",
    "nom": "Ca²⁺",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "CaC₂",
    "nom": "CaC₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "CaSO₄·2H₂O",
    "nom": "CaSO₄·2H₂O",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Termik parchalanish"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "CH₃CH₂OH",
    "nom": "CH₃CH₂OH",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Oksidlanish"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "CH₃NH₂",
    "nom": "CH₃NH₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "CH₃OH",
    "nom": "CH₃OH",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Oksidlanish"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Cl⁻",
    "nom": "Cl⁻",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "CoCl₂",
    "nom": "CoCl₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Cr(OH)₃",
    "nom": "Cr(OH)₃",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Cr₂O₇²⁻",
    "nom": "Cr₂O₇²⁻",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Cu²⁺",
    "nom": "Cu²⁺",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Cu₂S",
    "nom": "Cu₂S",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "CuSO₄·5H₂O",
    "nom": "CuSO₄·5H₂O",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Termik parchalanish"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "F₂",
    "nom": "F₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "H₂C₂O₄",
    "nom": "H₂C₂O₄",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "HCOOH",
    "nom": "HCOOH",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "HgCl₂",
    "nom": "HgCl₂",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "HI",
    "nom": "HI",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "I⁻",
    "nom": "I⁻",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "K",
    "nom": "K",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Metall reaksiyalari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "K₂Cr₂O₇",
    "nom": "K₂Cr₂O₇",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "K₃[Fe(CN)₆]",
    "nom": "K₃[Fe(CN)₆]",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "K₄[Fe(CN)₆]",
    "nom": "K₄[Fe(CN)₆]",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "KCN",
    "nom": "KCN",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "KSCN",
    "nom": "KSCN",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "MgCO₃",
    "nom": "MgCO₃",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Termik parchalanish"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "MnO₄⁻",
    "nom": "MnO₄⁻",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "N₂O₅",
    "nom": "N₂O₅",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Na₂O",
    "nom": "Na₂O",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "NH₄⁺",
    "nom": "NH₄⁺",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "NH₄HCO₃",
    "nom": "NH₄HCO₃",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Termik parchalanish"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "NH₄NO₃",
    "nom": "NH₄NO₃",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Termik parchalanish"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "NiSO₄",
    "nom": "NiSO₄",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "P",
    "nom": "P",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Pb²⁺",
    "nom": "Pb²⁺",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "PCl₅",
    "nom": "PCl₅",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "SCN⁻",
    "nom": "SCN⁻",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "SO₃²⁻",
    "nom": "SO₃²⁻",
    "nodirlik": "noyob",
    "uchraydi": 1,
    "chiqadi": 0,
    "narx": 60,
    "gemsNarxi": 3,
    "oilalar": [
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "KCl",
    "nom": "KCl",
    "nodirlik": "oddiy",
    "uchraydi": 0,
    "chiqadi": 9,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Kislota-asos",
      "Kompleks birikmalar",
      "Redoks"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "K₂SO₄",
    "nom": "K₂SO₄",
    "nodirlik": "kam",
    "uchraydi": 0,
    "chiqadi": 5,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar",
      "Redoks"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "BaSO₄",
    "nom": "BaSO₄",
    "nodirlik": "kam",
    "uchraydi": 0,
    "chiqadi": 4,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Cu(NO₃)₂",
    "nom": "Cu(NO₃)₂",
    "nodirlik": "kam",
    "uchraydi": 0,
    "chiqadi": 4,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Metall reaksiyalari",
      "Oksidlanish"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "KNO₃",
    "nom": "KNO₃",
    "nodirlik": "kam",
    "uchraydi": 0,
    "chiqadi": 4,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "Ag",
    "nom": "Ag",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 3,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Metall reaksiyalari",
      "Organik: funksional guruhlar",
      "Termik parchalanish"
    ],
    "sotishNarxi": 1
  },
  {
    "kalit": "MgO",
    "nom": "MgO",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 3,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Redoks",
      "Termik parchalanish"
    ],
    "sotishNarxi": 6
  },
  {
    "kalit": "MnSO₄",
    "nom": "MnSO₄",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 3,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 9
  },
  {
    "kalit": "Na₂[Zn(OH)₄]",
    "nom": "Na₂[Zn(OH)₄]",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 3,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Metall reaksiyalari",
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 6
  },
  {
    "kalit": "Ca₃(PO₄)₂",
    "nom": "Ca₃(PO₄)₂",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Asid-baza",
      "Kislota-asos"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "CaSiO₃",
    "nom": "CaSiO₃",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlar va galogenlar",
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 5
  },
  {
    "kalit": "CaSO₄",
    "nom": "CaSO₄",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kislota-asos",
      "Termik parchalanish"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "CH₃COONH₄",
    "nom": "CH₃COONH₄",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "CuCl₂",
    "nom": "CuCl₂",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Fe(OH)₂",
    "nom": "Fe(OH)₂",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Fe(SCN)₃",
    "nom": "Fe(SCN)₃",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "Fe₂(SO₄)₃",
    "nom": "Fe₂(SO₄)₃",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "Na[Al(OH)₄]",
    "nom": "Na[Al(OH)₄]",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kislota-asos",
      "Metall reaksiyalari"
    ],
    "sotishNarxi": 6
  },
  {
    "kalit": "Na₃[Ag(S₂O₃)₂]",
    "nom": "Na₃[Ag(S₂O₃)₂]",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "NaBr",
    "nom": "NaBr",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar",
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 7
  },
  {
    "kalit": "NaI",
    "nom": "NaI",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar",
      "Redoks"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "PbI₂",
    "nom": "PbI₂",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish",
      "Sifat reaksiyalari"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "ZnCl₂",
    "nom": "ZnCl₂",
    "nodirlik": "nodir",
    "uchraydi": 0,
    "chiqadi": 2,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Metall reaksiyalari",
      "Sintez"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "(CH₃CO)₂O",
    "nom": "(CH₃CO)₂O",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "(CH₃COO)₂Zn",
    "nom": "(CH₃COO)₂Zn",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "(NH₄)₂SO₄",
    "nom": "(NH₄)₂SO₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kislota-asos"
    ],
    "sotishNarxi": 6
  },
  {
    "kalit": "[Ag(NH₃)₂]Cl",
    "nom": "[Ag(NH₃)₂]Cl",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "[Ag(NH₃)₂]NO₃",
    "nom": "[Ag(NH₃)₂]NO₃",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 6
  },
  {
    "kalit": "[Co(NH₃)₆]Cl₂",
    "nom": "[Co(NH₃)₆]Cl₂",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "[Cu(NH₃)₄](OH)₂",
    "nom": "[Cu(NH₃)₄](OH)₂",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 13
  },
  {
    "kalit": "[Cu(NH₃)₄]²⁺",
    "nom": "[Cu(NH₃)₄]²⁺",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks"
    ],
    "sotishNarxi": 6
  },
  {
    "kalit": "[Cu(NH₃)₄]SO₄",
    "nom": "[Cu(NH₃)₄]SO₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 13
  },
  {
    "kalit": "[Ni(NH₃)₆]SO₄",
    "nom": "[Ni(NH₃)₆]SO₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "[Zn(NH₃)₄](OH)₂",
    "nom": "[Zn(NH₃)₄](OH)₂",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 20
  },
  {
    "kalit": "Ag₂CrO₄",
    "nom": "Ag₂CrO₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish"
    ],
    "sotishNarxi": 8
  },
  {
    "kalit": "Ag₃PO₄",
    "nom": "Ag₃PO₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish"
    ],
    "sotishNarxi": 18
  },
  {
    "kalit": "Al₂(SO₄)₃",
    "nom": "Al₂(SO₄)₃",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Metall reaksiyalari"
    ],
    "sotishNarxi": 8
  },
  {
    "kalit": "BaCrO₄",
    "nom": "BaCrO₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish"
    ],
    "sotishNarxi": 12
  },
  {
    "kalit": "C₁₇H₃₅COONa",
    "nom": "C₁₇H₃₅COONa",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 6
  },
  {
    "kalit": "C₂H₂Br₄",
    "nom": "C₂H₂Br₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 15
  },
  {
    "kalit": "C₂H₃Cl",
    "nom": "C₂H₃Cl",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 7
  },
  {
    "kalit": "C₂H₄Br₂",
    "nom": "C₂H₄Br₂",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "C₂H₅CN",
    "nom": "C₂H₅CN",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 21
  },
  {
    "kalit": "C₂H₅OC₂H₅",
    "nom": "C₂H₅OC₂H₅",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 5
  },
  {
    "kalit": "C₂H₅ONa",
    "nom": "C₂H₅ONa",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 8
  },
  {
    "kalit": "C₃H₅(OH)₃",
    "nom": "C₃H₅(OH)₃",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 18
  },
  {
    "kalit": "C₃H₆",
    "nom": "C₃H₆",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 15
  },
  {
    "kalit": "C₃H₆O₃",
    "nom": "C₃H₆O₃",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Biokimyo"
    ],
    "sotishNarxi": 6
  },
  {
    "kalit": "C₆H₁₂",
    "nom": "C₆H₁₂",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 11
  },
  {
    "kalit": "C₆H₂(NO₂)₃CH₃",
    "nom": "C₆H₂(NO₂)₃CH₃",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 18
  },
  {
    "kalit": "C₆H₂(NO₂)₃OH",
    "nom": "C₆H₂(NO₂)₃OH",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 9
  },
  {
    "kalit": "C₆H₂Br₃OH",
    "nom": "C₆H₂Br₃OH",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 13
  },
  {
    "kalit": "C₆H₅Br",
    "nom": "C₆H₅Br",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 5
  },
  {
    "kalit": "C₆H₅NH₃Cl",
    "nom": "C₆H₅NH₃Cl",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "C₆H₅ONa",
    "nom": "C₆H₅ONa",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 7
  },
  {
    "kalit": "Ca(HCO₃)₂",
    "nom": "Ca(HCO₃)₂",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kislota-asos"
    ],
    "sotishNarxi": 9
  },
  {
    "kalit": "CH₂Cl₂",
    "nom": "CH₂Cl₂",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: uglevodorodlar"
    ],
    "sotishNarxi": 7
  },
  {
    "kalit": "CH₃COCl",
    "nom": "CH₃COCl",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "CH₃NH₃Cl",
    "nom": "CH₃NH₃Cl",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Cr₂(SO₄)₃",
    "nom": "Cr₂(SO₄)₃",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 18
  },
  {
    "kalit": "Cr₂O₃",
    "nom": "Cr₂O₃",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Termik parchalanish"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "Cr³⁺",
    "nom": "Cr³⁺",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Cu₂O",
    "nom": "Cu₂O",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 7
  },
  {
    "kalit": "CuS",
    "nom": "CuS",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish"
    ],
    "sotishNarxi": 8
  },
  {
    "kalit": "Fe₃[Fe(CN)₆]₂",
    "nom": "Fe₃[Fe(CN)₆]₂",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Fe₃O₄",
    "nom": "Fe₃O₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Metall reaksiyalari"
    ],
    "sotishNarxi": 11
  },
  {
    "kalit": "Fe₄[Fe(CN)₆]₃",
    "nom": "Fe₄[Fe(CN)₆]₃",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "H₂CO₃",
    "nom": "H₂CO₃",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "H₂SO₃",
    "nom": "H₂SO₃",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 7
  },
  {
    "kalit": "HBrO",
    "nom": "HBrO",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "HCHO",
    "nom": "HCHO",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlanish"
    ],
    "sotishNarxi": 15
  },
  {
    "kalit": "HClO",
    "nom": "HClO",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "HF",
    "nom": "HF",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 8
  },
  {
    "kalit": "K₂[HgI₄]",
    "nom": "K₂[HgI₄]",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "K₂MnO₄",
    "nom": "K₂MnO₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Termik parchalanish"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "K₃PO₄",
    "nom": "K₃PO₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kislota-asos"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "Mn²⁺",
    "nom": "Mn²⁺",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "MnCl₂",
    "nom": "MnCl₂",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 5
  },
  {
    "kalit": "MnO₂",
    "nom": "MnO₂",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Termik parchalanish"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "N₂O",
    "nom": "N₂O",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Termik parchalanish"
    ],
    "sotishNarxi": 15
  },
  {
    "kalit": "Na₂HPO₄",
    "nom": "Na₂HPO₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kislota-asos"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Na₂S₄O₆",
    "nom": "Na₂S₄O₆",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "Na₂SiO₃",
    "nom": "Na₂SiO₃",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "Na₃[Cr(OH)₆]",
    "nom": "Na₃[Cr(OH)₆]",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kompleks birikmalar"
    ],
    "sotishNarxi": 24
  },
  {
    "kalit": "NaAlO₂",
    "nom": "NaAlO₂",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "NaClO",
    "nom": "NaClO",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Redoks"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "NaH₂PO₄",
    "nom": "NaH₂PO₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kislota-asos"
    ],
    "sotishNarxi": 3
  },
  {
    "kalit": "NaHSO₄",
    "nom": "NaHSO₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Kislota-asos"
    ],
    "sotishNarxi": 2
  },
  {
    "kalit": "NaNO₂",
    "nom": "NaNO₂",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Termik parchalanish"
    ],
    "sotishNarxi": 15
  },
  {
    "kalit": "PbO",
    "nom": "PbO",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Termik parchalanish"
    ],
    "sotishNarxi": 4
  },
  {
    "kalit": "PbSO₄",
    "nom": "PbSO₄",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Cho'ktirish"
    ],
    "sotishNarxi": 12
  },
  {
    "kalit": "POCl₃",
    "nom": "POCl₃",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Organik: funksional guruhlar"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "S",
    "nom": "S",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Oksidlar va galogenlar"
    ],
    "sotishNarxi": 10
  },
  {
    "kalit": "Si",
    "nom": "Si",
    "nodirlik": "noyob",
    "uchraydi": 0,
    "chiqadi": 1,
    "narx": 0,
    "gemsNarxi": null,
    "oilalar": [
      "Sanoat jarayonlari"
    ],
    "sotishNarxi": 7
  }
]
