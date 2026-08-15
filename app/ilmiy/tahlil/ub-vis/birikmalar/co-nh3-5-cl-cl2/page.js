"use client"

import Link from "next/link"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"
import { useState, useMemo, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₅Cl]Cl₂ — UB-VIS SPEKTROSKOPIYA (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar:
//   • A. B. P. Lever — Inorganic Electronic Spectroscopy (2nd ed., Elsevier, 1984)
//   • A. Werner — Z. anorg. Chem. 3, 267 (1893) — Nobel mukofoti (1913)
//   • Y. Tanabe, S. Sugano — J. Phys. Soc. Japan 9, 753 (1954)
//   • H. Bethe — Ann. Physik 3, 133 (1929) — Crystal Field Theory
//   • J. H. Van Vleck — J. Chem. Phys. 3, 807 (1935) — Ligand Field Theory
//   • G. Racah — Phys. Rev. 62, 438 (1942)
//   • C. K. Jørgensen — Absorption Spectra and Chemical Bonding (Pergamon, 1962)
//   • F. Basolo, R. G. Pearson — Mechanisms of Inorganic Reactions (Wiley, 1967)
//   • H. Taube — Chem. Rev. 50, 69 (1952) — inert kompleks tasnifi (Nobel 1983)
//   • Housecroft & Sharpe — Inorganic Chemistry (4th ed., Pearson, 2012)
//   • S. F. A. Kettle — Physical Inorganic Chemistry (Oxford, 2013)
// Til: 100% o'zbek (lotin)
// Xususiyat: Simmetriya buzilishi (Oh→C₄ᵥ), polosa yorilishi, akvatsiya kinetika
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>Cl]Cl<sub>2</sub>",
  formulaPlain: "[Co(NH3)5Cl]Cl2",
  formulaCation: "[Co(NH<sub>3</sub>)<sub>5</sub>Cl]<sup>2+</sup>",
  iupac: "Pentaamminklorokobalt(III) xlorid",
  commonName: "Purpureo-kobalt (binafsha)",
  historicalName: "Werner klassikasi (1893) — 2-nomdagi kompleks",
  molarMass: 250.44,
  casNumber: "13859-51-3",
  color: "binafsha-qizil (purpureo)",
  colorHex: "#8B0080",
  absorbedHex: "#00FF80",
  structure: "Oktaedr (C₄ᵥ simmetriya, Oh dan buzilgan)",
  metalCenter: "Co³⁺",
  dConfig: "d⁶ LS",
  spinState: "Past spin (S = 0)",
  groundTerm: "¹A₁ (C₄ᵥ da ¹A₁g Oh dan pastroq)",
  freeIonTerm: "⁵D → ¹A₁g (LS, Oh) → ¹A₁ (C₄ᵥ)",
  metalLigand: "Co–N (4 ta ekvatorial + 1 aksial), Co–Cl (1 aksial)",
  crystalSystem: "Ortorombik yoki monoklinik",
  spaceGroup: "Pnma yoki P2₁/c",
  pointGroup: "C₄ᵥ (aksial simmetriya)",
  bondLengthCoN_eq: "1.96 Å (ekvatorial Co–N)",
  bondLengthCoN_ax: "1.98 Å (aksial Co–N, trans-Cl)",
  bondLengthCoCl: "2.29 Å (Co–Cl)",
  bondAngle: "88–92° (deyarli 90°)",
  deltaOh: 20500,
  deltaOhKJ: 245,
  ds: 3000, // tetragonal buzilish parametri
  dt: 800,
  racahB: 590,
  racahB0: 1100,
  beta: 0.536,
  pairingEnergy: 21000,
  cfseValue: "-2.4Δₒ + 2P (LS)",
  cfseKJ: 384,
  magneticMoment: 0,
  ligandField: "5 NH₃ + 1 Cl⁻ (aralash maydon, o'rtacha)",
  discovery: "1798 (Tassaert), 1893 (Werner tushuntirgan)",
  ionsInSolution: "3 ta (1 kation [Co(NH₃)₅Cl]²⁺ + 2 Cl⁻)",
  conductivity: "~260 S·sm²/mol (3-ionli elektrolit)",
  aquationRate: "k = 1.8×10⁻⁶ s⁻¹ (25°C, pH 7)  ~  t½ ≈ 4.5 kun",
  synthesis: "[Co(NH₃)₆]Cl₃ + HCl (konsentrlangan) → [Co(NH₃)₅Cl]Cl₂ + NH₄Cl (issiqlik ostida)",
}

// ═══════════════════════════════════════════════════════════════════════════════
// UB-VIS CHO'QQILARI — BATAFSIL ILMIY IZOHLAR
// ═══════════════════════════════════════════════════════════════════════════════
const uvVisPeaks = [
  {
    lambda: 530, energy: 18868, wavenumber: 18868, epsilon: 50,
    transition: "¹A₁ → ¹E (a)",
    transitionType: "d–d (¹T₁g yorilgan, past qismi)",
    color: "text-[var(--v3-xira)]",
    intensity: "O'rta", intensityCode: 2,
    symmetryLabel: "C₄ᵥ da ¹T₁g → ¹E + ¹A₂ yorilishi",
    selection: "Spin ruxsat (ΔS=0), Laport TAQIQ (g→g)",
    vibronicNote: "e vibronik moda orqali qisman ruxsat",
    energyKJ: 226,
    diagnostic: " Simmetriya buzilishining tasdig'i — Oh da yagona polosa edi, C₄ᵥ da 2 ga bo'lindi",
    theoryNote: "Oh (Luteo) da ¹A₁g → ¹T₁g bir polosa (475 nm) beradi. Cl⁻ ni koordinatsiya qilishi Oh simmetriyasini C₄ᵥ ga buzadi — z o'q Co–Cl bo'ylab yo'nalgan. Bu ta'sirda t₂g va eg orbitallar qo'shimcha yoriladi (tetragonal buzilish): eg → a₁ (dz²) + b₁ (dx²−y²). Shu tufayli Oh dagi yagona ¹T₁g holati C₄ᵥ da ¹E + ¹A₂ ga yoriladi. Bu polosa (530 nm) ¹E qismiga to'g'ri keladi va Luteo (475 nm) dan pastroq energiyada joylashadi, chunki Cl⁻ NH₃ dan zaifroq ligand.",
    lambdaMax_range: "525–540 nm",
    freqRange: "18 500–19 000 cm⁻¹",
    splitLabel: "Yorilish 1/2"
  },
  {
    lambda: 490, energy: 20408, wavenumber: 20408, epsilon: 45,
    transition: "¹A₁ → ¹A₂ (b)",
    transitionType: "d–d (¹T₁g yorilgan, yuqori qismi)",
    color: "text-pink-400",
    intensity: "O'rta-zaif", intensityCode: 2,
    symmetryLabel: "¹T₁g dan ¹A₂ ga (yelka sifatida)",
    selection: "Spin ruxsat, Laport taqiq",
    vibronicNote: "Ba'zan yelka sifatida ko'rinadi",
    energyKJ: 244,
    diagnostic: " Tetragonal buzilishning ikkinchi qismi (Ds, Dt hisoblash)",
    theoryNote: "¹T₁g ning yuqori qismi — ¹A₂. Bu polosa 490 nm da yelka sifatida ko'rinadi va ba'zan asosiy polosa (530) bilan qo'shilib chiqadi. E(¹E) va E(¹A₂) orasidagi farq bevosita tetragonal maydon parametrlarini (Ds, Dt) beradi: ΔE = 2Ds + 10Dt. Bu holatda ΔE ≈ 1540 cm⁻¹, Ds ≈ 3000, Dt ≈ 800 cm⁻¹. Ba'zi qattiq holat spektrlarida bu ikki polosa yaqqol farqlanadi.",
    lambdaMax_range: "480–495 nm",
    freqRange: "20 200–20 800 cm⁻¹",
    splitLabel: "Yorilish 2/2"
  },
  {
    lambda: 370, energy: 27027, wavenumber: 27027, epsilon: 45,
    transition: "¹A₁ → ¹E (b) + ¹B₁",
    transitionType: "d–d (¹T₂g yorilgan)",
    color: "text-orange-400",
    intensity: "O'rta", intensityCode: 2,
    symmetryLabel: "Oh ¹T₂g → C₄ᵥ ¹E + ¹B₁",
    selection: "Spin ruxsat, Laport taqiq",
    vibronicNote: "Vibronik ruxsat",
    energyKJ: 323,
    diagnostic: "Ikkinchi d–d polosa (Oh dagi 340 nm ga muvofiq)",
    theoryNote: "Luteo dagi ¹A₁g → ¹T₂g (340 nm) polosa Purpureo da ¹E(b) va ¹B₁ ga yoriladi. Farq kichik bo'lgani uchun (~500 cm⁻¹) odatda bir polosa sifatida ko'rinadi (370 nm). Cl⁻ zaifroq ligand tufayli bu polosa Luteo dagi 340 nm dan pastroq energiyada joylashadi (batokromik siljish). Racah B ni topish uchun ν₁ va ν₂ farqi ishlatiladi.",
    lambdaMax_range: "365–380 nm",
    freqRange: "26 000–27 500 cm⁻¹"
  },
  {
    lambda: 250, energy: 40000, wavenumber: 40000, epsilon: 12000,
    transition: "LMCT (Cl → Co)",
    transitionType: "LMCT (Cl⁻ pπ → Co³⁺ dσ)",
    color: "text-red-500",
    intensity: "Juda kuchli", intensityCode: 4,
    symmetryLabel: "pπ(Cl) → t₂g/eg (Co)",
    selection: "Laport RUXSAT + spin ruxsat",
    vibronicNote: "To'liq ruxsat",
    energyKJ: 479,
    diagnostic: " LMCT Cl⁻ dan — Purpureo ning binafsha-qizil rangining asosiy manbai",
    theoryNote: "Cl⁻ ligandidan Co³⁺ ga zaryad ko'chishi. Cl⁻ NH₃ dan yumshoqroq ligand (β kamayadi) va uning pπ orbitali Co³⁺ ning bo'sh d orbitallariga yaqin — LMCT past energiyada (250 nm) joylashadi. Luteo da ({[Co(NH₃)₆]³⁺}) faqat NH₃ ligandi bor edi, LMCT 210 nm da edi. Cl⁻ qo'shilishi bu polosani 40 nm ga batokromik siljitgan. Bu polosa ε ≈ 12 000 M⁻¹·sm⁻¹ — d–d dan 200 marta kuchli.",
    lambdaMax_range: "240–260 nm",
    freqRange: "38 000–42 000 cm⁻¹"
  },
  {
    lambda: 208, energy: 48077, wavenumber: 48077, epsilon: 22000,
    transition: "LMCT (N → Co) + IL",
    transitionType: "LMCT + Ligand ichi",
    color: "text-red-600",
    intensity: "Juda kuchli", intensityCode: 4,
    symmetryLabel: "n(N) → dσ + ligand ichi",
    selection: "Laport RUXSAT",
    vibronicNote: "To'liq ruxsat",
    energyKJ: 575,
    diagnostic: "NH₃ dan LMCT — Luteo dagi 210 nm ga muvofiq",
    theoryNote: "NH₃ dan LMCT — Luteo dagi tasmaga o'xshaydi, lekin biroz siljigan (208 nm). Bu polosa uzoq UB sohada joylashgan va odatda oddiy spektrometrda ko'rinmaydi (H₂O erituvchi cutoff 190 nm). Vakuum-UB (VUV) yoki maxsus kvarts kyuveta orqali o'lchanadi.",
    lambdaMax_range: "200–215 nm",
    freqRange: "46 500–50 000 cm⁻¹"
  },
  {
    lambda: 680, energy: 14706, wavenumber: 14706, epsilon: 0.05,
    transition: "¹A₁ → ³T₁g (spin-taqiq)",
    transitionType: "d–d (SPIN-TAQIQLANGAN)",
    color: "text-gray-400",
    intensity: "Juda zaif", intensityCode: 1,
    symmetryLabel: "Singlet → triplet",
    selection: "ΔS ≠ 0 — spin taqiqlangan",
    vibronicNote: "SOC orqali",
    energyKJ: 176,
    diagnostic: "LS holatining tasdig'i",
    theoryNote: "Spin-taqiqlangan yelka — Luteo dagiga o'xshash. ε ≈ 0.05 — deyarli sezilmaydi. Qattiq holat DRS spektrida yoki past haroratda (77 K) ko'rinadi. LS holatning nozik dalili — HS bo'lganda bu polosa boshqa joyda va ko'p (⁵T₂g → ⁵Eg) bo'lardi.",
    lambdaMax_range: "670–690 nm",
    freqRange: "14 500–14 900 cm⁻¹",
    hidden: true
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TO'LIQ SPEKTR NUQTALARI
// ═══════════════════════════════════════════════════════════════════════════════
const uvVisSpectrum = [
  { lambda: 200, absorbance: 4.5 }, { lambda: 208, absorbance: 4.4 },
  { lambda: 220, absorbance: 3.6 }, { lambda: 235, absorbance: 2.8 },
  { lambda: 250, absorbance: 2.4 }, { lambda: 265, absorbance: 1.5 },
  { lambda: 280, absorbance: 0.8 }, { lambda: 300, absorbance: 0.42 },
  { lambda: 320, absorbance: 0.35 }, { lambda: 340, absorbance: 0.42 },
  { lambda: 360, absorbance: 0.55 }, { lambda: 370, absorbance: 0.62 },
  { lambda: 380, absorbance: 0.55 }, { lambda: 400, absorbance: 0.32 },
  { lambda: 420, absorbance: 0.25 }, { lambda: 440, absorbance: 0.35 },
  { lambda: 460, absorbance: 0.50 }, { lambda: 480, absorbance: 0.62 },
  { lambda: 490, absorbance: 0.65 }, { lambda: 510, absorbance: 0.72 },
  { lambda: 530, absorbance: 0.75 }, { lambda: 550, absorbance: 0.62 },
  { lambda: 570, absorbance: 0.40 }, { lambda: 590, absorbance: 0.22 },
  { lambda: 620, absorbance: 0.10 }, { lambda: 650, absorbance: 0.05 },
  { lambda: 680, absorbance: 0.03 }, { lambda: 720, absorbance: 0.02 },
  { lambda: 780, absorbance: 0.02 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₆₋ₙClₙ] SERIYASI — SIMMETRIYA VA RANG O'ZGARISHI
// ═══════════════════════════════════════════════════════════════════════════════
const cobaltSeries = [
  { formula: "[Co(NH₃)₆]³⁺", trad: "Luteo (sariq)", colorHex: "#FFC300", symmetry: "Oh", lambda1: 475, deltaOh: 22900, split: "yo'q (yagona polosa)", current: false },
  { formula: "[Co(NH₃)₅Cl]²⁺", trad: "Purpureo (binafsha)", colorHex: "#8B0080", symmetry: "C₄ᵥ", lambda1: 530, deltaOh: 20500, split: "¹T₁g → ¹E + ¹A₂ (2 polosa)", current: true },
  { formula: "cis-[Co(NH₃)₄Cl₂]⁺", trad: "Violeo", colorHex: "#4B0082", symmetry: "C₂ᵥ", lambda1: 540, deltaOh: 19500, split: "3 polosa (yorilish katta)", current: false },
  { formula: "trans-[Co(NH₃)₄Cl₂]⁺", trad: "Praseo (yashil)", colorHex: "#009944", symmetry: "D₄ₕ", lambda1: 624, deltaOh: 19000, split: "2 polosa (kuchli yorilish)", current: false },
  { formula: "[Co(NH₃)₅H₂O]³⁺", trad: "Roseo (pushti)", colorHex: "#FF69B4", symmetry: "C₄ᵥ", lambda1: 495, deltaOh: 20800, split: "¹E + ¹A₂ (H₂O yumshoq)", current: false },
]

// ═══════════════════════════════════════════════════════════════════════════════
// AKVATSIYA KINETIKASI — [Co(NH₃)₅Cl]²⁺ + H₂O → [Co(NH₃)₅(H₂O)]³⁺ + Cl⁻
// ═══════════════════════════════════════════════════════════════════════════════
const kineticsData = [
  { pH: 1, k: "1.7×10⁻⁶", halfLife: "4.7 kun", note: "H⁺ ta'siri kam, sof akvatsiya" },
  { pH: 3, k: "1.8×10⁻⁶", halfLife: "4.5 kun", note: "Standart sharoit" },
  { pH: 5, k: "1.9×10⁻⁶", halfLife: "4.2 kun", note: "Kichik OH⁻ ta'siri" },
  { pH: 7, k: "2.5×10⁻⁶", halfLife: "3.2 kun", note: "Neytral muhit" },
  { pH: 9, k: "3.8×10⁻⁴", halfLife: "30 daq", note: "OH⁻ kataliz (base hydrolysis, SN1CB)" },
  { pH: 11, k: "1.2×10⁻²", halfLife: "1 daq", note: "Juda tez — deprotoniyalanish" },
  { pH: 13, k: "> 1", halfLife: "< 1 s", note: "Instant hidroliz" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// C₄ᵥ SIMMETRIYADA POLOSA YORILISHI (TETRAGONAL BUZILISH)
// ═══════════════════════════════════════════════════════════════════════════════
const splittingDiagram = [
  { ohState: "¹A₁g", c4vStates: [{ label: "¹A₁", relE: 0 }], note: "Yer holati saqlanadi (o'zgarmaydi)" },
  { ohState: "¹T₁g", c4vStates: [{ label: "¹E (a)", relE: 18868 }, { label: "¹A₂", relE: 20408 }], note: "Ikkiga yoriladi (Ds, Dt tufayli)" },
  { ohState: "¹T₂g", c4vStates: [{ label: "¹B₂", relE: 26500 }, { label: "¹E (b)", relE: 27500 }], note: "Ham ikkiga yoriladi" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HS vs LS TAQQOSLASH (Luteo bilan bir xil, chunki d⁶ LS)
// ═══════════════════════════════════════════════════════════════════════════════
const spinComparison = [
  { property: "Elektron konfiguratsiya", hs: "t₂g⁴ eg²", ls: "t₂g⁶ eg⁰", thisCompound: "LS ✓" },
  { property: "Toq elektronlar", hs: "4 ta", ls: "0 ta", thisCompound: "0 ✓" },
  { property: "Spin (S)", hs: "S = 2", ls: "S = 0", thisCompound: "S = 0" },
  { property: "Yer holati termi", hs: "⁵T₂g (Oh) / ⁵E (C₄ᵥ)", ls: "¹A₁g / ¹A₁", thisCompound: "¹A₁" },
  { property: "Magnit moment (μB)", hs: "4.90", ls: "0.00 (diamagnit)", thisCompound: "0.00 ✓" },
  { property: "Kutilgan Δo", hs: "< P (< 21 000)", ls: "> P (> 21 000)", thisCompound: "20 500 (chegara)" },
  { property: "Reaktsion tezligi", hs: "Labil", ls: "Inert", thisCompound: "Inert (biroz labilroq Luteo dan)" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// NAMUNA TAYYORLASH
// ═══════════════════════════════════════════════════════════════════════════════
const techniques = [
  {
    name: "0.1 M HCl eritmasi",
    description: "Kislotali sharoit akvatsiyani sekinlashtiradi. Standart o'lchov.",
    advantages: ["Akvatsiya bostirilgan", "Cl⁻ ionli kuchni saqlaydi", "24 soat stabil", "Aniq λmax"],
    disadvantages: ["Kuchli HCl xavfsizlik", "Yuqori ionli kuch", "UB da Cl⁻ biroz yutadi"],
    bestFor: "Sof spektroskopik o'lchov, Δo aniqlash",
    range: "220–800 nm", resolution: "0.5 nm", concentration: "10⁻³ M", prepTime: "5 daq"
  },
  {
    name: "Suvli eritma (yangi tayyorlangan)",
    description: "Distillangan suvda — lekin tez o'lchash zarur (akvatsiya boshlanadi).",
    advantages: ["Universal", "Kislotasiz", "Neytral pH ta'sirini o'rganish", "Kinetika uchun"],
    disadvantages: ["Akvatsiya boshlanadi (5 daq)", "Cl⁻ almashadi H₂O ga", "Rang o'zgaradi (binafsha → pushti)"],
    bestFor: "Akvatsiya kinetikasi kuzatish",
    range: "200–800 nm", resolution: "0.5 nm", concentration: "10⁻³ M", prepTime: "0 daq (tez)"
  },
  {
    name: "DRS (qattiq kristall)",
    description: "Binafsha kristall kukun BaSO₄ bilan aralashtirilib.",
    advantages: ["Akvatsiya yo'q", "Kristall panjara ta'siri", "Original rang", "Barqaror natijalar"],
    disadvantages: ["Kubelka-Munk konversiya", "ε qiymati bilvosita", "Kalibrash zarur"],
    bestFor: "Sof solid-state o'lchov",
    range: "200–2500 nm", resolution: "1 nm", concentration: "5% BaSO₄", prepTime: "10 daq"
  },
  {
    name: "Past harorat (77 K)",
    description: "N₂(l) da glisserol-suv (2:1) eritmasida. Polosalar aniq ko'rinadi.",
    advantages: ["¹E va ¹A₂ yorilishi aniq", "Spin-taqiq polosalar", "Yorilish o'lchash", "Rezolyutsiya oshadi"],
    disadvantages: ["Kriostat kerak", "Sekin o'lchov", "Cheklov: eritma muzlaydi"],
    bestFor: "Simmetriya buzilishini tasdiqlash",
    range: "200–1100 nm", resolution: "0.2 nm", concentration: "10⁻³ M", prepTime: "30 daq"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HALAQIT BERUVCHI OMILLAR — Purpureo ga xos
// ═══════════════════════════════════════════════════════════════════════════════
const interferences = [
  {
    source: "Akvatsiya (Cl⁻ → H₂O almashinuvi)",
    range: "530 nm da",
    effect: "Rang binafsha → pushti (Roseo, 495 nm) ga o'tadi, ε o'zgaradi",
    severity: "Yuqori",
    solution: "0.1 M HCl da eritish. Yangi tayyorlangan namuna. Sovutish (4°C). Tez o'lchash (< 5 daqiqa)."
  },
  {
    source: "Base hydrolysis (OH⁻ ta'siri)",
    range: "Butun spektr",
    effect: "pH > 8 da tezlik 200× ortadi (SN1CB mexanizm), kompleks parchalanadi",
    severity: "Yuqori",
    solution: "Neytral yoki kislotali muhit. NaOH dan qat'iy qochish. Bufer eritma (pH 4–6)."
  },
  {
    source: "LMCT polosa kuchi (Cl⁻)",
    range: "230–280 nm",
    effect: "ε ≈ 12 000 — d–d polosalarni bosadi, UB soha to'yingan",
    severity: "Yuqori",
    solution: "d–d o'lchov uchun 10⁻³ M, LMCT uchun 10⁻⁵ M. 1 sm va 0.1 sm kyuvetlar."
  },
  {
    source: "Yoruglik ta'sirida foto-akvatsiya",
    range: "UB polosada",
    effect: "hv (250 nm) → Cl⁻ chiqib ketadi, [Co(NH₃)₅H₂O]³⁺ hosil bo'ladi",
    severity: "O'rta",
    solution: "Qorong'uda saqlash. Tez skanerlash. Har o'lchovda yangi aliquot. UB filtr ishlatish."
  },
  {
    source: "Co(II) aralashmasi",
    range: "500–520 nm",
    effect: "[Co(H₂O)₆]²⁺ pushti (ε ≈ 5) — Purpureo binafsha rangini buzadi",
    severity: "O'rta",
    solution: "Sof kristall (qayta kristallizatsiya). Sintezda H₂O₂ to'liq ta'sir. Rentgen bilan tekshirish."
  },
  {
    source: "NH₄Cl aralashmasi (sintezdan)",
    range: "200–240 nm",
    effect: "NH₄⁺ UB da yutadi, bazaviy chiziq buziladi",
    severity: "O'rta",
    solution: "Namunani sovuq suvda yuvish. Qayta kristallizatsiya. Element analiz (EA) bilan sofligini tekshirish."
  },
  {
    source: "Cis/trans izomerizatsiya",
    range: "Butun spektr",
    effect: "Uzoq turishda cis-[Co(NH₃)₄Cl₂]⁺ ga o'tishi mumkin (past ehtimol)",
    severity: "Past",
    solution: "Sof kristallni oyda 1 marta yangilash. Sovuq, quruq joyda saqlash."
  },
  {
    source: "Ionli kuch effekti",
    range: "λmax da",
    effect: "Yuqori NaCl da ε biroz o'zgaradi (aktivlik koeffitsienti)",
    severity: "Past",
    solution: "Ionli kuchni bir xil ushlash (0.1 M NaClO₄). Debye-Hückel tuzatishi."
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TARIXIY XRONOLOGIYA
// ═══════════════════════════════════════════════════════════════════════════════
const historicalTimeline = [
  { year: "1798", event: "B. M. Tassaert [Co(NH₃)₆]Cl₃ ni oladi — Purpureo ham shu vaqtda kashf etilgan" },
  { year: "1822", event: "L. Gmelin Purpureo ni sistematik o'rganadi va nom beradi (lotincha 'purpureus')" },
  { year: "1875", event: "S. M. Jørgensen «Konstitutsion nazariya» bilan Purpureo va Praseo farqini izohlaydi (noto'g'ri)" },
  { year: "1893", event: "🏆 A. Werner Purpureo ni C₄ᵥ oktaedr sifatida ko'rsatib, ichki/tashqi Cl farqini isbotlaydi" },
  { year: "1899", event: "Werner elektr o'tkazuvchanlik bilan Luteo (4 ion) vs Purpureo (3 ion) ni ajratadi" },
  { year: "1907", event: "AgNO₃ tajribasi: Purpureo dan 2 ta Cl⁻ AgCl hosil qiladi, ichkisi (1 ta) qolgan" },
  { year: "1913", event: "🏆 Werner Nobel mukofoti — bu tajribalar asosida" },
  { year: "1929", event: "Bethe kristall maydon nazariyasi — C₄ᵥ simmetriyasidagi yorilish tushuntirildi" },
  { year: "1952", event: "🏆 Taube: Purpureo akvatsiya kinetikasi (SN1 mexanizmi) — Nobel 1983" },
  { year: "1965", event: "Basolo & Pearson: SN1CB (base hydrolysis) mexanizmi Purpureo uchun" },
  { year: "1980-", event: "DFT hisoblashlari C₄ᵥ simmetriyasidagi polosa yorilishini tasdiqlaydi" },
  { year: "2026", event: "🎓 O'zbekistonda jdakimyo.uz platformasida o'zbek tilida taqdimot" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// AMALIY AHAMIYATI
// ═══════════════════════════════════════════════════════════════════════════════
const applications = [
  { field: "Sintetik boshlang'ich modda", detail: "Barcha [Co(NH₃)₅X] komplekslar bu birikmadan olinadi (X = H₂O, NO₂, NCS, OH, N₃, ...)", icon: "" },
  { field: "Akvatsiya kinetikasi", detail: "SN1 mexanizmini o'rganishning etaloni (Taube ishlari, Nobel 1983)", icon: "⏱" },
  { field: "Simmetriya buzilishi tadqiqoti", detail: "Oh → C₄ᵥ buzilishning eng aniq spektroskopik namunasi", icon: "" },
  { field: "Werner ichki sferasi", detail: "Ichki (1 Cl) vs tashqi (2 Cl⁻) ni AgNO₃ bilan ajratish — klassik tajriba", icon: "⚗️" },
  { field: "Fotokimyo", detail: "UV nurlanishda foto-akvatsiya (Cl⁻ → H₂O) mexanizmi", icon: "☀️" },
  { field: "Nazariy hisoblashlar", detail: "DFT/TDDFT uchun C₄ᵥ simmetriyali benchmark", icon: "💻" },
  { field: "Rangning didaktik namuna", detail: "Purpureo → Roseo (akvatsiya) rang o'zgarishi ko'zga ko'rinadi", icon: "🎨" },
  { field: "Ionli o'tkazuvchanlik", detail: "3-ionli elektrolit sifatida Werner nazariyasining tasdig'i", icon: "" },
]

export default function CoNH35ClCl2UVVis() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [showHeader, setShowHeader] = useState(true)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(0)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [showSpinForbidden, setShowSpinForbidden] = useState(false)
  const [showLMCT, setShowLMCT] = useState(true)
  const [showSplitDetail, setShowSplitDetail] = useState(true)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfProgress, setPdfProgress] = useState(0)

  // Beer-Lambert kalkulyator
  const [blConcentration, setBlConcentration] = useState(0.001)
  const [blPathLength, setBlPathLength] = useState(1)
  const [blSelectedPeak, setBlSelectedPeak] = useState(0)

  // Akvatsiya kinetika simulyatori (yangi)
  const [kineticTime, setKineticTime] = useState(0) // soatlar
  const [kineticPH, setKineticPH] = useState(3)

  const spectrumRef = useRef(null)

  const visiblePeaks = uvVisPeaks.filter(p => !p.hidden || showSpinForbidden)

  // Optik zichlik hisoblash
  const blResult = useMemo(() => {
    const peak = uvVisPeaks[blSelectedPeak]
    const A = peak.epsilon * blConcentration * blPathLength
    const T = Math.pow(10, -A) * 100
    return { A: A.toFixed(3), T: T.toFixed(2), lambda: peak.lambda, epsilon: peak.epsilon }
  }, [blConcentration, blPathLength, blSelectedPeak])

  // Akvatsiya simulyatori
  const aquationSim = useMemo(() => {
    const kValues = { 1: 1.7e-6, 3: 1.8e-6, 5: 1.9e-6, 7: 2.5e-6, 9: 3.8e-4, 11: 1.2e-2, 13: 1.0 }
    const k = kValues[kineticPH] || 1.8e-6
    const tSeconds = kineticTime * 3600
    const fractionRemaining = Math.exp(-k * tSeconds)
    const fractionConverted = 1 - fractionRemaining
    const halfLifeSec = Math.log(2) / k
    const halfLifeReadable = halfLifeSec > 86400 ? `${(halfLifeSec/86400).toFixed(1)} kun` :
                            halfLifeSec > 3600 ? `${(halfLifeSec/3600).toFixed(1)} soat` :
                            halfLifeSec > 60 ? `${(halfLifeSec/60).toFixed(1)} daq` :
                            `${halfLifeSec.toFixed(1)} s`
    return {
      k, fractionRemaining: (fractionRemaining * 100).toFixed(1),
      fractionConverted: (fractionConverted * 100).toFixed(1),
      halfLife: halfLifeReadable
    }
  }, [kineticTime, kineticPH])

  // Racah B ni hisoblash (o'rtacha ν₁ ν₂ dan)
  const racahCalc = useMemo(() => {
    const nu1_avg = (uvVisPeaks[0].wavenumber + uvVisPeaks[1].wavenumber) / 2  // ~19638
    const nu2 = uvVisPeaks[2].wavenumber  // 27027
    const diff = nu2 - nu1_avg
    const B = diff / 12
    const B0 = 1100
    const beta = B / B0
    return {
      nu1: nu1_avg.toFixed(0), nu2, diff,
      B: B.toFixed(0), B0, beta: beta.toFixed(3),
      deltaOh: 20500,
    }
  }, [])

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
    return String(str).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/\s+/g, " ").trim()
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
        const regularBytes = await fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer() })
        const boldBytes = await fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer() })
        const italicBytes = await fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer() })
        regularFont = await pdfDoc.embedFont(regularBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(boldBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(italicBytes, { subset: true })
      } catch (fontErr) {
        alert("Font yuklanmadi. public/fonts/ da DejaVuSans*.ttf bo'lishi shart.")
        setPdfGenerating(false)
        return
      }
      setPdfProgress(20)

      const C = {
        purple: rgb(0.30, 0.11, 0.58), purpleDeep: rgb(0.15, 0.08, 0.35),
        purpleLight: rgb(0.86, 0.78, 1.0), purpleMid: rgb(0.55, 0.35, 0.85),
        pink: rgb(0.85, 0.30, 0.55), pinkDeep: rgb(0.55, 0.10, 0.40),
        pinkLight: rgb(0.98, 0.85, 0.92),
        violet: rgb(0.55, 0, 0.55), violetDeep: rgb(0.35, 0, 0.35),
        yellow: rgb(0.95, 0.75, 0.05), yellowDeep: rgb(0.60, 0.42, 0.02),
        textDark: rgb(0.08, 0.08, 0.16), textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0), green: rgb(0.08, 0.55, 0.31),
        blue: rgb(0.08, 0.35, 0.75), red: rgb(0.80, 0.20, 0.20),
        cyan: rgb(0.05, 0.65, 0.75), grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.94, 1.0), bgPink: rgb(1.0, 0.94, 0.97),
        bgViolet: rgb(0.98, 0.92, 0.98), bgYellow: rgb(1.0, 0.98, 0.86),
        bgBlue: rgb(0.94, 0.98, 1.0), bgGreen: rgb(0.94, 1.0, 0.98),
        bgRed: rgb(1.0, 0.95, 0.95), white: rgb(1, 1, 1),
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
        const lines = []; let current = ""
        for (const word of words) {
          const test = current ? current + " " + word : word
          if (measure(test, font, size) > maxWidth && current) { lines.push(current); current = word }
          else current = test
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
        lines.forEach((line, i) => page.drawText(line, { x, y: sy - i * lh, size, font, color }))
        return lines.length * lh
      }
      const addFooter = () => {
        const dateStr = new Date().toLocaleDateString("uz-UZ")
        const leftText = truncate(`jdakimyo.uz UB-Vis Tahlili  •  [Co(NH₃)₅Cl]Cl₂  •  ${dateStr}`, regularFont, 8, CONTENT_W - 30)
        page.drawText(leftText, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        const pageStr = `${pageNum}`
        const w = measure(pageStr, regularFont, 8)
        page.drawText(pageStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        page.drawLine({ start: { x: MARGIN, y: FOOTER_Y + 12 }, end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 }, thickness: 0.3, color: C.grayLine })
      }
      const addNewPage = () => { addFooter(); page = pdfDoc.addPage([PAGE_W, PAGE_H]); pageNum++; y = PAGE_H - MARGIN }
      const checkPageBreak = (need) => { if (y - need < FOOTER_Y + 25) addNewPage() }
      const drawSectionHeader = (num, title) => {
        checkPageBreak(45)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.violet })
        safeText(`${num}. ${title}`, { x: MARGIN + 10, y: y - 14, size: 13, font: boldFont, color: C.violetDeep, maxWidth: CONTENT_W - 15 })
        y -= 24
        page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.5, color: C.grayLine })
        y -= 14
      }
      const drawTableRow = (label, value, bgColor = C.bgViolet, labelColor = C.violetDeep) => {
        const rowH = 20, labelW = 200
        checkPageBreak(rowH + 2)
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor })
        safeText(label, { x: MARGIN + 6, y: y - 13, size: 9, font: boldFont, color: labelColor, maxWidth: labelW - 8 })
        const finalVal = truncate(cleanText(value), regularFont, 9, CONTENT_W - labelW - 12)
        page.drawText(finalVal, { x: MARGIN + labelW + 6, y: y - 13, size: 9, font: regularFont, color: C.textDark })
        y -= rowH
      }
      const drawInfoBox = (text, bgColor, borderColor, textColor) => {
        const padding = 10, maxW = CONTENT_W - 2 * padding
        const lines = wrapText(cleanText(text), regularFont, 9, maxW)
        const boxH = lines.length * 12 + 2 * padding
        checkPageBreak(boxH + 8)
        page.drawRectangle({ x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH, color: bgColor, borderColor: borderColor, borderWidth: 0.8 })
        lines.forEach((line, i) => page.drawText(line, { x: MARGIN + padding, y: y - padding - 10 - i * 12, size: 9, font: regularFont, color: textColor }))
        y -= boxH + 10
      }

      // ═══ SARLAVHA (BINAFSHA — Purpureo rangi) ═══
      page.drawRectangle({ x: 0, y: PAGE_H - 90, width: PAGE_W, height: 90, color: C.violetDeep })
      page.drawRectangle({ x: 0, y: PAGE_H - 92, width: PAGE_W, height: 4, color: C.violet })

      safeText("UB-VIS SPEKTROSKOPIYA TAHLILI", { x: PAGE_W / 2, y: PAGE_H - 40, size: 16, font: boldFont, color: C.white, align: "center" })
      safeText("[Co(NH₃)₅Cl]Cl₂ — Purpureo-kobalt (Werner klassikasi)", { x: PAGE_W / 2, y: PAGE_H - 60, size: 12, font: regularFont, color: C.bgViolet, align: "center" })
      safeText(`Sana: ${new Date().toLocaleDateString("uz-UZ")}  •  jdakimyo.uz  •  Simmetriya buzilishi: Oh → C₄ᵥ`, { x: PAGE_W / 2, y: PAGE_H - 78, size: 8, font: italicFont, color: C.bgViolet, align: "center" })

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
      drawTableRow("Nuqta guruhi:", COMPOUND.pointGroup)
      drawTableRow("Metall markazi:", `${COMPOUND.metalCenter} (${COMPOUND.dConfig})`)
      drawTableRow("Yer holati termi:", COMPOUND.groundTerm)
      drawTableRow("Δo qiymati:", `${COMPOUND.deltaOh.toLocaleString()} cm⁻¹ (${COMPOUND.deltaOhKJ} kJ/mol)`)
      drawTableRow("Ds, Dt (tetragonal):", `Ds = ${COMPOUND.ds} cm⁻¹, Dt = ${COMPOUND.dt} cm⁻¹`)
      drawTableRow("Racah B (β):", `${COMPOUND.racahB} cm⁻¹ (β = ${COMPOUND.beta})`)
      drawTableRow("Magnit moment:", `${COMPOUND.magneticMoment} μB (diamagnit)`)
      drawTableRow("Eritmadagi ionlar:", COMPOUND.ionsInSolution)
      drawTableRow("Elektr o'tkazuvchanlik:", COMPOUND.conductivity)
      drawTableRow("Akvatsiya tezligi (25°C):", COMPOUND.aquationRate)
      y -= 5
      setPdfProgress(40)

      // ═══ 2. NAZARIY ASOS ═══
      drawSectionHeader("2", "NAZARIY ASOS — SIMMETRIYA BUZILISHI (Oh → C₄ᵥ)")
      drawInfoBox(
        "[Co(NH₃)₅Cl]²⁺ da 6 ta ligand ekvivalent emas: 5 ta NH₃ va 1 ta Cl⁻ bor. " +
        "Cl⁻ ni Co ga aksial yo'nalishda bog'lanishi Oh simmetriyani C₄ᵥ ga buzadi. " +
        "Bu bir tomondan tetragonal buzilishga (elongatsiya z o'q bo'ylab) olib keladi. " +
        "Natijada Oh dagi yagona ¹T₁g holati C₄ᵥ da ikkiga yoriladi: ¹E (past, 530 nm) + ¹A₂ (yuqori, 490 nm yelka). " +
        "Bu polosa yorilishi simmetriya buzilishining eng aniq spektroskopik dalili.",
        C.bgViolet, C.violet, C.textDark
      )
      setPdfProgress(50)

      // ═══ 3. POLOSA YORILISHI JADVALI ═══
      drawSectionHeader("3", "POLOSA YORILISHI: Oh → C₄ᵥ")
      drawInfoBox(
        "Guruh nazariyasi bo'yicha yorilish jadvali:\n\n" +
        "Oh holati        →        C₄ᵥ holati(lar)i\n" +
        "─────────────────────────────────────\n" +
        "¹A₁g (yer)       →        ¹A₁  (o'zgarmaydi)\n" +
        "¹T₁g              →        ¹E  +  ¹A₂  (2 ga bo'linadi)\n" +
        "¹T₂g              →        ¹B₂  +  ¹E   (2 ga bo'linadi)\n\n" +
        "Amaliyotda:\n" +
        "  530 nm (18 868 cm⁻¹) — ¹A₁ → ¹E (past)\n" +
        "  490 nm (20 408 cm⁻¹) — ¹A₁ → ¹A₂ (yuqori, yelka)\n" +
        "  Farq = 1 540 cm⁻¹ → tetragonal buzilishning miqdori\n\n" +
        "Ds va Dt parametrlarini hisoblash: ΔE(¹E − ¹A₂) = 2Ds + 10Dt → Ds ≈ 3000, Dt ≈ 800 cm⁻¹",
        C.bgPink, C.pink, C.textDark
      )
      setPdfProgress(60)

      // ═══ 4. YUTILISH POLOSALARI JADVALI ═══
      drawSectionHeader("4", "YUTILISH POLOSALARI JADVALI")
      const rowH = 32
      const cols = [
        { label: "λ (nm)", w: 55 }, { label: "ν̃ (cm⁻¹)", w: 70 },
        { label: "ε", w: 55 }, { label: "O'tish", w: 130 },
        { label: "Tur", w: 70 }, { label: "Intensivlik", w: 90 },
      ]
      let colX = MARGIN
      page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.purpleMid })
      cols.forEach(c => { safeText(c.label, { x: colX + 4, y: y - 12, size: 8, font: boldFont, color: C.white, maxWidth: c.w - 6 }); colX += c.w })
      y -= 18

      uvVisPeaks.forEach((p, i) => {
        checkPageBreak(rowH + 2)
        const bgc = i % 2 === 0 ? C.bgViolet : C.white
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgc })
        colX = MARGIN
        const values = [`${p.lambda}`, `${p.wavenumber.toLocaleString()}`, `${p.epsilon}`, p.transition, p.transitionType.substring(0, 12), p.intensity.substring(0, 15)]
        values.forEach((v, idx) => { safeText(v, { x: colX + 4, y: y - 12, size: 8, font: regularFont, color: C.textDark, maxWidth: cols[idx].w - 6 }); colX += cols[idx].w })
        safeText(p.diagnostic, { x: MARGIN + 4, y: y - 24, size: 7, font: italicFont, color: C.violetDeep, maxWidth: CONTENT_W - 8 })
        y -= rowH
      })
      y -= 10
      setPdfProgress(70)

      // ═══ 5. HAR BIR POLOSANING NAZARIY IZOHI ═══
      drawSectionHeader("5", "POLOSALARNING BATAFSIL NAZARIY IZOHI")
      uvVisPeaks.filter(p => !p.hidden).forEach((p, i) => {
        checkPageBreak(85)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.bgViolet })
        safeText(`${i + 1}. ${p.transition}  —  λ = ${p.lambda} nm,  ε = ${p.epsilon}`, {
          x: MARGIN + 6, y: y - 12, size: 9, font: boldFont, color: C.violetDeep, maxWidth: CONTENT_W - 12
        })
        y -= 22
        const hh = drawWrappedText(p.theoryNote, {
          x: MARGIN + 8, y, size: 8.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W - 16, lineHeight: 11
        })
        y -= hh + 8
      })
      setPdfProgress(80)

      // ═══ 6. AKVATSIYA KINETIKASI ═══
      drawSectionHeader("6", "AKVATSIYA KINETIKASI — SN1 MEXANIZMI")
      drawInfoBox(
        "[Co(NH₃)₅Cl]²⁺ + H₂O  →  [Co(NH₃)₅(H₂O)]³⁺ + Cl⁻\n\n" +
        "Mexanizm (Taube, 1952): SN1 (Dissotsiativ) — Co–Cl bog'i uziladi va H₂O keladi.\n\n" +
        "Kinetik ma'lumotlar (25°C):\n" +
        "  pH 3:  k = 1.8×10⁻⁶ s⁻¹,  t½ = 4.5 kun (juda sekin)\n" +
        "  pH 7:  k = 2.5×10⁻⁶ s⁻¹,  t½ = 3.2 kun\n" +
        "  pH 9:  k = 3.8×10⁻⁴ s⁻¹,  t½ = 30 daq (OH⁻ katalizi!)\n" +
        "  pH 11: k = 1.2×10⁻² s⁻¹,  t½ = 1 daq (base hydrolysis)\n\n" +
        "Base hydrolysis mexanizmi (Basolo-Pearson, 1965):\n" +
        "  1) [Co(NH₃)₅Cl]²⁺ + OH⁻ → [Co(NH₃)₄(NH₂)Cl]⁺ + H₂O  (tez, deprotonlanish)\n" +
        "  2) [Co(NH₃)₄(NH₂)Cl]⁺ → [Co(NH₃)₄(NH₂)]²⁺ + Cl⁻  (sekin, SN1)\n" +
        "  3) [Co(NH₃)₄(NH₂)]²⁺ + H₂O → [Co(NH₃)₅(OH)]²⁺  (tez)\n" +
        "Bu SN1CB (Substrate Nucleophilic 1st order, Conjugate Base) deb ataladi.",
        C.bgBlue, C.blue, C.textDark
      )
      setPdfProgress(90)

      // ═══ 7. WERNER SERIYASI ═══
      drawSectionHeader("7", "WERNER KOORDINATSION SERIYASI VA POLOSA YORILISHI")
      drawInfoBox(
        "NH₃ ni Cl⁻ ga almashtirilganda simmetriya va rang qanday o'zgaradi:\n\n" +
        "  [Co(NH₃)₆]³⁺       Oh      475 nm    Luteo (sariq)     — yagona polosa\n" +
        "  [Co(NH₃)₅Cl]²⁺     C₄ᵥ    530 nm    Purpureo (binafsha) — 2 polosa (¹E+¹A₂) ← BU\n" +
        "  cis-[Co(NH₃)₄Cl₂]⁺ C₂ᵥ   540 nm    Violeo (to'q binafsha) — 3 polosa\n" +
        "  trans-[Co(NH₃)₄Cl₂]⁺ D₄ₕ 624 nm    Praseo (yashil) — 2 polosa (kuchli yorilish)\n\n" +
        "Har bir Cl⁻ qo'shilishi Δo ni pasaytiradi (Cl⁻ zaif ligand): 22 900 → 20 500 → 19 500 → 19 000\n" +
        "Rang batokromik siljish: sariq → binafsha → to'q binafsha → yashil (yutilish uzoqroq λ ga)",
        C.bgGreen, C.green, C.textDark
      )
      setPdfProgress(95)

      // ═══ 8. XULOSA ═══
      drawSectionHeader("8", "ASOSIY XULOSALAR")
      const conclusions = [
        `1. λ₁ = 530 nm (ε=50): ¹A₁ → ¹E — Oh ¹T₁g ning past qismi (C₄ᵥ da)`,
        `2. λ₂ = 490 nm (yelka, ε=45): ¹A₁ → ¹A₂ — Oh ¹T₁g ning yuqori qismi`,
        `3. Yorilish: ΔE = 1 540 cm⁻¹ → tetragonal buzilishning miqdori`,
        `4. Ds = 3 000, Dt = 800 cm⁻¹ — Cl⁻ ning zaif maydonining sonli o'lchovi`,
        `5. λ₃ = 370 nm: ¹A₁ → ¹E(b) + ¹B₁ — Oh ¹T₂g dan`,
        `6. Δo = 20 500 cm⁻¹ (Luteo 22 900 dan pastroq — Cl⁻ ta'siri)`,
        `7. Racah B = 590 cm⁻¹, β = 0.54 — Luteo (0.56) dan biroz kovalentroq`,
        `8. LMCT (Cl → Co) 250 nm da (ε=12 000) — binafsha rangning asosiy sababi`,
        `9. Akvatsiya (pH 7): t½ = 3.2 kun — Taube SN1 mexanizmining etaloni`,
        `10. Werner tajribasi: 3 ta ion, 2 Cl⁻ AgCl beradi (1 Cl⁻ ichki sferada)`,
      ]
      conclusions.forEach(c => {
        checkPageBreak(20)
        drawWrappedText(c, { x: MARGIN + 10, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W - 20, lineHeight: 12 })
        y -= 18
      })

      addFooter()
      setPdfProgress(100)

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Co-NH3-5-Cl-Cl2_UBVis_Tahlili_${new Date().toISOString().split("T")[0]}.pdf`
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
            <h3 className="text-2xl font-bold text-violet-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">📄</span> PDF Ilmiy Hisobot
            </h3>
            <p className="text-[var(--v3-matn)] text-sm mb-4">
              [Co(NH₃)₅Cl]Cl₂ ning UB-Vis spektroskopik tahlili haqida to'liq ilmiy hisobot yaratiladi.
            </p>
            <ul className="text-xs text-[var(--v3-matn)] space-y-1 mb-6 list-disc list-inside">
              <li>Umumiy ma'lumot va C₄ᵥ simmetriyasi</li>
              <li>Simmetriya buzilishi: Oh → C₄ᵥ</li>
              <li>Polosa yorilishi (¹T₁g → ¹E + ¹A₂)</li>
              <li>Tetragonal parametrlar Ds, Dt</li>
              <li>Δo, Racah B parametrlari</li>
              <li>Akvatsiya kinetikasi (SN1, Taube)</li>
              <li>Werner koordinatsion seriyasi</li>
              <li>Ilmiy xulosalar</li>
            </ul>

            {pdfGenerating && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-[var(--v3-matn)] mb-2">
                  <span>PDF yaratilmoqda...</span>
                  <span>{pdfProgress}%</span>
                </div>
                <div className="w-full bg-purple-900/40 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-pink-500 h-full transition-all duration-300" style={{ width: `${pdfProgress}%` }} />
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
                className="flex-1 bg-purple-800 hover:bg-purple-700 text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-50">
                Bekor qilish
              </button>
              <button onClick={generatePDF} disabled={pdfGenerating}
                className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white py-3 rounded-lg text-sm font-bold disabled:opacity-50">
                {pdfGenerating ? "⏳ Yaratilmoqda..." : "📥 PDF yuklab olish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ HEADER ═══════════════ */}
      {showHeader && (
        <header className="border-b border-violet-800/50 sticky top-0 z-40 bg-[var(--v3-fon-2)]/90 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-[var(--v3-xira)] flex-wrap">
              <Link href="/" className="hover:text-[var(--v3-matn)]"> Bosh</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-[var(--v3-matn)]">Tahlil</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/ub-vis" className="hover:text-[var(--v3-matn)]">UB-Vis</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="hover:text-[var(--v3-matn)]">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-violet-400 font-semibold">[Co(NH₃)₅Cl]Cl₂</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border-4 border-white/20 shadow-2xl" style={{background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}dd, ${COMPOUND.colorHex}99)`}}></div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-violet-400" dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <p className="text-[var(--v3-matn)] text-sm mt-1">{COMPOUND.iupac}</p>
                  <p className="text-violet-500/80 text-xs italic">{COMPOUND.commonName} • C₄ᵥ • Δo={COMPOUND.deltaOh.toLocaleString()} cm⁻¹</p>
                  <div className="flex gap-2 mt-1">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-violet-900/40 border border-violet-700/50 text-violet-300">
                       Simmetriya buzilishi
                    </span>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300">
                      ⏱ Akvatsiya kinetikasi
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setPdfModalOpen(true)}
                  className="text-xs bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-violet-500/20 font-bold">
                  📄 PDF Hisobot
                </button>
                <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-xs bg-purple-800/60 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                  ← Birikmalar
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      <button onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-40 px-3 py-2 rounded-lg text-xs font-bold shadow-lg bg-violet-600 hover:bg-violet-500 text-white">
        {showHeader ? "🔽" : "🔼"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══════════════ 1. UMUMIY MA'LUMOT ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="w-40 h-40 rounded-2xl border-4 border-white/20 shadow-2xl" style={{
                background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}, ${COMPOUND.colorHex}dd 40%, ${COMPOUND.colorHex}77 80%)`
              }}></div>
              <div className="text-center">
                <div className="text-xs text-[var(--v3-xira)]">Ko'rinuvchi rang</div>
                <div className="text-lg font-bold text-violet-400">{COMPOUND.color}</div>
              </div>
              <div className="w-32 h-4 rounded-full" style={{background: COMPOUND.absorbedHex}}></div>
              <div className="text-[10px] text-purple-500 text-center">Yutilgan (~530 nm, yashil)</div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-2xl font-bold text-white">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                </h2>
                <span className="text-xs px-3 py-1 rounded-full bg-violet-900/40 border border-violet-500/50 text-violet-300 font-bold">
                   C₄ᵥ simmetriya
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/50 text-blue-300 font-bold">
                  ⏱ SN1 kinetika
                </span>
              </div>
              <p className="text-[var(--v3-matn)] leading-relaxed text-sm">
                <strong className="text-violet-400">[Co(NH₃)₅Cl]Cl₂ (Purpureo-kobalt)</strong> — Werner klassikasining ikkinchi muhim namunasi.
                Luteo dan farqli o'laroq, bunda <strong className="text-violet-400">bitta Cl⁻ ligandi ichki koordinatsion sferaga</strong>
                bog'langan → Oh simmetriya <strong className="text-amber-300 font-bold">C₄ᵥ ga buziladi</strong>. Bu spektral yorilishga
                (¹T₁g → ¹E + ¹A₂) va rangning binafshaga o'zgarishiga olib keladi. Werner (1893) bu kompleks orqali
                <strong className="text-amber-300 font-bold"> ichki va tashqi koordinatsion sferani</strong> ajratib ko'rsatgan — koordinatsion nazariyaning
                asosiy dalili.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-blue-900/30 border border-blue-700/40 rounded-xl p-3 text-center">
                  <div className="text-blue-400 text-[10px] uppercase">Simmetriya</div>
                  <div className="text-white font-bold mt-1">C₄ᵥ</div>
                </div>
                <div className="bg-violet-900/30 border border-violet-700/40 rounded-xl p-3 text-center">
                  <div className="text-violet-400 text-[10px] uppercase">Yer holati</div>
                  <div className="text-white font-bold mt-1">¹A₁</div>
                </div>
                <div className="bg-pink-900/30 border border-pink-700/40 rounded-xl p-3 text-center">
                  <div className="text-pink-400 text-[10px] uppercase">Δo (cm⁻¹)</div>
                  <div className="text-white font-bold mt-1">{COMPOUND.deltaOh.toLocaleString()}</div>
                </div>
                <div className="bg-purple-900/30 border border-[var(--v3-chiziq)]/40 rounded-xl p-3 text-center">
                  <div className="text-[var(--v3-xira)] text-[10px] uppercase">Ionlar (H₂O)</div>
                  <div className="text-white font-bold mt-1">3 ta</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-xl overflow-hidden">
              <div className="bg-violet-900/30 px-4 py-2 border-b border-violet-700/30">
                <h3 className="text-violet-400 font-bold text-sm"> Fizik-kimyoviy xususiyatlar</h3>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">Molyar massa</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.molarMass} g/mol</td></tr>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">CAS raqami</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.casNumber}</td></tr>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">Kristall tizim</td><td className="py-2 px-4 text-white">{COMPOUND.crystalSystem}</td></tr>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">Nuqta guruhi</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.pointGroup}</td></tr>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">Co–N (ekv.)</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.bondLengthCoN_eq}</td></tr>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">Co–N (aks., trans-Cl)</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.bondLengthCoN_ax}</td></tr>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">Co–Cl</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.bondLengthCoCl}</td></tr>
                  <tr><td className="py-2 px-4 text-[var(--v3-xira)]">Kashfiyot</td><td className="py-2 px-4 text-white text-[11px]">{COMPOUND.discovery}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-xl overflow-hidden">
              <div className="bg-violet-900/30 px-4 py-2 border-b border-violet-700/30">
                <h3 className="text-violet-400 font-bold text-sm">⚛ Spektroskopik parametrlar</h3>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">Metall</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.metalCenter} (d⁶ LS)</td></tr>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">Δo</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.deltaOh.toLocaleString()} cm⁻¹</td></tr>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">Ds (tetragonal)</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.ds} cm⁻¹</td></tr>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">Dt (tetragonal)</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.dt} cm⁻¹</td></tr>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">Racah B</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.racahB} cm⁻¹ (β={COMPOUND.beta})</td></tr>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">CFSE</td><td className="py-2 px-4 text-white font-mono text-[11px]">{COMPOUND.cfseValue}</td></tr>
                  <tr className="border-b border-[var(--v3-chiziq)]"><td className="py-2 px-4 text-[var(--v3-xira)]">μeff</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.magneticMoment} μB (diamagnit)</td></tr>
                  <tr><td className="py-2 px-4 text-[var(--v3-xira)]">Akvatsiya (25°C, pH 7)</td><td className="py-2 px-4 text-white text-[10px]">{COMPOUND.aquationRate}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-violet-900/10 border border-violet-500/30 rounded-xl p-4">
            <div className="text-violet-400 font-bold text-sm mb-2"> Sintez usuli</div>
            <div className="text-xs text-[var(--v3-matn)] font-mono bg-purple-950/40 rounded p-3">{COMPOUND.synthesis}</div>
            <div className="text-xs text-[var(--v3-matn)] mt-2">
              Luteo [Co(NH₃)₆]Cl₃ ni konsentrlangan HCl bilan qizdirilsa, bitta NH₃ ligandi Cl⁻ ga almashadi. Sariq kristallardan
              <strong className="text-violet-300"> binafsha-qizil</strong> Purpureo hosil bo'ladi. Bu birinchi tarixiy sintez —
              Tassaert (1798) va Werner (1893) tomonidan takomillashtirilgan.
            </div>
          </div>
        </div>

        {/* ═══════════════ 2. NAZARIY ASOS — SIMMETRIYA BUZILISHI ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔷</span> Nazariy asos: Simmetriya buzilishi Oh → C₄ᵥ
          </h2>

          <p className="text-[var(--v3-matn)] leading-relaxed text-sm">
            <strong className="text-violet-400">Purpureo</strong> ning kalit xususiyati — <strong className="text-amber-400 font-bold">simmetriya
            buzilishi</strong>. Luteo da 6 ta NH₃ ligandi ekvivalent (Oh), lekin bu erda 5 NH₃ + 1 Cl⁻ bor. Cl⁻ ni Co ga aksial
            bog'lanishi z o'qi bo'ylab <strong className="text-amber-400 font-bold">tetragonal buzilish</strong> beradi va simmetriya
            <strong className="text-amber-400 font-bold"> Oh dan C₄ᵥ ga pasayadi</strong>. Bu jarayonning spektral oqibatlari juda muhim.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-cyan-300 font-bold mb-3 flex items-center gap-2">
                <span></span> Oh vs C₄ᵥ simmetriyasi
              </h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-3">
                  <div className="text-amber-300 font-bold font-bold mb-1">Oh (Luteo)</div>
                  <div className="text-[var(--v3-matn)]">48 ta simmetriya elementi: E, 8C₃, 6C₂, 6C₄, 3C₂', i, 6S₄, 8S₆, 3σₕ, 6σd</div>
                  <div className="text-[var(--v3-matn)] text-[10px] mt-1">6 ta ekvivalent NH₃ ligandi</div>
                </div>
                <div className="text-center text-amber-400 font-bold font-bold">↓ Cl⁻ qo'shilishi</div>
                <div className="bg-violet-950/60 rounded p-3">
                  <div className="text-violet-300 font-bold mb-1">C₄ᵥ (Purpureo)</div>
                  <div className="text-[var(--v3-matn)]">8 ta simmetriya elementi: E, 2C₄, C₂, 2σᵥ, 2σd</div>
                  <div className="text-[var(--v3-matn)] text-[10px] mt-1">4 ekvatorial NH₃ + 1 aksial NH₃ + 1 Cl⁻ (aksial)</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-cyan-300 font-bold mb-3 flex items-center gap-2">
                <span></span> Yorilish jadvali
              </h3>
              <div className="space-y-2">
                {splittingDiagram.map((s, i) => (
                  <div key={i} className="bg-purple-950/60 rounded p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-300 font-bold font-mono font-bold">{s.ohState}</span>
                      <span className="text-[var(--v3-xira)]">→</span>
                      <span className="text-violet-300 font-mono">
                        {s.c4vStates.map(c => c.label).join(" + ")}
                      </span>
                    </div>
                    <div className="text-[10px] text-[var(--v3-xira)] mt-1 italic">{s.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">🎓 Tetragonal buzilish parametrlari:</strong>{" "}
              Ds va Dt qiymatlari <strong>Cl⁻ ligandning zaif maydonini</strong> kvantitativ o'lchaydi. Ekvatorial va aksial
              ligandlar orasidagi farq: 4 ekvatorial NH₃ (kuchli) + 1 aksial Cl⁻ (zaif). Ds ≈ 3000, Dt ≈ 800 cm⁻¹ →
              polosa yorilishi ~1500 cm⁻¹. Agar 2 ta Cl⁻ trans-holatda bo'lsa (Praseo, D₄ₕ), yorilish yanada kattaroq
              (~5000 cm⁻¹) — polosalar yaqqol farqlanadi.
            </p>
          </div>
        </div>

        {/* ═══════════════ 3. INTERAKTIV UB-VIS SPEKTRI ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈</span> Interaktiv UB-Vis yutilish spektri
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            Polosalarga <strong className="text-violet-400">ustiga bosing</strong>. <strong className="text-amber-400 font-bold">530 va
            490 nm</strong> — ¹T₁g ning yorilgan qismlari (bu Purpureo ning eng muhim xususiyati!).
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-4 overflow-x-auto">
            <svg viewBox="0 0 800 400" className="w-full h-auto" preserveAspectRatio="xMidYMid meet" ref={spectrumRef}>
              <defs>
                <linearGradient id="visSpec3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4B0082"/>
                  <stop offset="15%" stopColor="#8B00FF"/>
                  <stop offset="25%" stopColor="#0000FF"/>
                  <stop offset="40%" stopColor="#00FF00"/>
                  <stop offset="55%" stopColor="#FFFF00"/>
                  <stop offset="70%" stopColor="#FF8C00"/>
                  <stop offset="90%" stopColor="#FF0000"/>
                  <stop offset="100%" stopColor="#8B0000"/>
                </linearGradient>
                <linearGradient id="peakGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1"/>
                </linearGradient>
              </defs>

              <rect x={((400 - 200) / 580) * 800} y="320" width={((780 - 400) / 580) * 800} height="10" fill="url(#visSpec3)" opacity="0.6"/>
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

              <path d={spectrumPath} fill="none" stroke="#a855f7" strokeWidth="2"/>
              <path d={`${spectrumPath} L 800,300 L 0,300 Z`} fill="url(#peakGrad3)"/>

              {/* Yorilish soha ta'kidlash (490-530 nm) */}
              {showSplitDetail && (
                <g>
                  <rect x={((485 - 200) / 580) * 800} y="30" width={((540 - 485) / 580) * 800} height="270" fill="#fbbf24" opacity="0.08"/>
                  <text x={((512 - 200) / 580) * 800} y="45" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">
                    ¹T₁g yorilish sohasi
                  </text>
                </g>
              )}

              {visiblePeaks.filter(p => showLMCT || !p.transitionType.includes("LMCT")).map((p, origIdx) => {
                const i = uvVisPeaks.indexOf(p)
                const x = ((p.lambda - 200) / 580) * 800
                const spectrumPoint = uvVisSpectrum.find(sp => Math.abs(sp.lambda - p.lambda) < 20)
                const y = spectrumPoint ? 300 - (spectrumPoint.absorbance / 5) * 300 : 200
                const isSelected = selectedPeak === i
                const isHovered = hoveredPeak === i
                const isLMCT = p.transitionType.includes("LMCT")
                const isSpinForbid = p.transitionType.includes("SPIN")

                return (
                  <g key={i} onClick={() => setSelectedPeak(i)} onMouseEnter={() => setHoveredPeak(i)} onMouseLeave={() => setHoveredPeak(null)} className="cursor-pointer">
                    <line x1={x} y1={y - 5} x2={x} y2="15" stroke={isSelected ? "#fbbf24" : (isLMCT ? "#ef4444" : (isSpinForbid ? "#6b7280" : "#a855f7"))} strokeWidth={isSelected || isHovered ? "2" : "1"} strokeDasharray={isSelected ? "0" : "4 2"}/>
                    <circle cx={x} cy={y} r={isSelected || isHovered ? "8" : "5"} fill={isSelected ? "#fbbf24" : (isLMCT ? "#ef4444" : (isSpinForbid ? "#6b7280" : "#a855f7"))} stroke="#fff" strokeWidth="2"/>
                    <g>
                      <rect x={x - 30} y={5} width="60" height="20" rx="4" fill={isSelected ? "#fbbf24" : (isLMCT ? "#ef4444" : "#a855f7")} opacity="0.9"/>
                      <text x={x} y="18" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">{p.lambda} nm</text>
                    </g>
                    {(isSelected || isHovered) && (
                      <g>
                        <rect x={x - 60} y={y - 62} width="120" height="34" rx="4" fill="#4B0082" stroke="#fbbf24" strokeWidth="1"/>
                        <text x={x} y={y - 47} fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">{p.transition}</text>
                        <text x={x} y={y - 33} fill="#fbbf24" fontSize="9" textAnchor="middle">ε = {p.epsilon}</text>
                      </g>
                    )}
                  </g>
                )
              })}

              <text x="400" y="20" fill="#a855f7" fontSize="14" textAnchor="middle" fontWeight="bold">
                [Co(NH₃)₅Cl]²⁺ UB-Vis spektri (0.001 M, 0.1 M HCl)
              </text>
            </svg>

            <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-xs text-[var(--v3-matn)]">
                  <input type="checkbox" checked={showSpinForbidden} onChange={(e) => setShowSpinForbidden(e.target.checked)} className="accent-violet-500"/>
                  Spin-taqiqlangan polosani ko'rsatish
                </label>
                <label className="flex items-center gap-2 text-xs text-[var(--v3-matn)]">
                  <input type="checkbox" checked={showLMCT} onChange={(e) => setShowLMCT(e.target.checked)} className="accent-red-500"/>
                  LMCT (250, 208 nm)
                </label>
                <label className="flex items-center gap-2 text-xs text-[var(--v3-matn)]">
                  <input type="checkbox" checked={showSplitDetail} onChange={(e) => setShowSplitDetail(e.target.checked)} className="accent-yellow-500"/>
                  Yorilish sohasini ta'kidlash
                </label>
              </div>
            </div>
          </div>

          {/* Tanlangan polosa detali */}
          {selectedPeak !== null && (
            <div className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 border-2 border-violet-500/50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-2xl font-bold text-violet-400 mb-1">{uvVisPeaks[selectedPeak].transition}</h3>
                  <p className="text-[var(--v3-matn)] text-sm">{uvVisPeaks[selectedPeak].symmetryLabel}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {uvVisPeaks[selectedPeak].splitLabel && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-yellow-900/40 border-yellow-500 text-amber-300 font-bold">
                      🔷 {uvVisPeaks[selectedPeak].splitLabel}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    uvVisPeaks[selectedPeak].intensityCode === 4 ? "bg-red-900/40 border-red-500 text-red-300" :
                    uvVisPeaks[selectedPeak].intensityCode === 3 ? "bg-orange-900/40 border-orange-500 text-orange-300" :
                    uvVisPeaks[selectedPeak].intensityCode === 2 ? "bg-violet-900/40 border-violet-500 text-violet-300" :
                    "bg-gray-900/40 border-gray-500 text-gray-300"
                  }`}>
                    {uvVisPeaks[selectedPeak].intensity}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-[var(--v3-xira)] uppercase">λmax</div>
                  <div className="text-amber-300 font-bold font-mono font-bold">{uvVisPeaks[selectedPeak].lambda} nm</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-[var(--v3-xira)] uppercase">ν̃ (cm⁻¹)</div>
                  <div className="text-cyan-300 font-mono font-bold">{uvVisPeaks[selectedPeak].wavenumber.toLocaleString()}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-[var(--v3-xira)] uppercase">ε (M⁻¹·sm⁻¹)</div>
                  <div className="text-green-300 font-mono font-bold">{uvVisPeaks[selectedPeak].epsilon}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-[var(--v3-xira)] uppercase">E (kJ/mol)</div>
                  <div className="text-orange-300 font-mono font-bold">{uvVisPeaks[selectedPeak].energyKJ}</div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-3 mb-3">
                <div className="text-xs text-blue-400 font-bold mb-1"> Tanlash qoidasi:</div>
                <div className="text-sm text-[var(--v3-matn)]">{uvVisPeaks[selectedPeak].selection}</div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3 mb-3">
                <div className="text-xs text-amber-400 font-bold font-bold mb-1"> Diagnostik:</div>
                <div className="text-sm text-[var(--v3-matn)]">{uvVisPeaks[selectedPeak].diagnostic}</div>
              </div>
              <div className="bg-violet-900/20 border border-violet-700/40 rounded-lg p-4">
                <div className="text-xs text-violet-400 font-bold mb-2">🎓 Batafsil ilmiy izoh:</div>
                <div className="text-sm text-[var(--v3-matn)] leading-relaxed">{uvVisPeaks[selectedPeak].theoryNote}</div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 4. CHO'QQILAR JADVALI ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Yutilish polosalari — ilmiy tayinlash jadvali
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-violet-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">λ (nm)</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">ν̃ (cm⁻¹)</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">O'tish (C₄ᵥ)</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">Oh dan</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">ε</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">Tur</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">Diagnostika</th>
                </tr>
              </thead>
              <tbody>
                {uvVisPeaks.filter(p => !p.hidden || showSpinForbidden).map((p, i) => (
                  <tr key={i} onClick={() => setSelectedPeak(uvVisPeaks.indexOf(p))}
                    className={`border-b border-[var(--v3-chiziq)] hover:bg-violet-900/20 cursor-pointer transition-colors ${selectedPeak === uvVisPeaks.indexOf(p) ? "bg-violet-900/30" : ""}`}>
                    <td className="py-3 px-3 text-amber-300 font-bold font-mono font-bold">{p.lambda}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">{p.wavenumber.toLocaleString()}</td>
                    <td className="py-3 px-3 text-[var(--v3-matn)] font-mono text-xs">{p.transition}</td>
                    <td className="py-3 px-3 text-violet-300 font-mono text-xs">
                      {p.symmetryLabel.includes("¹T₁g") ? "¹T₁g" : p.symmetryLabel.includes("¹T₂g") ? "¹T₂g" : "—"}
                    </td>
                    <td className="py-3 px-3 text-green-300 font-mono">{p.epsilon}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        p.transitionType.includes("SPIN") ? "bg-gray-800/60 text-gray-400" :
                        p.transitionType.includes("LMCT") ? "bg-red-900/40 text-red-300" :
                        "bg-violet-900/40 text-violet-300"
                      }`}>{p.transitionType.substring(0, 12)}</span>
                    </td>
                    <td className="py-3 px-3 text-xs text-[var(--v3-matn)] italic">{p.diagnostic.substring(0, 45)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════ 5. YORILISH DIAGRAMMASI (SVG) ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💠</span> Polosa yorilishi diagrammasi: Oh → C₄ᵥ
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            Bu diagrammada Luteo (Oh) va Purpureo (C₄ᵥ) energiyalari yonma-yon ko'rsatilgan. 
            <strong className="text-amber-400 font-bold"> ¹T₁g ning ikkiga yorilishi</strong> Purpureo ning eng aniq spektroskopik xususiyati.
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-6">
            <svg viewBox="0 0 800 450" className="w-full h-auto">
              {/* Chap taraf: Oh (Luteo) */}
              <text x="150" y="30" fill="#fbbf24" fontSize="14" textAnchor="middle" fontWeight="bold">Luteo [Co(NH₃)₆]³⁺ (Oh)</text>
              
              {/* Oh yer holati */}
              <line x1="80" y1="400" x2="220" y2="400" stroke="#22d3ee" strokeWidth="3"/>
              <text x="230" y="405" fill="#22d3ee" fontSize="11" fontWeight="bold">¹A₁g</text>
              <text x="80" y="418" fill="#a78bfa" fontSize="8">Yer (t₂g⁶ eg⁰)</text>

              {/* Oh ¹T₁g */}
              <line x1="80" y1="230" x2="220" y2="230" stroke="#fbbf24" strokeWidth="3"/>
              <text x="230" y="235" fill="#fbbf24" fontSize="11" fontWeight="bold">¹T₁g</text>
              <text x="80" y="223" fill="#fbbf24" fontSize="8">21 053 cm⁻¹ (475 nm)</text>

              {/* Oh ¹T₂g */}
              <line x1="80" y1="120" x2="220" y2="120" stroke="#f97316" strokeWidth="3"/>
              <text x="230" y="125" fill="#f97316" fontSize="11" fontWeight="bold">¹T₂g</text>
              <text x="80" y="113" fill="#f97316" fontSize="8">29 412 cm⁻¹ (340 nm)</text>

              {/* O'tish strelkalari (Luteo) */}
              <line x1="150" y1="395" x2="150" y2="240" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrLuteo)"/>
              <text x="140" y="320" fill="#fbbf24" fontSize="9" textAnchor="end">475 nm</text>
              <line x1="180" y1="395" x2="180" y2="130" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrLuteo2)"/>
              <text x="195" y="260" fill="#f97316" fontSize="9">340 nm</text>

              {/* Chegara chizig'i */}
              <line x1="380" y1="60" x2="380" y2="430" stroke="#a78bfa" strokeWidth="2" strokeDasharray="8 4"/>
              <text x="390" y="70" fill="#a78bfa" fontSize="11" fontWeight="bold">Cl⁻ qo'shilish</text>
              <text x="390" y="85" fill="#a78bfa" fontSize="9">Oh → C₄ᵥ buzilishi</text>

              {/* O'ng taraf: C₄ᵥ (Purpureo) */}
              <text x="600" y="30" fill="#a855f7" fontSize="14" textAnchor="middle" fontWeight="bold">Purpureo [Co(NH₃)₅Cl]²⁺ (C₄ᵥ)</text>

              {/* C4v yer holati */}
              <line x1="530" y1="400" x2="670" y2="400" stroke="#22d3ee" strokeWidth="3"/>
              <text x="680" y="405" fill="#22d3ee" fontSize="11" fontWeight="bold">¹A₁</text>
              <text x="530" y="418" fill="#a78bfa" fontSize="8">Yer (o'zgarmaydi)</text>

              {/* C4v ¹E (a) — pastroq, 530 nm */}
              <line x1="530" y1="250" x2="670" y2="250" stroke="#a855f7" strokeWidth="3"/>
              <text x="680" y="255" fill="#a855f7" fontSize="11" fontWeight="bold">¹E (a)</text>
              <text x="530" y="243" fill="#a855f7" fontSize="8">18 868 cm⁻¹ (530 nm)</text>

              {/* C4v ¹A₂ — yuqoriroq, 490 nm */}
              <line x1="530" y1="215" x2="670" y2="215" stroke="#ec4899" strokeWidth="3"/>
              <text x="680" y="220" fill="#ec4899" fontSize="11" fontWeight="bold">¹A₂</text>
              <text x="530" y="208" fill="#ec4899" fontSize="8">20 408 cm⁻¹ (490 nm)</text>

              {/* Yorilish ta'kidlash */}
              <path d="M 500 230 Q 480 230 480 250" stroke="#fbbf24" strokeWidth="1.5" fill="none"/>
              <path d="M 500 215 Q 480 215 480 215" stroke="#fbbf24" strokeWidth="1.5" fill="none"/>
              <text x="470" y="235" fill="#fbbf24" fontSize="9" textAnchor="end" fontWeight="bold">Yorilish</text>
              <text x="470" y="248" fill="#fbbf24" fontSize="8" textAnchor="end">ΔE = 1540 cm⁻¹</text>

              {/* C4v ¹E(b) va ¹B₁ */}
              <line x1="530" y1="130" x2="670" y2="130" stroke="#f97316" strokeWidth="3"/>
              <text x="680" y="135" fill="#f97316" fontSize="11" fontWeight="bold">¹E (b)</text>
              <line x1="530" y1="115" x2="670" y2="115" stroke="#fb923c" strokeWidth="3"/>
              <text x="680" y="120" fill="#fb923c" fontSize="11" fontWeight="bold">¹B₁</text>
              <text x="530" y="107" fill="#f97316" fontSize="8">~27 000 cm⁻¹ (370 nm)</text>

              {/* O'tish strelkalari (Purpureo) */}
              <line x1="580" y1="395" x2="580" y2="260" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrPurp1)"/>
              <text x="570" y="330" fill="#a855f7" fontSize="9" textAnchor="end">530 nm</text>
              <line x1="600" y1="395" x2="600" y2="225" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrPurp2)"/>
              <text x="610" y="310" fill="#ec4899" fontSize="9">490 nm</text>
              <line x1="620" y1="395" x2="620" y2="140" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrPurp3)"/>
              <text x="630" y="260" fill="#f97316" fontSize="9">370 nm</text>

              {/* Ohdan C₄ᵥ ga korrelatsiya chiziqlari */}
              <line x1="220" y1="230" x2="530" y2="215" stroke="#ec4899" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.6"/>
              <line x1="220" y1="230" x2="530" y2="250" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.6"/>
              <line x1="220" y1="120" x2="530" y2="115" stroke="#fb923c" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.6"/>
              <line x1="220" y1="120" x2="530" y2="130" stroke="#f97316" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.6"/>
              <line x1="220" y1="400" x2="530" y2="400" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.6"/>

              <defs>
                <marker id="arrLuteo" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><polygon points="0 0, 8 4, 0 8" fill="#fbbf24"/></marker>
                <marker id="arrLuteo2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><polygon points="0 0, 8 4, 0 8" fill="#f97316"/></marker>
                <marker id="arrPurp1" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><polygon points="0 0, 8 4, 0 8" fill="#a855f7"/></marker>
                <marker id="arrPurp2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><polygon points="0 0, 8 4, 0 8" fill="#ec4899"/></marker>
                <marker id="arrPurp3" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><polygon points="0 0, 8 4, 0 8" fill="#f97316"/></marker>
              </defs>

              <text x="400" y="445" fill="#a78bfa" fontSize="10" textAnchor="middle">
                Chapdagi 2 ta polosa → o'ngdagi 4 ta polosa (yorilish)
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-cyan-400 font-bold text-sm mb-1">¹A₁g → ¹A₁</div>
              <div className="text-xs text-[var(--v3-matn)]">Yer holati simmetriyani saqlaydi (Oh va C₄ᵥ da bir xil). Bu o'zgarish spektrga ta'sir qilmaydi.</div>
            </div>
            <div className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-4">
              <div className="text-violet-400 font-bold text-sm mb-1">¹T₁g → ¹E + ¹A₂</div>
              <div className="text-xs text-[var(--v3-matn)]">Yorilish ΔE = 1540 cm⁻¹ — 530 va 490 nm da 2 polosa. Purpureo ning eng nozik xususiyati!</div>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
              <div className="text-orange-400 font-bold text-sm mb-1">¹T₂g → ¹E + ¹B₁</div>
              <div className="text-xs text-[var(--v3-matn)]">Ham yoriladi, lekin farq kichik (~500 cm⁻¹) — bir polosa (370 nm) sifatida ko'rinadi.</div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 6. Ds VA Dt PARAMETRLARI ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Tetragonal maydon parametrlari: Ds va Dt
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            C₄ᵥ simmetriyasidagi buzilish ikki parametr — <strong className="text-amber-400 font-bold">Ds va Dt</strong> —
            bilan tavsiflanadi. Bular ekvatorial va aksial ligandlar farqini kvantitativ o'lchaydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-amber-400 font-bold font-bold mb-3">Ds parametri</h3>
              <div className="bg-purple-950/60 rounded-lg p-3 mb-3">
                <div className="text-amber-300 font-bold text-sm text-center my-2 font-mono">
                  Ds = (2/7) × [σ(NH₃) − σ(Cl⁻)]
                </div>
                <div className="text-[var(--v3-matn)] text-[10px] mt-2 space-y-1">
                  • σ — σ-donor sigma parametri<br/>
                  • Ligandlar σ-donorlik farqini o'lchaydi<br/>
                  • Ds &gt; 0 → aksial ligand kuchsizroq (Cl⁻ &lt; NH₃)<br/>
                  • Bu kompleksda Ds ≈ 3000 cm⁻¹
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-amber-400 font-bold font-bold mb-3">Dt parametri</h3>
              <div className="bg-purple-950/60 rounded-lg p-3 mb-3">
                <div className="text-amber-300 font-bold text-sm text-center my-2 font-mono">
                  Dt = (4/7) × [π(NH₃) − π(Cl⁻)]
                </div>
                <div className="text-[var(--v3-matn)] text-[10px] mt-2 space-y-1">
                  • π — π-bog'lanish parametri<br/>
                  • π-donor/akseptor farqini o'lchaydi<br/>
                  • Cl⁻ π-donor → Dt kichikroq<br/>
                  • Bu kompleksda Dt ≈ 800 cm⁻¹
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/10 border border-yellow-500/30 rounded-xl p-5">
            <h4 className="text-amber-300 font-bold font-bold text-sm mb-3">🧮 Ds, Dt ni polosa yorilishidan hisoblash:</h4>
            <div className="bg-purple-950/60 rounded p-4 font-mono text-xs text-[var(--v3-matn)] space-y-2">
              <div>E(¹A₂) − E(¹E) = 2Ds + 10Dt</div>
              <div>20 408 − 18 868 = 1 540 cm⁻¹</div>
              <div>2Ds + 10Dt = 1 540</div>
              <div className="text-amber-300 font-bold mt-2">Qo'shimcha ma'lumot (chastota polosalari) orqali: Ds = 3000, Dt = 800</div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">🎓 Amaliy ma'no:</strong> Ds va Dt qiymatlari qanchalik katta bo'lsa,
              tetragonal buzilish shunchalik katta va polosa yorilishi aniqroq. trans-[Co(NH₃)₄Cl₂]⁺ (Praseo, D₄ₕ)
              da 2 ta Cl⁻ trans-holatda → Ds va Dt yanada kattaroq (Ds ≈ 5500, Dt ≈ 1400 cm⁻¹) → polosalar aniq
              ajralib turadi. Bu <strong>simmetriya buzilishining miqdorini</strong> spektroskopik jihatdan aniqlash imkonini beradi.
            </p>
          </div>
        </div>

        {/* ═══════════════ 7. AKVATSIYA KINETIKASI SIMULYATORI ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⏱</span> Interaktiv: Akvatsiya kinetikasi simulyatori (Taube SN1)
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            [Co(NH₃)₅Cl]²⁺ + H₂O → [Co(NH₃)₅(H₂O)]³⁺ + Cl⁻ (Taube, 1952 — <strong className="text-amber-400 font-bold">Nobel 1983</strong>).
            pH va vaqtni o'zgartirib qoldiq kompleks foizini kuzating.
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="flex justify-between text-xs text-[var(--v3-xira)] mb-2">
                  <span>pH</span>
                  <span className="text-violet-300 font-mono font-bold">{kineticPH}</span>
                </div>
                <input type="range" min="1" max="13" step="2" value={kineticPH}
                  onChange={(e) => setKineticPH(Number(e.target.value))}
                  className="w-full accent-violet-500"/>
                <div className="flex justify-between text-[10px] text-purple-500 mt-1">
                  <span className="text-green-400">1 (HCl)</span>
                  <span className="text-amber-400 font-bold">7 (neytral)</span>
                  <span className="text-red-400">13 (NaOH)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[var(--v3-xira)] mb-2">
                  <span>Vaqt (soat)</span>
                  <span className="text-violet-300 font-mono font-bold">
                    {kineticTime < 1 ? `${(kineticTime * 60).toFixed(0)} daq` :
                     kineticTime < 24 ? `${kineticTime.toFixed(1)} soat` :
                     `${(kineticTime/24).toFixed(1)} kun`}
                  </span>
                </div>
                <input type="range" min="0" max="168" step="0.5" value={kineticTime}
                  onChange={(e) => setKineticTime(Number(e.target.value))}
                  className="w-full accent-violet-500"/>
                <div className="flex justify-between text-[10px] text-purple-500 mt-1">
                  <span>0 daq</span>
                  <span>3.5 kun</span>
                  <span>7 kun</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
                <div className="text-xs text-violet-400 mb-2">Purpureo qoldig'i</div>
                <div className="text-violet-300 text-3xl font-mono font-bold">{aquationSim.fractionRemaining}%</div>
                <div className="text-[10px] text-purple-500 mt-2">binafsha rang</div>
              </div>
              <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
                <div className="text-xs text-pink-400 mb-2">Roseo hosil bo'ldi</div>
                <div className="text-pink-300 text-3xl font-mono font-bold">{aquationSim.fractionConverted}%</div>
                <div className="text-[10px] text-purple-500 mt-2">pushti rang</div>
              </div>
              <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
                <div className="text-xs text-amber-400 font-bold mb-2">Yarim yashash (t½)</div>
                <div className="text-amber-300 font-bold text-2xl font-mono font-bold">{aquationSim.halfLife}</div>
                <div className="text-[10px] text-purple-500 mt-2">k = {aquationSim.k.toExponential(1)} s⁻¹</div>
              </div>
            </div>

            {/* Visual rang o'zgarishi */}
            <div className="p-4 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)]">
              <div className="text-xs text-[var(--v3-xira)] mb-2">Rangning o'zgarishi (progress):</div>
              <div className="w-full h-8 rounded-full overflow-hidden flex">
                <div className="h-full transition-all duration-300" 
                     style={{background: "#8B0080", width: `${aquationSim.fractionRemaining}%`}}></div>
                <div className="h-full transition-all duration-300"
                     style={{background: "#FF69B4", width: `${aquationSim.fractionConverted}%`}}></div>
              </div>
              <div className="flex justify-between text-[10px] text-[var(--v3-xira)] mt-2">
                <span>Purpureo (binafsha)</span>
                <span>Roseo (pushti)</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-violet-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">pH</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">k (s⁻¹)</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">Yarim yashash (t½)</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {kineticsData.map((k, i) => (
                  <tr key={i} className={`border-b border-[var(--v3-chiziq)] ${kineticPH === k.pH ? "bg-violet-900/30" : ""}`}>
                    <td className="py-3 px-3 text-amber-300 font-bold font-mono font-bold">{k.pH}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">{k.k}</td>
                    <td className="py-3 px-3 text-green-300 font-mono">{k.halfLife}</td>
                    <td className="py-3 px-3 text-xs text-[var(--v3-matn)] italic">{k.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">🎓 SN1CB mexanizmi (Basolo-Pearson, 1965):</strong>{" "}
              Ishqoriy muhitda tezlik keskin oshadi. Mexanizm:{" "}
              <strong>(1)</strong> OH⁻ NH₃ ligandidan protonni oladi → [Co(NH₃)₄(NH₂)Cl]⁺ (konjugat asos);{" "}
              <strong>(2)</strong> NH₂⁻ Co ga π-donorlik ko'rsatib Co–Cl bog'ini zaiflashtiradi → Cl⁻ ajraladi (SN1);{" "}
              <strong>(3)</strong> H₂O keladi va NH₂ protonlanadi. Bu shu tufayli asosli hidroliz nomini oladi,
              lekin haqiqatan asos konjugat asos hosil qiladi, hujum qilmaydi. Nobel mukofoti (Taube, 1983) shu ish uchun berilgan.
            </p>
          </div>
        </div>

        {/* ═══════════════ 8. Δo va RACAH B HISOBI ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧮</span> Δo va Racah B parametrini spektrdan hisoblash
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            Purpureo uchun hisob-kitob murakkabroq — <strong className="text-amber-400 font-bold">ν₁ va ν₂ ning yorilishini
            hisobga olib</strong> o'rtacha energiyani ishlatamiz.
          </p>

          <div className="space-y-3">
            {[
              { step: 1, task: "Yorilgan ν₁ o'rtachasi", formula: "ν₁_avg = (18 868 + 20 408) / 2 = 19 638 cm⁻¹", result: "" },
              { step: 2, task: "Ikkinchi polosa", formula: "ν₂ (¹A₁ → ¹E(b)+¹B₁) = 27 027 cm⁻¹ (370 nm)", result: "" },
              { step: 3, task: "Farqni hisoblash", formula: "ν₂ − ν₁_avg = 27 027 − 19 638 = 7 389 cm⁻¹", result: "" },
              { step: 4, task: "Racah B (12B formulasi)", formula: "B = 7 389 / 12 ≈ 616 cm⁻¹  (aniq eksp: 590 cm⁻¹)", result: "B = 590 cm⁻¹" },
              { step: 5, task: "Δo ni hisoblash", formula: "Δo ≈ ν₁_avg + 4B + 3C ≈ 20 500 cm⁻¹", result: "Δo = 20 500 cm⁻¹" },
              { step: 6, task: "Luteo bilan taqqoslash", formula: "Purpureo Δo (20 500) &lt; Luteo Δo (22 900)", result: "Cl⁻ zaifroq ligand" },
              { step: 7, task: "Nefelauksetik β", formula: "β = 590 / 1100 = 0.536", result: "β = 0.54 (Luteo dan biroz kovalentroq)" },
              { step: 8, task: "Ds va Dt", formula: "ΔE(¹E − ¹A₂) = 1 540 = 2Ds + 10Dt", result: "Ds ≈ 3000, Dt ≈ 800 cm⁻¹" },
            ].map((s, i) => (
              <div key={i} className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-4 flex gap-4 items-start">
                <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className="text-violet-300 font-semibold text-sm">{s.task}</div>
                  <div className="text-xs text-[var(--v3-matn)] mt-1 font-mono bg-purple-950/50 rounded p-2">{s.formula}</div>
                  {s.result && (<div className="text-xs text-green-300 mt-2 font-bold">➜ {s.result}</div>)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-violet-900/30 to-pink-900/30 border-2 border-violet-500/50 rounded-2xl p-6 mt-4">
            <h3 className="text-violet-400 font-bold text-lg mb-3"> Purpureo natijalari</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-[var(--v3-xira)] mb-1">Δo</div>
                <div className="text-2xl font-bold text-amber-300 font-bold">{COMPOUND.deltaOh.toLocaleString()}</div>
                <div className="text-[10px] text-purple-500">cm⁻¹</div>
              </div>
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-[var(--v3-xira)] mb-1">Racah B</div>
                <div className="text-2xl font-bold text-green-300">{COMPOUND.racahB}</div>
                <div className="text-[10px] text-purple-500">cm⁻¹</div>
              </div>
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-[var(--v3-xira)] mb-1">Ds</div>
                <div className="text-2xl font-bold text-violet-300">{COMPOUND.ds}</div>
                <div className="text-[10px] text-purple-500">cm⁻¹</div>
              </div>
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-[var(--v3-xira)] mb-1">Dt</div>
                <div className="text-2xl font-bold text-pink-300">{COMPOUND.dt}</div>
                <div className="text-[10px] text-purple-500">cm⁻¹</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 9. WERNER KOORDINATSION SERIYASI ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🏆</span> Werner koordinatsion seriyasi — Purpureo ni tanish
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            NH₃ ni Cl⁻ ga almashtirilganda simmetriya, Δo va rang qanday o'zgaradi:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-violet-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">Rang</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">Formula</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">An'anaviy nomi</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">Simmetriya</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">λ₁ (nm)</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">Δo (cm⁻¹)</th>
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">Yorilish</th>
                </tr>
              </thead>
              <tbody>
                {cobaltSeries.map((w, i) => (
                  <tr key={i} className={`border-b border-[var(--v3-chiziq)] hover:bg-violet-900/20 transition-colors ${w.current ? "bg-violet-900/30 border-l-4 border-l-violet-400" : ""}`}>
                    <td className="py-3 px-3">
                      <div className="w-8 h-8 rounded border-2 border-white/20" style={{background: w.colorHex}}></div>
                    </td>
                    <td className="py-3 px-3 text-amber-300 font-bold font-mono text-xs">{w.formula}</td>
                    <td className="py-3 px-3 text-[var(--v3-matn)] italic">{w.trad}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono font-bold">{w.symmetry}</td>
                    <td className="py-3 px-3 text-green-300 font-mono">{w.lambda1}</td>
                    <td className="py-3 px-3 text-orange-300 font-mono">{w.deltaOh.toLocaleString()}</td>
                    <td className="py-3 px-3 text-xs text-[var(--v3-matn)]">
                      {w.current ? <strong className="text-violet-400">← BU KOMPLEKS</strong> : w.split}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <h4 className="text-amber-300 font-bold font-bold text-sm mb-2">🎓 Werner tajribasi (1893) — koordinatsion sferani isbotlash</h4>
            <p className="text-xs text-[var(--v3-matn)] leading-relaxed">
              Werner AgNO₃ titrant bilan Purpureo ni tekshirdi: <strong className="text-violet-300">3 ta Cl⁻</strong> ionidan
              faqat <strong className="text-amber-300 font-bold">2 tasi</strong> AgCl cho'kmasiga tushdi. Uchinchi Cl⁻ ichki koordinatsion
              sferada Co bilan bog'langan — bu Werner nazariyasining birinchi empirik dalili edi. Luteo (4 ion, 3 Cl⁻ AgCl)
              va Purpureo (3 ion, 2 Cl⁻ AgCl) ni taqqoslash orqali <strong>ichki va tashqi sfera</strong> tushunchasi tug'ildi.
              Bu ish 1913 yilda Nobel mukofotini olib keldi.
            </p>
          </div>
        </div>

        {/* ═══════════════ 10. HS vs LS ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔀</span> Purpureo ham LS (Δo &gt; P)
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            Luteo dan Δo pastroq bo'lishiga qaramay, Purpureo hali ham LS holatda. Chunki 20 500 cm⁻¹ &gt; 21 000 cm⁻¹ chegara qiymatidan biroz past bo'lsa ham, aslida Co³⁺ da bir necha effektlar (Racah B kamayishi) LS ni afzal qiladi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-violet-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-violet-400 text-xs uppercase">Xususiyat</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">HS d⁶</th>
                  <th className="py-3 px-3 text-left text-blue-400 text-xs uppercase">LS d⁶</th>
                  <th className="py-3 px-3 text-left text-green-400 text-xs uppercase">BU KOMPLEKS</th>
                </tr>
              </thead>
              <tbody>
                {spinComparison.map((r, i) => (
                  <tr key={i} className="border-b border-[var(--v3-chiziq)] hover:bg-purple-900/30">
                    <td className="py-3 px-3 text-white font-semibold text-xs">{r.property}</td>
                    <td className="py-3 px-3 text-orange-300 font-mono text-xs">{r.hs}</td>
                    <td className="py-3 px-3 text-blue-300 font-mono text-xs">{r.ls}</td>
                    <td className="py-3 px-3 text-green-300 font-mono text-xs font-bold">{r.thisCompound}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════ 11. INTERAKTIV BEER-LAMBERT ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Interaktiv Beer-Lambert kalkulyatori
          </h2>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <div className="text-amber-300 font-bold text-xl font-mono">A = ε · c · l</div>
          </div>

          <div className="flex flex-wrap gap-2">
            {uvVisPeaks.filter(p => !p.hidden).map((p, i) => (
              <button key={i} onClick={() => setBlSelectedPeak(i)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  blSelectedPeak === i ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" :
                  "bg-purple-800/40 text-[var(--v3-matn)] hover:bg-purple-700/60"
                }`}>
                λ={p.lambda} nm (ε={p.epsilon})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <label className="text-xs text-[var(--v3-xira)] block mb-2">Konsentratsiya (mol/L)</label>
              <input type="range" min="0.000001" max="0.01" step="0.000001" value={blConcentration}
                onChange={(e) => setBlConcentration(Number(e.target.value))}
                className="w-full accent-violet-500"/>
              <div className="text-cyan-300 text-2xl font-mono text-center mt-2">{blConcentration.toExponential(2)} M</div>
            </div>
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <label className="text-xs text-[var(--v3-xira)] block mb-2">Kyuveta uzunligi (sm)</label>
              <input type="range" min="0.1" max="10" step="0.1" value={blPathLength}
                onChange={(e) => setBlPathLength(Number(e.target.value))}
                className="w-full accent-violet-500"/>
              <div className="text-green-300 text-2xl font-mono text-center mt-2">{blPathLength.toFixed(1)} sm</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
              <div className="text-xs text-violet-400 mb-2">Optik zichlik</div>
              <div className="text-violet-300 text-4xl font-mono font-bold">A = {blResult.A}</div>
              <div className="text-xs text-[var(--v3-matn)] mt-3">A = {blResult.epsilon} × {blConcentration.toExponential(2)} × {blPathLength}</div>
            </div>
            <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
              <div className="text-xs text-blue-400 mb-2">Transmittans</div>
              <div className="text-cyan-300 text-4xl font-mono font-bold">T = {blResult.T}%</div>
              <div className="text-xs text-[var(--v3-matn)] mt-3">T = 10⁻ᴬ × 100%</div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 12. NAMUNA TAYYORLASH ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Namuna tayyorlash usullari
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {techniques.map((t, i) => (
              <button key={i} onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  activeTechnique === i ? "bg-violet-600/60 text-white border-violet-400/50 shadow-lg shadow-violet-500/20" :
                  "bg-purple-800/30 text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:bg-purple-700/40"
                }`}>
                {t.name}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
            <h3 className="text-violet-400 font-bold text-lg mb-2">{techniques[activeTechnique].name}</h3>
            <p className="text-[var(--v3-matn)] text-sm mb-4 italic">{techniques[activeTechnique].description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2 text-sm">✓ Afzalliklar</h4>
                <ul className="space-y-1 text-xs text-[var(--v3-matn)]">
                  {techniques[activeTechnique].advantages.map((a, i) => <li key={i}>• {a}</li>)}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2 text-sm">✗ Kamchiliklar</h4>
                <ul className="space-y-1 text-xs text-[var(--v3-matn)]">
                  {techniques[activeTechnique].disadvantages.map((d, i) => <li key={i}>• {d}</li>)}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-[var(--v3-xira)] text-[10px] uppercase">Diapazon</div>
                <div className="text-white text-xs font-mono mt-1">{techniques[activeTechnique].range}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-[var(--v3-xira)] text-[10px] uppercase">Ruxsat</div>
                <div className="text-white text-xs font-mono mt-1">{techniques[activeTechnique].resolution}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-[var(--v3-xira)] text-[10px] uppercase">Konsentratsiya</div>
                <div className="text-white text-xs mt-1">{techniques[activeTechnique].concentration}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-[var(--v3-xira)] text-[10px] uppercase">Tayyorlash</div>
                <div className="text-white text-xs mt-1">{techniques[activeTechnique].prepTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 13. HALAQIT BERUVCHI OMILLAR ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>️</span> UB-Vis tahliliga halaqit beruvchi omillar
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] bg-purple-950/50">
                  <th className="py-3 px-4 text-left text-[var(--v3-matn)] text-xs uppercase">Manba</th>
                  <th className="py-3 px-4 text-left text-[var(--v3-matn)] text-xs uppercase">Sohasi</th>
                  <th className="py-3 px-4 text-left text-[var(--v3-matn)] text-xs uppercase">Ta'sir</th>
                  <th className="py-3 px-4 text-left text-[var(--v3-matn)] text-xs uppercase">Jiddiylik</th>
                </tr>
              </thead>
              <tbody className="text-[var(--v3-matn)]">
                {interferences.map((iv, i) => (
                  <tr key={i} onClick={() => setActiveInterference(i)}
                    className={`border-b border-[var(--v3-chiziq)] hover:bg-purple-800/30 cursor-pointer ${activeInterference === i ? "bg-violet-900/20" : ""}`}>
                    <td className="py-3 px-4 font-bold text-xs">{iv.source}</td>
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
              <span></span> Yechim: {interferences[activeInterference].source}
            </div>
            <p className="text-xs text-[var(--v3-matn)] leading-relaxed">{interferences[activeInterference].solution}</p>
          </div>
        </div>

        {/* ═══════════════ 14. RANG NAZARIYASI ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎨</span> Purpureo (binafsha) rangi qanday paydo bo'ladi?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <h3 className="text-violet-400 font-bold mb-3">🎡 Rang aylanasi</h3>
              <svg viewBox="0 0 300 300" className="w-full h-auto">
                {[
                  { name: "Qizil", color: "#FF0000", angle: 0 },
                  { name: "To'q sariq", color: "#FF8C00", angle: 45 },
                  { name: "Sariq", color: "#FFFF00", angle: 90 },
                  { name: "Sariq-yashil", color: "#ADFF2F", angle: 135 },
                  { name: "Yashil", color: "#00FF00", angle: 180, absorbed: true },
                  { name: "Ko'k", color: "#0000FF", angle: 225 },
                  { name: "Binafsha", color: "#8B00FF", angle: 270, perceived: true },
                  { name: "Qizil-binafsha", color: "#FF00FF", angle: 315 },
                ].map((c, i) => {
                  const angle = (c.angle * Math.PI) / 180
                  const nextAngle = ((c.angle + 45) * Math.PI) / 180
                  const cx = 150, cy = 150, r1 = 60, r2 = 120
                  const x1 = cx + r1 * Math.cos(angle), y1 = cy + r1 * Math.sin(angle)
                  const x2 = cx + r2 * Math.cos(angle), y2 = cy + r2 * Math.sin(angle)
                  const x3 = cx + r2 * Math.cos(nextAngle), y3 = cy + r2 * Math.sin(nextAngle)
                  const x4 = cx + r1 * Math.cos(nextAngle), y4 = cy + r1 * Math.sin(nextAngle)
                  const midAngle = ((c.angle + 22.5) * Math.PI) / 180
                  const labelX = cx + (r2 + 15) * Math.cos(midAngle)
                  const labelY = cy + (r2 + 15) * Math.sin(midAngle)
                  return (
                    <g key={i}>
                      <path d={`M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 0 0 ${x1} ${y1}`}
                        fill={c.color} opacity={c.absorbed || c.perceived ? "1" : "0.5"}
                        stroke={c.absorbed || c.perceived ? "#fff" : "none"} strokeWidth={c.absorbed || c.perceived ? "2" : "0"}/>
                      <text x={labelX} y={labelY} fill="#e9d5ff" fontSize="9" textAnchor="middle">{c.name}</text>
                      {c.absorbed && (<text x={labelX} y={labelY + 10} fill="#fbbf24" fontSize="8" textAnchor="middle" fontWeight="bold">↓ Yutilgan (530)</text>)}
                      {c.perceived && (<text x={labelX} y={labelY - 10} fill="#a855f7" fontSize="8" textAnchor="middle" fontWeight="bold">↑ Ko'ringan</text>)}
                    </g>
                  )
                })}
                <circle cx="150" cy="150" r="55" fill="#301934" stroke="#a855f7" strokeWidth="1"/>
                <text x="150" y="145" fill="#a855f7" fontSize="10" textAnchor="middle" fontWeight="bold">Purpureo</text>
                <text x="150" y="160" fill="#e9d5ff" fontSize="9" textAnchor="middle">(binafsha)</text>
              </svg>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
                <h4 className="text-violet-400 font-bold text-sm mb-2"> Rangning mantiqi</h4>
                <ol className="text-xs text-[var(--v3-matn)] space-y-1.5 list-decimal list-inside">
                  <li>Kompleks 530 nm da <strong className="text-green-300">yashil</strong> yutadi</li>
                  <li>Yashilning to'ldiruvchisi — <strong className="text-violet-400">binafsha-qizil</strong></li>
                  <li>250 nm da qo'shimcha LMCT (Cl → Co) — chuqurroq binafsha</li>
                  <li>Natijada — <strong className="text-violet-300">purpureo</strong> (klassik binafsha-qizil)</li>
                </ol>
              </div>

              <div className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-4">
                <div className="text-violet-400 font-bold text-sm mb-2"> Luteo vs Purpureo rang farqi</div>
                <p className="text-xs text-[var(--v3-matn)] leading-relaxed">
                  <strong>Luteo</strong>: 475 nm (binafsha) yutadi → sariq ko'rinadi.<br/>
                  <strong>Purpureo</strong>: 530 nm (yashil) yutadi → binafsha-qizil ko'rinadi.<br/>
                  Farq: Cl⁻ Δo ni pasaytiradi → yutilish uzunroq λ ga siljiadi → rang o'zgaradi.
                  Bu Werner an'anaviy nomlarining spektroskopik asosi.
                </p>
              </div>

              <div className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-4">
                <div className="text-pink-400 font-bold text-sm mb-2">💧 Akvatsiya rang o'zgarishi</div>
                <p className="text-xs text-[var(--v3-matn)]">
                  Purpureo (binafsha) suvda turishda → <strong className="text-pink-300">Roseo (pushti)</strong> ga o'tadi.
                  Bu chunki Cl⁻ H₂O ga almashadi va Δo biroz oshadi (20 500 → 20 800). Ko'zga ko'rinadigan didaktik namuna!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 15. TARIXIY XRONOLOGIYA ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📜</span> Tarixiy xronologiya — Purpureo va koordinatsion nazariya
          </h2>

          <div className="space-y-2">
            {historicalTimeline.map((h, i) => (
              <div key={i} className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-lg p-3 flex gap-4 items-center hover:bg-purple-900/40 transition-colors">
                <div className={`font-mono font-bold text-sm w-16 flex-shrink-0 ${h.event.includes("🏆") ? "text-amber-300 font-bold" : "text-[var(--v3-matn)]"}`}>{h.year}</div>
                <div className={`text-xs flex-1 ${h.event.includes("🏆") ? "text-yellow-200 font-semibold" : "text-[var(--v3-matn)]"}`}>{h.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 16. AMALIY AHAMIYATI ═══════════════ */}
        <div className="bg-purple-900/40 border border-violet-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💼</span> Amaliy ahamiyati va qo'llanilishi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {applications.map((app, i) => (
              <div key={i} className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-lg p-4 flex gap-3 items-start">
                <div className="text-3xl flex-shrink-0">{app.icon}</div>
                <div>
                  <div className="text-violet-400 font-bold text-sm mb-1">{app.field}</div>
                  <div className="text-[var(--v3-matn)] text-xs">{app.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 17. XULOSA ═══════════════ */}
        <div className="bg-gradient-to-r from-violet-600/10 to-pink-600/10 border border-violet-500/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span></span> Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-[var(--v3-matn)] list-decimal list-inside">
            <li className="pl-2"><strong className="text-violet-400">λ₁ = 530 nm (ε=50)</strong>: ¹A₁ → ¹E — Oh dagi ¹T₁g ning past qismi</li>
            <li className="pl-2"><strong className="text-violet-400">λ₂ = 490 nm (yelka, ε=45)</strong>: ¹A₁ → ¹A₂ — ¹T₁g ning yuqori qismi</li>
            <li className="pl-2"><strong className="text-violet-400">Polosa yorilishi ΔE = 1 540 cm⁻¹</strong> — simmetriya buzilishining aniq spektroskopik dalili</li>
            <li className="pl-2"><strong className="text-violet-400">λ₃ = 370 nm (ε=45)</strong>: ¹A₁ → ¹E(b) + ¹B₁ — Oh ¹T₂g dan</li>
            <li className="pl-2"><strong className="text-violet-400">λ₄ = 250 nm (ε≈12 000)</strong>: LMCT (Cl → Co) — binafsha rangning asosiy sababi</li>
            <li className="pl-2"><strong className="text-violet-400">Δo = 20 500 cm⁻¹</strong> — Luteo (22 900) dan pastroq, Cl⁻ zaifroq ligand</li>
            <li className="pl-2"><strong className="text-violet-400">Ds = 3000, Dt = 800 cm⁻¹</strong> — tetragonal buzilish parametrlari</li>
            <li className="pl-2"><strong className="text-violet-400">Racah B = 590 cm⁻¹, β = 0.54</strong> — Luteo dan biroz kovalentroq</li>
            <li className="pl-2"><strong className="text-violet-400">LS holat</strong> — 3 ta polosa, S=0, diamagnit (μ=0)</li>
            <li className="pl-2"><strong className="text-violet-400">Akvatsiya: t½ = 3.2 kun (pH 7)</strong> — inert kompleks, SN1 mexanizmi (Taube, Nobel 1983)</li>
            <li className="pl-2"><strong className="text-violet-400">Werner tajribasi</strong> — 3 ion, 2 Cl⁻ AgCl beradi (ichki sfera dalili, Nobel 1913)</li>
            <li className="pl-2"><strong className="text-violet-400">Sintez etaloni</strong> — barcha [Co(NH₃)₅X] komplekslarga boshlang'ich modda</li>
          </ol>
        </div>

        {/* ═══════════════ 18. NAVIGATSIYA ═══════════════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/co-nh3-6-cl3" className="px-6 py-3 border border-yellow-500 rounded-xl hover:bg-yellow-900/30 text-amber-300 font-bold transition-all">
            ← [Co(NH₃)₆]Cl₃ (Luteo)
          </Link>
          <button onClick={() => setPdfModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20">
            📄 PDF Hisobot yaratish
          </button>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/co-en3-cl3" className="px-6 py-3 bg-violet-600/80 rounded-xl hover:bg-violet-500 text-white font-semibold transition-all">
            [Co(en)₃]Cl₃ →
          </Link>
        </div>

      </section>

      <footer className="border-t border-[var(--v3-chiziq)] py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 jdakimyo.uz • [Co(NH₃)₅Cl]Cl₂ (Purpureo-kobalt) • UB-Vis spektroskopiya moduli (premium)</p>
          <p className="mt-2 text-purple-600 text-[11px]">
            Manbalar: Werner A. (1893, Nobel 1913) • Taube H. (1952, Nobel 1983) • Basolo-Pearson (1965) • Lever A.B.P. • Tanabe-Sugano (1954)
          </p>
        </div>
      </footer>
    </div>
  )
}
