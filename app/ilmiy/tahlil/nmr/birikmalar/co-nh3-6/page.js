"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₆]³⁺ — GEKSAAMMINKOBALT(III) YaMR (ILMIY BOYITILGAN)
// Manbalar: Werner (1893, Nobel 1913), Cotton-Wilkinson, Miessler-Tarr,
//           Greenwood-Earnshaw, Ballhausen (Introduction to Ligand Field Theory)
// Xususiyat: Oₕ simmetriya, ideal oktaedr, inert kompleks, ⁵⁹Co referens
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]³⁺",
  formulaPlain: "[Co(NH3)6]3+",
  iupac: "Geksaamminkobalt(III)",
  commonName: "Luteo-kobalt (sariq)",
  molarMass: 161.00,
  molarMassWithCl3: 250.44,
  casNumber: "14695-95-5",
  color: "sariq (yellow)",
  structure: "Oktaedr (Oₕ)",
  metalLigand: "Co-N (NH₃, barcha 6 ta ekvivalent)",
  pointGroup: "Oₕ (amaliyotda D₃d distorded — PJT)",
  electrolyteType: "1:3 elektrolit",
  molarConductivity: "~430 S·cm²/mol",

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
    crystalFieldSplitting: "Δo ≈ 22,900 cm⁻¹ (2.84 eV)",
    racahParameter: "B ≈ 600 cm⁻¹ (erkin ion B₀ = 1020 cm⁻¹)",
    nephelauxeticRatio: "β = B/B₀ ≈ 0.59",
    pairingEnergy: "P ≈ 21,000 cm⁻¹",
    cFSE: "CFSE = -2.4Δo + P ≈ -54,960 + 21,000 = -33,960 cm⁻¹",
    spectrochemicalSeries: "NH₃ — kuchli maydon ligandi (I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < NO₂⁻ < CN⁻)",
    whyLowSpin: "Δo (22,900) > P (21,000) → past spinli, diamagnit",
    colorOrigin: "¹A₁g → ¹T₁g (F) o'tish ~22,000 cm⁻¹ (455 nm, ko'k yutilish → sariq rang)",
    chargeTransfer: "LMCT: NH₃ → Co³⁺ (~40,000 cm⁻¹, UV)",
    comparisonWithNitro: "Nitro izomerda Δo = 23,600 cm⁻¹ (NO₂⁻ kuchliroq). NH₃ da 22,900 cm⁻¹ (biroz kuchsiz)."
  },

  // ═══════════════════════════════════════════════════════════════
  // SIMMETRIYA VA SPEKTRAL TANLASH QOIDALARI
  // ═══════════════════════════════════════════════════════════════
  symmetry: {
    pointGroup: "Oₕ (ideal)",
    actualPointGroup: "D₃d (PJT distorsion)",
    order: 48,
    symmetryElements: ["E", "8C₃", "6C₂", "6C₄", "3C₂ (= C₄²)", "i", "6S₄", "8S₆", "3σh", "6σd"],
    characterTable: {
      A1g: { E: 1, C3: 1, C2: 1, C4: 1, i: 1, functions: "x²+y²+z²" },
      A2g: { E: 1, C3: 1, C2: 1, C4: 1, i: 1, functions: "R" },
      Eg: { E: 2, C3: -1, C2: 2, C4: 0, i: 2, functions: "(2z²-x²-y², x²-y²)" },
      T1g: { E: 3, C3: 0, C2: -1, C4: 1, i: 3, functions: "(Rx, Ry, Rz)" },
      T2g: { E: 3, C3: 0, C2: -1, C4: -1, i: 3, functions: "(xy, xz, yz)" },
      A1u: { E: 1, C3: 1, C2: 1, C4: 1, i: -1, functions: "—" },
      A2u: { E: 1, C3: 1, C2: 1, C4: 1, i: -1, functions: "—" },
      Eu: { E: 2, C3: -1, C2: 2, C4: 0, i: -2, functions: "—" },
      T1u: { E: 3, C3: 0, C2: -1, C4: 1, i: -3, functions: "(x, y, z)" },
      T2u: { E: 3, C3: 0, C2: -1, C4: -1, i: -3, functions: "—" }
    },
    nmrEquivalence: "Oₕ simmetriya: barcha 6 ta NH₃ MUTLAQO ekvivalent. Bitta o'tkir singlet (18H). Amaliyotda D₃d distorsion (PJT) — lekin YaMR da farq sezilmaydi (tez almashinish yoki kichik distorsion).",
    irActive: "T1u — IR faol (dipol momenti o'zgaradi). Co-N cho'zilish ~500 cm⁻¹, NH₃ tebranishlar ~3300 cm⁻¹.",
    ramanActive: "A1g, Eg, T2g — Raman faol (polyarizatsiya o'zgaradi). A1g — Co-N simmetrik cho'zilish ~450-500 cm⁻¹.",
    mutualExclusion: "Oₕ da IR va Raman MUTLAQO istisno (markaziy simmetriya bor). Hech qaysi tebranish ikkalasida ham faol emas.",
    pjtDistortion: "Pseudo-Jahn-Teller (PJT) effect: T1g ⊗ t1u ⊗ eg coupling → D₃d distorsion (~750 cm⁻¹ stabilization). Amaliyotda Co-N bog' uzunliklari 1.97-2.01 Å orasida farq qiladi."
  },

  // ═══════════════════════════════════════════════════════════════
  // YaMR NAZARIYASI — CHUQUR (ILMIY BOYITILGAN)
  // ═══════════════════════════════════════════════════════════════
  nmrTheory: {
    h1: {
      nucleus: "¹H (I = 1/2, 100% tabiiy)",
      shift: "3.5 ppm (NH₃, barcha 18 ta ekvivalent)",
      whyThisShift: "NH₃ ligand — Co³⁺ ga bog'langan. Co³⁺ kuchli elektropozitiv → NH₃ protonlari deshielded (odatdagi NH₃ dan yuqori ppm). Referens: erkin NH₃ ~0.9 ppm, kompleksda 3.5 ppm → Δδ = +2.6 ppm (deshielding, metal effekti). Barcha 6 NH₃ Oₕ simmetriyada ekvivalent → bitta singlet.",
      multiplicity: "Singlet (Oₕ simmetriyada barcha 6 NH₃ MUTLAQO ekvivalent)",
      linewidth: "~3-10 Hz (juda o'tkir, diamagnit, simmetrik muhit)",
      t1Relaxation: "T₁ ≈ 2-5 s (dipol-dipol mexanizm, ¹H-¹⁴N bog'lanish)",
      couplingNotes: "¹J(¹H-¹⁵N) ≈ 5-10 Hz (¹⁵N tabiiy 0.37%, kuzatilmaydi). ¹⁵N bilan boyitilsa, dublet. ²J(¹H-⁵⁹Co) kuzatilmaydi (⁵⁹Co kvadrupol, keng chiziq)."
    },
    n15: {
      nucleus: "¹⁵N (I = 1/2, 0.37% tabiiy)",
      shift: "~50-80 ppm (NH₃, Co³⁺ ga bog'langan) — referens: CH₃NO₂ (0 ppm)",
      whyThisShift: "NH₃ ligand — Co³⁺ ga N orqali bog'langan. N atomi Co³⁺ ga to'g'ridan-to'g'ri bog'langan → deshielded → yuqori ppm. Erkin NH₃ da ¹⁵N ~-350 ppm, kompleksda ~50-80 ppm → Δδ = +400 ppm (katta deshielding, metal effekti).",
      referencing: "Referens: CH₃NO₂ (nitrometan, 0 ppm) yoki ¹⁵NH₄Cl (0 ppm).",
      sensitivity: "¹⁵N sezgirligi ¹H dan 5700 marta past. 1000-10000 skan kerak.",
      linewidth: "~10-30 Hz (o'tkir, CSA kichik)",
      t1Relaxation: "T₁ ≈ 20-100 s (uzoq, CSA va dipol-dipol mexanizmlar)",
      csa: "Kimyoviy siljish anizotropiyasi (CSA): Δσ ≈ 50-150 ppm (NH₃ uchun kichik)"
    },
    co59: {
      nucleus: "⁵⁹Co (I = 7/2, 100% tabiiy)",
      shift: "8120 ppm (referens: [Co(NH₃)₆]³⁺ yoki [Co(CN)₆]³⁻, 0 ppm)",
      whyThisShift: "⁵⁹Co kimyoviy siljishi juda keng diapazon (-18000 dan +18000 ppm). [Co(NH₃)₆]³⁺ ko'pincha referens sifatida ishlatiladi (0 ppm). Boshqa komplekslar shu referensga nisbatan o'lchanadi. Oₕ simmetriya — yuqori simmetriya, lekin kvadrupol kengayishi tufayli keng chiziq.",
      quadrupolar: "⁵⁹Co — kvadrupol yadro (I = 7/2). Oₕ simmetriyada kvadrupol bog'lanish konstantasi CQ ≈ 0-5 MHz (Oₕ da nolga yaqin, lekin PJT tufayli biroz). Asimmetriya parametri η ≈ 0.",
      linewidth: "~200-800 Hz (keng, kvadrupol relaksatsiya tufayli)",
      t1Relaxation: "T₁ ≈ 5-50 ms (qisqa, kvadrupol mexanizm dominant)",
      detection: "Keng chiziqlar tufayli sezgirlik past. Maxsus impulslar (keng chiziqli texnikalar) kerak.",
      applications: "Koordinatsion geometriya, ligand maydon kuchi, spin holatini aniqlash. REFERENS sifatida ishlatiladi.",
      referenceNote: "[Co(NH₃)₆]³⁺ — ⁵⁹Co YaMR uchun standart referens (0 ppm). Boshqa barcha Co komplekslari shu referensga nisbatan o'lchanadi."
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY PARAMETRLAR (ILMIY BOYITILGAN)
  // ═══════════════════════════════════════════════════════════════
  structuralData: {
    bondLengths: {
      coN_NH3: "1.97-2.01 Å (Co-N NH₃, Oₕ simmetriyada barcha ekvivalent)",
      nh_Bond: "1.01-1.03 Å (N-H, NH₃ ichida)",
      comparison: "PJT distorsion tufayli Co-N bog'lar 1.97-2.01 Å orasida biroz farq qiladi (ideal Oₕ da barcha bir xil bo'lishi kerak).",
      xrayData: "Neutron diffraktsiya: Co-N = 1.971 Å (25°C). XRD: 1.97-2.01 Å."
    },
    bondAngles: {
      nCoN_Angle: "90° (cis NH₃-NH₃), 180° (trans NH₃-NH₃)",
      hNH_Angle: "107° (H-N-H, NH₃ ichida, sp³ ga yaqin)",
      comparison: "Ideal Oₕ da barcha N-Co-N burchaklar 90° yoki 180°. PJT tufayli biroz farq (±1-2°)."
    },
    transEffect: {
      order: "NH₃ — o'rtacha trans-effekt (barcha NH₃ bir xil)",
      mechanism: "σ-bog'lanish (NH₃ π-donor emas, π-akseptor ham emas)",
      consequence: "Barcha NH₃ ekvivalent — trans-effekt farqi yo'q"
    },
    pjtDistortion: {
      description: "Pseudo-Jahn-Teller (PJT) effect",
      mechanism: "T1g ⊗ t1u ⊗ eg coupling",
      stabilization: "~750 cm⁻¹",
      result: "Oₕ → D₃d distorsion",
      observable: "Co-N bog' uzunliklari 1.97-2.01 Å orasida farq qiladi",
      whyImportant: "PJT tufayli ⁵⁹Co kvadrupol bog'lanish nolga yaqin (CQ ≈ 0-5 MHz). YaMR da bu kichik kengayishga olib keladi."
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // TERMODINAMIK VA KINETIK PARAMETRLAR
  // ═══════════════════════════════════════════════════════════════
  thermodynamics: {
    stability: {
      formationConstant: "log β₆ ≈ 35 (juda barqaror)",
      stepwiseConstants: "log K₁ ≈ 6.7, log K₂ ≈ 5.5, log K₃ ≈ 4.5, log K₄ ≈ 3.5, log K₅ ≈ 2.5, log K₆ ≈ 1.5",
      overallStability: "Juda barqaror — kuchli maydon ligandi, katta CFSE",
      comparison: "[Co(H₂O)₆]³⁺ dan 10¹⁰ marta barqaror (NH₃ kuchliroq maydon)"
    },
    inertness: {
      why: "Co³⁺ d⁶ past spinli — katta CFSE, inert (sekin ligand almashinish)",
      waterExchange: "k_ex ≈ 10⁻⁶ s⁻¹ (juda sekin, kunlab vaqt)",
      acidHydrolysis: "k ≈ 10⁻⁶ s⁻¹ (pH = 1, 25°C da)",
      comparison: "Co²⁺ (d⁷) labil (k_ex ≈ 10⁶ s⁻¹), Fe³⁺ (d⁵) o'rtacha, Cr³⁺ (d³) juda inert (k_ex ≈ 10⁻⁶ s⁻¹)",
      taubeClassification: "Taube tasnifi: INERT (k < 10⁻⁴ s⁻¹)",
      mechanism: "Dissociative interchange (Id) mexanizmi",
      activationParameters: "ΔH‡ ≈ 100-120 kJ/mol, ΔS‡ ≈ +50 J/(mol·K)"
    },
    thermodynamicStability: {
      deltaHf: "ΔHf ≈ -400 kJ/mol (juda ekzotermik)",
      deltaGf: "ΔGf ≈ -350 kJ/mol",
      deltaSf: "ΔSf ≈ -150 J/(mol·K) (tartibli, 6 ta NH₃ bog'langan)",
      thermalStability: "300°C gacha barqaror (termik jihatdan)"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // QATTIQ HOLAT YaMR (ILMIY BOYITILGAN)
  // ═══════════════════════════════════════════════════════════════
  solidStateNMR: {
    technique: "CP/MAS (Cross-Polarization / Magic Angle Spinning)",
    advantages: ["Kristall namuna", "Erituvchi kerak emas", "Polimorfizm o'rganish"],
    co59_CQ: "CQ(⁵⁹Co) ≈ 0-5 MHz (Oₕ simmetriyada nolga yaqin, PJT tufayli biroz)",
    co59_eta: "η ≈ 0 (Oₕ simmetriyaga yaqin)",
    h1_MAS: "¹H MAS — NH₃ signali 3.5 ppm da (eritma bilan bir xil)",
    applications: "Polimorfizm, termik barqarorlik, kristall struktura",
    referenceNote: "[Co(NH₃)₆]³⁺ qattiq holatda ham ⁵⁹Co referens sifatida ishlatiladi"
  },

  // ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST (JUDA MUHIM)
  // ═══════════════════════════════════════════════════════════════
  history: {
    werner: {
      year: 1893,
      scientist: "Alfred Werner (Shveytsariya)",
      achievement: "Koordinatsion nazariya asoschisi",
      nobelYear: 1913,
      nobelPrize: "Kimyo bo'yicha Nobel mukofoti",
      contribution: "[Co(NH₃)₆]Cl₃ — birinchi to'liq tavsiflangan koordinatsion birikma",
      theory: "Markaziy atom va ligandlar o'rtasidagi bog'lanish. Koordinatsion son = 6. Oktaedr geometriya.",
      significance: "Werner nazariyasi — zamonaviy koordinatsion kimyoning asosi. Barcha keyingi komplekslar shu nazariya asosida o'rganiladi.",
      luteoName: "'Luteo' — lotincha 'luteus' (sariq). Werner birikmalarni rangi bo'yicha nomlagan: luteo (sariq), purpureo (binafsha), vioceo (qizil-binafsha), roseo (pushti)."
    },
    jorgensen: {
      year: 1894,
      scientist: "Sophus Mads Jorgensen (Daniya)",
      contribution: "[Co(NH₃)₆]Cl₃ ni birinchi bo'lib sintez qilgan (Wernerdan oldin)",
      note: "Jorgensen birikmani sintez qildi, lekin nazariy tushuntirmadi. Werner nazariy bilan tushuntirdi."
    },
    modernEra: {
      nmr: "1960-yillardan YaMR orqali o'rganish (¹H, ⁵⁹Co)",
      xray: "1930-yillardan XRD orqali struktura aniqlash",
      computational: "DFT, CCSD hisob-kitoblari (2000-yillar)",
      pjt: "PJT distorsion — 2010-yillar tadqiqotlari"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH — BOSHQA Co(III) KOMPLEKSLARI
  // ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      compound: "[Co(NH₃)₆]³⁺",
      ligand: "6× NH₃",
      color: "Sariq",
      symmetry: "Oₕ",
      nmrShift: "¹H: 3.5 ppm, ⁵⁹Co: 8120 ppm",
      stability: "log β₆ ≈ 35",
      note: "Referens, ideal oktaedr"
    },
    {
      compound: "[Co(NH₃)₅(NO₂)]²⁺",
      ligand: "5× NH₃ + NO₂⁻",
      color: "Sariq",
      symmetry: "C₄ᵥ",
      nmrShift: "¹H: 3.5 ppm, ¹⁵N: 650 ppm",
      stability: "log β₆ ≈ 30",
      note: "Linkage izomerizm"
    },
    {
      compound: "[Co(NH₃)₅(ONO)]²⁺",
      ligand: "5× NH₃ + ONO⁻",
      color: "Qizil",
      symmetry: "C₄ᵥ",
      nmrShift: "¹H: 3.5 ppm, ¹⁵N: 580 ppm",
      stability: "log β₆ ≈ 28",
      note: "Metastabil"
    },
    {
      compound: "[Co(en)₃]³⁺",
      ligand: "3× en (bidentat)",
      color: "Sariq-to'q sariq",
      symmetry: "D₃",
      nmrShift: "¹H: 2.8-3.5 ppm",
      stability: "log β₃ ≈ 49",
      note: "Xelat effekti, xirallik"
    },
    {
      compound: "[Co(CN)₆]³⁻",
      ligand: "6× CN⁻",
      color: "Sariq",
      symmetry: "Oₕ",
      nmrShift: "¹³C: 177 ppm",
      stability: "log β₆ ≈ 60",
      note: "Eng kuchli maydon, juda barqaror"
    },
    {
      compound: "[CoF₆]³⁻",
      ligand: "6× F⁻",
      color: "Yashil",
      symmetry: "Oₕ",
      nmrShift: "¹⁹F: o'zgaruvchan",
      stability: "log β₆ ≈ 15",
      note: "Kuchsiz maydon, yuqori spinli"
    }
  ],

  // YaMR ma'lumotlari
  nmrNucleus: "¹H, ¹⁵N, ⁵⁹Co",
  chemicalShift: "¹H: 3.5 ppm (NH₃, 18H), ⁵⁹Co: 8120 ppm",
  multiplicity: "singlet",
  jCoupling: "—",

  // YaMR signallar (batafsil)
  nmrSignals: [
    {
      nucleus: "¹H",
      ligand: "NH₃ (barcha 6 ta)",
      shift: 3.5,
      multiplicity: "singlet",
      jCoupling: "—",
      integration: "18H",
      notes: "Barcha 6 ta NH₃ MUTLAQO ekvivalent (Oₕ simmetriya). Bitta o'tkir singlet (18H). Inert kompleks — sekin almashinish. Deshielded (+2.6 ppm) — Co³⁺ elektropozitiv."
    },
    {
      nucleus: "¹⁵N",
      ligand: "NH₃ (barcha 6 ta)",
      shift: 65,
      multiplicity: "singlet",
      jCoupling: "—",
      integration: "6N",
      notes: "Barcha 6 ta NH₃ ekvivalent. ¹⁵N YaMR da ~65 ppm da signal. Erkin NH₃ dan +400 ppm farq (katta deshielding). Past sezgirlik (0.37% tabiiy)."
    },
    {
      nucleus: "⁵⁹Co",
      ligand: "Co markaz",
      shift: 8120,
      multiplicity: "singlet (keng)",
      jCoupling: "—",
      integration: "1Co",
      notes: "⁵⁹Co YaMR da 8120 ppm atrofida signal (referens: 0 ppm). Keng chiziq (~200-800 Hz, kvadrupol, I=7/2). CQ ≈ 0-5 MHz (Oₕ simmetriya). REFERENS sifatida ishlatiladi."
    }
  ],

  // YaMR spektr ma'lumotlari (simulyatsiya uchun)
  nmrSpectrum: [
    { ppm: 0, intensity: 0, notes: "TMS referens" },
    { ppm: 1, intensity: 0, notes: "—" },
    { ppm: 2, intensity: 0, notes: "—" },
    { ppm: 3.5, intensity: 1.0, notes: "¹H: NH₃ (singlet, 18H)" },
    { ppm: 4, intensity: 0, notes: "—" },
    { ppm: 5, intensity: 0, notes: "—" },
    { ppm: 6, intensity: 0, notes: "—" },
    { ppm: 7, intensity: 0, notes: "—" },
    { ppm: 8, intensity: 0, notes: "—" },
    { ppm: 9, intensity: 0, notes: "—" },
    { ppm: 10, intensity: 0, notes: "—" }
  ],

  // Halaqit beruvchi omillar
  interferences: [
    {
      source: "⁵⁹Co kvadrupol kengayishi",
      effect: "⁵⁹Co signallari keng (~200-800 Hz), sezgirlik past",
      severity: "O'rta",
      solution: "Keng chiziqli texnikalar, yuqori konsentratsiya, uzoq vaqt skanerlash.",
      theoryNote: "⁵⁹Co (I=7/2) kvadrupol yadro. Oₕ simmetriyada CQ ≈ 0-5 MHz (PJT tufayli biroz). T₁ qisqa (~ms)."
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
    },
    {
      source: "Kislota-gidroлиз",
      effect: "Past pH da [Co(NH₃)₆]³⁺ sekin gidrolizlanadi → [Co(NH₃)₅(H₂O)]³⁺",
      severity: "Past",
      solution: " Neytral yoki biroz ishqoriy pH da saqlash. pH > 7.",
      theoryNote: "Inert kompleks bo'lsa ham, past pH da sekin gidrolizlanadi (k ≈ 10⁻⁶ s⁻¹). Uzoq vaqt saqlansa, aralashma paydo bo'ladi."
    }
  ],

  // Laboratoriya tartibi
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak. Co³⁺ zaharli. NH₃ uchuvchan, irritant.",
      time: "15 daq",
      theoryNote: "Co³⁺ zaharli. NH₃ uchuvchan — yaxshi havalandırılan joyda ishlash."
    },
    {
      step: 2,
      title: "[Co(NH₃)₆]Cl₃ ni sintez qilish",
      desc: "Charbonneau usuli: [Co(H₂O)₆]Cl₂ + NH₄Cl + NH₃ + H₂O₂ (oksidlovchi) → [Co(NH₃)₆]Cl₃. Aktivlangan ko'mir katalizator.",
      time: "2-3 soat (sintez) + 12 soat (kristallanish)",
      theoryNote: "Co²⁺ → Co³⁺ oksidlanish. H₂O₂ oksidlovchi. Aktivlangan ko'mir — para-position selektivligi uchun katalizator."
    },
    {
      step: 3,
      title: "Kristallash va tozalash",
      desc: "Sariq kristallar. Sovutish orqali kristallash. Etanol bilan yuvish.",
      time: "12-24 soat",
      theoryNote: "[Co(NH₃)₆]Cl₃ — sariq kristallar. Suvda yaxshi eriydi. Etanolda kam eriydi."
    },
    {
      step: 4,
      title: "YaMR spektrometrni tayyorlash",
      desc: "YaMR spektrometrni yoqish, 30 daq stabillash. Shimlash (shimming) qilish. D₂O yoki DMSO-d₆ erituvchi.",
      time: "30 daq",
      theoryNote: "Shimlash — magnit maydonining bir xilligini ta'minlash. Yaxshi shimlash — o'tkir signallar."
    },
    {
      step: 5,
      title: "Namuna tayyorlash",
      desc: "5-10 mg namunani 0.6 mL D₂O yoki DMSO-d₆ da eritish. YaMR naychaga solish.",
      time: "10-15 daq",
      theoryNote: "D₂O da NH₃ signali 3.5 ppm da. DMSO-d₆ da ham 3.5 ppm. Barcha 6 NH₃ ekvivalent — bitta singlet."
    },
    {
      step: 6,
      title: "¹H YaMR spektrini olish",
      desc: "¹H YaMR spektrini olish (16-64 skan). NH₃ signalini tekshirish (3.5 ppm, singlet, 18H).",
      time: "5-10 daq",
      theoryNote: "¹H YaMR da NH₃ signali 3.5 ppm da singlet (18H). Barcha 6 ta NH₃ ekvivalent (Oₕ simmetriya). O'tkir signal — diamagnit, inert."
    },
    {
      step: 7,
      title: "⁵⁹Co YaMR spektrini olish (ixtiyoriy)",
      desc: "⁵⁹Co YaMR spektrini olish (keng chiziqli texnikalar). Signal 8120 ppm da, keng (~200-800 Hz).",
      time: "1-2 soat",
      theoryNote: "⁵⁹Co (I=7/2) kvadrupol yadro. Keng chiziqlar, past sezgirlik. Maxsus impulslar kerak. [Co(NH₃)₆]³⁺ — ⁵⁹Co referens (0 ppm)."
    },
    {
      step: 8,
      title: "¹⁵N YaMR spektrini olish (ixtiyoriy)",
      desc: "¹⁵N YaMR spektrini olish (1000-10000 skan). NH₃ signalini tekshirish (~65 ppm, singlet).",
      time: "30-60 daq",
      theoryNote: "¹⁵N YaMR da NH₃ signali ~65 ppm da. Erkin NH₃ dan +400 ppm farq. Past sezgirlik — boyitish tavsiya etiladi."
    }
  ],

  // Kengaytiruvchi metodlar
  advancedTechniques: [
    {
      name: "XRD (X-ray Diffraction)",
      description: "Kristall struktura aniqlash",
      advantages: ["Aniq bog' uzunliklari", "Simmetriya aniqlash", "PJT distorsion"],
      disadvantages: ["Yaxshi kristall kerak", "Vaqt talab qiladi"],
      bestFor: "Strukturaviy aniqlash, PJT o'rganish",
      examples: "Co-N = 1.971 Å (neutron diffraktsiya)"
    },
    {
      name: "UV-Vis Spektroskopiya",
      description: "Elektron o'tishlar, Δo aniqlash",
      advantages: ["Δo aniqlash", "CFSE hisoblash", "Tez va oson"],
      disadvantages: ["Faqat elektron o'tishlar", "Strukturaviy ma'lumot yo'q"],
      bestFor: "Kristall maydon parametrlari",
      examples: "¹A₁g → ¹T₁g o'tish ~22,000 cm⁻¹"
    },
    {
      name: "IR Spektroskopiya",
      description: "Tebranish spektri, simmetriya aniqlash",
      advantages: ["NH₃ tebranishlar", "Co-N bog'", "Simmetriya"],
      disadvantages: ["Oₕ da IR faol faqat T1u", "Murakkab tahlil"],
      bestFor: "Simmetriya, ligand identifikatsiyasi",
      examples: "Co-N cho'zilish ~500 cm⁻¹ (T1u)"
    },
    {
      name: "Raman Spektroskopiya",
      description: "Simmetrik tebranishlar",
      advantages: ["A1g faol", "Oₕ da IR va Raman istisno", "Simmetriya"],
      disadvantages: ["Kuchsiz signal", "Fluoressensiya muammo"],
      bestFor: "Simmetrik tebranishlar, simmetriya tasdiqlash",
      examples: "A1g Co-N simmetrik cho'zilish ~450-500 cm⁻¹"
    },
    {
      name: "Qattiq holat YaMR (CP/MAS)",
      description: "Kristall namuna uchun qattiq holat YaMR",
      advantages: ["Erituvchi kerak emas", "Polimorfizm", "⁵⁹Co CQ, η"],
      disadvantages: ["Maxsus uskuna", "Keng chiziqlar", "Murakkab tahlil"],
      bestFor: "Kristall namuna, polimorfizm",
      examples: "⁵⁹Co CQ ≈ 0-5 MHz (Oₕ simmetriya)"
    },
    {
      name: "DFT hisob-kitoblari",
      description: "Kvant kimyoviy hisob-kitoblar (struktura, energiya)",
      advantages: ["Struktura optimizatsiya", "Energiya", "Elektron struktura"],
      disadvantages: ["Kuchli kompyuter kerak", "Murakkab hisob-kitoblar"],
      bestFor: "Struktura, energiya, elektron struktura",
      examples: "B3LYP/6-31G(d) — Co-N = 1.97 Å"
    }
  ]
}

export default function CoNH36Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [ppmSlider, setPpmSlider] = useState(3.5)
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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-amber-950/20 to-blue-950 text-white">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-amber-950 to-purple-950 border-2 border-amber-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">👑</span> [Co(NH₃)₆]³⁺ — WERNER KOORDINATSION NAZARIYASI ASOSI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-amber-300">[Co(NH₃)₆]³⁺</strong> — geksaamminkobalt(III), luteo-kobalt.
              Werner Nobel mukofoti (1913), Oₕ simmetriya, ideal oktaedr, ⁵⁹Co referens!
            </p>

            <div className="bg-amber-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-amber-400 font-bold mb-2">🧲 YaMR signallar:</div>
                  <div className="text-purple-200">
                    <strong>¹H:</strong> 3.5 ppm (NH₃, singlet, 18H)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹⁵N:</strong> ~65 ppm (NH₃)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>⁵⁹Co:</strong> 8120 ppm (referens: 0 ppm)
                  </div>
                </div>
                <div>
                  <div className="text-amber-400 font-bold mb-2">🔬 Muhim xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Oₕ simmetriya</strong> — ideal oktaedr
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Barcha 6 NH₃ ekvivalent</strong> — bitta singlet
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Inert kompleks</strong> — sekin almashinish
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-amber-300">Tarixiy ahamiyati:</strong> Werner (1893) — koordinatsion nazariya asoschisi.
                Nobel mukofoti (1913). Birinchi to'liq tavsiflangan koordinatsion birikma.
              </p>
            </div>

            <div className="bg-amber-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-amber-200">
                <strong className="text-amber-300">⚠️ XAVFSIZLIK:</strong> Co³⁺ zaharli! NH₃ uchuvchan, irritant. Yaxshi havalandırılan joyda ishlash.
              </p>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-amber-400 font-semibold">[Co(NH₃)₆]³⁺</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-amber-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🧲 YaMR</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Werner (1893)</span>
                  <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Oₕ Simmetriya</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Diamagnit</span>
                  <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Inert</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-xs bg-amber-600/80 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Birikmalar katalogi
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-amber-600 hover:bg-amber-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-3 py-1 rounded-full text-xs font-semibold">YaMR</span>
            <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-3 py-1 rounded-full text-xs">Werner (1893)</span>
            <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-3 py-1 rounded-full text-xs">Nobel 1913</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Oₕ Simmetriya</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              [Co(NH₃)₆]³⁺
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            geksaamminkobalt(III) — <span className="text-amber-400 italic">&quot;Werner koordinatsion nazariyasining asosi, ideal oktaedr, ⁵⁹Co referens&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-amber-400">YaMR spektroskopiya</strong> yordamida <strong className="text-amber-400">ideal oktaedr kompleksni</strong> o&apos;rganish.
            Barcha 6 ta NH₃ MUTLAQO ekvivalent (Oₕ simmetriya) — bitta o&apos;tkir singlet.
            <strong className="text-amber-400"> ¹H: 3.5 ppm (NH₃, singlet, 18H)</strong>,
            <strong className="text-amber-400"> ⁵⁹Co: 8120 ppm (referens: 0 ppm)</strong>.
            Werner Nobel mukofoti (1913), koordinatsion kimyoning asosi.
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
              <div className="text-white font-bold">Oₕ (ideal)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit</div>
              <div className="text-white font-bold">1:3</div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TARIXIY KONTEKST — WERNER */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">👑</span> Tarixiy kontekst — Werner koordinatsion nazariyasi
          </h2>

          <div className="bg-amber-900/30 rounded-lg p-4 mb-6">
            <p className="text-amber-300 text-sm">
              <strong>Alfred Werner (1866-1919):</strong> Shveytsariyalik kimyogar. 1893-yilda koordinatsion nazariyani taklif qildi.
              1913-yilda kimyo bo'yicha Nobel mukofotini old. [Co(NH₃)₆]Cl₃ — uning nazariyasini tasdiqlovchi birinchi va eng muhim birikma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Werner (1893)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.werner.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.werner.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Nobel:</span>
                  <span className="text-amber-400">{COMPOUND.history.werner.nobelYear}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.werner.achievement}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Nazariya</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.werner.contribution}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Nazariya:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.werner.theory}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Ahamiyati:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.werner.significance}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Luteo nomi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Ma'nosi:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.werner.luteoName}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Jorgensen:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.jorgensen.contribution}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Izoh:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.jorgensen.note}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/30 rounded-lg p-4">
            <h4 className="text-amber-400 font-bold mb-2">Zamonaviy davr</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-purple-400">YaMR:</div>
                <div className="text-amber-400">{COMPOUND.history.modernEra.nmr}</div>
              </div>
              <div>
                <div className="text-purple-400">XRD:</div>
                <div className="text-amber-400">{COMPOUND.history.modernEra.xray}</div>
              </div>
              <div>
                <div className="text-purple-400">Hisob-kitob:</div>
                <div className="text-amber-400">{COMPOUND.history.modernEra.computational}</div>
              </div>
              <div>
                <div className="text-purple-400">PJT:</div>
                <div className="text-amber-400">{COMPOUND.history.modernEra.pjt}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* KRISTALL MAYDON NAZARIYASI */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔬</span> Kristall maydon nazariyasi (Crystal Field Theory)
          </h2>

          <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>Nima uchun bu kompleks diamagnit?</strong> Co³⁺ — d⁶ elektron konfiguratsiya. NH₃ — kuchli maydon ligandi.
              Δ<sub>o</sub> (22,900 cm⁻¹) &gt; P (juftlanish energiyasi, 21,000 cm⁻¹) → past spinli (low-spin), barcha elektronlar juftlangan → diamagnit.
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
        {/* SIMMETRIYA VA SPEKTRAL TANLASH QOIDALARI */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📐</span> Simmetriya (Oₕ) va spektral tanlash qoidalari
          </h2>

          <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-sm">
              <strong>Oₕ nuqtaviy guruhi:</strong> [Co(NH₃)₆]³⁺ — ideal oktaedr geometriya. Eng yuqori simmetriya (tartib = 48).
              Bu simmetriya IR, Raman va YaMR spektrlarini belgilaydi. IR va Raman MUTLAQO istisno (markaziy simmetriya bor).
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
                  <span className="text-purple-400">Amaldagi guruh:</span>
                  <span className="text-purple-400 font-mono">{COMPOUND.symmetry.actualPointGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Guruh tartibi:</span>
                  <span className="text-purple-400 font-mono">{COMPOUND.symmetry.order}</span>
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

          <div className="bg-amber-900/30 rounded-lg p-4">
            <h4 className="text-amber-400 font-bold mb-2">Pseudo-Jahn-Teller (PJT) distorsion</h4>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Ta'rif:</strong> {COMPOUND.symmetry.pjtDistortion.description}
            </p>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Mexanizm:</strong> {COMPOUND.symmetry.pjtDistortion.mechanism}
            </p>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Stabilizatsiya:</strong> {COMPOUND.symmetry.pjtDistortion.stabilization}
            </p>
            <p className="text-purple-200 text-sm">
              <strong>Natija:</strong> {COMPOUND.symmetry.pjtDistortion.result}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* STRUKTURAVIY PARAMETRLAR */}
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
                  <span className="text-purple-400">Co-N (NH₃):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.coN_NH3}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">N-H (NH₃ ichida):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.nh_Bond}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Taqqoslash:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.structuralData.bondLengths.comparison}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">XRD ma'lumotlari:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.structuralData.bondLengths.xrayData}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog' burchaklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">N-Co-N:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.nCoN_Angle}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">H-N-H:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.hNH_Angle}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Taqqoslash:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.structuralData.bondAngles.comparison}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/30 rounded-lg p-4">
            <h4 className="text-amber-400 font-bold mb-2">PJT distorsion (batafsil)</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-purple-400 text-xs">Mexanizm:</div>
                <div className="text-amber-400">{COMPOUND.structuralData.pjtDistortion.mechanism}</div>
              </div>
              <div>
                <div className="text-purple-400 text-xs">Stabilizatsiya:</div>
                <div className="text-amber-400">{COMPOUND.structuralData.pjtDistortion.stabilization}</div>
              </div>
              <div>
                <div className="text-purple-400 text-xs">Natija:</div>
                <div className="text-amber-400">{COMPOUND.structuralData.pjtDistortion.result}</div>
              </div>
              <div>
                <div className="text-purple-400 text-xs">Kuzatilishi:</div>
                <div className="text-amber-400">{COMPOUND.structuralData.pjtDistortion.observable}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* YaMR NAZARIYASI — CHUQUR */}
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
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun ~65 ppm?</div>
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
              <div className="bg-amber-900/30 rounded-lg p-3">
                <div className="text-amber-400 font-bold text-xs mb-1">REFERENS!</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.co59.referenceNote}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Qo'llanilishi:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.co59.applications}</p>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TERMODINAMIK VA KINETIK PARAMETRLAR */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span> Termodinamik va kinetik parametrlar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Barqarorlik (Stability)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">log β₆:</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.stability.formationConstant}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Bosqichma-bosqich:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.stability.stepwiseConstants}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Umumiy barqarorlik:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.stability.overallStability}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Taqqoslash:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.stability.comparison}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Inertlik (Inertness)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Nima uchun inert?</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.inertness.why}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Suv almashinish:</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.inertness.waterExchange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Kislota gidroliz:</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.inertness.acidHydrolysis}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Taube tasnifi:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.inertness.taubeClassification}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Mexanizm:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.inertness.mechanism}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-900/30 rounded-lg p-4">
            <h4 className="text-orange-400 font-bold mb-2">Termodinamik barqarorlik</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-purple-400 text-xs">ΔH<sub>f</sub>:</div>
                <div className="text-orange-400">{COMPOUND.thermodynamics.thermodynamicStability.deltaHf}</div>
              </div>
              <div>
                <div className="text-purple-400 text-xs">ΔG<sub>f</sub>:</div>
                <div className="text-orange-400">{COMPOUND.thermodynamics.thermodynamicStability.deltaGf}</div>
              </div>
              <div>
                <div className="text-purple-400 text-xs">ΔS<sub>f</sub>:</div>
                <div className="text-orange-400">{COMPOUND.thermodynamics.thermodynamicStability.deltaSf}</div>
              </div>
              <div>
                <div className="text-purple-400 text-xs">Termik:</div>
                <div className="text-orange-400">{COMPOUND.thermodynamics.thermodynamicStability.thermalStability}</div>
              </div>
            </div>
          </div>
        </div>

        {/* YaMR SIGNALLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧲 YaMR signallar (batafsil)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-amber-400">Yadro</th>
                  <th className="py-3 px-3 text-amber-400">Ligand</th>
                  <th className="py-3 px-3 text-amber-400">δ (ppm)</th>
                  <th className="py-3 px-3 text-amber-400">Multiplicity</th>
                  <th className="py-3 px-3 text-amber-400">J (Hz)</th>
                  <th className="py-3 px-3 text-amber-400">Integration</th>
                  <th className="py-3 px-3 text-amber-400">Izohlar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.nmrSignals.map((signal, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/30">
                    <td className="py-3 px-3 text-amber-400 font-bold">{signal.nucleus}</td>
                    <td className="py-3 px-3">{signal.ligand}</td>
                    <td className="py-3 px-3 text-amber-400 font-mono">{signal.shift}</td>
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
            <label className="block text-amber-400 font-bold mb-2">
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
                <div className="text-xl font-mono font-bold text-amber-400">{ppmSlider} ppm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Signal:</div>
                <div className="text-xl font-mono font-bold text-amber-400">
                  {ppmSlider === 3.5 ? "¹H: NH₃ (singlet, 18H)" : "Signal yo'q"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ligand:</div>
                <div className="text-xl font-mono font-bold text-amber-400">
                  {ppmSlider === 3.5 ? "NH₃ (barcha 6 ta ekvivalent)" : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* YaMR spektr simulyatsiyasi SVG */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="YaMR spektr">
              <title>YaMR spektr simulyatsiyasi — [Co(NH₃)₆]³⁺</title>
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
                stroke="#f59e0b"
                strokeWidth="3"
              />
              <text x={580 - ((3.5/10)*530)} y="35" textAnchor="middle" fontSize="9" fill="#f59e0b" fontWeight="bold">
                3.5 ppm (NH₃, singlet, 18H)
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

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* QATTIQ HOLAT YaMR */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">💎</span> Qattiq holat YaMR (Solid-State NMR)
          </h2>

          <div className="bg-indigo-900/30 rounded-lg p-4 mb-6">
            <p className="text-indigo-300 text-sm">
              <strong>CP/MAS (Cross-Polarization / Magic Angle Spinning):</strong> Erituvchisiz, kristall namuna uchun.
              [Co(NH₃)₆]³⁺ — ⁵⁹Co referens sifatida qattiq holatda ham ishlatiladi.
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
            <p className="text-indigo-300 text-sm mt-2">
              <strong>Referens:</strong> {COMPOUND.solidStateNMR.referenceNote}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAQQOSLASH — BOSHQA Co(III) KOMPLEKSLARI */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span> Taqqoslash — boshqa Co(III) komplekslari
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Kompleks</th>
                  <th className="py-3 px-3 text-teal-400">Ligand</th>
                  <th className="py-3 px-3 text-teal-400">Rang</th>
                  <th className="py-3 px-3 text-teal-400">Simmetriya</th>
                  <th className="py-3 px-3 text-teal-400">YaMR siljish</th>
                  <th className="py-3 px-3 text-teal-400">Barqarorlik</th>
                  <th className="py-3 px-3 text-teal-400">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparison.map((comp, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/30 ${i === 0 ? "bg-amber-900/20" : ""}`}>
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{comp.compound}</td>
                    <td className="py-3 px-3 text-xs">{comp.ligand}</td>
                    <td className="py-3 px-3 text-xs">{comp.color}</td>
                    <td className="py-3 px-3 text-xs font-mono">{comp.symmetry}</td>
                    <td className="py-3 px-3 text-xs font-mono text-amber-400">{comp.nmrShift}</td>
                    <td className="py-3 px-3 text-xs">{comp.stability}</td>
                    <td className="py-3 px-3 text-xs">{comp.note}</td>
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
                  activeLabStep === i ? "bg-amber-900/40 border-2 border-amber-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-amber-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeLabStep === i ? "bg-amber-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-amber-400 font-bold">{step.title}</p>
                  </div>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 mt-2">
                      <div className="text-amber-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
                      <p className="text-purple-200 text-xs">{step.theoryNote}</p>
                    </div>
                    <div className="text-[10px] text-amber-400 mt-2">
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
                  <th className="py-3 px-3 text-amber-400">Manba</th>
                  <th className="py-3 px-3 text-amber-400">Ta&apos;sir</th>
                  <th className="py-3 px-3 text-amber-400">Jiddiylik</th>
                  <th className="py-3 px-3 text-amber-400">Yechim</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.interferences.map((int, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${
                      activeInterference === i ? "bg-amber-900/20" : ""
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

          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
            <div className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-2">
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
                    ? "bg-amber-600/60 text-white border border-amber-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-amber-400 font-bold mb-3">{COMPOUND.advancedTechniques[activeTechnique].name}</h3>
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
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 mt-3">
              <div className="text-amber-400 font-bold text-xs mb-1">Misollar:</div>
              <p className="text-purple-200 text-xs">{COMPOUND.advancedTechniques[activeTechnique].examples}</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-amber-600/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-amber-400">Werner (1893):</strong> Koordinatsion nazariya asoschisi, Nobel mukofoti (1913)</li>
            <li><strong className="text-amber-400">Kristall maydon nazariyasi:</strong> Co³⁺ (d⁶), past spinli (t₂g⁶ eg⁰), diamagnit, Δ<sub>o</sub> ≈ 22,900 cm⁻¹</li>
            <li><strong className="text-amber-400">Simmetriya (Oₕ):</strong> Ideal oktaedr, barcha 6 NH₃ MUTLAQO ekvivalent, IR va Raman istisno</li>
            <li><strong className="text-amber-400">PJT distorsion:</strong> Oₕ → D₃d (~750 cm⁻¹ stabilizatsiya), Co-N 1.97-2.01 Å orasida farq</li>
            <li><strong className="text-amber-400">¹H YaMR:</strong> 3.5 ppm (NH₃, singlet, 18H), barcha 6 NH₃ ekvivalent — bitta o'tkir singlet</li>
            <li><strong className="text-amber-400">¹⁵N YaMR:</strong> ~65 ppm (NH₃), erkin NH₃ dan +400 ppm farq (katta deshielding)</li>
            <li><strong className="text-amber-400">⁵⁹Co YaMR:</strong> 8120 ppm, keng chiziq (~200-800 Hz), kvadrupol (I=7/2). REFERENS (0 ppm)</li>
            <li><strong className="text-amber-400">Strukturaviy:</strong> Co-N = 1.97-2.01 Å, N-H = 1.01-1.03 Å, N-Co-N = 90°/180°</li>
            <li><strong className="text-amber-400">Barqarorlik:</strong> log β₆ ≈ 35, juda barqaror (kuchli maydon, katta CFSE)</li>
            <li><strong className="text-amber-400">Inertlik:</strong> k<sub>ex</sub> ≈ 10⁻⁶ s⁻¹ (juda sekin), Taube tasnifi: INERT</li>
            <li><strong className="text-amber-400">Qattiq holat YaMR:</strong> CP/MAS, ⁵⁹Co CQ ≈ 0-5 MHz (Oₕ simmetriya), η ≈ 0</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Birikmalar katalogi</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmalar/co-en-3" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">[Co(en)₃]³⁺ →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₆]³⁺ (Geksaamminkobalt(III)) • YaMR spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Werner (1893, Nobel 1913), Cotton-Wilkinson, Miessler-Tarr, Greenwood-Earnshaw, Ballhausen</p>
        </div>
      </footer>
    </main>
  )
}