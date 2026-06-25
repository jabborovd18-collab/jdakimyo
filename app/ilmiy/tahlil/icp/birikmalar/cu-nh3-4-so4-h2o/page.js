"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Cu(NH₃)₄]SO₄·H₂O — ICP-OES / ICP-MS MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, NIST Isotope Data
// Xususiyat: Cu va S ni bir vaqtda o'lchash (ICP-OES), Jahn-Teller effekti
// Maqsad: Faqat ICP tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Cu: 63.546, S: 32.065, N: 14.007, H: 1.008, O: 15.999
}

const COMPOUND = {
  formulaHTML: "[Cu(NH<sub>3</sub>)<sub>4</sub>]SO<sub>4</sub>·H<sub>2</sub>O",
  formulaPlain: "[Cu(NH3)4]SO4·H2O",
  iupac: "Tetraammismis(II) sulfat monogidrat",
  formulaExpanded: "CuN₄H₁₄SO₅",
  commonName: "Tetraamminmis(II) sulfat monogidrat",
  molarMass: 245.75,
  casNumber: "10380-29-7",
  color: "to'q ko'k (ultramarin) kristallar",
  stability: "havoda barqaror, NH₃ asta-sekin bug'lanadi, suvda yaxshi eriydi",
  
  historicalFact: {
    title: "Schweizer reagenti — sellyuloza erituvchi kashfiyoti",
    text: "[Cu(NH₃)₄]²⁺ kompleksi 1857-yilda Shveytsariya kimyogari Matthias Eduard Schweizer tomonidan kashf etilgan. Uning gidroksid shakli [Cu(NH₃)₄](OH)₂ — 'Schweizer reagenti' — sellyulozani erita oladigan yagona reagent edi. Bu kashfiyot birinchi sun'iy ipak (kuprammoniy rayoni) ishlab chiqarishga asos bo'ldi. [Cu(NH₃)₄]SO₄·H₂O — shu mashhur kompleksning barqaror sulfatli shakli. Qiziq fakt: Cu²⁺ ning d⁹ elektron konfiguratsiyasi Jahn-Teller effektiga olib keladi — oktaedr geometriya buziladi va elongatsiyalangan oktaedr hosil bo'ladi. ICP tahlilida bu birikma muhim misol: ICP-OES da Cu (324.7 nm) va S (180.7 nm) ni bir vaqtda o'lchash mumkin — bu ICP ning ko'p elementli qobiliyatini ko'rsatadi.",
    year: "1857-yil"
  },

  uniqueICPFeature: {
    title: "[Cu(NH₃)₄]SO₄·H₂O — Cu va S ni bir vaqtda o'lchash",
    description: "Bu birikma ICP-OES ning ko'p elementli qobiliyatini ko'rsatadi — bir vaqtda Cu va S ni o'lchash mumkin.",
    problem: {
      title: "ICP-OES da Cu va S birga",
      description: "ICP-OES da Cu (324.754 nm) va S (180.731 nm) ni bir vaqtda o'lchash mumkin. Bu birikmada Cu va S birga bo'lgani uchun, ularning nisbatini ham tekshirish mumkin.",
      impact: "Cu:S = 1:1 nisbat — formulani tasdiqlash uchun muhim"
    },
    solution: {
      title: "ICP-OES ko'p elementli tahlil",
      description: "ICP-OES bir vaqtda 60+ elementni o'lchaydi. Cu va S ni bir o'lchashda ko'rish mumkin — bu ICP ning asosiy afzalligi.",
      mechanism: "Plazmada barcha elementlar atomlashtiriladi va har biri o'z to'lqin uzunligida nurlanadi. Polychromator yordamida bir vaqtda ko'p element detektlanadi."
    }
  },

  icpOES: {
    instrument: "ICP-OES (Inductively Coupled Plasma Optical Emission Spectroscopy)",
    plasma: "Argon plazma, 6000-10000 K",
    nebulizer: "Pnevmatik nebulayzer (Meinhard tip)",
    parameters: {
      Cu: {
        lambda_primary: "324.754 nm",
        lambda_secondary: "327.396 nm",
        lod: 0.3,
        linearRange: "0.3 - 500 mg/L",
        notes: "324.7 nm eng sezgir. Cu²⁺ inertligi tufayli plazmada to'liq atomlanadi."
      },
      S: {
        lambda_primary: "180.731 nm",
        lambda_secondary: "182.034 nm",
        lod: 50,
        linearRange: "50 - 1000 mg/L",
        notes: "180.7 nm eng sezgir, lekin matritsa effektlariga sezgir. SO₄²⁻ to'liq atomlanadi."
      }
    }
  },

  icpMS: {
    instrument: "ICP-MS (Inductively Coupled Plasma Mass Spectrometry)",
    plasma: "Argon plazma, 6000-10000 K",
    massAnalyzer: "Kvadrupol mass analizator",
    collisionCell: "Standart rejim — Cu uchun interferensiya kam",
    parameters: {
      Cu: {
        mz_primary: 63,
        isotope_primary: "⁶³Cu (69.17%)",
        isotopes: [
          { isotope: "⁶³Cu", mz: 63, abundance: 69.17 },
          { isotope: "⁶⁵Cu", mz: 65, abundance: 30.83 }
        ],
        lod_standard: 0.2,
        lod_collision: 0.2,
        linearRange: "0.2 - 100 μg/L",
        interference: "⁴⁰Ar²³Na⁺ (m/z=63) — oz ta'sir, odatda muammo emas",
        internalStandard: "Sc (m/z=45) — Cu ga yaqin massa"
      }
    }
  },

  theoretical: {
    Cu:  { mass: 63.546,  percent: 25.858, source: "Markaziy Cu²⁺ atomi", icpSignal: "ICP-OES 324.7 nm / ICP-MS m/z=63" },
    S:   { mass: 32.065,  percent: 13.048, source: "SO₄²⁻ (tashqi sfera)", icpSignal: "ICP-OES 180.7 nm (ICP-MS da ko'rinmaydi)" },
    N:   { mass: 56.028,  percent: 22.798, source: "4×NH₃ (4×N)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" },
    H:   { mass: 14.112,  percent: 5.742,  source: "4×NH₃ (12×H) + H₂O (2×H)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" },
    O:   { mass: 79.995,  percent: 32.551, source: "SO₄²⁻ (4×O) + H₂O (1×O)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" }
  },

  isotopeProfile: {
    Cu: {
      title: "Mis izotoplari — ICP-MS da ko'rinadigan profil",
      isotopes: [
        { isotope: "⁶³Cu", mz: 63, abundance: 69.17, color: "#3b82f6" },
        { isotope: "⁶⁵Cu", mz: 65, abundance: 30.83, color: "#f59e0b" }
      ],
      note: "⁶³Cu (69.2%) — asosiy izotop. ⁴⁰Ar²³Na⁺ (m/z=63) oz ta'sir qiladi, lekin odatda muammo emas."
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
        purpose: "Cu uchun ideal ichki standart",
        reason: "Sc massasi (45) Cu (63) ga yaqin — matritsa effektlarini yaxshi tuzatadi",
        interference: "Interferensiyasiz (mononuklid ⁴⁵Sc 100%)"
      },
      {
        element: "Ge (Germaniy)",
        mz: 72,
        concentration: "10 μg/L",
        purpose: "Alternativ ichki standart",
        reason: "Ge massasi (72) Cu (63) ga yaqin, matritsa effektlarini yaxshi tuzatadi",
        interference: "Kam interferensiya"
      },
      {
        element: "Rh (Rodiy)",
        mz: 103,
        concentration: "10 μg/L",
        purpose: "Og'ir elementlar uchun (bu birikma uchun alternativa)",
        reason: "Cu dan uzoq massa, lekin ba'zi matritsalarda yaxshi ishlaydi",
        interference: "Mononuklid ¹⁰³Rh (100%)"
      }
    ]
  },

  calibrationCurve_Cu: [
    { conc: 0.0, intensity: 0, note: "Blank (2% HNO₃ + 10 μg/L Sc)" },
    { conc: 5.0, intensity: 25000, note: "Standart 1" },
    { conc: 10.0, intensity: 50100, note: "Standart 2" },
    { conc: 25.0, intensity: 125250, note: "Standart 3" },
    { conc: 50.0, intensity: 250500, note: "Standart 4" },
    { conc: 100.0, intensity: 501000, note: "Standart 5" }
  ],

  calibrationCurve_S: [
    { conc: 0.0, intensity: 0, note: "Blank (2% HNO₃)" },
    { conc: 10.0, intensity: 8000, note: "Standart 1" },
    { conc: 25.0, intensity: 20000, note: "Standart 2" },
    { conc: 50.0, intensity: 40000, note: "Standart 3" },
    { conc: 100.0, intensity: 80000, note: "Standart 4" },
    { conc: 250.0, intensity: 200000, note: "Standart 5" }
  ],

  experimentalRuns_Cu: [
    { id: "ICP-24-301", date: "2025-07-10", mode: "ICP-OES (Cu)", conc_mgL: 64.5, intensity: 322500, percent: 25.80, rsd: 1.2, note: "To'g'ri natija — Cu to'liq atomlandi" },
    { id: "ICP-24-302", date: "2025-07-10", mode: "ICP-OES (Cu)", conc_mgL: 64.7, intensity: 323500, percent: 25.88, rsd: 1.1, note: "Ikkinchi parallel" },
    { id: "ICP-24-303", date: "2025-07-10", mode: "ICP-OES (Cu)", conc_mgL: 64.4, intensity: 322000, percent: 25.76, rsd: 1.3, note: "Uchinchi parallel" },
    { id: "ICP-24-304", date: "2025-07-10", mode: "ICP-MS (Cu)", conc_mgL: 64.6, intensity: 323000, percent: 25.84, rsd: 0.8, note: "ICP-MS (ppt darajasi)" },
    { id: "ICP-24-305", date: "2025-07-10", mode: "ICP-MS (Cu)", conc_mgL: 64.5, intensity: 322500, percent: 25.80, rsd: 0.9, note: "Ikkinchi parallel (ICP-MS)" },
    { id: "BLANK-04",   date: "2025-07-10", mode: "ICP-OES", conc_mgL: 0.1, intensity: 500, percent: 0.04, rsd: 0.0, note: "Blank (2% HNO₃)" },
    { id: "STD-Cu-50",  date: "2025-07-10", mode: "ICP-OES", conc_mgL: 50.0, intensity: 250000, percent: 0.00, rsd: 0.5, note: "NIST Cu standarti (50 μg/L)" }
  ],

  experimentalRuns_S: [
    { id: "ICP-24-401", date: "2025-07-10", mode: "ICP-OES (S)", conc_mgL: 32.6, intensity: 26080, percent: 13.04, rsd: 2.5, note: "To'g'ri natija — S to'liq atomlandi" },
    { id: "ICP-24-402", date: "2025-07-10", mode: "ICP-OES (S)", conc_mgL: 32.8, intensity: 26240, percent: 13.12, rsd: 2.3, note: "Ikkinchi parallel" },
    { id: "ICP-24-403", date: "2025-07-10", mode: "ICP-OES (S)", conc_mgL: 32.5, intensity: 26000, percent: 13.00, rsd: 2.6, note: "Uchinchi parallel" },
    { id: "ICP-24-404", date: "2025-07-10", mode: "ICP-OES (S)", conc_mgL: 32.7, intensity: 26160, percent: 13.08, rsd: 2.4, note: "To'rtinchi parallel" },
    { id: "BLANK-05",   date: "2025-07-10", mode: "ICP-OES (S)", conc_mgL: 0.5, intensity: 400, percent: 0.20, rsd: 0.0, note: "Blank (2% HNO₃)" },
    { id: "STD-S-100",  date: "2025-07-10", mode: "ICP-OES (S)", conc_mgL: 100.0, intensity: 80000, percent: 0.00, rsd: 1.5, note: "NIST S standarti (100 mg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 50.0 ± 0.1 mg [Cu(NH₃)₄]SO₄·H₂O tortiladi. To'q ko'k kristallar — Cu²⁺ belgisi.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 10 mL 2% HNO₃ qo'shiladi. Kislota kompleksni to'liq eritadi va metallarni ion holatida saqlaydi.", time: "10 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "2% HNO₃ bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~500 mg/L ≈ 129 mg/L Cu, 65 mg/L S.", time: "1 daq", critical: false },
    { step: 4, title: "Ichki standart qo'shish (Cu uchun)", desc: "1 mL namunaga 10 μL Sc eritmasi (1000 μg/L) qo'shiladi. Natija: 10 μg/L Sc — har bir namuna va standartda bir xil.", time: "2 daq", critical: true },
    { step: 5, title: "Suyultirish (agar kerak)", desc: "Agar konsentratsiya ICP diapazonidan yuqori bo'lsa, 10× yoki 100× suyuqlantiriladi.", time: "3 daq", critical: false },
    { step: 6, title: "ICP-OES da o'lchash (Cu va S)", desc: "Cu: 324.7 nm, S: 180.7 nm. Ichki standart nisbati (Cu/Sc) orqali aniq natija.", time: "2-3 daq/namuna", critical: false },
    { step: 7, title: "ICP-MS da o'lchash (Cu uchun)", desc: "Cu: m/z=63 (standart rejim). ⁴⁰Ar²³Na⁺ oz ta'sir qiladi.", time: "3-5 daq/namuna", critical: true },
    { step: 8, title: "Natijalarni hisoblash", desc: "%Cu va %S alohida hisoblanadi. Cu:S = 1:1 nisbat tekshiriladi.", time: "1 daq", critical: false }
  ],

  matrixEffects: {
    title: "Matritsa effekti — yuqori tuz konsentratsiyasi muammosi",
    description: "[Cu(NH₃)₄]SO₄·H₂O yuqori tuz konsentratsiyasiga ega. Bu ICP uchun matritsa effekti yaratadi.",
    problems: [
      {
        problem: "Konus tiqilib qolishi",
        description: "Yuqori tuz konsentratsiyasi sampler va skimmer konuslarida cho'kma hosil qiladi — signal vaqt o'tishi bilan kamayadi (drift).",
        solution: "Namunani 10× yoki 100× suyuqlantirish. Ichki standart qo'shish (drift tuzatish)."
      },
      {
        problem: "Spektral fon (ICP-OES, S uchun)",
        description: "Yuqori tuz matritsasi fon nurlanishini oshiradi — S uchun LOD yomonlashadi.",
        solution: "Background correction (fon tuzatish) va suyuqlantirish."
      },
      {
        problem: "NH₃ organik matritsa",
        description: "NH₃ organik matritsa — ICP plazmasida to'liq atomlanadi (bu muammo emas).",
        solution: "Hech narsa kerak emas — ICP plazmasi (10000 K) barcha bog'larni uzadi."
      }
    ]
  },

  aasComparison: {
    title: "ICP vs AAS — [Cu(NH₃)₄]SO₄·H₂O uchun",
    comparison: [
      { feature: "Metallar soni", ICP: "2 (Cu + S bir vaqtda)", AAS: "1 (Cu, ketma-ket)" },
      { feature: "LOD (Cu)", ICP: "0.2 ng/L (ICP-MS)", AAS: "2 μg/L (GFAAS)" },
      { feature: "Izotop ma'lumoti", ICP: "Ha (⁶³Cu, ⁶⁵Cu)", AAS: "Yo'q" },
      { feature: "S ni o'lchash", ICP: "Ha (ICP-OES 180.7 nm)", AAS: "Yo'q (AAS da S ko'rinmaydi)" },
      { feature: "Vaqt (bir namuna)", ICP: "~5 daqiqa (Cu + S birga)", AAS: "~10 daqiqa (faqat Cu)" },
      { feature: "Narxi", ICP: "$$$ (qimmat)", AAS: "$ (arzon)" }
    ]
  },

  relatedMethods: [
    {
      name: "EA (Element Analiz)",
      role: "N (22.80%), H (5.74%) — organik qismni tasdiqlaydi",
      icpAdvantage: "ICP metallarni, EA organik qismni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq formula validatsiyasi",
      complementarity: "98%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Cu²⁺ ning d-d o'tishlari (620 nm) — to'q ko'k rang",
      icpAdvantage: "UV-Vis Cu²⁺ va Cu⁺ ni farqlaydi (ICP farqlay olmaydi!)",
      icpDisadvantage: "ICP miqdoriy, UV-Vis sifat",
      complementarity: "95%"
    },
    {
      name: "EPR spektroskopiya",
      role: "Cu²⁺ (d⁹) — kuchli EPR signali (g_∥ ≈ 2.25, g_⊥ ≈ 2.05)",
      icpAdvantage: "EPR Cu²⁺ ni aniq aniqlaydi",
      icpDisadvantage: "ICP miqdoriy, EPR oksidlanish holatini",
      complementarity: "92%"
    },
    {
      name: "Ion xromatografiya (IC)",
      role: "SO₄²⁻ (1×) — tashqi sfera anionlarini aniqlaydi",
      icpAdvantage: "IC anionlarni, ICP metallni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq validatsiya",
      complementarity: "90%"
    }
  ]
}

function calculateCuPercent(conc_mgL, sampleMass, dilutionFactor) {
  const totalVolume = 100
  const Cu_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Cu_percent = (Cu_mass_mg / sampleMass) * 100
  return {
    Cu_mass: parseFloat(Cu_mass_mg.toFixed(3)),
    Cu_percent: parseFloat(Cu_percent.toFixed(2))
  }
}

function calculateSPercent(conc_mgL, sampleMass, dilutionFactor) {
  const totalVolume = 100
  const S_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const S_percent = (S_mass_mg / sampleMass) * 100
  return {
    S_mass: parseFloat(S_mass_mg.toFixed(3)),
    S_percent: parseFloat(S_percent.toFixed(2))
  }
}

// Yordamchi funksiyalar - className yaratish uchun
function getStatusColor(delta) {
  if (delta <= 0.5) return "text-green-400"
  if (delta <= 1.5) return "text-yellow-400"
  return "text-red-400"
}

function getElColor(el) {
  if (el === "Cu") return "text-blue-400"
  if (el === "S") return "text-cyan-400"
  return "text-purple-400"
}

function getRowClass(el) {
  if (el === "Cu" || el === "S") return ""
  return "opacity-50"
}

export default function CuNH34SO4Page() {
  const [activeRun_Cu, setActiveRun_Cu] = useState("ICP-24-301")
  const [activeRun_S, setActiveRun_S] = useState("ICP-24-401")
  const [customConc_Cu, setCustomConc_Cu] = useState(64.5)
  const [customConc_S, setCustomConc_S] = useState(32.6)
  const [customMass, setCustomMass] = useState(50.0)
  const [dilutionFactor, setDilutionFactor] = useState(1)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)
  const [activeMetal, setActiveMetal] = useState("Cu")

  const run_Cu = COMPOUND.experimentalRuns_Cu.find(r => r.id === activeRun_Cu) || COMPOUND.experimentalRuns_Cu[0]
  const run_S = COMPOUND.experimentalRuns_S.find(r => r.id === activeRun_S) || COMPOUND.experimentalRuns_S[0]
  
  const deltaCu = Math.abs(run_Cu.percent - COMPOUND.theoretical.Cu.percent)
  const deltaS = Math.abs(run_S.percent - COMPOUND.theoretical.S.percent)
  
  const statusColor_Cu = getStatusColor(deltaCu)
  const statusColor_S = getStatusColor(deltaS)

  const calcResult_Cu = useMemo(() => 
    calculateCuPercent(customConc_Cu, customMass, dilutionFactor),
    [customConc_Cu, customMass, dilutionFactor]
  )

  const calcResult_S = useMemo(() => 
    calculateSPercent(customConc_S, customMass, dilutionFactor),
    [customConc_S, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-cyan-950/20 to-blue-950 text-white">
      
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
            <span className="text-blue-400 font-semibold">[Cu(NH₃)₄]SO₄·H₂O</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Cu²⁺ d⁹</span>
                <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Jahn-Teller</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Ko'p elementli</span>
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Cu + S birga</span>
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
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (ICP uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Cu(NH₃)₄]SO₄·H₂O</strong> — mis(II) ning tetraammin kompleksi, klassik Jahn-Teller kompleksi. ICP tahlilida <strong className="text-blue-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-blue-500 text-xs md:text-sm">
                <li><strong className="text-white">Cu va S ni bir vaqtda</strong> o'lchash mumkin (ICP-OES)</li>
                <li>Cu²⁺ uchun <strong className="text-blue-300">interferensiya kam</strong> — standart rejim yetarli</li>
                <li>Cu²⁺ <strong className="text-blue-300">Jahn-Teller effekti</strong> — ICP buni ko'rmaydi</li>
                <li>N, H, O <strong className="text-white">ICP da ko'rinmaydi</strong> — EA kerak</li>
                <li>Izotop profili: ⁶³Cu (69.2%), ⁶⁵Cu (30.8%)</li>
                <li>Cu:S = 1:1 nisbat — formulani tasdiqlash uchun muhim</li>
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

        {/* 2. Cu va S BIR VAQTDI */}
        <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-2 border-blue-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚖️</span> {COMPOUND.uniqueICPFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.uniqueICPFeature.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-950/40 rounded-xl p-5 border-2 border-blue-500/50">
              <h3 className="text-blue-400 font-bold text-sm mb-3">✓ Afzallik: {COMPOUND.uniqueICPFeature.problem.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-blue-400 font-bold">Xususiyat:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.problem.description}</div>
                </div>
                <div className="bg-blue-900/30 rounded p-2">
                  <div className="text-blue-300 font-bold">Ta'sir:</div>
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
                  <div className="text-green-300 font-bold">Polychromator:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ICP-OES PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> ICP-OES parametrlari (Cu va S uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-OES — atom emissiya spektroskopiya. Cu <strong className="text-blue-300">324.7 nm</strong> da, S <strong className="text-blue-300">180.7 nm</strong> da nurlanadi. ICP-OES da ikkalasini bir vaqtda o'lchash mumkin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-950/40 rounded-xl p-4 border border-blue-700/30">
              <h4 className="text-blue-400 font-bold text-sm mb-3">Cu (Mis) parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-blue-400 font-bold">{COMPOUND.icpOES.parameters.Cu.lambda_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (alternativ):</span>
                  <span className="font-mono text-blue-400">{COMPOUND.icpOES.parameters.Cu.lambda_secondary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.icpOES.parameters.Cu.lod} μg/L</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpOES.parameters.Cu.linearRange}</span>
                </div>
                <div className="bg-blue-900/30 rounded p-2 mt-2">
                  <span className="text-blue-300 text-[10px]">📝 {COMPOUND.icpOES.parameters.Cu.notes}</span>
                </div>
              </div>
            </div>

            <div className="bg-cyan-950/40 rounded-xl p-4 border border-cyan-700/30">
              <h4 className="text-cyan-400 font-bold text-sm mb-3">S (Oltingugurt) parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-cyan-400 font-bold">{COMPOUND.icpOES.parameters.S.lambda_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (alternativ):</span>
                  <span className="font-mono text-cyan-400">{COMPOUND.icpOES.parameters.S.lambda_secondary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-yellow-400">{COMPOUND.icpOES.parameters.S.lod} μg/L</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpOES.parameters.S.linearRange}</span>
                </div>
                <div className="bg-cyan-900/30 rounded p-2 mt-2">
                  <span className="text-cyan-300 text-[10px]">📝 {COMPOUND.icpOES.parameters.S.notes}</span>
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
            <span>🧬</span> ICP-MS parametrlari (Cu uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-MS — mass-spektrometriya. Cu uchun <strong className="text-blue-300">standart rejim</strong> yetarli (interferensiya kam). ⁶³Cu (69.2%) va ⁶⁵Cu (30.8%) izotoplari ko'rinadi.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="bg-blue-950/40 rounded-xl p-4 border-2 border-blue-500/50">
              <h4 className="text-blue-400 font-bold text-sm mb-3">Cu (Mis) — Standart rejim:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">m/z (asosiy):</span>
                  <span className="font-mono text-blue-400 font-bold">{COMPOUND.icpMS.parameters.Cu.mz_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Asosiy izotop:</span>
                  <span className="font-mono text-blue-400">{COMPOUND.icpMS.parameters.Cu.isotope_primary}</span>
                </div>
                <div className="flex justify-between bg-green-900/30 rounded p-2">
                  <span className="text-green-400">LOD (standart):</span>
                  <span className="font-mono text-green-400 font-bold">{COMPOUND.icpMS.parameters.Cu.lod_standard} ng/L ✓</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpMS.parameters.Cu.linearRange}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Ichki standart:</span>
                  <span className="font-mono text-cyan-300">{COMPOUND.icpMS.parameters.Cu.internalStandard}</span>
                </div>
                <div className="bg-green-900/30 rounded p-2 mt-2">
                  <span className="text-green-300 text-[10px]">✓ {COMPOUND.icpMS.parameters.Cu.interference}</span>
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
            ICP <strong className="text-blue-300">Cu va S</strong> ni o'lchaydi (ICP-OES). N, H, O ICP da ko'rinmaydi — ularni EA bilan tekshirish kerak.
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
                <tr className="bg-blue-900/20 font-bold border-t border-blue-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-blue-300">ICP: Cu (25.86%) + S (13.05%) = 38.91%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. IZOTOP PROFILI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Cu izotop profili (ICP-MS)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            ICP-MS har bir izotopni <strong className="text-cyan-300">alohida detektlaydi</strong>. Bu AAS va ICP-OES da mumkin emas. Cu ning 2 ta tabiiy izotopi bor.
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

              {COMPOUND.isotopeProfile.Cu.isotopes.map((iso, i) => {
                const barWidth = 120
                const gap = 40
                const totalBars = COMPOUND.isotopeProfile.Cu.isotopes.length
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

          <div className="mt-3 p-3 bg-blue-900/20 rounded-lg border border-blue-700/30">
            <p className="text-xs text-purple-200">
              <strong className="text-blue-300">📝 {COMPOUND.isotopeProfile.Cu.note}</strong>
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
              <span>📈</span> Kalibrlash egri chizig'i (Cu va S, ICP-OES)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveMetal("Cu")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMetal === "Cu" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300"
                }`}
              >
                Cu (324.7 nm)
              </button>
              <button
                onClick={() => setActiveMetal("S")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMetal === "S" ? "bg-cyan-600 text-white" : "bg-purple-900/50 text-purple-300"
                }`}
              >
                S (180.7 nm)
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
            {activeMetal === "Cu" ? "Cu" : "S"} standartlari (2% HNO₃ + ichki standart Sc) yordamida kalibrlash egri chizig'i qurilgan. <strong className={activeMetal === "Cu" ? "text-blue-300" : "text-cyan-300"}>R² = 0.9999</strong> — deyarli mukammal chiziqli bog'liqliq.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - v*200} x2="580" y2={220 - v*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - v*200} textAnchor="end" fontSize="9" fill="#a78bfa">{(v * (activeMetal === "Cu" ? 100 : 250)).toFixed(0)}</text>
                </g>
              ))}

              {(activeMetal === "Cu" ? [0, 5, 10, 25, 50, 100] : [0, 10, 25, 50, 100, 250]).map((c, i) => (
                <g key={i}>
                  <text x={50 + (c/(activeMetal === "Cu" ? 100 : 250))*530} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="315" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">{activeMetal} konsentratsiyasi ({activeMetal === "Cu" ? "μg/L" : "mg/L"})</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik (counts)</text>

              <line x1="50" y1="220" x2="580" y2={220 - 200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {(activeMetal === "Cu" ? COMPOUND.calibrationCurve_Cu : COMPOUND.calibrationCurve_S).map((p, i) => {
                const x = 50 + (p.conc/(activeMetal === "Cu" ? 100 : 250))*530
                const y = 220 - (p.intensity/(activeMetal === "Cu" ? 501000 : 200000))*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill={activeMetal === "Cu" ? "#3b82f6" : "#06b6d4"} stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill={activeMetal === "Cu" ? "#93c5fd" : "#67e8f9"}>
                        {(p.intensity/1000).toFixed(0)}k
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (64.5/(activeMetal === "Cu" ? 100 : 250))*530
                const y = 220 - (322500/(activeMetal === "Cu" ? 501000 : 200000))*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna ({activeMetal === "Cu" ? "64.5 μg/L" : "32.6 mg/L"})
                    </text>
                  </g>
                )
              })()}

              <rect x="450" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke={activeMetal === "Cu" ? "#3b82f6" : "#06b6d4"} strokeWidth="1" />
              <text x="510" y="48" textAnchor="middle" fontSize="10" fill={activeMetal === "Cu" ? "#93c5fd" : "#67e8f9"} fontWeight="bold">
                R² = 0.9999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className={`w-3 h-3 rounded-full ${activeMetal === "Cu" ? "bg-blue-500" : "bg-cyan-500"}`}></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya</span>
          </div>
        </div>

        {/* 9. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> ICP yugurishlari — Cu va S alohida
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Cu va S <strong className="text-blue-300">alohida</strong> o'lchanadi (ICP-OES da bir vaqtda). Cu uchun ICP-MS ham ishlatiladi (ppt darajasi).
          </p>

          {/* Cu natijalari */}
          <div className="mb-8">
            <h3 className="text-md font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span>🔵</span> Cu tahlili (ICP-OES va ICP-MS)
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {COMPOUND.experimentalRuns_Cu.map(r => {
                const isMS = r.mode.includes("ICP-MS")
                const isActive = activeRun_Cu === r.id
                const btnClass = isActive
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : isMS
                    ? "bg-cyan-900/30 border-cyan-700/30 text-cyan-300 hover:border-cyan-500"
                    : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                return (
                  <button 
                    key={r.id}
                    onClick={() => setActiveRun_Cu(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${btnClass}`}
                  >
                    {r.id.split('-').pop()} {isMS && "MS"}
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-purple-950/60 rounded-xl p-5 border border-purple-700/30">
                  <div className="text-xs text-purple-500 uppercase tracking-wider mb-1">O'lchash ID</div>
                  <div className="text-xl font-bold text-white font-mono">{run_Cu.id}</div>
                  <div className="text-xs text-purple-400 mt-1">{run_Cu.date}</div>
                  <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
                    📝 {run_Cu.note}
                  </div>
                  
                  <div className="my-4 border-t border-purple-800/50"></div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Rejim:</span>
                      <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                        run_Cu.mode.includes("ICP-MS") ? "bg-cyan-900/30 text-cyan-300" : "bg-blue-900/30 text-blue-300"
                      }`}>{run_Cu.mode}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-blue-900/20 rounded border border-blue-500/20">
                      <span className="text-sm text-blue-400 font-medium">C (μg/L):</span>
                      <span className="font-mono text-white text-lg">{run_Cu.conc_mgL.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                      <span className="text-sm text-green-400 font-medium">Eksperimental %Cu:</span>
                      <span className="font-mono text-white text-lg">{run_Cu.percent.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Nazariy %Cu:</span>
                      <span className="font-mono text-blue-400">{COMPOUND.theoretical.Cu.percent.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                      <span className="text-sm text-purple-300">Δ (Farq):</span>
                      <span className={`font-mono font-bold ${statusColor_Cu}`}>{deltaCu.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
                <h3 className="text-sm font-bold text-blue-400 mb-4 flex justify-between">
                  <span>%Cu Qiymatlari (ICP-OES vs ICP-MS)</span>
                  <span className="text-[10px] text-purple-500 font-normal">Nazariy: 25.86%</span>
                </h3>
                
                <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                  {COMPOUND.experimentalRuns_Cu.map((r) => {
                    const val = r.percent
                    const heightPct = Math.min((val / 30) * 100, 100)
                    const isActive = r.id === activeRun_Cu
                    const isMS = r.mode.includes("ICP-MS")
                    const barClass = isActive
                      ? isMS ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                      : isMS ? 'bg-cyan-700/40'
                      : 'bg-purple-700/40'
                    
                    return (
                      <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun_Cu(r.id)}>
                        <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                          {val.toFixed(1)}%
                        </div>
                        
                        <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                          <div className="absolute w-[120%] border-t border-dashed border-blue-400/50 z-0" style={{ bottom: `${(25.858/30)*100}%` }}></div>

                          <div 
                            className={`w-full rounded-t transition-all duration-500 z-10 ${barClass}`}
                            style={{ height: `${heightPct}%` }}
                          ></div>
                        </div>
                        
                        <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isMS ? 'text-cyan-400' : 'text-blue-400') : 'text-purple-600'} font-bold`}>
                          {r.id.split('-').pop()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* S natijalari */}
          <div>
            <h3 className="text-md font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <span>🟦</span> S tahlili (ICP-OES, 180.7 nm)
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {COMPOUND.experimentalRuns_S.map(r => {
                const isActive = activeRun_S === r.id
                const btnClass = isActive
                  ? "bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                return (
                  <button 
                    key={r.id}
                    onClick={() => setActiveRun_S(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${btnClass}`}
                  >
                    {r.id.split('-').pop()}
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-purple-950/60 rounded-xl p-5 border border-purple-700/30">
                  <div className="text-xs text-purple-500 uppercase tracking-wider mb-1">O'lchash ID</div>
                  <div className="text-xl font-bold text-white font-mono">{run_S.id}</div>
                  <div className="text-xs text-purple-400 mt-1">{run_S.date}</div>
                  <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
                    📝 {run_S.note}
                  </div>
                  
                  <div className="my-4 border-t border-purple-800/50"></div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Rejim:</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-900/30 text-cyan-300">{run_S.mode}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-cyan-900/20 rounded border border-cyan-500/20">
                      <span className="text-sm text-cyan-400 font-medium">C (mg/L):</span>
                      <span className="font-mono text-white text-lg">{run_S.conc_mgL.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                      <span className="text-sm text-green-400 font-medium">Eksperimental %S:</span>
                      <span className="font-mono text-white text-lg">{run_S.percent.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Nazariy %S:</span>
                      <span className="font-mono text-cyan-400">{COMPOUND.theoretical.S.percent.toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                      <span className="text-sm text-purple-300">Δ (Farq):</span>
                      <span className={`font-mono font-bold ${statusColor_S}`}>{deltaS.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
                <h3 className="text-sm font-bold text-cyan-400 mb-4 flex justify-between">
                  <span>%S Qiymatlari (ICP-OES)</span>
                  <span className="text-[10px] text-purple-500 font-normal">Nazariy: 13.05%</span>
                </h3>
                
                <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                  {COMPOUND.experimentalRuns_S.map((r) => {
                    const val = r.percent
                    const heightPct = Math.min((val / 15) * 100, 100)
                    const isActive = r.id === activeRun_S
                    const barClass = isActive ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-purple-700/40'
                    
                    return (
                      <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun_S(r.id)}>
                        <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                          {val.toFixed(2)}%
                        </div>
                        
                        <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                          <div className="absolute w-[120%] border-t border-dashed border-cyan-400/50 z-0" style={{ bottom: `${(13.048/15)*100}%` }}></div>

                          <div 
                            className={`w-full rounded-t transition-all duration-500 z-10 ${barClass}`}
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
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <span>📊</span> Kalibrlash egri chizig'i — to'liq ma'lumotlar
              </h3>
              
              <h4 className="text-blue-400 font-bold text-sm mb-2">Cu (ICP-OES, 324.7 nm):</h4>
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
                    {COMPOUND.calibrationCurve_Cu.map((p, i) => (
                      <tr key={i} className="border-b border-purple-800/30">
                        <td className="py-2 px-3 text-blue-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.intensity.toLocaleString()}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="text-cyan-400 font-bold text-sm mb-2">S (ICP-OES, 180.7 nm):</h4>
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
                    {COMPOUND.calibrationCurve_S.map((p, i) => (
                      <tr key={i} className="border-b border-purple-800/30">
                        <td className="py-2 px-3 text-cyan-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.intensity.toLocaleString()}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-700/30 text-xs text-purple-200">
                <strong className="text-blue-300">Cu regressiyasi:</strong> I = 5010 × C + 0, R² = 0.9999
              </div>
              <div className="mt-3 p-3 bg-cyan-900/20 rounded-lg border border-cyan-700/30 text-xs text-purple-200">
                <strong className="text-cyan-300">S regressiyasi:</strong> I = 800 × C + 0, R² = 0.9999
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
              <div key={i} className="bg-blue-950/40 rounded-xl p-4 border border-blue-700/30">
                <h4 className="text-blue-400 font-bold text-sm mb-2">{m.problem}</h4>
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
            [Cu(NH₃)₄]SO₄·H₂O uchun <strong className="text-blue-300">2% HNO₃</strong> ishlatiladi. Ichki standart (Sc) har bir namunaga qo'shiladi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => {
                const isActive = activePrepStep === s.step
                const btnClass = isActive
                  ? "bg-blue-900/40 border-blue-500"
                  : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                return (
                  <button
                    key={s.step}
                    onClick={() => setActivePrepStep(s.step)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${btnClass}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? "bg-blue-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-blue-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> ICP dan %Cu va %S hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Ikkala element uchun alohida konsentratsiya kiriting — <strong className="text-blue-300">%Cu</strong> va <strong className="text-cyan-300">%S</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Cu konsentratsiyasi (μg/L):</label>
              <input 
                type="number" step="0.1" value={customConc_Cu}
                onChange={(e) => setCustomConc_Cu(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">S konsentratsiyasi (mg/L):</label>
              <input 
                type="number" step="0.1" value={customConc_S}
                onChange={(e) => setCustomConc_S(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-purple-400">Cu massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-blue-400">{calcResult_Cu.Cu_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Cu:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult_Cu.Cu_percent - 25.86) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult_Cu.Cu_percent}%
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">S massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{calcResult_S.S_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%S:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult_S.S_percent - 13.05) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult_S.S_percent}%
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-900/20 rounded border border-green-700/30">
              <div className="text-xs text-green-300">
                <strong>Cu:S nisbati:</strong> {(calcResult_Cu.Cu_percent / calcResult_S.S_percent).toFixed(2)} (nazariy: 1.98)
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Cu = (C(μg/L) × V(mL) × DF) / (m(mg) × 1000) × 100; %S = (C(mg/L) × V(mL) × DF) / (m(mg)) × 100
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
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> ICP ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Cu(NH₃)₄]SO₄·H₂O uchun ICP ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-blue-300">to'liq formula validatsiyasi</strong> uchun muhim. <strong className="text-amber-300">EA</strong> va <strong className="text-purple-300">EPR</strong> eng kuchli qo'shimcha metodlar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-blue-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-blue-300">{m.name}</h3>
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

          <div className="mt-5 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-blue-300 mb-2">💡 To'liq formula validatsiyasi uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">ICP-OES (Cu, S) + EA (N, H) + EPR (Cu²⁺) + UV-Vis (620 nm) + Ion xromatografiya (SO₄²⁻)</strong> — beshta metod birgalikda [Cu(NH₃)₄]SO₄·H₂O ni to'liq tasdiqlaydi va uning sofligini nazorat qiladi.
            </p>
          </div>
        </div>

        {/* 15. ICP CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> ICP ning [Cu(NH₃)₄]SO₄·H₂O uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                ICP [Cu(NH₃)₄]SO₄·H₂O ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Cu²⁺ va Cu⁺ ni farqlay olmaydi</strong> — EPR kerak</li>
                <li><strong className="text-red-300">Jahn-Teller effektini ko'rmaydi</strong> — UV-Vis kerak</li>
                <li><strong className="text-red-300">Faqat Cu va S ni o'lchaydi</strong> — N, H, O uchun EA kerak</li>
                <li><strong className="text-red-300">Yuqori tuz matritsasi</strong> — suyuqlantirish va ichki standart</li>
                <li><strong className="text-red-300">Qimmat instrument</strong> — AAS dan 10-20× qimmat</li>
                <li><strong className="text-red-300">Murakkab ishlatish</strong> — malakali operator kerak</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>[Cu(NH₃)₄]SO₄·H₂O ni to'liq tasdiqlash</strong> uchun kamida 5 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-blue-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. ICP-OES (Cu, S)</span>
                  <span className="text-blue-400 font-mono">25.86%, 13.05%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (N, H)</span>
                  <span className="text-blue-400 font-mono">22.80%, 5.74%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. EPR (Cu²⁺)</span>
                  <span className="text-blue-400 font-mono">g_∥ ≈ 2.25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. UV-Vis (d-d)</span>
                  <span className="text-blue-400 font-mono">620 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. IC (SO₄²⁻)</span>
                  <span className="text-blue-400 font-mono">13.05%</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 5 ta metod birgalikda [Cu(NH₃)₄]SO₄·H₂O ni to'liq tasdiqlaydi
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
              <p className="text-xs text-purple-200"><strong className="text-blue-300">Cu va S ni bir vaqtda</strong> o'lchaydi (ICP-OES). ppb darajasida sezgirlik. Cu:S nisbatini tekshirish mumkin.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-blue-300">Cu²⁺/Cu⁺ farqlanmaydi!</strong> Jahn-Teller effekti ko'rinmaydi. N, H, O ko'rinmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EA (N, H), EPR (Cu²⁺), UV-Vis (620 nm), IC (SO₄²⁻) — to'liq formula validatsiyasi uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/icp" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← ICP metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/icp/birikmalar" className="text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Cu(NH₃)₄]SO₄·H₂O • ICP moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, NIST Isotope Data, Schweizer (1857)</p>
        </div>
      </footer>
    </main>
  )
}