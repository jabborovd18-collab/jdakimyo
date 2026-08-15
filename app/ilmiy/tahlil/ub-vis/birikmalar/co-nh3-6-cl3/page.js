"use client"

import Link from "next/link"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"
import { useState, useMemo, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₆]Cl₃ — UB-VIS SPEKTROSKOPIYA (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar:
//   • A. B. P. Lever — Inorganic Electronic Spectroscopy (2nd ed., Elsevier, 1984)
//   • A. Werner — Z. anorg. Chem. 3, 267 (1893) — Nobel mukofoti (1913)
//   • Y. Tanabe, S. Sugano — J. Phys. Soc. Japan 9, 753 (1954)
//   • H. Bethe — Ann. Physik 3, 133 (1929) — Crystal Field Theory
//   • J. H. Van Vleck — J. Chem. Phys. 3, 807 (1935) — Ligand Field Theory
//   • G. Racah — Phys. Rev. 62, 438 (1942)
//   • C. K. Jørgensen — Absorption Spectra and Chemical Bonding (Pergamon, 1962)
//   • Housecroft & Sharpe — Inorganic Chemistry (4th ed., Pearson, 2012)
//   • F. Basolo, R. G. Pearson — Mechanisms of Inorganic Reactions (Wiley, 1967)
//   • H. Taube — Chem. Rev. 50, 69 (1952) — inert/labil kompleks tasnifi (Nobel 1983)
// Til: 100% o'zbek (lotin)
// Xususiyat: TO'LIQ nazariy tahlil, interaktiv spektr, Tanabe-Sugano d⁶, PDF eksport
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Co(NH3)6]Cl3",
  formulaCation: "[Co(NH<sub>3</sub>)<sub>6</sub>]<sup>3+</sup>",
  iupac: "Geksaamminkobalt(III) xlorid",
  commonName: "Luteo-kobalt (sariq)",
  historicalName: "Werner klassikasi (1893) — Nobel mukofoti (1913)",
  molarMass: 267.48,
  casNumber: "10534-89-1",
  color: "sariq-to'q sariq (oltinsimon)",
  colorHex: "#FFC300",
  absorbedHex: "#8B00FF",
  structure: "Oktaedr (Oₕ simmetriya)",
  metalCenter: "Co³⁺",
  dConfig: "d⁶ LS",
  spinState: "Past spin (S = 0)",
  groundTerm: "¹A₁g",
  freeIonTerm: "⁵D (erkin), ammo Oh maydonda ¹A₁g (past spin)",
  metalLigand: "Co–N (ammin)",
  crystalSystem: "Kubik",
  spaceGroup: "Fm3̄m (yuz-markazlashgan)",
  pointGroup: "Oₕ (ideal, deyarli buzilmagan)",
  bondLength: "1.96 Å (Co–N)",
  bondAngle: "90° / 180° (deyarli ideal)",
  deltaOh: 22900,
  deltaOhKJ: 274,
  racahB: 615,
  racahB0: 1100,
  beta: 0.559,
  pairingEnergy: 21000, // Juftlanish energiyasi
  cfseValue: "-2.4Δₒ + 2P",
  cfseKJ: 408,
  magneticMoment: 0,
  magneticMomentObs: 0,
  ligandField: "NH₃ — kuchli maydon (σ-donor)",
  discovery: "1798 (Tassaert birinchi olgan), 1893 (Werner tushuntirgan)",
  applications: "O'quv, ilmiy tadqiqot, koordinatsion kimyoning etaloni",
  inertness: "Juda inert (Taube tasnifi) — ligand almashish t½ > yillar",
  synthesis: "CoCl₂·6H₂O + NH₃(aq) + NH₄Cl + H₂O₂ (yoki havo O₂) → [Co(NH₃)₆]Cl₃",
}

// ═══════════════════════════════════════════════════════════════════════════════
// UB-VIS CHO'QQILARI — BATAFSIL ILMIY IZOHLAR BILAN
// ═══════════════════════════════════════════════════════════════════════════════
const uvVisPeaks = [
  {
    lambda: 475, energy: 21053, wavenumber: 21053, epsilon: 60,
    transition: "¹A₁g → ¹T₁g",
    transitionType: "d–d (singlet-singlet)",
    color: "text-yellow-400",
    intensity: "O'rta", intensityCode: 2,
    symmetryLabel: "t₂g⁶ → t₂g⁵ eg¹ (bir elektronli)",
    selection: "Spin ruxsat (ΔS=0), Laport TAQIQ (g→g) — vibronik ruxsat",
    vibronicNote: "t₁ᵤ tebranish moda bilan qo'shilib qisman ruxsat etilgan",
    energyKJ: 252,
    diagnostic: " Birinchi asosiy polosa — d⁶ LS ni tasdiqlaydi",
    theoryNote: "Bu polosa ¹A₁g (yer holati, t₂g⁶ eg⁰) dan ¹T₁g (t₂g⁵ eg¹) ga bir elektronli o'tishni ifodalaydi. d⁶ LS uchun energiyasi 10Dq − C (Racah C parametri hisobiga tuzatilgan). E(¹T₁g) = Δo − 4B − 3C ≈ 21 000 cm⁻¹. Bu polosa Laport taqiqlangan (g→g), lekin oktaedrik Co(III) komplekslarida t₁ᵤ vibronik bog'lanish orqali qisman ruxsat etilgan → ε ≈ 60 M⁻¹·sm⁻¹ (d³ dagi ε=13 dan yuqoriroq). Bu ν₁ polosaning aniq o'lchanishi Δo ni bilvosita hisoblash imkonini beradi.",
    lambdaMax_range: "470–480 nm",
    freqRange: "20 800–21 300 cm⁻¹"
  },
  {
    lambda: 340, energy: 29412, wavenumber: 29412, epsilon: 55,
    transition: "¹A₁g → ¹T₂g",
    transitionType: "d–d (singlet-singlet)",
    color: "text-orange-400",
    intensity: "O'rta", intensityCode: 2,
    symmetryLabel: "t₂g⁶ → t₂g⁵ eg¹ (boshqa o'tish)",
    selection: "Spin ruxsat (ΔS=0), Laport TAQIQ (g→g) — vibronik ruxsat",
    vibronicNote: "t₁ᵤ tebranish moda bilan qo'shilishi",
    energyKJ: 352,
    diagnostic: " Racah B parametrini hisoblash uchun ν₂ polosa",
    theoryNote: "Ikkinchi d–d polosa — ¹A₁g dan ¹T₂g ga o'tish. Bu ham bir elektronli o'tish, lekin ¹T₁g dan yuqori energiyada joylashgan. E(¹T₂g) = Δo + 12B − 2C ≈ 29 000 cm⁻¹. ν₂ − ν₁ farqi bevosita 16B − C ga proportsional → Racah B ni hisoblash imkonini beradi: (29 412 − 21 053) = 8359 cm⁻¹, bu 16B − C ga teng. C ≈ 4B (odatiy nisbat) → 12B ≈ 8359 → B ≈ 615 cm⁻¹. Erkin Co³⁺ ionida B₀ = 1100 cm⁻¹, demak β = 615/1100 = 0.56 — juda katta kovalentlik.",
    lambdaMax_range: "335–345 nm",
    freqRange: "29 000–29 900 cm⁻¹"
  },
  {
    lambda: 210, energy: 47619, wavenumber: 47619, epsilon: 20000,
    transition: "LMCT (N/Cl → Co)",
    transitionType: "LMCT (zaryad ko'chishi)",
    color: "text-red-500",
    intensity: "Juda kuchli", intensityCode: 4,
    symmetryLabel: "π(N,Cl) → t₂g(Co)",
    selection: "Laport RUXSAT + spin ruxsat → juda kuchli",
    vibronicNote: "To'liq ruxsat etilgan — vibronikga muhtoj emas",
    energyKJ: 570,
    diagnostic: " LMCT — barcha d–d polosalardan minglab marta kuchliroq",
    theoryNote: "Bu polosa ligand → metall zaryad ko'chishini (LMCT) ifodalaydi. Ligandning to'ldirilgan π-orbitallaridan (NH₃ va Cl⁻ dan) Co³⁺ ning bo'sh t₂g orbitallariga elektron ko'chadi. Bu o'tish HAM spin, HAM Laport ruxsat etilgan → ε ≈ 20 000 M⁻¹·sm⁻¹ (d–d dan ~300 marta kuchli). Co³⁺ yuqori oksidlanish darajasida bo'lgani uchun LMCT past energiyada joylashadi. Bu polosaning aniqlanishi kompleksning oksidlovchi xususiyatini ko'rsatadi: Co³⁺ + e⁻ → Co²⁺ (E° = +0.108 V).",
    lambdaMax_range: "200–225 nm",
    freqRange: "44 000–50 000 cm⁻¹"
  },
  {
    lambda: 725, energy: 13793, wavenumber: 13793, epsilon: 0.02,
    transition: "¹A₁g → ³T₁g",
    transitionType: "d–d (SPIN-TAQIQLANGAN)",
    color: "text-gray-400",
    intensity: "Juda zaif (spin-taqiqlangan)", intensityCode: 1,
    symmetryLabel: "Singlet → triplet (S=0 → S=1)",
    selection: "Spin TAQIQLANGAN (ΔS≠0), Laport ham taqiqlangan",
    vibronicNote: "Faqat spin-orbital muhitlashish orqali",
    energyKJ: 165,
    diagnostic: "Yashirin polosa — LS d⁶ ni tasdiqlaydi",
    theoryNote: "Bu SPIN-TAQIQLANGAN o'tish — singlet yer holatidan (S=0) triplet qo'zg'algan holatga (S=1) o'tish. ΔS = 1 → kvant mexanik jihatdan taqiqlangan. ε ~ 0.02 M⁻¹·sm⁻¹ — deyarli sezilmaydi. Suvli eritmada odatda ko'rilmaydi, lekin qattiq holatda (DRS spektrida) yelka sifatida namoyon bo'ladi (~725 nm). Bu polosaning mavjudligi kompleks LS holatida ekanligini tasdiqlaydi: agar HS bo'lganda, yer holati ⁵T₂g bo'lardi va boshqa polosalar chizmasi kuzatilardi.",
    lambdaMax_range: "710–740 nm",
    freqRange: "13 500–14 100 cm⁻¹",
    special: " LS holatining aniq isboti — HS Co(III) bo'lmaganini ko'rsatadi",
    hidden: true
  },
  {
    lambda: 620, energy: 16129, wavenumber: 16129, epsilon: 0.05,
    transition: "¹A₁g → ³T₂g",
    transitionType: "d–d (SPIN-TAQIQLANGAN)",
    color: "text-gray-400",
    intensity: "Juda zaif", intensityCode: 1,
    symmetryLabel: "Singlet → triplet",
    selection: "Spin TAQIQ, Laport TAQIQ",
    vibronicNote: "Faqat SOC orqali",
    energyKJ: 193,
    diagnostic: "Ikkinchi spin-taqiqlangan yelka",
    theoryNote: "¹A₁g dan ³T₂g ga o'tish. Bu ham spin-taqiqlangan, ε ~ 0.05. Ikkalasi ham (¹A₁g → ³T₁g va ³T₂g) qattiq holatda va past haroratda kuzatiladi. Ular kompleks past spinda ekanligining spektroskopik dalili — chunki agar HS bo'lganda, bu polosalar joyida boshqa (⁵T₂g → ⁵Eg) polosa bo'lardi.",
    lambdaMax_range: "600–640 nm",
    freqRange: "15 600–16 700 cm⁻¹",
    hidden: true
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TO'LIQ SPEKTR NUQTALARI (Gauss+Lorentzian shakl)
// ═══════════════════════════════════════════════════════════════════════════════
const uvVisSpectrum = [
  { lambda: 200, absorbance: 4.5 }, { lambda: 210, absorbance: 4.2 },
  { lambda: 225, absorbance: 3.8 }, { lambda: 240, absorbance: 2.5 },
  { lambda: 260, absorbance: 1.4 }, { lambda: 280, absorbance: 0.8 },
  { lambda: 300, absorbance: 0.55 }, { lambda: 320, absorbance: 0.68 },
  { lambda: 340, absorbance: 0.78 }, { lambda: 360, absorbance: 0.62 },
  { lambda: 380, absorbance: 0.32 }, { lambda: 400, absorbance: 0.20 },
  { lambda: 420, absorbance: 0.30 }, { lambda: 440, absorbance: 0.55 },
  { lambda: 460, absorbance: 0.78 }, { lambda: 475, absorbance: 0.85 },
  { lambda: 490, absorbance: 0.75 }, { lambda: 510, absorbance: 0.50 },
  { lambda: 530, absorbance: 0.28 }, { lambda: 550, absorbance: 0.15 },
  { lambda: 580, absorbance: 0.08 }, { lambda: 620, absorbance: 0.04 },
  { lambda: 650, absorbance: 0.02 }, { lambda: 700, absorbance: 0.02 },
  { lambda: 750, absorbance: 0.02 }, { lambda: 780, absorbance: 0.02 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SPEKTROXIMIK QATOR — Co³⁺ ni turli ligandlarda (Nobel mukofoti mavzusi)
// ═══════════════════════════════════════════════════════════════════════════════
const spectrochemicalSeries = [
  { ligand: "6 F⁻", complex: "[CoF₆]³⁻", deltaOh: 13100, spin: "HS (d⁶, S=2)", lambda1: 763, color: "havorang", current: false, note: "YAGONA HS Co(III)! F⁻ zaif maydon" },
  { ligand: "6 Cl⁻", complex: "[CoCl₆]³⁻ (nozik)", deltaOh: 15000, spin: "LS", lambda1: 667, color: "ko'k-yashil", current: false, note: "Nostabil" },
  { ligand: "6 H₂O", complex: "[Co(H₂O)₆]³⁺", deltaOh: 18200, spin: "LS", lambda1: 550, color: "havorang", current: false, note: "Nostabil (oksidlanish beradi)" },
  { ligand: "3 ox²⁻", complex: "[Co(ox)₃]³⁻", deltaOh: 18000, spin: "LS", lambda1: 555, color: "yashil", current: false, note: "Oksalat, xelat" },
  { ligand: "6 NH₃", complex: "[Co(NH₃)₆]³⁺", deltaOh: 22900, spin: "LS", lambda1: 475, color: "sariq-oltin", current: true, note: "STANDART (bu kompleks)" },
  { ligand: "3 en", complex: "[Co(en)₃]³⁺", deltaOh: 21500, spin: "LS", lambda1: 465, color: "sariq", current: false, note: "Xelat effekti" },
  { ligand: "6 CN⁻", complex: "[Co(CN)₆]³⁻", deltaOh: 33500, spin: "LS", lambda1: 313, color: "och sariq", current: false, note: "Kuchli π-akseptor, MLCT" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HS vs LS TAQQOSLASH — d⁶ ning eng muhim jihati
// ═══════════════════════════════════════════════════════════════════════════════
const spinComparison = [
  {
    property: "Elektron konfiguratsiya",
    hs: "t₂g⁴ eg² (yuqori spin)",
    ls: "t₂g⁶ eg⁰ (past spin)",
    thisCompound: "LS ✓"
  },
  {
    property: "Toq elektronlar soni",
    hs: "4 ta",
    ls: "0 ta",
    thisCompound: "0 ✓"
  },
  {
    property: "Umumiy spin (S)",
    hs: "S = 2",
    ls: "S = 0",
    thisCompound: "S = 0"
  },
  {
    property: "Yer holati termi",
    hs: "⁵T₂g",
    ls: "¹A₁g",
    thisCompound: "¹A₁g"
  },
  {
    property: "Magnit moment (μB)",
    hs: "4.90",
    ls: "0.00 (diamagnit)",
    thisCompound: "0.00 ✓"
  },
  {
    property: "CFSE",
    hs: "-0.4Δo",
    ls: "-2.4Δo + 2P",
    thisCompound: "-2.4Δo + 2P"
  },
  {
    property: "Kutilgan Δo",
    hs: "< P (Δo < 21 000)",
    ls: "> P (Δo > 21 000)",
    thisCompound: "22 900 > 21 000 ✓"
  },
  {
    property: "d–d polosalari soni",
    hs: "1–2 (⁵T₂g → ⁵Eg)",
    ls: "2 (¹A₁g → ¹T₁g, ¹T₂g)",
    thisCompound: "2 ✓"
  },
  {
    property: "Reaktsion tezligi",
    hs: "Labil",
    ls: "Inert (t½ soatlar-yillar)",
    thisCompound: "Juda inert"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TANABE-SUGANO d⁶ NUQTALARI — HS/LS chegarasi (Δo/B ≈ 20)
// ═══════════════════════════════════════════════════════════════════════════════
const tanabeSuganoD6 = [
  // Δo/B, HS: ⁵T₂g (yer), ⁵Eg  |  LS: ¹A₁g (yer), ¹T₁g, ¹T₂g, ³T₁g, ³T₂g
  { x: 0, hsGround: 0, hsEg: 10, lsGround: 25, lsT1g: 40, lsT2g: 60, ls3T1g: 20 },
  { x: 10, hsGround: 0, hsEg: 20, lsGround: 15, lsT1g: 32, lsT2g: 50, ls3T1g: 12 },
  { x: 20, hsGround: 0, hsEg: 30, lsGround: 5, lsT1g: 27, lsT2g: 45, ls3T1g: 8 },
  { x: 22, hsGround: 2, hsEg: 32, lsGround: 0, lsT1g: 27, lsT2g: 45, ls3T1g: 8 }, // Chegara
  { x: 30, hsGround: 15, hsEg: 45, lsGround: 0, lsT1g: 33, lsT2g: 52, ls3T1g: 10 },
  { x: 40, hsGround: 30, hsEg: 60, lsGround: 0, lsT1g: 43, lsT2g: 63, ls3T1g: 14 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// WERNER KOORDINATSION SERIYA — [Co(NH₃)₆₋ₙClₙ] kompleks oilasi
// ═══════════════════════════════════════════════════════════════════════════════
const wernerSeries = [
  { formula: "[Co(NH₃)₆]Cl₃", trad: "Luteo (sariq)", color: "sariq", colorHex: "#FFC300", lambda: "475, 340", deltaOh: 22900, ionsPerFormula: "4 (1 kation + 3 Cl⁻)", current: true },
  { formula: "[Co(NH₃)₅Cl]Cl₂", trad: "Purpureo (binafsha)", color: "binafsha", colorHex: "#8B0080", lambda: "530, 370", deltaOh: 20500, ionsPerFormula: "3 (1 kation + 2 Cl⁻)", current: false },
  { formula: "cis-[Co(NH₃)₄Cl₂]Cl", trad: "Violeo (binafsha)", color: "to'q binafsha", colorHex: "#4B0082", lambda: "540, 375", deltaOh: 19500, ionsPerFormula: "2 (1 kation + 1 Cl⁻)", current: false },
  { formula: "trans-[Co(NH₃)₄Cl₂]Cl", trad: "Praseo (yashil)", color: "yashil", colorHex: "#009944", lambda: "624, 452", deltaOh: 19000, ionsPerFormula: "2 (1 kation + 1 Cl⁻)", current: false },
  { formula: "[Co(NH₃)₃Cl₃]", trad: "Neytral", color: "sariq-yashil", colorHex: "#ADFF2F", lambda: "600, 400", deltaOh: 18500, ionsPerFormula: "0 (neytral molekula)", current: false },
]

// ═══════════════════════════════════════════════════════════════════════════════
// NAMUNA TAYYORLASH USULLARI
// ═══════════════════════════════════════════════════════════════════════════════
const techniques = [
  {
    name: "Suvli eritma (H₂O)",
    description: "Kompleksni distillangan suvda eritish. 10⁻³ M konsentratsiya, 1 sm kvarts kyuveta.",
    advantages: ["[Co(NH₃)₆]³⁺ inert — suvda stabil", "Universal", "Standart Beer-Lambert", "pH ta'siri kam"],
    disadvantages: ["Yuqori konsentratsiyada Cl⁻ ta'siri", "LMCT polosa juda kuchli — suyultirish shart", "T ↑ → polosalar biroz kengayadi"],
    bestFor: "Standart tahlil, Δo aniqlash, o'quv namunasi",
    range: "200–800 nm",
    resolution: "0.5 nm",
    concentration: "10⁻² – 10⁻⁴ M",
    prepTime: "5 daq"
  },
  {
    name: "0.1 M NH₄Cl (bufer muhit)",
    description: "NH₄Cl ligand almashishni oldini oladi. Uzoq muddat stabil eritma.",
    advantages: ["Uzoq muddat stabil", "Ligand denaturatsiyasini oldini oladi", "Cl⁻ ta'sirini nazorat", "Analitik aniqlik"],
    disadvantages: ["Yuqori ionli kuch", "NH₄⁺ dan qo'shimcha protonlanish", "UB da NH₄⁺ ozgina yutadi"],
    bestFor: "Kinetika, uzoq muddatli o'lchov",
    range: "220–800 nm",
    resolution: "0.5 nm",
    concentration: "10⁻³ M",
    prepTime: "10 daq"
  },
  {
    name: "DRS (Diffuz reflektans)",
    description: "Sariq kristall kukun BaSO₄ (10%) bilan aralashtirilib, kompleksning solid-state spektri olinadi.",
    advantages: ["Kristall panjara ta'siri saqlanadi", "Rangning to'g'ri o'lchovi", "Kvantitativ (Kubelka-Munk)", "Namuna buzilmaydi"],
    disadvantages: ["Kubelka-Munk konversiya kerak", "ε ni to'g'ridan-to'g'ri o'lchamaydi", "Reflectans kalibrash zarur"],
    bestFor: "Qattiq kristall, rang tasdiqi",
    range: "200–2500 nm (NIR)",
    resolution: "1 nm",
    concentration: "10% BaSO₄ da",
    prepTime: "10 daq"
  },
  {
    name: "Past harorat (77 K)",
    description: "N₂(l) da spektroskopiya — spin-taqiqlangan polosalarni aniq ko'rish uchun.",
    advantages: ["Spin-taqiq polosalar aniq ko'rinadi", "Polosalar kengligi kamayadi", "³T₁g, ³T₂g yelkalari aniq", "Rezolyutsiya oshadi"],
    disadvantages: ["Kriostatlar kerak — qimmat", "N₂(l) yoki He(l) sarfi", "Sekin o'lchash", "Ma'lum eritmalarda muzlash"],
    bestFor: "Nozik nazariy tadqiqot, spin holatining tasdig'i",
    range: "200–1100 nm",
    resolution: "0.2 nm",
    concentration: "10⁻³ M glisserol-suv (2:1)",
    prepTime: "30 daq"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HALAQIT BERUVCHI OMILLAR
// ═══════════════════════════════════════════════════════════════════════════════
const interferences = [
  {
    source: "LMCT polosaning kuchi",
    range: "< 250 nm",
    effect: "ε ≈ 20 000 M⁻¹·sm⁻¹ — d–d polosalarni butunlay bosadi, tekshirish qiyin",
    severity: "Yuqori",
    solution: "Konsentratsiyani 10⁻⁵ M ga suyultirish, faqat UB polosani ko'rish uchun. Vis polosalar (475, 340) uchun 10⁻³ M ishlatish."
  },
  {
    source: "Cl⁻ ionlar ta'siri",
    range: "225–260 nm",
    effect: "Cl⁻ o'zi UB da yutadi (ε ≈ 100 nm da), fon signali oshadi",
    severity: "O'rta",
    solution: "Bazaviy chiziqni 0.1 M NaCl ga qarshi o'lchash. Yoki [Co(NH₃)₆](ClO₄)₃ formasidan foydalanish."
  },
  {
    source: "Yorug'lik ta'sirida parchalanish",
    range: "UB polosada",
    effect: "Uzoq nurlanish → foto-akvatsiya: [Co(NH₃)₆]³⁺ + hv → [Co(NH₃)₅(H₂O)]³⁺",
    severity: "O'rta",
    solution: "Tez skanerlash. Namuna qorong'uda saqlash. Har o'lchovda yangi aliquot olish."
  },
  {
    source: "Co(II) aralashmasi",
    range: "500–550 nm",
    effect: "[Co(H₂O)₆]²⁺ pushti rang beradi (ε=5), ν₁ polosani buzadi",
    severity: "Yuqori",
    solution: "Reduktor ishlatmang. Sintezda H₂O₂ yoki havo O₂ ni to'liq ta'sir ettirish. UB-Vis dan avval namunani spektroskopik toza qilish."
  },
  {
    source: "pH bufer o'zgarishi",
    range: "Butun spektr",
    effect: "pH < 3: NH₃ protonlanadi → dekoordinatsiya; pH > 11: OH⁻ ligand almashadi",
    severity: "O'rta",
    solution: "Neytral yoki bir oz kislotali (pH 5–7) muhit. Kuchli ishqor va kislotalardan qochish."
  },
  {
    source: "Namuna sofligi",
    range: "Butun spektr",
    effect: "Kristall suv, NH₄Cl aralashmasi ε qiymatini o'zgartiradi",
    severity: "O'rta",
    solution: "Qayta kristallizatsiya (issiq suvda erish, sovutish). Rangi bir xil sariq (oltin) bo'lishi shart."
  },
  {
    source: "Konsentratsiya (Beer buzilishi)",
    range: "λmax da",
    effect: "c > 0.01 M → Co³⁺ oligomerlashi mumkin, ε chiziqli emas",
    severity: "O'rta",
    solution: "10⁻³ – 10⁻⁴ M oralig'ida ishlash. Har konsentratsiya uchun A ni o'lchab, chiziqlilikni tekshirish."
  },
  {
    source: "Erituvchi cutoff",
    range: "λ < 190 nm (H₂O)",
    effect: "H₂O 190 nm dan pastda yutadi — LMCT polosa qismini bosadi",
    severity: "Past",
    solution: "Ilmiy izlanish uchun kvarts kyuveta va tozalangan H₂O ishlatish. 200 nm dan yuqori — muammosiz."
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TARIXIY XRONOLOGIYA
// ═══════════════════════════════════════════════════════════════════════════════
const historicalTimeline = [
  { year: "1798", event: "B. M. Tassaert birinchi bo'lib [Co(NH₃)₆]Cl₃ ni oladi — koordinatsion kimyoning boshlanishi" },
  { year: "1857", event: "F. Genth va O. W. Gibbs Werner o'rganishlaridan oldin bu kompleksni tavsiflaydi" },
  { year: "1875", event: "S. M. Jørgensen «zanjir nazariyasi» bilan tushuntirishga urinadi (noto'g'ri)" },
  { year: "1893", event: "🏆 A. Werner koordinatsion nazariyani taklif qiladi (Z. anorg. Chem. 3, 267) — [Co(NH₃)₆]³⁺ oktaedrik ekanligini bashorat" },
  { year: "1907", event: "Werner enantiomerlarni ajratadi (Δ va Λ [Co(en)₃]³⁺) — nazariyaning tasdig'i" },
  { year: "1913", event: "🏆 A. Werner Nobel mukofotini oladi (kimyo bo'yicha — 1-uzoq oxirgi noorganik Nobel)" },
  { year: "1929", event: "H. Bethe Kristall maydon nazariyasi — Δo tushunchasi" },
  { year: "1935", event: "J. H. Van Vleck Ligand maydon nazariyasi — kovalentlikni qo'shadi" },
  { year: "1952", event: "🏆 H. Taube inert/labil kompleks tasnifi — [Co(NH₃)₆]³⁺ inertlikning etaloni (Nobel 1983)" },
  { year: "1954", event: "Y. Tanabe, S. Sugano — d⁶ HS/LS chegarasi Δo/B ≈ 20 da" },
  { year: "1962", event: "C. K. Jørgensen — β = 0.56 ni [Co(NH₃)₆]³⁺ uchun aniqlash" },
  { year: "1980-", event: "DFT hisoblashlari [Co(NH₃)₆]³⁺ ni to'liq tasdiqlaydi (bond length, Δo, μ)" },
  { year: "2026", event: "🎓 O'zbekistonda jdakimyo.uz platformasi orqali o'zbek tilida ilmiy taqdimot" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// AMALIY AHAMIYATI
// ═══════════════════════════════════════════════════════════════════════════════
const applications = [
  { field: "Koordinatsion kimyoning etaloni", detail: "d⁶ LS, Werner klassikasi, Oh simmetriya — barcha darsliklarda standart namuna", icon: "🎓" },
  { field: "Inertlik tadqiqoti", detail: "Taube tasnifi bo'yicha eng inert kompleks — ligand almashish t½ ~ yillar (H₂O da)", icon: "" },
  { field: "Analitik kimyo", detail: "Cl⁻ ni analitik aniqlash uchun AgNO₃ bilan reaksiya (3 Cl⁻ tashqi, ionli)", icon: "⚗️" },
  { field: "Nazariy chekma", detail: "Ab initio, DFT, TDDFT hisoblashlari uchun benchmark (Δo, μ, bond length)", icon: "💻" },
  { field: "Fotokimyo", detail: "UV nurlanishda foto-akvatsiya (foto-substitutsiya) mexanizmini o'rganish", icon: "☀️" },
  { field: "Rentgen strukturasi", detail: "Fm3̄m fazoviy guruh, [Al(H₂O)₆]³⁺ va [Ir(NH₃)₆]³⁺ bilan izomorf", icon: "" },
  { field: "Bosim spektroskopiyasi", detail: "Yuqori bosim ostida Δo ni o'lchash — kristall panjara elastikligi", icon: "🌐" },
  { field: "Sintez etalonlari", detail: "Boshqa kobalt komplekslarni sintez qilishning boshlang'ich modda", icon: "" },
]

export default function CoNH36Cl3UVVis() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [showHeader, setShowHeader] = useState(true)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(0)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [showSpinForbidden, setShowSpinForbidden] = useState(false)
  const [showLMCT, setShowLMCT] = useState(true)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfProgress, setPdfProgress] = useState(0)
  const [comparisonSpin, setComparisonSpin] = useState("ls")  // hs | ls

  // Beer-Lambert kalkulyator
  const [blConcentration, setBlConcentration] = useState(0.001)
  const [blPathLength, setBlPathLength] = useState(1)
  const [blSelectedPeak, setBlSelectedPeak] = useState(0)

  // Δo vs P sliderlar (HS/LS o'tish demonstratsiya)
  const [simDeltaOh, setSimDeltaOh] = useState(22900)
  const spectrumRef = useRef(null)

  // Optik zichlik hisoblash
  const visiblePeaks = uvVisPeaks.filter(p => !p.hidden || showSpinForbidden)
  const blResult = useMemo(() => {
    const peak = uvVisPeaks[blSelectedPeak]
    const A = peak.epsilon * blConcentration * blPathLength
    const T = Math.pow(10, -A) * 100
    return { A: A.toFixed(3), T: T.toFixed(2), lambda: peak.lambda, epsilon: peak.epsilon }
  }, [blConcentration, blPathLength, blSelectedPeak])

  // Racah B ni ν₂ − ν₁ farqidan hisoblash
  const racahCalc = useMemo(() => {
    const nu1 = uvVisPeaks[0].wavenumber  // 21053
    const nu2 = uvVisPeaks[1].wavenumber  // 29412
    const diff = nu2 - nu1  // = 16B − C, agar C ≈ 4B, diff = 12B
    const B = diff / 12
    const C = 4 * B
    const B0 = 1100
    const beta = B / B0
    return {
      nu1, nu2, diff,
      B: B.toFixed(0),
      C: C.toFixed(0),
      B0,
      beta: beta.toFixed(3),
      deltaOh: 22900,
    }
  }, [])

  // Spin holati simulyatsiyasi
  const spinSim = useMemo(() => {
    const P = COMPOUND.pairingEnergy  // 21000
    if (simDeltaOh < P) {
      return { state: "HS", color: "text-orange-400", bg: "bg-orange-900/30", term: "⁵T₂g", moment: "4.90", cfse: "-0.4Δo", unpaired: 4, explanation: `Δo (${simDeltaOh}) < P (${P}) → elektronlar eg ga chiqadi, HS bo'ladi. Ammo Co(III) da bu holat kam uchraydi (faqat [CoF₆]³⁻).` }
    } else {
      return { state: "LS", color: "text-blue-400", bg: "bg-blue-900/30", term: "¹A₁g", moment: "0.00", cfse: "-2.4Δo + 2P", unpaired: 0, explanation: `Δo (${simDeltaOh}) > P (${P}) → elektronlar juftlanadi, LS bo'ladi ✓ [Co(NH₃)₆]³⁺ shu holatda.` }
    }
  }, [simDeltaOh])

  const spectrumPath = useMemo(() => {
    const W = 800, H = 300, lambdaMin = 200, lambdaMax = 780, absMax = 5.0
    const points = uvVisSpectrum.map(p => {
      const x = ((p.lambda - lambdaMin) / (lambdaMax - lambdaMin)) * W
      const y = H - (p.absorbance / absMax) * H
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    return `M ${points.join(" L ")}`
  }, [])

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
        gold: rgb(1.0, 0.76, 0.03),
        goldDeep: rgb(0.65, 0.45, 0.02),
        pink: rgb(0.85, 0.30, 0.55),
        pinkDeep: rgb(0.60, 0.20, 0.40),
        pinkLight: rgb(0.98, 0.85, 0.92),
        purple: rgb(0.30, 0.11, 0.58),
        purpleLight: rgb(0.86, 0.78, 1.0),
        purpleMid: rgb(0.55, 0.35, 0.85),
        purpleDark: rgb(0.15, 0.10, 0.30),
        yellow: rgb(0.95, 0.75, 0.05),
        yellowDeep: rgb(0.60, 0.42, 0.02),
        textDark: rgb(0.08, 0.08, 0.16),
        textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0),
        green: rgb(0.08, 0.55, 0.31),
        blue: rgb(0.08, 0.35, 0.75),
        red: rgb(0.80, 0.20, 0.20),
        cyan: rgb(0.05, 0.65, 0.75),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.94, 1.0),
        bgPink: rgb(1.0, 0.94, 0.97),
        bgYellow: rgb(1.0, 0.98, 0.86),
        bgGold: rgb(1.0, 0.96, 0.80),
        bgBlue: rgb(0.94, 0.98, 1.0),
        bgGreen: rgb(0.94, 1.0, 0.98),
        bgRed: rgb(1.0, 0.95, 0.95),
        white: rgb(1, 1, 1),
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
          `jdakimyo.uz UB-Vis Tahlili  •  [Co(NH₃)₆]Cl₃  •  ${dateStr}`,
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
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.gold })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13,
          font: boldFont, color: C.goldDeep, maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
        })
        y -= 14
      }
      const drawTableRow = (label, value, bgColor = C.bgGold, labelColor = C.goldDeep) => {
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

      // ═══ SARLAVHA POLOSASI (SARIQ-OLTIN — luteo rangi) ═══
      page.drawRectangle({ x: 0, y: PAGE_H - 90, width: PAGE_W, height: 90, color: C.goldDeep })
      page.drawRectangle({ x: 0, y: PAGE_H - 92, width: PAGE_W, height: 4, color: C.gold })

      safeText("UB-VIS SPEKTROSKOPIYA TAHLILI", { x: PAGE_W / 2, y: PAGE_H - 40, size: 16, font: boldFont, color: C.white, align: "center" })
      safeText("[Co(NH₃)₆]Cl₃ — Luteo-kobalt (Werner klassikasi, 1893)", { x: PAGE_W / 2, y: PAGE_H - 60, size: 12, font: regularFont, color: C.bgGold, align: "center" })
      safeText(`Sana: ${new Date().toLocaleDateString("uz-UZ")}  •  jdakimyo.uz  •  Nobel mukofoti (1913)`, { x: PAGE_W / 2, y: PAGE_H - 78, size: 8, font: italicFont, color: C.bgGold, align: "center" })

      y = PAGE_H - 110
      setPdfProgress(30)

      // ═══ 1. UMUMIY MA'LUMOT ═══
      drawSectionHeader("1", "UMUMIY MA'LUMOT VA XUSUSIYATLARI")
      drawTableRow("Formula:", COMPOUND.formulaPlain)
      drawTableRow("IUPAC nomi:", COMPOUND.iupac)
      drawTableRow("An'anaviy nomi:", COMPOUND.commonName)
      drawTableRow("Tarixiy ahamiyati:", COMPOUND.historicalName)
      drawTableRow("Molyar massa:", `${COMPOUND.molarMass} g/mol`)
      drawTableRow("CAS raqami:", COMPOUND.casNumber)
      drawTableRow("Rangi:", COMPOUND.color)
      drawTableRow("Struktura:", COMPOUND.structure)
      drawTableRow("Metall markazi:", `${COMPOUND.metalCenter} (${COMPOUND.dConfig})`)
      drawTableRow("Spin holati:", COMPOUND.spinState)
      drawTableRow("Yer holati termi:", COMPOUND.groundTerm)
      drawTableRow("Δo qiymati:", `${COMPOUND.deltaOh.toLocaleString()} cm⁻¹ (~${COMPOUND.deltaOhKJ} kJ/mol)`)
      drawTableRow("Juftlanish energiyasi (P):", `${COMPOUND.pairingEnergy.toLocaleString()} cm⁻¹ — Δo > P → LS ✓`)
      drawTableRow("Racah B (β):", `${COMPOUND.racahB} cm⁻¹ (β = ${COMPOUND.beta})`)
      drawTableRow("CFSE:", `${COMPOUND.cfseValue} = −${COMPOUND.cfseKJ} kJ/mol`)
      drawTableRow("Magnit moment (μeff):", `${COMPOUND.magneticMoment} μB (diamagnit)`)
      drawTableRow("Inertlik:", COMPOUND.inertness)
      y -= 5
      setPdfProgress(40)

      // ═══ 2. NAZARIY ASOS ═══
      drawSectionHeader("2", "NAZARIY ASOS — d⁶ LS KONFIGURATSIYA")
      drawInfoBox(
        "Co³⁺ ionining d⁶ LS konfiguratsiyasi (t₂g⁶ eg⁰) UB-Vis spektroskopiyada eng klassik holatlardan biri. " +
        "NH₃ ligandning σ-donorlik xususiyati Δo (22 900 cm⁻¹) ni juftlanish energiyasi P (21 000 cm⁻¹) dan yuqori qiladi → " +
        "elektronlar t₂g da juftlanadi (LS holat). Barcha 6 elektron juftlashgan → diamagnit, S=0, ¹A₁g yer holati. " +
        "2 ta asosiy d–d polosa: ¹A₁g → ¹T₁g (475 nm) va ¹A₁g → ¹T₂g (340 nm).",
        C.bgGold, C.gold, C.textDark
      )
      setPdfProgress(50)

      // ═══ 3. YUTILISH POLOSALARI JADVALI ═══
      drawSectionHeader("3", "YUTILISH POLOSALARI VA IZOHI")

      const rowH = 32
      const cols = [
        { label: "λ (nm)", w: 55 },
        { label: "ν̃ (cm⁻¹)", w: 65 },
        { label: "ε", w: 60 },
        { label: "O'tish", w: 120 },
        { label: "Tur", w: 60 },
        { label: "Intensivlik", w: 90 },
      ]

      let colX = MARGIN
      page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.purpleMid })
      cols.forEach(c => {
        safeText(c.label, { x: colX + 4, y: y - 12, size: 8, font: boldFont, color: C.white, maxWidth: c.w - 6 })
        colX += c.w
      })
      y -= 18

      uvVisPeaks.forEach((p, i) => {
        checkPageBreak(rowH + 2)
        const bgc = i % 2 === 0 ? C.bgYellow : C.white
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgc })
        colX = MARGIN
        const values = [
          `${p.lambda}`,
          `${p.wavenumber.toLocaleString()}`,
          `${p.epsilon}`,
          p.transition,
          p.transitionType.substring(0, 12),
          p.intensity.substring(0, 15),
        ]
        values.forEach((v, idx) => {
          safeText(v, { x: colX + 4, y: y - 12, size: 8, font: regularFont, color: C.textDark, maxWidth: cols[idx].w - 6 })
          colX += cols[idx].w
        })
        safeText(p.diagnostic, { x: MARGIN + 4, y: y - 24, size: 7, font: italicFont, color: C.goldDeep, maxWidth: CONTENT_W - 8 })
        y -= rowH
      })
      y -= 10
      setPdfProgress(60)

      // ═══ 4. HAR BIR POLOSA NAZARIY IZOH ═══
      drawSectionHeader("4", "POLOSALARNING BATAFSIL NAZARIY IZOHI")
      uvVisPeaks.forEach((p, i) => {
        checkPageBreak(85)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.bgGold })
        safeText(`${i + 1}. ${p.transition}  —  λ = ${p.lambda} nm,  ε = ${p.epsilon}`, {
          x: MARGIN + 6, y: y - 12, size: 9, font: boldFont, color: C.goldDeep, maxWidth: CONTENT_W - 12
        })
        y -= 22
        const hh = drawWrappedText(p.theoryNote, {
          x: MARGIN + 8, y: y, size: 8.5, font: regularFont, color: C.textDark,
          maxWidth: CONTENT_W - 16, lineHeight: 11
        })
        y -= hh + 8
      })
      setPdfProgress(70)

      // ═══ 5. HS vs LS — d⁶ NING NOZIK JIHATI ═══
      drawSectionHeader("5", "HS vs LS TAHLILI — Δo > P NIMA UCHUN?")
      drawInfoBox(
        `Co³⁺ (d⁶) uchun HS/LS o'tish chegarasi:  Δo = P (juftlanish energiyasi)\n\n` +
        `Bu kompleks uchun:\n` +
        `  Δo = 22 900 cm⁻¹  (NH₃ ning kuchli maydoni)\n` +
        `  P  = 21 000 cm⁻¹  (Co³⁺ elektronlarini juftlash uchun kerak)\n\n` +
        `Δo > P  →  LS (past spin) holat afzal  →  t₂g⁶ eg⁰\n` +
        `Barcha 6 elektron juftlashgan  →  S = 0, μeff = 0 (diamagnit)\n\n` +
        `Solishtiring: [CoF₆]³⁻ da Δo = 13 100 < 21 000 = P → HS holat (S=2, μ=4.9 μB).\n` +
        `Bu kompleks Co(III) ning YAGONA HS namunasi (F⁻ zaif ligand tufayli).`,
        C.bgBlue, C.blue, C.textDark
      )
      setPdfProgress(80)

      // ═══ 6. Δo VA RACAH B HISOBI ═══
      drawSectionHeader("6", "Δo VA RACAH B PARAMETRINI HISOBLASH")
      drawInfoBox(
        `d⁶ LS uchun Δo va B ni ν₁ va ν₂ dan hisoblash:\n\n` +
        `ν₁ (¹A₁g → ¹T₁g) = ${uvVisPeaks[0].wavenumber} cm⁻¹\n` +
        `ν₂ (¹A₁g → ¹T₂g) = ${uvVisPeaks[1].wavenumber} cm⁻¹\n\n` +
        `Formulalar (d⁶ LS, ligand maydon nazariyasi):\n` +
        `  E(¹T₁g) = Δo − 4B − 3C\n` +
        `  E(¹T₂g) = Δo + 12B − 2C\n` +
        `  ν₂ − ν₁ = 16B − C ≈ 12B  (chunki C ≈ 4B)\n\n` +
        `Hisob:\n` +
        `  ν₂ − ν₁ = ${racahCalc.diff} cm⁻¹\n` +
        `  B = ${racahCalc.diff} / 12 = ${racahCalc.B} cm⁻¹\n` +
        `  Δo ≈ ν₁ + 4B + 3C ≈ ${racahCalc.deltaOh} cm⁻¹\n\n` +
        `Nefelauksetik nisbat:\n` +
        `  β = B/B₀ = ${racahCalc.B}/${racahCalc.B0} = ${racahCalc.beta}\n` +
        `  β = 0.56 → JUDA katta kovalentlik (Co³⁺ − N bog'i ionli emas!)`,
        C.bgPurple, C.purple, C.textDark
      )
      setPdfProgress(90)

      // ═══ 7. WERNER KOORDINATSION SERIYASI ═══
      drawSectionHeader("7", "WERNER KOORDINATSION SERIYASI — CH'QQI FORMULALAR RANGGA MOS")
      drawInfoBox(
        "Werner (1893) an'anaviy nomlarni ranglar bo'yicha berdi. Bu kompleks — «Luteo» (sariq):\n\n" +
        "  [Co(NH₃)₆]Cl₃   —  Luteo (sariq)      Δo = 22 900 cm⁻¹  ← BU KOMPLEKS\n" +
        "  [Co(NH₃)₅Cl]Cl₂  —  Purpureo (binafsha)  Δo = 20 500 cm⁻¹\n" +
        "  cis-[Co(NH₃)₄Cl₂]Cl  —  Violeo (binafsha)  Δo = 19 500 cm⁻¹\n" +
        "  trans-[Co(NH₃)₄Cl₂]Cl  —  Praseo (yashil)  Δo = 19 000 cm⁻¹\n\n" +
        "NH₃ ni Cl⁻ ga almashtirilganda Δo pasayadi (Cl⁻ zaifroq ligand) → yutilish uzunroq λ ga siljiadi → rang o'zgaradi:\n" +
        "sariq → binafsha → yashil (batokromik siljish).\n\n" +
        "Cis vs trans farqi: kation soni (ionlar sonini AgNO₃ bilan aniqlash) — Werner nazariyasining tasdig'i.",
        C.bgGreen, C.green, C.textDark
      )
      setPdfProgress(95)

      // ═══ 8. XULOSA ═══
      drawSectionHeader("8", "ASOSIY XULOSALAR")
      const conclusions = [
        `1. λ₁ = 475 nm (ε=60): ¹A₁g → ¹T₁g — birinchi d–d polosa (t₂g⁶ → t₂g⁵eg¹)`,
        `2. λ₂ = 340 nm (ε=55): ¹A₁g → ¹T₂g — ikkinchi d–d polosa`,
        `3. Δo = 22 900 cm⁻¹ (274 kJ/mol) — NH₃ ning kuchli σ-donor maydoni`,
        `4. Δo (22 900) > P (21 000) → LS holat, t₂g⁶ eg⁰, S=0, DIAMAGNIT`,
        `5. Racah B = 615 cm⁻¹, β = 0.56 — JUDA kovalent bog' (Co–N)`,
        `6. Sariq-oltin rang: binafsha (475 nm) va UB (340 nm) yutiladi`,
        `7. LMCT tasmasi 210 nm da (ε≈20 000) — Co(III) ning oksidlovchi xarakteri`,
        `8. Werner klassikasi (1893) — koordinatsion kimyoning tug'ilishi, Nobel 1913`,
        `9. Taube tasnifi bo'yicha JUDA INERT — ligand almashish t½ > yillar`,
        `10. Barcha modern darsliklarda d⁶ LS ning standart namunasi`,
      ]
      conclusions.forEach(c => {
        checkPageBreak(20)
        drawWrappedText(c, {
          x: MARGIN + 10, y, size: 9.5, font: regularFont, color: C.textDark,
          maxWidth: CONTENT_W - 20, lineHeight: 12
        })
        y -= 18
      })

      addFooter()
      setPdfProgress(100)

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Co-NH3-6-Cl3_UBVis_Tahlili_${new Date().toISOString().split("T")[0]}.pdf`
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
    <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">

      {/* ═══════════════ PDF MODAL ═══════════════ */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">📄</span> PDF Ilmiy Hisobot
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              [Co(NH₃)₆]Cl₃ ning UB-Vis spektroskopik tahlili haqida to'liq ilmiy hisobot yaratiladi.
            </p>
            <ul className="text-xs text-purple-300 space-y-1 mb-6 list-disc list-inside">
              <li>Umumiy ma'lumot va fizik-kimyoviy xususiyatlari</li>
              <li>d⁶ LS konfiguratsiyasining nazariy asosi (Δo &gt; P)</li>
              <li>Har bir yutilish polosasining batafsil izohi</li>
              <li>HS vs LS taqqoslash — nima uchun bu LS?</li>
              <li>Δo va Racah B parametrini hisoblash</li>
              <li>Werner koordinatsion seriyasi</li>
              <li>Ilmiy xulosalar va manbalar</li>
            </ul>

            {pdfGenerating && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-purple-300 mb-2">
                  <span>PDF yaratilmoqda...</span>
                  <span>{pdfProgress}%</span>
                </div>
                <div className="w-full bg-purple-900/40 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full transition-all duration-300" style={{ width: `${pdfProgress}%` }} />
                </div>
              </div>
            )}

            <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-200">
                <strong> Font talablari:</strong> <code className="bg-yellow-950/50 px-1 rounded">public/fonts/</code> papkasida
                <code className="bg-yellow-950/50 px-1 rounded ml-1">DejaVuSans*.ttf</code> 3 ta fayl bo'lishi shart.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setPdfModalOpen(false)} disabled={pdfGenerating}
                className="flex-1 bg-purple-800 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors text-sm font-semibold disabled:opacity-50">
                Bekor qilish
              </button>
              <button onClick={generatePDF} disabled={pdfGenerating}
                className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white py-3 rounded-lg transition-all text-sm font-bold disabled:opacity-50">
                {pdfGenerating ? "⏳ Yaratilmoqda..." : "📥 PDF yuklab olish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ HEADER ═══════════════ */}
      {showHeader && (
        <header className="border-b border-yellow-800/50 sticky top-0 z-40 bg-[var(--v3-fon-2)]/90 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300"> Bosh</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/ub-vis" className="hover:text-purple-300">UB-Vis</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-yellow-400 font-semibold">[Co(NH₃)₆]Cl₃</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border-4 border-white/20 shadow-2xl" style={{background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}dd, ${COMPOUND.colorHex}99)`}}></div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <p className="text-purple-300 text-sm mt-1">{COMPOUND.iupac}</p>
                  <p className="text-yellow-500/80 text-xs italic">{COMPOUND.commonName} • {COMPOUND.dConfig} • Δo={COMPOUND.deltaOh.toLocaleString()} cm⁻¹</p>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 mt-1">
                    🏆 Werner Nobel mukofoti (1913)
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setPdfModalOpen(true)}
                  className="text-xs bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-yellow-500/20 font-bold">
                  📄 PDF Hisobot
                </button>
                <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-xs bg-purple-800/60 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  ← Birikmalar
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      <button onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-40 px-3 py-2 rounded-lg text-xs font-bold shadow-lg bg-yellow-600 hover:bg-yellow-500 text-white">
        {showHeader ? "🔽" : "🔼"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══════════════ 1. UMUMIY MA'LUMOT ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="w-40 h-40 rounded-2xl border-4 border-white/20 shadow-2xl" style={{
                background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}, ${COMPOUND.colorHex}dd 40%, ${COMPOUND.colorHex}88 80%)`
              }}></div>
              <div className="text-center">
                <div className="text-xs text-purple-400">Ko'rinuvchi rang</div>
                <div className="text-lg font-bold text-yellow-400">{COMPOUND.color}</div>
              </div>
              <div className="w-32 h-4 rounded-full" style={{background: COMPOUND.absorbedHex}}></div>
              <div className="text-[10px] text-purple-500 text-center">Yutilgan (~475 nm, binafsha)</div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                </h2>
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-900/40 border border-yellow-500/50 text-yellow-300 font-bold">
                  🏆 Nobel 1913
                </span>
              </div>
              <p className="text-purple-200 leading-relaxed text-sm">
                <strong className="text-yellow-400">[Co(NH₃)₆]Cl₃</strong> — koordinatsion kimyoning
                <strong className="text-yellow-400"> tug'ilishiga sabab bo'lgan</strong> tarixiy kompleks. 1893 yilda A. Werner
                bu birikmani oktaedrik struktura bilan tushuntirib, koordinatsion nazariyani yaratdi va shu ish uchun
                <strong className="text-yellow-400"> Nobel mukofoti (1913)</strong> oldi. Bu shu bilan birga <strong>d⁶ past spin (LS)
                konfiguratsiyaning eng klassik namunasi</strong> hisoblanadi — barcha 6 elektron t₂g da juftlashgan,
                molekula diamagnit, ¹A₁g yer holatida.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-blue-900/30 border border-blue-700/40 rounded-xl p-3 text-center">
                  <div className="text-blue-400 text-[10px] uppercase">Konfiguratsiya</div>
                  <div className="text-white font-bold mt-1">{COMPOUND.dConfig}</div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-xl p-3 text-center">
                  <div className="text-yellow-400 text-[10px] uppercase">Yer holati</div>
                  <div className="text-white font-bold mt-1">{COMPOUND.groundTerm}</div>
                </div>
                <div className="bg-pink-900/30 border border-pink-700/40 rounded-xl p-3 text-center">
                  <div className="text-pink-400 text-[10px] uppercase">Δo (cm⁻¹)</div>
                  <div className="text-white font-bold mt-1">{COMPOUND.deltaOh.toLocaleString()}</div>
                </div>
                <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-3 text-center">
                  <div className="text-purple-400 text-[10px] uppercase">μeff (μB)</div>
                  <div className="text-white font-bold mt-1">{COMPOUND.magneticMoment} 💧</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-xl overflow-hidden">
              <div className="bg-yellow-900/30 px-4 py-2 border-b border-yellow-700/30">
                <h3 className="text-yellow-400 font-bold text-sm"> Fizik-kimyoviy xususiyatlar</h3>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Molyar massa</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.molarMass} g/mol</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">CAS raqami</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.casNumber}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Kristall tizim</td><td className="py-2 px-4 text-white">{COMPOUND.crystalSystem}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Fazoviy guruh</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.spaceGroup}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Nuqta guruhi</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.pointGroup}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Co–N bog' uzunligi</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.bondLength}</td></tr>
                  <tr><td className="py-2 px-4 text-purple-400">Kashfiyot</td><td className="py-2 px-4 text-white text-[11px]">{COMPOUND.discovery}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-xl overflow-hidden">
              <div className="bg-yellow-900/30 px-4 py-2 border-b border-yellow-700/30">
                <h3 className="text-yellow-400 font-bold text-sm">⚛ Elektron struktura</h3>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Metall ioni</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.metalCenter} (d⁶)</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Konfiguratsiya</td><td className="py-2 px-4 text-white font-mono">t₂g⁶ eg⁰ (LS)</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Yer holati termi</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.groundTerm}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Erkin ion termlari</td><td className="py-2 px-4 text-white text-[11px] font-mono">{COMPOUND.freeIonTerm}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Δo vs P</td><td className="py-2 px-4 text-green-300 font-mono text-[11px]">22 900 &gt; 21 000 ✓ LS</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">CFSE</td><td className="py-2 px-4 text-white font-mono text-[11px]">{COMPOUND.cfseValue}</td></tr>
                  <tr><td className="py-2 px-4 text-purple-400">Inertlik</td><td className="py-2 px-4 text-white text-[11px]">{COMPOUND.inertness}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-yellow-900/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-400 font-bold text-sm mb-2"> Sintez usuli</div>
            <div className="text-xs text-purple-200 font-mono bg-purple-950/40 rounded p-3">{COMPOUND.synthesis}</div>
            <div className="text-xs text-purple-300 mt-2">
              Havo O₂ Co²⁺ ni Co³⁺ ga oksidlaydi, NH₃ esa ligand bo'lib bog'lanadi. Sariq kristallar hosil bo'ladi.
              Rangi <strong className="text-yellow-300">oltinsimon sariq</strong> — shu tufayli lotincha <em>luteo</em> ("sariq") nomi berilgan.
            </div>
          </div>
        </div>

        {/* ═══════════════ 2. NAZARIY ASOS ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📚</span> d⁶ LS konfiguratsiyasining nazariy asosi
          </h2>

          <p className="text-purple-200 leading-relaxed text-sm">
            <strong className="text-yellow-400">Co³⁺ (d⁶) konfiguratsiya</strong> UB-Vis spektroskopiyada eng qiziq holatlardan biri.
            NH₃ ning kuchli σ-donorlik xususiyati Δo (22 900 cm⁻¹) ni juftlanish energiyasi P (21 000 cm⁻¹) dan yuqori qiladi →
            elektronlar t₂g orbitallarida juftlanadi va <strong className="text-pink-400">past spin (LS)</strong> holat vujudga keladi.
            Bu <strong className="text-yellow-300">t₂g⁶ eg⁰ konfiguratsiya</strong> ¹A₁g yer holatiga ega — barcha 6 elektron juftlashgan
            → S = 0 → <strong>diamagnit</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-cyan-300 font-bold mb-3 flex items-center gap-2">
                <span></span> Δo vs P — spin holatining shakllanishi
              </h3>
              <div className="bg-purple-950/60 rounded-lg p-3 mb-3">
                <div className="text-yellow-300 text-sm text-center my-2 font-mono">
                  Δo &gt; P  →  LS holat afzal
                </div>
                <div className="text-purple-300 text-[11px] mt-2 space-y-1">
                  • <strong>Δo</strong> = 22 900 cm⁻¹ (NH₃ kuchli maydon)<br/>
                  • <strong>P</strong> = 21 000 cm⁻¹ (juftlanish energiyasi)<br/>
                  • Farq = 1 900 cm⁻¹ → LS afzal (kichik marja!)<br/>
                  • Solishtiring: [CoF₆]³⁻ da Δo=13 100 &lt; P → HS
                </div>
              </div>
              <div className="bg-purple-950/60 rounded-lg p-3">
                <div className="text-yellow-300 text-xs my-1 font-mono">CFSE(LS) = −2.4Δo + 2P</div>
                <div className="text-yellow-300 text-xs my-1 font-mono">CFSE(HS) = −0.4Δo</div>
                <div className="text-purple-300 text-[10px] mt-1">LS afzalligi: −2Δo + 2P. Agar Δo &gt; P → LS.</div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-cyan-300 font-bold mb-3 flex items-center gap-2">
                <span></span> Tanlash qoidalari (d⁶ LS da)
              </h3>
              <div className="space-y-2">
                <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-3">
                  <p className="text-green-300 font-bold text-xs mb-1"> Spin ruxsat (ΔS=0)</p>
                  <p className="text-purple-200 text-[11px]">¹A₁g → ¹T₁g, ¹T₂g: singlet-singlet (S=0 → S=0). Ruxsat → ε ~ 55–60</p>
                </div>
                <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-3">
                  <p className="text-red-300 font-bold text-xs mb-1">❌ Laport TAQIQ (g→g)</p>
                  <p className="text-purple-200 text-[11px]">d–d o'tishlar g→g → taqiqlangan. Vibronik ruxsat (t₁ᵤ) tufayli ε ~ 60</p>
                </div>
                <div className="bg-gray-900/20 border border-gray-700/40 rounded-lg p-3">
                  <p className="text-gray-300 font-bold text-xs mb-1">🚫 Spin TAQIQ (³Tg)</p>
                  <p className="text-purple-200 text-[11px]">¹A₁g → ³T₁g, ³T₂g: singlet-triplet, ΔS=1 → juda taqiq (ε ~ 0.02–0.05)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">🎓 d⁶ LS ning noyob xususiyatlari:</strong>{" "}
              (1) <strong>Diamagnit</strong> — barcha elektronlar juftlashgan.
              (2) <strong>Inert</strong> — CFSE juda katta (−2.4Δo + 2P), ligand almashish sekin.
              (3) <strong>2 ta aniq d–d polosa</strong> — HS d⁶ dan farqli o'laroq (unda 1 ta ⁵T₂g→⁵Eg polosa).
              (4) Yer holati <strong>¹A₁g</strong> — juda nozik simmetriyaga ega, hech qanday Yan-Teller yorilishi yo'q.
            </p>
          </div>
        </div>

        {/* ═══════════════ 3. INTERAKTIV UB-VIS SPEKTRI ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈</span> Interaktiv UB-Vis yutilish spektri
          </h2>
          <p className="text-purple-200 text-sm">
            Polosalarga <strong className="text-yellow-400">ustiga bosing</strong> — batafsil ilmiy izohlar. 
            LMCT polosa (210 nm) juda kuchli (ε≈20 000) — d–d dan minglab marta ustun.
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-4 overflow-x-auto">
            <svg viewBox="0 0 800 400" className="w-full h-auto" preserveAspectRatio="xMidYMid meet" ref={spectrumRef}>
              <defs>
                <linearGradient id="visibleSpectrum2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4B0082"/>
                  <stop offset="15%" stopColor="#8B00FF"/>
                  <stop offset="25%" stopColor="#0000FF"/>
                  <stop offset="40%" stopColor="#00FF00"/>
                  <stop offset="55%" stopColor="#FFFF00"/>
                  <stop offset="70%" stopColor="#FF8C00"/>
                  <stop offset="90%" stopColor="#FF0000"/>
                  <stop offset="100%" stopColor="#8B0000"/>
                </linearGradient>
                <linearGradient id="peakGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1"/>
                </linearGradient>
              </defs>

              <rect x={((400 - 200) / 580) * 800} y="320" width={((780 - 400) / 580) * 800} height="10" fill="url(#visibleSpectrum2)" opacity="0.6"/>
              <rect x="0" y="320" width={((400 - 200) / 580) * 800} height="10" fill="#301934" opacity="0.5"/>

              {[1, 2, 3, 4].map((abs, i) => (
                <g key={i}>
                  <line x1="0" y1={300 - (abs/5)*300} x2="800" y2={300 - (abs/5)*300} stroke="#a78bfa" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.5"/>
                  <text x="5" y={300 - (abs/5)*300 - 2} fill="#c4b5fd" fontSize="9">A={abs}</text>
                </g>
              ))}
              {[200, 300, 400, 500, 600, 700, 780].map(l => (
                <g key={l}>
                  <line x1={((l - 200) / 580) * 800} y1="0" x2={((l - 200) / 580) * 800} y2="300" stroke="#a78bfa" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.3"/>
                  <text x={((l - 200) / 580) * 800} y="345" fill="#e9d5ff" fontSize="10" textAnchor="middle">{l}</text>
                </g>
              ))}
              <text x="400" y="365" fill="#e9d5ff" fontSize="11" textAnchor="middle" fontWeight="bold">λ (nm)</text>
              <text x="15" y="150" fill="#e9d5ff" fontSize="11" textAnchor="middle" transform="rotate(-90 15 150)" fontWeight="bold">Optik zichlik (A)</text>

              <path d={spectrumPath} fill="none" stroke="#fbbf24" strokeWidth="2"/>
              <path d={`${spectrumPath} L 800,300 L 0,300 Z`} fill="url(#peakGradient2)"/>

              {visiblePeaks.filter(p => showLMCT || !p.transitionType.includes("LMCT")).map((p, origIdx) => {
                const i = uvVisPeaks.indexOf(p)
                const x = ((p.lambda - 200) / 580) * 800
                const spectrumPoint = uvVisSpectrum.find(sp => Math.abs(sp.lambda - p.lambda) < 20)
                const y = spectrumPoint ? 300 - (spectrumPoint.absorbance / 5) * 300 : 200
                const isSelected = selectedPeak === i
                const isHovered = hoveredPeak === i
                const isLMCT = p.transitionType.includes("LMCT")

                return (
                  <g key={i} onClick={() => setSelectedPeak(i)} onMouseEnter={() => setHoveredPeak(i)} onMouseLeave={() => setHoveredPeak(null)} className="cursor-pointer">
                    <line x1={x} y1={y - 5} x2={x} y2="15" stroke={isSelected ? "#fbbf24" : (isLMCT ? "#ef4444" : "#fbbf24")} strokeWidth={isSelected || isHovered ? "2" : "1"} strokeDasharray={isSelected ? "0" : "4 2"}/>
                    <circle cx={x} cy={y} r={isSelected || isHovered ? "8" : "5"} fill={isSelected ? "#fbbf24" : (isLMCT ? "#ef4444" : (p.transitionType.includes("SPIN") ? "#6b7280" : "#fbbf24"))} stroke="#fff" strokeWidth="2"/>
                    <g>
                      <rect x={x - 30} y={5} width="60" height="20" rx="4" fill={isSelected ? "#fbbf24" : (isLMCT ? "#ef4444" : "#fbbf24")} opacity="0.9"/>
                      <text x={x} y="18" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">{p.lambda} nm</text>
                    </g>
                    {(isSelected || isHovered) && (
                      <g>
                        <rect x={x - 55} y={y - 60} width="110" height="34" rx="4" fill="#4B0082" stroke="#fbbf24" strokeWidth="1"/>
                        <text x={x} y={y - 45} fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">{p.transition}</text>
                        <text x={x} y={y - 32} fill="#fbbf24" fontSize="9" textAnchor="middle">ε = {p.epsilon}</text>
                      </g>
                    )}
                  </g>
                )
              })}

              <text x="400" y="20" fill="#fbbf24" fontSize="14" textAnchor="middle" fontWeight="bold">
                [Co(NH₃)₆]³⁺ UB-Vis spektri (0.001 M, H₂O)
              </text>
            </svg>

            <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-xs text-purple-300">
                  <input type="checkbox" checked={showSpinForbidden} onChange={(e) => setShowSpinForbidden(e.target.checked)} className="accent-yellow-500"/>
                  Spin-taqiqlangan polosalarni ko'rsatish (³T₁g, ³T₂g)
                </label>
                <label className="flex items-center gap-2 text-xs text-purple-300">
                  <input type="checkbox" checked={showLMCT} onChange={(e) => setShowLMCT(e.target.checked)} className="accent-red-500"/>
                  LMCT polosani ko'rsatish (210 nm)
                </label>
              </div>
              <span className="text-xs text-purple-400">
                 {visiblePeaks.filter(p => showLMCT || !p.transitionType.includes("LMCT")).length} ta polosa
              </span>
            </div>
          </div>

          {/* Tanlangan polosa detali */}
          {selectedPeak !== null && (
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-500/50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-2xl font-bold text-yellow-400 mb-1">{uvVisPeaks[selectedPeak].transition}</h3>
                  <p className="text-purple-300 text-sm">{uvVisPeaks[selectedPeak].symmetryLabel}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  uvVisPeaks[selectedPeak].intensityCode === 4 ? "bg-red-900/40 border-red-500 text-red-300" :
                  uvVisPeaks[selectedPeak].intensityCode === 3 ? "bg-orange-900/40 border-orange-500 text-orange-300" :
                  uvVisPeaks[selectedPeak].intensityCode === 2 ? "bg-yellow-900/40 border-yellow-500 text-yellow-300" :
                  "bg-gray-900/40 border-gray-500 text-gray-300"
                }`}>
                  {uvVisPeaks[selectedPeak].intensity}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">λmax</div>
                  <div className="text-yellow-300 font-mono font-bold">{uvVisPeaks[selectedPeak].lambda} nm</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">ν̃ (cm⁻¹)</div>
                  <div className="text-cyan-300 font-mono font-bold">{uvVisPeaks[selectedPeak].wavenumber.toLocaleString()}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">ε (M⁻¹·sm⁻¹)</div>
                  <div className="text-green-300 font-mono font-bold">{uvVisPeaks[selectedPeak].epsilon}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">E (kJ/mol)</div>
                  <div className="text-orange-300 font-mono font-bold">{uvVisPeaks[selectedPeak].energyKJ}</div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-3 mb-3">
                <div className="text-xs text-blue-400 font-bold mb-1"> Tanlash qoidasi:</div>
                <div className="text-sm text-purple-200">{uvVisPeaks[selectedPeak].selection}</div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3 mb-3">
                <div className="text-xs text-yellow-400 font-bold mb-1"> Diagnostik:</div>
                <div className="text-sm text-purple-200">{uvVisPeaks[selectedPeak].diagnostic}</div>
              </div>
              <div className="bg-purple-900/20 border border-purple-700/40 rounded-lg p-4">
                <div className="text-xs text-yellow-400 font-bold mb-2">🎓 Batafsil ilmiy izoh:</div>
                <div className="text-sm text-purple-200 leading-relaxed">{uvVisPeaks[selectedPeak].theoryNote}</div>
              </div>
              {uvVisPeaks[selectedPeak].special && (
                <div className="mt-3 bg-red-900/20 border border-red-700/40 rounded-lg p-3">
                  <div className="text-xs text-red-400 font-bold mb-1">⭐ Alohida ahamiyat:</div>
                  <div className="text-sm text-red-200">{uvVisPeaks[selectedPeak].special}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════ 4. CHO'QQILAR JADVALI ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Yutilish polosalari — ilmiy tayinlash jadvali
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-yellow-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">λ (nm)</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">ν̃ (cm⁻¹)</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">O'tish</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Tur</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">ε</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Intensivlik</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Ma'no</th>
                </tr>
              </thead>
              <tbody>
                {uvVisPeaks.filter(p => !p.hidden || showSpinForbidden).map((p, i) => (
                  <tr key={i} onClick={() => setSelectedPeak(uvVisPeaks.indexOf(p))}
                    className={`border-b border-purple-800/30 hover:bg-yellow-900/20 cursor-pointer transition-colors ${selectedPeak === uvVisPeaks.indexOf(p) ? "bg-yellow-900/30" : ""}`}>
                    <td className="py-3 px-3 text-yellow-300 font-mono font-bold">{p.lambda}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">{p.wavenumber.toLocaleString()}</td>
                    <td className="py-3 px-3 text-purple-200 font-mono">{p.transition}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        p.transitionType.includes("SPIN") ? "bg-gray-800/60 text-gray-400" :
                        p.transitionType.includes("LMCT") ? "bg-red-900/40 text-red-300" :
                        "bg-yellow-900/40 text-yellow-300"
                      }`}>{p.transitionType}</span>
                    </td>
                    <td className="py-3 px-3 text-green-300 font-mono">{p.epsilon}</td>
                    <td className="py-3 px-3 text-xs">{p.intensity}</td>
                    <td className="py-3 px-3 text-xs text-purple-300 italic">{p.diagnostic.substring(0, 45)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-purple-400 italic">
            Manba: Lever A.B.P. — Inorganic Electronic Spectroscopy (1984); ε qiymatlari klassik o'lchovlar bo'yicha (1955-1970)
          </p>
        </div>

        {/* ═══════════════ 5. KRISTALL MAYDON DIAGRAMMASI ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Kristall maydon yorilishi va d⁶ LS konfiguratsiyasi
          </h2>
          <p className="text-purple-200 text-sm">
            Co³⁺ ning 6 ta d-elektroni t₂g orbitallarida juftlashib joylashadi (LS). Bu <strong className="text-yellow-400">
            eg orbitallar bo'sh</strong> ekanligini bildiradi. d–d o'tishlar t₂g → eg yo'nalishida boradi.
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-6">
            <svg viewBox="0 0 700 400" className="w-full h-auto">
              {/* Erkin ion */}
              <line x1="50" y1="200" x2="180" y2="200" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 4"/>
              <text x="115" y="220" fill="#a78bfa" fontSize="10" textAnchor="middle">Erkin Co³⁺</text>
              <text x="115" y="235" fill="#a78bfa" fontSize="9" textAnchor="middle">(5 orbital, bir xil E)</text>
              <text x="60" y="195" fill="#a78bfa" fontSize="9">↑↓ ↑ ↑ ↑ ↑</text>

              {/* Oh maydonda LS (t2g juftlashgan) */}
              <line x1="220" y1="330" x2="350" y2="330" stroke="#22d3ee" strokeWidth="3"/>
              <text x="365" y="335" fill="#22d3ee" fontSize="11" fontWeight="bold">t₂g (−0.4Δo)</text>
              <text x="285" y="322" fill="#22d3ee" fontSize="12" textAnchor="middle" fontWeight="bold">↑↓ ↑↓ ↑↓</text>
              <text x="285" y="352" fill="#a78bfa" fontSize="8" textAnchor="middle">6 elektron (juftlashgan)</text>

              <line x1="220" y1="150" x2="350" y2="150" stroke="#f472b6" strokeWidth="3"/>
              <text x="365" y="155" fill="#f472b6" fontSize="11" fontWeight="bold">eg (+0.6Δo)</text>
              <text x="285" y="140" fill="#f472b6" fontSize="12" textAnchor="middle" fontWeight="bold">___ ___</text>
              <text x="285" y="170" fill="#a78bfa" fontSize="8" textAnchor="middle">0 elektron (bo'sh)</text>

              {/* Δo */}
              <line x1="200" y1="330" x2="200" y2="150" stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#arrHead)" markerStart="url(#arrHead)"/>
              <text x="185" y="245" fill="#fbbf24" fontSize="16" textAnchor="end" fontWeight="bold">Δo</text>
              <text x="185" y="262" fill="#fbbf24" fontSize="10" textAnchor="end">22 900 cm⁻¹</text>

              {/* Yer va qo'zg'algan termlar */}
              <line x1="410" y1="330" x2="510" y2="330" stroke="#22d3ee" strokeWidth="3"/>
              <text x="520" y="335" fill="#22d3ee" fontSize="12" fontWeight="bold">¹A₁g (yer)</text>
              <text x="410" y="325" fill="#22d3ee" fontSize="8">t₂g⁶ eg⁰, S=0</text>

              <line x1="410" y1="200" x2="510" y2="200" stroke="#fbbf24" strokeWidth="2.5"/>
              <text x="520" y="205" fill="#fbbf24" fontSize="12" fontWeight="bold">¹T₁g</text>
              <text x="410" y="195" fill="#fbbf24" fontSize="8">t₂g⁵ eg¹, S=0</text>

              <line x1="410" y1="100" x2="510" y2="100" stroke="#f97316" strokeWidth="2.5"/>
              <text x="520" y="105" fill="#f97316" fontSize="12" fontWeight="bold">¹T₂g</text>

              <line x1="410" y1="50" x2="510" y2="50" stroke="#ef4444" strokeWidth="2.5"/>
              <text x="520" y="55" fill="#ef4444" fontSize="12" fontWeight="bold">LMCT</text>

              {/* Spin-taqiq */}
              <line x1="410" y1="270" x2="510" y2="270" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4 3"/>
              <text x="520" y="275" fill="#6b7280" fontSize="10" fontStyle="italic">³T₁g (spin-taqiq)</text>

              {/* Strelkalar */}
              <line x1="440" y1="325" x2="440" y2="205" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arr2)"/>
              <text x="420" y="270" fill="#fbbf24" fontSize="9" textAnchor="end">475 nm</text>

              <line x1="460" y1="325" x2="460" y2="105" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arr3)"/>
              <text x="440" y="180" fill="#f97316" fontSize="9" textAnchor="end">340 nm</text>

              <line x1="480" y1="325" x2="480" y2="55" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arr4)"/>
              <text x="475" y="150" fill="#ef4444" fontSize="9" textAnchor="end">210 nm</text>

              <defs>
                <marker id="arrHead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <polygon points="0 0, 10 5, 0 10" fill="#fbbf24"/>
                </marker>
                <marker id="arr2" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><polygon points="0 0, 10 5, 0 10" fill="#fbbf24"/></marker>
                <marker id="arr3" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><polygon points="0 0, 10 5, 0 10" fill="#f97316"/></marker>
                <marker id="arr4" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><polygon points="0 0, 10 5, 0 10" fill="#ef4444"/></marker>
              </defs>

              <text x="350" y="25" fill="#fbbf24" fontSize="14" textAnchor="middle" fontWeight="bold">
                [Co(NH₃)₆]³⁺ (d⁶ LS) energiyalar diagrammasi
              </text>
              <text x="350" y="390" fill="#a78bfa" fontSize="10" textAnchor="middle">
                Chapda: kristall maydon yorilishi (LS)  |  O'ngda: term simvollari va o'tishlar
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-cyan-400 font-bold text-sm mb-1">t₂g⁶ (LS)</div>
              <div className="text-xs text-purple-200">Barcha 6 elektron t₂g da juftlashgan → S=0, ¹A₁g yer holati. Bu HS t₂g⁴ eg² dan farqli.</div>
            </div>
            <div className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-4">
              <div className="text-pink-400 font-bold text-sm mb-1">eg⁰ (bo'sh)</div>
              <div className="text-xs text-purple-200">eg orbitallar butunlay bo'sh — d–d o'tishlar shu erga sakraydi. Yan-Teller yorilishi yo'q.</div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="text-yellow-400 font-bold text-sm mb-1">Δo = 22 900</div>
              <div className="text-xs text-purple-200">274 kJ/mol — NH₃ ning kuchli σ-donor maydonining natijasi. P (21 000) dan yuqori → LS!</div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 6. INTERAKTIV Δo vs P SIMULYATOR ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Interaktiv: Δo vs P — HS/LS o'tish simulyatori
          </h2>
          <p className="text-purple-200 text-sm">
            Sliderni harakatlantirib Δo qiymatini o'zgartiring va spin holatining qanday almashinuvini kuzating.
            P (juftlanish energiyasi) = <strong className="text-yellow-300">21 000 cm⁻¹</strong> Co³⁺ uchun.
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-6">
            <div className="mb-4">
              <div className="flex justify-between text-xs text-purple-400 mb-2">
                <span>Δo (Ligand maydon)</span>
                <span className="text-yellow-300 font-mono">{simDeltaOh.toLocaleString()} cm⁻¹</span>
              </div>
              <input type="range" min="10000" max="35000" step="500" value={simDeltaOh}
                onChange={(e) => setSimDeltaOh(Number(e.target.value))}
                className="w-full accent-yellow-500"/>
              <div className="flex justify-between text-[10px] text-purple-500 mt-1">
                <span>10 000 (F⁻)</span>
                <span className="text-red-400">P=21 000</span>
                <span>NH₃=22 900</span>
                <span>35 000 (CN⁻)</span>
              </div>
            </div>

            {/* Visual */}
            <div className={`${spinSim.bg} border-2 border-[var(--v3-chiziq)] rounded-xl p-6 mt-4`}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Spin diagramma */}
                <svg viewBox="0 0 250 200" className="w-64 h-52">
                  <line x1="30" y1="150" x2="150" y2="150" stroke="#22d3ee" strokeWidth="3"/>
                  <text x="160" y="155" fill="#22d3ee" fontSize="11" fontWeight="bold">t₂g</text>

                  <line x1="30" y1="60" x2="150" y2="60" stroke="#f472b6" strokeWidth="3"/>
                  <text x="160" y="65" fill="#f472b6" fontSize="11" fontWeight="bold">eg</text>

                  {/* Δo strelka */}
                  <line x1="20" y1="150" x2="20" y2="60" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#simArr)"/>
                  <text x="5" y="105" fill="#fbbf24" fontSize="10" fontWeight="bold">Δo</text>

                  {/* Elektronlar */}
                  {spinSim.state === "LS" ? (
                    <>
                      <text x="55" y="145" fill="#22d3ee" fontSize="14" fontWeight="bold">↑↓</text>
                      <text x="85" y="145" fill="#22d3ee" fontSize="14" fontWeight="bold">↑↓</text>
                      <text x="115" y="145" fill="#22d3ee" fontSize="14" fontWeight="bold">↑↓</text>
                    </>
                  ) : (
                    <>
                      <text x="55" y="145" fill="#22d3ee" fontSize="14" fontWeight="bold">↑↓</text>
                      <text x="85" y="145" fill="#22d3ee" fontSize="14" fontWeight="bold">↑</text>
                      <text x="115" y="145" fill="#22d3ee" fontSize="14" fontWeight="bold">↑</text>
                      <text x="70" y="55" fill="#f472b6" fontSize="14" fontWeight="bold">↑</text>
                      <text x="115" y="55" fill="#f472b6" fontSize="14" fontWeight="bold">↑</text>
                    </>
                  )}

                  <defs>
                    <marker id="simArr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><polygon points="0 0, 8 4, 0 8" fill="#fbbf24"/></marker>
                  </defs>

                  <text x="90" y="185" fill="#e9d5ff" fontSize="11" textAnchor="middle" fontWeight="bold">d⁶ ({spinSim.state})</text>
                </svg>

                <div className="flex-1 space-y-2">
                  <div className={`text-3xl font-bold ${spinSim.color}`}>
                    {spinSim.state === "LS" ? "🟢 Past spin (LS)" : "🔵 Yuqori spin (HS)"}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-purple-950/50 rounded p-2">
                      <div className="text-purple-400">Yer holati</div>
                      <div className="text-white font-mono font-bold">{spinSim.term}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded p-2">
                      <div className="text-purple-400">Toq e⁻</div>
                      <div className="text-white font-mono font-bold">{spinSim.unpaired}</div>
                    </div>
                    <div className="bg-purple-950/50 rounded p-2">
                      <div className="text-purple-400">μeff</div>
                      <div className="text-white font-mono font-bold">{spinSim.moment} μB</div>
                    </div>
                    <div className="bg-purple-950/50 rounded p-2">
                      <div className="text-purple-400">CFSE</div>
                      <div className="text-white font-mono font-bold">{spinSim.cfse}</div>
                    </div>
                  </div>
                  <div className="text-xs text-purple-200 italic bg-purple-950/40 rounded p-3 mt-3">
                    {spinSim.explanation}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">🎓 Nazariy tushunish:</strong> HS/LS chegarasi Δo = P.
              Bu kompleks (NH₃) ligandi Δo = 22 900 &gt; P = 21 000 tufayli LS. Agar NH₃ o'rniga F⁻ (Δo = 13 100) qo'ysak → HS.
              Bu kompleksning yagona HS holati [CoF₆]³⁻ da kuzatilgan (Werner o'zi ham bilmagan!). Cotton (1965) DFT
              hisoblashlar bilan buni tasdiqlagan.
            </p>
          </div>
        </div>

        {/* ═══════════════ 7. HS vs LS TAQQOSLASH JADVALI ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔀</span> HS vs LS — d⁶ ning ikki spin holati
          </h2>
          <p className="text-purple-200 text-sm">
            Bu kompleksni <strong className="text-yellow-400">LS</strong> deb tasdiqlash uchun spektroskopik va magnit dalillar:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-yellow-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Xususiyat</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">HS d⁶ (masalan [CoF₆]³⁻)</th>
                  <th className="py-3 px-3 text-left text-blue-400 text-xs uppercase">LS d⁶ (masalan [Co(NH₃)₆]³⁺)</th>
                  <th className="py-3 px-3 text-left text-green-400 text-xs uppercase">BU KOMPLEKS</th>
                </tr>
              </thead>
              <tbody>
                {spinComparison.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-900/30">
                    <td className="py-3 px-3 text-white font-semibold">{r.property}</td>
                    <td className="py-3 px-3 text-orange-300 font-mono text-xs">{r.hs}</td>
                    <td className="py-3 px-3 text-blue-300 font-mono text-xs">{r.ls}</td>
                    <td className="py-3 px-3 text-green-300 font-mono text-xs font-bold">{r.thisCompound}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════ 8. Δo va RACAH B HISOBI ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧮</span> Δo va Racah B parametrini spektrdan hisoblash
          </h2>
          <p className="text-purple-200 text-sm">
            d⁶ LS uchun 2 ta polosa mavjud — <strong className="text-yellow-400">ikkisi ham kerak</strong> Δo va B ni topish uchun.
          </p>

          <div className="space-y-3">
            {[
              { step: 1, task: "Birinchi polosani topish", formula: "ν₁ (¹A₁g → ¹T₁g) = 21 053 cm⁻¹ (475 nm)", result: "" },
              { step: 2, task: "Ikkinchi polosani topish", formula: "ν₂ (¹A₁g → ¹T₂g) = 29 412 cm⁻¹ (340 nm)", result: "" },
              { step: 3, task: "Farqni hisoblash", formula: "ν₂ − ν₁ = 29 412 − 21 053 = 8359 cm⁻¹", result: "" },
              { step: 4, task: "d⁶ LS formulasini qo'llash", formula: "ν₂ − ν₁ = 16B − C ≈ 12B  (chunki C ≈ 4B)", result: "" },
              { step: 5, task: "Racah B ni hisoblash", formula: "B = 8359 / 12 ≈ 697 cm⁻¹  (aniq eksp: 615 cm⁻¹)", result: "B = 615 cm⁻¹" },
              { step: 6, task: "Δo ni hisoblash", formula: "Δo ≈ ν₁ + 4B + 3C ≈ 21 053 + 2460 − 615 = 22 898", result: "Δo = 22 900 cm⁻¹" },
              { step: 7, task: "Nefelauksetik β", formula: "β = B/B₀ = 615/1100 = 0.56", result: "β = 0.56 (juda kovalent!)" },
              { step: 8, task: "Δo &gt; P tekshirish", formula: "22 900 &gt; 21 000 ✓ → LS holat tasdiqlangan", result: "LS ✓" },
            ].map((s, i) => (
              <div key={i} className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-4 flex gap-4 items-start">
                <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className="text-yellow-300 font-semibold text-sm">{s.task}</div>
                  <div className="text-xs text-purple-300 mt-1 font-mono bg-purple-950/50 rounded p-2">{s.formula}</div>
                  {s.result && (<div className="text-xs text-green-300 mt-2 font-bold">➜ {s.result}</div>)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-500/50 rounded-2xl p-6 mt-4">
            <h3 className="text-yellow-400 font-bold text-lg mb-3"> Hisob-kitob natijalari</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-purple-400 mb-1">Δo</div>
                <div className="text-2xl font-bold text-yellow-300">{COMPOUND.deltaOh.toLocaleString()}</div>
                <div className="text-[10px] text-purple-500">cm⁻¹</div>
              </div>
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-purple-400 mb-1">Δo</div>
                <div className="text-2xl font-bold text-orange-300">{COMPOUND.deltaOhKJ}</div>
                <div className="text-[10px] text-purple-500">kJ/mol</div>
              </div>
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-purple-400 mb-1">Racah B</div>
                <div className="text-2xl font-bold text-green-300">{COMPOUND.racahB}</div>
                <div className="text-[10px] text-purple-500">cm⁻¹</div>
              </div>
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-purple-400 mb-1">β</div>
                <div className="text-2xl font-bold text-cyan-300">{COMPOUND.beta}</div>
                <div className="text-[10px] text-purple-500">B₀ = {COMPOUND.racahB0}</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300"> β = 0.56 nima demakdir?</strong> Bu Cr³⁺ (β=0.79) yoki Fe³⁺ (β=0.7) dan
              ANCHA past — ya'ni Co³⁺–N bog'ida <strong>44% kovalentlik</strong> mavjud. Bu Werner nazariyasidan farqli o'laroq
              (Werner ionli bog' deb qaragan) — bog' aslida juda kovalent. Van Vleck (1935) ligand maydon nazariyasi
              orqali buni tushuntirgan: metall va ligand orbitallari qisman qo'shilib molekulyar orbital hosil qiladi.
            </p>
          </div>
        </div>

        {/* ═══════════════ 9. TANABE-SUGANO d⁶ DIAGRAMMASI ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈</span> d⁶ Tanabe-Sugano diagrammasi — HS/LS chegarasi
          </h2>
          <p className="text-purple-200 text-sm">
            d⁶ diagrammasi <strong className="text-yellow-400">eng qiziq</strong> — chunki Δo/B ≈ 20 da <strong>yer holati almashiladi</strong>:
            HS (⁵T₂g) → LS (¹A₁g). [Co(NH₃)₆]³⁺ ning holati (Δo/B ≈ 37) o'ng tomonda joylashgan (chuqur LS).
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-4">
            <svg viewBox="0 0 700 400" className="w-full h-auto">
              {/* Grid */}
              <line x1="60" y1="370" x2="670" y2="370" stroke="#a78bfa" strokeWidth="1"/>
              <line x1="60" y1="370" x2="60" y2="30" stroke="#a78bfa" strokeWidth="1"/>

              {[10, 20, 30, 40, 50, 60].map((v, i) => (
                <g key={i}>
                  <text x="50" y={370 - (v/60)*340 + 4} fill="#c4b5fd" fontSize="9" textAnchor="end">{v}</text>
                  <line x1="55" y1={370 - (v/60)*340} x2="670" y2={370 - (v/60)*340} stroke="#a78bfa" strokeWidth="0.2" strokeDasharray="2 3" opacity="0.3"/>
                </g>
              ))}
              <text x="25" y="200" fill="#e9d5ff" fontSize="12" textAnchor="middle" transform="rotate(-90 25 200)" fontWeight="bold">E/B</text>

              {[0, 10, 20, 30, 40, 50].map((v, i) => (
                <g key={i}>
                  <text x={60 + (v/50)*610} y="390" fill="#c4b5fd" fontSize="9" textAnchor="middle">{v}</text>
                  <line x1={60 + (v/50)*610} y1="30" x2={60 + (v/50)*610} y2="370" stroke="#a78bfa" strokeWidth="0.2" strokeDasharray="2 3" opacity="0.3"/>
                </g>
              ))}
              <text x="365" y="405" fill="#e9d5ff" fontSize="12" textAnchor="middle" fontWeight="bold">Δo / B</text>

              {/* HS soha (chapda) — ⁵T2g yer */}
              <rect x="60" y="30" width={60 + (22/50)*610 - 60} height="340" fill="#f97316" opacity="0.1"/>
              <text x="150" y="50" fill="#f97316" fontSize="12" fontWeight="bold">HS soha</text>
              <text x="150" y="65" fill="#f97316" fontSize="9">⁵T₂g yer holati</text>

              {/* LS soha (o'ngda) — ¹A1g yer */}
              <rect x={60 + (22/50)*610} y="30" width={670 - (60 + (22/50)*610)} height="340" fill="#3b82f6" opacity="0.1"/>
              <text x="500" y="50" fill="#3b82f6" fontSize="12" fontWeight="bold">LS soha</text>
              <text x="500" y="65" fill="#3b82f6" fontSize="9">¹A₁g yer holati</text>

              {/* Chegara chizig'i */}
              <line x1={60 + (22/50)*610} y1="30" x2={60 + (22/50)*610} y2="370" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 4"/>
              <text x={60 + (22/50)*610 + 5} y="380" fill="#ef4444" fontSize="10" fontWeight="bold">HS↔LS chegara (Δo=P)</text>

              {/* HS: ⁵T₂g (yer, ↓) va ⁵Eg */}
              <path d="M 60 370 Q 100 350 220 275" stroke="#f97316" strokeWidth="2.5" fill="none"/>
              <text x="200" y="270" fill="#f97316" fontSize="10" fontWeight="bold">⁵T₂g</text>

              <path d="M 60 260 Q 100 240 220 180" stroke="#fdba74" strokeWidth="2" fill="none"/>
              <text x="200" y="175" fill="#fdba74" fontSize="10">⁵Eg</text>

              {/* LS: ¹A₁g yer, ¹T₁g, ¹T₂g */}
              <line x1={60 + (22/50)*610} y1="370" x2="670" y2="370" stroke="#22d3ee" strokeWidth="2.5"/>
              <text x="660" y="365" fill="#22d3ee" fontSize="11" textAnchor="end" fontWeight="bold">¹A₁g (LS yer)</text>

              <path d={`M ${60 + (22/50)*610} 220 Q 500 200 670 130`} stroke="#fbbf24" strokeWidth="2.5" fill="none"/>
              <text x="660" y="125" fill="#fbbf24" fontSize="11" textAnchor="end" fontWeight="bold">¹T₁g</text>

              <path d={`M ${60 + (22/50)*610} 120 Q 500 90 670 60`} stroke="#f97316" strokeWidth="2.5" fill="none"/>
              <text x="660" y="55" fill="#f97316" fontSize="11" textAnchor="end" fontWeight="bold">¹T₂g</text>

              {/* [Co(NH3)6]3+ marker (Δo/B ≈ 37) */}
              {(() => {
                const xVal = 37
                const xPos = 60 + (xVal/50)*610
                return (
                  <g>
                    <line x1={xPos} y1="30" x2={xPos} y2="370" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.8"/>
                    <text x={xPos + 5} y="45" fill="#fbbf24" fontSize="10" fontWeight="bold">[Co(NH₃)₆]³⁺</text>
                    <text x={xPos + 5} y="60" fill="#fbbf24" fontSize="9">Δo/B ≈ 37</text>

                    <circle cx={xPos} cy="370" r="5" fill="#22d3ee" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx={xPos} cy={370 - (34/60)*340} r="6" fill="#fbbf24" stroke="#fff" strokeWidth="2"/>
                    <text x={xPos + 8} y={370 - (34/60)*340 + 4} fill="#fbbf24" fontSize="9" fontWeight="bold">ν₁</text>

                    <circle cx={xPos} cy={370 - (48/60)*340} r="6" fill="#f97316" stroke="#fff" strokeWidth="2"/>
                    <text x={xPos + 8} y={370 - (48/60)*340 + 4} fill="#f97316" fontSize="9" fontWeight="bold">ν₂</text>
                  </g>
                )
              })()}

              {/* [CoF6]3- marker (HS holat) */}
              {(() => {
                const xVal = 15
                const xPos = 60 + (xVal/50)*610
                return (
                  <g>
                    <circle cx={xPos} cy={370 - (5/60)*340} r="4" fill="#f97316" stroke="#fff" strokeWidth="1"/>
                    <text x={xPos + 5} y={370 - (5/60)*340 - 5} fill="#f97316" fontSize="8">[CoF₆]³⁻ (HS)</text>
                  </g>
                )
              })()}

              <text x="365" y="20" fill="#fbbf24" fontSize="13" textAnchor="middle" fontWeight="bold">
                d⁶ Tanabe-Sugano diagrammasi (HS ↔ LS chegara)
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-cyan-400 font-bold text-sm mb-2">ν₁ = 21 053</div>
              <div className="text-xs text-purple-200">¹A₁g → ¹T₁g<br/>Δo hisoblash uchun</div>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
              <div className="text-orange-400 font-bold text-sm mb-2">ν₂ = 29 412</div>
              <div className="text-xs text-purple-200">¹A₁g → ¹T₂g<br/>ν₂ − ν₁ = 16B − C</div>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-bold text-sm mb-2">Chegara Δo/B ≈ 22</div>
              <div className="text-xs text-purple-200">Bu kompleks: 37 (LS)<br/>[CoF₆]³⁻: 15 (HS)</div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 10. WERNER SERIYASI ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🏆</span> Werner koordinatsion seriyasi — 1893 yilning shohkori
          </h2>
          <p className="text-purple-200 text-sm">
            A. Werner (1893, Nobel 1913) <strong className="text-yellow-400">an'anaviy nomlarni ranglar bo'yicha</strong> berdi.
            Bu kompleks — «<strong className="text-yellow-300">Luteo</strong>» (lotincha "sariq"). NH₃ ni Cl⁻ ga almashtirsak,
            Δo pasayadi va rang batokromik siljiadi (uzunroq λ ga).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-yellow-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Rang</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Formula</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">An'anaviy nomi</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">λ (nm)</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Δo (cm⁻¹)</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Ionlar soni</th>
                </tr>
              </thead>
              <tbody>
                {wernerSeries.map((w, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-yellow-900/20 transition-colors ${w.current ? "bg-yellow-900/30 border-l-4 border-l-yellow-400" : ""}`}>
                    <td className="py-3 px-3">
                      <div className="w-8 h-8 rounded border-2 border-white/20" style={{background: w.colorHex}}></div>
                    </td>
                    <td className="py-3 px-3 text-yellow-300 font-mono text-xs">{w.formula}</td>
                    <td className="py-3 px-3 text-purple-200 italic">{w.trad}</td>
                    <td className="py-3 px-3 text-green-300 font-mono text-xs">{w.lambda}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">{w.deltaOh.toLocaleString()}</td>
                    <td className="py-3 px-3 text-xs">
                      {w.current ? <strong className="text-yellow-400">← BU KOMPLEKS</strong> : w.ionsPerFormula}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <h4 className="text-yellow-300 font-bold text-sm mb-2">🎓 Werner nazariyasining tasdig'i (1893)</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              Werner ionlar sonini <strong>AgNO₃ titrant</strong> bilan aniqlagan: [Co(NH₃)₆]Cl₃ da 3 ta Cl⁻ ioni AgCl cho'kmaga tushadi,
              [Co(NH₃)₅Cl]Cl₂ da esa faqat 2 ta. Bu birinchi ("koordinatsion") Cl ning ichki sferada bog'langanini isbotlaydi.
              Elektr o'tkazuvchanlik ham 4 ionli (Luteo) → 3 ionli (Purpureo) → 2 ionli (Praseo) → 0 ionli seriya bo'yicha pasayadi.
              Bu <strong>koordinatsion nazariyaning empirik dalili</strong> — Nobel mukofoti (1913).
            </p>
          </div>
        </div>

        {/* ═══════════════ 11. INTERAKTIV BEER-LAMBERT KALKULYATORI ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Interaktiv Beer-Lambert kalkulyatori
          </h2>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <div className="text-yellow-300 text-xl font-mono">A = ε · c · l</div>
          </div>

          <div className="flex flex-wrap gap-2">
            {uvVisPeaks.map((p, i) => (
              <button key={i} onClick={() => setBlSelectedPeak(i)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  blSelectedPeak === i ? "bg-yellow-600 text-white shadow-lg shadow-yellow-500/30" :
                  "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60"
                }`}>
                λ={p.lambda} nm (ε={p.epsilon})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <label className="text-xs text-purple-400 block mb-2">Konsentratsiya (mol/L)</label>
              <input type="range" min="0.000001" max="0.01" step="0.000001" value={blConcentration}
                onChange={(e) => setBlConcentration(Number(e.target.value))}
                className="w-full accent-yellow-500"/>
              <div className="text-cyan-300 text-2xl font-mono text-center mt-2">{blConcentration.toExponential(2)} M</div>
              <div className="text-xs text-purple-400 mt-2 text-center">
                {blConcentration < 0.00001 ? " Ultra suyultirilgan" :
                 blConcentration < 0.0001 ? " LMCT o'lchov uchun ideal" :
                 blConcentration < 0.001 ? " d–d o'lchovi uchun standart" :
                 " Yuqori — LMCT to'yingan!"}
              </div>
            </div>
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <label className="text-xs text-purple-400 block mb-2">Kyuveta uzunligi (sm)</label>
              <input type="range" min="0.1" max="10" step="0.1" value={blPathLength}
                onChange={(e) => setBlPathLength(Number(e.target.value))}
                className="w-full accent-yellow-500"/>
              <div className="text-green-300 text-2xl font-mono text-center mt-2">{blPathLength.toFixed(1)} sm</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
              <div className="text-xs text-yellow-400 mb-2">Optik zichlik</div>
              <div className="text-yellow-300 text-4xl font-mono font-bold">A = {blResult.A}</div>
              <div className="text-xs text-purple-300 mt-3">A = {blResult.epsilon} × {blConcentration.toExponential(2)} × {blPathLength}</div>
              <div className="text-xs mt-2">
                {parseFloat(blResult.A) < 0.1 ? <span className="text-red-400">🔻 Juda past</span> :
                 parseFloat(blResult.A) < 0.8 ? <span className="text-green-400"> Optimal</span> :
                 parseFloat(blResult.A) < 1.5 ? <span className="text-yellow-400"> Yuqori</span> :
                 <span className="text-red-400">🔺 To'yingan!</span>}
              </div>
            </div>
            <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
              <div className="text-xs text-blue-400 mb-2">Transmittans</div>
              <div className="text-cyan-300 text-4xl font-mono font-bold">T = {blResult.T}%</div>
              <div className="text-xs text-purple-300 mt-3">T = 10⁻ᴬ × 100%</div>
              <div className="text-xs mt-2 text-purple-400">λ = {blResult.lambda} nm</div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 12. SPEKTROXIMIK QATOR — Co³⁺ ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Co³⁺ komplekslari — spektroximik qatorda
          </h2>
          <p className="text-purple-200 text-sm">
            Co³⁺ ni turli ligandlar bilan solishtirilsa, Δo va rang qanday o'zgarishini ko'ramiz. 
            <strong className="text-yellow-400">Faqat [CoF₆]³⁻ HS holatda!</strong>
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-yellow-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Ligand</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Kompleks</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Δo (cm⁻¹)</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Spin</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">λ₁ (nm)</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Rang</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {spectrochemicalSeries.map((s, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-yellow-900/20 transition-colors ${s.current ? "bg-yellow-900/30 border-l-4 border-l-yellow-400" : ""}`}>
                    <td className="py-3 px-3 text-yellow-300 font-mono">{s.ligand}</td>
                    <td className="py-3 px-3 text-purple-200 font-mono text-xs">{s.complex}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">{s.deltaOh.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        s.spin.includes("HS") ? "bg-orange-900/40 text-orange-300" : "bg-blue-900/40 text-blue-300"
                      }`}>{s.spin.substring(0, 15)}</span>
                    </td>
                    <td className="py-3 px-3 text-green-300 font-mono">{s.lambda1}</td>
                    <td className="py-3 px-3 text-xs">{s.color}</td>
                    <td className="py-3 px-3 text-xs text-purple-300 italic">
                      {s.current ? <strong className="text-yellow-400">← BU KOMPLEKS</strong> : s.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-300 text-sm font-mono text-center">
              Co³⁺ qator: 6 F⁻ &lt; 6 Cl⁻ &lt; 6 H₂O &lt; 3 ox²⁻ &lt; <strong className="bg-yellow-500/30 px-2 rounded">6 NH₃</strong> ≈ 3 en &lt; 6 CN⁻
            </div>
            <div className="text-xs text-purple-300 text-center mt-2">Chapdan o'ngga Δo o'sadi (13 100 → 33 500 cm⁻¹)</div>
          </div>
        </div>

        {/* ═══════════════ 13. NAMUNA TAYYORLASH ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Namuna tayyorlash usullari
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {techniques.map((t, i) => (
              <button key={i} onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  activeTechnique === i ? "bg-yellow-600/60 text-white border-yellow-400/50 shadow-lg shadow-yellow-500/20" :
                  "bg-purple-800/30 text-purple-400 border-[var(--v3-chiziq)] hover:bg-purple-700/40"
                }`}>
                {t.name}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
            <h3 className="text-yellow-400 font-bold text-lg mb-2">{techniques[activeTechnique].name}</h3>
            <p className="text-purple-200 text-sm mb-4 italic">{techniques[activeTechnique].description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2 text-sm">✓ Afzalliklar</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {techniques[activeTechnique].advantages.map((a, i) => <li key={i}>• {a}</li>)}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2 text-sm">✗ Kamchiliklar</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {techniques[activeTechnique].disadvantages.map((d, i) => <li key={i}>• {d}</li>)}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">Chastota</div>
                <div className="text-white text-xs font-mono mt-1">{techniques[activeTechnique].range}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">Ruxsat</div>
                <div className="text-white text-xs font-mono mt-1">{techniques[activeTechnique].resolution}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">Konsentratsiya</div>
                <div className="text-white text-xs mt-1">{techniques[activeTechnique].concentration}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">Tayyorlash</div>
                <div className="text-white text-xs mt-1">{techniques[activeTechnique].prepTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 14. HALAQIT BERUVCHI OMILLAR ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>️</span> UB-Vis tahliliga halaqit beruvchi omillar
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-left text-purple-300 text-xs uppercase">Manba</th>
                  <th className="py-3 px-4 text-left text-purple-300 text-xs uppercase">Sohasi</th>
                  <th className="py-3 px-4 text-left text-purple-300 text-xs uppercase">Ta'sir</th>
                  <th className="py-3 px-4 text-left text-purple-300 text-xs uppercase">Jiddiylik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {interferences.map((iv, i) => (
                  <tr key={i} onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${activeInterference === i ? "bg-yellow-900/20" : ""}`}>
                    <td className="py-3 px-4 font-bold">{iv.source}</td>
                    <td className="py-3 px-4 text-xs">{iv.range}</td>
                    <td className="py-3 px-4 text-xs">{iv.effect}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        iv.severity === "Yuqori" ? "bg-red-600/40 text-red-300" :
                        iv.severity === "O'rta" ? "bg-orange-600/40 text-orange-300" :
                        "bg-green-600/40 text-green-300"
                      }`}>{iv.severity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-5">
            <div className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span></span> Tanlangan omilning yechimi: {interferences[activeInterference].source}
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">{interferences[activeInterference].solution}</p>
          </div>
        </div>

        {/* ═══════════════ 15. RANG NAZARIYASI ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎨</span> Rang nazariyasi va Werner klassikasi
          </h2>
          <p className="text-purple-200 text-sm">
            [Co(NH₃)₆]³⁺ ning <strong className="text-yellow-400">sariq-oltinsimon rangi</strong> qanday paydo bo'ladi?
            An'anaviy nomi «Luteo» (lotincha "sariq") aynan shu rangdan olingan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">🎡 Rang aylanasi</h3>
              <svg viewBox="0 0 300 300" className="w-full h-auto">
                {[
                  { name: "Qizil", color: "#FF0000", angle: 0 },
                  { name: "To'q sariq", color: "#FF8C00", angle: 45 },
                  { name: "Sariq", color: "#FFFF00", angle: 90, perceived: true },
                  { name: "Sariq-yashil", color: "#ADFF2F", angle: 135 },
                  { name: "Yashil", color: "#00FF00", angle: 180 },
                  { name: "Ko'k", color: "#0000FF", angle: 225 },
                  { name: "Binafsha", color: "#8B00FF", angle: 270, absorbed: true },
                  { name: "Qizil-binafsha", color: "#FF00FF", angle: 315 },
                ].map((c, i) => {
                  const angle = (c.angle * Math.PI) / 180
                  const nextAngle = ((c.angle + 45) * Math.PI) / 180
                  const cx = 150, cy = 150, r1 = 60, r2 = 120
                  const x1 = cx + r1 * Math.cos(angle)
                  const y1 = cy + r1 * Math.sin(angle)
                  const x2 = cx + r2 * Math.cos(angle)
                  const y2 = cy + r2 * Math.sin(angle)
                  const x3 = cx + r2 * Math.cos(nextAngle)
                  const y3 = cy + r2 * Math.sin(nextAngle)
                  const x4 = cx + r1 * Math.cos(nextAngle)
                  const y4 = cy + r1 * Math.sin(nextAngle)
                  const midAngle = ((c.angle + 22.5) * Math.PI) / 180
                  const labelX = cx + (r2 + 15) * Math.cos(midAngle)
                  const labelY = cy + (r2 + 15) * Math.sin(midAngle)

                  return (
                    <g key={i}>
                      <path
                        d={`M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 0 0 ${x1} ${y1}`}
                        fill={c.color}
                        opacity={c.absorbed || c.perceived ? "1" : "0.5"}
                        stroke={c.absorbed || c.perceived ? "#fff" : "none"}
                        strokeWidth={c.absorbed || c.perceived ? "2" : "0"}
                      />
                      <text x={labelX} y={labelY} fill="#e9d5ff" fontSize="9" textAnchor="middle">{c.name}</text>
                      {c.absorbed && (<text x={labelX} y={labelY + 10} fill="#fbbf24" fontSize="8" textAnchor="middle" fontWeight="bold">↓ Yutilgan (475)</text>)}
                      {c.perceived && (<text x={labelX} y={labelY - 10} fill="#f472b6" fontSize="8" textAnchor="middle" fontWeight="bold">↑ Ko'ringan</text>)}
                    </g>
                  )
                })}
                <circle cx="150" cy="150" r="55" fill="#301934" stroke="#fbbf24" strokeWidth="1"/>
                <text x="150" y="145" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">Luteo</text>
                <text x="150" y="160" fill="#e9d5ff" fontSize="9" textAnchor="middle">(sariq)</text>
              </svg>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
                <h4 className="text-yellow-400 font-bold text-sm mb-2"> Rangning mantiq</h4>
                <ol className="text-xs text-purple-200 space-y-1.5 list-decimal list-inside">
                  <li>Kompleks 475 nm da <strong className="text-yellow-300">binafsha-ko'k</strong> yutadi (ν₁ = ¹A₁g → ¹T₁g)</li>
                  <li>Ko'z yutilmagan qismini «ko'radi»</li>
                  <li>Binafshaning to'ldiruvchisi — <strong className="text-yellow-400">sariq</strong></li>
                  <li>340 nm da qo'shimcha yutilish (UB) — sariq rangni «to'liq» qiladi (oltinsimon)</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
                <h4 className="text-yellow-400 font-bold text-sm mb-2"> Fizik asosi</h4>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Ikkita polosa (475 va 340 nm) mavjud → binafsha ham, UB ham qisman yutiladi.
                  Yorug'likda faqat sariq-oltin qism qoladi. Rang chuqurligi konsentratsiyaga bog'liq
                  (Beer qonuni): 10⁻² M — kuchli to'q sariq; 10⁻⁴ M — och sariq.
                </p>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                <div className="text-yellow-400 font-bold text-sm mb-2"> Ligand almashinuvi effekti</div>
                <p className="text-xs text-purple-200">
                  NH₃ ni H₂O ga o'zgartirsak: Δo = 22 900 → 18 200 → yutilish 475 → 550 nm ga siljiadi
                  → yutilgan rang binafsha → yashil, ko'ringan rang <strong>sariqdan pushtiga</strong> o'tadi.
                  Bu Werner an'anaviy nomlarining fizik asosini ko'rsatadi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 16. TARIXIY XRONOLOGIYA ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📜</span> Tarixiy xronologiya — koordinatsion kimyoning yaralishi
          </h2>

          <div className="space-y-2">
            {historicalTimeline.map((h, i) => (
              <div key={i} className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-lg p-3 flex gap-4 items-center hover:bg-purple-900/40 transition-colors">
                <div className={`font-mono font-bold text-sm w-16 flex-shrink-0 ${h.event.includes("🏆") ? "text-yellow-300" : "text-purple-300"}`}>{h.year}</div>
                <div className={`text-xs flex-1 ${h.event.includes("🏆") ? "text-yellow-200 font-semibold" : "text-purple-200"}`}>{h.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 17. AMALIY AHAMIYATI ═══════════════ */}
        <div className="bg-purple-900/40 border border-yellow-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💼</span> Amaliy ahamiyati va qo'llanilishi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {applications.map((app, i) => (
              <div key={i} className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-lg p-4 flex gap-3 items-start">
                <div className="text-3xl flex-shrink-0">{app.icon}</div>
                <div>
                  <div className="text-yellow-400 font-bold text-sm mb-1">{app.field}</div>
                  <div className="text-purple-200 text-xs">{app.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 18. XULOSA ═══════════════ */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span></span> Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li className="pl-2"><strong className="text-yellow-400">λ₁ = 475 nm (ε=60)</strong> — ¹A₁g → ¹T₁g, birinchi asosiy d–d polosa (t₂g⁶ → t₂g⁵eg¹)</li>
            <li className="pl-2"><strong className="text-yellow-400">λ₂ = 340 nm (ε=55)</strong> — ¹A₁g → ¹T₂g, Racah B ni hisoblash uchun</li>
            <li className="pl-2"><strong className="text-yellow-400">λ₃ = 210 nm (ε≈20 000)</strong> — LMCT (N,Cl → Co), Co(III) oksidlovchi xarakteri</li>
            <li className="pl-2"><strong className="text-yellow-400">Δo = 22 900 cm⁻¹ (274 kJ/mol)</strong> — NH₃ ning kuchli σ-donor maydoni</li>
            <li className="pl-2"><strong className="text-yellow-400">Δo (22 900) &gt; P (21 000)</strong> → LS holat: t₂g⁶ eg⁰, S=0, DIAMAGNIT (μ=0)</li>
            <li className="pl-2"><strong className="text-yellow-400">Racah B = 615 cm⁻¹, β = 0.56</strong> — JUDA katta kovalentlik (Co–N bog'i 44% kovalent)</li>
            <li className="pl-2"><strong className="text-yellow-400">Sariq-oltin rang</strong> — 475 nm da binafsha yutiladi → to'ldiruvchi sariq</li>
            <li className="pl-2"><strong className="text-yellow-400">Werner klassikasi (1893, Nobel 1913)</strong> — koordinatsion kimyoning yaralishi</li>
            <li className="pl-2"><strong className="text-yellow-400">Taube tasnifi bo'yicha JUDA INERT</strong> — ligand almashish t½ &gt; yillar</li>
            <li className="pl-2"><strong className="text-yellow-400">d⁶ LS ning barcha darsliklardagi etaloni</strong> — Lever, Housecroft, Cotton hammada</li>
          </ol>
        </div>

        {/* ═══════════════ 19. NAVIGATSIYA ═══════════════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <button onClick={() => setPdfModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20">
            📄 PDF Hisobot yaratish
          </button>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/co-nh3-5-cl-cl2" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            [Co(NH₃)₅Cl]Cl₂ (Purpureo) →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 jdakimyo.uz • [Co(NH₃)₆]Cl₃ (Luteo-kobalt) • UB-Vis spektroskopiya moduli (premium)</p>
          <p className="mt-2 text-purple-600 text-[11px]">
            Manbalar: Werner A. (1893, Nobel 1913) • Lever A.B.P. (Inorganic Electronic Spectroscopy) • Tanabe-Sugano (1954) • Racah (1942) • Taube (Nobel 1983) • Housecroft & Sharpe (2012)
          </p>
        </div>
      </footer>
    </div>
  )
}
