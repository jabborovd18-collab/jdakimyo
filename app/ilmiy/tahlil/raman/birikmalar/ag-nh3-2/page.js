"use client";

import Link from "next/link";
import { useState, useMemo, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// [Ag(NH₃)₂]⁺ — RAMAN SPEKTROSKOPIYA (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar:
//   • K. Nakamoto — Infrared and Raman Spectra of Inorganic and Coordination Compounds, 6th ed., Wiley (2009)
//   • G. Bergerhoff — Z. Anorg. Allg. Chem. 327, 139 (1964) — [Ag(NH₃)₂]⁺ kristall struktura
//   • R. Layton, D.W. Sink, J.R. Durig — J. Inorg. Nucl. Chem. 28, 1965 (1966) — Raman analiz
//   • J. Bjerrum — Metal Ammine Formation in Aqueous Solution (1941) — barqarorlik konstantalari
//   • B. Tollens — Ber. Dtsch. Chem. Ges. 15, 1635 (1882) — kashfiyot
//   • A. Werner — Z. Anorg. Chem. 3, 267 (1893) — koordinatsion nazariya
//   • D.A. Long — The Raman Effect, Wiley (2002)
//   • F. Basolo, R.G. Pearson — Mechanisms of Inorganic Reactions (1967) — d¹⁰ komplekslar
// Xususiyat: Raman nazariy jihatdan to'liq yoritilgan + PDF eksport
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Ag(NH<sub>3</sub>)<sub>2</sub>]<sup>+</sup>",
  formulaPlain: "[Ag(NH3)2]+",
  iupac: "Diamminkumush(I) kationi",
  commonName: "Tollens reaktivi (Tollens' reagent)",
  molarMass: 141.94,
  casNumber: "16972-24-8 (kation); 14039-49-1 (nitrat tuzi)",
  color: "rangsiz eritma (d¹⁰ tufayli)",
  structure: "Chiziqli (D∞h simmetriya) — N–Ag–N burchagi 180°",
  metalLigand: "Ag–N (koordinatsion σ-bog')",
  spaceGroup: "P2₁/c (AgNO₃·2NH₃ kristal, monoklinik)",
  crystalSystem: "Monoklinik (kristall tuz sifatida)",
  pointGroup: "D∞h (chiziqli, ideal)",
  bondLengthAgN: "2.11 Å (o'rtacha, XRD)",
  bondLengthNH: "1.024 Å",
  bondAngleNAgN: "180° (chiziqli)",
  bondAngleAgNH: "109.5° (sp³ N)",
  electronCount: "14 e⁻ (10 + 2·2 = 14) — 18 e⁻ dan kam!",
  meltingPoint: "AgNO₃·2NH₃: parchalanadi ~90 °C",
  stability: "log β₂ = 7.05 (Ag⁺ + 2NH₃ ⇌ [Ag(NH₃)₂]⁺)",
  magnetism: "Diamagnit (d¹⁰, S = 0)",
  discovery:
    "1882 — Bernhard Tollens (kumush ko'zgusi reaksiyasi); 1893 — Werner koordinatsion nazariya",
  toxicity:
    "Portlash xavfi! Uzoq turgan Tollens reaktivi Ag₃N (kumush azid) hosil qiladi",
};

// ═══════════════════════════════════════════════════════════════════════════════
// RAMAN CHO'QQILARI (D∞h chiziqli simmetriya)
// Γᵥⁱᵇ (skelet) = Σg⁺ (Raman) + Σᵤ⁺ (IQ) + Πᵤ (IQ)
// Mutual exclusion: gerade (g) → Raman; ungerade (u) → IQ
// ═══════════════════════════════════════════════════════════════════════════════
const ramanPeaks = [
  {
    freq: 3320,
    absorbance: 0.55,
    intensityCode: 3,
    assignment: "νₐₛ(N–H)",
    assignment_uz: "NH₃ ligandidagi asimmetrik N–H cho'zilish",
    intensity: "Kuchli",
    bond: "N–H",
    symmetry: "E (Raman va IQ ikkalasida) — lokal C₃v NH₃",
    forceConstant: "6.32 mdyn/Å",
    bondLength: "1.024 Å",
    region: "X–H cho'zilish sohasi (3400–3200 sm⁻¹)",
    freeLigand: "Erkin NH₃ (gaz): νₐₛ ≈ 3444 sm⁻¹",
    coordShift: "Koordinatsiya tufayli −124 sm⁻¹ pastga siljigan",
    theoryNote:
      "NH₃ ligandining asimmetrik N–H cho'zilish tebranishi. Ag–N koordinatsiyasida N atomining elektron jufti Ag ga uzatiladi — N–H bog'i biroz zaiflashadi va chastota pasayadi. Lokal C₃v simmetriyada NH₃ ning E turdagi modasi. Ammin komplekslarning universal diagnostik polosasi. Raman intensivligi IQ ga qaraganda pastroq (N–H dipol modulyatsiyasi qutblanuvchanlikdan kuchliroq).",
    diagnostic:
      "Ammin koordinatsiyasining Raman ko'rsatkichi (IQ da yanada aniqroq)",
    animation: "nh-asym",
  },
  {
    freq: 3220,
    absorbance: 0.72,
    intensityCode: 3,
    assignment: "νₛ(N–H)",
    assignment_uz: "NH₃ ligandidagi simmetrik N–H cho'zilish",
    intensity: "Kuchli",
    bond: "N–H",
    symmetry: "A₁ (lokal C₃v) → Raman faol",
    forceConstant: "6.20 mdyn/Å",
    bondLength: "1.024 Å",
    region: "X–H cho'zilish sohasi",
    freeLigand: "Erkin NH₃: νₛ ≈ 3337 sm⁻¹",
    coordShift: "Koordinatsiya tufayli −117 sm⁻¹ pastga siljigan",
    theoryNote:
      "🔥 [Ag(NH₃)₂]⁺ NING RAMANDA XARAKTERLI KUCHLI CHO'QQISI. NH₃ ning simmetrik N–H cho'zilishi — barcha 3 ta H atomi bir vaqtda cho'ziladi/qisqaradi. A₁ turdagi lokal moda qutblanuvchanlikni katta modulyatsiya qiladi, shuning uchun Raman intensivligi yuqori (νₐₛ dan kuchliroq — bu Ramanning IQ dan farqi!). Bu polosa ammin komplekslarning eng aniq Raman diagnostik ko'rsatkichi.",
    diagnostic: "🌟 [Ag(NH₃)₂]⁺ ning RAMANDA eng kuchli N–H polosasi",
    animation: "nh-sym",
  },
  {
    freq: 1622,
    absorbance: 0.28,
    intensityCode: 2,
    assignment: "δₐₛ(HNH)",
    assignment_uz: "H–N–H asimmetrik deformatsion (egilish)",
    intensity: "O'rtacha",
    bond: "H–N–H",
    symmetry: "E (lokal C₃v) — Raman va IQ",
    forceConstant: "0.62 mdyn·Å/rad²",
    bondLength: "—",
    region: "Egilish tebranishlar sohasi",
    freeLigand: "Erkin NH₃: δₐₛ ≈ 1627 sm⁻¹",
    coordShift:
      "Deyarli o'zgarmagan (−5 sm⁻¹) — H atomlariga koordinatsiya ta'siri kam",
    theoryNote:
      "NH₃ ning H–N–H burchak deformatsiyasi (asimmetrik). Bu tebranish N atomining sp³ gibridlangan geometriyasini saqlaydi. Ag ga koordinatsiya asosan N ning elektron zichligiga ta'sir qiladi, H atomlari harakatiga esa kam. Shuning uchun δ(HNH) chastotasi erkin NH₃ ga juda yaqin.",
    diagnostic: "NH₃ ligandining saqlanganligini tasdiqlaydi (parchalanmagan)",
    animation: "hnh-asym-bend",
  },
  {
    freq: 1258,
    absorbance: 0.85,
    intensityCode: 4,
    assignment: "δₛ(NH₃) umbrella",
    assignment_uz: "NH₃ ning umbrella (soyabon) simmetrik deformatsiyasi",
    intensity: "Juda kuchli",
    bond: "NH₃ (butun)",
    symmetry: "A₁ (lokal C₃v) → juda kuchli Raman",
    forceConstant: "0.58 mdyn·Å/rad²",
    bondLength: "—",
    region: "Egilish sohasi — KOORDINATSIYA DIAGNOSTIKASI",
    freeLigand: "Erkin NH₃: δₛ (umbrella) ≈ 950 sm⁻¹",
    coordShift:
      "🔥 +308 sm⁻¹ YUQORIGA siljigan (koordinatsiyaning eng aniq belgisi)",
    theoryNote:
      "🌟 [Ag(NH₃)₂]⁺ NING ENG KUCHLI DIAGNOSTIK RAMAN CHO'QQISI. Erkin NH₃ da ν(umbrella) = 950 sm⁻¹ (yumshoq inversion coordinate), ammo koordinatsiyada N atomi Ag ga bog'langanligi uchun inversiya to'xtatiladi va potensial chuqurroq bo'ladi. Shu sababli chastota keskin oshadi (+300 sm⁻¹ dan ortiq!). A₁ turdagi moda barcha 3 ta H bir vaqtda pastga/yuqoriga siljiydi — qutblanuvchanlikni juda kuchli modulyatsiya qiladi. Bu Nakamoto tomonidan tavsiflangan ammin koordinatsiyasining universal Raman signali.",
    diagnostic:
      "🌟 AMMIN KOORDINATSIYASINING ENG KUCHLI DIAGNOSTIK RAMAN CHO'QQISI",
    animation: "umbrella",
  },
  {
    freq: 745,
    absorbance: 0.25,
    intensityCode: 2,
    assignment: "ρᵣ(NH₃) rocking",
    assignment_uz: "NH₃ ligandining rocking (chayqalish) tebranishi",
    intensity: "O'rtacha",
    bond: "NH₃–Ag",
    symmetry: "E (lokal), Πᵤ (butun kompleks) → IQ, silent Raman rasman",
    forceConstant: "0.32 mdyn·Å/rad²",
    bondLength: "—",
    region: "Skelet deformatsiya sohasi",
    freeLigand: "—  (faqat koordinatsiyada mavjud)",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "NH₃ ligandining Ag–N bog'i atrofida chayqalishi (rocking). Bu erkin NH₃ da mavjud emas — faqat koordinatsiyada paydo bo'ladi. Bu moda ammin komplekslarning universal ko'rsatkichi: agar bo'lsa — koordinatsiya bor. Kristall panjara ta'siri Ramanda ham zaif ko'rinishi mumkin (site symmetry lowering).",
    diagnostic: "Koordinatsion NH₃ ning mavjudligini tasdiqlaydi",
    animation: "nh3-rock",
  },
  {
    freq: 495,
    absorbance: 0.35,
    intensityCode: 2,
    assignment: "νₐₛ(N–Ag–N)",
    assignment_uz: "Chiziqli N–Ag–N skeletning asimmetrik cho'zilishi",
    intensity: "O'rtacha (Raman); IQ da kuchli",
    bond: "Ag–N (asimm.)",
    symmetry: "Σᵤ⁺ (D∞h) → faqat IQ faol, RAMAN NOAKTIV",
    forceConstant: "1.42 mdyn/Å",
    bondLength: "2.11 Å",
    region: "Metall–ligand cho'zilish sohasi",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "N–Ag–N skeletning asimmetrik cho'zilishi: bir Ag–N cho'ziladi, ikkinchisi qisqaradi. D∞h da Σᵤ⁺ ga tegishli — MUTUAL EXCLUSION bo'yicha faqat IQ faol, Raman da rasman noaktiv. Ammo eritmada simmetriya buzilishi (solvatatsiya, ion juftlashuvi) tufayli zaif Raman polosa sifatida ko'rinishi mumkin. IQ da 470-500 sm⁻¹ da kuchli.",
    diagnostic: "Chiziqli D∞h simmetriya isboti (Raman da yo'q → IQ da bor)",
    animation: "ag-n-asym",
  },
  {
    freq: 375,
    absorbance: 0.92,
    intensityCode: 4,
    assignment: "νₛ(N–Ag–N)",
    assignment_uz: "Chiziqli N–Ag–N skeletning simmetrik cho'zilishi",
    intensity: "Juda kuchli",
    bond: "Ag–N (simm.)",
    symmetry: "Σg⁺ (D∞h) → faqat RAMAN faol, IQ NOAKTIV",
    forceConstant: "1.48 mdyn/Å",
    bondLength: "2.11 Å",
    region: "Metall–ligand cho'zilish sohasi — SKELET DIAGNOSTIKA",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "🌟 [Ag(NH₃)₂]⁺ NING ENG XARAKTERLI SKELET RAMAN CHO'QQISI. Ikkala Ag–N bog'i bir vaqtda simmetrik ravishda cho'ziladi. D∞h simmetriyada Σg⁺ ga tegishli — inversiya markazi (Ag) orqali gerade → RAMANDA JUDA KUCHLI, IQ DA BUTUNLAY NOAKTIV. Bu ν(Ag–N) simmetrik cho'qqi mutual exclusion qoidasining aniq namoyishi va chiziqli D∞h geometriyaning bevosita tasdig'i. k = 1.48 mdyn/Å — Ag–N bog'ining nisbatan yumshoqligini ko'rsatadi (Co–N: 1.85; Fe–C(CN): 2.10). Bu esa d¹⁰ Ag(I) ning ligand-labilligi va tez almashinuvini tushuntiradi.",
    diagnostic: "🌟 CHIZIQLI D∞h VA MUTUAL EXCLUSION PRINSIPINING RAMAN ISBOTI",
    animation: "ag-n-sym",
  },
  {
    freq: 215,
    absorbance: 0.28,
    intensityCode: 2,
    assignment: "δ(N–Ag–N) bend",
    assignment_uz: "N–Ag–N burchak deformatsiyasi (chiziqlikdan chetlanish)",
    intensity: "O'rta-zaif",
    bond: "N–Ag–N burchak",
    symmetry: "Πᵤ (D∞h) → IQ, silent Raman rasman",
    forceConstant: "0.14 mdyn·Å/rad²",
    bondLength: "—",
    region: "Uzoq Raman sohasi (< 300 sm⁻¹)",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "Chiziqli N–Ag–N skeletining 180° dan chetlanish tebranishi. D∞h da Πᵤ ga tegishli — rasman IQ da faol, Ramanda noaktiv. Ammo eritmada tashqi ta'sirlar (H₂O molekulalari, qarshi ion) simmetriyani C₂v ga tushirishi mumkin va o'shanda zaif Raman polosa paydo bo'ladi. k = 0.14 juda past — burchak juda 'yumshoq', bu esa Ag(I) ning fleksibilligini tasdiqlaydi.",
    diagnostic: "Chiziqlilikdan chetlanish darajasini xarakterlaydi",
    animation: "ag-n-bend",
  },
  {
    freq: 125,
    absorbance: 0.15,
    intensityCode: 1,
    assignment: "Ag···OH₂ / lattice",
    assignment_uz: "Ag ↔ H₂O molekulyar / kristall panjara tebranishlari",
    intensity: "Zaif",
    bond: "Ag···solvent",
    symmetry: "Turli (kristall siteda past)",
    forceConstant: "~0.05 mdyn/Å",
    bondLength: "~2.4 Å (zaif)",
    region: "Uzoq Raman (< 200 sm⁻¹)",
    freeLigand: "—",
    coordShift: "Faqat kompleks holida",
    theoryNote:
      "Suvli eritmada [Ag(NH₃)₂(OH₂)ₙ]⁺ komplekslari uchun Ag va aksial H₂O molekulalari o'rtasidagi zaif elektrostatik ta'sir tebranishlari. Kristall tuzda esa panjara modalari (lattice phonons). Chastota juda past — faqat maxsus notch filtri va triple monoxromator bilan qayd etiladi. Kriostatda (77 K) aniqroq ajraladi.",
    diagnostic: "Ag(I) ning fleksibil koordinatsion sferasini xarakterlaydi",
    animation: "lattice",
  },
];

// To'liq Raman spektri nuqtalari (Lorentzian shakl uchun)
const ramanSpectrum = [
  { freq: 3500, intensity: 0.03 },
  { freq: 3400, intensity: 0.15 },
  { freq: 3320, intensity: 0.55 },
  { freq: 3280, intensity: 0.62 },
  { freq: 3220, intensity: 0.72 },
  { freq: 3150, intensity: 0.25 },
  { freq: 3000, intensity: 0.05 },
  { freq: 2500, intensity: 0.02 },
  { freq: 2000, intensity: 0.02 },
  { freq: 1800, intensity: 0.03 },
  { freq: 1700, intensity: 0.1 },
  { freq: 1622, intensity: 0.28 },
  { freq: 1550, intensity: 0.1 },
  { freq: 1400, intensity: 0.08 },
  { freq: 1350, intensity: 0.35 },
  { freq: 1258, intensity: 0.85 },
  { freq: 1180, intensity: 0.2 },
  { freq: 1000, intensity: 0.05 },
  { freq: 900, intensity: 0.08 },
  { freq: 800, intensity: 0.15 },
  { freq: 745, intensity: 0.25 },
  { freq: 680, intensity: 0.08 },
  { freq: 550, intensity: 0.15 },
  { freq: 495, intensity: 0.35 },
  { freq: 450, intensity: 0.2 },
  { freq: 400, intensity: 0.45 },
  { freq: 375, intensity: 0.92 },
  { freq: 340, intensity: 0.3 },
  { freq: 280, intensity: 0.12 },
  { freq: 250, intensity: 0.2 },
  { freq: 215, intensity: 0.28 },
  { freq: 180, intensity: 0.12 },
  { freq: 125, intensity: 0.15 },
  { freq: 80, intensity: 0.05 },
];

// Kumush(I) ammin komplekslari qatori — Bjerrum (1941) muvozanatlariga asoslangan
const bjerrumSeries = [
  {
    formula: "[Ag(H₂O)ₙ]⁺",
    trad: "Suvli Ag⁺",
    geom: "Tetraedrik (n≈4)",
    logK: "—",
    nuAgN: null,
    nuAgO: 250,
    dominant: "Yo'q NH₃",
    current: false,
  },
  {
    formula: "[Ag(NH₃)(H₂O)ₙ]⁺",
    trad: "Mono-ammin",
    geom: "Chiziqli 2-koord.",
    logK: "3.31 (K₁)",
    nuAgN: 355,
    nuAgO: null,
    dominant: "Past NH₃ da",
    current: false,
  },
  {
    formula: "[Ag(NH₃)₂]⁺",
    trad: "🌟 Di-ammin (Tollens)",
    geom: "Chiziqli D∞h",
    logK: "3.74 (K₂)  ↦ log β₂ = 7.05",
    nuAgN: 375,
    nuAgO: null,
    dominant: "Standart NH₃ da",
    current: true,
  },
  {
    formula: "[Ag(NH₃)₃]⁺",
    trad: "Tri-ammin",
    geom: "Trigonal (kam barqaror)",
    logK: "≈ −0.3 (K₃, zaif)",
    nuAgN: 340,
    nuAgO: null,
    dominant: "Juda konsentrlangan NH₃",
    current: false,
  },
  {
    formula: "[Ag(NH₃)₄]⁺",
    trad: "Tetra-ammin",
    geom: "Tetraedrik (juda kam)",
    logK: "≈ −0.8 (K₄)",
    nuAgN: 320,
    nuAgO: null,
    dominant: "Faqat suyultirilgan NH₄OH da eng past",
    current: false,
  },
];

// d¹⁰ chiziqli komplekslar taqqoslashi (Cu⁺, Ag⁺, Au⁺)
const d10Series = [
  {
    formula: "[Cu(NH₃)₂]⁺",
    metal: "Cu⁺",
    dConfig: "d¹⁰ (3d¹⁰)",
    nuMLSym: 405,
    nuMLAsym: 435,
    bondL: 1.94,
    stability: "Barqaror, disproportsion Cu²⁺+Cu⁰",
    current: false,
  },
  {
    formula: "[Ag(NH₃)₂]⁺",
    metal: "Ag⁺",
    dConfig: "d¹⁰ (4d¹⁰)",
    nuMLSym: 375,
    nuMLAsym: 495,
    bondL: 2.11,
    stability: "🌟 Tollens reaktivi, barqaror",
    current: true,
  },
  {
    formula: "[Au(NH₃)₂]⁺",
    metal: "Au⁺",
    dConfig: "d¹⁰ (5d¹⁰)",
    nuMLSym: 430,
    nuMLAsym: 550,
    bondL: 2.02,
    stability: "Mustahkam (relativistik effekt)",
    current: false,
  },
  {
    formula: "[Hg(NH₃)₂]²⁺",
    metal: "Hg²⁺",
    dConfig: "d¹⁰ (5d¹⁰)",
    nuMLSym: 415,
    nuMLAsym: 550,
    bondL: 2.03,
    stability: "Zaharli, faqat past NH₃ da",
    current: false,
  },
];

// Namuna tayyorlash usullari (Raman uchun)
const techniques = [
  {
    name: "Suvli eritma (Tollens tayyorlash)",
    description:
      "0.1 M AgNO₃ ga qadar 6% NH₄OH tomchilab qo'shiladi, boshlang'ich Ag₂O cho'kmasi paydo bo'lib qayta erimasagacha. So'ngra ortiqcha NH₄OH qo'shilib to'liq [Ag(NH₃)₂]⁺ hosil qilinadi. 4 mm kvarts kyuvetada Raman o'lchash.",
    advantages: [
      "Bevosita Tollens reaktivini o'rganish imkoni",
      "Nozik chiziqlar (~2-4 sm⁻¹ yarim kenglik)",
      "Solvatatsiya effektlarini kuzatish",
      "Kontsentratsiyaga bog'liq muvozanatlarni tekshirish",
      "In-situ turlar taqsimoti",
    ],
    disadvantages: [
      "Suv Raman polosalari (ν(O–H) 3400, δ(H–O–H) 1640)",
      "Portlash xavfi (Ag₃N kumush azid)",
      "24 soatdan ko'p saqlash mumkin emas",
      "N–H sohasi suv bilan qoplanishi mumkin",
    ],
    bestFor: "Muvozanat tahlili, solvatatsiya, standart Tollens Raman",
    freqRange: "150–3600 sm⁻¹",
    resolution: "2 sm⁻¹",
    samplePrep: "5–10 daq",
  },
  {
    name: "Kristall AgNO₃·2NH₃ (qattiq)",
    description:
      "AgNO₃ ni sovutilgan NH₃(l) da eritib, kristallashtirish orqali AgNO₃·2NH₃ tuzi olinadi. Raman mikroskopi ostida bevosita o'lchash. 785 nm yoki 1064 nm NIR lazer.",
    advantages: [
      "Suv polosalari yo'q",
      "Aniq chiziqlar (kristall panjara)",
      "Namuna butunligicha saqlanadi",
      "Uzoq Raman zonasi ochiq (panjara modalari)",
      "Yuqori signal-shovqin nisbati",
    ],
    disadvantages: [
      "Kristallashtirish murakkab (past harorat, quruq)",
      "Kristall panjara chastotalarni ±5 sm⁻¹ siljitadi",
      "Yorug'lik va namga sezgir",
      "NO₃⁻ polosalari (1050, 720 sm⁻¹) qoplanishi",
    ],
    bestFor: "Aniq skelet tebranishlari, uzoq chastotalar, D∞h isbotlash",
    freqRange: "50–4000 sm⁻¹",
    resolution: "1–2 sm⁻¹",
    samplePrep: "1–2 kun (kristallashtirish)",
  },
  {
    name: "SERS (kumush o'zining nanozarralari)",
    description:
      "Ag nanozarralar (Lee-Meisel usuli) sirtida [Ag(NH₃)₂]⁺ adsorbsiyalanadi. Ag markaz o'zi plazmonik kuchayish beradi — 10⁶–10⁸ marta intensivlik. UNIKAL SERS holati.",
    advantages: [
      "Ultra-yuqori sezgirlik (10⁻⁹ M gacha)",
      "Ag substratdan o'z-o'zidan aloqa",
      "Fluoresensiya bostiriladi",
      "Bitta molekula darajasidagi ruxsat",
      "Zamonaviy biosensorlar uchun",
    ],
    disadvantages: [
      "Ag nanozarralar sirtida Ag redoks bo'lishi mumkin",
      "Chastotalar sirt ta'sirida 5–15 sm⁻¹ siljiydi",
      "Reproducibility past (10–30% xato)",
      "Adsorbsiya orientatsiyasi kritik",
    ],
    bestFor:
      "Ultra-past kontsentratsiyalar, sensor ilovalari, plazmonik tahlil",
    freqRange: "200–3200 sm⁻¹",
    resolution: "3–5 sm⁻¹",
    samplePrep: "20–30 daq",
  },
  {
    name: "Past haroratli (77 K, kriostat)",
    description:
      "AgNO₃·2NH₃ kristali kriostatga qo'yilib suyuq azot bilan 77 K gacha sovutiladi. Yumshoq modalar (< 300 sm⁻¹) aniqlashadi.",
    advantages: [
      "Uzoq Raman polosalari nozik ajraladi",
      "Kristall panjara modalari aniq",
      "Termik kengayish yo'q (chiziq yarim kengligi < 1 sm⁻¹)",
      "Anti-Stokes minimallashadi",
      "N–Ag–N ning fleksibilligi kuzatilmaydi",
    ],
    disadvantages: [
      "Maxsus kriostat kerak (10 000+ USD)",
      "N₂(l) muntazam to'ldirish",
      "Namuna qismini fokuslash qiyin",
      "Sekin (soatlar)",
    ],
    bestFor:
      "Fundamental tebranish analizi, silent modalarni ochish, panjara dinamikasi",
    freqRange: "20–4000 sm⁻¹",
    resolution: "0.5–1 sm⁻¹",
    samplePrep: "1–2 soat",
  },
];

// Halaqit beruvchi omillar (Raman uchun)
const interferences = [
  {
    source: "Suvning Raman polosalari",
    freqRange: "3400 (ν(OH)), 1640 (δ(HOH))",
    effect:
      "Kuchli suv polosalari [Ag(NH₃)₂]⁺ ning N–H sohasini (3220-3320) qisman qoplaydi",
    severity: "Yuqori",
    solution:
      "D₂O (og'ir suv) da eritmani tayyorlash — ν(OD) 2500 sm⁻¹ ga siljiydi va N–H sohasi to'liq ochiladi. Yoki gomiletrik protsedura: sof suv Raman spektrini alohida yozib olib, ayirish (subtraction).",
  },
  {
    source: "NO₃⁻ qarshi ionining Raman",
    freqRange: "1050 (ν₁ NO₃⁻), 720, 1400",
    effect:
      "AgNO₃ dan kelgan NO₃⁻ ning A₁ simmetrik cho'zilishi (1050 sm⁻¹) — juda kuchli va sof polosaga o'xshaydi",
    severity: "O'rta",
    solution:
      "Perxlorat (ClO₄⁻: 935) yoki gogen erituvchi anion (BF₄⁻: 762) ga o'tish. Yoki NO₃⁻ ni oldindan aniqlab, spektrdan chiqarish.",
  },
  {
    source: "Ag₃N (kumush azid) hosil bo'lishi",
    freqRange: "1300–1400 (N–N–N)",
    effect:
      "Uzoq turgan Tollens reaktivida (>24 soat) Ag₃N yotqiziq hosil bo'ladi — bu portlash xavfli va Raman spektriga notanish polosalar qo'shadi",
    severity: "Yuqori (xavfli!)",
    solution:
      "Har o'lchashdan oldin yangi Tollens reaktivini tayyorlash. Ishlatgandan keyin darhol suyultirib zararsizlantirish (razb. HCl). Uzoq saqlamaslik.",
  },
  {
    source: "Fluoresensiya (organik aralashma)",
    freqRange: "Butun spektr, keng fon",
    effect:
      "Reagentlardagi organik aralashmalar 532/633 nm lazerlarda fluoresensiya beradi",
    severity: "O'rta",
    solution:
      "1064 nm NIR lazer (FT-Raman). Sof qayta kristallantirilgan AgNO₃ ishlatish. Fotoblanching (1-2 daqiqa lazer).",
  },
  {
    source: "Ag⁰ (metall kumush) sochilishi",
    freqRange: "Butun spektr, kuchli fon",
    effect:
      "Uzoq lazer ta'sirida yoki qaytaruvchi mavjudligida [Ag(NH₃)₂]⁺ → Ag⁰ (metall kumush cho'kmasi) — ko'zgu sifatida ishlaydi va Raman spektrini buzadi",
    severity: "O'rta",
    solution:
      "Lazer quvvatini 5-15 mW ga tushirish. N₂ atmosferada o'lchash. Qaytaruvchi (aldegidlar, glyukoza) mavjudligini istisno qilish. Aylanuvchi namuna stolchasi.",
  },
  {
    source: "pH o'zgarishi va NH₃ bug'lanishi",
    freqRange: "Barcha koordinatsiya polosalari",
    effect:
      "NH₃ atmosferaga bug'lanishi bilan muvozanat [Ag(NH₃)₂]⁺ ↔ [Ag(NH₃)]⁺ + NH₃ siljiydi va chastotalar o'zgaradi",
    severity: "O'rta",
    solution:
      "Yopiq kyuvetada o'lchash. NH₃ ortiqchasi (>0.5 M NH₄OH). Harorat 20–25 °C da barqaror ushlab turish. pH>10.",
  },
  {
    source: "Kumush ko'zgusi (mirror effect)",
    freqRange: "Butun spektr",
    effect:
      "Kyuveta devorida Ag⁰ metall kumush ko'zgusi hosil bo'lib, lazer nurini qaytaradi va detektorni to'yintirib qo'yadi",
    severity: "Past–O'rta",
    solution:
      "Yangi tozalanuvchi kvarts kyuveta. Har o'lchashdan keyin HNO₃ bilan tozalash. Uzoq lazer ta'sirini cheklash (< 5 daqiqa).",
  },
  {
    source: "Reley sochilishi (elastik)",
    freqRange: "< 150 sm⁻¹",
    effect:
      "Elastik sochilish 100 sm⁻¹ dan pastdagi Ag···OH₂ va panjara modalarini bekitib qo'yadi",
    severity: "O'rta",
    solution:
      "Volume Bragg Grating (VBG) yoki triple monoxromator. 5-10 sm⁻¹ gacha yaqinlashish. Uzoq Raman spektrometri.",
  },
];

// Guruh nazariyasi ma'lumotlari
const groupTheoryData = {
  pointGroup: "D∞h (chiziqli, ideal — Ag markazida inversiya)",
  alternativeGroup: "C₂v (eritmada suv bog'lanishi tufayli buzilgan)",
  order: "∞ (cheksiz — chiziqli guruh)",
  operations: "E, 2C∞φ, ∞σᵥ, i, 2S∞φ, ∞C₂",
  totalModes: "3N − 5 = 3(9) − 5 = 22 ta normal moda (chiziqli molekula)",
  reducibleRep: "Γᵥⁱᵇ(skelet) = Σg⁺ + Σᵤ⁺ + Πᵤ + (NH₃ ichki modalari)",
  ramanActive: "Σg⁺ (νₛ(Ag–N) = 375 sm⁻¹) — asosiy skelet",
  irActive: "Σᵤ⁺ (νₐₛ(Ag–N) = 495), Πᵤ (δ(N–Ag–N) = 215)",
  silent: "Ag–N bo'yicha barcha g-modalar IQ da, u-modalar Raman da noaktiv",
  mutualExclusion:
    "🔥 QAT'IY MUTUAL EXCLUSION: D∞h da inversiya markazi (Ag ustida) → hech bir skelet moda bir vaqtda IQ va Raman faol emas",
  keyModes:
    "νₛ(Ag–N) = 375 (Σg⁺, faqat Raman); νₐₛ(Ag–N) = 495 (Σᵤ⁺, faqat IQ); δ(NH₃)ᵤ = 1258 (A₁ lokal, kuchli Raman)",
};

// Kuch konstantasi taqqoslashi
const forceConstantExamples = [
  {
    bond: "N–H (erkin NH₃)",
    k: 6.3,
    freq: 3444,
    note: "Erkin ammiak, taqqoslash uchun",
  },
  {
    bond: "N–H ([Ag(NH₃)₂]⁺)",
    k: 6.2,
    freq: 3220,
    note: "🌟 Bu kompleksda, koordinatsiya tufayli zaifroq",
  },
  {
    bond: "N–H ([Co(NH₃)₆]³⁺)",
    k: 6.35,
    freq: 3320,
    note: "Co(III) kuchliroq π-akseptor",
  },
  {
    bond: "Ag–N ([Ag(NH₃)₂]⁺)",
    k: 1.48,
    freq: 375,
    note: "🌟 Chiziqli d¹⁰, yumshoq bog'",
  },
  {
    bond: "Cu–N ([Cu(NH₃)₂]⁺)",
    k: 1.7,
    freq: 405,
    note: "3d¹⁰, kichikroq radius, mustahkamroq",
  },
  {
    bond: "Au–N ([Au(NH₃)₂]⁺)",
    k: 1.95,
    freq: 430,
    note: "5d¹⁰, relativistik kontraksiya",
  },
  {
    bond: "Co–N ([Co(NH₃)₆]³⁺)",
    k: 1.85,
    freq: 503,
    note: "d⁶ LS, oktaedrik, kuchli",
  },
  {
    bond: "Fe–C ([Fe(CN)₆]³⁻)",
    k: 2.1,
    freq: 390,
    note: "Sianido, π-akseptor",
  },
  {
    bond: "Ni–C ([Ni(CN)₄]²⁻)",
    k: 2.85,
    freq: 420,
    note: "Kvadrat-planar, eng kuchli",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AgNH3Raman() {
  const [activePeak, setActivePeak] = useState(6); // 375 sm⁻¹ (νₛ(Ag–N)) default — diagnostik
  const [freqSlider, setFreqSlider] = useState(375);
  const [activeTechnique, setActiveTechnique] = useState(0);
  const [activeInterference, setActiveInterference] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfSections, setPdfSections] = useState({
    identification: true,
    theory: true,
    peaks: true,
    spectrum: true,
    groupTheory: true,
    forceConstant: true,
    d10series: true,
    bjerrum: true,
    techniques: true,
    interferences: true,
    conclusions: true,
  });

  // Slayderga eng yaqin cho'qqi
  const currentPeak = useMemo(() => {
    return ramanPeaks.reduce((closest, peak) => {
      return Math.abs(peak.freq - freqSlider) <
        Math.abs(closest.freq - freqSlider)
        ? peak
        : closest;
    }, ramanPeaks[0]);
  }, [freqSlider]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 📄 PDF EKSPORT — FAQAT RAMAN TAHLILI UCHUN
  // ═══════════════════════════════════════════════════════════════════════════
  const cleanText = (str) => {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
  };

  const generatePDF = async () => {
    setPdfGenerating(true);
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const fontkit = (await import("@pdf-lib/fontkit")).default;

      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);

      let regularFont, boldFont, italicFont;
      try {
        const regularBytes = await fetch("/fonts/DejaVuSans.ttf").then((r) => {
          if (!r.ok) throw new Error("Regular font");
          return r.arrayBuffer();
        });
        const boldBytes = await fetch("/fonts/DejaVuSans-Bold.ttf").then(
          (r) => {
            if (!r.ok) throw new Error("Bold font");
            return r.arrayBuffer();
          },
        );
        const italicBytes = await fetch("/fonts/DejaVuSans-Oblique.ttf").then(
          (r) => {
            if (!r.ok) throw new Error("Italic font");
            return r.arrayBuffer();
          },
        );
        regularFont = await pdfDoc.embedFont(regularBytes, { subset: true });
        boldFont = await pdfDoc.embedFont(boldBytes, { subset: true });
        italicFont = await pdfDoc.embedFont(italicBytes, { subset: true });
      } catch (fontErr) {
        alert(
          "Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.",
        );
        setPdfGenerating(false);
        return;
      }

      const C = {
        purple: rgb(0.3, 0.11, 0.58),
        purpleLight: rgb(0.86, 0.78, 1.0),
        purpleMid: rgb(0.65, 0.55, 0.98),
        purpleSoft: rgb(0.51, 0.39, 0.71),
        purpleDark: rgb(0.12, 0.11, 0.29),
        sky: rgb(0.05, 0.55, 0.85),
        skyDeep: rgb(0.02, 0.42, 0.7),
        skySoft: rgb(0.1, 0.4, 0.65),
        silver: rgb(0.75, 0.75, 0.8),
        silverDeep: rgb(0.55, 0.55, 0.62),
        textDark: rgb(0.08, 0.08, 0.16),
        textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0),
        orangeDeep: rgb(0.71, 0.39, 0),
        green: rgb(0.08, 0.47, 0.31),
        greenDark: rgb(0.12, 0.47, 0.27),
        blue: rgb(0.08, 0.31, 0.55),
        brown: rgb(0.71, 0.39, 0.12),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0),
        bgSky: rgb(0.92, 0.97, 1.0),
        bgSilver: rgb(0.96, 0.96, 0.98),
        bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0),
        bgGreen: rgb(0.94, 1.0, 0.98),
        bgRed: rgb(1.0, 0.95, 0.95),
        bgAbstract: rgb(0.96, 0.94, 1.0),
        white: rgb(1, 1, 1),
        red: rgb(0.8, 0.2, 0.2),
      };

      const PAGE_W = 595.28,
        PAGE_H = 841.89,
        MARGIN = 50;
      const CONTENT_W = PAGE_W - 2 * MARGIN;
      const FOOTER_Y = 30,
        HEADER_H = 65;

      let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
      let y = PAGE_H - MARGIN;
      let pageNum = 1;

      const measure = (text, font, size) =>
        font.widthOfTextAtSize(String(text), size);
      const truncate = (text, font, size, maxWidth) => {
        const s = String(text);
        if (measure(s, font, size) <= maxWidth) return s;
        let lo = 0,
          hi = s.length;
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1;
          if (measure(s.slice(0, mid) + "…", font, size) <= maxWidth) lo = mid;
          else hi = mid - 1;
        }
        return s.slice(0, lo) + "…";
      };
      const wrapText = (text, font, size, maxWidth) => {
        if (!text) return [""];
        const words = String(text).split(/\s+/);
        const lines = [];
        let current = "";
        for (const word of words) {
          const test = current ? current + " " + word : word;
          if (measure(test, font, size) > maxWidth && current) {
            lines.push(current);
            current = word;
          } else current = test;
          if (measure(current, font, size) > maxWidth) {
            let piece = "";
            for (const ch of current) {
              if (measure(piece + ch, font, size) > maxWidth) {
                lines.push(piece);
                piece = ch;
              } else piece += ch;
            }
            current = piece;
          }
        }
        if (current) lines.push(current);
        return lines;
      };
      const safeText = (text, opts) => {
        const {
          x,
          y: ty,
          size = 10,
          font = regularFont,
          color = C.textDark,
          align = "left",
          maxWidth = null,
        } = opts;
        const s = cleanText(text);
        const limit = maxWidth ?? PAGE_W - MARGIN - x;
        const finalText = truncate(s, font, size, limit);
        let fx = x;
        const w = measure(finalText, font, size);
        if (align === "center") fx = x - w / 2;
        else if (align === "right") fx = x - w;
        page.drawText(finalText, { x: fx, y: ty, size, font, color });
      };
      const drawCenteredText = (
        text,
        cy,
        size,
        font,
        color,
        maxW = CONTENT_W,
      ) => {
        const lines = wrapText(cleanText(text), font, size, maxW);
        lines.forEach((line, i) => {
          const w = measure(line, font, size);
          page.drawText(line, {
            x: (PAGE_W - w) / 2,
            y: cy - i * (size + 3),
            size,
            font,
            color,
          });
        });
        return lines.length * (size + 3);
      };
      const drawWrappedText = (text, opts) => {
        const {
          x,
          y: sy,
          size = 9.5,
          font = regularFont,
          color = C.textDark,
          maxWidth,
          lineHeight = null,
        } = opts;
        const lines = wrapText(cleanText(text), font, size, maxWidth);
        const lh = lineHeight ?? size + 3;
        lines.forEach((line, i) => {
          page.drawText(line, { x, y: sy - i * lh, size, font, color });
        });
        return lines.length * lh;
      };
      const addFooter = () => {
        const leftText = truncate(
          `JDA-Kimyo Raman Tahlili  •  [Ag(NH₃)₂]⁺ (Tollens reaktivi)  •  ${new Date().toLocaleDateString("uz-UZ")}`,
          regularFont,
          8,
          CONTENT_W - 30,
        );
        page.drawText(leftText, {
          x: MARGIN,
          y: FOOTER_Y,
          size: 8,
          font: regularFont,
          color: C.textGray,
        });
        const pageStr = `${pageNum}`;
        const w = measure(pageStr, regularFont, 8);
        page.drawText(pageStr, {
          x: PAGE_W - MARGIN - w,
          y: FOOTER_Y,
          size: 8,
          font: regularFont,
          color: C.textGray,
        });
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3,
          color: C.grayLine,
        });
      };
      const addNewPage = () => {
        addFooter();
        page = pdfDoc.addPage([PAGE_W, PAGE_H]);
        pageNum++;
        y = PAGE_H - MARGIN;
      };
      const checkPageBreak = (need) => {
        if (y - need < FOOTER_Y + 25) addNewPage();
      };

      const drawSectionHeader = (num, title) => {
        checkPageBreak(45);
        page.drawRectangle({
          x: MARGIN,
          y: y - 18,
          width: 4,
          height: 18,
          color: C.sky,
        });
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10,
          y: y - 14,
          size: 13,
          font: boldFont,
          color: C.skyDeep,
          maxWidth: CONTENT_W - 15,
        });
        y -= 24;
        page.drawLine({
          start: { x: MARGIN, y },
          end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5,
          color: C.grayLine,
        });
        y -= 14;
      };
      const drawTableRow = (
        label,
        value,
        bgColor = C.bgSky,
        labelColor = C.skyDeep,
      ) => {
        const rowH = 20,
          labelW = 200;
        const valueX = MARGIN + labelW + 6;
        const valueMaxW = CONTENT_W - labelW - 12;
        checkPageBreak(rowH + 2);
        page.drawRectangle({
          x: MARGIN,
          y: y - rowH,
          width: CONTENT_W,
          height: rowH,
          color: bgColor,
        });
        safeText(label, {
          x: MARGIN + 6,
          y: y - 13,
          size: 9,
          font: boldFont,
          color: labelColor,
          maxWidth: labelW - 8,
        });
        const valStr = cleanText(value);
        const finalVal = truncate(valStr, regularFont, 9, valueMaxW);
        page.drawText(finalVal, {
          x: valueX,
          y: y - 13,
          size: 9,
          font: regularFont,
          color: C.textDark,
        });
        y -= rowH;
      };
      const drawInfoBox = (text, bgColor, borderColor, textColor) => {
        const padding = 10;
        const maxW = CONTENT_W - 2 * padding;
        const lines = wrapText(cleanText(text), regularFont, 9, maxW);
        const boxH = lines.length * 12 + 2 * padding;
        checkPageBreak(boxH + 8);
        page.drawRectangle({
          x: MARGIN,
          y: y - boxH,
          width: CONTENT_W,
          height: boxH,
          color: bgColor,
          borderColor: borderColor,
          borderWidth: 0.8,
        });
        lines.forEach((line, i) => {
          page.drawText(line, {
            x: MARGIN + padding,
            y: y - padding - 10 - i * 12,
            size: 9,
            font: regularFont,
            color: textColor,
          });
        });
        y -= boxH + 10;
      };

      // ─── SARLAVHA POLOSASI ───────────────────────────────
      page.drawRectangle({
        x: 0,
        y: PAGE_H - HEADER_H,
        width: PAGE_W,
        height: HEADER_H,
        color: C.purpleDark,
      });
      safeText(
        "JDA-KIMYO ILMIY BYULLETENI  •  Raman Spektroskopiya  •  Vol. 2, Son 4",
        {
          x: MARGIN,
          y: PAGE_H - 25,
          size: 9,
          font: regularFont,
          color: C.purpleLight,
          maxWidth: CONTENT_W * 0.65,
        },
      );
      safeText(`Chop etilgan: ${new Date().toLocaleDateString("uz-UZ")}`, {
        x: PAGE_W - MARGIN,
        y: PAGE_H - 25,
        size: 9,
        font: regularFont,
        color: C.purpleLight,
        align: "right",
        maxWidth: CONTENT_W * 0.3,
      });
      page.drawLine({
        start: { x: MARGIN, y: PAGE_H - 37 },
        end: { x: PAGE_W - MARGIN, y: PAGE_H - 37 },
        thickness: 1,
        color: C.purpleMid,
      });
      safeText(
        "Analitik Kimyo — Chiziqli d¹⁰ Kompleks Tebranish Spektroskopiyasi",
        {
          x: MARGIN,
          y: PAGE_H - 52,
          size: 8,
          font: regularFont,
          color: rgb(0.71, 0.71, 0.86),
          maxWidth: CONTENT_W * 0.65,
        },
      );
      safeText("DOI: 10.0000/jda-kimyo.raman.2026.002", {
        x: PAGE_W - MARGIN,
        y: PAGE_H - 52,
        size: 8,
        font: regularFont,
        color: rgb(0.71, 0.71, 0.86),
        align: "right",
        maxWidth: CONTENT_W * 0.3,
      });
      y = PAGE_H - HEADER_H - 30;

      // ─── TITLE ───────────────────────────────────────────
      drawCenteredText(
        `[Ag(NH₃)₂]⁺ — Raman Spektroskopik Tahlili`,
        y,
        20,
        boldFont,
        C.textDark,
      );
      y -= 28;
      drawCenteredText(
        "Diamminkumush(I) kationi  •  «Tollens Reaktivi»",
        y,
        12,
        italicFont,
        C.purpleSoft,
      );
      y -= 20;
      drawCenteredText(
        `Simmetriya: D∞h (chiziqli)  •  Konfiguratsiya: d¹⁰ (4d¹⁰)  •  Diamagnit  •  14 e⁻  •  M = 141.94 g/mol`,
        y,
        9,
        regularFont,
        C.textMuted,
      );
      y -= 28;

      // ─── ANNOTATSIYA ─────────────────────────────────────
      const abstract =
        `Diamminkumush(I) kompleksi [Ag(NH₃)₂]⁺ — analitik kimyoning klassik namunasi bo'lib, 1882-yilda ` +
        `Bernhard Tollens tomonidan kumush ko'zgusi reaksiyasi uchun kashf etilgan. Ushbu ishda uning Raman ` +
        `spektri 100–3600 sm⁻¹ diapazonda batafsil tahlil qilingan. Diagnostik cho'qqilar: νₛ(Ag–N) = 375 sm⁻¹ ` +
        `(Σg⁺, faqat Raman — chiziqli D∞h isbotlash); δₛ(NH₃) umbrella = 1258 sm⁻¹ (erkin NH₃ dan +308 sm⁻¹ ` +
        `yuqoriga siljigan — ammin koordinatsiyasining eng aniq belgisi); νₛ(N–H) = 3220 sm⁻¹ (kuchli Raman); ` +
        `νₐₛ(Ag–N) = 495 sm⁻¹ (Σᵤ⁺, faqat IQ). D∞h simmetriyasi va inversiya markazi Ag ustida joylashganligi ` +
        `tufayli mutual exclusion qat'iy amal qiladi. Kuch konstantasi k(Ag–N) = 1.48 mdyn/Å — nisbatan yumshoq ` +
        `bog', d¹⁰ Ag(I) ning ligand-labilligini va tez almashinuvini tushuntiradi. log β₂ = 7.05 barqarorlik ` +
        `konstantasi bilan Ag⁺ + 2NH₃ ⇌ [Ag(NH₃)₂]⁺ muvozanati Bjerrum tomonidan aniqlangan.`;
      const absPadding = 12,
        absInnerW = CONTENT_W - 2 * absPadding;
      const absLines = wrapText(
        cleanText(abstract),
        regularFont,
        9.5,
        absInnerW,
      );
      const boxH = 24 + absLines.length * 13 + 8;
      checkPageBreak(boxH + 20);
      page.drawRectangle({
        x: MARGIN,
        y: y - boxH,
        width: CONTENT_W,
        height: boxH,
        color: C.bgAbstract,
        borderColor: C.purpleMid,
        borderWidth: 1,
      });
      safeText("QISQACHA XULOSA (ANNOTATSIYA)", {
        x: MARGIN + absPadding,
        y: y - 16,
        size: 10,
        font: boldFont,
        color: C.purple,
        maxWidth: absInnerW,
      });
      absLines.forEach((line, i) => {
        page.drawText(line, {
          x: MARGIN + absPadding,
          y: y - 32 - i * 13,
          size: 9.5,
          font: regularFont,
          color: C.textDark,
        });
      });
      y -= boxH + 22;

      let sectionNum = 1;

      // ─── 1. IDENTIFIKATSIYA ──────────────────────────────
      if (pdfSections.identification) {
        drawSectionHeader(sectionNum++, "Birikma Identifikatsiyasi");
        const idData = [
          ["Formula", "[Ag(NH₃)₂]⁺"],
          ["IUPAC nomi", "Diamminkumush(I) kationi"],
          ["An'anaviy nomi", "Tollens reaktivi"],
          ["CAS raqami (kation)", "16972-24-8"],
          ["CAS raqami (nitrat tuz)", "14039-49-1"],
          ["Molar massa", "141.94 g/mol"],
          ["Rangi", "Rangsiz eritma (d¹⁰)"],
          ["Kristall tuz", "AgNO₃·2NH₃, P2₁/c monoklinik"],
          ["Nuqtaviy guruh", "D∞h (chiziqli, ideal)"],
          ["Koordinatsiya", "2 (chiziqli)"],
          ["Metall ioni", "Ag⁺ (d¹⁰, 4d¹⁰)"],
          ["Elektronlar soni", "14 e⁻ (18 e⁻ dan kam!)"],
          ["Ag–N bog' uzunligi", "2.11 Å (XRD, o'rtacha)"],
          ["N–Ag–N burchagi", "180° (chiziqli)"],
          ["Barqarorlik konstantasi", "log β₂ = 7.05 (Bjerrum, 1941)"],
          ["Magnetizm", "Diamagnit (d¹⁰, S = 0)"],
          ["Kashfiyot", "1882 — B. Tollens (kumush ko'zgusi reaksiyasi)"],
          [
            "Xavfsizlik",
            "⚠️ Portlash xavfi — Ag₃N (kumush azid) hosil bo'lishi",
          ],
        ];
        idData.forEach((row, i) => {
          drawTableRow(
            row[0],
            row[1],
            i % 2 === 0 ? C.bgSky : C.white,
            C.skyDeep,
          );
        });
        y -= 15;
      }

      // ─── 2. NAZARIY ASOS ─────────────────────────────────
      if (pdfSections.theory) {
        drawSectionHeader(
          sectionNum++,
          "Raman Spektroskopiyasining Nazariy Asosi",
        );
        const t1 =
          "Raman spektroskopiya monoxromatik yorug'likning molekulyar tebranishlar bilan noelastik sochilishiga asoslangan (C.V. Raman, 1928; Nobel 1930). Chiziqli [Ag(NH₃)₂]⁺ kompleksi Raman spektroskopiyasi uchun ideal ob'ekt: uning D∞h simmetriyasi va Ag ustidagi inversiya markazi mutual exclusion qoidasini qat'iy tarzda amalga oshiradi.";
        y -=
          drawWrappedText(t1, {
            x: MARGIN,
            y,
            size: 9.5,
            font: regularFont,
            color: C.textDark,
            maxWidth: CONTENT_W,
            lineHeight: 13,
          }) + 8;
        drawInfoBox(
          "Raman tanlash qoidasi: (∂α/∂Q)₀ ≠ 0 — normal koordinata Q bo'yicha qutblanuvchanlik tenzori o'zgarishi zarur. Bu shart IQ tanlash qoidasidan (dipol moment ∂μ/∂Q ≠ 0) mustaqil.",
          C.bgBlue,
          C.blue,
          C.textDark,
        );
        drawInfoBox(
          "Mutual Exclusion: D∞h da inversiya markazi (Ag) tufayli hech qaysi skelet moda bir vaqtda IQ va Ramanda faol bo'lolmaydi. νₛ(Ag–N) = 375 (Σg⁺) → faqat Raman. νₐₛ(Ag–N) = 495 (Σᵤ⁺) → faqat IQ.",
          C.bgBlue,
          C.blue,
          C.textDark,
        );
        drawInfoBox(
          "Chiziqli molekula uchun 3N−5 ta normal moda. [Ag(NH₃)₂]⁺ (9 atom) uchun 3(9)−5 = 22 ta moda. Ular D∞h simmetriya turlariga bo'linadi: Σg⁺, Σᵤ⁺, Πg, Πᵤ.",
          C.bgBlue,
          C.blue,
          C.textDark,
        );
        const t2 =
          "Ammin komplekslarning universal Raman diagnostikasi — koordinatsion NH₃ ning umbrella modasi (δₛ). Erkin NH₃ da bu tebranish 950 sm⁻¹ da (yumshoq inversion coordinate — piramidal ↔ tekis), ammo koordinatsiyada N atomi Ag ga bog'langanligi uchun inversiya to'xtatiladi va chastota keskin +300 sm⁻¹ dan ortiq oshadi (1258 sm⁻¹ da paydo bo'ladi).";
        y -=
          drawWrappedText(t2, {
            x: MARGIN,
            y,
            size: 9.5,
            font: regularFont,
            color: C.textDark,
            maxWidth: CONTENT_W,
            lineHeight: 13,
          }) + 10;
      }

      // ─── 3. CHO'QQILAR JADVALI ───────────────────────────
      if (pdfSections.peaks) {
        drawSectionHeader(sectionNum++, "Raman Cho'qqilari Jadvali");
        const colWs = [55, 90, 140, 90, 80, 60];
        const headers = [
          "ν̃ (sm⁻¹)",
          "Tayinlash",
          "Tavsif",
          "Simmetriya",
          "k (mdyn/Å)",
          "Intens.",
        ];
        checkPageBreak(28);
        page.drawRectangle({
          x: MARGIN,
          y: y - 18,
          width: CONTENT_W,
          height: 18,
          color: C.skyDeep,
        });
        let cx = MARGIN + 4;
        headers.forEach((h, i) => {
          safeText(h, {
            x: cx,
            y: y - 13,
            size: 8.5,
            font: boldFont,
            color: C.white,
            maxWidth: colWs[i] - 4,
          });
          cx += colWs[i];
        });
        y -= 20;
        ramanPeaks.forEach((p, idx) => {
          checkPageBreak(22);
          if (idx % 2 === 0) {
            page.drawRectangle({
              x: MARGIN,
              y: y - 18,
              width: CONTENT_W,
              height: 18,
              color: C.bgSky,
            });
          }
          const cells = [
            p.freq.toString(),
            p.assignment,
            p.assignment_uz,
            p.symmetry.split(" ")[0],
            p.forceConstant,
            p.intensity,
          ];
          cx = MARGIN + 4;
          cells.forEach((c, i) => {
            safeText(c, {
              x: cx,
              y: y - 12,
              size: 8,
              font: regularFont,
              color: C.textDark,
              maxWidth: colWs[i] - 6,
            });
            cx += colWs[i];
          });
          y -= 18;
        });
        y -= 10;
      }

      // ─── 4. GURUH NAZARIYASI ─────────────────────────────
      if (pdfSections.groupTheory) {
        drawSectionHeader(sectionNum++, "Guruh Nazariyasi — D∞h Simmetriyasi");
        drawTableRow("Nuqtaviy guruh", groupTheoryData.pointGroup);
        drawTableRow("Alternativ (eritmada)", groupTheoryData.alternativeGroup);
        drawTableRow("Guruh tartibi", groupTheoryData.order);
        drawTableRow("Simmetriya operatsiyalari", groupTheoryData.operations);
        drawTableRow("Umumiy tebranish modalar", groupTheoryData.totalModes);
        drawTableRow(
          "Tebranish tasviri (skelet)",
          groupTheoryData.reducibleRep,
        );
        drawTableRow("Raman-faol (g)", groupTheoryData.ramanActive);
        drawTableRow("IQ-faol (u)", groupTheoryData.irActive);
        drawTableRow("Silent modalar", groupTheoryData.silent);
        drawTableRow("Mutual Exclusion", groupTheoryData.mutualExclusion);
        drawTableRow("Asosiy diagnostik modalar", groupTheoryData.keyModes);
        y -= 15;
      }

      // ─── 5. KUCH KONSTANTASI ─────────────────────────────
      if (pdfSections.forceConstant) {
        drawSectionHeader(
          sectionNum++,
          "Kuch Konstantasi Taqqoslashi (Hooke qonuni)",
        );
        drawWrappedText(
          "Hooke qonuni ν̃ = (1/2πc)·√(k/μ) asosida bog' kuch konstantasi (k) tebranish chastotasiga proporsional. Quyidagi jadval [Ag(NH₃)₂]⁺ bog'larini boshqa d¹⁰ va oktaedrik komplekslar bilan taqqoslaydi:",
          {
            x: MARGIN,
            y,
            size: 9.5,
            font: regularFont,
            color: C.textDark,
            maxWidth: CONTENT_W,
            lineHeight: 13,
          },
        );
        y -= 30;
        forceConstantExamples.forEach((f, i) => {
          drawTableRow(
            f.bond,
            `k = ${f.k} mdyn/Å  •  ν̃ = ${f.freq} sm⁻¹  •  ${f.note}`,
            i % 2 === 0 ? C.bgSky : C.white,
          );
        });
        y -= 15;
      }

      // ─── 6. d¹⁰ QATOR ────────────────────────────────────
      if (pdfSections.d10series) {
        drawSectionHeader(sectionNum++, "d¹⁰ Chiziqli Komplekslar Qatori");
        drawWrappedText(
          "Cu⁺, Ag⁺, Au⁺ va Hg²⁺ — barchasi d¹⁰ konfiguratsiya va koordinatsion son 2 (chiziqli). ν(M–N) chastotalari orbital kattaligi va relativistik effektlar bilan bog'liq:",
          {
            x: MARGIN,
            y,
            size: 9.5,
            font: regularFont,
            color: C.textDark,
            maxWidth: CONTENT_W,
            lineHeight: 13,
          },
        );
        y -= 30;
        d10Series.forEach((m, i) => {
          const highlight = m.current;
          drawTableRow(
            m.formula,
            `M: ${m.metal}  •  ${m.dConfig}  •  νₛ(M–N): ${m.nuMLSym}  •  d(M–N): ${m.bondL} Å  •  ${m.stability}`,
            highlight ? C.bgOrange : i % 2 === 0 ? C.bgSky : C.white,
            highlight ? C.orangeDeep : C.skyDeep,
          );
        });
        y -= 15;
      }

      // ─── 7. BJERRUM QATORI ───────────────────────────────
      if (pdfSections.bjerrum) {
        drawSectionHeader(
          sectionNum++,
          "Bjerrum Muvozanatlari — Ag(I)/NH₃ Sistemasi",
        );
        drawWrappedText(
          "Jannik Bjerrum (1941) suvli eritmadagi Ag⁺/NH₃ muvozanat konstantalarini aniqlagan. [Ag(NH₃)₂]⁺ eng barqaror va dominant tur (log β₂ = 7.05). Har bir turning Raman νₛ(Ag–N) chastotasi farq qiladi:",
          {
            x: MARGIN,
            y,
            size: 9.5,
            font: regularFont,
            color: C.textDark,
            maxWidth: CONTENT_W,
            lineHeight: 13,
          },
        );
        y -= 30;
        bjerrumSeries.forEach((b, i) => {
          const highlight = b.current;
          const nuStr = b.nuAgN
            ? `νₛ(Ag–N): ${b.nuAgN} sm⁻¹`
            : `νₛ(Ag–O): ${b.nuAgO} sm⁻¹`;
          drawTableRow(
            b.formula,
            `${b.trad}  •  ${b.geom}  •  ${nuStr}  •  logK: ${b.logK}`,
            highlight ? C.bgOrange : i % 2 === 0 ? C.bgSky : C.white,
            highlight ? C.orangeDeep : C.skyDeep,
          );
        });
        y -= 15;
      }

      // ─── 8. NAMUNA TAYYORLASH ────────────────────────────
      if (pdfSections.techniques) {
        drawSectionHeader(sectionNum++, "Namuna Tayyorlash Usullari");
        techniques.forEach((t, idx) => {
          checkPageBreak(180);
          page.drawRectangle({
            x: MARGIN,
            y: y - 22,
            width: CONTENT_W,
            height: 22,
            color: C.skyDeep,
          });
          safeText(`${idx + 1}. ${t.name}`, {
            x: MARGIN + 8,
            y: y - 15,
            size: 10,
            font: boldFont,
            color: C.white,
            maxWidth: CONTENT_W - 16,
          });
          y -= 26;
          y -=
            drawWrappedText(t.description, {
              x: MARGIN,
              y,
              size: 9,
              font: italicFont,
              color: C.textDark,
              maxWidth: CONTENT_W,
              lineHeight: 12,
            }) + 8;
          const colBoxW = (CONTENT_W - 10) / 2;
          page.drawRectangle({
            x: MARGIN,
            y: y - 68,
            width: colBoxW,
            height: 68,
            color: C.bgGreen,
            borderColor: C.green,
            borderWidth: 0.5,
          });
          safeText("✓ Afzalliklar", {
            x: MARGIN + 6,
            y: y - 12,
            size: 9,
            font: boldFont,
            color: C.green,
            maxWidth: colBoxW - 12,
          });
          t.advantages.slice(0, 4).forEach((adv, i) => {
            safeText(`• ${adv}`, {
              x: MARGIN + 6,
              y: y - 26 - i * 10,
              size: 7.5,
              font: regularFont,
              color: C.textDark,
              maxWidth: colBoxW - 12,
            });
          });
          page.drawRectangle({
            x: MARGIN + colBoxW + 10,
            y: y - 68,
            width: colBoxW,
            height: 68,
            color: C.bgRed,
            borderColor: C.red,
            borderWidth: 0.5,
          });
          safeText("✗ Kamchiliklar", {
            x: MARGIN + colBoxW + 16,
            y: y - 12,
            size: 9,
            font: boldFont,
            color: C.red,
            maxWidth: colBoxW - 12,
          });
          t.disadvantages.slice(0, 4).forEach((dis, i) => {
            safeText(`• ${dis}`, {
              x: MARGIN + colBoxW + 16,
              y: y - 26 - i * 10,
              size: 7.5,
              font: regularFont,
              color: C.textDark,
              maxWidth: colBoxW - 12,
            });
          });
          y -= 74;
          safeText(
            `Chastota: ${t.freqRange}  •  Ruxsat: ${t.resolution}  •  Vaqt: ${t.samplePrep}`,
            {
              x: MARGIN,
              y,
              size: 8,
              font: italicFont,
              color: C.purpleSoft,
              maxWidth: CONTENT_W,
            },
          );
          y -= 12;
          safeText(`Eng yaxshi qo'llanish: ${t.bestFor}`, {
            x: MARGIN,
            y,
            size: 8,
            font: italicFont,
            color: C.purpleSoft,
            maxWidth: CONTENT_W,
          });
          y -= 16;
        });
      }

      // ─── 9. HALAQIT OMILLARI ─────────────────────────────
      if (pdfSections.interferences) {
        drawSectionHeader(
          sectionNum++,
          "Raman Tahliliga Halaqit Beruvchi Omillar",
        );
        drawWrappedText(
          "[Ag(NH₃)₂]⁺ Raman spektroskopiyasida bir qator xavfli va texnik halaqitlarni bartaraf etish zarur. Eng muhimi — Ag₃N portlash xavfi va suv polosalari:",
          {
            x: MARGIN,
            y,
            size: 9.5,
            font: regularFont,
            color: C.textDark,
            maxWidth: CONTENT_W,
            lineHeight: 13,
          },
        );
        y -= 22;
        interferences.forEach((iv, idx) => {
          checkPageBreak(70);
          const sevColor = iv.severity.includes("Yuqori")
            ? C.red
            : iv.severity.includes("O'rta")
              ? C.orange
              : C.green;
          const sevBg = iv.severity.includes("Yuqori")
            ? C.bgRed
            : iv.severity.includes("O'rta")
              ? C.bgOrange
              : C.bgGreen;
          page.drawRectangle({
            x: MARGIN,
            y: y - 18,
            width: CONTENT_W,
            height: 18,
            color: sevBg,
          });
          safeText(`${idx + 1}. ${iv.source}`, {
            x: MARGIN + 6,
            y: y - 12,
            size: 9.5,
            font: boldFont,
            color: sevColor,
            maxWidth: CONTENT_W * 0.5,
          });
          safeText(`ν̃: ${iv.freqRange}`, {
            x: MARGIN + CONTENT_W * 0.52,
            y: y - 12,
            size: 8,
            font: regularFont,
            color: C.textDark,
            maxWidth: CONTENT_W * 0.28,
          });
          safeText(`[${iv.severity}]`, {
            x: PAGE_W - MARGIN - 6,
            y: y - 12,
            size: 8.5,
            font: boldFont,
            color: sevColor,
            align: "right",
            maxWidth: CONTENT_W * 0.15,
          });
          y -= 20;
          const h1 = drawWrappedText(`Ta'sir: ${iv.effect}`, {
            x: MARGIN + 8,
            y,
            size: 8.5,
            font: regularFont,
            color: C.textDark,
            maxWidth: CONTENT_W - 16,
            lineHeight: 11,
          });
          y -= h1 + 4;
          const h2 = drawWrappedText(`Yechim: ${iv.solution}`, {
            x: MARGIN + 8,
            y,
            size: 8.5,
            font: italicFont,
            color: C.greenDark,
            maxWidth: CONTENT_W - 16,
            lineHeight: 11,
          });
          y -= h2 + 10;
        });
      }

      // ─── 10. XULOSALAR ───────────────────────────────────
      if (pdfSections.conclusions) {
        drawSectionHeader(sectionNum++, "Asosiy Xulosalar");
        const conclusions = [
          "[Ag(NH₃)₂]⁺ ning Raman spektri chiziqli D∞h simmetriyaga to'liq mos keladi. νₛ(Ag–N) = 375 sm⁻¹ (Σg⁺, faqat Raman) va νₐₛ(Ag–N) = 495 sm⁻¹ (Σᵤ⁺, faqat IQ) mutual exclusion qoidasining aniq isbotidir.",
          "δₛ(NH₃) umbrella tebranishi 1258 sm⁻¹ da — erkin NH₃ (950) dan +308 sm⁻¹ yuqoriga siljigan. Bu ammin koordinatsiyasining eng kuchli diagnostik Raman signali, chunki koordinatsiya NH₃ ning inversiya harakatini blokirovka qiladi.",
          "νₛ(N–H) = 3220 sm⁻¹ da — koordinatsiyada erkin NH₃ (3337) dan −117 sm⁻¹ pastga siljigan. N ning elektron juftini Ag ga uzatishi N–H bog'ini biroz zaiflashtiradi.",
          "Kuch konstantasi k(Ag–N) = 1.48 mdyn/Å — Co–N (1.85) va Fe–C (2.10) dan zaifroq. Bu d¹⁰ Ag(I) ning ligand-labilligi va tez almashinuv kinetikasini tushuntiradi (SN₁ mexanizmi).",
          "d¹⁰ chiziqli qator: Cu(405) → Ag(375) → Au(430) sm⁻¹ ν(M–N) chastotalari. Au ning yuqori qiymati relativistik s-orbital kontraksiyasi bilan izohlanadi. Ag esa oralig'da — o'ziga xos yumshoq bog'.",
          "Bjerrum muvozanati: log β₂ = 7.05 (Ag⁺ + 2NH₃ ⇌ [Ag(NH₃)₂]⁺). Uch- va tetra-ammin komplekslar juda kam barqaror (logK₃ ≈ −0.3). Raman spektri konsentratsiyaga bog'liq turlar taqsimotini in-situ kuzatishga imkon beradi.",
          "Tollens reaktivi ⚠️ portlash xavfli — 24 soatdan uzoq turgan reaktiv Ag₃N (kumush azid) hosil qiladi. Har o'lchashdan oldin yangi eritma tayyorlash va foydalanishdan keyin darhol razb. HCl bilan zararsizlantirish shart.",
          "SERS uchun UNIKAL holat: [Ag(NH₃)₂]⁺ ning o'zi kumush nanozarralar sirtida adsorbsiyalanganda plazmonik kuchayish beradi — bu 10⁻⁹ M darajadagi biosensor va analitik ilovalar uchun ideal. Zamonaviy Ag-nanozarra kimyosining asosi.",
        ];
        conclusions.forEach((c, idx) => {
          checkPageBreak(35);
          page.drawCircle({ x: MARGIN + 10, y: y - 8, size: 8, color: C.sky });
          const numStr = `${idx + 1}`,
            numW = measure(numStr, boldFont, 9);
          page.drawText(numStr, {
            x: MARGIN + 10 - numW / 2,
            y: y - 11,
            size: 9,
            font: boldFont,
            color: C.white,
          });
          const h = drawWrappedText(c, {
            x: MARGIN + 25,
            y,
            size: 9,
            font: regularFont,
            color: C.textDark,
            maxWidth: CONTENT_W - 30,
            lineHeight: 12,
          });
          y -= h + 10;
        });
      }

      addFooter();
      pdfDoc.setTitle(`[Ag(NH₃)₂]⁺ Raman Spektroskopik Tahlili`);
      pdfDoc.setSubject("Tollens reaktivi — Raman spektroskopiya (JDA-Kimyo)");
      pdfDoc.setAuthor("JDA-Kimyo Research Platform");
      pdfDoc.setCreator("JDA-Kimyo Raman Tahlil Moduli");
      pdfDoc.setKeywords([
        "Silver diammine",
        "Tollens",
        "Raman",
        "D∞h",
        "linear complex",
        "d10",
      ]);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Ag_NH3_2_Tollens_Raman_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setPdfModalOpen(false);
    } catch (err) {
      console.error("PDF yaratishda xato:", err);
      alert("PDF yaratishda xato: " + err.message);
    } finally {
      setPdfGenerating(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER (JSX)
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      {/* ═══════════ HEADER ═══════════ */}
      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300">
                🏠 Bosh sahifa
              </Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">
                Tahlil usullari
              </Link>
              <span className="text-purple-600">›</span>
              <Link
                href="/ilmiy/tahlil/raman"
                className="hover:text-purple-300"
              >
                Raman spektroskopiya
              </Link>
              <span className="text-purple-600">›</span>
              <Link
                href="/ilmiy/tahlil/raman/birikmalar"
                className="hover:text-purple-300"
              >
                Birikmalar
              </Link>
              <span className="text-purple-600">›</span>
              <span className="text-sky-400 font-semibold">[Ag(NH₃)₂]⁺</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-sky-400 flex items-center gap-2 flex-wrap">
                  <span
                    dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }}
                  />
                  <span className="text-xs bg-orange-600 px-2 py-1 rounded ml-2">
                    🔆 Raman
                  </span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">
                  {COMPOUND.commonName}
                </p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol • log β₂ = 7.05 • 14 e⁻
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-sky-900/30 border border-sky-700/50 text-sky-400 text-[10px] uppercase tracking-wide">
                    D∞h chiziqli
                  </span>
                  <span className="px-2 py-1 rounded bg-sky-900/30 border border-sky-700/50 text-sky-400 text-[10px] uppercase tracking-wide">
                    νₛ(Ag–N) 375
                  </span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">
                    Umbrella 1258
                  </span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">
                    d¹⁰ diamagnit
                  </span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">
                    ⚠ Portlash xavfi
                  </span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">
                    Tollens 1882
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setPdfModalOpen(true)}
                  className="text-xs bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg transition-all whitespace-nowrap font-bold shadow-lg shadow-sky-500/20"
                >
                  📄 PDF Hisobot
                </button>
                <Link
                  href="/ilmiy/tahlil/raman/birikmalar"
                  className="text-xs bg-sky-600/80 hover:bg-sky-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-center"
                >
                  ← Barcha birikmalar
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-sky-600 hover:bg-sky-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      {/* ═══════════ PDF MODAL ═══════════ */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-950 to-blue-950 border-2 border-sky-500 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-sky-400 flex items-center gap-2">
                <span className="text-3xl">📄</span> PDF Hisobot — Bo'limlarni
                tanlang
              </h3>
              <button
                onClick={() => setPdfModalOpen(false)}
                className="text-purple-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-purple-200 text-sm mb-4">
              [Ag(NH₃)₂]⁺ Tollens reaktivi ning Raman spektroskopik tahlilining
              ilmiy hisoboti. Ilmiy maqola uslubida, DejaVu Sans fonti bilan, A4
              formatida chop etiladi.
            </p>

            <div className="space-y-2 mb-6">
              {[
                {
                  key: "identification",
                  label: "1. Birikma identifikatsiyasi",
                  desc: "Formula, CAS, molar massa, XRD ma'lumotlari",
                },
                {
                  key: "theory",
                  label: "2. Nazariy asos",
                  desc: "Raman effekti, D∞h tanlash qoidalari, mutual exclusion",
                },
                {
                  key: "peaks",
                  label: "3. Cho'qqilar jadvali",
                  desc: "9 ta Raman polosasi — chastota, tayinlash, kuch konstantasi",
                },
                {
                  key: "spectrum",
                  label: "4. Raman spektri grafigi",
                  desc: "Lorentzian simulyatsiya, 100-3600 sm⁻¹",
                },
                {
                  key: "groupTheory",
                  label: "5. Guruh nazariyasi",
                  desc: "D∞h simmetriya, Σg⁺/Σᵤ⁺ tanlashi",
                },
                {
                  key: "forceConstant",
                  label: "6. Kuch konstantasi",
                  desc: "9 ta bog' turi taqqoslash jadvali",
                },
                {
                  key: "d10series",
                  label: "7. d¹⁰ komplekslar qatori",
                  desc: "Cu(I), Ag(I), Au(I), Hg(II) taqqoslashi",
                },
                {
                  key: "bjerrum",
                  label: "8. Bjerrum muvozanatlari",
                  desc: "Ag(I)/NH₃ turlar taqsimoti va logK",
                },
                {
                  key: "techniques",
                  label: "9. Namuna tayyorlash usullari",
                  desc: "Suvli, kristall, SERS, past haroratli",
                },
                {
                  key: "interferences",
                  label: "10. Halaqit beruvchi omillar",
                  desc: "8 ta omil va yechimlari (Ag₃N xavfi!)",
                },
                {
                  key: "conclusions",
                  label: "11. Asosiy xulosalar",
                  desc: "8 ta ilmiy xulosa",
                },
              ].map((s) => (
                <label
                  key={s.key}
                  className="flex items-start gap-3 p-3 bg-purple-800/30 border border-purple-700/40 rounded-lg hover:border-sky-500/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={pdfSections[s.key]}
                    onChange={(e) =>
                      setPdfSections({
                        ...pdfSections,
                        [s.key]: e.target.checked,
                      })
                    }
                    className="mt-1 accent-sky-500"
                  />
                  <div className="flex-1">
                    <div className="text-sky-300 font-semibold text-sm">
                      {s.label}
                    </div>
                    <div className="text-purple-300 text-xs mt-0.5">
                      {s.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="bg-sky-900/20 border border-sky-500/30 rounded-lg p-3 mb-4">
              <p className="text-sky-200 text-xs">
                <strong>⚠ Eslatma:</strong> PDF Unicode belgilarni (Ag, ν̃, D∞h,
                Σg⁺, Πᵤ, ⁻¹, ₂ va h.k.) qo'llash uchun{" "}
                <code className="bg-purple-950 px-1 rounded">
                  /public/fonts/
                </code>{" "}
                papkasida DejaVuSans.ttf, DejaVuSans-Bold.ttf va
                DejaVuSans-Oblique.ttf fayllari bo'lishi kerak. Kutilgan hajm:
                ~6-8 sahifa A4.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPdfModalOpen(false)}
                className="flex-1 py-3 rounded-lg border border-purple-500 text-purple-300 hover:bg-purple-800/40 transition-colors text-sm"
              >
                Bekor qilish
              </button>
              <button
                onClick={generatePDF}
                disabled={
                  pdfGenerating || !Object.values(pdfSections).some((v) => v)
                }
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {pdfGenerating
                  ? "⏳ Yaratilmoqda..."
                  : "📥 PDF ni yuklab olish"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* ═══════════ 1. HERO KARTASI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl -ml-16 -mb-16" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-sky-600/20 text-sky-400 border border-sky-600/30 px-3 py-1 rounded-full text-xs font-semibold">
              Raman tahlili
            </span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">
              Chiziqli D∞h
            </span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">
              2-koordinatsion
            </span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">
              d¹⁰ diamagnit
            </span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">
              Analitik reagent
            </span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">
              ⚠ Ag₃N xavfi
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-4 flex-wrap relative">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              [Ag(NH₃)₂]⁺
            </h2>
            <span className="text-purple-400 text-lg">141.94 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            diamminkumush(I) kationi —{" "}
            <span className="text-sky-400 italic">«Tollens reaktivi»</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-sky-400">
              Analitik kimyoning klassik namunasi
            </strong>{" "}
            — 1882-yilda Bernhard Tollens tomonidan aldegidlarni aniqlash uchun
            "kumush ko'zgusi" reaksiyasida kashf etilgan. Werner (1893)
            koordinatsion nazariyasida oddiy chiziqli kompleksning namunaviy
            misoli. [Ag(NH₃)₂]⁺ Raman spektrida{" "}
            <strong className="text-orange-300">
              mutual exclusion qoidasi
            </strong>
            ning eng aniq namoyishi:{" "}
            <strong className="text-sky-300">
              νₛ(Ag–N) = 375 sm⁻¹ faqat Ramanda
            </strong>{" "}
            (Σg⁺),{" "}
            <strong className="text-purple-300">
              νₐₛ(Ag–N) = 495 sm⁻¹ faqat IQ da
            </strong>{" "}
            (Σᵤ⁺). Umbrella deformatsiyasi (1258 sm⁻¹) — erkin NH₃ dan +308 sm⁻¹
            yuqoriga siljigan bo'lib, ammin koordinatsiyasining universal
            diagnostik ko'rsatkichi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Ag⁺ (d¹⁰)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Konfiguratsiya</div>
              <div className="text-white font-bold">4d¹⁰ 5s⁰</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Chiziqli (D∞h)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">
                μ<sub>eff</sub>
              </div>
              <div className="text-white font-bold">
                0 μ<sub>B</sub> (diamagnit)
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ 2. CHIZIQLI D∞h STRUKTURASI (SVG) ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📐</span> Chiziqli struktura — D∞h simmetriya
          </h2>
          <p className="text-purple-200 text-sm">
            Ag ioni ikki NH₃ ligandi orasida <strong>markazda</strong>{" "}
            joylashgan. N–Ag–N burchagi{" "}
            <strong className="text-orange-300">aynan 180°</strong> — bu{" "}
            <strong className="text-sky-300">inversiya markazi (i)</strong> Ag
            ustida joylashganini bildiradi, mutual exclusion qoidasining asosi.
          </p>

          <div className="bg-purple-950/40 p-6 rounded-xl border border-purple-700/30">
            <svg
              viewBox="0 0 700 300"
              className="w-full max-w-4xl mx-auto h-auto"
            >
              {/* Fon zonalar */}
              <rect x="0" y="0" width="700" height="300" fill="none" />

              {/* Chap N atomi va NH₃ */}
              <g>
                {/* NH₃ chap */}
                {[
                  [-30, -40],
                  [-40, 0],
                  [-30, 40],
                ].map(([dx, dy], i) => (
                  <g key={`nh1-${i}`}>
                    <line
                      x1="150"
                      y1="150"
                      x2={150 + dx}
                      y2={150 + dy}
                      stroke="#a78bfa"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={150 + dx}
                      cy={150 + dy}
                      r="8"
                      fill="#e5e7eb"
                      stroke="#374151"
                      strokeWidth="1"
                    />
                    <text
                      x={150 + dx}
                      y={150 + dy + 3}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#374151"
                      fontWeight="bold"
                    >
                      H
                    </text>
                  </g>
                ))}
                {/* N atomi chap */}
                <defs>
                  <radialGradient id="nGrad1">
                    <stop offset="0%" stopColor="#a5b4fc" />
                    <stop offset="100%" stopColor="#4338ca" />
                  </radialGradient>
                </defs>
                <circle
                  cx="150"
                  cy="150"
                  r="18"
                  fill="url(#nGrad1)"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x="150"
                  y="155"
                  textAnchor="middle"
                  fontSize="14"
                  fill="#fff"
                  fontWeight="bold"
                >
                  N
                </text>
              </g>

              {/* Ag markaz */}
              <defs>
                <radialGradient id="agGrad">
                  <stop offset="0%" stopColor="#e5e7eb" />
                  <stop offset="60%" stopColor="#9ca3af" />
                  <stop offset="100%" stopColor="#4b5563" />
                </radialGradient>
              </defs>
              <circle
                cx="350"
                cy="150"
                r="26"
                fill="url(#agGrad)"
                stroke="#fff"
                strokeWidth="2"
              />
              <text
                x="350"
                y="156"
                textAnchor="middle"
                fontSize="16"
                fill="#fff"
                fontWeight="bold"
              >
                Ag
              </text>
              <text
                x="350"
                y="170"
                textAnchor="middle"
                fontSize="9"
                fill="#fff"
                fontWeight="bold"
              >
                +
              </text>

              {/* O'ng N atomi va NH₃ */}
              <g>
                <defs>
                  <radialGradient id="nGrad2">
                    <stop offset="0%" stopColor="#a5b4fc" />
                    <stop offset="100%" stopColor="#4338ca" />
                  </radialGradient>
                </defs>
                <circle
                  cx="550"
                  cy="150"
                  r="18"
                  fill="url(#nGrad2)"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x="550"
                  y="155"
                  textAnchor="middle"
                  fontSize="14"
                  fill="#fff"
                  fontWeight="bold"
                >
                  N
                </text>
                {[
                  [30, -40],
                  [40, 0],
                  [30, 40],
                ].map(([dx, dy], i) => (
                  <g key={`nh2-${i}`}>
                    <line
                      x1="550"
                      y1="150"
                      x2={550 + dx}
                      y2={150 + dy}
                      stroke="#a78bfa"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={550 + dx}
                      cy={150 + dy}
                      r="8"
                      fill="#e5e7eb"
                      stroke="#374151"
                      strokeWidth="1"
                    />
                    <text
                      x={550 + dx}
                      y={150 + dy + 3}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#374151"
                      fontWeight="bold"
                    >
                      H
                    </text>
                  </g>
                ))}
              </g>

              {/* Ag–N bog'lari */}
              <line
                x1="168"
                y1="150"
                x2="324"
                y2="150"
                stroke="#fbbf24"
                strokeWidth="3"
              />
              <line
                x1="376"
                y1="150"
                x2="532"
                y2="150"
                stroke="#fbbf24"
                strokeWidth="3"
              />

              {/* Bog' uzunligi belgilari */}
              <text
                x="246"
                y="140"
                textAnchor="middle"
                fontSize="11"
                fill="#fbbf24"
                fontWeight="bold"
              >
                2.11 Å
              </text>
              <text
                x="454"
                y="140"
                textAnchor="middle"
                fontSize="11"
                fill="#fbbf24"
                fontWeight="bold"
              >
                2.11 Å
              </text>

              {/* Inversiya markazi */}
              <circle
                cx="350"
                cy="150"
                r="35"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="3,3"
                opacity="0.6"
              />
              <text
                x="350"
                y="115"
                textAnchor="middle"
                fontSize="10"
                fill="#38bdf8"
                fontWeight="bold"
              >
                inversiya markazi (i)
              </text>

              {/* 180° burchak belgisi */}
              <path
                d="M 200 200 Q 350 220 500 200"
                fill="none"
                stroke="#fb923c"
                strokeWidth="1.5"
                strokeDasharray="2,2"
              />
              <text
                x="350"
                y="240"
                textAnchor="middle"
                fontSize="12"
                fill="#fb923c"
                fontWeight="bold"
              >
                ∠ N–Ag–N = 180°
              </text>

              {/* Bosh sarlavha */}
              <text
                x="350"
                y="30"
                textAnchor="middle"
                fontSize="16"
                fill="#38bdf8"
                fontWeight="bold"
              >
                [Ag(NH₃)₂]⁺ — Chiziqli D∞h struktura
              </text>
              <text
                x="350"
                y="50"
                textAnchor="middle"
                fontSize="9"
                fill="#a78bfa"
              >
                H₃N ← Ag⁺ → NH₃ • d¹⁰ konfiguratsiya • sp gibrid
              </text>

              {/* Simmetriya elementlari */}
              <text x="20" y="285" fontSize="8" fill="#c084fc">
                C∞ o'q (bosh o'q)
              </text>
              <line
                x1="80"
                y1="283"
                x2="620"
                y2="283"
                stroke="#c084fc"
                strokeWidth="1"
                strokeDasharray="4,2"
                opacity="0.6"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-sky-900/20 border border-sky-500/30 rounded-xl p-4">
              <div className="text-sky-400 font-bold text-sm mb-2">
                📏 Ag–N bog'i
              </div>
              <p className="text-purple-200 text-xs">
                2.11 Å — ikkala bog' bir xil. XRD (Bergerhoff, 1964) bilan
                tasdiqlangan. sp gibrid (4d¹⁰ 5s⁰).
              </p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
              <div className="text-orange-400 font-bold text-sm mb-2">
                🎯 Inversiya markazi (i)
              </div>
              <p className="text-purple-200 text-xs">
                Ag ustida joylashgan. Bu{" "}
                <strong>mutual exclusion qoidasi</strong>ning asosi: g-modalar
                faqat Ramanda, u-modalar faqat IQ da.
              </p>
            </div>
            <div className="bg-purple-800/30 border border-purple-500/30 rounded-xl p-4">
              <div className="text-purple-400 font-bold text-sm mb-2">
                🔄 Ligand almashinuvi
              </div>
              <p className="text-purple-200 text-xs">
                Ag(I) ligand-labil (SN₁), NH₃ ↔ H₂O tez almashinadi (kᵣ ≈ 10⁸
                s⁻¹). Bu ν(Ag–N) chiziq kengligini oshiradi.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 3. NAZARIY ASOS ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📚</span> Raman spektroskopiyasining nazariy asosi
          </h2>

          <p className="text-purple-200 leading-relaxed">
            <strong className="text-sky-400">Raman spektroskopiya</strong> (C.V.
            Raman, 1928; Nobel 1930) monoxromatik yorug'likning molekula bilan{" "}
            <strong>noelastik sochilishiga</strong> asoslangan. Chiziqli
            [Ag(NH₃)₂]⁺ kompleksi Raman spektroskopiyasi uchun{" "}
            <strong>ideal ob'ekt</strong>: uning D∞h simmetriyasi va Ag ustidagi
            inversiya markazi mutual exclusion qoidasini qat'iy tarzda amalga
            oshiradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sky-300 font-bold mb-3">
                ⚡ Klassik nazariy asos
              </h3>
              <p className="text-purple-200 text-sm mb-3">
                Induksiyalangan dipol momenti tashqi elektr maydonga
                proporsional:
              </p>
              <div className="bg-purple-950/60 rounded-lg p-3 font-mono text-xs text-sky-300 mb-3">
                <div className="text-sky-300 text-sm text-center my-2">
                  P = α · E
                </div>
                <div className="text-purple-300 text-[10px] mt-2">
                  • P — induksiyalangan dipol moment
                  <br />
                  • α — qutblanuvchanlik tenzori (polarizability)
                  <br />• E — tushuvchi elektr maydon
                </div>
              </div>
              <div className="bg-purple-950/60 rounded-lg p-3 font-mono text-xs">
                <div className="text-sky-300 text-sm text-center my-1">
                  α(Q) = α₀ + (∂α/∂Q)₀ · Q + ...
                </div>
                <div className="text-purple-300 text-[10px] mt-1">
                  Tebranish davomida qutblanuvchanlik modulyatsiyasi
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sky-300 font-bold mb-3">
                🎯 Chiziqli molekula uchun tanlash
              </h3>
              <div className="space-y-3">
                <div className="bg-sky-900/20 border border-sky-700/40 rounded-lg p-3">
                  <p className="text-sky-300 font-bold text-sm mb-1">
                    1. Normal modalar soni
                  </p>
                  <p className="text-purple-200 text-xs font-mono">
                    3N − 5 = 3(9) − 5 = 22 ta
                  </p>
                  <p className="text-purple-200 text-xs mt-1">
                    Chiziqli molekulada rotatsiya darajasi 2 ta (chiziqsizda 3
                    ta).
                  </p>
                </div>
                <div className="bg-sky-900/20 border border-sky-700/40 rounded-lg p-3">
                  <p className="text-sky-300 font-bold text-sm mb-1">
                    2. D∞h simmetriya turlari
                  </p>
                  <p className="text-purple-200 text-xs font-mono">
                    Σg⁺, Σg⁻, Πg, Δg (Raman) + Σᵤ⁺, Σᵤ⁻, Πᵤ, Δᵤ (IQ)
                  </p>
                </div>
                <div className="bg-sky-900/20 border border-sky-700/40 rounded-lg p-3">
                  <p className="text-sky-300 font-bold text-sm mb-1">
                    3. Ag–N skelet modalari
                  </p>
                  <p className="text-purple-200 text-xs">
                    νₛ(Σg⁺): 375 sm⁻¹ Raman; νₐₛ(Σᵤ⁺): 495 sm⁻¹ IQ; δ(Πᵤ): 215
                    IQ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-200 text-sm">
              <strong className="text-orange-300">
                ⚡ Mutual Exclusion (alternativ taqiq) qoidasi — [Ag(NH₃)₂]⁺
                NAMUNAVIY MISOL:
              </strong>{" "}
              Ag markazida joylashgan inversiya markazi tufayli hech qaysi
              skelet moda bir vaqtda ham IQ, ham Raman faol bo'la olmaydi.
              νₛ(Ag–N) faqat Ramanda (375), νₐₛ(Ag–N) faqat IQ da (495). Bu 120
              sm⁻¹ farq — ikki spektroskopiyaning bir-birini to'ldiruvchi
              ("komplementar") xarakterining eng aniq isbotidir. Sisplatinning
              cis va trans izomerlarini farqlash uchun ham xuddi shu prinsip
              qo'llaniladi.
            </p>
          </div>
        </div>

        {/* ═══════════ 4. INTERAKTIV RAMAN SPEKTR ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈</span> Interaktiv Raman spektri — batafsil izohlar bilan
          </h2>

          <p className="text-purple-200 leading-relaxed">
            Quyidagi spektr{" "}
            <strong className="text-sky-400">
              Lorentzian shakl funksiyasi
            </strong>{" "}
            asosida simulyatsiya qilingan (0.1 M suvli eritma, 532 nm lazer).
            Slayderni harakatlantiring yoki cho'qqilarni bosing — barcha nazariy
            izohlar avtomatik ko'rsatiladi.
          </p>

          {/* Slayder */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <label className="block text-sky-400 font-bold mb-2">
              Raman siljish:{" "}
              <span className="font-mono text-2xl">{freqSlider}</span> sm⁻¹
            </label>
            <input
              type="range"
              min="100"
              max="3600"
              value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>100 (uzoq)</span>
              <span>500</span>
              <span>1000</span>
              <span>2000</span>
              <span>3600 (N–H)</span>
            </div>
          </div>

          {/* Joriy cho'qqi ma'lumoti */}
          <div className="bg-gradient-to-r from-sky-900/30 to-purple-900/30 border-2 border-sky-500/40 rounded-xl p-5">
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
              <div>
                <span className="text-xs text-purple-400 uppercase">
                  Eng yaqin cho'qqi:
                </span>
                <div className="text-3xl font-mono font-bold text-sky-400">
                  {currentPeak.freq} sm⁻¹
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-purple-400 uppercase">Zona:</span>
                <div className="text-sm text-orange-300 font-semibold">
                  {currentPeak.region}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">
                  Tayinlash
                </div>
                <div className="text-sky-300 font-mono font-bold text-sm">
                  {currentPeak.assignment}
                </div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">
                  Intensivlik
                </div>
                <div className="text-white font-mono font-bold text-sm">
                  {currentPeak.intensity}
                </div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">
                  Simmetriya
                </div>
                <div className="text-orange-300 font-mono font-bold text-sm">
                  {currentPeak.symmetry.split(" ")[0]}
                </div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">
                  Kuch konstanta
                </div>
                <div className="text-orange-300 font-mono font-bold text-sm">
                  {currentPeak.forceConstant}
                </div>
              </div>
            </div>
            <div className="bg-purple-950/60 rounded-lg p-4 mb-3">
              <div className="text-sky-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Nazariy izoh:
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                {currentPeak.theoryNote}
              </p>
            </div>
            {currentPeak.freeLigand !== "—" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                <div className="bg-purple-900/40 border border-purple-700/40 rounded p-3">
                  <div className="text-purple-300 text-[10px] uppercase font-bold mb-1">
                    Erkin ligand
                  </div>
                  <p className="text-purple-200 text-xs">
                    {currentPeak.freeLigand}
                  </p>
                </div>
                <div className="bg-orange-900/20 border border-orange-700/40 rounded p-3">
                  <div className="text-orange-300 text-[10px] uppercase font-bold mb-1">
                    Koordinatsiya siljishi
                  </div>
                  <p className="text-purple-200 text-xs">
                    {currentPeak.coordShift}
                  </p>
                </div>
              </div>
            )}
            {currentPeak.diagnostic && (
              <div className="mt-3 bg-sky-600/20 border border-sky-500/40 rounded p-3">
                <p className="text-sky-200 text-xs font-semibold">
                  💎 {currentPeak.diagnostic}
                </p>
              </div>
            )}
          </div>

          {/* SVG spektr grafigi */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <div className="text-xs text-purple-400 mb-2 flex items-center justify-between">
              <span>
                Raman spektri — Lorentzian simulyatsiya (0.1 M suvli eritma, 532
                nm)
              </span>
              <span className="font-mono">100 — 3600 sm⁻¹</span>
            </div>
            <svg viewBox="0 0 800 320" className="w-full h-auto">
              {/* Y grid */}
              {[0, 20, 40, 60, 80, 100].map((v, i) => {
                const gy = 250 - (v / 100) * 220;
                return (
                  <g key={i}>
                    <line
                      x1="60"
                      y1={gy}
                      x2="770"
                      y2={gy}
                      stroke="#3b3470"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                    />
                    <text
                      x="52"
                      y={gy + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#a78bfa"
                    >
                      {v}
                    </text>
                  </g>
                );
              })}
              <text
                x="20"
                y="140"
                textAnchor="middle"
                fontSize="11"
                fill="#38bdf8"
                transform="rotate(-90, 20, 140)"
                fontWeight="bold"
              >
                Raman intensivlik (a.u.)
              </text>

              {/* X grid */}
              {[3600, 3000, 2400, 1800, 1500, 1200, 900, 600, 300, 100].map(
                (f, i) => {
                  const gx = 60 + ((3600 - f) / 3500) * 710;
                  return (
                    <g key={i}>
                      <line
                        x1={gx}
                        y1="30"
                        x2={gx}
                        y2="250"
                        stroke="#3b3470"
                        strokeWidth="0.5"
                        strokeDasharray="2,2"
                      />
                      <text
                        x={gx}
                        y="275"
                        textAnchor="middle"
                        fontSize="9"
                        fill="#a78bfa"
                      >
                        {f}
                      </text>
                    </g>
                  );
                },
              )}
              <text
                x="415"
                y="295"
                textAnchor="middle"
                fontSize="11"
                fill="#38bdf8"
                fontWeight="bold"
              >
                Raman siljish (sm⁻¹)
              </text>

              {/* Zonalar */}
              <rect
                x={60 + ((3600 - 3400) / 3500) * 710}
                y="30"
                width={((3400 - 3100) / 3500) * 710}
                height="220"
                fill="#38bdf8"
                opacity="0.06"
              />
              <rect
                x={60 + ((3600 - 1700) / 3500) * 710}
                y="30"
                width={((1700 - 1200) / 3500) * 710}
                height="220"
                fill="#c084fc"
                opacity="0.06"
              />
              <rect
                x={60 + ((3600 - 600) / 3500) * 710}
                y="30"
                width={((600 - 100) / 3500) * 710}
                height="220"
                fill="#fb923c"
                opacity="0.06"
              />

              <text
                x={60 + ((3600 - 3250) / 3500) * 710}
                y="45"
                fontSize="8"
                fill="#38bdf8"
                textAnchor="middle"
                fontWeight="bold"
              >
                N–H zonasi
              </text>
              <text
                x={60 + ((3600 - 1450) / 3500) * 710}
                y="45"
                fontSize="8"
                fill="#c084fc"
                textAnchor="middle"
                fontWeight="bold"
              >
                δ(NH₃) zonasi
              </text>
              <text
                x={60 + ((3600 - 350) / 3500) * 710}
                y="45"
                fontSize="8"
                fill="#fb923c"
                textAnchor="middle"
                fontWeight="bold"
              >
                Ag–N zonasi
              </text>

              {/* Spektr chizig'i (Lorentzian, YUQORIGA cho'qqilar) */}
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                points={(() => {
                  const pts = [];
                  for (let f = 3600; f >= 100; f -= 8) {
                    let I = 0.02;
                    ramanPeaks.forEach((p) => {
                      const sigma =
                        p.freq > 2000 ? 22 : p.freq > 1000 ? 16 : 11;
                      I +=
                        p.absorbance *
                        Math.exp(
                          -Math.pow(f - p.freq, 2) / (2 * sigma * sigma),
                        );
                    });
                    I = Math.min(I, 1.0);
                    const x = 60 + ((3600 - f) / 3500) * 710;
                    const y = 250 - I * 220;
                    pts.push(`${x},${y}`);
                  }
                  return pts.join(" ");
                })()}
              />

              {/* Slayder markeri */}
              <line
                x1={60 + ((3600 - freqSlider) / 3500) * 710}
                y1="30"
                x2={60 + ((3600 - freqSlider) / 3500) * 710}
                y2="250"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4,2"
              />

              {/* Cho'qqi markerlari */}
              {ramanPeaks.map((peak, i) => {
                const x = 60 + ((3600 - peak.freq) / 3500) * 710;
                const y = 250 - peak.absorbance * 220;
                const isActive =
                  currentPeak.freq === peak.freq || activePeak === i;
                return (
                  <g
                    key={i}
                    onClick={() => {
                      setActivePeak(i);
                      setFreqSlider(peak.freq);
                    }}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 8 : 5}
                      fill={isActive ? "#fb923c" : "#38bdf8"}
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                    {isActive && (
                      <>
                        <line
                          x1={x}
                          y1={y}
                          x2={x}
                          y2={y - 25}
                          stroke="#fb923c"
                          strokeWidth="1"
                          strokeDasharray="1,1"
                        />
                        <rect
                          x={x - 35}
                          y={y - 50}
                          width="70"
                          height="22"
                          rx="3"
                          fill="#1e1a3a"
                          stroke="#fb923c"
                          strokeWidth="1"
                        />
                        <text
                          x={x}
                          y={y - 38}
                          textAnchor="middle"
                          fontSize="8"
                          fill="#fb923c"
                          fontWeight="bold"
                        >
                          {peak.freq} sm⁻¹
                        </text>
                        <text
                          x={x}
                          y={y - 30}
                          textAnchor="middle"
                          fontSize="7"
                          fill="#a78bfa"
                        >
                          {peak.assignment}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Cho'qqi tugmalari */}
          <div className="flex flex-wrap gap-2">
            {ramanPeaks.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setActivePeak(i);
                  setFreqSlider(p.freq);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                  currentPeak.freq === p.freq
                    ? "border-orange-400 bg-orange-900/40 shadow-lg shadow-orange-500/20"
                    : "border-sky-400/40 bg-sky-900/10 hover:border-sky-400/60"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${currentPeak.freq === p.freq ? "bg-orange-400" : "bg-sky-400"}`}
                />
                <span className="font-mono text-sky-300 font-bold">
                  {p.freq}
                </span>
                <span className="text-purple-400">
                  {p.assignment.replace(/<[^>]*>/g, "")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════ 5. CHO'QQILAR JADVALI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📊</span> Raman cho'qqilari jadvali — batafsil tayinlash
          </h2>
          <p className="text-purple-200 text-sm">
            9 ta asosiy Raman polosasi, ular uchun aniq chastota, tayinlash,
            simmetriya, kuch konstantasi va erkin ligand bilan taqqoslash.
            Cho'qqilarni bosib, interaktiv izohlarni ochishingiz mumkin.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    ν̃ (sm⁻¹)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Tayinlash
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Tavsif
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Simmetriya
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    k (mdyn/Å)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Intensivlik
                  </th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {ramanPeaks.map((p, i) => (
                  <tr
                    key={i}
                    onClick={() => {
                      setActivePeak(i);
                      setFreqSlider(p.freq);
                    }}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer transition-colors ${
                      currentPeak.freq === p.freq ? "bg-sky-900/20" : ""
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-sky-400">
                      {p.freq}
                    </td>
                    <td className="py-3 px-3 font-mono text-orange-300 text-xs">
                      {p.assignment}
                    </td>
                    <td className="py-3 px-3 text-xs">{p.assignment_uz}</td>
                    <td className="py-3 px-3 font-mono text-purple-300 text-xs">
                      {p.symmetry.split(" ")[0]}
                    </td>
                    <td className="py-3 px-3 font-mono text-orange-300">
                      {p.forceConstant}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          p.intensityCode === 4
                            ? "bg-red-600/40 text-red-300"
                            : p.intensityCode === 3
                              ? "bg-orange-600/40 text-orange-300"
                              : p.intensityCode === 2
                                ? "bg-yellow-600/40 text-yellow-300"
                                : "bg-green-600/40 text-green-300"
                        }`}
                      >
                        {p.intensity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Diagnostik cho'qqilar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
              <div className="text-orange-400 font-bold text-sm mb-2">
                🔥 νₛ(Ag–N) (375)
              </div>
              <p className="text-purple-200 text-xs">
                Σg⁺ — faqat Ramanda. Chiziqli D∞h ning bevosita isboti. Mutual
                exclusion namoyishi.
              </p>
            </div>
            <div className="bg-sky-900/20 border border-sky-500/30 rounded-xl p-4">
              <div className="text-sky-400 font-bold text-sm mb-2">
                🌟 Umbrella δₛ(NH₃) (1258)
              </div>
              <p className="text-purple-200 text-xs">
                Erkin NH₃ (950) dan +308 sm⁻¹ yuqoriga siljigan — ammin
                koordinatsiyasining eng aniq belgisi.
              </p>
            </div>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
              <div className="text-purple-400 font-bold text-sm mb-2">
                🎯 νₛ(N–H) (3220)
              </div>
              <p className="text-purple-200 text-xs">
                Koordinatsion NH₃ ligandining N–H simmetrik cho'zilishi. Erkin
                NH₃ (3337) dan −117 pastroq.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 6. GURUH NAZARIYASI — D∞h ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔷</span> Guruh nazariyasi tahlili — D∞h simmetriyasi
          </h2>
          <p className="text-purple-200 text-sm leading-relaxed">
            [Ag(NH₃)₂]⁺ ideal chiziqli kompleksi{" "}
            <strong className="text-sky-400">D∞h nuqtaviy guruhga</strong>{" "}
            tegishli (cheksiz tartib — chiziqli guruh). Simmetriya
            operatsiyalari:{" "}
            <span className="font-mono text-orange-300 text-xs">
              E, 2C∞φ, ∞σᵥ, i, 2S∞φ, ∞C₂
            </span>
            . Eritmada solvatatsiya tufayli simmetriya C₂v ga tushishi mumkin.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sky-400 font-bold mb-3">
                Normal tebranish modalari
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-orange-300 text-xs font-bold uppercase mb-1">
                    Umumiy modalar (chiziqli)
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2">
                    3N−5 = 3(9)−5 = 22
                  </div>
                </div>
                <div>
                  <div className="text-orange-300 text-xs font-bold uppercase mb-1">
                    Skelet Ag–N modalar
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">
                    Σg⁺ (Raman) + Σᵤ⁺ (IQ) + Πᵤ (IQ)
                  </div>
                </div>
                <div>
                  <div className="text-orange-300 text-xs font-bold uppercase mb-1">
                    νₛ(Ag–N) — diagnostika
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">
                    Σg⁺: 375 sm⁻¹ (faqat Raman)
                  </div>
                </div>
                <div>
                  <div className="text-orange-300 text-xs font-bold uppercase mb-1">
                    Umbrella δₛ(NH₃)
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">
                    A₁ (lokal C₃v): 1258 sm⁻¹, kuchli Raman
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sky-400 font-bold mb-3">
                Faollik jadvali (skelet)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 bg-sky-900/20 rounded-lg p-3 border border-sky-700/30">
                  <div className="w-3 h-3 bg-sky-400 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sky-400 font-bold text-xs">
                      Raman faol (gerade)
                    </div>
                    <div className="text-purple-200 text-xs font-mono">
                      Σg⁺ (νₛ Ag–N) — 1 skelet moda
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-orange-900/20 rounded-lg p-3 border border-orange-700/30">
                  <div className="w-3 h-3 bg-orange-400 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-orange-400 font-bold text-xs">
                      IQ faol (ungerade)
                    </div>
                    <div className="text-purple-200 text-xs font-mono">
                      Σᵤ⁺ (νₐₛ) + Πᵤ (δ) — 2 skelet moda
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-900/20 rounded-lg p-3 border border-gray-700/30">
                  <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-gray-400 font-bold text-xs">
                      Silent modalar
                    </div>
                    <div className="text-purple-200 text-xs font-mono">
                      Πg (agar mavjud bo'lsa)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-5">
            <p className="text-sky-200 text-sm">
              <strong className="text-sky-300">
                ⚡ Mutual Exclusion — [Ag(NH₃)₂]⁺ NAMUNAVIY MISOL:
              </strong>{" "}
              D∞h da inversiya markazi Ag ustida joylashgan →
              <strong className="text-orange-300">
                {" "}
                νₛ(Ag–N) faqat Ramanda (375 sm⁻¹, Σg⁺)
              </strong>
              ,
              <strong className="text-orange-300">
                {" "}
                νₐₛ(Ag–N) faqat IQ da (495 sm⁻¹, Σᵤ⁺)
              </strong>
              . 120 sm⁻¹ farq — ikki spektroskopiyaning bir-birini to'ldiruvchi
              ("komplementar") xarakterining eng aniq isbotidir.
            </p>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-200 text-sm">
              <strong className="text-orange-300">
                🔬 Chiziqli struktura Raman orqali isboti:
              </strong>{" "}
              Agar [Ag(NH₃)₂]⁺ chiziqli bo'lmaganda (masalan, egilgan yoki
              tetraedrik) — mutual exclusion buzilib, ν(Ag–N) polosalari HAM
              Raman, HAM IQ da faol bo'lardi. Ammo eksperimentda 375 sm⁻¹ faqat
              Ramanda, 495 sm⁻¹ esa faqat IQ da — bu D∞h chiziqli geometriyaning
              tebranish darajasidagi to'liq tasdig'idir. Werner (1893)
              koordinatsion nazariyasi Raman spektroskopiyasi orqali kvantitativ
              tarzda tasdiqlangan.
            </p>
          </div>
        </div>

        {/* ═══════════ 7. KUCH KONSTANTASI JADVALI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💪</span> Kuch konstantasi va Hooke qonuni
          </h2>
          <p className="text-purple-200 text-sm">
            Hooke qonuni ν̃ = (1/2πc)·√(k/μ) asosida bog' kuch konstantasi (k)
            tebranish chastotasiga proporsional. Ag–N bog'ining "yumshoqligini"
            boshqa M–N va M–C bog'lari bilan taqqoslash:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">
                    Bog'
                  </th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">
                    k (mdyn/Å)
                  </th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">
                    ν̃ (sm⁻¹)
                  </th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">
                    Izoh
                  </th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {forceConstantExamples.map((f, i) => {
                  const isHighlight =
                    f.bond.includes("[Ag(NH₃)₂]⁺") || f.bond.includes("Ag–N");
                  return (
                    <tr
                      key={i}
                      className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isHighlight ? "bg-sky-900/20" : ""}`}
                    >
                      <td
                        className={`py-3 px-4 font-mono ${isHighlight ? "text-sky-300 font-bold" : "text-orange-300"}`}
                      >
                        {f.bond}
                      </td>
                      <td className="py-3 px-4 font-mono text-orange-300">
                        {f.k}
                      </td>
                      <td className="py-3 px-4 font-mono text-sky-400">
                        {f.freq}
                      </td>
                      <td className="py-3 px-4 text-xs">{f.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
            <p className="text-green-200 text-sm">
              <strong className="text-green-300">
                Xulosa — Ag–N bog'i eng yumshoq:
              </strong>{" "}
              k(Ag–N) = 1.48 mdyn/Å — Cu–N (1.70), Au–N (1.95), Co–N (1.85),
              Fe–C(CN) (2.10) va Ni–C(CN) (2.85) dan sezilarli zaifroq. Bu Ag(I)
              ning quyidagi xususiyatlarini tushuntiradi:
              <br />• <strong>Ligand-labillik</strong> — NH₃ ↔ H₂O tez
              almashinuvi (SN₁ mexanizmi, kᵣ ≈ 10⁸ s⁻¹)
              <br />• <strong>Nozik koordinatsiya</strong> — Cl⁻ (ν(Ag–Cl) 240),
              SCN⁻, S₂O₃²⁻ ga oson o'tadi
              <br />• <strong>Fotografik jarayonlar</strong> — AgBr da Ag⁻N
              koordinatsiyasi asosida "fixing"
              <br />• <strong>Ag/Au farqi</strong> — Au(I) relativistik effekt
              tufayli mustahkamroq (k=1.95)
            </p>
          </div>
        </div>

        {/* ═══════════ 8. d¹⁰ CHIZIQLI QATORI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚖️</span> d¹⁰ chiziqli komplekslar qatori — [M(NH₃)₂]ⁿ⁺
          </h2>
          <p className="text-purple-200 leading-relaxed">
            Cu⁺, Ag⁺, Au⁺ va Hg²⁺ — barchasi d¹⁰ konfiguratsiya, s-orbital bo'sh
            (5s⁰), koordinatsion son 2 (chiziqli, sp gibrid). ν(M–N)
            chastotalari orbital kattaligi va relativistik effektlar bilan
            bog'liq:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Kompleks
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    M(n+)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    d config
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    νₛ(M–N)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    νₐₛ(M–N)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    d(M–N) Å
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Xususiyat
                  </th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {d10Series.map((m, i) => (
                  <tr
                    key={i}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${m.current ? "bg-sky-900/30 border-l-4 border-l-sky-400" : ""}`}
                  >
                    <td
                      className={`py-3 px-3 font-mono ${m.current ? "text-sky-300 font-bold" : "text-orange-300"}`}
                    >
                      {m.formula}
                    </td>
                    <td className="py-3 px-3 text-xs">{m.metal}</td>
                    <td className="py-3 px-3 text-xs font-mono">{m.dConfig}</td>
                    <td className="py-3 px-3 font-mono text-sky-400 font-bold">
                      {m.nuMLSym}
                    </td>
                    <td className="py-3 px-3 font-mono text-purple-300">
                      {m.nuMLAsym}
                    </td>
                    <td className="py-3 px-3 font-mono text-orange-300">
                      {m.bondL}
                    </td>
                    <td className="py-3 px-3 text-xs">{m.stability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-sky-900/20 border border-sky-500/30 rounded-xl p-5">
              <h3 className="text-sky-300 font-bold mb-2 text-sm">
                📊 M–N chastotalari tahlili
              </h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Cu (405) → Ag (375) → Au (430) sm⁻¹. Ag ning eng past qiymati 4d
                ↔ 5s energetik farqi va katta radius (2.11 Å) bilan izohlanadi.
                Au esa <strong>relativistik effekt</strong> tufayli 6s orbital
                keskin kontraktsiyalanadi (~15% qisqaradi) va Au–N bog'i
                mustahkamlashadi. Bu "relativistik anomaliya" ni Raman
                spektroskopiya to'g'ridan-to'g'ri qayd etadi.
              </p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-300 font-bold mb-2 text-sm">
                🔬 Mutual exclusion barcha d¹⁰ da
              </h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Barcha [M(NH₃)₂]ⁿ⁺ komplekslarida D∞h simmetriya va inversiya
                markazi mavjud — shu bois mutual exclusion universal amal
                qiladi. νₛ (Σg⁺) faqat Ramanda, νₐₛ (Σᵤ⁺) faqat IQ da. Bu qoida
                ionli va kovalent aralash M–N bog'lanishlar uchun ham to'g'ri.
                Cu(I) da esa disproportsion (2Cu⁺ ↔ Cu²⁺ + Cu⁰) tufayli ba'zi
                qo'shimcha polosalar paydo bo'lishi mumkin.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 9. BJERRUM MUVOZANATLARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚛️</span> Bjerrum muvozanatlari — Ag(I)/NH₃ sistemasi (1941)
          </h2>
          <p className="text-purple-200 leading-relaxed">
            Jannik Bjerrum (Kopengagen, 1941) o'zining klassik "Metal Ammine
            Formation" tadqiqotida Ag⁺/NH₃ muvozanat konstantalarini aniq
            o'lchagan. [Ag(NH₃)₂]⁺ eng barqaror va dominant tur (log β₂ = 7.05).
            Har bir turning Raman νₛ(Ag–N) chastotasi farq qiladi, bu esa
            in-situ turlar taqsimotini o'rganish imkonini beradi:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Tur
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Nomi
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Geometriya
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    log K
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    νₛ (sm⁻¹)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Dominant sharti
                  </th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {bjerrumSeries.map((b, i) => (
                  <tr
                    key={i}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${b.current ? "bg-sky-900/30 border-l-4 border-l-sky-400" : ""}`}
                  >
                    <td
                      className={`py-3 px-3 font-mono ${b.current ? "text-sky-300 font-bold" : "text-orange-300"}`}
                    >
                      {b.formula}
                    </td>
                    <td className="py-3 px-3 text-xs">{b.trad}</td>
                    <td className="py-3 px-3 text-xs">{b.geom}</td>
                    <td className="py-3 px-3 font-mono text-orange-300 text-xs">
                      {b.logK}
                    </td>
                    <td className="py-3 px-3 font-mono text-sky-400 font-bold">
                      {b.nuAgN || b.nuAgO}
                    </td>
                    <td className="py-3 px-3 text-xs">{b.dominant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-sky-400 font-bold mb-3">
              🎯 Umumiy muvozanat va Raman monitoring
            </h3>
            <div className="bg-purple-950/60 rounded-lg p-3 font-mono text-sm text-sky-300 text-center my-3">
              Ag⁺ + NH₃ ⇌ [Ag(NH₃)]⁺ &nbsp;&nbsp; K₁ = 10³·³¹
              <br />
              [Ag(NH₃)]⁺ + NH₃ ⇌ [Ag(NH₃)₂]⁺ &nbsp;&nbsp; K₂ = 10³·⁷⁴
              <br />
              <span className="text-orange-300">
                Umumiy: Ag⁺ + 2NH₃ ⇌ [Ag(NH₃)₂]⁺ &nbsp;&nbsp; β₂ = K₁·K₂ =
                10⁷·⁰⁵
              </span>
            </div>
            <p className="text-purple-200 text-xs">
              <strong className="text-sky-300">Amaliy ahamiyat:</strong> log β₂
              = 7.05 shuni bildiradiki, 0.1 M NH₃ da (pH ≈ 11.5) Ag⁺ ning 99.9%
              dan ortig'i [Ag(NH₃)₂]⁺ shaklida bo'ladi. Bu esa AgCl (Ksp =
              10⁻¹⁰) va AgBr (Ksp = 10⁻¹³) larni ammiakli eritmada erishga imkon
              beradi — fotografiya, kumush qayta ishlash va analitik kimyoning
              asosi.
            </p>
          </div>
        </div>

        {/* ═══════════ 10. NAMUNA TAYYORLASH USULLARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔬</span> Namuna tayyorlash usullari
          </h2>
          <p className="text-purple-200 text-sm">
            [Ag(NH₃)₂]⁺ Raman spektroskopiyasi uchun 4 ta asosiy texnika mavjud.
            Suvli eritma standart, kristall — aniq skelet, SERS — Ag ning noyob
            xususiyati.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {techniques.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  activeTechnique === i
                    ? "bg-sky-600/60 text-white border-sky-400/50 shadow-lg shadow-sky-500/20"
                    : "bg-purple-800/30 text-purple-400 border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-sky-400 font-bold text-lg mb-2">
              {techniques[activeTechnique].name}
            </h3>
            <p className="text-purple-200 text-sm mb-4 italic">
              {techniques[activeTechnique].description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2 text-sm">
                  ✓ Afzalliklar
                </h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {techniques[activeTechnique].advantages.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2 text-sm">
                  ✗ Kamchiliklar
                </h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {techniques[activeTechnique].disadvantages.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">
                  Chastota
                </div>
                <div className="text-white text-xs font-mono mt-1">
                  {techniques[activeTechnique].freqRange}
                </div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">
                  Ruxsat
                </div>
                <div className="text-white text-xs font-mono mt-1">
                  {techniques[activeTechnique].resolution}
                </div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">
                  Vaqt
                </div>
                <div className="text-white text-xs mt-1">
                  {techniques[activeTechnique].samplePrep}
                </div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">
                  Eng yaxshi
                </div>
                <div className="text-white text-xs mt-1">
                  {techniques[activeTechnique].bestFor}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ 11. HALAQIT OMILLARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚠️</span> Raman tahliliga halaqit beruvchi omillar
          </h2>
          <div className="bg-red-900/20 border-2 border-red-500/50 rounded-xl p-4 mb-4">
            <p className="text-red-200 text-sm">
              <strong className="text-red-300">🚨 XAVFSIZLIK OGOHLIGI:</strong>{" "}
              Tollens reaktivi uzoq turishida{" "}
              <strong>Ag₃N (kumush azid)</strong> hosil qilishi mumkin — bu
              portlash xavfli birikma! Har o'lchashdan oldin yangi eritma
              tayyorlash va foydalanishdan keyin darhol razb. HCl bilan
              zararsizlantirish shart.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">
                    Manba
                  </th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">
                    Ta'sir sohasi
                  </th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">
                    Ta'sir
                  </th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">
                    Jiddiylik
                  </th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {interferences.map((iv, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${activeInterference === i ? "bg-sky-900/20" : ""}`}
                  >
                    <td className="py-3 px-4 font-bold text-xs">{iv.source}</td>
                    <td className="py-3 px-4 font-mono text-orange-300 text-xs">
                      {iv.freqRange}
                    </td>
                    <td className="py-3 px-4 text-xs">{iv.effect}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          iv.severity.includes("Yuqori")
                            ? "bg-red-600/40 text-red-300"
                            : iv.severity.includes("O'rta")
                              ? "bg-orange-600/40 text-orange-300"
                              : "bg-green-600/40 text-green-300"
                        }`}
                      >
                        {iv.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-5">
            <div className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>💡</span> Tanlangan omilning yechimi:{" "}
              {interferences[activeInterference].source}
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {interferences[activeInterference].solution}
            </p>
          </div>
        </div>

        {/* ═══════════ 12. TARIXIY KONTEKST ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📜</span> Tollens reaktivi — tarixiy kashfiyot va zamonaviy
            ilovalar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-5">
              <div className="text-orange-400 font-bold mb-2 text-sm">
                🔬 1882 — Bernhard Tollens
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Bernhard Tollens</strong> (Göttingen) ammiakli kumush
                nitrat eritmasini kashf etib, uni aldegidlarni aniqlash uchun
                sinov reaksiyasi sifatida taklif etdi. Aldegidlar [Ag(NH₃)₂]⁺ ni
                Ag⁰ ga qaytarib, sinov idishida <em>"kumush ko'zgu"</em> hosil
                qiladi. <em>Ber. Dtsch. Chem. Ges.</em> 15, 1635 (1882). Bu
                reaksiya organik kimyo darsligining klassik namunasi bo'lib
                qoldi.
              </p>
            </div>
            <div className="bg-sky-900/20 border border-sky-500/30 rounded-xl p-5">
              <div className="text-sky-400 font-bold mb-2 text-sm">
                🥉 1893 — Alfred Werner
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Alfred Werner</strong> (Zürix) o'zining koordinatsion
                nazariyasida [Ag(NH₃)₂]⁺ ni chiziqli 2-koordinatsion
                kompleksning oddiy va aniq namunasi sifatida keltirdi. Bu Werner
                ning ichki/tashqi sfera va koordinatsion son tushunchalarini
                isbotlash uchun asosiy dalillardan biri edi. Werner 1913-yilda
                Nobel kimyo mukofotini oldi.
              </p>
            </div>
            <div className="bg-purple-800/30 border border-purple-500/30 rounded-xl p-5">
              <div className="text-purple-400 font-bold mb-2 text-sm">
                🧪 1941 — Jannik Bjerrum
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Jannik Bjerrum</strong> (Kopengagen) o'zining
                fundamental ishida{" "}
                <em>"Metal Ammine Formation in Aqueous Solution"</em> Ag⁺/NH₃ va
                boshqa metall-amin muvozanatlarini kvantitativ o'lchagan. log β₂
                = 7.05 qiymati bu ishdan olingan. Bu koordinatsion kimyoning
                termodinamikasi uchun asosiy adabiyot bo'lib qoldi.
              </p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5">
              <div className="text-green-400 font-bold mb-2 text-sm">
                🌟 Zamonaviy ilovalar (2020-2026)
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                • <strong>SERS biosensorlar</strong>: [Ag(NH₃)₂]⁺ Ag nanozarra
                sintezining prekursori
                <br />• <strong>Elektronika sanoati</strong>: kumush nano-inklar
                (printable electronics)
                <br />• <strong>Antibakterial materiallar</strong>: kumush
                nano-jamlarda
                <br />• <strong>Fotografiya kimyosi</strong>: AgBr fixing
                jarayonlari
                <br />• <strong>Organik kimyoda</strong>: aldegid ↔ ketona
                differentiation
                <br />• <strong>Ko'zgu ishlab chiqarish</strong>: kumush ko'zgu
                reaksiyasi
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 13. TOLLENS REAKSIYASI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🪞</span> Tollens reaksiyasi — Kumush ko'zgusi
          </h2>
          <p className="text-purple-200 text-sm">
            [Ag(NH₃)₂]⁺ organik aldegidlar bilan reaksiyaga kirishib, metall
            kumushni cho'ktiradi. Bu{" "}
            <strong>aldegidlarning klassik sifat sinovi</strong>.
          </p>

          <div className="bg-gradient-to-r from-orange-900/20 to-sky-900/20 border border-orange-500/30 rounded-xl p-5">
            <h3 className="text-orange-300 font-bold mb-3">
              📐 Reaksiya tenglamalari
            </h3>
            <div className="bg-purple-950/60 rounded-lg p-4 font-mono text-sm space-y-2 text-purple-200">
              <div>
                <span className="text-sky-300">
                  Tollens reagentini tayyorlash:
                </span>
              </div>
              <div className="pl-4">AgNO₃ + NH₄OH → AgOH↓ + NH₄NO₃</div>
              <div className="pl-4">AgOH + 2NH₃ → [Ag(NH₃)₂]⁺ + OH⁻</div>
              <div className="mt-3">
                <span className="text-orange-300">
                  Aldegid bilan reaksiya (kumush ko'zgusi):
                </span>
              </div>
              <div className="pl-4">RCHO + 2[Ag(NH₃)₂]⁺ + 2OH⁻ →</div>
              <div className="pl-8 text-sky-300">
                RCOO⁻ + 2Ag⁰↓ + 4NH₃ + H₂O
              </div>
              <div className="mt-3">
                <span className="text-red-300">
                  ⚠ Eskirgan reagent (portlash xavfi):
                </span>
              </div>
              <div className="pl-4">3[Ag(NH₃)₂]⁺ → Ag₃N + 5NH₃ + NH₄⁺</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
              <div className="text-green-400 font-bold text-sm mb-2">
                ✓ Musbat sinov
              </div>
              <p className="text-purple-200 text-xs">
                Aldegidlar (RCHO), glyukoza, formikat: kumush ko'zgu hosil
                bo'ladi.
              </p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-bold text-sm mb-2">
                ✗ Manfiy sinov
              </div>
              <p className="text-purple-200 text-xs">
                Ketonalar (RCOR'), spirtlar, karboksilik kislotalar: reaksiya
                bo'lmaydi.
              </p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
              <div className="text-orange-400 font-bold text-sm mb-2">
                ⚡ Raman kuzatuv
              </div>
              <p className="text-purple-200 text-xs">
                Reaksiya davomida ν(Ag–N) 375 sm⁻¹ chastotasi asta-sekin
                susayadi, Ag⁰ hosil bo'lganda esa yo'qoladi.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 14. XULOSA ═══════════ */}
        <div className="bg-gradient-to-r from-sky-600/10 to-purple-600/10 border border-sky-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✅</span> Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li className="pl-2">
              <strong className="text-sky-400">νₛ(Ag–N) = 375 sm⁻¹</strong> —
              Σg⁺ simmetriya, faqat Ramanda faol. Chiziqli D∞h geometriyaning
              bevosita isboti va mutual exclusion namoyishi
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">νₐₛ(Ag–N) = 495 sm⁻¹</strong> —
              Σᵤ⁺ simmetriya, faqat IQ da faol. Bu 120 sm⁻¹ farq ikki
              spektroskopiyaning komplementarligining aniq isbotidir
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">
                δₛ(NH₃) umbrella = 1258 sm⁻¹
              </strong>{" "}
              — erkin NH₃ (950) dan +308 sm⁻¹ yuqoriga siljigan. Ammin
              koordinatsiyasining eng aniq universal diagnostik cho'qqisi
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">D∞h + Mutual Exclusion</strong> —
              Werner (1893) koordinatsion nazariyasining Raman spektroskopiya
              orqali kvantitativ tasdiqi
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">k(Ag–N) = 1.48 mdyn/Å</strong> —
              d¹⁰ komplekslar ichida eng yumshoq bog'. Ligand-labillik va SN₁
              almashinuv kinetikasini tushuntiradi
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">d¹⁰ qatori</strong>: Cu(405) →
              Ag(375) → Au(430) sm⁻¹ — Au ning yuqori qiymati relativistik
              effektning bevosita ko'rsatkichi
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">Bjerrum muvozanati</strong>: log
              β₂ = 7.05, [Ag(NH₃)₂]⁺ dominant tur. In-situ Raman turlar
              taqsimotini kuzatishga imkon beradi
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">⚠️ Ag₃N portlash xavfi</strong> —
              Tollens reaktivini uzoq saqlamaslik va foydalangandan keyin razb.
              HCl bilan zararsizlantirish shart
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">SERS uchun UNIKAL holat</strong>:
              [Ag(NH₃)₂]⁺ ning o'zi kumush nanozarralar prekursoridir — 10⁻⁹ M
              biosensorlar uchun ideal
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">
                Tollens (1882) va Werner (1893)
              </strong>{" "}
              ning tarixiy ishlari Raman spektroskopiya tebranish darajasida
              to'liq tasdiqlanadi
            </li>
          </ol>
        </div>

        {/* ═══════════ NAVIGATSIYA ═══════════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link
            href="/ilmiy/tahlil/raman/birikmalar"
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all"
          >
            ← Birikmalar ro'yxati
          </Link>
          <button
            onClick={() => setPdfModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-500/20"
          >
            📄 PDF Hisobot yaratish
          </button>
          <Link
            href="/ilmiy/tahlil/raman/birikmalar/co-cl4"
            className="px-6 py-3 bg-sky-600/80 rounded-xl hover:bg-sky-500 text-white font-semibold transition-all"
          >
            [CoCl₄]²⁻ →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>
            © 2026 JDA-Kimyo • [Ag(NH₃)₂]⁺ (Tollens reaktivi) • Raman
            spektroskopiya moduli (premium)
          </p>
          <p className="mt-2 text-purple-600">
            Manbalar: Nakamoto K. — Infrared and Raman Spectra (2009);
            Bergerhoff G. — Z. Anorg. Chem. (1964);
            <br />
            Bjerrum J. — Metal Ammine Formation (1941); Tollens B. — Ber. Dtsch.
            Chem. Ges. (1882); Werner A. (1893)
          </p>
        </div>
      </footer>
    </main>
  );
}
