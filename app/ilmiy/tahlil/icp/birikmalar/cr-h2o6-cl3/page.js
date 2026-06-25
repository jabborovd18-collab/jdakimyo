"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Cr(H₂O)₆]Cl₃ — ICP-OES / ICP-MS MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, NIST Isotope Data
// Xususiyat: ArC⁺ interferensiyasi, Inert Cr³⁺ (d³)
// O'ziga xoslik: ArC⁺ (m/z=52) ⁵²Cr bilan interferensiya, H₂ rejimi yechim
// Maqsad: Faqat ICP tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Cr: 51.996, Cl: 35.450, H: 1.008, O: 15.999
}

const COMPOUND = {
  formulaHTML: "[Cr(H<sub>2</sub>O)<sub>6</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Cr(H2O)6]Cl3",
  iupac: "Geksaakvaxrom(III) xlorid",
  formulaExpanded: "CrH₁₂O₆Cl₃",
  commonName: "Xrom(III) xlorid geksagidrat (to'g'ri nom emas)",
  molarMass: 266.44,
  casNumber: "10060-12-5",
  color: "to'q binafsha-yashil kristallar",
  stability: "havoda barqaror, inert kompleks (Cr³⁺ d³), suvda yaxshi eriydi",
  
  historicalFact: {
    title: "Xrom(III) inertligi — Verner nazariyasining isboti",
    text: "[Cr(H₂O)₆]Cl₃ — xrom(III) ning eng oddiy akva kompleksi. Cr³⁺ ning d³ (t₂g³) elektron konfiguratsiyasi uni juda inert qiladi — ligand almashinishi soatlab vaqt oladi (Fe²⁺ da millisekundlar). Bu inertlik Verner nazariyasini isbotlashda muhim rol o'ynagan. 1893-yilda Alfred Werner [Cr(H₂O)₆]Cl₃ ni sintez qildi va uning xususiyatlarini o'rgandi. Qiziq fakt: bu kompleks suvda eriganida, 6 ta H₂O ligandi Cr³⁺ atrofida qoladi — ularni ajratish qiyin (ion almashinish juda sekin). ICP tahlilida bu birikma muhim misol: ⁴⁰Ar¹²C⁺ poliatomik interferensiyasi ⁵²Cr (83.8%) bilan bir xil m/z da — H₂ reaktiv rejimi yoki ⁵³Cr (9.5%) ishlatish kerak.",
    year: "1893-yil"
  },

  uniqueICPFeature: {
    title: "[Cr(H₂O)₆]Cl₃ — ArC⁺ interferensiyasining klassik namunasi",
    description: "Bu birikma ICP-MS tahlilida eng keng tarqalgan muammo — poliatomik interferensiyaning klassik namunasidir.",
    problem: {
      title: "⁴⁰Ar¹²C⁺ → m/z = 52",
      description: "Argon plazmasida Ar⁺ va C atomlari birlashib, ⁴⁰Ar¹²C⁺ poliatomik ionini hosil qiladi. Bu ionning mass/zaryad nisbati (m/z = 52) Cr ning eng ko'p tarqalgan izotopi ⁵²Cr (83.8% tabiiy) bilan bir xil!",
      impact: "Soxta signal — Cr miqdori haqiqatdan 2-5× yuqori ko'rinadi (agar organik matritsa bo'lsa)"
    },
    solution: {
      title: "H₂ Reaktiv rejimi",
      description: "Collision cell ichiga H₂ gazi kiritiladi. ArC⁺ ionlari H₂ bilan reaksiyaga kirishib, Ar + CHₓ ga aylanadi. Cr⁺ ionlari esa reaksiyaga kirmaydi va detektorga yetib boradi.",
      mechanism: "ArC⁺ + H₂ → Ar + CHₓ (reaktiv tozalash). Cr⁺ + H₂ → reaksiya yo'q. Natijada faqat Cr⁺ detektlanadi."
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
        notes: "267.7 nm eng sezgir, lekin matritsa effektlariga sezgir. Cr³⁺ inertligi tufayli plazmada to'liq atomlanadi."
      }
    }
  },

  icpMS: {
    instrument: "ICP-MS (Inductively Coupled Plasma Mass Spectrometry)",
    plasma: "Argon plazma, 6000-10000 K",
    massAnalyzer: "Kvadrupol mass analizator",
    collisionCell: "H₂ reaktiv rejimi — Cr uchun majburiy (agar organik matritsa bo'lsa)!",
    parameters: {
      Cr: {
        mz_primary: 52,
        isotope_primary: "⁵²Cr (83.789%)",
        isotopes: [
          { isotope: "⁵⁰Cr", mz: 50, abundance: 4.345 },
          { isotope: "⁵²Cr", mz: 52, abundance: 83.789 },
          { isotope: "⁵³Cr", mz: 53, abundance: 9.501 },
          { isotope: "⁵⁴Cr", mz: 54, abundance: 2.365 }
        ],
        lod_standard: 3.0,
        lod_H2: 0.3,
        linearRange: "0.3 - 100 μg/L",
        interference: "⁴⁰Ar¹²C⁺ (m/z=52) — H₂ rejimi shart (agar organik matritsa bo'lsa)!",
        internalStandard: "Sc (m/z=45) — Cr ga yaqin massa"
      }
    }
  },

  theoretical: {
    Cr:  { mass: 51.996,  percent: 19.516, source: "Markaziy Cr³⁺ atomi", icpSignal: "ICP-OES 267.7 nm / ICP-MS m/z=52" },
    Cl:  { mass: 106.350, percent: 39.915, source: "3×Cl⁻ (tashqi sfera)", icpSignal: "ICP da ko'rinmaydi (ion xromatografiya kerak)" },
    H:   { mass: 12.096,  percent: 4.540,  source: "6×H₂O (12×H)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" },
    O:   { mass: 95.994,  percent: 36.029, source: "6×H₂O (6×O)", icpSignal: "ICP da ko'rinmaydi (EA kerak)" }
  },

  isotopeProfile: {
    Cr: {
      title: "Xrom izotoplari — ICP-MS da ko'rinadigan profil",
      isotopes: [
        { isotope: "⁵⁰Cr", mz: 50, abundance: 4.345, color: "#22c55e" },
        { isotope: "⁵²Cr", mz: 52, abundance: 83.789, color: "#3b82f6" },
        { isotope: "⁵³Cr", mz: 53, abundance: 9.501, color: "#f59e0b" },
        { isotope: "⁵⁴Cr", mz: 54, abundance: 2.365, color: "#ef4444" }
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
        reason: "Ge massasi (72) Cr dan uzoq, lekin ba'zi matritsalarda yaxshi ishlaydi",
        interference: "Kam interferensiya"
      },
      {
        element: "Rh (Rodiy)",
        mz: 103,
        concentration: "10 μg/L",
        purpose: "Og'ir elementlar uchun (bu birikma uchun shart emas)",
        reason: "Og'ir metallar uchun. Cr uchun ishlatilmaydi.",
        interference: "Mononuklid ¹⁰³Rh (100%)"
      }
    ]
  },

  calibrationCurve: [
    { conc: 0.0, intensity: 0, note: "Blank (2% HNO₃ + 10 μg/L Sc)" },
    { conc: 5.0, intensity: 15000, note: "Standart 1" },
    { conc: 10.0, intensity: 30100, note: "Standart 2" },
    { conc: 25.0, intensity: 75250, note: "Standart 3" },
    { conc: 50.0, intensity: 150500, note: "Standart 4" },
    { conc: 100.0, intensity: 301000, note: "Standart 5" }
  ],

  experimentalRuns: [
    { id: "ICP-24-201", date: "2025-06-10", mode: "Standard (H₂ rejimi yo'q)", conc_mgL: 95.0, intensity: 285000, percent: 47.50, rsd: 7.5, note: "⚠ ArC⁺ interferensiyasi — Cr 2.4× ortiqcha (organik matritsa ta'siri)!" },
    { id: "ICP-24-202", date: "2025-06-10", mode: "H₂ reaktiv rejim", conc_mgL: 39.1, intensity: 117300, percent: 19.55, rsd: 1.2, note: "✓ To'g'ri natija — H₂ bilan ArC⁺ bartaraf etildi" },
    { id: "ICP-24-203", date: "2025-06-10", mode: "H₂ reaktiv rejim", conc_mgL: 38.9, intensity: 116700, percent: 19.45, rsd: 1.3, note: "Ikkinchi parallel (H₂)" },
    { id: "ICP-24-204", date: "2025-06-10", mode: "H₂ reaktiv rejim", conc_mgL: 39.2, intensity: 117600, percent: 19.60, rsd: 1.1, note: "Uchinchi parallel (H₂)" },
    { id: "ICP-24-205", date: "2025-06-10", mode: "H₂ reaktiv rejim", conc_mgL: 39.0, intensity: 117000, percent: 19.50, rsd: 1.4, note: "To'rtinchi parallel (H₂)" },
    { id: "ICP-24-206", date: "2025-06-11", mode: "⁵³Cr (m/z=53)", conc_mgL: 39.1, intensity: 11730, percent: 19.55, rsd: 1.5, note: "⁵³Cr ishlatildi (ArC⁺ muammosi yo'q, lekin sezgirlik past)" },
    { id: "BLANK-03",   date: "2025-06-10", mode: "H₂ rejim", conc_mgL: 0.1, intensity: 300, percent: 0.05, rsd: 0.0, note: "Blank (2% HNO₃)" },
    { id: "STD-Cr-50",  date: "2025-06-10", mode: "H₂ rejim", conc_mgL: 50.0, intensity: 150000, percent: 0.00, rsd: 0.8, note: "NIST Cr standarti (50 μg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 50.0 ± 0.1 mg [Cr(H₂O)₆]Cl₃ tortiladi. Binafsha-yashil kristallar — Cr³⁺ belgisi.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 10 mL 2% HNO₃ qo'shiladi. Kislota kompleksni to'liq eritadi va metallarni ion holatida saqlaydi.", time: "10 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "2% HNO₃ bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~500 mg/L ≈ 98 mg/L Cr.", time: "1 daq", critical: false },
    { step: 4, title: "Ichki standart qo'shish", desc: "1 mL namunaga 10 μL Sc eritmasi (1000 μg/L) qo'shiladi. Natija: 10 μg/L Sc — har bir namuna va standartda bir xil.", time: "2 daq", critical: true },
    { step: 5, title: "Suyultirish (agar kerak)", desc: "Agar konsentratsiya ICP diapazonidan yuqori bo'lsa, 10× yoki 100× suyuqlantiriladi.", time: "3 daq", critical: false },
    { step: 6, title: "ICP-OES da o'lchash", desc: "Cr: 267.7 nm. Ichki standart nisbati (Cr/Sc) orqali aniq natija.", time: "2-3 daq/namuna", critical: false },
    { step: 7, title: "ICP-MS da o'lchash (H₂ rejimi bilan)", desc: "Cr: m/z=52 (H₂ rejimi!) yoki m/z=53 (alternativ). H₂ gazi collision cell ga kiritiladi.", time: "3-5 daq/namuna", critical: true },
    { step: 8, title: "Natijalarni hisoblash", desc: "%Cr hisoblanadi. Ichki standart orqali drift tuzatiladi. Nazariy: 19.52%.", time: "1 daq", critical: false }
  ],

  matrixEffects: {
    title: "Matritsa effekti — yuqori tuz konsentratsiyasi muammosi",
    description: "[Cr(H₂O)₆]Cl₃ yuqori Cl konsentratsiyasiga ega (39.9% Cl, ~196 mg/L). Bu ICP uchun matritsa effekti yaratadi.",
    problems: [
      {
        problem: "Konus tiqilib qolishi",
        description: "Yuqori tuz konsentratsiyasi sampler va skimmer konuslarida cho'kma hosil qiladi — signal vaqt o'tishi bilan kamayadi (drift).",
        solution: "Namunani 10× yoki 100× suyuqlantirish. Ichki standart qo'shish (drift tuzatish)."
      },
      {
        problem: "Spektral fon (ICP-OES)",
        description: "Yuqori tuz matritsasi fon nurlanishini oshiradi — LOD yomonlashadi.",
        solution: "Background correction (fon tuzatish) va suyuqlantirish."
      },
      {
        problem: "Cr³⁺ inertligi",
        description: "Cr³⁺ inert kompleks — ligand almashinishi juda sekin. ICP plazmasida to'liq atomlanadi (bu muammo emas).",
        solution: "Hech narsa kerak emas — ICP plazmasi (10000 K) barcha bog'larni uzadi."
      }
    ]
  },

  aasComparison: {
    title: "ICP vs AAS — [Cr(H₂O)₆]Cl₃ uchun",
    comparison: [
      { feature: "Metallar soni", ICP: "1 (Cr)", AAS: "1 (Cr)" },
      { feature: "LOD (Cr)", ICP: "0.3 ng/L (ICP-MS H₂)", AAS: "3 μg/L (GFAAS)" },
      { feature: "Izotop ma'lumoti", ICP: "Ha (⁵⁰Cr, ⁵²Cr, ⁵³Cr, ⁵⁴Cr)", AAS: "Yo'q" },
      { feature: "ArC⁺ muammosi", ICP: "Ha (H₂ bilan hal)", AAS: "Yo'q (AAS da bunday interferensiya yo'q)" },
      { feature: "Vaqt (bir namuna)", ICP: "~5 daqiqa", AAS: "~10 daqiqa" },
      { feature: "Narxi", ICP: "$$$ (qimmat)", AAS: "$ (arzon)" }
    ]
  },

  relatedMethods: [
    {
      name: "EA (Element Analiz)",
      role: "H (4.54%), O (36.03%) — organik qismni tasdiqlaydi",
      icpAdvantage: "ICP metallni, EA organik qismni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq formula validatsiyasi",
      complementarity: "95%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Cr³⁺ ning d-d o'tishlari (405 nm, 575 nm) — binafsha-yashil rang",
      icpAdvantage: "UV-Vis Cr³⁺ va Cr²⁺ ni farqlaydi (ICP farqlay olmaydi!)",
      icpDisadvantage: "ICP miqdoriy, UV-Vis sifat",
      complementarity: "92%"
    },
    {
      name: "EPR spektroskopiya",
      role: "Cr³⁺ (d³) — kuchli EPR signali (g ≈ 1.98)",
      icpAdvantage: "EPR Cr³⁺ ni aniq aniqlaydi",
      icpDisadvantage: "ICP miqdoriy, EPR oksidlanish holatini",
      complementarity: "90%"
    },
    {
      name: "Ion xromatografiya (IC)",
      role: "Cl⁻ (3×) — tashqi sfera anionlarini aniqlaydi",
      icpAdvantage: "IC anionlarni, ICP metallni o'lchaydi",
      icpDisadvantage: "Birgalikda to'liq validatsiya",
      complementarity: "88%"
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

export default function CrH2O6Cl3Page() {
  const [activeRun, setActiveRun] = useState("ICP-24-202")
  const [customConc, setCustomConc] = useState(39.1)
  const [customMass, setCustomMass] = useState(50.0)
  const [dilutionFactor, setDilutionFactor] = useState(1)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)
  const [showH2Modal, setShowH2Modal] = useState(true)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[1]
  
  const deltaCr = Math.abs(run.percent - COMPOUND.theoretical.Cr.percent)
  const statusColor = deltaCr <= 0.5 ? "text-green-400" : deltaCr <= 1.5 ? "text-yellow-400" : "text-red-400"

  const calcResult = useMemo(() => 
    calculateCrPercent(customConc, customMass, dilutionFactor),
    [customConc, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-cyan-950/20 to-blue-950 text-white">
      
      {/* H2 MODAL */}
      {showH2Modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-violet-950 to-purple-950 border-2 border-violet-500 rounded-2xl p-6 max-w-2xl w-full">
            <h3 className="text-xl font-bold text-violet-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> ArC⁺ Interferensiyasi — ICP-MS ning muammosi
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              [Cr(H₂O)₆]Cl₃ tahlilida eng katta muammo — <strong className="text-violet-300">⁴⁰Ar¹²C⁺ poliatomik interferensiyasi</strong>.
            </p>
            
            <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-violet-400 font-bold mb-2">Muammo:</div>
                  <div className="space-y-1 text-purple-200">
                    <div>⁴⁰Ar⁺ + ¹²C → <strong className="text-violet-300">⁴⁰Ar¹²C⁺</strong></div>
                    <div>m/z = 40 + 12 = <strong className="text-violet-300">52</strong></div>
                    <div>⁵²Cr ning m/z = <strong className="text-violet-300">52</strong></div>
                    <div className="text-red-400 font-bold">→ Soxta signal!</div>
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">Yechim (H₂ rejimi):</div>
                  <div className="space-y-1 text-purple-200">
                    <div>Collision cell ga <strong className="text-green-300">H₂ gazi</strong> kiritiladi</div>
                    <div>ArC⁺ + H₂ → <strong className="text-green-300">Ar + CHₓ</strong></div>
                    <div>Cr⁺ + H₂ → <strong className="text-green-300">reaksiya yo'q</strong></div>
                    <div className="text-green-400 font-bold">→ To'g'ri signal!</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-violet-900/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-violet-300">Alternativ:</strong> ⁵³Cr (m/z=53, 9.5%) ishlatish — ArC⁺ muammosi yo'q, lekin sezgirlik 10× past.
              </p>
            </div>

            <button 
              onClick={() => setShowH2Modal(false)}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
            <span className="text-violet-400 font-semibold">[Cr(H₂O)₆]Cl₃</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-violet-400 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-violet-900/30 border border-violet-700/50 text-violet-400 text-[10px] uppercase tracking-wide">Cr³⁺ d³</span>
                <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Inert kompleks</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">⚠ ArC⁺</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">H₂ rejimi</span>
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
        <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (ICP uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Cr(H₂O)₆]Cl₃</strong> — xrom(III) ning geksaakva kompleksi, klassik inert kompleks. ICP tahlilida <strong className="text-violet-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-violet-500 text-xs md:text-sm">
                <li><strong className="text-white">Faqat Cr metall</strong> — ICP faqat uni o'lchaydi</li>
                <li>Cr³⁺ uchun <strong className="text-red-300">⁴⁰Ar¹²C⁺ interferensiyasi</strong> — H₂ rejimi majburiy!</li>
                <li>Cr³⁺ <strong className="text-violet-300">inert</strong> — ligand almashinishi juda sekin (soatlar)</li>
                <li>Cl, H, O <strong className="text-white">ICP da ko'rinmaydi</strong> — EA yoki IC kerak</li>
                <li>Izotop profili: ⁵⁰Cr, ⁵²Cr, ⁵³Cr, ⁵⁴Cr</li>
                <li>Alternativ: ⁵³Cr (9.5%) — ArC⁺ muammosi yo'q</li>
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
        <div className="bg-gradient-to-r from-violet-900/40 to-red-900/40 border-2 border-violet-700/70 rounded-2xl p-6">
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
                  <div className="text-green-300 font-bold">Reaksiya:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.uniqueICPFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowH2Modal(true)}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
          >
            📖 ArC⁺ interferensiyasi haqida batafsil →
          </button>
        </div>

        {/* 3. ICP-OES PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> ICP-OES parametrlari (Cr uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-OES — atom emissiya spektroskopiya. Cr <strong className="text-violet-300">267.7 nm</strong> da nurlanadi. ICP-OES da ArC⁺ muammosi yo'q — bu faqat ICP-MS da muammo.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="bg-violet-950/40 rounded-xl p-4 border border-violet-700/30">
              <h4 className="text-violet-400 font-bold text-sm mb-3">Cr (Xrom) parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (asosiy):</span>
                  <span className="font-mono text-violet-400 font-bold">{COMPOUND.icpOES.parameters.Cr.lambda_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">λ (alternativ):</span>
                  <span className="font-mono text-violet-400">{COMPOUND.icpOES.parameters.Cr.lambda_secondary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.icpOES.parameters.Cr.lod} μg/L</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpOES.parameters.Cr.linearRange}</span>
                </div>
                <div className="bg-violet-900/30 rounded p-2 mt-2">
                  <span className="text-violet-300 text-[10px]">📝 {COMPOUND.icpOES.parameters.Cr.notes}</span>
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
            <span>🧬</span> ICP-MS parametrlari (Cr uchun)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            ICP-MS — mass-spektrometriya. Cr uchun <strong className="text-violet-300">H₂ reaktiv rejimi</strong> majburiy (ArC⁺ interferensiyasi tufayli, agar organik matritsa bo'lsa). Alternativ: ⁵³Cr (m/z=53).
          </p>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="bg-violet-950/40 rounded-xl p-4 border-2 border-violet-500/50">
              <h4 className="text-violet-400 font-bold text-sm mb-3">Cr (Xrom) — H₂ reaktiv rejimi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">m/z (asosiy):</span>
                  <span className="font-mono text-violet-400 font-bold">{COMPOUND.icpMS.parameters.Cr.mz_primary}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Asosiy izotop:</span>
                  <span className="font-mono text-violet-400">{COMPOUND.icpMS.parameters.Cr.isotope_primary}</span>
                </div>
                <div className="flex justify-between bg-red-900/30 rounded p-2">
                  <span className="text-red-400">LOD (standart):</span>
                  <span className="font-mono text-red-400">{COMPOUND.icpMS.parameters.Cr.lod_standard} ng/L ⚠</span>
                </div>
                <div className="flex justify-between bg-green-900/30 rounded p-2">
                  <span className="text-green-400">LOD (H₂ rejimi):</span>
                  <span className="font-mono text-green-400 font-bold">{COMPOUND.icpMS.parameters.Cr.lod_H2} ng/L ✓</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.icpMS.parameters.Cr.linearRange}</span>
                </div>
                <div className="flex justify-between bg-purple-950/60 rounded p-2">
                  <span className="text-purple-400">Ichki standart:</span>
                  <span className="font-mono text-cyan-300">{COMPOUND.icpMS.parameters.Cr.internalStandard}</span>
                </div>
                <div className="bg-violet-900/30 rounded p-2 mt-2">
                  <span className="text-violet-300 text-[10px]">⚠ {COMPOUND.icpMS.parameters.Cr.interference}</span>
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
                <div className="text-violet-300 text-[10px] font-bold">{COMPOUND.icpMS.collisionCell}</div>
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
            ICP <strong className="text-violet-300">faqat Cr</strong> ni o'lchaydi. Cl, H, O ICP da ko'rinmaydi — ularni EA yoki IC bilan tekshirish kerak.
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
                    el === "Cr" ? "" : "opacity-50"
                  }`}>
                    <td className={`py-3 pl-2 font-bold ${el === "Cr" ? "text-violet-400" : "text-purple-400"}`}>{el}</td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-400">{d.icpSignal}</td>
                  </tr>
                ))}
                <tr className="bg-violet-900/20 font-bold border-t border-violet-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-violet-300">ICP: Cr (19.52%) — faqat bitta metall</td>
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
            ICP-MS har bir izotopni <strong className="text-cyan-300">alohida detektlaydi</strong>. Bu AAS va ICP-OES da mumkin emas. ⁵³Cr (9.5%) ArC⁺ muammosi yo'qligi uchun alternativa sifatida ishlatiladi.
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
                const barWidth = 80
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

          <div className="mt-3 p-3 bg-violet-900/20 rounded-lg border border-violet-700/30">
            <p className="text-xs text-purple-200">
              <strong className="text-violet-300">📝 {COMPOUND.isotopeProfile.Cr.note}</strong>
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
              <span>📈</span> Kalibrlash egri chizig'i (Cr, ICP-MS, H₂ rejimi)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Cr standartlari (2% HNO₃ + ichki standart Sc) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-violet-300">R² = 0.9999</strong> — deyarli mukammal chiziqli bog'liqliq.
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

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/100)*530
                const y = 220 - (p.intensity/301000)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#c4b5fd">
                        {(p.intensity/1000).toFixed(0)}k
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (39.1/100)*530
                const y = 220 - (117300/301000)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (39.1 μg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="450" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1" />
              <text x="510" y="48" textAnchor="middle" fontSize="10" fill="#c4b5fd" fontWeight="bold">
                R² = 0.9999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-violet-500"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya</span>
          </div>
        </div>

        {/* 9. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> ICP yugurishlari — Cr tahlili
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Cr <strong className="text-violet-300">H₂ reaktiv rejimi</strong> bilan o'lchanadi (ArC⁺ muammosi tufayli). Alternativ: ⁵³Cr (m/z=53).
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns.map(r => (
              <button 
                key={r.id}
                onClick={() => setActiveRun(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  activeRun === r.id 
                    ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20" 
                    : r.mode.includes("H₂ rejimi yo'q")
                      ? "bg-red-900/30 border-red-700/30 text-red-300 hover:border-red-500"
                      : r.mode.includes("⁵³Cr")
                        ? "bg-cyan-900/30 border-cyan-700/30 text-cyan-300 hover:border-cyan-500"
                        : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                }`}
              >
                {r.id.split('-').pop()} {r.mode.includes("H₂ rejimi yo'q") && "⚠"} {r.mode.includes("⁵³Cr") && "⁵³Cr"}
              </button>
            ))}
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
                      run.mode.includes("H₂ rejimi yo'q") ? "bg-red-900/30 text-red-300" : 
                      run.mode.includes("⁵³Cr") ? "bg-cyan-900/30 text-cyan-300" : "bg-green-900/30 text-green-300"
                    }`}>{run.mode}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-violet-900/20 rounded border border-violet-500/20">
                    <span className="text-sm text-violet-400 font-medium">C (μg/L):</span>
                    <span className="font-mono text-white text-lg">{run.conc_mgL.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Cr:</span>
                    <span className="font-mono text-white text-lg">{run.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Cr:</span>
                    <span className="font-mono text-violet-400">{COMPOUND.theoretical.Cr.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaCr.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-violet-400 mb-4 flex justify-between">
                <span>%Cr Qiymatlari (H₂ vs ⁵³Cr vs Standart)</span>
                <span className="text-[10px] text-purple-500 font-normal">Nazariy: 19.52%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const val = r.percent
                  const heightPct = Math.min((val / 50) * 100, 100)
                  const isActive = r.id === activeRun
                  const isBad = r.mode.includes("H₂ rejimi yo'q")
                  const is53Cr = r.mode.includes("⁵³Cr")
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                        <div className="absolute w-[120%] border-t border-dashed border-violet-400/50 z-0" style={{ bottom: `${(19.516/50)*100}%` }}></div>

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBad ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                              : is53Cr ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                              : 'bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                              : isBad ? 'bg-red-700/40' 
                              : is53Cr ? 'bg-cyan-700/40'
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isBad ? 'text-red-400' : is53Cr ? 'text-cyan-400' : 'text-violet-400') : 'text-purple-600'} font-bold`}>
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
              
              <h4 className="text-violet-400 font-bold text-sm mb-2">Cr (ICP-MS, H₂ rejimi):</h4>
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
                        <td className="py-2 px-3 text-violet-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.intensity.toLocaleString()}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-violet-900/20 rounded-lg border border-violet-700/30 text-xs text-purple-200">
                <strong className="text-violet-300">Cr regressiyasi:</strong> I = 3010 × C + 0, R² = 0.9999 (H₂ rejimi bilan)
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
              <div key={i} className="bg-violet-950/40 rounded-xl p-4 border border-violet-700/30">
                <h4 className="text-violet-400 font-bold text-sm mb-2">{m.problem}</h4>
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
            [Cr(H₂O)₆]Cl₃ uchun <strong className="text-violet-300">2% HNO₃</strong> ishlatiladi. Ichki standart (Sc) har bir namunaga qo'shiladi.
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

        {/* 12. HISOBLAGICH */}
        <div className="bg-violet-900/20 border border-violet-500/30 rounded-2xl p-6">
          <h3 className="text-violet-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> ICP dan %Cr hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Cr konsentratsiyasini kiriting — <strong className="text-violet-300">%Cr</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Cr konsentratsiyasi (μg/L):</label>
              <input 
                type="number" step="0.1" value={customConc}
                onChange={(e) => setCustomConc(Number(e.target.value))}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-purple-400">Cr massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-violet-400">{calcResult.Cr_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Cr:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult.Cr_percent - 19.52) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Cr_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Cr = (C(μg/L) × V(mL) × DF) / (m(mg) × 1000) × 100
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
        <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> ICP ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Cr(H₂O)₆]Cl₃ uchun ICP ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-violet-300">to'liq formula validatsiyasi</strong> uchun muhim. <strong className="text-amber-300">EA</strong> va <strong className="text-purple-300">EPR</strong> eng kuchli qo'shimcha metodlar.
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

          <div className="mt-5 bg-violet-900/20 border border-violet-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-violet-300 mb-2">💡 To'liq formula validatsiyasi uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">ICP-OES/MS (Cr) + EA (H, O) + EPR (Cr³⁺) + UV-Vis (405, 575 nm) + Ion xromatografiya (Cl⁻)</strong> — beshta metod birgalikda [Cr(H₂O)₆]Cl₃ ni to'liq tasdiqlaydi va uning sofligini nazorat qiladi.
            </p>
          </div>
        </div>

        {/* 15. ICP CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> ICP ning [Cr(H₂O)₆]Cl₃ uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                ICP [Cr(H₂O)₆]Cl₃ ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">⁴⁰Ar¹²C⁺ interferensiyasi</strong> — H₂ rejimi majburiy</li>
                <li><strong className="text-red-300">Cr³⁺ va Cr²⁺ ni farqlay olmaydi</strong> — EPR kerak</li>
                <li><strong className="text-red-300">Faqat Cr ni o'lchaydi</strong> — Cl, H, O uchun EA/IC kerak</li>
                <li><strong className="text-red-300">Yuqori tuz matritsasi</strong> — suyuqlantirish va ichki standart</li>
                <li><strong className="text-red-300">Qimmat instrument</strong> — AAS dan 10-20× qimmat</li>
                <li><strong className="text-red-300">Murakkab ishlatish</strong> — malakali operator kerak</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>[Cr(H₂O)₆]Cl₃ ni to'liq tasdiqlash</strong> uchun kamida 5 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-violet-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. ICP-OES/MS (Cr)</span>
                  <span className="text-violet-400 font-mono">19.52%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (H, O)</span>
                  <span className="text-violet-400 font-mono">4.54%, 36.03%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. EPR (Cr³⁺)</span>
                  <span className="text-violet-400 font-mono">g ≈ 1.98</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. UV-Vis (d-d)</span>
                  <span className="text-violet-400 font-mono">405, 575 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. IC (Cl⁻)</span>
                  <span className="text-violet-400 font-mono">39.92%</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 5 ta metod birgalikda [Cr(H₂O)₆]Cl₃ ni to'liq tasdiqlaydi
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
              <p className="text-xs text-purple-200"><strong className="text-violet-300">Cr ni</strong> ppb darajasida o'lchaydi. Izotop profili ko'rinadi. Inert kompleks tufayli namuna barqaror.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-violet-300">⁴⁰Ar¹²C⁺ interferensiyasi!</strong> H₂ rejimi majburiy. Cr³⁺/Cr²⁺ farqlanmaydi. Cl, H, O ko'rinmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EA (H, O), EPR (Cr³⁺), UV-Vis (405, 575 nm), IC (Cl⁻) — to'liq formula validatsiyasi uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/icp" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← ICP metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/icp/birikmalar" className="text-sm bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Cr(H₂O)₆]Cl₃ • ICP moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, NIST Isotope Data, Werner (1893)</p>
        </div>
      </footer>
    </main>
  )
}