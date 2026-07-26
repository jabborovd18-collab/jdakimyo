"use client"

import Link from "next/link"
import { useState, useMemo, useRef } from "react"
import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₅(NO₂)]Cl₂ — NITRO-PENTAAMMINKOBALT(III)
// YaMR SAHIFA (ILMIY CHUQURLASHTIRILGAN, PDF EKSPORT BILAN)
// Manbalar: Jorgensen (1894), Werner (Nobel 1913), Ramsey (1950),
//           PMC9077707 (ωB97XD), ScienceDirect S0040603103003617 (DSC),
//           Naumov (2013, photo-salient), Cotton-Wilkinson, Miessler-Tarr
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>(NO<sub>2</sub>)]Cl<sub>2</sub>",
  formulaPlain: "[Co(NH3)5(NO2)]Cl2",
  iupac: "Pentaammin(nitrito-κN)kobalt(III) xlorid",
  commonName: "Xanto-tuz (sariq nitro-izomer)",
  molarMass: 261.44,
  casNumber: "14970-14-0",
  color: "sariq (yellow)",
  structure: "Buzilgan oktaedr — psevdo-oktaedrik C₄ᵥ",
  metalLigand: "Co–N(NO₂), Co–N(NH₃)×5",
  pointGroup: "C₄ᵥ",
  electrolyteType: "1:2 elektrolit (kation:2 Cl⁻)",
  molarConductivity: "~260 S·cm²·mol⁻¹ (H₂O, 25°C, 10⁻³ M)",
  discovery: "S.M. Jorgensen, 1894",
  synthesisRef: "Basolo & Pearson, Mechanisms of Inorganic Reactions (1967)",
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. KRISTALL MAYDON NAZARIYASI (chuqur, matematik)
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.crystalField = {
  metalIon: "Co³⁺",
  electronConfig: "[Ar] 3d⁶",
  dElectrons: 6,
  spinState: "Past spinli (S = 0, diamagnit)",
  orbitalOccupancy: "t₂g⁶ eg⁰",
  unpairedElectrons: 0,
  magneticMoment: "μ_eff ≈ 0 μB (diamagnit; kichik TIP hissasi ~0.1 μB)",
  crystalFieldSplitting: "Δ_o ≈ 23 600 cm⁻¹ (2.93 eV, 282 kJ/mol)",
  racahParameter: "B ≈ 580 cm⁻¹ (erkin ion B₀ = 1120 cm⁻¹)",
  nephelauxeticRatio: "β = B/B₀ ≈ 0.52 (kovalent hissa 48%)",
  pairingEnergy: "P ≈ 21 000 cm⁻¹ (Racah B, C ≈ 4B orqali)",
  cfse: "CFSE = −0.4·Δ_o × 6 + 0.6·Δ_o × 0 = −2.4·Δ_o ≈ −56 640 cm⁻¹ ≈ −677 kJ/mol",
  cfseNet: "Netto: CFSE − P·(nₚ−nₚ⁰) ≈ −56 640 + 2P ≈ −14 640 cm⁻¹ (past spin stabilizatsiyasi)",
  spectrochemicalSeries: "I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < NO₂⁻ (N-b) < CN⁻ < CO",
  whyLowSpin: "Δ_o (23 600) > P (21 000) — juftlanish energiyasidan qimmatroq. Barcha 6 elektron t₂g ga to'planadi. NO₂⁻ π-akseptor ligand — Δ_o ni oshiradi.",
  colorOrigin: "d–d o'tish ¹A₁g → ¹T₁g (F): 22 000 cm⁻¹ ≈ 455 nm (ko'k-fioletni yutadi → sariq rang). Ikkinchi o'tish ¹A₁g → ¹T₂g: ~30 000 cm⁻¹.",
  chargeTransfer: "LMCT (NO₂⁻ π* → Co dσ*): ~35 000 cm⁻¹ (285 nm, UV). Sariq rangning intensivligini oshiradi.",
  jahnTellerNote: "t₂g⁶ eg⁰ konfiguratsiyada Jahn-Teller effekti YOQ (barcha ekvivalent orbitallar band). Buzilish faqat NO₂⁻ ↔ NH₃ ligand farqidan."
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. SIMMETRIYA VA XARAKTERLAR JADVALI (C₄ᵥ)
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.symmetry = {
  pointGroup: "C₄ᵥ",
  order: 8,
  symmetryElements: ["E", "2C₄", "C₂", "2σᵥ", "2σᵈ"],
  parentGroup: "Oₕ dan tushirilgan (bitta NH₃ → NO₂ almashinuvi)",
  descentInSymmetry: "Oₕ (48) → C₄ᵥ (8): C₄ o'qi NO₂⁻ orqali o'tadi",
  characterTable: {
    A1: { E: 1, C4: 1, C2: 1, sv: 1, sd: 1, functions: "z; x²+y², z²" },
    A2: { E: 1, C4: 1, C2: 1, sv: -1, sd: -1, functions: "Rz" },
    B1: { E: 1, C4: -1, C2: 1, sv: 1, sd: -1, functions: "x²−y²" },
    B2: { E: 1, C4: -1, C2: 1, sv: -1, sd: 1, functions: "xy" },
    E:  { E: 2, C4: 0, C2: -2, sv: 0, sd: 0, functions: "(x,y); (Rx,Ry); (xz,yz)" },
  },
  dOrbitalReduction: "Oₕ: t₂g (dxy, dxz, dyz) → C₄ᵥ: b₂ (dxy) + e (dxz, dyz); eg (dx²−y², dz²) → C₄ᵥ: b₁ (dx²−y²) + a₁ (dz²)",
  nmrEquivalence: "C₄ᵥ da 5 ta NH₃ dan 4 tasi (ekvatorial, σᵥ va σᵈ tekisligida) ekvivalent — bitta signal. 1 tasi (trans-NO₂, apikal) alohida signal berishi kerak edi. Amaliyotda, tez proton almashinuvi va NH₃ aylanishi tufayli barcha 15 H bir singlet ko'rinadi (298 K). Past haroratda (< 200 K, DMSO-d₆) 2 signal (nisbat 4:1) ajraladi.",
  irActive: "A₁, B₁, B₂, E — barchasi IR/Raman faol (C₄ᵥ da inversiya markazi yo'q, o'zaro istisno qoidasi ishlamaydi)",
  ramanActive: "A₁, B₁, B₂, E — barchasi Raman faol",
  mutualExclusion: "YO'Q — C₄ᵥ da i (inversiya) yo'q. IR va Raman polosalar ustma-ust tushadi.",
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. YaMR NAZARIYASI — chuqur ilmiy (Ramsey + Solomon-Bloembergen + kvadrupol)
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.nmrTheory = {
  h1: {
    nucleus: "¹H",
    spin: "I = 1/2",
    gamma: "26.7522 × 10⁷ rad·s⁻¹·T⁻¹",
    naturalAbundance: "99.985%",
    larmor400: "400.13 MHz (9.4 T)",
    shift: "δ = 3.5 ppm (NH₃, DMSO-d₆, 298 K)",
    referens: "TMS (Si(CH₃)₄) — δ = 0.00 ppm",
    whyThisShift: "Erkin NH₃ (l): δ ≈ 0.9 ppm. [Co(NH₃)₅NO₂]²⁺ da NH₃ protonlari deshieldlangan (Δδ = +2.6 ppm). Sabab: Co³⁺ formal zaryadi +3 — N ning yolg'iz juft elektronlari Co ga siljiydi, natijada N–H σ* orbitalidan H yadrosining elektron zichligi kamayadi. Ramsey formulasi bo'yicha σ_para hissasi ortadi (σ = σ_dia + σ_para, δ = σ_ref − σ_sample).",
    multiplicity: "Singlet (298 K); ekvivalent NH₃ lar, ¹⁴N kvadrupol tufayli ¹J(N,H) qulflab qo'yiladi (self-decoupling)",
    linewidth: "Δν₁/₂ ≈ 5–15 Hz (o'tkir, diamagnit muhit)",
    t1Relaxation: "T₁ ≈ 1–3 s (dipol-dipol H–H va H–N; kichik CSA)",
    t2Relaxation: "T₂ ≈ 0.5–2 s (T₂ ≈ T₁ suyuqlikda, tez tumbling)",
    coupling: "¹J(¹⁵N–¹H) ≈ 73 Hz (¹⁵N boyitilgan namunada dublet); ²J(H–Co–H) ≈ 0 (¹⁴N kvadrupol yashiradi)",
    integration: "15 H (5 NH₃ × 3 H)",
    solvent: "DMSO-d₆ afzal (D₂O da tez H/D almashinuv tufayli signal yo'qoladi)",
  },
  n15: {
    nucleus: "¹⁵N",
    spin: "I = 1/2",
    gamma: "−2.712 × 10⁷ rad·s⁻¹·T⁻¹ (manfiy!)",
    naturalAbundance: "0.365%",
    larmor400: "40.55 MHz (9.4 T)",
    sensitivity: "3.85 × 10⁻⁶ (¹H ga nisbatan) — 260 000 marta past. ¹⁵N-boyitilgan namunalar (>98%) tavsiya etiladi.",
    shift_NO2: "δ(NO₂, N-koordinatsiyalangan) = +412 ppm (yoki +650 ppm eski referensda, CH₃NO₂ vs NH₃(l))",
    shift_NH3: "δ(NH₃, koord.) = −340 ppm (NH₃(l) = 0 shkalasida) yoki ~+45 ppm (CH₃NO₂ shkalasi)",
    referens: "IUPAC: CH₃NO₂ (nitrometan) — δ = 0.00 ppm; muqobil: NH₃(liq, 25°C) — δ = 0 (bu shkalada CH₃NO₂ = +380.2 ppm)",
    whyThisShift: "NO₂⁻ (erkin) da ¹⁵N ≈ +420 ppm. N-koord. da faqat kichik siljish (~+8 ppm) — chunki azotning yolg'iz juft elektronlari sigma-donatsiyada ishtirok etadi, lekin π-akseptorlik (NO₂⁻ ning π* orbitallari) elektron zichlikni qaytaradi. O-koord. (nitrito) izomerda ¹⁵N +560 ppm — 118 ppm past chastota (yuqori chastota shkalasida). Farq: nitro izomerda N π-tizimda, nitrito izomerda N sp²-lokalizatsiyalangan.",
    linkageDiscrimination: "Δδ(nitro − nitrito) ≈ 118–150 ppm (spektrometr va referensga qarab). Bu — linkage izomerizmni farqlashning eng aniq usuli (IR: farq 200 cm⁻¹; UV: farq 40 nm).",
    linewidth: "Δν₁/₂ ≈ 20–60 Hz (CSA dominant, Δσ(NO₂) ≈ 500 ppm)",
    t1Relaxation: "T₁ ≈ 30–120 s (uzoq — CSA, NOE γ_H/γ_N < 0 tufayli manfiy)",
    csa: "Kimyoviy siljish anizotropiyasi Δσ ≈ 500–700 ppm (NO₂ uchun; asimmetriya η ≈ 0.2–0.4)",
    couplingToCo: "¹J(⁵⁹Co–¹⁵N) ≈ 30–50 Hz — ⁵⁹Co kvadrupol tufayli aslida ko'rinmaydi (self-decoupled)",
  },
  co59: {
    nucleus: "⁵⁹Co",
    spin: "I = 7/2 (kvadrupol!)",
    gamma: "6.332 × 10⁷ rad·s⁻¹·T⁻¹",
    naturalAbundance: "100%",
    larmor400: "94.85 MHz (9.4 T)",
    quadrupoleMoment: "Q(⁵⁹Co) = +0.42 barns (juda katta)",
    shift: "δ = +8100 dan +8300 ppm gacha (referens [Co(CN)₆]³⁻ = 0)",
    referens: "K₃[Co(CN)₆] (aq) = 0.00 ppm (IUPAC); muqobil: [Co(en)₃]³⁺ = +7180 ppm",
    whyThisShift: "⁵⁹Co siljish diapazoni ~19 000 ppm — barcha yadrolar orasidagi eng katta. Sabab: Ramsey σ_para hissasi juda katta (kichik ΔE(d-d)). Kompleks ligandi qanchalik zaif maydonli bo'lsa, Δ_o kichraydi va shu bilan σ_para (∝ 1/ΔE) ortadi → δ yuqori chastotaga siljiydi. Buhro-Griffith empirik qoidasi: δ(⁵⁹Co) ≈ A − B/Δ_o.",
    quadrupolarBroadening: "C₄ᵥ simmetriyada elektr maydon gradienti (EFG) NOL EMAS — trans-N(NO₂) va cis-N(NH₃) farq qiladi. eQqzz/h = 15–25 MHz. Asimmetriya η ≈ 0.1–0.3.",
    linewidth: "Δν₁/₂ ≈ 500–3000 Hz (kvadrupol relaksatsiya, 1/T₂ ∝ CQ²·τc). Oktaedrik [Co(NH₃)₆]³⁺ (kubik simmetriya) da esa Δν₁/₂ ≈ 5–20 Hz.",
    t1Relaxation: "T₁ ≈ 0.1–5 ms (juda qisqa)",
    detection: "1D-⁵⁹Co: 512–4096 skan yetarli (yuqori γ va 100% tabiiy tarqalish); yuqori konsentratsiya (>0.1 M) tavsiya etiladi. Solid-state ⁵⁹Co NMR: WURST-QCPMG texnikasi bilan CQ va η aniq o'lchanadi.",
    applications: "1) Sis/trans farqlash (siljish farqi 200–800 ppm); 2) Spektrokimyoviy qatorda ligand kuchini tahlil; 3) Solvatochromik effekt (H₂O ↔ DMSO da Δδ ≈ 100 ppm); 4) Kvadrupol parametrlaridan lokal simmetriyani aniqlash.",
  },
}
// ═══════════════════════════════════════════════════════════
// PDF UCHUN MATN TOZALAGICH
// ═══════════════════════════════════════════════════════════
const cleanText = (str) => {
  if (str === null || str === undefined) return ""
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. STRUKTURAVIY PARAMETRLAR (X-ray + DFT)
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.structural = {
  bondLengths: {
    coN_NO2:      "1.938(3) Å — Co–N(NO₂), qisqaroq (π-akseptor)",
    coN_NH3_trans:"1.978(4) Å — Co–N(NH₃) trans-NO₂ (trans-effekt tufayli uzunroq)",
    coN_NH3_cis:  "1.958(3) Å — Co–N(NH₃) cis-NO₂ (o'rtacha 4 ta)",
    n_O_nitro:    "1.245(4) Å — N–O (nitro NO₂, formal 1.5-bog')",
    referenceCoN6: "[Co(NH₃)₆]³⁺ da barcha Co–N = 1.966 Å (D₃d)",
    source: "Cambridge Structural Database (CSD): PARBUL, KABTOG",
  },
  bondAngles: {
    ono_nitro:    "117.5(3)° — O–N–O (nitro), sp² gibridlanish",
    coN_O:        "122° — Co–N–O (nitro)",
    N_Co_N_cis:   "89.6–90.4° (ideal 90°)",
    N_Co_N_trans: "178.9° (ideal 180°)",
    dihedralNO2:  "~45° — NO₂ tekisligi ekvatorial N–Co–N ga nisbatan",
    nitritoComparison: "Nitrito izomerda O–N–O = 115°, Co–O–N = 118°",
  },
  transEffect: {
    definition: "Trans-effekt — kinetik hodisa (L ligandi trans-L' almashinuvini tezlashtiradi). Trans-influence — strukturaviy (M–L' bog'ini bo'shashtiradi).",
    order: "CN⁻ > NO₂⁻ > NH₃ > H₂O (oktaedrik Co(III) uchun)",
    mechanism: "NO₂⁻: (1) σ-donor lp(N) → Co dz² to'ldiradi; (2) π-akseptor NO₂ π* ← Co dxz/dyz elektron oladi.",
    consequence: "trans-Co–N(NH₃) bog'i cis-Co–N(NH₃) dan 0.020(5) Å uzunroq. ¹⁵N NMR: trans-NH₃ signali cis-NH₃ dan 5–10 ppm siljigan.",
  },
  hydrogenBonding: "Qattiq holatda N–H···O(NO₂) va N–H···Cl bog'lari. H···Cl ≈ 2.32 Å, H···O ≈ 2.15 Å. Photo-salient effektning kristall panjaraga tarqalishida kritik rol o'ynaydi.",
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. TERMODINAMIKA & KINETIKA (DSC + Eyring)
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.thermodynamics = {
  isomerization: {
    reaction: "[Co(NH₃)₅(ONO)]²⁺  →  [Co(NH₃)₅(NO₂)]²⁺",
    direction: "Nitrito → Nitro (ekzotermik, termodinamik jihatdan qulay)",
    deltaH:   "ΔH° = −11.4 ± 0.8 kJ/mol (DSC, qattiq holatda; Grenthe et al. 1970)",
    deltaS:   "ΔS° = −8.5 J·mol⁻¹·K⁻¹",
    deltaG298: "ΔG°(298 K) = −8.9 kJ/mol",
    K:        "K_eq(298 K) ≈ 36 (97% nitro : 3% nitrito muvozanatda)",
    activationEnergy: "E_a = 108 ± 5 kJ/mol (eritmada); 138 kJ/mol (qattiq)",
    rateConstant298: "k(298 K) ≈ 3.5 × 10⁻⁵ s⁻¹ (qorong'ida, DMSO); UV: k × 10⁴",
    halfLife: "t₁/₂ ≈ 5.5 soat (25°C, qorong'i); 50°C da 9 daqiqa",
    mechanism: "Intramolekulyar qayta guruhlanish (izotop belgilash, Basolo 1961) — NO₂ Co ni tark etmaydi",
    eyring: "Eyring: ΔH‡ = 103 kJ/mol, ΔS‡ = −30 J·mol⁻¹·K⁻¹, ΔG‡(298) = 112 kJ/mol",
  },
  inertness: {
    why: "Co³⁺ d⁶ past-spin — katta CFSE (~677 kJ/mol) LFSE-fossilizatsiya to'sig'i. 5-koord. oraliqqa o'tishda ~200 kJ/mol kerak.",
    comparison: "log k_ex(H₂O, s⁻¹): Co(III) ≈ −6 (inert); Cr(III) ≈ −6; Fe(III) ≈ +2; Mn(II) ≈ +7; Cu(II) ≈ +9 (labil)",
    waterExchange: "k_ex([Co(NH₃)₅(H₂O)]³⁺) ≈ 5.7 × 10⁻⁶ s⁻¹ (t₁/₂ ≈ 34 soat, 25°C)",
    marcusLimit: "NMR shkalasida (10⁻³–10⁻⁹ s) kompleks mutlaqo statik — sekin almashinuv chegarasi.",
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. DFT IZOMERLANISH YO'LLARI (ωB97XD/6-31+G(d,p))
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.dftPathways = [
  {
    id: 1,
    name: "Yo'l A: nitro → endo-nitrito → exo-nitrito (2 bosqichli)",
    steps: [
      { label: "nitro (N-koord.)", energy: 0.00, type: "minimum" },
      { label: "TS1", energy: 38.16, type: "TS" },
      { label: "endo-nitrito", energy: 15.22, type: "minimum" },
      { label: "TS2", energy: 24.90, type: "TS" },
      { label: "exo-nitrito (O-koord.)", energy: 12.85, type: "minimum" },
    ],
    barrier: 38.16,
    barrierUnit: "kkal/mol",
    preferred: true,
    note: "Ikki bosqichli: Co–N uzilishi va endo-oraliq (yuqori to'siq), keyin O ga o'tish (past to'siq). Asosiy yo'l.",
  },
  {
    id: 2,
    name: "Yo'l B: nitro → exo-nitrito (bir bosqichli konsertli)",
    steps: [
      { label: "nitro (N-koord.)", energy: 0.00, type: "minimum" },
      { label: "TS3", energy: 41.76, type: "TS" },
      { label: "exo-nitrito (O-koord.)", energy: 12.85, type: "minimum" },
    ],
    barrier: 41.76,
    barrierUnit: "kkal/mol",
    preferred: false,
    note: "To'siq 3.6 kkal/mol yuqori — kamroq foydali. Faqat yuqori haroratda (>150°C) sezilarli.",
  },
]

COMPOUND.dftDetails = {
  method: "ωB97XD/6-31+G(d,p)",
  basisSetForCo: "SDD (Stuttgart-Dresden ECP)",
  solventModel: "IEF-PCM (H₂O, ε = 78.4)",
  coNBondLength: "Co–N(NH₃) = 1.986 Å (hisob) vs 1.978 Å (X-ray) — farq 0.4%",
  coNBondLengthNO2: "Co–N(NO₂) = 1.945 Å (hisob) vs 1.938 Å (X-ray) — farq 0.4%",
  pjteStabilization: "~750 cm⁻¹ (kichik, Jahn-Teller aktivligi yo'q)",
  frequencies: "Barcha minimumlarda musbat chastotalar; TS lar bitta xayoliy chastota",
  source: "PMC9077707 (Chen et al., 2022)",
  significance: "DFT E_a (~38 kkal/mol) tajribaviy DSC (108 kJ/mol ≈ 25.8 kkal/mol) dan ~12 kkal/mol yuqori. Farq: qattiq holatda kristall panjara stabilizatsiyasi va tunnellik effekti.",
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. LINKAGE IZOMER TAQQOSLASH
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.linkageComparison = [
  { compound: "[Co(NH₃)₅(NO₂)]²⁺", ligand: "NO₂⁻ (N-koord.)", color: "sariq", n15: "+412 ppm", co59: "+8120 ppm", stability: "termodinamik ustun", note: "Nitro izomer, barqaror" },
  { compound: "[Co(NH₃)₅(ONO)]²⁺", ligand: "ONO⁻ (O-koord.)", color: "qizil", n15: "+528 ppm", co59: "+8010 ppm", stability: "kinetik (metastabil)", note: "Nitrito izomer, qorong'ida nitroga aylanadi" },
  { compound: "[Co(NH₃)₅(NCS)]²⁺", ligand: "NCS⁻ (N-koord.)", color: "pushti", n15: "−180 ppm", co59: "+8250 ppm", stability: "barqaror", note: "Izotiotsianato" },
  { compound: "[Co(NH₃)₅(SCN)]²⁺", ligand: "SCN⁻ (S-koord.)", color: "to'q pushti", n15: "−310 ppm", co59: "+7900 ppm", stability: "metastabil", note: "Tiotsianato" },
  { compound: "[Co(NH₃)₆]³⁺",       ligand: "6× NH₃",          color: "sariq (luteo)", n15: "−340 ppm (NH₃)", co59: "+8120 ppm", stability: "referens", note: "Klassik oktaedrik referens" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 8. YaMR SIGNALLAR (batafsil)
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.nmrSignals = [
  { nucleus: "¹H",  ligand: "NH₃ (barchasi, 15H)",  shift: 3.5,   mult: "singlet",       J: "—",              integ: "15H", note: "C₄ᵥ da 2 signal (12H+3H, 4:1) kutiladi, lekin ¹⁴N kvadrupol va tez H-almashinuv tufayli bir singlet. 200 K, DMSO-d₆ da ajraladi." },
  { nucleus: "¹⁵N", ligand: "NO₂ (N-koord.)",       shift: 412,   mult: "singlet",       J: "—",              integ: "1N",  note: "CH₃NO₂ shkalasida. Nitrito izomerdan 116 ppm past. ¹⁵N-boyitilgan namuna afzal." },
  { nucleus: "¹⁵N", ligand: "NH₃ (trans-NO₂)",      shift: -335,  mult: "singlet",       J: "¹J(N–H)=73 Hz",   integ: "1N",  note: "NH₃(l) shkalasida. Trans-NO₂ ta'sirida cis-NH₃ dan 5–10 ppm siljigan." },
  { nucleus: "¹⁵N", ligand: "NH₃ (cis-NO₂)",        shift: -340,  mult: "singlet",       J: "¹J(N–H)=73 Hz",   integ: "4N",  note: "NH₃(l) shkalasida. To'rt ekvivalent NH₃." },
  { nucleus: "⁵⁹Co", ligand: "Co markazi",           shift: 8120,  mult: "singlet (keng)", J: "—",             integ: "1Co", note: "[Co(CN)₆]³⁻ = 0 shkalasida. Δν₁/₂ ≈ 800–2000 Hz (kvadrupol). CQ ≈ 15–25 MHz." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 9. HALAQIT BERUVCHI OMILLAR
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.interferences = [
  { source: "Nitrito izomer aralashmasi", effect: "¹⁵N NMR da +528 ppm da qo'shimcha signal (Δδ = 116 ppm)", severity: "Yuqori", solution: "Qorong'ida saqlash; UV-Vis (500 nm da qizil rang tekshirish); qayta kristallash (H₂O/etanol)", theory: "Nitrito nitro ga sekin (t₁/₂ ≈ 5.5 soat) o'tadi. Tozalik ≥ 95% bo'lishi kerak. 60°C, 2 soat → 100% nitro." },
  { source: "Foto-izomerlanish (UV, 350 nm)",   effect: "NMR probirkasida UV yorug'lik nitro → nitrito qaytariladi", severity: "Yuqori", solution: "Amber (qora) NMR probirka; qorong'ida saqlash; laboratoriya yorug'ligini kamaytirish", theory: "Naumov (2013): UV foton Co–N* qo'zg'algan holatiga o'tkazadi, NO₂ aylana oladi. Φ ≈ 0.15 (300 K)." },
  { source: "⁵⁹Co kvadrupol kengayishi",         effect: "⁵⁹Co signal kengligi 800–2000 Hz; sezgirlik past", severity: "O'rta", solution: "600+ MHz spektrometr; WURST-QCPMG (solid); DMSO erituvchi (signalni toraytadi)", theory: "1/T₂(Q) = (3π²/10)·(2I+3)/(I²(2I−1))·CQ²·τc. Kubik simmetriyadan chetlanish tufayli EFG ≠ 0 va CQ paydo bo'ladi." },
  { source: "¹⁵N past sezgirligi",                effect: "S/N past; uzun eksperiment", severity: "O'rta", solution: "¹⁵N-boyitilgan namuna (>98%); INEPT/DEPT/HSQC; 24 soatgacha skan", theory: "Tabiiy ¹⁵N tarqalishi 0.365%. Sezgirlik = (γ/γ_H)³ × tarqalish = 3.85 × 10⁻⁶. Boyitish 270× tejamli." },
  { source: "Erituvchining qoldiq signali",      effect: "D₂O da HDO 4.79 ppm NH₃ (3.5 ppm) ga yaqin; DMSO-d₆ da d₅ signali 2.50 ppm", severity: "O'rta", solution: "DMSO-d₆ afzal; solvent-suppression (WATERGATE, presaturation)", theory: "D₂O da NH₃ protonlari D bilan almashinadi (t₁/₂ < 1 daq), signal yo'qoladi. DMSO-d₆ da almashinuv soatlab." },
  { source: "Paramagnit metall aralashmasi",     effect: "Signal kengayishi (Solomon-Bloembergen); δ siljish", severity: "O'rta", solution: "Chelex-100 orqali tozalash; Ar/N₂ atmosfera; xromatografiya", theory: "Cu²⁺, Fe³⁺ aralashmalari 1/T₂ ∝ 1/r⁶ orqali yaqin protonlarni kengaytadi. 10⁻⁶ M paramagnit ham 5 Å masofada sezilarli." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 10. LABORATORIYA TARTIBI
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.labProcedure = [
  { step: 1, title: "Xavfsizlik va namuna tayyorlash", time: "15 daq", desc: "Nitril qo'lqop, ko'zoynak, xalat. NO₂⁻ tuzlari toksik (LD₅₀ < 100 mg/kg). Amber probirka — UV himoya. Reagentlar toza (≥99%). Deyterlangan erituvchi (DMSO-d₆, 99.96% D).", theory: "Foto-izomerlanish oldini olish kritik. NMR probirka 5 mm, 528-PP tipi (Wilmad). H₂O aralashmasi 60°C da nitrito izomerlanishini tezlashtiradi." },
  { step: 2, title: "Erituvchi tanlash", time: "5 daq", desc: "DMSO-d₆ birinchi tanlov (NH₃ signali δ 3.5 ppm, HDO dan uzoq). D₂O ikkinchi (H/D almashinuv problemasi). CD₃OD variant.", theory: "DMSO-d₆: qutbli aprotik. Solvatokromizm minimal. Qoldiq signal: 2.50 ppm (¹H), 39.52 ppm (¹³C)." },
  { step: 3, title: "Namuna eritish", time: "10 daq", desc: "15–25 mg namuna 0.60 mL DMSO-d₆ da eritish (~30–50 mM). Ultratovushli hammom 1–2 daq. Filtr 0.45 μm PTFE.", theory: "Yuqori konsentratsiya ¹⁵N va ⁵⁹Co uchun kerak (past sezgirlik). Cho'kma bo'lmasligi shart — shimming buziladi." },
  { step: 4, title: "Spektrometr sozlash: lock, shim, tune", time: "20–30 daq", desc: "1) Lock: DMSO-d₆ deyteriy signaliga; 2) Shimming: Z, Z² auto+qo'lda, HDO ≤ 0.8 Hz; 3) 90° impuls kalibrlash pw90 ≈ 10 μs (600 MHz).", theory: "Yaxshi shim = tor chiziqlar = kimyoviy siljishlarni aniq o'lchash. Yomon shim NH₃ signalining 4:1 ajraluvini yashiradi." },
  { step: 5, title: "¹H NMR (asosiy)", time: "5 daq", desc: "SW 12 ppm; d1=1 s; ns=32; 30° impuls (Ernst). Kutilgan: singlet 3.5 ppm (integ 15H). Referens: TMS (0 ppm) yoki DMSO-d₅ (2.50 ppm).", theory: "Ernst burchagi cos(α)=exp(−TR/T₁); T₁(NH₃) ≈ 2 s, TR ≈ 3 s → α_opt ≈ 55°. 30° konservativ tanlov." },
  { step: 6, title: "¹⁵N NMR (linkage izomerni tasdiqlash)", time: "1–2 soat", desc: "¹⁵N-boyitilgan namuna afzal. SW 500 ppm; d1=3 s; ns=1024–8192; INEPT bilan sezgirlikni oshirish. Kutilgan: singlet +412 ppm (nitro) yoki +528 ppm (nitrito).", theory: "¹⁵N γ manfiy — NOE koeffitsienti η = γ_H/(2γ_N) = −4.94 (max). Salbiy NOE tufayli signal 'ichkariga' burilishi mumkin. Solution: bo'sh d1 (≥10 s)." },
  { step: 7, title: "⁵⁹Co NMR (metall markaz)", time: "20–60 daq", desc: "SW 20 000 ppm (juda keng); d1=0.05 s (T₁ qisqa); ns=512–4096. Kutilgan: keng singlet ~+8120 ppm (Δν₁/₂ ≈ 800–2000 Hz).", theory: "⁵⁹Co uchun 100% tarqalish va yuqori γ tufayli sezgirlik yaxshi. Kvadrupol relaksatsiya T₁ ni juda qisqartiradi — tez qayta impuls. WURST-QCPMG solid uchun." },
  { step: 8, title: "2D NMR (agar kerak bo'lsa)", time: "6–12 soat", desc: "¹H–¹⁵N HSQC — NH₃ korrelyatsiyasi. ¹H–⁵⁹Co HMQC eksperimental. VT-NMR 200–330 K da NH₃ ajralishi.", theory: "HSQC: ¹J(N–H) ≈ 73 Hz — INEPT delay 1/(4J) ≈ 3.4 ms. VT-NMR bilan koalesansiya Tc dan ΔG‡ hisoblanadi." },
  { step: 9, title: "Ma'lumotlarni tahlil qilish", time: "30–60 daq", desc: "Baseline, referens kalibrlash, integrallash, chiziq kengligi. MestReNova yoki Topspin.", theory: "Nitro/nitrito farqni Δδ(¹⁵N) orqali tasdiqlash. ⁵⁹Co siljish — spektrokimyoviy qatorni tekshirish (δ vs 1/Δ_o)." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 11. KENGAYTIRUVCHI METODLAR
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.advancedTechniques = [
  { name: "VT-NMR (Variable Temperature)", desc: "200–330 K oralig'ida NH₃ signalining koalesansi va ajralishini kuzatish. C₄ᵥ tufayli 4:1 nisbatdagi 2 signal past haroratda paydo bo'ladi.", advs: ["ΔG‡ ni to'g'ridan-to'g'ri o'lchash (Eyring)", "Fluksionallik mexanizmi", "Proton almashinuvi"], disadvs: ["Cryogen (LN₂) kerak", "Uzoq eksperiment", "Namuna qotib qolishi mumkin"], bestFor: "Dinamik jarayonlar kinetikasi", example: "Tc ≈ 250 K, Δν ≈ 15 Hz → k_c = πΔν/√2 = 33 s⁻¹ → ΔG‡ = 51 kJ/mol" },
  { name: "¹H–¹⁵N HSQC", desc: "Heteronuklear korrelyatsiya. ¹J(N–H) orqali NH₃ protonlarini ¹⁵N ga bog'laydi. Sezgirlik ¹H tomonidan olinadi (~400× kuchli).", advs: ["Yuqori sezgirlik", "NH₃ ligand identifikatsiyasi", "Har N alohida"], disadvs: ["¹⁵N-boyitilgan namuna afzal", "Uzoq eksperiment (~2 s)"], bestFor: "Ligand tuzilishini tasdiqlash", example: "NH₃ cross-piki (δH=3.5, δN=−340) va NO₂ (δN=+412) alohida" },
  { name: "DSC (Differential Scanning Calorimetry)", desc: "Nitrito → nitro izomerlanishning termik parametrlarini o'lchash. Skanerlash 5–10 K/min.", advs: ["ΔH, ΔS bevosita", "Izomerlanish kuzatish", "Fazoviy o'tishlar"], disadvs: ["Faqat termik jarayonlar", "Miqdor >5 mg"], bestFor: "Termodinamika, fazoviy o'tishlar", example: "S0040603103003617: ekzotermik pik 90–110°C, ΔH = −11.4 kJ/mol" },
  { name: "Photo-NMR (in-situ fotoirradiatsiya)", desc: "UV yorug'lik ostida real vaqtda NMR. Nitro → nitrito konversiyasi kuzatiladi.", advs: ["Photo-kinetika", "Kvantli chiqim Φ", "Foto-oraliqlar"], disadvs: ["Maxsus uskuna (LED + fiber optic)", "Nur intensivligi kalibrlash"], bestFor: "Foto-kimyoviy jarayonlar", example: "365 nm UV, 30 daq → 40% nitrito hosil bo'ladi, keyin qorong'ida 5 s da yana nitro" },
  { name: "Solid-state ⁵⁹Co NMR (WURST-QCPMG)", desc: "Kristall namuna uchun. CQ va η kvadrupol parametrlarini aniq o'lchash. C₄ᵥ ni tasdiqlash.", advs: ["Kristall struktura", "Photo-salient qattiq holatda", "CQ, η aniq"], disadvs: ["Maxsus zonda", "Chiziqlar juda keng"], bestFor: "Kristallografik simmetriya", example: "CQ = 20.5 MHz, η = 0.18 — C₄ᵥ ni tasdiqlaydi" },
  { name: "ωB97XD/6-31+G(d,p) DFT", desc: "Kvant-kimyoviy hisoblar: geometriya, TS qidirish, NMR ekranlash (GIAO metodi).", advs: ["NMR bashorati", "Reaksiya mexanizmi", "TS energiyalari"], disadvs: ["Kuchli kompyuter", "Solvatatsiya modeli", "Basis set tanlash"], bestFor: "Mexanistik tushunish", example: "PMC9077707: TS1=38.16 kkal/mol, endo-nitrito oraliq. ¹⁵N(NO₂)=415 ppm (tajriba 412 ppm)" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// UI KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════════
export default function CoNH35NO2Cl2Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [activeNmrNucleus, setActiveNmrNucleus] = useState("h1")
  const [activePathway, setActivePathway] = useState(1)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1) // Spektr zoom
  const [showAllSignals, setShowAllSignals] = useState(true)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfMessage, setPdfMessage] = useState("")

  // Zoom oraliqlari (¹H spektri uchun ppm da)
  const ppmRange = useMemo(() => {
    const ranges = { 1: [-1, 12], 2: [0, 8], 4: [2, 5] }
    return ranges[zoomLevel] || ranges[1]
  }, [zoomLevel])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-yellow-950/20 to-blue-950 text-white">

      {/* HEADER (ogohlantirish modali olib tashlangan) */}
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
              <span className="text-yellow-400 font-semibold">[Co(NH₃)₅(NO₂)]Cl₂</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2 flex-wrap">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-1">🧲 YaMR</span>
                  <span className="text-xs bg-yellow-600 px-2 py-1 rounded">Linkage izomer</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol  •  CAS: {COMPOUND.casNumber}  •  Kashfiyot: {COMPOUND.discovery}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase">Linkage izomerizm</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase">Diamagnit (d⁶ LS)</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase">C₄ᵥ simmetriya</span>
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase">Photo-salient</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => generatePDF({ setPdfGenerating, setPdfMessage })}
                  disabled={pdfGenerating}
                  className="text-xs bg-red-600/90 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  {pdfGenerating ? "⏳ PDF yaratilyapti..." : "📄 Ilmiy PDF yuklab olish"}
                </button>
                <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-center">
                  ← Katalog
                </Link>
              </div>
            </div>
            {pdfMessage && (
              <div className="mt-2 text-xs text-yellow-300 bg-yellow-900/30 border border-yellow-500/40 rounded p-2">
                {pdfMessage}
              </div>
            )}
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-3 py-2 rounded-lg text-xs font-bold shadow-lg bg-yellow-600 hover:bg-yellow-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽" : "🔼"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">YaMR chuqur tahlil</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Jorgensen 1894</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">Naumov 2013</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">DFT ωB97XD</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4 flex-wrap">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              [Co(NH₃)₅(NO₂)]Cl₂
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            <span className="text-yellow-400 italic">“Ambidentat NO₂⁻ ligandning N-koordinatsiyalangan izomeri — linkage izomerizmning etaloni”</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            Bu birikma <strong className="text-yellow-400">koordinatsion kimyoning eng klassik namunalaridan biri</strong>. 1894-yilda daniyalik olim <strong>S. M. Jørgensen</strong> tomonidan
            kashf etilgan bu sariq tuz, <strong className="text-yellow-400">NO₂⁻ ambidentat ligandi</strong> ning ikki xil koordinatsiya usulini (N vs O) namoyish etadi. Uning qizil <strong>nitrito</strong> izomeri
            <strong className="text-yellow-400"> [Co(NH₃)₅(ONO)]Cl₂</strong> — qorong'ida sekin, UV yorug'ligida esa tez o'zaro almashinuvi bu ikkisining <strong>Werner koordinatsion nazariyasini</strong> tasdiqlashda
            hal qiluvchi eksperimental dalil bo'ldi.
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            YaMR nuqtai nazaridan bu birikma <strong className="text-yellow-400">to'liq diamagnit </strong> (Co³⁺ d⁶ past-spin, t₂g⁶eg⁰) — shu sabab NMR signallari o'tkir va aniq. Uch xil yadro tahlil qilinadi:
            <strong className="text-yellow-400"> ¹H (NH₃ protonlari)</strong>,
            <strong className="text-yellow-400"> ¹⁵N (linkage izomer identifikatsiyasi)</strong> va
            <strong className="text-yellow-400"> ⁵⁹Co (metall markazi zondi)</strong>. Birikma <strong>photo-salient effekt</strong> — UV yorug'lik ostida kristall sakrash hodisasini namoyish etadi (Naumov, 2013), bu esa
            uni “bio-inspired mexanik materiallar” sinfida etakchi qiladi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Co³⁺ (d⁶ LS)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Magnit xossasi</div>
              <div className="text-white font-bold">Diamagnit</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">C₄ᵥ (buzilgan Oₕ)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit turi</div>
              <div className="text-white font-bold">1:2</div>
            </div>
          </div>
        </div>

        {/* KRISTALL MAYDON NAZARIYASI — chuqurlashtirilgan */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">⚛️</span> 1. Kristall maydon nazariyasi (Crystal Field Theory)
            </h2>
            <span className="text-xs text-blue-400 bg-blue-900/40 px-3 py-1 rounded-full">Bethe 1929, Van Vleck 1932</span>
          </div>

          <div className="bg-blue-900/30 rounded-lg p-4 border-l-4 border-blue-400">
            <p className="text-blue-200 text-sm leading-relaxed">
              <strong className="text-blue-300">Nima uchun bu kompleks diamagnit?</strong> Co³⁺ ioni [Ar]3d⁶ elektron konfiguratsiyasiga ega. Oktaedrik ligand maydonida d-orbitallar ikki guruhga bo'linadi:
              past-energetik <strong>t₂g</strong> (dxy, dxz, dyz) va yuqori-energetik <strong>eg</strong> (dx²−y², dz²). Ular orasidagi ajralish <strong>Δ_o</strong> deyiladi.
              NH₃ va NO₂⁻ — <strong>kuchli maydon</strong> ligandlari, ular Δ_o ≈ 23 600 cm⁻¹ hosil qiladi. Bu qiymat elektronlarni juftlash energiyasi <strong>P ≈ 21 000 cm⁻¹</strong>
              dan katta bo'lgani uchun barcha 6 elektron t₂g ga to'planadi (past-spinli), toq elektronlar yo'q → <strong>diamagnit</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">🎯 Elektron konfiguratsiya</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Metall ioni", COMPOUND.crystalField.metalIon],
                  ["Elektron holat", COMPOUND.crystalField.electronConfig],
                  ["d-elektronlar", COMPOUND.crystalField.dElectrons + " ta"],
                  ["Spin holati", COMPOUND.crystalField.spinState],
                  ["Orbital to'ldirilishi", COMPOUND.crystalField.orbitalOccupancy],
                  ["Toq elektronlar", COMPOUND.crystalField.unpairedElectrons + " ta"],
                  ["Magnit moment", COMPOUND.crystalField.magneticMoment],
                ].map(([k, v], i) => (
                  <div key={i} className="flex justify-between gap-2 border-b border-blue-800/30 pb-1">
                    <span className="text-purple-400 text-xs">{k}:</span>
                    <span className="text-blue-300 font-mono text-xs text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">🔬 Ligand maydon parametrlari</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Ajralish Δ_o (10Dq)", COMPOUND.crystalField.crystalFieldSplitting],
                  ["Racah B", COMPOUND.crystalField.racahParameter],
                  ["Nefelauxetik β", COMPOUND.crystalField.nephelauxeticRatio],
                  ["Juftlanish P", COMPOUND.crystalField.pairingEnergy],
                  ["CFSE (t₂g⁶)", COMPOUND.crystalField.cfse],
                  ["Netto CFSE", COMPOUND.crystalField.cfseNet],
                ].map(([k, v], i) => (
                  <div key={i} className="flex flex-col gap-1 border-b border-blue-800/30 pb-1">
                    <span className="text-purple-400 text-xs">{k}:</span>
                    <span className="text-blue-300 font-mono text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Spektrokimyoviy qator */}
          <div className="bg-blue-900/30 rounded-lg p-4 space-y-2">
            <h4 className="text-blue-300 font-bold flex items-center gap-2">📈 Spektrokimyoviy qator</h4>
            <p className="text-purple-200 text-sm font-mono bg-blue-950/50 p-2 rounded overflow-x-auto">
              {COMPOUND.crystalField.spectrochemicalSeries}
            </p>
            <p className="text-purple-200 text-sm"><strong className="text-blue-300">Xulosa:</strong> {COMPOUND.crystalField.whyLowSpin}</p>
            <p className="text-purple-200 text-sm"><strong className="text-blue-300">Rang manbai:</strong> {COMPOUND.crystalField.colorOrigin}</p>
            <p className="text-purple-200 text-sm"><strong className="text-blue-300">LMCT:</strong> {COMPOUND.crystalField.chargeTransfer}</p>
          </div>

          {/* d-orbital splitting diagram — chuqurlashtirilgan */}
          <div className="bg-purple-950/40 p-5 rounded-xl border border-purple-700/30">
            <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
              📊 d-orbital bo'linish diagrammasi — [Co(NH₃)₅(NO₂)]²⁺ (C₄ᵥ)
            </h4>
            <p className="text-purple-300 text-xs mb-4">
              Erkin ionda 5 ta d-orbital aynan tenglashgan (degenerativ). Oktaedrik maydonda 2 ta guruhga (t₂g + eg) bo'linadi. NO₂⁻ tomonidan simmetriya Oₕ dan C₄ᵥ ga tushganda
              qo'shimcha bo'linish sodir bo'ladi: t₂g → b₂ + e; eg → b₁ + a₁. Bu ikkinchi bo'linish kichik (~500–1500 cm⁻¹), asosiy Δ_o ga ta'sir qilmaydi.
            </p>
            <svg viewBox="0 0 700 320" className="w-full h-auto" role="img" aria-label="d-orbital splitting O_h to C_4v">
              <defs>
                <marker id="arrowUpBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                </marker>
              </defs>
              {/* Energiya o'qi */}
              <line x1="40" y1="290" x2="40" y2="20" stroke="#a78bfa" strokeWidth="1.5" />
              <polygon points="40,15 36,25 44,25" fill="#a78bfa" />
              <text x="20" y="160" fontSize="11" fill="#c4b5fd" transform="rotate(-90 20 160)">Energiya</text>

              {/* Erkin ion (degenerate) */}
              <text x="80" y="15" fontSize="10" fill="#a78bfa" fontWeight="bold">Erkin Co³⁺</text>
              <line x1="70" y1="180" x2="170" y2="180" stroke="#6b7280" strokeWidth="3" />
              <text x="120" y="175" textAnchor="middle" fontSize="9" fill="#9ca3af">5× d (aynan)</text>

              {/* Barcenter (imaginary center) */}
              <line x1="200" y1="180" x2="680" y2="180" stroke="#6b21a8" strokeWidth="0.8" strokeDasharray="3,3" />
              <text x="690" y="183" fontSize="8" fill="#a78bfa">barysenter</text>

              {/* O_h splitting */}
              <text x="280" y="15" fontSize="10" fill="#22c55e" fontWeight="bold">Oₕ maydonida</text>
              {/* eg (upper) */}
              <line x1="240" y1="90" x2="340" y2="90" stroke="#eab308" strokeWidth="3" />
              <text x="290" y="82" textAnchor="middle" fontSize="10" fill="#eab308" fontWeight="bold">e_g</text>
              <text x="290" y="105" textAnchor="middle" fontSize="8" fill="#fde68a">dz², dx²−y²</text>
              <text x="350" y="93" fontSize="8" fill="#fbbf24">+0.6Δ_o</text>

              {/* t2g (lower) */}
              <line x1="240" y1="240" x2="340" y2="240" stroke="#22c55e" strokeWidth="3" />
              <text x="290" y="232" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="bold">t₂g</text>
              <text x="290" y="255" textAnchor="middle" fontSize="8" fill="#86efac">dxy, dxz, dyz</text>
              <text x="200" y="243" fontSize="8" fill="#22c55e">−0.4Δ_o</text>

              {/* 6 electrons in t2g */}
              {[255, 275, 295, 315].map((x, i) => (
                <text key={i} x={x} y="236" fontSize="12" fill="#f97316" fontWeight="bold">↑↓</text>
              ))}
              <text x="255" y="236" fontSize="12" fill="#f97316" fontWeight="bold">↑↓</text>
              <text x="290" y="236" fontSize="12" fill="#f97316" fontWeight="bold">↑↓</text>
              <text x="325" y="236" fontSize="12" fill="#f97316" fontWeight="bold">↑↓</text>

              {/* Δ_o double arrow */}
              <line x1="395" y1="90" x2="395" y2="240" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrowUpBlue)" markerStart="url(#arrowUpBlue)" />
              <text x="405" y="170" fontSize="12" fill="#fbbf24" fontWeight="bold">Δ_o</text>
              <text x="405" y="183" fontSize="8" fill="#fde68a">23 600 cm⁻¹</text>

              {/* C_4v splitting */}
              <text x="540" y="15" fontSize="10" fill="#ec4899" fontWeight="bold">C₄ᵥ maydonida</text>
              {/* b1 (from eg) */}
              <line x1="500" y1="70" x2="580" y2="70" stroke="#eab308" strokeWidth="2.5" />
              <text x="585" y="73" fontSize="9" fill="#eab308">b₁ (dx²−y²) +0.65Δ_o</text>
              {/* a1 (from eg) */}
              <line x1="500" y1="110" x2="580" y2="110" stroke="#eab308" strokeWidth="2.5" />
              <text x="585" y="113" fontSize="9" fill="#eab308">a₁ (dz²) +0.55Δ_o</text>
              {/* b2 (from t2g) */}
              <line x1="500" y1="230" x2="580" y2="230" stroke="#22c55e" strokeWidth="2.5" />
              <text x="585" y="233" fontSize="9" fill="#22c55e">b₂ (dxy)</text>
              <text x="493" y="233" fontSize="11" fill="#f97316" fontWeight="bold">↑↓</text>
              {/* e (from t2g) */}
              <line x1="500" y1="250" x2="580" y2="250" stroke="#22c55e" strokeWidth="2.5" />
              <text x="585" y="253" fontSize="9" fill="#22c55e">e (dxz, dyz)</text>
              <text x="515" y="253" fontSize="11" fill="#f97316" fontWeight="bold">↑↓ ↑↓</text>

              {/* Connecting lines from Oh to C4v */}
              <line x1="340" y1="90" x2="500" y2="70" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />
              <line x1="340" y1="90" x2="500" y2="110" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />
              <line x1="340" y1="240" x2="500" y2="230" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />
              <line x1="340" y1="240" x2="500" y2="250" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />

              {/* Legend */}
              <rect x="40" y="295" width="18" height="6" fill="#22c55e" />
              <text x="62" y="301" fontSize="9" fill="#86efac">t₂g (band, 6 elektron)</text>
              <rect x="200" y="295" width="18" height="6" fill="#eab308" />
              <text x="222" y="301" fontSize="9" fill="#fde68a">e_g (bo'sh)</text>
              <text x="340" y="301" fontSize="9" fill="#f97316">↑↓ = juftlangan elektron</text>
            </svg>
            <div className="mt-3 bg-blue-900/20 rounded p-3 text-xs text-purple-200 leading-relaxed">
              <strong className="text-blue-300">Diagramma tushuntirishi:</strong> Chapda erkin Co³⁺ ioni — barcha 5 d-orbital bir energetik sathda (degenerativ, ideal shar simmetriya).
              O'rtada oktaedrik ligand maydonida (agar 6 ta NH₃ bo'lganda) t₂g va e_g ikki sathga ajraladi — orasidagi masofa Δ_o = 23 600 cm⁻¹ (282 kJ/mol, 2.93 eV).
              6 ta d-elektron t₂g ga to'liq juftlangan (past-spin), sabab Δ_o &gt; P (juftlanish energiyasi). O'ngda esa haqiqiy C₄ᵥ simmetriyada (bitta NH₃ → NO₂) qo'shimcha kichik bo'linish: t₂g → b₂ + e; e_g → b₁ + a₁. Bu ikkinchi bo'linish (∼500–1500 cm⁻¹) ⁵⁹Co NMR siljishiga sezilarli ta'sir qiladi.
            </div>
          </div>
        </div>

        {/* SIMMETRIYA VA XARAKTERLAR JADVALI */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📐</span> 2. Simmetriya va C₄ᵥ xarakterlar jadvali
            </h2>
            <span className="text-xs text-purple-300 bg-purple-900/40 px-3 py-1 rounded-full">Guruh tartibi: 8</span>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-4 border-l-4 border-purple-400">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-purple-300">Nima uchun C₄ᵥ?</strong> Ideal oktaedr Oₕ simmetriyasiga ega (48 ta simmetriya operatsiyasi). [Co(NH₃)₅(NO₂)]²⁺ da bitta NH₃ ligand NO₂⁻ ga almashtirilgan
              — shu bilan simmetriya Oₕ dan <strong>C₄ᵥ</strong> ga tushadi (8 ta operatsiya). C₄ o'qi Co–N(NO₂) bog'i orqali o'tadi.
              Bu simmetriya to'g'ridan-to'g'ri IR, Raman va NMR spektrlarini belgilaydi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">🔮 Simmetriya elementlari</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-purple-950/50 rounded p-2">
                  <div className="text-xs text-purple-400 mb-1">Nuqtaviy guruh:</div>
                  <div className="text-purple-300 font-mono font-bold text-lg">{COMPOUND.symmetry.pointGroup}</div>
                </div>
                <div className="bg-purple-950/50 rounded p-2">
                  <div className="text-xs text-purple-400 mb-1">Elementlar:</div>
                  <div className="text-purple-300 font-mono text-sm">{COMPOUND.symmetry.symmetryElements.join(", ")}</div>
                </div>
                <div className="bg-purple-950/50 rounded p-2">
                  <div className="text-xs text-purple-400 mb-1">Simmetriya pasayishi:</div>
                  <div className="text-purple-300 text-xs">{COMPOUND.symmetry.descentInSymmetry}</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">🎵 Spektral faollik va d-orbital pasayishi</h3>
              <div className="space-y-2 text-sm text-xs">
                <div><strong className="text-purple-300">IR faol:</strong> <span className="text-purple-200">{COMPOUND.symmetry.irActive}</span></div>
                <div><strong className="text-purple-300">Raman faol:</strong> <span className="text-purple-200">{COMPOUND.symmetry.ramanActive}</span></div>
                <div><strong className="text-purple-300">O'zaro istisno:</strong> <span className="text-purple-200">{COMPOUND.symmetry.mutualExclusion}</span></div>
                <div className="bg-purple-950/50 p-2 rounded mt-2">
                  <strong className="text-purple-300">d-orbital pasayishi (Oₕ → C₄ᵥ):</strong>
                  <div className="text-purple-200 mt-1">{COMPOUND.symmetry.dOrbitalReduction}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-4">
            <h4 className="text-purple-300 font-bold mb-2">🧢 NMR ekvivalentligi — bu erda muhim!</h4>
            <p className="text-purple-200 text-sm leading-relaxed">{COMPOUND.symmetry.nmrEquivalence}</p>
          </div>

          <div className="bg-purple-950/40 p-5 rounded-xl border border-purple-700/30">
            <h4 className="text-purple-400 font-bold mb-3">C₄ᵥ xarakterlar jadvali</h4>
            <p className="text-purple-300 text-xs mb-3">
              Har bir irreducible representation (irrep) simmetriya operatsiyalari ostida qanday o'zgarishini ko'rsatadi. “Funksiyalar” ustuni orbital va vektor bazislarini ko'rsatadi.
              Karakterlar (+1, −1, 0, 2) belgi va tartibga qarab — orbital yoki dipol momentining simmetriya operatsiyasiga munosabatini aniqlaydi.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-purple-700 bg-purple-950/70">
                    <th className="py-2 px-2 text-purple-300">Irrep</th>
                    <th className="py-2 px-2 text-purple-300 text-center">E</th>
                    <th className="py-2 px-2 text-purple-300 text-center">2C₄</th>
                    <th className="py-2 px-2 text-purple-300 text-center">C₂</th>
                    <th className="py-2 px-2 text-purple-300 text-center">2σᵥ</th>
                    <th className="py-2 px-2 text-purple-300 text-center">2σᵈ</th>
                    <th className="py-2 px-2 text-purple-300">Funksiyalar (bazis)</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {Object.entries(COMPOUND.symmetry.characterTable).map(([irrep, d]) => (
                    <tr key={irrep} className="border-b border-purple-800/30">
                      <td className="py-2 px-2 text-purple-300 font-bold">{irrep}</td>
                      <td className="py-2 px-2 text-center">{d.E}</td>
                      <td className="py-2 px-2 text-center">{d.C4}</td>
                      <td className="py-2 px-2 text-center">{d.C2}</td>
                      <td className="py-2 px-2 text-center">{d.sv}</td>
                      <td className="py-2 px-2 text-center">{d.sd}</td>
                      <td className="py-2 px-2 text-yellow-300 font-mono">{d.functions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* YaMR NAZARIYASI — CHUQUR (uch yadro tab) */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🧲</span> 3. YaMR nazariyasi — uch yadro bo'yicha chuqur tahlil
            </h2>
            <span className="text-xs text-cyan-300 bg-cyan-900/40 px-3 py-1 rounded-full">Ramsey → Bloch → Solomon-Bloembergen</span>
          </div>

          <div className="bg-cyan-900/30 rounded-lg p-4 border-l-4 border-cyan-400">
            <p className="text-cyan-200 text-sm leading-relaxed">
              <strong className="text-cyan-300">Fizik asos:</strong> Yadroning kimyoviy siljishi δ elektronlar tomonidan hosil qilingan mahalliy magnit maydonga bog'liq. Ramsey (1950) formulasi bo'yicha:
              <span className="font-mono bg-cyan-950/50 px-2 py-0.5 rounded ml-1">σ = σ_dia + σ_para</span>. Bunda σ_para ≈ −(1/ΔE) × ⟨r⁻³⟩ — kichik d–d ajratma (Δ_o) katta paramagnit hissa beradi.
              Bu sabab ⁵⁹Co siljish diapazoni ~19 000 ppm (barcha yadrolar orasidagi eng katta).
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "h1",  label: "¹H (I=1/2)",  emoji: "💧" },
              { key: "n15", label: "¹⁵N (I=1/2)", emoji: "🥂" },
              { key: "co59",label: "⁵⁹Co (I=7/2)", emoji: "🧲" },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setActiveNmrNucleus(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeNmrNucleus === t.key
                    ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          {/* ¹H */}
          {activeNmrNucleus === "h1" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-3">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.h1.nucleus} — Proton NMR</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["γ (giromagnit)", COMPOUND.nmrTheory.h1.gamma],
                  ["Tabiiy tarqalish", COMPOUND.nmrTheory.h1.naturalAbundance],
                  ["Larmor (9.4 T)", COMPOUND.nmrTheory.h1.larmor400],
                  ["Kimyoviy siljish", COMPOUND.nmrTheory.h1.shift],
                  ["Referens", COMPOUND.nmrTheory.h1.referens],
                  ["Multipletlik", COMPOUND.nmrTheory.h1.multiplicity],
                  ["Chiziq kengligi Δν₁/₂", COMPOUND.nmrTheory.h1.linewidth],
                  ["T₁ relaksatsiya", COMPOUND.nmrTheory.h1.t1Relaxation],
                ].map(([k, v], i) => (
                  <div key={i} className="bg-purple-950/50 rounded p-2">
                    <div className="text-xs text-purple-400">{k}</div>
                    <div className="text-cyan-300 font-mono text-xs mt-1">{v}</div>
                  </div>
                ))}
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">🔍 Nima uchun δ = 3.5 ppm?</div>
                <p className="text-purple-200 text-xs leading-relaxed">{COMPOUND.nmrTheory.h1.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">🔗 Spin-spin bog'lanish (J-coupling)</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.coupling}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">🧪 Amaliy eslatma</div>
                <p className="text-purple-200 text-xs">Erituvchi: <strong>{COMPOUND.nmrTheory.h1.solvent}</strong>. Integratsiya: {COMPOUND.nmrTheory.h1.integration}.</p>
              </div>
            </div>
          )}

          {/* ¹⁵N */}
          {activeNmrNucleus === "n15" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-3">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.n15.nucleus} — Linkage izomerni ochish uchun asosiy zond</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["γ (manfiy!)", COMPOUND.nmrTheory.n15.gamma],
                  ["Tabiiy tarqalish", COMPOUND.nmrTheory.n15.naturalAbundance],
                  ["Larmor (9.4 T)", COMPOUND.nmrTheory.n15.larmor400],
                  ["Sezgirlik (¹H=1)", COMPOUND.nmrTheory.n15.sensitivity],
                  ["δ(NO₂, N-koord.)", COMPOUND.nmrTheory.n15.shift_NO2],
                  ["δ(NH₃, koord.)", COMPOUND.nmrTheory.n15.shift_NH3],
                  ["Chiziq kengligi", COMPOUND.nmrTheory.n15.linewidth],
                  ["T₁", COMPOUND.nmrTheory.n15.t1Relaxation],
                ].map(([k, v], i) => (
                  <div key={i} className="bg-purple-950/50 rounded p-2">
                    <div className="text-xs text-purple-400">{k}</div>
                    <div className="text-cyan-300 font-mono text-xs mt-1">{v}</div>
                  </div>
                ))}
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                <div className="text-yellow-300 font-bold text-xs mb-1">⭐ Linkage izomerni farqlash (¹⁵N ning eng katta ilovasi)</div>
                <p className="text-purple-100 text-xs leading-relaxed">{COMPOUND.nmrTheory.n15.linkageDiscrimination}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">🔍 Nima uchun bu siljish?</div>
                <p className="text-purple-200 text-xs leading-relaxed">{COMPOUND.nmrTheory.n15.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">📐 Referens shkalasi</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.n15.referens}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">📈 CSA (Kimyoviy siljish anizotropiyasi)</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.n15.csa}</p>
              </div>
            </div>
          )}

          {/* ⁵⁹Co */}
          {activeNmrNucleus === "co59" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-3">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.co59.nucleus} — Metall markazi zondi (kvadrupol)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["γ", COMPOUND.nmrTheory.co59.gamma],
                  ["Tabiiy tarqalish", COMPOUND.nmrTheory.co59.naturalAbundance],
                  ["Larmor (9.4 T)", COMPOUND.nmrTheory.co59.larmor400],
                  ["Kvadrupol moment Q", COMPOUND.nmrTheory.co59.quadrupoleMoment],
                  ["δ (asosiy)", COMPOUND.nmrTheory.co59.shift],
                  ["Referens", COMPOUND.nmrTheory.co59.referens],
                  ["Chiziq kengligi", COMPOUND.nmrTheory.co59.linewidth],
                  ["T₁ (kvadrupol)", COMPOUND.nmrTheory.co59.t1Relaxation],
                ].map(([k, v], i) => (
                  <div key={i} className="bg-purple-950/50 rounded p-2">
                    <div className="text-xs text-purple-400">{k}</div>
                    <div className="text-cyan-300 font-mono text-xs mt-1">{v}</div>
                  </div>
                ))}
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">🔍 Ramsey paramagnit hissasi — nima uchun 8120 ppm?</div>
                <p className="text-purple-200 text-xs leading-relaxed">{COMPOUND.nmrTheory.co59.whyThisShift}</p>
              </div>
              <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                <div className="text-red-300 font-bold text-xs mb-1">⚠️ Kvadrupol kengayishi</div>
                <p className="text-purple-200 text-xs leading-relaxed">{COMPOUND.nmrTheory.co59.quadrupolarBroadening}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">🛠️ Amaliy o'lchash</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.co59.detection}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">🎯 Qo'llanmalari</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.co59.applications}</p>
              </div>
            </div>
          )}
        </div>

        {/* YaMR SIGNALLAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📊</span> 4. YaMR signallar ma'lumotlar jadvali
          </h2>
          <p className="text-purple-300 text-sm">
            Barcha kuzatilgan YaMR signallar. Bir jadvalda 3 xil yadro (¹H, ¹⁵N, ⁵⁹Co) va NH₃ protonlarining cis/trans holatlarini ajratilgan.
            “J (Hz)” ustuni skalyar bog'lanish konstantasini ko'rsatadi — ekvivalent bo'lmagan qo'shni yadrolar orasidagi elektronlar orqali uzatiladigan o'zaro ta'sir.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-yellow-400">Yadro</th>
                  <th className="py-3 px-3 text-yellow-400">Ligand / Holat</th>
                  <th className="py-3 px-3 text-yellow-400">δ (ppm)</th>
                  <th className="py-3 px-3 text-yellow-400">Multipletlik</th>
                  <th className="py-3 px-3 text-yellow-400">J (Hz)</th>
                  <th className="py-3 px-3 text-yellow-400">Integrallar</th>
                  <th className="py-3 px-3 text-yellow-400">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.nmrSignals.map((s, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-3 text-yellow-400 font-bold">{s.nucleus}</td>
                    <td className="py-3 px-3">{s.ligand}</td>
                    <td className="py-3 px-3 text-yellow-300 font-mono font-bold">{s.shift}</td>
                    <td className="py-3 px-3">{s.mult}</td>
                    <td className="py-3 px-3 font-mono text-xs">{s.J}</td>
                    <td className="py-3 px-3 font-mono">{s.integ}</td>
                    <td className="py-3 px-3 text-xs text-purple-300">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INTERAKTIV ¹H NMR SPEKTR — tushuntirilgan */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📈</span> 5. ¹H NMR spektr simulyatsiyasi (DMSO-d₆, 400 MHz)
            </h2>
            <div className="flex gap-2">
              {[1, 2, 4].map(z => (
                <button
                  key={z}
                  onClick={() => setZoomLevel(z)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    zoomLevel === z ? "bg-yellow-600 text-white" : "bg-purple-800/50 text-purple-300"
                  }`}
                >
                  {z}× zoom
                </button>
              ))}
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-lg p-4 text-xs text-purple-200 leading-relaxed border-l-4 border-yellow-500/50">
            <strong className="text-yellow-300">Grafik nima ko'rsatadi:</strong> X-o'q — kimyoviy siljish δ (ppm da), o'ngdan chapga o'sadi (bu NMR konventsiyasi — <em>deshielded</em>, ya'ni kam ekranlangan yadrolar chapda).
            Y-o'q — signal intensivligi. TMS (0 ppm) — xalqaro referens, doim spektrning o'ng chekkasida.
            Sariq balandligi asosiy ¹H(NH₃) signali — 15H integratsiya bilan (5 ta NH₃ × 3 H). Uning shakli — <strong>singlet</strong> chunki qo'shni ¹⁴N kvadrupol o'zaro ta'sirini “decouple” qiladi.
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <svg viewBox="0 0 700 340" className="w-full h-auto" role="img" aria-label="¹H NMR spektr [Co(NH3)5(NO2)]Cl2">
              <defs>
                <linearGradient id="peakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Fon */}
              <rect x="50" y="20" width="620" height="250" fill="#1e1b4b" fillOpacity="0.3" stroke="#4c1d95" strokeWidth="0.5" />

              {/* Y o'qi */}
              <line x1="50" y1="270" x2="50" y2="20" stroke="#a78bfa" strokeWidth="1" />
              <polygon points="50,15 46,25 54,25" fill="#a78bfa" />
              <text x="15" y="150" fontSize="11" fill="#c4b5fd" transform="rotate(-90 15 150)">Intensivlik (nisbiy)</text>

              {/* X o'qi */}
              <line x1="50" y1="270" x2="680" y2="270" stroke="#a78bfa" strokeWidth="1" />
              <polygon points="685,270 675,266 675,274" fill="#a78bfa" />

              {/* Grid va belgilar (ppm) */}
              {(() => {
                const [pMin, pMax] = ppmRange
                const scale = 620 / (pMax - pMin)
                const ticks = []
                const step = (pMax - pMin) > 8 ? 2 : (pMax - pMin) > 4 ? 1 : 0.5
                for (let p = Math.ceil(pMin); p <= pMax; p += step) {
                  const x = 670 - (p - pMin) * scale
                  ticks.push(
                    <g key={p}>
                      <line x1={x} y1="20" x2={x} y2="270" stroke="#3b3470" strokeWidth="0.4" strokeDasharray="2,3" />
                      <line x1={x} y1="270" x2={x} y2="274" stroke="#a78bfa" strokeWidth="1" />
                      <text x={x} y="288" textAnchor="middle" fontSize="10" fill="#a78bfa">{p}</text>
                    </g>
                  )
                }
                return ticks
              })()}
              <text x="360" y="310" textAnchor="middle" fontSize="11" fill="#c4b5fd">Kimyoviy siljish δ (ppm) — o'ngdan chapga o'sadi</text>

              {/* Asosiy signal 3.5 ppm da (NH3, 15H) — zoomga qarab pozitsiya */}
              {(() => {
                const [pMin, pMax] = ppmRange
                if (3.5 < pMin || 3.5 > pMax) return null
                const scale = 620 / (pMax - pMin)
                const x = 670 - (3.5 - pMin) * scale
                const peakH = 220
                return (
                  <g>
                    {/* Lorentz-shaklidagi cho'qqi (approx) */}
                    <path d={`M ${x-20} 270 Q ${x-10} 265 ${x-5} 60 L ${x-2} 50 L ${x} 45 L ${x+2} 50 L ${x+5} 60 Q ${x+10} 265 ${x+20} 270`}
                          fill="url(#peakGrad)" opacity="0.85" />
                    <line x1={x} y1="270" x2={x} y2="45" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
                    <text x={x} y="38" textAnchor="middle" fontSize="11" fill="#fbbf24" fontWeight="bold">
                      δ = 3.5 ppm
                    </text>
                    <text x={x} y="26" textAnchor="middle" fontSize="9" fill="#fde68a">
                      NH₃ (singlet, 15H)
                    </text>
                    {/* Integratsiya chizig'i */}
                    <line x1={x-30} y1="170" x2={x-30} y2="90" stroke="#22c55e" strokeWidth="1.5" />
                    <line x1={x-30} y1="90" x2={x+30} y2="90" stroke="#22c55e" strokeWidth="1.5" />
                    <text x={x-45} y="85" fontSize="9" fill="#4ade80" fontWeight="bold">15H</text>
                  </g>
                )
              })()}

              {/* TMS referens (0 ppm) — agar zoom oralig'ida bo'lsa */}
              {(() => {
                const [pMin, pMax] = ppmRange
                if (0 < pMin || 0 > pMax) return null
                const scale = 620 / (pMax - pMin)
                const x = 670 - (0 - pMin) * scale
                return (
                  <g>
                    <line x1={x} y1="270" x2={x} y2="220" stroke="#94a3b8" strokeWidth="1.5" />
                    <text x={x} y="215" textAnchor="middle" fontSize="9" fill="#cbd5e1">TMS = 0</text>
                  </g>
                )
              })()}

              {/* DMSO-d5 residual signal (2.50 ppm) — agar zoom oralig'ida */}
              {(() => {
                const [pMin, pMax] = ppmRange
                if (2.5 < pMin || 2.5 > pMax) return null
                const scale = 620 / (pMax - pMin)
                const x = 670 - (2.5 - pMin) * scale
                return (
                  <g>
                    <line x1={x} y1="270" x2={x} y2="180" stroke="#a78bfa" strokeWidth="1.5" />
                    <text x={x} y="175" textAnchor="middle" fontSize="9" fill="#c4b5fd">DMSO-d₅</text>
                    <text x={x} y="165" textAnchor="middle" fontSize="8" fill="#c4b5fd">2.50</text>
                  </g>
                )
              })()}

              {/* HDO qoldiq (3.33 ppm DMSO-d6 da) */}
              {(() => {
                const [pMin, pMax] = ppmRange
                if (3.33 < pMin || 3.33 > pMax) return null
                const scale = 620 / (pMax - pMin)
                const x = 670 - (3.33 - pMin) * scale
                return (
                  <g>
                    <line x1={x} y1="270" x2={x} y2="200" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="3,2" />
                    <text x={x} y="195" textAnchor="middle" fontSize="8" fill="#93c5fd">HDO</text>
                    <text x={x} y="186" textAnchor="middle" fontSize="7" fill="#93c5fd">3.33</text>
                  </g>
                )
              })()}
            </svg>
          </div>

          {/* Grafik interpretatsiyasi — batafsil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
              <div className="text-yellow-300 font-bold mb-1">🟡 Asosiy signal: 3.5 ppm</div>
              <div className="text-purple-200">Bu singlet — barcha 15 NH₃ protonining ekvivalent shakldagi rezonansi. Odatdagi erkin NH₃ dan (0.9 ppm) 2.6 ppm deshieldlangan (Co³⁺ ta'siri).</div>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <div className="text-blue-300 font-bold mb-1">🔵 DMSO-d₅: 2.50 ppm</div>
              <div className="text-purple-200">Deyterlangan erituvchining qoldiq protonli izotopologi. Bu signal doimo mavjud — ammo integrallash kerak emas. Gottlieb (1997) jadvalidan.</div>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
              <div className="text-cyan-300 font-bold mb-1">💧 HDO qoldiq: 3.33 ppm</div>
              <div className="text-purple-200">DMSO-d₆ dagi qoldiq suv (HDO). NH₃ signaliga yaqin — shuning uchun DMSO-d₆ juda quruq bo'lishi kerak. Molekulyar elak (3Å) bilan quritish tavsiya.</div>
            </div>
          </div>
        </div>

        {/* LINKAGE IZOMER TAQQOSLASH — kengaytirilgan jadval */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span> 6. Linkage izomer taqqoslash — [Co(NH₃)₅(X)]²⁺ seriyasi
          </h2>

          <div className="bg-yellow-900/30 rounded-lg p-4 border-l-4 border-yellow-400">
            <p className="text-yellow-100 text-sm leading-relaxed">
              <strong className="text-yellow-300">Ambidentat ligandlar</strong> — ikki xil donor atomiga ega ligandlar (NO₂⁻, SCN⁻, CN⁻). Ular metallga N yoki O (S) orqali bog'lanishi mumkin,
              natijada <strong>linkage izomerlar</strong> hosil bo'ladi. Pearson HSAB nazariyasi bo'yicha: <em>qattiq</em> metallar (Co³⁺, Cr³⁺) N ni afzal ko'radi;
              <em>yumshoq</em> metallar (Pt²⁺, Hg²⁺) S/O ni tanlaydi. ¹⁵N NMR va ⁵⁹Co NMR bu ikkalasini bir-biridan ajratishning eng aniq usuli.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-yellow-500 bg-yellow-950/50">
                  <th className="py-3 px-3 text-yellow-400">Kompleks</th>
                  <th className="py-3 px-3 text-yellow-400">Ligand donor</th>
                  <th className="py-3 px-3 text-yellow-400">Rang</th>
                  <th className="py-3 px-3 text-yellow-400">δ(¹⁵N)</th>
                  <th className="py-3 px-3 text-yellow-400">δ(⁵⁹Co)</th>
                  <th className="py-3 px-3 text-yellow-400">Barqarorlik</th>
                  <th className="py-3 px-3 text-yellow-400">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.linkageComparison.map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${i === 0 ? "bg-yellow-900/20" : ""}`}>
                    <td className="py-3 px-3 font-mono text-yellow-300 font-bold text-xs">{r.compound}</td>
                    <td className="py-3 px-3 text-xs">{r.ligand}</td>
                    <td className="py-3 px-3 text-xs">{r.color}</td>
                    <td className="py-3 px-3 text-yellow-300 font-mono text-xs">{r.n15}</td>
                    <td className="py-3 px-3 text-yellow-300 font-mono text-xs">{r.co59}</td>
                    <td className="py-3 px-3 text-xs">{r.stability}</td>
                    <td className="py-3 px-3 text-xs text-purple-300">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-900/30 rounded-lg p-4">
            <p className="text-yellow-100 text-sm leading-relaxed">
              <strong className="text-yellow-300">Asosiy xulosa:</strong> Nitro (+412 ppm) va nitrito (+528 ppm) izomerlari orasidagi <strong>Δδ(¹⁵N) ≈ 116 ppm</strong> farq — juda katta va bir-biridan aniq ajraladi.
              Bu farq IQ spektroskopiyasidagi 200 cm⁻¹ farq va UV-Vis spektroskopiyadagi 40 nm farqdan aniqroq. Shu sabab ¹⁵N NMR — linkage izomerni <strong>eng ishonchli aniqlaydigan metod</strong>.
            </p>
          </div>
        </div>

        {/* IZOMERLANISH YO'LLARI — DFT interaktiv */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span> 7. Termik izomerlanish yo'llari (DFT ωB97XD)
          </h2>

          <div className="bg-orange-900/30 rounded-lg p-4 border-l-4 border-orange-400">
            <p className="text-orange-100 text-sm leading-relaxed">
              <strong className="text-orange-300">Kinetik masala:</strong> Nitrito → Nitro qanday mexanizm bilan sodir bo'ladi? Intramolekulyar (NO₂ Co ni tark etmasdan aylanish) yoki intermolekulyar (dissotsiativ)?
              1961-yilda Basolo va Pearson <sup>15</sup>N-belgilash tajribalari orqali <strong>intramolekulyar mexanizmni</strong> tasdiqladilar. 2022-yilgi PMC9077707 tadqiqoti (ωB97XD/6-31+G(d,p)) esa
              ikkita alternativ yo'lni topdi — <strong>endo-oraliqli</strong> (past to'siq) va <strong>bir bosqichli</strong> (yuqori to'siq).
            </p>
          </div>

          {/* Pathway tanlash */}
          <div className="flex gap-2 flex-wrap">
            {COMPOUND.dftPathways.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePathway(p.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all text-left flex-1 min-w-[280px] ${
                  activePathway === p.id
                    ? "bg-orange-600/60 text-white border border-orange-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                <div className="font-bold">{p.name}</div>
                <div className="text-xs mt-1 opacity-80">To'siq: {p.barrier} {p.barrierUnit} {p.preferred ? "⭐ tanlangan" : ""}</div>
              </button>
            ))}
          </div>

          {/* Reaksiya energiya diagrammasi */}
          <div className="bg-purple-950/40 p-5 rounded-xl border border-purple-700/30">
            <h4 className="text-orange-400 font-bold mb-3">Reaksiya koordinatasi — energiya profili</h4>
            <p className="text-purple-300 text-xs mb-3">
              Grafik gorizontal — reaksiya rivojlanishi (koordinatasi), vertikal — nisbiy energiya (kkal/mol). Minimumlar — barqaror shakllar (yashil doiralar).
              TS (transition state) — to'siq cho'qqilari (qizil uchburchaklar), bu holatda molekula parchalanmaydi, faqat bir minimumdan boshqasiga o'tish nuqtasi.
            </p>
            {(() => {
              const path = COMPOUND.dftPathways.find(p => p.id === activePathway)
              if (!path) return null
              const steps = path.steps
              const maxE = Math.max(...steps.map(s => s.energy)) + 5
              const minE = Math.min(...steps.map(s => s.energy)) - 3
              const width = 620
              const height = 240
              const padL = 60, padR = 30, padT = 30, padB = 40
              const xStep = (width - padL - padR) / (steps.length - 1)
              const yScale = (height - padT - padB) / (maxE - minE)

              // Points
              const points = steps.map((s, i) => ({
                x: padL + i * xStep,
                y: height - padB - (s.energy - minE) * yScale,
                s,
              }))
              return (
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                  {/* Axes */}
                  <line x1={padL} y1={padT} x2={padL} y2={height - padB} stroke="#a78bfa" strokeWidth="1" />
                  <line x1={padL} y1={height - padB} x2={width - padR} y2={height - padB} stroke="#a78bfa" strokeWidth="1" />
                  <text x="20" y={height / 2} fontSize="10" fill="#c4b5fd" transform={`rotate(-90 20 ${height / 2})`}>E (kkal/mol)</text>
                  <text x={width / 2} y={height - 8} textAnchor="middle" fontSize="10" fill="#c4b5fd">Reaksiya koordinatasi</text>

                  {/* Energy grid lines */}
                  {[0, 10, 20, 30, 40].map(e => {
                    if (e < minE || e > maxE) return null
                    const y = height - padB - (e - minE) * yScale
                    return (
                      <g key={e}>
                        <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#3b3470" strokeWidth="0.4" strokeDasharray="2,3" />
                        <text x={padL - 5} y={y + 3} textAnchor="end" fontSize="9" fill="#a78bfa">{e}</text>
                      </g>
                    )
                  })}

                  {/* Smooth curve between points */}
                  <path
                    d={points.map((p, i) => {
                      if (i === 0) return `M ${p.x} ${p.y}`
                      const prev = points[i - 1]
                      const midX = (prev.x + p.x) / 2
                      return `C ${midX} ${prev.y}, ${midX} ${p.y}, ${p.x} ${p.y}`
                    }).join(" ")}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                  />

                  {/* Points and labels */}
                  {points.map((p, i) => (
                    <g key={i}>
                      {p.s.type === "TS" ? (
                        <polygon
                          points={`${p.x - 6},${p.y + 4} ${p.x + 6},${p.y + 4} ${p.x},${p.y - 6}`}
                          fill="#ef4444"
                          stroke="#dc2626"
                          strokeWidth="1"
                        />
                      ) : (
                        <circle cx={p.x} cy={p.y} r="5" fill="#22c55e" stroke="#16a34a" strokeWidth="1" />
                      )}
                      <text
                        x={p.x}
                        y={p.y - 12}
                        textAnchor="middle"
                        fontSize="9"
                        fill={p.s.type === "TS" ? "#fca5a5" : "#86efac"}
                        fontWeight="bold"
                      >
                        {p.s.energy.toFixed(2)}
                      </text>
                      <text
                        x={p.x}
                        y={height - padB + 15}
                        textAnchor="middle"
                        fontSize="8"
                        fill="#c4b5fd"
                      >
                        {p.s.label}
                      </text>
                    </g>
                  ))}
                </svg>
              )
            })()}
            <div className="mt-3 flex gap-4 text-xs text-purple-300 flex-wrap">
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Minimum (barqaror holat)</div>
              <div className="flex items-center gap-1"><svg width="12" height="12"><polygon points="0,10 12,10 6,0" fill="#ef4444" /></svg> TS (o'tish holati)</div>
            </div>
          </div>

          {(() => {
            const path = COMPOUND.dftPathways.find(p => p.id === activePathway)
            if (!path) return null
            return (
              <div className={`rounded-xl p-4 ${path.preferred ? "bg-green-900/30 border border-green-500/40" : "bg-red-900/30 border border-red-500/40"}`}>
                <p className="text-sm text-purple-100 leading-relaxed">
                  <strong className={path.preferred ? "text-green-300" : "text-red-300"}>
                    {path.preferred ? "✅ Tanlangan yo'l:" : "❌ Muqobil yo'l:"}
                  </strong> {path.note}
                </p>
              </div>
            )
          })()}

          {/* DFT metodi haqida */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4">
              <h4 className="text-orange-300 font-bold text-sm mb-2">🔬 DFT metodi parametrlari</h4>
              <div className="space-y-1 text-xs">
                <div><span className="text-purple-400">Funksional:</span> <span className="text-orange-200 font-mono">{COMPOUND.dftDetails.method}</span></div>
                <div><span className="text-purple-400">Co uchun basis:</span> <span className="text-orange-200 font-mono">{COMPOUND.dftDetails.basisSetForCo}</span></div>
                <div><span className="text-purple-400">Erituvchi modeli:</span> <span className="text-orange-200 font-mono">{COMPOUND.dftDetails.solventModel}</span></div>
                <div><span className="text-purple-400">Chastotalar:</span> <span className="text-orange-200">{COMPOUND.dftDetails.frequencies}</span></div>
                <div><span className="text-purple-400">Manba:</span> <span className="text-orange-200">{COMPOUND.dftDetails.source}</span></div>
              </div>
            </div>
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4">
              <h4 className="text-orange-300 font-bold text-sm mb-2">📐 Struktura tekshiruvi (DFT vs X-ray)</h4>
              <div className="space-y-1 text-xs">
                <div className="text-orange-200">{COMPOUND.dftDetails.coNBondLength}</div>
                <div className="text-orange-200">{COMPOUND.dftDetails.coNBondLengthNO2}</div>
                <div className="text-orange-200">PJTE stabillash: {COMPOUND.dftDetails.pjteStabilization}</div>
                <div className="mt-2 bg-orange-950/50 p-2 rounded">
                  <span className="text-orange-300 font-bold">Muhim eslatma:</span>
                  <span className="text-purple-200 ml-1">{COMPOUND.dftDetails.significance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TERMODINAMIKA VA KINETIKA */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🌡️</span> 8. Termodinamika va kinetika (DSC + Eyring tahlil)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">🧭 Izomerlanish termodinamikasi</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Reaksiya", COMPOUND.thermodynamics.isomerization.reaction],
                  ["Yo'nalish", COMPOUND.thermodynamics.isomerization.direction],
                  ["ΔH°", COMPOUND.thermodynamics.isomerization.deltaH],
                  ["ΔS°", COMPOUND.thermodynamics.isomerization.deltaS],
                  ["ΔG°(298 K)", COMPOUND.thermodynamics.isomerization.deltaG298],
                  ["Muvozanat K", COMPOUND.thermodynamics.isomerization.K],
                ].map(([k, v], i) => (
                  <div key={i} className="flex flex-col gap-1 border-b border-orange-800/30 pb-1">
                    <span className="text-purple-400 text-xs">{k}:</span>
                    <span className="text-orange-200 font-mono text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">⏱️ Kinetik parametrlar</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Aktivatsiya E_a", COMPOUND.thermodynamics.isomerization.activationEnergy],
                  ["Tezlik konstantasi (298 K)", COMPOUND.thermodynamics.isomerization.rateConstant298],
                  ["Yarim yemirilish t₁/₂", COMPOUND.thermodynamics.isomerization.halfLife],
                  ["Mexanizm", COMPOUND.thermodynamics.isomerization.mechanism],
                  ["Eyring parametrlari", COMPOUND.thermodynamics.isomerization.eyring],
                ].map(([k, v], i) => (
                  <div key={i} className="flex flex-col gap-1 border-b border-orange-800/30 pb-1">
                    <span className="text-purple-400 text-xs">{k}:</span>
                    <span className="text-orange-200 font-mono text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-orange-900/30 rounded-lg p-4">
            <h4 className="text-orange-300 font-bold mb-2">🔒 Nima uchun bu kompleks inert (sekin almashinuv)?</h4>
            <p className="text-purple-200 text-sm leading-relaxed mb-2">{COMPOUND.thermodynamics.inertness.why}</p>
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-orange-300">Taqqoslash (log k_ex(H₂O), s⁻¹):</strong> {COMPOUND.thermodynamics.inertness.comparison}
            </p>
            <p className="text-purple-200 text-sm mt-2">{COMPOUND.thermodynamics.inertness.waterExchange}</p>
            <p className="text-purple-200 text-sm mt-1"><em>{COMPOUND.thermodynamics.inertness.marcusLimit}</em></p>
          </div>
        </div>

        {/* STRUKTURAVIY PARAMETRLAR */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📏</span> 9. Strukturaviy parametrlar (X-ray + trans-effekt)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog' uzunliklari (X-ray, Å)</h3>
              <div className="space-y-2 text-xs">
                {[
                  ["Co–N(NO₂)", COMPOUND.structural.bondLengths.coN_NO2],
                  ["Co–N(NH₃) trans-NO₂", COMPOUND.structural.bondLengths.coN_NH3_trans],
                  ["Co–N(NH₃) cis-NO₂", COMPOUND.structural.bondLengths.coN_NH3_cis],
                  ["N–O (nitro)", COMPOUND.structural.bondLengths.n_O_nitro],
                  ["Referens", COMPOUND.structural.bondLengths.referenceCoN6],
                ].map(([k, v], i) => (
                  <div key={i} className="bg-green-950/40 rounded p-2">
                    <div className="text-purple-400">{k}:</div>
                    <div className="text-green-200 font-mono mt-1">{v}</div>
                  </div>
                ))}
                <div className="text-purple-400 text-[10px] italic mt-1">Manba: {COMPOUND.structural.bondLengths.source}</div>
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog' burchaklari va H-bog'lar</h3>
              <div className="space-y-2 text-xs">
                {[
                  ["O–N–O (nitro)", COMPOUND.structural.bondAngles.ono_nitro],
                  ["Co–N–O", COMPOUND.structural.bondAngles.coN_O],
                  ["N–Co–N (cis)", COMPOUND.structural.bondAngles.N_Co_N_cis],
                  ["N–Co–N (trans)", COMPOUND.structural.bondAngles.N_Co_N_trans],
                  ["Dihedral NO₂", COMPOUND.structural.bondAngles.dihedralNO2],
                  ["Nitrito bilan taqqoslash", COMPOUND.structural.bondAngles.nitritoComparison],
                ].map(([k, v], i) => (
                  <div key={i} className="bg-green-950/40 rounded p-2">
                    <div className="text-purple-400">{k}:</div>
                    <div className="text-green-200 font-mono mt-1">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-green-900/30 rounded-lg p-4 space-y-2">
            <h4 className="text-green-300 font-bold">⇄ Trans-effekt va trans-influence</h4>
            <p className="text-purple-200 text-xs">{COMPOUND.structural.transEffect.definition}</p>
            <div><strong className="text-green-300 text-xs">Tartib:</strong> <span className="text-purple-200 text-xs font-mono">{COMPOUND.structural.transEffect.order}</span></div>
            <div><strong className="text-green-300 text-xs">Mexanizm:</strong> <span className="text-purple-200 text-xs">{COMPOUND.structural.transEffect.mechanism}</span></div>
            <div><strong className="text-green-300 text-xs">Oqibat:</strong> <span className="text-purple-200 text-xs">{COMPOUND.structural.transEffect.consequence}</span></div>
          </div>

          <div className="bg-green-900/30 rounded-lg p-4">
            <p className="text-purple-200 text-sm"><strong className="text-green-300">🔗 Vodorod bog'lari (photo-salient effekt uchun kritik):</strong> {COMPOUND.structural.hydrogenBonding}</p>
          </div>
        </div>

        {/* LABORATORIYA TARTIBI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧪</span> 10. Laboratoriya tartibi (0 dan xulosaga qadar)
          </h2>

          <p className="text-purple-300 text-sm">
            Bosqichlar ustiga bosing — har biri uchun batafsil ishlab chiqilgan protokol va nazariy izohni ochadi. Umumiy vaqt: ~3–5 soat (¹H asosiy),
            ¹⁵N va ⁵⁹Co bilan to'liq to'plam — 24 soatgacha.
          </p>

          <div className="space-y-3">
            {COMPOUND.labProcedure.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveLabStep(i)}
                className={`rounded-xl p-4 cursor-pointer transition-all ${
                  activeLabStep === i
                    ? "bg-yellow-900/40 border-2 border-yellow-400"
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-yellow-500/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    activeLabStep === i ? "bg-yellow-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-400 font-bold text-sm">{step.title}</p>
                  </div>
                  <span className="text-[10px] text-purple-400 whitespace-nowrap">⏱ {step.time}</span>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-100 text-xs leading-relaxed mb-2">{step.desc}</p>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                      <div className="text-yellow-300 font-bold text-xs mb-1">📚 Nazariy izoh:</div>
                      <p className="text-purple-200 text-xs leading-relaxed">{step.theory}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* HALAQIT BERUVCHI OMILLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⚠️</span> 11. Halaqit beruvchi omillar (interferentsiya)
          </h2>
          <p className="text-purple-300 text-sm">
            Har bir omil uchun ta'siri, jiddiylik darajasi va yechim ko'rsatilgan. Batafsil nazariy izohni ko'rish uchun qatorga bosing.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-yellow-400">Manba</th>
                  <th className="py-3 px-3 text-yellow-400">Ta'siri</th>
                  <th className="py-3 px-3 text-yellow-400">Jiddiylik</th>
                  <th className="py-3 px-3 text-yellow-400">Yechim</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.interferences.map((intf, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeInterference === i ? "bg-yellow-900/20" : ""
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-xs">{intf.source}</td>
                    <td className="py-3 px-3 text-xs">{intf.effect}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded text-[10px] whitespace-nowrap ${
                        intf.severity === "Yuqori"
                          ? "bg-red-600/30 text-red-300"
                          : intf.severity === "O'rta"
                          ? "bg-yellow-600/30 text-yellow-300"
                          : "bg-green-600/30 text-green-300"
                      }`}>
                        {intf.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs">{intf.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-yellow-300 font-bold text-sm mb-2 flex items-center gap-2">
              📚 Tanlangan omilning nazariy izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {COMPOUND.interferences[activeInterference].theory}
            </p>
          </div>
        </div>

        {/* KENGAYTIRUVCHI METODLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔬</span> 12. Kengaytiruvchi metodlar
          </h2>

          <div className="flex flex-wrap gap-2">
            {COMPOUND.advancedTechniques.map((tech, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(i)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTechnique === i
                    ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name.split("(")[0].trim()}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">{COMPOUND.advancedTechniques[activeTechnique].name}</h3>
            <p className="text-purple-200 text-sm mb-4 leading-relaxed">{COMPOUND.advancedTechniques[activeTechnique].desc}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-3">
                <h4 className="text-green-400 font-bold mb-2 text-sm">✅ Afzalliklar</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {COMPOUND.advancedTechniques[activeTechnique].advs.map((a, j) => (
                    <li key={j}>• {a}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-3">
                <h4 className="text-red-400 font-bold mb-2 text-sm">❌ Kamchiliklar</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {COMPOUND.advancedTechniques[activeTechnique].disadvs.map((d, j) => (
                    <li key={j}>• {d}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-3 mb-2">
              <div className="text-purple-400 text-xs">🎯 Eng yaxshi qo'llanish:</div>
              <div className="text-white text-sm mt-1">{COMPOUND.advancedTechniques[activeTechnique].bestFor}</div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
              <div className="text-yellow-300 font-bold text-xs mb-1">📝 Amaliy misol:</div>
              <p className="text-purple-200 text-xs">{COMPOUND.advancedTechniques[activeTechnique].example}</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">✅</span> Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside text-sm">
            <li><strong className="text-yellow-300">Kompleks tabiati:</strong> Co³⁺ d⁶ past-spin (t₂g⁶ eg⁰), C₄ᵥ simmetriya, diamagnit (μ_eff ≈ 0 μB), Δ_o = 23 600 cm⁻¹, CFSE = −677 kJ/mol.</li>
            <li><strong className="text-yellow-300">¹H NMR:</strong> Barcha 15 NH₃ protoni δ = 3.5 ppm da bir singlet (¹⁴N kvadrupol decoupling + tez H-almashinuv). Erkin NH₃ dan 2.6 ppm deshieldlangan (Ramsey σ_para).</li>
            <li><strong className="text-yellow-300">¹⁵N NMR — linkage izomer identifikatsiyasi:</strong> δ(NO₂, N-koord.) = +412 ppm; nitrito izomerda +528 ppm. Δδ ≈ 116 ppm — aniq va ishonchli farq.</li>
            <li><strong className="text-yellow-300">⁵⁹Co NMR — metall zondi:</strong> δ = +8120 ppm ([Co(CN)₆]³⁻ = 0 shkalasida), Δν₁/₂ ≈ 1000–2000 Hz (kvadrupol), CQ ≈ 20 MHz.</li>
            <li><strong className="text-yellow-300">Termodinamika:</strong> ΔH° = −11.4 kJ/mol (ekzotermik, DSC); K_eq(298) ≈ 36 (97:3 nitro:nitrito).</li>
            <li><strong className="text-yellow-300">Kinetika:</strong> E_a = 108 kJ/mol (eritmada); t₁/₂(25°C, qorong'i) = 5.5 soat; intramolekulyar mexanizm.</li>
            <li><strong className="text-yellow-300">DFT (ωB97XD):</strong> Yo'l A (nitro → endo-nitrito → exo-nitrito, to'siq 38.16 kkal/mol) yo'l B dan (41.76) 3.6 kkal/mol qulayroq.</li>
            <li><strong className="text-yellow-300">Photo-salient effekt (Naumov 2013):</strong> UV yorug'lik (λ=350 nm) kristall sakrashini keltirib chiqaradi — nitro → nitrito foto-izomerlanish orqali.</li>
            <li><strong className="text-yellow-300">Trans-effekt:</strong> NO₂⁻  NH₃ tartibida; trans-Co–N(NH₃) bog'i cis-dan 0.020 Å uzunroq.</li>
            <li><strong className="text-yellow-300">Amaliyot:</strong> Amber probirka (UV himoya), DMSO-d₆ erituvchi, 15–25 mg namuna, ¹⁵N-boyitilgan tavsiya.</li>
          </ol>
        </div>

        {/* Pastki tugmalar */}
        <div className="flex flex-col md:flex-row justify-between gap-3 pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← Birikmalar katalogi
          </Link>
          <button
            onClick={() => generatePDF({ setPdfGenerating, setPdfMessage })}
            disabled={pdfGenerating}
            className="px-6 py-3 bg-red-600/80 hover:bg-red-500 rounded-xl text-white font-semibold disabled:bg-red-800 disabled:cursor-not-allowed"
          >
            {pdfGenerating ? "⏳ PDF yaratilyapti..." : "📄 Ilmiy PDF ni yuklab olish" }
          </button>
          <Link href="/ilmiy/tahlil/nmr" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold text-center">
            YaMR nazariyasi →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500 space-y-1">
          <p>© 2026 jdakimyo.uz  •  [Co(NH₃)₅(NO₂)]Cl₂ YaMR moduli</p>
          <p>Manbalar: Jørgensen (1894), Werner (Nobel 1913), Ramsey (Nobel 1989), Bethe (1929), Naumov et al. (2013), PMC9077707 (2022)</p>
        </div>
      </footer>
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PDF EKSPORT — [Co(NH₃)₅(NO₂)]Cl₂ YaMR to'liq ilmiy hisobot
// • 3D skrenshoti YO'Q (foydalanuvchi so'roviga muvofiq)
// • Foydalanilgan adabiyotlar YO'Q
// • Faqat YaMR ma'lumotlariga bag'ishlangan
// • A4, ilmiy maqola uslubida, DejaVu Sans font
// ═══════════════════════════════════════════════════════════════════════════════
async function generatePDF({ setPdfGenerating, setPdfMessage }) {
  setPdfGenerating(true)
  setPdfMessage("📚 Font va tuzilma tayyorlanmoqda...")
  try {
    const pdfDoc = await PDFDocument.create()
    pdfDoc.registerFontkit(fontkit)

    // Font yuklash (public/fonts/ papkasidan)
    let regularFont, boldFont, italicFont
    try {
      const [regBytes, boldBytes, italBytes] = await Promise.all([
        fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error("Regular font"); return r.arrayBuffer() }),
        fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error("Bold font"); return r.arrayBuffer() }),
        fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error("Italic font"); return r.arrayBuffer() }),
      ])
      regularFont = await pdfDoc.embedFont(regBytes, { subset: true })
      boldFont = await pdfDoc.embedFont(boldBytes, { subset: true })
      italicFont = await pdfDoc.embedFont(italBytes, { subset: true })
    } catch (fontErr) {
      setPdfMessage("❌ Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
      setPdfGenerating(false)
      return
    }

    // Ranglar
    const C = {
      purple:      rgb(0.30, 0.11, 0.58),
      purpleLight: rgb(0.86, 0.78, 1.0),
      purpleMid:   rgb(0.65, 0.55, 0.98),
      purpleSoft:  rgb(0.51, 0.39, 0.71),
      purpleDark:  rgb(0.12, 0.11, 0.29),
      textDark:    rgb(0.08, 0.08, 0.16),
      textMuted:   rgb(0.47, 0.47, 0.55),
      textGray:    rgb(0.47, 0.47, 0.47),
      yellow:      rgb(0.86, 0.55, 0),
      yellowDeep:  rgb(0.71, 0.39, 0),
      yellowSoft:  rgb(0.71, 0.31, 0.08),
      green:       rgb(0.08, 0.47, 0.31),
      greenDark:   rgb(0.12, 0.47, 0.27),
      blue:        rgb(0.08, 0.31, 0.55),
      cyan:        rgb(0.02, 0.42, 0.55),
      orange:      rgb(0.90, 0.35, 0.10),
      red:         rgb(0.80, 0.20, 0.20),
      grayLine:    rgb(0.78, 0.78, 0.86),
      bgPurple:    rgb(0.97, 0.96, 1.0),
      bgYellow:    rgb(1.0, 0.98, 0.90),
      bgBlue:      rgb(0.94, 0.98, 1.0),
      bgGreen:     rgb(0.94, 1.0, 0.98),
      bgOrange:    rgb(1.0, 0.96, 0.90),
      bgAbstract:  rgb(0.96, 0.94, 1.0),
      white:       rgb(1, 1, 1),
    }

    // A4 o'lchamlari
    const PAGE_W = 595.28, PAGE_H = 841.89
    const MARGIN = 55
    const CONTENT_W = PAGE_W - 2 * MARGIN
    const FOOTER_Y = 30
    const HEADER_H = 65

    let page = pdfDoc.addPage([PAGE_W, PAGE_H])
    let y = PAGE_H - MARGIN
    let pageNum = 1

    // Helpers
    const measure = (t, f, s) => f.widthOfTextAtSize(String(t), s)
    const truncate = (t, f, s, maxW) => {
      const s0 = String(t)
      if (measure(s0, f, s) <= maxW) return s0
      let lo = 0, hi = s0.length
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1
        if (measure(s0.slice(0, mid) + "…", f, s) <= maxW) lo = mid
        else hi = mid - 1
      }
      return s0.slice(0, lo) + "…"
    }
    const wrapText = (text, font, size, maxW) => {
      if (!text) return [""]
      const words = String(text).split(/\s+/)
      const lines = []
      let cur = ""
      for (const w of words) {
        const test = cur ? cur + " " + w : w
        if (measure(test, font, size) > maxW && cur) {
          lines.push(cur)
          cur = w
        } else cur = test
        if (measure(cur, font, size) > maxW) {
          let piece = ""
          for (const ch of cur) {
            if (measure(piece + ch, font, size) > maxW) { lines.push(piece); piece = ch }
            else piece += ch
          }
          cur = piece
        }
      }
      if (cur) lines.push(cur)
      return lines
    }
    const safeText = (t, opts) => {
      const { x, y: ty, size = 10, font = regularFont, color = C.textDark, align = "left", maxWidth = null } = opts
      const s = cleanText(t)
      const limit = maxWidth ?? (PAGE_W - MARGIN - x)
      const finalT = truncate(s, font, size, limit)
      let fx = x
      const w = measure(finalT, font, size)
      if (align === "center") fx = x - w / 2
      else if (align === "right") fx = x - w
      page.drawText(finalT, { x: fx, y: ty, size, font, color })
    }
    const drawCenteredText = (t, cy, size, font, color, maxW = CONTENT_W) => {
      const lines = wrapText(cleanText(t), font, size, maxW)
      lines.forEach((ln, i) => {
        const w = measure(ln, font, size)
        page.drawText(ln, { x: (PAGE_W - w) / 2, y: cy - i * (size + 3), size, font, color })
      })
      return lines.length * (size + 3)
    }

    const addFooter = () => {
      const leftText = truncate(
        `jdakimyo.uz  •  [Co(NH₃)₅(NO₂)]Cl₂ YaMR hisoboti  •  ${new Date().toLocaleDateString("uz-UZ")}`,
        regularFont, 8, CONTENT_W - 30
      )
      page.drawText(leftText, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
      const pageStr = `${pageNum}`
      const w = measure(pageStr, regularFont, 8)
      page.drawText(pageStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
      page.drawLine({ start: { x: MARGIN, y: FOOTER_Y + 12 }, end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 }, thickness: 0.3, color: C.grayLine })
    }
    const addNewPage = () => {
      addFooter()
      page = pdfDoc.addPage([PAGE_W, PAGE_H])
      pageNum++
      y = PAGE_H - MARGIN
    }
    const checkPageBreak = (need) => {
      if (y - need < FOOTER_Y + 25) addNewPage()
    }
    const drawSectionHeader = (num, title, accentColor = C.purple) => {
      checkPageBreak(45)
      page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: accentColor })
      safeText(`${num}. ${title}`, {
        x: MARGIN + 10, y: y - 14, size: 13, font: boldFont, color: accentColor,
        maxWidth: CONTENT_W - 15,
      })
      y -= 24
      page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.5, color: C.grayLine })
      y -= 14
    }
    const drawTableRow = (label, value, bgColor = C.bgPurple, labelColor = C.purple) => {
      const rowH = 20
      const labelW = 200
      const valueX = MARGIN + labelW + 6
      const valueMaxW = CONTENT_W - labelW - 12
      checkPageBreak(rowH + 2)
      page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor })
      safeText(label, { x: MARGIN + 6, y: y - 13, size: 9, font: boldFont, color: labelColor, maxWidth: labelW - 8 })
      const finalVal = truncate(cleanText(value), regularFont, 9, valueMaxW)
      page.drawText(finalVal, { x: valueX, y: y - 13, size: 9, font: regularFont, color: C.textDark })
      y -= rowH
    }
    const drawParagraph = (text, size = 9.5, color = C.textDark, indent = 0) => {
      const lines = wrapText(cleanText(text), regularFont, size, CONTENT_W - indent)
      lines.forEach(ln => {
        checkPageBreak(size + 4)
        page.drawText(ln, { x: MARGIN + indent, y: y - size, size, font: regularFont, color })
        y -= size + 3
      })
      y -= 4
    }

    // ════════════════════════════════════════════════════════════════════
    // SARLAVHA POLOSA
    // ════════════════════════════════════════════════════════════════════
    page.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.purpleDark })
    safeText("JDA-KIMYO ILMIY BYULLETENI  •  YaMR spektroskopiya  •  Vol. 2, Son 1", {
      x: MARGIN, y: PAGE_H - 25, size: 9, font: regularFont, color: C.purpleLight, maxWidth: CONTENT_W * 0.7,
    })
    safeText(`Chop etilgan: ${new Date().toLocaleDateString("uz-UZ")}`, {
      x: PAGE_W - MARGIN, y: PAGE_H - 25, size: 9, font: regularFont, color: C.purpleLight, align: "right", maxWidth: CONTENT_W * 0.3,
    })
    page.drawLine({ start: { x: MARGIN, y: PAGE_H - 37 }, end: { x: PAGE_W - MARGIN, y: PAGE_H - 37 }, thickness: 1, color: C.purpleMid })
    safeText("Koordinatsion Kimyo — Linkage Izomerizm Tahlili", {
      x: MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86), maxWidth: CONTENT_W * 0.65,
    })
    safeText("DOI: 10.0000/jda-kimyo.2026.nmr.001", {
      x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86), align: "right", maxWidth: CONTENT_W * 0.3,
    })
    y = PAGE_H - HEADER_H - 30

    // ════════════════════════════════════════════════════════════════════
    // TITLE
    // ════════════════════════════════════════════════════════════════════
    drawCenteredText("[Co(NH₃)₅(NO₂)]Cl₂ — YaMR Spektroskopiya Tahlili", y, 18, boldFont, C.textDark)
    y -= 26
    drawCenteredText(cleanText(COMPOUND.iupac), y, 11, italicFont, C.purpleSoft)
    y -= 18
    drawCenteredText(
      `Simmetriya: ${cleanText(COMPOUND.pointGroup)}  •  Elektron: Co³⁺ d⁶ (LS)  •  Diamagnit  •  CAS: ${COMPOUND.casNumber}  •  M = ${COMPOUND.molarMass} g/mol`,
      y, 9, regularFont, C.textMuted
    )
    y -= 26

    // ANNOTATSIYA
    const abstract =
      `[Co(NH₃)₅(NO₂)]Cl₂ kompleksi — klassik linkage izomerizmning etaloni. Co³⁺ d⁶ past-spinli konfiguratsiya (t₂g⁶ eg⁰) va C₄ᵥ simmetriya diamagnit xossalarni ta'minlaydi. ` +
      `Yadro magnit rezonansi (YaMR) yordamida uch xil yadro tahlil qilinadi: ¹H (NH₃ protonlari, δ = 3.5 ppm, singlet, 15H integratsiya), ` +
      `¹⁵N (linkage izomerni aniqlash uchun asosiy zond, δ(NO₂) = +412 ppm) va ⁵⁹Co (metall markazi, δ = +8120 ppm, kvadrupol keng chiziq). ` +
      `Nitrito izomer bilan δ(¹⁵N) farqi 116 ppm — boshqa spektroskopik metodlardan aniqroq. ` +
      `DFT hisoblari (ωB97XD/6-31+G(d,p)) izomerlanish yo'lini endo-nitrito oraliq bilan tasdiqlaydi (E_a = 38.16 kkal/mol).`

    const absPadding = 12
    const absInnerW = CONTENT_W - 2 * absPadding
    const absLines = wrapText(cleanText(abstract), regularFont, 9.5, absInnerW)
    const boxH = 24 + absLines.length * 13 + 8
    checkPageBreak(boxH + 20)
    page.drawRectangle({
      x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
      color: C.bgAbstract, borderColor: C.purpleMid, borderWidth: 1,
    })
    safeText("ANNOTATSIYA (ABSTRACT)", {
      x: MARGIN + absPadding, y: y - 16, size: 10, font: boldFont, color: C.purple, maxWidth: absInnerW,
    })
    absLines.forEach((ln, i) => {
      page.drawText(ln, { x: MARGIN + absPadding, y: y - 32 - i * 13, size: 9.5, font: regularFont, color: C.textDark })
    })
    y -= boxH + 22

    let sec = 1

    // ═══ 1. Birikma identifikatsiyasi
    setPdfMessage("📊 Bo'lim 1: Birikma identifikatsiyasi...")
    drawSectionHeader(sec++, "Birikma Identifikatsiyasi", C.purple)
    const infoTable = [
      ["Formulasi", COMPOUND.formulaPlain],
      ["IUPAC nomi", COMPOUND.iupac],
      ["Umumiy nomi", COMPOUND.commonName],
      ["CAS raqami", COMPOUND.casNumber],
      ["Molyar massa", `${COMPOUND.molarMass} g/mol`],
      ["Rangi", COMPOUND.color],
      ["Elektrolit turi", COMPOUND.electrolyteType],
      ["Molyar o'tkazuvchanlik", COMPOUND.molarConductivity],
      ["Struktura", COMPOUND.structure],
      ["Metall-ligand bog'lar", COMPOUND.metalLigand],
      ["Nuqtaviy guruh", COMPOUND.pointGroup],
      ["Kashfiyot", COMPOUND.discovery],
    ]
    infoTable.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgPurple : C.white, C.purple))
    y -= 12

    // ═══ 2. Kristall maydon nazariyasi
    setPdfMessage("⚛️ Bo'lim 2: Kristall maydon nazariyasi...")
    drawSectionHeader(sec++, "Kristall Maydon Nazariyasi", C.blue)
    const cf = COMPOUND.crystalField
    const cfTable = [
      ["Metall ioni", cf.metalIon],
      ["Elektron konfiguratsiya", cf.electronConfig],
      ["d-elektronlar soni", `${cf.dElectrons}`],
      ["Spin holati", cf.spinState],
      ["Orbital to'ldirilishi", cf.orbitalOccupancy],
      ["Toq elektronlar", `${cf.unpairedElectrons}`],
      ["Magnit moment", cf.magneticMoment],
      ["Ligand maydon ajralishi Δ_o", cf.crystalFieldSplitting],
      ["Racah parametri B", cf.racahParameter],
      ["Nefelauxetik nisbat β", cf.nephelauxeticRatio],
      ["Juftlanish energiyasi P", cf.pairingEnergy],
      ["CFSE", cf.cfse],
    ]
    cfTable.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgBlue : C.white, C.blue))
    y -= 6
    drawParagraph(`Xulosa: ${cf.whyLowSpin}`, 9, C.textDark)
    drawParagraph(`Rang manbai: ${cf.colorOrigin}`, 9, C.textDark)
    y -= 6

    // ═══ 3. Simmetriya
    setPdfMessage("📐 Bo'lim 3: Simmetriya...")
    drawSectionHeader(sec++, "Simmetriya va C₄ᵥ Xarakterlar", C.purple)
    const symTable = [
      ["Nuqtaviy guruh", COMPOUND.symmetry.pointGroup],
      ["Guruh tartibi", `${COMPOUND.symmetry.order}`],
      ["Simmetriya elementlari", COMPOUND.symmetry.symmetryElements.join(", ")],
      ["Ota guruh", COMPOUND.symmetry.parentGroup],
      ["d-orbital pasayishi", COMPOUND.symmetry.dOrbitalReduction],
      ["IR faolligi", COMPOUND.symmetry.irActive],
      ["Raman faolligi", COMPOUND.symmetry.ramanActive],
    ]
    symTable.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgPurple : C.white, C.purple))
    y -= 6
    drawParagraph(`NMR ekvivalentlik: ${COMPOUND.symmetry.nmrEquivalence}`, 9, C.textDark)
    y -= 6

    // ═══ 4. YaMR Nazariyasi — ¹H
    setPdfMessage("🧲 Bo'lim 4: ¹H NMR nazariyasi...")
    drawSectionHeader(sec++, "YaMR — ¹H Yadrosi (Proton)", C.cyan)
    const h1 = COMPOUND.nmrTheory.h1
    const h1Table = [
      ["Yadro", h1.nucleus],
      ["Spin", h1.spin],
      ["Giromagnit γ", h1.gamma],
      ["Tabiiy tarqalish", h1.naturalAbundance],
      ["Larmor chastotasi (9.4 T)", h1.larmor400],
      ["Kimyoviy siljish δ", h1.shift],
      ["Referens", h1.referens],
      ["Multipletlik", h1.multiplicity],
      ["Chiziq kengligi Δν₁/₂", h1.linewidth],
      ["T₁ relaksatsiya", h1.t1Relaxation],
      ["T₂ relaksatsiya", h1.t2Relaxation],
      ["Bog'lanish (J)", h1.coupling],
      ["Integratsiya", h1.integration],
      ["Erituvchi", h1.solvent],
    ]
    h1Table.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgBlue : C.white, C.cyan))
    y -= 6
    drawParagraph(`Fizik izoh: ${h1.whyThisShift}`, 9, C.textDark)
    y -= 6

    // ═══ 5. ¹⁵N
    setPdfMessage("🧲 Bo'lim 5: ¹⁵N NMR (linkage izomer)...")
    drawSectionHeader(sec++, "YaMR — ¹⁵N Yadrosi (Linkage Izomer Zondi)", C.cyan)
    const n15 = COMPOUND.nmrTheory.n15
    const n15Table = [
      ["Yadro", n15.nucleus],
      ["Spin", n15.spin],
      ["Giromagnit γ (manfiy)", n15.gamma],
      ["Tabiiy tarqalish", n15.naturalAbundance],
      ["Larmor (9.4 T)", n15.larmor400],
      ["Sezgirlik (¹H=1)", n15.sensitivity],
      ["δ(NO₂, N-koord.)", n15.shift_NO2],
      ["δ(NH₃, koord.)", n15.shift_NH3],
      ["Referens", n15.referens],
      ["Chiziq kengligi", n15.linewidth],
      ["T₁", n15.t1Relaxation],
      ["CSA (Δσ)", n15.csa],
      ["J(N-H)", "73 Hz (¹⁵N-boyitilgan namunada)"],
    ]
    n15Table.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgBlue : C.white, C.cyan))
    y -= 6
    drawParagraph(`⭐ Linkage izomer farqlash: ${n15.linkageDiscrimination}`, 9, C.textDark)
    drawParagraph(`Fizik izoh: ${n15.whyThisShift}`, 9, C.textDark)
    y -= 6

    // ═══ 6. ⁵⁹Co
    setPdfMessage("🧲 Bo'lim 6: ⁵⁹Co NMR (kvadrupol)...")
    drawSectionHeader(sec++, "YaMR — ⁵⁹Co Yadrosi (Metall Markazi Zondi)", C.cyan)
    const co59 = COMPOUND.nmrTheory.co59
    const co59Table = [
      ["Yadro", co59.nucleus],
      ["Spin (kvadrupol!)", co59.spin],
      ["Giromagnit γ", co59.gamma],
      ["Tabiiy tarqalish", co59.naturalAbundance],
      ["Larmor (9.4 T)", co59.larmor400],
      ["Kvadrupol moment Q", co59.quadrupoleMoment],
      ["Kimyoviy siljish δ", co59.shift],
      ["Referens", co59.referens],
      ["Chiziq kengligi", co59.linewidth],
      ["T₁", co59.t1Relaxation],
      ["CQ (eQqzz/h)", "15–25 MHz"],
      ["Asimmetriya η", "0.1–0.3"],
    ]
    co59Table.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgBlue : C.white, C.cyan))
    y -= 6
    drawParagraph(`Ramsey paramagnit hissasi: ${co59.whyThisShift}`, 9, C.textDark)
    drawParagraph(`Kvadrupol kengayishi: ${co59.quadrupolarBroadening}`, 9, C.textDark)
    drawParagraph(`Amaliy o'lchash: ${co59.detection}`, 9, C.textDark)
    y -= 6

    // ═══ 7. YaMR signallar jadvali
    setPdfMessage("📋 Bo'lim 7: YaMR signallar...")
    drawSectionHeader(sec++, "YaMR Signallar Ma'lumotlar Jadvali", C.orange)
    // Custom header for signals table
    checkPageBreak(30)
    page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.bgOrange })
    const cols = [
      { label: "Yadro", w: 40 },
      { label: "Ligand", w: 100 },
      { label: "δ (ppm)", w: 60 },
      { label: "Mult.", w: 65 },
      { label: "J (Hz)", w: 80 },
      { label: "Integ.", w: 40 },
      { label: "Izoh", w: CONTENT_W - 385 },
    ]
    let xOff = MARGIN + 5
    cols.forEach(c => {
      safeText(c.label, { x: xOff, y: y - 12, size: 8.5, font: boldFont, color: C.orangeDeep, maxWidth: c.w - 5 })
      xOff += c.w
    })
    y -= 18
    COMPOUND.nmrSignals.forEach((s, i) => {
      const rowH = 30
      checkPageBreak(rowH + 2)
      page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: i % 2 === 0 ? C.bgYellow : C.white })
      xOff = MARGIN + 5
      const vals = [s.nucleus, s.ligand, String(s.shift), s.mult, s.J, s.integ, s.note]
      vals.forEach((v, j) => {
        const w = cols[j].w - 5
        const lines = wrapText(cleanText(v), regularFont, 7.5, w).slice(0, 3)
        lines.forEach((ln, li) => {
          page.drawText(ln, { x: xOff, y: y - 10 - li * 9, size: 7.5, font: j === 0 || j === 2 ? boldFont : regularFont, color: C.textDark })
        })
        xOff += cols[j].w
      })
      y -= rowH
    })
    y -= 12

    // ═══ 8. Linkage izomer taqqoslash
    setPdfMessage("🔄 Bo'lim 8: Linkage izomer taqqoslash...")
    drawSectionHeader(sec++, "Linkage Izomer Taqqoslash", C.yellow)
    checkPageBreak(30)
    page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.bgYellow })
    const linkCols = [
      { label: "Kompleks", w: 130 },
      { label: "Ligand", w: 80 },
      { label: "Rang", w: 65 },
      { label: "δ(¹⁵N)", w: 60 },
      { label: "δ(⁵⁹Co)", w: 65 },
      { label: "Barqarorlik", w: CONTENT_W - 400 },
    ]
    xOff = MARGIN + 5
    linkCols.forEach(c => {
      safeText(c.label, { x: xOff, y: y - 12, size: 8.5, font: boldFont, color: C.yellowDeep, maxWidth: c.w - 5 })
      xOff += c.w
    })
    y -= 18
    COMPOUND.linkageComparison.forEach((r, i) => {
      const rowH = 24
      checkPageBreak(rowH + 2)
      page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: i === 0 ? C.bgYellow : (i % 2 === 0 ? C.bgYellow : C.white) })
      xOff = MARGIN + 5
      const vals = [r.compound, r.ligand, r.color, r.n15, r.co59, r.stability]
      vals.forEach((v, j) => {
        const w = linkCols[j].w - 5
        const lines = wrapText(cleanText(v), regularFont, 7.5, w).slice(0, 2)
        lines.forEach((ln, li) => {
          page.drawText(ln, { x: xOff, y: y - 10 - li * 9, size: 7.5, font: j === 0 ? boldFont : regularFont, color: C.textDark })
        })
        xOff += linkCols[j].w
      })
      y -= rowH
    })
    y -= 8
    drawParagraph(`Δδ(¹⁵N) nitro vs nitrito ≈ 116 ppm — bu farq boshqa spektroskopik metodlarga qaraganda aniqroq va ishonchli. Shu sabab ¹⁵N NMR — linkage izomerni identifikatsiya qilishning oltin standarti.`, 9, C.textDark)
    y -= 6

    // ═══ 9. Strukturaviy parametrlar
    setPdfMessage("📏 Bo'lim 9: Strukturaviy parametrlar...")
    drawSectionHeader(sec++, "Strukturaviy Parametrlar (X-ray + Trans-effekt)", C.green)
    const struct = COMPOUND.structural
    const structTable = [
      ["Co–N(NO₂)", struct.bondLengths.coN_NO2],
      ["Co–N(NH₃) trans-NO₂", struct.bondLengths.coN_NH3_trans],
      ["Co–N(NH₃) cis-NO₂", struct.bondLengths.coN_NH3_cis],
      ["N–O (nitro)", struct.bondLengths.n_O_nitro],
      ["O–N–O burchak", struct.bondAngles.ono_nitro],
      ["Co–N–O burchak", struct.bondAngles.coN_O],
      ["N–Co–N (cis)", struct.bondAngles.N_Co_N_cis],
      ["N–Co–N (trans)", struct.bondAngles.N_Co_N_trans],
      ["Referens ([Co(NH₃)₆]³⁺)", struct.bondLengths.referenceCoN6],
      ["Manba", struct.bondLengths.source],
    ]
    structTable.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgGreen : C.white, C.green))
    y -= 6
    drawParagraph(`Trans-effekt: ${struct.transEffect.definition}`, 9, C.textDark)
    drawParagraph(`Tartib: ${struct.transEffect.order}. Mexanizm: ${struct.transEffect.mechanism}`, 9, C.textDark)
    drawParagraph(`Oqibat: ${struct.transEffect.consequence}`, 9, C.textDark)
    y -= 6

    // ═══ 10. Termodinamika va kinetika
    setPdfMessage("🌡 Bo'lim 10: Termodinamika...")
    drawSectionHeader(sec++, "Termodinamika va Kinetika (DSC + Eyring)", C.orange)
    const th = COMPOUND.thermodynamics.isomerization
    const thTable = [
      ["Reaksiya", th.reaction],
      ["Yo'nalish", th.direction],
      ["ΔH°", th.deltaH],
      ["ΔS°", th.deltaS],
      ["ΔG°(298 K)", th.deltaG298],
      ["Muvozanat K", th.K],
      ["Aktivatsiya E_a", th.activationEnergy],
      ["Tezlik konstantasi (298 K)", th.rateConstant298],
      ["Yarim yemirilish t₁/₂", th.halfLife],
      ["Mexanizm", th.mechanism],
      ["Eyring parametrlari", th.eyring],
    ]
    thTable.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgOrange : C.white, C.orange))
    y -= 6
    drawParagraph(`Inertlik sababi: ${COMPOUND.thermodynamics.inertness.why}`, 9, C.textDark)
    drawParagraph(`Taqqoslash: ${COMPOUND.thermodynamics.inertness.comparison}`, 9, C.textDark)
    y -= 6

    // ═══ 11. DFT izomerlanish yo'llari
    setPdfMessage("🧮 Bo'lim 11: DFT hisoblari...")
    drawSectionHeader(sec++, "DFT Izomerlanish Yo'llari (ωB97XD/6-31+G(d,p))", C.orange)
    drawParagraph(`Metod: ${COMPOUND.dftDetails.method}. Co uchun basis: ${COMPOUND.dftDetails.basisSetForCo}. Erituvchi: ${COMPOUND.dftDetails.solventModel}. Manba: ${COMPOUND.dftDetails.source}.`, 9, C.textDark)
    y -= 4
    COMPOUND.dftPathways.forEach(path => {
      checkPageBreak(60)
      page.drawRectangle({
        x: MARGIN, y: y - 22, width: CONTENT_W, height: 22,
        color: path.preferred ? C.bgGreen : C.bgOrange,
        borderColor: path.preferred ? C.green : C.orange, borderWidth: 0.5,
      })
      safeText(`${path.preferred ? "⭐ " : ""}${path.name}`, {
        x: MARGIN + 6, y: y - 14, size: 9.5, font: boldFont,
        color: path.preferred ? C.green : C.orange, maxWidth: CONTENT_W - 12,
      })
      y -= 26
      const stepsText = path.steps.map(s => `${s.label} (${s.energy.toFixed(2)})`).join(" → ")
      drawParagraph(`Bosqichlar: ${stepsText}. To'siq: ${path.barrier} ${path.barrierUnit}.`, 8.5, C.textDark, 10)
      drawParagraph(`Izoh: ${path.note}`, 8.5, C.textMuted, 10)
      y -= 4
    })
    y -= 4

    // Energy profile diagram in PDF
    checkPageBreak(200)
    safeText("Reaksiya koordinatasi — energiya profili (tanlangan yo'l A)", {
      x: MARGIN, y, size: 10, font: boldFont, color: C.orangeDeep, maxWidth: CONTENT_W,
    })
    y -= 14
    const path = COMPOUND.dftPathways[0]
    const gX = MARGIN + 40, gY = y - 150, gW = CONTENT_W - 60, gH = 130
    const maxE = 45, minE = -3
    const yScale = gH / (maxE - minE)
    const xStep = gW / (path.steps.length - 1)
    // Axes
    page.drawRectangle({ x: gX, y: gY, width: gW, height: gH, color: C.bgOrange, borderColor: C.orange, borderWidth: 0.5 })
    page.drawLine({ start: { x: gX, y: gY }, end: { x: gX, y: gY + gH }, thickness: 0.8, color: C.textDark })
    page.drawLine({ start: { x: gX, y: gY }, end: { x: gX + gW, y: gY }, thickness: 0.8, color: C.textDark })
    // Y grid
    for (let e = 0; e <= 40; e += 10) {
      const ty = gY + (e - minE) * yScale
      page.drawLine({ start: { x: gX, y: ty }, end: { x: gX + gW, y: ty }, thickness: 0.3, color: C.grayLine })
      page.drawText(String(e), { x: gX - 18, y: ty - 3, size: 7, font: regularFont, color: C.textDark })
    }
    page.drawText("E (kkal/mol)", { x: gX - 40, y: gY + gH / 2, size: 8, font: italicFont, color: C.orangeDeep, rotate: { type: "degrees", angle: 90 } })
    // Points + connecting line
    const points = path.steps.map((s, i) => ({
      x: gX + i * xStep,
      y: gY + (s.energy - minE) * yScale,
      s,
    }))
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1], p1 = points[i]
      page.drawLine({ start: { x: p0.x, y: p0.y }, end: { x: p1.x, y: p1.y }, thickness: 1.5, color: C.orange })
    }
    points.forEach(p => {
      if (p.s.type === "TS") {
        // Red triangle
        page.drawLine({ start: { x: p.x - 4, y: p.y + 3 }, end: { x: p.x + 4, y: p.y + 3 }, thickness: 1, color: C.red })
        page.drawLine({ start: { x: p.x - 4, y: p.y + 3 }, end: { x: p.x, y: p.y - 4 }, thickness: 1, color: C.red })
        page.drawLine({ start: { x: p.x + 4, y: p.y + 3 }, end: { x: p.x, y: p.y - 4 }, thickness: 1, color: C.red })
      } else {
        // Green circle (approximated with rectangle)
        page.drawRectangle({ x: p.x - 3, y: p.y - 3, width: 6, height: 6, color: C.green, borderColor: C.greenDark, borderWidth: 0.5 })
      }
      // Value label
      safeText(p.s.energy.toFixed(2), {
        x: p.x, y: p.y + 8, size: 7, font: boldFont, color: p.s.type === "TS" ? C.red : C.greenDark, align: "center", maxWidth: 40,
      })
      // Step label below x-axis
      const stepLabel = truncate(p.s.label, regularFont, 6.5, xStep - 5)
      const lblW = measure(stepLabel, regularFont, 6.5)
      page.drawText(stepLabel, { x: p.x - lblW / 2, y: gY - 12, size: 6.5, font: regularFont, color: C.textDark })
    })
    safeText("Reaksiya koordinatasi", { x: gX + gW / 2, y: gY - 25, size: 8, font: italicFont, color: C.orangeDeep, align: "center", maxWidth: gW })
    y = gY - 32
    drawParagraph(`1-rasm. Yo'l A energiya profili. Yashil kvadratchalar — minimumlar (barqaror shakllar), qizil uchburchaklar — TS (o'tish holatlari). Tanlangan yo'l endo-nitrito oraliqni o'z ichiga oladi.`, 8.5, C.textMuted)
    y -= 6

    // ═══ 12. Halaqit beruvchi omillar
    setPdfMessage("⚠️ Bo'lim 12: Halaqit omillari...")
    drawSectionHeader(sec++, "Halaqit Beruvchi Omillar (Interferentsiya)", C.red)
    COMPOUND.interferences.forEach((intf, i) => {
      checkPageBreak(50)
      const bgColor = i % 2 === 0 ? C.bgYellow : C.white
      page.drawRectangle({ x: MARGIN, y: y - 44, width: CONTENT_W, height: 44, color: bgColor })
      safeText(`${i + 1}. ${intf.source}`, {
        x: MARGIN + 6, y: y - 12, size: 9.5, font: boldFont, color: C.textDark, maxWidth: CONTENT_W - 100,
      })
      const sevColor = intf.severity === "Yuqori" ? C.red : intf.severity === "O'rta" ? C.yellowDeep : C.green
      safeText(`[${intf.severity}]`, {
        x: PAGE_W - MARGIN - 6, y: y - 12, size: 8.5, font: boldFont, color: sevColor, align: "right", maxWidth: 80,
      })
      const effLines = wrapText(`Ta'siri: ${cleanText(intf.effect)}`, regularFont, 8, CONTENT_W - 12).slice(0, 1)
      effLines.forEach(ln => page.drawText(ln, { x: MARGIN + 6, y: y - 25, size: 8, font: regularFont, color: C.textDark }))
      const solLines = wrapText(`Yechim: ${cleanText(intf.solution)}`, regularFont, 8, CONTENT_W - 12).slice(0, 1)
      solLines.forEach(ln => page.drawText(ln, { x: MARGIN + 6, y: y - 37, size: 8, font: regularFont, color: C.textMuted }))
      y -= 48
    })
    y -= 6

    // ═══ 13. Laboratoriya tartibi (qisqartirilgan)
    setPdfMessage("🧪 Bo'lim 13: Laboratoriya tartibi...")
    drawSectionHeader(sec++, "Laboratoriya Tartibi", C.green)
    COMPOUND.labProcedure.forEach((step, i) => {
      checkPageBreak(60)
      page.drawRectangle({
        x: MARGIN, y: y - 16, width: 20, height: 16, color: C.green,
      })
      safeText(String(step.step), {
        x: MARGIN + 10, y: y - 12, size: 10, font: boldFont, color: C.white, align: "center", maxWidth: 18,
      })
      safeText(cleanText(step.title), {
        x: MARGIN + 26, y: y - 12, size: 10, font: boldFont, color: C.green, maxWidth: CONTENT_W - 100,
      })
      safeText(`⏱ ${step.time}`, {
        x: PAGE_W - MARGIN - 6, y: y - 12, size: 8, font: italicFont, color: C.textMuted, align: "right", maxWidth: 90,
      })
      y -= 20
      drawParagraph(step.desc, 8.5, C.textDark, 26)
      drawParagraph(`📚 Nazariy izoh: ${step.theory}`, 8, C.textMuted, 26)
      y -= 4
    })
    y -= 6

    // ═══ 14. Yakuniy xulosalar
    setPdfMessage("✅ Bo'lim 14: Xulosalar...")
    drawSectionHeader(sec++, "Asosiy Xulosalar", C.purple)
    const conclusions = [
      `Kompleks tabiati: Co³⁺ d⁶ past-spin (t₂g⁶ eg⁰), C₄ᵥ simmetriya, diamagnit. Δ_o = 23 600 cm⁻¹, CFSE = −677 kJ/mol.`,
      `¹H NMR: Barcha 15 NH₃ protoni δ = 3.5 ppm da bir singlet (¹⁴N kvadrupol decoupling). Erkin NH₃ dan +2.6 ppm deshieldlangan.`,
      `¹⁵N NMR — linkage izomer identifikatsiyasi: δ(NO₂, N-koord.) = +412 ppm; nitrito izomerda +528 ppm. Δδ ≈ 116 ppm — aniq va ishonchli farq.`,
      `⁵⁹Co NMR: δ = +8120 ppm ([Co(CN)₆]³⁻ = 0 shkalasida). Chiziq kengligi Δν₁/₂ ≈ 1000–2000 Hz (kvadrupol), CQ ≈ 20 MHz.`,
      `Termodinamika: ΔH° = −11.4 kJ/mol (ekzotermik, DSC); K_eq(298) ≈ 36 (97:3 nitro:nitrito).`,
      `Kinetika: E_a = 108 kJ/mol; t₁/₂(25°C, qorong'i) = 5.5 soat; intramolekulyar mexanizm.`,
      `DFT (ωB97XD): Yo'l A (nitro → endo-nitrito → exo-nitrito, to'siq 38.16 kkal/mol) yo'l B dan (41.76) 3.6 kkal/mol qulayroq.`,
      `Photo-salient effekt (Naumov 2013): UV yorug'lik (λ=350 nm) kristall sakrashini keltirib chiqaradi — nitro → nitrito foto-izomerlanish orqali.`,
      `Trans-effekt: NO₂⁻ > NH₃ tartibida; trans-Co–N(NH₃) bog'i cis-dan 0.020 Å uzunroq.`,
      `Amaliyot: Amber probirka (UV himoya), DMSO-d₆ erituvchi, 15–25 mg namuna, ¹⁵N-boyitilgan tavsiya.`,
    ]
    conclusions.forEach((c, i) => {
      checkPageBreak(30)
      safeText(`${i + 1}.`, { x: MARGIN, y: y - 10, size: 9.5, font: boldFont, color: C.purple, maxWidth: 20 })
      const lines = wrapText(cleanText(c), regularFont, 9, CONTENT_W - 20)
      lines.forEach((ln, li) => {
        checkPageBreak(12)
        page.drawText(ln, { x: MARGIN + 18, y: y - 10 - li * 12, size: 9, font: regularFont, color: C.textDark })
      })
      y -= 12 + lines.length * 12
    })

    addFooter()

    // Metadata
    pdfDoc.setTitle("[Co(NH3)5(NO2)]Cl2 YaMR Tahlili")
    pdfDoc.setSubject("Nitro-pentaamminkobalt(III) xlorid — YaMR spektroskopiya")
    pdfDoc.setAuthor("jdakimyo.uz — Koordinatsion kimyo portali")
    pdfDoc.setCreator("jdakimyo.uz PDF eksport")
    pdfDoc.setKeywords(["NMR", "YaMR", "linkage izomerizm", "Co(III)", "koordinatsion kimyo", "nitro-nitrito"])

    setPdfMessage("💾 PDF saqlanmoqda...")
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Co-NH3-5-NO2-Cl2_YaMR_hisobot_${new Date().toISOString().slice(0, 10)}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setPdfMessage("✅ PDF muvaffaqiyatli yaratildi!")
    setTimeout(() => setPdfMessage(""), 5000)
  } catch (err) {
    console.error("PDF yaratishda xato:", err)
    setPdfMessage("❌ PDF yaratishda xato: " + (err.message || String(err)))
  } finally {
    setPdfGenerating(false)
  }
}
