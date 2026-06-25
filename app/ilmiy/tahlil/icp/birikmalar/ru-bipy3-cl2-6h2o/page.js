"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Ru(bipy)₃]Cl₂·6H₂O — ICP-OES / ICP-MS MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, NIST Isotope Data
// Xususiyat: Ru²⁺ fotokimyoviy kompleks, organik matritsa (bipy), 6H₂O
// O'ziga xoslik: Ru ning 7 ta tabiiy izotopi, organik matritsa effekti
// Maqsad: Faqat ICP tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Ru: 101.07, Cl: 35.450, C: 12.011, H: 1.008, N: 14.007, O: 15.999
}

const COMPOUND = {
  formulaHTML: "[Ru(bipy)<sub>3</sub>]Cl<sub>2</sub>·6H<sub>2</sub>O",
  formulaPlain: "[Ru(bipy)3]Cl2·6H2O",
  iupac: "Tris(2,2'-bipiridin)ruteniy(II) xlorid geksagidrat",
  formulaExpanded: "RuC₃₀H₃₆N₆Cl₂O₆",
  commonName: "Tris(bipiridin)ruteniy(II) xlorid (to'q qizil kristallar)",
  molarMass: 748.62,
  casNumber: "50529-62-9",
  color: "to'q qizil kristallar",
  stability: "havoda barqaror, inert Ru²⁺ kompleksi, fotokimyoviy faol",
  
  historicalFact: {
    title: "Graetzel — Dye-Sensitized Solar Cells (DSSC) kashfiyoti",
    text: "[Ru(bipy)₃]Cl₂ — zamonaviy fotokimyo va quyosh energetikasining asosiy birikmasi. 1977-yilda Michael Graetzel (EPFL, Shveytsariya) bu kompleksni suvni vodorod va kislorodga fotokatalitik parchalash uchun ishlatdi. 1991-yilda u Dye-Sensitized Solar Cells (DSSC) — bo'yoq bilan sezgir quyosh elementlarini kashf qildi. [Ru(bipy)₃]²⁺ ning MLCT (Metal-to-Ligand Charge Transfer) emissiyasi (λ_em = 610 nm, qizil) va uzoq hayotiylik vaqti (600 ns) uni fotokataliz va quyosh energetikasida eng muhim kompleks qildi. Bugungi kunda bu kompleks fotokimyo, OLED, va sensorlarda keng qo'llaniladi. ICP tahlilida muhim: Ru ning 7 ta tabiiy izotopi bor — ICP-MS da murakkab izotop profili ko'rinadi.",
    year: "1977-1991"
  },

  uniqueICPFeature: {
    title: "[Ru(bipy)₃]Cl₂·6H₂O — Organik matritsa va Ru ning 7 ta izotopi",
    description: "Bu birikma ICP tahlilida ikki muhim xususiyatga ega: (1) Organik matritsa (bipy — 30 ta C, 24 ta H, 6 ta N) matritsa effekti yaratadi, (2) Ru ning 7 ta tabiiy izotopi ICP-MS da murakkab profil beradi.",
    problem: {
      title: "Organik matritsa effekti",
      description: "3 ta bipy ligandi (30 ta C, 24 ta H, 6 ta N) organik matritsa hosil qiladi. ICP plazmasida bu CO₂ va H₂O ga oksidlanadi, lekin matritsa effekti signalni o'zgartiradi.",
      impact: "Matritsa effekti signalni 2-5% o'zgartirishi mumkin — ichki standart majburiy"
    },
    solution: {
      title: "Ichki standart + suyuqlantirish",
      description: "Ichki standart (Sc yoki Ge) qo'shish matritsa effektini tuzatadi. 10× yoki 100× suyuqlantirish ham yordam beradi.",
      mechanism: "Ichki standart signal nisbati orqali matritsa effekti tuzatiladi. Ru ning 7 ta izotopi ICP-MS da murakkab profil beradi — bu izotop nisbatlarini o'lchash imkonini beradi."
    }
  },

  icpOES: {
    instrument: "ICP-OES (Inductively Coupled Plasma Optical Emission Spectroscopy)",
    plasma: "Argon plazma, 6000-10000 K",
    nebulizer: "Pnevmatik nebulayzer (Meinhard tip)",
    parameters: {
      Ru: {
        lambda_primary: "240.272 nm",
        lambda_secondary: "267.515 nm",
        lod: 1.0,
        linearRange: "1.0 - 500 mg/L",
        notes: "240.3 nm eng sezgir. Ru²⁺ inertligi tufayli plazmada to'liq atomlanadi."
      }
    }
  },

  icpMS: {
    instrument: "ICP-MS (Inductively Coupled Plasma Mass Spectrometry)",
    plasma: "Argon plazma, 6000-10000 K",
    massAnalyzer: "Kvadrupol mass analizator",
    collisionCell: "Standart rejim — Ru uchun ArRu⁺ kam ta'sir qiladi",
    parameters: {
      Ru: {
        mz_primary: 102,
        isotope_primary: "¹⁰²Ru (31.6%)",
        isotopes: [
          { isotope: "⁹⁶Ru", mz: 96, abundance: 5.54 },
          { isotope: "⁹⁸Ru", mz: 98, abundance: 5.54 },
          { isotope: "⁹⁹Ru", mz: 99, abundance: 12.76 },
          { isotope: "¹⁰⁰Ru", mz: 100, abundance: 17.10 },
          { isotope: "¹⁰¹Ru", mz: 101, abundance: 18.68 },
          { isotope: "¹⁰²Ru", mz: 102, abundance: 31.60 },
          { isotope: "¹⁰⁴Ru", mz: 104, abundance: 18.68 }
        ],
        lod_standard: 1.0,
        lod_collision: 1.0,
        linearRange: "1.0 - 100 μg/L",
        interference: "ArRu⁺ (m/z=138-142) — Ru ga ta'sir kam",
        internalStandard: "Rh (m/z=103) — Ru ga yaqin massa"
      }
    }
  },

  theoretical: {
    Ru:  { mass: 101.070, percent: 13.769, source: "Markaziy Ru²⁺ atomi", icpSignal: "ICP-OES 240.3 nm / ICP-MS m/z=102" },
    C:   { mass: 360.330, percent: 48.959, source: "3×bipy (30×C)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" },
    H:   { mass: 36.288,  percent: 4.929,  source: "3×bipy (24×H) + 6×H₂O (12×H)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" },
    N:   { mass: 84.042,  percent: 11.359, source: "3×bipy (6×N)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" },
    Cl:  { mass: 70.900,  percent: 9.605,  source: "2×Cl⁻ (tashqi sfera)", icpSignal: "ICP da ko'rinmaydi (IC kerak)" },
    O:   { mass: 95.994,  percent: 12.823, source: "6×H₂O (6×O)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" }
  },

  isotopeProfile: {
    Ru: {
      title: "Ruteniy izotoplari — ICP-MS da ko'rinadigan profil",
      isotopes: [
        { isotope: "⁹⁶Ru", mz: 96, abundance: 5.54, color: "#22c55e" },
        { isotope: "⁹⁸Ru", mz: 98, abundance: 5.54, color: "#3b82f6" },
        { isotope: "⁹⁹Ru", mz: 99, abundance: 12.76, color: "#f59e0b" },
        { isotope: "¹⁰⁰Ru", mz: 100, abundance: 17.10, color: "#a855f7" },
        { isotope: "¹⁰¹Ru", mz: 101, abundance: 18.68, color: "#ef4444" },
        { isotope: "¹⁰²Ru", mz: 102, abundance: 31.60, color: "#3b82f6" },
        { isotope: "¹⁰⁴Ru", mz: 104, abundance: 18.68, color: "#f59e0b" }
      ],
      note: "Ru ning 7 ta tabiiy izotopi bor — ¹⁰²Ru (31.6%) asosiy, ¹⁰¹Ru (18.7%) va ¹⁰⁴Ru (18.7%) ham muhim. ICP-MS da murakkab izotop profili ko'rinadi."
    }
  },

  internalStandards: {
    title: "Ichki standartlar — instrumental drift va matritsa effektlarini tuzatish",
    description: "Har bir namuna va standartga qo'shiladigan elementlar. Signal nisbati (Analyte/IS) orqali aniq natija olinadi.",
    standards: [
      {
        element: "Rh (Rodiy)",
        mz: 103,
        concentration: "10 μg/L",
        purpose: "Ru uchun ideal ichki standart",
        reason: "Rh massasi (103) Ru (102) ga juda yaqin — matritsa effektlarini eng yaxshi tuzatadi",
        interference: "Interferensiyasiz (mononuklid ¹⁰³Rh 100%)"
      },
      {
        element: "Ir (Iridiy)",
        mz: 193,
        concentration: "10 μg/L",
        purpose: "Alternativ ichki standart",
        reason: "Ir massasi (193) Ru dan uzoq, lekin og'ir elementlar uchun yaxshi",
        interference: "Kam interferensiya"
      },
      {
        element: "Sc (Skandiy)",
        mz: 45,
        concentration: "10 μg/L",
        purpose: "Yengil elementlar uchun (alternativa)",
        reason: "Ru dan uzoq massa, lekin ba'zi matritsalarda yaxshi ishlaydi",
        interference: "Mononuklid ⁴⁵Sc 100%"
      }
    ]
  },

  calibrationCurve: [
    { conc: 0.0, intensity: 0, note: "Blank (2% HNO₃ + 10 μg/L Rh)" },
    { conc: 5.0, intensity: 24000, note: "Standart 1" },
    { conc: 10.0, intensity: 48100, note: "Standart 2" },
    { conc: 25.0, intensity: 120250, note: "Standart 3" },
    { conc: 50.0, intensity: 240500, note: "Standart 4" },
    { conc: 100.0, intensity: 481000, note: "Standart 5" }
  ],

  experimentalRuns: [
    { id: "ICP-24-1201", date: "2025-12-25", mode: "ICP-MS (Ru)", conc_mgL: 34.5, intensity: 165600, percent: 13.80, rsd: 1.0, note: "To'g'ri natija — [Ru(bipy)₃]Cl₂·6H₂O" },
    { id: "ICP-24-1202", date: "2025-12-25", mode: "ICP-MS (Ru)", conc_mgL: 34.6, intensity: 166080, percent: 13.84, rsd: 0.9, note: "Ikkinchi parallel" },
    { id: "ICP-24-1203", date: "2025-12-25", mode: "ICP-OES (Ru)", conc_mgL: 34.4, intensity: 165120, percent: 13.76, rsd: 1.5, note: "ICP-OES (240.3 nm)" },
    { id: "ICP-24-1204", date: "2025-12-26", mode: "ICP-MS (Ru)", conc_mgL: 34.5, intensity: 165600, percent: 13.80, rsd: 1.0, note: "[Ru(bipy)₃]Cl₂ (anhidrous) — ICP farqlamaydi!" },
    { id: "ICP-24-1205", date: "2025-12-26", mode: "ICP-MS (Ru)", conc_mgL: 34.5, intensity: 165600, percent: 13.80, rsd: 1.0, note: "⚠ ICP gidratli/anhidrous farqlamaydi!" },
    { id: "ICP-24-1206", date: "2025-12-26", mode: "ICP-MS (Ru)", conc_mgL: 27.6, intensity: 132480, percent: 11.04, rsd: 8.5, note: "⚠ Namuna qisman parchalangan (bipy yo'qotgan)" },
    { id: "BLANK-13",   date: "2025-12-25", mode: "ICP-MS", conc_mgL: 0.1, intensity: 480, percent: 0.04, rsd: 0.0, note: "Blank (2% HNO₃)" },
    { id: "STD-Ru-50",  date: "2025-12-25", mode: "ICP-MS", conc_mgL: 50.0, intensity: 240000, percent: 0.00, rsd: 0.5, note: "NIST Ru standarti (50 μg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 50.0 ± 0.1 mg [Ru(bipy)₃]Cl₂·6H₂O tortiladi. To'q qizil kristallar — Ru²⁺ belgisi.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 10 mL 2% HNO₃ qo'shiladi. Ru²⁺ inert — sekin eriydi, qizdirish kerak.", time: "15 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "2% HNO₃ bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~500 mg/L ≈ 69 mg/L Ru.", time: "1 daq", critical: false },
    { step: 4, title: "Ichki standart qo'shish", desc: "1 mL namunaga 10 μL Rh eritmasi (1000 μg/L) qo'shiladi. Natija: 10 μg/L Rh — har bir namuna va standartda bir xil.", time: "2 daq", critical: true },
    { step: 5, title: "Suyultirish", desc: "Agar konsentratsiya ICP diapazonidan yuqori bo'lsa, 10× yoki 100× suyuqlantiriladi.", time: "3 daq", critical: false },
    { step: 6, title: "ICP-MS da o'lchash", desc: "Ru: m/z=102 (standart rejim). ArRu⁺ kam ta'sir qiladi.", time: "3-5 daq/namuna", critical: true },
    { step: 7, title: "ICP-OES da o'lchash (alternativa)", desc: "Ru: 240.3 nm yoki 267.5 nm. Ichki standart nisbati (Ru/Rh) orqali aniq natija.", time: "2-3 daq/namuna", critical: false },
    { step: 8, title: "Natijalarni hisoblash", desc: "%Ru hisoblanadi. Nazariy: 13.77%. EHTIYOT: ICP gidratli/anhidrous farqlamaydi!", time: "1 daq", critical: false }
  ],

  matrixEffects: {
    title: "Matritsa effekti — organik matritsa (bipy) muammosi",
    description: "[Ru(bipy)₃]Cl₂·6H₂O organik matritsaga ega (bipy — 30 ta C, 24 ta H, 6 ta N). Bu ICP uchun matritsa effekti yaratadi.",
    problems: [
      {
        problem: "Organik matritsa (bipy)",
        description: "3 ta bipy ligandi (30 ta C, 24 ta H, 6 ta N) organik matritsa hosil qiladi. ICP plazmasida bu CO₂ va H₂O ga oksidlanadi, lekin matritsa effekti signalni o'zgartiradi.",
        solution: "Ichki standart (Rh) qo'shish matritsa effektini tuzatadi. 10× yoki 100× suyuqlantirish ham yordam beradi."
      },
      {
        problem: "Gidrat/Anhidrous farqi",
        description: "ICP gidratli va anhidrous shaklni farqlay olmaydi — ikkalasi ham bir xil Ru signalini beradi.",
        solution: "EA (Element Analiz) kerak — H₂O miqdorini aniqlash uchun."
      },
      {
        problem: "Ru²⁺ inertligi",
        description: "Ru²⁺ inert kompleks — ligand almashinishi juda sekin. ICP plazmasida to'liq atomlanadi (bu muammo emas).",
        solution: "Hech narsa kerak emas — ICP plazmasi (10000 K) barcha bog'larni uzadi."
      }
    ]
  },

  aasComparison: {
    title: "ICP vs AAS — [Ru(bipy)₃]Cl₂·6H₂O uchun",
    comparison: [
      { feature: "Metallar soni", ICP: "1 (Ru)", AAS: "1 (Ru)" },
      { feature: "LOD (Ru)", ICP: "1.0 ng/L (ICP-MS)", AAS: "10 μg/L (GFAAS)" },
      { feature: "Izotop ma'lumoti", ICP: "Ha (7 ta izotop)", AAS: "Yo'q" },
      { feature: "Interferensiya", ICP: "ArRu⁺ kam ta'sir", AAS: "Kam" },
      { feature: "Gidrat/Anhidrous", ICP: "Farqlay olmaydi", AAS: "Farqlay olmaydi" },
      { feature: "Narxi", ICP: "$$$ (qimmat)", AAS: "$ (arzon)" }
    ]
  },

  relatedMethods: [
    {
      name: "EA (Element Analiz)",
      role: "C (48.96%), H (4.93%), N (11.36%) — organik qismni tasdiqlaydi",
      icpAdvantage: "ICP metallarni, EA organik qismni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq formula validatsiyasi",
      complementarity: "98%"
    },
    {
      name: "Fluoressensiya",
      role: "MLCT emissiyasi (λ_em = 610 nm, qizil) — fotokimyoviy faollik",
      icpAdvantage: "Fluoressensiya fotokimyoviy faollikni ko'rsatadi",
      icpDisadvantage: "ICP miqdoriy, Fluoressensiya sifat",
      complementarity: "97%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Ru²⁺ ning MLCT yutilishi (452 nm) va d-d o'tishlar",
      icpAdvantage: "UV-Vis fotokimyoviy faollikni ko'rsatadi",
      icpDisadvantage: "ICP miqdoriy, UV-Vis sifat",
      complementarity: "95%"
    },
    {
      name: "XRD (X-ray diffraction)",
      role: "Kristall strukturani ko'rsatadi — gidratli/anhidrous farqlanadi",
      icpAdvantage: "XRD gidratli/anhidrous farqlaydi",
      icpDisadvantage: "ICP miqdoriy, XRD sifat",
      complementarity: "96%"
    }
  ]
}

function calculateRuPercent(conc_mgL, sampleMass, dilutionFactor) {
  const totalVolume = 100
  const Ru_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Ru_percent = (Ru_mass_mg / sampleMass) * 100
  return {
    Ru_mass: parseFloat(Ru_mass_mg.toFixed(3)),
    Ru_percent: parseFloat(Ru_percent.toFixed(2))
  }
}

function getStatusColor(delta) {
  if (delta <= 0.5) return "text-green-400"
  if (delta <= 1.5) return "text-yellow-400"
  return "text-red-400"
}

function getElColor(el) {
  if (el === "Ru") return "text-rose-400"
  return "text-purple-400"
}

function getRowClass(el) {
  if (el === "Ru") return ""
  return "opacity-50"
}

export default function RuBipy3Cl2Page() {
  const [activeRun, setActiveRun] = useState("ICP-24-1201")
  const [customConc, setCustomConc] = useState(34.5)
  const [customMass, setCustomMass] = useState(50.0)
  const [dilutionFactor, setDilutionFactor] = useState(1)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)
  const [showMatrixModal, setShowMatrixModal] = useState(true)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const deltaRu = Math.abs(run.percent - COMPOUND.theoretical.Ru.percent)
  const statusColor = getStatusColor(deltaRu)

  const calcResult = useMemo(() => 
    calculateRuPercent(customConc, customMass, dilutionFactor),
    [customConc, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-rose-950/20 to-blue-950 text-white">
      
      {/* MATRITSA OGOHLANTIRISH MODALI */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-rose-950 to-purple-950 border-2 border-rose-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-rose-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> ORGANIK MATRITSA VA RU IZOTOPLARI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-rose-300">[Ru(bipy)₃]Cl₂·6H₂O</strong> da <strong className="text-rose-300">organik matritsa</strong> (bipy — 30 ta C, 24 ta H, 6 ta N) matritsa effekti yaratadi. Ru ning <strong className="text-rose-300">7 ta tabiiy izotopi</strong> ICP-MS da murakkab profil beradi.
            </p>
            
            <div className="bg-rose-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-rose-400 font-bold mb-2">Muammo:</div>
                  <div className="text-purple-200">
                    Organik matritsa signalni 2-5% o'zgartirishi mumkin. ICP <strong className="text-rose-300">gidratli/anhidrous farqlay olmaydi</strong> — ikkalasi ham bir xil Ru signalini beradi.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">Yechim:</div>
                  <div className="text-purple-200">
                    <strong className="text-green-300">Ichki standart (Rh)</strong> qo'shish matritsa effektini tuzatadi. <strong className="text-green-300">EA</strong> gidratli/anhidrous farqlaydi.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-rose-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-rose-300">Ru izotoplari:</strong> ⁹⁶Ru (5.5%), ⁹⁸Ru (5.5%), ⁹⁹Ru (12.8%), ¹⁰⁰Ru (17.1%), ¹⁰¹Ru (18.7%), ¹⁰²Ru (31.6%), ¹⁰⁴Ru (18.7%) — 7 ta izotop!
              </p>
            </div>

            <button 
              onClick={() => setShowMatrixModal(false)}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
            <span className="text-rose-400 font-semibold">[Ru(bipy)₃]Cl₂·6H₂O</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-rose-400 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-rose-900/30 border border-rose-700/50 text-rose-400 text-[10px] uppercase tracking-wide">Ru²⁺ d⁶ LS</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">⚠ Organik matritsa</span>
                <span className="px-2 py-1 rounded bg-rose-900/30 border border-rose-700/50 text-rose-400 text-[10px] uppercase tracking-wide">7 ta izotop</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">DSSC</span>
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
        <div className="bg-gradient-to-r from-rose-900/40 to-purple-900/40 border border-rose-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (ICP uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Ru(bipy)₃]Cl₂·6H₂O</strong> — ruteniy(II) ning tris(bipiridin) kompleksi, fotokimyo va quyosh energetikasining asosiy birikmasi. ICP tahlilida <strong className="text-rose-300">muhim namuna</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-rose-500 text-xs md:text-sm">
                <li><strong className="text-white">Organik matritsa</strong> (bipy — 30 ta C, 24 ta H, 6 ta N)</li>
                <li><strong className="text-red-300">ICP gidratli/anhidrous farqlay OLMAYDI!</strong></li>
                <li>Ru²⁺ <strong className="text-rose-300">inert</strong> — plazmada to'liq atomlanadi</li>
                <li>Ru ning <strong className="text-rose-300">7 ta tabiiy izotopi</strong> — murakkab profil</li>
                <li>C, H, N, O, Cl <strong className="text-white">ICP da ko'rinmaydi</strong> — EA/IC kerak</li>
                <li>LOD: ICP-MS da <strong className="text-green-300">1.0 ng/L</strong></li>
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

        {/* 2. ORGANIK MATRITSA */}
        <div className="bg-gradient-to-r from-rose-900/40 to-red-900/40 border-2 border-rose-700/70 rounded-2xl p-6">
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
                  <div className="text-green-300 font-bold">Ichki standart + EA:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowMatrixModal(true)}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
          >
            ⚠️ Organik matritsa haqida batafsil →
          </button>
        </div>

        {/* 3. ICP-OES PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> ICP-OES parametrlari (Ru uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-OES — atom emissiya spektroskopiya. Ru <strong className="text-rose-300">240.3 nm</strong> yoki <strong className="text-rose-300">267.5 nm</strong> da nurlanadi. Ru²⁺ inertligi tufayli plazmada to'liq atomlanadi.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="bg-rose-950/40 rounded-xl p-4 border border-rose-700/30">
              <h4 className="text-rose-400 font-bold text-sm mb-3">Ru (Ruteniy) parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-rose-400 font-bold">{COMPOUND.icpOES.parameters.Ru.lambda_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (alternativ):</span>
                  <span className="font-mono text-rose-400">{COMPOUND.icpOES.parameters.Ru.lambda_secondary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.icpOES.parameters.Ru.lod} μg/L</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpOES.parameters.Ru.linearRange}</span>
                </div>
                <div className="bg-rose-900/30 rounded p-2 mt-2">
                  <span className="text-rose-300 text-[10px]">📝 {COMPOUND.icpOES.parameters.Ru.notes}</span>
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
            <span>🧬</span> ICP-MS parametrlari (Ru uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-MS — mass-spektrometriya. Ru ning <strong className="text-rose-300">7 ta tabiiy izotopi</strong> bor — ¹⁰²Ru (31.6%) asosiy. ArRu⁺ interferensiyasi kam ta'sir qiladi.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="bg-rose-950/40 rounded-xl p-4 border-2 border-rose-500/50">
              <h4 className="text-rose-400 font-bold text-sm mb-3">Ru (Ruteniy) — Standart rejim:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">m/z (asosiy):</span>
                  <span className="font-mono text-rose-400 font-bold">{COMPOUND.icpMS.parameters.Ru.mz_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Asosiy izotop:</span>
                  <span className="font-mono text-rose-400">{COMPOUND.icpMS.parameters.Ru.isotope_primary}</span>
                </div>
                <div className="flex justify-between bg-green-900/30 rounded p-2">
                  <span className="text-green-400">LOD (standart):</span>
                  <span className="font-mono text-green-400 font-bold">{COMPOUND.icpMS.parameters.Ru.lod_standard} ng/L ✓</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpMS.parameters.Ru.linearRange}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Ichki standart:</span>
                  <span className="font-mono text-cyan-300">{COMPOUND.icpMS.parameters.Ru.internalStandard}</span>
                </div>
                <div className="bg-green-900/30 rounded p-2 mt-2">
                  <span className="text-green-300 text-[10px]">✓ {COMPOUND.icpMS.parameters.Ru.interference}</span>
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
                <div className="text-green-300 text-[10px] font-bold">{COMPOUND.icpMS.collisionCell}</div>
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
            ICP <strong className="text-rose-300">faqat Ru</strong> ni o'lchaydi (ICP-OES). C, H, N, O, Cl ICP da ko'rinmaydi — ularni EA/IC bilan tekshirish kerak.
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
                <tr className="bg-rose-900/20 font-bold border-t border-rose-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-rose-300">ICP: Ru (13.77%) — faqat bitta metall</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. IZOTOP PROFILI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Ru izotop profili (ICP-MS)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            ICP-MS har bir izotopni <strong className="text-cyan-300">alohida detektlaydi</strong>. Ru ning <strong className="text-rose-300">7 ta tabiiy izotopi</strong> bor — ¹⁰²Ru (31.6%) asosiy, ¹⁰¹Ru (18.7%) va ¹⁰⁴Ru (18.7%) ham muhim.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {[0, 10, 20, 30, 40].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/40)*200} x2="580" y2={220 - (v/40)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/40)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v}%</text>
                </g>
              ))}

              <text x="315" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">m/z (mass/zaryad)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Tabiiy tarqalish (%)</text>

              {COMPOUND.isotopeProfile.Ru.isotopes.map((iso, i) => {
                const barWidth = 60
                const gap = 15
                const totalBars = COMPOUND.isotopeProfile.Ru.isotopes.length
                const startX = 50 + (600 - 50 - 50 - (totalBars * barWidth + (totalBars - 1) * gap)) / 2
                const x = startX + i * (barWidth + gap)
                const barHeight = (iso.abundance / 40) * 200
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

          <div className="mt-3 p-3 bg-rose-900/20 rounded-lg border border-rose-700/30">
            <p className="text-xs text-purple-200">
              <strong className="text-rose-300">📝 {COMPOUND.isotopeProfile.Ru.note}</strong>
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
              <span>📈</span> Kalibrlash egri chizig'i (Ru, ICP-MS)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Ru standartlari (2% HNO₃ + ichki standart Rh) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-rose-300">R² = 0.9999</strong> — deyarli mukammal chiziqli bog'liqliq.
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
              <text x="315" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Ru konsentratsiyasi (μg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik (counts)</text>

              <line x1="50" y1="220" x2="580" y2={220 - 200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/100)*530
                const y = 220 - (p.intensity/481000)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#fda4af">
                        {(p.intensity/1000).toFixed(0)}k
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (34.5/100)*530
                const y = 220 - (165600/481000)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (34.5 μg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="450" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="1" />
              <text x="510" y="48" textAnchor="middle" fontSize="10" fill="#fda4af" fontWeight="bold">
                R² = 0.9999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya</span>
          </div>
        </div>

        {/* 9. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> ICP yugurishlari — Ru tahlili (gidratli/anhidrous farqlanmaydi!)
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Ru <strong className="text-rose-300">standart rejim</strong> bilan o'lchanadi (ArRu⁺ kam ta'sir). EHTIYOT: ICP gidratli/anhidrous farqlamaydi!
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns.map(r => {
              const isOES = r.mode.includes("ICP-OES")
              const isAnhydrous = r.id === "ICP-24-1204"
              const isNoDifference = r.id === "ICP-24-1205"
              const isDecomposed = r.id === "ICP-24-1206"
              const isActive = activeRun === r.id
              let btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
              if (isActive) {
                if (isOES) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                else if (isAnhydrous || isNoDifference) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/20"
                else if (isDecomposed) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20"
                else btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/20"
              } else {
                if (isOES) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-cyan-900/30 border-cyan-700/30 text-cyan-300 hover:border-cyan-500"
                else if (isAnhydrous || isNoDifference) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-rose-900/30 border-rose-700/30 text-rose-300 hover:border-rose-500"
                else if (isDecomposed) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-red-900/30 border-red-700/30 text-red-300 hover:border-red-500"
              }
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={btnClass}
                >
                  {r.id.split('-').pop()} {isOES && "OES"} {(isAnhydrous || isNoDifference) && "⚠"} {isDecomposed && "⚠"}
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
                      run.mode.includes("ICP-OES") ? "bg-cyan-900/30 text-cyan-300" : "bg-rose-900/30 text-rose-300"
                    }`}>{run.mode}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-rose-900/20 rounded border border-rose-500/20">
                    <span className="text-sm text-rose-400 font-medium">C (μg/L):</span>
                    <span className="font-mono text-white text-lg">{run.conc_mgL.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Ru:</span>
                    <span className="font-mono text-white text-lg">{run.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Ru:</span>
                    <span className="font-mono text-rose-400">{COMPOUND.theoretical.Ru.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaRu.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-rose-400 mb-4 flex justify-between">
                <span>%Ru Qiymatlari (gidratli/anhidrous bir xil!)</span>
                <span className="text-[10px] text-purple-500 font-normal">Nazariy: 13.77%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const val = r.percent
                  const heightPct = Math.min((val / 20) * 100, 100)
                  const isActive = r.id === activeRun
                  const isOES = r.mode.includes("ICP-OES")
                  const isAnhydrous = r.id === "ICP-24-1204"
                  const isNoDifference = r.id === "ICP-24-1205"
                  const isDecomposed = r.id === "ICP-24-1206"
                  let barClass = "w-full rounded-t transition-all duration-500 z-10 bg-purple-700/40"
                  if (isActive) {
                    if (isOES) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    else if (isAnhydrous || isNoDifference) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                    else if (isDecomposed) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    else barClass = "w-full rounded-t transition-all duration-500 z-10 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                  } else {
                    if (isOES) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-700/40"
                    else if (isAnhydrous || isNoDifference) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-rose-700/40"
                    else if (isDecomposed) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-700/40"
                  }
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                        <div className="absolute w-[120%] border-t border-dashed border-rose-400/50 z-0" style={{ bottom: `${(13.769/20)*100}%` }}></div>

                        <div 
                          className={barClass}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isOES ? 'text-cyan-400' : isAnhydrous || isNoDifference ? 'text-rose-400' : isDecomposed ? 'text-red-400' : 'text-rose-400') : 'text-purple-600'} font-bold`}>
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
              
              <h4 className="text-rose-400 font-bold text-sm mb-2">Ru (ICP-MS, m/z=102):</h4>
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
                        <td className="py-2 px-3 text-rose-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.intensity.toLocaleString()}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-rose-900/20 rounded-lg border border-rose-700/30 text-xs text-purple-200">
                <strong className="text-rose-300">Ru regressiyasi:</strong> I = 4810 × C + 0, R² = 0.9999
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
              <div key={i} className="bg-rose-950/40 rounded-xl p-4 border border-rose-700/30">
                <h4 className="text-rose-400 font-bold text-sm mb-2">{m.problem}</h4>
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
            [Ru(bipy)₃]Cl₂·6H₂O uchun <strong className="text-rose-300">2% HNO₃</strong> ishlatiladi. EHTIYOT: ICP gidratli/anhidrous farqlamaydi! Ichki standart (Rh) har bir namunaga qo'shiladi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => {
                const isActive = activePrepStep === s.step
                const btnClass = isActive
                  ? "w-full text-left p-3 rounded-lg border transition-all bg-rose-900/40 border-rose-500"
                  : "w-full text-left p-3 rounded-lg border transition-all bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                return (
                  <button
                    key={s.step}
                    onClick={() => setActivePrepStep(s.step)}
                    className={btnClass}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? "bg-rose-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-rose-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-rose-900/20 border border-rose-500/30 rounded-2xl p-6">
          <h3 className="text-rose-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> ICP dan %Ru hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Ru konsentratsiyasini kiriting — <strong className="text-rose-300">%Ru</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Ru konsentratsiyasi (μg/L):</label>
              <input 
                type="number" step="0.1" value={customConc}
                onChange={(e) => setCustomConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-rose-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-rose-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-rose-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-purple-400">Ru massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-rose-400">{calcResult.Ru_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Ru:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult.Ru_percent - 13.77) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Ru_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Ru = (C(μg/L) × V(mL) × DF) / (m(mg) × 1000) × 100
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
        <div className="bg-gradient-to-r from-rose-900/40 to-purple-900/40 border border-rose-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> ICP ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Ru(bipy)₃]Cl₂·6H₂O uchun ICP ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-rose-300">to'liq formula validatsiyasi</strong> uchun muhim. <strong className="text-amber-300">EA</strong> va <strong className="text-rose-300">Fluoressensiya</strong> eng kuchli qo'shimcha metodlar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-rose-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-rose-300">{m.name}</h3>
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

          <div className="mt-5 bg-rose-900/20 border border-rose-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-rose-300 mb-2">💡 To'liq formula validatsiyasi uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">ICP-MS (Ru) + EA (C, H, N) + Fluoressensiya (MLCT 610 nm) + UV-Vis (452 nm) + XRD (gidratli/anhidrous)</strong> — beshta metod birgalikda [Ru(bipy)₃]Cl₂·6H₂O ni to'liq tasdiqlaydi va fotokimyoviy faollikni aniqlaydi.
            </p>
          </div>
        </div>

        {/* 15. ICP CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> ICP ning [Ru(bipy)₃]Cl₂·6H₂O uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                ICP [Ru(bipy)₃]Cl₂·6H₂O ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Organik matritsa effekti</strong> — ichki standart majburiy</li>
                <li><strong className="text-red-300">Gidratli/anhidrous farqlay olmaydi</strong> — EA kerak</li>
                <li><strong className="text-red-300">Faqat Ru ni o'lchaydi</strong> — C, H, N, O, Cl uchun EA/IC kerak</li>
                <li><strong className="text-red-300">7 ta izotop</strong> — murakkab profil</li>
                <li><strong className="text-red-300">Qimmat instrument</strong> — AAS dan 10-20× qimmat</li>
                <li><strong className="text-red-300">Murakkab ishlatish</strong> — malakali operator kerak</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>[Ru(bipy)₃]Cl₂·6H₂O ni to'liq tasdiqlash</strong> uchun kamida 5 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-rose-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. ICP-MS (Ru)</span>
                  <span className="text-rose-400 font-mono">13.77%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (C, H, N)</span>
                  <span className="text-rose-400 font-mono">48.96%, 4.93%, 11.36%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. Fluoressensiya</span>
                  <span className="text-rose-400 font-mono">MLCT 610 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. UV-Vis (MLCT)</span>
                  <span className="text-rose-400 font-mono">452 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. XRD (gidratli)</span>
                  <span className="text-rose-400 font-mono">kristall struktura</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 5 ta metod birgalikda [Ru(bipy)₃]Cl₂·6H₂O ni to'liq tasdiqlaydi va fotokimyoviy faollikni aniqlaydi
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
              <p className="text-xs text-purple-200"><strong className="text-rose-300">Ru ni</strong> ppb darajasida o'lchaydi. 7 ta izotop — izotop nisbatlarini o'lchash imkoni. Inert kompleks tufayli tayyorlash oson.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-rose-300">Organik matritsa effekti!</strong> Ichki standart majburiy. Gidratli/anhidrous farqlanmaydi. C, H, N, O, Cl ko'rinmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EA (C, H, N), Fluoressensiya (MLCT 610 nm), UV-Vis (452 nm), XRD (gidratli/anhidrous) — fotokimyoviy faollikni aniqlash.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/icp" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← ICP metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/icp/birikmalar" className="text-sm bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Ru(bipy)₃]Cl₂·6H₂O • ICP moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, NIST Isotope Data, Graetzel (1977-1991)</p>
        </div>
      </footer>
    </main>
  )
}