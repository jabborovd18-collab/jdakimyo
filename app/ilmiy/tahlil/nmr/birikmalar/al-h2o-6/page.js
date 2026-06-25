"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// [Al(H₂O)₆]³⁺ — GEKSAKVAALYUMINIY(III) YaMR (ILMIY BOYITILGAN)
// Manbalar: Werner (1893), Akitt (1989), Hargittai (2000), Miessler-Tarr,
//           Cotton-Wilkinson, Greenwood-Earnshaw, IUPAC ²⁷Al YaMR referens
// Xususiyat: ²⁷Al YaMR REFERENS (0 ppm), labil almashinish, gidroliz,
//           kvadrupol yadro (I=5/2), Oₕ simmetriya
//  ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Al(H<sub>2</sub>O)<sub>6</sub>]³⁺",
  formulaPlain: "[Al(H2O)6]3+",
  iupac: "Geksaakvaalyuminiy(III)",
  commonName: "Alyuminiy akva kompleksi (rangsiz)",
  molarMass: 111.00, // kation
  saltFormulaHTML: "AlCl<sub>3</sub> · 6H<sub>2</sub>O",
  saltMolarMass: 241.43, // AlCl₃·6H₂O
  casNumber: "—", // kation uchun aniq CAS yo'q
  color: "rangsiz (colorless)",
  structure: "Oktaedr (Oₕ)",
  metalLigand: "Al-O (H₂O, 6 ta ekvivalent)",
  pointGroup: "Oₕ",
  electrolyteType: "1:3 elektrolit (Al³⁺ + 3 anion)",
  molarConductivity: "~430 S·cm²/mol",
  solubility: "Suvda juda yaxshi eriydi (AlCl₃·6H₂O ~1330 g/L, 20°C)",

  //  ═══════════════════════════════════════════════════════════════
  // KRISTALL MAYDON NAZARIYASI — d⁰ HOLATI (MUHIM!)
  //  ═══════════════════════════════════════════════════════════════
  crystalField: {
    metalIon: "Al³⁺",
    electronConfig: "[Ne] (1s² 2s² 2p⁶)",
    dElectrons: 0,
    spinState: "d⁰ — spin holati yo'q (d-elektronlar mavjud emas)",
    orbitalOccupancy: "d-orbitallar bo'sh (d⁰)",
    unpairedElectrons: 0,
    magneticMoment: "0 BM (diamagnit)",
    crystalFieldSplitting: "Δo — ahamiyatsiz (d-elektronlar yo'q, CFSE = 0)",
    cFSE: "CFSE = 0 (d⁰ holatda kristall maydon energiyasi yo'q)",
    spectrochemicalSeries: "H₂O — o'rtacha maydon ligandi (lekin Al³⁺ da ahamiyatsiz)",
    whyOctahedral: "Al³⁺ kichik ion radiusi (0.54 Å) va yuqori zaryad (+3) → 6 ta H₂O bilan oktaedr geometriya afzal. Bu elektrostatik ta'sir (ion-dipol), kristall maydon emas.",
    colorOrigin: "d-d o'tishlar yo'q (d⁰ holat). LMCT (H₂O → Al³⁺) UV da (~50,000 cm⁻¹, 200 nm). Natija: RANGSIZ kompleks.",
    chargeTransfer: "LMCT: H₂O (p) → Al³⁺ (3s, 3p) ~50,000 cm⁻¹ (UV, kuchli). MLCT yo'q (Al³⁺ da d-elektronlar yo'q).",
    ionicCharacter: "Al-O bog'lanish kuchli ionik xarakterli (Al³⁺ yuqori zaryad, kichik radius). Kovalent hissa ~30-40%."
  },

  //  ═══════════════════════════════════════════════════════════════
  // SIMMETRIYA — Oₕ (OKTAEDR)
  //  ═══════════════════════════════════════════════════════════════
  symmetry: {
    pointGroup: "Oₕ",
    order: 48,
    symmetryElements: ["E", "8C₃", "6C₂", "6C₄", "3C₂(=C₄²)", "i", "6S₄", "8S₆", "3σₕ", "6σᵈ"],
    nmrEquivalence: "Oₕ simmetriyada: barcha 6 ta H₂O ligand to'liq ekvivalent. ¹H YaMR da bitta signal (12H). ²⁷Al YaMR da bitta signal. Oₕ simmetriya → kvadrupol bog'lanish minimal (η ≈ 0).",
    irActive: "T₁ᵤ — IR faol (asimetrik tebranishlar)",
    ramanActive: "A₁g + Eg + T₂g — Raman faol (simmetrik tebranishlar)",
    mutualExclusion: "Oₕ da MARKAZIY SIMMETRIYA (i) bor → IR va Raman USTMA-UST TUSHMAYDI (mutual exclusion principle)",
    waterExchange: "Tez suv almashinish — Oₕ simmetriya saqlanadi (labil kompleks)"
  },

  //  ═══════════════════════════════════════════════════════════════
  // YaMR NAZARIYASI — CHUQUR
  //  ═══════════════════════════════════════════════════════════════
  nmrTheory: {
    al27: {
      nucleus: "²⁷Al (I = 5/2, 100% tabiiy)",
      shift: "0 ppm (REFERENS — barcha ²⁷Al YaMR uchun standart)",
      whyThisShift: "²⁷Al kimyoviy siljishi juda keng diapazon (-200 dan +400 ppm). [Al(H₂O)₆]³⁺ = 0 ppm (IUPAC referens). Boshqa Al komplekslar shu ga nisbatan o'lchanadi. Masalan: [Al(OH)₄]⁻ = 80 ppm, Al₂O₃ = 0-70 ppm.",
      sensitivity: "Yuqori sezgirlik — ¹H dan ~5× past, lekin ¹³C dan 21× yaxshiroq. 100% tabiiy tarqalish, I=5/2 (kvadrupol, lekin Oₕ simmetriyada CQ kichik).",
      linewidth: "~10-50 Hz (o'rta, Oₕ simmetriyada kvadrupol kengayish minimal)",
      t1Relaxation: "T₁ ≈ 0.1-1 s (kvadrupol mexanizm dominant)",
      quadrupolar: "²⁷Al — kvadrupol yadro (I=5/2). Oₕ simmetriyada CQ ≈ 0-1 MHz (juda kichik), η ≈ 0. Bu kichik kvadrupol bog'lanish → o'tkir signallar.",
      referencing: "REFERENS: [Al(H₂O)₆]³⁺ = 0 ppm (IUPAC standart). 1 M AlCl₃ yoki Al(NO₃)₃ eritmasi ishlatiladi.",
      applications: "Al komplekslari tuzilishini aniqlash, gidroliz mahsulotlari, polimerizatsiya, kataliz"
    },
    h1: {
      nucleus: "¹H (I = 1/2, 100% tabiiy)",
      shift: "4.8 ppm (H₂O, barcha 12H ekvivalent)",
      whyThisShift: "H₂O ligand Al³⁺ ga bog'langan. Al³⁺ yuqori zaryad (+3) → H₂O protonlari deshielded (erkin H₂O ~1.5 ppm, kompleksda 4.8 ppm → Δδ = +3.3 ppm). Bu metal effekti.",
      multiplicity: "Singlet (Oₕ simmetriyada barcha 12H ekvivalent, yoki tez almashinish)",
      linewidth: "~2-5 Hz (o'tkir, diamagnit)",
      t1Relaxation: "T₁ ≈ 1-3 s (dipol-dipol mexanizm)",
      exchangeBroadening: "Tez suv almashinish tufayli eritma H₂O bilan signal birlashadi. Bu exchange broadening effektidir."
    },
    o17: {
      nucleus: "¹⁷O (I = 5/2, 0.037% tabiiy)",
      shift: "~0 ppm (H₂O, referens: H₂O)",
      whyThisShift: "¹⁷O YaMR da H₂O signali ~0 ppm. Al³⁺ ga bog'langan H₂O biroz deshielded (~10-20 ppm).",
      sensitivity: "Juda past sezgirlik (0.037% tabiiy, kvadrupol). ¹⁷O boyitish kerak.",
      linewidth: "~100-500 Hz (kvadrupol kengayish)",
      applications: "Suv almashinish kinetikasi (¹⁷O YaMR orqali). Transverse relaxation (T₂) orqali k_al o'lchanadi."
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY PARAMETRLAR
  //  ═══════════════════════════════════════════════════════════════
  structuralData: {
    bondLengths: {
      alO: "1.87-1.90 Å (Al-O, barcha 6 ta ekvivalent)",
      oh_Bond: "0.96-0.98 Å (O-H)",
      comparison: "[Ga(H₂O)₆]³⁺: Ga-O = 1.95 Å. [In(H₂O)₆]³⁺: In-O = 2.15 Å. Al³⁺ eng kichik (0.54 Å ion radiusi).",
      ionicRadius: "Al³⁺ ion radiusi: 0.54 Å (6-koordinatsiya). Kichik radius + yuqori zaryad → kuchli Al-O bog'."
    },
    bondAngles: {
      oAlO_cis: "90° (cis O-Al-O)",
      oAlO_trans: "180° (trans O-Al-O)",
      hoh_Angle: "~106° (H-O-H, erkin H₂O dan biroz kichik)"
    },
    hydration: {
      firstShell: "6 ta H₂O (birinchi gidrat qobiq)",
      secondShell: "12-18 ta H₂O (ikkinchi gidrat qobiq, vodorod bog'lanish)",
      hydrogenBonds: "Birinchi qobiq H₂O ikkinchi qobiq H₂O bilan vodorod bog'lari hosil qiladi"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // GIDROLIZ VA KISLOTA-ASOS XUSUSIYATLARI
  //  ═══════════════════════════════════════════════════════════════
  hydrolysis: {
    pKa1: "pKa₁ ≈ 5.0 (birinchi gidroliz)",
    reaction1: "[Al(H₂O)₆]³⁺ ⇌ [Al(H₂O)₅(OH)]²⁺ + H⁺",
    pKa2: "pKa₂ ≈ 9.3 (ikkinchi gidroliz)",
    reaction2: "[Al(H₂O)₅(OH)]²⁺ ⇌ [Al(H₂O)₄(OH)₂]⁺ + H⁺",
    pKa3: "pKa₃ ≈ 12 (uchinchi gidroliz)",
    reaction3: "[Al(H₂O)₄(OH)₂]⁺ ⇌ [Al(H₂O)₃(OH)₃] + H⁺",
    amphoteric: "Al(OH)₃ amfoter — kislota va asos bilan reaksiyaga kirishadi",
    aluminate: "pH > 12 da: [Al(OH)₄]⁻ (alyuminat ion) hosil bo'ladi",
    polymerization: "pH 4-7 da: polimerik turlar (Al₁₃ Keggin ion, [AlO₄Al₁₂(OH)₂₄(H₂O)₁₂]⁷⁺)"
  },

  //  ═══════════════════════════════════════════════════════════════
  // LIGAND ALMASHINISH KINETIKASI (LABIL!)
  //  ═══════════════════════════════════════════════════════════════
  kinetics: {
    waterExchange: {
      reaction: "[Al(H₂O)₆]³⁺ + H₂O* ⇌ [Al(H₂O)₅(H₂O*)]³⁺ + H₂O",
      rateConstant: "k_ex ≈ 1.4 × 10⁵ s⁻¹ (298 K)",
      halfLife: "t₁/₂ ≈ 5 μs (juda tez!)",
      activationEnergy: "Eₐ ≈ 50-60 kJ/mol",
      activationVolume: "ΔV‡ ≈ +5.7 cm³/mol (dissotsiativ mexanizm)",
      mechanism: "Dissotsiativ (D yoki Iₐ mexanizm) — H₂O chiqib ketishi tez, yangi H₂O kirishi sekin",
      comparison: "[Cr(H₂O)₆]³⁺: k_ex ≈ 10⁻⁶ s⁻¹ (inert). [Fe(H₂O)₆]³⁺: k_ex ≈ 10² s⁻¹ (o'rtacha). [Al(H₂O)₆]³⁺: LABIL!"
    },
    whyLabile: {
      reason1: "d⁰ holat — kristall maydon stabilizatsiyasi yo'q (CFSE = 0)",
      reason2: "Kichik ion radiusi — ligandlar bir-biriga yaqin, sterik kuchlanish",
      reason3: "Yuqori zaryad — kuchli elektrostatik tortishish, lekin kovalent bog'lanish kuchsiz",
      consequence: "Ligand almashinish juda tez — YaMR da o'rtacha signal kuzatiladi"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  //  ═══════════════════════════════════════════════════════════════
  history: {
    werner: {
      year: 1893,
      scientist: "Alfred Werner (Shveytsariya)",
      achievement: "Koordinatsion nazariya — [Al(H₂O)₆]³⁺ oktaedr geometriya",
      contribution: "Al³⁺ 6-koordinatsiya ekanligini tasdiqladi",
      nobel: "Nobel mukofoti (1913)"
    },
    akitt: {
      year: "1970-80-yillar",
      scientist: "J. W. Akitt",
      achievement: "²⁷Al YaMR spektroskopiyasini tizimli rivojlantirdi",
      contribution: "Al komplekslarining ²⁷Al kimyoviy siljishlari katalogi, gidroliz turlari",
      significance: "²⁷Al YaMR orqali Al kimyosini tushunish"
    },
    hargittai: {
      year: 2000,
      scientist: "Istvan Hargittai",
      achievement: "Al³⁺ gidratlanish strukturasini batafsil o'rgandi",
      contribution: "EXAFS, neytron difraksiya orqali Al-O bog' uzunliklari",
      significance: "Strukturaviy parametrlarni aniqlash"
    },
    modernEra: {
      year: "2000-yillardan",
      scientists: "Casey, Helm, Merbach",
      achievement: "Ligand almashinish kinetikasi (¹⁷O YaMR)",
      contribution: "k_ex, Eₐ, ΔV‡ parametrlarini aniq o'lchash",
      significance: "Mexanizm tushunish (dissotsiativ vs assotsiativ)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH — BOSHQA AKVA KOMPLEKSLAR
  //  ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      compound: "[Al(H₂O)₆]³⁺",
      metal: "Al³⁺ (d⁰)",
      geometry: "Oktaedr (Oₕ)",
      nmrShift: "²⁷Al: 0 ppm (REFERENS)",
      waterExchange: "k_ex ≈ 1.4 × 10⁵ s⁻¹ (LABIL)",
      pKa: "5.0"
    },
    {
      compound: "[Ga(H₂O)₆]³⁺",
      metal: "Ga³⁺ (d¹⁰)",
      geometry: "Oktaedr (Oₕ)",
      nmrShift: "⁶⁹Ga: ~0 ppm",
      waterExchange: "k_ex ≈ 10⁵ s⁻¹ (labil)",
      pKa: "3.0"
    },
    {
      compound: "[Fe(H₂O)₆]³⁺",
      metal: "Fe³⁺ (d⁵)",
      geometry: "Oktaedr (Oₕ)",
      nmrShift: "⁵⁷Fe: ~0 ppm",
      waterExchange: "k_ex ≈ 10² s⁻¹ (o'rtacha)",
      pKa: "2.2"
    },
    {
      compound: "[Cr(H₂O)₆]³⁺",
      metal: "Cr³⁺ (d³)",
      geometry: "Oktaedr (Oₕ)",
      nmrShift: "⁵³Cr: ~0 ppm",
      waterExchange: "k_ex ≈ 10⁻⁶ s⁻¹ (INERT)",
      pKa: "4.0"
    },
    {
      compound: "[Mg(H₂O)₆]²⁺",
      metal: "Mg²⁺ (d⁰)",
      geometry: "Oktaedr (Oₕ)",
      nmrShift: "²⁵Mg: ~0 ppm",
      waterExchange: "k_ex ≈ 10⁵ s⁻¹ (labil)",
      pKa: "11.4"
    },
    {
      compound: "[Al(OH)₄]⁻",
      metal: "Al³⁺ (d⁰)",
      geometry: "Tetraedr (Tₐ)",
      nmrShift: "²⁷Al: 80 ppm",
      waterExchange: "—",
      pKa: "—"
    }
  ],

  // YaMR signallar (batafsil)
  nmrSignals: [
    {
      nucleus: "²⁷Al",
      ligand: "Al markaz",
      shift: 0,
      multiplicity: "singlet (o'tkir)",
      jCoupling: "—",
      integration: "1Al",
      notes: "²⁷Al YaMR REFERENS (0 ppm). Oₕ simmetriya → kvadrupol kengayish minimal (CQ ≈ 0-1 MHz). Boshqa Al komplekslar shu ga nisbatan o'lchanadi."
    },
    {
      nucleus: "¹H",
      ligand: "H₂O (barcha 12H)",
      shift: 4.8,
      multiplicity: "singlet (keng)",
      jCoupling: "—",
      integration: "12H",
      notes: "H₂O protonlari deshielded (+3.3 ppm, Al³⁺ effekti). Tez almashinish tufayli eritma H₂O bilan signal birlashadi."
    },
    {
      nucleus: "¹⁷O",
      ligand: "H₂O (O atomi)",
      shift: 0,
      multiplicity: "singlet (keng, kvadrupol)",
      jCoupling: "—",
      integration: "6O",
      notes: "¹⁷O YaMR — juda past sezgirlik (0.037% tabiiy). ¹⁷O boyitish kerak. Suv almashinish kinetikasi uchun ishlatiladi."
    }
  ],

  // ²⁷Al YaMR spektr ma'lumotlari (simulyatsiya uchun)
  al27Spectrum: [
    { ppm: -100, intensity: 0, notes: "—" },
    { ppm: -50, intensity: 0, notes: "—" },
    { ppm: -20, intensity: 0.2, notes: "²⁷Al signal (past maydon yelkasi)" },
    { ppm: 0, intensity: 1.0, notes: "²⁷Al: [Al(H₂O)₆]³⁺ markaziy (REFERENS)" },
    { ppm: 20, intensity: 0.2, notes: "²⁷Al signal (yuqori maydon yelkasi)" },
    { ppm: 50, intensity: 0, notes: "—" },
    { ppm: 80, intensity: 0, notes: "[Al(OH)₄]⁻ joyi" },
    { ppm: 100, intensity: 0, notes: "—" }
  ],

  // Halaqit beruvchi omillar
  interferences: [
    {
      source: "Gidroliz mahsulotlari ([Al(OH)]²⁺, [Al(OH)₂]⁺)",
      effect: "²⁷Al YaMR da qo'shimcha signallar (~20-60 ppm)",
      severity: "Yuqori",
      solution: "Past pH da ishlash (pH < 3). Kuchli kislota qo'shish (HCl, HNO₃).",
      theoryNote: "[Al(H₂O)₆]³⁺ pH > 4 da gidrolizga uchraydi. [Al(H₂O)₅(OH)]²⁺ ²⁷Al signal ~20-30 ppm da. Past pH da gidroliz to'xtaydi."
    },
    {
      source: "Polimerik turlar (Al₁₃ Keggin ion)",
      effect: "²⁷Al YaMR da keng signallar (~60-70 ppm)",
      severity: "Yuqori",
      solution: "Yangi tayyorlangan eritma. Past pH, past konsentratsiya.",
      theoryNote: "pH 4-7 da Al₁₃ Keggin ion ([AlO₄Al₁₂(OH)₂₄(H₂O)₁₂]⁷⁺) hosil bo'ladi. ²⁷Al YaMR da 62.5 ppm (tetraedr Al) va 0 ppm (oktaedr Al) signallar."
    },
    {
      source: "Harorat effektlari",
      effect: "Yuqori T da suv almashinish tezlashadi → signal kengayadi",
      severity: "O'rta",
      solution: "298 K da ishlash tavsiya etiladi.",
      theoryNote: "k_ex haroratga bog'liq (Arrhenius). Yuqori T da exchange broadening kuchayadi."
    },
    {
      source: "Konsentratsiya effektlari",
      effect: "Yuqori konsentratsiyada polimerizatsiya (Al₁₃ hosil bo'lishi)",
      severity: "O'rta",
      solution: "0.1-0.5 M konsentratsiyada ishlash tavsiya etiladi.",
      theoryNote: "Yuqori [Al³⁺] da polimerik turlar hosil bo'ladi. Past konsentratsiya monomerik [Al(H₂O)₆]³⁺ ni saqlaydi."
    },
    {
      source: "Anion effektlari (Cl⁻, SO₄²⁻)",
      effect: "²⁷Al siljishi biroz o'zgaradi (~2-5 ppm)",
      severity: "Past",
      solution: "Standart anion (Cl⁻ yoki NO₃⁻) ishlatish.",
      theoryNote: "Anionlar Al³⁺ bilan ion juftlari hosil qiladi. Bu ²⁷Al siljishini biroz o'zgartiradi."
    },
    {
      source: "D₂O erituvchi",
      effect: "H/D almashinish → ¹H signal yo'qoladi",
      severity: "Past (nazorat qilinadi)",
      solution: "D₂O da ¹H YaMR emas, ²⁷Al YaMR olish. Yoki H₂O da ishlash.",
      theoryNote: "D₂O da H₂O protonlari D bilan almashinadi. ¹H YaMR da signal yo'qoladi. ²⁷Al YaMR ga ta'sir qilmaydi."
    }
  ],

  // Laboratoriya tartibi
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak, labor xalat. Al³⁺ tuzlari kislotali (pH < 3). Teri va ko'zga tegmasin.",
      time: "15 daq",
      theoryNote: "AlCl₃·6H₂O eritmalari kislotali (pH ~2-3, gidroliz tufayli). Kislota bilan ishlaganda ehtiyot bo'ling."
    },
    {
      step: 2,
      title: "Sof AlCl₃·6H₂O ni tayyorlash",
      desc: "Tijorat AlCl₃·6H₂O (≥99%) yoki sintez. Sintez: Al(OH)₃ + 3 HCl → AlCl₃ + 3 H₂O. Rangsiz kristallar.",
      time: "1-2 soat (sintez) yoki tayyor",
      theoryNote: "AlCl₃·6H₂O — eng keng tarqalgan Al³⁺ manbai. Suvda yaxshi eriydi, kislotali eritma hosil qiladi."
    },
    {
      step: 3,
      title: "YaMR spektrometrni tayyorlash",
      desc: "YaMR spektrometrni yoqish, 30 daq stabillash. Shimlash (shimming). D₂O yoki H₂O erituvchi. ²⁷Al kanalini sozlash.",
      time: "30-45 daq",
      theoryNote: "²⁷Al kanali 26.1 MHz atrofida (400 MHz ¹H spektrometrda). Yaxshi shimlash — o'tkir signal uchun muhim."
    },
    {
      step: 4,
      title: "Namuna tayyorlash",
      desc: "50-100 mg AlCl₃·6H₂O ni 0.6 mL D₂O da eritish. YaMR naychaga solish. pH ni tekshirish (pH < 3 bo'lishi kerak).",
      time: "10 daq",
      theoryNote: "D₂O da H₂O protonlari D bilan almashinadi. pH < 3 da gidroliz bo'lmaydi — sof [Al(H₂O)₆]³⁺ signal."
    },
    {
      step: 5,
      title: "²⁷Al YaMR spektrini olish",
      desc: "²⁷Al YaMR spektrini olish (100-500 skan). Signal 0 ppm da (REFERENS). Keng diapazon (±200 ppm).",
      time: "10-20 daq",
      theoryNote: "²⁷Al YaMR da 0 ppm da signal. Bu barcha Al komplekslari uchun referens. Keng diapazon kerak (±200 ppm)."
    },
    {
      step: 6,
      title: "¹H YaMR spektrini olish",
      desc: "¹H YaMR spektrini olish (16-64 skan). H₂O signalini tekshirish (4.8 ppm, 12H).",
      time: "5-10 daq",
      theoryNote: "¹H YaMR da 4.8 ppm da H₂O signali (12H). D₂O da bu signal yo'qoladi (H/D almashinish)."
    },
    {
      step: 7,
      title: "Gidroliz tekshirish (ixtiyoriy)",
      desc: "pH ni oshirish (NaOH qo'shish) va ²⁷Al YaMR da qo'shimcha signallarni kuzatish (~20-60 ppm).",
      time: "30-60 daq",
      theoryNote: "pH > 4 da gidroliz mahsulotlari ([Al(OH)]²⁺, [Al(OH)₂]⁺) hosil bo'ladi. ²⁷Al YaMR da qo'shimcha signallar."
    },
    {
      step: 8,
      title: "Harorat o'zgarishini o'lchash (ixtiyoriy)",
      desc: "280-320 K oralig'ida harorat bog'liqligini o'lchash. k_ex ni hisoblash.",
      time: "1-2 soat",
      theoryNote: "VT-NMR orqali suv almashinish kinetikasi o'rganiladi. Arrhenius grafigi → Eₐ."
    }
  ],

  // Kengaytiruvchi metodlar
  advancedTechniques: [
    {
      name: "VT-NMR (Variable Temperature)",
      description: "Haroratni o'zgartirib suv almashinish kinetikasi",
      advantages: ["k_ex aniqlash", "Eₐ, ΔH‡, ΔS‡", "Mexanizm"],
      disadvantages: ["Uzoq vaqt", "Harorat nazorati"],
      bestFor: "Ligand almashinish kinetikasi, mexanizm",
      examples: "k_ex ≈ 1.4 × 10⁵ s⁻¹ (298 K), Eₐ ≈ 50-60 kJ/mol"
    },
    {
      name: "¹⁷O YaMR (boyitilgan)",
      description: "¹⁷O boyitilgan H₂O bilan suv almashinish",
      advantages: ["To'g'ridan-to'g'ri H₂O kuzatish", "T₂ relaksatsiya", "k_ex"],
      disadvantages: ["¹⁷O boyitish qimmat", "Kvadrupol kengayish"],
      bestFor: "Suv almashinish kinetikasi (eng aniq usul)",
      examples: "¹⁷O transverse relaxation (T₂) orqali k_ex o'lchanadi"
    },
    {
      name: "EXAFS (Extended X-ray Absorption Fine Structure)",
      description: "Al-O bog' uzunliklarini aniq o'lchash",
      advantages: ["Aniq bog' uzunliklari", "Koordinatsion son", "Eritmada"],
      disadvantages: ["Sinxrotron kerak", "Murakkab tahlil"],
      bestFor: "Strukturaviy parametrlar, gidratlanish",
      examples: "Al-O = 1.87-1.90 Å (birinchi qobiq)"
    },
    {
      name: "Neytron difraksiya",
      description: "Kristall strukturasini aniq aniqlash",
      advantages: ["H atomlari ko'rinadi", "Aniq struktura", "Vodorod bog'lari"],
      disadvantages: ["Neytron manbai kerak", "Kristall kerak"],
      bestFor: "H atomlari pozitsiyasi, vodorod bog'lari",
      examples: "O-H = 0.96-0.98 Å, H-O-H = 106°"
    },
    {
      name: "DFT hisob-kitoblari",
      description: "Kvant kimyoviy hisob-kitoblar",
      advantages: ["Struktura", "Energiya", "Mexanizm"],
      disadvantages: ["Kuchli kompyuter", "Murakkab"],
      bestFor: "Mexanizm, energiya, transition states",
      examples: "B3LYP/6-31G(d) — gidroliz mexanizmi"
    },
    {
      name: "Potensiometrik titrlash",
      description: "pKa qiymatlarini o'lchash",
      advantages: ["pKa aniqlash", "Tez", "Arzon"],
      disadvantages: ["Faqat kislota-asos", "Bilvosita"],
      bestFor: "Gidroliz konstantalari, pKa",
      examples: "pKa₁ ≈ 5.0, pKa₂ ≈ 9.3, pKa₃ ≈ 12"
    }
  ]
}

export default function AlH2O6Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [alPpmSlider, setAlPpmSlider] = useState(0)
  const [pH, setPH] = useState(2)
  const [activeNmrNucleus, setActiveNmrNucleus] = useState("al27")

  const currentAlSignal = useMemo(() => {
    let closest = COMPOUND.al27Spectrum[0]
    let minDiff = Math.abs(alPpmSlider - COMPOUND.al27Spectrum[0].ppm)
    for (let i = 1; i < COMPOUND.al27Spectrum.length; i++) {
      const diff = Math.abs(alPpmSlider - COMPOUND.al27Spectrum[i].ppm)
      if (diff < minDiff) {
        minDiff = diff
        closest = COMPOUND.al27Spectrum[i]
      }
    }
    return closest
  }, [alPpmSlider])

  const hydrolysisStatus = useMemo(() => {
    if (pH < 4) return { status: "Sof [Al(H₂O)₆]³⁺", species: "Monomer", color: "text-green-400" }
    if (pH < 7) return { status: "Polimerik turlar", species: "Al₁₃ Keggin ion", color: "text-yellow-400" }
    if (pH < 10) return { status: "Al(OH)₃ cho'kma", species: "Amorf gidroksid", color: "text-orange-400" }
    return { status: "Alyuminat", species: "[Al(OH)₄]⁻", color: "text-red-400" }
  }, [pH])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-blue-950 to-purple-950 border-2 border-blue-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🧲</span> [Al(H₂O)₆]³⁺ — ²⁷Al YaMR REFERENS!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-blue-300">[Al(H₂O)₆]³⁺</strong> — ²⁷Al YaMR spektroskopiyasining <strong className="text-blue-300">STANDART REFERENSI</strong>!
              0 ppm — barcha Al komplekslari shu ga nisbatan o'lchanadi. d⁰ holat, labil almashinish, gidroliz.
            </p>
            <div className="bg-blue-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-blue-400 font-bold mb-2">🧲 YaMR ma'lumotlari:</div>
                  <div className="text-purple-200">
                    <strong>²⁷Al:</strong> 0 ppm (REFERENS)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹H:</strong> 4.8 ppm (H₂O)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹⁷O:</strong> ~0 ppm
                  </div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold mb-2">🔬 Asosiy xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Elektron:</strong> d⁰ (diamagnit)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Geometriya:</strong> Oktaedr (Oₕ)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Kinetik:</strong> LABIL
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-blue-300">Knowledge Base:</strong> Werner (1893, Nobel 1913), Akitt (1970-80),
                Hargittai (2000), Casey, Helm, Merbach (2000-yillar), Cotton-Wilkinson, Miessler-Tarr
              </p>
            </div>
            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-200">
                <strong className="text-yellow-300">⚠️ DIQQAT:</strong> Al³⁺ eritmalari kislotali (pH ~2-3). Gidroliz pH  4 da boshlanadi.
                Past pH da saqlash kerak (sof [Al(H₂O)₆]³⁺ uchun).
              </p>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-blue-400 font-semibold">[Al(H₂O)₆]³⁺</span>
            </nav>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🧲 YaMR</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol (kation)
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">²⁷Al REFERENS</span>
                  <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">d⁰ Holat</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Labil</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Gidroliz</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-xs bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Birikmalar katalogi
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-blue-600 hover:bg-blue-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-semibold">YaMR</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">²⁷Al Referens</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Labil</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Gidroliz</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">d⁰ Holat</span>
          </div>
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              [Al(H₂O)₆]³⁺
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>
          <p className="text-purple-300 text-lg mb-4">
            Geksaakvaalyuminiy(III) — <span className="text-blue-400 italic">&quot;²⁷Al YaMR ning standart referensi, labil almashinish, gidroliz&quot;</span>
          </p>
          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-blue-400">YaMR spektroskopiya</strong> yordamida <strong className="text-blue-400">referenslash tizimini</strong> o&apos;rganish.
            Al³⁺ — d⁰ holat (d-elektronlar yo'q), Oₕ simmetriya, diamagnit.
            <strong className="text-blue-400"> ²⁷Al YaMR: 0 ppm</strong> (IUPAC REFERENS).
            <strong className="text-blue-400"> ¹H YaMR: 4.8 ppm</strong> (H₂O, deshielded).
            <strong className="text-blue-400"> Labil almashinish</strong> — k_ex ≈ 1.4 × 10⁵ s⁻¹ (juda tez!).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Al³⁺ (d⁰)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Oktaedr (Oₕ)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">²⁷Al YaMR</div>
              <div className="text-white font-bold">0 ppm (ref)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Kinetik</div>
              <div className="text-green-400 font-bold">LABIL</div>
            </div>
          </div>
        </div>

        {/* KRISTALL MAYDON NAZARIYASI — d⁰ HOLATI */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔬</span> Kristall maydon nazariyasi — d⁰ HOLATI
          </h2>
          <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>Muhim:</strong> Al³⁺ — [Ne] elektron konfiguratsiya, <strong>d-elektronlar yo'q</strong> (d⁰ holat).
              Kristall maydon nazariyasi bu yerda <strong>ahamiyatsiz</strong> — CFSE = 0. Oktaedr geometriya elektrostatik ta'sir tufayli
              (Al³⁺ yuqori zaryad, kichik radius → 6 ta H₂O bilan ion-dipol bog'lanish).
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
                  <span className="text-purple-400">d-elektronlar:</span>
                  <span className="text-red-400 font-bold">{COMPOUND.crystalField.dElectrons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Spin holati:</span>
                  <span className="text-blue-400 text-xs">{COMPOUND.crystalField.spinState}</span>
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
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Δo (ahamiyatsiz):</span>
                  <span className="text-blue-400 font-mono text-xs">{COMPOUND.crystalField.crystalFieldSplitting}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">CFSE:</span>
                  <span className="text-red-400 font-bold">{COMPOUND.crystalField.cFSE}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Bog'lanish xarakteri:</span>
                  <span className="text-blue-400 text-xs">{COMPOUND.crystalField.ionicCharacter}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold mb-2">Nima uchun oktaedr?</h4>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Tufayli:</strong> {COMPOUND.crystalField.whyOctahedral}
            </p>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Rang sababi:</strong> {COMPOUND.crystalField.colorOrigin}
            </p>
            <p className="text-purple-200 text-sm">
              <strong>Charge transfer:</strong> {COMPOUND.crystalField.chargeTransfer}
            </p>
          </div>

          {/* d-orbital diagrammasi — d⁰ holat (bo'sh!) */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <h4 className="text-blue-400 font-bold mb-3">d-orbital diagrammasi (d⁰ holat — BO'SH!)</h4>
            <svg viewBox="0 0 600 280" className="w-full h-64" role="img" aria-label="d-orbital diagram d0">
              <title>d-orbital diagrammasi — Al³⁺ d⁰ (bo'sh orbitallar)</title>
              <line x1="50" y1="250" x2="50" y2="20" stroke="#a78bfa" strokeWidth="1" />
              <text x="30" y="140" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 30, 140)">Energiya</text>

              <line x1="350" y1="60" x2="450" y2="60" stroke="#ef4444" strokeWidth="3" />
              <text x="400" y="50" textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="bold">
                e<tspan baselineShift="sub" fontSize="7">g</tspan>
              </text>
              <text x="400" y="75" textAnchor="middle" fontSize="8" fill="#ef4444">
                d<tspan baselineShift="sub" fontSize="6">x²-y²</tspan>, d<tspan baselineShift="sub" fontSize="6">z²</tspan>
              </text>
              <text x="480" y="63" fontSize="8" fill="#ef4444">BO'SH</text>

              <line x1="350" y1="180" x2="450" y2="180" stroke="#06b6d4" strokeWidth="3" />
              <text x="400" y="170" textAnchor="middle" fontSize="10" fill="#06b6d4" fontWeight="bold">
                t<tspan baselineShift="sub" fontSize="7">2g</tspan>
              </text>
              <text x="400" y="195" textAnchor="middle" fontSize="8" fill="#06b6d4">
                d<tspan baselineShift="sub" fontSize="6">xy</tspan>, d<tspan baselineShift="sub" fontSize="6">xz</tspan>, d<tspan baselineShift="sub" fontSize="6">yz</tspan>
              </text>
              <text x="480" y="183" fontSize="8" fill="#06b6d4">BO'SH</text>

              <line x1="500" y1="60" x2="500" y2="180" stroke="#fbbf24" strokeWidth="2" />
              <text x="540" y="123" fontSize="9" fill="#fbbf24" fontWeight="bold">Δo (ahamiyatsiz)</text>

              <text x="300" y="270" textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="bold">
                ⚠️ d⁰ holat — barcha d-orbitallar BO'SH!
              </text>
            </svg>
            <div className="mt-2 bg-red-900/30 rounded p-2">
              <p className="text-red-300 text-xs">
                <strong>Muhim:</strong> Al³⁺ da d-elektronlar yo'q → kristall maydon nazariyasi ahamiyatsiz.
                Oktaedr geometriya elektrostatik ta'sir (ion-dipol) tufayli.
              </p>
            </div>
          </div>
        </div>

        {/* SIMMETRIYA — Oₕ */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📐</span> Simmetriya (Oₕ) — OKTAEDR
          </h2>
          <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-sm">
              <strong>Oₕ nuqtaviy guruhi:</strong> [Al(H₂O)₆]³⁺ ideal oktaedr geometriyada. 48 ta simmetriya elementi,
              <strong className="text-blue-400"> markaziy simmetriya (i)</strong> bor. Bu <strong>mutual exclusion principle</strong>
              ga olib keladi — IR va Raman spektrlari ustma-ust tushmaydi.
              Oₕ simmetriya → <strong>kvadrupol bog'lanish minimal</strong> (η ≈ 0) → ²⁷Al YaMR da o'tkir signal!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">Simmetriya elementlari (48)</h3>
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
                  <span className="text-purple-400 font-mono text-xs">{COMPOUND.symmetry.symmetryElements.join("; ")}</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">Spektral faollik</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">IR faol:</span>
                  <span className="text-purple-400 font-mono">{COMPOUND.symmetry.irActive}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Raman faol:</span>
                  <span className="text-purple-400 font-mono">{COMPOUND.symmetry.ramanActive}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-red-400 font-bold">Mutual exclusion:</span>
                  <span className="text-red-400 text-xs font-bold">{COMPOUND.symmetry.mutualExclusion}</span>
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
        </div>

        {/* GIDROLIZ VA pH — ENG MUHIM QISM */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⚗️</span> GIDROLIZ VA pH — KRITIK OMIL
          </h2>
          <div className="bg-yellow-900/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 text-sm">
              <strong>Gidroliz:</strong> [Al(H₂O)₆]³⁺ pH ga juda sezgir! pH &gt; 4 da gidroliz boshlanadi.
              pH 4-7 da polimerik turlar (Al₁₃ Keggin ion), pH &gt; 10 da Al(OH)₃ cho'kma, pH &gt; 12 da [Al(OH)₄]⁻ (alyuminat).
              <strong className="text-yellow-400"> ²⁷Al YaMR uchun past pH (pH &lt; 3) kerak!</strong>
            </p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-5">
            <h4 className="text-yellow-400 font-bold mb-4">🧪 Interaktiv pH simulyatsiyasi</h4>
            <div className="mb-4">
              <label className="block text-yellow-400 font-bold mb-2">
                pH: {pH}
              </label>
              <input
                type="range"
                min="0"
                max="14"
                step="0.5"
                value={pH}
                onChange={(e) => setPH(Number(e.target.value))}
                className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
                aria-label="pH ni o'zgartirish"
              />
              <div className="flex justify-between text-xs text-purple-400 mt-1">
                <span>0 (kuchli kislota)</span>
                <span>7 (neytral)</span>
                <span>14 (kuchli asos)</span>
              </div>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <div className="text-xs text-purple-400 mb-1">Asosiy tur:</div>
              <div className={`text-2xl font-bold ${hydrolysisStatus.color}`}>{hydrolysisStatus.status}</div>
              <div className="text-sm text-purple-300 mt-2">{hydrolysisStatus.species}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Gidroliz bosqichlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">1-bosqich (pKa₁):</span>
                  <span className="text-yellow-400 text-xs font-mono">{COMPOUND.hydrolysis.reaction1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">pKa₁:</span>
                  <span className="text-yellow-400 font-mono">{COMPOUND.hydrolysis.pKa1}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">2-bosqich (pKa₂):</span>
                  <span className="text-yellow-400 text-xs font-mono">{COMPOUND.hydrolysis.reaction2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">pKa₂:</span>
                  <span className="text-yellow-400 font-mono">{COMPOUND.hydrolysis.pKa2}</span>
                </div>
              </div>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">pH ga bog'liq turlar</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">pH &lt; 4:</span>
                  <span className="text-green-400 text-xs">Sof [Al(H₂O)₆]³⁺ (monomer)</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">pH 4-7:</span>
                  <span className="text-yellow-400 text-xs">Al₁₃ Keggin ion (polimer)</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">pH 7-10:</span>
                  <span className="text-orange-400 text-xs">Al(OH)₃ cho'kma</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">pH &gt; 12:</span>
                  <span className="text-red-400 text-xs">[Al(OH)₄]⁻ (alyuminat)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LABIL ALMASHINISH KINETIKASI */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⚡</span> LABIL ALMASHINISH KINETIKASI
          </h2>
          <div className="bg-green-900/30 rounded-lg p-4 mb-6">
            <p className="text-green-300 text-sm">
              <strong>[Al(H₂O)₆]³⁺ — LABIL kompleks!</strong> Suv almashinish juda tez: k_ex ≈ 1.4 × 10⁵ s⁻¹ (298 K).
              Bu [Cr(H₂O)₆]³⁺ (inert, k_ex ≈ 10⁻⁶ s⁻¹) dan <strong>10¹¹ marta tezroq</strong>!
              Sababi: d⁰ holat (CFSE = 0), kichik ion radiusi, dissotsiativ mexanizm.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Suv almashinish</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Reaksiya:</span>
                  <span className="text-green-400 text-xs font-mono">{COMPOUND.kinetics.waterExchange.reaction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">k_ex (298 K):</span>
                  <span className="text-green-400 font-mono">{COMPOUND.kinetics.waterExchange.rateConstant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">t₁/₂:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.kinetics.waterExchange.halfLife}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Eₐ:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.kinetics.waterExchange.activationEnergy}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Mexanizm:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.kinetics.waterExchange.mechanism}</span>
                </div>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Nima uchun labil?</h3>
              <ul className="space-y-2 text-sm text-purple-200">
                <li>• {COMPOUND.kinetics.whyLabile.reason1}</li>
                <li>• {COMPOUND.kinetics.whyLabile.reason2}</li>
                <li>• {COMPOUND.kinetics.whyLabile.reason3}</li>
                <li>• <strong className="text-green-400">Oqibat:</strong> {COMPOUND.kinetics.whyLabile.consequence}</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-2">Taqqoslash</h4>
            <p className="text-purple-200 text-sm">
              {COMPOUND.kinetics.waterExchange.comparison}
            </p>
          </div>
        </div>

        {/* YaMR NAZARIYASI */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧲</span> YaMR nazariyasi — chuqur tahlil
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveNmrNucleus("al27")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "al27"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ²⁷Al (I=5/2, 100%)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("h1")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "h1"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹H (I=1/2, 100%)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("o17")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "o17"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹⁷O (I=5/2, 0.037%)
            </button>
          </div>

          {activeNmrNucleus === "al27" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.al27.nucleus}</h3>
              <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
                <p className="text-yellow-300 text-xs">
                  <strong>⭐ REFERENS!</strong> [Al(H₂O)₆]³⁺ — ²⁷Al YaMR uchun IUPAC standart referens (0 ppm).
                  Barcha Al komplekslari shu ga nisbatan o'lchanadi.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.al27.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Sezgirlik:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.al27.sensitivity}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.al27.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.al27.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun 0 ppm (REFERENS)?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.al27.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Kvadrupol xususiyatlar:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.al27.quadrupolar}</p>
              </div>
            </div>
          )}

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
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun 4.8 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.whyThisShift}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "o17" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.o17.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.o17.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Sezgirlik:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.o17.sensitivity}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Qo'llanish:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.o17.applications}</p>
              </div>
            </div>
          )}
        </div>

        {/* STRUKTURAVIY PARAMETRLAR */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📏</span> Strukturaviy parametrlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog' uzunliklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Al-O (6 ta ekvivalent):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.alO}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">O-H:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.oh_Bond}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Al³⁺ ion radiusi:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.ionicRadius}</span>
                </div>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Gidratlanish</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Birinchi qobiq:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.structuralData.hydration.firstShell}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Ikkinchi qobiq:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.structuralData.hydration.secondShell}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Vodorod bog'lari:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.structuralData.hydration.hydrogenBonds}</span>
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

        {/* YaMR SIGNAL JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧲 YaMR signallar (batafsil)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-blue-400">Yadro</th>
                  <th className="py-3 px-3 text-blue-400">Ligand</th>
                  <th className="py-3 px-3 text-blue-400">δ (ppm)</th>
                  <th className="py-3 px-3 text-blue-400">Multiplicity</th>
                  <th className="py-3 px-3 text-blue-400">J (Hz)</th>
                  <th className="py-3 px-3 text-blue-400">Integration</th>
                  <th className="py-3 px-3 text-blue-400">Izohlar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.nmrSignals.map((signal, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/30">
                    <td className="py-3 px-3 text-blue-400 font-bold">{signal.nucleus}</td>
                    <td className="py-3 px-3 text-xs">{signal.ligand}</td>
                    <td className="py-3 px-3 text-blue-400 font-mono font-bold">{signal.shift}</td>
                    <td className="py-3 px-3 text-xs">{signal.multiplicity}</td>
                    <td className="py-3 px-3 text-xs font-mono">{signal.jCoupling}</td>
                    <td className="py-3 px-3">{signal.integration}</td>
                    <td className="py-3 px-3 text-xs text-purple-300">{signal.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INTERAKTIV ²⁷Al YaMR SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv ²⁷Al YaMR spektr — REFERENS (0 ppm)</h2>
          <p className="text-purple-200 leading-relaxed mb-6">
            ²⁷Al kimyoviy siljish diapazoni juda keng (-100 dan +100 ppm). [Al(H₂O)₆]³⁺ <strong className="text-blue-400">0 ppm</strong> da (REFERENS).
          </p>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              ²⁷Al kimyoviy siljish: {alPpmSlider} ppm
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              step="5"
              value={alPpmSlider}
              onChange={(e) => setAlPpmSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="27Al kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>-100</span>
              <span>0 (REFERENS)</span>
              <span>+80 ([Al(OH)₄]⁻)</span>
              <span>+100</span>
            </div>
          </div>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                <div className="text-xl font-mono font-bold text-blue-400">{alPpmSlider} ppm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Signal:</div>
                <div className="text-xl font-mono font-bold text-blue-400 text-sm">
                  {currentAlSignal.notes !== "—" ? currentAlSignal.notes : "Signal yo'q"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Multiplicity:</div>
                <div className="text-xl font-mono font-bold text-blue-400">O'tkir singlet</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-96">
            <svg viewBox="0 0 600 340" className="w-full h-full overflow-visible" role="img" aria-label="27Al YaMR spektr">
              <title>²⁷Al YaMR spektr simulyatsiyasi — [Al(H₂O)₆]³⁺</title>
              {[-100, -50, 0, 50, 100].map((ppm, i) => {
                const x = 580 - ((ppm + 100) / 200) * 530
                return (
                  <g key={i}>
                    <line x1={x} y1="280" x2={x} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={x} y="295" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                  </g>
                )
              })}
              <text x="310" y="318" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="150" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 150)">Intensivlik</text>

              {/* [Al(H₂O)₆]³⁺ signali 0 ppm — ASOSIY SIGNAL (REFERENS) */}
              <line x1={580 - ((0 + 100) / 200) * 530} y1="280" x2={580 - ((0 + 100) / 200) * 530} y2="50" stroke="#3b82f6" strokeWidth="3" />
              <text x={580 - ((0 + 100) / 200) * 530} y="45" textAnchor="middle" fontSize="9" fill="#3b82f6" fontWeight="bold">
                [Al(H₂O)₆]³⁺ (REFERENS, 0 ppm)
              </text>

              {/* [Al(OH)₄]⁻ signali 80 ppm (ko'rsatish uchun) */}
              <line x1={580 - ((80 + 100) / 200) * 530} y1="280" x2={580 - ((80 + 100) / 200) * 530} y2="200" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x={580 - ((80 + 100) / 200) * 530} y="195" textAnchor="middle" fontSize="7" fill="#ef4444">[Al(OH)₄]⁻</text>

              {/* Slider pozitsiyasi */}
              <line
                x1={580 - ((alPpmSlider + 100) / 200) * 530}
                y1="280"
                x2={580 - ((alPpmSlider + 100) / 200) * 530}
                y2="20"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4,2"
              />

              <text x="310" y="335" textAnchor="middle" fontSize="8" fill="#a78bfa" fontStyle="italic">
                0 ppm — IUPAC referens. Barcha Al komplekslari shu ga nisbatan o'lchanadi.
              </text>
            </svg>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-3">
            <p className="text-blue-300 text-xs">
              <strong>📌 Muhim:</strong> [Al(H₂O)₆]³⁺ = 0 ppm (REFERENS). [Al(OH)₄]⁻ = 80 ppm (alyuminat).
              Gidroliz mahsulotlari 20-60 ppm da signallar beradi. Past pH da (pH &lt; 3) faqat 0 ppm signal ko'rinadi.
            </p>
          </div>
        </div>

        {/* TARIXIY KONTEKST */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📜</span> Tarixiy kontekst
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.werner.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Nobel:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.werner.nobel}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Akitt (1970-80)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.akitt.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.akitt.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.akitt.achievement}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Hargittai (2000)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.hargittai.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.hargittai.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.hargittai.contribution}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Zamonaviy davr (2000+)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olimlar:</span>
                  <span className="text-amber-400">{COMPOUND.history.modernEra.scientists}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.modernEra.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.modernEra.achievement}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span> Taqqoslash — boshqa akva komplekslar
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Kompleks</th>
                  <th className="py-3 px-3 text-teal-400">Metall</th>
                  <th className="py-3 px-3 text-teal-400">Geometriya</th>
                  <th className="py-3 px-3 text-teal-400">YaMR (ppm)</th>
                  <th className="py-3 px-3 text-teal-400">Suv almashinish</th>
                  <th className="py-3 px-3 text-teal-400">pKa</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparison.map((comp, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/30 ${i === 0 ? "bg-blue-900/20" : ""}`}>
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{comp.compound}</td>
                    <td className="py-3 px-3 text-xs">{comp.metal}</td>
                    <td className="py-3 px-3 text-xs">{comp.geometry}</td>
                    <td className="py-3 px-3 text-xs font-mono text-blue-400">{comp.nmrShift}</td>
                    <td className="py-3 px-3 text-xs">{comp.waterExchange}</td>
                    <td className="py-3 px-3 text-xs font-mono">{comp.pKa}</td>
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
                  activeLabStep === i ? "bg-blue-900/40 border-2 border-blue-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-blue-500/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeLabStep === i ? "bg-blue-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-blue-400 font-bold">{step.title}</p>
                  </div>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mt-2">
                      <div className="text-blue-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
                      <p className="text-purple-200 text-xs">{step.theoryNote}</p>
                    </div>
                    <div className="text-[10px] text-blue-400 mt-2">
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
                  <th className="py-3 px-3 text-blue-400">Manba</th>
                  <th className="py-3 px-3 text-blue-400">Ta'sir</th>
                  <th className="py-3 px-3 text-blue-400">Jiddiylik</th>
                  <th className="py-3 px-3 text-blue-400">Yechim</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.interferences.map((int, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${
                      activeInterference === i ? "bg-blue-900/20" : ""
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
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
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
                    ? "bg-blue-600/60 text-white border border-blue-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-blue-400 font-bold mb-3">{COMPOUND.advancedTechniques[activeTechnique].name}</h3>
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
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mt-3">
              <div className="text-blue-400 font-bold text-xs mb-1">Misollar:</div>
              <p className="text-purple-200 text-xs">{COMPOUND.advancedTechniques[activeTechnique].examples}</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-blue-400">²⁷Al YaMR REFERENS:</strong> [Al(H₂O)₆]³⁺ = 0 ppm (IUPAC standart)</li>
            <li><strong className="text-blue-400">d⁰ holat:</strong> Al³⁺ da d-elektronlar yo'q → kristall maydon nazariyasi ahamiyatsiz</li>
            <li><strong className="text-blue-400">Geometriya:</strong> Oktaedr (Oₕ), Al-O = 1.87-1.90 Å</li>
            <li><strong className="text-blue-400">Simmetriya (Oₕ):</strong> 48 ta simmetriya elementi, markaziy simmetriya, mutual exclusion</li>
            <li><strong className="text-blue-400">Labil almashinish:</strong> k_ex ≈ 1.4 × 10⁵ s⁻¹ (juda tez!), dissotsiativ mexanizm</li>
            <li><strong className="text-blue-400">Gidroliz:</strong> pH &gt; 4 da boshlanadi, pH 4-7 da polimerik turlar (Al₁₃)</li>
            <li><strong className="text-blue-400">¹H YaMR:</strong> 4.8 ppm (H₂O, deshielded +3.3 ppm, Al³⁺ effekti)</li>
            <li><strong className="text-blue-400">Kvadrupol:</strong> ²⁷Al (I=5/2), Oₕ simmetriyada CQ ≈ 0-1 MHz (kichik) → o'tkir signal</li>
            <li><strong className="text-blue-400">pKa:</strong> 5.0 (birinchi gidroliz), 9.3 (ikkinchi), 12 (uchinchi)</li>
            <li><strong className="text-blue-400">Taqqoslash:</strong> [Cr(H₂O)₆]³⁺ inert (k_ex ≈ 10⁻⁶ s⁻¹), [Al(H₂O)₆]³⁺ labil (10¹¹× tezroq)</li>
            <li><strong className="text-blue-400">Tarix:</strong> Werner (1893), Akitt (1970-80), Hargittai (2000)</li>
            <li><strong className="text-blue-400">Kengaytiruvchi:</strong> VT-NMR, ¹⁷O YaMR, EXAFS, neytron difraksiya, DFT</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Birikmalar katalogi</Link>
          <Link href="/ilmiy/tahlil/rentgen" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Rentgen difraksiyasi →</Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Al(H₂O)₆]³⁺ (Geksaakvaalyuminiy(III)) • YaMR spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Werner (1893), Akitt (1970-80), Hargittai (2000), Casey, Helm, Merbach, Cotton-Wilkinson, Miessler-Tarr</p>
        </div>
      </footer>
    </main>
  )
}