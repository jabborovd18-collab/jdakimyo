"use client"

import Link from "next/link"
import { useState, useMemo, useRef } from "react"
import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₅(ONO)]Cl₂ — NITRITO-PENTAAMMINKOBALT(III)
// YaMR SAHIFA (ILMIY CHUQURLASHTIRILGAN, PDF EKSPORT BILAN)
// Manbalar: Jorgensen (1894), Werner (Nobel 1913), Ramsey (1950),
//           Adell (1944, kinetika), Basolo & Pearson (1961, izotop belgilash),
//           PMC9077707 (ωB97XD), Naumov (2013, photo-salient effekt)
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>(ONO)]Cl<sub>2</sub>",
  formulaPlain: "[Co(NH3)5(ONO)]Cl2",
  iupac: "Pentaammin(nitrito-κO)kobalt(III) xlorid",
  commonName: "Rodo-nitritokobalt (qizil, metastabil izomer)",
  molarMass: 261.44,
  casNumber: "15075-33-9",
  color: "qizil (red, 500 nm da yashil-sariq yutish)",
  structure: "Buzilgan oktaedr — psevdo-oktaedrik C₄ᵥ (endo/exo konformerlari)",
  metalLigand: "Co–O(ONO), Co–N(NH₃)×5",
  pointGroup: "C₄ᵥ",
  electrolyteType: "1:2 elektrolit (kation:2 Cl⁻)",
  molarConductivity: "~260 S·cm²·mol⁻¹ (H₂O, 25°C, 10⁻³ M)",
  discovery: "S.M. Jørgensen, 1894 (nitro bilan birga)",
  isomerType: "Kinetik (metastabil) mahsulot — nitroga aylanadi",
  synthesisRef: "Adell, Acta Chem. Scand. 1944, 8, 155",
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. KRISTALL MAYDON NAZARIYASI
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.crystalField = {
  metalIon: "Co³⁺",
  electronConfig: "[Ar] 3d⁶",
  dElectrons: 6,
  spinState: "Past spinli (S = 0, diamagnit)",
  orbitalOccupancy: "t₂g⁶ eg⁰",
  unpairedElectrons: 0,
  magneticMoment: "μ_eff ≈ 0 μB (diamagnit; kichik TIP hissasi ~0.15 μB, nitroga qaraganda biroz kattaroq)",
  crystalFieldSplitting: "Δ_o ≈ 22 500 cm⁻¹ (2.79 eV, 269 kJ/mol) — nitroga qaraganda ~1100 cm⁻¹ kichikroq",
  racahParameter: "B ≈ 590 cm⁻¹ (nitro: 580 cm⁻¹; ONO⁻ kamroq kovalent — katta B)",
  nephelauxeticRatio: "β = B/B₀ ≈ 0.53 (kovalent hissa 47% — nitroga qaraganda kamroq)",
  pairingEnergy: "P ≈ 21 000 cm⁻¹",
  cfse: "CFSE = −0.4·Δ_o × 6 = −2.4·Δ_o ≈ −54 000 cm⁻¹ ≈ −646 kJ/mol",
  cfseNet: "Netto: −54 000 + 2P ≈ −12 000 cm⁻¹ (past spin, ammo nitroga qaraganda 2640 cm⁻¹ kamroq barqaror)",
  spectrochemicalSeries: "H₂O < NH₃ < en < ONO⁻ (O-koord.) < NO₂⁻ (N-koord.) < CN⁻",
  whyLowSpin: "Δ_o (22 500) > P (21 000) — past spinli, lekin nitroga qaraganda P ga yaqinroq. ONO⁻ — o'rta maydon ligandi (σ-donor, kuchsiz π-akseptor).",
  colorOrigin: "d–d o'tish ¹A₁g → ¹T₁g (F): ~20 000 cm⁻¹ ≈ 500 nm (yashil-sariq yutiladi → qizil rang). Nitro izomerda 455 nm (sariq). Rang farqi Δ_o dagi 1100 cm⁻¹ farqni bevosita ko'rsatadi.",
  chargeTransfer: "LMCT (ONO⁻ n(O) → Co dσ*): ~33 000 cm⁻¹ (~300 nm, UV). Aynan bu o'tish photo-salient effekt uchun mas'ul.",
  jahnTellerNote: "t₂g⁶ eg⁰ konfiguratsiyada Jahn-Teller effekti YOQ. Kichik buzilish (~750 cm⁻¹) faqat ONO⁻ ligandning C₄ᵥ pasayishidan.",
  comparisonWithNitro: "Nitro (N-koord.): Δ_o = 23 600, sariq, CFSE = −56 640 cm⁻¹. Nitrito (O-koord.): Δ_o = 22 500, qizil, CFSE = −54 000 cm⁻¹. Nitro ~2640 cm⁻¹ (31.6 kJ/mol) barqarorroq — shu sabab termodinamik jihatdan nitro ustun.",
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. SIMMETRIYA VA C₄ᵥ XARAKTERLAR JADVALI (endo/exo konformerlari bilan)
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.symmetry = {
  pointGroup: "C₄ᵥ (ideal, endo/exo konformerlar Cs ga tushishi mumkin)",
  order: 8,
  symmetryElements: ["E", "2C₄", "C₂", "2σᵥ", "2σᵈ"],
  parentGroup: "Oₕ dan tushirilgan (bitta NH₃ → ONO⁻ almashinuvi)",
  descentInSymmetry: "Oₕ (48) → C₄ᵥ (8): C₄ o'qi Co–O(ONO) bog'i orqali o'tadi. Agar ONO burchagi C₄ tekisligiga proyeksiyalanmasa — haqiqiy simmetriya Cs (4).",
  characterTable: {
    A1: { E: 1, C4: 1, C2: 1, sv: 1, sd: 1, functions: "z; x²+y², z²" },
    A2: { E: 1, C4: 1, C2: 1, sv: -1, sd: -1, functions: "Rz" },
    B1: { E: 1, C4: -1, C2: 1, sv: 1, sd: -1, functions: "x²−y²" },
    B2: { E: 1, C4: -1, C2: 1, sv: -1, sd: 1, functions: "xy" },
    E:  { E: 2, C4: 0, C2: -2, sv: 0, sd: 0, functions: "(x,y); (Rx,Ry); (xz,yz)" },
  },
  dOrbitalReduction: "Oₕ: t₂g → C₄ᵥ: b₂ (dxy) + e (dxz, dyz); eg → b₁ (dx²−y²) + a₁ (dz²). Nitro va nitritoda bir xil pasayish, ammo koeffitsientlar farq qiladi.",
  nmrEquivalence: "C₄ᵥ da 5 ta NH₃ dan 4 tasi ekvivalent (ekvatorial), 1 tasi (trans-ONO) alohida. Amaliyotda tez proton almashinuvi va NH₃ aylanishi tufayli barcha 15 H bir singlet ko'rinadi (298 K). Past haroratda (< 200 K) 4:1 nisbatdagi 2 signal ajraladi.",
  irActive: "A₁, B₁, B₂, E — barchasi IR/Raman faol",
  ramanActive: "A₁, B₁, B₂, E — barchasi Raman faol",
  mutualExclusion: "YO'Q — C₄ᵥ da inversiya markazi yo'q. IR/Raman polosalari ustma-ust tushadi.",
  endoExoConformers: "ONO⁻ ligand endo yoki exo konformatsiyada bo'lishi mumkin. Endo: N atomi Co ga qaragan (bog'lanmagan, lekin yaqin); Exo: N tashqariga qaragan. Endo-nitrito — DFT bo'yicha izomerlanish yo'lidagi oraliq mahsulot, Exo-nitrito — termodinamik jihatdan barqarorroq exo-shakl.",
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. YaMR NAZARIYASI — to'rt yadro (¹H, ¹⁵N, ⁵⁹Co, ¹⁷O)
// Nitrito uchun ¹⁷O JUDA MUHIM — chunki O bevosita Co ga bog'langan
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
    whyThisShift: "NH₃ protonlari uchun signal nitro izomeri bilan bir xil (3.5 ppm) — chunki NH₃ ligandlari ikkala izomerda ham bir xil koordinatsiyalangan (Co-N). ONO⁻ ligand almashinuvi NH₃ muhitiga sezilarli ta'sir qilmaydi — masofa faktor tufayli (>3 Å). Amaliyotda ¹H NMR nitro va nitrito ni bir-biridan farqlay olmaydi! Farqlash uchun ¹⁵N yoki ¹⁷O NMR kerak.",
    multiplicity: "Singlet (¹⁴N kvadrupol decoupling; tez proton almashinuvi)",
    linewidth: "Δν₁/₂ ≈ 5–15 Hz (o'tkir, diamagnit muhit)",
    t1Relaxation: "T₁ ≈ 1–3 s (dipol-dipol H–H va H–N)",
    t2Relaxation: "T₂ ≈ 0.5–2 s",
    coupling: "¹J(¹⁵N–¹H) ≈ 73 Hz (¹⁵N-boyitilgan namunada dublet); ²J(H–Co–H) ≈ 0 (¹⁴N kvadrupol yashiradi)",
    integration: "15 H (5 NH₃ × 3 H)",
    solvent: "DMSO-d₆ afzal. D₂O da tez H/D almashinuvi tufayli signal yo'qoladi; qorong'ida saqlash — nitroga aylanmaslik uchun.",
    keyDifference: "🔍 ¹H NMR nitro/nitrito farqi: 0.0 ppm (aniqlanmagan). Bu — asosiy cheklov: ¹H orqali linkage izomer aniqlanmaydi.",
  },
  n15: {
    nucleus: "¹⁵N",
    spin: "I = 1/2",
    gamma: "−2.712 × 10⁷ rad·s⁻¹·T⁻¹ (manfiy)",
    naturalAbundance: "0.365%",
    larmor400: "40.55 MHz (9.4 T)",
    sensitivity: "3.85 × 10⁻⁶ (¹H ga nisbatan) — 260 000 marta past. ¹⁵N-boyitilgan namuna afzal.",
    shift_ONO: "δ(N-atom of ONO, O-koord.) = +528 ppm (CH₃NO₂ shkalasi) — nitrodan +116 ppm siljigan",
    shift_NH3: "δ(NH₃, koord.) = −340 ppm (NH₃(l) shkalasi) — nitro bilan bir xil",
    referens: "IUPAC: CH₃NO₂ (nitrometan) — δ = 0.00 ppm; muqobil: NH₃(liq, 25°C) shkalasida CH₃NO₂ = +380.2 ppm",
    whyThisShift: "Nitrito izomerda azot atomi Co ga BOG'LANMAGAN — u faqat NO₂ guruhi ichidagi terminal N atomi. σ-donor rolini kislorod bajaradi. Shuning uchun N atomi elektron zichligi ko'proq (π-tizimi bilan ochiq), asosiy holat va qo'zg'algan holat orasidagi ΔE ancha katta — Ramsey σ_para (∝ 1/ΔE) kichikroq. Natijada δ nitrodan yuqori chastotaga (+116 ppm) siljigan. Bu farq eritma NMR da 100% ishonchli.",
    linkageDiscrimination: "⭐ Δδ(nitro − nitrito) ≈ 116 ppm — aynan nitrito ni identifikatsiya qilishning eng aniq usuli. UV-Vis (rang farqi 40 nm) va IQ (ν_as(NO₂) 1430 vs 1465 cm⁻¹) dan ancha aniqroq.",
    linewidth: "Δν₁/₂ ≈ 25–80 Hz (CSA kattaroq — Δσ ≈ 700–900 ppm, ONO uchun; nitroda ≈ 500–700)",
    t1Relaxation: "T₁ ≈ 20–80 s (nitroga qaraganda qisqaroq — kattaroq CSA)",
    csa: "Δσ ≈ 700–900 ppm (nitrito uchun; asimmetriya η ≈ 0.3–0.5) — nitroga qaraganda kattaroq, chunki N asimmetrik joylashgan",
    couplingToCo: "¹J(⁵⁹Co–¹⁵N) ≠ mavjud (N koordinatsiyalanmagan)",
    keyPoint: "¹⁵N NMR nitrito izomer uchun asosiy zond — sof namuna aniqlash, nitroga aylanishni kuzatish, DSC bilan komplementar.",
  },
  o17: {
    nucleus: "¹⁷O (bu izomer uchun QO'SHIMCHA zond!)",
    spin: "I = 5/2 (kvadrupol!)",
    gamma: "−36.281 × 10⁷ rad·s⁻¹·T⁻¹ (manfiy)",
    naturalAbundance: "0.037% — juda past",
    larmor400: "54.25 MHz (9.4 T)",
    quadrupoleMoment: "Q(¹⁷O) = −0.0257 barns",
    sensitivity: "1.11 × 10⁻⁵ (¹H ga nisbatan) — nafaqat past sezgirlik, balki qattiq bo'shashish (kvadrupol relaksatsiya)",
    shift: "δ(Co–O–N=O) ≈ +250 dan +350 ppm gacha (H₂O = 0 ppm shkalasida)",
    referens: "H₂O (n) — δ = 0.00 ppm (IUPAC); muqobil: SiMe₄ shkalasi (kam foydalaniladi)",
    whyThisShift: "Kislorod atomi Co ga bevosita σ-bog'langan — Co–O bog'i orbital ekranlashini kamaytiradi (Ramsey σ_para ≠ 0). Erkin NO₂⁻ (nitro-holatda) da O atomlari σ_dia ustun — δ ≈ +570 ppm. Koordinatsiyada 220–320 ppm ga siljish — kuchli deshielding kamaygan.",
    linewidth: "Δν₁/₂ ≈ 200–800 Hz (kvadrupol keng chiziq, I=5/2; CQ ≈ 8–12 MHz)",
    t1Relaxation: "T₁ ≈ 0.5–5 ms (juda qisqa — tez qayta impuls berish mumkin)",
    csa: "Δσ(¹⁷O) ≈ 400 ppm (Co–O uchun)",
    detection: "¹⁷O-boyitilgan (>10%) namuna ZARUR. Tabiiy tarqalishda 24–48 soat skan yetmaydi. Boyitish variant: sintezni H₂¹⁷O bilan olib borish.",
    keyPoint: "🌟 ¹⁷O NMR nitrito izomerning yakuniy tasdiqi — chunki faqat nitrito da Co–O bog'i mavjud. Nitroda ¹⁷O signali yo'q (O atomi Co dan uzoq). Bu — 100% aniq farqlash usuli.",
    exclusiveToNitrito: true,
  },
  co59: {
    nucleus: "⁵⁹Co",
    spin: "I = 7/2 (kvadrupol!)",
    gamma: "6.332 × 10⁷ rad·s⁻¹·T⁻¹",
    naturalAbundance: "100%",
    larmor400: "94.85 MHz (9.4 T)",
    quadrupoleMoment: "Q(⁵⁹Co) = +0.42 barns",
    shift: "δ = +8010 dan +8100 ppm gacha ([Co(CN)₆]³⁻ = 0 shkalasida)",
    referens: "K₃[Co(CN)₆] (aq) = 0.00 ppm (IUPAC)",
    whyThisShift: "Nitro (+8120) va nitrito (+8010) ppm orasida ~110 ppm farq. Bu farq Buhro-Griffith empirik qoidasi bilan izohlanadi: δ(⁵⁹Co) ≈ A − B/Δ_o. Nitritoda Δ_o kichikroq (22 500 vs 23 600), lekin σ_para (∝ 1/ΔE) formuladagi ΔE emas, aksincha excited-state ligand-field ΔE ga bog'liq. Nitritoda Co–O bog'ining kovalentligi biroz kamroq — → orbital ekranlashi kattaroq — → δ kichikroq.",
    quadrupolarBroadening: "C₄ᵥ simmetriyada EFG ≠ 0 (endo/exo konformerlarida farq qiladi). Endo-nitrito: CQ ≈ 20–25 MHz; exo-nitrito: CQ ≈ 12–18 MHz. Asimmetriya η = 0.2–0.5.",
    linewidth: "Δν₁/₂ ≈ 1000–3000 Hz (nitroga qaraganda kengroq — endo/exo aralashmasi)",
    t1Relaxation: "T₁ ≈ 0.1–2 ms",
    detection: "512–4096 skan yetarli. Solid-state ⁵⁹Co NMR (WURST-QCPMG) endo/exo konformerlarini alohida ko'rish imkonini beradi.",
    applications: "1) Nitro/nitrito farqlash (Δδ = 110 ppm); 2) Endo/exo konformer nisbatini aniqlash; 3) Solid-state polimorfizm; 4) Photo-salient effekt paytida dinamik kuzatuv.",
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. STRUKTURAVIY PARAMETRLAR
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.structural = {
  bondLengths: {
    coO_ONO:      "1.912(4) Å — Co–O(ONO), σ-donor kuchli, π-akseptor kuchsiz",
    coN_NH3_trans:"1.972(5) Å — Co–N(NH₃) trans-ONO (nitrodan biroz qisqaroq)",
    coN_NH3_cis:  "1.955(4) Å — Co–N(NH₃) cis-ONO (o'rtacha 4 ta)",
    o_N_bond:     "1.240(5) Å — O–N(ligand)",
    n_O_terminal: "1.185(6) Å — N=O terminal (qo'sh bog')",
    referenceCoN6: "[Co(NH₃)₆]³⁺ da barcha Co–N = 1.966 Å",
    source: "CSD: BUNQIP01, GATTUM (exo-nitrito); Grenthe et al. Acta Cryst. 1979",
  },
  bondAngles: {
    coON_angle:   "118° — Co–O–N burchak (sp²-tipdagi O)",
    onO_terminal: "115° — O(koord.)–N–O(terminal) burchak",
    N_Co_N_cis:   "89.8–90.2° (ideal 90°)",
    N_Co_N_trans: "179.1° (ideal 180°)",
    dihedral_ONO: "~30° (exo) yoki ~150° (endo)",
    nitroComparison: "Nitro izomerda: Co–N–O = 122°, O–N–O = 117.5° (simmetrik). Nitritoda O sp² lekin tarkib asimmetrik.",
  },
  transEffect: {
    definition: "Trans-effekt (kinetik) va trans-influence (strukturaviy). ONO⁻ nitroga qaraganda kamroq trans-effekt beradi.",
    order: "CN⁻ > NO₂⁻(N) > ONO⁻(O) > NH₃ > H₂O",
    mechanism: "ONO⁻ (O-koord.): (1) O lp → Co dz² to'ldiradi; (2) π-akseptorlik CHEKLANGAN — N–O terminal bog'i lokalizatsiyalangan; (3) trans-Co–N(NH₃) uzunligi cis dan atigi 0.017 Å uzun (nitroda 0.020 Å).",
    consequence: "¹⁵N NMR: trans-NH₃ va cis-NH₃ ajralishi past haroratda 3–8 ppm (nitroda 5–10 ppm).",
  },
  hydrogenBonding: "Qattiq holatda: N–H(NH₃)···O(ONO_terminal) va N–H···Cl. H···O_terminal ≈ 2.05 Å (nitrodagi 2.15 Å dan qisqaroq — O_terminal ochiqroq). Photo-salient effekt uchun kritik.",
  endoExoStructure: "Nitrito ligandi endo (N → Co) yoki exo (N → tashqari) konformatsiyaga ega. X-ray: kristallda ustun exo (~85%), endo (~15%). DFT: exo 2.4 kkal/mol barqarorroq.",
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. TERMODINAMIKA & KINETIKA (Adell 1944, DSC)
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.thermodynamics = {
  isomerization: {
    reaction: "[Co(NH₃)₅(ONO)]²⁺  →  [Co(NH₃)₅(NO₂)]²⁺  (nitrito → nitro)",
    direction: "Metastabil nitrito ekzotermik holda barqaror nitroga aylanadi",
    deltaH: "ΔH° = −11.4 ± 0.8 kJ/mol (DSC, Grenthe et al. 1970)",
    deltaS: "ΔS° = −8.5 J·mol⁻¹·K⁻¹",
    deltaG298: "ΔG°(298 K) = −8.9 kJ/mol",
    K: "K_eq(298 K) ≈ 36 (97:3 nitro:nitrito). Toza nitrito — kinetik izolyatsiya.",
    activationEnergy: "E_a = 96 ± 4 kJ/mol (eritmada, Adell 1944); 128 kJ/mol (qattiq)",
    rateConstant298: "k(298 K) ≈ 3.5 × 10⁻⁵ s⁻¹ (DMSO, qorong'i)",
    halfLife: "t₁/₂ ≈ 5.5 soat (25°C); 50°C da 9 daq; 100°C da 4 s",
    mechanism: "Intramolekulyar qayta guruhlanish. Basolo & Pearson (1961) ¹⁸O-belgilash bilan tasdiqlangan.",
    eyring: "ΔH‡ = 91 kJ/mol, ΔS‡ = −32 J·mol⁻¹·K⁻¹ (associativ-tipdagi TS), ΔG‡(298) = 101 kJ/mol",
    reverseReaction: "Nitro → nitrito: faqat UV bilan (foto-kimyoviy). Qorong'ida amaliy jihatdan yo'q.",
  },
  metastability: {
    why: "Nitrito — kinetik jihatdan ajratilgan lokal minimum. To'siq 96 kJ/mol — xona haroratida sekin, ammo o'lchovli.",
    stabilityConditions: "Qorong'i, quruq, past T (< 10°C afzal). DMSO da t₁/₂ ≈ 5.5 soat; H₂O da t₁/₂ ≈ 40 daq (kislotali kataliz).",
    comparison: "[Co(NH₃)₅(SCN)]²⁺ (S-koord., t₁/₂ ≈ kunlab); [Rh(NH₃)₅(ONO)]²⁺ (t₁/₂ ≈ haftalab — Rh(III) inertroq).",
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. DFT IZOMERLANISH YO'LLARI (ωB97XD/6-31+G(d,p))
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.dftPathways = [
  {
    id: 1,
    name: "Yo'l A (ustun): exo-nitrito → endo-nitrito → nitro",
    steps: [
      { label: "exo-nitrito", energy: 12.85, type: "minimum" },
      { label: "TS2", energy: 22.53, type: "TS" },
      { label: "endo-nitrito", energy: 15.22, type: "minimum" },
      { label: "TS1", energy: 38.16, type: "TS" },
      { label: "nitro (mahsulot)", energy: 0.00, type: "minimum" },
    ],
    barrier: 25.31,
    barrierUnit: "kkal/mol (effektiv)",
    preferred: true,
    note: "Ikki bosqichli: exo → endo (past to'siq, 9.68) → nitro (yuqori to'siq, 22.94 nisbiy). Endo-nitrito oraliq 2.4 kkal/mol yuqori.",
  },
  {
    id: 2,
    name: "Yo'l B: exo → nitro (bir bosqichli konsertli)",
    steps: [
      { label: "exo-nitrito", energy: 12.85, type: "minimum" },
      { label: "TS3", energy: 41.76, type: "TS" },
      { label: "nitro", energy: 0.00, type: "minimum" },
    ],
    barrier: 28.91,
    barrierUnit: "kkal/mol",
    preferred: false,
    note: "To'siq 3.6 kkal/mol yuqori. Faqat T > 150°C da sezilarli.",
  },
  {
    id: 3,
    name: "Yo'l C: exo ↔ endo (foto-kimyoviy)",
    steps: [
      { label: "exo-nitrito", energy: 12.85, type: "minimum" },
      { label: "TS foto", energy: 22.53, type: "TS" },
      { label: "endo-nitrito", energy: 15.22, type: "minimum" },
    ],
    barrier: 9.68,
    barrierUnit: "kkal/mol",
    preferred: false,
    note: "Konformer o'zgarishi — atigi 9.68 kkal/mol. Photo-salient effekt shu jarayondan boshlanadi!",
  },
]

COMPOUND.dftDetails = {
  method: "ωB97XD/6-31+G(d,p)",
  basisSetForCo: "SDD (Stuttgart-Dresden ECP)",
  solventModel: "IEF-PCM (H₂O, ε = 78.4)",
  coOBondLength: "Co–O = 1.905 Å (hisob) vs 1.912 Å (X-ray) — farq 0.4%",
  coNBondLength: "Co–N(NH₃) = 1.983 Å (hisob) vs 1.972 Å (X-ray) — farq 0.6%",
  isomerEnergyDiff: "exo-nitrito − nitro = +12.85 kkal/mol; endo − nitro = +15.22; endo − exo = +2.37",
  pjteStabilization: "~750 cm⁻¹",
  frequencies: "Barcha minimumlarda musbat; TS bitta xayoliy chastota",
  source: "PMC9077707 (Chen et al., 2022)",
  significance: "DFT bo'yicha exo → nitro to'sig'i 25.31 kkal/mol ≈ 106 kJ/mol — tajribaviy E_a (96 kJ/mol) bilan a'lo mos! Farq 10%. DFT ning kompleks kimyodagi eng yaxshi natijalaridan.",
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. PHOTO-SALIENT EFFEKT (Naumov 2013)
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.photoSalient = {
  discovery: "Panda M.K., Naumov P. Angew. Chem. Int. Ed. 2013, 52, 9812",
  effect: "Nitrito kristali UV (λ = 350 nm) yorug'lik ta'sirida SAKRAYDI — balandligi kristall o'lchamidan 100 martagacha kattaroq (30µm → 3 mm).",
  mechanism: "1) UV foton absorbtsiyasi: ONO n→π* (LMCT); 2) Qo'zg'algan holatda exo→endo konformer o'zgarishi; 3) Endo-holatda molekula hajmi kichrayadi — kristall panjarasida ichki stress; 4) Kritik stressda kristall yorilib sakraydi.",
  quantum: "Φ(foto-izomerlanish) ≈ 0.15; Φ(sakrash) ≈ 0.01–0.03",
  applications: [
    "Photo-mexanik aktuatorlar (soft robotics)",
    "Elastik energiya saqlash",
    "Real-vaqt kristallografiya",
    "Bio-inspired nanomashinalar",
  ],
  keyPoint: "Photo-salient effekt AYNAN NITRITO uchun mavjud: (1) exo→endo o'zgarish kichik to'siq (9.68 kkal/mol); (2) hajm farqi ~15%; (3) kristall bu farqni akkumatsiyalab, mexanik energiya sifatida chiqaradi.",
  nmrConnection: "In-situ UV nurlangan solid-state ¹H MAS NMR orqali molekulyar dinamika va endo/exo nisbatni real vaqtda o'lchash mumkin.",
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. LINKAGE IZOMER TAQQOSLASH
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.linkageComparison = [
  { compound: "[Co(NH₃)₅(ONO)]²⁺", ligand: "ONO⁻ (O-koord.)", color: "qizil", n15: "+528 ppm", co59: "+8010 ppm", stability: "kinetik (metastabil)", note: "Hozir tahlil qilinayotgan izomer", isCurrent: true },
  { compound: "[Co(NH₃)₅(NO₂)]²⁺", ligand: "NO₂⁻ (N-koord.)", color: "sariq", n15: "+412 ppm", co59: "+8120 ppm", stability: "termodinamik ustun", note: "Barqaror mahsulot", isCurrent: false },
  { compound: "[Co(NH₃)₅(NCS)]²⁺", ligand: "NCS⁻ (N-koord.)", color: "pushti", n15: "−180 ppm", co59: "+8250 ppm", stability: "barqaror", note: "Izotiotsianato", isCurrent: false },
  { compound: "[Co(NH₃)₅(SCN)]²⁺", ligand: "SCN⁻ (S-koord.)", color: "to'q pushti", n15: "−310 ppm", co59: "+7900 ppm", stability: "metastabil", note: "Tiotsianato", isCurrent: false },
  { compound: "[Co(NH₃)₆]³⁺",       ligand: "6× NH₃",          color: "sariq (luteo)", n15: "−340 ppm (NH₃)", co59: "+8120 ppm", stability: "referens", note: "Klassik referens", isCurrent: false },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 9. YaMR SIGNALLAR (¹⁷O qo'shildi — nitritoning uniq zondi!)
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.nmrSignals = [
  { nucleus: "¹H",  ligand: "NH₃ (barchasi, 15H)", shift: 3.5,   mult: "singlet",              J: "—",             integ: "15H", note: "Nitro bilan bir xil (0.0 ppm farq) — ¹H NMR linkage izomerlarni farqlay olmaydi.", uniqueToNitrito: false },
  { nucleus: "¹⁵N", ligand: "ONO (terminal N, koord. emas)", shift: 528, mult: "singlet",     J: "—",             integ: "1N",  note: "CH₃NO₂ shkalasida. Nitrodan +116 ppm siljigan.", uniqueToNitrito: true },
  { nucleus: "¹⁵N", ligand: "NH₃ (trans-ONO)",     shift: -337,  mult: "singlet",              J: "¹J(N–H)=73 Hz",  integ: "1N",  note: "NH₃(l) shkalasida. Cis dan 3–8 ppm siljigan.", uniqueToNitrito: false },
  { nucleus: "¹⁵N", ligand: "NH₃ (cis-ONO)",       shift: -340,  mult: "singlet",              J: "¹J(N–H)=73 Hz",  integ: "4N",  note: "To'rt ekvivalent NH₃", uniqueToNitrito: false },
  { nucleus: "¹⁷O", ligand: "Co–O (koord.)",       shift: 290,   mult: "singlet (juda keng)",  J: "—",             integ: "1O",  note: "H₂O = 0 shkalasida. Δν₁/₂ ≈ 300–500 Hz. ⭐ Faqat nitrito da!", uniqueToNitrito: true },
  { nucleus: "¹⁷O", ligand: "N=O terminal",         shift: 570,   mult: "singlet (keng)",       J: "—",             integ: "1O",  note: "Erkin N=O signali — Co ga bog'lanmagan.", uniqueToNitrito: true },
  { nucleus: "⁵⁹Co", ligand: "Co markazi",          shift: 8010,  mult: "singlet (juda keng)",  J: "—",             integ: "1Co", note: "[Co(CN)₆]³⁻ = 0 shkalasida. Nitrodan −110 ppm. Δν₁/₂ ≈ 1500–3000 Hz.", uniqueToNitrito: false },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 10. HALAQIT BERUVCHI OMILLAR
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.interferences = [
  { source: "NITRO izomer aralashmasi (asosiy!)", effect: "¹⁵N NMR da +412 ppm da qo'shimcha signal (Δδ = 116 ppm). Vaqt o'tishi bilan nitrito → nitro konversiyasi aralashmani oshiradi.", severity: "Yuqori", solution: "1) Yangi tayyorlangan namuna; 2) Quruq DMSO-d₆; 3) Qorong'i saqlash; 4) UV-Vis bilan tekshirish (λ_max = 500 nm)", theory: "Nitrito metastabil (ΔG° = −8.9 kJ/mol). 25°C, 5.5 soatda 50% konversiya. Vaqt bo'yicha signal intensivligi — kinetikani o'lchash imkoni! Dinamik NMR usuli." },
  { source: "Foto-izomerlanish (UV, ambient)", effect: "UV nitrito → nitro (Φ ≈ 0.15). NMR probirkasida ham sodir bo'ladi.", severity: "Yuqori", solution: "Amber probirka; laboratoriya yorug'ligini kamaytirish; fol'ga bilan o'rash; darkroom rejim.", theory: "Naumov (2013): 350 nm UV — LMCT o'tish. Fluoresent chiroqlarda 254/365 nm chiziqlari — amber probirka ZARUR." },
  { source: "¹⁷O past sezgirlik", effect: "Tabiiy 0.037% da 24 soat skanerlashda ham S/N 3× dan past", severity: "Yuqori", solution: "1) ¹⁷O-boyitilgan (10–25%); 2) 600+ MHz; 3) Konsentratsiya >0.5 M; 4) Direct excitation", theory: "Sezgirlik = (γ/γ_H)³ × tarqalish = 1.11 × 10⁻⁵. Boyitish (25%) 675× tejamli. Narx ~$400/g H₂¹⁷O." },
  { source: "⁵⁹Co kvadrupol kengayishi (endo/exo)", effect: "Endo+exo aralashmasi tufayli nitroga qaraganda kengroq", severity: "O'rta", solution: "Solid-state WURST-QCPMG bilan alohida ajratish. Eritmada tez almashinuv tufayli o'rtacha signal.", theory: "Endo: CQ ≈ 22 MHz, exo: CQ ≈ 15 MHz. Eritma almashinuv > 10⁷ s⁻¹ — NMR shkalasida bir signal." },
  { source: "H/D almashinuvi (D₂O da)", effect: "NH₃ D bilan almashinadi; ONO hidrolizi", severity: "Yuqori", solution: "DMSO-d₆ (kuritilgan) yagona to'g'ri erituvchi. Molekulyar elak (3 Å).", theory: "D₂O da NH → ND (t₁/₂ < 1 daq); Co–O bog'i hydrolytic labillashadi. Sof DMSO-d₆ (< 20 ppm H₂O) muhim." },
  { source: "Paramagnit metall aralashmasi", effect: "Signal kengayishi (Solomon-Bloembergen)", severity: "O'rta", solution: "Chelex-100; Ar/N₂; qayta kristallash H₂O/etanoldan.", theory: "1/T₂ ∝ 1/r⁶. 10⁻⁶ M paramagnit modda 5 Å masofada sezilarli." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 11. LABORATORIYA TARTIBI
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.labProcedure = [
  { step: 1, title: "🔴 KRITIK: Yangi namuna tayyorlash", time: "1-2 soat", desc: "Nitrito noaniq holda saqlanmaydi — har eksperimentdan oldin yangi. Adell (1944) usuli: [Co(NH₃)₅(H₂O)](NO₃)₃ + NaNO₂ (past pH, 0°C) → [Co(NH₃)₅(ONO)](NO₃)₂ (qizil). Cl₂ tuz muzli HCl bilan qayta kristallashdan olinadi. Muzli hammom + qorong'i.", theory: "Past T (0°C) — kinetik nazorat: kichik faollik energiyasidagi O ga bog'lanish. 20°C da termodinamik nitro hosil bo'ladi. 30 daq/0°C → 90% nitrito." },
  { step: 2, title: "Xavfsizlik va materiallar", time: "10 daq", desc: "Nitril qo'lqop, ko'zoynak, xalat. Amber NMR probirka (UV himoya). Muz-suv hammom. Kuritilgan DMSO-d₆ (99.96% D, <20 ppm H₂O; molekulyar elak).", theory: "NO₂⁻/ONO⁻ tuzlari toksik. UV himoya — foto-izomerlanishni oldini olish. H₂O aralashmasi hidrolizni keltiradi." },
  { step: 3, title: "Muzli DMSO-d₆ da eritish", time: "5 daq", desc: "20–30 mg namuna 0–5°C hammomda 0.60 mL kuritilgan DMSO-d₆ da eritish. Ultratovushli hammom ISHLATILMAYDI (issiqlik). Cho'kmasiz eritma — tez probirkaga.", theory: "Past T da k juda kichik (5×10⁻⁸ s⁻¹ at 0°C, t₁/₂ ≈ 160 kun). NMR ga o'tkazgunicha muz-suvda saqlash." },
  { step: 4, title: "Spektrometr sozlash (tez)", time: "15–20 daq", desc: "Namunani probega joylash, T = 5°C ga tushirish (VT-nazorat). Lock: DMSO-d₆; shim: HDO ≤ 1 Hz; pw90 ≈ 10 μs.", theory: "5°C da t₁/₂ ≈ 60 soat — eksperimentlar uchun yetarli. Yaxshi shim nitritoning past-T dagi 4:1 NH₃ ajralishini beradi." },
  { step: 5, title: "¹H NMR (kalibr)", time: "5 daq", desc: "SW 12 ppm; d1=1 s; ns=32; 30° impuls. Kutilgan: singlet 3.5 ppm (15H). Nitro bilan bir xil ko'rinadi.", theory: "¹H nitro/nitrito farqlamaydi. Namuna tozaligini tez tekshirish uchun." },
  { step: 6, title: "¹⁵N NMR — LINKAGE identifikatsiyasi", time: "1–2 soat", desc: "¹⁵N-boyitilgan afzal. SW 600 ppm; d1=3 s; ns=1024–8192; INEPT. ⭐ KUTILGAN: singlet +528 ppm (nitrito). +412 ppm bo'lsa — nitro aralashmasi.", theory: "¹⁵N γ manfiy — NOE η = −4.94. Salbiy NOE tufayli signal 'ichkariga'. Solution: d1 ≥10 s yoki INEPT." },
  { step: 7, title: "¹⁷O NMR — nitritoning yakuniy tasdiqi", time: "4–8 soat", desc: "¹⁷O-boyitilgan (10–25%) ZARUR. SW 1000 ppm; d1=0.02 s; ns=16 000–128 000. ⭐ KUTILGAN: +290 ppm (Co–O), +570 ppm (N=O terminal).", theory: "¹⁷O nitroDA YO'Q — 100% aniq farqlash. Kvadrupol T₁ juda qisqa — tez qayta impuls." },
  { step: 8, title: "⁵⁹Co NMR", time: "20–60 daq", desc: "SW 20 000 ppm; d1=0.05 s; ns=512–4096. Kutilgan: ~+8010 ppm (Δν₁/₂ ≈ 2000 Hz). Nitrodan −110 ppm.", theory: "Kengroq (endo+exo). WURST-QCPMG kerak bo'lishi mumkin." },
  { step: 9, title: "Kinetik NMR (in-situ)", time: "6–24 soat", desc: "T = 25°C ga ko'tarilib har 30 daq ¹⁵N NMR. +528 kamayadi, +412 ortadi. Log(integ) chizig'i → k.", theory: "Bevosita kinetika o'lchash. Adell (1944) usulini avtomatlashtirish. 5 daq/spektr × 6 soat = to'liq egri chiziq." },
  { step: 10, title: "VT-NMR (endo/exo ajratish)", time: "4–8 soat", desc: "170–220 K oralig'ida ¹⁵N va ⁵⁹Co. Endo/exo konformer ajratish. ΔG‡_conf aniqlash.", theory: "k_conf = πΔν/√2 koalesansiyadan. ΔG‡_conf ≈ 40 kJ/mol. LN₂/He cryostat kerak." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 12. KENGAYTIRUVCHI METODLAR
// ═══════════════════════════════════════════════════════════════════════════════
COMPOUND.advancedTechniques = [
  { name: "Kinetik NMR (in-situ)", desc: "Nitrito → nitro konversiyasini vaqt bo'yicha ¹⁵N NMR bilan. Har spektrada +528 (nitrito) va +412 (nitro) integrallarini o'lchash.", advs: ["k bevosita o'lchash", "Eyring parametrlari", "Solvent effekti"], disadvs: ["Uzoq eksperiment", "Qorong'i muhit", "Yuqori konsentratsiya"], bestFor: "Kinetika va mexanizm", example: "25°C, har 30 daq spektr, 6 soat → 6 nuqta → ln(integ) → k = 3.5×10⁻⁵ s⁻¹. 20/30/40°C → Arrhenius → E_a = 96 kJ/mol." },
  { name: "¹⁷O NMR (uniq zond)", desc: "Co–O bog'ini bevosita. Faqat nitrito da mavjud. Boyitilgan namuna zarur.", advs: ["Nitroni istisno (100% aniq)", "Co–O tabiati", "Fluoresensiya bilan komplementar"], disadvs: ["Boyitish qimmat (~$400/g)", "Kvadrupol keng (>200 Hz)", "24+ soat tabiiy"], bestFor: "Nitrito ni istisno qilish", example: "25% ¹⁷O, 600 MHz, 6 soat → +290 va +570 ppm. Nitroga aylantirilgach signallar to'liq yo'qoladi." },
  { name: "In-situ UV-NMR (photo-salient)", desc: "NMR probirkasiga integratsiyalangan LED (350 nm). Naumov 2015.", advs: ["Photo-kinetika bevosita", "Kvantli chiqim Φ", "Endo/exo dinamika"], disadvs: ["Maxsus uskuna (LED+fiber)", "Nur kalibrlash"], bestFor: "Photo-salient mexanizmi", example: "365 nm, 5 mW, 30 daq → exo→endo 40%. ¹H MAS: 4.2→3.9 ppm siljish." },
  { name: "DSC", desc: "Nitrito → nitro termik parametrlari. 5–10 K/min.", advs: ["ΔH, ΔS bevosita", "Faza o'tishlari"], disadvs: ["Faqat termik", ">5 mg"], bestFor: "Termodinamika", example: "S0040603103003617: ekzotermik 90–110°C, ΔH = −11.4 kJ/mol" },
  { name: "Solid-state ⁵⁹Co (WURST-QCPMG)", desc: "Endo va exo alohida. CQ va η aniq.", advs: ["Alohida signal", "Kristallografik simmetriya", "Photo-salient uchun oldin/keyin"], disadvs: ["Maxsus zonda", "Chiziqlar keng"], bestFor: "Kristal struktura", example: "Exo: δ=+7990, CQ=15 MHz; Endo: δ=+8050, CQ=22 MHz." },
  { name: "ωB97XD/6-31+G(d,p) DFT", desc: "Geometriya, TS, NMR ekranlash (GIAO).", advs: ["NMR bashorati", "Endo/exo energiya", "TS energiyalari"], disadvs: ["Kompyuter kuchi"], bestFor: "Photo-izomerlanish mexanizmi", example: "PMC9077707: exo–endo 2.37 kkal/mol; to'siq 25.31 kkal/mol; ¹⁵N(ONO) = 525 ppm (tajriba 528)." },
]

// ═══════════════════════════════════════════════════════════════════════════════
// PDF UCHUN MATN TOZALAGICH
// ═══════════════════════════════════════════════════════════════════════════════
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
// UI KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════════
export default function CoNH35ONOCl2Page() {
  const [showHeader, setShowHeader] = useState(true)
  const [activeNmrNucleus, setActiveNmrNucleus] = useState("h1")
  const [activePathway, setActivePathway] = useState(1)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfMessage, setPdfMessage] = useState("")

  const ppmRange = useMemo(() => {
    const ranges = { 1: [-1, 12], 2: [0, 8], 4: [2, 5] }
    return ranges[zoomLevel] || ranges[1]
  }, [zoomLevel])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950/30 to-blue-950 text-white">

      {/* HEADER (ogohlantirish modali yo'q) */}
      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/nmr" className="hover:text-purple-300">YaMR</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/nmr/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-red-400 font-semibold">[Co(NH₃)₅(ONO)]Cl₂</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-2 flex-wrap">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-1">🧲 YaMR</span>
                  <span className="text-xs bg-pink-600 px-2 py-1 rounded">Photo-salient</span>
                  <span className="text-xs bg-red-600 px-2 py-1 rounded">Metastabil</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol  •  CAS: {COMPOUND.casNumber}  •  Kashfiyot: {COMPOUND.discovery}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase">Linkage izomer (O-koord.)</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase">Diamagnit (d⁶ LS)</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase">C₄ᵥ (endo/exo)</span>
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase">🔥 Photo-salient</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => generatePDF({ setPdfGenerating, setPdfMessage })}
                  disabled={pdfGenerating}
                  className="text-xs bg-red-600/90 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-2"
                >
                  {pdfGenerating ? "⏳ PDF yaratilyapti..." : "📄 Ilmiy PDF yuklab olish"}
                </button>
                <Link href="/ilmiy/tahlil/nmr/birikmalar/co-nh3-5-no2" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-center">
                  → Nitro izomer (sariq)
                </Link>
                <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-xs bg-purple-600/80 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-center">
                  ← Katalog
                </Link>
              </div>
            </div>
            {pdfMessage && (
              <div className="mt-2 text-xs text-red-300 bg-red-900/30 border border-red-500/40 rounded p-2">
                {pdfMessage}
              </div>
            )}
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-3 py-2 rounded-lg text-xs font-bold shadow-lg bg-red-600 hover:bg-red-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽" : "🔼"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs font-semibold">YaMR chuqur tahlil</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Adell 1944</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">Naumov 2013 photo-salient</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">DFT ωB97XD</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4 flex-wrap">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              [Co(NH₃)₅(ONO)]Cl₂
            </h2>
            <span className="text-purple-400 text-lg">{COMPOUND.molarMass} g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            <span className="text-red-400 italic">“Ambidentat NO₂⁻ ligandning O-koordinatsiyalangan izomeri — photo-salient effektning kashshof namunasi”</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-4">
            Bu qizil kristall <strong className="text-red-400">nitro izomerining kinetik juftidoshi</strong>. 1894-yilda S. M. Jørgensen tomonidan nitro bilan birga tavsiflangan, bu tuz
            <strong className="text-red-400"> ONO⁻ ligandi</strong>ni <strong>kislorod atomi orqali</strong> Co ga bog'lanish shakli. Termodinamik jihatdan metastabil: xona haroratida
            <strong className="text-red-400"> t₁/₂ ≈ 5.5 soat</strong> davomida barqaror nitroga (sariq) aylanadi. Aynan shu jarayonning kvantli tabiati 2013-yilda
            <strong className="text-red-400"> Naumov guruhi</strong>ni <strong>photo-salient effektni</strong> kashf etishga olib keldi — UV nurlangan kristall balandligiga 100 marta kattaroq sakraydi.
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            YaMR spektroskopiyasi bu birikma uchun to'rt xil zond taklif qiladi:
            <strong className="text-red-400"> ¹H (NH₃, nitro dan ajratmaydi)</strong>,
            <strong className="text-red-400"> ¹⁵N (δ = +528 ppm, nitrodan +116 ppm)</strong>,
            <strong className="text-red-400"> ¹⁷O (δ = +290 ppm, faqat nitrito da!)</strong> va
            <strong className="text-red-400"> ⁵⁹Co (δ = +8010 ppm)</strong>. ¹⁷O NMR — <strong>bu izomerni 100% aniq farqlash uchun uniq metod</strong>, chunki nitroda O atomi Co ga bog'lanmagan va signal umuman yo'q.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Co³⁺ (d⁶ LS)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Ligand donor</div>
              <div className="text-white font-bold">O (nitrito)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">C₄ᵥ (endo/exo)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Barqarorlik</div>
              <div className="text-white font-bold">Metastabil</div>
            </div>
          </div>
        </div>

        {/* METASTABIL OGOHLANTIRUV KARTAsi */}
        <div className="bg-red-900/30 border-2 border-red-500/50 rounded-2xl p-6 flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">⚠️</div>
          <div className="flex-1">
            <h3 className="text-red-300 font-bold text-lg mb-2">KRITIK: Namuna metastabil!</h3>
            <p className="text-purple-200 text-sm leading-relaxed mb-2">
              [Co(NH₃)₅(ONO)]Cl₂ — kinetik izolyatsiyalangan metastabil mahsulot. 25°C, DMSO da <strong className="text-red-300">yarim yemirilish t₁/₂ = 5.5 soat</strong>.
              Har eksperimentdan oldin yangi namuna kerak. UV yorug'lik <strong className="text-red-300">10 000 marta</strong> tezlashtiradi (Naumov 2013, Φ ≈ 0.15).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs mt-3">
              <div className="bg-red-950/50 rounded p-2">
                <div className="text-red-300 font-bold">🌡 Harorat</div>
                <div className="text-purple-200">0°C: t₁/₂ ≈ 160 kun<br/>25°C: t₁/₂ ≈ 5.5 soat<br/>50°C: t₁/₂ ≈ 9 daq</div>
              </div>
              <div className="bg-red-950/50 rounded p-2">
                <div className="text-red-300 font-bold">☀️ Yorug'lik</div>
                <div className="text-purple-200">Qorong'i: k = 3.5×10⁻⁵ s⁻¹<br/>UV 350 nm: k oshadi 10⁴×</div>
              </div>
              <div className="bg-red-950/50 rounded p-2">
                <div className="text-red-300 font-bold">💧 Namlik</div>
                <div className="text-purple-200">Quruq DMSO-d₆: normal<br/>H₂O da: t₁/₂ ≈ 40 daq</div>
              </div>
            </div>
          </div>
        </div>

        {/* KRISTALL MAYDON NAZARIYASI */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">⚛️</span> 1. Kristall maydon nazariyasi
            </h2>
            <span className="text-xs text-blue-400 bg-blue-900/40 px-3 py-1 rounded-full">Bethe 1929, Van Vleck 1932</span>
          </div>

          <div className="bg-blue-900/30 rounded-lg p-4 border-l-4 border-blue-400">
            <p className="text-blue-200 text-sm leading-relaxed">
              <strong className="text-blue-300">Nima uchun rangi qizil?</strong> ONO⁻ ligandi kislorod orqali bog'lanadi — bu nitro (N-koord.) izomeriga qaraganda
              <strong> kuchsizroq ligand maydonini</strong> beradi (kamroq π-akseptorlik).
              Natijada Δ_o = 22 500 cm⁻¹ (nitroda 23 600). d–d o'tish ¹A₁g → ¹T₁g ~20 000 cm⁻¹ = <strong>500 nm</strong> (yashil-sariq yutiladi → <strong className="text-red-300">qizil rang</strong>).
              Nitroda esa 455 nm (sariq). Rang farqi — Δ_o dagi 1100 cm⁻¹ farqning bevosita ko'rinishi.
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
                  ["Ajralish Δ_o", COMPOUND.crystalField.crystalFieldSplitting],
                  ["Racah B", COMPOUND.crystalField.racahParameter],
                  ["Nefelauxetik β", COMPOUND.crystalField.nephelauxeticRatio],
                  ["Juftlanish P", COMPOUND.crystalField.pairingEnergy],
                  ["CFSE", COMPOUND.crystalField.cfse],
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

          <div className="bg-blue-900/30 rounded-lg p-4 space-y-2">
            <h4 className="text-blue-300 font-bold flex items-center gap-2">📈 Spektrokimyoviy qator</h4>
            <p className="text-purple-200 text-sm font-mono bg-blue-950/50 p-2 rounded overflow-x-auto">
              {COMPOUND.crystalField.spectrochemicalSeries}
            </p>
            <p className="text-purple-200 text-sm"><strong className="text-blue-300">Xulosa:</strong> {COMPOUND.crystalField.whyLowSpin}</p>
            <p className="text-purple-200 text-sm"><strong className="text-blue-300">Rang manbai:</strong> {COMPOUND.crystalField.colorOrigin}</p>
            <p className="text-purple-200 text-sm"><strong className="text-blue-300">LMCT (photo-salient uchun):</strong> {COMPOUND.crystalField.chargeTransfer}</p>
            <div className="bg-yellow-900/30 border border-yellow-500/40 rounded p-3 mt-3">
              <div className="text-yellow-300 font-bold text-xs mb-1">⚖️ Nitro bilan taqqoslash:</div>
              <p className="text-purple-200 text-xs">(COMPOUND.crystalField.comparisonWithNitro)</p>
            </div>
          </div>
        </div>

        {/* SIMMETRIYA */}
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📐</span> 2. Simmetriya va C₄ᵥ xarakterlar (endo/exo konformerlari)
            </h2>
            <span className="text-xs text-purple-300 bg-purple-900/40 px-3 py-1 rounded-full">Guruh tartibi: 8</span>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-4 border-l-4 border-purple-400">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-purple-300">C₄ᵥ (ideal) yoki Cs (haqiqiy)?</strong> Nitrito ligandi ideal C₄ᵥ simmetriyasiga to'liq mos kelmaydi — Co–O–N burchagi (~118°) va N–O terminal bog'i C₄ o'qi bo'yicha proyeksiyalanmaydi.
              Amaliyotda: endo (N→Co ga qaragan) va exo (N→tashqariga) konformatsiyalar — har biri <strong>Cs simmetriya</strong>. Eritmada tez almashinuv ( 10⁷ s⁻¹)
              tufayli o'rtacha C₄ᵥ ko'rinadi. Qattiq holatda — alohida ajraladi.
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
              <h3 className="text-purple-400 font-bold mb-3">🎵 Endo/exo konformerlar (uniq nitritoga)</h3>
              <div className="space-y-2 text-xs text-purple-200 leading-relaxed">
                {COMPOUND.symmetry.endoExoConformers}
              </div>
              <div className="bg-pink-900/30 border border-pink-500/40 rounded p-3 mt-3 text-xs">
                <strong className="text-pink-300">🔥 Muhim:</strong> Endo↔exo o'zgarish — photo-salient effektning boshlang'ich bosqichi (Naumov 2013). Kichik to'siq: 9.68 kkal/mol.
              </div>
            </div>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-4">
            <h4 className="text-purple-300 font-bold mb-2">🧢 NMR ekvivalentligi</h4>
            <p className="text-purple-200 text-sm leading-relaxed">{COMPOUND.symmetry.nmrEquivalence}</p>
          </div>

          <div className="bg-purple-950/40 p-5 rounded-xl border border-purple-700/30">
            <h4 className="text-purple-400 font-bold mb-3">C₄ᵥ xarakterlar jadvali</h4>
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
                    <th className="py-2 px-2 text-purple-300">Funksiyalar</th>
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

        {/* YaMR NAZARIYASI — 4 YADRO (¹H, ¹⁵N, ¹⁷O, ⁵⁹Co) */}
        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧲</span> 3. YaMR nazariyasi — to'rt yadro bo'yicha chuqur tahlil
          </h2>

          <div className="bg-cyan-900/30 rounded-lg p-4 border-l-4 border-cyan-400">
            <p className="text-cyan-200 text-sm leading-relaxed">
              <strong className="text-cyan-300">Nitrito uchun 4 zond!</strong> Nitro izomerdan farqli o'laroq, bu izomerda kislorod atomi Co ga bevosita bog'langan — shu sabab
              <strong className="text-cyan-300"> ¹⁷O NMR</strong> qo'shimcha zond sifatida ochiladi (nitroda O signali yo'q). Bu — 100% aniq farqlash usuli.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "h1",  label: "¹H (I=1/2)",  emoji: "💧", unique: false },
              { key: "n15", label: "¹⁵N (I=1/2)", emoji: "🥂", unique: false },
              { key: "o17", label: "¹⁷O (I=5/2) ⭐", emoji: "🔵", unique: true },
              { key: "co59",label: "⁵⁹Co (I=7/2)", emoji: "🧲", unique: false },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setActiveNmrNucleus(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeNmrNucleus === t.key
                    ? "bg-cyan-600/60 text-white border border-cyan-400/50"
                    : t.unique
                    ? "bg-red-900/40 text-red-300 border border-red-700/50 hover:bg-red-800/40"
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
              <div className="bg-red-900/30 border border-red-500/40 rounded p-3">
                <div className="text-red-300 font-bold text-xs mb-1">⚠️ Muhim cheklov:</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.h1.keyDifference}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["γ", COMPOUND.nmrTheory.h1.gamma],
                  ["Tarqalish", COMPOUND.nmrTheory.h1.naturalAbundance],
                  ["Larmor (9.4 T)", COMPOUND.nmrTheory.h1.larmor400],
                  ["δ (siljish)", COMPOUND.nmrTheory.h1.shift],
                  ["Multipletlik", COMPOUND.nmrTheory.h1.multiplicity],
                  ["Chiziq kengligi", COMPOUND.nmrTheory.h1.linewidth],
                  ["T₁", COMPOUND.nmrTheory.h1.t1Relaxation],
                  ["Erituvchi", COMPOUND.nmrTheory.h1.solvent],
                ].map(([k, v], i) => (
                  <div key={i} className="bg-purple-950/50 rounded p-2">
                    <div className="text-xs text-purple-400">{k}</div>
                    <div className="text-cyan-300 font-mono text-xs mt-1">{v}</div>
                  </div>
                ))}
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">🔍 Fizik izoh:</div>
                <p className="text-purple-200 text-xs leading-relaxed">{COMPOUND.nmrTheory.h1.whyThisShift}</p>
              </div>
            </div>
          )}

          {/* ¹⁵N */}
          {activeNmrNucleus === "n15" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-3">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.n15.nucleus} — Linkage identifikatsiya zondi</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["γ (manfiy)", COMPOUND.nmrTheory.n15.gamma],
                  ["Tarqalish", COMPOUND.nmrTheory.n15.naturalAbundance],
                  ["Larmor", COMPOUND.nmrTheory.n15.larmor400],
                  ["Sezgirlik", COMPOUND.nmrTheory.n15.sensitivity],
                  ["δ(ONO-N)", COMPOUND.nmrTheory.n15.shift_ONO],
                  ["δ(NH₃)", COMPOUND.nmrTheory.n15.shift_NH3],
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
                <div className="text-yellow-300 font-bold text-xs mb-1">⭐ Linkage farqlash</div>
                <p className="text-purple-100 text-xs leading-relaxed">{COMPOUND.nmrTheory.n15.linkageDiscrimination}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">🔍 Fizik izoh</div>
                <p className="text-purple-200 text-xs leading-relaxed">{COMPOUND.nmrTheory.n15.whyThisShift}</p>
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">📚 Amaliy eslatma</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.n15.keyPoint}</p>
              </div>
            </div>
          )}

          {/* ¹⁷O — UNIQ ZOND */}
          {activeNmrNucleus === "o17" && (
            <div className="bg-red-600/10 border-2 border-red-500/50 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-red-400 font-bold">{COMPOUND.nmrTheory.o17.nucleus}</h3>
                <span className="text-xs bg-red-600 text-white px-3 py-1 rounded-full">⭐ FAQAT NITRITODA</span>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500/40 rounded p-3">
                <div className="text-yellow-300 font-bold text-xs mb-1">🌟 Nima uchun uniq?</div>
                <p className="text-purple-100 text-xs leading-relaxed">{COMPOUND.nmrTheory.o17.keyPoint}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["γ (manfiy)", COMPOUND.nmrTheory.o17.gamma],
                  ["Tarqalish", COMPOUND.nmrTheory.o17.naturalAbundance],
                  ["Larmor", COMPOUND.nmrTheory.o17.larmor400],
                  ["Kvadrupol Q", COMPOUND.nmrTheory.o17.quadrupoleMoment],
                  ["Sezgirlik", COMPOUND.nmrTheory.o17.sensitivity],
                  ["δ (asosiy)", COMPOUND.nmrTheory.o17.shift],
                  ["Chiziq kengligi", COMPOUND.nmrTheory.o17.linewidth],
                  ["T₁", COMPOUND.nmrTheory.o17.t1Relaxation],
                ].map(([k, v], i) => (
                  <div key={i} className="bg-purple-950/50 rounded p-2">
                    <div className="text-xs text-purple-400">{k}</div>
                    <div className="text-red-300 font-mono text-xs mt-1">{v}</div>
                  </div>
                ))}
              </div>
              <div className="bg-red-900/30 rounded-lg p-3">
                <div className="text-red-400 font-bold text-xs mb-1">🔍 Fizik izoh</div>
                <p className="text-purple-200 text-xs leading-relaxed">{COMPOUND.nmrTheory.o17.whyThisShift}</p>
              </div>
              <div className="bg-red-900/30 rounded-lg p-3">
                <div className="text-red-400 font-bold text-xs mb-1">🛠️ Amaliy o'lchash</div>
                <p className="text-purple-200 text-xs">{COMPOUND.nmrTheory.o17.detection}</p>
              </div>
            </div>
          )}

          {/* ⁵⁹Co */}
          {activeNmrNucleus === "co59" && (
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 space-y-3">
              <h3 className="text-cyan-400 font-bold">{COMPOUND.nmrTheory.co59.nucleus} — Metall markazi zondi</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["γ", COMPOUND.nmrTheory.co59.gamma],
                  ["Tarqalish", COMPOUND.nmrTheory.co59.naturalAbundance],
                  ["Larmor", COMPOUND.nmrTheory.co59.larmor400],
                  ["Kvadrupol Q", COMPOUND.nmrTheory.co59.quadrupoleMoment],
                  ["δ", COMPOUND.nmrTheory.co59.shift],
                  ["Chiziq kengligi", COMPOUND.nmrTheory.co59.linewidth],
                  ["T₁", COMPOUND.nmrTheory.co59.t1Relaxation],
                  ["CQ (endo/exo)", "22 / 15 MHz"],
                ].map(([k, v], i) => (
                  <div key={i} className="bg-purple-950/50 rounded p-2">
                    <div className="text-xs text-purple-400">{k}</div>
                    <div className="text-cyan-300 font-mono text-xs mt-1">{v}</div>
                  </div>
                ))}
              </div>
              <div className="bg-cyan-900/30 rounded-lg p-3">
                <div className="text-cyan-400 font-bold text-xs mb-1">🔍 Ramsey paramagnit hissasi</div>
                <p className="text-purple-200 text-xs leading-relaxed">{COMPOUND.nmrTheory.co59.whyThisShift}</p>
              </div>
              <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                <div className="text-red-300 font-bold text-xs mb-1">⚠️ Kvadrupol (endo+exo)</div>
                <p className="text-purple-200 text-xs leading-relaxed">{COMPOUND.nmrTheory.co59.quadrupolarBroadening}</p>
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
            <span className="text-2xl">📊</span> 4. YaMR signallar jadvali (¹⁷O signallari — nitritoning uniq belgisi!)
          </h2>
          <p className="text-purple-300 text-sm">
            Nitritoning YaMR to'plami — to'rt yadro, olti xil signal. Qizil rangdagi qatorlar (<span className="text-red-400">⭐</span>) faqat nitrito uchun mavjud belgilar.
            Nitroga o'tganda bu signallar to'liq yo'qoladi — shu sabab dinamik kuzatuv uchun mos.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-red-400">Yadro</th>
                  <th className="py-3 px-3 text-red-400">Ligand / Holat</th>
                  <th className="py-3 px-3 text-red-400">δ (ppm)</th>
                  <th className="py-3 px-3 text-red-400">Mult.</th>
                  <th className="py-3 px-3 text-red-400">J (Hz)</th>
                  <th className="py-3 px-3 text-red-400">Integ.</th>
                  <th className="py-3 px-3 text-red-400">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.nmrSignals.map((s, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${s.uniqueToNitrito ? "bg-red-900/10" : ""}`}>
                    <td className="py-3 px-3 text-red-400 font-bold">
                      {s.uniqueToNitrito && <span className="text-red-400 mr-1">⭐</span>}
                      {s.nucleus}
                    </td>
                    <td className="py-3 px-3">{s.ligand}</td>
                    <td className="py-3 px-3 text-red-300 font-mono font-bold">{s.shift}</td>
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

        {/* INTERAKTIV ¹H NMR SPEKTR */}
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
                    zoomLevel === z ? "bg-red-600 text-white" : "bg-purple-800/50 text-purple-300"
                  }`}
                >
                  {z}× zoom
                </button>
              ))}
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-lg p-4 text-xs text-purple-200 leading-relaxed border-l-4 border-red-500/50">
            <strong className="text-red-300">Diqqat!</strong> Nitrito va nitro izomerlarining ¹H NMR spektrlari <strong>bir-biriga o'xshash</strong> — NH₃ protonlari ikkala izomerda ham δ 3.5 ppm da singlet.
            Bu grafik faqat NH₃ signalini ko'rsatadi. Linkage izomerni farqlash uchun <strong className="text-red-300">¹⁵N yoki ¹⁷O NMR</strong> zarur.
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <svg viewBox="0 0 700 340" className="w-full h-auto" role="img" aria-label="¹H NMR spektr">
              <defs>
                <linearGradient id="peakGradR" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              <rect x="50" y="20" width="620" height="250" fill="#1e1b4b" fillOpacity="0.3" stroke="#4c1d95" strokeWidth="0.5" />
              <line x1="50" y1="270" x2="50" y2="20" stroke="#a78bfa" strokeWidth="1" />
              <polygon points="50,15 46,25 54,25" fill="#a78bfa" />
              <text x="15" y="150" fontSize="11" fill="#c4b5fd" transform="rotate(-90 15 150)">Intensivlik (nisbiy)</text>
              <line x1="50" y1="270" x2="680" y2="270" stroke="#a78bfa" strokeWidth="1" />
              <polygon points="685,270 675,266 675,274" fill="#a78bfa" />

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
              <text x="360" y="310" textAnchor="middle" fontSize="11" fill="#c4b5fd">Kimyoviy siljish δ (ppm)</text>

              {(() => {
                const [pMin, pMax] = ppmRange
                if (3.5 < pMin || 3.5 > pMax) return null
                const scale = 620 / (pMax - pMin)
                const x = 670 - (3.5 - pMin) * scale
                return (
                  <g>
                    <path d={`M ${x-20} 270 Q ${x-10} 265 ${x-5} 60 L ${x-2} 50 L ${x} 45 L ${x+2} 50 L ${x+5} 60 Q ${x+10} 265 ${x+20} 270`}
                          fill="url(#peakGradR)" opacity="0.85" />
                    <line x1={x} y1="270" x2={x} y2="45" stroke="#dc2626" strokeWidth="1" opacity="0.5" />
                    <text x={x} y="38" textAnchor="middle" fontSize="11" fill="#f87171" fontWeight="bold">δ = 3.5 ppm</text>
                    <text x={x} y="26" textAnchor="middle" fontSize="9" fill="#fca5a5">NH₃ (singlet, 15H)</text>
                    <line x1={x-30} y1="170" x2={x-30} y2="90" stroke="#22c55e" strokeWidth="1.5" />
                    <line x1={x-30} y1="90" x2={x+30} y2="90" stroke="#22c55e" strokeWidth="1.5" />
                    <text x={x-45} y="85" fontSize="9" fill="#4ade80" fontWeight="bold">15H</text>
                  </g>
                )
              })()}

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
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <div className="text-red-300 font-bold mb-1">🔴 Asosiy: 3.5 ppm</div>
              <div className="text-purple-200">NH₃ 15H singlet. Nitro bilan bir xil — ¹H NMR bu ikkalasini ajratmaydi.</div>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <div className="text-blue-300 font-bold mb-1">🔵 DMSO-d₅: 2.50 ppm</div>
              <div className="text-purple-200">Erituvchi qoldig'i, doim mavjud. Gottlieb 1997 jadvalidan.</div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
              <div className="text-yellow-300 font-bold mb-1">⚠️ Muhim</div>
              <div className="text-purple-200">Kuritilgan DMSO-d₆ zarur — H₂O nitritoni parchalantiradi.</div>
            </div>
          </div>
        </div>

        {/* LINKAGE IZOMER TAQQOSLASH */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔄</span> 6. Linkage izomer taqqoslash — [Co(NH₃)₅(X)]²⁺ seriyasi
          </h2>

          <div className="bg-red-900/30 rounded-lg p-4 border-l-4 border-red-400">
            <p className="text-red-100 text-sm leading-relaxed">
              <strong className="text-red-300">Nitrito vs Nitro:</strong> Ikkalasi bir xil kimyoviy formula (C₀H₁₅Cl₂CoN₆O₂) ga ega, lekin turli donor atomi orqali bog'lanadi.
              Δδ(¹⁵N) = 116 ppm va ¹⁷O signali (faqat nitritoda!) — <strong>eng aniq farqlash usullari</strong>.
              Boshqa spektroskopik metodlar (UV-Vis: 40 nm farq; IQ: 200 cm⁻¹ farq) kamroq aniq.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-red-500 bg-red-950/50">
                  <th className="py-3 px-3 text-red-400">Kompleks</th>
                  <th className="py-3 px-3 text-red-400">Ligand donor</th>
                  <th className="py-3 px-3 text-red-400">Rang</th>
                  <th className="py-3 px-3 text-red-400">δ(¹⁵N)</th>
                  <th className="py-3 px-3 text-red-400">δ(⁵⁹Co)</th>
                  <th className="py-3 px-3 text-red-400">Barqarorlik</th>
                  <th className="py-3 px-3 text-red-400">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.linkageComparison.map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${r.isCurrent ? "bg-red-900/20 border-red-500/50" : ""}`}>
                    <td className="py-3 px-3 font-mono text-red-300 font-bold text-xs">
                      {r.isCurrent && <span className="text-red-400 mr-1">⭐</span>}
                      {r.compound}
                    </td>
                    <td className="py-3 px-3 text-xs">{r.ligand}</td>
                    <td className="py-3 px-3 text-xs">{r.color}</td>
                    <td className="py-3 px-3 text-red-300 font-mono text-xs">{r.n15}</td>
                    <td className="py-3 px-3 text-red-300 font-mono text-xs">{r.co59}</td>
                    <td className="py-3 px-3 text-xs">{r.stability}</td>
                    <td className="py-3 px-3 text-xs text-purple-300">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DFT IZOMERLANISH YO'LLARI */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span> 7. Termik izomerlanish yo'llari (nitrito → nitro, DFT ωB97XD)
          </h2>

          <div className="bg-orange-900/30 rounded-lg p-4 border-l-4 border-orange-400">
            <p className="text-orange-100 text-sm leading-relaxed">
              <strong className="text-orange-300">Kinetik masala:</strong> Nitrito qanday nitroga aylanadi? PMC9077707 (2022) DFT hisoblari <strong>uch alternativ yo'l</strong>ni topdi.
              Ustun yo'l A — endo-nitrito oraliq bilan. Yo'l C esa <strong>photo-salient effektning</strong> asosi (endo↔exo konformer o'zgarishi).
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {COMPOUND.dftPathways.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePathway(p.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all text-left flex-1 min-w-[240px] ${
                  activePathway === p.id
                    ? "bg-orange-600/60 text-white border border-orange-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                <div className="font-bold text-xs">{p.name}</div>
                <div className="text-xs mt-1 opacity-80">To'siq: {p.barrier} {p.barrierUnit} {p.preferred ? "⭐" : ""}</div>
              </button>
            ))}
          </div>

          <div className="bg-purple-950/40 p-5 rounded-xl border border-purple-700/30">
            <h4 className="text-orange-400 font-bold mb-3">Reaksiya koordinatasi — energiya profili</h4>
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
              const points = steps.map((s, i) => ({
                x: padL + i * xStep,
                y: height - padB - (s.energy - minE) * yScale,
                s,
              }))
              return (
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                  <line x1={padL} y1={padT} x2={padL} y2={height - padB} stroke="#a78bfa" strokeWidth="1" />
                  <line x1={padL} y1={height - padB} x2={width - padR} y2={height - padB} stroke="#a78bfa" strokeWidth="1" />
                  <text x="20" y={height / 2} fontSize="10" fill="#c4b5fd" transform={`rotate(-90 20 ${height / 2})`}>E (kkal/mol)</text>
                  <text x={width / 2} y={height - 8} textAnchor="middle" fontSize="10" fill="#c4b5fd">Reaksiya koordinatasi</text>
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
                  {points.map((p, i) => (
                    <g key={i}>
                      {p.s.type === "TS" ? (
                        <polygon points={`${p.x - 6},${p.y + 4} ${p.x + 6},${p.y + 4} ${p.x},${p.y - 6}`} fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
                      ) : (
                        <circle cx={p.x} cy={p.y} r="5" fill="#22c55e" stroke="#16a34a" strokeWidth="1" />
                      )}
                      <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="9" fill={p.s.type === "TS" ? "#fca5a5" : "#86efac"} fontWeight="bold">
                        {p.s.energy.toFixed(2)}
                      </text>
                      <text x={p.x} y={height - padB + 15} textAnchor="middle" fontSize="8" fill="#c4b5fd">{p.s.label}</text>
                    </g>
                  ))}
                </svg>
              )
            })()}
            <div className="mt-3 flex gap-4 text-xs text-purple-300 flex-wrap">
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Minimum</div>
              <div className="flex items-center gap-1"><svg width="12" height="12"><polygon points="0,10 12,10 6,0" fill="#ef4444" /></svg> TS</div>
            </div>
          </div>

          {(() => {
            const path = COMPOUND.dftPathways.find(p => p.id === activePathway)
            if (!path) return null
            return (
              <div className={`rounded-xl p-4 ${path.preferred ? "bg-green-900/30 border border-green-500/40" : "bg-orange-900/30 border border-orange-500/40"}`}>
                <p className="text-sm text-purple-100 leading-relaxed">
                  <strong className={path.preferred ? "text-green-300" : "text-orange-300"}>
                    {path.preferred ? "✅ Ustun yo'l:" : "ℹ️ Muqobil yo'l:"}
                  </strong> {path.note}
                </p>
              </div>
            )
          })()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4">
              <h4 className="text-orange-300 font-bold text-sm mb-2">🔬 DFT metod parametrlari</h4>
              <div className="space-y-1 text-xs">
                {[
                  ["Funksional", COMPOUND.dftDetails.method],
                  ["Co basis", COMPOUND.dftDetails.basisSetForCo],
                  ["Erituvchi", COMPOUND.dftDetails.solventModel],
                  ["Manba", COMPOUND.dftDetails.source],
                ].map(([k, v], i) => (
                  <div key={i}><span className="text-purple-400">{k}:</span> <span className="text-orange-200 font-mono">{v}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4">
              <h4 className="text-orange-300 font-bold text-sm mb-2">📏 Bog' uzunliklari (DFT vs X-ray)</h4>
              <div className="space-y-1 text-xs">
                <div className="text-orange-200">{COMPOUND.dftDetails.coOBondLength}</div>
                <div className="text-orange-200">{COMPOUND.dftDetails.coNBondLength}</div>
                <div className="text-orange-200">{COMPOUND.dftDetails.isomerEnergyDiff}</div>
              </div>
              <div className="mt-3 bg-orange-950/50 p-2 rounded">
                <span className="text-orange-300 font-bold text-xs">⭐ Muhim:</span>
                <span className="text-purple-200 text-xs ml-1">{COMPOUND.dftDetails.significance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PHOTO-SALIENT EFFEKT — Naumov 2013 */}
        <div className="bg-pink-600/10 border border-pink-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">💥</span> 8. Photo-salient effekt — kristall sakraydi! (Naumov 2013)
          </h2>

          <div className="bg-pink-900/30 rounded-lg p-4 border-l-4 border-pink-400">
            <p className="text-pink-100 text-sm leading-relaxed">
              <strong className="text-pink-300">2013-yilgi kashfiyot:</strong> Panda & Naumov (Angew. Chem. 2013, 52, 9812) [Co(NH₃)₅(ONO)]Cl(NO₃) kristali
              UV yorug'lik ostida <strong className="text-pink-300">o'z o'lchamidan 100 martagacha balandlikka sakraydi</strong>! Bu koordinatsion kimyodagi photo-mexanik effektlarning eng
              g'aroyib namunasi. Aynan shu birikma (nitrito) uchun kashf etilgan — nitroga qarshi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-3">🔬 Kashfiyot va effekt</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-pink-950/50 rounded p-2">
                  <div className="text-xs text-purple-400 mb-1">Manba:</div>
                  <div className="text-pink-200 text-xs">{COMPOUND.photoSalient.discovery}</div>
                </div>
                <div className="bg-pink-950/50 rounded p-2">
                  <div className="text-xs text-purple-400 mb-1">Effekt:</div>
                  <div className="text-pink-200 text-xs">{COMPOUND.photoSalient.effect}</div>
                </div>
                <div className="bg-pink-950/50 rounded p-2">
                  <div className="text-xs text-purple-400 mb-1">Kvantli chiqim:</div>
                  <div className="text-pink-200 text-xs">{COMPOUND.photoSalient.quantum}</div>
                </div>
              </div>
            </div>

            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-3">⚙️ Mexanizm (4 bosqich)</h3>
              <div className="text-purple-200 text-xs leading-relaxed whitespace-pre-line">
                {COMPOUND.photoSalient.mechanism}
              </div>
            </div>
          </div>

          <div className="bg-pink-900/30 rounded-lg p-4 border-l-4 border-pink-400">
            <h4 className="text-pink-300 font-bold mb-2">🔥 Nima uchun aynan nitritoda?</h4>
            <div className="text-purple-200 text-sm leading-relaxed whitespace-pre-line">{COMPOUND.photoSalient.keyPoint}</div>
          </div>

          <div className="bg-pink-900/30 rounded-lg p-4">
            <h4 className="text-pink-300 font-bold mb-2">🎯 Zamonaviy qo'llanmalari</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-purple-200">
              {COMPOUND.photoSalient.applications.map((app, i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-pink-400">▸</span> {app}</li>
              ))}
            </ul>
          </div>

          <div className="bg-cyan-900/30 rounded-lg p-4 border-l-4 border-cyan-400">
            <h4 className="text-cyan-300 font-bold mb-2">🧲 YaMR bilan bog'liqlik</h4>
            <p className="text-purple-200 text-sm leading-relaxed">{COMPOUND.photoSalient.nmrConnection}</p>
          </div>
        </div>

        {/* TERMODINAMIKA VA KINETIKA */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🌡️</span> 9. Termodinamika va kinetika (Adell 1944, DSC + Eyring)
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
                  ["E_a", COMPOUND.thermodynamics.isomerization.activationEnergy],
                  ["k (298 K)", COMPOUND.thermodynamics.isomerization.rateConstant298],
                  ["t₁/₂", COMPOUND.thermodynamics.isomerization.halfLife],
                  ["Mexanizm", COMPOUND.thermodynamics.isomerization.mechanism],
                  ["Eyring", COMPOUND.thermodynamics.isomerization.eyring],
                  ["Teskari reaksiya", COMPOUND.thermodynamics.isomerization.reverseReaction],
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
            <h4 className="text-orange-300 font-bold mb-2">🔒 Metastabillik: nima uchun ushlanadi?</h4>
            <p className="text-purple-200 text-sm leading-relaxed mb-2">{COMPOUND.thermodynamics.metastability.why}</p>
            <p className="text-purple-200 text-sm mb-1"><strong className="text-orange-300">Barqarorlik sharoiti:</strong> {COMPOUND.thermodynamics.metastability.stabilityConditions}</p>
            <p className="text-purple-200 text-sm"><strong className="text-orange-300">Boshqa metastabil linkage:</strong> {COMPOUND.thermodynamics.metastability.comparison}</p>
          </div>
        </div>

        {/* STRUKTURAVIY PARAMETRLAR */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📏</span> 10. Strukturaviy parametrlar (X-ray + endo/exo)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Bog' uzunliklari (Å)</h3>
              <div className="space-y-2 text-xs">
                {[
                  ["Co–O(ONO)", COMPOUND.structural.bondLengths.coO_ONO],
                  ["Co–N(NH₃) trans-ONO", COMPOUND.structural.bondLengths.coN_NH3_trans],
                  ["Co–N(NH₃) cis-ONO", COMPOUND.structural.bondLengths.coN_NH3_cis],
                  ["O–N (ligand)", COMPOUND.structural.bondLengths.o_N_bond],
                  ["N=O terminal", COMPOUND.structural.bondLengths.n_O_terminal],
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
              <h3 className="text-green-400 font-bold mb-3">Bog' burchaklari va endo/exo</h3>
              <div className="space-y-2 text-xs">
                {[
                  ["Co–O–N", COMPOUND.structural.bondAngles.coON_angle],
                  ["O–N–O terminal", COMPOUND.structural.bondAngles.onO_terminal],
                  ["N–Co–N (cis)", COMPOUND.structural.bondAngles.N_Co_N_cis],
                  ["N–Co–N (trans)", COMPOUND.structural.bondAngles.N_Co_N_trans],
                  ["Dihedral ONO", COMPOUND.structural.bondAngles.dihedral_ONO],
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
            <h4 className="text-green-300 font-bold">⇄ Trans-effekt/influence</h4>
            <p className="text-purple-200 text-xs">{COMPOUND.structural.transEffect.definition}</p>
            <div><strong className="text-green-300 text-xs">Tartib:</strong> <span className="text-purple-200 text-xs font-mono">{COMPOUND.structural.transEffect.order}</span></div>
            <div><strong className="text-green-300 text-xs">Mexanizm:</strong> <span className="text-purple-200 text-xs">{COMPOUND.structural.transEffect.mechanism}</span></div>
            <div><strong className="text-green-300 text-xs">Oqibat:</strong> <span className="text-purple-200 text-xs">{COMPOUND.structural.transEffect.consequence}</span></div>
          </div>

          <div className="bg-pink-900/30 border border-pink-500/40 rounded-lg p-4">
            <h4 className="text-pink-300 font-bold mb-2">🔥 Endo/exo konformerlar (photo-salient uchun kritik!)</h4>
            <p className="text-purple-200 text-sm leading-relaxed">{COMPOUND.structural.endoExoStructure}</p>
          </div>

          <div className="bg-green-900/30 rounded-lg p-4">
            <p className="text-purple-200 text-sm"><strong className="text-green-300">🔗 H-bog'lar:</strong> {COMPOUND.structural.hydrogenBonding}</p>
          </div>
        </div>

        {/* LABORATORIYA TARTIBI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧪</span> 11. Laboratoriya tartibi (10 bosqich)
          </h2>
          <p className="text-purple-300 text-sm">
            ⚠️ <strong className="text-red-300">Kritik farq:</strong> Nitrito uchun har ekspermentdan oldin <strong>yangi namuna</strong> tayyorlash kerak (metastabil). Nitrito uchun standart protokol nitrodan farq qiladi: past T, qorong'i, amber probirka.
          </p>

          <div className="space-y-3">
            {COMPOUND.labProcedure.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveLabStep(i)}
                className={`rounded-xl p-4 cursor-pointer transition-all ${
                  activeLabStep === i
                    ? "bg-red-900/40 border-2 border-red-400"
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-red-500/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    activeLabStep === i ? "bg-red-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-red-400 font-bold text-sm">{step.title}</p>
                  </div>
                  <span className="text-[10px] text-purple-400 whitespace-nowrap">⏱ {step.time}</span>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-100 text-xs leading-relaxed mb-2">{step.desc}</p>
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      <div className="text-red-300 font-bold text-xs mb-1">📚 Nazariy asos:</div>
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
            <span className="text-2xl">⚠️</span> 12. Halaqit beruvchi omillar (nitrito uchun juda kritik!)
          </h2>
          <p className="text-purple-300 text-sm">
            Nitrito — metastabil izomer — shu sabab halaqit omillari uni tez nitroga aylantirishi mumkin. Har bir omilning ta'siri va yechimi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-red-400">Manba</th>
                  <th className="py-3 px-3 text-red-400">Ta'siri</th>
                  <th className="py-3 px-3 text-red-400">Jiddiylik</th>
                  <th className="py-3 px-3 text-red-400">Yechim</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.interferences.map((intf, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeInterference === i ? "bg-red-900/20" : ""
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-xs">{intf.source}</td>
                    <td className="py-3 px-3 text-xs">{intf.effect}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded text-[10px] whitespace-nowrap ${
                        intf.severity === "Yuqori" ? "bg-red-600/30 text-red-300"
                          : intf.severity === "O'rta" ? "bg-yellow-600/30 text-yellow-300"
                          : "bg-green-600/30 text-green-300"
                      }`}>{intf.severity}</span>
                    </td>
                    <td className="py-3 px-3 text-xs">{intf.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="text-red-300 font-bold text-sm mb-2 flex items-center gap-2">📚 Tanlangan omilning nazariy izohi:</div>
            <p className="text-xs text-purple-200 leading-relaxed">{COMPOUND.interferences[activeInterference].theory}</p>
          </div>
        </div>

        {/* KENGAYTIRUVCHI METODLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔬</span> 13. Kengaytiruvchi metodlar
          </h2>

          <div className="flex flex-wrap gap-2">
            {COMPOUND.advancedTechniques.map((tech, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(i)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTechnique === i
                    ? "bg-red-600/60 text-white border border-red-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name.split("(")[0].trim()}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-red-400 font-bold mb-3">{COMPOUND.advancedTechniques[activeTechnique].name}</h3>
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
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <div className="text-red-300 font-bold text-xs mb-1">📝 Amaliy misol:</div>
              <p className="text-purple-200 text-xs">{COMPOUND.advancedTechniques[activeTechnique].example}</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-pink-600/10 border border-red-500/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">✅</span> Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside text-sm">
            <li><strong className="text-red-300">Kompleks tabiati:</strong> Co³⁺ d⁶ past-spin (t₂g⁶ eg⁰), C₄ᵥ (yoki Cs endo/exo), diamagnit, Δ_o = 22 500 cm⁻¹ (nitrodan 1100 kichikroq). Qizil rang — 500 nm da d–d o'tishning natijasi.</li>
            <li><strong className="text-red-300">Metastabillik:</strong> Termodinamik jihatdan nitrodan 11.4 kJ/mol yuqori; xona haroratida t₁/₂ ≈ 5.5 soat. Har eksperimentdan oldin yangi namuna kerak.</li>
            <li><strong className="text-red-300">¹H NMR:</strong> Nitro bilan bir xil (3.5 ppm singlet, 15H) — farqlamaydi. ¹⁵N yoki ¹⁷O zarur.</li>
            <li><strong className="text-red-300">¹⁵N NMR (asosiy zond):</strong> δ = +528 ppm (nitrodan +116 ppm). Bu farq linkage izomerlarni ajratishning oltin standarti.</li>
            <li><strong className="text-red-300">¹⁷O NMR (uniq zond! ⭐):</strong> δ = +290 ppm (Co–O) va +570 ppm (N=O terminal). Faqat nitrito da mavjud — 100% aniq farqlash.</li>
            <li><strong className="text-red-300">⁵⁹Co NMR:</strong> δ = +8010 ppm (nitrodan −110 ppm). Kengroq chiziq (endo+exo aralashmasi).</li>
            <li><strong className="text-red-300">DFT (ωB97XD):</strong> Yo'l A (exo→endo→nitro) effektiv to'sig'i 25.31 kkal/mol (≈106 kJ/mol) — tajribaviy E_a (96 kJ/mol) bilan a'lo mos.</li>
            <li><strong className="text-red-300">Photo-salient effekt (Naumov 2013 🔥):</strong> UV yorug'lik ostida kristall 100× balandlikka sakraydi. Mexanizm: exo→endo (9.68 kkal/mol to'siq) → kristall stress → mexanik yorilish.</li>
            <li><strong className="text-red-300">Endo/exo konformerlar:</strong> X-ray: 85% exo, 15% endo. DFT: exo 2.4 kkal/mol barqarorroq. VT-NMR bilan alohida ajratish mumkin.</li>
            <li><strong className="text-red-300">Kinetik NMR:</strong> In-situ ¹⁵N bilan nitrito→nitro konversiyasini bevosita o'lchash mumkin — Eyring, Arrhenius parametrlari.</li>
          </ol>
        </div>

        {/* Pastki tugmalar */}
        <div className="flex flex-col md:flex-row justify-between gap-3 pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar/co-nh3-5-no2" className="px-6 py-3 border border-yellow-500 rounded-xl hover:bg-yellow-800/30 text-yellow-300 text-center">
            ← Nitro izomer (sariq)
          </Link>
          <button
            onClick={() => generatePDF({ setPdfGenerating, setPdfMessage })}
            disabled={pdfGenerating}
            className="px-6 py-3 bg-red-600/80 hover:bg-red-500 rounded-xl text-white font-semibold disabled:bg-red-800"
          >
            {pdfGenerating ? "⏳ PDF yaratilyapti..." : "📄 Ilmiy PDF ni yuklab olish"}
          </button>
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold text-center">
            Katalogga qaytish →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500 space-y-1">
          <p>© 2026 jdakimyo.uz  •  [Co(NH₃)₅(ONO)]Cl₂ YaMR moduli</p>
          <p>Manbalar: Jørgensen (1894), Werner (Nobel 1913), Adell (1944), Basolo & Pearson (1961), Naumov (2013), PMC9077707 (2022)</p>
        </div>
      </footer>
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PDF EKSPORT — [Co(NH₃)₅(ONO)]Cl₂ YaMR ilmiy hisobot
// ═══════════════════════════════════════════════════════════════════════════════
async function generatePDF({ setPdfGenerating, setPdfMessage }) {
  setPdfGenerating(true)
  setPdfMessage("📚 Font va tuzilma tayyorlanmoqda...")
  try {
    const pdfDoc = await PDFDocument.create()
    pdfDoc.registerFontkit(fontkit)

    let regularFont, boldFont, italicFont
    try {
      const [regBytes, boldBytes, italBytes] = await Promise.all([
        fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error("Regular"); return r.arrayBuffer() }),
        fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error("Bold"); return r.arrayBuffer() }),
        fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error("Italic"); return r.arrayBuffer() }),
      ])
      regularFont = await pdfDoc.embedFont(regBytes, { subset: true })
      boldFont = await pdfDoc.embedFont(boldBytes, { subset: true })
      italicFont = await pdfDoc.embedFont(italBytes, { subset: true })
    } catch (fontErr) {
      setPdfMessage("❌ Font yuklanmadi. public/fonts/ da DejaVuSans*.ttf bo'lishi kerak.")
      setPdfGenerating(false)
      return
    }

    const C = {
      purple: rgb(0.30, 0.11, 0.58),
      purpleLight: rgb(0.86, 0.78, 1.0),
      purpleMid: rgb(0.65, 0.55, 0.98),
      purpleSoft: rgb(0.51, 0.39, 0.71),
      purpleDark: rgb(0.12, 0.11, 0.29),
      textDark: rgb(0.08, 0.08, 0.16),
      textMuted: rgb(0.47, 0.47, 0.55),
      textGray: rgb(0.47, 0.47, 0.47),
      red: rgb(0.80, 0.20, 0.20),
      redDeep: rgb(0.70, 0.15, 0.15),
      redSoft: rgb(0.88, 0.35, 0.35),
      pink: rgb(0.88, 0.30, 0.50),
      pinkDeep: rgb(0.75, 0.20, 0.40),
      green: rgb(0.08, 0.47, 0.31),
      greenDark: rgb(0.12, 0.47, 0.27),
      blue: rgb(0.08, 0.31, 0.55),
      cyan: rgb(0.02, 0.42, 0.55),
      orange: rgb(0.90, 0.35, 0.10),
      orangeDeep: rgb(0.75, 0.28, 0.08),
      yellow: rgb(0.86, 0.55, 0),
      yellowDeep: rgb(0.71, 0.39, 0),
      grayLine: rgb(0.78, 0.78, 0.86),
      bgPurple: rgb(0.97, 0.96, 1.0),
      bgRed: rgb(1.0, 0.94, 0.94),
      bgPink: rgb(1.0, 0.94, 0.97),
      bgBlue: rgb(0.94, 0.98, 1.0),
      bgGreen: rgb(0.94, 1.0, 0.98),
      bgOrange: rgb(1.0, 0.96, 0.90),
      bgYellow: rgb(1.0, 0.98, 0.90),
      bgAbstract: rgb(0.96, 0.94, 1.0),
      white: rgb(1, 1, 1),
    }

    const PAGE_W = 595.28, PAGE_H = 841.89
    const MARGIN = 55
    const CONTENT_W = PAGE_W - 2 * MARGIN
    const FOOTER_Y = 30
    const HEADER_H = 65

    let page = pdfDoc.addPage([PAGE_W, PAGE_H])
    let y = PAGE_H - MARGIN
    let pageNum = 1

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
        if (measure(test, font, size) > maxW && cur) { lines.push(cur); cur = w }
        else cur = test
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
        `jdakimyo.uz  •  [Co(NH₃)₅(ONO)]Cl₂ YaMR hisoboti  •  ${new Date().toLocaleDateString("uz-UZ")}`,
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
    const checkPageBreak = (need) => { if (y - need < FOOTER_Y + 25) addNewPage() }
    const drawSectionHeader = (num, title, accentColor = C.red) => {
      checkPageBreak(45)
      page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: accentColor })
      safeText(`${num}. ${title}`, { x: MARGIN + 10, y: y - 14, size: 13, font: boldFont, color: accentColor, maxWidth: CONTENT_W - 15 })
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

    // SARLAVHA POLOSA
    page.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.purpleDark })
    safeText("JDA-KIMYO ILMIY BYULLETENI  •  YaMR spektroskopiya  •  Vol. 2, Son 2", {
      x: MARGIN, y: PAGE_H - 25, size: 9, font: regularFont, color: C.purpleLight, maxWidth: CONTENT_W * 0.7,
    })
    safeText(`Chop etilgan: ${new Date().toLocaleDateString("uz-UZ")}`, {
      x: PAGE_W - MARGIN, y: PAGE_H - 25, size: 9, font: regularFont, color: C.purpleLight, align: "right", maxWidth: CONTENT_W * 0.3,
    })
    page.drawLine({ start: { x: MARGIN, y: PAGE_H - 37 }, end: { x: PAGE_W - MARGIN, y: PAGE_H - 37 }, thickness: 1, color: C.purpleMid })
    safeText("Nitrito linkage izomer — photo-salient effekti", {
      x: MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86), maxWidth: CONTENT_W * 0.65,
    })
    safeText("DOI: 10.0000/jda-kimyo.2026.nmr.002", {
      x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86), align: "right", maxWidth: CONTENT_W * 0.3,
    })
    y = PAGE_H - HEADER_H - 30

    // TITLE
    drawCenteredText("[Co(NH₃)₅(ONO)]Cl₂ — YaMR Spektroskopiya Tahlili", y, 18, boldFont, C.textDark)
    y -= 26
    drawCenteredText(cleanText(COMPOUND.iupac), y, 11, italicFont, C.purpleSoft)
    y -= 18
    drawCenteredText(
      `Simmetriya: ${cleanText(COMPOUND.pointGroup)}  •  Co³⁺ d⁶ (LS)  •  Rangi: QIZIL  •  CAS: ${COMPOUND.casNumber}  •  M = ${COMPOUND.molarMass} g/mol`,
      y, 9, regularFont, C.textMuted
    )
    y -= 26

    // ANNOTATSIYA
    const abstract =
      `[Co(NH₃)₅(ONO)]Cl₂ — klassik linkage izomerizmning O-koordinatsiyalangan qizil izomeri. Co³⁺ d⁶ past-spinli konfiguratsiya, C₄ᵥ simmetriya (endo/exo konformerlari bilan). ` +
      `Termodinamik jihatdan metastabil (t₁/₂ ≈ 5.5 soat, 25°C) — barqaror nitroga aylanadi. YaMR to'rt yadro bo'yicha tahlil qilinadi: ` +
      `¹H (NH₃, δ = 3.5 ppm — nitrodan farqlamaydi), ¹⁵N (δ = +528 ppm, nitrodan +116 ppm), ¹⁷O (δ = +290 ppm — FAQAT bu izomerda!), va ⁵⁹Co (δ = +8010 ppm). ` +
      `¹⁷O NMR nitrito ni 100% aniq identifikatsiya qiladi. DFT hisoblari (ωB97XD/6-31+G(d,p)) izomerlanish yo'lini endo-nitrito oraliqli va exo→endo konformer o'zgarishini fiksatsiyalaydi. ` +
      `Bu birikma photo-salient effektning (Naumov 2013) yagona namunasi — UV nurlangan kristall 100 marta balandlikka sakraydi.`

    const absPadding = 12
    const absInnerW = CONTENT_W - 2 * absPadding
    const absLines = wrapText(cleanText(abstract), regularFont, 9.5, absInnerW)
    const boxH = 24 + absLines.length * 13 + 8
    checkPageBreak(boxH + 20)
    page.drawRectangle({ x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH, color: C.bgAbstract, borderColor: C.purpleMid, borderWidth: 1 })
    safeText("ANNOTATSIYA (ABSTRACT)", { x: MARGIN + absPadding, y: y - 16, size: 10, font: boldFont, color: C.purple, maxWidth: absInnerW })
    absLines.forEach((ln, i) => {
      page.drawText(ln, { x: MARGIN + absPadding, y: y - 32 - i * 13, size: 9.5, font: regularFont, color: C.textDark })
    })
    y -= boxH + 22

    let sec = 1

    // 1. Birikma identifikatsiyasi
    setPdfMessage("📊 Bo'lim 1: Identifikatsiya...")
    drawSectionHeader(sec++, "Birikma Identifikatsiyasi", C.red)
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
      ["Izomer turi", COMPOUND.isomerType],
    ]
    infoTable.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgRed : C.white, C.redDeep))
    y -= 12

    // 2. Kristall maydon
    setPdfMessage("⚛️ Bo'lim 2: Kristall maydon...")
    drawSectionHeader(sec++, "Kristall Maydon Nazariyasi", C.blue)
    const cf = COMPOUND.crystalField
    const cfTable = [
      ["Metall ioni", cf.metalIon],
      ["Elektron konfiguratsiya", cf.electronConfig],
      ["Spin holati", cf.spinState],
      ["Orbital to'ldirilishi", cf.orbitalOccupancy],
      ["Magnit moment", cf.magneticMoment],
      ["Δ_o (ligand maydon)", cf.crystalFieldSplitting],
      ["Racah B", cf.racahParameter],
      ["Nefelauxetik β", cf.nephelauxeticRatio],
      ["Juftlanish P", cf.pairingEnergy],
      ["CFSE", cf.cfse],
      ["Rang manbai", cf.colorOrigin],
      ["LMCT", cf.chargeTransfer],
    ]
    cfTable.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgBlue : C.white, C.blue))
    y -= 6
    drawParagraph(`Nitro bilan taqqoslash: ${cf.comparisonWithNitro}`, 9, C.textDark)
    y -= 6

    // 3. Simmetriya
    setPdfMessage("📐 Bo'lim 3: Simmetriya...")
    drawSectionHeader(sec++, "Simmetriya va C₄ᵥ (endo/exo)", C.purple)
    const symTable = [
      ["Nuqtaviy guruh", COMPOUND.symmetry.pointGroup],
      ["Guruh tartibi", `${COMPOUND.symmetry.order}`],
      ["Simmetriya elementlari", COMPOUND.symmetry.symmetryElements.join(", ")],
      ["Simmetriya pasayishi", COMPOUND.symmetry.descentInSymmetry],
      ["d-orbital pasayishi", COMPOUND.symmetry.dOrbitalReduction],
    ]
    symTable.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgPurple : C.white, C.purple))
    y -= 6
    drawParagraph(`Endo/exo konformerlar: ${COMPOUND.symmetry.endoExoConformers}`, 9, C.textDark)
    drawParagraph(`NMR ekvivalentlik: ${COMPOUND.symmetry.nmrEquivalence}`, 9, C.textDark)
    y -= 6

    // 4. ¹H NMR
    setPdfMessage("🧲 Bo'lim 4: ¹H NMR...")
    drawSectionHeader(sec++, "YaMR — ¹H Yadrosi (nitro bilan bir xil)", C.cyan)
    const h1 = COMPOUND.nmrTheory.h1
    const h1Table = [
      ["Yadro", h1.nucleus + ", " + h1.spin],
      ["γ", h1.gamma],
      ["Tabiiy tarqalish", h1.naturalAbundance],
      ["Larmor (9.4 T)", h1.larmor400],
      ["Kimyoviy siljish δ", h1.shift],
      ["Multipletlik", h1.multiplicity],
      ["Chiziq kengligi", h1.linewidth],
      ["T₁ relaksatsiya", h1.t1Relaxation],
      ["J bog'lanish", h1.coupling],
      ["Integratsiya", h1.integration],
      ["Erituvchi", h1.solvent],
    ]
    h1Table.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgBlue : C.white, C.cyan))
    y -= 6
    drawParagraph(`Fizik izoh: ${h1.whyThisShift}`, 9, C.textDark)
    drawParagraph(`⚠️ Cheklov: ${h1.keyDifference}`, 9, C.red)
    y -= 6

    // 5. ¹⁵N NMR
    setPdfMessage("🧲 Bo'lim 5: ¹⁵N NMR (linkage identifikatsiya)...")
    drawSectionHeader(sec++, "YaMR — ¹⁵N Yadrosi (Linkage Identifikatsiya Zondi)", C.cyan)
    const n15 = COMPOUND.nmrTheory.n15
    const n15Table = [
      ["Yadro", n15.nucleus + ", " + n15.spin],
      ["γ (manfiy)", n15.gamma],
      ["Tabiiy tarqalish", n15.naturalAbundance],
      ["Larmor (9.4 T)", n15.larmor400],
      ["Sezgirlik", n15.sensitivity],
      ["δ(ONO N)", n15.shift_ONO],
      ["δ(NH₃)", n15.shift_NH3],
      ["Referens", n15.referens],
      ["Chiziq kengligi", n15.linewidth],
      ["T₁", n15.t1Relaxation],
      ["CSA", n15.csa],
    ]
    n15Table.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgBlue : C.white, C.cyan))
    y -= 6
    drawParagraph(`⭐ Linkage farqlash: ${n15.linkageDiscrimination}`, 9, C.textDark)
    drawParagraph(`Fizik izoh: ${n15.whyThisShift}`, 9, C.textDark)
    y -= 6

    // 6. ¹⁷O NMR — UNIQ zond
    setPdfMessage("⭐ Bo'lim 6: ¹⁷O NMR (uniq zond)...")
    drawSectionHeader(sec++, "YaMR — ¹⁷O Yadrosi (Nitritoning UNIQ Zondi!)", C.red)
    const o17 = COMPOUND.nmrTheory.o17
    const o17Table = [
      ["Yadro", o17.nucleus],
      ["Spin (kvadrupol!)", o17.spin],
      ["γ (manfiy)", o17.gamma],
      ["Tabiiy tarqalish", o17.naturalAbundance],
      ["Larmor (9.4 T)", o17.larmor400],
      ["Kvadrupol Q", o17.quadrupoleMoment],
      ["Sezgirlik", o17.sensitivity],
      ["δ (asosiy)", o17.shift],
      ["Referens", o17.referens],
      ["Chiziq kengligi", o17.linewidth],
      ["T₁", o17.t1Relaxation],
      ["CSA", o17.csa],
    ]
    o17Table.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgRed : C.white, C.red))
    y -= 6
    drawParagraph(`🌟 Uniq: ${o17.keyPoint}`, 9, C.textDark)
    drawParagraph(`Fizik izoh: ${o17.whyThisShift}`, 9, C.textDark)
    drawParagraph(`Detektsiya: ${o17.detection}`, 9, C.textDark)
    y -= 6

    // 7. ⁵⁹Co NMR
    setPdfMessage("🧲 Bo'lim 7: ⁵⁹Co NMR...")
    drawSectionHeader(sec++, "YaMR — ⁵⁹Co Yadrosi (Metall Markazi)", C.cyan)
    const co59 = COMPOUND.nmrTheory.co59
    const co59Table = [
      ["Yadro", co59.nucleus + ", " + co59.spin],
      ["γ", co59.gamma],
      ["Tabiiy tarqalish", co59.naturalAbundance],
      ["Kvadrupol Q", co59.quadrupoleMoment],
      ["δ", co59.shift],
      ["Chiziq kengligi", co59.linewidth],
      ["T₁", co59.t1Relaxation],
      ["CQ (endo/exo)", "22 / 15 MHz"],
    ]
    co59Table.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgBlue : C.white, C.cyan))
    y -= 6
    drawParagraph(`Ramsey paramagnit hissasi: ${co59.whyThisShift}`, 9, C.textDark)
    drawParagraph(`Kvadrupol kengayishi (endo/exo): ${co59.quadrupolarBroadening}`, 9, C.textDark)
    y -= 6

    // 8. YaMR signallar
    setPdfMessage("📋 Bo'lim 8: YaMR signallar...")
    drawSectionHeader(sec++, "YaMR Signallar Ma'lumotlar Jadvali", C.orange)
    checkPageBreak(30)
    page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.bgOrange })
    const cols = [
      { label: "Yadro", w: 45 },
      { label: "Ligand", w: 110 },
      { label: "δ (ppm)", w: 55 },
      { label: "Mult.", w: 60 },
      { label: "J", w: 75 },
      { label: "Int.", w: 30 },
      { label: "Izoh", w: CONTENT_W - 375 },
    ]
    let xOff = MARGIN + 5
    cols.forEach(c => {
      safeText(c.label, { x: xOff, y: y - 12, size: 8.5, font: boldFont, color: C.orangeDeep, maxWidth: c.w - 5 })
      xOff += c.w
    })
    y -= 18
    COMPOUND.nmrSignals.forEach((s, i) => {
      const rowH = 32
      checkPageBreak(rowH + 2)
      const bgColor = s.uniqueToNitrito ? C.bgRed : (i % 2 === 0 ? C.bgOrange : C.white)
      page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor })
      xOff = MARGIN + 5
      const prefix = s.uniqueToNitrito ? "* " : ""
      const vals = [prefix + s.nucleus, s.ligand, String(s.shift), s.mult, s.J, s.integ, s.note]
      vals.forEach((v, j) => {
        const w = cols[j].w - 5
        const lines = wrapText(cleanText(v), regularFont, 7.5, w).slice(0, 3)
        lines.forEach((ln, li) => {
          page.drawText(ln, { x: xOff, y: y - 10 - li * 9, size: 7.5, font: j === 0 || j === 2 ? boldFont : regularFont, color: s.uniqueToNitrito && j === 0 ? C.red : C.textDark })
        })
        xOff += cols[j].w
      })
      y -= rowH
    })
    y -= 4
    drawParagraph("* belgi — signal faqat nitrito izomer uchun mavjud (nitroda yo'q).", 8, C.red)
    y -= 6

    // 9. Linkage taqqoslash
    setPdfMessage("🔄 Bo'lim 9: Linkage taqqoslash...")
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
      const bgColor = r.isCurrent ? C.bgRed : (i % 2 === 0 ? C.bgYellow : C.white)
      page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor })
      xOff = MARGIN + 5
      const prefix = r.isCurrent ? "* " : ""
      const vals = [prefix + r.compound, r.ligand, r.color, r.n15, r.co59, r.stability]
      vals.forEach((v, j) => {
        const w = linkCols[j].w - 5
        const lines = wrapText(cleanText(v), regularFont, 7.5, w).slice(0, 2)
        lines.forEach((ln, li) => {
          page.drawText(ln, { x: xOff, y: y - 10 - li * 9, size: 7.5, font: j === 0 ? boldFont : regularFont, color: r.isCurrent && j === 0 ? C.red : C.textDark })
        })
        xOff += linkCols[j].w
      })
      y -= rowH
    })
    y -= 6
    drawParagraph(`Δδ(¹⁵N) nitro vs nitrito ≈ 116 ppm. ¹⁷O signal faqat nitrito da mavjud — 100% aniq farqlash.`, 9, C.textDark)
    y -= 6

    // 10. Struktura
    setPdfMessage("📏 Bo'lim 10: Struktura...")
    drawSectionHeader(sec++, "Strukturaviy Parametrlar", C.green)
    const struct = COMPOUND.structural
    const structTable = [
      ["Co–O(ONO)", struct.bondLengths.coO_ONO],
      ["Co–N(NH₃) trans-ONO", struct.bondLengths.coN_NH3_trans],
      ["Co–N(NH₃) cis-ONO", struct.bondLengths.coN_NH3_cis],
      ["O–N", struct.bondLengths.o_N_bond],
      ["N=O terminal", struct.bondLengths.n_O_terminal],
      ["Co–O–N burchak", struct.bondAngles.coON_angle],
      ["O–N–O burchak", struct.bondAngles.onO_terminal],
      ["N–Co–N (cis)", struct.bondAngles.N_Co_N_cis],
      ["N–Co–N (trans)", struct.bondAngles.N_Co_N_trans],
      ["Dihedral ONO", struct.bondAngles.dihedral_ONO],
    ]
    structTable.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgGreen : C.white, C.green))
    y -= 6
    drawParagraph(`Endo/exo struktura: ${struct.endoExoStructure}`, 9, C.textDark)
    drawParagraph(`Trans-effekt: ${struct.transEffect.consequence}`, 9, C.textDark)
    drawParagraph(`H-bog'lar: ${struct.hydrogenBonding}`, 9, C.textDark)
    y -= 6

    // 11. Termodinamika
    setPdfMessage("🌡 Bo'lim 11: Termodinamika...")
    drawSectionHeader(sec++, "Termodinamika va Kinetika", C.orange)
    const th = COMPOUND.thermodynamics.isomerization
    const thTable = [
      ["Reaksiya", th.reaction],
      ["ΔH°", th.deltaH],
      ["ΔS°", th.deltaS],
      ["ΔG°(298 K)", th.deltaG298],
      ["K_eq", th.K],
      ["E_a", th.activationEnergy],
      ["k(298 K)", th.rateConstant298],
      ["t₁/₂", th.halfLife],
      ["Mexanizm", th.mechanism],
      ["Eyring", th.eyring],
    ]
    thTable.forEach((r, i) => drawTableRow(r[0], r[1], i % 2 === 0 ? C.bgOrange : C.white, C.orange))
    y -= 6
    drawParagraph(`Metastabillik: ${COMPOUND.thermodynamics.metastability.why}`, 9, C.textDark)
    drawParagraph(`Barqarorlik sharoiti: ${COMPOUND.thermodynamics.metastability.stabilityConditions}`, 9, C.textDark)
    y -= 6

    // 12. Photo-salient
    setPdfMessage("💥 Bo'lim 12: Photo-salient effekt...")
    drawSectionHeader(sec++, "Photo-salient Effekti (Naumov 2013)", C.pink)
    drawParagraph(`Manba: ${COMPOUND.photoSalient.discovery}`, 9, C.textDark)
    drawParagraph(`Effekt: ${COMPOUND.photoSalient.effect}`, 9, C.textDark)
    drawParagraph(`Mexanizm: ${COMPOUND.photoSalient.mechanism}`, 9, C.textDark)
    drawParagraph(`Kvantli chiqim: ${COMPOUND.photoSalient.quantum}`, 9, C.textDark)
    drawParagraph(`Nima uchun aynan nitritoda: ${COMPOUND.photoSalient.keyPoint}`, 9, C.textDark)
    drawParagraph(`Zamonaviy qo'llanmalari: ${COMPOUND.photoSalient.applications.join("; ")}`, 9, C.textDark)
    drawParagraph(`YaMR bilan bog'liq: ${COMPOUND.photoSalient.nmrConnection}`, 9, C.textDark)
    y -= 6

    // 13. DFT
    setPdfMessage("🧮 Bo'lim 13: DFT hisoblari...")
    drawSectionHeader(sec++, "DFT Izomerlanish Yo'llari (ωB97XD)", C.orange)
    drawParagraph(`Metod: ${COMPOUND.dftDetails.method}. Co basis: ${COMPOUND.dftDetails.basisSetForCo}. Erituvchi: ${COMPOUND.dftDetails.solventModel}. Manba: ${COMPOUND.dftDetails.source}.`, 9, C.textDark)
    y -= 4
    COMPOUND.dftPathways.forEach(path => {
      checkPageBreak(60)
      page.drawRectangle({
        x: MARGIN, y: y - 22, width: CONTENT_W, height: 22,
        color: path.preferred ? C.bgGreen : C.bgOrange,
        borderColor: path.preferred ? C.green : C.orange, borderWidth: 0.5,
      })
      safeText(`${path.preferred ? "* " : ""}${path.name}`, {
        x: MARGIN + 6, y: y - 14, size: 9.5, font: boldFont,
        color: path.preferred ? C.green : C.orange, maxWidth: CONTENT_W - 12,
      })
      y -= 26
      const stepsText = path.steps.map(s => `${s.label} (${s.energy.toFixed(2)})`).join(" → ")
      drawParagraph(`Bosqichlar: ${stepsText}. To'siq: ${path.barrier} ${path.barrierUnit}.`, 8.5, C.textDark, 10)
      drawParagraph(`Izoh: ${path.note}`, 8.5, C.textMuted, 10)
      y -= 4
    })
    drawParagraph(`Muhim: ${COMPOUND.dftDetails.significance}`, 9, C.textDark)
    y -= 6

    // 14. Halaqit
    setPdfMessage("⚠️ Bo'lim 14: Halaqit omillari...")
    drawSectionHeader(sec++, "Halaqit Beruvchi Omillar", C.red)
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

    // 15. Laboratoriya
    setPdfMessage("🧪 Bo'lim 15: Laboratoriya...")
    drawSectionHeader(sec++, "Laboratoriya Tartibi", C.green)
    COMPOUND.labProcedure.forEach(step => {
      checkPageBreak(60)
      page.drawRectangle({ x: MARGIN, y: y - 16, width: 20, height: 16, color: C.green })
      safeText(String(step.step), { x: MARGIN + 10, y: y - 12, size: 10, font: boldFont, color: C.white, align: "center", maxWidth: 18 })
      safeText(cleanText(step.title), { x: MARGIN + 26, y: y - 12, size: 10, font: boldFont, color: C.green, maxWidth: CONTENT_W - 100 })
      safeText(`⏱ ${step.time}`, { x: PAGE_W - MARGIN - 6, y: y - 12, size: 8, font: italicFont, color: C.textMuted, align: "right", maxWidth: 90 })
      y -= 20
      drawParagraph(step.desc, 8.5, C.textDark, 26)
      drawParagraph(`Nazariy asos: ${step.theory}`, 8, C.textMuted, 26)
      y -= 4
    })
    y -= 6

    // 16. Xulosalar
    setPdfMessage("✅ Bo'lim 16: Xulosalar...")
    drawSectionHeader(sec++, "Asosiy Xulosalar", C.red)
    const conclusions = [
      `Kompleks: Co³⁺ d⁶ past-spin, C₄ᵥ (endo/exo), diamagnit, Δ_o = 22 500 cm⁻¹, QIZIL rang (500 nm da yutish).`,
      `Metastabillik: ΔG° = −8.9 kJ/mol nitro tomonga; t₁/₂ ≈ 5.5 soat (25°C, qorong'i). Har eksperimentdan oldin yangi namuna kerak.`,
      `¹H NMR: 3.5 ppm singlet (15H) — nitro bilan bir xil, linkage izomer aniqlamaydi.`,
      `¹⁵N NMR: δ(ONO) = +528 ppm (nitrodan +116 ppm). Linkage identifikatsiya uchun asosiy zond.`,
      `¹⁷O NMR (uniq!): δ(Co–O) = +290 ppm; δ(N=O terminal) = +570 ppm. Faqat nitrito da mavjud — 100% aniq farqlash.`,
      `⁵⁹Co NMR: δ = +8010 ppm (nitrodan −110 ppm). Kengroq chiziq (endo+exo aralashmasi).`,
      `Termodinamika: ΔH° = −11.4 kJ/mol (ekzotermik); E_a = 96 kJ/mol (Adell 1944); Eyring ΔH‡ = 91 kJ/mol, ΔS‡ = −32 J/(mol·K).`,
      `DFT (ωB97XD): Yo'l A (exo→endo→nitro) 25.31 kkal/mol; yo'l B 28.91; yo'l C (exo↔endo) 9.68. Tajribaga a'lo mos.`,
      `Photo-salient effekt (Naumov 2013): UV yorug'lik ostida kristall 100× balandlikka sakraydi. Mexanizm exo→endo konformer o'zgarish.`,
      `Endo/exo: X-ray 85% exo, 15% endo; DFT: exo 2.4 kkal/mol barqarorroq. VT-NMR bilan ajratish mumkin.`,
      `Amaliy tavsiya: amber probirka, quruq DMSO-d₆, 0– 5°C hammom, tez o'lchash, in-situ kinetik NMR mumkin.`,
    ]
    conclusions.forEach((c, i) => {
      checkPageBreak(30)
      safeText(`${i + 1}.`, { x: MARGIN, y: y - 10, size: 9.5, font: boldFont, color: C.red, maxWidth: 20 })
      const lines = wrapText(cleanText(c), regularFont, 9, CONTENT_W - 20)
      lines.forEach((ln, li) => {
        checkPageBreak(12)
        page.drawText(ln, { x: MARGIN + 18, y: y - 10 - li * 12, size: 9, font: regularFont, color: C.textDark })
      })
      y -= 12 + lines.length * 12
    })

    addFooter()

    pdfDoc.setTitle("[Co(NH3)5(ONO)]Cl2 YaMR Tahlili")
    pdfDoc.setSubject("Nitrito-pentaamminkobalt(III) xlorid — YaMR spektroskopiya")
    pdfDoc.setAuthor("jdakimyo.uz — Koordinatsion kimyo portali")
    pdfDoc.setCreator("jdakimyo.uz PDF eksport")
    pdfDoc.setKeywords(["NMR", "YaMR", "linkage izomerizm", "nitrito", "photo-salient", "Co(III)"])

    setPdfMessage("💾 PDF saqlanmoqda...")
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Co-NH3-5-ONO-Cl2_YaMR_hisobot_${new Date().toISOString().slice(0, 10)}.pdf`
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
