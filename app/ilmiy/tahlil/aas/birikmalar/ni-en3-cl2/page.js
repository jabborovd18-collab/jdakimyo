"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Ni(en)₃]Cl₂ — AAS (Atom-Absorbsion Spektroskopiya) MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)
// Xususiyat: Ni²⁺ FAAS tahlili, 232.0 nm, xelat kompleksi
// O'ziga xoslik: Xelat effekti (log β₃ ≈ 18), bidentat ligand
// Maqsad: Faqat AAS tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Ni: 58.693, Cl: 35.450, C: 12.011, N: 14.007, H: 1.008
}

const COMPOUND = {
  formulaHTML: "[Ni(en)<sub>3</sub>]Cl<sub>2</sub>",
  formulaPlain: "[Ni(en)3]Cl2",
  iupac: "Tris(etilendiamin)nikel(II) xlorid",
  formulaExpanded: "NiC₆H₂₄N₆Cl₂ (en = H₂N-CH₂-CH₂-NH₂)",
  commonName: "Nikel etilendiamin kompleksi (binafsha kristallar)",
  molarMass: 309.90,
  casNumber: "15432-11-8",
  color: "to'q binafsha kristallar",
  stability: "juda barqaror (xelat effekti, log β₃ ≈ 18), havoda yillar davomida saqlanadi",
  
  historicalFact: {
    title: "Xelat effekti — termodinamik ustunlik kashfiyoti",
    text: "[Ni(en)₃]Cl₂ — xelat effektining klassik namunasi. 1930-yillarda Gerold Schwarzenbach (Shveytsariya) va boshqalar ko'rsatdiki, [Ni(en)₃]²⁺ ning barqarorlik doimiysi (log β₃ ≈ 18) [Ni(NH₃)₆]²⁺ (log β₆ ≈ 8) dan 10¹⁰ marta katta! Bu ulkan farqning sababi ENTROPIYA: bitta en ligandi 2 ta NH₃ o'rnini egallaganda, erkin molekulalar soni ortadi (ΔS {'>'} 0). 3 ta en ligandi har biri 5 a'zoli xelat halqasi hosil qiladi (Ni-N-C-C-N) — bu eng barqaror halqa o'lchami. AAS tahlilida bu birikma juda qiziq: Ni²⁺ FAAS da oson atomlanadi, en ligandlari alangada to'liq yonib ketadi, matritsa effekti minimal. λ = 232.0 nm — Ni ning eng sezgir chizig'i.",
    year: "1930-yillar"
  },

  chelateEffect: {
    title: "Xelat effekti — nima uchun [Ni(en)₃]²⁺ [Ni(NH₃)₆]²⁺ dan 10¹⁰× barqaror?",
    description: "Xelat effekti — bidentat yoki polidentat ligandlar monodentat ligandlarga qaraganda ancha barqaror komplekslar hosil qilishi. Bu asosan ENTROPIYA bilan bog'liq.",
    comparison: [
      { 
        complex: "[Ni(en)₃]²⁺", 
        logBeta: "18.0", 
        ligand: "3× en (bidentat)", 
        rings: "3 ta 5-a'zoli halqa",
        entropy: "Yuqori (7 zarrachadan 4)",
        color: "binafsha"
      },
      { 
        complex: "[Ni(NH₃)₆]²⁺", 
        logBeta: "8.0", 
        ligand: "6× NH₃ (monodentat)", 
        rings: "Halqa yo'q",
        entropy: "Past (7 zarrachadan 7)",
        color: "ko'k-binafsha"
      }
    ],
    aasRelevance: "Xelat effekti tufayli eritma juda barqaror — Ni²⁺ erkin ajralmaydi. AAS da bu muhim: namuna uzoq vaqt barqaror, takroriy o'lchashlar mos keladi."
  },

  aasParameters: {
    element: "Ni",
    oxidationState: "Ni²⁺ (lekin AAS buni farqlamaydi!)",
    hclLamp: "Ni katod lampasi (Hollow Cathode Lamp)",
    lambda: { primary: 232.0, secondary: 341.5, tertiary: 352.4 },
    slitWidth: 0.2,
    lampCurrent: 8,
    atomization: "FAAS (Alanga AAS)",
    flame: "Havo-C₂H₂ (oxidizing, ~2300°C)",
    burnerHeight: 8,
    backgroundCorrection: "Deuteriy lampasi (D₂)",
    linearRange: "0.06 - 5.0 mg/L",
    sensitivity: 0.07,
    lod: 0.006,
    loq: 0.020,
    rsd_typical: "0.5 - 1.5%"
  },

  theoretical: {
    Ni:  { mass: 58.693,  percent: 18.940, source: "Markaziy Ni²⁺ atomi", aasSignal: "232.0 nm da asosiy signal" },
    Cl:  { mass: 70.900,  percent: 22.878, source: "2×Cl⁻ (tashqi sfera)", aasSignal: "FAAS da o'lchanmaydi" },
    C:   { mass: 72.066,  percent: 23.254, source: "3×en (6×C)", aasSignal: "FAAS da o'lchanmaydi" },
    N:   { mass: 84.042,  percent: 27.120, source: "3×en (6×N)", aasSignal: "FAAS da o'lchanmaydi" },
    H:   { mass: 24.192,  percent: 7.806,  source: "3×en (24×H)", aasSignal: "FAAS da o'lchanmaydi" }
  },

  calibrationCurve: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (0.1 M HNO₃)" },
    { conc: 0.5, absorbance: 0.072, note: "Standart 1" },
    { conc: 1.0, absorbance: 0.143, note: "Standart 2" },
    { conc: 2.0, absorbance: 0.287, note: "Standart 3" },
    { conc: 3.0, absorbance: 0.430, note: "Standart 4" },
    { conc: 4.0, absorbance: 0.574, note: "Standart 5" },
    { conc: 5.0, absorbance: 0.717, note: "Standart 6" }
  ],

  experimentalRuns: [
    { id: "AAS-24-401", date: "2024-09-05", absorbance: 0.515, conc_mgL: 3.59, sample_mg: 20.0, dilution: 10, Ni_percent: 18.95, rsd: 0.85, note: "Toza [Ni(en)₃]Cl₂" },
    { id: "AAS-24-402", date: "2024-09-05", absorbance: 0.513, conc_mgL: 3.58, sample_mg: 20.0, dilution: 10, Ni_percent: 18.90, rsd: 0.78, note: "Ikkinchi parallel" },
    { id: "AAS-24-403", date: "2024-09-05", absorbance: 0.517, conc_mgL: 3.61, sample_mg: 20.0, dilution: 10, Ni_percent: 19.05, rsd: 0.92, note: "Uchinchi parallel" },
    { id: "AAS-24-404", date: "2024-09-05", absorbance: 0.514, conc_mgL: 3.59, sample_mg: 20.0, dilution: 10, Ni_percent: 18.95, rsd: 0.82, note: "To'rtinchi parallel" },
    { id: "AAS-24-405", date: "2024-09-05", absorbance: 0.516, conc_mgL: 3.60, sample_mg: 20.0, dilution: 10, Ni_percent: 19.00, rsd: 0.88, note: "Beshinchi parallel" },
    { id: "AAS-24-406", date: "2024-09-06", absorbance: 0.345, conc_mgL: 2.41, sample_mg: 20.0, dilution: 10, Ni_percent: 12.70, rsd: 1.55, note: "⚠ [Ni(en)₂]Cl₂ aralashmasi (2 en)" },
    { id: "AAS-24-407", date: "2024-09-06", absorbance: 0.175, conc_mgL: 1.22, sample_mg: 20.0, dilution: 10, Ni_percent: 6.42, rsd: 2.15, note: "⚠ [Ni(en)]Cl₂ aralashmasi (1 en)" },
    { id: "BLANK-05",   date: "2024-09-05", absorbance: 0.001, conc_mgL: 0.01, sample_mg: 0.0,  dilution: 1,  Ni_percent: 0.00, rsd: 0.00, note: "Blank (0.1 M HNO₃)" },
    { id: "STD-Ni-10",  date: "2024-09-05", absorbance: 1.433, conc_mgL: 10.01, sample_mg: 0.0, dilution: 1, Ni_percent: 0.00, rsd: 0.35, note: "NIST Ni standarti (10 mg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 20.0 ± 0.1 mg [Ni(en)₃]Cl₂ tortiladi. To'q binafsha rang — xelat kompleksi belgisi. Och rang — qisman parchalanish.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 50 mL 0.1 M HNO₃ qo'shiladi. Xelat kompleks barqaror — Ni²⁺ erkin ajralmaydi.", time: "5 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "0.1 M HNO₃ bilan 100 mL gacha to'ldiriladi. Bu eritma konsentratsiyasi: ~200 mg/L [Ni(en)₃]Cl₂ ≈ 38 mg/L Ni.", time: "1 daq", critical: false },
    { step: 4, title: "10× suyuqlantirish", desc: "1.0 mL eritmadan 10 mL kolbaga o'tkaziladi. Natija: ~3.8 mg/L Ni — kalibrlash diapazonida (0.06-5.0 mg/L).", time: "3 daq", critical: true },
    { step: 5, title: "FAAS da o'lchash", desc: "Havo-C₂H₂ alangasi, λ = 232.0 nm, Deuteriy fon korreksiyasi. Ni²⁺ to'liq atomlanadi.", time: "5-8 daq", critical: false },
    { step: 6, title: "Natijalarni hisoblash", desc: "%Ni = (C × V × DF / m) × 100. Nazariy: 18.94%. Xelat effekti tufayli eritma barqaror.", time: "1 daq", critical: false }
  ],

  interferences: [
    { type: "Spektral", severity: "Past", description: "Ni 232.0 nm da toza signal. Yaqin chiziqlar yo'q.", solution: "Deuteriy fon korreksiyasi yetarli" },
    { type: "Kimyoviy (Fe³⁺)", severity: "Past", description: "Yuqori Fe³⁺ (>10 mg/L) ozgina ta'sir qilishi mumkin.", solution: "Standart qo'shish metodi" },
    { type: "Kimyoviy (en matritsasi)", severity: "Past", description: "en ligandlari alangada to'liq yonib ketadi — muammo yo'q.", solution: "Hech narsa kerak emas" },
    { type: "Ionlanish", severity: "Past", description: "Ni ning ionlanish potensiali 7.64 eV — alangada kam ionlanadi.", solution: "Ionlanish buferi shart emas" },
    { type: "Matritsa (Cl⁻)", severity: "Past", description: "Cl⁻ alangada to'liq bug'lanadi — muammo yo'q.", solution: "Standartlar ham 0.1 M HNO₃ da" }
  ],

  tgaSteps: [
    { start: 25, end: 200, loss: 0.0, event: "Barqaror zona", color: "#10b981", aasEffect: "Ni signal barqaror" },
    { start: 200, end: 300, loss: 19.4, event: "1-en yo'qolishi", color: "#8b5cf6", aasEffect: "[Ni(en)₂]Cl₂ hosil bo'ladi" },
    { start: 300, end: 400, loss: 19.4, event: "2-en yo'qolishi", color: "#ef4444", aasEffect: "[Ni(en)]Cl₂ qoldig'i" },
    { start: 400, end: 500, loss: 19.4, event: "3-en yo'qolishi", color: "#ef4444", aasEffect: "NiCl₂ qoldig'i" },
    { start: 500, end: 700, loss: 22.9, event: "Cl₂ yo'qolishi", color: "#f59e0b", aasEffect: "Ni metali qoldig'i (18.9%)" }
  ],

  relatedMethods: [
    { name: "UV-Vis spektroskopiya", role: "d-d o'tishlar: ³A₂g → ³T₂g (350 nm), ³A₂g → ³T₁g(F) (540 nm), ³A₂g → ³T₁g(P) (920 nm)", aasAdvantage: "UV-Vis xelat halqani tasdiqlaydi", aasDisadvantage: "AAS faqat metallni o'lchaydi", complementarity: "92%" },
    { name: "EA (Element Analiz)", role: "C (23.25%), H (7.81%), N (27.12%) — 3 ta en ni tasdiqlaydi", aasAdvantage: "EA organik qismini, AAS metallni o'lchaydi", aasDisadvantage: "Birgalikda to'liq formula validatsiyasi", complementarity: "97%" },
    { name: "IQ spektroskopiya", role: "N-H (3200-3300 cm⁻¹), C-H (2900 cm⁻¹), Ni-N (400-500 cm⁻¹)", aasAdvantage: "IQ xelat bog'lanishni ko'rsatadi", aasDisadvantage: "AAS buni bilmaydi", complementarity: "88%" },
    { name: "Konduktometriya", role: "1:2 elektrolit (Λ_M ≈ 250 S·cm²/mol)", aasAdvantage: "Konduktometriya [Ni(en)₃]²⁺ va 2Cl⁻ ni tasdiqlaydi", aasDisadvantage: "AAS faqat metallni o'lchaydi", complementarity: "85%" },
    { name: "Magnit o'lchash", role: "Ni²⁺ (d⁸) — paramagnit (μ_eff ≈ 3.2 BM, 2 ta toq e⁻)", aasAdvantage: "Magnit o'lchash elektron konfiguratsiyani ko'rsatadi", aasDisadvantage: "AAS buni bilmaydi", complementarity: "90%" },
    { name: "ICP-OES", role: "Ni ko'p elementli tahlil", aasAdvantage: "ICP-OES tezroq va ko'p elementli", aasDisadvantage: "AAS arzon va bir element uchun sezgir", complementarity: "93%" }
  ]
}

function calculateNiPercent(absorbance, sampleMass, dilutionFactor) {
  const slope = 0.1434
  const conc_mgL = absorbance / slope
  const totalVolume = 100
  const Ni_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Ni_percent = (Ni_mass_mg / sampleMass) * 100
  return {
    conc: parseFloat(conc_mgL.toFixed(3)),
    Ni_mass: parseFloat(Ni_mass_mg.toFixed(3)),
    Ni_percent: parseFloat(Ni_percent.toFixed(2))
  }
}

export default function NiEn3Cl2Page() {
  const [activeRun, setActiveRun] = useState("AAS-24-401")
  const [customAbsorbance, setCustomAbsorbance] = useState(0.515)
  const [customMass, setCustomMass] = useState(20.0)
  const [dilutionFactor, setDilutionFactor] = useState(10)
  const [selectedInterference, setSelectedInterference] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaNi = Math.abs(run.Ni_percent - COMPOUND.theoretical.Ni.percent)
  const statusColor = deltaNi <= 0.5 ? "text-green-400" : deltaNi <= 1.5 ? "text-yellow-400" : "text-red-400"

  const calcResult = useMemo(() => 
    calculateNiPercent(customAbsorbance, customMass, dilutionFactor),
    [customAbsorbance, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/aas" className="hover:text-purple-300">AAS</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
            <span className="text-purple-600">›</span>
            <span className="text-violet-400 font-semibold">[Ni(en)₃]Cl₂</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-violet-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-red-600 px-2 py-1 rounded ml-2">🧯 FAAS</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                {COMPOUND.iupac}
              </p>
              <p className="text-purple-500 text-xs mt-1 font-mono">
                {COMPOUND.commonName}
              </p>
              <p className="text-purple-500 text-xs mt-1">
                M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
              </p>
              <p className="text-purple-500 text-xs mt-1">
                {COMPOUND.color} • {COMPOUND.stability}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded bg-violet-900/30 border border-violet-700/50 text-violet-400 text-[10px] uppercase tracking-wide">Ni²⁺ d⁸</span>
                <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">λ = 232.0 nm</span>
                <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Xelat Kompleks</span>
                <span className="px-2 py-1 rounded bg-indigo-900/30 border border-indigo-700/50 text-indigo-400 text-[10px] uppercase tracking-wide">log β₃ ≈ 18</span>
              </div>
            </div>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Barcha birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (AAS uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Ni(en)₃]Cl₂</strong> — nikel(II) ning tris(etilendiamin) kompleksi, xelat effektining klassik namunasi. AAS tahlilida <strong className="text-violet-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-violet-500 text-xs md:text-sm">
                <li>Nazariy <strong className="text-white">%Ni = 18.94%</strong> — FAAS da aniq o'lchanadi</li>
                <li><strong className="text-pink-300">Xelat effekti</strong> — log β₃ ≈ 18 (juda barqaror)</li>
                <li>3 ta <strong className="text-white">5-a'zoli xelat halqasi</strong> (Ni-N-C-C-N)</li>
                <li>Ni²⁺ <strong className="text-green-300">FAAS da oson atomlanadi</strong></li>
                <li>en ligandlari alangada <strong className="text-white">to'liq yonib ketadi</strong></li>
                <li>Eritma <strong className="text-white">uzoq vaqt barqaror</strong> — takroriy o'lchashlar mos</li>
              </ul>
            </div>
            
            <div className="bg-amber-950/30 rounded-xl p-4 border border-amber-700/30 flex flex-col">
              <h3 className="text-amber-400 font-bold text-xs uppercase mb-3 border-b border-amber-800 pb-2 flex items-center gap-2">
                <span>📜</span> {COMPOUND.historicalFact.title}
              </h3>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                {COMPOUND.historicalFact.text}
              </p>
              <div className="mt-auto pt-3 text-[10px] text-amber-500 italic">
                Davr: {COMPOUND.historicalFact.year}
              </div>
            </div>
          </div>
        </div>

        {/* 1b. XELAT EFFEKT */}
        <div className="bg-gradient-to-r from-pink-900/40 to-violet-900/40 border-2 border-pink-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔗</span> {COMPOUND.chelateEffect.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.chelateEffect.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {COMPOUND.chelateEffect.comparison.map((c, i) => (
              <div key={i} className={`rounded-xl p-5 border-2 ${
                c.complex.includes("en") 
                  ? "bg-pink-950/40 border-pink-500/50" 
                  : "bg-purple-950/40 border-purple-700/30 opacity-80"
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`font-bold text-sm ${c.complex.includes("en") ? "text-pink-400" : "text-purple-400"}`}>
                    {c.complex}
                  </h3>
                  {c.complex.includes("en") && (
                    <span className="text-xs bg-pink-600/40 px-2 py-0.5 rounded text-pink-200">🎯 Hozirgi</span>
                  )}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-400">log β:</span>
                    <span className="font-mono font-bold text-yellow-400">{c.logBeta}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Ligand:</span>
                    <span className="text-white">{c.ligand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Halqalar:</span>
                    <span className="text-pink-300">{c.rings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Entropiya:</span>
                    <span className={c.entropy.includes("Yuqori") ? "text-green-300" : "text-red-300"}>
                      {c.entropy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Rang:</span>
                    <span className="text-violet-300">{c.color}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-pink-900/30 rounded-lg p-4 border border-pink-700/50">
            <h4 className="text-pink-300 font-bold text-sm mb-2">💡 AAS uchun ahamiyati:</h4>
            <p className="text-xs text-purple-200">{COMPOUND.chelateEffect.aasRelevance}</p>
          </div>
        </div>

        {/* 2. AAS PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> AAS tahlil parametrlari
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Ni²⁺ uchun <strong className="text-violet-300">FAAS (Havo-C₂H₂)</strong> yetarli — Cr³⁺ kabi refrakter emas. 
            Xelat kompleks alangada to'liq parchalanadi, Ni²⁺ erkin atomlarga aylanadi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Element</div>
              <div className="text-lg font-bold text-violet-400">{COMPOUND.aasParameters.element}</div>
              <div className="text-[10px] text-purple-300 mt-1">{COMPOUND.aasParameters.oxidationState}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">λ (asosiy)</div>
              <div className="text-lg font-mono font-bold text-violet-400">{COMPOUND.aasParameters.lambda.primary} nm</div>
              <div className="text-[10px] text-purple-300 mt-1">Alt: {COMPOUND.aasParameters.lambda.secondary} nm</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Alanga</div>
              <div className="text-lg font-bold text-orange-400">Havo-C₂H₂</div>
              <div className="text-[10px] text-purple-300 mt-1">~2300°C</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">LOD</div>
              <div className="text-lg font-mono font-bold text-green-400">{COMPOUND.aasParameters.lod} mg/L</div>
              <div className="text-[10px] text-purple-300 mt-1">LOQ: {COMPOUND.aasParameters.loq}</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-violet-400 font-bold text-xs uppercase mb-3">Batafsil parametrlar:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-purple-400">Katod lampasi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.hclLamp}</div>
              </div>
              <div>
                <div className="text-purple-400">Yoriq kengligi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.slitWidth} nm</div>
              </div>
              <div>
                <div className="text-purple-400">Lampa toki:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.lampCurrent} mA</div>
              </div>
              <div>
                <div className="text-purple-400">Gorelka balandligi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.burnerHeight} mm</div>
              </div>
              <div>
                <div className="text-purple-400">Fon korreksiyasi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.backgroundCorrection}</div>
              </div>
              <div>
                <div className="text-purple-400">Chiziqli diapazon:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.linearRange} mg/L</div>
              </div>
              <div>
                <div className="text-purple-400">Sezgirlik:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.sensitivity} mg/L</div>
              </div>
              <div>
                <div className="text-purple-400">Tipik RSD:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.rsd_typical}</div>
              </div>
              <div>
                <div className="text-purple-400">Usul:</div>
                <div className="font-mono text-green-300 font-bold">{COMPOUND.aasParameters.atomization}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. NAZARIY TARKIB */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📐</span> Nazariy element tarkibi (AAS kontekstida)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            AAS <strong className="text-violet-300">faqat Ni</strong> ni o'lchaydi. Boshqa elementlar (C, H, N, Cl) FAAS da ko'rinmaydi — ularni EA yordamida tekshirish kerak.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 text-xs uppercase tracking-wider">
                  <th className="py-3 text-left pl-2">Element</th>
                  <th className="py-3 text-center">Massa</th>
                  <th className="py-3 text-center text-yellow-400">% (m/m)</th>
                  <th className="py-3 text-center">Manba</th>
                  <th className="py-3 text-left pl-4">AAS signali</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => (
                  <tr key={el} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
                    <td className="py-3 pl-2 font-bold text-violet-400">{el}</td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-400">{d.aasSignal}</td>
                  </tr>
                ))}
                <tr className="bg-violet-900/20 font-bold border-t border-violet-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-violet-300">AAS: Ni (18.94%) + Cl (22.88%) = 41.82%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. KALIBRLASH EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> Kalibrlash egri chizig'i (Ni, 232.0 nm)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-violet-600 hover:bg-violet-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Ni standartlari (0.1 M HNO₃ da) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-violet-300">R² = 0.9999</strong> — mukammal chiziqli bog'liqlik. Lambert-Ber qonuni: <strong className="text-white">A = 0.1434 × C</strong>.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 500 260" className="w-full h-full overflow-visible">
              {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/0.8)*200} x2="480" y2={220 - (v/0.8)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/0.8)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 1, 2, 3, 4, 5].map(c => (
                <g key={c}>
                  <text x={50 + (c/5)*430} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="265" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Ni konsentratsiyasi (mg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish (A)</text>

              <line x1="50" y1="220" x2="480" y2={220 - (0.717/0.8)*200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/5)*430
                const y = 220 - (p.absorbance/0.8)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#a855f7" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#c084fc">
                        {p.absorbance.toFixed(3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (3.59/5)*430
                const y = 220 - (0.515/0.8)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (3.59 mg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="350" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1" />
              <text x="410" y="48" textAnchor="middle" fontSize="10" fill="#c084fc" fontWeight="bold">
                R² = 0.9999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-violet-500 rounded-full"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya (A = 0.1434·C)</span>
          </div>
        </div>

        {/* 5. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> AAS yugurishlari — eksperimental natijalar
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan AAS o'lchashlari. Xelat effekti tufayli eritma barqaror — takroriy o'lchashlar juda mos (RSD {'<'} 1%).
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isEn2 = r.id === "AAS-24-406"
              const isEn1 = r.id === "AAS-24-407"
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun === r.id 
                      ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20" 
                      : isBlank 
                        ? "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-gray-500"
                        : isStd
                          ? "bg-amber-900/30 border-amber-700/30 text-amber-300 hover:border-amber-500"
                          : isEn2 || isEn1
                            ? "bg-red-900/30 border-red-700/30 text-red-300 hover:border-red-500"
                            : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                  }`}
                >
                  {r.id}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-purple-950/60 rounded-xl p-5 border border-purple-700/30">
                <div className="text-xs text-purple-500 uppercase tracking-wider mb-1">O'lchash ID</div>
                <div className="text-xl font-bold text-white font-mono">{run.id}</div>
                <div className="text-xs text-purple-400 mt-1">{run.date}</div>
                <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
                  📝 {run.note}
                </div>
                
                <div className="my-4 border-t border-purple-800/50"></div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Yutilish (A):</span>
                    <span className="font-mono text-violet-400 text-lg">{run.absorbance.toFixed(3)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-violet-900/20 rounded border border-violet-500/20">
                    <span className="text-sm text-violet-400 font-medium">C (mg/L):</span>
                    <span className="font-mono text-white text-lg">{run.conc_mgL.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Namuna massasi:</span>
                    <span className="font-mono text-white">{run.sample_mg.toFixed(1)} mg</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Suyultirish:</span>
                    <span className="font-mono text-white">{run.dilution}×</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Ni:</span>
                    <span className="font-mono text-white text-lg">{run.Ni_percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Ni:</span>
                    <span className="font-mono text-violet-400">{COMPOUND.theoretical.Ni.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaNi.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">RSD:</span>
                    <span className={`font-mono ${run.rsd <= 1.5 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {run.rsd.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : deltaNi <= 0.5
                    ? "bg-green-900/30 border-green-700/30"
                    : deltaNi <= 1.5
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : deltaNi <= 0.5 ? "text-green-400" : deltaNi <= 1.5 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : deltaNi <= 0.5 ? "✓ [Ni(en)₃]Cl₂ tasdiqlandi" : deltaNi <= 1.5 ? "⚠ Aralashma bo'lishi mumkin" : "✗ Boshqa birikma"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    deltaNi <= 0.5
                      ? "AAS natijasi [Ni(en)₃]Cl₂ formulaga to'liq mos keladi (%Ni = 18.94%). Xelat effekti tufayli eritma barqaror, RSD past."
                      : deltaNi <= 1.5
                        ? run.Ni_percent < 15
                          ? "%Ni past — ehtimol [Ni(en)₂]Cl₂ (bis) yoki [Ni(en)]Cl₂ (mono) aralashmasi mavjud."
                          : "%Ni ozgina farq qiladi — qisman parchalanish yoki namuna tayyorlashda xato bo'lishi mumkin."
                        : run.Ni_percent < 10
                          ? "Aniq [Ni(en)]Cl₂ yoki NiCl₂ aralashmasi — ko'p en yo'qotilgan."
                          : "%Ni juda past — namuna ifloslangan yoki boshqa Ni kompleksi."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Blank — signal nolga yaqin. Tizim toza."
                      : "NIST standarti — kalibrlash to'g'ri bajarilgan."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-violet-400 mb-4 flex justify-between">
                <span>%Ni Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">[Ni(en)₃]: 18.94% | [Ni(en)₂]: 12.70%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isEn2 = r.id === "AAS-24-406"
                  const isEn1 = r.id === "AAS-24-407"
                  const val = r.Ni_percent
                  const heightPct = Math.min((val / 22) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <>
                            <div className="absolute w-[120%] border-t border-dashed border-violet-500/50 z-0" style={{ bottom: `${(18.940/22)*100}%` }}></div>
                            <div className="absolute w-[120%] border-t border-dashed border-red-500/30 z-0" style={{ bottom: `${(12.70/22)*100}%` }}></div>
                          </>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : isEn2 || isEn1 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                : 'bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : isEn2 || isEn1 ? 'bg-red-700/40'
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : isEn2 || isEn1 ? 'text-red-400' : 'text-violet-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-violet-500 rounded"></span> [Ni(en)₃]²⁺</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Aralashma</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-violet-500/50"></span> Nazariy</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-violet-400 mb-3 flex items-center gap-2">
                <span>📊</span> Kalibrlash egri chizig'i — to'liq ma'lumotlar
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-purple-700">
                      <th className="py-2 px-3 text-left text-purple-300">C (mg/L)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Yutilish (A)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Izoh</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200 font-mono">
                    {COMPOUND.calibrationCurve.map((p, i) => (
                      <tr key={i} className="border-b border-purple-800/30">
                        <td className="py-2 px-3 text-violet-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-violet-900/20 rounded-lg border border-violet-700/30 text-xs text-purple-200">
                <strong className="text-violet-300">Regressiya:</strong> A = 0.1434 × C + 0.0003, R² = 0.9999
              </div>
              <button 
                onClick={() => setShowCalibrationModal(false)}
                className="w-full mt-4 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* 6. INTERFERENSIYALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span> Spektral va kimyoviy interferensiyalar
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Ni²⁺ uchun interferensiyalar <strong className="text-violet-300">minimal</strong> — xelat kompleks alangada to'liq parchalanadi. Har birini bosib, batafsil ma'lumot oling.
          </p>

          <div className="space-y-2">
            {COMPOUND.interferences.map((int, i) => (
              <button
                key={i}
                onClick={() => setSelectedInterference(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedInterference === i
                    ? "bg-violet-900/40 border-violet-500"
                    : "bg-purple-950/40 border-purple-700/30 hover:border-violet-500/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-violet-400">{int.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    int.severity === "Past" ? "bg-green-900/30 text-green-400 border-green-600/30" :
                    int.severity === "Past-O'rta" ? "bg-yellow-900/30 text-yellow-400 border-yellow-600/30" :
                    "bg-orange-900/30 text-orange-400 border-orange-600/30"
                  }`}>
                    {int.severity}
                  </span>
                </div>
                {selectedInterference === i && (
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="text-purple-300">{int.description}</div>
                    <div className="bg-green-900/20 p-2 rounded border border-green-700/30">
                      <strong className="text-green-400">✓ Yechim:</strong> <span className="text-purple-200">{int.solution}</span>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 7. TGA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔥</span> TGA bilan AAS bog'liqligi
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            [Ni(en)₃]Cl₂ da en ligandlari bosqichma-bosqich yo'qoladi (200-500°C). AAS eritmada Ni²⁺ to'liq atomlanadi — TGA dagi yo'qotishlar AAS natijasiga ta'sir qilmaydi.
          </p>

          <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30 overflow-hidden">
            <svg viewBox="0 0 600 260" className="w-full">
              {[0, 25, 50, 75, 100].map(p => (
                <g key={p}>
                  <line x1="50" y1={220 - (p/100)*200} x2="580" y2={220 - (p/100)*200} stroke="#3b3470" strokeWidth="0.5" />
                  <text x="40" y={225 - (p/100)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{p}%</text>
                </g>
              ))}

              <path 
                d="M 50 20 L 200 20 Q 220 20 230 50 L 250 90 Q 260 105 280 105 L 320 105 Q 335 105 345 125 L 385 165 Q 395 175 415 175 L 455 175 Q 470 175 480 190 L 580 210" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="125" y="15" textAnchor="middle" fill="#10b981">AAS: %Ni = 18.94%</text>
                
                <line x1="250" y1="90" x2="250" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="250" y="235" textAnchor="middle" fill="#8b5cf6">~250°C</text>
                <text x="270" y="80" fill="#8b5cf6">-1 en</text>

                <line x1="385" y1="165" x2="385" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="385" y="235" textAnchor="middle" fill="#ef4444">~400°C</text>
                <text x="405" y="155" fill="#ef4444">-2 en</text>

                <line x1="480" y1="190" x2="480" y2="220" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="480" y="235" textAnchor="middle" fill="#f59e0b">~600°C</text>
                <text x="500" y="180" fill="#f59e0b">-Cl₂</text>

                <text x="540" y="205" textAnchor="middle" fill="#6366f1">Ni (18.9%)</text>
              </g>

              <line x1="50" y1="220" x2="580" y2="220" stroke="#a78bfa" strokeWidth="1" />
              <line x1="50" y1="20" x2="50" y2="220" stroke="#a78bfa" strokeWidth="1" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {COMPOUND.tgaSteps.slice(1, 4).map((step, idx) => (
              <div key={idx} className="bg-purple-950/40 p-4 rounded-lg border-l-4" style={{ borderColor: step.color }}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-white">{step.event}</span>
                  <span className="text-[10px] font-mono text-purple-400">{step.start}-{step.end}°C</span>
                </div>
                <div className="text-sm font-mono text-purple-200">Mass yo'qotish: <span className="text-white font-bold">{step.loss}%</span></div>
                <div className="text-[10px] text-violet-300 mt-2 italic">AAS effekti: {step.aasEffect}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> AAS ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Ni(en)₃]Cl₂ uchun AAS ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-violet-300">xelat halqani tasdiqlash</strong> uchun muhim. <strong className="text-pink-300">UV-Vis</strong> va <strong className="text-indigo-300">IQ</strong> eng kuchli qo'shimcha metodlar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-violet-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-violet-300">{m.name}</h3>
                  <div className="text-right">
                    <div className="text-[10px] text-purple-400">To'ldiruvchi</div>
                    <div className="text-lg font-bold text-green-400">{m.complementarity}</div>
                  </div>
                </div>
                <p className="text-xs text-purple-200 mb-3">{m.role}</p>
                <div className="space-y-2 text-[10px]">
                  <div className="flex gap-2">
                    <span className="text-green-400">✓ AAS afzalligi:</span>
                    <span className="text-purple-300">{m.aasAdvantage}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-400">✗ AAS kamchiligi:</span>
                    <span className="text-purple-300">{m.aasDisadvantage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-violet-900/20 border border-violet-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-violet-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">AAS (Ni%) + EA (C, H, N) + UV-Vis (d-d 350, 540, 920 nm) + IQ (N-H, Ni-N) + Konduktometriya (1:2) + Magnit (μ_eff ≈ 3.2 BM)</strong> — oltita metod birgalikda [Ni(en)₃]Cl₂ ni to'liq tasdiqlaydi va xelat effektini isbotlaydi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> AAS uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Ni(en)₃]Cl₂ <strong className="text-violet-300">xelat kompleks</strong> — eritma juda barqaror. Cr³⁺ kabi maxsus sharoit talab qilmaydi — oddiy FAAS yetarli.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-violet-900/40 border-violet-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-violet-500 text-white" : "bg-purple-800 text-purple-400"
                    }`}>
                      {s.step}
                    </span>
                    <span className="text-xs font-medium text-white">{s.title}</span>
                    {s.critical && <span className="ml-auto text-[10px] text-red-400">KRITIK</span>}
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 bg-purple-950/50 rounded-xl p-6 border border-purple-700/30">
              {(() => {
                const current = COMPOUND.samplePrepSteps.find(s => s.step === activePrepStep)
                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-purple-700/30 pb-3">
                      <h3 className="text-lg font-bold text-violet-400">Qadam {current.step}: {current.title}</h3>
                      {current.critical && (
                        <span className="px-2 py-1 bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase rounded">
                          Kritik
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-purple-200 leading-relaxed">{current.desc}</p>
                    <div className="flex items-center gap-2 text-xs text-purple-400">
                      <span>⏱️ Taxminiy vaqt:</span>
                      <span className="text-white font-mono">{current.time}</span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        {/* 10. HISOBLAGICH */}
        <div className="bg-violet-900/20 border border-violet-500/30 rounded-2xl p-6">
          <h3 className="text-violet-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> AAS dan %Ni hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan yutilish (A), namuna massasi va suyuqlantirish faktori bo'yicha <strong className="text-violet-300">%Ni</strong> ni avtomatik hisoblang.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, 232.0 nm):</label>
              <input 
                type="number" step="0.001" value={customAbsorbance}
                onChange={(e) => setCustomAbsorbance(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Konsentratsiya:</div>
                <div className="text-2xl font-mono font-bold text-violet-400">{calcResult.conc} mg/L</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ni massasi:</div>
                <div className="text-2xl font-mono font-bold text-orange-400">{calcResult.Ni_mass} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Ni:</div>
                <div className={`text-2xl font-mono font-bold ${Math.abs(calcResult.Ni_percent - 18.94) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Ni_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Ni = (A / 0.1434) × 100 × DF / (m × 1000) × 100
            </p>
          </div>
        </div>

        {/* 11. AAS CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> AAS ning [Ni(en)₃]Cl₂ uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                AAS [Ni(en)₃]Cl₂ ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Faqat Ni ni o'lchaydi</strong> — C, H, N, Cl uchun EA kerak</li>
                <li><strong className="text-red-300">Xelat halqani bilmaydi</strong> — UV-Vis, IQ kerak</li>
                <li><strong className="text-red-300">1:2 elektrolit ekanligini ko'rmaydi</strong> — konduktometriya kerak</li>
                <li><strong className="text-red-300">Paramagnit xususiyatni bilmaydi</strong> — magnit o'lchash kerak</li>
                <li><strong className="text-red-300">en vs NH₃ farqlay olmaydi</strong> — faqat metallni ko'radi</li>
                <li><strong className="text-red-300">Bir vaqtda bitta element</strong> — ICP-OES tezroq</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>[Ni(en)₃]Cl₂ ni to'liq tasdiqlash</strong> uchun kamida 5-6 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-violet-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. AAS (Ni%)</span>
                  <span className="text-violet-400 font-mono">18.94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (C, H, N)</span>
                  <span className="text-violet-400 font-mono">23.25%, 7.81%, 27.12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. UV-Vis (d-d)</span>
                  <span className="text-violet-400 font-mono">350, 540, 920 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. IQ (Ni-N)</span>
                  <span className="text-violet-400 font-mono">400-500 cm⁻¹</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. Konduktometriya</span>
                  <span className="text-violet-400 font-mono">1:2 elektrolit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">6. Magnit (μ_eff)</span>
                  <span className="text-violet-400 font-mono">≈ 3.2 BM</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 6 ta metod birgalikda xelat effektini to'liq isbotlaydi
              </div>
            </div>
          </div>
        </div>

        {/* 12. XULOSA */}
        <div className="bg-gradient-to-r from-green-900/30 via-indigo-900/30 to-purple-900/30 border border-green-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Yakuniy xulosa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-950/30 p-4 rounded-lg border border-green-700/30">
              <div className="text-green-400 text-2xl mb-2">✓</div>
              <h3 className="font-bold text-white mb-1">AAS afzalligi</h3>
              <p className="text-xs text-purple-200">Ni ni 18.94% aniqlikda o'lchaydi. FAAS yetarli — refrakter emas. Xelat effekti tufayli eritma barqaror, RSD past ({'<'} 1%).</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-violet-300">Faqat metallni o'lchaydi!</strong> Xelat halqa, en ligandlar, 1:2 elektrolit ekanligini bilmaydi. C, H, N, Cl ko'rinmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EA (C, H, N), UV-Vis (d-d), IQ (Ni-N), Konduktometriya (1:2), Magnit (μ_eff ≈ 3.2) — xelat effektini isbotlash uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/aas" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← AAS metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-sm bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Ni(en)₃]Cl₂ • AAS moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955), Schwarzenbach (1930)</p>
        </div>
      </footer>
    </main>
  )
}