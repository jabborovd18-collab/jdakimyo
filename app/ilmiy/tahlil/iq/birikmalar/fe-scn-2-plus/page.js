"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Fe(SCN)]²⁺ — TIOTSİANATOTEMIR(III) IQ SPEKTROSKOPIYA (PREMIUM)
// Manbalar: Nakamoto, Lever, Lever (1984), Griffith (1966)
// Xususiyat: Fe³⁺ (d⁵, yuqori spin), paramagnit, ambidentat SCN⁻, N-bonded
// O'ziga xoslik: Linkage izomerizm, qizil rang (LMCT), Fe³⁺ aniqlash
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Fe(SCN)]<sup>2+</sup>",
  formulaPlain: "[Fe(SCN)]2+",
  iupac: "Tiotsianatotemir(III) (N-bonded, izotiosianato)",
  formulaExpanded: "FeSCN",
  commonName: "Temir(III) tiotsianat (qizil, qon qizil)",
  molarMass: 112.92,
  casNumber: "24479-37-8",
  color: "qizil (blood red, qon qizil)",
  structure: "Oktaedr (C₄ᵥ yoki past simmetriya)",
  metalLigand: "Fe-N (N-bonded SCN⁻), C≡N, C-S",
  spaceGroup: "—",
  crystalSystem: "—",
  pointGroup: "C₄ᵥ (suvli eritmada)",
  electrolyteType: "Elektrolit (ionli)",
  molarConductivity: "—",

  // Elektron hisobi
  electronCount: {
    Fe3: "Fe³⁺ (d⁵) = 5 elektron",
    SCN_ligand: "SCN⁻ (2 elektron) = 2 elektron",
    total: "5 + 2 = 7 elektron (18 emas!)",
    rule: "18 elektron qoidasi bajarilmaydi (past koordinatsion son)",
    spinState: "Yuqori spin (t₂g³ e_g²) — paramagnit (5 toq elektron, μ ≈ 5.9 BM)"
  },

  // Bog' ma'lumotlari
  bondInfo: {
    Fe_N: "Fe-N bog' uzunligi: ~2.1 Å (N-bonded)",
    CN: "C≡N bog' uzunligi: 1.16 Å (uch bog'li)",
    CS: "C-S bog' uzunligi: 1.65 Å (bir bog'li)",
    bonding: "SCN⁻ ambidentat ligand — N yoki S orqali bog'lanishi mumkin",
    N_bonded: "N-bonded (izotiosianato) — Fe-N bog', ν(C≡N) ≈ 2050-2100 cm⁻¹, ν(C-S) ≈ 780-800 cm⁻¹",
    S_bonded: "S-bonded (tiosianato) — Fe-S bog', ν(C≡N) ≈ 2100-2120 cm⁻¹, ν(C-S) ≈ 700-720 cm⁻¹"
  },

  // Linkage izomerizm
  linkageInfo: {
    N_bonded: {
      name: "N-bonded (izotiosianato)",
      color: "Qizil (blood red)",
      bond: "Fe-N",
      CN_stretch: "2050-2100 cm⁻¹",
      CS_stretch: "780-800 cm⁻¹",
      stability: "Fe³⁺ bilan barqaror (qattiq kislota)"
    },
    S_bonded: {
      name: "S-bonded (tiosianato)",
      color: "Sariq yoki rangsiz",
      bond: "Fe-S",
      CN_stretch: "2100-2120 cm⁻¹",
      CS_stretch: "700-720 cm⁻¹",
      stability: "Yumshoq metallar bilan barqaror (Pd²⁺, Pt²⁺)"
    },
    HSAB: "Fe³⁺ qattiq kislota — N-bonded afzal. Pd²⁺, Pt²⁺ yumshoq kislota — S-bonded afzal."
  },

  // IQ cho'qqilari — NAZARIY IZOHLAR BILAN
  irPeaks: [
    {
      freq: 2100, T: 8, absorbance: 0.92,
      assignment: "ν(C≡N)",
      assignment_uz: "C≡N cho'zilish (N-bonded)",
      intensity: "Juda kuchli",
      bond: "C≡N",
      symmetry: "C₄ᵥ",
      forceConstant: "17.0 mdyn/Å",
      theoryNote: "⭐⭐ ASOSIY BELGI! C≡N cho'zilish (N-bonded SCN⁻). Erkin SCN⁻ (2050 cm⁻¹) dan biroz yuqori — N-bonding tufayli C≡N bog' biroz kuchliroq. S-bonded da ν(C≡N) ≈ 2100-2120 cm⁻¹."
    },
    {
      freq: 790, T: 40, absorbance: 0.65,
      assignment: "ν(C-S)",
      assignment_uz: "C-S cho'zilish (N-bonded)",
      intensity: "Kuchli",
      bond: "C-S",
      symmetry: "C₄ᵥ",
      forceConstant: "4.5 mdyn/Å",
      theoryNote: "⭐ C-S bog'ining cho'zilishi (N-bonded). Erkin SCN⁻ da ν(C-S) ≈ 750 cm⁻¹. S-bonded da ν(C-S) ≈ 700-720 cm⁻¹ — pastroq."
    },
    {
      freq: 420, T: 50, absorbance: 0.58,
      assignment: "ν(Fe-N)",
      assignment_uz: "Fe-N cho'zilish (N-bonded)",
      intensity: "O'rta",
      bond: "Fe-N",
      symmetry: "C₄ᵥ",
      forceConstant: "1.5 mdyn/Å",
      theoryNote: "⭐ Fe-N bog'ining cho'zilishi (N-bonded). Fe-N bog' uzunligi ~2.1 Å."
    },
    {
      freq: 350, T: 55, absorbance: 0.48,
      assignment: "δ(Fe-N-C)",
      assignment_uz: "Fe-N-C egilish",
      intensity: "O'rta-zaif",
      bond: "Fe-N-C",
      symmetry: "C₄ᵥ",
      forceConstant: "0.4 mdyn/Å",
      theoryNote: "Fe-N-C burchakning deformatsiyasi."
    },
    {
      freq: 480, T: 52, absorbance: 0.52,
      assignment: "δ(N-C-S)",
      assignment_uz: "N-C-S egilish",
      intensity: "O'rta",
      bond: "N-C-S",
      symmetry: "C₄ᵥ",
      forceConstant: "0.5 mdyn/Å",
      theoryNote: "N-C-S burchakning deformatsiyasi. SCN⁻ ligandining egilishi."
    },
    {
      freq: 1620, T: 60, absorbance: 0.38,
      assignment: "δ(H-O-H)",
      assignment_uz: "H-O-H egilish (suv)",
      intensity: "O'rta-zaif",
      bond: "H-O-H",
      symmetry: "—",
      theoryNote: "Suvli eritmada suv molekulalari cho'qqisi."
    },
    {
      freq: 3400, T: 15, absorbance: 0.75,
      assignment: "ν(O-H)",
      assignment_uz: "O-H cho'zilish (suv)",
      intensity: "Juda kuchli",
      bond: "O-H",
      symmetry: "—",
      theoryNote: "Suvli eritmada suv molekulalari cho'qqisi."
    },
  ],

  // To'liq spektr
  irSpectrum: [
    { freq: 4000, absorbance: 0.10 }, { freq: 3400, absorbance: 0.75 },
    { freq: 2500, absorbance: 0.05 }, { freq: 2100, absorbance: 0.92 },
    { freq: 1620, absorbance: 0.38 }, { freq: 1000, absorbance: 0.08 },
    { freq: 790, absorbance: 0.65 }, { freq: 480, absorbance: 0.52 },
    { freq: 420, absorbance: 0.58 }, { freq: 350, absorbance: 0.48 },
    { freq: 200, absorbance: 0.02 },
  ],

  // Turli erituvchilarda
  solventData: [
    {
      solvent: "Suv (H₂O)", dielectric: 78.5, lm: "—", kappa: "—", color: "qizil",
      note: "Suvda yaxshi eriydi — qizil rang (LMCT). Fe³⁺ aniqlash uchun klassik test.",
      theoryNote: "Suv qutbli erituvchi — [Fe(SCN)]²⁺ to'liq dissotsiatsiyalanadi. Qizil rang — LMCT (ligand-to-metal charge transfer) o'tish."
    },
    {
      solvent: "Metanol (CH₃OH)", dielectric: 32.7, lm: "—", kappa: "—", color: "qizil",
      note: "Metanol da eriydi — qizil rang.",
      theoryNote: "Metanol qutbli erituvchi."
    },
    {
      solvent: "Aseton", dielectric: 20.7, lm: "—", kappa: "—", color: "qizil",
      note: "Aseton da eriydi.",
      theoryNote: "Aseton kam qutbli, lekin [Fe(SCN)]²⁺ eriydi."
    },
  ],

  // Halaqit beruvchi omillar
  interferences: [
    {
      source: "Suv (H₂O)", freqRange: "3400, 1620 cm⁻¹",
      effect: "Keng suv cho'qqilari — O-H va H-O-H cho'qqilari",
      severity: "Yuqori",
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
      source: "S-bonded izomer", freqRange: "2100-2120, 700-720 cm⁻¹",
      effect: "S-bonded izomer cho'qqilari aralashishi mumkin",
      severity: "O'rta",
      solution: "S-bonded izomer yo'qligini tekshirish.",
      theoryNote: "S-bonded da ν(C≡N) ≈ 2100-2120, ν(C-S) ≈ 700-720 cm⁻¹."
    },
  ],

  // Texnikalar
  techniques: [
    {
      name: "KBr tabletka",
      description: "KBr bilan tabletka tayyorlash",
      advantages: ["Eng aniq usul", "C≡N cho'qqilari aniq", "Kvantitativ tahlil"],
      disadvantages: ["Namuna tayyorlash kerak", "KBr nam bo'lsa, suv cho'qqilari aralashadi"],
      bestFor: "Aniq kvantitativ tahlil",
      freqRange: "4000-400 cm⁻¹",
      resolution: "2 cm⁻¹",
      samplePrep: "10-15 daq"
    },
    {
      name: "Suvli eritma (UV-Vis)",
      description: "Suvli eritma — UV-Vis spektroskopiya",
      advantages: ["Suvda yaxshi eriydi", "UV-Vis λmax = 447 nm (LMCT)", "Tez o'lchash"],
      disadvantages: ["Faqat suvda", "Faqat qizil rang"],
      bestFor: "UV-Vis, kvantitativ",
      freqRange: "200-800 nm",
      resolution: "1 nm",
      samplePrep: "5-10 daq"
    },
    {
      name: "ATR",
      description: "To'g'ridan-to'g'ri qattiq namuna",
      advantages: ["Tez o'lchash", "Namuna tayyorlash shart emas"],
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
      desc: "Qo'lqop, ko'zoynak. SCN⁻ toksik. Fe³⁺ yo'qligini tekshirish.",
      time: "15 daq",
      theoryNote: "SCN⁻ toksik. [Fe(SCN)]²⁺ qizil rang — LMCT o'tish."
    },
    {
      step: 2,
      title: "Sof [Fe(SCN)]²⁺ ni tayyorlash",
      desc: "Fe³⁺ eritmasiga SCN⁻ qo'shish. Qizil rang hosil bo'ladi.",
      time: "5-10 daq",
      theoryNote: "Fe³⁺ + SCN⁻ → [Fe(SCN)]²⁺ (qizil rang)."
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
      title: "C≡N cho'qqisini tekshirish",
      desc: "ν(C≡N) 2100 cm⁻¹ cho'qqisini tekshirish.",
      time: "5 daq",
      theoryNote: "ν(C≡N) = 2100 cm⁻¹ — [Fe(SCN)]²⁺ belgisi."
    },
  ],

  // Laboratoriya natijalari
  labResults: [
    {
      id: "LAB-001",
      technique: "KBr tabletka",
      condition: "Sof [Fe(SCN)]²⁺, KBr tabletka",
      freq_CN: "2100",
      freq_FeN: "420, 480, 350",
      quality: "A'lo",
      notes: "Sof [Fe(SCN)]²⁺ — ν(C≡N) = 2100 cm⁻¹ cho'qqisi aniq. ν(C-S) = 790 cm⁻¹. Bu N-bonded belgisi.",
      theoryNote: "N-bonded SCN⁻ belgisi. ν(C≡N) ≈ 2050-2100 cm⁻¹ (N-bonded)."
    },
    {
      id: "LAB-002",
      technique: "Suvli eritma (UV-Vis)",
      condition: "Suvda 10⁻⁴ M",
      freq_CN: "—",
      freq_FeN: "—",
      quality: "UV-Vis farqlash",
      notes: "UV-Vis: λmax = 447 nm (LMCT o'tish). Bu [Fe(SCN)]²⁺ belgisi.",
      theoryNote: "UV-Vis λmax = 447 nm — LMCT o'tish."
    },
    {
      id: "LAB-003",
      technique: "ATR",
      condition: "To'g'ridan-to'g'ri qattiq",
      freq_CN: "2098",
      freq_FeN: "418, 478",
      quality: "A'lo",
      notes: "ATR usuli — cho'qqilar biroz siljigan. C≡N cho'qqisi 2098 cm⁻¹ da aniq.",
      theoryNote: "ATR usuli — cho'qqilar biroz siljiydi."
    },
  ],
}

export default function FeSCN2Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(2100)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [activeLabStep, setActiveLabStep] = useState(0)

  const [calcDq, setCalcDq] = useState(14000)
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
    // Fe³⁺ yuqori spin: t₂g³ e_g², CFSE = -0.4Δₒ × 3 + 0.6Δₒ × 2 = -1.2Δₒ + 1.2Δₒ = 0
    const cfse = 0 // Yuqori spin d⁵ da CFSE = 0
    return {
      cfse: cfse.toFixed(0),
      cfseKJ: (cfse * 0.01196).toFixed(2),
      formula: "CFSE = 0 (yuqori spin d⁵)"
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
              <span className="text-3xl">⚗️</span> [Fe(SCN)]²⁺ — TEMIR(III) TIOTSİANAT (QIZIL RANG)!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-red-300">[Fe(SCN)]²⁺</strong> — temir(III) tiotsianat, qizil rang (qon qizil).
              Fe³⁺ (d⁵, yuqori spin), paramagnit, N-bonded SCN⁻, Fe³⁺ aniqlash!
            </p>

            <div className="bg-red-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">📊 Asosiy cho'qqilar:</div>
                  <div className="text-purple-200">
                    <strong>ν(C≡N):</strong> 2100 cm⁻¹ (N-bonded)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(C-S):</strong> 790 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>UV-Vis λmax:</strong> 447 nm (LMCT)
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
                    <strong>Qizil rang</strong> (LMCT)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">Linkage izomerizm:</strong> SCN⁻ ambidentat ligand — N yoki S orqali bog'lanishi mumkin.
                Fe³⁺ qattiq kislota — N-bonded afzal. Pd²⁺, Pt²⁺ yumshoq kislota — S-bonded afzal.
              </p>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-200">
                <strong className="text-red-300">⚠️ XAVFSIZLIK:</strong> SCN⁻ toksik! Fe³⁺ bilan qizil rang hosil bo'ladi — Fe³⁺ aniqlash testi.
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
              <span className="text-red-400 font-semibold">[Fe(SCN)]²⁺</span>
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
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">N-bonded</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Paramagnit</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Qizil rang</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Fe³⁺ aniqlash</span>
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
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">N-bonded</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">d⁵ yuqori spin</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Paramagnit</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Fe³⁺ aniqlash</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              [Fe(SCN)]²⁺
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            temir(III) tiotsianat — <span className="text-red-400 italic">&quot;Qizil rang (qon qizil), N-bonded, Fe³⁺ aniqlash, LMCT o'tish&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-red-400">IQ spektri</strong> KBr tabletka yoki suvli eritmada olingan. Eng muhim diagnostik signallar:
            <strong className="text-red-400"> ν(C≡N) 2100 cm⁻¹</strong> — C≡N cho'zilish (N-bonded);
            <strong className="text-red-400"> ν(C-S) 790 cm⁻¹</strong> — C-S bog';
            <strong className="text-red-400"> UV-Vis λmax = 447 nm</strong> — LMCT o'tish (qizil rang).
            Bu kompleks Fe³⁺ ni aniqlashning klassik testi.
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
              <div className="text-purple-400 text-xs mb-1">Rang</div>
              <div className="text-white font-bold">Qizil (LMCT)</div>
            </div>
          </div>
        </div>

        {/* LINKAGE IZOMERIZM */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔗 Linkage izomerizm — SCN⁻ ambidentat ligand</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">N-bonded (izotiosianato)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog'lanish:</span>
                  <span className="text-red-400">Fe-N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-red-400">Qizil (blood red)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(C≡N):</span>
                  <span className="text-red-400">2050-2100 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(C-S):</span>
                  <span className="text-red-400">780-800 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-red-400">Fe³⁺ bilan barqaror (qattiq kislota)</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">S-bonded (tiosianato)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog'lanish:</span>
                  <span className="text-yellow-400">Fe-S</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-yellow-400">Sariq yoki rangsiz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(C≡N):</span>
                  <span className="text-yellow-400">2100-2120 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(C-S):</span>
                  <span className="text-yellow-400">700-720 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-yellow-400">Yumshoq metallar bilan (Pd²⁺, Pt²⁺)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-300 text-sm">
              <strong>HSAB nazariyasi:</strong> Fe³⁺ qattiq kislota — N-bonded afzal (qattiq asos).
              Pd²⁺, Pt²⁺ yumshoq kislota — S-bonded afzal (yumshoq asos).
              <br/><strong>ν(C≡N) farqi:</strong> N-bonded da 2050-2100 cm⁻¹, S-bonded da 2100-2120 cm⁻¹.
              <br/><strong>ν(C-S) farqi:</strong> N-bonded da 780-800 cm⁻¹, S-bonded da 700-720 cm⁻¹.
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
                  const isImportant = p.freq === 2100 || p.freq === 790 || p.freq === 420
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
                      <td className="py-3 px-4 font-mono text-cyan-400">{p.forceConstant}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
            <p className="text-red-300 text-sm">
              <strong>⭐⭐ MUHIM:</strong> ν(C≡N) = 2100 cm⁻¹ — bu [Fe(SCN)]²⁺ ning ASOSIY BELGISI!
              N-bonded SCN⁻ belgisi. Erkin SCN⁻ (2050 cm⁻¹) dan biroz yuqori — N-bonding tufayli.
              ν(C-S) = 790 cm⁻¹ — N-bonded belgisi. S-bonded da ν(C-S) ≈ 700-720 cm⁻¹.
              ν(Fe-N) = 420 cm⁻¹ — Fe-N bog'ining cho'zilishi.
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
              <span>200 cm⁻¹ (Fe-N)</span>
              <span>2000 cm⁻¹</span>
              <span>4000 cm⁻¹ (C≡N)</span>
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
              <title>IQ spektr grafigi — [Fe(SCN)]²⁺</title>
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
                const isImportant = peak.freq === 2100 || peak.freq === 790 || peak.freq === 420
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
                  <th className="py-3 px-4 text-purple-300">ν(C≡N)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Fe-N)</th>
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
                    <td className="py-3 px-4 font-mono">{result.freq_CN}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_FeN}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'UV-Vis farqlash' ? 'bg-blue-600/30 text-blue-400' :
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
            <li><strong className="text-red-400">Fe³⁺ aniqlash:</strong> SCN⁻ bilan qizil rang (qon qizil) — klassik test</li>
            <li><strong className="text-red-400">Linkage izomerizm:</strong> SCN⁻ ambidentat ligand — N yoki S orqali bog'lanishi mumkin</li>
            <li><strong className="text-red-400">IR belgisi:</strong> ν(C≡N) = 2100 cm⁻¹ (N-bonded), ν(C-S) = 790 cm⁻¹</li>
            <li><strong className="text-red-400">HSAB nazariyasi:</strong> Fe³⁺ qattiq kislota — N-bonded afzal</li>
            <li><strong className="text-red-400">UV-Vis λmax = 447 nm:</strong> LMCT o'tish (qizil rang)</li>
            <li><strong className="text-red-400">Paramagnit:</strong> Fe³⁺ (d⁵, yuqori spin, 5 toq elektron, μ ≈ 5.9 BM)</li>
            <li><strong className="text-red-400">⚠️ XAVFSIZLIK:</strong> SCN⁻ toksik! Fe³⁺ bilan qizil rang hosil bo'ladi.</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold transition-all">
            Birikmalar ro'yxati →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(SCN)]²⁺ (Temir(III) tiotsianat) • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Nakamoto, Lever (1984), Griffith (1966)</p>
        </div>
      </footer>
    </main>
  )
}