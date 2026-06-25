"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(en)₂Cl₂]Cl — KONDUKTOMETRIK TAHLIL (PREMIUM)
// Manbalar: Nakamoto, Lever, Cotton, Wilkinson, Werner (1893)
// Xususiyat: Xelat effekti + 2 ta ichki Cl⁻, sis/trans izomerlar, D₃/D₂ₕ simmetriya
// O'ziga xoslik: 1:1 elektrolit (2 ion), Λm ≈ 250, log β₂ ≈ 35
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(en)<sub>2</sub>Cl<sub>2</sub>]Cl",
  formulaPlain: "[Co(en)2Cl2]Cl",
  iupac: "Bis(etilendiamin)dixlorokobalt(III) xlorid",
  formulaExpanded: "CoC₄H₁₆N₄Cl₃",
  commonName: "Bis(etilendiamin)dixlorokobalt(III) (binafsha/yashil)",
  molarMass: 287.97,
  casNumber: "14878-43-8",
  color: "binafsha (sis) / yashil (trans)",
  structure: "Oktaedr (sis: C₂; trans: D₂ₕ)",
  metalLigand: "Co-N (xelat), Co-Cl",
  spaceGroup: "P2₁ (monoklinik, sis); P2₁/c (monoklinik, trans)",
  crystalSystem: "Monoklinik",
  pointGroup: "C₂ (sis) / D₂ₕ (trans)",
  electrolyteType: "1:1 elektrolit (2 ion)",
  molarConductivity: "~250 S·cm²/mol",
  isomers: {
    cis: { symbol: "cis", name: "Cis (binafsha)", pointGroup: "C₂", freq_CoCl: "330, 310" },
    trans: { symbol: "trans", name: "Trans (yashil)", pointGroup: "D₂ₕ", freq_CoCl: "325" }
  },
  chelateInfo: {
    ligandType: "Bidentat (en) + monodentat (Cl⁻)",
    ringSize: "5 a'zoli (Co-N-C-C-N)",
    ringCount: 2,
    chelateEffect: "10¹⁰ marta barqarorlik",
    logBeta2: "~35"
  }
}

const irPeaks = [
  { freq: 3290, T: 13, absorbance: 0.87, assignment: "νₐₛ(N-H)", assignment_uz: "N-H asimetrik cho'zilish", intensity: "Juda kuchli", bond: "N-H", symmetry: "A + B (C₂)", forceConstant: "6.0 mdyn/Å", bondLength: "1.02 Å", theoryNote: "NH₂ ning asimetrik cho'zilishi. C₂ simmetriya tufayli A va B modlari IQ faol. Koordinatsiyalangan NH₂ uchun xos." },
  { freq: 3190, T: 29, absorbance: 0.71, assignment: "νₛ(N-H)", assignment_uz: "N-H simmetrik cho'zilish", intensity: "Kuchli", bond: "N-H", symmetry: "A", forceConstant: "5.8 mdyn/Å", bondLength: "1.02 Å", theoryNote: "NH₂ ning simmetrik cho'zilishi. C₂ da A mod IQ va Raman ikkalasida ham faol." },
  { freq: 1585, T: 47, absorbance: 0.53, assignment: "δ(NH₂)", assignment_uz: "NH₂ egilish (scissoring)", intensity: "O'rta", bond: "NH₂", symmetry: "A + B", forceConstant: "0.6 mdyn/Å", bondLength: "—", theoryNote: "NH₂ ning deformatsion tebranishi. Erkin NH₂ (1590 cm⁻¹) bilan deyarli bir xil." },
  { freq: 1048, T: 59, absorbance: 0.41, assignment: "ν(C-N)", assignment_uz: "C-N cho'zilish (en ligand)", intensity: "Kuchli", bond: "C-N", symmetry: "A + B", forceConstant: "5.2 mdyn/Å", bondLength: "1.48 Å", theoryNote: "en ligandining C-N bog'i. Koordinatsiya ta'sirida biroz kuchaygan." },
  { freq: 665, T: 51, absorbance: 0.49, assignment: "ρ(NH₂)", assignment_uz: "NH₂ rocking (tebranish)", intensity: "O'rta", bond: "NH₂", symmetry: "B", forceConstant: "0.4 mdyn/Å", bondLength: "—", theoryNote: "NH₂ ning rocking tebranishi — en ligandining xelat halqasining tebranishi." },
  { freq: 515, T: 39, absorbance: 0.63, assignment: "ν(Co-N)", assignment_uz: "Co-N cho'zilish (valent tebranish)", intensity: "Kuchli", bond: "Co-N", symmetry: "A + B", forceConstant: "1.7 mdyn/Å", bondLength: "1.95 Å", theoryNote: "Co-N bog'ining cho'zilishi. Xelat effekti bog'ni biroz mustahkamlaydi." },
  { freq: 330, T: 48, absorbance: 0.52, assignment: "νₐₛ(Co-Cl)", assignment_uz: "Co-Cl asimetrik cho'zilish (sis)", intensity: "Kuchli", bond: "Co-Cl", symmetry: "B (C₂)", forceConstant: "1.4 mdyn/Å", bondLength: "2.26 Å", theoryNote: "⚠️ MUHIM: Ichki sferadagi 2 ta Cl⁻ ning asimetrik cho'zilishi (sis pozitsiya). Co-Cl bog' uzunligi 2.26 Å." },
  { freq: 310, T: 54, absorbance: 0.46, assignment: "νₛ(Co-Cl)", assignment_uz: "Co-Cl simmetrik cho'zilish (sis)", intensity: "Kuchli", bond: "Co-Cl", symmetry: "A", forceConstant: "1.3 mdyn/Å", bondLength: "2.26 Å", theoryNote: "⚠️ MUHIM: Ichki sferadagi 2 ta Cl⁻ ning simmetrik cho'zilishi. Trans izomerda faqat 1 ta cho'qqi (325 cm⁻¹)." },
  { freq: 285, T: 69, absorbance: 0.31, assignment: "δ(Cl-Co-N)", assignment_uz: "Cl-Co-N egilish deformatsiya", intensity: "O'rta-zaif", bond: "Cl-Co-N", symmetry: "A + B", forceConstant: "0.3 mdyn/Å", bondLength: "—", theoryNote: "Cl-Co-N burchakning deformatsiyasi. C₂ simmetriya tufayli ko'p modlar IQ faol." },
  { freq: 240, T: 73, absorbance: 0.27, assignment: "δ(Co-Cl)", assignment_uz: "Co-Cl egilish (skeletal bending)", intensity: "Zaif", bond: "Co-Cl", symmetry: "B", forceConstant: "0.2 mdyn/Å", bondLength: "—", theoryNote: "Co-Cl bog'ining egilish tebranishi — past chastotali (far-IR)." },
]

const irSpectrum = [
  { freq: 4000, absorbance: 0.05 },
  { freq: 3500, absorbance: 0.10 },
  { freq: 3290, absorbance: 0.87 },
  { freq: 3190, absorbance: 0.71 },
  { freq: 2000, absorbance: 0.05 },
  { freq: 1585, absorbance: 0.53 },
  { freq: 1048, absorbance: 0.41 },
  { freq: 800, absorbance: 0.15 },
  { freq: 665, absorbance: 0.49 },
  { freq: 515, absorbance: 0.63 },
  { freq: 330, absorbance: 0.52 },
  { freq: 310, absorbance: 0.46 },
  { freq: 285, absorbance: 0.31 },
  { freq: 240, absorbance: 0.27 },
  { freq: 200, absorbance: 0.05 },
]

const labResults = [
  { id: "LAB-001", date: "2026-12-15", technique: "KBr tabletka (sis)", condition: "200 mg KBr + 1 mg sis izomer", freq_nuNH: "3290, 3190", freq_CoN: "515", freq_CoCl: "330, 310", resolution: "4 cm⁻¹", notes: "Standart sharoit. Sis izomer — Co-Cl cho'qqilari 330 va 310 cm⁻¹ da aniq (2 ta cho'qqi!).", quality: "A'lo" },
  { id: "LAB-002", date: "2026-12-15", technique: "KBr tabletka (trans)", condition: "200 mg KBr + 1 mg trans izomer", freq_nuNH: "3290, 3190", freq_CoN: "515", freq_CoCl: "325", resolution: "4 cm⁻¹", notes: "Trans izomer — Co-Cl faqat 1 ta cho'qqi (325 cm⁻¹). Sis/trans farqlash uchun asosiy belgi!", quality: "A'lo" },
  { id: "LAB-003", date: "2026-12-16", technique: "ATR (sis)", condition: "To'g'ridan-to'g'ri kristall", freq_nuNH: "3285, 3185", freq_CoN: "513", freq_CoCl: "328, 308", resolution: "2 cm⁻¹", notes: "ATR usuli — cho'qqilar biroz siljigan. Co-Cl cho'qqilari aniq (sis izomer).", quality: "A'lo" },
  { id: "LAB-004", date: "2026-12-16", technique: "Far-IR (sis)", condition: "Maxsus uskuna, polietilen plastinka", freq_nuNH: "—", freq_CoN: "515, 285, 240", freq_CoCl: "330, 310", resolution: "2 cm⁻¹", notes: "Far-IR soha — barcha Co-N va Co-Cl tebranishlari aniq. 5 ta cho'qqi — sis izomer belgisi.", quality: "A'lo" },
  { id: "LAB-005", date: "2026-12-17", technique: "AgNO₃ cho'ktirish testi", condition: "IQ oldidan AgNO₃ testi", freq_nuNH: "—", freq_CoN: "—", freq_CoCl: "—", resolution: "—", notes: "⚠️ MUHIM: AgNO₃ qo'shilganda faqat 1 ta Cl⁻ cho'kadi (AgCl). 2 ta Cl⁻ cho'kmaydi — ichki sferada. 1:1 elektrolit.", quality: "Tasdiqlovchi test" },
  { id: "LAB-006", date: "2026-12-17", technique: "Sis/trans farqlash", condition: "IQ spektrlarni taqqoslash", freq_nuNH: "—", freq_CoN: "—", freq_CoCl: "—", resolution: "—", notes: "Sis: Co-Cl 330, 310 (2 cho'qqi). Trans: Co-Cl 325 (1 cho'qqi). Bu sis/trans izomerlarni IQ orqali farqlash usuli!", quality: "Farqlash testi" },
]

const techniques = [
  { name: "KBr tabletka", description: "Namunani KBr bilan aralashtirib, gidravlik press bilan tabletka bosish", advantages: ["Eng aniq va an'anaviy usul", "Co-Cl 330, 310 cm⁻¹ aniq ko'rinadi (sis)", "Sis/trans farqlash mumkin", "Kvantitativ tahlil uchun qulay"], disadvantages: ["Namuna tayyorlash kerak (10-15 daq)", "KBr nam bo'lsa, suv cho'qqilari aralashadi", "Past chastotali soha (200 cm⁻¹ dan past) zaif", "Sis/trans aralashmasi aniq emas"], bestFor: "Aniq kvantitativ tahlil, sis/trans farqlash", freqRange: "4000-400 cm⁻¹", resolution: "4 cm⁻¹", samplePrep: "10-15 daq" },
  { name: "ATR", description: "To'g'ridan-to'g'ri kristall yoki kukun namuna ustiga qo'yish", advantages: ["Namuna tayyorlash shart emas", "Tez o'lchash (1-2 daq)", "Sis/trans tez farqlash", "Namuna buzilmaydi"], disadvantages: ["Cho'qqilar biroz siljigan (ATR effekt)", "Past chastotali soha zaif", "Kvantitativ tahlil qiyin", "Aralashmalar aniq emas"], bestFor: "Tez skrining, sis/trans tez farqlash", freqRange: "4000-600 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "1-2 daq" },
  { name: "Far-IR", description: "Maxsus uskuna bilan 400-100 cm⁻¹ oralig'ida o'lchash", advantages: ["Co-N va Co-Cl tebranishlari to'liq (515, 330, 310, 285, 240 cm⁻¹)", "Sis izomerda 5 ta cho'qqi — aniq belgi", "Trans da 2 ta cho'qqi — farqlash oson", "Geometriya tasdig'i"], disadvantages: ["Maxsus uskuna kerak", "Polietilen yoki CsI plastinka kerak", "Nam namuna ishlamaydi", "Namuna tayyorlash qiyin"], bestFor: "Sis/trans farqlash, Co-N va Co-Cl to'liq o'rganish", freqRange: "400-100 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "15-20 daq" },
  { name: "AgNO₃ cho'ktirish testi", description: "IQ oldidan AgNO₃ bilan test — cho'kadigan Cl⁻ sonini aniqlash", advantages: ["Werner tajribasining to'g'ridan-to'g'ri tasdig'i", "Faqat 1 ta Cl⁻ cho'kadi — 1:1 elektrolit", "Kvantitativ (AgCl massasi)", "Oddiy uskuna"], disadvantages: ["Faqat Cl⁻ uchun", "Sekin reaksiya (inert kompleks)", "Faqat soni (ichki Cl soni emas)", "AgNO₃ qimmat"], bestFor: "Werner nazariyasini tasdiqlash, 1:1 elektrolit tasdig'i", freqRange: "—", resolution: "—", samplePrep: "30-60 daq" },
]

const interferences = [
  { source: "Suv (H₂O)", freqRange: "3400, 1640 cm⁻¹", effect: "Keng cho'qqilar — N-H va NH₂ sohasiga aralashadi", severity: "Yuqori", solution: "KBr ni 110°C da 2 soat quritish. Namuna quritgichda saqlash.", prevention: "KBr ni quritish, namuna quritgichda saqlash" },
  { source: "CO₂ (atmosfera)", freqRange: "2350, 667 cm⁻¹", effect: "O'tkir cho'qqilar — halqa sohasiga (665 cm⁻¹) aralashadi", severity: "O'rta", solution: "Spektrometrni N₂ bilan tozalash yoki CO₂ absorber ishlatish.", prevention: "N₂ bilan tozalash, CO₂ absorber" },
  { source: "Sis/trans aralashmasi", freqRange: "330, 310 vs 325 cm⁻¹", effect: "Cho'qqilar murakkablashadi — sis va trans cho'qqilari aralashadi", severity: "Yuqori", solution: "Sof sis yoki trans izomer ishlatish. Xromatografiya bilan ajratish.", prevention: "Sof izomer sintez qilish, xromatografiya" },
  { source: "Nam KBr", freqRange: "3400, 1640 cm⁻¹", effect: "Keng suv cho'qqilari — spektrning ko'p qismini qoplaydi", severity: "Yuqori", solution: "KBr ni 110°C da 2 soat quritish. Desikatorda saqlash.", prevention: "KBr quritish, desikator" },
  { source: "Namuna parchalanishi", freqRange: "3200-3300 cm⁻¹", effect: "en ligandi yo'qolishi — cho'qqilar zaiflashadi", severity: "O'rta", solution: "Namuna tayyorlashda ortiqcha isitishdan saqlanish.", prevention: "Past haroratda saqlash, tez tayyorlash" },
  { source: "Tableka qalinligi", freqRange: "Barcha", effect: "Juda qalin — cho'qqilar to'yingan. Juda yupqa — zaif signal.", severity: "O'rta", solution: "Optimal qalinlik: 1 mm. 1 mg namuna + 200 mg KBr.", prevention: "Standart tabletka qalinligi" },
]

export default function CoEn2Cl2ClConductometricPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(2000)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [activeIsomer, setActiveIsomer] = useState("cis")
  
  const [calcDq, setCalcDq] = useState(22000)
  const [calcP, setCalcP] = useState(21000)
  const [calcN, setCalcN] = useState(6)

  const currentPeak = useMemo(() => {
    let closest = irPeaks[0]
    let minDiff = Math.abs(freqSlider - irPeaks[0].freq)
    for (let i = 1; i < irPeaks.length; i++) {
      const diff = Math.abs(freqSlider - irPeaks[i].freq)
      if (diff < minDiff) { minDiff = diff; closest = irPeaks[i] }
    }
    return closest
  }, [freqSlider])

  const cfseResult = useMemo(() => {
    const cfse = -2.4 * calcDq + 2 * calcP
    return { cfse: cfse.toFixed(0), cfseKJ: (cfse * 0.01196).toFixed(2) }
  }, [calcDq, calcP])

  const muResult = useMemo(() => {
    const mu = Math.sqrt(calcN * (calcN + 2))
    return { mu: mu.toFixed(2) }
  }, [calcN])

  const currentLabResult = useMemo(() => {
    return labResults.find(r => r.id === activeLabResult) || labResults[0]
  }, [activeLabResult])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-green-950 to-purple-950 border-2 border-green-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🔍</span> [Co(en)₂Cl₂]Cl — XELAT + 2 TA ICHKI Cl⁻!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-green-300">Bis(etilendiamin)dixlorokobalt(III)</strong> — xelat effekti va 2 ta ichki Cl⁻.
              <strong> Sis va trans izomerlar</strong>, C₂/D₂ₕ simmetriya.
            </p>
            
            <div className="bg-green-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-green-400 font-bold mb-2">📊 Asosiy cho'qqilar:</div>
                  <div className="text-purple-200">
                    <strong>ν(N-H):</strong> 3290, 3190 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Co-Cl):</strong> 330, 310 cm⁻¹ (sis)
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">🔬 Simmetriya:</div>
                  <div className="text-purple-200">
                    <strong>C₂ (sis)</strong> / <strong>D₂ₕ (trans)</strong>
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>1:1 elektrolit</strong> — 2 ion
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-green-300">Xelat effekti:</strong> 2 ta bidentat en ligand 2 ta 5 a'zoli halqa hosil qiladi. 
                log β₂ ≈ 35 — xelat effekti tufayli barqaror.
              </p>
            </div>

            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-green-300">Sis vs Trans:</strong> Sis izomerda Co-Cl cho'qqilari 330 va 310 cm⁻¹ (2 ta cho'qqi). 
                Trans izomerda faqat 325 cm⁻¹ (1 ta cho'qqi). Bu sis/trans farqlashning asosiy belgisi!
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-green-400 font-semibold">[Co(en)₂Cl₂]Cl</span>
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
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">C₂/D₂ₕ simmetriya</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Xelat effekti</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Diamagnit</span>
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Sis/Trans</span>
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
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d⁶ quyi spin</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">Xelat + Cl</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">1:1 elektrolit</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              [Co(en)₂Cl₂]Cl
            </h2>
            <span className="text-purple-400 text-lg">287.97 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            bis(etilendiamin)dixlorokobalt(III) xlorid — <span className="text-green-400 italic">&quot;Xelat + ichki Cl⁻ namunasi&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-green-400">IQ spektri</strong> KBr tabletka usulida 4000−200 cm⁻¹ 
            oralig'ida olingan. Eng muhim diagnostik signallar: 
            <strong className="text-green-400"> ν(Co-Cl) 330, 310 cm⁻¹</strong> — ichki sfera 2 ta Cl⁻ belgisi (sis izomer);
            <strong className="text-green-400"> ν(Co-N) 515 cm⁻¹</strong> — xelat bog'ining mustahkamligi.
            Bu kompleks xelat effekti va ichki Cl⁻ ning muhim namunasi.
          </p>

          {/* SIS/TRANS TANLASH */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveIsomer("cis")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeIsomer === "cis"
                  ? "bg-green-600/60 text-white border border-green-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
              }`}
            >
              Sis izomer (binafsha, C₂)
            </button>
            <button
              onClick={() => setActiveIsomer("trans")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeIsomer === "trans"
                  ? "bg-pink-600/60 text-white border border-pink-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
              }`}
            >
              Trans izomer (yashil, D₂ₕ)
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
              <div className="text-white font-bold">
                {activeIsomer === "cis" ? "C₂ (sis)" : "D₂ₕ (trans)"}
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit turi</div>
              <div className="text-white font-bold">1:1 (2 ion)</div>
            </div>
          </div>
        </div>

        {/* XELAT EFFEKTİ + ICHKI Cl⁻ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔗 Xelat effekti + 2 ta ichki Cl⁻</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            [Co(en)₂Cl₂]⁺ <strong className="text-green-400">xelat effekti</strong> va <strong className="text-green-400">2 ta ichki Cl⁻</strong> ning muhim namunasi.
            Etilendiamin (en = H₂N-CH₂-CH₂-NH₂) bidentat ligand — 2 ta N atomi orqali Co³⁺ ga bog'lanadi.
            2 ta en ligandi 2 ta 5 a'zoli xelat halqa hosil qiladi. 2 ta Cl⁻ ham ichki sferada.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Xelat effekti</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Ligand turi:</span>
                  <span className="text-green-400">Bidentat (en) + monodentat (Cl⁻)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Halqa o'lchami:</span>
                  <span className="text-green-400">5 a'zoli (Co-N-C-C-N)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Halqalar soni:</span>
                  <span className="text-green-400">2 ta</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">log β₂:</span>
                  <span className="text-green-400 font-bold">~35</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-green-400 font-bold">10¹⁰ marta</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Ichki sfera Cl⁻</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Ichki Cl⁻ soni:</span>
                  <span className="text-yellow-400 font-bold">2 ta</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Tashqi Cl⁻:</span>
                  <span className="text-yellow-400">1 ta</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co-Cl bog' uzunligi:</span>
                  <span className="text-yellow-400">2.26 Å</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">AgNO₃ bilan:</span>
                  <span className="text-yellow-400 font-bold">1 ta cho'kadi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Elektrolit:</span>
                  <span className="text-yellow-400 font-bold">1:1 (2 ion)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Entropiya effekti:</strong> Co³⁺ + 2en + 2Cl⁻ → [Co(en)₂Cl₂]⁺ reaksiyasida 1 molekula 3 molekulaga aylanadi.
              Bu <strong>entropiya ortishiga</strong> (ΔS &gt; 0) olib keladi — shuning uchun xelat komplekslar monodentat 
              komplekslardan ancha barqaror. [Co(NH₃)₄Cl₂]Cl dan 10¹⁰ marta barqaror.
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
                <div className="text-xl font-mono font-bold text-green-400">{currentPeak.forceConstant}</div>
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
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible">
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
                points={irSpectrum.map(p => {
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

              {irPeaks.map((peak, i) => {
                const x = 50 + ((4000 - peak.freq)/4000)*530
                const y = 220 - (peak.absorbance/1.0)*200
                const isActive = currentPeak.freq === peak.freq
                const isCoCl = peak.freq === 330 || peak.freq === 310
                const isCoN = peak.freq === 515
                const isImportant = isCoCl || isCoN
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

          <div className="flex flex-wrap gap-3">
            {irPeaks.map((p, i) => {
              const isCoCl = p.freq === 330 || p.freq === 310
              const isCoN = p.freq === 515
              const isImportant = isCoCl || isCoN
              return (
                <button
                  key={i}
                  onClick={() => setActivePeak(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                    activePeak === i ? 'border-yellow-400 bg-yellow-900/30' : 
                    isImportant ? 'border-pink-400 bg-pink-900/20' :
                    'border-green-400/40 bg-green-900/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activePeak === i ? 'bg-yellow-400' : isImportant ? 'bg-pink-400' : 'bg-green-400'}`} />
                  <span className="font-mono text-green-400">{p.freq}</span>
                  <span className="text-purple-400">{p.assignment}</span>
                  {isImportant && <span className="text-[10px] text-yellow-400 font-bold">(MUHIM!)</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* CHO'QQILAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📊 Cho'qqilar jadvali — to'liq tahlil (sis izomer)</h2>
          
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
                  <th className="py-3 px-4 text-purple-300">Kuch</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {irPeaks.map((p, i) => {
                  const isCoCl = p.freq === 330 || p.freq === 310
                  const isCoN = p.freq === 515
                  const isImportant = isCoCl || isCoN
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isImportant ? 'bg-pink-900/20' : ''}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isImportant ? 'text-pink-400' : 'text-yellow-400'}`}>
                        {p.freq}
                        {isImportant && <span className="ml-1 text-[10px] text-yellow-400">⚠</span>}
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
                      <td className="py-3 px-4 font-mono text-cyan-400">{p.forceConstant}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
            <p className="text-green-300 text-sm">
              <strong>⚠️ MUHIM:</strong> ν(Co-Cl) = 330, 310 cm⁻¹ cho'qqilari ichki sferada 2 ta Cl⁻ borligini ko'rsatadi. 
              [Co(NH₃)₆]Cl₃ da bu cho'qqilar <strong>YO'Q</strong>. 
              [Co(NH₃)₅Cl]Cl₂ da 1 ta cho'qqi (330 cm⁻¹). Bu Verner qatorining IQ tasdig'i.
            </p>
          </div>
        </div>

        {/* SIS/TRANS FARQLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Sis vs Trans izomerlar — IQ orqali farqlash</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            [Co(en)₂Cl₂]⁺ ikkita geometrik izomerga ega: <strong className="text-green-400">sis</strong> (C₂ simmetriya) 
            va <strong className="text-pink-400">trans</strong> (D₂ₕ simmetriya). IQ spektroskopiya ularni aniq farqlaydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Sis izomer (binafsha, C₂)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(Co-Cl):</span>
                  <span className="text-green-400 font-mono">330, 310 cm⁻¹ (2 ta cho'qqi)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Simmetriya:</span>
                  <span className="text-green-400">C₂ (alternativa taqiq yo'q)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">IQ faol modlar:</span>
                  <span className="text-green-400">Ko'p (A + B)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Farqlash belgisi:</span>
                  <span className="text-green-400">2 ta Co-Cl cho'qqi</span>
                </div>
              </div>
            </div>

            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-3">Trans izomer (yashil, D₂ₕ)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(Co-Cl):</span>
                  <span className="text-pink-400 font-mono">325 cm⁻¹ (1 ta cho'qqi)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Simmetriya:</span>
                  <span className="text-pink-400">D₂ₕ (alternativa taqiq bor)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">IQ faol modlar:</span>
                  <span className="text-pink-400">Kam (B₁ᵤ, B₂ᵤ)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Farqlash belgisi:</span>
                  <span className="text-pink-400">1 ta Co-Cl cho'qqi</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Farqlash usuli:</strong> Sis izomerda Co-Cl cho'qqilari <strong>330 va 310 cm⁻¹</strong> (2 ta cho'qqi). 
              Trans izomerda faqat <strong>325 cm⁻¹</strong> (1 ta cho'qqi). 
              Bu sis/trans izomerlarni IQ orqali farqlashning asosiy belgisi!
            </p>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Alternativa taqiq:</strong> D₂ₕ da inversiya markazi mavjud — ba'zi modlar faqat IQ yoki Raman faol. 
              C₂ da inversiya yo'q — shuning uchun ko'p modlar ikkalasida ham faol. 
              Bu simmetriya farqining muhim natijasi.
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
                  <th className="py-3 px-4 text-purple-300">ν(N-H)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Co-N)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Co-Cl)</th>
                  <th className="py-3 px-4 text-purple-300">Sifat</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {labResults.map((result) => (
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
                    <td className="py-3 px-4 font-mono">{result.freq_nuNH}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_CoN}</td>
                    <td className="py-3 px-4 font-mono text-green-400">{result.freq_CoCl}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'Yaxshi' ? 'bg-yellow-600/30 text-yellow-400' :
                        result.quality === 'Tasdiqlovchi test' ? 'bg-blue-600/30 text-blue-400' :
                        result.quality === 'Farqlash testi' ? 'bg-pink-600/30 text-pink-400' :
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

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan natija izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {currentLabResult.notes}
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
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-green-400 font-bold mb-3">{techniques[activeTechnique].name}</h3>
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

        {/* GURUH NAZARIYASI — C₂/D₂ₕ SIMMETRIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Guruh nazariyasi tahlili — C₂/D₂ₕ simmetriya</h2>
          
          <p className="text-purple-200 leading-relaxed">
            [Co(en)₂Cl₂]⁺ ikkita simmetriyaga ega: <strong className="text-green-400">C₂ (sis)</strong> va 
            <strong className="text-pink-400"> D₂ₕ (trans)</strong>. Bu IQ spektrga sezilarli ta'sir ko'rsatadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">C₂ (sis izomer)</h3>
              <p className="text-purple-200 text-sm mb-3">
                <strong>ML₄X₂ (sis, C₂):</strong> Γ<sub>teb</sub> = 5A + 5B (10 mod)
              </p>
              <div className="space-y-2 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-green-400 font-bold">IQ-faol:</span>
                  <span className="text-purple-200"> 5A + 5B (10 mod)</span>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-blue-400 font-bold">Raman-faol:</span>
                  <span className="text-purple-200"> 5A + 5B</span>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-green-400 font-bold">IQ + Raman:</span>
                  <span className="text-purple-200"> BARCHA (alternativa taqiq YO'Q!)</span>
                </div>
              </div>
            </div>

            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-3">D₂ₕ (trans izomer)</h3>
              <p className="text-purple-200 text-sm mb-3">
                <strong>ML₄X₂ (trans, D₂ₕ):</strong> Γ<sub>teb</sub> = 3A<sub>g</sub> + B<sub>1g</sub> + B<sub>2g</sub> + B<sub>3g</sub> + A<sub>u</sub> + B<sub>1u</sub> + B<sub>2u</sub> + B<sub>3u</sub>
              </p>
              <div className="space-y-2 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-green-400 font-bold">IQ-faol:</span>
                  <span className="text-purple-200"> B<sub>1u</sub> + B<sub>2u</sub> + B<sub>3u</sub> (3 mod)</span>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-blue-400 font-bold">Raman-faol:</span>
                  <span className="text-purple-200"> 3A<sub>g</sub> + B<sub>1g</sub> + B<sub>2g</sub> + B<sub>3g</sub></span>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-pink-400 font-bold">Alternativa taqiq:</span>
                  <span className="text-purple-200"> BOR! (D₂ₕ da inversiya mavjud)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Farqning sababi:</strong> C₂ da inversiya markazi <strong>YO'Q</strong> — 
              shuning uchun A va B modlari IQ va Raman ikkalasida ham faol!
              D₂ₕ da inversiya <strong>MAVJUD</strong> — alternativa taqiq amal qiladi.
            </p>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Co-Cl cho'qqilari:</strong> Sis da <strong>330 va 310 cm⁻¹</strong> (2 ta cho'qqi, B va A). 
              Trans da faqat <strong>325 cm⁻¹</strong> (1 ta cho'qqi, B₁ᵤ). 
              Bu sis/trans farqlashning asosiy belgisi!
            </p>
          </div>
        </div>

        {/* KRISTALL MAYDON NAZARIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🎨 Kristall maydon nazariyasi — CFSE hisoblagich</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-3">Elektron konfiguratsiya</h3>
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
                  <span className="text-purple-400">Toq elektron:</span>
                  <span className="text-white font-mono">0 (diamagnit)</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">CFSE hisoblagich</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-purple-400 mb-1">Δ<sub>o</sub> (cm⁻¹):</label>
                  <input
                    type="number"
                    value={calcDq}
                    onChange={(e) => setCalcDq(Number(e.target.value))}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-2 text-white font-mono focus:border-yellow-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-400 mb-1">P (juftlashish energiyasi, cm⁻¹):</label>
                  <input
                    type="number"
                    value={calcP}
                    onChange={(e) => setCalcP(Number(e.target.value))}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-2 text-white font-mono focus:border-yellow-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-400 mb-1">d-elektron soni:</label>
                  <input
                    type="number"
                    value={calcN}
                    onChange={(e) => setCalcN(Number(e.target.value))}
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
              CFSE = -2.4Δ<sub>o</sub> + 2P (d⁶ quyi spin) • μ = √(n(n+2)) μ<sub>B</sub>
            </p>
          </div>
        </div>

        {/* WERNER QATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚖️ Werner koordinatsion qatori</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th>
                  <th className="py-3 px-4 text-purple-300">Rang</th>
                  <th className="py-3 px-4 text-purple-300">Λm</th>
                  <th className="py-3 px-4 text-purple-300">Ionlar</th>
                  <th className="py-3 px-4 text-purple-300">Elektrolit</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-yellow-400">[Co(NH₃)₆]Cl₃</td>
                  <td className="py-3 px-4 text-yellow-300">Sariq (Luteo)</td>
                  <td className="py-3 px-4 font-mono">432</td>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4 text-yellow-400">1:3</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-pink-400">[Co(NH₃)₅Cl]Cl₂</td>
                  <td className="py-3 px-4 text-pink-300">Binafsha (Purpureo)</td>
                  <td className="py-3 px-4 font-mono">340</td>
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4 text-pink-400">1:2</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-green-400">[Co(NH₃)₄Cl₂]Cl</td>
                  <td className="py-3 px-4 text-green-300">Yashil (Praseo)</td>
                  <td className="py-3 px-4 font-mono">250</td>
                  <td className="py-3 px-4">2</td>
                  <td className="py-3 px-4 text-green-400">1:1</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-orange-400">[Co(en)₃]Cl₃</td>
                  <td className="py-3 px-4 text-orange-300">Sariq-to'q sariq</td>
                  <td className="py-3 px-4 font-mono">430</td>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4 text-orange-400">1:3</td>
                </tr>
                <tr className="border-b border-purple-800/30 bg-green-900/20">
                  <td className="py-3 px-4 font-bold text-green-400">[Co(en)₂Cl₂]Cl</td>
                  <td className="py-3 px-4 text-green-300">Binafsha/Yashil</td>
                  <td className="py-3 px-4 font-mono">250</td>
                  <td className="py-3 px-4">2</td>
                  <td className="py-3 px-4 text-green-400">1:1</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
            <p className="text-green-300 text-sm">
              <strong>Muhim:</strong> [Co(en)₂Cl₂]Cl ning Λm ≈ 250 — [Co(NH₃)₄Cl₂]Cl (250) ga teng.
              Ikkalasi ham 1:1 elektrolit (2 ion). Lekin [Co(en)₂Cl₂]⁺ xelat effekti tufayli barqarorroq.
            </p>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-green-400">Xelat effekti:</strong> log β₂ ≈ 35 — [Co(NH₃)₄Cl₂]⁺ dan 10¹⁰ marta barqaror</li>
            <li>Co³⁺ (d⁶, QS) — <strong>inert kompleks</strong>, diamagnit</li>
            <li><strong>ν(Co-N) = 515 cm⁻¹</strong> — xelat bog'ining mustahkamligi</li>
            <li><strong>ν(Co-Cl) = 330, 310 cm⁻¹</strong> — ichki sfera 2 ta Cl⁻ belgisi</li>
            <li>C₂ simmetriya (sis) — <strong>alternativa taqiq yo'q</strong></li>
            <li><strong>Sis/Trans farqlash</strong> — Co-Cl cho'qqilari soni orqali</li>
            <li>1:1 elektrolit (2 ion) — Λm ≈ 250</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-nh3-3-cl3" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            [Co(NH₃)₃Cl₃] →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(en)₂Cl₂]Cl • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Nakamoto (Infrared and Raman Spectra), Werner (1893, Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}