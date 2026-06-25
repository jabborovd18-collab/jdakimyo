"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Fe(CN)₆]³⁻/⁴⁻ — ELEKTROKIMYOWIY TAHLIL MAHSUS SAHIFASI
// Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC
// Xususiyat: Klassik qaytar redoks juftlik, CN⁻ kuchli maydon
// O'ziga xoslik: Elektrod sirti passivlashishi, Nernst, Randles-Sevcik
// Maqsad: Faqat elektrokimyoviy tahlil bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Fe: 55.845, K: 39.098, C: 12.011, N: 14.007, H: 1.008, O: 15.999
}

const COMPOUND = {
  formulaHTML: "[Fe(CN)<sub>6</sub>]<sup>3−/4−</sup>",
  formulaPlain: "[Fe(CN)6]3-/4-",
  iupac_ox: "Geksatsianoferrat(III)",
  iupac_red: "Geksatsianoferrat(II)",
  formulaOx: "K₃[Fe(CN)₆]",
  formulaRed: "K₄[Fe(CN)₆]·3H₂O",
  commonOx: "Qizil qon tuzi (Red prussiate)",
  commonRed: "Sariq qon tuzi (Yellow prussiate)",
  molarMassOx: 329.24,
  molarMassRed: 422.39,
  casOx: "13746-66-2",
  casRed: "14459-95-1",
  colorOx: "qizil kristallar",
  colorRed: "sariq kristallar",
  
  historicalFact: {
    title: "Qon tuzlari — koordinatsion kimyoning tug'ilishi",
    text: "[Fe(CN)₆]⁴⁻ (ferrotsianid) — 1704-yilda Berlin rang ishlab chiqaruvchisi Diesbach tomonidan tasodifan kashf etilgan. Bu birikma Prussian Blue (Berlin ko'ki, Fe₄[Fe(CN)₆]₃) sintezining asosi bo'ldi. 1752-yilda Macquer uni ilmiy jihatdan o'rgandi. Keyinchalik [Fe(CN)₆]³⁻ (ferritsianid) ham sintez qilindi. Bu ikki birikma elektrokimyoning klassik namunasi bo'lib, birinchi marta qaytar redoks juftlik sifatida o'rganildi. Hozirgi kunda [Fe(CN)₆]³⁻/⁴⁻ juftligi elektrokimyoviy sensorlar, biosensorlar va elektrokimyoviy elementlar uchun standart redoks zond sifatida keng qo'llaniladi. Qiziq fakt: Berlin ko'ki birinchi sintetik pigment bo'lib, Gogol, Van Gog va Hokusay asarlarida ishlatilgan!",
    year: "1704-1752"
  },

  electrochemicalFeature: {
    title: "[Fe(CN)₆]³⁻/⁴⁻ — klassik qaytar redoks juftlik",
    description: "Bu juftlik elektrokimyoda eng ko'p o'rganilgan redoks sistemasi. Bir elektronli qaytar jarayon (Fe³⁺ + e⁻ → Fe²⁺) deyarli ideal qaytar xulq ko'rsatadi.",
    reaction: {
      half: "[Fe(CN)₆]³⁻ + e⁻ ⇌ [Fe(CN)₆]⁴⁻",
      E0: "+0.36 V (vs SHE)",
      E0_AgAgCl: "+0.22 V (vs Ag/AgCl)",
      n: 1,
      deltaE: "59 mV (ideal qaytar sistema, n=1)"
    },
    problem: {
      title: "Elektrod sirtini passivlashtirish",
      description: "[Fe(CN)₆]⁴⁻ elektrod sirtida oksidlanib, Prussian Blue yoki boshqa passiv qatlam hosil qiladi. Bu pik tokini kamaytiradi va ΔE ni oshiradi.",
      impact: "Piklar kengayadi, ΔE ortadi (>80 mV), qaytariluvchanlik buziladi, RSD 5-10% gacha oshadi"
    },
    solution: {
      title: "Elektrod tozalash + KCl elektrolit",
      description: "Elektrod sirtini alumina kukuni (0.05 μm) bilan tozalash va 0.1 M KCl elektrolit ishlatish passivlashishni kamaytiradi.",
      mechanism: "Alumina tozalash elektrod sirtidagi passiv qatlamni olib tashlaydi. KCl elektrolit ion kuchini oshiradi va diffuziyani yaxshilaydi. Azot bilan degazatsiya O₂ ni olib tashlaydi."
    }
  },

  cvParameters: {
    electrode: "Shisha uglerod (GCE) yoki Pt disk elektrod",
    reference: "Ag/AgCl (3M KCl) yoki SHE",
    auxiliary: "Pt sim",
    electrolyte: "0.1 M KCl",
    scanRate: "100 mV/s (standart)",
    potentialWindow: "-0.2 V dan +0.6 V gacha (vs Ag/AgCl)",
    E_pa: "+0.27 V (anod pik, Fe²⁺ → Fe³⁺)",
    E_pc: "+0.21 V (katod pik, Fe³⁺ → Fe²⁺)",
    deltaE: "59 mV (ideal qaytar, n=1)",
    Ipa_Ipc: "≈ 1.0 (qaytar sistema)",
    D: "7.6 × 10⁻⁶ cm²/s (25°C da)"
  },

  theoretical: {
    Fe_ox:  { mass: 55.845,  percent: 16.964, source: "Fe³⁺ markaziy atom", signal: "Oksidlovchi pik (anod)" },
    K_ox:   { mass: 117.294, percent: 35.623, source: "3×K⁺ (tashqi sfera)", signal: "CV da ko'rinmaydi" },
    C:      { mass: 72.066,  percent: 21.886, source: "6×CN⁻ (6×C)", signal: "CV da ko'rinmaydi" },
    N_ox:   { mass: 84.042,  percent: 25.527, source: "6×CN⁻ (6×N)", signal: "CV da ko'rinmaydi" }
  },

  // CV voltamperogramma ma'lumotlari (100 mV/s)
  cvData: [
    { potential: -0.20, current: 0.0 },
    { potential: -0.15, current: -0.2 },
    { potential: -0.10, current: -0.5 },
    { potential: -0.05, current: -0.8 },
    { potential: 0.00, current: -1.0 },
    { potential: 0.05, current: -1.5 },
    { potential: 0.10, current: -3.5 },
    { potential: 0.13, current: -6.0 },
    { potential: 0.16, current: -10.0 },
    { potential: 0.19, current: -13.5 },
    { potential: 0.21, current: -15.5 },
    { potential: 0.23, current: -12.5 },
    { potential: 0.25, current: -5.0 },
    { potential: 0.28, current: 0.5 },
    { potential: 0.32, current: 5.5 },
    { potential: 0.35, current: 10.0 },
    { potential: 0.38, current: 13.0 },
    { potential: 0.40, current: 14.5 },
    { potential: 0.42, current: 15.0 },
    { potential: 0.44, current: 12.0 },
    { potential: 0.48, current: 6.0 },
    { potential: 0.52, current: 2.5 },
    { potential: 0.55, current: 1.2 },
    { potential: 0.60, current: 0.5 }
  ],

  // Skan tezligi bo'yicha ma'lumotlar
  scanRateData: [
    { scanRate: 25,  Ipa: 7.7,  Ipc: -7.6, deltaE: 0.058, E12: 0.240, sqrtV: 0.158 },
    { scanRate: 50,  Ipa: 10.9, Ipc: -10.8, deltaE: 0.060, E12: 0.240, sqrtV: 0.224 },
    { scanRate: 100, Ipa: 15.5, Ipc: -15.4, deltaE: 0.059, E12: 0.240, sqrtV: 0.316 },
    { scanRate: 200, Ipa: 21.9, Ipc: -21.7, deltaE: 0.065, E12: 0.241, sqrtV: 0.447 },
    { scanRate: 500, Ipa: 34.5, Ipc: -34.0, deltaE: 0.075, E12: 0.242, sqrtV: 0.707 },
    { scanRate: 1000, Ipa: 48.5, Ipc: -47.5, deltaE: 0.090, E12: 0.245, sqrtV: 1.000 }
  ],

  experimentalRuns: [
    { id: "CV-24-001", date: "2025-01-15", E_pa: 0.270, E_pc: 0.210, deltaE: 0.060, Ipa_Ipc: 1.02, E12: 0.240, scanRate: 100, note: "Toza [Fe(CN)₆]³⁻, 0.1 M KCl, GCE" },
    { id: "CV-24-002", date: "2025-01-15", E_pa: 0.280, E_pc: 0.200, deltaE: 0.080, Ipa_Ipc: 1.05, E12: 0.240, scanRate: 100, note: "Ikkinchi sikl — sirt passivlashishi" },
    { id: "CV-24-003", date: "2025-01-15", E_pa: 0.270, E_pc: 0.210, deltaE: 0.060, Ipa_Ipc: 1.01, E12: 0.240, scanRate: 50, note: "50 mV/s — sekinroq skan" },
    { id: "CV-24-004", date: "2025-01-15", E_pa: 0.290, E_pc: 0.190, deltaE: 0.100, Ipa_Ipc: 1.08, E12: 0.240, scanRate: 200, note: "200 mV/s — tezroq skan" },
    { id: "CV-24-005", date: "2025-01-16", E_pa: 0.270, E_pc: 0.220, deltaE: 0.050, Ipa_Ipc: 0.98, E12: 0.245, scanRate: 100, note: "Yangi tozalangan GCE elektrod" },
    { id: "CV-24-006", date: "2025-01-16", E_pa: 0.300, E_pc: 0.180, deltaE: 0.120, Ipa_Ipc: 1.15, E12: 0.240, scanRate: 500, note: "Juda tez skan — qaytariluvchanlik buzilgan" },
    { id: "CV-24-007", date: "2025-01-17", E_pa: 0.270, E_pc: 0.210, deltaE: 0.060, Ipa_Ipc: 1.00, E12: 0.240, scanRate: 100, note: "K₃[Fe(CN)₆] + K₄[Fe(CN)₆] aralashmasi (1:1)" },
    { id: "CV-24-008", date: "2025-01-17", E_pa: 0.275, E_pc: 0.215, deltaE: 0.060, Ipa_Ipc: 1.01, E12: 0.245, scanRate: 100, note: "Pt elektrod ishlatildi" },
    { id: "BLANK-01",   date: "2025-01-15", E_pa: 0.000, E_pc: 0.000, deltaE: 0.000, Ipa_Ipc: 0.00, E12: 0.000, scanRate: 100, note: "Blank (0.1 M KCl, elektrod faqat)" },
    { id: "STD-FERR",  date: "2025-01-15", E_pa: 0.270, E_pc: 0.210, deltaE: 0.060, Ipa_Ipc: 1.00, E12: 0.240, scanRate: 100, note: "Standart K₃[Fe(CN)₆] 1 mM" }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Fe(CN)₆]³⁻/⁴⁻ zaharli emas (kuchli bog'langan CN⁻), lekin kislota qo'shilganda HCN ajralishi mumkin! Faqat neytral yoki asosli sharoitda ishlang. Qo'lqop va himoya ko'zoynaklari majburiy.", time: "doimiy", critical: true },
    { step: 2, title: "Eritma tayyorlash (1 mM)", desc: "Analitik tarozida 32.9 mg K₃[Fe(CN)₆] tortilib, 100 mL 0.1 M KCl eritmasida eritiladi. K₄[Fe(CN)₆] uchun 42.2 mg / 100 mL.", time: "5 daq", critical: true },
    { step: 3, title: "Elektrolit tayyorlash", desc: "0.1 M KCl elektrolit tayyorlanadi (0.745 g KCl / 100 mL distillangan suv). Elektrolit ion kuchini ta'minlaydi.", time: "3 daq", critical: true },
    { step: 4, title: "Elektrod tozalash (KRITIK!)", desc: "Shisha uglerod elektrod (GCE) alumina kukuni (0.05 μm) bilan tozalanadi, distillangan suv bilan yuviladi, ultratovushda 1 daqiqa yuviladi.", time: "5 daq", critical: true },
    { step: 5, title: "Elektrokimyoviy cell yig'ish", desc: "Uch elektrodli cell: ishchi (GCE), solishtirma (Ag/AgCl), yordamchi (Pt sim). Eritma azot bilan 10 daqiqa degazatsiya qilinadi.", time: "10 daq", critical: true },
    { step: 6, title: "CV o'lchash (oldinga)", desc: "Potensial -0.2 V dan +0.6 V gacha 100 mV/s da skan qilinadi. Katod pik (Fe³⁺ → Fe²⁺) kuzatiladi.", time: "8 son", critical: false },
    { step: 7, title: "CV o'lchash (orqaga)", desc: "Potensial +0.6 V dan -0.2 V gacha qaytariladi. Anod pik (Fe²⁺ → Fe³⁺) kuzatiladi. ΔE hisoblanadi.", time: "8 son", critical: false },
    { step: 8, title: "Ko'p sikl (stabilite)", desc: "10 ta sikl bajarilib, stabilite tekshiriladi. Ipa/Ipc va ΔE har bir siklda qayd etiladi.", time: "5 daq", critical: false },
    { step: 9, title: "Natijalarni hisoblash", desc: "E_pa, E_pc, ΔE, Ipa/Ipc, E₁/₂ hisoblanadi. Randles-Sevcik bilan D hisoblanadi.", time: "3 daq", critical: false }
  ],

  nernstEquation: {
    title: "Nernst tenglamasi — [Fe(CN)₆]³⁻/⁴⁻ uchun",
    equation: "E = E° + (RT/nF) × ln([Fe(CN)₆³⁻]/[Fe(CN)₆⁴⁻])",
    simplified: "E = 0.36 + 0.059 × log([Ox]/[Red])",
    explanation: "Bu yerda E° = +0.36 V (vs SHE), n = 1 (bir elektron). Agar [Ox] = [Red] bo'lsa, E = E° = +0.36 V."
  },

  randlesSevcik: {
    title: "Randles-Sevcik tenglamasi — diffuziya nazoratidagi pik toki",
    equation: "Ip = 0.446 × n × F × A × C × (n × F × v × D / (R × T))^(1/2)",
    simplified_25C: "Ip = 2.69 × 10⁵ × n^(3/2) × A × D^(1/2) × C × v^(1/2)",
    parameters: {
      n: "1 (elektron soni)",
      F: "96485 C/mol (Faradey doimiysi)",
      A: "Elektrod yuzasi (cm²) — GCE: 0.07 cm²",
      C: "Konsentratsiya (mol/L)",
      v: "Skan tezligi (V/s)",
      D: "Diffuziya koeffitsienti (cm²/s) — [Fe(CN)₆]³⁻: 7.6 × 10⁻⁶",
      R: "8.314 J/(mol·K) (gaz doimiysi)",
      T: "298 K (25°C)"
    }
  },

  // Berlin ko'ki reaksiyasi
  berlinBlue: {
    title: "Berlin ko'ki (Prussian Blue) hosil bo'lishi",
    reaction: "4Fe³⁺ + 3[Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃ ↓ (ko'k cho'kma)",
    turnbull: "3Fe²⁺ + 2[Fe(CN)₆]³⁻ → Fe₃[Fe(CN)₆]₂ ↓ (Turnbull ko'ki)",
    explanation: "[Fe(CN)₆]⁴⁻ Fe³⁺ bilan reaksiyaga kirishib, Berlin ko'ki hosil qiladi. [Fe(CN)₆]³⁻ esa Fe²⁺ bilan Turnbull ko'ki hosil qiladi. Bu reaksiyalar Fe²⁺/Fe³⁺ ni sifat tahlili uchun ishlatiladi."
  },

  relatedMethods: [
    {
      name: "AAS / ICP-OES",
      role: "Fe miqdorini aniqlaydi (16.96% Fe)",
      cvAdvantage: "CV redoks xossalarini ko'rsatadi",
      cvDisadvantage: "AAS/ICP miqdoriy, CV sifat",
      complementarity: "95%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "[Fe(CN)₆]³⁻ (420 nm, sariq) va [Fe(CN)₆]⁴⁻ (320 nm, rangsiz)",
      cvAdvantage: "UV-Vis rang va konsentratsiyani ko'rsatadi",
      cvDisadvantage: "CV redoks potensialni, UV-Vis spektrni",
      complementarity: "92%"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      role: "Kristall strukturani ko'rsatadi (K₃ va K₄ farqlanadi)",
      cvAdvantage: "XRD strukturani, CV redoks xossalarini ko'rsatadi",
      cvDisadvantage: "Birgalikda to'liq validatsiya",
      complementarity: "88%"
    },
    {
      name: "Mössbauer spektroskopiya",
      role: "Fe²⁺ (δ = 0.0 mm/s) va Fe³⁺ (δ = -0.13 mm/s) farqlanadi",
      cvAdvantage: "Mössbauer oksidlanish holatini, CV redoks potensialni ko'rsatadi",
      cvDisadvantage: "Birgalikda to'liq tavsif",
      complementarity: "94%"
    },
    {
      name: "IQ spektroskopiya",
      role: "CN⁻ cho'zilishi (2040-2120 cm⁻¹) — Fe²⁺/Fe³⁺ farqlanadi",
      cvAdvantage: "IQ CN⁻ bog'ini ko'rsatadi",
      cvDisadvantage: "IQ miqdoriy emas",
      complementarity: "90%"
    }
  ],

  // Boshqa Fe komplekslari bilan taqqoslash
  comparisonComplexes: [
    {
      name: "[Fe(H₂O)₆]³⁺/²⁺",
      E0: "+0.77 V",
      config: "d⁵/d⁶ (yuqori spin)",
      Kstab: "—",
      color: "sariq/och yashil",
      notes: "Kuchsiz maydon — Fe²⁺ barqaror, E° yuqori"
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
  // Randles-Sevcik: Ip = 2.69e5 * n^(3/2) * A * D^(1/2) * C * v^(1/2)
  const n = 1
  const n32 = Math.pow(n, 1.5)
  const A = area // cm²
  const C = concentration_mM * 1e-3 // mol/L
  const v = scanRate // V/s
  const sqrtV = Math.sqrt(v)
  // D = (Ip / (2.69e5 * n^1.5 * A * C * v^0.5))^2
  const factor = 2.69e5 * n32 * A * C * sqrtV
  const D = Math.pow(Ipa / factor, 2)
  return D
}

function calculateNernstPotential(oxConc, redConc, E0 = 0.36) {
  if (redConc <= 0) return Infinity
  return E0 + 0.059 * Math.log10(oxConc / redConc)
}

function getStatusColor(deltaE) {
  if (deltaE <= 0.07) return "text-green-400"
  if (deltaE <= 0.10) return "text-yellow-400"
  return "text-red-400"
}

export default function FeCN6Page() {
  const [activeRun, setActiveRun] = useState("CV-24-001")
  const [customEpa, setCustomEpa] = useState(0.27)
  const [customEpc, setCustomEpc] = useState(0.21)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showNernstModal, setShowNernstModal] = useState(false)
  const [showPassivationModal, setShowPassivationModal] = useState(true)
  
  // Nernst kalkulyator
  const [oxConc, setOxConc] = useState(1.0)
  const [redConc, setRedConc] = useState(1.0)
  const [nernstE0, setNernstE0] = useState(0.36)
  
  // Diffuziya kalkulyatori
  const [diffIpa, setDiffIpa] = useState(15.5)
  const [diffScanRate, setDiffScanRate] = useState(100)
  const [diffConc, setDiffConc] = useState(1.0)
  const [diffArea, setDiffArea] = useState(0.07)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaE = calculateDeltaE(run.E_pa, run.E_pc)
  const E12 = calculateE12(run.E_pa, run.E_pc)
  const statusColor = getStatusColor(deltaE)

  const calcResult = useMemo(() => ({
    E12: calculateE12(customEpa, customEpc),
    deltaE: calculateDeltaE(customEpa, customEpc),
    isReversible: calculateDeltaE(customEpa, customEpc) <= 0.07
  }), [customEpa, customEpc])

  const nernstE = useMemo(() => 
    calculateNernstPotential(oxConc, redConc, nernstE0),
    [oxConc, redConc, nernstE0]
  )

  const calcDiff = useMemo(() => 
    calculateDiffusionCoefficient(diffIpa, diffScanRate / 1000, diffConc, diffArea),
    [diffIpa, diffScanRate, diffConc, diffArea]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-cyan-950/20 to-blue-950 text-white">
      
      {/* PASSIVLASHISH OGOHLANTIRISH MODALI */}
      {showPassivationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-yellow-950 to-red-950 border-2 border-yellow-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> ELEKTROD SIRTINI PASSIVLASHTIRISH!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-yellow-300">[Fe(CN)₆]⁴⁻</strong> elektrod sirtida oksidlanib, <strong className="text-yellow-300">Prussian Blue</strong> yoki boshqa passiv qatlam hosil qiladi!
            </p>
            
            <div className="bg-yellow-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">❌ Muammo:</div>
                  <div className="text-purple-200">
                    [Fe(CN)₆]⁴⁻ → [Fe(CN)₆]³⁻ oksidlanishi elektrod sirtida <strong>Prussian Blue</strong> hosil qiladi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    Natija: ΔE ortadi ({'>'}80 mV), piklar kengayadi, qaytariluvchanlik buziladi.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">✅ Yechim:</div>
                  <div className="text-purple-200">
                    <strong>1.</strong> Alumina (0.05 μm) bilan elektrod tozalash<br/>
                    <strong>2.</strong> 0.1 M KCl elektrolit<br/>
                    <strong>3.</strong> Azot bilan degazatsiya
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">Muhim:</strong> Yangi tozalangan elektrod ishlatilsa, ΔE = 59 mV (ideal). Eski elektrod ishlatilsa, ΔE {'>'} 80 mV bo'ladi va natija noto'g'ri bo'ladi!
              </p>
            </div>

            <button 
              onClick={() => setShowPassivationModal(false)}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
            <span className="text-yellow-400 font-semibold">[Fe(CN)₆]³⁻/⁴⁻</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Fe³⁺/Fe²⁺</span>
                <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Qaytar redoks</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">E° = +0.36 V</span>
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">n = 1</span>
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
        <div className="bg-gradient-to-r from-yellow-900/40 to-purple-900/40 border border-yellow-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (elektrokimyoviy tahlil uchun)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Fe(CN)₆]³⁻/⁴⁻</strong> — elektrokimyoning eng klassik redoks juftligi. CN⁻ kuchli maydon ligand bo'lgani uchun Fe³⁺/Fe²⁺ juftligi <strong className="text-yellow-300">deyarli ideal qaytar</strong> xulq ko'rsatadi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-yellow-500 text-xs md:text-sm">
                <li><strong className="text-white">Bir elektronli qaytar</strong>: Fe³⁺ + e⁻ ⇌ Fe²⁺</li>
                <li>E° = <strong className="text-yellow-400">+0.36 V</strong> (vs SHE)</li>
                <li>ΔE = <strong className="text-green-300">59 mV</strong> (ideal qaytar, n=1)</li>
                <li>Ipa/Ipc ≈ <strong className="text-green-300">1.0</strong></li>
                <li>Elektrokimyoviy <strong className="text-yellow-300">ichki standart</strong> sifatida ishlatiladi</li>
                <li>Elektrod sirti passivlashishi mumkin — tozalash kerak</li>
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

        {/* 2. PASSIVLASHISH MUAMMOSI */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-red-900/40 border-2 border-yellow-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span> {COMPOUND.electrochemicalFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.electrochemicalFeature.description}
          </p>

          <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
            <div className="text-center text-lg font-mono text-yellow-400 mb-2">
              {COMPOUND.electrochemicalFeature.reaction.half}
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-yellow-400">E°(SHE) = {COMPOUND.electrochemicalFeature.reaction.E0}</span>
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
                  <div className="text-green-300 font-bold">Alumina + KCl:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.electrochemicalFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowPassivationModal(true)}
            className="w-full mt-4 bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
          >
            ⚠️ Passivlashish haqida batafsil →
          </button>
        </div>

        {/* 3. CV PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> CV o'lchash parametrlari
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            [Fe(CN)₆]³⁻/⁴⁻ uchun standart CV sharoitlari. GCE elektrod, 0.1 M KCl elektrolit, 100 mV/s skan tezligi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Ishchi elektrod</div>
              <div className="text-sm font-bold text-yellow-400">GCE</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">E_pa (anod)</div>
              <div className="text-sm font-mono font-bold text-yellow-400">{COMPOUND.cvParameters.E_pa}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">E_pc (katod)</div>
              <div className="text-sm font-mono font-bold text-green-400">{COMPOUND.cvParameters.E_pc}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">ΔE</div>
              <div className="text-sm font-mono font-bold text-green-400">{COMPOUND.cvParameters.deltaE}</div>
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

        {/* 4. NAZARIY TARKIB */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📐</span> Nazariy element tarkibi (K₃[Fe(CN)₆] uchun)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 text-xs uppercase tracking-wider">
                  <th className="py-3 text-left pl-2">Element</th>
                  <th className="py-3 text-center">Massa</th>
                  <th className="py-3 text-center text-yellow-400">% (m/m)</th>
                  <th className="py-3 text-center">Manba</th>
                  <th className="py-3 text-left pl-4">CV signali</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => {
                  const elColor = el === "Fe_ox" ? "text-yellow-400" : el === "K_ox" ? "text-amber-400" : "text-purple-400"
                  const rowClass = el === "Fe_ox" ? "" : "opacity-60"
                  const trClass = "border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors " + rowClass
                  const tdElClass = "py-3 pl-2 font-bold " + elColor
                  return (
                    <tr key={el} className={trClass}>
                      <td className={tdElClass}>{el.replace("_ox", "")}</td>
                      <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                      <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                      <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                      <td className="py-3 pl-4 text-[10px] text-purple-400">{d.signal}</td>
                    </tr>
                  )
                })}
                <tr className="bg-yellow-900/20 font-bold border-t border-yellow-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMassOx.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-yellow-300">CV: Fe³⁺/Fe²⁺ redoks juftligi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. CV VOLTAMPEROGRAMMA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📈</span> CV voltamperogramma (100 mV/s)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            [Fe(CN)₆]³⁻/⁴⁻ uchun tipik siklik voltamperogramma. Qaytar sistema — anod va katod piklar simmetrik, ΔE = 59 mV.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 300" className="w-full h-full overflow-visible">
              {/* Grid */}
              {[-0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((v, i) => (
                <g key={i}>
                  <line x1="60" y1={30 + ((v + 0.2)/0.8)*240} x2="580" y2={30 + ((v + 0.2)/0.8)*240} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="55" y={34 + ((v + 0.2)/0.8)*240} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}V</text>
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
                fill="none" stroke="#fbbf24" strokeWidth="2"
                points={COMPOUND.cvData.map(p => {
                  const x = 60 + ((p.potential + 0.2)/0.8)*520
                  const y = 30 + ((15 - p.current)/30)*240
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* E_pa marker */}
              <line x1={60 + ((0.42 + 0.2)/0.8)*520} y1="30" x2={60 + ((0.42 + 0.2)/0.8)*520} y2="270" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" />
              <text x={60 + ((0.42 + 0.2)/0.8)*520} y="20" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">E_pa = +0.27V</text>

              {/* E_pc marker */}
              <line x1={60 + ((0.21 + 0.2)/0.8)*520} y1="30" x2={60 + ((0.21 + 0.2)/0.8)*520} y2="270" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2" />
              <text x={60 + ((0.21 + 0.2)/0.8)*520 - 5} y="20" textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="bold">E_pc = +0.21V</text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-yellow-500"></span> CV egri chiziq</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-red-500"></span> E_pa (anod pik)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-green-500"></span> E_pc (katod pik)</span>
          </div>
        </div>

        {/* 6. SKAN TEZLIGI TA'SIRI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📊</span> Skan tezligi ta'siri (Randles-Sevcik)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Qaytar sistemada pik toki skan tezligining kvadrat ildiziga proporsional: <strong className="text-yellow-400">Ip ∝ v^(1/2)</strong>. Bu diffuziya nazoratidagi jarayonni ko'rsatadi.
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
                      <td className="py-2 px-3 font-mono text-yellow-400 font-bold">{d.scanRate}</td>
                      <td className="py-2 px-3 text-center font-mono">{d.sqrtV.toFixed(3)}</td>
                      <td className="py-2 px-3 text-center font-mono text-yellow-400">{d.Ipa.toFixed(1)}</td>
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
            💡 <strong>Eslatma:</strong> Sekin skan tezligida ΔE 59 mV ga yaqin (ideal qaytar). Tez skan da ΔE ortadi (qaytariluvchanlik kamayadi).
          </p>
        </div>

        {/* 7. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> CV yugurishlari — turli sharoitlarda
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli skan tezliklari va sharoitlarda o'lchangan CV natijalari. ΔE = 59 mV bo'lishi kerak (ideal qaytar).
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isActive = activeRun === r.id
              const btnClass = isActive
                ? "bg-yellow-600 border-yellow-500 text-white shadow-lg shadow-yellow-500/20"
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
                  <div className="flex justify-between items-center p-2 bg-yellow-900/20 rounded border border-yellow-500/20">
                    <span className="text-sm text-yellow-400 font-medium">E_pa (anod):</span>
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
                    <span className={`font-mono font-bold ${deltaE <= 0.07 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {deltaE <= 0.07 ? "Qaytar ✓" : "Qaytmas ✗"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-yellow-400 mb-4 flex justify-between">
                <span>ΔE Qiymatlari (mV) — turli sharoitlarda</span>
                <span className="text-[10px] text-purple-500 font-normal">Ideal: 59 mV</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const val = r.deltaE * 1000
                  const heightPct = Math.min((val / 150) * 100, 100)
                  const isActive = r.id === activeRun
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isBad = val > 80
                  let barClass = "w-full rounded-t transition-all duration-500 z-10 bg-purple-700/40"
                  if (isActive) {
                    if (isBlank) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-gray-500"
                    else if (isStd) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-500"
                    else if (isBad) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    else barClass = "w-full rounded-t transition-all duration-500 z-10 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
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
                        <div className="absolute w-[120%] border-t border-dashed border-yellow-400/50 z-0" style={{ bottom: `${(59/150)*100}%` }}></div>

                        <div 
                          className={barClass}
                          style={{ height: `${Math.max(heightPct, 1)}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-cyan-400' : isBad ? 'text-red-400' : 'text-yellow-400') : 'text-purple-600'} font-bold`}>
                        {r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 8. NERNST KALKULYATORI */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6">
          <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Nernst tenglamasi interaktiv kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            [Ox]/[Red] nisbatini o'zgartiring — <strong className="text-yellow-300">potensial E</strong> avtomatik hisoblanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Ox] = [Fe(CN)₆³⁻] (mM):</label>
              <input 
                type="number" step="0.1" value={oxConc}
                onChange={(e) => setOxConc(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Red] = [Fe(CN)₆⁴⁻] (mM):</label>
              <input 
                type="number" step="0.1" value={redConc}
                onChange={(e) => setRedConc(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">E° (V vs SHE):</label>
              <input 
                type="number" step="0.01" value={nernstE0}
                onChange={(e) => setNernstE0(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">[Ox]/[Red]:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{(oxConc/redConc).toFixed(3)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">E (V vs SHE):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{nernstE.toFixed(3)} V</div>
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

        {/* 9. RANDLES-SEVCIK KALKULYATORI */}
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
                <div className="text-xl font-mono font-bold text-green-400">7.6 × 10⁻⁶ cm²/s</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Ip = 2.69×10⁵ × 1^(3/2) × {diffArea} × D^(1/2) × {diffConc}×10⁻³ × ({diffScanRate}/1000)^(1/2)
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Mos kelish:</strong> {Math.abs(calcDiff - 7.6e-6) / 7.6e-6 * 100 < 10 ? "✓ Adabiy qiymatga yaqin" : "⚠ Adabiy qiymatdan farqli — tekshirish kerak"}
            </p>
          </div>
        </div>

        {/* 10. BERLIN KO'KI */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
            <span>🎨</span> Berlin ko'ki (Prussian Blue) hosil bo'lishi
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            [Fe(CN)₆]⁴⁻ Fe³⁺ bilan reaksiyaga kirishib, <strong className="text-blue-300">Berlin ko'ki</strong> hosil qiladi. Bu sifat tahlili uchun klassik usul.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-950/40 rounded-xl p-4 border border-blue-700/30">
              <h4 className="text-blue-400 font-bold text-sm mb-2">Berlin ko'ki:</h4>
              <div className="text-center text-sm font-mono text-blue-400 mb-2">
                4Fe³⁺ + 3[Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃ ↓
              </div>
              <p className="text-xs text-purple-200">Ko'k cho'kma — Fe²⁺ ni sifat aniqlash</p>
            </div>
            <div className="bg-blue-950/40 rounded-xl p-4 border border-blue-700/30">
              <h4 className="text-blue-400 font-bold text-sm mb-2">Turnbull ko'ki:</h4>
              <div className="text-center text-sm font-mono text-blue-400 mb-2">
                3Fe²⁺ + 2[Fe(CN)₆]³⁻ → Fe₃[Fe(CN)₆]₂ ↓
              </div>
              <p className="text-xs text-purple-200">Ko'k cho'kma — Fe³⁺ ni sifat aniqlash</p>
            </div>
          </div>
        </div>

        {/* 11. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> CV uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Fe(CN)₆]³⁻/⁴⁻ uchun standart CV sharoitlari. Elektrod tozalash juda muhim!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => {
                const isActive = activePrepStep === s.step
                const btnClass = isActive
                  ? "w-full text-left p-3 rounded-lg border transition-all bg-yellow-900/40 border-yellow-500"
                  : "w-full text-left p-3 rounded-lg border transition-all bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                return (
                  <button
                    key={s.step}
                    onClick={() => setActivePrepStep(s.step)}
                    className={btnClass}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? "bg-yellow-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-yellow-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6">
          <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> CV dan E₁/₂ va ΔE hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            E_pa va E_pc kiriting — <strong className="text-yellow-300">E₁/₂</strong> va <strong className="text-yellow-300">ΔE</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">E_pa (anod pik, V):</label>
              <input 
                type="number" step="0.001" value={customEpa}
                onChange={(e) => setCustomEpa(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">E_pc (katod pik, V):</label>
              <input 
                type="number" step="0.001" value={customEpc}
                onChange={(e) => setCustomEpc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">E₁/₂:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{calcResult.E12.toFixed(3)} V</div>
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
              Formula: E₁/₂ = (E_pa + E_pc) / 2; ΔE = E_pa − E_pc; Ideal: ΔE = 59/n mV
            </p>
          </div>
        </div>

        {/* 13. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-purple-900/40 border border-yellow-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> CV ga yaqin tahlil usullari bilan solishtirish
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-yellow-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-yellow-300">{m.name}</h3>
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

          <div className="mt-5 bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-yellow-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">CV (E₁/₂, ΔE) + UV-Vis (420 nm, 320 nm) + Mössbauer (Fe²⁺/Fe³⁺) + AAS/ICP (Fe%) + XRD (kristall)</strong> — beshta metod birgalikda [Fe(CN)₆]³⁻/⁴⁻ juftligini to'liq tavsiflaydi.
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
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${c.name.includes("[Fe(CN)₆]") ? 'bg-yellow-900/20' : ''}`}>
                    <td className="py-2 px-3 font-bold text-yellow-400">{c.name}</td>
                    <td className="py-2 px-3 text-center font-mono text-yellow-400">{c.E0}</td>
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
              <p className="text-xs text-purple-200">E₁/₂ va ΔE orqali redoks xossalarini aniqlaydi. Qaytariluvchanlikni baholaydi. Elektrokimyoviy standart sifatida ishlatiladi.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Elektrod sirti passivlashishi mumkin. Fe²⁺/Fe³⁺ ni farqlash uchun Mössbauer kerak. Miqdoriy emas.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">Mössbauer (Fe²⁺/Fe³⁺), UV-Vis (420 nm), AAS/ICP (Fe%), XRD — to'liq tahlil uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/elektrokimyo" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Elektrokimyoviy tahlil
            </Link>
            <Link href="/ilmiy/tahlil/elektrokimyo/birikmalar" className="text-sm bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(CN)₆]³⁻/⁴⁻ • Elektrokimyoviy tahlil moduli</p>
          <p className="mt-1">Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC, Diesbach (1704)</p>
        </div>
      </footer>
    </main>
  )
}