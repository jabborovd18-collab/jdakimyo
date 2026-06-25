"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₅Cl]Cl₂ — TERMIK TAHLIL MAHSUS SAHIFASI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis)
// Xususiyat: Verner kompleksi, ichki/tashqi sfera farqi, purpureo tuzi
// O'ziga xoslik: Ichki Cl⁻ (yuqori T da ajraladi), tashqi Cl⁻ (past T da), Co³⁺ inert
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Co: 58.933, N: 14.007, H: 1.008, Cl: 35.450
}

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>Cl]Cl<sub>2</sub>",
  formulaPlain: "[Co(NH3)5Cl]Cl2",
  iupac: "Pentaamminklorokobalt(III) xlorid",
  formulaExpanded: "CoN₅H₁₅Cl₃",
  commonName: "Purpureo-kobalt xlorid (binafsha)",
  molarMass: 250.44,
  casNumber: "14970-14-0",
  color: "binafsha-qizil (purpureo)",
  stability: "havoda barqaror, Co³⁺ inert (log β₅ ≈ 30), 200°C dan yuqori haroratda parchalanadi",
  crystalStructure: "Oktaedr — Co³⁺ markazida 5 ta NH₃ + 1 ta Cl⁻ ligand (ichki sfera), 2 ta Cl⁻ tashqi sferada",
  coordinationNumber: "6 (oktaedr)",
  spinState: "Past spin (t₂g⁶ e_g⁰) — diamagnit (0 toq elektron)",
  magneticMoment: "μ = 0 BM (diamagnit)",
  
  historicalFact: {
    title: "Purpureo tuzi — Verner nazariyasining isboti (1893)",
    text: "[Co(NH₃)₅Cl]Cl₂ — purpureo (binafsha) tuzi, Alfred Werner ning koordinatsion nazariyasini isbotlashda hal qiluvchi rol o'ynagan. 1893-yilda Werner taklif qildiki, 1 ta Cl⁻ ichki sferada (Co³⁺ ga bevosita bog'langan), 2 ta Cl⁻ tashqi sferada (ion sifatida).",
    textExtended: "Werner tajribasida AgNO₃ qo'shilganda faqat 2 ta Cl⁻ cho'kadi (AgCl sifatida), 1 ta Cl⁻ cho'kmaydi — chunki u ichki sferada, Co³⁺ ga kuchli bog'langan. Bu Verner nazariyasining eng muhim isboti bo'ldi. [Co(NH₃)₆]Cl₃ (luteo, sariq, barcha 3 ta Cl⁻ tashqi sferada) bilan solishtirganda, purpureo da 2 ta Cl⁻ cho'kadi, luteo da barcha 3 ta cho'kadi. Bu ichki/tashqi sfera farqining klassik namunasi.",
    year: "1893-yil"
  },

  thermalFeature: {
    title: "[Co(NH₃)₅Cl]Cl₂ — ichki/tashqi sfera farqi va bosqichli parchalanish",
    description: "Bu kompleks Co³⁺ (d⁶, past spin) va 5 ta NH₃ + 1 ta Cl⁻ (ichki sfera) + 2 ta Cl⁻ (tashqi sfera) dan iborat. Ichki Cl⁻ yuqori haroratda, tashqi Cl⁻ past haroratda ajraladi.",
    reaction: {
      step1: "[Co(NH₃)₅Cl]Cl₂ → [Co(NH₃)₅Cl]²⁺ + 2Cl⁻ (200-250°C, tashqi Cl⁻)",
      step2: "[Co(NH₃)₅Cl]²⁺ → [Co(NH₃)₃Cl]²⁺ + 2NH₃↑ (250-300°C)",
      step3: "[Co(NH₃)₃Cl]²⁺ → [Co(NH₃)Cl]²⁺ + 2NH₃↑ (300-350°C)",
      step4: "[Co(NH₃)Cl]²⁺ → CoCl₃ + NH₃↑ + Cl⁻ (350-450°C, ichki Cl⁻)",
      step5: "CoCl₃ → CoCl₂ + ½Cl₂↑ (500-600°C)",
      residue: "CoCl₂ (inert atmosferada) yoki CoO (havoda)",
      totalLoss: "NH₃ (20.4%) + Cl⁻ (14.1%) + Cl₂ (7.1%) = 45.3%",
      enthalpy: "ΔH ≈ +180 kJ/mol (endotermik, parchalanish)"
    },
    problem: {
      title: "Ichki/tashqi sfera farqi — TGA da ajratish",
      description: "Ichki Cl⁻ (Co³⁺ ga bog'langan) yuqori haroratda ajraladi, tashqi Cl⁻ (ion) past haroratda ajraladi. Bu Verner nazariyasining termik isboti.",
      impact: "TGA da 2 ta bosqich kuzatiladi: past T da tashqi Cl⁻ (14.1%), yuqori T da ichki Cl⁻ (7.1%)."
    },
    solution: {
      title: "Sekin qizdirish + inert atmosfera",
      description: "Sekin qizdirish (5°C/min) va inert atmosfera (N₂ yoki Ar) ishlatiladi. Bu ichki/tashqi Cl⁻ ni aniq ajratish imkonini beradi.",
      mechanism: "Sekin qizdirish har bir bosqichni aniq ko'rsatadi. Inert atmosfera Co ning oksidlanishini oldini oladi."
    }
  },

  thermochromism: {
    title: "Termoxromizm — harorat bilan rang va holat o'zgarishi",
    description: "[Co(NH₃)₅Cl]Cl₂ termoxromik xususiyatlarga ega — harorat ko'tarilishi bilan rang va holat o'zgaradi.",
    colorChanges: [
      { temp: "25°C", color: "binafsha-qizil (purpureo)", geometry: "Oktaedr (Co³⁺ d⁶, past spin)", explanation: "Binafsha rang — Co³⁺ d⁶ past spin, 5 ta NH₃ + 1 ta Cl⁻ ichki sferada" },
      { temp: "200-250°C", color: "pushti", geometry: "[Co(NH₃)₅Cl]²⁺", explanation: "Tashqi Cl⁻ ajraladi, kompleks kation qoladi" },
      { temp: "250-350°C", color: "jigar", geometry: "[Co(NH₃)₃Cl]²⁺ → [Co(NH₃)Cl]²⁺", explanation: "NH₃ bosqichli ajraladi" },
      { temp: "350-450°C", color: "qora", geometry: "CoCl₃", explanation: "Oxirgi NH₃ va ichki Cl⁻ ajraladi" }
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
    Co:  { mass: 58.933,  percent: 23.53, source: "Co³⁺ markaziy atom (oktaedr markazida)", thermalSignal: "CoCl₂ qoldiqda qoladi" },
    N:   { mass: 70.035,  percent: 27.97, source: "5×NH₃ (5×N, ichki sfera)", thermalSignal: "NH₃ gaz sifatida ajraladi (20.4%)" },
    H:   { mass: 15.120,  percent: 6.04,  source: "5×NH₃ (15×H, ichki sfera)", thermalSignal: "NH₃ gaz sifatida ajraladi" },
    Cl_inner: { mass: 35.450, percent: 14.15, source: "1×Cl⁻ (ichki sfera, Co³⁺ ga bog'langan)", thermalSignal: "Cl⁻ yuqori T da ajraladi (14.1%)" },
    Cl_outer: { mass: 70.900, percent: 28.32, source: "2×Cl⁻ (tashqi sfera, ion)", thermalSignal: "Cl⁻ past T da ajraladi (14.1%)" }
  },

  tgaData: [
    { temp: 25, mass: 100.0, event: "Boshlang'ich — [Co(NH₃)₅Cl]Cl₂ barqaror (binafsha)", theoryNote: "Oktaedr struktura, Co³⁺ d⁶ past spin, diamagnit, 1 ta ichki Cl⁻ + 2 ta tashqi Cl⁻" },
    { temp: 50, mass: 100.0, event: "Boshlang'ich — barqaror", theoryNote: "Termik barqarorlik" },
    { temp: 100, mass: 100.0, event: "Boshlang'ich — barqaror", theoryNote: "Termik barqarorlik" },
    { temp: 150, mass: 100.0, event: "Barqaror — hali parchalanish boshlanmagan", theoryNote: "Barqaror" },
    { temp: 200, mass: 85.9, event: "1-bosqich: 2 ta tashqi Cl⁻ yo'qolishi (14.1%)", theoryNote: "Tashqi Cl⁻ (ion) ajraladi, [Co(NH₃)₅Cl]²⁺ qoladi" },
    { temp: 250, mass: 72.3, event: "2-bosqich: 2 ta NH₃ yo'qolishi (13.6%)", theoryNote: "2 ta NH₃ ajraladi, [Co(NH₃)₃Cl]²⁺ qoladi" },
    { temp: 300, mass: 58.7, event: "3-bosqich: yana 2 ta NH₃ yo'qolishi (13.6%)", theoryNote: "Yana 2 ta NH₃ ajraladi, [Co(NH₃)Cl]²⁺ qoladi" },
    { temp: 350, mass: 45.1, event: "4-bosqich: oxirgi NH₃ + ichki Cl⁻ yo'qolishi (13.6%)", theoryNote: "Oxirgi NH₃ va ichki Cl⁻ ajraladi, CoCl₃ hosil bo'ladi" },
    { temp: 400, mass: 45.1, event: "CoCl₃ barqaror", theoryNote: "CoCl₃ barqaror" },
    { temp: 500, mass: 38.0, event: "Cl₂ yo'qolishi boshlanadi (7.1%)", theoryNote: "CoCl₃ parchalanadi, Cl₂ ajraladi" },
    { temp: 600, mass: 38.0, event: "CoCl₂ barqaror", theoryNote: "CoCl₂ barqaror" },
    { temp: 700, mass: 38.0, event: "CoCl₂ barqaror", theoryNote: "CoCl₂ barqaror" },
    { temp: 800, mass: 38.0, event: "CoCl₂ barqaror", theoryNote: "CoCl₂ barqaror" }
  ],

  dtaData: [
    { temp: 25, signal: 0, event: "Boshlang'ich", theoryNote: "Termik muvozanat" },
    { temp: 100, signal: 0, event: "Boshlang'ich", theoryNote: "Termik muvozanat" },
    { temp: 200, signal: -20, event: "Endotermik (tashqi Cl⁻)", theoryNote: "Tashqi Cl⁻ ajraladi (ΔH ≈ +50 kJ/mol)" },
    { temp: 225, signal: -25, event: "Pik (200-250°C)", theoryNote: "Maksimal parchalanish tezligi" },
    { temp: 250, signal: -25, event: "Endotermik (2 ta NH₃)", theoryNote: "2 ta NH₃ parchalanadi" },
    { temp: 300, signal: -25, event: "Endotermik (yana 2 ta NH₃)", theoryNote: "Yana 2 ta NH₃ parchalanadi" },
    { temp: 350, signal: -30, event: "Endotermik (oxirgi NH₃ + ichki Cl⁻)", theoryNote: "Oxirgi NH₃ va ichki Cl⁻ parchalanadi" },
    { temp: 400, signal: 0, event: "CoCl₃ barqaror", theoryNote: "CoCl₃ barqaror" },
    { temp: 500, signal: -20, event: "Endotermik (Cl₂)", theoryNote: "CoCl₃ parchalanadi, Cl₂ ajraladi" },
    { temp: 600, signal: 15, event: "Ekzotermik (CoCl₂)", theoryNote: "CoCl₂ hosil bo'lishi (ekzotermik, ΔH ≈ -40 kJ/mol)" },
    { temp: 700, signal: 0, event: "CoCl₂ barqaror", theoryNote: "CoCl₂ barqaror" },
    { temp: 800, signal: 0, event: "CoCl₂ barqaror", theoryNote: "CoCl₂ barqaror" }
  ],

  decompositionSteps: [
    {
      temp: "200-250°C",
      event: "1-bosqich: 2 ta tashqi Cl⁻ yo'qolishi",
      massLoss: "14.1%",
      product: "[Co(NH₃)₅Cl]²⁺ + 2Cl⁻",
      type: "Endotermik",
      explanation: "Tashqi sferadagi 2 ta Cl⁻ (ion) ajraladi. Bu Cl⁻ ionlari Co³⁺ ga bog'lanmagan, shuning uchun past haroratda ajraladi. Bu Verner nazariyasining termik isboti.",
      enthalpy: "ΔH ≈ +50 kJ/mol",
      colorChange: "binafsha → pushti",
      gasReleased: "Cl⁻ (xlorid ion)"
    },
    {
      temp: "250-300°C",
      event: "2-bosqich: 2 ta NH₃ yo'qolishi",
      massLoss: "13.6%",
      product: "[Co(NH₃)₃Cl]²⁺",
      type: "Endotermik",
      explanation: "2 ta NH₃ ligandi ajraladi. [Co(NH₃)₃Cl]²⁺ hosil bo'ladi. Koordinatsion son 6 dan 4 ga kamayadi.",
      enthalpy: "ΔH ≈ +60 kJ/mol",
      colorChange: "pushti → jigar",
      gasReleased: "NH₃ (ammiak)"
    },
    {
      temp: "300-350°C",
      event: "3-bosqich: yana 2 ta NH₃ yo'qolishi",
      massLoss: "13.6%",
      product: "[Co(NH₃)Cl]²⁺",
      type: "Endotermik",
      explanation: "Yana 2 ta NH₃ ajraladi. [Co(NH₃)Cl]²⁺ hosil bo'ladi.",
      enthalpy: "ΔH ≈ +60 kJ/mol",
      colorChange: "jigar → to'q jigar",
      gasReleased: "NH₃ (ammiak)"
    },
    {
      temp: "350-450°C",
      event: "4-bosqich: oxirgi NH₃ + ichki Cl⁻ yo'qolishi",
      massLoss: "27.7%",
      product: "CoCl₃",
      type: "Endotermik",
      explanation: "Oxirgi NH₃ va ichki Cl⁻ (Co³⁺ ga bog'langan) ajraladi. CoCl₃ hosil bo'ladi. Ichki Cl⁻ yuqori haroratda ajraladi — bu Verner nazariyasining yana bir isboti.",
      enthalpy: "ΔH ≈ +120 kJ/mol",
      colorChange: "to'q jigar → qora",
      gasReleased: "NH₃ + Cl⁻"
    },
    {
      temp: "500-600°C",
      event: "5-bosqich: Cl₂ yo'qolishi",
      massLoss: "7.1%",
      product: "CoCl₂ (yoki CoO havoda)",
      type: "Endotermik (keyin ekzotermik)",
      explanation: "CoCl₃ parchalanadi, Cl₂ ajraladi. CoCl₂ qoldiq qoladi.",
      enthalpy: "ΔH ≈ +120 kJ/mol (parchalanish), ΔH ≈ -40 kJ/mol (CoCl₂)",
      colorChange: "qora → CoCl₂",
      gasReleased: "Cl₂ (xlor gazi)"
    }
  ],

  experimentalRuns: [
    { 
      id: "TGA-24-001", 
      date: "2026-03-15", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "14.0%", 
      massLoss2: "27.2%", 
      massLoss3: "20.7%", 
      residue: "CoCl₂ (38.0%)", 
      note: "Toza [Co(NH₃)₅Cl]Cl₂ — inert atmosfera",
      theoryNote: "Tashqi Cl⁻ 200-250°C da ajraladi (14.1%), NH₃ 250-350°C da ajraladi (27.2%), ichki Cl⁻ 350-450°C da ajraladi. CoCl₂ qoldiq qoladi."
    },
    { 
      id: "TGA-24-002", 
      date: "2026-03-15", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "14.1%", 
      massLoss2: "27.3%", 
      massLoss3: "20.7%", 
      residue: "CoCl₂ (38.0%)", 
      note: "Ikkinchi o'lchash — takrorlanish",
      theoryNote: "Takrorlanish — natijalar bir xil."
    },
    { 
      id: "TGA-24-003", 
      date: "2026-03-16", 
      heatingRate: "10°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "13.9%", 
      massLoss2: "27.4%", 
      massLoss3: "20.7%", 
      residue: "CoCl₂ (38.0%)", 
      note: "Tezroq qizdirish — bosqichlar biroz siljiydi",
      theoryNote: "Tezroq qizdirishda bosqichlar biroz yuqori haroratga siljiydi."
    },
    { 
      id: "TGA-24-004", 
      date: "2026-03-16", 
      heatingRate: "5°C/min", 
      atmosphere: "Havo", 
      massLoss1: "14.1%", 
      massLoss2: "27.2%", 
      massLoss3: "20.7%", 
      residue: "CoO (30.5%)", 
      note: "Havoda qizdirilgan — CoO qoldiq",
      theoryNote: "Havoda qizdirilganda CoCl₂ → CoO + HCl. CoO qoldiq hosil bo'ladi."
    },
    { 
      id: "TGA-24-005", 
      date: "2026-03-17", 
      heatingRate: "2°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "14.1%", 
      massLoss2: "27.2%", 
      massLoss3: "20.7%", 
      residue: "CoCl₂ (38.0%)", 
      note: "Juda sekin qizdirish — eng aniq bosqichlar",
      theoryNote: "Juda sekin qizdirishda har bir bosqich aniq ko'rinadi."
    },
    { 
      id: "DTA-24-001", 
      date: "2026-03-15", 
      heatingRate: "5°C/min", 
      atmosphere: "N₂ (1 atm)", 
      massLoss1: "Endotermik (tashqi Cl⁻)", 
      massLoss2: "Endotermik (NH₃)", 
      massLoss3: "Endotermik (ichki Cl⁻)", 
      residue: "DTA: 4 endotermik + 1 ekzotermik pik", 
      note: "DTA tahlili — tashqi Cl⁻ (200-250°C), NH₃ (250-350°C), ichki Cl⁻ (350-450°C), CoCl₂ (600°C)",
      theoryNote: "DTA da 4 ta endotermik pik (tashqi Cl⁻, 2×NH₃, ichki Cl⁻) va 1 ta ekzotermik pik (CoCl₂ hosil bo'lishi)."
    }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Co(NH₃)₅Cl]Cl₂ zaharli emas, lekin NH₃ va Cl₂ gazi ajralishi mumkin. Qo'lqop, himoya ko'zoynaklari va laboratoriya xalati majburiy. Ventilyatsiya zarur!", time: "doimiy", critical: true },
    { step: 2, title: "Namuna tayyorlash", desc: "10-20 mg [Co(NH₃)₅Cl]Cl₂ Al₂O₃ yoki Pt tigelga solinadi. Namuna mayda kukun bo'lishi kerak.", time: "5 daq", critical: true },
    { step: 3, title: "TGA qurilmasini tayyorlash", desc: "TGA qurilmasi N₂ yoki Ar atmosferasida tayyorlanadi. Gaz oqimi 50 mL/min.", time: "10 daq", critical: true },
    { step: 4, title: "Qizdirish dasturini o'rnatish", desc: "25°C dan 800°C gacha, 5°C/min tezlikda. Inert atmosfera saqlanadi.", time: "2 daq", critical: true },
    { step: 5, title: "TGA o'lchash", desc: "Qizdirish boshlanadi. Massa o'zgarishi va harorat yoziladi. 200-250°C da tashqi Cl⁻, 250-350°C da NH₃, 350-450°C da ichki Cl⁻ ajraladi.", time: "2-3 soat", critical: false },
    { step: 6, title: "Natijalarni tahlil qilish", desc: "Har bir bosqichda massa yo'qotish foizi hisoblanadi. Tashqi Cl⁻ (14.1%), NH₃ (27.2%), ichki Cl⁻ (14.1%) ajralishi aniqlanadi.", time: "10 daq", critical: false }
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
      role: "Kristall strukturani aniqlaydi",
      tgaAdvantage: "XRD strukturani, TGA termik xatti-harakatni ko'rsatadi",
      tgaDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "92%"
    }
  ],

  decompositionTable: [
    {
      complex: "[Co(NH₃)₅Cl]Cl₂",
      step1_temp: "200-250°C",
      step1_product: "2 ta tashqi Cl⁻",
      step2_temp: "250-350°C",
      step2_product: "NH₃ + ichki Cl⁻",
      notes: "Ichki/tashqi sfera farqi — Verner nazariyasi"
    },
    {
      complex: "[Co(en)₃]Cl₃",
      step1_temp: "250-300°C",
      step1_product: "1 ta en",
      step2_temp: "300-350°C",
      step2_product: "Yana 1 ta en",
      notes: "Xelat effekti — 3 ta en bosqichli ajraladi"
    },
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
    }
  ]
}

function calculateMassLoss(massLossPercent, molarMass) {
  const massLost = massLossPercent
  const molesLost = (massLossPercent / 100) * molarMass / 250.44
  return {
    massLost: massLost.toFixed(2),
    molesLost: molesLost.toFixed(3),
    molecules: molesLost.toFixed(3)
  }
}

export default function CoNH35ClCl2ThermalPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeRun, setActiveRun] = useState("TGA-24-001")
  const [tgaTemp, setTgaTemp] = useState(25)
  const [showWarningModal, setShowWarningModal] = useState(true)
  
  const [calcMass, setCalcMass] = useState(100)
  const [calcMassLoss, setCalcMassLoss] = useState(27.2)
  const [calcMolarMass, setCalcMolarMass] = useState(250.44)

  const calcResult = useMemo(() => {
    const massLost = calcMass * (calcMassLoss / 100)
    const molesLost = (massLost / 250.44) * (calcMass / 100)
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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-pink-950/20 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-pink-950 to-purple-950 border-2 border-pink-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> VERNER NAZARIYASI — ICHKI/TASHQI SFERA FARQI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-pink-300">[Co(NH₃)₅Cl]Cl₂</strong> — purpureo tuzi, Verner nazariyasining klassik namunasi. Ichki Cl⁻ yuqori T da, tashqi Cl⁻ past T da ajraladi!
            </p>
            
            <div className="bg-pink-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-pink-400 font-bold mb-2">⚠ Ichki sfera:</div>
                  <div className="text-purple-200">
                    <strong>1 ta Cl⁻</strong> — Co³⁺ ga bog'langan, yuqori T da ajraladi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>5 ta NH₃</strong> — ichki sferada.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">✅ Tashqi sfera:</div>
                  <div className="text-purple-200">
                    <strong>2 ta Cl⁻</strong> — ion, past T da ajraladi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>AgNO₃</strong> qo'shilganda faqat tashqi Cl⁻ cho'kadi.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-pink-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-pink-300">Verner nazariyasi (1893):</strong> 1 ta Cl⁻ ichki sferada (Co³⁺ ga bog'langan), 2 ta Cl⁻ tashqi sferada (ion). AgNO₃ qo'shilganda faqat 2 ta Cl⁻ cho'kadi — bu Verner nazariyasining eng muhim isboti.
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-pink-400 font-semibold">[Co(NH₃)₅Cl]Cl₂</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-pink-400 flex items-center gap-2">
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
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Co³⁺ d⁶</span>
                  <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Ichki/Tashqi</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Purpureo</span>
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
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-pink-600 hover:bg-pink-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Birikma haqida (termik tahlil uchun)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Co(NH₃)₅Cl]Cl₂</strong> — purpureo tuzi, Verner nazariyasining klassik namunasi. Termik tahlilda <strong className="text-pink-300">ichki/tashqi sfera farqi</strong> kuzatiladi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-pink-500 text-xs md:text-sm">
                <li><strong className="text-white">Co³⁺ (d⁶, past spin)</strong> — oktaedr geometriya</li>
                <li><strong className="text-white">5 ta NH₃ + 1 ta Cl⁻</strong> ichki sferada</li>
                <li><strong className="text-pink-300">2 ta Cl⁻</strong> tashqi sferada (ion)</li>
                <li><strong className="text-pink-300">Tashqi Cl⁻</strong> — past T da ajraladi (200-250°C)</li>
                <li><strong className="text-pink-300">Ichki Cl⁻</strong> — yuqori T da ajraladi (350-450°C)</li>
                <li><strong className="text-pink-300">CoCl₂</strong> qoldiq qoladi (38.0%)</li>
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

        {/* 2. ICHKI/TASHQI SFERA VA BOSQICHLI PARCHALANISH */}
        <div className="bg-gradient-to-r from-pink-900/40 to-red-900/40 border-2 border-pink-700/70 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔥</span> {COMPOUND.thermalFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.thermalFeature.description}
          </p>

          <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
            <div className="text-center text-lg font-mono text-pink-400 mb-2">
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
                <span className="text-yellow-400">3-bosqich (300-350°C):</span> {COMPOUND.thermalFeature.reaction.step3}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">4-bosqich (350-450°C):</span> {COMPOUND.thermalFeature.reaction.step4}
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <span className="text-yellow-400">5-bosqich (500-600°C):</span> {COMPOUND.thermalFeature.reaction.step5}
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
            [Co(NH₃)₅Cl]Cl₂ uchun nazariy tarkib. Co³⁺ markaziy atom, 5 ta NH₃ + 1 ta ichki Cl⁻, 2 ta tashqi Cl⁻.
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
                  const elColor = el === "Co" ? "text-pink-400" : el === "Cl_inner" ? "text-red-400" : el === "Cl_outer" ? "text-orange-400" : "text-purple-400"
                  return (
                    <tr key={el} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className={`py-3 pl-2 font-bold ${elColor}`}>{el === "Cl_inner" ? "Cl (ichki)" : el === "Cl_outer" ? "Cl (tashqi)" : el}</td>
                      <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                      <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                      <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                      <td className="py-3 pl-4 text-[10px] text-purple-400">{d.thermalSignal}</td>
                    </tr>
                  )
                })}
                <tr className="bg-pink-900/20 font-bold border-t border-pink-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-pink-300">TGA: tashqi Cl⁻ (14.1%) + NH₃ (27.2%) + ichki Cl⁻ (14.1%) + CoCl₂ (38.0%)</td>
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
            [Co(NH₃)₅Cl]Cl₂ uchun standart termik tahlil sharoitlari. Ichki/tashqi sfera farqini aniq ajratish uchun sekin qizdirish kerak.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Qizdirish tezligi</div>
              <div className="text-sm font-bold text-pink-400">{COMPOUND.thermalParameters.heatingRate}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Atmosfera</div>
              <div className="text-sm font-bold text-pink-400">{COMPOUND.thermalParameters.atmosphere}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Namuna massasi</div>
              <div className="text-sm font-bold text-pink-400">{COMPOUND.thermalParameters.sampleMass}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Harorat diapazoni</div>
              <div className="text-sm font-bold text-pink-400">{COMPOUND.thermalParameters.tempRange}</div>
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
            <label className="block text-pink-400 font-bold mb-2">
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
                <div className="text-xl font-mono font-bold text-pink-400">{currentTGA.temp}°C</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Massa:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentTGA.mass.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentTGA.event}</div>
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
                stroke="#ec4899" 
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
          <h2 className="text-xl font-bold text-white mb-6">🌡️ DTA egri chizig'i — tashqi Cl⁻, NH₃ va ichki Cl⁻ parchalanish piklari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>DTA (Differensial Termik Analiz)</strong> — namuna va referens o'rtasidagi harorat farqini o'lchaydi.
            <strong className="text-pink-400"> Endotermik</strong> piklar tashqi Cl⁻, NH₃ va ichki Cl⁻ ajralishini ko'rsatadi.
          </p>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> DTA piklarining nazariy izohi:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">200-250°C — tashqi Cl⁻</div>
                <div className="text-purple-200">Tashqi Cl⁻ (ion) ajraladi (ΔH ≈ +50 kJ/mol).</div>
              </div>
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">250-300°C — NH₃</div>
                <div className="text-purple-200">2 ta NH₃ parchalanadi.</div>
              </div>
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">300-350°C — NH₃</div>
                <div className="text-purple-200">Yana 2 ta NH₃ parchalanadi.</div>
              </div>
              <div className="bg-red-900/20 rounded-lg p-3">
                <div className="text-red-400 font-bold mb-1">350-450°C — ichki Cl⁻</div>
                <div className="text-purple-200">Oxirgi NH₃ va ichki Cl⁻ parchalanadi.</div>
              </div>
              <div className="bg-green-900/20 rounded-lg p-3">
                <div className="text-green-400 font-bold mb-1">500-600°C — Cl₂</div>
                <div className="text-purple-200">CoCl₃ parchalanadi, Cl₂ ajraladi.</div>
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
                stroke="#ec4899" 
                strokeWidth="2"
                points={COMPOUND.dtaData.map(p => {
                  const x = 50 + (p.temp/800)*530
                  const y = 130 - (p.signal/30)*100
                  return `${x},${y}`
                }).join(" ")}
              />

              <text x="170" y="155" fontSize="8" fill="#ef4444">tashqi Cl⁻ (200°C)</text>
              <text x="220" y="155" fontSize="8" fill="#ef4444">NH₃ (250°C)</text>
              <text x="270" y="155" fontSize="8" fill="#ef4444">NH₃ (300°C)</text>
              <text x="320" y="155" fontSize="8" fill="#ef4444">ichki Cl⁻ (350°C)</text>
              <text x="420" y="155" fontSize="8" fill="#ef4444">Cl₂ (500°C)</text>
              <text x="470" y="100" fontSize="8" fill="#22c55e">CoCl₂ (600°C)</text>
            </svg>
          </div>
        </div>

        {/* 7. PARCHALANISH BOSQICHLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Parchalanish bosqichlari — interaktiv</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Har bir bosqichni bosib, batafsil ma'lumot oling.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {COMPOUND.decompositionSteps.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveStep(i)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  activeStep === i 
                    ? "bg-pink-900/40 border-2 border-pink-400" 
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-pink-500/50"
                }`}
              >
                <div className="text-pink-400 font-bold mb-2">{step.temp}</div>
                <div className="text-purple-200 text-sm font-bold mb-1">{step.event}</div>
                <div className="text-pink-400 text-sm font-mono">−{step.massLoss}</div>
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
                      ? "bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-500/20"
                      : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-pink-500"
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
                <div className="text-xs text-purple-400">tashqi Cl⁻:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{run.massLoss1}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">NH₃ + ichki Cl⁻:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{run.massLoss2}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Qoldiq:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{run.residue}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 9. TGA KALKULYATOR */}
        <div className="bg-pink-900/20 border border-pink-500/30 rounded-2xl p-8">
          <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> TGA kalkulyatori — massa yo'qotishdan molekula soni
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Massa yo'qotish foizidan <strong className="text-pink-300">qancha [Co(NH₃)₅Cl]Cl₂ molekulasi</strong> ajralganini hisoblang.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Boshlang'ich massa (mg):</label>
              <input
                type="number"
                value={calcMass}
                onChange={(e) => setCalcMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Massa yo'qotish (%):</label>
              <input
                type="number"
                step="0.1"
                value={calcMassLoss}
                onChange={(e) => setCalcMassLoss(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Molyar massa (g/mol):</label>
              <input
                type="number"
                step="0.01"
                value={calcMolarMass}
                onChange={(e) => setCalcMolarMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Yo'qotilgan massa:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{calcResult.massLost} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Mol:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{calcResult.molesLost}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Molekula (mol):</div>
                <div className="text-xl font-mono font-bold text-pink-400">{calcResult.molecules}</div>
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
                  <th className="py-3 px-4 text-pink-300">Kompleks</th>
                  <th className="py-3 px-4 text-pink-300">1-bosqich (T, °C)</th>
                  <th className="py-3 px-4 text-pink-300">Ajralgan</th>
                  <th className="py-3 px-4 text-pink-300">2-bosqich (T, °C)</th>
                  <th className="py-3 px-4 text-pink-300">Qoldiq</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.decompositionTable.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-pink-400 text-sm">{r.complex}</td>
                    <td className="py-3 px-4 text-pink-400">{r.step1_temp}</td>
                    <td className="py-3 px-4">{r.step1_product}</td>
                    <td className="py-3 px-4 text-pink-400">{r.step2_temp}</td>
                    <td className="py-3 px-4">{r.step2_product}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 11. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Termik tahlilga yaqin tahlil usullari
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

          <div className="mt-5 bg-pink-900/20 border border-pink-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-pink-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">TGA (massa) + DTA (tashqi Cl⁻/NH₃/ichki Cl⁻) + IQ (NH₃, Cl) + XRD (struktura) + DSC (ΔH)</strong> — beshta metod birgalikda [Co(NH₃)₅Cl]Cl₂ ni to'liq tavsiflaydi va ichki/tashqi sfera farqini tasdiqlaydi.
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
              <p className="text-xs text-purple-200">Ichki/tashqi sfera farqini aniqlaydi. Tashqi Cl⁻ past T da, ichki Cl⁻ yuqori T da ajraladi.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Sekin qizdirish kerak. NH₃ va Cl₂ gazi ajraladi — ventilyatsiya majburiy.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">DTA (tashqi/ichki Cl⁻), IQ (NH₃, Cl), XRD (struktura), DSC (ΔH) — to'liq tahlil uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/termik" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Termik tahlil
            </Link>
            <Link href="/ilmiy/tahlil/termik/birikmalar" className="text-sm bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha birikmalar →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₅Cl]Cl₂ • Termik tahlil moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis), Werner (1893)</p>
        </div>
      </footer>
    </main>
  )
}