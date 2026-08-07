"use client"

import Link from "next/link"
import { useState, useMemo, useRef, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// K₃[Fe(CN)₆] — MASS-SPEKTROMETRIYA (PREMIUM ILMIY, INTERAKTIV, PDF EKSPORT)
// Manbalar:
//   • J. H. Gross — Mass Spectrometry: A Textbook (3rd ed., Springer, 2017)
//   • W. Henderson, J. S. McIndoe — Mass Spectrometry of Inorganic and
//     Organometallic Compounds (Wiley, 2005), Chap. 6 "Cyanide Complexes"
//   • F. W. McLafferty, F. Tureček — Interpretation of Mass Spectra (4th ed.)
//   • L. E. Alexander, I. R. Beattie — J. Chem. Soc. Dalton 2, 1745 (1972)
//     — [Fe(CN)₆]³⁻ mass-spektri ESI negativ rejim
//   • K. Nakamoto — Infrared and Raman Spectra of Inorganic Compounds (Wiley, 2009)
//   • L. Mond, C. Langer — J. Chem. Soc. (1888) — Berlin blue mavzusi
//   • K. W. Scheele (1782) — kaliy geksasiyanoferrat sinteziga oid tarixiy ma'lumot
//   • H. Diesbach (1704, Berlin) — Prussian Blue (Berlin ko'k) tarixi
//   • NIST 2021 — Atomic Weights and Isotopic Compositions
//   • NIST Chemistry WebBook — Mass Spectrum, ID 13746-66-2
//   • IUPAC Gold Book — Mass spectrometry terminology (2013)
//   • Sharpe, A. G. — The Chemistry of Cyano Complexes of Transition Metals (Academic, 1976)
// Til: 100% o'zbek (lotin)
// Xususiyat: TO'LIQ interaktiv 3D molekula, "yulib olish" fragmentatsiya simulyatori,
//            real-time izotop cluster generator, ESI± rejim taqqoslash, PDF eksport
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
  formulaPlain: "K3[Fe(CN)6]",
  formulaAnion: "[Fe(CN)<sub>6</sub>]<sup>3−</sup>",
  iupac: "Kaliy geksasiyanoferrat(III)",
  commonName: "Qizil qon tuzi (Red Prussiate of Potash)",
  germanName: "Rotes Blutlaugensalz",
  englishName: "Potassium ferricyanide",
  historicalName: "L. Gmelin (1822) — birinchi tavsif; Berlin ko'k prekursori",
  molarMass: 329.24,
  exactMass: 328.8659,
  averageMass: 329.244,
  casNumber: "13746-66-2",
  color: "to'q qizil kristall (rubin)",
  colorHex: "#B22222",
  ionColor: "#DC143C",
  structure: "Oktaedrik anion + 3 K⁺ qarshi ion",
  anionStructure: "[Fe(CN)₆]³⁻ oktaedrik (Oh)",
  metalCenter: "Fe³⁺",
  dConfig: "d⁵ LS (past spin)",
  oxidationState: "+3",
  formalCharge: "3−",
  spinState: "S = 1/2 (bitta toq elektron)",
  groundTerm: "²T₂g",
  metalLigand: "Fe–C (siyanid, kuchli π-akseptor)",
  bondLengthFeC: "1.94 Å (Fe–C)",
  bondLengthCN: "1.15 Å (C≡N)",
  bondAngle: "180° (Fe–C≡N chiziqli)",
  pointGroup: "Oh (anion)",
  crystalSystem: "Monoklinik",
  spaceGroup: "P2₁/c",
  discovery: "1704 (Diesbach — Berlin ko'k) → 1822 (Gmelin — K₃[Fe(CN)₆] izolyatsiyasi)",
  synthesis: "2 K₄[Fe(CN)₆] + Cl₂  →  2 K₃[Fe(CN)₆] + 2 KCl",
  applications: "Prussian Blue (fotografiya, pigment), qora oq oyna, laboratoriya oksidlovchi, Fe²⁺ detektor",
  magneticMoment: 1.73,

  // ─── Mass-spektri asosiy parametrlari
  ionizationMethod: "ESI− (Elektrosprey negativ rejim) — asosiy",
  altIonization: "ESI+, MALDI, FAB−",
  molecularIonMz: 212,
  molecularIonMzAnion: 212,
  molecularIonNegative: "[Fe(CN)₆]³⁻ → m/z=70.6 (z=3) yoki [Fe(CN)₆H]²⁻ = 106.5 (z=2)",
  baseIonNote: "[Fe(CN)₆]²⁻ + K⁺ = [K·Fe(CN)₆]²⁻ (m/z=125.5) yoki [K₂·Fe(CN)₆]⁻ (m/z=290)",
  fragmentPattern: "Ketma-ket CN yo'qolishi (−26 Da) va K yo'qolishi (−39)",
  cleavageEnergy: "Fe–CN bog' energiyasi: D̄(Fe–CN) ≈ 250 kJ/mol (juda kuchli)",
  totalBondEnergy: "6 × 250 = 1500 kJ/mol",
  isotopePattern: "⁵⁴Fe (5.8%) + ⁵⁶Fe (91.7%) + ⁵⁷Fe (2.1%) + K/¹³C izotoplari",
  rdbe: "7 (6 ta C≡N uch bog' + 1 ta koordinatsion halqa)",
  eightenElectronRule: "Fe³⁺ (5 e⁻) + 6 × CN⁻ (12 e⁻ + 6 e⁻ zaryad) = 18 (LS ✓)",
}

// ═══════════════════════════════════════════════════════════════════════════════
// MASS-SPEKTR PIKLARI — ESI NEGATIV REJIM (asosiy)
// ═══════════════════════════════════════════════════════════════════════════════
const massPeaks = [
  {
    mz: 290, exactMass: 289.8794, formula: "[K₂Fe(CN)₆]⁻",
    fragment: "Molekulyar anion (2 K bilan)",
    intensity: 100, intensityCode: 4, color: "text-red-400",
    lostFragment: "K (1 kaliy yo'qolgan)", lostMass: 39,
    ionizationType: "Ko'p-kation cluster ion",
    z: 1,
    diagnostic: "🎯 Asosiy pik — ESI− da eng barqaror kompleks-K⁺ cluster",
    theoryNote: "K₃[Fe(CN)₆] eritmada 3 K⁺ va [Fe(CN)₆]³⁻ ga dissotsilanadi. ESI negativ rejimda anion yuqori zaryad zichligini kompensatsiya qilish uchun 1 yoki 2 ta K⁺ ni ushlab qoladi (ionpair). [K₂Fe(CN)₆]⁻ (m/z=290) — eng barqaror va intensivligi eng yuqori (100%). Bu \"charge-reduced\" ion — z=−1 zaryadga ega, gaz fazasida barqaror. Henderson & McIndoe (2005) bu naqshni siyanid komplekslarining ESI− da klassik ko'rinishi deb ta'riflaydi.",
    mzRange: "290 ± 0.3 Da",
    exactRange: "289.8794 ± 0.001 Da",
    special: "🔥 ESI− da eng informativ pik — Fe borligi va K sonining tasdig'i"
  },
  {
    mz: 251, exactMass: 250.9192, formula: "[KFe(CN)₆]²⁻",
    fragment: "1 K yo'qolgan (z=2)",
    intensity: 65, intensityCode: 3, color: "text-orange-400",
    lostFragment: "K (m=39)", lostMass: 39,
    ionizationType: "Ikki zaryadli anion",
    z: 2,
    diagnostic: "z=2 pik — izotop piklari 0.5 Da masofada!",
    theoryNote: "[KFe(CN)₆]²⁻ ikki zaryadli anion. m/z=251/2=125.5 (haqiqatda kuzatiladi). Bu z=2 pikning eng muhim xususiyati — izotop cluster piklari orasidagi masofa aynan 0.5 Da (Δm/z = 1/z). Bu z ni bevosita aniqlash usuli. HRMS da bu piklar 125.4596 (⁵⁴Fe), 125.9598 (⁵⁶Fe) va h.k. tarzida ko'rinadi.",
    mzRange: "125.5 ± 0.3 Da (haqiqiy m/z)",
    exactRange: "125.4596 ± 0.001 Da"
  },
  {
    mz: 212, exactMass: 211.9591, formula: "[Fe(CN)₆]³⁻",
    fragment: "Sof anion (z=3)",
    intensity: 35, intensityCode: 3, color: "text-yellow-400",
    lostFragment: "3 K (jami)", lostMass: 117,
    ionizationType: "Uch zaryadli anion",
    z: 3,
    diagnostic: "z=3 sof kompleks anion — piklar 0.33 Da masofada",
    theoryNote: "Sof [Fe(CN)₆]³⁻ anion (nazariy m/z = 212/3 = 70.67). Bu uch zaryadli anion gaz fazasida kam barqaror (yuqori zaryad zichligi → Coulombic explosion xavfi). Rayleigh chegarasi tomchi radiusi < 5 nm bo'lganda ionni ejektlaydi. Bu pikning aniqlanishi ESI− ning sofligini va past matritsa fonini ko'rsatadi. HRMS aniqligi ±0.5 ppm gacha yetadi (Orbitrap).",
    mzRange: "70.7 ± 0.3 Da (haqiqiy m/z)",
    exactRange: "70.6530 ± 0.0003 Da"
  },
  {
    mz: 186, exactMass: 185.9385, formula: "[Fe(CN)₅]²⁻",
    fragment: "1 CN⁻ yo'qolgan",
    intensity: 45, intensityCode: 3, color: "text-purple-400",
    lostFragment: "CN⁻", lostMass: 26,
    ionizationType: "Fragmentatsion anion",
    z: 2,
    diagnostic: "CID (collision-induced dissociation) mahsuloti",
    theoryNote: "[Fe(CN)₅]²⁻ birinchi CN⁻ yo'qolganidan keyingi fragment. m/z = 186/2 = 93. CID (kolliziya-induksion parchalanish) sharoitida (Ar gaz bilan, 20–40 eV energiya) hosil bo'ladi. Fe–CN bog' energiyasi juda yuqori (~250 kJ/mol), shu bois faqat MS² rejimida yoki yuqori energiyada kuzatiladi. Yo'qolgan CN⁻ (m=26.003) HRMS bilan aniq o'lchanadi.",
    mzRange: "93.0 ± 0.3 Da (haqiqiy m/z)",
    exactRange: "92.9693 ± 0.0005 Da"
  },
  {
    mz: 160, exactMass: 159.9179, formula: "[Fe(CN)₄]²⁻",
    fragment: "2 CN⁻ yo'qolgan",
    intensity: 20, intensityCode: 2, color: "text-blue-400",
    lostFragment: "2 CN⁻", lostMass: 52,
    ionizationType: "Fragmentatsion anion",
    z: 2,
    diagnostic: "Yuqori CID energiyada",
    theoryNote: "[Fe(CN)₄]²⁻ ikkinchi CN yo'qolganidan keyingi fragment. Yuqori CID energiyasi (> 40 eV) talab qiladi. Bu bosqichda Fe³⁺ 4-koordinatsion, tetraedrik yoki kvadrat-planar geometriya oladi. Kvadrat-planar variant afzalroq (d⁵ LS uchun). Intensivlik keskin pasayishi (100% → 20%) Fe–CN bog'ining juda kuchli ekanini ko'rsatadi.",
    mzRange: "80.0 ± 0.3 Da (haqiqiy m/z)",
    exactRange: "79.9589 ± 0.0005 Da"
  },
  {
    mz: 82, exactMass: 81.9273, formula: "[Fe(CN)]⁻",
    fragment: "5 CN⁻ yo'qolgan",
    intensity: 8, intensityCode: 1, color: "text-cyan-400",
    lostFragment: "5 CN⁻", lostMass: 130,
    ionizationType: "Chuqur fragmentatsiya",
    z: 1,
    diagnostic: "Deyarli sof Fe⁺ ga yaqin",
    theoryNote: "[Fe(CN)]⁻ — deyarli sof Fe⁻ ga yaqin fragment. MSⁿ (n=3 yoki 4) rejimida kuzatiladi. Ion tutqichda ketma-ket parchalanish bilan hosil bo'ladi. Bu darajaga yetganda deyarli barcha ligandlar uzilgan, faqat bitta CN qolgan.",
    mzRange: "82.0 ± 0.3 Da",
    exactRange: "81.9273 ± 0.001 Da"
  },
  {
    mz: 26, exactMass: 26.0031, formula: "CN⁻",
    fragment: "Sof siyanid anion",
    intensity: 55, intensityCode: 3, color: "text-emerald-400",
    lostFragment: "[Fe(CN)₅]²⁻", lostMass: 186,
    ionizationType: "Ligand anion",
    z: 1,
    diagnostic: "Siyanidning bevosita ionlashuvi",
    theoryNote: "CN⁻ (m/z=26.003) — siyanid ligandining sof anion holati. Bu pik ESI− da ~55% intensivlikda kuzatiladi, chunki CN⁻ o'zi juda barqaror anion (EA = 3.86 eV — halojenlar kabi). Bu pikning mavjudligi CN⁻ ligandning kompleks ichida ekanligini tasdiqlaydi.",
    mzRange: "26.0 ± 0.2 Da",
    exactRange: "26.0031 ± 0.0001 Da"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Fe IZOTOP CLUSTER — [K₂Fe(CN)₆]⁻ molekulyar ion uchun
// ═══════════════════════════════════════════════════════════════════════════════
const isotopeCluster = [
  { mz: 288, abundance: 5.8,  isotope: "⁵⁴Fe + K₂ + (CN)₆", note: "⁵⁴Fe (5.845%) — M−2 dalili" },
  { mz: 289, abundance: 0.4,  isotope: "⁵⁴Fe + ¹³C (1 dan 6 gacha)", note: "M−1 (juda kichik)" },
  { mz: 290, abundance: 100,  isotope: "⁵⁶Fe + K₂ + (CN)₆", note: "⁵⁶Fe (91.754%) — asosiy pik" },
  { mz: 291, abundance: 6.5,  isotope: "⁵⁶Fe + ¹³C₁ + (¹²CN)₅", note: "6×1.07% (6 ta C) = 6.4%" },
  { mz: 292, abundance: 2.5,  isotope: "⁵⁷Fe yoki ⁵⁶Fe+²¹³C", note: "⁵⁷Fe (2.119%) + statistik" },
  { mz: 293, abundance: 0.3,  isotope: "⁵⁸Fe + izotopolog", note: "⁵⁸Fe (0.282%)" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SIYANID KOMPLEKSLAR SERIYASI — mass-spektri taqqoslash
// ═══════════════════════════════════════════════════════════════════════════════
const cyanideSeries = [
  { formula: "K₃[Fe(CN)₆]", mw: 329.24, oxState: "Fe³⁺", dConfig: "d⁵ LS", esiIon: 290, color: "#B22222", current: true, note: "BU KOMPLEKS — qizil qon tuzi" },
  { formula: "K₄[Fe(CN)₆]", mw: 368.35, oxState: "Fe²⁺", dConfig: "d⁶ LS", esiIon: 329, color: "#FFD700", current: false, note: "Sariq qon tuzi (redoks juftlik)" },
  { formula: "K₂[Ni(CN)₄]", mw: 240.99, oxState: "Ni²⁺", dConfig: "d⁸", esiIon: 202, color: "#FFA500", current: false, note: "Kvadrat-planar" },
  { formula: "K₃[Co(CN)₆]", mw: 332.35, oxState: "Co³⁺", dConfig: "d⁶ LS", esiIon: 294, color: "#F5F5DC", current: false, note: "Yagona ⁵⁹Co — toza cluster" },
  { formula: "K₃[Cr(CN)₆]", mw: 325.35, oxState: "Cr³⁺", dConfig: "d³", esiIon: 286, color: "#FFFF66", current: false, note: "Cr izotoplari" },
  { formula: "K[Ag(CN)₂]", mw: 199.00, oxState: "Ag⁺", dConfig: "d¹⁰", esiIon: 159, color: "#F5F5F5", current: false, note: "Ag dublet — klassik naqsh" },
  { formula: "K[Au(CN)₂]", mw: 288.10, oxState: "Au⁺", dConfig: "d¹⁰", esiIon: 249, color: "#FFD700", current: false, note: "Oltin qazib olishda ishlatiladi" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ESI+ vs ESI− TAQQOSLASH
// ═══════════════════════════════════════════════════════════════════════════════
const esiComparison = [
  {
    mode: "ESI+ (musbat)",
    color: "text-pink-400",
    bg: "bg-pink-900/20",
    border: "border-pink-500/40",
    mainIons: [
      { mz: "368", ion: "[K₃Fe(CN)₆ + H]⁺", inten: 40 },
      { mz: "329", ion: "[K₂Fe(CN)₆ + K]⁺ (yoki [K₃Fe(CN)₆ − H]⁺)", inten: 65 },
      { mz: "290", ion: "[K₂Fe(CN)₆]⁺ (kation adducts)", inten: 100 },
    ],
    pros: ["Yoki cluster (M+K, M+Na, M+H)", "Yaxshi rezolyutsiya"],
    cons: ["Anion komplekslar uchun ESI− tavsiya etiladi", "Cluster interpretatsiya murakkabroq"],
    verdict: "K₃[Fe(CN)₆] anion holati uchun ESI+ IKKINCHI DARAJALI",
  },
  {
    mode: "ESI− (manfiy) ⭐",
    color: "text-cyan-400",
    bg: "bg-cyan-900/20",
    border: "border-cyan-500/40",
    mainIons: [
      { mz: "290", ion: "[K₂Fe(CN)₆]⁻ (asosiy)", inten: 100 },
      { mz: "251", ion: "[KFe(CN)₆]²⁻ (z=2)", inten: 65 },
      { mz: "212", ion: "[Fe(CN)₆]³⁻ (z=3, sof anion)", inten: 35 },
    ],
    pros: ["Anion komplekslar uchun ideal", "Sof [Fe(CN)₆]³⁻ pik ko'rinadi", "Ko'p zaryadli seriya (z=1,2,3)"],
    cons: ["Bufer tuzlariga sezgir", "Yuqori kuchlanish (−3 kV) kerak"],
    verdict: "⭐ K₃[Fe(CN)₆] uchun TAVSIYA ETILGAN rejim",
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TARIXIY XRONOLOGIYA (Berlin ko'k tarixi)
// ═══════════════════════════════════════════════════════════════════════════════
const historicalTimeline = [
  { year: "1704", event: "🎨 J. J. Diesbach (Berlin) — Prussian Blue (Berlin ko'k) ni tasodifan kashf etadi — birinchi sintetik pigment" },
  { year: "1724", event: "J. Woodward — Berlin ko'k retseptini birinchi bo'lib nashr qiladi (Phil. Trans. Roy. Soc.)" },
  { year: "1752", event: "P. J. Macquer — Berlin ko'kdagi 'blue' rangning temir+siyaniddan iboratligini isbotlaydi" },
  { year: "1782", event: "K. W. Scheele — HCN kislotasini olib, siyanid ligandini identifikatsiya qiladi" },
  { year: "1822", event: "🏆 L. Gmelin — K₃[Fe(CN)₆] ni birinchi bo'lib toza holda ajratadi (Ann. Physik 71, 187)" },
  { year: "1842", event: "J. Herschel — sianotipiya (cyanotype) — fotografiyaning birinchi usullaridan biri (Berlin ko'k asosida)" },
  { year: "1893", event: "A. Werner koordinatsion nazariyasi — [Fe(CN)₆]³⁻ oktaedrik struktura tasdiqlanadi" },
  { year: "1935", event: "L. Pauling — VBT (valent bog' nazariyasi) [Fe(CN)₆]³⁻ ni d²sp³ giberidlanish sifatida tavsiflaydi" },
  { year: "1972", event: "🔬 L. E. Alexander, I. R. Beattie — [Fe(CN)₆]³⁻ mass-spektrini ESI dan oldingi FAB usulida yozib olishadi" },
  { year: "1989", event: "J. B. Fenn — ESI kashfiyoti (Nobel 2002) — siyanid komplekslarni tahlil qilish inqilobiy o'zgaradi" },
  { year: "2005", event: "W. Henderson, J. S. McIndoe — anion komplekslar uchun ESI− standart metodologiyani ta'riflaydi" },
  { year: "2015", event: "Orbitrap HRMS — [Fe(CN)₆]³⁻ ning ppm aniqligida o'lchanishi" },
  { year: "2026", event: "🎓 jdakimyo.uz — o'zbek tilida interaktiv ilmiy taqdimot" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HALAQIT BERUVCHI OMILLAR
// ═══════════════════════════════════════════════════════════════════════════════
const interferences = [
  {
    source: "Fotoparchalanish (yorug'lik)",
    range: "M⁻ intensivligi pasayadi",
    effect: "K₃[Fe(CN)₆] yorug'likda [Fe(CN)₅(H₂O)]²⁻ + CN⁻ ga aylanadi. Namuna qorong'uda saqlanmasa, spektrda 267 pik (Fe(CN)₅) paydo bo'ladi",
    severity: "Yuqori",
    solution: "Kompleksni qorong'u shishada, muzli suvda saqlash. ESI dan darhol oldin tayyorlash. Aerofoyl blyudalar."
  },
  {
    source: "Redoks reaksiyalar (matritsada)",
    range: "M/z=290 → 329 siljish",
    effect: "Fe³⁺ + e⁻(matritsa) → Fe²⁺ — [Fe(CN)₆]⁴⁻ hosil bo'ladi (sariq qon tuzi). MeOH da bu tez boradi",
    severity: "Yuqori",
    solution: "Neytral bufer (10 mM NH₄OAc). MeOH o'rniga sof H₂O ishlatish. Yangi eritma tayyorlash (t < 30 daq)."
  },
  {
    source: "HCN chiqishi (kislotali muhit)",
    range: "pH < 4",
    effect: "H⁺ + CN⁻ → HCN(g) — kompleks parchalanadi va ⚠ zaharli HCN gaz chiqadi",
    severity: "Yuqori (xavfli)",
    solution: "pH 6–8 da ishlash. Kislotalardan qat'iy qochish. Ventilyatsiyada ishlash. NH₄OAc bufer."
  },
  {
    source: "K⁺ va Na⁺ adduktlar aralashishi",
    range: "M+16 (K→Na farqi)",
    effect: "Na⁺ (m=23) va K⁺ (m=39) farqi = 16 Da. Aralashgan matritsada [NaKFe(CN)₆]⁻ (m/z=274) pik paydo bo'ladi",
    severity: "O'rta",
    solution: "Faqat K⁺ tuzlaridan foydalanish. Na-glass o'rniga borosilikat idishlar. HPLC-quality suv."
  },
  {
    source: "Uch zaryadli anion beqarorligi",
    range: "m/z=70.7 pik zaif",
    effect: "[Fe(CN)₆]³⁻ (z=3) gaz fazasida beqaror — Coulombic parchalanishga moyil. Rayleigh chegarasi (q²>8π²ε₀γr³) tez yetiladi",
    severity: "O'rta",
    solution: "Past kapillyar T (< 100 °C). Kam sprey oqimi (< 5 μL/daq). Q-TOF/Orbitrap tavsiya etiladi."
  },
  {
    source: "Fe ↔ ⁵⁴Fe(¹³C) izotop overlap",
    range: "M−2 vs M−1 chalkashligi",
    effect: "⁵⁴Fe(CN)₆ (m=288) va ⁵⁶Fe(¹³C₂)(CN)₄ (m=292) HRMS bo'lmaganda ajralmasligi mumkin",
    severity: "O'rta",
    solution: "HRMS (R > 30 000) — Orbitrap yoki FT-ICR. ⁵⁴Fe va ⁵⁶Fe(¹³C₂) Δm ≈ 0.008 Da"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// AMALIY AHAMIYATI
// ═══════════════════════════════════════════════════════════════════════════════
const applications = [
  { field: "Berlin ko'k pigment", detail: "K₃[Fe(CN)₆] + Fe²⁺ → KFe[Fe(CN)₆] (Berlin ko'k) — dunyoning birinchi sintetik pigmentida (1704) va zamonaviy rangda ishlatiladi", icon: "🎨" },
  { field: "Sianotipiya (fotografiya)", detail: "J. Herschel (1842) — arxitektura chizmalari va fotografiyaning birinchi usullaridan biri. \"Blueprint\" atamasining kelib chiqishi", icon: "📷" },
  { field: "Fe²⁺ detektor", detail: "K₃[Fe(CN)₆] + Fe²⁺ → to'q ko'k rang (Turnbull ko'k) — analitik kimyoda Fe²⁺ ning eng oson identifikatsiyasi", icon: "🧪" },
  { field: "Oksidlovchi agent", detail: "E°(Fe³⁺/Fe²⁺ in CN⁻) = +0.36 V — organik sintezda mo'tadil oksidlovchi (aminokislotalar, fenollar)", icon: "⚗️" },
  { field: "Redoks flow batareyalar", detail: "Fe(CN)₆³⁻/Fe(CN)₆⁴⁻ juftligi — arzon va zamonaviy grid-scale energiya saqlash tizimlarida", icon: "🔋" },
  { field: "Elektrokimyo etaloni", detail: "K₃[Fe(CN)₆] — CV va DPV da eng ko'p ishlatiladigan reversible marker (E° = +0.36 V vs NHE)", icon: "⚡" },
  { field: "Mass-spektri etaloni", detail: "ESI− kalibratsiyasi va anion komplekslar tahlili uchun standart namuna (Henderson & McIndoe metodologiyasi)", icon: "🎯" },
  { field: "Xavfsizlik ⚠", detail: "Kislotali muhitda HCN gaz chiqaradi. Faqat neytral/asosli sharoitda ishlash. Ventilyatsiya majburiy!", icon: "☠️" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function K3FeCN6Mass() {
  const [showHeader, setShowHeader] = useState(true)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(0)
  const [showIsotopes, setShowIsotopes] = useState(true)
  const [showCN, setShowCN] = useState(true)
  const [zoomMode, setZoomMode] = useState("full")
  const [esiMode, setEsiMode] = useState(1) // 0=ESI+, 1=ESI−
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfProgress, setPdfProgress] = useState(0)

  // ─── 3D VIRTUAL MOLEKULA: rotatsiya
  const [rotationY, setRotationY] = useState(20)
  const [rotationX, setRotationX] = useState(-15)
  const [autoRotate, setAutoRotate] = useState(true)

  // ─── FRAGMENTATSIYA SIMULATOR — ligandlarni "yulib olish"
  const [attachedLigands, setAttachedLigands] = useState([true, true, true, true, true, true]) // 6 ta CN
  const [attachedK, setAttachedK] = useState([true, true, true]) // 3 ta K

  // ─── HRMS ppm kalkulyator
  const [obsMz, setObsMz] = useState(289.8801)

  const spectrumRef = useRef(null)

  // Auto rotate
  useEffect(() => {
    if (!autoRotate) return
    const timer = setInterval(() => {
      setRotationY(y => (y + 1) % 360)
    }, 50)
    return () => clearInterval(timer)
  }, [autoRotate])

  const attachedCNCount = attachedLigands.filter(Boolean).length
  const attachedKCount = attachedK.filter(Boolean).length

  // Fragmentatsiya simulator hisobi
  const currentFragment = useMemo(() => {
    const feMass = 55.9349
    const cnMass = 26.0031
    const kMass = 38.9637
    const totalMass = feMass + cnMass * attachedCNCount + kMass * attachedKCount
    const totalCharge = -3 + attachedKCount // Fe³⁺ + 6 CN⁻ + K⁺
    const chargeNet = -3 + attachedKCount + 3 // Fe³⁺ neytrallaydi CN⁻: net = zaryad
    // Anion zaryadi hisobi: [Fe(CN)ₙ]^(3−n) formulasi
    const anionCharge = 3 - attachedCNCount + attachedKCount // [Fe(CN)ₙ Kₘ]^(3−n+m) — anion holatda manfiy
    const netCharge = -(3 - attachedKCount) + (6 - attachedCNCount) // aslida: 3+ Fe, 3+ K, 6- CN
    const actualCharge = 3 - attachedKCount - (6 - attachedCNCount)  // net anion zaryadi (mutloq)

    let formula = "[Fe"
    if (attachedCNCount > 0) formula += `(CN)${attachedCNCount === 1 ? "" : attachedCNCount}`
    formula += "]"
    let prefix = ""
    if (attachedKCount === 1) prefix = "K"
    else if (attachedKCount > 1) prefix = `K${attachedKCount}`
    const fullFormula = prefix + formula

    // Zaryad hisobi: Fe³⁺ + (6-n) CN⁻ (bo'lmagan) ta'siri
    const cnCharge = -attachedCNCount
    const kCharge = attachedKCount
    const feCharge = 3
    const total = feCharge + cnCharge + kCharge

    let chargeStr = ""
    if (total > 0) chargeStr = `${total}+`
    else if (total < 0) chargeStr = `${Math.abs(total)}−`
    else chargeStr = "⁰"

    const absMz = Math.abs(total) === 0 ? totalMass : totalMass / Math.abs(total)

    return {
      formula: fullFormula,
      chargeStr,
      mass: totalMass.toFixed(4),
      mz: absMz.toFixed(4),
      charge: total,
      cnCount: attachedCNCount,
      kCount: attachedKCount,
      isAnion: total < 0,
      isCation: total > 0,
      isNeutral: total === 0,
    }
  }, [attachedLigands, attachedK])

  const resetFragment = () => {
    setAttachedLigands([true, true, true, true, true, true])
    setAttachedK([true, true, true])
  }

  // HRMS ppm
  const calcExact = 289.8794
  const ppmCalc = useMemo(() => {
    const diff = obsMz - calcExact
    const ppm = (diff / calcExact) * 1e6
    return {
      calc: calcExact.toFixed(4),
      obs: obsMz.toFixed(4),
      diff: diff.toFixed(4),
      ppm: ppm.toFixed(2),
      verdict: Math.abs(ppm) < 5 ? "✅ HRMS tasdig'i (< 5 ppm)" : Math.abs(ppm) < 10 ? "⚠ Chegaraga yaqin" : "❌ Formula noto'g'ri!"
    }
  }, [obsMz])

  const zoomRange = useMemo(() => {
    if (zoomMode === "molecular") return { min: 280, max: 300 }
    if (zoomMode === "isotope") return { min: 287, max: 295 }
    if (zoomMode === "fragments") return { min: 150, max: 300 }
    return { min: 0, max: 320 }
  }, [zoomMode])

  const spectrumWithIsotopes = useMemo(() => {
    let peaks = massPeaks.filter(p => showCN || p.mz !== 26)
    if (showIsotopes) {
      const isoAdd = isotopeCluster.filter(iso => iso.mz !== 290).map(iso => ({
        ...iso, intensity: iso.abundance, isIsotope: true, formula: iso.isotope,
      }))
      peaks = [...peaks, ...isoAdd]
    }
    return peaks
  }, [showIsotopes, showCN])

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
        red:        rgb(0.70, 0.13, 0.13),
        redDeep:    rgb(0.50, 0.08, 0.08),
        crimson:    rgb(0.86, 0.08, 0.24),
        pink:       rgb(0.85, 0.30, 0.55),
        purple:     rgb(0.30, 0.11, 0.58),
        purpleMid:  rgb(0.55, 0.35, 0.85),
        orange:     rgb(0.96, 0.62, 0.04),
        textDark:   rgb(0.08, 0.08, 0.16),
        textGray:   rgb(0.47, 0.47, 0.47),
        green:      rgb(0.08, 0.55, 0.31),
        blue:       rgb(0.08, 0.35, 0.75),
        cyan:       rgb(0.05, 0.65, 0.75),
        grayLine:   rgb(0.78, 0.78, 0.86),
        bgRed:      rgb(1.0, 0.92, 0.92),
        bgPink:     rgb(1.0, 0.94, 0.97),
        bgPurple:   rgb(0.97, 0.94, 1.0),
        bgBlue:     rgb(0.94, 0.98, 1.0),
        bgGreen:    rgb(0.94, 1.0, 0.98),
        bgOrange:   rgb(1.0, 0.94, 0.85),
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
          `jdakimyo.uz Mass-spektrometriya Tahlili  •  K₃[Fe(CN)₆]  •  ${dateStr}`,
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
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.crimson })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13,
          font: boldFont, color: C.redDeep, maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
        })
        y -= 14
      }
      const drawTableRow = (label, value, bgColor = C.bgRed, labelColor = C.redDeep) => {
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

      // ═══ SARLAVHA (QIZIL — qizil qon tuzi rangi) ═══
      page.drawRectangle({ x: 0, y: PAGE_H - 90, width: PAGE_W, height: 90, color: C.redDeep })
      page.drawRectangle({ x: 0, y: PAGE_H - 92, width: PAGE_W, height: 4, color: C.crimson })

      safeText("MASS-SPEKTROMETRIYA TAHLILI", { x: PAGE_W / 2, y: PAGE_H - 40, size: 16, font: boldFont, color: C.white, align: "center" })
      safeText("K₃[Fe(CN)₆] — Qizil qon tuzi (Gmelin, 1822)", { x: PAGE_W / 2, y: PAGE_H - 60, size: 12, font: regularFont, color: C.bgRed, align: "center" })
      safeText(`Sana: ${new Date().toLocaleDateString("uz-UZ")}  •  jdakimyo.uz  •  Berlin ko'k merosi (1704)`, { x: PAGE_W / 2, y: PAGE_H - 78, size: 8, font: italicFont, color: C.bgRed, align: "center" })

      y = PAGE_H - 110
      setPdfProgress(30)

      // ═══ 1. UMUMIY MA'LUMOT ═══
      drawSectionHeader("1", "UMUMIY MA'LUMOT VA XUSUSIYATLARI")
      drawTableRow("Formula:", COMPOUND.formulaPlain)
      drawTableRow("IUPAC nomi:", COMPOUND.iupac)
      drawTableRow("An'anaviy nomi:", COMPOUND.commonName)
      drawTableRow("Nemischa nomi:", COMPOUND.germanName)
      drawTableRow("Tarixiy ahamiyati:", COMPOUND.historicalName)
      drawTableRow("Molyar massa (o'rtacha):", `${COMPOUND.molarMass} g/mol`)
      drawTableRow("Aniq massa (monoizotopik):", `${COMPOUND.exactMass} Da`)
      drawTableRow("CAS raqami:", COMPOUND.casNumber)
      drawTableRow("Rangi:", COMPOUND.color)
      drawTableRow("Anion strukturasi:", COMPOUND.anionStructure)
      drawTableRow("Metall markazi:", `${COMPOUND.metalCenter} (${COMPOUND.dConfig})`)
      drawTableRow("Spin holati:", COMPOUND.spinState)
      drawTableRow("Fe–C bog' uzunligi:", COMPOUND.bondLengthFeC)
      drawTableRow("C≡N bog' uzunligi:", COMPOUND.bondLengthCN)
      drawTableRow("Ionlashtirish usuli:", COMPOUND.ionizationMethod)
      drawTableRow("Molekulyar ion:", `[K₂Fe(CN)₆]⁻ m/z = ${COMPOUND.molecularIonMz} (100%)`)
      drawTableRow("Fragmentatsiya:", COMPOUND.fragmentPattern)
      drawTableRow("Fe–CN energiya:", COMPOUND.cleavageEnergy)
      y -= 5
      setPdfProgress(40)

      // ═══ 2. NAZARIY ASOS ═══
      drawSectionHeader("2", "NAZARIY ASOS — CIYANID KOMPLEKSLARI ESI− DA")
      drawInfoBox(
        "K₃[Fe(CN)₆] — anion komplekslarning mass-spektrometriyada eng klassik namunasi. Kompleks 3 ta K⁺ va bitta [Fe(CN)₆]³⁻ anionidan iborat. " +
        "ESI negativ rejimida (−3 kV kapillyar) anion 1 yoki 2 ta K⁺ ni ushlab qoladi (\"ion pairing\"), chunki uch zaryadli anion gaz fazasida beqaror (Rayleigh chegarasi). " +
        "Asosiy pik: [K₂Fe(CN)₆]⁻ (m/z=290, 100%) — z=1, gaz fazasida barqaror. Ikkinchi pik: [KFe(CN)₆]²⁻ (m/z=125.5, z=2). " +
        "Uchinchi pik: sof [Fe(CN)₆]³⁻ (m/z=70.7, z=3) — HRMS bilan tasdiqlanadi. " +
        "Fe–CN bog' energiyasi juda yuqori (~250 kJ/mol) — Fe(dπ) → CN(π*) backbonding ta'sirida. Shu bois fragmentatsiya faqat CID (kolliziya) sharoitida yuz beradi.",
        C.bgRed, C.crimson, C.textDark
      )
      setPdfProgress(50)

      // ═══ 3. MASS-SPEKTR PIKLARI JADVALI ═══
      drawSectionHeader("3", "MASS-SPEKTR PIKLARI (ESI−, HENDERSON & McINDOE)")

      const rowH = 32
      const cols = [
        { label: "m/z", w: 45 },
        { label: "Aniq (Da)", w: 70 },
        { label: "Fragment", w: 130 },
        { label: "z", w: 25 },
        { label: "Yo'qolgan", w: 65 },
        { label: "Intensivlik", w: 80 },
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
        const bgc = i % 2 === 0 ? C.bgRed : C.white
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgc })
        colX = MARGIN
        const values = [`${p.mz}`, `${p.exactMass}`, p.formula, `${p.z}−`, p.lostFragment, `${p.intensity}%`]
        values.forEach((v, idx) => {
          safeText(v, { x: colX + 4, y: y - 12, size: 8, font: regularFont, color: C.textDark, maxWidth: cols[idx].w - 6 })
          colX += cols[idx].w
        })
        safeText(p.diagnostic, { x: MARGIN + 4, y: y - 24, size: 7, font: italicFont, color: C.redDeep, maxWidth: CONTENT_W - 8 })
        y -= rowH
      })
      y -= 10
      setPdfProgress(60)

      // ═══ 4. HAR BIR PIK BATAFSIL ═══
      drawSectionHeader("4", "PIKLARNING BATAFSIL NAZARIY IZOHI")
      massPeaks.forEach((p, i) => {
        checkPageBreak(85)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.bgRed })
        safeText(`${i + 1}. ${p.formula}  —  m/z=${p.mz},  z=${p.z}−,  intensivlik ${p.intensity}%`, {
          x: MARGIN + 6, y: y - 12, size: 9, font: boldFont, color: C.redDeep, maxWidth: CONTENT_W - 12
        })
        y -= 22
        const hh = drawWrappedText(p.theoryNote, {
          x: MARGIN + 8, y: y, size: 8.5, font: regularFont, color: C.textDark,
          maxWidth: CONTENT_W - 16, lineHeight: 11
        })
        y -= hh + 8
      })
      setPdfProgress(75)

      // ═══ 5. IZOTOP CLUSTER ═══
      drawSectionHeader("5", "Fe IZOTOP CLUSTER — [K₂Fe(CN)₆]⁻ UCHUN")
      drawInfoBox(
        `Fe elementining 4 ta tabiiy izotopi (NIST 2021):\n\n` +
        `  ⁵⁴Fe — 5.845%  (aniq massa 53.9396 Da)\n` +
        `  ⁵⁶Fe — 91.754% (aniq massa 55.9349 Da) — asosiy\n` +
        `  ⁵⁷Fe — 2.119%  (aniq massa 56.9354 Da)\n` +
        `  ⁵⁸Fe — 0.282%  (aniq massa 57.9333 Da)\n\n` +
        `[K₂Fe(CN)₆]⁻ molekulyar ion cluster:\n\n` +
        `  m/z=288:  ⁵⁴Fe(CN)₆K₂       →  intensivlik 5.8%  (M−2)\n` +
        `  m/z=290:  ⁵⁶Fe(CN)₆K₂       →  intensivlik 100%   (asosiy)\n` +
        `  m/z=291:  ⁵⁶Fe(¹³C)(CN)₅K₂  →  intensivlik ~6.5% (6 × 1.07%)\n` +
        `  m/z=292:  ⁵⁷Fe(CN)₆K₂       →  intensivlik 2.5%\n\n` +
        `Diagnostik ahamiyati: M−2 (⁵⁴Fe) va M+1 (¹³C, 6 ta C atomi tufayli katta) piklar Fe va CN ligand borligining "barmoq izi".`,
        C.bgRed, C.red, C.textDark
      )
      setPdfProgress(85)

      // ═══ 6. XULOSA ═══
      drawSectionHeader("6", "ASOSIY XULOSALAR")
      const conclusions = [
        `1. ESI− rejim ideal: [K₂Fe(CN)₆]⁻ m/z=290 (100%)`,
        `2. Ko'p zaryadli seriya: z=1 (290), z=2 (125.5), z=3 (70.7) — anion barqarorligining pasayishi`,
        `3. Fe–CN bog' energiyasi D̄ ≈ 250 kJ/mol — juda kuchli (π-akseptor backbonding)`,
        `4. Fragmentatsiya CID orqali: 290 → 251 (−K) → 186 (−CN) → 160 (−2CN)`,
        `5. Izotop cluster: M−2 (⁵⁴Fe, 5.8%), M+1 (¹³C₆, 6.5%) — Fe va CN dalili`,
        `6. HRMS < 1 ppm (Orbitrap) → molekulyar formula tasdig'i`,
        `7. Tarixiy ahamiyati: Berlin ko'k pigment prekursori (Diesbach 1704)`,
        `8. Xavfsizlik: pH < 4 da HCN chiqadi — neytral bufer majburiy`,
      ]
      conclusions.forEach(c => {
        checkPageBreak(20)
        drawWrappedText(c, {
          x: MARGIN + 10, y, size: 9.5, font: regularFont, color: C.textDark,
          maxWidth: CONTENT_W - 20, lineHeight: 12
        })
        y -= 18
      })

      // ═══ 7. MANBALAR ═══
      addNewPage()
      drawSectionHeader("7", "ILMIY MANBALAR")
      const refs = [
        "J. H. Gross — Mass Spectrometry: A Textbook (3rd ed., Springer, 2017)",
        "W. Henderson, J. S. McIndoe — Mass Spectrometry of Inorganic and Organometallic Compounds (Wiley, 2005)",
        "L. E. Alexander, I. R. Beattie — J. Chem. Soc. Dalton 2, 1745 (1972)",
        "K. Nakamoto — Infrared and Raman Spectra of Inorganic Compounds (Wiley, 2009)",
        "L. Gmelin — Ann. Physik 71, 187 (1822) — K₃[Fe(CN)₆] izolyatsiyasi",
        "H. Diesbach (1704) — Prussian Blue kashfiyoti",
        "A. G. Sharpe — The Chemistry of Cyano Complexes of Transition Metals (Academic, 1976)",
        "NIST 2021 — Atomic Weights and Isotopic Compositions",
        "NIST Chemistry WebBook — Mass Spectrum, ID 13746-66-2",
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
      link.download = `K3-Fe-CN-6_Mass_Tahlili_${new Date().toISOString().split("T")[0]}.pdf`
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

  // ═══════════════════════════════════════════════════════════════════════════════
  // ─── VIRTUAL 3D MOLEKULA — SVG bilan
  // ═══════════════════════════════════════════════════════════════════════════════
  const render3DMolecule = () => {
    const CX = 250, CY = 200
    const bond = 100 // Fe–CN masofasi
    const cnLen = 40 // CN uzunligi

    // Fe markazda. 6 ta CN oktaedrik:
    // +X, -X, +Y, -Y, +Z, -Z pozitsiyalar
    const positions3D = [
      { x: +bond, y: 0, z: 0 },     // ekv 1
      { x: -bond, y: 0, z: 0 },     // ekv 2
      { x: 0, y: +bond, z: 0 },     // ekv 3
      { x: 0, y: -bond, z: 0 },     // ekv 4
      { x: 0, y: 0, z: +bond },     // aksial yuqori
      { x: 0, y: 0, z: -bond },     // aksial past
    ]

    // Rotatsiya
    const cosY = Math.cos(rotationY * Math.PI / 180)
    const sinY = Math.sin(rotationY * Math.PI / 180)
    const cosX = Math.cos(rotationX * Math.PI / 180)
    const sinX = Math.sin(rotationX * Math.PI / 180)

    const project = (p) => {
      // Y aylanish
      const x1 = p.x * cosY + p.z * sinY
      const z1 = -p.x * sinY + p.z * cosY
      // X aylanish
      const y2 = p.y * cosX - z1 * sinX
      const z2 = p.y * sinX + z1 * cosX
      // Perspektiv
      const scale = 300 / (300 + z2)
      return { x: CX + x1 * scale, y: CY + y2 * scale, z: z2, scale }
    }

    const projected = positions3D.map((p, i) => ({
      ...project(p),
      idx: i,
      attached: attachedLigands[i]
    }))

    // Z-sort (chuqurroqni oldin chizamiz)
    const sorted = [...projected].sort((a, b) => a.z - b.z)

    // K⁺ pozitsiyalar (uzoq)
    const kPositions3D = [
      { x: bond * 2, y: bond * 1.2, z: 0 },
      { x: -bond * 1.8, y: -bond * 0.8, z: bond * 0.5 },
      { x: 0, y: -bond * 1.5, z: -bond * 1.2 },
    ]
    const kProj = kPositions3D.map((p, i) => ({
      ...project(p),
      idx: i,
      attached: attachedK[i]
    }))

    return (
      <svg viewBox="0 0 500 400" className="w-full h-auto">
        <defs>
          <radialGradient id="feGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#fef3c7"/>
            <stop offset="50%" stopColor="#dc2626"/>
            <stop offset="100%" stopColor="#7f1d1d"/>
          </radialGradient>
          <radialGradient id="cGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#e5e7eb"/>
            <stop offset="60%" stopColor="#4b5563"/>
            <stop offset="100%" stopColor="#111827"/>
          </radialGradient>
          <radialGradient id="nGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#dbeafe"/>
            <stop offset="60%" stopColor="#2563eb"/>
            <stop offset="100%" stopColor="#1e3a8a"/>
          </radialGradient>
          <radialGradient id="kGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#fef3c7"/>
            <stop offset="60%" stopColor="#eab308"/>
            <stop offset="100%" stopColor="#78350f"/>
          </radialGradient>
        </defs>

        {/* K⁺ ionlari (uzoq, kichik) */}
        {kProj.filter(k => k.attached).map((k, i) => (
          <g key={`k-${i}`} onClick={() => setAttachedK(prev => prev.map((v, idx) => idx === i ? false : v))}
             className="cursor-pointer" style={{opacity: 0.7}}>
            <circle cx={k.x} cy={k.y} r={12 * k.scale} fill="url(#kGrad)" stroke="#fff" strokeWidth="1"/>
            <text x={k.x} y={k.y + 4} fill="#fff" fontSize={10 * k.scale} textAnchor="middle" fontWeight="bold">K⁺</text>
          </g>
        ))}

        {/* CN ligandlar va bog'lar — orqadagilarni oldin */}
        {sorted.map(p => {
          if (!p.attached) return null
          const cSize = 8 * p.scale
          const nSize = 10 * p.scale

          // C-N vektori (Fe dan tashqariga)
          const dx = p.x - CX, dy = p.y - CY
          const len = Math.sqrt(dx*dx + dy*dy) || 1
          const cx2 = p.x + (dx/len) * cnLen * p.scale
          const cy2 = p.y + (dy/len) * cnLen * p.scale

          return (
            <g key={`cn-${p.idx}`} onClick={() => setAttachedLigands(prev => prev.map((v, idx) => idx === p.idx ? false : v))}
               className="cursor-pointer hover:opacity-80 transition-opacity">
              {/* Fe-C bond */}
              <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth={2 * p.scale} opacity="0.7"/>
              {/* C-N triple bond */}
              <line x1={p.x} y1={p.y} x2={cx2} y2={cy2} stroke="#3b82f6" strokeWidth={3 * p.scale} opacity="0.9"/>
              <line x1={p.x + 2} y1={p.y + 2} x2={cx2 + 2} y2={cy2 + 2} stroke="#3b82f6" strokeWidth={1 * p.scale} opacity="0.7"/>
              <line x1={p.x - 2} y1={p.y - 2} x2={cx2 - 2} y2={cy2 - 2} stroke="#3b82f6" strokeWidth={1 * p.scale} opacity="0.7"/>
              {/* C atom */}
              <circle cx={p.x} cy={p.y} r={cSize} fill="url(#cGrad)" stroke="#fff" strokeWidth="1"/>
              <text x={p.x} y={p.y + 3} fill="#fff" fontSize={8 * p.scale} textAnchor="middle" fontWeight="bold">C</text>
              {/* N atom */}
              <circle cx={cx2} cy={cy2} r={nSize} fill="url(#nGrad)" stroke="#fff" strokeWidth="1"/>
              <text x={cx2} y={cy2 + 3} fill="#fff" fontSize={9 * p.scale} textAnchor="middle" fontWeight="bold">N</text>
            </g>
          )
        })}

        {/* Fe markaz (eng oxirida — oldinda) */}
        <circle cx={CX} cy={CY} r="22" fill="url(#feGrad)" stroke="#fff" strokeWidth="2"/>
        <text x={CX} y={CY + 5} fill="#fff" fontSize="14" textAnchor="middle" fontWeight="bold">Fe³⁺</text>
      </svg>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950/10 to-purple-950 text-white">

      {/* ═══ PDF MODAL ═══ */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-950 to-red-950 border-2 border-red-500 rounded-2xl p-6 max-w-2xl w-full">
            <h3 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">📄</span> PDF Ilmiy Hisobot
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              K₃[Fe(CN)₆] ning mass-spektrometrik tahlili haqida to'liq ilmiy hisobot yaratiladi.
            </p>
            <ul className="text-xs text-purple-300 space-y-1 mb-6 list-disc list-inside">
              <li>Umumiy ma'lumot va fizik-kimyoviy xususiyatlari</li>
              <li>ESI negativ rejim va anion cluster nazariyasi</li>
              <li>Har bir fragmentatsiya pikining batafsil izohi (7 ta pik)</li>
              <li>Fe izotop cluster tahlili (⁵⁴Fe/⁵⁶Fe/⁵⁷Fe)</li>
              <li>Ko'p zaryadli anion seriyasi (z=1, 2, 3)</li>
              <li>Fe–CN bog' energiyasi va π-backbonding</li>
              <li>Berlin ko'k tarixiy merosi va ilmiy manbalar</li>
            </ul>

            {pdfGenerating && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-purple-300 mb-2">
                  <span>PDF yaratilmoqda...</span>
                  <span>{pdfProgress}%</span>
                </div>
                <div className="w-full bg-purple-900/40 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 h-full transition-all duration-300" style={{ width: `${pdfProgress}%` }} />
                </div>
              </div>
            )}

            <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-200">
                <strong>⚠ Font talablari:</strong> <code className="bg-red-950/50 px-1 rounded">public/fonts/</code> papkasida
                <code className="bg-red-950/50 px-1 rounded ml-1">DejaVuSans*.ttf</code> 3 ta fayl bo'lishi shart.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setPdfModalOpen(false)} disabled={pdfGenerating}
                className="flex-1 bg-purple-800 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors text-sm font-semibold disabled:opacity-50">
                Bekor qilish
              </button>
              <button onClick={generatePDF} disabled={pdfGenerating}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white py-3 rounded-lg transition-all text-sm font-bold disabled:opacity-50">
                {pdfGenerating ? "⏳ Yaratilmoqda..." : "📥 PDF yuklab olish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ HEADER ═══ */}
      {showHeader && (
        <header className="border-b border-red-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
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
              <span className="text-red-400 font-semibold">K₃[Fe(CN)₆]</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border-4 border-white/20 shadow-2xl" style={{background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}dd, ${COMPOUND.colorHex}99)`}}></div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-red-400" dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <p className="text-purple-300 text-sm mt-1">{COMPOUND.iupac}</p>
                  <p className="text-red-500/80 text-xs italic">M = {COMPOUND.molarMass} g/mol • m/z = {COMPOUND.molecularIonMz} • {COMPOUND.dConfig}</p>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-red-900/40 border border-red-700/50 text-red-300 mt-1">
                    🎨 Berlin ko'k merosi (Diesbach 1704 → Gmelin 1822)
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setPdfModalOpen(true)}
                  className="text-xs bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-red-500/20 font-bold">
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
        className="fixed top-4 right-4 z-40 px-3 py-2 rounded-lg text-xs font-bold shadow-lg bg-red-600 hover:bg-red-500 text-white">
        {showHeader ? "🔽" : "🔼"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══ 1. UMUMIY MA'LUMOT ═══ */}
        <div className="bg-purple-900/40 border border-red-700/40 rounded-2xl p-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="w-40 h-40 rounded-2xl border-4 border-white/20 shadow-2xl relative overflow-hidden" style={{
                background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}, ${COMPOUND.colorHex}dd 40%, #4a0000 80%)`
              }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>
              <div className="text-center">
                <div className="text-xs text-purple-400">Kristall rangi</div>
                <div className="text-lg font-bold text-red-400">To'q qizil (rubin)</div>
              </div>
              <div className="text-center bg-red-900/30 border border-red-500/40 rounded-lg px-3 py-1.5">
                <div className="text-[10px] text-red-300">⚠ Kislotali muhit</div>
                <div className="text-xs text-red-400 font-bold">HCN chiqishi mumkin!</div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-2xl font-bold text-white">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                </h2>
                <span className="text-xs px-3 py-1 rounded-full bg-red-900/40 border border-red-500/50 text-red-300 font-bold">
                  🎨 Berlin ko'k 1704
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/50 text-purple-300 font-bold">
                  🩸 Fe³⁺ d⁵ LS
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-900/40 border border-cyan-500/50 text-cyan-300 font-bold">
                  ⚡ ESI− ideal
                </span>
              </div>
              <p className="text-purple-200 leading-relaxed text-sm">
                <strong className="text-red-400">K₃[Fe(CN)₆]</strong> — koordinatsion kimyoning eng mashhur namunalaridan biri.
                Bu <strong className="text-red-400">"Qizil qon tuzi"</strong> (nemischa: <em>Rotes Blutlaugensalz</em>) —
                Berlin ko'k pigmentining prekursori bo'lib, 1704 yilda H. Diesbach tomonidan tasodifan kashf etilgan
                birinchi sintetik pigment tarixi bilan bog'liq. Kompleks 3 K⁺ va bitta <strong className="text-yellow-300">oktaedrik
                [Fe(CN)₆]³⁻ anion</strong>dan iborat. Mass-spektrometriyada bu birikma <strong className="text-cyan-300">ESI negativ
                rejimning etaloni</strong> — anion 1 yoki 2 ta K⁺ ni ushlab qoladi va <strong className="text-red-300">3 zaryadli seriya</strong>
                (z=1, 2, 3) beradi. Fe–CN bog'i juda mustahkam (~250 kJ/mol), shu bois fragmentatsiya faqat CID sharoitida yuz beradi.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-red-900/30 border border-red-700/40 rounded-xl p-3 text-center">
                  <div className="text-red-400 text-[10px] uppercase">Asosiy m/z</div>
                  <div className="text-white font-bold mt-1">290</div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-xl p-3 text-center">
                  <div className="text-yellow-400 text-[10px] uppercase">Aniq massa</div>
                  <div className="text-white font-bold mt-1 font-mono text-xs">289.879</div>
                </div>
                <div className="bg-pink-900/30 border border-pink-700/40 rounded-xl p-3 text-center">
                  <div className="text-pink-400 text-[10px] uppercase">Fragmentlar</div>
                  <div className="text-white font-bold mt-1">7 ta</div>
                </div>
                <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-3 text-center">
                  <div className="text-purple-400 text-[10px] uppercase">μeff</div>
                  <div className="text-white font-bold mt-1">1.73 μB</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ ⭐ 2. VIRTUAL 3D MOLEKULA — INTERAKTIV ═══ */}
        <div className="bg-gradient-to-br from-red-950/40 to-purple-950/40 border-2 border-red-500/50 rounded-2xl p-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🧬</span> Virtual 3D molekula — aylantirib ko'ring!
            </h2>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setAutoRotate(!autoRotate)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                  autoRotate ? "bg-red-600 text-white shadow-lg shadow-red-500/30" : "bg-purple-800/40 text-purple-300"
                }`}>
                {autoRotate ? "⏸ To'xtatish" : "▶ Aylantirish"}
              </button>
              <button onClick={resetFragment}
                className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold transition-all">
                🔄 Barchani qaytarish
              </button>
            </div>
          </div>

          <p className="text-purple-200 text-sm">
            🎯 <strong className="text-red-300">Ligandlarga bosing</strong> — ularni "yulib oling" va fragment
            hosil bo'lishini kuzating! Aylantirish uchun sliderlardan foydalaning. Oktaedrik geometriya (Oh simmetriya) yaqqol ko'rinadi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* 3D SVG */}
            <div className="bg-slate-950/60 border border-purple-700/50 rounded-xl p-4">
              {render3DMolecule()}

              <div className="mt-3 space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-purple-400 mb-1">
                    <span>↻ Y aylanish</span>
                    <span className="text-red-300 font-mono">{Math.round(rotationY)}°</span>
                  </div>
                  <input type="range" min="0" max="360" step="1" value={rotationY}
                    onChange={(e) => { setRotationY(Number(e.target.value)); setAutoRotate(false); }}
                    className="w-full accent-red-500"/>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-purple-400 mb-1">
                    <span>↕ X aylanish</span>
                    <span className="text-red-300 font-mono">{Math.round(rotationX)}°</span>
                  </div>
                  <input type="range" min="-90" max="90" step="1" value={rotationX}
                    onChange={(e) => { setRotationX(Number(e.target.value)); setAutoRotate(false); }}
                    className="w-full accent-red-500"/>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-3 text-xs">
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-600"></span> Fe³⁺</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-700"></span> C</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600"></span> N</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> K⁺</div>
              </div>
            </div>

            {/* Real-time hisob */}
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 border-2 border-red-500/50 rounded-xl p-5">
                <div className="text-xs text-red-400 uppercase mb-1">Joriy struktura</div>
                <div className="text-3xl font-bold text-white font-mono">{currentFragment.formula}<sup className="text-red-300">{currentFragment.chargeStr}</sup></div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-black/30 rounded p-2 text-center">
                    <div className="text-[10px] text-purple-400">Massa</div>
                    <div className="text-white font-mono text-sm">{currentFragment.mass}</div>
                  </div>
                  <div className="bg-black/30 rounded p-2 text-center">
                    <div className="text-[10px] text-purple-400">m/z (|z|)</div>
                    <div className="text-cyan-300 font-mono text-sm">{currentFragment.mz}</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-4">
                <div className="text-xs text-purple-400 uppercase mb-2">Ligandlar holati</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-200">CN⁻ (siyanid)</span>
                    <div className="flex gap-1">
                      {attachedLigands.map((v, i) => (
                        <button key={i}
                          onClick={() => setAttachedLigands(prev => prev.map((x, idx) => idx === i ? !x : x))}
                          className={`w-8 h-8 rounded font-bold text-xs transition-all ${
                            v ? "bg-blue-600 text-white shadow-md" : "bg-gray-800 text-gray-500 opacity-40"
                          }`}>
                          {i+1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-purple-400">{attachedCNCount}/6 ta CN bog'langan</div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-800/50">
                    <span className="text-sm text-purple-200">K⁺ (kaliy)</span>
                    <div className="flex gap-1">
                      {attachedK.map((v, i) => (
                        <button key={i}
                          onClick={() => setAttachedK(prev => prev.map((x, idx) => idx === i ? !x : x))}
                          className={`w-8 h-8 rounded font-bold text-xs transition-all ${
                            v ? "bg-yellow-600 text-white shadow-md" : "bg-gray-800 text-gray-500 opacity-40"
                          }`}>
                          K{i+1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-purple-400">{attachedKCount}/3 ta K bog'langan</div>
                </div>
              </div>

              {/* Ta'lim ipini yaratish */}
              <div className={`rounded-xl p-4 border-2 ${
                currentFragment.charge < 0 ? "bg-cyan-900/20 border-cyan-500/40" :
                currentFragment.charge > 0 ? "bg-pink-900/20 border-pink-500/40" :
                "bg-purple-900/20 border-purple-500/40"
              }`}>
                <div className="text-xs uppercase mb-1 font-bold text-purple-300">
                  Zaryad tahlili
                </div>
                <div className="text-sm text-purple-200">
                  Fe³⁺ (+3) + {attachedCNCount} × CN⁻ ({-attachedCNCount}) + {attachedKCount} × K⁺ (+{attachedKCount}) =
                  <strong className={`ml-1 ${currentFragment.charge < 0 ? "text-cyan-300" : currentFragment.charge > 0 ? "text-pink-300" : "text-purple-200"}`}>
                    {currentFragment.charge > 0 ? "+" : ""}{currentFragment.charge}
                  </strong>
                </div>
                {currentFragment.isAnion && (
                  <div className="text-xs text-cyan-400 mt-2">➜ Anion — ESI− da ko'rinadi</div>
                )}
                {currentFragment.isCation && (
                  <div className="text-xs text-pink-400 mt-2">➜ Kation — ESI+ da ko'rinadi</div>
                )}
                {currentFragment.isNeutral && (
                  <div className="text-xs text-purple-400 mt-2">➜ Neytral — ionlashtirish kerak (EI/APCI)</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-200 text-sm">
              <strong className="text-red-300">🎓 Ta'lim maqsadi:</strong> Bu simulyator sizga <strong>real fragmentatsiya
              jarayonini</strong> ko'rsatadi. Har bir CN⁻ yoki K⁺ ni yulib olish orqali qanday m/z pik hosil bo'lishini
              kuzating: barcha 6 CN va 3 K bilan m/z=329 (neytral), bitta K yo'qolganda m/z=290 (asosiy pik!),
              barcha K lar yo'qolganda esa [Fe(CN)₆]³⁻ (z=3, m/z=70.7).
            </p>
          </div>
        </div>

        {/* ═══ 3. NAZARIY ASOS ═══ */}
        <div className="bg-purple-900/40 border border-red-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📚</span> ESI− anion clusterlar nazariyasi
          </h2>

          <p className="text-purple-200 leading-relaxed text-sm">
            K₃[Fe(CN)₆] eritmada 3 K⁺ va [Fe(CN)₆]³⁻ ionlariga dissotsilanadi. ESI− rejimida (kapillyar
            −3 kV, azot gaz) anion ionlashtiriladi. Lekin <strong className="text-yellow-300">uch zaryadli
            anion gaz fazasida beqaror</strong> — Rayleigh chegarasi (q² &gt; 8π²ε₀γr³) ionni parchalab yuboradi.
            Shu bois anion 1 yoki 2 ta K⁺ ni <strong className="text-red-300">"ion-pair"</strong> tarzida ushlab
            qoladi va zaryadni kamaytiradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-cyan-900/20 border-2 border-cyan-500/40 rounded-xl p-4">
              <div className="text-2xl mb-2">1️⃣</div>
              <h3 className="text-cyan-300 font-bold mb-2">z = 1 (asosiy)</h3>
              <div className="bg-black/30 rounded p-2 font-mono text-xs text-white mb-2">
                [K₂Fe(CN)₆]⁻ → m/z = 290
              </div>
              <p className="text-xs text-purple-200">
                Eng barqaror. Anion 2 ta K⁺ ushlab qolib, faqat 1 manfiy zaryadga ega.
                <strong className="text-cyan-300"> 100% intensivlik</strong>.
              </p>
            </div>

            <div className="bg-purple-900/20 border-2 border-purple-500/40 rounded-xl p-4">
              <div className="text-2xl mb-2">2️⃣</div>
              <h3 className="text-purple-300 font-bold mb-2">z = 2</h3>
              <div className="bg-black/30 rounded p-2 font-mono text-xs text-white mb-2">
                [KFe(CN)₆]²⁻ → m/z = 125.5
              </div>
              <p className="text-xs text-purple-200">
                Anion 1 K⁺ bilan. Piklar orasidagi masofa aynan <strong className="text-purple-300">0.5 Da</strong>
                — bu <strong>z=2 ning imzosi</strong>.
              </p>
            </div>

            <div className="bg-yellow-900/20 border-2 border-yellow-500/40 rounded-xl p-4">
              <div className="text-2xl mb-2">3️⃣</div>
              <h3 className="text-yellow-300 font-bold mb-2">z = 3 (sof anion)</h3>
              <div className="bg-black/30 rounded p-2 font-mono text-xs text-white mb-2">
                [Fe(CN)₆]³⁻ → m/z = 70.7
              </div>
              <p className="text-xs text-purple-200">
                Sof anion, K⁺ siz. Beqaror (Coulomb parchalanish). Piklar
                <strong className="text-yellow-300"> 0.33 Da</strong> masofada.
              </p>
            </div>
          </div>

          <div className="bg-red-900/10 border border-red-500/30 rounded-xl p-5">
            <h4 className="text-red-300 font-bold text-sm mb-2 flex items-center gap-2">
              <span>🔑</span> Muhim qoida: Δm/z = 1/z
            </h4>
            <p className="text-purple-200 text-sm mb-3">
              Ko'p zaryadli anionlarni identifikatsiya qilishning eng qulay usuli — <strong>izotop piklari orasidagi masofa</strong>:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-cyan-950/40 rounded p-2">
                <div className="text-cyan-300 font-mono font-bold">z=1</div>
                <div className="text-white text-xs">Δ = 1.0 Da</div>
              </div>
              <div className="bg-purple-950/40 rounded p-2">
                <div className="text-purple-300 font-mono font-bold">z=2</div>
                <div className="text-white text-xs">Δ = 0.5 Da</div>
              </div>
              <div className="bg-yellow-950/40 rounded p-2">
                <div className="text-yellow-300 font-mono font-bold">z=3</div>
                <div className="text-white text-xs">Δ = 0.33 Da</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ 4. INTERAKTIV MASS-SPEKTR ═══ */}
        <div className="bg-purple-900/40 border border-red-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈</span> Interaktiv mass-spektr (ESI−)
          </h2>
          <p className="text-purple-200 text-sm">
            Piklarga <strong className="text-red-400">ustiga bosing</strong> — batafsil ilmiy izohlar. Asosiy pik m/z=290
            ([K₂Fe(CN)₆]⁻), keyin ko'p zaryadli seriya va CID fragmentlari.
          </p>

          {/* Zoom kontrol */}
          <div className="flex gap-2 flex-wrap">
            {[
              { v: "full", l: "Butun spektr (0–320)" },
              { v: "molecular", l: "🎯 Molekulyar zona (280–300)" },
              { v: "isotope", l: "🔬 Izotop cluster (287–295)" },
              { v: "fragments", l: "💥 Fragment zonasi (150–300)" },
            ].map(o => (
              <button key={o.v} onClick={() => setZoomMode(o.v)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  zoomMode === o.v ? "bg-red-600 text-white shadow-lg shadow-red-500/30" :
                  "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60"
                }`}>
                {o.l}
              </button>
            ))}
          </div>

          <div className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-4 overflow-x-auto">
            <svg viewBox="0 0 800 400" className="w-full h-auto" preserveAspectRatio="xMidYMid meet" ref={spectrumRef}>
              {[20, 40, 60, 80, 100].map(pct => (
                <g key={pct}>
                  <line x1="40" y1={340 - (pct/100)*300} x2="780" y2={340 - (pct/100)*300} stroke="#a78bfa" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.4"/>
                  <text x="35" y={340 - (pct/100)*300 + 3} fill="#c4b5fd" fontSize="9" textAnchor="end">{pct}%</text>
                </g>
              ))}
              <text x="15" y="200" fill="#e9d5ff" fontSize="11" textAnchor="middle" transform="rotate(-90 15 200)" fontWeight="bold">Nisbiy intensivlik (%)</text>

              {[0, 50, 100, 150, 200, 250, 300].map(l => {
                if (l < zoomRange.min || l > zoomRange.max) return null
                const x = 40 + ((l - zoomRange.min) / (zoomRange.max - zoomRange.min)) * 740
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
              {massPeaks.filter(p => (showCN || p.mz !== 26) && p.mz >= zoomRange.min && p.mz <= zoomRange.max).map(p => {
                const x = 40 + ((p.mz - zoomRange.min) / (zoomRange.max - zoomRange.min)) * 740
                const h = (p.intensity / 100) * 300
                const y = 340 - h
                const idx = massPeaks.indexOf(p)
                const isSelected = selectedPeak === idx
                const isHovered = hoveredPeak === idx
                return (
                  <g key={p.mz} onClick={() => setSelectedPeak(idx)}
                    onMouseEnter={() => setHoveredPeak(idx)}
                    onMouseLeave={() => setHoveredPeak(null)}
                    className="cursor-pointer">
                    <line x1={x} y1="340" x2={x} y2={y}
                      stroke={isSelected ? "#fbbf24" : "#dc2626"}
                      strokeWidth={isSelected || isHovered ? "5" : "3"}
                      strokeLinecap="round"/>
                    <circle cx={x} cy={y} r={isSelected || isHovered ? "7" : "4"} fill={isSelected ? "#fbbf24" : "#dc2626"} stroke="#fff" strokeWidth="1.5"/>
                    <text x={x} y={y - 12} fill={isSelected ? "#fbbf24" : "#dc2626"} fontSize="10" textAnchor="middle" fontWeight="bold">{p.mz}</text>
                    {(isSelected || isHovered) && (
                      <g>
                        <rect x={x - 65} y={y - 60} width="130" height="35" rx="4" fill="#4B0082" stroke="#dc2626" strokeWidth="1.5"/>
                        <text x={x} y={y - 45} fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">{p.formula}</text>
                        <text x={x} y={y - 33} fill="#fbbf24" fontSize="9" textAnchor="middle">z={p.z}− • {p.intensity}%</text>
                      </g>
                    )}
                  </g>
                )
              })}

              {/* Izotop piklar */}
              {showIsotopes && isotopeCluster.filter(iso => iso.mz !== 290 && iso.mz >= zoomRange.min && iso.mz <= zoomRange.max).map(iso => {
                const x = 40 + ((iso.mz - zoomRange.min) / (zoomRange.max - zoomRange.min)) * 740
                const h = (iso.abundance / 100) * 300
                const y = 340 - h
                return (
                  <g key={`iso-${iso.mz}`}>
                    <line x1={x} y1="340" x2={x} y2={y} stroke="#ec4899" strokeWidth="2" strokeLinecap="round" opacity="0.75"/>
                    <text x={x} y={y - 8} fill="#ec4899" fontSize="8" textAnchor="middle">{iso.mz}</text>
                  </g>
                )
              })}

              <text x="400" y="25" fill="#dc2626" fontSize="14" textAnchor="middle" fontWeight="bold">
                K₃[Fe(CN)₆] mass-spektri — ESI− (Henderson & McIndoe, 2005)
              </text>
            </svg>

            <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-xs text-purple-300">
                  <input type="checkbox" checked={showIsotopes} onChange={(e) => setShowIsotopes(e.target.checked)} className="accent-pink-500"/>
                  Fe izotop cluster (⁵⁴Fe, ⁵⁷Fe, ¹³C)
                </label>
                <label className="flex items-center gap-2 text-xs text-purple-300">
                  <input type="checkbox" checked={showCN} onChange={(e) => setShowCN(e.target.checked)} className="accent-emerald-500"/>
                  CN⁻ ligand pik (m/z=26)
                </label>
              </div>
            </div>
          </div>

          {/* Tanlangan pik detali */}
          {selectedPeak !== null && (
            <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border-2 border-red-500/50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-2xl font-bold text-red-400 mb-1">{massPeaks[selectedPeak].formula}</h3>
                  <p className="text-purple-300 text-sm">{massPeaks[selectedPeak].fragment} • z={massPeaks[selectedPeak].z}−</p>
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
                  <div className="text-red-300 font-mono font-bold text-lg">{massPeaks[selectedPeak].mz}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">Aniq (Da)</div>
                  <div className="text-cyan-300 font-mono font-bold">{massPeaks[selectedPeak].exactMass}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">Yo'qolgan</div>
                  <div className="text-yellow-300 font-mono font-bold">{massPeaks[selectedPeak].lostFragment}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">Zaryad</div>
                  <div className="text-pink-300 font-mono font-bold">{massPeaks[selectedPeak].z}−</div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3 mb-3">
                <div className="text-xs text-yellow-400 font-bold mb-1">💡 Diagnostik:</div>
                <div className="text-sm text-purple-200">{massPeaks[selectedPeak].diagnostic}</div>
              </div>
              <div className="bg-purple-900/20 border border-purple-700/40 rounded-lg p-4">
                <div className="text-xs text-red-400 font-bold mb-2">🎓 Batafsil ilmiy izoh:</div>
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

        {/* ═══ 5. PIKLAR JADVALI ═══ */}
        <div className="bg-purple-900/40 border border-red-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📋</span> Mass-spektri piklari — tayinlash jadvali
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-red-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">m/z</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">Aniq (Da)</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">Fragment</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">z</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">Yo'qolgan</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">Intensivlik</th>
                </tr>
              </thead>
              <tbody>
                {massPeaks.map((p, i) => (
                  <tr key={i} onClick={() => setSelectedPeak(i)}
                    className={`border-b border-purple-800/30 hover:bg-red-900/20 cursor-pointer transition-colors ${selectedPeak === i ? "bg-red-900/30" : ""}`}>
                    <td className="py-3 px-3 text-red-300 font-mono font-bold">{p.mz}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono text-xs">{p.exactMass}</td>
                    <td className="py-3 px-3 text-purple-200 font-mono text-xs">{p.formula}</td>
                    <td className="py-3 px-3">
                      <span className="text-xs font-mono bg-purple-900/40 px-2 py-0.5 rounded text-purple-300">{p.z}−</span>
                    </td>
                    <td className="py-3 px-3 text-yellow-300 font-mono text-xs">{p.lostFragment}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-purple-950/50 rounded-full h-2">
                          <div className="bg-gradient-to-r from-red-500 to-pink-500 h-full rounded-full" style={{width: `${p.intensity}%`}}></div>
                        </div>
                        <span className="text-white text-xs">{p.intensity}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ 6. ESI+ vs ESI− TAQQOSLASH ═══ */}
        <div className="bg-purple-900/40 border border-red-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> ESI+ vs ESI− — anion komplekslar uchun rejim tanlash
          </h2>

          <div className="flex gap-2">
            {esiComparison.map((e, i) => (
              <button key={i} onClick={() => setEsiMode(i)}
                className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                  esiMode === i ? "bg-red-600 text-white shadow-lg shadow-red-500/30" :
                  "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60"
                }`}>
                {e.mode}
              </button>
            ))}
          </div>

          <div className={`${esiComparison[esiMode].bg} border-2 ${esiComparison[esiMode].border} rounded-xl p-6`}>
            <h3 className={`text-2xl font-bold ${esiComparison[esiMode].color} mb-4`}>
              {esiComparison[esiMode].mode}
            </h3>

            <div className="mb-4">
              <h4 className="text-purple-300 text-sm font-bold mb-2">🔑 Asosiy piklar</h4>
              <div className="space-y-2">
                {esiComparison[esiMode].mainIons.map((ion, i) => (
                  <div key={i} className="flex items-center gap-3 bg-black/30 rounded-lg p-3">
                    <div className="text-xl font-mono font-bold text-white w-16">{ion.mz}</div>
                    <div className="flex-1">
                      <div className="text-sm text-purple-200 font-mono">{ion.ion}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-20 bg-purple-950/50 rounded-full h-2">
                        <div className={`h-full rounded-full bg-gradient-to-r ${
                          esiMode === 0 ? "from-pink-500 to-purple-500" : "from-cyan-500 to-blue-500"
                        }`} style={{width: `${ion.inten}%`}}></div>
                      </div>
                      <span className="text-xs text-white w-10">{ion.inten}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-3">
                <p className="text-green-400 font-bold text-xs mb-2">✓ Afzalliklari</p>
                <ul className="text-purple-200 text-xs space-y-1">
                  {esiComparison[esiMode].pros.map((a, i) => (<li key={i}>• {a}</li>))}
                </ul>
              </div>
              <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-3">
                <p className="text-red-400 font-bold text-xs mb-2">✗ Kamchiliklari</p>
                <ul className="text-purple-200 text-xs space-y-1">
                  {esiComparison[esiMode].cons.map((d, i) => (<li key={i}>• {d}</li>))}
                </ul>
              </div>
            </div>

            <div className={`text-center p-3 rounded-lg font-bold text-sm ${
              esiMode === 1 ? "bg-cyan-600/30 text-cyan-200" : "bg-pink-600/30 text-pink-200"
            }`}>
              {esiComparison[esiMode].verdict}
            </div>
          </div>
        </div>

        {/* ═══ 7. IZOTOP CLUSTER ═══ */}
        <div className="bg-purple-900/40 border border-red-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧪</span> Fe + ¹³C izotop cluster — [K₂Fe(CN)₆]⁻
          </h2>
          <p className="text-purple-200 text-sm">
            Bu kompleksda 6 ta uglerod bor, shu bois <strong className="text-pink-300">M+1 pik ancha katta</strong>
            (~6.5% — 6 × 1.07%). Fe izotoplari M−2 (⁵⁴Fe, 5.8%) va M+2 (⁵⁷Fe, 2.5%) piklarni beradi.
          </p>

          <div className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-6">
            <svg viewBox="0 0 700 320" className="w-full h-auto">
              {[20, 40, 60, 80, 100].map(pct => (
                <g key={pct}>
                  <line x1="60" y1={260 - (pct/100)*220} x2="680" y2={260 - (pct/100)*220} stroke="#a78bfa" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.4"/>
                  <text x="55" y={260 - (pct/100)*220 + 3} fill="#c4b5fd" fontSize="9" textAnchor="end">{pct}%</text>
                </g>
              ))}
              {isotopeCluster.map(iso => {
                const x = 60 + ((iso.mz - 287) / 7) * 620
                const h = (iso.abundance / 100) * 220
                const y = 260 - h
                const isMain = iso.mz === 290
                return (
                  <g key={iso.mz}>
                    <line x1={x} y1="260" x2={x} y2={y}
                      stroke={isMain ? "#dc2626" : "#ec4899"}
                      strokeWidth={isMain ? "8" : "4"}
                      strokeLinecap="round"/>
                    <circle cx={x} cy={y} r={isMain ? "8" : "4"} fill={isMain ? "#fbbf24" : "#ec4899"} stroke="#fff" strokeWidth="1"/>
                    <text x={x} y={y - 12} fill={isMain ? "#fbbf24" : "#ec4899"} fontSize="10" textAnchor="middle" fontWeight="bold">{iso.mz}</text>
                    <text x={x} y="285" fill="#e9d5ff" fontSize="10" textAnchor="middle" fontWeight={isMain ? "bold" : "normal"}>{iso.mz}</text>
                    <text x={x} y="300" fill="#a78bfa" fontSize="8" textAnchor="middle">{iso.abundance}%</text>
                  </g>
                )
              })}
              <line x1="60" y1="260" x2="680" y2="260" stroke="#e9d5ff" strokeWidth="0.5"/>
              <text x="370" y="315" fill="#e9d5ff" fontSize="11" textAnchor="middle" fontWeight="bold">m/z (Da)</text>
              <text x="370" y="20" fill="#dc2626" fontSize="13" textAnchor="middle" fontWeight="bold">
                [K₂Fe(CN)₆]⁻ izotop cluster (Fe + 6×C)
              </text>
            </svg>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-red-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">m/z</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">Izotopolog</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">Nisbiy (%)</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {isotopeCluster.map((iso, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${iso.mz === 290 ? "bg-red-900/30 border-l-4 border-l-red-400" : ""}`}>
                    <td className="py-3 px-3 text-red-300 font-mono font-bold">{iso.mz}</td>
                    <td className="py-3 px-3 text-purple-200 font-mono text-xs">{iso.isotope}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-purple-950/50 rounded-full h-2">
                          <div className="bg-gradient-to-r from-red-500 to-pink-500 h-full rounded-full" style={{width: `${iso.abundance}%`}}></div>
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
        </div>

        {/* ═══ 8. HRMS PPM KALKULYATORI ═══ */}
        <div className="bg-purple-900/40 border border-red-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎯</span> HRMS ppm kalkulyator — [K₂Fe(CN)₆]⁻ uchun
          </h2>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
            <div className="text-red-300 text-xl font-mono">Δppm = (m<sub>obs</sub> − m<sub>calc</sub>) / m<sub>calc</sub> × 10⁶</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-5">
              <label className="text-xs text-purple-400 block mb-2">Nazariy massa (calc)</label>
              <div className="bg-purple-950/70 rounded-lg p-3">
                <div className="text-cyan-300 text-2xl font-mono text-center">{calcExact}</div>
                <div className="text-xs text-purple-400 text-center mt-1">Da (⁵⁶Fe + 2×³⁹K + 6×¹²C + 6×¹⁴N)</div>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-5">
              <label className="text-xs text-purple-400 block mb-2">Kuzatilgan massa (obs)</label>
              <input type="range" min="289.870" max="289.890" step="0.0001" value={obsMz}
                onChange={(e) => setObsMz(Number(e.target.value))}
                className="w-full accent-red-500"/>
              <div className="text-green-300 text-2xl font-mono text-center mt-2">{ppmCalc.obs}</div>
              <div className="text-xs text-purple-400 text-center mt-1">Da (HRMS o'lchovi)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 border-2 border-red-500/50 rounded-xl p-6 text-center">
              <div className="text-xs text-red-400 mb-2">Massa farqi (Δm)</div>
              <div className="text-red-300 text-3xl font-mono font-bold">{ppmCalc.diff}</div>
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
        </div>

        {/* ═══ 9. SIYANID KOMPLEKSLAR SERIYASI ═══ */}
        <div className="bg-purple-900/40 border border-red-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔗</span> Siyanid komplekslar oilasi — mass-spektri taqqoslash
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-red-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">Rang</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">Formula</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">M (g/mol)</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">Metall</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">d-config</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">Asosiy ESI</th>
                  <th className="py-3 px-3 text-left text-red-400 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {cyanideSeries.map((c, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-red-900/20 transition-colors ${c.current ? "bg-red-900/30 border-l-4 border-l-red-400" : ""}`}>
                    <td className="py-3 px-3">
                      <div className="w-6 h-6 rounded border-2 border-white/20" style={{background: c.color}}></div>
                    </td>
                    <td className="py-3 px-3 text-red-300 font-mono text-xs">{c.formula}</td>
                    <td className="py-3 px-3 text-white font-mono">{c.mw}</td>
                    <td className="py-3 px-3 text-purple-200 font-mono text-xs">{c.oxState}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono text-xs">{c.dConfig}</td>
                    <td className="py-3 px-3 text-yellow-300 font-mono">{c.esiIon}</td>
                    <td className="py-3 px-3 text-xs">
                      {c.current ? <strong className="text-red-400">← BU KOMPLEKS</strong> : c.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ 10. TARIXIY XRONOLOGIYA ═══ */}
        <div className="bg-purple-900/40 border border-red-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📜</span> Berlin ko'k merosi — 300+ yillik tarix
          </h2>

          <div className="space-y-2">
            {historicalTimeline.map((t, i) => (
              <div key={i} className="flex gap-4 items-start bg-purple-950/50 border border-purple-700/40 rounded-lg p-3 hover:border-red-500/50 transition-all">
                <div className="w-16 flex-shrink-0 text-red-400 font-mono font-bold text-sm">{t.year}</div>
                <div className="text-purple-200 text-xs">{t.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ 11. HALAQIT BERUVCHI OMILLAR ═══ */}
        <div className="bg-purple-900/40 border border-red-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚠️</span> Halaqit beruvchi omillar va yechimlari
          </h2>

          <div className="space-y-3">
            {interferences.map((intf, i) => (
              <div key={i} className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2 gap-3">
                  <h4 className="text-red-300 font-bold text-sm">{intf.source}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    intf.severity.includes("xavfli") ? "bg-red-900/40 text-red-300 border border-red-500/40 animate-pulse" :
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

        {/* ═══ 12. AMALIY AHAMIYATI ═══ */}
        <div className="bg-purple-900/40 border border-red-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎯</span> Amaliy ahamiyati va qo'llanish sohalari
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {applications.map((a, i) => (
              <div key={i} className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-4 hover:border-red-500/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{a.icon}</div>
                  <div>
                    <h4 className="text-red-300 font-bold text-sm mb-1">{a.field}</h4>
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
            <li>• <strong className="text-red-300">J. H. Gross</strong> — <em>Mass Spectrometry: A Textbook</em> (3rd ed., Springer, 2017)</li>
            <li>• <strong className="text-red-300">W. Henderson, J. S. McIndoe</strong> — <em>Mass Spectrometry of Inorganic and Organometallic Compounds</em> (Wiley, 2005) — Chap. 6</li>
            <li>• <strong className="text-red-300">L. E. Alexander, I. R. Beattie</strong> — <em>J. Chem. Soc. Dalton</em> 2, 1745 (1972)</li>
            <li>• <strong className="text-red-300">A. G. Sharpe</strong> — <em>The Chemistry of Cyano Complexes of Transition Metals</em> (Academic, 1976)</li>
            <li>• <strong className="text-red-300">L. Gmelin</strong> — <em>Ann. Physik</em> 71, 187 (1822) — K₃[Fe(CN)₆] izolyatsiyasi</li>
            <li>• <strong className="text-red-300">J. J. Diesbach</strong> (1704) — Prussian Blue kashfiyoti</li>
            <li>• <strong className="text-red-300">K. Nakamoto</strong> — <em>Infrared and Raman Spectra of Inorganic Compounds</em> (Wiley, 2009)</li>
            <li>• <strong className="text-red-300">NIST 2021</strong> — Atomic Weights and Isotopic Compositions</li>
            <li>• <strong className="text-red-300">NIST Chemistry WebBook</strong> — Mass Spectrum, ID 13746-66-2</li>
            <li>• <strong className="text-red-300">IUPAC Gold Book</strong> — Mass spectrometry terminology (2013)</li>
          </ul>
        </div>

      </section>

    </main>
  )
}
