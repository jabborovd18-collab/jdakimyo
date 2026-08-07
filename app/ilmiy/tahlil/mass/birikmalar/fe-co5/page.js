"use client"

import Link from "next/link"
import { useState, useMemo, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Fe(CO)₅] — MASS-SPEKTROMETRIYA (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar:
//   • J. H. Gross — Mass Spectrometry: A Textbook (3rd ed., Springer, 2017)
//   • W. Henderson, J. S. McIndoe — Mass Spectrometry of Inorganic and
//     Organometallic Compounds (Wiley, 2005) — Chap. 4 "Metal Carbonyls"
//   • F. W. McLafferty, F. Tureček — Interpretation of Mass Spectra (4th ed.)
//   • R. B. King — J. Am. Chem. Soc. 88, 2075 (1966) — [Fe(CO)₅] mass-spektr
//   • L. Mond, C. Langer, F. Quincke — J. Chem. Soc. 59, 604 (1891) — Fe(CO)₅ kashfiyoti
//   • NIST 2021 — Atomic Weights and Isotopic Compositions (Fe izotoplari)
//   • NIST Chemistry WebBook — Mass Spectrum, ID 13463-40-6
//   • G. Wilkinson, F. G. A. Stone — Comprehensive Organometallic Chem. (Pergamon)
//   • E. W. Abel — Comprehensive Coordination Chem. II, Vol. 5 (Elsevier, 2003)
//   • IUPAC Gold Book — Mass spectrometry terminology (2013 tavsiyalari)
// Til: 100% o'zbek (lotin)
// Xususiyat: TO'LIQ nazariy tahlil, interaktiv spektr, izotop cluster,
//            fragmentatsiya zinapoyasi, HRMS aniqligi, PDF eksport
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Fe(CO)<sub>5</sub>]",
  formulaPlain: "[Fe(CO)5]",
  iupac: "Pentakarboniltemir(0)",
  commonName: "Iron pentacarbonyl",
  historicalName: "Mond, Langer, Quincke (1891) — birinchi metall karbonili",
  molarMass: 195.90,
  exactMass: 195.9094,
  averageMass: 195.897,
  casNumber: "13463-40-6",
  color: "sariq-suyuqlik (och sariq)",
  colorHex: "#F5D742",
  ionColor: "#FFA500",
  structure: "Trigonal-bipiramidal (D₃ₕ simmetriya)",
  metalCenter: "Fe⁰",
  dConfig: "d⁸ (18 e⁻ qoidasi)",
  oxidationState: "0",
  formalCharge: "neytral",
  metalLigand: "Fe–C (π-akseptor CO)",
  bondLengthEq: "1.807 Å (Fe–C ekvatorial)",
  bondLengthAx: "1.827 Å (Fe–C aksial)",
  coBondLength: "1.152 Å (C≡O)",
  bondAngle: "120° (ekv), 180° (aks)",
  pointGroup: "D₃ₕ",
  discovery: "1891 (Mond, Langer, Quincke) — Mond usuli",
  applications: "Fe metall ishlab chiqarish (Mond usuli), katalizator, organik sintez",
  synthesis: "Fe(kukun) + 5 CO(g)  →  [Fe(CO)₅]  (200 °C, 200 atm)",

  // Mass-spektrometriya asosiy parametrlari
  ionizationMethod: "EI (Elektron ionlashtirish, 70 eV)",
  altIonization: "APCI, EI-orbitrap (HRMS)",
  molecularIonMz: 196,
  molecularIonExact: 195.9094,
  baseIonMz: 196,
  baseIonNote: "[Fe(CO)₅]•⁺ — molekulyar radikal-kation (100%)",
  fragmentPattern: "Ketma-ket 5 ta CO yo'qolishi (−28 Da har biri)",
  cleavageEnergy: "Fe–CO bog' energiyasi: D̄(Fe–CO) ≈ 118 kJ/mol",
  totalBondEnergy: "5 × 118 = 590 kJ/mol (5 ta CO)",
  isotopePattern: "⁵⁴Fe (5.8%) + ⁵⁶Fe (91.7%) + ⁵⁷Fe (2.1%) + ⁵⁸Fe (0.3%)",
  rdbe: "5.5 (bir yarim halqa ekvivalenti — koordinatsion bog'lar hisobga olinganda)",
  eightenElectronRule: "Fe⁰ (8 e⁻) + 5 × CO (10 e⁻) = 18 e⁻ ✓",
}

// ═══════════════════════════════════════════════════════════════════════════════
// MASS-SPEKTR PIKLARI — FRAGMENTATSIYA ZINAPOYASI (King 1966, NIST)
// ═══════════════════════════════════════════════════════════════════════════════
const massPeaks = [
  {
    mz: 196, exactMass: 195.9094, formula: "[Fe(CO)₅]•⁺",
    fragment: "Molekulyar ion",
    intensity: 100, intensityCode: 4, color: "text-yellow-400",
    lostFragment: "—", lostMass: 0,
    ionizationType: "M•⁺ (odd-electron)",
    diagnostic: "🎯 Molekulyar ion — 196 Da (100% intensivlik)",
    theoryNote: "Molekulyar radikal-kation [Fe(CO)₅]•⁺ EI (70 eV) sharoitida hosil bo'ladi. Fe(0) atomidan bitta elektron uzilib, D₃ₕ simmetriyani saqlagan holda musbat zaryadli radikal ion hosil bo'ladi. Bu pik NIST kutubxonasida 100% intensivlik bilan qayd qilingan — [Fe(CO)₅] uchun bu holat noyob (aksariyat organometallik komplekslarda M•⁺ zaif). Sabab: Fe–CO bog'lari kuchli π-akseptor xarakteriga ega, molekulyar orbitallar delokalizatsiyalangan → radikal ion nisbatan barqaror. Aniq massa 195.9094 Da (⁵⁶Fe + 5×¹²C + 5×¹⁶O), HRMS bilan ±1 ppm da tekshiriladi.",
    mzRange: "196.0 ± 0.3 Da (past aniqlik)",
    exactRange: "195.9094 ± 0.001 Da (HRMS)"
  },
  {
    mz: 168, exactMass: 167.9145, formula: "[Fe(CO)₄]•⁺",
    fragment: "1-fragment (−1 CO)",
    intensity: 85, intensityCode: 4, color: "text-orange-400",
    lostFragment: "CO", lostMass: 28,
    ionizationType: "Radikal ion",
    diagnostic: "1-CO yo'qolishi — 168 Da (85%)",
    theoryNote: "Birinchi CO ligandi molekulyar ion dan ajraladi. Bu bosqichda [Fe(CO)₄]•⁺ (17 elektron, koordinativ to'yinmagan) hosil bo'ladi. Yo'qolgan massa: 27.9949 Da (¹²C¹⁶O aniq). Bu pikning yuqori intensivligi (85%) Fe–CO bog'ining o'rtacha kuchini ko'rsatadi (D̄(Fe–CO) ≈ 118 kJ/mol). Fragmentatsiyani boshqaruvchi omil — koordinativ to'yinmaganlik: 18 e⁻ dan 16 e⁻ ga o'tishda oraliq (17 e⁻) muhitlashish tez. King (1966) bu polosani birinchi bo'lib to'liq tavsiflagan.",
    mzRange: "168.0 ± 0.3 Da",
    exactRange: "167.9145 ± 0.001 Da"
  },
  {
    mz: 140, exactMass: 139.9196, formula: "[Fe(CO)₃]•⁺",
    fragment: "2-fragment (−2 CO)",
    intensity: 65, intensityCode: 3, color: "text-red-400",
    lostFragment: "2 CO", lostMass: 56,
    ionizationType: "Radikal ion",
    diagnostic: "2-CO yo'qolishi — 140 Da (65%)",
    theoryNote: "Ikkinchi CO ligandi ajraladi → [Fe(CO)₃]•⁺ (15 elektron, D₃ₕ yoki C₃ᵥ). Bu bosqichda molekulyar geometriya trigonal-piramidal ga o'zgaradi (Berry pseudorotation orqali). Yo'qolgan umumiy massa: 55.9898 Da (2 × ¹²C¹⁶O). Kuzatilgan intensivlik (65%) ~ 30% pasayishi CO yo'qolishining ketma-ket ehtimolliligini aks ettiradi (P(2CO) ≈ P(1CO)²  — statistik model).",
    mzRange: "140.0 ± 0.3 Da",
    exactRange: "139.9196 ± 0.001 Da"
  },
  {
    mz: 112, exactMass: 111.9247, formula: "[Fe(CO)₂]•⁺",
    fragment: "3-fragment (−3 CO)",
    intensity: 45, intensityCode: 3, color: "text-purple-400",
    lostFragment: "3 CO", lostMass: 84,
    ionizationType: "Radikal ion",
    diagnostic: "3-CO yo'qolishi — 112 Da (45%)",
    theoryNote: "Uchinchi CO ni yo'qotish → [Fe(CO)₂]•⁺ (13 elektron, chiziqli yoki bukilgan). Bu fragment nisbatan kam barqaror, chunki koordinativ to'yinmaganlik juda katta. Yo'qolgan umumiy massa: 83.9847 Da. 45% intensivlik hali ham yuqori — 5 ta CO ligand konfiguratsiyasining simmetrik ekvivalentligini tasdiqlaydi. Ba'zi asboblarda bu pik CO yerto'lasi (Fe–C bog' cho'zilishi) tebranishi bilan yelka ko'rsatadi (metastabil o'tish, m* ≈ 89.6).",
    mzRange: "112.0 ± 0.3 Da",
    exactRange: "111.9247 ± 0.001 Da"
  },
  {
    mz: 84, exactMass: 83.9298, formula: "[Fe(CO)]•⁺",
    fragment: "4-fragment (−4 CO)",
    intensity: 25, intensityCode: 2, color: "text-cyan-400",
    lostFragment: "4 CO", lostMass: 112,
    ionizationType: "Radikal ion",
    diagnostic: "4-CO yo'qolishi — 84 Da (25%)",
    theoryNote: "To'rtinchi CO ligand uzilishi → [Fe(CO)]•⁺ (11 elektron). Bu holat koordinatsion jihatdan juda to'yinmagan, faqat gaz fazasida bir zumga mavjud bo'ladi. Yo'qolgan umumiy massa: 111.9796 Da. 25% intensivlik — bu pikning kuzatilishi Fe–CO bog'larining ketma-ket ekvivalent uzilishi haqidagi King (1966) modelini tasdiqlaydi. HRMS da bu pik ⁵⁴Fe(CO) va ⁵⁶Fe(CO) izotopomeriyasi ta'sirida biroz kengayadi.",
    mzRange: "84.0 ± 0.3 Da",
    exactRange: "83.9298 ± 0.001 Da"
  },
  {
    mz: 56, exactMass: 55.9349, formula: "Fe•⁺",
    fragment: "5-fragment (−5 CO)",
    intensity: 60, intensityCode: 3, color: "text-emerald-400",
    lostFragment: "5 CO", lostMass: 140,
    ionizationType: "Atom ion",
    diagnostic: "🔬 Barcha CO yo'qolgan — sof Fe⁺ (60%)",
    theoryNote: "Barcha 5 ta CO ligand yo'qolib, sof metall ioni Fe•⁺ (m/z=56, ⁵⁶Fe) qoladi. Yo'qolgan umumiy massa: 139.9745 Da (5 × CO). Bu pikning nisbatan yuqori intensivligi (60% — 4-fragmentdan yuqori) Fe⁺ ning termodinamik barqarorligini aks ettiradi: 3d⁷ konfiguratsiyaga ega, ⁶D yer holati. Bu pik bilan bir qatorda ⁵⁴Fe⁺ (m/z=54, 5.8%), ⁵⁷Fe⁺ (m/z=57, 2.1%) va ⁵⁸Fe⁺ (m/z=58, 0.3%) izotop piklari ham kuzatiladi — bu Fe elementining spektroskopik dalili sifatida foydalaniladi.",
    mzRange: "56.0 ± 0.3 Da",
    exactRange: "55.9349 ± 0.0001 Da",
    special: "🔥 Klassik atom pik — element identifikatsiyasi uchun"
  },
  {
    mz: 28, exactMass: 27.9949, formula: "CO•⁺",
    fragment: "Ligand ion",
    intensity: 40, intensityCode: 2, color: "text-blue-400",
    lostFragment: "Fe(CO)₄", lostMass: 168,
    ionizationType: "Radikal ion (ligand)",
    diagnostic: "CO ligand ionlashtirish mahsuloti",
    theoryNote: "Yon reaksiya: CO ligandining o'zi ionlashadi va CO•⁺ (m/z=28) hosil qiladi. Bu pik odatda 30–50% intensivlikda kuzatiladi. Bu bevosita CO ligandining EI da ionlashuv chegarasi (IE = 14.01 eV) pastligini aks ettiradi (Fe(CO)₅ IE = 8.14 eV dan farqli). Pik shakli asimmetrik — CO⁺ ionining rotatsion strukturasi (Ru rotatsion konstantasi ta'siri) ba'zi asboblarda ko'rinadi.",
    mzRange: "28.0 ± 0.2 Da",
    exactRange: "27.9949 ± 0.0001 Da"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// FE IZOTOP CLUSTER — MOLEKULYAR ION UCHUN
// ═══════════════════════════════════════════════════════════════════════════════
const isotopeCluster = [
  { mz: 194, abundance: 5.8,  isotope: "⁵⁴Fe(CO)₅", note: "⁵⁴Fe (5.845%)" },
  { mz: 195, abundance: 0.35, isotope: "⁵⁴Fe(¹³CO)(CO)₄", note: "M+1 (kichik)" },
  { mz: 196, abundance: 100,  isotope: "⁵⁶Fe(CO)₅", note: "⁵⁶Fe (91.754%) — asosiy" },
  { mz: 197, abundance: 5.9,  isotope: "⁵⁶Fe(¹³CO)(CO)₄", note: "5 × 1.07% (5 ta C)" },
  { mz: 198, abundance: 2.4,  isotope: "⁵⁷Fe(CO)₅", note: "⁵⁷Fe (2.119%)" },
  { mz: 199, abundance: 0.5,  isotope: "⁵⁸Fe(CO)₅ + ⁵⁷Fe(¹³CO)", note: "⁵⁸Fe (0.282%)" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// METALL KARBONIL SERIYASI — Fe/Ni/Cr/Mo/W taqqoslash
// ═══════════════════════════════════════════════════════════════════════════════
const carbonylSeries = [
  { formula: "[Ni(CO)₄]", mw: 170.73, mMz: 170, coCount: 4, dConfig: "d¹⁰", eightRule: "10+8=18", pattern: "4 fragment", color: "#4CC9F0", current: false, note: "Mond usuli, uchuvchan" },
  { formula: "[Fe(CO)₅]", mw: 195.90, mMz: 196, coCount: 5, dConfig: "d⁸", eightRule: "8+10=18", pattern: "5 fragment", color: "#F5D742", current: true, note: "BU KOMPLEKS — klassik" },
  { formula: "[Cr(CO)₆]", mw: 220.06, mMz: 220, coCount: 6, dConfig: "d⁶", eightRule: "6+12=18", pattern: "6 fragment", color: "#7209B7", current: false, note: "Oktaedrik, Oh simmetriya" },
  { formula: "[Mo(CO)₆]", mw: 264.00, mMz: 264, coCount: 6, dConfig: "d⁶", eightRule: "6+12=18", pattern: "6 fragment", color: "#3A0CA3", current: false, note: "Mo izotop cluster katta" },
  { formula: "[W(CO)₆]",  mw: 351.90, mMz: 352, coCount: 6, dConfig: "d⁶", eightRule: "6+12=18", pattern: "6 fragment", color: "#560BAD", current: false, note: "W izotop cluster ¹⁸²-¹⁸⁶" },
  { formula: "[Mn₂(CO)₁₀]", mw: 389.98, mMz: 390, coCount: 10, dConfig: "d⁷×2", eightRule: "17+1e⁻(bond)=18", pattern: "10 fragment", color: "#F72585", current: false, note: "Mn–Mn bog'i" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// IONLASHTIRISH USULLARI — [Fe(CO)₅] uchun
// ═══════════════════════════════════════════════════════════════════════════════
const ionizationTechniques = [
  {
    name: "EI (Elektron ionlashtirish, 70 eV)",
    description: "Klassik va tavsiya etilgan usul. Molekula gaz fazasida elektron oqimi bilan zarba oladi.",
    advantages: ["Ko'p fragment → struktura tahlili", "NIST kutubxonasida qidirish mumkin", "Uchuvchan modda uchun ideal", "M•⁺ pik yaxshi ko'rinadi (100%)"],
    disadvantages: ["Nostabil molekulalar to'liq parchalanadi", "Faqat uchuvchan namunalar", "70 eV — juda ko'p energiya"],
    bestFor: "Struktura tasdiqlash, fragmentatsiya tadqiqi",
    resolution: "Kvadrupol R ≈ 2000",
    mzRange: "20–500 Da",
    current: true,
  },
  {
    name: "EI + Q-TOF (HRMS)",
    description: "EI dan keyin Q-TOF orqali ppm aniqligida yozib olish.",
    advantages: ["±1–3 ppm aniqlik", "Molekulyar formula tasdiqlash", "Izotop cluster to'g'ri o'lchash", "Fragment aniq ID"],
    disadvantages: ["Qimmat asbob", "Kalibrash zarur (perfluorotributilamin)"],
    bestFor: "Yangi kompleks tasdiqlash, jurnal maqola uchun HRMS ma'lumot",
    resolution: "R ≈ 40 000",
    mzRange: "20–1000 Da",
    current: false,
  },
  {
    name: "APCI (musbat rejim)",
    description: "Atmosfera bosimida kimyoviy ionlashtirish — kam qutbli birikmalar uchun ESI muqobili.",
    advantages: ["Neytral, kam qutbli molekulaga mos", "[M+H]⁺ dominant", "Yumshoq — M+H⁺ saqlanadi"],
    disadvantages: ["Termik parchalanish xavfi", "[Fe(CO)₅] uchun kam ishlatilgan"],
    bestFor: "Erimadi holida (LC-MS), termik chidamli hosilalar",
    resolution: "R ≈ 5000",
    mzRange: "50–2000 Da",
    current: false,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// KOMPLEKS FRAGMENTATSIYA ZINAPOYASI (schematic)
// ═══════════════════════════════════════════════════════════════════════════════
const fragmentationLadder = [
  { level: 0, mz: 196, formula: "[Fe(CO)₅]•⁺",  electrons: 17, symmetry: "D₃ₕ",  arrow: "−CO" },
  { level: 1, mz: 168, formula: "[Fe(CO)₄]•⁺",  electrons: 15, symmetry: "C₂ᵥ/C₃ᵥ", arrow: "−CO" },
  { level: 2, mz: 140, formula: "[Fe(CO)₃]•⁺",  electrons: 13, symmetry: "C₂ᵥ",  arrow: "−CO" },
  { level: 3, mz: 112, formula: "[Fe(CO)₂]•⁺",  electrons: 11, symmetry: "C₂ᵥ/Linear", arrow: "−CO" },
  { level: 4, mz: 84,  formula: "[Fe(CO)]•⁺",   electrons: 9,  symmetry: "Cₒₒᵥ", arrow: "−CO" },
  { level: 5, mz: 56,  formula: "Fe•⁺",         electrons: 7,  symmetry: "Atom", arrow: "—" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TARIXIY XRONOLOGIYA
// ═══════════════════════════════════════════════════════════════════════════════
const historicalTimeline = [
  { year: "1888", event: "L. Mond birinchi metall karbonili — Ni(CO)₄ ni kashf etadi (Mond usuli)" },
  { year: "1891", event: "🏆 L. Mond, C. Langer, F. Quincke — [Fe(CO)₅] ni sintez qiladi (J. Chem. Soc. 59, 604)" },
  { year: "1927", event: "P. J. W. Debye — [Fe(CO)₅] ning dipol momentini o'lchaydi → D₃ₕ tasdiqlaydi" },
  { year: "1937", event: "R. V. G. Ewens, M. W. Lister — birinchi elektron difraksiya, Fe–C uzunligi" },
  { year: "1966", event: "🔬 R. B. King — [Fe(CO)₅] uchun EI mass-spektri to'liq tahlili (JACS 88, 2075)" },
  { year: "1975", event: "H. Braunschweig — DFT hisoblashlar Fe–CO bog' energiyasini tasdiqlaydi" },
  { year: "1990-", event: "Berry pseudorotation to'liq isbotlanadi (¹³C NMR, dinamik struktura)" },
  { year: "2005", event: "W. Henderson, J. S. McIndoe — organometallik mass-spektri darsligi chiqadi" },
  { year: "2015", event: "HRMS orqali [Fe(CO)₅] ning izotopologa profili aniq o'lchanadi (Orbitrap)" },
  { year: "2026", event: "🎓 O'zbekistonda jdakimyo.uz platformasida o'zbek tilida ilmiy taqdimot" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HALAQIT BERUVCHI OMILLAR
// ═══════════════════════════════════════════════════════════════════════════════
const interferences = [
  {
    source: "Havoda oksidlanish",
    range: "M•⁺ intensivligi pasayadi",
    effect: "Fe(CO)₅ havoda parchalanadi → Fe₂O₃ + CO₂. Namuna tozalanmagan bo'lsa, m/z=196 pik zaif",
    severity: "Yuqori",
    solution: "Argon atmosferasida saqlash, Schlenk texnikasi. Naming sistemasidan bevosita kirish."
  },
  {
    source: "Termik parchalanish (T > 100 °C)",
    range: "Fragmentlar noto'g'ri nisbatda",
    effect: "Yuqori haroratda [Fe(CO)₅] Fe₃(CO)₁₂ va Fe(CO)₃ ga kondensatlanadi",
    severity: "Yuqori",
    solution: "GC-MS injektorini < 80 °C ushlash. Namunani sovuq holda kiritish (ion manba T < 200 °C)."
  },
  {
    source: "Fe izotop overlap",
    range: "M+1, M+2 piklar",
    effect: "⁵⁴Fe(CO)₅ = 194, ⁵⁶Fe(¹³CO) = 197 — piklar overlap qiladi (past R da)",
    severity: "O'rta",
    solution: "HRMS (R > 20 000) ishlatish. Q-TOF yoki Orbitrap ⁵⁴Fe va ⁵⁶Fe(¹³C) ni ajratadi (Δm ≈ 0.005 Da)."
  },
  {
    source: "Fe(CO)₄²⁻ va Fe₂(CO)₉ aralashmasi",
    range: "Yuqori m/z (> 250)",
    effect: "Sintezdan qolgan Fe₂(CO)₉ (m/z=364) yoki HFe(CO)₄⁻ pik beradi",
    severity: "O'rta",
    solution: "Vakuum distillash. GC-MS bilan tozalash (retention 4–6 min, He gaz)."
  },
  {
    source: "Elektron ionlashtirish energiyasi (70 eV)",
    range: "Barcha piklar",
    effect: "70 eV — juda ko'p, molekulyar ion ta'sirlanadi. Past eV (20 eV) da M•⁺ kuchayadi, fragmentlar zaiflashadi",
    severity: "Past",
    solution: "Struktura tasdiqlash uchun 20 eV rejim. NIST kutubxonasi bilan solishtirish uchun 70 eV standart."
  },
  {
    source: "Manba ifloslanishi (Fe cho'kmalar)",
    range: "m/z=56 pik ortadi",
    effect: "Ion manba devorlarida Fe cho'kmalar → doimiy fon signali",
    severity: "O'rta",
    solution: "Manba muntazam tozalash (etil spirt, aseton). Blank spektr olish (fon = Fe⁺ signali)."
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// AMALIY AHAMIYATI
// ═══════════════════════════════════════════════════════════════════════════════
const applications = [
  { field: "Mass-spektri etaloni", detail: "Organometallik kimyoning eng klassik namunasi — 5 ta bir xil masofada CO yo'qolishi. Darslikda birinchi misol", icon: "🎓" },
  { field: "18-elektron qoidasi", detail: "Fe⁰ (8 e⁻) + 5 × CO (10 e⁻) = 18 e⁻ — Sidgwick qoidasining tasdig'i", icon: "⚛️" },
  { field: "Mond usuli (metallurgiya)", detail: "Fe metallini yuqori tozalikda ajratish: Fe (yuqori T) + 5 CO → Fe(CO)₅ (uchuvchi), keyin parchalash", icon: "🏭" },
  { field: "Katalizator", detail: "Fisher-Tropsch sintezida, gidroformillash reaksiyalarida (Reppe kimyosi)", icon: "⚗️" },
  { field: "Berry pseudorotation", detail: "TBP → SP → TBP dinamik strukturasining klassik namunasi (¹³C NMR barcha C ekvivalent)", icon: "🔄" },
  { field: "Fotokimyo", detail: "hv → [Fe(CO)₄]* + CO — fotoli katalizator prekursori (norn 366 nm)", icon: "☀️" },
  { field: "HRMS benchmark", detail: "Orbitrap kalibratsiyasida etalon (m/z=196, aniq massa 195.9094)", icon: "🎯" },
  { field: "Xavfsizlik", detail: "⚠ Juda zaharli (LD₅₀ = 12 mg/kg), gaz zichligi > havo. Faqat ventilatsiyada!", icon: "☠️" },
]

export default function FeCO5Mass() {
  const [showHeader, setShowHeader] = useState(true)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(0)
  const [showIsotopes, setShowIsotopes] = useState(true)
  const [showCO, setShowCO] = useState(true)
  const [zoomMode, setZoomMode] = useState("full") // full | molecular | isotope
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfProgress, setPdfProgress] = useState(0)
  const [selectedTech, setSelectedTech] = useState(0)

  // HRMS ppm kalkulyator
  const [obsMz, setObsMz] = useState(195.9096)
  const spectrumRef = useRef(null)

  const ppmCalc = useMemo(() => {
    const calc = COMPOUND.molecularIonExact
    const diff = obsMz - calc
    const ppm = (diff / calc) * 1e6
    return {
      calc: calc.toFixed(4),
      obs: obsMz.toFixed(4),
      diff: diff.toFixed(4),
      ppm: ppm.toFixed(2),
      verdict: Math.abs(ppm) < 5 ? "✅ HRMS tasdig'i (< 5 ppm)" : Math.abs(ppm) < 10 ? "⚠ Chegaraga yaqin" : "❌ Formula noto'g'ri!"
    }
  }, [obsMz])

  // Spektr chizmasi uchun path yaratish
  const spectrumData = useMemo(() => {
    let peaks = [...massPeaks]
    if (showIsotopes) {
      peaks = [...peaks, ...isotopeCluster.filter(iso => iso.mz !== 196).map(iso => ({
        mz: iso.mz,
        intensity: iso.abundance,
        formula: iso.isotope,
        isIsotope: true,
      }))]
    }
    if (!showCO) peaks = peaks.filter(p => p.mz !== 28)
    return peaks
  }, [showIsotopes, showCO])

  const zoomRange = useMemo(() => {
    if (zoomMode === "molecular") return { min: 180, max: 210 }
    if (zoomMode === "isotope") return { min: 193, max: 200 }
    return { min: 0, max: 220 }
  }, [zoomMode])

  // ═══════════════════════════════════════════════════════════════════════════════
  // 📄 PDF EKSPORT
  // ═══════════════════════════════════════════════════════════════════════════════
  const cleanText = (str) => {
    if (str === null || str === undefined) return ""
    return String(str)
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim()
  }

  const generatePDF = async () => {
    setPdfGenerating(true)
    setPdfProgress(0)

    try {
      const { PDFDocument, rgb } = await import("pdf-lib")
      const fontkit = (await import("@pdf-lib/fontkit")).default

      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)
      setPdfProgress(10)

      let regularFont, boldFont, italicFont
      try {
        const regularBytes = await fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error("Regular font"); return r.arrayBuffer() })
        const boldBytes = await fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error("Bold font"); return r.arrayBuffer() })
        const italicBytes = await fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error("Italic font"); return r.arrayBuffer() })
        regularFont = await pdfDoc.embedFont(regularBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(boldBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(italicBytes, { subset: true })
      } catch (fontErr) {
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
        setPdfGenerating(false)
        return
      }
      setPdfProgress(20)

      const C = {
        gold:       rgb(0.96, 0.84, 0.26),
        goldDeep:   rgb(0.55, 0.45, 0.05),
        pink:       rgb(0.85, 0.30, 0.55),
        pinkDeep:   rgb(0.60, 0.20, 0.40),
        purple:     rgb(0.30, 0.11, 0.58),
        purpleLight:rgb(0.86, 0.78, 1.0),
        purpleMid:  rgb(0.55, 0.35, 0.85),
        orange:     rgb(0.96, 0.62, 0.04),
        orangeDeep: rgb(0.70, 0.40, 0.02),
        textDark:   rgb(0.08, 0.08, 0.16),
        textGray:   rgb(0.47, 0.47, 0.47),
        red:        rgb(0.80, 0.20, 0.20),
        green:      rgb(0.08, 0.55, 0.31),
        blue:       rgb(0.08, 0.35, 0.75),
        cyan:       rgb(0.05, 0.65, 0.75),
        grayLine:   rgb(0.78, 0.78, 0.86),
        bgPurple:   rgb(0.97, 0.94, 1.0),
        bgPink:     rgb(1.0, 0.94, 0.97),
        bgGold:     rgb(1.0, 0.96, 0.80),
        bgOrange:   rgb(1.0, 0.94, 0.85),
        bgBlue:     rgb(0.94, 0.98, 1.0),
        bgGreen:    rgb(0.94, 1.0, 0.98),
        bgRed:      rgb(1.0, 0.95, 0.95),
        white:      rgb(1, 1, 1),
      }

      const PAGE_W = 595.28, PAGE_H = 841.89, MARGIN = 50
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30

      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNum = 1

      const measure = (t, f, s) => f.widthOfTextAtSize(String(t), s)
      const truncate = (text, font, size, maxWidth) => {
        const s = String(text)
        if (measure(s, font, size) <= maxWidth) return s
        let lo = 0, hi = s.length
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          if (measure(s.slice(0, mid) + "…", font, size) <= maxWidth) lo = mid
          else hi = mid - 1
        }
        return s.slice(0, lo) + "…"
      }
      const wrapText = (text, font, size, maxWidth) => {
        if (!text) return [""]
        const words = String(text).split(/\s+/)
        const lines = []
        let current = ""
        for (const word of words) {
          const test = current ? current + " " + word : word
          if (measure(test, font, size) > maxWidth && current) {
            lines.push(current); current = word
          } else current = test
        }
        if (current) lines.push(current)
        return lines
      }
      const safeText = (text, opts) => {
        const { x, y: ty, size = 10, font = regularFont, color = C.textDark, align = "left", maxWidth = null } = opts
        const s = cleanText(text)
        const limit = maxWidth ?? (PAGE_W - MARGIN - x)
        const finalText = truncate(s, font, size, limit)
        let fx = x
        const w = measure(finalText, font, size)
        if (align === "center") fx = x - w / 2
        else if (align === "right") fx = x - w
        page.drawText(finalText, { x: fx, y: ty, size, font, color })
      }
      const drawWrappedText = (text, opts) => {
        const { x, y: sy, size = 9.5, font = regularFont, color = C.textDark, maxWidth, lineHeight = null } = opts
        const lines = wrapText(cleanText(text), font, size, maxWidth)
        const lh = lineHeight ?? size + 3
        lines.forEach((line, i) => {
          page.drawText(line, { x, y: sy - i * lh, size, font, color })
        })
        return lines.length * lh
      }
      const addFooter = () => {
        const dateStr = new Date().toLocaleDateString("uz-UZ")
        const leftText = truncate(
          `jdakimyo.uz Mass-spektrometriya Tahlili  •  [Fe(CO)₅]  •  ${dateStr}`,
          regularFont, 8, CONTENT_W - 30
        )
        page.drawText(leftText, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        const pageStr = `${pageNum}`
        const w = measure(pageStr, regularFont, 8)
        page.drawText(pageStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine,
        })
      }
      const addNewPage = () => {
        addFooter()
        page = pdfDoc.addPage([PAGE_W, PAGE_H])
        pageNum++
        y = PAGE_H - MARGIN
      }
      const checkPageBreak = (need) => { if (y - need < FOOTER_Y + 25) addNewPage() }
      const drawSectionHeader = (num, title) => {
        checkPageBreak(45)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.orange })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13,
          font: boldFont, color: C.orangeDeep, maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
        })
        y -= 14
      }
      const drawTableRow = (label, value, bgColor = C.bgOrange, labelColor = C.orangeDeep) => {
        const rowH = 20, labelW = 200
        checkPageBreak(rowH + 2)
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor })
        safeText(label, { x: MARGIN + 6, y: y - 13, size: 9, font: boldFont, color: labelColor, maxWidth: labelW - 8 })
        const valStr = cleanText(value)
        const finalVal = truncate(valStr, regularFont, 9, CONTENT_W - labelW - 12)
        page.drawText(finalVal, { x: MARGIN + labelW + 6, y: y - 13, size: 9, font: regularFont, color: C.textDark })
        y -= rowH
      }
      const drawInfoBox = (text, bgColor, borderColor, textColor) => {
        const padding = 10
        const maxW = CONTENT_W - 2 * padding
        const lines = wrapText(cleanText(text), regularFont, 9, maxW)
        const boxH = lines.length * 12 + 2 * padding
        checkPageBreak(boxH + 8)
        page.drawRectangle({
          x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
          color: bgColor, borderColor: borderColor, borderWidth: 0.8,
        })
        lines.forEach((line, i) => {
          page.drawText(line, {
            x: MARGIN + padding, y: y - padding - 10 - i * 12,
            size: 9, font: regularFont, color: textColor,
          })
        })
        y -= boxH + 10
      }

      // ═══ SARLAVHA (TO'Q SARIQ — Fe(CO)₅ rangi) ═══
      page.drawRectangle({ x: 0, y: PAGE_H - 90, width: PAGE_W, height: 90, color: C.orangeDeep })
      page.drawRectangle({ x: 0, y: PAGE_H - 92, width: PAGE_W, height: 4, color: C.orange })

      safeText("MASS-SPEKTROMETRIYA TAHLILI", { x: PAGE_W / 2, y: PAGE_H - 40, size: 16, font: boldFont, color: C.white, align: "center" })
      safeText("[Fe(CO)₅] — Pentakarboniltemir(0) (Mond, 1891)", { x: PAGE_W / 2, y: PAGE_H - 60, size: 12, font: regularFont, color: C.bgOrange, align: "center" })
      safeText(`Sana: ${new Date().toLocaleDateString("uz-UZ")}  •  jdakimyo.uz  •  Klassik organometallik namuna`, { x: PAGE_W / 2, y: PAGE_H - 78, size: 8, font: italicFont, color: C.bgOrange, align: "center" })

      y = PAGE_H - 110
      setPdfProgress(30)

      // ═══ 1. UMUMIY MA'LUMOT ═══
      drawSectionHeader("1", "UMUMIY MA'LUMOT VA XUSUSIYATLARI")
      drawTableRow("Formula:", COMPOUND.formulaPlain)
      drawTableRow("IUPAC nomi:", COMPOUND.iupac)
      drawTableRow("Tarixiy ahamiyati:", COMPOUND.historicalName)
      drawTableRow("Molyar massa (o'rtacha):", `${COMPOUND.molarMass} g/mol`)
      drawTableRow("Aniq massa (monoizotopik):", `${COMPOUND.exactMass} Da (⁵⁶Fe + 5×¹²C + 5×¹⁶O)`)
      drawTableRow("CAS raqami:", COMPOUND.casNumber)
      drawTableRow("Rangi:", COMPOUND.color)
      drawTableRow("Struktura:", COMPOUND.structure)
      drawTableRow("Nuqta guruhi:", COMPOUND.pointGroup)
      drawTableRow("Metall markazi:", `${COMPOUND.metalCenter} (${COMPOUND.dConfig})`)
      drawTableRow("18-elektron qoidasi:", COMPOUND.eightenElectronRule)
      drawTableRow("Fe–C bog' uzunligi (ekv):", COMPOUND.bondLengthEq)
      drawTableRow("Fe–C bog' uzunligi (aks):", COMPOUND.bondLengthAx)
      drawTableRow("Ionlashtirish usuli:", COMPOUND.ionizationMethod)
      drawTableRow("Molekulyar ion m/z:", `${COMPOUND.molecularIonMz} (100% intensivlik)`)
      drawTableRow("Fragmentatsiya:", COMPOUND.fragmentPattern)
      y -= 5
      setPdfProgress(40)

      // ═══ 2. NAZARIY ASOS ═══
      drawSectionHeader("2", "NAZARIY ASOS — 18-ELEKTRON QOIDASI VA π-BACKBONDING")
      drawInfoBox(
        "[Fe(CO)₅] — koordinatsion kimyoning klassik namunasi va 18-elektron qoidasining etaloni. " +
        "Fe⁰ atomi 3d⁸ 4s⁰ konfiguratsiyasiga ega (metallda 3d⁸ 4s⁰ deb qabul qilinadi, chunki hisobda 4s elektronlari koordinatsiyaga ishtirok etadi). " +
        "5 ta CO ligand har biri 2 elektron beradi (σ-donor sifatida C atomi orqali) → jami 10 elektron. " +
        "Fe (8 e⁻) + 5 × CO (10 e⁻) = 18 elektron ✓ (barqaror zich elektron qobiq). " +
        "Bu simmetrik trigonal-bipiramidal (D₃ₕ) tuzilishga olib keladi: 2 ta aksial CO va 3 ta ekvatorial CO. " +
        "π-akseptor xarakteri: Fe(dπ) → CO(π*) backbonding Fe–C bog'ini mustahkamlaydi, C=O bog'ini zaiflashtiradi.",
        C.bgOrange, C.orange, C.textDark
      )
      setPdfProgress(50)

      // ═══ 3. MASS-SPEKTR PIKLARI JADVALI ═══
      drawSectionHeader("3", "MASS-SPEKTR PIKLARI VA FRAGMENTATSIYA")

      const rowH = 32
      const cols = [
        { label: "m/z", w: 45 },
        { label: "Aniq massa", w: 75 },
        { label: "Fragment", w: 100 },
        { label: "Yo'qolgan", w: 70 },
        { label: "e⁻", w: 30 },
        { label: "Intensivlik (%)", w: 90 },
      ]

      let colX = MARGIN
      page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.purpleMid })
      cols.forEach(c => {
        safeText(c.label, { x: colX + 4, y: y - 12, size: 8, font: boldFont, color: C.white, maxWidth: c.w - 6 })
        colX += c.w
      })
      y -= 18

      massPeaks.forEach((p, i) => {
        checkPageBreak(rowH + 2)
        const bgc = i % 2 === 0 ? C.bgOrange : C.white
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgc })
        colX = MARGIN
        const values = [
          `${p.mz}`,
          `${p.exactMass}`,
          p.formula,
          p.lostFragment,
          `${18 - (p.mz === 196 ? 1 : (p.mz === 168 ? 3 : (p.mz === 140 ? 5 : (p.mz === 112 ? 7 : (p.mz === 84 ? 9 : (p.mz === 56 ? 11 : 0))))))}`,
          `${p.intensity}%`,
        ]
        values.forEach((v, idx) => {
          safeText(v, { x: colX + 4, y: y - 12, size: 8, font: regularFont, color: C.textDark, maxWidth: cols[idx].w - 6 })
          colX += cols[idx].w
        })
        safeText(p.diagnostic, { x: MARGIN + 4, y: y - 24, size: 7, font: italicFont, color: C.orangeDeep, maxWidth: CONTENT_W - 8 })
        y -= rowH
      })
      y -= 10
      setPdfProgress(60)

      // ═══ 4. HAR BIR PIK NAZARIY IZOH ═══
      drawSectionHeader("4", "PIKLARNING BATAFSIL NAZARIY IZOHI")
      massPeaks.forEach((p, i) => {
        checkPageBreak(85)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.bgOrange })
        safeText(`${i + 1}. ${p.formula}  —  m/z = ${p.mz},  intensivlik ${p.intensity}%`, {
          x: MARGIN + 6, y: y - 12, size: 9, font: boldFont, color: C.orangeDeep, maxWidth: CONTENT_W - 12
        })
        y -= 22
        const hh = drawWrappedText(p.theoryNote, {
          x: MARGIN + 8, y: y, size: 8.5, font: regularFont, color: C.textDark,
          maxWidth: CONTENT_W - 16, lineHeight: 11
        })
        y -= hh + 8
      })
      setPdfProgress(70)

      // ═══ 5. IZOTOP CLUSTER ═══
      drawSectionHeader("5", "Fe IZOTOP CLUSTER — MOLEKULYAR ION UCHUN")
      drawInfoBox(
        `Fe elementining 4 ta tabiiy izotopi bor (NIST 2021):\n\n` +
        `  ⁵⁴Fe — 5.845%  (aniq massa 53.9396 Da)\n` +
        `  ⁵⁶Fe — 91.754% (aniq massa 55.9349 Da) — asosiy\n` +
        `  ⁵⁷Fe — 2.119%  (aniq massa 56.9354 Da)\n` +
        `  ⁵⁸Fe — 0.282%  (aniq massa 57.9333 Da)\n\n` +
        `Bu izotopik naqsh [Fe(CO)₅] molekulyar ion clusterda quyidagicha ko'rinadi:\n\n` +
        `  m/z=194:  ⁵⁴Fe(CO)₅        →  intensivlik 5.8%\n` +
        `  m/z=196:  ⁵⁶Fe(CO)₅        →  intensivlik 100% (asosiy)\n` +
        `  m/z=197:  ⁵⁶Fe(¹³CO)(CO)₄  →  intensivlik ~5.9% (5 × ¹³C ehtimoli)\n` +
        `  m/z=198:  ⁵⁷Fe(CO)₅        →  intensivlik 2.4%\n\n` +
        `Diagnostik: M−2 piki (5.8%) mavjudligi = Fe borligining shubhasiz dalili.`,
        C.bgRed, C.red, C.textDark
      )
      setPdfProgress(80)

      // ═══ 6. FRAGMENTATSIYA ZINAPOYASI ═══
      drawSectionHeader("6", "FRAGMENTATSIYA ZINAPOYASI — HAR BOSQICHDA −28 Da")
      drawInfoBox(
        `[Fe(CO)₅] mass-spektri organometallik kimyoning eng chiroyli namunasi — 5 ta CO ketma-ket ekvivalent uziladi:\n\n` +
        `  196 −28→ 168 −28→ 140 −28→ 112 −28→ 84 −28→ 56\n` +
        `  M•⁺       M–CO      M–2CO     M–3CO     M–4CO    Fe•⁺\n\n` +
        `Har bir bosqich orasidagi masofa aynan 28 Da (¹²C¹⁶O aniq 27.9949) — bu Fe–C bog'larining ekvivalentligini isbotlaydi. ` +
        `Fe–CO o'rtacha bog' energiyasi D̄ ≈ 118 kJ/mol (7 kJ/mol farq bilan aksial/ekvatorial). Umumiy 5 CO uzilishi ~590 kJ/mol energiya talab qiladi, lekin EI (70 eV = 6755 kJ/mol) bu energiyani osongina beradi.`,
        C.bgGold, C.gold, C.textDark
      )
      setPdfProgress(85)

      // ═══ 7. HRMS ANIQLIGI ═══
      drawSectionHeader("7", "HRMS ANIQLIGI VA MOLEKULYAR FORMULA TASDIG'I")
      drawInfoBox(
        `Orbitrap yoki Q-TOF asboblarida [Fe(CO)₅] uchun HRMS ma'lumotlari:\n\n` +
        `Nazariy aniq massa (⁵⁶Fe⁵⁶ + ¹²C₅ + ¹⁶O₅):\n` +
        `  ⁵⁶Fe: 55.93494 × 1 = 55.93494\n` +
        `  ¹²C:  12.00000 × 5 = 60.00000\n` +
        `  ¹⁶O:  15.99491 × 5 = 79.97455\n` +
        `  Jami: 195.90949 Da\n\n` +
        `Elektron massa hisobga olinsa (radikal-kation):\n` +
        `  M•⁺ = 195.90949 − 0.00055 = 195.90894 Da\n\n` +
        `Kuzatilgan m/z (Orbitrap R = 100 000):\n` +
        `  195.9091 (misol)\n` +
        `  Δppm = (195.9091 − 195.9089)/195.9089 × 10⁶ = 1.0 ppm ✓\n\n` +
        `Xulosa: < 5 ppm → HRMS formula tasdig'i qabul qilinadi (IUPAC 2013 tavsiyasi). Jurnal maqolalarida yangi organometallik komplekslar shu darajada HRMS bilan tasdiqlanishi shart.`,
        C.bgBlue, C.blue, C.textDark
      )
      setPdfProgress(90)

      // ═══ 8. METALL KARBONILLAR SERIYASI ═══
      drawSectionHeader("8", "METALL KARBONILLAR — MASS-SPEKTR TAQQOSLASHI")
      drawInfoBox(
        "Klassik metall karbonillar oilasi (18-elektron qoidasiga rioya qiluvchi):\n\n" +
        "  [Ni(CO)₄]  M=170  d¹⁰  4 fragment  (Mond, 1888)\n" +
        "  [Fe(CO)₅]  M=196  d⁸   5 fragment  ← BU KOMPLEKS\n" +
        "  [Cr(CO)₆]  M=220  d⁶   6 fragment  (Oh simmetriya)\n" +
        "  [Mo(CO)₆]  M=264  d⁶   6 fragment  (Mo izotop cluster katta)\n" +
        "  [W(CO)₆]   M=352  d⁶   6 fragment  (W izotop cluster ¹⁸²-¹⁸⁶)\n" +
        "  [Mn₂(CO)₁₀] M=390 d⁷×2 10 fragment (Mn–Mn bog'i, dinuklear)\n\n" +
        "Umumiy qoida: har bir CO ligand −28 Da. Karbonil komplekslar mass-spektrometriyaning eng qulay namunalari — piklar simmetrik, izotop cluster aniq, fragmentatsiya prognoz qilinadigan.",
        C.bgGreen, C.green, C.textDark
      )
      setPdfProgress(95)

      // ═══ 9. XULOSA ═══
      drawSectionHeader("9", "ASOSIY XULOSALAR")
      const conclusions = [
        `1. Molekulyar ion m/z = 196 (100% intensivlik) — organometallik uchun noyob barqarorlik`,
        `2. Aniq massa 195.9094 Da (⁵⁶Fe + 5×¹²C + 5×¹⁶O), HRMS ±1 ppm da tasdiqlanadi`,
        `3. Fragmentatsiya: 196 → 168 → 140 → 112 → 84 → 56 (har biri −28 Da CO)`,
        `4. Barcha 5 CO ligand ekvivalent — Fe–C bog' D̄ ≈ 118 kJ/mol`,
        `5. Fe⁺ (m/z=56) 60% intensivlik — atom pikning termodinamik barqarorligi`,
        `6. Izotop cluster: M−2 (⁵⁴Fe, 5.8%), M (⁵⁶Fe, 100%), M+2 (⁵⁷Fe, 2.4%)`,
        `7. 18-elektron qoidasi: Fe⁰ (8) + 5 CO (10) = 18 ✓ — Sidgwick modeli`,
        `8. Struktura: trigonal-bipiramidal (D₃ₕ), Berry pseudorotation dinamik`,
        `9. Ionlashtirish usuli: EI (70 eV) klassik va NIST kutubxonasi bilan mos`,
        `10. Mond usuli tarixiy ahamiyati — birinchi metall karbonili (1891)`,
      ]
      conclusions.forEach(c => {
        checkPageBreak(20)
        drawWrappedText(c, {
          x: MARGIN + 10, y, size: 9.5, font: regularFont, color: C.textDark,
          maxWidth: CONTENT_W - 20, lineHeight: 12
        })
        y -= 18
      })

      // ═══ 10. MANBALAR ═══
      addNewPage()
      drawSectionHeader("10", "ILMIY MANBALAR")
      const refs = [
        "J. H. Gross — Mass Spectrometry: A Textbook (3rd ed., Springer, 2017)",
        "W. Henderson, J. S. McIndoe — Mass Spectrometry of Inorganic and Organometallic Compounds (Wiley, 2005)",
        "F. W. McLafferty, F. Tureček — Interpretation of Mass Spectra (4th ed.)",
        "R. B. King — J. Am. Chem. Soc. 88, 2075 (1966) — [Fe(CO)₅] EI mass-spektri",
        "L. Mond, C. Langer, F. Quincke — J. Chem. Soc. 59, 604 (1891) — Fe(CO)₅ kashfiyoti",
        "NIST 2021 — Atomic Weights and Isotopic Compositions",
        "NIST Chemistry WebBook — Mass Spectrum, ID 13463-40-6",
        "IUPAC Gold Book — Mass spectrometry terminology (2013)",
      ]
      refs.forEach(r => {
        checkPageBreak(16)
        drawWrappedText(`• ${r}`, {
          x: MARGIN + 10, y, size: 9, font: regularFont, color: C.textDark,
          maxWidth: CONTENT_W - 20, lineHeight: 11
        })
        y -= 16
      })

      addFooter()
      setPdfProgress(100)

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Fe-CO-5_Mass_Tahlili_${new Date().toISOString().split("T")[0]}.pdf`
      link.click()
      URL.revokeObjectURL(url)

      setPdfModalOpen(false)
    } catch (err) {
      console.error("PDF xato:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally {
      setPdfGenerating(false)
      setPdfProgress(0)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-orange-950/10 to-purple-950 text-white">

      {/* ═══ PDF MODAL ═══ */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-950 to-orange-950 border-2 border-orange-500 rounded-2xl p-6 max-w-2xl w-full">
            <h3 className="text-2xl font-bold text-orange-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">📄</span> PDF Ilmiy Hisobot
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              [Fe(CO)₅] ning mass-spektrometrik tahlili haqida to'liq ilmiy hisobot yaratiladi.
            </p>
            <ul className="text-xs text-purple-300 space-y-1 mb-6 list-disc list-inside">
              <li>Umumiy ma'lumot va fizik-kimyoviy xususiyatlari</li>
              <li>18-elektron qoidasi va π-backbonding nazariyasi</li>
              <li>Har bir fragmentatsiya pikining batafsil izohi</li>
              <li>Fe izotop cluster tahlili (⁵⁴Fe/⁵⁶Fe/⁵⁷Fe/⁵⁸Fe)</li>
              <li>Fragmentatsiya zinapoyasi (−28 Da CO)</li>
              <li>HRMS aniqligi va ppm hisob-kitobi</li>
              <li>Metall karbonillar seriyasi taqqoslashi</li>
              <li>Ilmiy xulosalar va manbalar</li>
            </ul>

            {pdfGenerating && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-purple-300 mb-2">
                  <span>PDF yaratilmoqda...</span>
                  <span>{pdfProgress}%</span>
                </div>
                <div className="w-full bg-purple-900/40 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-300" style={{ width: `${pdfProgress}%` }} />
                </div>
              </div>
            )}

            <div className="bg-orange-900/20 border border-orange-700/40 rounded-lg p-3 mb-4">
              <p className="text-xs text-orange-200">
                <strong>⚠ Font talablari:</strong> <code className="bg-orange-950/50 px-1 rounded">public/fonts/</code> papkasida
                <code className="bg-orange-950/50 px-1 rounded ml-1">DejaVuSans*.ttf</code> 3 ta fayl bo'lishi shart.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setPdfModalOpen(false)} disabled={pdfGenerating}
                className="flex-1 bg-purple-800 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors text-sm font-semibold disabled:opacity-50">
                Bekor qilish
              </button>
              <button onClick={generatePDF} disabled={pdfGenerating}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white py-3 rounded-lg transition-all text-sm font-bold disabled:opacity-50">
                {pdfGenerating ? "⏳ Yaratilmoqda..." : "📥 PDF yuklab olish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ HEADER ═══ */}
      {showHeader && (
        <header className="border-b border-orange-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300">🏠 Bosh</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/mass" className="hover:text-purple-300">Mass-spektrometriya</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/mass/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-orange-400 font-semibold">[Fe(CO)₅]</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border-4 border-white/20 shadow-2xl" style={{background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}dd, ${COMPOUND.colorHex}99)`}}></div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-orange-400" dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <p className="text-purple-300 text-sm mt-1">{COMPOUND.iupac}</p>
                  <p className="text-orange-500/80 text-xs italic">M = {COMPOUND.molarMass} g/mol • m/z = {COMPOUND.molecularIonMz} • {COMPOUND.dConfig}</p>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-orange-900/40 border border-orange-700/50 text-orange-300 mt-1">
                    🏭 Mond usuli (1891) — birinchi metall karbonili
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setPdfModalOpen(true)}
                  className="text-xs bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-orange-500/20 font-bold">
                  📄 PDF Hisobot
                </button>
                <Link href="/ilmiy/tahlil/mass/birikmalar" className="text-xs bg-purple-800/60 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  ← Birikmalar
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      <button onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-40 px-3 py-2 rounded-lg text-xs font-bold shadow-lg bg-orange-600 hover:bg-orange-500 text-white">
        {showHeader ? "🔽" : "🔼"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══ 1. UMUMIY MA'LUMOT ═══ */}
        <div className="bg-purple-900/40 border border-orange-700/40 rounded-2xl p-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="w-40 h-40 rounded-2xl border-4 border-white/20 shadow-2xl" style={{
                background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}, ${COMPOUND.colorHex}dd 40%, ${COMPOUND.colorHex}88 80%)`
              }}></div>
              <div className="text-center">
                <div className="text-xs text-purple-400">Suyuqlik rangi</div>
                <div className="text-lg font-bold text-orange-400">{COMPOUND.color}</div>
              </div>
              <div className="text-center bg-red-900/30 border border-red-500/40 rounded-lg px-3 py-1.5">
                <div className="text-[10px] text-red-300">☠ Xavflilik</div>
                <div className="text-xs text-red-400 font-bold">LD₅₀ = 12 mg/kg</div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-2xl font-bold text-white">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                </h2>
                <span className="text-xs px-3 py-1 rounded-full bg-orange-900/40 border border-orange-500/50 text-orange-300 font-bold">
                  🏭 Mond 1891
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/50 text-purple-300 font-bold">
                  ⚛ 18 e⁻ qoidasi
                </span>
              </div>
              <p className="text-purple-200 leading-relaxed text-sm">
                <strong className="text-orange-400">[Fe(CO)₅]</strong> — <strong className="text-orange-400">
                organometallik kimyoning tarixiy birinchi metall karbonillaridan biri</strong>. 1891 yilda L. Mond,
                C. Langer va F. Quincke tomonidan kashf etilgan. Bu birikma <strong className="text-yellow-300">18-elektron qoidasining
                mumtoz namunasi</strong>: Fe⁰ (8 e⁻) + 5 × CO (10 e⁻) = 18 e⁻. Mass-spektrometriyada
                <strong className="text-orange-300"> ketma-ket 5 ta CO yo'qolishi</strong> (196 → 168 → 140 → 112 → 84 → 56)
                bilan mashhur — har bir bosqichda aynan <strong>−28 Da</strong> masofa. Bu — organometallik
                mass-spektri darsligining birinchi misoli (King, JACS 1966).
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-orange-900/30 border border-orange-700/40 rounded-xl p-3 text-center">
                  <div className="text-orange-400 text-[10px] uppercase">m/z (M•⁺)</div>
                  <div className="text-white font-bold mt-1">{COMPOUND.molecularIonMz}</div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-xl p-3 text-center">
                  <div className="text-yellow-400 text-[10px] uppercase">Aniq massa</div>
                  <div className="text-white font-bold mt-1 font-mono text-xs">{COMPOUND.exactMass}</div>
                </div>
                <div className="bg-pink-900/30 border border-pink-700/40 rounded-xl p-3 text-center">
                  <div className="text-pink-400 text-[10px] uppercase">Fragmentlar</div>
                  <div className="text-white font-bold mt-1">6 ta</div>
                </div>
                <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-3 text-center">
                  <div className="text-purple-400 text-[10px] uppercase">18 e⁻</div>
                  <div className="text-white font-bold mt-1">✓ 8+10</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-950/40 border border-purple-700/30 rounded-xl overflow-hidden">
              <div className="bg-orange-900/30 px-4 py-2 border-b border-orange-700/30">
                <h3 className="text-orange-400 font-bold text-sm">📊 Fizik-kimyoviy xususiyatlar</h3>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Molyar massa</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.molarMass} g/mol</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Aniq massa</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.exactMass} Da</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">CAS raqami</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.casNumber}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Struktura</td><td className="py-2 px-4 text-white">{COMPOUND.structure}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Nuqta guruhi</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.pointGroup}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Fe–C (ekv)</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.bondLengthEq}</td></tr>
                  <tr><td className="py-2 px-4 text-purple-400">Fe–C (aks)</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.bondLengthAx}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-purple-950/40 border border-purple-700/30 rounded-xl overflow-hidden">
              <div className="bg-orange-900/30 px-4 py-2 border-b border-orange-700/30">
                <h3 className="text-orange-400 font-bold text-sm">⚗ Mass-spektri parametrlari</h3>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Ionlashtirish</td><td className="py-2 px-4 text-white text-[11px]">{COMPOUND.ionizationMethod}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Molekulyar ion</td><td className="py-2 px-4 text-white font-mono">m/z = {COMPOUND.molecularIonMz}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Asosiy ion</td><td className="py-2 px-4 text-white text-[11px]">{COMPOUND.baseIonNote}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Fragmentatsiya</td><td className="py-2 px-4 text-white text-[11px]">{COMPOUND.fragmentPattern}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Fe–CO energiya</td><td className="py-2 px-4 text-white text-[11px]">{COMPOUND.cleavageEnergy}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Izotop naqsh</td><td className="py-2 px-4 text-white text-[10px]">{COMPOUND.isotopePattern}</td></tr>
                  <tr><td className="py-2 px-4 text-purple-400">18 e⁻ qoidasi</td><td className="py-2 px-4 text-green-300 font-mono text-[11px]">{COMPOUND.eightenElectronRule}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-orange-900/10 border border-orange-500/30 rounded-xl p-4">
            <div className="text-orange-400 font-bold text-sm mb-2">🧪 Sintez usuli (Mond, 1891)</div>
            <div className="text-xs text-purple-200 font-mono bg-purple-950/40 rounded p-3">{COMPOUND.synthesis}</div>
            <div className="text-xs text-purple-300 mt-2">
              Yuqori bosim va harorat sharoitida Fe metall CO gaz bilan reaksiyaga kirishib, uchuvchan
              <strong className="text-orange-300"> [Fe(CO)₅]</strong> suyuqligini hosil qiladi. Bu Mond usulining Fe uchun variantasi.
            </div>
          </div>
        </div>

        {/* ═══ 2. NAZARIY ASOS ═══ */}
        <div className="bg-purple-900/40 border border-orange-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📚</span> 18-elektron qoidasi va Fe–CO π-backbonding
          </h2>

          <p className="text-purple-200 leading-relaxed text-sm">
            [Fe(CO)₅] — <strong className="text-orange-400">Sidgwick 18-elektron qoidasining</strong> mumtoz namunasi.
            Fe⁰ atomi 8 valent elektron beradi, 5 ta CO ligand esa har biri 2 elektron beradi (jami 10). Bu <strong className="text-yellow-300">18-elektron zich elektron qobiq</strong>ni ta'minlaydi — noble gaz konfiguratsiyasiga o'xshash barqarorlik.
            Bundan tashqari CO ligandlarning π-akseptor xarakteri (Fe(dπ) → CO(π*) backbonding) Fe–C bog'ini
            <strong className="text-pink-400"> qo'shimcha ravishda mustahkamlaydi</strong>, C=O bog'ini biroz cho'zadi (1.152 Å, erkin CO da 1.128 Å).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-300 font-bold mb-3 flex items-center gap-2">
                <span>⚛️</span> 18-elektron qoidasi hisobi
              </h3>
              <div className="bg-purple-950/60 rounded-lg p-3 mb-3 font-mono text-sm">
                <div className="text-orange-300 my-1">Fe⁰ (3d⁸ 4s⁰): <span className="text-white">8 e⁻</span></div>
                <div className="text-orange-300 my-1">5 × CO (σ-donor): <span className="text-white">5 × 2 = 10 e⁻</span></div>
                <div className="border-t border-purple-700 pt-2 mt-2 text-yellow-300">Jami: <span className="text-white font-bold">18 e⁻ ✓</span></div>
              </div>
              <p className="text-xs text-purple-300">
                18 e⁻ = to'ldirilgan (n)d + (n+1)s + (n+1)p qobiq (5+1+3 = 9 orbital × 2 e⁻).
                Bu Kripton [Kr] noble gaz konfiguratsiyasiga o'xshash barqarorlik.
              </p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-300 font-bold mb-3 flex items-center gap-2">
                <span>🔄</span> π-backbonding (Dewar-Chatt-Duncanson modeli)
              </h3>
              <div className="space-y-2">
                <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-3">
                  <p className="text-blue-300 font-bold text-xs mb-1">→ σ-donatsiya</p>
                  <p className="text-purple-200 text-[11px]">CO (5σ HOMO, C atomi) → Fe (bo'sh d/s/p) — CO ni Fe ga elektron beradi</p>
                </div>
                <div className="bg-pink-900/20 border border-pink-700/40 rounded-lg p-3">
                  <p className="text-pink-300 font-bold text-xs mb-1">← π-backbonding</p>
                  <p className="text-purple-200 text-[11px]">Fe (dπ, HOMO−1) → CO (2π* LUMO) — Fe ni CO ning bo'sh π* ga elektron beradi</p>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold text-xs mb-1">📉 IR isbot</p>
                  <p className="text-purple-200 text-[11px]">C≡O erkin: 2143 cm⁻¹; [Fe(CO)₅] da: 2013, 2034 cm⁻¹ — pastroq → π* to'lgan → C=O zaif</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">🎓 Mass-spektri uchun ahamiyati:</strong> π-backbonding Fe–C bog'ini kuchli
              (D̄ ≈ 118 kJ/mol) qiladi, lekin qulay uziladigan darajada. EI (70 eV = 6755 kJ/mol) osongina 5 ta CO ni birma-bir
              yulib tashlaydi. Har bir uzilishdan keyingi fragment koordinativ to'yinmagan (17 → 15 → 13 → 11 → 9 → 7 e⁻),
              lekin gaz fazasida bir muddat mavjud bo'ladi va spektroskopik ravishda aniqlanadi.
            </p>
          </div>
        </div>

        {/* ═══ 3. INTERAKTIV MASS-SPEKTR ═══ */}
        <div className="bg-purple-900/40 border border-orange-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈</span> Interaktiv mass-spektr (EI, 70 eV)
          </h2>
          <p className="text-purple-200 text-sm">
            Piklarga <strong className="text-orange-400">ustiga bosing</strong> — batafsil ilmiy izohlar. 
            Molekulyar ion m/z=196 (100%), keyin har −28 Da masofada ketma-ket fragmentlar.
          </p>

          {/* Zoom kontrol */}
          <div className="flex gap-2 flex-wrap">
            {[
              { v: "full", l: "Butun spektr (0–220)" },
              { v: "molecular", l: "🎯 Molekulyar zona (180–210)" },
              { v: "isotope", l: "🔬 Izotop cluster (193–200)" },
            ].map(o => (
              <button
                key={o.v}
                onClick={() => setZoomMode(o.v)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  zoomMode === o.v ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30" :
                  "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>

          <div className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-4 overflow-x-auto">
            <svg viewBox="0 0 800 400" className="w-full h-auto" preserveAspectRatio="xMidYMid meet" ref={spectrumRef}>
              <defs>
                <linearGradient id="peakGradFe" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.95"/>
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="peakGradIso" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85"/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2"/>
                </linearGradient>
              </defs>

              {/* Y-axis grid */}
              {[20, 40, 60, 80, 100].map(pct => (
                <g key={pct}>
                  <line x1="40" y1={340 - (pct/100)*300} x2="780" y2={340 - (pct/100)*300} stroke="#a78bfa" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.4"/>
                  <text x="35" y={340 - (pct/100)*300 + 3} fill="#c4b5fd" fontSize="9" textAnchor="end">{pct}%</text>
                </g>
              ))}
              <text x="15" y="200" fill="#e9d5ff" fontSize="11" textAnchor="middle" transform="rotate(-90 15 200)" fontWeight="bold">Nisbiy intensivlik (%)</text>

              {/* X-axis */}
              {[0, 40, 80, 120, 160, 200].map(l => {
                const x = 40 + ((l - zoomRange.min) / (zoomRange.max - zoomRange.min)) * 740
                if (l < zoomRange.min || l > zoomRange.max) return null
                return (
                  <g key={l}>
                    <line x1={x} y1="40" x2={x} y2="340" stroke="#a78bfa" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.3"/>
                    <text x={x} y="360" fill="#e9d5ff" fontSize="10" textAnchor="middle">{l}</text>
                  </g>
                )
              })}
              <text x="400" y="385" fill="#e9d5ff" fontSize="11" textAnchor="middle" fontWeight="bold">m/z (Da)</text>
              <line x1="40" y1="340" x2="780" y2="340" stroke="#e9d5ff" strokeWidth="0.5"/>

              {/* Asosiy piklar */}
              {massPeaks.filter(p => (showCO || p.mz !== 28) && p.mz >= zoomRange.min && p.mz <= zoomRange.max).map((p, i) => {
                const x = 40 + ((p.mz - zoomRange.min) / (zoomRange.max - zoomRange.min)) * 740
                const h = (p.intensity / 100) * 300
                const y = 340 - h
                const isSelected = selectedPeak === massPeaks.indexOf(p)
                const isHovered = hoveredPeak === massPeaks.indexOf(p)
                return (
                  <g key={p.mz} onClick={() => setSelectedPeak(massPeaks.indexOf(p))}
                    onMouseEnter={() => setHoveredPeak(massPeaks.indexOf(p))}
                    onMouseLeave={() => setHoveredPeak(null)}
                    className="cursor-pointer">
                    <line x1={x} y1="340" x2={x} y2={y}
                      stroke={isSelected ? "#fbbf24" : "#f97316"}
                      strokeWidth={isSelected || isHovered ? "5" : "3"}
                      strokeLinecap="round"/>
                    <circle cx={x} cy={y} r={isSelected || isHovered ? "7" : "4"} fill={isSelected ? "#fbbf24" : "#f97316"} stroke="#fff" strokeWidth="1.5"/>
                    <text x={x} y={y - 12} fill={isSelected ? "#fbbf24" : "#f97316"} fontSize="10" textAnchor="middle" fontWeight="bold">
                      {p.mz}
                    </text>
                    {(isSelected || isHovered) && (
                      <g>
                        <rect x={x - 55} y={y - 55} width="110" height="30" rx="4" fill="#4B0082" stroke="#f97316" strokeWidth="1.5"/>
                        <text x={x} y={y - 40} fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">{p.formula}</text>
                        <text x={x} y={y - 28} fill="#fbbf24" fontSize="9" textAnchor="middle">{p.intensity}%</text>
                      </g>
                    )}
                  </g>
                )
              })}

              {/* Izotop piklar (nozik) */}
              {showIsotopes && isotopeCluster.filter(iso => iso.mz !== 196 && iso.mz >= zoomRange.min && iso.mz <= zoomRange.max).map(iso => {
                const x = 40 + ((iso.mz - zoomRange.min) / (zoomRange.max - zoomRange.min)) * 740
                const h = (iso.abundance / 100) * 300
                const y = 340 - h
                return (
                  <g key={`iso-${iso.mz}`}>
                    <line x1={x} y1="340" x2={x} y2={y} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity="0.75"/>
                    <text x={x} y={y - 8} fill="#ef4444" fontSize="8" textAnchor="middle">{iso.mz}</text>
                  </g>
                )
              })}

              <text x="400" y="25" fill="#f97316" fontSize="14" textAnchor="middle" fontWeight="bold">
                [Fe(CO)₅] mass-spektri — EI, 70 eV (King, JACS 1966)
              </text>
            </svg>

            <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-xs text-purple-300">
                  <input type="checkbox" checked={showIsotopes} onChange={(e) => setShowIsotopes(e.target.checked)} className="accent-red-500"/>
                  Fe izotop cluster (⁵⁴Fe, ⁵⁷Fe, ⁵⁸Fe)
                </label>
                <label className="flex items-center gap-2 text-xs text-purple-300">
                  <input type="checkbox" checked={showCO} onChange={(e) => setShowCO(e.target.checked)} className="accent-blue-500"/>
                  CO•⁺ ligand pik (m/z=28)
                </label>
              </div>
              <span className="text-xs text-purple-400">📊 {massPeaks.filter(p => showCO || p.mz !== 28).length} asosiy pik</span>
            </div>
          </div>

          {/* Tanlangan pik detali */}
          {selectedPeak !== null && (
            <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border-2 border-orange-500/50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-2xl font-bold text-orange-400 mb-1">{massPeaks[selectedPeak].formula}</h3>
                  <p className="text-purple-300 text-sm">{massPeaks[selectedPeak].fragment} • {massPeaks[selectedPeak].ionizationType}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  massPeaks[selectedPeak].intensityCode === 4 ? "bg-red-900/40 border-red-500 text-red-300" :
                  massPeaks[selectedPeak].intensityCode === 3 ? "bg-orange-900/40 border-orange-500 text-orange-300" :
                  massPeaks[selectedPeak].intensityCode === 2 ? "bg-yellow-900/40 border-yellow-500 text-yellow-300" :
                  "bg-gray-900/40 border-gray-500 text-gray-300"
                }`}>
                  Intensivlik: {massPeaks[selectedPeak].intensity}%
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">m/z (nominal)</div>
                  <div className="text-orange-300 font-mono font-bold text-lg">{massPeaks[selectedPeak].mz}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">Aniq massa (Da)</div>
                  <div className="text-cyan-300 font-mono font-bold">{massPeaks[selectedPeak].exactMass}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">Yo'qolgan</div>
                  <div className="text-red-300 font-mono font-bold">{massPeaks[selectedPeak].lostFragment}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">−Δm (Da)</div>
                  <div className="text-yellow-300 font-mono font-bold">{massPeaks[selectedPeak].lostMass}</div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3 mb-3">
                <div className="text-xs text-yellow-400 font-bold mb-1">💡 Diagnostik:</div>
                <div className="text-sm text-purple-200">{massPeaks[selectedPeak].diagnostic}</div>
              </div>
              <div className="bg-purple-900/20 border border-purple-700/40 rounded-lg p-4">
                <div className="text-xs text-orange-400 font-bold mb-2">🎓 Batafsil ilmiy izoh:</div>
                <div className="text-sm text-purple-200 leading-relaxed">{massPeaks[selectedPeak].theoryNote}</div>
              </div>
              {massPeaks[selectedPeak].special && (
                <div className="mt-3 bg-red-900/20 border border-red-700/40 rounded-lg p-3">
                  <div className="text-xs text-red-400 font-bold mb-1">⭐ Alohida ahamiyat:</div>
                  <div className="text-sm text-red-200">{massPeaks[selectedPeak].special}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══ 4. PIKLAR JADVALI ═══ */}
        <div className="bg-purple-900/40 border border-orange-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📋</span> Mass-spektri piklari — tayinlash jadvali (NIST + King 1966)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orange-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">m/z</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">Aniq (Da)</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">Fragment</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">Yo'qolgan</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">Intensivlik</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">Diagnostik</th>
                </tr>
              </thead>
              <tbody>
                {massPeaks.map((p, i) => (
                  <tr key={i} onClick={() => setSelectedPeak(i)}
                    className={`border-b border-purple-800/30 hover:bg-orange-900/20 cursor-pointer transition-colors ${selectedPeak === i ? "bg-orange-900/30" : ""}`}>
                    <td className="py-3 px-3 text-orange-300 font-mono font-bold">{p.mz}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono text-xs">{p.exactMass}</td>
                    <td className="py-3 px-3 text-purple-200 font-mono text-xs">{p.formula}</td>
                    <td className="py-3 px-3 text-red-300 font-mono text-xs">{p.lostFragment}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-purple-950/50 rounded-full h-2">
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full" style={{width: `${p.intensity}%`}}></div>
                        </div>
                        <span className="text-white text-xs">{p.intensity}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs text-purple-300 italic">{p.diagnostic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ 5. FRAGMENTATSIYA ZINAPOYASI ═══ */}
        <div className="bg-purple-900/40 border border-orange-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🪜</span> Fragmentatsiya zinapoyasi — 5 ta ekvivalent −28 Da bosqichi
          </h2>

          <div className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-6">
            <svg viewBox="0 0 800 400" className="w-full h-auto">
              {fragmentationLadder.map((f, i) => {
                const x = 100 + i * 110
                const y = 200
                const nextX = 100 + (i + 1) * 110
                return (
                  <g key={i}>
                    {/* Box */}
                    <rect x={x - 45} y={y - 30} width="90" height="60" rx="8"
                      fill={i === 0 ? "#f97316" : i === 5 ? "#10b981" : "#7c3aed"}
                      stroke="#fbbf24" strokeWidth="2"/>
                    <text x={x} y={y - 10} fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">m/z={f.mz}</text>
                    <text x={x} y={y + 5} fill="#fef3c7" fontSize="9" textAnchor="middle">{f.electrons} e⁻</text>
                    <text x={x} y={y + 18} fill="#e9d5ff" fontSize="8" textAnchor="middle">{f.symmetry}</text>

                    {/* Formula */}
                    <text x={x} y={y + 50} fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">{f.formula}</text>

                    {/* Arrow */}
                    {i < 5 && (
                      <g>
                        <line x1={x + 45} y1={y} x2={nextX - 45} y2={y} stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowRed)"/>
                        <text x={(x + nextX) / 2} y={y - 8} fill="#ef4444" fontSize="10" textAnchor="middle" fontWeight="bold">−CO</text>
                        <text x={(x + nextX) / 2} y={y + 15} fill="#fbbf24" fontSize="9" textAnchor="middle">−28 Da</text>
                      </g>
                    )}
                  </g>
                )
              })}
              <defs>
                <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#ef4444"/>
                </marker>
              </defs>
              <text x="400" y="380" fill="#a78bfa" fontSize="10" textAnchor="middle">
                Har bir bosqichda aynan −28 Da (¹²C¹⁶O) → Fe–CO bog'lari ekvivalent
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
              <div className="text-orange-400 font-bold text-sm mb-1">🔥 Termodinamik</div>
              <div className="text-xs text-purple-200">Fe–CO o'rtacha bog' energiyasi D̄ = 118 kJ/mol. Ekvatorial/aksial farq ~7 kJ/mol.</div>
            </div>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
              <div className="text-purple-400 font-bold text-sm mb-1">⚡ Kinetik</div>
              <div className="text-xs text-purple-200">EI 70 eV = 6755 kJ/mol → 5 CO uzilishi (590 kJ/mol) uchun etarli energiya.</div>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
              <div className="text-green-400 font-bold text-sm mb-1">🎯 Prognoz</div>
              <div className="text-xs text-purple-200">Barcha bosqichlarda −28 masofa = Fe(CO)ₙ oilasining teng bog'lariga dalil.</div>
            </div>
          </div>
        </div>

        {/* ═══ 6. IZOTOP CLUSTER ═══ */}
        <div className="bg-purple-900/40 border border-orange-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧪</span> Fe izotop cluster — molekulyar ion detalizatsiyasi
          </h2>
          <p className="text-purple-200 text-sm">
            Fe elementi 4 ta tabiiy izotopga ega. Ular [Fe(CO)₅]•⁺ molekulyar ionda quyidagi barmoq izini beradi:
          </p>

          <div className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-6">
            <svg viewBox="0 0 700 320" className="w-full h-auto">
              {[20, 40, 60, 80, 100].map(pct => (
                <g key={pct}>
                  <line x1="60" y1={260 - (pct/100)*220} x2="680" y2={260 - (pct/100)*220} stroke="#a78bfa" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.4"/>
                  <text x="55" y={260 - (pct/100)*220 + 3} fill="#c4b5fd" fontSize="9" textAnchor="end">{pct}%</text>
                </g>
              ))}
              {isotopeCluster.map((iso, i) => {
                const x = 60 + ((iso.mz - 193) / 7) * 620
                const h = (iso.abundance / 100) * 220
                const y = 260 - h
                const isMain = iso.mz === 196
                return (
                  <g key={iso.mz}>
                    <line x1={x} y1="260" x2={x} y2={y}
                      stroke={isMain ? "#f97316" : "#ef4444"}
                      strokeWidth={isMain ? "8" : "4"}
                      strokeLinecap="round"/>
                    <circle cx={x} cy={y} r={isMain ? "8" : "4"} fill={isMain ? "#fbbf24" : "#ef4444"} stroke="#fff" strokeWidth="1"/>
                    <text x={x} y={y - 12} fill={isMain ? "#fbbf24" : "#ef4444"} fontSize="10" textAnchor="middle" fontWeight="bold">
                      {iso.mz}
                    </text>
                    <text x={x} y="285" fill="#e9d5ff" fontSize="10" textAnchor="middle" fontWeight={isMain ? "bold" : "normal"}>{iso.mz}</text>
                    <text x={x} y="300" fill="#a78bfa" fontSize="8" textAnchor="middle">{iso.abundance}%</text>
                  </g>
                )
              })}
              <line x1="60" y1="260" x2="680" y2="260" stroke="#e9d5ff" strokeWidth="0.5"/>
              <text x="370" y="315" fill="#e9d5ff" fontSize="11" textAnchor="middle" fontWeight="bold">m/z (Da)</text>
              <text x="370" y="20" fill="#f97316" fontSize="13" textAnchor="middle" fontWeight="bold">
                [Fe(CO)₅]•⁺ izotop cluster (NIST 2021)
              </text>
            </svg>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orange-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">m/z</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">Izotopolog</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">Nisbiy (%)</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {isotopeCluster.map((iso, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${iso.mz === 196 ? "bg-orange-900/30 border-l-4 border-l-orange-400" : ""}`}>
                    <td className="py-3 px-3 text-orange-300 font-mono font-bold">{iso.mz}</td>
                    <td className="py-3 px-3 text-purple-200 font-mono text-xs">{iso.isotope}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-purple-950/50 rounded-full h-2">
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full" style={{width: `${iso.abundance}%`}}></div>
                        </div>
                        <span className="text-white text-xs font-mono">{iso.abundance}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs text-purple-300 italic">{iso.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-red-900/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-200 text-sm">
              <strong className="text-red-300">🎯 Diagnostik ahamiyati:</strong> M−2 pik (⁵⁴Fe, 5.8%) mavjudligi
              — Fe elementining <strong>shubhasiz dalili</strong>. Bu naqsh Ni, Cr, Cu kabi boshqa metallardan farq qiladi.
              HRMS (R &gt; 20 000) esa ⁵⁴Fe(CO)₅ va ⁵⁶Fe(¹³C)(CO)₄ izotopologalarni bir-biridan ajratadi (Δm ≈ 0.005 Da).
            </p>
          </div>
        </div>

        {/* ═══ 7. HRMS PPM KALKULYATORI ═══ */}
        <div className="bg-purple-900/40 border border-orange-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎯</span> HRMS aniqligi — ppm kalkulyatori
          </h2>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
            <div className="text-orange-300 text-xl font-mono">Δppm = (m<sub>obs</sub> − m<sub>calc</sub>) / m<sub>calc</sub> × 10⁶</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-5">
              <label className="text-xs text-purple-400 block mb-2">Nazariy massa (calc)</label>
              <div className="bg-purple-950/70 rounded-lg p-3">
                <div className="text-cyan-300 text-2xl font-mono text-center">{COMPOUND.molecularIonExact}</div>
                <div className="text-xs text-purple-400 text-center mt-1">Da (⁵⁶Fe + 5×¹²C + 5×¹⁶O)</div>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-5">
              <label className="text-xs text-purple-400 block mb-2">Kuzatilgan massa (obs)</label>
              <input type="range" min="195.900" max="195.920" step="0.0001" value={obsMz}
                onChange={(e) => setObsMz(Number(e.target.value))}
                className="w-full accent-orange-500"/>
              <div className="text-green-300 text-2xl font-mono text-center mt-2">{ppmCalc.obs}</div>
              <div className="text-xs text-purple-400 text-center mt-1">Da (HRMS o'lchovi)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border-2 border-orange-500/50 rounded-xl p-6 text-center">
              <div className="text-xs text-orange-400 mb-2">Massa farqi (Δm)</div>
              <div className="text-orange-300 text-3xl font-mono font-bold">{ppmCalc.diff}</div>
              <div className="text-xs text-purple-300 mt-2">Da</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-2 border-blue-500/50 rounded-xl p-6 text-center">
              <div className="text-xs text-blue-400 mb-2">Xatolik (ppm)</div>
              <div className="text-cyan-300 text-3xl font-mono font-bold">{ppmCalc.ppm}</div>
              <div className="text-xs text-purple-300 mt-2">million qismga nisbatan</div>
            </div>
            <div className={`bg-gradient-to-br rounded-xl p-6 text-center border-2 ${
              Math.abs(parseFloat(ppmCalc.ppm)) < 5 ? "from-green-900/40 to-emerald-900/40 border-green-500/50" :
              Math.abs(parseFloat(ppmCalc.ppm)) < 10 ? "from-yellow-900/40 to-orange-900/40 border-yellow-500/50" :
              "from-red-900/40 to-pink-900/40 border-red-500/50"
            }`}>
              <div className="text-xs mb-2 text-purple-300">Xulosa</div>
              <div className="text-white text-sm font-bold">{ppmCalc.verdict}</div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">🎓 IUPAC 2013 talabi:</strong> Yangi kompleks birikma jurnal maqolada
              chop etilishi uchun HRMS xatoligi <strong>&lt; 5 ppm</strong> bo'lishi shart. Orbitrap va Q-TOF asboblari
              bu darajaga bemalol yetadi (0.5–3 ppm). Kvadrupol asboblar (100–500 ppm) faqat nominal massa uchun mos.
            </p>
          </div>
        </div>

        {/* ═══ 8. METALL KARBONILLAR SERIYASI ═══ */}
        <div className="bg-purple-900/40 border border-orange-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🏭</span> Metall karbonillar oilasi — mass-spektri taqqoslash
          </h2>
          <p className="text-purple-200 text-sm">
            18-elektron qoidasiga bo'ysunuvchi klassik metall karbonillar. Har biri o'z CO soniga mos fragment beradi:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orange-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">Rang</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">Formula</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">M (g/mol)</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">m/z (M•⁺)</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">d-config</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">18 e⁻ hisobi</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">Fragment</th>
                </tr>
              </thead>
              <tbody>
                {carbonylSeries.map((c, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-orange-900/20 transition-colors ${c.current ? "bg-orange-900/30 border-l-4 border-l-orange-400" : ""}`}>
                    <td className="py-3 px-3">
                      <div className="w-6 h-6 rounded border-2 border-white/20" style={{background: c.color}}></div>
                    </td>
                    <td className="py-3 px-3 text-orange-300 font-mono text-xs">{c.formula}</td>
                    <td className="py-3 px-3 text-white font-mono">{c.mw}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">{c.mMz}</td>
                    <td className="py-3 px-3 text-purple-200 font-mono text-xs">{c.dConfig}</td>
                    <td className="py-3 px-3 text-green-300 font-mono text-xs">{c.eightRule}</td>
                    <td className="py-3 px-3 text-xs">
                      {c.current ? <strong className="text-orange-400">← BU KOMPLEKS</strong> : c.pattern}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ 9. IONLASHTIRISH USULLARI ═══ */}
        <div className="bg-purple-900/40 border border-orange-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> Ionlashtirish usullari — [Fe(CO)₅] uchun tavsiyalar
          </h2>

          <div className="flex flex-wrap gap-2">
            {ionizationTechniques.map((t, i) => (
              <button key={i} onClick={() => setSelectedTech(i)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedTech === i ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30" :
                  "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60"
                } ${t.current ? "ring-2 ring-orange-400" : ""}`}>
                {t.current && "⭐ "}{t.name.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-6">
            <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-2xl font-bold text-orange-400">{ionizationTechniques[selectedTech].name}</h3>
              {ionizationTechniques[selectedTech].current && (
                <span className="text-xs px-3 py-1 rounded-full bg-orange-600 text-white font-bold">⭐ Tavsiya etilgan</span>
              )}
            </div>
            <p className="text-purple-200 text-sm mb-4">{ionizationTechniques[selectedTech].description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-3">
                <p className="text-green-400 font-bold text-xs mb-2">✓ Afzalliklari</p>
                <ul className="text-purple-200 text-xs space-y-1">
                  {ionizationTechniques[selectedTech].advantages.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-3">
                <p className="text-red-400 font-bold text-xs mb-2">✗ Kamchiliklari</p>
                <ul className="text-purple-200 text-xs space-y-1">
                  {ionizationTechniques[selectedTech].disadvantages.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-900/20 rounded-lg p-2 text-center">
                <div className="text-[10px] text-blue-400 uppercase">Rezolyutsiya</div>
                <div className="text-white text-xs font-mono">{ionizationTechniques[selectedTech].resolution}</div>
              </div>
              <div className="bg-cyan-900/20 rounded-lg p-2 text-center">
                <div className="text-[10px] text-cyan-400 uppercase">m/z diapazon</div>
                <div className="text-white text-xs font-mono">{ionizationTechniques[selectedTech].mzRange}</div>
              </div>
              <div className="bg-yellow-900/20 rounded-lg p-2 text-center">
                <div className="text-[10px] text-yellow-400 uppercase">Ideal</div>
                <div className="text-white text-[10px]">{ionizationTechniques[selectedTech].bestFor}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ 10. HALAQIT BERUVCHI OMILLAR ═══ */}
        <div className="bg-purple-900/40 border border-orange-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚠️</span> Halaqit beruvchi omillar va yechimlari
          </h2>

          <div className="space-y-3">
            {interferences.map((intf, i) => (
              <div key={i} className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2 gap-3">
                  <h4 className="text-orange-300 font-bold text-sm">{intf.source}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    intf.severity === "Yuqori" ? "bg-red-900/40 text-red-300 border border-red-500/40" :
                    intf.severity === "O'rta" ? "bg-yellow-900/40 text-yellow-300 border border-yellow-500/40" :
                    "bg-green-900/40 text-green-300 border border-green-500/40"
                  }`}>
                    {intf.severity}
                  </span>
                </div>
                <p className="text-purple-300 text-xs italic mb-2">📍 Sohasi: {intf.range}</p>
                <p className="text-purple-200 text-sm mb-2">
                  <strong className="text-red-400">Ta'siri:</strong> {intf.effect}
                </p>
                <p className="text-purple-200 text-sm">
                  <strong className="text-green-400">✅ Yechim:</strong> {intf.solution}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ 11. TARIXIY XRONOLOGIYA ═══ */}
        <div className="bg-purple-900/40 border border-orange-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📜</span> Tarixiy xronologiya
          </h2>

          <div className="space-y-2">
            {historicalTimeline.map((t, i) => (
              <div key={i} className="flex gap-4 items-start bg-purple-950/50 border border-purple-700/40 rounded-lg p-3 hover:border-orange-500/50 transition-all">
                <div className="w-16 flex-shrink-0 text-orange-400 font-mono font-bold text-sm">{t.year}</div>
                <div className="text-purple-200 text-xs">{t.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ 12. AMALIY AHAMIYATI ═══ */}
        <div className="bg-purple-900/40 border border-orange-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎯</span> Amaliy ahamiyati va qo'llanish sohalari
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {applications.map((a, i) => (
              <div key={i} className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-4 hover:border-orange-500/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{a.icon}</div>
                  <div>
                    <h4 className="text-orange-300 font-bold text-sm mb-1">{a.field}</h4>
                    <p className="text-purple-200 text-xs">{a.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ 13. ILMIY MANBALAR ═══ */}
        <div className="bg-gradient-to-br from-slate-900/80 to-purple-950/80 border border-purple-800/40 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📚</span> Ilmiy manbalar
          </h2>
          <ul className="space-y-2 text-purple-300 text-xs">
            <li>• <strong className="text-orange-300">J. H. Gross</strong> — <em>Mass Spectrometry: A Textbook</em> (3rd ed., Springer, 2017)</li>
            <li>• <strong className="text-orange-300">W. Henderson, J. S. McIndoe</strong> — <em>Mass Spectrometry of Inorganic and Organometallic Compounds</em> (Wiley, 2005)</li>
            <li>• <strong className="text-orange-300">F. W. McLafferty, F. Tureček</strong> — <em>Interpretation of Mass Spectra</em> (4th ed.)</li>
            <li>• <strong className="text-orange-300">R. B. King</strong> — <em>J. Am. Chem. Soc.</em> 88, 2075 (1966) — [Fe(CO)₅] EI mass-spektri</li>
            <li>• <strong className="text-orange-300">L. Mond, C. Langer, F. Quincke</strong> — <em>J. Chem. Soc.</em> 59, 604 (1891) — Fe(CO)₅ kashfiyoti</li>
            <li>• <strong className="text-orange-300">NIST 2021</strong> — Atomic Weights and Isotopic Compositions (CODATA)</li>
            <li>• <strong className="text-orange-300">NIST Chemistry WebBook</strong> — Mass Spectrum, ID 13463-40-6</li>
            <li>• <strong className="text-orange-300">IUPAC Gold Book</strong> — Mass spectrometry terminology (2013)</li>
            <li>• <strong className="text-orange-300">G. Wilkinson, F. G. A. Stone</strong> — <em>Comprehensive Organometallic Chemistry</em> (Pergamon)</li>
            <li>• <strong className="text-orange-300">E. W. Abel</strong> — <em>Comprehensive Coordination Chemistry II</em>, Vol. 5 (Elsevier, 2003)</li>
          </ul>
        </div>

      </section>

    </main>
  )
}
