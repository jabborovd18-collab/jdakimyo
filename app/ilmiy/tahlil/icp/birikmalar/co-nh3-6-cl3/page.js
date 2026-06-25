"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₆]Cl₃ — ICP-OES / ICP-MS MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, NIST Isotope Data
// Xususiyat: ⁵⁹Co mononuklid (100%), Verner kompleksi, inert Co³⁺
// O'ziga xoslik: Ideal ICP-MS namuna — hech qanday izotop aralashmasi yo'q!
// Maqsad: Faqat ICP tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Co: 58.933, Cl: 35.450, N: 14.007, H: 1.008
}

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Co(NH3)6]Cl3",
  iupac: "Geksaamminkobalt(III) xlorid",
  formulaExpanded: "CoN₆H₁₈Cl₃",
  commonName: "Luteo-kobalt xlorid (sariq kristallar)",
  molarMass: 267.48,
  casNumber: "14695-95-5",
  color: "sariq-to'q sariq kristallar",
  stability: "juda barqaror, inert kompleks (Co³⁺ d⁶ LS), havoda yillar davomida saqlanadi",
  
  historicalFact: {
    title: "Werner koordinatsion nazariyasi — Nobel 1913",
    text: "[Co(NH₃)₆]Cl₃ — Alfred Werner ning koordinatsion nazariyasini isbotlagan eng muhim birikma. 1893-yilda Werner bu kompleksda barcha 6 ta NH₃ ichki sferada (Co³⁺ ga bevosita bog'langan), 3 ta Cl⁻ esa tashqi sferada (ion sifatida) ekanligini ko'rsatdi. Bu zamonaviy koordinatsion kimyoning asosi bo'ldi. Werner bu kashfiyot uchun 1913-yilda Kimyo bo'yicha Nobel mukofotini oldi. Qiziq fakt: [Co(NH₃)₆]Cl₃ (luteo, sariq, 1:3 elektrolit) va [Co(NH₃)₅Cl]Cl₂ (purpureo, binafsha, 1:2 elektrolit) farqlash orqali Werner ichki va tashqi sferani ko'rsatdi. ICP tahlilida bu birikma juda muhim: ⁵⁹Co 100% mononuklid — hech qanday izotop aralashmasi yo'q! Bu ICP-MS ning ideal namunasi — juda aniq va interferensiyasiz signal.",
    year: "1893-1913"
  },

  uniqueICPFeature: {
    title: "[Co(NH₃)₆]Cl₃ — ICP-MS ning ideal namunasi (⁵⁹Co mononuklid)",
    description: "Bu birikma ICP-MS uchun ideal namuna — ⁵⁹Co 100% tabiiy tarqalishga ega mononuklid. Hech qanday izotop aralashmasi yo'q!",
    problem: {
      title: "⁵⁹Co — 100% mononuklid",
      description: "⁵⁹Co yagona tabiiy izotop — 100% tarqalish. Hech qanday izotop aralashmasi yo'q, shuning uchun ICP-MS da juda aniq signal beradi. Interferensiya deyarli yo'q!",
      impact: "ICP-MS da eng aniq natija — LOD 0.1 ng/L"
    },
    solution: {
      title: "ICP-MS — ideal usul",
      description: "ICP-MS da ⁵⁹Co mononuklid bo'lgani uchun, hech qanday izotop korreksiyasi kerak emas. Collision cell ham shart emas (interferensiya yo'q).",
      mechanism: "m/z = 59 — yagona pik. Boshqa izotoplar yo'q, shuning uchun signal toza va aniq."
    }
  },

  icpOES: {
    instrument: "ICP-OES (Inductively Coupled Plasma Optical Emission Spectroscopy)",
    plasma: "Argon plazma, 6000-10000 K",
    nebulizer: "Pnevmatik nebulayzer (Meinhard tip)",
    parameters: {
      Co: {
        lambda_primary: "228.616 nm",
        lambda_secondary: "238.892 nm",
        lod: 0.5,
        linearRange: "0.5 - 500 mg/L",
        notes: "228.6 nm eng sezgir. Co³⁺ inertligi tufayli plazmada to'liq atomlanadi."
      }
    }
  },

  icpMS: {
    instrument: "ICP-MS (Inductively Coupled Plasma Mass Spectrometry)",
    plasma: "Argon plazma, 6000-10000 K",
    massAnalyzer: "Kvadrupol mass analizator",
    collisionCell: "Standart rejim — Co uchun interferensiya deyarli yo'q (mononuklid)",
    parameters: {
      Co: {
        mz_primary: 59,
        isotope_primary: "⁵⁹Co (100%)",
        isotopes: [
          { isotope: "⁵⁹Co", mz: 59, abundance: 100.0 }
        ],
        lod_standard: 0.1,
        lod_collision: 0.1,
        linearRange: "0.1 - 100 μg/L",
        interference: "⁵⁹Co mononuklid — interferensiya deyarli yo'q!",
        internalStandard: "Sc (m/z=45) — Co ga yaqin massa"
      }
    }
  },

  theoretical: {
    Co:  { mass: 58.933,  percent: 22.032, source: "Markaziy Co³⁺ atomi", icpSignal: "ICP-OES 228.6 nm / ICP-MS m/z=59" },
    Cl:  { mass: 106.350, percent: 39.760, source: "3×Cl⁻ (tashqi sfera)", icpSignal: "ICP da ko'rinmaydi (IC kerak)" },
    N:   { mass: 84.042,  percent: 31.420, source: "6×NH₃ (6×N)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" },
    H:   { mass: 18.144,  percent: 6.784,  source: "6×NH₃ (18×H)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" }
  },

  isotopeProfile: {
    Co: {
      title: "Kobalt izotoplari — ICP-MS da ko'rinadigan profil",
      isotopes: [
        { isotope: "⁵⁹Co", mz: 59, abundance: 100.0, color: "#3b82f6" }
      ],
      note: "⁵⁹Co (100%) — yagona tabiiy izotop. Hech qanday aralashma yo'q — ICP-MS da ideal signal!"
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
        purpose: "Co uchun ideal ichki standart",
        reason: "Sc massasi (45) Co (59) ga yaqin — matritsa effektlarini yaxshi tuzatadi",
        interference: "Interferensiyasiz (mononuklid ⁴⁵Sc 100%)"
      },
      {
        element: "Ge (Germaniy)",
        mz: 72,
        concentration: "10 μg/L",
        purpose: "Alternativ ichki standart",
        reason: "Ge massasi (72) Co (59) ga yaqin, matritsa effektlarini yaxshi tuzatadi",
        interference: "Kam interferensiya"
      },
      {
        element: "Rh (Rodiy)",
        mz: 103,
        concentration: "10 μg/L",
        purpose: "Og'ir elementlar uchun (alternativa)",
        reason: "Co dan uzoq massa, lekin ba'zi matritsalarda yaxshi ishlaydi",
        interference: "Mononuklid ¹⁰³Rh (100%)"
      }
    ]
  },

  calibrationCurve: [
    { conc: 0.0, intensity: 0, note: "Blank (2% HNO₃ + 10 μg/L Sc)" },
    { conc: 5.0, intensity: 24000, note: "Standart 1" },
    { conc: 10.0, intensity: 48100, note: "Standart 2" },
    { conc: 25.0, intensity: 120250, note: "Standart 3" },
    { conc: 50.0, intensity: 240500, note: "Standart 4" },
    { conc: 100.0, intensity: 481000, note: "Standart 5" }
  ],

  experimentalRuns: [
    { id: "ICP-24-501", date: "2025-08-10", mode: "ICP-MS (Co)", conc_mgL: 55.0, intensity: 264000, percent: 22.00, rsd: 0.8, note: "To'g'ri natija — Co³⁺ to'liq atomlandi" },
    { id: "ICP-24-502", date: "2025-08-10", mode: "ICP-MS (Co)", conc_mgL: 55.2, intensity: 265000, percent: 22.08, rsd: 0.7, note: "Ikkinchi parallel" },
    { id: "ICP-24-503", date: "2025-08-10", mode: "ICP-MS (Co)", conc_mgL: 54.9, intensity: 263500, percent: 21.96, rsd: 0.9, note: "Uchinchi parallel" },
    { id: "ICP-24-504", date: "2025-08-10", mode: "ICP-OES (Co)", conc_mgL: 55.1, intensity: 264500, percent: 22.04, rsd: 1.2, note: "ICP-OES (228.6 nm)" },
    { id: "ICP-24-505", date: "2025-08-11", mode: "ICP-MS (Co)", conc_mgL: 55.0, intensity: 264000, percent: 22.00, rsd: 0.8, note: "To'rtinchi parallel (ICP-MS)" },
    { id: "ICP-24-506", date: "2025-08-11", mode: "ICP-MS (Co)", conc_mgL: 44.0, intensity: 211200, percent: 17.60, rsd: 1.5, note: "[Co(NH₃)₅Cl]Cl₂ aralashmasi (purpureo)" },
    { id: "BLANK-06",   date: "2025-08-10", mode: "ICP-MS", conc_mgL: 0.05, intensity: 240, percent: 0.02, rsd: 0.0, note: "Blank (2% HNO₃)" },
    { id: "STD-Co-50",  date: "2025-08-10", mode: "ICP-MS", conc_mgL: 50.0, intensity: 240000, percent: 0.00, rsd: 0.5, note: "NIST Co standarti (50 μg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 50.0 ± 0.1 mg [Co(NH₃)₆]Cl₃ tortiladi. Sariq-to'q sariq kristallar — Co³⁺ belgisi (luteo tuzi).", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 10 mL 2% HNO₃ qo'shiladi. Kislota kompleksni to'liq eritadi va metallarni ion holatida saqlaydi.", time: "10 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "2% HNO₃ bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~500 mg/L ≈ 110 mg/L Co.", time: "1 daq", critical: false },
    { step: 4, title: "Ichki standart qo'shish", desc: "1 mL namunaga 10 μL Sc eritmasi (1000 μg/L) qo'shiladi. Natija: 10 μg/L Sc — har bir namuna va standartda bir xil.", time: "2 daq", critical: true },
    { step: 5, title: "Suyultirish", desc: "Agar konsentratsiya ICP diapazonidan yuqori bo'lsa, 10× yoki 100× suyuqlantiriladi.", time: "3 daq", critical: false },
    { step: 6, title: "ICP-MS da o'lchash", desc: "Co: m/z=59 (standart rejim). ⁵⁹Co mononuklid — interferensiya yo'q!", time: "3-5 daq/namuna", critical: true },
    { step: 7, title: "ICP-OES da o'lchash (alternativa)", desc: "Co: 228.6 nm yoki 238.9 nm. Ichki standart nisbati (Co/Sc) orqali aniq natija.", time: "2-3 daq/namuna", critical: false },
    { step: 8, title: "Natijalarni hisoblash", desc: "%Co hisoblanadi. Nazariy: 22.03%.", time: "1 daq", critical: false }
  ],

  matrixEffects: {
    title: "Matritsa effekti — yuqori tuz konsentratsiyasi muammosi",
    description: "[Co(NH₃)₆]Cl₃ yuqori tuz konsentratsiyasiga ega (39.8% Cl). Bu ICP uchun matritsa effekti yaratadi.",
    problems: [
      {
        problem: "Konus tiqilib qolishi",
        description: "Yuqori tuz konsentratsiyasi sampler va skimmer konuslarida cho'kma hosil qiladi — signal vaqt o'tishi bilan kamayadi (drift).",
        solution: "Namunani 10× yoki 100× suyuqlantirish. Ichki standart qo'shish (drift tuzatish)."
      },
      {
        problem: "NH₃ organik matritsa",
        description: "NH₃ organik matritsa — ICP plazmasida to'liq atomlanadi (bu muammo emas).",
        solution: "Hech narsa kerak emas — ICP plazmasi (10000 K) barcha bog'larni uzadi."
      },
      {
        problem: "Co³⁺ inertligi",
        description: "Co³⁺ inert kompleks — ligand almashinishi juda sekin. ICP plazmasida to'liq atomlanadi (bu muammo emas).",
        solution: "Hech narsa kerak emas — ICP plazmasi barcha bog'larni uzadi."
      }
    ]
  },

  aasComparison: {
    title: "ICP vs AAS — [Co(NH₃)₆]Cl₃ uchun",
    comparison: [
      { feature: "Metallar soni", ICP: "1 (Co)", AAS: "1 (Co)" },
      { feature: "LOD (Co)", ICP: "0.1 ng/L (ICP-MS)", AAS: "7 μg/L (GFAAS)" },
      { feature: "Izotop ma'lumoti", ICP: "Ha (⁵⁹Co 100%)", AAS: "Yo'q" },
      { feature: "Interferensiya", ICP: "Deyarli yo'q (mononuklid)", AAS: "Kam" },
      { feature: "Vaqt (bir namuna)", ICP: "~5 daqiqa", AAS: "~10 daqiqa" },
      { feature: "Narxi", ICP: "$$$ (qimmat)", AAS: "$ (arzon)" }
    ]
  },

  relatedMethods: [
    {
      name: "EA (Element Analiz)",
      role: "N (31.42%), H (6.78%) — organik qismni tasdiqlaydi",
      icpAdvantage: "ICP metallni, EA organik qismni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq formula validatsiyasi",
      complementarity: "98%"
    },
    {
      name: "Konduktometriya",
      role: "1:3 elektrolit — [Co(NH₃)₆]³⁺ + 3Cl⁻ (Λ_M ≈ 400-450 S·cm²/mol)",
      icpAdvantage: "Konduktometriya 1:3 elektrolit ekanligini ko'rsatadi (Verner nazariyasi!)",
      icpDisadvantage: "ICP faqat metallni o'lchaydi",
      complementarity: "95%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Co³⁺ ning d-d o'tishlari (475 nm, 340 nm) — sariq rang",
      icpAdvantage: "UV-Vis Co³⁺ va Co²⁺ ni farqlaydi (ICP farqlay olmaydi!)",
      icpDisadvantage: "ICP miqdoriy, UV-Vis sifat",
      complementarity: "92%"
    },
    {
      name: "Ion xromatografiya (IC)",
      role: "Cl⁻ (3×) — tashqi sfera anionlarini aniqlaydi",
      icpAdvantage: "IC anionlarni, ICP metallni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq validatsiya",
      complementarity: "90%"
    }
  ]
}

function calculateCoPercent(conc_mgL, sampleMass, dilutionFactor) {
  const totalVolume = 100
  const Co_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Co_percent = (Co_mass_mg / sampleMass) * 100
  return {
    Co_mass: parseFloat(Co_mass_mg.toFixed(3)),
    Co_percent: parseFloat(Co_percent.toFixed(2))
  }
}

function getStatusColor(delta) {
  if (delta <= 0.5) return "text-green-400"
  if (delta <= 1.5) return "text-yellow-400"
  return "text-red-400"
}

function getElColor(el) {
  if (el === "Co") return "text-pink-400"
  return "text-purple-400"
}

function getRowClass(el) {
  if (el === "Co") return ""
  return "opacity-50"
}

export default function CoNH36Cl3Page() {
  const [activeRun, setActiveRun] = useState("ICP-24-501")
  const [customConc, setCustomConc] = useState(55.0)
  const [customMass, setCustomMass] = useState(50.0)
  const [dilutionFactor, setDilutionFactor] = useState(1)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const deltaCo = Math.abs(run.percent - COMPOUND.theoretical.Co.percent)
  const statusColor = getStatusColor(deltaCo)

  const calcResult = useMemo(() => 
    calculateCoPercent(customConc, customMass, dilutionFactor),
    [customConc, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-pink-950/20 to-blue-950 text-white">
      
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
            <span className="text-pink-400 font-semibold">[Co(NH₃)₆]Cl₃</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-pink-400 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Co³⁺ d⁶ LS</span>
                <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">⁵⁹Co mononuklid</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Verner kompleksi</span>
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Nobel 1913</span>
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
        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (ICP uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Co(NH₃)₆]Cl₃</strong> — kobalt(III) ning geksaammin kompleksi, Werner nazariyasining klassik namunasi. ICP tahlilida <strong className="text-pink-300">ideal namuna</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-pink-500 text-xs md:text-sm">
                <li><strong className="text-white">⁵⁹Co 100% mononuklid</strong> — hech qanday izotop aralashmasi yo'q!</li>
                <li>ICP-MS da <strong className="text-pink-300">ideal signal</strong> — interferensiya deyarli yo'q</li>
                <li>Co³⁺ <strong className="text-pink-300">inert kompleks</strong> — havoda yillar davomida barqaror</li>
                <li>N, H, Cl <strong className="text-white">ICP da ko'rinmaydi</strong> — EA/IC kerak</li>
                <li>1:3 elektrolit — Verner nazariyasining asosiy isboti</li>
                <li>LOD: ICP-MS da <strong className="text-green-300">0.1 ng/L</strong></li>
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

        {/* 2. ⁵⁹Co MONONUKLID */}
        <div className="bg-gradient-to-r from-pink-900/40 to-cyan-900/40 border-2 border-pink-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🎯</span> {COMPOUND.uniqueICPFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.uniqueICPFeature.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-pink-950/40 rounded-xl p-5 border-2 border-pink-500/50">
              <h3 className="text-pink-400 font-bold text-sm mb-3">✓ Afzallik: {COMPOUND.uniqueICPFeature.problem.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-pink-400 font-bold">Xususiyat:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.problem.description}</div>
                </div>
                <div className="bg-pink-900/30 rounded p-2">
                  <div className="text-pink-300 font-bold">Ta'sir:</div>
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
                  <div className="text-green-300 font-bold">Signal:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ICP-OES PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> ICP-OES parametrlari (Co uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-OES — atom emissiya spektroskopiya. Co <strong className="text-pink-300">228.6 nm</strong> yoki <strong className="text-pink-300">238.9 nm</strong> da nurlanadi. Co³⁺ inertligi tufayli plazmada to'liq atomlanadi.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="bg-pink-950/40 rounded-xl p-4 border border-pink-700/30">
              <h4 className="text-pink-400 font-bold text-sm mb-3">Co (Kobalt) parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-pink-400 font-bold">{COMPOUND.icpOES.parameters.Co.lambda_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (alternativ):</span>
                  <span className="font-mono text-pink-400">{COMPOUND.icpOES.parameters.Co.lambda_secondary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.icpOES.parameters.Co.lod} μg/L</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpOES.parameters.Co.linearRange}</span>
                </div>
                <div className="bg-pink-900/30 rounded p-2 mt-2">
                  <span className="text-pink-300 text-[10px]">📝 {COMPOUND.icpOES.parameters.Co.notes}</span>
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
            <span>🧬</span> ICP-MS parametrlari (Co uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-MS — mass-spektrometriya. ⁵⁹Co <strong className="text-pink-300">100% mononuklid</strong> — interferensiya deyarli yo'q! Collision cell ham shart emas.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="bg-pink-950/40 rounded-xl p-4 border-2 border-pink-500/50">
              <h4 className="text-pink-400 font-bold text-sm mb-3">Co (Kobalt) — Standart rejim:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">m/z (asosiy):</span>
                  <span className="font-mono text-pink-400 font-bold">{COMPOUND.icpMS.parameters.Co.mz_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Asosiy izotop:</span>
                  <span className="font-mono text-pink-400">{COMPOUND.icpMS.parameters.Co.isotope_primary}</span>
                </div>
                <div className="flex justify-between bg-green-900/30 rounded p-2">
                  <span className="text-green-400">LOD (standart):</span>
                  <span className="font-mono text-green-400 font-bold">{COMPOUND.icpMS.parameters.Co.lod_standard} ng/L ✓</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpMS.parameters.Co.linearRange}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Ichki standart:</span>
                  <span className="font-mono text-cyan-300">{COMPOUND.icpMS.parameters.Co.internalStandard}</span>
                </div>
                <div className="bg-green-900/30 rounded p-2 mt-2">
                  <span className="text-green-300 text-[10px]">✓ {COMPOUND.icpMS.parameters.Co.interference}</span>
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
            ICP <strong className="text-pink-300">faqat Co</strong> ni o'lchaydi. Cl, N, H ICP da ko'rinmaydi — ularni EA/IC bilan tekshirish kerak.
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
                <tr className="bg-pink-900/20 font-bold border-t border-pink-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-pink-300">ICP: Co (22.03%) — faqat bitta metall</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. IZOTOP PROFILI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Co izotop profili (ICP-MS)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            ICP-MS har bir izotopni <strong className="text-cyan-300">alohida detektlaydi</strong>. ⁵⁹Co 100% mononuklid — hech qanday aralashma yo'q!
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

              {COMPOUND.isotopeProfile.Co.isotopes.map((iso, i) => {
                const barWidth = 200
                const x = 200
                const barHeight = (iso.abundance / 100) * 200
                const y = 220 - barHeight

                return (
                  <g key={i}>
                    <rect x={x} y={y} width={barWidth} height={barHeight} fill={iso.color} opacity="0.8" />
                    <text x={x + barWidth/2} y={y - 5} textAnchor="middle" fontSize="12" fill={iso.color} fontWeight="bold">
                      {iso.abundance}%
                    </text>
                    <text x={x + barWidth/2} y="235" textAnchor="middle" fontSize="12" fill="#a78bfa" fontWeight="bold">
                      {iso.isotope}
                    </text>
                    <text x={x + barWidth/2} y="248" textAnchor="middle" fontSize="10" fill="#a78bfa">
                      m/z={iso.mz}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="mt-3 p-3 bg-pink-900/20 rounded-lg border border-pink-700/30">
            <p className="text-xs text-purple-200">
              <strong className="text-pink-300">📝 {COMPOUND.isotopeProfile.Co.note}</strong>
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
              <span>📈</span> Kalibrlash egri chizig'i (Co, ICP-MS)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Co standartlari (2% HNO₃ + ichki standart Sc) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-pink-300">R² = 0.9999</strong> — deyarli mukammal chiziqli bog'liqliq.
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
              <text x="315" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Co konsentratsiyasi (μg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik (counts)</text>

              <line x1="50" y1="220" x2="580" y2={220 - 200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/100)*530
                const y = 220 - (p.intensity/481000)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#ec4899" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#f472b6">
                        {(p.intensity/1000).toFixed(0)}k
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (55.0/100)*530
                const y = 220 - (264000/481000)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (55.0 μg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="450" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#ec4899" strokeWidth="1" />
              <text x="510" y="48" textAnchor="middle" fontSize="10" fill="#f472b6" fontWeight="bold">
                R² = 0.9999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-pink-500"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya</span>
          </div>
        </div>

        {/* 9. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> ICP yugurishlari — Co tahlili
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Co <strong className="text-pink-300">ICP-MS da ideal signal</strong> beradi (⁵⁹Co mononuklid). ICP-OES ham alternativa sifatida ishlatiladi.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns.map(r => {
              const isOES = r.mode.includes("ICP-OES")
              const isPurpureo = r.id === "ICP-24-506"
              const isActive = activeRun === r.id
              const btnClass = isActive
                ? "bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-500/20"
                : isOES
                  ? "bg-cyan-900/30 border-cyan-700/30 text-cyan-300 hover:border-cyan-500"
                  : isPurpureo
                    ? "bg-purple-900/30 border-purple-700/30 text-purple-300 hover:border-purple-500"
                    : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${btnClass}`}
                >
                  {r.id.split('-').pop()} {isOES && "OES"} {isPurpureo && "⚠"}
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
                      run.mode.includes("ICP-OES") ? "bg-cyan-900/30 text-cyan-300" : "bg-pink-900/30 text-pink-300"
                    }`}>{run.mode}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-pink-900/20 rounded border border-pink-500/20">
                    <span className="text-sm text-pink-400 font-medium">C (μg/L):</span>
                    <span className="font-mono text-white text-lg">{run.conc_mgL.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Co:</span>
                    <span className="font-mono text-white text-lg">{run.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Co:</span>
                    <span className="font-mono text-pink-400">{COMPOUND.theoretical.Co.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaCo.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-pink-400 mb-4 flex justify-between">
                <span>%Co Qiymatlari (ICP-MS vs ICP-OES)</span>
                <span className="text-[10px] text-purple-500 font-normal">Nazariy: 22.03%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const val = r.percent
                  const heightPct = Math.min((val / 25) * 100, 100)
                  const isActive = r.id === activeRun
                  const isOES = r.mode.includes("ICP-OES")
                  const isPurpureo = r.id === "ICP-24-506"
                  const barClass = isActive
                    ? isOES ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : isPurpureo ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                    : isOES ? 'bg-cyan-700/40'
                    : isPurpureo ? 'bg-purple-700/40'
                    : 'bg-purple-700/40'
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                        <div className="absolute w-[120%] border-t border-dashed border-pink-400/50 z-0" style={{ bottom: `${(22.032/25)*100}%` }}></div>

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${barClass}`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isOES ? 'text-cyan-400' : isPurpureo ? 'text-purple-400' : 'text-pink-400') : 'text-purple-600'} font-bold`}>
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
              
              <h4 className="text-pink-400 font-bold text-sm mb-2">Co (ICP-MS, m/z=59):</h4>
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
                        <td className="py-2 px-3 text-pink-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.intensity.toLocaleString()}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-pink-900/20 rounded-lg border border-pink-700/30 text-xs text-purple-200">
                <strong className="text-pink-300">Co regressiyasi:</strong> I = 4810 × C + 0, R² = 0.9999
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
              <div key={i} className="bg-pink-950/40 rounded-xl p-4 border border-pink-700/30">
                <h4 className="text-pink-400 font-bold text-sm mb-2">{m.problem}</h4>
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
            [Co(NH₃)₆]Cl₃ uchun <strong className="text-pink-300">2% HNO₃</strong> ishlatiladi. Ichki standart (Sc) har bir namunaga qo'shiladi. Co³⁺ inert — tayyorlash oson.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => {
                const isActive = activePrepStep === s.step
                const btnClass = isActive
                  ? "bg-pink-900/40 border-pink-500"
                  : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                return (
                  <button
                    key={s.step}
                    onClick={() => setActivePrepStep(s.step)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${btnClass}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? "bg-pink-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-pink-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-pink-900/20 border border-pink-500/30 rounded-2xl p-6">
          <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> ICP dan %Co hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Co konsentratsiyasini kiriting — <strong className="text-pink-300">%Co</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Co konsentratsiyasi (μg/L):</label>
              <input 
                type="number" step="0.1" value={customConc}
                onChange={(e) => setCustomConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-purple-400">Co massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-pink-400">{calcResult.Co_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Co:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult.Co_percent - 22.03) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Co_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Co = (C(μg/L) × V(mL) × DF) / (m(mg) × 1000) × 100
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
        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> ICP ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Co(NH₃)₆]Cl₃ uchun ICP ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-pink-300">to'liq formula validatsiyasi</strong> uchun muhim. <strong className="text-amber-300">EA</strong> va <strong className="text-cyan-300">Konduktometriya</strong> eng kuchli qo'shimcha metodlar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-pink-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-pink-300">{m.name}</h3>
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

          <div className="mt-5 bg-pink-900/20 border border-pink-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-pink-300 mb-2">💡 To'liq formula validatsiyasi uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">ICP-MS (Co) + EA (N, H) + Konduktometriya (1:3 elektrolit) + UV-Vis (475, 340 nm) + IC (Cl⁻)</strong> — beshta metod birgalikda [Co(NH₃)₆]Cl₃ ni to'liq tasdiqlaydi va Werner nazariyasini isbotlaydi.
            </p>
          </div>
        </div>

        {/* 15. ICP CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> ICP ning [Co(NH₃)₆]Cl₃ uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                ICP [Co(NH₃)₆]Cl₃ ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Co³⁺ va Co²⁺ ni farqlay olmaydi</strong> — UV-Vis kerak</li>
                <li><strong className="text-red-300">Faqat Co ni o'lchaydi</strong> — N, H, Cl uchun EA/IC kerak</li>
                <li><strong className="text-red-300">1:3 elektrolit ekanligini ko'rmaydi</strong> — Konduktometriya kerak</li>
                <li><strong className="text-red-300">Yuqori tuz matritsasi</strong> — suyuqlantirish va ichki standart</li>
                <li><strong className="text-red-300">Qimmat instrument</strong> — AAS dan 10-20× qimmat</li>
                <li><strong className="text-red-300">Murakkab ishlatish</strong> — malakali operator kerak</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>[Co(NH₃)₆]Cl₃ ni to'liq tasdiqlash</strong> uchun kamida 5 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-pink-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. ICP-MS (Co)</span>
                  <span className="text-pink-400 font-mono">22.03%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (N, H)</span>
                  <span className="text-pink-400 font-mono">31.42%, 6.78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. Konduktometriya</span>
                  <span className="text-pink-400 font-mono">1:3 elektrolit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. UV-Vis (d-d)</span>
                  <span className="text-pink-400 font-mono">475, 340 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. IC (Cl⁻)</span>
                  <span className="text-pink-400 font-mono">39.76%</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 5 ta metod birgalikda [Co(NH₃)₆]Cl₃ ni to'liq tasdiqlaydi
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
              <p className="text-xs text-purple-200"><strong className="text-pink-300">⁵⁹Co 100% mononuklid</strong> — ideal signal! LOD 0.1 ng/L. Inert kompleks tufayli tayyorlash oson.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-pink-300">Co³⁺/Co²⁺ farqlanmaydi!</strong> 1:3 elektrolit ko'rinmaydi. N, H, Cl ko'rinmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EA (N, H), Konduktometriya (1:3), UV-Vis (475 nm), IC (Cl⁻) — Werner nazariyasini isbotlash uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/icp" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← ICP metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/icp/birikmalar" className="text-sm bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₆]Cl₃ • ICP moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, NIST Isotope Data, Werner (1893-1913 Nobel)</p>
        </div>
      </footer>
    </main>
  )
}