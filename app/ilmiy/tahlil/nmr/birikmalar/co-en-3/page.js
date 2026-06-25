"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(en)₃]³⁺ — TRIS(ETILENDIAMIN)KOBALT(III) YaMR (ILMIY BOYITILGAN)
// Manbalar: Werner (Nobel 1913), Cotton-Wilkinson, Miessler-Tarr,
//           Greenwood-Earnshaw, Ballhausen, Kepert (VSEPR)
// Xususiyat: Xelat effekti, xirallik (Δ/Λ), D₃ simmetriya, AB kvartetlar
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(en)<sub>3</sub>]³⁺",
  formulaPlain: "[Co(en)3]3+",
  iupac: "Tris(etilendiamin)kobalt(III)",
  commonName: "Tris(etilendiamin)kobalt(III)",
  molarMass: 345.52,
  molarMassWithCl3: 454.00,
  casNumber: "14878-43-8",
  color: "sariq-to'q sariq (yellow-orange)",
  structure: "Oktaedr (D₃)",
  metalLigand: "Co-N (en, bidentat, 6 ta N)",
  pointGroup: "D₃ (xiral, enantiomerlar: Δ va Λ)",
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
    crystalFieldSplitting: "Δo ≈ 23,000 cm⁻¹ (2.85 eV) — NH₃ ga yaqin, lekin biroz katta (xelat effekti)",
    racahParameter: "B ≈ 590 cm⁻¹ (erkin ion B₀ = 1020 cm⁻¹)",
    nephelauxeticRatio: "β = B/B₀ ≈ 0.58",
    pairingEnergy: "P ≈ 21,000 cm⁻¹",
    cFSE: "CFSE = -2.4Δo + P ≈ -55,200 + 21,000 = -34,200 cm⁻¹",
    spectrochemicalSeries: "en — kuchli maydon ligandi (NH₃ dan kuchliroq, xelat effekti tufayli)",
    whyLowSpin: "Δo (23,000) > P (21,000) → past spinli, diamagnit",
    colorOrigin: "¹A₁g → ¹T₁g (F) o'tish ~22,000 cm⁻¹ (455 nm, ko'k yutilish → sariq-to'q sariq rang)",
    chargeTransfer: "LMCT: en → Co³⁺ (~38,000 cm⁻¹, UV)",
    comparisonWithNH3: "[Co(NH₃)₆]³⁺ da Δo = 22,900 cm⁻¹. en da 23,000 cm⁻¹ (biroz katta, xelat effekti)."
  },

  // ═══════════════════════════════════════════════════════════════
  // XELAT EFFEKTI (ILMIY BOYITILGAN)
  // ═══════════════════════════════════════════════════════════════
  chelateEffect: {
    definition: "Xelat effekti — bidentat yoki polidentat ligandlar monodentat ligandlarga qaraganda ancha barqaror komplekslar hosil qiladi.",
    thermodynamicOrigin: "Entropiya omili: 6 ta NH₃ → 3 ta en almashtirishda 3 ta erkin molekula ajralib chiqadi → ΔS > 0 → ΔG < 0 (barqarorroq).",
    formationConstant: {
      coNH36: "log β₆ ≈ 35 ([Co(NH₃)₆]³⁺)",
      coEn3: "log β₃ ≈ 49 ([Co(en)₃]³⁺)",
      difference: "10¹⁴ marta barqaror! (49 - 35 = 14)",
      reason: "Entropiya omili: ΔS ≈ +150 J/(mol·K) (3 ta erkin molekula ajralib chiqadi)"
    },
    enthalpyEntropy: {
      deltaH: "ΔH ≈ -50 kJ/mol (ekzotermik, NH₃ ga yaqin)",
      deltaS: "ΔS ≈ +150 J/(mol·K) (katta musbat — entropiya omili dominant)",
      deltaG: "ΔG = ΔH - TΔS ≈ -95 kJ/mol (juda manfiy)"
    },
    ringSize: "5 a'zoli xelat halqasi (Co-N-C-C-N) — eng barqaror (sterik jihatdan qulay)",
    macrocyclicEffect: "Makrosiklik effektdan kuchsizroq (masalan, cyclam dan past)",
    kineticEffect: "Xelat ligandlarni uzish qiyin — kinetik jihatdan ham barqaror"
  },

  // ═══════════════════════════════════════════════════════════════
  // XIRALLIK (ILMIY BOYITILGAN)
  // ═══════════════════════════════════════════════════════════════
  chirality: {
    definition: "[Co(en)₃]³⁺ — xiral kompleks (superpozitsiya qilib bo'lmaydigan ko'zgudagi aks). Enantiomerlar: Δ (delta) va Λ (lambda).",
    deltaIsomer: {
      name: "Δ-enantiomer (delta)",
      description: "Uchta en ligand o'ngga burilgan (right-handed propeller). C₃ o'qi bo'yicha o'ngga burilish.",
      absoluteConfiguration: "Δ (delta) — o'ngga burilgan",
      opticalRotation: "[α]D = +89° (suvda, 589 nm)"
    },
    lambdaIsomer: {
      name: "Λ-enantiomer (lambda)",
      description: "Uchta en ligand chapga burilgan (left-handed propeller). C₃ o'qi bo'yicha chapga burilish.",
      absoluteConfiguration: "Λ (lambda) — chapga burilgan",
      opticalRotation: "[α]D = -89° (suvda, 589 nm)"
    },
    racemicMixture: "Rasemat aralashma — Δ va Λ 50:50, optik faol emas ([α]D = 0°)",
    resolution: "Ajratish (resolution): D-tartrat yoki L-tartrat bilan diastereomer tuzlar hosil qilish orqali.",
    cD_Spectroscopy: "CD (Circular Dichroism) spektroskopiya — enantiomerlarni farqlash uchun. Δ va Λ qarama-qarshi CD signallar beradi.",
    historicalNote: "Werner (1911) — birinchi bo'lib xiral koordinatsion komplekslarni ajratdi. Bu uning nazariyasini tasdiqladi."
  },

  // ═══════════════════════════════════════════════════════════════
  // SIMMETRIYA VA SPEKTRAL TANLASH QOIDALARI
  // ═══════════════════════════════════════════════════════════════
  symmetry: {
    pointGroup: "D₃",
    order: 6,
    symmetryElements: ["E", "2C₃", "3C₂"],
    characterTable: {
      A1: { E: 1, C3: 1, C2: 1, functions: "z²" },
      A2: { E: 1, C3: 1, C2: -1, functions: "z, Rz" },
      E: { E: 2, C3: -1, C2: 0, functions: "(x,y), (x²-y², xy), (Rx,Ry)" }
    },
    nmrEquivalence: "D₃ simmetriya: 3 ta en ligand ekvivalent (C₃ o'qi). Har bir en ichida 2 ta N ekvivalent emas (biri Δ ga, biri Λ ga yaqin). Amaliyotda tez konformatsion almashinish tufayli barcha 6 ta N ekvivalent ko'rinadi.",
    irActive: "A2, E — IR faol (dipol momenti o'zgaradi). Co-N cho'zilish ~500 cm⁻¹.",
    ramanActive: "A1, E — Raman faol (polyarizatsiya o'zgaradi). A1 — Co-N simmetrik cho'zilish ~450-500 cm⁻¹.",
    mutualExclusion: "D₃ da IR va Raman qisman ustma-ust tushadi (markaziy simmetriya yo'q). E ikkalasida ham faol.",
    conformationalAnalysis: "en halqalari λ (lambda) yoki δ (delta) konformatsiyada bo'lishi mumkin. Eng barqaror: lelt (left-right-left) yoki lel (lel) konformatsiya."
  },

  // ═══════════════════════════════════════════════════════════════
  // YaMR NAZARIYASI — CHUQUR (ILMIY BOYITILGAN)
  // ═══════════════════════════════════════════════════════════════
  nmrTheory: {
    h1: {
      nucleus: "¹H (I = 1/2, 100% tabiiy)",
      shift: "2.8-3.5 ppm (CH₂ va NH₂, murakkab multiplet)",
      whyThisShift: "en ligand — Co³⁺ ga N orqali bog'langan. NH₂ protonlari deshielded (~3.5 ppm), CH₂ protonlari biroz kamroq (~2.8 ppm). Co³⁺ elektropozitiv → deshielding. NH₂ va CH₂ protonlari bir-biriga spin-spin bog'langan → murakkab multiplet (AB kvartet).",
      multiplicity: "Murakkab multiplet (AB kvartet, J(H-H) ≈ 7 Hz). Har bir CH₂ guruhi uchun 2 ta proton ekvivalent emas (diastereotopik) → AB kvartet.",
      linewidth: "~5-15 Hz (o'tkir, diamagnit)",
      t1Relaxation: "T₁ ≈ 1-3 s (dipol-dipol mexanizm)",
      couplingNotes: "¹J(¹H-¹⁵N) ≈ 5-10 Hz (¹⁵N tabiiy 0.37%, kuzatilmaydi). ²J(¹H-¹H) ≈ 7 Hz (geminal, AB kvartet). ³J(¹H-¹H) ≈ 5-8 Hz (vitsinal, CH₂-CH₂).",
      diastereotopicProtons: "CH₂ protonlari diastereotopik — en ligand xiral muhitda. Shuning uchun 2 ta proton ekvivalent emas, AB kvartet beradi."
    },
    c13: {
      nucleus: "¹³C (I = 1/2, 1.1% tabiiy)",
      shift: "45-50 ppm (CH₂, en)",
      whyThisShift: "CH₂ uglerod — Co³⁺ ga N orqali bog'langan. Erkin en da ~42 ppm, kompleksda ~45-50 ppm → Δδ = +3-8 ppm (biroz deshielding, metal effekti).",
      multiplicity: "Singlet (barcha 6 ta CH₂ ekvivalent, D₃ simmetriya)",
      linewidth: "~2-5 Hz (o'tkir, diamagnit)",
      t1Relaxation: "T₁ ≈ 5-20 s (dipol-dipol mexanizm)",
      couplingNotes: "¹J(¹³C-¹H) ≈ 130-140 Hz (bir bog'liq). ¹J(¹³C-¹⁵N) kuzatilmaydi (past sezgirlik)."
    },
    n15: {
      nucleus: "¹⁵N (I = 1/2, 0.37% tabiiy)",
      shift: "~70-90 ppm (NH₂, Co³⁺ ga bog'langan) — referens: CH₃NO₂ (0 ppm)",
      whyThisShift: "NH₂ ligand — Co³⁺ ga N orqali bog'langan. N atomi Co³⁺ ga to'g'ridan-to'g'ri bog'langan → deshielded → yuqori ppm. Erkin en da ¹⁵N ~-330 ppm, kompleksda ~70-90 ppm → Δδ = +400 ppm (katta deshielding).",
      referencing: "Referens: CH₃NO₂ (nitrometan, 0 ppm) yoki ¹⁵NH₄Cl (0 ppm).",
      sensitivity: "¹⁵N sezgirligi ¹H dan 5700 marta past. 1000-10000 skan kerak.",
      linewidth: "~10-30 Hz (o'rta, CSA kichik)",
      t1Relaxation: "T₁ ≈ 20-100 s (uzoq, CSA va dipol-dipol mexanizmlar)",
      csa: "Kimyoviy siljish anizotropiyasi (CSA): Δσ ≈ 50-150 ppm"
    },
    co59: {
      nucleus: "⁵⁹Co (I = 7/2, 100% tabiiy)",
      shift: "~7500-8000 ppm (referens: [Co(NH₃)₆]³⁺, 0 ppm)",
      whyThisShift: "⁵⁹Co kimyoviy siljishi juda keng diapazon. [Co(en)₃]³⁺ da ~7500-8000 ppm — [Co(NH₃)₆]³⁺ (8120 ppm) dan biroz farq. en kuchliroq maydon → biroz pastroq siljish.",
      quadrupolar: "⁵⁹Co — kvadrupol yadro (I = 7/2). D₃ simmetriyada kvadrupol bog'lanish konstantasi CQ ≈ 5-15 MHz. Asimmetriya parametri η ≈ 0-0.2.",
      linewidth: "~300-1000 Hz (keng, kvadrupol relaksatsiya tufayli)",
      t1Relaxation: "T₁ ≈ 2-20 ms (qisqa, kvadrupol mexanizm dominant)",
      detection: "Keng chiziqlar tufayli sezgirlik past. Maxsus impulslar kerak.",
      applications: "Koordinatsion geometriya, ligand maydon kuchi, spin holatini aniqlash"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY PARAMETRLAR (ILMIY BOYITILGAN)
  // ═══════════════════════════════════════════════════════════════
  structuralData: {
    bondLengths: {
      coN_En: "1.95-1.98 Å (Co-N en, barcha 6 ta N ekvivalent, D₃ simmetriya)",
      cc_Bond: "1.50-1.52 Å (C-C, en ichida)",
      cn_Bond: "1.47-1.49 Å (C-N, en ichida)",
      nh_Bond: "1.01-1.03 Å (N-H, en ichida)",
      comparison: "[Co(NH₃)₆]³⁺ da Co-N = 1.97-2.01 Å. en da 1.95-1.98 Å (biroz qisqaroq, xelat effekti tufayli kuchliroq bog')."
    },
    bondAngles: {
      nCoN_Angle: "85-86° (cis N-Co-N, en ichida) — 90° dan kichik (xelat halqasi tufayli)",
      nCoN_Trans: "180° (trans N-Co-N, turli en ligandlar)",
      cCN_Angle: "109-110° (C-C-N, sp³ gibridlanish)",
      nCC_Angle: "109-110° (N-C-C, sp³ gibridlanish)",
      hNH_Angle: "107° (H-N-H, sp³ ga yaqin)",
      comparison: "Ideal Oₕ da N-Co-N = 90°. en da 85-86° (xelat halqasi tufayli biroz kichik)."
    },
    chelateRing: {
      size: "5 a'zoli halqa (Co-N-C-C-N)",
      conformation: "λ (lambda) yoki δ (delta) konformatsiya",
      preferredConformation: "lel (left-right-left) — eng barqaror (sterik jihatdan qulay)",
      ringPuckering: "Halqa burmali (puckered) — tekis emas",
      biteAngle: "N-Co-N burchagi 85-86° (ideal 90° dan kichik)"
    },
    transEffect: {
      order: "en — o'rtacha trans-effekt (barcha en bir xil)",
      mechanism: "σ-bog'lanish (en π-donor emas, π-akseptor ham emas)",
      consequence: "Barcha en ekvivalent — trans-effekt farqi yo'q"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // TERMODINAMIK VA KINETIK PARAMETRLAR
  // ═══════════════════════════════════════════════════════════════
  thermodynamics: {
    stability: {
      formationConstant: "log β₃ ≈ 49 (juda barqaror, xelat effekti)",
      stepwiseConstants: "log K₁ ≈ 18, log K₂ ≈ 16, log K₃ ≈ 15",
      overallStability: "Juda barqaror — xelat effekti, katta CFSE",
      comparison: "[Co(NH₃)₆]³⁺ dan 10¹⁴ marta barqaror! (log β₃ = 49 vs log β₆ = 35)"
    },
    chelateEffectThermodynamics: {
      deltaH: "ΔH ≈ -50 kJ/mol (ekzotermik, NH₃ ga yaqin)",
      deltaS: "ΔS ≈ +150 J/(mol·K) (katta musbat — entropiya omili dominant)",
      deltaG: "ΔG ≈ -95 kJ/mol (juda manfiy)",
      explanation: "6 NH₃ + 3 en → [Co(en)₃]³⁺ + 6 NH₃. 3 ta erkin molekula ajralib chiqadi → ΔS > 0."
    },
    inertness: {
      why: "Co³⁺ d⁶ past spinli — katta CFSE, inert (sekin ligand almashinish)",
      waterExchange: "k_ex ≈ 10⁻⁶ s⁻¹ (juda sekin, kunlab vaqt)",
      acidHydrolysis: "k ≈ 10⁻⁶ s⁻¹ (pH = 1, 25°C da)",
      comparison: "Co²⁺ (d⁷) labil, Fe³⁺ (d⁵) o'rtacha, Cr³⁺ (d³) juda inert",
      taubeClassification: "Taube tasnifi: INERT (k < 10⁻⁴ s⁻¹)",
      mechanism: "Dissociative interchange (Id) mexanizmi",
      activationParameters: "ΔH‡ ≈ 100-120 kJ/mol, ΔS‡ ≈ +50 J/(mol·K)"
    },
    thermodynamicStability: {
      deltaHf: "ΔHf ≈ -450 kJ/mol (juda ekzotermik)",
      deltaGf: "ΔGf ≈ -400 kJ/mol",
      deltaSf: "ΔSf ≈ -100 J/(mol·K) (tartibli, 3 ta en bog'langan)",
      thermalStability: "250°C gacha barqaror (termik jihatdan)"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // QATTIQ HOLAT YaMR (ILMIY BOYITILGAN)
  // ═══════════════════════════════════════════════════════════════
  solidStateNMR: {
    technique: "CP/MAS (Cross-Polarization / Magic Angle Spinning)",
    advantages: ["Kristall namuna", "Erituvchi kerak emas", "Polimorfizm o'rganish", "Xiral kristallar"],
    co59_CQ: "CQ(⁵⁹Co) ≈ 5-15 MHz (D₃ simmetriya)",
    co59_eta: "η ≈ 0-0.2 (D₃ simmetriyaga yaqin)",
    h1_MAS: "¹H MAS — CH₂ va NH₂ signallari 2.8-3.5 ppm da",
    c13_MAS: "¹³C MAS — CH₂ signali 45-50 ppm da",
    applications: "Polimorfizm, xiral kristallar, konformatsion tahlil",
    chiralRecognition: "Qattiq holatda Δ va Λ enantiomerlarni farqlash"
  },

  // ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  // ═══════════════════════════════════════════════════════════════
  history: {
    werner: {
      year: 1911,
      scientist: "Alfred Werner (Shveytsariya)",
      achievement: "Birinchi bo'lib xiral koordinatsion komplekslarni ajratdi",
      nobelYear: 1913,
      nobelPrize: "Kimyo bo'yicha Nobel mukofoti",
      contribution: "[Co(en)₃]³⁺ — xirallikni ko'rsatuvchi klassik namuna",
      theory: "Oktaedr geometriya, bidentat ligandlar, Δ va Λ enantiomerlar",
      significance: "Werner nazariyasini tasdiqlash — koordinatsion kimyoning asosi",
      resolutionMethod: "D-tartrat yoki L-tartrat bilan diastereomer tuzlar hosil qilish"
    },
    bailar: {
      year: 1950,
      scientist: "John C. Bailar Jr. (AQSh)",
      contribution: "Xelat effekti va inertlik bo'yicha tadqiqotlar",
      note: "Bailar [Co(en)₃]³⁺ ning kinetik barqarorligini o'rgandi"
    },
    modernEra: {
      nmr: "1960-yillardan YaMR orqali o'rganish (¹H, ¹³C, ⁵⁹Co)",
      cd: "CD (Circular Dichroism) spektroskopiya — enantiomerlarni farqlash",
      computational: "DFT, CCSD hisob-kitoblari (2000-yillar)",
      xray: "XRD orqali aniq struktura aniqlash"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH — BOSHQA Co(III) KOMPLEKSLARI
  // ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      compound: "[Co(en)₃]³⁺",
      ligand: "3× en (bidentat)",
      color: "Sariq-to'q sariq",
      symmetry: "D₃",
      nmrShift: "¹H: 2.8-3.5 ppm, ¹³C: 45-50 ppm",
      stability: "log β₃ ≈ 49",
      note: "Xelat effekti, xirallik (Δ/Λ)"
    },
    {
      compound: "[Co(NH₃)₆]³⁺",
      ligand: "6× NH₃ (monodentat)",
      color: "Sariq",
      symmetry: "Oₕ",
      nmrShift: "¹H: 3.5 ppm",
      stability: "log β₆ ≈ 35",
      note: "Ideal oktaedr, referens"
    },
    {
      compound: "[Co(dien)₂]³⁺",
      ligand: "2× dien (tridentat)",
      color: "Sariq",
      symmetry: "C₂ᵥ",
      nmrShift: "¹H: 2.5-3.5 ppm",
      stability: "log β₂ ≈ 45",
      note: "Tridentat ligand"
    },
    {
      compound: "[Co(trien)]³⁺",
      ligand: "1× trien (tetradentat)",
      color: "Sariq",
      symmetry: "C₁",
      nmrShift: "¹H: 2.5-3.5 ppm",
      stability: "log β₁ ≈ 30",
      note: "Tetradentat ligand"
    },
    {
      compound: "[Co(cyclam)]³⁺",
      ligand: "1× cyclam (makrosiklik)",
      color: "Sariq",
      symmetry: "D₄ₕ",
      nmrShift: "¹H: 2.8-3.5 ppm",
      stability: "log β₁ ≈ 55",
      note: "Makrosiklik effektd"
    }
  ],

  // YaMR ma'lumotlari
  nmrNucleus: "¹H, ¹³C, ¹⁵N, ⁵⁹Co",
  chemicalShift: "¹H: 2.8-3.5 ppm (CH₂, NH₂), ¹³C: 45-50 ppm (CH₂)",
  multiplicity: "Murakkab multiplet (AB kvartet)",
  jCoupling: "J(H-H) = 7 Hz",

  // YaMR signallar (batafsil)
  nmrSignals: [
    {
      nucleus: "¹H",
      ligand: "NH₂ (barcha 6 ta)",
      shift: 3.5,
      multiplicity: "murakkab multiplet (AB kvartet)",
      jCoupling: "7 Hz",
      integration: "6H",
      notes: "NH₂ protonlari deshielded (~3.5 ppm). CH₂ protonlari bilan spin-spin bog'langan → murakkab multiplet. Diastereotopik protonlar."
    },
    {
      nucleus: "¹H",
      ligand: "CH₂ (barcha 6 ta)",
      shift: 2.8,
      multiplicity: "murakkab multiplet (AB kvartet)",
      jCoupling: "7 Hz",
      integration: "12H",
      notes: "CH₂ protonlari diastereotopik (xiral muhit) → 2 ta proton ekvivalent emas → AB kvartet. NH₂ protonlari bilan bog'langan."
    },
    {
      nucleus: "¹³C",
      ligand: "CH₂ (barcha 6 ta)",
      shift: 47,
      multiplicity: "singlet",
      jCoupling: "—",
      integration: "6C",
      notes: "Barcha 6 ta CH₂ ekvivalent (D₃ simmetriya). Bitta singlet 45-50 ppm da. Erkin en dan biroz deshielded."
    },
    {
      nucleus: "¹⁵N",
      ligand: "NH₂ (barcha 6 ta)",
      shift: 80,
      multiplicity: "singlet",
      jCoupling: "—",
      integration: "6N",
      notes: "Barcha 6 ta NH₂ ekvivalent. ¹⁵N YaMR da ~80 ppm da signal. Erkin en dan +400 ppm farq. Past sezgirlik."
    },
    {
      nucleus: "⁵⁹Co",
      ligand: "Co markaz",
      shift: 7700,
      multiplicity: "singlet (keng)",
      jCoupling: "—",
      integration: "1Co",
      notes: "⁵⁹Co YaMR da ~7700 ppm atrofida signal. Keng chiziq (~300-1000 Hz, kvadrupol, I=7/2). CQ ≈ 5-15 MHz."
    }
  ],

  // YaMR spektr ma'lumotlari (simulyatsiya uchun)
  nmrSpectrum: [
    { ppm: 0, intensity: 0, notes: "TMS referens" },
    { ppm: 1, intensity: 0, notes: "—" },
    { ppm: 2, intensity: 0, notes: "—" },
    { ppm: 2.8, intensity: 0.8, notes: "¹H: CH₂ (murakkab multiplet, 12H)" },
    { ppm: 3.5, intensity: 1.0, notes: "¹H: NH₂ (murakkab multiplet, 6H)" },
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
      source: "Diastereotopik protonlar",
      effect: "CH₂ protonlari ekvivalent emas → murakkab multiplet (AB kvartet)",
      severity: "Past",
      solution: "Yuqori maydonli YaMR ishlatish (400 MHz dan yuqori). 2D YaMR (COSY, TOCSY).",
      theoryNote: "Xiral muhitda CH₂ protonlari diastereotopik → ekvivalent emas → AB kvartet. Bu xelat effekti va xirallikning YaMR dalili."
    },
    {
      source: "⁵⁹Co kvadrupol kengayishi",
      effect: "⁵⁹Co signallari keng (~300-1000 Hz), sezgirlik past",
      severity: "O'rta",
      solution: "Keng chiziqli texnikalar, yuqori konsentratsiya, uzoq vaqt skanerlash.",
      theoryNote: "⁵⁹Co (I=7/2) kvadrupol yadro. D₃ simmetriyada CQ ≈ 5-15 MHz. T₁ qisqa (~ms)."
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
      effect: "D₂O da HOD signal 4.7 ppm da — NH₂ signaliga yaqin",
      severity: "O'rta",
      solution: "DMSO-d₆ ishlatish (NH₂ signali 3.5 ppm da, HOD dan uzoq).",
      theoryNote: "D₂O da HOD signal 4.7 ppm da — NH₂ signaliga (3.5 ppm) yaqin. DMSO-d₆ da NH₂ signali 3.5 ppm da aniq ko'rinadi."
    },
    {
      source: "Paramagnit aralashmalar",
      effect: "Signallarni kengaytiradi va siljitadi",
      severity: "O'rta",
      solution: "Sof namuna ishlatish. Paramagnit aralashmalardan saqlash.",
      theoryNote: "Paramagnit aralashmalar signallarni kengaytiradi (1/r⁶ bog'liq). Sof namuna ishlatish kerak."
    },
    {
      source: "Enantiomer aralashmasi",
      effect: "Δ va Λ enantiomerlar YaMR da bir xil (xiral erituvchi bo'lmasa)",
      severity: "Past",
      solution: "Xiral erituvchi yoki xiral shift reagent ishlatish. CD spektroskopiya.",
      theoryNote: "Δ va Λ enantiomerlar axiral muhitda bir xil YaMR spektr beradi. Xiral erituvchi yoki shift reagent bilan farqlash mumkin."
    }
  ],

  // Laboratoriya tartibi
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak. Co³⁺ zaharli. en (etilendiamin) korroziv, irritant. Yaxshi havalandırılan joyda ishlash.",
      time: "15 daq",
      theoryNote: "Co³⁺ zaharli. en korroziv — teri va ko'zga tegmaslik kerak. Yaxshi havalandırılan joyda ishlash."
    },
    {
      step: 2,
      title: "[Co(en)₃]Cl₃ ni sintez qilish",
      desc: "[Co(H₂O)₆]Cl₂ + 3 en + H₂O₂ (oksidlovchi) → [Co(en)₃]Cl₃. Aktivlangan ko'mir katalizator. 60°C da 1 soat.",
      time: "2-3 soat (sintez) + 12 soat (kristallanish)",
      theoryNote: "Co²⁺ → Co³⁺ oksidlanish. H₂O₂ oksidlovchi. en — bidentat ligand, xelat halqasi hosil qiladi."
    },
    {
      step: 3,
      title: "Kristallash va tozalash",
      desc: "Sariq-to'q sariq kristallar. Sovutish orqali kristallash. Etanol bilan yuvish.",
      time: "12-24 soat",
      theoryNote: "[Co(en)₃]Cl₃ — sariq-to'q sariq kristallar. Suvda yaxshi eriydi. Etanolda kam eriydi."
    },
    {
      step: 4,
      title: "Enantiomerlarni ajratish (ixtiyoriy)",
      desc: "D-tartrat yoki L-tartrat bilan diastereomer tuzlar hosil qilish. Fraksion kristallash.",
      time: "24-48 soat",
      theoryNote: "Δ va Λ enantiomerlar — xiral. D-tartrat bilan diastereomer tuzlar hosil qilish orqali ajratish. Werner usuli."
    },
    {
      step: 5,
      title: "YaMR spektrometrni tayyorlash",
      desc: "YaMR spektrometrni yoqish, 30 daq stabillash. Shimlash (shimming) qilish. D₂O yoki DMSO-d₆ erituvchi.",
      time: "30 daq",
      theoryNote: "Shimlash — magnit maydonining bir xilligini ta'minlash. Yaxshi shimlash — o'tkir signallar."
    },
    {
      step: 6,
      title: "Namuna tayyorlash",
      desc: "10-20 mg namunani 0.6 mL D₂O yoki DMSO-d₆ da eritish. YaMR naychaga solish.",
      time: "10-15 daq",
      theoryNote: "D₂O da NH₂ va CH₂ signallari 2.8-3.5 ppm da. DMSO-d₆ da ham shu diapazon. Murakkab multiplet — AB kvartet."
    },
    {
      step: 7,
      title: "¹H YaMR spektrini olish",
      desc: "¹H YaMR spektrini olish (16-64 skan). NH₂ va CH₂ signallarini tekshirish (2.8-3.5 ppm, murakkab multiplet).",
      time: "5-10 daq",
      theoryNote: "¹H YaMR da NH₂ va CH₂ signallari 2.8-3.5 ppm da murakkab multiplet (AB kvartet). Diastereotopik protonlar."
    },
    {
      step: 8,
      title: "¹³C YaMR spektrini olish (ixtiyoriy)",
      desc: "¹³C YaMR spektrini olish (64-256 skan). CH₂ signalini tekshirish (45-50 ppm, singlet).",
      time: "15-30 daq",
      theoryNote: "¹³C YaMR da CH₂ signali 45-50 ppm da singlet. Barcha 6 ta CH₂ ekvivalent (D₃ simmetriya)."
    },
    {
      step: 9,
      title: "CD spektroskopiya (ixtiyoriy)",
      desc: "CD (Circular Dichroism) spektrini olish. Δ va Λ enantiomerlarni farqlash.",
      time: "10-20 daq",
      theoryNote: "CD spektroskopiya — xiral komplekslarni o'rganish uchun. Δ va Λ qarama-qarshi CD signallar beradi."
    }
  ],

  // Kengaytiruvchi metodlar
  advancedTechniques: [
    {
      name: "CD (Circular Dichroism)",
      description: "Xiral komplekslarni o'rganish, enantiomerlarni farqlash",
      advantages: ["Δ va Λ farqlash", "Absolyut konfiguratsiya", "Konformatsion tahlil"],
      disadvantages: ["Xiral namuna kerak", "Maxsus uskuna"],
      bestFor: "Xiral komplekslar, enantiomerlarni farqlash",
      examples: "Δ-[Co(en)₃]³⁺ va Λ-[Co(en)₃]³⁺ qarama-qarshi CD signallar"
    },
    {
      name: "2D YaMR (COSY, HSQC, HMBC)",
      description: "²D YaMR orqali bog'lanishlarni aniqlash",
      advantages: ["¹H-¹H bog'lanish", "¹H-¹³C korrelyatsiya", "Murakkab spektrlar"],
      disadvantages: ["Uzoq vaqt", "Murakkab tahlil"],
      bestFor: "Murakkab spektrlar, strukturaviy aniqlash",
      examples: "COSY — NH₂-CH₂ bog'lanish, HSQC — ¹H-¹³C korrelyatsiya"
    },
    {
      name: "XRD (X-ray Diffraction)",
      description: "Kristall struktura aniqlash, absolyut konfiguratsiya",
      advantages: ["Aniq struktura", "Δ/Λ farqlash", "Xelat halqasi konformatsiyasi"],
      disadvantages: ["Yaxshi kristall kerak", "Vaqt talab qiladi"],
      bestFor: "Strukturaviy aniqlash, xirallik",
      examples: "Anomalous dispersion orqali absolyut konfiguratsiya aniqlash"
    },
    {
      name: "Qattiq holat YaMR (CP/MAS)",
      description: "Kristall namuna uchun qattiq holat YaMR",
      advantages: ["Erituvchi kerak emas", "Polimorfizm", "Xiral kristallar"],
      disadvantages: ["Maxsus uskuna", "Keng chiziqlar"],
      bestFor: "Kristall namuna, polimorfizm",
      examples: "¹³C CP/MAS — CH₂ signali 45-50 ppm da"
    },
    {
      name: "DFT hisob-kitoblari",
      description: "Kvant kimyoviy hisob-kitoblar (struktura, energiya, CD)",
      advantages: ["Struktura optimizatsiya", "CD spektrlari", "Konformatsion tahlil"],
      disadvantages: ["Kuchli kompyuter kerak", "Murakkab hisob-kitoblar"],
      bestFor: "Struktura, energiya, CD spektrlari",
      examples: "B3LYP/6-31G(d) — Δ va Λ energiyasi bir xil (enantiomerlar)"
    }
  ]
}

export default function CoEn3Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [ppmSlider, setPpmSlider] = useState(2.8)
  const [activeNmrNucleus, setActiveNmrNucleus] = useState("h1")
  const [activeEnantiomer, setActiveEnantiomer] = useState("delta")

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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-orange-950/20 to-blue-950 text-white">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-orange-950 to-purple-950 border-2 border-orange-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🌀</span> [Co(en)₃]³⁺ — XELAT EFFEKTI VA XIRALLIK!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-orange-300">[Co(en)₃]³⁺</strong> — tris(etilendiamin)kobalt(III).
              Xelat effekti (10¹⁴ marta barqaror!), xirallik (Δ va Λ enantiomerlar), AB kvartetlar!
            </p>

            <div className="bg-orange-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-orange-400 font-bold mb-2">🧲 YaMR signallar:</div>
                  <div className="text-purple-200">
                    <strong>¹H:</strong> 2.8-3.5 ppm (murakkab multiplet)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹³C:</strong> 45-50 ppm (CH₂, singlet)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>⁵⁹Co:</strong> ~7700 ppm (keng, kvadrupol)
                  </div>
                </div>
                <div>
                  <div className="text-orange-400 font-bold mb-2">🔬 Muhim xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Xelat effekti:</strong> 10¹⁴ marta barqaror
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Xirallik:</strong> Δ va Λ enantiomerlar
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>D₃ simmetriya:</strong> xiral, enantiomerlar
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-orange-300">Tarixiy ahamiyati:</strong> Werner (1911) — birinchi bo'lib xiral koordinatsion komplekslarni ajratdi.
                Nobel mukofoti (1913). Xelat effekti va xirallikning klassik namunasi.
              </p>
            </div>

            <div className="bg-orange-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-orange-200">
                <strong className="text-orange-300">⚠️ XAVFSIZLIK:</strong> Co³⁺ zaharli! en (etilendiamin) korroziv, irritant. Yaxshi havalandırılan joyda ishlash.
              </p>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-orange-400 font-semibold">[Co(en)₃]³⁺</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-orange-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🧲 YaMR</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Xelat Effekti</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Xirallik (Δ/Λ)</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">D₃ Simmetriya</span>
                  <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Inert</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-xs bg-orange-600/80 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Birikmalar katalogi
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-orange-600 hover:bg-orange-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs font-semibold">YaMR</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Xelat Effekti</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Xirallik (Δ/Λ)</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">D₃ Simmetriya</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              [Co(en)₃]³⁺
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            tris(etilendiamin)kobalt(III) — <span className="text-orange-400 italic">&quot;Xelat effekti, xirallik (Δ/Λ), AB kvartetlar&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-orange-400">YaMR spektroskopiya</strong> yordamida <strong className="text-orange-400">xelat effekti va xirallikni</strong> o&apos;rganish.
            3 ta bidentat en ligand — 5 a'zoli xelat halqalari. Δ va Λ enantiomerlar.
            <strong className="text-orange-400"> ¹H: 2.8-3.5 ppm (murakkab multiplet, AB kvartet)</strong>,
            <strong className="text-orange-400"> ¹³C: 45-50 ppm (CH₂, singlet)</strong>.
            Werner (1911) — birinchi xiral koordinatsion kompleks. log β₃ ≈ 49 (10¹⁴ marta barqaror!).
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
              <div className="text-white font-bold">D₃ (xiral)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit</div>
              <div className="text-white font-bold">1:3</div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* XELAT EFFEKTI */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔗</span> Xelat effekti — 10¹⁴ marta barqaror!
          </h2>

          <div className="bg-orange-900/30 rounded-lg p-4 mb-6">
            <p className="text-orange-300 text-sm">
              <strong>Xelat effekti:</strong> Bidentat yoki polidentat ligandlar monodentat ligandlarga qaraganda ancha barqaror komplekslar hosil qiladi.
              [Co(en)₃]³⁺ — [Co(NH₃)₆]³⁺ dan <strong className="text-orange-400">10¹⁴ marta barqaror!</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Termodinamik kelib chiqishi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Ta'rif:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.chelateEffect.definition}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Sabab:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.chelateEffect.thermodynamicOrigin}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Halqa o'lchami:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.chelateEffect.ringSize}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Barqarorlik konstantalari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">[Co(NH₃)₆]³⁺:</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.chelateEffect.formationConstant.coNH36}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">[Co(en)₃]³⁺:</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.chelateEffect.formationConstant.coEn3}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Farq:</span>
                  <span className="text-orange-400 text-xs font-bold">{COMPOUND.chelateEffect.formationConstant.difference}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Sabab:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.chelateEffect.formationConstant.reason}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-900/30 rounded-lg p-4">
            <h4 className="text-orange-400 font-bold mb-2">Entalpiya va entropiya</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-purple-400 text-xs">ΔH:</div>
                <div className="text-orange-400">{COMPOUND.chelateEffect.enthalpyEntropy.deltaH}</div>
              </div>
              <div>
                <div className="text-purple-400 text-xs">ΔS:</div>
                <div className="text-orange-400">{COMPOUND.chelateEffect.enthalpyEntropy.deltaS}</div>
              </div>
              <div>
                <div className="text-purple-400 text-xs">ΔG:</div>
                <div className="text-orange-400">{COMPOUND.chelateEffect.enthalpyEntropy.deltaG}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* XIRALLIK (Δ va Λ) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-pink-600/10 border border-pink-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🌀</span> Xirallik — Δ va Λ enantiomerlar
          </h2>

          <div className="bg-pink-900/30 rounded-lg p-4 mb-6">
            <p className="text-pink-300 text-sm">
              <strong>Xirallik:</strong> [Co(en)₃]³⁺ — xiral kompleks (superpozitsiya qilib bo'lmaydigan ko'zgudagi aks).
              Ikki enantiomer: <strong className="text-pink-400">Δ (delta)</strong> va <strong className="text-pink-400">Λ (lambda)</strong>.
              Werner (1911) — birinchi bo'lib ajratgan.
            </p>
          </div>

          {/* Enantiomer tanlash */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveEnantiomer("delta")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeEnantiomer === "delta"
                  ? "bg-pink-600/60 text-white border border-pink-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              Δ-enantiomer (delta)
            </button>
            <button
              onClick={() => setActiveEnantiomer("lambda")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeEnantiomer === "lambda"
                  ? "bg-pink-600/60 text-white border border-pink-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              Λ-enantiomer (lambda)
            </button>
          </div>

          {activeEnantiomer === "delta" ? (
            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-pink-400 font-bold">{COMPOUND.chirality.deltaIsomer.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Tavsif:</span>
                  <span className="text-pink-400 text-xs">{COMPOUND.chirality.deltaIsomer.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Absolyut konfiguratsiya:</span>
                  <span className="text-pink-400">{COMPOUND.chirality.deltaIsomer.absoluteConfiguration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Optik aylanish:</span>
                  <span className="text-pink-400 font-mono">{COMPOUND.chirality.deltaIsomer.opticalRotation}</span>
                </div>
              </div>

              {/* Δ enantiomer SVG */}
              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                <svg viewBox="0 0 400 200" className="w-full h-40" role="img" aria-label="Δ-enantiomer">
                  <title>Δ-enantiomer — o'ngga burilgan</title>
                  <circle cx="200" cy="100" r="30" fill="#f59e0b" opacity="0.3" />
                  <text x="200" y="105" textAnchor="middle" fontSize="12" fill="#f59e0b" fontWeight="bold">Co</text>

                  {/* 3 ta en ligand — o'ngga burilgan */}
                  <path d="M 200 70 Q 230 50 250 70" stroke="#ec4899" strokeWidth="2" fill="none" />
                  <path d="M 200 130 Q 170 150 150 130" stroke="#ec4899" strokeWidth="2" fill="none" />
                  <path d="M 230 100 Q 250 120 230 140" stroke="#ec4899" strokeWidth="2" fill="none" />

                  <text x="260" y="65" fontSize="10" fill="#ec4899">en₁</text>
                  <text x="130" y="145" fontSize="10" fill="#ec4899">en₂</text>
                  <text x="255" y="145" fontSize="10" fill="#ec4899">en₃</text>

                  {/* O'ngga burilish ko'rsatkichi */}
                  <path d="M 300 100 A 50 50 0 0 1 280 140" stroke="#22c55e" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                  <text x="320" y="120" fontSize="10" fill="#22c55e">O'ngga</text>

                  <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
          ) : (
            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-pink-400 font-bold">{COMPOUND.chirality.lambdaIsomer.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Tavsif:</span>
                  <span className="text-pink-400 text-xs">{COMPOUND.chirality.lambdaIsomer.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Absolyut konfiguratsiya:</span>
                  <span className="text-pink-400">{COMPOUND.chirality.lambdaIsomer.absoluteConfiguration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Optik aylanish:</span>
                  <span className="text-pink-400 font-mono">{COMPOUND.chirality.lambdaIsomer.opticalRotation}</span>
                </div>
              </div>

              {/* Λ enantiomer SVG */}
              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                <svg viewBox="0 0 400 200" className="w-full h-40" role="img" aria-label="Λ-enantiomer">
                  <title>Λ-enantiomer — chapga burilgan</title>
                  <circle cx="200" cy="100" r="30" fill="#f59e0b" opacity="0.3" />
                  <text x="200" y="105" textAnchor="middle" fontSize="12" fill="#f59e0b" fontWeight="bold">Co</text>

                  {/* 3 ta en ligand — chapga burilgan */}
                  <path d="M 200 70 Q 170 50 150 70" stroke="#ec4899" strokeWidth="2" fill="none" />
                  <path d="M 200 130 Q 230 150 250 130" stroke="#ec4899" strokeWidth="2" fill="none" />
                  <path d="M 170 100 Q 150 120 170 140" stroke="#ec4899" strokeWidth="2" fill="none" />

                  <text x="130" y="65" fontSize="10" fill="#ec4899">en₁</text>
                  <text x="255" y="145" fontSize="10" fill="#ec4899">en₂</text>
                  <text x="130" y="145" fontSize="10" fill="#ec4899">en₃</text>

                  {/* Chapga burilish ko'rsatkichi */}
                  <path d="M 100 100 A 50 50 0 0 0 120 140" stroke="#22c55e" strokeWidth="2" fill="none" markerEnd="url(#arrow2)" />
                  <text x="60" y="120" fontSize="10" fill="#22c55e">Chapga</text>

                  <defs>
                    <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
          )}

          <div className="bg-pink-900/30 rounded-lg p-4">
            <h4 className="text-pink-400 font-bold mb-2">Rasemat aralashma va ajratish</h4>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Rasemat:</strong> {COMPOUND.chirality.racemicMixture}
            </p>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Ajratish:</strong> {COMPOUND.chirality.resolution}
            </p>
            <p className="text-purple-200 text-sm">
              <strong>CD spektroskopiya:</strong> {COMPOUND.chirality.cD_Spectroscopy}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* KRISTALL MAYDON NAZARIYASI */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔬</span> Kristall maydon nazariyasi
          </h2>

          <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>Nima uchun bu kompleks diamagnit?</strong> Co³⁺ — d⁶ elektron konfiguratsiya. en — kuchli maydon ligandi (xelat effekti tufayli).
              Δ<sub>o</sub> (23,000 cm⁻¹) &gt; P (21,000 cm⁻¹) → past spinli, diamagnit.
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
                  <span className="text-purple-400">Spin holati:</span>
                  <span className="text-blue-400">{COMPOUND.crystalField.spinState}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Orbital to'ldirilishi:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.orbitalOccupancy}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">Kristall maydon parametrlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Δ<sub>o</sub>:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.crystalFieldSplitting}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">CFSE:</span>
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.cFSE}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Taqqoslash:</span>
                  <span className="text-blue-400 text-xs">{COMPOUND.crystalField.comparisonWithNH3}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SIMMETRIYA (D₃) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📐</span> Simmetriya (D₃) va spektral tanlash qoidalari
          </h2>

          <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-sm">
              <strong>D₃ nuqtaviy guruhi:</strong> [Co(en)₃]³⁺ — xiral kompleks, D₃ simmetriya.
              3 ta en ligand C₃ o'qi atrofida joylashgan. Markaziy simmetriya yo'q → IR va Raman qisman ustma-ust tushadi.
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
                  <span className="text-purple-400">Elementlar:</span>
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

          <div className="bg-orange-900/30 rounded-lg p-4">
            <h4 className="text-orange-400 font-bold mb-2">Konformatsion tahlil</h4>
            <p className="text-purple-200 text-sm">
              {COMPOUND.symmetry.conformationalAnalysis}
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
                  <span className="text-purple-400">Co-N (en):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.coN_En}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">C-C (en):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.cc_Bond}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">C-N (en):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.cn_Bond}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog' burchaklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">N-Co-N (cis):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.nCoN_Angle}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">N-Co-N (trans):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.nCoN_Trans}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-900/30 rounded-lg p-4">
            <h4 className="text-orange-400 font-bold mb-2">Xelat halqasi</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-purple-400 text-xs">Halqa o'lchami:</div>
                <div className="text-orange-400">{COMPOUND.structuralData.chelateRing.size}</div>
              </div>
              <div>
                <div className="text-purple-400 text-xs">Konformatsiya:</div>
                <div className="text-orange-400">{COMPOUND.structuralData.chelateRing.conformation}</div>
              </div>
              <div>
                <div className="text-purple-400 text-xs">Afzal:</div>
                <div className="text-orange-400">{COMPOUND.structuralData.chelateRing.preferredConformation}</div>
              </div>
              <div>
                <div className="text-purple-400 text-xs">Bite angle:</div>
                <div className="text-orange-400">{COMPOUND.structuralData.chelateRing.biteAngle}</div>
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
              <strong>Murakkab spektr:</strong> en ligand — bidentat, xiral muhit. CH₂ protonlari diastereotopik → AB kvartet.
              NH₂ va CH₂ protonlari spin-spin bog'langan → murakkab multiplet.
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
              onClick={() => setActiveNmrNucleus("c13")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "c13"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹³C (I=1/2)
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
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun bu siljish?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.whyThisShift}</p>
              </div>
              <div className="bg-orange-900/30 rounded-lg p-3">
                <div className="text-orange-400 font-bold text-xs mb-1">Diastereotopik protonlar:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.diastereotopicProtons}</p>
              </div>
            </div>
          )}

          {/* ¹³C details */}
          {activeNmrNucleus === "c13" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.c13.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.c13.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Multiplicity:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.c13.multiplicity}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun 45-50 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.c13.whyThisShift}</p>
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
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun ~80 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.n15.whyThisShift}</p>
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
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun ~7700 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.co59.whyThisShift}</p>
              </div>
            </div>
          )}
        </div>

        {/* YaMR SIGNALLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧲 YaMR signallar (batafsil)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-orange-400">Yadro</th>
                  <th className="py-3 px-3 text-orange-400">Ligand</th>
                  <th className="py-3 px-3 text-orange-400">δ (ppm)</th>
                  <th className="py-3 px-3 text-orange-400">Multiplicity</th>
                  <th className="py-3 px-3 text-orange-400">J (Hz)</th>
                  <th className="py-3 px-3 text-orange-400">Integration</th>
                  <th className="py-3 px-3 text-orange-400">Izohlar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.nmrSignals.map((signal, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/30">
                    <td className="py-3 px-3 text-orange-400 font-bold">{signal.nucleus}</td>
                    <td className="py-3 px-3">{signal.ligand}</td>
                    <td className="py-3 px-3 text-orange-400 font-mono">{signal.shift}</td>
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
            <label className="block text-orange-400 font-bold mb-2">
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
              <span>2.8 ppm (CH₂)</span>
              <span>3.5 ppm (NH₂)</span>
              <span>10 ppm</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{ppmSlider} ppm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Signal:</div>
                <div className="text-xl font-mono font-bold text-orange-400">
                  {ppmSlider === 2.8 ? "¹H: CH₂ (multiplet, 12H)" : ppmSlider === 3.5 ? "¹H: NH₂ (multiplet, 6H)" : "Signal yo'q"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ligand:</div>
                <div className="text-xl font-mono font-bold text-orange-400">
                  {ppmSlider === 2.8 || ppmSlider === 3.5 ? "en (barcha 3 ta ekvivalent)" : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* YaMR spektr simulyatsiyasi SVG */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="YaMR spektr">
              <title>YaMR spektr simulyatsiyasi — [Co(en)₃]³⁺</title>
              {[0, 2, 4, 6, 8, 10].map((ppm, i) => (
                <g key={i}>
                  <line x1={580 - ((ppm/10)*530)} y1="220" x2={580 - ((ppm/10)*530)} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x={580 - ((ppm/10)*530)} y="235" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik</text>

              {/* CH₂ signali (2.8 ppm) */}
              <line
                x1={580 - ((2.8/10)*530)}
                y1="220"
                x2={580 - ((2.8/10)*530)}
                y2="80"
                stroke="#f97316"
                strokeWidth="3"
              />
              <text x={580 - ((2.8/10)*530)} y="75" textAnchor="middle" fontSize="9" fill="#f97316" fontWeight="bold">
                2.8 ppm (CH₂)
              </text>

              {/* NH₂ signali (3.5 ppm) */}
              <line
                x1={580 - ((3.5/10)*530)}
                y1="220"
                x2={580 - ((3.5/10)*530)}
                y2="40"
                stroke="#f97316"
                strokeWidth="3"
              />
              <text x={580 - ((3.5/10)*530)} y="35" textAnchor="middle" fontSize="9" fill="#f97316" fontWeight="bold">
                3.5 ppm (NH₂)
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

        {/* LABORATORIYA TARTIBI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧪 Laboratoriyani 0 dan bajarish tartibi</h2>

          <div className="space-y-3">
            {COMPOUND.labProcedure.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveLabStep(i)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  activeLabStep === i ? "bg-orange-900/40 border-2 border-orange-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-orange-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeLabStep === i ? "bg-orange-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-orange-400 font-bold">{step.title}</p>
                  </div>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3 mt-2">
                      <div className="text-orange-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
                      <p className="text-purple-200 text-xs">{step.theoryNote}</p>
                    </div>
                    <div className="text-[10px] text-orange-400 mt-2">
                      Vaqt: {step.time}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-orange-400">Xelat effekti:</strong> log β₃ ≈ 49 — [Co(NH₃)₆]³⁺ dan 10¹⁴ marta barqaror!</li>
            <li><strong className="text-orange-400">Entropiya omili:</strong> ΔS ≈ +150 J/(mol·K) — 3 ta erkin molekula ajralib chiqadi</li>
            <li><strong className="text-orange-400">Xirallik:</strong> Δ va Λ enantiomerlar — Werner (1911) birinchi bo'lib ajratgan</li>
            <li><strong className="text-orange-400">D₃ simmetriya:</strong> xiral, 3 ta en ligand C₃ o'qi atrofida</li>
            <li><strong className="text-orange-400">¹H YaMR:</strong> 2.8-3.5 ppm (murakkab multiplet, AB kvartet) — diastereotopik protonlar</li>
            <li><strong className="text-orange-400">¹³C YaMR:</strong> 45-50 ppm (CH₂, singlet) — barcha 6 ta CH₂ ekvivalent</li>
            <li><strong className="text-orange-400">⁵⁹Co YaMR:</strong> ~7700 ppm, keng chiziq (~300-1000 Hz), kvadrupol</li>
            <li><strong className="text-orange-400">Strukturaviy:</strong> Co-N = 1.95-1.98 Å, N-Co-N = 85-86° (xelat halqasi)</li>
            <li><strong className="text-orange-400">5 a'zoli xelat halqasi:</strong> eng barqaror (sterik jihatdan qulay)</li>
            <li><strong className="text-orange-400">Inertlik:</strong> k<sub>ex</sub> ≈ 10⁻⁶ s⁻¹ (juda sekin), Taube tasnifi: INERT</li>
            <li><strong className="text-orange-400">CD spektroskopiya:</strong> Δ va Λ enantiomerlarni farqlash</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar/co-nh3-6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Co(NH₃)₆]³⁺</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmalar/fe-cn-6" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">[Fe(CN)₆]⁴⁻ →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(en)₃]³⁺ (Tris(etilendiamin)kobalt(III)) • YaMR spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Werner (Nobel 1913), Cotton-Wilkinson, Miessler-Tarr, Greenwood-Earnshaw, Ballhausen</p>
        </div>
      </footer>
    </main>
  )
}