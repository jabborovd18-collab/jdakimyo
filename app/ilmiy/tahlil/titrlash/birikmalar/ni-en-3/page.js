"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Ni(en)₃]²⁺ — SPEKTROFOTOMETRIK TITRLASH MAHSUS SAHIFASI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry)
// Xususiyat: Tris(etilendiamin)nikel(II), xelat effekti, binafsha rang
// O'ziga xoslik: log β₃ = 18.6, binafsha rang, 540 nm, d-d o'tish
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Ni: 58.693, C: 12.011, N: 14.007, H: 1.008, Cl: 35.450
}

const COMPOUND = {
  formulaHTML: "[Ni(en)<sub>3</sub>]<sup>2+</sup>",
  formulaPlain: "[Ni(en)3]2+",
  iupac: "Tris(etilendiamin)nikel(II)",
  formulaExpanded: "NiC₆H₂₄N₆",
  commonName: "Tris(etilendiamin)nikel(II) (binafsha)",
  molarMass: 309.90,
  casNumber: "14878-43-8",
  color: "binafsha (violet)",
  stability: "Juda yuqori barqarorlik (xelat effekti)",
  lambdaMax: 540,
  logBeta: 18.6,
  stox: "1:3",
  molarAbsorptivity: 85,
  isosbesticPoints: "420, 540 nm",
  jobMethod: "xL = 0.75 → 1:3 (ML₃)",
  
  wernerInfo: {
    wernerGroup: "1:3 elektrolit guruhi",
    electrolyteType: "1:3 elektrolit",
    ions: 4,
    lm: 435,
    formula_verner: "[Ni(en)₃]²⁺",
    wernerProof: "Verner va keyingi kimyogarlar konduktometrik o'lchashlar orqali 3 ta en ligandning ichki sferada ekanligini isbotladi."
  },

  historicalFact: {
    title: "Tris(etilendiamin)nikel(II) — xelat effekti namunasи",
    text: "[Ni(en)₃]²⁺ — nikel(II) ning tris(etilendiamin) kompleksi, xelat effektining klassik namunasi. Etilendiamin (en = H₂N-CH₂-CH₂-NH₂) bidentat ligand — 2 ta N atomi orqali Ni²⁺ ga bog'lanadi.",
    textExtended: "3 ta en ligandi 3 ta 5 a'zoli xelat halqa hosil qiladi. Ni²⁺ (d⁸, yuqori spin) oktaedr geometriyaga ega. Bu kompleks binafsha rang beradi (λmax = 540 nm). log β₃ = 18.6 — juda yuqori barqarorlik, xelat effekti tufayli. [Ni(H₂O)₆]²⁺ dan 10¹⁰ marta barqaror. Bu kompleks analitik kimyoda nikel miqdorini aniqlashda ishlatiladi."
  },

  interestingFacts: [
    {
      title: "Xelat effekti — 10¹⁰ marta barqarorlik",
      fact: "[Ni(en)₃]²⁺ (log β₃ = 18.6) [Ni(H₂O)₆]²⁺ dan 10¹⁰ marta barqaror. Sababi: entropiya ortishi — 3 ta bidentat ligand 6 ta monodentat ligand o'rnini egallaydi."
    },
    {
      title: "Binafsha rang — d-d o'tish",
      fact: "[Ni(en)₃]²⁺ binafsha rang beradi (λmax = 540 nm). Bu d-d o'tish natijasida yuzaga keladi. Molyar yutilish koeffitsienti ε = 85 M⁻¹cm⁻¹ — past (spin-taqiqlangan o'tish)."
    },
    {
      title: "Job metodi (uzluksiz variatsiyalar)",
      fact: "Job metodi yordamida stoxiometriya aniqlangan. xL = 0.75 da maksimum — bu 1:3 stoxiometriyani ko'rsatadi."
    },
    {
      title: "Beer-Lambert qonuni",
      fact: "A = ε·l·c — absorbsiya konsentratsiyaga to'g'ri proporsional. ε = 85 M⁻¹cm⁻¹ — past sezgirlik, lekin aniq o'lchash mumkin."
    },
    {
      title: "Benesi-Hildebrand metodi",
      fact: "1/(A-A₀) vs 1/[en] grafigi orqali β₃ hisoblanadi. Chiziqli grafik β₃ ni aniqlash imkonini beradi."
    },
    {
      title: "Paramagnit kompleks",
      fact: "Ni²⁺ (d⁸, yuqori spin) 2 ta toq elektronga ega — paramagnit (μ ≈ 3.2 BM). Bu EPR spektroskopiya uchun mos."
    }
  ],

  conductometricFeature: {
    title: "[Ni(en)₃]²⁺ — 1:3 elektrolit, log β₃ = 18.6",
    description: "Bu kompleks spektrofotometrik titrlashda klassik namuna hisoblanadi. 3 ta en ichki sferada — Ni²⁺ ga bog'langan. Xelat effekti tufayli juda barqaror.",
    reaction: {
      dissociation: "[Ni(en)₃]²⁺ ⇌ Ni²⁺ + 3en",
      ions: "Ni²⁺ + 3en",
      electrolyteType: "1:3 elektrolit",
      lm_theoretical: "log β₃ = 18.6 (25°C)"
    },
    problem: {
      title: "Xelat effekti — juda barqaror",
      description: "log β₃ = 18.6 — juda yuqori barqarorlik. Kompleks juda barqaror va sekin parchalanadi.",
      impact: "Bu titrlash uchun qulay — kompleks barqaror. Lekin o'lchashlar aniq bajarilishi kerak."
    },
    solution: {
      title: "Job metodi va Benesi-Hildebrand",
      description: "Job metodi yordamida stoxiometriya aniqlanadi. Benesi-Hildebrand metodi yordamida β₃ hisoblanadi.",
      mechanism: "1/(A-A₀) vs 1/[en] grafigi chiziqli bo'lsa, β₃ hisoblanadi."
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
    Ni:  { mass: 58.693,  percent: 18.94, source: "Ni²⁺ markaziy atom (ichki sfera)", conductSignal: "[Ni(en)₃]²⁺ kationi — o'tkazuvchanlikka hissa qo'shadi" },
    C:   { mass: 72.066,  percent: 23.25, source: "3×en (6×C, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" },
    N:   { mass: 84.042,  percent: 27.12, source: "3×en (6×N, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" },
    H:   { mass: 24.192,  percent: 7.81,  source: "3×en (24×H, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" }
  },

  // Spektral ma'lumotlar — to'lqin uzunligi vs absorbsiya
  spectralData: [
    { wavelength: 350, absorbance: 0.10, event: "UV sohasi", theoryNote: "Past yutilish — UV sohasi" },
    { wavelength: 380, absorbance: 0.18, event: "UV-Vis chegarasi", theoryNote: "Yutilish boshlanadi" },
    { wavelength: 420, absorbance: 0.35, event: "Izosbestik nuqta", theoryNote: "Izosbestik nuqta — muvozanat ko'rsatkichi" },
    { wavelength: 450, absorbance: 0.50, event: "Ko'k-binafsha soha", theoryNote: "Yutilish ortadi" },
    { wavelength: 480, absorbance: 0.65, event: "Ko'k soha", theoryNote: "Maksimal yutilishga yaqin" },
    { wavelength: 510, absorbance: 0.75, event: "Yashil-ko'k soha", theoryNote: "Maksimal yutilishga yaqin" },
    { wavelength: 540, absorbance: 0.85, event: "λmax — maksimal yutilish", theoryNote: "Maksimal yutilish — d-d o'tish" },
    { wavelength: 580, absorbance: 0.65, event: "Sariq soha", theoryNote: "Yutilish kamayadi" },
    { wavelength: 620, absorbance: 0.40, event: "To'q sariq soha", theoryNote: "Past yutilish" },
    { wavelength: 650, absorbance: 0.25, event: "Qizil soha", theoryNote: "Past yutilish" },
    { wavelength: 700, absorbance: 0.12, event: "Infraqizil soha", theoryNote: "Juda past yutilish" },
    { wavelength: 750, absorbance: 0.05, event: "Infraqizil soha", theoryNote: "Juda past yutilish" }
  ],

  // Job metodi ma'lumotlari
  jobMethodData: [
    { xL: 0.0, absorbance: 0.0, corrected: 0.0, event: "Faqat Ni²⁺", theoryNote: "Faqat metall ioni — kompleks yo'q" },
    { xL: 0.1, absorbance: 0.10, corrected: 0.10, event: "Kam ligand", theoryNote: "Kam kompleks hosil bo'ladi" },
    { xL: 0.2, absorbance: 0.22, corrected: 0.22, event: "Kam ligand", theoryNote: "Kompleks hosil bo'lishi boshlanadi" },
    { xL: 0.3, absorbance: 0.33, corrected: 0.33, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.4, absorbance: 0.44, corrected: 0.44, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.5, absorbance: 0.55, corrected: 0.55, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.6, absorbance: 0.65, corrected: 0.65, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.7, absorbance: 0.72, corrected: 0.72, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.75, absorbance: 0.76, corrected: 0.76, event: "1:3 stoxiometriya — MAKSIMUM", theoryNote: "MAKSIMUM — 1:3 stoxiometriya (ML₃)" },
    { xL: 0.8, absorbance: 0.72, corrected: 0.72, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 0.9, absorbance: 0.55, corrected: 0.55, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 1.0, absorbance: 0.35, corrected: 0.35, event: "Faqat en", theoryNote: "Faqat ligand — kompleks yo'q" }
  ],

  // Bosqichli konstantalar
  stepwiseConstants: [
    { step: 1, reaction: "Ni²⁺ + en ⇌ [Ni(en)]²⁺", logK: 7.5, K: "3.16×10⁷", species: "[Ni(en)]²⁺", color: "och binafsha" },
    { step: 2, reaction: "[Ni(en)]²⁺ + en ⇌ [Ni(en)₂]²⁺", logK: 6.7, K: "5.01×10⁶", species: "[Ni(en)₂]²⁺", color: "binafsha" },
    { step: 3, reaction: "[Ni(en)₂]²⁺ + en ⇌ [Ni(en)₃]²⁺", logK: 4.4, K: "2.51×10⁴", species: "[Ni(en)₃]²⁺", color: "to'q binafsha" }
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
    { solvent: "Suv (H₂O)", dielectric: 78.5, lm: 435, kappa: 0.0435, color: "binafsha", note: "Standart erituvchi — eng yuqori o'tkazuvchanlik" },
    { solvent: "Metanol (CH₃OH)", dielectric: 32.7, lm: 380, kappa: 0.0380, color: "binafsha", note: "Kamroq dielektrik — kamroq dissotsiatsiya" },
    { solvent: "Etanol (C₂H₅OH)", dielectric: 24.3, lm: 320, kappa: 0.0320, color: "binafsha", note: "Yanada kamroq dielektrik" },
    { solvent: "DMF (Dimetilformamid)", dielectric: 36.7, lm: 355, kappa: 0.0355, color: "binafsha", note: "Qutbli organik erituvchi" },
    { solvent: "CH₃CN (Asetonitril)", dielectric: 37.5, lm: 365, kappa: 0.0365, color: "binafsha", note: "Qutbli organik erituvchi" },
    { solvent: "Aseton ((CH₃)₂CO)", dielectric: 20.7, lm: 280, kappa: 0.0280, color: "binafsha", note: "Kam qutbli — kam dissotsiatsiya" }
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
    { complex: "[Ni(en)₃]²⁺", formula: "Ni²⁺ + 3en", ions: 4, lm: 435, type: "1:3", color: "binafsha", colorCode: "text-pink-400" },
    { complex: "[Fe(phen)₃]²⁺", formula: "Fe²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Fe(SCN)]²⁺", formula: "Fe³⁺ + SCN⁻", ions: 2, lm: 250, type: "1:1", color: "qon qizil", colorCode: "text-red-400" },
    { complex: "[Cu(NH₃)₄]²⁺", formula: "Cu²⁺ + 4NH₃", ions: 5, lm: 340, type: "1:4", color: "to'q ko'k", colorCode: "text-blue-400" },
    { complex: "[Cu(phen)₃]²⁺", formula: "Cu²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Co(NH₃)₆]³⁺", formula: "Co³⁺ + 6NH₃", ions: 7, lm: 520, type: "1:6", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Fe(CN)₆]⁴⁻", formula: "Fe²⁺ + 6CN⁻", ions: 7, lm: 540, type: "1:6", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Ag(NH₃)₂]⁺", formula: "Ag⁺ + 2NH₃", ions: 3, lm: 270, type: "1:2", color: "rangsiz", colorCode: "text-gray-400" },
    { complex: "[Cu(en)₂]²⁺", formula: "Cu²⁺ + 2en", ions: 3, lm: 270, type: "1:2", color: "ko'k", colorCode: "text-blue-400" },
    { complex: "[Zn(phen)₃]²⁺", formula: "Zn²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "rangsiz", colorCode: "text-gray-400" },
    { complex: "[Fe(acac)₃]", formula: "Fe³⁺ + 3acac", ions: 4, lm: 435, type: "1:3", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Cu(salen)]", formula: "Cu²⁺ + salen", ions: 2, lm: 250, type: "1:1", color: "yashil", colorCode: "text-green-400" }
  ],

  experimentalRuns: [
    { 
      id: "SPEC-24-001", 
      date: "2026-04-15", 
      concentration: 0.001, 
      absorbance: 0.85, 
      lambdaMax: 540, 
      ions: 4, 
      type: "1:3 elektrolit",
      note: "Toza [Ni(en)₃]²⁺ — standart sharoit",
      theoryNote: "Standart sharoitda A = 0.85, λmax = 540 nm. Bu [Ni(en)₃]²⁺ ning binafsha rangini ko'rsatadi."
    },
    { 
      id: "SPEC-24-002", 
      date: "2026-04-15", 
      concentration: 0.001, 
      absorbance: 0.86, 
      lambdaMax: 540, 
      ions: 4, 
      type: "1:3 elektrolit",
      note: "Ikkinchi o'lchash — takrorlanish",
      theoryNote: "Takrorlanish — natijalar bir xil (A ≈ 0.86)."
    },
    { 
      id: "SPEC-24-003", 
      date: "2026-04-16", 
      concentration: 0.0005, 
      absorbance: 0.43, 
      lambdaMax: 540, 
      ions: 4, 
      type: "1:3 elektrolit",
      note: "Past konsentratsiya (5×10⁻⁴ M)",
      theoryNote: "Beer-Lambert qonuni: A konsentratsiyaga proporsional. A ≈ 0.43."
    },
    { 
      id: "SPEC-24-004", 
      date: "2026-04-16", 
      concentration: 0.002, 
      absorbance: 1.70, 
      lambdaMax: 540, 
      ions: 4, 
      type: "1:3 elektrolit",
      note: "Yuqori konsentratsiya (2×10⁻³ M)",
      theoryNote: "A ≈ 1.70 — Beer-Lambert qonuni bajariladi."
    },
    { 
      id: "SPEC-24-005", 
      date: "2026-04-17", 
      concentration: 0.001, 
      absorbance: 0.85, 
      lambdaMax: 540, 
      ions: 4, 
      type: "1:3 elektrolit",
      note: "Job metodi — xL = 0.75 da maksimum",
      theoryNote: "Job metodi: xL = 0.75 da maksimum — bu 1:3 stoxiometriyani ko'rsatadi."
    },
    { 
      id: "SPEC-24-006", 
      date: "2026-04-17", 
      concentration: 0.001, 
      absorbance: 0.85, 
      lambdaMax: 540, 
      ions: 4, 
      type: "1:3 elektrolit",
      note: "Izosbestik nuqtalar: 420, 540 nm",
      theoryNote: "Izosbestik nuqtalar — 420, 540 nm. Bu muvozanat ko'rsatkichi."
    }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Ni(en)₃]²⁺ zaharli, Ni²⁺ va en zaharli. Qo'lqop, himoya ko'zoynaklari va laboratoriya xalati majburiy. Ventilyatsiya zarur! en (etilendiamin) zaharli — teri va ko'zga zarar yetkazadi.", time: "doimiy", critical: true, theory: "Ni²⁺ ionlari teri va ko'zga zarar yetkazadi. en (etilendiamin) zaharli — teri va ko'zga zarar yetkazadi." },
    { step: 2, title: "Kerakli asboblar", desc: "Analitik tarozi (0.1 mg aniqlik), 100 mL o'lchov kolbasi, spektrofotometr (UV-Vis), kyuvetalar (1 sm yo'l uzunligi), pipetka, deionizatsiyalangan suv, NiCl₂ eritmasi (0.001 M), en eritmasi (0.003 M).", time: "5 daq", critical: true, theory: "Spektrofotometr 350-700 nm diapazonida ishlashi kerak. Kyuvetalar toza bo'lishi shart. Ni²⁺ va en eritmalari aniq konsentratsiyada bo'lishi kerak." },
    { step: 3, title: "Ni²⁺ eritmasini tayyorlash", desc: "Analitik tarozida NiCl₂·6H₂O (23.77 mg) tortilib, 100 mL deionizatsiyalangan suvda eritiladi. 10⁻³ M eritma tayyorlanadi.", time: "10 daq", critical: true, theory: "NiCl₂·6H₂O ning molyar massasi 237.69 g/mol. 10⁻³ M eritma uchun 23.77 mg kerak." },
    { step: 4, title: "en eritmasini tayyorlash", desc: "en eritmasi (0.003 M) tayyorlanadi. Bu ligand eritmasi. 0.003 M en uchun 18.03 mg en 100 mL suvda eritiladi.", time: "5 daq", critical: true, theory: "en ning molyar massasi 60.10 g/mol. 0.003 M eritma uchun 18.03 mg kerak. en ligand eritmasi konsentratsiyasi aniq bo'lishi kerak." },
    { step: 5, title: "Job metodi uchun eritmalarni tayyorlash", desc: "10 ta eritma tayyorlanadi: [Ni²⁺] + [en] = const = 10⁻³ M. xL = 0 dan 1 gacha o'zgartiriladi. Har bir eritma uchun 10 mL.", time: "15 daq", critical: true, theory: "Job metodi: umumiy konsentratsiya o'zgarmas. xL = [en] / ([Ni²⁺] + [en]). xL = 0.75 da maksimum bo'lishi kerak." },
    { step: 6, title: "Spektrofotometrik o'lchash", desc: "Har bir eritmaning UB-Vis spektri qayd etiladi (350-700 nm). λmax = 540 nm da absorbsiya o'lchanadi. Kyuvetalar toza bo'lishi shart.", time: "20 daq", critical: false, theory: "λmax = 540 nm — bu [Ni(en)₃]²⁺ ning maksimal yutilish to'lqin uzunligi. ε = 85 M⁻¹cm⁻¹ — past sezgirlik (d-d o'tish)." },
    { step: 7, title: "Job grafigini qurish", desc: "A·(1-xL) vs xL grafigi quriladi. Maksimum xL = 0.75 da — bu 1:3 stoxiometriyani ko'rsatadi.", time: "10 daq", critical: false, theory: "Job metodi: A·(1-xL) vs xL grafigi maksimumi xL = n/(n+m) da bo'ladi. 1:3 stoxiometriya uchun xL = 0.75." },
    { step: 8, title: "β₃ hisoblash (Benesi-Hildebrand)", desc: "Benesi-Hildebrand metodi yordamida β₃ hisoblanadi. 1/(A-A₀) vs 1/[en] grafigi quriladi. log β₃ = 18.6.", time: "5 daq", critical: false, theory: "Benesi-Hildebrand: 1/(A-A₀) = 1/(ε·[Ni²⁺]·β₃) + 1/(ε·[Ni²⁺]·β₃·[en]). Chiziqli grafik β₃ ni aniqlash imkonini beradi." },
    { step: 9, title: "Natijalarni tahlil qilish", desc: "3 ta o'lchashning o'rtacha qiymati hisoblanadi. RSD < 2% bo'lishi kerak. Beer-Lambert qonuni bajarilishi tekshiriladi.", time: "5 daq", critical: false, theory: "RSD (nisbiy standart chetlanish) < 2% bo'lishi kerak. Bu o'lchashlarning aniqligini ko'rsatadi. Beer-Lambert qonuni: A = ε·l·c." },
    { step: 10, title: "Tozalash va saqlash", desc: "Kyuvetalar distillangan suv bilan yuviladi. Eritma saqlanadi (qorong'i, 4°C). Natijalar hujjatlashtiriladi. Chiqindilar maxsus idishga yig'iladi (en zaharli).", time: "5 daq", critical: false, theory: "Eritma qorong'ida saqlanishi kerak — yorug'lik ta'sirida parchalanishi mumkin. en zaharli bo'lgani uchun chiqindilar maxsus idishga yig'ilishi kerak." }
  ],

  relatedMethods: [
    {
      name: "UV-Vis spektroskopiya",
      role: "Spektrlarni qayd etish va tahlil qilish",
      condAdvantage: "Tez va aniq spektral ma'lumotlar, ε = 85 M⁻¹cm⁻¹ — past sezgirlik (d-d o'tish)",
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
      condAdvantage: "Strukturaviy ma'lumotlar",
      condDisadvantage: "Diamagnit moddalar uchun (Ni²⁺ paramagnit)",
      complementarity: "60%"
    },
    {
      name: "EPR spektroskopiya",
      role: "Elektron paramagnit rezonans",
      condAdvantage: "Paramagnit moddalar uchun (Ni²⁺, d⁸, yuqori spin)",
      condDisadvantage: "Faqat paramagnit moddalar",
      complementarity: "90%"
    },
    {
      name: "EXAFS spektroskopiya",
      role: "Kengaytirilgan rentgen nurlari yutilish nozik tuzilishi",
      condAdvantage: "Mahalliy strukturani aniqlash (Ni-N masofalari)",
      condDisadvantage: "Sinxrotron nurlari kerak",
      complementarity: "85%"
    }
  ]
}

export default function NiEn3SpectrophotometricPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeRun, setActiveRun] = useState("SPEC-24-001")
  const [activeWerner, setActiveWerner] = useState(0)
  const [concSlider, setConcSlider] = useState(0.001)
  const [tempSlider, setTempSlider] = useState(25)
  const [solventSlider, setSolventSlider] = useState(0)
  const [wavelengthSlider, setWavelengthSlider] = useState(540)
  const [jobSlider, setJobSlider] = useState(0.75)
  
  // Job metodi kalkulyatori
  const [metalConc, setMetalConc] = useState(0.001)
  const [ligandConc, setLigandConc] = useState(0.003)
  
  // βn kalkulyatori
  const [betaValue, setBetaValue] = useState(18.6)
  const [metalConcBeta, setMetalConcBeta] = useState(0.001)
  const [ligandConcBeta, setLigandConcBeta] = useState(0.003)
  
  // Benesi-Hildebrand kalkulyatori
  const [absorbance, setAbsorbance] = useState(0.85)
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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-pink-950/20 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-pink-950 to-purple-950 border-2 border-pink-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">📊</span> TRIS(ETILENDIAMIN)NIKEL(II) — XELAT EFFEKTİ!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-pink-300">[Ni(en)₃]²⁺</strong> — tris(etilendiamin)nikel(II), xelat effektining klassik namunasi. 
              Binafsha rang, λmax = 540 nm, log β₃ = 18.6.
            </p>
            
            <div className="bg-pink-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-pink-400 font-bold mb-2">📊 Nima o'lchanadi?</div>
                  <div className="text-purple-200">
                    <strong>Barqarorlik konstantasi (β₃)</strong> — log β₃ = 18.6.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Stoxiometriya</strong> — 1:3 (ML₃).
                  </div>
                </div>
                <div>
                  <div className="text-pink-400 font-bold mb-2">🔬 Qanday ishlaydi?</div>
                  <div className="text-purple-200">
                    <strong>Job metodi</strong> — xL = 0.75 da maksimum.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Izosbestik nuqtalar</strong> — 420, 540 nm.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-pink-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-pink-300">Xelat effekti:</strong> log β₃ = 18.6 — juda yuqori barqarorlik. 
                3 ta bidentat ligand 6 ta monodentat ligand o'rnini egallaydi.
              </p>
            </div>

            <div className="bg-pink-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-pink-300">d-d o'tish:</strong> λmax = 540 nm, ε = 85 M⁻¹cm⁻¹. 
                Bu d-d o'tish natijasida yuzaga keladi (spin-taqiqlangan o'tish).
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
              <Link href="/ilmiy/tahlil/titrlash" className="hover:text-purple-300">Spektrofotometrik titrlash</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/titrlash/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-pink-400 font-semibold">[Ni(en)₃]²⁺</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-pink-400 flex items-center gap-2">
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
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">1:3 elektrolit</span>
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">log β₃ = 18.6</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">λmax = 540 nm</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">ε = 85</span>
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
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-pink-600 hover:bg-pink-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Birikma haqida (spektrofotometrik titrlash uchun)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Ni(en)₃]²⁺</strong> — tris(etilendiamin)nikel(II), xelat effektining klassik namunasi. Spektrofotometrik titrlashda <strong className="text-pink-300">1:3 elektrolit</strong> — 4 ta ion borligini ko'rsatadi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-pink-500 text-xs md:text-sm">
                <li><strong className="text-white">Ni²⁺ (d⁸, yuqori spin)</strong> — oktaedr geometriya</li>
                <li><strong className="text-white">3 ta en</strong> ichki sferada (Ni²⁺ ga bog'langan)</li>
                <li><strong className="text-pink-300">log β₃ = 18.6</strong> — juda yuqori barqarorlik</li>
                <li><strong className="text-pink-300">λmax = 540 nm</strong> — binafsha rang</li>
                <li><strong className="text-pink-300">ε = 85 M⁻¹cm⁻¹</strong> — past sezgirlik (d-d o'tish)</li>
                <li><strong className="text-pink-300">Izosbestik nuqtalar</strong> — 420, 540 nm</li>
                <li><strong className="text-pink-300">Job metodi</strong> — xL = 0.75 → 1:3</li>
                <li><strong className="text-pink-300">Paramagnit</strong> — μ ≈ 3.2 BM (2 toq elektron)</li>
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
              <div key={i} className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-4">
                <h3 className="text-pink-400 font-bold text-sm mb-2">{fact.title}</h3>
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
            <strong className="text-pink-400">Umumiy barqarorlik konstantasi (β₃)</strong> — Ni²⁺ ioniga 
            3 ta en ligand birikishi natijasida hosil bo'lgan kompleksning termodinamik barqarorligini ifodalaydi.
            log β₃ = 18.6 — bu juda yuqori barqarorlikni ko'rsatadi, xelat effekti tufayli.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-pink-400 font-bold mb-3">Bosqichli konstantalar:</h3>
            <div className="space-y-3 text-sm text-purple-200">
              {COMPOUND.stepwiseConstants.map((step) => (
                <div key={step.step} className="bg-pink-600/10 border border-pink-500/30 rounded-lg p-3">
                  <p className="font-mono">{step.reaction} &nbsp;&nbsp;&nbsp; log K{step.step} = {step.logK}</p>
                  <p className="text-xs text-purple-400 mt-1">{step.step}-bosqich konstantasi — {step.species} ({step.color})</p>
                </div>
              ))}
              <div className="bg-pink-600/10 border border-pink-500/30 rounded-lg p-3">
                <p className="font-mono">β₃ = K₁ · K₂ · K₃ = 10^18.6</p>
                <p className="text-xs text-purple-400 mt-1">Umumiy barqarorlik konstantasi — juda yuqori barqarorlik</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SPEKTRAL GRAFIK — INTERAKTIV */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Spektral grafik — to'lqin uzunligi vs absorbsiya</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-pink-400">Spektral grafik</strong> — to'lqin uzunligi (λ) vs absorbsiya (A). 
            λmax = 540 nm da maksimal yutilish kuzatiladi. Slayderni harakatlantirib, to'lqin uzunligini o'zgartiring.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-pink-400 font-bold mb-2">
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
              <span>540 nm (λmax)</span>
              <span>750 nm</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">To'lqin uzunligi:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentSpectral.wavelength} nm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Absorbsiya:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentSpectral.absorbance.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentSpectral.event}</div>
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
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.0)*200} x2="580" y2={220 - (v/1.0)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.0)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}</text>
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
                stroke="#ec4899" 
                strokeWidth="2"
                points={COMPOUND.spectralData.map(p => {
                  const x = 50 + ((p.wavelength - 350)/400)*530
                  const y = 220 - (p.absorbance/1.0)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              <line 
                x1={50 + ((540 - 350)/400)*530} 
                y1="30" 
                x2={50 + ((540 - 350)/400)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <text x={50 + ((540 - 350)/400)*530} y="25" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">λmax = 540 nm</text>

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
                cy={220 - (currentSpectral.absorbance/1.0)*200} 
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
            <strong className="text-pink-400">Job metodi</strong> — xL (ligand mol ulushi) vs A·(1-xL). 
            Maksimum xL = 0.75 da — bu 1:3 stoxiometriyani ko'rsatadi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-pink-400 font-bold mb-2">
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
              <span>0.0 (faqat Ni²⁺)</span>
              <span>0.75 (MAKSIMUM)</span>
              <span>1.0 (faqat en)</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">xL:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentJob.xL.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">A·(1-xL):</div>
                <div className="text-xl font-mono font-bold text-pink-400">{(currentJob.absorbance * (1 - currentJob.xL)).toFixed(3)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentJob.event}</div>
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
                stroke="#ec4899" 
                strokeWidth="2"
                points={COMPOUND.jobMethodData.map(p => {
                  const x = 50 + (p.xL)*530
                  const y = 220 - ((p.absorbance * (1 - p.xL))/0.8)*200
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
        <div className="bg-pink-900/20 border border-pink-500/30 rounded-2xl p-8">
          <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2">
            <span>🔬</span> Job metodi kalkulyatori — uzluksiz variatsiyalar
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Metall va ligand konsentratsiyalarini kiriting — <strong className="text-pink-300">stoxiometriya</strong> aniqlanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Ni²⁺] metall konsentratsiyasi (M):</label>
              <input
                type="number"
                step="0.0001"
                value={metalConc}
                onChange={(e) => setMetalConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[en] ligand konsentratsiyasi (M):</label>
              <input
                type="number"
                step="0.0001"
                value={ligandConc}
                onChange={(e) => setLigandConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Ligand mol ulushi (xL):</div>
                <div className="text-xl font-mono font-bold text-pink-400">{jobResult.xL}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Stoxiometriya:</div>
                <div className={`text-xl font-mono font-bold ${jobResult.stox.includes("1:3") ? 'text-green-400' : jobResult.stox.includes("1:2") ? 'text-blue-400' : jobResult.stox.includes("1:1") ? 'text-yellow-400' : 'text-yellow-400'}`}>{jobResult.stox}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: xL = [en] / ([Ni²⁺] + [en]) = {ligandConc} / ({metalConc} + {ligandConc}) = {jobResult.xL}
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Eslatma:</strong> xL = 0.50 → 1:1, xL = 0.67 → 1:2, xL = 0.75 → 1:3, xL = 0.80 → 1:4
            </p>
          </div>
        </div>

        {/* 6. βn KALKULYATORI */}
        <div className="bg-pink-900/20 border border-pink-500/30 rounded-2xl p-8">
          <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Barqarorlik konstantasi kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            log β₃ ni kiriting — <strong className="text-pink-300">ΔG°</strong> hisoblanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">log β₃:</label>
              <input
                type="number"
                step="0.1"
                value={betaValue}
                onChange={(e) => setBetaValue(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Ni²⁺] (M):</label>
              <input
                type="number"
                step="0.0001"
                value={metalConcBeta}
                onChange={(e) => setMetalConcBeta(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[en] (M):</label>
              <input
                type="number"
                step="0.0001"
                value={ligandConcBeta}
                onChange={(e) => setLigandConcBeta(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">β₃:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{Math.pow(10, betaValue).toExponential(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">ΔG° (kJ/mol):</div>
                <div className="text-xl font-mono font-bold text-pink-400">{betaResult.deltaG}</div>
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
              <label className="block text-xs text-purple-400 mb-1">[en] ligand (M):</label>
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
                <div className="text-xs text-purple-400">1/[en]:</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{bhResult.invLigand}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: 1/(A-A₀) = 1/(ε·[Ni²⁺]·β₃) + 1/(ε·[Ni²⁺]·β₃·[en])
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Eslatma:</strong> 1/A vs 1/[en] grafigi chiziqli bo'lsa, β₃ hisoblanadi.
            </p>
          </div>
        </div>

        {/* 8. IZOSBESTIK NUQTALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Izosbestik nuqtalar — muvozanat ko'rsatkichi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-pink-400">Izosbestik nuqta</strong> — turli konsentratsiyalarda 
            olingan spektrlarning <strong>kesishgan nuqtasi</strong>. [Ni(en)₃]²⁺ uchun izosbestik nuqtalar: 420, 540 nm.
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
                <strong>[Ni(en)]²⁺, [Ni(en)₂]²⁺, [Ni(en)₃]²⁺</strong> — bir nechta kompleks shakllari muvozanatda.
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
                    ? "bg-pink-900/40 border-2 border-pink-400" 
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-pink-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeStep === step.step ? "bg-pink-500 text-white" : "bg-purple-800 text-purple-400"
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
                {activeStep === step.step && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-3 mt-2">
                      <div className="text-pink-400 font-bold text-xs mb-1">📚 Nazariy asos:</div>
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
                <div className="text-xl font-mono font-bold text-pink-400">{run.absorbance}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">λmax (nm):</div>
                <div className="text-xl font-mono font-bold text-pink-400">{run.lambdaMax}</div>
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

        {/* 11. KENGAYTIRUVCHI METODLAR */}
        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Kengaytiruvchi metodlar — spektrofotometrik titrlashga qo'shimcha
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
              <strong className="text-white">Spektrofotometrik titrlash (β₃, stoxiometriya) + UV-Vis (spektrlar) + EPR (paramagnit Ni²⁺) + EXAFS (mahalliy struktura) + Kalorimetriya (ΔH, ΔS)</strong> — besh metod birgalikda [Ni(en)₃]²⁺ ni to'liq tavsiflaydi.
            </p>
          </div>
        </div>

        {/* XULOSALAR */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Spektrofotometrik titrlash — <strong className="text-pink-400">barqarorlik konstantalarini aniqlashning asosiy usuli</strong></li>
            <li>Umumiy barqarorlik konstantasi β₃ — <strong className="text-pink-400">log β₃ = 18.6</strong> (juda yuqori barqarorlik)</li>
            <li>Job metodi — <strong className="text-pink-400">xL = 0.75 → 1:3 stoxiometriya</strong></li>
            <li>Izosbestik nuqtalar — <strong className="text-pink-400">420, 540 nm</strong></li>
            <li>d-d o'tish — <strong className="text-pink-400">λmax = 540 nm, ε = 85 M⁻¹cm⁻¹</strong></li>
            <li>Paramagnit — <strong className="text-pink-400">μ ≈ 3.2 BM (2 toq elektron)</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/titrlash" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Spektrofotometrik titrlash</Link>
          <Link href="/ilmiy/tahlil/titrlash/birikmalar" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold">Barcha birikmalar →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Ni(en)₃]²⁺ • Spektrofotometrik titrlash moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry), Job (1928)</p>
        </div>
      </footer>
    </main>
  )
}