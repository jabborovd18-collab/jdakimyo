"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₅(NO₂)]Cl₂ — NITRO-PENTAAMMINKOBALT(III) YaMR (ILMIY BOYITILGAN)
// Manbalar: Jorgensen (1894), PMC9077707, ScienceDirect S0040603103003617,
//           Naumov (2013), Miessler-Tarr, Greenwood-Earnshaw, Cotton-Wilkinson
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>(NO<sub>2</sub>)]Cl<sub>2</sub>",
  formulaPlain: "[Co(NH3)5(NO2)]Cl2",
  iupac: "Pentaamminkobalt(III) nitro-izomer xlorid",
  commonName: "Nitro-pentaamminkobalt(III) (sariq)",
  molarMass: 261.44,
  casNumber: "14970-14-0",
  color: "sariq (yellow)",
  structure: "Oktaedr (C₄ᵥ)",
  metalLigand: "Co-N (NO₂, N-bonded), Co-N (NH₃)",
  pointGroup: "C₄ᵥ",
  electrolyteType: "1:2 elektrolit",
  molarConductivity: "~260 S·cm²/mol",

  // ═══════════════════════════════════════════════════════════════
  // KRISTALL MAYDON NAZARIYASI (ILMIY BOYITILGAN)
  // ═══════════════════════════════════════════════════════════════
  crystalField: {
    metalIon: "Co³⁺",
    electronConfig: "[Ar] 3d⁶",
    dElectrons: 6,
    spinState: "Past spinli (low-spin)",
    orbitalOccupancy: "t₂g⁶ eg⁰",
    unpairedElectrons: 0,
    magneticMoment: "0 BM (diamagnit)",
    crystalFieldSplitting: "Δo ≈ 23,600 cm⁻¹ (2.93 eV)",
    racahParameter: "B ≈ 580 cm⁻¹ (erkin ion B₀ = 1020 cm⁻¹)",
    nephelauxeticRatio: "β = B/B₀ ≈ 0.57",
    pairingEnergy: "P ≈ 21,000 cm⁻¹",
    cFSE: "CFSE = -2.4Δo + P ≈ -56,640 + 21,000 = -35,640 cm⁻¹",
    spectrochemicalSeries: "NO₂⁻ — kuchli maydon ligandi (I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < NO₂⁻ < CN⁻)",
    whyLowSpin: "Δo (23,600) > P (21,000) → past spinli, diamagnit",
    colorOrigin: "¹A₁g → ¹T₁g (F) o'tish ~22,000 cm⁻¹ (455 nm, ko'k yutilish → sariq rang)",
    chargeTransfer: "LMCT: NO₂⁻ → Co³⁺ (~35,000 cm⁻¹, UV)"
  },

  // ═══════════════════════════════════════════════════════════════
  // SIMMETRIYA VA SPEKTRAL TANLASH QOIDALARI
  // ═══════════════════════════════════════════════════════════════
  symmetry: {
    pointGroup: "C₄ᵥ",
    order: 8,
    symmetryElements: ["E", "2C₄", "C₂", "2σᵥ", "2σᵈ"],
    characterTable: {
      A1: { E: 1, C4: 1, C2: 1, σv: 1, σd: 1, functions: "z, x²+y², z²" },
      A2: { E: 1, C4: 1, C2: 1, σv: -1, σd: -1, functions: "Rz" },
      B1: { E: 1, C4: -1, C2: 1, σv: 1, σd: -1, functions: "x²-y²" },
      B2: { E: 1, C4: -1, C2: 1, σv: -1, σd: 1, functions: "xy" },
      E: { E: 2, C4: 0, C2: -2, σv: 0, σd: 0, functions: "(x,y), (Rx,Ry), (xz,yz)" }
    },
    nmrEquivalence: "C₄ᵥ simmetriya: 5 ta NH₃ dan 4 tasi ekvivalent (axial), 1 tasi (trans-NO₂) alohida. Amaliyotda tez almashinish tufayli barcha 5 NH₃ ekvivalent ko'rinadi.",
    irActive: "A1, B1, B2, E — IR faol (dipol momenti o'zgaradi)",
    ramanActive: "A1, B1, B2, E — Raman faol (polyarizatsiya o'zgaradi)",
    mutualExclusion: "C₄ᵥ da IR va Raman ustma-ust tushadi (markaziy simmetriya yo'q)"
  },

  // ═══════════════════════════════════════════════════════════════
  // YaMR NAZARIYASI — CHUQUR (ILMIY BOYITILGAN)
  // ═══════════════════════════════════════════════════════════════
  nmrTheory: {
    h1: {
      nucleus: "¹H (I = 1/2, 100% tabiiy)",
      shift: "3.5 ppm (NH₃)",
      whyThisShift: "NH₃ ligand — Co³⁺ ga bog'langan. Co³⁺ kuchli elektropozitiv → NH₃ protonlari deshielded (odatdagi NH₃ dan yuqori ppm). Referens: erkin NH₃ ~0.9 ppm, kompleksda 3.5 ppm → Δδ = +2.6 ppm (deshielding, metal effekti).",
      multiplicity: "Singlet (C₄ᵥ simmetriyada barcha 5 NH₃ ekvivalent, yoki tez ligand almashinish)",
      linewidth: "~5-15 Hz (o'tkir, diamagnit)",
      t1Relaxation: "T₁ ≈ 1-3 s (dipol-dipol mexanizm, ¹H-¹⁴N bog'lanish)",
      couplingNotes: "¹J(¹H-¹⁵N) ≈ 5-10 Hz (¹⁵N tabiiy 0.37%, shuning uchun kuzatilmaydi). ¹⁵N bilan boyitilsa, dublet ko'rinadi."
    },
    n15: {
      nucleus: "¹⁵N (I = 1/2, 0.37% tabiiy)",
      shift: "650 ppm (NO₂, N-bonded) — referens: CH₃NO₂ (0 ppm)",
      whyThisShift: "NO₂⁻ ligand N orqali bog'langan. Co³⁺ ga bog'lanish → N elektron zichligi kamayadi → deshielded → yuqori ppm. Nitrito (O-bonded) da 580 ppm (70 ppm farq) — N ning elektron zichligi biroz ko'proq (N-O bog'lar farqli).",
      referencing: "Referens: CH₃NO₂ (nitrometan, 0 ppm) yoki CH₃NO₂/CDCl₃. Ba'zan ¹⁵NH₄Cl (0 ppm) ishlatiladi.",
      sensitivity: "¹⁵N sezgirligi ¹H dan 5700 marta past (γ nisbati, tabiiy tarqalish). 1000-10000 skan kerak.",
      linewidth: "~20-50 Hz (o'rta, kichik CSA)",
      t1Relaxation: "T₁ ≈ 10-100 s (uzoq, CSA va dipol-dipol mexanizmlar)",
      csa: "Kimyoviy siljish anizotropiyasi (CSA): Δσ ≈ 100-300 ppm (NO₂ uchun o'rtacha)"
    },
    co59: {
      nucleus: "⁵⁹Co (I = 7/2, 100% tabiiy)",
      shift: "8120 ppm (referens: [Co(NH₃)₆]³⁺ yoki [Co(CN)₆]³⁻, 0 ppm)",
      whyThisShift: "⁵⁹Co kimyoviy siljishi juda keng diapazon (-18000 dan +18000 ppm). [Co(NH₃)₅(NO₂)]²⁺ da 8120 ppm — Co³⁺ past spinli, kuchli maydon ligandlari.",
      quadrupolar: "⁵⁹Co — kvadrupol yadro (I = 7/2). C₄ᵥ simmetriyada kvadrupol bog'lanish konstantasi CQ ≈ 10-30 MHz. Asimmetriya parametri η ≈ 0-0.3.",
      linewidth: "~500-2000 Hz (juda keng, kvadrupol relaksatsiya tufayli)",
      t1Relaxation: "T₁ ≈ 1-10 ms (juda qisqa, kvadrupol mexanizm dominant)",
      detection: "Keng chiziqlar tufayli sezgirlik past. Maxsus impulslar (keng chiziqli texnikalar) kerak.",
      applications: "Koordinatsion geometriya, ligand maydon kuchi, spin holatini aniqlash"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY PARAMETRLAR (ILMIY BOYITILGAN)
  // ═══════════════════════════════════════════════════════════════
  structuralData: {
    bondLengths: {
      coN_NO2: "1.93-1.96 Å (Co-N nitro, trans-NH₃ ga nisbatan qisqaroq)",
      coN_NH3_trans: "1.97-1.99 Å (Co-N NH₃ trans-NO₂)",
      coN_NH3_cis: "1.96-1.98 Å (Co-N NH₃ cis-NO₂)",
      no_Bond: "1.12-1.14 Å (N-O nitro, qo'sh bog' xarakterli)",
      comparison: "[Co(NH₃)₆]³⁺ da Co-N = 1.97 Å. NO₂⁻ trans-effekt: NH₃ ga nisbatan kuchliroq trans-effekt."
    },
    bondAngles: {
      ono_Angle: "115-117° (O-N-O nitro, sp² gibridlanish)",
      nCoN_Angle: "90° (cis NH₃-NH₃), 180° (trans NH₃-NO₂)",
      comparison: "Nitrito izomerda O-N-O burchagi ~106° (sp³ ga yaqin)"
    },
    transEffect: {
      order: "NO₂⁻ > NH₃ (NO₂⁻ kuchliroq trans-effekt)",
      mechanism: "σ-bog'lanish va π-qaytish (NO₂⁻ π-akseptor)",
      consequence: "trans-NH₃ Co-N bog'i biroz uzunroq (1.99 Å vs 1.98 Å)"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // TERMODINAMIK VA KINETIK PARAMETRLAR
  // ═══════════════════════════════════════════════════════════════
  thermodynamics: {
    isomerization: {
      reaction: "[Co(NH₃)₅(ONO)]²⁺ → [Co(NH₃)₅(NO₂)]²⁺",
      direction: "Nitrito → Nitro (ekzotermik, termodinamik jihatdan qulay)",
      deltaH: "ΔH ≈ -10 dan -15 kJ/mol (ekzotermik, DSC)",
      deltaS: "ΔS ≈ -5 dan -15 J/(mol·K) (biroz tartibli)",
      deltaG: "ΔG ≈ -7 dan -11 kJ/mol (298 K da)",
      equilibriumConstant: "K ≈ 10-100 (nitro izomer ustun)",
      activationEnergy: "Eₐ ≈ 100-160 kJ/mol (katta, inert kompleks)",
      rateConstant: "k ≈ 10⁻⁵ dan 10⁻³ s⁻¹ (25°C da, sekin)",
      halfLife: "t₁/₂ ≈ soatlab-kunlab (qorong'ida, xona haroratida)",
      mechanism: "Intramolekulyar (ONO → NO₂ qayta tashkil topish)"
    },
    inertness: {
      why: "Co³⁺ d⁶ past spinli — katta CFSE, inert (sekin ligand almashinish)",
      comparison: "Co²⁺ (d⁷) labil, Fe³⁺ (d⁵) o'rtacha, Cr³⁺ (d³) juda inert",
      waterExchange: "k_ex ≈ 10⁻⁶ s⁻¹ (juda sekin)"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // QATTIQ HOLAT YaMR (ILMIY BOYITILGAN)
  // ═══════════════════════════════════════════════════════════════
  solidStateNMR: {
    technique: "CP/MAS (Cross-Polarization / Magic Angle Spinning)",
    advantages: ["Kristall namuna", "Erituvchi kerak emas", "Polimorfizm o'rganish"],
    co59_CQ: "CQ(⁵⁹Co) ≈ 10-30 MHz (katta, kvadrupol)",
    co59_eta: "η ≈ 0-0.3 (C₄ᵥ simmetriyaga yaqin)",
    h1_MAS: "¹H MAS — NH₃ signali 3.5 ppm da (eritma bilan bir xil)",
    applications: "Polimorfizm, termik izomerlanishni qattiq holatda kuzatish, photo-salient effect mexanizmi"
  },

  // ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  // ═══════════════════════════════════════════════════════════════
  history: {
    jorgensen: {
      year: 1894,
      scientist: "Sophus Mads Jorgensen (Daniya)",
      achievement: "Birinchi linkage izomerlarni sintez qildi va tavsifladi",
      method: "[Co(NH₃)₅(NO₂)]Cl₂ (sariq) va [Co(NH₃)₅(ONO)]Cl₂ (qizil) ajratdi",
      distinction: "Rang, eruvchanlik, IR spektri (o'sha davrda) orqali farqladi",
      significance: "Werner nazariyasini tasdiqlash uchun muhim eksperimental dalil"
    },
    werner: {
      year: 1913,
      scientist: "Alfred Werner (Shveytsariya)",
      achievement: "Koordinatsion nazariya (Nobel mukofoti)",
      contribution: "Linkage izomerizm tushunchasini nazariy jihatdan tushuntirdi",
      theory: "Markaziy atom va ligandlar o'rtasidagi bog'lanish turi (N vs O)"
    },
    modernEra: {
      nmr: "1960-yillardan YaMR orqali aniq farqlash (¹⁵N, ⁵⁹Co)",
      computational: "ωB97XD, DFT, CCSD hisob-kitoblari (2010-yillar)",
      photochemistry: "Naumov (2013) — photo-salient effect kashfiyoti"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH — BOSHQA LINKAGE IZOMERLAR
  // ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      compound: "[Co(NH₃)₅(NO₂)]²⁺",
      ligand: "NO₂⁻ (N-bonded)",
      color: "Sariq",
      nmrShift: "¹⁵N: 650 ppm",
      stability: "Termodinamik jihatdan barqaror",
      isomerization: "Nitrito → Nitro (ekzotermik)"
    },
    {
      compound: "[Co(NH₃)₅(ONO)]²⁺",
      ligand: "ONO⁻ (O-bonded)",
      color: "Qizil",
      nmrShift: "¹⁵N: 580 ppm",
      stability: "Metastabil (sekin nitro ga aylanadi)",
      isomerization: "Nitrito → Nitro (sekin, qorong'ida)"
    },
    {
      compound: "[Co(NH₃)₅(NCS)]²⁺",
      ligand: "NCS⁻ (N-bonded)",
      color: "Sariq-to'q sariq",
      nmrShift: "¹³C: ~120 ppm (NCS)",
      stability: "Barqaror",
      isomerization: "SCN → NCS (kuchli maydon)"
    },
    {
      compound: "[Co(NH₃)₅(SCN)]²⁺",
      ligand: "SCN⁻ (S-bonded)",
      color: "To'q sariq",
      nmrShift: "¹³C: ~110 ppm (SCN)",
      stability: "Kuchsiz maydon, kam barqaror",
      isomerization: "SCN → NCS (tezroq)"
    },
    {
      compound: "[Ru(NH₃)₅(SO₂)]²⁺",
      ligand: "SO₂ (S-bonded, η¹)",
      color: "Sariq",
      nmrShift: "¹H: o'zgaruvchan",
      stability: "Linkage izomerlar (η¹, η²)",
      isomerization: "η¹ → η² (foto-kimyoviy)"
    }
  ],

  // YaMR ma'lumotlari
  nmrNucleus: "¹H, ¹⁵N, ⁵⁹Co",
  chemicalShift: "¹H: 3.5 ppm (NH₃), ¹⁵N: 650 ppm (NO₂, N-bonded)",
  multiplicity: "singlet",
  jCoupling: "—",

  // Termik izomerlanish (DSC)
  dscData: {
    reaction: "nitrito → nitro (ekzotermik)",
    deltaH: "ekzotermik (ΔH < 0)",
    mechanism: "Intramolekulyar mexanizm",
    intermediates: "endo-nitrito oraliq mahsulot",
    reversibility: "Qisman qaytar (partially reversible)",
    discovery: "Jorgensen (1894)"
  },

  // Photo-salient effect (Naumov 2013)
  photoSalient: {
    effect: "UV yorug'lik ta'sirida kristall sakraydi",
    mechanism: "Photo-isomerization (nitro → nitrito)",
    strain: "[Co(NH3)5ONO]2+ — local source of strains",
    discovery: "Naumov (2013)",
    application: "Dynamic molecular crystals, photo-responsive materials"
  },

  // ωB97XD/6-31+G(d,p) hisob-kitoblari
  theoryNote: {
    method: "ωB97XD/6-31+G(d,p)",
    pathway1: "nitro → TS1 (38.16 kcal/mol) → endo-nitrito → TS2 (9.68 kcal/mol) → exo-nitrito",
    pathway2: "nitro → TS3 (41.76 kcal/mol) → exo-nitrito",
    preferredPath: "Pathway (1) through endo-nitrito (eng past energiya yo'li)",
    bondLength: "Co-N: 1.97-2.01 Å (CCSD/6-31+G(d,p))",
    pjte: "PJTE stabilization ~750 cm⁻¹"
  },

  // YaMR signallar (batafsil)
  nmrSignals: [
    {
      nucleus: "¹H",
      ligand: "NH₃ (barcha 5 ta)",
      shift: 3.5,
      multiplicity: "singlet",
      jCoupling: "—",
      integration: "15H",
      notes: "Barcha 5 ta NH₃ ekvivalent (C₄ᵥ simmetriya). Inert kompleks — sekin almashinish. Deshielded (+2.6 ppm) — Co³⁺ elektropozitiv."
    },
    {
      nucleus: "¹⁵N",
      ligand: "NO₂ (N-bonded)",
      shift: 650,
      multiplicity: "singlet",
      jCoupling: "—",
      integration: "1N",
      notes: "N-bog'langan izomer. ¹⁵N YaMR da 650 ppm da signal. Nitrito izomerda 580 ppm (70 ppm farq). Sezgirlik past (0.37% tabiiy)."
    },
    {
      nucleus: "⁵⁹Co",
      ligand: "Co markaz",
      shift: 8120,
      multiplicity: "singlet (keng)",
      jCoupling: "—",
      integration: "1Co",
      notes: "⁵⁹Co YaMR da 8120 ppm atrofida signal. Keng chiziq (~500-2000 Hz, kvadrupol, I=7/2). CQ ≈ 10-30 MHz."
    }
  ],

  // YaMR spektr ma'lumotlari (simulyatsiya uchun)
  nmrSpectrum: [
    { ppm: 0, intensity: 0, notes: "TMS referens" },
    { ppm: 1, intensity: 0, notes: "—" },
    { ppm: 2, intensity: 0, notes: "—" },
    { ppm: 3.5, intensity: 1.0, notes: "¹H: NH₃ (singlet, 15H)" },
    { ppm: 4, intensity: 0, notes: "—" },
    { ppm: 5, intensity: 0, notes: "—" },
    { ppm: 6, intensity: 0, notes: "—" },
    { ppm: 7, intensity: 0, notes: "—" },
    { ppm: 8, intensity: 0, notes: "—" },
    { ppm: 9, intensity: 0, notes: "—" },
    { ppm: 10, intensity: 0, notes: "—" }
  ],

  // Termik izomerlanish kinetikasi
  isomerizationKinetics: {
    pathway1: {
      name: "Pathway (1): nitro → endo-nitrito → exo-nitrito",
      ts1: "TS1 (38.16 kcal/mol)",
      ts2: "TS2 (9.68 kcal/mol)",
      intermediate: "endo-nitrito",
      energyBarrier: "38.16 kcal/mol (TS1)",
      preferred: true
    },
    pathway2: {
      name: "Pathway (2): nitro → exo-nitrito",
      ts3: "TS3 (41.76 kcal/mol)",
      intermediate: "—",
      energyBarrier: "41.76 kcal/mol (TS3)",
      preferred: false
    }
  },

  // Halaqit beruvchi omillar
  interferences: [
    {
      source: "Nitrito izomer aralashmasi",
      effect: "¹⁵N YaMR da 580 ppm da qo'shimcha signal (nitro dan 70 ppm farq)",
      severity: "Yuqori",
      solution: "Sof nitro izomer ishlatish. Qorong'ida saqlash (nitrito → nitro konversiyasi).",
      theoryNote: "Nitrito izomerda ¹⁵N signal 580 ppm da (nitro dan 70 ppm past). Qorong'ida nitrito sekin nitro ga aylanadi."
    },
    {
      source: "Photo-isomerlanish",
      effect: "UV yorug'lik ta'sirida nitro → nitrito konversiyasi",
      severity: "Yuqori",
      solution: "Qorong'ida saqlash. UV yorug'likdan saqlash.",
      theoryNote: "Naumov (2013) bo'yicha UV yorug'lik nitro → nitrito konversiyasini tezlashtiradi. Photo-salient effect."
    },
    {
      source: "⁵⁹Co kvadrupol kengayishi",
      effect: "⁵⁹Co signallari juda keng (~500-2000 Hz), sezgirlik past",
      severity: "O'rta",
      solution: "Keng chiziqli texnikalar, yuqori konsentratsiya, uzoq vaqt skanerlash.",
      theoryNote: "⁵⁹Co (I=7/2) kvadrupol yadro. C₄ᵥ simmetriyada CQ ≈ 10-30 MHz. T₁ juda qisqa (~ms)."
    },
    {
      source: "¹⁵N past sezgirlik",
      effect: "¹⁵N tabiiy tarqalishi 0.37%, sezgirlik ¹H dan 5700 marta past",
      severity: "O'rta",
      solution: "¹⁵N bilan boyitish, 1000-10000 skan, yuqori konsentratsiya.",
      theoryNote: "¹⁵N past γ va past tabiiy tarqalish. ¹³C dan ham past sezgirlik. Boyitish tavsiya etiladi."
    },
    {
      source: "Erituvchi cho'qqilari",
      effect: "D₂O da HOD signal 4.7 ppm da — NH₃ signaliga yaqin",
      severity: "O'rta",
      solution: "DMSO-d₆ ishlatish (NH₃ signali 3.5 ppm da, HOD dan uzoq).",
      theoryNote: "D₂O da HOD signal 4.7 ppm da — NH₃ signaliga (3.5 ppm) yaqin. DMSO-d₆ da NH₃ signali 3.5 ppm da aniq ko'rinadi."
    },
    {
      source: "Paramagnit aralashmalar",
      effect: "Signallarni kengaytiradi va siljitadi",
      severity: "O'rta",
      solution: "Sof namuna ishlatish. Paramagnit aralashmalardan saqlash.",
      theoryNote: "Paramagnit aralashmalar signallarni kengaytiradi (1/r⁶ bog'liq). Sof namuna ishlatish kerak."
    }
  ],

  // Laboratoriya tartibi
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak. NO₂⁻ toksik. Co³⁺ zaharli. Qorong'ida saqlash (nitrito → nitro konversiyasi).",
      time: "15 daq",
      theoryNote: "NO₂⁻ toksik. [Co(NH3)5(NO2)]Cl2 qorong'ida saqlanishi kerak — nitrito izomerga konversiyasi sodir bo'ladi."
    },
    {
      step: 2,
      title: "Sof [Co(NH₃)₅(NO₂)]Cl₂ ni tayyorlash",
      desc: "Sof nitro izomerni sintez qilish yoki sotib olish. Qorong'ida saqlash. Jorgensen usuli: [Co(NH₃)₅(H₂O)]³⁺ + NO₂⁻ → nitro izomer.",
      time: "1-2 soat (sintez) yoki tayyor",
      theoryNote: "Jorgensen (1894) bo'yicha sintez. Qorong'ida saqlash — nitrito izomerga konversiyasining oldini olish."
    },
    {
      step: 3,
      title: "YaMR spektrometrni tayyorlash",
      desc: "YaMR spektrometrni yoqish, 30 daq stabillash. Shimlash (shimming) qilish. D₂O yoki DMSO-d₆ erituvchi.",
      time: "30 daq",
      theoryNote: "Shimlash — magnit maydonining bir xilligini ta'minlash. Yaxshi shimlash — o'tkir signallar."
    },
    {
      step: 4,
      title: "Namuna tayyorlash",
      desc: "10-20 mg namunani 0.6 mL DMSO-d₆ da eritish. YaMR naychaga solish. ¹⁵N uchun 50-100 mg kerak.",
      time: "10-15 daq",
      theoryNote: "DMSO-d₆ da NH₃ signali 3.5 ppm da aniq ko'rinadi. ¹⁵N uchun yuqori konsentratsiya kerak (past sezgirlik)."
    },
    {
      step: 5,
      title: "¹H YaMR spektrini olish",
      desc: "¹H YaMR spektrini olish (16-64 skan). NH₃ signalini tekshirish (3.5 ppm, singlet, 15H).",
      time: "5-10 daq",
      theoryNote: "¹H YaMR da NH₃ signali 3.5 ppm da singlet (15H). Barcha 5 ta NH₃ ekvivalent (C₄ᵥ simmetriya)."
    },
    {
      step: 6,
      title: "¹⁵N YaMR spektrini olish (ixtiyoriy)",
      desc: "¹⁵N YaMR spektrini olish (1000-10000 skan). NO₂ signalini tekshirish (650 ppm, singlet).",
      time: "30-60 daq",
      theoryNote: "¹⁵N YaMR da NO₂ signali 650 ppm da (N-bonded). Nitrito izomerda 580 ppm (70 ppm farq)."
    },
    {
      step: 7,
      title: "⁵⁹Co YaMR spektrini olish (ixtiyoriy)",
      desc: "⁵⁹Co YaMR spektrini olish (keng chiziqli texnikalar). Signal 8120 ppm da, keng (~500-2000 Hz).",
      time: "1-2 soat",
      theoryNote: "⁵⁹Co (I=7/2) kvadrupol yadro. Keng chiziqlar, past sezgirlik. Maxsus impulslar kerak."
    },
    {
      step: 8,
      title: "Nitrito izomer tekshirish (ixtiyoriy)",
      desc: "Agar nitrito izomer aralashmasi bo'lsa, ¹⁵N YaMR da 580 ppm da qo'shimcha signal ko'rinadi.",
      time: "30-60 daq",
      theoryNote: "Nitrito izomerda ¹⁵N signal 580 ppm da (nitro dan 70 ppm past). Qorong'ida nitrito sekin nitro ga aylanadi."
    }
  ],

  // Kengaytiruvchi metodlar
  advancedTechniques: [
    {
      name: "DSC (Differential Scanning Calorimetry)",
      description: "Termik izomerlanish kinetikasi (nitrito → nitro)",
      advantages: ["Termik izomerlanish kinetikasi", "ΔH, ΔS parametrlari", "Qaytarlik darajasi"],
      disadvantages: ["Uzoq vaqt", "Murakkab tahlil", "Faqat termik izomerlanish"],
      bestFor: "Termik izomerlanish kinetikasi, DSC",
      examples: "ScienceDirect S0040603103003617 — DSC termik izomerlanish"
    },
    {
      name: "VT-NMR (Variable Temperature)",
      description: "Haroratni o'zgartirib izomerlanish kinetikasi",
      advantages: ["Izomerlanish tezligi", "Eₐ aktivatsiya energiyasi", "Mexanizm"],
      disadvantages: ["Uzoq vaqt", "Harorat nazorati"],
      bestFor: "Izomerlanish kinetikasi, mexanizm",
      examples: "VT-NMR orqali nitrito → nitrito konversiyasi tezligi"
    },
    {
      name: "2D YaMR (HSQC, HMBC)",
      description: "²D YaMR orqali bog'lanishlarni aniqlash",
      advantages: ["¹H-¹⁵N bog'lanish", "Strukturaviy aniqlash", "Aralashmalar tahlili"],
      disadvantages: ["Uzoq vaqt", "Murakkab tahlil", "Yuqori konsentratsiya kerak"],
      bestFor: "Strukturaviy aniqlash, aralashmalar",
      examples: "HSQC — ¹H-¹⁵N bir bog'liq korrelyatsiya"
    },
    {
      name: "Qattiq holat YaMR (CP/MAS)",
      description: "Kristall namuna uchun qattiq holat YaMR",
      advantages: ["Erituvchi kerak emas", "Polimorfizm", "Photo-salient effect"],
      disadvantages: ["Maxsus uskuna", "Keng chiziqlar", "Murakkab tahlil"],
      bestFor: "Kristall namuna, polimorfizm",
      examples: "Naumov (2013) — qattiq holatda photo-salient effect"
    },
    {
      name: "Photo-salient effect testi",
      description: "UV yorug'lik ta'sirida kristall sakrashini kuzatish",
      advantages: ["Photo-isomerlanish", "Dynamic molecular crystals", "Photo-responsive materials"],
      disadvantages: ["UV uskuna kerak", "Kristall sifati muhim"],
      bestFor: "Photo-salient effect, photo-responsive materials",
      examples: "Naumov (2013) — photo-salient effect"
    },
    {
      name: "ωB97XD/6-31+G(d,p) hisob-kitoblari",
      description: "Kvant kimyoviy hisob-kitoblar (transition states, energy barriers)",
      advantages: ["Transition states", "Energy barriers", "Mexanizm"],
      disadvantages: ["Kuchli kompyuter kerak", "Murakkab hisob-kitoblar"],
      bestFor: "Mexanizm, energy barriers, transition states",
      examples: "PMC9077707 — ωB97XD/6-31+G(d,p) hisob-kitoblari"
    }
  ]
}

export default function CoNH35NO2Cl2Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [ppmSlider, setPpmSlider] = useState(3.5)
  const [pathway, setPathway] = useState(1)
  const [activeNmrNucleus, setActiveNmrNucleus] = useState("h1")

  const currentSignal = useMemo(() => {
    let closest = COMPOUND.nmrSpectrum[0]
    let minDiff = Math.abs(ppmSlider - COMPOUND.nmrSpectrum[0].ppm)
    for (let i = 1; i < COMPOUND.nmrSpectrum.length; i++) {
      const diff = Math.abs(ppmSlider - COMPOUND.nmrSpectrum[i].ppm)
      if (diff < minDiff) {
        minDiff = diff
        closest = COMPOUND.nmrSpectrum[i]
      }
    }
    return closest
  }, [ppmSlider])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-yellow-950/20 to-blue-950 text-white">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-yellow-950 to-purple-950 border-2 border-yellow-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🧲</span> [Co(NH₃)₅(NO₂)]Cl₂ — ILMIY BOYITILGAN!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-yellow-300">[Co(NH₃)₅(NO₂)]Cl₂</strong> — nitro-pentaamminkobalt(III), linkage izomerizmning klassik namunasi.
              Kristall maydon nazariyasi, YaMR nazariyasi, strukturaviy parametrlar, termodynamik ma'lumotlar!
            </p>

            <div className="bg-yellow-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-yellow-400 font-bold mb-2">🧲 YaMR signallar:</div>
                  <div className="text-purple-200">
                    <strong>¹H:</strong> 3.5 ppm (NH₃, singlet, 15H)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹⁵N:</strong> 650 ppm (NO₂, N-bonded)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>⁵⁹Co:</strong> 8120 ppm (keng, kvadrupol)
                  </div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold mb-2">🔬 Yangi bo'limlar:</div>
                  <div className="text-purple-200">
                    <strong>Kristall maydon nazariyasi</strong> (d⁶, t₂g⁶, Δo)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Simmetriya (C₄ᵥ)</strong> va tanlash qoidalari
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Strukturaviy parametrlar</strong> (bog', burchak)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">Knowledge Base:</strong> Jorgensen (1894), PMC9077707 (ωB97XD/6-31+G(d,p)),
                ScienceDirect S0040603103003617 (DSC), Naumov (2013) photo-salient effect, Cotton-Wilkinson, Miessler-Tarr.
              </p>
            </div>

            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-200">
                <strong className="text-yellow-300">⚠️ XAVFSIZLIK:</strong> NO₂⁻ toksik! Co³⁺ zaharli. Qorong'ida saqlash (nitrito → nitrito konversiyasi). UV yorug'likdan saqlash (photo-isomerlanish).
              </p>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
              aria-label="Modalni yopish"
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
              <Link href="/ilmiy/tahlil/nmr" className="hover:text-purple-300">YaMR spektroskopiya</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/nmr/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-yellow-400 font-semibold">[Co(NH₃)₅(NO₂)]Cl₂</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🧲 YaMR</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Linkage Izomerizm</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">N-bonded</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Diamagnit</span>
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Photo-salient</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Birikmalar katalogi
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-yellow-600 hover:bg-yellow-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">YaMR</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Linkage Izomerizm</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Jorgensen (1894)</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">Photo-salient</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              [Co(NH₃)₅(NO₂)]Cl₂
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            nitro-pentaamminkobalt(III) — <span className="text-yellow-400 italic">&quot;Linkage izomerizm, DSC termik izomerlanish, photo-salient effect&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">YaMR spektroskopiya</strong> yordamida <strong className="text-yellow-400">linkage izomerizmni</strong> o&apos;rganish.
            N-bog&apos;langan nitro izomer (sariq) va O-bog&apos;langan nitrito izomer (qizil).
            <strong className="text-yellow-400"> ¹H: 3.5 ppm (NH₃, singlet)</strong>,
            <strong className="text-yellow-400"> ¹⁵N: 650 ppm (NO₂, N-bonded)</strong>.
            Jorgensen (1894) kashfiyoti, DSC termik izomerlanish, photo-salient effect (Naumov 2013).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Co³⁺ (d⁶)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Magnit</div>
              <div className="text-white font-bold">Diamagnit</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">C₄ᵥ</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit</div>
              <div className="text-white font-bold">1:2</div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* YANGI: KRISTALL MAYDON NAZARIYASI */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔬</span> Kristall maydon nazariyasi (Crystal Field Theory)
          </h2>

          <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>Nima uchun bu kompleks diamagnit?</strong> Co³⁺ — d⁶ elektron konfiguratsiya. NH₃ va NO₂⁻ — kuchli maydon ligandlari.
              Δ<sub>o</sub> (23,600 cm⁻¹) &gt; P (juftlanish energiyasi, 21,000 cm⁻¹) → past spinli (low-spin), barcha elektronlar juftlangan → diamagnit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">Elektron konfiguratsiya</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Metall ioni:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.metalIon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Elektron konfiguratsiya:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.electronConfig}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">d-elektronlar soni:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.dElectrons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Spin holati:</span>
                  <span className="text-blue-400">{COMPOUND.crystalField.spinState}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Orbital to'ldirilishi:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.orbitalOccupancy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Toq elektronlar:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.unpairedElectrons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Magnit momenti:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.magneticMoment}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">Kristall maydon parametrlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Δ<sub>o</sub> (10Dq):</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.crystalFieldSplitting}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Racah B:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.racahParameter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">β (nefelauxetik):</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.nephelauxeticRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Juftlanish energiyasi P:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.pairingEnergy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">CFSE:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.cFSE}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold mb-2">Spektrokimyoviy qator va rang</h4>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Spektrokimyoviy qator:</strong> {COMPOUND.crystalField.spectrochemicalSeries}
            </p>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Nima uchun past spinli?</strong> {COMPOUND.crystalField.whyLowSpin}
            </p>
            <p className="text-purple-200 text-sm">
              <strong>Rang sababi:</strong> {COMPOUND.crystalField.colorOrigin}
            </p>
          </div>

          {/* d-orbital splitting diagram */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <h4 className="text-blue-400 font-bold mb-3">d-orbital bo'linish diagrammasi</h4>
            <svg viewBox="0 0 600 200" className="w-full h-48" role="img" aria-label="d-orbital splitting">
              <title>d-orbital bo'linish diagrammasi — Co³⁺ past spinli</title>

              {/* Energiya o'qi */}
              <line x1="50" y1="180" x2="50" y2="20" stroke="#a78bfa" strokeWidth="1" />
              <text x="30" y="100" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 30, 100)">Energiya</text>

              {/* Barycenter */}
              <line x1="40" y1="100" x2="560" y2="100" stroke="#6b21a8" strokeWidth="1" strokeDasharray="4,2" />
              <text x="570" y="103" fontSize="8" fill="#6b21a8">Barycenter</text>

              {/* eg orbitals (yuqori) */}
              <line x1="350" y1="60" x2="450" y2="60" stroke="#eab308" strokeWidth="3" />
              <text x="400" y="50" textAnchor="middle" fontSize="10" fill="#eab308" fontWeight="bold">e<sub>g</sub></text>
              <text x="400" y="75" textAnchor="middle" fontSize="8" fill="#eab308">d<sub>x²-y²</sub>, d<sub>z²</sub></text>
              <text x="480" y="63" fontSize="8" fill="#eab308">+0.6Δ<sub>o</sub></text>

              {/* t2g orbitals (past) */}
              <line x1="150" y1="140" x2="250" y2="140" stroke="#22c55e" strokeWidth="3" />
              <text x="200" y="130" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="bold">t<sub>2g</sub></text>
              <text x="200" y="155" textAnchor="middle" fontSize="8" fill="#22c55e">d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub></text>
              <text x="120" y="143" fontSize="8" fill="#22c55e">-0.4Δ<sub>o</sub></text>

              {/* Elektronlar (t2g da 6 ta, eg da 0 ta) */}
              {[160, 180, 200, 220, 240, 260].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy="140" r="4" fill="#22c55e" />
                  <text x={x} y="135" textAnchor="middle" fontSize="6" fill="#22c55e">↑↓</text>
                </g>
              ))}

              {/* Δo belgisi */}
              <line x1="500" y1="60" x2="500" y2="140" stroke="#fbbf24" strokeWidth="2" />
              <line x1="495" y1="60" x2="505" y2="60" stroke="#fbbf24" strokeWidth="2" />
              <line x1="495" y1="140" x2="505" y2="140" stroke="#fbbf24" strokeWidth="2" />
              <text x="515" y="103" fontSize="10" fill="#fbbf24" fontWeight="bold">Δ<sub>o</sub></text>
            </svg>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* YANGI: SIMMETRIYA VA SPEKTRAL TANLASH QOIDALARI */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📐</span> Simmetriya va spektral tanlash qoidalari
          </h2>

          <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-sm">
              <strong>C₄ᵥ nuqtaviy guruhi:</strong> [Co(NH₃)₅(NO₂)]²⁺ oktaedr geometriyada, lekin bitta NH₃ NO₂⁻ ga almashtirilgan → simmetriya O<sub>h</sub> dan C₄ᵥ ga tushadi.
              Bu simmetriya IR, Raman va YaMR spektrlarini belgilaydi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">Simmetriya elementlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Nuqtaviy guruh:</span>
                  <span className="text-purple-400 font-mono">{COMPOUND.symmetry.pointGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Guruh tartibi:</span>
                  <span className="text-purple-400 font-mono">{COMPOUND.symmetry.order}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Simmetriya elementlari:</span>
                  <span className="text-purple-400 font-mono text-xs">{COMPOUND.symmetry.symmetryElements.join(", ")}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">Spektral faollik</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">IR faol:</span>
                  <span className="text-purple-400 font-mono">{COMPOUND.symmetry.irActive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Raman faol:</span>
                  <span className="text-purple-400 font-mono">{COMPOUND.symmetry.ramanActive}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">O'zaro istisno:</span>
                  <span className="text-purple-400 text-xs">{COMPOUND.symmetry.mutualExclusion}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-4">
            <h4 className="text-purple-400 font-bold mb-2">YaMR uchun ekvivalentlik</h4>
            <p className="text-purple-200 text-sm">
              {COMPOUND.symmetry.nmrEquivalence}
            </p>
          </div>

          {/* Karakterlar jadvali */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 overflow-x-auto">
            <h4 className="text-purple-400 font-bold mb-3">C₄ᵥ karakterlar jadvali</h4>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-2 px-2 text-purple-400">Irrep</th>
                  <th className="py-2 px-2 text-purple-400">E</th>
                  <th className="py-2 px-2 text-purple-400">2C₄</th>
                  <th className="py-2 px-2 text-purple-400">C₂</th>
                  <th className="py-2 px-2 text-purple-400">2σᵥ</th>
                  <th className="py-2 px-2 text-purple-400">2σᵈ</th>
                  <th className="py-2 px-2 text-purple-400">Funksiyalar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {Object.entries(COMPOUND.symmetry.characterTable).map(([irrep, data]) => (
                  <tr key={irrep} className="border-b border-purple-800/30">
                    <td className="py-2 px-2 text-purple-400 font-bold">{irrep}</td>
                    <td className="py-2 px-2">{data.E}</td>
                    <td className="py-2 px-2">{data.C4}</td>
                    <td className="py-2 px-2">{data.C2}</td>
                    <td className="py-2 px-2">{data.σv}</td>
                    <td className="py-2 px-2">{data.σd}</td>
                    <td className="py-2 px-2 text-xs text-yellow-400">{data.functions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LINKAGE IZOMERIZM */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔗 Linkage izomerizm — N-bonded vs O-bonded</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Nitro izomer (N-bonded)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-yellow-400">Sariq</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog&apos;lanish:</span>
                  <span className="text-yellow-400">Co-N (N-bonded)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">¹H YaMR:</span>
                  <span className="text-yellow-400">3.5 ppm (singlet)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">¹⁵N YaMR:</span>
                  <span className="text-yellow-400">650 ppm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co-N bog&apos; uzunligi:</span>
                  <span className="text-yellow-400">1.93-1.96 Å</span>
                </div>
              </div>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Nitrito izomer (O-bonded)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-red-400">Qizil</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Bog&apos;lanish:</span>
                  <span className="text-red-400">Co-O (O-bonded)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">¹H YaMR:</span>
                  <span className="text-red-400">3.5 ppm (singlet)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">¹⁵N YaMR:</span>
                  <span className="text-red-400">580 ppm (70 ppm farq)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co-O bog&apos; uzunligi:</span>
                  <span className="text-red-400">~2.05 Å</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/30 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              <strong>Linkage izomerizm:</strong> NO₂⁻ ambidentat ligand — N yoki O orqali bog&apos;lanishi mumkin.
              Nitro izomer (N-bonded, sariq) va nitrito izomer (O-bonded, qizil).
              ¹⁵N YaMR da 70 ppm farq — linkage izomerlarni aniq farqlash.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* YANGI: STRUKTURAVIY PARAMETRLAR */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📏</span> Strukturaviy parametrlar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog' uzunliklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Co-N (NO₂, nitro):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.coN_NO2}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Co-N (NH₃, trans-NO₂):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.coN_NH3_trans}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Co-N (NH₃, cis-NO₂):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.coN_NH3_cis}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">N-O (nitro):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.no_Bond}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog' burchaklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">O-N-O (nitro):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.ono_Angle}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">N-Co-N:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.nCoN_Angle}</span>
                </div>
              </div>

              <h3 className="text-green-400 font-bold mb-3 mt-4">Trans-effekt</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Trans-effekt tartibi:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.structuralData.transEffect.order}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Mexanizm:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.structuralData.transEffect.mechanism}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-900/30 rounded-lg p-4">
            <p className="text-green-300 text-sm">
              <strong>Taqqoslash:</strong> {COMPOUND.structuralData.bondLengths.comparison}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* YANGI: YaMR NAZARIYASI — CHUQUR */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧲</span> YaMR nazariyasi — chuqur tahlil
          </h2>

          <div className="bg-cyan-900/30 rounded-lg p-4 mb-6">
            <p className="text-cyan-300 text-sm">
              <strong>Nima uchun aynan shu kimyoviy siljishlar?</strong> Har bir yadro uchun kimyoviy siljishning fizik ma'nosini,
              relaksatsiya mexanizmlarini va spektral xususiyatlarini chuqur o'rganamiz.
            </p>
          </div>

          {/* Nucleus tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveNmrNucleus("h1")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "h1"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹H (I=1/2)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("n15")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "n15"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹⁵N (I=1/2)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("co59")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "co59"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ⁵⁹Co (I=7/2)
            </button>
          </div>

          {/* ¹H details */}
          {activeNmrNucleus === "h1" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.h1.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Multiplicity:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.multiplicity}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun bu siljish?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Spin-spin bog'lanish:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.couplingNotes}</p>
              </div>
            </div>
          )}

          {/* ¹⁵N details */}
          {activeNmrNucleus === "n15" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.n15.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n15.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Sezgirlik:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n15.sensitivity}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n15.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n15.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun 650 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.n15.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Referens:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.n15.referencing}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">CSA (Kimyoviy siljish anizotropiyasi):</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.n15.csa}</p>
              </div>
            </div>
          )}

          {/* ⁵⁹Co details */}
          {activeNmrNucleus === "co59" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.co59.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.co59.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.co59.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.co59.t1Relaxation}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Kvadrupol:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.co59.quadrupolar}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun 8120 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.co59.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Qo'llanilishi:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.co59.applications}</p>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* YANGI: TERMODINAMIK VA KINETIK PARAMETRLAR */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span> Termodinamik va kinetik parametrlar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Izomerlanish termodinamikasi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Reaksiya:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.isomerization.reaction}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yo'nalish:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.isomerization.direction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ΔH:</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.isomerization.deltaH}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ΔS:</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.isomerization.deltaS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ΔG (298 K):</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.isomerization.deltaG}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">K (muvozanat):</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.isomerization.equilibriumConstant}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Kinetik parametrlar</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Eₐ (aktivatsiya):</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.isomerization.activationEnergy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">k (tezlik konstantasi):</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.isomerization.rateConstant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">t₁/₂ (yarim yemirilish):</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.isomerization.halfLife}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Mexanizm:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.isomerization.mechanism}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-900/30 rounded-lg p-4">
            <h4 className="text-orange-400 font-bold mb-2">Inertlik (Inertness)</h4>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Nima uchun inert?</strong> {COMPOUND.thermodynamics.inertness.why}
            </p>
            <p className="text-purple-200 text-sm">
              <strong>Taqqoslash:</strong> {COMPOUND.thermodynamics.inertness.comparison}
            </p>
          </div>
        </div>

        {/* YaMR SIGNALLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧲 YaMR signallar (batafsil)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-yellow-400">Yadro</th>
                  <th className="py-3 px-3 text-yellow-400">Ligand</th>
                  <th className="py-3 px-3 text-yellow-400">δ (ppm)</th>
                  <th className="py-3 px-3 text-yellow-400">Multiplicity</th>
                  <th className="py-3 px-3 text-yellow-400">J (Hz)</th>
                  <th className="py-3 px-3 text-yellow-400">Integration</th>
                  <th className="py-3 px-3 text-yellow-400">Izohlar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.nmrSignals.map((signal, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/30">
                    <td className="py-3 px-3 text-yellow-400 font-bold">{signal.nucleus}</td>
                    <td className="py-3 px-3">{signal.ligand}</td>
                    <td className="py-3 px-3 text-yellow-400 font-mono">{signal.shift}</td>
                    <td className="py-3 px-3">{signal.multiplicity}</td>
                    <td className="py-3 px-3 font-mono">{signal.jCoupling}</td>
                    <td className="py-3 px-3">{signal.integration}</td>
                    <td className="py-3 px-3 text-xs text-purple-300">{signal.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INTERAKTIV YaMR SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv YaMR spektr simulyatsiyasi (¹H)</h2>

          <p className="text-purple-200 leading-relaxed mb-6">
            Kimyoviy siljishni (δ, ppm) o&apos;zgartiring. Signallar qanday o&apos;zgarishini ko&apos;ring.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              Kimyoviy siljish (δ): {ppmSlider} ppm
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={ppmSlider}
              onChange={(e) => setPpmSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>0 ppm (TMS)</span>
              <span>3.5 ppm (NH₃)</span>
              <span>10 ppm</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{ppmSlider} ppm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Signal:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">
                  {ppmSlider === 3.5 ? "¹H: NH₃ (singlet, 15H)" : "Signal yo'q"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ligand:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">
                  {ppmSlider === 3.5 ? "NH₃ (barcha 5 ta ekvivalent)" : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* YaMR spektr simulyatsiyasi SVG */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="YaMR spektr">
              <title>YaMR spektr simulyatsiyasi — [Co(NH₃)₅(NO₂)]Cl₂</title>
              {[0, 2, 4, 6, 8, 10].map((ppm, i) => (
                <g key={i}>
                  <line x1={580 - ((ppm/10)*530)} y1="220" x2={580 - ((ppm/10)*530)} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x={580 - ((ppm/10)*530)} y="235" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik</text>

              {/* Asosiy signal (3.5 ppm) */}
              <line
                x1={580 - ((3.5/10)*530)}
                y1="220"
                x2={580 - ((3.5/10)*530)}
                y2="40"
                stroke="#eab308"
                strokeWidth="3"
              />
              <text x={580 - ((3.5/10)*530)} y="35" textAnchor="middle" fontSize="9" fill="#eab308" fontWeight="bold">
                3.5 ppm (NH₃, singlet, 15H)
              </text>

              {/* TMS referens */}
              <line x1="580" y1="220" x2="580" y2="180" stroke="#fbbf24" strokeWidth="2" />
              <text x="580" y="175" textAnchor="middle" fontSize="8" fill="#fbbf24">TMS</text>

              {/* Slider pozitsiyasi */}
              <line
                x1={580 - ((ppmSlider/10)*530)}
                y1="220"
                x2={580 - ((ppmSlider/10)*530)}
                y2="20"
                stroke="#22c55e"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
            </svg>
          </div>
        </div>

        {/* TERMIK IZOMERLANISH KINETIKASI */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔥 Termik izomerlanish kinetikasi (DSC)</h2>

          <div className="bg-yellow-900/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 text-sm">
              <strong>ScienceDirect S0040603103003617:</strong> DSC (Differential Scanning Calorimetry) yordamida termik izomerlanish kinetikasi o&apos;rganilgan.
              Nitrito → nitro konversiyasi ekzotermik (ΔH &lt; 0). Qisman qaytar (partially reversible).
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(COMPOUND.isomerizationKinetics).map(([key, pathway], i) => (
              <div
                key={key}
                onClick={() => setPathway(i + 1)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  pathway === i + 1 ? "bg-yellow-900/40 border-2 border-yellow-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-yellow-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    pathway === i + 1 ? "bg-yellow-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-400 font-bold">{pathway.name}</p>
                  </div>
                </div>
                {pathway === i + 1 && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-purple-900/50 rounded-lg p-3">
                        <div className="text-purple-400 text-xs">Transition State:</div>
                        <div className="text-white font-bold">{i === 0 ? pathway.ts1 : pathway.ts3}</div>
                      </div>
                      <div className="bg-purple-900/50 rounded-lg p-3">
                        <div className="text-purple-400 text-xs">Energy Barrier:</div>
                        <div className="text-white font-bold">{pathway.energyBarrier}</div>
                      </div>
                      <div className="bg-purple-900/50 rounded-lg p-3">
                        <div className="text-purple-400 text-xs">Intermediate:</div>
                        <div className="text-white font-bold">{pathway.intermediate}</div>
                      </div>
                      <div className="bg-purple-900/50 rounded-lg p-3">
                        <div className="text-purple-400 text-xs">Preferred:</div>
                        <div className="text-white font-bold">{pathway.preferred ? "Ha (eng past energiya)" : "Yo'q"}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-yellow-900/30 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              <strong>ωB97XD/6-31+G(d,p) bo&apos;yicha:</strong> Pathway (1) through endo-nitrito eng past energiya yo&apos;li (38.16 kcal/mol).
              Pathway (2) through TS3 (41.76 kcal/mol) — yuqoriroq energiya. Pathway (1) preferred.
            </p>
          </div>
        </div>

        {/* PHOTO-SALIENT EFFECT */}
        <div className="bg-pink-600/10 border border-pink-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">💡 Photo-salient effect (Naumov 2013)</h2>

          <div className="bg-pink-900/30 rounded-lg p-4 mb-6">
            <p className="text-pink-300 text-sm">
              <strong>Naumov (2013):</strong> UV yorug&apos;lik ta&apos;sirida [Co(NH₃)₅ONO](NO₃)Cl kristali sakraydi (photo-salient effect).
              Photo-isomerization (nitro → nitrito) jarayonida [Co(NH₃)₅ONO]²⁺ local source of strains sifatida xizmat qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-3">Photo-salient effect</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Effect:</span>
                  <span className="text-pink-400">Kristall sakraydi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Mexanizm:</span>
                  <span className="text-pink-400">Photo-isomerization</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Strain source:</span>
                  <span className="text-pink-400">[Co(NH₃)₅ONO]²⁺</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Kashfiyotchi:</span>
                  <span className="text-pink-400">Naumov (2013)</span>
                </div>
              </div>
            </div>

            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-3">Qo&apos;llanish</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Dynamic molecular crystals:</span>
                  <span className="text-pink-400">✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Photo-responsive materials:</span>
                  <span className="text-pink-400">✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Tunable optical materials:</span>
                  <span className="text-pink-400">✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Molecular devices:</span>
                  <span className="text-pink-400">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ωB97XD HISOB-KITOBLARI */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧮 ωB97XD/6-31+G(d,p) hisob-kitoblari (PMC9077707)</h2>

          <div className="bg-yellow-900/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 text-sm">
              <strong>PMC9077707:</strong> ωB97XD/6-31+G(d,p) yordamida nitro/nitrito isomerization mexanizmi o&apos;rganilgan.
              Pathway (1) through endo-nitrito eng past energiya yo&apos;li.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Hisob-kitob metodi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Method:</span>
                  <span className="text-yellow-400">ωB97XD/6-31+G(d,p)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co-N bog&apos; uzunligi:</span>
                  <span className="text-yellow-400">1.97-2.01 Å</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">PJTE stabilization:</span>
                  <span className="text-yellow-400">~750 cm⁻¹</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Manba:</span>
                  <span className="text-yellow-400">PMC9077707</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Reaction pathways</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Pathway (1):</span>
                  <span className="text-yellow-400">nitro → TS1 (38.16) → endo-nitrito → TS2 (9.68) → exo-nitrito</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Pathway (2):</span>
                  <span className="text-yellow-400">nitro → TS3 (41.76) → exo-nitrito</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Preferred:</span>
                  <span className="text-yellow-400">Pathway (1) (eng past energiya)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* YANGI: QATTIQ HOLAT YaMR */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">💎</span> Qattiq holat YaMR (Solid-State NMR)
          </h2>

          <div className="bg-indigo-900/30 rounded-lg p-4 mb-6">
            <p className="text-indigo-300 text-sm">
              <strong>CP/MAS (Cross-Polarization / Magic Angle Spinning):</strong> Erituvchisiz, kristall namuna uchun.
              Photo-salient effect mexanizmini qattiq holatda o'rganish uchun juda muhim.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-5">
              <h3 className="text-indigo-400 font-bold mb-3">Afzalliklar</h3>
              <ul className="space-y-2 text-sm text-purple-200">
                {COMPOUND.solidStateNMR.advantages.map((adv, i) => (
                  <li key={i}>✓ {adv}</li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-5">
              <h3 className="text-indigo-400 font-bold mb-3">Parametrlar</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">⁵⁹Co CQ:</span>
                  <span className="text-indigo-400 font-mono text-xs">{COMPOUND.solidStateNMR.co59_CQ}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">⁵⁹Co η:</span>
                  <span className="text-indigo-400 font-mono text-xs">{COMPOUND.solidStateNMR.co59_eta}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">¹H MAS:</span>
                  <span className="text-indigo-400 font-mono text-xs">{COMPOUND.solidStateNMR.h1_MAS}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900/30 rounded-lg p-4">
            <p className="text-indigo-300 text-sm">
              <strong>Qo'llanilishi:</strong> {COMPOUND.solidStateNMR.applications}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* YANGI: TARIXIY KONTEKST */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📜</span> Tarixiy kontekst
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Jorgensen (1894)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.jorgensen.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.jorgensen.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.jorgensen.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Usul:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.jorgensen.method}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Werner (1913)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.werner.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.werner.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.werner.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.werner.contribution}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Zamonaviy davr</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">YaMR:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.modernEra.nmr}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hisob-kitob:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.modernEra.computational}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Foto-kimyo:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.modernEra.photochemistry}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* YANGI: TAQQOSLASH — BOSHQA LINKAGE IZOMERLAR */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span> Taqqoslash — boshqa linkage izomerlar
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Kompleks</th>
                  <th className="py-3 px-3 text-teal-400">Ligand</th>
                  <th className="py-3 px-3 text-teal-400">Rang</th>
                  <th className="py-3 px-3 text-teal-400">YaMR siljish</th>
                  <th className="py-3 px-3 text-teal-400">Barqarorlik</th>
                  <th className="py-3 px-3 text-teal-400">Izomerlanish</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparison.map((comp, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/30">
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{comp.compound}</td>
                    <td className="py-3 px-3 text-xs">{comp.ligand}</td>
                    <td className="py-3 px-3 text-xs">{comp.color}</td>
                    <td className="py-3 px-3 text-xs font-mono text-yellow-400">{comp.nmrShift}</td>
                    <td className="py-3 px-3 text-xs">{comp.stability}</td>
                    <td className="py-3 px-3 text-xs">{comp.isomerization}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LABORATORIYA TARTIBI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧪 Laboratoriyani 0 dan bajarish tartibi</h2>

          <div className="space-y-3">
            {COMPOUND.labProcedure.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveLabStep(i)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  activeLabStep === i ? "bg-yellow-900/40 border-2 border-yellow-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-yellow-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeLabStep === i ? "bg-yellow-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-400 font-bold">{step.title}</p>
                  </div>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-2">
                      <div className="text-yellow-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
                      <p className="text-purple-200 text-xs">{step.theoryNote}</p>
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

        {/* HALAQIT BERUVCHI OMILLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚠️ Halaqit beruvchi omillar</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-yellow-400">Manba</th>
                  <th className="py-3 px-3 text-yellow-400">Ta&apos;sir</th>
                  <th className="py-3 px-3 text-yellow-400">Jiddiylik</th>
                  <th className="py-3 px-3 text-yellow-400">Yechim</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.interferences.map((int, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${
                      activeInterference === i ? "bg-yellow-900/20" : ""
                    }`}
                  >
                    <td className="py-3 px-3 font-bold">{int.source}</td>
                    <td className="py-3 px-3 text-xs">{int.effect}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        int.severity === "Yuqori" ? "bg-red-600/30 text-red-400" :
                        int.severity === "O'rta" ? "bg-yellow-600/30 text-yellow-400" :
                        "bg-green-600/30 text-green-400"
                      }`}>
                        {int.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs">{int.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning nazariy izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {COMPOUND.interferences[activeInterference].theoryNote}
            </p>
          </div>
        </div>

        {/* KENGAYTIRUVCHI METODLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Kengaytiruvchi metodlar</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.advancedTechniques.map((tech, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTechnique === i
                    ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">{COMPOUND.advancedTechniques[activeTechnique].name}</h3>
            <p className="text-purple-200 text-sm mb-4">{COMPOUND.advancedTechniques[activeTechnique].description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2">✓ Afzalliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {COMPOUND.advancedTechniques[activeTechnique].advantages.map((adv, i) => (
                    <li key={i}>• {adv}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2">✗ Kamchiliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {COMPOUND.advancedTechniques[activeTechnique].disadvantages.map((dis, i) => (
                    <li key={i}>• {dis}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-3">
              <div className="text-purple-400 text-xs mb-1">Eng yaxshi:</div>
              <div className="text-white text-sm">{COMPOUND.advancedTechniques[activeTechnique].bestFor}</div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-3">
              <div className="text-yellow-400 font-bold text-xs mb-1">Misollar:</div>
              <p className="text-purple-200 text-xs">{COMPOUND.advancedTechniques[activeTechnique].examples}</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Kristall maydon nazariyasi:</strong> Co³⁺ (d⁶), past spinli (t₂g⁶ eg⁰), diamagnit, Δ<sub>o</sub> ≈ 23,600 cm⁻¹</li>
            <li><strong className="text-yellow-400">Linkage izomerizm:</strong> NO₂⁻ ambidentat ligand (N-bonded vs O-bonded)</li>
            <li><strong className="text-yellow-400">Simmetriya (C₄ᵥ):</strong> IR va Raman faol, YaMR uchun ekvivalentlik</li>
            <li><strong className="text-yellow-400">Jorgensen (1894):</strong> Linkage izomerizm kashfiyoti</li>
            <li><strong className="text-yellow-400">¹H YaMR:</strong> 3.5 ppm (NH₃, singlet, 15H), deshielded (+2.6 ppm) — Co³⁺ elektropozitiv</li>
            <li><strong className="text-yellow-400">¹⁵N YaMR:</strong> 650 ppm (N-bonded), nitrito da 580 ppm (70 ppm farq). Past sezgirlik (0.37%)</li>
            <li><strong className="text-yellow-400">⁵⁹Co YaMR:</strong> 8120 ppm, keng chiziq (~500-2000 Hz), kvadrupol (I=7/2), CQ ≈ 10-30 MHz</li>
            <li><strong className="text-yellow-400">Strukturaviy:</strong> Co-N(NO₂) 1.93-1.96 Å, Co-N(NH₃) 1.96-1.99 Å, O-N-O 115-117°</li>
            <li><strong className="text-yellow-400">Termodinamik:</strong> ΔG ≈ -7 dan -11 kJ/mol, Eₐ ≈ 100-160 kJ/mol (inert)</li>
            <li><strong className="text-yellow-400">DSC termik izomerlanish:</strong> Nitrito → nitro (ekzotermik, qisman qaytar)</li>
            <li><strong className="text-yellow-400">Photo-salient effect:</strong> UV yorug&apos;lik ta&apos;sirida kristall sakraydi (Naumov 2013)</li>
            <li><strong className="text-yellow-400">ωB97XD/6-31+G(d,p):</strong> Pathway (1) through endo-nitrito (eng past energiya)</li>
            <li><strong className="text-yellow-400">Qattiq holat YaMR:</strong> CP/MAS, ⁵⁹Co CQ ≈ 10-30 MHz, η ≈ 0-0.3</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Birikmalar katalogi</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmalar/co-nh3-5-ono" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Nitrito izomer →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₅(NO₂)]Cl₂ (Nitro-pentaamminkobalt(III)) • YaMR spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Jorgensen (1894), PMC9077707, ScienceDirect S0040603103003617, Naumov (2013), Cotton-Wilkinson, Miessler-Tarr, Greenwood-Earnshaw</p>
        </div>
      </footer>
    </main>
  )
}