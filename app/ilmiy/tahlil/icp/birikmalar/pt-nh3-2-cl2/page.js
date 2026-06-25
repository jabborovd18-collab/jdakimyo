"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// Fe(C₅H₅)₂ (Ferrosen) — ICP-OES / ICP-MS MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, NIST Isotope Data
// Xususiyat: Metallocen (sandwich), sublimatsiya (100°C), Fe yuqori massa
// O'ziga xoslik: Sublimatsiya muammosi - kapsula zich yopilishi kerak!
// Maqsad: Faqat ICP tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Fe: 55.845, C: 12.011, H: 1.008
}

const COMPOUND = {
  formulaHTML: "Fe(C<sub>5</sub>H<sub>5</sub>)<sub>2</sub>",
  formulaPlain: "Fe(C5H5)2",
  iupac: "Bis(η⁵-siklopentadienil)temir(II)",
  formulaExpanded: "FeC₁₀H₁₀",
  commonName: "Ferrosen (sariq kristallar)",
  molarMass: 186.035,
  casNumber: "102-54-5",
  color: "to'q sariq kristallar",
  stability: "havoda barqaror, 100°C da sublimatsiya qiladi, 400°C gacha termik barqaror",
  
  historicalFact: {
    title: "Ferrosen — organometallik kimyoning tug'ilishi",
    text: "Fe(C₅H₅)₂ — 1951-yilda tasodifan kashf etilgan birinchi metallocen. Pauson va Kealy (Duquesne universiteti) siklopentadienil magniy bromid (C₅H₅MgBr) ni FeCl₃ bilan reaksiyaga kiritganda, kutilmagan sariq kristallar hosil bo'ldi. Dastlab ular σ-bog'li strukturani taklif qilishdi, lekin 1952-yilda Wilkinson va Woodward (Garvard) hamda Fischer (Myunxen) mustaqil ravishda 'sandwich' strukturasini taklif qilishdi — Fe²⁺ ikkita parallel C₅H₅⁻ halqalari orasida. Bu kashfiyot organometallik kimyo sohasini yaratdi va Wilkinson bilan Fischer 1973-yilda Nobel mukofotini olishdi. Ferrosen bugungi kunda organometallik kimyoning eng muhim birikmalaridan biri — katalizator, yoqilg'i qo'shimchasi, materialshunoslikda qo'llaniladi.",
    year: "1951-1973"
  },

  uniqueICPFeature: {
    title: "Fe(C₅H₅)₂ — Sublimatsiya muammosi (100°C da)",
    description: "Bu birikma ICP tahlilida jiddiy muammo — 100°C da sublimatsiya qiladi! Agar kapsula yomon yopilsa, namuna yo'qoladi va natija noto'g'ri bo'ladi.",
    problem: {
      title: "Sublimatsiya — 100°C da qattiq→gaz",
      description: "Ferrosen 100°C da sublimatsiya qiladi — qattiq holatdan to'g'ridan-to'g'ri gazga o'tadi. ICP yoqish kamerasi 1050°C da ishlaydi — agar kapsula yomon yopilsa, ferrosen sublimatsiya qilib yo'qoladi!",
      impact: "Natija noto'g'ri — Fe miqdori haqiqatdan past ko'rinadi (5-20% past)"
    },
    solution: {
      title: "Zich yopilgan kapsula + tez analiz",
      description: "Kapsula zich yopilishi kerak — sublimatsiya oldini olish uchun. Namuna tayyorlangandan keyin 30 daqiqa ichida analiz qilinishi kerak.",
      mechanism: "Zich yopilgan kapsula ichida ferrosen sublimatsiya qilsa ham, kapsula ichida qoladi va keyin to'liq yonadi. Tez analiz — sublimatsiya vaqtini kamaytiradi."
    }
  },

  icpOES: {
    instrument: "ICP-OES (Inductively Coupled Plasma Optical Emission Spectroscopy)",
    plasma: "Argon plazma, 6000-10000 K",
    nebulizer: "Pnevmatik nebulayzer (Meinhard tip)",
    parameters: {
      Fe: {
        lambda_primary: "238.204 nm",
        lambda_secondary: "259.940 nm",
        lod: 0.5,
        linearRange: "0.5 - 500 mg/L",
        notes: "238.2 nm eng sezgir. Ferrosen inertligi tufayli plazmada to'liq atomlanadi."
      }
    }
  },

  icpMS: {
    instrument: "ICP-MS (Inductively Coupled Plasma Mass Spectrometry)",
    plasma: "Argon plazma, 6000-10000 K",
    massAnalyzer: "Kvadrupol mass analizator",
    collisionCell: "He KED rejimi — ArO⁺ interferensiyasi uchun",
    parameters: {
      Fe: {
        mz_primary: 56,
        isotope_primary: "⁵⁶Fe (91.75%)",
        isotopes: [
          { isotope: "⁵⁴Fe", mz: 54, abundance: 5.85 },
          { isotope: "⁵⁶Fe", mz: 56, abundance: 91.75 },
          { isotope: "⁵⁷Fe", mz: 57, abundance: 2.12 },
          { isotope: "⁵⁸Fe", mz: 58, abundance: 0.28 }
        ],
        lod_standard: 0.5,
        lod_collision: 0.3,
        linearRange: "0.3 - 100 μg/L",
        interference: "⁴⁰Ar¹⁶O⁺ (m/z=56) — He KED shart!",
        internalStandard: "Sc (m/z=45) — Fe ga yaqin massa"
      }
    }
  },

  theoretical: {
    Fe:  { mass: 55.845,  percent: 30.018, source: "Markaziy Fe²⁺ atomi", icpSignal: "ICP-OES 238.2 nm / ICP-MS m/z=56" },
    C:   { mass: 120.110, percent: 64.565, source: "2×C₅H₅ (10×C)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" },
    H:   { mass: 10.080,  percent: 5.417,  source: "2×C₅H₅ (10×H)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" }
  },

  isotopeProfile: {
    Fe: {
      title: "Temir izotoplari — ICP-MS da ko'rinadigan profil",
      isotopes: [
        { isotope: "⁵⁴Fe", mz: 54, abundance: 5.85, color: "#22c55e" },
        { isotope: "⁵⁶Fe", mz: 56, abundance: 91.75, color: "#3b82f6" },
        { isotope: "⁵⁷Fe", mz: 57, abundance: 2.12, color: "#f59e0b" },
        { isotope: "⁵⁸Fe", mz: 58, abundance: 0.28, color: "#ef4444" }
      ],
      note: "⁵⁶Fe (91.8%) — asosiy izotop, lekin ⁴⁰Ar¹⁶O⁺ (m/z=56) bilan interferensiya! He KED majburiy."
    }
  },

  internalStandards: {
    title: "Ichki standartlar — instrumental drift va matritsa effektlarini tuzatish",
    description: "Har bir namuna va standartga qo'shiladigan elementlar. Signal nisbati (Analyte/IS) orqali aniq natija olinadi.",
    standards: [
      {
        element: "Sc (Skandiy)",
        mz: 45,
        concentration: "10 μg/L",
        purpose: "Fe uchun ideal ichki standart",
        reason: "Sc massasi (45) Fe (56) ga yaqin — matritsa effektlarini yaxshi tuzatadi",
        interference: "Interferensiyasiz (mononuklid ⁴⁵Sc 100%)"
      },
      {
        element: "Ge (Germaniy)",
        mz: 72,
        concentration: "10 μg/L",
        purpose: "Alternativ ichki standart",
        reason: "Ge massasi (72) Fe (56) dan uzoq, lekin matritsa effektlarini yaxshi tuzatadi",
        interference: "Kam interferensiya"
      },
      {
        element: "Rh (Rodiy)",
        mz: 103,
        concentration: "10 μg/L",
        purpose: "Og'ir elementlar uchun (alternativa)",
        reason: "Fe dan uzoq massa, lekin ba'zi matritsalarda yaxshi ishlaydi",
        interference: "Mononuklid ¹⁰³Rh (100%)"
      }
    ]
  },

  calibrationCurve: [
    { conc: 0.0, intensity: 0, note: "Blank (2% HNO₃ + 10 μg/L Sc)" },
    { conc: 5.0, intensity: 25000, note: "Standart 1" },
    { conc: 10.0, intensity: 50100, note: "Standart 2" },
    { conc: 25.0, intensity: 125250, note: "Standart 3" },
    { conc: 50.0, intensity: 250500, note: "Standart 4" },
    { conc: 100.0, intensity: 501000, note: "Standart 5" }
  ],

  experimentalRuns: [
    { id: "ICP-24-1001", date: "2025-12-10", mode: "ICP-MS (Fe, KED)", conc_mgL: 90.0, intensity: 451000, percent: 30.00, rsd: 0.8, note: "To'g'ri natija — zich yopilgan kapsula" },
    { id: "ICP-24-1002", date: "2025-12-10", mode: "ICP-MS (Fe, KED)", conc_mgL: 90.2, intensity: 452000, percent: 30.07, rsd: 0.7, note: "Ikkinchi parallel" },
    { id: "ICP-24-1003", date: "2025-12-10", mode: "ICP-OES (Fe)", conc_mgL: 90.1, intensity: 450500, percent: 30.03, rsd: 1.2, note: "ICP-OES (238.2 nm)" },
    { id: "ICP-24-1004", date: "2025-12-11", mode: "ICP-MS (⁵⁷Fe)", conc_mgL: 90.0, intensity: 10600, percent: 30.00, rsd: 1.5, note: "⁵⁷Fe ishlatildi (ArO⁺ muammosi yo'q)" },
    { id: "ICP-24-1005", date: "2025-12-11", mode: "ICP-MS (Fe, KED yo'q)", conc_mgL: 25.0, intensity: 125000, percent: 8.33, rsd: 8.5, note: "⚠ Sublimatsiya — kapsula yomon yopilgan!" },
    { id: "ICP-24-1006", date: "2025-12-11", mode: "ICP-MS (Fe, KED yo'q)", conc_mgL: 18.0, intensity: 90000, percent: 6.00, rsd: 12.2, note: "⚠ Kapsula ochiq qolgan — sublimatsiya!" },
    { id: "BLANK-11",   date: "2025-12-10", mode: "ICP-MS", conc_mgL: 0.1, intensity: 500, percent: 0.03, rsd: 0.0, note: "Blank (2% HNO₃)" },
    { id: "STD-Fe-50",  date: "2025-12-10", mode: "ICP-MS", conc_mgL: 50.0, intensity: 250000, percent: 0.00, rsd: 0.5, note: "NIST Fe standarti (50 μg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 50.0 ± 0.1 mg Fe(C₅H₅)₂ tortiladi. To'q sariq kristallar — ferrosen belgisi.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 10 mL 2% HNO₃ qo'shiladi. Ferrosen HNO₃ da eriydi va Fe³⁺ ga oksidlanadi.", time: "10 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "2% HNO₃ bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~500 mg/L ≈ 150 mg/L Fe.", time: "1 daq", critical: false },
    { step: 4, title: "Ichki standart qo'shish", desc: "1 mL namunaga 10 μL Sc eritmasi (1000 μg/L) qo'shiladi. Natija: 10 μg/L Sc — har bir namuna va standartda bir xil.", time: "2 daq", critical: true },
    { step: 5, title: "Suyultirish", desc: "Agar konsentratsiya ICP diapazonidan yuqori bo'lsa, 10× yoki 100× suyuqlantiriladi.", time: "3 daq", critical: false },
    { step: 6, title: "ICP-MS da o'lchash (KED bilan)", desc: "Fe: m/z=56 (He KED rejimi!). ArO⁺ interferensiyasi bartaraf etiladi.", time: "3-5 daq/namuna", critical: true },
    { step: 7, title: "ICP-OES da o'lchash (alternativa)", desc: "Fe: 238.2 nm yoki 259.9 nm. Ichki standart nisbati (Fe/Sc) orqali aniq natija.", time: "2-3 daq/namuna", critical: false },
    { step: 8, title: "Natijalarni hisoblash", desc: "%Fe hisoblanadi. Nazariy: 30.02%. EHTIYOT: Kapsula zich yopilganligini tekshiring!", time: "1 daq", critical: false }
  ],

  matrixEffects: {
    title: "Matritsa effekti — organik matritsa (siklopentadienil) muammosi",
    description: "Fe(C₅H₅)₂ organik matritsaga ega (siklopentadienil C₅H₅ — 64.6% C, 5.4% H). Bu ICP uchun matritsa effekti yaratadi.",
    problems: [
      {
        problem: "Sublimatsiya muammosi",
        description: "Ferrosen 100°C da sublimatsiya qiladi — agar kapsula yomon yopilsa, namuna yo'qoladi va natija noto'g'ri bo'ladi.",
        solution: "Kapsula zich yopilishi kerak! Namuna tayyorlangandan keyin 30 daqiqa ichida analiz qilinishi kerak."
      },
      {
        problem: "Organik matritsa (siklopentadienil)",
        description: "C₅H₅ organik matritsa — ICP plazmasida CO₂ va H₂O ga oksidlanadi. ArO⁺ poliatomik ion hosil bo'ladi — ⁵⁶Fe bilan interferensiya!",
        solution: "He KED rejimi majburiy! ArO⁺ interferensiyasini bartaraf etish uchun."
      },
      {
        problem: "Fe²⁺ inertligi",
        description: "Ferrosen inert kompleks — ligand almashinishi juda sekin. ICP plazmasida to'liq atomlanadi (bu muammo emas).",
        solution: "Hech narsa kerak emas — ICP plazmasi (10000 K) barcha bog'larni uzadi."
      }
    ]
  },

  aasComparison: {
    title: "ICP vs AAS — Fe(C₅H₅)₂ uchun",
    comparison: [
      { feature: "Metallar soni", ICP: "1 (Fe)", AAS: "1 (Fe)" },
      { feature: "LOD (Fe)", ICP: "0.3 ng/L (ICP-MS KED)", AAS: "5 μg/L (GFAAS)" },
      { feature: "Izotop ma'lumoti", ICP: "Ha (⁵⁴Fe, ⁵⁶Fe, ⁵⁷Fe, ⁵⁸Fe)", AAS: "Yo'q" },
      { feature: "Interferensiya", ICP: "ArO⁺ (He KED bilan hal)", AAS: "Kam" },
      { feature: "Sublimatsiya", ICP: "Kapsula zich yopilishi kerak", AAS: "Kapsula zich yopilishi kerak" },
      { feature: "Narxi", ICP: "$$$ (qimmat)", AAS: "$ (arzon)" }
    ]
  },

  relatedMethods: [
    {
      name: "EA (Element Analiz)",
      role: "C (64.6%), H (5.4%) — organik qismni tasdiqlaydi",
      icpAdvantage: "ICP metallarni, EA organik qismni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq formula validatsiyasi",
      complementarity: "98%"
    },
    {
      name: "⁵⁷Fe Mössbauer",
      role: "Fe²⁺ ning δ (isomer siljish) va ΔE_Q (kvadrupol ajralish)",
      icpAdvantage: "Mössbauer Fe²⁺ ni aniq aniqlaydi",
      icpDisadvantage: "ICP miqdoriy, Mössbauer oksidlanish holatini",
      complementarity: "95%"
    },
    {
      name: "¹H YaMR",
      role: "C₅H₅ protonlari (δ = 4.15 ppm, singlet)",
      icpAdvantage: "YaMR organik qismni ko'rsatadi",
      icpDisadvantage: "ICP miqdoriy, YaMR sifat",
      complementarity: "94%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Ferrosen d-d o'tishlari (440 nm, sariq rang)",
      icpAdvantage: "UV-Vis ferrosenni aniqlaydi",
      icpDisadvantage: "ICP miqdoriy, UV-Vis sifat",
      complementarity: "92%"
    }
  ]
}

function calculateFePercent(conc_mgL, sampleMass, dilutionFactor) {
  const totalVolume = 100
  const Fe_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Fe_percent = (Fe_mass_mg / sampleMass) * 100
  return {
    Fe_mass: parseFloat(Fe_mass_mg.toFixed(3)),
    Fe_percent: parseFloat(Fe_percent.toFixed(2))
  }
}

function getStatusColor(delta) {
  if (delta <= 0.5) return "text-green-400"
  if (delta <= 1.5) return "text-yellow-400"
  return "text-red-400"
}

function getElColor(el) {
  if (el === "Fe") return "text-amber-400"
  return "text-purple-400"
}

function getRowClass(el) {
  if (el === "Fe") return ""
  return "opacity-50"
}

export default function FeC5H52Page() {
  const [activeRun, setActiveRun] = useState("ICP-24-1001")
  const [customConc, setCustomConc] = useState(90.0)
  const [customMass, setCustomMass] = useState(50.0)
  const [dilutionFactor, setDilutionFactor] = useState(1)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)
  const [showSublimationModal, setShowSublimationModal] = useState(true)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const deltaFe = Math.abs(run.percent - COMPOUND.theoretical.Fe.percent)
  const statusColor = getStatusColor(deltaFe)

  const calcResult = useMemo(() => 
    calculateFePercent(customConc, customMass, dilutionFactor),
    [customConc, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-amber-950/20 to-blue-950 text-white">
      
      {/* SUBLIMATSIYA OGOHLANTIRISH MODALI */}
      {showSublimationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-orange-950 to-red-950 border-2 border-orange-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> SUBLIMATSIYA OGOHLANTIRISHI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-orange-300">Fe(C₅H₅)₂ (Ferrosen)</strong> 100°C da <strong className="text-orange-300">sublimatsiya qiladi</strong> — qattiq holatdan to'g'ridan-to'g'ri gazga o'tadi!
            </p>
            
            <div className="bg-orange-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-orange-400 font-bold mb-2">Muammo:</div>
                  <div className="text-purple-200">
                    Agar kapsula yomon yopilsa, ferrosen sublimatsiya qilib yo'qoladi. Natija noto'g'ri — Fe miqdori <strong className="text-orange-300">5-20% past</strong> ko'rinadi.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">Yechim:</div>
                  <div className="text-purple-200">
                    Kapsula <strong className="text-green-300">zich yopilishi</strong> kerak! Namuna tayyorlangandan keyin <strong className="text-green-300">30 daqiqa ichida</strong> analiz qilinishi kerak.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-orange-300">Laboratoriya misollari:</strong> ICP-24-1005 da kapsula yomon yopilgan — Fe 8.33% (haqiqat: 30.02%). ICP-24-1006 da kapsula ochiq qolgan — Fe 6.00%!
              </p>
            </div>

            <button 
              onClick={() => setShowSublimationModal(false)}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
            >
              Tushundim — sahifani davom ettirish
            </button>
          </div>
        </div>
      )}
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/icp" className="hover:text-purple-300">ICP-OES / ICP-MS</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/icp/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
            <span className="text-purple-600">›</span>
            <span className="text-amber-400 font-semibold">Fe(C₅H₅)₂</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-amber-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🧬 ICP</span>
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
                <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Fe²⁺ d⁶</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">⚠ Sublimatsiya</span>
                <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Metallocen</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Nobel 1973</span>
              </div>
            </div>
            <Link href="/ilmiy/tahlil/icp/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Barcha birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-amber-900/40 to-purple-900/40 border border-amber-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (ICP uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">Fe(C₅H₅)₂</strong> — birinchi kashf etilgan metallocen (sandwich strukturasi), organometallik kimyoning asosi. ICP tahlilida <strong className="text-amber-300">muhim namuna</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-amber-500 text-xs md:text-sm">
                <li><strong className="text-white">Fe yuqori massa</strong> (55.85) — yuqori massa izotoplar</li>
                <li><strong className="text-red-300">Sublimatsiya muammosi</strong> — 100°C da sublimatsiya!</li>
                <li>C, H <strong className="text-white">ICP da ko'rinmaydi</strong> — EA kerak</li>
                <li>Fe²⁺ <strong className="text-amber-300">inert</strong> — plazmada to'liq atomlanadi</li>
                <li>ArO⁺ interferensiyasi <strong className="text-red-300">mavjud</strong> — He KED majburiy</li>
                <li>LOD: ICP-MS da <strong className="text-green-300">0.3 ng/L</strong> (KED bilan)</li>
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

        {/* 2. SUBLIMATSIYA MUAMMOSI */}
        <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border-2 border-orange-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span> {COMPOUND.uniqueICPFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.uniqueICPFeature.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-red-950/40 rounded-xl p-5 border-2 border-red-500/50">
              <h3 className="text-red-400 font-bold text-sm mb-3">❌ Muammo: {COMPOUND.uniqueICPFeature.problem.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-red-400 font-bold">Muammo:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.problem.description}</div>
                </div>
                <div className="bg-red-900/30 rounded p-2">
                  <div className="text-red-300 font-bold">Ta'sir:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.problem.impact}</div>
                </div>
              </div>
            </div>

            <div className="bg-green-950/40 rounded-xl p-5 border-2 border-green-500/50">
              <h3 className="text-green-400 font-bold text-sm mb-3">✅ Yechim: {COMPOUND.uniqueICPFeature.solution.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-green-400 font-bold">Mexanizm:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.solution.description}</div>
                </div>
                <div className="bg-green-900/30 rounded p-2">
                  <div className="text-green-300 font-bold">Zich yopish + tez analiz:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSublimationModal(true)}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
          >
            ⚠️ Sublimatsiya haqida batafsil →
          </button>
        </div>

        {/* 3. ICP-OES PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> ICP-OES parametrlari (Fe uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-OES — atom emissiya spektroskopiya. Fe <strong className="text-amber-300">238.2 nm</strong> yoki <strong className="text-amber-300">259.9 nm</strong> da nurlanadi. Ferrosen inertligi tufayli plazmada to'liq atomlanadi.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="bg-amber-950/40 rounded-xl p-4 border border-amber-700/30">
              <h4 className="text-amber-400 font-bold text-sm mb-3">Fe (Temir) parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-amber-400 font-bold">{COMPOUND.icpOES.parameters.Fe.lambda_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (alternativ):</span>
                  <span className="font-mono text-amber-400">{COMPOUND.icpOES.parameters.Fe.lambda_secondary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.icpOES.parameters.Fe.lod} μg/L</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpOES.parameters.Fe.linearRange}</span>
                </div>
                <div className="bg-amber-900/30 rounded p-2 mt-2">
                  <span className="text-amber-300 text-[10px]">📝 {COMPOUND.icpOES.parameters.Fe.notes}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
            <h4 className="text-cyan-400 font-bold text-xs mb-2">Umumiy ICP-OES parametrlari:</h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-purple-400">Instrument:</div>
                <div className="text-white text-[10px]">{COMPOUND.icpOES.instrument}</div>
              </div>
              <div>
                <div className="text-purple-400">Plazma:</div>
                <div className="text-white text-[10px]">{COMPOUND.icpOES.plasma}</div>
              </div>
              <div>
                <div className="text-purple-400">Nebulayzer:</div>
                <div className="text-white text-[10px]">{COMPOUND.icpOES.nebulizer}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. ICP-MS PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧬</span> ICP-MS parametrlari (Fe uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-MS — mass-spektrometriya. Fe ning bir nechta izotopi bor, lekin <strong className="text-amber-300">⁵⁶Fe (91.8%)</strong> asosiy. ⁴⁰Ar¹⁶O⁺ interferensiyasi tufayli <strong className="text-red-300">He KED majburiy</strong>!
          </p>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="bg-amber-950/40 rounded-xl p-4 border-2 border-amber-500/50">
              <h4 className="text-amber-400 font-bold text-sm mb-3">Fe (Temir) — He KED rejimi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">m/z (asosiy):</span>
                  <span className="font-mono text-amber-400 font-bold">{COMPOUND.icpMS.parameters.Fe.mz_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Asosiy izotop:</span>
                  <span className="font-mono text-amber-400">{COMPOUND.icpMS.parameters.Fe.isotope_primary}</span>
                </div>
                <div className="flex justify-between bg-green-900/30 rounded p-2">
                  <span className="text-green-400">LOD (KED):</span>
                  <span className="font-mono text-green-400 font-bold">{COMPOUND.icpMS.parameters.Fe.lod_collision} ng/L ✓</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpMS.parameters.Fe.linearRange}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Ichki standart:</span>
                  <span className="font-mono text-cyan-300">{COMPOUND.icpMS.parameters.Fe.internalStandard}</span>
                </div>
                <div className="bg-red-900/30 rounded p-2 mt-2">
                  <span className="text-red-300 text-[10px]">⚠ {COMPOUND.icpMS.parameters.Fe.interference}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
            <h4 className="text-cyan-400 font-bold text-xs mb-2">Umumiy ICP-MS parametrlari:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-purple-400">Instrument:</div>
                <div className="text-white text-[10px]">{COMPOUND.icpMS.instrument}</div>
              </div>
              <div>
                <div className="text-purple-400">Plazma:</div>
                <div className="text-white text-[10px]">{COMPOUND.icpMS.plasma}</div>
              </div>
              <div>
                <div className="text-purple-400">Mass analizator:</div>
                <div className="text-white text-[10px]">{COMPOUND.icpMS.massAnalyzer}</div>
              </div>
              <div>
                <div className="text-purple-400">Collision Cell:</div>
                <div className="text-red-300 text-[10px] font-bold">{COMPOUND.icpMS.collisionCell}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. NAZARIY TARKIB */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📐</span> Nazariy element tarkibi (ICP kontekstida)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            ICP <strong className="text-amber-300">faqat Fe</strong> ni o'lchaydi (ICP-OES). C, H ICP da ko'rinmaydi — ularni EA bilan tekshirish kerak.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 text-xs uppercase tracking-wider">
                  <th className="py-3 text-left pl-2">Element</th>
                  <th className="py-3 text-center">Massa</th>
                  <th className="py-3 text-center text-yellow-400">% (m/m)</th>
                  <th className="py-3 text-center">Manba</th>
                  <th className="py-3 text-left pl-4">ICP signali</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => {
                  const rowClass = getRowClass(el)
                  const elColor = getElColor(el)
                  const trClass = "border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors " + rowClass
                  const tdElClass = "py-3 pl-2 font-bold " + elColor
                  return (
                    <tr key={el} className={trClass}>
                      <td className={tdElClass}>{el}</td>
                      <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                      <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                      <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                      <td className="py-3 pl-4 text-[10px] text-purple-400">{d.icpSignal}</td>
                    </tr>
                  )
                })}
                <tr className="bg-amber-900/20 font-bold border-t border-amber-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-amber-300">ICP: Fe (30.02%) — faqat bitta metall</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. IZOTOP PROFILI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Fe izotop profili (ICP-MS)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            ICP-MS har bir izotopni <strong className="text-cyan-300">alohida detektlaydi</strong>. Fe ning 4 ta tabiiy izotopi bor. ⁵⁶Fe (91.8%) asosiy, lekin ⁴⁰Ar¹⁶O⁺ interferensiyasi bor!
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {[0, 20, 40, 60, 80, 100].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/100)*200} x2="580" y2={220 - (v/100)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/100)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v}%</text>
                </g>
              ))}

              <text x="315" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">m/z (mass/zaryad)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Tabiiy tarqalish (%)</text>

              {COMPOUND.isotopeProfile.Fe.isotopes.map((iso, i) => {
                const barWidth = 120
                const gap = 20
                const totalBars = COMPOUND.isotopeProfile.Fe.isotopes.length
                const startX = 50 + (600 - 50 - 50 - (totalBars * barWidth + (totalBars - 1) * gap)) / 2
                const x = startX + i * (barWidth + gap)
                const barHeight = (iso.abundance / 100) * 200
                const y = 220 - barHeight

                return (
                  <g key={i}>
                    <rect x={x} y={y} width={barWidth} height={barHeight} fill={iso.color} opacity="0.8" />
                    <text x={x + barWidth/2} y={y - 5} textAnchor="middle" fontSize="10" fill={iso.color} fontWeight="bold">
                      {iso.abundance}%
                    </text>
                    <text x={x + barWidth/2} y="235" textAnchor="middle" fontSize="10" fill="#a78bfa" fontWeight="bold">
                      {iso.isotope}
                    </text>
                    <text x={x + barWidth/2} y="248" textAnchor="middle" fontSize="8" fill="#a78bfa">
                      m/z={iso.mz}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="mt-3 p-3 bg-amber-900/20 rounded-lg border border-amber-700/30">
            <p className="text-xs text-purple-200">
              <strong className="text-amber-300">📝 {COMPOUND.isotopeProfile.Fe.note}</strong>
            </p>
          </div>
        </div>

        {/* 7. ICHKI STANDARTLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> {COMPOUND.internalStandards.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.internalStandards.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMPOUND.internalStandards.standards.map((std, i) => (
              <div key={i} className="bg-cyan-950/40 rounded-xl p-4 border border-cyan-500/30">
                <h4 className="text-cyan-400 font-bold text-sm mb-3 flex items-center gap-2">
                  <span>{std.element}</span>
                  <span className="text-[10px] bg-cyan-600/30 px-2 py-0.5 rounded">m/z={std.mz}</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between bg-purple-950/60 rounded p-2">
                    <span className="text-purple-400">Konsentratsiya:</span>
                    <span className="font-mono text-white">{std.concentration}</span>
                  </div>
                  <div className="flex justify-between bg-purple-950/60 rounded p-2">
                    <span className="text-purple-400">Maqsad:</span>
                    <span className="text-cyan-300 text-[10px]">{std.purpose}</span>
                  </div>
                  <div className="bg-purple-950/60 rounded p-2">
                    <div className="text-purple-400 text-[10px] mb-1">Sabab:</div>
                    <div className="text-purple-200 text-[10px]">{std.reason}</div>
                  </div>
                  <div className="bg-green-900/30 rounded p-2">
                    <span className="text-green-300 text-[10px]">✓ {std.interference}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. KALIBRLASH EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> Kalibrlash egri chizig'i (Fe, ICP-MS KED)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Fe standartlari (2% HNO₃ + ichki standart Sc) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-amber-300">R² = 0.9999</strong> — deyarli mukammal chiziqli bog'liqliq.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - v*200} x2="580" y2={220 - v*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - v*200} textAnchor="end" fontSize="9" fill="#a78bfa">{(v * 100).toFixed(0)}</text>
                </g>
              ))}

              {[0, 5, 10, 25, 50, 100].map((c, i) => (
                <g key={i}>
                  <text x={50 + (c/100)*530} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="315" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Fe konsentratsiyasi (μg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik (counts)</text>

              <line x1="50" y1="220" x2="580" y2={220 - 200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/100)*530
                const y = 220 - (p.intensity/501000)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#f59e0b" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#fcd34d">
                        {(p.intensity/1000).toFixed(0)}k
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (90.0/100)*530
                const y = 220 - (451000/501000)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (90.0 μg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="450" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />
              <text x="510" y="48" textAnchor="middle" fontSize="10" fill="#fcd34d" fontWeight="bold">
                R² = 0.9999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya</span>
          </div>
        </div>

        {/* 9. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> ICP yugurishlari — Fe tahlili (sublimatsiya muammosi!)
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Fe <strong className="text-amber-300">He KED rejimi</strong> bilan o'lchanadi (ArO⁺ interferensiyasi tufayli). EHTIYOT: Sublimatsiya muammosi — kapsula zich yopilishi kerak!
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns.map(r => {
              const isOES = r.mode.includes("ICP-OES")
              const is57Fe = r.mode.includes("⁵⁷Fe")
              const isNoKED = r.mode.includes("KED yo'q")
              const isSublimation = r.id === "ICP-24-1005" || r.id === "ICP-24-1006"
              const isActive = activeRun === r.id
              let btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
              if (isActive) {
                if (isOES) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                else if (is57Fe) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/20"
                else if (isNoKED) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20"
                else if (isSublimation) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20"
                else btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/20"
              } else {
                if (isOES) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-cyan-900/30 border-cyan-700/30 text-cyan-300 hover:border-cyan-500"
                else if (is57Fe) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-green-900/30 border-green-700/30 text-green-300 hover:border-green-500"
                else if (isNoKED || isSublimation) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-red-900/30 border-red-700/30 text-red-300 hover:border-red-500"
              }
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={btnClass}
                >
                  {r.id.split('-').pop()} {isOES && "OES"} {is57Fe && "⁵⁷Fe"} {(isNoKED || isSublimation) && "⚠"}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
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
                    <span className="text-sm text-purple-300">Rejim:</span>
                    <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                      run.mode.includes("ICP-OES") ? "bg-cyan-900/30 text-cyan-300" : 
                      run.mode.includes("⁵⁷Fe") ? "bg-green-900/30 text-green-300" : 
                      run.mode.includes("KED yo'q") ? "bg-red-900/30 text-red-300" : "bg-amber-900/30 text-amber-300"
                    }`}>{run.mode}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-amber-900/20 rounded border border-amber-500/20">
                    <span className="text-sm text-amber-400 font-medium">C (μg/L):</span>
                    <span className="font-mono text-white text-lg">{run.conc_mgL.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Fe:</span>
                    <span className="font-mono text-white text-lg">{run.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Fe:</span>
                    <span className="font-mono text-amber-400">{COMPOUND.theoretical.Fe.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaFe.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-amber-400 mb-4 flex justify-between">
                <span>%Fe Qiymatlari (sublimatsiya muammosi!)</span>
                <span className="text-[10px] text-purple-500 font-normal">Nazariy: 30.02%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const val = r.percent
                  const heightPct = Math.min((val / 35) * 100, 100)
                  const isActive = r.id === activeRun
                  const isOES = r.mode.includes("ICP-OES")
                  const is57Fe = r.mode.includes("⁵⁷Fe")
                  const isNoKED = r.mode.includes("KED yo'q")
                  const isSublimation = r.id === "ICP-24-1005" || r.id === "ICP-24-1006"
                  let barClass = "w-full rounded-t transition-all duration-500 z-10 bg-purple-700/40"
                  if (isActive) {
                    if (isOES) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    else if (is57Fe) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    else if (isNoKED || isSublimation) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    else barClass = "w-full rounded-t transition-all duration-500 z-10 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  } else {
                    if (isOES) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-700/40"
                    else if (is57Fe) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-green-700/40"
                    else if (isNoKED || isSublimation) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-700/40"
                  }
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                        <div className="absolute w-[120%] border-t border-dashed border-amber-400/50 z-0" style={{ bottom: `${(30.018/35)*100}%` }}></div>

                        <div 
                          className={barClass}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isOES ? 'text-cyan-400' : is57Fe ? 'text-green-400' : isNoKED || isSublimation ? 'text-red-400' : 'text-amber-400') : 'text-purple-600'} font-bold`}>
                        {r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
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
              
              <h4 className="text-amber-400 font-bold text-sm mb-2">Fe (ICP-MS, He KED, m/z=56):</h4>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-purple-700">
                      <th className="py-2 px-3 text-left text-purple-300">C (μg/L)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Intensivlik (counts)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Izoh</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200 font-mono">
                    {COMPOUND.calibrationCurve.map((p, i) => (
                      <tr key={i} className="border-b border-purple-800/30">
                        <td className="py-2 px-3 text-amber-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.intensity.toLocaleString()}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-amber-900/20 rounded-lg border border-amber-700/30 text-xs text-purple-200">
                <strong className="text-amber-300">Fe regressiyasi:</strong> I = 5010 × C + 0, R² = 0.9999 (He KED bilan)
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

        {/* 10. MATRITSA EFEKTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span> {COMPOUND.matrixEffects.title}
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            {COMPOUND.matrixEffects.description}
          </p>

          <div className="space-y-4">
            {COMPOUND.matrixEffects.problems.map((m, i) => (
              <div key={i} className="bg-amber-950/40 rounded-xl p-4 border border-amber-700/30">
                <h4 className="text-amber-400 font-bold text-sm mb-2">{m.problem}</h4>
                <p className="text-purple-200 text-xs mb-3">{m.description}</p>
                <div className="bg-green-900/20 rounded-lg p-3 border border-green-700/30">
                  <div className="text-green-300 font-bold text-xs mb-1">✅ Yechim:</div>
                  <div className="text-purple-200 text-xs">{m.solution}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 11. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> ICP uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            Fe(C₅H₅)₂ uchun <strong className="text-amber-300">2% HNO₃</strong> ishlatiladi. EHTIYOT: Sublimatsiya muammosi — kapsula zich yopilishi kerak! Ichki standart (Sc) har bir namunaga qo'shiladi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => {
                const isActive = activePrepStep === s.step
                const btnClass = isActive
                  ? "w-full text-left p-3 rounded-lg border transition-all bg-amber-900/40 border-amber-500"
                  : "w-full text-left p-3 rounded-lg border transition-all bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                return (
                  <button
                    key={s.step}
                    onClick={() => setActivePrepStep(s.step)}
                    className={btnClass}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? "bg-amber-500 text-white" : "bg-purple-800 text-purple-400"
                      }`}>
                        {s.step}
                      </span>
                      <span className="text-xs font-medium text-white">{s.title}</span>
                      {s.critical && <span className="ml-auto text-[10px] text-red-400">KRITIK</span>}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="lg:col-span-2 bg-purple-950/50 rounded-xl p-6 border border-purple-700/30">
              {(() => {
                const current = COMPOUND.samplePrepSteps.find(s => s.step === activePrepStep)
                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-purple-700/30 pb-3">
                      <h3 className="text-lg font-bold text-amber-400">Qadam {current.step}: {current.title}</h3>
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

        {/* 12. HISOBLAGICH */}
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6">
          <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> ICP dan %Fe hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Fe konsentratsiyasini kiriting — <strong className="text-amber-300">%Fe</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Fe konsentratsiyasi (μg/L):</label>
              <input 
                type="number" step="0.1" value={customConc}
                onChange={(e) => setCustomConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-amber-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-amber-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-amber-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-purple-400">Fe massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-amber-400">{calcResult.Fe_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Fe:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult.Fe_percent - 30.02) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Fe_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Fe = (C(μg/L) × V(mL) × DF) / (m(mg) × 1000) × 100
            </p>
          </div>
        </div>

        {/* 13. AAS BILAN TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚖️</span> {COMPOUND.aasComparison.title}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-2 px-3 text-left text-purple-300">Xususiyat</th>
                  <th className="py-2 px-3 text-left text-cyan-300">ICP</th>
                  <th className="py-2 px-3 text-left text-yellow-300">AAS</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.aasComparison.comparison.map((c, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-2 px-3 text-purple-400">{c.feature}</td>
                    <td className="py-2 px-3">{c.ICP}</td>
                    <td className="py-2 px-3">{c.AAS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 14. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-amber-900/40 to-purple-900/40 border border-amber-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> ICP ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            Fe(C₅H₅)₂ uchun ICP ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-amber-300">to'liq formula validatsiyasi</strong> uchun muhim. <strong className="text-pink-300">EA</strong> va <strong className="text-pink-300">Mössbauer</strong> eng kuchli qo'shimcha metodlar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-amber-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-amber-300">{m.name}</h3>
                  <div className="text-right">
                    <div className="text-[10px] text-purple-400">To'ldiruvchi</div>
                    <div className="text-lg font-bold text-green-400">{m.complementarity}</div>
                  </div>
                </div>
                <p className="text-xs text-purple-200 mb-3">{m.role}</p>
                <div className="space-y-2 text-[10px]">
                  <div className="flex gap-2">
                    <span className="text-green-400">✓ ICP afzalligi:</span>
                    <span className="text-purple-300">{m.icpAdvantage}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-400">✗ ICP kamchiligi:</span>
                    <span className="text-purple-300">{m.icpDisadvantage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-amber-900/20 border border-amber-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-amber-300 mb-2">💡 To'liq formula validatsiyasi uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">ICP-MS (Fe, KED) + EA (C, H) + ⁵⁷Fe Mössbauer (δ) + ¹H YaMR (δ = 4.15 ppm) + UV-Vis (440 nm)</strong> — beshta metod birgalikda Fe(C₅H₅)₂ ni to'liq tasdiqlaydi va metallocen strukturani aniqlaydi.
            </p>
          </div>
        </div>

        {/* 15. ICP CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> ICP ning Fe(C₅H₅)₂ uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                ICP Fe(C₅H₅)₂ ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Sublimatsiya muammosi</strong> — kapsula zich yopilishi kerak!</li>
                <li><strong className="text-red-300">Faqat Fe ni o'lchaydi</strong> — C, H uchun EA kerak</li>
                <li><strong className="text-red-300">ArO⁺ interferensiyasi</strong> — He KED majburiy</li>
                <li><strong className="text-red-300">Yuqori Fe konsentratsiyasi</strong> — suyuqlantirish kerak</li>
                <li><strong className="text-red-300">Qimmat instrument</strong> — AAS dan 10-20× qimmat</li>
                <li><strong className="text-red-300">Murakkab ishlatish</strong> — malakali operator kerak</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>Fe(C₅H₅)₂ ni to'liq tasdiqlash</strong> uchun kamida 5 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-amber-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. ICP-MS (Fe, KED)</span>
                  <span className="text-amber-400 font-mono">30.02%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (C, H)</span>
                  <span className="text-amber-400 font-mono">64.57%, 5.42%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. ⁵⁷Fe Mössbauer</span>
                  <span className="text-amber-400 font-mono">δ = 0.54 mm/s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. ¹H YaMR</span>
                  <span className="text-amber-400 font-mono">δ = 4.15 ppm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. UV-Vis (d-d)</span>
                  <span className="text-amber-400 font-mono">440 nm</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 5 ta metod birgalikda Fe(C₅H₅)₂ ni to'liq tasdiqlaydi va metallocen strukturani aniqlaydi
              </div>
            </div>
          </div>
        </div>

        {/* 16. XULOSA */}
        <div className="bg-gradient-to-r from-green-900/30 via-indigo-900/30 to-purple-900/30 border border-green-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Yakuniy xulosa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-950/30 p-4 rounded-lg border border-green-700/30">
              <div className="text-green-400 text-2xl mb-2">✓</div>
              <h3 className="font-bold text-white mb-1">ICP afzalligi</h3>
              <p className="text-xs text-purple-200"><strong className="text-amber-300">Fe ni</strong> ppb darajasida o'lchaydi (KED bilan). Yuqori massa izotoplar. Inert kompleks tufayli tayyorlash oson.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-amber-300">Sublimatsiya muammosi!</strong> Kapsula zich yopilishi kerak. ArO⁺ interferensiyasi — He KED majburiy. C, H ko'rinmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EA (C, H), ⁵⁷Fe Mössbauer (δ = 0.54 mm/s), ¹H YaMR (δ = 4.15 ppm), UV-Vis (440 nm) — metallocen strukturani tasdiqlash.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/icp" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← ICP metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/icp/birikmalar" className="text-sm bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • Fe(C₅H₅)₂ • ICP moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, NIST Isotope Data, Wilkinson & Fischer (1973 Nobel)</p>
        </div>
      </footer>
    </main>
  )
}