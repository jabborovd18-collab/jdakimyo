"use client"
import Link from "next/link"
import { useState, useMemo } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// [Rh(PPh₃)₃Cl] — WILKINSON KATALIZATORI YaMR (ILMIY BOYITILGAN)
// Manbalar: Wilkinson (1965, Nobel 1973), Osborn (1966),
//           Bennet (1971), Pregosin (1983), Miessler-Tarr, Cotton-Wilkinson
// Xususiyat: ³¹P YaMR, ¹⁰³Rh YaMR, fluksionallik, gidrogenlash katalizi,
//           ¹J(Rh-P) = 180 Hz, tekis kvadrat d⁸
//  ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Rh(PPh<sub>3</sub>)<sub>3</sub>Cl]",
  formulaPlain: "[Rh(PPh3)3Cl]",
  iupac: "Xlorotris(trifenilfosfin)rodiy(I)",
  commonName: "Wilkinson katalizatori (qizil-jigar)",
  molarMass: 925.33,
  casNumber: "14694-95-2",
  color: "qizil-jigar (red-brown)",
  structure: "Tekis kvadrat (Square planar, taxminan C₂ᵥ)",
  metalLigand: "Rh-P (PPh₃, 3 ta), Rh-Cl",
  pointGroup: "C₂ᵥ (ideal), C₁ (real — PPh₃ fenil gruppalari past simmetriya)",
  electrolyteType: "Noelektrolit",
  molarConductivity: "~0 S·cm²/mol",
  solubility: "Benzol, toluol, CH₂Cl₂, CHCl₃ da yaxshi eriydi; suvda erimeydi",

  //  ═══════════════════════════════════════════════════════════════
  // KRISTALL MAYDON NAZARIYASI — TEKIS KVADRAT d⁸
  //  ═══════════════════════════════════════════════════════════════
  crystalField: {
    metalIon: "Rh⁺",
    electronConfig: "[Kr] 4d⁸",
    dElectrons: 8,
    spinState: "Past spinli (har doim — 4d⁸ da)",
    orbitalOccupancy: "(dxy)² (dz²)² (dxz,dyz)⁴ (dx²-y²)⁰",
    unpairedElectrons: 0,
    magneticMoment: "0 BM (diamagnit)",
    crystalFieldSplitting: "Tekis kvadrat: dx²-y² eng yuqori, Δ₁ ≈ 25,000 cm⁻¹",
    racahParameter: "B ≈ 500 cm⁻¹ (4d orbitallar keng tarqalgan)",
    nephelauxeticRatio: "β = B/B₀ ≈ 0.45 (kuchli kovalentlik, 4d metallar)",
    pairingEnergy: "P ≈ 18,000 cm⁻¹",
    cFSE: "CFSE ≈ -22,000 cm⁻¹ (tekis kvadrat, juda barqaror)",
    spectrochemicalSeries: "PPh₃ — kuchli σ-donor, kuchsiz π-akseptor (CN⁻ > PPh₃ > Cl⁻)",
    whySquarePlanar: "4d⁸ elektron konfiguratsiya — katta Δ₁. Oktaedr o'rniga, tekis kvadrat afzal (16 elektronli kompleks). Bu Rh⁺, Ir⁺, Pd²⁺, Pt²⁺, Au³⁺ barcha d⁸ komplekslar uchun xos.",
    colorOrigin: "d-d o'tishlar Laporte ta'qiqlangan, lekin kuchli ligand-to-metal charge transfer (LMCT) va fenil π-π* o'tishlar. Qizil-jigar rang — fenil gruppalarning π-tizimi va Rh-P bog'lanish natijasi.",
    chargeTransfer: "LMCT: PPh₃ (σ, π) → Rh⁺ (~400-500 nm, kuchli)",
    electronCount: "16 elektronli kompleks — oksidlovchi qo'shilish uchun qulay (18 elektron → katalitik sikl)"
  },

  //  ═══════════════════════════════════════════════════════════════
  // SIMMETRIYA
  //  ═══════════════════════════════════════════════════════════════
  symmetry: {
    pointGroup: "C₂ᵥ (ideal) — PPh₃ fenil gruppalari hisobga olinmaganda",
    order: 4,
    symmetryElements: ["E", "C₂ (Cl-Rh-P(trans) orqali)", "σᵥ (RhClP₂ tekisligi)", "σᵥ' (perpendicular)"],
    realSymmetry: "Real simmetriya: C₁ (fenil gruppalari past simmetriya). Lekin YaMR uchun PPh₃ ligandlari tez almashinadi → o'rtacha simmetriya kuzatiladi.",
    nmrEquivalence: "Past haroratda: 1 ta trans-P (Cl ga trans) va 2 ta ekvivalent cis-P. Yuqori haroratda (fluksionallik): barcha 3 ta P ekvivalent — bitta signal. Bu VT-NMR orqali kuzatiladi!",
    irActive: "A₁ + B₁ + B₂ — IR faol",
    ramanActive: "A₁ + A₂ + B₁ + B₂ — Raman faol",
    mutualExclusion: "C₂ᵥ da markaziy simmetriya yo'q — IR va Raman ustma-ust tushishi mumkin",
    transEffect: "Cl⁻ > PPh₃ (kinetik trans-effekt). Trans-P ligand biroz kuchsizroq bog'langan."
  },

  //  ═══════════════════════════════════════════════════════════════
  // YaMR NAZARIYASI — CHUQUR
  //  ═══════════════════════════════════════════════════════════════
  nmrTheory: {
    p31: {
      nucleus: "³¹P (I = 1/2, 100% tabiiy)",
      shift: "~48 ppm (referens: 85% H₃PO₄, 0 ppm)",
      whyThisShift: "PPh₃ ligand Rh⁺ ga bog'langan. Rh⁺ elektropozitiv → P elektron zichligi kamayadi → deshielded (erkin PPh₃: -5 ppm, kompleksda: ~48 ppm → Δδ = +53 ppm). Kuchli σ-donatsiya va kuchsiz π-akseptsiya.",
      multiplicity: "Past T da: 2 ta signal — trans-P (dublet, ¹J(Rh-P) = 180 Hz) + 2 ta cis-P (dublet-dublet, ¹J(Rh-P) + ²J(P-P)). Yuqori T da: bitta o'rtacha signal (fluksionallik).",
      linewidth: "~5-20 Hz (o'tkir, diamagnit)",
      t1Relaxation: "T₁ ≈ 1-5 s (CSA va dipol-dipol)",
      jCoupling: "¹J(Rh-P) ≈ 180 Hz (to'g'ridan-to'g'ri Rh-P bog'), ²J(P-P) ≈ 20-40 Hz (P-Rh-P bog'lanish)",
      sensitivity: "³¹P — eng yaxshi metall emas yadrolar! 100% tabiiy, I=1/2, yuqori γ. Sezgirlik ¹H dan ~15× past, lekin ¹³C dan 26× yaxshiroq."
    },
    rh103: {
      nucleus: "¹⁰³Rh (I = 1/2, 100% tabiiy)",
      shift: "~6700 ppm (referens: Ξ skalasi, Rh(acac)(CO)₂)",
      whyThisShift: "¹⁰³Rh kimyoviy siljishi juda keng diapazon (-5000 dan +15000 ppm). Wilkinson katalizatorida ~6700 ppm — Rh⁺ (d⁸ tekis kvadrat), PPh₃ kuchli σ-donor → deshielded.",
      sensitivity: "Juda past sezgirlik (¹H dan ~30× past, ¹³C dan ~2× past). Past γ va past rezonans chastotasi.",
      linewidth: "~10-50 Hz",
      t1Relaxation: "T₁ ≈ 1-10 s",
      detection: "Odatda ¹⁰³Rh YaMR to'g'ridan-to'g'ri emas, bilvosita — ¹H{¹⁰³Rh} yoki ³¹P{¹⁰³Rh} orqali olinadi (INEPT, HMQC). Yoki ³¹P YaMR dan ¹J(Rh-P) orqali Rh haqida ma'lumot olinadi.",
      referencing: "Ξ(¹⁰³Rh) = 3.16 MHz (IUPAC). Referens: Rh(acac)(CO)₂ yoki [Rh(CO)₂Cl]₂."
    },
    h1: {
      nucleus: "¹H (I = 1/2, 100% tabiiy)",
      shift: "7.2-7.8 ppm (fenil protonlari, 45H)",
      whyThisShift: "PPh₃ fenil gruppalari aromatik protonlar. Orto-protonlar (Rh ga yaqin) ~7.7 ppm, meta va para ~7.3-7.4 ppm.",
      multiplicity: "Murakkab multipletlar (AA'BB'C sistemalari)",
      linewidth: "~2-5 Hz (o'tkir)",
      integration: "45H (3 × 15 = 45)",
      couplingNotes: "³J(H-H) ≈ 7-8 Hz (orto-bog'liq), ⁴J ≈ 1-2 Hz (meta-bog'liq)."
    },
    c13: {
      nucleus: "¹³C (I = 1/2, 1.1% tabiiy)",
      shift: "125-140 ppm (fenil uglerodlar)",
      multiplicity: "Dublet (³¹P bilan bog'lanish, ¹J(P-C) ≈ 10-20 Hz)",
      notes: "Ipso-C (P bilan bog'langan) ~137 ppm (dublet, ¹J(P-C) ≈ 15 Hz). Orto-C ~134 ppm (dublet, ²J(P-C) ≈ 10 Hz)."
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // STRUKTURAVIY PARAMETRLAR
  //  ═══════════════════════════════════════════════════════════════
  structuralData: {
    bondLengths: {
      rhP_trans: "2.21-2.23 Å (Rh-P trans, Cl ga trans — biroz uzunroq)",
      rhP_cis: "2.32-2.34 Å (Rh-P cis, 2 ta ekvivalent — qisqaroq)",
      rhCl: "2.38-2.40 Å (Rh-Cl)",
      pc_phosphine: "1.82-1.84 Å (P-C ipso)",
      comparison: "Rh⁺ ion radiusi: 0.67 Å. [Rh(CO)₂Cl]₂ da Rh-Cl = 2.38 Å. PPh₃ ning katta sterik ta'siri → cis-P uzoqroq (2.33 Å).",
      sterics: "PPh₃ juda katta (cone angle = 145°). Shuning uchun 4 ta PPh₃ emas, 3 ta PPh₃ (16 elektronli kompleks)."
    },
    bondAngles: {
      pRhP_cis: "95-97° (cis P-Rh-P, sterik tufayli 90° dan katta)",
      pRhCl_cis: "95-97°",
      pRhP_trans: "167-172° (trans P-Rh-P, 180° emas — distorsiya)",
      comparison: "Ideal tekis kvadrat 90°, lekin PPh₃ sterik ta'siri tufayli 95-97°."
    },
    fluxionality: {
      description: "PPh₃ ligandlari tez almashinadi (dissotsiativ mexanizm)",
      mechanism: "[RhCl(PPh₃)₃] ⇌ [RhCl(PPh₃)₂] + PPh₃ (dissotsiatsiya) → tez almashinish",
      rate: "k ≈ 10²-10⁴ s⁻¹ (298 K da)",
      activation: "Eₐ ≈ 50-70 kJ/mol",
      nmrEffect: "VT-NMR da: past T da 2 ta ³¹P signal (trans va cis), yuqori T da 1 ta o'rtacha signal (tez almashinish)",
      coalescenceTemp: "Tc ≈ 50-70°C (koalesens harorati)"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // KATALITIK MEXANIZM — GIDROGENLASH
  //  ═══════════════════════════════════════════════════════════════
  catalysis: {
    application: "Olefinlarni gidrogenlash (C=C → C-C)",
    mechanism: {
      step1: "1. Dissotsiatsiya: [RhCl(PPh₃)₃] → [RhCl(PPh₃)₂] + PPh₃ (16e → 14e, bo'sh joy)",
      step2: "2. Oksidlovchi qo'shilish: [RhCl(PPh₃)₂] + H₂ → [RhCl(H)₂(PPh₃)₂] (Rh⁺ → Rh³⁺, 16e → 18e)",
      step3: "3. Olefin koordinatsiyasi: [RhCl(H)₂(PPh₃)₂] + C₂H₄ → [RhCl(H)₂(C₂H₄)(PPh₃)₂] (18e)",
      step4: "4. Migrator qo'shilish: [RhCl(H)₂(C₂H₄)(PPh₃)₂] → [RhCl(H)(C₂H₅)(PPh₃)₂] (Rh-C bog' hosil)",
      step5: "5. Qaytaruvchi yo'qotish: [RhCl(H)(C₂H₅)(PPh₃)₂] → [RhCl(PPh₃)₂] + C₂H₆ (katalizator qayta tiklanadi)"
    },
    selectivity: "Sterik tanlov: kamroq to'siqlangan C=C bog'lar tezroq gidrogenlanadi (terminal > internal)",
    advantages: ["Mild sharoitlar (25°C, 1 atm H₂)", "Yuqori tanlovchanlik", "Funktsional gruppalarga tolerant (C=O, C≡N ta'sirlanmaydi)"],
    limitations: ["Faqat eriydigan olefinlar", "Aromatik C=C gidrogenlanmaydi", "Katalizator qimmat (Rh)"]
  },

  //  ═══════════════════════════════════════════════════════════════
  // TARIXIY KONTEKST
  //  ═══════════════════════════════════════════════════════════════
  history: {
    wilkinson: {
      year: 1965,
      scientist: "Geoffrey Wilkinson (Imperial College, London)",
      achievement: "[RhCl(PPh₃)₃] ni sintez qildi va katalitik faolligini kashf qildi",
      nobel: "Nobel mukofoti (1973, Ernst Otto Fischer bilan birga) — metallosenlar va organometallik kimyo",
      significance: "Birinchi bir hil katalizatorlardan biri (homogeneous catalysis)"
    },
    osborn: {
      year: 1966,
      scientist: "J. A. Osborn, F. H. Jardine, G. Wilkinson",
      achievement: "Katalitik mexanizmini batafsil o'rgandilar",
      contribution: "Dissotsiativ mexanizm va oksidlovchi qo'shilish tushunchasi"
    },
    bennett: {
      year: 1971,
      scientist: "M. A. Bennett",
      achievement: "³¹P YaMR orqali fluksionallikni kuzatdi",
      contribution: "VT-NMR orqali ligand almashinish kinetikasi"
    },
    pregosin: {
      year: "1980-yillar",
      scientist: "P. S. Pregosin",
      achievement: "¹⁰³Rh YaMR spektroskopiyasini tizimli rivojlantirdi",
      contribution: "Rh komplekslarining ¹⁰³Rh kimyoviy siljishlari katalogi"
    }
  },

  //  ═══════════════════════════════════════════════════════════════
  // TAQQOSLASH — BOSHQA Rh KOMPLEKSLARI
  //  ═══════════════════════════════════════════════════════════════
  comparison: [
    {
      compound: "[RhCl(PPh₃)₃]",
      ligand: "3 PPh₃ + Cl⁻",
      geometry: "Tekis kvadrat",
      nmrP: "³¹P: 48 ppm",
      jRhP: "¹J(Rh-P) = 180 Hz",
      use: "Olefin gidrogenlash"
    },
    {
      compound: "[Rh(CO)(PPh₃)₂Cl]",
      ligand: "2 PPh₃ + CO + Cl⁻",
      geometry: "Tekis kvadrat",
      nmrP: "³¹P: 35 ppm",
      jRhP: "¹J(Rh-P) = 125 Hz",
      use: "Karbonillash (Monsanto)"
    },
    {
      compound: "[Rh(acac)(CO)₂]",
      ligand: "acac⁻ + 2 CO",
      geometry: "Tekis kvadrat",
      nmrP: "— (P yo'q)",
      jRhP: "—",
      use: "Hydroformilash"
    },
    {
      compound: "[RhH(PPh₃)₄]",
      ligand: "4 PPh₃ + H⁻",
      geometry: "Trigonal bipiramidal",
      nmrP: "³¹P: -10 ppm",
      jRhP: "¹J(Rh-P) = 100 Hz",
      use: "Gidrogenlash (alternativa)"
    },
    {
      compound: "[RhCl(PMe₃)₃]",
      ligand: "3 PMe₃ + Cl⁻",
      geometry: "Tekis kvadrat",
      nmrP: "³¹P: -20 ppm",
      jRhP: "¹J(Rh-P) = 150 Hz",
      use: "Tadqiqot (kuchsiz sterik)"
    }
  ],

  // YaMR signallar (batafsil)
  nmrSignals: [
    {
      nucleus: "³¹P",
      ligand: "PPh₃ (trans-Cl)",
      shift: 48,
      multiplicity: "dublet (¹J(Rh-P) = 180 Hz)",
      jCoupling: "¹J(Rh-P) = 180 Hz",
      integration: "1P",
      notes: "Trans-P (Cl ga trans). Past T da aniq ko'rinadi. Yuqori T da fluksionallik tufayli o'rtacha signal."
    },
    {
      nucleus: "³¹P",
      ligand: "PPh₃ (cis-Cl, 2 ta)",
      shift: 48,
      multiplicity: "dublet-dublet (¹J(Rh-P) + ²J(P-P))",
      jCoupling: "¹J(Rh-P) = 180 Hz, ²J(P-P) ≈ 30 Hz",
      integration: "2P",
      notes: "Cis-P (2 ta ekvivalent). ²J(P-P) bog'lanish tufayli dublet-dublet. Yuqori T da trans-P bilan o'rtacha signal."
    },
    {
      nucleus: "¹H",
      ligand: "PPh₃ fenil (45H)",
      shift: "7.2-7.8",
      multiplicity: "murakkab multiplet",
      jCoupling: "³J(H-H) = 7-8 Hz",
      integration: "45H",
      notes: "Orto-H (7.7 ppm), meta/para-H (7.3-7.4 ppm). 45H umumiy (3 × 15)."
    },
    {
      nucleus: "¹³C",
      ligand: "PPh₃ ipso-C",
      shift: 137,
      multiplicity: "dublet",
      jCoupling: "¹J(P-C) = 15 Hz",
      integration: "3C",
      notes: "P bilan to'g'ridan-to'g'ri bog'langan C."
    },
    {
      nucleus: "¹⁰³Rh",
      ligand: "Rh markaz",
      shift: 6700,
      multiplicity: "kvartet (³¹P bilan, past T da)",
      jCoupling: "¹J(Rh-P) = 180 Hz",
      integration: "1Rh",
      notes: "Juda past sezgirlik. Odatda ¹H{¹⁰³Rh} yoki ³¹P{¹⁰³Rh} orqali bilvosita kuzatiladi."
    }
  ],

  // ³¹P YaMR spektr ma'lumotlari (simulyatsiya uchun)
  p31Spectrum: [
    { ppm: 0, intensity: 0, notes: "H₃PO₄ referens" },
    { ppm: 20, intensity: 0, notes: "—" },
    { ppm: 30, intensity: 0, notes: "—" },
    { ppm: 38, intensity: 0.5, notes: "³¹P trans-P (past maydon dublet, ¹J=180 Hz)" },
    { ppm: 48, intensity: 0.5, notes: "³¹P trans-P (markaziy, yuqori maydon dublet)" },
    { ppm: 58, intensity: 0, notes: "—" },
    { ppm: 68, intensity: 0, notes: "—" },
    { ppm: 78, intensity: 0, notes: "—" }
  ],

  // Halaqit beruvchi omillar
  interferences: [
    {
      source: "PPh₃ oksidi (OPPh₃) aralashmasi",
      effect: "³¹P YaMR da ~30 ppm da qo'shimcha signal (OPPh₃)",
      severity: "Yuqori",
      solution: "Sof namuna ishlatish. Inert muhitda saqlash (N₂, Ar).",
      theoryNote: "PPh₃ havo ta'sirida sekin OPPh₃ ga oksidlanadi. OPPh₃ ³¹P signal ~30 ppm da (Wilkinson dan ~18 ppm past)."
    },
    {
      source: "Dissotsiatsiya mahsulotlari ([RhCl(PPh₃)₂])",
      effect: "³¹P YaMR da qo'shimcha signallar (~40-50 ppm, boshqa J(Rh-P))",
      severity: "O'rta",
      solution: "Yuqori konsentratsiya, past harorat. Eritmada dissotsiatsiya muvozanatida.",
      theoryNote: "Wilkinson eritmada dissotsiatsiya muvozanatida: [RhCl(PPh₃)₃] ⇌ [RhCl(PPh₃)₂] + PPh₃. Erkin PPh₃ ³¹P signal -5 ppm da."
    },
    {
      source: "Fluksionallik (harorat effekti)",
      effect: "Yuqori T da ³¹P signallari birlashadi (koalesens)",
      severity: "O'rta (nazorat qilinadi)",
      solution: "VT-NMR orqali kinetikani o'rganish. Past T da (~-50°C) aniq signallar.",
      theoryNote: "PPh₃ ligandlari tez almashinadi. Past T da sekin almashinish → 2 ta signal (trans va cis). Yuqori T da tez almashinish → 1 ta o'rtacha signal."
    },
    {
      source: "Erituvchi cho'qqilari",
      effect: "CDCl₃ da 7.26 ppm (¹H), 77 ppm (¹³C)",
      severity: "Past",
      solution: "Erituvchi signallari fenil mintaqasida, lekin farqlash oson.",
      theoryNote: "Wilkinson fenil signallari 7.2-7.8 ppm da. CDCl₃ signali 7.26 ppm — yaqin, lekin multipletlardan farq qiladi."
    },
    {
      source: "Namlik (H₂O)",
      effect: "Katalizatorning parchalanishi (Rh-H yoki Rh-OH hosil bo'lishi)",
      severity: "Yuqori",
      solution: "Quruq erituvchilar, inert muhit (Schlenk texnikasi).",
      theoryNote: "Wilkinson namlikka sezgir. H₂O bilan [RhH(PPh₃)₃] yoki [Rh(OH)(PPh₃)₂] hosil bo'lishi mumkin."
    }
  ],

  // Laboratoriya tartibi
  labProcedure: [
    {
      step: 1,
      title: "⚠️ Xavfsizlik tayyorgarligi",
      desc: "Qo'lqop, ko'zoynak, labor xalat. Wilkinson katalizatori havoga sezgir. Inert muhitda ishlash (Schlenk texnikasi yoki glovebox).",
      time: "15 daq",
      theoryNote: "Wilkinson havo va namlikka sezgir — PPh₃ oksidlanadi, katalizator parchalanadi. Inert muhit (N₂, Ar) kerak."
    },
    {
      step: 2,
      title: "Sof [RhCl(PPh₃)₃] ni tayyorlash",
      desc: "Tijorat Wilkinson (99%) yoki sintez. Sintez: RhCl₃·3H₂O + PPh₃ (4 eq) + EtOH → qaynatish → qizil kristallar.",
      time: "2-3 soat (sintez) yoki tayyor",
      theoryNote: "RhCl₃ + 4 PPh₃ → [RhCl(PPh₃)₃] + OPPh₃ + 2 HCl. EtOH da qaynatish, sovitish, qizil-jigar kristallar yig'ish."
    },
    {
      step: 3,
      title: "YaMR spektrometrni tayyorlash",
      desc: "YaMR spektrometrni yoqish, 30 daq stabillash. Shimlash. CDCl₃ yoki C₆D₆ erituvchi.",
      time: "30 daq",
      theoryNote: "C₆D₆ (deuterlangan benzol) eng yaxshi erituvchi — Wilkinson yaxshi eriydi, aromatik signallar uzoq. CDCl₃ ham ishlatiladi."
    },
    {
      step: 4,
      title: "Namuna tayyorlash",
      desc: "10-30 mg Wilkinson ni 0.6 mL C₆D₆ da eritish. J-capped YaMR naychada (inert muhit).",
      time: "10 daq",
      theoryNote: "J-capped naychalar inert muhitni saqlaydi. C₆D₆ da Wilkinson barqaror."
    },
    {
      step: 5,
      title: "¹H YaMR spektrini olish",
      desc: "¹H YaMR spektrini olish (16-64 skan). Fenil signallarni tekshirish (7.2-7.8 ppm, 45H).",
      time: "5-10 daq",
      theoryNote: "¹H YaMR da 7.2-7.8 ppm da murakkab multipletlar (45H). Bu katalizatorning sof ekanligini tekshirish uchun."
    },
    {
      step: 6,
      title: "³¹P YaMR spektrini olish",
      desc: "³¹P YaMR spektrini olish (100-500 skan). ~48 ppm da signal (dublet, ¹J(Rh-P) = 180 Hz).",
      time: "10-20 daq",
      theoryNote: "³¹P YaMR da ~48 ppm da dublet (¹J(Rh-P) = 180 Hz). Past T da trans-P va cis-P alohida ko'rinadi. Yuqori T da birlashgan signal."
    },
    {
      step: 7,
      title: "VT-NMR (Variable Temperature)",
      desc: "Haroratni -50°C dan +70°C gacha o'zgartirib, ³¹P signalini kuzatish. Koalesens haroratini aniqlash.",
      time: "1-2 soat",
      theoryNote: "VT-NMR orqali fluksionallikni o'rganish. Past T da 2 ta signal (trans va cis-P), yuqori T da 1 ta o'rtacha signal. Tc ≈ 50-70°C."
    },
    {
      step: 8,
      title: "Katalitik test (ixtiyoriy)",
      desc: "Tsiklogeksen + H₂ + Wilkinson → tsiklogeksan. Konversiyani ¹H YaMR orqali tekshirish.",
      time: "1-2 soat",
      theoryNote: "Wilkinson faolligini tekshirish. Tsiklogeksen (C₆H₁₀) → tsiklogeksan (C₆H₁₂). ¹H YaMR da C=C signallari yo'qoladi."
    }
  ],

  // Kengaytiruvchi metodlar
  advancedTechniques: [
    {
      name: "VT-NMR (Variable Temperature)",
      description: "Haroratni o'zgartirib fluksionallikni o'rganish",
      advantages: ["Ligand almashinish kinetikasi", "Eₐ, ΔH‡, ΔS‡", "Mexanizm"],
      disadvantages: ["Uzoq vaqt", "Harorat nazorati", "Murakkab tahlil"],
      bestFor: "Fluksionallik, kinetika, mexanizm",
      examples: "PPh₃ almashinish tezligi, Tc ≈ 50-70°C"
    },
    {
      name: "³¹P{¹⁰³Rh} YaMR (bilvosita)",
      description: "¹⁰³Rh bog'lanishlarini ³¹P orqali aniqlash",
      advantages: ["¹J(Rh-P) aniq", "Yuqori sezgirlik (³¹P)", "Strukturaviy ma'lumot"],
      disadvantages: ["Maxsus texnikalar", "Murakkab"],
      bestFor: "Rh-P bog'lanish, geometriya",
      examples: "¹J(Rh-P) = 180 Hz (trans-P) va ¹J(Rh-P) = 125 Hz (cis-P)"
    },
    {
      name: "2D YaMR (HSQC, HMBC, COSY)",
      description: "Ko'p o'lchovli YaMR",
      advantages: ["Bog'lanishlar xaritasi", "Murakkab spektrlar", "Aralashmalar"],
      disadvantages: ["Uzoq vaqt", "Murakkab tahlil"],
      bestFor: "Strukturaviy aniqlash, fenil gruppalari",
      examples: "¹H-¹³C HSQC, ¹H-³¹P HMBC"
    },
    {
      name: "X-ray kristallografiya (SCXRD)",
      description: "Kristall strukturasini aniq aniqlash",
      advantages: ["Aniq bog' uzunliklari", "3D struktura", "Sterik"],
      disadvantages: ["Kristall kerak", "Qimmat"],
      bestFor: "Strukturaviy parametrlar, sterik",
      examples: "Rh-P = 2.21-2.34 Å, Rh-Cl = 2.38 Å"
    },
    {
      name: "Katalitik test (GC, NMR)",
      description: "Gidrogenlash faolligini o'lchash",
      advantages: ["Amaliy ahamiyat", "Tanlovchanlik", "Kinetika"],
      disadvantages: ["Maxsus uskuna", "Uzoq vaqt"],
      bestFor: "Katalizator samaradorligi",
      examples: "Tsiklogeksen → tsiklogeksan, TOF ≈ 10³ h⁻¹"
    },
    {
      name: "DFT hisob-kitoblari",
      description: "Katalitik mexanizmini modellashtirish",
      advantages: ["Mexanizm", "Transition states", "Energiya"],
      disadvantages: ["Kuchli kompyuter", "Murakkab"],
      bestFor: "Mexanizm, energiya profillari",
      examples: "B3LYP/6-31G(d) — oksidlovchi qo'shilish TS"
    }
  ]
}

export default function RhPPh33ClPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [ppmSlider, setPpmSlider] = useState(48)
  const [activeNmrNucleus, setActiveNmrNucleus] = useState("p31")
  const [temperature, setTemperature] = useState(298)

  const currentSignal = useMemo(() => {
    let closest = COMPOUND.p31Spectrum[0]
    let minDiff = Math.abs(ppmSlider - COMPOUND.p31Spectrum[0].ppm)
    for (let i = 1; i < COMPOUND.p31Spectrum.length; i++) {
      const diff = Math.abs(ppmSlider - COMPOUND.p31Spectrum[i].ppm)
      if (diff < minDiff) {
        minDiff = diff
        closest = COMPOUND.p31Spectrum[i]
      }
    }
    return closest
  }, [ppmSlider])

  const fluxionalityStatus = useMemo(() => {
    if (temperature < 280) return { status: "Sekin almashinish", signals: "2 ta signal (trans va cis-P)", color: "text-blue-400" }
    if (temperature > 330) return { status: "Tez almashinish", signals: "1 ta o'rtacha signal", color: "text-red-400" }
    return { status: "Koalesens", signals: "Keng signal", color: "text-yellow-400" }
  }, [temperature])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-amber-950/20 to-blue-950 text-white">
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-amber-950 to-purple-950 border-2 border-amber-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🧲</span> [Rh(PPh₃)₃Cl] — WILKINSON KATALIZATORI YaMR!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-amber-300">Wilkinson katalizatori</strong> — Nobel mukofoti (1973)!
              ³¹P YaMR, ¹⁰³Rh YaMR, fluksionallik, olefin gidrogenlash katalizi.
              <strong className="text-amber-300"> ¹J(Rh-P) = 180 Hz</strong> — klassik bog&apos;lanish konstantasi!
            </p>
            <div className="bg-amber-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-amber-400 font-bold mb-2">🧲 YaMR signallar:</div>
                  <div className="text-purple-200">
                    <strong>³¹P:</strong> ~48 ppm (dublet, J=180 Hz)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹⁰³Rh:</strong> ~6700 ppm (past sezgirlik)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>¹H:</strong> 7.2-7.8 ppm (fenil, 45H)
                  </div>
                </div>
                <div>
                  <div className="text-amber-400 font-bold mb-2">🔬 Asosiy xususiyatlar:</div>
                  <div className="text-purple-200">
                    <strong>Metall:</strong> Rh⁺ (4d⁸)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Geometriya:</strong> Tekis kvadrat
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Fluksionallik:</strong> Tez almashinish
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-amber-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-amber-300">Knowledge Base:</strong> Wilkinson (1965, Nobel 1973), Osborn (1966),
                Bennett (1971), Pregosin (1983), Cotton-Wilkinson, Miessler-Tarr
              </p>
            </div>
            <div className="bg-red-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-200">
                <strong className="text-red-300">⚠️ EHTIYOT:</strong> Wilkinson havo va namlikka sezgir!
                Inert muhitda (N₂, Ar) ishlash kerak. PPh₃ oksidlanishi mumkin.
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
              <span className="text-amber-400 font-semibold">Wilkinson</span>
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
                  <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Wilkinson Katalizatori</span>
                  <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Nobel 1973</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Tekis Kvadrat</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Fluksionallik</span>
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
            <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-3 py-1 rounded-full text-xs">Wilkinson (1965)</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Nobel 1973</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Fluksionallik</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Gidrogenlash</span>
          </div>
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              [Rh(PPh₃)₃Cl]
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>
          <p className="text-purple-300 text-lg mb-4">
            Wilkinson katalizatori — <span className="text-amber-400 italic">&quot;Olefin gidrogenlash, ³¹P-¹⁰³Rh YaMR, fluksionallik fenomeni&quot;</span>
          </p>
          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-amber-400">YaMR spektroskopiya</strong> yordamida <strong className="text-amber-400">katalitik kompleksni</strong> o&apos;rganish.
            Rh⁺ — 4d⁸ tekis kvadrat, diamagnit.
            <strong className="text-amber-400"> ³¹P YaMR: ~48 ppm</strong> (dublet, ¹J(Rh-P) = 180 Hz).
            <strong className="text-amber-400"> ¹⁰³Rh YaMR: ~6700 ppm</strong>.
            <strong className="text-amber-400"> Fluksionallik</strong> — PPh₃ ligandlari tez almashinadi (VT-NMR da kuzatiladi).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Rh⁺ (4d⁸)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Tekis kvadrat</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">¹J(Rh-P)</div>
              <div className="text-white font-bold">180 Hz</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Kataliz</div>
              <div className="text-white font-bold">Gidrogenlash</div>
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
              <strong>Nima uchun tekis kvadrat?</strong> Rh⁺ — 4d⁸ elektron konfiguratsiya. 4d orbitallar keng tarqalgan → katta Δ₁.
              Oktaedr o&apos;rniga, tekis kvadrat afzal — 16 elektronli kompleks.
              Bu <strong className="text-amber-400">oksidlovchi qo&apos;shilish uchun qulay</strong> (18 elektron → katalitik sikl).
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
              <strong>Elektron soni:</strong> {COMPOUND.crystalField.electronCount}
            </p>
          </div>

          {/* d-orbital splitting diagram */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <h4 className="text-blue-400 font-bold mb-3">d-orbital bo&apos;linish diagrammasi (tekis kvadrat, D₄ₕ)</h4>
            <svg viewBox="0 0 600 280" className="w-full h-64" role="img" aria-label="d-orbital splitting square planar">
              <title>Tekis kvadrat d-orbital bo'linish — Rh⁺ d⁸</title>
              <line x1="50" y1="250" x2="50" y2="20" stroke="#a78bfa" strokeWidth="1" />
              <text x="30" y="140" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 30, 140)">Energiya</text>

              <line x1="350" y1="40" x2="450" y2="40" stroke="#ef4444" strokeWidth="3" />
              <text x="400" y="30" textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="bold">
                d<tspan baselineShift="sub" fontSize="7">x²-y²</tspan>
              </text>
              <text x="480" y="43" fontSize="8" fill="#ef4444">BO&apos;SH (LUMO)</text>

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

              <text x="150" y="40" fontSize="9" fill="#ef4444" fontWeight="bold">LUMO (bo&apos;sh)</text>
              <text x="150" y="210" fontSize="9" fill="#06b6d4" fontWeight="bold">HOMO (to&apos;ldirilgan)</text>
              <text x="50" y="270" fontSize="8" fill="#a78bfa">Rh⁺: 4d⁸ — barcha 8 elektron past orbitallarda</text>
            </svg>
          </div>
        </div>

        {/* SIMMETRIYA */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📐</span> Simmetriya (C₂ᵥ) — ideal vs real
          </h2>
          <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-sm">
              <strong>C₂ᵥ nuqtaviy guruhi:</strong> PPh₃ fenil gruppalari hisobga olinmaganda.
              Real simmetriya: <strong>C₁</strong> (fenil gruppalari past simmetriya). Lekin YaMR uchun PPh₃ ligandlari tez almashinadi →
              <strong className="text-amber-400"> o&apos;rtacha simmetriya</strong> kuzatiladi. Bu <em>fluksionallik</em> fenomeni!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">Simmetriya elementlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Ideal:</span>
                  <span className="text-purple-400 font-mono">{COMPOUND.symmetry.pointGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Guruh tartibi:</span>
                  <span className="text-purple-400 font-mono">{COMPOUND.symmetry.order}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Real:</span>
                  <span className="text-purple-400 text-xs">{COMPOUND.symmetry.realSymmetry}</span>
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
        </div>

        {/* FLUKSIONALLIK — ENG MUHIM QISM */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span> FLUKSIONALLIK — LIGAND ALMASHINISH
          </h2>
          <div className="bg-green-900/30 rounded-lg p-4 mb-6">
            <p className="text-green-300 text-sm">
              <strong>Fluksionallik:</strong> PPh₃ ligandlari tez almashinadi (dissotsiativ mexanizm).
              VT-NMR (Variable Temperature) orqali bu jarayonni kuzatish mumkin!
              Past T da — sekin almashinish (2 ta signal). Yuqori T da — tez almashinish (1 ta signal).
            </p>
          </div>
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5">
            <h4 className="text-green-400 font-bold mb-4">🌡️ Interaktiv harorat simulyatsiyasi</h4>
            <div className="mb-4">
              <label className="block text-yellow-400 font-bold mb-2">
                Harorat: {temperature} K ({temperature - 273}°C)
              </label>
              <input
                type="range"
                min="220"
                max="370"
                step="5"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
                aria-label="Haroratni o'zgartirish"
              />
              <div className="flex justify-between text-xs text-purple-400 mt-1">
                <span>220 K (-53°C)</span>
                <span>298 K (25°C)</span>
                <span>370 K (97°C)</span>
              </div>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <div className="text-xs text-purple-400 mb-1">Fluksionallik holati:</div>
              <div className={`text-2xl font-bold ${fluxionalityStatus.color}`}>{fluxionalityStatus.status}</div>
              <div className="text-sm text-purple-300 mt-2">{fluxionalityStatus.signals}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Mexanizm</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Tavsif:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.structuralData.fluxionality.description}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Mexanizm:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.structuralData.fluxionality.mechanism}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Tezlik (298 K):</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.fluxionality.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Eₐ:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.fluxionality.activation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Koalesens T:</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.fluxionality.coalescenceTemp}</span>
                </div>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">VT-NMR da kuzatish</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Past T (&lt; 280 K):</span>
                  <span className="text-blue-400 text-xs">Sekin almashinish — 2 ta signal (trans va cis-P)</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">O&apos;rta T (280-330 K):</span>
                  <span className="text-yellow-400 text-xs">Koalesens — keng signal</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yuqori T (&gt; 330 K):</span>
                  <span className="text-red-400 text-xs">Tez almashinish — 1 ta o&apos;rtacha signal</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">YaMR effekti:</span>
                  <span className="text-green-400 text-xs">{COMPOUND.structuralData.fluxionality.nmrEffect}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* YaMR NAZARIYASI */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧲</span> YaMR nazariyasi — chuqur tahlil
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveNmrNucleus("p31")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "p31"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ³¹P (I=1/2, 100%)
            </button>
            <button
              onClick={() => setActiveNmrNucleus("rh103")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "rh103"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹⁰³Rh (I=1/2, 100%)
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
              onClick={() => setActiveNmrNucleus("c13")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeNmrNucleus === "c13"
                  ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              ¹³C (I=1/2, 1.1%)
            </button>
          </div>

          {activeNmrNucleus === "p31" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.p31.nucleus}</h3>
              <div className="bg-yellow-900/30 rounded-lg p-3 mb-4">
                <p className="text-yellow-300 text-xs">
                  <strong>⭐ Eng muhim yadro!</strong> ³¹P — eng yaxshi metall emas yadrolar.
                  100% tabiiy, I=1/2, yuqori γ. Sezgirlik ¹H dan ~15× past, lekin ¹³C dan 26× yaxshiroq.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.p31.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Multiplicity:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.p31.multiplicity}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.p31.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁ relaksatsiya:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.p31.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun ~48 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.p31.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">J bog&apos;lanish:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.p31.jCoupling}</p>
              </div>
            </div>
          )}

          {activeNmrNucleus === "rh103" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.rh103.nucleus}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-purple-400">Kimyoviy siljish:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.rh103.shift}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Sezgirlik:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.rh103.sensitivity}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">Chiziq kengligi:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.rh103.linewidth}</div>
                </div>
                <div>
                  <div className="text-xs text-purple-400">T₁:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.rh103.t1Relaxation}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun ~6700 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.rh103.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Aniqlash:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.rh103.detection}</p>
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
                  <div className="text-xs text-purple-400">Integration:</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.nmrTheory.h1.integration}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Nima uchun 7.2-7.8 ppm?</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.whyThisShift}</p>
              </div>
            </div>
          )}

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
                  <div className="text-lg font-mono font-bold text-cyan-400 text-xs">{COMPOUND.nmrTheory.c13.multiplicity}</div>
                </div>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">Izoh:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.c13.notes}</p>
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
                  <span className="text-purple-400">Rh-P (trans, Cl ga trans):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.rhP_trans}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Rh-P (cis, 2 ta):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.rhP_cis}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Rh-Cl:</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.rhCl}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">P-C (ipso):</span>
                  <span className="text-green-400 font-mono text-xs">{COMPOUND.structuralData.bondLengths.pc_phosphine}</span>
                </div>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog&apos; burchaklari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">P-Rh-P (cis):</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.pRhP_cis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">P-Rh-Cl (cis):</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.pRhCl_cis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">P-Rh-P (trans):</span>
                  <span className="text-green-400 font-mono">{COMPOUND.structuralData.bondAngles.pRhP_trans}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-2">Sterik ta&apos;sir</h4>
            <p className="text-green-300 text-sm mb-2">
              <strong>Taqqoslash:</strong> {COMPOUND.structuralData.bondLengths.comparison}
            </p>
            <p className="text-green-300 text-sm">
              <strong>Sterik:</strong> {COMPOUND.structuralData.bondLengths.sterics}
            </p>
          </div>
        </div>

        {/* KATALITIK MEXANIZM */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⚗️</span> Katalitik mexanizm — OLEFIN GIDROGENLASH
          </h2>
          <div className="bg-amber-900/30 rounded-lg p-4 mb-6">
            <p className="text-amber-300 text-sm">
              <strong>Wilkinson katalizatori</strong> — olefinlarni (C=C) gidrogenlash uchun ishlatiladi.
              <strong className="text-amber-400"> Nobel 1973</strong>. Dissotsiativ mexanizm — 16 elektronli kompleks (bo&apos;sh joy kerak).
            </p>
          </div>
          <div className="space-y-3">
            {Object.entries(COMPOUND.catalysis.mechanism).map(([key, step], i) => (
              <div key={key} className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-amber-500 text-white">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-amber-400 font-bold text-sm">{step}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">✓ Afzalliklar</h3>
              <ul className="space-y-2 text-sm text-purple-200">
                {COMPOUND.catalysis.advantages.map((adv, i) => (
                  <li key={i}>• {adv}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">✗ Cheklovlar</h3>
              <ul className="space-y-2 text-sm text-purple-200">
                {COMPOUND.catalysis.limitations.map((lim, i) => (
                  <li key={i}>• {lim}</li>
                ))}
              </ul>
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

        {/* INTERAKTIV ³¹P YaMR SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv ³¹P YaMR spektr — ¹J(Rh-P) = 180 Hz</h2>
          <p className="text-purple-200 leading-relaxed mb-6">
            Kimyoviy siljishni o&apos;zgartiring. ~48 ppm da dublet (¹J(Rh-P) = 180 Hz) — Rh-P bog&apos;ining klassik dalili.
          </p>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              Kimyoviy siljish (δ): {ppmSlider} ppm
            </label>
            <input
              type="range"
              min="0"
              max="80"
              step="1"
              value={ppmSlider}
              onChange={(e) => setPpmSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>0 ppm (H₃PO₄)</span>
              <span>38 ppm (dublet)</span>
              <span>48 ppm (markaziy)</span>
              <span>80 ppm</span>
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
                <div className="text-xl font-mono font-bold text-amber-400 text-sm">
                  {currentSignal.notes !== "—" ? currentSignal.notes : "Signal yo'q"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">¹J(Rh-P):</div>
                <div className="text-xl font-mono font-bold text-amber-400">180 Hz</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="31P YaMR spektr">
              <title>³¹P YaMR spektr simulyatsiyasi — Wilkinson katalizatori</title>
              {[0, 20, 40, 60, 80].map((ppm, i) => {
                const x = 580 - (ppm / 80) * 530
                return (
                  <g key={i}>
                    <line x1={x} y1="220" x2={x} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={x} y="235" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                  </g>
                )
              })}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish (ppm)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik</text>

              {/* H₃PO₄ referens */}
              <line x1="580" y1="220" x2="580" y2="190" stroke="#22c55e" strokeWidth="2" />
              <text x="580" y="185" textAnchor="middle" fontSize="7" fill="#22c55e">H₃PO₄</text>

              {/* ³¹P dublet (trans-P, J=180 Hz) */}
              <line x1={580 - (38 / 80) * 530} y1="220" x2={580 - (38 / 80) * 530} y2="100" stroke="#fbbf24" strokeWidth="2" />
              <line x1={580 - (48 / 80) * 530} y1="220" x2={580 - (48 / 80) * 530} y2="100" stroke="#fbbf24" strokeWidth="2" />
              <text x={580 - (43 / 80) * 530} y="95" textAnchor="middle" fontSize="8" fill="#fbbf24" fontWeight="bold">
                ³¹P trans-P (J=180 Hz)
              </text>

              {/* J annotatsiya */}
              <line x1={580 - (38 / 80) * 530} y1="120" x2={580 - (48 / 80) * 530} y2="120" stroke="#ef4444" strokeWidth="1" />
              <text x={580 - (43 / 80) * 530} y="115" textAnchor="middle" fontSize="7" fill="#ef4444" fontWeight="bold">
                J = 180 Hz
              </text>

              {/* Slider pozitsiyasi */}
              <line
                x1={580 - (ppmSlider / 80) * 530}
                y1="220"
                x2={580 - (ppmSlider / 80) * 530}
                y2="20"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
            </svg>
          </div>
          <div className="bg-amber-900/30 rounded-lg p-3">
            <p className="text-amber-300 text-xs">
              <strong>📌 Muhim:</strong> ³¹P YaMR da ~48 ppm da dublet (¹J(Rh-P) = 180 Hz). Bu Rh-P bog&apos;ining to&apos;g&apos;ridan-to&apos;g&apos;ri dalili.
              Past T da 2 ta signal (trans va cis-P), yuqori T da 1 ta o&apos;rtacha signal (fluksionallik).
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
              <h3 className="text-amber-400 font-bold mb-3">Wilkinson (1965)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.wilkinson.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.wilkinson.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Yutuq:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.wilkinson.achievement}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Nobel:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.wilkinson.nobel}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Osborn (1966)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.osborn.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.osborn.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.osborn.contribution}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Bennett (1971)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.bennett.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.bennett.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.bennett.contribution}</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-3">Pregosin (1980-yillar)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Olim:</span>
                  <span className="text-amber-400">{COMPOUND.history.pregosin.scientist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Yil:</span>
                  <span className="text-amber-400">{COMPOUND.history.pregosin.year}</span>
                </div>
                <div className="flex justify-between flex-col">
                  <span className="text-purple-400">Hissa:</span>
                  <span className="text-amber-400 text-xs">{COMPOUND.history.pregosin.contribution}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH */}
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span> Taqqoslash — boshqa Rh komplekslari
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-teal-400">Kompleks</th>
                  <th className="py-3 px-3 text-teal-400">Ligand</th>
                  <th className="py-3 px-3 text-teal-400">Geometriya</th>
                  <th className="py-3 px-3 text-teal-400">³¹P (ppm)</th>
                  <th className="py-3 px-3 text-teal-400">¹J(Rh-P) Hz</th>
                  <th className="py-3 px-3 text-teal-400">Qo&apos;llanish</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.comparison.map((comp, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/30 ${i === 0 ? "bg-amber-900/20" : ""}`}>
                    <td className="py-3 px-3 text-teal-400 font-mono text-xs">{comp.compound}</td>
                    <td className="py-3 px-3 text-xs">{comp.ligand}</td>
                    <td className="py-3 px-3 text-xs">{comp.geometry}</td>
                    <td className="py-3 px-3 text-xs font-mono text-amber-400">{comp.nmrP}</td>
                    <td className="py-3 px-3 text-xs font-mono">{comp.jRhP}</td>
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
            <li><strong className="text-amber-400">Kristall maydon nazariyasi:</strong> Rh⁺ (4d⁸), tekis kvadrat, diamagnit, 16 elektronli kompleks</li>
            <li><strong className="text-amber-400">Wilkinson (1965, Nobel 1973):</strong> Birinchi bir hil katalizatorlardan biri</li>
            <li><strong className="text-amber-400">³¹P YaMR:</strong> ~48 ppm (dublet, ¹J(Rh-P) = 180 Hz) — Rh-P bog&apos;ining klassik dalili</li>
            <li><strong className="text-amber-400">¹⁰³Rh YaMR:</strong> ~6700 ppm (juda past sezgirlik, bilvosita kuzatiladi)</li>
            <li><strong className="text-amber-400">Fluksionallik:</strong> PPh₃ ligandlari tez almashinadi (VT-NMR da kuzatiladi)</li>
            <li><strong className="text-amber-400">Katalitik mexanizm:</strong> Dissotsiatsiya → oksidlovchi qo&apos;shilish → migrator qo&apos;shilish → qaytaruvchi yo&apos;qotish</li>
            <li><strong className="text-amber-400">Gidrogenlash:</strong> Olefinlar (C=C) → alkanlar (C-C), mild sharoitlarda</li>
            <li><strong className="text-amber-400">Strukturaviy:</strong> Rh-P = 2.21-2.34 Å, Rh-Cl = 2.38 Å, P-Rh-P = 95-97°</li>
            <li><strong className="text-amber-400">Sterik:</strong> PPh₃ cone angle = 145° — 4 ta PPh₃ emas, 3 ta</li>
            <li><strong className="text-amber-400">Taqqoslash:</strong> [Rh(CO)(PPh₃)₂Cl] (Monsanto), [Rh(acac)(CO)₂] (hydroformilash)</li>
            <li><strong className="text-amber-400">Kengaytiruvchi:</strong> VT-NMR, ³¹P(¹⁰³Rh), XRD, katalitik test, DFT</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Birikmalar katalogi</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmalar/al-h2o-6" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">[Al(H₂O)₆]³⁺ →</Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Rh(PPh₃)₃Cl] (Wilkinson katalizatori) • YaMR spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Wilkinson (1965, Nobel 1973), Osborn (1966), Bennett (1971), Pregosin (1983), Cotton-Wilkinson, Miessler-Tarr</p>
        </div>
      </footer>
    </main>
  )
}