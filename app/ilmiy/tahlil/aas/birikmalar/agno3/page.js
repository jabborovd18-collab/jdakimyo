"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// AgNO₃ — AAS (Atom-Absorbsion Spektroskopiya) MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)
// Xususiyat: Ag⁺ FAAS tahlili, 328.1 nm, eng sezgir elementlardan biri
// O'ziga xoslik: LOD = 0.001 mg/L (1 ppb) — AAS ning rekord sezgirligi!
// Maqsad: Faqat AAS tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Ag: 107.868, N: 14.007, O: 15.999
}

const COMPOUND = {
  formulaHTML: "AgNO<sub>3</sub>",
  formulaPlain: "AgNO3",
  iupac: "Kumush nitrat",
  formulaExpanded: "AgNO₃ (oddiy tuz, kompleks emas)",
  commonName: "Lunar caustic (oyli kuydirgich)",
  molarMass: 169.87,
  casNumber: "7761-88-8",
  color: "rangsiz yoki oq kristallar (yorug'likda qorayadi)",
  stability: "qorong'ida barqaror, yorug'likda sekin Ag⁰ ga qaytariladi (fotografik effekt)",
  
  historicalFact: {
    title: "Fotografiya va argentometrik titrlashning asosi",
    text: "AgNO₃ — kimyo tarixidagi eng muhim reagentlardan biri. 1727-yilda Johann Heinrich Schulze AgNO₃ ning yorug'lik ta'sirida qorayishini kashf qildi — bu fotografiya ixtirosining boshlanishi edi. 1839-yilda Louis Daguerre AgNO₃ dan foydalanib, birinchi amaliy fotografik jarayonni (dagerotip) ishlab chiqdi. Analitik kimyoda AgNO₃ <strong>birlamchi standart</strong> sifatida ishlatiladi — argentometrik titrlash (Mohr, Volhard, Fajans usullari) ning asosi. Uning sofligi 99.99% gacha yetadi. AAS tahlilida AgNO₃ <strong>eng sezgir birikmalardan</strong> biri: Ag⁺ FAAS da juda yaxshi atomlanadi, λ = 328.1 nm da <strong>LOD atigi 0.001 mg/L (1 ppb)</strong> — bu AAS ning rekord ko'rsatkichlaridan biri. RSD 0.3-0.6% — juda past, takrorlanish mukammal.",
    year: "1727-1839"
  },

  // Ag ning eng yuqori sezgirligi
  highestSensitivity: {
    title: "Ag — FAAS da eng sezgir elementlardan biri!",
    description: "Ag ning 328.1 nm dagi chizig'i AAS ning eng kuchli signal beruvchi chiziqlaridan biri. Bu AgNO₃ ni AAS uchun ideal namuna qiladi.",
    lodComparison: [
      { element: "Ag", lambda: "328.1", lod: "0.001", rank: "1-o'rin (eng yaxshi)" },
      { element: "Cu", lambda: "324.8", lod: "0.002", rank: "2-o'rin" },
      { element: "Cd", lambda: "228.8", lod: "0.001", rank: "1-o'rin (teng)" },
      { element: "Zn", lambda: "213.9", lod: "0.001", rank: "1-o'rin (teng)" },
      { element: "Fe", lambda: "248.3", lod: "0.005", rank: "5-o'rin" },
      { element: "Cr", lambda: "357.9", lod: "0.003", rank: "4-o'rin" },
      { element: "Pt", lambda: "265.9", lod: "0.050", rank: "Juda past" }
    ],
    whySensitive: "Ag ning 328.1 nm chizig'ining o'tish ehtimolligi (transition probability) juda yuqori va atomlanish energiyasi past. Bundan tashqari, Ag ning ionlanish potensiali 7.58 eV — alangada deyarli ionlanmaydi.",
    aasRelevance: "AgNO₃ ni AAS da tahlil qilish juda oson — hatto juda past konsentratsiyalarda ham aniq natija olinadi. Bu uni suv tahlili, atrof-muhit monitoringi va farmatsevtika uchun ideal qiladi."
  },

  // Birlamchi standart sifatida
  primaryStandard: {
    title: "AgNO₃ — argentometriyaning birlamchi standarti",
    description: "AgNO₃ analitik kimyoda eng muhim birlamchi standartlardan biri. Uning sofligi 99.99% gacha yetadi va u uzoq vaqt barqaror saqlanadi.",
    applications: [
      { method: "Mohr usuli", indicator: "K₂CrO₄", analyte: "Cl⁻, Br⁻", endpoint: "Qizil-jigar cho'kma (Ag₂CrO₄)" },
      { method: "Volhard usuli", indicator: "Fe(NH₄)(SO₄)₂", analyte: "Ag⁺ (qayta titrlash)", endpoint: "Qizil kompleks [Fe(SCN)]²⁺" },
      { method: "Fajans usuli", indicator: "Flyuorestsein", analyte: "Cl⁻, Br⁻, I⁻", endpoint: "Rang o'zgarishi (adsorbsiya)" },
      { method: "Gay-Lussac usuli", indicator: "Yo'q", analyte: "Cl⁻", endpoint: "Tiniqlik (cho'kma to'liq)" }
    ],
    purityRequirements: {
      min_purity: "99.95%",
      drying: "110°C da 2 soat",
      storage: "Qorong'i shishada (yorug'likdan himoya)",
      hygroscopic: "Gigroskopik emas — havoda barqaror"
    }
  },

  aasParameters: {
    element: "Ag",
    oxidationState: "Ag⁺ (lekin AAS buni farqlamaydi!)",
    hclLamp: "Ag katod lampasi (Hollow Cathode Lamp)",
    lambda: { primary: 328.1, secondary: 338.3, tertiary: 206.2 },
    slitWidth: 0.5,
    lampCurrent: 4,
    atomization: "FAAS (Alanga AAS)",
    flame: "Havo-C₂H₂ (oxidizing, ~2300°C)",
    burnerHeight: 8,
    backgroundCorrection: "Deuteriy lampasi (D₂) yoki hech qanday",
    linearRange: "0.01 - 3.0 mg/L",
    sensitivity: 0.02,
    lod: 0.001,
    loq: 0.003,
    rsd_typical: "0.3 - 1.0%"
  },

  theoretical: {
    Ag:  { mass: 107.868, percent: 63.501, source: "Markaziy Ag⁺ atomi", aasSignal: "328.1 nm da eng kuchli signal" },
    N:   { mass: 14.007,  percent: 8.245,  source: "NO₃⁻ (1×N)", aasSignal: "FAAS da o'lchanmaydi" },
    O:   { mass: 47.997,  percent: 28.254, source: "NO₃⁻ (3×O)", aasSignal: "FAAS da o'lchanmaydi" }
  },

  calibrationCurve: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (0.1 M HNO₃)" },
    { conc: 0.2, absorbance: 0.100, note: "Standart 1" },
    { conc: 0.5, absorbance: 0.250, note: "Standart 2" },
    { conc: 1.0, absorbance: 0.501, note: "Standart 3" },
    { conc: 1.5, absorbance: 0.752, note: "Standart 4" },
    { conc: 2.0, absorbance: 1.002, note: "Standart 5" },
    { conc: 3.0, absorbance: 1.504, note: "Standart 6" }
  ],

  experimentalRuns: [
    { id: "AAS-24-701", date: "2024-12-01", absorbance: 0.631, conc_mgL: 1.26, sample_mg: 20.0, dilution: 100, Ag_percent: 63.00, rsd: 0.35, note: "Toza AgNO₃ (birlamchi standart)" },
    { id: "AAS-24-702", date: "2024-12-01", absorbance: 0.633, conc_mgL: 1.26, sample_mg: 20.0, dilution: 100, Ag_percent: 63.00, rsd: 0.38, note: "Ikkinchi parallel" },
    { id: "AAS-24-703", date: "2024-12-01", absorbance: 0.630, conc_mgL: 1.26, sample_mg: 20.0, dilution: 100, Ag_percent: 63.00, rsd: 0.32, note: "Uchinchi parallel" },
    { id: "AAS-24-704", date: "2024-12-01", absorbance: 0.632, conc_mgL: 1.26, sample_mg: 20.0, dilution: 100, Ag_percent: 63.00, rsd: 0.36, note: "To'rtinchi parallel" },
    { id: "AAS-24-705", date: "2024-12-01", absorbance: 0.634, conc_mgL: 1.27, sample_mg: 20.0, dilution: 100, Ag_percent: 63.50, rsd: 0.40, note: "Beshinchi parallel" },
    { id: "AAS-24-706", date: "2024-12-02", absorbance: 0.568, conc_mgL: 1.13, sample_mg: 20.0, dilution: 100, Ag_percent: 56.50, rsd: 0.85, note: "⚠ Yorug'likda qoldirilgan (qisman qaytarilgan)" },
    { id: "AAS-24-707", date: "2024-12-02", absorbance: 0.500, conc_mgL: 1.00, sample_mg: 20.0, dilution: 100, Ag_percent: 50.00, rsd: 1.25, note: "⚠ Kuchli fotolitik parchalanish (qora)" },
    { id: "BLANK-08",   date: "2024-12-01", absorbance: 0.000, conc_mgL: 0.00, sample_mg: 0.0,  dilution: 1,  Ag_percent: 0.00, rsd: 0.00, note: "Blank (0.1 M HNO₃)" },
    { id: "STD-Ag-5",   date: "2024-12-01", absorbance: 2.505, conc_mgL: 5.00, sample_mg: 0.0, dilution: 1, Ag_percent: 0.00, rsd: 0.20, note: "NIST Ag standarti (5 mg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 20.0 ± 0.1 mg AgNO₃ tortiladi. Oq-rangsiz kristallar — sofligi belgisi. Kulrang-qora — fotolitik parchalanish!", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 50 mL 0.1 M HNO₃ qo'shiladi. AgNO₃ suvda ham yaxshi eriydi, lekin HNO₃ matritsa mosligi uchun.", time: "2 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "0.1 M HNO₃ bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~200 mg/L AgNO₃ ≈ 127 mg/L Ag.", time: "1 daq", critical: false },
    { step: 4, title: "100× suyuqlantirish", desc: "1.0 mL eritmadan 100 mL kolbaga o'tkaziladi. Natija: ~1.27 mg/L Ag — kalibrlash diapazonida (0.01-3.0 mg/L).", time: "3 daq", critical: true },
    { step: 5, title: "FAAS da o'lchash", desc: "Havo-C₂H₂ alangasi, λ = 328.1 nm. Ag juda yaxshi atomlanadi — fon korreksiyasi ko'pincha kerak emas.", time: "5-8 daq", critical: false },
    { step: 6, title: "Natijalarni hisoblash", desc: "%Ag = (C × V × DF / m) × 100. Nazariy: 63.50%. AgNO₃ ning yuqori sofligi tufayli natija 63.0-63.5% oralig'ida bo'ladi.", time: "1 daq", critical: false }
  ],

  interferences: [
    { type: "Spektral", severity: "Juda past", description: "Ag 328.1 nm da juda toza signal. Boshqa elementlar yaqin chiziqlari yo'q.", solution: "Fon korreksiyasi ko'pincha kerak emas" },
    { type: "Kimyoviy (Cl⁻)", severity: "O'rta", description: "Cl⁻ mavjud bo'lsa, AgCl cho'kmasi hosil bo'ladi — signal kamayadi.", solution: "Namuna tayyorlashda Cl⁻ dan saqlanish, HNO₃ ishlatish" },
    { type: "Kimyoviy (S²⁻)", severity: "Yuqori", description: "S²⁻ juda kuchli — Ag₂S cho'kmasi hosil qiladi (Ksp = 6×10⁻⁵¹).", solution: "S²⁻ manbalaridan butunlay saqlanish" },
    { type: "Ionlanish", severity: "Juda past", description: "Ag ning ionlanish potensiali 7.58 eV — alangada deyarli ionlanmaydi.", solution: "Ionlanish buferi shart emas" },
    { type: "Fotolitik parchalanish", severity: "O'rta", description: "AgNO₃ yorug'likda Ag⁰ ga qaytariladi — eritma qorayadi.", solution: "Qorong'i shishada saqlash, tez tahlil qilish" }
  ],

  tgaSteps: [
    { start: 25, end: 440, loss: 0.0, event: "Barqaror zona (AgNO₃ erimaydi)", color: "#10b981", aasEffect: "Ag signal barqaror" },
    { start: 440, end: 470, loss: 21.2, event: "Eritish (mp = 212°C, lekin parchalanish boshlanadi)", color: "#f59e0b", aasEffect: "AgNO₂ hosil bo'ladi" },
    { start: 470, end: 600, loss: 32.4, event: "NO₂ va O₂ yo'qolishi", color: "#ef4444", aasEffect: "Ag₂O → Ag metali" },
    { start: 600, end: 900, loss: 0.0, event: "Ag metali sof (63.50%)", color: "#6366f1", aasEffect: "Gravimetriya: 63.5% Ag" },
    { start: 900, end: 961, loss: 0.0, event: "Ag erish haroratiga yaqin (mp = 961°C)", color: "#a855f7", aasEffect: "Barqaror qoldiq" }
  ],

  relatedMethods: [
    { name: "Argentometrik titrlash (Mohr)", role: "Ag⁺ ni Cl⁻ bilan titrlash — K₂CrO₄ indikatori", aasAdvantage: "Mohr klassik va arzon, lekin sekin", aasDisadvantage: "AAS tez va avtomatlashtirilgan", complementarity: "95%" },
    { name: "Gravimetriya", role: "Ag⁺ ni AgCl sifatida cho'ktirib, tortish", aasAdvantage: "Gravimetriya juda aniq (±0.1%), birlamchi metod", aasDisadvantage: "AAS tezroq, lekin ±0.5% xato", complementarity: "92%" },
    { name: "ICP-OES / ICP-MS", role: "Ag ko'p elementli tahlil, ppt darajasida", aasAdvantage: "ICP-MS juda sezgir (ppt), bir vaqtda ko'p element", aasDisadvantage: "FAAS arzon, oddiy, bir element uchun yetarli", complementarity: "98%" },
    { name: "Voltammetriya", role: "Ag⁺ ni elektrokimyoviy qaytarilish orqali aniqlash", aasAdvantage: "Voltammetriya juda sezgir, speciation mumkin", aasDisadvantage: "FAAS soddaroq, tezroq", complementarity: "88%" },
    { name: "UV-Vis spektroskopiya", role: "Ag⁺ ning UV da yutilishi (200-220 nm, LMCT)", aasAdvantage: "UV-Vis tez, eritmada bajariladi", aasDisadvantage: "AAS sezgirroq, aniqroq", complementarity: "85%" },
    { name: "Potensiometriya (Ag-ISE)", role: "Ag⁺ ion-selektiv elektrod orqali to'g'ridan-to'g'ri o'lchash", aasAdvantage: "ISE juda tez, in-situ o'lchash mumkin", aasDisadvantage: "FAAS aniqroq, kalibrlash oson", complementarity: "90%" }
  ]
}

function calculateAgPercent(absorbance, sampleMass, dilutionFactor) {
  const slope = 0.5013  // A = 0.5013 × C (mg/L), R² = 0.99999
  const conc_mgL = absorbance / slope
  const totalVolume = 100
  const Ag_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Ag_percent = (Ag_mass_mg / sampleMass) * 100
  return {
    conc: parseFloat(conc_mgL.toFixed(4)),
    Ag_mass: parseFloat(Ag_mass_mg.toFixed(4)),
    Ag_percent: parseFloat(Ag_percent.toFixed(2))
  }
}

export default function AgNO3Page() {
  const [activeRun, setActiveRun] = useState("AAS-24-701")
  const [customAbsorbance, setCustomAbsorbance] = useState(0.631)
  const [customMass, setCustomMass] = useState(20.0)
  const [dilutionFactor, setDilutionFactor] = useState(100)
  const [selectedInterference, setSelectedInterference] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaAg = Math.abs(run.Ag_percent - COMPOUND.theoretical.Ag.percent)
  const statusColor = deltaAg <= 0.5 ? "text-green-400" : deltaAg <= 3.0 ? "text-yellow-400" : "text-red-400"

  const calcResult = useMemo(() => 
    calculateAgPercent(customAbsorbance, customMass, dilutionFactor),
    [customAbsorbance, customMass, dilutionFactor]
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
            <span className="text-gray-300 font-semibold">AgNO₃</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-200 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-green-600 px-2 py-1 rounded ml-2">⭐ FAAS</span>
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
                <span className="px-2 py-1 rounded bg-gray-800/60 border border-gray-600/50 text-gray-300 text-[10px] uppercase tracking-wide">Ag⁺ d¹⁰</span>
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">λ = 328.1 nm</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">⭐ LOD 0.001 mg/L</span>
                <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Birlamchi Standart</span>
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
        <div className="bg-gradient-to-r from-gray-800/40 to-purple-900/40 border border-gray-600/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (AAS uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">AgNO₃</strong> — kumush nitrat, analitik kimyoning eng muhim birlamchi standartlaridan biri. AAS tahlilida <strong className="text-gray-200">eng sezgir birikmalardan</strong> biri, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-gray-400 text-xs md:text-sm">
                <li>Nazariy <strong className="text-white">%Ag = 63.50%</strong> — juda yuqori foiz</li>
                <li>Ag⁺ <strong className="text-green-300">FAAS ning eng sezgir elementi</strong> (LOD 0.001 mg/L)</li>
                <li><strong className="text-white">Oddiy tuz</strong> — kompleks emas, minimal matritsa effekti</li>
                <li>NO₃⁻ alangada <strong className="text-white">to'liq parchalanadi</strong></li>
                <li>Ag⁺ <strong className="text-white">diamagnit</strong> (d¹⁰, rangsiz)</li>
                <li><strong className="text-amber-300">Fotolabil</strong> — yorug'likda Ag⁰ ga qaytariladi</li>
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

        {/* 1b. ENG YUQORI SEZGIRLIK */}
        <div className="bg-gradient-to-r from-green-900/40 to-blue-900/40 border-2 border-green-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⭐</span> {COMPOUND.highestSensitivity.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.highestSensitivity.description}
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-2 px-3 text-left text-purple-300">Element</th>
                  <th className="py-2 px-3 text-center text-purple-300">λ (nm)</th>
                  <th className="py-2 px-3 text-center text-purple-300">LOD (mg/L)</th>
                  <th className="py-2 px-3 text-left text-purple-300">O'rin</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.highestSensitivity.lodComparison.map((l, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${l.element === "Ag" ? 'bg-green-900/20' : ''}`}>
                    <td className={`py-2 px-3 font-bold ${l.element === "Ag" ? "text-green-400" : "text-purple-300"}`}>
                      {l.element} {l.element === "Ag" && "⭐"}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-blue-400">{l.lambda}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-yellow-400">{l.lod}</td>
                    <td className={`py-2 px-3 ${l.rank.includes("1-o'rin") ? "text-green-300" : l.rank.includes("past") ? "text-red-300" : "text-purple-300"}`}>
                      {l.rank}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50">
              <h4 className="text-green-300 font-bold text-sm mb-2">💡 Nima uchun Ag shunchalik sezgir?</h4>
              <p className="text-xs text-purple-200">{COMPOUND.highestSensitivity.whySensitive}</p>
            </div>
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
              <h4 className="text-blue-300 font-bold text-sm mb-2">✅ AAS uchun xulosa:</h4>
              <p className="text-xs text-purple-200">{COMPOUND.highestSensitivity.aasRelevance}</p>
            </div>
          </div>
        </div>

        {/* 1c. BIRLAMCHI STANDART */}
        <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 border border-amber-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> {COMPOUND.primaryStandard.title}
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            {COMPOUND.primaryStandard.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-amber-950/40 rounded-xl p-4 border border-amber-700/30">
              <h4 className="text-amber-300 font-bold text-sm mb-3">Argentometrik usullar:</h4>
              <div className="space-y-2">
                {COMPOUND.primaryStandard.applications.map((app, i) => (
                  <div key={i} className="bg-purple-950/40 rounded-lg p-2 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-amber-300">{app.method}</span>
                      <span className="text-purple-400">{app.indicator}</span>
                    </div>
                    <div className="text-purple-300">Analit: <span className="text-white">{app.analyte}</span></div>
                    <div className="text-purple-300 mt-1">Tugash: <span className="text-green-300">{app.endpoint}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-950/40 rounded-xl p-4 border border-amber-700/30">
              <h4 className="text-amber-300 font-bold text-sm mb-3">Soqlik talablari:</h4>
              <div className="space-y-3 text-xs">
                <div className="bg-purple-950/40 rounded p-2">
                  <div className="text-purple-400">Minimal soflik:</div>
                  <div className="font-mono text-green-400 font-bold">{COMPOUND.primaryStandard.purityRequirements.min_purity}</div>
                </div>
                <div className="bg-purple-950/40 rounded p-2">
                  <div className="text-purple-400">Quritish:</div>
                  <div className="font-mono text-white">{COMPOUND.primaryStandard.purityRequirements.drying}</div>
                </div>
                <div className="bg-purple-950/40 rounded p-2">
                  <div className="text-purple-400">Saqlash:</div>
                  <div className="font-mono text-white">{COMPOUND.primaryStandard.purityRequirements.storage}</div>
                </div>
                <div className="bg-purple-950/40 rounded p-2">
                  <div className="text-purple-400">Gigroskopiklik:</div>
                  <div className="font-mono text-green-300">{COMPOUND.primaryStandard.purityRequirements.hygroscopic}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AAS PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> AAS tahlil parametrlari (Ag uchun optimal)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Ag⁺ uchun <strong className="text-gray-200">FAAS (Havo-C₂H₂)</strong> yetarli — GFAAS kerak emas, chunki FAAS da LOD atigi 0.001 mg/L. 
            λ = 328.1 nm — Ag ning eng kuchli chizig'i, fon korreksiyasi ko'pincha kerak emas.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Element</div>
              <div className="text-lg font-bold text-gray-300">{COMPOUND.aasParameters.element}</div>
              <div className="text-[10px] text-purple-300 mt-1">{COMPOUND.aasParameters.oxidationState}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">λ (asosiy)</div>
              <div className="text-lg font-mono font-bold text-gray-300">{COMPOUND.aasParameters.lambda.primary} nm</div>
              <div className="text-[10px] text-purple-300 mt-1">Alt: {COMPOUND.aasParameters.lambda.secondary} nm</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Alanga</div>
              <div className="text-lg font-bold text-orange-400">Havo-C₂H₂</div>
              <div className="text-[10px] text-purple-300 mt-1">~2300°C</div>
            </div>
            <div className="bg-green-950/60 p-3 rounded-xl border-2 border-green-500/50">
              <div className="text-[10px] text-green-400 uppercase mb-1">⭐ LOD</div>
              <div className="text-lg font-mono font-bold text-green-400">{COMPOUND.aasParameters.lod} mg/L</div>
              <div className="text-[10px] text-purple-300 mt-1">Eng past LOD!</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-gray-300 font-bold text-xs uppercase mb-3">Batafsil parametrlar:</h3>
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
                <div className="font-mono text-green-300">{COMPOUND.aasParameters.rsd_typical}</div>
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
            AgNO₃ — <strong className="text-gray-200">oddiy tuz</strong>, kompleks emas. AAS <strong className="text-gray-200">faqat Ag</strong> ni o'lchaydi. N va O FAAS da ko'rinmaydi.
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
                    <td className="py-3 pl-2 font-bold text-gray-300">{el}</td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-400">{d.aasSignal}</td>
                  </tr>
                ))}
                <tr className="bg-gray-800/30 font-bold border-t border-gray-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-gray-300">AAS: Ag (63.50%) — juda kuchli signal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. KALIBRLASH EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> Kalibrlash egri chizig'i (Ag, 328.1 nm)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-gray-600 hover:bg-gray-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Ag standartlari (0.1 M HNO₃ da) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-gray-200">R² = 0.99999</strong> — deyarli mukammal chiziqli bog'liqlik. <strong className="text-white">A = 0.5013 × C</strong>.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 500 260" className="w-full h-full overflow-visible">
              {[0, 0.3, 0.6, 0.9, 1.2, 1.5].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.6)*200} x2="480" y2={220 - (v/1.6)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.6)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 0.5, 1, 1.5, 2, 2.5, 3].map(c => (
                <g key={c}>
                  <text x={50 + (c/3)*430} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c.toFixed(1)}</text>
                </g>
              ))}
              <text x="265" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Ag konsentratsiyasi (mg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish (A)</text>

              <line x1="50" y1="220" x2="480" y2={220 - (1.504/1.6)*200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/3)*430
                const y = 220 - (p.absorbance/1.6)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#9ca3af" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#d1d5db">
                        {p.absorbance.toFixed(3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (1.26/3)*430
                const y = 220 - (0.631/1.6)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (1.26 mg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="350" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#9ca3af" strokeWidth="1" />
              <text x="410" y="48" textAnchor="middle" fontSize="10" fill="#d1d5db" fontWeight="bold">
                R² = 0.99999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-400 rounded-full"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya (A = 0.5013·C)</span>
          </div>
        </div>

        {/* 5. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> AAS yugurishlari — eksperimental natijalar
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan AAS o'lchashlari. Ag⁺ FAAS da mukammal atomlanadi — takroriy o'lchashlar juda mos (RSD {'<'} 0.5%). Fotolitik parchalanish muhim muammo.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isPhoto1 = r.id === "AAS-24-706"
              const isPhoto2 = r.id === "AAS-24-707"
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun === r.id 
                      ? "bg-gray-600 border-gray-400 text-white shadow-lg shadow-gray-500/20" 
                      : isBlank 
                        ? "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-gray-500"
                        : isStd
                          ? "bg-amber-900/30 border-amber-700/30 text-amber-300 hover:border-amber-500"
                          : isPhoto1 || isPhoto2
                            ? "bg-purple-900/30 border-purple-700/30 text-purple-300 hover:border-purple-500"
                            : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                  }`}
                >
                  {r.id}
                  {(isPhoto1 || isPhoto2) && " ⚠"}
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
                    <span className="font-mono text-gray-300 text-lg">{run.absorbance.toFixed(3)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-800/40 rounded border border-gray-600/30">
                    <span className="text-sm text-gray-300 font-medium">C (mg/L):</span>
                    <span className="font-mono text-white text-lg">{run.conc_mgL.toFixed(3)}</span>
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
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Ag:</span>
                    <span className="font-mono text-white text-lg">{run.Ag_percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Ag:</span>
                    <span className="font-mono text-gray-300">{COMPOUND.theoretical.Ag.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaAg.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">RSD:</span>
                    <span className={`font-mono ${run.rsd <= 0.5 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {run.rsd.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : deltaAg <= 0.5
                    ? "bg-green-900/30 border-green-700/30"
                    : deltaAg <= 3.0
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : deltaAg <= 0.5 ? "text-green-400" : deltaAg <= 3.0 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : deltaAg <= 0.5 ? "✓ AgNO₃ tasdiqlandi" : deltaAg <= 3.0 ? "⚠ Qisman parchalanish" : "✗ Kuchli parchalanish"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    deltaAg <= 0.5
                      ? "AAS natijasi AgNO₃ formulaga to'liq mos keladi (%Ag = 63.50%). Birlamchi standart sofligi tasdiqlandi, RSD juda past."
                      : deltaAg <= 3.0
                        ? "%Ag qiymati ozgina past — qisman fotolitik parchalanish bo'lishi mumkin (qorayish)."
                        : "%Ag juda past — kuchli fotolitik parchalanish (Ag⁰ ga qaytarilgan). Namuna qora rangda bo'lishi kerak."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Blank — signal nolga yaqin. Tizim toza."
                      : "NIST standarti — kalibrlash to'g'ri bajarilgan."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-gray-300 mb-4 flex justify-between">
                <span>%Ag Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Nazariy: 63.50%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isPhoto1 = r.id === "AAS-24-706"
                  const isPhoto2 = r.id === "AAS-24-707"
                  const val = r.Ag_percent
                  const heightPct = Math.min((val / 70) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-gray-400/50 z-0" style={{ bottom: `${(63.501/70)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : isPhoto1 || isPhoto2 ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                : 'bg-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : isPhoto1 || isPhoto2 ? 'bg-purple-700/40'
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : isPhoto1 || isPhoto2 ? 'text-purple-400' : 'text-gray-300') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-400 rounded"></span> Toza AgNO₃</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded"></span> Fotolitik parchalangan</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-gray-400/50"></span> Nazariy (63.50%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
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
                        <td className="py-2 px-3 text-gray-300">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-gray-800/40 rounded-lg border border-gray-600/30 text-xs text-purple-200">
                <strong className="text-gray-200">Regressiya:</strong> A = 0.5013 × C + 0.0001, R² = 0.99999
              </div>
              <div className="mt-3 p-3 bg-green-900/20 rounded-lg border border-green-700/30 text-xs text-purple-200">
                <strong className="text-green-300">⭐ Eslatma:</strong> Ag — FAAS ning eng sezgir elementlaridan biri (LOD = 0.001 mg/L). Slope juda yuqori.
              </div>
              <button 
                onClick={() => setShowCalibrationModal(false)}
                className="w-full mt-4 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors text-sm"
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
            Ag⁺ uchun interferensiyalar <strong className="text-gray-200">minimal</strong> — Ag AAS ning eng toza signal beruvchi elementlaridan biri. Asosiy muammo — Cl⁻ va S²⁻ bilan cho'kma hosil bo'lishi.
          </p>

          <div className="space-y-2">
            {COMPOUND.interferences.map((int, i) => (
              <button
                key={i}
                onClick={() => setSelectedInterference(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedInterference === i
                    ? "bg-gray-800/60 border-gray-400"
                    : "bg-purple-950/40 border-purple-700/30 hover:border-gray-500/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-300">{int.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    int.severity === "Juda past" ? "bg-green-900/30 text-green-400 border-green-600/30" :
                    int.severity === "Past" ? "bg-green-900/30 text-green-400 border-green-600/30" :
                    int.severity === "O'rta" ? "bg-yellow-900/30 text-yellow-400 border-yellow-600/30" :
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
            AgNO₃ <strong className="text-gray-200">440°C da parchalanadi</strong> — NO₂ va O₂ chiqib ketadi, sof Ag metali qoladi. Bu gravimetriya orqali ham tasdiqlanadi (63.5% Ag).
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
                d="M 50 20 L 350 20 Q 370 20 380 50 L 420 130 Q 430 145 450 145 L 580 145" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="200" y="15" textAnchor="middle" fill="#10b981">AAS: %Ag = 63.50%</text>
                
                <line x1="420" y1="130" x2="420" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="420" y="235" textAnchor="middle" fill="#ef4444">~500°C</text>
                <text x="440" y="120" fill="#ef4444">-NO₂, -O₂ (36.5%)</text>

                <text x="520" y="140" textAnchor="middle" fill="#6366f1">Ag metali (63.5%)</text>
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
                <div className="text-[10px] text-gray-300 mt-2 italic">AAS effekti: {step.aasEffect}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-gray-800/40 to-purple-900/40 border border-gray-600/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> AAS ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            AgNO₃ uchun AAS ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-gray-200">argentometrik titrlash</strong> bilan taqqoslash uchun muhim. <strong className="text-amber-300">Gravimetriya</strong> va <strong className="text-amber-300">Mohr titrlash</strong> eng kuchli qo'shimcha metodlar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-gray-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-gray-300">{m.name}</h3>
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

          <div className="mt-5 bg-gray-800/40 border border-gray-600/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-gray-300 mb-2">💡 AgNO₃ uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">AAS (Ag%) + Mohr titrlash (Cl⁻) + Gravimetriya (AgCl) + UV-Vis (LMCT 200-220 nm) + Potensiometriya (Ag-ISE) + ICP-MS (ppb darajada)</strong> — oltita metod birgalikda AgNO₃ ning sofligini to'liq nazorat qiladi va uni birlamchi standart sifatida tasdiqlaydi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> AAS uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            AgNO₃ <strong className="text-gray-200">fotolabil</strong> — yorug'likdan himoya zarur. Cl⁻ va S²⁻ dan saqlanish muhim (cho'kma hosil bo'lmasligi uchun).
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-gray-700/60 border-gray-400"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-gray-400 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-gray-300">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-gray-800/40 border border-gray-600/30 rounded-2xl p-6">
          <h3 className="text-gray-300 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> AAS dan %Ag hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan yutilish (A), namuna massasi va suyuqlantirish faktori bo'yicha <strong className="text-gray-200">%Ag</strong> ni avtomatik hisoblang.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, 328.1 nm):</label>
              <input 
                type="number" step="0.001" value={customAbsorbance}
                onChange={(e) => setCustomAbsorbance(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-gray-400 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-gray-400 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-gray-400 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Konsentratsiya:</div>
                <div className="text-2xl font-mono font-bold text-gray-300">{calcResult.conc} mg/L</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ag massasi:</div>
                <div className="text-2xl font-mono font-bold text-orange-400">{calcResult.Ag_mass} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Ag:</div>
                <div className={`text-2xl font-mono font-bold ${Math.abs(calcResult.Ag_percent - 63.50) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Ag_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Ag = (A / 0.5013) × 100 × DF / (m × 1000) × 100
            </p>
          </div>
        </div>

        {/* 11. AAS CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> AAS ning AgNO₃ uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                AAS AgNO₃ ni tahlil qilishda juda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Ag⁺ va Ag⁰ ni farqlay olmaydi</strong> — fotolitik parchalanish aniqlanmaydi</li>
                <li><strong className="text-red-300">Faqat Ag ni o'lchaydi</strong> — N, O uchun EA kerak</li>
                <li><strong className="text-red-300">Cl⁻ va S²⁻ cho'kmalari muammo</strong> — toza erituvchi talab</li>
                <li><strong className="text-red-300">Fotolabil</strong> — yorug'likdan himoya zarur</li>
                <li><strong className="text-red-300">Bir vaqtda bitta element</strong> — ICP-MS tezroq</li>
                <li><strong className="text-red-300">Soqlikni to'liq tasdiqlamaydi</strong> — argentometriya kerak</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>AgNO₃ ni to'liq tasdiqlash</strong> uchun kamida 5 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-gray-300 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. AAS (Ag%)</span>
                  <span className="text-gray-300 font-mono">63.50%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. Mohr titrlash (Cl⁻)</span>
                  <span className="text-gray-300 font-mono">Cl⁻ aniqlash</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. Gravimetriya (AgCl)</span>
                  <span className="text-gray-300 font-mono">±0.1% aniqlik</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. EA (N, O)</span>
                  <span className="text-gray-300 font-mono">8.25%, 28.25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. UV-Vis (LMCT)</span>
                  <span className="text-gray-300 font-mono">200-220 nm</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 5 ta metod birgalikda AgNO₃ birlamchi standart sofligini to'liq tasdiqlaydi
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
              <p className="text-xs text-purple-200">Ag ni 63.50% aniqlikda o'lchaydi. <strong className="text-gray-200">Eng yuqori sezgirlik!</strong> LOD 0.001 mg/L — rekord. RSD juda past ({'<'} 0.5%). Oddiy matritsa.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-gray-200">Ag⁺/Ag⁰ farqlanmaydi!</strong> Fotolabil — yorug'likdan himoya. Cl⁻ va S²⁻ cho'kmalar muammo. Faqat Ag ni ko'radi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">Mohr (Cl⁻), Gravimetriya (AgCl), EA (N, O), UV-Vis (200-220 nm), Potensiometriya (Ag-ISE) — birlamchi standart sofligi nazorati.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/aas" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← AAS metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-sm bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • AgNO₃ • AAS moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955), Schulze (1727), Daguerre (1839)</p>
        </div>
      </footer>
    </main>
  )
}