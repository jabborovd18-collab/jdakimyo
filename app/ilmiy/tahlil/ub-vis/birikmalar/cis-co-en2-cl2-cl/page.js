"use client";

import Link from "next/link"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon";
import { useState, useEffect, useMemo, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   cis-[Co(en)₂Cl₂]Cl — VIOLEO — Premium UB-Vis sahifa
   d⁶ LS · Oh → C₂ᵥ · Δ/Λ optik + geometrik izomer
   Werner Nobel (1913) — cis/trans isbotlash tajribasi
   Muallif: Diyor · jdakimyo.uz · 2026
   ═══════════════════════════════════════════════════════════════════════ */

const COMPOUND = {
  formula: "cis-[Co(en)₂Cl₂]Cl",
  formulaHTML: "cis-[Co(en)<sub>2</sub>Cl<sub>2</sub>]Cl",
  iupac: "cis-dixlorobis(etilendiamin)kobalt(III) xlorid",
  commonName: "Violeo-kobalt (binafsha)",
  wernerName: "Violeo (lot. violaceus — binafsha)",
  molarMass: 285.47,
  cas: "14040-32-5",
  color: "to‘q binafsha (violet)",
  colorHex: "#7B3F99",
  colorAbsorbed: "#B8E43F", // sariq-yashil (~540 nm)
  crystalSystem: "monoklinik",
  spaceGroup: "P2₁/c",
  bondLengthCoN: 1.97, // Å
  bondLengthCoCl: 2.28, // Å
  bondAngleNCoN: 85.4, // en tishlash burchagi
  biteAngle: 85.4,
  deltaO: 22400, // cm⁻¹ (avg)
  racahB: 540, // cm⁻¹
  racahBFree: 1100,
  nephelauxetic: 0.49,
  mu_eff: 0, // diamagnetik d⁶ LS
  configuration: "t₂g⁶ eg⁰",
  termGround: "¹A₁",
  pointGroup: "C₂",
  cfse: 24.0, // Dq units × Δo
  spinState: "past spin (LS)",
  pairingEnergy: 21000,
  logK: 34.9, // umumiy barqarorlik
  logBeta2: 34.9,
  opticalRotation: 89, // [α]D for Δ-izomer
  discoveredBy: "Alfred Werner",
  discoveredYear: 1911,
  meltingPoint: 245, // dekompozitsiya
  solubilityWater: 8.4, // g/100mL 20°C
  density: 1.82,
};

// UB-Vis d-d + LMCT yo‘lakchalari (cis-izomer — C₂ᵥ simmetriya)
const uvVisPeaks = [
  {
    lambda: 540,
    epsilon: 82,
    transition: "¹A₁ → ¹B₁ (dan ¹T₁g)",
    type: "d-d",
    intensity: 3,
    description: "Birinchi d–d yo‘lakcha (simmetriya sindirilgan)",
    forbidden: "Laporte taqiq (Oh), C₂ᵥ da qisman ruxsat",
    color: "sariq-yashil yutiladi → binafsha ko‘rinadi",
  },
  {
    lambda: 610,
    epsilon: 54,
    transition: "¹A₁ → ¹A₂ (dan ¹T₁g)",
    type: "d-d",
    intensity: 2,
    description: "Ikkinchi d–d — ¹T₁g bo‘linishi natijasi",
    forbidden: "Laporte + spin ruxsat",
    color: "sariq-qizil (kichik yon yo‘lakcha)",
  },
  {
    lambda: 385,
    epsilon: 108,
    transition: "¹A₁ → ¹B₂ (dan ¹T₂g)",
    type: "d-d",
    intensity: 3,
    description: "Ikkinchi asosiy d–d yo‘lakcha",
    forbidden: "Laporte taqiq, simmetriya sinishi bilan yarim ruxsat",
    color: "binafsha yutiladi",
  },
  {
    lambda: 355,
    epsilon: 78,
    transition: "¹A₁ → ¹A₁ (dan ¹T₂g)",
    type: "d-d",
    intensity: 2,
    description: "¹T₂g bo‘linishining ikkinchi komponenti",
    forbidden: "Laporte taqiq",
    color: "UB chegara",
  },
  {
    lambda: 280,
    epsilon: 4200,
    transition: "Cl(p) → Co(d) LMCT",
    type: "LMCT",
    intensity: 4,
    description: "Cl→Co elektron o‘tishi — kuchli yutilish",
    forbidden: "To‘liq ruxsat (Laporte + spin)",
    color: "UB",
  },
  {
    lambda: 228,
    epsilon: 12500,
    transition: "en(σ) → Co(d) LMCT",
    type: "LMCT",
    intensity: 5,
    description: "en → Co elektron o‘tishi",
    forbidden: "To‘liq ruxsat",
    color: "chuqur UB",
  },
];

// UB-Vis spektri: to‘liq nuqtalar (200–800 nm)
const uvVisSpectrum = [
  { l: 200, a: 0.85 },
  { l: 210, a: 1.10 },
  { l: 220, a: 1.32 },
  { l: 228, a: 1.42 },
  { l: 240, a: 1.05 },
  { l: 260, a: 0.68 },
  { l: 280, a: 0.52 },
  { l: 300, a: 0.31 },
  { l: 320, a: 0.18 },
  { l: 340, a: 0.15 },
  { l: 355, a: 0.19 },
  { l: 370, a: 0.22 },
  { l: 385, a: 0.28 },
  { l: 400, a: 0.20 },
  { l: 420, a: 0.11 },
  { l: 450, a: 0.07 },
  { l: 480, a: 0.09 },
  { l: 500, a: 0.13 },
  { l: 520, a: 0.18 },
  { l: 540, a: 0.22 },
  { l: 560, a: 0.20 },
  { l: 580, a: 0.17 },
  { l: 610, a: 0.14 },
  { l: 640, a: 0.09 },
  { l: 680, a: 0.05 },
  { l: 720, a: 0.03 },
  { l: 780, a: 0.02 },
];

// cis vs trans qiyosiy tahlil (Werner uchun kalit)
const cisVsTrans = [
  {
    parametr: "Simmetriya guruhi",
    cis: "C₂ (optik faol)",
    trans: "D₂ₕ (optik faolsiz)",
    farq: "cis — enantiomerlar (Δ/Λ), trans — mesoform",
  },
  {
    parametr: "Rang",
    cis: "to‘q binafsha (violet)",
    trans: "yorqin yashil (praseo)",
    farq: "yutilish 540 vs 620 nm — Δ farqi",
  },
  {
    parametr: "λmax (d-d)",
    cis: "540, 385 nm",
    trans: "620, 445 nm",
    farq: "trans-da d-d qizil siljish",
  },
  {
    parametr: "εmax",
    cis: "82 M⁻¹cm⁻¹",
    trans: "34 M⁻¹cm⁻¹",
    farq: "cis-da 2,4× yuqori — simmetriya buzilishi kuchli",
  },
  {
    parametr: "Cl–Co–Cl burchagi",
    cis: "89–92°",
    trans: "180°",
    farq: "cis — qo‘shni, trans — qarama-qarshi",
  },
  {
    parametr: "N–Co–N (en tishi)",
    cis: "85,4°",
    trans: "85,2°",
    farq: "deyarli bir xil (en cheklovi)",
  },
  {
    parametr: "Dipol momenti μ",
    cis: "4,8 D",
    trans: "0 D",
    farq: "trans — markaziy simmetriya",
  },
  {
    parametr: "Δo (avg)",
    cis: "22 400 cm⁻¹",
    trans: "22 300 cm⁻¹",
    farq: "spektrokimyoviy ta’sir bir xil",
  },
  {
    parametr: "Suvda eruvchanlik",
    cis: "8,4 g/100mL",
    trans: "3,2 g/100mL",
    farq: "cis — polyar, yaxshi eriydi",
  },
  {
    parametr: "Akvatsiya tezligi (k)",
    cis: "3,2·10⁻⁵ s⁻¹",
    trans: "8,7·10⁻⁶ s⁻¹",
    farq: "cis — 3,7× tezroq (steri ta’sir)",
  },
  {
    parametr: "Optik aylanish [α]D",
    cis: "±89° (Δ/Λ)",
    trans: "0°",
    farq: "cis — Werner Nobel dalili",
  },
  {
    parametr: "IR ν(Co–Cl)",
    cis: "343 va 353 cm⁻¹ (2 yo‘lakcha)",
    trans: "353 cm⁻¹ (1 yo‘lakcha)",
    farq: "IR — cis/trans ajratish usuli",
  },
];

// Werner Nobel tajribasi bosqichlari (1911–1913)
const wernerExperiment = [
  {
    year: 1893,
    event: "Werner koordinatsion nazariyani taqdim etadi (23 yoshda)",
    detail: "Kompleks birikmalar oktaedrik strukturaga ega degan taxmin",
  },
  {
    year: 1907,
    event: "cis va trans [Co(en)₂Cl₂]⁺ ni ajratib oldi",
    detail: "Rangi (binafsha vs yashil) — struktura farqi dalili",
  },
  {
    year: 1911,
    event: "cis-[Co(en)₂Cl₂]⁺ ni d-tartrat bilan Δ va Λ ga ajratdi",
    detail: "Metall atomida karbondsiz chirallik — yangi kashfiyot",
  },
  {
    year: 1912,
    event: "trans-izomer ajratilmadi (D₂ₕ mesoform)",
    detail: "Bu — oktaedrik strukturaning to‘liq isboti",
  },
  {
    year: 1913,
    event: "Werner Nobel mukofotini oldi",
    detail: "Anorganik kimyoda birinchi Nobel — koordinatsion nazariya uchun",
  },
];

// Δ/Λ enantiomer xossalari
const enantiomers = [
  {
    label: "Δ-cis-[Co(en)₂Cl₂]⁺",
    handedness: "o‘ng (D)",
    rotation: "+89°",
    cdSign: "musbat (+)",
    cdLambda: "540 nm",
    color: "#ec4899", // pink
    description: "Uch cheladit halqasi soat yo‘nalishida propeller",
  },
  {
    label: "Λ-cis-[Co(en)₂Cl₂]⁺",
    handedness: "chap (L)",
    rotation: "−89°",
    cdSign: "manfiy (−)",
    cdLambda: "540 nm",
    color: "#3b82f6", // blue
    description: "Uch cheladit halqasi soat yo‘nalishiga qarshi propeller",
  },
];

// Simmetriya bo‘linishi: Oh → C₂ᵥ
const symmetrySplitting = [
  {
    level: "Oh (Luteo)",
    term: "¹A₁g",
    energy: 0,
    label: "Asos",
  },
  {
    level: "Oh (Luteo)",
    term: "¹T₁g",
    energy: 21500,
    label: "1-yo‘lakcha (3× degenerat)",
  },
  {
    level: "Oh (Luteo)",
    term: "¹T₂g",
    energy: 29500,
    label: "2-yo‘lakcha (3× degenerat)",
  },
  {
    level: "C₂ᵥ (Violeo)",
    term: "¹A₁",
    energy: 0,
    label: "Asos",
    parent: "¹A₁g",
  },
  {
    level: "C₂ᵥ (Violeo)",
    term: "¹A₂",
    energy: 16400,
    label: "610 nm",
    parent: "¹T₁g",
  },
  {
    level: "C₂ᵥ (Violeo)",
    term: "¹B₁",
    energy: 18500,
    label: "540 nm",
    parent: "¹T₁g",
  },
  {
    level: "C₂ᵥ (Violeo)",
    term: "¹A₁",
    energy: 28200,
    label: "355 nm",
    parent: "¹T₂g",
  },
  {
    level: "C₂ᵥ (Violeo)",
    term: "¹B₂",
    energy: 25970,
    label: "385 nm",
    parent: "¹T₂g",
  },
];

// Werner koordinatsion seriyasi (rang qiyosiy)
const wernerSeries = [
  {
    formula: "[Co(NH₃)₆]³⁺",
    name: "Luteo",
    color: "#FFC300",
    colorName: "sariq",
    lmax: 475,
    epsilon: 56,
    symmetry: "Oh",
    isomers: "yo‘q",
  },
  {
    formula: "[Co(NH₃)₅Cl]²⁺",
    name: "Purpureo",
    color: "#8B0080",
    colorName: "to‘q binafsha",
    lmax: 530,
    epsilon: 47,
    symmetry: "C₄ᵥ",
    isomers: "yo‘q",
  },
  {
    formula: "cis-[Co(en)₂Cl₂]⁺",
    name: "Violeo",
    color: "#7B3F99",
    colorName: "binafsha",
    lmax: 540,
    epsilon: 82,
    symmetry: "C₂",
    isomers: "Δ / Λ",
    current: true,
  },
  {
    formula: "trans-[Co(en)₂Cl₂]⁺",
    name: "Praseo",
    color: "#4CAF50",
    colorName: "yashil",
    lmax: 620,
    epsilon: 34,
    symmetry: "D₂ₕ",
    isomers: "yo‘q",
  },
  {
    formula: "[Co(en)₃]³⁺",
    name: "Chelato",
    color: "#FFB800",
    colorName: "oltin sariq",
    lmax: 465,
    epsilon: 87,
    symmetry: "D₃",
    isomers: "Δ / Λ",
  },
];

// Akvatsiya kinetikasi (cis vs trans)
const aquationData = {
  cis: {
    k: 3.2e-5, // s⁻¹, 25°C
    Ea: 92, // kJ/mol
    dH: 89,
    dS: 12,
    mechanism: "SN1 (D — disotsiativ)",
    product: "cis-[Co(en)₂(H₂O)Cl]²⁺",
    retention: "Konfiguratsiya saqlanadi (95%)",
    color: "binafsha → pushti",
  },
  trans: {
    k: 8.7e-6,
    Ea: 106,
    dH: 103,
    dS: 8,
    mechanism: "SN1 (D)",
    product: "aralash cis + trans (racemizatsiya)",
    retention: "35% cis-mahsulot (racemizatsiya)",
    color: "yashil → pushti",
  },
};

// Namuna tayyorlash usullari
const preparationMethods = [
  {
    name: "Suvli eritma (H₂O)",
    icon: "💧",
    range: "200–800 nm",
    resolution: "1 nm",
    ph: "3–4 (HCl 0,01 M)",
    conc: "10⁻³–10⁻⁴ M",
    advantage: "Oddiy, tez, aniq",
    disadvantage: "Sekin akvatsiya (soat davomida)",
    duration: "2–5 daqiqa",
  },
  {
    name: "Kislotali muhit (HClO₄)",
    icon: "",
    range: "200–800 nm",
    resolution: "0,5 nm",
    ph: "0,5–1,0",
    conc: "10⁻³ M",
    advantage: "Akvatsiya to‘xtatiladi, stabil o‘lchov",
    disadvantage: "Kuchli kislota — ehtiyot bo‘lish kerak",
    duration: "5–10 daqiqa",
  },
  {
    name: "CD spektroskopiya (JASCO)",
    icon: "",
    range: "190–700 nm",
    resolution: "0,1 nm",
    ph: "3–4",
    conc: "10⁻³ M enantiomer",
    advantage: "Δ va Λ ni bevosita ajratish",
    disadvantage: "Chiral HPLC yoki d-tartrat rezolyutsiya talab qiladi",
    duration: "15–30 daqiqa",
  },
  {
    name: "Bir mono-kristall (XRD-UV)",
    icon: "",
    range: "300–800 nm",
    resolution: "2 nm",
    ph: "—",
    conc: "kristall",
    advantage: "Anizotropiya, dixroizm o‘rganish",
    disadvantage: "Yagona kristall talab qiladi",
    duration: "1–2 soat",
  },
];

// Xalaqit beruvchi omillar
const interferences = [
  {
    factor: "Akvatsiya (H₂O bilan almashinuv)",
    severity: "yuqori",
    effect: "cis-[Co(en)₂(H₂O)Cl]²⁺ hosil bo‘ladi, spektr o‘zgaradi",
    solution: "0,01–0,1 M HCl qo‘shish, 5°C da o‘lchash",
    kinetics: "t½ = 6 soat (25°C, pH 5)",
  },
  {
    factor: "cis → trans izomerlanishi",
    severity: "past",
    effect: "Vaqt bilan yashil rangga o‘tish (nur ostida)",
    solution: "Qorong‘i joyda saqlash, temperatur < 40°C",
    kinetics: "t½ = 3 kun (25°C, xona nurida)",
  },
  {
    factor: "Racemizatsiya (Δ → Λ)",
    severity: "o‘rta",
    effect: "Optik faollik yo‘qoladi",
    solution: "Muzli suvda, tez o‘lchash (< 10 daq)",
    kinetics: "t½ = 45 daq (25°C, pH 7)",
  },
  {
    factor: "Fotoakvatsiya (UB nur ostida)",
    severity: "yuqori",
    effect: "310 nm ostida akvatsiya 100× tez",
    solution: "UB filter ishlatish, tunda saqlash",
    kinetics: "kvant unumi Φ ≈ 0,08",
  },
  {
    factor: "Kislorod bilan oksidlanish",
    severity: "past",
    effect: "Co(III) stabil, muammo yo‘q",
    solution: "—",
    kinetics: "—",
  },
];

// Amaliy qo‘llanilishi
const applications = [
  {
    icon: "🎓",
    title: "Ta’lim darsligi",
    desc: "Werner nazariyasini o‘qitish, cis/trans + Δ/Λ izomeriya darsligi",
    example: "Universitet 3-kurs anorganik kimyo laboratoriya ishi",
  },
  {
    icon: "",
    title: "DNK bog‘lanish tadqiqoti",
    desc: "cis-Co(III) komplekslari DNK ga bog‘lanadi (sisplatin analogi)",
    example: "Barton (Caltech) DNK-tan tanish tadqiqotlari",
  },
  {
    icon: "",
    title: "Kiralik CD standarti",
    desc: "Δ-cis-[Co(en)₂Cl₂]⁺ CD kalibrlash uchun standart",
    example: "JASCO CD spektrometrida referens",
  },
  {
    icon: "⚗️",
    title: "Asimmetrik kataliz",
    desc: "Chiral Co(III) katalizatorlarning modeli",
    example: "Jacobsen katalizatorlari uchun asos",
  },
  {
    icon: "",
    title: "Bailar mexanizmi tadqiqi",
    desc: "cis ↔ trans izomerlanishining bikvadrat mexanizmi",
    example: "Bailar tvist reaksiyasini o‘rganish",
  },
  {
    icon: "🧊",
    title: "Kristallografiya",
    desc: "Monoklinik P2₁/c fazoviy guruh — o‘qitish namunasi",
    example: "Cambridge Structural Database (CSD) misoli",
  },
  {
    icon: "💊",
    title: "Sisplatin analog dizayni",
    desc: "cis-CoN₂Cl₂ birligi — sitotoksik model",
    example: "Pt(II) o‘rniga Co(III) prodrug tadqiqotlari",
  },
  {
    icon: "",
    title: "Rang nazariyasi darsi",
    desc: "cis (binafsha) vs trans (yashil) — bir formuladan ikki rang",
    example: "Kompleks rangining shakli-simmetriyasiga bog‘liqligi",
  },
];

// Ilmiy manbalar
const references = [
  {
    id: 1,
    text: "Werner, A. (1911). \"Zur Kenntnis des asymmetrischen Kobaltatoms. V.\" Ber. Dtsch. Chem. Ges. 44(2): 1887–1898.",
    doi: "10.1002/cber.19110440266",
  },
  {
    id: 2,
    text: "Werner, A. (1913). Nobel Lecture: On the Constitution and Configuration of Higher-Order Compounds. Stockholm: Nobel Foundation.",
    url: "https://www.nobelprize.org/prizes/chemistry/1913/werner/lecture/",
  },
  {
    id: 3,
    text: "Bailar, J.C. (1958). \"The stereochemistry of complex inorganic compounds.\" J. Inorg. Nucl. Chem. 8: 165–175.",
    doi: "10.1016/0022-1902(58)80176-X",
  },
  {
    id: 4,
    text: "Basolo, F. & Pearson, R.G. (1967). Mechanisms of Inorganic Reactions, 2nd ed. Wiley: New York, ch. 3.",
    isbn: "978-0471055457",
  },
  {
    id: 5,
    text: "Lever, A.B.P. (1984). Inorganic Electronic Spectroscopy, 2nd ed. Elsevier, pp. 461–475.",
    isbn: "978-0444423894",
  },
  {
    id: 6,
    text: "Kauffman, G.B. (1966). \"Alfred Werner: Founder of Coordination Chemistry.\" Springer-Verlag Berlin.",
    isbn: "978-3540038948",
  },
  {
    id: 7,
    text: "Ballhausen, C.J. (1962). Introduction to Ligand Field Theory. McGraw-Hill, pp. 100–110.",
    isbn: "978-0070034952",
  },
  {
    id: 8,
    text: "Housecroft, C.E. & Sharpe, A.G. (2018). Inorganic Chemistry, 5th ed. Pearson, pp. 662–668, 720–728.",
    isbn: "978-1292134147",
  },
  {
    id: 9,
    text: "Tanabe, Y. & Sugano, S. (1954). \"On the absorption spectra of complex ions II.\" J. Phys. Soc. Japan 9: 766–779.",
    doi: "10.1143/JPSJ.9.766",
  },
  {
    id: 10,
    text: "Miessler, G.L., Fischer, P.J., Tarr, D.A. (2014). Inorganic Chemistry, 5th ed. Pearson, ch. 11.",
    isbn: "978-0321811059",
  },
  {
    id: 11,
    text: "Barton, J.K. (1986). \"Metals and DNA: molecular left-handed complements.\" Science 233: 727–734.",
    doi: "10.1126/science.3016894",
  },
  {
    id: 12,
    text: "Douglas, B.E. & Hollingsworth, C.A. (1985). Symmetry in Bonding and Spectra. Academic Press, pp. 245–260.",
    isbn: "978-0122212406",
  },
];

// Tarixiy jadval
const historyTimeline = [
  { year: 1798, event: "Tassaert kobalt-ammoniyli tuzlarni birinchi bo‘lib olgan", nobel: false },
  { year: 1856, event: "Jörgensen zanjirli nazariya (Blomstrand-Jörgensen)", nobel: false },
  { year: 1893, event: "Werner koordinatsion nazariya (23 yoshda!)", nobel: false },
  { year: 1907, event: "Werner cis va trans [Co(en)₂Cl₂]⁺ ni ajratdi", nobel: false },
  { year: 1911, event: "Werner cis-izomerdan Δ/Λ enantiomerlarni ajratdi", nobel: false },
  { year: 1913, event: "Werner Nobel mukofoti (anorganik kimyoda birinchi!)", nobel: true },
  { year: 1930, event: "Bethe/Van Vleck kristall maydon nazariyasi", nobel: false },
  { year: 1958, event: "Bailar cis↔trans izomerlanish mexanizmi", nobel: false },
  { year: 1962, event: "Ballhausen ligand maydon nazariyasi kitobi", nobel: false },
  { year: 1983, event: "Taube (Werner shogirdi) Nobel mukofoti", nobel: true },
  { year: 1986, event: "Barton — Δ-Co(III) DNK-bog‘lanish tadqiqotlari", nobel: false },
];

// ═══════════════════════════════════════════════════════════════════════
//                      PDF EXPORT FUNKSIYASI
// ═══════════════════════════════════════════════════════════════════════

async function generatePDF(setProgress) {
  const cleanText = (s) =>
    String(s ?? "")
      .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => "0123456789"["₀₁₂₃₄₅₆₇₈₉".indexOf(m)])
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/g, (m) => {
        const map = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁺": "+", "⁻": "-" };
        return map[m] || m;
      })
      .replace(/Δ/g, "Delta")
      .replace(/Λ/g, "Lambda")
      .replace(/λ/g, "lambda")
      .replace(/ε/g, "epsilon")
      .replace(/μ/g, "mu")
      .replace(/ν/g, "nu")
      .replace(/α/g, "alpha")
      .replace(/β/g, "beta")
      .replace(/π/g, "pi")
      .replace(/₃/g, "3")
      .replace(/[^\x00-\xFF\u0100-\u017F\u0400-\u04FF]/g, "");

  setProgress(5);
  const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
  const fontkit = (await import("@pdf-lib/fontkit")).default;

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  setProgress(15);
  const regularBytes = await fetch("/fonts/DejaVuSans.ttf").then((r) => r.arrayBuffer());
  const boldBytes = await fetch("/fonts/DejaVuSans-Bold.ttf").then((r) => r.arrayBuffer());
  const obliqueBytes = await fetch("/fonts/DejaVuSans-Oblique.ttf").then((r) => r.arrayBuffer());
  const font = await pdfDoc.embedFont(regularBytes);
  const fontBold = await pdfDoc.embedFont(boldBytes);
  const fontItalic = await pdfDoc.embedFont(obliqueBytes);

  setProgress(30);

  const C = {
    violetDeep: rgb(0.48, 0.25, 0.6),
    violetMid: rgb(0.6, 0.35, 0.75),
    violetLight: rgb(0.85, 0.75, 0.95),
    pink: rgb(0.93, 0.28, 0.6),
    blue: rgb(0.23, 0.51, 0.96),
    dark: rgb(0.08, 0.05, 0.15),
    text: rgb(0.15, 0.1, 0.2),
    subtle: rgb(0.45, 0.4, 0.55),
    lightBg: rgb(0.98, 0.96, 1),
    goldStar: rgb(0.98, 0.75, 0),
    green: rgb(0.3, 0.7, 0.35),
  };

  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const M = 45;

  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - M;

  const newPage = () => {
    page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - M;
    // Kolontitul
    page.drawText(cleanText("cis-[Co(en)2Cl2]Cl — Violeo · jdakimyo.uz"), {
      x: M,
      y: PAGE_H - 25,
      size: 8,
      font: fontItalic,
      color: C.subtle,
    });
    page.drawLine({ start: { x: M, y: PAGE_H - 30 }, end: { x: PAGE_W - M, y: PAGE_H - 30 }, thickness: 0.5, color: C.violetLight });
    y = PAGE_H - 50;
  };

  const line = (text, size = 10, opts = {}) => {
    if (y < M + 30) newPage();
    const useFont = opts.bold ? fontBold : opts.italic ? fontItalic : font;
    page.drawText(cleanText(text), {
      x: opts.x ?? M,
      y,
      size,
      font: useFont,
      color: opts.color ?? C.text,
    });
    y -= size + 4;
  };

  const heading = (text, size = 16, color = C.violetDeep) => {
    if (y < M + 60) newPage();
    y -= 8;
    page.drawText(cleanText(text), { x: M, y, size, font: fontBold, color });
    y -= size + 10;
    page.drawLine({ start: { x: M, y: y + 4 }, end: { x: M + 60, y: y + 4 }, thickness: 2, color });
    y -= 8;
  };

  const paragraph = (text, size = 10) => {
    const words = cleanText(text).split(/\s+/);
    const maxW = PAGE_W - 2 * M;
    let currentLine = "";
    for (const w of words) {
      const testLine = currentLine ? currentLine + " " + w : w;
      const width = font.widthOfTextAtSize(testLine, size);
      if (width > maxW) {
        line(currentLine, size);
        currentLine = w;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) line(currentLine, size);
  };

  // Muqova
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: C.lightBg });
  page.drawRectangle({ x: 0, y: PAGE_H - 200, width: PAGE_W, height: 200, color: C.violetDeep });
  page.drawText(cleanText("cis-[Co(en)2Cl2]Cl"), {
    x: M,
    y: PAGE_H - 100,
    size: 32,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page.drawText(cleanText("VIOLEO — Werner Nobel klassikasi"), {
    x: M,
    y: PAGE_H - 135,
    size: 16,
    font: fontItalic,
    color: rgb(1, 0.95, 1),
  });
  page.drawText(cleanText("UB-Vis spektroskopik tahlil · d6 LS · Oh -> C2v"), {
    x: M,
    y: PAGE_H - 165,
    size: 12,
    font,
    color: rgb(1, 0.95, 1),
  });

  y = PAGE_H - 250;
  heading("Umumiy ma'lumot", 18);
  paragraph(`Formula: ${COMPOUND.formula}`, 11);
  paragraph(`IUPAC: ${COMPOUND.iupac}`, 11);
  paragraph(`Molyar massa: ${COMPOUND.molarMass} g/mol · CAS: ${COMPOUND.cas}`, 11);
  paragraph(`Rang: ${COMPOUND.color} · Simmetriya: ${COMPOUND.pointGroup}`, 11);
  paragraph(`Delta_o = ${COMPOUND.deltaO} cm-1 · Racah B = ${COMPOUND.racahB} cm-1`, 11);
  paragraph(`Konfiguratsiya: ${COMPOUND.configuration} · mu_eff = 0 (diamagnetik)`, 11);
  paragraph(`Optik aylanish [alpha]D = ±${COMPOUND.opticalRotation}° (Delta/Lambda)`, 11);

  setProgress(50);

  newPage();
  heading("1. Werner Nobel tajribasi (1911–1913)");
  paragraph(
    "cis-[Co(en)2Cl2]Cl birikmasi anorganik kimyo tarixida markaziy o‘rin egallaydi. Alfred Werner 1911-yilda cis-izomerdan Delta va Lambda enantiomerlarni d-tartrat yordamida ajratdi. Bu — metall atomida karbondsiz chirallik borligining birinchi isboti edi. Trans-izomer (D2h) mesoform bo‘lgani uchun ajratilmadi — bu oktaedrik strukturaning to‘liq isboti bo‘ldi.",
    10
  );
  paragraph(
    "1913-yilda Werner Nobel mukofotini oldi — bu anorganik kimyoda birinchi Nobel edi. Uning shogirdi Henry Taube 1983-yilda ham Nobel oldi (kompleks reaksiyalar mexanizmi bo‘yicha).",
    10
  );

  heading("2. Simmetriya sindirilishi: Oh -> C2v");
  paragraph(
    "cis-izomer C2 simmetriyaga (yoki C2v — Cl-Cl to‘g‘ridan-to‘g‘ri) ega. Bu simmetriya sindirilishi Luteo dagi 2 ta d-d yo‘lakchani 4 tagacha ochib beradi:",
    10
  );
  paragraph("· 1A1g (Oh) -> 1A1 (C2v)", 10);
  paragraph("· 1T1g (Oh) -> 1A2 + 1B1 (C2v) · 610 va 540 nm", 10);
  paragraph("· 1T2g (Oh) -> 1A1 + 1B2 (C2v) · 355 va 385 nm", 10);

  heading("3. UB-Vis spektri — asosiy yo‘lakchalar");
  uvVisPeaks.forEach((p) => {
    paragraph(`lambda = ${p.lambda} nm · epsilon = ${p.epsilon} M-1cm-1 · ${p.type}`, 10);
    paragraph(`  ${p.transition} — ${p.description}`, 9);
  });

  setProgress(70);

  newPage();
  heading("4. cis vs trans qiyosiy tahlil");
  cisVsTrans.slice(0, 8).forEach((r) => {
    paragraph(`${r.parametr}: cis = ${r.cis} | trans = ${r.trans}`, 9);
  });

  heading("5. Akvatsiya kinetikasi (SN1)");
  paragraph(`cis: k = ${aquationData.cis.k} s-1 · Ea = ${aquationData.cis.Ea} kJ/mol`, 10);
  paragraph(`  Mahsulot: ${aquationData.cis.product}`, 10);
  paragraph(`  Retentsiya: ${aquationData.cis.retention}`, 10);
  paragraph(`trans: k = ${aquationData.trans.k} s-1 · Ea = ${aquationData.trans.Ea} kJ/mol`, 10);
  paragraph(`  Mahsulot: ${aquationData.trans.product}`, 10);

  heading("6. Delta va Lambda enantiomerlar");
  enantiomers.forEach((e) => {
    paragraph(`${e.label} · [alpha]D = ${e.rotation} · CD ${e.cdSign}`, 10);
    paragraph(`  ${e.description}`, 9);
  });

  setProgress(85);

  newPage();
  heading("7. Werner koordinatsion seriyasi");
  wernerSeries.forEach((w) => {
    paragraph(`${w.formula} (${w.name}) — ${w.colorName} · lambda_max = ${w.lmax} nm · epsilon = ${w.epsilon}`, 10);
  });

  heading("8. Tarixiy xronologiya");
  historyTimeline.forEach((h) => {
    paragraph(`${h.year}: ${h.event}${h.nobel ? " *NOBEL*" : ""}`, 10);
  });

  heading("9. Adabiyotlar");
  references.forEach((r) => {
    paragraph(`[${r.id}] ${r.text}`, 8);
  });

  // Footer
  newPage();
  y = PAGE_H / 2;
  page.drawText(cleanText("© 2026 jdakimyo.uz"), {
    x: PAGE_W / 2 - 60,
    y,
    size: 14,
    font: fontBold,
    color: C.violetDeep,
  });
  y -= 20;
  page.drawText(cleanText("Muallif: Diyor · Ilmiy chuqurlik: Werner (1913) · Barton (1986)"), {
    x: PAGE_W / 2 - 180,
    y,
    size: 10,
    font: fontItalic,
    color: C.subtle,
  });

  setProgress(95);
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cis-Co-en2-Cl2_Violeo_UB-Vis_hisoboti.pdf";
  a.click();
  URL.revokeObjectURL(url);
  setProgress(100);
}

// ═══════════════════════════════════════════════════════════════════════
//                          REACT KOMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function CisCoEn2Cl2Page() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [showHeader, setShowHeader] = useState(false);
  const [hoveredPeak, setHoveredPeak] = useState(null);
  const [activeEnantiomer, setActiveEnantiomer] = useState("both"); // Δ, Λ, both
  const [showTrans, setShowTrans] = useState(false); // cis vs trans overlay
  const [activePreparation, setActivePreparation] = useState(0);
  const [activeInterference, setActiveInterference] = useState(0);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Beer-Lambert kalkulyator
  const [conc, setConc] = useState(1.0e-3);
  const [pathL, setPathL] = useState(1.0);
  const [selectedBand, setSelectedBand] = useState(0);
  const A = uvVisPeaks[selectedBand].epsilon * conc * pathL;
  const T = Math.pow(10, -A) * 100;

  // Aquatsiya simulator
  const [temperature, setTemperature] = useState(25); // °C
  const [pH, setPH] = useState(4);
  const [aquationTime, setAquationTime] = useState(0); // soat

  // Real aquatsiya k ni pH va T ga qarab hisoblash
  const k_aq = useMemo(() => {
    const k0 = 3.2e-5; // 25°C, pH 4
    const T_K = temperature + 273.15;
    const Ea = 92e3; // J/mol
    const R = 8.314;
    const kT = k0 * Math.exp((-Ea / R) * (1 / T_K - 1 / 298.15));
    const kPH = kT * (1 + Math.pow(10, pH - 8));
    return kPH;
  }, [temperature, pH]);

  const fractionAquated = 1 - Math.exp(-k_aq * aquationTime * 3600);
  const currentColor = useMemo(() => {
    const f = fractionAquated;
    // binafsha (#7B3F99) -> pushti (#F472B6)
    const r = Math.round(123 + (244 - 123) * f);
    const g = Math.round(63 + (114 - 63) * f);
    const b = Math.round(153 + (182 - 153) * f);
    return `rgb(${r},${g},${b})`;
  }, [fractionAquated]);

  useEffect(() => {
    const handler = (e) => {
      setShowHeader(e.clientY < 60);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const handlePDF = async () => {
    setPdfGenerating(true);
    setPdfProgress(0);
    try {
      await generatePDF(setPdfProgress);
      setTimeout(() => {
        setPdfGenerating(false);
        setPdfModalOpen(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setPdfGenerating(false);
    }
  };

  return (
    <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
      {/* HEADER (sticky, on hover) */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-[var(--v3-fon-2)]/90 backdrop-blur-md border-b border-violet-500/30 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-violet-300 hover:text-white">
               Bosh sahifa
            </Link>
            <span className="text-violet-500">/</span>
            <Link href="/ilmiy" className="text-violet-300 hover:text-white">
              Ilmiy
            </Link>
            <span className="text-violet-500">/</span>
            <Link href="/ilmiy/tahlil" className="text-violet-300 hover:text-white">
              Tahlil
            </Link>
            <span className="text-violet-500">/</span>
            <Link href="/ilmiy/tahlil/ub-vis" className="text-violet-300 hover:text-white">
              UB-Vis
            </Link>
            <span className="text-violet-500">/</span>
            <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-violet-300 hover:text-white">
              Birikmalar
            </Link>
            <span className="text-violet-500">/</span>
            <span className="text-white font-semibold">Violeo</span>
          </div>
          <button
            onClick={() => setPdfModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg text-sm font-semibold hover:from-violet-400 hover:to-fuchsia-400 transition"
          >
            📥 PDF hisobot
          </button>
        </div>
      </div>

      {/* PDF Modal */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-purple-900 rounded-2xl border border-violet-500/50 p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-violet-200">PDF hisobot yaratish</h3>
            <p className="text-violet-300/80 mb-6 text-sm">
              cis-[Co(en)₂Cl₂]Cl (Violeo) uchun to‘liq ilmiy hisobot: Werner tajribasi, spektr,
              cis/trans qiyos, Δ/Λ enantiomerlar, akvatsiya kinetikasi, adabiyotlar.
            </p>
            {pdfGenerating && (
              <div className="mb-4">
                <div className="h-3 bg-purple-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
                    style={{ width: `${pdfProgress}%` }}
                  />
                </div>
                <p className="text-center text-violet-300 mt-2 text-sm">{pdfProgress}%</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handlePDF}
                disabled={pdfGenerating}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg font-semibold disabled:opacity-50"
              >
                {pdfGenerating ? "Yaratilmoqda…" : "📥 Yuklab olish"}
              </button>
              <button
                onClick={() => setPdfModalOpen(false)}
                disabled={pdfGenerating}
                className="px-4 py-3 bg-purple-800 hover:bg-purple-700 rounded-lg disabled:opacity-50"
              >
                Bekor
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ═══════════════════════════════════════════════════════════════
            1. UMUMIY MA’LUMOT — HERO
            ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-violet-300 mb-4">
            <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="hover:text-white">
              ← Birikmalar katalogiga qaytish
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs text-amber-300 font-bold">
              ⭐ Werner Nobel 1913
            </span>
            <span className="px-3 py-1 bg-pink-500/20 border border-pink-500/50 rounded-full text-xs text-pink-300">
               Δ / Λ optik izomer
            </span>
            <span className="px-3 py-1 bg-violet-500/20 border border-violet-500/50 rounded-full text-xs text-violet-300">
              🎭 cis / trans geometrik
            </span>
            <span className="px-3 py-1 bg-fuchsia-500/20 border border-fuchsia-500/50 rounded-full text-xs text-fuchsia-300">
              📉 Oh → C₂ᵥ simmetriya sinishi
            </span>
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-xs text-blue-300">
              ⚗️ d⁶ Low-Spin
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
            cis-[Co(en)₂Cl₂]Cl · Violeo
          </h1>
          <p className="text-2xl text-violet-200 mb-2">
            <em>cis-dixlorobis(etilendiamin)kobalt(III) xlorid</em>
          </p>
          <p className="text-lg text-violet-300/80 max-w-4xl">
            Anorganik kimyo tarixining eng muhim birikmalaridan biri: Werner koordinatsion
            nazariyani isbotlagan, geometrik <em>cis/trans</em> va optik <em>Δ/Λ</em>{" "}
            izomerlarni bir molekulada mujassam etgan klassika.
          </p>
        </div>

        {/* KARTALAR QATORI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
            <div className="text-xs text-violet-400 mb-1">Molyar massa</div>
            <div className="text-3xl font-black text-white">{COMPOUND.molarMass}</div>
            <div className="text-xs text-violet-300 mt-1">g/mol</div>
          </div>
          <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
            <div className="text-xs text-fuchsia-400 mb-1">Δo (kristall maydon)</div>
            <div className="text-3xl font-black text-white">{COMPOUND.deltaO.toLocaleString()}</div>
            <div className="text-xs text-fuchsia-300 mt-1">cm⁻¹</div>
          </div>
          <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
            <div className="text-xs text-pink-400 mb-1">Rangi</div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border-2 border-white/30"
                style={{ background: COMPOUND.colorHex }}
              />
              <div className="text-lg font-bold text-white">{COMPOUND.color}</div>
            </div>
          </div>
          <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
            <div className="text-xs text-[var(--v3-xira)] mb-1">Optik aylanish [α]D</div>
            <div className="text-3xl font-black text-white">±{COMPOUND.opticalRotation}°</div>
            <div className="text-xs text-[var(--v3-matn)] mt-1">Δ / Λ enantiomerlar</div>
          </div>
        </div>

        {/* PARAMETRLAR JADVALI */}
        <div className="bg-purple-900/30 rounded-2xl border border-violet-500/30 p-6 mb-12">
          <h3 className="text-xl font-bold mb-4 text-violet-200"> Asosiy parametrlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {[
              ["IUPAC nomlanishi", COMPOUND.iupac],
              ["Umumiy nomlanishi", COMPOUND.commonName],
              ["Werner nomlanishi", COMPOUND.wernerName],
              ["CAS raqami", COMPOUND.cas],
              ["Kristall tizim", COMPOUND.crystalSystem],
              ["Fazoviy guruh", COMPOUND.spaceGroup],
              ["Nuqta guruhi", COMPOUND.pointGroup],
              ["Co–N uzunligi", `${COMPOUND.bondLengthCoN} Å`],
              ["Co–Cl uzunligi", `${COMPOUND.bondLengthCoCl} Å`],
              ["N–Co–N burchagi (en)", `${COMPOUND.bondAngleNCoN}°`],
              ["Elektron konfiguratsiya", COMPOUND.configuration],
              ["Asos termi", COMPOUND.termGround],
              ["Racah B", `${COMPOUND.racahB} cm⁻¹ (erkin ion ${COMPOUND.racahBFree})`],
              ["Nefelauxetik nisbat β", COMPOUND.nephelauxetic],
              ["Magnit momenti μ_eff", `${COMPOUND.mu_eff} μB (diamagnetik)`],
              ["Spin holati", COMPOUND.spinState],
              ["Erish nuqtasi", `${COMPOUND.meltingPoint}°C (dekompozitsiya)`],
              ["Suvda eruvchanlik", `${COMPOUND.solubilityWater} g/100mL (20°C)`],
              ["Zichlik", `${COMPOUND.density} g/cm³`],
              ["Kashfiyot", `${COMPOUND.discoveredBy}, ${COMPOUND.discoveredYear}`],
            ].map(([k, v], i) => (
              <div key={i} className="flex justify-between border-b border-violet-500/10 py-1.5">
                <span className="text-violet-300">{k}:</span>
                <span className="text-white font-semibold text-right ml-2">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            2. NAZARIY ASOS
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
            1. Nazariy asos — Oh → C₂ᵥ simmetriya sinishi va C₂ chirallik
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-900/30 rounded-2xl p-6 border border-violet-500/30">
              <h3 className="text-xl font-bold mb-3 text-violet-200">🎭 Geometrik izomeriya</h3>
              <p className="text-violet-100 mb-3 leading-relaxed">
                <strong>cis</strong>-izomerda ikkita Cl⁻ ligand qo‘shni pozitsiyalarni egallaydi
                (Cl–Co–Cl burchagi ≈ 90°), <strong>trans</strong>-izomerda esa qarama-qarshi
                (180°). Werner (1911) shu ikkitasini ajratib, oktaedrik strukturaning to‘liq
                isbotini berdi:
              </p>
              <ul className="text-sm text-violet-200 space-y-1 ml-4">
                <li>· Kvadrat-yassi strukturada 3 ta izomer bo‘lardi (cis, trans, va boshqa)</li>
                <li>· Trigonal prizmatikda 1 ta izomer bo‘lardi</li>
                <li>· Faqat oktaedrik 2 ta izomer beradi — <em>tajriba bilan tasdiqlangan!</em></li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-2xl p-6 border border-pink-500/30">
              <h3 className="text-xl font-bold mb-3 text-pink-200"> Optik izomeriya</h3>
              <p className="text-pink-100 mb-3 leading-relaxed">
                Faqat <strong>cis</strong>-izomer C₂ simmetriya (yoki C₂ᵥ) ga ega bo‘lgani uchun
                ko‘zgu bilan simmetriyaga ega emas → <strong>Δ (o‘ng)</strong> va{" "}
                <strong>Λ (chap)</strong> enantiomerlarga ajraladi. Trans-izomer esa D₂ₕ
                simmetriyaga ega (i markazi bor) → optik faolsiz mesoform.
              </p>
              <div className="text-sm text-pink-200 space-y-1 ml-4">
                <div>
                  · Δ-cis: <span style={{ color: enantiomers[0].color }}>[α]D = +89°</span>, CD musbat
                </div>
                <div>
                  · Λ-cis: <span style={{ color: enantiomers[1].color }}>[α]D = −89°</span>, CD manfiy
                </div>
                <div>· Racemik aralashma: [α]D = 0</div>
              </div>
            </div>
          </div>

          {/* SIMMETRIYA BO'LINISHI DIAGRAMMA */}
          <div className="bg-purple-950/50 rounded-2xl p-6 border border-violet-500/30 mb-6">
            <h3 className="text-xl font-bold mb-4 text-violet-200 text-center">
              Kristall maydon: Oh → C₂ᵥ term bo‘linishi
            </h3>
            <svg viewBox="0 0 800 400" className="w-full">
              <defs>
                <linearGradient id="ohGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              {/* Oh side */}
              <text x="150" y="30" textAnchor="middle" fill="#c4b5fd" fontSize="16" fontWeight="bold">
                Oh (Luteo)
              </text>
              <text x="150" y="48" textAnchor="middle" fill="#a78bfa" fontSize="11">
                Yuqori simmetriya
              </text>

              <line x1="80" y1="360" x2="220" y2="360" stroke="#a855f7" strokeWidth="3" />
              <text x="230" y="365" fill="#c4b5fd" fontSize="13">¹A₁g</text>

              <line x1="80" y1="200" x2="220" y2="200" stroke="#a855f7" strokeWidth="3" />
              <text x="230" y="205" fill="#c4b5fd" fontSize="13">¹T₁g (3×)</text>

              <line x1="80" y1="90" x2="220" y2="90" stroke="#a855f7" strokeWidth="3" />
              <text x="230" y="95" fill="#c4b5fd" fontSize="13">¹T₂g (3×)</text>

              {/* Arrows */}
              <line x1="150" y1="360" x2="150" y2="200" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="4 2" />
              <line x1="150" y1="360" x2="150" y2="90" stroke="#f87171" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="4 2" />

              {/* Splitting lines */}
              <line x1="220" y1="200" x2="400" y2="180" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
              <line x1="220" y1="200" x2="400" y2="240" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
              <line x1="220" y1="90" x2="400" y2="70" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
              <line x1="220" y1="90" x2="400" y2="130" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />

              {/* C2v side */}
              <text x="500" y="30" textAnchor="middle" fill="#f9a8d4" fontSize="16" fontWeight="bold">
                C₂ᵥ (Violeo)
              </text>
              <text x="500" y="48" textAnchor="middle" fill="#f472b6" fontSize="11">
                Simmetriya sindirilgan
              </text>

              <line x1="430" y1="360" x2="570" y2="360" stroke="#ec4899" strokeWidth="3" />
              <text x="580" y="365" fill="#f9a8d4" fontSize="13">¹A₁</text>

              <line x1="430" y1="240" x2="570" y2="240" stroke="#ec4899" strokeWidth="3" />
              <text x="580" y="245" fill="#f9a8d4" fontSize="13">¹A₂ (610 nm)</text>

              <line x1="430" y1="180" x2="570" y2="180" stroke="#ec4899" strokeWidth="3" />
              <text x="580" y="185" fill="#f9a8d4" fontSize="13">¹B₁ (540 nm)</text>

              <line x1="430" y1="130" x2="570" y2="130" stroke="#ec4899" strokeWidth="3" />
              <text x="580" y="135" fill="#f9a8d4" fontSize="13">¹B₂ (385 nm)</text>

              <line x1="430" y1="70" x2="570" y2="70" stroke="#ec4899" strokeWidth="3" />
              <text x="580" y="75" fill="#f9a8d4" fontSize="13">¹A₁ (355 nm)</text>

              {/* Labels */}
              <text x="400" y="380" textAnchor="middle" fill="#fbbf24" fontSize="10">
                ¹T₁g → ¹A₂ + ¹B₁
              </text>
              <text x="400" y="55" textAnchor="middle" fill="#f87171" fontSize="10">
                ¹T₂g → ¹A₁ + ¹B₂
              </text>

              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6" fill="#fbbf24" />
                </marker>
              </defs>
            </svg>
            <p className="text-sm text-violet-300 text-center mt-4 italic">
              Ko‘rsatilgan: Luteo dagi 2 ta d–d yo‘lakcha Violeo da 4 ta yo‘lakchaga bo‘linadi
              (Ballhausen, 1962).
            </p>
          </div>

          {/* KVANT FORMULA */}
          <div className="bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 rounded-2xl p-6 border border-violet-500/30">
            <h3 className="text-xl font-bold mb-4 text-violet-200"> Yo‘lakcha bo‘linishi — Ds va Dt parametrlari</h3>
            <p className="text-violet-100 mb-3 leading-relaxed">
              cis-[Co(en)₂Cl₂]⁺ da C₂ᵥ simmetriya tufayli qo‘shimcha maydon parametrlar kiritiladi:
            </p>
            <div className="bg-purple-950/70 rounded-lg p-4 font-mono text-center text-lg text-fuchsia-200 mb-3">
              E(¹B₁) − E(¹A₂) = 3Ds − 5Dt ≈ 2100 cm⁻¹
            </div>
            <div className="bg-purple-950/70 rounded-lg p-4 font-mono text-center text-lg text-fuchsia-200 mb-3">
              Ds ≈ 950 cm⁻¹, Dt ≈ 320 cm⁻¹
            </div>
            <p className="text-sm text-violet-300 italic">
              Ds — sferik bo‘lmagan qism (Cl vs en asimmetriyasi), Dt — tetragonal maydon parametr.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            3. INTERAKTIV SPEKTR
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
            2. Interaktiv UB-Vis spektri
          </h2>

          <div className="bg-purple-950/50 rounded-2xl p-6 border border-violet-500/30 mb-4">
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => setShowTrans(!showTrans)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  showTrans
                    ? "bg-green-500 text-white"
                    : "bg-purple-800/50 text-violet-300 hover:bg-purple-700/50"
                }`}
              >
                {showTrans ? "✓ trans-izomer (yashil)" : "trans-izomerni ko‘rsatish"}
              </button>
            </div>

            <svg viewBox="0 0 800 400" className="w-full bg-purple-950/70 rounded-lg">
              {/* Grid */}
              {[0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5].map((v) => (
                <g key={v}>
                  <line
                    x1="60"
                    y1={350 - v * 200}
                    x2="770"
                    y2={350 - v * 200}
                    stroke="#4c1d95"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                  />
                  <text
                    x="55"
                    y={355 - v * 200}
                    fill="#a78bfa"
                    fontSize="9"
                    textAnchor="end"
                  >
                    {v.toFixed(2)}
                  </text>
                </g>
              ))}
              {[200, 300, 400, 500, 600, 700, 800].map((l) => (
                <g key={l}>
                  <line x1={60 + ((l - 200) / 600) * 710} y1="50" x2={60 + ((l - 200) / 600) * 710} y2="350" stroke="#4c1d95" strokeWidth="0.5" strokeDasharray="2 2" />
                  <text x={60 + ((l - 200) / 600) * 710} y="370" fill="#a78bfa" fontSize="9" textAnchor="middle">
                    {l}
                  </text>
                </g>
              ))}
              <text x="10" y="200" fill="#c4b5fd" fontSize="10" transform="rotate(-90 10 200)">
                Absorbansiya (A)
              </text>
              <text x="415" y="395" fill="#c4b5fd" fontSize="10" textAnchor="middle">
                λ (nm)
              </text>

              {/* Visible spectrum band */}
              <rect x={60 + ((380 - 200) / 600) * 710} y="50" width={((780 - 380) / 600) * 710} height="300" fill="url(#visGrad)" opacity="0.1" />
              <defs>
                <linearGradient id="visGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="20%" stopColor="#3b82f6" />
                  <stop offset="40%" stopColor="#10b981" />
                  <stop offset="60%" stopColor="#eab308" />
                  <stop offset="80%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Spectrum curve — cis */}
              <path
                d={uvVisSpectrum
                  .map((p, i) => {
                    const x = 60 + ((p.l - 200) / 600) * 710;
                    const y = 350 - (p.a / 1.5) * 200;
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.5"
              />

              {/* trans overlay */}
              {showTrans && (
                <path
                  d={[
                    [200, 0.9], [220, 1.15], [240, 0.95], [280, 0.42], [320, 0.16],
                    [380, 0.09], [420, 0.06], [445, 0.14], [500, 0.11], [560, 0.09],
                    [600, 0.10], [620, 0.14], [640, 0.10], [700, 0.05], [780, 0.02],
                  ]
                    .map((p, i) => {
                      const x = 60 + ((p[0] - 200) / 600) * 710;
                      const y = 350 - (p[1] / 1.5) * 200;
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
              )}

              {/* Peaks */}
              {uvVisPeaks.map((p, i) => {
                const x = 60 + ((p.lambda - 200) / 600) * 710;
                const spectraPoint = uvVisSpectrum.reduce((closest, s) =>
                  Math.abs(s.l - p.lambda) < Math.abs(closest.l - p.lambda) ? s : closest
                );
                const y = 350 - (spectraPoint.a / 1.5) * 200;
                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r={hoveredPeak === i ? 8 : 5}
                      fill={p.type === "LMCT" ? "#f472b6" : "#a78bfa"}
                      stroke="#fff"
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredPeak(i)}
                      onMouseLeave={() => setHoveredPeak(null)}
                    />
                    <text x={x} y={y - 12} fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">
                      {p.lambda}
                    </text>
                  </g>
                );
              })}

              {/* Legend */}
              <rect x="600" y="60" width="160" height={showTrans ? 60 : 40} fill="#1e0a3b" stroke="#7c3aed" strokeWidth="1" rx="5" />
              <line x1="610" y1="75" x2="640" y2="75" stroke="#c084fc" strokeWidth="2.5" />
              <text x="645" y="79" fill="#c4b5fd" fontSize="10">
                cis (Violeo)
              </text>
              {showTrans && (
                <>
                  <line x1="610" y1="95" x2="640" y2="95" stroke="#4ade80" strokeWidth="2" strokeDasharray="6 3" />
                  <text x="645" y="99" fill="#86efac" fontSize="10">
                    trans (Praseo)
                  </text>
                </>
              )}
              <circle cx="620" cy={showTrans ? 112 : 92} r="4" fill="#a78bfa" />
              <text x="630" y={showTrans ? 116 : 96} fill="#c4b5fd" fontSize="10">
                d–d
              </text>
              <circle cx="680" cy={showTrans ? 112 : 92} r="4" fill="#f472b6" />
              <text x="690" y={showTrans ? 116 : 96} fill="#f9a8d4" fontSize="10">
                LMCT
              </text>
            </svg>

            {hoveredPeak !== null && (
              <div className="mt-4 bg-purple-900/50 rounded-lg p-4 border border-violet-500/30">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-violet-400 mb-1">λmax</div>
                    <div className="text-2xl font-bold text-white">
                      {uvVisPeaks[hoveredPeak].lambda} nm
                    </div>
                    <div className="text-sm text-violet-300 mt-2">
                      ν̃ = {(1e7 / uvVisPeaks[hoveredPeak].lambda).toFixed(0)} cm⁻¹
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-violet-400 mb-1">ε (mol koeff)</div>
                    <div className="text-2xl font-bold text-white">
                      {uvVisPeaks[hoveredPeak].epsilon} M⁻¹cm⁻¹
                    </div>
                    <div className="text-sm text-violet-300 mt-2">
                      Turi: {uvVisPeaks[hoveredPeak].type}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-violet-200">
                  <strong>O‘tish:</strong> {uvVisPeaks[hoveredPeak].transition}
                </div>
                <div className="mt-1 text-sm text-violet-200">
                  <strong>Tavsif:</strong> {uvVisPeaks[hoveredPeak].description}
                </div>
                <div className="mt-1 text-xs italic text-violet-400">
                  {uvVisPeaks[hoveredPeak].forbidden}
                </div>
              </div>
            )}
          </div>

          {/* PEAK TABLE */}
          <div className="bg-purple-900/30 rounded-2xl border border-violet-500/30 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-purple-800/50">
                <tr>
                  <th className="p-3 text-left text-violet-200">λ (nm)</th>
                  <th className="p-3 text-left text-violet-200">ν̃ (cm⁻¹)</th>
                  <th className="p-3 text-left text-violet-200">ε</th>
                  <th className="p-3 text-left text-violet-200">O‘tish</th>
                  <th className="p-3 text-left text-violet-200">Turi</th>
                  <th className="p-3 text-left text-violet-200">Tavsif</th>
                </tr>
              </thead>
              <tbody>
                {uvVisPeaks.map((p, i) => (
                  <tr
                    key={i}
                    className={`border-t border-violet-500/10 hover:bg-purple-800/30 cursor-pointer ${
                      hoveredPeak === i ? "bg-violet-500/10" : ""
                    }`}
                    onMouseEnter={() => setHoveredPeak(i)}
                    onMouseLeave={() => setHoveredPeak(null)}
                  >
                    <td className="p-3 font-bold text-white">{p.lambda}</td>
                    <td className="p-3 text-violet-200">
                      {(1e7 / p.lambda).toFixed(0)}
                    </td>
                    <td className="p-3 text-violet-200">{p.epsilon}</td>
                    <td className="p-3 text-violet-100 text-xs">{p.transition}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          p.type === "LMCT"
                            ? "bg-pink-500/30 text-pink-200"
                            : "bg-violet-500/30 text-violet-200"
                        }`}
                      >
                        {p.type}
                      </span>
                    </td>
                    <td className="p-3 text-violet-300 text-xs">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            4. Δ / Λ ENANTIOMERLAR — SVG
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-pink-300 to-blue-300 bg-clip-text text-transparent">
            3. Δ va Λ enantiomerlar — Werner Nobel dalili (1911)
          </h2>

          <div className="bg-purple-950/50 rounded-2xl p-6 border border-pink-500/30 mb-6">
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
              {["Δ", "Λ", "both"].map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveEnantiomer(v)}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    activeEnantiomer === v
                      ? v === "Δ"
                        ? "bg-pink-500 text-white"
                        : v === "Λ"
                        ? "bg-blue-500 text-white"
                        : "bg-gradient-to-r from-pink-500 to-blue-500 text-white"
                      : "bg-purple-800/50 text-violet-300 hover:bg-purple-700/50"
                  }`}
                >
                  {v === "both" ? "Ikkalasini ko‘rish" : `${v}-cis`}
                </button>
              ))}
            </div>

            <svg viewBox="0 0 800 350" className="w-full">
              {/* Δ enantiomer */}
              {(activeEnantiomer === "Δ" || activeEnantiomer === "both") && (
                <g opacity={activeEnantiomer === "both" ? 0.9 : 1}>
                  <text x="150" y="30" textAnchor="middle" fill="#f9a8d4" fontSize="16" fontWeight="bold">
                    Δ-cis-[Co(en)₂Cl₂]⁺
                  </text>
                  <text x="150" y="48" textAnchor="middle" fill="#f472b6" fontSize="10">
                    [α]D = +89°, CD musbat @ 540 nm
                  </text>
                  {/* Co markazi */}
                  <circle cx="150" cy="175" r="14" fill="#8b0080" stroke="#fff" strokeWidth="2" />
                  <text x="150" y="180" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Co</text>

                  {/* en halqasi 1 — old chap */}
                  <path d="M 150 175 L 100 130 Q 80 110 100 90 Q 120 70 140 90 L 150 175" fill="none" stroke="#ec4899" strokeWidth="2.5" />
                  {/* en halqasi 2 — orqa o‘ng */}
                  <path d="M 150 175 L 200 220 Q 220 240 200 260 Q 180 280 160 260 L 150 175" fill="none" stroke="#ec4899" strokeWidth="2.5" />

                  {/* N atomlar */}
                  <circle cx="100" cy="130" r="7" fill="#3b82f6" /><text x="90" y="125" fill="#93c5fd" fontSize="9">N</text>
                  <circle cx="140" cy="90" r="7" fill="#3b82f6" /><text x="145" y="82" fill="#93c5fd" fontSize="9">N</text>
                  <circle cx="200" cy="220" r="7" fill="#3b82f6" /><text x="210" y="225" fill="#93c5fd" fontSize="9">N</text>
                  <circle cx="160" cy="260" r="7" fill="#3b82f6" /><text x="145" y="275" fill="#93c5fd" fontSize="9">N</text>

                  {/* 2 ta Cl (cis) */}
                  <circle cx="230" cy="130" r="8" fill="#10b981" /><text x="245" y="130" fill="#6ee7b7" fontSize="10">Cl</text>
                  <circle cx="90" cy="220" r="8" fill="#10b981" /><text x="65" y="220" fill="#6ee7b7" fontSize="10">Cl</text>

                  {/* Bonds */}
                  <line x1="150" y1="175" x2="230" y2="130" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 2" />
                  <line x1="150" y1="175" x2="90" y2="220" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 2" />

                  {/* propeller arrow */}
                  <path d="M 100 150 A 60 60 0 0 1 200 150" fill="none" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowGold)" />
                  <text x="150" y="140" textAnchor="middle" fill="#fcd34d" fontSize="10" fontWeight="bold">↻ o‘ng propeller</text>
                </g>
              )}

              {/* Λ enantiomer */}
              {(activeEnantiomer === "Λ" || activeEnantiomer === "both") && (
                <g opacity={activeEnantiomer === "both" ? 0.9 : 1}>
                  <text x="600" y="30" textAnchor="middle" fill="#93c5fd" fontSize="16" fontWeight="bold">
                    Λ-cis-[Co(en)₂Cl₂]⁺
                  </text>
                  <text x="600" y="48" textAnchor="middle" fill="#60a5fa" fontSize="10">
                    [α]D = −89°, CD manfiy @ 540 nm
                  </text>

                  <circle cx="600" cy="175" r="14" fill="#8b0080" stroke="#fff" strokeWidth="2" />
                  <text x="600" y="180" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Co</text>

                  {/* Ko‘zgu — Δ ni gorizontal aksi */}
                  <path d="M 600 175 L 650 130 Q 670 110 650 90 Q 630 70 610 90 L 600 175" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                  <path d="M 600 175 L 550 220 Q 530 240 550 260 Q 570 280 590 260 L 600 175" fill="none" stroke="#3b82f6" strokeWidth="2.5" />

                  <circle cx="650" cy="130" r="7" fill="#3b82f6" />
                  <circle cx="610" cy="90" r="7" fill="#3b82f6" />
                  <circle cx="550" cy="220" r="7" fill="#3b82f6" />
                  <circle cx="590" cy="260" r="7" fill="#3b82f6" />

                  <circle cx="520" cy="130" r="8" fill="#10b981" /><text x="490" y="130" fill="#6ee7b7" fontSize="10">Cl</text>
                  <circle cx="660" cy="220" r="8" fill="#10b981" /><text x="675" y="220" fill="#6ee7b7" fontSize="10">Cl</text>

                  <line x1="600" y1="175" x2="520" y2="130" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 2" />
                  <line x1="600" y1="175" x2="660" y2="220" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 2" />

                  <path d="M 650 150 A 60 60 0 0 0 550 150" fill="none" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowGold)" />
                  <text x="600" y="140" textAnchor="middle" fill="#fcd34d" fontSize="10" fontWeight="bold">↺ chap propeller</text>
                </g>
              )}

              {/* Ko‘zgu chizig‘i */}
              {activeEnantiomer === "both" && (
                <>
                  <line x1="375" y1="60" x2="375" y2="300" stroke="#fff" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                  <text x="375" y="325" textAnchor="middle" fill="#fff" fontSize="12" fontStyle="italic">
                    Ko‘zgu tekisligi (enantiomerlar)
                  </text>
                </>
              )}

              <defs>
                <marker id="arrowGold" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
                  <path d="M0,0 L7,3 L0,6" fill="#fbbf24" />
                </marker>
              </defs>
            </svg>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {enantiomers.map((e, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 border-2"
                  style={{
                    borderColor: e.color,
                    background: `${e.color}15`,
                  }}
                >
                  <div className="font-bold text-lg mb-2" style={{ color: e.color }}>
                    {e.label}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-violet-300">Chirallik:</div>
                    <div className="text-white">{e.handedness}</div>
                    <div className="text-violet-300">[α]D:</div>
                    <div className="text-white font-bold">{e.rotation}</div>
                    <div className="text-violet-300">CD belgi:</div>
                    <div className="text-white">{e.cdSign} @ {e.cdLambda}</div>
                  </div>
                  <p className="text-xs text-violet-200 mt-3 italic">{e.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WERNER TAJRIBASI */}
          <div className="bg-gradient-to-r from-yellow-900/40 to-violet-900/40 rounded-2xl p-6 border border-yellow-500/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏆</span>
              <h3 className="text-2xl font-bold text-yellow-200">Werner tajribasi (1911–1913)</h3>
            </div>
            <div className="space-y-3">
              {wernerExperiment.map((w, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="text-xl font-black text-amber-300 font-bold">{w.year}</span>
                  </div>
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-yellow-400 mt-2" />
                  <div className="flex-1">
                    <div className="font-semibold text-yellow-100">{w.event}</div>
                    <div className="text-sm text-yellow-200/70 mt-1">{w.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-300 font-bold/70 italic mt-4 border-t border-yellow-500/20 pt-3">
              Manba: Werner, A. Nobel Lecture (1913); Kauffman, G.B. (1966) “Alfred Werner: Founder
              of Coordination Chemistry”.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            5. cis vs trans QIYOSIY JADVAL
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-violet-300 to-green-300 bg-clip-text text-transparent">
            4. cis vs trans — bir formula, ikki dunyo
          </h2>

          <div className="bg-purple-900/30 rounded-2xl border border-violet-500/30 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-violet-800/50 to-green-800/50">
                <tr>
                  <th className="p-3 text-left text-violet-200">Parametr</th>
                  <th className="p-3 text-left text-violet-200">cis-[Co(en)₂Cl₂]⁺ (Violeo)</th>
                  <th className="p-3 text-left text-green-200">trans-[Co(en)₂Cl₂]⁺ (Praseo)</th>
                  <th className="p-3 text-left text-yellow-200">Farq va sabab</th>
                </tr>
              </thead>
              <tbody>
                {cisVsTrans.map((r, i) => (
                  <tr key={i} className="border-t border-violet-500/10 hover:bg-purple-800/20">
                    <td className="p-3 font-semibold text-violet-100">{r.parametr}</td>
                    <td className="p-3 text-violet-200">{r.cis}</td>
                    <td className="p-3 text-green-200">{r.trans}</td>
                    <td className="p-3 text-yellow-200/80 text-xs italic">{r.farq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            6. AKVATSIYA KINETIKASI SIMULATOR
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
            5. Akvatsiya kinetikasi — SN1 mexanizmi (Taube, Nobel 1983)
          </h2>

          <div className="bg-purple-950/50 rounded-2xl p-6 border border-fuchsia-500/30 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-fuchsia-200 mb-4">Boshqaruv panelli</h3>

                <div className="mb-4">
                  <label className="text-sm text-violet-300 flex justify-between mb-1">
                    <span>Temperatur T = {temperature}°C</span>
                    <span className="text-fuchsia-300">{(temperature + 273.15).toFixed(1)} K</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="1"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full accent-fuchsia-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm text-violet-300 flex justify-between mb-1">
                    <span>pH = {pH}</span>
                    <span className="text-fuchsia-300">
                      {pH < 3 ? "kuchli kislotali" : pH < 7 ? "kislotali" : pH < 10 ? "asosli" : "kuchli asosli"}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="13"
                    step="0.5"
                    value={pH}
                    onChange={(e) => setPH(Number(e.target.value))}
                    className="w-full accent-fuchsia-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm text-violet-300 flex justify-between mb-1">
                    <span>Vaqt = {aquationTime} soat</span>
                    <span className="text-fuchsia-300">{(aquationTime / 24).toFixed(1)} kun</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="168"
                    step="1"
                    value={aquationTime}
                    onChange={(e) => setAquationTime(Number(e.target.value))}
                    className="w-full accent-fuchsia-500"
                  />
                </div>

                <div className="bg-purple-900/50 rounded-lg p-4 mt-4">
                  <div className="text-xs text-fuchsia-400 mb-2">Real vaqt hisoblovi:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-violet-300">Rate k:</span>
                      <span className="text-fuchsia-200 font-mono">{k_aq.toExponential(2)} s⁻¹</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-violet-300">t½ (yarim davr):</span>
                      <span className="text-fuchsia-200 font-mono">
                        {(0.693 / k_aq / 3600).toFixed(1)} soat
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-violet-300">Akvatsiyalangan:</span>
                      <span className="text-fuchsia-200 font-mono">
                        {(fractionAquated * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-fuchsia-200 mb-4">Rang o‘zgarishi</h3>
                <div
                  className="w-full h-48 rounded-2xl border-4 border-white/30 transition-all duration-500 flex items-center justify-center"
                  style={{ background: currentColor }}
                >
                  <div className="text-white font-bold text-lg text-center">
                    {fractionAquated < 0.1
                      ? "cis-[Co(en)₂Cl₂]⁺"
                      : fractionAquated > 0.9
                      ? "cis-[Co(en)₂(H₂O)Cl]²⁺"
                      : "aralashma"}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-purple-900/50 rounded">
                    <span className="text-violet-300">Boshlang‘ich:</span>
                    <span className="text-white">binafsha (violet)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-purple-900/50 rounded">
                    <span className="text-violet-300">Yakuniy:</span>
                    <span className="text-white">pushti (aquapentaamin)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-purple-900/50 rounded">
                    <span className="text-violet-300">Mexanizm:</span>
                    <span className="text-white">{aquationData.cis.mechanism}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-purple-900/50 rounded">
                    <span className="text-violet-300">Retentsiya:</span>
                    <span className="text-white">95% cis saqlanadi</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-fuchsia-900/30 rounded-lg p-4 border border-fuchsia-500/30">
              <div className="font-mono text-center text-fuchsia-100">
                cis-[Co(en)₂Cl₂]⁺ + H₂O → cis-[Co(en)₂(H₂O)Cl]²⁺ + Cl⁻
              </div>
              <div className="text-xs text-fuchsia-300 text-center mt-2 italic">
                Basolo & Pearson (1967): Retentsiya 95% cis-mahsulot, faqat 5% racemizatsiya. SN1
                mexanizmi (D — disotsiativ) — Taube (Nobel 1983) tomonidan tasdiqlangan.
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            7. BEER-LAMBERT KALKULYATOR
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
            6. Beer-Lambert kalkulyatori
          </h2>

          <div className="bg-purple-950/50 rounded-2xl p-6 border border-violet-500/30">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="text-sm text-violet-300 mb-2 block">Yo‘lakcha tanlash:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {uvVisPeaks.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedBand(i)}
                        className={`p-2 rounded-lg text-xs transition ${
                          selectedBand === i
                            ? "bg-violet-500 text-white"
                            : "bg-purple-800/50 text-violet-300 hover:bg-purple-700/50"
                        }`}
                      >
                        {p.lambda} nm ({p.type})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-violet-300 flex justify-between mb-1">
                    <span>Konsentratsiya c = {conc.toExponential(2)} M</span>
                  </label>
                  <input
                    type="range"
                    min="-6"
                    max="-2"
                    step="0.1"
                    value={Math.log10(conc)}
                    onChange={(e) => setConc(Math.pow(10, Number(e.target.value)))}
                    className="w-full accent-violet-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm text-violet-300 flex justify-between mb-1">
                    <span>Yo‘l uzunligi l = {pathL.toFixed(2)} cm</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={pathL}
                    onChange={(e) => setPathL(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                </div>

                <div className="bg-purple-900/50 rounded-lg p-4">
                  <div className="text-xs text-violet-400 mb-2">Formula:</div>
                  <div className="font-mono text-center text-lg text-violet-200 mb-2">
                    A = ε · c · l
                  </div>
                  <div className="text-xs text-violet-300 text-center">
                    ε = {uvVisPeaks[selectedBand].epsilon} M⁻¹cm⁻¹, c = {conc.toExponential(2)} M, l = {pathL} cm
                  </div>
                </div>
              </div>

              <div>
                <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
                  <div className="text-xs text-violet-300 mb-1">Absorbansiya (A)</div>
                  <div className="text-5xl font-black text-white mb-2">{A.toFixed(3)}</div>
                  <div className="text-xs text-violet-400">
                    {A < 0.1 ? "Juda past" : A < 0.7 ? "Optimal" : A < 2 ? "Yuqori" : "O‘lchov chegarasidan yuqori"}
                  </div>
                </div>

                <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
                  <div className="text-xs text-[var(--v3-matn)] mb-1">Transmittansiya (T%)</div>
                  <div className="text-5xl font-black text-white mb-2">{T.toFixed(2)}%</div>
                  <div className="text-xs text-[var(--v3-xira)]">
                    {T > 90 ? "Deyarli o‘tuvchan" : T > 10 ? "Yaxshi o‘lchov" : "Kuchli yutilish"}
                  </div>
                </div>

                <div className="mt-4 h-4 bg-purple-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all"
                    style={{ width: `${Math.min(100, T)}%` }}
                  />
                </div>
                <div className="text-xs text-center text-violet-300 mt-1">Yorug‘lik o‘tishi</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            8. WERNER KOORDINATSION SERIYA
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-yellow-300 via-violet-300 to-green-300 bg-clip-text text-transparent">
            7. Werner koordinatsion seriyasi — ranglar do‘koni
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {wernerSeries.map((w, i) => (
              <div
                key={i}
                className={`rounded-2xl p-5 border-2 transition-all ${
                  w.current
                    ? "border-fuchsia-400 scale-105 shadow-2xl shadow-fuchsia-500/30"
                    : "border-violet-500/30"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${w.color}20, ${w.color}10)`,
                }}
              >
                <div
                  className="w-full h-24 rounded-lg mb-3 border-2 border-white/30"
                  style={{ background: w.color }}
                />
                <div className="text-sm font-mono text-white mb-1">{w.formula}</div>
                <div className="text-xs font-bold" style={{ color: w.color }}>
                  {w.name}
                </div>
                <div className="text-xs text-violet-300 mt-2 space-y-0.5">
                  <div>Rang: {w.colorName}</div>
                  <div>λ: {w.lmax} nm</div>
                  <div>ε: {w.epsilon}</div>
                  <div>Sim: {w.symmetry}</div>
                  <div>Izomer: {w.isomers}</div>
                </div>
                {w.current && (
                  <div className="mt-2 text-xs bg-fuchsia-500/30 text-fuchsia-200 rounded px-2 py-1 text-center">
                    ⭐ Hozirgi
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            9. NAMUNA TAYYORLASH
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
            8. Namuna tayyorlash usullari
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {preparationMethods.map((m, i) => (
              <button
                key={i}
                onClick={() => setActivePreparation(i)}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  activePreparation === i
                    ? "bg-violet-500 text-white"
                    : "bg-purple-800/50 text-violet-300 hover:bg-purple-700/50"
                }`}
              >
                {m.icon} {m.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-900/30 rounded-2xl border border-violet-500/30 p-6">
            {(() => {
              const m = preparationMethods[activePreparation];
              return (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{m.icon}</span>
                    <h3 className="text-2xl font-bold text-violet-200">{m.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {[
                      ["Chastota diapazoni", m.range],
                      ["Ajratish qobiliyati", m.resolution],
                      ["pH", m.ph],
                      ["Konsentratsiya", m.conc],
                      ["Vaqt", m.duration],
                    ].map(([k, v], i) => (
                      <div key={i} className="bg-purple-950/50 rounded-lg p-3">
                        <div className="text-xs text-violet-400">{k}</div>
                        <div className="text-sm font-semibold text-white mt-1">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                      <div className="text-sm font-bold text-green-300 mb-1"> Ustunliklari</div>
                      <div className="text-sm text-green-100">{m.advantage}</div>
                    </div>
                    <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30">
                      <div className="text-sm font-bold text-red-300 mb-1">️ Kamchiliklari</div>
                      <div className="text-sm text-red-100">{m.disadvantage}</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            10. XALAQIT FAKTORLARI
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
            9. Xalaqit beruvchi faktorlar
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {interferences.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveInterference(i)}
                className={`px-3 py-1.5 rounded-lg text-xs transition ${
                  activeInterference === i
                    ? "bg-red-500 text-white"
                    : "bg-purple-800/50 text-violet-300 hover:bg-purple-700/50"
                }`}
              >
                {i + 1}. {interferences[i].factor.slice(0, 30)}
                {interferences[i].factor.length > 30 ? "…" : ""}
              </button>
            ))}
          </div>

          <div className="bg-purple-900/30 rounded-2xl border border-red-500/30 p-6">
            {(() => {
              const int = interferences[activeInterference];
              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-red-200">{int.factor}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        int.severity === "yuqori"
                          ? "bg-red-500/30 text-red-200"
                          : int.severity === "o‘rta"
                          ? "bg-orange-500/30 text-orange-200"
                          : "bg-yellow-500/30 text-yellow-200"
                      }`}
                    >
                      {int.severity} darajali
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-red-900/30 rounded-lg p-4">
                      <div className="text-xs text-red-400 mb-1">Ta’siri:</div>
                      <div className="text-red-100">{int.effect}</div>
                    </div>
                    <div className="bg-green-900/30 rounded-lg p-4">
                      <div className="text-xs text-green-400 mb-1">Yechim:</div>
                      <div className="text-green-100">{int.solution}</div>
                    </div>
                    {int.kinetics !== "—" && (
                      <div className="bg-purple-900/30 rounded-lg p-4">
                        <div className="text-xs text-violet-400 mb-1">Kinetika:</div>
                        <div className="text-violet-100 font-mono">{int.kinetics}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            11. TARIXIY XRONOLOGIYA
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-yellow-300 to-violet-300 bg-clip-text text-transparent">
            10. Tarixiy xronologiya
          </h2>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-yellow-500 to-fuchsia-500" />
            <div className="space-y-4">
              {historyTimeline.map((h, i) => (
                <div key={i} className="relative flex items-start gap-4 pl-4">
                  <div
                    className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
                      h.nobel
                        ? "bg-yellow-400 border-yellow-200 shadow-lg shadow-yellow-500/50"
                        : "bg-violet-400 border-violet-200"
                    }`}
                  />
                  <div className="w-16 text-right flex-shrink-0">
                    <span className={`font-black ${h.nobel ? "text-amber-300 font-bold" : "text-violet-300"}`}>
                      {h.year}
                    </span>
                  </div>
                  <div className="flex-1 bg-purple-900/30 rounded-lg p-3 border border-violet-500/20 ml-4">
                    <div className="text-sm text-white">
                      {h.event}
                      {h.nobel && <span className="ml-2 text-amber-400 font-bold">🏆 NOBEL</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            12. AMALIY QO‘LLANILISHI
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
            11. Amaliy qo‘llanilishi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {applications.map((a, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 rounded-2xl p-5 border border-violet-500/30 hover:border-fuchsia-400/50 transition"
              >
                <div className="text-4xl mb-3">{a.icon}</div>
                <div className="font-bold text-violet-200 mb-2">{a.title}</div>
                <div className="text-sm text-violet-300 mb-2">{a.desc}</div>
                <div className="text-xs text-fuchsia-300 italic border-t border-violet-500/20 pt-2 mt-2">
                  {a.example}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            13. XULOSA
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
            12. Asosiy xulosalar
          </h2>

          <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
            <ol className="space-y-3 text-violet-100">
              {[
                "cis-[Co(en)₂Cl₂]Cl (Violeo) — Werner koordinatsion nazariyasining eng muhim tajribaviy tasdig‘i (1911–1913).",
                "cis-izomer C₂ simmetriyaga ega bo‘lgani uchun Δ va Λ enantiomerlarga ajraladi — metall atomida karbondsiz chirallik.",
                "trans-izomer D₂ₕ simmetriyali mesoform — bu oktaedrik strukturaning (kvadrat-yassi rad etilishi) to‘liq isboti.",
                "UB-Vis spektrida cis-Violeo 4 ta d–d yo‘lakcha ko‘rsatadi (540, 385, 355, 610 nm), trans-Praseo esa 2 ta yo‘lakcha (620, 445 nm).",
                "Δo = 22 400 cm⁻¹ (Luteo bilan bir xil), lekin ε (Violeo) = 82 vs ε (Praseo) = 34 — simmetriya sinishi Laporte taqiqni yumshatadi.",
                "Akvatsiya SN1 (D) mexanizm bilan boradi, cis-mahsulot 95% retentsiya bilan hosil bo‘ladi (Basolo & Pearson, 1967).",
                "cis-izomer suvda 2,6× yaxshi eriydi (8,4 vs 3,2 g/100mL) — dipol momenti 4,8 D bilan bog‘liq.",
                "CD spektri Δ enantiomerda 540 nm da musbat, Λ da manfiy Cotton effekti beradi — analitik ajratish uchun asos.",
                "d⁶ LS konfiguratsiya (t₂g⁶ eg⁰) diamagnetik holat beradi (μ_eff = 0 μB) — Δo > P pairing energiyasi.",
                "Ta’lim ahamiyati: geometrik + optik izomeriya, Werner Nobel + Taube Nobel, kristall maydon, simmetriya guruhlari — hammasi bir birikmada.",
              ].map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{c}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            14. ADABIYOTLAR
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
            13. Adabiyotlar
          </h2>

          <div className="bg-purple-900/30 rounded-2xl border border-violet-500/30 p-6">
            <ol className="space-y-3 text-sm text-violet-100">
              {references.map((r) => (
                <li key={r.id} className="flex gap-3">
                  <span className="flex-shrink-0 text-fuchsia-400 font-bold">[{r.id}]</span>
                  <div>
                    <div className="italic">{r.text}</div>
                    {r.doi && (
                      <a
                        href={`https://doi.org/${r.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-300 hover:text-blue-200 mt-1 inline-block"
                      >
                        DOI: {r.doi}
                      </a>
                    )}
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-300 hover:text-blue-200 mt-1 inline-block"
                      >
                        🔗 Havola
                      </a>
                    )}
                    {r.isbn && (
                      <span className="text-xs text-violet-400 mt-1 inline-block">
                        ISBN: {r.isbn}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            15. NAVIGATSIYA
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/ilmiy/tahlil/ub-vis/birikmalar/co-en3-cl3"
              className="p-5 bg-purple-900/30 rounded-2xl border border-violet-500/30 hover:border-violet-400 transition group"
            >
              <div className="text-xs text-violet-400 mb-1">← Oldingi</div>
              <div className="text-lg font-bold text-white group-hover:text-violet-200">
                [Co(en)₃]Cl₃
              </div>
              <div className="text-xs text-violet-300 mt-1">Chelato · D₃ · Δ/Λ</div>
            </Link>

            <button
              onClick={() => setPdfModalOpen(true)}
              className="p-5 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 rounded-2xl border border-fuchsia-400/50 hover:border-fuchsia-300 transition text-center"
            >
              <div className="text-3xl mb-1">📥</div>
              <div className="text-lg font-bold text-white">PDF hisobot</div>
              <div className="text-xs text-fuchsia-200 mt-1">To‘liq ilmiy hujjat</div>
            </button>

            <Link
              href="/ilmiy/tahlil/ub-vis/birikmalar"
              className="p-5 bg-purple-900/30 rounded-2xl border border-violet-500/30 hover:border-violet-400 transition group"
            >
              <div className="text-xs text-violet-400 mb-1">Katalog →</div>
              <div className="text-lg font-bold text-white group-hover:text-violet-200">
                Barcha birikmalar
              </div>
              <div className="text-xs text-violet-300 mt-1">25 ta kompleks</div>
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center py-8 border-t border-violet-500/20 mt-16">
          <p className="text-sm text-violet-400">
            © 2026 <span className="font-bold text-violet-200">jdakimyo.uz</span> · Muallif:{" "}
            <span className="font-bold text-fuchsia-300">Diyor</span>
          </p>
          <p className="text-xs text-violet-500 italic mt-2">
            Ilmiy chuqurlik: Werner Nobel (1913) · Taube Nobel (1983) · Barton (Caltech)
          </p>
        </footer>
      </div>
    </div>
  );
}
