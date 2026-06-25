"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Zn(phen)₃]²⁺ — SPEKTROFOTOMETRIK TITRLASH MAHSUS SAHIFASI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry)
// Xususiyat: Tris(1,10-fenantrolin)rux(II), xelat effekti, rangsiz kompleks
// O'ziga xoslik: log β₃ = 17.6, Zn²⁺ (d¹⁰, diamagnit), MLCT o'tish
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Zn: 65.38, C: 12.011, H: 1.008, N: 14.007
}

const COMPOUND = {
  formulaHTML: "[Zn(phen)<sub>3</sub>]<sup>2+</sup>",
  formulaPlain: "[Zn(phen)3]2+",
  iupac: "Tris(1,10-fenantrolin)rux(II)",
  formulaExpanded: "ZnC₃₆H₂₄N₆",
  commonName: "Tris(1,10-fenantrolin)rux(II) (rangsiz)",
  molarMass: 596.12,
  casNumber: "14638-18-7",
  color: "rangsiz (colorless)",
  stability: "Yuqori barqarorlik (log β₃ = 17.6, xelat effekti)",
  lambdaMax: 265,
  logBeta: 17.6,
  stox: "1:3",
  molarAbsorptivity: 2800,
  isosbesticPoints: "240, 265 nm",
  jobMethod: "xL = 0.75 → 1:3 (ML₃)",
  
  wernerInfo: {
    wernerGroup: "1:3 elektrolit guruhi",
    electrolyteType: "1:3 elektrolit",
    ions: 4,
    lm: 435,
    formula_verner: "[Zn(phen)₃]²⁺ + 2Cl⁻",
    wernerProof: "Werner va keyingi kimyogarlar konduktometrik o'lchashlar orqali 3 ta phen ligandning ichki sferada ekanligini isbotladi. 2 ta Cl⁻ tashqi sferada."
  },

  historicalFact: {
    title: "Rangsiz fenantrolin kompleksi — d¹⁰ metall",
    text: "[Zn(phen)₃]²⁺ — tris(1,10-fenantrolin)rux(II) kompleksi, xelat effektining klassik namunasi. Zn²⁺ (d¹⁰) diamagnit — barcha elektronlar juftlangan, shuning uchun rangsiz kompleks.",
    textExtended: "3 ta phen ligandi 3 ta 5 a'zoli xelat halqa hosil qiladi. Zn²⁺ (d¹⁰) diamagnit — barcha 10 elektron juftlangan (μ = 0 BM). Bu kompleks rangsiz, chunki d-d o'tish mumkin emas (d¹⁰ da bo'sh d-orbital yo'q). Faqat MLCT (metal-to-ligand charge transfer) o'tish UV sohasida kuzatiladi (λmax = 265 nm). log β₃ = 17.6 — yuqori barqarorlik, xelat effekti tufayli. Bu kompleks [Zn(H₂O)₆]²⁺ dan 10¹⁰ marta barqaror."
  },

  interestingFacts: [
    {
      title: "Rangsiz kompleks — d¹⁰ metall",
      fact: "[Zn(phen)₃]²⁺ rangsiz — Zn²⁺ (d¹⁰) diamagnit, d-d o'tish mumkin emas (bo'sh d-orbital yo'q). Faqat MLCT o'tish UV sohasida kuzatiladi."
    },
    {
      title: "Xelat effekti — 10¹⁰ marta barqarorlik",
      fact: "[Zn(phen)₃]²⁺ (log β₃ = 17.6) [Zn(H₂O)₆]²⁺ dan 10¹⁰ marta barqaror. Sababi: entropiya ortishi — 3 ta bidentat ligand 6 ta monodentat ligand o'rnini egallaydi."
    },
    {
      title: "MLCT o'tish — UV sohasi",
      fact: "λmax = 265 nm, ε = 2800 M⁻¹cm⁻¹. Bu metal-to-ligand charge transfer (MLCT) o'tish natijasida yuzaga keladi. UV sohasida yutiladi."
    },
    {
      title: "Diamagnit kompleks",
      fact: "Zn²⁺ (d¹⁰) diamagnit — barcha 10 elektron juftlangan (μ = 0 BM). Bu NMR spektroskopiya uchun mos."
    },
    {
      title: "Job metodi (uzluksiz variatsiyalar)",
      fact: "Job metodi yordamida stoxiometriya aniqlangan. xL = 0.75 da maksimum — bu 1:3 stoxiometriyani ko'rsatadi."
    },
    {
      title: "5 a'zoli xelat halqasi",
      fact: "Phen ligandi Zn²⁺ bilan 5 a'zoli halqa (Zn-N-C-C-N) hosil qiladi. Bu eng barqaror halqa o'lchami (5 yoki 6 a'zoli)."
    }
  ],

  conductometricFeature: {
    title: "[Zn(phen)₃]²⁺ — 1:3 elektrolit, log β₃ = 17.6",
    description: "Bu kompleks spektrofotometrik titrlashda klassik namuna hisoblanadi. 3 ta phen ichki sferada — Zn²⁺ ga bog'langan. 2 ta Cl⁻ tashqi sferada.",
    reaction: {
      dissociation: "[Zn(phen)₃]²⁺ ⇌ Zn²⁺ + 3phen",
      ions: "Zn²⁺ + 3phen",
      electrolyteType: "1:3 elektrolit",
      lm_theoretical: "log β₃ = 17.6 (25°C)"
    },
    problem: {
      title: "Xelat effekti — juda yuqori barqarorlik",
      description: "log β₃ = 17.6 — juda yuqori barqarorlik. Kompleks juda barqaror va sekin parchalanadi.",
      impact: "Bu titrlash uchun qulay — kompleks barqaror. Lekin o'lchashlar aniq bajarilishi kerak."
    },
    solution: {
      title: "Job metodi va Benesi-Hildebrand",
      description: "Job metodi yordamida stoxiometriya aniqlanadi. Benesi-Hildebrand metodi yordamida β₃ hisoblanadi.",
      mechanism: "1/(A-A₀) vs 1/[phen] grafigi chiziqli bo'lsa, β₃ hisoblanadi."
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
    Zn:  { mass: 65.38,   percent: 10.99, source: "Zn²⁺ markaziy atom (ichki sfera)", conductSignal: "[Zn(phen)₃]²⁺ kationi — o'tkazuvchanlikka hissa qo'shadi" },
    C:   { mass: 432.396, percent: 72.53, source: "3×phen (36×C, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" },
    H:   { mass: 24.192,  percent: 4.06,  source: "3×phen (24×H, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" },
    N:   { mass: 84.042,  percent: 14.10, source: "3×phen (6×N, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" }
  },

  // Spektral ma'lumotlar — to'lqin uzunligi vs absorbsiya
  spectralData: [
    { wavelength: 200, absorbance: 0.50, event: "UV sohasi (chuqur UV)", theoryNote: "Chuqur UV sohasi — MLCT o'tish boshlanadi" },
    { wavelength: 220, absorbance: 1.20, event: "UV sohasi", theoryNote: "MLCT o'tish — yutilish ortadi" },
    { wavelength: 240, absorbance: 2.00, event: "Izosbestik nuqta", theoryNote: "Izosbestik nuqta — muvozanat ko'rsatkichi" },
    { wavelength: 265, absorbance: 2.80, event: "λmax — maksimal yutilish", theoryNote: "Maksimal yutilish — MLCT o'tish" },
    { wavelength: 280, absorbance: 2.20, event: "UV sohasi", theoryNote: "Yutilish kamayadi" },
    { wavelength: 300, absorbance: 1.50, event: "UV sohasi", theoryNote: "Past yutilish" },
    { wavelength: 350, absorbance: 0.80, event: "UV-Vis chegarasi", theoryNote: "Past yutilish" },
    { wavelength: 400, absorbance: 0.20, event: "Ko'k soha", theoryNote: "Juda past yutilish — rangsiz" },
    { wavelength: 500, absorbance: 0.05, event: "Yashil soha", theoryNote: "Juda past yutilish" },
    { wavelength: 600, absorbance: 0.02, event: "Sariq soha", theoryNote: "Juda past yutilish" },
    { wavelength: 700, absorbance: 0.01, event: "Qizil soha", theoryNote: "Juda past yutilish" },
    { wavelength: 750, absorbance: 0.005, event: "Infraqizil soha", theoryNote: "Juda past yutilish" }
  ],

  // Job metodi ma'lumotlari
  jobMethodData: [
    { xL: 0.0, absorbance: 0.0, corrected: 0.0, event: "Faqat Zn²⁺", theoryNote: "Faqat metall ioni — kompleks yo'q" },
    { xL: 0.1, absorbance: 0.15, corrected: 0.15, event: "Kam ligand", theoryNote: "Kam kompleks hosil bo'ladi" },
    { xL: 0.2, absorbance: 0.35, corrected: 0.35, event: "Kam ligand", theoryNote: "Kompleks hosil bo'lishi boshlanadi" },
    { xL: 0.3, absorbance: 0.55, corrected: 0.55, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.4, absorbance: 0.75, corrected: 0.75, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.5, absorbance: 0.95, corrected: 0.95, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.6, absorbance: 1.10, corrected: 1.10, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.7, absorbance: 1.20, corrected: 1.20, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.75, absorbance: 1.25, corrected: 1.25, event: "1:3 stoxiometriya — MAKSIMUM", theoryNote: "MAKSIMUM — 1:3 stoxiometriya (ML₃)" },
    { xL: 0.8, absorbance: 1.20, corrected: 1.20, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 0.9, absorbance: 1.00, corrected: 1.00, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 1.0, absorbance: 0.70, corrected: 0.70, event: "Faqat phen", theoryNote: "Faqat ligand — kompleks yo'q" }
  ],

  // Bosqichli konstantalar
  stepwiseConstants: [
    { step: 1, reaction: "Zn²⁺ + phen ⇌ [Zn(phen)]²⁺", logK: 6.5, K: "3.16×10⁶", species: "[Zn(phen)]²⁺", color: "rangsiz" },
    { step: 2, reaction: "[Zn(phen)]²⁺ + phen ⇌ [Zn(phen)₂]²⁺", logK: 5.8, K: "6.31×10⁵", species: "[Zn(phen)₂]²⁺", color: "rangsiz" },
    { step: 3, reaction: "[Zn(phen)₂]²⁺ + phen ⇌ [Zn(phen)₃]²⁺", logK: 5.3, K: "2.00×10⁵", species: "[Zn(phen)₃]²⁺", color: "rangsiz" }
  ],

  conductometricData: [
    { conc: 0.0001, lm: 445, kappa: 0.00445, event: "Juda suyultirilgan", theoryNote: "Cheksiz suyultirishga yaqin — Λm° ga yaqin" },
    { conc: 0.0005, lm: 440, kappa: 0.0220, event: "Juda suyultirilgan", theoryNote: "Λm hali ham Λm° ga yaqin" },
    { conc: 0.001, lm: 435, kappa: 0.0435, event: "Standart konsentratsiya", theoryNote: "Standart konsentratsiya (10⁻³ M) — Λm ≈ 435 S·cm²/mol" },
    { conc: 0.005, lm: 420, kappa: 0.210, event: "O'rta konsentratsiya", theoryNote: "Λm kamayadi — ion-ion o'zaro ta'siri" },
    { conc: 0.01, lm: 405, kappa: 0.405, event: "O'rta konsentratsiya", theoryNote: "Ion-ion o'zaro ta'siri kuchayadi" },
    { conc: 0.05, lm: 380, kappa: 1.90, event: "Yuqori konsentratsiya", theoryNote: "Ion atmosferasi kuchli — Λm sezilarli kamayadi" },
    { conc: 0.1, lm: 360, kappa: 3.60, event: "Yuqori konsentratsiya", theoryNote: "Ion juftlari hosil bo'ladi" },
    { conc: 0.5, lm: 330, kappa: 16.5, event: "Juda yuqori konsentratsiya", theoryNote: "Kuchli ion-ion o'zaro ta'siri" },
    { conc: 1.0, lm: 305, kappa: 30.5, event: "Juda yuqori konsentratsiya", theoryNote: "Λm sezilarli kamaydi — ion juftlari ko'p" }
  ],

  solventData: [
    { solvent: "Suv (H₂O)", dielectric: 78.5, lm: 435, kappa: 0.0435, color: "rangsiz", note: "Standart erituvchi — eng yuqori o'tkazuvchanlik" },
    { solvent: "Metanol (CH₃OH)", dielectric: 32.7, lm: 380, kappa: 0.0380, color: "rangsiz", note: "Kamroq dielektrik — kamroq dissotsiatsiya" },
    { solvent: "Etanol (C₂H₅OH)", dielectric: 24.3, lm: 320, kappa: 0.0320, color: "rangsiz", note: "Yanada kamroq dielektrik" },
    { solvent: "DMF (Dimetilformamid)", dielectric: 36.7, lm: 355, kappa: 0.0355, color: "rangsiz", note: "Qutbli organik erituvchi" },
    { solvent: "CH₃CN (Asetonitril)", dielectric: 37.5, lm: 365, kappa: 0.0365, color: "rangsiz", note: "Qutbli organik erituvchi" },
    { solvent: "Aseton ((CH₃)₂CO)", dielectric: 20.7, lm: 280, kappa: 0.0280, color: "rangsiz", note: "Kam qutbli — kam dissotsiatsiya" }
  ],

  temperatureData: [
    { temp: 15, lm: 415, kappa: 0.0415, note: "Past temperatura — kamroq o'tkazuvchanlik" },
    { temp: 20, lm: 425, kappa: 0.0425, note: "Xona temperaturasi" },
    { temp: 25, lm: 435, kappa: 0.0435, note: "Standart temperatura (25°C)" },
    { temp: 30, lm: 445, kappa: 0.0445, note: "Yuqori temperatura — ko'proq o'tkazuvchanlik" },
    { temp: 40, lm: 465, kappa: 0.0465, note: "Yuqori temperatura" },
    { temp: 50, lm: 485, kappa: 0.0485, note: "Juda yuqori temperatura" }
  ],

  wernerComparison: [
    { complex: "[Zn(phen)₃]²⁺", formula: "Zn²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "rangsiz", colorCode: "text-gray-400" },
    { complex: "[Cu(en)₂]²⁺", formula: "Cu²⁺ + 2en", ions: 3, lm: 270, type: "1:2", color: "ko'k", colorCode: "text-blue-400" },
    { complex: "[Ag(NH₃)₂]⁺", formula: "Ag⁺ + 2NH₃", ions: 3, lm: 270, type: "1:2", color: "rangsiz", colorCode: "text-gray-400" },
    { complex: "[Fe(CN)₆]⁴⁻", formula: "Fe²⁺ + 6CN⁻", ions: 5, lm: 540, type: "4:1", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Co(NH₃)₆]³⁺", formula: "Co³⁺ + 6NH₃", ions: 4, lm: 432, type: "1:3", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Cu(phen)₃]²⁺", formula: "Cu²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Fe(phen)₃]²⁺", formula: "Fe²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Fe(SCN)]²⁺", formula: "Fe³⁺ + SCN⁻", ions: 2, lm: 250, type: "1:1", color: "qon qizil", colorCode: "text-red-400" },
    { complex: "[Cu(NH₃)₄]²⁺", formula: "Cu²⁺ + 4NH₃", ions: 5, lm: 340, type: "1:4", color: "to'q ko'k", colorCode: "text-blue-400" },
    { complex: "[Ni(en)₃]²⁺", formula: "Ni²⁺ + 3en", ions: 4, lm: 435, type: "1:3", color: "binafsha", colorCode: "text-pink-400" },
    { complex: "[Fe(acac)₃]", formula: "Fe³⁺ + 3acac", ions: 4, lm: 435, type: "1:3", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Cu(salen)]", formula: "Cu²⁺ + salen", ions: 2, lm: 250, type: "1:1", color: "yashil", colorCode: "text-green-400" }
  ],

  experimentalRuns: [
    { 
      id: "SPEC-24-001", 
      date: "2026-10-15", 
      concentration: 0.001, 
      absorbance: 2.80, 
      lambdaMax: 265, 
      ions: 4, 
      type: "1:3 elektrolit",
      note: "Toza [Zn(phen)₃]²⁺ — standart sharoit",
      theoryNote: "Standart sharoitda A = 2.80, λmax = 265 nm. Bu [Zn(phen)₃]²⁺ ning rangsizligini ko'rsatadi (MLCT UV sohasida)."
    },
    { 
      id: "SPEC-24-002", 
      date: "2026-10-15", 
      concentration: 0.001, 
      absorbance: 2.82, 
      lambdaMax: 265, 
      ions: 4, 
      type: "1:3 elektrolit",
      note: "Ikkinchi o'lchash — takrorlanish",
      theoryNote: "Takrorlanish — natijalar bir xil (A ≈ 2.82)."
    },
    { 
      id: "SPEC-24-003", 
      date: "2026-10-16", 
      concentration: 0.0005, 
      absorbance: 1.40, 
      lambdaMax: 265, 
      ions: 4, 
      type: "1:3 elektrolit",
      note: "Past konsentratsiya (5×10⁻⁴ M)",
      theoryNote: "Beer-Lambert qonuni: A konsentratsiyaga proporsional. A ≈ 1.40."
    },
    { 
      id: "SPEC-24-004", 
      date: "2026-10-16", 
      concentration: 0.002, 
      absorbance: 5.60, 
      lambdaMax: 265, 
      ions: 4, 
      type: "1:3 elektrolit",
      note: "Yuqori konsentratsiya (2×10⁻³ M)",
      theoryNote: "A ≈ 5.60 — Beer-Lambert qonuni bajariladi."
    },
    { 
      id: "SPEC-24-005", 
      date: "2026-10-17", 
      concentration: 0.001, 
      absorbance: 2.80, 
      lambdaMax: 265, 
      ions: 4, 
      type: "1:3 elektrolit",
      note: "Job metodi — xL = 0.75 da maksimum",
      theoryNote: "Job metodi: xL = 0.75 da maksimum — bu 1:3 stoxiometriyani ko'rsatadi."
    },
    { 
      id: "SPEC-24-006", 
      date: "2026-10-17", 
      concentration: 0.001, 
      absorbance: 2.80, 
      lambdaMax: 265, 
      ions: 4, 
      type: "1:3 elektrolit",
      note: "Izosbestik nuqtalar: 240, 265 nm",
      theoryNote: "Izosbestik nuqtalar — 240, 265 nm. Bu muvozanat ko'rsatkichi."
    }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Zn(phen)₃]²⁺ zaharli, Zn²⁺ va phen zaharli. Qo'lqop, himoya ko'zoynaklari va laboratoriya xalati majburiy. Ventilyatsiya zarur! phen (1,10-fenantrolin) zaharli — teri va ko'zga zarar yetkazadi.", time: "doimiy", critical: true, theory: "Zn²⁺ ionlari teri va ko'zga zarar yetkazadi. phen (1,10-fenantrolin) zaharli — teri va ko'zga zarar yetkazadi." },
    { step: 2, title: "Kerakli asboblar", desc: "Analitik tarozi (0.1 mg aniqlik), 100 mL o'lchov kolbasi, spektrofotometr (UV-Vis), kyuvetalar (1 sm yo'l uzunligi), pipetka, deionizatsiyalangan suv, ZnSO₄ eritmasi (0.001 M), phen eritmasi (0.003 M).", time: "5 daq", critical: true, theory: "Spektrofotometr 200-400 nm diapazonida ishlashi kerak (UV sohasi). Kyuvetalar toza bo'lishi shart. Zn²⁺ va phen eritmalari aniq konsentratsiyada bo'lishi kerak." },
    { step: 3, title: "Zn²⁺ eritmasini tayyorlash", desc: "Analitik tarozida ZnSO₄·7H₂O (28.75 mg) tortilib, 100 mL deionizatsiyalangan suvda eritiladi. 10⁻³ M eritma tayyorlanadi.", time: "10 daq", critical: true, theory: "ZnSO₄·7H₂O ning molyar massasi 287.54 g/mol. 10⁻³ M eritma uchun 28.75 mg kerak." },
    { step: 4, title: "phen eritmasini tayyorlash", desc: "phen eritmasi (0.003 M) tayyorlanadi. Bu ligand eritmasi. 0.003 M phen uchun 59.47 mg phen 100 mL suvda eritiladi.", time: "5 daq", critical: true, theory: "phen ning molyar massasi 198.22 g/mol. 0.003 M eritma uchun 59.47 mg kerak. phen ligand eritmasi konsentratsiyasi aniq bo'lishi kerak." },
    { step: 5, title: "Job metodi uchun eritmalarni tayyorlash", desc: "10 ta eritma tayyorlanadi: [Zn²⁺] + [phen] = const = 10⁻³ M. xL = 0 dan 1 gacha o'zgartiriladi. Har bir eritma uchun 10 mL.", time: "15 daq", critical: true, theory: "Job metodi: umumiy konsentratsiya o'zgarmas. xL = [phen] / ([Zn²⁺] + [phen]). xL = 0.75 da maksimum bo'lishi kerak." },
    { step: 6, title: "Spektrofotometrik o'lchash", desc: "Har bir eritmaning UB-Vis spektri qayd etiladi (200-400 nm). λmax = 265 nm da absorbsiya o'lchanadi. Kyuvetalar toza bo'lishi shart.", time: "20 daq", critical: false, theory: "λmax = 265 nm — bu [Zn(phen)₃]²⁺ ning maksimal yutilish to'lqin uzunligi. ε = 2800 M⁻¹cm⁻¹ — o'rta sezgirlik (MLCT o'tish)." },
    { step: 7, title: "Job grafigini qurish", desc: "A·(1-xL) vs xL grafigi quriladi. Maksimum xL = 0.75 da — bu 1:3 stoxiometriyani ko'rsatadi.", time: "10 daq", critical: false, theory: "Job metodi: A·(1-xL) vs xL grafigi maksimumi xL = n/(n+m) da bo'ladi. 1:3 stoxiometriya uchun xL = 0.75." },
    { step: 8, title: "β₃ hisoblash (Benesi-Hildebrand)", desc: "Benesi-Hildebrand metodi yordamida β₃ hisoblanadi. 1/(A-A₀) vs 1/[phen] grafigi quriladi. log β₃ = 17.6.", time: "5 daq", critical: false, theory: "Benesi-Hildebrand: 1/(A-A₀) = 1/(ε·[Zn²⁺]·β₃) + 1/(ε·[Zn²⁺]·β₃·[phen]). Chiziqli grafik β₃ ni aniqlash imkonini beradi." },
    { step: 9, title: "Natijalarni tahlil qilish", desc: "3 ta o'lchashning o'rtacha qiymati hisoblanadi. RSD < 2% bo'lishi kerak. Beer-Lambert qonuni bajarilishi tekshiriladi.", time: "5 daq", critical: false, theory: "RSD (nisbiy standart chetlanish) < 2% bo'lishi kerak. Bu o'lchashlarning aniqligini ko'rsatadi. Beer-Lambert qonuni: A = ε·l·c." },
    { step: 10, title: "Tozalash va saqlash", desc: "Kyuvetalar distillangan suv bilan yuviladi. Eritma saqlanadi (qorong'i, 4°C). Natijalar hujjatlashtiriladi. Chiqindilar maxsus idishga yig'iladi (phen zaharli).", time: "5 daq", critical: false, theory: "Eritma qorong'ida saqlanishi kerak — yorug'lik ta'sirida parchalanishi mumkin. phen zaharli bo'lgani uchun chiqindilar maxsus idishga yig'ilishi kerak." }
  ],

  relatedMethods: [
    {
      name: "UV-Vis spektroskopiya",
      role: "Spektrlarni qayd etish va tahlil qilish",
      condAdvantage: "Tez va aniq spektral ma'lumotlar, ε = 2800 M⁻¹cm⁻¹ — o'rta sezgirlik",
      condDisadvantage: "Faqat yutuvchi moddalar uchun",
      complementarity: "100%"
    },
    {
      name: "Potentsiometrik titrlash",
      role: "Potensial o'zgarishini o'lchash",
      condAdvantage: "Rangsiz eritmalar uchun",
      condDisadvantage: "Ion-selektiv elektrod kerak",
      complementarity: "85%"
    },
    {
      name: "Kalorimetrik titrlash",
      role: "Issiqlik o'zgarishini o'lchash (ΔH)",
      condAdvantage: "Termodinamik parametrlar (ΔH, ΔS)",
      condDisadvantage: "Qimmat uskunalar",
      complementarity: "80%"
    },
    {
      name: "NMR spektroskopiya",
      role: "Yadro magnit rezonansi",
      condAdvantage: "Strukturaviy ma'lumotlar (diamagnit)",
      condDisadvantage: "Diamagnit moddalar uchun (Zn²⁺ diamagnit)",
      complementarity: "95%"
    },
    {
      name: "EPR spektroskopiya",
      role: "Elektron paramagnit rezonans",
      condAdvantage: "Paramagnit moddalar uchun",
      condDisadvantage: "Faqat paramagnit moddalar (Zn²⁺ diamagnit)",
      complementarity: "60%"
    },
    {
      name: "EXAFS spektroskopiya",
      role: "Kengaytirilgan rentgen nurlari yutilish nozik tuzilishi",
      condAdvantage: "Mahalliy strukturani aniqlash (Zn-N masofalari)",
      condDisadvantage: "Sinxrotron nurlari kerak",
      complementarity: "85%"
    }
  ]
}

export default function ZnPhen3SpectrophotometricPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeRun, setActiveRun] = useState("SPEC-24-001")
  const [activeWerner, setActiveWerner] = useState(0)
  const [concSlider, setConcSlider] = useState(0.001)
  const [tempSlider, setTempSlider] = useState(25)
  const [solventSlider, setSolventSlider] = useState(0)
  const [wavelengthSlider, setWavelengthSlider] = useState(265)
  const [jobSlider, setJobSlider] = useState(0.75)
  
  const [metalConc, setMetalConc] = useState(0.001)
  const [ligandConc, setLigandConc] = useState(0.003)
  
  const [betaValue, setBetaValue] = useState(17.6)
  const [metalConcBeta, setMetalConcBeta] = useState(0.001)
  const [ligandConcBeta, setLigandConcBeta] = useState(0.003)
  
  const [absorbance, setAbsorbance] = useState(2.80)
  const [ligandConcBH, setLigandConcBH] = useState(0.01)

  const jobResult = useMemo(() => {
    const xL = ligandConc / (metalConc + ligandConc)
    let stox = "Noma'lum"
    if (Math.abs(xL - 0.5) < 0.05) stox = "1:1 (ML)"
    else if (Math.abs(xL - 0.67) < 0.05) stox = "1:2 (ML₂)"
    else if (Math.abs(xL - 0.75) < 0.05) stox = "1:3 (ML₃)"
    else if (Math.abs(xL - 0.80) < 0.05) stox = "1:4 (ML₄)"
    return { xL: xL.toFixed(3), stox }
  }, [metalConc, ligandConc])

  const betaResult = useMemo(() => {
    const deltaG = -8.314 * 298 * Math.log(Math.pow(10, betaValue)) / 1000
    return { deltaG: deltaG.toFixed(2) }
  }, [betaValue])

  const bhResult = useMemo(() => {
    const invAbs = 1 / absorbance
    const invLigand = 1 / ligandConcBH
    return { invAbs: invAbs.toFixed(3), invLigand: invLigand.toFixed(3) }
  }, [absorbance, ligandConcBH])

  const currentSpectral = useMemo(() => {
    const data = COMPOUND.spectralData
    for (let i = 0; i < data.length - 1; i++) {
      if (wavelengthSlider >= data[i].wavelength && wavelengthSlider < data[i+1].wavelength) {
        const w1 = data[i].wavelength
        const w2 = data[i+1].wavelength
        const a1 = data[i].absorbance
        const a2 = data[i+1].absorbance
        const abs = a1 + (a2 - a1) * ((wavelengthSlider - w1) / (w2 - w1))
        return { wavelength: wavelengthSlider, absorbance: abs, event: data[i].event, theoryNote: data[i].theoryNote }
      }
    }
    return data[data.length - 1]
  }, [wavelengthSlider])

  const currentJob = useMemo(() => {
    const data = COMPOUND.jobMethodData
    for (let i = 0; i < data.length - 1; i++) {
      if (jobSlider >= data[i].xL && jobSlider < data[i+1].xL) {
        const x1 = data[i].xL
        const x2 = data[i+1].xL
        const a1 = data[i].absorbance
        const a2 = data[i+1].absorbance
        const abs = a1 + (a2 - a1) * ((jobSlider - x1) / (x2 - x1))
        return { xL: jobSlider, absorbance: abs, event: data[i].event, theoryNote: data[i].theoryNote }
      }
    }
    return data[data.length - 1]
  }, [jobSlider])

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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-gray-950/20 to-blue-950 text-white">
      
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-gray-950 to-purple-950 border-2 border-gray-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-gray-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">📊</span> TRIS(1,10-FENANTROLIN)RUX(II) — RANGSIZ KOMPLEKS!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-gray-300">[Zn(phen)₃]²⁺</strong> — tris(1,10-fenantrolin)rux(II), xelat effektining klassik namunasi. 
              Rangsiz, λmax = 265 nm, log β₃ = 17.6.
            </p>
            
            <div className="bg-gray-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-gray-400 font-bold mb-2">📊 Nima o'lchanadi?</div>
                  <div className="text-purple-200">
                    <strong>Barqarorlik konstantasi (β₃)</strong> — log β₃ = 17.6.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Stoxiometriya</strong> — 1:3 (ML₃).
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 font-bold mb-2">🔬 Qanday ishlaydi?</div>
                  <div className="text-purple-200">
                    <strong>Job metodi</strong> — xL = 0.75 da maksimum.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Izosbestik nuqtalar</strong> — 240, 265 nm.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-gray-300">Rangsiz kompleks:</strong> Zn²⁺ (d¹⁰) diamagnit — barcha elektronlar juftlangan. 
                d-d o'tish mumkin emas (bo'sh d-orbital yo'q). Faqat MLCT o'tish UV sohasida.
              </p>
            </div>

            <div className="bg-gray-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-gray-300">MLCT o'tish:</strong> λmax = 265 nm, ε = 2800 M⁻¹cm⁻¹. 
                Bu metal-to-ligand charge transfer o'tish natijasida yuzaga keladi.
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <Link href="/ilmiy/tahlil/titrlash" className="hover:text-purple-300">Spektrofotometrik titrlash</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/titrlash/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-gray-400 font-semibold">[Zn(phen)₃]²⁺</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">📊 Spektrofotometrik titrlash</span>
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
                  <span className="px-2 py-1 rounded bg-gray-900/30 border border-gray-700/50 text-gray-400 text-[10px] uppercase tracking-wide">1:3 elektrolit</span>
                  <span className="px-2 py-1 rounded bg-gray-900/30 border border-gray-700/50 text-gray-400 text-[10px] uppercase tracking-wide">log β₃ = 17.6</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">λmax = 265 nm</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">ε = 2800</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/titrlash/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Barcha birikmalar
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-gray-600 hover:bg-gray-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-gray-900/40 to-purple-900/40 border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Birikma haqida (spektrofotometrik titrlash uchun)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Zn(phen)₃]²⁺</strong> — tris(1,10-fenantrolin)rux(II), xelat effektining klassik namunasi. Spektrofotometrik titrlashda <strong className="text-gray-300">1:3 elektrolit</strong> — 4 ta ion borligini ko'rsatadi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-gray-500 text-xs md:text-sm">
                <li><strong className="text-white">Zn²⁺ (d¹⁰)</strong> — diamagnit (barcha elektronlar juftlangan)</li>
                <li><strong className="text-white">3 ta phen</strong> ichki sferada (Zn²⁺ ga bog'langan)</li>
                <li><strong className="text-gray-300">log β₃ = 17.6</strong> — yuqori barqarorlik (xelat effekti)</li>
                <li><strong className="text-gray-300">λmax = 265 nm</strong> — rangsiz (MLCT o'tish)</li>
                <li><strong className="text-gray-300">ε = 2800 M⁻¹cm⁻¹</strong> — o'rta sezgirlik (MLCT o'tish)</li>
                <li><strong className="text-gray-300">Izosbestik nuqtalar</strong> — 240, 265 nm</li>
                <li><strong className="text-gray-300">Job metodi</strong> — xL = 0.75 → 1:3</li>
                <li><strong className="text-gray-300">Diamagnit</strong> — μ = 0 BM</li>
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
            </div>
          </div>
        </div>

        {/* QIZIQARLI FAKTLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">💡 Qiziqarli faktlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.interestingFacts.map((fact, i) => (
              <div key={i} className="bg-gray-900/20 border border-gray-500/30 rounded-xl p-4">
                <h3 className="text-gray-400 font-bold text-sm mb-2">{fact.title}</h3>
                <p className="text-purple-200 text-xs">{fact.fact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. BARQARORLIK KONSTANTASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📐</span> Barqarorlik konstantasi (β₃) — kompleks mustahkamligi
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            <strong className="text-gray-400">Umumiy barqarorlik konstantasi (β₃)</strong> — Zn²⁺ ioniga 
            3 ta phen ligand birikishi natijasida hosil bo'lgan kompleksning termodinamik barqarorligini ifodalaydi.
            log β₃ = 17.6 — bu yuqori barqarorlikni ko'rsatadi, xelat effekti tufayli.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-gray-400 font-bold mb-3">Bosqichli konstantalar:</h3>
            <div className="space-y-3 text-sm text-purple-200">
              {COMPOUND.stepwiseConstants.map((step) => (
                <div key={step.step} className="bg-gray-600/10 border border-gray-500/30 rounded-lg p-3">
                  <p className="font-mono">{step.reaction} &nbsp;&nbsp;&nbsp; log K{step.step} = {step.logK}</p>
                  <p className="text-xs text-purple-400 mt-1">{step.step}-bosqich konstantasi — {step.species} ({step.color})</p>
                </div>
              ))}
              <div className="bg-gray-600/10 border border-gray-500/30 rounded-lg p-3">
                <p className="font-mono">β₃ = K₁ · K₂ · K₃ = 10^17.6</p>
                <p className="text-xs text-purple-400 mt-1">Umumiy barqarorlik konstantasi — yuqori barqarorlik</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SPEKTRAL GRAFIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Spektral grafik — to'lqin uzunligi vs absorbsiya</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-gray-400">Spektral grafik</strong> — to'lqin uzunligi (λ) vs absorbsiya (A). 
            λmax = 265 nm da maksimal yutilish kuzatiladi. Slayderni harakatlantirib, to'lqin uzunligini o'zgartiring.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-gray-400 font-bold mb-2">
              To'lqin uzunligi: {wavelengthSlider} nm
            </label>
            <input
              type="range"
              min="200"
              max="400"
              value={wavelengthSlider}
              onChange={(e) => setWavelengthSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>200 nm</span>
              <span>265 nm (λmax)</span>
              <span>400 nm</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">To'lqin uzunligi:</div>
                <div className="text-xl font-mono font-bold text-gray-400">{currentSpectral.wavelength} nm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Absorbsiya:</div>
                <div className="text-xl font-mono font-bold text-gray-400">{currentSpectral.absorbance.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-gray-400">{currentSpectral.event}</div>
              </div>
            </div>
            
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Nazariy izoh:
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                {currentSpectral.theoryNote}
              </p>
            </div>
          </div>

          {/* Spektral grafik SVG */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/3.0)*200} x2="580" y2={220 - (v/3.0)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/3.0)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[200, 250, 300, 350, 400].map((w, i) => (
                <g key={i}>
                  <text x={50 + ((w - 200)/200)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{w} nm</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">To'lqin uzunligi (nm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Absorbsiya (A)</text>

              <polyline
                fill="none" 
                stroke="#a1a1aa" 
                strokeWidth="2"
                points={COMPOUND.spectralData.map(p => {
                  const x = 50 + ((p.wavelength - 200)/200)*530
                  const y = 220 - (p.absorbance/3.0)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              <line 
                x1={50 + ((265 - 200)/200)*530} 
                y1="30" 
                x2={50 + ((265 - 200)/200)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <text x={50 + ((265 - 200)/200)*530} y="25" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">λmax = 265 nm</text>

              <line 
                x1={50 + ((currentSpectral.wavelength - 200)/200)*530} 
                y1="30" 
                x2={50 + ((currentSpectral.wavelength - 200)/200)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <circle 
                cx={50 + ((currentSpectral.wavelength - 200)/200)*530} 
                cy={220 - (currentSpectral.absorbance/3.0)*200} 
                r="6" 
                fill="#fbbf24" 
                stroke="#fff" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* 4. JOB METODI GRAFIKI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Job metodi grafigi — uzluksiz variatsiyalar</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-gray-400">Job metodi</strong> — xL (ligand mol ulushi) vs A·(1-xL). 
            Maksimum xL = 0.75 da — bu 1:3 stoxiometriyani ko'rsatadi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-gray-400 font-bold mb-2">
              Ligand mol ulushi (xL): {jobSlider.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={jobSlider}
              onChange={(e) => setJobSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>0.0 (faqat Zn²⁺)</span>
              <span>0.75 (MAKSIMUM)</span>
              <span>1.0 (faqat phen)</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">xL:</div>
                <div className="text-xl font-mono font-bold text-gray-400">{currentJob.xL.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">A·(1-xL):</div>
                <div className="text-xl font-mono font-bold text-gray-400">{(currentJob.absorbance * (1 - currentJob.xL)).toFixed(3)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-gray-400">{currentJob.event}</div>
              </div>
            </div>
            
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Nazariy izoh:
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                {currentJob.theoryNote}
              </p>
            </div>
          </div>

          {/* Job metodi grafigi SVG */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.4)*200} x2="580" y2={220 - (v/1.4)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.4)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((x, i) => (
                <g key={i}>
                  <text x={50 + (x)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{x.toFixed(1)}</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">xL (ligand mol ulushi)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">A·(1-xL)</text>

              <polyline
                fill="none" 
                stroke="#a1a1aa" 
                strokeWidth="2"
                points={COMPOUND.jobMethodData.map(p => {
                  const x = 50 + (p.xL)*530
                  const y = 220 - ((p.absorbance * (1 - p.xL))/1.4)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              <line 
                x1={50 + (0.75)*530} 
                y1="30" 
                x2={50 + (0.75)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <text x={50 + (0.75)*530} y="25" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">xL = 0.75 → 1:3</text>

              <line 
                x1={50 + (currentJob.xL)*530} 
                y1="30" 
                x2={50 + (currentJob.xL)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <circle 
                cx={50 + (currentJob.xL)*530} 
                cy={220 - ((currentJob.absorbance * (1 - currentJob.xL))/1.4)*200} 
                r="6" 
                fill="#fbbf24" 
                stroke="#fff" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* 5. JOB METODI KALKULYATORI */}
        <div className="bg-gray-900/20 border border-gray-500/30 rounded-2xl p-8">
          <h3 className="text-gray-400 font-bold mb-4 flex items-center gap-2">
            <span>🔬</span> Job metodi kalkulyatori — uzluksiz variatsiyalar
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Metall va ligand konsentratsiyalarini kiriting — <strong className="text-gray-300">stoxiometriya</strong> aniqlanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Zn²⁺] metall konsentratsiyasi (M):</label>
              <input
                type="number"
                step="0.0001"
                value={metalConc}
                onChange={(e) => setMetalConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-gray-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[phen] ligand konsentratsiyasi (M):</label>
              <input
                type="number"
                step="0.0001"
                value={ligandConc}
                onChange={(e) => setLigandConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-gray-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Ligand mol ulushi (xL):</div>
                <div className="text-xl font-mono font-bold text-gray-400">{jobResult.xL}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Stoxiometriya:</div>
                <div className={`text-xl font-mono font-bold ${jobResult.stox.includes("1:3") ? 'text-green-400' : jobResult.stox.includes("1:2") ? 'text-blue-400' : jobResult.stox.includes("1:1") ? 'text-yellow-400' : 'text-yellow-400'}`}>{jobResult.stox}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: xL = [phen] / ([Zn²⁺] + [phen]) = {ligandConc} / ({metalConc} + {ligandConc}) = {jobResult.xL}
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Eslatma:</strong> xL = 0.50 → 1:1, xL = 0.67 → 1:2, xL = 0.75 → 1:3
            </p>
          </div>
        </div>

        {/* 6. βn KALKULYATORI */}
        <div className="bg-gray-900/20 border border-gray-500/30 rounded-2xl p-8">
          <h3 className="text-gray-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Barqarorlik konstantasi kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            log β₃ ni kiriting — <strong className="text-gray-300">ΔG°</strong> hisoblanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">log β₃:</label>
              <input
                type="number"
                step="0.1"
                value={betaValue}
                onChange={(e) => setBetaValue(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-gray-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Zn²⁺] (M):</label>
              <input
                type="number"
                step="0.0001"
                value={metalConcBeta}
                onChange={(e) => setMetalConcBeta(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-gray-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[phen] (M):</label>
              <input
                type="number"
                step="0.0001"
                value={ligandConcBeta}
                onChange={(e) => setLigandConcBeta(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-gray-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">β₃:</div>
                <div className="text-xl font-mono font-bold text-gray-400">{Math.pow(10, betaValue).toExponential(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">ΔG° (kJ/mol):</div>
                <div className="text-xl font-mono font-bold text-gray-400">{betaResult.deltaG}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: ΔG° = −RT·ln(β₃) = −8.314 × 298 × ln(10^{betaValue}) / 1000 = {betaResult.deltaG} kJ/mol
            </p>
          </div>
        </div>

        {/* 7. BENESI-HILDEBRAND KALKULYATORI */}
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-8">
          <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
            <span>📊</span> Benesi-Hildebrand kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Absorbsiya va ligand konsentratsiyasini kiriting — <strong className="text-cyan-300">1/A va 1/[L]</strong> hisoblanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Absorbsiya (A):</label>
              <input
                type="number"
                step="0.01"
                value={absorbance}
                onChange={(e) => setAbsorbance(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[phen] ligand (M):</label>
              <input
                type="number"
                step="0.001"
                value={ligandConcBH}
                onChange={(e) => setLigandConcBH(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">1/A:</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{bhResult.invAbs}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">1/[phen]:</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{bhResult.invLigand}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: 1/(A-A₀) = 1/(ε·[Zn²⁺]·β₃) + 1/(ε·[Zn²⁺]·β₃·[phen])
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Eslatma:</strong> 1/A vs 1/[phen] grafigi chiziqli bo'lsa, β₃ hisoblanadi.
            </p>
          </div>
        </div>

        {/* 8. IZOSBESTIK NUQTALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Izosbestik nuqtalar — muvozanat ko'rsatkichi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-gray-400">Izosbestik nuqta</strong> — turli konsentratsiyalarda 
            olingan spektrlarning <strong>kesishgan nuqtasi</strong>. [Zn(phen)₃]²⁺ uchun izosbestik nuqtalar: 240, 265 nm.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Bitta izosbestik nuqta</h3>
              <p className="text-purple-200 text-sm">
                Faqat <strong>erkin ligand va kompleks</strong> muvozanatda.
              </p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">Bir nechta izosbestik nuqta</h3>
              <p className="text-purple-200 text-sm">
                <strong>[Zn(phen)]²⁺, [Zn(phen)₂]²⁺, [Zn(phen)₃]²⁺</strong> — bir nechta kompleks shakllari muvozanatda.
              </p>
            </div>
          </div>
        </div>

        {/* 9. LABORATORIYA 0 DAN BAJARISH TARTIBI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Laboratoriyada 0 dan bajarish tartibi (nazariy asoslangan)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.samplePrepSteps.map((step) => (
              <div
                key={step.step}
                onClick={() => setActiveStep(step.step)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  activeStep === step.step 
                    ? "bg-gray-900/40 border-2 border-gray-400" 
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-gray-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeStep === step.step ? "bg-gray-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 font-bold">{step.title}</p>
                    {step.critical && (
                      <span className="text-[10px] text-red-400">KRITIK</span>
                    )}
                  </div>
                </div>
                {activeStep === step.step && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-gray-900/20 border border-gray-500/30 rounded-lg p-3 mt-2">
                      <div className="text-gray-400 font-bold text-xs mb-1">📚 Nazariy asos:</div>
                      <p className="text-purple-200 text-xs">{step.theory}</p>
                    </div>
                    <div className="text-[10px] text-yellow-400 mt-2">
                      Vaqt: {step.time}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 10. LABORATORIYA TAHLIL NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Laboratoriya tahlil natijalari (nazariy izohlar bilan)</h2>
          
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
                      ? "bg-gray-600 border-gray-500 text-white shadow-lg shadow-gray-500/20"
                      : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-gray-500"
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
            <div className="text-xs text-purple-400 mt-1">{run.date} • {run.concentration.toExponential(1)} M • λmax = {run.lambdaMax} nm</div>
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-purple-400">Absorbsiya (A):</div>
                <div className="text-xl font-mono font-bold text-gray-400">{run.absorbance}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">λmax (nm):</div>
                <div className="text-xl font-mono font-bold text-gray-400">{run.lambdaMax}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ionlar soni:</div>
                <div className="text-xl font-mono font-bold text-gray-400">{run.ions}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Elektrolit turi:</div>
                <div className="text-xl font-mono font-bold text-gray-400">{run.type}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 11. KENGAYTIRUVCHI METODLAR */}
        <div className="bg-gradient-to-r from-gray-900/40 to-purple-900/40 border border-gray-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Kengaytiruvchi metodlar — spektrofotometrik titrlashga qo'shimcha
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-gray-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-gray-300">{m.name}</h3>
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

          <div className="mt-5 bg-gray-900/20 border border-gray-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-gray-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">Spektrofotometrik titrlash (β₃, stoxiometriya) + UV-Vis (spektrlar) + NMR (diamagnit Zn²⁺) + EXAFS (mahalliy struktura) + Kalorimetriya (ΔH, ΔS)</strong> — besh metod birgalikda [Zn(phen)₃]²⁺ ni to'liq tavsiflaydi.
            </p>
          </div>
        </div>

        {/* XULOSALAR */}
        <div className="bg-gradient-to-r from-gray-600/10 to-purple-600/10 border border-gray-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Spektrofotometrik titrlash — <strong className="text-gray-400">barqarorlik konstantalarini aniqlashning asosiy usuli</strong></li>
            <li>Umumiy barqarorlik konstantasi β₃ — <strong className="text-gray-400">log β₃ = 17.6</strong> (yuqori barqarorlik, xelat effekti)</li>
            <li>Job metodi — <strong className="text-gray-400">xL = 0.75 → 1:3 stoxiometriya</strong></li>
            <li>Izosbestik nuqtalar — <strong className="text-gray-400">240, 265 nm</strong></li>
            <li>MLCT o'tish — <strong className="text-gray-400">λmax = 265 nm, ε = 2800 M⁻¹cm⁻¹</strong></li>
            <li>Diamagnit — <strong className="text-gray-400">μ = 0 BM (barcha elektronlar juftlangan, d¹⁰)</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/titrlash" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Spektrofotometrik titrlash</Link>
          <Link href="/ilmiy/tahlil/titrlash/birikmalar" className="px-6 py-3 bg-gray-600/80 rounded-xl hover:bg-gray-500 text-white font-semibold">Barcha birikmalar →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Zn(phen)₃]²⁺ (Tris(1,10-fenantrolin)rux(II)) • Spektrofotometrik titrlash moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry), Schwarzenbach (1950)</p>
        </div>
      </footer>
    </main>
  )
}