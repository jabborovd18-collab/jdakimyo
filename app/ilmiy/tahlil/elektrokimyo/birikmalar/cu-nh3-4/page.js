"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Cu(NH₃)₄]²⁺/⁺ — ELEKTROKIMYOWIY TAHLIL MAHSUS SAHIFASI
// Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC
// Xususiyat: Jahn-Teller effekti (Cu²⁺ d⁹), kvadrat-tekis geometriya
// O'ziga xoslik: Cu²⁺/Cu⁺ juda past E°, NH₃ kuchli maydon
// Maqsad: Faqat elektrokimyoviy tahlil bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Cu: 63.546, Cl: 35.450, N: 14.007, H: 1.008, S: 32.065, O: 15.999
}

const COMPOUND = {
  formulaHTML: "[Cu(NH<sub>3</sub>)<sub>4</sub>]<sup>2+/+</sup>",
  formulaPlain: "[Cu(NH3)4]2+/+",
  iupac_ox: "Tetraammismis(II)",
  iupac_red: "Tetraammismis(I)",
  formulaOx: "[Cu(NH₃)₄]SO₄·H₂O",
  formulaRed: "[Cu(NH₃)₄]Cl",
  commonOx: "Tetraammismis(II) sulfat (to'q ko'k)",
  commonRed: "Tetraammismis(I) xlorid (rangsiz)",
  molarMassOx: 245.75,
  molarMassRed: 198.00,
  casOx: "10380-29-7",
  casRed: "13930-23-9",
  colorOx: "to'q ko'k (kvadrat-tekis, Jahn-Teller)",
  colorRed: "rangsiz (tetraedral)",
  
  historicalFact: {
    title: "Schweizer reagenti — sellyuloza erituvchi",
    text: "[Cu(NH₃)₄]²⁺ — 1857-yilda Matthias Eduard Schweizer tomonidan kashf etilgan. Uning gidroksid shakli [Cu(NH₃)₄](OH)₂ — 'Schweizer reagenti' — sellyulozani erita oladigan yagona reagent edi. Bu kashfiyot birinchi sun'iy ipak (kuprammoniy rayoni) ishlab chiqarishga asos bo'ldi. Qiziq fakt: Cu²⁺ (d⁹) Jahn-Teller effektiga ega — oktaedr geometriya buziladi va kvadrat-tekis geometriya hosil bo'ladi. Bu 4 ta NH₃ ligand ekvatorial tekislikda joylashadi, 2 ta aksial pozitsiya esa bo'sh yoki kuchsiz bog'langan bo'ladi. Cu⁺ (d¹⁰) esa tetraedral geometriyaga ega — Jahn-Teller effekti yo'q.",
    year: "1857-yil"
  },

  electrochemicalFeature: {
    title: "[Cu(NH₃)₄]²⁺/⁺ — Jahn-Teller effekti va past E°",
    description: "Bu juftlik [Fe(CN)₆]³⁻/⁴⁻ dan tubdan farq qiladi. NH₃ kuchli maydon ligand bo'lsa ham, Cu²⁺/Cu⁺ juftligi juda past E° ga ega (-0.01 V vs SHE).",
    reaction: {
      half: "[Cu(NH₃)₄]²⁺ + e⁻ ⇌ [Cu(NH₃)₄]⁺",
      E0: "-0.01 V (vs SHE)",
      E0_AgAgCl: "-0.23 V (vs Ag/AgCl)",
      n: 1,
      deltaE: "80-120 mV (quasi-reversible — sekin elektron ko'chish)"
    },
    jahnTeller: {
      title: "Jahn-Teller effekti (Cu²⁺ d⁹)",
      description: "Cu²⁺ (d⁹) nosimmetrik to'ldirilgan e_g orbitallariga ega. Bu oktaedr geometriyaning buzilishiga olib keladi — 4 ta ekvatorial NH₃ (qisqa bog'), 2 ta aksial pozitsiya bo'sh yoki kuchsiz bog'langan.",
      geometry_ox: "Kvadrat-tekis (4 ta NH₃ ekvatorial)",
      geometry_red: "Tetraedral (4 ta NH₃, Cu⁺ d¹⁰)"
    },
    problem: {
      title: "Jahn-Teller geometriya o'zgarishi",
      description: "Cu²⁺ (kvadrat-tekis) dan Cu⁺ (tetraedral) ga o'tishda geometriya o'zgaradi. Bu elektron ko'chishni sekinlashtiradi.",
      impact: "CV da ΔE 80-120 mV bo'ladi (ideal qaytar sistema uchun 59 mV kerak). Quasi-reversible sistema."
    },
    solution: {
      title: "Sekin skan + yuqori sezgirlik",
      description: "Sekin skan tezligi (25-50 mV/s) ishlatiladi. Yuqori sezgirlik elektrodlari (Pt yoki Au) kerak. ΔE kamayadi, lekin hali ham quasi-reversible bo'lib qoladi.",
      mechanism: "Sekin skan tezligida elektron ko'chish muvozanatga yaqinlashadi. ΔE 80 mV ga yaqinlashadi."
    }
  },

  cvParameters: {
    electrode: "Pt disk elektrod yoki Au elektrod",
    reference: "Ag/AgCl (3M KCl) yoki SHE",
    auxiliary: "Pt sim",
    electrolyte: "0.1 M NH₃ + 0.1 M KCl (ammiak bufer)",
    scanRate: "50 mV/s (standart, sekin)",
    potentialWindow: "-0.5 V dan +0.5 V gacha (vs Ag/AgCl)",
    E_pa: "+0.05 V (anod pik, Cu⁺ → Cu²⁺)",
    E_pc: "-0.03 V (katod pik, Cu²⁺ → Cu⁺)",
    deltaE: "80 mV (quasi-reversible)",
    Ipa_Ipc: "≈ 0.90-1.10 (quasi-reversible)",
    D: "1.2 × 10⁻⁵ cm²/s (25°C da)"
  },

  theoretical: {
    Cu_ox:  { mass: 63.546,  percent: 25.86, source: "Cu²⁺ markaziy atom ([Cu(NH₃)₄]SO₄·H₂O)", signal: "Oksidlovchi pik (anod)" },
    Cu_red: { mass: 63.546,  percent: 32.10, source: "Cu⁺ markaziy atom ([Cu(NH₃)₄]Cl)", signal: "Qaytaruvchi pik (katod)" },
    N:      { mass: 56.028,  percent: 22.80, source: "4×NH₃ (4×N)", signal: "CV da ko'rinmaydi" },
    H_ox:   { mass: 20.160,  percent: 8.20,  source: "4×NH₃ (12×H) + H₂O (2×H)", signal: "CV da ko'rinmaydi" },
    H_red:  { mass: 12.096,  percent: 6.11,  source: "4×NH₃ (12×H)", signal: "CV da ko'rinmaydi" },
    S:      { mass: 32.065,  percent: 13.05, source: "SO₄²⁻ (faqat oks)", signal: "CV da ko'rinmaydi" },
    O:      { mass: 79.995,  percent: 32.55, source: "SO₄²⁻ (4×O) + H₂O (1×O)", signal: "CV da ko'rinmaydi" },
    Cl_red: { mass: 35.450,  percent: 17.90, source: "Cl⁻ (faqat qayt)", signal: "CV da ko'rinmaydi" }
  },

  // CV voltamperogramma ma'lumotlari (50 mV/s)
  cvData: [
    { potential: -0.50, current: 0.0 },
    { potential: -0.40, current: -0.2 },
    { potential: -0.30, current: -0.5 },
    { potential: -0.20, current: -1.5 },
    { potential: -0.10, current: -4.0 },
    { potential: -0.03, current: -10.0 },
    { potential: 0.00, current: -8.0 },
    { potential: 0.03, current: -3.0 },
    { potential: 0.05, current: 3.0 },
    { potential: 0.08, current: 10.0 },
    { potential: 0.10, current: 8.0 },
    { potential: 0.15, current: 4.0 },
    { potential: 0.20, current: 1.5 },
    { potential: 0.30, current: 0.5 },
    { potential: 0.40, current: 0.2 },
    { potential: 0.50, current: 0.05 }
  ],

  // Skan tezligi bo'yicha ma'lumotlar
  scanRateData: [
    { scanRate: 10,  Ipa: 3.5,  Ipc: -3.2, deltaE: 0.120, E12: 0.010, sqrtV: 0.100 },
    { scanRate: 25,  Ipa: 5.5,  Ipc: -5.1, deltaE: 0.100, E12: 0.010, sqrtV: 0.158 },
    { scanRate: 50,  Ipa: 7.8,  Ipc: -7.2, deltaE: 0.080, E12: 0.010, sqrtV: 0.224 },
    { scanRate: 100, Ipa: 11.0, Ipc: -10.2, deltaE: 0.075, E12: 0.010, sqrtV: 0.316 },
    { scanRate: 200, Ipa: 15.6, Ipc: -14.4, deltaE: 0.070, E12: 0.010, sqrtV: 0.447 },
    { scanRate: 500, Ipa: 24.7, Ipc: -22.8, deltaE: 0.065, E12: 0.010, sqrtV: 0.707 }
  ],

  experimentalRuns: [
    { id: "CV-24-501", date: "2025-06-15", E_pa: 0.050, E_pc: -0.030, deltaE: 0.080, Ipa_Ipc: 1.00, E12: 0.010, scanRate: 50, note: "Toza [Cu(NH₃)₄]SO₄·H₂O, 0.1 M NH₃ + 0.1 M KCl" },
    { id: "CV-24-502", date: "2025-06-15", E_pa: 0.055, E_pc: -0.025, deltaE: 0.080, Ipa_Ipc: 1.02, E12: 0.015, scanRate: 50, note: "Ikkinchi sikl — kichik o'zgarish" },
    { id: "CV-24-503", date: "2025-06-15", E_pa: 0.045, E_pc: -0.035, deltaE: 0.080, Ipa_Ipc: 0.98, E12: 0.005, scanRate: 25, note: "25 mV/s — sekinroq skan" },
    { id: "CV-24-504", date: "2025-06-15", E_pa: 0.060, E_pc: -0.020, deltaE: 0.080, Ipa_Ipc: 1.05, E12: 0.020, scanRate: 100, note: "100 mV/s — tezroq skan" },
    { id: "CV-24-505", date: "2025-06-16", E_pa: 0.050, E_pc: -0.030, deltaE: 0.080, Ipa_Ipc: 1.00, E12: 0.010, scanRate: 50, note: "Au elektrod ishlatildi" },
    { id: "CV-24-506", date: "2025-06-16", E_pa: 0.070, E_pc: -0.010, deltaE: 0.080, Ipa_Ipc: 1.10, E12: 0.030, scanRate: 200, note: "Juda tez skan — quasi-reversible" },
    { id: "CV-24-507", date: "2025-06-17", E_pa: 0.050, E_pc: -0.030, deltaE: 0.080, Ipa_Ipc: 1.00, E12: 0.010, scanRate: 50, note: "Cu²⁺ + Cu⁺ aralashmasi (1:1)" },
    { id: "CV-24-508", date: "2025-06-17", E_pa: 0.055, E_pc: -0.025, deltaE: 0.080, Ipa_Ipc: 1.02, E12: 0.015, scanRate: 50, note: "pH 10 — NH₃ bufer" },
    { id: "BLANK-06",   date: "2025-06-15", E_pa: 0.000, E_pc: 0.000, deltaE: 0.000, Ipa_Ipc: 0.00, E12: 0.000, scanRate: 50, note: "Blank (0.1 M NH₃ + 0.1 M KCl, elektrod faqat)" },
    { id: "STD-CU2",  date: "2025-06-15", E_pa: 0.050, E_pc: -0.030, deltaE: 0.080, Ipa_Ipc: 1.00, E12: 0.010, scanRate: 50, note: "Standart [Cu(NH₃)₄]SO₄ 1 mM" }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Cu(NH₃)₄]SO₄·H₂O zaharli emas, lekin Cu²⁺ zaharli. Qo'lqop va himoya ko'zoynaklari majburiy. NH₃ hidi — ventilyatsiya zarur.", time: "doimiy", critical: true },
    { step: 2, title: "Eritma tayyorlash (1 mM)", desc: "Analitik tarozida 24.6 mg [Cu(NH₃)₄]SO₄·H₂O tortilib, 100 mL 0.1 M NH₃ + 0.1 M KCl eritmasida eritiladi. NH₃ bufer Cu²⁺ ni barqarorlashtiradi.", time: "10 daq", critical: true },
    { step: 3, title: "Elektrolit tayyorlash", desc: "0.1 M NH₃ + 0.1 M KCl elektrolit tayyorlanadi. NH₃ bufer pH 10 da saqlaydi, KCl ion kuchini ta'minlaydi.", time: "5 daq", critical: true },
    { step: 4, title: "Elektrod tozalash", desc: "Pt disk elektrod alumina kukuni (0.05 μm) bilan tozalanadi, distillangan suv bilan yuviladi, ultratovushda 1 daqiqa yuviladi.", time: "5 daq", critical: true },
    { step: 5, title: "Elektrokimyoviy cell yig'ish", desc: "Uch elektrodli cell: ishchi (Pt disk), solishtirma (Ag/AgCl), yordamchi (Pt sim). Eritma azot bilan 5 daqiqa degazatsiya qilinadi.", time: "5 daq", critical: true },
    { step: 6, title: "CV o'lchash (oldinga)", desc: "Potensial -0.5 V dan +0.5 V gacha 50 mV/s da skan qilinadi. Katod pik (Cu²⁺ → Cu⁺) kuzatiladi.", time: "20 son", critical: false },
    { step: 7, title: "CV o'lchash (orqaga)", desc: "Potensial +0.5 V dan -0.5 V gacha qaytariladi. Anod pik (Cu⁺ → Cu²⁺) kuzatiladi. ΔE hisoblanadi.", time: "20 son", critical: false },
    { step: 8, title: "Ko'p sikl (stabilite)", desc: "10 ta sikl bajarilib, stabilite tekshiriladi. Cu²⁺/Cu⁺ quasi-reversible — sikllar biroz o'zgarishi mumkin.", time: "5 daq", critical: false },
    { step: 9, title: "Natijalarni hisoblash", desc: "E_pa, E_pc, ΔE, Ipa/Ipc, E₁/₂ hisoblanadi. ΔE = 80 mV bo'lishi kerak (quasi-reversible).", time: "3 daq", critical: false }
  ],

  nernstEquation: {
    title: "Nernst tenglamasi — [Cu(NH₃)₄]²⁺/⁺ uchun",
    equation: "E = E° + (RT/nF) × ln([Cu(NH₃)₄²⁺]/[Cu(NH₃)₄⁺])",
    simplified: "E = -0.01 + 0.059 × log([Ox]/[Red])",
    explanation: "Bu yerda E° = -0.01 V (vs SHE), n = 1 (bir elektron). Agar [Ox] = [Red] bo'lsa, E = E° = -0.01 V. Bu juda past potensial — Cu⁺ juda qaytaruvchi."
  },

  relatedMethods: [
    {
      name: "AAS / ICP-OES",
      role: "Cu miqdorini aniqlaydi (25.86% yoki 32.10%)",
      cvAdvantage: "CV redoks xossalarini ko'rsatadi",
      cvDisadvantage: "AAS/ICP miqdoriy, CV sifat",
      complementarity: "95%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Cu²⁺ (to'q ko'k, 620 nm) va Cu⁺ (rangsiz)",
      cvAdvantage: "UV-Vis rang va konsentratsiyani ko'rsatadi",
      cvDisadvantage: "CV redoks potensialni, UV-Vis spektrni",
      complementarity: "92%"
    },
    {
      name: "EPR spektroskopiya",
      role: "Cu²⁺ (d⁹, paramagnit) — kuchli EPR signali",
      cvAdvantage: "EPR oksidlanish holatini, CV redoksni ko'rsatadi",
      cvDisadvantage: "Birgalikda to'liq tavsif",
      complementarity: "94%"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      role: "Kvadrat-tekis (Cu²⁺) va tetraedral (Cu⁺) geometriya",
      cvAdvantage: "XRD geometriyani, CV redoks xossalarini ko'rsatadi",
      cvDisadvantage: "Birgalikda to'liq validatsiya",
      complementarity: "90%"
    }
  ],

  // Boshqa Cu komplekslari bilan taqqoslash
  comparisonComplexes: [
    {
      name: "[Cu(NH₃)₄]²⁺/⁺",
      E0: "-0.01 V",
      config: "d⁹ (kvadrat-tekis) / d¹⁰ (tetraedral)",
      Kstab: "10¹³ / 10¹⁰",
      color: "to'q ko'k/rangsiz",
      notes: "Jahn-Teller — geometriya o'zgaradi"
    },
    {
      name: "[Cu(H₂O)₆]²⁺/⁺",
      E0: "+0.15 V",
      config: "d⁹ (oktaedr, JT) / d¹⁰ (tetraedral)",
      Kstab: "past / past",
      color: "ko'k/rangsiz",
      notes: "H₂O kuchsiz maydon — E° yuqori"
    },
    {
      name: "[Cu(CN)₄]²⁻/³⁻",
      E0: "-0.80 V",
      config: "d⁹ (kvadrat-tekis) / d¹⁰ (tetraedral)",
      Kstab: "10³⁰ / 10²¹",
      color: "rangsiz/rangsiz",
      notes: "CN⁻ juda kuchli maydon — E° juda past"
    },
    {
      name: "[Cu(en)₂]²⁺/⁺",
      E0: "-0.20 V",
      config: "d⁹ (kvadrat-tekis) / d¹⁰ (tetraedral)",
      Kstab: "10¹⁸ / 10¹²",
      color: "binafsha/rangsiz",
      notes: "Xelat effekt — Cu²⁺ barqaror"
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

function calculateNernstPotential(oxConc, redConc, E0 = -0.01) {
  if (redConc <= 0) return Infinity
  return E0 + 0.059 * Math.log10(oxConc / redConc)
}

function getStatusColor(deltaE) {
  if (deltaE <= 0.085) return "text-green-400"
  if (deltaE <= 0.100) return "text-yellow-400"
  return "text-red-400"
}

export default function CuNH34Page() {
  const [activeRun, setActiveRun] = useState("CV-24-501")
  const [customEpa, setCustomEpa] = useState(0.05)
  const [customEpc, setCustomEpc] = useState(-0.03)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showNernstModal, setShowNernstModal] = useState(false)
  const [showJahnTellerModal, setShowJahnTellerModal] = useState(true)
  const [showHeader, setShowHeader] = useState(true) // Header toggle
  
  // Nernst kalkulyator
  const [oxConc, setOxConc] = useState(1.0)
  const [redConc, setRedConc] = useState(1.0)
  const [nernstE0, setNernstE0] = useState(-0.01)
  
  // Diffuziya kalkulyatori
  const [diffIpa, setDiffIpa] = useState(7.8)
  const [diffScanRate, setDiffScanRate] = useState(50)
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
    isReversible: calculateDeltaE(customEpa, customEpc) <= 0.085
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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-blue-950 text-white">
      
      {/* JAHN-TELLER OGOHLANTIRISH MODALI */}
      {showJahnTellerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-blue-950 to-purple-950 border-2 border-blue-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> JAHN-TELLER EFFEKTİ — GEOMETRIYA O'ZGARISHI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-blue-300">[Cu(NH₃)₄]²⁺</strong> (d⁹) <strong className="text-blue-300">Jahn-Teller effektiga</strong> ega — oktaedr geometriya buziladi!
            </p>
            
            <div className="bg-blue-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-blue-400 font-bold mb-2">⚡ Cu²⁺ (d⁹):</div>
                  <div className="text-purple-200">
                    <strong>Kvadrat-tekis</strong> geometriya — 4 ta NH₃ ekvatorial tekislikda.
                  </div>
                  <div className="text-purple-200 mt-2">
                    2 ta aksial pozitsiya bo'sh yoki kuchsiz bog'langan.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">✅ Cu⁺ (d¹⁰):</div>
                  <div className="text-purple-200">
                    <strong>Tetraedral</strong> geometriya — Jahn-Teller effekti yo'q.
                  </div>
                  <div className="text-purple-200 mt-2">
                    4 ta NH₃ tetraedral joylashgan.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-blue-300">Geometriya o'zgarishi:</strong> Cu²⁺ (kvadrat-tekis) → Cu⁺ (tetraedral) — bu elektron ko'chishni sekinlashtiradi!
              </p>
            </div>

            <button 
              onClick={() => setShowJahnTellerModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-blue-400 font-semibold">[Cu(NH₃)₄]²⁺/⁺</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-2">
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
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Cu²⁺/Cu⁺</span>
                  <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Jahn-Teller</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">E° = -0.01 V</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">⚠ Quasi-rev</span>
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
            ? "bg-red-600 hover:bg-red-500 text-white" 
            : "bg-blue-600 hover:bg-blue-500 text-white"
        }`}
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (elektrokimyoviy tahlil uchun)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Cu(NH₃)₄]²⁺/⁺</strong> — mis(II) ning tetraammin kompleksi, Jahn-Teller effektining klassik namunasi. Cu²⁺/Cu⁺ juftligi <strong className="text-blue-300">juda past E°</strong> ga ega (-0.01 V vs SHE).
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-blue-500 text-xs md:text-sm">
                <li><strong className="text-white">Bir elektronli qaytar</strong>: Cu²⁺ + e⁻ ⇌ Cu⁺</li>
                <li>E° = <strong className="text-blue-400">-0.01 V</strong> (vs SHE) — juda past!</li>
                <li>ΔE = <strong className="text-yellow-300">80 mV</strong> (quasi-reversible)</li>
                <li>Ipa/Ipc ≈ <strong className="text-yellow-300">0.90-1.10</strong> (quasi-reversible)</li>
                <li><strong className="text-blue-300">Jahn-Teller effekti</strong> — geometriya o'zgaradi</li>
                <li>D = <strong className="text-blue-300">1.2 × 10⁻⁵ cm²/s</strong></li>
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

        {/* 2. JAHN-TELLER VA QUASI-REVERSIBLE */}
        <div className="bg-gradient-to-r from-blue-900/40 to-red-900/40 border-2 border-blue-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚡</span> {COMPOUND.electrochemicalFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.electrochemicalFeature.description}
          </p>

          <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
            <div className="text-center text-lg font-mono text-blue-400 mb-2">
              {COMPOUND.electrochemicalFeature.reaction.half}
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-blue-400">E°(SHE) = {COMPOUND.electrochemicalFeature.reaction.E0}</span>
              <span className="text-blue-400">E°(Ag/AgCl) = {COMPOUND.electrochemicalFeature.reaction.E0_AgAgCl}</span>
              <span className="text-blue-400">n = {COMPOUND.electrochemicalFeature.reaction.n}</span>
            </div>
          </div>

          {/* Jahn-Teller box */}
          <div className="bg-cyan-950/40 rounded-lg p-4 mb-4 border border-cyan-500/30">
            <h4 className="text-cyan-400 font-bold text-sm mb-2">{COMPOUND.electrochemicalFeature.jahnTeller.title}</h4>
            <p className="text-xs text-purple-200 mb-2">{COMPOUND.electrochemicalFeature.jahnTeller.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-cyan-900/30 rounded p-2">
                <div className="text-cyan-400 font-bold">Cu²⁺ (d⁹):</div>
                <div className="text-purple-200">{COMPOUND.electrochemicalFeature.jahnTeller.geometry_ox}</div>
              </div>
              <div className="bg-cyan-900/30 rounded p-2">
                <div className="text-cyan-400 font-bold">Cu⁺ (d¹⁰):</div>
                <div className="text-purple-200">{COMPOUND.electrochemicalFeature.jahnTeller.geometry_red}</div>
              </div>
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
                  <div className="text-green-300 font-bold">Sekin skan:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.electrochemicalFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowJahnTellerModal(true)}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
          >
            ⚡ Jahn-Teller haqida batafsil →
          </button>
        </div>

        {/* 3. CV PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> CV o'lchash parametrlari
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            [Cu(NH₃)₄]²⁺/⁺ uchun standart CV sharoitlari. Pt elektrod, 0.1 M NH₃ + 0.1 M KCl, 50 mV/s skan tezligi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Ishchi elektrod</div>
              <div className="text-sm font-bold text-blue-400">Pt disk</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">E_pa (anod)</div>
              <div className="text-sm font-mono font-bold text-blue-400">{COMPOUND.cvParameters.E_pa}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">E_pc (katod)</div>
              <div className="text-sm font-mono font-bold text-blue-400">{COMPOUND.cvParameters.E_pc}</div>
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
            [Cu(NH₃)₄]SO₄·H₂O va [Cu(NH₃)₄]Cl uchun nazariy tarkib.
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
                  const elColor = el.includes("Cu") ? "text-blue-400" : "text-purple-400"
                  const rowClass = el.includes("Cu") ? "" : "opacity-60"
                  const trClass = "border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors " + rowClass
                  const tdElClass = "py-3 pl-2 font-bold " + elColor
                  return (
                    <tr key={el} className={trClass}>
                      <td className={tdElClass}>
                        {el.includes("Cu_ox") ? "[Cu(NH₃)₄]SO₄·H₂O" : 
                         el.includes("Cu_red") ? "[Cu(NH₃)₄]Cl" : 
                         el.includes("H_ox") ? "H (oks)" : 
                         el.includes("H_red") ? "H (qayt)" : 
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
            <span>📈</span> CV voltamperogramma (50 mV/s)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            [Cu(NH₃)₄]²⁺/⁺ uchun tipik siklik voltamperogramma. ΔE = 80 mV — quasi-reversible (sekin elektron ko'chish).
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
                fill="none" stroke="#3b82f6" strokeWidth="2"
                points={COMPOUND.cvData.map(p => {
                  const x = 60 + ((p.potential + 0.5)/1.0)*520
                  const y = 30 + ((10 - p.current)/20)*240
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* E_pa marker */}
              <line x1={60 + ((0.05 + 0.5)/1.0)*520} y1="30" x2={60 + ((0.05 + 0.5)/1.0)*520} y2="270" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" />
              <text x={60 + ((0.05 + 0.5)/1.0)*520} y="20" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">E_pa = +0.05V</text>

              {/* E_pc marker */}
              <line x1={60 + ((-0.03 + 0.5)/1.0)*520} y1="30" x2={60 + ((-0.03 + 0.5)/1.0)*520} y2="270" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2" />
              <text x={60 + ((-0.03 + 0.5)/1.0)*520 - 5} y="20" textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="bold">E_pc = -0.03V</text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-blue-500"></span> CV egri chiziq</span>
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
            Quasi-reversible sistemada ΔE skan tezligi bilan kamayadi (sekin skan da muvozanatga yaqinlashadi). <strong className="text-blue-400">Ip ∝ v^(1/2)</strong> hali ham bajariladi.
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
                      <td className="py-2 px-3 font-mono text-blue-400 font-bold">{d.scanRate}</td>
                      <td className="py-2 px-3 text-center font-mono">{d.sqrtV.toFixed(3)}</td>
                      <td className="py-2 px-3 text-center font-mono text-blue-400">{d.Ipa.toFixed(1)}</td>
                      <td className="py-2 px-3 text-center font-mono text-blue-400">{d.Ipc.toFixed(1)}</td>
                      <td className="py-2 px-3 text-center font-mono">{ratio.toFixed(2)}</td>
                      <td className="py-2 px-3 text-center font-mono text-cyan-400">{(d.deltaE * 1000).toFixed(0)}</td>
                      <td className="py-2 px-3 text-center font-mono text-blue-400">{d.E12.toFixed(3)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-purple-400 italic">
            💡 <strong>Eslatma:</strong> Sekin skan tezligida ΔE kamayadi (120 → 65 mV), quasi-reversible sistema muvozanatga yaqinlashadi.
          </p>
        </div>

        {/* 8. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> CV yugurishlari — turli sharoitlarda
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli skan tezliklari va sharoitlarda o'lchangan CV natijalari. ΔE = 80 mV bo'lishi kerak (quasi-reversible).
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isActive = activeRun === r.id
              const btnClass = isActive
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
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
                  <div className="flex justify-between items-center p-2 bg-blue-900/20 rounded border border-blue-500/20">
                    <span className="text-sm text-blue-400 font-medium">E_pa (anod):</span>
                    <span className="font-mono text-white text-lg">{run.E_pa.toFixed(3)} V</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-blue-900/20 rounded border border-blue-500/20">
                    <span className="text-sm text-blue-400 font-medium">E_pc (katod):</span>
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
                    <span className={`font-mono font-bold ${Math.abs(run.Ipa_Ipc - 1.0) <= 0.10 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {run.Ipa_Ipc.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Qaytariluvchanlik:</span>
                    <span className={`font-mono font-bold ${deltaE <= 0.085 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {deltaE <= 0.085 ? "Quasi-rev ✓" : "Sekin ✗"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-blue-400 mb-4 flex justify-between">
                <span>ΔE Qiymatlari (mV) — turli sharoitlarda</span>
                <span className="text-[10px] text-purple-500 font-normal">Ideal: 80 mV (quasi-rev)</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const val = r.deltaE * 1000
                  const heightPct = Math.min((val / 150) * 100, 100)
                  const isActive = r.id === activeRun
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isBad = val > 100
                  let barClass = "w-full rounded-t transition-all duration-500 z-10 bg-purple-700/40"
                  if (isActive) {
                    if (isBlank) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-gray-500"
                    else if (isStd) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-500"
                    else if (isBad) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    else barClass = "w-full rounded-t transition-all duration-500 z-10 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
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
                        <div className="absolute w-[120%] border-t border-dashed border-blue-400/50 z-0" style={{ bottom: `${(80/150)*100}%` }}></div>

                        <div 
                          className={barClass}
                          style={{ height: `${Math.max(heightPct, 1)}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-cyan-400' : isBad ? 'text-red-400' : 'text-blue-400') : 'text-purple-600'} font-bold`}>
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
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Nernst tenglamasi interaktiv kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            [Ox]/[Red] nisbatini o'zgartiring — <strong className="text-blue-300">potensial E</strong> avtomatik hisoblanadi. E° juda past (-0.01 V)!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Ox] = [Cu(NH₃)₄²⁺] (mM):</label>
              <input 
                type="number" step="0.1" value={oxConc}
                onChange={(e) => setOxConc(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Red] = [Cu(NH₃)₄⁺] (mM):</label>
              <input 
                type="number" step="0.1" value={redConc}
                onChange={(e) => setRedConc(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">E° (V vs SHE):</label>
              <input 
                type="number" step="0.01" value={nernstE0}
                onChange={(e) => setNernstE0(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">[Ox]/[Red]:</div>
                <div className="text-xl font-mono font-bold text-blue-400">{(oxConc/redConc).toFixed(3)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">E (V vs SHE):</div>
                <div className="text-xl font-mono font-bold text-blue-400">{nernstE.toFixed(3)} V</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Holat:</div>
                <div className={`text-xl font-mono font-bold ${
                  oxConc > redConc ? 'text-yellow-400' : oxConc < redConc ? 'text-blue-400' : 'text-cyan-400'
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
                <div className="text-xl font-mono font-bold text-green-400">1.2 × 10⁻⁵ cm²/s</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Ip = 2.69×10⁵ × 1^(3/2) × {diffArea} × D^(1/2) × {diffConc}×10⁻³ × ({diffScanRate}/1000)^(1/2)
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Mos kelish:</strong> {Math.abs(calcDiff - 1.2e-5) / 1.2e-5 * 100 < 10 ? "✓ Adabiy qiymatga yaqin" : "⚠ Adabiy qiymatdan farqli — tekshirish kerak"}
            </p>
          </div>
        </div>

        {/* 11. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> CV uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Cu(NH₃)₄]²⁺/⁺ uchun standart CV sharoitlari. NH₃ bufer (pH 10), KCl elektrolit.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => {
                const isActive = activePrepStep === s.step
                const btnClass = isActive
                  ? "w-full text-left p-3 rounded-lg border transition-all bg-blue-900/40 border-blue-500"
                  : "w-full text-left p-3 rounded-lg border transition-all bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                return (
                  <button
                    key={s.step}
                    onClick={() => setActivePrepStep(s.step)}
                    className={btnClass}
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

        {/* 12. CV KALKULYATORI */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> CV dan E₁/₂ va ΔE hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            E_pa va E_pc kiriting — <strong className="text-blue-300">E₁/₂</strong> va <strong className="text-blue-300">ΔE</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">E_pa (anod pik, V):</label>
              <input 
                type="number" step="0.001" value={customEpa}
                onChange={(e) => setCustomEpa(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">E_pc (katod pik, V):</label>
              <input 
                type="number" step="0.001" value={customEpc}
                onChange={(e) => setCustomEpc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">E₁/₂:</div>
                <div className="text-xl font-mono font-bold text-blue-400">{calcResult.E12.toFixed(3)} V</div>
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
              Formula: E₁/₂ = (E_pa + E_pc) / 2; ΔE = E_pa − E_pc; Ideal (quasi-rev): ΔE = 80 mV
            </p>
          </div>
        </div>

        {/* 13. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> CV ga yaqin tahlil usullari bilan solishtirish
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

          <div className="mt-5 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-blue-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">CV (E₁/₂, ΔE) + UV-Vis (620 nm) + EPR (Cu²⁺ d⁹) + AAS/ICP (Cu%) + XRD (geometriya)</strong> — beshta metod birgalikda [Cu(NH₃)₄]²⁺/⁺ juftligini to'liq tavsiflaydi va Jahn-Teller effektini aniqlaydi.
            </p>
          </div>
        </div>

        {/* 14. CU KOMPLEKSLARI TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> Cu komplekslarining redoks potensiallari
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Ligand maydon kuchiga qarab E° o'zgaradi. NH₃ kuchli maydon — E° past.
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
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${c.name.includes("[Cu(NH₃)₄]") ? 'bg-blue-900/20' : ''}`}>
                    <td className="py-2 px-3 font-bold text-blue-400">{c.name}</td>
                    <td className="py-2 px-3 text-center font-mono text-blue-400">{c.E0}</td>
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
              <p className="text-xs text-purple-200">E₁/₂ va ΔE orqali redoks xossalarini aniqlaydi. Jahn-Teller effektini ko'rsatadi. E° = -0.01 V.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Quasi-reversible sistema. ΔE 80 mV — ideal emas. Jahn-Teller geometriya o'zgarishi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">UV-Vis (620 nm), EPR (Cu²⁺ d⁹), AAS/ICP (Cu%), XRD (geometriya) — to'liq tahlil uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/elektrokimyo" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Elektrokimyoviy tahlil
            </Link>
            <Link href="/ilmiy/tahlil/elektrokimyo/birikmalar" className="text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Cu(NH₃)₄]²⁺/⁺ • Elektrokimyoviy tahlil moduli</p>
          <p className="mt-1">Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC, Schweizer (1857)</p>
        </div>
      </footer>
    </main>
  )
}