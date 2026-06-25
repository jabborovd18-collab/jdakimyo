"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Fe(C₅H₅)₂] — TERMIK TAHLIL MAHSUS SAHIFASI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis)
// Xususiyat: Ferrosen, 18 elektron qoidasi, suyuqlanish va sublimatsiya
// O'ziga xoslik: Sandwich struktura (Nobel 1973), sublimatsiya (100°C), suyuqlanish (173°C)
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Fe: 55.845, C: 12.011, H: 1.008
}

const COMPOUND = {
  formulaHTML: "[Fe(C<sub>5</sub>H<sub>5</sub>)<sub>2</sub>]",
  formulaPlain: "[Fe(C5H5)2]",
  iupac: "Bis(η⁵-siklopentadienil)temir(II)",
  formulaExpanded: "FeC₁₀H₁₀",
  commonName: "Ferrosen (Ferrocene)",
  molarMass: 186.04,
  casNumber: "102-54-5",
  color: "to'q sariq (ferrosen, Fe²⁺ d⁶ past spin)",
  stability: "havoda barqaror, 173°C da suyuqlanadi, 400°C da parchalanadi, sublimatsiya qiladi",
  crystalStructure: "Sandwich struktura — Fe²⁺ ikkita C₅H₅⁻ halqasi orasida",
  coordinationNumber: "10 (η⁵-coordination, har bir C₅H₅ 5 ta bog')",
  spinState: "Past spin (t₂g⁶) — diamagnit (0 toq elektron)",
  magneticMoment: "μ = 0 BM (diamagnit, 18 elektron qoidasi)",
  
  historicalFact: {
    title: "Ferrosen — Metallotsen kashfiyoti (Nobel 1973)",
    text: "[Fe(C₅H₅)₂] — ferrosen, birinchi metallotsen (sandwich strukturali kompleks). 1951-yilda Pauson va Kealy tomonidan tasodifan sintez qilingan.",
    textExtended: "Ferrosen kashfiyoti organometall kimyoda inqilob yasadi. 1952-yilda Wilkinson va Woodward, hamda Fischer mustaqil ravishda sandwich strukturani taklif qilishdi — Fe²⁺ ikkita siklopentadienil (C₅H₅⁻) halqasi orasida joylashgan. 18 elektron qoidasi (Fe²⁺ d⁶ + 2×C₅H₅⁻ × 6e⁻ = 18e⁻) bu kompleksning ajablanarli barqarorligini tushuntiradi. Fischer va Wilkinson bu kashfiyot uchun 1973-yilda Nobel mukofotini olishdi. Ferrosen sublimatsiya qiladi (100°C, past bosimda) va 173°C da suyuqlanadi — bu uning molekulyar xarakterini ko'rsatadi. 400°C dan yuqori haroratda parchalanadi.",
    year: "1951-yil (Nobel 1973)"
  },

  thermalFeature: {
    title: "[Fe(C₅H₅)₂] — 18 elektron qoidasi va sublimatsiya/suyuqlanish",
    description: "Bu kompleks Fe²⁺ (d⁶, past spin, t₂g⁶) va 2 ta C₅H₅⁻ (η⁵-coordination) dan iborat. 18 elektron qoidasi tufayli juda barqaror. 173°C da suyuqlanadi va 100°C da sublimatsiya qiladi (past bosimda).",
    reaction: {
      step1: "[Fe(C₅H₅)₂] → [Fe(C₅H₅)₂] suyuq (173°C, suyuqlanish)",
      step2: "[Fe(C₅H₅)₂] → [Fe(C₅H₅)₂] gaz (100°C, past bosimda sublimatsiya)",
      step3: "[Fe(C₅H₅)₂] → Fe + C₁₀H₁₀↑ (400-470°C, parchalanish)",
      residue: "Fe (inert atmosferada) yoki Fe₃C",
      totalLoss: "C₁₀H₁₀ (100%) = 100% (to'liq bug'lanadi yoki parchalanadi)",
      enthalpy: "ΔH_sub ≈ +70 kJ/mol (sublimatsiya), ΔH_melt ≈ +15 kJ/mol (suyuqlanish)"
    },
    problem: {
      title: "Sublimatsiya — massa yo'qotish noto'g'ri talqin qilinishi mumkin",
      description: "Ferrosen past bosimda 100°C da sublimatsiya qiladi. Bu TGA da massa yo'qotish sifatida ko'rinadi, lekin bu parchalanish emas — molekula butunligicha bug'lanadi.",
      impact: "TGA da 100°C da massa yo'qotish kuzatiladi, lekin bu parchalanish emas. Suyuqlanish (173°C) ham kuzatiladi."
    },
    solution: {
      title: "Yuqori bosim + inert atmosfera",
      description: "Yuqori bosimda (atmosferada) sublimatsiya kamayadi, suyuqlanish (173°C) kuzatiladi. 400°C da parchalanish boshlanadi.",
      mechanism: "Sublimatsiya past bosimda sodir bo'ladi. Atmosfera bosimida suyuqlanish (173°C) kuzatiladi, keyin 400°C da parchalanish."
    }
  },

  thermochromism: {
    title: "Termoxromizm — harorat bilan rang va holat o'zgarishi",
    description: "[Fe(C₅H₅)₂] termoxromik va fazaviy o'zgarishlarga ega — harorat ko'tarilishi bilan rang va holat o'zgaradi.",
    colorChanges: [
      { temp: "25°C", color: "to'q sariq (qattiq)", geometry: "Sandwich (Fe²⁺ d⁶, 18e⁻)", explanation: "To'q sariq qattiq modda — 18 elektron qoidasi" },
      { temp: "100°C", color: "to'q sariq (sublimatsiya, past bosimda)", geometry: "Gaz fazasida", explanation: "Past bosimda sublimatsiya — molekula butunligicha bug'lanadi" },
      { temp: "173°C", color: "to'q sariq (suyuq)", geometry: "Suyuq faza", explanation: "Suyuqlanish — molekulyar xarakter" },
      { temp: "400-470°C", color: "qora", geometry: "Fe + C₁₀H₁₀ (parchalanish)", explanation: "Qora rang — parchalanish, Fe yoki Fe₃C hosil bo'ladi" }
    ]
  },

  thermalParameters: {
    heatingRate: "5°C/min (standart)",
    atmosphere: "N₂ yoki Ar (inert)",
    sampleMass: "5-10 mg (sublimatsiya tufayli kam)",
    crucibleType: "Al₂O₃ yoki Pt tigel (yopiq)",
    tempRange: "25-600°C",
    gasFlow: "50 mL/min N₂",
    measurementTime: "2-3 soat"
  },

  theoretical: {
    Fe:  { mass: 55.845,  percent: 30.02, source: "Fe²⁺ markaziy atom (sandwich markazida)", thermalSignal: "Fe (yoki Fe₃C) qoldiqda qoladi" },
    C:   { mass: 120.110, percent: 64.56, source: "2×C₅H₅ (10×C, η⁵-coordination)", thermalSignal: "C₁₀H₁₀ gaz sifatida ajraladi (sublimatsiya yoki parchalanish)" },
    H:   { mass: 10.080,  percent: 5.42,  source: "2×C₅H₅ (10×H, η⁵-coordination)", thermalSignal: "C₁₀H₁₀ gaz sifatida ajraladi" }
  },

  // TGA ma'lumotlari (nazariy izohlar bilan)
  tgaData: [
    { temp: 25, mass: 100.0, event: "Boshlang'ich — [Fe(C₅H₅)₂] barqaror (to'q sariq qattiq)", theoryNote: "Sandwich struktura, Fe²⁺ d⁶ past spin, 18 elektron qoidasi — diamagnit" },
    { temp: 50, mass: 100.0, event: "Boshlang'ich — barqaror", theoryNote: "Termik barqarorlik, sublimatsiya hali boshlanmagan" },
    { temp: 100, mass: 95.0, event: "Sublimatsiya boshlanadi (past bosimda, 5%)", theoryNote: "Past bosimda sublimatsiya boshlanadi — molekula butunligicha bug'lanadi" },
    { temp: 150, mass: 90.0, event: "Sublimatsiya davom etadi (10%)", theoryNote: "Sublimatsiya davom etadi, lekin atmosfera bosimida kam" },
    { temp: 173, mass: 88.0, event: "Suyuqlanish (173°C, endotermik)", theoryNote: "Suyuqlanish — molekulyar xarakter, ΔH_melt ≈ +15 kJ/mol" },
    { temp: 200, mass: 88.0, event: "Suyuq faza barqaror", theoryNote: "Suyuq faza barqaror, sublimatsiya kam" },
    { temp: 300, mass: 88.0, event: "Suyuq faza barqaror", theoryNote: "Suyuq faza barqaror, parchalanish hali boshlanmagan" },
    { temp: 400, mass: 60.0, event: "Parchalanish boshlanadi (28%)", theoryNote: "Fe-C bog'lari uzila boshlaydi, C₁₀H₁₀ ajraladi" },
    { temp: 450, mass: 35.0, event: "Parchalanish davom etadi (35%)", theoryNote: "C₁₀H₁₀ ajraladi, Fe qoldiq qoladi" },
    { temp: 470, mass: 30.0, event: "Parchalanish tugaydi (30% qoldiq)", theoryNote: "Fe (yoki Fe₃C) qoldiq qoladi" },
    { temp: 500, mass: 30.0, event: "Fe (yoki Fe₃C) barqaror", theoryNote: "Fe (yoki Fe₃C) barqaror" },
    { temp: 600, mass: 30.0, event: "Fe (yoki Fe₃C) barqaror", theoryNote: "Fe (yoki Fe₃C) barqaror" }
  ],

  // DTA ma'lumotlari (nazariy izohlar bilan)
  dtaData: [
    { temp: 25, signal: 0, event: "Boshlang'ich", theoryNote: "Termik muvozanat" },
    { temp: 100, signal: -10, event: "Endotermik (sublimatsiya boshlanishi)", theoryNote: "Sublimatsiya boshlanadi (past bosimda, ΔH_sub ≈ +70 kJ/mol)" },
    { temp: 150, signal: -15, event: "Endotermik (sublimatsiya)", theoryNote: "Sublimatsiya davom etadi" },
    { temp: 173, signal: -25, event: "Endotermik (suyuqlanish pik)", theoryNote: "Suyuqlanish pik (173°C, ΔH_melt ≈ +15 kJ/mol)" },
    { temp: 200, signal: 0, event: "Suyuq faza barqaror", theoryNote: "Suyuq faza barqaror" },
    { temp: 300, signal: 0, event: "Suyuq faza barqaror", theoryNote: "Suyuq faza barqaror" },
    { temp: 400, signal: -20, event: "Endotermik (parchalanish boshlanishi)", theoryNote: "Fe-C bog'lari uzila boshlaydi" },
    { temp: 450, signal: -30, event: "Endotermik (parchalanish pik)", theoryNote: "Maksimal parchalanish tezligi (C₁₀H₁₀ ajraladi)" },
    { temp: 470, signal: 10, event: "Ekzotermik (Fe₃C hosil bo'lishi)", theoryNote: "Fe₃C hosil bo'lishi (ekzotermik, ΔH ≈ -50 kJ/mol)" },
    { temp: 500, signal: 0, event: "Fe (yoki Fe₃C) barqaror", theoryNote: "Fe (yoki Fe₃C) barqaror" },
    { temp: 600, signal: 0, event: "Fe (yoki Fe₃C) barqaror", theoryNote: "Fe (yoki Fe₃C) barqaror" }
  ],

  // Parchalanish bosqichlari (nazariy izohlar bilan)
  decompositionSteps: [
    {
      temp: "100-150°C",
      event: "Sublimatsiya (past bosimda)",
      massLoss: "10-12%",
      product: "[Fe(C₅H₅)₂] gaz (butun molekula)",
      type: "Endotermik",
      explanation: "Past bosimda sublimatsiya sodir bo'ladi. Molekula butunligicha bug'lanadi — bu parchalanish emas. Atmosfera bosimida bu hodisa kam kuzatiladi.",
      enthalpy: "ΔH_sub ≈ +70 kJ/mol",
      colorChange: "to'q sariq → gaz",
      gasReleased: "[Fe(C₅H₅)₂] (butun molekula)"
    },
    {
      temp: "173°C",
      event: "Suyuqlanish",
      massLoss: "0% (faza o'zgarishi)",
      product: "[Fe(C₅H₅)₂] suyuq",
      type: "Endotermik",
      explanation: "Suyuqlanish — molekulyar xarakter. Bu ferrosenning molekulyar xarakterini ko'rsatadi. ΔH_melt ≈ +15 kJ/mol.",
      enthalpy: "ΔH_melt ≈ +15 kJ/mol",
      colorChange: "to'q sariq qattiq → to'q sariq suyuq",
      gasReleased: "Yo'q (faza o'zgarishi)"
    },
    {
      temp: "400-470°C",
      event: "Parchalanish",
      massLoss: "70%",
      product: "Fe (yoki Fe₃C)",
      type: "Endotermik (keyin ekzotermik)",
      explanation: "Fe-C bog'lari uziladi, C₁₀H₁₀ ajraladi. Fe (yoki Fe₃C) qoldiq qoladi. Bu parchalanish endotermik, keyin Fe₃C hosil bo'lishi ekzotermik.",
      enthalpy: "ΔH ≈ +200 kJ/mol (parchalanish), ΔH ≈ -50 kJ/mol (Fe₃C)",
      colorChange: "suyuq → qora (Fe yoki Fe₃C)",
      gasReleased: "C₁₀H₁₀ (siklopentadien dimer)"
    }
  ],

  experimentalRuns: [
    { 
      id: "TGA-24-001", 
      date: "2026-01-15", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "2%", 
      massLoss2: "68%", 
      massLoss3: "—", 
      residue: "Fe (30%)", 
      note: "Toza [Fe(C₅H₅)₂] — inert atmosfera, atmosfera bosimi",
      theoryNote: "Atmosfera bosimida sublimatsiya kam (2%). Suyuqlanish (173°C) kuzatiladi, keyin 400°C da parchalanish. Fe qoldiq qoladi."
    },
    { 
      id: "TGA-24-002", 
      date: "2026-01-15", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "2.5%", 
      massLoss2: "67.5%", 
      massLoss3: "—", 
      residue: "Fe (30.5%)", 
      note: "Ikkinchi o'lchash — takrorlanish",
      theoryNote: "Takrorlanish — natijalar bir xil. Sublimatsiya kam, suyuqlanish va parchalanish aniq kuzatiladi."
    },
    { 
      id: "TGA-24-003", 
      date: "2026-01-16", 
      heatingRate: "10°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "3%", 
      massLoss2: "68%", 
      massLoss3: "—", 
      residue: "Fe (30%)", 
      note: "Tezroq qizdirish — sublimatsiya biroz ko'proq",
      theoryNote: "Tezroq qizdirishda sublimatsiya biroz ko'proq kuzatiladi, lekin parchalanish harorati biroz yuqori."
    },
    { 
      id: "TGA-24-004", 
      date: "2026-01-16", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (past bosim)", 
      massLoss1: "15%", 
      massLoss2: "55%", 
      massLoss3: "—", 
      residue: "Fe (30%)", 
      note: "Past bosimda — sublimatsiya ko'p",
      theoryNote: "Past bosimda sublimatsiya ko'p (15%). Molekula butunligicha bug'lanadi. Parchalanish kamroq."
    },
    { 
      id: "TGA-24-005", 
      date: "2026-01-17", 
      heatingRate: "2°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "2%", 
      massLoss2: "68%", 
      massLoss3: "—", 
      residue: "Fe (30%)", 
      note: "Juda sekin qizdirish — eng aniq bosqichlar",
      theoryNote: "Juda sekin qizdirishda har bir bosqich aniq ko'rinadi. Suyuqlanish (173°C) aniq kuzatiladi."
    },
    { 
      id: "DTA-24-001", 
      date: "2026-01-15", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "Endotermik (suyuqlanish)", 
      massLoss2: "Endotermik (parchalanish)", 
      massLoss3: "—", 
      residue: "DTA: 2 endotermik pik", 
      note: "DTA tahlili — suyuqlanish (173°C) va parchalanish (400-470°C)",
      theoryNote: "DTA da suyuqlanish pik (173°C, endotermik) va parchalanish pik (400-470°C, endotermik, keyin ekzotermik Fe₃C)."
    }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Fe(C₅H₅)₂] zaharli emas, lekin sublimatsiya qiladi. Qo'lqop va himoya ko'zoynaklari majburiy. Ventilyatsiya zarur!", time: "doimiy", critical: true },
    { step: 2, title: "Namuna tayyorlash", desc: "5-10 mg [Fe(C₅H₅)₂] Al₂O₃ yoki Pt tigelga solinadi. Namuna mayda kukun bo'lishi kerak. Sublimatsiya tufayli kam namuna ishlatiladi.", time: "5 daq", critical: true },
    { step: 3, title: "TGA qurilmasini tayyorlash", desc: "TGA qurilmasi N₂ yoki Ar atmosferasida tayyorlanadi. Gaz oqimi 50 mL/min. Yopiq tigel ishlatiladi (sublimatsiya kamaytirish).", time: "10 daq", critical: true },
    { step: 4, title: "Qizdirish dasturini o'rnatish", desc: "25°C dan 600°C gacha, 5°C/min tezlikda. Inert atmosfera saqlanadi.", time: "2 daq", critical: true },
    { step: 5, title: "TGA o'lchash", desc: "Qizdirish boshlanadi. Massa o'zgarishi va harorat yoziladi. 173°C da suyuqlanish, 400°C da parchalanish kuzatiladi.", time: "2-3 soat", critical: false },
    { step: 6, title: "Natijalarni tahlil qilish", desc: "Har bir bosqichda massa yo'qotish foizi hisoblanadi. Sublimatsiya, suyuqlanish va parchalanish aniqlanadi.", time: "10 daq", critical: false }
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
      tgaAdvantage: "DSC suyuqlanish issiqligini o'lchaydi, TGA massa yo'qotishini ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "93%"
    },
    {
      name: "IQ spektroskopiya",
      role: "C₅H₅⁻ ligandlarini aniqlaydi (C-H, C=C cho'zilishi)",
      tgaAdvantage: "IQ ligandlarni, TGA parchalanishni ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "90%"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      role: "Sandwich strukturani aniqlaydi",
      tgaAdvantage: "XRD strukturani, TGA termik xatti-harakatni ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "92%"
    }
  ],

  // Parchalanish bosqichlari jadvali
  decompositionTable: [
    {
      complex: "[Fe(C₅H₅)₂]",
      step1_temp: "173°C (suyuqlanish)",
      step1_product: "Suyuq faza",
      step2_temp: "400-470°C",
      step2_product: "Fe + C₁₀H₁₀",
      notes: "Sublimatsiya (100°C) + suyuqlanish (173°C) + parchalanish (400°C)"
    },
    {
      complex: "K₃[Fe(CN)₆]",
      step1_temp: "500-600°C",
      step1_product: "CN⁻ parchalanadi",
      step2_temp: "600-800°C",
      step2_product: "Fe₃C + KCN",
      notes: "CN⁻ juda barqaror — yuqori T da parchalanadi"
    },
    {
      complex: "[Ni(en)₃]Cl₂",
      step1_temp: "200-250°C",
      step1_product: "1 ta en",
      step2_temp: "250-300°C",
      step2_product: "Yana 1 ta en",
      notes: "Xelat effekti — 3 ta en bosqichli ajraladi"
    },
    {
      complex: "[Co(NH₃)₆]Cl₃",
      step1_temp: "200-250°C",
      step1_product: "2 ta NH₃",
      step2_temp: "250-300°C",
      step2_product: "Yana 2 ta NH₃",
      notes: "NH₃ bosqichli ajraladi (inert kompleks)"
    }
  ]
}

function calculateMassLoss(massLossPercent, molarMass) {
  const massLost = massLossPercent
  const molesLost = (massLossPercent / 100) * molarMass / 186.04
  return {
    massLost: massLost.toFixed(2),
    molesLost: molesLost.toFixed(3),
    molecules: (molesLost).toFixed(3)
  }
}

export default function FeC5H52ThermalPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeRun, setActiveRun] = useState("TGA-24-001")
  const [tgaTemp, setTgaTemp] = useState(25)
  const [showWarningModal, setShowWarningModal] = useState(true)
  
  const [calcMass, setCalcMass] = useState(100)
  const [calcMassLoss, setCalcMassLoss] = useState(70.0)
  const [calcMolarMass, setCalcMolarMass] = useState(186.04)

  const calcResult = useMemo(() => {
    const massLost = calcMass * (calcMassLoss / 100)
    const molesLost = (massLost / 186.04) * (calcMass / 100)
    return {
      massLost: massLost.toFixed(2),
      molesLost: molesLost.toFixed(4),
      molecules: molesLost.toFixed(3)
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
        return { temp: tgaTemp, mass, event: data[i].event, theoryNote: data[i].theoryNote }
      }
    }
    return data[data.length - 1]
  }, [tgaTemp])

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-orange-950/20 to-blue-950 text-white">
      
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-orange-950 to-purple-950 border-2 border-orange-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> XAVFSIZLIK OGOHLANTIRISHI — SUBLIMATSIYA VA NOBEL 1973!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-orange-300">[Fe(C₅H₅)₂]</strong> — ferrosen, birinchi metallotsen (sandwich struktura). Sublimatsiya qiladi va 173°C da suyuqlanadi!
            </p>
            
            <div className="bg-orange-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-orange-400 font-bold mb-2">⚠ Xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Sublimatsiya</strong> — 100°C da past bosimda bug'lanadi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Suyuqlanish</strong> — 173°C da suyuqlanadi.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">✅ Xavfsizlik:</div>
                  <div className="text-purple-200">
                    <strong>Ventilyatsiya</strong> — majburiy.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Yopiq tigel</strong> — sublimatsiya kamaytirish.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-orange-300">18 elektron qoidasi:</strong> Fe²⁺ (d⁶) + 2×C₅H₅⁻ (12e⁻) = 18 elektron. Bu kompleksning ajablanarli barqarorligini tushuntiradi. Fischer va Wilkinson 1973-yilda Nobel mukofotini olishdi.
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
            >
              Tushundim — sahifani davom ettirish
            </button>
          </div>
        </div>
      )}
      
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
              <span className="text-orange-400 font-semibold">[Fe(C₅H₅)₂]</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-orange-400 flex items-center gap-2">
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
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Fe²⁺ d⁶</span>
                  <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">18 elektron</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Sandwich</span>
                  <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Nobel 1973</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/termik/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Barcha birikmalar
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-orange-600 hover:bg-orange-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-orange-900/40 to-purple-900/40 border border-orange-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Birikma haqida (termik tahlil uchun)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Fe(C₅H₅)₂]</strong> — ferrosen, birinchi metallotsen (sandwich struktura). Termik tahlilda <strong className="text-orange-300">sublimatsiya</strong> (100°C) va <strong className="text-orange-300">suyuqlanish</strong> (173°C) kuzatiladi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-orange-500 text-xs md:text-sm">
                <li><strong className="text-white">Fe²⁺ (d⁶, past spin)</strong> — sandwich struktura</li>
                <li><strong className="text-white">2 ta C₅H₅⁻</strong> (η⁵-coordination) — 18 elektron qoidasi</li>
                <li><strong className="text-orange-300">Sublimatsiya</strong> — 100°C da past bosimda</li>
                <li><strong className="text-orange-300">Suyuqlanish</strong> — 173°C da</li>
                <li><strong className="text-orange-300">Parchalanish</strong> — 400-470°C da</li>
                <li><strong className="text-orange-300">Diamagnit</strong> — 18 elektron qoidasi</li>
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

        {/* 2. SUBLIMATSIYA VA SUYUQLANISH */}
        <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border-2 border-orange-700/70 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔥</span> {COMPOUND.thermalFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.thermalFeature.description}
          </p>

          <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
            <div className="text-center text-lg font-mono text-orange-400 mb-2">
              Termik hodisalar (bosqichma-bosqich):
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">Sublimatsiya (100°C, past bosimda):</span> {COMPOUND.thermalFeature.reaction.step2}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">Suyuqlanish (173°C):</span> {COMPOUND.thermalFeature.reaction.step1}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">Parchalanish (400-470°C):</span> {COMPOUND.thermalFeature.reaction.step3}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">Qoldiq:</span> {COMPOUND.thermalFeature.reaction.residue}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">Entalpiya:</span> {COMPOUND.thermalFeature.reaction.enthalpy}
              </div>
            </div>
          </div>

          {/* TERMOXROMIZM */}
          <div className="bg-gradient-to-r from-purple-950/60 to-indigo-950/60 rounded-lg p-4 mb-4 border border-purple-500/30">
            <h3 className="text-purple-300 font-bold text-sm mb-3 flex items-center gap-2">
              <span>🌈</span> {COMPOUND.thermochromism.title}
            </h3>
            <p className="text-xs text-purple-200 mb-3">{COMPOUND.thermochromism.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {COMPOUND.thermochromism.colorChanges.map((c, i) => (
                <div key={i} className="bg-purple-900/50 rounded-lg p-3">
                  <div className="text-[10px] text-purple-400 mb-1">{c.temp}</div>
                  <div className="text-sm font-bold text-white mb-1">{c.color}</div>
                  <div className="text-[10px] text-purple-300">{c.geometry}</div>
                  <div className="text-[10px] text-purple-300 mt-1 italic">{c.explanation}</div>
                </div>
              ))}
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
                  <div className="text-green-300 font-bold">Yuqori bosim:</div>
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
            [Fe(C₅H₅)₂] uchun nazariy tarkib. Fe²⁺ markaziy atom, 2 ta C₅H₅⁻ (η⁵-coordination).
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
                  const elColor = el === "Fe" ? "text-orange-400" : "text-purple-400"
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
                <tr className="bg-orange-900/20 font-bold border-t border-orange-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-orange-300">TGA: Sublimatsiya + suyuqlanish + parchalanish (Fe 30%)</td>
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
            [Fe(C₅H₅)₂] uchun standart termik tahlil sharoitlari. Sublimatsiya tufayli kam namuna va yopiq tigel ishlatiladi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Qizdirish tezligi</div>
              <div className="text-sm font-bold text-orange-400">{COMPOUND.thermalParameters.heatingRate}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Atmosfera</div>
              <div className="text-sm font-bold text-orange-400">{COMPOUND.thermalParameters.atmosphere}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Namuna massasi</div>
              <div className="text-sm font-bold text-orange-400">{COMPOUND.thermalParameters.sampleMass}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Harorat diapazoni</div>
              <div className="text-sm font-bold text-orange-400">{COMPOUND.thermalParameters.tempRange}</div>
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
          <h2 className="text-xl font-bold text-white mb-6">📉 Interaktiv TGA egri chizig'i (nazariy izohlar bilan)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>TGA egri chizig'i</strong> harorat oshishi bilan massa kamayishini ko'rsatadi.
            Slayderni harakatlantirib, haroratni o'zgartiring. Har bir bosqichda <strong className="text-yellow-400">nazariy izoh</strong> ko'rsatiladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-orange-400 font-bold mb-2">
              Harorat: {tgaTemp}°C
            </label>
            <input
              type="range"
              min="25"
              max="600"
              value={tgaTemp}
              onChange={(e) => setTgaTemp(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>25°C</span>
              <span>300°C</span>
              <span>600°C</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Harorat:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{currentTGA.temp}°C</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Massa:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{currentTGA.mass.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{currentTGA.event}</div>
              </div>
            </div>
            
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Nazariy izoh:
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                {currentTGA.theoryNote}
              </p>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {[0, 20, 40, 60, 80, 100].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/100)*200} x2="580" y2={220 - (v/100)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/100)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v}%</text>
                </g>
              ))}

              {[0, 100, 200, 300, 400, 500, 600].map((t, i) => (
                <g key={i}>
                  <text x={50 + (t/600)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{t}°C</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Harorat (°C)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Massa (%)</text>

              <polyline
                fill="none" 
                stroke="#f97316" 
                strokeWidth="2"
                points={COMPOUND.tgaData.map(p => {
                  const x = 50 + (p.temp/600)*530
                  const y = 220 - (p.mass/100)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              <line 
                x1={50 + (currentTGA.temp/600)*530} 
                y1="30" 
                x2={50 + (currentTGA.temp/600)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <circle 
                cx={50 + (currentTGA.temp/600)*530} 
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
          <h2 className="text-xl font-bold text-white mb-6">🌡️ DTA egri chizig'i — Suyuqlanish va parchalanish piklari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>DTA (Differensial Termik Analiz)</strong> — namuna va referens o'rtasidagi harorat farqini o'lchaydi.
            <strong className="text-orange-400"> Endotermik</strong> piklar suyuqlanish va parchalanishni ko'rsatadi.
          </p>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> DTA piklarining nazariy izohi:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">100°C — Sublimatsiya</div>
                <div className="text-purple-200">Sublimatsiya boshlanadi (past bosimda, ΔH_sub ≈ +70 kJ/mol).</div>
              </div>
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">173°C — Suyuqlanish</div>
                <div className="text-purple-200">Suyuqlanish pik (ΔH_melt ≈ +15 kJ/mol).</div>
              </div>
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">400-470°C — Parchalanish</div>
                <div className="text-purple-200">Parchalanish (ΔH ≈ +200 kJ/mol), keyin Fe₃C (ekzotermik).</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {[-30, -20, -10, 0, 10, 20, 30].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={130 - (v/30)*100} x2="580" y2={130 - (v/30)*100} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={134 - (v/30)*100} textAnchor="end" fontSize="8" fill="#a78bfa">{v}</text>
                </g>
              ))}

              {[0, 100, 200, 300, 400, 500, 600].map((t, i) => (
                <g key={i}>
                  <text x={50 + (t/600)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{t}°C</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Harorat (°C)</text>
              <text x="20" y="130" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 130)">ΔT (°C)</text>

              <line x1="50" y1="130" x2="580" y2="130" stroke="#a78bfa" strokeWidth="1" />

              <polyline
                fill="none" 
                stroke="#f97316" 
                strokeWidth="2"
                points={COMPOUND.dtaData.map(p => {
                  const x = 50 + (p.temp/600)*530
                  const y = 130 - (p.signal/30)*100
                  return `${x},${y}`
                }).join(" ")}
              />

              <text x="130" y="155" fontSize="8" fill="#ef4444">Sublimatsiya (100°C)</text>
              <text x="200" y="155" fontSize="8" fill="#ef4444">Suyuqlanish (173°C)</text>
              <text x="400" y="155" fontSize="8" fill="#ef4444">Parchalanish (400°C)</text>
              <text x="470" y="100" fontSize="8" fill="#22c55e">Fe₃C (470°C)</text>
            </svg>
          </div>
        </div>

        {/* 7. PARCHALANISH BOSQICHLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Parchalanish bosqichlari — interaktiv</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Har bir bosqichni bosib, batafsil ma'lumot oling.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {COMPOUND.decompositionSteps.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveStep(i)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  activeStep === i 
                    ? "bg-orange-900/40 border-2 border-orange-400" 
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-orange-500/50"
                }`}
              >
                <div className="text-orange-400 font-bold mb-2">{step.temp}</div>
                <div className="text-purple-200 text-sm font-bold mb-1">{step.event}</div>
                <div className="text-orange-400 text-sm font-mono">−{step.massLoss}</div>
                <div className="text-purple-300 text-sm mt-1">→ {step.product}</div>
                <div className="text-purple-300 text-xs mt-1">Rang: {step.colorChange}</div>
                {activeStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs italic mb-2">{step.explanation}</p>
                    <div className="text-[10px] text-yellow-400 mb-1">
                      Entalpiya: {step.enthalpy}
                    </div>
                    <div className="text-[10px] text-yellow-400 mb-1">
                      Ajralgan gaz: {step.gasReleased}
                    </div>
                    <div className="text-[10px] text-yellow-400">
                      Rang o'zgarishi: {step.colorChange}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 8. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Laboratoriya natijalari (nazariy izohlar bilan)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Har bir laboratoriya natijasiga <strong className="text-yellow-400">nazariy izoh</strong> beriladi.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {COMPOUND.experimentalRuns.map((r) => {
              const isActive = activeRun === r.id
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    isActive
                      ? "bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-orange-500"
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
            
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Nazariy izoh:
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                {run.theoryNote}
              </p>
            </div>
            
            <div className="my-4 border-t border-purple-800/50"></div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Sublimatsiya:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{run.massLoss1}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Parchalanish:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{run.massLoss2}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Qoldiq:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{run.residue}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 9. TGA KALKULYATOR */}
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-2xl p-8">
          <h3 className="text-orange-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> TGA kalkulyatori — massa yo'qotishdan molekula soni
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Massa yo'qotish foizidan <strong className="text-orange-300">qancha [Fe(C₅H₅)₂] molekulasi</strong> ajralganini hisoblang.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Boshlang'ich massa (mg):</label>
              <input
                type="number"
                value={calcMass}
                onChange={(e) => setCalcMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Massa yo'qotish (%):</label>
              <input
                type="number"
                step="0.1"
                value={calcMassLoss}
                onChange={(e) => setCalcMassLoss(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Molyar massa (g/mol):</label>
              <input
                type="number"
                step="0.01"
                value={calcMolarMass}
                onChange={(e) => setCalcMolarMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-orange-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Yo'qotilgan massa:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{calcResult.massLost} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Mol:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{calcResult.molesLost}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Molekula (mol):</div>
                <div className="text-xl font-mono font-bold text-orange-400">{calcResult.molecules}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: n = (massa × %yo'qotish / 100) / M_molar
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
                  <th className="py-3 px-4 text-orange-300">Kompleks</th>
                  <th className="py-3 px-4 text-orange-300">1-bosqich (T, °C)</th>
                  <th className="py-3 px-4 text-orange-300">Ajralgan</th>
                  <th className="py-3 px-4 text-orange-300">2-bosqich (T, °C)</th>
                  <th className="py-3 px-4 text-orange-300">Qoldiq</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.decompositionTable.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-orange-400 text-sm">{r.complex}</td>
                    <td className="py-3 px-4 text-orange-400">{r.step1_temp}</td>
                    <td className="py-3 px-4">{r.step1_product}</td>
                    <td className="py-3 px-4 text-orange-400">{r.step2_temp}</td>
                    <td className="py-3 px-4">{r.step2_product}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 11. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-orange-900/40 to-purple-900/40 border border-orange-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Termik tahlilga yaqin tahlil usullari
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-orange-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-orange-300">{m.name}</h3>
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

          <div className="mt-5 bg-orange-900/20 border border-orange-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-orange-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">TGA (massa) + DTA (suyuqlanish/parchalanish) + IQ (C₅H₅⁻) + XRD (sandwich) + DSC (ΔH)</strong> — beshta metod birgalikda [Fe(C₅H₅)₂] ni to'liq tavsiflaydi.
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
              <p className="text-xs text-purple-200">Sublimatsiya, suyuqlanish va parchalanishni aniqlaydi. 18 elektron qoidasini tasdiqlaydi.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Sublimatsiya tufayli massa yo'qotish noto'g'ri talqin qilinishi mumkin. Yopiq tigel kerak.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">DTA (suyuqlanish), IQ (C₅H₅⁻), XRD (sandwich), DSC (ΔH) — to'liq tahlil uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/termik" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Termik tahlil
            </Link>
            <Link href="/ilmiy/tahlil/termik/birikmalar" className="text-sm bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha birikmalar →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(C₅H₅)₂] • Termik tahlil moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis), Pauson & Kealy (1951), Nobel (1973)</p>
        </div>
      </footer>
    </main>
  )
}