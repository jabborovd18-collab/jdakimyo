"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Fe(CO)₅] — TEMIR PENTAKARBONIL IQ SPEKTROSKOPIYA (PREMIUM)
// Manbalar: Nakamoto, Lever, Wilkinson, Cotton
// Xususiyat: Temir(0) karbonil, 18 elektron qoidasi, D₃ₕ simmetriya
// O'ziga xoslik: Noelektrolit, diamagnit, trigonal bipiramida, π-back-bonding
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Fe(CO)<sub>5</sub>]",
  formulaPlain: "[Fe(CO)5]",
  iupac: "Pentakarboniltemir(0)",
  formulaExpanded: "FeC₅O₅",
  commonName: "Temir pentakarbonil (Iron pentacarbonyl)",
  molarMass: 195.90,
  casNumber: "13463-40-6",
  color: "sariq suyuqlik (pale yellow liquid)",
  structure: "Trigonal bipiramida (D₃ₕ simmetriya)",
  metalLigand: "Fe-C (karbonil), C≡O",
  spaceGroup: "P6₃/mmc (geksagonal)",
  crystalSystem: "Geksagonal (qattiq holatda)",
  pointGroup: "D₃ₕ (trigonal bipiramida)",
  electrolyteType: "Noelektrolit (neytral molekula)",
  molarConductivity: "~0 S·cm²/mol",

  // 18 elektron qoidasi
  electronCount: {
    Fe0: "d⁸ (8 elektron)",
    CO_ligands: "5 × 2 = 10 elektron",
    total: "8 + 10 = 18 elektron",
    rule: "18 elektron qoidasi bajariladi — barqaror"
  },

  isomerInfo: {
    axialCO: "2 ta aksial CO (uzunroq Fe-C bog')",
    equatorialCO: "3 ta ekvatorial CO (qisqaroq Fe-C bog')",
    fluxional: "Fluksional — aksial va ekvatorial CO tez almashinadi (Berry pseudorotation)"
  },

  // IQ cho'qqilari
  irPeaks: [
    { freq: 2022, T: 15, absorbance: 0.85, assignment: "νₐₛ(C≡O)", assignment_uz: "C≡O asimetrik cho'zilish (ekvatorial)", intensity: "Juda kuchli", bond: "C≡O", symmetry: "E' (D₃ₕ)", forceConstant: "16.5 mdyn/Å", theoryNote: "⭐ MUHIM: C≡O asimetrik cho'zilish (ekvatorial CO). E' mod D₃ₕ simmetriyada IQ faol. Erkin CO (2143 cm⁻¹) dan past — π-back-bonding tufayli." },
    { freq: 2013, T: 18, absorbance: 0.82, assignment: "νₐₛ(C≡O)", assignment_uz: "C≡O asimetrik cho'zilish (aksial)", intensity: "Juda kuchli", bond: "C≡O", symmetry: "A₂'' (D₃ₕ)", forceConstant: "16.2 mdyn/Å", theoryNote: "⭐ MUHIM: C≡O asimetrik cho'zilish (aksial CO). A₂'' mod D₃ₕ simmetriyada IQ faol. Aksial CO bog'lari uzunroq — past chastota." },
    { freq: 1985, T: 25, absorbance: 0.70, assignment: "νₛ(C≡O)", assignment_uz: "C≡O simmetrik cho'zilish (ekvatorial)", intensity: "Kuchli", bond: "C≡O", symmetry: "A₁' (Raman)", forceConstant: "15.8 mdyn/Å", theoryNote: "C≡O simmetrik cho'zilish (ekvatorial CO). A₁' mod faqat Raman faol (alternativa taqiq)." },
    { freq: 540, T: 40, absorbance: 0.62, assignment: "νₐₛ(Fe-C)", assignment_uz: "Fe-C asimetrik cho'zilish (ekvatorial)", intensity: "Kuchli", bond: "Fe-C", symmetry: "E' (D₃ₕ)", forceConstant: "2.1 mdyn/Å", theoryNote: "Fe-C bog'ining asimetrik cho'zilishi (ekvatorial CO). π-back-bonding tufayli kuchli bog'." },
    { freq: 490, T: 45, absorbance: 0.58, assignment: "νₐₛ(Fe-C)", assignment_uz: "Fe-C asimetrik cho'zilish (aksial)", intensity: "Kuchli", bond: "Fe-C", symmetry: "A₂'' (D₃ₕ)", forceConstant: "1.8 mdyn/Å", theoryNote: "Fe-C bog'ining asimetrik cho'zilishi (aksial CO). Aksial bog'lar kuchsizroq." },
    { freq: 450, T: 50, absorbance: 0.52, assignment: "νₛ(Fe-C)", assignment_uz: "Fe-C simmetrik cho'zilish", intensity: "O'rta", bond: "Fe-C", symmetry: "A₁' (Raman)", forceConstant: "1.6 mdyn/Å", theoryNote: "Fe-C simmetrik cho'zilish. A₁' mod faqat Raman faol." },
    { freq: 420, T: 55, absorbance: 0.48, assignment: "δ(Fe-C-O)", assignment_uz: "Fe-C-O egilish (ekvatorial)", intensity: "O'rta", bond: "Fe-C-O", symmetry: "E' (D₃ₕ)", forceConstant: "0.5 mdyn/Å", theoryNote: "Fe-C-O burchakning deformatsiyasi (ekvatorial CO)." },
    { freq: 380, T: 60, absorbance: 0.45, assignment: "δ(Fe-C-O)", assignment_uz: "Fe-C-O egilish (aksial)", intensity: "O'rta-zaif", bond: "Fe-C-O", symmetry: "A₂'' (D₃ₕ)", forceConstant: "0.4 mdyn/Å", theoryNote: "Fe-C-O burchakning deformatsiyasi (aksial CO)." },
    { freq: 350, T: 65, absorbance: 0.40, assignment: "δ(C-Fe-C)", assignment_uz: "C-Fe-C egilish", intensity: "Zaif", bond: "C-Fe-C", symmetry: "E' (D₃ₕ)", forceConstant: "0.3 mdyn/Å", theoryNote: "C-Fe-C burchakning deformatsiyasi." },
  ],

  // To'liq spektr
  irSpectrum: [
    { freq: 4000, absorbance: 0.02 }, { freq: 3500, absorbance: 0.03 },
    { freq: 2500, absorbance: 0.05 }, { freq: 2022, absorbance: 0.85 },
    { freq: 2013, absorbance: 0.82 }, { freq: 1985, absorbance: 0.70 },
    { freq: 1500, absorbance: 0.10 }, { freq: 1000, absorbance: 0.08 },
    { freq: 540, absorbance: 0.62 }, { freq: 490, absorbance: 0.58 },
    { freq: 450, absorbance: 0.52 }, { freq: 420, absorbance: 0.48 },
    { freq: 380, absorbance: 0.45 }, { freq: 350, absorbance: 0.40 },
    { freq: 200, absorbance: 0.02 },
  ],

  // Berry pseudorotation
  berryPseudorotation: {
    mechanism: "Berry pseudorotation — aksial va ekvatorial CO tez almashinadi",
    barrier: "~5-10 kJ/mol (juda past)",
    timescale: "~10⁻¹¹ s (juda tez)",
    detection: "IQ da ko'rinmaydi (juda tez), NMR da ko'rinadi"
  },

  // Turli erituvchilarda
  solventData: [
    { solvent: "Suv (H₂O)", dielectric: 78.5, lm: 0, kappa: 0.0000, color: "sariq", note: "Suvda erimaydi — neytral molekula" },
    { solvent: "Geptan", dielectric: 1.9, lm: 0, kappa: 0.0000, color: "sariq", note: "Nopolar erituvchi — yaxshi eriydi" },
    { solvent: "Toluen", dielectric: 2.4, lm: 0, kappa: 0.0000, color: "sariq", note: "Nopolar aromatik — yaxshi eriydi" },
    { solvent: "DMF", dielectric: 36.7, lm: 0, kappa: 0.0000, color: "sariq", note: "Qutbli organik — yaxshi eriydi" },
    { solvent: "Asetonitril", dielectric: 37.5, lm: 0, kappa: 0.0000, color: "sariq", note: "Qutbli organik — yaxshi eriydi" },
    { solvent: "DMSO", dielectric: 46.7, lm: 0, kappa: 0.0000, color: "sariq", note: "Qutbli organik — yaxshi eriydi" }
  ],

  // Werner qatori taqqoslash
  wernerComparison: [
    { complex: "[Co(NH₃)₆]Cl₃", formula: "[Co(NH₃)₆]³⁺ + 3Cl⁻", ions: 4, lm_range: "400-440", type: "1:3", color: "sariq" },
    { complex: "[Fe(CO)₅]", formula: "[Fe(CO)₅]⁰", ions: 0, lm_range: "0", type: "Noelektrolit", color: "sariq" },
    { complex: "[Ni(CO)₄]", formula: "[Ni(CO)₄]⁰", ions: 0, lm_range: "0", type: "Noelektrolit", color: "rangsiz" },
    { complex: "[Mn₂(CO)₁₀]", formula: "[Mn₂(CO)₁₀]⁰", ions: 0, lm_range: "0", type: "Noelektrolit", color: "sariq" },
    { complex: "[Cr(CO)₆]", formula: "[Cr(CO)₆]⁰", ions: 0, lm_range: "0", type: "Noelektrolit", color: "rangsiz" },
  ],

  // Laboratoriya natijalari
  labResults: [
    { id: "LAB-001", date: "2027-01-15", technique: "Neat liquid (sof suyuqlik)", condition: "Sof [Fe(CO)₅] suyuqlik", freq_CO: "2022, 2013", freq_FeC: "540, 490", resolution: "2 cm⁻¹", notes: "Sof suyuqlik — C≡O cho'qqilari 2022 va 2013 cm⁻¹ da (2 ta cho'qqi). Bu [Fe(CO)₅] belgisi.", quality: "A'lo" },
    { id: "LAB-002", date: "2027-01-15", technique: "Geptan eritmasi", condition: "Geptan da 10⁻³ M", freq_CO: "2020, 2011", freq_FeC: "538, 488", resolution: "2 cm⁻¹", notes: "Geptan da — cho'qqilar biroz siljigan. C≡O cho'qqilari aniq.", quality: "A'lo" },
    { id: "LAB-003", date: "2027-01-16", technique: "ATR (sof suyuqlik)", condition: "To'g'ridan-to'g'ri suyuqlik", freq_CO: "2018, 2009", freq_FeC: "536, 486", resolution: "2 cm⁻¹", notes: "ATR usuli — cho'qqilar biroz siljigan. C≡O cho'qqilari aniq.", quality: "A'lo" },
    { id: "LAB-004", date: "2027-01-16", technique: "Konduktometriya (geptan da)", condition: "10⁻³ M, 25°C", freq_CO: "—", freq_FeC: "—", resolution: "—", notes: "⚠️ MUHIM: Λm ≈ 0 S·cm²/mol. Neytral molekula — noelektrolit.", quality: "Noelektrolit" },
    { id: "LAB-005", date: "2027-01-17", technique: "UV-Vis", condition: "Geptan da, 10⁻⁴ M", freq_CO: "—", freq_FeC: "—", resolution: "1 nm", notes: "UV-Vis: λmax = 340 nm (MLCT o'tish). Bu [Fe(CO)₅] belgisi.", quality: "Farqlash testi" },
    { id: "LAB-006", date: "2027-01-17", technique: "Berry pseudorotation testi", condition: "NMR, -80°C", freq_CO: "—", freq_FeC: "—", resolution: "—", notes: "Berry pseudorotation — aksial va ekvatorial CO tez almashinadi. NMR da ko'rinadi.", quality: "Fluksional test" },
  ],

  // Texnikalar
  techniques: [
    { name: "Neat liquid (sof suyuqlik)", description: "Sof suyuqlikni to'g'ridan-to'g'ri o'lchash", advantages: ["Eng aniq va an'anaviy usul", "C≡O cho'qqilari aniq ko'rinadi", "Erituvchi ta'siri yo'q", "Kvantitativ tahlil uchun qulay"], disadvantages: ["Faqat suyuqlik uchun", "Konsentratsiya nazorati qiyin", "Toksinlik (CO ajralishi mumkin)", "Qorong'i xona kerak"], bestFor: "Aniq kvantitativ tahlil, sof suyuqlik", freqRange: "4000-400 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "5-10 daq" },
    { name: "Eritma (geptan/toluen)", description: "Nopolar erituvchida eritma", advantages: ["Konsentratsiya nazorati", "C≡O cho'qqilari aniq", "Kvantitativ tahlil", "Erituvchi ta'siri kam"], disadvantages: ["Erituvchi cho'qqilari aralashishi mumkin", "Konsentratsiya nazorati kerak", "Erituvchi toza bo'lishi kerak", "CO ajralishi mumkin"], bestFor: "Kvantitativ tahlil, eritma", freqRange: "4000-400 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "10-15 daq" },
    { name: "ATR", description: "To'g'ridan-to'g'ri suyuqlik yoki eritma", advantages: ["Tez o'lchash (1-2 daq)", "Namuna tayyorlash shart emas", "C≡O cho'qqilari aniq", "Namuna buzilmaydi"], disadvantages: ["Cho'qqilar biroz siljigan", "Past chastotali soha zaif", "Kvantitativ tahlil qiyin", "CO ajralishi mumkin"], bestFor: "Tez skrining, tez o'lchash", freqRange: "4000-600 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "1-2 daq" },
    { name: "NMR (Berry pseudorotation)", description: "Berry pseudorotation ni kuzatish", advantages: ["Berry pseudorotation ni ko'rish", "Aksial/ekvatorial CO farqlash", "Kinetik ma'lumotlar", "Strukturaviy tasdiq"], disadvantages: ["Qimmat uskuna", "Past harorat kerak (-80°C)", "Murakkab tahlil", "Faqat fluksional uchun"], bestFor: "Berry pseudorotation, fluksional", freqRange: "—", resolution: "—", samplePrep: "30-60 daq" },
  ],

  // Halaqit beruvchi omillar
  interferences: [
    { source: "CO ajralishi", freqRange: "2143 cm⁻¹", effect: "Erkin CO cho'qqisi — C≡O sohasiga aralashadi", severity: "Yuqori", solution: "Qorong'i xona, past harorat. CO ajralishini kamaytirish.", prevention: "Qorong'i xona, past harorat" },
    { source: "Erituvchi cho'qqilari", freqRange: "Turli", effect: "Erituvchi cho'qqilari aralashishi mumkin", severity: "O'rta", solution: "Nopolar erituvchi ishlatish (geptan, toluen).", prevention: "Nopolar erituvchi ishlatish" },
    { source: "Berry pseudorotation", freqRange: "Barcha", effect: "Aksial/ekvatorial CO tez almashinadi — IQ da ko'rinmaydi", severity: "Past", solution: "NMR da kuzatish (-80°C). IQ da ko'rinmaydi.", prevention: "NMR ishlatish" },
    { source: "Namuna parchalanishi", freqRange: "Barcha", effect: "CO ajralishi — cho'qqilar o'zgaradi", severity: "Yuqori", solution: "Qorong'i xona, past harorat. Tez o'lchash.", prevention: "Qorong'i xona, past harorat" },
    { source: "Namuna tozaligi", freqRange: "Barcha", effect: "Boshqa karbonillar aralashishi mumkin", severity: "O'rta", solution: "Sof [Fe(CO)₅] ishlatish. Distillash.", prevention: "Sof namuna, distillash" },
    { source: "Harorat ta'siri", freqRange: "Barcha", effect: "Harorat oshishi — CO ajralishi tezlashadi", severity: "O'rta", solution: "Past haroratda saqlash (4°C). Tez o'lchash.", prevention: "Past haroratda saqlash" },
  ]
}

export default function FeCO5Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(2000)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [berryTemp, setBerryTemp] = useState(-80)

  const [calcDq, setCalcDq] = useState(23000)
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

  // Berry pseudorotation tezligi
  const berryResult = useMemo(() => {
    const T = berryTemp + 273.15
    const R = 8.314
    const Ea_J = 7500 // ~7.5 kJ/mol
    const A = 1e12
    const k = A * Math.exp(-Ea_J / (R * T))
    const t_half_sec = Math.log(2) / k
    const t_half_ps = t_half_sec * 1e12
    return {
      k: k.toExponential(3),
      t_half_ps: t_half_ps.toFixed(1),
      t_half_ns: (t_half_sec * 1e9).toFixed(2)
    }
  }, [berryTemp])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-yellow-950 to-purple-950 border-2 border-yellow-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚗️</span> [Fe(CO)₅] — TEMIR PENTAKARBONIL (18 ELEKTRON)!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-yellow-300">[Fe(CO)₅]</strong> — temir pentakarbonil, 18 elektron qoidasi bajariladi.
              D₃ₕ simmetriya, trigonal bipiramida, Berry pseudorotation!
            </p>

            <div className="bg-yellow-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-yellow-400 font-bold mb-2">📊 Asosiy cho'qqilar:</div>
                  <div className="text-purple-200">
                    <strong>ν(C≡O):</strong> 2022, 2013 cm⁻¹ (2 ta cho'qqi)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Fe-C):</strong> 540, 490 cm⁻¹
                  </div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold mb-2">🔬 Konduktometriya:</div>
                  <div className="text-purple-200">
                    <strong>Λm ≈ 0 S·cm²/mol</strong>
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Noelektrolit</strong> (neytral molekula)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">18 elektron qoidasi:</strong> Fe⁰ (d⁸) + 5×CO (10 elektron) = 18 elektron. Barqaror!
                Berry pseudorotation — aksial va ekvatorial CO tez almashinadi.
              </p>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">Xavfsizlik:</strong> [Fe(CO)₅] toksik — CO ajralishi mumkin. Qorong'i xona, past harorat, ventilyatsiya kerak!
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
              <span className="text-yellow-400 font-semibold">[Fe(CO)₅]</span>
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
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Noelektrolit</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">18 elektron</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">D₃ₕ simmetriya</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Berry pseudorotation</span>
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
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Trigonal bipiramida</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">d⁸</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">18 elektron</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Berry pseudorotation</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              [Fe(CO)₅]
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            pentakarboniltemir(0) — <span className="text-yellow-400 italic">&quot;Temir pentakarbonil (18 elektron, Berry pseudorotation)&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">IQ spektri</strong> sof suyuqlik yoki nopolar erituvchida 4000−400 cm⁻¹
            oralig'ida olingan. Eng muhim diagnostik signallar:
            <strong className="text-yellow-400"> ν(C≡O) 2022, 2013 cm⁻¹</strong> — 2 ta cho'qqi (aksial va ekvatorial CO);
            <strong className="text-yellow-400"> ν(Fe-C) 540, 490 cm⁻¹</strong> — Fe-C bog'lari.
            Bu kompleks 18 elektron qoidasining klassik namunasi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Fe⁰</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfiguratsiya</div>
              <div className="text-white font-bold">d⁸ (18 elektron)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">D₃ₕ (trigonal bipiramida)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit turi</div>
              <div className="text-white font-bold">Noelektrolit (neytral)</div>
            </div>
          </div>
        </div>

        {/* 18 ELEKTRON QOIDASI */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔢 18 elektron qoidasi — barqarorlik</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Elektron hisobi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Fe⁰ (d⁸):</span>
                  <span className="text-yellow-400">8 elektron</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">5 × CO (2 elektron har biri):</span>
                  <span className="text-yellow-400">10 elektron</span>
                </div>
                <div className="flex justify-between border-t border-yellow-700/50 pt-2">
                  <span className="text-purple-400 font-bold">Jami:</span>
                  <span className="text-yellow-400 font-bold">18 elektron</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Qoida:</span>
                  <span className="text-yellow-400">Bajariladi — barqaror!</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Berry pseudorotation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Mexanizm:</span>
                  <span className="text-orange-400">Berry pseudorotation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">To'siq:</span>
                  <span className="text-orange-400">~5-10 kJ/mol (juda past)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Vaqt shkalasi:</span>
                  <span className="text-orange-400">~10⁻¹¹ s (juda tez)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Aniqlash:</span>
                  <span className="text-orange-400">NMR (-80°C)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Berry pseudorotation:</strong> Aksial va ekvatorial CO ligandlari tez almashinadi (~10⁻¹¹ s).
              IQ da ko'rinmaydi (juda tez), lekin NMR da past haroratda (-80°C) ko'rinadi.
              Bu fluksional molekula — dinamik struktura.
            </p>
          </div>
        </div>

        {/* D₃ₕ SIMMETRIYA VA ALTERNATIVA TAQIQ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 D₃ₕ simmetriya — alternativa taqiq</h2>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">D₃ₕ simmetriya va alternativa taqiq</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-green-400 font-bold">IQ-faol modlar:</span>
                <span className="text-purple-200"> A₂'', E' (aksial va ekvatorial CO)</span>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-blue-400 font-bold">Raman-faol modlar:</span>
                <span className="text-purple-200"> A₁', E' (simmetrik modlar)</span>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-orange-400 font-bold">Alternativa taqiq:</span>
                <span className="text-purple-200"> BOR! (D₃ₕ da inversiya markazi bor)</span>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-yellow-400 font-bold">C≡O cho'qqilari:</span>
                <span className="text-purple-200"> 2 ta (2022, 2013 cm⁻¹)</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>⭐ MUHIM:</strong> ν(C≡O) cho'qqilari 2022 va 2013 cm⁻¹ da (2 ta cho'qqi).
              Erkin CO (2143 cm⁻¹) dan past — π-back-bonding tufayli C≡O bog' kuchsizlanadi.
              Aksial CO bog'lari uzunroq — past chastota (2013 cm⁻¹).
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
              <span>200 cm⁻¹ (M-L)</span>
              <span>2000 cm⁻¹</span>
              <span>4000 cm⁻¹ (C≡O)</span>
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
              <title>IQ spektr grafigi — [Fe(CO)₅]</title>
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
                const isImportant = peak.freq === 2022 || peak.freq === 2013 || peak.freq === 540 || peak.freq === 490
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

          <div className="flex flex-wrap gap-3">
            {COMPOUND.irPeaks.map((p, i) => {
              const isImportant = p.freq === 2022 || p.freq === 2013 || p.freq === 540 || p.freq === 490
              return (
                <button
                  key={i}
                  onClick={() => setActivePeak(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                    activePeak === i ? 'border-yellow-400 bg-yellow-900/30' :
                    isImportant ? 'border-pink-400 bg-pink-900/20' :
                    'border-yellow-400/40 bg-yellow-900/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activePeak === i ? 'bg-yellow-400' : isImportant ? 'bg-pink-400' : 'bg-yellow-400'}`} />
                  <span className="font-mono text-yellow-400">{p.freq}</span>
                  <span className="text-purple-400">{p.assignment}</span>
                  {isImportant && <span className="text-[10px] text-yellow-400 font-bold">(⭐)</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* CHO'QQILAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📊 Cho'qqilar jadvali</h2>

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
                {COMPOUND.irPeaks.map((p, i) => {
                  const isImportant = p.freq === 2022 || p.freq === 2013 || p.freq === 540 || p.freq === 490
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isImportant ? 'bg-yellow-900/20' : ''}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isImportant ? 'text-yellow-400' : 'text-yellow-400'}`}>
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
                      <td className="py-3 px-4 font-mono text-yellow-400">{p.bond}</td>
                      <td className="py-3 px-4 font-mono text-cyan-400 text-xs">{p.symmetry}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>⭐ MUHIM:</strong> ν(C≡O) cho'qqilari 2022 va 2013 cm⁻¹ da (2 ta cho'qqi).
              Erkin CO (2143 cm⁻¹) dan past — π-back-bonding tufayli C≡O bog' kuchsizlanadi.
              Aksial CO bog'lari uzunroq — past chastota (2013 cm⁻¹).
            </p>
          </div>
        </div>

        {/* BERRY PSEUDOROTATION KALKULYATOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⏱️ Berry pseudorotation kalkulyator</h2>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">Berry pseudorotation</strong> — aksial va ekvatorial CO tez almashinadi.
            Haroratni o'zgartiring, tezlik konstantasi (k) va yarim umr (t₁/₂) ni ko'ring.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              Harorat: {berryTemp}°C ({(berryTemp + 273.15).toFixed(1)} K)
            </label>
            <input
              type="range"
              min="-100"
              max="50"
              value={berryTemp}
              onChange={(e) => setBerryTemp(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Haroratni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>-100°C</span>
              <span>-50°C</span>
              <span>50°C</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-purple-400">Tezlik konstantasi (k):</div>
              <div className="text-xl font-mono font-bold text-yellow-400">{berryResult.k} s⁻¹</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">Yarim umr (t₁/₂):</div>
              <div className="text-xl font-mono font-bold text-yellow-400">{berryResult.t_half_ps} ps</div>
            </div>
            <div>
              <div className="text-xs text-purple-400">Yarim umr (ns):</div>
              <div className="text-xl font-mono font-bold text-yellow-400">{berryResult.t_half_ns} ns</div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Berry pseudorotation:</strong> Aksial va ekvatorial CO tez almashinadi (~10⁻¹¹ s).
              IQ da ko'rinmaydi (juda tez), lekin NMR da past haroratda (-80°C) ko'rinadi.
              To'siq ~5-10 kJ/mol (juda past).
            </p>
          </div>
        </div>

        {/* WERNER QATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚖️ Metal karbonillar taqqoslash</h2>

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
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${row.complex.includes("Fe(CO)") ? "bg-yellow-900/20" : ""}`}>
                    <td className="py-3 px-4 font-bold text-yellow-400">{row.complex}</td>
                    <td className="py-3 px-4">{row.color}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{row.lm_range}</td>
                    <td className="py-3 px-4">{row.ions}</td>
                    <td className="py-3 px-4 text-yellow-400">{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Muhim:</strong> [Fe(CO)₅] ning Λm ≈ 0 S·cm²/mol — noelektrolit (neytral molekula).
              Barcha metal karbonillar neytral molekulalar — noelektrolitlar.
            </p>
          </div>
        </div>

        {/* CFSE KALKULYATOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🎨 Kristall maydon nazariyasi — CFSE hisoblagich</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Elektron konfiguratsiya</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Fe atomi:</span>
                  <span className="text-white font-mono">[Ar] 3d⁶ 4s²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Fe⁰ ioni:</span>
                  <span className="text-white font-mono">[Ar] 3d⁸</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Kristall maydon:</span>
                  <span className="text-white font-mono">Trigonal bipiramida (d⁸)</span>
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
                  <th className="py-3 px-4 text-purple-300">ν(C≡O)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Fe-C)</th>
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
                    <td className="py-3 px-4 font-mono">{result.freq_CO}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_FeC}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'Yaxshi' ? 'bg-yellow-600/30 text-yellow-400' :
                        result.quality === 'Farqlash testi' ? 'bg-blue-600/30 text-blue-400' :
                        result.quality === 'Fluksional test' ? 'bg-orange-600/30 text-orange-400' :
                        result.quality === 'Noelektrolit' ? 'bg-orange-600/30 text-orange-400' :
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
          </div>
        </div>

        {/* TEXNIKALAR SOLISHTIRISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Texnikalar solishtirishi</h2>

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
            <li><strong className="text-yellow-400">Temir pentakarbonil:</strong> 18 elektron qoidasi bajariladi — barqaror</li>
            <li><strong className="text-yellow-400">D₃ₕ simmetriya:</strong> Trigonal bipiramida, alternativa taqiq bor</li>
            <li><strong className="text-yellow-400">IR belgisi:</strong> ν(C≡O) 2022, 2013 cm⁻¹ (2 ta cho'qqi, aksial va ekvatorial)</li>
            <li><strong className="text-yellow-400">Berry pseudorotation:</strong> Aksial/ekvatorial CO tez almashinadi (~10⁻¹¹ s)</li>
            <li><strong className="text-yellow-400">Noelektrolit:</strong> Neytral molekula, Λm ≈ 0 S·cm²/mol</li>
            <li><strong className="text-yellow-400">π-back-bonding:</strong> C≡O bog' kuchsizlanadi (2143 → 2022 cm⁻¹)</li>
            <li><strong className="text-yellow-400">Diamagnit:</strong> Fe⁰ d⁸, barcha elektronlar juftlangan</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar/trans-pt-nh3-2-cl2" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← trans-[Pt(NH₃)₂Cl₂]
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            Birikmalar ro'yxati →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(CO)₅] (Temir pentakarbonil) • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Nakamoto, Lever, Wilkinson, Cotton, Berry (1955)</p>
        </div>
      </footer>
    </main>
  )
}