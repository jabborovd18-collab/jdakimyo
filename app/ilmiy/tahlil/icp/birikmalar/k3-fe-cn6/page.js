"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// K₃[Fe(CN)₆] — ICP-OES / ICP-MS MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, NIST Isotope Data
// Xususiyat: Ko'p elementli (Fe³⁺ + K⁺), ArO⁺ interferensiyasi, Fe³⁺ (ferritsianid)
// O'ziga xoslik: ICP Fe²⁺ va Fe³⁺ ni farqlay OLMAYDI!
// Maqsad: Faqat ICP tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Fe: 55.845, K: 39.098, C: 12.011, N: 14.007
}

const COMPOUND = {
  formulaHTML: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
  formulaPlain: "K3[Fe(CN)6]",
  iupac: "Kaliy geksatsianoferrat(III)",
  formulaExpanded: "K₃FeC₆N₆",
  commonName: "Qizil qon tuzi (Red prussiate of potash)",
  molarMass: 329.24,
  casNumber: "13746-66-2",
  color: "qizil kristallar",
  stability: "havoda barqaror, yorug'likda barqaror (Fe³⁺ allaqachon oksidlangan), suvda yaxshi eriydi",
  
  historicalFact: {
    title: "Qizil qon tuzi — oksidlovchi agent",
    text: "K₃[Fe(CN)₆] — K₄[Fe(CN)₆] (sariq qon tuzi) ning oksidlangan shakli. 1822-yilda Leopold Gmelin tomonidan sintez qilingan. Qizil qon tuzi kuchli oksidlovchi agent sifatida ishlatiladi — organik sintezda, fotografik jarayonlarda, metallografiyada (metall sirtini o'yma uchun). Qiziq tarixiy fakt: K₄[Fe(CN)₆] ni xlor yoki vodorod peroksid bilan oksidlab, K₃[Fe(CN)₆] olinadi. ICP tahlilida bu birikma juda muhim misol: ICP Fe²⁺ va Fe³⁺ ni farqlay OLMAYDI — ikkalasini ham umumiy Fe sifatida ko'rsatadi. Fe²⁺ va Fe³⁺ ni farqlash uchun Mössbauer spektroskopiya yoki UV-Vis kerak.",
    year: "1822-yil"
  },

  uniqueICPFeature: {
    title: "K₃[Fe(CN)₆] — ICP Fe²⁺ va Fe³⁺ ni farqlay OLMAYDI!",
    description: "Bu birikma ICP ning eng muhim cheklovini ko'rsatadi — oksidlanish darajasini aniqlay olmaslik.",
    problem: {
      title: "ICP oksidlanish darajasini ko'rmaydi",
      description: "ICP plazmasi (6000-10000 K) barcha kimyoviy bog'larni uzadi va elementlarni atomlashtiradi. Fe²⁺ va Fe³⁺ ikkalasi ham Fe atomlariga aylanadi — ICP ularni farqlay olmaydi.",
      impact: "K₃[Fe(CN)₆] (Fe³⁺) va K₄[Fe(CN)₆] (Fe²⁺) ikkalasi ham ICP da bir xil %Fe ko'rsatadi (agar konsentratsiya bir xil bo'lsa)"
    },
    solution: {
      title: "Mössbauer spektroskopiya",
      description: "Mössbauer spektroskopiya Fe²⁺ va Fe³⁺ ni aniq farqlaydi — ularning izomer siljishi (δ) va kvadrupol ajralishi (ΔE_Q) har xil.",
      mechanism: "Fe²⁺: δ ≈ 1.0-1.4 mm/s (yuqori spin) yoki 0.3-0.5 mm/s (past spin). Fe³⁺: δ ≈ 0.2-0.5 mm/s (yuqori spin) yoki 0.0-0.3 mm/s (past spin)."
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
        notes: "238.2 nm eng sezgir, lekin matritsa effektlariga sezgir"
      },
      K: {
        lambda_primary: "766.490 nm",
        lambda_secondary: "769.896 nm",
        lod: 5.0,
        linearRange: "5 - 1000 mg/L",
        notes: "Yuqori sezgirlik, lekin ionlanish interferensiyasi"
      }
    }
  },

  icpMS: {
    instrument: "ICP-MS (Inductively Coupled Plasma Mass Spectrometry)",
    plasma: "Argon plazma, 6000-10000 K",
    massAnalyzer: "Kvadrupol mass analizator",
    collisionCell: "He KED rejimi — Fe uchun majburiy!",
    parameters: {
      Fe: {
        mz_primary: 56,
        isotope_primary: "⁵⁶Fe (91.754%)",
        isotopes: [
          { isotope: "⁵⁴Fe", mz: 54, abundance: 5.845 },
          { isotope: "⁵⁶Fe", mz: 56, abundance: 91.754 },
          { isotope: "⁵⁷Fe", mz: 57, abundance: 2.119 },
          { isotope: "⁵⁸Fe", mz: 58, abundance: 0.282 }
        ],
        lod_standard: 5.0,
        lod_KED: 0.5,
        linearRange: "0.5 - 100 μg/L",
        interference: "⁴⁰Ar¹⁶O⁺ (m/z=56) — KED shart!",
        internalStandard: "Sc (m/z=45) — engil elementlar uchun"
      },
      K: {
        mz_primary: 39,
        isotope_primary: "³⁹K (93.258%)",
        isotopes: [
          { isotope: "³⁹K", mz: 39, abundance: 93.258 },
          { isotope: "⁴⁰K", mz: 40, abundance: 0.012 },
          { isotope: "⁴¹K", mz: 41, abundance: 6.730 }
        ],
        lod_standard: 50,
        lod_KED: 50,
        linearRange: "50 - 1000 μg/L",
        interference: "⁴⁰Ar⁺ (m/z=40) — ⁴⁰K ga yaqin, lekin oz miqdorda",
        internalStandard: "Ge (m/z=72) — o'rta massa elementlar uchun"
      }
    }
  },

  theoretical: {
    Fe:  { mass: 55.845,  percent: 16.962, source: "Markaziy Fe³⁺ atomi", icpSignal: "ICP-OES 238.2 nm / ICP-MS m/z=56" },
    K:   { mass: 117.294, percent: 35.623, source: "3×K⁺ (tashqi sfera)", icpSignal: "ICP-OES 766.5 nm / ICP-MS m/z=39" },
    C:   { mass: 72.066,  percent: 21.889, source: "6×CN⁻ (6×C)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" },
    N:   { mass: 84.042,  percent: 25.526, source: "6×CN⁻ (6×N)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" }
  },

  isotopeProfile: {
    Fe: {
      title: "Temir izotoplari — ICP-MS da ko'rinadigan profil",
      isotopes: [
        { isotope: "⁵⁴Fe", mz: 54, abundance: 5.845, color: "#22c55e" },
        { isotope: "⁵⁶Fe", mz: 56, abundance: 91.754, color: "#3b82f6" },
        { isotope: "⁵⁷Fe", mz: 57, abundance: 2.119, color: "#f59e0b" },
        { isotope: "⁵⁸Fe", mz: 58, abundance: 0.282, color: "#ef4444" }
      ],
      note: "⁵⁶Fe (91.8%) — asosiy izotop, lekin ⁴⁰Ar¹⁶O⁺ (m/z=56) bilan interferensiya!"
    },
    K: {
      title: "Kaliy izotoplari — ICP-MS da ko'rinadigan profil",
      isotopes: [
        { isotope: "³⁹K", mz: 39, abundance: 93.258, color: "#22c55e" },
        { isotope: "⁴⁰K", mz: 40, abundance: 0.012, color: "#f59e0b" },
        { isotope: "⁴¹K", mz: 41, abundance: 6.730, color: "#3b82f6" }
      ],
      note: "³⁹K (93.3%) — asosiy izotop, ⁴⁰Ar⁺ (m/z=40) interferensiyasi juda oz (⁴⁰K kam)"
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
        purpose: "Yengil elementlar uchun (Fe, K)",
        reason: "Sc massasi (45) Fe (56) va K (39) o'rtasida — ideal ichki standart",
        interference: "Interferensiyasiz (mononuklid ⁴⁵Sc 100%)"
      },
      {
        element: "Ge (Germaniy)",
        mz: 72,
        concentration: "10 μg/L",
        purpose: "O'rta massa elementlar uchun (K uchun alternativa)",
        reason: "Ge massasi (72) K (39) dan uzoq, lekin matritsa effektlarini yaxshi tuzatadi",
        interference: "Kam interferensiya"
      },
      {
        element: "Bi (Bismut)",
        mz: 209,
        concentration: "10 μg/L",
        purpose: "Og'ir elementlar uchun (bu birikma uchun shart emas)",
        reason: "Pt, Pb kabi og'ir metallar uchun. Fe va K uchun ishlatilmaydi.",
        interference: "Mononuklid ²⁰⁹Bi (100%)"
      }
    ]
  },

  calibrationCurve_Fe: [
    { conc: 0.0, intensity: 0, note: "Blank (2% HNO₃ + 10 μg/L Sc)" },
    { conc: 5.0, intensity: 25000, note: "Standart 1" },
    { conc: 10.0, intensity: 50200, note: "Standart 2" },
    { conc: 25.0, intensity: 125500, note: "Standart 3" },
    { conc: 50.0, intensity: 251000, note: "Standart 4" },
    { conc: 100.0, intensity: 502000, note: "Standart 5" }
  ],

  calibrationCurve_K: [
    { conc: 0.0, intensity: 0, note: "Blank (2% HNO₃ + 10 μg/L Ge)" },
    { conc: 10.0, intensity: 8000, note: "Standart 1" },
    { conc: 25.0, intensity: 20100, note: "Standart 2" },
    { conc: 50.0, intensity: 40200, note: "Standart 3" },
    { conc: 100.0, intensity: 80400, note: "Standart 4" },
    { conc: 250.0, intensity: 201000, note: "Standart 5" }
  ],

  experimentalRuns_Fe: [
    { id: "ICP-24-001", date: "2025-05-10", mode: "Standard (He KED yo'q)", conc_mgL: 185.0, intensity: 925000, percent: 55.56, rsd: 8.5, note: "⚠ ArO⁺ interferensiyasi — Fe 3.3× ortiqcha!" },
    { id: "ICP-24-002", date: "2025-05-10", mode: "He KED rejimi", conc_mgL: 55.8, intensity: 279000, percent: 16.76, rsd: 1.2, note: "✓ To'g'ri natija — KED bilan ArO⁺ bartaraf etildi" },
    { id: "ICP-24-003", date: "2025-05-10", mode: "He KED rejimi", conc_mgL: 55.7, intensity: 278500, percent: 16.73, rsd: 1.3, note: "Ikkinchi parallel (KED)" },
    { id: "ICP-24-004", date: "2025-05-10", mode: "He KED rejimi", conc_mgL: 55.9, intensity: 279500, percent: 16.79, rsd: 1.1, note: "Uchinchi parallel (KED)" },
    { id: "ICP-24-005", date: "2025-05-10", mode: "He KED rejimi", conc_mgL: 55.6, intensity: 278000, percent: 16.70, rsd: 1.4, note: "To'rtinchi parallel (KED)" },
    { id: "ICP-24-006", date: "2025-05-11", mode: "H₂ reaktiv rejim", conc_mgL: 56.0, intensity: 280000, percent: 16.82, rsd: 1.5, note: "H₂ rejimi ham ishlaydi (ArO⁺ + H₂ → Ar + H₂O)" },
    { id: "BLANK-01",   date: "2025-05-10", mode: "He KED", conc_mgL: 0.1, intensity: 500, percent: 0.03, rsd: 0.0, note: "Blank (2% HNO₃)" },
    { id: "STD-Fe-50",  date: "2025-05-10", mode: "He KED", conc_mgL: 50.0, intensity: 250000, percent: 0.00, rsd: 0.8, note: "NIST Fe standarti (50 μg/L)" }
  ],

  experimentalRuns_K: [
    { id: "ICP-24-101", date: "2025-05-10", mode: "Standard", conc_mgL: 117.2, intensity: 93760, percent: 35.60, rsd: 1.8, note: "K tahlili (standart rejim — interferensiya yo'q)" },
    { id: "ICP-24-102", date: "2025-05-10", mode: "Standard", conc_mgL: 117.5, intensity: 94000, percent: 35.69, rsd: 1.9, note: "Ikkinchi parallel" },
    { id: "ICP-24-103", date: "2025-05-10", mode: "Standard", conc_mgL: 116.9, intensity: 93520, percent: 35.51, rsd: 1.7, note: "Uchinchi parallel" },
    { id: "ICP-24-104", date: "2025-05-10", mode: "Standard", conc_mgL: 117.3, intensity: 93840, percent: 35.63, rsd: 1.8, note: "To'rtinchi parallel" },
    { id: "ICP-24-105", date: "2025-05-10", mode: "Standard", conc_mgL: 117.0, intensity: 93600, percent: 35.54, rsd: 1.8, note: "Beshinchi parallel" },
    { id: "BLANK-02",   date: "2025-05-10", mode: "Standard", conc_mgL: 0.5, intensity: 400, percent: 0.15, rsd: 0.0, note: "Blank" },
    { id: "STD-K-100",  date: "2025-05-10", mode: "Standard", conc_mgL: 100.0, intensity: 80000, percent: 0.00, rsd: 0.6, note: "NIST K standarti (100 μg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 50.0 ± 0.1 mg K₃[Fe(CN)₆] tortiladi. Qizil kristallar — Fe³⁺ belgisi.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 10 mL 2% HNO₃ qo'shiladi. Kislota kompleksni to'liq eritadi va metallarni ion holatida saqlaydi.", time: "10 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "2% HNO₃ bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~500 mg/L K₃[Fe(CN)₆] ≈ 85 mg/L Fe, 178 mg/L K.", time: "1 daq", critical: false },
    { step: 4, title: "Ichki standart qo'shish", desc: "1 mL namunaga 10 μL Sc/Ge aralashmasi (1000 μg/L) qo'shiladi. Natija: 10 μg/L Sc va Ge — har bir namuna va standartda bir xil.", time: "2 daq", critical: true },
    { step: 5, title: "Suyultirish (agar kerak)", desc: "Agar konsentratsiya ICP diapazonidan yuqori bo'lsa, 10× yoki 100× suyuqlantiriladi.", time: "3 daq", critical: false },
    { step: 6, title: "ICP-OES da o'lchash", desc: "Fe: 238.2 nm, K: 766.5 nm. Ichki standart nisbati (Fe/Sc, K/Ge) orqali aniq natija.", time: "2-3 daq/namuna", critical: false },
    { step: 7, title: "ICP-MS da o'lchash (KED bilan)", desc: "Fe: m/z=56 (KED rejimi!), K: m/z=39 (standart). He gazi collision cell ga kiritiladi.", time: "3-5 daq/namuna", critical: true },
    { step: 8, title: "Natijalarni hisoblash", desc: "%Fe va %K alohida hisoblanadi. Ichki standart orqali drift tuzatiladi. Jami: ~52.58% (nazariy: 52.58%).", time: "1 daq", critical: false }
  ],

  matrixEffects: {
    title: "Matritsa effekti — yuqori tuz konsentratsiyasi muammosi",
    description: "K₃[Fe(CN)₆] yuqori K konsentratsiyasiga ega (35.6% K, ~178 mg/L). Bu ICP uchun matritsa effekti yaratadi.",
    problems: [
      {
        problem: "Konus tiqilib qolishi",
        description: "Yuqori tuz konsentratsiyasi sampler va skimmer konuslarida cho'kma hosil qiladi — signal vaqt o'tishi bilan kamayadi (drift).",
        solution: "Namunani 10× yoki 100× suyuqlantirish. Ichki standart qo'shish (drift tuzatish)."
      },
      {
        problem: "Ionlanish interferensiyasi (K uchun)",
        description: "Yuqori K konsentratsiyasi plazmada qo'shimcha elektronlar beradi — boshqa elementlarning ionlanishini o'zgartiradi.",
        solution: "Ichki standart (Ge) qo'shish — K ning ionlanish effektlarini tuzatadi."
      },
      {
        problem: "Spektral fon (ICP-OES)",
        description: "Yuqori tuz matritsasi fon nurlanishini oshiradi — LOD yomonlashadi.",
        solution: "Background correction (fon tuzatish) va suyuqlantirish."
      }
    ]
  },

  aasComparison: {
    title: "ICP vs AAS — K₃[Fe(CN)₆] uchun",
    comparison: [
      { feature: "Metallar soni", ICP: "2 (Fe + K) bir vaqtda", AAS: "1 (ketma-ket)" },
      { feature: "LOD (Fe)", ICP: "0.5 ng/L (ICP-MS KED)", AAS: "5 μg/L (GFAAS)" },
      { feature: "Izotop ma'lumoti", ICP: "Ha (⁵⁴Fe, ⁵⁶Fe, ⁵⁷Fe, ⁵⁸Fe)", AAS: "Yo'q" },
      { feature: "ArO⁺ muammosi", ICP: "Ha (KED bilan hal)", AAS: "Yo'q (AAS da bunday interferensiya yo'q)" },
      { feature: "Fe²⁺/Fe³⁺ farqlash", ICP: "Yo'q (ikkalasini ham Fe ko'rsatadi)", AAS: "Yo'q" },
      { feature: "Vaqt (bir namuna)", ICP: "~5 daqiqa (ikkala metall)", AAS: "~10 daqiqa (ketma-ket)" },
      { feature: "Narxi", ICP: "$$$ (qimmat)", AAS: "$ (arzon)" }
    ]
  },

  relatedMethods: [
    {
      name: "EA (Element Analiz)",
      role: "C (21.89%), N (25.53%) — organik qismni tasdiqlaydi",
      icpAdvantage: "ICP metallarni, EA organik qismni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq formula validatsiyasi",
      complementarity: "98%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Fe³⁺ ning d-d o'tishlari (420 nm) va LMCT (305 nm)",
      icpAdvantage: "UV-Vis Fe²⁺ va Fe³⁺ ni farqlaydi (ICP farqlay olmaydi!)",
      icpDisadvantage: "ICP miqdoriy, UV-Vis sifat",
      complementarity: "95%"
    },
    {
      name: "Mössbauer spektroskopiya",
      role: "Fe³⁺ ning δ (isomer siljish) va ΔE_Q (kvadrupol ajralish)",
      icpAdvantage: "Mössbauer Fe²⁺/Fe³⁺ ni aniq farqlaydi",
      icpDisadvantage: "ICP miqdoriy, Mössbauer oksidlanish holatini",
      complementarity: "98%"
    },
    {
      name: "IQ spektroskopiya",
      role: "CN⁻ cho'zilishi (2040-2120 cm⁻¹) — koordinatsion bog'ni tasdiqlaydi",
      icpAdvantage: "IQ ligandlarni, ICP metallarni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq validatsiya",
      complementarity: "90%"
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

function calculateKPercent(conc_mgL, sampleMass, dilutionFactor) {
  const totalVolume = 100
  const K_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const K_percent = (K_mass_mg / sampleMass) * 100
  return {
    K_mass: parseFloat(K_mass_mg.toFixed(3)),
    K_percent: parseFloat(K_percent.toFixed(2))
  }
}

export default function K3FeCN6Page() {
  const [activeRun_Fe, setActiveRun_Fe] = useState("ICP-24-002")
  const [activeRun_K, setActiveRun_K] = useState("ICP-24-101")
  const [customConc_Fe, setCustomConc_Fe] = useState(55.8)
  const [customConc_K, setCustomConc_K] = useState(117.2)
  const [customMass, setCustomMass] = useState(50.0)
  const [dilutionFactor, setDilutionFactor] = useState(1)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)
  const [activeMetal, setActiveMetal] = useState("Fe")
  const [showKEDModal, setShowKEDModal] = useState(true)

  const run_Fe = COMPOUND.experimentalRuns_Fe.find(r => r.id === activeRun_Fe) || COMPOUND.experimentalRuns_Fe[1]
  const run_K = COMPOUND.experimentalRuns_K.find(r => r.id === activeRun_K) || COMPOUND.experimentalRuns_K[0]
  
  const deltaFe = Math.abs(run_Fe.percent - COMPOUND.theoretical.Fe.percent)
  const deltaK = Math.abs(run_K.percent - COMPOUND.theoretical.K.percent)
  const statusColor_Fe = deltaFe <= 0.5 ? "text-green-400" : deltaFe <= 1.5 ? "text-yellow-400" : "text-red-400"
  const statusColor_K = deltaK <= 0.5 ? "text-green-400" : deltaK <= 1.5 ? "text-yellow-400" : "text-red-400"

  const calcResult_Fe = useMemo(() => 
    calculateFePercent(customConc_Fe, customMass, dilutionFactor),
    [customConc_Fe, customMass, dilutionFactor]
  )

  const calcResult_K = useMemo(() => 
    calculateKPercent(customConc_K, customMass, dilutionFactor),
    [customConc_K, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-cyan-950/20 to-blue-950 text-white">
      
      {/* KED MODAL */}
      {showKEDModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-orange-950 to-red-950 border-2 border-orange-500 rounded-2xl p-6 max-w-2xl w-full">
            <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> ICP Fe²⁺ va Fe³⁺ ni farqlay OLMAYDI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              K₃[Fe(CN)₆] tahlilida eng muhim cheklov — <strong className="text-orange-300">ICP oksidlanish darajasini aniqlay olmaydi</strong>.
            </p>
            
            <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-orange-400 font-bold mb-2">Muammo:</div>
                  <div className="space-y-1 text-purple-200">
                    <div>K₃[Fe(CN)₆] → <strong className="text-orange-300">Fe³⁺</strong></div>
                    <div>K₄[Fe(CN)₆] → <strong className="text-orange-300">Fe²⁺</strong></div>
                    <div>ICP ikkalasini ham <strong className="text-orange-300">Fe</strong> sifatida ko'rsatadi</div>
                    <div className="text-red-400 font-bold">→ Farqlay olmaydi!</div>
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">Yechim (Mössbauer):</div>
                  <div className="space-y-1 text-purple-200">
                    <div>Mössbauer spektroskopiya ishlatiladi</div>
                    <div>Fe²⁺: δ ≈ <strong className="text-green-300">0.3-0.5 mm/s</strong></div>
                    <div>Fe³⁺: δ ≈ <strong className="text-green-300">0.0-0.3 mm/s</strong></div>
                    <div className="text-green-400 font-bold">→ Aniq farqlaydi!</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-900/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-orange-300">Ta'sir:</strong> K₃[Fe(CN)₆] va K₄[Fe(CN)₆] ni ICP bilan farqlab bo'lmaydi. 
                Mössbauer yoki UV-Vis kerak.
              </p>
            </div>

            <button 
              onClick={() => setShowKEDModal(false)}
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
            <span className="text-red-400 font-semibold">K₃[Fe(CN)₆]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Fe³⁺ d⁵ LS</span>
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Ko'p elementli</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">⚠ Fe²⁺/Fe³⁺</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">He KED</span>
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
        <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (ICP uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">K₃[Fe(CN)₆]</strong> — temir(III) ning geksatsianoferrat kompleksi, klassik koordinatsion birikma. ICP tahlilida <strong className="text-red-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs md:text-sm">
                <li><strong className="text-white">Ikkita metall (Fe va K)</strong> — ICP ikkalasini ham bir vaqtda o'lchaydi</li>
                <li>Fe³⁺ uchun <strong className="text-red-300">⁴⁰Ar¹⁶O⁺ interferensiyasi</strong> — He KED majburiy!</li>
                <li>K uchun <strong className="text-green-300">interferensiya yo'q</strong> — standart rejim yetarli</li>
                <li>ICP <strong className="text-orange-300">Fe²⁺ va Fe³⁺ ni farqlay olmaydi</strong> — Mössbauer kerak</li>
                <li>C, N <strong className="text-white">ICP da ko'rinmaydi</strong> — EA kerak</li>
                <li>Izotop profili: ⁵⁴Fe, ⁵⁶Fe, ⁵⁷Fe, ⁵⁸Fe</li>
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

        {/* 2. Fe²⁺/Fe³⁺ FARQLASH */}
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
                  <div className="text-red-400 font-bold">Sabab:</div>
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
                  <div className="text-green-300 font-bold">δ qiymatlari:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowKEDModal(true)}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
          >
            📖 Fe²⁺/Fe³⁺ farqlash haqida batafsil →
          </button>
        </div>

        {/* 3. ICP-OES PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> ICP-OES parametrlari (Fe va K uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-OES — atom emissiya spektroskopiya. Har bir element <strong className="text-red-300">o'ziga xos to'lqin uzunligida</strong> nurlanadi. Fe va K ni bir vaqtda o'lchash mumkin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-red-950/40 rounded-xl p-4 border border-red-700/30">
              <h4 className="text-red-400 font-bold text-sm mb-3">Fe (Temir) parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-red-400 font-bold">{COMPOUND.icpOES.parameters.Fe.lambda_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (alternativ):</span>
                  <span className="font-mono text-red-400">{COMPOUND.icpOES.parameters.Fe.lambda_secondary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.icpOES.parameters.Fe.lod} μg/L</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpOES.parameters.Fe.linearRange}</span>
                </div>
                <div className="bg-orange-900/30 rounded p-2 mt-2">
                  <span className="text-orange-300 text-[10px]">📝 {COMPOUND.icpOES.parameters.Fe.notes}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-950/40 rounded-xl p-4 border border-orange-700/30">
              <h4 className="text-orange-400 font-bold text-sm mb-3">K (Kaliy) parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-orange-400 font-bold">{COMPOUND.icpOES.parameters.K.lambda_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (alternativ):</span>
                  <span className="font-mono text-orange-400">{COMPOUND.icpOES.parameters.K.lambda_secondary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.icpOES.parameters.K.lod} μg/L</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpOES.parameters.K.linearRange}</span>
                </div>
                <div className="bg-orange-900/30 rounded p-2 mt-2">
                  <span className="text-orange-300 text-[10px]">📝 {COMPOUND.icpOES.parameters.K.notes}</span>
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
            <span>🧬</span> ICP-MS parametrlari (Fe va K uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-MS — mass-spektrometriya. Har bir izotop <strong className="text-cyan-300">o'ziga xos m/z</strong> da detektlanadi. 
            Fe uchun <strong className="text-red-300">He KED majburiy</strong> (ArO⁺ interferensiyasi tufayli). K uchun standart rejim yetarli.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-red-950/40 rounded-xl p-4 border-2 border-red-500/50">
              <h4 className="text-red-400 font-bold text-sm mb-3">Fe (Temir) — He KED rejimi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">m/z (asosiy):</span>
                  <span className="font-mono text-red-400 font-bold">{COMPOUND.icpMS.parameters.Fe.mz_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Asosiy izotop:</span>
                  <span className="font-mono text-red-400">{COMPOUND.icpMS.parameters.Fe.isotope_primary}</span>
                </div>
                <div className="flex justify-between bg-red-900/30 rounded p-2">
                  <span className="text-red-400">LOD (standart):</span>
                  <span className="font-mono text-red-400">{COMPOUND.icpMS.parameters.Fe.lod_standard} ng/L ⚠</span>
                </div>
                <div className="flex justify-between bg-green-900/30 rounded p-2">
                  <span className="text-green-400">LOD (He KED):</span>
                  <span className="font-mono text-green-400 font-bold">{COMPOUND.icpMS.parameters.Fe.lod_KED} ng/L ✓</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpMS.parameters.Fe.linearRange}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Ichki standart:</span>
                  <span className="font-mono text-cyan-300">{COMPOUND.icpMS.parameters.Fe.internalStandard}</span>
                </div>
                <div className="bg-orange-900/30 rounded p-2 mt-2">
                  <span className="text-orange-300 text-[10px]">⚠ {COMPOUND.icpMS.parameters.Fe.interference}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-950/40 rounded-xl p-4 border border-orange-700/30">
              <h4 className="text-orange-400 font-bold text-sm mb-3">K (Kaliy) — Standart rejim:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">m/z (asosiy):</span>
                  <span className="font-mono text-orange-400 font-bold">{COMPOUND.icpMS.parameters.K.mz_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Asosiy izotop:</span>
                  <span className="font-mono text-orange-400">{COMPOUND.icpMS.parameters.K.isotope_primary}</span>
                </div>
                <div className="flex justify-between bg-green-900/30 rounded p-2">
                  <span className="text-green-400">LOD (standart):</span>
                  <span className="font-mono text-green-400">{COMPOUND.icpMS.parameters.K.lod_standard} ng/L ✓</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">LOD (He KED):</span>
                  <span className="font-mono text-green-400">{COMPOUND.icpMS.parameters.K.lod_KED} ng/L</span>
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
                <div className="text-orange-300 text-[10px] font-bold">{COMPOUND.icpMS.collisionCell}</div>
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
            ICP <strong className="text-red-300">faqat Fe va K</strong> ni o'lchaydi. C, N ICP da ko'rinmaydi — ularni EA bilan tekshirish kerak.
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
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => (
                  <tr key={el} className={`border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors ${
                    el === "Fe" || el === "K" ? "" : "opacity-50"
                  }`}>
                    <td className={`py-3 pl-2 font-bold ${el === "Fe" ? "text-red-400" : el === "K" ? "text-orange-400" : "text-purple-400"}`}>{el}</td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-400">{d.icpSignal}</td>
                  </tr>
                ))}
                <tr className="bg-red-900/20 font-bold border-t border-red-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-red-300">ICP: Fe (16.96%) + K (35.62%) = 52.58%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. IZOTOP PROFILI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🎯</span> Izotop profili (ICP-MS)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveMetal("Fe")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMetal === "Fe" ? "bg-red-600 text-white" : "bg-purple-900/50 text-purple-300"
                }`}
              >
                Fe izotoplari
              </button>
              <button
                onClick={() => setActiveMetal("K")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMetal === "K" ? "bg-orange-600 text-white" : "bg-purple-900/50 text-purple-300"
                }`}
              >
                K izotoplari
              </button>
            </div>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            ICP-MS har bir izotopni <strong className="text-cyan-300">alohida detektlaydi</strong>. Bu AAS va ICP-OES da mumkin emas.
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

              {(activeMetal === "Fe" ? COMPOUND.isotopeProfile.Fe.isotopes : COMPOUND.isotopeProfile.K.isotopes).map((iso, i) => {
                const barWidth = 60
                const gap = 20
                const totalBars = (activeMetal === "Fe" ? COMPOUND.isotopeProfile.Fe.isotopes : COMPOUND.isotopeProfile.K.isotopes).length
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

          <div className="mt-3 p-3 bg-orange-900/20 rounded-lg border border-orange-700/30">
            <p className="text-xs text-purple-200">
              <strong className={activeMetal === "Fe" ? "text-red-300" : "text-orange-300"}>📝 {
                activeMetal === "Fe" ? COMPOUND.isotopeProfile.Fe.note : COMPOUND.isotopeProfile.K.note
              }</strong>
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
              <span>📈</span> Kalibrlash egri chizig'i
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveMetal("Fe")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMetal === "Fe" ? "bg-red-600 text-white" : "bg-purple-900/50 text-purple-300"
                }`}
              >
                Fe (ICP-MS, KED)
              </button>
              <button
                onClick={() => setActiveMetal("K")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMetal === "K" ? "bg-orange-600 text-white" : "bg-purple-900/50 text-purple-300"
                }`}
              >
                K (ICP-OES)
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
            {activeMetal === "Fe" ? "Fe" : "K"} standartlari (2% HNO₃ + ichki standart) yordamida kalibrlash egri chizig'i qurilgan. <strong className={activeMetal === "Fe" ? "text-red-300" : "text-orange-300"}>R² = 0.9999</strong> — deyarli mukammal chiziqli bog'liqliq.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - v*200} x2="580" y2={220 - v*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - v*200} textAnchor="end" fontSize="9" fill="#a78bfa">{(v * (activeMetal === "Fe" ? 100 : 250)).toFixed(0)}</text>
                </g>
              ))}

              {(activeMetal === "Fe" ? [0, 5, 10, 25, 50, 100] : [0, 10, 25, 50, 100, 250]).map((c, i) => (
                <g key={i}>
                  <text x={50 + (c/(activeMetal === "Fe" ? 100 : 250))*530} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="315" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">{activeMetal} konsentratsiyasi ({activeMetal === "Fe" ? "μg/L" : "mg/L"})</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik (counts)</text>

              <line x1="50" y1="220" x2="580" y2={220 - 200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {(activeMetal === "Fe" ? COMPOUND.calibrationCurve_Fe : COMPOUND.calibrationCurve_K).map((p, i) => {
                const x = 50 + (p.conc/(activeMetal === "Fe" ? 100 : 250))*530
                const y = 220 - (p.intensity/(activeMetal === "Fe" ? 502000 : 201000))*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill={activeMetal === "Fe" ? "#ef4444" : "#f97316"} stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill={activeMetal === "Fe" ? "#fca5a5" : "#fb923c"}>
                        {(p.intensity/1000).toFixed(0)}k
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (55.8/(activeMetal === "Fe" ? 100 : 250))*530
                const y = 220 - (279000/(activeMetal === "Fe" ? 502000 : 201000))*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna ({activeMetal === "Fe" ? "55.8 μg/L" : "117.2 mg/L"})
                    </text>
                  </g>
                )
              })()}

              <rect x="450" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke={activeMetal === "Fe" ? "#ef4444" : "#f97316"} strokeWidth="1" />
              <text x="510" y="48" textAnchor="middle" fontSize="10" fill={activeMetal === "Fe" ? "#fca5a5" : "#fb923c"} fontWeight="bold">
                R² = 0.9999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className={`w-3 h-3 rounded-full ${activeMetal === "Fe" ? "bg-red-500" : "bg-orange-500"}`}></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya</span>
          </div>
        </div>

        {/* 9. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> ICP yugurishlari — Fe va K alohida
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Fe va K <strong className="text-red-300">alohida</strong> o'lchanadi. Fe uchun <strong className="text-red-300">He KED rejimi</strong> majburiy (ArO⁺ muammosi tufayli). K uchun standart rejim yetarli.
          </p>

          {/* Fe natijalari */}
          <div className="mb-8">
            <h3 className="text-md font-bold text-red-400 mb-4 flex items-center gap-2">
              <span>🟥</span> Fe tahlili (ICP-MS, He KED)
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {COMPOUND.experimentalRuns_Fe.map(r => (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun_Fe(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun_Fe === r.id 
                      ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20" 
                      : r.mode.includes("KED yo'q")
                        ? "bg-red-900/30 border-red-700/30 text-red-300 hover:border-red-500"
                        : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                  }`}
                >
                  {r.id.split('-').pop()} {r.mode.includes("KED yo'q") && "⚠"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-purple-950/60 rounded-xl p-5 border border-purple-700/30">
                  <div className="text-xs text-purple-500 uppercase tracking-wider mb-1">O'lchash ID</div>
                  <div className="text-xl font-bold text-white font-mono">{run_Fe.id}</div>
                  <div className="text-xs text-purple-400 mt-1">{run_Fe.date}</div>
                  <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
                    📝 {run_Fe.note}
                  </div>
                  
                  <div className="my-4 border-t border-purple-800/50"></div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Rejim:</span>
                      <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                        run_Fe.mode.includes("KED yo'q") ? "bg-red-900/30 text-red-300" : "bg-green-900/30 text-green-300"
                      }`}>{run_Fe.mode}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-red-900/20 rounded border border-red-500/20">
                      <span className="text-sm text-red-400 font-medium">C (μg/L):</span>
                      <span className="font-mono text-white text-lg">{run_Fe.conc_mgL.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                      <span className="text-sm text-green-400 font-medium">Eksperimental %Fe:</span>
                      <span className="font-mono text-white text-lg">{run_Fe.percent.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Nazariy %Fe:</span>
                      <span className="font-mono text-red-400">{COMPOUND.theoretical.Fe.percent.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                      <span className="text-sm text-purple-300">Δ (Farq):</span>
                      <span className={`font-mono font-bold ${statusColor_Fe}`}>{deltaFe.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
                <h3 className="text-sm font-bold text-red-400 mb-4 flex justify-between">
                  <span>%Fe Qiymatlari (KED vs Standart)</span>
                  <span className="text-[10px] text-purple-500 font-normal">Nazariy: 16.96%</span>
                </h3>
                
                <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                  {COMPOUND.experimentalRuns_Fe.map((r) => {
                    const val = r.percent
                    const heightPct = Math.min((val / 60) * 100, 100)
                    const isActive = r.id === activeRun_Fe
                    const isBad = r.mode.includes("KED yo'q")
                    
                    return (
                      <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun_Fe(r.id)}>
                        <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                          {val.toFixed(1)}%
                        </div>
                        
                        <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                          <div className="absolute w-[120%] border-t border-dashed border-red-400/50 z-0" style={{ bottom: `${(16.962/60)*100}%` }}></div>

                          <div 
                            className={`w-full rounded-t transition-all duration-500 z-10 ${
                              isActive 
                                ? isBad ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                : isBad ? 'bg-red-700/40' : 'bg-purple-700/40'
                            }`}
                            style={{ height: `${heightPct}%` }}
                          ></div>
                        </div>
                        
                        <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isBad ? 'text-red-400' : 'text-red-400') : 'text-purple-600'} font-bold`}>
                          {r.id.split('-').pop()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* K natijalari */}
          <div>
            <h3 className="text-md font-bold text-orange-400 mb-4 flex items-center gap-2">
              <span>🟧</span> K tahlili (ICP-OES, Standart rejim)
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {COMPOUND.experimentalRuns_K.map(r => (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun_K(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun_K === r.id 
                      ? "bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/20" 
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
                  <div className="text-xl font-bold text-white font-mono">{run_K.id}</div>
                  <div className="text-xs text-purple-400 mt-1">{run_K.date}</div>
                  <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
                    📝 {run_K.note}
                  </div>
                  
                  <div className="my-4 border-t border-purple-800/50"></div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Rejim:</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-green-900/30 text-green-300">{run_K.mode}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-orange-900/20 rounded border border-orange-500/20">
                      <span className="text-sm text-orange-400 font-medium">C (mg/L):</span>
                      <span className="font-mono text-white text-lg">{run_K.conc_mgL.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                      <span className="text-sm text-green-400 font-medium">Eksperimental %K:</span>
                      <span className="font-mono text-white text-lg">{run_K.percent.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Nazariy %K:</span>
                      <span className="font-mono text-orange-400">{COMPOUND.theoretical.K.percent.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                      <span className="text-sm text-purple-300">Δ (Farq):</span>
                      <span className={`font-mono font-bold ${statusColor_K}`}>{deltaK.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
                <h3 className="text-sm font-bold text-orange-400 mb-4 flex justify-between">
                  <span>%K Qiymatlari</span>
                  <span className="text-[10px] text-purple-500 font-normal">Nazariy: 35.62%</span>
                </h3>
                
                <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                  {COMPOUND.experimentalRuns_K.map((r) => {
                    const val = r.percent
                    const heightPct = Math.min((val / 40) * 100, 100)
                    const isActive = r.id === activeRun_K
                    
                    return (
                      <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun_K(r.id)}>
                        <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                          {val.toFixed(2)}%
                        </div>
                        
                        <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                          <div className="absolute w-[120%] border-t border-dashed border-orange-400/50 z-0" style={{ bottom: `${(35.623/40)*100}%` }}></div>

                          <div 
                            className={`w-full rounded-t transition-all duration-500 z-10 ${
                              isActive ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-purple-700/40'
                            }`}
                            style={{ height: `${heightPct}%` }}
                          ></div>
                        </div>
                        
                        <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? 'text-orange-400' : 'text-purple-600'} font-bold`}>
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
              
              <h4 className="text-red-400 font-bold text-sm mb-2">Fe (ICP-MS, He KED):</h4>
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
                    {COMPOUND.calibrationCurve_Fe.map((p, i) => (
                      <tr key={i} className="border-b border-purple-800/30">
                        <td className="py-2 px-3 text-red-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.intensity.toLocaleString()}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="text-orange-400 font-bold text-sm mb-2">K (ICP-OES):</h4>
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
                        <td className="py-2 px-3 text-orange-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.intensity.toLocaleString()}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-700/30 text-xs text-purple-200">
                <strong className="text-red-300">Fe regressiyasi:</strong> I = 5020 × C + 0, R² = 0.9999 (He KED bilan)
              </div>
              <div className="mt-3 p-3 bg-orange-900/20 rounded-lg border border-orange-700/30 text-xs text-purple-200">
                <strong className="text-orange-300">K regressiyasi:</strong> I = 804 × C + 0, R² = 0.9999
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
              <div key={i} className="bg-orange-950/40 rounded-xl p-4 border border-orange-700/30">
                <h4 className="text-orange-400 font-bold text-sm mb-2">{m.problem}</h4>
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
            K₃[Fe(CN)₆] uchun <strong className="text-red-300">2% HNO₃</strong> ishlatiladi. Ichki standart (Sc, Ge) har bir namunaga qo'shiladi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-red-900/40 border-red-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-red-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-red-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
          <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> ICP dan %Fe va %K hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Ikkala metall uchun alohida konsentratsiya kiriting — <strong className="text-red-300">%Fe</strong> va <strong className="text-orange-300">%K</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Fe konsentratsiyasi (μg/L):</label>
              <input 
                type="number" step="0.1" value={customConc_Fe}
                onChange={(e) => setCustomConc_Fe(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">K konsentratsiyasi (mg/L):</label>
              <input 
                type="number" step="0.1" value={customConc_K}
                onChange={(e) => setCustomConc_K(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-purple-400">Fe massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-red-400">{calcResult_Fe.Fe_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Fe:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult_Fe.Fe_percent - 16.96) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult_Fe.Fe_percent}%
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">K massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-orange-400">{calcResult_K.K_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%K:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult_K.K_percent - 35.62) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult_K.K_percent}%
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-900/20 rounded border border-green-700/30">
              <div className="text-xs text-green-300">
                <strong>Jami (Fe + K):</strong> {(calcResult_Fe.Fe_percent + calcResult_K.K_percent).toFixed(2)}% (nazariy: 52.58%)
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Fe = (C(μg/L) × V(mL) × DF) / (m(mg) × 1000) × 100; %K = (C(mg/L) × V(mL) × DF) / (m(mg)) × 100
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
        <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> ICP ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            K₃[Fe(CN)₆] uchun ICP ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-red-300">to'liq formula validatsiyasi</strong> uchun muhim. <strong className="text-amber-300">EA</strong> va <strong className="text-purple-300">Mössbauer</strong> eng kuchli qo'shimcha metodlar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-red-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-red-300">{m.name}</h3>
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

          <div className="mt-5 bg-red-900/20 border border-red-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-red-300 mb-2">💡 To'liq formula validatsiyasi uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">ICP-OES/MS (Fe, K) + EA (C, N) + Mössbauer (Fe³⁺) + UV-Vis (420 nm) + IQ (CN⁻ 2040-2120 cm⁻¹)</strong> — beshta metod birgalikda K₃[Fe(CN)₆] ni to'liq tasdiqlaydi va uning sofligini nazorat qiladi.
            </p>
          </div>
        </div>

        {/* 15. ICP CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> ICP ning K₃[Fe(CN)₆] uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                ICP K₃[Fe(CN)₆] ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">⁴⁰Ar¹⁶O⁺ interferensiyasi</strong> — He KED majburiy (Fe uchun)</li>
                <li><strong className="text-red-300">Fe²⁺ va Fe³⁺ ni farqlay olmaydi</strong> — Mössbauer kerak</li>
                <li><strong className="text-red-300">Faqat Fe va K ni o'lchaydi</strong> — C, N uchun EA kerak</li>
                <li><strong className="text-red-300">Yuqori tuz matritsasi</strong> — suyuqlantirish va ichki standart</li>
                <li><strong className="text-red-300">Qimmat instrument</strong> — AAS dan 10-20× qimmat</li>
                <li><strong className="text-red-300">Murakkab ishlatish</strong> — malakali operator kerak</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>K₃[Fe(CN)₆] ni to'liq tasdiqlash</strong> uchun kamida 5 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-red-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. ICP-OES/MS (Fe, K)</span>
                  <span className="text-red-400 font-mono">16.96%, 35.62%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (C, N)</span>
                  <span className="text-red-400 font-mono">21.89%, 25.53%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. Mössbauer (Fe³⁺)</span>
                  <span className="text-red-400 font-mono">δ ≈ 0.0-0.3 mm/s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. UV-Vis (d-d)</span>
                  <span className="text-red-400 font-mono">420 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. IQ (CN⁻)</span>
                  <span className="text-red-400 font-mono">2040-2120 cm⁻¹</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 5 ta metod birgalikda K₃[Fe(CN)₆] ni to'liq tasdiqlaydi
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
              <p className="text-xs text-purple-200"><strong className="text-red-300">Ikkala metalni ham</strong> bir vaqtda o'lchaydi (Fe va K). ppb darajasida sezgirlik. Izotop profili ko'rinadi.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-red-300">⁴⁰Ar¹⁶O⁺ interferensiyasi!</strong> He KED majburiy. Fe²⁺/Fe³⁺ farqlanmaydi. C, N ko'rinmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EA (C, N), Mössbauer (Fe³⁺), UV-Vis (420 nm), IQ (CN⁻) — to'liq formula validatsiyasi uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/icp" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← ICP metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/icp/birikmalar" className="text-sm bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • K₃[Fe(CN)₆] • ICP moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, NIST Isotope Data, Gmelin (1822)</p>
        </div>
      </footer>
    </main>
  )
}