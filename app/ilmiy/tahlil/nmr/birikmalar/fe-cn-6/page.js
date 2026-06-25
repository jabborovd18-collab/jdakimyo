"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// [Fe(CN)₆]⁴⁻ — GEKSATSIANOFERRAT(II) YaMR (ILMIY BOYITILGAN)
// Manbalar: Macquer (1752), Scheele (1782), Gmelin (1822), Miessler-Tarr,
//           Cotton-Wilkinson, Greenwood-Earnshaw, SDBS ID: 35096
//  ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Fe(CN)<sub>6</sub>]<sup>4−</sup>",
  formulaPlain: "[Fe(CN)6]4-",
  iupac: "Geksatsianoferrat(II)",
  commonName: "Sariq qon tuzi (ferrosianid)",
  molarMass: 211.95,
  saltFormulaHTML: "K<sub>4</sub>[Fe(CN)<sub>6</sub>] · 3H<sub>2</sub>O",
  saltMolarMass: 422.39,
  casNumber: "13943-58-3",
  color: "sariq (yellow)",
  structure: "Oktaedr (Oₕ)",
  metalLigand: "Fe-C (CN⁻, uglerod orqali)",
  pointGroup: "Oₕ",
  electrolyteType: "4:1 elektrolit (K₄[Fe(CN)₆])",
  molarConductivity: "~540 S·cm²/mol (4:1)",
  //  ═══════════════════════════════════════════════════════════════
  // KRISTALL MAYDON NAZARIYASI
  //  ═══════════════════════════════════════════════════════════════
  crystalField: {
    metalIon: "Fe²⁺",
    electronConfig: "[Ar] 3d⁶",
    dElectrons: 6,
    spinState: "Past spinli (low-spin)",
    orbitalOccupancy: "t₂g⁶ eg⁰",
    unpairedElectrons: 0,
    magneticMoment: "0 BM (diamagnit)",
    crystalFieldSplitting: "Δo ≈ 32,800 cm⁻¹ (4.07 eV, 305 nm)",
    racahParameter: "B ≈ 460 cm⁻¹ (erkin ion B₀ = 1050 cm⁻¹)",
    nephelauxeticRatio: "β = B/B₀ ≈ 0.44 (juda kuchli kovalentlik)",
    pairingEnergy: "P ≈ 17,000 cm⁻¹",
    cFSE: "CFSE = -2.4 Δo + P ≈ -78,720 + 17,000 = -61,720 cm⁻¹",
    spectrochemicalSeries: "CN⁻ — eng kuchli maydon ligandi (I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < NO₂⁻ < CN⁻ ≈ CO)",
    whyLowSpin: "Δo (32,800) >> P (17,000) → past spinli, diamagnit",
    colorOrigin: "d-d o'tishlar Laporte-ta'qiqlangan (Oₕ markaziy simmetriya), kuchsiz. Asosiy yutilish — MLCT (~300 nm, UV)",
    chargeTransfer: "MLCT: Fe²⁺ → CN⁻ (UV, ~30,000 cm⁻¹), LMCT: CN⁻ → Fe²⁺ (UV, kuchli)",
    piBackbonding: "CN⁻ π-akseptor: Fe²⁺ (t₂g) → CN⁻ (π*) qayta bog'lanish (π-backbonding)"
  },
  //  ═══════════════════════════════════════════════════════════════
  // SIMMETRIYA
  //  ═══════════════════════════════════════════════════════════════
  symmetry: {
    pointGroup: "Oₕ",
    order: 48,
    symmetryElements: ["E", "8C₃", "6C₂", "6C₄", "3C₂(=C₄²)", "i", "6S₄", "8S₆", "3σₕ", "6σᵈ"],
    nmrEquivalence: "Oₕ simmetriyada barcha 6 ta CN⁻ ligand to'liq ekvivalent. Shuning uchun ¹³C YaMR da faqat 1 ta o'tkir singlet (177 ppm) kuzatiladi.",
    irActive: "T₁ᵤ (IR faol): ν(CN) ~2044 cm⁻¹, ν(Fe-C) ~405 cm⁻¹",
    ramanActive: "A₁g + Eg + T₂g (Raman faol): ν(CN) ~2135 cm⁻¹ (A₁g, simmetrik)",
    mutualExclusion: "Oₕ da markaziy simmetriya bor — IR va Raman ustma-ust tushmaydi (mutual exclusion principle)",
    selectionRules: "d-d o'tishlar Laporte ta'qiqlangan (g → g). Faqat vibronic coupling orqali kuchsiz ko'rinadi."
  },
  //  ═══════════════════════════════════════════════════════════════
  // YaMR NAZARIYASI — CHUQUR
  //  ═══════════════════════════════════════════════════════════════
  nmrTheory: {
    c13: {
      nucleus: "¹³C (I = 1/2, 1.1% tabiiy)",
      shift: "177 ppm (CN⁻)",
      whyThisShift: "CN⁻ ligand — Fe²⁺ ga C orqali bog'langan. ¹³C YaMR da CN⁻ signali odatda 100-200 ppm orasida. 177 ppm — o'rta deshielding (Fe²⁺ past oksidlanish darajasi, kuchli π-backbonding). Erkin KCN: ~168 ppm. [Fe(CN)₆]³⁻ (ferrisianid): ~110 ppm (Fe³⁺ yuqori oksidlanish → kuchliroq deshielding, lekin π-backbonding kamroq).",
      multiplicity: "Singlet (barcha 6 CN⁻ ekvivalent, Oₕ simmetriya)",
      linewidth: "~2-5 Hz (o'tkir, diamagnit)",
      t1Relaxation: "T₁ ≈ 10-30 s (CSA va dipol-dipol mexanizmlar)",
      couplingNotes: "¹³C-¹⁴N bog'lanish kuzatilishi mumkin (¹J(C-N) ≈ 10-20 Hz). ¹³C tabiiy tarqalishi 1.1% — ¹³C-¹³C bog'lanish ehtimoli juda past.",
      referencing: "Referens: TMS (tetrametilsilan, 0 ppm)"
    },
    n14: {
      nucleus: "¹⁴N (I = 1, 99.6% tabiiy)",
      shift: "~280 ppm (Fe-C≡N, N uchi)",
      whyThisShift: "¹⁴N — kvadrupol yadro (I = 1). Keng chiziqlar (~500-1000 Hz). Oₕ simmetriyada kvadrupol bog'lanish kichik, lekin relaksatsiya tez.",
      quadrupolar: "CQ ≈ 1-3 MHz (kichik, Oₕ simmetriyaga yaqin)",
      linewidth: "~500-1000 Hz (keng, kvadrupol)",
      t1Relaxation: "T₁ ≈ 0.1-1 ms (juda qisqa, kvadrupol mexanizm dominant)",
      detection: "Keng chiziqlar va kvadrupol tufayli sezgirlik past. Odatda to'g'ridan-to'g'ri ¹⁴N YaMR olinmaydi."
    },
    fe57: {
      nucleus: "⁵⁷Fe (I = 1/2, 2.12% tabiiy)",
      shift: "Keng diapazon (-5000 dan +5000 ppm)",
      whyThisShift: "⁵⁷Fe YaMR juda past sezgirlik (¹H dan 3×10⁻⁵ marta kam). Maxsus usullar kerak.",
      sensitivity: "Sezgirlik juda past — ¹H dan 33,000 marta kam",
      linewidth: "~50-200 Hz",
      t1Relaxation: "T₁ ≈ 0.1-1 s",
      detection: "Odatda to'g'ridan-to'g'ri ⁵⁷Fe YaMR olinmaydi. Ko'pincha Mössbauer spektroskopiya ishlatiladi.",
      applications: "Maxsus ilmiy tadqiqotlar uchun"
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY PARAMETRLAR
  //  ═══════════════════════════════════════════════════════════════
  structuralData: {
    bondLengths: {
      feC: "1.92-1.94 Å (Fe-C, o'rtacha 1.93 Å)",
      cn: "1.15-1.17 Å (C≡N, uch bog' xarakterli)",
      comparison: "Erkin CN⁻ da C≡N = 1.16 Å. [Fe(CN)₆]³⁻ da Fe-C = 1.89 Å (Fe³⁺ kichik radius), C≡N = 1.15 Å.",
      piBackbonding: "Kuchli π-backbonding: Fe²⁺ (t₂g) → CN⁻ (π*). Bu Fe-C bog'ni mustahkamlaydi, C≡N bog'ni biroz kuchsizlashtiradi."
    },
    bondAngles: {
      cFeC: "90° (cis), 180° (trans)",
      feCN: "180° (chiziqli)",
      comparison: "Ideal oktaedr — 90° va 180°"
    },
    piBackbonding: {
      description: "Fe²⁺ (t₂g⁶) → CN⁻ (π*) qayta bog'lanish",
      effect: "Fe-C bog' kuchli (qo'sh bog' xarakteri), C≡N bog' biroz kuchsiz (1.16 Å o'rniga 1.17 Å)",
      evidence: "ν(CN) IR da 2044 cm⁻¹ (erkin CN⁻: 2080 cm⁻¹ — pastroq chastota = kuchsizroq bog')"
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // TERMODINAMIK VA KINETIK PARAMETRLAR
  //  ═══════════════════════════════════════════════════════════════
  thermodynamics: {
    stability: {
      logBeta6: "β₆ ≈ 10³⁵ (juda barqaror kompleks)",
      stepwise: "K₁ ≈ 10⁶, K₂ ≈ 10⁶, K₃ ≈ 10⁵, K₄ ≈ 10⁵, K₅ ≈ 10⁴, K₆ ≈ 10³",
      reason: "Kuchli maydon ligandi (CN⁻), π-backbonding, xelat effekti (garchi monodentat bo'lsa ham)",
      comparison: "[Fe(CN)₆]³⁻: β₆ ≈ 10⁴² (yanada barqaror, Fe³⁺ kichik radius)"
    },
    inertness: {
      why: "Fe²⁺ d⁶ past spinli — katta CFSE (-61,720 cm⁻¹), inert (sekin ligand almashinish)",
      comparison: "Fe²⁺ (yuqori spinli, [Fe(H₂O)₆]²⁺) — labil, [Fe(CN)₆]⁴⁻ — inert",
      waterExchange: "k_ex ≈ 10⁻⁷ s⁻¹ (juda sekin)",
      toxicity: "CN⁻ ligand mustahkam bog'langan — HCN ajralmaydi (zaif kislota qo'shilmasa)"
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // YaMR SIGNAL JADVALI
  //  ═══════════════════════════════════════════════════════════════
  nmrSignals: [
    {
      nucleus: "¹³C",
      ligand: "CN⁻ (barcha 6 ta)",
      shift: 177,
      multiplicity: "singlet",
      jCoupling: "—",
      integration: "6C",
      notes: "Barcha 6 ta CN⁻ ligand Oₕ simmetriyada to'liq ekvivalent. Erkin KCN: 168 ppm. [Fe(CN)₆]³⁻: ~110 ppm."
    },
    {
      nucleus: "¹⁴N",
      ligand: "CN⁻ (N uchi)",
      shift: 280,
      multiplicity: "keng singlet",
      jCoupling: "—",
      integration: "6N",
      notes: "¹⁴N (I=1) kvadrupol yadro. Keng chiziq (~500-1000 Hz). Odatda ¹³C YaMR ko'proq ishlatiladi."
    },
    {
      nucleus: "⁵⁷Fe",
      ligand: "Fe markaz",
      shift: -1200,
      multiplicity: "singlet",
      jCoupling: "—",
      integration: "1Fe",
      notes: "⁵⁷Fe YaMR juda past sezgirlik. Odatda to'g'ridan-to'g'ri olinmaydi. Mössbauer ko'proq qo'llaniladi."
    }
  ],
  //  ═══════════════════════════════════════════════════════════════
  // YaMR SPEKTR MA'LUMOTLARI (simulyatsiya uchun)
  //  ═══════════════════════════════════════════════════════════════
  nmrSpectrum: [
    { ppm: 0, intensity: 0, notes: "TMS referens" },
    { ppm: 50, intensity: 0, notes: "—" },
    { ppm: 100, intensity: 0, notes: "—" },
    { ppm: 177, intensity: 1.0, notes: "¹³C: CN⁻ (singlet, 6C)" },
    { ppm: 200, intensity: 0, notes: "—" },
    { ppm: 250, intensity: 0, notes: "—" }
  ],
  //  ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH — BOSHQA KOMPLEKSLAR
  //  ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      compound: "[Fe(CN)₆]⁴⁻",
      metal: "Fe²⁺ (d⁶)",
      color: "Sariq",
      nmrShift: "¹³C: 177 ppm",
      spinState: "Past spinli, diamagnit",
      logBeta: "β₆ ≈ 10³⁵"
    },
    {
      compound: "[Fe(CN)₆]³⁻",
      metal: "Fe³⁺ (d⁵)",
      color: "Qizil",
      nmrShift: "¹³C: ~110 ppm",
      spinState: "Past spinli, paramagnit (1 ta toq e⁻)",
      logBeta: "β₆ ≈ 10⁴²"
    },
    {
      compound: "[Co(CN)₆]³⁻",
      metal: "Co³⁺ (d⁶)",
      color: "Rangsiz",
      nmrShift: "¹³C: ~150 ppm",
      spinState: "Past spinli, diamagnit",
      logBeta: "β₆ ≈ 10⁵⁷"
    },
    {
      compound: "[Ru(CN)₆]⁴⁻",
      metal: "Ru²⁺ (d⁶)",
      color: "Sariq",
      nmrShift: "¹³C: ~180 ppm",
      spinState: "Past spinli, diamagnit",
      logBeta: "β₆ ≈ 10⁴⁰"
    },
    {
      compound: "Fe₄[Fe(CN)₆]₃",
      metal: "Fe²⁺ + Fe³⁺",
      color: "Ko'k (Berlin ko'ki)",
      nmrShift: "Murakkab",
      spinState: "Aralash",
      logBeta: "—"
    }
  ],
  //  ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  //  ═══════════════════════════════════════════════════════════════
  history: {
    macquer: {
      year: 1752,
      scientist: "Pierre Joseph Macquer (Fransiya)",
      achievement: "Sariq qon tuzini birinchi marta sintez qildi",
      method: "Qon va temir parchalarini ishqor bilan qaynatish",
      significance: "Koordinatsion kimyo tarixidagi eng qadimgi kompleks birikmalardan biri"
    },
    scheele: {
      year: 1782,
      scientist: "Carl Wilhelm Scheele (Shvetsiya)",
      achievement: "Ferrosianiddan vodorod sianid (HCN) ni ajratib oldi",
      method: "K₄[Fe(CN)₆] + H₂SO₄ → HCN + FeSO₄ + K₂SO₄",
      significance: "HCN kashfiyoti — sianidlar kimyosining boshlanishi"
    },
    gmelin: {
      year: 1822,
      scientist: "Leopold Gmelin (Germaniya)",
      achievement: "'Prussiate of potash' deb nomladi",
      contribution: "Tizimli tavsiflash va nomlash",
      theory: "Formulasi aniqlandi: K₄[Fe(CN)₆]"
    },
    werner: {
      year: 1893,
      scientist: "Alfred Werner (Shveytsariya)",
      achievement: "Koordinatsion nazariya bilan tushuntirdi",
      contribution: "Fe²⁺ markaziy atom, 6 ta CN⁻ ligand, oktaedr geometriya",
      nobel: "Nobel mukofoti (1913)"
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // UV-Vis va SPEKTRAL XUSUSIYATLAR
  //  ═══════════════════════════════════════════════════════════════
  uvVis: {
    ddTransitions: [
      { band: "¹A₁g → ¹T₁g", energy: "32,800 cm⁻¹ (305 nm)", epsilon: "ε ≈ 10 (kuchsiz, Laporte ta'qiqlangan)", color: "UV" },
      { band: "¹A₁g → ¹T₂g", energy: "40,000 cm⁻¹ (250 nm)", epsilon: "ε ≈ 5 (juda kuchsiz)", color: "UV" }
    ],
    ctBands: [
      { band: "MLCT: Fe²⁺ → CN⁻ (π*)", energy: "~33,000 cm⁻¹ (303 nm)", epsilon: "ε ≈ 1000", color: "UV" },
      { band: "LMCT: CN⁻ → Fe²⁺", energy: "~40,000 cm⁻¹ (250 nm)", epsilon: "ε ≈ 3000", color: "UV" }
    ],
    whyYellow: "d-d o'tishlar Laporte ta'qiqlangan va kuchsiz. Asosiy yutilish UV da. Sariq rang — kuchsiz qizil-ko'k yutilish natijasi."
  },
  //  ═══════════════════════════════════════════════════════════════
  // QO'LLANILISHI
  //  ═══════════════════════════════════════════════════════════════
  applications: [
    {
      field: "Oziq-ovqat sanoati",
      use: "E536 — tuz qotiruvchi agent (antikaking)",
      safety: "GRAS (umumiy xavfsiz), CN⁻ ligand mustahkam bog'langan",
      dose: "≤ 20 mg/kg kunlik"
    },
    {
      field: "Analitik kimyo",
      use: "Fe³⁺ aniqlash (Berlin ko'ki hosil bo'ladi)",
      reaction: "4 Fe³⁺ + 3 [Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃↓ (ko'k)",
      significance: "Temir ionlari uchun klassik test"
    },
    {
      field: "Metallurgiya",
      use: "Sianidlash jarayoni (temir qoplash)",
      mechanism: "Elektrokimyoviy qoplash",
      advantage: "Bir tekis va mustahkam qoplama"
    },
    {
      field: "Fotografiya",
      use: "Intensifikator (fotografik jarayonlar)",
      mechanism: "Kumush halidlarini qayta ishlash",
      note: "Zamonaviy fotografiya kam ishlatadi"
    },
    {
      field: "Materialshunoslik",
      use: "Prussian blue analoglari (PBAs)",
      application: "Batareyalar, vodorod saqlash, kataliz",
      modern: "2020-yillarda qayta qiziqish"
    }
  ],
  //  ═══════════════════════════════════════════════════════════════
  // HALAQIT BERUVCHI OMILLAR
  //  ═══════════════════════════════════════════════════════════════
  interferences: [
    {
      source: "[Fe(CN)₆]³⁻ aralashmasi (ferrisianid)",
      effect: "¹³C YaMR da ~110 ppm da qo'shimcha signal (ferrosianid dan 67 ppm farq)",
      severity: "Yuqori",
      solution: "Sof K₄[Fe(CN)₆] ishlatish. Havo ta'sirida oksidlanishning oldini olish.",
      theoryNote: "[Fe(CN)₆]³⁻ da Fe³⁺ yuqori oksidlanish → kuchliroq deshielding (110 ppm). Havo ta'sirida ferrosianid sekin ferrisianidga oksidlanadi: 4 [Fe(CN)₆]⁴⁻ + O₂ + 2 H₂O → 4 [Fe(CN)₆]³⁻ + 4 OH⁻"
    },
    {
      source: "¹³C past tabiiy tarqalishi (1.1%)",
      effect: "Sezgirlik past, ko'p skan kerak",
      severity: "O'rta",
      solution: "1000-5000 skan, yuqori konsentratsiya (50-100 mg/0.6 mL). ¹³C boyitish (ixtiyoriy).",
      theoryNote: "¹³C tabiiy tarqalishi 1.1% — ¹H (100%) dan 90 marta past. Sezgirlik ¹H dan 5700 marta past (γ nisbati)."
    },
    {
      source: "Erituvchi cho'qqilari",
      effect: "D₂O da HOD signal 4.7 ppm da (¹H YaMR), lekin ¹³C YaMR da erituvchi signallari boshqa diapazonda",
      severity: "Past",
      solution: "D₂O, DMSO-d₆ yoki CD₃OD erituvchilari mos keladi.",
      theoryNote: "¹³C YaMR da erituvchi signallari: DMSO-d₆ (39.5 ppm), CDCl₃ (77 ppm), D₂O (—). [Fe(CN)₆]⁴⁻ ning 177 ppm signali bu erituvchilardan uzoq."
    },
    {
      source: "Paramagnit aralashmalar",
      effect: "Signallarni kengaytiradi va siljitadi",
      severity: "O'rta",
      solution: "Sof namuna ishlatish. Paramagnit aralashmalardan (Fe³⁺, Cu²⁺) saqlash.",
      theoryNote: "Paramagnit aralashmalar signallarni kengaytiradi (1/r⁶ bog'liq). [Fe(CN)₆]⁴⁻ o'zi diamagnit, shuning uchun sof namuna ishlatilganda o'tkir signallar kuzatiladi."
    },
    {
      source: "Kislota ta'siri (HCN ajralishi)",
      effect: "Kuchli kislota qo'shilsa: [Fe(CN)₆]⁴⁻ + 6 H⁺ → Fe²⁺ + 6 HCN↑ (zaharli gaz!)",
      severity: "Juda yuqori (xavfsizlik)",
      solution: "Kislota qo'shmang! Neytral yoki asosli muhitda saqlang.",
      theoryNote: "CN⁻ ligand kuchli asos (pKa(HCN) = 9.2). Kuchli kislota qo'shilsa HCN gazi ajraladi — zaharli! Faqat neytral yoki asosli erituvchilarda YaMR oling."
    }
  ],
  //  ═══════════════════════════════════════════════════════════════
  // LABORATORIYA TARTIBI
  //  ═══════════════════════════════════════════════════════════════
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak, labor xalat. [Fe(CN)₆]⁴⁻ o'zi xavfsiz, lekin kislota qo'shilsa HCN gazi ajraladi! Hech qanday kislota bilan ishlatmang.",
      time: "15 daq",
      theoryNote: "K₄[Fe(CN)₆] o'zi GRAS (umumiy xavfsiz), chunki CN⁻ ligand mustahkam bog'langan. Lekin kuchli kislota qo'shilsa HCN ajraladi — bu zaharli!"
    },
    {
      step: 2,
      title: "Sof K₄[Fe(CN)₆]·3H₂O ni tayyorlash",
      desc: "Sof sariq qon tuzini oling (tijoratda mavjud). Havo ta'siridan saqlang (oksidlanib [Fe(CN)₆]³⁻ hosil bo'lishi mumkin).",
      time: "Tayyor",
      theoryNote: "K₄[Fe(CN)₆]·3H₂O — sariq kristall. Havo ta'sirida sekin oksidlanadi: 4 [Fe(CN)₆]⁴⁻ + O₂ + 2 H₂O → 4 [Fe(CN)₆]³⁻ + 4 OH⁻."
    },
    {
      step: 3,
      title: "YaMR spektrometrni tayyorlash",
      desc: "YaMR spektrometrni yoqish, 30 daq stabillash. Shimlash (shimming) qilish. D₂O yoki DMSO-d₆ erituvchi.",
      time: "30 daq",
      theoryNote: "Shimlash — magnit maydonining bir xilligini ta'minlash. Yaxshi shimlash — o'tkir signallar. D₂O yoki DMSO-d₆ eng mos erituvchilar."
    },
    {
      step: 4,
      title: "Namuna tayyorlash",
      desc: "50-100 mg K₄[Fe(CN)₆]·3H₂O ni 0.6 mL D₂O da eritish. YaMR naychaga solish.",
      time: "10 daq",
      theoryNote: "¹³C YaMR uchun yuqori konsentratsiya kerak (1.1% tabiiy tarqalish). 50-100 mg/0.6 mL tavsiya etiladi."
    },
    {
      step: 5,
      title: "¹³C YaMR spektrini olish",
      desc: "¹³C YaMR spektrini olish (1000-5000 skan). CN⁻ signalini tekshirish (177 ppm, singlet).",
      time: "15-60 daq",
      theoryNote: "¹³C YaMR da CN⁻ signali 177 ppm da (singlet, 6C). Barcha 6 ta CN⁻ ligand Oₕ simmetriyada to'liq ekvivalent."
    },
    {
      step: 6,
      title: "Natijani tekshirish",
      desc: "177 ppm da o'tkir singlet bormi? Agar [Fe(CN)₆]³⁻ aralashmasi bo'lsa, 110 ppm da qo'shimcha signal ko'rinadi.",
      time: "5 daq",
      theoryNote: "177 ppm — [Fe(CN)₆]⁴⁻. 110 ppm — [Fe(CN)₆]³⁻ (aralashma bo'lsa). Toza namuna uchun faqat 177 ppm signal ko'rinadi."
    }
  ],
  //  ═══════════════════════════════════════════════════════════════
  // KENGAYTIRUVCHI METODLAR
  //  ═══════════════════════════════════════════════════════════════
  advancedTechniques: [
    {
      name: "Mössbauer spektroskopiya (⁵⁷Fe)",
      description: "Temir yadrolarining energiya darajalarini o'lchash",
      advantages: ["Oksidlanish darajasi aniq", "Spin holati aniqlanadi", "Simmetriya haqida ma'lumot"],
      disadvantages: ["⁵⁷Fe boyitish kerak", "Maxsus uskuna", "Faqat Fe uchun"],
      bestFor: "Fe²⁺/Fe³⁺ farqlash, spin holati aniqlash",
      examples: "[Fe(CN)₆]⁴⁻: δ ≈ -0.1 mm/s, ΔEQ ≈ 0 mm/s (Oₕ simmetriya)"
    },
    {
      name: "FTIR va Raman spektroskopiya",
      description: "ν(CN) va ν(Fe-C) tebranishlarini o'lchash",
      advantages: ["Tez va oson", "Bog' kuchi haqida ma'lumot", "π-backbonding baholash"],
      disadvantages: ["Faqat tebranishlar", "Kvant ma'lumot yo'q"],
      bestFor: "CN⁻ bog' kuchi, π-backbonding, simmetriya aniqlash",
      examples: "FTIR: ν(CN) ≈ 2044 cm⁻¹ (T₁ᵤ), Raman: ν(CN) ≈ 2135 cm⁻¹ (A₁g)"
    },
    {
      name: "UV-Vis spektroskopiya",
      description: "Elektron o'tishlarni o'lchash (d-d va CT)",
      advantages: ["Δo aniqlash", "Kuchli maydon ligandi tasdiqlash", "Tez"],
      disadvantages: ["d-d o'tishlar kuchsiz (Laporte ta'qiqlangan)", "Murakkab interpretatsiya"],
      bestFor: "Δo o'lchash, rang tushuntirish",
      examples: "UV: MLCT ~303 nm (ε ≈ 1000), d-d: Laporte ta'qiqlangan"
    },
    {
      name: "Elektrokimyo (CV)",
      description: "[Fe(CN)₆]⁴⁻/³⁻ juftini o'rganish",
      advantages: ["Redoks xususiyatlari", "Qaytarlik darajasi", "Kinetika"],
      disadvantages: ["Elektrod kerak", "Erituvchi ta'siri"],
      bestFor: "Redoks potentsialini o'lchash, elektrokimyoviy xususiyatlar",
      examples: "[Fe(CN)₆]³⁻/⁴⁻: E° ≈ +0.36 V (SHE ga nisbatan), qaytar juft"
    },
    {
      name: "X-ray kristallografiya (SCXRD)",
      description: "Kristall strukturasini aniq aniqlash",
      advantages: ["Aniq bog' uzunliklari", "Simmetriya", "3D struktura"],
      disadvantages: ["Kristall kerak", "Qimmat uskunalar", "Uzoq vaqt"],
      bestFor: "Strukturaviy parametrlar, bog' uzunliklari",
      examples: "Fe-C = 1.93 Å, C≡N = 1.16 Å, Oₕ simmetriya"
    },
    {
      name: "2D YaMR (HMBC, HSQC)",
      description: "Ko'p o'lchovli YaMR orqali bog'lanishlarni aniqlash",
      advantages: ["¹³C-¹⁴N bog'lanish", "Strukturaviy aniqlik", "Aralashmalar tahlili"],
      disadvantages: ["Uzoq vaqt", "Yuqori konsentratsiya", "Murakkab tahlil"],
      bestFor: "Strukturaviy aniqlik, bog'lanishlar tahlili",
      examples: "HMBC — ¹³C-¹⁴N uzoq masofali korrelyatsiya"
    }
  ]
}

export default function FeCN6Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [ppmSlider, setPpmSlider] = useState(177)
  const [activeNmrNucleus, setActiveNmrNucleus] = useState("c13")

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
              <span className="text-3xl">🧲</span> [Fe(CN)₆]⁴⁻ — GEKSATSIANOFERRAT(II) YaMR!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-yellow-300">[Fe(CN)₆]⁴⁻</strong> — sariq qon tuzi, eng kuchli maydon ligandi (CN⁻) bilan kompleks.
              Kristall maydon nazariyasi, YaMR, π-backbonding, tarixiy kontekst!
            </p>
            <div className="bg-yellow-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-yellow-400 font-bold mb-2">🧲 YaMR signallar:</div>
                  <div className="text-purple-200">
                    <strong>¹³C:</strong> 177 ppm (CN⁻, singlet)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹⁴N:</strong> ~280 ppm (keng, kvadrupol)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>⁵⁷Fe:</strong> past sezgirlik
                  </div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold mb-2">🔬 Asosiy xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Kristall maydon:</strong> d⁶ past spinli
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Simmetriya:</strong> Oₕ (48 tartib)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>π-backbonding:</strong> Fe²⁺ → CN⁻
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-yellow-300">Knowledge Base:</strong> Macquer (1752), Scheele (1782), Gmelin (1822), Werner (1893),
                Miessler-Tarr, Cotton-Wilkinson, Greenwood-Earnshaw, SDBS ID: 35096
              </p>
            </div>
            <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-200">
                <strong className="text-yellow-300">⚠️ XAVFSIZLIK:</strong> K₄[Fe(CN)₆] o'zi xavfsiz (GRAS), lekin kuchli kislota qo'shilsa HCN gazi ajraladi — ZAHARLI!
                Hech qanday kislota bilan ishlatmang!
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
              <span className="text-yellow-400 font-semibold">[Fe(CN)₆]⁴⁻</span>
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
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Diamagnit Kompleks</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Kuchli maydon (CN⁻)</span>
                  <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Oₕ Simmetriya</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">π-backbonding</span>
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
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Diamagnit Kompleks</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Macquer (1752)</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Oₕ Simmetriya</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">π-backbonding</span>
          </div>
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              [Fe(CN)₆]⁴⁻
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>
          <p className="text-purple-300 text-lg mb-4">
            Geksatsianoferrat(II) — <span className="text-yellow-400 italic">&quot;Sariq qon tuzi, kuchli maydon ligandi, π-backbonding&quot;</span>
          </p>
          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">YaMR spektroskopiya</strong> yordamida <strong className="text-yellow-400">eng kuchli maydon ligandi</strong> (CN⁻) bilan kompleksni o&apos;rganish.
            Fe²⁺ past spinli (d⁶, t₂g⁶ eg⁰), diamagnit. Oₕ simmetriya — barcha 6 ta CN⁻ ekvivalent.
            <strong className="text-yellow-400"> ¹³C YaMR: 177 ppm (singlet, 6C)</strong>.
            Kuchli π-backbonding (Fe²⁺ → CN⁻). β₆ ≈ 10³⁵ (juda barqaror).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Fe²⁺ (d⁶)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Magnit</div>
              <div className="text-white font-bold">Diamagnit</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">Oₕ (48)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit</div>
              <div className="text-white font-bold">4:1</div>
            </div>
          </div>
        </div>

        {/* KRISTALL MAYDON NAZARIYASI */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔬</span> Kristall maydon nazariyasi (Crystal Field Theory)
          </h2>
          <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>Nima uchun bu kompleks diamagnit?</strong> Fe²⁺ — d⁶ elektron konfiguratsiya. CN⁻ — <em>eng kuchli</em> maydon ligandi.
              Δ<sub>o</sub> (32,800 cm⁻¹) &gt;&gt; P (juftlanish energiyasi, 17,000 cm⁻¹) → past spinli (low-spin), barcha elektronlar juftlangan → diamagnit.
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
            <p className="text-purple-200 text-sm mb-2">
              <strong>Rang sababi:</strong> {COMPOUND.crystalField.colorOrigin}
            </p>
            <p className="text-purple-200 text-sm">
              <strong>π-backbonding:</strong> {COMPOUND.crystalField.piBackbonding}
            </p>
          </div>

          {/* d-orbital splitting diagram */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <h4 className="text-blue-400 font-bold mb-3">d-orbital bo'linish diagrammasi</h4>
            <svg viewBox="0 0 600 200" className="w-full h-48" role="img" aria-label="d-orbital splitting">
              <title>d-orbital bo'linish diagrammasi — Fe²⁺ past spinli</title>
              <line x1="50" y1="180" x2="50" y2="20" stroke="#a78bfa" strokeWidth="1" />
              <text x="30" y="100" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 30, 100)">Energiya</text>
              <line x1="40" y1="100" x2="560" y2="100" stroke="#6b21a8" strokeWidth="1" strokeDasharray="4,2" />
              <text x="570" y="103" fontSize="8" fill="#6b21a8">Barycenter</text>
              <line x1="350" y1="60" x2="450" y2="60" stroke="#eab308" strokeWidth="3" />
              <text x="400" y="50" textAnchor="middle" fontSize="10" fill="#eab308" fontWeight="bold">e<sub>g</sub></text>
              <text x="400" y="75" textAnchor="middle" fontSize="8" fill="#eab308">d<sub>x²-y²</sub>, d<sub>z²</sub></text>
              <text x="480" y="63" fontSize="8" fill="#eab308">+0.6Δ<sub>o</sub></text>
              <line x1="150" y1="140" x2="250" y2="140" stroke="#22c55e" strokeWidth="3" />
              <text x="200" y="130" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="bold">t<sub>2g</sub></text>
              <text x="200" y="155" textAnchor="middle" fontSize="8" fill="#22c55e">d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub></text>
              <text x="120" y="143" fontSize="8" fill="#22c55e">-0.4Δ<sub>o</sub></text>
              {[160, 180, 200, 220, 240, 260].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy="140" r="4" fill="#22c55e" />
                  <text x={x} y="135" textAnchor="middle" fontSize="6" fill="#22c55e">↑↓</text>
                </g>
              ))}
              <line x1="500" y1="60" x2="500" y2="140" stroke="#fbbf24" strokeWidth="2" />
              <line x1="495" y1="60" x2="505" y2="60" stroke="#fbbf24" strokeWidth="2" />
              <line x1="495" y1="140" x2="505" y2="140" stroke="#fbbf24" strokeWidth="2" />
              <text x="515" y="103" fontSize="10" fill="#fbbf24" fontWeight="bold">Δ<sub>o</sub></text>
            </svg>
          </div>
        </div>

        {/* SIMMETRIYA */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📐</span> Simmetriya va spektral tanlash qoidalari
          </h2>
          <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-sm">
              <strong>Oₕ nuqtaviy guruhi:</strong> [Fe(CN)₆]⁴⁻ ideal oktaedr geometriyada. Oₕ — eng yuqori simmetriya guruhlaridan biri (tartib 48).
              Barcha 6 ta CN⁻ ligand to'liq ekvivalent → YaMR da faqat bitta signal.
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
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">IR faol:</span>
                  <span className="text-purple-400 font-mono text-xs">{COMPOUND.symmetry.irActive}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Raman faol:</span>
                  <span className="text-purple-400 font-mono text-xs">{COMPOUND.symmetry.ramanActive}</span>
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
          <div className="bg-purple-900/30 rounded-lg p-4">
            <h4 className="text-purple-400 font-bold mb-2">Tanlash qoidalari (Selection rules)</h4>
            <p className="text-purple-200 text-sm">
              {COMPOUND.symmetry.selectionRules}
            </p>
          </div>
        </div>

        {/* YaMR NAZARIYASI */}
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

          <div className="flex flex-wrap gap-2 mb-6">
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
              onClick={() => setActiveNmrNucleus("n14")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "n14"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹⁴N (I=1)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("fe57")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "fe57"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ⁵⁷Fe (I=1/2)
            </button>
          </div>

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
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.c13.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.c13.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun 177 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.c13.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Spin-spin bog'lanish:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.c13.couplingNotes}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Referens:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.c13.referencing}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "n14" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.n14.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n14.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n14.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n14.t1Relaxation}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Kvadrupol:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n14.quadrupolar}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun ~280 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.n14.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Aniqlash:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.n14.detection}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "fe57" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.fe57.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.fe57.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Sezgirlik:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.fe57.sensitivity}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.fe57.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.fe57.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Aniqlash:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.fe57.detection}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Qo'llanilishi:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.fe57.applications}</p>
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
                  <span className="text-purple-400">Fe-C:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.feC}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">C≡N:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.cn}</span>
                </div>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog' burchaklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">C-Fe-C (cis/trans):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.cFeC}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Fe-C≡N:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondAngles.feCN}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-2">π-backbonding</h4>
            <p className="text-green-300 text-sm mb-2">
              <strong>Ta'rif:</strong> {COMPOUND.structuralData.piBackbonding.description}
            </p>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Ta'sir:</strong> {COMPOUND.structuralData.piBackbonding.effect}
            </p>
            <p className="text-purple-200 text-sm">
              <strong>Dalil (IR):</strong> {COMPOUND.structuralData.piBackbonding.evidence}
            </p>
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
          <h2 className="text-xl font-bold text-white">📈 Interaktiv ¹³C YaMR spektr simulyatsiyasi</h2>
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
              max="250"
              step="1"
              value={ppmSlider}
              onChange={(e) => setPpmSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>0 ppm (TMS)</span>
              <span>177 ppm (CN⁻)</span>
              <span>250 ppm</span>
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
                  {ppmSlider === 177 ? "¹³C: CN⁻ (singlet, 6C)" : "Signal yo'q"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ligand:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">
                  {ppmSlider === 177 ? "CN⁻ (barcha 6 ta ekvivalent)" : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="YaMR spektr">
              <title>¹³C YaMR spektr simulyatsiyasi — [Fe(CN)₆]⁴⁻</title>
              {[0, 50, 100, 150, 200, 250].map((ppm, i) => (
                <g key={i}>
                  <line x1={580 - ((ppm/250)*530)} y1="220" x2={580 - ((ppm/250)*530)} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x={580 - ((ppm/250)*530)} y="235" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik</text>
              <line
                x1={580 - ((177/250)*530)}
                y1="220"
                x2={580 - ((177/250)*530)}
                y2="40"
                stroke="#eab308"
                strokeWidth="3"
              />
              <text x={580 - ((177/250)*530)} y="35" textAnchor="middle" fontSize="9" fill="#eab308" fontWeight="bold">
                177 ppm (CN⁻, singlet, 6C)
              </text>
              <line x1="580" y1="220" x2="580" y2="180" stroke="#fbbf24" strokeWidth="2" />
              <text x="580" y="175" textAnchor="middle" fontSize="8" fill="#fbbf24">TMS</text>
              <line
                x1={580 - ((ppmSlider/250)*530)}
                y1="220"
                x2={580 - ((ppmSlider/250)*530)}
                y2="20"
                stroke="#22c55e"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
            </svg>
          </div>
        </div>

        {/* UV-Vis */}
        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🌈</span> UV-Vis va spektral xususiyatlar
          </h2>
          <div className="bg-indigo-900/30 rounded-lg p-4 mb-6">
            <p className="text-indigo-300 text-sm">
              <strong>Nima uchun sariq?</strong> d-d o'tishlar Laporte ta'qiqlangan (g → g, Oₕ simmetriya) — juda kuchsiz.
              Asosiy yutilish UV diapazonida (MLCT va LMCT). Sariq rang — ko'rinadigan diapazonda kuchsiz yutilish natijasi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-5">
              <h3 className="text-indigo-400 font-bold mb-3">d-d o'tishlar (kuchsiz)</h3>
              <div className="space-y-2 text-sm">
                {COMPOUND.uvVis.ddTransitions.map((band, i) => (
                  <div key={i} className="bg-purple-900/50 rounded-lg p-3">
                    <div className="text-purple-400 text-xs">{band.band}</div>
                    <div className="text-white font-mono text-sm">{band.energy}</div>
                    <div className="text-yellow-400 text-xs">{band.epsilon}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-5">
              <h3 className="text-indigo-400 font-bold mb-3">Charge transfer (kuchli)</h3>
              <div className="space-y-2 text-sm">
                {COMPOUND.uvVis.ctBands.map((band, i) => (
                  <div key={i} className="bg-purple-900/50 rounded-lg p-3">
                    <div className="text-purple-400 text-xs">{band.band}</div>
                    <div className="text-white font-mono text-sm">{band.energy}</div>
                    <div className="text-yellow-400 text-xs">{band.epsilon}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-indigo-900/30 rounded-lg p-4">
            <p className="text-indigo-300 text-sm">
              <strong>Nima uchun sariq?</strong> {COMPOUND.uvVis.whyYellow}
            </p>
          </div>
        </div>

        {/* QO'LLANILISHI */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🏭</span> Qo'llanilishi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.applications.map((app, i) => (
              <div key={i} className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
                <h3 className="text-amber-400 font-bold mb-3">{app.field}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between flex-col">
                    <span className="text-purple-400">Qo'llanish:</span>
                    <span className="text-amber-400 text-xs">{app.use}</span>
                  </div>
                  {app.safety && (
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Xavfsizlik:</span>
                      <span className="text-green-400 text-xs">{app.safety}</span>
                    </div>
                  )}
                  {app.dose && (
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Doza:</span>
                      <span className="text-amber-400 text-xs">{app.dose}</span>
                    </div>
                  )}
                  {app.reaction && (
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Reaksiya:</span>
                      <span className="text-amber-400 text-xs font-mono">{app.reaction}</span>
                    </div>
                  )}
                  {app.significance && (
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Ahamiyati:</span>
                      <span className="text-amber-400 text-xs">{app.significance}</span>
                    </div>
                  )}
                  {app.mechanism && (
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Mexanizm:</span>
                      <span className="text-amber-400 text-xs">{app.mechanism}</span>
                    </div>
                  )}
                  {app.modern && (
                    <div className="flex justify-between flex-col">
                      <span className="text-purple-400">Zamonaviy:</span>
                      <span className="text-amber-400 text-xs">{app.modern}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TARIXIY KONTEKST */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📜</span> Tarixiy kontekst
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Macquer (1752)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.macquer.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.macquer.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.macquer.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Usul:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.macquer.method}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Scheele (1782)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.scheele.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.scheele.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.scheele.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Reaksiya:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.scheele.method}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Gmelin (1822)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.gmelin.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.gmelin.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.gmelin.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.gmelin.contribution}</span>
                </div>
              </div>
            </div>
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
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.werner.contribution}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span> Taqqoslash — boshqa komplekslar
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Kompleks</th>
                  <th className="py-3 px-3 text-teal-400">Metall</th>
                  <th className="py-3 px-3 text-teal-400">Rang</th>
                  <th className="py-3 px-3 text-teal-400">YaMR siljish</th>
                  <th className="py-3 px-3 text-teal-400">Spin holati</th>
                  <th className="py-3 px-3 text-teal-400">β₆ (barqarorlik)</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparison.map((comp, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/30">
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{comp.compound}</td>
                    <td className="py-3 px-3 text-xs">{comp.metal}</td>
                    <td className="py-3 px-3 text-xs">{comp.color}</td>
                    <td className="py-3 px-3 text-xs font-mono text-yellow-400">{comp.nmrShift}</td>
                    <td className="py-3 px-3 text-xs">{comp.spinState}</td>
                    <td className="py-3 px-3 text-xs font-mono">{comp.logBeta}</td>
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
                  <th className="py-3 px-3 text-yellow-400">Ta'sir</th>
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
                        int.severity === "Juda yuqori (xavfsizlik)" ? "bg-red-800/30 text-red-300" :
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
            <li><strong className="text-yellow-400">Kristall maydon nazariyasi:</strong> Fe²⁺ (d⁶), past spinli (t₂g⁶ eg⁰), diamagnit, Δ<sub>o</sub> ≈ 32,800 cm⁻¹</li>
            <li><strong className="text-yellow-400">Simmetriya (Oₕ):</strong> Eng yuqori simmetriya guruhlaridan biri (tartib 48)</li>
            <li><strong className="text-yellow-400">Kuchli maydon ligandi:</strong> CN⁻ spektrokimyoviy qatorda eng yuqorida</li>
            <li><strong className="text-yellow-400">π-backbonding:</strong> Fe²⁺ (t₂g) → CN⁻ (π*), kuchli kovalent xarakter</li>
            <li><strong className="text-yellow-400">¹³C YaMR:</strong> 177 ppm (singlet, 6C), barcha CN⁻ ekvivalent</li>
            <li><strong className="text-yellow-400">Nefelauxetik β:</strong> 0.44 (juda past, kuchli kovalentlik)</li>
            <li><strong className="text-yellow-400">CFSE:</strong> -61,720 cm⁻¹ (juda barqaror)</li>
            <li><strong className="text-yellow-400">Barqarorlik:</strong> β₆ ≈ 10³⁵ (juda barqaror kompleks)</li>
            <li><strong className="text-yellow-400">Inert:</strong> Sekin ligand almashinish (katta CFSE)</li>
            <li><strong className="text-yellow-400">Tarix:</strong> Macquer (1752), Scheele (1782), Werner (1893)</li>
            <li><strong className="text-yellow-400">Qo'llanish:</strong> E536, analitik kimyo (Berlin ko'ki), metallurgiya</li>
            <li><strong className="text-yellow-400">Xavfsizlik:</strong> GRAS, lekin kislota bilan HCN ajraladi (ZAHARLI!)</li>
            <li><strong className="text-yellow-400">Taqqoslash:</strong> [Fe(CN)₆]³⁻ (ferrisianid): ¹³C ~110 ppm, paramagnit, β₆ ≈ 10⁴²</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Birikmalar katalogi</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmalar/fe-acac-3" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Paramagnit komplekslar →</Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Fe(CN)₆]⁴⁻ (Sariq qon tuzi) • YaMR spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Macquer (1752), Scheele (1782), Gmelin (1822), Werner (1893), Miessler-Tarr, Cotton-Wilkinson, Greenwood-Earnshaw, SDBS ID: 35096</p>
        </div>
      </footer>
    </main>
  )
}