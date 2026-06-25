"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// K₃[Cr(C₂O₄)₃]·3H₂O — ICP-OES / ICP-MS MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, NIST Isotope Data
// Xususiyat: Okzalat xelat kompleksi (bidentat C₂O₄²⁻), ⁴⁰Ar¹²C⁺ interferensiyasi
// O'ziga xoslik: Xiral kompleks (Δ/Λ enantiomerlar), Cr³⁺ inert
// Maqsad: Faqat ICP tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Cr: 51.996, K: 39.098, C: 12.011, H: 1.008, O: 15.999
}

const COMPOUND = {
  formulaHTML: "K<sub>3</sub>[Cr(C<sub>2</sub>O<sub>4</sub>)<sub>3</sub>]·3H<sub>2</sub>O",
  formulaPlain: "K3[Cr(C2O4)3]·3H2O",
  iupac: "Kaliy trioksalatokromat(III) trihidrat",
  formulaExpanded: "K₃CrC₆O₁₅H₆",
  commonName: "Kaliy trioksalatokromat(III) (yashil kristallar)",
  molarMass: 491.33,
  casNumber: "13964-09-5",
  color: "to'q yashil kristallar",
  stability: "havoda barqaror, xelat effekti (log β₃ ≈ 21), inert Cr³⁺ kompleksi",
  
  historicalFact: {
    title: "Xiral kompleks — Werner ning mutlaq konfiguratsiya isboti",
    text: "K₃[Cr(C₂O₄)₃]·3H₂O — koordinatsion kimyoning eng muhim komplekslaridan biri. Bu birikma xiral (optically active) — Δ va Λ enantiomerlarga ajratilgan birinchi oktaedr komplekslaridan biri. 1911-yilda Alfred Werner bu kompleksni rezolyutsiya qildi va uning optik faolligini ko'rsatdi. Bu Werner koordinatsion nazariyasining mutlaq to'g'riligini isbotladi — uglerodsiz kompleks ham xiral bo'lishi mumkin! Okzalat (C₂O₄²⁻) bidentat ligand — 5 a'zoli xelat halqasi hosil qiladi (Cr-O-C-C-O). Bu xelat effekti tufayli kompleks juda barqaror (log β₃ ≈ 21). ICP tahlilida bu birikma muhim: ⁵²Cr (83.8%) asosiy izotop, lekin ⁴⁰Ar¹²C⁺ interferensiyasi (m/z=52) jiddiy muammo — He collision cell majburiy!",
    year: "1911-yil"
  },

  uniqueICPFeature: {
    title: "K₃[Cr(C₂O₄)₃]·3H₂O — ⁴⁰Ar¹²C⁺ interferensiyasi (⁵²Cr da)",
    description: "Bu birikma ICP-MS tahlilida jiddiy muammo — ⁴⁰Ar¹²C⁺ poliatomik interferensiyasi ⁵²Cr (83.8%) bilan bir xil m/z da! Okzalat (C₂O₄²⁻) organik matritsada uglerod bor.",
    problem: {
      title: "⁴⁰Ar¹²C⁺ → m/z = 52",
      description: "Argon plazmasida Ar⁺ va C atomlari birlashib, ⁴⁰Ar¹²C⁺ poliatomik ionini hosil qiladi. Bu ionning mass/zaryad nisbati (m/z = 52) Cr ning eng ko'p tarqalgan izotopi ⁵²Cr (83.8% tabiiy) bilan bir xil! Okzalat matritsasida uglerod bor — ArC⁺ hosil bo'ladi.",
      impact: "Soxta signal — Cr miqdori haqiqatdan 3-8× yuqori ko'rinadi"
    },
    solution: {
      title: "He Collision Cell (KED rejimi)",
      description: "Collision cell ichiga He gazi kiritiladi. ArC⁺ kabi katta poliatomik ionlar He atomlari bilan to'qnashganda kinetik energiyasini yo'qotadi va mass analizatorga yetib bormaydi. Cr⁺ kabi kichik monoatomik ionlar esa to'siqdan o'tadi.",
      mechanism: "KED — Kinetic Energy Discrimination. Katta ionlar sekinlashadi → diskriminatsiya → faqat Cr⁺ detektlanadi. Alternativ: ⁵³Cr (9.5%) ishlatish — ArC⁺ muammosi yo'q."
    }
  },

  icpOES: {
    instrument: "ICP-OES (Inductively Coupled Plasma Optical Emission Spectroscopy)",
    plasma: "Argon plazma, 6000-10000 K",
    nebulizer: "Pnevmatik nebulayzer (Meinhard tip)",
    parameters: {
      Cr: {
        lambda_primary: "267.716 nm",
        lambda_secondary: "205.552 nm",
        lod: 0.5,
        linearRange: "0.5 - 500 mg/L",
        notes: "267.7 nm eng sezgir. Cr³⁺ inertligi tufayli plazmada to'liq atomlanadi."
      },
      K: {
        lambda_primary: "766.490 nm",
        lambda_secondary: "769.896 nm",
        lod: 5.0,
        linearRange: "5 - 1000 mg/L",
        notes: "766.5 nm eng sezgir. K⁺ tashqi sfera kationi."
      }
    }
  },

  icpMS: {
    instrument: "ICP-MS (Inductively Coupled Plasma Mass Spectrometry)",
    plasma: "Argon plazma, 6000-10000 K",
    massAnalyzer: "Kvadrupol mass analizator",
    collisionCell: "He KED rejimi — Cr uchun majburiy (ArC⁺ interferensiyasi)",
    parameters: {
      Cr: {
        mz_primary: 52,
        isotope_primary: "⁵²Cr (83.8%)",
        isotopes: [
          { isotope: "⁵⁰Cr", mz: 50, abundance: 4.35 },
          { isotope: "⁵²Cr", mz: 52, abundance: 83.79 },
          { isotope: "⁵³Cr", mz: 53, abundance: 9.50 },
          { isotope: "⁵⁴Cr", mz: 54, abundance: 2.36 }
        ],
        lod_standard: 0.3,
        lod_collision: 0.3,
        linearRange: "0.3 - 100 μg/L",
        interference: "⁴⁰Ar¹²C⁺ (m/z=52) — He KED shart!",
        internalStandard: "Sc (m/z=45) — Cr ga yaqin massa"
      },
      K: {
        mz_primary: 39,
        isotope_primary: "³⁹K (93.26%)",
        isotopes: [
          { isotope: "³⁹K", mz: 39, abundance: 93.26 },
          { isotope: "⁴⁰K", mz: 40, abundance: 0.012 },
          { isotope: "⁴¹K", mz: 41, abundance: 6.73 }
        ],
        lod_standard: 50,
        lod_collision: 50,
        linearRange: "50 - 1000 μg/L",
        interference: "⁴⁰Ar⁺ (m/z=40) — ⁴⁰K ga yaqin, lekin oz miqdorda",
        internalStandard: "Sc (m/z=45) — K ga yaqin massa"
      }
    }
  },

  theoretical: {
    Cr:  { mass: 51.996,  percent: 10.582, source: "Markaziy Cr³⁺ atomi", icpSignal: "ICP-OES 267.7 nm / ICP-MS m/z=52" },
    K:   { mass: 117.294, percent: 23.872, source: "3×K⁺ (tashqi sfera)", icpSignal: "ICP-OES 766.5 nm / ICP-MS m/z=39" },
    C:   { mass: 72.066,  percent: 14.669, source: "3×C₂O₄²⁻ (6×C)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" },
    H:   { mass: 6.048,   percent: 1.231,  source: "3×H₂O (6×H)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" },
    O:   { mass: 239.985, percent: 48.844, source: "3×C₂O₄²⁻ (12×O) + 3×H₂O (3×O)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" }
  },

  isotopeProfile: {
    Cr: {
      title: "Xrom izotoplari — ICP-MS da ko'rinadigan profil",
      isotopes: [
        { isotope: "⁵⁰Cr", mz: 50, abundance: 4.35, color: "#22c55e" },
        { isotope: "⁵²Cr", mz: 52, abundance: 83.79, color: "#3b82f6" },
        { isotope: "⁵³Cr", mz: 53, abundance: 9.50, color: "#f59e0b" },
        { isotope: "⁵⁴Cr", mz: 54, abundance: 2.36, color: "#ef4444" }
      ],
      note: "⁵²Cr (83.8%) — asosiy izotop, lekin ⁴⁰Ar¹²C⁺ (m/z=52) bilan interferensiya! ⁵³Cr (9.5%) alternativa sifatida ishlatiladi."
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
        purpose: "Cr uchun ideal ichki standart",
        reason: "Sc massasi (45) Cr (52) ga yaqin — matritsa effektlarini yaxshi tuzatadi",
        interference: "Interferensiyasiz (mononuklid ⁴⁵Sc 100%)"
      },
      {
        element: "Ge (Germaniy)",
        mz: 72,
        concentration: "10 μg/L",
        purpose: "Alternativ ichki standart",
        reason: "Ge massasi (72) Cr (52) dan uzoq, lekin matritsa effektlarini yaxshi tuzatadi",
        interference: "Kam interferensiya"
      },
      {
        element: "Rh (Rodiy)",
        mz: 103,
        concentration: "10 μg/L",
        purpose: "Og'ir elementlar uchun (alternativa)",
        reason: "Cr dan uzoq massa, lekin ba'zi matritsalarda yaxshi ishlaydi",
        interference: "Mononuklid ¹⁰³Rh (100%)"
      }
    ]
  },

  calibrationCurve_Cr: [
    { conc: 0.0, intensity: 0, note: "Blank (2% HNO₃ + 10 μg/L Sc)" },
    { conc: 5.0, intensity: 25000, note: "Standart 1" },
    { conc: 10.0, intensity: 50100, note: "Standart 2" },
    { conc: 25.0, intensity: 125250, note: "Standart 3" },
    { conc: 50.0, intensity: 250500, note: "Standart 4" },
    { conc: 100.0, intensity: 501000, note: "Standart 5" }
  ],

  calibrationCurve_K: [
    { conc: 0.0, intensity: 0, note: "Blank (2% HNO₃ + 10 μg/L Sc)" },
    { conc: 10.0, intensity: 8000, note: "Standart 1" },
    { conc: 25.0, intensity: 20000, note: "Standart 2" },
    { conc: 50.0, intensity: 40000, note: "Standart 3" },
    { conc: 100.0, intensity: 80000, note: "Standart 4" },
    { conc: 250.0, intensity: 200000, note: "Standart 5" }
  ],

  experimentalRuns_Cr: [
    { id: "ICP-24-701", date: "2025-10-10", mode: "ICP-MS (Cr, KED)", conc_mgL: 26.5, intensity: 132500, percent: 10.60, rsd: 1.0, note: "To'g'ri natija — He KED bilan ArC⁺ bartaraf etildi" },
    { id: "ICP-24-702", date: "2025-10-10", mode: "ICP-MS (Cr, KED)", conc_mgL: 26.4, intensity: 132000, percent: 10.56, rsd: 0.9, note: "Ikkinchi parallel (KED)" },
    { id: "ICP-24-703", date: "2025-10-10", mode: "ICP-MS (Cr, KED)", conc_mgL: 26.6, intensity: 133000, percent: 10.64, rsd: 1.1, note: "Uchinchi parallel (KED)" },
    { id: "ICP-24-704", date: "2025-10-11", mode: "ICP-OES (Cr)", conc_mgL: 26.5, intensity: 132500, percent: 10.60, rsd: 1.3, note: "ICP-OES (267.7 nm)" },
    { id: "ICP-24-705", date: "2025-10-11", mode: "ICP-MS (⁵³Cr)", conc_mgL: 26.5, intensity: 30200, percent: 10.60, rsd: 1.5, note: "⁵³Cr ishlatildi (ArC⁺ muammosi yo'q)" },
    { id: "ICP-24-706", date: "2025-10-11", mode: "ICP-MS (Cr, KED yo'q)", conc_mgL: 185.0, intensity: 925000, percent: 74.00, rsd: 9.2, note: "⚠ ArC⁺ interferensiyasi — Cr 7× ortiqcha!" },
    { id: "BLANK-08",   date: "2025-10-10", mode: "ICP-MS", conc_mgL: 0.1, intensity: 500, percent: 0.04, rsd: 0.0, note: "Blank (2% HNO₃)" },
    { id: "STD-Cr-50",  date: "2025-10-10", mode: "ICP-MS", conc_mgL: 50.0, intensity: 250000, percent: 0.00, rsd: 0.6, note: "NIST Cr standarti (50 μg/L)" }
  ],

  experimentalRuns_K: [
    { id: "ICP-24-801", date: "2025-10-10", mode: "ICP-MS (K)", conc_mgL: 59.6, intensity: 47680, percent: 23.84, rsd: 1.8, note: "K tahlili (standart rejim)" },
    { id: "ICP-24-802", date: "2025-10-10", mode: "ICP-MS (K)", conc_mgL: 59.8, intensity: 47840, percent: 23.92, rsd: 1.7, note: "Ikkinchi parallel" },
    { id: "ICP-24-803", date: "2025-10-10", mode: "ICP-OES (K)", conc_mgL: 59.7, intensity: 47760, percent: 23.88, rsd: 2.1, note: "ICP-OES (766.5 nm)" },
    { id: "BLANK-09",   date: "2025-10-10", mode: "ICP-MS", conc_mgL: 0.5, intensity: 400, percent: 0.20, rsd: 0.0, note: "Blank (2% HNO₃)" },
    { id: "STD-K-100",  date: "2025-10-10", mode: "ICP-MS", conc_mgL: 100.0, intensity: 80000, percent: 0.00, rsd: 0.6, note: "NIST K standarti (100 μg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 50.0 ± 0.1 mg K₃[Cr(C₂O₄)₃]·3H₂O tortiladi. To'q yashil kristallar — Cr³⁺ belgisi.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 10 mL 2% HNO₃ qo'shiladi. Kislota kompleksni to'liq eritadi va metallarni ion holatida saqlaydi. EHTIYOT: Okzalat HNO₃ da CO₂ ga oksidlanadi!", time: "15 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "2% HNO₃ bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~500 mg/L ≈ 53 mg/L Cr, 119 mg/L K.", time: "1 daq", critical: false },
    { step: 4, title: "Ichki standart qo'shish", desc: "1 mL namunaga 10 μL Sc eritmasi (1000 μg/L) qo'shiladi. Natija: 10 μg/L Sc — har bir namuna va standartda bir xil.", time: "2 daq", critical: true },
    { step: 5, title: "Suyultirish", desc: "Agar konsentratsiya ICP diapazonidan yuqori bo'lsa, 10× yoki 100× suyuqlantiriladi.", time: "3 daq", critical: false },
    { step: 6, title: "ICP-MS da o'lchash (KED bilan)", desc: "Cr: m/z=52 (He KED rejimi!). ArC⁺ interferensiyasi bartaraf etiladi.", time: "3-5 daq/namuna", critical: true },
    { step: 7, title: "ICP-OES da o'lchash (alternativa)", desc: "Cr: 267.7 nm, K: 766.5 nm. Ichki standart nisbati (Cr/Sc, K/Sc) orqali aniq natija.", time: "2-3 daq/namuna", critical: false },
    { step: 8, title: "Natijalarni hisoblash", desc: "%Cr va %K alohida hisoblanadi. Nazariy: 10.58% Cr, 23.87% K.", time: "1 daq", critical: false }
  ],

  matrixEffects: {
    title: "Matritsa effekti — organik matritsa (okzalat) muammosi",
    description: "K₃[Cr(C₂O₄)₃]·3H₂O organik matritsaga ega (okzalat C₂O₄²⁻ — 14.7% C, 48.8% O). Bu ICP uchun jiddiy matritsa effekti yaratadi.",
    problems: [
      {
        problem: "Konus tiqilib qolishi",
        description: "Yuqori tuz konsentratsiyasi (23.9% K) sampler va skimmer konuslarida cho'kma hosil qiladi — signal vaqt o'tishi bilan kamayadi (drift).",
        solution: "Namunani 10× yoki 100× suyuqlantirish. Ichki standart qo'shish (drift tuzatish)."
      },
      {
        problem: "Organik matritsa (okzalat)",
        description: "C₂O₄²⁻ organik matritsa — ICP plazmasida CO₂ ga oksidlanadi. ArC⁺ poliatomik ion hosil bo'ladi — ⁵²Cr bilan interferensiya!",
        solution: "He KED rejimi majburiy! ArC⁺ interferensiyasini bartaraf etish uchun."
      },
      {
        problem: "Cr³⁺ xelat inertligi",
        description: "Cr³⁺ xelat kompleksi — ligand almashinishi juda sekin. ICP plazmasida to'liq atomlanadi (bu muammo emas).",
        solution: "Hech narsa kerak emas — ICP plazmasi (10000 K) barcha bog'larni uzadi."
      }
    ]
  },

  aasComparison: {
    title: "ICP vs AAS — K₃[Cr(C₂O₄)₃]·3H₂O uchun",
    comparison: [
      { feature: "Metallar soni", ICP: "2 (Cr + K bir vaqtda)", AAS: "1 (Cr, ketma-ket)" },
      { feature: "LOD (Cr)", ICP: "0.3 ng/L (ICP-MS KED)", AAS: "5 μg/L (GFAAS)" },
      { feature: "Izotop ma'lumoti", ICP: "Ha (⁵⁰Cr, ⁵²Cr, ⁵³Cr, ⁵⁴Cr)", AAS: "Yo'q" },
      { feature: "Interferensiya", ICP: "ArC⁺ (He KED bilan hal)", AAS: "Kam" },
      { feature: "Vaqt (bir namuna)", ICP: "~5 daqiqa (Cr + K birga)", AAS: "~10 daqiqa (faqat Cr)" },
      { feature: "Narxi", ICP: "$$$ (qimmat)", AAS: "$ (arzon)" }
    ]
  },

  relatedMethods: [
    {
      name: "EA (Element Analiz)",
      role: "C (14.67%), H (1.23%) — organik qismni tasdiqlaydi",
      icpAdvantage: "ICP metallarni, EA organik qismni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq formula validatsiyasi",
      complementarity: "98%"
    },
    {
      name: "CD spektroskopiya",
      role: "Δ va Λ enantiomerlarni farqlaydi (optik faollik)",
      icpAdvantage: "CD xiral kompleksni aniqlaydi (ICP farqlay olmaydi!)",
      icpDisadvantage: "ICP miqdoriy, CD sifat",
      complementarity: "95%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Cr³⁺ ning d-d o'tishlari (410 nm, 560 nm) — yashil rang",
      icpAdvantage: "UV-Vis Cr³⁺ ni aniqlaydi",
      icpDisadvantage: "ICP miqdoriy, UV-Vis sifat",
      complementarity: "92%"
    },
    {
      name: "Ion xromatografiya (IC)",
      role: "C₂O₄²⁻ (3×) — tashqi sfera anionlarini aniqlaydi",
      icpAdvantage: "IC anionlarni, ICP metallni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq validatsiya",
      complementarity: "90%"
    }
  ]
}

function calculateCrPercent(conc_mgL, sampleMass, dilutionFactor) {
  const totalVolume = 100
  const Cr_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Cr_percent = (Cr_mass_mg / sampleMass) * 100
  return {
    Cr_mass: parseFloat(Cr_mass_mg.toFixed(3)),
    Cr_percent: parseFloat(Cr_percent.toFixed(2))
  }
}

function calculateKPercent(conc_mgL, sampleMass, dilutionFactor) {
  const totalVolume = 100
  const K_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const K_percent = (K_mass_mg / sampleMass) * 100
  return {
    K_mass: parseFloat(K_mass_mg.toFixed(3)),
    K_percent: parseFloat(K_percent.toFixed(2))
  }
}

function getStatusColor(delta) {
  if (delta <= 0.5) return "text-green-400"
  if (delta <= 1.5) return "text-yellow-400"
  return "text-red-400"
}

function getElColor(el) {
  if (el === "Cr") return "text-emerald-400"
  if (el === "K") return "text-amber-400"
  return "text-purple-400"
}

function getRowClass(el) {
  if (el === "Cr" || el === "K") return ""
  return "opacity-50"
}

export default function K3CrC2O43Page() {
  const [activeRun_Cr, setActiveRun_Cr] = useState("ICP-24-701")
  const [activeRun_K, setActiveRun_K] = useState("ICP-24-801")
  const [customConc_Cr, setCustomConc_Cr] = useState(26.5)
  const [customConc_K, setCustomConc_K] = useState(59.6)
  const [customMass, setCustomMass] = useState(50.0)
  const [dilutionFactor, setDilutionFactor] = useState(1)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run_Cr = COMPOUND.experimentalRuns_Cr.find(r => r.id === activeRun_Cr) || COMPOUND.experimentalRuns_Cr[0]
  const run_K = COMPOUND.experimentalRuns_K.find(r => r.id === activeRun_K) || COMPOUND.experimentalRuns_K[0]
  
  const deltaCr = Math.abs(run_Cr.percent - COMPOUND.theoretical.Cr.percent)
  const deltaK = Math.abs(run_K.percent - COMPOUND.theoretical.K.percent)
  const statusColor_Cr = getStatusColor(deltaCr)
  const statusColor_K = getStatusColor(deltaK)

  const calcResult_Cr = useMemo(() => 
    calculateCrPercent(customConc_Cr, customMass, dilutionFactor),
    [customConc_Cr, customMass, dilutionFactor]
  )

  const calcResult_K = useMemo(() => 
    calculateKPercent(customConc_K, customMass, dilutionFactor),
    [customConc_K, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-emerald-950/20 to-blue-950 text-white">
      
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
            <span className="text-emerald-400 font-semibold">K₃[Cr(C₂O₄)₃]·3H₂O</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-400 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-emerald-900/30 border border-emerald-700/50 text-emerald-400 text-[10px] uppercase tracking-wide">Cr³⁺ d³</span>
                <span className="px-2 py-1 rounded bg-fuchsia-900/30 border border-fuchsia-700/50 text-fuchsia-400 text-[10px] uppercase tracking-wide">Xelat (bidentat)</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">⚠ ArC⁺</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Xiral (Δ/Λ)</span>
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
        <div className="bg-gradient-to-r from-emerald-900/40 to-purple-900/40 border border-emerald-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (ICP uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">K₃[Cr(C₂O₄)₃]·3H₂O</strong> — xrom(III) ning trioksalato xelat kompleksi, Werner nazariyasining klassik namunasi. ICP tahlilida <strong className="text-emerald-300">muhim namuna</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-emerald-500 text-xs md:text-sm">
                <li><strong className="text-white">Cr va K ni bir vaqtda</strong> o'lchash mumkin (ICP-OES)</li>
                <li><strong className="text-red-300">⁴⁰Ar¹²C⁺ interferensiyasi</strong> ⁵²Cr bilan — He KED majburiy!</li>
                <li>Cr³⁺ <strong className="text-emerald-300">xelat effekti</strong> — juda barqaror (log β₃ ≈ 21)</li>
                <li>C, H, O <strong className="text-white">ICP da ko'rinmaydi</strong> — EA kerak</li>
                <li><strong className="text-fuchsia-300">Xiral kompleks</strong> — Δ/Λ enantiomerlar (ICP farqlay olmaydi!)</li>
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

        {/* 2. ArC⁺ INTERFERENSIYA */}
        <div className="bg-gradient-to-r from-emerald-900/40 to-red-900/40 border-2 border-emerald-700/70 rounded-2xl p-6">
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
                  <div className="text-red-400 font-bold">Poliatomik ion:</div>
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
                  <div className="text-green-300 font-bold">KED / Alternativ:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ICP-OES PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> ICP-OES parametrlari (Cr va K uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-OES — atom emissiya spektroskopiya. Cr <strong className="text-emerald-300">267.7 nm</strong>, K <strong className="text-emerald-300">766.5 nm</strong> da nurlanadi. ICP-OES da ikkalasini bir vaqtda o'lchash mumkin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-700/30">
              <h4 className="text-emerald-400 font-bold text-sm mb-3">Cr (Xrom) parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-emerald-400 font-bold">{COMPOUND.icpOES.parameters.Cr.lambda_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (alternativ):</span>
                  <span className="font-mono text-emerald-400">{COMPOUND.icpOES.parameters.Cr.lambda_secondary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.icpOES.parameters.Cr.lod} μg/L</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpOES.parameters.Cr.linearRange}</span>
                </div>
                <div className="bg-emerald-900/30 rounded p-2 mt-2">
                  <span className="text-emerald-300 text-[10px]">📝 {COMPOUND.icpOES.parameters.Cr.notes}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-950/40 rounded-xl p-4 border border-amber-700/30">
              <h4 className="text-amber-400 font-bold text-sm mb-3">K (Kaliy) parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-amber-400 font-bold">{COMPOUND.icpOES.parameters.K.lambda_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (alternativ):</span>
                  <span className="font-mono text-amber-400">{COMPOUND.icpOES.parameters.K.lambda_secondary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-yellow-400">{COMPOUND.icpOES.parameters.K.lod} μg/L</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpOES.parameters.K.linearRange}</span>
                </div>
                <div className="bg-amber-900/30 rounded p-2 mt-2">
                  <span className="text-amber-300 text-[10px]">📝 {COMPOUND.icpOES.parameters.K.notes}</span>
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
            <span>🧬</span> ICP-MS parametrlari (Cr va K uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-MS — mass-spektrometriya. Cr ning bir nechta izotopi bor, lekin <strong className="text-emerald-300">⁵²Cr (83.8%)</strong> asosiy. ⁴⁰Ar¹²C⁺ interferensiyasi tufayli <strong className="text-red-300">He KED majburiy</strong>! Alternativ: ⁵³Cr (9.5%) ishlatish.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-emerald-950/40 rounded-xl p-4 border-2 border-emerald-500/50">
              <h4 className="text-emerald-400 font-bold text-sm mb-3">Cr (Xrom) — He KED rejimi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">m/z (asosiy):</span>
                  <span className="font-mono text-emerald-400 font-bold">{COMPOUND.icpMS.parameters.Cr.mz_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Asosiy izotop:</span>
                  <span className="font-mono text-emerald-400">{COMPOUND.icpMS.parameters.Cr.isotope_primary}</span>
                </div>
                <div className="flex justify-between bg-green-900/30 rounded p-2">
                  <span className="text-green-400">LOD (KED):</span>
                  <span className="font-mono text-green-400 font-bold">{COMPOUND.icpMS.parameters.Cr.lod_collision} ng/L ✓</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpMS.parameters.Cr.linearRange}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Ichki standart:</span>
                  <span className="font-mono text-cyan-300">{COMPOUND.icpMS.parameters.Cr.internalStandard}</span>
                </div>
                <div className="bg-red-900/30 rounded p-2 mt-2">
                  <span className="text-red-300 text-[10px]">⚠ {COMPOUND.icpMS.parameters.Cr.interference}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-950/40 rounded-xl p-4 border border-amber-700/30">
              <h4 className="text-amber-400 font-bold text-sm mb-3">K (Kaliy) — Standart rejim:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">m/z (asosiy):</span>
                  <span className="font-mono text-amber-400 font-bold">{COMPOUND.icpMS.parameters.K.mz_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Asosiy izotop:</span>
                  <span className="font-mono text-amber-400">{COMPOUND.icpMS.parameters.K.isotope_primary}</span>
                </div>
                <div className="flex justify-between bg-green-900/30 rounded p-2">
                  <span className="text-green-400">LOD (standart):</span>
                  <span className="font-mono text-green-400 font-bold">{COMPOUND.icpMS.parameters.K.lod_standard} ng/L ✓</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpMS.parameters.K.linearRange}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Ichki standart:</span>
                  <span className="font-mono text-cyan-300">{COMPOUND.icpMS.parameters.K.internalStandard}</span>
                </div>
                <div className="bg-green-900/30 rounded p-2 mt-2">
                  <span className="text-green-300 text-[10px]">✓ {COMPOUND.icpMS.parameters.K.interference}</span>
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
            ICP <strong className="text-emerald-300">Cr va K</strong> ni o'lchaydi (ICP-OES). C, H, O ICP da ko'rinmaydi — ularni EA bilan tekshirish kerak.
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
                <tr className="bg-emerald-900/20 font-bold border-t border-emerald-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-emerald-300">ICP: Cr (10.58%) + K (23.87%) = 34.45%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. IZOTOP PROFILI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Cr izotop profili (ICP-MS)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            ICP-MS har bir izotopni <strong className="text-cyan-300">alohida detektlaydi</strong>. Cr ning 4 ta tabiiy izotopi bor. ⁵²Cr (83.8%) asosiy, lekin ⁴⁰Ar¹²C⁺ interferensiyasi bor!
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

              {COMPOUND.isotopeProfile.Cr.isotopes.map((iso, i) => {
                const barWidth = 100
                const gap = 20
                const totalBars = COMPOUND.isotopeProfile.Cr.isotopes.length
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

          <div className="mt-3 p-3 bg-emerald-900/20 rounded-lg border border-emerald-700/30">
            <p className="text-xs text-purple-200">
              <strong className="text-emerald-300">📝 {COMPOUND.isotopeProfile.Cr.note}</strong>
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
              <span>📈</span> Kalibrlash egri chizig'i (Cr va K, ICP)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveRun_Cr("ICP-24-701")}
                className={activeRun_Cr === "ICP-24-701" ? "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-emerald-600 text-white" : "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-purple-900/50 text-purple-300"}
              >
                Cr (KED)
              </button>
              <button
                onClick={() => setActiveRun_K("ICP-24-801")}
                className={activeRun_K === "ICP-24-801" ? "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-amber-600 text-white" : "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-purple-900/50 text-purple-300"}
              >
                K
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
            Cr va K standartlari (2% HNO₃ + ichki standart Sc) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-emerald-300">R² = 0.9999</strong> — deyarli mukammal chiziqli bog'liqliq.
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
              <text x="315" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Cr konsentratsiyasi (μg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik (counts)</text>

              <line x1="50" y1="220" x2="580" y2={220 - 200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve_Cr.map((p, i) => {
                const x = 50 + (p.conc/100)*530
                const y = 220 - (p.intensity/501000)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#10b981" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#6ee7b7">
                        {(p.intensity/1000).toFixed(0)}k
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (26.5/100)*530
                const y = 220 - (132500/501000)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (26.5 μg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="450" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#10b981" strokeWidth="1" />
              <text x="510" y="48" textAnchor="middle" fontSize="10" fill="#6ee7b7" fontWeight="bold">
                R² = 0.9999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya</span>
          </div>
        </div>

        {/* 9. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> ICP yugurishlari — Cr va K alohida
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Cr <strong className="text-emerald-300">He KED rejimi</strong> bilan o'lchanadi (ArC⁺ interferensiyasi tufayli). K esa standart rejimda. Alternativ: ⁵³Cr ishlatish.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns_Cr.map(r => {
              const isOES = r.mode.includes("ICP-OES")
              const isNoKED = r.mode.includes("KED yo'q")
              const is53Cr = r.mode.includes("⁵³Cr")
              const isActive = activeRun_Cr === r.id
              let btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
              if (isActive) {
                if (isOES) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                else if (isNoKED) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20"
                else if (is53Cr) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/20"
                else btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              } else {
                if (isOES) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-cyan-900/30 border-cyan-700/30 text-cyan-300 hover:border-cyan-500"
                else if (isNoKED) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-red-900/30 border-red-700/30 text-red-300 hover:border-red-500"
                else if (is53Cr) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-green-900/30 border-green-700/30 text-green-300 hover:border-green-500"
              }
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun_Cr(r.id)}
                  className={btnClass}
                >
                  {r.id.split('-').pop()} {isOES && "OES"} {isNoKED && "⚠"} {is53Cr && "⁵³Cr"}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-purple-950/60 rounded-xl p-5 border border-purple-700/30">
                <div className="text-xs text-purple-500 uppercase tracking-wider mb-1">O'lchash ID</div>
                <div className="text-xl font-bold text-white font-mono">{run_Cr.id}</div>
                <div className="text-xs text-purple-400 mt-1">{run_Cr.date}</div>
                <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
                  📝 {run_Cr.note}
                </div>
                
                <div className="my-4 border-t border-purple-800/50"></div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Rejim:</span>
                    <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                      run_Cr.mode.includes("ICP-OES") ? "bg-cyan-900/30 text-cyan-300" : 
                      run_Cr.mode.includes("KED yo'q") ? "bg-red-900/30 text-red-300" : 
                      run_Cr.mode.includes("⁵³Cr") ? "bg-green-900/30 text-green-300" : "bg-emerald-900/30 text-emerald-300"
                    }`}>{run_Cr.mode}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-emerald-900/20 rounded border border-emerald-500/20">
                    <span className="text-sm text-emerald-400 font-medium">C (μg/L):</span>
                    <span className="font-mono text-white text-lg">{run_Cr.conc_mgL.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Cr:</span>
                    <span className="font-mono text-white text-lg">{run_Cr.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Cr:</span>
                    <span className="font-mono text-emerald-400">{COMPOUND.theoretical.Cr.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor_Cr}`}>{deltaCr.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-emerald-400 mb-4 flex justify-between">
                <span>%Cr Qiymatlari (KED vs ⁵³Cr vs OES)</span>
                <span className="text-[10px] text-purple-500 font-normal">Nazariy: 10.58%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns_Cr.map((r) => {
                  const val = r.percent
                  const heightPct = Math.min((val / 80) * 100, 100)
                  const isActive = r.id === activeRun_Cr
                  const isOES = r.mode.includes("ICP-OES")
                  const isNoKED = r.mode.includes("KED yo'q")
                  const is53Cr = r.mode.includes("⁵³Cr")
                  let barClass = "w-full rounded-t transition-all duration-500 z-10 bg-purple-700/40"
                  if (isActive) {
                    if (isOES) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    else if (isNoKED) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    else if (is53Cr) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    else barClass = "w-full rounded-t transition-all duration-500 z-10 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  } else {
                    if (isOES) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-700/40"
                    else if (isNoKED) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-700/40"
                    else if (is53Cr) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-green-700/40"
                  }
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun_Cr(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                        <div className="absolute w-[120%] border-t border-dashed border-emerald-400/50 z-0" style={{ bottom: `${(10.582/80)*100}%` }}></div>

                        <div 
                          className={barClass}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isOES ? 'text-cyan-400' : isNoKED ? 'text-red-400' : is53Cr ? 'text-green-400' : 'text-emerald-400') : 'text-purple-600'} font-bold`}>
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
              
              <h4 className="text-emerald-400 font-bold text-sm mb-2">Cr (ICP-MS, He KED, m/z=52):</h4>
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
                    {COMPOUND.calibrationCurve_Cr.map((p, i) => (
                      <tr key={i} className="border-b border-purple-800/30">
                        <td className="py-2 px-3 text-emerald-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.intensity.toLocaleString()}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="text-amber-400 font-bold text-sm mb-2">K (ICP-MS, m/z=39):</h4>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-purple-700">
                      <th className="py-2 px-3 text-left text-purple-300">C (mg/L)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Intensivlik (counts)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Izoh</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200 font-mono">
                    {COMPOUND.calibrationCurve_K.map((p, i) => (
                      <tr key={i} className="border-b border-purple-800/30">
                        <td className="py-2 px-3 text-amber-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.intensity.toLocaleString()}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-emerald-900/20 rounded-lg border border-emerald-700/30 text-xs text-purple-200">
                <strong className="text-emerald-300">Cr regressiyasi:</strong> I = 5010 × C + 0, R² = 0.9999 (He KED bilan)
              </div>
              <div className="mt-3 p-3 bg-amber-900/20 rounded-lg border border-amber-700/30 text-xs text-purple-200">
                <strong className="text-amber-300">K regressiyasi:</strong> I = 800 × C + 0, R² = 0.9999
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
              <div key={i} className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-700/30">
                <h4 className="text-emerald-400 font-bold text-sm mb-2">{m.problem}</h4>
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
            K₃[Cr(C₂O₄)₃]·3H₂O uchun <strong className="text-emerald-300">2% HNO₃</strong> ishlatiladi. EHTIYOT: Okzalat HNO₃ da CO₂ ga oksidlanadi! Ichki standart (Sc) har bir namunaga qo'shiladi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => {
                const isActive = activePrepStep === s.step
                const btnClass = isActive
                  ? "w-full text-left p-3 rounded-lg border transition-all bg-emerald-900/40 border-emerald-500"
                  : "w-full text-left p-3 rounded-lg border transition-all bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                return (
                  <button
                    key={s.step}
                    onClick={() => setActivePrepStep(s.step)}
                    className={btnClass}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? "bg-emerald-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-emerald-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6">
          <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> ICP dan %Cr va %K hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Ikkala element uchun alohida konsentratsiya kiriting — <strong className="text-emerald-300">%Cr</strong> va <strong className="text-amber-300">%K</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Cr konsentratsiyasi (μg/L):</label>
              <input 
                type="number" step="0.1" value={customConc_Cr}
                onChange={(e) => setCustomConc_Cr(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">K konsentratsiyasi (mg/L):</label>
              <input 
                type="number" step="0.1" value={customConc_K}
                onChange={(e) => setCustomConc_K(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-amber-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-purple-400">Cr massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-emerald-400">{calcResult_Cr.Cr_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Cr:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult_Cr.Cr_percent - 10.58) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult_Cr.Cr_percent}%
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">K massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-amber-400">{calcResult_K.K_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%K:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult_K.K_percent - 23.87) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult_K.K_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Cr = (C(μg/L) × V(mL) × DF) / (m(mg) × 1000) × 100; %K = (C(mg/L) × V(mL) × DF) / (m(mg)) × 100
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
        <div className="bg-gradient-to-r from-emerald-900/40 to-purple-900/40 border border-emerald-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> ICP ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            K₃[Cr(C₂O₄)₃]·3H₂O uchun ICP ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-emerald-300">to'liq formula validatsiyasi</strong> uchun muhim. <strong className="text-amber-300">CD</strong> va <strong className="text-cyan-300">UV-Vis</strong> eng kuchli qo'shimcha metodlar (xiral kompleks!).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-emerald-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-emerald-300">{m.name}</h3>
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

          <div className="mt-5 bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-emerald-300 mb-2">💡 To'liq formula validatsiyasi uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">ICP-MS (Cr, KED) + EA (C, H) + CD (Δ/Λ enantiomerlar) + UV-Vis (410, 560 nm) + IC (C₂O₄²⁻)</strong> — beshta metod birgalikda K₃[Cr(C₂O₄)₃]·3H₂O ni to'liq tasdiqlaydi va xiral kompleksni aniqlaydi.
            </p>
          </div>
        </div>

        {/* 15. ICP CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> ICP ning K₃[Cr(C₂O₄)₃]·3H₂O uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                ICP K₃[Cr(C₂O₄)₃]·3H₂O ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">⁴⁰Ar¹²C⁺ interferensiyasi</strong> — He KED majburiy (⁵²Cr da)</li>
                <li><strong className="text-red-300">Δ/Λ enantiomerlarni farqlay olmaydi</strong> — CD kerak</li>
                <li><strong className="text-red-300">Faqat Cr va K ni o'lchaydi</strong> — C, H, O uchun EA kerak</li>
                <li><strong className="text-red-300">C₂O₄²⁻ anionini ko'rmaydi</strong> — IC kerak</li>
                <li><strong className="text-red-300">Xelat effektini ko'rmaydi</strong> — UV-Vis kerak</li>
                <li><strong className="text-red-300">Qimmat instrument</strong> — AAS dan 10-20× qimmat</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>K₃[Cr(C₂O₄)₃]·3H₂O ni to'liq tasdiqlash</strong> uchun kamida 5 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-emerald-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. ICP-MS (Cr, KED)</span>
                  <span className="text-emerald-400 font-mono">10.58%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (C, H)</span>
                  <span className="text-emerald-400 font-mono">14.67%, 1.23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. CD (Δ/Λ)</span>
                  <span className="text-emerald-400 font-mono">xiral kompleks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. UV-Vis (d-d)</span>
                  <span className="text-emerald-400 font-mono">410, 560 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. IC (C₂O₄²⁻)</span>
                  <span className="text-emerald-400 font-mono">48.84% O</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 5 ta metod birgalikda K₃[Cr(C₂O₄)₃]·3H₂O ni to'liq tasdiqlaydi
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
              <p className="text-xs text-purple-200"><strong className="text-emerald-300">Cr va K ni bir vaqtda</strong> o'lchaydi (ICP-OES). ppb darajasida sezgirlik (KED bilan). Xelat inertligi tufayli tayyorlash oson.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-emerald-300">⁴⁰Ar¹²C⁺ interferensiyasi!</strong> He KED majburiy. Δ/Λ enantiomerlar farqlanmaydi. C, H, O ko'rinmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EA (C, H), CD (Δ/Λ), UV-Vis (410, 560 nm), IC (C₂O₄²⁻) — xiral kompleksni to'liq tasdiqlash uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/icp" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← ICP metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/icp/birikmalar" className="text-sm bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • K₃[Cr(C₂O₄)₃]·3H₂O • ICP moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, NIST Isotope Data, Werner (1911)</p>
        </div>
      </footer>
    </main>
  )
}