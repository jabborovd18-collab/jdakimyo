"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Fe(SCN)]²⁺ — SPEKTROFOTOMETRIK TITRLASH MAHSUS SAHIFASI (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry)
// Xususiyat: Temir(III) tiotsianat, qizil rang, 1:1 stoxiometriya, past barqarorlik
// O'ziga xoslik: log β₁ = 2.3, qon rangi, 447 nm, analitik kimyoda keng qo'llaniladi
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Fe: 55.845, S: 32.065, C: 12.011, N: 14.007
}

const COMPOUND = {
  formulaHTML: "[Fe(SCN)]<sup>2+</sup>",
  formulaPlain: "[Fe(SCN)]2+",
  iupac: "Tiotsianato-temir(III)",
  formulaExpanded: "FeSCN",
  commonName: "Temir(III) tiotsianat (qon qizil)",
  molarMass: 112.92,
  casNumber: "24479-37-8",
  color: "qon qizil (blood red)",
  stability: "Past barqarorlik",
  lambdaMax: 447,
  logBeta: 2.3,
  stox: "1:1",
  molarAbsorptivity: 4700,
  isosbesticPoints: "380, 520 nm",
  jobMethod: "xL = 0.50 → 1:1 (ML)",
  
  wernerInfo: {
    wernerGroup: "1:1 elektrolit guruhi",
    electrolyteType: "1:1 elektrolit",
    ions: 2,
    lm: 250,
    formula_verner: "[Fe(SCN)]²⁺",
    wernerProof: "Verner va keyingi kimyogarlar konduktometrik o'lchashlar orqali 1 ta SCN⁻ ligandning ichki sferada ekanligini isbotladi."
  },

  historicalFact: {
    title: "Temir(III) tiotsianat — analitik kimyoning klassik reaksiyasi",
    text: "[Fe(SCN)]²⁺ — temir(III) tiotsianat kompleksi, analitik kimyoning eng keng tarqalgan rangli reaksiyalaridan biri. Bu kompleks 19-asrda kashf etilgan va temir(III) ionlarini sifat aniqlashda ishlatiladi.",
    textExtended: "Fe³⁺ (d⁵, yuqori spin) oktaedr geometriyaga ega. 1 ta SCN⁻ ligand temirga bog'langan, qolgan 5 ta pozitsiya suv molekulalari bilan to'ldirilgan. Bu kompleks suvda eriganda qon qizil rang beradi (λmax = 447 nm). Job metodi (uzluksiz variatsiyalar metodi) yordamida stoxiometriya 1:1 ekanligi aniqlangan. log β₁ = 2.3 — bu past barqarorlikni ko'rsatadi, shuning uchun kompleks labil va tez muvozanatga kiradi."
  },

  interestingFacts: [
    {
      title: "Qon qizil rang",
      fact: "[Fe(SCN)]²⁺ qon qizil rang beradi (λmax = 447 nm). Bu ligand-to-metal charge transfer (LMCT) o'tish natijasida yuzaga keladi. Molyar yutilish koeffitsienti ε = 4700 M⁻¹cm⁻¹ — juda yuqori sezgirlik."
    },
    {
      title: "Analitik kimyoda ahamiyati",
      fact: "Bu reaksiya temir(III) ionlarini sifat va miqdor aniqlashda ishlatiladi. SCN⁻ qo'shilganda qizil rang paydo bo'lishi temir(III) mavjudligini ko'rsatadi."
    },
    {
      title: "Job metodi (uzluksiz variatsiyalar)",
      fact: "Job metodi yordamida stoxiometriya aniqlangan. xL = 0.50 da maksimum — bu 1:1 stoxiometriyani ko'rsatadi."
    },
    {
      title: "Past barqarorlik — tez muvozanat",
      fact: "log β₁ = 2.3 — past barqarorlik. Bu kompleks tez muvozanatga kiradi va labil hisoblanadi. Bu titrlash uchun qulay."
    },
    {
      title: "Beer-Lambert qonuni",
      fact: "A = ε·l·c — absorbsiya konsentratsiyaga to'g'ri proporsional. ε = 4700 M⁻¹cm⁻¹ — juda yuqori sezgirlik, past konsentratsiyalarda ham aniqlash mumkin."
    },
    {
      title: "Benesi-Hildebrand metodi",
      fact: "1/(A-A₀) vs 1/[SCN⁻] grafigi orqali β₁ hisoblanadi. Chiziqli grafik β₁ ni aniqlash imkonini beradi."
    }
  ],

  conductometricFeature: {
    title: "[Fe(SCN)]²⁺ — 1:1 elektrolit, log β₁ = 2.3",
    description: "Bu kompleks spektrofotometrik titrlashda klassik namuna hisoblanadi. 1 ta SCN⁻ ichki sferada — Fe³⁺ ga bog'langan. Past barqarorlik tufayli tez muvozanat.",
    reaction: {
      dissociation: "[Fe(SCN)]²⁺ ⇌ Fe³⁺ + SCN⁻",
      ions: "Fe³⁺ + SCN⁻",
      electrolyteType: "1:1 elektrolit",
      lm_theoretical: "log β₁ = 2.3 (25°C)"
    },
    problem: {
      title: "Past barqarorlik — tez muvozanat",
      description: "log β₁ = 2.3 — past barqarorlik. Kompleks tez hosil bo'ladi va tez parchalanadi.",
      impact: "Bu titrlash uchun qulay — tez muvozanatga kiradi. Lekin o'lchashlar tez bajarilishi kerak."
    },
    solution: {
      title: "Job metodi va Benesi-Hildebrand",
      description: "Job metodi yordamida stoxiometriya aniqlanadi. Benesi-Hildebrand metodi yordamida β₁ hisoblanadi.",
      mechanism: "1/(A-A₀) vs 1/[SCN⁻] grafigi chiziqli bo'lsa, β₁ hisoblanadi."
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
    Fe:  { mass: 55.845,  percent: 49.46, source: "Fe³⁺ markaziy atom (ichki sfera)", conductSignal: "[Fe(SCN)]²⁺ kationi — o'tkazuvchanlikka hissa qo'shadi" },
    S:   { mass: 32.065,  percent: 28.40, source: "SCN⁻ (S, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" },
    C:   { mass: 12.011,  percent: 10.64, source: "SCN⁻ (C, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" },
    N:   { mass: 14.007,  percent: 12.40, source: "SCN⁻ (N, ichki sfera)", conductSignal: "Ichki sferada — o'tkazuvchanlikka hissa qo'shmaydi" }
  },

  // Spektral ma'lumotlar — to'lqin uzunligi vs absorbsiya
  spectralData: [
    { wavelength: 350, absorbance: 0.10, event: "UV sohasi", theoryNote: "Past yutilish — UV sohasi" },
    { wavelength: 380, absorbance: 0.20, event: "Izosbestik nuqta", theoryNote: "Izosbestik nuqta — muvozanat ko'rsatkichi" },
    { wavelength: 400, absorbance: 0.35, event: "Binafsha soha", theoryNote: "Yutilish boshlanadi" },
    { wavelength: 420, absorbance: 0.55, event: "Ko'k-binafsha soha", theoryNote: "Yutilish ortadi" },
    { wavelength: 447, absorbance: 0.85, event: "λmax — maksimal yutilish", theoryNote: "Maksimal yutilish — LMCT o'tish" },
    { wavelength: 470, absorbance: 0.70, event: "Ko'k soha", theoryNote: "Yutilish kamayadi" },
    { wavelength: 500, absorbance: 0.50, event: "Yashil soha", theoryNote: "Yutilish kamayadi" },
    { wavelength: 520, absorbance: 0.35, event: "Izosbestik nuqta", theoryNote: "Ikkinchi izosbestik nuqta" },
    { wavelength: 550, absorbance: 0.25, event: "Sariq soha", theoryNote: "Past yutilish" },
    { wavelength: 600, absorbance: 0.15, event: "To'q sariq soha", theoryNote: "Past yutilish" },
    { wavelength: 650, absorbance: 0.10, event: "Qizil soha", theoryNote: "Past yutilish" },
    { wavelength: 700, absorbance: 0.05, event: "Infraqizil soha", theoryNote: "Juda past yutilish" }
  ],

  // Job metodi ma'lumotlari
  jobMethodData: [
    { xL: 0.0, absorbance: 0.0, corrected: 0.0, event: "Faqat Fe³⁺", theoryNote: "Faqat metall ioni — kompleks yo'q" },
    { xL: 0.1, absorbance: 0.10, corrected: 0.10, event: "Kam ligand", theoryNote: "Kam kompleks hosil bo'ladi" },
    { xL: 0.2, absorbance: 0.20, corrected: 0.20, event: "Kam ligand", theoryNote: "Kompleks hosil bo'lishi boshlanadi" },
    { xL: 0.3, absorbance: 0.30, corrected: 0.30, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.4, absorbance: 0.40, corrected: 0.40, event: "O'rta ligand", theoryNote: "Kompleks miqdori ortadi" },
    { xL: 0.5, absorbance: 0.45, corrected: 0.45, event: "1:1 stoxiometriya — MAKSIMUM", theoryNote: "MAKSIMUM — 1:1 stoxiometriya (ML)" },
    { xL: 0.6, absorbance: 0.40, corrected: 0.40, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 0.7, absorbance: 0.30, corrected: 0.30, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 0.8, absorbance: 0.20, corrected: 0.20, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 0.9, absorbance: 0.10, corrected: 0.10, event: "Ortiqcha ligand", theoryNote: "Ligand ortiqcha — kompleks miqdori kamayadi" },
    { xL: 1.0, absorbance: 0.05, corrected: 0.05, event: "Faqat SCN⁻", theoryNote: "Faqat ligand — kompleks yo'q" }
  ],

  // Bosqichli konstantalar (faqat 1 bosqich, chunki 1:1)
  stepwiseConstants: [
    { step: 1, reaction: "Fe³⁺ + SCN⁻ ⇌ [Fe(SCN)]²⁺", logK: 2.3, K: "2.00×10²", species: "[Fe(SCN)]²⁺", color: "qon qizil" }
  ],

  conductometricData: [
    { conc: 0.0001, lm: 260, kappa: 0.00260, event: "Juda suyultirilgan", theoryNote: "Cheksiz suyultirishga yaqin — Λm° ga yaqin" },
    { conc: 0.0005, lm: 255, kappa: 0.0128, event: "Juda suyultirilgan", theoryNote: "Λm hali ham Λm° ga yaqin" },
    { conc: 0.001, lm: 250, kappa: 0.0250, event: "Standart konsentratsiya", theoryNote: "Standart konsentratsiya (10⁻³ M) — Λm ≈ 250 S·cm²/mol" },
    { conc: 0.005, lm: 240, kappa: 0.120, event: "O'rta konsentratsiya", theoryNote: "Λm kamayadi — ion-ion o'zaro ta'siri" },
    { conc: 0.01, lm: 230, kappa: 0.230, event: "O'rta konsentratsiya", theoryNote: "Ion-ion o'zaro ta'siri kuchayadi" },
    { conc: 0.05, lm: 215, kappa: 1.08, event: "Yuqori konsentratsiya", theoryNote: "Ion atmosferasi kuchli — Λm sezilarli kamayadi" },
    { conc: 0.1, lm: 200, kappa: 2.00, event: "Yuqori konsentratsiya", theoryNote: "Ion juftlari hosil bo'ladi" },
    { conc: 0.5, lm: 180, kappa: 9.00, event: "Juda yuqori konsentratsiya", theoryNote: "Kuchli ion-ion o'zaro ta'siri" },
    { conc: 1.0, lm: 165, kappa: 16.5, event: "Juda yuqori konsentratsiya", theoryNote: "Λm sezilarli kamaydi — ion juftlari ko'p" }
  ],

  solventData: [
    { solvent: "Suv (H₂O)", dielectric: 78.5, lm: 250, kappa: 0.0250, color: "qon qizil", note: "Standart erituvchi — eng yuqori o'tkazuvchanlik" },
    { solvent: "Metanol (CH₃OH)", dielectric: 32.7, lm: 215, kappa: 0.0215, color: "qon qizil", note: "Kamroq dielektrik — kamroq dissotsiatsiya" },
    { solvent: "Etanol (C₂H₅OH)", dielectric: 24.3, lm: 180, kappa: 0.0180, color: "qon qizil", note: "Yanada kamroq dielektrik" },
    { solvent: "DMF (Dimetilformamid)", dielectric: 36.7, lm: 200, kappa: 0.0200, color: "qon qizil", note: "Qutbli organik erituvchi" },
    { solvent: "CH₃CN (Asetonitril)", dielectric: 37.5, lm: 205, kappa: 0.0205, color: "qon qizil", note: "Qutbli organik erituvchi" },
    { solvent: "Aseton ((CH₃)₂CO)", dielectric: 20.7, lm: 155, kappa: 0.0155, color: "qon qizil", note: "Kam qutbli — kam dissotsiatsiya" }
  ],

  temperatureData: [
    { temp: 15, lm: 235, kappa: 0.0235, note: "Past temperatura — kamroq o'tkazuvchanlik" },
    { temp: 20, lm: 242, kappa: 0.0242, note: "Xona temperaturasi" },
    { temp: 25, lm: 250, kappa: 0.0250, note: "Standart temperatura (25°C)" },
    { temp: 30, lm: 258, kappa: 0.0258, note: "Yuqori temperatura — ko'proq o'tkazuvchanlik" },
    { temp: 40, lm: 275, kappa: 0.0275, note: "Yuqori temperatura" },
    { temp: 50, lm: 290, kappa: 0.0290, note: "Juda yuqori temperatura" }
  ],

  wernerComparison: [
    { complex: "[Fe(SCN)]²⁺", formula: "Fe³⁺ + SCN⁻", ions: 2, lm: 250, type: "1:1", color: "qon qizil", colorCode: "text-red-400" },
    { complex: "[Cu(NH₃)₄]²⁺", formula: "Cu²⁺ + 4NH₃", ions: 5, lm: 340, type: "1:4", color: "to'q ko'k", colorCode: "text-blue-400" },
    { complex: "[Fe(phen)₃]²⁺", formula: "Fe²⁺ + 3phen", ions: 4, lm: 435, type: "1:3", color: "qizil", colorCode: "text-red-400" },
    { complex: "[Ni(en)₃]²⁺", formula: "Ni²⁺ + 3en", ions: 4, lm: 435, type: "1:3", color: "binafsha", colorCode: "text-pink-400" },
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
      date: "2026-02-15", 
      concentration: 0.001, 
      absorbance: 0.85, 
      lambdaMax: 447, 
      ions: 2, 
      type: "1:1 elektrolit",
      note: "Toza [Fe(SCN)]²⁺ — standart sharoit",
      theoryNote: "Standart sharoitda A = 0.85, λmax = 447 nm. Bu [Fe(SCN)]²⁺ ning qon qizil rangini ko'rsatadi."
    },
    { 
      id: "SPEC-24-002", 
      date: "2026-02-15", 
      concentration: 0.001, 
      absorbance: 0.86, 
      lambdaMax: 447, 
      ions: 2, 
      type: "1:1 elektrolit",
      note: "Ikkinchi o'lchash — takrorlanish",
      theoryNote: "Takrorlanish — natijalar bir xil (A ≈ 0.86)."
    },
    { 
      id: "SPEC-24-003", 
      date: "2026-02-16", 
      concentration: 0.0005, 
      absorbance: 0.43, 
      lambdaMax: 447, 
      ions: 2, 
      type: "1:1 elektrolit",
      note: "Past konsentratsiya (5×10⁻⁴ M)",
      theoryNote: "Beer-Lambert qonuni: A konsentratsiyaga proporsional. A ≈ 0.43."
    },
    { 
      id: "SPEC-24-004", 
      date: "2026-02-16", 
      concentration: 0.002, 
      absorbance: 1.70, 
      lambdaMax: 447, 
      ions: 2, 
      type: "1:1 elektrolit",
      note: "Yuqori konsentratsiya (2×10⁻³ M)",
      theoryNote: "A ≈ 1.70 — Beer-Lambert qonuni bajariladi."
    },
    { 
      id: "SPEC-24-005", 
      date: "2026-02-17", 
      concentration: 0.001, 
      absorbance: 0.85, 
      lambdaMax: 447, 
      ions: 2, 
      type: "1:1 elektrolit",
      note: "Job metodi — xL = 0.50 da maksimum",
      theoryNote: "Job metodi: xL = 0.50 da maksimum — bu 1:1 stoxiometriyani ko'rsatadi."
    },
    { 
      id: "SPEC-24-006", 
      date: "2026-02-17", 
      concentration: 0.001, 
      absorbance: 0.85, 
      lambdaMax: 447, 
      ions: 2, 
      type: "1:1 elektrolit",
      note: "Izosbestik nuqtalar: 380, 520 nm",
      theoryNote: "Izosbestik nuqtalar — 380, 520 nm. Bu muvozanat ko'rsatkichi."
    }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ Xavfsizlik choralari", desc: "[Fe(SCN)]²⁺ zaharli, Fe³⁺ va SCN⁻ zaharli. Qo'lqop, himoya ko'zoynaklari va laboratoriya xalati majburiy. Ventilyatsiya zarur! SCN⁻ kislota bilan reaksiyaga kirishganda HCN gazi ajralishi mumkin (JUDA ZAHARLI!).", time: "doimiy", critical: true, theory: "Fe³⁺ ionlari teri va ko'zga zarar yetkazadi. SCN⁻ tiotsianat ionlari zaharli. HCN gazi nafas yo'llarini to'xtatishi mumkin." },
    { step: 2, title: "Kerakli asboblar", desc: "Analitik tarozi (0.1 mg aniqlik), 100 mL o'lchov kolbasi, spektrofotometr (UV-Vis), kyuvetalar (1 sm yo'l uzunligi), pipetka, deionizatsiyalangan suv, Fe(NO₃)₃ eritmasi (0.001 M), KSCN eritmasi (0.001 M).", time: "5 daq", critical: true, theory: "Spektrofotometr 350-700 nm diapazonida ishlashi kerak. Kyuvetalar toza bo'lishi shart. Fe³⁺ va SCN⁻ eritmalari aniq konsentratsiyada bo'lishi kerak." },
    { step: 3, title: "Fe³⁺ eritmasini tayyorlash", desc: "Analitik tarozida Fe(NO₃)₃·9H₂O (40.40 mg) tortilib, 100 mL deionizatsiyalangan suvda eritiladi. 10⁻³ M eritma tayyorlanadi. 0.1 M HNO₃ qo'shib, gidrolizni oldini olish.", time: "10 daq", critical: true, theory: "Fe(NO₃)₃·9H₂O ning molyar massasi 404.00 g/mol. 10⁻³ M eritma uchun 40.40 mg kerak. HNO₃ qo'shilishi Fe³⁺ gidrolizini oldini oladi." },
    { step: 4, title: "SCN⁻ eritmasini tayyorlash", desc: "KSCN eritmasi (0.001 M) tayyorlanadi. Bu ligand eritmasi. 0.001 M KSCN uchun 9.72 mg KSCN 100 mL suvda eritiladi.", time: "5 daq", critical: true, theory: "KSCN ning molyar massasi 97.18 g/mol. 0.001 M eritma uchun 9.72 mg kerak. SCN⁻ ligand eritmasi konsentratsiyasi aniq bo'lishi kerak." },
    { step: 5, title: "Job metodi uchun eritmalarni tayyorlash", desc: "10 ta eritma tayyorlanadi: [Fe³⁺] + [SCN⁻] = const = 10⁻³ M. xL = 0 dan 1 gacha o'zgartiriladi. Har bir eritma uchun 10 mL. 0.1 M HNO₃ qo'shib, pH ni 2-3 da saqlash.", time: "15 daq", critical: true, theory: "Job metodi: umumiy konsentratsiya o'zgarmas. xL = [SCN⁻] / ([Fe³⁺] + [SCN⁻]). xL = 0.50 da maksimum bo'lishi kerak. pH 2-3 da saqlash — Fe³⁺ gidrolizini oldini oladi." },
    { step: 6, title: "Spektrofotometrik o'lchash", desc: "Har bir eritmaning UB-Vis spektri qayd etiladi (350-700 nm). λmax = 447 nm da absorbsiya o'lchanadi. Kyuvetalar toza bo'lishi shart. O'lchashlar tez bajarilishi kerak (kompleks labil).", time: "20 daq", critical: false, theory: "λmax = 447 nm — bu [Fe(SCN)]²⁺ ning maksimal yutilish to'lqin uzunligi. ε = 4700 M⁻¹cm⁻¹ — juda yuqori sezgirlik. Kompleks labil bo'lgani uchun o'lchashlar tez bajarilishi kerak." },
    { step: 7, title: "Job grafigini qurish", desc: "A·(1-xL) vs xL grafigi quriladi. Maksimum xL = 0.50 da — bu 1:1 stoxiometriyani ko'rsatadi.", time: "10 daq", critical: false, theory: "Job metodi: A·(1-xL) vs xL grafigi maksimumi xL = n/(n+m) da bo'ladi. 1:1 stoxiometriya uchun xL = 0.50." },
    { step: 8, title: "β₁ hisoblash (Benesi-Hildebrand)", desc: "Benesi-Hildebrand metodi yordamida β₁ hisoblanadi. 1/(A-A₀) vs 1/[SCN⁻] grafigi quriladi. log β₁ = 2.3.", time: "5 daq", critical: false, theory: "Benesi-Hildebrand: 1/(A-A₀) = 1/(ε·[Fe³⁺]·β₁) + 1/(ε·[Fe³⁺]·β₁·[SCN⁻]). Chiziqli grafik β₁ ni aniqlash imkonini beradi." },
    { step: 9, title: "Natijalarni tahlil qilish", desc: "3 ta o'lchashning o'rtacha qiymati hisoblanadi. RSD < 2% bo'lishi kerak. Beer-Lambert qonuni bajarilishi tekshiriladi.", time: "5 daq", critical: false, theory: "RSD (nisbiy standart chetlanish) < 2% bo'lishi kerak. Bu o'lchashlarning aniqligini ko'rsatadi. Beer-Lambert qonuni: A = ε·l·c." },
    { step: 10, title: "Tozalash va saqlash", desc: "Kyuvetalar distillangan suv bilan yuviladi. Eritma saqlanadi (qorong'i, 4°C). Natijalar hujjatlashtiriladi. Chiqindilar maxsus idishga yig'iladi (SCN⁻ zaharli).", time: "5 daq", critical: false, theory: "Eritma qorong'ida saqlanishi kerak — yorug'lik ta'sirida parchalanishi mumkin. SCN⁻ zaharli bo'lgani uchun chiqindilar maxsus idishga yig'ilishi kerak." }
  ],

  relatedMethods: [
    {
      name: "UV-Vis spektroskopiya",
      role: "Spektrlarni qayd etish va tahlil qilish",
      condAdvantage: "Tez va aniq spektral ma'lumotlar, ε = 4700 M⁻¹cm⁻¹ — yuqori sezgirlik",
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
      condDisadvantage: "Diamagnit moddalar uchun (Fe³⁺ paramagnit)",
      complementarity: "60%"
    },
    {
      name: "EPR spektroskopiya",
      role: "Elektron paramagnit rezonans",
      condAdvantage: "Paramagnit moddalar uchun (Fe³⁺, d⁵, yuqori spin)",
      condDisadvantage: "Faqat paramagnit moddalar",
      complementarity: "90%"
    },
    {
      name: "EXAFS spektroskopiya",
      role: "Kengaytirilgan rentgen nurlari yutilish nozik tuzilishi",
      condAdvantage: "Mahalliy strukturani aniqlash (Fe-S, Fe-N masofalari)",
      condDisadvantage: "Sinxrotron nurlari kerak",
      complementarity: "85%"
    }
  ]
}

export default function FeSCN2SpectrophotometricPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeRun, setActiveRun] = useState("SPEC-24-001")
  const [activeWerner, setActiveWerner] = useState(0)
  const [concSlider, setConcSlider] = useState(0.001)
  const [tempSlider, setTempSlider] = useState(25)
  const [solventSlider, setSolventSlider] = useState(0)
  const [wavelengthSlider, setWavelengthSlider] = useState(447)
  const [jobSlider, setJobSlider] = useState(0.50)
  
  // Job metodi kalkulyatori
  const [metalConc, setMetalConc] = useState(0.001)
  const [ligandConc, setLigandConc] = useState(0.001)
  
  // βn kalkulyatori
  const [betaValue, setBetaValue] = useState(2.3)
  const [metalConcBeta, setMetalConcBeta] = useState(0.001)
  const [ligandConcBeta, setLigandConcBeta] = useState(0.001)
  
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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950/20 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-red-950 to-purple-950 border-2 border-red-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">📊</span> TEMIR(III) TIOTSİANAT — QON QIZIL RANG!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-red-300">[Fe(SCN)]²⁺</strong> — temir(III) tiotsianat kompleksi, analitik kimyoning klassik reaksiyasi. 
              Qon qizil rang, λmax = 447 nm, log β₁ = 2.3.
            </p>
            
            <div className="bg-red-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">📊 Nima o'lchanadi?</div>
                  <div className="text-purple-200">
                    <strong>Barqarorlik konstantasi (β₁)</strong> — log β₁ = 2.3.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Stoxiometriya</strong> — 1:1 (ML).
                  </div>
                </div>
                <div>
                  <div className="text-red-400 font-bold mb-2">🔬 Qanday ishlaydi?</div>
                  <div className="text-purple-200">
                    <strong>Job metodi</strong> — xL = 0.50 da maksimum.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Izosbestik nuqtalar</strong> — 380, 520 nm.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">Qon qizil rang:</strong> λmax = 447 nm, ε = 4700 M⁻¹cm⁻¹. 
                Bu ligand-to-metal charge transfer (LMCT) o'tish natijasida yuzaga keladi.
              </p>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-red-300">XAVF:</strong> SCN⁻ kislota bilan reaksiyaga kirishganda HCN gazi ajralishi mumkin — <strong>JUDA ZAHARLI!</strong> Kislota qo'shmaslik kerak.
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
              <span className="text-red-400 font-semibold">[Fe(SCN)]²⁺</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-2">
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
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">1:1 elektrolit</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">log β₁ = 2.3</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">λmax = 447 nm</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">ε = 4700</span>
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
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-red-600 hover:bg-red-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Birikma haqida (spektrofotometrik titrlash uchun)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Fe(SCN)]²⁺</strong> — temir(III) tiotsianat kompleksi, analitik kimyoning klassik reaksiyasi. Spektrofotometrik titrlashda <strong className="text-red-300">1:1 elektrolit</strong> — 2 ta ion borligini ko'rsatadi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs md:text-sm">
                <li><strong className="text-white">Fe³⁺ (d⁵, yuqori spin)</strong> — oktaedr geometriya</li>
                <li><strong className="text-white">1 ta SCN⁻</strong> ichki sferada (Fe³⁺ ga bog'langan)</li>
                <li><strong className="text-red-300">log β₁ = 2.3</strong> — past barqarorlik, tez muvozanat</li>
                <li><strong className="text-red-300">λmax = 447 nm</strong> — qon qizil rang</li>
                <li><strong className="text-red-300">ε = 4700 M⁻¹cm⁻¹</strong> — juda yuqori sezgirlik</li>
                <li><strong className="text-red-300">Izosbestik nuqtalar</strong> — 380, 520 nm</li>
                <li><strong className="text-red-300">Job metodi</strong> — xL = 0.50 → 1:1</li>
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
              <div key={i} className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                <h3 className="text-red-400 font-bold text-sm mb-2">{fact.title}</h3>
                <p className="text-purple-200 text-xs">{fact.fact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. BARQARORLIK KONSTANTASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📐</span> Barqarorlik konstantasi (β₁) — kompleks mustahkamligi
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            <strong className="text-red-400">Umumiy barqarorlik konstantasi (β₁)</strong> — Fe³⁺ ioniga 
            1 ta SCN⁻ ligand birikishi natijasida hosil bo'lgan kompleksning termodinamik barqarorligini ifodalaydi.
            log β₁ = 2.3 — bu past barqarorlikni ko'rsatadi, shuning uchun kompleks labil va tez muvozanatga kiradi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-red-400 font-bold mb-3">Bosqichli konstantalar:</h3>
            <div className="space-y-3 text-sm text-purple-200">
              {COMPOUND.stepwiseConstants.map((step) => (
                <div key={step.step} className="bg-red-600/10 border border-red-500/30 rounded-lg p-3">
                  <p className="font-mono">{step.reaction} &nbsp;&nbsp;&nbsp; log K{step.step} = {step.logK}</p>
                  <p className="text-xs text-purple-400 mt-1">{step.step}-bosqich konstantasi — {step.species} ({step.color})</p>
                </div>
              ))}
              <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-3">
                <p className="font-mono">β₁ = K₁ = 10^2.3 = 200</p>
                <p className="text-xs text-purple-400 mt-1">Umumiy barqarorlik konstantasi</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SPEKTRAL GRAFIK — INTERAKTIV */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Spektral grafik — to'lqin uzunligi vs absorbsiya</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-red-400">Spektral grafik</strong> — to'lqin uzunligi (λ) vs absorbsiya (A). 
            λmax = 447 nm da maksimal yutilish kuzatiladi. Slayderni harakatlantirib, to'lqin uzunligini o'zgartiring.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-red-400 font-bold mb-2">
              To'lqin uzunligi: {wavelengthSlider} nm
            </label>
            <input
              type="range"
              min="350"
              max="700"
              value={wavelengthSlider}
              onChange={(e) => setWavelengthSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>350 nm</span>
              <span>447 nm (λmax)</span>
              <span>700 nm</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">To'lqin uzunligi:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentSpectral.wavelength} nm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Absorbsiya:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentSpectral.absorbance.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentSpectral.event}</div>
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
              {/* Grid */}
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.0)*200} x2="580" y2={220 - (v/1.0)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.0)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {/* X axis */}
              {[350, 400, 450, 500, 550, 600, 650, 700].map((w, i) => (
                <g key={i}>
                  <text x={50 + ((w - 350)/350)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{w} nm</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">To'lqin uzunligi (nm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Absorbsiya (A)</text>

              {/* Spektral egri */}
              <polyline
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2"
                points={COMPOUND.spectralData.map(p => {
                  const x = 50 + ((p.wavelength - 350)/350)*530
                  const y = 220 - (p.absorbance/1.0)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* λmax marker */}
              <line 
                x1={50 + ((447 - 350)/350)*530} 
                y1="30" 
                x2={50 + ((447 - 350)/350)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <text x={50 + ((447 - 350)/350)*530} y="25" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">λmax = 447 nm</text>

              {/* Current wavelength marker */}
              <line 
                x1={50 + ((currentSpectral.wavelength - 350)/350)*530} 
                y1="30" 
                x2={50 + ((currentSpectral.wavelength - 350)/350)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <circle 
                cx={50 + ((currentSpectral.wavelength - 350)/350)*530} 
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
            <strong className="text-red-400">Job metodi</strong> — xL (ligand mol ulushi) vs A·(1-xL). 
            Maksimum xL = 0.50 da — bu 1:1 stoxiometriyani ko'rsatadi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-red-400 font-bold mb-2">
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
              <span>0.0 (faqat Fe³⁺)</span>
              <span>0.50 (MAKSIMUM)</span>
              <span>1.0 (faqat SCN⁻)</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">xL:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentJob.xL.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">A·(1-xL):</div>
                <div className="text-xl font-mono font-bold text-red-400">{(currentJob.absorbance * (1 - currentJob.xL)).toFixed(3)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-red-400">{currentJob.event}</div>
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
              {/* Grid */}
              {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/0.5)*200} x2="580" y2={220 - (v/0.5)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/0.5)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {/* X axis */}
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((x, i) => (
                <g key={i}>
                  <text x={50 + (x)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{x.toFixed(1)}</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">xL (ligand mol ulushi)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">A·(1-xL)</text>

              {/* Job egri */}
              <polyline
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2"
                points={COMPOUND.jobMethodData.map(p => {
                  const x = 50 + (p.xL)*530
                  const y = 220 - ((p.absorbance * (1 - p.xL))/0.5)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* xL = 0.50 marker */}
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

              {/* Current xL marker */}
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
                cy={220 - ((currentJob.absorbance * (1 - currentJob.xL))/0.5)*200} 
                r="6" 
                fill="#fbbf24" 
                stroke="#fff" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* 5. JOB METODI KALKULYATORI */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
          <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
            <span>🔬</span> Job metodi kalkulyatori — uzluksiz variatsiyalar
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Metall va ligand konsentratsiyalarini kiriting — <strong className="text-red-300">stoxiometriya</strong> aniqlanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Fe³⁺] metall konsentratsiyasi (M):</label>
              <input
                type="number"
                step="0.0001"
                value={metalConc}
                onChange={(e) => setMetalConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[SCN⁻] ligand konsentratsiyasi (M):</label>
              <input
                type="number"
                step="0.0001"
                value={ligandConc}
                onChange={(e) => setLigandConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Ligand mol ulushi (xL):</div>
                <div className="text-xl font-mono font-bold text-red-400">{jobResult.xL}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Stoxiometriya:</div>
                <div className={`text-xl font-mono font-bold ${jobResult.stox.includes("1:1") ? 'text-green-400' : jobResult.stox.includes("1:2") ? 'text-blue-400' : jobResult.stox.includes("1:3") ? 'text-yellow-400' : 'text-yellow-400'}`}>{jobResult.stox}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: xL = [SCN⁻] / ([Fe³⁺] + [SCN⁻]) = {ligandConc} / ({metalConc} + {ligandConc}) = {jobResult.xL}
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Eslatma:</strong> xL = 0.50 → 1:1, xL = 0.67 → 1:2, xL = 0.75 → 1:3, xL = 0.80 → 1:4
            </p>
          </div>
        </div>

        {/* 6. βn KALKULYATORI */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
          <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Barqarorlik konstantasi kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            log β₁ ni kiriting — <strong className="text-red-300">ΔG°</strong> hisoblanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">log β₁:</label>
              <input
                type="number"
                step="0.1"
                value={betaValue}
                onChange={(e) => setBetaValue(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[Fe³⁺] (M):</label>
              <input
                type="number"
                step="0.0001"
                value={metalConcBeta}
                onChange={(e) => setMetalConcBeta(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[SCN⁻] (M):</label>
              <input
                type="number"
                step="0.0001"
                value={ligandConcBeta}
                onChange={(e) => setLigandConcBeta(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">β₁:</div>
                <div className="text-xl font-mono font-bold text-red-400">{Math.pow(10, betaValue).toExponential(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">ΔG° (kJ/mol):</div>
                <div className="text-xl font-mono font-bold text-red-400">{betaResult.deltaG}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: ΔG° = −RT·ln(β₁) = −8.314 × 298 × ln(10^{betaValue}) / 1000 = {betaResult.deltaG} kJ/mol
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
              <label className="block text-xs text-purple-400 mb-1">[SCN⁻] ligand (M):</label>
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
                <div className="text-xs text-purple-400">1/[SCN⁻]:</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{bhResult.invLigand}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: 1/(A-A₀) = 1/(ε·[Fe³⁺]·β₁) + 1/(ε·[Fe³⁺]·β₁·[SCN⁻])
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Eslatma:</strong> 1/A vs 1/[SCN⁻] grafigi chiziqli bo'lsa, β₁ hisoblanadi.
            </p>
          </div>
        </div>

        {/* 8. IZOSBESTIK NUQTALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Izosbestik nuqtalar — muvozanat ko'rsatkichi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-red-400">Izosbestik nuqta</strong> — turli konsentratsiyalarda 
            olingan spektrlarning <strong>kesishgan nuqtasi</strong>. Bu nuqta mavjudligi 
            eritmada <strong>faqat ikkita yutuvchi shakl</strong> (erkin metall va kompleks) 
            muvozanatda ekanligini ko'rsatadi. [Fe(SCN)]²⁺ uchun izosbestik nuqtalar: 380, 520 nm.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Bitta izosbestik nuqta</h3>
              <p className="text-purple-200 text-sm">
                Faqat <strong>erkin ligand va kompleks</strong> muvozanatda.
                Fe³⁺ + SCN⁻ ⇌ [Fe(SCN)]²⁺ — oddiy muvozanat.
              </p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">Bir nechta izosbestik nuqta</h3>
              <p className="text-purple-200 text-sm">
                <strong>[Fe(SCN)]²⁺, [Fe(SCN)₂]⁺, [Fe(SCN)₃]</strong> — bir nechta kompleks shakllari muvozanatda.
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
                    ? "bg-red-900/40 border-2 border-red-400" 
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-red-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeStep === step.step ? "bg-red-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-red-400 font-bold">{step.title}</p>
                    {step.critical && (
                      <span className="text-[10px] text-red-400">KRITIK</span>
                    )}
                  </div>
                </div>
                {activeStep === step.step && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-2">
                      <div className="text-red-400 font-bold text-xs mb-1">📚 Nazariy asos:</div>
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
                <div className="text-xl font-mono font-bold text-red-400">{run.absorbance}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">λmax (nm):</div>
                <div className="text-xl font-mono font-bold text-red-400">{run.lambdaMax}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ionlar soni:</div>
                <div className="text-xl font-mono font-bold text-red-400">{run.ions}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Elektrolit turi:</div>
                <div className="text-xl font-mono font-bold text-red-400">{run.type}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 11. KENGAYTIRUVCHI METODLAR */}
        <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Kengaytiruvchi metodlar — spektrofotometrik titrlashga qo'shimcha
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

          <div className="mt-5 bg-red-900/20 border border-red-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-red-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">Spektrofotometrik titrlash (β₁, stoxiometriya) + UV-Vis (spektrlar) + EPR (paramagnit Fe³⁺) + EXAFS (mahalliy struktura) + Kalorimetriya (ΔH, ΔS)</strong> — besh metod birgalikda [Fe(SCN)]²⁺ ni to'liq tavsiflaydi.
            </p>
          </div>
        </div>

        {/* XULOSALAR */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Spektrofotometrik titrlash — <strong className="text-red-400">barqarorlik konstantalarini aniqlashning asosiy usuli</strong></li>
            <li>Umumiy barqarorlik konstantasi β₁ — <strong className="text-red-400">log β₁ = 2.3</strong> (past barqarorlik)</li>
            <li>Job metodi — <strong className="text-red-400">xL = 0.50 → 1:1 stoxiometriya</strong></li>
            <li>Izosbestik nuqtalar — <strong className="text-red-400">380, 520 nm</strong></li>
            <li>LMCT o'tish — <strong className="text-red-400">λmax = 447 nm, ε = 4700 M⁻¹cm⁻¹</strong></li>
            <li>EPR spektroskopiya — <strong className="text-red-400">paramagnit Fe³⁺ (d⁵, yuqori spin)</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/titrlash" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Spektrofotometrik titrlash</Link>
          <Link href="/ilmiy/tahlil/titrlash/birikmalar" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Barcha birikmalar →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(SCN)]²⁺ • Spektrofotometrik titrlash moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry), Job (1928)</p>
        </div>
      </footer>
    </main>
  )
}