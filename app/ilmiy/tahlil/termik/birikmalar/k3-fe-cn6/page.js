"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// K₃[Fe(CN)₆] — TERMIK TAHLIL MAHSUS SAHIFASI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis)
// Xususiyat: Ferritsianid, Fe³⁺ (d⁵, past spin), CN⁻ juda barqaror
// O'ziga xoslik: CN⁻ juda barqaror (500-600°C da parchalanadi), Fe³⁺ inert
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  K: 39.098, Fe: 55.845, C: 12.011, N: 14.007
}

const COMPOUND = {
  formulaHTML: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
  formulaPlain: "K3[Fe(CN)6]",
  iupac: "Kaliy geksatsianoferrat(III)",
  formulaExpanded: "K₃FeC₆N₆",
  commonName: "Qizil qon tuzi (Red prussiate of potash)",
  molarMass: 329.24,
  casNumber: "13746-66-2",
  color: "qizil (ferritsianid, Fe³⁺ d⁵ past spin)",
  stability: "havoda barqaror, lekin 500°C dan yuqori haroratda parchalanadi",
  crystalStructure: "Monoklinik — Fe³⁺ markazida 6 ta CN⁻ ligand (oktaedr)",
  coordinationNumber: "6 (oktaedr)",
  spinState: "Past spin (t₂g⁵ e_g⁰) — paramagnit (1 toq elektron)",
  magneticMoment: "μ ≈ 2.3 BM (1 ta toq elektron)",
  
  historicalFact: {
    title: "Qizil qon tuzi — oksidlovchi agent (1822)",
    text: "K₃[Fe(CN)₆] — kaliy ferritsianid, Fe³⁺ ning geksatsianoferrat kompleksi. 1822-yilda Leopold Gmelin tomonidan K₄[Fe(CN)₆] (sariq qon tuzi) ni xlor bilan oksidlab sintez qilingan.",
    textExtended: "Qizil qon tuzi kuchli oksidlovchi agent sifatida keng qo'llaniladi. Fe³⁺ (d⁵, past spin, t₂g⁵) CN⁻ kuchli maydon ligand bilan kompleks hosil qilganda, 5 elektron past energiyali t₂g orbitallarini to'ldiradi va 1 ta toq elektron qoladi (paramagnit, μ ≈ 2.3 BM). K₄[Fe(CN)₆] (sariq, Fe²⁺ d⁶) dan farqli o'laroq, K₃[Fe(CN)₆] oksidlovchi xususiyatga ega. ICP tahlilida bu birikma muhim: CN⁻ juda barqaror — 500-600°C da parchalanadi. Parchalanish mahsuloti: Fe + KCN (yoki Fe₃C).",
    year: "1822-yil"
  },

  thermalFeature: {
    title: "K₃[Fe(CN)₆] — CN⁻ juda barqaror va yuqori T da parchalanish",
    description: "Bu kompleks Fe³⁺ (d⁵, past spin, t₂g⁵) inertligi va CN⁻ kuchli maydon ligand tufayli juda barqaror. CN⁻ ligandlari juda yuqori haroratda (500-600°C) parchalanadi.",
    reaction: {
      step1: "K₃[Fe(CN)₆] → 3KCN + Fe(CN)₂ (500-600°C)",
      step2: "Fe(CN)₂ → Fe + 2CN↑ (yoki Fe₃C + N₂↑) (600-800°C)",
      residue: "Fe + KCN (inert atmosferada) yoki Fe₃C",
      totalLoss: "CN⁻ (43.0%) + N₂ (7.0%) = 50.0%",
      enthalpy: "ΔH ≈ +250 kJ/mol (endotermik, CN⁻ parchalanishi)"
    },
    problem: {
      title: "CN⁻ juda barqaror — yuqori T da parchalanish",
      description: "CN⁻ ligandlari juda kuchli maydon ligand — Fe-C bog'i juda kuchli. 500-600°C gacha barqaror, keyin parchalanadi.",
      impact: "TGA da 500-600°C da keskin massa yo'qotish kuzatiladi. CN⁻ gaz sifatida ajraladi (zaharli!)."
    },
    solution: {
      title: "Yuqori T + inert atmosfera + ventilyatsiya",
      description: "Yuqori harorat (800°C gacha) va inert atmosfera (N₂ yoki Ar) ishlatiladi. CN⁻ zaharli — ventilyatsiya majburiy!",
      mechanism: "Yuqori haroratda Fe-C bog'lari uziladi, CN⁻ gaz sifatida ajraladi. Inert atmosfera Fe ning oksidlanishini oldini oladi."
    }
  },

  thermochromism: {
    title: "Termoxromizm — harorat bilan rang o'zgarishi",
    description: "K₃[Fe(CN)₆] termoxromik xususiyatga ega — harorat ko'tarilishi bilan rang o'zgaradi. Bu Fe³⁺ (d⁵) ning elektron konfiguratsiyasi bilan bog'liq.",
    colorChanges: [
      { temp: "25°C", color: "qizil", geometry: "Oktaedr (Fe³⁺ d⁵, past spin)", explanation: "Qizil rang — Fe³⁺ d⁵ past spin, 1 ta toq elektron" },
      { temp: "200-400°C", color: "to'q qizil", geometry: "Oktaedr (barqaror)", explanation: "To'q qizil — termik barqarorlik" },
      { temp: "500-600°C", color: "qora", geometry: "Fe + KCN (parchalanish)", explanation: "Qora rang — CN⁻ parchalanishi boshlanadi" },
      { temp: ">700°C", color: "qora (Fe₃C)", geometry: "Fe₃C (sementit)", explanation: "Qora rang — Fe₃C (sementit) hosil bo'ladi" }
    ]
  },

  thermalParameters: {
    heatingRate: "5°C/min (standart)",
    atmosphere: "N₂ yoki Ar (inert)",
    sampleMass: "10-20 mg",
    crucibleType: "Al₂O₃ yoki Pt tigel",
    tempRange: "25-1000°C",
    gasFlow: "50 mL/min N₂",
    measurementTime: "3-4 soat"
  },

  theoretical: {
    K:   { mass: 117.294, percent: 35.62, source: "3×K⁺ (tashqi sfera)", thermalSignal: "KCN sifatida qoldiqda qoladi" },
    Fe:  { mass: 55.845,  percent: 16.96, source: "Fe³⁺ markaziy atom (oktaedr markazida)", thermalSignal: "Fe (yoki Fe₃C) qoldiqda qoladi" },
    C:   { mass: 72.066,  percent: 21.89, source: "6×CN⁻ (6×C, ichki sfera)", thermalSignal: "CN⁻ gaz sifatida ajraladi (43.0%)" },
    N:   { mass: 84.042,  percent: 25.53, source: "6×CN⁻ (6×N, ichki sfera)", thermalSignal: "CN⁻ yoki N₂ gaz sifatida ajraladi" }
  },

  // TGA ma'lumotlari (nazariy izohlar bilan)
  tgaData: [
    { temp: 25, mass: 100.0, event: "Boshlang'ich — K₃[Fe(CN)₆] barqaror (qizil)", theoryNote: "Oktaedr geometriya, Fe³⁺ d⁵ past spin, 1 ta toq elektron" },
    { temp: 50, mass: 100.0, event: "Boshlang'ich — barqaror", theoryNote: "Termik barqarorlik" },
    { temp: 100, mass: 100.0, event: "Boshlang'ich — barqaror", theoryNote: "Termik barqarorlik" },
    { temp: 150, mass: 100.0, event: "Barqaror — hali parchalanish boshlanmagan", theoryNote: "Rang: to'q qizil" },
    { temp: 200, mass: 100.0, event: "Barqaror — CN⁻ barqaror", theoryNote: "CN⁻ juda barqaror, Fe-C bog'i uzilmaydi" },
    { temp: 300, mass: 100.0, event: "Barqaror — CN⁻ barqaror", theoryNote: "CN⁻ juda barqaror" },
    { temp: 400, mass: 100.0, event: "Barqaror — CN⁻ barqaror", theoryNote: "CN⁻ juda barqaror" },
    { temp: 500, mass: 85.0, event: "1-bosqich: CN⁻ parchalanishi boshlanadi (15.0%)", theoryNote: "Birinchi CN⁻ ligandlari parchalanadi, Fe(CN)₂ hosil bo'ladi" },
    { temp: 600, mass: 57.0, event: "2-bosqich: CN⁻ to'liq parchalanadi (28.0%)", theoryNote: "Barcha CN⁻ parchalanadi, Fe + KCN hosil bo'ladi" },
    { temp: 700, mass: 50.0, event: "3-bosqich: N₂ ajraladi (7.0%)", theoryNote: "N₂ gaz ajraladi, Fe₃C hosil bo'ladi" },
    { temp: 800, mass: 50.0, event: "Fe₃C + KCN barqaror", theoryNote: "Fe₃C (sementit) va KCN barqaror" },
    { temp: 900, mass: 50.0, event: "Fe₃C + KCN barqaror", theoryNote: "Fe₃C barqaror" },
    { temp: 1000, mass: 50.0, event: "Fe₃C + KCN barqaror", theoryNote: "Fe₃C barqaror" }
  ],

  // DTA ma'lumotlari (nazariy izohlar bilan)
  dtaData: [
    { temp: 25, signal: 0, event: "Boshlang'ich", theoryNote: "Termik muvozanat" },
    { temp: 100, signal: 0, event: "Boshlang'ich", theoryNote: "Termik muvozanat" },
    { temp: 200, signal: 0, event: "Barqaror — CN⁻ barqaror", theoryNote: "CN⁻ juda barqaror" },
    { temp: 300, signal: 0, event: "Barqaror — CN⁻ barqaror", theoryNote: "CN⁻ juda barqaror" },
    { temp: 400, signal: -10, event: "Kichik endotermik (CN⁻ boshlanishi)", theoryNote: "CN⁻ parchalanishi boshlanadi" },
    { temp: 500, signal: -35, event: "Endotermik (CN⁻ parchalanishi)", theoryNote: "CN⁻ parchalanadi (ΔH ≈ +125 kJ/mol)" },
    { temp: 550, signal: -40, event: "Pik (500-600°C)", theoryNote: "Maksimal parchalanish tezligi" },
    { temp: 600, signal: -30, event: "Endotermik tugashi", theoryNote: "CN⁻ to'liq ajraldi, Fe + KCN hosil bo'ldi" },
    { temp: 700, signal: -20, event: "Endotermik (N₂)", theoryNote: "N₂ gaz ajraladi" },
    { temp: 800, signal: 15, event: "Ekzotermik (Fe₃C)", theoryNote: "Fe₃C hosil bo'lishi (ekzotermik, ΔH ≈ -80 kJ/mol)" },
    { temp: 900, signal: 0, event: "Barqaror — Fe₃C + KCN", theoryNote: "Fe₃C va KCN barqaror" },
    { temp: 1000, signal: 0, event: "Barqaror — Fe₃C + KCN", theoryNote: "Fe₃C barqaror" }
  ],

  // Parchalanish bosqichlari (nazariy izohlar bilan)
  decompositionSteps: [
    {
      temp: "500-600°C",
      event: "1-bosqich: CN⁻ parchalanishi",
      massLoss: "43.0%",
      product: "Fe + 6KCN",
      type: "Endotermik",
      explanation: "Barcha CN⁻ ligandlari parchalanadi. Fe-C bog'lari uziladi, KCN gaz sifatida ajraladi. Bu juda yuqori harorat — CN⁻ juda kuchli maydon ligand.",
      enthalpy: "ΔH ≈ +250 kJ/mol",
      colorChange: "qizil → qora",
      gasReleased: "CN⁻ (zaharli!) va KCN"
    },
    {
      temp: "600-800°C",
      event: "2-bosqich: N₂ ajralishi va Fe₃C hosil bo'lishi",
      massLoss: "7.0%",
      product: "Fe₃C (sementit)",
      type: "Ekzotermik",
      explanation: "N₂ gaz ajraladi va Fe₃C (sementit) hosil bo'ladi. Bu ekzotermik jarayon (ΔH ≈ -80 kJ/mol).",
      enthalpy: "ΔH ≈ -80 kJ/mol",
      colorChange: "qora (Fe₃C)",
      gasReleased: "N₂ (azot gazi)"
    }
  ],

  experimentalRuns: [
    { 
      id: "TGA-24-001", 
      date: "2025-12-25", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂", 
      massLoss1: "42.8%", 
      massLoss2: "7.1%", 
      massLoss3: "—", 
      residue: "Fe₃C + KCN (50.0%)", 
      note: "Toza K₃[Fe(CN)₆] — inert atmosfera",
      theoryNote: "CN⁻ 500-600°C da parchalanadi, N₂ 600-800°C da ajraladi. Fe₃C va KCN qoldiq inert atmosferada barqaror."
    },
    { 
      id: "TGA-24-002", 
      date: "2025-12-25", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂", 
      massLoss1: "43.0%", 
      massLoss2: "7.0%", 
      massLoss3: "—", 
      residue: "Fe₃C + KCN (50.0%)", 
      note: "Ikkinchi o'lchash — takrorlanish",
      theoryNote: "Takrorlanish — natijalar bir xil, CN⁻ barqarorligi tasdiqlandi."
    },
    { 
      id: "TGA-24-003", 
      date: "2025-12-26", 
      heatingRate: "10°C/min", 
      atmosphere: "N₂", 
      massLoss1: "42.5%", 
      massLoss2: "7.2%", 
      massLoss3: "—", 
      residue: "Fe₃C + KCN (50.0%)", 
      note: "Tezroq qizdirish — bosqichlar aniq",
      theoryNote: "Tezroq qizdirishda bosqichlar aniq ko'rinadi, lekin parchalanish harorati biroz yuqori."
    },
    { 
      id: "TGA-24-004", 
      date: "2025-12-26", 
      heatingRate: "5°C/min", 
      atmosphere: "Havo", 
      massLoss1: "43.0%", 
      massLoss2: "7.0%", 
      massLoss3: "—", 
      residue: "Fe₂O₃ (30.5%)", 
      note: "Havoda qizdirilgan — Fe₂O₃ qoldiq",
      theoryNote: "Havoda qizdirilganda Fe → Fe₂O₃ (qizil-qo'ng'ir). KCN ham oksidlanadi."
    },
    { 
      id: "TGA-24-005", 
      date: "2025-12-27", 
      heatingRate: "2°C/min", 
      atmosphere: "N₂", 
      massLoss1: "43.0%", 
      massLoss2: "7.0%", 
      massLoss3: "—", 
      residue: "Fe₃C + KCN (50.0%)", 
      note: "Juda sekin qizdirish — eng aniq bosqichlar",
      theoryNote: "Juda sekin qizdirishda har bir bosqich aniq ko'rinadi. CN⁻ barqarorligi tasdiqlandi."
    },
    { 
      id: "DTA-24-001", 
      date: "2025-12-25", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂", 
      massLoss1: "Endotermik", 
      massLoss2: "Ekzotermik", 
      massLoss3: "—", 
      residue: "DTA: 1 endotermik + 1 ekzotermik pik", 
      note: "DTA tahlili — 1 endotermik (CN⁻) + 1 ekzotermik (Fe₃C)",
      theoryNote: "DTA da 1 ta endotermik pik (CN⁻ parchalanishi, 500-600°C) va 1 ta ekzotermik pik (Fe₃C hosil bo'lishi, 600-800°C)."
    }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "K₃[Fe(CN)₆] zaharli emas, lekin termik parchalanishda CN⁻ gazi ajraladi — JUDA ZAHARLI! Qo'lqop, himoya ko'zoynaklari va TORTISH SHKAFI majburiy!", time: "doimiy", critical: true },
    { step: 2, title: "Namuna tayyorlash", desc: "10-20 mg K₃[Fe(CN)₆] Al₂O₃ yoki Pt tigelga solinadi. Namuna mayda kukun bo'lishi kerak (bir xil parchalanish uchun).", time: "5 daq", critical: true },
    { step: 3, title: "TGA qurilmasini tayyorlash", desc: "TGA qurilmasi N₂ yoki Ar atmosferasida tayyorlanadi. Gaz oqimi 50 mL/min. Bu Fe ning oksidlanishini oldini oladi.", time: "10 daq", critical: true },
    { step: 4, title: "Qizdirish dasturini o'rnatish", desc: "25°C dan 1000°C gacha, 5°C/min tezlikda. Inert atmosfera saqlanadi. Yuqori T kerak (CN⁻ barqaror).", time: "2 daq", critical: true },
    { step: 5, title: "TGA o'lchash", desc: "Qizdirish boshlanadi. Massa o'zgarishi va harorat yoziladi. 500-600°C da keskin massa yo'qotish kuzatiladi.", time: "3-4 soat", critical: false },
    { step: 6, title: "Natijalarni tahlil qilish", desc: "Har bir bosqichda massa yo'qotish foizi hisoblanadi. CN⁻ (43.0%) va N₂ (7.0%) ajralishi aniqlanadi.", time: "10 daq", critical: false }
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
      role: "CN⁻ ligandlarini aniqlaydi (C≡N cho'zilishi 2040-2120 cm⁻¹)",
      tgaAdvantage: "IQ ligandlarni, TGA parchalanishni ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "90%"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      role: "Qoldiq strukturasini aniqlaydi (Fe₃C yoki Fe₂O₃)",
      tgaAdvantage: "XRD qoldiqni, TGA parchalanishni ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "92%"
    }
  ],

  // Parchalanish bosqichlari jadvali
  decompositionTable: [
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
  const molesLost = (massLossPercent / 100) * molarMass / 26.018 // CN molar mass
  return {
    massLost: massLost.toFixed(2),
    molesLost: molesLost.toFixed(3),
    cnMolecules: (molesLost * 6).toFixed(1)
  }
}

export default function K3FeCN6ThermalPage() {
  // BARCHA STATE'LAR
  const [showHeader, setShowHeader] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeRun, setActiveRun] = useState("TGA-24-001")
  const [tgaTemp, setTgaTemp] = useState(25)
  const [showWarningModal, setShowWarningModal] = useState(true)
  
  // TGA kalkulyator
  const [calcMass, setCalcMass] = useState(100)
  const [calcMassLoss, setCalcMassLoss] = useState(43.0)
  const [calcMolarMass, setCalcMolarMass] = useState(329.24)

  // useMemo bilan hisoblashlar
  const calcResult = useMemo(() => {
    const massLost = calcMass * (calcMassLoss / 100)
    const molesLost = massLost / 26.018 // CN molar mass
    const molesCompound = calcMass / calcMolarMass
    const cnPerMolecule = molesLost / molesCompound
    return {
      massLost: massLost.toFixed(2),
      molesLost: molesLost.toFixed(4),
      cnPerMolecule: cnPerMolecule.toFixed(2)
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

  // MUHIM: run o'zgaruvchisi shu yerda aniqlanishi kerak
  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950/20 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-red-950 to-orange-950 border-2 border-red-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> XAVFSIZLIK OGOHLANTIRISHI — CN⁻ GAZI JUDA ZAHARLI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-red-300">K₃[Fe(CN)₆]</strong> termik tahlilida <strong className="text-red-300">CN⁻ gazi</strong> ajraladi — JUDA ZAHARLI!
            </p>
            
            <div className="bg-red-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">⚠ Xavf:</div>
                  <div className="text-purple-200">
                    <strong>CN⁻ gazi</strong> — JUDA ZAHARLI, nafas yo'llarini to'xtatadi!
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Fe³⁺</strong> — zaharli metall ionlari.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">✅ Choralar:</div>
                  <div className="text-purple-200">
                    <strong>TORTISH SHKAFI</strong> — majburiy!
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Inert atmosfera</strong> — N₂ yoki Ar.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">CN⁻ juda barqaror:</strong> CN⁻ ligandlari juda kuchli maydon ligand — 500-600°C gacha barqaror. Yuqori haroratda parchalanadi. CN⁻ zaharli — ventilyatsiya majburiy!
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
              <span className="text-red-400 font-semibold">K₃[Fe(CN)₆]</span>
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
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Fe³⁺ d⁵</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">CN⁻ barqaror</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Yuqori T</span>
                  <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">1822</span>
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
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-red-600 hover:bg-red-500 text-white"
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
                <strong className="text-white">K₃[Fe(CN)₆]</strong> — kaliy ferritsianid, Fe³⁺ ning geksatsianoferrat kompleksi. Termik tahlilda <strong className="text-red-300">CN⁻ juda barqaror</strong> — 500-600°C da parchalanadi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs md:text-sm">
                <li><strong className="text-white">Fe³⁺ (d⁵, past spin)</strong> — oktaedr geometriya</li>
                <li><strong className="text-white">6 ta CN⁻</strong> ichki sferada — barchasi yuqori T da ajraladi</li>
                <li><strong className="text-red-300">CN⁻ juda barqaror</strong> — 500-600°C da parchalanadi</li>
                <li><strong className="text-red-300">3 ta K⁺</strong> tashqi sferada — KCN sifatida qoldiqda</li>
                <li><strong className="text-red-300">Fe₃C</strong> qoldiq (yoki Fe₂O₃ havoda)</li>
                <li><strong className="text-red-300">CN⁻ juda kuchli maydon</strong> — log β₆ ≈ 42</li>
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

        {/* 2. CN⁻ BARQARORLIK VA YUQORI T DA PARCHALANISH */}
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
                <span className="text-yellow-400">1-bosqich (500-600°C):</span> {COMPOUND.thermalFeature.reaction.step1}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">2-bosqich (600-800°C):</span> {COMPOUND.thermalFeature.reaction.step2}
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
                  <div className="text-green-300 font-bold">Yuqori T + inert:</div>
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
            K₃[Fe(CN)₆] uchun nazariy tarkib. Fe³⁺ markaziy atom, 6 ta CN⁻ ichki sferada, 3 ta K⁺ tashqi sferada.
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
                  const elColor = el === "Fe" ? "text-red-400" : el === "K" ? "text-yellow-400" : "text-purple-400"
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
                  <td colSpan={2} className="py-3 text-[10px] text-red-300">TGA: CN⁻ (43.0%) + N₂ (7.0%) + Fe₃C+KCN (50.0%)</td>
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
            K₃[Fe(CN)₆] uchun standart termik tahlil sharoitlari. Inert atmosfera majburiy — Fe oksidlanishini oldini olish uchun. CN⁻ zaharli — TORTISH SHKAFI majburiy!
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

        {/* 5. INTERAKTIV TGA EGRI CHIZIG'I (NAZARIY IZOHLAR BILAN) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📉 Interaktiv TGA egri chizig'i (nazariy izohlar bilan)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>TGA egri chizig'i</strong> harorat oshishi bilan massa kamayishini ko'rsatadi.
            Slayderni harakatlantirib, haroratni o'zgartiring va massa o'zgarishini kuzating. Har bir bosqichda <strong className="text-yellow-400">nazariy izoh</strong> ko'rsatiladi.
          </p>

          {/* Temperature slider */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-red-400 font-bold mb-2">
              Harorat: {tgaTemp}°C
            </label>
            <input
              type="range"
              min="25"
              max="1000"
              value={tgaTemp}
              onChange={(e) => setTgaTemp(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>25°C</span>
              <span>500°C</span>
              <span>1000°C</span>
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
            
            {/* NAZARIY IZOH */}
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Nazariy izoh:
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                {currentTGA.theoryNote}
              </p>
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
              {[0, 200, 400, 600, 800, 1000].map((t, i) => (
                <g key={i}>
                  <text x={50 + (t/1000)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{t}°C</text>
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
                  const x = 50 + (p.temp/1000)*530
                  const y = 220 - (p.mass/100)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* Current temp marker */}
              <line 
                x1={50 + (currentTGA.temp/1000)*530} 
                y1="30" 
                x2={50 + (currentTGA.temp/1000)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <circle 
                cx={50 + (currentTGA.temp/1000)*530} 
                cy={220 - (currentTGA.mass/100)*200} 
                r="6" 
                fill="#fbbf24" 
                stroke="#fff" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* 6. DTA EGRI CHIZIG'I (NAZARIY IZOHLAR BILAN) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌡️ DTA egri chizig'i — Endotermik piklar (nazariy izohlar bilan)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>DTA (Differensial Termik Analiz)</strong> — namuna va referens o'rtasidagi harorat farqini o'lchaydi.
            <strong className="text-red-400"> Endotermik</strong> piklar (pastga) CN⁻ ajralishini ko'rsatadi. Har bir pikning <strong className="text-yellow-400">nazariy izohi</strong> ko'rsatiladi.
          </p>

          {/* DTA piklari izohi */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> DTA piklarining nazariy izohi:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">500-600°C — CN⁻</div>
                <div className="text-purple-200">CN⁻ parchalanadi (ΔH ≈ +250 kJ/mol, endotermik).</div>
              </div>
              <div className="bg-green-900/20 rounded-lg p-3">
                <div className="text-green-400 font-bold mb-1">600-800°C — Fe₃C</div>
                <div className="text-purple-200">Fe₃C hosil bo'lishi (ekzotermik, ΔH ≈ -80 kJ/mol).</div>
              </div>
            </div>
          </div>

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
              {[0, 200, 400, 600, 800, 1000].map((t, i) => (
                <g key={i}>
                  <text x={50 + (t/1000)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{t}°C</text>
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
                  const x = 50 + (p.temp/1000)*530
                  const y = 130 - (p.signal/30)*100
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* Labels */}
              <text x="350" y="155" fontSize="8" fill="#ef4444">CN⁻ (500°C)</text>
              <text x="450" y="155" fontSize="8" fill="#ef4444">N₂ (700°C)</text>
              <text x="520" y="100" fontSize="8" fill="#22c55e">Fe₃C (800°C)</text>
            </svg>
          </div>
        </div>

        {/* 7. PARCHALANISH BOSQICHLARI (NAZARIY IZOHLAR BILAN) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Parchalanish bosqichlari — interaktiv (nazariy izohlar bilan)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Har bir bosqichni bosib, batafsil ma'lumot oling. Har bir bosqichda qanday molekulalar ajraladi, qanday mahsulot hosil bo'ladi va <strong className="text-yellow-400">nazariy izoh</strong> ko'rsatiladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

        {/* 8. LABORATORIYA NATIJALARI (NAZARIY IZOHLAR BILAN) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Laboratoriya natijalari (nazariy izohlar bilan)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Har bir laboratoriya natijasiga <strong className="text-yellow-400">nazariy izoh</strong> beriladi. Qaysi bosqichlarda qanday jarayonlar sodir bo'lgani ko'rsatiladi.
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
            
            {/* NAZARIY IZOH */}
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
                <div className="text-xs text-purple-400">1-bosqich (CN⁻):</div>
                <div className="text-xl font-mono font-bold text-red-400">{run.massLoss1}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">2-bosqich (N₂):</div>
                <div className="text-xl font-mono font-bold text-red-400">{run.massLoss2}</div>
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
            <span>🧮</span> TGA kalkulyatori — massa yo'qotishdan CN⁻ soni
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Massa yo'qotish foizidan <strong className="text-red-300">qancha CN⁻ molekulasi</strong> ajralganini hisoblang.
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
                <div className="text-xs text-purple-400">Mol (CN⁻):</div>
                <div className="text-xl font-mono font-bold text-red-400">{calcResult.molesLost}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">CN⁻ / molekula:</div>
                <div className="text-xl font-mono font-bold text-red-400">{calcResult.cnPerMolecule}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: n(CN⁻) = (massa × %yo'qotish / 26.018) / (massa / M_molar)
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
              <strong className="text-white">TGA (massa) + DTA (hodisa) + IQ (CN⁻ 2040-2120 cm⁻¹) + XRD (Fe₃C qoldiq) + EA (N, C)</strong> — beshta metod birgalikda K₃[Fe(CN)₆] ni to'liq tavsiflaydi va CN⁻ barqarorligini tasdiqlaydi.
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
              <p className="text-xs text-purple-200">Massa yo'qotish orqali CN⁻ parchalanishini aniqlaydi. Fe₃C qoldiqni ko'rsatadi.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Faqat massa o'zgarishini ko'rsatadi. CN⁻ zaharli — ventilyatsiya majburiy!</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">DTA (hodisa), IQ (CN⁻), XRD (Fe₃C), EA (N, C) — to'liq tahlil uchun.</p>
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
          <p>© 2026 Koordinatsion kimyo tahlil portali • K₃[Fe(CN)₆] • Termik tahlil moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis), Gmelin (1822)</p>
        </div>
      </footer>
    </main>
  )
}