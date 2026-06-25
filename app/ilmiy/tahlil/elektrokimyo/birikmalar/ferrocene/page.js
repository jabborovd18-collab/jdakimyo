"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Fe(C₅H₅)₂]⁺/⁰ — ELEKTROKIMYOWIY TAHLIL MAHSUS SAHIFASI
// Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC, Fischer & Wilkinson (1973)
// Xususiyat: Ichki standart, ideal qaytar sistema, 18 elektron qoidasi
// O'ziga xoslik: Metallocene sandwich struktura, Nobel 1973
// Maqsad: Faqat elektrokimyoviy tahlil bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Fe: 55.845, C: 12.011, H: 1.008
}

const COMPOUND = {
  formulaHTML: "[Fe(C<sub>5</sub>H<sub>5</sub>)<sub>2</sub>]<sup>+/0</sup>",
  formulaPlain: "[Fe(C5H5)2]+/0",
  iupac_ox: "Ferroseniy (bis(η⁵-siklopentadienil)temir(III))",
  iupac_red: "Ferrosen (bis(η⁵-siklopentadienil)temir(II))",
  formulaOx: "[Fe(C₅H₅)₂]⁺",
  formulaRed: "[Fe(C₅H₅)₂]",
  commonOx: "Ferroseniy (ko'k rang)",
  commonRed: "Ferrosen (to'q sariq)",
  molarMassOx: 186.03,
  molarMassRed: 186.03,
  casOx: "12707-33-4",
  casRed: "102-54-5",
  colorOx: "ko'k (oksidlangan)",
  colorRed: "to'q sariq (qaytarilgan)",
  
  historicalFact: {
    title: "Metallocene — sandwich struktura kashfiyoti (Nobel 1973)",
    text: "[Fe(C₅H₅)₂] (ferrosen) — 1951-yilda Pauson va Kealy tomonidan tasodifan kashf etilgan. Dastlab ular σ-bog'li strukturani taklif qilishdi, lekin 1952-yilda Ernst Otto Fischer va Geoffrey Wilkinson mustaqil ravishda 'sandwich' strukturasini taklif qilishdi — Fe²⁺ ikkita parallel C₅H₅⁻ halqalari orasida joylashgan. Bu kashfiyot organometallik kimyo sohasini yaratdi va Fischer bilan Wilkinson 1973-yilda Nobel mukofotini olishdi. Ferrosen 18 elektron qoidasiga bo'ysunadi — bu uni juda barqaror qiladi. Qiziq fakt: ferrosen elektrokimyoda universal ichki standart sifatida ishlatiladi — potensial erituvchiga bog'liq emas (E° = +0.40 V vs SHE barcha erituvchilarda). Bu uni elektrokimyoviy tajribalarda eng ko'p ishlatiladigan birikma qiladi!",
    year: "1951-1973"
  },

  electrochemicalFeature: {
    title: "[Fe(C₅H₅)₂]⁺/⁰ — ideal qaytar sistema va ichki standart",
    description: "Bu juftlik elektrokimyoda eng ideal qaytar sistema. 18 elektron qoidasi ferrosenni juda barqaror qiladi, ferroseniy esa 17 elektron (paramagnit).",
    reaction: {
      half: "[Fe(C₅H₅)₂] ⇌ [Fe(C₅H₅)₂]⁺ + e⁻",
      E0: "+0.40 V (vs SHE)",
      E0_AgAgCl: "+0.18 V (vs Ag/AgCl)",
      n: 1,
      deltaE: "59 mV (ideal qaytar sistema, n=1)"
    },
    problem: {
      title: "18 elektron qoidasi — barqarorlik chegarasi",
      description: "Ferrosen (Fe²⁺, d⁶) 18 elektronga ega — bu uni juda barqaror qiladi. Ferroseniy (Fe³⁺, d⁵) esa 17 elektronga ega — paramagnit, lekin hali ham barqaror.",
      impact: "CV da ideal qaytar sistema — ΔE = 59 mV, Ipa/Ipc = 1.0. Bu elektrokimyoda 'oltin standart' hisoblanadi."
    },
    solution: {
      title: "Ichki standart sifatida ishlatish",
      description: "Ferrosen potensial erituvchiga bog'liq emas — barcha organik erituvchilarda E° ≈ +0.40 V. Bu uni universal ichki standart qiladi.",
      mechanism: "Ferrosen qo'shilganida, uning potensiali boshqa redoks juftliklar uchun solishtirma sifatida ishlatiladi. Bu erituvchi ta'sirini kamaytiradi."
    }
  },

  cvParameters: {
    electrode: "Pt disk elektrod yoki Au elektrod",
    reference: "Ag/AgCl (3M KCl) yoki SHE",
    auxiliary: "Pt sim",
    electrolyte: "0.1 M TBAPF₆ (CH₂Cl₂ yoki CH₃CN)",
    scanRate: "100 mV/s (standart)",
    potentialWindow: "-0.2 V dan +0.8 V gacha (vs Ag/AgCl)",
    E_pa: "+0.21 V (anod pik, Fe²⁺ → Fe³⁺)",
    E_pc: "+0.15 V (katod pik, Fe³⁺ → Fe²⁺)",
    deltaE: "59 mV (ideal qaytar)",
    Ipa_Ipc: "≈ 1.00 (ideal qaytar sistema)",
    D: "2.4 × 10⁻⁵ cm²/s (25°C da, CH₂Cl₂ da)"
  },

  theoretical: {
    Fe_ox:  { mass: 55.845,  percent: 30.02, source: "Fe³⁺ markaziy atom (ferroseniy)", signal: "Oksidlovchi pik (anod)" },
    Fe_red: { mass: 55.845,  percent: 30.02, source: "Fe²⁺ markaziy atom (ferrosen)", signal: "Qaytaruvchi pik (katod)" },
    C:      { mass: 120.110, percent: 64.56, source: "2×C₅H₅ (10×C)", signal: "CV da ko'rinmaydi" },
    H:      { mass: 10.080,  percent: 5.42,  source: "2×C₅H₅ (10×H)", signal: "CV da ko'rinmaydi" }
  },

  // CV voltamperogramma ma'lumotlari (100 mV/s)
  cvData: [
    { potential: -0.20, current: 0.0 },
    { potential: -0.10, current: -0.1 },
    { potential: 0.00, current: -0.3 },
    { potential: 0.05, current: -1.0 },
    { potential: 0.10, current: -3.0 },
    { potential: 0.13, current: -8.0 },
    { potential: 0.15, current: -14.0 },
    { potential: 0.17, current: -8.0 },
    { potential: 0.19, current: -3.0 },
    { potential: 0.21, current: 8.0 },
    { potential: 0.23, current: 14.0 },
    { potential: 0.25, current: 8.0 },
    { potential: 0.27, current: 3.0 },
    { potential: 0.30, current: 1.0 },
    { potential: 0.40, current: 0.3 },
    { potential: 0.50, current: 0.1 },
    { potential: 0.60, current: 0.05 },
    { potential: 0.70, current: 0.02 },
    { potential: 0.80, current: 0.01 }
  ],

  // Skan tezligi bo'yicha ma'lumotlar
  scanRateData: [
    { scanRate: 25,  Ipa: 7.0,  Ipc: -7.0, deltaE: 0.059, E12: 0.180, sqrtV: 0.158 },
    { scanRate: 50,  Ipa: 9.9,  Ipc: -9.9, deltaE: 0.059, E12: 0.180, sqrtV: 0.224 },
    { scanRate: 100, Ipa: 14.0, Ipc: -14.0, deltaE: 0.059, E12: 0.180, sqrtV: 0.316 },
    { scanRate: 200, Ipa: 19.8, Ipc: -19.8, deltaE: 0.059, E12: 0.180, sqrtV: 0.447 },
    { scanRate: 500, Ipa: 31.3, Ipc: -31.3, deltaE: 0.059, E12: 0.180, sqrtV: 0.707 },
    { scanRate: 1000, Ipa: 44.3, Ipc: -44.3, deltaE: 0.059, E12: 0.180, sqrtV: 1.000 }
  ],

  experimentalRuns: [
    { id: "CV-24-401", date: "2025-05-15", E_pa: 0.210, E_pc: 0.150, deltaE: 0.060, Ipa_Ipc: 1.00, E12: 0.180, scanRate: 100, note: "Toza ferrosen, 0.1 M TBAPF₆, CH₂Cl₂" },
    { id: "CV-24-402", date: "2025-05-15", E_pa: 0.210, E_pc: 0.150, deltaE: 0.060, Ipa_Ipc: 1.00, E12: 0.180, scanRate: 100, note: "Ikkinchi sikl — mukammal qaytar" },
    { id: "CV-24-403", date: "2025-05-15", E_pa: 0.210, E_pc: 0.150, deltaE: 0.060, Ipa_Ipc: 1.00, E12: 0.180, scanRate: 50, note: "50 mV/s — ideal qaytar" },
    { id: "CV-24-404", date: "2025-05-15", E_pa: 0.215, E_pc: 0.145, deltaE: 0.070, Ipa_Ipc: 1.02, E12: 0.180, scanRate: 200, note: "200 mV/s — deyarli ideal" },
    { id: "CV-24-405", date: "2025-05-16", E_pa: 0.210, E_pc: 0.150, deltaE: 0.060, Ipa_Ipc: 1.00, E12: 0.180, scanRate: 100, note: "Au elektrod ishlatildi" },
    { id: "CV-24-406", date: "2025-05-16", E_pa: 0.220, E_pc: 0.140, deltaE: 0.080, Ipa_Ipc: 1.05, E12: 0.180, scanRate: 500, note: "Juda tez skan — biroz kengaygan" },
    { id: "CV-24-407", date: "2025-05-17", E_pa: 0.210, E_pc: 0.150, deltaE: 0.060, Ipa_Ipc: 1.00, E12: 0.180, scanRate: 100, note: "CH₃CN erituvchi ishlatildi" },
    { id: "CV-24-408", date: "2025-05-17", E_pa: 0.210, E_pc: 0.150, deltaE: 0.060, Ipa_Ipc: 1.00, E12: 0.180, scanRate: 100, note: "Ferrosen + ferroseniy aralashmasi (1:1)" },
    { id: "BLANK-05",   date: "2025-05-15", E_pa: 0.000, E_pc: 0.000, deltaE: 0.000, Ipa_Ipc: 0.00, E12: 0.000, scanRate: 100, note: "Blank (0.1 M TBAPF₆, CH₂Cl₂, elektrod faqat)" },
    { id: "STD-FERRO",  date: "2025-05-15", E_pa: 0.210, E_pc: 0.150, deltaE: 0.060, Ipa_Ipc: 1.00, E12: 0.180, scanRate: 100, note: "Standart ferrosen 1 mM" }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "Ferrosen zaharli emas, lekin Fe zaharli. Qo'lqop va himoya ko'zoynaklari majburiy. CH₂Cl₂ — zaharli organik erituvchi, ventilyatsiya zarur.", time: "doimiy", critical: true },
    { step: 2, title: "Eritma tayyorlash (1 mM)", desc: "Analitik tarozida 18.6 mg ferrosen tortilib, 100 mL CH₂Cl₂ da eritiladi. 0.1 M TBAPF₆ elektrolit qo'shiladi.", time: "5 daq", critical: true },
    { step: 3, title: "Elektrolit tayyorlash", desc: "0.1 M TBAPF₆ (tetrabutilammoniy geksaflorofosfat) CH₂Cl₂ da tayyorlanadi. Elektrolit ion kuchini ta'minlaydi.", time: "5 daq", critical: true },
    { step: 4, title: "Elektrod tozalash", desc: "Pt disk elektrod alumina kukuni (0.05 μm) bilan tozalanadi, CH₂Cl₂ bilan yuviladi, ultratovushda 1 daqiqa yuviladi.", time: "5 daq", critical: true },
    { step: 5, title: "Elektrokimyoviy cell yig'ish", desc: "Uch elektrodli cell: ishchi (Pt disk), solishtirma (Ag/AgCl), yordamchi (Pt sim). Eritma azot bilan 5 daqiqa degazatsiya qilinadi.", time: "5 daq", critical: true },
    { step: 6, title: "CV o'lchash (oldinga)", desc: "Potensial -0.2 V dan +0.8 V gacha 100 mV/s da skan qilinadi. Katod pik (Fe³⁺ → Fe²⁺) kuzatiladi.", time: "10 son", critical: false },
    { step: 7, title: "CV o'lchash (orqaga)", desc: "Potensial +0.8 V dan -0.2 V gacha qaytariladi. Anod pik (Fe²⁺ → Fe³⁺) kuzatiladi. ΔE hisoblanadi.", time: "10 son", critical: false },
    { step: 8, title: "Ko'p sikl (stabilite)", desc: "10 ta sikl bajarilib, stabilite tekshiriladi. Ferrosen ideal qaytar — barcha sikllar bir xil bo'lishi kerak.", time: "5 daq", critical: false },
    { step: 9, title: "Natijalarni hisoblash", desc: "E_pa, E_pc, ΔE, Ipa/Ipc, E₁/₂ hisoblanadi. ΔE = 59 mV, Ipa/Ipc = 1.00 bo'lishi kerak (ideal qaytar).", time: "3 daq", critical: false }
  ],

  nernstEquation: {
    title: "Nernst tenglamasi — Ferrosen/Ferroseniy uchun",
    equation: "E = E° + (RT/nF) × ln([Ferrocenium]/[Ferrocene])",
    simplified: "E = 0.40 + 0.059 × log([Ox]/[Red])",
    explanation: "Bu yerda E° = +0.40 V (vs SHE), n = 1 (bir elektron). Agar [Ox] = [Red] bo'lsa, E = E° = +0.40 V. Ferrosen potensial erituvchiga bog'liq emas!"
  },

  relatedMethods: [
    {
      name: "AAS / ICP-OES",
      role: "Fe miqdorini aniqlaydi (30.02%)",
      cvAdvantage: "CV redoks xossalarini ko'rsatadi",
      cvDisadvantage: "AAS/ICP miqdoriy, CV sifat",
      complementarity: "95%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Ferrosen (440 nm, sariq) va ferroseniy (620 nm, ko'k)",
      cvAdvantage: "UV-Vis rang va konsentratsiyani ko'rsatadi",
      cvDisadvantage: "CV redoks potensialni, UV-Vis spektrni",
      complementarity: "92%"
    },
    {
      name: "¹H YaMR",
      role: "Ferrosen (δ = 4.15 ppm, singlet) — diamagnit",
      cvAdvantage: "YaMR molekulyar strukturani ko'rsatadi",
      cvDisadvantage: "CV redoks, YaMR struktura",
      complementarity: "97%"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      role: "Sandwich strukturani ko'rsatadi (Fe-C 2.04 Å)",
      cvAdvantage: "XRD strukturani, CV redoks xossalarini ko'rsatadi",
      cvDisadvantage: "Birgalikda to'liq validatsiya",
      complementarity: "90%"
    }
  ],

  // Boshqa metallocenlar bilan taqqoslash
  comparisonComplexes: [
    {
      name: "[Fe(C₅H₅)₂]⁺/⁰",
      E0: "+0.40 V",
      config: "d⁶ (18 e⁻) / d⁵ (17 e⁻)",
      Kstab: "juda barqaror",
      color: "sariq/ko'k",
      notes: "Ideal qaytar — ichki standart"
    },
    {
      name: "[Co(C₅H₅)₂]⁺/⁰",
      E0: "-1.33 V",
      config: "d⁸ (20 e⁻) / d⁷ (19 e⁻)",
      Kstab: "barqaror",
      color: "qizil/qora",
      notes: "20 elektron — anti-aromatik, juda qaytaruvchi"
    },
    {
      name: "[Ni(C₅H₅)₂]",
      E0: "—",
      config: "d¹⁰ (20 e⁻)",
      Kstab: "barqaror",
      color: "yashil",
      notes: "20 elektron — redoks faol emas"
    },
    {
      name: "[Ru(C₅H₅)₂]",
      E0: "+0.60 V",
      config: "d⁸ (18 e⁻) / d⁷ (17 e⁻)",
      Kstab: "juda barqaror",
      color: "sariq/ko'k",
      notes: "Ru — 4d metall, ferrosendan yuqori E°"
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

function calculateNernstPotential(oxConc, redConc, E0 = 0.40) {
  if (redConc <= 0) return Infinity
  return E0 + 0.059 * Math.log10(oxConc / redConc)
}

function getStatusColor(deltaE) {
  if (deltaE <= 0.065) return "text-green-400"
  if (deltaE <= 0.075) return "text-yellow-400"
  return "text-red-400"
}

export default function FerrocenePage() {
  const [activeRun, setActiveRun] = useState("CV-24-401")
  const [customEpa, setCustomEpa] = useState(0.21)
  const [customEpc, setCustomEpc] = useState(0.15)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showNernstModal, setShowNernstModal] = useState(false)
  const [showStandardModal, setShowStandardModal] = useState(true)
  
  // Nernst kalkulyator
  const [oxConc, setOxConc] = useState(1.0)
  const [redConc, setRedConc] = useState(1.0)
  const [nernstE0, setNernstE0] = useState(0.40)
  
  // Diffuziya kalkulyatori
  const [diffIpa, setDiffIpa] = useState(14.0)
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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-amber-950/20 to-blue-950 text-white">
      
      {/* ICHKI STANDART OGOHLANTIRISH MODALI */}
      {showStandardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-amber-950 to-yellow-950 border-2 border-amber-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⭐</span> FERROSEN — ELEKTROKIMYO ICHKI STANDARTI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-amber-300">Ferrosen [Fe(C₅H₅)₂]</strong> elektrokimyoda <strong className="text-amber-300">universal ichki standart</strong> sifatida ishlatiladi!
            </p>
            
            <div className="bg-amber-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-amber-400 font-bold mb-2">⭐ Nima uchun ichki standart?</div>
                  <div className="text-purple-200">
                    Potensial <strong>erituvchiga bog'liq emas</strong> — barcha organik erituvchilarda E° ≈ +0.40 V.
                  </div>
                  <div className="text-purple-200 mt-2">
                    Ideal qaytar sistema — ΔE = 59 mV, Ipa/Ipc = 1.00.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">✅ 18 elektron qoidasi:</div>
                  <div className="text-purple-200">
                    Ferrosen (Fe²⁺, d⁶) — <strong>18 elektron</strong> — juda barqaror.
                  </div>
                  <div className="text-purple-200 mt-2">
                    Ferroseniy (Fe³⁺, d⁵) — 17 elektron — paramagnit.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-amber-300">Nobel 1973:</strong> Fischer va Wilkinson — sandwich struktura kashfiyoti!
              </p>
            </div>

            <button 
              onClick={() => setShowStandardModal(false)}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
            <span className="text-amber-400 font-semibold">[Fe(C₅H₅)₂]⁺/⁰</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-amber-400 flex items-center gap-2">
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
                M = {COMPOUND.molarMassRed} g/mol • CAS: {COMPOUND.casRed}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Fe²⁺/Fe³⁺</span>
                <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Metallocene</span>
                <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">E° = +0.40 V</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">⭐ Ichki standart</span>
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
        <div className="bg-gradient-to-r from-amber-900/40 to-purple-900/40 border border-amber-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (elektrokimyoviy tahlil uchun)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Fe(C₅H₅)₂]⁺/⁰</strong> — elektrokimyoda eng ideal qaytar sistema va universal ichki standart. 18 elektron qoidasi ferrosenni juda barqaror qiladi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-amber-500 text-xs md:text-sm">
                <li><strong className="text-white">Bir elektronli qaytar</strong>: Fe²⁺ ⇌ Fe³⁺ + e⁻</li>
                <li>E° = <strong className="text-amber-400">+0.40 V</strong> (vs SHE) — erituvchiga bog'liq emas!</li>
                <li>ΔE = <strong className="text-green-300">59 mV</strong> (ideal qaytar, n=1)</li>
                <li>Ipa/Ipc = <strong className="text-green-300">1.00</strong> (ideal qaytar)</li>
                <li><strong className="text-amber-300">18 elektron</strong> — ferrosen juda barqaror</li>
                <li>D = <strong className="text-amber-300">2.4 × 10⁻⁵ cm²/s</strong> (juda yuqori diffuziya)</li>
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

        {/* 2. ICHKI STANDART VA 18 ELEKTRON */}
        <div className="bg-gradient-to-r from-amber-900/40 to-red-900/40 border-2 border-amber-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⭐</span> {COMPOUND.electrochemicalFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.electrochemicalFeature.description}
          </p>

          <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
            <div className="text-center text-lg font-mono text-amber-400 mb-2">
              {COMPOUND.electrochemicalFeature.reaction.half}
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-amber-400">E°(SHE) = {COMPOUND.electrochemicalFeature.reaction.E0}</span>
              <span className="text-amber-400">E°(Ag/AgCl) = {COMPOUND.electrochemicalFeature.reaction.E0_AgAgCl}</span>
              <span className="text-amber-400">n = {COMPOUND.electrochemicalFeature.reaction.n}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-950/40 rounded-xl p-5 border-2 border-red-500/50">
              <h3 className="text-red-400 font-bold text-sm mb-3">⭐ {COMPOUND.electrochemicalFeature.problem.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-red-400 font-bold">18 elektron qoidasi:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.electrochemicalFeature.problem.description}</div>
                </div>
                <div className="bg-red-900/30 rounded p-2">
                  <div className="text-red-300 font-bold">Natija:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.electrochemicalFeature.problem.impact}</div>
                </div>
              </div>
            </div>

            <div className="bg-green-950/40 rounded-xl p-5 border-2 border-green-500/50">
              <h3 className="text-green-400 font-bold text-sm mb-3">✅ {COMPOUND.electrochemicalFeature.solution.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-green-400 font-bold">Universal standart:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.electrochemicalFeature.solution.description}</div>
                </div>
                <div className="bg-green-900/30 rounded p-2">
                  <div className="text-green-300 font-bold">Mexanizm:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.electrochemicalFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowStandardModal(true)}
            className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
          >
            ⭐ Ichki standart haqida batafsil →
          </button>
        </div>

        {/* 3. CV PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> CV o'lchash parametrlari
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Ferrosen uchun standart CV sharoitlari. Pt elektrod, 0.1 M TBAPF₆ (CH₂Cl₂), 100 mV/s skan tezligi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Ishchi elektrod</div>
              <div className="text-sm font-bold text-amber-400">Pt disk</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">E_pa (anod)</div>
              <div className="text-sm font-mono font-bold text-amber-400">{COMPOUND.cvParameters.E_pa}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">E_pc (katod)</div>
              <div className="text-sm font-mono font-bold text-amber-400">{COMPOUND.cvParameters.E_pc}</div>
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

        {/* 5. NAZARIY TARKIB */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📐</span> Nazariy element tarkibi
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Ferrosen va ferroseniy uchun nazariy tarkib. Ikkalasining ham molyar massasi bir xil!
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
                  const elColor = el.includes("Fe") ? "text-amber-400" : "text-purple-400"
                  const rowClass = el.includes("Fe") ? "" : "opacity-60"
                  const trClass = "border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors " + rowClass
                  const tdElClass = "py-3 pl-2 font-bold " + elColor
                  return (
                    <tr key={el} className={trClass}>
                      <td className={tdElClass}>
                        {el.includes("Fe_ox") ? "Ferroseniy" : 
                         el.includes("Fe_red") ? "Ferrosen" : el}
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
            Ferrosen uchun tipik siklik voltamperogramma. ΔE = 59 mV — ideal qaytar sistema. Ipa/Ipc = 1.00.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 300" className="w-full h-full overflow-visible">
              {/* Grid */}
              {[-0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].map((v, i) => (
                <g key={i}>
                  <line x1="60" y1={30 + ((v + 0.2)/1.0)*240} x2="580" y2={30 + ((v + 0.2)/1.0)*240} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="55" y={34 + ((v + 0.2)/1.0)*240} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}V</text>
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
                fill="none" stroke="#f59e0b" strokeWidth="2"
                points={COMPOUND.cvData.map(p => {
                  const x = 60 + ((p.potential + 0.2)/1.0)*520
                  const y = 30 + ((15 - p.current)/30)*240
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* E_pa marker */}
              <line x1={60 + ((0.21 + 0.2)/1.0)*520} y1="30" x2={60 + ((0.21 + 0.2)/1.0)*520} y2="270" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" />
              <text x={60 + ((0.21 + 0.2)/1.0)*520} y="20" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">E_pa = +0.21V</text>

              {/* E_pc marker */}
              <line x1={60 + ((0.15 + 0.2)/1.0)*520} y1="30" x2={60 + ((0.15 + 0.2)/1.0)*520} y2="270" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2" />
              <text x={60 + ((0.15 + 0.2)/1.0)*520 - 5} y="20" textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="bold">E_pc = +0.15V</text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-amber-500"></span> CV egri chiziq</span>
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
            Ideal qaytar sistemada ΔE skan tezligiga bog'liq emas — doimo 59 mV. <strong className="text-amber-400">Ip ∝ v^(1/2)</strong> — diffuziya nazorati.
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
                      <td className="py-2 px-3 font-mono text-amber-400 font-bold">{d.scanRate}</td>
                      <td className="py-2 px-3 text-center font-mono">{d.sqrtV.toFixed(3)}</td>
                      <td className="py-2 px-3 text-center font-mono text-amber-400">{d.Ipa.toFixed(1)}</td>
                      <td className="py-2 px-3 text-center font-mono text-amber-400">{d.Ipc.toFixed(1)}</td>
                      <td className="py-2 px-3 text-center font-mono">{ratio.toFixed(2)}</td>
                      <td className="py-2 px-3 text-center font-mono text-cyan-400">{(d.deltaE * 1000).toFixed(0)}</td>
                      <td className="py-2 px-3 text-center font-mono text-amber-400">{d.E12.toFixed(3)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-purple-400 italic">
            💡 <strong>Eslatma:</strong> Ferrosen ideal qaytar sistema — ΔE doimo 59 mV, Ipa/Ipc = 1.00. Bu elektrokimyoning "oltin standarti".
          </p>
        </div>

        {/* 8. LABORATORIYA NATIJALARI */}
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
                ? "bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/20"
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
                  <div className="flex justify-between items-center p-2 bg-amber-900/20 rounded border border-amber-500/20">
                    <span className="text-sm text-amber-400 font-medium">E_pa (anod):</span>
                    <span className="font-mono text-white text-lg">{run.E_pa.toFixed(3)} V</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-amber-900/20 rounded border border-amber-500/20">
                    <span className="text-sm text-amber-400 font-medium">E_pc (katod):</span>
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
                      {deltaE <= 0.065 ? "Ideal ✓" : "Qaytmas ✗"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-amber-400 mb-4 flex justify-between">
                <span>ΔE Qiymatlari (mV) — turli sharoitlarda</span>
                <span className="text-[10px] text-purple-500 font-normal">Ideal: 59 mV</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const val = r.deltaE * 1000
                  const heightPct = Math.min((val / 100) * 100, 100)
                  const isActive = r.id === activeRun
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isBad = val > 70
                  let barClass = "w-full rounded-t transition-all duration-500 z-10 bg-purple-700/40"
                  if (isActive) {
                    if (isBlank) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-gray-500"
                    else if (isStd) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-cyan-500"
                    else if (isBad) barClass = "w-full rounded-t transition-all duration-500 z-10 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    else barClass = "w-full rounded-t transition-all duration-500 z-10 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
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
                        <div className="absolute w-[120%] border-t border-dashed border-amber-400/50 z-0" style={{ bottom: `${(59/100)*100}%` }}></div>

                        <div 
                          className={barClass}
                          style={{ height: `${Math.max(heightPct, 1)}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-cyan-400' : isBad ? 'text-red-400' : 'text-amber-400') : 'text-purple-600'} font-bold`}>
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
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6">
          <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Nernst tenglamasi interaktiv kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            [Ox]/[Red] nisbatini o'zgartiring — <strong className="text-amber-300">potensial E</strong> avtomatik hisoblanadi. Ferrosen potensial erituvchiga bog'liq emas!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Ox] = [Ferrocenium] (mM):</label>
              <input 
                type="number" step="0.1" value={oxConc}
                onChange={(e) => setOxConc(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-amber-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Red] = [Ferrocene] (mM):</label>
              <input 
                type="number" step="0.1" value={redConc}
                onChange={(e) => setRedConc(Math.max(0.001, Number(e.target.value)))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-amber-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">E° (V vs SHE):</label>
              <input 
                type="number" step="0.01" value={nernstE0}
                onChange={(e) => setNernstE0(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-amber-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">[Ox]/[Red]:</div>
                <div className="text-xl font-mono font-bold text-amber-400">{(oxConc/redConc).toFixed(3)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">E (V vs SHE):</div>
                <div className="text-xl font-mono font-bold text-amber-400">{nernstE.toFixed(3)} V</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Holat:</div>
                <div className={`text-xl font-mono font-bold ${
                  oxConc > redConc ? 'text-yellow-400' : oxConc < redConc ? 'text-amber-400' : 'text-cyan-400'
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
                <div className="text-xl font-mono font-bold text-green-400">2.4 × 10⁻⁵ cm²/s</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Ip = 2.69×10⁵ × 1^(3/2) × {diffArea} × D^(1/2) × {diffConc}×10⁻³ × ({diffScanRate}/1000)^(1/2)
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Mos kelish:</strong> {Math.abs(calcDiff - 2.4e-5) / 2.4e-5 * 100 < 10 ? "✓ Adabiy qiymatga yaqin" : "⚠ Adabiy qiymatdan farqli — tekshirish kerak"}
            </p>
          </div>
        </div>

        {/* 11. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> CV uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            Ferrosen uchun standart CV sharoitlari. CH₂Cl₂ organik erituvchi, TBAPF₆ elektrolit.
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

        {/* 12. CV KALKULYATORI */}
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6">
          <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> CV dan E₁/₂ va ΔE hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            E_pa va E_pc kiriting — <strong className="text-amber-300">E₁/₂</strong> va <strong className="text-amber-300">ΔE</strong> avtomatik hisoblanadi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">E_pa (anod pik, V):</label>
              <input 
                type="number" step="0.001" value={customEpa}
                onChange={(e) => setCustomEpa(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-amber-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">E_pc (katod pik, V):</label>
              <input 
                type="number" step="0.001" value={customEpc}
                onChange={(e) => setCustomEpc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-amber-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">E₁/₂:</div>
                <div className="text-xl font-mono font-bold text-amber-400">{calcResult.E12.toFixed(3)} V</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">ΔE:</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{(calcResult.deltaE * 1000).toFixed(0)} mV</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Qaytariluvchanlik:</div>
                <div className={`text-xl font-mono font-bold ${calcResult.isReversible ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.isReversible ? "Ideal ✓" : "Qaytmas ✗"}
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: E₁/₂ = (E_pa + E_pc) / 2; ΔE = E_pa − E_pc; Ideal: ΔE = 59 mV (n=1)
            </p>
          </div>
        </div>

        {/* 13. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-amber-900/40 to-purple-900/40 border border-amber-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> CV ga yaqin tahlil usullari bilan solishtirish
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

          <div className="mt-5 bg-amber-900/20 border border-amber-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-amber-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">CV (E₁/₂, ΔE) + UV-Vis (440 nm, 620 nm) + ¹H YaMR (δ = 4.15 ppm) + AAS/ICP (Fe%) + XRD (sandwich)</strong> — beshta metod birgalikda ferrosenni to'liq tavsiflaydi va ichki standart sifatini tasdiqlaydi.
            </p>
          </div>
        </div>

        {/* 14. METALLOCENLAR TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> Metallocenlarning redoks potensiallari
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Metall turiga qarab E° o'zgaradi. Ferrosen ichki standart — boshqa metallocenlar uchun solishtirma.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 text-xs uppercase tracking-wider">
                  <th className="py-2 px-3 text-left">Metallocene</th>
                  <th className="py-2 px-3 text-center">E° (V vs SHE)</th>
                  <th className="py-2 px-3 text-center">Elektronlar</th>
                  <th className="py-2 px-3 text-center">Barqarorlik</th>
                  <th className="py-2 px-3 text-center">Rang</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparisonComplexes.map((c, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${c.name.includes("[Fe(C₅H₅)₂]") ? 'bg-amber-900/20' : ''}`}>
                    <td className="py-2 px-3 font-bold text-amber-400">{c.name}</td>
                    <td className="py-2 px-3 text-center font-mono text-amber-400">{c.E0}</td>
                    <td className="py-2 px-3 text-center text-xs">{c.config}</td>
                    <td className="py-2 px-3 text-center text-xs">{c.Kstab}</td>
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
              <p className="text-xs text-purple-200">Ideal qaytar sistema. ΔE = 59 mV, Ipa/Ipc = 1.00. Ichki standart — erituvchiga bog'liq emas.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Organik erituvchi zarur. Faqat Fe ni o'lchaydi. 18 elektron — boshqa metallocenlar farq qiladi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">UV-Vis (440 nm), ¹H YaMR (δ = 4.15 ppm), AAS/ICP (Fe%), XRD (sandwich) — to'liq tahlil uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/elektrokimyo" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Elektrokimyoviy tahlil
            </Link>
            <Link href="/ilmiy/tahlil/elektrokimyo/birikmalar" className="text-sm bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(C₅H₅)₂]⁺/⁰ (Ferrosen) • Elektrokimyoviy tahlil moduli</p>
          <p className="mt-1">Manbalar: Bard & Faulkner, Electrochemical Methods, IUPAC, Fischer & Wilkinson (1973 Nobel)</p>
        </div>
      </footer>
    </main>
  )
}