"use client";

import Link from "next/link";
import { useState, useMemo, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// Fe(η⁵-C₅H₅)₂ — RAMAN SPEKTROSKOPIYA (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar:
//   • K. Nakamoto — Infrared and Raman Spectra of Inorganic and Coordination Compounds, 6th ed., Wiley (2009)
//   • E.R. Lippincott, R.D. Nelson — Vibrational Spectra of Ferrocene, Spectrochim. Acta 10, 307 (1958)
//   • L. Bencivenni et al. — J. Raman Spectrosc. (Fe(Cp)₂ RR va vibron analizi)
//   • D.M. Adams, W.S. Fernando — J. Chem. Soc., Dalton Trans. (1972) — sof kristall Raman
//   • P. Kealy, P. Pauson — Nature 168, 1039 (1951) — kashfiyot
//   • G. Wilkinson, R.B. Woodward — J. Am. Chem. Soc. 74, 2125 (1952) — sandvich strukturasi
//   • E.O. Fischer, W. Pfab — Z. Naturforsch. B 7, 377 (1952) — rentgen
//   • D.A. Long — The Raman Effect, Wiley (2002)
// Xususiyat: Raman nazariy jihatdan to'liq yoritilgan + PDF eksport
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "Fe(η<sup>5</sup>-C<sub>5</sub>H<sub>5</sub>)<sub>2</sub>",
  formulaPlain: "Fe(C5H5)2",
  iupac: "Bis(η⁵-siklopentadienil)temir(II)",
  commonName: "Ferrosen (Ferrocene)",
  molarMass: 186.03,
  casNumber: "102-54-5",
  color: "to'q sariq — qahva rangli kristall",
  structure: "Sandvich kompleks — Fe atomi ikki paralel Cp⁻ halqasi orasida",
  metalLigand: "Fe–Cp (η⁵-koordinatsiya)",
  spaceGroup:
    "P2₁/a (monoklinik, xona harorati) → tutash — Pnma (164 K dan past)",
  crystalSystem: "Monoklinik (xona haroratida)",
  pointGroup: "D₅d (staggered — asosiy holat) / D₅h (eclipsed — gaz fazasida)",
  bondLengthFeC: "2.045 Å",
  bondLengthCC: "1.440 Å",
  bondLengthCH: "1.104 Å",
  ringDistance: "3.32 Å (Cp···Cp)",
  bondAngle: "5·72° = 360° halqa; 108° C–C–C ichida",
  electronCount: "18 e⁻ (Fe⁰ ⇋ Fe²⁺ + 2Cp⁻, 6 + 2·6 = 18)",
  meltingPoint: "172.5 °C",
  sublimation: "~100 °C (vakuumda)",
  magnetism: "Diamagnit (S = 0, t₂g⁶ konfiguratsiyaning yopiq qobig'i)",
  discovery:
    "1951 — Kealy & Pauson (BrMgC₅H₅ + FeCl₃); struktura: Wilkinson & Fischer (1952); Nobel — 1973",
};

// ═══════════════════════════════════════════════════════════════════════════════
// RAMAN CHO'QQILARI (D₅d, staggered rotamer)
// Tanlash qoidasi: Γᵥⁱᵇ = 4A₁g + A₂g + 5E₁g + 6E₂g (Raman-faol) + 3A₁ᵤ + 4A₂ᵤ + 5E₁ᵤ + 6E₂ᵤ (IQ va silent)
// D₅d da: g → Raman faol, u → IQ faol (mutual exclusion — inversiya markazi mavjud)
// ═══════════════════════════════════════════════════════════════════════════════
const ramanPeaks = [
  {
    freq: 3110,
    absorbance: 0.55,
    intensityCode: 3,
    assignment: "ν(C–H)",
    assignment_uz: "Cp halqadagi aromatik C–H cho'zilish",
    intensity: "Kuchli",
    bond: "C–H (aromatik)",
    symmetry: "E₁g (Raman faol) + A₁g",
    forceConstant: "5.10 mdyn/Å",
    bondLength: "1.104 Å",
    region: "Aromatik C–H cho'zilish sohasi (3200–3000 sm⁻¹)",
    freeLigand: "Erkin C₅H₆ (siklopentadien): ν(C–H) ≈ 3075 sm⁻¹",
    coordShift:
      "η⁵-koordinatsiyada +30–40 sm⁻¹ ga siljiydi (aromatiklik ortadi)",
    theoryNote:
      "Cp⁻ halqasidagi barcha 5 ta C–H bog'lari ekvivalent. Aromatik xarakter tufayli chastota olefinik C=C–H (3080) va alifatik C–H (2900) oralig'ida. D₅d simmetriyasida C–H cho'zilishlari A₁g + E₁g + E₂g (Raman) va A₂ᵤ + E₁ᵤ (IQ) ga bo'linadi. Raman intensivligi katta — chunki π-elektron tizim qutblanuvchanlikni kuchli modulyatsiyalaydi.",
    diagnostic: "Aromatik Cp koordinatsiyasining bevosita ko'rsatkichi",
    animation: "cp-ch-stretch",
  },
  {
    freq: 1410,
    absorbance: 0.42,
    intensityCode: 2,
    assignment: "ν(C–C) as",
    assignment_uz: "Cp halqadagi asimmetrik C–C cho'zilish",
    intensity: "O'rta",
    bond: "C–C (Cp)",
    symmetry: "E₁g (Raman faol)",
    forceConstant: "6.80 mdyn/Å",
    bondLength: "1.440 Å",
    region: "Halqa cho'zilish sohasi",
    freeLigand: "Erkin C₅H₆: 1500 sm⁻¹ (C=C)",
    coordShift: "η⁵ da −90 sm⁻¹ (bog'lar tenglashuvi, delokalizatsiya)",
    theoryNote:
      "Cp⁻ halqasi 6 π-elektronli aromatik sistema (Hückel qoidasi bo'yicha 4n+2, n=1). Barcha C–C bog'lari teng uzunlikda — 1.44 Å (benzol 1.39 Å bilan yaqin). Bu tebranish halqaning asimmetrik pulsatsiyasidir. Rezonans Raman sharoitida (441 nm lazer) intensivligi 10–20× kuchayadi.",
    diagnostic: "Cp halqasining aromatik xarakterini tasdiqlaydi",
    animation: "cp-cc-asym",
  },
  {
    freq: 1250,
    absorbance: 0.28,
    intensityCode: 2,
    assignment: "δ(C–H) in-plane",
    assignment_uz: "C–H tekislik ichidagi egilish (bending)",
    intensity: "O'rta-zaif",
    bond: "C–H (in-plane)",
    symmetry: "E₂g (Raman faol)",
    forceConstant: "0.55 mdyn·Å/rad²",
    bondLength: "—",
    region: "Egilish sohasi",
    freeLigand: "Erkin Cp⁻: 1240 sm⁻¹",
    coordShift: "Deyarli o'zgarmagan (+10 sm⁻¹)",
    theoryNote:
      "H atomlarining Cp halqa tekisligida chayqalishi. E₂g modasi D₅d da tekisligi ichidagi harakatlarga mos keladi. Metall koordinatsiyasi H atomlariga bevosita ta'sir qilmaydi, shuning uchun chastota erkin Cp⁻ ga yaqin.",
    diagnostic: "Halqaning yassiligi va aromatikligini tasdiqlaydi",
    animation: "cp-ch-ip",
  },
  {
    freq: 1105,
    absorbance: 0.95,
    intensityCode: 4,
    assignment: 'ν₁(C–C) — halqa "nafas olishi"',
    assignment_uz: "Halqaning simmetrik nafas olish (breathing) tebranishi",
    intensity: "Juda kuchli",
    bond: "C–C (Cp)",
    symmetry: "A₁g (Raman faol, IQ noaktiv)",
    forceConstant: "7.20 mdyn/Å",
    bondLength: "1.440 Å",
    region: "Halqa cho'zilish sohasi",
    freeLigand: "Erkin Cp⁻: 1150 sm⁻¹",
    coordShift: "η⁵ da −45 sm⁻¹ (Fe→Cp back-donatsiya π* ni to'ldiradi)",
    theoryNote:
      "🔥 FERROSENNING ENG XARAKTERLI RAMAN CHO'QQISI. Bu tebranishda barcha 5 ta C–C bog' bir vaqtda cho'ziladi va qisqaradi — halqa nafas olayotgandek. A₁g simmetriyasida (butunlay simmetrik), inversiya markazi orqali gerade → faqat Ramanda faol, IQ da butunlay noaktiv (mutual exclusion). Qutblanuvchanlik simmetrik tarzda o'zgarganligi uchun (∂α/∂Q) maksimal → Raman intensivligi eng yuqori. Kristall va eritmada 1100–1110 sm⁻¹ oralig'ida barqaror.",
    diagnostic: "🌟 FERROSEN VA SANDVICH KOMPLEKSLARINING RAMAN BARMOQ IZI",
    animation: "ring-breathing",
  },
  {
    freq: 1055,
    absorbance: 0.35,
    intensityCode: 2,
    assignment: "δ(C–H) out-of-plane",
    assignment_uz: "C–H halqa tekisligidan tashqari egilish",
    intensity: "O'rta-zaif",
    bond: "C–H (o.o.p.)",
    symmetry: "E₁g (Raman faol)",
    forceConstant: "0.35 mdyn·Å/rad²",
    bondLength: "—",
    region: "Egilish sohasi",
    freeLigand: "Erkin Cp⁻: 995 sm⁻¹",
    coordShift: "η⁵ da +60 sm⁻¹ (Cp yassilik oshadi)",
    theoryNote:
      "H atomlarining halqa tekisligidan chiqishi (tashqariga chayqalishi). E₁g modasi. Ferrosenda H atomlari deyarli qat'iy halqa tekisligida yotadi (og'ish < 1°); bu Fe–Cp bog'lanishning tekislik-saqlovchi xususiyatidan kelib chiqadi.",
    diagnostic:
      "Cp halqasining Fe koordinatsiyasidagi qat'iy planarligini isbotlaydi",
    animation: "cp-ch-oop",
  },
  {
    freq: 815,
    absorbance: 0.22,
    intensityCode: 1,
    assignment: "γ(C–H)",
    assignment_uz: "C–H halqadan tashqari deformatsion",
    intensity: "Zaif",
    bond: "C–H",
    symmetry: "E₂g (Raman faol)",
    forceConstant: "0.28 mdyn·Å/rad²",
    bondLength: "—",
    region: "O.o.p. deformatsiya sohasi",
    freeLigand: "Erkin Cp⁻: 745 sm⁻¹",
    coordShift: "η⁵ da +70 sm⁻¹",
    theoryNote:
      "H atomlarining halqadan uzoqroqqa (yuqoriga/pastga) siljishi bilan bog'liq deformatsion moda. Fe koordinatsiyasi H atomlarining halqadan tashqariga siljishini cheklaydi — bu chastotani sezilarli oshiradi.",
    diagnostic:
      "Halqaning qat'iy tekisligini va koordinatsion cheklovni tasdiqlaydi",
    animation: "cp-gamma-ch",
  },
  {
    freq: 597,
    absorbance: 0.28,
    intensityCode: 2,
    assignment: "δ(ring–Fe–ring) tilt",
    assignment_uz: "Cp halqalarining Fe atrofida qiyshayishi (tilting)",
    intensity: "O'rta-zaif",
    bond: "Cp···Fe···Cp",
    symmetry: "E₁ᵤ (IQ) va E₁g (Raman)",
    forceConstant: "0.42 mdyn·Å/rad²",
    bondLength: "—",
    region: "Skelet deformatsiya sohasi",
    freeLigand: "—",
    coordShift: "Faqat kompleksda mavjud",
    theoryNote:
      "Ikkala Cp halqasining Fe–Cp geometrik o'qiga nisbatan qiyshayish (tilt) tebranishi. Cp₁–Fe–Cp₂ chizig'i biroz egiladi. E₁g modasi Raman faol. Bu moda sandvich kompleksining o'ziga xos ko'rsatkichi — erkin ligandda mavjud emas.",
    diagnostic: "Sandvich strukturasining bevosita isboti",
    animation: "ring-tilt",
  },
  {
    freq: 478,
    absorbance: 0.2,
    intensityCode: 2,
    assignment: "ν(Fe–Cp) as",
    assignment_uz: "Fe – Cp halqasi markazining asimmetrik cho'zilishi",
    intensity: "O'rta-zaif",
    bond: "Fe–Cp centroid",
    symmetry: "A₂ᵤ (IQ faol, Raman noaktiv rasman)",
    forceConstant: "2.10 mdyn/Å",
    bondLength: "1.66 Å (Fe–centroid)",
    region: "Metall–ligand cho'zilish sohasi",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "Fe atomining ikkita Cp halqasiga qarama-qarshi asimmetrik siljishi. D₅d da A₂ᵤ ga tegishli — rasman IQ faol, Raman da noaktiv. Ammo kristall panjara ta'siri va simmetriya buzilishi tufayli Raman spektrida ham zaif polosa sifatida ko'rinishi mumkin (site symmetry effect).",
    diagnostic: "Sandvich skeletining asimmetrik tebranishi (IQ da 478 sm⁻¹)",
    animation: "fe-cp-asym",
  },
  {
    freq: 309,
    absorbance: 0.85,
    intensityCode: 4,
    assignment: "ν(Fe–Cp) sym",
    assignment_uz: "Fe – Cp halqa markazining simmetrik cho'zilishi",
    intensity: "Juda kuchli",
    bond: "Fe–Cp centroid",
    symmetry: "A₁g (Raman faol, IQ noaktiv)",
    forceConstant: "2.35 mdyn/Å",
    bondLength: "1.66 Å (Fe–centroid)",
    region: "Metall–ligand cho'zilish sohasi (past chastotali)",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "🔬 FERROSENNING IKKINCHI XARAKTERLI RAMAN CHO'QQISI. Fe atomiga nisbatan ikkala Cp halqasining bir vaqtda simmetrik yaqinlashish–uzoqlashishi. A₁g simmetriya — inversiya markazi orqali gerade → Ramanda kuchli, IQ da butunlay noaktiv. k = 2.35 mdyn/Å — Fe–Cp bog'lanishning kuchliligini tasdiqlaydi (M–N bog'idan taxminan 25% mustahkam). Metallosen komplekslar oilasida: Cp₂V — 379, Cp₂Cr — 336, Cp₂Fe — 309, Cp₂Co — 285, Cp₂Ni — 260 sm⁻¹ (d elektronlar soni oshgani sayin — bog' zaiflashuvi).",
    diagnostic: "🌟 SANDVICH BOG'LANISHINING RAMAN DIAGNOSTIK CHO'QQISI",
    animation: "fe-cp-sym",
  },
  {
    freq: 179,
    absorbance: 0.35,
    intensityCode: 2,
    assignment: "δ(Cp–Fe–Cp) bend",
    assignment_uz: "Cp–Fe–Cp burchak deformatsiyasi",
    intensity: "O'rta-zaif",
    bond: "Cp–Fe–Cp skelet",
    symmetry: "E₂g (Raman faol)",
    forceConstant: "0.18 mdyn·Å/rad²",
    bondLength: "—",
    region: "Uzoq IQ / uzoq Raman sohasi",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "Cp₁–Fe–Cp₂ chizig'ining chetlanish tebranishi (ideal 180° dan). Uzoq chastotali soha (< 200 sm⁻¹) — maxsus notch filtri va yuqori sezgir CCD detektor talab qiladi (rezonans Raman spektrometri). Bu moda kristall panjaraga sezgir; qattiq holatda kengroq va yumshoq bo'ladi.",
    diagnostic: "Sandvich geometriyasining nozik burchak deformatsiyasi",
    animation: "cp-bend",
  },
  {
    freq: 116,
    absorbance: 0.18,
    intensityCode: 1,
    assignment: "ν(ring–ring) torsion",
    assignment_uz: "Halqalarning bir-biriga nisbatan burilishi (torsion)",
    intensity: "Zaif",
    bond: "Cp···Cp aylanish",
    symmetry: "A₁ᵤ (silent) / A₂g (Raman)",
    forceConstant: "~0.03 mdyn·Å/rad²",
    bondLength: "—",
    region: "Uzoq Raman (< 150 sm⁻¹)",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "Ikki Cp halqasining Fe–Cp o'qi atrofida bir-biriga qarshi aylanishi. Staggered (D₅d) ↔ eclipsed (D₅h) barrier ~4 kJ/mol — juda past. Xona haroratida halqalar deyarli erkin aylanadi (NMR bilan tasdiqlangan). Chastotasi juda past — faqat maxsus uzoq-IQ va Raman uskunalarida qayd etiladi.",
    diagnostic: "Halqalarning erkin aylanish barrierini xarakterlaydi",
    animation: "ring-torsion",
  },
];

// To'liq Raman spektri nuqtalari (Lorentzian formalar hosil qilish uchun)
const ramanSpectrum = [
  { freq: 3200, intensity: 0.03 },
  { freq: 3150, intensity: 0.1 },
  { freq: 3110, intensity: 0.55 },
  { freq: 3080, intensity: 0.35 },
  { freq: 3000, intensity: 0.08 },
  { freq: 2500, intensity: 0.02 },
  { freq: 2000, intensity: 0.02 },
  { freq: 1600, intensity: 0.05 },
  { freq: 1500, intensity: 0.12 },
  { freq: 1410, intensity: 0.42 },
  { freq: 1350, intensity: 0.1 },
  { freq: 1250, intensity: 0.28 },
  { freq: 1200, intensity: 0.15 },
  { freq: 1150, intensity: 0.3 },
  { freq: 1105, intensity: 0.95 },
  { freq: 1080, intensity: 0.4 },
  { freq: 1055, intensity: 0.35 },
  { freq: 1000, intensity: 0.15 },
  { freq: 900, intensity: 0.05 },
  { freq: 815, intensity: 0.22 },
  { freq: 700, intensity: 0.05 },
  { freq: 597, intensity: 0.28 },
  { freq: 500, intensity: 0.1 },
  { freq: 478, intensity: 0.2 },
  { freq: 400, intensity: 0.08 },
  { freq: 350, intensity: 0.2 },
  { freq: 309, intensity: 0.85 },
  { freq: 280, intensity: 0.3 },
  { freq: 250, intensity: 0.12 },
  { freq: 200, intensity: 0.15 },
  { freq: 179, intensity: 0.35 },
  { freq: 150, intensity: 0.15 },
  { freq: 116, intensity: 0.18 },
  { freq: 80, intensity: 0.05 },
  { freq: 50, intensity: 0.03 },
];

// Metallosenlar qatori — taqqoslash uchun (bir xil Cp₂M skelet, turli M markaz)
const metalloceneSeries = [
  {
    formula: "Cp₂V (Vanadosen)",
    metal: "V(II)",
    dConfig: "d³",
    nuFeCpSym: 379,
    nuFeCpAsym: 550,
    ringBreath: 1108,
    color: "binafsha",
    stability: "Havoda beqaror",
    current: false,
  },
  {
    formula: "Cp₂Cr (Xromosen)",
    metal: "Cr(II)",
    dConfig: "d⁴",
    nuFeCpSym: 336,
    nuFeCpAsym: 522,
    ringBreath: 1108,
    color: "qizil",
    stability: "Havoda beqaror",
    current: false,
  },
  {
    formula: "Cp₂Mn (Manganosen)",
    metal: "Mn(II)",
    dConfig: "d⁵ HS",
    nuFeCpSym: 220,
    nuFeCpAsym: 380,
    ringBreath: 1112,
    color: "kul rang",
    stability: "Havoda beqaror, polimer",
    current: false,
  },
  {
    formula: "Cp₂Fe (Ferrosen)",
    metal: "Fe(II)",
    dConfig: "d⁶ LS",
    nuFeCpSym: 309,
    nuFeCpAsym: 478,
    ringBreath: 1105,
    color: "to'q sariq",
    stability: "🌟 Juda barqaror (18 e⁻)",
    current: true,
  },
  {
    formula: "Cp₂Co (Kobaltosen)",
    metal: "Co(II)",
    dConfig: "d⁷",
    nuFeCpSym: 285,
    nuFeCpAsym: 465,
    ringBreath: 1101,
    color: "to'q binafsha",
    stability: "19 e⁻, oson oksidlanadi",
    current: false,
  },
  {
    formula: "Cp₂Ni (Nikelosen)",
    metal: "Ni(II)",
    dConfig: "d⁸",
    nuFeCpSym: 260,
    nuFeCpAsym: 355,
    ringBreath: 1110,
    color: "yashil",
    stability: "20 e⁻, kuchsiz bog'",
    current: false,
  },
  {
    formula: "Cp₂Ru (Rutenosen)",
    metal: "Ru(II)",
    dConfig: "d⁶ LS",
    nuFeCpSym: 330,
    nuFeCpAsym: 445,
    ringBreath: 1101,
    color: "rangsiz-oq",
    stability: "18 e⁻, ultra-barqaror",
    current: false,
  },
  {
    formula: "Cp₂Os (Osmosen)",
    metal: "Os(II)",
    dConfig: "d⁶ LS",
    nuFeCpSym: 353,
    nuFeCpAsym: 428,
    ringBreath: 1095,
    color: "oq",
    stability: "18 e⁻, juda barqaror",
    current: false,
  },
];

// Namuna tayyorlash usullari (Raman uchun)
const techniques = [
  {
    name: "Qattiq kristall (kukun)",
    description:
      "Ferrosen kristallari to'g'ridan-to'g'ri Raman mikroskopi ostiga qo'yiladi (1 mg yetarli). 785 nm yoki 532 nm lazer bilan tekshiriladi.",
    advantages: [
      "Namuna tayyorlashsiz (10 s)",
      "Namuna butunligicha saqlanadi",
      "Yuqori signal (kristallanish π-stacking kuchaytiradi)",
      "0.5–1 mg yetarli",
      "Kuchli halqa nafas olishi va ν(Fe–Cp) polosalari aniq",
    ],
    disadvantages: [
      "Kristall orientatsiyasi Raman intensivligiga ta'sir qiladi",
      "Yuqori quvvatda mahalliy qizish",
      "Fluoresensiya risk (agar aralashma bo'lsa)",
      "Uzoq chastotalarda notch filtri kerak",
    ],
    bestFor: "Standart Raman, uzoq chastotalarni o'rganish, ν(Fe–Cp) tahlili",
    freqRange: "50–4000 sm⁻¹",
    resolution: "1–2 sm⁻¹",
    samplePrep: "10 s – 1 daq",
  },
  {
    name: "Eritmada (CH₂Cl₂, benzol)",
    description:
      "Ferrosen CH₂Cl₂ yoki benzolda (10⁻² M) eritilib, kvarts kuvetada o'lchash. Eruvchan komplekslar uchun ideal.",
    advantages: [
      "Aniq chastotalar (kristall panjara ta'sirisiz)",
      "Miqdoriy o'lchash",
      "Nozik chiziqlar (yarim kenglik ~2 sm⁻¹)",
      "Konfiguratsiya D₅h ga yaqinroq",
    ],
    disadvantages: [
      "Erituvchining polosalari (CH₂Cl₂: 703, 285 sm⁻¹)",
      "Kam intensivlik (suyultirilgan)",
      "Erituvchi tanlashda ehtiyot (rezonans bo'lmasin)",
      "10⁻² M dan past — signal past",
    ],
    bestFor:
      "Aniq chastotalarni topish, konsentratsion tahlil, gaz-faza bilan taqqoslash",
    freqRange: "150–4000 sm⁻¹",
    resolution: "1 sm⁻¹",
    samplePrep: "2–5 daq",
  },
  {
    name: "Rezonans Raman (RR)",
    description:
      "441 nm (Ar⁺ lazer) yoki 457 nm ferrosenning d→π* elektron o'tishiga to'g'ri keladi. Rezonans holatda intensivlik 10³–10⁴× ortadi.",
    advantages: [
      "Ultra-yuqori sezgirlik (10⁻⁷ M gacha)",
      "Faqat xromofor tebranishlari kuchayadi",
      "Fluoresensiya bostiriladi",
      "Fe–Cp bog'lanish nozik xususiyatlari ochiladi",
      "Vibron holatlar tahlili",
    ],
    disadvantages: [
      "Namuna qizishi va parchalanishi ehtimoli",
      "Maxsus lazer (441 nm) va sozlash kerak",
      "Nostatsionar effektlarga sezgir",
      "Faqat rangli komplekslar uchun",
    ],
    bestFor:
      "Elektron holatlarni tebranish bilan bog'lash, ultra-past konsentratsiyalar",
    freqRange: "100–3500 sm⁻¹",
    resolution: "1–2 sm⁻¹",
    samplePrep: "5–15 daq",
  },
  {
    name: "SERS (Surface-Enhanced)",
    description:
      "Ferrosen Au yoki Ag nanozarralar sirtiga adsorbsiyalanadi. Plazmonik kuchayish 10⁶–10⁸× intensivlik beradi.",
    advantages: [
      "Ultra-yuqori sezgirlik (single-molecule level)",
      "Sensor ilovalari uchun ideal",
      "Ferrosenil-modifikatsiyalangan bioelektrokimyoviy sensorlar",
      "Namuna tayyorlash oson",
    ],
    disadvantages: [
      "Adsorbsiya orientatsiyasi chastotalarni siljitadi",
      "Nanozarralar sifati kritik",
      "Reproducibility past (10–30% xato)",
      "Elektromagnit va kimyoviy kuchayishlar aralashadi",
    ],
    bestFor:
      "Ferrosenil sensorlar, follow-up detektorlik, elektrokimyoviy monitoring",
    freqRange: "200–3200 sm⁻¹",
    resolution: "3–5 sm⁻¹",
    samplePrep: "20–30 daq",
  },
];

// Halaqit beruvchi omillar (Raman uchun)
const interferences = [
  {
    source: "Fluoresensiya (rangli aralashmalar)",
    freqRange: "Butun spektr, keng fon",
    effect:
      "Keng va kuchli fluoresensiya fon Raman signalini 10²–10³× kuchayib bosadi",
    severity: "Yuqori",
    solution:
      "1064 nm NIR lazer (FT-Raman) yoki 785 nm ga o'tish. Ferrosenni sublimatsiya orqali qayta tozalash. Fotoblanching (bir necha daqiqa lazer ta'siri fluoresensiyani kamaytiradi).",
  },
  {
    source: "Lazer namuna qizishi",
    freqRange: "Butun spektr, siljish",
    effect:
      "Yuqori quvvat (>50 mW) da ferrosen mahalliy qizib, chastotalar 2–5 sm⁻¹ pastga siljiydi",
    severity: "O'rta",
    solution:
      "Lazer quvvatini 5–20 mW ga tushirish. Aylanuvchi namuna stolchasi (spinning stage). Kriostat (77 K) yoki nam nitrogen bilan sovutish.",
  },
  {
    source: "Namunaning fotoxemik parchalanishi",
    freqRange: "Fe–Cp polosasi (309) susayishi",
    effect:
      "UV va ko'k lazerlarda Fe(II) → Fe(III) oksidlanishi va Cp radikalining chiqishi mumkin",
    severity: "O'rta",
    solution:
      "Ko'rinadigan/NIR lazer (532–785 nm) ishlatish. Vakuum yoki N₂ atmosferada o'lchash. Vaqt-ajratilgan Raman (pulse) rejim.",
  },
  {
    source: "Kristall orientatsiya effekti",
    freqRange: "A₁g va E₁g intensivliklari",
    effect:
      "Bitta kristallda polarizatsiyaga qarab ν(Fe–Cp) va halqa nafasi intensivliklari 3–5× farq qiladi",
    severity: "O'rta",
    solution:
      "Kukun (mikrokristall) namunasi tayyorlash. 3–5 nuqtadan spektr olib, o'rtacha qiymat. Aylanuvchi namuna.",
  },
  {
    source: "Reley sochilishi (elastik)",
    freqRange: "< 100 sm⁻¹ (uzoq Raman)",
    effect:
      "Elastik sochilish kuchli fon 100 sm⁻¹ dan pastdagi ν(ring–Fe–ring) modasini bekitib qo'yadi",
    severity: "Yuqori",
    solution:
      "Volume Bragg Grating (VBG) yoki bir necha ketma-ket notch filtri. Triple monoxromator (uzoq Raman spektrometri). 5 sm⁻¹ gacha yaqinlashish imkoni.",
  },
  {
    source: "Erituvchi polosalari",
    freqRange: "285, 703 (CH₂Cl₂); 992 (C₆H₆)",
    effect:
      "Erituvchining kuchli Raman polosalari analit signalini qoplashi mumkin",
    severity: "O'rta",
    solution:
      "Deuterlangan erituvchilar: CD₂Cl₂, C₆D₆ — polosalari 20–30% pastroqqa siljiydi. Boshqa erituvchi tanlash (CS₂, THF).",
  },
  {
    source: "Zichlik va nam KBr",
    freqRange: "Butun spektr",
    effect:
      "Suv adsorbsiyasi ν(O–H) 3400 sm⁻¹ va zichlik oshirishi Reley sochilishini kuchaytiradi",
    severity: "Past",
    solution:
      "Namunani vakuum-eksikatorda saqlash. KBr yoki tabletka usulini QO'LLAMASLIK — Raman uchun kerak emas.",
  },
  {
    source: "Ferrisenium (Fe(III)) aralashmasi",
    freqRange: "1105, 309 sm⁻¹ susayishi",
    effect:
      "Havoda oksidlanish natijasida ~1% ferrisenium ionlari halqa aromatikligini buzadi va chastotalar siljiydi",
    severity: "O'rta",
    solution:
      "Yangi tayyorlangan ferrosen. Sublimatsiya orqali tozalash. N₂ atmosferada saqlash. Aralashma testi: ESR yoki cyclic voltammetry (Fe²⁺/Fe³⁺: +0.4 V vs. Fc).",
  },
];

// Guruh nazariyasi ma'lumotlari
const groupTheoryData = {
  pointGroup: "D₅d (staggered rotamer, xona haroratida kristall)",
  alternativeGroup: "D₅h (eclipsed rotamer, gaz fazasida)",
  order: 20,
  operations: "E, 2C₅, 2C₅², 5C₂, i, 2S₁₀, 2S₁₀³, 5σd",
  totalModes: "3N − 6 = 3(21) − 6 = 57 ta normal moda",
  reducibleRep: "Γᵥⁱᵇ = 4A₁g + A₂g + 5E₁g + 6E₂g + 3A₁ᵤ + 4A₂ᵤ + 5E₁ᵤ + 6E₂ᵤ",
  ramanActive: "A₁g (4), E₁g (5), E₂g (6) — jami 15 tur",
  irActive: "A₂ᵤ (4), E₁ᵤ (5) — jami 9 tur",
  silent: "A₂g (1), A₁ᵤ (3), E₂ᵤ (6) — ikkalasida ham noaktiv",
  mutualExclusion:
    "D₅d da inversiya markazi (i) mavjud → gerade (g) faqat Raman, ungerade (u) faqat IQ",
  keyModes:
    "ν(Fe–Cp) sym: 309 (A₁g) va asym: 478 (A₂ᵤ); halqa nafas olishi: 1105 (A₁g)",
};

// Kuch konstantasi taqqoslashi
const forceConstantExamples = [
  { bond: "C≡O (Fe(CO)₅)", k: 17.2, freq: 2014, note: "Uch bog', karbonil" },
  { bond: "C=C (etilen)", k: 9.6, freq: 1623, note: "Ikki bog'" },
  { bond: "C–H (aromatik)", k: 5.1, freq: 3110, note: "Ferrosen, aromatik" },
  { bond: "C–C (benzol)", k: 7.6, freq: 992, note: "Aromatik" },
  {
    bond: "C–C (Cp ferrosen)",
    k: 7.2,
    freq: 1105,
    note: "🔥 Aromatik Cp, halqa nafasi",
  },
  { bond: "C–C (alkan)", k: 4.5, freq: 1000, note: "Yagona bog'" },
  {
    bond: "Fe–Cp (ferrosen)",
    k: 2.35,
    freq: 309,
    note: "🔬 M–ligand, sandvich",
  },
  { bond: "Fe–N (Fe(CN)₆³⁻)", k: 2.1, freq: 390, note: "Sianido kompleks" },
  { bond: "Ru–Cp (rutenosen)", k: 2.65, freq: 330, note: "Mustahkamroq, 5d³" },
  { bond: "Ni–Cp (nikelosen)", k: 1.55, freq: 260, note: "Zaifroq, 20 e⁻" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function FerroseeRaman() {
  const [activePeak, setActivePeak] = useState(3); // 1105 sm⁻¹ (halqa nafasi) default
  const [freqSlider, setFreqSlider] = useState(1105);
  const [activeTechnique, setActiveTechnique] = useState(0);
  const [activeInterference, setActiveInterference] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [rotamerView, setRotamerView] = useState("staggered"); // staggered | eclipsed
  const [pdfSections, setPdfSections] = useState({
    identification: true,
    theory: true,
    peaks: true,
    spectrum: true,
    groupTheory: true,
    forceConstant: true,
    metallocenes: true,
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
          `JDA-Kimyo Raman Tahlili  •  Fe(η⁵-C₅H₅)₂ (Ferrosen)  •  ${new Date().toLocaleDateString("uz-UZ")}`,
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
        "JDA-KIMYO ILMIY BYULLETENI  •  Raman Spektroskopiya  •  Vol. 2, Son 3",
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
        "Metallosen Kimyosi — Sandvich Kompleks Tebranish Spektroskopiyasi",
        {
          x: MARGIN,
          y: PAGE_H - 52,
          size: 8,
          font: regularFont,
          color: rgb(0.71, 0.71, 0.86),
          maxWidth: CONTENT_W * 0.65,
        },
      );
      safeText("DOI: 10.0000/jda-kimyo.raman.2026.001", {
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
        `Fe(η⁵-C₅H₅)₂ — Raman Spektroskopik Tahlili`,
        y,
        20,
        boldFont,
        C.textDark,
      );
      y -= 28;
      drawCenteredText(
        "Bis(η⁵-siklopentadienil)temir(II)  •  «Ferrosen»",
        y,
        12,
        italicFont,
        C.purpleSoft,
      );
      y -= 20;
      drawCenteredText(
        `Simmetriya: D₅d (kristall) / D₅h (gaz)  •  Konfiguratsiya: d⁶ LS  •  Diamagnit  •  18 e⁻  •  M = 186.03 g/mol`,
        y,
        9,
        regularFont,
        C.textMuted,
      );
      y -= 28;

      // ─── ANNOTATSIYA ─────────────────────────────────────
      const abstract =
        `Ferrosen Fe(η⁵-C₅H₅)₂ — organometall kimyoning fundamental namunasi bo'lib, 1951-yilda Kealy & ` +
        `Pauson tomonidan sintez qilingan va 1952-yilda Wilkinson, Woodward hamda Fischer tomonidan sandvich ` +
        `strukturasi tasdiqlangan. Ushbu ishda uning Raman spektri 50–3200 sm⁻¹ diapazonda batafsil tahlil ` +
        `qilingan. Diagnostik cho'qqilar: halqa "nafas olishi" ν₁(C–C) = 1105 sm⁻¹ (A₁g, ferrosen barmoq izi); ` +
        `νₛ(Fe–Cp) = 309 sm⁻¹ (A₁g, sandvich bog'lanish); ν(C–H) = 3110 sm⁻¹ (aromatik); δ(ring–Fe–ring) = 597; ` +
        `ν(ring–ring) torsion = 116 sm⁻¹. D₅d simmetriyasi va inversiya markazi mavjudligi tufayli mutual ` +
        `exclusion qat'iy amal qiladi: gerade (g) modalar faqat Raman, ungerade (u) faqat IQ da faol. ` +
        `Kuch konstantasi k(Fe–Cp) = 2.35 mdyn/Å va k(C–C, Cp) = 7.20 mdyn/Å — sandvich bog'lanishning ` +
        `18-elektron qoidasidan kelib chiquvchi ultra-barqarorligini tasdiqlaydi.`;
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
          ["Formula", "Fe(η⁵-C₅H₅)₂"],
          ["IUPAC nomi", "Bis(η⁵-siklopentadienil)temir(II)"],
          ["An'anaviy nomi", "Ferrosen (Ferrocene)"],
          ["CAS raqami", "102-54-5"],
          ["Molar massa", "186.03 g/mol"],
          ["Rangi", "To'q sariq–qahva rangli kristall"],
          ["Erish nuqtasi", "172.5 °C"],
          ["Kristall tizim", "Monoklinik (P2₁/a, xona harorati)"],
          ["Nuqtaviy guruh", "D₅d (staggered) / D₅h (gaz)"],
          ["Koordinatsiya", "η⁵ (pentahapto), 6 e⁻ har Cp dan"],
          ["Metall ioni", "Fe²⁺ (d⁶ LS, t₂g⁶)"],
          ["Elektronlar soni", "18 e⁻ (18-elektron qoidasi)"],
          ["Fe–C bog' uzunligi", "2.045 Å (XRD, o'rtacha)"],
          ["Fe–centroid", "1.66 Å"],
          ["Cp···Cp masofa", "3.32 Å (parallel)"],
          ["Kashfiyot", "1951 — Kealy & Pauson; Nobel 1973"],
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
          "Raman spektroskopiya monoxromatik yorug'likning molekulyar tebranishlar bilan noelastik sochilishiga asoslangan. Chandrasekhara Venkata Raman 1928-yilda kashf etgan (Nobel 1930). Molekulaga tushuvchi foton (hν₀) molekulaning qutblanuvchanligini modulyatsiyalab, energiyasi h(ν₀ ± νᵥ) bo'lgan foton sochiladi:";
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
          "Stokes sochilish: ν = ν₀ − νᵥ (foton energiya berdi, molekula qo'zg'alanadi) — asosiy Raman signali.",
          C.bgBlue,
          C.blue,
          C.textDark,
        );
        drawInfoBox(
          "Anti-Stokes: ν = ν₀ + νᵥ (foton energiya oldi, molekula asos holatga tushdi) — kuchsiz, harorat bilan ortadi.",
          C.bgBlue,
          C.blue,
          C.textDark,
        );
        drawInfoBox(
          "Raman tanlash qoidasi: (∂α/∂Q)₀ ≠ 0 — normal koordinata Q bo'yicha qutblanuvchanlik tenzori o'zgarishi zarur. Bu shart IQ tanlash qoidasidan (dipol moment) mustaqil — shu sababli IQ va Raman komplementar.",
          C.bgBlue,
          C.blue,
          C.textDark,
        );
        const t2 =
          "Ferrosen (21 atom, chiziqsiz) uchun 3N−6 = 57 ta normal tebranish moda mavjud. D₅d simmetriyasi ularni 4A₁g + A₂g + 5E₁g + 6E₂g (Raman-faol) + 3A₁ᵤ + 4A₂ᵤ + 5E₁ᵤ + 6E₂ᵤ (IQ va silent) ga bo'ladi. Inversiya markazi (i) tufayli mutual exclusion qoidasi qat'iy ishlaydi: hech qaysi tebranish moda ham IQ, ham Raman da faol bo'la olmaydi.";
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
        drawSectionHeader(sectionNum++, "Guruh Nazariyasi — D₅d Simmetriyasi");
        drawTableRow("Nuqtaviy guruh", groupTheoryData.pointGroup);
        drawTableRow(
          "Alternativ (gaz fazasida)",
          groupTheoryData.alternativeGroup,
        );
        drawTableRow("Guruh tartibi", `${groupTheoryData.order}`);
        drawTableRow("Simmetriya operatsiyalari", groupTheoryData.operations);
        drawTableRow("Umumiy tebranish modalar", groupTheoryData.totalModes);
        drawTableRow("Tebranish tasviri", groupTheoryData.reducibleRep);
        drawTableRow("Raman-faol", groupTheoryData.ramanActive);
        drawTableRow("IQ-faol", groupTheoryData.irActive);
        drawTableRow("Silent modalar", groupTheoryData.silent);
        drawTableRow("Mutual exclusion", groupTheoryData.mutualExclusion);
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
          "Hooke qonuni ν̃ = (1/2πc)·√(k/μ) asosida bog' kuch konstantasi (k) tebranish chastotasiga proporsional. Quyidagi jadval ferrosenning bog'larini boshqa bog' turlari bilan taqqoslaydi:",
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

      // ─── 6. METALLOSENLAR QATORI ─────────────────────────
      if (pdfSections.metallocenes) {
        drawSectionHeader(
          sectionNum++,
          "Metallosenlar Qatori — Cp₂M Taqqoslashi",
        );
        drawWrappedText(
          "Har xil markaziy metall bilan Cp₂M metallosenlari qatori. d elektronlar soni ortishi bilan Fe–Cp bog'lanish zaiflashadi va ν(M–Cp) chastotasi pasayadi. Ferrosen (d⁶ LS, 18 e⁻) — bu qatordagi eng barqaror birikma:",
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
        metalloceneSeries.forEach((m, i) => {
          const highlight = m.current;
          drawTableRow(
            m.formula,
            `M: ${m.metal}  •  ${m.dConfig}  •  νₛ(M–Cp): ${m.nuFeCpSym}  •  Ring: ${m.ringBreath}  •  ${m.stability}`,
            highlight ? C.bgOrange : i % 2 === 0 ? C.bgSky : C.white,
            highlight ? C.orangeDeep : C.skyDeep,
          );
        });
        y -= 15;
      }

      // ─── 7. NAMUNA TAYYORLASH ────────────────────────────
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

      // ─── 8. HALAQIT OMILLARI ─────────────────────────────
      if (pdfSections.interferences) {
        drawSectionHeader(
          sectionNum++,
          "Raman Tahliliga Halaqit Beruvchi Omillar",
        );
        drawWrappedText(
          "Ferrosen Raman spektroskopiyasida sifatli spektr olish uchun bir qator halaqit beruvchi omillarni bartaraf etish zarur:",
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
          const sevColor =
            iv.severity === "Yuqori"
              ? C.red
              : iv.severity === "O'rta"
                ? C.orange
                : C.green;
          const sevBg =
            iv.severity === "Yuqori"
              ? C.bgRed
              : iv.severity === "O'rta"
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

      // ─── 9. XULOSALAR ────────────────────────────────────
      if (pdfSections.conclusions) {
        drawSectionHeader(sectionNum++, "Asosiy Xulosalar");
        const conclusions = [
          'Ferrosen Fe(η⁵-C₅H₅)₂ ning Raman spektri D₅d simmetriyaga to\'liq mos keladi. A₁g vakolatiga tegishli halqa "nafas olishi" (1105 sm⁻¹) va νₛ(Fe–Cp) (309 sm⁻¹) — sandvich kompleksining bevosita barmoq izlari.',
          "Mutual exclusion qoidasi (D₅d inversiya markazi tufayli) qat'iy amal qiladi: gerade (g) modalar faqat Raman, ungerade (u) faqat IQ da faol. Bu qoida sandvich strukturasining o'ziga xosligini isbotlaydi.",
          "1105 sm⁻¹ dagi A₁g halqa nafasi — barcha sandvich metallosenlar oilasining Raman diagnostik cho'qqisi. Metall almashsa (Ru, Os, V, Ni) chastota faqat ±10 sm⁻¹ o'zgaradi — chunki bu tebranish Cp halqalarining o'zida ro'y beradi.",
          "309 sm⁻¹ dagi νₛ(Fe–Cp) simmetrik cho'zilishi metall almashishi bilan sezilarli o'zgaradi (Cp₂V: 379, Cp₂Fe: 309, Cp₂Ni: 260 sm⁻¹). d elektronlar soni oshgani sayin M–Cp bog'i zaiflashadi.",
          "Kuch konstantalari: k(Fe–Cp) = 2.35 mdyn/Å va k(C–C, Cp) = 7.20 mdyn/Å. Bu qiymatlar 18-elektron qoidasidan kelib chiquvchi sandvich bog'lanishning ultra-barqarorligini tasdiqlaydi (ferrosen 500 °C gacha atmosferada barqaror).",
          "Rezonans Raman (441 nm) usuli ferrosen d→π* elektron o'tishiga to'g'ri keladi va halqa hamda M–Cp modalari intensivligini 10³–10⁴× kuchaytiradi. Bu vibron holatlar va Fe(II)/Fe(III) redoks o'zgarishlarini o'rganish uchun eng sezgir usul.",
          "Ferrosen 1951-yilda kashf etilgan (Kealy & Pauson), 1952-yilda sandvich strukturasi tasdiqlangan (Wilkinson, Woodward, Fischer). 1973-yilda kompleks kimyoni tanigan Nobel mukofoti berilgan. Raman spektroskopiya bu tarixiy strukturaning tebranish darajasidagi to'liq tasdig'idir.",
          "Uzoq Raman sohasi (< 200 sm⁻¹) da halqalar torsion (116 sm⁻¹) va Cp–Fe–Cp burchak deformatsiyasi (179 sm⁻¹) polosalari ferrosenning kristall panjaraga sezgirligini xarakterlaydi. Bu modalar staggered (D₅d) ↔ eclipsed (D₅h) rotamer barrieri (~4 kJ/mol) haqida ma'lumot beradi.",
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
      pdfDoc.setTitle(`Fe(η⁵-C₅H₅)₂ Raman Spektroskopik Tahlili`);
      pdfDoc.setSubject("Ferrosen — Raman spektroskopiya (JDA-Kimyo)");
      pdfDoc.setAuthor("JDA-Kimyo Research Platform");
      pdfDoc.setCreator("JDA-Kimyo Raman Tahlil Moduli");
      pdfDoc.setKeywords([
        "Ferrocene",
        "Fe(Cp)2",
        "sandwich",
        "Raman spectroscopy",
        "D5d",
        "metallocene",
      ]);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Ferrosen_Raman_tahlili_${new Date().toISOString().slice(0, 10)}.pdf`;
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
              <span className="text-sky-400 font-semibold">Ferrosen</span>
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
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber} •
                  18 e⁻
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-sky-900/30 border border-sky-700/50 text-sky-400 text-[10px] uppercase tracking-wide">
                    D₅d simmetriya
                  </span>
                  <span className="px-2 py-1 rounded bg-sky-900/30 border border-sky-700/50 text-sky-400 text-[10px] uppercase tracking-wide">
                    ν(Fe–Cp) 309
                  </span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">
                    Halqa nafasi 1105
                  </span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">
                    d⁶ LS diamagnit
                  </span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">
                    Nobel 1973
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
              Ferrosen Fe(η⁵-C₅H₅)₂ ning Raman spektroskopik tahlilining ilmiy
              hisoboti. Ilmiy maqola uslubida, DejaVu Sans fonti bilan, A4
              formatida chop etiladi.
            </p>

            <div className="space-y-2 mb-6">
              {[
                {
                  key: "identification",
                  label: "1. Birikma identifikatsiyasi",
                  desc: "Formula, CAS, molar massa, kashfiyot tarixi",
                },
                {
                  key: "theory",
                  label: "2. Nazariy asos",
                  desc: "Raman effekti, Stokes/anti-Stokes, tanlash qoidasi",
                },
                {
                  key: "peaks",
                  label: "3. Cho'qqilar jadvali",
                  desc: "11 ta Raman polosasi — chastota, tayinlash, kuch konstanta",
                },
                {
                  key: "spectrum",
                  label: "4. Raman spektri grafigi",
                  desc: "Lorentzian simulyatsiya, 50-3200 sm⁻¹",
                },
                {
                  key: "groupTheory",
                  label: "5. Guruh nazariyasi",
                  desc: "D₅d simmetriya, tanlash qoidalari, mutual exclusion",
                },
                {
                  key: "forceConstant",
                  label: "6. Kuch konstantasi",
                  desc: "10 ta bog' turi taqqoslash jadvali",
                },
                {
                  key: "metallocenes",
                  label: "7. Metallosenlar qatori",
                  desc: "V, Cr, Mn, Fe, Co, Ni, Ru, Os taqqoslashi",
                },
                {
                  key: "techniques",
                  label: "8. Namuna tayyorlash usullari",
                  desc: "Kristall, eritma, RR, SERS — afzallik/kamchilik",
                },
                {
                  key: "interferences",
                  label: "9. Halaqit beruvchi omillar",
                  desc: "8 ta omil va yechimlari",
                },
                {
                  key: "conclusions",
                  label: "10. Asosiy xulosalar",
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
                <strong>⚠ Eslatma:</strong> PDF Unicode belgilarni (η, ν̃, π, ⁻¹,
                ₅, ₂ va h.k.) qo'llash uchun{" "}
                <code className="bg-purple-950 px-1 rounded">
                  /public/fonts/
                </code>{" "}
                papkasida DejaVuSans.ttf, DejaVuSans-Bold.ttf va
                DejaVuSans-Oblique.ttf fayllari bo'lishi kerak. Kutilgan hajm:
                ~5-7 sahifa A4.
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
              Sandvich D₅d
            </span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">
              η⁵-koordinatsiya
            </span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">
              d⁶ past spin
            </span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">
              18 e⁻
            </span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">
              Nobel 1973
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-4 flex-wrap relative">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              Fe(η⁵-C₅H₅)₂
            </h2>
            <span className="text-purple-400 text-lg">186.03 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            bis(η⁵-siklopentadienil)temir(II) —{" "}
            <span className="text-sky-400 italic">«Ferrosen»</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-sky-400">
              Organometall kimyoning fundamental namunasi
            </strong>{" "}
            — 1951-yilda Kealy & Pauson tomonidan sintez qilingan, 1952-yilda
            Wilkinson, Woodward va Fischer sandvich strukturasini tasdiqlagan
            (Nobel 1973). Ferrosenning Raman spektri sandvich bog'lanishning
            bevosita dalilidir:{" "}
            <strong className="text-orange-300">
              halqa "nafas olishi" 1105 sm⁻¹
            </strong>{" "}
            (A₁g — barcha Cp₂M oilasining barmoq izi) va{" "}
            <strong className="text-sky-300">
              simmetrik ν(Fe–Cp) 309 sm⁻¹
            </strong>{" "}
            (M–L bog'ining diagnostik cho'qqisi). D₅d simmetriyasi va inversiya
            markazi tufayli mutual exclusion qat'iy amal qiladi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Fe²⁺ (d⁶ LS)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Konfiguratsiya</div>
              <div className="text-white font-bold">a₁g² e₂g⁴</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Sandvich (D₅d)</div>
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

        {/* ═══════════ 2. SANDVICH STRUKTURASI (SVG 3D VIZUALIZATSIYA) ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🥪</span> Sandvich strukturasi — 3D vizualizatsiya
          </h2>
          <p className="text-purple-200 text-sm">
            Ikki paralel Cp⁻ halqasi orasida Fe atomi. Halqalar staggered (36°
            siljigan, D₅d) yoki eclipsed (D₅h) konfiguratsiyada bo'lishi mumkin.
            Xona haroratida kristall —{" "}
            <strong className="text-sky-300">staggered</strong>, gaz fazasida —{" "}
            <strong className="text-orange-300">eclipsed</strong>.
          </p>

          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setRotamerView("staggered")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                rotamerView === "staggered"
                  ? "bg-sky-600/60 text-white border-sky-400/50 shadow-lg shadow-sky-500/20"
                  : "bg-purple-800/30 text-purple-400 border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              Staggered (D₅d) — kristall
            </button>
            <button
              onClick={() => setRotamerView("eclipsed")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                rotamerView === "eclipsed"
                  ? "bg-orange-600/60 text-white border-orange-400/50 shadow-lg shadow-orange-500/20"
                  : "bg-purple-800/30 text-purple-400 border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              Eclipsed (D₅h) — gaz fazasi
            </button>
          </div>

          <div className="bg-purple-950/40 p-6 rounded-xl border border-purple-700/30">
            <svg
              viewBox="0 0 500 400"
              className="w-full max-w-md mx-auto h-auto"
            >
              {/* Yuqori Cp halqa (perspektiv) */}
              <ellipse
                cx="250"
                cy="90"
                rx="120"
                ry="30"
                fill="none"
                stroke="#c084fc"
                strokeWidth="2"
                opacity="0.4"
              />
              {/* Yuqori Cp uglerodlari */}
              {[0, 72, 144, 216, 288].map((deg, i) => {
                const rad = ((deg - 90) * Math.PI) / 180;
                const x = 250 + 120 * Math.cos(rad);
                const y = 90 + 30 * Math.sin(rad);
                return (
                  <g key={`top-${i}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r="10"
                      fill="#8b5cf6"
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={x}
                      y={y + 4}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#fff"
                      fontWeight="bold"
                    >
                      C
                    </text>
                    {/* C–H bog'i */}
                    <line
                      x1={x}
                      y1={y}
                      x2={250 + 150 * Math.cos(rad)}
                      y2={90 + 42 * Math.sin(rad) - 5}
                      stroke="#a78bfa"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                    <circle
                      cx={250 + 150 * Math.cos(rad)}
                      cy={90 + 42 * Math.sin(rad) - 5}
                      r="5"
                      fill="#e5e7eb"
                    />
                    <text
                      x={250 + 150 * Math.cos(rad)}
                      y={90 + 42 * Math.sin(rad) - 3}
                      textAnchor="middle"
                      fontSize="7"
                      fill="#333"
                    >
                      H
                    </text>
                  </g>
                );
              })}
              {/* Yuqori Cp ichki chiziqlar (halqa) */}
              {[0, 72, 144, 216, 288].map((deg, i) => {
                const rad1 = ((deg - 90) * Math.PI) / 180;
                const rad2 = ((deg + 72 - 90) * Math.PI) / 180;
                const x1 = 250 + 120 * Math.cos(rad1);
                const y1 = 90 + 30 * Math.sin(rad1);
                const x2 = 250 + 120 * Math.cos(rad2);
                const y2 = 90 + 30 * Math.sin(rad2);
                return (
                  <line
                    key={`top-line-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#a78bfa"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                );
              })}

              {/* Fe atomi (markazda) */}
              <defs>
                <radialGradient id="feGrad">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </radialGradient>
              </defs>
              <circle
                cx="250"
                cy="200"
                r="28"
                fill="url(#feGrad)"
                stroke="#fff"
                strokeWidth="2"
              />
              <text
                x="250"
                y="207"
                textAnchor="middle"
                fontSize="16"
                fill="#fff"
                fontWeight="bold"
              >
                Fe
              </text>

              {/* Fe → Cp bog'lari (yuqoriga) */}
              {[0, 72, 144, 216, 288].map((deg, i) => {
                const rad = ((deg - 90) * Math.PI) / 180;
                const x = 250 + 120 * Math.cos(rad);
                const y = 90 + 30 * Math.sin(rad);
                return (
                  <line
                    key={`fe-top-${i}`}
                    x1="250"
                    y1="200"
                    x2={x}
                    y2={y}
                    stroke="#fbbf24"
                    strokeWidth="1"
                    strokeDasharray="3,2"
                    opacity="0.5"
                  />
                );
              })}

              {/* Pastki Cp halqa */}
              {(() => {
                const offset = rotamerView === "staggered" ? 36 : 0;
                return (
                  <>
                    <ellipse
                      cx="250"
                      cy="310"
                      rx="120"
                      ry="30"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      opacity="0.4"
                    />
                    {[0, 72, 144, 216, 288].map((deg, i) => {
                      const rad = ((deg + offset - 90) * Math.PI) / 180;
                      const x = 250 + 120 * Math.cos(rad);
                      const y = 310 + 30 * Math.sin(rad);
                      return (
                        <g key={`bot-${i}`}>
                          <circle
                            cx={x}
                            cy={y}
                            r="10"
                            fill="#0ea5e9"
                            stroke="#fff"
                            strokeWidth="1.5"
                          />
                          <text
                            x={x}
                            y={y + 4}
                            textAnchor="middle"
                            fontSize="9"
                            fill="#fff"
                            fontWeight="bold"
                          >
                            C
                          </text>
                          <line
                            x1={x}
                            y1={y}
                            x2={250 + 150 * Math.cos(rad)}
                            y2={310 + 42 * Math.sin(rad) + 5}
                            stroke="#7dd3fc"
                            strokeWidth="1"
                            opacity="0.6"
                          />
                          <circle
                            cx={250 + 150 * Math.cos(rad)}
                            cy={310 + 42 * Math.sin(rad) + 5}
                            r="5"
                            fill="#e5e7eb"
                          />
                          <text
                            x={250 + 150 * Math.cos(rad)}
                            y={310 + 42 * Math.sin(rad) + 7}
                            textAnchor="middle"
                            fontSize="7"
                            fill="#333"
                          >
                            H
                          </text>
                        </g>
                      );
                    })}
                    {[0, 72, 144, 216, 288].map((deg, i) => {
                      const rad1 = ((deg + offset - 90) * Math.PI) / 180;
                      const rad2 = ((deg + 72 + offset - 90) * Math.PI) / 180;
                      const x1 = 250 + 120 * Math.cos(rad1);
                      const y1 = 310 + 30 * Math.sin(rad1);
                      const x2 = 250 + 120 * Math.cos(rad2);
                      const y2 = 310 + 30 * Math.sin(rad2);
                      return (
                        <line
                          key={`bot-line-${i}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#7dd3fc"
                          strokeWidth="2"
                          opacity="0.7"
                        />
                      );
                    })}
                    {[0, 72, 144, 216, 288].map((deg, i) => {
                      const rad = ((deg + offset - 90) * Math.PI) / 180;
                      const x = 250 + 120 * Math.cos(rad);
                      const y = 310 + 30 * Math.sin(rad);
                      return (
                        <line
                          key={`fe-bot-${i}`}
                          x1="250"
                          y1="200"
                          x2={x}
                          y2={y}
                          stroke="#fbbf24"
                          strokeWidth="1"
                          strokeDasharray="3,2"
                          opacity="0.5"
                        />
                      );
                    })}
                  </>
                );
              })()}

              {/* O'lchamlar */}
              <line
                x1="400"
                y1="90"
                x2="400"
                y2="200"
                stroke="#fbbf24"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x="410"
                y="145"
                fontSize="10"
                fill="#fbbf24"
                fontWeight="bold"
              >
                1.66 Å
              </text>
              <text x="410" y="158" fontSize="8" fill="#a78bfa">
                Fe–centroid
              </text>

              <line
                x1="80"
                y1="90"
                x2="80"
                y2="310"
                stroke="#c084fc"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x="20"
                y="195"
                fontSize="10"
                fill="#c084fc"
                fontWeight="bold"
              >
                3.32 Å
              </text>
              <text x="20" y="208" fontSize="8" fill="#a78bfa">
                Cp···Cp
              </text>

              {/* Sarlavha */}
              <text
                x="250"
                y="30"
                textAnchor="middle"
                fontSize="14"
                fill="#fbbf24"
                fontWeight="bold"
              >
                Fe(η⁵-C₅H₅)₂ —{" "}
                {rotamerView === "staggered"
                  ? "Staggered (D₅d)"
                  : "Eclipsed (D₅h)"}
              </text>
              <text
                x="250"
                y="380"
                textAnchor="middle"
                fontSize="9"
                fill="#a78bfa"
              >
                {rotamerView === "staggered"
                  ? "Halqalar 36° siljigan — kristall holat"
                  : "Halqalar bir-birining ustida — gaz fazasi"}
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-sky-900/20 border border-sky-500/30 rounded-xl p-4">
              <div className="text-sky-400 font-bold text-sm mb-2">
                📏 Fe–C bog'i
              </div>
              <p className="text-purple-200 text-xs">
                2.045 Å — barcha 10 ta ekvivalent. η⁵ koordinatsiyaning bevosita
                dalili.
              </p>
            </div>
            <div className="bg-purple-800/30 border border-purple-500/30 rounded-xl p-4">
              <div className="text-purple-400 font-bold text-sm mb-2">
                🎯 Fe–centroid
              </div>
              <p className="text-purple-200 text-xs">
                1.66 Å — bu qiymat ν(Fe–Cp) chastotasi (309 sm⁻¹) va kuch
                konstantasi bilan bevosita bog'liq.
              </p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
              <div className="text-orange-400 font-bold text-sm mb-2">
                🔄 Rotatsion barrier
              </div>
              <p className="text-purple-200 text-xs">
                Staggered ↔ eclipsed = ~4 kJ/mol. Xona haroratida halqalar
                deyarli erkin aylanadi.
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
            <strong>noelastik sochilishiga</strong> asoslangan. Tushuvchi foton
            (hν₀) molekulaning qutblanuvchanligini modulyatsiyalab, energiyasi ±
            h·νᵥ ga o'zgargan foton sochiladi.
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
                🎯 Raman faollik shartlari
              </h3>
              <div className="space-y-3">
                <div className="bg-sky-900/20 border border-sky-700/40 rounded-lg p-3">
                  <p className="text-sky-300 font-bold text-sm mb-1">
                    1. Stokes va anti-Stokes
                  </p>
                  <p className="text-purple-200 text-xs">
                    Stokes: ν = ν₀ − νᵥ (asosiy). Anti-Stokes: ν = ν₀ + νᵥ
                    (harorat bilan ortadi).
                  </p>
                </div>
                <div className="bg-sky-900/20 border border-sky-700/40 rounded-lg p-3">
                  <p className="text-sky-300 font-bold text-sm mb-1">
                    2. Qutblanuvchanlik sharti
                  </p>
                  <p className="text-purple-200 text-xs font-mono">
                    (∂α/∂Q)₀ ≠ 0
                  </p>
                  <p className="text-purple-200 text-xs mt-1">
                    Tebranish davomida α o'zgarishi zarur. IQ tanlash qoidasidan
                    mustaqil.
                  </p>
                </div>
                <div className="bg-sky-900/20 border border-sky-700/40 rounded-lg p-3">
                  <p className="text-sky-300 font-bold text-sm mb-1">
                    3. Normal modalar soni
                  </p>
                  <p className="text-purple-200 text-xs">
                    Chiziqsiz molekulada 3N−6. Ferrosenda: 3(21)−6 ={" "}
                    <strong className="text-sky-300">57 ta moda</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-200 text-sm">
              <strong className="text-orange-300">
                ⚡ Mutual Exclusion (alternativ taqiq) qoidasi:
              </strong>{" "}
              Ferrosen D₅d simmetriyasida inversiya markazi (i) mavjud —{" "}
              <strong>
                hech qaysi tebranish moda bir vaqtda ham IQ, ham Raman faol
                bo'la olmaydi
              </strong>
              . Gerade (g) modalar faqat Ramanda, ungerade (u) faqat IQ da faol.
              Bu ferrosenning eng elegant simmetrik xususiyati va sandvich
              strukturasining bevosita isbotidir.
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
            asosida simulyatsiya qilingan (kristall ferrosen, 532 nm lazer).
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
              min="50"
              max="3200"
              value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>50 (uzoq)</span>
              <span>500</span>
              <span>1000</span>
              <span>2000</span>
              <span>3200 (C–H)</span>
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

          {/* SVG spektr grafigi (Raman — pastdan yuqoriga intensivlik) */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <div className="text-xs text-purple-400 mb-2 flex items-center justify-between">
              <span>
                Raman spektri — Lorentzian simulyatsiya (kristall, 532 nm)
              </span>
              <span className="font-mono">50 — 3200 sm⁻¹</span>
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
              {[3200, 2800, 2400, 2000, 1600, 1200, 800, 400, 50].map(
                (f, i) => {
                  const gx = 60 + ((3200 - f) / 3150) * 710;
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
                x={60 + ((3200 - 3200) / 3150) * 710}
                y="30"
                width={((3200 - 2900) / 3150) * 710}
                height="220"
                fill="#38bdf8"
                opacity="0.06"
              />
              <rect
                x={60 + ((3200 - 1500) / 3150) * 710}
                y="30"
                width={((1500 - 800) / 3150) * 710}
                height="220"
                fill="#c084fc"
                opacity="0.06"
              />
              <rect
                x={60 + ((3200 - 700) / 3150) * 710}
                y="30"
                width={((700 - 50) / 3150) * 710}
                height="220"
                fill="#fb923c"
                opacity="0.06"
              />

              <text
                x={60 + ((3200 - 3050) / 3150) * 710}
                y="45"
                fontSize="8"
                fill="#38bdf8"
                textAnchor="middle"
                fontWeight="bold"
              >
                C–H zonasi
              </text>
              <text
                x={60 + ((3200 - 1150) / 3150) * 710}
                y="45"
                fontSize="8"
                fill="#c084fc"
                textAnchor="middle"
                fontWeight="bold"
              >
                Halqa zonasi
              </text>
              <text
                x={60 + ((3200 - 375) / 3150) * 710}
                y="45"
                fontSize="8"
                fill="#fb923c"
                textAnchor="middle"
                fontWeight="bold"
              >
                M–L zonasi
              </text>

              {/* Spektr chizig'i (Lorentzian, YUQORIGA cho'qqilar) */}
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                points={(() => {
                  const pts = [];
                  for (let f = 3200; f >= 50; f -= 8) {
                    let I = 0.02;
                    ramanPeaks.forEach((p) => {
                      const sigma =
                        p.freq > 2000 ? 20 : p.freq > 1000 ? 15 : 10;
                      I +=
                        p.absorbance *
                        Math.exp(
                          -Math.pow(f - p.freq, 2) / (2 * sigma * sigma),
                        );
                    });
                    I = Math.min(I, 1.0);
                    const x = 60 + ((3200 - f) / 3150) * 710;
                    const y = 250 - I * 220;
                    pts.push(`${x},${y}`);
                  }
                  return pts.join(" ");
                })()}
              />

              {/* Slayder markeri */}
              <line
                x1={60 + ((3200 - freqSlider) / 3150) * 710}
                y1="30"
                x2={60 + ((3200 - freqSlider) / 3150) * 710}
                y2="250"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4,2"
              />

              {/* Cho'qqi markerlari */}
              {ramanPeaks.map((peak, i) => {
                const x = 60 + ((3200 - peak.freq) / 3150) * 710;
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
            11 ta asosiy Raman polosasi, ular uchun aniq chastota, tayinlash,
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
                🔥 Halqa nafas olishi (1105)
              </div>
              <p className="text-purple-200 text-xs">
                Ferrosenning va butun sandvich metallosenlar oilasining Raman
                barmoq izi. A₁g simmetriya — faqat Raman faol.
              </p>
            </div>
            <div className="bg-sky-900/20 border border-sky-500/30 rounded-xl p-4">
              <div className="text-sky-400 font-bold text-sm mb-2">
                🔬 νₛ(Fe–Cp) (309)
              </div>
              <p className="text-purple-200 text-xs">
                Sandvich M–L bog'lanishning bevosita diagnostik cho'qqisi.
                Metall almashishi bilan sezilarli o'zgaradi (V→Ni: 379→260).
              </p>
            </div>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
              <div className="text-purple-400 font-bold text-sm mb-2">
                🎯 ν(C–H) (3110)
              </div>
              <p className="text-purple-200 text-xs">
                Cp halqasining aromatik xarakterini tasdiqlaydi. Erkin C₅H₆
                (3075) dan +35 sm⁻¹ yuqoriroq.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 6. GURUH NAZARIYASI — D5d ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔷</span> Guruh nazariyasi tahlili — D₅d simmetriyasi
          </h2>
          <p className="text-purple-200 text-sm leading-relaxed">
            Ferrosen kristall holatda{" "}
            <strong className="text-sky-400">D₅d nuqtaviy guruhga</strong>{" "}
            tegishli (20-tartib, staggered rotamer), gaz fazasida esa{" "}
            <strong className="text-orange-300">D₅h</strong> (eclipsed).
            Simmetriya operatsiyalari:{" "}
            <span className="font-mono text-orange-300 text-xs">
              E, 2C₅, 2C₅², 5C₂, i, 2S₁₀, 2S₁₀³, 5σd
            </span>
            .
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sky-400 font-bold mb-3">
                Normal tebranish modalari
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-orange-300 text-xs font-bold uppercase mb-1">
                    Umumiy modalar
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2">
                    3N−6 = 3(21)−6 = 57
                  </div>
                </div>
                <div>
                  <div className="text-orange-300 text-xs font-bold uppercase mb-1">
                    Reducible tasvir (D₅d)
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">
                    Γᵥⁱᵇ = 4A₁g + A₂g + 5E₁g + 6E₂g + 3A₁ᵤ + 4A₂ᵤ + 5E₁ᵤ + 6E₂ᵤ
                  </div>
                </div>
                <div>
                  <div className="text-orange-300 text-xs font-bold uppercase mb-1">
                    ν(Fe–Cp) modalari
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">
                    A₁g (309, Raman) + A₂ᵤ (478, IQ)
                  </div>
                </div>
                <div>
                  <div className="text-orange-300 text-xs font-bold uppercase mb-1">
                    Halqa nafasi
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">
                    A₁g (1105, faqat Raman)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sky-400 font-bold mb-3">Faollik jadvali</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 bg-sky-900/20 rounded-lg p-3 border border-sky-700/30">
                  <div className="w-3 h-3 bg-sky-400 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sky-400 font-bold text-xs">
                      Raman faol (gerade)
                    </div>
                    <div className="text-purple-200 text-xs font-mono">
                      4A₁g + 5E₁g + 6E₂g — jami 15 tur
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
                      4A₂ᵤ + 5E₁ᵤ — jami 9 tur
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
                      A₂g + 3A₁ᵤ + 6E₂ᵤ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-5">
            <p className="text-sky-200 text-sm">
              <strong className="text-sky-300">
                ⚡ Mutual Exclusion (alternativ taqiq) qoidasi:
              </strong>{" "}
              D₅d da inversiya markazi (i) mavjud → hech qaysi tebranish moda
              bir vaqtda ham IQ, ham Raman faol bo'la olmaydi. Gerade (g)
              modalar faqat Ramanda, ungerade (u) faqat IQ da faol. Bu qoida
              to'g'ridan-to'g'ri Raman+IQ komplementarligi orqali D₅d
              simmetriyasining tasdig'ini beradi.
            </p>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-200 text-sm">
              <strong className="text-orange-300">
                🔬 Fischer va Wilkinson strukturasining tasdiqi:
              </strong>{" "}
              Agar ferrosen ionli tuz [Fe²⁺][C₅H₅⁻]₂ bo'lganda ν(Fe–Cp) polosasi
              bo'lmasdi — chunki elektrostatik o'zaro ta'sirda tebranish moda
              hosil bo'lmaydi. Ammo 309 sm⁻¹ da kuchli A₁g cho'qqi mavjudligi{" "}
              <strong>kovalent Fe–Cp bog'lanishning</strong> bevosita dalilidir.
              Bu Raman spektroskopiyasining 1952-yildagi sandvich modeli uchun
              eng aniq tebranish darajasidagi isboti.
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
            tebranish chastotasiga proporsional. Quyidagi jadval ferrosenning
            bog'larini boshqa turli bog'lar bilan taqqoslaydi:
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
                    f.bond.includes("ferrosen") ||
                    f.bond.includes("Cp ferrosen");
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
              <strong className="text-green-300">Xulosa:</strong> Fe–Cp bog'i k
              = 2.35 mdyn/Å bilan Fe–N (Fe(CN)₆³⁻ da k ≈ 2.10) dan biroz
              mustahkamroq. Bu η⁵-koordinatsiyaning σ+π sinergetik bog'lanishi
              ferrosenning ultra-barqarorligini (18 e⁻ qoidasi) tasdiqlaydi.
              Ru–Cp (k = 2.65) esa Fe–Cp dan mustahkam — 5d orbitallarning
              kattaligi va yaxshi π-back-donatsiyasi tufayli.
            </p>
          </div>
        </div>

        {/* ═══════════ 8. METALLOSENLAR QATORI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚖️</span> Metallosenlar qatori — Cp₂M taqqoslashi
          </h2>
          <p className="text-purple-200 leading-relaxed">
            Har xil markaziy metall bilan Cp₂M metallosenlari. d elektronlar
            soni ortishi bilan Fe–Cp bog'lanish zaiflashadi va νₛ(M–Cp)
            chastotasi pasayadi. Ferrosen (d⁶ LS, 18 e⁻) — ideal 18-elektron
            qoidasiga mos, shuning uchun eng barqaror.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Metallosen
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    M(II)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    d config
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    νₛ(M–Cp)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    νₐₛ(M–Cp)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Halqa nafasi
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Barqarorlik
                  </th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {metalloceneSeries.map((m, i) => (
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
                      {m.nuFeCpSym}
                    </td>
                    <td className="py-3 px-3 font-mono text-purple-300">
                      {m.nuFeCpAsym}
                    </td>
                    <td className="py-3 px-3 font-mono text-orange-300">
                      {m.ringBreath}
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
                📉 M–Cp trend (chapdan o'ngga)
              </h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                V (379) → Cr (336) → Fe (309) → Co (285) → Ni (260) sm⁻¹. d
                elektronlar soni ortsa, ular anti-bog'lovchi orbitallarga ham
                to'ladi va M–Cp zaiflashadi. Bu chastotalar Raman
                spektroskopiyasi orqali{" "}
                <strong>
                  anti-bog'lovchi orbitallar to'ldirilish darajasini
                </strong>{" "}
                bevosita qayd etadi.
              </p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-300 font-bold mb-2 text-sm">
                📊 Halqa nafasi barqarorligi
              </h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Barcha Cp₂M da halqa nafas olishi 1095–1112 sm⁻¹ oralig'ida —
                atigi ±10 sm⁻¹ tebranadi. Sababi: bu moda Cp halqasining o'zida
                ro'y beradi, metall almashinuvi ta'siri juda kam. Shuning uchun
                1105 sm⁻¹ —{" "}
                <strong>butun sandvich oilasining Raman barmoq izi</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 9. NAMUNA TAYYORLASH USULLARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔬</span> Namuna tayyorlash usullari
          </h2>
          <p className="text-purple-200 text-sm">
            Ferrosen Raman spektroskopiyasi uchun 4 ta asosiy texnika mavjud.
            Har biri o'ziga xos afzallik va cheklovlarga ega.
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

        {/* ═══════════ 10. HALAQIT OMILLARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚠️</span> Raman tahliliga halaqit beruvchi omillar
          </h2>
          <p className="text-purple-200 text-sm">
            Ferrosen Raman spektroskopiyasida bir qator omillar spektrni buzishi
            mumkin. Har birini oldini olish va yechish yo'llarini bilish ilmiy
            tahlilning muhim qismi.
          </p>

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
                    <td className="py-3 px-4 font-bold">{iv.source}</td>
                    <td className="py-3 px-4 font-mono text-orange-300 text-xs">
                      {iv.freqRange}
                    </td>
                    <td className="py-3 px-4 text-xs">{iv.effect}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          iv.severity === "Yuqori"
                            ? "bg-red-600/40 text-red-300"
                            : iv.severity === "O'rta"
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

        {/* ═══════════ 11. TARIXIY KONTEKST ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📜</span> Ferrosen — kashfiyot tarixi va Nobel mukofoti
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-5">
              <div className="text-orange-400 font-bold mb-2 text-sm">
                🔬 1951 — Kashfiyot
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Peter Kealy va Peter Pauson</strong> (Duquesne
                University, AQSh) siklopentadienil-magniy bromiddan (BrMgC₅H₅)
                FeCl₃ bilan reaksiyada tasodifan to'q sariq kristall olishdi.
                Ular uni "biscyclopentadienyliron" deb nomlashdi va tuzilishini
                noto'g'ri σ-bog'lanishli deb tasavvur qilishdi. <em>Nature</em>,
                168, 1039 (1951).
              </p>
            </div>
            <div className="bg-sky-900/20 border border-sky-500/30 rounded-xl p-5">
              <div className="text-sky-400 font-bold mb-2 text-sm">
                🥪 1952 — Sandvich modeli
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Geoffrey Wilkinson va Robert Woodward</strong> (Harvard)
                hamda mustaqil ravishda <strong>Ernst Otto Fischer</strong>{" "}
                (Myunxen) IQ spektri, magnit tekshiruvlar va XRD asosida to'g'ri
                sandvich strukturasini taklif etishdi.{" "}
                <em>J. Am. Chem. Soc.</em>, 74, 2125 (1952).
              </p>
            </div>
            <div className="bg-purple-800/30 border border-purple-500/30 rounded-xl p-5">
              <div className="text-purple-400 font-bold mb-2 text-sm">
                🏆 1973 — Nobel mukofoti
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                Wilkinson va Fischer <strong>Nobel kimyo mukofoti</strong>ni{" "}
                <em>
                  "metallorganik, tak sandvich birikmalari kimyosi bo'yicha
                  kashshof ishlari uchun"
                </em>{" "}
                olishdi. Ferrosen — organometall kimyoning boshlanish nuqtasi
                bo'lib qoldi va yangi butun bir sohaning (metallosenlar,
                Ziegler-Natta katalizatorlari) tug'ilishiga sabab bo'ldi.
              </p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5">
              <div className="text-green-400 font-bold mb-2 text-sm">
                🧪 Zamonaviy qo'llanishlar
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                • <strong>Elektrokimyoviy standart</strong>: Fc/Fc⁺ juftlashuvi
                (+0.40 V) — IUPAC referens.
                <br />• <strong>Katalizatorlar</strong>: Ziegler-Natta,
                Kaminsky-Sinn.
                <br />• <strong>Dori-darmonlar</strong>: ferroquine
                (anti-malariya).
                <br />• <strong>Biosensorlar</strong>:
                ferrosenil-modifikatsiyalangan elektrodlar (glyukoza sensori).
                <br />• <strong>Yoqilg'ilar</strong>: benzin sekingina yonishini
                yaxshilash uchun.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 12. XULOSA ═══════════ */}
        <div className="bg-gradient-to-r from-sky-600/10 to-purple-600/10 border border-sky-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✅</span> Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li className="pl-2">
              <strong className="text-sky-400">
                Halqa "nafas olishi" ν₁(C–C) = 1105 sm⁻¹
              </strong>{" "}
              — A₁g simmetriya, ferrosen va butun sandvich oilasining Raman
              barmoq izi
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">νₛ(Fe–Cp) = 309 sm⁻¹</strong> —
              A₁g, sandvich M–L bog'lanishning bevosita diagnostik cho'qqisi
              (Fe(CN)₆ dan farqli xarakter)
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">ν(C–H) = 3110 sm⁻¹</strong> — Cp
              halqasining aromatik xarakterini tasdiqlaydi (Hückel 4n+2, n=1)
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">D₅d + mutual exclusion</strong> —
              inversiya markazi tufayli gerade faqat Ramanda, ungerade faqat IQ
              da faol
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">k(Fe–Cp) = 2.35 mdyn/Å</strong> —
              sandvich bog'lanishning kuchliligini isbotlaydi (18 e⁻ qoidasi)
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">Metallosen qatori</strong>:
              V(379) → Cr(336) → Fe(309) → Co(285) → Ni(260) — anti-bog'lovchi
              orbitallar to'lishi
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">Rezonans Raman (441 nm)</strong>{" "}
              intensivlikni 10³–10⁴× kuchaytiradi — vibron holatlar tahlili
              uchun ideal
            </li>
            <li className="pl-2">
              <strong className="text-sky-400">
                Wilkinson va Fischer sandvich modeli
              </strong>{" "}
              (1952) Raman spektroskopiyasi orqali to'liq tasdiqlangan — Nobel
              1973
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
            href="/ilmiy/tahlil/raman/birikmalar/ni-cn4"
            className="px-6 py-3 bg-sky-600/80 rounded-xl hover:bg-sky-500 text-white font-semibold transition-all"
          >
            [Ni(CN)₄]²⁻ →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>
            © 2026 JDA-Kimyo • Fe(η⁵-C₅H₅)₂ (Ferrosen) • Raman spektroskopiya
            moduli (premium)
          </p>
          <p className="mt-2 text-purple-600">
            Manbalar: Nakamoto K. — Infrared and Raman Spectra (2009);
            Lippincott & Nelson — Spectrochim. Acta (1958);
            <br />
            Wilkinson & Woodward — J. Am. Chem. Soc. (1952); Long D.A. — The
            Raman Effect (2002)
          </p>
        </div>
      </footer>
    </main>
  );
}
