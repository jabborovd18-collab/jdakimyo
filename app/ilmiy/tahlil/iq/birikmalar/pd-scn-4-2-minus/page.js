"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Pd(SCN)₄]²⁻ — TETRATIOCIANATOPALLADAT(II) IQ SPEKTROSKOPIYA (PREMIUM)
// Manbalar: Nakamoto, Lever (1984), Griffith (1966)
// Xususiyat: Pd²⁺ (d⁸, kvadrat-tekis), S-bonded (yumshoq kislota), diamagnit
// O'ziga xoslik: S-bonded SCN⁻, ν(C≡N) 2100-2120, ν(C-S) 700-720 cm⁻¹
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Pd(SCN)<sub>4</sub>]<sup>2-</sup>",
  formulaPlain: "[Pd(SCN)4]2-",
  iupac: "Tetratiotsianatopalladat(II) (S-bonded, tiosianato)",
  formulaExpanded: "PdS₄C₄N₄",
  commonName: "Tetratiotsianatopalladat(II) (S-bonded)",
  molarMass: 345.60,
  casNumber: "15021-45-1",
  color: "sariq (yellow)",
  structure: "Kvadrat-tekis (D₄ₕ simmetriya)",
  metalLigand: "Pd-S (S-bonded SCN⁻), C≡N, C-S",
  spaceGroup: "—",
  crystalSystem: "—",
  pointGroup: "D₄ₕ (kvadrat-tekis)",
  electrolyteType: "2:1 elektrolit (3 ion: 2K⁺ + [Pd(SCN)₄]²⁻)",
  molarConductivity: "~270 S·cm²/mol",

  // Elektron hisobi
  electronCount: {
    Pd2: "Pd²⁺ (d⁸) = 8 elektron",
    SCN_ligands: "4 × SCN⁻ (2 elektron har biri) = 8 elektron",
    total: "8 + 8 = 16 elektron (16 elektron qoidasi, kvadrat-tekis)",
    rule: "16 elektron qoidasi bajariladi (kvadrat-tekis d⁸)",
    spinState: "Past spin (d⁸, kvadrat-tekis) — diamagnit (0 toq elektron)"
  },

  // Bog' ma'lumotlari
  bondInfo: {
    Pd_S: "Pd-S bog' uzunligi: ~2.3 Å (S-bonded)",
    CN: "C≡N bog' uzunligi: 1.16 Å (uch bog'li)",
    CS: "C-S bog' uzunligi: 1.70 Å (bir bog'li)",
    bonding: "SCN⁻ ambidentat ligand — N yoki S orqali bog'lanishi mumkin",
    S_bonded: "S-bonded (tiosianato) — Pd-S bog', ν(C≡N) ≈ 2100-2120 cm⁻¹, ν(C-S) ≈ 700-720 cm⁻¹",
    N_bonded: "N-bonded (izotiosianato) — Pd-N bog', ν(C≡N) ≈ 2050-2100 cm⁻¹, ν(C-S) ≈ 780-800 cm⁻¹",
    HSAB: "Pd²⁺ yumshoq kislota — S-bonded afzal (yumshoq asos). Fe³⁺ qattiq kislota — N-bonded afzal."
  },

  // Linkage izomerizm
  linkageInfo: {
    S_bonded: {
      name: "S-bonded (tiosianato)",
      color: "Sariq",
      bond: "Pd-S",
      CN_stretch: "2100-2120 cm⁻¹",
      CS_stretch: "700-720 cm⁻¹",
      stability: "Pd²⁺, Pt²⁺ bilan barqaror (yumshoq kislota)"
    },
    N_bonded: {
      name: "N-bonded (izotiosianato)",
      color: "Sariq yoki rangsiz",
      bond: "Pd-N",
      CN_stretch: "2050-2100 cm⁻¹",
      CS_stretch: "780-800 cm⁻¹",
      stability: "Fe³⁺ qattiq kislota bilan barqaror"
    },
    HSAB: "Pd²⁺, Pt²⁺ yumshoq kislota — S-bonded afzal (yumshoq asos). Fe³⁺ qattiq kislota — N-bonded afzal (qattiq asos)."
  },

  // IQ cho'qqilari — NAZARIY IZOHLAR BILAN
  irPeaks: [
    {
      freq: 2110, T: 8, absorbance: 0.92,
      assignment: "ν(C≡N)",
      assignment_uz: "C≡N cho'zilish (S-bonded)",
      intensity: "Juda kuchli",
      bond: "C≡N",
      symmetry: "Eᵤ (D₄ₕ)",
      forceConstant: "17.2 mdyn/Å",
      theoryNote: "⭐⭐ ASOSIY BELGI! C≡N cho'zilish (S-bonded SCN⁻). Erkin SCN⁻ (2050 cm⁻¹) dan YUQORI — S-bonding tufayli C≡N bog' biroz kuchliroq. N-bonded da ν(C≡N) ≈ 2050-2100 cm⁻¹ — pastroq."
    },
    {
      freq: 710, T: 40, absorbance: 0.65,
      assignment: "ν(C-S)",
      assignment_uz: "C-S cho'zilish (S-bonded)",
      intensity: "Kuchli",
      bond: "C-S",
      symmetry: "Eᵤ (D₄ₕ)",
      forceConstant: "4.2 mdyn/Å",
      theoryNote: "⭐⭐ ASOSIY BELGI! C-S bog'ining cho'zilishi (S-bonded). S-bonded da ν(C-S) ≈ 700-720 cm⁻¹ — PAST. N-bonded da ν(C-S) ≈ 780-800 cm⁻¹ — yuqori. Bu S-bonded ni N-bonded dan farqlashning ASOSIY usuli!"
    },
    {
      freq: 380, T: 50, absorbance: 0.58,
      assignment: "ν(Pd-S)",
      assignment_uz: "Pd-S cho'zilish (S-bonded)",
      intensity: "O'rta",
      bond: "Pd-S",
      symmetry: "Eᵤ (D₄ₕ)",
      forceConstant: "1.3 mdyn/Å",
      theoryNote: "⭐ Pd-S bog'ining cho'zilishi (S-bonded). Pd-S bog' uzunligi ~2.3 Å. N-bonded da Pd-N bog' ~2.0 Å."
    },
    {
      freq: 320, T: 55, absorbance: 0.48,
      assignment: "δ(Pd-S-C)",
      assignment_uz: "Pd-S-C egilish",
      intensity: "O'rta-zaif",
      bond: "Pd-S-C",
      symmetry: "Eᵤ (D₄ₕ)",
      forceConstant: "0.4 mdyn/Å",
      theoryNote: "Pd-S-C burchakning deformatsiyasi."
    },
    {
      freq: 450, T: 52, absorbance: 0.52,
      assignment: "δ(S-C-N)",
      assignment_uz: "S-C-N egilish",
      intensity: "O'rta",
      bond: "S-C-N",
      symmetry: "Eᵤ (D₄ₕ)",
      forceConstant: "0.5 mdyn/Å",
      theoryNote: "S-C-N burchakning deformatsiyasi. SCN⁻ ligandining egilishi."
    },
    {
      freq: 280, T: 60, absorbance: 0.38,
      assignment: "δ(S-Pd-S)",
      assignment_uz: "S-Pd-S egilish (kvadrat-tekis)",
      intensity: "O'rta-zaif",
      bond: "S-Pd-S",
      symmetry: "B₂ᵤ (D₄ₕ)",
      forceConstant: "0.3 mdyn/Å",
      theoryNote: "S-Pd-S burchakning deformatsiyasi (kvadrat-tekis, 90° burchak)."
    },
  ],

  // To'liq spektr
  irSpectrum: [
    { freq: 4000, absorbance: 0.05 }, { freq: 3500, absorbance: 0.08 },
    { freq: 2500, absorbance: 0.05 }, { freq: 2110, absorbance: 0.92 },
    { freq: 1620, absorbance: 0.10 }, { freq: 1000, absorbance: 0.08 },
    { freq: 710, absorbance: 0.65 }, { freq: 450, absorbance: 0.52 },
    { freq: 380, absorbance: 0.58 }, { freq: 320, absorbance: 0.48 },
    { freq: 280, absorbance: 0.38 }, { freq: 200, absorbance: 0.02 },
  ],

  // Turli erituvchilarda
  solventData: [
    {
      solvent: "Suv (H₂O)", dielectric: 78.5, lm: 270, kappa: 0.0270, color: "sariq",
      note: "Suvda yaxshi eriydi — 2:1 elektrolit. Λm ≈ 270 S·cm²/mol (Geary 1971 bo'yicha).",
      theoryNote: "Suv qutbli erituvchi — [Pd(SCN)₄]²⁻ to'liq dissotsiatsiyalanadi. 2:1 elektrolit — 3 ion (2K⁺ + [Pd(SCN)₄]²⁻)."
    },
    {
      solvent: "Metanol (CH₃OH)", dielectric: 32.7, lm: 240, kappa: 0.0240, color: "sariq",
      note: "Metanol da eriydi — lekin suvdan kam.",
      theoryNote: "Metanol qutbli erituvchi."
    },
    {
      solvent: "DMF", dielectric: 36.7, lm: 245, kappa: 0.0245, color: "sariq",
      note: "DMF qutbli — eriydi.",
      theoryNote: "DMF (ε = 36.7) — qutbli organik erituvchi."
    },
    {
      solvent: "Asetonitril", dielectric: 37.5, lm: 250, kappa: 0.0250, color: "sariq",
      note: "Asetonitril qutbli — eriydi.",
      theoryNote: "CH₃CN (ε = 37.5) — qutbli organik erituvchi."
    },
    {
      solvent: "Geptan (C₇H₁₆)", dielectric: 1.9, lm: 0, kappa: 0.0000, color: "erimaydi",
      note: "⚠️ Geptan da ERIMAYDI! [Pd(SCN)₄]²⁻ ionli birikma — nopolar erituvchida erimaydi.",
      theoryNote: "Geptan (ε = 1.9) — nopolar. Ionli birikma erimaydi."
    },
  ],

  // Halaqit beruvchi omillar
  interferences: [
    {
      source: "Suv (H₂O)", freqRange: "3400, 1620 cm⁻¹",
      effect: "Keng suv cho'qqilari — O-H va H-O-H cho'qqilari",
      severity: "O'rta",
      solution: "Suvsiz shakl ishlatish. KBr tabletka uchun KBr ni quritish.",
      theoryNote: "Suv cho'qqilari 3400 va 1620 cm⁻¹ da."
    },
    {
      source: "Erkin SCN⁻", freqRange: "2050 cm⁻¹",
      effect: "Erkin SCN⁻ cho'qqisi 2050 cm⁻¹ da — C≡N sohasiga aralashishi mumkin",
      severity: "O'rta",
      solution: "Toza namuna ishlatish. Erkin SCN⁻ yo'qligini tekshirish.",
      theoryNote: "Erkin SCN⁻ 2050 cm⁻¹ da cho'qqi beradi."
    },
    {
      source: "N-bonded izomer", freqRange: "2050-2100, 780-800 cm⁻¹",
      effect: "N-bonded izomer cho'qqilari aralashishi mumkin",
      severity: "O'rta",
      solution: "N-bonded izomer yo'qligini tekshirish.",
      theoryNote: "N-bonded da ν(C≡N) ≈ 2050-2100, ν(C-S) ≈ 780-800 cm⁻¹."
    },
    {
      source: "Oksidlanish (Pd²⁺ → Pd⁴⁺)", freqRange: "Barcha",
      effect: "Pd²⁺ oksidlanishi mumkin — cho'qqilar o'zgaradi",
      severity: "O'rta",
      solution: "Oksidlanish sharoitidan saqlash. Namuna toza bo'lishi kerak.",
      theoryNote: "Pd²⁺ yumshoq kislota — oksidlanishi mumkin."
    },
  ],

  // Texnikalar
  techniques: [
    {
      name: "KBr tabletka",
      description: "KBr bilan tabletka tayyorlash",
      advantages: ["Eng aniq usul", "C≡N va C-S cho'qqilari aniq", "Kvantitativ tahlil"],
      disadvantages: ["Namuna tayyorlash kerak", "KBr nam bo'lsa, suv cho'qqilari aralashadi"],
      bestFor: "Aniq kvantitativ tahlil",
      freqRange: "4000-400 cm⁻¹",
      resolution: "2 cm⁻¹",
      samplePrep: "10-15 daq"
    },
    {
      name: "Suvli eritma (UV-Vis)",
      description: "Suvli eritma — UV-Vis spektroskopiya",
      advantages: ["Suvda yaxshi eriydi", "UV-Vis λmax = 320 nm (LMCT)", "Tez o'lchash"],
      disadvantages: ["Faqat suvda", "Faqat sariq rang"],
      bestFor: "UV-Vis, kvantitativ",
      freqRange: "200-800 nm",
      resolution: "1 nm",
      samplePrep: "5-10 daq"
    },
    {
      name: "ATR",
      description: "To'g'ridan-to'g'ri qattiq namuna",
      advantages: ["Tez o'lchash", "Namuna tayyorlash shart emas", "C≡N va C-S cho'qqilari aniq"],
      disadvantages: ["Cho'qqilar biroz siljigan"],
      bestFor: "Tez skrining",
      freqRange: "4000-600 cm⁻¹",
      resolution: "2 cm⁻¹",
      samplePrep: "1-2 daq"
    },
  ],

  // Laboratoriya tartibi
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak. SCN⁻ toksik. Pd²⁺ yumshoq kislota.",
      time: "15 daq",
      theoryNote: "SCN⁻ toksik. [Pd(SCN)₄]²⁻ S-bonded — Pd²⁺ yumshoq kislota."
    },
    {
      step: 2,
      title: "Sof K₂[Pd(SCN)₄] ni tayyorlash",
      desc: "Pd²⁺ eritmasiga SCN⁻ qo'shish. Sariq rang hosil bo'ladi.",
      time: "5-10 daq",
      theoryNote: "Pd²⁺ + 4SCN⁻ → [Pd(SCN)₄]²⁻ (sariq rang, S-bonded)."
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
      title: "C≡N va C-S cho'qqilarini tekshirish",
      desc: "ν(C≡N) 2110 cm⁻¹ va ν(C-S) 710 cm⁻¹ cho'qqilarini tekshirish. Bu S-bonded belgisi.",
      time: "5 daq",
      theoryNote: "ν(C≡N) = 2110 cm⁻¹, ν(C-S) = 710 cm⁻¹ — [Pd(SCN)₄]²⁻ S-bonded belgisi."
    },
  ],

  // Laboratoriya natijalari
  labResults: [
    {
      id: "LAB-001",
      technique: "KBr tabletka",
      condition: "Sof K₂[Pd(SCN)₄], KBr tabletka",
      freq_CN: "2110",
      freq_CS: "710",
      quality: "A'lo",
      notes: "Sof K₂[Pd(SCN)₄] — ν(C≡N) = 2110 cm⁻¹, ν(C-S) = 710 cm⁻¹ cho'qqilari aniq. Bu S-bonded belgisi.",
      theoryNote: "S-bonded SCN⁻ belgisi. ν(C≡N) ≈ 2100-2120 cm⁻¹ (S-bonded). ν(C-S) ≈ 700-720 cm⁻¹ — PAST (N-bonded da 780-800)."
    },
    {
      id: "LAB-002",
      technique: "Suvli eritma (UV-Vis)",
      condition: "Suvda 10⁻⁴ M",
      freq_CN: "—",
      freq_CS: "—",
      quality: "UV-Vis farqlash",
      notes: "UV-Vis: λmax = 320 nm (LMCT o'tish). Bu [Pd(SCN)₄]²⁻ belgisi.",
      theoryNote: "UV-Vis λmax = 320 nm — LMCT o'tish."
    },
    {
      id: "LAB-003",
      technique: "ATR",
      condition: "To'g'ridan-to'g'ri qattiq",
      freq_CN: "2108",
      freq_CS: "708",
      quality: "A'lo",
      notes: "ATR usuli — cho'qqilar biroz siljigan. C≡N cho'qqisi 2108 cm⁻¹, C-S 708 cm⁻¹ da aniq.",
      theoryNote: "ATR usuli — cho'qqilar biroz siljiydi."
    },
    {
      id: "LAB-004",
      technique: "Konduktometriya",
      condition: "Suvda, 10⁻³ M",
      freq_CN: "—",
      freq_CS: "—",
      quality: "2:1 elektrolit",
      notes: "⚠️ Λm ≈ 270 S·cm²/mol. 2:1 elektrolit — 3 ion (2K⁺ + [Pd(SCN)₄]²⁻). Bu Geary (1971) bo'yicha.",
      theoryNote: "K₂[Pd(SCN)₄] — 2:1 elektrolit. 2K⁺ + [Pd(SCN)₄]²⁻ = 3 ion. Λm ≈ 270 S·cm²/mol (Geary 1971)."
    },
  ],
}

export default function PdSCN4Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(2110)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [activeLabStep, setActiveLabStep] = useState(0)

  const [calcDq, setCalcDq] = useState(25000)
  const [calcP, setCalcP] = useState(21000)
  const [calcUnpairedElectrons, setCalcUnpairedElectrons] = useState(0)

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
    // Pd²⁺ kvadrat-tekis d⁸: CFSE = -2.4Δₒ (kvadrat-tekis)
    const cfse = -2.4 * calcDq
    return {
      cfse: cfse.toFixed(0),
      cfseKJ: (cfse * 0.01196).toFixed(2),
      formula: "CFSE = -2.4×Δₒ (kvadrat-tekis d⁸)"
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
          <div className="bg-gradient-to-br from-yellow-950 to-purple-950 border-2 border-yellow-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚗️</span> [Pd(SCN)₄]²⁻ — TETRATIOCIANATOPALLADAT(II) (S-BONDED)!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-yellow-300">[Pd(SCN)₄]²⁻</strong> — tetratiotsianatopalladat(II), S-bonded (yumshoq kislota).
              Pd²⁺ (d⁸, kvadrat-tekis), diamagnit, linkage izomerizm!
            </p>

            <div className="bg-yellow-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-yellow-400 font-bold mb-2">📊 Asosiy cho'qqilar (S-BONDED):</div>
                  <div className="text-purple-200">
                    <strong>ν(C≡N):</strong> 2110 cm⁻¹ (S-bonded)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(C-S):</strong> 710 cm⁻¹ (S-bonded, PAST)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Pd-S):</strong> 380 cm⁻¹
                  </div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold mb-2">🔬 Xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Pd²⁺ (d⁸, kvadrat-tekis)</strong>
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Diamagnit</strong> (0 toq elektron)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>S-bonded</strong> (yumshoq kislota)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">Linkage izomerizm:</strong> SCN⁻ ambidentat ligand — N yoki S orqali bog'lanishi mumkin.
                Pd²⁺, Pt²⁺ yumshoq kislota — S-bonded afzal. Fe³⁺ qattiq kislota — N-bonded afzal.
              </p>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-200">
                <strong className="text-yellow-300">S-bonded vs N-bonded:</strong><br/>
                S-bonded: ν(C≡N) 2100-2120 cm⁻¹, ν(C-S) 700-720 cm⁻¹ (PAST)<br/>
                N-bonded: ν(C≡N) 2050-2100 cm⁻¹, ν(C-S) 780-800 cm⁻¹ (YUQORI)
              </p>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-yellow-400 font-semibold">[Pd(SCN)₄]²⁻</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🔍 IQ</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">S-bonded</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Diamagnit</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Kvadrat-tekis</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">2:1 elektrolit</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Barcha birikmalar
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-yellow-600 hover:bg-yellow-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">S-bonded</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">d⁸ kvadrat-tekis</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">2:1 elektrolit</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              [Pd(SCN)₄]²⁻
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            tetratiotsianatopalladat(II) — <span className="text-yellow-400 italic">&quot;S-bonded (yumshoq kislota), kvadrat-tekis, diamagnit, linkage izomerizm&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">IQ spektri</strong> KBr tabletka yoki suvli eritmada olingan. Eng muhim diagnostik signallar:
            <strong className="text-yellow-400"> ν(C≡N) 2110 cm⁻¹</strong> — C≡N cho'zilish (S-bonded);
            <strong className="text-yellow-400"> ν(C-S) 710 cm⁻¹</strong> — C-S bog' (S-bonded, PAST);
            <strong className="text-yellow-400"> ν(Pd-S) 380 cm⁻¹</strong> — Pd-S bog'.
            Bu kompleks S-bonded SCN⁻ ning klassik namunasi (Pd²⁺ yumshoq kislota).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Pd²⁺ (d⁸)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Kvadrat-tekis</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Magnit</div>
              <div className="text-white font-bold">Diamagnit</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit</div>
              <div className="text-white font-bold">2:1 (3 ion)</div>
            </div>
          </div>
        </div>

        {/* LINKAGE IZOMERIZM */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔗 Linkage izomerizm — SCN⁻ ambidentat ligand</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">S-bonded (tiosianato)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog'lanish:</span>
                  <span className="text-yellow-400">Pd-S</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-yellow-400">Sariq</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(C≡N):</span>
                  <span className="text-yellow-400">2100-2120 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(C-S):</span>
                  <span className="text-yellow-400 font-bold">700-720 cm⁻¹ (PAST)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-yellow-400">Pd²⁺, Pt²⁺ bilan (yumshoq kislota)</span>
                </div>
              </div>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">N-bonded (izotiosianato)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog'lanish:</span>
                  <span className="text-red-400">Pd-N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-red-400">Sariq yoki rangsiz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(C≡N):</span>
                  <span className="text-red-400">2050-2100 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(C-S):</span>
                  <span className="text-red-400 font-bold">780-800 cm⁻¹ (YUQORI)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-red-400">Fe³⁺ qattiq kislota bilan</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-300 text-sm">
              <strong>HSAB nazariyasi:</strong> Pd²⁺, Pt²⁺ yumshoq kislota — S-bonded afzal (yumshoq asos).
              Fe³⁺ qattiq kislota — N-bonded afzal (qattiq asos).
              <br/><strong>ν(C≡N) farqi:</strong> S-bonded da 2100-2120 cm⁻¹, N-bonded da 2050-2100 cm⁻¹.
              <br/><strong>ν(C-S) farqi:</strong> S-bonded da 700-720 cm⁻¹ (PAST), N-bonded da 780-800 cm⁻¹ (YUQORI).
              <br/><strong>⭐ ASOSIY FARQ:</strong> ν(C-S) cho'qqisi S-bonded da PAST, N-bonded da YUQORI — bu S-bonded ni N-bonded dan farqlashning ASOSIY usuli!
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
                  const isImportant = p.freq === 2110 || p.freq === 710 || p.freq === 380
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isImportant ? 'bg-yellow-900/20' : ''}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isImportant ? 'text-yellow-400' : 'text-yellow-400'}`}>
                        {p.freq}
                        {isImportant && <span className="ml-1 text-[10px] text-yellow-400">⭐</span>}
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
                      <td className="py-3 px-4 font-mono text-cyan-400">{p.forceConstant}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>⭐⭐ MUHIM:</strong> ν(C≡N) = 2110 cm⁻¹ — bu [Pd(SCN)₄]²⁻ ning ASOSIY BELGISI!
              S-bonded SCN⁻ belgisi. ν(C-S) = 710 cm⁻¹ — S-bonded belgisi (PAST).
              N-bonded da ν(C-S) ≈ 780-800 cm⁻¹ (YUQORI) — bu S-bonded ni N-bonded dan farqlashning ASOSIY usuli!
              ν(Pd-S) = 380 cm⁻¹ — Pd-S bog'ining cho'zilishi.
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
            <label className="block text-yellow-400 font-bold mb-2">
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
              <span>200 cm⁻¹ (Pd-S)</span>
              <span>2000 cm⁻¹</span>
              <span>4000 cm⁻¹ (C≡N)</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="text-xs text-purple-400">To'lqin soni:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentPeak.freq} cm⁻¹</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Belgilanish:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentPeak.assignment}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Intensivlik:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentPeak.intensity}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Simmetriya:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentPeak.symmetry}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Kuch konstanta:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentPeak.forceConstant}</div>
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
              <title>IQ spektr grafigi — [Pd(SCN)₄]²⁻</title>
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
                stroke="#eab308"
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
                const isImportant = peak.freq === 2110 || peak.freq === 710 || peak.freq === 380
                return (
                  <g key={i} onClick={() => setActivePeak(i)} className="cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 10 : 6}
                      fill={isActive ? "#fbbf24" : isImportant ? "#f472b6" : "#eab308"}
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
                activeLabStep === i ? "bg-yellow-900/40 border-2 border-yellow-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-yellow-500/50"
              }`}
              onClick={() => setActiveLabStep(i)}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeLabStep === i ? "bg-yellow-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-400 font-bold">{step.title}</p>
                  </div>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-2">
                      <div className="text-yellow-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
                      <p className="text-purple-200 text-xs">{step.theoryNote}</p>
                    </div>
                    <div className="text-[10px] text-yellow-400 mt-2">
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
                  <th className="py-3 px-4 text-purple-300">ν(C≡N)</th>
                  <th className="py-3 px-4 text-purple-300">ν(C-S)</th>
                  <th className="py-3 px-4 text-purple-300">Sifat</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.labResults.map((result) => (
                  <tr
                    key={result.id}
                    onClick={() => setActiveLabResult(result.id)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeLabResult === result.id ? 'bg-yellow-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-cyan-400">{result.id}</td>
                    <td className="py-3 px-4 font-bold">{result.technique}</td>
                    <td className="py-3 px-4 text-xs">{result.condition}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_CN}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_CS}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'UV-Vis farqlash' ? 'bg-blue-600/30 text-blue-400' :
                        result.quality === '2:1 elektrolit' ? 'bg-blue-600/30 text-blue-400' :
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

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan natija izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {COMPOUND.labResults.find(r => r.id === activeLabResult)?.notes}
            </p>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-3">
              <div className="text-yellow-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
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
                      activeInterference === i ? 'bg-yellow-900/20' : ''
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

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning yechimi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {COMPOUND.interferences[activeInterference].solution}
            </p>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-3">
              <div className="text-yellow-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
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
                    ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">{COMPOUND.techniques[activeTechnique].name}</h3>
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
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Linkage izomerizm:</strong> SCN⁻ ambidentat ligand — N yoki S orqali bog'lanishi mumkin</li>
            <li><strong className="text-yellow-400">HSAB nazariyasi:</strong> Pd²⁺, Pt²⁺ yumshoq kislota — S-bonded afzal</li>
            <li><strong className="text-yellow-400">IR belgisi:</strong> ν(C≡N) = 2110 cm⁻¹ (S-bonded), ν(C-S) = 710 cm⁻¹ (PAST)</li>
            <li><strong className="text-yellow-400">S-bonded vs N-bonded:</strong> ν(C-S) S-bonded da PAST (700-720), N-bonded da YUQORI (780-800)</li>
            <li><strong className="text-yellow-400">Kvadrat-tekis:</strong> Pd²⁺ (d⁸), diamagnit</li>
            <li><strong className="text-yellow-400">2:1 elektrolit:</strong> 3 ion (2K⁺ + [Pd(SCN)₄]²⁻), Λm ≈ 270 S·cm²/mol</li>
            <li><strong className="text-yellow-400">⚠️ XAVFSIZLIK:</strong> SCN⁻ toksik! Pd²⁺ yumshoq kislota.</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            Birikmalar ro'yxati →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Pd(SCN)₄]²⁻ (Tetratiotsianatopalladat(II)) • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Nakamoto, Lever (1984), Griffith (1966)</p>
        </div>
      </footer>
    </main>
  )
}