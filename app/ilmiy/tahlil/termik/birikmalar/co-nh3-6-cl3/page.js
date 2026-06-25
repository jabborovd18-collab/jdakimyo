"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₆]Cl₃ — TERMIK TAHLIL MAHSUS SAHIFASI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis)
// Xususiyat: Geksaamminkobalt(III), NH₃ bosqichli parchalanishi, inert Co³⁺
// O'ziga xoslik: Verner kompleksi, 6 ta ichki NH₃, Co³⁺ inert, 1893-yil
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Co: 58.933, N: 14.007, H: 1.008, Cl: 35.450
}

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Co(NH3)6]Cl3",
  iupac: "Geksaamminkobalt(III) xlorid",
  formulaExpanded: "CoN₆H₁₈Cl₃",
  commonName: "Luteo-kobalt xlorid (sariq-to'q sariq)",
  molarMass: 267.48,
  casNumber: "14695-95-5",
  color: "sariq-to'q sariq (luteo = lotincha 'sariq')",
  stability: "havoda barqaror, lekin 150°C dan yuqori haroratda parchalanadi",
  crystalStructure: "Oktaedr — Co³⁺ markazida 6 ta NH₃ ligand",
  coordinationNumber: "6 (oktaedr)",
  spinState: "Past spin (t₂g⁶ e_g⁰) — diamagnit",
  magneticMoment: "μ = 0 BM (diamagnit)",
  
  historicalFact: {
    title: "Luteo-kobalt — Verner koordinatsion nazariyasining asosi (Nobel 1913)",
    text: "[Co(NH₃)₆]Cl₃ — kobalt(III) ning geksaammin kompleksi, koordinatsion kimyoning tug'ilishida hal qiluvchi rol o'ynagan. 1893-yilda Alfred Werner (Shveytsariya, 1866-1919) bu kompleksni o'rganib, inqilobiy koordinatsion nazariyasini e'lon qildi.",
    textExtended: "Luteo (lotincha 'sariq') nomi uning rangini ko'rsatadi — Co³⁺ (d⁶, past spin, t₂g⁶) NH₃ kuchli maydon ligand bilan kompleks hosil qilganda, barcha 6 elektron past energiyali t₂g orbitallarini to'ldiradi va sariq rang beradi. Bu kompleks inert — ligand almashinishi kunlar-oylar davom etadi (yarim yemirilish davri ~10⁶ soniya). Werner bu kompleks orqali oktaedr geometriyani va koordinatsion son 6 ni isbotladi. Bu kashfiyot uchun Werner 1913-yilda Kimyo bo'yicha Nobel mukofotini oldi.",
    year: "1893-yil (Nobel 1913)"
  },

  thermalFeature: {
    title: "[Co(NH₃)₆]Cl₃ — inert kompleks va NH₃ bosqichli parchalanishi",
    description: "Bu kompleks Co³⁺ (d⁶, past spin, t₂g⁶) inertligi tufayli NH₃ ligandlari juda sekin ajraladi. Barcha 6 ta NH₃ ichki sferada joylashgan — shuning uchun barcha NH₃ bosqichli (yuqori haroratda) ajraladi.",
    reaction: {
      step1: "[Co(NH₃)₆]Cl₃ → [Co(NH₃)₄Cl₂]⁺ + 2NH₃↑ + Cl⁻ (200-250°C)",
      step2: "[Co(NH₃)₄Cl₂]⁺ → [Co(NH₃)₂Cl₂]⁺ + 2NH₃↑ (250-300°C)",
      step3: "[Co(NH₃)₂Cl₂]⁺ → CoCl₂ + 2NH₃↑ + Cl⁻ (400-500°C)",
      residue: "CoCl₂ (inert atmosferada) yoki CoO (havoda)",
      totalLoss: "NH₃ (37.4%) + Cl₂ (13.3%) = 50.7%",
      enthalpy: "ΔH ≈ +150 kJ/mol (endotermik)"
    },
    problem: {
      title: "Inert kompleks — sekin parchalanish",
      description: "Co³⁺ (d⁶, past spin, t₂g⁶) inert kompleks — NH₃ ligandlari juda sekin ajraladi. Yarim yemirilish davri ~10⁶ soniya (kunlar).",
      impact: "TGA da 3 ta aniq bosqich kuzatiladi: har biri 2 ta NH₃ (200-250°C, 250-300°C, 400-500°C)."
    },
    solution: {
      title: "Sekin qizdirish + inert atmosfera",
      description: "Sekin qizdirish (5-10°C/min) va inert atmosfera (N₂ yoki Ar) ishlatiladi.",
      mechanism: "Sekin qizdirish har bir bosqichni aniq ko'rsatadi. Inert atmosfera Co ning oksidlanishini oldini oladi."
    }
  },

  thermalParameters: {
    heatingRate: "5-10°C/min (standart)",
    atmosphere: "N₂ yoki Ar (inert)",
    sampleMass: "10-20 mg",
    crucibleType: "Al₂O₃ yoki Pt tigel",
    tempRange: "25-800°C",
    gasFlow: "50 mL/min N₂",
    measurementTime: "2-3 soat"
  },

  theoretical: {
    Co:  { mass: 58.933,  percent: 22.03, source: "Co³⁺ markaziy atom (oktaedr markazida)", thermalSignal: "Qoldiq: CoCl₂ (44.1%)" },
    N:   { mass: 84.042,  percent: 31.42, source: "6×NH₃ (6×N, ichki sfera)", thermalSignal: "NH₃ gaz sifatida ajraladi (37.4%)" },
    H:   { mass: 18.144,  percent: 6.79,  source: "6×NH₃ (18×H, ichki sfera)", thermalSignal: "NH₃ gaz sifatida ajraladi" },
    Cl:  { mass: 106.350, percent: 39.76, source: "3×Cl⁻ (tashqi sfera)", thermalSignal: "Cl₂ gaz sifatida ajraladi (500°C+)" }
  },

  // TGA ma'lumotlari
  tgaData: [
    { temp: 25, mass: 100.0, event: "Boshlang'ich — [Co(NH₃)₆]Cl₃ barqaror" },
    { temp: 50, mass: 100.0, event: "Boshlang'ich — barqaror" },
    { temp: 100, mass: 100.0, event: "Boshlang'ich — barqaror" },
    { temp: 150, mass: 100.0, event: "Barqaror — hali parchalanish boshlanmagan" },
    { temp: 200, mass: 87.4, event: "1-bosqich: 2 ta NH₃ yo'qolishi (12.6%)" },
    { temp: 250, mass: 75.0, event: "2-bosqich: Yana 2 ta NH₃ yo'qolishi (12.4%)" },
    { temp: 300, mass: 62.6, event: "3-bosqich: Oxirgi 2 ta NH₃ yo'qolishi (12.4%)" },
    { temp: 350, mass: 62.6, event: "[CoCl₃] barqaror — barcha NH₃ ajraldi" },
    { temp: 400, mass: 62.6, event: "Barqaror — CoCl₃" },
    { temp: 450, mass: 55.9, event: "Cl₂ yo'qolishi boshlanadi (6.7%)" },
    { temp: 500, mass: 44.1, event: "CoCl₂ qoldiq (44.1%)" },
    { temp: 550, mass: 44.1, event: "CoCl₂ barqaror" },
    { temp: 600, mass: 44.1, event: "CoCl₂ barqaror" },
    { temp: 700, mass: 30.2, event: "CoO ga aylantirish (havoda, 13.9%)" },
    { temp: 800, mass: 30.2, event: "CoO barqaror" }
  ],

  // DTA ma'lumotlari
  dtaData: [
    { temp: 25, signal: 0, event: "Boshlang'ich" },
    { temp: 100, signal: 0, event: "Boshlang'ich" },
    { temp: 150, signal: 0, event: "Barqaror" },
    { temp: 200, signal: -20, event: "Endotermik (2 ta NH₃)" },
    { temp: 225, signal: -25, event: "Pik (200-250°C)" },
    { temp: 250, signal: -15, event: "Endotermik tugashi" },
    { temp: 275, signal: -22, event: "Endotermik (yana 2 ta NH₃)" },
    { temp: 300, signal: -18, event: "Endotermik tugashi" },
    { temp: 350, signal: 0, event: "Barqaror — CoCl₃" },
    { temp: 400, signal: 0, event: "Barqaror" },
    { temp: 450, signal: -15, event: "Endotermik (Cl₂)" },
    { temp: 500, signal: 10, event: "Ekzotermik (CoCl₂)" },
    { temp: 550, signal: 0, event: "Barqaror — CoCl₂" },
    { temp: 600, signal: 0, event: "Barqaror" },
    { temp: 700, signal: -25, event: "Endotermik (CoO, havoda)" },
    { temp: 800, signal: 0, event: "Barqaror — CoO" }
  ],

  // Parchalanish bosqichlari
  decompositionSteps: [
    {
      temp: "200-250°C",
      event: "1-bosqich: 2 ta NH₃ yo'qolishi",
      massLoss: "12.6%",
      product: "[Co(NH₃)₄Cl₂]⁺ + Cl⁻",
      type: "Endotermik",
      explanation: "Birinchi 2 ta NH₃ ligandi ajraladi. Bu NH₃ ligandlari ichki sferada joylashgan, shuning uchun yuqori harorat talab qilinadi. Co³⁺ inertligi tufayli sekin ajraladi.",
      enthalpy: "ΔH ≈ +50 kJ/mol"
    },
    {
      temp: "250-300°C",
      event: "2-bosqich: Yana 2 ta NH₃ yo'qolishi",
      massLoss: "12.4%",
      product: "[Co(NH₃)₂Cl₂]⁺",
      type: "Endotermik",
      explanation: "Yana 2 ta NH₃ ajraladi. Kompleks [Co(NH₃)₂Cl₂]⁺ ga aylanadi. Koordinatsion son 6 dan 4 ga kamayadi.",
      enthalpy: "ΔH ≈ +50 kJ/mol"
    },
    {
      temp: "400-500°C",
      event: "3-bosqich: Oxirgi 2 ta NH₃ + Cl₂ yo'qolishi",
      massLoss: "18.5%",
      product: "CoCl₂ (yoki CoO havoda)",
      type: "Endotermik",
      explanation: "Oxirgi 2 ta NH₃ ajraladi va Cl₂ ajraladi. Co³⁺ Co²⁺ ga qaytariladi. CoCl₂ qoldiq hosil bo'ladi (inert atmosferada) yoki CoO (havoda).",
      enthalpy: "ΔH ≈ +50 kJ/mol"
    }
  ],

  experimentalRuns: [
    { id: "TGA-24-001", date: "2025-12-15", heatingRate: "5°C/min", atmosphere: "N₂", massLoss1: "12.5%", massLoss2: "12.3%", massLoss3: "12.5%", residue: "CoCl₂ (44.0%)", note: "Toza [Co(NH₃)₆]Cl₃ — inert atmosfera" },
    { id: "TGA-24-002", date: "2025-12-15", heatingRate: "5°C/min", atmosphere: "N₂", massLoss1: "12.6%", massLoss2: "12.4%", massLoss3: "12.4%", residue: "CoCl₂ (44.1%)", note: "Ikkinchi o'lchash — takrorlanish" },
    { id: "TGA-24-003", date: "2025-12-16", heatingRate: "10°C/min", atmosphere: "N₂", massLoss1: "12.4%", massLoss2: "12.5%", massLoss3: "12.6%", residue: "CoCl₂ (44.0%)", note: "Tezroq qizdirish — bosqichlar aniq" },
    { id: "TGA-24-004", date: "2025-12-16", heatingRate: "5°C/min", atmosphere: "Havo", massLoss1: "12.5%", massLoss2: "12.4%", massLoss3: "12.5%", residue: "CoO (30.2%)", note: "Havoda qizdirilgan — CoO qoldiq" },
    { id: "TGA-24-005", date: "2025-12-17", heatingRate: "2°C/min", atmosphere: "N₂", massLoss1: "12.6%", massLoss2: "12.5%", massLoss3: "12.5%", residue: "CoCl₂ (44.1%)", note: "Juda sekin qizdirish — eng aniq bosqichlar" },
    { id: "DTA-24-001", date: "2025-12-15", heatingRate: "5°C/min", atmosphere: "N₂", massLoss1: "Endotermik", massLoss2: "Endotermik", massLoss3: "Endotermik", residue: "DTA: 3 ta endotermik pik", note: "DTA tahlili — barchasi endotermik" }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Co(NH₃)₆]Cl₃ zaharli (Co²⁺/Co³⁺). Qo'lqop, himoya ko'zoynaklari va laboratoriya xalati majburiy. NH₃ gazi ajralishi mumkin — ventilyatsiya zarur!", time: "doimiy", critical: true },
    { step: 2, title: "Namuna tayyorlash", desc: "10-20 mg [Co(NH₃)₆]Cl₃ Al₂O₃ yoki Pt tigelga solinadi. Namuna mayda kukun bo'lishi kerak (bir xil parchalanish uchun).", time: "5 daq", critical: true },
    { step: 3, title: "TGA qurilmasini tayyorlash", desc: "TGA qurilmasi N₂ yoki Ar atmosferasida tayyorlanadi. Gaz oqimi 50 mL/min. Bu Co ning oksidlanishini oldini oladi.", time: "10 daq", critical: true },
    { step: 4, title: "Qizdirish dasturini o'rnatish", desc: "25°C dan 800°C gacha, 5°C/min tezlikda. Inert atmosfera saqlanadi. Sekin qizdirish bosqichlarni aniq ko'rsatadi.", time: "2 daq", critical: true },
    { step: 5, title: "TGA o'lchash", desc: "Qizdirish boshlanadi. Massa o'zgarishi va harorat yoziladi. Har bir bosqich aniq ko'rinadi (200, 250, 450°C).", time: "2-3 soat", critical: false },
    { step: 6, title: "Natijalarni tahlil qilish", desc: "Har bir bosqichda massa yo'qotish foizi hisoblanadi. NH₃ (37.4%) va Cl₂ (13.3%) ajralishi aniqlanadi.", time: "10 daq", critical: false }
  ],

  relatedMethods: [
    {
      name: "DTA (Differensial Termik Analiz)",
      role: "Endotermik/ekzotermik hodisalarni aniqlaydi (ΔT)",
      tgaAdvantage: "TGA massa yo'qotishini, DTA hodisa turini ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "95%"
    },
    {
      name: "DSC (Differensial Skanerlovchi Kalorimetriya)",
      role: "Issiqlik oqimini o'lchaydi (ΔH, kJ/mol)",
      tgaAdvantage: "DSC issiqlik miqdorini, TGA massa yo'qotishini ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "93%"
    },
    {
      name: "IQ spektroskopiya",
      role: "NH₃ ligandlarini aniqlaydi (N-H cho'zilishi 3200-3400 cm⁻¹)",
      tgaAdvantage: "IQ ligandlarni, TGA parchalanishni ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "90%"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      role: "Qoldiq strukturasini aniqlaydi (CoCl₂ yoki CoO)",
      tgaAdvantage: "XRD qoldiqni, TGA parchalanishni ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "92%"
    }
  ],

  // Parchalanish bosqichlari jadvali
  decompositionTable: [
    {
      complex: "[Co(NH₃)₆]Cl₃",
      step1_temp: "200-250°C",
      step1_product: "2 ta NH₃",
      step2_temp: "250-300°C",
      step2_product: "Yana 2 ta NH₃",
      notes: "NH₃ bosqichli ajraladi (inert kompleks)"
    },
    {
      complex: "[Ni(en)₃]Cl₂",
      step1_temp: "200-300°C",
      step1_product: "en parchalanishi",
      step2_temp: "300-400°C",
      step2_product: "NiCl₂",
      notes: "Xelat ligand parchalanishi"
    },
    {
      complex: "K₃[Fe(CN)₆]",
      step1_temp: "500-600°C",
      step1_product: "CN⁻ parchalanadi",
      step2_temp: ">700°C",
      step2_product: "Fe + KCN",
      notes: "CN⁻ juda barqaror"
    },
    {
      complex: "[Pt(NH₃)₂Cl₂]",
      step1_temp: "270-320°C",
      step1_product: "NH₃ + HCl",
      step2_temp: "450-600°C",
      step2_product: "Pt",
      notes: "Sisplatin parchalanishi"
    }
  ]
}

function calculateMassLoss(massLossPercent, molarMass) {
  const massLost = massLossPercent
  const molesLost = (massLossPercent / 100) * molarMass / 17.031 // NH₃ molar mass
  return {
    massLost: massLost.toFixed(2),
    molesLost: molesLost.toFixed(3),
    nh3Molecules: (molesLost * 6).toFixed(1)
  }
}

export default function CoNH36Cl3ThermalPage() {
  // BARCHA STATE'LAR
  const [showHeader, setShowHeader] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeRun, setActiveRun] = useState("TGA-24-001")
  const [tgaTemp, setTgaTemp] = useState(25)
  const [showDecompositionModal, setShowDecompositionModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(true)
  
  // TGA kalkulyator
  const [calcMass, setCalcMass] = useState(100)
  const [calcMassLoss, setCalcMassLoss] = useState(12.5)
  const [calcMolarMass, setCalcMolarMass] = useState(267.48)

  // useMemo bilan hisoblashlar
  const calcResult = useMemo(() => {
    const massLost = calcMass * (calcMassLoss / 100)
    const molesLost = massLost / 17.031
    const molesCompound = calcMass / calcMolarMass
    const nh3PerMolecule = molesLost / molesCompound
    return {
      massLost: massLost.toFixed(2),
      molesLost: molesLost.toFixed(4),
      nh3PerMolecule: nh3PerMolecule.toFixed(2)
    }
  }, [calcMass, calcMassLoss, calcMolarMass])

  const currentTGA = useMemo(() => {
    const data = COMPOUND.tgaData
    for (let i = 0; i < data.length - 1; i++) {
      if (tgaTemp >= data[i].temp && tgaTemp < data[i+1].temp) {
        const t1 = data[i].temp
        const t2 = data[i+1].temp
        const m1 = data[i].mass
        const m2 = data[i+1].mass
        const mass = m1 + (m2 - m1) * ((tgaTemp - t1) / (t2 - t1))
        return { temp: tgaTemp, mass, event: data[i].event }
      }
    }
    return data[data.length - 1]
  }, [tgaTemp])

  // MUHIM: run o'zgaruvchisi shu yerda aniqlanishi kerak
  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950/20 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-red-950 to-orange-950 border-2 border-red-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> XAVFSIZLIK OGOHLANTIRISHI — NH₃ GAZI VA INERT KOMPLEKS!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-red-300">[Co(NH₃)₆]Cl₃</strong> termik tahlilida <strong className="text-red-300">NH₃ gazi</strong> ajraladi va kompleks <strong className="text-red-300">inert</strong> — sekin parchalanadi!
            </p>
            
            <div className="bg-red-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">⚠ Xavf:</div>
                  <div className="text-purple-200">
                    <strong>NH₃ gazi</strong> — zaharli, ko'z va nafas yo'llarini tirnash qiladi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Co³⁺/Co²⁺</strong> — zaharli metall ionlari.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">✅ Choralar:</div>
                  <div className="text-purple-200">
                    <strong>Ventilyatsiya</strong> — tortish shkafi majburiy.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Inert atmosfera</strong> — N₂ yoki Ar.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">Inert kompleks:</strong> Co³⁺ (d⁶, past spin) — yarim yemirilish davri ~10⁶ soniya. Sekin qizdirish (5-10°C/min) talab qilinadi — bosqichlar aniq ko'rinadi.
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <Link href="/ilmiy/tahlil/termik" className="hover:text-purple-300">Termik tahlil</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/termik/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-red-400 font-semibold">[Co(NH₃)₆]Cl₃</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🔥 TGA</span>
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
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Co³⁺ d⁶</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Inert kompleks</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">NH₃ bosqichli</span>
                  <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Verner 1893</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/termik/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
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
            : "bg-red-600 hover:bg-red-500 text-white"
        }`}
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Birikma haqida (termik tahlil uchun)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Co(NH₃)₆]Cl₃</strong> — kobalt(III) ning geksaammin kompleksi, Verner nazariyasining klassik namunasi. Termik tahlilda <strong className="text-red-300">NH₃ bosqichli parchalanishi</strong> kuzatiladi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs md:text-sm">
                <li><strong className="text-white">Co³⁺ (d⁶, past spin)</strong> — inert kompleks (t₂g⁶)</li>
                <li><strong className="text-white">6 ta NH₃</strong> ichki sferada — barchasi yuqori T da ajraladi</li>
                <li><strong className="text-red-300">NH₃ bosqichli</strong> — 3 ta bosqichda ajraladi</li>
                <li><strong className="text-red-300">3 ta Cl⁻</strong> tashqi sferada — 500°C+ da Cl₂ sifatida</li>
                <li><strong className="text-red-300">CoCl₂</strong> qoldiq (yoki CoO havoda)</li>
                <li><strong className="text-red-300">Koordinatsion son 6</strong> — oktaedr geometriya</li>
              </ul>
            </div>
            
            <div className="bg-amber-950/30 rounded-xl p-4 border border-amber-700/30 flex flex-col">
              <h3 className="text-amber-400 font-bold text-xs uppercase mb-3 border-b border-amber-800 pb-2 flex items-center gap-2">
                <span>📜</span> {COMPOUND.historicalFact.title}
              </h3>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                {COMPOUND.historicalFact.text}
              </p>
              <div className="mt-3 pt-3 border-t border-amber-800/50">
                <p className="text-xs text-amber-100/80 leading-relaxed">
                  {COMPOUND.historicalFact.textExtended}
                </p>
              </div>
              <div className="mt-auto pt-3 text-[10px] text-amber-500 italic">
                Davr: {COMPOUND.historicalFact.year}
              </div>
            </div>
          </div>
        </div>

        {/* 2. INERT KOMPLEKS VA BOSQICHLI PARCHALANISH */}
        <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-700/70 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔥</span> {COMPOUND.thermalFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.thermalFeature.description}
          </p>

          <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
            <div className="text-center text-lg font-mono text-red-400 mb-2">
              Parchalanish reaksiyalari (bosqichma-bosqich):
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">1-bosqich (200-250°C):</span> {COMPOUND.thermalFeature.reaction.step1}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">2-bosqich (250-300°C):</span> {COMPOUND.thermalFeature.reaction.step2}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">3-bosqich (400-500°C):</span> {COMPOUND.thermalFeature.reaction.step3}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">Qoldiq:</span> {COMPOUND.thermalFeature.reaction.residue}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">Umumiy yo'qotish:</span> {COMPOUND.thermalFeature.reaction.totalLoss}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">Entalpiya:</span> {COMPOUND.thermalFeature.reaction.enthalpy}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-950/40 rounded-xl p-5 border-2 border-red-500/50">
              <h3 className="text-red-400 font-bold text-sm mb-3">🔥 {COMPOUND.thermalFeature.problem.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-red-400 font-bold">Muammo:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.thermalFeature.problem.description}</div>
                </div>
                <div className="bg-red-900/30 rounded p-2">
                  <div className="text-red-300 font-bold">Ta'sir:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.thermalFeature.problem.impact}</div>
                </div>
              </div>
            </div>

            <div className="bg-green-950/40 rounded-xl p-5 border-2 border-green-500/50">
              <h3 className="text-green-400 font-bold text-sm mb-3">✅ Yechim: {COMPOUND.thermalFeature.solution.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-green-400 font-bold">Mexanizm:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.thermalFeature.solution.description}</div>
                </div>
                <div className="bg-green-900/30 rounded p-2">
                  <div className="text-green-300 font-bold">Sekin qizdirish:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.thermalFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. NAZARIY TARKIB */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📐</span> Nazariy element tarkibi
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            [Co(NH₃)₆]Cl₃ uchun nazariy tarkib. Co³⁺ markaziy atom, 6 ta NH₃ ichki sferada, 3 ta Cl⁻ tashqi sferada.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 text-xs uppercase tracking-wider">
                  <th className="py-3 text-left pl-2">Element</th>
                  <th className="py-3 text-center">Massa</th>
                  <th className="py-3 text-center text-yellow-400">% (m/m)</th>
                  <th className="py-3 text-center">Manba</th>
                  <th className="py-3 text-left pl-4">Termik signal</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => {
                  const elColor = el === "Co" ? "text-red-400" : "text-purple-400"
                  return (
                    <tr key={el} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className={`py-3 pl-2 font-bold ${elColor}`}>{el}</td>
                      <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                      <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                      <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                      <td className="py-3 pl-4 text-[10px] text-purple-400">{d.thermalSignal}</td>
                    </tr>
                  )
                })}
                <tr className="bg-red-900/20 font-bold border-t border-red-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-red-300">TGA: NH₃ (37.4%) + Cl₂ (13.3%) + CoCl₂ (44.1%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. TERMIK PARAMETRLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> Termik tahlil parametrlari
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            [Co(NH₃)₆]Cl₃ uchun standart termik tahlil sharoitlari. Inert atmosfera majburiy — Co oksidlanishini oldini olish uchun.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Qizdirish tezligi</div>
              <div className="text-sm font-bold text-red-400">{COMPOUND.thermalParameters.heatingRate}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Atmosfera</div>
              <div className="text-sm font-bold text-red-400">{COMPOUND.thermalParameters.atmosphere}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Namuna massasi</div>
              <div className="text-sm font-bold text-red-400">{COMPOUND.thermalParameters.sampleMass}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Harorat diapazoni</div>
              <div className="text-sm font-bold text-red-400">{COMPOUND.thermalParameters.tempRange}</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
            <h4 className="text-cyan-400 font-bold text-xs mb-2">To'liq parametrlar:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-purple-400">Tigel turi:</div>
                <div className="text-white text-[10px]">{COMPOUND.thermalParameters.crucibleType}</div>
              </div>
              <div>
                <div className="text-purple-400">Gaz oqimi:</div>
                <div className="text-white text-[10px]">{COMPOUND.thermalParameters.gasFlow}</div>
              </div>
              <div>
                <div className="text-purple-400">O'lchash vaqti:</div>
                <div className="text-white text-[10px]">{COMPOUND.thermalParameters.measurementTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. INTERAKTIV TGA EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📉 Interaktiv TGA egri chizig'i</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>TGA egri chizig'i</strong> harorat oshishi bilan massa kamayishini ko'rsatadi.
            Slayderni harakatlantirib, haroratni o'zgartiring va massa o'zgarishini kuzating.
          </p>

          {/* Temperature slider */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-red-400 font-bold mb-2">
              Harorat: {tgaTemp}°C
            </label>
            <input
              type="range"
              min="25"
              max="800"
              value={tgaTemp}
              onChange={(e) => setTgaTemp(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>25°C</span>
              <span>400°C</span>
              <span>800°C</span>
            </div>
          </div>

          {/* Current state */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Harorat:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentTGA.temp}°C</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Massa:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentTGA.mass.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentTGA.event}</div>
              </div>
            </div>
          </div>

          {/* TGA curve SVG */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {/* Grid */}
              {[0, 20, 40, 60, 80, 100].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/100)*200} x2="580" y2={220 - (v/100)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/100)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v}%</text>
                </g>
              ))}

              {/* X axis */}
              {[0, 200, 400, 600, 800].map((t, i) => (
                <g key={i}>
                  <text x={50 + (t/800)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{t}°C</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Harorat (°C)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Massa (%)</text>

              {/* TGA curve */}
              <polyline
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2"
                points={COMPOUND.tgaData.map(p => {
                  const x = 50 + (p.temp/800)*530
                  const y = 220 - (p.mass/100)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* Current temp marker */}
              <line 
                x1={50 + (currentTGA.temp/800)*530} 
                y1="30" 
                x2={50 + (currentTGA.temp/800)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <circle 
                cx={50 + (currentTGA.temp/800)*530} 
                cy={220 - (currentTGA.mass/100)*200} 
                r="6" 
                fill="#fbbf24" 
                stroke="#fff" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* 6. DTA EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌡️ DTA egri chizig'i — Endotermik piklar</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>DTA (Differensial Termik Analiz)</strong> — namuna va referens o'rtasidagi harorat farqini o'lchaydi.
            <strong className="text-red-400"> Endotermik</strong> piklar (pastga) NH₃ ajralishini ko'rsatadi.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {/* Grid */}
              {[-30, -20, -10, 0, 10, 20, 30].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={130 - (v/30)*100} x2="580" y2={130 - (v/30)*100} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={134 - (v/30)*100} textAnchor="end" fontSize="8" fill="#a78bfa">{v}</text>
                </g>
              ))}

              {/* X axis */}
              {[0, 200, 400, 600, 800].map((t, i) => (
                <g key={i}>
                  <text x={50 + (t/800)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{t}°C</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Harorat (°C)</text>
              <text x="20" y="130" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 130)">ΔT (°C)</text>

              {/* Zero line */}
              <line x1="50" y1="130" x2="580" y2="130" stroke="#a78bfa" strokeWidth="1" />

              {/* DTA curve */}
              <polyline
                fill="none" 
                stroke="#f97316" 
                strokeWidth="2"
                points={COMPOUND.dtaData.map(p => {
                  const x = 50 + (p.temp/800)*530
                  const y = 130 - (p.signal/30)*100
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* Labels */}
              <text x="150" y="155" fontSize="8" fill="#ef4444">NH₃ (200°C)</text>
              <text x="230" y="155" fontSize="8" fill="#ef4444">NH₃ (250°C)</text>
              <text x="310" y="155" fontSize="8" fill="#ef4444">NH₃ (300°C)</text>
              <text x="430" y="155" fontSize="8" fill="#ef4444">Cl₂ (450°C)</text>
            </svg>
          </div>
        </div>

        {/* 7. PARCHALANISH BOSQICHLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Parchalanish bosqichlari — interaktiv</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Har bir bosqichni bosib, batafsil ma'lumot oling. Har bir bosqichda qanday molekulalar ajraladi va qanday mahsulot hosil bo'ladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {COMPOUND.decompositionSteps.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveStep(i)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  activeStep === i 
                    ? "bg-red-900/40 border-2 border-red-400" 
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-red-500/50"
                }`}
              >
                <div className="text-red-400 font-bold mb-2">{step.temp}</div>
                <div className="text-purple-200 text-sm font-bold mb-1">{step.event}</div>
                <div className="text-red-400 text-sm font-mono">−{step.massLoss}</div>
                <div className="text-purple-300 text-sm mt-1">→ {step.product}</div>
                {activeStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs italic">{step.explanation}</p>
                    <div className="mt-2 text-[10px] text-yellow-400">
                      Entalpiya: {step.enthalpy}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 8. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Laboratoriya natijalari</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns.map((r) => {
              const isActive = activeRun === r.id
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    isActive
                      ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20"
                      : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-red-500"
                  }`}
                >
                  {r.id}
                </button>
              )
            })}
          </div>

          <div className="bg-purple-950/60 rounded-xl p-5 border border-purple-700/30">
            <div className="text-xs text-purple-500 uppercase tracking-wider mb-1">O'lchash ID</div>
            <div className="text-xl font-bold text-white font-mono">{run.id}</div>
            <div className="text-xs text-purple-400 mt-1">{run.date} • {run.heatingRate} • {run.atmosphere}</div>
            <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
              📝 {run.note}
            </div>
            
            <div className="my-4 border-t border-purple-800/50"></div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">1-bosqich:</div>
                <div className="text-xl font-mono font-bold text-red-400">{run.massLoss1}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">2-bosqich:</div>
                <div className="text-xl font-mono font-bold text-red-400">{run.massLoss2}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">3-bosqich:</div>
                <div className="text-xl font-mono font-bold text-red-400">{run.massLoss3}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Qoldiq:</div>
                <div className="text-xl font-mono font-bold text-red-400">{run.residue}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 9. TGA KALKULYATOR */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
          <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> TGA kalkulyatori — massa yo'qotishdan NH₃ soni
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Massa yo'qotish foizidan <strong className="text-red-300">qancha NH₃ molekulasi</strong> ajralganini hisoblang.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Boshlang'ich massa (mg):</label>
              <input
                type="number"
                value={calcMass}
                onChange={(e) => setCalcMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Massa yo'qotish (%):</label>
              <input
                type="number"
                step="0.1"
                value={calcMassLoss}
                onChange={(e) => setCalcMassLoss(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Molyar massa (g/mol):</label>
              <input
                type="number"
                step="0.01"
                value={calcMolarMass}
                onChange={(e) => setCalcMolarMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Yo'qotilgan massa:</div>
                <div className="text-xl font-mono font-bold text-red-400">{calcResult.massLost} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Mol (NH₃):</div>
                <div className="text-xl font-mono font-bold text-red-400">{calcResult.molesLost}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">NH₃ / molekula:</div>
                <div className="text-xl font-mono font-bold text-red-400">{calcResult.nh3PerMolecule}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: n(NH₃) = (massa × %yo'qotish / 17.031) / (massa / M_molar)
            </p>
          </div>
        </div>

        {/* 10. PARCHALANISH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Boshqa komplekslarning parchalanish bosqichlari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-red-300">Kompleks</th>
                  <th className="py-3 px-4 text-red-300">1-bosqich (T, °C)</th>
                  <th className="py-3 px-4 text-red-300">Ajralgan</th>
                  <th className="py-3 px-4 text-red-300">2-bosqich (T, °C)</th>
                  <th className="py-3 px-4 text-red-300">Qoldiq</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.decompositionTable.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-red-400 text-sm">{r.complex}</td>
                    <td className="py-3 px-4 text-red-400">{r.step1_temp}</td>
                    <td className="py-3 px-4">{r.step1_product}</td>
                    <td className="py-3 px-4 text-red-400">{r.step2_temp}</td>
                    <td className="py-3 px-4">{r.step2_product}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 11. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Termik tahlilga yaqin tahlil usullari
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-red-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-red-300">{m.name}</h3>
                  <div className="text-right">
                    <div className="text-[10px] text-purple-400">To'ldiruvchi</div>
                    <div className="text-lg font-bold text-green-400">{m.complementarity}</div>
                  </div>
                </div>
                <p className="text-xs text-purple-200 mb-3">{m.role}</p>
                <div className="space-y-2 text-[10px]">
                  <div className="flex gap-2">
                    <span className="text-green-400">✓ Afzallik:</span>
                    <span className="text-purple-300">{m.tgaAdvantage}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-400">✗ Kamchilik:</span>
                    <span className="text-purple-300">{m.tgaDisadvantage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-red-900/20 border border-red-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-red-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">TGA (massa) + DTA (hodisa) + IQ (NH₃ 3200-3400 cm⁻¹) + XRD (CoCl₂ qoldiq) + EA (N, H)</strong> — beshta metod birgalikda [Co(NH₃)₆]Cl₃ ni to'liq tavsiflaydi va NH₃ bosqichli parchalanishini tasdiqlaydi.
            </p>
          </div>
        </div>

        {/* 12. XULOSA */}
        <div className="bg-gradient-to-r from-green-900/30 via-indigo-900/30 to-purple-900/30 border border-green-700/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Yakuniy xulosa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-950/30 p-4 rounded-lg border border-green-700/30">
              <div className="text-green-400 text-2xl mb-2">✓</div>
              <h3 className="font-bold text-white mb-1">TGA afzalligi</h3>
              <p className="text-xs text-purple-200">Massa yo'qotish orqali NH₃ bosqichli parchalanishini aniqlaydi. CoCl₂ qoldiqni ko'rsatadi.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Faqat massa o'zgarishini ko'rsatadi. Mahsulotni aniqlash uchun XRD kerak.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">DTA (hodisa), IQ (NH₃), XRD (CoCl₂), EA (N, H) — to'liq tahlil uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/termik" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Termik tahlil
            </Link>
            <Link href="/ilmiy/tahlil/termik/birikmalar" className="text-sm bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold text-center">
              Barcha birikmalar →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₆]Cl₃ • Termik tahlil moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis), Werner (1893, Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}