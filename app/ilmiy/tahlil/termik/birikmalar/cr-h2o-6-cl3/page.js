"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Cr(H₂O)₆]Cl₃ — TERMIK TAHLIL MAHSUS SAHIFASI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis)
// Xususiyat: Gidrat izomeriya (binafsha), 6 ta ichki H₂O, Cr³⁺ inert
// O'ziga xoslik: Barcha 6 ta H₂O ichki sferada — yuqori T da ajraladi
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Cr: 51.996, Cl: 35.450, H: 1.008, O: 15.999
}

const COMPOUND = {
  formulaHTML: "[Cr(H<sub>2</sub>O)<sub>6</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Cr(H2O)6]Cl3",
  iupac: "Geksaakvaxrom(III) xlorid",
  formulaExpanded: "CrH₁₂O₆Cl₃",
  commonName: "Geksaakvaxrom(III) xlorid (binafsha)",
  molarMass: 266.45,
  casNumber: "10025-73-7",
  color: "binafsha (violeo)",
  stability: "havoda barqaror, Cr³⁺ inert (d³), 200°C dan yuqori haroratda parchalanadi",
  crystalStructure: "Oktaedr — Cr³⁺ markazida 6 ta H₂O ligand (ichki sfera), 3 ta Cl⁻ tashqi sferada",
  coordinationNumber: "6 (oktaedr)",
  spinState: "Yuqori spin (t₂g³ e_g⁰) — paramagnit (3 toq elektron)",
  magneticMoment: "μ ≈ 3.8 BM (3 toq elektron)",
  
  historicalFact: {
    title: "Gidrat izomeriya — Verner nazariyasining isboti (1893)",
    text: "[Cr(H₂O)₆]Cl₃ — binafsha (violeo) tuzi, CrCl₃·6H₂O ning uchta gidrat izomeridan biri. Alfred Werner (1893) bu uchta izomerni o'rganib, koordinatsion nazariyasini isbotladi.",
    textExtended: "CrCl₃·6H₂O ning uchta gidrat izomeri mavjud: (1) [Cr(H₂O)₆]Cl₃ — binafsha, barcha 6 ta H₂O ichki sferada, 3 ta Cl⁻ tashqi sferada (AgNO₃ bilan barcha 3 ta Cl⁻ cho'kadi); (2) [CrCl(H₂O)₅]Cl₂·H₂O — och yashil, 1 ta Cl⁻ ichki sferada, 2 ta Cl⁻ tashqi sferada, 1 ta H₂O tashqi sferada (AgNO₃ bilan faqat 2 ta Cl⁻ cho'kadi); (3) [CrCl₂(H₂O)₄]Cl·2H₂O — to'q yashil, 2 ta Cl⁻ ichki sferada, 1 ta Cl⁻ tashqi sferada, 2 ta H₂O tashqi sferada (AgNO₃ bilan faqat 1 ta Cl⁻ cho'kadi). Bu gidrat izomeriyaning klassik namunasi.",
    year: "1893-yil"
  },

  thermalFeature: {
    title: "[Cr(H₂O)₆]Cl₃ — barcha 6 ta H₂O ichki sferada",
    description: "Bu kompleks Cr³⁺ (d³, yuqori spin) va 6 ta H₂O (ichki sfera) + 3 ta Cl⁻ (tashqi sfera) dan iborat. Barcha 6 ta H₂O ichki sferada joylashgan — shuning uchun barcha H₂O yuqori haroratda ajraladi.",
    reaction: {
      step1: "[Cr(H₂O)₆]Cl₃ → [Cr(H₂O)₆]³⁺ + 3Cl⁻ (200-250°C, tashqi Cl⁻)",
      step2: "[Cr(H₂O)₆]³⁺ → Cr³⁺ + 6H₂O↑ (200-250°C)",
      step3: "Cr³⁺ + 3Cl⁻ → CrCl₃ (300-400°C)",
      step4: "CrCl₃ → Cr₂O₃ + Cl₂↑ (500-700°C, havoda)",
      residue: "CrCl₃ (inert atmosferada) yoki Cr₂O₃ (havoda)",
      totalLoss: "H₂O (21.7%) + Cl₂ (21.3%) = 43.0%",
      enthalpy: "ΔH ≈ +250 kJ/mol (endotermik, H₂O parchalanishi)"
    },
    problem: {
      title: "Barcha 6 ta H₂O ichki sferada — yuqori T da ajraladi",
      description: "Barcha 6 ta H₂O Cr³⁺ ga bog'langan (ichki sfera). Shuning uchun ular yuqori haroratda (200-250°C) ajraladi. Bu [Cu(H₂O)₆]²⁺ kabi labile komplekslardan farq qiladi.",
      impact: "TGA da 200-250°C da keskin massa yo'qotish kuzatiladi (21.7%)."
    },
    solution: {
      title: "Sekin qizdirish + inert atmosfera",
      description: "Sekin qizdirish (5°C/min) va inert atmosfera (N₂ yoki Ar) ishlatiladi. Bu bosqichlarni aniq ajratish imkonini beradi.",
      mechanism: "Sekin qizdirish har bir bosqichni aniq ko'rsatadi. Inert atmosfera Cr ning oksidlanishini oldini oladi."
    }
  },

  thermochromism: {
    title: "Termoxromizm — harorat bilan rang va holat o'zgarishi",
    description: "[Cr(H₂O)₆]Cl₃ termoxromik xususiyatlarga ega — harorat ko'tarilishi bilan rang va holat o'zgaradi.",
    colorChanges: [
      { temp: "25°C", color: "binafsha (violeo)", geometry: "Oktaedr (Cr³⁺ d³, yuqori spin)", explanation: "Binafsha rang — Cr³⁺ d³ yuqori spin, 6 ta H₂O ichki sferada" },
      { temp: "200-250°C", color: "yashil-jigar", geometry: "Cr³⁺ (H₂O ajralgan)", explanation: "6 ta H₂O ajraladi, Cr³⁺ qoladi" },
      { temp: "300-400°C", color: "jigar", geometry: "CrCl₃", explanation: "CrCl₃ hosil bo'ladi" },
      { temp: "500-700°C", color: "yashil (Cr₂O₃)", geometry: "Cr₂O₃ (havoda)", explanation: "Cr₂O₃ (yashil) hosil bo'ladi" }
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
    Cr:  { mass: 51.996,  percent: 19.51, source: "Cr³⁺ markaziy atom (oktaedr markazida)", thermalSignal: "CrCl₃ (yoki Cr₂O₃) qoldiqda qoladi" },
    H:   { mass: 12.096,  percent: 4.54,  source: "6×H₂O (12×H, ichki sfera)", thermalSignal: "H₂O gaz sifatida ajraladi (21.7%)" },
    O:   { mass: 95.994,  percent: 36.02, source: "6×H₂O (6×O, ichki sfera)", thermalSignal: "H₂O gaz sifatida ajraladi" },
    Cl:  { mass: 106.350, percent: 39.92, source: "3×Cl⁻ (tashqi sfera)", thermalSignal: "Cl⁻ past T da ajraladi (21.3%)" }
  },

  tgaData: [
    { temp: 25, mass: 100.0, event: "Boshlang'ich — [Cr(H₂O)₆]Cl₃ barqaror (binafsha)", theoryNote: "Oktaedr struktura, Cr³⁺ d³ yuqori spin, 6 ta ichki H₂O, 3 ta tashqi Cl⁻" },
    { temp: 50, mass: 100.0, event: "Boshlang'ich — barqaror", theoryNote: "Termik barqarorlik" },
    { temp: 100, mass: 100.0, event: "Boshlang'ich — barqaror", theoryNote: "Barcha H₂O ichki sferada, shuning uchun past T da ajralmaydi" },
    { temp: 150, mass: 100.0, event: "Barqaror — hali parchalanish boshlanmagan", theoryNote: "Barcha H₂O ichki sferada" },
    { temp: 200, mass: 78.3, event: "1-bosqich: 6 ta H₂O yo'qolishi (21.7%)", theoryNote: "Barcha 6 ta H₂O (ichki sfera) ajraladi, Cr³⁺ va 3 ta Cl⁻ qoladi" },
    { temp: 250, mass: 78.3, event: "Cr³⁺ + 3Cl⁻ barqaror", theoryNote: "Cr³⁺ va 3 ta Cl⁻ qoladi" },
    { temp: 300, mass: 78.3, event: "CrCl₃ hosil bo'ladi", theoryNote: "CrCl₃ hosil bo'ladi" },
    { temp: 400, mass: 78.3, event: "CrCl₃ barqaror", theoryNote: "CrCl₃ barqaror" },
    { temp: 500, mass: 67.0, event: "Cl₂ yo'qolishi boshlanadi (11.3%)", theoryNote: "CrCl₃ parchalanadi, Cl₂ ajraladi" },
    { temp: 600, mass: 57.0, event: "Cl₂ yo'qolishi davom etadi (21.3%)", theoryNote: "Cl₂ ajraladi, CrCl₃ yoki Cr₂O₃ qoldiq qoladi" },
    { temp: 700, mass: 57.0, event: "CrCl₃ (yoki Cr₂O₃) barqaror", theoryNote: "CrCl₃ yoki Cr₂O₃ barqaror" },
    { temp: 800, mass: 57.0, event: "CrCl₃ (yoki Cr₂O₃) barqaror", theoryNote: "CrCl₃ yoki Cr₂O₃ barqaror" }
  ],

  dtaData: [
    { temp: 25, signal: 0, event: "Boshlang'ich", theoryNote: "Termik muvozanat" },
    { temp: 100, signal: 0, event: "Boshlang'ich", theoryNote: "Termik muvozanat, barcha H₂O ichki sferada" },
    { temp: 150, signal: 0, event: "Barqaror", theoryNote: "Barqaror" },
    { temp: 200, signal: -30, event: "Endotermik (6 ta H₂O)", theoryNote: "Barcha 6 ta H₂O ajraladi (ΔH ≈ +250 kJ/mol)" },
    { temp: 225, signal: -35, event: "Pik (200-250°C)", theoryNote: "Maksimal parchalanish tezligi" },
    { temp: 250, signal: -25, event: "Endotermik tugashi", theoryNote: "H₂O to'liq ajraldi" },
    { temp: 300, signal: 0, event: "CrCl₃ barqaror", theoryNote: "CrCl₃ barqaror" },
    { temp: 400, signal: 0, event: "CrCl₃ barqaror", theoryNote: "CrCl₃ barqaror" },
    { temp: 500, signal: -20, event: "Endotermik (Cl₂)", theoryNote: "CrCl₃ parchalanadi, Cl₂ ajraladi" },
    { temp: 600, signal: -25, event: "Endotermik (Cl₂ davom etadi)", theoryNote: "Cl₂ ajraladi" },
    { temp: 700, signal: 15, event: "Ekzotermik (Cr₂O₃)", theoryNote: "Cr₂O₃ hosil bo'lishi (havoda, ekzotermik)" },
    { temp: 800, signal: 0, event: "Cr₂O₃ barqaror", theoryNote: "Cr₂O₃ barqaror" }
  ],

  decompositionSteps: [
    {
      temp: "200-250°C",
      event: "1-bosqich: 6 ta H₂O yo'qolishi",
      massLoss: "21.7%",
      product: "Cr³⁺ + 3Cl⁻",
      type: "Endotermik",
      explanation: "Barcha 6 ta H₂O (ichki sfera) ajraladi. Bu H₂O ligandlari Cr³⁺ ga bog'langan, shuning uchun yuqori harorat talab qilinadi. Bu gidrat izomeriyaning termik isboti.",
      enthalpy: "ΔH ≈ +250 kJ/mol",
      colorChange: "binafsha → yashil-jigar",
      gasReleased: "H₂O (suv bug'i)"
    },
    {
      temp: "300-400°C",
      event: "2-bosqich: CrCl₃ hosil bo'lishi",
      massLoss: "0% (faza o'zgarishi)",
      product: "CrCl₃",
      type: "Ekzotermik",
      explanation: "Cr³⁺ va 3 ta Cl⁻ birikib CrCl₃ hosil qiladi.",
      enthalpy: "ΔH ≈ -50 kJ/mol",
      colorChange: "yashil-jigar → jigar",
      gasReleased: "Yo'q"
    },
    {
      temp: "500-700°C",
      event: "3-bosqich: Cl₂ yo'qolishi (havoda)",
      massLoss: "21.3%",
      product: "Cr₂O₃ (yashil)",
      type: "Endotermik (keyin ekzotermik)",
      explanation: "CrCl₃ parchalanadi, Cl₂ ajraladi. Cr₂O₃ (yashil) qoldiq qoladi (havoda).",
      enthalpy: "ΔH ≈ +150 kJ/mol (parchalanish), ΔH ≈ -100 kJ/mol (Cr₂O₃)",
      colorChange: "jigar → yashil (Cr₂O₃)",
      gasReleased: "Cl₂ (xlor gazi)"
    }
  ],

  experimentalRuns: [
    { 
      id: "TGA-24-001", 
      date: "2026-04-15", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "21.6%", 
      massLoss2: "0%", 
      massLoss3: "21.2%", 
      residue: "CrCl₃ (57.0%)", 
      note: "Toza [Cr(H₂O)₆]Cl₃ — inert atmosfera",
      theoryNote: "H₂O 200-250°C da ajraladi (21.7%), CrCl₃ 300-400°C da hosil bo'ladi. Inert atmosferada CrCl₃ qoldiq qoladi."
    },
    { 
      id: "TGA-24-002", 
      date: "2026-04-15", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "21.7%", 
      massLoss2: "0%", 
      massLoss3: "21.3%", 
      residue: "CrCl₃ (57.0%)", 
      note: "Ikkinchi o'lchash — takrorlanish",
      theoryNote: "Takrorlanish — natijalar bir xil."
    },
    { 
      id: "TGA-24-003", 
      date: "2026-04-16", 
      heatingRate: "10°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "21.5%", 
      massLoss2: "0%", 
      massLoss3: "21.4%", 
      residue: "CrCl₃ (57.0%)", 
      note: "Tezroq qizdirish — bosqichlar biroz siljiydi",
      theoryNote: "Tezroq qizdirishda bosqichlar biroz yuqori haroratga siljiydi."
    },
    { 
      id: "TGA-24-004", 
      date: "2026-04-16", 
      heatingRate: "5°C/min", 
      atmosphere: "Havo", 
      massLoss1: "21.7%", 
      massLoss2: "0%", 
      massLoss3: "21.3%", 
      residue: "Cr₂O₃ (38.5%)", 
      note: "Havoda qizdirilgan — Cr₂O₃ qoldiq (yashil)",
      theoryNote: "Havoda qizdirilganda CrCl₃ → Cr₂O₃ + Cl₂. Cr₂O₃ (yashil) qoldiq hosil bo'ladi."
    },
    { 
      id: "TGA-24-005", 
      date: "2026-04-17", 
      heatingRate: "2°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "21.7%", 
      massLoss2: "0%", 
      massLoss3: "21.3%", 
      residue: "CrCl₃ (57.0%)", 
      note: "Juda sekin qizdirish — eng aniq bosqichlar",
      theoryNote: "Juda sekin qizdirishda har bir bosqich aniq ko'rinadi."
    },
    { 
      id: "DTA-24-001", 
      date: "2026-04-15", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "Endotermik (H₂O)", 
      massLoss2: "Ekzotermik (CrCl₃)", 
      massLoss3: "Endotermik (Cl₂)", 
      residue: "DTA: 2 endotermik + 1 ekzotermik pik", 
      note: "DTA tahlili — H₂O (200-250°C), CrCl₃ (300-400°C), Cl₂ (500-700°C)",
      theoryNote: "DTA da 1 ta endotermik pik (H₂O), 1 ta ekzotermik pik (CrCl₃), 1 ta endotermik pik (Cl₂)."
    }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Cr(H₂O)₆]Cl₃ zaharli emas, lekin Cr³⁺ zaharli. Qo'lqop, himoya ko'zoynaklari va laboratoriya xalati majburiy. Ventilyatsiya zarur!", time: "doimiy", critical: true },
    { step: 2, title: "Namuna tayyorlash", desc: "10-20 mg [Cr(H₂O)₆]Cl₃ Al₂O₃ yoki Pt tigelga solinadi. Namuna mayda kukun bo'lishi kerak. Binafsha rang — Cr³⁺ belgisi.", time: "5 daq", critical: true },
    { step: 3, title: "TGA qurilmasini tayyorlash", desc: "TGA qurilmasi N₂ yoki Ar atmosferasida tayyorlanadi. Gaz oqimi 50 mL/min.", time: "10 daq", critical: true },
    { step: 4, title: "Qizdirish dasturini o'rnatish", desc: "25°C dan 800°C gacha, 5°C/min tezlikda. Inert atmosfera saqlanadi.", time: "2 daq", critical: true },
    { step: 5, title: "TGA o'lchash", desc: "Qizdirish boshlanadi. Massa o'zgarishi va harorat yoziladi. 200-250°C da H₂O, 300-400°C da CrCl₃ hosil bo'ladi.", time: "2-3 soat", critical: false },
    { step: 6, title: "Natijalarni tahlil qilish", desc: "Har bir bosqichda massa yo'qotish foizi hisoblanadi. H₂O (21.7%) va Cl₂ (21.3%) ajralishi aniqlanadi.", time: "10 daq", critical: false }
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
      role: "H₂O va Cl⁻ ligandlarini aniqlaydi",
      tgaAdvantage: "IQ ligandlarni, TGA parchalanishni ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "90%"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      role: "Gidrat izomerlarni aniqlaydi",
      tgaAdvantage: "XRD gidrat izomerlarni, TGA termik xatti-harakatni ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "92%"
    }
  ],

  decompositionTable: [
    {
      complex: "[Cr(H₂O)₆]Cl₃",
      step1_temp: "200-250°C",
      step1_product: "6 ta H₂O",
      step2_temp: "500-700°C",
      step2_product: "CrCl₃ (yoki Cr₂O₃)",
      notes: "Barcha 6 ta H₂O ichki sferada — yuqori T da ajraladi"
    },
    {
      complex: "[CrCl(H₂O)₅]Cl₂·H₂O",
      step1_temp: "100-150°C",
      step1_product: "1 ta tashqi H₂O",
      step2_temp: "200-250°C",
      step2_product: "5 ta ichki H₂O",
      notes: "Gidrat izomer — 1 tashqi + 5 ichki H₂O"
    },
    {
      complex: "[CrCl₂(H₂O)₄]Cl·2H₂O",
      step1_temp: "100-150°C",
      step1_product: "2 ta tashqi H₂O",
      step2_temp: "200-250°C",
      step2_product: "4 ta ichki H₂O",
      notes: "Gidrat izomer — 2 tashqi + 4 ichki H₂O"
    },
    {
      complex: "[Co(NH₃)₅Cl]Cl₂",
      step1_temp: "200-250°C",
      step1_product: "2 ta tashqi Cl⁻",
      step2_temp: "250-350°C",
      step2_product: "NH₃ + ichki Cl⁻",
      notes: "Ichki/tashqi sfera farqi — Verner nazariyasi"
    }
  ]
}

function calculateMassLoss(massLossPercent, molarMass) {
  const massLost = massLossPercent
  const molesLost = (massLossPercent / 100) * molarMass / 266.45
  return {
    massLost: massLost.toFixed(2),
    molesLost: molesLost.toFixed(3),
    molecules: molesLost.toFixed(3)
  }
}

export default function CrH2O6Cl3ThermalPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeRun, setActiveRun] = useState("TGA-24-001")
  const [tgaTemp, setTgaTemp] = useState(25)
  const [showWarningModal, setShowWarningModal] = useState(true)
  
  const [calcMass, setCalcMass] = useState(100)
  const [calcMassLoss, setCalcMassLoss] = useState(21.7)
  const [calcMolarMass, setCalcMolarMass] = useState(266.45)

  const calcResult = useMemo(() => {
    const massLost = calcMass * (calcMassLoss / 100)
    const molesLost = (massLost / 266.45) * (calcMass / 100)
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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-violet-950/20 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-violet-950 to-purple-950 border-2 border-violet-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-violet-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> GIDRAT IZOMERIYA — BARCHA 6 TA H₂O ICHKI SFERADA!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-violet-300">[Cr(H₂O)₆]Cl₃</strong> — binafsha (violeo) tuzi, gidrat izomeriyaning klassik namunasi. Barcha 6 ta H₂O ichki sferada!
            </p>
            
            <div className="bg-violet-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-violet-400 font-bold mb-2">⚠ Ichki sfera:</div>
                  <div className="text-purple-200">
                    <strong>6 ta H₂O</strong> — Cr³⁺ ga bog'langan, yuqori T da ajraladi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Binafsha rang</strong> — violeo tuzi.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">✅ Tashqi sfera:</div>
                  <div className="text-purple-200">
                    <strong>3 ta Cl⁻</strong> — ion, past T da ajraladi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>AgNO₃</strong> qo'shilganda barcha 3 ta Cl⁻ cho'kadi.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-violet-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-violet-300">Gidrat izomeriya (1893):</strong> CrCl₃·6H₂O ning uchta izomeri: (1) binafsha — barcha 6 ta H₂O ichki; (2) och yashil — 1 ta ichki Cl⁻, 1 ta tashqi H₂O; (3) to'q yashil — 2 ta ichki Cl⁻, 2 ta tashqi H₂O.
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-violet-400 font-semibold">[Cr(H₂O)₆]Cl₃</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-violet-400 flex items-center gap-2">
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
                  <span className="px-2 py-1 rounded bg-violet-900/30 border border-violet-700/50 text-violet-400 text-[10px] uppercase tracking-wide">Cr³⁺ d³</span>
                  <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Gidrat izomer</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Binafsha</span>
                  <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Werner 1893</span>
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
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-violet-600 hover:bg-violet-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Birikma haqida (termik tahlil uchun)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Cr(H₂O)₆]Cl₃</strong> — binafsha (violeo) tuzi, gidrat izomeriyaning klassik namunasi. Termik tahlilda <strong className="text-violet-300">barcha 6 ta H₂O yuqori T da ajraladi</strong>.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-violet-500 text-xs md:text-sm">
                <li><strong className="text-white">Cr³⁺ (d³, yuqori spin)</strong> — oktaedr geometriya</li>
                <li><strong className="text-white">6 ta H₂O</strong> ichki sferada</li>
                <li><strong className="text-violet-300">3 ta Cl⁻</strong> tashqi sferada (ion)</li>
                <li><strong className="text-violet-300">Barcha H₂O</strong> — yuqori T da ajraladi (200-250°C)</li>
                <li><strong className="text-violet-300">CrCl₃</strong> qoldiq qoladi (57.0%)</li>
                <li><strong className="text-violet-300">Cr₂O₃</strong> (havoda, yashil)</li>
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

        {/* 2. ICHKI SFERA VA BOSQICHLI PARCHALANISH */}
        <div className="bg-gradient-to-r from-violet-900/40 to-red-900/40 border-2 border-violet-700/70 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔥</span> {COMPOUND.thermalFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.thermalFeature.description}
          </p>

          <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
            <div className="text-center text-lg font-mono text-violet-400 mb-2">
              Parchalanish reaksiyalari (bosqichma-bosqich):
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">1-bosqich (200-250°C):</span> {COMPOUND.thermalFeature.reaction.step1}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">2-bosqich (200-250°C):</span> {COMPOUND.thermalFeature.reaction.step2}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">3-bosqich (300-400°C):</span> {COMPOUND.thermalFeature.reaction.step3}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">4-bosqich (500-700°C, havoda):</span> {COMPOUND.thermalFeature.reaction.step4}
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
            [Cr(H₂O)₆]Cl₃ uchun nazariy tarkib. Cr³⁺ markaziy atom, 6 ta H₂O ichki sferada, 3 ta Cl⁻ tashqi sferada.
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
                  const elColor = el === "Cr" ? "text-violet-400" : "text-purple-400"
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
                <tr className="bg-violet-900/20 font-bold border-t border-violet-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-violet-300">TGA: H₂O (21.7%) + Cl₂ (21.3%) + CrCl₃ (57.0%)</td>
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
            [Cr(H₂O)₆]Cl₃ uchun standart termik tahlil sharoitlari. Barcha H₂O ichki sferada — sekin qizdirish kerak.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Qizdirish tezligi</div>
              <div className="text-sm font-bold text-violet-400">{COMPOUND.thermalParameters.heatingRate}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Atmosfera</div>
              <div className="text-sm font-bold text-violet-400">{COMPOUND.thermalParameters.atmosphere}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Namuna massasi</div>
              <div className="text-sm font-bold text-violet-400">{COMPOUND.thermalParameters.sampleMass}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Harorat diapazoni</div>
              <div className="text-sm font-bold text-violet-400">{COMPOUND.thermalParameters.tempRange}</div>
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
            <label className="block text-violet-400 font-bold mb-2">
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
                <div className="text-xl font-mono font-bold text-violet-400">{currentTGA.temp}°C</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Massa:</div>
                <div className="text-xl font-mono font-bold text-violet-400">{currentTGA.mass.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-violet-400">{currentTGA.event}</div>
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
                stroke="#8b5cf6" 
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
          <h2 className="text-xl font-bold text-white mb-6">🌡️ DTA egri chizig'i — H₂O va Cl₂ parchalanish piklari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>DTA (Differensial Termik Analiz)</strong> — namuna va referens o'rtasidagi harorat farqini o'lchaydi.
            <strong className="text-violet-400"> Endotermik</strong> piklar H₂O va Cl₂ ajralishini ko'rsatadi.
          </p>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> DTA piklarining nazariy izohi:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">200-250°C — H₂O</div>
                <div className="text-purple-200">Barcha 6 ta H₂O ajraladi (ΔH ≈ +250 kJ/mol).</div>
              </div>
              <div className="bg-green-900/20 rounded-lg p-3">
                <div className="text-green-400 font-bold mb-1">300-400°C — CrCl₃</div>
                <div className="text-purple-200">CrCl₃ hosil bo'lishi (ekzotermik).</div>
              </div>
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">500-700°C — Cl₂</div>
                <div className="text-purple-200">CrCl₃ parchalanadi, Cl₂ ajraladi (havoda).</div>
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
                stroke="#8b5cf6" 
                strokeWidth="2"
                points={COMPOUND.dtaData.map(p => {
                  const x = 50 + (p.temp/800)*530
                  const y = 130 - (p.signal/30)*100
                  return `${x},${y}`
                }).join(" ")}
              />

              <text x="170" y="155" fontSize="8" fill="#ef4444">H₂O (200°C)</text>
              <text x="270" y="100" fontSize="8" fill="#22c55e">CrCl₃ (350°C)</text>
              <text x="420" y="155" fontSize="8" fill="#ef4444">Cl₂ (600°C)</text>
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
                    ? "bg-violet-900/40 border-2 border-violet-400" 
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-violet-500/50"
                }`}
              >
                <div className="text-violet-400 font-bold mb-2">{step.temp}</div>
                <div className="text-purple-200 text-sm font-bold mb-1">{step.event}</div>
                <div className="text-violet-400 text-sm font-mono">−{step.massLoss}</div>
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
                      ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20"
                      : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-violet-500"
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
                <div className="text-xs text-purple-400">H₂O:</div>
                <div className="text-xl font-mono font-bold text-violet-400">{run.massLoss1}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Cl₂:</div>
                <div className="text-xl font-mono font-bold text-violet-400">{run.massLoss3}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Qoldiq:</div>
                <div className="text-xl font-mono font-bold text-violet-400">{run.residue}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 9. TGA KALKULYATOR */}
        <div className="bg-violet-900/20 border border-violet-500/30 rounded-2xl p-8">
          <h3 className="text-violet-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> TGA kalkulyatori — massa yo'qotishdan molekula soni
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Massa yo'qotish foizidan <strong className="text-violet-300">qancha [Cr(H₂O)₆]Cl₃ molekulasi</strong> ajralganini hisoblang.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Boshlang'ich massa (mg):</label>
              <input
                type="number"
                value={calcMass}
                onChange={(e) => setCalcMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Massa yo'qotish (%):</label>
              <input
                type="number"
                step="0.1"
                value={calcMassLoss}
                onChange={(e) => setCalcMassLoss(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Molyar massa (g/mol):</label>
              <input
                type="number"
                step="0.01"
                value={calcMolarMass}
                onChange={(e) => setCalcMolarMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Yo'qotilgan massa:</div>
                <div className="text-xl font-mono font-bold text-violet-400">{calcResult.massLost} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Mol:</div>
                <div className="text-xl font-mono font-bold text-violet-400">{calcResult.molesLost}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Molekula (mol):</div>
                <div className="text-xl font-mono font-bold text-violet-400">{calcResult.molecules}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: n = (massa × %yo'qotish / 100) / M_molar
            </p>
          </div>
        </div>

        {/* 10. GIDRAT IZOMERLAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Gidrat izomerlar — CrCl₃·6H₂O</h2>
          
          <p className="text-purple-200 mb-4 text-sm">
            CrCl₃·6H₂O ning uchta gidrat izomeri mavjud. Har birida H₂O va Cl⁻ ning joylashuvi har xil.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-violet-300">Kompleks</th>
                  <th className="py-3 px-4 text-violet-300">1-bosqich (T, °C)</th>
                  <th className="py-3 px-4 text-violet-300">Ajralgan</th>
                  <th className="py-3 px-4 text-violet-300">2-bosqich (T, °C)</th>
                  <th className="py-3 px-4 text-violet-300">Qoldiq</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.decompositionTable.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-violet-400 text-sm">{r.complex}</td>
                    <td className="py-3 px-4 text-violet-400">{r.step1_temp}</td>
                    <td className="py-3 px-4">{r.step1_product}</td>
                    <td className="py-3 px-4 text-violet-400">{r.step2_temp}</td>
                    <td className="py-3 px-4">{r.step2_product}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 11. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Termik tahlilga yaqin tahlil usullari
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-violet-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-violet-300">{m.name}</h3>
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

          <div className="mt-5 bg-violet-900/20 border border-violet-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-violet-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">TGA (massa) + DTA (H₂O/Cl₂) + IQ (H₂O) + XRD (gidrat izomerlar) + DSC (ΔH)</strong> — beshta metod birgalikda [Cr(H₂O)₆]Cl₃ ni to'liq tavsiflaydi va gidrat izomerlarni tasdiqlaydi.
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
              <p className="text-xs text-purple-200">Barcha 6 ta H₂O ichki sferada — yuqori T da ajraladi. Gidrat izomerlarni aniqlaydi.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Sekin qizdirish kerak. Cr³⁺ inert. H₂O va Cl₂ gazi ajraladi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">DTA (H₂O/Cl₂), IQ (H₂O), XRD (gidrat izomerlar), DSC (ΔH) — to'liq tahlil uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/termik" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Termik tahlil
            </Link>
            <Link href="/ilmiy/tahlil/termik/birikmalar" className="text-sm bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha birikmalar →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Cr(H₂O)₆]Cl₃ • Termik tahlil moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis), Werner (1893)</p>
        </div>
      </footer>
    </main>
  )
}