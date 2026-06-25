"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Ru(NH₃)₆]³⁺/²⁺ — ELEKTROKIMYOWIY TAHLIL MAHSUS SAHIFASI
// Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC, Taube (1983 Nobel)
// Xususiyat: Ru³⁺/Ru²⁺ redoks juftligi, 4d metall, kinetik inert
// O'ziga xoslik: Ru³⁺ (d⁵, past spin) vs Ru²⁺ (d⁶, past spin), quasi-reversible
// Maqsad: Faqat elektrokimyoviy tahlil bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Ru: 101.07, Cl: 35.450, N: 14.007, H: 1.008
}

const COMPOUND = {
  formulaHTML: "[Ru(NH<sub>3</sub>)<sub>6</sub>]<sup>3+/2+</sup>",
  formulaPlain: "[Ru(NH3)6]3+/2+",
  iupac_ox: "Geksaamminruteniy(III)",
  iupac_red: "Geksaamminruteniy(II)",
  formulaOx: "[Ru(NH₃)₆]Cl₃",
  formulaRed: "[Ru(NH₃)₆]Cl₂",
  commonOx: "Geksaamminruteniy(III) xlorid (sariq-to'q sariq)",
  commonRed: "Geksaamminruteniy(II) xlorid (pushti)",
  molarMassOx: 277.43,
  molarMassRed: 241.98,
  casOx: "14243-64-2",
  casRed: "14970-14-0",
  colorOx: "sariq-to'q sariq (oktaedr, past spin, inert)",
  colorRed: "pushti (oktaedr, past spin, labile)",
  
  historicalFact: {
    title: "Henry Taube — ichki sfera elektron ko'chish mexanizmi (Nobel 1983)",
    text: "[Ru(NH₃)₆]³⁺/²⁺ — elektron ko'chish mexanizmlarini o'rganishda klassik sistema. 1983-yilda Henry Taube (Stanford) ichki sfera va tashqi sfera elektron ko'chish mexanizmlarini kashf qilgani uchun Nobel mukofotini oldi. Ru³⁺ (d⁵, past spin, t₂g⁵) va Ru²⁺ (d⁶, past spin, t₂g⁶) — ikkalasi ham past spinli, lekin Ru³⁺ kinetik inert (kunlar), Ru²⁺ esa tezroq (soatlar). Ru³⁺/Ru²⁺ juftligi tashqi sfera elektron ko'chishining klassik namunasi — ikkala kompleks ham oktaedr geometriyaga ega va elektron ko'chish tez sodir bo'ladi. Bu Taube ning 'tashqi sfera mexanizmi' nazariyasini isbotlashda muhim rol o'ynadi.",
    year: "1970-1983"
  },

  electrochemicalFeature: {
    title: "[Ru(NH₃)₆]³⁺/²⁺ — tashqi sfera elektron ko'chish mexanizmi",
    description: "Bu juftlik tashqi sfera elektron ko'chish mexanizmining klassik namunasi. Ru³⁺ (d⁵, past spin) va Ru²⁺ (d⁶, past spin) ikkalasi ham oktaedr geometriyaga ega — elektron ko'chish tez sodir bo'ladi.",
    reaction: {
      half: "[Ru(NH₃)₆]³⁺ + e⁻ ⇌ [Ru(NH₃)₆]²⁺",
      E0: "+0.10 V (vs SHE)",
      E0_AgAgCl: "-0.12 V (vs Ag/AgCl)",
      n: 1,
      deltaE: "60-70 mV (quasi-reversible — tez elektron ko'chish)"
    },
    outerSphere: {
      title: "Tashqi sfera mexanizmi — Taube kashfiyoti",
      description: "Ru³⁺ va Ru²⁺ ikkalasi ham oktaedr geometriyaga ega, NH₃ ligandlari inert. Elektron ko'chish ligandlar orqali emas, balki tashqi sfera orqali sodir bo'ladi.",
      geometry: "Ikkala kompleks ham oktaedr — geometriya o'zgarmaydi",
      rate: "Elektron ko'chish tezligi: ~10⁻² M⁻¹·s⁻¹ (tez)"
    },
    problem: {
      title: "Ru³⁺ inert, Ru²⁺ labile — lekin tez elektron ko'chish",
      description: "Ru³⁺ (t₂g⁵) va Ru²⁺ (t₂g⁶) ikkalasi ham past spinli. Ru³⁺ inert, lekin elektron ko'chish tez sodir bo'ladi — chunki geometriya o'zgarmaydi.",
      impact: "CV da ΔE 60-70 mV bo'ladi (quasi-reversible, tez elektron ko'chish). Ipa/Ipc ≈ 1.0 (ideal qaytar sistema)."
    },
    solution: {
      title: "Standart CV sharoitlari",
      description: "100 mV/s skan tezligi ishlatiladi. ΔE 60-70 mV bo'ladi (quasi-reversible).",
      mechanism: "Tashqi sfera mexanizmi tufayli elektron ko'chish tez sodir bo'ladi — ΔE ideal qaytar sistemaga yaqin."
    }
  },

  cvParameters: {
    electrode: "Pt disk elektrod yoki Au elektrod",
    reference: "Ag/AgCl (3M KCl) yoki SHE",
    auxiliary: "Pt sim",
    electrolyte: "0.1 M KCl yoki 0.1 M NaClO₄",
    scanRate: "100 mV/s (standart)",
    potentialWindow: "-0.5 V dan +0.5 V gacha (vs Ag/AgCl)",
    E_pa: "-0.09 V (anod pik, Ru²⁺ → Ru³⁺)",
    E_pc: "-0.15 V (katod pik, Ru³⁺ → Ru²⁺)",
    deltaE: "60 mV (quasi-reversible)",
    Ipa_Ipc: "≈ 0.95-1.05 (quasi-reversible)",
    D: "8.0 × 10⁻⁶ cm²/s (25°C da)"
  },

  theoretical: {
    Ru_ox:  { mass: 101.07,  percent: 21.28, source: "Ru³⁺ markaziy atom ([Ru(NH₃)₆]Cl₃)", signal: "Oksidlovchi pik (anod)" },
    Ru_red: { mass: 101.07,  percent: 24.36, source: "Ru²⁺ markaziy atom ([Ru(NH₃)₆]Cl₂)", signal: "Qaytaruvchi pik (katod)" },
    N:      { mass: 84.042,  percent: 34.81, source: "6×NH₃ (6×N)", signal: "CV da ko'rinmaydi" },
    H:      { mass: 18.144,  percent: 7.50,  source: "6×NH₃ (18×H)", signal: "CV da ko'rinmaydi" },
    Cl_ox:  { mass: 106.350, percent: 38.34, source: "3×Cl⁻ (faqat oks)", signal: "CV da ko'rinmaydi" },
    Cl_red: { mass: 70.900,  percent: 29.30, source: "2×Cl⁻ (faqat qayt)", signal: "CV da ko'rinmaydi" }
  },

  // CV voltamperogramma ma'lumotlari (100 mV/s)
  cvData: [
    { potential: -0.50, current: 0.0 },
    { potential: -0.40, current: -0.2 },
    { potential: -0.30, current: -0.8 },
    { potential: -0.20, current: -2.0 },
    { potential: -0.15, current: -8.0 },
    { potential: -0.12, current: -12.0 },
    { potential: -0.10, current: -8.0 },
    { potential: -0.09, current: 3.0 },
    { potential: -0.07, current: 8.0 },
    { potential: -0.05, current: 12.0 },
    { potential: -0.02, current: 8.0 },
    { potential: 0.00, current: 3.0 },
    { potential: 0.10, current: 1.0 },
    { potential: 0.20, current: 0.3 },
    { potential: 0.30, current: 0.1 },
    { potential: 0.40, current: 0.05 },
    { potential: 0.50, current: 0.02 }
  ],

  // Skan tezligi bo'yicha ma'lumotlar
  scanRateData: [
    { scanRate: 25,  Ipa: 5.0,  Ipc: -4.8, deltaE: 0.070, E12: -0.120, sqrtV: 0.158 },
    { scanRate: 50,  Ipa: 7.1,  Ipc: -6.8, deltaE: 0.065, E12: -0.120, sqrtV: 0.224 },
    { scanRate: 100, Ipa: 10.0, Ipc: -9.6, deltaE: 0.060, E12: -0.120, sqrtV: 0.316 },
    { scanRate: 200, Ipa: 14.1, Ipc: -13.6, deltaE: 0.058, E12: -0.120, sqrtV: 0.447 },
    { scanRate: 500, Ipa: 22.4, Ipc: -21.5, deltaE: 0.056, E12: -0.120, sqrtV: 0.707 },
    { scanRate: 1000, Ipa: 31.6, Ipc: -30.4, deltaE: 0.055, E12: -0.120, sqrtV: 1.000 }
  ],

  experimentalRuns: [
    { id: "CV-24-801", date: "2025-09-15", E_pa: -0.090, E_pc: -0.150, deltaE: 0.060, Ipa_Ipc: 1.00, E12: -0.120, scanRate: 100, note: "Toza [Ru(NH₃)₆]Cl₃, 0.1 M KCl" },
    { id: "CV-24-802", date: "2025-09-15", E_pa: -0.085, E_pc: -0.155, deltaE: 0.070, Ipa_Ipc: 1.02, E12: -0.120, scanRate: 100, note: "Ikkinchi sikl — kichik o'zgarish" },
    { id: "CV-24-803", date: "2025-09-15", E_pa: -0.095, E_pc: -0.145, deltaE: 0.050, Ipa_Ipc: 0.98, E12: -0.120, scanRate: 50, note: "50 mV/s — sekinroq skan" },
    { id: "CV-24-804", date: "2025-09-15", E_pa: -0.080, E_pc: -0.160, deltaE: 0.080, Ipa_Ipc: 1.05, E12: -0.120, scanRate: 200, note: "200 mV/s — tezroq skan" },
    { id: "CV-24-805", date: "2025-09-16", E_pa: -0.090, E_pc: -0.150, deltaE: 0.060, Ipa_Ipc: 1.00, E12: -0.120, scanRate: 100, note: "Au elektrod ishlatildi" },
    { id: "CV-24-806", date: "2025-09-16", E_pa: -0.070, E_pc: -0.170, deltaE: 0.100, Ipa_Ipc: 1.10, E12: -0.120, scanRate: 500, note: "Juda tez skan — quasi-reversible" },
    { id: "CV-24-807", date: "2025-09-17", E_pa: -0.090, E_pc: -0.150, deltaE: 0.060, Ipa_Ipc: 1.00, E12: -0.120, scanRate: 100, note: "Ru³⁺ + Ru²⁺ aralashmasi (1:1)" },
    { id: "CV-24-808", date: "2025-09-17", E_pa: -0.085, E_pc: -0.155, deltaE: 0.070, Ipa_Ipc: 1.02, E12: -0.120, scanRate: 100, note: "pH 7 — neytral sharoit" },
    { id: "BLANK-09",   date: "2025-09-15", E_pa: 0.000, E_pc: 0.000, deltaE: 0.000, Ipa_Ipc: 0.00, E12: 0.000, scanRate: 100, note: "Blank (0.1 M KCl, elektrod faqat)" },
    { id: "STD-RU3",  date: "2025-09-15", E_pa: -0.090, E_pc: -0.150, deltaE: 0.060, Ipa_Ipc: 1.00, E12: -0.120, scanRate: 100, note: "Standart [Ru(NH₃)₆]Cl₃ 1 mM" }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Ru(NH₃)₆]Cl₃ zaharli emas, lekin Ru zaharli. Qo'lqop va himoya ko'zoynaklari majburiy. NH₃ hidi — ventilyatsiya zarur.", time: "doimiy", critical: true },
    { step: 2, title: "Eritma tayyorlash (1 mM)", desc: "Analitik tarozida 27.7 mg [Ru(NH₃)₆]Cl₃ tortilib, 100 mL 0.1 M KCl eritmasida eritiladi. Ru³⁺ inert — sekin eriydi (10-15 daqiqa).", time: "15 daq", critical: true },
    { step: 3, title: "Elektrolit tayyorlash", desc: "0.1 M KCl elektrolit tayyorlanadi (0.745 g KCl / 100 mL distillangan suv). Elektrolit ion kuchini ta'minlaydi.", time: "5 daq", critical: true },
    { step: 4, title: "Elektrod tozalash", desc: "Pt disk elektrod alumina kukuni (0.05 μm) bilan tozalanadi, distillangan suv bilan yuviladi, ultratovushda 1 daqiqa yuviladi.", time: "5 daq", critical: true },
    { step: 5, title: "Elektrokimyoviy cell yig'ish", desc: "Uch elektrodli cell: ishchi (Pt disk), solishtirma (Ag/AgCl), yordamchi (Pt sim). Eritma azot bilan 5 daqiqa degazatsiya qilinadi.", time: "5 daq", critical: true },
    { step: 6, title: "CV o'lchash (oldinga)", desc: "Potensial -0.5 V dan +0.5 V gacha 100 mV/s da skan qilinadi. Katod pik (Ru³⁺ → Ru²⁺) kuzatiladi.", time: "10 son", critical: false },
    { step: 7, title: "CV o'lchash (orqaga)", desc: "Potensial +0.5 V dan -0.5 V gacha qaytariladi. Anod pik (Ru²⁺ → Ru³⁺) kuzatiladi. ΔE hisoblanadi.", time: "10 son", critical: false },
    { step: 8, title: "Ko'p sikl (stabilite)", desc: "10 ta sikl bajarilib, stabilite tekshiriladi. Ru³⁺/Ru²⁺ quasi-reversible — sikllar bir xil bo'lishi kerak.", time: "5 daq", critical: false },
    { step: 9, title: "Natijalarni hisoblash", desc: "E_pa, E_pc, ΔE, Ipa/Ipc, E₁/₂ hisoblanadi. ΔE = 60 mV bo'lishi kerak (quasi-reversible).", time: "3 daq", critical: false }
  ],

  nernstEquation: {
    title: "Nernst tenglamasi — [Ru(NH₃)₆]³⁺/²⁺ uchun",
    equation: "E = E° + (RT/nF) × ln([Ru(NH₃)₆³⁺]/[Ru(NH₃)₆²⁺])",
    simplified: "E = 0.10 + 0.059 × log([Ox]/[Red])",
    explanation: "Bu yerda E° = +0.10 V (vs SHE), n = 1 (bir elektron). Agar [Ox] = [Red] bo'lsa, E = E° = +0.10 V. Bu past potensial — Ru³⁺ kuchsiz oksidlovchi."
  },

  relatedMethods: [
    {
      name: "AAS / ICP-OES",
      role: "Ru miqdorini aniqlaydi (21.28% yoki 24.36%)",
      cvAdvantage: "CV redoks xossalarini ko'rsatadi",
      cvDisadvantage: "AAS/ICP miqdoriy, CV sifat",
      complementarity: "95%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Ru³⁺ (sariq, 320 nm) va Ru²⁺ (pushti, 500 nm)",
      cvAdvantage: "UV-Vis rang va konsentratsiyani ko'rsatadi",
      cvDisadvantage: "CV redoks potensialni, UV-Vis spektrni",
      complementarity: "92%"
    },
    {
      name: "Magnit o'lchashlar",
      role: "Ru³⁺ (paramagnit, μ = 1.73 BM) va Ru²⁺ (diamagnit, μ = 0)",
      cvAdvantage: "Magnit o'lchash spin holatini, CV redoksni ko'rsatadi",
      cvDisadvantage: "Birgalikda to'liq tavsif",
      complementarity: "94%"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      role: "Oktaedr geometriya — Ru-N 1.96 Å",
      cvAdvantage: "XRD geometriyani, CV redoks xossalarini ko'rsatadi",
      cvDisadvantage: "Birgalikda to'liq validatsiya",
      complementarity: "90%"
    }
  ],

  // Boshqa Ru komplekslari bilan taqqoslash
  comparisonComplexes: [
    {
      name: "[Ru(NH₃)₆]³⁺/²⁺",
      E0: "+0.10 V",
      config: "d⁵ (past spin) / d⁶ (past spin)",
      Kstab: "10¹⁵ / 10⁵",
      color: "sariq/pushti",
      notes: "Tashqi sfera mexanizmi — Taube"
    },
    {
      name: "[Ru(bipy)₃]²⁺/³⁺",
      E0: "+1.26 V",
      config: "d⁶ (past spin) / d⁵ (past spin)",
      Kstab: "10²⁰ / 10¹⁰",
      color: "qizil/ko'k",
      notes: "MLCT — fotokimyoviy faol"
    },
    {
      name: "[Ru(CN)₆]³⁻/⁴⁻",
      E0: "-0.80 V",
      config: "d⁶ (past spin) / d⁷ (past spin)",
      Kstab: "10⁶⁴ / 10¹⁹",
      color: "sariq/qizil",
      notes: "CN⁻ juda kuchli maydon"
    },
    {
      name: "[Ru(en)₃]³⁺/²⁺",
      E0: "-0.26 V",
      config: "d⁶ (past spin) / d⁷ (yuqori spin)",
      Kstab: "10⁴⁹ / 10⁷",
      color: "sariq/binafsha",
      notes: "Xelat effekt — en bidentat"
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

function calculateNernstPotential(oxConc, redConc, E0 = 0.10) {
  if (redConc <= 0) return Infinity
  return E0 + 0.059 * Math.log10(oxConc / redConc)
}

function getStatusColor(deltaE) {
  if (deltaE <= 0.065) return "text-green-400"
  if (deltaE <= 0.080) return "text-yellow-400"
  return "text-red-400"
}

export default function RuNH36Page() {
  const [activeRun, setActiveRun] = useState("CV-24-801")
  const [customEpa, setCustomEpa] = useState(-0.09)
  const [customEpc, setCustomEpc] = useState(-0.15)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showNernstModal, setShowNernstModal] = useState(false)
  const [showTaubeModal, setShowTaubeModal] = useState(true)
  const [showHeader, setShowHeader] = useState(true)
  
  // Nernst kalkulyator
  const [oxConc, setOxConc] = useState(1.0)
  const [redConc, setRedConc] = useState(1.0)
  const [nernstE0, setNernstE0] = useState(0.10)
  
  // Diffuziya kalkulyatori
  const [diffIpa, setDiffIpa] = useState(10.0)
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
    isReversible: calculateDeltaE(customEpa, customEpc) <= 0.065
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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-rose-950/20 to-blue-950 text-white">
      
      {/* TAUBE OGOHLANTIRISH MODALI */}
      {showTaubeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-rose-950 to-purple-950 border-2 border-rose-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-rose-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> TAUBE — TASHQI SFERA ELEKTRON KO'CHISH MEXANIZMI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-rose-300">[Ru(NH₃)₆]³⁺/²⁺</strong> — tashqi sfera elektron ko'chish mexanizmining klassik namunasi!
            </p>
            
            <div className="bg-rose-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-rose-400 font-bold mb-2">⚡ Ru³⁺ (d⁵, past spin):</div>
                  <div className="text-purple-200">
                    <strong>Kinetik inert</strong> — kunlar davomida almashinadi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    t₂g⁵ — paramagnit, μ = 1.73 BM
                  </div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold mb-2">✅ Ru²⁺ (d⁶, past spin):</div>
                  <div className="text-purple-200">
                    <strong>Tezroq</strong> — soatlar davomida almashinadi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    t₂g⁶ — diamagnit, μ = 0
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-rose-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-rose-300">Henry Taube (Nobel 1983):</strong> Tashqi sfera mexanizmi — geometriya o'zgarmaydi, elektron ko'chish tez sodir bo'ladi!
              </p>
            </div>

            <button 
              onClick={() => setShowTaubeModal(false)}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
            >
              Tushundim — sahifani davom ettirish
            </button>
          </div>
        </div>
      )}
      
      {/* HEADER — TOGGLE BILAN */}
      {showHeader && (
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
              <span className="text-rose-400 font-semibold">[Ru(NH₃)₆]³⁺/²⁺</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-rose-400 flex items-center gap-2">
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
                  <span className="px-2 py-1 rounded bg-rose-900/30 border border-rose-700/50 text-rose-400 text-[10px] uppercase tracking-wide">Ru³⁺/Ru²⁺</span>
                  <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Tashqi sfera</span>
                  <span className="px-2 py-1 rounded bg-rose-900/30 border border-rose-700/50 text-rose-400 text-[10px] uppercase tracking-wide">E° = +0.10 V</span>
                  <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">⚡ Taube 1983</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/elektrokimyo/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Barcha birikmalar
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* HEADER TOGGLE BUTTON */}
      <button
        onClick={() => setShowHeader(!showHeader)}
        className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg ${
          showHeader 
            ? "bg-rose-600 hover:bg-rose-500 text-white" 
            : "bg-rose-600 hover:bg-rose-500 text-white"
        }`}
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-rose-900/40 to-purple-900/40 border border-rose-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (elektrokimyoviy tahlil uchun)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Ru(NH₃)₆]³⁺/²⁺</strong> — tashqi sfera elektron ko'chish mexanizmining klassik namunasi. Ru³⁺/Ru²⁺ juftligi <strong className="text-rose-300">quasi-reversible</strong> va tez elektron ko'chish mexanizmiga ega.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-rose-500 text-xs md:text-sm">
                <li><strong className="text-white">Bir elektronli qaytar</strong>: Ru³⁺ + e⁻ ⇌ Ru²⁺</li>
                <li>E° = <strong className="text-rose-400">+0.10 V</strong> (vs SHE) — past!</li>
                <li>ΔE = <strong className="text-yellow-300">60 mV</strong> (quasi-reversible)</li>
                <li>Ipa/Ipc ≈ <strong className="text-yellow-300">0.95-1.05</strong> (quasi-reversible)</li>
                <li><strong className="text-rose-300">Tashqi sfera mexanizmi</strong> — Taube kashfiyoti</li>
                <li>D = <strong className="text-rose-300">8.0 × 10⁻⁶ cm²/s</strong></li>
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

        {/* 2. TASHQI SFERA MEXANIZMI */}
        <div className="bg-gradient-to-r from-rose-900/40 to-blue-900/40 border-2 border-rose-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚡</span> {COMPOUND.electrochemicalFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.electrochemicalFeature.description}
          </p>

          <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
            <div className="text-center text-lg font-mono text-rose-400 mb-2">
              {COMPOUND.electrochemicalFeature.reaction.half}
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-rose-400">E°(SHE) = {COMPOUND.electrochemicalFeature.reaction.E0}</span>
              <span className="text-rose-400">E°(Ag/AgCl) = {COMPOUND.electrochemicalFeature.reaction.E0_AgAgCl}</span>
              <span className="text-rose-400">n = {COMPOUND.electrochemicalFeature.reaction.n}</span>
            </div>
          </div>

          {/* Tashqi sfera box */}
          <div className="bg-cyan-950/40 rounded-lg p-4 mb-4 border border-cyan-500/30">
            <h4 className="text-cyan-400 font-bold text-sm mb-2">{COMPOUND.electrochemicalFeature.outerSphere.title}</h4>
            <p className="text-xs text-purple-200 mb-2">{COMPOUND.electrochemicalFeature.outerSphere.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-cyan-900/30 rounded p-2">
                <div className="text-cyan-400 font-bold">Geometriya:</div>
                <div className="text-purple-200">{COMPOUND.electrochemicalFeature.outerSphere.geometry}</div>
              </div>
              <div className="bg-cyan-900/30 rounded p-2">
                <div className="text-cyan-400 font-bold">Tezlik:</div>
                <div className="text-purple-200">{COMPOUND.electrochemicalFeature.outerSphere.rate}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-950/40 rounded-xl p-5 border-2 border-red-500/50">
              <h3 className="text-red-400 font-bold text-sm mb-3">⚡ {COMPOUND.electrochemicalFeature.problem.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-red-400 font-bold">Xususiyat:</div>
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
                  <div className="text-green-300 font-bold">Tashqi sfera:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.electrochemicalFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowTaubeModal(true)}
            className="w-full mt-4 bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
          >
            ⚡ Taube mexanizmi haqida batafsil →
          </button>
        </div>

        {/* 3. CV PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> CV o'lchash parametrlari
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            [Ru(NH₃)₆]³⁺/²⁺ uchun standart CV sharoitlari. Pt elektrod, 0.1 M KCl, 100 mV/s skan tezligi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Ishchi elektrod</div>
              <div className="text-sm font-bold text-rose-400">Pt disk</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">E_pa (anod)</div>
              <div className="text-sm font-mono font-bold text-rose-400">{COMPOUND.cvParameters.E_pa}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">E_pc (katod)</div>
              <div className="text-sm font-mono font-bold text-rose-400">{COMPOUND.cvParameters.E_pc}</div>
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
            [Ru(NH₃)₆]Cl₃ va [Ru(NH₃)₆]Cl₂ uchun nazariy tarkib.
          </p>
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
                  const elColor = el.includes("Ru") ? "text-rose-400" : "text-purple-400"
                  const rowClass = el.includes("Ru") ? "" : "opacity-60"
                  const trClass = "border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors " + rowClass
                  const tdElClass = "py-3 pl-2 font-bold " + elColor
                  return (
                    <tr key={el} className={trClass}>
                      <td className={tdElClass}>
                        {el.includes("Ru_ox") ? "Ru³⁺ (oks)" : 
                         el.includes("Ru_red") ? "Ru²⁺ (qayt)" : 
                         el.includes("Cl_ox") ? "Cl (oks)" : 
                         el.includes("Cl_red") ? "Cl (qayt)" : el}
                      </td>
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
            [Ru(NH₃)₆]³⁺/²⁺ uchun tipik siklik voltamperogramma. ΔE = 60 mV — quasi-reversible (tez elektron ko'chish).
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 300" className="w-full h-full overflow-visible">
              {/* Grid */}
              {[-0.5, -0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v, i) => (
                <g key={i}>
                  <line x1="60" y1={30 + ((v + 0.5)/1.0)*240} x2="580" y2={30 + ((v + 0.5)/1.0)*240} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="55" y={34 + ((v + 0.5)/1.0)*240} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}V</text>
                </g>
              ))}

              {/* X axis */}
              {[-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10].map((v, i) => (
                <g key={i}>
                  <text x={60 + ((v + 10)/20)*520} y="285" textAnchor="middle" fontSize="8" fill="#a78bfa">{v}</text>
                </g>
              ))}
              <text x="310" y="298" textAnchor="middle" fontSize="10" fill="#a78bfa">Tok (μA)</text>

              {/* Zero line */}
              <line x1="60" y1={30 + (10/20)*240} x2="580" y2={30 + (10/20)*240} stroke="#a78bfa" strokeWidth="1" />

              {/* CV curve */}
              <polyline
                fill="none" stroke="#f43f5e" strokeWidth="2"
                points={COMPOUND.cvData.map(p => {
                  const x = 60 + ((p.potential + 0.5)/1.0)*520
                  const y = 30 + ((10 - p.current)/20)*240
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* E_pa marker */}
              <line x1={60 + ((-0.09 + 0.5)/1.0)*520} y1="30" x2={60 + ((-0.09 + 0.5)/1.0)*520} y2="270" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" />
              <text x={60 + ((-0.09 + 0.5)/1.0)*520} y="20" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">E_pa = -0.09V</text>

              {/* E_pc marker */}
              <line x1={60 + ((-0.15 + 0.5)/1.0)*520} y1="30" x2={60 + ((-0.15 + 0.5)/1.0)*520} y2="270" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2" />
              <text x={60 + ((-0.15 + 0.5)/1.0)*520 - 5} y="20" textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="bold">E_pc = -0.15V</text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-rose-500"></span> CV egri chiziq</span>
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
            Quasi-reversible sistemada ΔE skan tezligi bilan kamayadi (sekin skan da muvozanatga yaqinlashadi). <strong className="text-rose-400">Ip ∝ v^(1/2)</strong> hali ham bajariladi.
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
                      <td className="py-2 px-3 font-mono text-rose-400 font-bold">{d.scanRate}</td>
                      <td className="py-2 px-3 text-center font-mono">{d.sqrtV.toFixed(3)}</td>
                      <td className="py-2 px-3 text-center font-mono text-rose-400">{d.Ipa.toFixed(1)}</td>
                      <td className="py-2 px-3 text-center font-mono text-rose-400">{d.Ipc.toFixed(1)}</td>
                      <td className="py-2 px-3 text-center font-mono">{ratio.toFixed(2)}</td>
                      <td className="py-2 px-3 text-center font-mono text-cyan-400">{(d.deltaE * 1000).toFixed(0)}</td>
                      <td className="py-2 px-3 text-center font-mono text-rose-400">{d.E12.toFixed(3)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-purple-400 italic">
            💡 <strong>Eslatma:</strong> Sekin skan tezligida ΔE kamayadi (70 → 55 mV), quasi-reversible sistema muvozanatga yaqinlashadi.
          </p>
        </div>

        {/* 8. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> CV yugurishlari — turli sharoitlarda
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli skan tezliklari va sharoitlarda o'lchangan CV natijalari. ΔE = 60 mV bo'lishi kerak (quasi-reversible).
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isActive = activeRun === r.id
              const btnClass = isActive
                ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/20"
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
                  <div className="flex justify-between items-center p-2 bg-rose-900/20 rounded border border-rose-500/20">
                    <span className="text-sm text-rose-400 font-medium">E_pa (anod):</span>
                    <span className="font-mono text-white text-lg">{run.E_pa.toFixed(3)} V</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-rose-900/20 rounded border border-rose-500/20">
                    <span className="text-sm text-rose-400 font-medium">E_pc (katod):</span>
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
                    <span className={`font-mono font-bold ${deltaE <= 0.065 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {deltaE <= 0.065 ? "Quasi-rev ✓" : "Sekin ✗"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-rose-400 mb-4 flex justify-between">
                <span>ΔE Qiymatlari (mV) — turli sharoitlarda</span>
                <span className="text-[10px] text-purple-500 font-normal">Ideal: 60 mV (quasi-rev)</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const val = r.deltaE * 1000
                  const heightPct = Math.min((val / 120) * 100, 100)
                  const isActive = r.id === activeRun
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isBad = val > 80
                  let barClass = "w-full rounded-t transition-all duration-500 z-10 bg-purple-700/40"
                  if (isActive) {
                    if (isBlank) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-gray-500"
                    else if (isStd) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-500"
                    else if (isBad) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    else barClass = "w-full rounded-t transition-all duration-500 z-10 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
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
                        <div className="absolute w-[120%] border-t border-dashed border-rose-400/50 z-0" style={{ bottom: `${(60/120)*100}%` }}></div>

                        <div 
                          className={barClass}
                          style={{ height: `${Math.max(heightPct, 1)}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-cyan-400' : isBad ? 'text-red-400' : 'text-rose-400') : 'text-purple-600'} font-bold`}>
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
        <div className="bg-rose-900/20 border border-rose-500/30 rounded-2xl p-6">
          <h3 className="text-rose-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Nernst tenglamasi interaktiv kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            [Ox]/[Red] nisbatini o'zgartiring — <strong className="text-rose-300">potensial E</strong> avtomatik hisoblanadi. E° past (+0.10 V)!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Ox] = [Ru(NH₃)₆³⁺] (mM):</label>
              <input 
                type="number" step="0.1" value={oxConc}
                onChange={(e) => setOxConc(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-rose-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Red] = [Ru(NH₃)₆²⁺] (mM):</label>
              <input 
                type="number" step="0.1" value={redConc}
                onChange={(e) => setRedConc(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-rose-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">E° (V vs SHE):</label>
              <input 
                type="number" step="0.01" value={nernstE0}
                onChange={(e) => setNernstE0(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-rose-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">[Ox]/[Red]:</div>
                <div className="text-xl font-mono font-bold text-rose-400">{(oxConc/redConc).toFixed(3)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">E (V vs SHE):</div>
                <div className="text-xl font-mono font-bold text-rose-400">{nernstE.toFixed(3)} V</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Holat:</div>
                <div className={`text-xl font-mono font-bold ${
                  oxConc > redConc ? 'text-yellow-400' : oxConc < redConc ? 'text-rose-400' : 'text-cyan-400'
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
                <div className="text-xl font-mono font-bold text-green-400">8.0 × 10⁻⁶ cm²/s</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Ip = 2.69×10⁵ × 1^(3/2) × {diffArea} × D^(1/2) × {diffConc}×10⁻³ × ({diffScanRate}/1000)^(1/2)
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Mos kelish:</strong> {Math.abs(calcDiff - 8.0e-6) / 8.0e-6 * 100 < 10 ? "✓ Adabiy qiymatga yaqin" : "⚠ Adabiy qiymatdan farqli — tekshirish kerak"}
            </p>
          </div>
        </div>

        {/* 11. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> CV uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Ru(NH₃)₆]³⁺/²⁺ uchun standart CV sharoitlari. 0.1 M KCl elektrolit, 100 mV/s skan tezligi.
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

        {/* 12. CV KALKULYATORI */}
        <div className="bg-rose-900/20 border border-rose-500/30 rounded-2xl p-6">
          <h3 className="text-rose-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> CV dan E₁/₂ va ΔE hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            E_pa va E_pc kiriting — <strong className="text-rose-300">E₁/₂</strong> va <strong className="text-rose-300">ΔE</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">E_pa (anod pik, V):</label>
              <input 
                type="number" step="0.001" value={customEpa}
                onChange={(e) => setCustomEpa(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-rose-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">E_pc (katod pik, V):</label>
              <input 
                type="number" step="0.001" value={customEpc}
                onChange={(e) => setCustomEpc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-rose-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">E₁/₂:</div>
                <div className="text-xl font-mono font-bold text-rose-400">{calcResult.E12.toFixed(3)} V</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">ΔE:</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{(calcResult.deltaE * 1000).toFixed(0)} mV</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Qaytariluvchanlik:</div>
                <div className={`text-xl font-mono font-bold ${calcResult.isReversible ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.isReversible ? "Quasi-rev ✓" : "Sekin ✗"}
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: E₁/₂ = (E_pa + E_pc) / 2; ΔE = E_pa − E_pc; Ideal (quasi-rev): ΔE = 60 mV
            </p>
          </div>
        </div>

        {/* 13. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-rose-900/40 to-purple-900/40 border border-rose-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> CV ga yaqin tahlil usullari bilan solishtirish
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

          <div className="mt-5 bg-rose-900/20 border border-rose-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-rose-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">CV (E₁/₂, ΔE) + UV-Vis (320 nm, 500 nm) + Magnit (μ) + AAS/ICP (Ru%) + XRD (geometriya)</strong> — beshta metod birgalikda [Ru(NH₃)₆]³⁺/²⁺ juftligini to'liq tavsiflaydi va tashqi sfera mexanizmini tasdiqlaydi.
            </p>
          </div>
        </div>

        {/* 14. RU KOMPLEKSLARI TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> Ru komplekslarining redoks potensiallari
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Ligand maydon kuchiga qarab E° o'zgaradi: kuchli maydon ligandlari Ru³⁺ ni barqarorlashtiradi va E° ni o'zgartiradi.
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
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${c.name.includes("[Ru(NH₃)₆]") ? 'bg-rose-900/20' : ''}`}>
                    <td className="py-2 px-3 font-bold text-rose-400">{c.name}</td>
                    <td className="py-2 px-3 text-center font-mono text-rose-400">{c.E0}</td>
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
              <p className="text-xs text-purple-200">E₁/₂ va ΔE orqali redoks xossalarini aniqlaydi. Tashqi sfera mexanizmini ko'rsatadi. E° = 0.10 V.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Quasi-reversible sistema. ΔE 60 mV. Ru³⁺/Ru²⁺ ni farqlash uchun magnit o'lchash kerak.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">UV-Vis (320 nm, 500 nm), Magnit (μ), AAS/ICP (Ru%), XRD (geometriya) — to'liq tahlil uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/elektrokimyo" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Elektrokimyoviy tahlil
            </Link>
            <Link href="/ilmiy/tahlil/elektrokimyo/birikmalar" className="text-sm bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Ru(NH₃)₆]³⁺/²⁺ • Elektrokimyoviy tahlil moduli</p>
          <p className="mt-1">Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC, Taube (1983 Nobel)</p>
        </div>
      </footer>
    </main>
  )
}