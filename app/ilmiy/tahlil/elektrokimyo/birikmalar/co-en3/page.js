"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(en)₃]³⁺/²⁺ — ELEKTROKIMYOWIY TAHLIL MAHSUS SAHIFASI
// Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC, Schwarzenbach (1930)
// Xususiyat: Xelat effekti (en bidentat), inert Co³⁺ vs labile Co²⁺
// O'ziga xoslik: 10⁴² marta Kstab farqi, geometriya o'zgarishi
// Maqsad: Faqat elektrokimyoviy tahlil bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Co: 58.933, Cl: 35.450, C: 12.011, N: 14.007, H: 1.008
}

const COMPOUND = {
  formulaHTML: "[Co(en)<sub>3</sub>]<sup>3+/2+</sup>",
  formulaPlain: "[Co(en)3]3+/2+",
  iupac_ox: "Tris(etilendiamin)kobalt(III)",
  iupac_red: "Tris(etilendiamin)kobalt(II)",
  formulaOx: "[Co(en)₃]Cl₃",
  formulaRed: "[Co(en)₃]Cl₂",
  commonOx: "Luteo-kobalt(III) (sariq)",
  commonRed: "Tris(etilendiamin)kobalt(II) (binafsha)",
  molarMassOx: 323.42,
  molarMassRed: 287.97,
  casOx: "14878-43-8",
  casRed: "14878-43-9",
  colorOx: "sariq (oktaedr, past spin, inert)",
  colorRed: "binafsha (oktaedr, yuqori spin, labile)",
  
  historicalFact: {
    title: "Xelat effekti — Schwarzenbach kashfiyoti",
    text: "[Co(en)₃]³⁺/²⁺ — xelat effektining klassik namunasi. 1930-yillarda Gerold Schwarzenbach (Shveytsariya) ko'rsatdiki, [Co(en)₃]³⁺ ning barqarorlik doimiysi (log β₃ ≈ 49) [Co(NH₃)₆]³⁺ (log β₆ ≈ 35) dan 10¹⁴ marta katta! Bu ulkan farqning sababi ENTROPIYA: bitta en (bidentat) 2 ta NH₃ o'rnini egallaganda, erkin molekulalar soni ortadi (ΔS > 0). 3 ta en ligandi har biri 5 a'zoli xelat halqasi hosil qiladi (Co-N-C-C-N) — bu eng barqaror halqa o'lchami. Qiziq fakt: Co³⁺ (d⁶, past spin) juda inert — ligand almashinishi kunlar-oylar davom etadi. Co²⁺ (d⁷, yuqori spin) esa labile — millisekundlarda almashinadi.",
    year: "1930-yillar"
  },

  electrochemicalFeature: {
    title: "[Co(en)₃]³⁺/²⁺ — inert vs labile va xelat effekti",
    description: "Bu juftlik [Co(NH₃)₆]³⁺/²⁺ dan ancha barqaror. en kuchli maydon ligand bo'lgani uchun Co³⁺ past spinli va JUDA inert, Co²⁺ esa yuqori spinli va labile.",
    reaction: {
      half: "[Co(en)₃]³⁺ + e⁻ ⇌ [Co(en)₃]²⁺",
      E0: "-0.26 V (vs SHE)",
      E0_AgAgCl: "-0.48 V (vs Ag/AgCl)",
      n: 1,
      deltaE: "150-250 mV (juda sekin elektron ko'chish — INERT)"
    },
    chelateEffect: {
      title: "Xelat effekti — 10⁴² marta barqarorlik",
      description: "en (etilendiamin, H₂N-CH₂-CH₂-NH₂) bidentat ligand — ikkita N atomi orqali Co ga bog'lanadi. 3 ta en ligandi 3 ta 5 a'zoli xelat halqa hosil qiladi.",
      kstab_ox: "log β₃([Co(en)₃]³⁺) ≈ 49",
      kstab_red: "log β₃([Co(en)₃]²⁺) ≈ 7",
      ratio: "Kstab(Co³⁺) / Kstab(Co²⁺) ≈ 10⁴²"
    },
    problem: {
      title: "Inert Co³⁺ — juda sekin elektron ko'chish",
      description: "Co³⁺ (d⁶, past spin, t₂g⁶) juda inert — ligand almashinishi kunlar-oylar davom etadi. Elektron ko'chish ham juda sekin.",
      impact: "CV da ΔE 150-250 mV bo'ladi (ideal qaytar sistema uchun 59 mV kerak). Ipa/Ipc 0.5-0.8 oralig'ida."
    },
    solution: {
      title: "Juda sekin skan + yuqori sezgirlik",
      description: "Juda sekin skan tezligi (10-25 mV/s) ishlatiladi. Yuqori sezgirlik elektrodlari (Pt yoki Au) kerak. ΔE kamayadi, lekin hali ham inert bo'lib qoladi.",
      mechanism: "Sekin skan tezligida elektron ko'chish muvozanatga yaqinlashadi. ΔE 150 mV ga yaqinlashadi, lekin ideal qaytar sistemadan uzoq."
    }
  },

  cvParameters: {
    electrode: "Pt disk elektrod yoki Au elektrod",
    reference: "Ag/AgCl (3M KCl) yoki SHE",
    auxiliary: "Pt sim",
    electrolyte: "0.1 M KCl yoki 0.1 M NaClO₄",
    scanRate: "25 mV/s (standart, juda sekin)",
    potentialWindow: "-0.8 V dan +0.5 V gacha (vs Ag/AgCl)",
    E_pa: "-0.18 V (anod pik, Co²⁺ → Co³⁺)",
    E_pc: "-0.33 V (katod pik, Co³⁺ → Co²⁺)",
    deltaE: "150 mV (inert sistema)",
    Ipa_Ipc: "≈ 0.6-0.8 (inert sistema)",
    D: "7.5 × 10⁻⁶ cm²/s (25°C da)"
  },

  theoretical: {
    Co_ox:  { mass: 58.933,  percent: 18.22, source: "Co³⁺ markaziy atom ([Co(en)₃]Cl₃)", signal: "Oksidlovchi pik (anod)" },
    Co_red: { mass: 58.933,  percent: 20.47, source: "Co²⁺ markaziy atom ([Co(en)₃]Cl₂)", signal: "Qaytaruvchi pik (katod)" },
    C:      { mass: 72.066,  percent: 22.29, source: "3×en (6×C)", signal: "CV da ko'rinmaydi" },
    N:      { mass: 84.042,  percent: 25.98, source: "3×en (6×N)", signal: "CV da ko'rinmaydi" },
    H:      { mass: 36.288,  percent: 11.22, source: "3×en (24×H)", signal: "CV da ko'rinmaydi" },
    Cl_ox:  { mass: 106.350, percent: 32.88, source: "3×Cl⁻ (faqat oks)", signal: "CV da ko'rinmaydi" },
    Cl_red: { mass: 70.900,  percent: 24.62, source: "2×Cl⁻ (faqat qayt)", signal: "CV da ko'rinmaydi" }
  },

  // CV voltamperogramma ma'lumotlari (25 mV/s)
  cvData: [
    { potential: -0.80, current: 0.0 },
    { potential: -0.70, current: -0.3 },
    { potential: -0.60, current: -0.8 },
    { potential: -0.50, current: -1.5 },
    { potential: -0.40, current: -3.0 },
    { potential: -0.33, current: -6.0 },
    { potential: -0.30, current: -5.0 },
    { potential: -0.25, current: -2.5 },
    { potential: -0.20, current: -0.5 },
    { potential: -0.18, current: 2.5 },
    { potential: -0.15, current: 5.0 },
    { potential: -0.10, current: 6.0 },
    { potential: -0.05, current: 4.0 },
    { potential: 0.00, current: 2.0 },
    { potential: 0.10, current: 0.8 },
    { potential: 0.20, current: 0.3 },
    { potential: 0.30, current: 0.1 },
    { potential: 0.40, current: 0.05 },
    { potential: 0.50, current: 0.02 }
  ],

  // Skan tezligi bo'yicha ma'lumotlar
  scanRateData: [
    { scanRate: 5,   Ipa: 2.0,  Ipc: -1.5, deltaE: 0.250, E12: -0.255, sqrtV: 0.071 },
    { scanRate: 10,  Ipa: 2.8,  Ipc: -2.1, deltaE: 0.200, E12: -0.255, sqrtV: 0.100 },
    { scanRate: 25,  Ipa: 4.5,  Ipc: -3.4, deltaE: 0.150, E12: -0.255, sqrtV: 0.158 },
    { scanRate: 50,  Ipa: 6.3,  Ipc: -4.8, deltaE: 0.130, E12: -0.255, sqrtV: 0.224 },
    { scanRate: 100, Ipa: 8.9,  Ipc: -6.8, deltaE: 0.120, E12: -0.255, sqrtV: 0.316 },
    { scanRate: 200, Ipa: 12.6, Ipc: -9.6, deltaE: 0.110, E12: -0.255, sqrtV: 0.447 }
  ],

  experimentalRuns: [
    { id: "CV-24-601", date: "2025-07-15", E_pa: -0.180, E_pc: -0.330, deltaE: 0.150, Ipa_Ipc: 0.70, E12: -0.255, scanRate: 25, note: "Toza [Co(en)₃]Cl₃, 0.1 M KCl" },
    { id: "CV-24-602", date: "2025-07-15", E_pa: -0.175, E_pc: -0.335, deltaE: 0.160, Ipa_Ipc: 0.72, E12: -0.255, scanRate: 25, note: "Ikkinchi sikl — kichik o'zgarish" },
    { id: "CV-24-603", date: "2025-07-15", E_pa: -0.170, E_pc: -0.340, deltaE: 0.170, Ipa_Ipc: 0.68, E12: -0.255, scanRate: 10, note: "10 mV/s — juda sekin skan" },
    { id: "CV-24-604", date: "2025-07-15", E_pa: -0.190, E_pc: -0.320, deltaE: 0.130, Ipa_Ipc: 0.75, E12: -0.255, scanRate: 50, note: "50 mV/s — tezroq skan" },
    { id: "CV-24-605", date: "2025-07-16", E_pa: -0.180, E_pc: -0.330, deltaE: 0.150, Ipa_Ipc: 0.70, E12: -0.255, scanRate: 25, note: "Au elektrod ishlatildi" },
    { id: "CV-24-606", date: "2025-07-16", E_pa: -0.200, E_pc: -0.310, deltaE: 0.110, Ipa_Ipc: 0.80, E12: -0.255, scanRate: 200, note: "Juda tez skan — inert sistema" },
    { id: "CV-24-607", date: "2025-07-17", E_pa: -0.180, E_pc: -0.330, deltaE: 0.150, Ipa_Ipc: 0.70, E12: -0.255, scanRate: 25, note: "Co³⁺ + Co²⁺ aralashmasi (1:1)" },
    { id: "CV-24-608", date: "2025-07-17", E_pa: -0.185, E_pc: -0.325, deltaE: 0.140, Ipa_Ipc: 0.72, E12: -0.255, scanRate: 25, note: "pH 7 — neytral sharoit" },
    { id: "BLANK-07",   date: "2025-07-15", E_pa: 0.000, E_pc: 0.000, deltaE: 0.000, Ipa_Ipc: 0.00, E12: 0.000, scanRate: 25, note: "Blank (0.1 M KCl, elektrod faqat)" },
    { id: "STD-CO3",  date: "2025-07-15", E_pa: -0.180, E_pc: -0.330, deltaE: 0.150, Ipa_Ipc: 0.70, E12: -0.255, scanRate: 25, note: "Standart [Co(en)₃]Cl₃ 1 mM" }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Co(en)₃]Cl₃ zaharli emas, lekin Co²⁺ zaharli. Qo'lqop va himoya ko'zoynaklari majburiy. en hidi — ventilyatsiya zarur.", time: "doimiy", critical: true },
    { step: 2, title: "Eritma tayyorlash (1 mM)", desc: "Analitik tarozida 32.3 mg [Co(en)₃]Cl₃ tortilib, 100 mL 0.1 M KCl eritmasida eritiladi. Co³⁺ inert — sekin eriydi (10-15 daqiqa).", time: "15 daq", critical: true },
    { step: 3, title: "Elektrolit tayyorlash", desc: "0.1 M KCl elektrolit tayyorlanadi (0.745 g KCl / 100 mL distillangan suv). Elektrolit ion kuchini ta'minlaydi.", time: "5 daq", critical: true },
    { step: 4, title: "Elektrod tozalash", desc: "Pt disk elektrod alumina kukuni (0.05 μm) bilan tozalanadi, distillangan suv bilan yuviladi, ultratovushda 1 daqiqa yuviladi.", time: "5 daq", critical: true },
    { step: 5, title: "Elektrokimyoviy cell yig'ish", desc: "Uch elektrodli cell: ishchi (Pt disk), solishtirma (Ag/AgCl), yordamchi (Pt sim). Eritma azot bilan 5 daqiqa degazatsiya qilinadi.", time: "5 daq", critical: true },
    { step: 6, title: "CV o'lchash (oldinga)", desc: "Potensial -0.8 V dan +0.5 V gacha 25 mV/s da skan qilinadi. Katod pik (Co³⁺ → Co²⁺) kuzatiladi. JUDA SEKIN SKAN!", time: "52 son", critical: false },
    { step: 7, title: "CV o'lchash (orqaga)", desc: "Potensial +0.5 V dan -0.8 V gacha qaytariladi. Anod pik (Co²⁺ → Co³⁺) kuzatiladi. ΔE hisoblanadi.", time: "52 son", critical: false },
    { step: 8, title: "Ko'p sikl (stabilite)", desc: "5 ta sikl bajarilib, stabilite tekshiriladi. Co³⁺ inert — sikllar bir xil bo'lishi kerak.", time: "5 daq", critical: false },
    { step: 9, title: "Natijalarni hisoblash", desc: "E_pa, E_pc, ΔE, Ipa/Ipc, E₁/₂ hisoblanadi. ΔE = 150 mV bo'lishi kerak (inert sistema).", time: "3 daq", critical: false }
  ],

  nernstEquation: {
    title: "Nernst tenglamasi — [Co(en)₃]³⁺/²⁺ uchun",
    equation: "E = E° + (RT/nF) × ln([Co(en)₃³⁺]/[Co(en)₃²⁺])",
    simplified: "E = -0.26 + 0.059 × log([Ox]/[Red])",
    explanation: "Bu yerda E° = -0.26 V (vs SHE), n = 1 (bir elektron). Agar [Ox] = [Red] bo'lsa, E = E° = -0.26 V. Bu juda past potensial — Co²⁺ juda qaytaruvchi."
  },

  relatedMethods: [
    {
      name: "AAS / ICP-OES",
      role: "Co miqdorini aniqlaydi (18.22% yoki 20.47%)",
      cvAdvantage: "CV redoks xossalarini ko'rsatadi",
      cvDisadvantage: "AAS/ICP miqdoriy, CV sifat",
      complementarity: "95%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Co³⁺ (sariq, 475 nm) va Co²⁺ (binafsha, 500 nm)",
      cvAdvantage: "UV-Vis rang va konsentratsiyani ko'rsatadi",
      cvDisadvantage: "CV redoks potensialni, UV-Vis spektrni",
      complementarity: "92%"
    },
    {
      name: "Magnit o'lchashlar",
      role: "Co³⁺ (diamagnit, μ = 0) va Co²⁺ (paramagnit, μ = 3.9 BM)",
      cvAdvantage: "Magnit o'lchash spin holatini, CV redoksni ko'rsatadi",
      cvDisadvantage: "Birgalikda to'liq tavsif",
      complementarity: "94%"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      role: "Oktaedr geometriya — Co-N 1.94 Å",
      cvAdvantage: "XRD geometriyani, CV redoks xossalarini ko'rsatadi",
      cvDisadvantage: "Birgalikda to'liq validatsiya",
      complementarity: "90%"
    }
  ],

  // Boshqa Co komplekslari bilan taqqoslash
  comparisonComplexes: [
    {
      name: "[Co(en)₃]³⁺/²⁺",
      E0: "-0.26 V",
      config: "d⁶ (past spin) / d⁷ (yuqori spin)",
      Kstab: "10⁴⁹ / 10⁷",
      color: "sariq/binafsha",
      notes: "Xelat effekt — Co³⁺ juda inert"
    },
    {
      name: "[Co(NH₃)₆]³⁺/²⁺",
      E0: "+0.10 V",
      config: "d⁶ (past spin) / d⁷ (yuqori spin)",
      Kstab: "10³⁵ / 10⁵",
      color: "sariq/somon rang",
      notes: "NH₃ kuchli maydon — Co³⁺ inert"
    },
    {
      name: "[Co(CN)₆]³⁻/²⁻",
      E0: "-0.80 V",
      config: "d⁶ (past spin) / d⁷ (past spin)",
      Kstab: "10⁶⁴ / 10¹⁹",
      color: "sariq/qizil",
      notes: "CN⁻ juda kuchli maydon — E° juda past"
    },
    {
      name: "[Co(H₂O)₆]³⁺/²⁺",
      E0: "+1.82 V",
      config: "d⁶ (yuqori spin) / d⁷ (yuqori spin)",
      Kstab: "past / past",
      color: "ko'k/pushti",
      notes: "H₂O kuchsiz maydon — Co³⁺ kuchli oksidlovchi"
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

function calculateNernstPotential(oxConc, redConc, E0 = -0.26) {
  if (redConc <= 0) return Infinity
  return E0 + 0.059 * Math.log10(oxConc / redConc)
}

function getStatusColor(deltaE) {
  if (deltaE <= 0.160) return "text-green-400"
  if (deltaE <= 0.200) return "text-yellow-400"
  return "text-red-400"
}

export default function CoEn3Page() {
  const [activeRun, setActiveRun] = useState("CV-24-601")
  const [customEpa, setCustomEpa] = useState(-0.18)
  const [customEpc, setCustomEpc] = useState(-0.33)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showNernstModal, setShowNernstModal] = useState(false)
  const [showChelateModal, setShowChelateModal] = useState(true)
  const [showHeader, setShowHeader] = useState(true)
  
  // Nernst kalkulyator
  const [oxConc, setOxConc] = useState(1.0)
  const [redConc, setRedConc] = useState(1.0)
  const [nernstE0, setNernstE0] = useState(-0.26)
  
  // Diffuziya kalkulyatori
  const [diffIpa, setDiffIpa] = useState(4.5)
  const [diffScanRate, setDiffScanRate] = useState(25)
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
    isReversible: calculateDeltaE(customEpa, customEpc) <= 0.160
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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-pink-950/20 to-blue-950 text-white">
      
      {/* XELAT EFFEKTI OGOHLANTIRISH MODALI */}
      {showChelateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-pink-950 to-purple-950 border-2 border-pink-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> XELAT EFFEKTİ — 10⁴² MARTA BARQARORLIK!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-pink-300">[Co(en)₃]³⁺</strong> (d⁶, past spin) <strong className="text-pink-300">JUDA INERT</strong> — ligand almashinishi kunlar-oylar davom etadi!
            </p>
            
            <div className="bg-pink-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-pink-400 font-bold mb-2">⚡ Xelat effekti:</div>
                  <div className="text-purple-200">
                    en (bidentat) → <strong>5 a'zoli halqa</strong> (Co-N-C-C-N)
                  </div>
                  <div className="text-purple-200 mt-2">
                    Kstab(Co³⁺) ≈ <strong>10⁴⁹</strong>
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">✅ Co²⁺ (d⁷, yuqori spin):</div>
                  <div className="text-purple-200">
                    <strong>Labile</strong> — millisekundlarda almashinadi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    Kstab(Co²⁺) ≈ <strong>10⁷</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-pink-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-pink-300">Kstab farqi:</strong> Kstab(Co³⁺) / Kstab(Co²⁺) ≈ <strong>10⁴²</strong> — bu kinetik inertlikning asosiy sababi!
              </p>
            </div>

            <button 
              onClick={() => setShowChelateModal(false)}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-pink-400 font-semibold">[Co(en)₃]³⁺/²⁺</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-pink-400 flex items-center gap-2">
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
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Co³⁺/Co²⁺</span>
                  <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Xelat effekt</span>
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">E° = -0.26 V</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">⚠ Inert</span>
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
            : "bg-pink-600 hover:bg-pink-500 text-white"
        }`}
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (elektrokimyoviy tahlil uchun)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Co(en)₃]³⁺/²⁺</strong> — kobalt(III/II) ning tris(etilendiamin) kompleksi, xelat effektining klassik namunasi. Co³⁺/Co²⁺ juftligi <strong className="text-pink-300">juda past E°</strong> ga ega (-0.26 V vs SHE).
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-pink-500 text-xs md:text-sm">
                <li><strong className="text-white">Bir elektronli qaytar</strong>: Co³⁺ + e⁻ ⇌ Co²⁺</li>
                <li>E° = <strong className="text-pink-400">-0.26 V</strong> (vs SHE) — juda past!</li>
                <li>ΔE = <strong className="text-yellow-300">150 mV</strong> (inert sistema)</li>
                <li>Ipa/Ipc ≈ <strong className="text-yellow-300">0.6-0.8</strong> (inert sistema)</li>
                <li><strong className="text-pink-300">Xelat effekti</strong> — 10⁴² marta barqarorlik</li>
                <li>D = <strong className="text-pink-300">7.5 × 10⁻⁶ cm²/s</strong></li>
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

        {/* 2. XELAT EFFEKTİ VA INERTLIK */}
        <div className="bg-gradient-to-r from-pink-900/40 to-red-900/40 border-2 border-pink-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚡</span> {COMPOUND.electrochemicalFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.electrochemicalFeature.description}
          </p>

          <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
            <div className="text-center text-lg font-mono text-pink-400 mb-2">
              {COMPOUND.electrochemicalFeature.reaction.half}
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-pink-400">E°(SHE) = {COMPOUND.electrochemicalFeature.reaction.E0}</span>
              <span className="text-pink-400">E°(Ag/AgCl) = {COMPOUND.electrochemicalFeature.reaction.E0_AgAgCl}</span>
              <span className="text-pink-400">n = {COMPOUND.electrochemicalFeature.reaction.n}</span>
            </div>
          </div>

          {/* Xelat effekti box */}
          <div className="bg-cyan-950/40 rounded-lg p-4 mb-4 border border-cyan-500/30">
            <h4 className="text-cyan-400 font-bold text-sm mb-2">{COMPOUND.electrochemicalFeature.chelateEffect.title}</h4>
            <p className="text-xs text-purple-200 mb-2">{COMPOUND.electrochemicalFeature.chelateEffect.description}</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-cyan-900/30 rounded p-2">
                <div className="text-cyan-400 font-bold">Kstab(Co³⁺):</div>
                <div className="text-purple-200">{COMPOUND.electrochemicalFeature.chelateEffect.kstab_ox}</div>
              </div>
              <div className="bg-cyan-900/30 rounded p-2">
                <div className="text-cyan-400 font-bold">Kstab(Co²⁺):</div>
                <div className="text-purple-200">{COMPOUND.electrochemicalFeature.chelateEffect.kstab_red}</div>
              </div>
              <div className="bg-cyan-900/30 rounded p-2">
                <div className="text-cyan-400 font-bold">Nisbat:</div>
                <div className="text-purple-200">{COMPOUND.electrochemicalFeature.chelateEffect.ratio}</div>
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
                  <div className="text-green-300 font-bold">Juda sekin skan:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.electrochemicalFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowChelateModal(true)}
            className="w-full mt-4 bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
          >
            ⚡ Xelat effekti haqida batafsil →
          </button>
        </div>

        {/* 3. CV PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> CV o'lchash parametrlari
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            [Co(en)₃]³⁺/²⁺ uchun standart CV sharoitlari. Pt elektrod, 0.1 M KCl, 25 mV/s skan tezligi (JUDA SEKIN!).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Ishchi elektrod</div>
              <div className="text-sm font-bold text-pink-400">Pt disk</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">E_pa (anod)</div>
              <div className="text-sm font-mono font-bold text-pink-400">{COMPOUND.cvParameters.E_pa}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">E_pc (katod)</div>
              <div className="text-sm font-mono font-bold text-pink-400">{COMPOUND.cvParameters.E_pc}</div>
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
            [Co(en)₃]Cl₃ va [Co(en)₃]Cl₂ uchun nazariy tarkib.
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
                  const elColor = el.includes("Co") ? "text-pink-400" : "text-purple-400"
                  const rowClass = el.includes("Co") ? "" : "opacity-60"
                  const trClass = "border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors " + rowClass
                  const tdElClass = "py-3 pl-2 font-bold " + elColor
                  return (
                    <tr key={el} className={trClass}>
                      <td className={tdElClass}>
                        {el.includes("Co_ox") ? "[Co(en)₃]Cl₃" : 
                         el.includes("Co_red") ? "[Co(en)₃]Cl₂" : 
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
            <span>📈</span> CV voltamperogramma (25 mV/s)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            [Co(en)₃]³⁺/²⁺ uchun tipik siklik voltamperogramma. ΔE = 150 mV — inert sistema (juda sekin elektron ko'chish).
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 300" className="w-full h-full overflow-visible">
              {/* Grid */}
              {[-0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v, i) => (
                <g key={i}>
                  <line x1="60" y1={30 + ((v + 0.8)/1.3)*240} x2="580" y2={30 + ((v + 0.8)/1.3)*240} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="55" y={34 + ((v + 0.8)/1.3)*240} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}V</text>
                </g>
              ))}

              {/* X axis */}
              {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((v, i) => (
                <g key={i}>
                  <text x={60 + ((v + 6)/12)*520} y="285" textAnchor="middle" fontSize="8" fill="#a78bfa">{v}</text>
                </g>
              ))}
              <text x="310" y="298" textAnchor="middle" fontSize="10" fill="#a78bfa">Tok (μA)</text>

              {/* Zero line */}
              <line x1="60" y1={30 + (6/12)*240} x2="580" y2={30 + (6/12)*240} stroke="#a78bfa" strokeWidth="1" />

              {/* CV curve */}
              <polyline
                fill="none" stroke="#ec4899" strokeWidth="2"
                points={COMPOUND.cvData.map(p => {
                  const x = 60 + ((p.potential + 0.8)/1.3)*520
                  const y = 30 + ((6 - p.current)/12)*240
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* E_pa marker */}
              <line x1={60 + ((-0.18 + 0.8)/1.3)*520} y1="30" x2={60 + ((-0.18 + 0.8)/1.3)*520} y2="270" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" />
              <text x={60 + ((-0.18 + 0.8)/1.3)*520} y="20" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">E_pa = -0.18V</text>

              {/* E_pc marker */}
              <line x1={60 + ((-0.33 + 0.8)/1.3)*520} y1="30" x2={60 + ((-0.33 + 0.8)/1.3)*520} y2="270" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2" />
              <text x={60 + ((-0.33 + 0.8)/1.3)*520 - 5} y="20" textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="bold">E_pc = -0.33V</text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-pink-500"></span> CV egri chiziq</span>
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
            Inert sistemada ΔE skan tezligi bilan kamayadi (juda sekin skan da muvozanatga yaqinlashadi). <strong className="text-pink-400">Ip ∝ v^(1/2)</strong> hali ham bajariladi.
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
                      <td className="py-2 px-3 font-mono text-pink-400 font-bold">{d.scanRate}</td>
                      <td className="py-2 px-3 text-center font-mono">{d.sqrtV.toFixed(3)}</td>
                      <td className="py-2 px-3 text-center font-mono text-pink-400">{d.Ipa.toFixed(1)}</td>
                      <td className="py-2 px-3 text-center font-mono text-pink-400">{d.Ipc.toFixed(1)}</td>
                      <td className="py-2 px-3 text-center font-mono">{ratio.toFixed(2)}</td>
                      <td className="py-2 px-3 text-center font-mono text-cyan-400">{(d.deltaE * 1000).toFixed(0)}</td>
                      <td className="py-2 px-3 text-center font-mono text-pink-400">{d.E12.toFixed(3)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-purple-400 italic">
            💡 <strong>Eslatma:</strong> Juda sekin skan tezligida ΔE kamayadi (250 → 110 mV), lekin hali ham inert sistema bo'lib qoladi.
          </p>
        </div>

        {/* 8. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> CV yugurishlari — turli sharoitlarda
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli skan tezliklari va sharoitlarda o'lchangan CV natijalari. ΔE = 150 mV bo'lishi kerak (inert sistema).
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isActive = activeRun === r.id
              const btnClass = isActive
                ? "bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-500/20"
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
                  <div className="flex justify-between items-center p-2 bg-pink-900/20 rounded border border-pink-500/20">
                    <span className="text-sm text-pink-400 font-medium">E_pa (anod):</span>
                    <span className="font-mono text-white text-lg">{run.E_pa.toFixed(3)} V</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-pink-900/20 rounded border border-pink-500/20">
                    <span className="text-sm text-pink-400 font-medium">E_pc (katod):</span>
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
                    <span className={`font-mono font-bold ${Math.abs(run.Ipa_Ipc - 0.70) <= 0.10 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {run.Ipa_Ipc.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Qaytariluvchanlik:</span>
                    <span className={`font-mono font-bold ${deltaE <= 0.160 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {deltaE <= 0.160 ? "Inert ✓" : "Juda sekin ✗"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-pink-400 mb-4 flex justify-between">
                <span>ΔE Qiymatlari (mV) — turli sharoitlarda</span>
                <span className="text-[10px] text-purple-500 font-normal">Ideal: 150 mV (inert)</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const val = r.deltaE * 1000
                  const heightPct = Math.min((val / 300) * 100, 100)
                  const isActive = r.id === activeRun
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isBad = val > 200
                  let barClass = "w-full rounded-t transition-all duration-500 z-10 bg-purple-700/40"
                  if (isActive) {
                    if (isBlank) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-gray-500"
                    else if (isStd) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-500"
                    else if (isBad) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    else barClass = "w-full rounded-t transition-all duration-500 z-10 bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]"
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
                        <div className="absolute w-[120%] border-t border-dashed border-pink-400/50 z-0" style={{ bottom: `${(150/300)*100}%` }}></div>

                        <div 
                          className={barClass}
                          style={{ height: `${Math.max(heightPct, 1)}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-cyan-400' : isBad ? 'text-red-400' : 'text-pink-400') : 'text-purple-600'} font-bold`}>
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
        <div className="bg-pink-900/20 border border-pink-500/30 rounded-2xl p-6">
          <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Nernst tenglamasi interaktiv kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            [Ox]/[Red] nisbatini o'zgartiring — <strong className="text-pink-300">potensial E</strong> avtomatik hisoblanadi. E° juda past (-0.26 V)!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Ox] = [Co(en)₃³⁺] (mM):</label>
              <input 
                type="number" step="0.1" value={oxConc}
                onChange={(e) => setOxConc(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Red] = [Co(en)₃²⁺] (mM):</label>
              <input 
                type="number" step="0.1" value={redConc}
                onChange={(e) => setRedConc(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">E° (V vs SHE):</label>
              <input 
                type="number" step="0.01" value={nernstE0}
                onChange={(e) => setNernstE0(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">[Ox]/[Red]:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{(oxConc/redConc).toFixed(3)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">E (V vs SHE):</div>
                <div className="text-xl font-mono font-bold text-pink-400">{nernstE.toFixed(3)} V</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Holat:</div>
                <div className={`text-xl font-mono font-bold ${
                  oxConc > redConc ? 'text-yellow-400' : oxConc < redConc ? 'text-pink-400' : 'text-cyan-400'
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
                <div className="text-xl font-mono font-bold text-green-400">7.5 × 10⁻⁶ cm²/s</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Ip = 2.69×10⁵ × 1^(3/2) × {diffArea} × D^(1/2) × {diffConc}×10⁻³ × ({diffScanRate}/1000)^(1/2)
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Mos kelish:</strong> {Math.abs(calcDiff - 7.5e-6) / 7.5e-6 * 100 < 10 ? "✓ Adabiy qiymatga yaqin" : "⚠ Adabiy qiymatdan farqli — tekshirish kerak"}
            </p>
          </div>
        </div>

        {/* 11. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> CV uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Co(en)₃]³⁺/²⁺ uchun standart CV sharoitlari. 0.1 M KCl elektrolit, 25 mV/s skan tezligi (JUDA SEKIN!).
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => {
                const isActive = activePrepStep === s.step
                const btnClass = isActive
                  ? "w-full text-left p-3 rounded-lg border transition-all bg-pink-900/40 border-pink-500"
                  : "w-full text-left p-3 rounded-lg border transition-all bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                return (
                  <button
                    key={s.step}
                    onClick={() => setActivePrepStep(s.step)}
                    className={btnClass}
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

        {/* 12. CV KALKULYATORI */}
        <div className="bg-pink-900/20 border border-pink-500/30 rounded-2xl p-6">
          <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> CV dan E₁/₂ va ΔE hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            E_pa va E_pc kiriting — <strong className="text-pink-300">E₁/₂</strong> va <strong className="text-pink-300">ΔE</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">E_pa (anod pik, V):</label>
              <input 
                type="number" step="0.001" value={customEpa}
                onChange={(e) => setCustomEpa(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">E_pc (katod pik, V):</label>
              <input 
                type="number" step="0.001" value={customEpc}
                onChange={(e) => setCustomEpc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">E₁/₂:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{calcResult.E12.toFixed(3)} V</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">ΔE:</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{(calcResult.deltaE * 1000).toFixed(0)} mV</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Qaytariluvchanlik:</div>
                <div className={`text-xl font-mono font-bold ${calcResult.isReversible ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.isReversible ? "Inert ✓" : "Juda sekin ✗"}
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: E₁/₂ = (E_pa + E_pc) / 2; ΔE = E_pa − E_pc; Ideal (inert): ΔE = 150 mV
            </p>
          </div>
        </div>

        {/* 13. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> CV ga yaqin tahlil usullari bilan solishtirish
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

          <div className="mt-5 bg-pink-900/20 border border-pink-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-pink-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">CV (E₁/₂, ΔE) + UV-Vis (475 nm, 500 nm) + Magnit (μ) + AAS/ICP (Co%) + XRD (geometriya)</strong> — beshta metod birgalikda [Co(en)₃]³⁺/²⁺ juftligini to'liq tavsiflaydi va xelat effektini aniqlaydi.
            </p>
          </div>
        </div>

        {/* 14. CO KOMPLEKSLARI TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> Co komplekslarining redoks potensiallari
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Ligand maydon kuchiga qarab E° o'zgaradi: kuchli maydon ligandlari Co³⁺ ni juda barqarorlashtiradi va E° ni juda pasaytiradi.
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
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${c.name.includes("[Co(en)₃]") ? 'bg-pink-900/20' : ''}`}>
                    <td className="py-2 px-3 font-bold text-pink-400">{c.name}</td>
                    <td className="py-2 px-3 text-center font-mono text-pink-400">{c.E0}</td>
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
              <p className="text-xs text-purple-200">E₁/₂ va ΔE orqali redoks xossalarini aniqlaydi. Xelat effektini ko'rsatadi. E° = -0.26 V.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Inert sistema. ΔE 150 mV — juda katta. Co³⁺/Co²⁺ ni farqlash uchun magnit o'lchash kerak.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">UV-Vis (475 nm), Magnit (μ), AAS/ICP (Co%), XRD (geometriya) — to'liq tahlil uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/elektrokimyo" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Elektrokimyoviy tahlil
            </Link>
            <Link href="/ilmiy/tahlil/elektrokimyo/birikmalar" className="text-sm bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(en)₃]³⁺/²⁺ • Elektrokimyoviy tahlil moduli</p>
          <p className="mt-1">Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC, Schwarzenbach (1930)</p>
        </div>
      </footer>
    </main>
  )
}