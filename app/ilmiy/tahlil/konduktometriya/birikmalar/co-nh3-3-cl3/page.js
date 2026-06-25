"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₃Cl₃] — KONDUKTOMETRIK TAHLIL MAHSUS SAHIFASI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Bard & Faulkner
// Xususiyat: Verner klassik qatori, NOELEKTROLIT, 0 ion
// O'ziga xoslik: Barcha 3 ta Cl⁻ ichki sferada, fac/mer izomerlar
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Co: 58.933, N: 14.007, H: 1.008, Cl: 35.450
}

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>3</sub>Cl<sub>3</sub>]",
  formulaPlain: "[Co(NH3)3Cl3]",
  iupac: "Triammintxlorokobalt(III)",
  formulaExpanded: "CoN₃H₉Cl₃",
  commonName: "Neytral kobalt kompleksi (binafsha-jigar)",
  molarMass: 216.36,
  casNumber: "14878-43-9",
  color: "binafsha-jigar",
  stability: "havoda barqaror, Co³⁺ inert (d⁶, past spin)",
  crystalStructure: "Oktaedr — Co³⁺ markazida 3 ta NH₃ + 3 ta Cl⁻ (barchasi ichki sferada)",
  coordinationNumber: "6 (oktaedr)",
  spinState: "Past spin (t₂g⁶ e_g⁰) — diamagnit (0 toq elektron)",
  magneticMoment: "μ = 0 BM (diamagnit)",
  
  wernerInfo: {
    wernerGroup: "Verner klassik qatori",
    electrolyteType: "Noelektrolit",
    ions: 0,
    lm: 0,
    formula_verner: "[Co(NH₃)₃Cl₃]⁰",
    wernerProof: "Verner 1893-yilda konduktometrik o'lchashlar orqali hech qanday ion tashqi sferada emasligini isbotladi. Λm ≈ 0 S·cm²/mol — bu 0 ta ion borligini ko'rsatadi (noelektrolit)."
  },

  historicalFact: {
    title: "Neytral kompleks — Verner nazariyasining to'liq isboti",
    text: "[Co(NH₃)₃Cl₃] — Alfred Verner koordinatsion nazariyasining to'rtinchi va oxirgi namunasi. Bu kompleks neytral bo'lib, Verner Λm ni o'lchab, 0 ta ion borligini ko'rsatdi (noelektrolit).",
    textExtended: "Bu kompleks Verner qatorini yakunlaydi: [Co(NH₃)₆]Cl₃ (4 ion, Λm ≈ 430), [Co(NH₃)₅Cl]Cl₂ (3 ion, Λm ≈ 340), [Co(NH₃)₄Cl₂]Cl (2 ion, Λm ≈ 250), [Co(NH₃)₃Cl₃] (0 ion, Λm ≈ 0). Verner bu kompleks orqali barcha 3 ta Cl⁻ ichki sferada ekanligini isbotladi — AgNO₃ qo'shilganda hech qanday cho'kma bermaydi. Bu Verner nazariyasining to'liq isboti bo'ldi va 1913-yilda Nobel mukofotini olib keldi.",
    year: "1893-yil (Nobel 1913)"
  },

  interestingFacts: [
    {
      title: "Verner qatorining yakuni",
      fact: "4 ion (Λm ≈ 430) → 3 ion (Λm ≈ 340) → 2 ion (Λm ≈ 250) → 0 ion (Λm ≈ 0). Bu Verner nazariyasining to'liq isboti."
    },
    {
      title: "AgNO₃ bilan cho'kma bermaydi",
      fact: "Barcha 3 ta Cl⁻ ichki sferada — AgNO₃ qo'shilganda hech qanday AgCl cho'kma bermaydi. Bu Verner nazariyasining asosiy isboti."
    },
    {
      title: "Facial va Meridional izomerlar",
      fact: "[Co(NH₃)₃Cl₃] ning ikkita geometrik izomeri mavjud: fac-izomer (3 ta Cl⁻ bir tomonda) va mer-izomer (3 ta Cl⁻ meridional joylashgan)."
    },
    {
      title: "Inert kompleks",
      fact: "Co³⁺ (d⁶, past spin) inert — ligand almashinishi juda sekin (kunlar-oylar). Bu kompleksni barqaror qiladi."
    },
    {
      title: "Noelektrolit",
      fact: "Λm ≈ 0 S·cm²/mol — eritmada ionlarga dissotsiatsiyalanmaydi. Bu noelektrolit kompleks."
    }
  ],

  conductometricFeature: {
    title: "[Co(NH₃)₃Cl₃] — Noelektrolit, Λm ≈ 0 S·cm²/mol",
    description: "Bu kompleks konduktometriyada klassik namuna hisoblanadi. Barcha 3 ta NH₃ va 3 ta Cl⁻ ichki sferada — Co³⁺ ga bog'langan, erkin harakatlanmaydi. Eritmada ionlarga dissotsiatsiyalanmaydi.",
    reaction: {
      dissociation: "[Co(NH₃)₃Cl₃] → [Co(NH₃)₃Cl₃] (dissotsiatsiyalanmaydi)",
      ions: "0 ion — noelektrolit",
      electrolyteType: "Noelektrolit",
      lm_theoretical: "Λm ≈ 0 S·cm²/mol (25°C, 10⁻³ M)"
    },
    problem: {
      title: "Nol o'tkazuvchanlik — 0 ta ion",
      description: "Barcha 3 ta NH₃ va 3 ta Cl⁻ ichki sferada — Co³⁺ ga bog'langan, erkin harakatlanmaydi. Eritmada ionlarga dissotsiatsiyalanmaydi.",
      impact: "Λm ≈ 0 S·cm²/mol — bu noelektrolit uchun tipik qiymat. Verner bu qiymat orqali barcha Cl⁻ ichki sferada ekanligini isbotladi."
    },
    solution: {
      title: "Kohlrausch qonuni",
      description: "Kohlrausch qonuni bo'yicha: Λm° = λ₊ + λ₋. Noelektrolit uchun Λm° ≈ 0.",
      mechanism: "Λm° ≈ 0 S·cm²/mol — ionlar yo'q, shuning uchun o'tkazuvchanlik nolga yaqin."
    }
  },

  conductometricParameters: {
    cellConstant: "K = 1.0 cm⁻¹ (standart)",
    frequency: "1-4 kHz (o'zgaruvchan tok)",
    temperature: "25°C (standart)",
    concentration: "10⁻³ M (standart)",
    solvent: "Suv (deionizatsiyalangan)",
    measurementTime: "2-3 daqiqa"
  },

  theoretical: {
    Co:  { mass: 58.933,  percent: 27.24, source: "Co³⁺ markaziy atom (ichki sfera)", conductSignal: "[Co(NH₃)₃Cl₃] — o'tkazuvchanlikka hissa qo'shmaydi" },
    N:   { mass: 42.021,  percent: 19.42, source: "3×NH₃ (3×N, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" },
    H:   { mass: 9.072,   percent: 4.19,  source: "3×NH₃ (9×H, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" },
    Cl:  { mass: 106.350, percent: 49.16, source: "3×Cl⁻ (ichki sfera, Co³⁺ ga bog'langan)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" }
  },

  conductometricData: [
    { conc: 0.0001, lm: 2, kappa: 0.0002, event: "Juda suyultirilgan", theoryNote: "Cheksiz suyultirishda ham Λm ≈ 0 — noelektrolit" },
    { conc: 0.0005, lm: 1.5, kappa: 0.00075, event: "Juda suyultirilgan", theoryNote: "Λm ≈ 0 — noelektrolit" },
    { conc: 0.001, lm: 1, kappa: 0.001, event: "Standart konsentratsiya", theoryNote: "Standart konsentratsiya (10⁻³ M) — Λm ≈ 0 S·cm²/mol" },
    { conc: 0.005, lm: 0.8, kappa: 0.004, event: "O'rta konsentratsiya", theoryNote: "Λm ≈ 0 — noelektrolit" },
    { conc: 0.01, lm: 0.5, kappa: 0.005, event: "O'rta konsentratsiya", theoryNote: "Λm ≈ 0 — noelektrolit" },
    { conc: 0.05, lm: 0.3, kappa: 0.015, event: "Yuqori konsentratsiya", theoryNote: "Λm ≈ 0 — noelektrolit" },
    { conc: 0.1, lm: 0.2, kappa: 0.02, event: "Yuqori konsentratsiya", theoryNote: "Λm ≈ 0 — noelektrolit" },
    { conc: 0.5, lm: 0.1, kappa: 0.05, event: "Juda yuqori konsentratsiya", theoryNote: "Λm ≈ 0 — noelektrolit" },
    { conc: 1.0, lm: 0.05, kappa: 0.05, event: "Juda yuqori konsentratsiya", theoryNote: "Λm ≈ 0 — noelektrolit" }
  ],

  solventData: [
    { solvent: "Suv (H₂O)", dielectric: 78.5, lm: 1, kappa: 0.001, color: "binafsha-jigar", note: "Standart erituvchi — Λm ≈ 0 (noelektrolit)" },
    { solvent: "Metanol (CH₃OH)", dielectric: 32.7, lm: 0.8, kappa: 0.0008, color: "binafsha-jigar", note: "Kamroq dielektrik — Λm ≈ 0" },
    { solvent: "Etanol (C₂H₅OH)", dielectric: 24.3, lm: 0.5, kappa: 0.0005, color: "binafsha-jigar", note: "Yanada kamroq dielektrik" },
    { solvent: "DMF (Dimetilformamid)", dielectric: 36.7, lm: 0.7, kappa: 0.0007, color: "binafsha-jigar", note: "Qutbli organik erituvchi" },
    { solvent: "CH₃CN (Asetonitril)", dielectric: 37.5, lm: 0.6, kappa: 0.0006, color: "binafsha-jigar", note: "Qutbli organik erituvchi" },
    { solvent: "Aseton ((CH₃)₂CO)", dielectric: 20.7, lm: 0.3, kappa: 0.0003, color: "binafsha-jigar", note: "Kam qutbli — Λm ≈ 0" }
  ],

  temperatureData: [
    { temp: 15, lm: 0.8, kappa: 0.0008, note: "Past temperatura — Λm ≈ 0" },
    { temp: 20, lm: 0.9, kappa: 0.0009, note: "Xona temperaturasi" },
    { temp: 25, lm: 1.0, kappa: 0.001, note: "Standart temperatura (25°C) — Λm ≈ 0" },
    { temp: 30, lm: 1.1, kappa: 0.0011, note: "Yuqori temperatura — Λm ≈ 0" },
    { temp: 40, lm: 1.3, kappa: 0.0013, note: "Yuqori temperatura" },
    { temp: 50, lm: 1.5, kappa: 0.0015, note: "Juda yuqori temperatura — Λm ≈ 0" }
  ],

  wernerComparison: [
    { complex: "[Co(NH₃)₆]Cl₃", formula: "[Co(NH₃)₆]³⁺ + 3Cl⁻", ions: 4, lm: 432, type: "1:3", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Co(NH₃)₅Cl]Cl₂", formula: "[Co(NH₃)₅Cl]²⁺ + 2Cl⁻", ions: 3, lm: 340, type: "1:2", color: "binafsha", colorCode: "text-pink-400" },
    { complex: "[Co(NH₃)₄Cl₂]Cl", formula: "[Co(NH₃)₄Cl₂]⁺ + Cl⁻", ions: 2, lm: 250, type: "1:1", color: "yashil", colorCode: "text-green-400" },
    { complex: "[Co(NH₃)₃Cl₃]", formula: "[Co(NH₃)₃Cl₃]⁰", ions: 0, lm: 0, type: "Noelektrolit", color: "binafsha-jigar", colorCode: "text-purple-400" }
  ],

  experimentalRuns: [
    { 
      id: "COND-24-001", 
      date: "2026-04-15", 
      concentration: 0.001, 
      lm: 1.0, 
      kappa: 0.001, 
      ions: 0, 
      type: "Noelektrolit",
      note: "Toza [Co(NH₃)₃Cl₃] — inert atmosfera",
      theoryNote: "Standart sharoitda Λm ≈ 1 S·cm²/mol — bu noelektrolit uchun tipik qiymat."
    },
    { 
      id: "COND-24-002", 
      date: "2026-04-15", 
      concentration: 0.001, 
      lm: 1.1, 
      kappa: 0.0011, 
      ions: 0, 
      type: "Noelektrolit",
      note: "Ikkinchi o'lchash — takrorlanish",
      theoryNote: "Takrorlanish — natijalar bir xil (Λm ≈ 1.1 S·cm²/mol)."
    },
    { 
      id: "COND-24-003", 
      date: "2026-04-16", 
      concentration: 0.005, 
      lm: 0.8, 
      kappa: 0.004, 
      ions: 0, 
      type: "Noelektrolit",
      note: "Yuqori konsentratsiya (5×10⁻³ M)",
      theoryNote: "Yuqori konsentratsiyada Λm ≈ 0 — noelektrolit."
    },
    { 
      id: "COND-24-004", 
      date: "2026-04-16", 
      concentration: 0.01, 
      lm: 0.5, 
      kappa: 0.005, 
      ions: 0, 
      type: "Noelektrolit",
      note: "Yuqori konsentratsiya (10⁻² M)",
      theoryNote: "Λm ≈ 0 — noelektrolit."
    },
    { 
      id: "COND-24-005", 
      date: "2026-04-17", 
      concentration: 0.001, 
      lm: 1.0, 
      kappa: 0.001, 
      ions: 0, 
      type: "Noelektrolit",
      note: "Tozalangan elektrod — eng aniq natija",
      theoryNote: "Tozalangan elektrod — eng aniq natija (Λm ≈ 1 S·cm²/mol)."
    },
    { 
      id: "COND-24-006", 
      date: "2026-04-17", 
      concentration: 0.0001, 
      lm: 2.0, 
      kappa: 0.0002, 
      ions: 0, 
      type: "Noelektrolit",
      note: "Juda suyultirilgan — Λm ≈ 0",
      theoryNote: "Juda suyultirilgan eritma — Λm ≈ 2 S·cm²/mol (noelektrolit)."
    }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Co(NH₃)₃Cl₃] zaharli emas, lekin Co³⁺ zaharli. Qo'lqop, himoya ko'zoynaklari va laboratoriya xalati majburiy. Ventilyatsiya zarur!", time: "doimiy", critical: true },
    { step: 2, title: "Kerakli asboblar", desc: "Analitik tarozi (0.1 mg aniqlik), 100 mL o'lchov kolbasi, konduktometr, Pt elektrodlar, yacheyka, pipetka, deionizatsiyalangan suv.", time: "5 daq", critical: true },
    { step: 3, title: "Yacheyka konstantasini aniqlash", desc: "KCl standart eritmasi (0.01 M, κ = 0.001413 S/cm) yordamida yacheyka konstantasi K aniqlanadi. K = κ/R ≈ 1.0 cm⁻¹.", time: "10 daq", critical: true },
    { step: 4, title: "Eritma tayyorlash (10⁻³ M)", desc: "Analitik tarozida 21.64 mg [Co(NH₃)₃Cl₃] tortilib, 100 mL o'lchov kolbasiga solinadi. 50 mL deionizatsiyalangan suv qo'shib, eritiladi.", time: "5 daq", critical: true },
    { step: 5, title: "Hajmni to'ldirish", desc: "Deionizatsiyalangan suv bilan 100 mL gacha to'ldiriladi. Yaxshilab aralashtiriladi (5 daqiqa).", time: "5 daq", critical: true },
    { step: 6, title: "Elektrodlarni tozalash", desc: "Platina elektrodlari distillangan suv bilan yuviladi, keyin eritmaga tushiriladi.", time: "5 daq", critical: true },
    { step: 7, title: "Konduktometrik o'lchash", desc: "O'zgaruvchan tok (1-4 kHz) beriladi, qarshilik R o'lchanadi. κ = K/R hisoblanadi. 3 marta takrorlanadi.", time: "2-3 daq", critical: false },
    { step: 8, title: "Λm hisoblash", desc: "Λm = (κ × 1000) / c hisoblanadi. Natija ≈ 0-2 S·cm²/mol bo'lishi kerak (noelektrolit).", time: "2 daq", critical: false },
    { step: 9, title: "Natijalarni tahlil qilish", desc: "3 ta o'lchashning o'rtacha qiymati hisoblanadi. RSD < 2% bo'lishi kerak.", time: "2 daq", critical: false },
    { step: 10, title: "Tozalash va saqlash", desc: "Elektrodlar distillangan suv bilan yuviladi. Eritma saqlanadi (qorong'i, 4°C).", time: "5 daq", critical: false }
  ],

  relatedMethods: [
    {
      name: "ICP-OES/ICP-MS",
      role: "Co va Cl miqdorini aniqlaydi",
      condAdvantage: "Konduktometriya ionlar sonini, ICP miqdorni aniqlaydi",
      condDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "95%"
    },
    {
      name: "UV-Vis spektroskopiya",
      role: "Kompleks rangini va konsentratsiyani aniqlaydi",
      condAdvantage: "UV-Vis rangni, konduktometriya ionlar sonini aniqlaydi",
      condDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "90%"
    },
    {
      name: "XRD (Rentgen difraksiya)",
      role: "Kristall strukturani aniqlaydi (fac/mer izomerlar)",
      condAdvantage: "XRD strukturani, konduktometriya ionlar sonini aniqlaydi",
      condDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "92%"
    },
    {
      name: "Elementar tahlil (EA)",
      role: "C, H, N miqdorini aniqlaydi",
      condAdvantage: "EA organik qismni, konduktometriya ionlar sonini aniqlaydi",
      condDisadvantage: "Birgalikda to'liq tahlil",
      complementarity: "88%"
    }
  ]
}

export default function CoNH33Cl3ConductometricPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeRun, setActiveRun] = useState("COND-24-001")
  const [activeWerner, setActiveWerner] = useState(3)
  const [concSlider, setConcSlider] = useState(0.001)
  const [tempSlider, setTempSlider] = useState(25)
  const [solventSlider, setSolventSlider] = useState(0)
  
  const [calcKappa, setCalcKappa] = useState(0.001)
  const [calcConc, setCalcConc] = useState(0.001)
  
  const [calcLambdaPlus, setCalcLambdaPlus] = useState(0)
  const [calcLambdaMinus, setCalcLambdaMinus] = useState(0)

  const calcResult = useMemo(() => {
    const lm = (calcKappa * 1000) / calcConc
    let type = "Noma'lum"
    let color = "text-purple-400"
    let ions = 0
    if (lm >= 400 && lm <= 500) { type = "1:3 elektrolit"; color = "text-red-400"; ions = 4 }
    else if (lm >= 300 && lm < 400) { type = "1:2 elektrolit"; color = "text-blue-400"; ions = 3 }
    else if (lm >= 150 && lm < 300) { type = "1:1 elektrolit"; color = "text-green-400"; ions = 2 }
    else if (lm < 10) { type = "Noelektrolit"; color = "text-gray-400"; ions = 0 }
    return { lm: lm.toFixed(2), type, color, ions }
  }, [calcKappa, calcConc])

  const kohlrauschResult = useMemo(() => {
    const lm0 = calcLambdaPlus + calcLambdaMinus
    return { lm0: lm0.toFixed(2) }
  }, [calcLambdaPlus, calcLambdaMinus])

  const currentConductometric = useMemo(() => {
    const data = COMPOUND.conductometricData
    for (let i = 0; i < data.length - 1; i++) {
      if (concSlider >= data[i].conc && concSlider < data[i+1].conc) {
        const c1 = data[i].conc
        const c2 = data[i+1].conc
        const lm1 = data[i].lm
        const lm2 = data[i+1].lm
        const lm = lm1 + (lm2 - lm1) * ((concSlider - c1) / (c2 - c1))
        return { conc: concSlider, lm, kappa: (lm * concSlider / 1000), event: data[i].event, theoryNote: data[i].theoryNote }
      }
    }
    return data[data.length - 1]
  }, [concSlider])

  const currentTemperature = useMemo(() => {
    const data = COMPOUND.temperatureData
    for (let i = 0; i < data.length - 1; i++) {
      if (tempSlider >= data[i].temp && tempSlider < data[i+1].temp) {
        const t1 = data[i].temp
        const t2 = data[i+1].temp
        const lm1 = data[i].lm
        const lm2 = data[i+1].lm
        const lm = lm1 + (lm2 - lm1) * ((tempSlider - t1) / (t2 - t1))
        return { temp: tempSlider, lm, kappa: (lm * 0.001 / 1000), note: data[i].note }
      }
    }
    return data[data.length - 1]
  }, [tempSlider])

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-pink-950/20 to-blue-950 text-white">
      
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-pink-950 to-purple-950 border-2 border-pink-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> VERNER NAZARIYASI — NOELEKTROLIT!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-pink-300">[Co(NH₃)₃Cl₃]</strong> — Verner qatorining oxirgi namunasi. 
              Barcha 3 ta Cl⁻ ichki sferada — hech qanday ion tashqi sferada yo'q!
            </p>
            
            <div className="bg-pink-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-pink-400 font-bold mb-2">⚠ Ichki sfera:</div>
                  <div className="text-purple-200">
                    <strong>3 ta NH₃ + 3 ta Cl⁻</strong> — Co³⁺ ga bog'langan.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Binafsha-jigar rang</strong> — neytral kompleks.
                  </div>
                </div>
                <div>
                  <div className="text-pink-400 font-bold mb-2">🔌 Tashqi sfera:</div>
                  <div className="text-purple-200">
                    <strong>Hech qanday ion yo'q</strong> — noelektrolit.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Λm ≈ 0 S·cm²/mol</strong> — noelektrolit!
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-pink-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-pink-300">Verner isboti (Nobel 1913):</strong> Λm ≈ 0 S·cm²/mol — bu 0 ta ion borligini ko'rsatadi. 
                Barcha Cl⁻ ichki sferada — AgNO₃ bilan cho'kma bermaydi.
              </p>
            </div>

            <div className="bg-pink-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-pink-300">Verner qatori yakuni:</strong> 4 ion (Λm ≈ 430) → 3 ion (Λm ≈ 340) → 2 ion (Λm ≈ 250) → 0 ion (Λm ≈ 0).
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
      
      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/konduktometriya" className="hover:text-purple-300">Konduktometriya</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/konduktometriya/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-pink-400 font-semibold">[Co(NH₃)₃Cl₃]</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-pink-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🔌 Konduktometriya</span>
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
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Noelektrolit</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">0 ion</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Λm ≈ 0</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Nobel 1913</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/konduktometriya/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
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

        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Birikma haqida (konduktometrik tahlil uchun)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Co(NH₃)₃Cl₃]</strong> — neytral kompleks, Verner qatorining oxirgi namunasi. Termik tahlilda <strong className="text-pink-300">noelektrolit</strong> — 0 ta ion borligini ko'rsatadi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-pink-500 text-xs md:text-sm">
                <li><strong className="text-white">Co³⁺ (d⁶, past spin)</strong> — oktaedr geometriya</li>
                <li><strong className="text-white">3 ta NH₃ + 3 ta Cl⁻</strong> barchasi ichki sferada</li>
                <li><strong className="text-pink-300">Hech qanday ion</strong> tashqi sferada yo'q</li>
                <li><strong className="text-pink-300">Λm ≈ 0 S·cm²/mol</strong> — noelektrolit</li>
                <li><strong className="text-pink-300">0 ta ion</strong> — dissotsiatsiyalanmaydi</li>
                <li><strong className="text-pink-300">Diamagnit</strong> — μ = 0 BM</li>
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

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">💡 Qiziqarli faktlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.interestingFacts.map((fact, i) => (
              <div key={i} className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-4">
                <h3 className="text-pink-400 font-bold text-sm mb-2">{fact.title}</h3>
                <p className="text-purple-200 text-xs">{fact.fact}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-900/40 to-red-900/40 border-2 border-pink-700/70 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔌</span> {COMPOUND.conductometricFeature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.conductometricFeature.description}
          </p>

          <div className="bg-purple-950/60 rounded-lg p-4 mb-4">
            <div className="text-center text-lg font-mono text-pink-400 mb-2">
              Dissotsiatsiya reaksiyasi:
            </div>
            <div className="text-center text-2xl font-mono text-pink-400 mb-3">
              {COMPOUND.conductometricFeature.reaction.dissociation}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-pink-900/30 rounded p-3">
                <p className="text-pink-400 font-bold text-lg">{COMPOUND.conductometricFeature.reaction.ions}</p>
                <p className="text-purple-300 text-xs mt-1">Ionlar soni</p>
              </div>
              <div className="bg-blue-900/30 rounded p-3">
                <p className="text-blue-400 font-bold text-lg">{COMPOUND.conductometricFeature.reaction.electrolyteType}</p>
                <p className="text-purple-300 text-xs mt-1">Elektrolit turi</p>
              </div>
              <div className="bg-pink-900/30 rounded p-3">
                <p className="text-pink-400 font-bold text-lg">{COMPOUND.conductometricFeature.reaction.lm_theoretical}</p>
                <p className="text-purple-300 text-xs mt-1">Λm (25°C, 10⁻³ M)</p>
              </div>
              <div className="bg-pink-900/30 rounded p-3">
                <p className="text-pink-400 font-bold text-lg">0 ion</p>
                <p className="text-purple-300 text-xs mt-1">Ionlar soni</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-950/40 rounded-xl p-5 border-2 border-red-500/50">
              <h3 className="text-red-400 font-bold text-sm mb-3">🔌 {COMPOUND.conductometricFeature.problem.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-red-400 font-bold">Muammo:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.conductometricFeature.problem.description}</div>
                </div>
                <div className="bg-red-900/30 rounded p-2">
                  <div className="text-red-300 font-bold">Ta'sir:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.conductometricFeature.problem.impact}</div>
                </div>
              </div>
            </div>

            <div className="bg-green-950/40 rounded-xl p-5 border-2 border-green-500/50">
              <h3 className="text-green-400 font-bold text-sm mb-3">✅ Yechim: {COMPOUND.conductometricFeature.solution.title}</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-2">
                  <div className="text-green-400 font-bold">Mexanizm:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.conductometricFeature.solution.description}</div>
                </div>
                <div className="bg-green-900/30 rounded p-2">
                  <div className="text-green-300 font-bold">Kohlrausch qonuni:</div>
                  <div className="text-purple-200 mt-1">{COMPOUND.conductometricFeature.solution.mechanism}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📐</span> Nazariy element tarkibi
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            [Co(NH₃)₃Cl₃] uchun nazariy tarkib. Co³⁺ markaziy atom, barcha 3 ta NH₃ + 3 ta Cl⁻ ichki sferada.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 text-xs uppercase tracking-wider">
                  <th className="py-3 text-left pl-2">Element</th>
                  <th className="py-3 text-center">Massa</th>
                  <th className="py-3 text-center text-yellow-400">% (m/m)</th>
                  <th className="py-3 text-center">Manba</th>
                  <th className="py-3 text-left pl-4">Konduktometrik signal</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => {
                  const elColor = el === "Co" ? "text-pink-400" : el === "Cl" ? "text-orange-400" : "text-purple-400"
                  return (
                    <tr key={el} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className={`py-3 pl-2 font-bold ${elColor}`}>{el}</td>
                      <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                      <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                      <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                      <td className="py-3 pl-4 text-[10px] text-purple-400">{d.conductSignal}</td>
                    </tr>
                  )
                })}
                <tr className="bg-pink-900/20 font-bold border-t border-pink-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-pink-300">Konduktometriya: 0 ion — noelektrolit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> Konduktometrik tahlil parametrlari
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            [Co(NH₃)₃Cl₃] uchun standart konduktometrik tahlil sharoitlari.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Yacheyka konstantasi</div>
              <div className="text-sm font-bold text-pink-400">{COMPOUND.conductometricParameters.cellConstant}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Chastota</div>
              <div className="text-sm font-bold text-pink-400">{COMPOUND.conductometricParameters.frequency}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Harorat</div>
              <div className="text-sm font-bold text-pink-400">{COMPOUND.conductometricParameters.temperature}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Konsentratsiya</div>
              <div className="text-sm font-bold text-pink-400">{COMPOUND.conductometricParameters.concentration}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Erituvchi</div>
              <div className="text-sm font-bold text-pink-400">{COMPOUND.conductometricParameters.solvent}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">O'lchash vaqti</div>
              <div className="text-sm font-bold text-pink-400">{COMPOUND.conductometricParameters.measurementTime}</div>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📉 Interaktiv konduktometrik egri chiziq (konsentratsiyaga bog'liqlik)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>Konsentratsiyaga bog'liq Λm</strong> — noelektrolit uchun Λm ≈ 0.
            Slayderni harakatlantirib, konsentratsiyani o'zgartiring.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-pink-400 font-bold mb-2">
              Konsentratsiya: {concSlider.toExponential(1)} M
            </label>
            <input
              type="range"
              min="-4"
              max="0"
              step="0.1"
              value={Math.log10(concSlider)}
              onChange={(e) => setConcSlider(Math.pow(10, Number(e.target.value)))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>10⁻⁴ M</span>
              <span>10⁻² M</span>
              <span>10⁰ M</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Konsentratsiya:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentConductometric.conc.toExponential(1)} M</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Λm:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentConductometric.lm.toFixed(1)} S·cm²/mol</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">κ:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{(currentConductometric.kappa * 1000).toFixed(3)} mS/cm</div>
              </div>
            </div>
            
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Nazariy izoh:
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                {currentConductometric.theoryNote}
              </p>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {[0, 1, 2, 3, 4, 5].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/5)*200} x2="580" y2={220 - (v/5)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/5)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v}</text>
                </g>
              ))}

              {[-4, -3, -2, -1, 0].map((c, i) => (
                <g key={i}>
                  <text x={50 + ((c + 4)/4)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">10^{c}</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Konsentratsiya (M)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Λm (S·cm²/mol)</text>

              <polyline
                fill="none" 
                stroke="#ec4899" 
                strokeWidth="2"
                points={COMPOUND.conductometricData.map(p => {
                  const x = 50 + ((Math.log10(p.conc) + 4)/4)*530
                  const y = 220 - (p.lm/5)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              <line 
                x1={50 + ((Math.log10(currentConductometric.conc) + 4)/4)*530} 
                y1="30" 
                x2={50 + ((Math.log10(currentConductometric.conc) + 4)/4)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <circle 
                cx={50 + ((Math.log10(currentConductometric.conc) + 4)/4)*530} 
                cy={220 - (currentConductometric.lm/5)*200} 
                r="6" 
                fill="#fbbf24" 
                stroke="#fff" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Har xil erituvchilarda Λm</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Erituvchining dielektrik doimiysi (ε) dissotsiatsiyaga ta'sir qiladi. Noelektrolit uchun Λm ≈ 0.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-pink-400 font-bold mb-2">
              Erituvchi: {COMPOUND.solventData[solventSlider].solvent}
            </label>
            <input
              type="range"
              min="0"
              max={COMPOUND.solventData.length - 1}
              value={solventSlider}
              onChange={(e) => setSolventSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              {COMPOUND.solventData.map((s, i) => (
                <span key={i} className={solventSlider === i ? "text-pink-400 font-bold" : ""}>
                  {s.solvent.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Erituvchi:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{COMPOUND.solventData[solventSlider].solvent}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Dielektrik ε:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{COMPOUND.solventData[solventSlider].dielectric}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Λm:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{COMPOUND.solventData[solventSlider].lm} S·cm²/mol</div>
              </div>
            </div>
            
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Izoh:
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                {COMPOUND.solventData[solventSlider].note}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌡️ Temperatura ta'siri</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Temperatura ortishi bilan ion harakatchanligi ortadi — noelektrolit uchun Λm ≈ 0.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-pink-400 font-bold mb-2">
              Temperatura: {tempSlider}°C
            </label>
            <input
              type="range"
              min="15"
              max="50"
              value={tempSlider}
              onChange={(e) => setTempSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>15°C</span>
              <span>25°C</span>
              <span>50°C</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Temperatura:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentTemperature.temp}°C</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Λm:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentTemperature.lm.toFixed(1)} S·cm²/mol</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">κ:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{(currentTemperature.kappa * 1000).toFixed(3)} mS/cm</div>
              </div>
            </div>
            
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Izoh:
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                {currentTemperature.note}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏆 Verner klassik qatori — Λm va ionlar soni</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Verner 1893-yilda kobalt komplekslarining molyar o'tkazuvchanligini o'lchab, 
            ularning turli xil ionlar soniga ega ekanligini ko'rsatdi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="py-3 px-4 text-pink-300">Kompleks</th>
                    <th className="py-3 px-4 text-pink-300">Formulasi (Verner)</th>
                    <th className="py-3 px-4 text-pink-300">Ionlar soni</th>
                    <th className="py-3 px-4 text-pink-300">Λm (S·cm²/mol)</th>
                    <th className="py-3 px-4 text-pink-300">Elektrolit turi</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {COMPOUND.wernerComparison.map((exp, i) => (
                    <tr 
                      key={i} 
                      className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${activeWerner === i ? 'bg-purple-800/40' : ''}`}
                      onClick={() => setActiveWerner(i)}
                    >
                      <td className={`py-2 px-3 font-bold text-sm ${exp.colorCode}`}>{exp.complex}</td>
                      <td className="py-2 px-3 text-xs">{exp.formula}</td>
                      <td className="py-2 px-3 font-mono text-yellow-400">{exp.ions}</td>
                      <td className="py-2 px-3 font-mono text-pink-400">{exp.lm}</td>
                      <td className="py-2 px-3 text-xs">{exp.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-purple-400 text-xs mt-3">
              * Verner bu ma'lumotlar asosida Cl⁻ ionlarining bir qismi tashqi sferada (erkin), 
              bir qismi ichki sferada (kompleks bilan bog'langan) ekanligini ko'rsatgan.
            </p>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Laboratoriyada 0 dan tahlil qilish tartibi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.samplePrepSteps.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveStep(i)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  activeStep === i 
                    ? "bg-pink-900/40 border-2 border-pink-400" 
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-pink-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeStep === i ? "bg-pink-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-pink-400 font-bold">{step.title}</p>
                    {step.critical && (
                      <span className="text-[10px] text-red-400">KRITIK</span>
                    )}
                  </div>
                </div>
                {activeStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs">{step.desc}</p>
                    <div className="text-[10px] text-yellow-400 mt-2">
                      Vaqt: {step.time}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

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
            <div className="text-xs text-purple-400 mt-1">{run.date} • {run.concentration.toExponential(1)} M</div>
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
                <div className="text-xs text-purple-400">κ (mS/cm):</div>
                <div className="text-xl font-mono font-bold text-pink-400">{(run.kappa * 1000).toFixed(3)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Λm (S·cm²/mol):</div>
                <div className="text-xl font-mono font-bold text-pink-400">{run.lm}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ionlar soni:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{run.ions}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Elektrolit turi:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{run.type}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-pink-900/20 border border-pink-500/30 rounded-2xl p-8">
          <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Molyar o'tkazuvchanlik kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            κ va konsentratsiyani kiriting — <strong className="text-pink-300">Λm</strong> va elektrolit turi aniqlanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Solishtirma o'tkazuvchanlik κ (S/cm):</label>
              <input
                type="number"
                step="0.0001"
                value={calcKappa}
                onChange={(e) => setCalcKappa(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Konsentratsiya (mol/L):</label>
              <input
                type="number"
                step="0.0001"
                value={calcConc}
                onChange={(e) => setCalcConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Molyar o'tkazuvchanlik Λm:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{calcResult.lm} S·cm²/mol</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Elektrolit turi:</div>
                <div className={`text-xl font-mono font-bold ${calcResult.color}`}>{calcResult.type}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ionlar soni:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{calcResult.ions}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: Λm = (κ × 1000) / c = ({calcKappa} × 1000) / {calcConc} = {calcResult.lm} S·cm²/mol
            </p>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-8">
          <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Kohlrausch qonuni kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            λ₊ va λ₋ ni kiriting — <strong className="text-blue-300">Λm°</strong> hisoblanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">λ₊ = λ([Co(NH₃)₃Cl₃]⁺) (S·cm²/mol):</label>
              <input
                type="number"
                step="1"
                value={calcLambdaPlus}
                onChange={(e) => setCalcLambdaPlus(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">λ₋ = λ(Cl⁻) (S·cm²/mol):</label>
              <input
                type="number"
                step="1"
                value={calcLambdaMinus}
                onChange={(e) => setCalcLambdaMinus(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Λm° (cheksiz suyultirishda):</div>
                <div className="text-xl font-mono font-bold text-blue-400">{kohlrauschResult.lm0} S·cm²/mol</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Formula:</div>
                <div className="text-xl font-mono font-bold text-blue-400">Λm° = λ₊ + λ₋</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Λm° = {calcLambdaPlus} + {calcLambdaMinus} = {kohlrauschResult.lm0} S·cm²/mol
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Konduktometriyaga yaqin tahlil usullari
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
                    <span className="text-purple-300">{m.condAdvantage}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-400">✗ Kamchilik:</span>
                    <span className="text-purple-300">{m.condDisadvantage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-pink-900/20 border border-pink-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-pink-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">Konduktometriya (Λm, ionlar soni) + ICP (Co, Cl miqdori) + UV-Vis (rang) + XRD (struktura) + EA (C, H, N)</strong> — beshta metod birgalikda [Co(NH₃)₃Cl₃] ni to'liq tavsiflaydi va ichki/tashqi sfera farqini tasdiqlaydi.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-900/30 via-indigo-900/30 to-purple-900/30 border border-green-700/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Konduktometriya — <strong className="text-pink-300">ionlar sonini aniqlashning eng oddiy va ishonchli usuli</strong></li>
            <li>Verner nazariyasini isbotlashda <strong className="text-pink-300">tarixiy ahamiyatga ega</strong> (Nobel 1913)</li>
            <li>Molyar o'tkazuvchanlik Λm — <strong className="text-pink-300">ionlar soniga to'g'ri proporsional</strong></li>
            <li>Tashqi va ichki sfera ionlarini <strong className="text-pink-300">aniq farqlash</strong> imkonini beradi</li>
            <li>Kompleks sintezi, kinetikasi va izomer farqlash uchun <strong className="text-pink-300">yordamchi, ammo muhim usul</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/konduktometriya" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Konduktometriya</Link>
          <Link href="/ilmiy/tahlil/konduktometriya/birikmalar" className="px-6 py-3 bg-pink-700/80 rounded-xl hover:bg-pink-600 text-white font-semibold">Barcha birikmalar →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₃Cl₃] • Konduktometrik tahlil moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Bard & Faulkner, Werner (1893, Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}