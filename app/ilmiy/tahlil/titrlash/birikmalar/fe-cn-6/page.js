"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Fe(CN)₆]⁴⁻ — SPEKTROFOTOMETRIK TITRLASH MAHSUS SAHIFASI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry)
// Xususiyat: Ferrotsianid, Prussian Blue, Fe²⁺ (d⁶, past spin)
// O'ziga xoslik: log β₆ = 35.4, juda yuqori barqarorlik, Prussian Blue sintezi
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Fe: 55.845, C: 12.011, N: 14.007
}

const COMPOUND = {
  formulaHTML: "[Fe(CN)<sub>6</sub>]<sup>4-</sup>",
  formulaPlain: "[Fe(CN)6]4-",
  iupac: "Geksatsianoferrat(II)",
  formulaExpanded: "FeC₆N₆",
  commonName: "Ferrotsianid (sariq qon tuzi anioni)",
  molarMass: 211.95,
  casNumber: "13943-58-3",
  color: "sariq (yellow)",
  stability: "Juda yuqori barqarorlik (log β₆ = 35.4)",
  lambdaMax: 420,
  logBeta: 35.4,
  stox: "1:6",
  molarAbsorptivity: 1010,
  isosbesticPoints: "380, 420 nm",
  jobMethod: "xL = 0.86 → 1:6 (ML₆)",
  
  wernerInfo: {
    wernerGroup: "1:4 elektrolit guruhi",
    electrolyteType: "4:1 elektrolit",
    ions: 5,
    lm: 540,
    formula_verner: "4K⁺ + [Fe(CN)₆]⁴⁻",
    wernerProof: "Werner va keyingi kimyogarlar konduktometrik o'lchashlar orqali 6 ta CN⁻ ligandning ichki sferada ekanligini isbotladi. 4 ta K⁺ tashqi sferada."
  },

  historicalFact: {
    title: "Ferrotsianid — Prussian Blue sintezi (1704-1822)",
    text: "[Fe(CN)₆]⁴⁻ — ferrotsianid anioni, sariq qon tuzi (K₄[Fe(CN)₆]) ning asosiy komponenti. 1704-yilda Diesbach tasodifan Prussian Blue ni kashf etdi, 1822-yilda Leopold Gmelin ferrotsianidni sintez qildi.",
    textExtended: "Ferrotsianid Prussian Blue (Fe₄[Fe(CN)₆]₃) sintezida ishlatiladi. Fe³⁺ qo'shilganda ko'k cho'kma hosil bo'ladi — bu analitik kimyoda Fe³⁺ ni sifat aniqlashda ishlatiladi. Fe²⁺ (d⁶, past spin) diamagnit — barcha elektronlar juftlangan (μ = 0 BM). log β₆ = 35.4 — juda yuqori barqarorlik. Bu kompleks NMR spektroskopiya uchun mos."
  },

  interestingFacts: [
    {
      title: "Prussian Blue sintezi (1704)",
      fact: "Diesbach 1704-yilda tasodifan Prussian Blue ni kashf etdi. Fe³⁺ + [Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃ (ko'k cho'kma). Bu analitik kimyoda Fe³⁺ ni sifat aniqlashda ishlatiladi."
    },
    {
      title: "Sariq qon tuzi (1822)",
      fact: "Leopold Gmelin 1822-yilda ferrotsianidni sintez qildi. Bu kompleks hayvon qoni va temir tuzlaridan olingan."
    },
    {
      title: "Juda yuqori barqarorlik",
      fact: "log β₆ = 35.4 — juda yuqori barqarorlik. CN⁻ kuchli maydon ligand — Fe²⁺ (d⁶, past spin) diamagnit."
    },
    {
      title: "Diamagnit kompleks",
      fact: "Fe²⁺ (d⁶, past spin) diamagnit — barcha elektronlar juftlangan (μ = 0 BM). Bu NMR spektroskopiya uchun mos."
    },
    {
      title: "LMCT o'tish",
      fact: "λmax = 420 nm, ε = 1010 M⁻¹cm⁻¹. Bu ligand-to-metal charge transfer (LMCT) o'tish natijasida yuzaga keladi."
    },
    {
      title: "Job metodi (uzluksiz variatsiyalar)",
      fact: "Job metodi yordamida stoxiometriya aniqlangan. xL = 0.86 da maksimum — bu 1:6 stoxiometriyani ko'rsatadi."
    }
  ],

  conductometricFeature: {
    title: "[Fe(CN)₆]⁴⁻ — 4:1 elektrolit, log β₆ = 35.4",
    description: "Bu kompleks spektrofotometrik titrlashda klassik namuna hisoblanadi. 6 ta CN⁻ ichki sferada — Fe²⁺ ga bog'langan. 4 ta K⁺ tashqi sferada.",
    reaction: {
      dissociation: "[Fe(CN)₆]⁴⁻ ⇌ Fe²⁺ + 6CN⁻",
      ions: "Fe²⁺ + 6CN⁻",
      electrolyteType: "4:1 elektrolit",
      lm_theoretical: "log β₆ = 35.4 (25°C)"
    },
    problem: {
      title: "Juda yuqori barqarorlik",
      description: "log β₆ = 35.4 — juda yuqori barqarorlik. Kompleks juda barqaror va sekin parchalanadi.",
      impact: "Bu titrlash uchun qulay — kompleks barqaror. Lekin o'lchashlar aniq bajarilishi kerak."
    },
    solution: {
      title: "Job metodi va Benesi-Hildebrand",
      description: "Job metodi yordamida stoxiometriya aniqlanadi. Benesi-Hildebrand metodi yordamida β₆ hisoblanadi.",
      mechanism: "1/(A-A₀) vs 1/[CN⁻] grafigi chiziqli bo'lsa, β₆ hisoblanadi."
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
    Fe:  { mass: 55.845,  percent: 26.35, source: "Fe²⁺ markaziy atom (ichki sfera)", conductSignal: "[Fe(CN)₆]⁴⁻ anioni — o'tkazuvchanlikka hissa qo'shadi" },
    C:   { mass: 72.066,  percent: 34.00, source: "6×CN⁻ (6×C, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" },
    N:   { mass: 84.042,  percent: 39.65, source: "6×CN⁻ (6×N, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" }
  },

  // Spektral ma'lumotlar — to'lqin uzunligi vs absorbsiya
  spectralData: [
    { wavelength: 350, absorbance: 0.15, event: "UV sohasi", theoryNote: "Past yutilish — UV sohasi" },
    { wavelength: 380, absorbance: 0.40, event: "Izosbestik nuqta", theoryNote: "Izosbestik nuqta — muvozanat ko'rsatkichi" },
    { wavelength: 400, absorbance: 0.70, event: "Binafsha soha", theoryNote: "Yutilish boshlanadi" },
    { wavelength: 420, absorbance: 1.01, event: "λmax — maksimal yutilish", theoryNote: "Maksimal yutilish — LMCT o'tish" },
    { wavelength: 440, absorbance: 0.85, event: "Ko'k soha", theoryNote: "Yutilish kamayadi" },
    { wavelength: 480, absorbance: 0.55, event: "Ko'k-yashil soha", theoryNote: "Past yutilish" },
    { wavelength: 520, absorbance: 0.30, event: "Yashil soha", theoryNote: "Past yutilish" },
    { wavelength: 560, absorbance: 0.15, event: "Sariq soha", theoryNote: "Past yutilish" },
    { wavelength: 600, absorbance: 0.08, event: "To'q sariq soha", theoryNote: "Past yutilish" },
    { wavelength: 650, absorbance: 0.04, event: "Qizil soha", theoryNote: "Past yutilish" },
    { wavelength: 700, absorbance: 0.02, event: "Infraqizil soha", theoryNote: "Juda past yutilish" },
    { wavelength: 750, absorbance: 0.01, event: "Infraqizil soha", theoryNote: "Juda past yutilish" }
  ],

  // Job metodi ma'lumotlari
  jobMethodData: [
    { xL: 0.0, absorbance: 0.0, corrected: 0.0, event: "Faqat Fe²⁺", theoryNote: "Faqat metall ioni — kompleks yo'q" },
    { xL: 0.1, absorbance: 0.12, corrected: 0.12, event: "Kam ligand", theoryNote: "Kam kompleks hosil bo'ladi" },
    { xL: 0.2, absorbance: 0.25, corrected: 0.25, event: "Kam ligand", theoryNote: "Kompleks hosil bo'lishi boshlanadi" },
    { xL: 0.3, absorbance: 0.38, corrected: 0.38, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.4, absorbance: 0.50, corrected: 0.50, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.5, absorbance: 0.62, corrected: 0.62, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.6, absorbance: 0.72, corrected: 0.72, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.7, absorbance: 0.80, corrected: 0.80, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.8, absorbance: 0.88, corrected: 0.88, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.86, absorbance: 0.92, corrected: 0.92, event: "1:6 stoxiometriya — MAKSIMUM", theoryNote: "MAKSIMUM — 1:6 stoxiometriya (ML₆)" },
    { xL: 0.9, absorbance: 0.85, corrected: 0.85, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 1.0, absorbance: 0.60, corrected: 0.60, event: "Faqat CN⁻", theoryNote: "Faqat ligand — kompleks yo'q" }
  ],

  // Bosqichli konstantalar
  stepwiseConstants: [
    { step: 1, reaction: "Fe²⁺ + CN⁻ ⇌ [Fe(CN)]⁺", logK: 7.8, K: "6.31×10⁷", species: "[Fe(CN)]⁺", color: "och sariq" },
    { step: 2, reaction: "[Fe(CN)]⁺ + CN⁻ ⇌ [Fe(CN)₂]⁻", logK: 7.2, K: "1.58×10⁷", species: "[Fe(CN)₂]⁻", color: "sariq" },
    { step: 3, reaction: "[Fe(CN)₂]⁻ + CN⁻ ⇌ [Fe(CN)₃]²⁻", logK: 6.8, K: "6.31×10⁶", species: "[Fe(CN)₃]²⁻", color: "sariq" },
    { step: 4, reaction: "[Fe(CN)₃]²⁻ + CN⁻ ⇌ [Fe(CN)₄]³⁻", logK: 6.2, K: "1.58×10⁶", species: "[Fe(CN)₄]³⁻", color: "sariq" },
    { step: 5, reaction: "[Fe(CN)₄]³⁻ + CN⁻ ⇌ [Fe(CN)₅]⁴⁻", logK: 5.8, K: "6.31×10⁵", species: "[Fe(CN)₅]⁴⁻", color: "sariq" },
    { step: 6, reaction: "[Fe(CN)₅]⁴⁻ + CN⁻ ⇌ [Fe(CN)₆]⁴⁻", logK: 5.2, K: "1.58×10⁵", species: "[Fe(CN)₆]⁴⁻", color: "to'q sariq" }
  ],

  conductometricData: [
    { conc: 0.0001, lm: 550, kappa: 0.00550, event: "Juda suyultirilgan", theoryNote: "Cheksiz suyultirishga yaqin — Λm° ga yaqin" },
    { conc: 0.0005, lm: 545, kappa: 0.0273, event: "Juda suyultirilgan", theoryNote: "Λm hali ham Λm° ga yaqin" },
    { conc: 0.001, lm: 540, kappa: 0.0540, event: "Standart konsentratsiya", theoryNote: "Standart konsentratsiya (10⁻³ M) — Λm ≈ 540 S·cm²/mol" },
    { conc: 0.005, lm: 525, kappa: 0.263, event: "O'rta konsentratsiya", theoryNote: "Λm kamayadi — ion-ion o'zaro ta'siri" },
    { conc: 0.01, lm: 510, kappa: 0.510, event: "O'rta konsentratsiya", theoryNote: "Ion-ion o'zaro ta'siri kuchayadi" },
    { conc: 0.05, lm: 485, kappa: 2.43, event: "Yuqori konsentratsiya", theoryNote: "Ion atmosferasi kuchli — Λm sezilarli kamayadi" },
    { conc: 0.1, lm: 465, kappa: 4.65, event: "Yuqori konsentratsiya", theoryNote: "Ion juftlari hosil bo'ladi" },
    { conc: 0.5, lm: 435, kappa: 21.8, event: "Juda yuqori konsentratsiya", theoryNote: "Kuchli ion-ion o'zaro ta'siri" },
    { conc: 1.0, lm: 410, kappa: 41.0, event: "Juda yuqori konsentratsiya", theoryNote: "Λm sezilarli kamaydi — ion juftlari ko'p" }
  ],

  solventData: [
    { solvent: "Suv (H₂O)", dielectric: 78.5, lm: 540, kappa: 0.0540, color: "sariq", note: "Standart erituvchi — eng yuqori o'tkazuvchanlik" },
    { solvent: "Metanol (CH₃OH)", dielectric: 32.7, lm: 480, kappa: 0.0480, color: "sariq", note: "Kamroq dielektrik — kamroq dissotsiatsiya" },
    { solvent: "Etanol (C₂H₅OH)", dielectric: 24.3, lm: 420, kappa: 0.0420, color: "sariq", note: "Yanada kamroq dielektrik" },
    { solvent: "DMF (Dimetilformamid)", dielectric: 36.7, lm: 460, kappa: 0.0460, color: "sariq", note: "Qutbli organik erituvchi" },
    { solvent: "CH₃CN (Asetonitril)", dielectric: 37.5, lm: 470, kappa: 0.0470, color: "sariq", note: "Qutbli organik erituvchi" },
    { solvent: "Aseton ((CH₃)₂CO)", dielectric: 20.7, lm: 360, kappa: 0.0360, color: "sariq", note: "Kam qutbli — kam dissotsiatsiya" }
  ],

  temperatureData: [
    { temp: 15, lm: 520, kappa: 0.0520, note: "Past temperatura — kamroq o'tkazuvchanlik" },
    { temp: 20, lm: 530, kappa: 0.0530, note: "Xona temperaturasi" },
    { temp: 25, lm: 540, kappa: 0.0540, note: "Standart temperatura (25°C)" },
    { temp: 30, lm: 550, kappa: 0.0550, note: "Yuqori temperatura — ko'proq o'tkazuvchanlik" },
    { temp: 40, lm: 570, kappa: 0.0570, note: "Yuqori temperatura" },
    { temp: 50, lm: 590, kappa: 0.0590, note: "Juda yuqori temperatura" }
  ],

  wernerComparison: [
    { complex: "[Fe(CN)₆]⁴⁻", formula: "Fe²⁺ + 6CN⁻", ions: 5, lm: 540, type: "4:1", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Co(NH₃)₆]³⁺", formula: "Co³⁺ + 6NH₃", ions: 4, lm: 432, type: "1:3", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Cu(phen)₃]²⁺", formula: "Cu²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Fe(phen)₃]²⁺", formula: "Fe²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Fe(SCN)]²⁺", formula: "Fe³⁺ + SCN⁻", ions: 2, lm: 250, type: "1:1", color: "qon qizil", colorCode: "text-red-400" },
    { complex: "[Cu(NH₃)₄]²⁺", formula: "Cu²⁺ + 4NH₃", ions: 5, lm: 340, type: "1:4", color: "to'q ko'k", colorCode: "text-blue-400" },
    { complex: "[Ni(en)₃]²⁺", formula: "Ni²⁺ + 3en", ions: 4, lm: 435, type: "1:3", color: "binafsha", colorCode: "text-pink-400" },
    { complex: "[Ag(NH₃)₂]⁺", formula: "Ag⁺ + 2NH₃", ions: 3, lm: 270, type: "1:2", color: "rangsiz", colorCode: "text-gray-400" },
    { complex: "[Cu(en)₂]²⁺", formula: "Cu²⁺ + 2en", ions: 3, lm: 270, type: "1:2", color: "ko'k", colorCode: "text-blue-400" },
    { complex: "[Zn(phen)₃]²⁺", formula: "Zn²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "rangsiz", colorCode: "text-gray-400" },
    { complex: "[Fe(acac)₃]", formula: "Fe³⁺ + 3acac", ions: 4, lm: 435, type: "1:3", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Cu(salen)]", formula: "Cu²⁺ + salen", ions: 2, lm: 250, type: "1:1", color: "yashil", colorCode: "text-green-400" }
  ],

  experimentalRuns: [
    { 
      id: "SPEC-24-001", 
      date: "2026-07-15", 
      concentration: 0.001, 
      absorbance: 1.01, 
      lambdaMax: 420, 
      ions: 5, 
      type: "4:1 elektrolit",
      note: "Toza [Fe(CN)₆]⁴⁻ — standart sharoit",
      theoryNote: "Standart sharoitda A = 1.01, λmax = 420 nm. Bu [Fe(CN)₆]⁴⁻ ning sariq rangini ko'rsatadi."
    },
    { 
      id: "SPEC-24-002", 
      date: "2026-07-15", 
      concentration: 0.001, 
      absorbance: 1.02, 
      lambdaMax: 420, 
      ions: 5, 
      type: "4:1 elektrolit",
      note: "Ikkinchi o'lchash — takrorlanish",
      theoryNote: "Takrorlanish — natijalar bir xil (A ≈ 1.02)."
    },
    { 
      id: "SPEC-24-003", 
      date: "2026-07-16", 
      concentration: 0.0005, 
      absorbance: 0.51, 
      lambdaMax: 420, 
      ions: 5, 
      type: "4:1 elektrolit",
      note: "Past konsentratsiya (5×10⁻⁴ M)",
      theoryNote: "Beer-Lambert qonuni: A konsentratsiyaga proporsional. A ≈ 0.51."
    },
    { 
      id: "SPEC-24-004", 
      date: "2026-07-16", 
      concentration: 0.002, 
      absorbance: 2.02, 
      lambdaMax: 420, 
      ions: 5, 
      type: "4:1 elektrolit",
      note: "Yuqori konsentratsiya (2×10⁻³ M)",
      theoryNote: "A ≈ 2.02 — Beer-Lambert qonuni bajariladi."
    },
    { 
      id: "SPEC-24-005", 
      date: "2026-07-17", 
      concentration: 0.001, 
      absorbance: 1.01, 
      lambdaMax: 420, 
      ions: 5, 
      type: "4:1 elektrolit",
      note: "Job metodi — xL = 0.86 da maksimum",
      theoryNote: "Job metodi: xL = 0.86 da maksimum — bu 1:6 stoxiometriyani ko'rsatadi."
    },
    { 
      id: "SPEC-24-006", 
      date: "2026-07-17", 
      concentration: 0.001, 
      absorbance: 1.01, 
      lambdaMax: 420, 
      ions: 5, 
      type: "4:1 elektrolit",
      note: "Izosbestik nuqtalar: 380, 420 nm",
      theoryNote: "Izosbestik nuqtalar — 380, 420 nm. Bu muvozanat ko'rsatkichi."
    }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Fe(CN)₆]⁴⁻ zaharli, CN⁻ juda zaharli. Qo'lqop, himoya ko'zoynaklari va laboratoriya xalati majburiy. Ventilyatsiya zarur! CN⁻ gazi nafas yo'llarini to'xtatishi mumkin.", time: "doimiy", critical: true, theory: "CN⁻ ionlari juda zaharli — nafas yo'llarini to'xtatishi mumkin. Kislota qo'shilmasligi kerak." },
    { step: 2, title: "Kerakli asboblar", desc: "Analitik tarozi (0.1 mg aniqlik), 100 mL o'lchov kolbasi, spektrofotometr (UV-Vis), kyuvetalar (1 sm yo'l uzunligi), pipetka, deionizatsiyalangan suv, Fe²⁺ eritmasi (0.001 M), CN⁻ eritmasi (0.006 M).", time: "5 daq", critical: true, theory: "Spektrofotometr 350-700 nm diapazonida ishlashi kerak. Kyuvetalar toza bo'lishi shart. Fe²⁺ va CN⁻ eritmalari aniq konsentratsiyada bo'lishi kerak." },
    { step: 3, title: "Fe²⁺ eritmasini tayyorlash", desc: "Analitik tarozida FeSO₄·7H₂O (27.80 mg) tortilib, 100 mL deionizatsiyalangan suvda eritiladi. 10⁻³ M eritma tayyorlanadi.", time: "10 daq", critical: true, theory: "FeSO₄·7H₂O ning molyar massasi 278.01 g/mol. 10⁻³ M eritma uchun 27.80 mg kerak." },
    { step: 4, title: "CN⁻ eritmasini tayyorlash", desc: "KCN eritmasi (0.006 M) tayyorlanadi. Bu ligand eritmasi. 0.006 M KCN uchun 39.06 mg KCN 100 mL suvda eritiladi.", time: "5 daq", critical: true, theory: "KCN ning molyar massasi 65.12 g/mol. 0.006 M eritma uchun 39.06 mg kerak. KCN juda zaharli — ehtiyotkorlik bilan ishlatilishi kerak." },
    { step: 5, title: "Job metodi uchun eritmalarni tayyorlash", desc: "10 ta eritma tayyorlanadi: [Fe²⁺] + [CN⁻] = const = 10⁻³ M. xL = 0 dan 1 gacha o'zgartiriladi. Har bir eritma uchun 10 mL.", time: "15 daq", critical: true, theory: "Job metodi: umumiy konsentratsiya o'zgarmas. xL = [CN⁻] / ([Fe²⁺] + [CN⁻]). xL = 0.86 da maksimum bo'lishi kerak." },
    { step: 6, title: "Spektrofotometrik o'lchash", desc: "Har bir eritmaning UB-Vis spektri qayd etiladi (350-700 nm). λmax = 420 nm da absorbsiya o'lchanadi. Kyuvetalar toza bo'lishi shart.", time: "20 daq", critical: false, theory: "λmax = 420 nm — bu [Fe(CN)₆]⁴⁻ ning maksimal yutilish to'lqin uzunligi. ε = 1010 M⁻¹cm⁻¹ — o'rta sezgirlik (LMCT o'tish)." },
    { step: 7, title: "Job grafigini qurish", desc: "A·(1-xL) vs xL grafigi quriladi. Maksimum xL = 0.86 da — bu 1:6 stoxiometriyani ko'rsatadi.", time: "10 daq", critical: false, theory: "Job metodi: A·(1-xL) vs xL grafigi maksimumi xL = n/(n+m) da bo'ladi. 1:6 stoxiometriya uchun xL = 0.86." },
    { step: 8, title: "β₆ hisoblash (Benesi-Hildebrand)", desc: "Benesi-Hildebrand metodi yordamida β₆ hisoblanadi. 1/(A-A₀) vs 1/[CN⁻] grafigi quriladi. log β₆ = 35.4.", time: "5 daq", critical: false, theory: "Benesi-Hildebrand: 1/(A-A₀) = 1/(ε·[Fe²⁺]·β₆) + 1/(ε·[Fe²⁺]·β₆·[CN⁻]). Chiziqli grafik β₆ ni aniqlash imkonini beradi." },
    { step: 9, title: "Natijalarni tahlil qilish", desc: "3 ta o'lchashning o'rtacha qiymati hisoblanadi. RSD < 2% bo'lishi kerak. Beer-Lambert qonuni bajarilishi tekshiriladi.", time: "5 daq", critical: false, theory: "RSD (nisbiy standart chetlanish) < 2% bo'lishi kerak. Bu o'lchashlarning aniqligini ko'rsatadi. Beer-Lambert qonuni: A = ε·l·c." },
    { step: 10, title: "Tozalash va saqlash", desc: "Kyuvetalar distillangan suv bilan yuviladi. Eritma saqlanadi (qorong'i, 4°C). Natijalar hujjatlashtiriladi. Chiqindilar maxsus idishga yig'iladi (CN⁻ juda zaharli).", time: "5 daq", critical: false, theory: "Eritma qorong'ida saqlanishi kerak — yorug'lik ta'sirida parchalanishi mumkin. CN⁻ juda zaharli bo'lgani uchun chiqindilar maxsus idishga yig'ilishi kerak." }
  ],

  relatedMethods: [
    {
      name: "UV-Vis spektroskopiya",
      role: "Spektrlarni qayd etish va tahlil qilish",
      condAdvantage: "Tez va aniq spektral ma'lumotlar, ε = 1010 M⁻¹cm⁻¹ — o'rta sezgirlik",
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
      condDisadvantage: "Diamagnit moddalar uchun (Fe²⁺ diamagnit)",
      complementarity: "95%"
    },
    {
      name: "EPR spektroskopiya",
      role: "Elektron paramagnit rezonans",
      condAdvantage: "Paramagnit moddalar uchun",
      condDisadvantage: "Faqat paramagnit moddalar (Fe²⁺ diamagnit)",
      complementarity: "60%"
    },
    {
      name: "EXAFS spektroskopiya",
      role: "Kengaytirilgan rentgen nurlari yutilish nozik tuzilishi",
      condAdvantage: "Mahalliy strukturani aniqlash (Fe-C masofalari)",
      condDisadvantage: "Sinxrotron nurlari kerak",
      complementarity: "85%"
    }
  ]
}

export default function FeCN64SpectrophotometricPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeRun, setActiveRun] = useState("SPEC-24-001")
  const [activeWerner, setActiveWerner] = useState(0)
  const [concSlider, setConcSlider] = useState(0.001)
  const [tempSlider, setTempSlider] = useState(25)
  const [solventSlider, setSolventSlider] = useState(0)
  const [wavelengthSlider, setWavelengthSlider] = useState(420)
  const [jobSlider, setJobSlider] = useState(0.86)
  
  // Job metodi kalkulyatori
  const [metalConc, setMetalConc] = useState(0.001)
  const [ligandConc, setLigandConc] = useState(0.006)
  
  // βn kalkulyatori
  const [betaValue, setBetaValue] = useState(35.4)
  const [metalConcBeta, setMetalConcBeta] = useState(0.001)
  const [ligandConcBeta, setLigandConcBeta] = useState(0.006)
  
  // Benesi-Hildebrand kalkulyatori
  const [absorbance, setAbsorbance] = useState(1.01)
  const [ligandConcBH, setLigandConcBH] = useState(0.01)

  const jobResult = useMemo(() => {
    const xL = ligandConc / (metalConc + ligandConc)
    let stox = "Noma'lum"
    if (Math.abs(xL - 0.5) < 0.05) stox = "1:1 (ML)"
    else if (Math.abs(xL - 0.67) < 0.05) stox = "1:2 (ML₂)"
    else if (Math.abs(xL - 0.75) < 0.05) stox = "1:3 (ML₃)"
    else if (Math.abs(xL - 0.80) < 0.05) stox = "1:4 (ML₄)"
    else if (Math.abs(xL - 0.86) < 0.05) stox = "1:6 (ML₆)"
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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-yellow-950/20 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-yellow-950 to-purple-950 border-2 border-yellow-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">📊</span> FERROTSIANID — PRUSSIAN BLUE SENTEZI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-yellow-300">[Fe(CN)₆]⁴⁻</strong> — ferrotsianid, sariq qon tuzi anioni. 
              Sariq rang, λmax = 420 nm, log β₆ = 35.4.
            </p>
            
            <div className="bg-yellow-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-yellow-400 font-bold mb-2">📊 Nima o'lchanadi?</div>
                  <div className="text-purple-200">
                    <strong>Barqarorlik konstantasi (β₆)</strong> — log β₆ = 35.4.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Stoxiometriya</strong> — 1:6 (ML₆).
                  </div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold mb-2">🔬 Qanday ishlaydi?</div>
                  <div className="text-purple-200">
                    <strong>Job metodi</strong> — xL = 0.86 da maksimum.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Izosbestik nuqtalar</strong> — 380, 420 nm.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">Prussian Blue:</strong> Fe³⁺ + [Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃ (ko'k cho'kma). 
                Bu analitik kimyoda Fe³⁺ ni sifat aniqlashda ishlatiladi.
              </p>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">LMCT o'tish:</strong> λmax = 420 nm, ε = 1010 M⁻¹cm⁻¹. 
                Bu ligand-to-metal charge transfer o'tish natijasida yuzaga keladi.
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
              <Link href="/ilmiy/tahlil/titrlash" className="hover:text-purple-300">Spektrofotometrik titrlash</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/titrlash/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-yellow-400 font-semibold">[Fe(CN)₆]⁴⁻</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
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
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">4:1 elektrolit</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">log β₆ = 35.4</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">λmax = 420 nm</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">ε = 1010</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/titrlash/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Barcha birikmalar
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* HEADER TOGGLE BUTTON */}
      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-yellow-600 hover:bg-yellow-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-purple-900/40 border border-yellow-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Birikma haqida (spektrofotometrik titrlash uchun)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Fe(CN)₆]⁴⁻</strong> — ferrotsianid, sariq qon tuzi anioni. Spektrofotometrik titrlashda <strong className="text-yellow-300">4:1 elektrolit</strong> — 5 ta ion borligini ko'rsatadi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-yellow-500 text-xs md:text-sm">
                <li><strong className="text-white">Fe²⁺ (d⁶, past spin)</strong> — diamagnit kompleks</li>
                <li><strong className="text-white">6 ta CN⁻</strong> ichki sferada (Fe²⁺ ga bog'langan)</li>
                <li><strong className="text-yellow-300">log β₆ = 35.4</strong> — juda yuqori barqarorlik</li>
                <li><strong className="text-yellow-300">λmax = 420 nm</strong> — sariq rang</li>
                <li><strong className="text-yellow-300">ε = 1010 M⁻¹cm⁻¹</strong> — o'rta sezgirlik (LMCT o'tish)</li>
                <li><strong className="text-yellow-300">Izosbestik nuqtalar</strong> — 380, 420 nm</li>
                <li><strong className="text-yellow-300">Job metodi</strong> — xL = 0.86 → 1:6</li>
                <li><strong className="text-yellow-300">Diamagnit</strong> — μ = 0 BM</li>
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
              <div key={i} className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                <h3 className="text-yellow-400 font-bold text-sm mb-2">{fact.title}</h3>
                <p className="text-purple-200 text-xs">{fact.fact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. BARQARORLIK KONSTANTASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📐</span> Barqarorlik konstantasi (β₆) — kompleks mustahkamligi
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            <strong className="text-yellow-400">Umumiy barqarorlik konstantasi (β₆)</strong> — Fe²⁺ ioniga 
            6 ta CN⁻ ligand birikishi natijasida hosil bo'lgan kompleksning termodinamik barqarorligini ifodalaydi.
            log β₆ = 35.4 — bu juda yuqori barqarorlikni ko'rsatadi, CN⁻ kuchli maydon ligand tufayli.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-yellow-400 font-bold mb-3">Bosqichli konstantalar:</h3>
            <div className="space-y-3 text-sm text-purple-200">
              {COMPOUND.stepwiseConstants.map((step) => (
                <div key={step.step} className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-mono">{step.reaction} &nbsp;&nbsp;&nbsp; log K{step.step} = {step.logK}</p>
                  <p className="text-xs text-purple-400 mt-1">{step.step}-bosqich konstantasi — {step.species} ({step.color})</p>
                </div>
              ))}
              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-mono">β₆ = K₁ · K₂ · K₃ · K₄ · K₅ · K₆ = 10^35.4</p>
                <p className="text-xs text-purple-400 mt-1">Umumiy barqarorlik konstantasi — juda yuqori barqarorlik</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SPEKTRAL GRAFIK — INTERAKTIV */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Spektral grafik — to'lqin uzunligi vs absorbsiya</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">Spektral grafik</strong> — to'lqin uzunligi (λ) vs absorbsiya (A). 
            λmax = 420 nm da maksimal yutilish kuzatiladi. Slayderni harakatlantirib, to'lqin uzunligini o'zgartiring.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              To'lqin uzunligi: {wavelengthSlider} nm
            </label>
            <input
              type="range"
              min="350"
              max="750"
              value={wavelengthSlider}
              onChange={(e) => setWavelengthSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>350 nm</span>
              <span>420 nm (λmax)</span>
              <span>750 nm</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">To'lqin uzunligi:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentSpectral.wavelength} nm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Absorbsiya:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentSpectral.absorbance.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentSpectral.event}</div>
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
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.2)*200} x2="580" y2={220 - (v/1.2)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.2)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[350, 400, 450, 500, 550, 600, 650, 700, 750].map((w, i) => (
                <g key={i}>
                  <text x={50 + ((w - 350)/400)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{w} nm</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">To'lqin uzunligi (nm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Absorbsiya (A)</text>

              <polyline
                fill="none" 
                stroke="#eab308" 
                strokeWidth="2"
                points={COMPOUND.spectralData.map(p => {
                  const x = 50 + ((p.wavelength - 350)/400)*530
                  const y = 220 - (p.absorbance/1.2)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              <line 
                x1={50 + ((420 - 350)/400)*530} 
                y1="30" 
                x2={50 + ((420 - 350)/400)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <text x={50 + ((420 - 350)/400)*530} y="25" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">λmax = 420 nm</text>

              <line 
                x1={50 + ((currentSpectral.wavelength - 350)/400)*530} 
                y1="30" 
                x2={50 + ((currentSpectral.wavelength - 350)/400)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <circle 
                cx={50 + ((currentSpectral.wavelength - 350)/400)*530} 
                cy={220 - (currentSpectral.absorbance/1.2)*200} 
                r="6" 
                fill="#fbbf24" 
                stroke="#fff" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* 4. JOB METODI GRAFIKI — INTERAKTIV */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Job metodi grafigi — uzluksiz variatsiyalar</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">Job metodi</strong> — xL (ligand mol ulushi) vs A·(1-xL). 
            Maksimum xL = 0.86 da — bu 1:6 stoxiometriyani ko'rsatadi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
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
              <span>0.0 (faqat Fe²⁺)</span>
              <span>0.86 (MAKSIMUM)</span>
              <span>1.0 (faqat CN⁻)</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">xL:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentJob.xL.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">A·(1-xL):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{(currentJob.absorbance * (1 - currentJob.xL)).toFixed(3)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentJob.event}</div>
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
              {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/0.8)*200} x2="580" y2={220 - (v/0.8)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/0.8)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}</text>
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
                stroke="#eab308" 
                strokeWidth="2"
                points={COMPOUND.jobMethodData.map(p => {
                  const x = 50 + (p.xL)*530
                  const y = 220 - ((p.absorbance * (1 - p.xL))/0.8)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              <line 
                x1={50 + (0.86)*530} 
                y1="30" 
                x2={50 + (0.86)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <text x={50 + (0.86)*530} y="25" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">xL = 0.86 → 1:6</text>

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
                cy={220 - ((currentJob.absorbance * (1 - currentJob.xL))/0.8)*200} 
                r="6" 
                fill="#fbbf24" 
                stroke="#fff" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* 5. JOB METODI KALKULYATORI */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-8">
          <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
            <span>🔬</span> Job metodi kalkulyatori — uzluksiz variatsiyalar
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Metall va ligand konsentratsiyalarini kiriting — <strong className="text-yellow-300">stoxiometriya</strong> aniqlanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Fe²⁺] metall konsentratsiyasi (M):</label>
              <input
                type="number"
                step="0.0001"
                value={metalConc}
                onChange={(e) => setMetalConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[CN⁻] ligand konsentratsiyasi (M):</label>
              <input
                type="number"
                step="0.0001"
                value={ligandConc}
                onChange={(e) => setLigandConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Ligand mol ulushi (xL):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{jobResult.xL}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Stoxiometriya:</div>
                <div className={`text-xl font-mono font-bold ${jobResult.stox.includes("1:6") ? 'text-green-400' : jobResult.stox.includes("1:3") ? 'text-yellow-400' : jobResult.stox.includes("1:2") ? 'text-blue-400' : 'text-yellow-400'}`}>{jobResult.stox}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: xL = [CN⁻] / ([Fe²⁺] + [CN⁻]) = {ligandConc} / ({metalConc} + {ligandConc}) = {jobResult.xL}
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Eslatma:</strong> xL = 0.50 → 1:1, xL = 0.67 → 1:2, xL = 0.75 → 1:3, xL = 0.86 → 1:6
            </p>
          </div>
        </div>

        {/* 6. βn KALKULYATORI */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-8">
          <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Barqarorlik konstantasi kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            log β₆ ni kiriting — <strong className="text-yellow-300">ΔG°</strong> hisoblanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">log β₆:</label>
              <input
                type="number"
                step="0.1"
                value={betaValue}
                onChange={(e) => setBetaValue(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Fe²⁺] (M):</label>
              <input
                type="number"
                step="0.0001"
                value={metalConcBeta}
                onChange={(e) => setMetalConcBeta(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[CN⁻] (M):</label>
              <input
                type="number"
                step="0.0001"
                value={ligandConcBeta}
                onChange={(e) => setLigandConcBeta(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">β₆:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{Math.pow(10, betaValue).toExponential(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">ΔG° (kJ/mol):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{betaResult.deltaG}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: ΔG° = −RT·ln(β₆) = −8.314 × 298 × ln(10^{betaValue}) / 1000 = {betaResult.deltaG} kJ/mol
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
              <label className="block text-xs text-purple-400 mb-1">[CN⁻] ligand (M):</label>
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
                <div className="text-xs text-purple-400">1/[CN⁻]:</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{bhResult.invLigand}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: 1/(A-A₀) = 1/(ε·[Fe²⁺]·β₆) + 1/(ε·[Fe²⁺]·β₆·[CN⁻])
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Eslatma:</strong> 1/A vs 1/[CN⁻] grafigi chiziqli bo'lsa, β₆ hisoblanadi.
            </p>
          </div>
        </div>

        {/* 8. IZOSBESTIK NUQTALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Izosbestik nuqtalar — muvozanat ko'rsatkichi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">Izosbestik nuqta</strong> — turli konsentratsiyalarda 
            olingan spektrlarning <strong>kesishgan nuqtasi</strong>. [Fe(CN)₆]⁴⁻ uchun izosbestik nuqtalar: 380, 420 nm.
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
                <strong>[Fe(CN)]⁺, [Fe(CN)₂]⁻, [Fe(CN)₃]²⁻, [Fe(CN)₄]³⁻, [Fe(CN)₅]⁴⁻, [Fe(CN)₆]⁴⁻</strong> — bir nechta kompleks shakllari muvozanatda.
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
                    ? "bg-yellow-900/40 border-2 border-yellow-400" 
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-yellow-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeStep === step.step ? "bg-yellow-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-400 font-bold">{step.title}</p>
                    {step.critical && (
                      <span className="text-[10px] text-red-400">KRITIK</span>
                    )}
                  </div>
                </div>
                {activeStep === step.step && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-2">
                      <div className="text-yellow-400 font-bold text-xs mb-1">📚 Nazariy asos:</div>
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
                <div className="text-xl font-mono font-bold text-yellow-400">{run.absorbance}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">λmax (nm):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{run.lambdaMax}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ionlar soni:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{run.ions}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Elektrolit turi:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{run.type}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 11. KENGAYTIRUVCHI METODLAR */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-purple-900/40 border border-yellow-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Kengaytiruvchi metodlar — spektrofotometrik titrlashga qo'shimcha
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

          <div className="mt-5 bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-yellow-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">Spektrofotometrik titrlash (β₆, stoxiometriya) + UV-Vis (spektrlar) + NMR (diamagnit Fe²⁺) + EXAFS (mahalliy struktura) + Kalorimetriya (ΔH, ΔS)</strong> — besh metod birgalikda [Fe(CN)₆]⁴⁻ ni to'liq tavsiflaydi.
            </p>
          </div>
        </div>

        {/* XULOSALAR */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Spektrofotometrik titrlash — <strong className="text-yellow-400">barqarorlik konstantalarini aniqlashning asosiy usuli</strong></li>
            <li>Umumiy barqarorlik konstantasi β₆ — <strong className="text-yellow-400">log β₆ = 35.4</strong> (juda yuqori barqarorlik)</li>
            <li>Job metodi — <strong className="text-yellow-400">xL = 0.86 → 1:6 stoxiometriya</strong></li>
            <li>Izosbestik nuqtalar — <strong className="text-yellow-400">380, 420 nm</strong></li>
            <li>LMCT o'tish — <strong className="text-yellow-400">λmax = 420 nm, ε = 1010 M⁻¹cm⁻¹</strong></li>
            <li>Diamagnit — <strong className="text-yellow-400">μ = 0 BM (barcha elektronlar juftlangan)</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/titrlash" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Spektrofotometrik titrlash</Link>
          <Link href="/ilmiy/tahlil/titrlash/birikmalar" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Barcha birikmalar →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(CN)₆]⁴⁻ (Ferrotsianid) • Spektrofotometrik titrlash moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry), Gmelin (1822)</p>
        </div>
      </footer>
    </main>
  )
}