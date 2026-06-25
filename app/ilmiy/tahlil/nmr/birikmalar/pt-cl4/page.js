"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// [PtCl₄]²⁻ — TETRAXLOROPLATINAT(II) YaMR (ILMIY BOYITILGAN)
// Manbalar: Pregosin (1983), Still & Neumann (1975), Cotton-Wilkinson,
//           Miessler-Tarr, Greenwood-Earnshaw, IUPAC Ξ skalasi
// Xususiyat: ¹⁹⁵Pt YaMR referens, D₄ₕ simmetriya, tekis kvadrat d⁸,
//           kvadrupol bog'lanish yo'q (η ≈ 0), Ξ = 21.4 MHz
//  ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[PtCl<sub>4</sub>]²⁻",
  formulaPlain: "[PtCl4]2-",
  iupac: "Tetraxloroplatinat(II)",
  commonName: "Tetraxloroplatinat(II) (qizil-jigar)",
  molarMass: 317.82, // anion
  saltFormulaHTML: "K<sub>2</sub>[PtCl<sub>4</sub>]",
  saltMolarMass: 415.09, // K₂[PtCl₄]
  casNumber: "16918-92-0", // anion, K₂[PtCl₄]: 13683-25-1
  color: "qizil-jigar (red-brown)",
  structure: "Tekis kvadrat (Square planar, D₄ₕ)",
  metalLigand: "Pt-Cl (4 ta ekvivalent)",
  pointGroup: "D₄ₕ",
  electrolyteType: "2:1 elektrolit (K₂[PtCl₄])",
  molarConductivity: "~270 S·cm²/mol",
  solubility: "Suvda juda yaxshi eriydi (K₂[PtCl₄] ~70 g/L, 20°C)",

  //  ═══════════════════════════════════════════════════════════════
  // KRISTALL MAYDON NAZARIYASI — TEKIS KVADRAT d⁸
  //  ═══════════════════════════════════════════════════════════════
  crystalField: {
    metalIon: "Pt²⁺",
    electronConfig: "[Xe] 4f¹⁴ 5d⁸",
    dElectrons: 8,
    spinState: "Past spinli (har doim — 5d⁸ da)",
    orbitalOccupancy: "(dxy)² (dz²)² (dxz,dyz)⁴ (dx²-y²)⁰",
    unpairedElectrons: 0,
    magneticMoment: "0 BM (diamagnit)",
    crystalFieldSplitting: "Tekis kvadrat: dx²-y² eng yuqori, Δ₁ ≈ 30,000 cm⁻¹ (Cl⁻ o'rta maydon ligandi)",
    racahParameter: "B ≈ 400 cm⁻¹ (5d orbitallar keng tarqalgan)",
    nephelauxeticRatio: "β = B/B₀ ≈ 0.35 (kuchli kovalentlik, 5d metallar)",
    pairingEnergy: "P ≈ 15,000 cm⁻¹",
    cFSE: "CFSE ≈ -24,000 cm⁻¹ (tekis kvadrat, juda barqaror)",
    spectrochemicalSeries: "Cl⁻ — o'rtacha maydon ligandi (I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < NO₂⁻ < CN⁻)",
    whySquarePlanar: "5d⁸ elektron konfiguratsiya — katta Δ₁ (kristall maydon bo'linishi). Oktaedr geometriya o'rniga, tekis kvadrat afzal. Barcha Pt²⁺, Pd²⁺, Au³⁺, Ir⁺ d⁸ komplekslar tekis kvadrat.",
    colorOrigin: "d-d o'tishlar Laporte ta'qiqlangan (D₄ₕ markaziy simmetriya). Qizil-jigar rang — LMCT (Cl⁻ → Pt²⁺) ~350 nm (ε ≈ 200-500) + kuchsiz d-d.",
    chargeTransfer: "LMCT: Cl⁻ (p) → Pt²⁺ (dx²-y²) ~350 nm (UV-chegara, kuchli). MLCT past energiyada kuzatilmaydi."
  },

  //  ═══════════════════════════════════════════════════════════════
  // SIMMETRIYA — D₄ₕ (MARKAZIY SIMMETRIYA!)
  //  ═══════════════════════════════════════════════════════════════
  symmetry: {
    pointGroup: "D₄ₕ",
    order: 16,
    symmetryElements: ["E", "2C₄", "C₂", "2C₂'", "2C₂''", "i", "2S₄", "σₕ", "2σᵥ", "2σᵈ"],
    characterTable: {
      A1g: { E: 1, C4: 1, C2: 1, C2_prime: 1, C2_double: 1, i: 1, S4: 1, σh: 1, σv: 1, σd: 1, functions: "x²+y², z²" },
      A2g: { E: 1, C4: 1, C2: 1, C2_prime: -1, C2_double: -1, i: 1, S4: 1, σh: 1, σv: -1, σd: -1, functions: "Rz" },
      B1g: { E: 1, C4: -1, C2: 1, C2_prime: 1, C2_double: -1, i: 1, S4: -1, σh: 1, σv: 1, σd: -1, functions: "x²-y²" },
      B2g: { E: 1, C4: -1, C2: 1, C2_prime: -1, C2_double: 1, i: 1, S4: -1, σh: 1, σv: -1, σd: 1, functions: "xy" },
      Eg:  { E: 2, C4: 0, C2: -2, C2_prime: 0, C2_double: 0, i: 2, S4: 0, σh: -2, σv: 0, σd: 0, functions: "(Rx,Ry), (xz,yz)" },
      A1u: { E: 1, C4: 1, C2: 1, C2_prime: 1, C2_double: 1, i: -1, S4: -1, σh: -1, σv: -1, σd: -1, functions: "—" },
      A2u: { E: 1, C4: 1, C2: 1, C2_prime: -1, C2_double: -1, i: -1, S4: -1, σh: -1, σv: 1, σd: 1, functions: "z" },
      B1u: { E: 1, C4: -1, C2: 1, C2_prime: 1, C2_double: -1, i: -1, S4: 1, σh: -1, σv: -1, σd: 1, functions: "—" },
      B2u: { E: 1, C4: -1, C2: 1, C2_prime: -1, C2_double: 1, i: -1, S4: 1, σh: -1, σv: 1, σd: -1, functions: "—" },
      Eu:  { E: 2, C4: 0, C2: -2, C2_prime: 0, C2_double: 0, i: -2, S4: 0, σh: 2, σv: 0, σd: 0, functions: "(x,y)" }
    },
    nmrEquivalence: "D₄ₕ simmetriya: barcha 4 ta Cl ligand to'liq ekvivalent (C₄ o'q orqali). YaMR da barcha Cl lar bir xil muhitda → ¹⁹⁵Pt YaMR da bitta o'tkir signal (singlet, kvadrupol kengayish yo'q chunki η ≈ 0).",
    irActive: "A₂ᵤ + Eᵤ — IR faol (u simmetriya, dipol momenti o'zgaradi)",
    ramanActive: "A₁g + B₁g + B₂g + Eg — Raman faol (g simmetriya, polyarizatsiya o'zgaradi)",
    mutualExclusion: "D₄ₕ da MARKAZIY SIMMETRIYA (i) bor → IR va Raman USTMA-UST TUSHMAYDI (mutual exclusion principle). Bu C₂ᵥ yoki D₃ dan asosiy farq!"
  },

  //  ═══════════════════════════════════════════════════════════════
  // YaMR NAZARIYASI — ¹⁹⁵Pt YaMR REFERENS
  //  ═══════════════════════════════════════════════════════════════
  nmrTheory: {
    pt195: {
      nucleus: "¹⁹⁵Pt (I = 1/2, 33.8% tabiiy)",
      shift: "+1620 ppm (referens: Na₂[PtCl₆], 0 ppm)",
      whyThisShift: "¹⁹⁵Pt kimyoviy siljishi juda keng diapazon (-15,000 dan +15,000 ppm). [PtCl₄]²⁻ da +1620 ppm — Pt²⁺ (d⁸ tekis kvadrat), Cl⁻ kuchli π-donor → Pt elektron zichligi kamayadi → deshielded. IUPAC konventsiyasi bo'yicha [PtCl₆]²⁻ = 0 ppm, [PtCl₄]²⁻ = +1620 ppm.",
      sensitivity: "O'rta — ¹H dan ~10× past, lekin ¹³C dan 3× yaxshiroq",
      linewidth: "~10-50 Hz (o'tkir, kichik CSA, η ≈ 0)",
      t1Relaxation: "T₁ ≈ 0.5-3 s (CSA dominant mexanizm)",
      csa: "Kimyoviy siljish anizotropiyasi: Δσ ≈ 2000-4000 ppm (tekis kvadrat, katta lekin η ≈ 0 tufayli kengayish minimal)",
      referencing: "Referens: Na₂[PtCl₆] (0 ppm). Eski konventsiya: [PtCl₄]²⁻ = 0 ppm (ba'zi adabiyotlarda). IUPAC Ξ skalasi: ¹⁹⁵Pt frekansi / ¹H TMS frekansi × 100.",
      xiScale: "Ξ(¹⁹⁵Pt) = 21.4 MHz (D₄ₕ [PtCl₄]²⁻ uchun). Bu o'zgarmas — magnit maydoniga bog'liq emas!",
      applications: "¹⁹⁵Pt YaMR uchun asosiy referens, kalibrlash standarti, kimyoviy siljishlarni taqqoslash"
    },
    cl35: {
      nucleus: "³⁵Cl (I = 3/2, 75.8% tabiiy)",
      shift: "~100 ppm (referens: Cl⁻ (aq), 0 ppm)",
      whyThisShift: "Kvadrupol yadro (I=3/2), keng chiziqlar. D₄ₕ simmetrik muhitda ham CQ ≈ 10-20 MHz (Pt-Cl bog'lanish kovalent xarakteri).",
      quadrupolar: "Kvadrupol (I=3/2), CQ ≈ 10-20 MHz, η ≈ 0 (D₄ₕ simmetriya)",
      linewidth: "~5,000-20,000 Hz (juda keng)",
      detection: "To'g'ridan-to'g'ri kuzatish qiyin. Odatda ¹⁹⁵Pt YaMR orqali bilvosita kuzatiladi."
    },
    cl37: {
      nucleus: "³⁷Cl (I = 3/2, 24.2% tabiiy)",
      shift: "~100 ppm (referens: Cl⁻ (aq))",
      sensitivity: "³⁵Cl dan ~3× past sezgirlik",
      applications: "Izotop effektlarini o'rganish uchun ishlatiladi"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY PARAMETRLAR
  //  ═══════════════════════════════════════════════════════════════
  structuralData: {
    bondLengths: {
      ptCl: "2.30-2.32 Å (Pt-Cl, barcha 4 ta ekvivalent)",
      comparison: "[PtCl₆]²⁻: Pt-Cl = 2.32 Å. cis-[PtCl₂(NH₃)₂]: Pt-Cl = 2.32 Å. trans-[PtCl₂(NH₃)₂]: Pt-Cl = 2.32 Å. Cl⁻ trans-effekti o'rtacha."
    },
    bondAngles: {
      clPtCl_cis: "90° (cis Cl-Pt-Cl)",
      clPtCl_trans: "180° (trans Cl-Pt-Cl)",
      sumAngles: "360° (tekis kvadrat, barcha ligandlar bir tekislikda)"
    },
    piBonding: {
      description: "Cl⁻ — kuchli π-donor (to'ldirilgan p orbitallari)",
      effect: "Pt²⁺ ga π-qayta bog'lanish → Pt elektron zichligi kamayadi → deshielding → yuqori ppm (¹⁹⁵Pt YaMR)",
      evidence: "Pt-Cl bog' uzunligi 2.31 Å (qo'sh bog' xarakteri) va ν(Pt-Cl) ~330 cm⁻¹ (IR/Raman)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TERMODINAMIK VA ELEKTROKIMYO
  //  ═══════════════════════════════════════════════════════════════
  thermodynamics: {
    stability: {
      logBeta4: "β₄ ≈ 10¹⁶ (barqaror)",
      stepwise: "K₁ ≈ 10⁶, K₂ ≈ 10⁵, K₃ ≈ 10³, K₄ ≈ 10²",
      comparison: "[PtCl₆]²⁻: β₆ ≈ 10²⁵ (yanada barqaror)"
    },
    redox: {
      pt2_to_pt4: "Pt²⁺ + 2 Cl⁻ → [PtCl₆]²⁻ + 2e⁻ (E° ≈ +0.73 V, oksidlanish)",
      disproportionation: "[PtCl₄]²⁻ → [PtCl₆]²⁻ + Pt(0) (sharoitga bog'liq)",
      oxidation: "Cl₂ yoki H₂O₂ bilan [PtCl₆]²⁻ ga oksidlanadi"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // ¹⁹⁵Pt YaMR REFERENSLASH TIZIMI (ENG MUHIM QISM!)
  //  ═══════════════════════════════════════════════════════════════
  referencing: {
    conventions: {
      primary: "IUPAC Ξ (Xi) skalasi — magnit maydoniga bog'liq emas, universal",
      secondary: "δ skalasi — [PtCl₆]²⁻ = 0 ppm (eng keng tarqalgan)",
      oldConvention: "Eski konventsiya: [PtCl₄]²⁻ = 0 ppm (ba'zi adabiyotlarda)",
      frequency: "Ξ(¹⁹⁵Pt) = 21.4 MHz (D₄ₕ [PtCl₄]²⁻ uchun, o'zgarmas)"
    },
    commonReferences: [
      { compound: "[PtCl₆]²⁻ (Na₂PtCl₆)", shift: "0 ppm", note: "Asosiy zamonaviy referens" },
      { compound: "[PtCl₄]²⁻ (Na₂PtCl₄)", shift: "+1620 ppm", note: "Bu birikma! Ξ = 21.4 MHz" },
      { compound: "[Pt(H₂O)₄]²⁺", shift: "+1650 ppm", note: "Aqva kompleks" },
      { compound: "cis-[PtCl₂(NH₃)₂]", shift: "-2100 ppm", note: "Sisplatin" },
      { compound: "trans-[PtCl₂(NH₃)₂]", shift: "-1850 ppm", note: "Transplatin" },
      { compound: "[Pt(CN)₄]²⁻", shift: "-3850 ppm", note: "Kuchli maydon (CN⁻)" },
      { compound: "[Pt(NH₃)₄]²⁺", shift: "-2350 ppm", note: "Ammiak kompleks" }
    ],
    xiFormula: "Ξ = (ν_sample - ν_ref) / ν_ref × 10⁶ + Ξ_ref",
    importance: "Ξ skalasi har xil magnit maydonidagi spektrometrlarda (400, 500, 600, 800 MHz) bir xil qiymat beradi. Bu ¹⁹⁵Pt YaMR uchun juda muhim, chunki kimyoviy siljish diapazoni juda keng."
  },

  //  ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  //  ═══════════════════════════════════════════════════════════════
  history: {
    magnus: {
      year: 1828,
      scientist: "Gustav Magnus (Germaniya)",
      achievement: "[Pt(NH₃)₄][PtCl₄] — Magnus yashil tuzini kashf qildi",
      significance: "Birinchi koordinatsion birikmalardan biri, strukturaviy kimyoning boshlanishi"
    },
    werner: {
      year: 1893,
      scientist: "Alfred Werner (Shveytsariya)",
      achievement: "Koordinatsion nazariya — tekis kvadrat tetraxloroplatinat(II)",
      contribution: "[PtCl₄]²⁻ — Pt²⁺ (d⁸) tekis kvadrat geometriyada",
      nobel: "Nobel mukofoti (1913)"
    },
    nmr_era: {
      year: "1960-70-yillar",
      scientists: "Goodfellow, Pregosin, Kerr",
      achievement: "¹⁹⁵Pt YaMR spektroskopiyasi rivojlandi",
      contribution: "[PtCl₄]²⁻ — standart referens sifatida tanlandi",
      significance: "¹⁹⁵Pt YaMR orqali Pt komplekslarini tizimli o'rganish"
    },
    iupac: {
      year: "1970-yillar",
      organization: "IUPAC",
      achievement: "Ξ (Xi) skalasi kiritildi",
      contribution: "Universal referenslash tizimi, magnit maydoniga bog'liq emas",
      significance: "Har xil laboratoriyalarda natijalarni taqqoslash imkoniyati"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH — BOSHQA Pt KOMPLEKSLARI
  //  ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      compound: "[PtCl₄]²⁻",
      ligand: "4 Cl⁻ (ekvivalent)",
      geometry: "Tekis kvadrat (D₄ₕ)",
      nmrShift: "+1620 ppm (referens)",
      symmetry: "D₄ₕ",
      use: "¹⁹⁵Pt YaMR referens, prekursor"
    },
    {
      compound: "[PtCl₆]²⁻",
      ligand: "6 Cl⁻",
      geometry: "Oktaedr (Oₕ)",
      nmrShift: "0 ppm (zamonaviy referens)",
      symmetry: "Oₕ",
      use: "Pt⁴⁺ referens, oksidlovchi"
    },
    {
      compound: "cis-[PtCl₂(NH₃)₂]",
      ligand: "2 Cl⁻ + 2 NH₃ (cis)",
      geometry: "Tekis kvadrat (C₂ᵥ)",
      nmrShift: "-2100 ppm",
      symmetry: "C₂ᵥ",
      use: "Sisplatin (saraton dori)"
    },
    {
      compound: "trans-[PtCl₂(NH₃)₂]",
      ligand: "2 Cl⁻ + 2 NH₃ (trans)",
      geometry: "Tekis kvadrat (D₂ₕ)",
      nmrShift: "-1850 ppm",
      symmetry: "D₂ₕ",
      use: "Transplatin (samarasiz)"
    },
    {
      compound: "[Pt(NH₃)₄]²⁺",
      ligand: "4 NH₃",
      geometry: "Tekis kvadrat (D₄ₕ)",
      nmrShift: "-2350 ppm",
      symmetry: "D₄ₕ",
      use: "Ammiak kompleks"
    },
    {
      compound: "[Pt(CN)₄]²⁻",
      ligand: "4 CN⁻",
      geometry: "Tekis kvadrat (D₄ₕ)",
      nmrShift: "-3850 ppm",
      symmetry: "D₄ₕ",
      use: "Kuchli maydon ligandi"
    }
  ],

  // YaMR signallar (batafsil)
  nmrSignals: [
    {
      nucleus: "¹⁹⁵Pt",
      ligand: "Pt markaz",
      shift: 1620,
      multiplicity: "singlet (o'tkir)",
      jCoupling: "—",
      integration: "1Pt",
      notes: "¹⁹⁵Pt YaMR da +1620 ppm (Na₂[PtCl₆] = 0 ppm referensga nisbatan). O'tkir signal — D₄ₕ simmetriya tufayli η ≈ 0, kvadrupol kengayish minimal. ¹⁹⁵Pt YaMR uchun asosiy referens birikma."
    },
    {
      nucleus: "³⁵Cl",
      ligand: "Cl (barcha 4 ta)",
      shift: 100,
      multiplicity: "juda keng singlet",
      jCoupling: "—",
      integration: "4Cl",
      notes: "Kvadrupol yadro (I=3/2), CQ ≈ 10-20 MHz. Juda keng chiziq (~5,000-20,000 Hz). To'g'ridan-to'g'ri kuzatish qiyin."
    },
    {
      nucleus: "³⁷Cl",
      ligand: "Cl (barcha 4 ta)",
      shift: 100,
      multiplicity: "juda keng singlet",
      jCoupling: "—",
      integration: "4Cl",
      notes: "³⁵Cl dan 3× past sezgirlik (24.2% tabiiy). Izotop effektlarini o'rganish uchun."
    }
  ],

  // ¹⁹⁵Pt YaMR spektr ma'lumotlari (simulyatsiya uchun)
  pt195Spectrum: [
    { ppm: -4000, intensity: 0, notes: "—" },
    { ppm: -3850, intensity: 0, notes: "[Pt(CN)₄]²⁻ joyi" },
    { ppm: -2350, intensity: 0, notes: "[Pt(NH₃)₄]²⁺ joyi" },
    { ppm: -2100, intensity: 0, notes: "Sisplatin joyi" },
    { ppm: -1850, intensity: 0, notes: "Transplatin joyi" },
    { ppm: 0, intensity: 0, notes: "[PtCl₆]²⁻ (referens)" },
    { ppm: 1500, intensity: 0, notes: "—" },
    { ppm: 1570, intensity: 0.2, notes: "¹⁹⁵Pt signal (past maydon yelkasi)" },
    { ppm: 1620, intensity: 1.0, notes: "¹⁹⁵Pt: [PtCl₄]²⁻ markaziy (referens birikma)" },
    { ppm: 1670, intensity: 0.2, notes: "¹⁹⁵Pt signal (yuqori maydon yelkasi)" },
    { ppm: 1750, intensity: 0, notes: "—" },
    { ppm: 2000, intensity: 0, notes: "—" }
  ],

  // Halaqit beruvchi omillar
  interferences: [
    {
      source: "[PtCl₆]²⁻ aralashmasi (oksidlanish mahsuloti)",
      effect: "¹⁹⁵Pt YaMR da 0 ppm da qo'shimcha signal (Pt⁴⁺)",
      severity: "O'rta",
      solution: "Sof [PtCl₄]²⁻ ishlatish. Qaytaruvchi muhitda saqlash (askorbin kislotasi).",
      theoryNote: "[PtCl₄]²⁻ havo ta'sirida sekin oksidlanib [PtCl₆]²⁻ ga aylanadi. ¹⁹⁵Pt YaMR da 0 ppm da signal paydo bo'ladi (1620 ppm farq)."
    },
    {
      source: "Konsentratsiya effektlari",
      effect: "Yuqori konsentratsiyada chiziq kengayishi (ion juftlari)",
      severity: "Past",
      solution: "0.1-0.5 M konsentratsiyada ishlash tavsiya etiladi.",
      theoryNote: "Yuqori konsentratsiyada [PtCl₄]²⁻ va K⁺/Na⁺ ion juftlari hosil bo'ladi → chiziq kengayadi."
    },
    {
      source: "Erituvchi effektlari",
      effect: "D₂O va H₂O da biroz farqli siljishlar (~5-10 ppm)",
      severity: "Past",
      solution: "Standart erituvchi (D₂O) ishlatish. Barcha o'lchovlarni bir xil sharoitda o'tkazish.",
      theoryNote: "Erituvchi vodorod bog'lanishi orqali Pt-Cl bog'lanishiga ta'sir qiladi. D₂O va H₂O da ~5-10 ppm farq."
    },
    {
      source: "Harorat effektlari",
      effect: "T o'zgarishi → ¹⁹⁵Pt signali ~0.1-0.5 ppm/K siljiydi",
      severity: "Past",
      solution: "Haroratni nazorat qilish (298 ± 1 K). Haroratni qayd etish.",
      theoryNote: "¹⁹⁵Pt kimyoviy siljishi haroratga sezgir (keng diapazon tufayli). 298 K standart."
    },
    {
      source: "Magnit maydon drifti",
      effect: "Uzoq eksperimentlarda signal siljiydi",
      severity: "O'rta",
      solution: "Lock (D₂O lock) ishlatish. Muntazam kalibrlash.",
      theoryNote: "Yuqori aniqlik uchun D₂O lock va tez-tez kalibrlash kerak."
    },
    {
      source: "Pt(0) qoldiqlari (koloid)",
      effect: "Paramagnit kengayish, signal intensivligi pasayadi",
      severity: "Past",
      solution: "Sof namuna ishlatish. Filtrlash (0.45 μm).",
      theoryNote: "Pt(0) koloidlari paramagnit bo'lishi mumkin. Filtrlash orqali yo'qotish mumkin."
    }
  ],

  // Laboratoriya tartibi
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak, labor xalat. Pt birikmalari zaharli. Havo almashinuvi yaxshi bo'lgan joyda ishlash.",
      time: "15 daq",
      theoryNote: "Pt birikmalari toksik va teri allergiyasiga olib kelishi mumkin. Qo'lqop va himoya ko'zoynaklari majburiy."
    },
    {
      step: 2,
      title: "Sof K₂[PtCl₄] ni tayyorlash",
      desc: "Tijorat K₂[PtCl₄] (≥99%) yoki sintez. Sintez: K₂[PtCl₆] + H₂ + qaytaruvchi → K₂[PtCl₄]. Qizil-jigar kristallar.",
      time: "1-2 kun (sintez) yoki tayyor",
      theoryNote: "K₂[PtCl₆] ni qaytaruvchi bilan (H₂, SO₂, askorbin kislotasi) qaytarib K₂[PtCl₄] olinadi. Qizil-jigar kristallar."
    },
    {
      step: 3,
      title: "YaMR spektrometrni tayyorlash",
      desc: "YaMR spektrometrni yoqish, 30 daq stabillash. Shimlash (shimming). D₂O erituvchi. ¹⁹⁵Pt kanalini sozlash.",
      time: "30-45 daq",
      theoryNote: "¹⁹⁵Pt kanali 21.4 MHz atrofida (400 MHz ¹H spektrometrda). Yaxshi shimlash — o'tkir signal uchun muhim."
    },
    {
      step: 4,
      title: "Namuna tayyorlash",
      desc: "50-100 mg K₂[PtCl₄] ni 0.6 mL D₂O da eritish. YaMR naychaga solish.",
      time: "10 daq",
      theoryNote: "D₂O da yaxshi eriydi. 0.1-0.5 M konsentratsiya tavsiya etiladi. Yuqori konsentratsiya ion juftlariga olib keladi."
    },
    {
      step: 5,
      title: "¹⁹⁵Pt YaMR spektrini olish",
      desc: "¹⁹⁵Pt YaMR spektrini olish (100-1000 skan). Signal +1620 ppm da (keng diapazon, ±5000 ppm).",
      time: "10-30 daq",
      theoryNote: "¹⁹⁵Pt YaMR da +1620 ppm da signal. Keng spektral diapazon (±5000 ppm) kerak. Odatda ¹H dan 10× kam sezgirlik."
    },
    {
      step: 6,
      title: "Referenslash va kalibrlash",
      desc: "Na₂[PtCl₆] yoki Ξ skalasi bo'yicha kalibrlash. Signal aniq +1620 ppm da ekanligini tekshirish.",
      time: "5-10 daq",
      theoryNote: "IUPAC Ξ skalasi: Ξ(¹⁹⁵Pt) = 21.4 MHz. Na₂[PtCl₆] = 0 ppm. Signal +1620 ppm da bo'lishi kerak."
    },
    {
      step: 7,
      title: "[PtCl₆]²⁻ aralashmasini tekshirish",
      desc: "0 ppm da signal borligini tekshirish (bo'lsa, [PtCl₆]²⁻ aralashmasi).",
      time: "5 daq",
      theoryNote: "Agar 0 ppm da signal bo'lsa, namuna qisman oksidlangan (Pt²⁺ → Pt⁴⁺). Qaytaruvchi qo'shish yoki yangi namuna."
    },
    {
      step: 8,
      title: "Harorat o'zgarishini o'lchash (ixtiyoriy)",
      desc: "280-320 K oralig'ida harorat bog'liqligini o'lchash (~0.1-0.5 ppm/K).",
      time: "30-60 daq",
      theoryNote: "¹⁹⁵Pt kimyoviy siljishi haroratga sezgir. Bu Pt-Cl bog'lanishining termodinamik parametrlarini beradi."
    }
  ],

  // Kengaytiruvchi metodlar
  advancedTechniques: [
    {
      name: "1D ¹⁹⁵Pt YaMR (standart)",
      description: "¹⁹⁵Pt kimyoviy siljishini o'lchash (+1620 ppm)",
      advantages: ["Referenslash", "Tez", "O'tkir signal"],
      disadvantages: ["Faqat ¹⁹⁵Pt", "Keng diapazon"],
      bestFor: "Kalibrlash, soflik tekshirish",
      examples: "+1620 ppm — [PtCl₄]²⁻ referens"
    },
    {
      name: "VT-NMR (Variable Temperature)",
      description: "Haroratni o'zgartirib kimyoviy siljish o'zgarishi",
      advantages: ["Termodinamik parametrlar", "Ligand almashinish kinetikasi"],
      disadvantages: ["Uzoq vaqt", "Harorat nazorati"],
      bestFor: "Termodinamik parametrlar, kinetika",
      examples: "~0.1-0.5 ppm/K haroratga bog'liq"
    },
    {
      name: "IR va Raman spektroskopiya",
      description: "ν(Pt-Cl) tebranishlarini o'lchash (~330 cm⁻¹)",
      advantages: ["Bog' kuchi", "Simmetriya tasdiqlash", "Tez"],
      disadvantages: ["Faqat tebranishlar", "Kvant ma'lumot kam"],
      bestFor: "Bog' kuchi, simmetriya (mutual exclusion)",
      examples: "ν(Pt-Cl) ~330 cm⁻¹ (Raman A₁g), ~320 cm⁻¹ (IR Eᵤ)"
    },
    {
      name: "Qattiq holat ¹⁹⁵Pt CP/MAS",
      description: "Kristall namuna uchun qattiq holat YaMR",
      advantages: ["CSA o'rganish", "Polimorfizm", "Erituvchi kerak emas"],
      disadvantages: ["Maxsus uskuna", "Uzoq vaqt"],
      bestFor: "CSA, polimorfizm, qattiq holat struktura",
      examples: "CSA Δσ ≈ 2000-4000 ppm (D₄ₕ, η ≈ 0)"
    },
    {
      name: "X-ray kristallografiya (SCXRD)",
      description: "Kristall strukturasini aniq aniqlash",
      advantages: ["Aniq bog' uzunliklari", "3D struktura", "D₄ₕ simmetriya"],
      disadvantages: ["Kristall kerak", "Uzoq vaqt"],
      bestFor: "Strukturaviy parametrlar, bog' uzunliklari",
      examples: "Pt-Cl = 2.31 Å, Cl-Pt-Cl = 90° (cis), 180° (trans)"
    },
    {
      name: "Elektrokimyo (CV)",
      description: "Pt²⁺/Pt⁴⁺ redoks juftini o'rganish",
      advantages: ["E° aniqlash", "Redoks xususiyatlari", "Kinetika"],
      disadvantages: ["Elektrod kerak", "Erituvchi ta'siri"],
      bestFor: "Redoks xususiyatlari, E°",
      examples: "Pt²⁺/Pt⁴⁺: E° ≈ +0.73 V (vs SHE)"
    }
  ]
}

export default function PtCl4Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [ptPpmSlider, setPtPpmSlider] = useState(1620)
  const [activeNmrNucleus, setActiveNmrNucleus] = useState("pt195")
  const [referenceSystem, setReferenceSystem] = useState("iupac")

  const currentPtSignal = useMemo(() => {
    let closest = COMPOUND.pt195Spectrum[0]
    let minDiff = Math.abs(ptPpmSlider - COMPOUND.pt195Spectrum[0].ppm)
    for (let i = 1; i < COMPOUND.pt195Spectrum.length; i++) {
      const diff = Math.abs(ptPpmSlider - COMPOUND.pt195Spectrum[i].ppm)
      if (diff < minDiff) {
        minDiff = diff
        closest = COMPOUND.pt195Spectrum[i]
      }
    }
    return closest
  }, [ptPpmSlider])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-amber-950/20 to-blue-950 text-white">
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-amber-950 to-purple-950 border-2 border-amber-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🧲</span> [PtCl₄]²⁻ — ¹⁹⁵Pt YaMR REFERENS!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-amber-300">[PtCl₄]²⁻</strong> — ¹⁹⁵Pt YaMR spektroskopiyasining eng muhim birikmalaridan biri!
              Bu <strong className="text-amber-300">standart referens</strong> (Ξ = 21.4 MHz, +1620 ppm). D₄ₕ simmetriya, tekis kvadrat d⁸.
            </p>
            <div className="bg-amber-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-amber-400 font-bold mb-2">🧲 YaMR ma'lumotlari:</div>
                  <div className="text-purple-200">
                    <strong>¹⁹⁵Pt:</strong> +1620 ppm (referens)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Ξ skalasi:</strong> 21.4 MHz (o'zgarmas)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Simmetriya:</strong> D₄ₕ (η ≈ 0)
                  </div>
                </div>
                <div>
                  <div className="text-amber-400 font-bold mb-2">🔬 Asosiy xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Geometriya:</strong> Tekis kvadrat
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Spin:</strong> d⁸, diamagnit
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Qo'llanish:</strong> Kalibrlash standarti
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-amber-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-amber-300">Knowledge Base:</strong> Pregosin (1983), Still &amp; Neumann (1975), IUPAC Ξ skalasi,
                Cotton-Wilkinson, Miessler-Tarr, Greenwood-Earnshaw, Magnus (1828)
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
              <span className="text-amber-400 font-semibold">[PtCl₄]²⁻</span>
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
                  <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">¹⁹⁵Pt REFERENS</span>
                  <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">D₄ₕ Simmetriya</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Tekis Kvadrat</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Ξ = 21.4 MHz</span>
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
            <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-3 py-1 rounded-full text-xs">Metall Yadrosi</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Referens</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">D₄ₕ</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Ξ = 21.4 MHz</span>
          </div>
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              [PtCl₄]²⁻
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>
          <p className="text-purple-300 text-lg mb-4">
            Tetraxloroplatinat(II) — <span className="text-amber-400 italic">&quot;¹⁹⁵Pt YaMR ning standart referensi&quot;</span>
          </p>
          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-amber-400">YaMR spektroskopiya</strong> yordamida <strong className="text-amber-400">referenslash tizimini</strong> o&apos;rganish.
            Pt²⁺ — 5d⁸ tekis kvadrat, D₄ₕ simmetriya, diamagnit.
            <strong className="text-amber-400"> ¹⁹⁵Pt YaMR: +1620 ppm</strong> (Na₂[PtCl₆] = 0 ppm ga nisbatan).
            <strong className="text-amber-400"> Ξ = 21.4 MHz</strong> — magnit maydoniga bog&apos;liq bo&apos;lmagan o&apos;zgarmas!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Pt²⁺ (5d⁸)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Tekis kvadrat</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">D₄ₕ (16)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">¹⁹⁵Pt YaMR</div>
              <div className="text-white font-bold">+1620 ppm</div>
            </div>
          </div>
        </div>

        {/* KRISTALL MAYDON NAZARIYASI */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔬</span> Kristall maydon nazariyasi — TEKIS KVADRAT d⁸
          </h2>
          <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>Nima uchun tekis kvadrat?</strong> Pt²⁺ — 5d⁸ elektron konfiguratsiya. 5d orbitallar keng tarqalgan → katta kristall maydon bo&apos;linishi (Δ₁).
              Oktaedr geometriya o&apos;rniga, tekis kvadrat afzal — barcha 8 ta elektron past orbitallarda, dx²-y² bo&apos;sh.
              Bu <strong className="text-amber-400">barcha d⁸ komplekslar</strong> uchun xos (Pt²⁺, Pd²⁺, Au³⁺, Ir⁺).
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
                  <span className="text-blue-400 font-mono">{COMPOUND.crystalField.dElectrons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Spin holati:</span>
                  <span className="text-blue-400">{COMPOUND.crystalField.spinState}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Orbital to&apos;ldirilishi:</span>
                  <span className="text-blue-400 font-mono text-xs">{COMPOUND.crystalField.orbitalOccupancy}</span>
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
                  <span className="text-purple-400">Δ₁ (tekis kvadrat):</span>
                  <span className="text-blue-400 font-mono text-xs">{COMPOUND.crystalField.crystalFieldSplitting}</span>
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
            <h4 className="text-blue-400 font-bold mb-2">Nima uchun tekis kvadrat?</h4>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Tufayli:</strong> {COMPOUND.crystalField.whySquarePlanar}
            </p>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Rang sababi:</strong> {COMPOUND.crystalField.colorOrigin}
            </p>
            <p className="text-purple-200 text-sm">
              <strong>Charge transfer:</strong> {COMPOUND.crystalField.chargeTransfer}
            </p>
          </div>

          {/* d-orbital splitting diagram - TEKTIS KVADRAT */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <h4 className="text-blue-400 font-bold mb-3">d-orbital bo&apos;linish diagrammasi (tekis kvadrat, D₄ₕ)</h4>
            <svg viewBox="0 0 600 280" className="w-full h-64" role="img" aria-label="d-orbital splitting square planar">
              <title>Tekis kvadrat d-orbital bo'linish — Pt²⁺ d⁸</title>
              <line x1="50" y1="250" x2="50" y2="20" stroke="#a78bfa" strokeWidth="1" />
              <text x="30" y="140" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 30, 140)">Energiya</text>

              {/* dx²-y² — eng yuqori */}
              <line x1="350" y1="40" x2="450" y2="40" stroke="#ef4444" strokeWidth="3" />
              <text x="400" y="30" textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="bold">
                d<tspan baselineShift="sub" fontSize="7">x²-y²</tspan>
              </text>
              <text x="480" y="43" fontSize="8" fill="#ef4444">BO&apos;SH (LUMO)</text>

              {/* dxy */}
              <line x1="350" y1="100" x2="450" y2="100" stroke="#fbbf24" strokeWidth="3" />
              <text x="400" y="90" textAnchor="middle" fontSize="10" fill="#fbbf24" fontWeight="bold">
                d<tspan baselineShift="sub" fontSize="7">xy</tspan>
              </text>
              <circle cx="400" cy="100" r="4" fill="#fbbf24" />
              <text x="400" y="95" textAnchor="middle" fontSize="6" fill="#fbbf24">↑↓</text>

              {/* dz² */}
              <line x1="350" y1="150" x2="450" y2="150" stroke="#22c55e" strokeWidth="3" />
              <text x="400" y="140" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="bold">
                d<tspan baselineShift="sub" fontSize="7">z²</tspan>
              </text>
              <circle cx="400" cy="150" r="4" fill="#22c55e" />
              <text x="400" y="145" textAnchor="middle" fontSize="6" fill="#22c55e">↑↓</text>

              {/* dxz, dyz (degenerate) */}
              <line x1="350" y1="210" x2="450" y2="210" stroke="#06b6d4" strokeWidth="3" />
              <text x="400" y="200" textAnchor="middle" fontSize="10" fill="#06b6d4" fontWeight="bold">
                d<tspan baselineShift="sub" fontSize="7">xz</tspan>, d<tspan baselineShift="sub" fontSize="7">yz</tspan>
              </text>
              <circle cx="380" cy="210" r="4" fill="#06b6d4" />
              <text x="380" y="205" textAnchor="middle" fontSize="6" fill="#06b6d4">↑↓</text>
              <circle cx="420" cy="210" r="4" fill="#06b6d4" />
              <text x="420" y="205" textAnchor="middle" fontSize="6" fill="#06b6d4">↑↓</text>

              {/* Energiya farqlari */}
              <line x1="500" y1="40" x2="500" y2="100" stroke="#fbbf24" strokeWidth="2" />
              <text x="540" y="73" fontSize="9" fill="#fbbf24" fontWeight="bold">Δ₁</text>

              <line x1="500" y1="100" x2="500" y2="150" stroke="#22c55e" strokeWidth="2" />
              <text x="540" y="128" fontSize="9" fill="#22c55e" fontWeight="bold">Δ₂</text>

              <line x1="500" y1="150" x2="500" y2="210" stroke="#06b6d4" strokeWidth="2" />
              <text x="540" y="183" fontSize="9" fill="#06b6d4" fontWeight="bold">Δ₃</text>

              {/* Izoh */}
              <text x="150" y="40" fontSize="9" fill="#ef4444" fontWeight="bold">LUMO (bo&apos;sh)</text>
              <text x="150" y="210" fontSize="9" fill="#06b6d4" fontWeight="bold">HOMO (to&apos;ldirilgan)</text>
              <text x="50" y="270" fontSize="8" fill="#a78bfa">Pt²⁺: 5d⁸ — barcha 8 elektron past orbitallarda</text>
            </svg>
          </div>
        </div>

        {/* SIMMETRIYA — D₄ₕ */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📐</span> Simmetriya (D₄ₕ) — MARKAZIY SIMMETRIYA
          </h2>
          <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-sm">
              <strong>D₄ₕ nuqtaviy guruhi:</strong> [PtCl₄]²⁻ da 16 ta simmetriya elementi, shu jumladan <strong>markaziy simmetriya (i)</strong>.
              Bu <strong>mutual exclusion principle</strong> ga olib keladi — IR va Raman spektrlari ustma-ust tushmaydi.
              η (asimmetriya parametri) ≈ 0 — kvadrupol kengayish minimal, ¹⁹⁵Pt YaMR da o&apos;tkir signal!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">Simmetriya elementlari (16)</h3>
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

          {/* D₄ₕ karakterlar jadvali (qisqacha) */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 overflow-x-auto">
            <h4 className="text-purple-400 font-bold mb-3">D₄ₕ karakterlar jadvali (asosiy irreps)</h4>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-2 px-2 text-purple-400">Irrep</th>
                  <th className="py-2 px-2 text-purple-400">E</th>
                  <th className="py-2 px-2 text-purple-400">i</th>
                  <th className="py-2 px-2 text-purple-400">Spektral faollik</th>
                  <th className="py-2 px-2 text-purple-400">Funksiyalar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30"><td className="py-2 px-2 text-purple-400 font-bold">A₁g</td><td className="py-2 px-2">1</td><td className="py-2 px-2">+1</td><td className="py-2 px-2 text-yellow-400">Raman faol (g)</td><td className="py-2 px-2 text-xs text-yellow-400">x²+y², z²</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-2 px-2 text-purple-400 font-bold">B₁g</td><td className="py-2 px-2">1</td><td className="py-2 px-2">+1</td><td className="py-2 px-2 text-yellow-400">Raman faol (g)</td><td className="py-2 px-2 text-xs text-yellow-400">x²-y²</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-2 px-2 text-purple-400 font-bold">B₂g</td><td className="py-2 px-2">1</td><td className="py-2 px-2">+1</td><td className="py-2 px-2 text-yellow-400">Raman faol (g)</td><td className="py-2 px-2 text-xs text-yellow-400">xy</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-2 px-2 text-purple-400 font-bold">Eg</td><td className="py-2 px-2">2</td><td className="py-2 px-2">+2</td><td className="py-2 px-2 text-yellow-400">Raman faol (g)</td><td className="py-2 px-2 text-xs text-yellow-400">(Rx,Ry), (xz,yz)</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-2 px-2 text-purple-400 font-bold">A₂u</td><td className="py-2 px-2">1</td><td className="py-2 px-2">-1</td><td className="py-2 px-2 text-cyan-400">IR faol (u)</td><td className="py-2 px-2 text-xs text-cyan-400">z</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-2 px-2 text-purple-400 font-bold">Eu</td><td className="py-2 px-2">2</td><td className="py-2 px-2">-2</td><td className="py-2 px-2 text-cyan-400">IR faol (u)</td><td className="py-2 px-2 text-xs text-cyan-400">(x,y)</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-purple-400 mt-2">
              <strong>Eslatma:</strong> g (gerade) — Raman, u (ungerade) — IR. Markaziy simmetriya sababli hech qaysi moda ham IR ham Raman da faol emas.
            </p>
          </div>
        </div>

        {/* ¹⁹⁵Pt YaMR REFERENSLASH TIZIMI — ENG MUHIM QISM */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📏</span> ¹⁹⁵Pt YaMR REFERENSLASH TIZIMI
          </h2>
          <div className="bg-yellow-900/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 text-sm">
              <strong>[PtCl₄]²⁻ — ¹⁹⁵Pt YaMR uchun asosiy referens birikmalardan biri!</strong> Ξ skalasi — magnit maydoniga bog&apos;liq bo&apos;lmagan universal sistema.
              Ξ(¹⁹⁵Pt) = <strong className="text-yellow-400">21.4 MHz</strong> — bu o&apos;zgarmas son!
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setReferenceSystem("iupac")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                referenceSystem === "iupac"
                  ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              IUPAC Ξ skalasi
            </button>
            <button
              onClick={() => setReferenceSystem("delta")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                referenceSystem === "delta"
                  ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              δ skalasi (zamonaviy)
            </button>
            <button
              onClick={() => setReferenceSystem("old")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                referenceSystem === "old"
                  ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              Eski konventsiya
            </button>
          </div>

          {referenceSystem === "iupac" && (
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-yellow-400 font-bold mb-3">IUPAC Ξ (Xi) skalasi</h3>
              <div className="bg-yellow-900/30 rounded-lg p-3">
                <p className="text-yellow-300 text-sm mb-2">
                  <strong>Formula:</strong> Ξ = (ν_sample - ν_ref) / ν_ref × 10⁶ + Ξ_ref
                </p>
                <p className="text-purple-200 text-xs">
                  Bu o&apos;lchov magnit maydoniga bog&apos;liq emas — har xil spektrometrlarda (400, 500, 600, 800 MHz) bir xil natija beradi.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <div className="text-purple-400 text-xs">Ξ(¹⁹⁵Pt) qiymati:</div>
                  <div className="text-xl font-mono font-bold text-yellow-400">21.4 MHz</div>
                  <div className="text-purple-300 text-xs mt-1">[PtCl₄]²⁻ uchun</div>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <div className="text-purple-400 text-xs">Afzallik:</div>
                  <div className="text-white text-sm mt-1">Har xil B₀ da bir xil</div>
                  <div className="text-purple-300 text-xs mt-1">Magnit maydoniga bog'liq emas</div>
                </div>
              </div>
              <p className="text-purple-200 text-sm">{COMPOUND.referencing.importance}</p>
            </div>
          )}

          {referenceSystem === "delta" && (
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-yellow-400 font-bold mb-3">δ skalasi (zamonaviy konventsiya)</h3>
              <div className="bg-yellow-900/30 rounded-lg p-3">
                <p className="text-yellow-300 text-sm mb-2">
                  <strong>Asosiy referens:</strong> Na₂[PtCl₆] = <strong>0 ppm</strong>
                </p>
                <p className="text-purple-200 text-xs">
                  Eng keng tarqalgan konventsiya. [PtCl₄]²⁻ signali +1620 ppm da.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <div className="text-purple-400 text-xs">[PtCl₆]²⁻:</div>
                  <div className="text-xl font-mono font-bold text-yellow-400">0 ppm</div>
                  <div className="text-purple-300 text-xs mt-1">Referens</div>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <div className="text-purple-400 text-xs">[PtCl₄]²⁻:</div>
                  <div className="text-xl font-mono font-bold text-yellow-400">+1620 ppm</div>
                  <div className="text-purple-300 text-xs mt-1">Bu birikma!</div>
                </div>
              </div>
            </div>
          )}

          {referenceSystem === "old" && (
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-yellow-400 font-bold mb-3">Eski konventsiya (ba'zi adabiyotlarda)</h3>
              <div className="bg-yellow-900/30 rounded-lg p-3">
                <p className="text-yellow-300 text-sm mb-2">
                  <strong>Asosiy referens:</strong> [PtCl₄]²⁻ = <strong>0 ppm</strong>
                </p>
                <p className="text-purple-200 text-xs">
                  Eski konventsiya — [PtCl₄]²⁻ ni 0 ppm deb belgilash. Ba'zi eski adabiyotlarda uchraydi.
                </p>
              </div>
              <div className="bg-red-900/30 rounded-lg p-3">
                <p className="text-red-300 text-xs">
                  <strong>⚠️ Ehtiyot bo'ling:</strong> Adabiyotlarni o'qiyotganda qaysi konventsiya ishlatilganini tekshiring.
                  Zamonaviy konventsiya: [PtCl₆]²⁻ = 0 ppm.
                </p>
              </div>
            </div>
          )}

          {/* Umumiy referenslar jadvali */}
          <div className="bg-yellow-900/30 rounded-lg p-4">
            <h4 className="text-yellow-400 font-bold mb-3">Umumiy referens birikmalar (zamonaviy δ skalasi)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-yellow-700">
                    <th className="py-2 px-2 text-yellow-400">Kompleks</th>
                    <th className="py-2 px-2 text-yellow-400">δ (ppm)</th>
                    <th className="py-2 px-2 text-yellow-400">Izoh</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {COMPOUND.referencing.commonReferences.map((ref, i) => (
                    <tr key={i} className="border-b border-yellow-800/30">
                      <td className="py-2 px-2 text-yellow-300 font-mono text-xs">{ref.compound}</td>
                      <td className="py-2 px-2 text-yellow-400 font-mono">{ref.shift}</td>
                      <td className="py-2 px-2 text-xs">{ref.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* YaMR NAZARIYASI */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧲</span> YaMR nazariyasi — chuqur tahlil
          </h2>
          <div className="bg-cyan-900/30 rounded-lg p-4 mb-6">
            <p className="text-cyan-300 text-sm">
              <strong>Nima uchun aynan +1620 ppm?</strong> ¹⁹⁵Pt kimyoviy siljishining fizik ma'nosini,
              referenslash tizimini va spektral xususiyatlarini chuqur o'rganamiz.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveNmrNucleus("pt195")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "pt195"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹⁹⁵Pt (I=1/2, 33.8%)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("cl35")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "cl35"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ³⁵Cl (I=3/2, 75.8%)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("cl37")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "cl37"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ³⁷Cl (I=3/2, 24.2%)
            </button>
          </div>

          {activeNmrNucleus === "pt195" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.pt195.nucleus}</h3>
              <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
                <p className="text-yellow-300 text-xs">
                  <strong>⭐ Eng muhim yadro!</strong> ¹⁹⁵Pt — metall yadrolari YaMR ning eng qulay namunasi.
                  33.8% tabiiy tarqalish (¹³C dan 30 marta ko'p!), I=1/2 (kvadrupol kengayish yo'q), o'rta γ.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.pt195.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Sezgirlik:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.pt195.sensitivity}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.pt195.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.pt195.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun +1620 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.pt195.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">CSA:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.pt195.csa}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Ξ skalasi:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.pt195.xiScale}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Qo'llanish:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.pt195.applications}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "cl35" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.cl35.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.cl35.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Kvadrupol:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.cl35.quadrupolar}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.cl35.linewidth}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun kuzatilmaydi?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.cl35.detection}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "cl37" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.cl37.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.cl37.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Sezgirlik:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.cl37.sensitivity}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Qo'llanish:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.cl37.applications}</p>
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
                  <span className="text-purple-400">Pt-Cl (4 ta ekvivalent):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.ptCl}</span>
                </div>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog' burchaklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Cl-Pt-Cl (cis):</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.clPtCl_cis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Cl-Pt-Cl (trans):</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.clPtCl_trans}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yig'indi:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.sumAngles}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-2">π-bog'lanish (Cl⁻ π-donor)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Ta'rif:</span>
                <span className="text-green-400 text-xs">{COMPOUND.structuralData.piBonding.description}</span>
              </div>
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Ta'sir:</span>
                <span className="text-green-400 text-xs">{COMPOUND.structuralData.piBonding.effect}</span>
              </div>
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Dalil:</span>
                <span className="text-green-400 text-xs">{COMPOUND.structuralData.piBonding.evidence}</span>
              </div>
            </div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <p className="text-green-300 text-sm">
              <strong>Taqqoslash:</strong> {COMPOUND.structuralData.bondLengths.comparison}
            </p>
          </div>
        </div>

        {/* TERMODINAMIK VA ELEKTROKIMYO */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⚗️</span> Termodinamik va elektrokimyoviy xususiyatlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Barqarorlik</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">log β₄:</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.stability.logBeta4}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Stepwise:</span>
                  <span className="text-orange-400 text-xs font-mono">{COMPOUND.thermodynamics.stability.stepwise}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Taqqoslash:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.stability.comparison}</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Redoks xususiyatlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Pt²⁺ → Pt⁴⁺:</span>
                  <span className="text-orange-400 text-xs font-mono">{COMPOUND.thermodynamics.redox.pt2_to_pt4}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Disproporsiya:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.redox.disproportionation}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Oksidlanish:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.redox.oxidation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* YaMR SIGNAL JADVALI */}
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
                    <td className="py-3 px-3 text-xs">{signal.ligand}</td>
                    <td className="py-3 px-3 text-amber-400 font-mono font-bold">{signal.shift}</td>
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

        {/* INTERAKTIV ¹⁹⁵Pt YaMR SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv ¹⁹⁵Pt YaMR spektr — REFERENSLAR BILAN</h2>
          <p className="text-purple-200 leading-relaxed mb-6">
            ¹⁹⁵Pt kimyoviy siljish diapazoni juda keng (-4000 dan +2000 ppm). [PtCl₄]²⁻ <strong className="text-amber-400">+1620 ppm</strong> da.
            Boshqa referens komplekslar ham ko'rsatilgan.
          </p>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              ¹⁹⁵Pt kimyoviy siljish: {ptPpmSlider} ppm
            </label>
            <input
              type="range"
              min="-4000"
              max="2000"
              step="10"
              value={ptPpmSlider}
              onChange={(e) => setPtPpmSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="195Pt kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>-4000</span>
              <span>-3850</span>
              <span>-2100</span>
              <span>0 (ref)</span>
              <span>+1620</span>
              <span>+2000</span>
            </div>
          </div>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                <div className="text-xl font-mono font-bold text-amber-400">{ptPpmSlider} ppm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Signal:</div>
                <div className="text-xl font-mono font-bold text-amber-400 text-sm">
                  {currentPtSignal.notes !== "—" ? currentPtSignal.notes : "Signal yo'q"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Multiplicity:</div>
                <div className="text-xl font-mono font-bold text-amber-400">O'tkir singlet</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-96">
            <svg viewBox="0 0 600 340" className="w-full h-full overflow-visible" role="img" aria-label="195Pt YaMR spektr">
              <title>¹⁹⁵Pt YaMR spektr simulyatsiyasi — [PtCl₄]²⁻</title>
              {[-4000, -3000, -2000, -1000, 0, 1000, 2000].map((ppm, i) => {
                const x = 580 - ((ppm + 4000) / 6000) * 530
                return (
                  <g key={i}>
                    <line x1={x} y1="280" x2={x} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={x} y="295" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                  </g>
                )
              })}
              <text x="310" y="318" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="150" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 150)">Intensivlik</text>

              {/* [Pt(CN)₄]²⁻ signali -3850 ppm */}
              <line x1={580 - ((-3850 + 4000) / 6000) * 530} y1="280" x2={580 - ((-3850 + 4000) / 6000) * 530} y2="200" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x={580 - ((-3850 + 4000) / 6000) * 530} y="195" textAnchor="middle" fontSize="7" fill="#ef4444">[Pt(CN)₄]²⁻</text>

              {/* [Pt(NH₃)₄]²⁺ signali -2350 ppm */}
              <line x1={580 - ((-2350 + 4000) / 6000) * 530} y1="280" x2={580 - ((-2350 + 4000) / 6000) * 530} y2="220" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x={580 - ((-2350 + 4000) / 6000) * 530} y="215" textAnchor="middle" fontSize="7" fill="#ef4444">[Pt(NH₃)₄]²⁺</text>

              {/* Sisplatin signali -2100 ppm */}
              <line x1={580 - ((-2100 + 4000) / 6000) * 530} y1="280" x2={580 - ((-2100 + 4000) / 6000) * 530} y2="200" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x={580 - ((-2100 + 4000) / 6000) * 530} y="195" textAnchor="middle" fontSize="7" fill="#ef4444">Sisplatin</text>

              {/* Transplatin signali -1850 ppm */}
              <line x1={580 - ((-1850 + 4000) / 6000) * 530} y1="280" x2={580 - ((-1850 + 4000) / 6000) * 530} y2="220" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x={580 - ((-1850 + 4000) / 6000) * 530} y="215" textAnchor="middle" fontSize="7" fill="#ef4444">Transplatin</text>

              {/* [PtCl₆]²⁻ referens signali 0 ppm */}
              <line x1={580 - ((0 + 4000) / 6000) * 530} y1="280" x2={580 - ((0 + 4000) / 6000) * 530} y2="150" stroke="#22c55e" strokeWidth="2" />
              <text x={580 - ((0 + 4000) / 6000) * 530} y="145" textAnchor="middle" fontSize="8" fill="#22c55e" fontWeight="bold">[PtCl₆]²⁻ (ref)</text>

              {/* [PtCl₄]²⁻ signali +1620 ppm — ASOSIY SIGNAL */}
              <line x1={580 - ((1620 + 4000) / 6000) * 530} y1="280" x2={580 - ((1620 + 4000) / 6000) * 530} y2="50" stroke="#fbbf24" strokeWidth="3" />
              <text x={580 - ((1620 + 4000) / 6000) * 530} y="45" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">
                [PtCl₄]²⁻ (bu birikma)
              </text>

              {/* Slider pozitsiyasi */}
              <line
                x1={580 - ((ptPpmSlider + 4000) / 6000) * 530}
                y1="280"
                x2={580 - ((ptPpmSlider + 4000) / 6000) * 530}
                y2="20"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4,2"
              />

              {/* Referenslar annotatsiya */}
              <text x="310" y="335" textAnchor="middle" fontSize="8" fill="#a78bfa" fontStyle="italic">
                Kuchli maydon ligandlari (CN⁻) → past ppm (shielded). Kuchsiz maydon (Cl⁻) → yuqori ppm (deshielded).
              </text>
            </svg>
          </div>
          <div className="bg-amber-900/30 rounded-lg p-3">
            <p className="text-amber-300 text-xs">
              <strong>📌 Muhim:</strong> [PtCl₄]²⁻ = +1620 ppm (bu birikma). [PtCl₆]²⁻ = 0 ppm (zamonaviy referens).
              Kuchli maydon ligandlari (CN⁻) → past ppm (shielded). Kuchsiz maydon ligandlari (Cl⁻) → yuqori ppm (deshielded).
              Bu tendentsiya spektrokimyoviy qator bilan bog'liq.
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
              <h3 className="text-amber-400 font-bold mb-3">Magnus (1828)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.magnus.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.magnus.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.magnus.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Ahamiyat:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.magnus.significance}</span>
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
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">YaMR davri (1960-70)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olimlar:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.nmr_era.scientists}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.nmr_era.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.nmr_era.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.nmr_era.contribution}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">IUPAC Ξ skalasi (1970)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Tashkilot:</span>
                  <span className="text-amber-400">{COMPOUND.history.iupac.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.iupac.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.iupac.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Ahamiyat:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.iupac.significance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span> Taqqoslash — boshqa Pt komplekslari
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Kompleks</th>
                  <th className="py-3 px-3 text-teal-400">Ligand</th>
                  <th className="py-3 px-3 text-teal-400">Geometriya</th>
                  <th className="py-3 px-3 text-teal-400">¹⁹⁵Pt (ppm)</th>
                  <th className="py-3 px-3 text-teal-400">Simmetriya</th>
                  <th className="py-3 px-3 text-teal-400">Qo'llanish</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparison.map((comp, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/30 ${i === 0 ? "bg-amber-900/20" : ""}`}>
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{comp.compound}</td>
                    <td className="py-3 px-3 text-xs">{comp.ligand}</td>
                    <td className="py-3 px-3 text-xs">{comp.geometry}</td>
                    <td className="py-3 px-3 text-xs font-mono text-amber-400">{comp.nmrShift}</td>
                    <td className="py-3 px-3 text-xs font-mono">{comp.symmetry}</td>
                    <td className="py-3 px-3 text-xs">{comp.use}</td>
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
                  <th className="py-3 px-3 text-amber-400">Ta'sir</th>
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
            <li><strong className="text-amber-400">¹⁹⁵Pt YaMR referens:</strong> [PtCl₄]²⁻ — +1620 ppm (Na₂[PtCl₆] = 0 ppm referensga nisbatan)</li>
            <li><strong className="text-amber-400">Ξ skalasi:</strong> Ξ(¹⁹⁵Pt) = 21.4 MHz — magnit maydoniga bog'liq bo'lmagan o'zgarmas</li>
            <li><strong className="text-amber-400">Kristall maydon nazariyasi:</strong> Pt²⁺ (5d⁸), tekis kvadrat, diamagnit, barcha 8 elektron past orbitallarda</li>
            <li><strong className="text-amber-400">Simmetriya (D₄ₕ):</strong> 16 ta simmetriya elementi, markaziy simmetriya (i), η ≈ 0</li>
            <li><strong className="text-amber-400">Mutual exclusion:</strong> IR va Raman spektrlari ustma-ust tushmaydi</li>
            <li><strong className="text-amber-400">Strukturaviy:</strong> Pt-Cl = 2.31 Å, Cl-Pt-Cl = 90° (cis), 180° (trans)</li>
            <li><strong className="text-amber-400">π-bog'lanish:</strong> Cl⁻ kuchli π-donor → Pt elektron zichligi kamayadi → deshielding (+1620 ppm)</li>
            <li><strong className="text-amber-400">Barqarorlik:</strong> log β₄ ≈ 10¹⁶</li>
            <li><strong className="text-amber-400">Tarix:</strong> Magnus (1828), Werner (1893), IUPAC Ξ skalasi (1970-yillar)</li>
            <li><strong className="text-amber-400">Taqqoslash:</strong> [PtCl₆]²⁻ (0 ppm), sisplatin (-2100 ppm), transplatin (-1850 ppm)</li>
            <li><strong className="text-amber-400">Kengaytiruvchi:</strong> VT-NMR, IR/Raman, CP/MAS, XRD, CV</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Birikmalar katalogi</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmares/rh-pph3-3-cl" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">Wilkinson katalizatori →</Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [PtCl₄]²⁻ (Tetraxloroplatinat(II)) • YaMR spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Pregosin (1983), Still &amp; Neumann (1975), IUPAC Ξ skalasi, Cotton-Wilkinson, Miessler-Tarr, Greenwood-Earnshaw, Magnus (1828)</p>
        </div>
      </footer>
    </main>
  )
}