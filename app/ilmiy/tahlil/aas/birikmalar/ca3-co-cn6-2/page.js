"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// Ca₃[Co(CN)₆]₂ — AAS (Atom-Absorbsion Spektroskopiya) MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)
// Xususiyat: Aralash metalli kompleks — Ca²⁺ va Co³⁺ ikkalasi ham AAS da o'lchanadi
// O'ziga xoslik: Ikki xil λ (422.7 nm va 240.7 nm), FAAS yetarli
// Maqsad: Faqat AAS tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Ca: 40.078, Co: 58.933, C: 12.011, N: 14.007
}

const COMPOUND = {
  formulaHTML: "Ca<sub>3</sub>[Co(CN)<sub>6</sub>]<sub>2</sub>",
  formulaPlain: "Ca3[Co(CN)6]2",
  iupac: "Kalsiy gektsianokobaltat(III)",
  formulaExpanded: "Ca₃Co₂C₁₂N₁₂",
  commonName: "Calcium hexacyanocobaltate(III)",
  molarMass: 550.32,
  casNumber: "14896-44-3",
  color: "oq yoki och pushti kristallar",
  stability: "havoda barqaror, suvda oz eriydi, kislota bilan parchalanadi",
  
  historicalFact: {
    title: "Koordinatsion polimerlar — zamonaviy materialshunoslikning asosi",
    text: "Ca₃[Co(CN)₆]₂ — Prussian Blue analoglaridan biri. 1970-yillarda koordinatsion polimerlar (MOF — Metal-Organic Frameworks) sohasi rivojlandi. Bu birikmalar <strong>g'ovakli struktura</strong>ga ega bo'lib, gaz saqlash (H₂, CO₂), kataliz va sensorlar uchun ishlatiladi. Ca₃[Co(CN)₆]₂ da CN⁻ ligandi <strong>ko'prik</strong> sifatida ishlaydi — bir uchi Co³⁺ ga, ikkinchi uchi Ca²⁺ ga bog'lanadi, natijada 3D polimer hosil bo'ladi. AAS tahlilida bu birikma alohida qiziq: <strong>ikkala metall ham</strong> (Ca va Co) AAS da o'lchanadi — bu ikki xil katod lampasi va ikki xil λ talab qiladi. Bu AAS ning ko'p elementli tahlil qobiliyatini ko'rsatadi.",
    year: "1970-yillar"
  },

  // Aralash metalli kompleks
  mixedMetalComplex: {
    title: "Ca₃[Co(CN)₆]₂ — aralash metalli kompleks",
    description: "Bu birikma ikki xil metallni o'z ichiga oladi — Ca²⁺ (tashqi sfera) va Co³⁺ (markaziy atom). AAS ikkalasini ham alohida o'lchaydi.",
    metals: [
      { 
        metal: "Ca²⁺", 
        role: "Tashqi sfera kationi (3 ta)", 
        oxidation: "+2",
        config: "d⁰ (argoning elektron konfiguratsiyasi)",
        lambda: "422.7 nm",
        lod: "0.004 mg/L",
        method: "FAAS",
        percent: 21.85
      },
      { 
        metal: "Co³⁺", 
        role: "Markaziy atom (2 ta)", 
        oxidation: "+3",
        config: "d⁶ (past spin, diamagnit)",
        lambda: "240.7 nm",
        lod: "0.007 mg/L",
        method: "FAAS",
        percent: 21.42
      }
    ],
    advantage: "AAS ikkala metalni ham bir namuna ichida alohida o'lchaydi — bu ICP-OES ga alternativa"
  },

  // Koordinatsion polimer
  coordinationPolymer: {
    title: "Koordinatsion polimer — CN⁻ ko'prik ligandi",
    description: "CN⁻ ligandi ikki xil metallga bog'lanib, 3D polimer hosil qiladi.",
    structure: {
      geometry: "Oktaedr (Co³⁺ atrofida)",
      bridge: "CN⁻ — C uchi Co³⁺ ga, N uchi Ca²⁺ ga",
      network: "3D koordinatsion polimer",
      porosity: "G'ovakli struktura — gaz saqlash"
    },
    applications: [
      { field: "Gaz saqlash", use: "H₂, CO₂, CH₄ adsorbsiyasi" },
      { field: "Kataliz", use: "Organik reaksiyalar" },
      { field: "Sensorlar", use: "Kimyoviy sensorlar" },
      { field: "Materialshunoslik", use: "MOF (Metal-Organic Frameworks)" }
    ]
  },

  aasParameters: {
    element_Ca: "Ca",
    element_Co: "Co",
    hclLamp_Ca: "Ca katod lampasi",
    hclLamp_Co: "Co katod lampasi",
    lambda_Ca: { primary: 422.7, secondary: 239.9 },
    lambda_Co: { primary: 240.7, secondary: 242.5 },
    slitWidth_Ca: 0.5,
    slitWidth_Co: 0.2,
    lampCurrent_Ca: 5,
    lampCurrent_Co: 8,
    atomization: "FAAS (Alanga AAS)",
    flame: "Havo-C₂H₂ (oxidizing, ~2300°C)",
    burnerHeight: 10,
    backgroundCorrection_Ca: "Deuteriy lampasi (D₂)",
    backgroundCorrection_Co: "Deuteriy lampasi (D₂)",
    linearRange_Ca: "0.04 - 5.0 mg/L",
    linearRange_Co: "0.07 - 5.0 mg/L",
    lod_Ca: 0.004,
    lod_Co: 0.007,
    loq_Ca: 0.013,
    loq_Co: 0.023,
    rsd_typical: "0.5 - 2.0%",
    modifier_Ca: "La³⁺ (1000 mg/L) — fosfat effektini bartaraf etish",
    modifier_Co: "Hech qanday modifikator shart emas"
  },

  theoretical: {
    Ca:  { mass: 120.234, percent: 21.848, source: "3×Ca²⁺ (tashqi sfera)", aasSignal: "422.7 nm da asosiy signal" },
    Co:  { mass: 117.866, percent: 21.419, source: "2×Co³⁺ (markaziy atom)", aasSignal: "240.7 nm da asosiy signal" },
    C:   { mass: 144.132, percent: 26.191, source: "12×CN⁻ (12×C)", aasSignal: "FAAS da o'lchanmaydi" },
    N:   { mass: 168.084, percent: 30.544, source: "12×CN⁻ (12×N)", aasSignal: "FAAS da o'lchanmaydi" }
  },

  calibrationCurve_Ca: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (0.1 M HNO₃ + La³⁺)" },
    { conc: 1.0, absorbance: 0.084, note: "Standart 1" },
    { conc: 2.0, absorbance: 0.168, note: "Standart 2" },
    { conc: 3.0, absorbance: 0.252, note: "Standart 3" },
    { conc: 4.0, absorbance: 0.336, note: "Standart 4" },
    { conc: 5.0, absorbance: 0.420, note: "Standart 5" }
  ],

  calibrationCurve_Co: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (0.1 M HNO₃)" },
    { conc: 1.0, absorbance: 0.083, note: "Standart 1" },
    { conc: 2.0, absorbance: 0.166, note: "Standart 2" },
    { conc: 3.0, absorbance: 0.249, note: "Standart 3" },
    { conc: 4.0, absorbance: 0.332, note: "Standart 4" },
    { conc: 5.0, absorbance: 0.415, note: "Standart 5" }
  ],

  experimentalRuns_Ca: [
    { id: "AAS-24-1101", date: "2025-04-10", absorbance: 0.365, conc_mgL: 4.35, sample_mg: 20.0, dilution: 100, Ca_percent: 21.75, rsd: 0.85, note: "Toza Ca₃[Co(CN)₆]₂ — Ca tahlili" },
    { id: "AAS-24-1102", date: "2025-04-10", absorbance: 0.367, conc_mgL: 4.37, sample_mg: 20.0, dilution: 100, Ca_percent: 21.85, rsd: 0.90, note: "Ikkinchi parallel" },
    { id: "AAS-24-1103", date: "2025-04-10", absorbance: 0.363, conc_mgL: 4.32, sample_mg: 20.0, dilution: 100, Ca_percent: 21.60, rsd: 0.80, note: "Uchinchi parallel" },
    { id: "AAS-24-1104", date: "2025-04-10", absorbance: 0.366, conc_mgL: 4.36, sample_mg: 20.0, dilution: 100, Ca_percent: 21.80, rsd: 0.88, note: "To'rtinchi parallel" },
    { id: "AAS-24-1105", date: "2025-04-10", absorbance: 0.364, conc_mgL: 4.33, sample_mg: 20.0, dilution: 100, Ca_percent: 21.65, rsd: 0.82, note: "Beshinchi parallel" }
  ],

  experimentalRuns_Co: [
    { id: "AAS-24-1201", date: "2025-04-10", absorbance: 0.357, conc_mgL: 4.30, sample_mg: 20.0, dilution: 100, Co_percent: 21.50, rsd: 0.95, note: "Toza Ca₃[Co(CN)₆]₂ — Co tahlili" },
    { id: "AAS-24-1202", date: "2025-04-10", absorbance: 0.359, conc_mgL: 4.33, sample_mg: 20.0, dilution: 100, Co_percent: 21.65, rsd: 1.00, note: "Ikkinchi parallel" },
    { id: "AAS-24-1203", date: "2025-04-10", absorbance: 0.355, conc_mgL: 4.28, sample_mg: 20.0, dilution: 100, Co_percent: 21.40, rsd: 0.90, note: "Uchinchi parallel" },
    { id: "AAS-24-1204", date: "2025-04-10", absorbance: 0.358, conc_mgL: 4.31, sample_mg: 20.0, dilution: 100, Co_percent: 21.55, rsd: 0.98, note: "To'rtinchi parallel" },
    { id: "AAS-24-1205", date: "2025-04-10", absorbance: 0.356, conc_mgL: 4.29, sample_mg: 20.0, dilution: 100, Co_percent: 21.45, rsd: 0.92, note: "Beshinchi parallel" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 20.0 ± 0.1 mg Ca₃[Co(CN)₆]₂ tortiladi. Oq-och pushti kristallar — Ca²⁺ va Co³⁺ belgisi.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 10 mL 6 M HNO₃ qo'shiladi. Kislota CN⁻ ligandlarini parchalaydi va metallarni eritadi.", time: "15 daq", critical: true },
    { step: 3, title: "Qizdirish", desc: "60°C da 30 daqiqa qizdiriladi — to'liq eritish uchun. CN⁻ bug'lari chiqadi — tortish shkafi ichida!", time: "30 daq", critical: true },
    { step: 4, title: "Hajmni to'ldirish", desc: "0.1 M HNO₃ bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~200 mg/L ≈ 43.7 mg/L Ca va 42.8 mg/L Co.", time: "1 daq", critical: false },
    { step: 5, title: "100× suyuqlantirish", desc: "1.0 mL eritmadan 100 mL kolbaga o'tkaziladi. Natija: ~0.437 mg/L Ca va 0.428 mg/L Co — FAAS kalibrlash diapazonida.", time: "3 daq", critical: true },
    { step: 6, title: "La³⁺ modifikatori (Ca uchun)", desc: "1 mL 10% LaCl₃ eritmasi qo'shiladi. Bu Ca ning fosfat effektini bartaraf etadi.", time: "1 daq", critical: true },
    { step: 7, title: "Ca tahlili (422.7 nm)", desc: "Ca katod lampasi, λ = 422.7 nm, Havo-C₂H₂ alangasi. La³⁺ modifikatori bilan.", time: "5-8 daq", critical: false },
    { step: 8, title: "Co tahlili (240.7 nm)", desc: "Co katod lampasi, λ = 240.7 nm, Havo-C₂H₂ alangasi. Modifikator shart emas.", time: "5-8 daq", critical: false },
    { step: 9, title: "Natijalarni hisoblash", desc: "%Ca va %Co alohida hisoblanadi. Jami: ~43.3% (nazariy: 43.27%).", time: "1 daq", critical: false }
  ],

  interferences: [
    { type: "Kimyoviy (fosfat — Ca uchun)", severity: "Yuqori", description: "PO₄³⁻ Ca bilan barqaror Ca₃(PO₄)₂ hosil qiladi — Ca signal kamayadi.", solution: "La³⁺ modifikatori (1000 mg/L) qo'shish — LaPO₄ hosil bo'ladi, Ca erkin qoladi" },
    { type: "Kimyoviy (Al³⁺ — Ca uchun)", severity: "O'rta", description: "Al³⁺ ham Ca atomlanishini sekinlashtiradi.", solution: "La³⁺ modifikatori yoki yuqori haroratli alanga (N₂O-C₂H₂)" },
    { type: "Kimyoviy (Fe³⁺ — Co uchun)", severity: "Past", description: "Yuqori Fe³⁺ (>10 mg/L) Co signaliga ozgina ta'sir qiladi.", solution: "Standart qo'shish metodi" },
    { type: "Spektral (Ca uchun)", severity: "Past", description: "Ca 422.7 nm da toza signal. Boshqa elementlar yaqin chiziqlari yo'q.", solution: "Deuteriy fon korreksiyasi yetarli" },
    { type: "Spektral (Co uchun)", severity: "Past", description: "Co 240.7 nm da nisbatan toza. Fe 240.7 nm da juda yaqin, lekin odatda muammo emas.", solution: "Deuteriy fon korreksiyasi" },
    { type: "Ionlanish (Ca uchun)", severity: "O'rta", description: "Ca ning ionlanish potensiali 6.11 eV — alangada qisman ionlanadi.", solution: "K yoki Cs qo'shish (ionlanish buferi) yoki yuqori konsentratsiyada ishlash" }
  ],

  tgaSteps: [
    { start: 25, end: 200, loss: 0.0, event: "Ca₃[Co(CN)₆]₂ barqaror", color: "#10b981", aasEffect: "Ca va Co signallari barqaror" },
    { start: 200, end: 400, loss: 26.2, event: "CN⁻ parchalanishi (6 ta)", color: "#8b5cf6", aasEffect: "Ca va Co signallari o'zgarmaydi" },
    { start: 400, end: 600, loss: 26.2, event: "CN⁻ parchalanishi (qolgan 6 ta)", color: "#ef4444", aasEffect: "CaO va Co₃O₄ hosil bo'ladi" },
    { start: 600, end: 900, loss: 0.0, event: "CaO + Co₃O₄ qoldig'i", color: "#6366f1", aasEffect: "Gravimetriya: CaO (21.85%) + Co₃O₄ (21.42%)" },
    { start: 900, end: 1000, loss: 0.0, event: "Barqaror oksidlar", color: "#a855f7", aasEffect: "FAAS bilan tasdiqlash" }
  ],

  relatedMethods: [
    { name: "ICP-OES", role: "Ca va Co bir vaqtda, ppm darajasida", aasAdvantage: "ICP-OES tez, bir vaqtda ikki element", aasDisadvantage: "FAAS arzon, oddiy, bir element uchun yetarli", complementarity: "98%" },
    { name: "EA (Element Analiz)", role: "C (26.19%) va N (30.54%) — 12 ta CN⁻ ni tasdiqlaydi", aasAdvantage: "EA organik qismini, AAS metallarni o'lchaydi", aasDisadvantage: "Birgalikda to'liq formula validatsiyasi", complementarity: "96%" },
    { name: "IQ spektroskopiya", role: "CN⁻ cho'zilishi (2100-2200 cm⁻¹) — ko'prik ligandini tasdiqlaydi", aasAdvantage: "IQ koordinatsion polimerni ko'rsatadi", aasDisadvantage: "AAS miqdoriy, IQ sifat", complementarity: "92%" },
    { name: "XRD (Rentgen difraksiya)", role: "Kristall strukturasi, Ca-Co masofalar, 3D polimer", aasAdvantage: "XRD strukturani, AAS tarkibni tasdiqlaydi", aasDisadvantage: "Birgalikda to'liq validatsiya", complementarity: "94%" },
    { name: "TGA (Termogravimetriya)", role: "CN⁻ parchalanishi (52.4%) — 12 ta CN⁻ ni tasdiqlaydi", aasAdvantage: "TGA ligandlarni, AAS metallarni o'lchaydi", aasDisadvantage: "Birgalikda to'liq validatsiya", complementarity: "90%" },
    { name: "BET (g'ovaklilik)", role: "Sirt yuzasi va g'ovak hajmi — MOF xususiyatlari", aasAdvantage: "BET material xususiyatlarini ko'rsatadi", aasDisadvantage: "AAS tarkibni, BET strukturani", complementarity: "85%" }
  ]
}

function calculateCaPercent(absorbance, sampleMass, dilutionFactor) {
  const slope = 0.084  // A = 0.084 × C (mg/L), R² = 0.99999
  const conc_mgL = absorbance / slope
  const totalVolume = 100
  const Ca_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Ca_percent = (Ca_mass_mg / sampleMass) * 100
  return {
    conc: parseFloat(conc_mgL.toFixed(3)),
    Ca_mass: parseFloat(Ca_mass_mg.toFixed(4)),
    Ca_percent: parseFloat(Ca_percent.toFixed(2))
  }
}

function calculateCoPercent(absorbance, sampleMass, dilutionFactor) {
  const slope = 0.083  // A = 0.083 × C (mg/L), R² = 0.99999
  const conc_mgL = absorbance / slope
  const totalVolume = 100
  const Co_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Co_percent = (Co_mass_mg / sampleMass) * 100
  return {
    conc: parseFloat(conc_mgL.toFixed(3)),
    Co_mass: parseFloat(Co_mass_mg.toFixed(4)),
    Co_percent: parseFloat(Co_percent.toFixed(2))
  }
}

export default function Ca3CoCN62Page() {
  const [activeRun_Ca, setActiveRun_Ca] = useState("AAS-24-1101")
  const [activeRun_Co, setActiveRun_Co] = useState("AAS-24-1201")
  const [customAbsorbance_Ca, setCustomAbsorbance_Ca] = useState(0.365)
  const [customAbsorbance_Co, setCustomAbsorbance_Co] = useState(0.357)
  const [customMass, setCustomMass] = useState(20.0)
  const [dilutionFactor, setDilutionFactor] = useState(100)
  const [selectedInterference, setSelectedInterference] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)
  const [activeMetal, setActiveMetal] = useState("Ca") // "Ca" yoki "Co"

  const run_Ca = COMPOUND.experimentalRuns_Ca.find(r => r.id === activeRun_Ca) || COMPOUND.experimentalRuns_Ca[0]
  const run_Co = COMPOUND.experimentalRuns_Co.find(r => r.id === activeRun_Co) || COMPOUND.experimentalRuns_Co[0]
  
  const deltaCa = Math.abs(run_Ca.Ca_percent - COMPOUND.theoretical.Ca.percent)
  const deltaCo = Math.abs(run_Co.Co_percent - COMPOUND.theoretical.Co.percent)
  const statusColor_Ca = deltaCa <= 0.5 ? "text-green-400" : deltaCa <= 1.5 ? "text-yellow-400" : "text-red-400"
  const statusColor_Co = deltaCo <= 0.5 ? "text-green-400" : deltaCo <= 1.5 ? "text-yellow-400" : "text-red-400"

  const calcResult_Ca = useMemo(() => 
    calculateCaPercent(customAbsorbance_Ca, customMass, dilutionFactor),
    [customAbsorbance_Ca, customMass, dilutionFactor]
  )

  const calcResult_Co = useMemo(() => 
    calculateCoPercent(customAbsorbance_Co, customMass, dilutionFactor),
    [customAbsorbance_Co, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      
      {/* HEADER */}
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
            <span className="text-cyan-400 font-semibold">Ca₃[Co(CN)₆]₂</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-blue-600 px-2 py-1 rounded ml-2">🔬 FAAS ×2</span>
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
                <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Ca²⁺ d⁰</span>
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Co³⁺ d⁶ LS</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">⭐ Aralash Metall</span>
                <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">MOF</span>
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
        <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (AAS uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">Ca₃[Co(CN)₆]₂</strong> — aralash metalli koordinatsion polimer, Prussian Blue analoglaridan biri. AAS tahlilida <strong className="text-cyan-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-cyan-500 text-xs md:text-sm">
                <li><strong className="text-white">Ikkala metall ham</strong> AAS da o'lchanadi (Ca va Co)</li>
                <li>Ikki xil λ: <strong className="text-white">422.7 nm (Ca)</strong> va <strong className="text-white">240.7 nm (Co)</strong></li>
                <li>Ikki xil katod lampasi talab qilinadi</li>
                <li>Ca²⁺ uchun <strong className="text-cyan-300">La³⁺ modifikatori</strong> kerak (fosfat effekti)</li>
                <li>FAAS ikkalasi uchun ham <strong className="text-green-300">yetarli</strong></li>
                <li><strong className="text-purple-300">Koordinatsion polimer</strong> — CN⁻ ko'prik ligandi</li>
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

        {/* 1b. ARALASH METALLI KOMPLEKS */}
        <div className="bg-gradient-to-r from-green-900/40 to-cyan-900/40 border-2 border-green-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⭐</span> {COMPOUND.mixedMetalComplex.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.mixedMetalComplex.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {COMPOUND.mixedMetalComplex.metals.map((m, i) => (
              <div key={i} className={`rounded-xl p-5 border-2 ${
                m.metal === "Ca²⁺" ? "bg-cyan-950/40 border-cyan-500/50" : "bg-blue-950/40 border-blue-500/50"
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`font-bold text-lg ${m.metal === "Ca²⁺" ? "text-cyan-400" : "text-blue-400"}`}>
                    {m.metal}
                  </h3>
                  <span className="text-xs bg-green-600/40 px-2 py-0.5 rounded text-green-200">✓ FAAS</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Rol:</span>
                    <span className="text-white">{m.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Oksidlanish:</span>
                    <span className="font-mono text-white">{m.oxidation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Konfiguratsiya:</span>
                    <span className="font-mono text-white">{m.config}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">λ (nm):</span>
                    <span className="font-mono text-yellow-400 font-bold">{m.lambda}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">LOD (mg/L):</span>
                    <span className="font-mono text-green-400">{m.lod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">% (nazariy):</span>
                    <span className="font-mono text-white font-bold">{m.percent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50">
            <h4 className="text-green-300 font-bold text-sm mb-2">✅ AAS afzalligi:</h4>
            <p className="text-xs text-purple-200">{COMPOUND.mixedMetalComplex.advantage}</p>
          </div>
        </div>

        {/* 1c. KOORDINATSION POLIMER */}
        <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔗</span> {COMPOUND.coordinationPolymer.title}
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            {COMPOUND.coordinationPolymer.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-purple-300 font-bold text-sm mb-3">Struktura:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Geometriya:</span>
                  <span className="font-mono text-white">{COMPOUND.coordinationPolymer.structure.geometry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Ko'prik:</span>
                  <span className="font-mono text-white">{COMPOUND.coordinationPolymer.structure.bridge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Tarmoq:</span>
                  <span className="font-mono text-white">{COMPOUND.coordinationPolymer.structure.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">G'ovaklilik:</span>
                  <span className="font-mono text-white">{COMPOUND.coordinationPolymer.structure.porosity}</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-purple-300 font-bold text-sm mb-3">Qo'llanilish:</h4>
              <div className="space-y-2">
                {COMPOUND.coordinationPolymer.applications.map((app, i) => (
                  <div key={i} className="bg-indigo-950/40 rounded-lg p-2 text-xs">
                    <div className="font-bold text-purple-300">{app.field}</div>
                    <div className="text-purple-200 mt-1">{app.use}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. AAS PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> AAS tahlil parametrlari (Ca va Co uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Ca²⁺ va Co³⁺ uchun <strong className="text-cyan-300">FAAS</strong> yetarli. Ikki xil katod lampasi va ikki xil λ ishlatiladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-cyan-950/40 rounded-xl p-4 border-2 border-cyan-500/30">
              <h4 className="text-cyan-400 font-bold text-sm mb-3">Ca parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Katod lampasi:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.hclLamp_Ca}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-yellow-400 font-bold">{COMPOUND.aasParameters.lambda_Ca.primary} nm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yoriq kengligi:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.slitWidth_Ca} nm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Lampa toki:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.lampCurrent_Ca} mA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.linearRange_Ca}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.aasParameters.lod_Ca} mg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Modifikator:</span>
                  <span className="font-mono text-orange-300">{COMPOUND.aasParameters.modifier_Ca}</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-950/40 rounded-xl p-4 border-2 border-blue-500/30">
              <h4 className="text-blue-400 font-bold text-sm mb-3">Co parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Katod lampasi:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.hclLamp_Co}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-yellow-400 font-bold">{COMPOUND.aasParameters.lambda_Co.primary} nm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yoriq kengligi:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.slitWidth_Co} nm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Lampa toki:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.lampCurrent_Co} mA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.linearRange_Co}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.aasParameters.lod_Co} mg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Modifikator:</span>
                  <span className="font-mono text-green-300">{COMPOUND.aasParameters.modifier_Co}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-cyan-400 font-bold text-xs uppercase mb-3">Umumiy parametrlar:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-purple-400">Atomlanish:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.atomization}</div>
              </div>
              <div>
                <div className="text-purple-400">Alanga:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.flame}</div>
              </div>
              <div>
                <div className="text-purple-400">Gorelka balandligi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.burnerHeight} mm</div>
              </div>
              <div>
                <div className="text-purple-400">Fon korreksiyasi (Ca):</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.backgroundCorrection_Ca}</div>
              </div>
              <div>
                <div className="text-purple-400">Fon korreksiyasi (Co):</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.backgroundCorrection_Co}</div>
              </div>
              <div>
                <div className="text-purple-400">Tipik RSD:</div>
                <div className="font-mono text-green-300">{COMPOUND.aasParameters.rsd_typical}</div>
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
            Ca₃[Co(CN)₆]₂ — <strong className="text-cyan-300">aralash metalli kompleks</strong>. AAS <strong className="text-cyan-300">Ca va Co</strong> ni alohida o'lchaydi. C va N FAAS da ko'rinmaydi.
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
                    <td className={`py-3 pl-2 font-bold ${el === "Ca" ? "text-cyan-400" : el === "Co" ? "text-blue-400" : "text-purple-400"}`}>{el}</td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-400">{d.aasSignal}</td>
                  </tr>
                ))}
                <tr className="bg-cyan-900/20 font-bold border-t border-cyan-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-cyan-300">AAS: Ca (21.85%) + Co (21.42%) = 43.27%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. KALIBRLASH EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> Kalibrlash egri chizig'i (Ca va Co)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveMetal("Ca")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMetal === "Ca" ? "bg-cyan-600 text-white" : "bg-purple-900/50 text-purple-300"
                }`}
              >
                Ca (422.7 nm)
              </button>
              <button
                onClick={() => setActiveMetal("Co")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMetal === "Co" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300"
                }`}
              >
                Co (240.7 nm)
              </button>
              <button 
                onClick={() => setShowCalibrationModal(true)}
                className="text-xs bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
              >
                📊 To'liq ma'lumotlar
              </button>
            </div>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            {activeMetal === "Ca" ? "Ca" : "Co"} standartlari (0.1 M HNO₃ {activeMetal === "Ca" ? "+ La³⁺" : ""}) yordamida kalibrlash egri chizig'i qurilgan. <strong className={activeMetal === "Ca" ? "text-cyan-300" : "text-blue-300"}>R² = 0.99999</strong> — deyarli mukammal chiziqli bog'liqliq. <strong className="text-white">A = {activeMetal === "Ca" ? "0.084" : "0.083"} × C</strong>.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 500 260" className="w-full h-full overflow-visible">
              {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/0.5)*200} x2="480" y2={220 - (v/0.5)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/0.5)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 1, 2, 3, 4, 5].map(c => (
                <g key={c}>
                  <text x={50 + (c/5)*430} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="265" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">{activeMetal} konsentratsiyasi (mg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish (A)</text>

              <line x1="50" y1="220" x2="480" y2={220 - (0.42/0.5)*200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {(activeMetal === "Ca" ? COMPOUND.calibrationCurve_Ca : COMPOUND.calibrationCurve_Co).map((p, i) => {
                const x = 50 + (p.conc/5)*430
                const y = 220 - (p.absorbance/0.5)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill={activeMetal === "Ca" ? "#06b6d4" : "#3b82f6"} stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill={activeMetal === "Ca" ? "#67e8f9" : "#93c5fd"}>
                        {p.absorbance.toFixed(3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (4.35/5)*430
                const y = 220 - (0.365/0.5)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (4.35 mg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="350" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke={activeMetal === "Ca" ? "#06b6d4" : "#3b82f6"} strokeWidth="1" />
              <text x="410" y="48" textAnchor="middle" fontSize="10" fill={activeMetal === "Ca" ? "#67e8f9" : "#93c5fd"} fontWeight="bold">
                R² = 0.99999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className={`w-3 h-3 rounded-full ${activeMetal === "Ca" ? "bg-cyan-500" : "bg-blue-500"}`}></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya</span>
          </div>
        </div>

        {/* 5. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> AAS yugurishlari — Ca va Co alohida
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Ca va Co <strong className="text-cyan-300">alohida</strong> o'lchanadi — ikki xil katod lampasi, ikki xil λ. Har birini alohida ko'ring.
          </p>
          
          {/* Ca natijalari */}
          <div className="mb-8">
            <h3 className="text-md font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <span>🟦</span> Ca tahlili (422.7 nm)
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {COMPOUND.experimentalRuns_Ca.map(r => (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun_Ca(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun_Ca === r.id 
                      ? "bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
                      : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                  }`}
                >
                  {r.id.split('-').pop()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-purple-950/60 rounded-xl p-5 border border-purple-700/30">
                  <div className="text-xs text-purple-500 uppercase tracking-wider mb-1">O'lchash ID</div>
                  <div className="text-xl font-bold text-white font-mono">{run_Ca.id}</div>
                  <div className="text-xs text-purple-400 mt-1">{run_Ca.date}</div>
                  <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
                    📝 {run_Ca.note}
                  </div>
                  
                  <div className="my-4 border-t border-purple-800/50"></div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Yutilish (A):</span>
                      <span className="font-mono text-cyan-400 text-lg">{run_Ca.absorbance.toFixed(3)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-cyan-900/20 rounded border border-cyan-500/20">
                      <span className="text-sm text-cyan-400 font-medium">C (mg/L):</span>
                      <span className="font-mono text-white text-lg">{run_Ca.conc_mgL.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                      <span className="text-sm text-green-400 font-medium">Eksperimental %Ca:</span>
                      <span className="font-mono text-white text-lg">{run_Ca.Ca_percent.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Nazariy %Ca:</span>
                      <span className="font-mono text-cyan-400">{COMPOUND.theoretical.Ca.percent.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                      <span className="text-sm text-purple-300">Δ (Farq):</span>
                      <span className={`font-mono font-bold ${statusColor_Ca}`}>{deltaCa.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
                <h3 className="text-sm font-bold text-cyan-400 mb-4 flex justify-between">
                  <span>%Ca Qiymatlari</span>
                  <span className="text-[10px] text-purple-500 font-normal">Nazariy: 21.85%</span>
                </h3>
                
                <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                  {COMPOUND.experimentalRuns_Ca.map((r) => {
                    const val = r.Ca_percent
                    const heightPct = Math.min((val / 25) * 100, 100)
                    const isActive = r.id === activeRun_Ca
                    
                    return (
                      <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun_Ca(r.id)}>
                        <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                          {val.toFixed(2)}%
                        </div>
                        
                        <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                          <div className="absolute w-[120%] border-t border-dashed border-cyan-400/50 z-0" style={{ bottom: `${(21.848/25)*100}%` }}></div>

                          <div 
                            className={`w-full rounded-t transition-all duration-500 z-10 ${
                              isActive ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-purple-700/40'
                            }`}
                            style={{ height: `${heightPct}%` }}
                          ></div>
                        </div>
                        
                        <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? 'text-cyan-400' : 'text-purple-600'} font-bold`}>
                          {r.id.split('-').pop()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Co natijalari */}
          <div>
            <h3 className="text-md font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span>🔵</span> Co tahlili (240.7 nm)
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {COMPOUND.experimentalRuns_Co.map(r => (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun_Co(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun_Co === r.id 
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                      : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                  }`}
                >
                  {r.id.split('-').pop()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-purple-950/60 rounded-xl p-5 border border-purple-700/30">
                  <div className="text-xs text-purple-500 uppercase tracking-wider mb-1">O'lchash ID</div>
                  <div className="text-xl font-bold text-white font-mono">{run_Co.id}</div>
                  <div className="text-xs text-purple-400 mt-1">{run_Co.date}</div>
                  <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
                    📝 {run_Co.note}
                  </div>
                  
                  <div className="my-4 border-t border-purple-800/50"></div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Yutilish (A):</span>
                      <span className="font-mono text-blue-400 text-lg">{run_Co.absorbance.toFixed(3)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-blue-900/20 rounded border border-blue-500/20">
                      <span className="text-sm text-blue-400 font-medium">C (mg/L):</span>
                      <span className="font-mono text-white text-lg">{run_Co.conc_mgL.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                      <span className="text-sm text-green-400 font-medium">Eksperimental %Co:</span>
                      <span className="font-mono text-white text-lg">{run_Co.Co_percent.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Nazariy %Co:</span>
                      <span className="font-mono text-blue-400">{COMPOUND.theoretical.Co.percent.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                      <span className="text-sm text-purple-300">Δ (Farq):</span>
                      <span className={`font-mono font-bold ${statusColor_Co}`}>{deltaCo.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
                <h3 className="text-sm font-bold text-blue-400 mb-4 flex justify-between">
                  <span>%Co Qiymatlari</span>
                  <span className="text-[10px] text-purple-500 font-normal">Nazariy: 21.42%</span>
                </h3>
                
                <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                  {COMPOUND.experimentalRuns_Co.map((r) => {
                    const val = r.Co_percent
                    const heightPct = Math.min((val / 25) * 100, 100)
                    const isActive = r.id === activeRun_Co
                    
                    return (
                      <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun_Co(r.id)}>
                        <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                          {val.toFixed(2)}%
                        </div>
                        
                        <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                          <div className="absolute w-[120%] border-t border-dashed border-blue-400/50 z-0" style={{ bottom: `${(21.419/25)*100}%` }}></div>

                          <div 
                            className={`w-full rounded-t transition-all duration-500 z-10 ${
                              isActive ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-purple-700/40'
                            }`}
                            style={{ height: `${heightPct}%` }}
                          ></div>
                        </div>
                        
                        <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? 'text-blue-400' : 'text-purple-600'} font-bold`}>
                          {r.id.split('-').pop()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <span>📊</span> Kalibrlash egri chizig'i — to'liq ma'lumotlar
              </h3>
              
              <h4 className="text-cyan-400 font-bold text-sm mb-2">Ca (422.7 nm):</h4>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-purple-700">
                      <th className="py-2 px-3 text-left text-purple-300">C (mg/L)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Yutilish (A)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Izoh</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200 font-mono">
                    {COMPOUND.calibrationCurve_Ca.map((p, i) => (
                      <tr key={i} className="border-b border-purple-800/30">
                        <td className="py-2 px-3 text-cyan-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="text-blue-400 font-bold text-sm mb-2">Co (240.7 nm):</h4>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-purple-700">
                      <th className="py-2 px-3 text-left text-purple-300">C (mg/L)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Yutilish (A)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Izoh</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200 font-mono">
                    {COMPOUND.calibrationCurve_Co.map((p, i) => (
                      <tr key={i} className="border-b border-purple-800/30">
                        <td className="py-2 px-3 text-blue-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-cyan-900/20 rounded-lg border border-cyan-700/30 text-xs text-purple-200">
                <strong className="text-cyan-300">Ca regressiyasi:</strong> A = 0.084 × C + 0.0001, R² = 0.99999
              </div>
              <div className="mt-3 p-3 bg-blue-900/20 rounded-lg border border-blue-700/30 text-xs text-purple-200">
                <strong className="text-blue-300">Co regressiyasi:</strong> A = 0.083 × C + 0.0001, R² = 0.99999
              </div>
              <button 
                onClick={() => setShowCalibrationModal(false)}
                className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* 6. INTERFERENSIYALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span> Interferensiyalar (Ca va Co uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Ca uchun <strong className="text-cyan-300">fosfat effekti</strong> muhim — La³⁺ modifikatori talab. Co uchun interferensiyalar minimal. Har birini bosib, batafsil ma'lumot oling.
          </p>

          <div className="space-y-2">
            {COMPOUND.interferences.map((int, i) => (
              <button
                key={i}
                onClick={() => setSelectedInterference(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedInterference === i
                    ? "bg-cyan-900/40 border-cyan-500"
                    : "bg-purple-950/40 border-purple-700/30 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-cyan-400">{int.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    int.severity === "Past" ? "bg-green-900/30 text-green-400 border-green-600/30" :
                    int.severity === "O'rta" ? "bg-orange-900/30 text-orange-400 border-orange-600/30" :
                    "bg-red-900/30 text-red-400 border-red-600/30"
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
            Ca₃[Co(CN)₆]₂ <strong className="text-cyan-300">200°C dan keyin parchalanadi</strong> — CN⁻ ligandlari yo'qoladi (52.4%), CaO va Co₃O₄ qoldig'i hosil bo'ladi.
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
                d="M 50 20 L 200 20 Q 220 20 230 45 L 280 120 Q 290 135 310 135 L 350 135 Q 365 135 375 150 L 420 190 Q 430 200 450 200 L 580 200" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="125" y="15" textAnchor="middle" fill="#10b981">AAS: %Ca = 21.85%, %Co = 21.42%</text>
                
                <line x1="280" y1="120" x2="280" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="280" y="235" textAnchor="middle" fill="#8b5cf6">~300°C</text>
                <text x="300" y="110" fill="#8b5cf6">-6 CN⁻ (26.2%)</text>

                <line x1="420" y1="190" x2="420" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="420" y="235" textAnchor="middle" fill="#ef4444">~500°C</text>
                <text x="440" y="180" fill="#ef4444">-6 CN⁻ (26.2%)</text>

                <text x="520" y="195" textAnchor="middle" fill="#6366f1">CaO + Co₃O₄ (43.3%)</text>
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
                <div className="text-[10px] text-cyan-300 mt-2 italic">AAS effekti: {step.aasEffect}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> AAS ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            Ca₃[Co(CN)₆]₂ uchun AAS ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-cyan-300">koordinatsion polimer validatsiyasi</strong> uchun muhim. <strong className="text-amber-300">EA</strong> va <strong className="text-purple-300">XRD</strong> eng kuchli qo'shimcha metodlar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-cyan-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-cyan-300">{m.name}</h3>
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

          <div className="mt-5 bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-cyan-300 mb-2">💡 Koordinatsion polimer validatsiyasi uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">FAAS (Ca, Co) + EA (C, N) + IQ (CN⁻ ko'prik) + XRD (3D polimer) + TGA (52.4% CN⁻) + BET (g'ovaklilik)</strong> — oltita metod birgalikda Ca₃[Co(CN)₆]₂ ni to'liq tasdiqlaydi va uning MOF xususiyatlarini nazorat qiladi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> AAS uchun namuna tayyorlash (aralash metall — maxsus)
          </h2>
          <p className="text-xs text-red-300 mb-5 font-bold">
            ⚠ Kislota bilan CN⁻ bug'lari chiqadi — tortish shkafi ichida ishlash majburiy!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-cyan-900/40 border-cyan-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-cyan-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-cyan-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> FAAS dan %Ca va %Co hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Ikkala metall uchun alohida yutilish (A) kiriting — <strong className="text-cyan-300">%Ca</strong> va <strong className="text-blue-300">%Co</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, Ca, 422.7 nm):</label>
              <input 
                type="number" step="0.001" value={customAbsorbance_Ca}
                onChange={(e) => setCustomAbsorbance_Ca(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, Co, 240.7 nm):</label>
              <input 
                type="number" step="0.001" value={customAbsorbance_Co}
                onChange={(e) => setCustomAbsorbance_Co(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-purple-400">C (Ca, mg/L):</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{calcResult_Ca.conc}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Ca:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult_Ca.Ca_percent - 21.85) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult_Ca.Ca_percent}%
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">C (Co, mg/L):</div>
                <div className="text-xl font-mono font-bold text-blue-400">{calcResult_Co.conc}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Co:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult_Co.Co_percent - 21.42) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult_Co.Co_percent}%
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-900/20 rounded border border-green-700/30">
              <div className="text-xs text-green-300">
                <strong>Jami (Ca + Co):</strong> {(calcResult_Ca.Ca_percent + calcResult_Co.Co_percent).toFixed(2)}% (nazariy: 43.27%)
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Ca = (A / 0.084) × 100 × DF / (m × 1000) × 100; %Co = (A / 0.083) × 100 × DF / (m × 1000) × 100
            </p>
          </div>
        </div>

        {/* 11. AAS CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> AAS ning Ca₃[Co(CN)₆]₂ uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                AAS Ca₃[Co(CN)₆]₂ ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Ikki xil katod lampasi talab</strong> — Ca va Co alohida</li>
                <li><strong className="text-red-300">Faqat Ca va Co ni o'lchaydi</strong> — C, N uchun EA kerak</li>
                <li><strong className="text-red-300">Ca uchun La³⁺ modifikatori</strong> — fosfat effekti</li>
                <li><strong className="text-red-300">CN⁻ ligandlarni bilmaydi</strong> — IQ yoki EA kerak</li>
                <li><strong className="text-red-300">Koordinatsion polimer strukturani ko'rmaydi</strong> — XRD kerak</li>
                <li><strong className="text-red-300">G'ovaklilikni bilmaydi</strong> — BET kerak</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>Ca₃[Co(CN)₆]₂ ni to'liq tasdiqlash</strong> uchun kamida 6 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-cyan-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. FAAS (Ca, Co)</span>
                  <span className="text-cyan-400 font-mono">21.85%, 21.42%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (C, N)</span>
                  <span className="text-cyan-400 font-mono">26.19%, 30.54%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. IQ (CN⁻ ko'prik)</span>
                  <span className="text-cyan-400 font-mono">2100-2200 cm⁻¹</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. XRD (3D polimer)</span>
                  <span className="text-cyan-400 font-mono">kristall struktura</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. TGA (CN⁻)</span>
                  <span className="text-cyan-400 font-mono">52.4% yo'qotish</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">6. BET (g'ovaklilik)</span>
                  <span className="text-cyan-400 font-mono">sirt yuzasi</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 6 ta metod birgalikda koordinatsion polimerni to'liq tasdiqlaydi
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
              <p className="text-xs text-purple-200"><strong className="text-cyan-300">Ikkala metalni ham</strong> alohida o'lchaydi (Ca va Co). FAAS yetarli — GFAAS shart emas. Arzon va oddiy.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-cyan-300">Ikki xil katod lampasi!</strong> Ca uchun La³⁺ modifikatori. CN⁻ va strukturani bilmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EA (C, N), IQ (CN⁻ ko'prik), XRD (3D polimer), TGA (52.4% CN⁻), BET (g'ovaklilik) — MOF validatsiyasi.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/aas" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← AAS metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-sm bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • Ca₃[Co(CN)₆]₂ • AAS moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955), MOF (1970-yillar)</p>
        </div>
      </footer>
    </main>
  )
}