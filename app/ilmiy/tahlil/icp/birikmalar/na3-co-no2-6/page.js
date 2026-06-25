"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// Pt(NH₃)₂Cl₂ — ICP-OES / ICP-MS MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, NIST Isotope Data
// Xususiyat: Sisplatin/Transplatin izomerler, yuqori massa Pt, ArCl⁺ interferensiyasi
// O'ziga xoslik: Cis/trans farqlash ICP da mumkin EMAS — XRD kerak!
// Maqsad: Faqat ICP tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Pt: 195.084, Cl: 35.450, N: 14.007, H: 1.008
}

const COMPOUND = {
  formulaHTML: "Pt(NH<sub>3</sub>)<sub>2</sub>Cl<sub>2</sub>",
  formulaPlain: "Pt(NH3)2Cl2",
  iupac: "Diammindixloroplatina(II)",
  formulaExpanded: "PtN₂H₆Cl₂",
  commonName: "Sisplatin (cis) / Transplatin (trans)",
  molarMass: 300.045,
  casNumber: "15663-27-1 (cis), 14913-33-8 (trans)",
  color: "cis: to'q sariq kristallar; trans: och sariq kristallar",
  stability: "cis: biologik faol (kanser dori), trans: biologik faol emas",
  
  historicalFact: {
    title: "Sisplatin — tasodifiy kashfiyotdan kanser dorisiga",
    text: "Pt(NH₃)₂Cl₂ ning tarixiy ahamiyati juda katta. 1965-yilda Barnett Rosenberg (Michigan universiteti) E. coli bakteriyalarini elektr maydonida o'stirayotganda, platina elektrodlaridan hosil bo'lgan Pt(NH₃)₂Cl₂ bakteriyalarning bo'linishini to'xtatganini kuzatdi. 1978-yilda FDA tomonidan tasdiqlangan sisplatin (cis izomer) bugungi kunda dunyodagi eng ko'p ishlatiladigan kanser dorisidir. Qiziq fakt: <strong>cis izomer</strong> (ikki Cl⁻ bir tomonda) biologik faol, <strong>trans izomer</strong> (ikki Cl⁻ qarama-qarshi) faol emas! ICP tahlilida bu birikma muhim muammo: ICP <strong>cis va trans izomerlarni farqlay OLMAYDI</strong> — ikkalasi ham bir xil Pt signalini beradi. Strukturani aniqlash uchun <strong>XRD</strong> yoki <strong>¹⁹⁵Pt YaMR</strong> kerak!",
    year: "1965-1978"
  },

  uniqueICPFeature: {
    title: "Pt(NH₃)₂Cl₂ — ICP cis/trans izomerlarni farqlay OLMAYDI!",
    description: "Bu birikma ICP ning eng muhim cheklovini ko'rsatadi — cis va trans geometrik izomerlarni farqlay olmaydi. ICP faqat umumiy Pt miqdorini o'lchaydi.",
    problem: {
      title: "Cis/Trans izomerlar farqlanmaydi",
      description: "ICP faqat elementlar miqdorini o'lchaydi — strukturani ko'rmaydi. cis-Pt(NH₃)₂Cl₂ (kanser dori) va trans-Pt(NH₃)₂Cl₂ (faol emas) ikkalasi ham bir xil Pt signalini beradi!",
      impact: "Kanser dori sifatini ICP bilan tekshirib bo'lmaydi — XRD yoki YaMR kerak"
    },
    solution: {
      title: "XRD va ¹⁹⁵Pt YaMR",
      description: "XRD (X-ray diffraction) kristall strukturani ko'rsatadi — cis va trans farqlanadi. ¹⁹⁵Pt YaMR (I=1/2) ham farqlaydi — cis: δ = -2100 ppm, trans: δ = -1600 ppm.",
      mechanism: "XRD: cis-PtCl₂Cl₂ — Cl-Pt-Cl burchagi 90°, trans — 180°. ICP buni ko'rmaydi, faqat umumiy Pt miqdorini o'lchaydi."
    }
  },

  icpOES: {
    instrument: "ICP-OES (Inductively Coupled Plasma Optical Emission Spectroscopy)",
    plasma: "Argon plazma, 6000-10000 K",
    nebulizer: "Pnevmatik nebulayzer (Meinhard tip)",
    parameters: {
      Pt: {
        lambda_primary: "214.423 nm",
        lambda_secondary: "265.945 nm",
        lod: 2.0,
        linearRange: "2.0 - 500 mg/L",
        notes: "214.4 nm eng sezgir. Pt inertligi tufayli plazmada to'liq atomlanadi."
      }
    }
  },

  icpMS: {
    instrument: "ICP-MS (Inductively Coupled Plasma Mass Spectrometry)",
    plasma: "Argon plazma, 6000-10000 K",
    massAnalyzer: "Kvadrupol mass analizator",
    collisionCell: "Standart rejim — Pt uchun ArCl⁺ kam ta'sir qiladi",
    parameters: {
      Pt: {
        mz_primary: 195,
        isotope_primary: "¹⁹⁵Pt (33.8%)",
        isotopes: [
          { isotope: "¹⁹⁴Pt", mz: 194, abundance: 0.01 },
          { isotope: "¹⁹⁵Pt", mz: 195, abundance: 33.78 },
          { isotope: "¹⁹⁶Pt", mz: 196, abundance: 33.78 },
          { isotope: "¹⁹⁸Pt", mz: 198, abundance: 25.24 }
        ],
        lod_standard: 0.5,
        lod_collision: 0.5,
        linearRange: "0.5 - 100 μg/L",
        interference: "ArCl⁺ (m/z=36-38) — Pt ga ta'sir kam",
        internalStandard: "Ir (m/z=193) — Pt ga yaqin massa"
      }
    }
  },

  theoretical: {
    Pt:  { mass: 195.084, percent: 65.018, source: "Markaziy Pt²⁺ atomi", icpSignal: "ICP-OES 214.4 nm / ICP-MS m/z=195" },
    Cl:  { mass: 70.900,  percent: 23.627, source: "2×Cl⁻ (ligand)", icpSignal: "ICP da ko'rinmaydi (IC kerak)" },
    N:   { mass: 28.014,  percent: 9.336,  source: "2×NH₃ (2×N)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" },
    H:   { mass: 6.048,   percent: 2.016,  source: "2×NH₃ (6×H)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" }
  },

  isotopeProfile: {
    Pt: {
      title: "Platina izotoplari — ICP-MS da ko'rinadigan profil",
      isotopes: [
        { isotope: "¹⁹⁴Pt", mz: 194, abundance: 0.01, color: "#22c55e" },
        { isotope: "¹⁹⁵Pt", mz: 195, abundance: 33.78, color: "#3b82f6" },
        { isotope: "¹⁹⁶Pt", mz: 196, abundance: 33.78, color: "#f59e0b" },
        { isotope: "¹⁹⁸Pt", mz: 198, abundance: 25.24, color: "#ef4444" }
      ],
      note: "¹⁹⁵Pt (33.8%) va ¹⁹⁶Pt (33.8%) — asosiy izotoplar. ArCl⁺ interferensiyasi kam (m/z=36-38, Pt dan uzoq)."
    }
  },

  internalStandards: {
    title: "Ichki standartlar — instrumental drift va matritsa effektlarini tuzatish",
    description: "Har bir namuna va standartga qo'shiladigan elementlar. Signal nisbati (Analyte/IS) orqali aniq natija olinadi.",
    standards: [
      {
        element: "Ir (Iridiy)",
        mz: 193,
        concentration: "10 μg/L",
        purpose: "Pt uchun ideal ichki standart",
        reason: "Ir massasi (193) Pt (195) ga juda yaqin — matritsa effektlarini eng yaxshi tuzatadi",
        interference: "Interferensiyasiz (mononuklid ¹⁹³Ir 100%)"
      },
      {
        element: "Re (Reniy)",
        mz: 187,
        concentration: "10 μg/L",
        purpose: "Alternativ ichki standart",
        reason: "Re massasi (187) Pt (195) ga yaqin, matritsa effektlarini yaxshi tuzatadi",
        interference: "Kam interferensiya"
      },
      {
        element: "Rh (Rodiy)",
        mz: 103,
        concentration: "10 μg/L",
        purpose: "O'rta massa elementlar uchun",
        reason: "Pt dan uzoq massa, lekin ba'zi matritsalarda yaxshi ishlaydi",
        interference: "Mononuklid ¹⁰³Rh (100%)"
      }
    ]
  },

  calibrationCurve: [
    { conc: 0.0, intensity: 0, note: "Blank (2% HNO₃ + 10 μg/L Ir)" },
    { conc: 5.0, intensity: 24000, note: "Standart 1" },
    { conc: 10.0, intensity: 48100, note: "Standart 2" },
    { conc: 25.0, intensity: 120250, note: "Standart 3" },
    { conc: 50.0, intensity: 240500, note: "Standart 4" },
    { conc: 100.0, intensity: 481000, note: "Standart 5" }
  ],

  experimentalRuns: [
    { id: "ICP-24-901", date: "2025-11-10", mode: "ICP-MS (Pt)", conc_mgL: 162.5, intensity: 390000, percent: 65.00, rsd: 0.8, note: "To'g'ri natija — cis-Pt(NH₃)₂Cl₂" },
    { id: "ICP-24-902", date: "2025-11-10", mode: "ICP-MS (Pt)", conc_mgL: 162.8, intensity: 390700, percent: 65.12, rsd: 0.7, note: "Ikkinchi parallel" },
    { id: "ICP-24-903", date: "2025-11-10", mode: "ICP-MS (Pt)", conc_mgL: 162.3, intensity: 389500, percent: 64.92, rsd: 0.9, note: "Uchinchi parallel" },
    { id: "ICP-24-904", date: "2025-11-10", mode: "ICP-OES (Pt)", conc_mgL: 162.6, intensity: 390300, percent: 65.04, rsd: 1.2, note: "ICP-OES (214.4 nm)" },
    { id: "ICP-24-905", date: "2025-11-11", mode: "ICP-MS (Pt)", conc_mgL: 162.5, intensity: 390000, percent: 65.00, rsd: 0.8, note: "trans-Pt(NH₃)₂Cl₂ (transplatin)" },
    { id: "ICP-24-906", date: "2025-11-11", mode: "ICP-MS (Pt)", conc_mgL: 162.5, intensity: 390000, percent: 65.00, rsd: 0.8, note: "⚠ ICP cis/trans farqlamaydi!" },
    { id: "BLANK-10",   date: "2025-11-10", mode: "ICP-MS", conc_mgL: 0.1, intensity: 240, percent: 0.04, rsd: 0.0, note: "Blank (2% HNO₃)" },
    { id: "STD-Pt-50",  date: "2025-11-10", mode: "ICP-MS", conc_mgL: 50.0, intensity: 240000, percent: 0.00, rsd: 0.5, note: "NIST Pt standarti (50 μg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 50.0 ± 0.1 mg Pt(NH₃)₂Cl₂ tortiladi. To'q sariq (cis) yoki och sariq (trans) kristallar.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 10 mL 2% HNO₃ qo'shiladi. Kislota kompleksni to'liq eritadi va metallarni ion holatida saqlaydi.", time: "10 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "2% HNO₃ bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~500 mg/L ≈ 325 mg/L Pt.", time: "1 daq", critical: false },
    { step: 4, title: "Ichki standart qo'shish", desc: "1 mL namunaga 10 μL Ir eritmasi (1000 μg/L) qo'shiladi. Natija: 10 μg/L Ir — har bir namuna va standartda bir xil.", time: "2 daq", critical: true },
    { step: 5, title: "Suyultirish", desc: "Agar konsentratsiya ICP diapazonidan yuqori bo'lsa, 10× yoki 100× suyuqlantiriladi.", time: "3 daq", critical: false },
    { step: 6, title: "ICP-MS da o'lchash", desc: "Pt: m/z=195 (standart rejim). ArCl⁺ kam ta'sir qiladi.", time: "3-5 daq/namuna", critical: true },
    { step: 7, title: "ICP-OES da o'lchash (alternativa)", desc: "Pt: 214.4 nm yoki 265.9 nm. Ichki standart nisbati (Pt/Ir) orqali aniq natija.", time: "2-3 daq/namuna", critical: false },
    { step: 8, title: "Natijalarni hisoblash", desc: "%Pt hisoblanadi. Nazariy: 65.02%. EHTIYOT: ICP cis/trans farqlamaydi!", time: "1 daq", critical: false }
  ],

  matrixEffects: {
    title: "Matritsa effekti — yuqori Pt konsentratsiyasi muammosi",
    description: "Pt(NH₃)₂Cl₂ yuqori Pt konsentratsiyasiga ega (65.0% Pt). Bu ICP uchun matritsa effekti yaratadi.",
    problems: [
      {
        problem: "Konus tiqilib qolishi",
        description: "Yuqori Pt konsentratsiyasi sampler va skimmer konuslarida cho'kma hosil qiladi — signal vaqt o'tishi bilan kamayadi (drift).",
        solution: "Namunani 10× yoki 100× suyuqlantirish. Ichki standart qo'shish (drift tuzatish)."
      },
      {
        problem: "ArCl⁺ interferensiyasi",
        description: "ArCl⁺ poliatomik ionlar (m/z=36-38) Pt ga (m/z=195) kam ta'sir qiladi — lekin ba'zi hollarda muammo bo'lishi mumkin.",
        solution: "Standart rejim yetarli. Agar kerak bo'lsa, He KED rejimi."
      },
      {
        problem: "Pt²⁺ inertligi",
        description: "Pt²⁺ inert kompleks — ligand almashinishi juda sekin. ICP plazmasida to'liq atomlanadi (bu muammo emas).",
        solution: "Hech narsa kerak emas — ICP plazmasi (10000 K) barcha bog'larni uzadi."
      }
    ]
  },

  aasComparison: {
    title: "ICP vs AAS — Pt(NH₃)₂Cl₂ uchun",
    comparison: [
      { feature: "Metallar soni", ICP: "1 (Pt)", AAS: "1 (Pt)" },
      { feature: "LOD (Pt)", ICP: "0.5 ng/L (ICP-MS)", AAS: "50 ng/L (GFAAS)" },
      { feature: "Izotop ma'lumoti", ICP: "Ha (¹⁹⁴Pt, ¹⁹⁵Pt, ¹⁹⁶Pt, ¹⁹⁸Pt)", AAS: "Yo'q" },
      { feature: "Interferensiya", ICP: "ArCl⁺ kam ta'sir", AAS: "Kam" },
      { feature: "Vaqt (bir namuna)", ICP: "~5 daqiqa", AAS: "~10 daqiqa" },
      { feature: "Narxi", ICP: "$$$ (qimmat)", AAS: "$ (arzon)" }
    ]
  },

  relatedMethods: [
    {
      name: "XRD (X-ray diffraction)",
      role: "Cis/trans izomerlarni farqlaydi — kristall strukturani ko'rsatadi",
      icpAdvantage: "XRD strukturani ko'rsatadi (ICP farqlay olmaydi!)",
      icpDisadvantage: "ICP miqdoriy, XRD sifat",
      complementarity: "98%"
    },
    {
      name: "¹⁹⁵Pt YaMR",
      role: "Cis/trans farqlash: cis δ = -2100 ppm, trans δ = -1600 ppm",
      icpAdvantage: "YaMR izomerlarni farqlaydi (ICP farqlay olmaydi!)",
      icpDisadvantage: "ICP miqdoriy, YaMR sifat",
      complementarity: "97%"
    },
    {
      name: "EA (Element Analiz)",
      role: "N (9.34%), H (2.02%) — organik qismni tasdiqlaydi",
      icpAdvantage: "ICP metallarni, EA organik qismni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq formula validatsiyasi",
      complementarity: "96%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Cis/trans farqlash: cis λ_max = 301 nm, trans λ_max = 360 nm",
      icpAdvantage: "UV-Vis izomerlarni farqlaydi (ICP farqlay olmaydi!)",
      icpDisadvantage: "ICP miqdoriy, UV-Vis sifat",
      complementarity: "95%"
    }
  ]
}

function calculatePtPercent(conc_mgL, sampleMass, dilutionFactor) {
  const totalVolume = 100
  const Pt_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Pt_percent = (Pt_mass_mg / sampleMass) * 100
  return {
    Pt_mass: parseFloat(Pt_mass_mg.toFixed(3)),
    Pt_percent: parseFloat(Pt_percent.toFixed(2))
  }
}

function getStatusColor(delta) {
  if (delta <= 0.5) return "text-green-400"
  if (delta <= 1.5) return "text-yellow-400"
  return "text-red-400"
}

function getElColor(el) {
  if (el === "Pt") return "text-amber-400"
  return "text-purple-400"
}

function getRowClass(el) {
  if (el === "Pt") return ""
  return "opacity-50"
}

export default function PtNH32Cl2Page() {
  const [activeRun, setActiveRun] = useState("ICP-24-901")
  const [customConc, setCustomConc] = useState(162.5)
  const [customMass, setCustomMass] = useState(50.0)
  const [dilutionFactor, setDilutionFactor] = useState(1)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const deltaPt = Math.abs(run.percent - COMPOUND.theoretical.Pt.percent)
  const statusColor = getStatusColor(deltaPt)

  const calcResult = useMemo(() => 
    calculatePtPercent(customConc, customMass, dilutionFactor),
    [customConc, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-amber-950/20 to-blue-950 text-white">
      
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
            <span className="text-amber-400 font-semibold">Pt(NH₃)₂Cl₂</span>
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
                <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Pt²⁺ d⁸</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Kanser Dori</span>
                <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Cis/Trans</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Yuqori massa</span>
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
                <strong className="text-white">Pt(NH₃)₂Cl₂</strong> — platina(II) ning diammin kompleksi, dunyodagi eng muhim kanser dorisi (sisplatin). ICP tahlilida <strong className="text-amber-300">muhim namuna</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-amber-500 text-xs md:text-sm">
                <li><strong className="text-white">Pt yuqori massa</strong> (195.08) — yuqori massa izotoplar</li>
                <li><strong className="text-red-300">ICP cis/trans farqlay OLMAYDI</strong> — XRD kerak!</li>
                <li>C, H, N, Cl <strong className="text-white">ICP da ko'rinmaydi</strong> — EA/IC kerak</li>
                <li>Pt²⁺ <strong className="text-amber-300">inert</strong> — plazmada to'liq atomlanadi</li>
                <li>ArCl⁺ interferensiyasi <strong className="text-green-300">kam ta'sir</strong> qiladi</li>
                <li>LOD: ICP-MS da <strong className="text-green-300">0.5 ng/L</strong></li>
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

        {/* 2. CIS/TRANS IZOMER */}
        <div className="bg-gradient-to-r from-amber-900/40 to-red-900/40 border-2 border-amber-700/70 rounded-2xl p-6">
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
                  <div className="text-green-300 font-bold">XRD / YaMR:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ICP-OES PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> ICP-OES parametrlari (Pt uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-OES — atom emissiya spektroskopiya. Pt <strong className="text-amber-300">214.4 nm</strong> yoki <strong className="text-amber-300">265.9 nm</strong> da nurlanadi. Pt inertligi tufayli plazmada to'liq atomlanadi.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="bg-amber-950/40 rounded-xl p-4 border border-amber-700/30">
              <h4 className="text-amber-400 font-bold text-sm mb-3">Pt (Platina) parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-amber-400 font-bold">{COMPOUND.icpOES.parameters.Pt.lambda_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (alternativ):</span>
                  <span className="font-mono text-amber-400">{COMPOUND.icpOES.parameters.Pt.lambda_secondary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.icpOES.parameters.Pt.lod} μg/L</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpOES.parameters.Pt.linearRange}</span>
                </div>
                <div className="bg-amber-900/30 rounded p-2 mt-2">
                  <span className="text-amber-300 text-[10px]">📝 {COMPOUND.icpOES.parameters.Pt.notes}</span>
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
            <span>🧬</span> ICP-MS parametrlari (Pt uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-MS — mass-spektrometriya. Pt ning bir nechta izotopi bor, lekin <strong className="text-amber-300">¹⁹⁵Pt (33.8%)</strong> va <strong className="text-amber-300">¹⁹⁶Pt (33.8%)</strong> asosiy. ArCl⁺ interferensiyasi kam ta'sir qiladi.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="bg-amber-950/40 rounded-xl p-4 border-2 border-amber-500/50">
              <h4 className="text-amber-400 font-bold text-sm mb-3">Pt (Platina) — Standart rejim:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">m/z (asosiy):</span>
                  <span className="font-mono text-amber-400 font-bold">{COMPOUND.icpMS.parameters.Pt.mz_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Asosiy izotop:</span>
                  <span className="font-mono text-amber-400">{COMPOUND.icpMS.parameters.Pt.isotope_primary}</span>
                </div>
                <div className="flex justify-between bg-green-900/30 rounded p-2">
                  <span className="text-green-400">LOD (standart):</span>
                  <span className="font-mono text-green-400 font-bold">{COMPOUND.icpMS.parameters.Pt.lod_standard} ng/L ✓</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpMS.parameters.Pt.linearRange}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Ichki standart:</span>
                  <span className="font-mono text-cyan-300">{COMPOUND.icpMS.parameters.Pt.internalStandard}</span>
                </div>
                <div className="bg-green-900/30 rounded p-2 mt-2">
                  <span className="text-green-300 text-[10px]">✓ {COMPOUND.icpMS.parameters.Pt.interference}</span>
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
            ICP <strong className="text-amber-300">faqat Pt</strong> ni o'lchaydi (ICP-OES). Cl, N, H ICP da ko'rinmaydi — ularni EA/IC bilan tekshirish kerak.
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
                  <td colSpan={2} className="py-3 text-[10px] text-amber-300">ICP: Pt (65.02%) — faqat bitta metall</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. IZOTOP PROFILI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Pt izotop profili (ICP-MS)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            ICP-MS har bir izotopni <strong className="text-cyan-300">alohida detektlaydi</strong>. Pt ning 4 ta tabiiy izotopi bor. ¹⁹⁵Pt (33.8%) va ¹⁹⁶Pt (33.8%) asosiy, ArCl⁺ kam ta'sir qiladi.
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

              {COMPOUND.isotopeProfile.Pt.isotopes.map((iso, i) => {
                const barWidth = 120
                const gap = 20
                const totalBars = COMPOUND.isotopeProfile.Pt.isotopes.length
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

          <div className="mt-3 p-3 bg-amber-900/20 rounded-lg border border-amber-700/30">
            <p className="text-xs text-purple-200">
              <strong className="text-amber-300">📝 {COMPOUND.isotopeProfile.Pt.note}</strong>
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
              <span>📈</span> Kalibrlash egri chizig'i (Pt, ICP-MS)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Pt standartlari (2% HNO₃ + ichki standart Ir) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-amber-300">R² = 0.9999</strong> — deyarli mukammal chiziqli bog'liqliq.
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
              <text x="315" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Pt konsentratsiyasi (μg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik (counts)</text>

              <line x1="50" y1="220" x2="580" y2={220 - 200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/100)*530
                const y = 220 - (p.intensity/481000)*200
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
                const x = 50 + (162.5/100)*530
                const y = 220 - (390000/481000)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (162.5 μg/L)
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
            <span>🔬</span> ICP yugurishlari — Pt tahlili (cis/trans bir xil signal!)
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Pt <strong className="text-amber-300">standart rejim</strong> bilan o'lchanadi (ArCl⁺ kam ta'sir). EHTIYOT: ICP cis/trans farqlamaydi!
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns.map(r => {
              const isOES = r.mode.includes("ICP-OES")
              const isTrans = r.id === "ICP-24-905"
              const isSameSignal = r.id === "ICP-24-906"
              const isActive = activeRun === r.id
              let btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
              if (isActive) {
                if (isOES) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                else if (isTrans) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                else if (isSameSignal) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20"
                else btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/20"
              } else {
                if (isOES) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-cyan-900/30 border-cyan-700/30 text-cyan-300 hover:border-cyan-500"
                else if (isTrans) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-amber-900/30 border-amber-700/30 text-amber-300 hover:border-amber-500"
                else if (isSameSignal) btnClass = "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border bg-red-900/30 border-red-700/30 text-red-300 hover:border-red-500"
              }
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={btnClass}
                >
                  {r.id.split('-').pop()} {isOES && "OES"} {isTrans && "trans"} {isSameSignal && "⚠"}
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
                      run.mode.includes("ICP-OES") ? "bg-cyan-900/30 text-cyan-300" : "bg-amber-900/30 text-amber-300"
                    }`}>{run.mode}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-amber-900/20 rounded border border-amber-500/20">
                    <span className="text-sm text-amber-400 font-medium">C (μg/L):</span>
                    <span className="font-mono text-white text-lg">{run.conc_mgL.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Pt:</span>
                    <span className="font-mono text-white text-lg">{run.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Pt:</span>
                    <span className="font-mono text-amber-400">{COMPOUND.theoretical.Pt.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaPt.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-amber-400 mb-4 flex justify-between">
                <span>%Pt Qiymatlari (cis/trans bir xil!)</span>
                <span className="text-[10px] text-purple-500 font-normal">Nazariy: 65.02%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const val = r.percent
                  const heightPct = Math.min((val / 70) * 100, 100)
                  const isActive = r.id === activeRun
                  const isOES = r.mode.includes("ICP-OES")
                  const isTrans = r.id === "ICP-24-905"
                  const isSameSignal = r.id === "ICP-24-906"
                  let barClass = "w-full rounded-t transition-all duration-500 z-10 bg-purple-700/40"
                  if (isActive) {
                    if (isOES) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    else if (isTrans) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                    else if (isSameSignal) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    else barClass = "w-full rounded-t transition-all duration-500 z-10 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  } else {
                    if (isOES) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-700/40"
                    else if (isTrans) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-amber-700/40"
                    else if (isSameSignal) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-700/40"
                  }
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                        <div className="absolute w-[120%] border-t border-dashed border-amber-400/50 z-0" style={{ bottom: `${(65.018/70)*100}%` }}></div>

                        <div 
                          className={barClass}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isOES ? 'text-cyan-400' : isTrans ? 'text-amber-400' : isSameSignal ? 'text-red-400' : 'text-amber-400') : 'text-purple-600'} font-bold`}>
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
              
              <h4 className="text-amber-400 font-bold text-sm mb-2">Pt (ICP-MS, m/z=195):</h4>
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
                <strong className="text-amber-300">Pt regressiyasi:</strong> I = 4810 × C + 0, R² = 0.9999
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
            Pt(NH₃)₂Cl₂ uchun <strong className="text-amber-300">2% HNO₃</strong> ishlatiladi. EHTIYOT: ICP cis/trans farqlamaydi! Ichki standart (Ir) har bir namunaga qo'shiladi.
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
            <span>🧮</span> ICP dan %Pt hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Pt konsentratsiyasini kiriting — <strong className="text-amber-300">%Pt</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Pt konsentratsiyasi (μg/L):</label>
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
                <div className="text-xs text-purple-400">Pt massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-amber-400">{calcResult.Pt_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Pt:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult.Pt_percent - 65.02) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Pt_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Pt = (C(μg/L) × V(mL) × DF) / (m(mg) × 1000) × 100
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
            Pt(NH₃)₂Cl₂ uchun ICP ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-amber-300">cis/trans izomerlarni farqlash</strong> uchun muhim. <strong className="text-pink-300">XRD</strong> va <strong className="text-pink-300">¹⁹⁵Pt YaMR</strong> eng kuchli qo'shimcha metodlar.
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
              <strong className="text-white">ICP-MS (Pt) + XRD (cis/trans) + ¹⁹⁵Pt YaMR (δ = -2100/-1600 ppm) + EA (N, H) + UV-Vis (301/360 nm)</strong> — beshta metod birgalikda Pt(NH₃)₂Cl₂ ni to'liq tasdiqlaydi va cis/trans izomerlarni farqlaydi.
            </p>
          </div>
        </div>

        {/* 15. ICP CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> ICP ning Pt(NH₃)₂Cl₂ uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                ICP Pt(NH₃)₂Cl₂ ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Cis/trans izomerlarni farqlay olmaydi</strong> — XRD kerak</li>
                <li><strong className="text-red-300">Faqat Pt ni o'lchaydi</strong> — Cl, N, H uchun EA/IC kerak</li>
                <li><strong className="text-red-300">Yuqori Pt konsentratsiyasi</strong> — suyuqlantirish kerak</li>
                <li><strong className="text-red-300">ArCl⁺ kam ta'sir</strong> — lekin ba'zi hollarda muammo</li>
                <li><strong className="text-red-300">Qimmat instrument</strong> — AAS dan 10-20× qimmat</li>
                <li><strong className="text-red-300">Murakkab ishlatish</strong> — malakali operator kerak</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>Pt(NH₃)₂Cl₂ ni to'liq tasdiqlash</strong> uchun kamida 5 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-amber-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. ICP-MS (Pt)</span>
                  <span className="text-amber-400 font-mono">65.02%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. XRD (cis/trans)</span>
                  <span className="text-amber-400 font-mono">90° vs 180°</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. ¹⁹⁵Pt YaMR</span>
                  <span className="text-amber-400 font-mono">-2100/-1600 ppm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. EA (N, H)</span>
                  <span className="text-amber-400 font-mono">9.34%, 2.02%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. UV-Vis (d-d)</span>
                  <span className="text-amber-400 font-mono">301/360 nm</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 5 ta metod birgalikda Pt(NH₃)₂Cl₂ ni to'liq tasdiqlaydi va cis/trans farqlaydi
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
              <p className="text-xs text-purple-200"><strong className="text-amber-300">Pt ni</strong> ppb darajasida o'lchaydi. Yuqori massa izotoplar. Inert kompleks tufayli tayyorlash oson.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-amber-300">Cis/trans farqlanmaydi!</strong> XRD va YaMR kerak. Cl, N, H ko'rinmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">XRD (cis/trans), ¹⁹⁵Pt YaMR (-2100/-1600 ppm), EA (N, H), UV-Vis (301/360 nm) — kanser dori sifatini nazorat qilish.</p>
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
          <p>© 2026 Koordinatsion kimyo tahlil portali • Pt(NH₃)₂Cl₂ • ICP moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, NIST Isotope Data, Rosenberg (1965)</p>
        </div>
      </footer>
    </main>
  )
}