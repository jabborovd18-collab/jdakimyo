"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// trans-[PtCl₂(NH₃)₂] — TRANSPLATIN YaMR (ILMIY BOYITILGAN)
// Manbalar: Peyrone (1845), Rosenberg (1965), Jamieson & Lippard (1999),
//           Still & Neumann (1975), Pregosin (1983), Cotton-Wilkinson
// Xususiyat: ¹⁹⁵Pt YaMR (-1850 ppm), ¹J(Pt-H) = 65 Hz, D₂ₕ simmetriya,
//           klinik samarasiz (DNK crosslink hosil qilmaydi)
//  ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "trans-[PtCl<sub>2</sub>(NH<sub>3</sub>)<sub>2</sub>]",
  formulaPlain: "trans-[PtCl2(NH3)2]",
  iupac: "trans-Diammindixloroplatina(II)",
  commonName: "Transplatin (klinik samarasiz)",
  molarMass: 300.05,
  casNumber: "15663-27-1",
  color: "sariq (yellow)",
  structure: "Tekis kvadrat (Square planar)",
  metalLigand: "Pt-N (NH₃, trans), Pt-Cl (trans)",
  pointGroup: "D₂ₕ",
  electrolyteType: "Noelektrolit",
  molarConductivity: "~0 S·cm²/mol (DMF da)",
  solubility: "DMF, DMSO da eriydi; suvda sekin (2.53 g/L)",

  //  ═══════════════════════════════════════════════════════════════
  // KRISTALL MAYDON NAZARIYASI
  //  ═══════════════════════════════════════════════════════════════
  crystalField: {
    metalIon: "Pt²⁺",
    electronConfig: "[Xe] 4f¹⁴ 5d⁸",
    dElectrons: 8,
    spinState: "Past spinli (har doim — 5d⁸)",
    orbitalOccupancy: "(dxy)² (dz²)² (dxz,dyz)⁴ (dx²-y²)⁰",
    unpairedElectrons: 0,
    magneticMoment: "0 BM (diamagnit)",
    crystalFieldSplitting: "Δ₁ ≈ 30,000 cm⁻¹ (tekis kvadrat)",
    racahParameter: "B ≈ 400 cm⁻¹",
    nephelauxeticRatio: "β = B/B₀ ≈ 0.35",
    pairingEnergy: "P ≈ 15,000 cm⁻¹",
    cFSE: "CFSE ≈ -24,000 cm⁻¹",
    spectrochemicalSeries: "Cl⁻ < NH₃ (NH₃ kuchliroq maydon)",
    whySquarePlanar: "5d⁸ elektron konfiguratsiya — katta Δ₁. Oktaedr o'rniga tekis kvadrat afzal.",
    colorOrigin: "d-d o'tishlar Laporte ta'qiqlangan. Sariq rang — LMCT (Cl⁻ → Pt²⁺) ~350 nm.",
    chargeTransfer: "LMCT: Cl⁻ (p) → Pt²⁺ (dx²-y²) ~350 nm (ε ≈ 200)"
  },

  //  ═══════════════════════════════════════════════════════════════
  // SIMMETRIYA — D₂ₕ (MUHIM FARQ!)
  //  ═══════════════════════════════════════════════════════════════
  symmetry: {
    pointGroup: "D₂ₕ",
    order: 8,
    symmetryElements: ["E", "C₂(z)", "C₂(y)", "C₂(x)", "i (inversiya)", "σ(xy)", "σ(xz)", "σ(yz)"],
    characterTable: {
      Ag:  { E: 1,  C2z: 1,  C2y: 1,  C2x: 1,  i: 1,  σxy: 1,  σxz: 1,  σyz: 1,  functions: "x², y², z²" },
      B1g: { E: 1,  C2z: 1,  C2y: -1, C2x: -1, i: 1,  σxy: 1,  σxz: -1, σyz: -1, functions: "Rz, xy" },
      B2g: { E: 1,  C2z: -1, C2y: 1,  C2x: -1, i: 1,  σxy: -1, σxz: 1,  σyz: -1, functions: "Ry, xz" },
      B3g: { E: 1,  C2z: -1, C2y: -1, C2x: 1,  i: 1,  σxy: -1, σxz: -1, σyz: 1,  functions: "Rx, yz" },
      Au:  { E: 1,  C2z: 1,  C2y: 1,  C2x: 1,  i: -1, σxy: -1, σxz: -1, σyz: -1, functions: "—" },
      B1u: { E: 1,  C2z: 1,  C2y: -1, C2x: -1, i: -1, σxy: -1, σxz: 1,  σyz: 1,  functions: "z" },
      B2u: { E: 1,  C2z: -1, C2y: 1,  C2x: -1, i: -1, σxy: 1,  σxz: -1, σyz: 1,  functions: "y" },
      B3u: { E: 1,  C2z: -1, C2y: -1, C2x: 1,  i: -1, σxy: 1,  σxz: 1,  σyz: -1, functions: "x" }
    },
    nmrEquivalence: "D₂ₕ simmetriya: 2 ta NH₃ ekvivalent (C₂ va i orqali), 2 ta Cl ekvivalent. ¹H YaMR da 1 ta signal (6H).",
    irActive: "B₁u + B₂u + B₃u — IR faol (u simmetriya)",
    ramanActive: "Ag + B₁g + B₂g + B₃g — Raman faol (g simmetriya)",
    mutualExclusion: "D₂ₕ da MARKAZIY SIMMETRIYA bor → IR va Raman USTMA-UST TUSHMAYDI (mutual exclusion principle). Bu sisplatindan (C₂ᵥ) asosiy farq!",
    transInfluence: "Cl⁻ trans-influence kuchi: NH₃ > Cl⁻. Shuning uchun Pt-N bog'i NH₃ ga trans-Cl ta'sirida biroz uzunroq."
  },

  //  ═══════════════════════════════════════════════════════════════
  // YaMR NAZARIYASI
  //  ═══════════════════════════════════════════════════════════════
  nmrTheory: {
    h1: {
      nucleus: "¹H (I = 1/2, 100% tabiiy)",
      shift: "3.8 ppm (NH₃, C₂ simmetriyada barcha 6H ekvivalent)",
      whyThisShift: "Transplatin da NH₃ signali 3.8 ppm — sisplatindan (4.2 ppm) biroz past. Sababi: trans-Cl ning elektron effekti boshqacha.",
      multiplicity: "Markaziy singlet + ¹⁹⁵Pt satellit dubletlari (J = 65 Hz — SISPLATINDAN KATTA!)",
      linewidth: "~2-5 Hz (o'tkir, diamagnit)",
      t1Relaxation: "T₁ ≈ 1-3 s (dipol-dipol)",
      couplingNotes: "¹J(¹H-¹⁹⁵Pt) = 65 Hz — sisplatindan (45 Hz) 20 Hz ga katta! Bu TRANS-EFFEKT dalili: trans-Pt-N bog'i zaifroq (Cl⁻ ning trans-influence kuchi), shuning uchun Pt-N bog'ining s-xarakteri ko'proq → katta J bog'lanish konstantasi.",
      satellites: "16.9% × 2 = 33.8% ¹⁹⁵Pt (I=1/2), 66.2% boshqa izotoplar (I=0). Satellitlar orasidagi masofa: J = 65 Hz (sisplatinda 45 Hz)."
    },
    n15: {
      nucleus: "¹⁵N (I = 1/2, 0.37% tabiiy)",
      shift: "-55 ppm (referens: CH₃NO₂)",
      whyThisShift: "Trans-NH₃ da N elektron zichligi biroz farqli (trans-Cl ta'siri). Sisplatindan (−60 ppm) 5 ppm yuqori.",
      sensitivity: "Juda past sezgirlik",
      linewidth: "~20-50 Hz",
      t1Relaxation: "T₁ ≈ 30-100 s",
      couplingNotes: "¹J(¹⁵N-¹⁹⁵Pt) ≈ 400-500 Hz"
    },
    pt195: {
      nucleus: "¹⁹⁵Pt (I = 1/2, 33.8% tabiiy)",
      shift: "-1850 ppm (referens: [PtCl₆]²⁻, 0 ppm)",
      whyThisShift: "Sisplatindan (−2100 ppm) 250 ppm YUQORI maydon (kamroq deshielded). Sababi: trans-konfiguratsiya elektron muhitni o'zgartiradi — ikkita NH₃ bir-biriga trans, ikkita Cl ham trans. Bu simmetrik joylashuv deshielding ni kamaytiradi.",
      sensitivity: "O'rta — ¹H dan ~10× past",
      linewidth: "~20-100 Hz",
      t1Relaxation: "T₁ ≈ 1-5 s",
      csa: "Δσ ≈ 3000-5000 ppm (tekis kvadrat)",
      referencing: "Referens: Na₂[PtCl₆] (0 ppm)",
      applications: "Sis-trans farqlashning eng oson usuli: 250 ppm farq!"
    },
    cl35: {
      nucleus: "³⁵Cl (I = 3/2, 75.8% tabiiy)",
      shift: "~100 ppm",
      quadrupolar: "Kvadrupol (I=3/2), CQ ≈ 20-40 MHz",
      linewidth: "~10,000-50,000 Hz",
      detection: "To'g'ridan-to'g'ri kuzatish qiyin"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY PARAMETRLAR
  //  ═══════════════════════════════════════════════════════════════
  structuralData: {
    bondLengths: {
      ptN: "2.05 Å (Pt-N, trans-Cl)",
      ptCl: "2.32 Å (Pt-Cl, trans-NH₃)",
      comparison: "Sisplatin: Pt-N = 2.04 Å, Pt-Cl = 2.32 Å. Transplatin da Pt-N 0.01 Å uzunroq (trans-influence)."
    },
    bondAngles: {
      nPtN: "180° (trans N-Pt-N)",
      clPtCl: "180° (trans Cl-Pt-Cl)",
      nPtCl: "90° (N-Pt-Cl)",
      sumAngles: "360° (tekis kvadrat)"
    },
    transEffect: {
      order: "Cl⁻ > NH₃ (kinetik trans-effekt)",
      mechanism: "σ-bog'lanish + π-bog'lanish",
      consequence: "Trans-Cl ta'sirida Pt-N bog'i biroz uzunroq (2.05 vs 2.04 Å) va kuchsizroq",
      transInfluence: "Termodinamik trans-influence: Pt-N bog'ining kuchi ligandning trans-influence ga bog'liq"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // KLINIK SAMARASIZLIK MEXANIZMI
  //  ═══════════════════════════════════════════════════════════════
  clinical: {
    whyInactive: {
      reason1: "1,2-intrastrand crosslink hosil qila olmaydi — ikkita NH₃ trans (180°), juda uzoq",
      reason2: "DNK spiralida qo'shni guaninlar bir-biriga yaqin (3.4 Å), trans-izomer ularni bog'lay olmaydi",
      reason3: "Faqat 1,3-intrastrand yoki interstrand crosslink (kam uchraydi, samarasiz)",
      reason4: "Monoadduct ko'proq hosil bo'ladi, lekin DNK spiralini buzmaydi"
    },
    dnaBinding: {
      adductRatio: "85% monoadduct, 10% 1,3-intrastrand, 5% interstrand",
      crosslinkEfficiency: "<5% (sisplatinda 90%+)",
      consequence: "DNK replikatsiyasi deyarli to'xtamaydi → apoptoz signal yo'q",
      hmgRecognition: "HMG1 proteinasi transplatin-DNK adduktni TANIMAYDI (sisplatinni taniydi)"
    },
    applications: [
      { use: "Ilmiy tadqiqotlar", purpose: "Sis-trans izomerizm o'rganish", significance: "Model birikma" },
      { use: "Taqqoslash uchun", purpose: "Sisplatin mexanizmini tushunish", significance: "Kontrol" },
      { use: "Koordinatsion kimyo", purpose: "Trans-effekt o'rganish", significance: "Klassik misol" },
      { use: "Materialshunoslik", purpose: "Pt komplekslari sintezi prekursori", significance: "Oraliq mahsulot" }
    ]
  },

  //  ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  //  ═══════════════════════════════════════════════════════════════
  history: {
    peyrone: {
      year: 1845,
      scientist: "Michele Peyrone (Italiya)",
      achievement: "Ikkala izomerni ham sintez qildi",
      name: "'Peyrone tuzi' (sisplatin) va 'Reiset tuzi' (transplatin)",
      significance: "Koordinatsion kimyoning dastlabki misollaridan"
    },
    werner: {
      year: 1893,
      scientist: "Alfred Werner (Shveytsariya)",
      achievement: "Sis-trans izomerizmni tushuntirdi",
      contribution: "Koordinatsion nazariya (Nobel 1913)",
      transEffect: "Trans-effekt konseptsiyasini kiritdi"
    },
    rosenberg: {
      year: 1965,
      scientist: "Barnett Rosenberg (AQSh)",
      achievement: "Faqat sisplatin anti-tumor faolligini kashf qildi",
      finding: "Transplatin klinik jihatdan SAMARASIZ (nima uchun?)",
      impact: "Zamonaviy kimyoterapiyaning asoschisi"
    },
    understanding: {
      year: "1970-1980-yillar",
      scientists: "Roberts, Pascoe, Lippard",
      achievement: "Nima uchun transplatin samarasiz ekanligi tushunildi",
      mechanism: "1,2-intrastrand crosslink hosil qila olmaydi"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH
  //  ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      compound: "cis-[PtCl₂(NH₃)₂]",
      geometry: "cis (C₂ᵥ)",
      nmrPt: "−2100 ppm",
      jPtH: "45 Hz",
      crosslink: "✓ 1,2-GpG intrastrand",
      activity: "90%+ (testicular)"
    },
    {
      compound: "trans-[PtCl₂(NH₃)₂]",
      geometry: "trans (D₂ₕ)",
      nmrPt: "−1850 ppm (+250 ppm)",
      jPtH: "65 Hz (+20 Hz)",
      crosslink: "✗ Faqat monoadduct",
      activity: "Samarasiz"
    },
    {
      compound: "[Pt(NH₃)₄]²⁺",
      geometry: "Tekis kvadrat (D₄ₕ)",
      nmrPt: "−2350 ppm",
      jPtH: "—",
      crosslink: "—",
      activity: "—"
    },
    {
      compound: "[PtCl₄]²⁻",
      geometry: "Tekis kvadrat (D₄ₕ)",
      nmrPt: "+1620 ppm (referens)",
      jPtH: "—",
      crosslink: "—",
      activity: "Prekursor"
    }
  ],

  // YaMR signallar
  nmrSignals: [
    {
      nucleus: "¹H",
      ligand: "NH₃ (2 ta NH₃, barcha 6H ekvivalent)",
      shift: 3.8,
      multiplicity: "singlet (markaziy) + dublet (satellitlar)",
      jCoupling: "¹J(Pt-H) = 65 Hz",
      integration: "6H",
      notes: "Markaziy pik (66.2%) + 2 satellit (16.9% har biri). J = 65 Hz — sisplatindan (45 Hz) katta, trans-effekt dalili."
    },
    {
      nucleus: "¹⁵N",
      ligand: "NH₃ (N atomi)",
      shift: -55,
      multiplicity: "singlet + satellitlar",
      jCoupling: "¹J(Pt-N) ≈ 450 Hz",
      integration: "2N",
      notes: "¹⁵N boyitish tavsiya etiladi (0.37% tabiiy)."
    },
    {
      nucleus: "¹⁹⁵Pt",
      ligand: "Pt markaz",
      shift: -1850,
      multiplicity: "kvintet (¹⁴N bilan, I=1, 2nI+1=5)",
      jCoupling: "¹J(Pt-N) ≈ 450 Hz (keng)",
      integration: "1Pt",
      notes: "Sisplatindan 250 ppm yuqori. D₂ₕ simmetriya — 2 ta ekvivalent NH₃ → kvintet."
    }
  ],

  // YaMR spektr (¹H)
  nmrSpectrum: [
    { ppm: 0, intensity: 0, notes: "TMS referens" },
    { ppm: 3.15, intensity: 0.17, notes: "¹H satellit (past maydon, ¹⁹⁵Pt)" },
    { ppm: 3.8, intensity: 0.66, notes: "¹H: NH₃ markaziy (6H)" },
    { ppm: 4.45, intensity: 0.17, notes: "¹H satellit (yuqori maydon, ¹⁹⁵Pt)" },
    { ppm: 7, intensity: 0, notes: "—" }
  ],

  // ¹⁹⁵Pt spektr
  pt195Spectrum: [
    { ppm: -2400, intensity: 0, notes: "—" },
    { ppm: -2100, intensity: 0, notes: "Sisplatin joyi" },
    { ppm: -2070, intensity: 0.2, notes: "¹⁹⁵Pt kvintet (1)" },
    { ppm: -1960, intensity: 0.4, notes: "¹⁹⁵Pt kvintet (2)" },
    { ppm: -1850, intensity: 0.6, notes: "¹⁹⁵Pt kvintet (markaziy, −1850 ppm)" },
    { ppm: -1740, intensity: 0.4, notes: "¹⁹⁵Pt kvintet (4)" },
    { ppm: -1630, intensity: 0.2, notes: "¹⁹⁵Pt kvintet (5)" },
    { ppm: -1500, intensity: 0, notes: "—" }
  ],

  // Halaqit beruvchi omillar
  interferences: [
    {
      source: "cis-[PtCl₂(NH₃)₂] (sisplatin) aralashmasi",
      effect: "¹⁹⁵Pt YaMR da -2100 ppm da qo'shimcha signal (250 ppm farq). ¹J(Pt-H) = 45 Hz (65 Hz o'rniga).",
      severity: "Yuqori",
      solution: "Sof trans-izomer sintez qilish. Kinetik nazorat usuli — [PtCl₄]²⁻ + NH₃ → avval [PtCl₃(NH₃)]⁻ → keyin trans-[PtCl₂(NH₃)₂].",
      theoryNote: "Sintezda trans-effekt qoidasi: birinchi NH₃ kirganda Cl⁻ ga trans kiradi. Ikkinchi NH₃ ham Cl⁻ ga trans kiradi (chunki Cl⁻ ning trans-effekti NH₃ dan kuchliroq). Natija — trans-izomer."
    },
    {
      source: "Aquation mahsulotlari",
      effect: "[PtCl(H₂O)(NH₃)₂]⁺ signallar (-1800 dan -1900 ppm)",
      severity: "O'rta",
      solution: "Yangi tayyorlangan eritma. DMSO-d₆ da saqlash.",
      theoryNote: "Suvli eritmada sekin aquation sodir bo'ladi."
    },
    {
      source: "¹⁹⁵Pt CSA kengayishi",
      effect: "Yuqori magnit maydonida chiziqlar kengayadi",
      severity: "O'rta",
      solution: "O'rta magnit maydonida ishlash (400 MHz)",
      theoryNote: "CSA × B₀ chiziq kengligiga ta'sir qiladi."
    },
    {
      source: "Erituvchi ta'siri",
      effect: "D₂O da aquation tez",
      severity: "O'rta",
      solution: "DMSO-d₆ da ishlash tavsiya etiladi",
      theoryNote: "DMSO-d₆ da barqaror."
    }
  ],

  // Laboratoriya tartibi
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak. Transplatin Pt birikmasi — zaharli. Havo almashinuvi yaxshi bo'lgan joyda ishlash.",
      time: "15 daq",
      theoryNote: "Pt birikmalari zaharli, lekin transplatin sisplatindan kamroq kanserojen (DNK crosslink qilmaydi)."
    },
    {
      step: 2,
      title: "Sof trans-[PtCl₂(NH₃)₂] ni tayyorlash",
      desc: "Kinetik nazorat sintezi: [PtCl₄]²⁻ + 2 NH₃ → trans-[PtCl₂(NH₃)₂] (trans-effekt qoidasi). Sariq kristallar.",
      time: "1-2 kun",
      theoryNote: "Trans-effekt: Cl⁻ > NH₃. Birinchi NH₃ Cl⁻ ga trans kiradi. Ikkinchi NH₃ ham qolgan Cl⁻ ga trans kiradi → trans-izomer."
    },
    {
      step: 3,
      title: "YaMR spektrometrni tayyorlash",
      desc: "DMSO-d₆ erituvchi. ¹H va ¹⁹⁵Pt kanallarini sozlash.",
      time: "30 daq",
      theoryNote: "DMSO-d₆ eng yaxshi erituvchi (aquation bo'lmaydi)."
    },
    {
      step: 4,
      title: "Namuna tayyorlash",
      desc: "20-50 mg transplatin ni 0.6 mL DMSO-d₆ da eritish.",
      time: "10 daq",
      theoryNote: "DMSO-d₆ da barqaror."
    },
    {
      step: 5,
      title: "¹H YaMR spektrini olish",
      desc: "16-64 skan. NH₃ signalini tekshirish (3.8 ppm, satellitlar bilan).",
      time: "5-10 daq",
      theoryNote: "¹H YaMR da 3.8 ppm da markaziy singlet + ikkita satellit dublet (J = 65 Hz)."
    },
    {
      step: 6,
      title: "¹⁹⁵Pt YaMR spektrini olish",
      desc: "1000-5000 skan. Signal -1850 ppm da kvintet.",
      time: "1-3 soat",
      theoryNote: "¹⁹⁵Pt YaMR — -1850 ppm da kvintet (¹⁴N I=1 bilan)."
    },
    {
      step: 7,
      title: "Sisplatin aralashmasini tekshirish",
      desc: "¹⁹⁵Pt YaMR da -2100 ppm da signal borligini tekshirish.",
      time: "5 daq",
      theoryNote: "Agar -2100 ppm da signal bo'lsa, sisplatin aralashmasi bor."
    }
  ],

  // Kengaytiruvchi metodlar
  advancedTechniques: [
    {
      name: "1D ¹⁹⁵Pt YaMR",
      description: "¹⁹⁵Pt kimyoviy siljishini o'lchash (-1850 ppm)",
      advantages: ["Geometriya aniqlash", "Tez", "250 ppm farq"],
      disadvantages: ["O'rta sezgirlik", "CSA"],
      bestFor: "Sis-trans farqlash",
      examples: "Transplatin -1850 ppm, sisplatin -2100 ppm"
    },
    {
      name: "IR spektroskopiya",
      description: "Mutual exclusion tekshirish (D₂ₕ simmetriya)",
      advantages: ["Simmetriya aniqlash", "Tez", "Arzon"],
      disadvantages: ["Faqat simmetriya", "Sifatli"],
      bestFor: "D₂ₕ simmetriya tasdiqlash",
      examples: "IR va Raman spektrlari ustma-ust tushmaydi"
    },
    {
      name: "X-ray kristallografiya",
      description: "Kristall strukturasini aniq aniqlash",
      advantages: ["Aniq bog' uzunliklari", "3D struktura"],
      disadvantages: ["Kristall kerak", "Uzoq"],
      bestFor: "Geometriya tasdiqlash",
      examples: "Pt-N = 2.05 Å, N-Pt-N = 180°"
    },
    {
      name: "DNK bilan bog'lanish testlari",
      description: "Monoadduct va crosslink samaradorligini o'lchash",
      advantages: ["Mexanizm tushunish", "Klinik ahamiyat"],
      disadvantages: ["Biologik material", "Murakkab"],
      bestFor: "Samarasizlik mexanizmi",
      examples: "Transplatin <5% crosslink (sisplatin 90%+)"
    },
    {
      name: "2D ¹H-¹⁹⁵Pt HMQC",
      description: "¹H va ¹⁹⁵Pt o'rtasidagi bog'lanishlarni aniqlash",
      advantages: ["¹J(Pt-H) aniq", "Yuqori sezgirlik"],
      disadvantages: ["Uzoq vaqt", "Maxsus uskunalar"],
      bestFor: "Bog'lanishlar tahlili",
      examples: "¹H-¹⁹⁵Pt korrelyatsiya — 3.8 ppm va -1850 ppm"
    }
  ]
}

export default function TransplatinPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [ppmSlider, setPpmSlider] = useState(3.8)
  const [ptPpmSlider, setPtPpmSlider] = useState(-1850)
  const [activeNmrNucleus, setActiveNmrNucleus] = useState("pt195")
  const [activeSisTrans, setActiveSisTrans] = useState("trans")

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
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/30 to-slate-950 text-white">
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-orange-950 to-purple-950 border-2 border-orange-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🧲</span> trans-[PtCl₂(NH₃)₂] — TRANSPLATIN YaMR!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-orange-300">Transplatin</strong> — sisplatinning klinik <strong className="text-red-400">SAMARASIZ</strong> trans-izomeri!
              D₂ₕ simmetriya, ¹⁹⁵Pt YaMR da <strong className="text-orange-300">250 ppm farq</strong>, trans-effekt dalili!
            </p>
            <div className="bg-orange-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-orange-400 font-bold mb-2">🧲 YaMR signallar:</div>
                  <div className="text-purple-200">
                    <strong>¹⁹⁵Pt:</strong> -1850 ppm (kvintet)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹H:</strong> 3.8 ppm (satellitlar bilan)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹J(Pt-H):</strong> 65 Hz (sisplatindan 20 Hz katta!)
                  </div>
                </div>
                <div>
                  <div className="text-orange-400 font-bold mb-2">🔬 Asosiy xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Geometriya:</strong> Tekis kvadrat (trans)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Simmetriya:</strong> D₂ₕ (markaziy simmetriya)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Klinik:</strong> Samarali EMAS
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-orange-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-orange-300">Knowledge Base:</strong> Peyrone (1845), Werner (1893), Rosenberg (1965),
                Jamieson &amp; Lippard (1999), Still &amp; Neumann (1975), Pregosin (1983), Cotton-Wilkinson
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
              <span className="text-orange-400 font-semibold">Transplatin</span>
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
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Klinik Samarali EMAS</span>
                  <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Tekis Kvadrat</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">D₂ₕ Simmetriya</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Trans-effekt</span>
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
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Metall Yadrosi</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Samarasiz</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">D₂ₕ Simmetriya</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Trans-effekt</span>
          </div>
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              trans-[PtCl₂(NH₃)₂]
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>
          <p className="text-purple-300 text-lg mb-4">
            Transplatin — <span className="text-orange-400 italic">&quot;Sisplatinning klinik samarasiz izomeri&quot;</span>
          </p>
          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-orange-400">YaMR spektroskopiya</strong> yordamida <strong className="text-orange-400">sis-trans izomerizmni</strong> o&apos;rganish.
            Pt²⁺ — 5d⁸ tekis kvadrat, diamagnit. <strong className="text-orange-400">D₂ₕ simmetriya</strong> (markaziy simmetriya!).
            <strong className="text-orange-400"> ¹⁹⁵Pt YaMR: -1850 ppm</strong> (sisplatindan 250 ppm farq!).
            <strong className="text-orange-400"> ¹H YaMR: 3.8 ppm</strong> (J = 65 Hz — sisplatindan 20 Hz katta, trans-effekt dalili).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Pt²⁺ (5d⁸)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Tekis kvadrat (trans)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">D₂ₕ</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Klinik</div>
              <div className="text-red-400 font-bold">SAMARASIZ</div>
            </div>
          </div>
        </div>

        {/* SIS-TRANS TAQQOSLASH (ASOSIY) */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔗</span> SIS-TRANS TAQQOSLASH — ASOSIY FARQLAR
          </h2>
          <div className="bg-red-900/30 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">
              <strong>Muhim:</strong> Ikkala izomer ham bir xil formulaga ega, lekin geometriya farqli.
              Bu farq YaMR spektrlarida <strong>aniq</strong> ko&apos;rinadi — klinik faollikda ham katta farq!
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveSisTrans("cis")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeSisTrans === "cis"
                  ? "bg-green-600/60 text-white border border-green-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ✓ Sisplatin (FAOL)
            </button>
            <button
              onClick={() => setActiveSisTrans("trans")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeSisTrans === "trans"
                  ? "bg-red-600/60 text-white border border-red-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ✗ Transplatin (SAMARASIZ)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeSisTrans === "cis" ? (
              <>
                <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
                  <h3 className="text-green-400 font-bold mb-3">✓ Sisplatin</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-purple-400">Geometriya:</span><span className="text-green-400">cis (N-Pt-N ≈ 90°)</span></div>
                    <div className="flex justify-between"><span className="text-purple-400">Simmetriya:</span><span className="text-green-400">C₂ᵥ</span></div>
                    <div className="flex justify-between"><span className="text-purple-400">¹⁹⁵Pt YaMR:</span><span className="text-green-400">−2100 ppm</span></div>
                    <div className="flex justify-between"><span className="text-purple-400">¹J(Pt-H):</span><span className="text-green-400">45 Hz</span></div>
                    <div className="flex justify-between"><span className="text-purple-400">¹H YaMR:</span><span className="text-green-400">4.2 ppm</span></div>
                    <div className="flex justify-between"><span className="text-purple-400">DNK crosslink:</span><span className="text-green-400 font-bold">✓ 90%+ (1,2-GpG)</span></div>
                    <div className="flex justify-between"><span className="text-purple-400">Klinik faollik:</span><span className="text-green-400 font-bold">Testicular 90%+</span></div>
                  </div>
                </div>
                <div className="bg-green-900/30 rounded-xl p-5">
                  <h4 className="text-green-400 font-bold mb-2">Nima uchun faol?</h4>
                  <p className="text-purple-200 text-xs leading-relaxed">
                    Ikkala NH₃ <em>cis</em> (90°) — DNK spiralida qo&apos;shni guaninlarni (3.4 Å) bog&apos;lash mumkin.
                    1,2-intrastrand crosslink hosil qiladi → DNK spiralini buzadi → HMG1 proteinasi taniydi → apoptoz.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
                  <h3 className="text-red-400 font-bold mb-3">✗ Transplatin</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-purple-400">Geometriya:</span><span className="text-red-400">trans (N-Pt-N = 180°)</span></div>
                    <div className="flex justify-between"><span className="text-purple-400">Simmetriya:</span><span className="text-red-400">D₂ₕ</span></div>
                    <div className="flex justify-between"><span className="text-purple-400">¹⁹⁵Pt YaMR:</span><span className="text-red-400">−1850 ppm (+250 ppm)</span></div>
                    <div className="flex justify-between"><span className="text-purple-400">¹J(Pt-H):</span><span className="text-red-400">65 Hz (+20 Hz)</span></div>
                    <div className="flex justify-between"><span className="text-purple-400">¹H YaMR:</span><span className="text-red-400">3.8 ppm (−0.4 ppm)</span></div>
                    <div className="flex justify-between"><span className="text-purple-400">DNK crosslink:</span><span className="text-red-400 font-bold">✗ &lt;5%</span></div>
                    <div className="flex justify-between"><span className="text-purple-400">Klinik faollik:</span><span className="text-red-400 font-bold">SAMARASIZ</span></div>
                  </div>
                </div>
                <div className="bg-red-900/30 rounded-xl p-5">
                  <h4 className="text-red-400 font-bold mb-2">Nima uchun samarasiz?</h4>
                  <p className="text-purple-200 text-xs leading-relaxed">
                    Ikkala NH₃ <em>trans</em> (180°) — juda uzoq, qo&apos;shni guaninlarni bog&apos;lash mumkin emas.
                    Faqat monoadduct yoki kam uchraydigan 1,3-intrastrand crosslink. HMG1 proteinasi TANIMAYDI → apoptoz signal yo&apos;q.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="bg-orange-900/30 rounded-lg p-4">
            <p className="text-orange-300 text-sm">
              <strong>Asosiy YaMR farqlari:</strong> ¹⁹⁵Pt da 250 ppm farq (-1850 vs -2100) va ¹J(Pt-H) da 20 Hz farq (65 vs 45 Hz).
              Ikki izomerni YaMR orqali aniq farqlash mumkin.
            </p>
          </div>
        </div>

        {/* KRISTALL MAYDON NAZARIYASI */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔬</span> Kristall maydon nazariyasi — TEKIS KVADRAT d⁸
          </h2>
          <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>Nima uchun tekis kvadrat?</strong> Pt²⁺ — 5d⁸ elektron konfiguratsiya. Katta Δ₁ (kristall maydon bo&apos;linishi) → oktaedr o&apos;rniga tekis kvadrat afzal.
              Barcha 8 elektron past orbitallarda, dx²-y² bo&apos;sh → diamagnit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">Elektron konfiguratsiya</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-purple-400">Metall ioni:</span><span className="text-blue-400 font-mono">{COMPOUND.crystalField.metalIon}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Elektron konfiguratsiya:</span><span className="text-blue-400 font-mono">{COMPOUND.crystalField.electronConfig}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">d-elektronlar:</span><span className="text-blue-400 font-mono">{COMPOUND.crystalField.dElectrons}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Spin holati:</span><span className="text-blue-400">{COMPOUND.crystalField.spinState}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Toq elektronlar:</span><span className="text-blue-400 font-mono">{COMPOUND.crystalField.unpairedElectrons}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Magnit momenti:</span><span className="text-blue-400 font-mono">{COMPOUND.crystalField.magneticMoment}</span></div>
              </div>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">Kristall maydon parametrlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-purple-400">Δ₁:</span><span className="text-blue-400 font-mono">{COMPOUND.crystalField.crystalFieldSplitting}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Racah B:</span><span className="text-blue-400 font-mono">{COMPOUND.crystalField.racahParameter}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">β:</span><span className="text-blue-400 font-mono">{COMPOUND.crystalField.nephelauxeticRatio}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">CFSE:</span><span className="text-blue-400 font-mono">{COMPOUND.crystalField.cFSE}</span></div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <h4 className="text-blue-400 font-bold mb-3">d-orbital bo&apos;linish diagrammasi (tekis kvadrat)</h4>
            <svg viewBox="0 0 600 280" className="w-full h-64" role="img" aria-label="d-orbital splitting square planar">
              <title>Tekis kvadrat d-orbital bo'linish — Pt²⁺ d⁸</title>
              <line x1="50" y1="250" x2="50" y2="20" stroke="#a78bfa" strokeWidth="1" />
              <text x="30" y="140" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 30, 140)">Energiya</text>

              <line x1="350" y1="40" x2="450" y2="40" stroke="#ef4444" strokeWidth="3" />
              <text x="400" y="30" textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="bold">
                d<tspan baselineShift="sub" fontSize="7">x²-y²</tspan>
              </text>
              <text x="480" y="43" fontSize="8" fill="#ef4444">BO&apos;SH</text>

              <line x1="350" y1="100" x2="450" y2="100" stroke="#fbbf24" strokeWidth="3" />
              <text x="400" y="90" textAnchor="middle" fontSize="10" fill="#fbbf24" fontWeight="bold">
                d<tspan baselineShift="sub" fontSize="7">xy</tspan>
              </text>
              <circle cx="400" cy="100" r="4" fill="#fbbf24" />
              <text x="400" y="95" textAnchor="middle" fontSize="6" fill="#fbbf24">↑↓</text>

              <line x1="350" y1="150" x2="450" y2="150" stroke="#22c55e" strokeWidth="3" />
              <text x="400" y="140" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="bold">
                d<tspan baselineShift="sub" fontSize="7">z²</tspan>
              </text>
              <circle cx="400" cy="150" r="4" fill="#22c55e" />
              <text x="400" y="145" textAnchor="middle" fontSize="6" fill="#22c55e">↑↓</text>

              <line x1="350" y1="210" x2="450" y2="210" stroke="#06b6d4" strokeWidth="3" />
              <text x="400" y="200" textAnchor="middle" fontSize="10" fill="#06b6d4" fontWeight="bold">
                d<tspan baselineShift="sub" fontSize="7">xz</tspan>, d<tspan baselineShift="sub" fontSize="7">yz</tspan>
              </text>
              <circle cx="380" cy="210" r="4" fill="#06b6d4" />
              <text x="380" y="205" textAnchor="middle" fontSize="6" fill="#06b6d4">↑↓</text>
              <circle cx="420" cy="210" r="4" fill="#06b6d4" />
              <text x="420" y="205" textAnchor="middle" fontSize="6" fill="#06b6d4">↑↓</text>

              <line x1="500" y1="40" x2="500" y2="100" stroke="#fbbf24" strokeWidth="2" />
              <text x="540" y="73" fontSize="9" fill="#fbbf24" fontWeight="bold">Δ₁</text>

              <text x="50" y="270" fontSize="8" fill="#a78bfa">Pt²⁺: 5d⁸ — barcha 8 elektron past orbitallarda</text>
            </svg>
          </div>
        </div>

        {/* SIMMETRIYA — D₂ₕ */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📐</span> Simmetriya (D₂ₕ) — MARKAZIY SIMMETRIYA
          </h2>
          <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-sm">
              <strong>D₂ₕ — muhim farq!</strong> Transplatinda markaziy simmetriya (i) bor. Bu <strong>mutual exclusion principle</strong>
              ga olib keladi — IR va Raman spektrlari ustma-ust tushmaydi. Sisplatinda (C₂ᵥ) markaziy simmetriya yo&apos;q.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">Simmetriya elementlari (8)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-purple-400">Nuqtaviy guruh:</span><span className="text-purple-400 font-mono">{COMPOUND.symmetry.pointGroup}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Guruh tartibi:</span><span className="text-purple-400 font-mono">{COMPOUND.symmetry.order}</span></div>
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
            <p className="text-purple-200 text-sm">{COMPOUND.symmetry.nmrEquivalence}</p>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 overflow-x-auto">
            <h4 className="text-purple-400 font-bold mb-3">D₂ₕ karakterlar jadvali (qisqacha)</h4>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-2 px-2 text-purple-400">Irrep</th>
                  <th className="py-2 px-2 text-purple-400">i</th>
                  <th className="py-2 px-2 text-purple-400">Spektral faollik</th>
                  <th className="py-2 px-2 text-purple-400">Funksiyalar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30"><td className="py-2 px-2 text-purple-400 font-bold">Ag</td><td className="py-2 px-2">+1</td><td className="py-2 px-2 text-yellow-400">Raman faol (g)</td><td className="py-2 px-2 text-xs text-yellow-400">x², y², z²</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-2 px-2 text-purple-400 font-bold">B1g</td><td className="py-2 px-2">+1</td><td className="py-2 px-2 text-yellow-400">Raman faol (g)</td><td className="py-2 px-2 text-xs text-yellow-400">xy</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-2 px-2 text-purple-400 font-bold">B1u</td><td className="py-2 px-2">-1</td><td className="py-2 px-2 text-cyan-400">IR faol (u)</td><td className="py-2 px-2 text-xs text-cyan-400">z</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-2 px-2 text-purple-400 font-bold">B2u</td><td className="py-2 px-2">-1</td><td className="py-2 px-2 text-cyan-400">IR faol (u)</td><td className="py-2 px-2 text-xs text-cyan-400">y</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-2 px-2 text-purple-400 font-bold">B3u</td><td className="py-2 px-2">-1</td><td className="py-2 px-2 text-cyan-400">IR faol (u)</td><td className="py-2 px-2 text-xs text-cyan-400">x</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-purple-400 mt-2">
              <strong>Eslatma:</strong> g (gerade) — Raman, u (ungerade) — IR. Markaziy simmetriya sababli hech qaysi moda ham IR ham Raman da faol emas.
            </p>
          </div>
        </div>

        {/* TRANS-EFFEKT VA J(Pt-H) FARQI */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⚡</span> TRANS-EFFEKT — NIMA UCHUN J(Pt-H) = 65 Hz?
          </h2>
          <div className="bg-yellow-900/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 text-sm">
              <strong>Transplatin da ¹J(Pt-H) = 65 Hz, sisplatinda 45 Hz</strong> — 20 Hz farq! Bu trans-effektning klassik YaMR dalili.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Sisplatin: J = 45 Hz</h3>
              <p className="text-purple-200 text-xs mb-2">Har bir NH₃ ga <em>cis</em>-NH₃ va <em>cis</em>-Cl.</p>
              <p className="text-purple-200 text-xs">
                NH₃ trans-NH₃ bo&apos;lgani uchun Pt-N bog&apos;ining s-xarakteri o&apos;rtacha → J = 45 Hz (o&apos;rtacha).
              </p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Transplatin: J = 65 Hz</h3>
              <p className="text-purple-200 text-xs mb-2">Har bir NH₃ ga <em>trans</em>-Cl (kuchli trans-influence).</p>
              <p className="text-purple-200 text-xs">
                Trans-Cl Pt-N bog&apos;ini uzaytiradi va zaiflashtiradi. Natijada Pt-N bog&apos;ining <strong>s-xarakteri ko&apos;proq</strong> →
                katta J bog&apos;lanish konstantasi: <strong className="text-yellow-400">65 Hz</strong>.
              </p>
            </div>
          </div>
          <div className="bg-yellow-900/30 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              <strong>Umumiy qoida:</strong> Trans-influence kuchi: <code className="text-yellow-400">CN⁻ ≈ CO ≈ C₂H₄ &gt; PR₃ &gt; CH₃⁻ &gt; SC(NH₂)₂ &gt; NO₂⁻ &gt; I⁻ &gt; Br⁻ &gt; Cl⁻ &gt; NH₃ &gt; OH⁻</code>
              Cl⁻ NH₃ dan kuchliroq trans-influence → trans-Pt-N bog&apos;i kuchsizroq, lekin s-xarakteri ko&apos;proq.
            </p>
          </div>
        </div>

        {/* YaMR NAZARIYASI */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧲</span> YaMR nazariyasi — chuqur tahlil
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setActiveNmrNucleus("pt195")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeNmrNucleus === "pt195" ? "bg-cyan-600/60 text-white border border-cyan-400/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>¹⁹⁵Pt (I=1/2)</button>
            <button onClick={() => setActiveNmrNucleus("h1")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeNmrNucleus === "h1" ? "bg-cyan-600/60 text-white border border-cyan-400/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>¹H (I=1/2)</button>
            <button onClick={() => setActiveNmrNucleus("n15")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeNmrNucleus === "n15" ? "bg-cyan-600/60 text-white border border-cyan-400/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>¹⁵N (I=1/2)</button>
            <button onClick={() => setActiveNmrNucleus("cl35")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeNmrNucleus === "cl35" ? "bg-cyan-600/60 text-white border border-cyan-400/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>³⁵Cl (I=3/2)</button>
          </div>

          {activeNmrNucleus === "pt195" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.pt195.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><div className="text-xs text-purple-400">Kimyoviy siljish:</div><div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.pt195.shift}</div></div>
                <div><div className="text-xs text-purple-400">Farq (vs sisplatin):</div><div className="text-lg font-mono font-bold text-red-400">+250 ppm</div></div>
                <div><div className="text-xs text-purple-400">Chiziq kengligi:</div><div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.pt195.linewidth}</div></div>
                <div><div className="text-xs text-purple-400">T₁:</div><div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.pt195.t1Relaxation}</div></div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun -1850 ppm (sisplatindan 250 ppm farq)?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.pt195.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">CSA:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.pt195.csa}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "h1" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.h1.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><div className="text-xs text-purple-400">Kimyoviy siljish:</div><div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.shift}</div></div>
                <div><div className="text-xs text-purple-400">¹J(Pt-H):</div><div className="text-lg font-mono font-bold text-red-400">65 Hz (+20 Hz!)</div></div>
                <div><div className="text-xs text-purple-400">Chiziq kengligi:</div><div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.linewidth}</div></div>
                <div><div className="text-xs text-purple-400">T₁:</div><div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.t1Relaxation}</div></div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun J = 65 Hz (sisplatindan katta)?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.couplingNotes}</p>
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
                <div><div className="text-xs text-purple-400">Kimyoviy siljish:</div><div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n15.shift}</div></div>
                <div><div className="text-xs text-purple-400">¹J(Pt-N):</div><div className="text-lg font-mono font-bold text-cyan-400">~450 Hz</div></div>
                <div><div className="text-xs text-purple-400">Chiziq kengligi:</div><div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n15.linewidth}</div></div>
                <div><div className="text-xs text-purple-400">T₁:</div><div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.n15.t1Relaxation}</div></div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun -55 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.n15.whyThisShift}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "cl35" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.cl35.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><div className="text-xs text-purple-400">Kimyoviy siljish:</div><div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.cl35.shift}</div></div>
                <div><div className="text-xs text-purple-400">Kvadrupol:</div><div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.cl35.quadrupolar}</div></div>
                <div><div className="text-xs text-purple-400">Chiziq kengligi:</div><div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.cl35.linewidth}</div></div>
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
                <div className="flex justify-between flex-col"><span className="text-purple-400">Pt-N (trans-Cl):</span><span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.ptN}</span></div>
                <div className="flex justify-between flex-col"><span className="text-purple-400">Pt-Cl (trans-NH₃):</span><span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.ptCl}</span></div>
                <div className="flex justify-between flex-col"><span className="text-purple-400">Taqqoslash:</span><span className="text-green-400 text-xs">{COMPOUND.structuralData.bondLengths.comparison}</span></div>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog&apos; burchaklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-purple-400">N-Pt-N:</span><span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.nPtN}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Cl-Pt-Cl:</span><span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.clPtCl}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">N-Pt-Cl:</span><span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.nPtCl}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Yig&apos;indi:</span><span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.sumAngles}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* KLINIK SAMARASIZLIK */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">❌</span> Klinik samarasizlik mexanizmi
          </h2>
          <div className="bg-red-900/30 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">
              <strong>Nima uchun transplatin saratonga qarshi samarasiz?</strong> Ikkala NH₃ ligand trans joylashgan (180°),
              shuning uchun DNK da qo&apos;shni guaninlarni bog&apos;lay olmaydi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Nima uchun samarasiz?</h3>
              <ul className="space-y-2 text-sm text-purple-200">
                {Object.values(COMPOUND.clinical.whyInactive).map((reason, i) => (
                  <li key={i}>• {reason}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">DNK bilan bog&apos;lanish</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Addukt nisbati:</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.dnaBinding.adductRatio}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Crosslink samaradorligi:</span>
                  <span className="text-red-400 font-bold text-xs">{COMPOUND.clinical.dnaBinding.crosslinkEfficiency}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Oqibat:</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.dnaBinding.consequence}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">HMG1 taniydi:</span>
                  <span className="text-red-400 text-xs">{COMPOUND.clinical.dnaBinding.hmgRecognition}</span>
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
                    <td className="py-3 px-3 text-xs">{signal.ligand}</td>
                    <td className="py-3 px-3 text-orange-400 font-mono font-bold">{signal.shift}</td>
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

        {/* INTERAKTIV ¹H YaMR SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv ¹H YaMR — J = 65 Hz (sisplatindan KATTA!)</h2>
          <p className="text-purple-200 leading-relaxed mb-6">
            Kimyoviy siljishni o&apos;zgartiring. Satellit dubletlar orasidagi masofa: <strong className="text-orange-400">65 Hz</strong> (sisplatinda 45 Hz).
          </p>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              Kimyoviy siljish (δ): {ppmSlider.toFixed(2)} ppm
            </label>
            <input
              type="range"
              min="0"
              max="7"
              step="0.05"
              value={ppmSlider}
              onChange={(e) => setPpmSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>0 ppm (TMS)</span>
              <span>3.15 (satellit)</span>
              <span>3.80 (markaziy)</span>
              <span>4.45 (satellit)</span>
              <span>7 ppm</span>
            </div>
          </div>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><div className="text-xs text-purple-400">Kimyoviy siljish:</div><div className="text-xl font-mono font-bold text-orange-400">{ppmSlider.toFixed(2)} ppm</div></div>
              <div><div className="text-xs text-purple-400">Signal:</div><div className="text-xl font-mono font-bold text-orange-400 text-sm">{currentSignal.notes !== "—" ? currentSignal.notes : "Signal yo'q"}</div></div>
              <div><div className="text-xs text-purple-400">¹J(Pt-H):</div><div className="text-xl font-mono font-bold text-red-400">65 Hz</div></div>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="YaMR spektr">
              <title>¹H YaMR spektr — transplatin</title>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((ppm, i) => {
                const x = 580 - (ppm / 7) * 530
                return (
                  <g key={i}>
                    <line x1={x} y1="220" x2={x} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={x} y="235" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                  </g>
                )
              })}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik</text>

              <line x1={580 - (3.8 / 7) * 530} y1="220" x2={580 - (3.8 / 7) * 530} y2="60" stroke="#fbbf24" strokeWidth="3" />
              <text x={580 - (3.8 / 7) * 530} y="55" textAnchor="middle" fontSize="8" fill="#fbbf24" fontWeight="bold">Markaziy (66.2%)</text>

              <line x1={580 - (3.15 / 7) * 530} y1="220" x2={580 - (3.15 / 7) * 530} y2="150" stroke="#ef4444" strokeWidth="2" />
              <text x={580 - (3.15 / 7) * 530} y="145" textAnchor="middle" fontSize="7" fill="#ef4444">¹⁹⁵Pt sat.</text>

              <line x1={580 - (4.45 / 7) * 530} y1="220" x2={580 - (4.45 / 7) * 530} y2="150" stroke="#ef4444" strokeWidth="2" />
              <text x={580 - (4.45 / 7) * 530} y="145" textAnchor="middle" fontSize="7" fill="#ef4444">¹⁹⁵Pt sat.</text>

              <line x1="580" y1="220" x2="580" y2="190" stroke="#22c55e" strokeWidth="2" />
              <text x="580" y="185" textAnchor="middle" fontSize="7" fill="#22c55e">TMS</text>

              <line x1={580 - (3.15 / 7) * 530} y1="170" x2={580 - (4.45 / 7) * 530} y2="170" stroke="#ef4444" strokeWidth="1" />
              <text x={580 - (3.8 / 7) * 530} y="165" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">J = 65 Hz</text>

              <line x1={580 - (ppmSlider / 7) * 530} y1="220" x2={580 - (ppmSlider / 7) * 530} y2="20" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4,2" />
            </svg>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-3">
            <p className="text-orange-300 text-xs">
              <strong>📌 Muhim:</strong> J = 65 Hz — sisplatindan (45 Hz) <em>20 Hz katta</em>! Bu trans-effekt dalili.
              Trans-Cl ta&apos;sirida Pt-N bog&apos;i uzayadi, lekin s-xarakteri ko&apos;payadi → katta J bog&apos;lanish.
            </p>
          </div>
        </div>

        {/* INTERAKTIV ¹⁹⁵Pt YaMR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv ¹⁹⁵Pt YaMR — -1850 ppm (kvintet)</h2>
          <p className="text-purple-200 leading-relaxed mb-6">
            ¹⁹⁵Pt signali -1850 ppm da (sisplatindan 250 ppm yuqori). Kvintet (¹⁴N I=1 bilan).
          </p>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              ¹⁹⁵Pt kimyoviy siljish: {ptPpmSlider} ppm
            </label>
            <input
              type="range"
              min="-2400"
              max="-1500"
              step="10"
              value={ptPpmSlider}
              onChange={(e) => setPtPpmSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="195Pt kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>-2400</span>
              <span>-2100 (sisplatin)</span>
              <span>-1850 (transplatin)</span>
              <span>-1500</span>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="195Pt YaMR spektr">
              <title>¹⁹⁵Pt YaMR — transplatin</title>
              {[-2400, -2200, -2000, -1800, -1600].map((ppm, i) => {
                const x = 580 - ((ppm + 2400) / 900) * 530
                return (
                  <g key={i}>
                    <line x1={x} y1="220" x2={x} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={x} y="235" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                  </g>
                )
              })}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik</text>

              {/* Sisplatin signali (ko'rsatish uchun) */}
              <line x1={580 - ((-2100 + 2400) / 900) * 530} y1="220" x2={580 - ((-2100 + 2400) / 900) * 530} y2="180" stroke="#22c55e" strokeWidth="1" strokeDasharray="3,2" />
              <text x={580 - ((-2100 + 2400) / 900) * 530} y="175" textAnchor="middle" fontSize="7" fill="#22c55e">Sisplatin (-2100)</text>

              {/* Transplatin kvintet */}
              {[-2070, -1960, -1850, -1740, -1630].map((ppm, i) => {
                const x = 580 - ((ppm + 2400) / 900) * 530
                const intensity = [0.2, 0.4, 0.6, 0.4, 0.2][i]
                const y = 220 - intensity * 180
                return <g key={i}><line x1={x} y1="220" x2={x} y2={y} stroke="#fbbf24" strokeWidth="2" /></g>
              })}
              <text x={580 - ((-1850 + 2400) / 900) * 530} y="35" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">Transplatin (kvintet)</text>

              {/* 250 ppm farq annotatsiya */}
              <line x1={580 - ((-2100 + 2400) / 900) * 530} y1="195" x2={580 - ((-1850 + 2400) / 900) * 530} y2="195" stroke="#ef4444" strokeWidth="1" />
              <text x={580 - ((-1975 + 2400) / 900) * 530} y="190" textAnchor="middle" fontSize="7" fill="#ef4444" fontWeight="bold">250 ppm</text>

              <line x1={580 - ((ptPpmSlider + 2400) / 900) * 530} y1="220" x2={580 - ((ptPpmSlider + 2400) / 900) * 530} y2="20" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4,2" />
            </svg>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-3">
            <p className="text-orange-300 text-xs">
              <strong>📌 Muhim:</strong> Transplatin -1850 ppm da, sisplatin -2100 ppm da — <strong>250 ppm farq</strong>.
              Bu ikkala izomerni YaMR orqali aniq farqlash mumkinligini ko&apos;rsatadi. Kvintet — ¹⁴N (I=1) bilan bog&apos;lanish, J ≈ 450 Hz.
            </p>
          </div>
        </div>

        {/* TARIX */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📜</span> Tarixiy kontekst
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Peyrone (1845)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-purple-400">Olim:</span><span className="text-amber-400">{COMPOUND.history.peyrone.scientist}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Yil:</span><span className="text-amber-400">{COMPOUND.history.peyrone.year}</span></div>
                <div className="flex justify-between flex-col"><span className="text-purple-400">Yutuq:</span><span className="text-amber-400 text-xs">{COMPOUND.history.peyrone.achievement}</span></div>
                <div className="flex justify-between flex-col"><span className="text-purple-400">Nom:</span><span className="text-amber-400 text-xs">{COMPOUND.history.peyrone.name}</span></div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Werner (1893)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-purple-400">Olim:</span><span className="text-amber-400">{COMPOUND.history.werner.scientist}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Yil:</span><span className="text-amber-400">{COMPOUND.history.werner.year}</span></div>
                <div className="flex justify-between flex-col"><span className="text-purple-400">Yutuq:</span><span className="text-amber-400 text-xs">{COMPOUND.history.werner.achievement}</span></div>
                <div className="flex justify-between flex-col"><span className="text-purple-400">Trans-effekt:</span><span className="text-amber-400 text-xs">{COMPOUND.history.werner.transEffect}</span></div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Rosenberg (1965)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-purple-400">Olim:</span><span className="text-amber-400">{COMPOUND.history.rosenberg.scientist}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Yil:</span><span className="text-amber-400">{COMPOUND.history.rosenberg.year}</span></div>
                <div className="flex justify-between flex-col"><span className="text-purple-400">Yutuq:</span><span className="text-amber-400 text-xs">{COMPOUND.history.rosenberg.achievement}</span></div>
                <div className="flex justify-between flex-col"><span className="text-purple-400">Topilma:</span><span className="text-amber-400 text-xs">{COMPOUND.history.rosenberg.finding}</span></div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Tushunish (1970-80)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-purple-400">Olimlar:</span><span className="text-amber-400">{COMPOUND.history.understanding.scientists}</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Yil:</span><span className="text-amber-400">{COMPOUND.history.understanding.year}</span></div>
                <div className="flex justify-between flex-col"><span className="text-purple-400">Mexanizm:</span><span className="text-amber-400 text-xs">{COMPOUND.history.understanding.mechanism}</span></div>
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
                  <th className="py-3 px-3 text-teal-400">Geometriya</th>
                  <th className="py-3 px-3 text-teal-400">¹⁹⁵Pt (ppm)</th>
                  <th className="py-3 px-3 text-teal-400">J(Pt-H) Hz</th>
                  <th className="py-3 px-3 text-teal-400">DNK crosslink</th>
                  <th className="py-3 px-3 text-teal-400">Klinik faollik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparison.map((comp, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/30 ${i === 1 ? "bg-orange-900/20" : ""}`}>
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{comp.compound}</td>
                    <td className="py-3 px-3 text-xs">{comp.geometry}</td>
                    <td className="py-3 px-3 text-xs font-mono text-orange-400">{comp.nmrPt}</td>
                    <td className="py-3 px-3 text-xs font-mono">{comp.jPtH}</td>
                    <td className="py-3 px-3 text-xs">{comp.crosslink}</td>
                    <td className="py-3 px-3 text-xs">{comp.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LABORATORIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧪 Laboratoriyani 0 dan bajarish tartibi</h2>
          <div className="space-y-3">
            {COMPOUND.labProcedure.map((step, i) => (
              <div key={i} onClick={() => setActiveLabStep(i)} className={`rounded-xl p-5 cursor-pointer transition-all ${activeLabStep === i ? "bg-orange-900/40 border-2 border-orange-400" : "bg-purple-800/30 border border-purple-700/30 hover:border-orange-500/50"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeLabStep === i ? "bg-orange-500 text-white" : "bg-purple-800 text-purple-400"}`}>{step.step}</div>
                  <div className="flex-1"><p className="text-orange-400 font-bold">{step.title}</p></div>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs mb-2">{step.desc}</p>
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3 mt-2">
                      <div className="text-orange-400 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
                      <p className="text-purple-200 text-xs">{step.theoryNote}</p>
                    </div>
                    <div className="text-[10px] text-orange-400 mt-2">Vaqt: {step.time}</div>
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
                  <th className="py-3 px-3 text-orange-400">Manba</th>
                  <th className="py-3 px-3 text-orange-400">Ta&apos;sir</th>
                  <th className="py-3 px-3 text-orange-400">Jiddiylik</th>
                  <th className="py-3 px-3 text-orange-400">Yechim</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.interferences.map((int, i) => (
                  <tr key={i} onClick={() => setActiveInterference(i)} className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${activeInterference === i ? "bg-orange-900/20" : ""}`}>
                    <td className="py-3 px-3 font-bold">{int.source}</td>
                    <td className="py-3 px-3 text-xs">{int.effect}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded text-[10px] ${int.severity === "Yuqori" ? "bg-red-600/30 text-red-400" : int.severity === "O'rta" ? "bg-yellow-600/30 text-yellow-400" : "bg-green-600/30 text-green-400"}`}>{int.severity}</span>
                    </td>
                    <td className="py-3 px-3 text-xs">{int.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="text-orange-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning nazariy izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">{COMPOUND.interferences[activeInterference].theoryNote}</p>
          </div>
        </div>

        {/* KENGAYTIRUVCHI METODLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Kengaytiruvchi metodlar</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.advancedTechniques.map((tech, i) => (
              <button key={i} onClick={() => setActiveTechnique(i)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTechnique === i ? "bg-orange-600/60 text-white border border-orange-400/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tech.name}</button>
            ))}
          </div>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-orange-400 font-bold mb-3">{COMPOUND.advancedTechniques[activeTechnique].name}</h3>
            <p className="text-purple-200 text-sm mb-4">{COMPOUND.advancedTechniques[activeTechnique].description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2">✓ Afzalliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">{COMPOUND.advancedTechniques[activeTechnique].advantages.map((adv, i) => <li key={i}>• {adv}</li>)}</ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2">✗ Kamchiliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">{COMPOUND.advancedTechniques[activeTechnique].disadvantages.map((dis, i) => <li key={i}>• {dis}</li>)}</ul>
              </div>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <div className="text-purple-400 text-xs mb-1">Eng yaxshi:</div>
              <div className="text-white text-sm">{COMPOUND.advancedTechniques[activeTechnique].bestFor}</div>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3 mt-3">
              <div className="text-orange-400 font-bold text-xs mb-1">Misollar:</div>
              <p className="text-purple-200 text-xs">{COMPOUND.advancedTechniques[activeTechnique].examples}</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-orange-400">Sis-trans izomerizm:</strong> Faqat sisplatin klinik jihatdan faol, transplatin samarasiz</li>
            <li><strong className="text-orange-400">¹⁹⁵Pt YaMR:</strong> -1850 ppm — sisplatindan (−2100 ppm) 250 ppm farq</li>
            <li><strong className="text-orange-400">¹J(Pt-H) = 65 Hz:</strong> Sisplatindan (45 Hz) 20 Hz katta — trans-effekt dalili</li>
            <li><strong className="text-orange-400">D₂ₕ simmetriya:</strong> Markaziy simmetriya → mutual exclusion principle (IR va Raman ustma-ust tushmaydi)</li>
            <li><strong className="text-orange-400">Geometriya:</strong> Pt-N = 2.05 Å, Pt-Cl = 2.32 Å, N-Pt-N = 180° (trans)</li>
            <li><strong className="text-orange-400">DNK bilan bog&apos;lanish:</strong> 1,2-intrastrand crosslink hosil qila olmaydi (ikki NH₃ juda uzoq)</li>
            <li><strong className="text-orange-400">HMG1 taniydi:</strong> Transplatin-DNK adduktni TANIMAYDI (sisplatinni taniydi)</li>
            <li><strong className="text-orange-400">Klinik natija:</strong> Apoptoz signal yo&apos;q → saraton hujayralari o&apos;lmaydi</li>
            <li><strong className="text-orange-400">Trans-effekt tartibi:</strong> Cl⁻ &gt; NH₃ (kinetik) → trans-Pt-N bog&apos;i kuchsizroq, lekin s-xarakteri ko&apos;proq</li>
            <li><strong className="text-orange-400">Tarix:</strong> Peyrone (1845) sintez, Werner (1893) nazariya, Rosenberg (1965) klinik kashfiyot</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Birikmalar katalogi</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmalar/pt-cl2-nh3-2-cis" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">← Sisplatin</Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • trans-[PtCl₂(NH₃)₂] (Transplatin) • YaMR spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Peyrone (1845), Werner (1893), Rosenberg (1965), Jamieson &amp; Lippard (1999), Still &amp; Neumann (1975), Pregosin (1983), Cotton-Wilkinson</p>
        </div>
      </footer>
    </main>
  )
}