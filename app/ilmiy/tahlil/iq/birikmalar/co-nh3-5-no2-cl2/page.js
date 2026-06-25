"use client"

import Link from "next/link"
import { useState, useMemo, useEffect, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₅NO₂]Cl₂ — LINKAGE IZOMERIZM (PREMIUM, TUZATILGAN)
// Manbalar: Penland et al. (JACS 1956), Grenthe & Nordin (1979),
//           Heyns & de Waal (1989), Jackson (1988), Naumov (2013)
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// PENLAND 1956 DIAGNOSTIK JADVALI — Klassik adabiyot (JACS 78, 887)
// ═══════════════════════════════════════════════════════════════════════════════
const penlandDiagnostics = [
  {
    mode: "νₐₛ(NO₂)",
    nitro: 1430,
    nitrito: "—",
    deltaNu: "—",
    diagnostic: "Faqat nitro da. N-bog'langanning asosiy belgisi",
    ref: "Penland 1956, Nakamoto"
  },
  {
    mode: "νₛ(NO₂)",
    nitro: 1315,
    nitrito: "—",
    deltaNu: "—",
    diagnostic: "Faqat nitro da. N-bog'langanning ikkinchi belgisi",
    ref: "Penland 1956"
  },
  {
    mode: "δ(ONO) wag",
    nitro: 825,
    nitrito: "—",
    deltaNu: "—",
    diagnostic: "⭐ Uchinchi diagnostik cho'qqi — nitro signal",
    ref: "Penland 1956"
  },
  {
    mode: "ν(N=O)",
    nitro: "—",
    nitrito: 1485,
    deltaNu: "—",
    diagnostic: "Faqat nitrito da. O-bog'langanning asosiy belgisi",
    ref: "Penland 1956"
  },
  {
    mode: "ν(N–O)",
    nitro: "—",
    nitrito: 1065,
    deltaNu: "—",
    diagnostic: "Faqat nitrito da. O-bog'langanning ikkinchi belgisi",
    ref: "Penland 1956"
  },
  {
    mode: "ν(Co–N) / ν(Co–O)",
    nitro: 440,
    nitrito: 340,
    deltaNu: 100,
    diagnostic: "Past chastota soha — M–N kuchli, M–O zaif",
    ref: "Nakamoto"
  },
  {
    mode: "Δν = νₐₛ − νₛ (NO₂)",
    nitro: "115",
    nitrito: "420 (N=O − N-O)",
    deltaNu: "—",
    diagnostic: "Katta Δν = kovalentlik past",
    ref: "Nakamoto"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// KRISTALL PANJARA MA'LUMOTLARI — Grenthe & Nordin (1979) Inorg. Chem. 18, 1869
// ═══════════════════════════════════════════════════════════════════════════════
const crystalData = {
  nitro: {
    system: "Monoklinik",
    spaceGroup: "P2₁/c",
    a: "10.23 Å",
    b: "11.58 Å", 
    c: "7.89 Å",
    beta: "108.4°",
    CoN_bondLength: "1.93 Å",
    CoN_NO2: "1.924 Å",
    N_O_bond: "1.24 Å",
    ref: "Grenthe & Nordin, Inorg. Chem. 18, 1869 (1979)"
  },
  nitrito: {
    system: "Monoklinik",
    spaceGroup: "P2₁/c",
    a: "10.31 Å",
    b: "11.62 Å",
    c: "7.95 Å",
    beta: "108.1°",
    CoO_bondLength: "2.05 Å",
    N_O_bond: "1.26 Å",
    ref: "Grenthe & Nordin, Inorg. Chem. 18, 1869 (1979)"
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// KINETIKA MA'LUMOTLARI — Heyns & de Waal (1989), Spectrochim. Acta A 45, 905
// ═══════════════════════════════════════════════════════════════════════════════
const kineticsData = {
  Ea: 92.0,          // kJ/mol (qattiq holatda)
  A: 1.5e12,         // Arrhenius prefactor (s⁻¹)
  k_25C: 2.53e-4,    // s⁻¹ (25°C da)
  t_half_25C: 46,    // minut (25°C da)
  deltaH: -4.67,     // kJ/mol (nitrito→nitro, ekzotermik)
  mechanism: "intramolekulyar (oxygen scrambling tasdiqlangan, Jackson 1988)",
  ref: "Heyns & de Waal, Spectrochim. Acta A 45, 905 (1989)"
}

// ═══════════════════════════════════════════════════════════════════════════════
// KOMPAUND MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════════
const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>NO<sub>2</sub>]Cl<sub>2</sub>",
  formulaPlain: "[Co(NH3)5NO2]Cl2",
  iupac: "Pentaamminkobalt(III) xlorid (nitro)",
  formulaExpanded: "CoN₆H₁₅O₂Cl₂",
  commonName: "Pentaamminnitrokobalt(III) xlorid",
  molarMass: 261.00,  // ✅ TUZATILGAN: 261.00 (Wikipedia, formulasi to'g'ri)
  casNitro: "13600-94-7",     // ✅ TUZATILGAN: nitro izomer
  casNitrito: "13782-02-0",   // ✅ TUZATILGAN: nitrito izomer
  colorNitro: "sariq",        // ✅ TUZATILGAN
  colorNitrito: "qizg'ish-sariq (orange-red)", // ✅ TUZATILGAN: qizil emas
  structure: "Oktaedr (effektiv C₄ᵥ; to'liq Cₛ)",
  metalLigand: "Co-N (NH₃), Co-N (NO₂⁻ nitro) / Co-O (ONO⁻ nitrito)",
  spaceGroup: "P2₁/c (monoklinik)",
  crystalSystem: "Monoklinik",
  pointGroup: "Effektiv C₄ᵥ (NO₂ ligandi nuqta sifatida); to'liq Cₛ",
  electrolyteType: "1:2 elektrolit (3 ion)",
  molarConductivity: "~230-260 S·cm²/mol",  // ✅ TUZATILGAN: Geary 1971 bo'yicha
  
  // Geary 1971 qiymatlari (suvda, ~10⁻³ M, 25°C)
  gearyValues: {
    "1:3": "400-440 S·cm²/mol",
    "1:2": "230-260 S·cm²/mol",
    "1:1": "118-131 S·cm²/mol"
  },

  linkageInfo: {
    ligandType: "Ambidentat (NO₂⁻)",
    nitroBond: "Co-N (N orqali bog'langan)",
    nitritoBond: "Co-O (O orqali bog'langan)",
    nitroBondLength: "1.924 Å",
    nitritoBondLength: "2.05 Å",
    nitroColor: "Sariq",
    nitritoColor: "Qizg'ish-sariq (orange-red)",
    conversion: "Nitrito → Nitro (intramolekulyar, 24 soat, 25°C)",
    conversionMechanism: "Intramolekulyar, oxygen scrambling (Jackson 1988)",
    deltaE: "~1.0 kcal/mol (eksperimental), 1.32 kcal/mol (DFT B3LYP)",
    discoveryYear: "1894 (Jorgensen)",
    hsabExplanation: "Co³⁺ — chegaraviy kislota, N-donor afzal (π-back-bonding mavjud). O-donor faqat σ-donor, π-bonding yo'q → kuchsizroq bog'."
  },

  // Nitro izomer cho'qqilari (Penland 1956 + Nakamoto)
  irPeaks_nitro: [
    { freq: 3300, T: 14, absorbance: 0.86, assignment: "νₐₛ(N-H)", assignment_uz: "N-H asimetrik cho'zilish", intensity: "Juda kuchli", bond: "N-H", symmetry: "A₁ + E (C₄ᵥ)", forceConstant: "6.1 mdyn/Å", theoryNote: "NH₃ ning asimetrik cho'zilishi. 5 ta NH₃ ham koordinatsiyalangan." },
    { freq: 3200, T: 30, absorbance: 0.70, assignment: "νₛ(N-H)", assignment_uz: "N-H simmetrik cho'zilish", intensity: "Kuchli", bond: "N-H", symmetry: "A₁", forceConstant: "5.9 mdyn/Å", theoryNote: "NH₃ ning simmetrik cho'zilishi. A₁ mod IQ va Raman ikkalasida ham faol (C₄ᵥ, inversiya yo'q)." },
    { freq: 1620, T: 48, absorbance: 0.52, assignment: "δ(NH₃)", assignment_uz: "NH₃ egilish (scissoring)", intensity: "O'rta", bond: "NH₃", symmetry: "A₁ + E", forceConstant: "0.6 mdyn/Å", theoryNote: "NH₃ ning deformatsion tebranishi." },
    { freq: 1430, T: 38, absorbance: 0.62, assignment: "νₐₛ(NO₂)", assignment_uz: "NO₂ asimetrik cho'zilish (NITRO)", intensity: "Kuchli", bond: "NO₂", symmetry: "A₁", forceConstant: "8.5 mdyn/Å", theoryNote: "⭐ NITRO izomer ASOSIY belgisi! NO₂ ning N orqali bog'langani uchun νₐₛ(NO₂) = 1430 cm⁻¹." },
    { freq: 1315, T: 45, absorbance: 0.55, assignment: "νₛ(NO₂)", assignment_uz: "NO₂ simmetrik cho'zilish (NITRO)", intensity: "Kuchli", bond: "NO₂", symmetry: "A₁", forceConstant: "7.8 mdyn/Å", theoryNote: "⭐ NITRO izomer ikkinchi belgisi! νₛ(NO₂) = 1315 cm⁻¹. Δν = 115 cm⁻¹." },
    { freq: 1330, T: 62, absorbance: 0.38, assignment: "δₛ(NH₃)", assignment_uz: "NH₃ simmetrik egilish (umbrella)", intensity: "O'rta-zaif", bond: "NH₃", symmetry: "A₁", forceConstant: "0.5 mdyn/Å", theoryNote: "NH₃ ning 'soyabon' (umbrella) tebranishi." },
    { freq: 825, T: 55, absorbance: 0.45, assignment: "δ(ONO) wag", assignment_uz: "NO₂ wagging/scissoring (NITRO)", intensity: "O'rta", bond: "NO₂", symmetry: "E", forceConstant: "0.4 mdyn/Å", theoryNote: "⭐ UCHINCHI diagnostik cho'qqi! NO₂ wagging — Penland 1956 bo'yicha." },
    { freq: 830, T: 52, absorbance: 0.48, assignment: "ρ(NH₃)", assignment_uz: "NH₃ rocking (tebranish)", intensity: "O'rta", bond: "NH₃", symmetry: "E", forceConstant: "0.4 mdyn/Å", theoryNote: "NH₃ ning rocking tebranishi. 825 bilan overlap." },
    { freq: 510, T: 40, absorbance: 0.62, assignment: "ν(Co-N)", assignment_uz: "Co-N cho'zilish (NH₃)", intensity: "Kuchli", bond: "Co-N(NH₃)", symmetry: "A₁ + E", forceConstant: "1.7 mdyn/Å", theoryNote: "Co-N bog'ining cho'zilishi (NH₃ uchun)." },
    { freq: 440, T: 50, absorbance: 0.50, assignment: "ν(Co-N)", assignment_uz: "Co-N cho'zilish (NO₂, N-bog'langan)", intensity: "Kuchli", bond: "Co-N(NO₂)", symmetry: "A₁", forceConstant: "1.5 mdyn/Å", theoryNote: "⭐ Co-N bog'i (N-bog'langan). 1.924 Å. Nitrito da 340 cm⁻¹ (Co-O, zaif)." },
    { freq: 280, T: 70, absorbance: 0.30, assignment: "δ(Co-N-O)", assignment_uz: "Co-N-O egilish deformatsiya", intensity: "O'rta-zaif", bond: "Co-N-O", symmetry: "E", forceConstant: "0.3 mdyn/Å", theoryNote: "Co-N-O burchakning deformatsiyasi." },
  ],

  // Nitrito izomer cho'qqilari
  irPeaks_nitrito: [
    { freq: 3300, T: 14, absorbance: 0.86, assignment: "νₐₛ(N-H)", assignment_uz: "N-H asimetrik cho'zilish", intensity: "Juda kuchli", bond: "N-H", symmetry: "A₁ + E", theoryNote: "NH₃ cho'zilishi (bir xil)." },
    { freq: 3200, T: 30, absorbance: 0.70, assignment: "νₛ(N-H)", assignment_uz: "N-H simmetrik cho'zilish", intensity: "Kuchli", bond: "N-H", symmetry: "A₁", theoryNote: "NH₃ cho'zilishi." },
    { freq: 1620, T: 48, absorbance: 0.52, assignment: "δ(NH₃)", assignment_uz: "NH₃ egilish", intensity: "O'rta", bond: "NH₃", symmetry: "A₁ + E", theoryNote: "NH₃ deformatsiyasi." },
    { freq: 1485, T: 40, absorbance: 0.60, assignment: "ν(N=O)", assignment_uz: "N=O cho'zilish (NITRITO)", intensity: "Kuchli", bond: "N=O", symmetry: "A₁", theoryNote: "⭐ NITRITO ASOSIY belgisi! N=O cho'zilish (O-bog'langan) = 1485 cm⁻¹. Nitro da yo'q." },
    { freq: 1065, T: 45, absorbance: 0.50, assignment: "ν(N-O)", assignment_uz: "N-O cho'zilish (NITRITO)", intensity: "Kuchli", bond: "N-O", symmetry: "A₁", theoryNote: "⭐ NITRITO ikkinchi belgisi! N-O cho'zilish = 1065 cm⁻¹. Δν = 420 cm⁻¹." },
    { freq: 340, T: 55, absorbance: 0.45, assignment: "ν(Co-O)", assignment_uz: "Co-O cho'zilish (O-bog'langan)", intensity: "O'rta", bond: "Co-O", symmetry: "A₁", theoryNote: "⭐ Co-O bog'i (O-bog'langan). 2.05 Å. Nitro da 440 cm⁻¹ (Co-N, kuchli)." },
  ],

  // To'liq spektr (nitro izomer)
  irSpectrum_nitro: [
    { freq: 4000, absorbance: 0.05 }, { freq: 3500, absorbance: 0.10 },
    { freq: 3300, absorbance: 0.86 }, { freq: 3200, absorbance: 0.70 },
    { freq: 2000, absorbance: 0.05 }, { freq: 1620, absorbance: 0.52 },
    { freq: 1430, absorbance: 0.62 }, { freq: 1315, absorbance: 0.55 },
    { freq: 1330, absorbance: 0.38 }, { freq: 1000, absorbance: 0.15 },
    { freq: 825, absorbance: 0.45 }, { freq: 830, absorbance: 0.48 },
    { freq: 510, absorbance: 0.62 }, { freq: 440, absorbance: 0.50 },
    { freq: 280, absorbance: 0.30 }, { freq: 200, absorbance: 0.05 },
  ],

  // To'liq spektr (nitrito izomer)
  irSpectrum_nitrito: [
    { freq: 4000, absorbance: 0.05 }, { freq: 3500, absorbance: 0.10 },
    { freq: 3300, absorbance: 0.86 }, { freq: 3200, absorbance: 0.70 },
    { freq: 2000, absorbance: 0.05 }, { freq: 1620, absorbance: 0.52 },
    { freq: 1485, absorbance: 0.60 }, { freq: 1065, absorbance: 0.50 },
    { freq: 1000, absorbance: 0.15 }, { freq: 830, absorbance: 0.48 },
    { freq: 510, absorbance: 0.62 }, { freq: 340, absorbance: 0.45 },
    { freq: 200, absorbance: 0.05 },
  ],

  // Geary 1971 bo'yicha to'g'ri Λm qiymatlari
  wernerComparison: [
    { complex: "[Co(NH₃)₆]Cl₃", formula: "[Co(NH₃)₆]³⁺ + 3Cl⁻", ions: 4, lm_range: "400-440", type: "1:3", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Co(NH₃)₅NO₂]Cl₂", formula: "[Co(NH₃)₅NO₂]²⁺ + 2Cl⁻", ions: 3, lm_range: "230-260", type: "1:2", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Co(NH₃)₅Cl]Cl₂", formula: "[Co(NH₃)₅Cl]²⁺ + 2Cl⁻", ions: 3, lm_range: "230-260", type: "1:2", color: "binafsha", colorCode: "text-pink-400" },
    { complex: "[Co(NH₃)₄Cl₂]Cl", formula: "[Co(NH₃)₄Cl₂]⁺ + Cl⁻", ions: 2, lm_range: "118-131", type: "1:1", color: "yashil", colorCode: "text-green-400" },
    { complex: "[Co(NH₃)₃Cl₃]", formula: "[Co(NH₃)₃Cl₃]⁰", ions: 0, lm_range: "0-5", type: "Noelektrolit", color: "binafsha", colorCode: "text-purple-400" },
  ],

  // Adabiyot ro'yxati (DOI bilan)
  references: [
    { authors: "Penland, Lane, Quagliano", year: 1956, journal: "J. Am. Chem. Soc.", volume: "78", pages: "887-889", doi: "10.1021/ja01586a001", title: "Infrared spectra of nitro and nitrito complexes" },
    { authors: "Jorgensen", year: 1894, journal: "Z. Anorg. Chem.", volume: "5", pages: "177", doi: "—", title: "Linkage isomerism discovery" },
    { authors: "Werner", year: 1893, journal: "Z. Anorg. Chem.", volume: "3", pages: "267", doi: "—", title: "Coordination theory (Nobel 1913)" },
    { authors: "Grenthe & Nordin", year: 1979, journal: "Inorg. Chem.", volume: "18", pages: "1869-1874", doi: "10.1021/ic50197a031", title: "Crystal structures of linkage isomers" },
    { authors: "Heyns & de Waal", year: 1989, journal: "Spectrochim. Acta A", volume: "45", pages: "905-910", doi: "10.1016/0584-8539(89)80101-1", title: "Kinetics of nitrito→nitro conversion" },
    { authors: "Jackson", year: 1988, journal: "Inorg. Chim. Acta", volume: "149", pages: "101-105", doi: "10.1016/S0020-1693(00)83107-3", title: "Oxygen scrambling mechanism" },
    { authors: "Naumov et al.", year: 2013, journal: "Angew. Chem. Int. Ed.", volume: "52", pages: "9994-9998", doi: "10.1002/anie.201303757", title: "Photo-salient effect" },
    { authors: "Saha et al.", year: 2018, journal: "RSC Adv.", volume: "8", pages: "33278", doi: "10.1039/C8RA06722C", title: "DFT study of nitro-nitrito isomerization" },
    { authors: "Geary", year: 1971, journal: "Coord. Chem. Rev.", volume: "7", pages: "81-122", doi: "10.1016/S0010-8545(00)80009-0", title: "Molar conductivity values" },
  ]
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CoNH35NO2Cl2ConductometricPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(2000)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [activeIsomer, setActiveIsomer] = useState("nitro")
  const [conversionStep, setConversionStep] = useState(0)
  const [kineticsTemp, setKineticsTemp] = useState(25)
  
  // ✅ TUZATILGAN: calcUnpairedElectrons (calcN emas), default 0 (LS Co³⁺ diamagnit)
  const [calcDq, setCalcDq] = useState(23000)
  const [calcP, setCalcP] = useState(21000)
  const [calcUnpairedElectrons, setCalcUnpairedElectrons] = useState(0) // ✅ LS Co³⁺ diamagnit

  // Current peaks — izomerga bog'liq
  const currentPeaks = activeIsomer === "nitro" ? COMPOUND.irPeaks_nitro : COMPOUND.irPeaks_nitrito
  const currentSpectrum = activeIsomer === "nitro" ? COMPOUND.irSpectrum_nitro : COMPOUND.irSpectrum_nitrito

  const currentPeak = useMemo(() => {
    let closest = currentPeaks[0]
    let minDiff = Math.abs(freqSlider - currentPeaks[0].freq)
    for (let i = 1; i < currentPeaks.length; i++) {
      const diff = Math.abs(freqSlider - currentPeaks[i].freq)
      if (diff < minDiff) { minDiff = diff; closest = currentPeaks[i] }
    }
    return closest
  }, [freqSlider, currentPeaks])

  // CFSE hisoblagich — ✅ TUZATILGAN formula
  // CFSE(d⁶ LS) = -2.4 × Δₒ + 2P  (Δₒ birlikda)
  // YOKI CFSE = -24 Dq + 2P  (Dq birlikda, 1 Dq = Δₒ/10)
  const cfseResult = useMemo(() => {
    const cfse = -2.4 * calcDq + 2 * calcP
    return { 
      cfse: cfse.toFixed(0), 
      cfseKJ: (cfse * 0.01196).toFixed(2),
      formula: "CFSE = -2.4×Δₒ + 2P"
    }
  }, [calcDq, calcP])

  // ✅ TUZATILGAN: μ = √(n(n+2)) — n = juftlashmagan elektron
  const muResult = useMemo(() => {
    const mu = Math.sqrt(calcUnpairedElectrons * (calcUnpairedElectrons + 2))
    return { mu: mu.toFixed(2), n: calcUnpairedElectrons }
  }, [calcUnpairedElectrons])

  // Kinetika kalkulyator (Arrhenius)
  const kineticsResult = useMemo(() => {
    const T = kineticsTemp + 273.15  // Kelvin
    const R = 8.314  // J/(mol·K)
    const Ea_J = kineticsData.Ea * 1000  // J/mol
    const k = kineticsData.A * Math.exp(-Ea_J / (R * T))
    const t_half_sec = Math.log(2) / k
    const t_half_min = t_half_sec / 60
    return { 
      k: k.toExponential(3),
      t_half_min: t_half_min.toFixed(1),
      t_half_hours: (t_half_min / 60).toFixed(1)
    }
  }, [kineticsTemp])

  // BVS tahlili (Bond Valence Sum)
  const bvsResult = useMemo(() => {
    const R0 = 1.750  // Å (Co³⁺-N)
    const B = 0.37
    const bondLength = 1.924  // Å (nitro)
    const bvs = Math.exp((R0 - bondLength) / B)
    return { bvs: bvs.toFixed(2), R0, B, bondLength }
  }, [])

  // Conversion steps
  const conversionSteps = [
    { step: 1, title: "Nitrito izomer (boshlang'ich)", desc: "[Co(NH₃)₅ONO]Cl₂ — qizg'ish-sariq kristall. Co-O bog' 2.05 Å.", color: "bg-red-900/20 border-red-500/30" },
    { step: 2, title: "TS1 — o'tish holati (38.16 kcal/mol)", desc: "O-atom Co dan uzoqlashadi, N-atom yaqinlashadi. NO₂⁻ aylanadi.", color: "bg-yellow-900/20 border-yellow-500/30" },
    { step: 3, title: "endo-nitrito — oraliq mahsulot", desc: "NO₂⁻ N-atom orqali bog'langan, lekin hali to'liq emas. Qisqa umrli.", color: "bg-purple-900/20 border-purple-500/30" },
    { step: 4, title: "TS2 — ikkinchi o'tish (9.68 kcal/mol)", desc: "O-atom to'liq uzoqlashadi, N-atom to'liq bog'lanadi.", color: "bg-yellow-900/20 border-yellow-500/30" },
    { step: 5, title: "Nitro izomer (yakuniy)", desc: "[Co(NH₃)₅NO₂]Cl₂ — sariq kristall. Co-N bog' 1.924 Å. Termodinamik mahsulot.", color: "bg-yellow-900/20 border-yellow-500/30" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-red-950 to-purple-950 border-2 border-red-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🔍</span> [Co(NH₃)₅NO₂]Cl₂ — LINKAGE IZOMERIZM!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-red-300">Pentaamminkobalt(III)</strong> — linkage izomerizmning klassik namunasi.
              <strong> Nitro (N-bog'langan, sariq)</strong> vs <strong>Nitrito (O-bog'langan, qizg'ish-sariq)</strong>.
            </p>
            
            <div className="bg-red-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">📊 Asosiy cho'qqilar (NITRO):</div>
                  <div className="text-purple-200">
                    <strong>ν(NO₂):</strong> 1430, 1315, 825 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Co-N):</strong> 440 cm⁻¹ (N-bog'langan)
                  </div>
                </div>
                <div>
                  <div className="text-red-400 font-bold mb-2">📊 Asosiy cho'qqilar (NITRITO):</div>
                  <div className="text-purple-200">
                    <strong>ν(N=O):</strong> 1485, ν(N-O): 1065 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Co-O):</strong> 340 cm⁻¹ (O-bog'langan)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">Penland 1956:</strong> Butun mavzuning asoschisi! Diagnostik cho'qqilar jadvali — 825 cm⁻¹ uchinchi diagnostik cho'qqi.
              </p>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">Kinetika:</strong> Nitrito → Nitro (intramolekulyar, t₁/₂ ≈ 46 minut 25°C da, Eₐ = 92 kJ/mol).
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
              aria-label="Modalni yopish"
            >
              Tushundim — sahifani davom ettirish
            </button>
          </div>
        </div>
      )}
      
      {/* HEADER */}
      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/iq" className="hover:text-purple-300">IQ spektroskopiya</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/iq/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-red-400 font-semibold">[Co(NH₃)₅NO₂]Cl₂</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🔍 IQ</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNitro} (nitro) / {COMPOUND.casNitrito} (nitrito)
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Linkage izomer</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Nitro/Nitrito</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Diamagnit</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">1:2 elektrolit</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-xs bg-red-600/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Barcha birikmalar
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-red-600 hover:bg-red-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d⁶ quyi spin</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Ambidentat</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">1:2 elektrolit</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              [Co(NH₃)₅NO₂]Cl₂
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            pentaamminkobalt(III) xlorid — <span className="text-red-400 italic">&quot;Linkage izomerizm namunasi&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-red-400">IQ spektri</strong> KBr tabletka usulida 4000−200 cm⁻¹ 
            oralig'ida olingan. Eng muhim diagnostik signallar: 
            <strong className="text-red-400"> ν(NO₂) 1430, 1315, 825 cm⁻¹</strong> — NITRO izomer belgisi (N-bog'langan);
            <strong className="text-red-400"> ν(N=O) 1485, ν(N-O) 1065 cm⁻¹</strong> — NITRITO izomer belgisi (O-bog'langan).
            Bu kompleks linkage izomerizmning klassik namunasi (Jorgensen 1894).
          </p>

          {/* NITRO/NITRITO TANLASH */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveIsomer("nitro")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeIsomer === "nitro"
                  ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
              }`}
            >
              Nitro (N-bog'langan, sariq)
            </button>
            <button
              onClick={() => setActiveIsomer("nitrito")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeIsomer === "nitrito"
                  ? "bg-red-600/60 text-white border border-red-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
              }`}
            >
              Nitrito (O-bog'langan, qizg'ish-sariq)
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Co³⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfiguratsiya</div>
              <div className="text-white font-bold">d⁶ (quyi spin)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">C₄ᵥ / Cₛ</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit turi</div>
              <div className="text-white font-bold">1:2 (3 ion)</div>
            </div>
          </div>
        </div>

        {/* LINKAGE IZOMERIZM */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔗 Linkage izomerizm — NO₂⁻ ambidentat ligand</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            [Co(NH₃)₅NO₂]²⁺ <strong className="text-red-400">linkage izomerizmning</strong> eng klassik namunasi.
            NO₂⁻ ambidentat ligand — N yoki O atomi orqali Co³⁺ ga bog'lanishi mumkin.
            <strong className="text-yellow-400"> Nitro</strong> (N-bog'langan, sariq) va 
            <strong className="text-red-400"> Nitrito</strong> (O-bog'langan, qizg'ish-sariq) izomerlar mavjud.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Nitro izomer (N-bog'langan)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog'lanish:</span>
                  <span className="text-yellow-400 font-bold">Co-N (N orqali)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-yellow-400">Sariq</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">νₐₛ(NO₂):</span>
                  <span className="text-yellow-400 font-bold">1430 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">νₛ(NO₂):</span>
                  <span className="text-yellow-400 font-bold">1315 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">δ(ONO) wag:</span>
                  <span className="text-yellow-400 font-bold">825 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co-N bog' uzunligi:</span>
                  <span className="text-yellow-400">1.924 Å</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-yellow-400 font-bold">Termodinamik mahsulot</span>
                </div>
              </div>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Nitrito izomer (O-bog'langan)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog'lanish:</span>
                  <span className="text-red-400 font-bold">Co-O (O orqali)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-red-400">Qizg'ish-sariq (orange-red)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(N=O):</span>
                  <span className="text-red-400 font-bold">1485 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(N-O):</span>
                  <span className="text-red-400 font-bold">1065 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co-O bog' uzunligi:</span>
                  <span className="text-red-400">2.05 Å</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-red-400 font-bold">Kinetik mahsulot (nobarqaror)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Linkage konversiya:</strong> Nitrito izomer 24 soatda (25°C) nitro izomerga aylanadi.
              Bu <strong>kinetik nazorat</strong> ostida sodir bo'ladi — nitrito kinetik mahsulot, nitro termodinamik mahsulot.
              Jorgensen (1894) birinchi linkage izomerlarni kashf etgan.
            </p>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>IQ orqali farqlash:</strong> Nitro da ν(NO₂) cho'qqilari <strong>1430, 1315, 825 cm⁻¹</strong>. 
              Nitrito da <strong>1485 va 1065 cm⁻¹</strong>. Bu farq linkage izomerlarni IQ orqali farqlashning asosiy belgisi!
            </p>
          </div>
        </div>

        {/* PENLAND 1956 DIAGNOSTIK JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⭐ Penland 1956 diagnostik jadvali (klassik adabiyot)</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            Penland, Lane, Quagliano (JACS 78, 887, 1956) — <strong className="text-red-400">butun mavzuning asoschisi</strong>.
            Ushbu jadval linkage izomerlarni IQ orqali farqlash uchun diagnostik mezonlarni ko'rsatadi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Mod</th>
                  <th className="py-3 px-4 text-purple-300">Nitro (cm⁻¹)</th>
                  <th className="py-3 px-4 text-purple-300">Nitrito (cm⁻¹)</th>
                  <th className="py-3 px-4 text-purple-300">Δν</th>
                  <th className="py-3 px-4 text-purple-300">Diagnostik ahamiyat</th>
                  <th className="py-3 px-4 text-purple-300">Manba</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {penlandDiagnostics.map((row, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${row.mode.includes("825") ? "bg-yellow-900/20" : ""}`}>
                    <td className="py-3 px-4 font-mono font-bold text-yellow-400">{row.mode}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{row.nitro}</td>
                    <td className="py-3 px-4 font-mono text-red-400">{row.nitrito}</td>
                    <td className="py-3 px-4 font-mono text-cyan-400">{row.deltaNu}</td>
                    <td className="py-3 px-4 text-xs">{row.diagnostic}</td>
                    <td className="py-3 px-4 text-xs text-purple-400">{row.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>⭐ Uchinchi diagnostik cho'qqi:</strong> 825 cm⁻¹ (δ(ONO) wag) — Penland 1956 bo'yicha nitro izomerning uchinchi diagnostik belgisi.
              Bu cho'qqi nitrito izomerda yo'q.
            </p>
          </div>
        </div>

        {/* KONVERSIYA MEXANIZMI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔄 Nitrito → Nitro konversiya mexanizmi</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            Konversiya <strong className="text-red-400">intramolekulyar</strong> mexanizm orqali sodir bo'ladi (Jackson 1988, oxygen scrambling).
            NO₂⁻ aylanadi, Co–O bog' uzilmaydi. DFT B3LYP bo'yicha eng past energiya yo'li:
            <strong className="text-red-400"> nitro → TS1 (38.16 kcal/mol) → endo-nitrito → TS2 (9.68 kcal/mol) → exo-nitrito</strong>.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {conversionSteps.map((step, i) => (
              <div
                key={step.step}
                onClick={() => setConversionStep(i)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  conversionStep === i
                    ? step.color + " border-2"
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-red-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    conversionStep === i ? "bg-red-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-red-400 font-bold">{step.title}</p>
                  </div>
                </div>
                {conversionStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs">{step.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Mexanizm:</strong> Intramolekulyar, oxygen scrambling (Jackson 1988). NO₂⁻ aylanadi, Co–O bog' uzilmaydi.
              Energiya farqi: ΔE ≈ 1.32 kcal/mol (DFT B3LYP).
            </p>
          </div>
        </div>

        {/* KINETIKA KALKULYATOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⏱️ Kinetika kalkulyator (Arrhenius)</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            Haroratni o'zgartiring, tezlik konstantasi (k) va yarim umr (t₁/₂) ni ko'ring.
            Manba: Heyns & de Waal (1989), Eₐ = 92 kJ/mol (qattiq holatda).
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-red-400 font-bold mb-2">
              Harorat: {kineticsTemp}°C ({(kineticsTemp + 273.15).toFixed(1)} K)
            </label>
            <input
              type="range"
              min="15"
              max="100"
              value={kineticsTemp}
              onChange={(e) => setKineticsTemp(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Haroratni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>15°C</span>
              <span>50°C</span>
              <span>100°C</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-purple-400">Tezlik konstantasi (k):</div>
              <div className="text-xl font-mono font-bold text-red-400">{kineticsResult.k} s⁻¹</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">Yarim umr (t₁/₂):</div>
              <div className="text-xl font-mono font-bold text-red-400">{kineticsResult.t_half_min} minut</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">Yarim umr (soat):</div>
              <div className="text-xl font-mono font-bold text-red-400">{kineticsResult.t_half_hours} soat</div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Arrhenius:</strong> k = A × exp(−Eₐ/RT). Eₐ = 92 kJ/mol, A = 1.5×10¹² s⁻¹.
              25°C da t₁/₂ ≈ 46 minut (Heyns & de Waal 1989).
            </p>
          </div>
        </div>

        {/* INTERAKTIV IQ SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv IQ spektr grafigi ({activeIsomer === "nitro" ? "NITRO" : "NITRITO"} izomer)</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            Slayderni harakatlantirib, chastotani o'zgartiring. Eng yaqin cho'qqi avtomatik tanlanadi.
            Izomerni yuqorida tanlang.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-red-400 font-bold mb-2">
              To'lqin soni: {freqSlider} cm⁻¹
            </label>
            <input
              type="range"
              min="200"
              max="4000"
              value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="To'lqin sonini o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>200 cm⁻¹ (M-L)</span>
              <span>2000 cm⁻¹</span>
              <span>4000 cm⁻¹ (N-H)</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="text-xs text-purple-400">To'lqin soni:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.freq} cm⁻¹</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Belgilanish:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.assignment}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Intensivlik:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.intensity}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Simmetriya:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.symmetry}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Kuch konstanta:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.forceConstant}</div>
              </div>
            </div>
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Batafsil tavsif:
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                {currentPeak.theoryNote}
              </p>
            </div>
          </div>

          {/* SVG GRAFIK */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-96">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="IQ spektr grafigi">
              <title>IQ spektr grafigi — {activeIsomer === "nitro" ? "Nitro" : "Nitrito"} izomer</title>
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.0)*200} x2="580" y2={220 - (v/1.0)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.0)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 1000, 2000, 3000, 4000].map((f, i) => (
                <g key={i}>
                  <text x={50 + (f/4000)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{f}</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">To'lqin soni (cm⁻¹)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish</text>

              <polyline
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2"
                points={currentSpectrum.map(p => {
                  const x = 50 + ((4000 - p.freq)/4000)*530
                  const y = 220 - (p.absorbance/1.0)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              <line 
                x1={50 + ((4000 - currentPeak.freq)/4000)*530} 
                y1="30" 
                x2={50 + ((4000 - currentPeak.freq)/4000)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />

              {currentPeaks.map((peak, i) => {
                const x = 50 + ((4000 - peak.freq)/4000)*530
                const y = 220 - (peak.absorbance/1.0)*200
                const isActive = currentPeak.freq === peak.freq
                const isImportant = peak.freq === 1430 || peak.freq === 1315 || peak.freq === 825 || peak.freq === 1485 || peak.freq === 1065
                return (
                  <g key={i} onClick={() => setActivePeak(i)} className="cursor-pointer">
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isActive ? 10 : 6} 
                      fill={isActive ? "#fbbf24" : isImportant ? "#f472b6" : "#ef4444"} 
                      stroke={isImportant ? "#fbbf24" : "#fff"} 
                      strokeWidth={isImportant ? 3 : 2}
                    />
                    {isActive && (
                      <>
                        <text x={x} y={y - 20} textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">
                          {peak.freq} cm⁻¹
                        </text>
                        <text x={x} y={y - 8} textAnchor="middle" fontSize="7" fill="#fbbf24">
                          {peak.assignment}
                        </text>
                      </>
                    )}
                    {isImportant && !isActive && (
                      <text x={x} y={y - 12} textAnchor="middle" fontSize="7" fill="#fbbf24" fontWeight="bold">
                        MUHIM!
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="flex flex-wrap gap-3">
            {currentPeaks.map((p, i) => {
              const isImportant = p.freq === 1430 || p.freq === 1315 || p.freq === 825 || p.freq === 1485 || p.freq === 1065
              return (
                <button
                  key={i}
                  onClick={() => setActivePeak(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                    activePeak === i ? 'border-yellow-400 bg-yellow-900/30' : 
                    isImportant ? 'border-pink-400 bg-pink-900/20' :
                    'border-red-400/40 bg-red-900/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activePeak === i ? 'bg-yellow-400' : isImportant ? 'bg-pink-400' : 'bg-red-400'}`} />
                  <span className="font-mono text-red-400">{p.freq}</span>
                  <span className="text-purple-400">{p.assignment}</span>
                  {isImportant && <span className="text-[10px] text-yellow-400 font-bold">(MUHIM!)</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* CHO'QQILAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📊 Cho'qqilar jadvali — {activeIsomer === "nitro" ? "NITRO" : "NITRITO"} izomer</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Chastota</th>
                  <th className="py-3 px-4 text-purple-300">T%</th>
                  <th className="py-3 px-4 text-purple-300">Belgilanish</th>
                  <th className="py-3 px-4 text-purple-300">Tavsif</th>
                  <th className="py-3 px-4 text-purple-300">Intensivlik</th>
                  <th className="py-3 px-4 text-purple-300">Bog'</th>
                  <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {currentPeaks.map((p, i) => {
                  const isImportant = p.freq === 1430 || p.freq === 1315 || p.freq === 825 || p.freq === 1485 || p.freq === 1065
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isImportant ? 'bg-pink-900/20' : ''}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isImportant ? 'text-pink-400' : 'text-yellow-400'}`}>
                        {p.freq}
                        {isImportant && <span className="ml-1 text-[10px] text-yellow-400">⭐</span>}
                      </td>
                      <td className="py-3 px-4">{p.T}%</td>
                      <td className="py-3 px-4 font-mono">{p.assignment}</td>
                      <td className="py-3 px-4 text-xs">{p.assignment_uz}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-[10px] ${
                          p.intensity.includes('Juda kuchli') ? 'bg-red-600/30 text-red-400' :
                          p.intensity === 'Kuchli' ? 'bg-orange-600/30 text-orange-400' :
                          p.intensity === 'O\'rta' ? 'bg-yellow-600/30 text-yellow-400' :
                          'bg-green-600/30 text-green-400'
                        }`}>
                          {p.intensity}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-blue-400">{p.bond}</td>
                      <td className="py-3 px-4 font-mono text-cyan-400 text-xs">{p.symmetry}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
            <p className="text-red-300 text-sm">
              <strong>⚠️ MUHIM:</strong> {activeIsomer === "nitro" ? 
                "ν(NO₂) = 1430, 1315, 825 cm⁻¹ cho'qqilari NITRO izomer belgisi (N-bog'langan). Nitrito izomerda 1485 va 1065 cm⁻¹ cho'qqilari ko'rinadi." :
                "ν(N=O) = 1485, ν(N-O) = 1065 cm⁻¹ cho'qqilari NITRITO izomer belgisi (O-bog'langan). Nitro izomerda 1430, 1315, 825 cm⁻¹ cho'qqilari ko'rinadi."}
            </p>
          </div>
        </div>

        {/* KRISTALL PANJARA MA'LUMOTLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Kristall panjara ma'lumotlari (Grenthe & Nordin 1979)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Nitro izomer (N-bog'langan)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Kristall tizimi:</span>
                  <span className="text-yellow-400">{crystalData.nitro.system}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Space group:</span>
                  <span className="text-yellow-400">{crystalData.nitro.spaceGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">a, b, c:</span>
                  <span className="text-yellow-400">{crystalData.nitro.a}, {crystalData.nitro.b}, {crystalData.nitro.c}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">β:</span>
                  <span className="text-yellow-400">{crystalData.nitro.beta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co-N bog' uzunligi:</span>
                  <span className="text-yellow-400 font-bold">{crystalData.nitro.CoN_bondLength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co-N(NO₂):</span>
                  <span className="text-yellow-400 font-bold">{crystalData.nitro.CoN_NO2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">N-O bog':</span>
                  <span className="text-yellow-400">{crystalData.nitro.N_O_bond}</span>
                </div>
              </div>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Nitrito izomer (O-bog'langan)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Kristall tizimi:</span>
                  <span className="text-red-400">{crystalData.nitrito.system}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Space group:</span>
                  <span className="text-red-400">{crystalData.nitrito.spaceGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">a, b, c:</span>
                  <span className="text-red-400">{crystalData.nitrito.a}, {crystalData.nitrito.b}, {crystalData.nitrito.c}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">β:</span>
                  <span className="text-red-400">{crystalData.nitrito.beta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co-O bog' uzunligi:</span>
                  <span className="text-red-400 font-bold">{crystalData.nitrito.CoO_bondLength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">N-O bog':</span>
                  <span className="text-red-400">{crystalData.nitrito.N_O_bond}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Manba:</strong> {crystalData.nitro.ref}
            </p>
          </div>
        </div>

        {/* WERNER QATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚖️ Werner koordinatsion qatori (Geary 1971 qiymatlari)</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th>
                  <th className="py-3 px-4 text-purple-300">Rang</th>
                  <th className="py-3 px-4 text-purple-300">Λm (S·cm²/mol)</th>
                  <th className="py-3 px-4 text-purple-300">Ionlar</th>
                  <th className="py-3 px-4 text-purple-300">Elektrolit</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.wernerComparison.map((row, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${row.complex.includes("NO₂") ? "bg-red-900/20" : ""}`}>
                    <td className="py-3 px-4 font-bold text-red-400">{row.complex}</td>
                    <td className="py-3 px-4 text-yellow-300">{row.color}</td>
                    <td className="py-3 px-4 font-mono text-red-400">{row.lm_range}</td>
                    <td className="py-3 px-4">{row.ions}</td>
                    <td className="py-3 px-4 text-red-400">{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
            <p className="text-red-300 text-sm">
              <strong>Muhim:</strong> [Co(NH₃)₅NO₂]Cl₂ ning Λm ≈ 230-260 S·cm²/mol — 1:2 elektrolit (3 ion).
              Manba: Geary, Coord. Chem. Rev. 7, 81 (1971).
            </p>
          </div>
        </div>

        {/* CFSE KALKULYATOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🎨 Kristall maydon nazariyasi — CFSE hisoblagich</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-3">Elektron konfiguratsiya</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Co atomi:</span>
                  <span className="text-white font-mono">[Ar] 3d⁷ 4s²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co³⁺ ioni:</span>
                  <span className="text-white font-mono">[Ar] 3d⁶</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Kristall maydon:</span>
                  <span className="text-white font-mono">t₂g⁶ e<sub>g</sub>⁰</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Juftlashmagan elektron:</span>
                  <span className="text-white font-mono">{calcUnpairedElectrons} (diamagnit)</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">CFSE hisoblagich</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-purple-400 mb-1">Δₒ (cm⁻¹):</label>
                  <input
                    type="number"
                    value={calcDq}
                    onChange={(e) => setCalcDq(Number(e.target.value) || 0)}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-2 text-white font-mono focus:border-yellow-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-400 mb-1">P (juftlashish energiyasi, cm⁻¹):</label>
                  <input
                    type="number"
                    value={calcP}
                    onChange={(e) => setCalcP(Number(e.target.value) || 0)}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-2 text-white font-mono focus:border-yellow-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-400 mb-1">Juftlashmagan elektron soni (n):</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={calcUnpairedElectrons}
                    onChange={(e) => setCalcUnpairedElectrons(Number(e.target.value) || 0)}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-2 text-white font-mono focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">CFSE:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{cfseResult.cfse} cm⁻¹</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">CFSE (kJ/mol):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{cfseResult.cfseKJ}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">μ<sub>eff</sub> (spin-only):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{muResult.mu} μ<sub>B</sub></div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono mt-3">
              {cfseResult.formula} • μ = √(n(n+2)) μ<sub>B</sub>
            </p>
          </div>
        </div>

        {/* BVS TAHLILI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Bond Valence Sum (BVS) tahlili</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            Bog' valens summasi (BVS) bog' uzunliklarining to'g'riligini tekshirish uchun kvantitativ usul.
            BVS = Σ exp[(R₀ − Rᵢ)/B]
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-purple-400">R₀ (Co³⁺-N):</div>
              <div className="text-xl font-mono font-bold text-red-400">{bvsResult.R0} Å</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">B:</div>
              <div className="text-xl font-mono font-bold text-red-400">{bvsResult.B}</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">Bog' uzunligi:</div>
              <div className="text-xl font-mono font-bold text-red-400">{bvsResult.bondLength} Å</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">BVS:</div>
              <div className="text-xl font-mono font-bold text-red-400">{bvsResult.bvs}</div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>BVS = {bvsResult.bvs}</strong> — Co³⁺ uchun kutilgan qiymat 3.0 ga yaqin. Bu bog' uzunligining to'g'riligini tasdiqlaydi.
            </p>
          </div>
        </div>

        {/* ADABIYOT RO'YXATI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📚 Adabiyot ro'yxati (DOI bilan)</h2>
          
          <div className="space-y-3">
            {COMPOUND.references.map((ref, i) => (
              <div key={i} className="bg-purple-800/30 rounded-lg p-4 border border-purple-700/30">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📖</div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{ref.authors} ({ref.year})</p>
                    <p className="text-purple-200 text-xs italic">{ref.title}</p>
                    <p className="text-purple-300 text-xs mt-1">
                      <em>{ref.journal}</em> <strong>{ref.volume}</strong>, {ref.pages}
                    </p>
                    {ref.doi !== "—" && (
                      <p className="text-purple-400 text-xs mt-1">
                        DOI: <a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">{ref.doi}</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-red-400">Linkage izomerizm:</strong> NO₂⁻ ambidentat ligand — N yoki O orqali bog'lanishi mumkin</li>
            <li>Nitro (N-bog'langan) — <strong>ν(NO₂) = 1430, 1315, 825 cm⁻¹</strong></li>
            <li>Nitrito (O-bog'langan) — <strong>ν(N=O) = 1485, ν(N-O) = 1065 cm⁻¹</strong></li>
            <li>Co³⁺ (d⁶, QS) — <strong>inert kompleks</strong>, diamagnit</li>
            <li>C₄ᵥ simmetriya — <strong>alternativa taqiq yo'q</strong></li>
            <li><strong>Linkage konversiya:</strong> Nitrito → Nitro (t₁/₂ ≈ 46 minut, Eₐ = 92 kJ/mol)</li>
            <li>1:2 elektrolit (3 ion) — Λm ≈ 230-260 S·cm²/mol</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-nh3-3-cl3" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold transition-all">
            [Co(NH₃)₃Cl₃] →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₅NO₂]Cl₂ • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Penland et al. (1956), Grenthe & Nordin (1979), Heyns & de Waal (1989), Jackson (1988), Naumov (2013)</p>
        </div>
      </footer>
    </main>
  )
}