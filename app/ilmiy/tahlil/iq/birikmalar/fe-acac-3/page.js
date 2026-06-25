"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Fe(acac)₃] — TEMIR(III) ATSETILASETATONAT IQ SPEKTROSKOPIYA (PREMIUM)
// Manbalar: Nakamoto, Lever (1984), Fernelius (1960), ωB97XD hisob-kitoblari
// Xususiyat: β-diketonat kompleksi, xelat effekti, 6 a'zoli xelat halqa
// O'ziga xoslik: Fe³⁺ (d⁵, yuqori spin), paramagnit, neytral kompleks
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Fe(acac)<sub>3</sub>]",
  formulaPlain: "[Fe(acac)3]",
  iupac: "Tris(atsetilasetonato)temir(III)",
  formulaExpanded: "FeC₁₅H₂₁O₆",
  commonName: "Temir(III) atsetilasetonat (qizil-jigar)",
  molarMass: 353.17,
  casNumber: "14768-11-7",
  color: "qizil-jigar (red-brown)",
  structure: "Oktaedr (D₃ simmetriya)",
  metalLigand: "Fe-O (atsetilasetonat, bidentat)",
  spaceGroup: "P2₁/c (monoklinik)",
  crystalSystem: "Monoklinik",
  pointGroup: "D₃ (oktaedral, distorded)",
  electrolyteType: "Noelektrolit (neytral kompleks)",
  molarConductivity: "~0 S·cm²/mol",

  // Elektron hisobi
  electronCount: {
    Fe3: "Fe³⁺ (d⁵) = 5 elektron",
    acac_ligands: "3 × acac⁻ (2 elektron har biri: 2O) = 6 elektron",
    total: "5 + 6 = 11 elektron (18 emas!)",
    rule: "18 elektron qoidasi bajarilmaydi (yuqori spin d⁵)",
    spinState: "Yuqori spin (t₂g³ e_g²) — paramagnit (5 toq elektron, μ ≈ 5.9 BM)"
  },

  // Ligand ma'lumotlari
  ligandInfo: {
    name: "acac (atsetilasetonat)",
    formula: "C₅H₇O₂⁻",
    type: "Bidentat β-diketonat ligand",
    coordination: "2O (enolat) = bidentat",
    synthesis: "Atsetilaseton + baza → acac⁻",
    bonding: "β-diketonat (O-C-C-C-O) — 6 a'zoli xelat halqa",
    discovery: "Claisen (1880-yillar)"
  },

  // Bog' ma'lumotlari
  bondInfo: {
    Fe_O: "Fe-O bog' uzunligi: ~2.00 Å (enolat)",
    CO: "C=O bog' uzunligi: 1.27 Å (enolat)",
    CC: "C=C bog' uzunligi: 1.39 Å (enolat)",
    CH: "C-H bog' uzunligi: 1.09 Å (metil)",
    bonding: "Bidentat β-diketonat — 2O (enolat) = 6 a'zoli xelat halqa",
    geometry: "Oktaedr (D₃ simmetriya, distorded)"
  },

  // IQ cho'qqilari — NAZARIY IZOHLAR BILAN
  irPeaks: [
    {
      freq: 2980, T: 15, absorbance: 0.45,
      assignment: "νₐₛ(C-H)",
      assignment_uz: "C-H asimetrik cho'zilish (metil guruh)",
      intensity: "Kuchli",
      bond: "C-H",
      symmetry: "A (D₃)",
      forceConstant: "5.0 mdyn/Å",
      theoryNote: "⭐ Alifatik C-H cho'zilish (metil guruh). Erkin atsetilaseton da ν(C-H) ≈ 2980 cm⁻¹. Metil guruh cho'zilish cho'qqilari."
    },
    {
      freq: 2920, T: 18, absorbance: 0.40,
      assignment: "νₛ(C-H)",
      assignment_uz: "C-H simmetrik cho'zilish (metil guruh)",
      intensity: "Kuchli",
      bond: "C-H",
      symmetry: "A (D₃)",
      forceConstant: "4.8 mdyn/Å",
      theoryNote: "Alifatik C-H simmetrik cho'zilish (metil guruh)."
    },
    {
      freq: 1600, T: 8, absorbance: 0.92,
      assignment: "νₐₛ(C=O)",
      assignment_uz: "C=O asimetrik cho'zilish (enolat, xelat C=O)",
      intensity: "Juda kuchli",
      bond: "C=O",
      symmetry: "A (D₃)",
      forceConstant: "9.2 mdyn/Å",
      theoryNote: "⭐⭐ ASOSIY BELGI! C=O enolat cho'zilish (xelat C=O). Erkin atsetilaseton da ν(C=O) ≈ 1710 cm⁻¹, kompleksda 1600 cm⁻¹ — enolat bog'lanishi tufayli sezilarli past (110 cm⁻¹ siljish). Xelat C=O bog'lanishi belgisi."
    },
    {
      freq: 1520, T: 10, absorbance: 0.88,
      assignment: "ν(C=C)",
      assignment_uz: "C=C cho'zilish (enolat)",
      intensity: "Juda kuchli",
      bond: "C=C",
      symmetry: "A (D₃)",
      forceConstant: "8.5 mdyn/Å",
      theoryNote: "⭐⭐ ASOSIY BELGI! C=C enolat cho'zilish. Erkin atsetilaseton da ν(C=C) ≈ 1600 cm⁻¹, kompleksda 1520 cm⁻¹ — enolat rezonansi tufayli past. β-diketonat enolat rezonansi belgisi."
    },
    {
      freq: 1360, T: 20, absorbance: 0.65,
      assignment: "δₛ(CH₃)",
      assignment_uz: "CH₃ simmetrik egilish (metil guruh)",
      intensity: "Kuchli",
      bond: "C-H",
      symmetry: "A (D₃)",
      forceConstant: "0.5 mdyn/Å",
      theoryNote: "CH₃ simmetrik egilish (metil guruh)."
    },
    {
      freq: 1260, T: 22, absorbance: 0.70,
      assignment: "ν(C-O)",
      assignment_uz: "C-O cho'zilish (enolat)",
      intensity: "Kuchli",
      bond: "C-O",
      symmetry: "A (D₃)",
      forceConstant: "6.5 mdyn/Å",
      theoryNote: "⭐⭐ ASOSIY BELGI! C-O enolat cho'zilish. Erkin atsetilaseton da ν(C-O) ≈ 1230 cm⁻¹, kompleksda 1260 cm⁻¹ — enolat bog'lanishi tufayli yuqori. Enolat C-O bog'lanishi belgisi."
    },
    {
      freq: 1020, T: 30, absorbance: 0.55,
      assignment: "ν(C-C)",
      assignment_uz: "C-C cho'zilish (metil)",
      intensity: "O'rta",
      bond: "C-C",
      symmetry: "A (D₃)",
      forceConstant: "4.5 mdyn/Å",
      theoryNote: "C-C cho'zilish (metil guruh)."
    },
    {
      freq: 760, T: 35, absorbance: 0.60,
      assignment: "δ(C-H)",
      assignment_uz: "C-H egilish (out-of-plane)",
      intensity: "Kuchli",
      bond: "C-H",
      symmetry: "E (D₃)",
      forceConstant: "0.6 mdyn/Å",
      theoryNote: "C-H out-of-plane egilish. Metil guruh cho'qqisi."
    },
    {
      freq: 650, T: 40, absorbance: 0.55,
      assignment: "δ(O-Fe-O)",
      assignment_uz: "O-Fe-O egilish",
      intensity: "O'rta",
      bond: "O-Fe-O",
      symmetry: "E (D₃)",
      forceConstant: "0.5 mdyn/Å",
      theoryNote: "O-Fe-O burchakning deformatsiyasi (oktaedral, 90° burchak)."
    },
    {
      freq: 470, T: 45, absorbance: 0.58,
      assignment: "νₐₛ(Fe-O)",
      assignment_uz: "Fe-O asimetrik cho'zilish (enolat)",
      intensity: "Kuchli",
      bond: "Fe-O",
      symmetry: "E (D₃)",
      forceConstant: "1.6 mdyn/Å",
      theoryNote: "⭐⭐ ASOSIY BELGI! Fe-O bog'ining asimetrik cho'zilishi (enolat). Fe-O bog' uzunligi ~2.00 Å. Enolat Fe-O bog'lanishi belgisi."
    },
    {
      freq: 420, T: 50, absorbance: 0.52,
      assignment: "νₛ(Fe-O)",
      assignment_uz: "Fe-O simmetrik cho'zilish (enolat)",
      intensity: "O'rta",
      bond: "Fe-O",
      symmetry: "A (D₃)",
      forceConstant: "1.4 mdyn/Å",
      theoryNote: "Fe-O simmetrik cho'zilish (enolat)."
    },
    {
      freq: 320, T: 55, absorbance: 0.45,
      assignment: "δ(Fe-O-C)",
      assignment_uz: "Fe-O-C egilish",
      intensity: "O'rta-zaif",
      bond: "Fe-O-C",
      symmetry: "E (D₃)",
      forceConstant: "0.4 mdyn/Å",
      theoryNote: "Fe-O-C burchakning deformatsiyasi."
    },
  ],

  // To'liq spektr
  irSpectrum: [
    { freq: 4000, absorbance: 0.05 }, { freq: 3500, absorbance: 0.08 },
    { freq: 2980, absorbance: 0.45 }, { freq: 2920, absorbance: 0.40 },
    { freq: 2500, absorbance: 0.05 }, { freq: 1600, absorbance: 0.92 },
    { freq: 1520, absorbance: 0.88 }, { freq: 1360, absorbance: 0.65 },
    { freq: 1260, absorbance: 0.70 }, { freq: 1020, absorbance: 0.55 },
    { freq: 760, absorbance: 0.60 }, { freq: 650, absorbance: 0.55 },
    { freq: 470, absorbance: 0.58 }, { freq: 420, absorbance: 0.52 },
    { freq: 320, absorbance: 0.45 }, { freq: 200, absorbance: 0.02 },
  ],

  // Turli erituvchilarda
  solventData: [
    {
      solvent: "Xloroform (CHCl₃)", dielectric: 4.8, lm: 0, kappa: 0.0000, color: "qizil-jigar",
      note: "Xloroform da yaxshi eriydi — noelektrolit.",
      theoryNote: "Xloroform kam qutbli, lekin [Fe(acac)₃] neytral kompleks — yaxshi eriydi."
    },
    {
      solvent: "DMF", dielectric: 36.7, lm: 0, kappa: 0.0000, color: "qizil-jigar",
      note: "DMF da yaxshi eriydi.",
      theoryNote: "DMF (ε = 36.7) — qutbli organik erituvchi."
    },
    {
      solvent: "Etanol (C₂H₅OH)", dielectric: 24.3, lm: 0, kappa: 0.0000, color: "qizil-jigar",
      note: "Etanol da eriydi.",
      theoryNote: "Etanol qutbli organik erituvchi."
    },
    {
      solvent: "Aseton", dielectric: 20.7, lm: 0, kappa: 0.0000, color: "qizil-jigar",
      note: "Aseton da eriydi.",
      theoryNote: "Aseton kam qutbli, lekin [Fe(acac)₃] eriydi."
    },
    {
      solvent: "Suv (H₂O)", dielectric: 78.5, lm: 0, kappa: 0.0000, color: "erimaydi",
      note: "⚠️ Suvda ERIMAYDI! [Fe(acac)₃] neytral, organik kompleks.",
      theoryNote: "Suvda erimaydi — organik kompleks."
    },
  ],

  // Halaqit beruvchi omillar
  interferences: [
    {
      source: "Suv (H₂O)", freqRange: "3400, 1620 cm⁻¹",
      effect: "Keng suv cho'qqilari — C=O va C=C cho'qqilariga aralashadi",
      severity: "Yuqori",
      solution: "Suvsiz shakl ishlatish. KBr tabletka uchun KBr ni quritish.",
      theoryNote: "Suv cho'qqilari 3400 va 1620 cm⁻¹ da. [Fe(acac)₃] neytral, suv cho'qqisi aralashishi mumkin."
    },
    {
      source: "Erkin acac", freqRange: "1710, 1600 cm⁻¹",
      effect: "Erkin acac cho'qqilari 1710 va 1600 cm⁻¹ da — C=O sohasiga aralashadi",
      severity: "O'rta",
      solution: "Toza [Fe(acac)₃] ishlatish. Erkin acac yo'qligini tekshirish.",
      theoryNote: "Erkin acac da ν(C=O) ≈ 1710 cm⁻¹. [Fe(acac)₃] da ν(C=O) ≈ 1600 cm⁻¹ — enolat bog'lanishi tufayli past."
    },
    {
      source: "Fe³⁺ oksidlanishi", freqRange: "Barcha",
      effect: "Fe³⁺ qaytarilishi — cho'qqilar o'zgaradi",
      severity: "O'rta",
      solution: "Oksidlanish sharoitidan saqlash. Namuna toza bo'lishi kerak.",
      theoryNote: "Fe³⁺ qaytarilishi mumkin."
    },
    {
      source: "Erituvchi cho'qqilari", freqRange: "Turli",
      effect: "Erituvchi cho'qqilari aralashishi mumkin",
      severity: "O'rta",
      solution: "KBr tabletka ishlatish. Erituvchi cho'qqilarini hisobga olish.",
      theoryNote: "KBr tabletka — eng aniq usul."
    },
  ],

  // Texnikalar
  techniques: [
    {
      name: "KBr tabletka",
      description: "KBr bilan tabletka tayyorlash",
      advantages: ["Eng aniq usul", "C=O va C=C cho'qqilari aniq", "Kvantitativ tahlil"],
      disadvantages: ["Namuna tayyorlash kerak", "KBr nam bo'lsa, suv cho'qqilari aralashadi"],
      bestFor: "Aniq kvantitativ tahlil",
      freqRange: "4000-400 cm⁻¹",
      resolution: "2 cm⁻¹",
      samplePrep: "10-15 daq"
    },
    {
      name: "Xloroform eritmasi (UV-Vis)",
      description: "Xloroform eritmasi — UV-Vis spektroskopiya",
      advantages: ["Xloroform da yaxshi eriydi", "UV-Vis λmax = 450 nm (LMCT)", "Tez o'lchash"],
      disadvantages: ["Faqat xloroform da", "Faqat qizil-jigar rang"],
      bestFor: "UV-Vis, kvantitativ",
      freqRange: "200-800 nm",
      resolution: "1 nm",
      samplePrep: "5-10 daq"
    },
    {
      name: "ATR",
      description: "To'g'ridan-to'g'ri qattiq namuna",
      advantages: ["Tez o'lchash", "Namuna tayyorlash shart emas", "C=O va C=C cho'qqilari aniq"],
      disadvantages: ["Cho'qqilar biroz siljigan"],
      bestFor: "Tez skrining",
      freqRange: "4000-600 cm⁻¹",
      resolution: "2 cm⁻¹",
      samplePrep: "1-2 daq"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      description: "Kristall strukturani aniqlash",
      advantages: ["Eng aniq struktura", "Oktaedr geometriya", "Bond uzunliklari"],
      disadvantages: ["Qimmat uskuna", "Kristall kerak"],
      bestFor: "Strukturaviy tasdiq",
      freqRange: "—",
      resolution: "—",
      samplePrep: "30-60 daq"
    },
  ],

  // Laboratoriya tartibi
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak. acac ligand toksik. Fe³⁺ zaharli.",
      time: "15 daq",
      theoryNote: "acac ligand toksik. [Fe(acac)₃] neytral kompleks."
    },
    {
      step: 2,
      title: "Sof [Fe(acac)₃] ni tayyorlash",
      desc: "Fe³⁺ eritmasiga acac⁻ ligand qo'shish. Qizil-jigar rang hosil bo'ladi.",
      time: "10-15 daq",
      theoryNote: "Fe³⁺ + 3acac⁻ → [Fe(acac)₃] (qizil-jigar rang). β-diketonat kompleksi."
    },
    {
      step: 3,
      title: "IQ spektrometrni tayyorlash",
      desc: "Spektrometrni yoqish, 30 daq isitish. Fon spektrini olish.",
      time: "30 daq",
      theoryNote: "Spektrometr tayyorlanadi."
    },
    {
      step: 4,
      title: "KBr tabletka tayyorlash",
      desc: "1 mg namuna + 200 mg KBr. Gidravlik press bilan tabletka bosish.",
      time: "10-15 daq",
      theoryNote: "KBr tabletka — an'anaviy usul."
    },
    {
      step: 5,
      title: "Spektrlarni o'lchash",
      desc: "4000-400 cm⁻¹ oralig'ida spektrlarni o'lchash.",
      time: "10 daq",
      theoryNote: "4000-400 cm⁻¹ oralig'i."
    },
    {
      step: 6,
      title: "C=O va C=C cho'qqilarini tekshirish",
      desc: "ν(C=O) 1600 cm⁻¹ va ν(C=C) 1520 cm⁻¹ cho'qqilarini tekshirish. Bu β-diketonat belgisi.",
      time: "5 daq",
      theoryNote: "ν(C=O) = 1600 cm⁻¹, ν(C=C) = 1520 cm⁻¹ — [Fe(acac)₃] belgisi."
    },
    {
      step: 7,
      title: "Fe-O cho'qqilarini tekshirish",
      desc: "ν(Fe-O) 470 va 420 cm⁻¹ cho'qqilarini tekshirish.",
      time: "5 daq",
      theoryNote: "ν(Fe-O) = 470, 420 cm⁻¹ — metall-ligand bog'lari."
    },
  ],

  // Laboratoriya natijalari
  labResults: [
    {
      id: "LAB-001",
      technique: "KBr tabletka",
      condition: "Sof [Fe(acac)₃], KBr tabletka",
      freq_CO: "1600",
      freq_CC: "1520",
      freq_FeO: "470, 420",
      quality: "A'lo",
      notes: "Sof [Fe(acac)₃] — ν(C=O) = 1600, ν(C=C) = 1520, ν(Fe-O) = 470, 420 cm⁻¹ cho'qqilari aniq. Bu β-diketonat kompleksi belgisi.",
      theoryNote: "β-diketonat kompleksi belgisi. ν(C=O) ≈ 1600 cm⁻¹ (enolat), ν(C=C) ≈ 1520 cm⁻¹ (enolat)."
    },
    {
      id: "LAB-002",
      technique: "Xloroform eritmasi (UV-Vis)",
      condition: "Xloroform da 10⁻⁴ M",
      freq_CO: "—",
      freq_CC: "—",
      freq_FeO: "—",
      quality: "UV-Vis farqlash",
      notes: "UV-Vis: λmax = 450 nm (LMCT o'tish). Bu [Fe(acac)₃] belgisi.",
      theoryNote: "UV-Vis λmax = 450 nm — LMCT o'tish."
    },
    {
      id: "LAB-003",
      technique: "ATR",
      condition: "To'g'ridan-to'g'ri qattiq",
      freq_CO: "1598",
      freq_CC: "1518",
      freq_FeO: "468, 418",
      quality: "A'lo",
      notes: "ATR usuli — cho'qqilar biroz siljigan. C=O 1598 cm⁻¹, C=C 1518 cm⁻¹ da aniq.",
      theoryNote: "ATR usuli — cho'qqilar biroz siljiydi."
    },
    {
      id: "LAB-004",
      technique: "Konduktometriya",
      condition: "DMF da, 10⁻³ M",
      freq_CO: "—",
      freq_CC: "—",
      freq_FeO: "—",
      quality: "Noelektrolit",
      notes: "⚠️ Λm ≈ 0 S·cm²/mol. Noelektrolit — neytral kompleks.",
      theoryNote: "[Fe(acac)₃] neytral kompleks — noelektrolit. Λm ≈ 0 S·cm²/mol."
    },
    {
      id: "LAB-005",
      technique: "XRD",
      condition: "Kristall namuna",
      freq_CO: "—",
      freq_CC: "—",
      freq_FeO: "—",
      quality: "Strukturaviy tasdiq",
      notes: "XRD — oktaedr geometriya tasdiqlandi. Fe-O ≈ 2.00 Å.",
      theoryNote: "XRD — oktaedr geometriya (D₃ simmetriya)."
    },
  ],
}

export default function FeAcac3Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(1600)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [activeLabStep, setActiveLabStep] = useState(0)

  const [calcDq, setCalcDq] = useState(15000)
  const [calcP, setCalcP] = useState(21000)
  const [calcUnpairedElectrons, setCalcUnpairedElectrons] = useState(5)

  const currentPeak = useMemo(() => {
    let closest = COMPOUND.irPeaks[0]
    let minDiff = Math.abs(freqSlider - COMPOUND.irPeaks[0].freq)
    for (let i = 1; i < COMPOUND.irPeaks.length; i++) {
      const diff = Math.abs(freqSlider - COMPOUND.irPeaks[i].freq)
      if (diff < minDiff) { minDiff = diff; closest = COMPOUND.irPeaks[i] }
    }
    return closest
  }, [freqSlider])

  const cfseResult = useMemo(() => {
    // Fe³⁺ yuqori spin d⁵: CFSE = 0 (t₂g³ e_g²)
    const cfse = 0
    return {
      cfse: cfse.toFixed(0),
      cfseKJ: (cfse * 0.01196).toFixed(2),
      formula: "CFSE = 0 (yuqori spin d⁵, CFSE = 0)"
    }
  }, [calcDq, calcP])

  const muResult = useMemo(() => {
    const mu = Math.sqrt(calcUnpairedElectrons * (calcUnpairedElectrons + 2))
    return { mu: mu.toFixed(2), n: calcUnpairedElectrons }
  }, [calcUnpairedElectrons])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-red-950 to-purple-950 border-2 border-red-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚗️</span> [Fe(acac)₃] — TEMIR(III) ATSETILASETATONAT (QIZIL-JIGAR)!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-red-300">[Fe(acac)₃]</strong> — temir(III) atsetilasetonat, β-diketonat kompleksi.
              Fe³⁺ (d⁵, yuqori spin), paramagnit, 6 a'zoli xelat halqa!
            </p>

            <div className="bg-red-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">📊 Asosiy cho'qqilar:</div>
                  <div className="text-purple-200">
                    <strong>ν(C=O):</strong> 1600 cm⁻¹ (enolat)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(C=C):</strong> 1520 cm⁻¹ (enolat)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Fe-O):</strong> 470, 420 cm⁻¹
                  </div>
                </div>
                <div>
                  <div className="text-red-400 font-bold mb-2">🔬 Xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Fe³⁺ (d⁵, yuqori spin)</strong>
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Paramagnit</strong> (5 toq elektron)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>6 a'zoli xelat halqa</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">β-diketonat:</strong> atsetilaseton + baza → acac⁻ (enolat).
                Bidentat ligand — 2O (enolat) = 6 a'zoli xelat halqa.
              </p>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-200">
                <strong className="text-red-300">⚠️ XAVFSIZLIK:</strong> acac ligand toksik! Fe³⁺ zaharli. Qo'lqop, ko'zoynak kerak!
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
              <span className="text-red-400 font-semibold">[Fe(acac)₃]</span>
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
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">β-diketonat</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">6 a'zoli xelat</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Oktaedr</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Paramagnit</span>
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
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">β-diketonat</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Oktaedr</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Paramagnit</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">6 a'zoli xelat</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              [Fe(acac)₃]
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            temir(III) atsetilasetonat — <span className="text-red-400 italic">&quot;β-diketonat kompleksi, 6 a'zoli xelat halqa, oktaedr, paramagnit&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-red-400">IQ spektri</strong> KBr tabletka yoki xloroform eritmasida olingan. Eng muhim diagnostik signallar:
            <strong className="text-red-400"> ν(C=O) 1600 cm⁻¹</strong> — C=O enolat cho'zilish;
            <strong className="text-red-400"> ν(C=C) 1520 cm⁻¹</strong> — C=C enolat cho'zilish;
            <strong className="text-red-400"> ν(Fe-O) 470, 420 cm⁻¹</strong> — Fe-O bog'lari.
            Bu kompleks β-diketonat kompleksi — bidentat ligand (2O enolat).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Fe³⁺ (d⁵)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Spin holati</div>
              <div className="text-white font-bold">Yuqori spin</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Magnit</div>
              <div className="text-white font-bold">Paramagnit (5e)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit</div>
              <div className="text-white font-bold">Noelektrolit</div>
            </div>
          </div>
        </div>

        {/* β-DIKETONAT MA'LUMOTLARI */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔗 β-diketonat kompleksi — 6 a'zoli xelat halqa</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">acac ligand</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Nomi:</span>
                  <span className="text-red-400">Atsetilasetonat</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Formula:</span>
                  <span className="text-red-400">C₅H₇O₂⁻</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Turi:</span>
                  <span className="text-red-400">Bidentat β-diketonat</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Koordinatsiya:</span>
                  <span className="text-red-400">2O (enolat)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Sintez:</span>
                  <span className="text-red-400">Atsetilaseton + baza</span>
                </div>
              </div>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Bog' ma'lumotlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Fe-O bog':</span>
                  <span className="text-red-400">~2.00 Å (enolat)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">C=O bog':</span>
                  <span className="text-red-400">1.27 Å (enolat)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">C=C bog':</span>
                  <span className="text-red-400">1.39 Å (enolat)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">C-H bog':</span>
                  <span className="text-red-400">1.09 Å (metil)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Geometriya:</span>
                  <span className="text-red-400">Oktaedr (D₃)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-300 text-sm">
              <strong>β-diketonat:</strong> atsetilaseton + baza → acac⁻ (enolat).
              Bidentat ligand — 2O (enolat) = 6 a'zoli xelat halqa.
              <br/><strong>ν(C=O) cho'qqisi:</strong> Erkin acac da ν(C=O) ≈ 1710 cm⁻¹, kompleksda 1600 cm⁻¹ — enolat bog'lanishi tufayli sezilarli past (110 cm⁻¹ siljish).
              <br/><strong>ν(C=C) cho'qqisi:</strong> Erkin acac da ν(C=C) ≈ 1600 cm⁻¹, kompleksda 1520 cm⁻¹ — enolat rezonansi tufayli past.
              <br/><strong>ν(Fe-O) cho'qqilari:</strong> 470 va 420 cm⁻¹ — metall-ligand bog'lari.
            </p>
          </div>
        </div>

        {/* IQ CHO'QQILARI — NAZARIY IZOHLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📊 IQ cho'qqilari — NAZARIY IZOHLAR BILAN</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Chastota</th>
                  <th className="py-3 px-4 text-purple-300">Belgilanish</th>
                  <th className="py-3 px-4 text-purple-300">Intensivlik</th>
                  <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                  <th className="py-3 px-4 text-purple-300">Kuch konstanta</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.irPeaks.map((p, i) => {
                  const isImportant = p.freq === 1600 || p.freq === 1520 || p.freq === 470 || p.freq === 420
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isImportant ? 'bg-red-900/20' : ''}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isImportant ? 'text-red-400' : 'text-red-400'}`}>
                        {p.freq}
                        {isImportant && <span className="ml-1 text-[10px] text-red-400">⭐</span>}
                      </td>
                      <td className="py-3 px-4 font-mono">{p.assignment}</td>
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
                      <td className="py-3 px-4 font-mono text-cyan-400 text-xs">{p.symmetry}</td>
                      <td className="py-3 px-4 font-mono text-cyan-400">{p.forceConstant || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
            <p className="text-red-300 text-sm">
              <strong>⭐⭐ MUHIM:</strong> ν(C=O) = 1600 cm⁻¹ — bu [Fe(acac)₃] ning ASOSIY BELGISI!
              β-diketonat enolat cho'zilish. Erkin acac da ν(C=O) ≈ 1710 cm⁻¹, kompleksda 1600 cm⁻¹ — enolat bog'lanishi tufayli sezilarli past (110 cm⁻¹ siljish).
              ν(C=C) = 1520 cm⁻¹ — enolat rezonansi tufayli past.
              ν(Fe-O) = 470, 420 cm⁻¹ — metall-ligand bog'lari.
            </p>
          </div>
        </div>

        {/* INTERAKTIV IQ SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv IQ spektr grafigi</h2>

          <p className="text-purple-200 leading-relaxed mb-6">
            Slayderni harakatlantirib, chastotani o'zgartiring. Eng yaqin cho'qqi avtomatik tanlanadi.
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
              <span>200 cm⁻¹ (Fe-O)</span>
              <span>2000 cm⁻¹</span>
              <span>4000 cm⁻¹ (C-H)</span>
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
                <div className="text-xl font-mono font-bold text-red-400">{currentPeak.forceConstant || '—'}</div>
              </div>
            </div>
            <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
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
              <title>IQ spektr grafigi — [Fe(acac)₃]</title>
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
                points={COMPOUND.irSpectrum.map(p => {
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

              {COMPOUND.irPeaks.map((peak, i) => {
                const x = 50 + ((4000 - peak.freq)/4000)*530
                const y = 220 - (peak.absorbance/1.0)*200
                const isActive = currentPeak.freq === peak.freq
                const isImportant = peak.freq === 1600 || peak.freq === 1520 || peak.freq === 470 || peak.freq === 420
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
        </div>

        {/* LABORATORIYA BAJARISH TARTIBI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧪 Laboratoriyani 0 dan bajarish tartibi (KENGAYTIRILGAN)</h2>

          <div className="space-y-3">
            {COMPOUND.labProcedure.map((step, i) => (
              <div key={i} className={`rounded-xl p-5 cursor-pointer transition-all ${
                activeLabStep === i ? "bg-red-900/40 border-2 border-red-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-red-500/50"
              }`}
              onClick={() => setActiveLabStep(i)}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeLabStep === i ? "bg-red-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-red-400 font-bold">{step.title}</p>
                  </div>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-2">
                      <div className="text-red-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
                      <p className="text-purple-200 text-xs">{step.theoryNote}</p>
                    </div>
                    <div className="text-[10px] text-red-400 mt-2">
                      Vaqt: {step.time}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* LABORATORIYA NATIJALARI SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Laboratoriya natijalari solishtirish (KENGAYTIRILGAN)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">ID</th>
                  <th className="py-3 px-4 text-purple-300">Texnika</th>
                  <th className="py-3 px-4 text-purple-300">Sharoit</th>
                  <th className="py-3 px-4 text-purple-300">ν(C=O)</th>
                  <th className="py-3 px-4 text-purple-300">ν(C=C)</th>
                  <th className="py-3 px-4 text-purple-300">Sifat</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.labResults.map((result) => (
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
                    <td className="py-3 px-4 font-mono">{result.freq_CO}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_CC}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'UV-Vis farqlash' ? 'bg-blue-600/30 text-blue-400' :
                        result.quality === 'Noelektrolit' ? 'bg-orange-600/30 text-orange-400' :
                        result.quality === 'Strukturaviy tasdiq' ? 'bg-blue-600/30 text-blue-400' :
                        'bg-green-600/30 text-green-400'
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
              {COMPOUND.labResults.find(r => r.id === activeLabResult)?.notes}
            </p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-3">
              <div className="text-red-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
              <p className="text-purple-200 text-xs">{COMPOUND.labResults.find(r => r.id === activeLabResult)?.theoryNote}</p>
            </div>
          </div>
        </div>

        {/* HALAQIT BERUVCHI OMILLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚠️ Halaqit beruvchi omillar (NAZARIY IZOHLAR)</h2>

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
                {COMPOUND.interferences.map((interference, i) => (
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
              {COMPOUND.interferences[activeInterference].solution}
            </p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-3">
              <div className="text-red-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
              <p className="text-purple-200 text-xs">{COMPOUND.interferences[activeInterference].theoryNote}</p>
            </div>
          </div>
        </div>

        {/* TEXNIKALAR SOLISHTIRISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Texnikalar solishtirishi (TARTIBI)</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.techniques.map((tech, i) => (
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
            <h3 className="text-red-400 font-bold mb-3">{COMPOUND.techniques[activeTechnique].name}</h3>
            <p className="text-purple-200 text-sm mb-4">
              {COMPOUND.techniques[activeTechnique].description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2">✓ Afzalliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {COMPOUND.techniques[activeTechnique].advantages.map((adv, i) => (
                    <li key={i}>• {adv}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2">✗ Kamchiliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {COMPOUND.techniques[activeTechnique].disadvantages.map((dis, i) => (
                    <li key={i}>• {dis}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Eng yaxshi:</div>
                <div className="text-white text-xs">{COMPOUND.techniques[activeTechnique].bestFor}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Chastota oralig'i:</div>
                <div className="text-white text-xs">{COMPOUND.techniques[activeTechnique].freqRange}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Ruxsat:</div>
                <div className="text-white text-xs">{COMPOUND.techniques[activeTechnique].resolution}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Namuna tayyorlash:</div>
                <div className="text-white text-xs">{COMPOUND.techniques[activeTechnique].samplePrep}</div>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-red-400">β-diketonat kompleksi:</strong> Bidentat ligand (2O enolat), 6 a'zoli xelat halqa</li>
            <li><strong className="text-red-400">IR belgisi:</strong> ν(C=O) = 1600 cm⁻¹ (enolat, 110 cm⁻¹ siljish), ν(C=C) = 1520 cm⁻¹ (enolat rezonansi)</li>
            <li><strong className="text-red-400">Metall-ligand bog'lari:</strong> ν(Fe-O) = 470, 420 cm⁻¹</li>
            <li><strong className="text-red-400">Oktaedr:</strong> Fe³⁺ (d⁵, yuqori spin), paramagnit (5 toq elektron, μ ≈ 5.9 BM)</li>
            <li><strong className="text-red-400">Noelektrolit:</strong> Neytral kompleks, Λm ≈ 0 S·cm²/mol</li>
            <li><strong className="text-red-400">UV-Vis λmax = 450 nm:</strong> LMCT o'tish</li>
            <li><strong className="text-red-400">⚠️ XAVFSIZLIK:</strong> acac ligand toksik! Fe³⁺ zaharli.</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/iq" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold transition-all">
            IQ spektroskopiya →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(acac)₃] (Temir(III) atsetilasetonat) • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Nakamoto, Lever (1984), Fernelius (1960), ωB97XD hisob-kitoblari</p>
        </div>
      </footer>
    </main>
  )
}