"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Cu(salen)] — SPEKTROFOTOMETRIK TAHLIL MAHSUS SAHIFASI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry)
// Xususiyat: Mis(II) salen kompleksi, Schiff asos kompleksi, tetradentat ligand
// O'ziga xoslik: log β ≈ 22, yashil rang, paramagnit (d⁹), neytral kompleks
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Cu: 63.546, C: 12.011, H: 1.008, N: 14.007, O: 15.999
}

const COMPOUND = {
  formulaHTML: "[Cu(salen)]",
  formulaPlain: "[Cu(salen)]",
  iupac: "N,N'-bis(salitsiliden)etilendiaminmis(II)",
  formulaExpanded: "CuC₁₆H₁₆N₂O₂",
  commonName: "Mis(II) salen (yashil)",
  molarMass: 325.84,
  casNumber: "14284-95-2",
  color: "yashil (green)",
  stability: "Yuqori barqarorlik (log β ≈ 22, xelat effekti)",
  lambdaMax: 540,
  logBeta: 22.0,
  stox: "1:1",
  molarAbsorptivity: 320,
  isosbesticPoints: "420, 540 nm",
  jobMethod: "xL = 0.50 → 1:1 (ML)",
  
  wernerInfo: {
    wernerGroup: "Neytral kompleks guruhi",
    electrolyteType: "Neytral kompleks",
    ions: 0,
    lm: 0,
    formula_verner: "[Cu(salen)] (neytral)",
    wernerProof: "Werner va keyingi kimyogarlar konduktometrik o'lchashlar orqali salen ligandning ichki sferada ekanligini isbotladi. Neytral kompleks — ionlar yo'q."
  },

  historicalFact: {
    title: "Schiff asos kompleksi — mis(II) salen",
    text: "[Cu(salen)] — mis(II) ning salen kompleksi, Schiff asos komplekslarining klassik namunasi. Salen (N,N'-bis(salitsiliden)etilendiamin) tetradentat ligand — 2 ta N va 2 ta O atomi orqali Cu²⁺ ga bog'lanadi.",
    textExtended: "1864-yilda Hugo Schiff Schiff asoslarini kashf etdi. Salen tetradentat ligand bo'lib, 2 ta N va 2 ta O atomi orqali metallga bog'lanadi. Bu 2 ta 6 a'zoli xelat halqa hosil qiladi. Cu²⁺ (d⁹, yuqori spin) paramagnit — 1 ta toq elektron (μ ≈ 1.9 BM). Bu kompleks yashil rang beradi (λmax = 540 nm, d-d o'tish). log β ≈ 22 — yuqori barqarorlik, xelat effekti tufayli. Bu kompleks suvda erimaydi, organik erituvchilarda (DMF, DMSO) eriydi. Bu kompleks EPR spektroskopiya uchun mos (paramagnit)."
  },

  interestingFacts: [
    {
      title: "Schiff asos kompleksi — tetradentat ligand",
      fact: "[Cu(salen)] — Schiff asos kompleksi. Salen tetradentat ligand — 2 ta N va 2 ta O atomi orqali Cu²⁺ ga bog'lanadi. Bu 2 ta 6 a'zoli xelat halqa hosil qiladi."
    },
    {
      title: "Xelat effekti — 10¹⁴ marta barqarorlik",
      fact: "[Cu(salen)] (log β ≈ 22) [Cu(H₂O)₆]²⁺ dan 10¹⁴ marta barqaror. Sababi: entropiya ortishi — tetradentat ligand 4 ta monodentat ligand o'rnini egallaydi."
    },
    {
      title: "Yashil rang — d-d o'tish",
      fact: "λmax = 540 nm, ε = 320 M⁻¹cm⁻¹. Bu d-d o'tish natijasida yuzaga keladi. Yashil rang — past sezgirlik (spin-taqiqlangan o'tish)."
    },
    {
      title: "Paramagnit kompleks — EPR uchun mos",
      fact: "Cu²⁺ (d⁹, yuqori spin) paramagnit — 1 ta toq elektron (μ ≈ 1.9 BM). Bu EPR spektroskopiya uchun mos. EPR signallari Cu²⁺ ning elektron tuzilishini ko'rsatadi."
    },
    {
      title: "Job metodi (uzluksiz variatsiyalar)",
      fact: "Job metodi yordamida stoxiometriya aniqlangan. xL = 0.50 da maksimum — bu 1:1 stoxiometriyani ko'rsatadi."
    },
    {
      title: "Jahn-Teller effekti — cho'zilgan oktaedr",
      fact: "Cu²⁺ (d⁹) Jahn-Teller effekti tufayli oktaedr geometriya cho'zilgan. Salen ligand ekvatorial tekislikda, aksial pozitsiyalar cho'zilgan."
    }
  ],

  conductometricFeature: {
    title: "[Cu(salen)] — Neytral kompleks, log β ≈ 22",
    description: "Bu kompleks spektrofotometrik titrlashda klassik namuna hisoblanadi. Salen ligand ichki sferada — Cu²⁺ ga bog'langan. Neytral kompleks — ionlar yo'q.",
    reaction: {
      dissociation: "[Cu(salen)] ⇌ Cu²⁺ + salen²⁻",
      ions: "Cu²⁺ + salen²⁻",
      electrolyteType: "Neytral kompleks",
      lm_theoretical: "log β ≈ 22.0 (25°C)"
    },
    problem: {
      title: "Xelat effekti — juda yuqori barqarorlik",
      description: "log β ≈ 22 — juda yuqori barqarorlik. Kompleks juda barqaror va sekin parchalanadi.",
      impact: "Bu titrlash uchun qulay — kompleks barqaror. Lekin o'lchashlar aniq bajarilishi kerak."
    },
    solution: {
      title: "Job metodi va Benesi-Hildebrand",
      description: "Job metodi yordamida stoxiometriya aniqlanadi. Benesi-Hildebrand metodi yordamida β hisoblanadi.",
      mechanism: "1/(A-A₀) vs 1/[salen²⁻] grafigi chiziqli bo'lsa, β hisoblanadi."
    }
  },

  conductometricParameters: {
    cellConstant: "K = 1.0 cm⁻¹ (standart)",
    frequency: "1-4 kHz (o'zgaruvchan tok)",
    temperature: "25°C (standart)",
    concentration: "10⁻³ M (standart)",
    solvent: "DMF yoki DMSO",
    measurementTime: "2-3 daqiqa"
  },

  theoretical: {
    Cu:  { mass: 63.546,  percent: 19.50, source: "Cu²⁺ markaziy atom (ichki sfera)", conductSignal: "[Cu(salen)] neytral — o'tkazuvchanlikka hissa qo'shmaydi" },
    C:   { mass: 192.176, percent: 58.98, source: "salen (16×C, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" },
    H:   { mass: 16.128,  percent: 4.95,  source: "salen (16×H, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" },
    N:   { mass: 28.014,  percent: 8.60,  source: "salen (2×N, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" },
    O:   { mass: 31.998,  percent: 9.82,  source: "salen (2×O, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" }
  },

  // Spektral ma'lumotlar — to'lqin uzunligi vs absorbsiya
  spectralData: [
    { wavelength: 350, absorbance: 0.10, event: "UV sohasi", theoryNote: "Past yutilish — UV sohasi" },
    { wavelength: 380, absorbance: 0.20, event: "UV-Vis chegarasi", theoryNote: "Yutilish boshlanadi" },
    { wavelength: 420, absorbance: 0.40, event: "Izosbestik nuqta", theoryNote: "Izosbestik nuqta — muvozanat ko'rsatkichi" },
    { wavelength: 450, absorbance: 0.50, event: "Ko'k-binafsha soha", theoryNote: "Yutilish ortadi" },
    { wavelength: 480, absorbance: 0.60, event: "Ko'k soha", theoryNote: "Maksimal yutilishga yaqin" },
    { wavelength: 510, absorbance: 0.65, event: "Yashil-ko'k soha", theoryNote: "Maksimal yutilishga yaqin" },
    { wavelength: 540, absorbance: 0.65, event: "λmax — maksimal yutilish", theoryNote: "Maksimal yutilish — d-d o'tish" },
    { wavelength: 580, absorbance: 0.50, event: "Sariq soha", theoryNote: "Yutilish kamayadi" },
    { wavelength: 620, absorbance: 0.30, event: "To'q sariq soha", theoryNote: "Past yutilish" },
    { wavelength: 650, absorbance: 0.15, event: "Qizil soha", theoryNote: "Past yutilish" },
    { wavelength: 700, absorbance: 0.08, event: "Qizil soha", theoryNote: "Juda past yutilish" },
    { wavelength: 750, absorbance: 0.05, event: "Infraqizil soha", theoryNote: "Juda past yutilish" }
  ],

  // Job metodi ma'lumotlari
  jobMethodData: [
    { xL: 0.0, absorbance: 0.0, corrected: 0.0, event: "Faqat Cu²⁺", theoryNote: "Faqat metall ioni — kompleks yo'q" },
    { xL: 0.1, absorbance: 0.10, corrected: 0.10, event: "Kam ligand", theoryNote: "Kam kompleks hosil bo'ladi" },
    { xL: 0.2, absorbance: 0.22, corrected: 0.22, event: "Kam ligand", theoryNote: "Kompleks hosil bo'lishi boshlanadi" },
    { xL: 0.3, absorbance: 0.35, corrected: 0.35, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.4, absorbance: 0.48, corrected: 0.48, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.5, absorbance: 0.55, corrected: 0.55, event: "1:1 stoxiometriya — MAKSIMUM", theoryNote: "MAKSIMUM — 1:1 stoxiometriya (ML)" },
    { xL: 0.6, absorbance: 0.50, corrected: 0.50, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 0.7, absorbance: 0.42, corrected: 0.42, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 0.8, absorbance: 0.32, corrected: 0.32, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 0.9, absorbance: 0.20, corrected: 0.20, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 1.0, absorbance: 0.10, corrected: 0.10, event: "Faqat salen", theoryNote: "Faqat ligand — kompleks yo'q" }
  ],

  // Bosqichli konstantalar (1:1 kompleks uchun faqat 1 bosqich)
  stepwiseConstants: [
    { step: 1, reaction: "Cu²⁺ + salen²⁻ ⇌ [Cu(salen)]", logK: 22.0, K: "1.00×10²²", species: "[Cu(salen)]", color: "yashil" }
  ],

  conductometricData: [
    { conc: 0.0001, lm: 0.0, kappa: 0.0000, event: "Juda suyultirilgan", theoryNote: "Neytral kompleks — o'tkazuvchanlik yo'q" },
    { conc: 0.0005, lm: 0.0, kappa: 0.0000, event: "Juda suyultirilgan", theoryNote: "Neytral kompleks — o'tkazuvchanlik yo'q" },
    { conc: 0.001, lm: 0.0, kappa: 0.0000, event: "Standart konsentratsiya", theoryNote: "Neytral kompleks — o'tkazuvchanlik yo'q" },
    { conc: 0.005, lm: 0.0, kappa: 0.0000, event: "O'rta konsentratsiya", theoryNote: "Neytral kompleks — o'tkazuvchanlik yo'q" },
    { conc: 0.01, lm: 0.0, kappa: 0.0000, event: "O'rta konsentratsiya", theoryNote: "Neytral kompleks — o'tkazuvchanlik yo'q" },
    { conc: 0.05, lm: 0.0, kappa: 0.0000, event: "Yuqori konsentratsiya", theoryNote: "Neytral kompleks — o'tkazuvchanlik yo'q" },
    { conc: 0.1, lm: 0.0, kappa: 0.0000, event: "Yuqori konsentratsiya", theoryNote: "Neytral kompleks — o'tkazuvchanlik yo'q" },
    { conc: 0.5, lm: 0.0, kappa: 0.0000, event: "Juda yuqori konsentratsiya", theoryNote: "Neytral kompleks — o'tkazuvchanlik yo'q" },
    { conc: 1.0, lm: 0.0, kappa: 0.0000, event: "Juda yuqori konsentratsiya", theoryNote: "Neytral kompleks — o'tkazuvchanlik yo'q" }
  ],

  solventData: [
    { solvent: "DMF (Dimetilformamid)", dielectric: 36.7, lm: 0.0, kappa: 0.0000, color: "yashil", note: "Qutbli organik erituvchi — eng yaxshi erituvchi" },
    { solvent: "DMSO (Dimetilsulfoksid)", dielectric: 46.7, lm: 0.0, kappa: 0.0000, color: "yashil", note: "Qutbli organik erituvchi" },
    { solvent: "Xloroform (CHCl₃)", dielectric: 4.8, lm: 0.0, kappa: 0.0000, color: "yashil", note: "Organik erituvchi" },
    { solvent: "Aseton ((CH₃)₂CO)", dielectric: 20.7, lm: 0.0, kappa: 0.0000, color: "yashil", note: "Organik erituvchi" },
    { solvent: "Etanol (C₂H₅OH)", dielectric: 24.3, lm: 0.0, kappa: 0.0000, color: "yashil", note: "Organik erituvchi" },
    { solvent: "Suv (H₂O)", dielectric: 78.5, lm: 0.0, kappa: 0.0000, color: "erimaydi", note: "Suvda erimaydi — neytral kompleks" }
  ],

  temperatureData: [
    { temp: 15, lm: 0.0, kappa: 0.0000, note: "Past temperatura — neytral kompleks" },
    { temp: 20, lm: 0.0, kappa: 0.0000, note: "Xona temperaturasi" },
    { temp: 25, lm: 0.0, kappa: 0.0000, note: "Standart temperatura (25°C)" },
    { temp: 30, lm: 0.0, kappa: 0.0000, note: "Yuqori temperatura" },
    { temp: 40, lm: 0.0, kappa: 0.0000, note: "Yuqori temperatura" },
    { temp: 50, lm: 0.0, kappa: 0.0000, note: "Juda yuqori temperatura" }
  ],

  wernerComparison: [
    { complex: "[Cu(salen)]", formula: "Cu²⁺ + salen²⁻", ions: 0, lm: 0, type: "Neytral", color: "yashil", colorCode: "text-green-400" },
    { complex: "[Fe(acac)₃]", formula: "Fe³⁺ + 3acac⁻", ions: 0, lm: 0, type: "Neytral", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Zn(phen)₃]²⁺", formula: "Zn²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "rangsiz", colorCode: "text-gray-400" },
    { complex: "[Cu(en)₂]²⁺", formula: "Cu²⁺ + 2en", ions: 3, lm: 270, type: "1:2", color: "ko'k", colorCode: "text-blue-400" },
    { complex: "[Ag(NH₃)₂]⁺", formula: "Ag⁺ + 2NH₃", ions: 3, lm: 270, type: "1:2", color: "rangsiz", colorCode: "text-gray-400" },
    { complex: "[Fe(CN)₆]⁴⁻", formula: "Fe²⁺ + 6CN⁻", ions: 5, lm: 540, type: "4:1", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Co(NH₃)₆]³⁺", formula: "Co³⁺ + 6NH₃", ions: 4, lm: 432, type: "1:3", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Cu(phen)₃]²⁺", formula: "Cu²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Fe(phen)₃]²⁺", formula: "Fe²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Fe(SCN)]²⁺", formula: "Fe³⁺ + SCN⁻", ions: 2, lm: 250, type: "1:1", color: "qon qizil", colorCode: "text-red-400" },
    { complex: "[Cu(NH₃)₄]²⁺", formula: "Cu²⁺ + 4NH₃", ions: 5, lm: 340, type: "1:4", color: "to'q ko'k", colorCode: "text-blue-400" },
    { complex: "[Ni(en)₃]²⁺", formula: "Ni²⁺ + 3en", ions: 4, lm: 435, type: "1:3", color: "binafsha", colorCode: "text-pink-400" }
  ],

  experimentalRuns: [
    { 
      id: "SPEC-24-001", 
      date: "2026-12-15", 
      concentration: 0.001, 
      absorbance: 0.65, 
      lambdaMax: 540, 
      ions: 0, 
      type: "Neytral kompleks",
      note: "Toza [Cu(salen)] — DMF da",
      theoryNote: "Standart sharoitda A = 0.65, λmax = 540 nm. Bu [Cu(salen)] ning yashil rangini ko'rsatadi (d-d o'tish)."
    },
    { 
      id: "SPEC-24-002", 
      date: "2026-12-15", 
      concentration: 0.001, 
      absorbance: 0.66, 
      lambdaMax: 540, 
      ions: 0, 
      type: "Neytral kompleks",
      note: "Ikkinchi o'lchash — takrorlanish",
      theoryNote: "Takrorlanish — natijalar bir xil (A ≈ 0.66)."
    },
    { 
      id: "SPEC-24-003", 
      date: "2026-12-16", 
      concentration: 0.0005, 
      absorbance: 0.33, 
      lambdaMax: 540, 
      ions: 0, 
      type: "Neytral kompleks",
      note: "Past konsentratsiya (5×10⁻⁴ M)",
      theoryNote: "Beer-Lambert qonuni: A konsentratsiyaga proporsional. A ≈ 0.33."
    },
    { 
      id: "SPEC-24-004", 
      date: "2026-12-16", 
      concentration: 0.002, 
      absorbance: 1.30, 
      lambdaMax: 540, 
      ions: 0, 
      type: "Neytral kompleks",
      note: "Yuqori konsentratsiya (2×10⁻³ M)",
      theoryNote: "A ≈ 1.30 — Beer-Lambert qonuni bajariladi."
    },
    { 
      id: "SPEC-24-005", 
      date: "2026-12-17", 
      concentration: 0.001, 
      absorbance: 0.65, 
      lambdaMax: 540, 
      ions: 0, 
      type: "Neytral kompleks",
      note: "Job metodi — xL = 0.50 da maksimum",
      theoryNote: "Job metodi: xL = 0.50 da maksimum — bu 1:1 stoxiometriyani ko'rsatadi."
    },
    { 
      id: "SPEC-24-006", 
      date: "2026-12-17", 
      concentration: 0.001, 
      absorbance: 0.65, 
      lambdaMax: 540, 
      ions: 0, 
      type: "Neytral kompleks",
      note: "Izosbestik nuqtalar: 420, 540 nm",
      theoryNote: "Izosbestik nuqtalar — 420, 540 nm. Bu muvozanat ko'rsatkichi."
    }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Cu(salen)] zaharli, Cu²⁺ va salen zaharli. Qo'lqop, himoya ko'zoynaklari va laboratoriya xalati majburiy. Ventilyatsiya zarur! Organik erituvchilar (DMF, DMSO) zaharli.", time: "doimiy", critical: true, theory: "Cu²⁺ ionlari teri va ko'zga zarar yetkazadi. salen (Schiff asos) zaharli — teri va ko'zga zarar yetkazadi. DMF va DMSO zaharli — ventilyatsiya zarur." },
    { step: 2, title: "Kerakli asboblar", desc: "Analitik tarozi (0.1 mg aniqlik), 100 mL o'lchov kolbasi, spektrofotometr (UV-Vis), kyuvetalar (1 sm yo'l uzunligi), pipetka, DMF, Cu²⁺ eritmasi (0.001 M), salen²⁻ eritmasi (0.001 M).", time: "5 daq", critical: true, theory: "Spektrofotometr 350-700 nm diapazonida ishlashi kerak. Kyuvetalar toza bo'lishi shart. Cu²⁺ va salen²⁻ eritmalari aniq konsentratsiyada bo'lishi kerak." },
    { step: 3, title: "Cu²⁺ eritmasini tayyorlash", desc: "Analitik tarozida Cu(NO₃)₂·3H₂O (24.16 mg) tortilib, 100 mL deionizatsiyalangan suvda eritiladi. 10⁻³ M eritma tayyorlanadi.", time: "10 daq", critical: true, theory: "Cu(NO₃)₂·3H₂O ning molyar massasi 241.60 g/mol. 10⁻³ M eritma uchun 24.16 mg kerak." },
    { step: 4, title: "salen²⁻ eritmasini tayyorlash", desc: "salen²⁻ eritmasi (0.001 M) tayyorlanadi. Bu ligand eritmasi. 0.001 M salen²⁻ uchun 26.62 mg salen²⁻ 100 mL DMF da eritiladi.", time: "5 daq", critical: true, theory: "salen²⁻ ning molyar massasi 266.24 g/mol. 0.001 M eritma uchun 26.62 mg kerak. salen²⁻ ligand eritmasi konsentratsiyasi aniq bo'lishi kerak." },
    { step: 5, title: "Job metodi uchun eritmalarni tayyorlash", desc: "10 ta eritma tayyorlanadi: [Cu²⁺] + [salen²⁻] = const = 10⁻³ M. xL = 0 dan 1 gacha o'zgartiriladi. Har bir eritma uchun 10 mL.", time: "15 daq", critical: true, theory: "Job metodi: umumiy konsentratsiya o'zgarmas. xL = [salen²⁻] / ([Cu²⁺] + [salen²⁻]). xL = 0.50 da maksimum bo'lishi kerak." },
    { step: 6, title: "Spektrofotometrik o'lchash", desc: "Har bir eritmaning UB-Vis spektri qayd etiladi (350-700 nm). λmax = 540 nm da absorbsiya o'lchanadi. Kyuvetalar toza bo'lishi shart.", time: "20 daq", critical: false, theory: "λmax = 540 nm — bu [Cu(salen)] ning maksimal yutilish to'lqin uzunligi. ε = 320 M⁻¹cm⁻¹ — past sezgirlik (d-d o'tish)." },
    { step: 7, title: "Job grafigini qurish", desc: "A·(1-xL) vs xL grafigi quriladi. Maksimum xL = 0.50 da — bu 1:1 stoxiometriyani ko'rsatadi.", time: "10 daq", critical: false, theory: "Job metodi: A·(1-xL) vs xL grafigi maksimumi xL = n/(n+m) da bo'ladi. 1:1 stoxiometriya uchun xL = 0.50." },
    { step: 8, title: "β hisoblash (Benesi-Hildebrand)", desc: "Benesi-Hildebrand metodi yordamida β hisoblanadi. 1/(A-A₀) vs 1/[salen²⁻] grafigi quriladi. log β ≈ 22.0.", time: "5 daq", critical: false, theory: "Benesi-Hildebrand: 1/(A-A₀) = 1/(ε·[Cu²⁺]·β) + 1/(ε·[Cu²⁺]·β·[salen²⁻]). Chiziqli grafik β ni aniqlash imkonini beradi." },
    { step: 9, title: "Natijalarni tahlil qilish", desc: "3 ta o'lchashning o'rtacha qiymati hisoblanadi. RSD < 2% bo'lishi kerak. Beer-Lambert qonuni bajarilishi tekshiriladi.", time: "5 daq", critical: false, theory: "RSD (nisbiy standart chetlanish) < 2% bo'lishi kerak. Bu o'lchashlarning aniqligini ko'rsatadi. Beer-Lambert qonuni: A = ε·l·c." },
    { step: 10, title: "Tozalash va saqlash", desc: "Kyuvetalar distillangan suv bilan yuviladi. Eritma saqlanadi (qorong'i, 4°C). Natijalar hujjatlashtiriladi. Chiqindilar maxsus idishga yig'iladi (organik erituvchilar).", time: "5 daq", critical: false, theory: "Eritma qorong'ida saqlanishi kerak — yorug'lik ta'sirida parchalanishi mumkin. Organik erituvchilar zaharli bo'lgani uchun chiqindilar maxsus idishga yig'ilishi kerak." }
  ],

  relatedMethods: [
    {
      name: "UV-Vis spektroskopiya",
      role: "Spektrlarni qayd etish va tahlil qilish",
      condAdvantage: "Tez va aniq spektral ma'lumotlar, ε = 320 M⁻¹cm⁻¹ — past sezgirlik",
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
      condDisadvantage: "Diamagnit moddalar uchun (Cu²⁺ paramagnit)",
      complementarity: "60%"
    },
    {
      name: "EPR spektroskopiya",
      role: "Elektron paramagnit rezonans",
      condAdvantage: "Paramagnit moddalar uchun (Cu²⁺, d⁹, yuqori spin)",
      condDisadvantage: "Faqat paramagnit moddalar",
      complementarity: "95%"
    },
    {
      name: "EXAFS spektroskopiya",
      role: "Kengaytirilgan rentgen nurlari yutilish nozik tuzilishi",
      condAdvantage: "Mahalliy strukturani aniqlash (Cu-N, Cu-O masofalari)",
      condDisadvantage: "Sinxrotron nurlari kerak",
      complementarity: "85%"
    }
  ]
}

export default function CuSalenSpectrophotometricPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeRun, setActiveRun] = useState("SPEC-24-001")
  const [activeWerner, setActiveWerner] = useState(0)
  const [concSlider, setConcSlider] = useState(0.001)
  const [tempSlider, setTempSlider] = useState(25)
  const [solventSlider, setSolventSlider] = useState(0)
  const [wavelengthSlider, setWavelengthSlider] = useState(540)
  const [jobSlider, setJobSlider] = useState(0.50)
  
  const [metalConc, setMetalConc] = useState(0.001)
  const [ligandConc, setLigandConc] = useState(0.001)
  
  const [betaValue, setBetaValue] = useState(22.0)
  const [metalConcBeta, setMetalConcBeta] = useState(0.001)
  const [ligandConcBeta, setLigandConcBeta] = useState(0.001)
  
  const [absorbance, setAbsorbance] = useState(0.65)
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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-green-950/20 to-blue-950 text-white">
      
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-green-950 to-purple-950 border-2 border-green-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">📊</span> MIS(II) SALEN — SCHIFF ASOS KOMPLEKSİ!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-green-300">[Cu(salen)]</strong> — mis(II) salen kompleksi, Schiff asos kompleksi. 
              Yashil rang, λmax = 540 nm, log β ≈ 22.
            </p>
            
            <div className="bg-green-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-green-400 font-bold mb-2">📊 Nima o'lchanadi?</div>
                  <div className="text-purple-200">
                    <strong>Barqarorlik konstantasi (β)</strong> — log β ≈ 22.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Stoxiometriya</strong> — 1:1 (ML).
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">🔬 Qanday ishlaydi?</div>
                  <div className="text-purple-200">
                    <strong>Job metodi</strong> — xL = 0.50 da maksimum.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Izosbestik nuqtalar</strong> — 420, 540 nm.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-green-300">Schiff asos kompleksi:</strong> Salen tetradentat ligand — 2 ta N va 2 ta O atomi orqali Cu²⁺ ga bog'lanadi. 
                Bu 2 ta 6 a'zoli xelat halqa hosil qiladi.
              </p>
            </div>

            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-green-300">d-d o'tish:</strong> λmax = 540 nm, ε = 320 M⁻¹cm⁻¹. 
                Bu d-d o'tish natijasida yuzaga keladi. Yashil rang.
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-green-400 font-semibold">[Cu(salen)]</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-green-400 flex items-center gap-2">
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
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Neytral kompleks</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">log β ≈ 22</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">λmax = 540 nm</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">ε = 320</span>
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
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-green-600 hover:bg-green-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-green-900/40 to-purple-900/40 border border-green-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Birikma haqida (spektrofotometrik titrlash uchun)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Cu(salen)]</strong> — mis(II) salen kompleksi, Schiff asos kompleksi. Spektrofotometrik titrlashda <strong className="text-green-300">neytral kompleks</strong> — ionlar yo'q.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-green-500 text-xs md:text-sm">
                <li><strong className="text-white">Cu²⁺ (d⁹)</strong> — paramagnit (μ ≈ 1.9 BM)</li>
                <li><strong className="text-white">salen ligand</strong> ichki sferada (tetradentat)</li>
                <li><strong className="text-green-300">log β ≈ 22</strong> — yuqori barqarorlik (xelat effekti)</li>
                <li><strong className="text-green-300">λmax = 540 nm</strong> — yashil rang (d-d o'tish)</li>
                <li><strong className="text-green-300">ε = 320 M⁻¹cm⁻¹</strong> — past sezgirlik (d-d o'tish)</li>
                <li><strong className="text-green-300">Izosbestik nuqtalar</strong> — 420, 540 nm</li>
                <li><strong className="text-green-300">Job metodi</strong> — xL = 0.50 → 1:1</li>
                <li><strong className="text-green-300">Neytral kompleks</strong> — organik erituvchilarda eriydi</li>
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
              <div key={i} className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <h3 className="text-green-400 font-bold text-sm mb-2">{fact.title}</h3>
                <p className="text-purple-200 text-xs">{fact.fact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. BARQARORLIK KONSTANTASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📐</span> Barqarorlik konstantasi (β) — kompleks mustahkamligi
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            <strong className="text-green-400">Umumiy barqarorlik konstantasi (β)</strong> — Cu²⁺ ioniga 
            salen ligand birikishi natijasida hosil bo'lgan kompleksning termodinamik barqarorligini ifodalaydi.
            log β ≈ 22 — bu yuqori barqarorlikni ko'rsatadi, xelat effekti tufayli.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-green-400 font-bold mb-3">Bosqichli konstantalar:</h3>
            <div className="space-y-3 text-sm text-purple-200">
              {COMPOUND.stepwiseConstants.map((step) => (
                <div key={step.step} className="bg-green-600/10 border border-green-500/30 rounded-lg p-3">
                  <p className="font-mono">{step.reaction} &nbsp;&nbsp;&nbsp; log K{step.step} = {step.logK}</p>
                  <p className="text-xs text-purple-400 mt-1">{step.step}-bosqich konstantasi — {step.species} ({step.color})</p>
                </div>
              ))}
              <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-3">
                <p className="font-mono">β = K₁ = 10^22.0</p>
                <p className="text-xs text-purple-400 mt-1">Umumiy barqarorlik konstantasi — yuqori barqarorlik</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SPEKTRAL GRAFIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Spektral grafik — to'lqin uzunligi vs absorbsiya</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">Spektral grafik</strong> — to'lqin uzunligi (λ) vs absorbsiya (A). 
            λmax = 540 nm da maksimal yutilish kuzatiladi. Slayderni harakatlantirib, to'lqin uzunligini o'zgartiring.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-green-400 font-bold mb-2">
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
                <div className="text-xl font-mono font-bold text-green-400">{currentSpectral.wavelength} nm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Absorbsiya:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentSpectral.absorbance.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentSpectral.event}</div>
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
                stroke="#22c55e" 
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

        {/* 4. JOB METODI GRAFIKI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Job metodi grafigi — uzluksiz variatsiyalar</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">Job metodi</strong> — xL (ligand mol ulushi) vs A·(1-xL). 
            Maksimum xL = 0.50 da — bu 1:1 stoxiometriyani ko'rsatadi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-green-400 font-bold mb-2">
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
              <span>0.0 (faqat Cu²⁺)</span>
              <span>0.50 (MAKSIMUM)</span>
              <span>1.0 (faqat salen)</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">xL:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentJob.xL.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">A·(1-xL):</div>
                <div className="text-xl font-mono font-bold text-green-400">{(currentJob.absorbance * (1 - currentJob.xL)).toFixed(3)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentJob.event}</div>
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
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.0)*200} x2="580" y2={220 - (v/1.0)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.0)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}</text>
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
                stroke="#22c55e" 
                strokeWidth="2"
                points={COMPOUND.jobMethodData.map(p => {
                  const x = 50 + (p.xL)*530
                  const y = 220 - ((p.absorbance * (1 - p.xL))/1.0)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              <line 
                x1={50 + (0.50)*530} 
                y1="30" 
                x2={50 + (0.50)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <text x={50 + (0.50)*530} y="25" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">xL = 0.50 → 1:1</text>

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
                cy={220 - ((currentJob.absorbance * (1 - currentJob.xL))/1.0)*200} 
                r="6" 
                fill="#fbbf24" 
                stroke="#fff" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* 5. JOB METODI KALKULYATORI */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8">
          <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
            <span>🔬</span> Job metodi kalkulyatori — uzluksiz variatsiyalar
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Metall va ligand konsentratsiyalarini kiriting — <strong className="text-green-300">stoxiometriya</strong> aniqlanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Cu²⁺] metall konsentratsiyasi (M):</label>
              <input
                type="number"
                step="0.0001"
                value={metalConc}
                onChange={(e) => setMetalConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-green-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[salen²⁻] ligand konsentratsiyasi (M):</label>
              <input
                type="number"
                step="0.0001"
                value={ligandConc}
                onChange={(e) => setLigandConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-green-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Ligand mol ulushi (xL):</div>
                <div className="text-xl font-mono font-bold text-green-400">{jobResult.xL}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Stoxiometriya:</div>
                <div className={`text-xl font-mono font-bold ${jobResult.stox.includes("1:1") ? 'text-green-400' : jobResult.stox.includes("1:2") ? 'text-blue-400' : 'text-yellow-400'}`}>{jobResult.stox}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: xL = [salen²⁻] / ([Cu²⁺] + [salen²⁻]) = {ligandConc} / ({metalConc} + {ligandConc}) = {jobResult.xL}
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Eslatma:</strong> xL = 0.50 → 1:1
            </p>
          </div>
        </div>

        {/* 6. βn KALKULYATORI */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8">
          <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Barqarorlik konstantasi kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            log β ni kiriting — <strong className="text-green-300">ΔG°</strong> hisoblanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">log β:</label>
              <input
                type="number"
                step="0.1"
                value={betaValue}
                onChange={(e) => setBetaValue(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-green-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Cu²⁺] (M):</label>
              <input
                type="number"
                step="0.0001"
                value={metalConcBeta}
                onChange={(e) => setMetalConcBeta(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-green-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[salen²⁻] (M):</label>
              <input
                type="number"
                step="0.0001"
                value={ligandConcBeta}
                onChange={(e) => setLigandConcBeta(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-green-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">β:</div>
                <div className="text-xl font-mono font-bold text-green-400">{Math.pow(10, betaValue).toExponential(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">ΔG° (kJ/mol):</div>
                <div className="text-xl font-mono font-bold text-green-400">{betaResult.deltaG}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: ΔG° = −RT·ln(β) = −8.314 × 298 × ln(10^{betaValue}) / 1000 = {betaResult.deltaG} kJ/mol
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
              <label className="block text-xs text-purple-400 mb-1">[salen²⁻] ligand (M):</label>
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
                <div className="text-xs text-purple-400">1/[salen²⁻]:</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{bhResult.invLigand}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: 1/(A-A₀) = 1/(ε·[Cu²⁺]·β) + 1/(ε·[Cu²⁺]·β·[salen²⁻])
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Eslatma:</strong> 1/A vs 1/[salen²⁻] grafigi chiziqli bo'lsa, β hisoblanadi.
            </p>
          </div>
        </div>

        {/* 8. IZOSBESTIK NUQTALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Izosbestik nuqtalar — muvozanat ko'rsatkichi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">Izosbestik nuqta</strong> — turli konsentratsiyalarda 
            olingan spektrlarning <strong>kesishgan nuqtasi</strong>. [Cu(salen)] uchun izosbestik nuqtalar: 420, 540 nm.
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
                <strong>[Cu(salen)]</strong> — kompleks muvozanatda.
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
                    ? "bg-green-900/40 border-2 border-green-400" 
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-green-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeStep === step.step ? "bg-green-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-green-400 font-bold">{step.title}</p>
                    {step.critical && (
                      <span className="text-[10px] text-red-400">KRITIK</span>
                    )}
                  </div>
                </div>
                {activeStep === step.step && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mt-2">
                      <div className="text-green-400 font-bold text-xs mb-1">📚 Nazariy asos:</div>
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
                      ? "bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/20"
                      : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-green-500"
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
                <div className="text-xl font-mono font-bold text-green-400">{run.absorbance}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">λmax (nm):</div>
                <div className="text-xl font-mono font-bold text-green-400">{run.lambdaMax}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ionlar soni:</div>
                <div className="text-xl font-mono font-bold text-green-400">{run.ions}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Elektrolit turi:</div>
                <div className="text-xl font-mono font-bold text-green-400">{run.type}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 11. KENGAYTIRUVCHI METODLAR */}
        <div className="bg-gradient-to-r from-green-900/40 to-purple-900/40 border border-green-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Kengaytiruvchi metodlar — spektrofotometrik titrlashga qo'shimcha
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-green-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-green-300">{m.name}</h3>
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

          <div className="mt-5 bg-green-900/20 border border-green-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-green-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">Spektrofotometrik titrlash (β, stoxiometriya) + UV-Vis (spektrlar) + EPR (paramagnit Cu²⁺) + EXAFS (mahalliy struktura) + Kalorimetriya (ΔH, ΔS)</strong> — besh metod birgalikda [Cu(salen)] ni to'liq tavsiflaydi.
            </p>
          </div>
        </div>

        {/* XULOSALAR */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Spektrofotometrik titrlash — <strong className="text-green-400">barqarorlik konstantalarini aniqlashning asosiy usuli</strong></li>
            <li>Umumiy barqarorlik konstantasi β — <strong className="text-green-400">log β ≈ 22</strong> (yuqori barqarorlik, xelat effekti)</li>
            <li>Job metodi — <strong className="text-green-400">xL = 0.50 → 1:1 stoxiometriya</strong></li>
            <li>Izosbestik nuqtalar — <strong className="text-green-400">420, 540 nm</strong></li>
            <li>d-d o'tish — <strong className="text-green-400">λmax = 540 nm, ε = 320 M⁻¹cm⁻¹</strong></li>
            <li>Paramagnit — <strong className="text-green-400">μ ≈ 1.9 BM (1 toq elektron, d⁹)</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/titrlash" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Spektrofotometrik titrlash</Link>
          <Link href="/ilmiy/tahlil/titrlash/birikmalar" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Barcha birikmalar →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Cu(salen)] (Mis(II) salen) • Spektrofotometrik titrlash moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry), Schiff (1864)</p>
        </div>
      </footer>
    </main>
  )
}