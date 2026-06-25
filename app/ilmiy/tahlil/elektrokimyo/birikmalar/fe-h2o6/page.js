"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Fe(H₂O)₆]³⁺/²⁺ — ELEKTROKIMYOWIY TAHLIL MAHSUS SAHIFASI
// Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC
// Xususiyat: Kuchsiz maydon ligandi (H₂O), labile kompleks
// O'ziga xoslik: Aerob oksidlanish muammosi, pH ta'siri, labile vs inert
// Maqsad: Faqat elektrokimyoviy tahlil bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Fe: 55.845, S: 32.065, O: 15.999, H: 1.008, Cl: 35.450
}

const COMPOUND = {
  formulaHTML: "[Fe(H<sub>2</sub>O)<sub>6</sub>]<sup>3+/2+</sup>",
  formulaPlain: "[Fe(H2O)6]3+/2+",
  iupac_ox: "Geksaakvatemir(III)",
  iupac_red: "Geksaakvatemir(II)",
  formulaOx: "Fe₂(SO₄)₃ yoki FeCl₃",
  formulaRed: "FeSO₄·7H₂O yoki FeCl₂·4H₂O",
  commonOx: "Temir(III) sulfat/xlorid",
  commonRed: "Temir(II) sulfat (temir kuporosi)",
  molarMassOx: 399.88,
  molarMassRed: 278.01,
  casOx: "10028-22-5",
  casRed: "7782-63-0",
  colorOx: "sariq-to'q sariq (pH{'>'}2)",
  colorRed: "och yashil (Fe²⁺ akva)",
  
  historicalFact: {
    title: "Temir kuporosi — kimyoning eng qadimiy birikmalaridan",
    text: "[Fe(H₂O)₆]²⁺ — temir kuporosi (FeSO₄·7H₂O) alximyogarlar davridan ma'lum. O'rta asrlarda bo'yoq va siyoh ishlab chiqarishda ishlatilgan. 18-asrda temir kuporosining elektrokimyoviy xossalari o'rganila boshlandi. Fe³⁺/Fe²⁺ juftligi eng oddiy va keng tarqalgan redoks sistemasi bo'lib, E° = +0.77 V (vs SHE). Bu qiymat [Fe(CN)₆]³⁻/⁴⁻ (+0.36 V) dan ancha yuqori — sababi H₂O kuchsiz maydon ligand, Fe³⁺ ni barqarorlashtirmaydi. Qiziq fakt: Fe²⁺ aerob sharoitda juda tez O₂ bilan oksidlanib Fe³⁺ ga aylanadi — bu elektrokimyoviy tahlilda katta muammo!",
    year: "18-asr"
  },

  electrochemicalFeature: {
    title: "[Fe(H₂O)₆]³⁺/²⁺ — kuchsiz maydon ligandi (labile kompleks)",
    description: "Bu juftlik [Fe(CN)₆]³⁻/⁴⁻ dan tubdan farq qiladi. H₂O kuchsiz maydon ligand bo'lgani uchun Fe³⁺/Fe²⁺ juftligi yuqori spinli va labile.",
    reaction: {
      half: "[Fe(H₂O)₆]³⁺ + e⁻ ⇌ [Fe(H₂O)₆]²⁺",
      E0: "+0.77 V (vs SHE)",
      E0_AgAgCl: "+0.55 V (vs Ag/AgCl)",
      n: 1,
      deltaE: "100-200 mV (sekin elektron ko'chish)"
    },
    problem: {
      title: "Aerob oksidlanish muammosi",
      description: "[Fe(H₂O)₆]²⁺ havoda (O₂ bilan) juda tez oksidlanadi: 4Fe²⁺ + O₂ + 4H⁺ → 4Fe³⁺ + 2H₂O. Bu elektrokimyoviy tahlilda katta muammo!",
      impact: "Eritma rangi och yashildan sariqqa o'zgaradi. Natija noto'g'ri bo'ladi — Fe²⁺ kamayadi, Fe³⁺ ortadi."
    },
    solution: {
      title: "Anaerob sharoit + pH nazorati",
      description: "Eritma azot yoki argon bilan degazatsiya qilinadi. pH 2-3 oralig'ida saqlanadi (Fe(OH)₃ cho'kmasligi uchun).",
      mechanism: "Azot bilan degazatsiya O₂ ni olib tashlaydi. pH 2-3 da Fe³⁺ erkin ion holatida qoladi (Fe(OH)₃ cho'kmaydi)."
    }
  },

  cvParameters: {
    electrode: "Shisha uglerod (GCE) yoki Pt disk elektrod",
    reference: "Ag/AgCl (3M KCl) yoki SHE",
    auxiliary: "Pt sim",
    electrolyte: "0.1 M H₂SO₄ yoki 0.1 M HClO₄ (pH 2-3)",
    scanRate: "100 mV/s (standart)",
    potentialWindow: "0.0 V dan +1.2 V gacha (vs Ag/AgCl)",
    E_pa: "+0.82 V (anod pik, Fe²⁺ → Fe³⁺)",
    E_pc: "+0.72 V (katod pik, Fe³⁺ → Fe²⁺)",
    deltaE: "100 mV (sekin elektron ko'chish)",
    Ipa_Ipc: "≈ 1.0 (agar anaerob bo'lsa)",
    D: "6.0 × 10⁻⁶ cm²/s (25°C da)"
  },

  theoretical: {
    Fe_ox:  { mass: 55.845,  percent: 27.93, source: "Fe³⁺ markaziy atom (Fe₂(SO₄)₃)", signal: "Oksidlovchi pik (anod)" },
    Fe_red: { mass: 55.845,  percent: 20.09, source: "Fe²⁺ markaziy atom (FeSO₄·7H₂O)", signal: "Qaytaruvchi pik (katod)" },
    S:      { mass: 96.195,  percent: 24.06, source: "3×SO₄²⁻", signal: "CV da ko'rinmaydi" },
    O:      { mass: 191.988, percent: 48.01, source: "12×SO₄²⁻ (12×O)", signal: "CV da ko'rinmaydi" },
    H:      { mass: 0.000,   percent: 0.00,  source: "Suvda eritma — hisobga olinmaydi", signal: "CV da ko'rinmaydi" }
  },

  // CV voltamperogramma ma'lumotlari (100 mV/s)
  cvData: [
    { potential: 0.00, current: 0.0 },
    { potential: 0.10, current: -0.1 },
    { potential: 0.20, current: -0.2 },
    { potential: 0.30, current: -0.3 },
    { potential: 0.40, current: -0.5 },
    { potential: 0.50, current: -1.0 },
    { potential: 0.60, current: -3.0 },
    { potential: 0.65, current: -6.0 },
    { potential: 0.70, current: -10.0 },
    { potential: 0.72, current: -14.0 },
    { potential: 0.75, current: -12.0 },
    { potential: 0.78, current: -5.0 },
    { potential: 0.80, current: 2.0 },
    { potential: 0.82, current: 12.5 },
    { potential: 0.85, current: 13.5 },
    { potential: 0.88, current: 10.0 },
    { potential: 0.92, current: 5.0 },
    { potential: 0.95, current: 2.0 },
    { potential: 1.00, current: 0.5 },
    { potential: 1.10, current: 0.2 },
    { potential: 1.20, current: 0.1 }
  ],

  // Skan tezligi bo'yicha ma'lumotlar
  scanRateData: [
    { scanRate: 25,  Ipa: 6.5,  Ipc: -6.3, deltaE: 0.095, E12: 0.770, sqrtV: 0.158 },
    { scanRate: 50,  Ipa: 9.2,  Ipc: -9.0, deltaE: 0.098, E12: 0.770, sqrtV: 0.224 },
    { scanRate: 100, Ipa: 13.0, Ipc: -12.7, deltaE: 0.100, E12: 0.770, sqrtV: 0.316 },
    { scanRate: 200, Ipa: 18.4, Ipc: -17.9, deltaE: 0.110, E12: 0.771, sqrtV: 0.447 },
    { scanRate: 500, Ipa: 29.1, Ipc: -28.1, deltaE: 0.130, E12: 0.772, sqrtV: 0.707 },
    { scanRate: 1000, Ipa: 41.2, Ipc: -39.5, deltaE: 0.160, E12: 0.775, sqrtV: 1.000 }
  ],

  experimentalRuns: [
    { id: "CV-24-101", date: "2025-02-15", E_pa: 0.820, E_pc: 0.720, deltaE: 0.100, Ipa_Ipc: 1.02, E12: 0.770, scanRate: 100, note: "Toza FeSO₄·7H₂O, 0.1 M H₂SO₄, anaerob" },
    { id: "CV-24-102", date: "2025-02-15", E_pa: 0.825, E_pc: 0.715, deltaE: 0.110, Ipa_Ipc: 1.05, E12: 0.770, scanRate: 100, note: "Ikkinchi sikl — kichik o'zgarish" },
    { id: "CV-24-103", date: "2025-02-15", E_pa: 0.820, E_pc: 0.720, deltaE: 0.100, Ipa_Ipc: 1.01, E12: 0.770, scanRate: 50, note: "50 mV/s — sekinroq skan" },
    { id: "CV-24-104", date: "2025-02-15", E_pa: 0.840, E_pc: 0.700, deltaE: 0.140, Ipa_Ipc: 1.08, E12: 0.770, scanRate: 200, note: "200 mV/s — tezroq skan" },
    { id: "CV-24-105", date: "2025-02-16", E_pa: 0.850, E_pc: 0.680, deltaE: 0.170, Ipa_Ipc: 1.15, E12: 0.765, scanRate: 100, note: "⚠ Aerob sharoit — Fe²⁺ oksidlangan" },
    { id: "CV-24-106", date: "2025-02-16", E_pa: 0.870, E_pc: 0.650, deltaE: 0.220, Ipa_Ipc: 1.25, E12: 0.760, scanRate: 500, note: "Juda tez skan — qaytariluvchanlik buzilgan" },
    { id: "CV-24-107", date: "2025-02-17", E_pa: 0.820, E_pc: 0.720, deltaE: 0.100, Ipa_Ipc: 1.00, E12: 0.770, scanRate: 100, note: "Fe²⁺ + Fe³⁺ aralashmasi (1:1)" },
    { id: "CV-24-108", date: "2025-02-17", E_pa: 0.830, E_pc: 0.710, deltaE: 0.120, Ipa_Ipc: 1.03, E12: 0.770, scanRate: 100, note: "Pt elektrod ishlatildi, pH 5 — Fe(OH)₃ cho'kma!" },
    { id: "BLANK-02",   date: "2025-02-15", E_pa: 0.000, E_pc: 0.000, deltaE: 0.000, Ipa_Ipc: 0.00, E12: 0.000, scanRate: 100, note: "Blank (0.1 M H₂SO₄, elektrod faqat)" },
    { id: "STD-FE2",  date: "2025-02-15", E_pa: 0.820, E_pc: 0.720, deltaE: 0.100, Ipa_Ipc: 1.00, E12: 0.770, scanRate: 100, note: "Standart FeSO₄ 1 mM" }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "Fe²⁺ aerob sharoitda tez oksidlanadi! Faqat anaerob sharoitda ishlang. Azot yoki argon atmosferasi zarur. H₂SO₄ — kuydiruvchi kislota.", time: "doimiy", critical: true },
    { step: 2, title: "Eritma tayyorlash (1 mM)", desc: "Analitik tarozida 27.8 mg FeSO₄·7H₂O tortilib, 100 mL 0.1 M H₂SO₄ eritmasida eritiladi. Azot bilan 10 daqiqa degazatsiya qilinadi.", time: "10 daq", critical: true },
    { step: 3, title: "Elektrolit tayyorlash", desc: "0.1 M H₂SO₄ elektrolit tayyorlanadi (0.98 g H₂SO₄ / 100 mL distillangan suv). pH 2-3 oralig'ida — Fe(OH)₃ cho'kmasligi uchun.", time: "3 daq", critical: true },
    { step: 4, title: "Elektrod tozalash", desc: "Shisha uglerod elektrod (GCE) alumina kukuni (0.05 μm) bilan tozalanadi, distillangan suv bilan yuviladi.", time: "5 daq", critical: true },
    { step: 5, title: "Elektrokimyoviy cell yig'ish", desc: "Uch elektrodli cell: ishchi (GCE), solishtirma (Ag/AgCl), yordamchi (Pt sim). Eritma azot bilan 10 daqiqa degazatsiya qilinadi.", time: "10 daq", critical: true },
    { step: 6, title: "CV o'lchash (oldinga)", desc: "Potensial 0.0 V dan +1.2 V gacha 100 mV/s da skan qilinadi. Katod pik (Fe³⁺ → Fe²⁺) kuzatiladi.", time: "12 son", critical: false },
    { step: 7, title: "CV o'lchash (orqaga)", desc: "Potensial +1.2 V dan 0.0 V gacha qaytariladi. Anod pik (Fe²⁺ → Fe³⁺) kuzatiladi. ΔE hisoblanadi.", time: "12 son", critical: false },
    { step: 8, title: "Ko'p sikl (stabilite)", desc: "10 ta sikl bajarilib, stabilite tekshiriladi. Aerob sharoitda Ipa/Ipc ortadi (Fe²⁺ kamayadi).", time: "5 daq", critical: false },
    { step: 9, title: "Natijalarni hisoblash", desc: "E_pa, E_pc, ΔE, Ipa/Ipc, E₁/₂ hisoblanadi. Randles-Sevcik bilan D hisoblanadi.", time: "3 daq", critical: false }
  ],

  nernstEquation: {
    title: "Nernst tenglamasi — [Fe(H₂O)₆]³⁺/²⁺ uchun",
    equation: "E = E° + (RT/nF) × ln([Fe(H₂O)₆³⁺]/[Fe(H₂O)₆²⁺])",
    simplified: "E = 0.77 + 0.059 × log([Ox]/[Red])",
    explanation: "Bu yerda E° = +0.77 V (vs SHE), n = 1 (bir elektron). Agar [Ox] = [Red] bo'lsa, E = E° = +0.77 V."
  },

  // pH ta'siri
  pHEffect: {
    title: "pH ta'siri — Fe(OH)₃ cho'kma chegarasi",
    explanation: "Fe³⁺ pH 3 dan yuqori bo'lganda Fe(OH)₃ cho'kmasini hosil qiladi. Bu elektrokimyoviy tahlilda katta muammo!",
    limits: {
      pH_2: "Fe³⁺ erkin ion — to'liq eriydi",
      pH_3: "Fe(OH)₃ cho'kma boshlanadi",
      pH_5: "To'liq cho'kma — elektrokimyo ishlamaydi"
    },
    solution: "pH 2-3 oralig'ida saqlash (0.1 M H₂SO₄ yoki HClO₄)"
  },

  relatedMethods: [
    {
      name: "AAS / ICP-OES",
      role: "Fe miqdorini aniqlaydi (20.09% yoki 27.93%)",
      cvAdvantage: "CV redoks xossalarini ko'rsatadi",
      cvDisadvantage: "AAS/ICP miqdoriy, CV sifat",
      complementarity: "95%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "[Fe(H₂O)₆]³⁺ (sariq, ~400 nm) va [Fe(H₂O)₆]²⁺ (och yashil, zaif)",
      cvAdvantage: "UV-Vis rang va konsentratsiyani ko'rsatadi",
      cvDisadvantage: "CV redoks potensialni, UV-Vis spektrni",
      complementarity: "92%"
    },
    {
      name: "Mössbauer spektroskopiya",
      role: "Fe²⁺ (δ = 1.2 mm/s) va Fe³⁺ (δ = 0.4 mm/s) farqlanadi",
      cvAdvantage: "Mössbauer oksidlanish holatini, CV redoks potensialni ko'rsatadi",
      cvDisadvantage: "Birgalikda to'liq tavsif",
      complementarity: "94%"
    },
    {
      name: "Potensiometriya",
      role: "Pt elektrod bilan E ni to'g'ridan-to'g'ri o'lchash",
      cvAdvantage: "Potensiometriya oddiy, CV dinamikani ko'rsatadi",
      cvDisadvantage: "Birgalikda to'liq tavsif",
      complementarity: "90%"
    }
  ],

  // Boshqa Fe komplekslari bilan taqqoslash
  comparisonComplexes: [
    {
      name: "[Fe(H₂O)₆]³⁺/²⁺",
      E0: "+0.77 V",
      config: "d⁵/d⁶ (yuqori spin)",
      Kstab: "past (labile)",
      color: "sariq/och yashil",
      notes: "Kuchsiz maydon — Fe³⁺ barqaror, E° yuqori"
    },
    {
      name: "[Fe(CN)₆]³⁻/⁴⁻",
      E0: "+0.36 V",
      config: "d⁵/d⁶ (past spin)",
      Kstab: "10⁴² / 10³⁵",
      color: "qizil/sariq",
      notes: "Kuchli maydon — Fe³⁺ barqaror, E° past"
    },
    {
      name: "[Fe(phen)₃]³⁺/²⁺",
      E0: "+1.12 V",
      config: "d⁵/d⁶ (past spin)",
      Kstab: "10¹⁴ / 10²¹",
      color: "ko'k/qizil",
      notes: "Ferroin indikatori — redoks indikator"
    },
    {
      name: "[Fe(phen)₃]²⁺ (Ferroin)",
      E0: "+1.06 V",
      config: "d⁶ (past spin)",
      Kstab: "10²¹",
      color: "qizil",
      notes: "Kuchli qizil rang — titrlash indikatori"
    }
  ]
}

function calculateE12(Epa, Epc) {
  return parseFloat(((Epa + Epc) / 2).toFixed(3))
}

function calculateDeltaE(Epa, Epc) {
  return parseFloat((Epa - Epc).toFixed(3))
}

function calculateDiffusionCoefficient(Ipa, scanRate, concentration_mM, area) {
  const n = 1
  const n32 = Math.pow(n, 1.5)
  const A = area
  const C = concentration_mM * 1e-3
  const v = scanRate
  const sqrtV = Math.sqrt(v)
  const factor = 2.69e5 * n32 * A * C * sqrtV
  const D = Math.pow(Ipa / factor, 2)
  return D
}

function calculateNernstPotential(oxConc, redConc, E0 = 0.77) {
  if (redConc <= 0) return Infinity
  return E0 + 0.059 * Math.log10(oxConc / redConc)
}

function calculateFeOH3Limit(pH) {
  // Fe(OH)₃ Ksp = 2.79 × 10⁻³⁹
  // [Fe³⁺] = Ksp / [OH⁻]³ = Ksp / (10^(pH-14))³
  const OH = Math.pow(10, pH - 14)
  const Fe3_max = 2.79e-39 / Math.pow(OH, 3)
  return Fe3_max
}

function getStatusColor(deltaE) {
  if (deltaE <= 0.10) return "text-green-400"
  if (deltaE <= 0.15) return "text-yellow-400"
  return "text-red-400"
}

export default function FeH2O6Page() {
  const [activeRun, setActiveRun] = useState("CV-24-101")
  const [customEpa, setCustomEpa] = useState(0.82)
  const [customEpc, setCustomEpc] = useState(0.72)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showNernstModal, setShowNernstModal] = useState(false)
  const [showAerobicModal, setShowAerobicModal] = useState(true)
  
  // Nernst kalkulyator
  const [oxConc, setOxConc] = useState(1.0)
  const [redConc, setRedConc] = useState(1.0)
  const [nernstE0, setNernstE0] = useState(0.77)
  
  // Diffuziya kalkulyatori
  const [diffIpa, setDiffIpa] = useState(13.0)
  const [diffScanRate, setDiffScanRate] = useState(100)
  const [diffConc, setDiffConc] = useState(1.0)
  const [diffArea, setDiffArea] = useState(0.07)
  
  // pH kalkulyatori
  const [pH, setPH] = useState(2.5)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaE = calculateDeltaE(run.E_pa, run.E_pc)
  const E12 = calculateE12(run.E_pa, run.E_pc)
  const statusColor = getStatusColor(deltaE)

  const calcResult = useMemo(() => ({
    E12: calculateE12(customEpa, customEpc),
    deltaE: calculateDeltaE(customEpa, customEpc),
    isReversible: calculateDeltaE(customEpa, customEpc) <= 0.10
  }), [customEpa, customEpc])

  const nernstE = useMemo(() => 
    calculateNernstPotential(oxConc, redConc, nernstE0),
    [oxConc, redConc, nernstE0]
  )

  const calcDiff = useMemo(() => 
    calculateDiffusionCoefficient(diffIpa, diffScanRate / 1000, diffConc, diffArea),
    [diffIpa, diffScanRate, diffConc, diffArea]
  )

  const fe3Max = useMemo(() => calculateFeOH3Limit(pH), [pH])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-green-950/20 to-blue-950 text-white">
      
      {/* AEROB OKSIDLANISH OGOHLANTIRISH MODALI */}
      {showAerobicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-orange-950 to-yellow-950 border-2 border-orange-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> AEROB OKSIDLANISH MUAMMOSI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-orange-300">[Fe(H₂O)₆]²⁺</strong> havoda (O₂ bilan) juda tez oksidlanadi: <strong className="text-orange-300">4Fe²⁺ + O₂ + 4H⁺ → 4Fe³⁺ + 2H₂O</strong>
            </p>
            
            <div className="bg-orange-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">❌ Muammo:</div>
                  <div className="text-purple-200">
                    Fe²⁺ eritmasi havoda <strong>juda tez</strong> Fe³⁺ ga aylanadi (bir necha daqiqada).
                  </div>
                  <div className="text-purple-200 mt-2">
                    Natija: Eritma rangi och yashildan sariqqa o'zgaradi. Natija noto'g'ri bo'ladi.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">✅ Yechim:</div>
                  <div className="text-purple-200">
                    <strong>1.</strong> Azot/argon bilan degazatsiya<br/>
                    <strong>2.</strong> pH 2-3 (H₂SO₄)<br/>
                    <strong>3.</strong> Anaerob sharoit
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-orange-300">Muhim:</strong> pH {'>'} 3 bo'lganda Fe(OH)₃ cho'kma hosil bo'ladi — elektrokimyo ishlamaydi!
              </p>
            </div>

            <button 
              onClick={() => setShowAerobicModal(false)}
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
            <Link href="/ilmiy/tahlil/elektrokimyo" className="hover:text-purple-300">Elektrokimyo</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/elektrokimyo/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
            <span className="text-purple-600">›</span>
            <span className="text-green-400 font-semibold">[Fe(H₂O)₆]³⁺/²⁺</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">⚡ CV</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                {COMPOUND.iupac_ox} / {COMPOUND.iupac_red}
              </p>
              <p className="text-purple-500 text-xs mt-1 font-mono">
                Oks: {COMPOUND.formulaOx} ({COMPOUND.commonOx}) • Qayt: {COMPOUND.formulaRed} ({COMPOUND.commonRed})
              </p>
              <p className="text-purple-500 text-xs mt-1">
                M(oks) = {COMPOUND.molarMassOx} g/mol • M(qayt) = {COMPOUND.molarMassRed} g/mol
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Fe³⁺/Fe²⁺</span>
                <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Labile kompleks</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">E° = +0.77 V</span>
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">⚠ Aerob</span>
              </div>
            </div>
            <Link href="/ilmiy/tahlil/elektrokimyo/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Barcha birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-green-900/40 to-purple-900/40 border border-green-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (elektrokimyoviy tahlil uchun)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Fe(H₂O)₆]³⁺/²⁺</strong> — eng oddiy va keng tarqalgan redoks juftlik. H₂O kuchsiz maydon ligand bo'lgani uchun Fe³⁺/Fe²⁺ juftligi <strong className="text-green-300">yuqori spinli va labile</strong>.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-green-500 text-xs md:text-sm">
                <li><strong className="text-white">Bir elektronli qaytar</strong>: Fe³⁺ + e⁻ ⇌ Fe²⁺</li>
                <li>E° = <strong className="text-green-400">+0.77 V</strong> (vs SHE) — [Fe(CN)₆] dan yuqori!</li>
                <li>ΔE = <strong className="text-yellow-300">100 mV</strong> (sekin elektron ko'chish)</li>
                <li>Ipa/Ipc ≈ <strong className="text-green-300">1.0</strong> (anaerob sharoitda)</li>
                <li><strong className="text-orange-300">Aerob oksidlanish</strong> — Fe²⁺ tez O₂ bilan oksidlanadi</li>
                <li>pH 2-3 oralig'ida saqlash kerak (Fe(OH)₃ cho'kmasligi uchun)</li>
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

        {/* 2. AEROB OKSIDLANISH MUAMMOSI */}
        <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border-2 border-orange-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span> {COMPOUND.electrochemicalFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.electrochemicalFeature.description}
          </p>

          <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
            <div className="text-center text-lg font-mono text-green-400 mb-2">
              {COMPOUND.electrochemicalFeature.reaction.half}
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-green-400">E°(SHE) = {COMPOUND.electrochemicalFeature.reaction.E0}</span>
              <span className="text-green-400">E°(Ag/AgCl) = {COMPOUND.electrochemicalFeature.reaction.E0_AgAgCl}</span>
              <span className="text-green-400">n = {COMPOUND.electrochemicalFeature.reaction.n}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-950/40 rounded-xl p-5 border-2 border-red-500/50">
              <h3 className="text-red-400 font-bold text-sm mb-3">❌ Muammo: {COMPOUND.electrochemicalFeature.problem.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-red-400 font-bold">Muammo:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.electrochemicalFeature.problem.description}</div>
                </div>
                <div className="bg-red-900/30 rounded p-2">
                  <div className="text-red-300 font-bold">Ta'sir:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.electrochemicalFeature.problem.impact}</div>
                </div>
              </div>
            </div>

            <div className="bg-green-950/40 rounded-xl p-5 border-2 border-green-500/50">
              <h3 className="text-green-400 font-bold text-sm mb-3">✅ Yechim: {COMPOUND.electrochemicalFeature.solution.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-green-400 font-bold">Mexanizm:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.electrochemicalFeature.solution.description}</div>
                </div>
                <div className="bg-green-900/30 rounded p-2">
                  <div className="text-green-300 font-bold">Azot + pH:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.electrochemicalFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAerobicModal(true)}
            className="w-full mt-4 bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
          >
            ⚠️ Aerob oksidlanish haqida batafsil →
          </button>
        </div>

        {/* 3. pH TA'SIRI */}
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
            <span>🧪</span> {COMPOUND.pHEffect.title}
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            {COMPOUND.pHEffect.explanation}
          </p>

          <div className="mb-6">
            <label className="block text-xs text-purple-400 mb-1">pH qiymati:</label>
            <input 
              type="range" min="0" max="7" step="0.1" value={pH}
              onChange={(e) => setPH(Number(e.target.value))}
              className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>pH 0 (kuchli kislota)</span>
              <span className="text-cyan-400 font-bold">pH = {pH.toFixed(1)}</span>
              <span>pH 7 (neytral)</span>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Maksimal [Fe³⁺]:</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{fe3Max.toExponential(2)} M</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Holat:</div>
                <div className={`text-xl font-mono font-bold ${
                  pH < 3 ? 'text-green-400' : pH < 5 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {pH < 3 ? "Eriydi ✓" : pH < 5 ? "Cho'kma boshlanadi" : "To'liq cho'kma ✗"}
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300">
              {COMPOUND.pHEffect.solution}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className={`p-2 rounded ${pH < 3 ? 'bg-green-900/30 border border-green-500/30' : 'bg-purple-950/30'}`}>
                <div className="text-green-400 font-bold">pH {'<'} 3</div>
                <div className="text-purple-200">{COMPOUND.pHEffect.limits.pH_2}</div>
              </div>
              <div className={`p-2 rounded ${pH >= 3 && pH < 5 ? 'bg-yellow-900/30 border border-yellow-500/30' : 'bg-purple-950/30'}`}>
                <div className="text-yellow-400 font-bold">pH 3-5</div>
                <div className="text-purple-200">{COMPOUND.pHEffect.limits.pH_3}</div>
              </div>
              <div className={`p-2 rounded ${pH >= 5 ? 'bg-red-900/30 border border-red-500/30' : 'bg-purple-950/30'}`}>
                <div className="text-red-400 font-bold">pH {'>'} 5</div>
                <div className="text-purple-200">{COMPOUND.pHEffect.limits.pH_5}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. CV PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> CV o'lchash parametrlari
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            [Fe(H₂O)₆]³⁺/²⁺ uchun standart CV sharoitlari. GCE elektrod, 0.1 M H₂SO₄ elektrolit, 100 mV/s skan tezligi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Ishchi elektrod</div>
              <div className="text-sm font-bold text-green-400">GCE</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">E_pa (anod)</div>
              <div className="text-sm font-mono font-bold text-green-400">{COMPOUND.cvParameters.E_pa}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">E_pc (katod)</div>
              <div className="text-sm font-mono font-bold text-green-400">{COMPOUND.cvParameters.E_pc}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">ΔE</div>
              <div className="text-sm font-mono font-bold text-yellow-400">{COMPOUND.cvParameters.deltaE}</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
            <h4 className="text-cyan-400 font-bold text-xs mb-2">To'liq parametrlar:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-purple-400">Solishtirma elektrod:</div>
                <div className="text-white text-[10px]">{COMPOUND.cvParameters.reference}</div>
              </div>
              <div>
                <div className="text-purple-400">Yordamchi elektrod:</div>
                <div className="text-white text-[10px]">{COMPOUND.cvParameters.auxiliary}</div>
              </div>
              <div>
                <div className="text-purple-400">Elektrolit:</div>
                <div className="text-white text-[10px]">{COMPOUND.cvParameters.electrolyte}</div>
              </div>
              <div>
                <div className="text-purple-400">Skan tezligi:</div>
                <div className="text-white text-[10px]">{COMPOUND.cvParameters.scanRate}</div>
              </div>
              <div>
                <div className="text-purple-400">Potensial oynasi:</div>
                <div className="text-white text-[10px]">{COMPOUND.cvParameters.potentialWindow}</div>
              </div>
              <div>
                <div className="text-purple-400">Ipa/Ipc:</div>
                <div className="text-white text-[10px]">{COMPOUND.cvParameters.Ipa_Ipc}</div>
              </div>
              <div>
                <div className="text-purple-400">D (diffuziya):</div>
                <div className="text-white text-[10px]">{COMPOUND.cvParameters.D}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. NAZARIY TARKIB */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📐</span> Nazariy element tarkibi
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            FeSO₄·7H₂O (temir kuporosi) va Fe₂(SO₄)₃ uchun nazariy tarkib.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 text-xs uppercase tracking-wider">
                  <th className="py-3 text-left pl-2">Birikma</th>
                  <th className="py-3 text-center">Element</th>
                  <th className="py-3 text-center">Massa</th>
                  <th className="py-3 text-center text-yellow-400">% (m/m)</th>
                  <th className="py-3 text-left pl-4">CV signali</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => {
                  const elColor = el.includes("Fe") ? "text-green-400" : "text-purple-400"
                  const rowClass = el.includes("Fe") ? "" : "opacity-60"
                  const trClass = "border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors " + rowClass
                  const tdElClass = "py-3 pl-2 font-bold " + elColor
                  return (
                    <tr key={el} className={trClass}>
                      <td className={tdElClass}>{el.includes("Fe_ox") ? "Fe₂(SO₄)₃" : el.includes("Fe_red") ? "FeSO₄·7H₂O" : el}</td>
                      <td className="py-3 text-center font-mono">{el.replace("_ox", "").replace("_red", "")}</td>
                      <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                      <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                      <td className="py-3 pl-4 text-[10px] text-purple-400">{d.signal}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. CV VOLTAMPEROGRAMMA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📈</span> CV voltamperogramma (100 mV/s)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            [Fe(H₂O)₆]³⁺/²⁺ uchun tipik siklik voltamperogramma. ΔE = 100 mV — [Fe(CN)₆] dan katta (sekin elektron ko'chish).
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 300" className="w-full h-full overflow-visible">
              {/* Grid */}
              {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2].map((v, i) => (
                <g key={i}>
                  <line x1="60" y1={30 + ((v)/1.2)*240} x2="580" y2={30 + ((v)/1.2)*240} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="55" y={34 + ((v)/1.2)*240} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}V</text>
                </g>
              ))}

              {/* X axis */}
              {[-15, -10, -5, 0, 5, 10, 15].map((v, i) => (
                <g key={i}>
                  <text x={60 + ((v + 15)/30)*520} y="285" textAnchor="middle" fontSize="8" fill="#a78bfa">{v}</text>
                </g>
              ))}
              <text x="310" y="298" textAnchor="middle" fontSize="10" fill="#a78bfa">Tok (μA)</text>

              {/* Zero line */}
              <line x1="60" y1={30 + (15/30)*240} x2="580" y2={30 + (15/30)*240} stroke="#a78bfa" strokeWidth="1" />

              {/* CV curve */}
              <polyline
                fill="none" stroke="#10b981" strokeWidth="2"
                points={COMPOUND.cvData.map(p => {
                  const x = 60 + (p.potential/1.2)*520
                  const y = 30 + ((15 - p.current)/30)*240
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* E_pa marker */}
              <line x1={60 + (0.82/1.2)*520} y1="30" x2={60 + (0.82/1.2)*520} y2="270" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" />
              <text x={60 + (0.82/1.2)*520} y="20" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">E_pa = +0.82V</text>

              {/* E_pc marker */}
              <line x1={60 + (0.72/1.2)*520} y1="30" x2={60 + (0.72/1.2)*520} y2="270" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2" />
              <text x={60 + (0.72/1.2)*520 - 5} y="20" textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="bold">E_pc = +0.72V</text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-green-500"></span> CV egri chiziq</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-red-500"></span> E_pa (anod pik)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-green-500"></span> E_pc (katod pik)</span>
          </div>
        </div>

        {/* 7. SKAN TEZLIGI TA'SIRI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📊</span> Skan tezligi ta'siri (Randles-Sevcik)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Qaytar sistemada pik toki skan tezligining kvadrat ildiziga proporsional: <strong className="text-green-400">Ip ∝ v^(1/2)</strong>.
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 text-xs uppercase tracking-wider">
                  <th className="py-2 px-3 text-left">v (mV/s)</th>
                  <th className="py-2 px-3 text-center">√v (V/s)^(1/2)</th>
                  <th className="py-2 px-3 text-center">Ipa (μA)</th>
                  <th className="py-2 px-3 text-center">Ipc (μA)</th>
                  <th className="py-2 px-3 text-center">Ipa/Ipc</th>
                  <th className="py-2 px-3 text-center">ΔE (mV)</th>
                  <th className="py-2 px-3 text-center">E₁/₂ (V)</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.scanRateData.map((d, i) => {
                  const ratio = d.Ipa / Math.abs(d.Ipc)
                  return (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-3 font-mono text-green-400 font-bold">{d.scanRate}</td>
                      <td className="py-2 px-3 text-center font-mono">{d.sqrtV.toFixed(3)}</td>
                      <td className="py-2 px-3 text-center font-mono text-green-400">{d.Ipa.toFixed(1)}</td>
                      <td className="py-2 px-3 text-center font-mono text-green-400">{d.Ipc.toFixed(1)}</td>
                      <td className="py-2 px-3 text-center font-mono">{ratio.toFixed(2)}</td>
                      <td className="py-2 px-3 text-center font-mono text-cyan-400">{(d.deltaE * 1000).toFixed(0)}</td>
                      <td className="py-2 px-3 text-center font-mono text-green-400">{d.E12.toFixed(3)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-purple-400 italic">
            💡 <strong>Eslatma:</strong> Sekin skan tezligida ΔE 100 mV ga yaqin. Tez skan da ΔE ortadi (qaytariluvchanlik kamayadi).
          </p>
        </div>

        {/* 8. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> CV yugurishlari — turli sharoitlarda
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli skan tezliklari va sharoitlarda o'lchangan CV natijalari. ΔE = 100 mV bo'lishi kerak (sekin qaytar).
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isActive = activeRun === r.id
              const btnClass = isActive
                ? "bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/20"
                : isBlank
                  ? "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-gray-500"
                  : isStd
                    ? "bg-cyan-900/30 border-cyan-700/30 text-cyan-300 hover:border-cyan-500"
                    : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${btnClass}`}
                >
                  {r.id.split('-').pop()} ({r.scanRate}mV/s)
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-purple-950/60 rounded-xl p-5 border border-purple-700/30">
                <div className="text-xs text-purple-500 uppercase tracking-wider mb-1">O'lchash ID</div>
                <div className="text-xl font-bold text-white font-mono">{run.id}</div>
                <div className="text-xs text-purple-400 mt-1">{run.date} • {run.scanRate} mV/s</div>
                <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
                  📝 {run.note}
                </div>
                
                <div className="my-4 border-t border-purple-800/50"></div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-400 font-medium">E_pa (anod):</span>
                    <span className="font-mono text-white text-lg">{run.E_pa.toFixed(3)} V</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-400 font-medium">E_pc (katod):</span>
                    <span className="font-mono text-white text-lg">{run.E_pc.toFixed(3)} V</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-cyan-900/20 rounded border border-cyan-500/20">
                    <span className="text-sm text-cyan-400 font-medium">E₁/₂:</span>
                    <span className="font-mono text-white text-lg">{E12.toFixed(3)} V</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">ΔE:</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{(deltaE * 1000).toFixed(0)} mV</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Ipa/Ipc:</span>
                    <span className={`font-mono font-bold ${Math.abs(run.Ipa_Ipc - 1.0) <= 0.05 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {run.Ipa_Ipc.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Qaytariluvchanlik:</span>
                    <span className={`font-mono font-bold ${deltaE <= 0.10 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {deltaE <= 0.10 ? "Qaytar ✓" : "Qaytmas ✗"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-green-400 mb-4 flex justify-between">
                <span>ΔE Qiymatlari (mV) — turli sharoitlarda</span>
                <span className="text-[10px] text-purple-500 font-normal">Ideal: 100 mV</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const val = r.deltaE * 1000
                  const heightPct = Math.min((val / 250) * 100, 100)
                  const isActive = r.id === activeRun
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isBad = val > 150
                  let barClass = "w-full rounded-t transition-all duration-500 z-10 bg-purple-700/40"
                  if (isActive) {
                    if (isBlank) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-gray-500"
                    else if (isStd) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-500"
                    else if (isBad) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    else barClass = "w-full rounded-t transition-all duration-500 z-10 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                  } else {
                    if (isBlank) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-gray-700/40"
                    else if (isStd) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-700/40"
                    else if (isBad) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-700/40"
                  }
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(0)}
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[160px]">
                        <div className="absolute w-[120%] border-t border-dashed border-green-400/50 z-0" style={{ bottom: `${(100/250)*100}%` }}></div>

                        <div 
                          className={barClass}
                          style={{ height: `${Math.max(heightPct, 1)}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-cyan-400' : isBad ? 'text-red-400' : 'text-green-400') : 'text-purple-600'} font-bold`}>
                        {r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 9. NERNST KALKULYATORI */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6">
          <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Nernst tenglamasi interaktiv kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            [Ox]/[Red] nisbatini o'zgartiring — <strong className="text-green-300">potensial E</strong> avtomatik hisoblanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Ox] = [Fe(H₂O)₆³⁺] (mM):</label>
              <input 
                type="number" step="0.1" value={oxConc}
                onChange={(e) => setOxConc(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-green-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Red] = [Fe(H₂O)₆²⁺] (mM):</label>
              <input 
                type="number" step="0.1" value={redConc}
                onChange={(e) => setRedConc(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-green-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">E° (V vs SHE):</label>
              <input 
                type="number" step="0.01" value={nernstE0}
                onChange={(e) => setNernstE0(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-green-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">[Ox]/[Red]:</div>
                <div className="text-xl font-mono font-bold text-green-400">{(oxConc/redConc).toFixed(3)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">E (V vs SHE):</div>
                <div className="text-xl font-mono font-bold text-green-400">{nernstE.toFixed(3)} V</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Holat:</div>
                <div className={`text-xl font-mono font-bold ${
                  oxConc > redConc ? 'text-yellow-400' : oxConc < redConc ? 'text-green-400' : 'text-cyan-400'
                }`}>
                  {oxConc > redConc ? "Oksidlovchi" : oxConc < redConc ? "Qaytaruvchi" : "E = E°"}
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              E = E° + 0.059 × log([Ox]/[Red]) = {nernstE0.toFixed(2)} + 0.059 × log({(oxConc/redConc).toFixed(3)}) = <strong>{nernstE.toFixed(3)} V</strong>
            </p>
          </div>
        </div>

        {/* 10. RANDLES-SEVCIK KALKULYATORI */}
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
            <span>📐</span> Randles-Sevcik kalkulyatori — diffuziya koeffitsienti
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Ip = 2.69×10⁵ × n^(3/2) × A × D^(1/2) × C × v^(1/2) — pik tokidan diffuziya koeffitsientini hisoblash.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Ip (μA):</label>
              <input 
                type="number" step="0.1" value={diffIpa}
                onChange={(e) => setDiffIpa(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">v (mV/s):</label>
              <input 
                type="number" step="1" value={diffScanRate}
                onChange={(e) => setDiffScanRate(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">C (mM):</label>
              <input 
                type="number" step="0.1" value={diffConc}
                onChange={(e) => setDiffConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">A (cm²):</label>
              <input 
                type="number" step="0.01" value={diffArea}
                onChange={(e) => setDiffArea(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Diffuziya koeffitsienti D:</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{calcDiff.toExponential(2)} cm²/s</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Adabiy qiymat:</div>
                <div className="text-xl font-mono font-bold text-green-400">6.0 × 10⁻⁶ cm²/s</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Ip = 2.69×10⁵ × 1^(3/2) × {diffArea} × D^(1/2) × {diffConc}×10⁻³ × ({diffScanRate}/1000)^(1/2)
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Mos kelish:</strong> {Math.abs(calcDiff - 6.0e-6) / 6.0e-6 * 100 < 10 ? "✓ Adabiy qiymatga yaqin" : "⚠ Adabiy qiymatdan farqli — tekshirish kerak"}
            </p>
          </div>
        </div>

        {/* 11. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> CV uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Fe(H₂O)₆]³⁺/²⁺ uchun standart CV sharoitlari. Aerob sharoit va pH nazorati juda muhim!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => {
                const isActive = activePrepStep === s.step
                const btnClass = isActive
                  ? "w-full text-left p-3 rounded-lg border transition-all bg-green-900/40 border-green-500"
                  : "w-full text-left p-3 rounded-lg border transition-all bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                return (
                  <button
                    key={s.step}
                    onClick={() => setActivePrepStep(s.step)}
                    className={btnClass}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? "bg-green-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-green-400">Qadam {current.step}: {current.title}</h3>
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

        {/* 12. CV KALKULYATORI */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6">
          <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> CV dan E₁/₂ va ΔE hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            E_pa va E_pc kiriting — <strong className="text-green-300">E₁/₂</strong> va <strong className="text-green-300">ΔE</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">E_pa (anod pik, V):</label>
              <input 
                type="number" step="0.001" value={customEpa}
                onChange={(e) => setCustomEpa(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-green-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">E_pc (katod pik, V):</label>
              <input 
                type="number" step="0.001" value={customEpc}
                onChange={(e) => setCustomEpc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-green-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">E₁/₂:</div>
                <div className="text-xl font-mono font-bold text-green-400">{calcResult.E12.toFixed(3)} V</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">ΔE:</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{(calcResult.deltaE * 1000).toFixed(0)} mV</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Qaytariluvchanlik:</div>
                <div className={`text-xl font-mono font-bold ${calcResult.isReversible ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.isReversible ? "Qaytar ✓" : "Qaytmas ✗"}
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: E₁/₂ = (E_pa + E_pc) / 2; ΔE = E_pa − E_pc; Ideal: ΔE = 100 mV (sekin qaytar)
            </p>
          </div>
        </div>

        {/* 13. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-green-900/40 to-purple-900/40 border border-green-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> CV ga yaqin tahlil usullari bilan solishtirish
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-green-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-green-300">{m.name}</h3>
                  <div className="text-right">
                    <div className="text-[10px] text-purple-400">To'ldiruvchi</div>
                    <div className="text-lg font-bold text-green-400">{m.complementarity}</div>
                  </div>
                </div>
                <p className="text-xs text-purple-200 mb-3">{m.role}</p>
                <div className="space-y-2 text-[10px]">
                  <div className="flex gap-2">
                    <span className="text-green-400">✓ CV afzalligi:</span>
                    <span className="text-purple-300">{m.cvAdvantage}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-400">✗ CV kamchiligi:</span>
                    <span className="text-purple-300">{m.cvDisadvantage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-green-900/20 border border-green-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-green-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">CV (E₁/₂, ΔE) + UV-Vis (400 nm) + Mössbauer (Fe²⁺/Fe³⁺) + AAS/ICP (Fe%) + Potensiometriya</strong> — beshta metod birgalikda [Fe(H₂O)₆]³⁺/²⁺ juftligini to'liq tavsiflaydi.
            </p>
          </div>
        </div>

        {/* 14. FE KOMPLEKSLARI TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> Fe komplekslarining redoks potensiallari
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Ligand maydon kuchiga qarab E° o'zgaradi: kuchli maydon ligandlari Fe³⁺ ni barqarorlashtiradi va E° ni pasaytiradi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 text-xs uppercase tracking-wider">
                  <th className="py-2 px-3 text-left">Kompleks</th>
                  <th className="py-2 px-3 text-center">E° (V vs SHE)</th>
                  <th className="py-2 px-3 text-center">Konfiguratsiya</th>
                  <th className="py-2 px-3 text-center">Kstab</th>
                  <th className="py-2 px-3 text-center">Rang</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparisonComplexes.map((c, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${c.name.includes("[Fe(H₂O)₆]") ? 'bg-green-900/20' : ''}`}>
                    <td className="py-2 px-3 font-bold text-green-400">{c.name}</td>
                    <td className="py-2 px-3 text-center font-mono text-green-400">{c.E0}</td>
                    <td className="py-2 px-3 text-center text-xs">{c.config}</td>
                    <td className="py-2 px-3 text-center font-mono text-xs">{c.Kstab}</td>
                    <td className="py-2 px-3 text-center text-xs">{c.color}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 15. XULOSA */}
        <div className="bg-gradient-to-r from-green-900/30 via-indigo-900/30 to-purple-900/30 border border-green-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Yakuniy xulosa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-950/30 p-4 rounded-lg border border-green-700/30">
              <div className="text-green-400 text-2xl mb-2">✓</div>
              <h3 className="font-bold text-white mb-1">CV afzalligi</h3>
              <p className="text-xs text-purple-200">E₁/₂ va ΔE orqali redoks xossalarini aniqlaydi. Qaytariluvchanlikni baholaydi. E° = 0.77 V.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Aerob oksidlanish muammosi. pH nazorati kerak. Fe²⁺/Fe³⁺ ni farqlash uchun Mössbauer kerak.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">Mössbauer (Fe²⁺/Fe³⁺), UV-Vis (400 nm), AAS/ICP (Fe%), Potensiometriya — to'liq tahlil uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/elektrokimyo" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Elektrokimyoviy tahlil
            </Link>
            <Link href="/ilmiy/tahlil/elektrokimyo/birikmalar" className="text-sm bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(H₂O)₆]³⁺/²⁺ • Elektrokimyoviy tahlil moduli</p>
          <p className="mt-1">Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC</p>
        </div>
      </footer>
    </main>
  )
}