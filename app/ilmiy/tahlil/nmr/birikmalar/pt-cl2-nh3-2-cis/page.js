"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// cis-[PtCl₂(NH₃)₂] — SISPLATIN YaMR (ILMIY BOYITILGAN)
// Manbalar: Peyrone (1845), Rosenberg (1965), Jamieson & Lippard (1999),
//           Still & Neumann (1975), Pregosin (1983), Cotton-Wilkinson, Miessler-Tarr
// Xususiyat: ¹⁹⁵Pt YaMR, J(Pt-H) = 45 Hz, DNK crosslink, saraton dori
//  ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "cis-[PtCl<sub>2</sub>(NH<sub>3</sub>)<sub>2</sub>]",
  formulaPlain: "cis-[PtCl2(NH3)2]",
  iupac: "cis-Diammindixloroplatina(II)",
  commonName: "Sisplatin (Platinol, saraton dori)",
  molarMass: 300.05,
  casNumber: "15663-27-1",
  color: "sariq (yellow)",
  structure: "Tekis kvadrat (Square planar, C₂ᵥ)",
  metalLigand: "Pt-N (NH₃), Pt-Cl",
  pointGroup: "C₂ᵥ",
  electrolyteType: "Noelektrolit (suvda sekin aquation)",
  molarConductivity: "~0 S·cm²/mol (DMF da)",
  solubility: "DMF, DMSO da yaxshi eriydi; suvda 2.53 g/L (25°C, sekin)",
  //  ═══════════════════════════════════════════════════════════════
  // KRISTALL MAYDON NAZARIYASI — TEKIS KVADRAT d⁸
  //  ═══════════════════════════════════════════════════════════════
  crystalField: {
    metalIon: "Pt²⁺",
    electronConfig: "[Xe] 4f¹⁴ 5d⁸",
    dElectrons: 8,
    spinState: "Past spinli (har doim — 5d⁸ da)",
    orbitalOccupancy: "Tekis kvadrat: (dxy)² (dz²)² (dxz,dyz)⁴ (dx²-y²)⁰",
    unpairedElectrons: 0,
    magneticMoment: "0 BM (diamagnit)",
    crystalFieldSplitting: "Tekis kvadrat: dx²-y² eng yuqori, Δ₁ ≈ 30,000 cm⁻¹",
    racahParameter: "B ≈ 400 cm⁻¹ (5d orbitallar keng tarqalgan)",
    nephelauxeticRatio: "β = B/B₀ ≈ 0.35 (juda kuchli kovalentlik)",
    pairingEnergy: "P ≈ 15,000 cm⁻¹",
    cFSE: "CFSE ≈ -24,000 cm⁻¹ (tekis kvadrat, juda barqaror)",
    spectrochemicalSeries: "Cl⁻ < NH₃ (NH₃ kuchliroq maydon)",
    whySquarePlanar: "5d⁸ elektron konfiguratsiya — katta Δ₁ (kristall maydon bo'linishi). Oktaedr emas, tekis kvadrat afzal (Jahn-Teller distorsiyasi o'xshash). Barcha Pt²⁺, Pd²⁺, Au³⁺, Ir⁺ d⁸ komplekslar tekis kvadrat.",
    colorOrigin: "d-d o'tishlar Laporte ta'qiqlangan. Sariq rang — LMCT (Cl⁻ → Pt²⁺) ~28,000 cm⁻¹ (350 nm, UV-chegara) + kuchsiz d-d. Asosiy yutilish UV da.",
    chargeTransfer: "LMCT: Cl⁻ (p) → Pt²⁺ (dx²-y²) ~350 nm (ε ≈ 200). MLCT past energiyada kuzatilmaydi."
  },
  //  ═══════════════════════════════════════════════════════════════
  // SIMMETRIYA
  //  ═══════════════════════════════════════════════════════════════
  symmetry: {
    pointGroup: "C₂ᵥ",
    order: 4,
    symmetryElements: ["E", "C₂ (Pt orqali, N-Pt-N bisector)", "σᵥ (molekulyar tekislik)", "σᵥ' (perpendicular, N-Pt-N va Cl-Pt-Cl bisector)"],
    characterTable: {
      A1: { E: 1, C2: 1, σv: 1, σv_prime: 1, functions: "z, x², y², z²" },
      A2: { E: 1, C2: 1, σv: -1, σv_prime: -1, functions: "Rz, xy" },
      B1: { E: 1, C2: -1, σv: 1, σv_prime: -1, functions: "x, Ry, xz" },
      B2: { E: 1, C2: -1, σv: -1, σv_prime: 1, functions: "y, Rx, yz" }
    },
    nmrEquivalence: "C₂ᵥ simmetriya: 2 ta NH₃ ligand ekvivalent (C₂ o'q orqali bir-biriga o'tadi). 2 ta Cl ligand ham ekvivalent. Shuning uchun ¹H YaMR da 1 ta signal (6H), ¹⁹⁵Pt YaMR da 1 ta signal.",
    irActive: "A₁ + B₁ + B₂ — IR faol (3N-6 = 9 tebranish, ~6 ta IR faol)",
    ramanActive: "A₁ + A₂ + B₁ + B₂ — Raman faol",
    mutualExclusion: "C₂ᵥ da markaziy simmetriya yo'q — IR va Raman ustma-ust tushadi",
    transInfluence: "Cl⁻ trans-influence: kuchli (Pt-N bog'ni zaiflashtiradi). NH₃ trans-influence: o'rta."
  },
  //  ═══════════════════════════════════════════════════════════════
  // YaMR NAZARIYASI — CHUQUR (METALL YADROLARI)
  //  ═══════════════════════════════════════════════════════════════
  nmrTheory: {
    h1: {
      nucleus: "¹H (I = 1/2, 100% tabiiy)",
      shift: "4.2 ppm (NH₃, C₂ᵥ simmetriyada barcha 6H ekvivalent)",
      whyThisShift: "NH₃ ligand Pt²⁺ ga bog'langan. Pt²⁺ kuchli elektropozitiv va 5d orbitali keng tarqalgan → NH₃ protonlari deshielded (erkin NH₃ ~0.9 ppm, kompleksda 4.2 ppm → Δδ = +3.3 ppm). Metal effekti kuchli (5d > 3d > 4d).",
      multiplicity: "Markaziy singlet + ¹⁹⁵Pt satellit dubletlari (J = 45 Hz)",
      linewidth: "~2-5 Hz (o'tkir, diamagnit)",
      t1Relaxation: "T₁ ≈ 1-3 s (dipol-dipol mexanizm)",
      couplingNotes: "¹J(¹H-¹⁹⁵Pt) = 45 Hz. ¹⁹⁵Pt tabiiy tarqalishi 33.8% (I=1/2) — shuning uchun ¹H spektrida har bir NH₃ signalining ikki tomonida 16.9% dan iborat dubletlar ko'rinadi ('satellit signallar'). Markaziy pik (66.2% — ¹⁹⁵Pt bo'lmagan izotoplar uchun) singlet ko'rinadi.",
      satellites: "16.9% × 2 = 33.8% ¹⁹⁵Pt dan, 66.2% boshqa izotoplar (¹⁹⁴Pt, ¹⁹⁶Pt, ¹⁹⁸Pt — barchasi I=0). J(Pt-H) bog'lanish konstantasi orqali Pt-N bog'ining kovalent xarakteri baholanadi."
    },
    n15: {
      nucleus: "¹⁵N (I = 1/2, 0.37% tabiiy)",
      shift: "-60 ppm (referens: CH₃NO₂, 0 ppm)",
      whyThisShift: "Pt²⁺ ga bog'langan NH₃ — N elektron zichligi kamayadi (deshielding). Lekin NH₃ kuchli σ-donor bo'lgani uchun biroz yuqori maydon (shielded). Natijada -60 ppm (erkin NH₃ ~-380 ppm ga nisbatan kuchli deshielded).",
      sensitivity: "Juda past sezgirlik (0.37% tabiiy, past γ). ¹⁵N boyitish tavsiya etiladi.",
      linewidth: "~20-50 Hz",
      t1Relaxation: "T₁ ≈ 30-100 s",
      couplingNotes: "¹J(¹⁵N-¹⁹⁵Pt) ≈ 400-500 Hz (kuchli bog'lanish — to'g'ridan-to'g'ri Pt-N bog')"
    },
    pt195: {
      nucleus: "¹⁹⁵Pt (I = 1/2, 33.8% tabiiy)",
      shift: "-2100 ppm (referens: [PtCl₆]²⁻, 0 ppm)",
      whyThisShift: "¹⁹⁵Pt kimyoviy siljishi juda keng diapazon (-10,000 dan +10,000 ppm). Sisplatin da -2100 ppm — Pt²⁺ (d⁸ tekis kvadrat). Trans-platin da -1850 ppm (250 ppm farq!). Bu siljish geometriya va ligandlarga juda sezgir.",
      sensitivity: "¹⁹⁵Pt — eng yaxshi metall yadrolaridan biri! 33.8% tabiiy tarqalish, I=1/2, o'rta γ. Sezgirlik ¹H dan ~10 marta past, lekin boshqa metall yadrolaridan (⁵⁹Co, ¹⁰³Rh) ancha yaxshi.",
      linewidth: "~20-100 Hz (o'rta, kichik CSA)",
      t1Relaxation: "T₁ ≈ 1-5 s (CSA dominant mexanizm)",
      csa: "Kimyoviy siljish anizotropiyasi: Δσ ≈ 3000-5000 ppm (tekis kvadrat, juda katta CSA)",
      referencing: "Referens: Na₂[PtCl₆] (0 ppm) yoki [PtCl₄]²⁻ (1620 ppm). IUPAC tavsiyasi: Ξ (Xi) skalasi — ¹⁹⁵Pt frekansi / ¹H TMS frekansi × 100.",
      applications: "Geometriya aniqlash (cis vs trans), ligand almashinish kinetikasi, DNK bilan bog'lanishni kuzatish"
    },
    cl35: {
      nucleus: "³⁵Cl (I = 3/2, 75.8% tabiiy)",
      shift: "~100 ppm (referens: Cl⁻ (aq), 0 ppm)",
      whyThisShift: "Kvadrupol yadro (I=3/2) — juda keng chiziqlar. Odatda to'g'ridan-to'g'ri kuzatilmaydi.",
      quadrupolar: "Kvadrupol (I=3/2), CQ ≈ 20-40 MHz (katta)",
      linewidth: "~10,000-50,000 Hz (juda keng)",
      detection: "Qiyin — maxsus texnikalar kerak. Odatda ³⁵Cl YaMR emas, ¹⁹⁵Pt YaMR orqali bilvosita kuzatiladi."
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY PARAMETRLAR
  //  ═══════════════════════════════════════════════════════════════
  structuralData: {
    bondLengths: {
      ptN: "2.03-2.05 Å (Pt-N, NH₃)",
      ptCl: "2.31-2.33 Å (Pt-Cl)",
      comparison: "trans-platin: Pt-N = 2.05 Å, Pt-Cl = 2.32 Å (deyarli bir xil). Lekin trans ta'sirlar farq qiladi. [Pt(NH₃)₄]²⁺ da Pt-N = 2.04 Å.",
      transEffectEvidence: "Cl⁻ trans-influence kuchi: Cl⁻ > NH₃. Shuning uchun Cl⁻ ga trans-NH₃ bog'i biroz uzunroq bo'lishi kerak (eksperimental farq ~0.01 Å)."
    },
    bondAngles: {
      nPtN: "90-92° (cis N-Pt-N)",
      clPtCl: "90-92° (cis Cl-Pt-Cl)",
      nPtCl: "88-90° (N-Pt-Cl)",
      sumAngles: "360° (tekis kvadrat, barcha ligandlar bir tekislikda)"
    },
    transEffect: {
      order: "Cl⁻ > NH₃ (kinetik trans-effekt)",
      mechanism: "σ-bog'lanish + π-bog'lanish (Cl⁻ π-donor, NH₃ faqat σ-donor)",
      consequence: "Aquation reaksiyasida Cl⁻ ga trans-NH₃ chiqadi (lekin sisplatinda ikkalasi ham cis)",
      transInfluence: "Termodinamik trans-influence: Pt-Cl bog'ning kuchligi ligandning trans-influence ga bog'liq"
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // KLINIK VA FARMAKOLOGIK MA'LUMOTLAR
  //  ═══════════════════════════════════════════════════════════════
  clinical: {
    mechanism: {
      activation: "Aquation: [PtCl₂(NH₃)₂] + H₂O → [PtCl(H₂O)(NH₃)₂]⁺ + Cl⁻ (sekin, t₁/₂ ≈ 2-3 soat, 37°C)",
      dnaBinding: "Aquatsiyalangan kompleks DNK ga bog'lanadi — 1,2-intrastrand crosslink (GpG yoki ApG)",
      crosslink: "Pt²⁺ ikkita guanin N7 pozitsiyasiga bog'lanadi → DNK spiralini buzadi",
      consequence: "DNK replikatsiyasi va transkripsiyasi to'xtaydi → apoptoz (hujayra o'limi)",
      selectivity: "Tez bo'linadigan saraton hujayralari ko'proq zarar ko'radi"
    },
    applications: [
      { cancer: "Testikulyar saraton", cure: "90%+ muvaffaqiyat (Lance Armstrong misol)", dose: "20 mg/m²/kun × 5 kun" },
      { cancer: "Tuxumdon saratoni", cure: "Standard terapiya", dose: "75 mg/m²" },
      { cancer: "Qovuq saratoni", cure: "Kombinatsiyalangan terapiya", dose: "70 mg/m²" },
      { cancer: "Bosh va bo'yin saratoni", cure: "Radiatsiya bilan", dose: "100 mg/m²" },
      { cancer: "O'pka saratoni (kichik hujayrali)", cure: "Kombinatsiya", dose: "80 mg/m²" }
    ],
    sideEffects: {
      nephrotoxicity: "Buyrak toksikligi (asosiy cheklovchi omil). Gidratatsiya bilan kamaytiriladi.",
      neurotoxicity: "Periferik neuropatiya (akut va surunkali). Doza bog'liq.",
      ototoxicity: "Eshitish qobiliyatining yo'qolishi (yuqori chastotali).",
      myelosuppression: "Suyak iligi supressiyasi (kamroq, carboplatin da kuchliroq).",
      emesis: "Kuchli ko'ngil aynishi (ondansetron bilan boshqariladi)."
    },
    resistance: {
      mechanisms: ["Kam hujayra ichiga kirish (CTR1 downregulation)", "Glutation bilan inaktivatsiya", "DNK ta'mirlash (NER)", "Toleransiya oshishi"],
      solution: "Kombinatsiyalangan terapiya, yangi avlod platinlar (carboplatin, oxaliplatin)"
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // TERMODINAMIK VA KINETIK PARAMETRLAR
  //  ═══════════════════════════════════════════════════════════════
  thermodynamics: {
    aquation: {
      reaction1: "cis-[PtCl₂(NH₃)₂] + H₂O → [PtCl(H₂O)(NH₃)₂]⁺ + Cl⁻",
      k1: "k₁ = 4.4 × 10⁻⁵ s⁻¹ (37°C, pH 7.4)",
      t_half_1: "t₁/₂ ≈ 4 soat",
      reaction2: "[PtCl(H₂O)(NH₃)₂]⁺ + H₂O → [Pt(H₂O)₂(NH₃)₂]²⁺ + Cl⁻",
      k2: "k₂ = 1.1 × 10⁻⁵ s⁻¹ (37°C)",
      t_half_2: "t₁/₂ ≈ 17 soat",
      intracellular: "Hujayra ichida [Cl⁻] past (4 mM) → aquation tezlashadi (qon [Cl⁻] = 100 mM da sekin)"
    },
    dnaBinding: {
      rate: "k_DNA ≈ 10⁻² M⁻¹·s⁻¹ (monoadduct)",
      crosslinking: "k_cross ≈ 10⁻³ s⁻¹ (monoadduct → crosslink)",
      adductRatio: "90% 1,2-GpG intrastrand, 5% 1,3-GpG, 2% interstrand, 3% monoadduct",
      binding: "DNK bilan bog'lanish: K ≈ 10⁴ M⁻¹"
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  //  ═══════════════════════════════════════════════════════════════
  history: {
    peyrone: {
      year: 1845,
      scientist: "Michele Peyrone (Italiya)",
      achievement: "Sisplatinni birinchi marta sintez qildi",
      name: "'Peyrone tuzi' deb nomlangan",
      significance: "Koordinatsion kimyoning dastlabki misollaridan biri"
    },
    werner: {
      year: 1893,
      scientist: "Alfred Werner (Shveytsariya)",
      achievement: "Sis-trans izomerizmni tushuntirdi",
      contribution: "Koordinatsion nazariya — tekis kvadrat geometriya (Nobel 1913)"
    },
    rosenberg: {
      year: 1965,
      scientist: "Barnett Rosenberg (AQSh, Michigan State)",
      achievement: "Sisplatinning anti-tumor faolligini kashf qildi",
      discovery: "E. coli bakteriyalarini elektr maydonida o'stirayotganda, Pt elektrodlardan ajralgan sisplatin hujayra bo'linishini to'xtatganini ko'rdi",
      clinical: "1978 yilda FDA tomonidan tasdiqlangan (testikulyar saraton)",
      impact: "Zamonaviy kimyoterapiyaning asoschisi"
    },
    lippard: {
      year: 1985,
      scientist: "Stephen J. Lippard (MIT)",
      achievement: "Sisplatin-DNK addukt kristall strukturasini aniqladi",
      contribution: "1,2-intrastrand crosslink mexanizmini tasdiqladi",
      structure: "HMG1 proteinasi cisplatin-DNK adduktni taniydi → apoptoz signal"
    }
  },
  //  ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH — BOSHQA PLATIN KOMPLEKSLARI
  //  ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      compound: "cis-[PtCl₂(NH₃)₂] (Sisplatin)",
      generation: "1-avlod",
      color: "Sariq",
      nmrShift: "¹⁹⁵Pt: -2100 ppm",
      jPtH: "¹J(Pt-H) = 45 Hz",
      activity: "Kuchli (testicular 90%+)",
      toxicity: "Nephro-, neuro-, ototoksik"
    },
    {
      compound: "trans-[PtCl₂(NH₃)₂] (Transplatin)",
      generation: "Samarasiz",
      color: "Sariq",
      nmrShift: "¹⁹⁵Pt: -1850 ppm (250 ppm farq)",
      jPtH: "¹J(Pt-H) = 65 Hz",
      activity: "Faol emas (crosslink hosil qilmaydi)",
      toxicity: "Kuchsiz"
    },
    {
      compound: "[Pt(CBDCA)(NH₃)₂] (Carboplatin)",
      generation: "2-avlod",
      color: "Rangsiz",
      nmrShift: "¹⁹⁵Pt: -1700 ppm",
      jPtH: "— (H yo'q)",
      activity: "O'xshash, sekinroq",
      toxicity: "Kamroq nefrotoksik, ko'proq miyelotoksik"
    },
    {
      compound: "[Pt(DACH)(ox)] (Oxaliplatin)",
      generation: "3-avlod",
      color: "Oq",
      nmrShift: "¹⁹⁵Pt: -2200 ppm",
      jPtH: "—",
      activity: "Kolon saratoni uchun",
      toxicity: "Boshqa toksiklik profili"
    },
    {
      compound: "[PtCl₄]²⁻ (Tetraxloroplatinat)",
      generation: "Prekursor",
      color: "Qizil-jigar",
      nmrShift: "¹⁹⁵Pt: 1620 ppm (referens)",
      jPtH: "—",
      activity: "—",
      toxicity: "—"
    }
  ],
  // YaMR ma'lumotlari
  nmrNucleus: "¹H, ¹⁵N, ¹⁹⁵Pt",
  chemicalShift: "¹H: 4.2 ppm (NH₃, satellitlar bilan), ¹⁹⁵Pt: -2100 ppm",
  multiplicity: "¹H: singlet + dublet-satellitlar (J = 45 Hz)",
  jCoupling: "¹J(Pt-H) = 45 Hz",
  // YaMR signallar (batafsil)
  nmrSignals: [
    {
      nucleus: "¹H",
      ligand: "NH₃ (barcha 4 H ekvivalent, 2 ta NH₃)",
      shift: 4.2,
      multiplicity: "singlet (markaziy) + dublet (satellitlar)",
      jCoupling: "¹J(Pt-H) = 45 Hz",
      integration: "6H",
      notes: "Markaziy pik — ¹⁹⁵Pt bo'lmagan izotoplar (¹⁹⁴Pt, ¹⁹⁶Pt, ¹⁹⁸Pt, I=0) — 66.2%. Ikkita satellit pik — ¹⁹⁵Pt (I=1/2, 33.8%) bilan bog'lanish, J = 45 Hz."
    },
    {
      nucleus: "¹⁵N",
      ligand: "NH₃ (N atomi)",
      shift: -60,
      multiplicity: "singlet (markaziy) + dublet (satellitlar)",
      jCoupling: "¹J(Pt-N) ≈ 450 Hz",
      integration: "2N",
      notes: "¹⁵N YaMR da ¹J(Pt-N) katta (to'g'ridan-to'g'ri Pt-N bog'). ¹⁵N boyitish tavsiya etiladi."
    },
    {
      nucleus: "¹⁹⁵Pt",
      ligand: "Pt markaz",
      shift: -2100,
      multiplicity: "kvintet (quintet, ¹⁹⁵Pt-¹⁴N bog'lanish, I(¹⁴N)=1, 2nI+1=5)",
      jCoupling: "¹J(Pt-N) ≈ 450 Hz (¹⁴N bilan, keng)",
      integration: "1Pt",
      notes: "¹⁹⁵Pt YaMR — -2100 ppm da kvintet (¹⁴N I=1 bilan, 2·2·1+1=5). Trans-platin da -1850 ppm (250 ppm farq — geometriya aniqlash uchun)."
    }
  ],
  // YaMR spektr ma'lumotlari (simulyatsiya uchun)
  nmrSpectrum: [
    { ppm: 0, intensity: 0, notes: "TMS referens" },
    { ppm: 1, intensity: 0, notes: "—" },
    { ppm: 2, intensity: 0, notes: "—" },
    { ppm: 3.5, intensity: 0, notes: "—" },
    { ppm: 3.75, intensity: 0.17, notes: "¹H satellit (past maydon, ¹⁹⁵Pt)" },
    { ppm: 4.2, intensity: 0.66, notes: "¹H: NH₃ markaziy (6H)" },
    { ppm: 4.65, intensity: 0.17, notes: "¹H satellit (yuqori maydon, ¹⁹⁵Pt)" },
    { ppm: 5, intensity: 0, notes: "—" },
    { ppm: 6, intensity: 0, notes: "—" },
    { ppm: 7, intensity: 0, notes: "—" }
  ],
  // ¹⁹⁵Pt YaMR spektr ma'lumotlari
  pt195Spectrum: [
    { ppm: -2400, intensity: 0, notes: "—" },
    { ppm: -2320, intensity: 0.2, notes: "¹⁹⁵Pt kvintet (1-qism)" },
    { ppm: -2210, intensity: 0.4, notes: "¹⁹⁵Pt kvintet (2-qism)" },
    { ppm: -2100, intensity: 0.6, notes: "¹⁹⁵Pt kvintet (markaziy, -2100 ppm)" },
    { ppm: -1990, intensity: 0.4, notes: "¹⁹⁵Pt kvintet (4-qism)" },
    { ppm: -1880, intensity: 0.2, notes: "¹⁹⁵Pt kvintet (5-qism)" },
    { ppm: -1850, intensity: 0, notes: "Trans-platin bo'lsa — bu yerda signal" },
    { ppm: -1700, intensity: 0, notes: "—" }
  ],
  // Halaqit beruvchi omillar
  interferences: [
    {
      source: "trans-[PtCl₂(NH₃)₂] (transplatin) aralashmasi",
      effect: "¹⁹⁵Pt YaMR da -1850 ppm da qo'shimcha signal (250 ppm farq). ¹J(Pt-H) = 65 Hz (45 Hz o'rniga).",
      severity: "Yuqori",
      solution: "Sof cis-izomer sintez qilish. Sintezda K₂PtCl₄ + NH₃ → K[PtCl₃(NH₃)] + NH₃ → cis-[PtCl₂(NH₃)₂]. Trans-izomer hosil bo'lmaydi (kinetik nazorat).",
      theoryNote: "Sisplatin va transplatin — strukturaviy izomerlar. ¹⁹⁵Pt YaMR da 250 ppm farq — eng oson farqlash usuli. Klinik jihatdan faqat sisplatin faol."
    },
    {
      source: "Aquation mahsulotlari",
      effect: "[PtCl(H₂O)(NH₃)₂]⁺ va [Pt(H₂O)₂(NH₃)₂]²⁺ signallar (-1800 dan -2000 ppm gacha)",
      severity: "O'rta",
      solution: "Yangi tayyorlangan eritma. DMSO-d₆ da saqlash (suv bo'lmasa, aquation sekin).",
      theoryNote: "Suvli eritmada sisplatin sekin aquation qilib [PtCl(H₂O)(NH₃)₂]⁺ hosil qiladi (t₁/₂ ≈ 4 soat). ¹⁹⁵Pt signali -1800 ppm atrofida."
    },
    {
      source: "K₂[PtCl₄] yoki K₂[PtCl₆] qoldiqlari (sintezdan)",
      effect: "[PtCl₄]²⁻: ¹⁹⁵Pt 1620 ppm da, [PtCl₆]²⁻: ¹⁹⁵Pt 0 ppm da",
      severity: "Past",
      solution: "Sof sintez. Rekristallizatsiya orqali tozalash.",
      theoryNote: "K₂[PtCl₄] — sisplatin sintezining prekursori (Pt²⁺, 1620 ppm). K₂[PtCl₆] — Pt⁴⁺, 0 ppm (referens)."
    },
    {
      source: "¹⁹⁵Pt CSA (Kimyoviy siljish anizotropiyasi)",
      effect: "Yuqori magnit maydonida chiziqlar kengayadi (Δσ ≈ 3000-5000 ppm)",
      severity: "O'rta",
      solution: "O'rta magnit maydonida ishlash (400 MHz). MAS (Magic Angle Spinning) qattiq holatda.",
      theoryNote: "Tekis kvadrat geometriya katta CSA beradi. CSA × B₀ chiziq kengligiga ta'sir qiladi. Yuqori B₀ da chiziqlar kengroq."
    },
    {
      source: "Erituvchi (D₂O vs DMSO-d₆)",
      effect: "D₂O da aquation tez, ¹⁹⁵Pt signali o'zgaradi",
      severity: "O'rta",
      solution: "DMSO-d₆ da ishlash tavsiya etiladi (aquation sekin).",
      theoryNote: "DMSO-d₆ da sisplatin barqaror. D₂O da aquation sodir bo'ladi — DNK bilan bog'lanish mexanizmini takrorlaydi."
    },
    {
      source: "DNK yoki boshqa nukleofillar (agar qo'shilsa)",
      effect: "¹⁹⁵Pt signali -2500 dan -2800 ppm gacha siljiydi (DNK addukt)",
      severity: "Past (maxsus eksperiment)",
      solution: "DNK qo'shmaslik (agar maqsad sof sisplatin YaMR).",
      theoryNote: "Sisplatin DNK bilan 1,2-GpG crosslink hosil qilganda ¹⁹⁵Pt signali -2600 ppm atrofida siljiydi. Bu DNK bilan bog'lanishni kuzatish uchun ishlatiladi."
    }
  ],
  // Laboratoriya tartibi
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak, labor xalat. Sisplatin — KANSEROGEN va MUTAGEN. Havo almashinuvi yaxshi bo'lgan joyda ishlash. Teriga tegmasin.",
      time: "15 daq",
      theoryNote: "Sisplatin DNK bilan bog'lanadi — mutagen va karsinogen. Qo'lqopsiz ishlatmang. Chiqindilarni maxsus idishga tashlang."
    },
    {
      step: 2,
      title: "Sof cis-[PtCl₂(NH₃)₂] ni tayyorlash",
      desc: "Tijorat sisplatin (≥99.9%) yoki sintez. Sintez: K₂[PtCl₄] + NH₃ → K[PtCl₃(NH₃)] → cis-[PtCl₂(NH₃)₂] (Dhkar usuli). Sariq kristallar.",
      time: "1-2 kun (sintez) yoki tayyor",
      theoryNote: "K₂[PtCl₄] + NH₃ → K[PtCl₃(NH₃)] (trans-effekt: Cl⁻ > NH₃, NH₃ Cl⁻ o'rniga kiradi). Keyin yana NH₃ qo'shilsa, trans-effekt tufayli cis-izomer hosil bo'ladi (kinetik nazorat)."
    },
    {
      step: 3,
      title: "YaMR spektrometrni tayyorlash",
      desc: "YaMR spektrometrni yoqish, 30 daq stabillash. Shimlash (shimming). DMSO-d₆ erituvchi.",
      time: "30 daq",
      theoryNote: "DMSO-d₆ — sisplatin uchun eng yaxshi erituvchi (aquation bo'lmaydi). ¹H va ¹⁹⁵Pt kanallarini sozlash."
    },
    {
      step: 4,
      title: "Namuna tayyorlash",
      desc: "20-50 mg sisplatin ni 0.6 mL DMSO-d₆ da eritish. YaMR naychaga solish.",
      time: "10-15 daq",
      theoryNote: "DMSO-d₆ da sisplatin barqaror. ¹⁹⁵Pt YaMR uchun yuqori konsentratsiya (sezgirlik o'rta)."
    },
    {
      step: 5,
      title: "¹H YaMR spektrini olish",
      desc: "¹H YaMR spektrini olish (16-64 skan). NH₃ signalini tekshirish (4.2 ppm, satellitlar bilan).",
      time: "5-10 daq",
      theoryNote: "¹H YaMR da 4.2 ppm da markaziy singlet + ikkita satellit dublet (J = 45 Hz, har biri 16.9% intensivlik). ¹J(Pt-H) bog'lanish konstantasi."
    },
    {
      step: 6,
      title: "¹⁹⁵Pt YaMR spektrini olish",
      desc: "¹⁹⁵Pt YaMR spektrini olish (1000-5000 skan). Signal -2100 ppm da kvintet (¹⁴N bilan bog'lanish).",
      time: "1-3 soat",
      theoryNote: "¹⁹⁵Pt YaMR — -2100 ppm da kvintet (¹⁴N I=1 bilan, 2nI+1=5, J ≈ 450 Hz). Keng spektral diapazon (±5000 ppm) kerak."
    },
    {
      step: 7,
      title: "trans-izomer aralashmasini tekshirish",
      desc: "¹⁹⁵Pt YaMR da -1850 ppm da signal borligini tekshirish (bo'lsa, transplatin aralashmasi).",
      time: "5 daq",
      theoryNote: "Transplatin ¹⁹⁵Pt signal -1850 ppm da (250 ppm farq). Agar bu signal bo'lsa, namuna sof emas."
    },
    {
      step: 8,
      title: "DNK bilan bog'lanish testi (ixtiyoriy)",
      desc: "DNK qo'shib, ¹⁹⁵Pt YaMR kuzatish. Signal -2600 ppm ga siljiydi (DNK addukt).",
      time: "24-48 soat",
      theoryNote: "Sisplatin DNK bilan 1,2-GpG crosslink hosil qiladi. ¹⁹⁵Pt signali -2600 ppm ga siljiydi — bu DNK bilan bog'lanishni tasdiqlaydi."
    }
  ],
  // Kengaytiruvchi metodlar
  advancedTechniques: [
    {
      name: "1D ¹⁹⁵Pt YaMR (standart)",
      description: "¹⁹⁵Pt kimyoviy siljishini o'lchash (-2100 ppm)",
      advantages: ["Geometriya aniqlash", "Tez", "To'g'ridan-to'g'ri Pt kuzatish"],
      disadvantages: ["O'rta sezgirlik", "CSA kengayishi"],
      bestFor: "Geometriya, soflik, cis/trans farqlash",
      examples: "Sisplatin -2100 ppm, transplatin -1850 ppm, [PtCl₄]²⁻ 1620 ppm"
    },
    {
      name: "2D ¹H-¹⁹⁵Pt HMQC",
      description: "¹H va ¹⁹⁵Pt o'rtasidagi bog'lanishlarni aniqlash",
      advantages: ["¹J(Pt-H) aniq", "Murakkab sistemalar", "Yuqori sezgirlik"],
      disadvantages: ["Uzoq vaqt", "Maxsus uskunalar"],
      bestFor: "Bog'lanishlarni aniqlash, strukturaviy tahlil",
      examples: "¹H-¹⁹⁵Pt korrelyatsiya — 4.2 ppm va -2100 ppm o'rtasida"
    },
    {
      name: "VT-NMR (Variable Temperature)",
      description: "Haroratni o'zgartirib ligand almashinish kinetikasi",
      advantages: ["Kinetik parametrlar", "Mexanizm", "ΔG‡"],
      disadvantages: ["Uzoq vaqt", "Murakkab tahlil"],
      bestFor: "Aquation kinetikasi, ligand almashinish",
      examples: "Aquation k₁ = 4.4 × 10⁻⁵ s⁻¹ (37°C)"
    },
    {
      name: "Qattiq holat ¹⁹⁵Pt CP/MAS",
      description: "Kristall namuna uchun qattiq holat YaMR",
      advantages: ["CSA o'rganish", "Polimorfizm", "Erituvchi kerak emas"],
      disadvantages: ["Maxsus uskuna", "Uzoq vaqt", "Keng chiziqlar"],
      bestFor: "CSA, polimorfizm, qattiq holat struktura",
      examples: "CSA Δσ ≈ 3000-5000 ppm (tekis kvadrat)"
    },
    {
      name: "X-ray kristallografiya (SCXRD)",
      description: "Kristall strukturasini aniq aniqlash",
      advantages: ["Aniq bog' uzunliklari", "Geometriya", "3D struktura"],
      disadvantages: ["Kristall kerak", "Qimmat", "Uzoq vaqt"],
      bestFor: "Strukturaviy parametrlar, DNK addukt",
      examples: "Pt-N = 2.04 Å, Pt-Cl = 2.32 Å, cis geometriya"
    },
    {
      name: "ICP-MS (Inductively Coupled Plasma)",
      description: "Pt miqdorini aniq o'lchash (biologik namunalarda)",
      advantages: ["Juda sezgir (ppt)", "Miqdoriy", "Tez"],
      disadvantages: ["Namuna parchalanadi", "Struktura ma'lumot yo'q"],
      bestFor: "Farmakokinetika, DNK addukt miqdori",
      examples: "Hujayra ichida Pt konsentratsiyasi (μg/L)"
    }
  ]
}

export default function CisplatinPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [ppmSlider, setPpmSlider] = useState(4.2)
  const [ptPpmSlider, setPtPpmSlider] = useState(-2100)
  const [activeNmrNucleus, setActiveNmrNucleus] = useState("pt195")

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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950/30 to-blue-950 text-white">
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-amber-950 to-purple-950 border-2 border-amber-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">💊</span> cis-[PtCl₂(NH₃)₂] — SISPLATIN YaMR!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-amber-300">Sisplatin</strong> — eng muhim saraton dorilaridan biri!
              <strong className="text-amber-300"> ¹⁹⁵Pt YaMR</strong> — metall yadrolari YaMR ning klassik namunasi.
              <strong className="text-amber-300"> J(Pt-H) = 45 Hz</strong> satellit signallar, DNK crosslink, Nobel mukofoti!
            </p>
            <div className="bg-amber-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-amber-400 font-bold mb-2">🧲 YaMR signallar:</div>
                  <div className="text-purple-200">
                    <strong>¹⁹⁵Pt:</strong> -2100 ppm (kvintet)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹H:</strong> 4.2 ppm (satellitlar bilan)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹J(Pt-H):</strong> 45 Hz
                  </div>
                </div>
                <div>
                  <div className="text-amber-400 font-bold mb-2">🔬 Asosiy xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Geometriya:</strong> Tekis kvadrat
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Simmetriya:</strong> C₂ᵥ
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Klinik:</strong> Testicular 90%+
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-amber-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-amber-300">Knowledge Base:</strong> Peyrone (1845), Rosenberg (1965), Jamieson &amp; Lippard (1999),
                Still &amp; Neumann (1975), Pregosin (1983), Cotton-Wilkinson, Miessler-Tarr
              </p>
            </div>
            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-200">
                <strong className="text-red-300">⚠️ XAVFSIZLIK:</strong> Sisplatin — <strong>KANSEROGEN va MUTAGEN</strong>!
                DNK bilan bog'lanadi. Qo'lqopsiz ishlatmang. Chiqindilarni maxsus idishga tashlang!
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
              <span className="text-amber-400 font-semibold">Sisplatin</span>
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
                  <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Saraton Dori</span>
                  <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Tekis Kvadrat</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">¹⁹⁵Pt YaMR</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Kanserojen</span>
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
            <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-3 py-1 rounded-full text-xs">Rosenberg (1965)</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Saraton Dori</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">DNK Crosslink</span>
          </div>
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              cis-[PtCl₂(NH₃)₂]
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>
          <p className="text-purple-300 text-lg mb-4">
            Sisplatin — <span className="text-amber-400 italic">&quot;Zamonaviy kimyoterapiyaning asoschisi, ¹⁹⁵Pt YaMR fenomeni&quot;</span>
          </p>
          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-amber-400">YaMR spektroskopiya</strong> yordamida <strong className="text-amber-400">metall yadrolari</strong> ni o&apos;rganish.
            Pt²⁺ — 5d⁸ tekis kvadrat, diamagnit. C₂ᵥ simmetriya.
            <strong className="text-amber-400"> ¹⁹⁵Pt YaMR: -2100 ppm</strong> (kvintet, J ≈ 450 Hz).
            <strong className="text-amber-400"> ¹H YaMR: 4.2 ppm</strong> (satellit dubletlar, J = 45 Hz).
            <strong className="text-amber-400"> DNK bilan 1,2-GpG crosslink</strong> — saraton hujayralarini o&apos;ldiradi.
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
              <div className="text-white font-bold">C₂ᵥ</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">¹⁹⁵Pt YaMR</div>
              <div className="text-white font-bold">-2100 ppm</div>
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

          {/* d-orbital splitting diagram - TEKTIS KVADRAT (tspan ishlatilgan) */}
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

        {/* SIMMETRIYA */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📐</span> Simmetriya (C₂ᵥ) — Sisplatin
          </h2>
          <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-sm">
              <strong>C₂ᵥ nuqtaviy guruhi:</strong> Tekis kvadrat sis-[PtCl₂(NH₃)₂] da C₂ o&apos;q (N-Pt-N bisector orqali) va 2 ta σᵥ tekislik mavjud.
              Trans-platin da D₂ₕ simmetriya (markaziy simmetriya bor). Bu simmetriya farqi YaMR va IR spektrlarida ko&apos;rinadi.
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
                  <span className="text-purple-400 font-mono text-xs">{COMPOUND.symmetry.symmetryElements.join("; ")}</span>
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
                  <span className="text-purple-400">O&apos;zaro istisno:</span>
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
            <h4 className="text-purple-400 font-bold mb-2">Trans-effekt va trans-influence</h4>
            <p className="text-purple-200 text-sm mb-2">
              <strong>Trans-effekt tartibi:</strong> {COMPOUND.symmetry.transInfluence}
            </p>
          </div>

          {/* C₂ᵥ karakterlar jadvali */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 overflow-x-auto">
            <h4 className="text-purple-400 font-bold mb-3">C₂ᵥ karakterlar jadvali</h4>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-2 px-2 text-purple-400">Irrep</th>
                  <th className="py-2 px-2 text-purple-400">E</th>
                  <th className="py-2 px-2 text-purple-400">C₂</th>
                  <th className="py-2 px-2 text-purple-400">σᵥ</th>
                  <th className="py-2 px-2 text-purple-400">σᵥ&apos;</th>
                  <th className="py-2 px-2 text-purple-400">Funksiyalar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {Object.entries(COMPOUND.symmetry.characterTable).map(([irrep, data]) => (
                  <tr key={irrep} className="border-b border-purple-800/30">
                    <td className="py-2 px-2 text-purple-400 font-bold">{irrep}</td>
                    <td className="py-2 px-2">{data.E}</td>
                    <td className="py-2 px-2">{data.C2}</td>
                    <td className="py-2 px-2">{data.σv}</td>
                    <td className="py-2 px-2">{data.σv_prime}</td>
                    <td className="py-2 px-2 text-xs text-yellow-400">{data.functions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIS-TRANS IZOMERIZM */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔗 Sis-trans izomerizm — FARQLAR</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">✓ Sisplatin (FAOL)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Geometriya:</span>
                  <span className="text-yellow-400">cis (Cl-Pt-Cl ≈ 90°)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Simmetriya:</span>
                  <span className="text-yellow-400">C₂ᵥ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">¹⁹⁵Pt YaMR:</span>
                  <span className="text-yellow-400">-2100 ppm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">¹J(Pt-H):</span>
                  <span className="text-yellow-400">45 Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">DNK crosslink:</span>
                  <span className="text-yellow-400">✓ (1,2-GpG intrastrand)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Klinik faollik:</span>
                  <span className="text-green-400 font-bold">90%+ (testicular)</span>
                </div>
              </div>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">✗ Transplatin (FAOL EMAS)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Geometriya:</span>
                  <span className="text-red-400">trans (Cl-Pt-Cl ≈ 180°)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Simmetriya:</span>
                  <span className="text-red-400">D₂ₕ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">¹⁹⁵Pt YaMR:</span>
                  <span className="text-red-400">-1850 ppm (250 ppm farq!)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">¹J(Pt-H):</span>
                  <span className="text-red-400">65 Hz (kuchliroq)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">DNK crosslink:</span>
                  <span className="text-red-400">✗ (faqat monoadduct)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Klinik faollik:</span>
                  <span className="text-red-400 font-bold">Samarasiz</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-yellow-900/30 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              <strong>Muhim:</strong> Faqat <em>cis</em> konfiguratsiya DNK da 1,2-intrastrand crosslink hosil qila oladi — bu hujayra o&apos;limiga olib keladi.
              <em>Trans</em> konfiguratsiya monoadduct hosil qiladi, lekin DNK spiralini buzmaydi — shuning uchun samarasiz.
            </p>
          </div>
        </div>

        {/* YaMR NAZARIYASI */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧲</span> YaMR nazariyasi — METALL YADROLARI
          </h2>
          <div className="bg-cyan-900/30 rounded-lg p-4 mb-6">
            <p className="text-cyan-300 text-sm">
              <strong>Sisplatin — ¹⁹⁵Pt YaMR uchun klassik namunadir!</strong> ¹⁹⁵Pt — eng yaxshi metall yadrolaridan biri
              (33.8% tabiiy, I=1/2, o&apos;rta γ). Har bir yadro uchun kimyoviy siljishning fizik ma&apos;nosini o&apos;rganamiz.
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
              onClick={() => setActiveNmrNucleus("n15")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "n15"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹⁵N (I=1/2, 0.37%)
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
          </div>

          {activeNmrNucleus === "pt195" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.pt195.nucleus}</h3>
              <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
                <p className="text-yellow-300 text-xs">
                  <strong>⭐ Eng muhim yadro!</strong> ¹⁹⁵Pt — metall yadrolari YaMR ning eng qulay namunasi.
                  33.8% tabiiy tarqalish (¹³C dan 30 marta ko&apos;p!), I=1/2 (kvadrupol kengayish yo&apos;q), o&apos;rta γ.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.pt195.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Sezgirlik:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">¹H dan ~10×</div>
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
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun -2100 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.pt195.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">CSA (Kimyoviy siljish anizotropiyasi):</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.pt195.csa}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Referens:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.pt195.referencing}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Qo&apos;llanish:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.pt195.applications}</p>
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
                  <div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.h1.multiplicity}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">¹J(Pt-H):</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">45 Hz</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun 4.2 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Satellit signallar:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.satellites}</p>
              </div>
            </div>
          )}

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
                  <div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.n15.sensitivity}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">¹J(Pt-N):</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">400-500 Hz</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n15.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun -60 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.n15.whyThisShift}</p>
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
        </div>

        {/* STRUKTURAVIY PARAMETRLAR */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📏</span> Strukturaviy parametrlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog&apos; uzunliklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Pt-N (NH₃):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.ptN}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Pt-Cl:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.ptCl}</span>
                </div>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog&apos; burchaklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">N-Pt-N (cis):</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.nPtN}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Cl-Pt-Cl (cis):</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.clPtCl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">N-Pt-Cl:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.nPtCl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yig&apos;indi:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.sumAngles}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-2">Trans-effekt</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Tartib:</span>
                <span className="text-green-400 text-xs">{COMPOUND.structuralData.transEffect.order}</span>
              </div>
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Mexanizm:</span>
                <span className="text-green-400 text-xs">{COMPOUND.structuralData.transEffect.mechanism}</span>
              </div>
              <div className="flex justify-between flex-col">
                <span className="text-purple-400">Oqibat:</span>
                <span className="text-green-400 text-xs">{COMPOUND.structuralData.transEffect.consequence}</span>
              </div>
            </div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <p className="text-green-300 text-sm">
              <strong>Taqqoslash:</strong> {COMPOUND.structuralData.bondLengths.comparison}
            </p>
          </div>
        </div>

        {/* KLINIK MA'LUMOTLAR */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">💊</span> Klinik va farmakologik ma&apos;lumotlar
          </h2>
          <div className="bg-red-900/30 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">
              <strong>Sisplatin — saraton kimyoterapiyasining asoschisi!</strong> 1978 yilda FDA tomonidan tasdiqlangan.
              DNK bilan 1,2-intrastrand crosslink hosil qiladi → apoptoz (hujayra o&apos;limi).
              Testikulyar saraton uchun <strong className="text-red-400">90%+</strong> muvaffaqiyat!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Mexanizm</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Aktivatsiya (aquation):</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.mechanism.activation}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">DNK bog&apos;lanish:</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.mechanism.dnaBinding}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Crosslink turi:</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.mechanism.crosslink}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Oqibat:</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.mechanism.consequence}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Selektivlik:</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.mechanism.selectivity}</span>
                </div>
              </div>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Nojo&apos;ya ta&apos;sirlar</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Nefrotoksiklik:</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.sideEffects.nephrotoxicity}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Neyrotoksiklik:</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.sideEffects.neurotoxicity}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Ototoksiklik:</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.sideEffects.ototoxicity}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Miyelosupressiya:</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.sideEffects.myelosuppression}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Emesis:</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.sideEffects.emesis}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-red-900/30 rounded-lg p-4">
            <h4 className="text-red-400 font-bold mb-2">Klinik qo&apos;llanish</h4>
            <div className="space-y-2">
              {COMPOUND.clinical.applications.map((app, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-red-900/30">
                  <div className="text-purple-200 text-xs">{app.cancer}</div>
                  <div className="text-red-400 text-xs">{app.cure}</div>
                  <div className="text-yellow-400 text-xs font-mono">{app.dose}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-red-900/30 rounded-lg p-4">
            <h4 className="text-red-400 font-bold mb-2">Rezistentlik mexanizmlari</h4>
            <ul className="space-y-1 text-sm text-purple-200">
              {COMPOUND.clinical.resistance.mechanisms.map((m, i) => (
                <li key={i}>• {m}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* TERMODINAMIK VA KINETIK PARAMETRLAR */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⚗️</span> Termodinamik va kinetik parametrlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Aquation kinetikasi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Reaksiya 1:</span>
                  <span className="text-orange-400 text-xs font-mono">{COMPOUND.thermodynamics.aquation.reaction1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">k₁ (37°C):</span>
                  <span className="text-orange-400 font-mono text-xs">{COMPOUND.thermodynamics.aquation.k1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">t₁/₂ (1-bosqich):</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.aquation.t_half_1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">k₂ (37°C):</span>
                  <span className="text-orange-400 font-mono text-xs">{COMPOUND.thermodynamics.aquation.k2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">t₁/₂ (2-bosqich):</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.aquation.t_half_2}</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">DNK bilan bog&apos;lanish</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">k_DNA (monoadduct):</span>
                  <span className="text-orange-400 font-mono text-xs">{COMPOUND.thermodynamics.dnaBinding.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">k_cross (crosslink):</span>
                  <span className="text-orange-400 font-mono text-xs">{COMPOUND.thermodynamics.dnaBinding.crosslinking}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Addukt nisbati:</span>
                  <span className="text-orange-400 text-xs">{COMPOUND.thermodynamics.dnaBinding.adductRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">K_DNA:</span>
                  <span className="text-orange-400 font-mono">{COMPOUND.thermodynamics.dnaBinding.binding}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-4">
            <p className="text-orange-300 text-sm">
              <strong>Hujayra ichida:</strong> {COMPOUND.thermodynamics.aquation.intracellular}
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

        {/* INTERAKTIV ¹H YaMR SPEKTR (satellitlar bilan) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv ¹H YaMR spektr — SATELLIT DUBLETLAR</h2>
          <p className="text-purple-200 leading-relaxed mb-6">
            Kimyoviy siljishni o&apos;zgartiring. Markaziy singlet + ¹⁹⁵Pt satellit dubletlari (J = 45 Hz).
          </p>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              Kimyoviy siljish (δ): {ppmSlider.toFixed(2)} ppm
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.05"
              value={ppmSlider}
              onChange={(e) => setPpmSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>0 ppm</span>
              <span>3.75 (satellit)</span>
              <span>4.20 (markaziy)</span>
              <span>4.65 (satellit)</span>
              <span>10 ppm</span>
            </div>
          </div>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                <div className="text-xl font-mono font-bold text-amber-400">{ppmSlider.toFixed(2)} ppm</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Signal:</div>
                <div className="text-xl font-mono font-bold text-amber-400 text-sm">
                  {currentSignal.notes !== "—" ? currentSignal.notes : "Signal yo'q"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">¹J(Pt-H):</div>
                <div className="text-xl font-mono font-bold text-amber-400">45 Hz</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="YaMR spektr">
              <title>¹H YaMR spektr simulyatsiyasi — sisplatin (satellitlar bilan)</title>
              {[0, 2, 4, 6, 8, 10].map((ppm, i) => {
                const x = 580 - (ppm / 10) * 530
                return (
                  <g key={i}>
                    <line x1={x} y1="220" x2={x} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={x} y="235" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                  </g>
                )
              })}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik</text>

              {/* Markaziy singlet (66.2%) - 4.2 ppm */}
              <line
                x1={580 - (4.2 / 10) * 530}
                y1="220"
                x2={580 - (4.2 / 10) * 530}
                y2="60"
                stroke="#fbbf24"
                strokeWidth="3"
              />
              <text x={580 - (4.2 / 10) * 530} y="55" textAnchor="middle" fontSize="8" fill="#fbbf24" fontWeight="bold">
                Markaziy (66.2%)
              </text>

              {/* Past maydon satellit (16.9%) - 4.2 - 45Hz/2 = ~3.75 ppm */}
              <line
                x1={580 - (3.75 / 10) * 530}
                y1="220"
                x2={580 - (3.75 / 10) * 530}
                y2="150"
                stroke="#ef4444"
                strokeWidth="2"
              />
              <text x={580 - (3.75 / 10) * 530} y="145" textAnchor="middle" fontSize="7" fill="#ef4444">
                ¹⁹⁵Pt sat.
              </text>

              {/* Yuqori maydon satellit (16.9%) - 4.2 + 45Hz/2 = ~4.65 ppm */}
              <line
                x1={580 - (4.65 / 10) * 530}
                y1="220"
                x2={580 - (4.65 / 10) * 530}
                y2="150"
                stroke="#ef4444"
                strokeWidth="2"
              />
              <text x={580 - (4.65 / 10) * 530} y="145" textAnchor="middle" fontSize="7" fill="#ef4444">
                ¹⁹⁵Pt sat.
              </text>

              {/* TMS referens */}
              <line x1="580" y1="220" x2="580" y2="190" stroke="#22c55e" strokeWidth="2" />
              <text x="580" y="185" textAnchor="middle" fontSize="7" fill="#22c55e">TMS</text>

              {/* Slider pozitsiyasi */}
              <line
                x1={580 - (ppmSlider / 10) * 530}
                y1="220"
                x2={580 - (ppmSlider / 10) * 530}
                y2="20"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4,2"
              />

              {/* J = 45 Hz annotatsiya */}
              <line x1={580 - (3.75 / 10) * 530} y1="170" x2={580 - (4.65 / 10) * 530} y2="170" stroke="#ef4444" strokeWidth="1" />
              <text x={580 - (4.2 / 10) * 530} y="165" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">
                J = 45 Hz
              </text>
            </svg>
          </div>
          <div className="bg-amber-900/30 rounded-lg p-3">
            <p className="text-amber-300 text-xs">
              <strong>📌 Muhim:</strong> Markaziy pik — 66.2% (¹⁹⁵Pt bo&apos;lmagan izotoplar, I=0). Har bir satellit — 16.9% (¹⁹⁵Pt, I=1/2, 33.8% / 2).
              Ikki satellit orasidagi masofa — J(Pt-H) = 45 Hz. Bu to&apos;g&apos;ridan-to&apos;g&apos;ri Pt-N bog&apos;ining kovalent xarakterini ko&apos;rsatadi.
            </p>
          </div>
        </div>

        {/* INTERAKTIV ¹⁹⁵Pt YaMR SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv ¹⁹⁵Pt YaMR spektr — KENG DIAPAZON</h2>
          <p className="text-purple-200 leading-relaxed mb-6">
            ¹⁹⁵Pt kimyoviy siljish diapazoni juda keng (-5000 dan +5000 ppm). Sisplatin -2100 ppm da kvintet (¹⁴N I=1 bilan, J ≈ 450 Hz).
          </p>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              ¹⁹⁵Pt kimyoviy siljish: {ptPpmSlider} ppm
            </label>
            <input
              type="range"
              min="-2500"
              max="-1500"
              step="10"
              value={ptPpmSlider}
              onChange={(e) => setPtPpmSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="195Pt kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>-2500</span>
              <span>-2100 (sisplatin)</span>
              <span>-1850 (trans)</span>
              <span>-1500</span>
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
                <div className="text-xl font-mono font-bold text-amber-400">Kvintet (¹⁴N)</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="195Pt YaMR spektr">
              <title>¹⁹⁵Pt YaMR spektr simulyatsiyasi — sisplatin</title>
              {[-2500, -2300, -2100, -1900, -1700, -1500].map((ppm, i) => {
                const x = 580 - ((ppm + 2500) / 1000) * 530
                return (
                  <g key={i}>
                    <line x1={x} y1="220" x2={x} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={x} y="235" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                  </g>
                )
              })}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik</text>

              {/* Sisplatin signali -2100 ppm — kvintet */}
              {[-2320, -2210, -2100, -1990, -1880].map((ppm, i, arr) => {
                const x = 580 - ((ppm + 2500) / 1000) * 530
                const intensity = [0.2, 0.4, 0.6, 0.4, 0.2][i]
                const y = 220 - intensity * 180
                return (
                  <g key={i}>
                    <line x1={x} y1="220" x2={x} y2={y} stroke="#fbbf24" strokeWidth="2" />
                  </g>
                )
              })}
              <text x={580 - ((-2100 + 2500) / 1000) * 530} y="35" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">
                Sisplatin (kvintet)
              </text>

              {/* Transplatin joyi -1850 ppm — ko'rsatilgan (agar aralashma bo'lsa) */}
              <line
                x1={580 - ((-1850 + 2500) / 1000) * 530}
                y1="220"
                x2={580 - ((-1850 + 2500) / 1000) * 530}
                y2="180"
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="3,2"
              />
              <text x={580 - ((-1850 + 2500) / 1000) * 530} y="175" textAnchor="middle" fontSize="7" fill="#ef4444">
                Transplatin (-1850)
              </text>

              {/* Slider pozitsiyasi */}
              <line
                x1={580 - ((ptPpmSlider + 2500) / 1000) * 530}
                y1="220"
                x2={580 - ((ptPpmSlider + 2500) / 1000) * 530}
                y2="20"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
            </svg>
          </div>
          <div className="bg-amber-900/30 rounded-lg p-3">
            <p className="text-amber-300 text-xs">
              <strong>📌 Muhim:</strong> -2100 ppm — sisplatin. -1850 ppm — transplatin (250 ppm farq).
              Kvintet — ¹⁴N (I=1) bilan bog&apos;lanish, J ≈ 450 Hz (2 ta ekvivalent NH₃, 2·2·1+1=5).
              ¹⁹⁵Pt YaMR orqali sis-trans izomerlarni aniq farqlash mumkin.
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
              <h3 className="text-amber-400 font-bold mb-3">Peyrone (1845)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.peyrone.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.peyrone.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.peyrone.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Ahamiyat:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.peyrone.significance}</span>
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
              <h3 className="text-amber-400 font-bold mb-3">Rosenberg (1965)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.rosenberg.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.rosenberg.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.rosenberg.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Kashfiyot:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.rosenberg.discovery}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Klinik tasdiq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.rosenberg.clinical}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Lippard (1985)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.lippard.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.lippard.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.lippard.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.lippard.contribution}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span> Taqqoslash — boshqa platin komplekslar
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Kompleks</th>
                  <th className="py-3 px-3 text-teal-400">Avlod</th>
                  <th className="py-3 px-3 text-teal-400">Rang</th>
                  <th className="py-3 px-3 text-teal-400">¹⁹⁵Pt (ppm)</th>
                  <th className="py-3 px-3 text-teal-400">J(Pt-H)</th>
                  <th className="py-3 px-3 text-teal-400">Faollik</th>
                  <th className="py-3 px-3 text-teal-400">Toksiklik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparison.map((comp, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/30 ${i === 0 ? "bg-amber-900/20" : ""}`}>
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{comp.compound}</td>
                    <td className="py-3 px-3 text-xs">{comp.generation}</td>
                    <td className="py-3 px-3 text-xs">{comp.color}</td>
                    <td className="py-3 px-3 text-xs font-mono text-amber-400">{comp.nmrShift}</td>
                    <td className="py-3 px-3 text-xs font-mono">{comp.jPtH}</td>
                    <td className="py-3 px-3 text-xs">{comp.activity}</td>
                    <td className="py-3 px-3 text-xs">{comp.toxicity}</td>
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
            <li><strong className="text-amber-400">Kristall maydon nazariyasi:</strong> Pt²⁺ (5d⁸), tekis kvadrat, diamagnit, barcha 8 elektron past orbitallarda, dx²-y² bo&apos;sh</li>
            <li><strong className="text-amber-400">Simmetriya (C₂ᵥ):</strong> Tekis kvadrat sis-konfiguratsiya. Trans-platin — D₂ₕ</li>
            <li><strong className="text-amber-400">Sis-trans izomerizm:</strong> Faqat cis faol (1,2-GpG crosslink)</li>
            <li><strong className="text-amber-400">¹⁹⁵Pt YaMR:</strong> -2100 ppm (kvintet, ¹⁴N I=1 bilan, J ≈ 450 Hz). Eng yaxshi metall yadrolari!</li>
            <li><strong className="text-amber-400">¹H YaMR:</strong> 4.2 ppm (NH₃, 6H) — markaziy singlet + ¹⁹⁵Pt satellit dubletlari (J = 45 Hz)</li>
            <li><strong className="text-amber-400">Satellit signallar:</strong> ¹⁹⁵Pt 33.8% tabiiy (I=1/2) → 16.9% + 16.9% = 33.8% (satellitlar), 66.2% (markaziy)</li>
            <li><strong className="text-amber-400">Klinik:</strong> Testikulyar saraton 90%+ muvaffaqiyat (Rosenberg 1965)</li>
            <li><strong className="text-amber-400">Mexanizm:</strong> Aquation → DNK bilan 1,2-GpG intrastrand crosslink → apoptoz</li>
            <li><strong className="text-amber-400">Strukturaviy:</strong> Pt-N = 2.04 Å, Pt-Cl = 2.32 Å, cis N-Pt-N ≈ 90°</li>
            <li><strong className="text-amber-400">Aquation:</strong> k₁ = 4.4 × 10⁻⁵ s⁻¹, t₁/₂ ≈ 4 soat (37°C)</li>
            <li><strong className="text-amber-400">Taqqoslash:</strong> Transplatin (-1850 ppm, 250 ppm farq), Carboplatin, Oxaliplatin</li>
            <li><strong className="text-amber-400">Tarix:</strong> Peyrone (1845), Werner (1893), Rosenberg (1965), Lippard (1985)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Birikmalar katalogi</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmalar/pt-cl2-nh3-2-trans" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">Transplatin →</Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • cis-[PtCl₂(NH₃)₂] (Sisplatin) • YaMR spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Peyrone (1845), Rosenberg (1965), Jamieson &amp; Lippard (1999), Still &amp; Neumann (1975), Pregosin (1983), Cotton-Wilkinson</p>
        </div>
      </footer>
    </main>
  )
}