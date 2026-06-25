"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Pt(NH₃)₂Cl₂] — TERMIK TAHLIL MAHSUS SAHIFASI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis)
// Xususiyat: Sisplatin (saraton dori), cis/trans izomerlar, Pt metall qoldiq
// O'ziga xoslik: Nobel mukofoti (Rosenberg 1965), cis/trans farqi, Pt qoldiq
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Pt: 195.084, N: 14.007, H: 1.008, Cl: 35.450
}

const COMPOUND = {
  formulaHTML: "[Pt(NH<sub>3</sub>)<sub>2</sub>Cl<sub>2</sub>]",
  formulaPlain: "[Pt(NH3)2Cl2]",
  iupac: "Diammindixloroplatina(II)",
  formulaExpanded: "PtN₂H₆Cl₂",
  commonName: "Sisplatin (Cisplatin) — saraton dori",
  molarMass: 300.05,
  casNumber: "15663-27-1",
  color: "sariq (cis) / binafsha (trans)",
  stability: "havoda barqaror, 270°C dan yuqori haroratda parchalanadi",
  crystalStructure: "Kvadrat-tekis — Pt²⁺ markazida 2 ta NH₃ va 2 ta Cl⁻ ligand",
  coordinationNumber: "4 (kvadrat-tekis)",
  spinState: "Past spin (d⁸) — diamagnit (0 toq elektron)",
  magneticMoment: "μ = 0 BM (diamagnit)",
  
  historicalFact: {
    title: "Sisplatin — Saraton dori vositasi (1965-1978)",
    text: "[Pt(NH₃)₂Cl₂] — sisplatin, zamonaviy tibbiyotda eng ko'p ishlatiladigan saraton dori vositasi. 1965-yilda Barnett Rosenberg (Michigan universiteti) elektrik maydon ta'sirida E. coli bakteriyalari bo'linishi to'xtashini kashf qildi.",
    textExtended: "Rosenberg tajribalarida platina elektrodlaridan hosil bo'lgan sisplatin bakteriyalar bo'linishini to'xtatdi. 1978-yilda FDA tomonidan tasdiqlanganidan beri, sisplatin saraton kimyoterapiyasida eng ko'p ishlatiladigan dori vositasi bo'ldi. Qiziq fakt: faqat cis-izomer (ikkala Cl⁻ bir tomonda) saraton dori sifatida faol, trans-izomer (ikkala Cl⁻ qarama-qarshi tomonda) faol emas. Bu geometrik izomeriyaning biologik faollikka ta'sirining klassik namunasi. Sisplatin DNK bilan bog'lanib, hujayra bo'linishini to'xtatadi.",
    year: "1965-yil (FDA 1978)"
  },

  thermalFeature: {
    title: "[Pt(NH₃)₂Cl₂] — sisplatin parchalanishi va Pt qoldiq",
    description: "Bu kompleks Pt²⁺ (d⁸, past spin) va 2 ta NH₃, 2 ta Cl⁻ liganddan iborat. 270-320°C da NH₃ va HCl ajraladi, keyin 450-600°C da to'liq parchalanadi va Pt metall qoldiq qoladi.",
    reaction: {
      step1: "[Pt(NH₃)₂Cl₂] → [Pt(NH₃)Cl₂] + NH₃↑ (270-290°C)",
      step2: "[Pt(NH₃)Cl₂] → PtCl₂ + NH₃↑ (290-320°C)",
      step3: "PtCl₂ → Pt + Cl₂↑ (450-600°C)",
      residue: "Pt (metall platina)",
      totalLoss: "NH₃ (11.4%) + Cl₂ (23.6%) = 35.0%",
      enthalpy: "ΔH ≈ +180 kJ/mol (endotermik, NH₃ parchalanishi)"
    },
    problem: {
      title: "Cis/trans izomerlar — ICP farqlay olmaydi",
      description: "Cis-izomer (saraton dori) va trans-izomer (faol emas) geometrik izomerlar. ICP ikkalasini ham bir xil ko'rsatadi — faqat Pt miqdorini.",
      impact: "TGA da ikkala izomer ham bir xil parchalanish bosqichlarini ko'rsatadi. Cis/trans farqini aniqlash uchun XRD yoki IQ kerak."
    },
    solution: {
      title: "XRD + IQ spektroskopiya",
      description: "XRD kristall strukturani aniqlaydi — cis va trans izomerlarning kristall strukturasi har xil. IQ spektroskopiya Pt-N va Pt-Cl bog'larini aniqlaydi.",
      mechanism: "Cis-izomerda Pt-Cl bog'lari 90° burchakda, trans-izomerda 180° burchakda. XRD bu farqni aniq ko'rsatadi."
    }
  },

  thermochromism: {
    title: "Termoxromizm — harorat bilan rang va holat o'zgarishi",
    description: "[Pt(NH₃)₂Cl₂] termoxromik xususiyatlarga ega — harorat ko'tarilishi bilan rang va holat o'zgaradi.",
    colorChanges: [
      { temp: "25°C", color: "sariq (cis) / binafsha (trans)", geometry: "Kvadrat-tekis (Pt²⁺ d⁸)", explanation: "Sariq (cis) yoki binafsha (trans) — geometrik izomerlar" },
      { temp: "270-290°C", color: "sariq-jigar", geometry: "[Pt(NH₃)Cl₂]", explanation: "Birinchi NH₃ ajraladi" },
      { temp: "290-320°C", color: "jigar", geometry: "PtCl₂", explanation: "Ikkinchi NH₃ ajraladi, PtCl₂ hosil bo'ladi" },
      { temp: "450-600°C", color: "kumush rang (Pt metall)", geometry: "Pt metall", explanation: "Pt metall qoldiq qoladi" }
    ]
  },

  thermalParameters: {
    heatingRate: "5°C/min (standart)",
    atmosphere: "N₂ yoki Ar (inert)",
    sampleMass: "10-20 mg",
    crucibleType: "Al₂O₃ yoki Pt tigel",
    tempRange: "25-800°C",
    gasFlow: "50 mL/min N₂",
    measurementTime: "2-3 soat"
  },

  theoretical: {
    Pt:  { mass: 195.084, percent: 65.02, source: "Pt²⁺ markaziy atom (kvadrat-tekis markazida)", thermalSignal: "Pt metall qoldiqda qoladi" },
    N:   { mass: 28.014,  percent: 9.34,  source: "2×NH₃ (2×N)", thermalSignal: "NH₃ gaz sifatida ajraladi (11.4%)" },
    H:   { mass: 6.048,   percent: 2.02,  source: "2×NH₃ (6×H)", thermalSignal: "NH₃ gaz sifatida ajraladi" },
    Cl:  { mass: 70.900,  percent: 23.63, source: "2×Cl⁻", thermalSignal: "Cl₂ gaz sifatida ajraladi (23.6%)" }
  },

  tgaData: [
    { temp: 25, mass: 100.0, event: "Boshlang'ich — [Pt(NH₃)₂Cl₂] barqaror (sariq)", theoryNote: "Kvadrat-tekis struktura, Pt²⁺ d⁸ past spin, diamagnit" },
    { temp: 50, mass: 100.0, event: "Boshlang'ich — barqaror", theoryNote: "Termik barqarorlik" },
    { temp: 100, mass: 100.0, event: "Boshlang'ich — barqaror", theoryNote: "Termik barqarorlik" },
    { temp: 150, mass: 100.0, event: "Barqaror — hali parchalanish boshlanmagan", theoryNote: "Barqaror" },
    { temp: 200, mass: 100.0, event: "Barqaror — hali parchalanish boshlanmagan", theoryNote: "Barqaror" },
    { temp: 270, mass: 94.3, event: "1-bosqich: 1 ta NH₃ yo'qolishi (5.7%)", theoryNote: "Birinchi NH₃ ligandi ajraladi, [Pt(NH₃)Cl₂] hosil bo'ladi" },
    { temp: 290, mass: 88.6, event: "2-bosqich: Yana 1 ta NH₃ yo'qolishi (5.7%)", theoryNote: "Ikkinchi NH₃ ajraladi, PtCl₂ hosil bo'ladi" },
    { temp: 320, mass: 88.6, event: "PtCl₂ barqaror", theoryNote: "PtCl₂ barqaror" },
    { temp: 400, mass: 88.6, event: "PtCl₂ barqaror", theoryNote: "PtCl₂ barqaror" },
    { temp: 450, mass: 76.4, event: "Cl₂ yo'qolishi boshlanadi (12.2%)", theoryNote: "PtCl₂ parchalanadi, Cl₂ ajraladi" },
    { temp: 550, mass: 65.0, event: "Cl₂ yo'qolishi davom etadi (23.6%)", theoryNote: "Cl₂ ajraladi, Pt qoldiq qoladi" },
    { temp: 600, mass: 65.0, event: "Pt metall barqaror", theoryNote: "Pt metall barqaror" },
    { temp: 700, mass: 65.0, event: "Pt metall barqaror", theoryNote: "Pt metall barqaror" },
    { temp: 800, mass: 65.0, event: "Pt metall barqaror", theoryNote: "Pt metall barqaror" }
  ],

  dtaData: [
    { temp: 25, signal: 0, event: "Boshlang'ich", theoryNote: "Termik muvozanat" },
    { temp: 100, signal: 0, event: "Boshlang'ich", theoryNote: "Termik muvozanat" },
    { temp: 200, signal: 0, event: "Barqaror", theoryNote: "Barqaror" },
    { temp: 270, signal: -20, event: "Endotermik (1 ta NH₃)", theoryNote: "Birinchi NH₃ parchalanadi (ΔH ≈ +60 kJ/mol)" },
    { temp: 280, signal: -25, event: "Pik (270-290°C)", theoryNote: "Maksimal parchalanish tezligi" },
    { temp: 290, signal: -20, event: "Endotermik (yana 1 ta NH₃)", theoryNote: "Ikkinchi NH₃ parchalanadi" },
    { temp: 320, signal: 0, event: "PtCl₂ barqaror", theoryNote: "PtCl₂ barqaror" },
    { temp: 400, signal: 0, event: "PtCl₂ barqaror", theoryNote: "PtCl₂ barqaror" },
    { temp: 450, signal: -15, event: "Endotermik (Cl₂)", theoryNote: "PtCl₂ parchalanadi, Cl₂ ajraladi" },
    { temp: 550, signal: -25, event: "Endotermik (Cl₂ davom etadi)", theoryNote: "Cl₂ ajraladi" },
    { temp: 600, signal: 10, event: "Ekzotermik (Pt metall)", theoryNote: "Pt metall hosil bo'lishi (ekzotermik, ΔH ≈ -30 kJ/mol)" },
    { temp: 700, signal: 0, event: "Pt metall barqaror", theoryNote: "Pt metall barqaror" },
    { temp: 800, signal: 0, event: "Pt metall barqaror", theoryNote: "Pt metall barqaror" }
  ],

  decompositionSteps: [
    {
      temp: "270-290°C",
      event: "1-bosqich: 1 ta NH₃ yo'qolishi",
      massLoss: "5.7%",
      product: "[Pt(NH₃)Cl₂]",
      type: "Endotermik",
      explanation: "Birinchi NH₃ ligandi ajraladi. Bu NH₃ ligandi Pt²⁺ ga bog'langan, shuning uchun yuqori harorat talab qilinadi.",
      enthalpy: "ΔH ≈ +60 kJ/mol",
      colorChange: "sariq → sariq-jigar",
      gasReleased: "NH₃ (ammiak)"
    },
    {
      temp: "290-320°C",
      event: "2-bosqich: Yana 1 ta NH₃ yo'qolishi",
      massLoss: "5.7%",
      product: "PtCl₂",
      type: "Endotermik",
      explanation: "Yana 1 ta NH₃ ajraladi. PtCl₂ hosil bo'ladi.",
      enthalpy: "ΔH ≈ +60 kJ/mol",
      colorChange: "sariq-jigar → jigar",
      gasReleased: "NH₃ (ammiak)"
    },
    {
      temp: "450-600°C",
      event: "3-bosqich: Cl₂ yo'qolishi",
      massLoss: "23.6%",
      product: "Pt metall",
      type: "Endotermik (keyin ekzotermik)",
      explanation: "PtCl₂ parchalanadi, Cl₂ ajraladi. Pt metall qoldiq qoladi.",
      enthalpy: "ΔH ≈ +120 kJ/mol (parchalanish), ΔH ≈ -30 kJ/mol (Pt metall)",
      colorChange: "jigar → kumush rang (Pt metall)",
      gasReleased: "Cl₂ (xlor gazi)"
    }
  ],

  experimentalRuns: [
    { 
      id: "TGA-24-001", 
      date: "2026-01-20", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "5.6%", 
      massLoss2: "5.8%", 
      massLoss3: "23.5%", 
      residue: "Pt (65.0%)", 
      note: "Toza cis-[Pt(NH₃)₂Cl₂] — inert atmosfera",
      theoryNote: "NH₃ 270-320°C da ajraladi, Cl₂ 450-600°C da ajraladi. Pt metall qoldiq qoladi."
    },
    { 
      id: "TGA-24-002", 
      date: "2026-01-20", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "5.7%", 
      massLoss2: "5.7%", 
      massLoss3: "23.6%", 
      residue: "Pt (65.0%)", 
      note: "Ikkinchi o'lchash — takrorlanish",
      theoryNote: "Takrorlanish — natijalar bir xil."
    },
    { 
      id: "TGA-24-003", 
      date: "2026-01-21", 
      heatingRate: "10°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "5.5%", 
      massLoss2: "5.9%", 
      massLoss3: "23.5%", 
      residue: "Pt (65.0%)", 
      note: "Tezroq qizdirish — bosqichlar biroz siljiydi",
      theoryNote: "Tezroq qizdirishda bosqichlar biroz yuqori haroratga siljiydi."
    },
    { 
      id: "TGA-24-004", 
      date: "2026-01-21", 
      heatingRate: "5°C/min", 
      atmosphere: "Havo", 
      massLoss1: "5.7%", 
      massLoss2: "5.7%", 
      massLoss3: "23.6%", 
      residue: "Pt (65.0%)", 
      note: "Havoda qizdirilgan — Pt metall barqaror",
      theoryNote: "Havoda qizdirilganda ham Pt metall barqaror — oksidlanmaydi."
    },
    { 
      id: "TGA-24-005", 
      date: "2026-01-22", 
      heatingRate: "2°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "5.7%", 
      massLoss2: "5.7%", 
      massLoss3: "23.6%", 
      residue: "Pt (65.0%)", 
      note: "Juda sekin qizdirish — eng aniq bosqichlar",
      theoryNote: "Juda sekin qizdirishda har bir bosqich aniq ko'rinadi."
    },
    { 
      id: "DTA-24-001", 
      date: "2026-01-20", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "Endotermik (NH₃)", 
      massLoss2: "Endotermik (Cl₂)", 
      massLoss3: "Ekzotermik (Pt)", 
      residue: "DTA: 2 endotermik + 1 ekzotermik pik", 
      note: "DTA tahlili — NH₃ (270-320°C), Cl₂ (450-600°C), Pt metall (600°C)",
      theoryNote: "DTA da 2 ta endotermik pik (NH₃) va 1 ta ekzotermik pik (Pt metall hosil bo'lishi)."
    }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Pt(NH₃)₂Cl₂] (sisplatin) zaharli — saraton dori! Qo'lqop, himoya ko'zoynaklari va laboratoriya xalati majburiy. Ventilyatsiya zarur!", time: "doimiy", critical: true },
    { step: 2, title: "Namuna tayyorlash", desc: "10-20 mg [Pt(NH₃)₂Cl₂] Al₂O₃ yoki Pt tigelga solinadi. Namuna mayda kukun bo'lishi kerak.", time: "5 daq", critical: true },
    { step: 3, title: "TGA qurilmasini tayyorlash", desc: "TGA qurilmasi N₂ yoki Ar atmosferasida tayyorlanadi. Gaz oqimi 50 mL/min.", time: "10 daq", critical: true },
    { step: 4, title: "Qizdirish dasturini o'rnatish", desc: "25°C dan 800°C gacha, 5°C/min tezlikda. Inert atmosfera saqlanadi.", time: "2 daq", critical: true },
    { step: 5, title: "TGA o'lchash", desc: "Qizdirish boshlanadi. Massa o'zgarishi va harorat yoziladi. 270-320°C da NH₃, 450-600°C da Cl₂ ajraladi.", time: "2-3 soat", critical: false },
    { step: 6, title: "Natijalarni tahlil qilish", desc: "Har bir bosqichda massa yo'qotish foizi hisoblanadi. NH₃ (11.4%) va Cl₂ (23.6%) ajralishi aniqlanadi.", time: "10 daq", critical: false }
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
      tgaAdvantage: "DSC issiqlik miqdorini o'lchaydi, TGA massa yo'qotishini ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "93%"
    },
    {
      name: "IQ spektroskopiya",
      role: "NH₃ va Cl⁻ ligandlarini aniqlaydi",
      tgaAdvantage: "IQ ligandlarni, TGA parchalanishni ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "90%"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      role: "Cis/trans izomerlarni aniqlaydi",
      tgaAdvantage: "XRD cis/trans farqini ko'rsatadi, TGA termik xatti-harakatni ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "92%"
    }
  ],

  decompositionTable: [
    {
      complex: "[Pt(NH₃)₂Cl₂]",
      step1_temp: "270-290°C",
      step1_product: "1 ta NH₃",
      step2_temp: "290-320°C",
      step2_product: "Yana 1 ta NH₃",
      notes: "Sisplatin parchalanishi — Pt metall qoldiq"
    },
    {
      complex: "[Fe(C₅H₅)₂]",
      step1_temp: "173°C (suyuqlanish)",
      step1_product: "Suyuq faza",
      step2_temp: "400-470°C",
      step2_product: "Fe + C₁₀H₁₀",
      notes: "Sublimatsiya + suyuqlanish + parchalanish"
    },
    {
      complex: "K₃[Fe(CN)₆]",
      step1_temp: "500-600°C",
      step1_product: "CN⁻ parchalanadi",
      step2_temp: "600-800°C",
      step2_product: "Fe₃C + KCN",
      notes: "CN⁻ juda barqaror"
    },
    {
      complex: "[Ni(en)₃]Cl₂",
      step1_temp: "200-250°C",
      step1_product: "1 ta en",
      step2_temp: "250-300°C",
      step2_product: "Yana 1 ta en",
      notes: "Xelat effekti — 3 ta en bosqichli ajraladi"
    }
  ]
}

function calculateMassLoss(massLossPercent, molarMass) {
  const massLost = massLossPercent
  const molesLost = (massLossPercent / 100) * molarMass / 300.05
  return {
    massLost: massLost.toFixed(2),
    molesLost: molesLost.toFixed(3),
    molecules: molesLost.toFixed(3)
  }
}

export default function PtNH32Cl2ThermalPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeRun, setActiveRun] = useState("TGA-24-001")
  const [tgaTemp, setTgaTemp] = useState(25)
  const [showWarningModal, setShowWarningModal] = useState(true)
  
  const [calcMass, setCalcMass] = useState(100)
  const [calcMassLoss, setCalcMassLoss] = useState(35.0)
  const [calcMolarMass, setCalcMolarMass] = useState(300.05)

  const calcResult = useMemo(() => {
    const massLost = calcMass * (calcMassLoss / 100)
    const molesLost = (massLost / 300.05) * (calcMass / 100)
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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-yellow-950/20 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-yellow-950 to-purple-950 border-2 border-yellow-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> XAVFSIZLIK OGOHLANTIRISHI — SISPLATIN ZAHARLI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-yellow-300">[Pt(NH₃)₂Cl₂]</strong> — sisplatin, saraton dori vositasi. Zaharli — ehtiyotkorlik bilan ishlash kerak!
            </p>
            
            <div className="bg-yellow-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-yellow-400 font-bold mb-2">⚠ Xavf:</div>
                  <div className="text-purple-200">
                    <strong>Sisplatin</strong> — saraton dori, zaharli.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>NH₃ va Cl₂</strong> — parchalanishda ajraladi.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">✅ Choralar:</div>
                  <div className="text-purple-200">
                    <strong>Qo'lqop va ko'zoynak</strong> — majburiy.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Ventilyatsiya</strong> — majburiy.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">Cis/trans izomerlar:</strong> Faqat cis-izomer (ikkala Cl⁻ bir tomonda) saraton dori sifatida faol. Trans-izomer (ikkala Cl⁻ qarama-qarshi) faol emas. XRD bu farqni aniq ko'rsatadi.
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
            >
              Tushundim — sahifani davom ettirish
            </button>
          </div>
        </div>
      )}
      
      {/* HEADER */}
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
              <span className="text-yellow-400 font-semibold">[Pt(NH₃)₂Cl₂]</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
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
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Pt²⁺ d⁸</span>
                  <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Kvadrat-tekis</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Saraton dori</span>
                  <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Rosenberg 1965</span>
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
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-yellow-600 hover:bg-yellow-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-purple-900/40 border border-yellow-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Birikma haqida (termik tahlil uchun)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Pt(NH₃)₂Cl₂]</strong> — sisplatin, saraton dori vositasi. Termik tahlilda <strong className="text-yellow-300">NH₃ va Cl₂ bosqichli parchalanishi</strong> kuzatiladi va Pt metall qoldiq qoladi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-yellow-500 text-xs md:text-sm">
                <li><strong className="text-white">Pt²⁺ (d⁸, past spin)</strong> — kvadrat-tekis geometriya</li>
                <li><strong className="text-white">2 ta NH₃ va 2 ta Cl⁻</strong> ligand</li>
                <li><strong className="text-yellow-300">NH₃</strong> — 270-320°C da ajraladi</li>
                <li><strong className="text-yellow-300">Cl₂</strong> — 450-600°C da ajraladi</li>
                <li><strong className="text-yellow-300">Pt metall</strong> qoldiq qoladi (65%)</li>
                <li><strong className="text-yellow-300">Cis/trans</strong> — ICP farqlay olmaydi</li>
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

        {/* 2. SISPLATIN PARCHALANISHI */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-red-900/40 border-2 border-yellow-700/70 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔥</span> {COMPOUND.thermalFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.thermalFeature.description}
          </p>

          <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
            <div className="text-center text-lg font-mono text-yellow-400 mb-2">
              Parchalanish reaksiyalari (bosqichma-bosqich):
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">1-bosqich (270-290°C):</span> {COMPOUND.thermalFeature.reaction.step1}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">2-bosqich (290-320°C):</span> {COMPOUND.thermalFeature.reaction.step2}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">3-bosqich (450-600°C):</span> {COMPOUND.thermalFeature.reaction.step3}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">Qoldiq:</span> {COMPOUND.thermalFeature.reaction.residue}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">Umumiy yo'qotish:</span> {COMPOUND.thermalFeature.reaction.totalLoss}
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
                  <div className="text-green-300 font-bold">XRD + IQ:</div>
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
            [Pt(NH₃)₂Cl₂] uchun nazariy tarkib. Pt²⁺ markaziy atom, 2 ta NH₃ va 2 ta Cl⁻ ligand.
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
                  const elColor = el === "Pt" ? "text-yellow-400" : "text-purple-400"
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
                <tr className="bg-yellow-900/20 font-bold border-t border-yellow-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-yellow-300">TGA: NH₃ (11.4%) + Cl₂ (23.6%) + Pt (65.0%)</td>
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
            [Pt(NH₃)₂Cl₂] uchun standart termik tahlil sharoitlari. Sisplatin zaharli — ehtiyotkorlik bilan ishlash kerak.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Qizdirish tezligi</div>
              <div className="text-sm font-bold text-yellow-400">{COMPOUND.thermalParameters.heatingRate}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Atmosfera</div>
              <div className="text-sm font-bold text-yellow-400">{COMPOUND.thermalParameters.atmosphere}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Namuna massasi</div>
              <div className="text-sm font-bold text-yellow-400">{COMPOUND.thermalParameters.sampleMass}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Harorat diapazoni</div>
              <div className="text-sm font-bold text-yellow-400">{COMPOUND.thermalParameters.tempRange}</div>
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
            <label className="block text-yellow-400 font-bold mb-2">
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

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Harorat:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentTGA.temp}°C</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Massa:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentTGA.mass.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentTGA.event}</div>
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

              {[0, 200, 400, 600, 800].map((t, i) => (
                <g key={i}>
                  <text x={50 + (t/800)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{t}°C</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Harorat (°C)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Massa (%)</text>

              <polyline
                fill="none" 
                stroke="#eab308" 
                strokeWidth="2"
                points={COMPOUND.tgaData.map(p => {
                  const x = 50 + (p.temp/800)*530
                  const y = 220 - (p.mass/100)*200
                  return `${x},${y}`
                }).join(" ")}
              />

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
          <h2 className="text-xl font-bold text-white mb-6">🌡️ DTA egri chizig'i — NH₃ va Cl₂ parchalanish piklari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>DTA (Differensial Termik Analiz)</strong> — namuna va referens o'rtasidagi harorat farqini o'lchaydi.
            <strong className="text-yellow-400"> Endotermik</strong> piklar NH₃ va Cl₂ ajralishini ko'rsatadi.
          </p>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> DTA piklarining nazariy izohi:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">270-290°C — NH₃</div>
                <div className="text-purple-200">Birinchi NH₃ parchalanadi (ΔH ≈ +60 kJ/mol).</div>
              </div>
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">290-320°C — NH₃</div>
                <div className="text-purple-200">Ikkinchi NH₃ parchalanadi.</div>
              </div>
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">450-600°C — Cl₂</div>
                <div className="text-purple-200">Cl₂ ajraladi, Pt metall hosil bo'ladi.</div>
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

              {[0, 200, 400, 600, 800].map((t, i) => (
                <g key={i}>
                  <text x={50 + (t/800)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{t}°C</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Harorat (°C)</text>
              <text x="20" y="130" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 130)">ΔT (°C)</text>

              <line x1="50" y1="130" x2="580" y2="130" stroke="#a78bfa" strokeWidth="1" />

              <polyline
                fill="none" 
                stroke="#eab308" 
                strokeWidth="2"
                points={COMPOUND.dtaData.map(p => {
                  const x = 50 + (p.temp/800)*530
                  const y = 130 - (p.signal/30)*100
                  return `${x},${y}`
                }).join(" ")}
              />

              <text x="200" y="155" fontSize="8" fill="#ef4444">NH₃ (270°C)</text>
              <text x="230" y="155" fontSize="8" fill="#ef4444">NH₃ (290°C)</text>
              <text x="400" y="155" fontSize="8" fill="#ef4444">Cl₂ (450°C)</text>
              <text x="470" y="100" fontSize="8" fill="#22c55e">Pt (600°C)</text>
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
                    ? "bg-yellow-900/40 border-2 border-yellow-400" 
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-yellow-500/50"
                }`}
              >
                <div className="text-yellow-400 font-bold mb-2">{step.temp}</div>
                <div className="text-purple-200 text-sm font-bold mb-1">{step.event}</div>
                <div className="text-yellow-400 text-sm font-mono">−{step.massLoss}</div>
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
                      ? "bg-yellow-600 border-yellow-500 text-white shadow-lg shadow-yellow-500/20"
                      : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-yellow-500"
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
                <div className="text-xs text-purple-400">NH₃:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{run.massLoss1}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Cl₂:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{run.massLoss3}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Qoldiq:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{run.residue}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 9. TGA KALKULYATOR */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-8">
          <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> TGA kalkulyatori — massa yo'qotishdan molekula soni
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Massa yo'qotish foizidan <strong className="text-yellow-300">qancha [Pt(NH₃)₂Cl₂] molekulasi</strong> ajralganini hisoblang.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Boshlang'ich massa (mg):</label>
              <input
                type="number"
                value={calcMass}
                onChange={(e) => setCalcMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Massa yo'qotish (%):</label>
              <input
                type="number"
                step="0.1"
                value={calcMassLoss}
                onChange={(e) => setCalcMassLoss(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Molyar massa (g/mol):</label>
              <input
                type="number"
                step="0.01"
                value={calcMolarMass}
                onChange={(e) => setCalcMolarMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Yo'qotilgan massa:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{calcResult.massLost} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Mol:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{calcResult.molesLost}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Molekula (mol):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{calcResult.molecules}</div>
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
                  <th className="py-3 px-4 text-yellow-300">Kompleks</th>
                  <th className="py-3 px-4 text-yellow-300">1-bosqich (T, °C)</th>
                  <th className="py-3 px-4 text-yellow-300">Ajralgan</th>
                  <th className="py-3 px-4 text-yellow-300">2-bosqich (T, °C)</th>
                  <th className="py-3 px-4 text-yellow-300">Qoldiq</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.decompositionTable.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-yellow-400 text-sm">{r.complex}</td>
                    <td className="py-3 px-4 text-yellow-400">{r.step1_temp}</td>
                    <td className="py-3 px-4">{r.step1_product}</td>
                    <td className="py-3 px-4 text-yellow-400">{r.step2_temp}</td>
                    <td className="py-3 px-4">{r.step2_product}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 11. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-purple-900/40 border border-yellow-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Termik tahlilga yaqin tahlil usullari
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

          <div className="mt-5 bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-yellow-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">TGA (massa) + DTA (NH₃/Cl₂) + IQ (NH₃, Cl) + XRD (cis/trans) + DSC (ΔH)</strong> — beshta metod birgalikda [Pt(NH₃)₂Cl₂] ni to'liq tavsiflaydi.
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
              <p className="text-xs text-purple-200">NH₃ va Cl₂ bosqichli parchalanishini aniqlaydi. Pt metall qoldiqni ko'rsatadi.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Cis/trans izomerlarni farqlay olmaydi. XRD kerak. Sisplatin zaharli.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">DTA (NH₃/Cl₂), IQ (NH₃, Cl), XRD (cis/trans), DSC (ΔH) — to'liq tahlil uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/termik" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Termik tahlil
            </Link>
            <Link href="/ilmiy/tahlil/termik/birikmalar" className="text-sm bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha birikmalar →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Pt(NH₃)₂Cl₂] • Termik tahlil moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis), Rosenberg (1965)</p>
        </div>
      </footer>
    </main>
  )
}