"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(en)₃]Cl₃ — IQ SPEKTROSKOPIYA (PREMIUM ILMIY + PDF EKSPORT)
// Manbalar: Nakamoto K. — Infrared and Raman Spectra (6-nashr, B qism, III-2 bo'lim),
//           Cotton F.A. — Chemical Applications of Group Theory,
//           Werner A. (1911, optik ajratish — Nobel 1913),
//           Corey E.J. & Bailar J.C. (1959) — lel/ob konformatsiya nazariyasi,
//           Schwarzenbach G. (1952) — xelat effekti termodinamikasi
// XUSUSIYAT: Xelat ligand (en), D₃ simmetriya, Δ/Λ optik izomerlar,
//            Xelat effekti, lel/ob konformerlar, ν(Co-N) YUQORI (570 cm⁻¹)
// Til: 100% o'zbek (lotin)
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(en)<sub>3</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Co(en)3]Cl3",
  iupac: "Tris(etilendiamin)kobalt(III) xlorid",
  commonName: "Tris-etilendiamin kompleks",
  ligandFull: "en = etilendiamin (H₂N–CH₂–CH₂–NH₂)",
  molarMass: 345.55,
  casNumber: "13408-73-6 (rasemat)",
  casDelta: "16195-51-2 (Δ-(+))",
  casLambda: "16195-52-3 (Λ-(−))",
  color: "to'q sariq — apelsin rang kristall",
  pointGroup: "D₃ (xiral!)",
  groupOrder: 6,
  operations: "E, 2C₃, 3C₂",
  inversionCenter: "YO'Q — xiral molekula",
  crystalSystem: "Trigonal (rasemat: monoklinik)",
  spaceGroup: "P3̄c1 (rasemat) / P2₁2₁2₁ (sof enantiomer)",
  electrolyteType: "1:3 elektrolit — 4 ion",
  molarConductivity: "~400 S·cm²/mol (1:3 uchun 340–420)",
  coordNumber: 6,
  denticity: "3 × bidentat (xelat) = 6 donor atom",
  chelateRings: "3 ta beshhalqali (5-membered) xelat halqa",
  bondCoN: "1.964 Å",
  biteAngle: "N–Co–N (xelat) = 85.4° (ideal 90° dan kichik)",
  deltaOh: "23 200 cm⁻¹ (NH₃ dan yuqori!)",
  logBeta3: "48.7 (log β₃)",
  opticalRotation: "[α]D = ±(105–108)° (suv, 25°C)",
}

// ─── IQ cho'qqilari — xelat ligandga xos to'liq to'plam
const irPeaks = [
  {
    freq: 3230, T: 14, absorbance: 0.86,
    assignment: "νₐₛ(N–H)", assignment_uz: "NH₂ asimmetrik cho'zilish",
    intensity: "Juda kuchli", intensityCode: 4,
    bond: "N–H (NH₂)", symmetry: "A₂ + E (D₃) — IQ faol",
    forceConstant: "6.15 mdyn/Å", bondLength: "1.014 Å",
    region: "X–H cho'zilish sohasi",
    freeLigand: "Erkin en: 3352 cm⁻¹ (νₐₛ NH₂)",
    coordShift: "−122 cm⁻¹ (koordinatsiya)",
    theoryNote: "Etilendiaminning NH₂ guruhidagi asimmetrik N–H cho'zilishi. MUHIM FARQ: ammin komplekslarda (NH₃) 3 ta H bor va polosa kengroq, bu yerda NH₂ da faqat 2 ta H — polosa aniqroq va o'tkirroq. D₃ simmetriyada A₂ (z bo'ylab) va E (xy) modalari IQ faol, A₁ esa faqat Ramanda.",
    diagnostic: "NH₂ (amin) vs NH₃ (ammin) farqi",
  },
  {
    freq: 3120, T: 24, absorbance: 0.76,
    assignment: "νₛ(N–H)", assignment_uz: "NH₂ simmetrik cho'zilish",
    intensity: "Kuchli", intensityCode: 3,
    bond: "N–H (NH₂)", symmetry: "A₁ (Raman) + E (IQ)",
    forceConstant: "6.02 mdyn/Å", bondLength: "1.014 Å",
    region: "X–H cho'zilish sohasi",
    freeLigand: "Erkin en: 3280 cm⁻¹ (νₛ NH₂)",
    coordShift: "−160 cm⁻¹",
    theoryNote: "NH₂ simmetrik cho'zilishi. D₃ da inversiya markazi YO'Q → mutual exclusion ishlamaydi, A₁ va E modalari IQ+Raman ikkalasida ham faol bo'lishi mumkin (A₁ IQ da zaif). Koordinatsiyada N atomining elektron jufti Co ga berilishi N–H ni zaiflashtiradi.",
    diagnostic: "🔬 D₃ da mutual exclusion yo'q",
  },
  {
    freq: 2960, T: 52, absorbance: 0.48,
    assignment: "νₐₛ(C–H)", assignment_uz: "CH₂ asimmetrik cho'zilish",
    intensity: "O'rta", intensityCode: 2,
    bond: "C–H (CH₂)", symmetry: "A₂ + E",
    forceConstant: "4.85 mdyn/Å", bondLength: "1.092 Å",
    region: "Alifatik C–H sohasi",
    freeLigand: "Erkin en: 2930 cm⁻¹",
    coordShift: "+30 cm⁻¹ (halqa taranglashuvi)",
    theoryNote: "🏆 ORGANIK LIGAND BELGISI! Ammin komplekslarda (NH₃) C–H polosalari YO'Q. Etilendiamindagi –CH₂–CH₂– ko'prigining mavjudligini bevosita isbotlaydi. Koordinatsiyada xelat halqa hosil bo'lishi C–H bog'ini biroz taranglashtiradi.",
    diagnostic: "🏆 XELAT LIGAND (organik) mavjudligining isboti",
  },
  {
    freq: 2890, T: 58, absorbance: 0.42,
    assignment: "νₛ(C–H)", assignment_uz: "CH₂ simmetrik cho'zilish",
    intensity: "O'rta", intensityCode: 2,
    bond: "C–H (CH₂)", symmetry: "A₁ + E",
    forceConstant: "4.78 mdyn/Å", bondLength: "1.092 Å",
    region: "Alifatik C–H sohasi",
    freeLigand: "Erkin en: 2860 cm⁻¹",
    coordShift: "+30 cm⁻¹",
    theoryNote: "CH₂ simmetrik cho'zilishi. 2960 va 2890 cm⁻¹ juftligi — tipik –CH₂–CH₂– signali. Aromatik C–H (>3000) dan pastroq, chunki sp³ gibridlangan.",
    diagnostic: "Alifatik CH₂ juftlik signali",
  },
  {
    freq: 1602, T: 40, absorbance: 0.60,
    assignment: "δ(NH₂) scissor", assignment_uz: "NH₂ qaychili egilish",
    intensity: "Kuchli", intensityCode: 3,
    bond: "H–N–H", symmetry: "A₁ + A₂ + E",
    forceConstant: "0.68 mdyn·Å/rad²", bondLength: "—",
    region: "Egilish tebranishlar",
    freeLigand: "Erkin en: 1600 cm⁻¹",
    coordShift: "Deyarli o'zgarmagan (+2 cm⁻¹)",
    theoryNote: "NH₂ guruhining qaychili (scissoring) egilishi. NH₃ komplekslaridagi δₐₛ(HNH) ≈ 1618 cm⁻¹ ga yaqin, lekin biroz pastroq — NH₂ da faqat 2 ta H bo'lgani uchun. Koordinatsiya H–N–H burchagiga (~107°) deyarli ta'sir qilmaydi.",
    diagnostic: "Amin guruh diagnostikasi",
  },
  {
    freq: 1462, T: 62, absorbance: 0.38,
    assignment: "δ(CH₂) scissor", assignment_uz: "CH₂ qaychili egilish",
    intensity: "O'rta-zaif", intensityCode: 2,
    bond: "H–C–H", symmetry: "A₁ + E",
    forceConstant: "0.55 mdyn·Å/rad²", bondLength: "—",
    region: "CH₂ deformatsiya",
    freeLigand: "Erkin en: 1455 cm⁻¹",
    coordShift: "+7 cm⁻¹",
    theoryNote: "CH₂ guruhining qaychili egilishi — barcha alifatik birikmalarda 1470–1450 cm⁻¹ da xarakterli. Bu polosa mavjudligi organik lignad borligini tasdiqlaydi (NH₃ komplekslarida YO'Q).",
    diagnostic: "🏆 Organik ligand tasdig'i",
  },
  {
    freq: 1368, T: 66, absorbance: 0.34,
    assignment: "ω(CH₂) wag", assignment_uz: "CH₂ silkinish (wagging)",
    intensity: "O'rta-zaif", intensityCode: 2,
    bond: "CH₂", symmetry: "A₂ + E",
    forceConstant: "0.42 mdyn·Å/rad²", bondLength: "—",
    region: "CH₂ deformatsiya",
    freeLigand: "Erkin en: 1350 cm⁻¹",
    coordShift: "+18 cm⁻¹ (halqa qattiqlashishi)",
    theoryNote: "CH₂ guruhining tekislikdan chiqish silkinishi. Xelat halqa hosil bo'lganda –CH₂–CH₂– ko'prigining erkin aylanishi cheklanadi va chastota ko'tariladi. Bu xelatlanishning nozik diagnostik belgisi.",
    diagnostic: "🎯 Xelat halqa qattiqlashishining belgisi",
  },
  {
    freq: 1282, T: 70, absorbance: 0.30,
    assignment: "τ(CH₂) twist", assignment_uz: "CH₂ buralish (twisting)",
    intensity: "Zaif", intensityCode: 1,
    bond: "CH₂", symmetry: "A₂ + E",
    forceConstant: "0.38 mdyn·Å/rad²", bondLength: "—",
    region: "CH₂ deformatsiya",
    freeLigand: "Erkin en: 1270 cm⁻¹",
    coordShift: "+12 cm⁻¹",
    theoryNote: "CH₂ guruhining buralish tebranishi. lel/ob konformerlarda bu polosa biroz siljiydi — konformatsion tahlil uchun foydali. lel₃ konformerda ~1285, ob₃ da ~1275 cm⁻¹.",
    diagnostic: "Konformatsiya sezgir polosa",
  },
  {
    freq: 1155, T: 55, absorbance: 0.45,
    assignment: "ρ(NH₂) rock", assignment_uz: "NH₂ chayqalish (rocking)",
    intensity: "O'rta", intensityCode: 2,
    bond: "NH₂", symmetry: "A₂ + E",
    forceConstant: "0.44 mdyn·Å/rad²", bondLength: "—",
    region: "Amin rocking",
    freeLigand: "Erkin en: 1095 cm⁻¹",
    coordShift: "+60 cm⁻¹ (koordinatsiya)",
    theoryNote: "NH₂ guruhining butun holda chayqalishi. Koordinatsiya natijasida N atomining harakat erkinligi cheklanadi va chastota sezilarli ko'tariladi (+60 cm⁻¹). Bu ammin komplekslardagi ρ(NH₃) ≈ 830 cm⁻¹ dan ancha yuqori.",
    diagnostic: "🔥 Koordinatsiyaning diagnostik ko'rsatkichi",
  },
  {
    freq: 1052, T: 48, absorbance: 0.52,
    assignment: "ν(C–N)", assignment_uz: "C–N cho'zilish",
    intensity: "O'rta-kuchli", intensityCode: 3,
    bond: "C–N", symmetry: "A₁ + E",
    forceConstant: "5.10 mdyn/Å", bondLength: "1.485 Å",
    region: "Barmoq izi sohasi",
    freeLigand: "Erkin en: 1085 cm⁻¹",
    coordShift: "−33 cm⁻¹",
    theoryNote: "🏆 XELAT LIGANDNING SKELET TEBRANISHI! C–N bog'ining cho'zilishi. Koordinatsiyada N ning elektron jufti Co ga berilib, C–N bog'i biroz zaiflashadi (chastota pasayadi). Ammin komplekslarda bu polosa MUTLAQO YO'Q — chunki ularda uglerod yo'q.",
    diagnostic: "🏆 Etilendiamin skeletining isboti",
  },
  {
    freq: 1005, T: 58, absorbance: 0.42,
    assignment: "ν(C–C)", assignment_uz: "C–C cho'zilish",
    intensity: "O'rta", intensityCode: 2,
    bond: "C–C", symmetry: "A₁ + E",
    forceConstant: "4.50 mdyn/Å", bondLength: "1.512 Å",
    region: "Barmoq izi sohasi",
    freeLigand: "Erkin en: 1015 cm⁻¹",
    coordShift: "−10 cm⁻¹",
    theoryNote: "Etilendiamindagi C–C bog'ining cho'zilishi. Xelat halqa hosil bo'lishi bu bog'ga kam ta'sir qiladi (−10 cm⁻¹), chunki C–C to'g'ridan-to'g'ri metallga bog'lanmagan. Konformatsion holat (gauche vs anti) chastotani ta'sirlantiradi.",
    diagnostic: "C–C skelet, konformatsiya sezgir",
  },
  {
    freq: 888, T: 64, absorbance: 0.36,
    assignment: "ρ(CH₂) rock", assignment_uz: "CH₂ chayqalish",
    intensity: "O'rta-zaif", intensityCode: 2,
    bond: "CH₂", symmetry: "A₂ + E",
    forceConstant: "0.35 mdyn·Å/rad²", bondLength: "—",
    region: "CH₂ rocking",
    freeLigand: "Erkin en: 860 cm⁻¹",
    coordShift: "+28 cm⁻¹",
    theoryNote: "CH₂ guruhining chayqalish tebranishi. Xelat halqa hosil bo'lishi bilan chastota ko'tariladi. Bu polosa lel/ob konformerlarni ajratishda ham foydali.",
    diagnostic: "Xelat halqa qattiqlashuvi",
  },
  {
    freq: 690, T: 72, absorbance: 0.28,
    assignment: "δ(NH₂) wag", assignment_uz: "NH₂ silkinish (out-of-plane)",
    intensity: "Zaif", intensityCode: 1,
    bond: "NH₂", symmetry: "A₂ + E",
    forceConstant: "0.30 mdyn·Å/rad²", bondLength: "—",
    region: "Amin deformatsiya",
    freeLigand: "Erkin en: 780 cm⁻¹ (keng)",
    coordShift: "−90 cm⁻¹",
    theoryNote: "NH₂ guruhining tekislikdan chiqish silkinishi. Erkin aminlarda bu polosa juda keng (H-bog'lanish tufayli), koordinatsiyada esa aniqroq va pastroq chastotaga siljiydi.",
    diagnostic: "Koordinatsiya belgisi",
  },
  {
    freq: 572, T: 30, absorbance: 0.70,
    assignment: "νₐₛ(Co–N)", assignment_uz: "Co–N asimmetrik cho'zilish",
    intensity: "Juda kuchli", intensityCode: 4,
    bond: "Co–N", symmetry: "A₂ + E (D₃) — IQ faol",
    forceConstant: "2.15 mdyn/Å", bondLength: "1.964 Å",
    region: "Metall–ligand cho'zilish",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote: "🏆 XELAT EFFEKTINING IQ ISBOTI! [Co(NH₃)₆]³⁺ da ν(Co–N) = 503 cm⁻¹, bu yerda esa 572 cm⁻¹ — +69 cm⁻¹ YUQORI. Sababi: (a) xelat halqa Co–N bog'ini mustahkamlaydi (k = 2.15 vs 1.85 mdyn/Å); (b) beshhalqali xelat halqa geometrik jihatdan optimal; (c) en NH₃ dan kuchliroq σ-donor. Bu xelat effektining bevosita spektroskopik dalilidir.",
    diagnostic: "🏆 XELAT EFFEKTI — ν(Co-N) NH₃ dan +69 cm⁻¹ yuqori",
  },
  {
    freq: 505, T: 42, absorbance: 0.58,
    assignment: "νₛ(Co–N)", assignment_uz: "Co–N simmetrik cho'zilish",
    intensity: "Kuchli", intensityCode: 3,
    bond: "Co–N", symmetry: "A₁ (Raman) + E (IQ)",
    forceConstant: "2.02 mdyn/Å", bondLength: "1.964 Å",
    region: "Metall–ligand cho'zilish",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote: "Co–N simmetrik cho'zilishi. D₃ da A₁ modasi Raman-faol (IQ da zaif), E modasi IQ+Raman faol. Ikki polosa (572, 505) xelat halqalarning ekvivalent bo'lmagan tebranishlarini aks ettiradi.",
    diagnostic: "D₃ simmetriya belgisi",
  },
  {
    freq: 408, T: 68, absorbance: 0.32,
    assignment: "δ(N–Co–N) xelat", assignment_uz: "Xelat halqa deformatsiyasi",
    intensity: "O'rta-zaif", intensityCode: 2,
    bond: "N–Co–N (bite)", symmetry: "A₁ + A₂ + 2E",
    forceConstant: "0.48 mdyn·Å/rad²", bondLength: "—",
    region: "Xelat halqa tebranishi",
    freeLigand: "—",
    coordShift: "Faqat xelat komplekslarda",
    theoryNote: "🏆 XELAT HALQA DEFORMATSIYASI! Beshhalqali Co–N–C–C–N halqaning butun holda deformatsion tebranishi. Monodentat ligandli komplekslarda (NH₃) bu moda MUTLAQO YO'Q. N–Co–N «bite angle» = 85.4° (ideal 90° dan kichik) — xelat halqaning geometrik cheklovi.",
    diagnostic: "🏆 XELAT HALQANING bevosita isboti",
  },
  {
    freq: 285, T: 78, absorbance: 0.22,
    assignment: "δ(halqa) torsion", assignment_uz: "Xelat halqa buralishi",
    intensity: "Zaif", intensityCode: 1,
    bond: "Xelat halqa", symmetry: "A₂ + E",
    forceConstant: "0.25 mdyn·Å/rad²", bondLength: "—",
    region: "Uzoq IQ (far-IR)",
    freeLigand: "—",
    coordShift: "Faqat xelat komplekslarda",
    theoryNote: "Xelat halqaning torsion (buralish) tebranishi. Bu moda lel ↔ ob konformatsion o'tishlar bilan bevosita bog'liq. Past haroratda (77 K) polosa keskinlashadi va konformerlar ajraladi.",
    diagnostic: "🎯 lel/ob konformatsion tahlil uchun",
  },
]

// ─── en vs NH₃ taqqoslash (xelat effekti)
const enVsNH3 = [
  { param: "Ligand turi", en: "Bidentat (xelat)", nh3: "Monodentat", winner: "en" },
  { param: "Donor atomlar soni", en: "2 ta N (bitta ligandda)", nh3: "1 ta N", winner: "en" },
  { param: "Ligandlar soni", en: "3 ta", nh3: "6 ta", winner: "—" },
  { param: "Nuqtaviy guruh", en: "D₃ (xiral)", nh3: "Oₕ (axiral)", winner: "—" },
  { param: "ν(Co–N) IQ", en: "572, 505 cm⁻¹", nh3: "503, 448 cm⁻¹", winner: "en" },
  { param: "k(Co–N)", en: "2.15 mdyn/Å", nh3: "1.85 mdyn/Å", winner: "en" },
  { param: "Δₒ (10Dq)", en: "23 200 cm⁻¹", nh3: "22 900 cm⁻¹", winner: "en" },
  { param: "log β (umumiy)", en: "48.7 (β₃)", nh3: "35.2 (β₆)", winner: "en" },
  { param: "ΔG° (kJ/mol)", en: "−278", nh3: "−201", winner: "en" },
  { param: "ΔH° (kJ/mol)", en: "−193", nh3: "−188", winner: "≈" },
  { param: "ΔS° (J/mol·K)", en: "+285 (musbat!)", nh3: "+44", winner: "en" },
  { param: "Optik faollik", en: "MAVJUD (Δ/Λ)", nh3: "YO'Q", winner: "en" },
  { param: "C–H polosalari", en: "2960, 2890 cm⁻¹", nh3: "YO'Q", winner: "—" },
  { param: "ν(C–N), ν(C–C)", en: "1052, 1005 cm⁻¹", nh3: "YO'Q", winner: "—" },
  { param: "Xelat halqa modasi", en: "408, 285 cm⁻¹", nh3: "YO'Q", winner: "—" },
]

// ─── Optik izomerlar (Δ va Λ)
const opticalIsomers = [
  {
    name: "Δ (delta) — o'ng vintli",
    symbol: "Δ",
    rotation: "[α]D = +105° ... +108°",
    cd: "CD: 490 nm da musbat Cotton effekti",
    descriptor: "C₃ o'qi bo'ylab qaralganda xelat halqalar SOAT YO'NALISHIDA",
    color: "text-cyan-400",
    bgColor: "bg-cyan-900/30",
    borderColor: "border-cyan-500/50",
    irNote: "IQ spektri Λ bilan AYNAN BIR XIL — IQ enantiomerlarni ajrata olmaydi",
    resolution: "d-tartrat yoki (+)-bromkamfor sulfonat bilan ajratiladi",
  },
  {
    name: "Λ (lambda) — chap vintli",
    symbol: "Λ",
    rotation: "[α]D = −105° ... −108°",
    cd: "CD: 490 nm da manfiy Cotton effekti",
    descriptor: "C₃ o'qi bo'ylab qaralganda xelat halqalar SOATGA QARSHI",
    color: "text-rose-400",
    bgColor: "bg-rose-900/30",
    borderColor: "border-rose-500/50",
    irNote: "IQ spektri Δ bilan AYNAN BIR XIL — IQ enantiomerlarni ajrata olmaydi",
    resolution: "l-tartrat yoki (−)-bromkamfor sulfonat bilan ajratiladi",
  },
]

// ─── lel/ob konformerlar
const conformers = [
  { name: "lel₃", desc: "3 ta halqa C–C o'qi C₃ o'qiga PARALLEL", energy: "0 kJ/mol (eng barqaror)", population: "~45%", irShift: "τ(CH₂) 1285 cm⁻¹", note: "lel = «parallel» (nemis. parallel)" },
  { name: "lel₂ob", desc: "2 ta lel + 1 ta ob", energy: "+1.2 kJ/mol", population: "~35%", irShift: "τ(CH₂) 1282 cm⁻¹", note: "Aralash konformer" },
  { name: "lelob₂", desc: "1 ta lel + 2 ta ob", energy: "+2.5 kJ/mol", population: "~15%", irShift: "τ(CH₂) 1279 cm⁻¹", note: "Aralash konformer" },
  { name: "ob₃", desc: "3 ta halqa C–C o'qi C₃ ga QIYA", energy: "+3.8 kJ/mol", population: "~5%", irShift: "τ(CH₂) 1275 cm⁻¹", note: "ob = «oblique» (qiya)" },
]

// ─── Xelat effekti termodinamikasi
const chelateEffect = [
  { reaction: "[Co(H₂O)₆]³⁺ + 6NH₃ → [Co(NH₃)₆]³⁺", logK: 35.2, dG: -201, dH: -188, dS: +44, type: "Monodentat" },
  { reaction: "[Co(H₂O)₆]³⁺ + 3en → [Co(en)₃]³⁺", logK: 48.7, dG: -278, dH: -193, dS: +285, type: "Xelat (bidentat)" },
  { reaction: "Farq (xelat effekti)", logK: "+13.5", dG: "−77", dH: "−5", dS: "+241", type: "🏆 ENTROPIYA hisobiga!" },
]

// ─── D₃ guruh nazariyasi
const groupTheoryD3 = {
  pointGroup: "D₃",
  order: 6,
  operations: "E, 2C₃, 3C₂",
  inversion: "YO'Q → molekula XIRAL",
  irreps: [
    { symbol: "A₁", degeneracy: 1, ir: "Noaktiv", raman: "Faol", basis: "x²+y², z²", note: "Totalno simmetrik" },
    { symbol: "A₂", degeneracy: 1, ir: "Faol (z)", raman: "Faol (Rz)", basis: "z, Rz", note: "C₃ o'qi bo'ylab" },
    { symbol: "E", degeneracy: 2, ir: "Faol (x,y)", raman: "Faol", basis: "(x,y), (Rx,Ry)", note: "2-karra taqsimlangan" },
  ],
  totalModes: "3N − 6 = 3(43) − 6 = 123 ta normal moda",
  skeletonModes: "Γ(CoN₆) = 2A₁ + 2A₂ + 4E",
  irActive: "A₂ + E (A₁ noaktiv)",
  ramanActive: "A₁ + A₂ + E (barchasi)",
  mutualExclusion: "ISHLAMAYDI — inversiya markazi yo'q",
}

// ─── Werner qatori (xelat bilan)
const wernerSeries = [
  { formula: "[Co(NH₃)₆]Cl₃", ligand: "6 × NH₃ (monodentat)", sym: "Oₕ", nuCoN: "503, 448", chiral: "Yo'q", agCl: 3, current: false },
  { formula: "[Co(NH₃)₅Cl]Cl₂", ligand: "5 NH₃ + 1 Cl", sym: "C₄ᵥ", nuCoN: "498, 475", chiral: "Yo'q", agCl: 2, current: false },
  { formula: "cis-[Co(NH₃)₄Cl₂]Cl", ligand: "4 NH₃ + 2 Cl", sym: "C₂ᵥ", nuCoN: "500, 475", chiral: "Yo'q (meso)", agCl: 1, current: false },
  { formula: "[Co(en)₃]Cl₃", ligand: "3 × en (bidentat)", sym: "D₃", nuCoN: "572, 505", chiral: "🏆 HA (Δ/Λ)", agCl: 3, current: true },
  { formula: "cis-[Co(en)₂Cl₂]Cl", ligand: "2 en + 2 Cl", sym: "C₂", nuCoN: "570, 550", chiral: "HA (Δ/Λ)", agCl: 1, current: false },
]

// ─── Kuch konstantasi taqqoslash
const forceConstantExamples = [
  { bond: "N–H (en, koordinatsion)", k: 6.15, freq: 3230, note: "NH₂ guruh" },
  { bond: "C–H (CH₂)", k: 4.85, freq: 2960, note: "🏆 Faqat organik ligandda" },
  { bond: "C–N (en)", k: 5.10, freq: 1052, note: "🏆 Xelat skeleti" },
  { bond: "C–C (en)", k: 4.50, freq: 1005, note: "Etilen ko'prigi" },
  { bond: "Co–N (en, bu kompleks)", k: 2.15, freq: 572, note: "🏆 XELAT — eng mustahkam" },
  { bond: "Co–N (NH₃, luteo)", k: 1.85, freq: 503, note: "Monodentat" },
  { bond: "Co–N (NH₃, purpureo)", k: 1.82, freq: 498, note: "Monodentat" },
  { bond: "Ni–N (en)", k: 1.65, freq: 480, note: "Ni(II) xelat" },
  { bond: "Cr–N (en)", k: 1.95, freq: 545, note: "Cr(III) xelat" },
]

// ─── Namuna tayyorlash
const techniques = [
  {
    name: "KBr tabletka (standart)",
    description: "Klassik usul. Bu kompleks uchun 4000–400 cm⁻¹ soha yetarli, chunki asosiy diagnostik polosalar (ν(Co-N) 572, 505) bu sohada.",
    advantages: ["🏆 ν(Co-N) 572/505 cm⁻¹ ko'rinadi", "Barcha organik polosalar aniq", "Standart va arzon", "Kvantitativ tahlil"],
    disadvantages: ["Xelat halqa torsioni (285) ko'rinmaydi", "KBr gigroskopik", "Suv polosalari NH₂ ni qoplashi mumkin", "10-15 daq tayyorlash"],
    bestFor: "🔑 Bu kompleks uchun ASOSIY usul",
    freqRange: "4000–400 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "10–15 daq"
  },
  {
    name: "CsI tabletka (uzoq IQ)",
    description: "285 cm⁻¹ dagi xelat halqa torsionini ko'rish uchun. Konformatsion tahlil uchun zarur.",
    advantages: ["200 cm⁻¹ gacha shaffof", "Xelat halqa torsioni (285) ko'rinadi", "lel/ob konformatsion tahlil", "To'liq skelet tebranishlar"],
    disadvantages: ["Qimmat (5× KBr)", "Yanada gigroskopik", "Kam laboratoriyalarda", "Ehtiyot bilan tayyorlash"],
    bestFor: "Konformatsion (lel/ob) tahlil",
    freqRange: "4000–200 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "10–15 daq"
  },
  {
    name: "Nujol mull",
    description: "🚫 Bu kompleks uchun TAVSIYA ETILMAYDI — Nujol C–H polosalari (2920, 2850) etilendiaminning CH₂ polosalarini (2960, 2890) to'liq qoplaydi!",
    advantages: ["Gigroskopik namunalar", "Ion almashinuvi yo'q", "Tez tayyorlash", "Namuna buzilmaydi"],
    disadvantages: ["🚫 Nujol C-H (2920, 2850) en ning CH₂ (2960, 2890) ni QOPLAYDI", "🚫 δ(CH₂) 1462 va Nujol 1460 ustma-ust", "Organik ligand tahlili imkonsiz", "Kvantitativ chekli"],
    bestFor: "❌ Bu kompleks uchun yaramaydi",
    freqRange: "4000–400 (C-H bekilgan)", resolution: "4 cm⁻¹", samplePrep: "5–10 daq"
  },
  {
    name: "ATR (olmos kristal)",
    description: "Tez skrining uchun juda qulay. ν(Co-N) 572 cm⁻¹ hali ham ko'rinadi (650 chegara ostida emas).",
    advantages: ["Tez (30 s)", "Namuna butun saqlanadi", "Organik polosalar a'lo", "Rang ko'rinadi (sariq)"],
    disadvantages: ["650 cm⁻¹ dan pastda zaiflashadi", "ν(Co-N) 505 kuchsiz ko'rinadi", "Xelat torsioni (285) YO'Q", "Cho'qqi biroz siljigan"],
    bestFor: "Tez identifikatsiya, organik qism tahlili",
    freqRange: "4000–650 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "30 s"
  },
]

// ─── Halaqit omillari
const interferences = [
  { source: "Nujol moyi (agar ishlatilsa)", freqRange: "2920, 2850, 1460, 1375", effect: "🚫 en ning CH₂ polosalarini (2960, 2890, 1462) TO'LIQ qoplaydi — organik ligand tahlili imkonsiz", severity: "Yuqori", solution: "🔑 FAQAT KBr yoki CsI tabletka ishlating. Nujol bu kompleks uchun mutlaqo yaramaydi." },
  { source: "Suv bug'i (H₂O)", freqRange: "3800–3500, 1640", effect: "Keng polosalar NH₂ cho'zilish (3230, 3120) va δ(NH₂) 1602 sohalarini buzadi", severity: "Yuqori", solution: "N₂ purge (10 daq). KBr ni 110°C da 2 soat quritish. Namunani P₂O₅ ustida saqlash." },
  { source: "Erkin en (aralashma)", freqRange: "3352, 3280, 1095", effect: "Reaksiya to'liq bo'lmasa erkin etilendiamin qoladi — qo'shimcha polosalar", severity: "Yuqori", solution: "Rekristallizatsiya (suv/etanol). Element tahlil (C 20.9%, H 7.0%, N 24.3%) bilan tekshirish." },
  { source: "Rasemizatsiya (Δ ⇌ Λ)", freqRange: "IQ da ko'rinmaydi", effect: "Optik faol namuna vaqt o'tishi bilan rasemik aralashmaga aylanadi — IQ o'zgarmaydi, lekin CD yo'qoladi", severity: "O'rta", solution: "IQ bunga sezgir emas. Optik sofligini CD/ORD bilan tekshiring. Sovuqda saqlang." },
  { source: "CO₂ (atmosfera)", freqRange: "2350, 667", effect: "667 cm⁻¹ δ(NH₂) wag (690) yaqinida", severity: "O'rta", solution: "N₂ purge, CO₂ scrubber, avtomatik atmosfera kompensatsiya." },
  { source: "Konformatsion aralashma", freqRange: "1275–1285, 285", effect: "lel₃/lel₂ob/lelob₂/ob₃ konformerlari bir vaqtda — polosalar kengayadi", severity: "Past", solution: "Past haroratda (77 K, suyuq N₂) o'lchash — konformerlar ajraladi va polosalar keskinlashadi." },
  { source: "Kristall panjara (site symmetry)", freqRange: "M-L soha", effect: "P3̄c1 panjarada D₃ simmetriya C₃ ga pasayishi mumkin — qo'shimcha polosalar", severity: "Past", solution: "Suyultirilgan namuna (KBr 1:2000) yoki eritma spektri (D₂O da)." },
  { source: "Anion almashinuvi (Cl⁻/Br⁻)", freqRange: "Panjara sohasi", effect: "KBr bilan tashqi sfera Cl⁻ qisman Br⁻ ga almashishi mumkin (panjara polosalari o'zgaradi)", severity: "Past", solution: "Bu kompleksda Cl⁻ TASHQI sferada — koordinatsion tebranishlarga ta'sir qilmaydi. Muhim emas." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CoEn3Cl3_IQ() {
  const [showHeader, setShowHeader] = useState(true)
  const [freqSlider, setFreqSlider] = useState(572)
  const [activePeak, setActivePeak] = useState(0)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeIsomer, setActiveIsomer] = useState(0)
  const [activeConformer, setActiveConformer] = useState(0)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)

  const [pdfSections, setPdfSections] = useState({
    identification: true,
    theory: true,
    chelateEffect: true,
    peaks: true,
    spectrum: true,
    groupTheory: true,
    optical: true,
    conformers: true,
    comparison: true,
    forceConstant: true,
    werner: true,
    techniques: true,
    interferences: true,
    conclusions: true,
  })

  const currentPeak = useMemo(() => {
    let closest = irPeaks[0]
    let minDiff = Math.abs(freqSlider - irPeaks[0].freq)
    for (let i = 1; i < irPeaks.length; i++) {
      const diff = Math.abs(freqSlider - irPeaks[i].freq)
      if (diff < minDiff) { minDiff = diff; closest = irPeaks[i] }
    }
    return closest
  }, [freqSlider])

  const cleanText = (str) => {
    if (str === null || str === undefined) return ""
    return String(str)
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/\s+/g, " ").trim()
  }

  const generatePDF = async () => {
    setPdfGenerating(true)
    try {
      const { PDFDocument, rgb } = await import("pdf-lib")
      const fontkit = (await import("@pdf-lib/fontkit")).default

      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)

      let regularFont, boldFont, italicFont
      try {
        const regularBytes = await fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer() })
        const boldBytes = await fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer() })
        const italicBytes = await fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer() })
        regularFont = await pdfDoc.embedFont(regularBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(boldBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(italicBytes, { subset: true })
      } catch {
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari bo'lishi kerak.")
        setPdfGenerating(false)
        return
      }

      const C = {
        purple: rgb(0.30, 0.11, 0.58), purpleLight: rgb(0.86, 0.78, 1.0),
        purpleMid: rgb(0.65, 0.55, 0.98), purpleSoft: rgb(0.51, 0.39, 0.71),
        purpleDark: rgb(0.12, 0.11, 0.29),
        amber: rgb(0.85, 0.55, 0.10),
        amberDeep: rgb(0.65, 0.40, 0.02),
        cyan: rgb(0.10, 0.55, 0.65),
        cyanDeep: rgb(0.05, 0.40, 0.50),
        rose: rgb(0.75, 0.25, 0.40),
        roseDeep: rgb(0.58, 0.15, 0.30),
        textDark: rgb(0.08, 0.08, 0.16), textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0), orangeDeep: rgb(0.71, 0.39, 0),
        green: rgb(0.08, 0.47, 0.31), greenDark: rgb(0.12, 0.47, 0.27),
        blue: rgb(0.08, 0.31, 0.55), grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgAmber: rgb(1.0, 0.98, 0.90),
        bgCyan: rgb(0.92, 0.99, 1.0), bgRose: rgb(1.0, 0.95, 0.96),
        bgOrange: rgb(1.0, 0.97, 0.94), bgBlue: rgb(0.94, 0.98, 1.0),
        bgGreen: rgb(0.94, 1.0, 0.98), bgRed: rgb(1.0, 0.95, 0.95),
        bgYellow: rgb(1.0, 0.98, 0.92), bgAbstract: rgb(0.99, 0.97, 0.93),
        white: rgb(1, 1, 1), red: rgb(0.80, 0.20, 0.20),
      }

      const PAGE_W = 595.28, PAGE_H = 841.89
      const MARGIN = 50, CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30, HEADER_H = 65

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
        const lines = []; let current = ""
        for (const word of words) {
          const test = current ? current + " " + word : word
          if (measure(test, font, size) > maxWidth && current) { lines.push(current); current = word }
          else current = test
          if (measure(current, font, size) > maxWidth) {
            let piece = ""
            for (const ch of current) {
              if (measure(piece + ch, font, size) > maxWidth) { lines.push(piece); piece = ch } else piece += ch
            }
            current = piece
          }
        }
        if (current) lines.push(current)
        return lines
      }
      const safeText = (text, opts) => {
        const { x, y: ty, size = 10, font = regularFont, color = C.textDark, align = "left", maxWidth = null } = opts
        const s = cleanText(text)
        const limit = maxWidth ?? (PAGE_W - MARGIN - x)
        const finalText = truncate(s, font, size, limit)
        let fx = x; const w = measure(finalText, font, size)
        if (align === "center") fx = x - w / 2
        else if (align === "right") fx = x - w
        page.drawText(finalText, { x: fx, y: ty, size, font, color })
      }
      const drawCenteredText = (text, cy, size, font, color, maxW = CONTENT_W) => {
        const lines = wrapText(cleanText(text), font, size, maxW)
        lines.forEach((line, i) => {
          const w = measure(line, font, size)
          page.drawText(line, { x: (PAGE_W - w) / 2, y: cy - i * (size + 3), size, font, color })
        })
        return lines.length * (size + 3)
      }
      const drawWrappedText = (text, opts) => {
        const { x, y: sy, size = 9.5, font = regularFont, color = C.textDark, maxWidth, lineHeight = null } = opts
        const lines = wrapText(cleanText(text), font, size, maxWidth)
        const lh = lineHeight ?? size + 3
        lines.forEach((line, i) => page.drawText(line, { x, y: sy - i * lh, size, font, color }))
        return lines.length * lh
      }
      const addFooter = () => {
        const leftText = truncate(
          `JDA-Kimyo IQ Tahlili  •  [Co(en)₃]Cl₃ (Tris-etilendiamin)  •  ${new Date().toLocaleDateString("uz-UZ")}`,
          regularFont, 8, CONTENT_W - 30
        )
        page.drawText(leftText, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        const pageStr = `${pageNum}`
        const w = measure(pageStr, regularFont, 8)
        page.drawText(pageStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 }, end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine,
        })
      }
      const addNewPage = () => { addFooter(); page = pdfDoc.addPage([PAGE_W, PAGE_H]); pageNum++; y = PAGE_H - MARGIN }
      const checkPageBreak = (need) => { if (y - need < FOOTER_Y + 25) addNewPage() }

      const drawSectionHeader = (num, title) => {
        checkPageBreak(45)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.amber })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13, font: boldFont, color: C.amberDeep, maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
        })
        y -= 14
      }
      const drawTableRow = (label, value, bgColor = C.bgAmber, labelColor = C.amberDeep) => {
        const rowH = 20, labelW = 200
        const valueX = MARGIN + labelW + 6, valueMaxW = CONTENT_W - labelW - 12
        checkPageBreak(rowH + 2)
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor })
        safeText(label, { x: MARGIN + 6, y: y - 13, size: 9, font: boldFont, color: labelColor, maxWidth: labelW - 8 })
        const valStr = cleanText(value)
        const finalVal = truncate(valStr, regularFont, 9, valueMaxW)
        page.drawText(finalVal, { x: valueX, y: y - 13, size: 9, font: regularFont, color: C.textDark })
        y -= rowH
      }
      const drawInfoBox = (text, bgColor, borderColor, textColor) => {
        const padding = 10, maxW = CONTENT_W - 2 * padding
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

      // ═══ HEADER ═══
      page.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.purpleDark })
      safeText("JDA-KIMYO ILMIY BYULLETENI  •  IQ Spektroskopiya  •  Vol. 2, Son 5", {
        x: MARGIN, y: PAGE_H - 25, size: 9, font: regularFont, color: C.purpleLight, maxWidth: CONTENT_W * 0.65,
      })
      safeText(`Chop etilgan: ${new Date().toLocaleDateString("uz-UZ")}`, {
        x: PAGE_W - MARGIN, y: PAGE_H - 25, size: 9,
        font: regularFont, color: C.purpleLight, align: "right", maxWidth: CONTENT_W * 0.3,
      })
      page.drawLine({
        start: { x: MARGIN, y: PAGE_H - 37 }, end: { x: PAGE_W - MARGIN, y: PAGE_H - 37 },
        thickness: 1, color: C.purpleMid,
      })
      safeText("Xelat Effekti, D₃ Simmetriya va Δ/Λ Optik Izomeriya", {
        x: MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86), maxWidth: CONTENT_W * 0.65,
      })
      safeText("DOI: 10.0000/jda-kimyo.iq.2026.004", {
        x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8,
        font: regularFont, color: rgb(0.71, 0.71, 0.86), align: "right", maxWidth: CONTENT_W * 0.3,
      })
      y = PAGE_H - HEADER_H - 30

      drawCenteredText(`[Co(en)₃]Cl₃ — IQ Spektroskopik Tahlili`, y, 20, boldFont, C.textDark)
      y -= 28
      drawCenteredText("Tris(etilendiamin)kobalt(III) xlorid  •  en = H₂N–CH₂–CH₂–NH₂", y, 12, italicFont, C.amberDeep)
      y -= 20
      drawCenteredText(
        `D₃ simmetriya (xiral)  •  3 × bidentat xelat  •  Δ/Λ enantiomerlar  •  M = 345.55 g/mol`,
        y, 9, regularFont, C.textMuted
      )
      y -= 28

      // ═══ ANNOTATSIYA ═══
      const abstract =
        `Tris(etilendiamin)kobalt(III) xlorid [Co(en)₃]Cl₃ xelat komplekslarning va koordinatsion kimyodagi ` +
        `optik izomeriyaning klassik namunasidir. Uchta bidentat etilendiamin (en) ligandi Co³⁺ ioni atrofida ` +
        `uchta beshhalqali xelat halqa hosil qiladi. Molekula D₃ nuqtaviy guruhga tegishli va XIRAL — ` +
        `Δ (o'ng vintli) va Λ (chap vintli) enantiomerlari mavjud. IQ spektrida xelat effektining bevosita ` +
        `isboti ko'rinadi: ν(Co–N) = 572 cm⁻¹, bu [Co(NH₃)₆]³⁺ dagi 503 cm⁻¹ dan +69 cm⁻¹ YUQORI (k = 2.15 vs ` +
        `1.85 mdyn/Å). Organik ligandning mavjudligi ν(C–H) 2960/2890, ν(C–N) 1052, ν(C–C) 1005 cm⁻¹ polosalari ` +
        `bilan tasdiqlanadi — bu polosalar ammin komplekslarda YO'Q. Xelat halqa deformatsiyasi 408 cm⁻¹ da va ` +
        `torsion 285 cm⁻¹ da kuzatiladi. MUHIM: IQ spektroskopiya Δ va Λ enantiomerlarni AJRATA OLMAYDI — ` +
        `ularning IQ spektrlari aynan bir xil; buning uchun CD/ORD spektroskopiya zarur. Xelat effekti ` +
        `termodinamik jihatdan ENTROPIYA hisobiga (ΔS = +285 J/mol·K) yuzaga keladi.`

      const absPadding = 12, absInnerW = CONTENT_W - 2 * absPadding
      const absLines = wrapText(cleanText(abstract), regularFont, 9.5, absInnerW)
      const boxH = 24 + absLines.length * 13 + 8
      checkPageBreak(boxH + 20)
      page.drawRectangle({
        x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
        color: C.bgAbstract, borderColor: C.amber, borderWidth: 1,
      })
      safeText("QISQACHA XULOSA (ANNOTATSIYA)", {
        x: MARGIN + absPadding, y: y - 16, size: 10, font: boldFont, color: C.amberDeep, maxWidth: absInnerW,
      })
      absLines.forEach((line, i) => {
        page.drawText(line, {
          x: MARGIN + absPadding, y: y - 32 - i * 13,
          size: 9.5, font: regularFont, color: C.textDark,
        })
      })
      y -= boxH + 22

      let sectionNum = 1

      // ═══ 1. IDENTIFIKATSIYA ═══
      if (pdfSections.identification) {
        drawSectionHeader(sectionNum++, "Birikma Identifikatsiyasi")
        const idData = [
          ["Formula", "[Co(en)₃]Cl₃"],
          ["IUPAC nomi", "Tris(etilendiamin)kobalt(III) xlorid"],
          ["Ligand", "en = etilendiamin (H₂N–CH₂–CH₂–NH₂)"],
          ["CAS (rasemat)", "13408-73-6"],
          ["CAS (Δ-(+))", "16195-51-2"],
          ["CAS (Λ-(−))", "16195-52-3"],
          ["Molar massa", "345.55 g/mol"],
          ["Rangi", "To'q sariq — apelsin kristall"],
          ["Nuqtaviy guruh", "D₃ (6-tartib) — XIRAL"],
          ["Simmetriya operatsiyalari", "E, 2C₃, 3C₂"],
          ["Inversiya markazi", "YO'Q → optik faol"],
          ["Koordinatsion son", "6 (3 × bidentat)"],
          ["Xelat halqalar", "3 ta beshhalqali (Co–N–C–C–N)"],
          ["Co–N bog' uzunligi", "1.964 Å"],
          ["Bite angle (N–Co–N)", "85.4° (ideal 90° dan kichik)"],
          ["Δₒ (10Dq)", "23 200 cm⁻¹ (NH₃ dan yuqori)"],
          ["log β₃", "48.7"],
          ["Optik aylanish", "[α]D = ±(105–108)°"],
          ["Elektrolit turi", "1:3 (4 ion)"],
          ["Molyar o'tkazuvchanlik", "~400 S·cm²/mol"],
        ]
        idData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgAmber : C.white, C.amberDeep)
        })
        y -= 15
      }

      // ═══ 2. NAZARIY ASOS ═══
      if (pdfSections.theory) {
        drawSectionHeader(sectionNum++, "Nazariy Asos: Xelat Ligandlar va D₃ Simmetriya")

        const t1 = "Etilendiamin (en) — BIDENTAT ligand: bitta molekulada ikkita donor N atomi mavjud. Metallga bog'langanda beshhalqali (5-membered) xelat halqa hosil qiladi: Co–N–C–C–N. Uchta en ligandi oktaedrik koordinatsion sferani to'liq to'ldiradi va molekulani XIRAL qiladi — inversiya markazi va simmetriya tekisligi yo'q."
        drawWrappedText(t1, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(t1, regularFont, 9.5, CONTENT_W).length * 13 + 8

        drawInfoBox(
          "1) XELAT EFFEKTI IQ da: ν(Co–N) = 572 cm⁻¹ (en) vs 503 cm⁻¹ (NH₃) — farq +69 cm⁻¹. Kuch konstantasi k = 2.15 vs 1.85 mdyn/Å. Beshhalqali xelat halqa geometrik jihatdan optimal (bite angle 85.4° ideal 90° ga yaqin) va Co–N bog'ini mustahkamlaydi.",
          C.bgAmber, C.amber, C.textDark
        )
        drawInfoBox(
          "2) ORGANIK LIGAND POLOSALARI: ν(C–H) 2960/2890, δ(CH₂) 1462, ω(CH₂) 1368, ν(C–N) 1052, ν(C–C) 1005 cm⁻¹. Bu polosalar ammin komplekslarda (NH₃) MUTLAQO YO'Q — ularda uglerod atomi yo'q. Bu xelat organik ligandning bevosita isboti.",
          C.bgCyan, C.cyan, C.textDark
        )
        drawInfoBox(
          "3) XELAT HALQA MODALARI: δ(N–Co–N) 408 cm⁻¹ (halqa deformatsiyasi) va torsion 285 cm⁻¹. Monodentat ligandli komplekslarda bu modalar mavjud emas — chunki halqa yo'q.",
          C.bgGreen, C.green, C.textDark
        )
        drawInfoBox(
          "4) OPTIK IZOMERIYA: D₃ simmetriya xiral — Δ (o'ng vintli) va Λ (chap vintli) enantiomerlari mavjud. MUHIM: IQ spektroskopiya ularni AJRATA OLMAYDI, chunki enantiomerlar bir xil energiya sathlariga ega. Faqat CD (Circular Dichroism) yoki ORD ajratadi.",
          C.bgRose, C.rose, C.textDark
        )

        const t2 = "Hooke qonuni ν̃ = (1/2πc)·√(k/μ). Co–N uchun k = 2.15 mdyn/Å va μ ≈ 12.1 g/mol beradi ν̃ ≈ 570 cm⁻¹ — tajribadagi 572 cm⁻¹ bilan a'lo mos keladi. Xelat halqa Co–N bog'ini «qulflab» qo'yadi va uning tebranish erkinligini cheklaydi — natijada effektiv kuch konstantasi ortadi."
        drawWrappedText(t2, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(t2, regularFont, 9.5, CONTENT_W).length * 13 + 10
      }

      // ═══ 3. XELAT EFFEKTI TERMODINAMIKASI ═══
      if (pdfSections.chelateEffect) {
        drawSectionHeader(sectionNum++, "Xelat Effekti — Termodinamik Asos")

        const t3 = "Xelat effekti (Schwarzenbach, 1952) — xelat ligandli komplekslarning monodentat ligandli analoglaridan sezilarli barqarorroq bo'lishi. Bu hodisa asosan ENTROPIYA hisobiga yuzaga keladi, entalpiya emas."
        drawWrappedText(t3, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(t3, regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.amberDeep })
        const ceHeaders = ["Reaksiya", "log K", "ΔG° kJ/mol", "ΔH° kJ/mol", "ΔS° J/mol·K"]
        const ceColW = [175, 65, 80, 80, 95]
        let cecx = MARGIN + 5
        ceHeaders.forEach((h, i) => {
          safeText(h, { x: cecx, y: y - 14, size: 8.5, font: boldFont, color: C.white, maxWidth: ceColW[i] - 4 })
          cecx += ceColW[i]
        })
        y -= 20

        chelateEffect.forEach((ce, idx) => {
          checkPageBreak(22)
          const isDiff = ce.type.includes("🏆")
          const bg = isDiff ? C.bgAmber : (idx % 2 === 0 ? C.bgOrange : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          let cecx2 = MARGIN + 5
          const cells = [ce.reaction, String(ce.logK), String(ce.dG), String(ce.dH), String(ce.dS)]
          cells.forEach((cell, i) => {
            const font = isDiff ? boldFont : regularFont
            const color = isDiff ? C.amberDeep : C.textDark
            safeText(cell, { x: cecx2, y: y - 13, size: 8, font, color, maxWidth: ceColW[i] - 4 })
            cecx2 += ceColW[i]
          })
          y -= 20
        })
        y -= 10

        drawInfoBox(
          "ENTROPIYA TUSHUNTIRISHI: [Co(H₂O)₆]³⁺ + 3en → [Co(en)₃]³⁺ + 6H₂O reaksiyasida 4 ta zarradan (1 + 3) 7 ta zarra (1 + 6) hosil bo'ladi — zarralar soni ORTADI, demak entropiya musbat (+285 J/mol·K). Monodentat holatda esa: [Co(H₂O)₆]³⁺ + 6NH₃ → [Co(NH₃)₆]³⁺ + 6H₂O — 7 dan 7 ga, entropiya deyarli o'zgarmaydi (+44). Bu 241 J/mol·K farq ΔG ga −77 kJ/mol hissa qo'shadi.",
          C.bgGreen, C.green, C.textDark
        )

        drawInfoBox(
          "IQ DAGI AKS ETISHI: Termodinamik barqarorlik (log β₃ = 48.7 vs 35.2) IQ spektrida ν(Co–N) chastotasining ortishida (572 vs 503 cm⁻¹) va kuch konstantasining kattalashishida (2.15 vs 1.85 mdyn/Å) aks etadi. Ya'ni xelat effekti nafaqat termodinamik, balki tebranish spektroskopiyasi orqali ham o'lchanadi.",
          C.bgAmber, C.amber, C.textDark
        )
      }


      // ═══ 4. CHO'QQILAR JADVALI ═══
      if (pdfSections.peaks) {
        drawSectionHeader(sectionNum++, "IQ Cho'qqilar Jadvali — Batafsil Tayinlash")

        const colW = [55, 88, 108, 45, 92, 97]
        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.amberDeep })
        const headers = ["ν̃ (cm⁻¹)", "Tayinlash", "Tavsif", "T%", "Simmetriya", "k (mdyn/Å)"]
        let cx = MARGIN + 4
        headers.forEach((h, i) => {
          safeText(h, { x: cx, y: y - 14, size: 8.5, font: boldFont, color: C.white, maxWidth: colW[i] - 4 })
          cx += colW[i]
        })
        y -= 20

        irPeaks.forEach((p, idx) => {
          checkPageBreak(22)
          const isKey = p.freq === 572 || p.freq === 408 || p.freq === 1052 || p.freq === 2960
          const bg = isKey ? C.bgAmber : (idx % 2 === 0 ? C.bgOrange : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          let cx2 = MARGIN + 4
          const cells = [
            String(p.freq), cleanText(p.assignment), cleanText(p.assignment_uz),
            `${p.T}%`, cleanText(p.symmetry).split(" — ")[0], cleanText(p.forceConstant),
          ]
          cells.forEach((cell, i) => {
            const font = isKey || i === 0 ? boldFont : regularFont
            const color = i === 0 ? C.amberDeep : (isKey ? C.amber : C.textDark)
            safeText(cell, { x: cx2, y: y - 13, size: 8, font, color, maxWidth: colW[i] - 4 })
            cx2 += colW[i]
          })
          y -= 20
        })
        y -= 8

        drawInfoBox(
          "Rangli qatorlar — bu kompleksning ENG MUHIM diagnostik polosalari: 2960 (C–H, organik ligand), 1052 (C–N, xelat skeleti), 572 (Co–N, xelat effekti), 408 (xelat halqa deformatsiyasi). Bu to'rt polosa birgalikda xelat kompleksni ammin kompleksdan ajratadi.",
          C.bgAmber, C.amber, C.textDark
        )

        drawWrappedText("Asosiy diagnostik cho'qqilar batafsil:", {
          x: MARGIN, y, size: 11, font: boldFont, color: C.amberDeep, maxWidth: CONTENT_W, lineHeight: 14
        })
        y -= 16

        const keyPeaks = irPeaks.filter(p => p.diagnostic && p.diagnostic.includes("🏆"))
        keyPeaks.forEach((p) => {
          checkPageBreak(70)
          safeText(`◆ ${p.freq} cm⁻¹  —  ${cleanText(p.assignment)}  (${cleanText(p.assignment_uz)})`, {
            x: MARGIN, y, size: 10, font: boldFont, color: C.amber, maxWidth: CONTENT_W,
          })
          y -= 14
          const h = drawWrappedText(cleanText(p.theoryNote), {
            x: MARGIN + 8, y, size: 9, font: regularFont, color: C.textDark,
            maxWidth: CONTENT_W - 16, lineHeight: 12,
          })
          y -= h + 6
          if (p.freeLigand && p.freeLigand !== "—") {
            safeText(`   ▸ ${cleanText(p.freeLigand)}   |   ${cleanText(p.coordShift)}`, {
              x: MARGIN + 8, y, size: 8.5, font: italicFont, color: C.purpleSoft, maxWidth: CONTENT_W - 16,
            })
            y -= 12
          }
          y -= 4
        })
      }

      // ═══ 5. IQ SPEKTR GRAFIGI ═══
      if (pdfSections.spectrum) {
        drawSectionHeader(sectionNum++, "IQ Spektri Grafigi (4000–200 cm⁻¹)")

        checkPageBreak(240)

        const gLeftPad = 40, gTopPad = 20
        const gX = MARGIN + gLeftPad
        const gW = CONTENT_W - gLeftPad - 5
        const gH = 150
        const gY = y - gH - gTopPad
        const xMax = 4000, xMin = 200

        page.drawRectangle({
          x: gX, y: gY, width: gW, height: gH,
          color: rgb(1.0, 0.99, 0.96), borderColor: C.amber, borderWidth: 0.5,
        })

        for (let tick = 0; tick <= 100; tick += 20) {
          const ty = gY + (tick / 100) * gH
          page.drawLine({ start: { x: gX, y: ty }, end: { x: gX + gW, y: ty }, thickness: 0.2, color: rgb(0.95, 0.92, 0.85) })
          const lw = measure(`${tick}`, regularFont, 7)
          page.drawText(`${tick}`, { x: gX - lw - 4, y: ty - 3, size: 7, font: regularFont, color: C.textMuted })
        }
        const xTicks = [4000, 3500, 3000, 2500, 2000, 1500, 1000, 500, 200]
        xTicks.forEach(wn => {
          const tx = gX + ((xMax - wn) / (xMax - xMin)) * gW
          page.drawLine({ start: { x: tx, y: gY }, end: { x: tx, y: gY + gH }, thickness: 0.2, color: rgb(0.95, 0.92, 0.85) })
          const lw = measure(`${wn}`, regularFont, 7)
          page.drawText(`${wn}`, { x: tx - lw / 2, y: gY - 11, size: 7, font: regularFont, color: C.textMuted })
        })

        const totalPoints = 500
        const transmittance = new Array(totalPoints).fill(1.0)
        irPeaks.forEach(peak => {
          const sigma = peak.freq > 2500 ? 28 : peak.freq > 900 ? 18 : 13
          for (let i = 0; i < totalPoints; i++) {
            const wn_i = xMin + (i / totalPoints) * (xMax - xMin)
            const absorption = peak.absorbance * Math.exp(-Math.pow(wn_i - peak.freq, 2) / (2 * sigma * sigma))
            transmittance[i] = Math.max(transmittance[i] - absorption, 0.04)
          }
        })
        for (let i = 0; i < totalPoints - 1; i++) {
          const wn0 = xMin + (i / totalPoints) * (xMax - xMin)
          const wn1 = xMin + ((i + 1) / totalPoints) * (xMax - xMin)
          const x0 = gX + ((xMax - wn0) / (xMax - xMin)) * gW
          const x1 = gX + ((xMax - wn1) / (xMax - xMin)) * gW
          const y0 = gY + transmittance[i] * gH
          const y1 = gY + transmittance[i + 1] * gH
          page.drawLine({ start: { x: x0, y: y0 }, end: { x: x1, y: y1 }, thickness: 0.9, color: C.amberDeep })
        }

        irPeaks.forEach((peak, idx) => {
          const px = gX + ((xMax - peak.freq) / (xMax - xMin)) * gW
          const py = gY + (1 - peak.absorbance) * gH
          const isKey = peak.freq === 572 || peak.freq === 408 || peak.freq === 1052 || peak.freq === 2960
          page.drawLine({
            start: { x: px, y: py }, end: { x: px, y: gY + gH },
            thickness: isKey ? 0.7 : 0.3, color: isKey ? C.amber : C.red,
          })
          if (isKey || idx % 2 === 0) {
            const wnStr = `${peak.freq}`
            const wnW = measure(wnStr, boldFont, 6.5)
            const labelX = Math.max(gX + 2, Math.min(gX + gW - wnW - 2, px - wnW / 2))
            page.drawText(wnStr, {
              x: labelX, y: gY + gH + 4 + (idx % 3) * 7,
              size: 6.5, font: boldFont, color: isKey ? C.amber : C.red,
            })
          }
        })

        const xAxisLabel = "To'lqin soni (cm⁻¹)"
        const xAxisW = measure(xAxisLabel, italicFont, 9)
        page.drawText(xAxisLabel, { x: gX + (gW - xAxisW) / 2, y: gY - 23, size: 9, font: italicFont, color: C.amberDeep })
        page.drawText("T (%)", { x: gX - 30, y: gY + gH / 2 - 3, size: 9, font: italicFont, color: C.amberDeep })

        y = gY - 40

        const cap = "1-rasm. [Co(en)₃]Cl₃ ning simulyatsiyalangan IQ spektri (Lorentzian profil, KBr tabletka). To'q sariq chiziqlar — asosiy diagnostik polosalar: 2960 (ν C–H, organik ligand), 1052 (ν C–N, xelat skeleti), 572 (ν Co–N, xelat effekti — NH₃ dan +69 cm⁻¹ yuqori), 408 (xelat halqa deformatsiyasi). Spektr uch qismga bo'linadi: X–H soha (3230, 3120 NH₂ + 2960, 2890 CH₂), organik barmoq izi (1602–888) va metall–ligand soha (572–285)."
        drawWrappedText(cap, { x: MARGIN, y, size: 8.5, font: italicFont, color: C.purpleSoft, maxWidth: CONTENT_W, lineHeight: 11 })
        y -= wrapText(cap, italicFont, 8.5, CONTENT_W).length * 11 + 14
      }

      // ═══ 6. GURUH NAZARIYASI ═══
      if (pdfSections.groupTheory) {
        drawSectionHeader(sectionNum++, "Guruh Nazariyasi — D₃ Simmetriyasi")

        const gtData = [
          ["Nuqtaviy guruh", "D₃ (dihedral, 3-tartibli o'q)"],
          ["Guruh tartibi", "6 ta operatsiya"],
          ["Operatsiyalar", "E, 2C₃, 3C₂"],
          ["Inversiya markazi", "YO'Q → molekula XIRAL"],
          ["Simmetriya tekisligi", "YO'Q (σ yo'q) → optik faol"],
          ["Umumiy normal modalar", "3N−6 = 3(43)−6 = 123 ta"],
          ["CoN₆ skelet modalari", "Γ = 2A₁ + 2A₂ + 4E"],
          ["A₁ vakolat", "IQ NOAKTIV, Raman faol (x²+y², z²)"],
          ["A₂ vakolat", "IQ faol (z), Raman faol (Rz)"],
          ["E vakolat (2-karra)", "IQ faol (x,y), Raman faol"],
          ["Mutual exclusion", "ISHLAMAYDI (i markazi yo'q)"],
          ["ν(Co–N) IQ faol", "A₂ + E → 572, 505 cm⁻¹"],
        ]
        gtData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgAmber : C.white, C.amberDeep)
        })
        y -= 10

        drawInfoBox(
          "D₃ va Oₕ farqi: Luteo-kobalt [Co(NH₃)₆]³⁺ Oₕ (48-tartib, inversiya markazi bor) — mutual exclusion ishlaydi. [Co(en)₃]³⁺ esa D₃ (6-tartib, inversiya markazi YO'Q) — mutual exclusion ISHLAMAYDI. Natijada ko'p modalar IQ va Ramanda bir vaqtda faol bo'ladi. Simmetriya tartibi 8 marta kamaygan (48 → 6), shuning uchun IQ spektri ancha murakkabroq va polosalar soni ko'proq.",
          C.bgBlue, C.blue, C.textDark
        )

        drawInfoBox(
          "XIRALLIK VA SIMMETRIYA: D₃ guruhida faqat aylanish operatsiyalari (E, C₃, C₂) mavjud — hech qanday aks ettirish (σ), inversiya (i) yoki aylanma-aks ettirish (S) yo'q. Bunday guruhlar «sof aylanish guruhlari» deb ataladi va ularga tegishli molekulalar MAJBURAN xiral bo'ladi. Shu sababli [Co(en)₃]³⁺ Δ va Λ enantiomerlariga ega.",
          C.bgRose, C.rose, C.textDark
        )
      }

      // ═══ 7. OPTIK IZOMERIYA ═══
      if (pdfSections.optical) {
        drawSectionHeader(sectionNum++, "Optik Izomeriya — Δ va Λ Enantiomerlar")

        const o1 = "Alfred Werner 1911-yilda [Co(en)₃]³⁺ ni Δ va Λ enantiomerlariga ajratgan — bu koordinatsion birikmalarning uch o'lchovli oktaedrik strukturaga ega ekanligining HAL QILUVCHI ISBOTI bo'lgan va 1913-yilda Nobel mukofotiga olib kelgan. Bu tajriba anorganik kimyoda birinchi marta uglerodsiz molekulaning optik faolligini ko'rsatgan."
        drawWrappedText(o1, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(o1, regularFont, 9.5, CONTENT_W).length * 13 + 10

        // Δ va Λ yonma-yon
        checkPageBreak(140)
        const halfW = (CONTENT_W - 10) / 2

        // Δ
        page.drawRectangle({ x: MARGIN, y: y - 22, width: halfW, height: 22, color: C.cyan })
        safeText("Δ (delta) — o'ng vintli", {
          x: MARGIN + 6, y: y - 15, size: 10, font: boldFont, color: C.white, maxWidth: halfW - 12,
        })
        // Λ
        page.drawRectangle({ x: MARGIN + halfW + 10, y: y - 22, width: halfW, height: 22, color: C.rose })
        safeText("Λ (lambda) — chap vintli", {
          x: MARGIN + halfW + 16, y: y - 15, size: 10, font: boldFont, color: C.white, maxWidth: halfW - 12,
        })
        y -= 24

        const optRows = [
          ["Optik aylanish", "[α]D = +105° ... +108°", "[α]D = −105° ... −108°"],
          ["CD (490 nm)", "Musbat Cotton effekti", "Manfiy Cotton effekti"],
          ["Xelat yo'nalishi", "Soat yo'nalishida (C₃ bo'ylab)", "Soatga qarshi (C₃ bo'ylab)"],
          ["CAS raqami", "16195-51-2", "16195-52-3"],
          ["Ajratish reagenti", "d-tartrat, (+)-bromkamfor", "l-tartrat, (−)-bromkamfor"],
          ["IQ spektri", "AYNAN BIR XIL", "AYNAN BIR XIL"],
          ["Raman spektri", "AYNAN BIR XIL", "AYNAN BIR XIL"],
          ["UV-Vis (yutilish)", "AYNAN BIR XIL", "AYNAN BIR XIL"],
        ]
        optRows.forEach((row, i) => {
          const rowH = 18
          checkPageBreak(rowH + 2)
          const isIRRow = row[0].includes("IQ") || row[0].includes("Raman") || row[0].includes("UV-Vis")
          const bg = isIRRow ? C.bgYellow : (i % 2 === 0 ? C.bgPurple : C.white)
          page.drawRectangle({ x: MARGIN, y: y - rowH, width: 118, height: rowH, color: C.bgPurple })
          safeText(row[0], { x: MARGIN + 4, y: y - 12, size: 8, font: boldFont, color: C.purple, maxWidth: 112 })
          page.drawRectangle({ x: MARGIN + 118, y: y - rowH, width: (CONTENT_W - 118) / 2, height: rowH, color: bg })
          safeText(row[1], { x: MARGIN + 122, y: y - 12, size: 8, font: isIRRow ? boldFont : regularFont, color: isIRRow ? C.red : C.cyanDeep, maxWidth: (CONTENT_W - 118) / 2 - 6 })
          page.drawRectangle({ x: MARGIN + 118 + (CONTENT_W - 118) / 2, y: y - rowH, width: (CONTENT_W - 118) / 2, height: rowH, color: bg })
          safeText(row[2], { x: MARGIN + 122 + (CONTENT_W - 118) / 2, y: y - 12, size: 8, font: isIRRow ? boldFont : regularFont, color: isIRRow ? C.red : C.roseDeep, maxWidth: (CONTENT_W - 118) / 2 - 6 })
          y -= rowH
        })
        y -= 10

        drawInfoBox(
          "⚠ MUHIM CHEKLOV: IQ SPEKTROSKOPIYA ENANTIOMERLARNI AJRATA OLMAYDI! Δ va Λ enantiomerlar bir xil energiya sathlariga, bir xil bog' uzunliklariga va bir xil kuch konstantalariga ega — shuning uchun ularning IQ, Raman va UV-Vis yutilish spektrlari AYNAN BIR XIL. Enantiomerlarni ajratish uchun QUTBLANGAN nur bilan ishlaydigan usullar kerak: CD (Circular Dichroism), ORD (Optical Rotatory Dispersion) yoki VCD (Vibrational Circular Dichroism).",
          C.bgRed, C.red, C.textDark
        )

        drawInfoBox(
          "VCD — IQ ning xiral versiyasi: Vibrational Circular Dichroism (VCD) — bu IQ sohasidagi chap va o'ng aylanma qutblangan nurning differensial yutilishini o'lchaydi. VCD Δ va Λ enantiomerlarni AJRATA OLADI va har bir tebranish modasi uchun musbat/manfiy signal beradi. Bu zamonaviy usul absolyut konfiguratsiyani aniqlash uchun ishlatiladi.",
          C.bgCyan, C.cyan, C.textDark
        )
      }

      // ═══ 8. lel/ob KONFORMERLAR ═══
      if (pdfSections.conformers) {
        drawSectionHeader(sectionNum++, "Konformatsion Izomeriya — lel va ob")

        const cf1 = "Har bir beshhalqali xelat halqa tekis emas — u «gauche» konformatsiyada bukilgan. Halqadagi C–C bog'ining C₃ asosiy o'qiga nisbatan yo'nalishi ikki xil bo'lishi mumkin: lel (parallel) yoki ob (oblique, qiya). Uchta halqa uchun 4 xil kombinatsiya mavjud (Corey & Bailar, 1959)."
        drawWrappedText(cf1, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(cf1, regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.cyanDeep })
        const cfHeaders = ["Konformer", "Tavsif", "Energiya", "Populyatsiya", "τ(CH₂) cm⁻¹"]
        const cfColW = [70, 165, 85, 85, 90]
        let cfcx = MARGIN + 5
        cfHeaders.forEach((h, i) => {
          safeText(h, { x: cfcx, y: y - 14, size: 8.5, font: boldFont, color: C.white, maxWidth: cfColW[i] - 4 })
          cfcx += cfColW[i]
        })
        y -= 20

        conformers.forEach((cf, idx) => {
          checkPageBreak(20)
          const isMost = cf.name === "lel₃"
          const bg = isMost ? C.bgCyan : (idx % 2 === 0 ? C.bgBlue : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let cfcx2 = MARGIN + 5
          const cells = [cf.name, cf.desc, cf.energy, cf.population, cf.irShift]
          cells.forEach((cell, i) => {
            const font = isMost || i === 0 ? boldFont : regularFont
            const color = isMost ? C.cyanDeep : (i === 0 ? C.blue : C.textDark)
            safeText(cell, { x: cfcx2, y: y - 12, size: 7.5, font, color, maxWidth: cfColW[i] - 4 })
            cfcx2 += cfColW[i]
          })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "IQ DA KONFORMERLARNI KUZATISH: Xona haroratida (298 K) barcha to'rt konformer muvozanatda bo'ladi va IQ polosalari ustma-ust tushib, kengayadi. τ(CH₂) polosasi 1275–1285 cm⁻¹ oralig'ida keng «yelka» sifatida ko'rinadi. SUYUQ AZOT haroratida (77 K) konformerlar «muzlaydi» va polosalar keskinlashadi — lel₃ (1285) va ob₃ (1275) ayrim-ayrim ko'rinadi. Bu past haroratli IQ spektroskopiyaning klassik qo'llanilishi.",
          C.bgCyan, C.cyan, C.textDark
        )

        drawInfoBox(
          "Barqarorlik sababi: lel₃ konformerda C–H bog'lari orasidagi steric (fazoviy) itarishish minimal, shuning uchun u eng barqaror (0 kJ/mol). ob₃ da esa CH₂ guruhlari bir-biriga yaqinroq keladi va energiya +3.8 kJ/mol ga ortadi. Bu farq kichik bo'lgani uchun xona haroratida barcha konformerlar mavjud (Boltzmann taqsimoti).",
          C.bgGreen, C.green, C.textDark
        )
      }

      // ═══ 9. en vs NH3 TAQQOSLASH ═══
      if (pdfSections.comparison) {
        drawSectionHeader(sectionNum++, "Xelat (en) va Monodentat (NH₃) Taqqoslash")

        const cm1 = "Quyidagi jadval [Co(en)₃]³⁺ (xelat) va [Co(NH₃)₆]³⁺ (monodentat) komplekslarini barcha muhim parametrlar bo'yicha taqqoslaydi. Har ikkalasi ham CoN₆ koordinatsion muhitga ega, lekin ligand denticity farqi keskin natijalar beradi."
        drawWrappedText(cm1, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(cm1, regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.amberDeep })
        const cmHeaders = ["Parametr", "[Co(en)₃]³⁺ (xelat)", "[Co(NH₃)₆]³⁺ (monodentat)"]
        const cmColW = [145, 175, 175]
        let cmcx = MARGIN + 5
        cmHeaders.forEach((h, i) => {
          safeText(h, { x: cmcx, y: y - 14, size: 8.5, font: boldFont, color: C.white, maxWidth: cmColW[i] - 4 })
          cmcx += cmColW[i]
        })
        y -= 20

        enVsNH3.forEach((row, idx) => {
          checkPageBreak(20)
          const isWinner = row.winner === "en"
          const bg = isWinner ? C.bgAmber : (idx % 2 === 0 ? C.bgOrange : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let cmcx2 = MARGIN + 5
          const cells = [row.param, row.en, row.nh3]
          cells.forEach((cell, i) => {
            const font = (isWinner && i === 1) || i === 0 ? boldFont : regularFont
            const color = i === 0 ? C.amberDeep : (i === 1 ? (isWinner ? C.amber : C.textDark) : C.textMuted)
            safeText(cell, { x: cmcx2, y: y - 12, size: 8, font, color, maxWidth: cmColW[i] - 4 })
            cmcx2 += cmColW[i]
          })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "IQ SPEKTROSKOPIYA XULOSASI: Xelat kompleksni ammin kompleksdan ajratishning 4 ta bevosita IQ dalili: (1) ν(C–H) 2960/2890 cm⁻¹ — organik ligand; (2) ν(C–N) 1052 va ν(C–C) 1005 cm⁻¹ — etilendiamin skeleti; (3) ν(Co–N) 572 cm⁻¹ (NH₃ dan +69 yuqori) — xelat effekti; (4) 408 va 285 cm⁻¹ — xelat halqa modalari. Ammin komplekslarda bu polosalarning HECH BIRI yo'q.",
          C.bgAmber, C.amber, C.textDark
        )
      }

      // ═══ 10. KUCH KONSTANTASI ═══
      if (pdfSections.forceConstant) {
        drawSectionHeader(sectionNum++, "Kuch Konstantasi va Hooke Qonuni")

        const fc1 = "Hooke qonuni ν̃ = (1/2πc)·√(k/μ) asosida bog'lar mustahkamligi. Bu kompleksda Co–N kuch konstantasi (2.15 mdyn/Å) barcha ammin komplekslardan yuqori — xelat effektining miqdoriy o'lchami."
        drawWrappedText(fc1, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(fc1, regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.orangeDeep })
        const fcHeaders = ["Bog'", "k (mdyn/Å)", "ν̃ (cm⁻¹)", "Izoh"]
        const fcColW = [175, 90, 90, 140]
        let fcx = MARGIN + 6
        fcHeaders.forEach((h, i) => {
          safeText(h, { x: fcx, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: fcColW[i] - 4 })
          fcx += fcColW[i]
        })
        y -= 20

        forceConstantExamples.forEach((f, idx) => {
          checkPageBreak(20)
          const isHighlight = f.note.includes("🏆")
          const bg = isHighlight ? C.bgAmber : (idx % 2 === 0 ? C.bgOrange : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let fcx2 = MARGIN + 6
          const cells = [f.bond, String(f.k), String(f.freq), f.note]
          cells.forEach((cell, i) => {
            const font = isHighlight ? boldFont : (i === 0 ? boldFont : regularFont)
            const color = isHighlight ? C.amberDeep : (i === 0 ? C.orangeDeep : C.textDark)
            safeText(cell, { x: fcx2, y: y - 12, size: 8.5, font, color, maxWidth: fcColW[i] - 4 })
            fcx2 += fcColW[i]
          })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "M–N kuch konstantalari qatori: Co–N(en) = 2.15 > Cr–N(en) = 1.95 > Co–N(NH₃) = 1.85 > Ni–N(en) = 1.65 mdyn/Å. Ikki tendensiya ko'rinadi: (1) bir xil metall uchun xelat > monodentat (Co: 2.15 vs 1.85); (2) bir xil ligand uchun oksidlanish darajasi va d-elektron konfiguratsiyasi ta'sir qiladi (Co(III) d⁶ LS > Cr(III) d³ > Ni(II) d⁸).",
          C.bgGreen, C.green, C.textDark
        )
      }

      // ═══ 11. WERNER QATORI ═══
      if (pdfSections.werner) {
        drawSectionHeader(sectionNum++, "Werner Koordinatsion Qatori — Xelat Bilan")

        const w1 = "Werner qatorining kengaytirilgan versiyasi: monodentat NH₃ dan bidentat en gacha. [Co(en)₃]³⁺ bu qatorda alohida o'rin egallaydi — birinchi XIRAL kompleks va Werner Nobel mukofotining asosi."
        drawWrappedText(w1, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(w1, regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.purple })
        const wHeaders = ["Kompleks", "Ligandlar", "Simm.", "ν(Co-N)", "Xirallik"]
        const wColW = [130, 120, 55, 85, 105]
        let wcx = MARGIN + 5
        wHeaders.forEach((h, i) => {
          safeText(h, { x: wcx, y: y - 14, size: 8.5, font: boldFont, color: C.white, maxWidth: wColW[i] - 4 })
          wcx += wColW[i]
        })
        y -= 20

        wernerSeries.forEach((w, idx) => {
          checkPageBreak(20)
          const bg = w.current ? C.bgAmber : (idx % 2 === 0 ? C.bgPurple : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let wcx2 = MARGIN + 5
          const cells = [w.formula, w.ligand, w.sym, w.nuCoN, w.chiral]
          cells.forEach((cell, i) => {
            const font = w.current ? boldFont : (i === 0 ? boldFont : regularFont)
            const color = w.current ? C.amberDeep : (i === 0 ? C.purple : C.textDark)
            safeText(cell, { x: wcx2, y: y - 12, size: 7.5, font, color, maxWidth: wColW[i] - 4 })
            wcx2 += wColW[i]
          })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "ν(Co–N) tendensiyasi: NH₃ komplekslarida 498–503 cm⁻¹, xelat (en) komplekslarida esa 570–572 cm⁻¹. Bu ~70 cm⁻¹ farq ligand denticity ning bevosita natijasidir. Shuningdek xirallik faqat xelat komplekslarda paydo bo'ladi — [Co(en)₃]³⁺ va cis-[Co(en)₂Cl₂]⁺ optik faol, monodentat komplekslar esa emas.",
          C.bgPurple, C.purple, C.textDark
        )
      }

      // ═══ 12. NAMUNA TAYYORLASH ═══
      if (pdfSections.techniques) {
        drawSectionHeader(sectionNum++, "Namuna Tayyorlash — Xelat Kompleks Uchun")

        const tq1 = "MUHIM OGOHLANTIRISH: Bu kompleks uchun NUJOL MULL YARAMAYDI! Nujol mineral moyining C–H polosalari (2920, 2850, 1460) etilendiaminning CH₂ polosalarini (2960, 2890, 1462) to'liq qoplaydi. Faqat KBr yoki CsI tabletka ishlating."
        drawWrappedText(tq1, { x: MARGIN, y, size: 9.5, font: boldFont, color: C.red, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(tq1, boldFont, 9.5, CONTENT_W).length * 13 + 10

        techniques.forEach((t, idx) => {
          checkPageBreak(165)
          const isRec = t.bestFor.includes("🔑")
          const isBad = t.bestFor.includes("❌")
          page.drawRectangle({
            x: MARGIN, y: y - 20, width: CONTENT_W, height: 20,
            color: isBad ? C.red : (isRec ? C.amber : C.blue),
          })
          const marker = isRec ? " ★ TAVSIYA" : (isBad ? " 🚫 YARAMAYDI" : "")
          safeText(`${idx + 1}. ${t.name}${marker}`, {
            x: MARGIN + 8, y: y - 14, size: 10, font: boldFont, color: C.white, maxWidth: CONTENT_W - 16,
          })
          y -= 20

          const h = drawWrappedText(t.description, {
            x: MARGIN + 8, y: y - 12, size: 9, font: italicFont, color: C.textMuted,
            maxWidth: CONTENT_W - 16, lineHeight: 12,
          })
          y -= h + 8

          const colBoxW = (CONTENT_W - 10) / 2
          checkPageBreak(78)

          page.drawRectangle({
            x: MARGIN, y: y - 70, width: colBoxW, height: 70,
            color: C.bgGreen, borderColor: C.green, borderWidth: 0.5,
          })
          safeText("✓ Afzalliklar", {
            x: MARGIN + 6, y: y - 12, size: 9, font: boldFont, color: C.green, maxWidth: colBoxW - 12,
          })
          t.advantages.forEach((adv, i) => {
            safeText(`• ${adv}`, {
              x: MARGIN + 6, y: y - 26 - i * 10, size: 7.5,
              font: regularFont, color: C.textDark, maxWidth: colBoxW - 12,
            })
          })

          page.drawRectangle({
            x: MARGIN + colBoxW + 10, y: y - 70, width: colBoxW, height: 70,
            color: C.bgRed, borderColor: C.red, borderWidth: 0.5,
          })
          safeText("✗ Kamchiliklar", {
            x: MARGIN + colBoxW + 16, y: y - 12, size: 9, font: boldFont, color: C.red, maxWidth: colBoxW - 12,
          })
          t.disadvantages.forEach((dis, i) => {
            safeText(`• ${dis}`, {
              x: MARGIN + colBoxW + 16, y: y - 26 - i * 10, size: 7.5,
              font: regularFont, color: C.textDark, maxWidth: colBoxW - 12,
            })
          })
          y -= 76

          safeText(
            `Chastota: ${t.freqRange}  •  Ruxsat: ${t.resolution}  •  Vaqt: ${t.samplePrep}`,
            { x: MARGIN, y, size: 8, font: italicFont, color: C.purpleSoft, maxWidth: CONTENT_W }
          )
          y -= 12
          safeText(`Eng yaxshi qo'llanish: ${t.bestFor}`, {
            x: MARGIN, y, size: 8, font: italicFont, color: isBad ? C.red : C.purpleSoft, maxWidth: CONTENT_W,
          })
          y -= 16
        })
      }

      // ═══ 13. HALAQIT OMILLARI ═══
      if (pdfSections.interferences) {
        drawSectionHeader(sectionNum++, "Halaqit Beruvchi Omillar")

        const iv1 = "Xelat komplekslar bilan ishlashda o'ziga xos muammolar: Nujol interferensiyasi (organik polosalar), erkin ligand qoldig'i va konformatsion aralashma."
        drawWrappedText(iv1, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(iv1, regularFont, 9.5, CONTENT_W).length * 13 + 10

        interferences.forEach((iv, idx) => {
          checkPageBreak(60)
          const sevColor = iv.severity === "Yuqori" ? C.red : (iv.severity === "O'rta" ? C.orange : C.green)
          const sevBg = iv.severity === "Yuqori" ? C.bgRed : (iv.severity === "O'rta" ? C.bgOrange : C.bgGreen)
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: sevBg })
          safeText(`${idx + 1}. ${iv.source}`, {
            x: MARGIN + 6, y: y - 12, size: 9.5, font: boldFont, color: sevColor, maxWidth: CONTENT_W * 0.5,
          })
          safeText(`ν̃: ${iv.freqRange}`, {
            x: MARGIN + CONTENT_W * 0.52, y: y - 12, size: 8.5,
            font: regularFont, color: C.textDark, maxWidth: CONTENT_W * 0.28,
          })
          safeText(`[${iv.severity}]`, {
            x: PAGE_W - MARGIN - 6, y: y - 12, size: 8.5,
            font: boldFont, color: sevColor, align: "right", maxWidth: CONTENT_W * 0.15,
          })
          y -= 20

          const h1 = drawWrappedText(`Ta'sir: ${iv.effect}`, {
            x: MARGIN + 8, y, size: 8.5, font: regularFont, color: C.textDark,
            maxWidth: CONTENT_W - 16, lineHeight: 11,
          })
          y -= h1 + 4
          const h2 = drawWrappedText(`Yechim: ${iv.solution}`, {
            x: MARGIN + 8, y, size: 8.5, font: italicFont, color: C.greenDark,
            maxWidth: CONTENT_W - 16, lineHeight: 11,
          })
          y -= h2 + 10
        })
      }

      // ═══ 14. XULOSALAR ═══
      if (pdfSections.conclusions) {
        drawSectionHeader(sectionNum++, "Asosiy Xulosalar")

        const conclusions = [
          "XELAT EFFEKTINING IQ ISBOTI: ν(Co–N) = 572 cm⁻¹, bu [Co(NH₃)₆]³⁺ dagi 503 cm⁻¹ dan +69 cm⁻¹ YUQORI. Kuch konstantasi k = 2.15 vs 1.85 mdyn/Å. Beshhalqali xelat halqa Co–N bog'ini mustahkamlaydi.",
          "ORGANIK LIGAND POLOSALARI: ν(C–H) 2960/2890, δ(CH₂) 1462, ν(C–N) 1052, ν(C–C) 1005 cm⁻¹ — bu polosalar ammin komplekslarda MUTLAQO YO'Q va etilendiaminning bevosita isboti.",
          "XELAT HALQA MODALARI: δ(N–Co–N) 408 cm⁻¹ (halqa deformatsiyasi) va torsion 285 cm⁻¹ — faqat xelat komplekslarda mavjud. Bite angle N–Co–N = 85.4° (ideal 90° dan kichik).",
          "D₃ SIMMETRIYA: Guruh tartibi atigi 6 (Oₕ dagi 48 dan 8 marta kam). Inversiya markazi YO'Q → mutual exclusion ishlamaydi, ko'p modalar IQ+Raman ikkalasida faol. Faqat aylanish operatsiyalari (E, 2C₃, 3C₂) mavjud.",
          "IQ ENANTIOMERLARNI AJRATA OLMAYDI: Δ va Λ enantiomerlarning IQ, Raman va UV-Vis spektrlari AYNAN BIR XIL. Ularni ajratish uchun CD, ORD yoki VCD (Vibrational CD) kerak.",
          "WERNER NOBEL MUKOFOTI (1913): [Co(en)₃]³⁺ ni Δ/Λ enantiomerlariga ajratish (1911) koordinatsion birikmalarning oktaedrik uch o'lchovli strukturasining hal qiluvchi isboti bo'lgan.",
          "KONFORMATSION IZOMERIYA: lel₃ (45%), lel₂ob (35%), lelob₂ (15%), ob₃ (5%). Xona haroratida barchasi muvozanatda — τ(CH₂) polosasi kengayadi. 77 K da konformerlar ajraladi va polosalar keskinlashadi.",
          "XELAT EFFEKTI TERMODINAMIKASI: log β₃ = 48.7 (en) vs 35.2 (NH₃). Farq asosan ENTROPIYA hisobiga: ΔS = +285 vs +44 J/mol·K. Reaksiyada zarralar soni ortishi (4 → 7) entropiyani oshiradi.",
          "NAMUNA TAYYORLASH: KBr tabletka asosiy usul (572, 505 cm⁻¹ ko'rinadi). NUJOL MULL YARAMAYDI — uning C–H polosalari (2920, 2850) etilendiaminning CH₂ polosalarini qoplaydi. CsI konformatsion tahlil uchun.",
          "Bu kompleks koordinatsion kimyoning uchta muhim tushunchasini birlashtiradi: xelat effekti (termodinamika), optik izomeriya (stereokimyo) va konformatsion analiz (dinamika) — IQ spektroskopiya har uchalasini ham o'rganishga imkon beradi.",
        ]

        conclusions.forEach((c, idx) => {
          checkPageBreak(35)
          page.drawCircle({ x: MARGIN + 10, y: y - 8, size: 8, color: C.amber })
          const numStr = `${idx + 1}`
          const numW = measure(numStr, boldFont, 9)
          page.drawText(numStr, {
            x: MARGIN + 10 - numW / 2, y: y - 11, size: 9, font: boldFont, color: C.white,
          })
          const h = drawWrappedText(c, {
            x: MARGIN + 25, y, size: 9, font: regularFont, color: C.textDark,
            maxWidth: CONTENT_W - 30, lineHeight: 12,
          })
          y -= h + 10
        })
      }

      addFooter()

      pdfDoc.setTitle(`[Co(en)₃]Cl₃ IQ Spektroskopik Tahlili`)
      pdfDoc.setSubject("Xelat effekti, D₃ simmetriya va Δ/Λ optik izomeriya")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo IQ Tahlil Moduli")
      pdfDoc.setKeywords(["Co(en)3", "chelate effect", "D3 symmetry", "optical isomerism", "Delta Lambda", "lel ob"])

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Co_en3_Cl3_IQ_tahlili_${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setPdfModalOpen(false)
    } catch (err) {
      console.error("PDF yaratishda xato:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally {
      setPdfGenerating(false)
    }
  }

  // ─── Slider bilan eng yaqin cho'qqini topish
  const nearestPeak = useMemo(() => {
    return irPeaks.reduce((prev, curr) =>
      Math.abs(curr.freq - freqSlider) < Math.abs(prev.freq - freqSlider) ? curr : prev
    )
  }, [freqSlider])

  // ─── Spektr egri chizig'i (Lorentzian yig'indisi)
  const spectrumPath = useMemo(() => {
    const W = 900, H = 260
    const fMax = 4000, fMin = 200
    const pts = []
    for (let i = 0; i <= 600; i++) {
      const f = fMax - (i / 600) * (fMax - fMin)
      let absSum = 0.04
      irPeaks.forEach((p) => {
        const gamma = p.freq > 2000 ? 55 : (p.freq > 900 ? 28 : 18)
        absSum += p.absorbance * (gamma * gamma) / ((f - p.freq) ** 2 + gamma * gamma)
      })
      const trans = Math.max(3, 100 - absSum * 95)
      const x = (i / 600) * W
      const yy = H - (trans / 100) * H
      pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${yy.toFixed(1)}`)
    }
    return pts.join(" ")
  }, [])

  const intensityBadge = (code) =>
    code === 4 ? "bg-red-500/20 text-red-300 border-red-500/40"
    : code === 3 ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
    : code === 2 ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"

  const pdfSectionLabels = {
    identification: "1. Identifikatsiya va fizik-kimyoviy parametrlar",
    theory: "2. Nazariy asos — xelat ligand tebranishlari",
    chelateEffect: "3. Xelat effekti termodinamikasi",
    peaks: "4. IQ cho'qqilari to'liq jadvali (17 polosa)",
    spectrum: "5. IQ spektr grafigi (Lorentzian simulyatsiya)",
    groupTheory: "6. D₃ guruh nazariyasi va tanlash qoidalari",
    optical: "7. Δ/Λ optik izomeriya va Werner ajratishi",
    conformers: "8. lel/ob konformatsion izomeriya",
    comparison: "9. Xelat (en) va monodentat (NH₃) taqqoslash",
    forceConstant: "10. Kuch konstantasi va Hooke qonuni",
    werner: "11. Werner koordinatsion qatori",
    techniques: "12. Namuna tayyorlash usullari",
    interferences: "13. Halaqit beruvchi omillar",
    conclusions: "14. Asosiy xulosalar",
  }

  const toggleSection = (key) =>
    setPdfSections((prev) => ({ ...prev, [key]: !prev[key] }))
  const allOn = () =>
    setPdfSections(Object.keys(pdfSections).reduce((a, k) => ({ ...a, [k]: true }), {}))
  const allOff = () =>
    setPdfSections(Object.keys(pdfSections).reduce((a, k) => ({ ...a, [k]: false }), {}))
  const selectedCount = Object.values(pdfSections).filter(Boolean).length

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-slate-100">
      {/* ══════════════ HEADER ══════════════ */}
      {showHeader && (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-purple-700/40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/ilmiy/tahlil/iq/birikmalar"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-purple-800/50 hover:bg-purple-700/60 border border-purple-600/50 text-sm transition"
              >
                ← Katalog
              </Link>
              <div className="min-w-0">
                <h1
                  className="text-base sm:text-lg font-bold text-amber-300 truncate"
                  dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }}
                />
                <p className="text-[11px] text-purple-300/80 truncate">
                  Xelat kompleks • D₃ • Δ/Λ optik izomeriya
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPdfModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-900/40 transition"
              >
                📄 PDF hisobot
              </button>
              <button
                onClick={() => setShowHeader(false)}
                className="px-2 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/40 text-xs transition"
                title="Sarlavhani yashirish"
              >
                ✕
              </button>
            </div>
          </div>
        </header>
      )}
      {!showHeader && (
        <button
          onClick={() => setShowHeader(true)}
          className="fixed top-3 left-3 z-40 px-3 py-1.5 rounded-lg bg-purple-800/80 border border-purple-600/50 text-xs backdrop-blur"
        >
          ☰ Menyu
        </button>
      )}

      {/* ══════════════ PDF MODAL ══════════════ */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-slate-900 to-purple-950 border border-amber-600/40 shadow-2xl shadow-amber-900/30">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur px-6 py-4 border-b border-amber-700/30 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-amber-300">📄 PDF ilmiy hisobot</h3>
                <p className="text-xs text-purple-300/80">
                  Kerakli bo'limlarni tanlang — {selectedCount}/14 tanlangan
                </p>
              </div>
              <button
                onClick={() => setPdfModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600/50 transition"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="flex gap-2 mb-4">
                <button onClick={allOn} className="px-3 py-1.5 rounded-lg bg-emerald-700/40 hover:bg-emerald-600/50 border border-emerald-500/40 text-xs transition">
                  ✓ Barchasini tanlash
                </button>
                <button onClick={allOff} className="px-3 py-1.5 rounded-lg bg-rose-700/40 hover:bg-rose-600/50 border border-rose-500/40 text-xs transition">
                  ✕ Barchasini bekor qilish
                </button>
              </div>

              <div className="space-y-1.5">
                {Object.entries(pdfSectionLabels).map(([key, label]) => (
                  <label
                    key={key}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer border transition ${
                      pdfSections[key]
                        ? "bg-amber-900/25 border-amber-600/40"
                        : "bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={pdfSections[key]}
                      onChange={() => toggleSection(key)}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span className={`text-sm ${pdfSections[key] ? "text-amber-100" : "text-slate-400"}`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-blue-950/40 border border-blue-700/30 text-[11px] text-blue-200/90 leading-relaxed">
                <b className="text-blue-300">Hisobot tarkibi:</b> A4 format, avtomatik matn o'rash va sahifa
                bo'linishi, ranglangan jadvallar, Lorentzian spektr grafigi, xelat effekti diagrammasi.
                Kutilayotgan hajm: 8–11 sahifa (barcha bo'limlar tanlanganda).
              </div>

              <button
                onClick={generatePDF}
                disabled={pdfGenerating || selectedCount === 0}
                className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-bold shadow-lg shadow-amber-900/40 transition"
              >
                {pdfGenerating
                  ? "⏳ PDF yaratilmoqda..."
                  : selectedCount === 0
                  ? "Kamida bitta bo'limni tanlang"
                  : `📥 PDF yuklab olish (${selectedCount} bo'lim)`}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* ══════════════ HERO ══════════════ */}
        <section className="rounded-2xl bg-gradient-to-br from-amber-950/50 via-purple-950/60 to-slate-950/70 border border-amber-700/40 p-6 sm:p-8 shadow-2xl shadow-amber-950/30">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-[11px] text-amber-300 font-semibold mb-3">
                XELAT KOMPLEKS • WERNER NOBEL 1913
              </div>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-amber-200 mb-2"
                dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }}
              />
              <p className="text-purple-200 text-sm">{COMPOUND.iupac}</p>
              <p className="text-purple-300/70 text-xs mt-1">{COMPOUND.ligandFull}</p>
            </div>
            <div className="text-right space-y-1 text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-purple-700/40">
                <span className="text-purple-400">M</span>{" "}
                <b className="text-amber-300">{COMPOUND.molarMass} g/mol</b>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-purple-700/40">
                <span className="text-purple-400">CAS</span>{" "}
                <b className="text-slate-200">{COMPOUND.casNumber}</b>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-purple-700/40">
                <span className="text-purple-400">[α]D</span>{" "}
                <b className="text-cyan-300">{COMPOUND.opticalRotation}</b>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Nuqtaviy guruh", value: COMPOUND.pointGroup, accent: "text-amber-300" },
              { label: "Guruh tartibi", value: `${COMPOUND.groupOrder} (E, 2C₃, 3C₂)`, accent: "text-purple-300" },
              { label: "Xelat halqalar", value: "3 × 5-halqali", accent: "text-emerald-300" },
              { label: "Bite angle", value: "85.4°", accent: "text-cyan-300" },
              { label: "ν(Co–N)", value: "572 cm⁻¹ ↑", accent: "text-orange-300" },
              { label: "k(Co–N)", value: "2.15 mdyn/Å", accent: "text-orange-300" },
              { label: "Δₒ (10Dq)", value: COMPOUND.deltaOh, accent: "text-blue-300" },
              { label: "log β₃", value: COMPOUND.logBeta3, accent: "text-rose-300" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-900/50 border border-purple-800/40 p-3">
                <div className="text-[10px] uppercase tracking-wide text-purple-400/80 mb-1">{s.label}</div>
                <div className={`text-sm font-bold ${s.accent}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ ASOSIY DIAGNOSTIKA ══════════════ */}
        <section className="rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-950/60 border border-emerald-700/40 p-6">
          <h3 className="text-xl font-bold text-emerald-300 mb-1">🔑 Asosiy IQ diagnostikasi — 4 ta hal qiluvchi dalil</h3>
          <p className="text-xs text-emerald-200/70 mb-5">
            Bu kompleksni ammin komplekslardan ({"[Co(NH₃)₆]³⁺"}) IQ spektri orqali ajratishning bevosita isbotlari
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                n: 1, title: "Organik ligand polosalari",
                freq: "2960, 2890 cm⁻¹",
                text: "ν(C–H) alifatik cho'zilishlari — CH₂ guruhlaridan. Ammin komplekslarda uglerod YO'Q, shuning uchun bu polosalar mutlaqo bo'lmaydi. Bu — en ligandining eng oson ko'rinadigan belgisi.",
                color: "cyan",
              },
              {
                n: 2, title: "Etilendiamin skeleti",
                freq: "1052, 1005 cm⁻¹",
                text: "ν(C–N) va ν(C–C) cho'zilishlari — xelat ko'prigining o'zi. Bu ikki polosaning birgalikda bo'lishi bidentat N–C–C–N ko'prigi mavjudligini isbotlaydi.",
                color: "purple",
              },
              {
                n: 3, title: "Xelat effekti — ν(Co–N) siljishi",
                freq: "572 cm⁻¹ (NH₃: 503)",
                text: "Xelat halqa Co–N bog'ini mustahkamlaydi: +69 cm⁻¹ yuqoriga siljish. Kuch konstantasi 1.85 → 2.15 mdyn/Å ga ortadi. Bu xelat effektining bevosita spektroskopik o'lchami.",
                color: "amber",
              },
              {
                n: 4, title: "Xelat halqa modalari",
                freq: "408, 285 cm⁻¹",
                text: "δ(N–Co–N) halqa deformatsiyasi va halqa torsion tebranishi. Bu modalar FAQAT yopiq xelat halqada mavjud — monodentat ligandlarda printsipial jihatdan bo'lishi mumkin emas.",
                color: "rose",
              },
            ].map((d) => (
              <div
                key={d.n}
                className={`rounded-xl p-4 border bg-${d.color}-950/30 border-${d.color}-700/40`}
                style={{
                  background: "rgba(15,23,42,0.55)",
                  borderColor: "rgba(148,163,184,0.25)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-emerald-500/25 border border-emerald-400/50 flex items-center justify-center text-xs font-bold text-emerald-300">
                    {d.n}
                  </span>
                  <h4 className="text-sm font-bold text-slate-100">{d.title}</h4>
                </div>
                <div className="text-lg font-mono font-bold text-emerald-300 mb-2">{d.freq}</div>
                <p className="text-xs text-slate-300/85 leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ NAZARIY ASOS ══════════════ */}
        <section className="rounded-2xl bg-slate-900/50 border border-purple-700/40 p-6">
          <h3 className="text-xl font-bold text-purple-300 mb-5">
            📐 Nazariy asos — xelat ligand tebranish spektroskopiyasi
          </h3>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="rounded-xl bg-purple-950/40 border border-purple-700/40 p-5">
              <h4 className="text-sm font-bold text-purple-200 mb-3">1. Xelat halqaning tebranish xususiyati</h4>
              <p className="text-xs text-slate-300/90 leading-relaxed mb-3">
                Etilendiamin (en) bidentat ligand — bitta molekulada ikkita azot donor atomi bor va ular bitta metall
                ioniga birikib <b className="text-amber-300">yopiq beshhalqali (5-membered) xelat halqa</b> hosil
                qiladi: Co–N–C–C–N. Bu yopiq halqa monodentat ligandlardan tubdan farq qiladi:
              </p>
              <ul className="space-y-2 text-xs text-slate-300/85">
                <li className="flex gap-2">
                  <span className="text-amber-400 shrink-0">▸</span>
                  <span>
                    <b className="text-amber-200">Halqa qattiqligi (rigidity):</b> yopiq halqada N atomlari erkin
                    aylanmaydi — koordinatsion muhit qattiqlashadi va Co–N cho'zilish chastotasi ortadi.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 shrink-0">▸</span>
                  <span>
                    <b className="text-amber-200">Yangi normal modalar:</b> halqa deformatsiyasi δ(N–Co–N) va halqa
                    torsion tebranishi paydo bo'ladi — bular faqat xelatda mavjud.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 shrink-0">▸</span>
                  <span>
                    <b className="text-amber-200">Kinematik bog'lanish (coupling):</b> ν(Co–N), ν(C–N) va ν(C–C)
                    modalari o'zaro mexanik bog'langan — sof «lokal» tebranish emas, aralash normal modalar.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 shrink-0">▸</span>
                  <span>
                    <b className="text-amber-200">Bite angle cheklovi:</b> N–Co–N = 85.4° — ideal oktaedrik 90° dan
                    kichik. Bu kichik burchak taranglik (strain) hosil qiladi va halqa modalari chastotasini belgilaydi.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-blue-950/40 border border-blue-700/40 p-5">
              <h4 className="text-sm font-bold text-blue-200 mb-3">2. Hooke qonuni va normal modalar soni</h4>
              <div className="rounded-lg bg-slate-950/70 border border-blue-600/30 p-3 mb-3 text-center">
                <div className="text-lg font-mono text-blue-300">ν̃ = (1 / 2πc) · √(k / μ)</div>
                <div className="text-[10px] text-blue-400/70 mt-1">
                  ν̃ — to'lqin soni (cm⁻¹), k — kuch konstantasi, μ — keltirilgan massa
                </div>
              </div>
              <p className="text-xs text-slate-300/90 leading-relaxed mb-3">
                Co–N uchun keltirilgan massa μ = (58.93 × 14.01)/(58.93 + 14.01) = 11.32 a.m.b. Kuch konstantasi
                xelatda k = 2.15 mdyn/Å (NH₃ da 1.85) — bu <b className="text-blue-300">+16% ortish</b>. Hooke
                qonuniga ko'ra ν̃ ∝ √k, ya'ni chastota √(2.15/1.85) = 1.078 marta, ya'ni 503 → 542 cm⁻¹ ga ortishi
                kutiladi. Kuzatilgan 572 cm⁻¹ bundan ham yuqori — qolgan farq halqa modalari bilan kinematik
                bog'lanish hisobiga.
              </p>
              <div className="rounded-lg bg-slate-950/60 border border-blue-700/30 p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Atomlar soni (N)</span>
                  <b className="text-blue-300">43</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Normal modalar (3N − 6)</span>
                  <b className="text-blue-300">123</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CoN₆ skelet modalari</span>
                  <b className="text-amber-300">{groupTheoryD3.skeletonModes}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kuzatilgan asosiy polosalar</span>
                  <b className="text-emerald-300">17</b>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-amber-950/30 border border-amber-700/40 p-5">
            <h4 className="text-sm font-bold text-amber-200 mb-3">
              3. Koordinatsion siljish — erkin en va bog'langan en
            </h4>
            <p className="text-xs text-slate-300/90 leading-relaxed mb-4">
              Etilendiamin metallga koordinatsiyalanganda azotning yolg'iz elektron jufti Co(III) ga beriladi. Bu
              N–H bog'idagi elektron zichligini kamaytiradi va ν(N–H) chastotasini <b className="text-rose-300">pasaytiradi</b>.
              Aksincha, C–N bog'i kuchayadi (N sp³ gibridlanishi o'zgaradi) va ν(C–N) <b className="text-emerald-300">ortadi</b>.
              Bu qarama-qarshi tendensiya koordinatsiyaning eng ishonchli spektroskopik belgisi.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-amber-900/40 text-amber-200">
                    <th className="px-3 py-2 text-left rounded-l-lg">Moda</th>
                    <th className="px-3 py-2 text-center">Erkin en (cm⁻¹)</th>
                    <th className="px-3 py-2 text-center">Kompleksda (cm⁻¹)</th>
                    <th className="px-3 py-2 text-center">Δν̃</th>
                    <th className="px-3 py-2 text-left rounded-r-lg">Sabab</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { m: "νₐₛ(N–H)", free: 3352, comp: 3230, reason: "N elektron jufti Co ga berildi → N–H zaiflashdi" },
                    { m: "νₛ(N–H)", free: 3280, comp: 3120, reason: "Xuddi shu sabab + vodorod bog'lanishi" },
                    { m: "δ(NH₂) qaychi", free: 1600, comp: 1602, reason: "Deyarli o'zgarmaydi — burchak modasi" },
                    { m: "ν(C–N)", free: 1095, comp: 1052, reason: "Halqa hosil bo'lishi bilan kinematik bog'lanish" },
                    { m: "ν(C–C)", free: 1035, comp: 1005, reason: "Gauche konformatsiyaga majburiy o'tish" },
                  ].map((r, i) => {
                    const d = r.comp - r.free
                    return (
                      <tr key={r.m} className={i % 2 === 0 ? "bg-slate-900/50" : "bg-slate-900/25"}>
                        <td className="px-3 py-2 font-mono font-bold text-amber-300">{r.m}</td>
                        <td className="px-3 py-2 text-center text-slate-300">{r.free}</td>
                        <td className="px-3 py-2 text-center font-bold text-emerald-300">{r.comp}</td>
                        <td className={`px-3 py-2 text-center font-bold ${d < 0 ? "text-rose-400" : "text-cyan-400"}`}>
                          {d > 0 ? "+" : ""}{d}
                        </td>
                        <td className="px-3 py-2 text-slate-400/90">{r.reason}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ══════════════ XELAT EFFEKTI TERMODINAMIKASI ══════════════ */}
        <section className="rounded-2xl bg-gradient-to-br from-rose-950/40 to-slate-950/60 border border-rose-700/40 p-6">
          <h3 className="text-xl font-bold text-rose-300 mb-1">⚖️ Xelat effekti — nima uchun en NH₃ dan kuchli?</h3>
          <p className="text-xs text-rose-200/70 mb-5">
            Schwarzenbach (1952) tushuntirishi: sabab enthalpiya emas, ENTROPIYA
          </p>

          <div className="overflow-x-auto mb-5">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-rose-900/50 text-rose-200">
                  <th className="px-3 py-2.5 text-left rounded-l-lg">Reaksiya</th>
                  <th className="px-3 py-2.5 text-center">log K</th>
                  <th className="px-3 py-2.5 text-center">ΔG° (kJ/mol)</th>
                  <th className="px-3 py-2.5 text-center">ΔH° (kJ/mol)</th>
                  <th className="px-3 py-2.5 text-center">ΔS° (J/mol·K)</th>
                  <th className="px-3 py-2.5 text-left rounded-r-lg">Turi</th>
                </tr>
              </thead>
              <tbody>
                {chelateEffect.map((c, i) => {
                  const isLast = i === chelateEffect.length - 1
                  return (
                    <tr
                      key={i}
                      className={isLast ? "bg-amber-900/30 border-t-2 border-amber-600/50" : (i % 2 === 0 ? "bg-slate-900/50" : "bg-slate-900/25")}
                    >
                      <td className={`px-3 py-2.5 font-mono ${isLast ? "font-bold text-amber-300" : "text-slate-200"}`}>
                        {c.reaction}
                      </td>
                      <td className="px-3 py-2.5 text-center font-bold text-cyan-300">{c.logK}</td>
                      <td className="px-3 py-2.5 text-center text-slate-300">{c.dG}</td>
                      <td className="px-3 py-2.5 text-center text-slate-300">{c.dH}</td>
                      <td className={`px-3 py-2.5 text-center font-bold ${isLast ? "text-amber-300" : "text-emerald-300"}`}>
                        {typeof c.dS === "number" && c.dS > 0 ? "+" : ""}{c.dS}
                      </td>
                      <td className={`px-3 py-2.5 ${isLast ? "font-bold text-amber-200" : "text-purple-300"}`}>
                        {c.type}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-900/60 border border-rose-700/30 p-4">
              <h4 className="text-sm font-bold text-rose-200 mb-2">Entropiya hisobi — zarralar soni</h4>
              <div className="space-y-2 text-xs">
                <div className="rounded-lg bg-slate-950/70 border border-slate-700/40 p-2.5">
                  <div className="text-slate-400 mb-1">Monodentat (NH₃):</div>
                  <div className="font-mono text-slate-200">[Co(H₂O)₆]³⁺ + 6NH₃ → [Co(NH₃)₆]³⁺ + 6H₂O</div>
                  <div className="text-rose-300 mt-1">7 zarra → 7 zarra (Δn = 0) → ΔS kichik (+44)</div>
                </div>
                <div className="rounded-lg bg-amber-950/40 border border-amber-600/40 p-2.5">
                  <div className="text-amber-400 mb-1">Xelat (en):</div>
                  <div className="font-mono text-amber-100">[Co(H₂O)₆]³⁺ + 3en → [Co(en)₃]³⁺ + 6H₂O</div>
                  <div className="text-emerald-300 mt-1">
                    4 zarra → 7 zarra (Δn = +3) → ΔS katta (+285) 🏆
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400/90 mt-3 leading-relaxed">
                Xelat reaksiyasida erkinlik darajasi ortadi: 3 ta en 6 ta H₂O ni siqib chiqaradi — sistemada zarralar
                soni 4 dan 7 ga ko'payadi. Termodinamikaning ikkinchi qonuniga ko'ra bu ΔS ni keskin oshiradi va
                ΔG° = ΔH° − TΔS° tenglamasidan ΔG° ni manfiylashtiradi.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900/60 border border-purple-700/30 p-4">
              <h4 className="text-sm font-bold text-purple-200 mb-3">Vizual taqqoslash — log β</h4>
              {[
                { label: "en (β₃)", val: 48.7, max: 50, color: "bg-gradient-to-r from-amber-500 to-orange-500" },
                { label: "NH₃ (β₆)", val: 35.2, max: 50, color: "bg-gradient-to-r from-purple-600 to-blue-600" },
                { label: "H₂O (β₆)", val: 0, max: 50, color: "bg-slate-600" },
              ].map((b) => (
                <div key={b.label} className="mb-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">{b.label}</span>
                    <b className="text-slate-100">{b.val}</b>
                  </div>
                  <div className="h-4 rounded-full bg-slate-950/80 overflow-hidden border border-slate-700/40">
                    <div
                      className={`h-full ${b.color} transition-all duration-500`}
                      style={{ width: `${Math.max(2, (b.val / b.max) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-3 rounded-lg bg-emerald-950/40 border border-emerald-700/30 p-2.5 text-[11px] text-emerald-200/90 leading-relaxed">
                <b>IQ bilan bog'liqlik:</b> yuqori log β₃ mustahkam Co–N bog'ini bildiradi, bu esa IQ da yuqori
                ν(Co–N) = 572 cm⁻¹ va katta k = 2.15 mdyn/Å ko'rinishida namoyon bo'ladi. Termodinamika va
                spektroskopiya bir-birini tasdiqlaydi.
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ INTERAKTIV SPEKTR ══════════════ */}
        <section className="rounded-2xl bg-slate-900/50 border border-purple-700/40 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xl font-bold text-purple-300">📊 Interaktiv IQ spektr</h3>
              <p className="text-xs text-purple-300/70">
                Lorentzian simulyatsiya • 4000–200 cm⁻¹ • KBr tabletka, 4 cm⁻¹ ruxsat
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-amber-300">{freqSlider} cm⁻¹</div>
              <div className="text-[11px] text-purple-300/70">
                Eng yaqin polosa: <b className="text-emerald-300">{nearestPeak.freq}</b> — {nearestPeak.assignment}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/70 border border-purple-800/40 p-4 mb-4 overflow-x-auto">
            <svg viewBox="0 0 940 320" className="w-full min-w-[700px]">
              <defs>
                <linearGradient id="zoneXH" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="zoneOrg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="zoneML" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.03" />
                </linearGradient>
              </defs>

              <rect x="0" y="20" width={((4000 - 2700) / 3800) * 900} height="260" fill="url(#zoneXH)" />
              <rect x={((4000 - 1700) / 3800) * 900} y="20" width={((1700 - 900) / 3800) * 900} height="260" fill="url(#zoneOrg)" />
              <rect x={((4000 - 700) / 3800) * 900} y="20" width={((700 - 200) / 3800) * 900} height="260" fill="url(#zoneML)" />

              {[4000, 3500, 3000, 2500, 2000, 1500, 1000, 500, 200].map((f) => {
                const x = ((4000 - f) / 3800) * 900
                return (
                  <g key={f}>
                    <line x1={x} y1="20" x2={x} y2="280" stroke="#475569" strokeWidth="0.5" strokeDasharray="3 3" />
                    <text x={x} y="298" fill="#94a3b8" fontSize="10" textAnchor="middle">{f}</text>
                  </g>
                )
              })}
              {[0, 25, 50, 75, 100].map((t) => {
                const yy = 280 - (t / 100) * 260
                return (
                  <g key={t}>
                    <line x1="0" y1={yy} x2="900" y2={yy} stroke="#475569" strokeWidth="0.5" strokeDasharray="3 3" />
                    <text x="908" y={yy + 3} fill="#94a3b8" fontSize="9">{t}</text>
                  </g>
                )
              })}

              <g transform="translate(0,20)">
                <path d={spectrumPath} fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinejoin="round" />
              </g>

              {irPeaks.map((p, i) => {
                const x = ((4000 - p.freq) / 3800) * 900
                const isActive = activePeak === i
                const isKey = [2960, 1052, 572, 408].includes(p.freq)
                return (
                  <g key={p.freq} onClick={() => { setActivePeak(i); setFreqSlider(p.freq) }} style={{ cursor: "pointer" }}>
                    <line
                      x1={x} y1="20" x2={x} y2="280"
                      stroke={isActive ? "#f43f5e" : isKey ? "#10b981" : "#64748b"}
                      strokeWidth={isActive ? 2 : isKey ? 1.4 : 0.7}
                      opacity={isActive ? 0.95 : isKey ? 0.75 : 0.35}
                    />
                    <circle
                      cx={x}
                      cy={20 + 260 - (p.T / 100) * 260}
                      r={isActive ? 5 : isKey ? 4 : 2.5}
                      fill={isActive ? "#f43f5e" : isKey ? "#10b981" : "#94a3b8"}
                    />
                    {(isKey || isActive) && (
                      <text x={x} y="14" fill={isActive ? "#f43f5e" : "#10b981"} fontSize="9" fontWeight="bold" textAnchor="middle">
                        {p.freq}
                      </text>
                    )}
                  </g>
                )
              })}

              <line
                x1={((4000 - freqSlider) / 3800) * 900} y1="20"
                x2={((4000 - freqSlider) / 3800) * 900} y2="280"
                stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5 3"
              />
              <text x="450" y="316" fill="#cbd5e1" fontSize="11" textAnchor="middle">To'lqin soni ν̃ (cm⁻¹)</text>
            </svg>

            <div className="flex flex-wrap gap-3 mt-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-500/40 border border-cyan-500/60" />
                X–H sohasi (4000–2700): ν(N–H), ν(C–H)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500/40 border border-purple-500/60" />
                Barmoq izi (1700–900): δ(NH₂), δ(CH₂), ν(C–N), ν(C–C)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-500/60" />
                M–L sohasi (700–200): ν(Co–N), xelat halqa
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                Kalit diagnostik polosalar
              </span>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="range" min="200" max="4000" step="1"
              value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-purple-400/70 mt-1">
              <span>200 cm⁻¹ (M–L)</span>
              <span>2000 cm⁻¹</span>
              <span>4000 cm⁻¹ (X–H)</span>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-purple-950/60 to-slate-950/70 border border-amber-700/40 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-3xl font-mono font-extrabold text-amber-300">
                  {nearestPeak.freq} <span className="text-base text-amber-500/70">cm⁻¹</span>
                </div>
                <div className="text-sm font-bold text-purple-200 mt-1">
                  {nearestPeak.assignment} — {nearestPeak.assignment_uz}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${intensityBadge(nearestPeak.intensityCode)}`}>
                  {nearestPeak.intensity}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/40 text-[11px] text-blue-300">
                  T = {nearestPeak.T}%
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/40 text-[11px] text-purple-300">
                  {nearestPeak.symmetry}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4 text-[11px]">
              {[
                { l: "Bog'", v: nearestPeak.bond },
                { l: "k (kuch konst.)", v: nearestPeak.forceConstant },
                { l: "Bog' uzunligi", v: nearestPeak.bondLength },
                { l: "Soha", v: nearestPeak.region },
              ].map((x) => (
                <div key={x.l} className="rounded-lg bg-slate-900/60 border border-purple-800/40 p-2.5">
                  <div className="text-[9px] uppercase text-purple-400/80">{x.l}</div>
                  <div className="text-slate-200 font-semibold mt-0.5">{x.v}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-3 mb-3 text-[11px]">
              <div className="rounded-lg bg-blue-950/40 border border-blue-700/30 p-3">
                <div className="text-blue-300 font-bold mb-1">Erkin ligand</div>
                <div className="text-slate-300">{nearestPeak.freeLigand}</div>
              </div>
              <div className="rounded-lg bg-rose-950/40 border border-rose-700/30 p-3">
                <div className="text-rose-300 font-bold mb-1">Koordinatsion siljish</div>
                <div className="text-slate-300">{nearestPeak.coordShift}</div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-950/70 border border-amber-700/30 p-3.5 mb-3">
              <div className="text-amber-300 font-bold text-xs mb-1.5">🔬 Nazariy izoh</div>
              <p className="text-xs text-slate-300/90 leading-relaxed">{nearestPeak.theoryNote}</p>
            </div>

            <div className="rounded-lg bg-emerald-950/40 border border-emerald-700/30 p-3">
              <span className="text-emerald-300 font-bold text-xs">Diagnostik ahamiyati: </span>
              <span className="text-xs text-emerald-100/90">{nearestPeak.diagnostic}</span>
            </div>
          </div>
        </section>

        {/* ══════════════ CHO'QQILAR JADVALI ══════════════ */}
        <section className="rounded-2xl bg-slate-900/50 border border-purple-700/40 p-6">
          <h3 className="text-xl font-bold text-purple-300 mb-1">
            📋 IQ cho'qqilarining to'liq jadvali — {irPeaks.length} polosa
          </h3>
          <p className="text-xs text-purple-300/70 mb-5">
            Har bir qatorni bosing — spektrda belgilanadi va yuqoridagi tafsilot kartasi yangilanadi
          </p>

          <div className="overflow-x-auto rounded-xl border border-purple-800/40">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-900/60 text-purple-100">
                  <th className="px-3 py-3 text-left">ν̃ (cm⁻¹)</th>
                  <th className="px-3 py-3 text-left">Belgilanish</th>
                  <th className="px-3 py-3 text-left">Bog'</th>
                  <th className="px-3 py-3 text-center">Intensivlik</th>
                  <th className="px-3 py-3 text-center">Simmetriya</th>
                  <th className="px-3 py-3 text-center">k (mdyn/Å)</th>
                  <th className="px-3 py-3 text-center">T (%)</th>
                  <th className="px-3 py-3 text-left">Diagnostika</th>
                </tr>
              </thead>
              <tbody>
                {irPeaks.map((p, i) => {
                  const isKey = [2960, 1052, 572, 408].includes(p.freq)
                  const isActive = activePeak === i
                  return (
                    <tr
                      key={p.freq}
                      onClick={() => { setActivePeak(i); setFreqSlider(p.freq) }}
                      className={`cursor-pointer transition ${
                        isActive
                          ? "bg-amber-900/40"
                          : isKey
                          ? "bg-emerald-950/35 hover:bg-emerald-900/40"
                          : i % 2 === 0
                          ? "bg-slate-900/40 hover:bg-purple-950/50"
                          : "bg-slate-900/20 hover:bg-purple-950/50"
                      }`}
                    >
                      <td className={`px-3 py-2.5 font-mono font-bold ${isKey ? "text-emerald-300" : "text-amber-300"}`}>
                        {isKey && "🔑 "}{p.freq}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-slate-100">{p.assignment}</div>
                        <div className="text-[10px] text-slate-400">{p.assignment_uz}</div>
                      </td>
                      <td className="px-3 py-2.5 text-slate-300">{p.bond}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded border text-[10px] ${intensityBadge(p.intensityCode)}`}>
                          {p.intensity}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center text-purple-300 text-[10px]">{p.symmetry}</td>
                      <td className="px-3 py-2.5 text-center text-slate-300">{p.forceConstant}</td>
                      <td className="px-3 py-2.5 text-center text-blue-300">{p.T}</td>
                      <td className="px-3 py-2.5 text-slate-400/90 text-[10px]">{p.diagnostic}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid sm:grid-cols-3 gap-3 text-[11px]">
            <div className="rounded-lg bg-cyan-950/40 border border-cyan-700/30 p-3">
              <div className="text-cyan-300 font-bold mb-1">X–H sohasi (4 polosa)</div>
              <div className="text-slate-300/90">
                3230, 3120 — ν(N–H); 2960, 2890 — ν(C–H). Oxirgi ikkisi organik ligandning bevosita isboti.
              </div>
            </div>
            <div className="rounded-lg bg-purple-950/40 border border-purple-700/30 p-3">
              <div className="text-purple-300 font-bold mb-1">Barmoq izi (9 polosa)</div>
              <div className="text-slate-300/90">
                1602 δ(NH₂), 1462 δ(CH₂), 1368/1282 τ(CH₂), 1155/1052 ν(C–N), 1005 ν(C–C), 888, 690.
              </div>
            </div>
            <div className="rounded-lg bg-amber-950/40 border border-amber-700/30 p-3">
              <div className="text-amber-300 font-bold mb-1">M–L sohasi (4 polosa)</div>
              <div className="text-slate-300/90">
                572, 505 — ν(Co–N); 408 — δ(N–Co–N) xelat halqa; 285 — halqa torsion. CsI oynasi kerak.
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ D₃ GURUH NAZARIYASI ══════════════ */}
        <section className="rounded-2xl bg-slate-900/50 border border-blue-700/40 p-6">
          <h3 className="text-xl font-bold text-blue-300 mb-1">🔷 D₃ guruh nazariyasi va tanlash qoidalari</h3>
          <p className="text-xs text-blue-200/70 mb-5">
            Inversiya markazi yo'q → mutual exclusion qoidasi ISHLAMAYDI → xirallik
          </p>

          <div className="grid lg:grid-cols-3 gap-4 mb-5">
            {[
              { l: "Nuqtaviy guruh", v: groupTheoryD3.pointGroup, c: "text-blue-300" },
              { l: "Guruh tartibi (h)", v: groupTheoryD3.order, c: "text-blue-300" },
              { l: "Simmetriya amallari", v: groupTheoryD3.operations, c: "text-purple-300" },
              { l: "Inversiya markazi", v: groupTheoryD3.inversion, c: "text-rose-300" },
              { l: "Skelet modalari", v: groupTheoryD3.skeletonModes, c: "text-amber-300" },
              { l: "Mutual exclusion", v: groupTheoryD3.mutualExclusion, c: "text-rose-300" },
            ].map((x) => (
              <div key={x.l} className="rounded-xl bg-slate-950/60 border border-blue-800/40 p-3.5">
                <div className="text-[10px] uppercase tracking-wide text-blue-400/80 mb-1">{x.l}</div>
                <div className={`text-sm font-bold ${x.c}`}>{x.v}</div>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-blue-800/40 mb-5">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900/60 text-blue-100">
                  <th className="px-3 py-2.5 text-left">Qaytarilmas tasvir</th>
                  <th className="px-3 py-2.5 text-center">Karrali</th>
                  <th className="px-3 py-2.5 text-center">IQ faolligi</th>
                  <th className="px-3 py-2.5 text-center">Raman faolligi</th>
                  <th className="px-3 py-2.5 text-center">Bazis funksiyalar</th>
                  <th className="px-3 py-2.5 text-left">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {groupTheoryD3.irreps.map((r, i) => (
                  <tr key={r.symbol} className={i % 2 === 0 ? "bg-slate-900/45" : "bg-slate-900/20"}>
                    <td className="px-3 py-2.5 font-mono font-bold text-blue-300 text-sm">{r.symbol}</td>
                    <td className="px-3 py-2.5 text-center text-slate-300">{r.degeneracy}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded border text-[10px] ${
                        r.ir.startsWith("Faol")
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-slate-600/20 text-slate-400 border-slate-500/40"
                      }`}>
                        {r.ir}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded border text-[10px] bg-purple-500/20 text-purple-300 border-purple-500/40">
                        {r.raman}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center font-mono text-amber-300 text-[11px]">{r.basis}</td>
                    <td className="px-3 py-2.5 text-slate-400/90">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-emerald-950/35 border border-emerald-700/40 p-4">
              <h4 className="text-sm font-bold text-emerald-300 mb-2">IQ va Raman komplementarligi</h4>
              <div className="space-y-1.5 text-xs text-slate-300/90">
                <div>
                  <b className="text-emerald-200">IQ faol:</b> {groupTheoryD3.irActive}
                </div>
                <div>
                  <b className="text-purple-200">Raman faol:</b> {groupTheoryD3.ramanActive}
                </div>
              </div>
              <p className="text-[11px] text-slate-400/90 mt-3 leading-relaxed">
                D₃ da inversiya markazi bo'lmaganligi uchun E va A₂ modalari IQ va Raman spektrlarida bir vaqtda
                kuzatiladi. Bu [Co(NH₃)₆]³⁺ (Oₕ) dan tub farq: u yerda gerade/ungerade ajratish tufayli hech bir
                moda ikkala spektrda ham faol bo'lolmaydi (mutual exclusion). Amaliy natija: bu kompleksda IQ va
                Raman bir-birini takrorlaydi, lekin intensivliklari boshqacha bo'ladi.
              </p>
            </div>

            <div className="rounded-xl bg-rose-950/35 border border-rose-700/40 p-4">
              <h4 className="text-sm font-bold text-rose-300 mb-2">Xirallik simmetriya sharti</h4>
              <p className="text-xs text-slate-300/90 leading-relaxed mb-3">
                Molekula xiral bo'lishi uchun undagi <b className="text-rose-200">Sₙ (aylanma-aks ettirish) o'qlari
                bo'lmasligi</b> kerak. D₃ guruhida faqat E, 2C₃ va 3C₂ bor — σ tekislik ham, i markaz ham, S₄ ham yo'q.
                Shuning uchun {"[Co(en)₃]³⁺"} ikkita ko'zguga aks ettirilgan, ustma-ust tushmaydigan
                enantiomerga (Δ va Λ) ega.
              </p>
              <div className="rounded-lg bg-slate-950/70 border border-rose-700/30 p-3 text-[11px] text-rose-100/90">
                <b className="text-rose-300">Muhim ogohlantirish:</b> IQ spektroskopiyasi Δ va Λ enantiomerlarni
                <b> ajrata olmaydi</b> — ularning tebranish chastotalari va intensivliklari aynan bir xil. Optik
                izomerlarni farqlash uchun sirkulyar dixroizm (CD), ORD yoki VCD (vibratsion CD) kerak bo'ladi.
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ OPTIK IZOMERIYA Δ/Λ ══════════════ */}
        <section className="rounded-2xl bg-gradient-to-br from-cyan-950/35 via-slate-950/60 to-rose-950/35 border border-cyan-700/40 p-6">
          <h3 className="text-xl font-bold text-cyan-300 mb-1">🌀 Δ / Λ optik izomeriya — Werner Nobel mukofoti asosi</h3>
          <p className="text-xs text-cyan-200/70 mb-5">
            1911-yil Alfred Werner {"[Co(en)₃]³⁺"} ni enantiomerlarga ajratdi va koordinatsion nazariyani isbotladi
            (Nobel mukofoti, 1913)
          </p>

          <div className="flex gap-2 mb-4">
            {opticalIsomers.map((iso, i) => (
              <button
                key={iso.symbol}
                onClick={() => setActiveIsomer(i)}
                className={`flex-1 px-4 py-3 rounded-xl border font-bold transition ${
                  activeIsomer === i
                    ? `${iso.bgColor} ${iso.borderColor} ${iso.color} shadow-lg`
                    : "bg-slate-900/40 border-slate-700/40 text-slate-400 hover:bg-slate-800/50"
                }`}
              >
                <span className="text-2xl mr-2">{iso.symbol}</span>
                <span className="text-sm">{iso.symbol === "Δ" ? "delta (+)" : "lambda (−)"}</span>
              </button>
            ))}
          </div>

          <div className={`rounded-xl border p-5 ${opticalIsomers[activeIsomer].bgColor} ${opticalIsomers[activeIsomer].borderColor}`}>
            <h4 className={`text-lg font-bold mb-3 ${opticalIsomers[activeIsomer].color}`}>
              {opticalIsomers[activeIsomer].name}
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 text-xs mb-4">
              <div className="rounded-lg bg-slate-950/60 border border-slate-700/40 p-3">
                <div className="text-[10px] uppercase text-slate-400 mb-1">Solishtirma burilish</div>
                <div className="font-mono font-bold text-slate-100">{opticalIsomers[activeIsomer].rotation}</div>
              </div>
              <div className="rounded-lg bg-slate-950/60 border border-slate-700/40 p-3">
                <div className="text-[10px] uppercase text-slate-400 mb-1">Sirkulyar dixroizm</div>
                <div className="font-semibold text-slate-100">{opticalIsomers[activeIsomer].cd}</div>
              </div>
            </div>
            <div className="rounded-lg bg-slate-950/60 border border-slate-700/40 p-3 mb-3">
              <div className="text-[10px] uppercase text-slate-400 mb-1">Konfiguratsiya ta'rifi</div>
              <div className="text-xs text-slate-200">{opticalIsomers[activeIsomer].descriptor}</div>
            </div>
            <div className="rounded-lg bg-amber-950/40 border border-amber-700/40 p-3 mb-3">
              <div className="text-amber-300 font-bold text-xs mb-1">⚠️ IQ nuqtai nazaridan</div>
              <div className="text-xs text-amber-100/90">{opticalIsomers[activeIsomer].irNote}</div>
            </div>
            <div className="rounded-lg bg-slate-950/60 border border-emerald-700/30 p-3">
              <div className="text-emerald-300 font-bold text-xs mb-1">Ajratish usuli</div>
              <div className="text-xs text-slate-200">{opticalIsomers[activeIsomer].resolution}</div>
            </div>
          </div>

          <div className="mt-5 grid md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl bg-slate-900/60 border border-purple-700/30 p-4">
              <div className="text-purple-300 font-bold mb-2">Werner tajribasi (1911)</div>
              <p className="text-slate-300/90 leading-relaxed">
                Rasemik {"[Co(en)₃]Cl₃"} ni kumush d-bromkamforsulfonat bilan ishlangan — diastereomer tuzlar hosil
                bo'lgan va eruvchanligi turlicha bo'lgani uchun kristallanish yo'li bilan ajratilgan. Bu koordinatsion
                birikmalarning oktaedrik tuzilishini isbotlagan hal qiluvchi tajriba.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/60 border border-blue-700/30 p-4">
              <div className="text-blue-300 font-bold mb-2">Nima uchun aynan bu kompleks?</div>
              <p className="text-slate-300/90 leading-relaxed">
                Uchta bir xil bidentat ligand oktaedr atrofida propeller shaklida joylashadi. Bu joylashuv o'ng yoki
                chap vintli bo'lishi mumkin — boshqa varianti yo'q. Monodentat NH₃ komplekslarida bunday propeller
                hosil bo'lmaydi, shuning uchun ular xiral emas.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/60 border border-emerald-700/30 p-4">
              <div className="text-emerald-300 font-bold mb-2">Rasemizatsiya barqarorligi</div>
              <p className="text-slate-300/90 leading-relaxed">
                Co(III) d⁶ past spinli — kinetik inert. Shuning uchun ajratilgan enantiomerlar xona haroratida
                oylab barqaror qoladi. Bu Werner tajribasining muvaffaqiyati sababi: labil metall (masalan Ni(II))
                bilan ajratish mumkin bo'lmasdi.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════ lel/ob KONFORMERLAR ══════════════ */}
        <section className="rounded-2xl bg-slate-900/50 border border-emerald-700/40 p-6">
          <h3 className="text-xl font-bold text-emerald-300 mb-1">🔄 lel / ob konformatsion izomeriya</h3>
          <p className="text-xs text-emerald-200/70 mb-5">
            Corey & Bailar (1959) nazariyasi — xelat halqadagi CH₂–CH₂ ko'prigining gauche buralishi
          </p>

          <div className="rounded-xl bg-slate-950/60 border border-emerald-800/40 p-4 mb-5">
            <p className="text-xs text-slate-300/90 leading-relaxed">
              Beshhalqali xelat halqa tekis emas — CH₂–CH₂ ko'prigi <b className="text-emerald-300">gauche</b>{" "}
              konformatsiyada buraladi (torsion burchak ≈ ±50°). Har bir halqa ikki xil holatda bo'lishi mumkin:
              C–C o'qi molekulaning C₃ asosiy o'qiga <b className="text-cyan-300">parallel (lel)</b> yoki{" "}
              <b className="text-amber-300">qiya (ob, oblique)</b>. Uchta halqa uchun 4 ta kombinatsiya mavjud.
              Konformerlar orasidagi energiya farqi kichik (&lt; 4 kJ/mol), shuning uchun xona haroratida ular
              muvozanatda birga mavjud — bu IQ polosalarining kengayishiga olib keladi.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {conformers.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActiveConformer(i)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition ${
                  activeConformer === i
                    ? "bg-emerald-900/50 border-emerald-500/50 text-emerald-200 shadow-lg"
                    : "bg-slate-900/40 border-slate-700/40 text-slate-400 hover:bg-slate-800/50"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mb-5">
            <div className="rounded-xl bg-emerald-950/35 border border-emerald-700/40 p-5">
              <h4 className="text-lg font-bold text-emerald-300 mb-3">{conformers[activeConformer].name}</h4>
              <div className="space-y-2.5 text-xs">
                {[
                  { l: "Tavsif", v: conformers[activeConformer].desc },
                  { l: "Nisbiy energiya", v: conformers[activeConformer].energy },
                  { l: "Populyatsiya (298 K)", v: conformers[activeConformer].population },
                  { l: "Xarakterli IQ polosa", v: conformers[activeConformer].irShift },
                  { l: "Etimologiya", v: conformers[activeConformer].note },
                ].map((x) => (
                  <div key={x.l} className="rounded-lg bg-slate-950/60 border border-slate-700/40 p-2.5">
                    <div className="text-[10px] uppercase text-emerald-400/80 mb-0.5">{x.l}</div>
                    <div className="text-slate-200">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/60 border border-purple-700/40 p-5">
              <h4 className="text-sm font-bold text-purple-200 mb-4">Konformerlar taqsimoti (Boltzmann, 298 K)</h4>
              {conformers.map((c, i) => {
                const pct = parseInt(c.population.replace(/[^0-9]/g, ""), 10)
                return (
                  <div key={c.name} className="mb-3">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className={activeConformer === i ? "text-emerald-300 font-bold" : "text-slate-300"}>
                        {c.name} <span className="text-slate-500">({c.energy})</span>
                      </span>
                      <b className="text-slate-100">{c.population}</b>
                    </div>
                    <div className="h-4 rounded-full bg-slate-950/80 overflow-hidden border border-slate-700/40">
                      <div
                        className={`h-full transition-all duration-500 ${
                          activeConformer === i
                            ? "bg-gradient-to-r from-emerald-400 to-cyan-500"
                            : "bg-gradient-to-r from-purple-700 to-blue-700"
                        }`}
                        style={{ width: `${Math.max(2, pct * 2)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              <div className="mt-3 rounded-lg bg-blue-950/40 border border-blue-700/30 p-3 text-[11px] text-blue-100/90 leading-relaxed">
                <b className="text-blue-300">IQ dagi ko'rinishi:</b> τ(CH₂) burash modasi 1275–1285 cm⁻¹ oralig'ida
                to'rt xil konformer uchun biroz turlicha chastotaga ega. Xona haroratida ular qo'shilib bitta keng
                polosa beradi. 77 K (suyuq azot) da o'lchansa, polosa bir necha komponentga ajraladi — bu
                konformatsion muvozanatning bevosita spektroskopik isboti.
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ en vs NH₃ TAQQOSLASH ══════════════ */}
        <section className="rounded-2xl bg-slate-900/50 border border-amber-700/40 p-6">
          <h3 className="text-xl font-bold text-amber-300 mb-1">
            ⚔️ Xelat (en) va monodentat (NH₃) to'liq taqqoslash
          </h3>
          <p className="text-xs text-amber-200/70 mb-5">
            {"[Co(en)₃]³⁺"} va {"[Co(NH₃)₆]³⁺"} — bir xil CoN₆ donor to'plami, tubdan farqli xossalar
          </p>

          <div className="overflow-x-auto rounded-xl border border-amber-800/40">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-amber-900/50 text-amber-100">
                  <th className="px-3 py-3 text-left">Parametr</th>
                  <th className="px-3 py-3 text-center">{"[Co(en)₃]³⁺"} — xelat</th>
                  <th className="px-3 py-3 text-center">{"[Co(NH₃)₆]³⁺"} — monodentat</th>
                  <th className="px-3 py-3 text-center">Ustunlik</th>
                </tr>
              </thead>
              <tbody>
                {enVsNH3.map((r, i) => (
                  <tr key={r.param} className={i % 2 === 0 ? "bg-slate-900/45" : "bg-slate-900/20"}>
                    <td className="px-3 py-2.5 font-semibold text-slate-200">{r.param}</td>
                    <td className="px-3 py-2.5 text-center font-mono text-amber-300">{r.en}</td>
                    <td className="px-3 py-2.5 text-center font-mono text-purple-300">{r.nh3}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                        r.winner === "en"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : r.winner === "≈"
                          ? "bg-slate-600/20 text-slate-400 border-slate-500/40"
                          : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                      }`}>
                        {r.winner === "en" ? "🏆 en" : r.winner}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-amber-950/30 border border-amber-700/40 p-4">
              <div className="text-amber-300 font-bold mb-2">Spektroskopik xulosalar</div>
              <ul className="space-y-1.5 text-slate-300/90">
                <li>▸ ν(Co–N) +69 cm⁻¹ ga yuqori — halqa qattiqligi va kinematik bog'lanish natijasi</li>
                <li>▸ C–H va C–N/C–C polosalari qo'shimcha — organik ligandning to'g'ridan-to'g'ri belgisi</li>
                <li>▸ Xelat halqa modalari (408, 285 cm⁻¹) ammin komplekslarda printsipial jihatdan yo'q</li>
                <li>▸ ν(N–H) pastroq (3230 va 3300) — NH₂ va NH₃ elektron muhitidagi farq</li>
              </ul>
            </div>
            <div className="rounded-xl bg-purple-950/30 border border-purple-700/40 p-4">
              <div className="text-purple-300 font-bold mb-2">Strukturaviy xulosalar</div>
              <ul className="space-y-1.5 text-slate-300/90">
                <li>▸ Simmetriya Oₕ (h = 48) dan D₃ (h = 6) ga tushadi — tanlash qoidalari yumshaydi</li>
                <li>▸ Inversiya markazi yo'qoladi → mutual exclusion ishlamaydi → xirallik paydo bo'ladi</li>
                <li>▸ Bite angle 85.4° &lt; 90° — oktaedr trigonal buraladi (trigonal twist)</li>
                <li>▸ Δₒ biroz yuqori (23 200 vs 22 900) — en spektrokimyoviy qatorda NH₃ dan kuchliroq</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ══════════════ KUCH KONSTANTASI ══════════════ */}
        <section className="rounded-2xl bg-slate-900/50 border border-orange-700/40 p-6">
          <h3 className="text-xl font-bold text-orange-300 mb-1">🔧 Kuch konstantasi va Hooke qonuni tahlili</h3>
          <p className="text-xs text-orange-200/70 mb-5">
            k qiymati bog'ning mustahkamligini bevosita o'lchaydi — xelat effektining kvantitativ ifodasi
          </p>

          <div className="overflow-x-auto rounded-xl border border-orange-800/40 mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-orange-900/50 text-orange-100">
                  <th className="px-3 py-3 text-left">Bog'</th>
                  <th className="px-3 py-3 text-center">k (mdyn/Å)</th>
                  <th className="px-3 py-3 text-center">ν̃ (cm⁻¹)</th>
                  <th className="px-3 py-3 text-left">Mustahkamlik</th>
                  <th className="px-3 py-3 text-left">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {forceConstantExamples.map((f, i) => {
                  const isThis = f.bond.includes("bu kompleks")
                  return (
                    <tr
                      key={f.bond}
                      className={isThis ? "bg-amber-900/35 border-y border-amber-600/40" : (i % 2 === 0 ? "bg-slate-900/45" : "bg-slate-900/20")}
                    >
                      <td className={`px-3 py-2.5 font-semibold ${isThis ? "text-amber-200" : "text-slate-200"}`}>
                        {f.bond}
                      </td>
                      <td className={`px-3 py-2.5 text-center font-mono font-bold ${isThis ? "text-amber-300" : "text-orange-300"}`}>
                        {f.k.toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono text-slate-300">{f.freq}</td>
                      <td className="px-3 py-2.5">
                        <div className="h-2.5 rounded-full bg-slate-950/80 overflow-hidden border border-slate-700/40 min-w-[80px]">
                          <div
                            className={`h-full ${isThis ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-purple-600 to-blue-600"}`}
                            style={{ width: `${(f.k / 6.5) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400/90 text-[11px]">{f.note}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-slate-950/60 border border-orange-700/30 p-4">
              <div className="text-orange-300 font-bold mb-2">Co–N kuch konstantasi hisobi</div>
              <div className="space-y-2 font-mono text-[11px] text-slate-300">
                <div>μ(Co–N) = (58.93 × 14.01)/(58.93 + 14.01) = 11.32 a.m.b.</div>
                <div>μ = 11.32 × 1.6605 × 10⁻²⁷ = 1.880 × 10⁻²⁶ kg</div>
                <div>ν̃ = 572 cm⁻¹ → ν = 572 × 2.998 × 10¹⁰ = 1.715 × 10¹³ Hz</div>
                <div>k = 4π²ν²μ = 4π² × (1.715×10¹³)² × 1.880×10⁻²⁶</div>
                <div className="text-amber-300 font-bold">k = 218 N/m = 2.18 mdyn/Å ✓</div>
              </div>
              <p className="text-[11px] text-slate-400/90 mt-3 leading-relaxed">
                Hisoblangan qiymat (2.18) tajribaviy normal koordinata tahlilidan olingan 2.15 mdyn/Å bilan yaxshi
                mos keladi. Kichik farq — sof ikki atomli yaqinlashuvning cheklovi: real molekulada Co–N modasi
                xelat halqa modalari bilan kinematik bog'langan.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/60 border border-emerald-700/30 p-4">
              <div className="text-emerald-300 font-bold mb-2">Xelat effektining kvantitativ o'lchami</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center rounded-lg bg-purple-950/40 border border-purple-700/30 px-3 py-2">
                  <span className="text-slate-300">k(Co–N), NH₃ kompleks</span>
                  <b className="text-purple-300">1.85 mdyn/Å</b>
                </div>
                <div className="flex justify-between items-center rounded-lg bg-amber-950/40 border border-amber-600/40 px-3 py-2">
                  <span className="text-amber-200">k(Co–N), en xelat</span>
                  <b className="text-amber-300">2.15 mdyn/Å</b>
                </div>
                <div className="flex justify-between items-center rounded-lg bg-emerald-950/40 border border-emerald-600/40 px-3 py-2">
                  <span className="text-emerald-200">Farq (xelat hissasi)</span>
                  <b className="text-emerald-300">+0.30 (+16.2%)</b>
                </div>
              </div>
              <p className="text-[11px] text-slate-400/90 mt-3 leading-relaxed">
                Bu 16% ortish — xelat halqaning Co–N bog'ini mustahkamlashi. Sabab ikki qismli: (1) halqa yopilishi
                natijasida N atomining metalldan uzoqlashishi cheklanadi (entropik «tutib turish»); (2) halqadagi
                N–C–C–N skeleti orqali qo'shimcha mexanik qattiqlik uzatiladi.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════ WERNER QATORI ══════════════ */}
        <section className="rounded-2xl bg-slate-900/50 border border-purple-700/40 p-6">
          <h3 className="text-xl font-bold text-purple-300 mb-1">🧬 Werner koordinatsion qatori</h3>
          <p className="text-xs text-purple-300/70 mb-5">
            Kobalt(III) komplekslarining IQ va o'tkazuvchanlik bo'yicha taqqoslanishi
          </p>

          <div className="overflow-x-auto rounded-xl border border-purple-800/40">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-900/60 text-purple-100">
                  <th className="px-3 py-3 text-left">Kompleks</th>
                  <th className="px-3 py-3 text-left">Ligandlar</th>
                  <th className="px-3 py-3 text-center">Simmetriya</th>
                  <th className="px-3 py-3 text-center">ν(Co–N), cm⁻¹</th>
                  <th className="px-3 py-3 text-center">Xirallik</th>
                  <th className="px-3 py-3 text-center">AgNO₃ bilan cho'kma</th>
                </tr>
              </thead>
              <tbody>
                {wernerSeries.map((w, i) => (
                  <tr
                    key={w.formula}
                    className={w.current ? "bg-amber-900/35 border-y-2 border-amber-600/50" : (i % 2 === 0 ? "bg-slate-900/45" : "bg-slate-900/20")}
                  >
                    <td className={`px-3 py-2.5 font-mono font-bold ${w.current ? "text-amber-300" : "text-slate-200"}`}>
                      {w.current && "▶ "}{w.formula}
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">{w.ligand}</td>
                    <td className="px-3 py-2.5 text-center font-mono text-blue-300">{w.sym}</td>
                    <td className={`px-3 py-2.5 text-center font-mono ${w.current ? "text-amber-300 font-bold" : "text-orange-300"}`}>
                      {w.nuCoN}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded border text-[10px] ${
                        w.chiral.includes("HA")
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-slate-600/20 text-slate-400 border-slate-500/40"
                      }`}>
                        {w.chiral}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center font-bold text-cyan-300">{w.agCl} AgCl</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-xl bg-blue-950/35 border border-blue-700/40 p-4 text-xs text-slate-300/90 leading-relaxed">
            <b className="text-blue-300">Qatordan ko'rinadigan qonuniyat:</b> monodentat ligandli komplekslarda
            ν(Co–N) 498–503 cm⁻¹ oralig'ida barqaror qoladi, xelat ligandga o'tilganda esa keskin 570 cm⁻¹ ga
            ko'tariladi. Bu sakrash koordinatsion sonining o'zgarishi bilan emas (ikkalasida ham CoN₆), balki aynan
            halqa hosil bo'lishi bilan bog'liq. Shu bilan birga AgNO₃ testi tashqi sferadagi Cl⁻ sonini beradi:
            {" "}{"[Co(en)₃]Cl₃"} da uchala xlorid ham ionli — 3 mol AgCl cho'kadi, bu 1:3 elektrolit ekanligini
            (Λₘ ≈ 400 S·cm²/mol) tasdiqlaydi.
          </div>
        </section>

        {/* ══════════════ NAMUNA TAYYORLASH ══════════════ */}
        <section className="rounded-2xl bg-slate-900/50 border border-cyan-700/40 p-6">
          <h3 className="text-xl font-bold text-cyan-300 mb-1">🧪 Namuna tayyorlash usullari</h3>
          <p className="text-xs text-cyan-200/70 mb-5">
            Bu kompleks uchun usul tanlash kritik — Nujol organik ligand polosalarini yo'q qiladi
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {techniques.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition ${
                  activeTechnique === i
                    ? "bg-cyan-900/50 border-cyan-500/50 text-cyan-200 shadow-lg"
                    : "bg-slate-900/40 border-slate-700/40 text-slate-400 hover:bg-slate-800/50"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="rounded-xl bg-slate-950/60 border border-cyan-700/40 p-5">
            <h4 className="text-lg font-bold text-cyan-300 mb-2">{techniques[activeTechnique].name}</h4>
            <p className="text-xs text-slate-300/90 leading-relaxed mb-4">
              {techniques[activeTechnique].description}
            </p>

            <div className="grid sm:grid-cols-3 gap-2.5 mb-4 text-[11px]">
              {[
                { l: "Chastota sohasi", v: techniques[activeTechnique].freqRange },
                { l: "Ruxsat (resolution)", v: techniques[activeTechnique].resolution },
                { l: "Tayyorlash vaqti", v: techniques[activeTechnique].samplePrep },
              ].map((x) => (
                <div key={x.l} className="rounded-lg bg-slate-900/70 border border-cyan-800/40 p-2.5">
                  <div className="text-[9px] uppercase text-cyan-400/80">{x.l}</div>
                  <div className="text-slate-200 font-semibold mt-0.5">{x.v}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg bg-emerald-950/35 border border-emerald-700/40 p-3.5">
                <div className="text-emerald-300 font-bold text-xs mb-2">✓ Afzalliklari</div>
                <ul className="space-y-1.5 text-[11px] text-slate-300/90">
                  {techniques[activeTechnique].advantages.map((a, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-rose-950/35 border border-rose-700/40 p-3.5">
                <div className="text-rose-300 font-bold text-xs mb-2">✕ Kamchiliklari</div>
                <ul className="space-y-1.5 text-[11px] text-slate-300/90">
                  {techniques[activeTechnique].disadvantages.map((d, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-rose-400 shrink-0">✕</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg bg-amber-950/40 border border-amber-700/40 p-3">
              <span className="text-amber-300 font-bold text-xs">Eng mos qo'llanish: </span>
              <span className="text-xs text-amber-100/90">{techniques[activeTechnique].bestFor}</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-950/60 border border-purple-700/30 p-4">
            <div className="text-purple-300 font-bold text-sm mb-3">Laboratoriya tartibi (KBr tabletka)</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-[11px]">
              {[
                { n: 1, t: "KBr ni quritish", d: "Spektroskopik KBr ni 110 °C da 2 soat quritib, eksikatorda sovutish (P₂O₅ ustida)." },
                { n: 2, t: "Namunani tortish", d: "1.0 mg [Co(en)₃]Cl₃ + 200 mg KBr (1:200 nisbat). Analitik tarozida 0.1 mg aniqlikda." },
                { n: 3, t: "Agat hovonchada ezish", d: "2–3 daqiqa aylanma harakat bilan. Zarra o'lchami < 2 µm bo'lishi kerak (Christiansen effektini oldini olish)." },
                { n: 4, t: "Press", d: "13 mm matritsa, 8–10 ton bosim, 2 daqiqa vakuum ostida. Shaffof tabletka olinadi." },
                { n: 5, t: "Fon spektri", d: "Bo'sh kanal yoki toza KBr tabletkasi bilan background olish. N₂ purge 10 daqiqa." },
                { n: 6, t: "O'lchash", d: "4000–400 cm⁻¹, 4 cm⁻¹ ruxsat, 32 skan. Xelat torsioni uchun CsI bilan 200 cm⁻¹ gacha takrorlash." },
              ].map((s) => (
                <div key={s.n} className="rounded-lg bg-slate-900/60 border border-purple-800/40 p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-purple-500/25 border border-purple-400/50 flex items-center justify-center text-[10px] font-bold text-purple-300">
                      {s.n}
                    </span>
                    <b className="text-purple-200">{s.t}</b>
                  </div>
                  <p className="text-slate-400/90 leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ HALAQIT OMILLARI ══════════════ */}
        <section className="rounded-2xl bg-slate-900/50 border border-rose-700/40 p-6">
          <h3 className="text-xl font-bold text-rose-300 mb-1">⚠️ Halaqit beruvchi omillar va yechimlar</h3>
          <p className="text-xs text-rose-200/70 mb-5">
            Har bir omilni bosing — batafsil ta'sir mexanizmi va bartaraf etish usuli ko'rsatiladi
          </p>

          <div className="grid md:grid-cols-4 gap-2 mb-4">
            {interferences.map((f, i) => (
              <button
                key={f.source}
                onClick={() => setActiveInterference(i)}
                className={`px-3 py-2.5 rounded-xl border text-[11px] font-semibold text-left transition ${
                  activeInterference === i
                    ? "bg-rose-900/50 border-rose-500/50 text-rose-200"
                    : "bg-slate-900/40 border-slate-700/40 text-slate-400 hover:bg-slate-800/50"
                }`}
              >
                {f.source}
              </button>
            ))}
          </div>

          <div className="rounded-xl bg-slate-950/60 border border-rose-700/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h4 className="text-base font-bold text-rose-300">{interferences[activeInterference].source}</h4>
              <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
                interferences[activeInterference].severity === "Yuqori"
                  ? "bg-red-500/20 text-red-300 border-red-500/40"
                  : interferences[activeInterference].severity === "O'rta"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              }`}>
                Xavflilik: {interferences[activeInterference].severity}
              </span>
            </div>

            <div className="rounded-lg bg-slate-900/70 border border-slate-700/40 p-3 mb-3 text-xs">
              <div className="text-[10px] uppercase text-slate-400 mb-1">Ta'sir sohasi (cm⁻¹)</div>
              <div className="font-mono font-bold text-amber-300">{interferences[activeInterference].freqRange}</div>
            </div>

            <div className="rounded-lg bg-rose-950/40 border border-rose-700/30 p-3.5 mb-3">
              <div className="text-rose-300 font-bold text-xs mb-1.5">Ta'sir mexanizmi</div>
              <p className="text-xs text-slate-300/90 leading-relaxed">{interferences[activeInterference].effect}</p>
            </div>

            <div className="rounded-lg bg-emerald-950/40 border border-emerald-700/30 p-3.5">
              <div className="text-emerald-300 font-bold text-xs mb-1.5">Bartaraf etish</div>
              <p className="text-xs text-emerald-100/90 leading-relaxed">{interferences[activeInterference].solution}</p>
            </div>
          </div>
        </section>

        {/* ══════════════ XULOSALAR ══════════════ */}
        <section className="rounded-2xl bg-gradient-to-br from-amber-950/40 via-purple-950/50 to-slate-950/60 border border-amber-700/40 p-6">
          <h3 className="text-xl font-bold text-amber-300 mb-1">📌 Asosiy ilmiy xulosalar</h3>
          <p className="text-xs text-amber-200/70 mb-5">
            {"[Co(en)₃]Cl₃"} ning IQ spektroskopik tahlilidan kelib chiqadigan sakkizta tezis
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            {[
              {
                n: 1,
                t: "Organik ligand bevosita isbotlanadi",
                d: "2960 va 2890 cm⁻¹ dagi ν(C–H) polosalari hamda 1052/1005 cm⁻¹ dagi ν(C–N)/ν(C–C) polosalari etilendiaminning mavjudligini shubhasiz ko'rsatadi. Ammin komplekslarida bu sohalar mutlaqo bo'sh.",
              },
              {
                n: 2,
                t: "Xelat effekti spektroskopik o'lchanadi",
                d: "ν(Co–N) 503 → 572 cm⁻¹ (+69 cm⁻¹) siljishi va k 1.85 → 2.15 mdyn/Å (+16.2%) ortishi xelat halqaning Co–N bog'ini mustahkamlashini kvantitativ isbotlaydi.",
              },
              {
                n: 3,
                t: "Xelat halqa modalari — noyob barmoq izi",
                d: "408 cm⁻¹ dagi δ(N–Co–N) halqa deformatsiyasi va 285 cm⁻¹ dagi halqa torsioni faqat yopiq xelat halqada mumkin. Bu ikki polosa bidentat koordinatsiyaning to'g'ridan-to'g'ri dalili.",
              },
              {
                n: 4,
                t: "Simmetriya Oₕ → D₃ ga pasayadi",
                d: "Guruh tartibi 48 dan 6 ga tushadi, inversiya markazi yo'qoladi. Natijada mutual exclusion qoidasi ishlamaydi va bir xil modalar IQ hamda Raman spektrlarida bir vaqtda faol bo'ladi.",
              },
              {
                n: 5,
                t: "Xirallik simmetriyadan kelib chiqadi",
                d: "D₃ guruhida Sₙ o'qlari yo'qligi molekulani xiral qiladi — Δ va Λ enantiomerlar mavjud. Bu Werner ning 1911-yildagi ajratish tajribasi va 1913-yilgi Nobel mukofotining asosi.",
              },
              {
                n: 6,
                t: "IQ enantiomerlarni ajrata olmaydi",
                d: "Δ va Λ ning tebranish spektrlari aynan bir xil. Optik izomerlarni farqlash uchun CD, ORD yoki VCD kerak. Bu — IQ usulining printsipial cheklovi, kamchiligi emas.",
              },
              {
                n: 7,
                t: "Konformatsion muvozanat polosalarni kengaytiradi",
                d: "lel₃ / lel₂ob / lelob₂ / ob₃ konformerlari 298 K da birga mavjud (45/35/15/5%). τ(CH₂) 1275–1285 cm⁻¹ polosasi shu sababli keng. 77 K da o'lchash komponentlarni ajratadi.",
              },
              {
                n: 8,
                t: "Namuna tayyorlashda Nujol taqiqlanadi",
                d: "Nujolning C–H polosalari (2920, 2850, 1460) etilendiaminning eng muhim diagnostik polosalarini to'liq qoplaydi. Faqat KBr (asosiy) yoki CsI (xelat torsioni uchun) ishlatilishi kerak.",
              },
            ].map((c) => (
              <div key={c.n} className="rounded-xl bg-slate-950/60 border border-amber-800/40 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-amber-500/25 border border-amber-400/50 flex items-center justify-center text-xs font-bold text-amber-300">
                    {c.n}
                  </span>
                  <h4 className="text-sm font-bold text-amber-200">{c.t}</h4>
                </div>
                <p className="text-xs text-slate-300/90 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-slate-950/70 border border-emerald-700/40 p-5">
            <h4 className="text-sm font-bold text-emerald-300 mb-2">Umumiy xulosa</h4>
            <p className="text-xs text-slate-300/90 leading-relaxed">
              {"[Co(en)₃]Cl₃"} — koordinatsion kimyoning klassik obyekti va IQ spektroskopiyasining kuchini
              namoyish etadigan eng yaxshi misollardan biri. Bir spektrning o'zi bir vaqtning o'zida to'rtta savolga
              javob beradi: ligand organikmi (C–H polosalari), u bidentatmi (halqa modalari), koordinatsiya
              qanchalik mustahkam (ν(Co–N) va k), va molekula qanday simmetriyaga ega (tanlash qoidalari). Faqat
              bitta savolga — enantiomer qaysi biri ekanligiga — IQ javob bera olmaydi; buning uchun sirkulyar
              dixroizm zarur. Shu sababli to'liq strukturaviy xulosaga kelish uchun IQ ni CD, Raman va
              rentgenostrukturaviy tahlil bilan birgalikda qo'llash tavsiya etiladi.
            </p>
          </div>
        </section>

        {/* ══════════════ NAVIGATSIYA ══════════════ */}
        <section className="grid sm:grid-cols-3 gap-3">
          <Link
            href="/ilmiy/tahlil/iq/birikmalar/co-nh3-4-cl2-cl"
            className="rounded-xl bg-slate-900/60 border border-purple-700/40 p-4 hover:bg-purple-950/50 transition group"
          >
            <div className="text-[10px] uppercase text-purple-400/80 mb-1">← Oldingi birikma</div>
            <div className="text-sm font-bold text-purple-200 group-hover:text-purple-100">
              [Co(NH₃)₄Cl₂]Cl
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Sis/trans geometrik izomeriya</div>
          </Link>

          <Link
            href="/ilmiy/tahlil/iq/birikmalar"
            className="rounded-xl bg-purple-900/40 border border-purple-600/50 p-4 hover:bg-purple-800/50 transition text-center flex flex-col justify-center"
          >
            <div className="text-sm font-bold text-purple-100">📚 Birikmalar katalogi</div>
            <div className="text-[11px] text-purple-300/80 mt-0.5">Barcha 20 ta birikma</div>
          </Link>

          <Link
            href="/ilmiy/tahlil/iq/birikmalar/co-en2-cl2-cl"
            className="rounded-xl bg-slate-900/60 border border-amber-700/40 p-4 hover:bg-amber-950/40 transition group text-right"
          >
            <div className="text-[10px] uppercase text-amber-400/80 mb-1">Keyingi birikma →</div>
            <div className="text-sm font-bold text-amber-200 group-hover:text-amber-100">
              cis-[Co(en)₂Cl₂]Cl
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Xelat + xirallik + izomeriya</div>
          </Link>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer className="rounded-2xl bg-slate-950/70 border border-purple-800/40 p-5 text-center">
          <div className="text-sm font-bold text-purple-300 mb-1">JDA-KIMYO — Ilmiy tahlil platformasi</div>
          <p className="text-[11px] text-slate-400/90 leading-relaxed max-w-3xl mx-auto">
            Infraqizil spektroskopiya bo'limi • Koordinatsion birikmalar katalogi • Ma'lumotlar Nakamoto K.
            (Infrared and Raman Spectra of Inorganic and Coordination Compounds), Cotton F.A. (Chemical
            Applications of Group Theory) va Werner A. (1911) asl tadqiqotlariga asoslangan.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-[10px]">
            {["Xelat kompleks", "D₃ simmetriya", "Δ/Λ enantiomerlar", "lel/ob konformerlar", "Werner Nobel 1913"].map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full bg-purple-900/40 border border-purple-700/40 text-purple-300">
                {t}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </main>
  )
}
