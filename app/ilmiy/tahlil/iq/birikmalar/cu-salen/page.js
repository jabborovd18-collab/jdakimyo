"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Cu(salen)] — MIS(II) SALEN KOMPLEKSI IQ SPEKTROSKOPIYA (PREMIUM)
// Manbalar: Nakamoto, Lever (1984), Calvin (1952), Sacconi (1968)
// Xususiyat: Tetradentat Schiff asos kompleksi, kvadrat-tekis, paramagnit
// O'ziga xoslik: Schiff asos (C=N), Cu-N va Cu-O bog'lari, yashil rang
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Cu(salen)]",
  formulaPlain: "[Cu(salen)]",
  iupac: "N,N'-bis(salitsiliden)etilendiaminmis(II)",
  formulaExpanded: "CuC₁₆H₁₆N₂O₂",
  commonName: "Mis(II) salen kompleksi (yashil)",
  molarMass: 325.84,
  casNumber: "14284-95-2",
  color: "yashil (green)",
  structure: "Kvadrat-tekis (D₂ₕ yoki C₂ᵥ simmetriya)",
  metalLigand: "Cu-N (Schiff asos), Cu-O (fenolat)",
  spaceGroup: "P2₁/c (monoklinik)",
  crystalSystem: "Monoklinik",
  pointGroup: "D₂ₕ (ideal) yoki C₂ᵥ (distorted)",
  electrolyteType: "Noelektrolit (neytral kompleks)",
  molarConductivity: "~0 S·cm²/mol",

  // Elektron hisobi
  electronCount: {
    Cu2: "Cu²⁺ (d⁹) = 9 elektron",
    salen_ligand: "salen²⁻ (4 elektron: 2N + 2O) = 4 elektron",
    total: "9 + 4 = 13 elektron (18 emas!)",
    rule: "18 elektron qoidasi bajarilmaydi (kvadrat-tekis d⁹)",
    spinState: "d⁹, 1 toq elektron — paramagnit (μ ≈ 1.9 BM)"
  },

  // Ligand ma'lumotlari
  ligandInfo: {
    name: "salen (N,N'-bis(salitsiliden)etilendiamin)",
    formula: "C₁₆H₁₆N₂O₂²⁻",
    type: "Tetradentat Schiff asos ligand",
    coordination: "2N (imin) + 2O (fenolat) = tetradentat",
    synthesis: "Salitsilaldegid + etilendiamin → Schiff asos",
    bonding: "Schiff asos (C=N imin) + fenolat O⁻",
    discovery: "Pfeiffer (1930-yillar)"
  },

  // Bog' ma'lumotlari
  bondInfo: {
    Cu_N: "Cu-N bog' uzunligi: ~2.0 Å (Schiff asos)",
    Cu_O: "Cu-O bog' uzunligi: ~1.95 Å (fenolat)",
    CN: "C=N bog' uzunligi: 1.28 Å (imin)",
    CO: "C-O bog' uzunligi: 1.30 Å (fenolat)",
    bonding: "Tetradentat ligand — 2N (imin) + 2O (fenolat)",
    geometry: "Kvadrat-tekis (D₂ₕ yoki C₂ᵥ)"
  },

  // IQ cho'qqilari — NAZARIY IZOHLAR BILAN
  irPeaks: [
    {
      freq: 1620, T: 8, absorbance: 0.92,
      assignment: "ν(C=N)",
      assignment_uz: "C=N imin cho'zilish (Schiff asos)",
      intensity: "Juda kuchli",
      bond: "C=N",
      symmetry: "B₁ᵤ (D₂ₕ)",
      forceConstant: "9.5 mdyn/Å",
      theoryNote: "⭐⭐ ASOSIY BELGI! C=N imin cho'zilish (Schiff asos). Erkin salen da ν(C=N) ≈ 1640 cm⁻¹, kompleksda 1620 cm⁻¹ — bog'lanish tufayli biroz past. Schiff asos kompleksi belgisi."
    },
    {
      freq: 1595, T: 12, absorbance: 0.75,
      assignment: "ν(C=C)",
      assignment_uz: "Aromatik C=C cho'zilish (fenolik halqa)",
      intensity: "Kuchli",
      bond: "C=C",
      symmetry: "B₁ᵤ (D₂ₕ)",
      forceConstant: "8.0 mdyn/Å",
      theoryNote: "Aromatik C=C cho'zilish (fenolik halqa). Salitsilaldegid halqasi."
    },
    {
      freq: 1460, T: 20, absorbance: 0.65,
      assignment: "ν(C=N) + δ(C-H)",
      assignment_uz: "C=N cho'zilish + C-H egilish",
      intensity: "Kuchli",
      bond: "C=N, C-H",
      symmetry: "B₂ᵤ (D₂ₕ)",
      forceConstant: "7.5 mdyn/Å",
      theoryNote: "C=N cho'zilish va C-H egilish aralashmasi."
    },
    {
      freq: 1310, T: 25, absorbance: 0.70,
      assignment: "ν(C-O)",
      assignment_uz: "C-O fenolat cho'zilish",
      intensity: "Kuchli",
      bond: "C-O",
      symmetry: "B₁ᵤ (D₂ₕ)",
      forceConstant: "6.8 mdyn/Å",
      theoryNote: "⭐⭐ ASOSIY BELGI! C-O fenolat cho'zilish. Erkin salitsilaldegid da ν(C-O) ≈ 1280 cm⁻¹, kompleksda 1310 cm⁻¹ — fenolat bog'lanishi tufayli yuqori. Fenolat O⁻ bog'lanishi belgisi."
    },
    {
      freq: 1145, T: 30, absorbance: 0.55,
      assignment: "ν(C-N)",
      assignment_uz: "C-N cho'zilish (etilendiamin)",
      intensity: "O'rta",
      bond: "C-N",
      symmetry: "B₁ᵤ (D₂ₕ)",
      forceConstant: "5.5 mdyn/Å",
      theoryNote: "C-N cho'zilish (etilendiamin ko'prigi)."
    },
    {
      freq: 760, T: 35, absorbance: 0.60,
      assignment: "δ(C-H)",
      assignment_uz: "Aromatik C-H egilish (out-of-plane)",
      intensity: "Kuchli",
      bond: "C-H",
      symmetry: "B₂ᵤ (D₂ₕ)",
      forceConstant: "0.6 mdyn/Å",
      theoryNote: "Aromatik C-H out-of-plane egilish. Aromatik halqa belgisi."
    },
    {
      freq: 450, T: 45, absorbance: 0.58,
      assignment: "ν(Cu-N)",
      assignment_uz: "Cu-N cho'zilish (Schiff asos)",
      intensity: "O'rta",
      bond: "Cu-N",
      symmetry: "B₁ᵤ (D₂ₕ)",
      forceConstant: "1.6 mdyn/Å",
      theoryNote: "⭐⭐ ASOSIY BELGI! Cu-N bog'ining cho'zilishi (Schiff asos). Cu-N bog' uzunligi ~2.0 Å. Schiff asos bog'lanishi belgisi."
    },
    {
      freq: 420, T: 50, absorbance: 0.52,
      assignment: "ν(Cu-O)",
      assignment_uz: "Cu-O cho'zilish (fenolat)",
      intensity: "O'rta",
      bond: "Cu-O",
      symmetry: "B₂ᵤ (D₂ₕ)",
      forceConstant: "1.5 mdyn/Å",
      theoryNote: "⭐⭐ ASOSIY BELGI! Cu-O bog'ining cho'zilishi (fenolat). Cu-O bog' uzunligi ~1.95 Å. Fenolat O⁻ bog'lanishi belgisi."
    },
    {
      freq: 320, T: 55, absorbance: 0.45,
      assignment: "δ(N-Cu-O)",
      assignment_uz: "N-Cu-O egilish",
      intensity: "O'rta-zaif",
      bond: "N-Cu-O",
      symmetry: "B₃ᵤ (D₂ₕ)",
      forceConstant: "0.4 mdyn/Å",
      theoryNote: "N-Cu-O burchakning deformatsiyasi (kvadrat-tekis, 90° burchak)."
    },
    {
      freq: 290, T: 60, absorbance: 0.38,
      assignment: "δ(Cu-N, Cu-O)",
      assignment_uz: "Cu-N, Cu-O egilish aralashmasi",
      intensity: "Zaif",
      bond: "Cu-N, Cu-O",
      symmetry: "B₃ᵤ (D₂ₕ)",
      forceConstant: "0.3 mdyn/Å",
      theoryNote: "Cu-N va Cu-O egilish aralashmasi."
    },
    {
      freq: 3300, T: 15, absorbance: 0.35,
      assignment: "ν(O-H)",
      assignment_uz: "O-H cho'zilish (suv, agar nam bo'lsa)",
      intensity: "O'rta",
      bond: "O-H",
      symmetry: "—",
      theoryNote: "Agar nam bo'lsa, suv cho'qqisi. [Cu(salen)] neytral, suv cho'qqisi aralashishi mumkin."
    },
    {
      freq: 2900, T: 20, absorbance: 0.40,
      assignment: "ν(C-H)",
      assignment_uz: "Alifatik C-H cho'zilish (etilendiamin)",
      intensity: "O'rta",
      bond: "C-H",
      symmetry: "B₁ᵤ (D₂ₕ)",
      forceConstant: "5.0 mdyn/Å",
      theoryNote: "Alifatik C-H cho'zilish (etilendiamin ko'prigi)."
    },
  ],

  // To'liq spektr
  irSpectrum: [
    { freq: 4000, absorbance: 0.05 }, { freq: 3300, absorbance: 0.35 },
    { freq: 2900, absorbance: 0.40 }, { freq: 2500, absorbance: 0.05 },
    { freq: 1620, absorbance: 0.92 }, { freq: 1595, absorbance: 0.75 },
    { freq: 1460, absorbance: 0.65 }, { freq: 1310, absorbance: 0.70 },
    { freq: 1145, absorbance: 0.55 }, { freq: 760, absorbance: 0.60 },
    { freq: 450, absorbance: 0.58 }, { freq: 420, absorbance: 0.52 },
    { freq: 320, absorbance: 0.45 }, { freq: 290, absorbance: 0.38 },
    { freq: 200, absorbance: 0.02 },
  ],

  // Turli erituvchilarda
  solventData: [
    {
      solvent: "DMF", dielectric: 36.7, lm: 0, kappa: 0.0000, color: "yashil",
      note: "DMF da yaxshi eriydi — noelektrolit.",
      theoryNote: "DMF (ε = 36.7) — qutbli organik erituvchi. [Cu(salen)] neytral kompleks — noelektrolit."
    },
    {
      solvent: "DMSO", dielectric: 46.7, lm: 0, kappa: 0.0000, color: "yashil",
      note: "DMSO da yaxshi eriydi.",
      theoryNote: "DMSO (ε = 46.7) — yuqori qutbli organik erituvchi."
    },
    {
      solvent: "Xloroform (CHCl₃)", dielectric: 4.8, lm: 0, kappa: 0.0000, color: "yashil",
      note: "Xloroform da eriydi.",
      theoryNote: "Xloroform kam qutbli, lekin [Cu(salen)] eriydi."
    },
    {
      solvent: "Etanol (C₂H₅OH)", dielectric: 24.3, lm: 0, kappa: 0.0000, color: "yashil",
      note: "Etanol da eriydi.",
      theoryNote: "Etanol qutbli organik erituvchi."
    },
    {
      solvent: "Suv (H₂O)", dielectric: 78.5, lm: 0, kappa: 0.0000, color: "erimaydi",
      note: "⚠️ Suvda ERIMAYDI! [Cu(salen)] neytral, organik kompleks.",
      theoryNote: "Suvda erimaydi — organik kompleks."
    },
  ],

  // Halaqit beruvchi omillar
  interferences: [
    {
      source: "Suv (H₂O)", freqRange: "3400, 1620 cm⁻¹",
      effect: "Keng suv cho'qqilari — C=N va O-H cho'qqilariga aralashadi",
      severity: "Yuqori",
      solution: "Suvsiz shakl ishlatish. KBr tabletka uchun KBr ni quritish.",
      theoryNote: "Suv cho'qqilari 3400 va 1620 cm⁻¹ da. [Cu(salen)] neytral, suv cho'qqisi aralashishi mumkin."
    },
    {
      source: "Erkin salen", freqRange: "1640 cm⁻¹",
      effect: "Erkin salen cho'qqisi 1640 cm⁻¹ da — C=N sohasiga aralashadi",
      severity: "O'rta",
      solution: "Toza [Cu(salen)] ishlatish. Erkin salen yo'qligini tekshirish.",
      theoryNote: "Erkin salen da ν(C=N) ≈ 1640 cm⁻¹. [Cu(salen)] da ν(C=N) ≈ 1620 cm⁻¹ — bog'lanish tufayli past."
    },
    {
      source: "Cu²⁺ oksidlanishi", freqRange: "Barcha",
      effect: "Cu²⁺ → Cu⁺ qaytarilishi — cho'qqilar o'zgaradi",
      severity: "O'rta",
      solution: "Oksidlanish sharoitidan saqlash. Namuna toza bo'lishi kerak.",
      theoryNote: "Cu²⁺ qaytarilishi mumkin."
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
      advantages: ["Eng aniq usul", "C=N va C-O cho'qqilari aniq", "Kvantitativ tahlil"],
      disadvantages: ["Namuna tayyorlash kerak", "KBr nam bo'lsa, suv cho'qqilari aralashadi"],
      bestFor: "Aniq kvantitativ tahlil",
      freqRange: "4000-400 cm⁻¹",
      resolution: "2 cm⁻¹",
      samplePrep: "10-15 daq"
    },
    {
      name: "DMF eritmasi (UV-Vis)",
      description: "DMF eritmasi — UV-Vis spektroskopiya",
      advantages: ["DMF da yaxshi eriydi", "UV-Vis λmax = 600 nm (d-d)", "Tez o'lchash"],
      disadvantages: ["Faqat DMF da", "Faqat yashil rang"],
      bestFor: "UV-Vis, kvantitativ",
      freqRange: "200-800 nm",
      resolution: "1 nm",
      samplePrep: "5-10 daq"
    },
    {
      name: "ATR",
      description: "To'g'ridan-to'g'ri qattiq namuna",
      advantages: ["Tez o'lchash", "Namuna tayyorlash shart emas", "C=N va C-O cho'qqilari aniq"],
      disadvantages: ["Cho'qqilar biroz siljigan"],
      bestFor: "Tez skrining",
      freqRange: "4000-600 cm⁻¹",
      resolution: "2 cm⁻¹",
      samplePrep: "1-2 daq"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      description: "Kristall strukturani aniqlash",
      advantages: ["Eng aniq struktura", "Kvadrat-tekis geometriya", "Bond uzunliklari"],
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
      desc: "Qo'lqop, ko'zoynak. salen ligand toksik. Cu²⁺ zaharli.",
      time: "15 daq",
      theoryNote: "salen ligand toksik. [Cu(salen)] neytral kompleks."
    },
    {
      step: 2,
      title: "Sof [Cu(salen)] ni tayyorlash",
      desc: "Cu²⁺ eritmasiga salen ligand qo'shish. Yashil rang hosil bo'ladi.",
      time: "10-15 daq",
      theoryNote: "Cu²⁺ + salen²⁻ → [Cu(salen)] (yashil rang). Schiff asos kompleksi."
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
      title: "C=N va C-O cho'qqilarini tekshirish",
      desc: "ν(C=N) 1620 cm⁻¹ va ν(C-O) 1310 cm⁻¹ cho'qqilarini tekshirish. Bu Schiff asos belgisi.",
      time: "5 daq",
      theoryNote: "ν(C=N) = 1620 cm⁻¹, ν(C-O) = 1310 cm⁻¹ — [Cu(salen)] belgisi."
    },
    {
      step: 7,
      title: "Cu-N va Cu-O cho'qqilarini tekshirish",
      desc: "ν(Cu-N) 450 cm⁻¹ va ν(Cu-O) 420 cm⁻¹ cho'qqilarini tekshirish.",
      time: "5 daq",
      theoryNote: "ν(Cu-N) = 450 cm⁻¹, ν(Cu-O) = 420 cm⁻¹ — metall-ligand bog'lari."
    },
  ],

  // Laboratoriya natijalari
  labResults: [
    {
      id: "LAB-001",
      technique: "KBr tabletka",
      condition: "Sof [Cu(salen)], KBr tabletka",
      freq_CN: "1620",
      freq_CO: "1310",
      freq_CuN: "450",
      freq_CuO: "420",
      quality: "A'lo",
      notes: "Sof [Cu(salen)] — ν(C=N) = 1620, ν(C-O) = 1310, ν(Cu-N) = 450, ν(Cu-O) = 420 cm⁻¹ cho'qqilari aniq. Bu Schiff asos kompleksi belgisi.",
      theoryNote: "Schiff asos kompleksi belgisi. ν(C=N) ≈ 1620 cm⁻¹ (imin), ν(C-O) ≈ 1310 cm⁻¹ (fenolat)."
    },
    {
      id: "LAB-002",
      technique: "DMF eritmasi (UV-Vis)",
      condition: "DMF da 10⁻⁴ M",
      freq_CN: "—",
      freq_CO: "—",
      freq_CuN: "—",
      freq_CuO: "—",
      quality: "UV-Vis farqlash",
      notes: "UV-Vis: λmax = 600 nm (d-d o'tish). Bu [Cu(salen)] belgisi.",
      theoryNote: "UV-Vis λmax = 600 nm — d-d o'tish."
    },
    {
      id: "LAB-003",
      technique: "ATR",
      condition: "To'g'ridan-to'g'ri qattiq",
      freq_CN: "1618",
      freq_CO: "1308",
      freq_CuN: "448",
      freq_CuO: "418",
      quality: "A'lo",
      notes: "ATR usuli — cho'qqilar biroz siljigan. C=N 1618 cm⁻¹, C-O 1308 cm⁻¹ da aniq.",
      theoryNote: "ATR usuli — cho'qqilar biroz siljiydi."
    },
    {
      id: "LAB-004",
      technique: "Konduktometriya",
      condition: "DMF da, 10⁻³ M",
      freq_CN: "—",
      freq_CO: "—",
      freq_CuN: "—",
      freq_CuO: "—",
      quality: "Noelektrolit",
      notes: "⚠️ Λm ≈ 0 S·cm²/mol. Noelektrolit — neytral kompleks.",
      theoryNote: "[Cu(salen)] neytral kompleks — noelektrolit. Λm ≈ 0 S·cm²/mol."
    },
    {
      id: "LAB-005",
      technique: "XRD",
      condition: "Kristall namuna",
      freq_CN: "—",
      freq_CO: "—",
      freq_CuN: "—",
      freq_CuO: "—",
      quality: "Strukturaviy tasdiq",
      notes: "XRD — kvadrat-tekis geometriya tasdiqlandi. Cu-N ≈ 2.0 Å, Cu-O ≈ 1.95 Å.",
      theoryNote: "XRD — kvadrat-tekis geometriya (D₂ₕ yoki C₂ᵥ)."
    },
  ],
}

export default function CuSalenPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(1620)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [activeLabStep, setActiveLabStep] = useState(0)

  const [calcDq, setCalcDq] = useState(15000)
  const [calcP, setCalcP] = useState(21000)
  const [calcUnpairedElectrons, setCalcUnpairedElectrons] = useState(1)

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
    // Cu²⁺ kvadrat-tekis d⁹: CFSE = -2.4Δₒ + P (kvadrat-tekis d⁹)
    const cfse = -2.4 * calcDq + calcP
    return {
      cfse: cfse.toFixed(0),
      cfseKJ: (cfse * 0.01196).toFixed(2),
      formula: "CFSE = -2.4×Δₒ + P (kvadrat-tekis d⁹)"
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
          <div className="bg-gradient-to-br from-green-950 to-purple-950 border-2 border-green-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚗️</span> [Cu(salen)] — MIS(II) SALEN KOMPLEKSI (YASHIL)!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-green-300">[Cu(salen)]</strong> — mis(II) salen kompleksi, Schiff asos kompleksi.
              Cu²⁺ (d⁹, kvadrat-tekis), paramagnit, tetradentat ligand!
            </p>

            <div className="bg-green-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-green-400 font-bold mb-2">📊 Asosiy cho'qqilar:</div>
                  <div className="text-purple-200">
                    <strong>ν(C=N):</strong> 1620 cm⁻¹ (Schiff asos)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(C-O):</strong> 1310 cm⁻¹ (fenolat)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Cu-N):</strong> 450 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Cu-O):</strong> 420 cm⁻¹
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">🔬 Xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Cu²⁺ (d⁹, kvadrat-tekis)</strong>
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Paramagnit</strong> (1 toq elektron)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Tetradentat ligand</strong> (2N + 2O)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-green-300">Schiff asos:</strong> salitsilaldegid + etilendiamin → Schiff asos (C=N imin).
                Tetradentat ligand — 2N (imin) + 2O (fenolat) = tetradentat.
              </p>
            </div>

            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-green-200">
                <strong className="text-green-300">⚠️ XAVFSIZLIK:</strong> salen ligand toksik! Cu²⁺ zaharli. Qo'lqop, ko'zoynak kerak!
              </p>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-green-400 font-semibold">[Cu(salen)]</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-green-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🔍 IQ</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Schiff asos</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Tetradentat</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Kvadrat-tekis</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Paramagnit</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-xs bg-green-600/80 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Barcha birikmalar
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-green-600 hover:bg-green-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Schiff asos</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Kvadrat-tekis</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Paramagnit</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Tetradentat</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              [Cu(salen)]
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            mis(II) salen kompleksi — <span className="text-green-400 italic">&quot;Schiff asos kompleksi, tetradentat ligand, kvadrat-tekis, paramagnit&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-green-400">IQ spektri</strong> KBr tabletka yoki DMF eritmasida olingan. Eng muhim diagnostik signallar:
            <strong className="text-green-400"> ν(C=N) 1620 cm⁻¹</strong> — Schiff asos imin cho'zilish;
            <strong className="text-green-400"> ν(C-O) 1310 cm⁻¹</strong> — fenolat cho'zilish;
            <strong className="text-green-400"> ν(Cu-N) 450 cm⁻¹</strong> — Cu-N bog';
            <strong className="text-green-400"> ν(Cu-O) 420 cm⁻¹</strong> — Cu-O bog'.
            Bu kompleks Schiff asos kompleksi — tetradentat ligand (2N + 2O).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Cu²⁺ (d⁹)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Kvadrat-tekis</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Magnit</div>
              <div className="text-white font-bold">Paramagnit (1e)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit</div>
              <div className="text-white font-bold">Noelektrolit</div>
            </div>
          </div>
        </div>

        {/* SCHIFF ASOS MA'LUMOTLARI */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔗 Schiff asos kompleksi — tetradentat ligand</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">salen ligand</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Nomi:</span>
                  <span className="text-green-400">N,N'-bis(salitsiliden)etilendiamin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Formula:</span>
                  <span className="text-green-400">C₁₆H₁₆N₂O₂²⁻</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Turi:</span>
                  <span className="text-green-400">Tetradentat Schiff asos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Koordinatsiya:</span>
                  <span className="text-green-400">2N (imin) + 2O (fenolat)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Sintez:</span>
                  <span className="text-green-400">Salitsilaldegid + etilendiamin</span>
                </div>
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog' ma'lumotlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Cu-N bog':</span>
                  <span className="text-green-400">~2.0 Å (Schiff asos)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Cu-O bog':</span>
                  <span className="text-green-400">~1.95 Å (fenolat)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">C=N bog':</span>
                  <span className="text-green-400">1.28 Å (imin)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">C-O bog':</span>
                  <span className="text-green-400">1.30 Å (fenolat)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Geometriya:</span>
                  <span className="text-green-400">Kvadrat-tekis (D₂ₕ)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-300 text-sm">
              <strong>Schiff asos:</strong> salitsilaldegid + etilendiamin → Schiff asos (C=N imin).
              Tetradentat ligand — 2N (imin) + 2O (fenolat) = tetradentat.
              <br/><strong>ν(C=N) cho'qqisi:</strong> Erkin salen da ν(C=N) ≈ 1640 cm⁻¹, kompleksda 1620 cm⁻¹ — bog'lanish tufayli biroz past.
              <br/><strong>ν(C-O) cho'qqisi:</strong> Erkin salitsilaldegid da ν(C-O) ≈ 1280 cm⁻¹, kompleksda 1310 cm⁻¹ — fenolat bog'lanishi tufayli yuqori.
              <br/><strong>ν(Cu-N) va ν(Cu-O):</strong> 450 va 420 cm⁻¹ — metall-ligand bog'lari.
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
                  const isImportant = p.freq === 1620 || p.freq === 1310 || p.freq === 450 || p.freq === 420
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isImportant ? 'bg-green-900/20' : ''}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isImportant ? 'text-green-400' : 'text-green-400'}`}>
                        {p.freq}
                        {isImportant && <span className="ml-1 text-[10px] text-green-400">⭐</span>}
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

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
            <p className="text-green-300 text-sm">
              <strong>⭐⭐ MUHIM:</strong> ν(C=N) = 1620 cm⁻¹ — bu [Cu(salen)] ning ASOSIY BELGISI!
              Schiff asos imin cho'zilish. Erkin salen da ν(C=N) ≈ 1640 cm⁻¹, kompleksda 1620 cm⁻¹ — bog'lanish tufayli past.
              ν(C-O) = 1310 cm⁻¹ — fenolat cho'zilish. Erkin salitsilaldegid da ν(C-O) ≈ 1280 cm⁻¹, kompleksda 1310 cm⁻¹ — fenolat bog'lanishi tufayli yuqori.
              ν(Cu-N) = 450 cm⁻¹, ν(Cu-O) = 420 cm⁻¹ — metall-ligand bog'lari.
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
            <label className="block text-green-400 font-bold mb-2">
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
              <span>200 cm⁻¹ (Cu-O)</span>
              <span>2000 cm⁻¹</span>
              <span>4000 cm⁻¹ (O-H)</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="text-xs text-purple-400">To'lqin soni:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentPeak.freq} cm⁻¹</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Belgilanish:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentPeak.assignment}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Intensivlik:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentPeak.intensity}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Simmetriya:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentPeak.symmetry}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Kuch konstanta:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentPeak.forceConstant || '—'}</div>
              </div>
            </div>
            <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
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
              <title>IQ spektr grafigi — [Cu(salen)]</title>
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
                stroke="#22c55e"
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
                const isImportant = peak.freq === 1620 || peak.freq === 1310 || peak.freq === 450 || peak.freq === 420
                return (
                  <g key={i} onClick={() => setActivePeak(i)} className="cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 10 : 6}
                      fill={isActive ? "#fbbf24" : isImportant ? "#f472b6" : "#22c55e"}
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
                activeLabStep === i ? "bg-green-900/40 border-2 border-green-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-green-500/50"
              }`}
              onClick={() => setActiveLabStep(i)}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeLabStep === i ? "bg-green-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-green-400 font-bold">{step.title}</p>
                  </div>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mt-2">
                      <div className="text-green-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
                      <p className="text-purple-200 text-xs">{step.theoryNote}</p>
                    </div>
                    <div className="text-[10px] text-green-400 mt-2">
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
                  <th className="py-3 px-4 text-purple-300">ν(C=N)</th>
                  <th className="py-3 px-4 text-purple-300">ν(C-O)</th>
                  <th className="py-3 px-4 text-purple-300">Sifat</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.labResults.map((result) => (
                  <tr
                    key={result.id}
                    onClick={() => setActiveLabResult(result.id)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeLabResult === result.id ? 'bg-green-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-cyan-400">{result.id}</td>
                    <td className="py-3 px-4 font-bold">{result.technique}</td>
                    <td className="py-3 px-4 text-xs">{result.condition}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_CN}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_CO}</td>
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

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan natija izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {COMPOUND.labResults.find(r => r.id === activeLabResult)?.notes}
            </p>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mt-3">
              <div className="text-green-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
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
                      activeInterference === i ? 'bg-green-900/20' : ''
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

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning yechimi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {COMPOUND.interferences[activeInterference].solution}
            </p>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mt-3">
              <div className="text-green-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
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
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-green-400 font-bold mb-3">{COMPOUND.techniques[activeTechnique].name}</h3>
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
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-green-400">Schiff asos kompleksi:</strong> Tetradentat ligand (2N + 2O)</li>
            <li><strong className="text-green-400">IR belgisi:</strong> ν(C=N) = 1620 cm⁻¹ (Schiff asos), ν(C-O) = 1310 cm⁻¹ (fenolat)</li>
            <li><strong className="text-green-400">Metall-ligand bog'lari:</strong> ν(Cu-N) = 450 cm⁻¹, ν(Cu-O) = 420 cm⁻¹</li>
            <li><strong className="text-green-400">Kvadrat-tekis:</strong> Cu²⁺ (d⁹), paramagnit (1 toq elektron)</li>
            <li><strong className="text-green-400">Noelektrolit:</strong> Neytral kompleks, Λm ≈ 0 S·cm²/mol</li>
            <li><strong className="text-green-400">UV-Vis λmax = 600 nm:</strong> d-d o'tish</li>
            <li><strong className="text-green-400">⚠️ XAVFSIZLIK:</strong> salen ligand toksik! Cu²⁺ zaharli.</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/iq" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            IQ spektroskopiya →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Cu(salen)] (Mis(II) salen kompleksi) • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Nakamoto, Lever (1984), Calvin (1952), Sacconi (1968)</p>
        </div>
      </footer>
    </main>
  )
}