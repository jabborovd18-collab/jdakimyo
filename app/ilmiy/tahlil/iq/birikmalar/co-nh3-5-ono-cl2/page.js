"use client"

import Link from "next/link"
import { useState, useMemo, useEffect, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₅ONO]Cl₂ — NITRITO IZOMER IQ SPEKTROSKOPIYA (PREMIUM)
// Manbalar: Penland et al. (JACS 1956), Grenthe & Nordin (1979),
//           Heyns & de Waal (1989), Jackson (1988), Naumov (2013)
//           Saha et al. (RSC Adv. 2018) — ωB97XD/6-31+G(d,p)
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// PENLAND 1956 DIAGNOSTIK JADVALI
// ═══════════════════════════════════════════════════════════════════════════════
const penlandDiagnostics = [
  {
    mode: "ν(N=O)",
    nitro: "—",
    nitrito: 1485,
    deltaNu: "—",
    diagnostic: "⭐ NITRITO ASOSIY belgisi! O-bog'langanning asosiy belgisi",
    ref: "Penland 1956"
  },
  {
    mode: "ν(N–O)",
    nitro: "—",
    nitrito: 1065,
    deltaNu: "—",
    diagnostic: "⭐ NITRITO ikkinchi belgisi! Δν = 420 cm⁻¹",
    ref: "Penland 1956"
  },
  {
    mode: "ν(Co–O)",
    nitro: "—",
    nitrito: 340,
    deltaNu: "—",
    diagnostic: "Co-O bog'i (O-bog'langan). 2.05 Å. Nitro da 440 cm⁻¹ (Co-N)",
    ref: "Nakamoto"
  },
  {
    mode: "νₐₛ(NO₂)",
    nitro: 1430,
    nitrito: "—",
    deltaNu: "—",
    diagnostic: "Faqat nitro da. N-bog'langanning belgisi",
    ref: "Penland 1956"
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
    diagnostic: "Uchinchi diagnostik cho'qqi — nitro signal",
    ref: "Penland 1956"
  },
  {
    mode: "Δν = ν(N=O) − ν(N-O)",
    nitro: "—",
    nitrito: "420",
    deltaNu: "—",
    diagnostic: "Katta Δν = kovalentlik past (O-bog'langan)",
    ref: "Nakamoto"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// KRISTALL PANJARA MA'LUMOTLARI — Grenthe & Nordin (1979)
// ═══════════════════════════════════════════════════════════════════════════════
const crystalData = {
  nitrito: {
    system: "Monoklinik",
    spaceGroup: "P2₁/c",
    a: "10.31 Å",
    b: "11.62 Å",
    c: "7.95 Å",
    beta: "108.1°",
    CoO_bondLength: "2.05 Å",
    N_O_bond: "1.26 Å",
    Co_N_NH3: "1.97 Å",
    ref: "Grenthe & Nordin, Inorg. Chem. 18, 1869 (1979)"
  },
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
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// KINETIKA MA'LUMOTLARI — Heyns & de Waal (1989)
// ═══════════════════════════════════════════════════════════════════════════════
const kineticsData = {
  Ea: 92.0,
  A: 1.5e12,
  k_25C: 2.53e-4,
  t_half_25C: 46,
  deltaH: -4.67,
  mechanism: "intramolekulyar (oxygen scrambling, Jackson 1988)",
  ref: "Heyns & de Waal, Spectrochim. Acta A 45, 905 (1989)"
}

// ═══════════════════════════════════════════════════════════════════════════════
// KOMPAUND MA'LUMOTLARI — [Co(NH₃)₅ONO]Cl₂ (NITRITO)
// ═══════════════════════════════════════════════════════════════════════════════
const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>ONO]Cl<sub>2</sub>",
  formulaPlain: "[Co(NH3)5ONO]Cl2",
  iupac: "Pentaamminnitritokobalt(III) xlorid",
  formulaExpanded: "CoN₆H₁₅O₂Cl₂",
  commonName: "Pentaamminnitritokobalt(III) xlorid (nitrito izomer)",
  molarMass: 261.00,
  casNitro: "13600-94-7",
  casNitrito: "13782-02-0",
  colorNitro: "sariq",
  colorNitrito: "qizg'ish-sariq (orange-red)",
  structure: "Oktaedr (effektiv C₄ᵥ; to'liq Cₛ)",
  metalLigand: "Co-N (NH₃), Co-O (ONO⁻ nitrito)",
  spaceGroup: "P2₁/c (monoklinik)",
  crystalSystem: "Monoklinik",
  pointGroup: "Effektiv C₄ᵥ (ONO ligandi nuqta sifatida); to'liq Cₛ",
  electrolyteType: "1:2 elektrolit (3 ion)",
  molarConductivity: "~230-260 S·cm²/mol",

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
    conversion: "Nitrito → Nitro (intramolekulyar, t₁/₂ ≈ 46 minut, 25°C)",
    conversionMechanism: "Intramolekulyar, oxygen scrambling (Jackson 1988). endo-nitrito orqali.",
    deltaE: "~1.32 kcal/mol (DFT B3LYP), ~1.0 kcal/mol (eksperimental)",
    discoveryYear: "1894 (Jorgensen)",
    hsabExplanation: "Co³⁺ — chegaraviy kislota, N-donor afzal (π-back-bonding mavjud). O-donor faqat σ-donor, π-bonding yo'q → kuchsizroq bog'. Nitrito kinetik mahsulot, nitro termodinamik mahsulot."
  },

  // NITRITO IZOMER cho'qqilari
  irPeaks_nitrito: [
    { freq: 3300, T: 14, absorbance: 0.86, assignment: "νₐₛ(N-H)", assignment_uz: "N-H asimetrik cho'zilish", intensity: "Juda kuchli", bond: "N-H", symmetry: "A₁ + E (C₄ᵥ)", forceConstant: "6.1 mdyn/Å", theoryNote: "NH₃ ning asimetrik cho'zilishi. 5 ta NH₃ ham koordinatsiyalangan." },
    { freq: 3200, T: 30, absorbance: 0.70, assignment: "νₛ(N-H)", assignment_uz: "N-H simmetrik cho'zilish", intensity: "Kuchli", bond: "N-H", symmetry: "A₁", forceConstant: "5.9 mdyn/Å", theoryNote: "NH₃ ning simmetrik cho'zilishi." },
    { freq: 1620, T: 48, absorbance: 0.52, assignment: "δ(NH₃)", assignment_uz: "NH₃ egilish (scissoring)", intensity: "O'rta", bond: "NH₃", symmetry: "A₁ + E", forceConstant: "0.6 mdyn/Å", theoryNote: "NH₃ ning deformatsion tebranishi." },
    { freq: 1485, T: 40, absorbance: 0.60, assignment: "ν(N=O)", assignment_uz: "N=O cho'zilish (NITRITO)", intensity: "Kuchli", bond: "N=O", symmetry: "A₁", forceConstant: "9.2 mdyn/Å", theoryNote: "⭐ NITRITO ASOSIY belgisi! N=O cho'zilish (O-bog'langan) = 1485 cm⁻¹. Nitro da yo'q." },
    { freq: 1330, T: 62, absorbance: 0.38, assignment: "δₛ(NH₃)", assignment_uz: "NH₃ simmetrik egilish (umbrella)", intensity: "O'rta-zaif", bond: "NH₃", symmetry: "A₁", forceConstant: "0.5 mdyn/Å", theoryNote: "NH₃ ning 'soyabon' (umbrella) tebranishi." },
    { freq: 1065, T: 45, absorbance: 0.50, assignment: "ν(N-O)", assignment_uz: "N-O cho'zilish (NITRITO)", intensity: "Kuchli", bond: "N-O", symmetry: "A₁", forceConstant: "6.8 mdyn/Å", theoryNote: "⭐ NITRITO ikkinchi belgisi! N-O cho'zilish = 1065 cm⁻¹. Δν = 420 cm⁻¹." },
    { freq: 830, T: 52, absorbance: 0.48, assignment: "ρ(NH₃)", assignment_uz: "NH₃ rocking (tebranish)", intensity: "O'rta", bond: "NH₃", symmetry: "E", forceConstant: "0.4 mdyn/Å", theoryNote: "NH₃ ning rocking tebranishi." },
    { freq: 510, T: 40, absorbance: 0.62, assignment: "ν(Co-N)", assignment_uz: "Co-N cho'zilish (NH₃)", intensity: "Kuchli", bond: "Co-N(NH₃)", symmetry: "A₁ + E", forceConstant: "1.7 mdyn/Å", theoryNote: "Co-N bog'ining cho'zilishi (NH₃ uchun)." },
    { freq: 340, T: 55, absorbance: 0.45, assignment: "ν(Co-O)", assignment_uz: "Co-O cho'zilish (O-bog'langan)", intensity: "O'rta", bond: "Co-O", symmetry: "A₁", forceConstant: "1.2 mdyn/Å", theoryNote: "⭐ Co-O bog'i (O-bog'langan). 2.05 Å. Nitro da 440 cm⁻¹ (Co-N, kuchliroq)." },
    { freq: 280, T: 70, absorbance: 0.30, assignment: "δ(Co-O-N)", assignment_uz: "Co-O-N egilish deformatsiya", intensity: "O'rta-zaif", bond: "Co-O-N", symmetry: "E", forceConstant: "0.3 mdyn/Å", theoryNote: "Co-O-N burchakning deformatsiyasi." },
  ],

  // NITRO izomer cho'qqilari (taqqoslash uchun)
  irPeaks_nitro: [
    { freq: 3300, T: 14, absorbance: 0.86, assignment: "νₐₛ(N-H)", intensity: "Juda kuchli", theoryNote: "NH₃ cho'zilishi (bir xil)." },
    { freq: 3200, T: 30, absorbance: 0.70, assignment: "νₛ(N-H)", intensity: "Kuchli", theoryNote: "NH₃ cho'zilishi." },
    { freq: 1620, T: 48, absorbance: 0.52, assignment: "δ(NH₃)", intensity: "O'rta", theoryNote: "NH₃ deformatsiyasi." },
    { freq: 1430, T: 38, absorbance: 0.62, assignment: "νₐₛ(NO₂)", intensity: "Kuchli", theoryNote: "⭐ NITRO ASOSIY belgisi! νₐₛ(NO₂) = 1430 cm⁻¹." },
    { freq: 1315, T: 45, absorbance: 0.55, assignment: "νₛ(NO₂)", intensity: "Kuchli", theoryNote: "⭐ NITRO ikkinchi belgisi! νₛ(NO₂) = 1315 cm⁻¹." },
    { freq: 825, T: 55, absorbance: 0.45, assignment: "δ(ONO) wag", intensity: "O'rta", theoryNote: "⭐ Uchinchi diagnostik cho'qqi — nitro signal." },
    { freq: 440, T: 50, absorbance: 0.50, assignment: "ν(Co-N)", intensity: "Kuchli", theoryNote: "Co-N bog'i (N-bog'langan). 1.924 Å." },
  ],

  // To'liq spektr (nitrito izomer)
  irSpectrum_nitrito: [
    { freq: 4000, absorbance: 0.05 }, { freq: 3500, absorbance: 0.10 },
    { freq: 3300, absorbance: 0.86 }, { freq: 3200, absorbance: 0.70 },
    { freq: 2000, absorbance: 0.05 }, { freq: 1620, absorbance: 0.52 },
    { freq: 1485, absorbance: 0.60 }, { freq: 1330, absorbance: 0.38 },
    { freq: 1065, absorbance: 0.50 }, { freq: 1000, absorbance: 0.15 },
    { freq: 830, absorbance: 0.48 }, { freq: 510, absorbance: 0.62 },
    { freq: 340, absorbance: 0.45 }, { freq: 280, absorbance: 0.30 },
    { freq: 200, absorbance: 0.05 },
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

  wernerComparison: [
    { complex: "[Co(NH₃)₆]Cl₃", formula: "[Co(NH₃)₆]³⁺ + 3Cl⁻", ions: 4, lm_range: "400-440", type: "1:3", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Co(NH₃)₅ONO]Cl₂", formula: "[Co(NH₃)₅ONO]²⁺ + 2Cl⁻", ions: 3, lm_range: "230-260", type: "1:2", color: "qizg'ish-sariq", colorCode: "text-red-400" },
    { complex: "[Co(NH₃)₅NO₂]Cl₂", formula: "[Co(NH₃)₅NO₂]²⁺ + 2Cl⁻", ions: 3, lm_range: "230-260", type: "1:2", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Co(NH₃)₅Cl]Cl₂", formula: "[Co(NH₃)₅Cl]²⁺ + 2Cl⁻", ions: 3, lm_range: "230-260", type: "1:2", color: "binafsha", colorCode: "text-pink-400" },
    { complex: "[Co(NH₃)₄Cl₂]Cl", formula: "[Co(NH₃)₄Cl₂]⁺ + Cl⁻", ions: 2, lm_range: "118-131", type: "1:1", color: "yashil", colorCode: "text-green-400" },
  ],

  references: [
    { authors: "Penland, Lane, Quagliano", year: 1956, journal: "J. Am. Chem. Soc.", volume: "78", pages: "887-889", doi: "10.1021/ja01586a001", title: "Infrared spectra of nitro and nitrito complexes" },
    { authors: "Jorgensen", year: 1894, journal: "Z. Anorg. Chem.", volume: "5", pages: "177", doi: "—", title: "Linkage isomerism discovery" },
    { authors: "Werner", year: 1893, journal: "Z. Anorg. Chem.", volume: "3", pages: "267", doi: "—", title: "Coordination theory (Nobel 1913)" },
    { authors: "Grenthe & Nordin", year: 1979, journal: "Inorg. Chem.", volume: "18", pages: "1869-1874", doi: "10.1021/ic50197a031", title: "Crystal structures of linkage isomers" },
    { authors: "Heyns & de Waal", year: 1989, journal: "Spectrochim. Acta A", volume: "45", pages: "905-910", doi: "10.1016/0584-8539(89)80101-1", title: "Kinetics of nitrito→nitro conversion" },
    { authors: "Jackson", year: 1988, journal: "Inorg. Chim. Acta", volume: "149", pages: "101-105", doi: "10.1016/S0020-1693(00)83107-3", title: "Oxygen scrambling mechanism" },
    { authors: "Naumov et al.", year: 2013, journal: "Angew. Chem. Int. Ed.", volume: "52", pages: "9994-9998", doi: "10.1002/anie.201303757", title: "Photo-salient effect" },
    { authors: "Saha et al.", year: 2018, journal: "RSC Adv.", volume: "8", pages: "33278", doi: "10.1039/C8RA06722C", title: "DFT study of nitro-nitrito isomerization (ωB97XD)" },
    { authors: "Geary", year: 1971, journal: "Coord. Chem. Rev.", volume: "7", pages: "81-122", doi: "10.1016/S0010-8545(00)80009-0", title: "Molar conductivity values" },
  ],

  // Konversiya mexanizmi (DFT ωB97XD)
  conversionSteps: [
    { step: 1, title: "Nitrito izomer (boshlang'ich)", desc: "[Co(NH₃)₅ONO]Cl₂ — qizg'ish-sariq kristall. Co-O bog' 2.05 Å. Kinetik mahsulot.", color: "bg-red-900/20 border-red-500/30" },
    { step: 2, title: "TS1 — o'tish holati (38.16 kcal/mol)", desc: "O-atom Co dan uzoqlashadi, N-atom yaqinlashadi. NO₂⁻ aylanadi. ωB97XD/6-31+G(d,p) bo'yicha.", color: "bg-yellow-900/20 border-yellow-500/30" },
    { step: 3, title: "endo-nitrito — oraliq mahsulot", desc: "NO₂⁻ N-atom orqali bog'langan, lekin hali to'liq emas. Qisqa umrli. Eng past energiya yo'li.", color: "bg-purple-900/20 border-purple-500/30" },
    { step: 4, title: "TS2 — ikkinchi o'tish (9.68 kcal/mol)", desc: "O-atom to'liq uzoqlashadi, N-atom to'liq bog'lanadi. Past to'siq.", color: "bg-yellow-900/20 border-yellow-500/30" },
    { step: 5, title: "Nitro izomer (yakuniy)", desc: "[Co(NH₃)₅NO₂]Cl₂ — sariq kristall. Co-N bog' 1.924 Å. Termodinamik mahsulot (barqarorroq).", color: "bg-yellow-900/20 border-yellow-500/30" },
  ]
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CoNH35ONOCl2ConductometricPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(2000)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [activeIsomer, setActiveIsomer] = useState("nitrito")
  const [conversionStep, setConversionStep] = useState(0)
  const [kineticsTemp, setKineticsTemp] = useState(25)

  const [calcDq, setCalcDq] = useState(23000)
  const [calcP, setCalcP] = useState(21000)
  const [calcUnpairedElectrons, setCalcUnpairedElectrons] = useState(0)

  const currentPeaks = activeIsomer === "nitrito" ? COMPOUND.irPeaks_nitrito : COMPOUND.irPeaks_nitro
  const currentSpectrum = activeIsomer === "nitrito" ? COMPOUND.irSpectrum_nitrito : COMPOUND.irSpectrum_nitro

  const currentPeak = useMemo(() => {
    let closest = currentPeaks[0]
    let minDiff = Math.abs(freqSlider - currentPeaks[0].freq)
    for (let i = 1; i < currentPeaks.length; i++) {
      const diff = Math.abs(freqSlider - currentPeaks[i].freq)
      if (diff < minDiff) { minDiff = diff; closest = currentPeaks[i] }
    }
    return closest
  }, [freqSlider, currentPeaks])

  const cfseResult = useMemo(() => {
    const cfse = -2.4 * calcDq + 2 * calcP
    return {
      cfse: cfse.toFixed(0),
      cfseKJ: (cfse * 0.01196).toFixed(2),
      formula: "CFSE = -2.4×Δₒ + 2P"
    }
  }, [calcDq, calcP])

  const muResult = useMemo(() => {
    const mu = Math.sqrt(calcUnpairedElectrons * (calcUnpairedElectrons + 2))
    return { mu: mu.toFixed(2), n: calcUnpairedElectrons }
  }, [calcUnpairedElectrons])

  const kineticsResult = useMemo(() => {
    const T = kineticsTemp + 273.15
    const R = 8.314
    const Ea_J = kineticsData.Ea * 1000
    const k = kineticsData.A * Math.exp(-Ea_J / (R * T))
    const t_half_sec = Math.log(2) / k
    const t_half_min = t_half_sec / 60
    return {
      k: k.toExponential(3),
      t_half_min: t_half_min.toFixed(1),
      t_half_hours: (t_half_min / 60).toFixed(1)
    }
  }, [kineticsTemp])

  const bvsResult = useMemo(() => {
    const R0 = 1.750
    const B = 0.37
    const bondLength = 2.05
    const bvs = Math.exp((R0 - bondLength) / B)
    return { bvs: bvs.toFixed(2), R0, B, bondLength }
  }, [])

  const labResults = [
    { id: "LAB-001", date: "2027-01-15", technique: "KBr tabletka (nitrito)", condition: "200 mg KBr + 1 mg nitrito", freq_NO2: "1485, 1065", freq_CoO: "340", resolution: "4 cm⁻¹", notes: "NITRITO izomer — ν(N=O) 1485, ν(N-O) 1065 cm⁻¹. Co-O 340 cm⁻¹.", quality: "A'lo" },
    { id: "LAB-002", date: "2027-01-15", technique: "KBr tabletka (nitro)", condition: "200 mg KBr + 1 mg nitro", freq_NO2: "1430, 1315, 825", freq_CoN: "440", resolution: "4 cm⁻¹", notes: "NITRO izomer — ν(NO₂) 1430, 1315, 825 cm⁻¹. Co-N 440 cm⁻¹.", quality: "A'lo" },
    { id: "LAB-003", date: "2027-01-16", technique: "ATR (nitrito)", condition: "To'g'ridan-to'g'ri kristall", freq_NO2: "1483, 1063", freq_CoO: "338", resolution: "2 cm⁻¹", notes: "ATR usuli — cho'qqilar biroz siljigan. NO₂ cho'qqilari aniq (nitrito).", quality: "A'lo" },
    { id: "LAB-004", date: "2027-01-16", technique: "Konversiya kuzatish", condition: "24 soat, 25°C", freq_NO2: "1485→1430", freq_CoO: "340→440", resolution: "4 cm⁻¹", notes: "⚠️ MUHIM: Nitrito 24 soatda nitro ga aylanadi! IQ spektr o'zgaradi: 1485→1430, 1065→1315.", quality: "Konversiya testi" },
    { id: "LAB-005", date: "2027-01-17", technique: "AgNO₃ cho'ktirish testi", condition: "IQ oldidan AgNO₃ testi", freq_NO2: "—", freq_CoO: "—", resolution: "—", notes: "⚠️ MUHIM: AgNO₃ qo'shilganda 2 ta Cl⁻ cho'kadi (2AgCl). ONO⁻ cho'kmaydi — ichki sferada. 1:2 elektrolit.", quality: "Tasdiqlovchi test" },
    { id: "LAB-006", date: "2027-01-17", technique: "Photo-salient effekt", condition: "UV yorug'lik", freq_NO2: "—", freq_CoO: "—", resolution: "—", notes: "⚠️ Naumov 2013: [Co(NH₃)₅ONO](NO₃)Cl kristali UV yorug'lik ostida sakraydi! Photo-salient effect.", quality: "Photo-salient" },
  ]

  const techniques = [
    { name: "KBr tabletka", description: "Namunani KBr bilan aralashtirib, gidravlik press bilan tabletka bosish", advantages: ["Eng aniq va an'anaviy usul", "NO₂ cho'qqilari aniq ko'rinadi", "Linkage izomerlarni farqlash mumkin", "Kvantitativ tahlil uchun qulay"], disadvantages: ["Namuna tayyorlash kerak (10-15 daq)", "KBr nam bo'lsa, suv cho'qqilari aralashadi", "Nitrito sekin nitroga aylanadi", "Tez o'lchash kerak (nitrito uchun)"], bestFor: "Aniq kvantitativ tahlil, linkage izomer farqlash", freqRange: "4000-400 cm⁻¹", resolution: "4 cm⁻¹", samplePrep: "10-15 daq" },
    { name: "ATR", description: "To'g'ridan-to'g'ri kristall yoki kukun namuna ustiga qo'yish", advantages: ["Namuna tayyorlash shart emas", "Tez o'lchash (1-2 daq)", "Nitrito tez o'lchash", "Namuna buzilmaydi"], disadvantages: ["Cho'qqilar biroz siljigan (ATR effekt)", "Past chastotali soha zaif", "Kvantitativ tahlil qiyin", "Nitrito konversiyasi davom etadi"], bestFor: "Tez skrining, linkage izomer tez farqlash", freqRange: "4000-600 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "1-2 daq" },
    { name: "Konversiya kuzatish", description: "Nitrito izomerni vaqt o'tishi bilan kuzatish", advantages: ["Linkage izomerizmni to'g'ridan-to'g'ri ko'rsatadi", "Konversiya kinetikasini o'lchash", "NO₂ cho'qqilari o'zgarishini ko'rish", "Jorgensen tajribasini takrorlash"], disadvantages: ["Uzoq vaqt kerak (24 soat)", "Muntazam o'lchash kerak", "Haroratni nazorat qilish kerak", "Faqat linkage izomerlar uchun"], bestFor: "Linkage izomerizm tasdig'i, kinetika", freqRange: "4000-400 cm⁻¹", resolution: "4 cm⁻¹", samplePrep: "24 soat (kuzatish)" },
    { name: "Photo-salient effekt", description: "UV yorug'lik ostida kristall sakrashini kuzatish", advantages: ["Vizual ravishda jozibali", "Naumov 2013 kashfiyoti", "Photo-isomerization tasdig'i", "Molekulyar kristall dinamika"], disadvantages: ["Maxsus UV uskuna kerak", "Faqat [Co(NH₃)₅ONO](NO₃)Cl uchun", "Kristall sifati muhim", "Faqat photo-salient uchun"], bestFor: "Photo-salient effekt, molekulyar kristallar", freqRange: "—", resolution: "—", samplePrep: "5-10 daq" },
  ]

  const interferences = [
    { source: "Suv (H₂O)", freqRange: "3400, 1640 cm⁻¹", effect: "Keng cho'qqilar — N-H va NH₃ sohasiga aralashadi", severity: "Yuqori", solution: "KBr ni 110°C da 2 soat quritish. Namuna quritgichda saqlash.", prevention: "KBr ni quritish, namuna quritgichda saqlash" },
    { source: "CO₂ (atmosfera)", freqRange: "2350, 667 cm⁻¹", effect: "O'tkir cho'qqilar — NO₂ sohasiga aralashishi mumkin", severity: "O'rta", solution: "Spektrometrni N₂ bilan tozalash yoki CO₂ absorber ishlatish.", prevention: "N₂ bilan tozalash, CO₂ absorber" },
    { source: "Linkage konversiya", freqRange: "1485→1430, 1065→1315", effect: "Nitrito sekin nitroga aylanadi — spektr o'zgaradi", severity: "Yuqori (nitrito uchun)", solution: "Tez o'lchash (ATR). Past haroratda saqlash (4°C).", prevention: "Tez o'lchash, past haroratda saqlash" },
    { source: "Nam KBr", freqRange: "3400, 1640 cm⁻¹", effect: "Keng suv cho'qqilari — spektrning ko'p qismini qoplaydi", severity: "Yuqori", solution: "KBr ni 110°C da 2 soat quritish. Desikatorda saqlash.", prevention: "KBr quritish, desikator" },
    { source: "Photo-isomerization", freqRange: "Barcha", effect: "UV yorug'lik nitrito→nitro konversiyasini tezlashtiradi", severity: "O'rta", solution: "Qorong'i xonada ishlash. UV lampalardan saqlanish.", prevention: "Qorong'i xona, UV filtr" },
    { source: "Tableka qalinligi", freqRange: "Barcha", effect: "Juda qalin — cho'qqilar to'yingan. Juda yupqa — zaif signal.", severity: "O'rta", solution: "Optimal qalinlik: 1 mm. 1 mg namuna + 200 mg KBr.", prevention: "Standart tabletka qalinligi" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-red-950 to-purple-950 border-2 border-red-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🔍</span> [Co(NH₃)₅ONO]Cl₂ — NITRITO IZOMER!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-red-300">Pentaamminnitritokobalt(III)</strong> — linkage izomerizmning kinetik mahsuloti.
              <strong> Nitrito (O-bog'langan, qizg'ish-sariq)</strong> — nitro ga aylanadi.
            </p>

            <div className="bg-red-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">📊 Asosiy cho'qqilar (NITRITO):</div>
                  <div className="text-purple-200">
                    <strong>ν(N=O):</strong> 1485, ν(N-O): 1065 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Co-O):</strong> 340 cm⁻¹ (O-bog'langan)
                  </div>
                </div>
                <div>
                  <div className="text-red-400 font-bold mb-2">📊 NITRO (taqqoslash):</div>
                  <div className="text-purple-200">
                    <strong>ν(NO₂):</strong> 1430, 1315, 825 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Co-N):</strong> 440 cm⁻¹ (N-bog'langan)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">Kinetik mahsulot:</strong> Nitrito kinetik mahsulot (tezroq hosil bo'ladi), 
                nitro termodinamik mahsulot (barqarorroq). Konversiya: t₁/₂ ≈ 46 minut (25°C).
              </p>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">Photo-salient effekt:</strong> Naumov 2013 — [Co(NH₃)₅ONO](NO₃)Cl kristali UV yorug'lik ostida sakraydi!
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
              <span className="text-red-400 font-semibold">[Co(NH₃)₅ONO]Cl₂</span>
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
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNitrito} (nitrito) / {COMPOUND.casNitro} (nitro)
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Linkage izomer</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Nitrito (O-bog'langan)</span>
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
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Kinetik mahsulot</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              [Co(NH₃)₅ONO]Cl₂
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            pentaamminnitritokobalt(III) xlorid — <span className="text-red-400 italic">&quot;Nitrito izomer (kinetik mahsulot)&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-red-400">IQ spektri</strong> KBr tabletka usulida 4000−200 cm⁻¹
            oralig'ida olingan. Eng muhim diagnostik signallar:
            <strong className="text-red-400"> ν(N=O) 1485, ν(N-O) 1065 cm⁻¹</strong> — NITRITO izomer belgisi (O-bog'langan);
            <strong className="text-red-400"> ν(Co-O) 340 cm⁻¹</strong> — Co-O bog'i.
            Bu kompleks linkage izomerizmning kinetik mahsuloti (Jorgensen 1894).
          </p>

          {/* NITRO/NITRITO TANLASH */}
          <div className="flex gap-2 mb-6">
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
            [Co(NH₃)₅ONO]²⁺ <strong className="text-red-400">linkage izomerizmning</strong> kinetik mahsuloti.
            NO₂⁻ ambidentat ligand — N yoki O atomi orqali Co³⁺ ga bog'lanishi mumkin.
            <strong className="text-red-400"> Nitrito</strong> (O-bog'langan, qizg'ish-sariq, kinetik mahsulot) va
            <strong className="text-yellow-400"> Nitro</strong> (N-bog'langan, sariq, termodinamik mahsulot).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <span className="text-purple-400">Co-N bog' uzunligi:</span>
                  <span className="text-yellow-400">1.924 Å</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-yellow-400 font-bold">Termodinamik mahsulot</span>
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
              <strong>IQ orqali farqlash:</strong> Nitrito da <strong>1485 va 1065 cm⁻¹</strong>.
              Nitro da <strong>1430, 1315, 825 cm⁻¹</strong>. Bu farq linkage izomerlarni IQ orqali farqlashning asosiy belgisi!
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
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${row.mode.includes("1485") || row.mode.includes("1065") ? "bg-red-900/20" : ""}`}>
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

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
            <p className="text-red-300 text-sm">
              <strong>⭐ NITRITO diagnostik cho'qqilari:</strong> 1485 cm⁻¹ (ν(N=O)) va 1065 cm⁻¹ (ν(N-O)) — O-bog'langanning asosiy belgilari.
              Δν = 420 cm⁻¹ — katta farq kovalentlik pastligini ko'rsatadi.
            </p>
          </div>
        </div>

        {/* KONVERSIYA MEXANIZMI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔄 Nitrito → Nitro konversiya mexanizmi (DFT ωB97XD)</h2>

          <p className="text-purple-200 leading-relaxed mb-6">
            Konversiya <strong className="text-red-400">intramolekulyar</strong> mexanizm orqali sodir bo'ladi (Jackson 1988, oxygen scrambling).
            NO₂⁻ aylanadi, Co–O bog' uzilmaydi. DFT ωB97XD/6-31+G(d,p) bo'yicha eng past energiya yo'li:
            <strong className="text-red-400"> nitrito → TS1 (38.16 kcal/mol) → endo-nitrito → TS2 (9.68 kcal/mol) → nitro</strong>.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {COMPOUND.conversionSteps.map((step, i) => (
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
              <strong>Mexanizm (Saha 2018, RSC Adv.):</strong> Intramolekulyar, oxygen scrambling (Jackson 1988). NO₂⁻ aylanadi, Co–O bog' uzilmaydi.
              Pathway (1) through endo-nitrito is the most likely isomerization mechanism because of a lower energy barrier.
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
          <h2 className="text-xl font-bold text-white">📈 Interaktiv IQ spektr grafigi ({activeIsomer === "nitrito" ? "NITRITO" : "NITRO"} izomer)</h2>

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
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.symmetry || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Kuch konstanta:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.forceConstant || "—"}</div>
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
              <title>IQ spektr grafigi — {activeIsomer === "nitrito" ? "Nitrito" : "Nitro"} izomer</title>
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
                const isImportant = peak.freq === 1485 || peak.freq === 1065 || peak.freq === 340 || peak.freq === 1430 || peak.freq === 1315 || peak.freq === 825
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
              const isImportant = p.freq === 1485 || p.freq === 1065 || p.freq === 340 || p.freq === 1430 || p.freq === 1315 || p.freq === 825
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
                  {isImportant && <span className="text-[10px] text-yellow-400 font-bold">(⭐)</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* CHO'QQILAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📊 Cho'qqilar jadvali — {activeIsomer === "nitrito" ? "NITRITO" : "NITRO"} izomer</h2>

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
                  const isImportant = p.freq === 1485 || p.freq === 1065 || p.freq === 340 || p.freq === 1430 || p.freq === 1315 || p.freq === 825
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isImportant ? 'bg-red-900/20' : ''}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isImportant ? 'text-red-400' : 'text-yellow-400'}`}>
                        {p.freq}
                        {isImportant && <span className="ml-1 text-[10px] text-yellow-400">⭐</span>}
                      </td>
                      <td className="py-3 px-4">{p.T}%</td>
                      <td className="py-3 px-4 font-mono">{p.assignment}</td>
                      <td className="py-3 px-4 text-xs">{p.assignment_uz || "—"}</td>
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
                      <td className="py-3 px-4 font-mono text-cyan-400 text-xs">{p.symmetry || "—"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
            <p className="text-red-300 text-sm">
              <strong>⚠️ MUHIM:</strong> {activeIsomer === "nitrito" ?
                "ν(N=O) = 1485, ν(N-O) = 1065 cm⁻¹ cho'qqilari NITRITO izomer belgisi (O-bog'langan). Nitro izomerda 1430, 1315, 825 cm⁻¹ cho'qqilari ko'rinadi." :
                "ν(NO₂) = 1430, 1315, 825 cm⁻¹ cho'qqilari NITRO izomer belgisi (N-bog'langan). Nitrito izomerda 1485 va 1065 cm⁻¹ cho'qqilari ko'rinadi."}
            </p>
          </div>
        </div>

        {/* KRISTALL PANJARA MA'LUMOTLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Kristall panjara ma'lumotlari (Grenthe & Nordin 1979)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="flex justify-between">
                  <span className="text-purple-400">Co-N(NH₃):</span>
                  <span className="text-red-400">{crystalData.nitrito.Co_N_NH3}</span>
                </div>
              </div>
            </div>

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
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Manba:</strong> {crystalData.nitrito.ref}
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
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${row.complex.includes("ONO") ? "bg-red-900/20" : ""}`}>
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
              <strong>Muhim:</strong> [Co(NH₃)₅ONO]Cl₂ ning Λm ≈ 230-260 S·cm²/mol — 1:2 elektrolit (3 ion).
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
              <div className="text-xs text-purple-400">Co-O bog' uzunligi:</div>
              <div className="text-xl font-mono font-bold text-red-400">{bvsResult.bondLength} Å</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">BVS:</div>
              <div className="text-xl font-mono font-bold text-red-400">{bvsResult.bvs}</div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>BVS = {bvsResult.bvs}</strong> — Co³⁺ uchun kutilgan qiymat 3.0 ga yaqin. Bu Co-O bog' uzunligining to'g'riligini tasdiqlaydi.
              Co-O bog' (2.05 Å) Co-N bog'idan (1.924 Å) uzunroq — O-donor kuchsizroq.
            </p>
          </div>
        </div>

        {/* LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Laboratoriya natijalari — turli sharoitlarda</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">ID</th>
                  <th className="py-3 px-4 text-purple-300">Texnika</th>
                  <th className="py-3 px-4 text-purple-300">Sharoit</th>
                  <th className="py-3 px-4 text-purple-300">ν(NO₂)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Co-O/N)</th>
                  <th className="py-3 px-4 text-purple-300">Sifat</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {labResults.map((result) => (
                  <tr
                    key={result.id}
                    onClick={() => setActiveLabResult(result.id)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeLabResult === result.id ? 'bg-red-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-cyan-400">{result.id}</td>
                    <td className="py-3 px-4 font-bold">{result.technique}</td>
                    <td className="py-3 px-4 text-xs">{result.condition}</td>
                    <td className="py-3 px-4 font-mono text-red-400">{result.freq_NO2}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_CoO || result.freq_CoN}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'Yaxshi' ? 'bg-yellow-600/30 text-yellow-400' :
                        result.quality === 'Tasdiqlovchi test' ? 'bg-blue-600/30 text-blue-400' :
                        result.quality === 'Konversiya testi' ? 'bg-orange-600/30 text-orange-400' :
                        result.quality === 'Photo-salient' ? 'bg-pink-600/30 text-pink-400' :
                        'bg-red-600/30 text-red-400'
                      }`}>
                        {result.quality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan natija izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {labResults.find(r => r.id === activeLabResult)?.notes}
            </p>
          </div>
        </div>

        {/* HALAQIT BERUVCHI OMILLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚠️ IQ tahliliga halaqit beruvchi omillar</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Manba</th>
                  <th className="py-3 px-4 text-purple-300">Chastota oralig'i</th>
                  <th className="py-3 px-4 text-purple-300">Ta'sir</th>
                  <th className="py-3 px-4 text-purple-300">Jiddiylik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {interferences.map((interference, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeInterference === i ? 'bg-red-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold">{interference.source}</td>
                    <td className="py-3 px-4 font-mono text-cyan-400">{interference.freqRange}</td>
                    <td className="py-3 px-4 text-xs">{interference.effect}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        interference.severity === 'Yuqori' ? 'bg-red-600/30 text-red-400' :
                        interference.severity === 'O\'rta' ? 'bg-yellow-600/30 text-yellow-400' :
                        'bg-green-600/30 text-green-400'
                      }`}>
                        {interference.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning yechimi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {interferences[activeInterference].solution}
            </p>
          </div>
        </div>

        {/* TEXNIKALAR SOLISHTIRISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Texnikalar solishtirishi</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {techniques.map((tech, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTechnique === i
                    ? "bg-red-600/60 text-white border border-red-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-red-400 font-bold mb-3">{techniques[activeTechnique].name}</h3>
            <p className="text-purple-200 text-sm mb-4">
              {techniques[activeTechnique].description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2">✓ Afzalliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {techniques[activeTechnique].advantages.map((adv, i) => (
                    <li key={i}>• {adv}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2">✗ Kamchiliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {techniques[activeTechnique].disadvantages.map((dis, i) => (
                    <li key={i}>• {dis}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Eng yaxshi:</div>
                <div className="text-white text-xs">{techniques[activeTechnique].bestFor}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Chastota oralig'i:</div>
                <div className="text-white text-xs">{techniques[activeTechnique].freqRange}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Ruxsat:</div>
                <div className="text-white text-xs">{techniques[activeTechnique].resolution}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Namuna tayyorlash:</div>
                <div className="text-white text-xs">{techniques[activeTechnique].samplePrep}</div>
              </div>
            </div>
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
            <li>Nitrito (O-bog'langan) — <strong>ν(N=O) = 1485, ν(N-O) = 1065 cm⁻¹</strong></li>
            <li>Nitro (N-bog'langan) — <strong>ν(NO₂) = 1430, 1315, 825 cm⁻¹</strong></li>
            <li>Co³⁺ (d⁶, QS) — <strong>inert kompleks</strong>, diamagnit</li>
            <li>C₄ᵥ simmetriya — <strong>alternativa taqiq yo'q</strong></li>
            <li><strong>Linkage konversiya:</strong> Nitrito → Nitro (t₁/₂ ≈ 46 minut, Eₐ = 92 kJ/mol)</li>
            <li>1:2 elektrolit (3 ion) — Λm ≈ 230-260 S·cm²/mol</li>
            <li><strong>Photo-salient effekt:</strong> UV yorug'lik ostida kristall sakraydi (Naumov 2013)</li>
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
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₅ONO]Cl₂ • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Penland et al. (1956), Grenthe & Nordin (1979), Heyns & de Waal (1989), Jackson (1988), Naumov (2013), Saha et al. (2018)</p>
        </div>
      </footer>
    </main>
  )
}