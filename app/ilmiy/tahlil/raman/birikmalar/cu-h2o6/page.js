"use client";

import Link from "next/link";
import { useState, useMemo, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// [Cu(H₂O)₆]²⁺ — RAMAN SPEKTROSKOPIYA (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar:
//   • K. Nakamoto — Infrared and Raman Spectra of Inorganic and Coordination Compounds, 6th ed., Wiley (2009)
//   • H.A. Jahn, E. Teller — Proc. R. Soc. A 161, 220 (1937) — Yan-Teller teoremasi
//   • B.J. Hathaway, D.E. Billing — Coord. Chem. Rev. 5, 143 (1970) — Cu(II) stereo
//   • D.W. James, R.F. Armishaw — Aust. J. Chem. 28, 1179 (1975) — Cu(II) aqua Raman
//   • S.F.A. Kettle — Physical Inorganic Chemistry (1998)
//   • F.A. Cotton, G. Wilkinson — Advanced Inorganic Chemistry, 6th ed. (1999)
//   • M. Persson et al. — J. Chem. Phys. 106, 4881 (1997) — hydration dynamics
//   • R. Åkesson et al. — J. Am. Chem. Soc. 116, 8691 (1994) — EXAFS + ab initio
// Xususiyat: Yan-Teller effekti va dinamik buzilish batafsil yoritilgan + PDF eksport
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Cu(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>",
  formulaPlain: "[Cu(H2O)6]2+",
  iupac: "Geksaakvamis(II) kationi",
  commonName: "Mis(II) akvakompleksi (havorang eritma)",
  molarMass: 171.62,
  casNumber: "14946-74-8 (kation)",
  color: "yorqin havorang (aqua-blue) — d-d o'tish (λmax ≈ 810 nm)",
  structure: "Yan-Teller buzilgan oktaedr (4+2 tetragonal)",
  metalLigand: "Cu–O (koordinatsion σ-bog', minor π-donor)",
  spaceGroup: "P4/nmm (CuSO₄·5H₂O, tetragonal)",
  crystalSystem: "Tetragonal (kristall gidrat sifatida)",
  pointGroup: "Statik: D₄ₕ (Yan-Teller); Dinamik o'rtacha: Oₕ",
  bondLengthEq: "1.97 Å (ekvatorial, 4 ta H₂O)",
  bondLengthAx: "2.38 Å (aksial, 2 ta H₂O — cho'zilgan!)",
  jahnTellerElongation: "+0.41 Å (aksial cho'zilish)",
  bondAngle: "≈ 90° va 180° (buzilgan)",
  electronCount: "17 e⁻ (9 + 6·1 σ + 6·1 π; d⁹)",
  dConfig: "d⁹ (t₂g⁶ eg³ dinamik o'rtacha; d(x²-y²)¹ statik)",
  meltingPoint: "CuSO₄·5H₂O: 110 °C da 4H₂O yo'qotadi",
  stability: "log K₁ ≈ 4.15 (Cu²⁺ + H₂O ⇌ [Cu(OH₂)]²⁺ da)",
  magnetism: "Paramagnit (d⁹, S = 1/2, μeff ≈ 1.7–2.2 μB)",
  discovery:
    "1852 — Cannizzaro, akvakompleks; 1937 — Jahn & Teller nazariya; 1970 — Hathaway XRD kristallografiya",
  jtEffect:
    "Statik: aksial cho'zilish, k(Cu-O ax) << k(Cu-O eq); Dinamik: 10⁻¹¹ s xarakterli vaqt bilan tebranadi",
};

// ═══════════════════════════════════════════════════════════════════════════════
// RAMAN CHO'QQILARI ([Cu(H₂O)₆]²⁺, Yan-Teller buzilgan D₄ₕ)
// Muhim: Raman keng va assimetrik chiziqlar beradi — dinamik Yan-Teller natijasi
// Ekvatorial Cu-O eq (1.97 Å) va aksial Cu-O ax (2.38 Å) chastotalari alohida
// ═══════════════════════════════════════════════════════════════════════════════
const ramanPeaks = [
  {
    freq: 3450,
    absorbance: 0.6,
    intensityCode: 3,
    assignment: "νₐₛ(O–H)",
    assignment_uz: "H₂O ligandidagi asimmetrik O–H cho'zilish",
    intensity: "Kuchli, keng",
    bond: "O–H",
    symmetry: "B₂ (lokal C₂v suv) — Raman va IQ",
    forceConstant: "7.30 mdyn/Å",
    bondLength: "0.98 Å",
    region: "X–H cho'zilish sohasi (3600–3200 sm⁻¹)",
    freeLigand: "Erkin H₂O (suyuq): νₐₛ ≈ 3490 sm⁻¹",
    coordShift: "Koordinatsiya tufayli −40 sm⁻¹ pastga siljigan",
    theoryNote:
      "H₂O ning asimmetrik O–H cho'zilishi. Cu²⁺ ga koordinatsiya elektron zichlikni O ga jalb qilib, O–H bog'ini biroz zaiflashtiradi. Chiziq JUDA KENG (yarim kenglik ~150 sm⁻¹) — sabab: (1) suvning vodorod bog'lanish tarmog'i, (2) dinamik Yan-Teller effekti, (3) ekvatorial va aksial H₂O ligandlarining farqli chastotalari qo'shilib chiziqni kengaytiradi. Bu ferrosen yoki [Co(NH₃)₆]³⁺ dagi keskin chiziqlardan tubdan farq qiladi.",
    diagnostic: "Suvli akvakompleksning ko'rsatkichi (keng chiziq — H-bonding)",
    animation: "oh-asym",
  },
  {
    freq: 3220,
    absorbance: 0.85,
    intensityCode: 4,
    assignment: "νₛ(O–H)",
    assignment_uz: "H₂O ligandidagi simmetrik O–H cho'zilish",
    intensity: "Juda kuchli, keng",
    bond: "O–H",
    symmetry: "A₁ (lokal C₂v suv) → Raman faol",
    forceConstant: "7.20 mdyn/Å",
    bondLength: "0.98 Å",
    region: "X–H cho'zilish sohasi",
    freeLigand: "Erkin H₂O: νₛ ≈ 3280 sm⁻¹",
    coordShift:
      "Koordinatsiya tufayli −60 sm⁻¹ pastga siljigan (H-bonding hisobga olib)",
    theoryNote:
      "🔥 [Cu(H₂O)₆]²⁺ NING RAMANDA ENG KUCHLI KO'RINUVCHI POLOSASI. H₂O ning simmetrik O–H cho'zilishi — ikkala H atomi bir vaqtda cho'ziladi va qisqaradi. A₁ turdagi moda qutblanuvchanlikni katta modulyatsiya qiladi. Ammo bu polosa suv suyuqligining ν(O–H) ustiga tushadi va uni ajratish qiyin — deuterlangan D₂O bilan tekshirish kerak (νₛ(O–D) ≈ 2400 sm⁻¹ ga siljiydi).",
    diagnostic: "🌟 [Cu(H₂O)₆]²⁺ ning Raman spektridagi ENG kuchli polosa",
    animation: "oh-sym",
  },
  {
    freq: 1620,
    absorbance: 0.35,
    intensityCode: 2,
    assignment: "δ(H–O–H)",
    assignment_uz: "H₂O ning H–O–H egilish (deformatsion)",
    intensity: "O'rtacha, keng",
    bond: "H–O–H",
    symmetry: "A₁ (lokal C₂v suv) → Raman va IQ",
    forceConstant: "0.75 mdyn·Å/rad²",
    bondLength: "—",
    region: "Egilish tebranishlar sohasi",
    freeLigand: "Erkin H₂O: δ(HOH) ≈ 1640 sm⁻¹",
    coordShift:
      "Deyarli o'zgarmagan (−20 sm⁻¹) — koordinatsiya H-O-H burchakka kam ta'sir qiladi",
    theoryNote:
      "H₂O ning H–O–H burchak deformatsiyasi. Bu tebranish O–H bog'lariga ta'sir qiladi, ammo Cu ga bog'lanish asosan O ning elektron juftini qamrab oladi. H atomlari harakati koordinatsiya ta'siridan kam o'zgaradi. Erkin suvning δ(HOH) polosasi bilan qoplanishi mumkin.",
    diagnostic: "H₂O ligandining saqlanganligini tasdiqlaydi (parchalanmagan)",
    animation: "hoh-bend",
  },
  {
    freq: 895,
    absorbance: 0.25,
    intensityCode: 2,
    assignment: "ρᵣ(H₂O) rocking",
    assignment_uz: "H₂O ligandining rocking (chayqalish) tebranishi",
    intensity: "O'rta-zaif",
    bond: "H₂O–Cu",
    symmetry: "Aq, B₁ (D₄ₕ) → Raman va IQ ikkalasida",
    forceConstant: "0.42 mdyn·Å/rad²",
    bondLength: "—",
    region: "Ligand rocking sohasi (koordinatsion suvga xos)",
    freeLigand: "—  (faqat koordinatsion H₂O da mavjud)",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "H₂O ligandining Cu–O bog'i atrofida chayqalishi. Bu tebranish erkin suvda mavjud emas — faqat koordinatsion H₂O ligandi uchun. Ekvatorial (kuchli bog'lanish) va aksial (zaif) H₂O ligandlarining rocking chastotalari farqli bo'lishi mumkin (~50 sm⁻¹). Kristallografik tuz spektrida ikki alohida polosa ko'rinishi mumkin.",
    diagnostic: "Koordinatsion H₂O mavjudligini tasdiqlaydi (erkin suv YO'Q)",
    animation: "h2o-rock",
  },
  {
    freq: 535,
    absorbance: 0.42,
    intensityCode: 2,
    assignment: "ν(Cu–O)ax",
    assignment_uz: "Aksial Cu–O cho'zilishi (uzun bog', 2.38 Å)",
    intensity: "O'rtacha, keng",
    bond: "Cu–O aksial",
    symmetry: "A₁g (D₄ₕ) → Raman faol",
    forceConstant: "1.15 mdyn/Å",
    bondLength: "2.38 Å",
    region: "Metall–ligand cho'zilish sohasi (aksial)",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "🔥 YAN–TELLER BUZILISHNING NAMOYISHI. Aksial Cu–O bog'lari 2.38 Å — ekvatorialdan 0.41 Å UZUN. Bu Cu²⁺ ning d⁹ konfiguratsiyasi eg orbitallaridagi tengsiz to'ldirilishdan kelib chiqadi: d(z²)² va d(x²-y²)¹ — aksial (z o'qi) bo'ylab kamroq elektron zichlik. Natijada k(Cu–O ax) = 1.15 mdyn/Å (yumshoq). Bu polosa Raman spektrining KENGLIGI (~40 sm⁻¹) Jahn-Teller-ning dinamik tebranish xarakterini tasdiqlaydi.",
    diagnostic: "🌟 YAN–TELLER BUZILISHNING BEVOSITA RAMAN ISBOTI",
    animation: "cu-o-ax",
  },
  {
    freq: 440,
    absorbance: 0.92,
    intensityCode: 4,
    assignment: "νₛ(Cu–O)eq",
    assignment_uz: "Ekvatorial Cu–O simmetrik cho'zilishi (qisqa bog', 1.97 Å)",
    intensity: "Juda kuchli",
    bond: "Cu–O ekvatorial",
    symmetry: "A₁g (D₄ₕ) → Raman faol (IQ NOAKTIV)",
    forceConstant: "1.85 mdyn/Å",
    bondLength: "1.97 Å",
    region: "Metall–ligand cho'zilish sohasi — ASOSIY DIAGNOSTIKA",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "🌟 [Cu(H₂O)₆]²⁺ NING ENG KUCHLI VA XARAKTERLI RAMAN CHO'QQISI. 4 ta ekvatorial H₂O ligandi bir vaqtda Cu ga simmetrik ravishda yaqinlashadi va uzoqlashadi. D₄ₕ simmetriyada A₁g ga tegishli → inversiya markazi orqali gerade → RAMANDA JUDA KUCHLI, IQ da rasman NOAKTIV (mutual exclusion). k = 1.85 mdyn/Å — [Co(NH₃)₆]³⁺ (1.85) ga teng! Ammo Cu–O ax (1.15) dan sezilarli mustahkam. Bu tetragonal buzilishning kvantitativ o'lchovi. Chiziq nisbatan keng (~25 sm⁻¹) — dinamik Jahn–Teller effekti tufayli.",
    diagnostic:
      "🌟 [Cu(H₂O)₆]²⁺ NING ASOSIY RAMAN BARMOQ IZI — Yan–Teller buzilishning kvantitativ ko'rsatkichi",
    animation: "cu-o-eq-sym",
  },
  {
    freq: 390,
    absorbance: 0.28,
    intensityCode: 2,
    assignment: "νₐₛ(Cu–O)eq",
    assignment_uz: "Ekvatorial Cu–O asimmetrik cho'zilishi",
    intensity: "O'rta-zaif (Ramanda), IQ da kuchli",
    bond: "Cu–O ekvatorial",
    symmetry: "Eᵤ (D₄ₕ) → faqat IQ faol, RAMAN NOAKTIV",
    forceConstant: "1.80 mdyn/Å",
    bondLength: "1.97 Å",
    region: "Metall–ligand cho'zilish sohasi",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "Ekvatorial 4 ta Cu–O bog'ining asimmetrik cho'zilishlari — 2 tasi cho'ziladi, 2 tasi qisqaradi. D₄ₕ da Eᵤ ga tegishli — MUTUAL EXCLUSION bo'yicha faqat IQ faol, Raman da rasman noaktiv. Ammo eritmada solvatatsiya va dinamik Yan-Teller tufayli simmetriya buzilib, zaif Raman polosa sifatida ko'rinishi mumkin. IQ da 380–410 sm⁻¹ da kuchli.",
    diagnostic: "D₄ₕ simmetriya isboti (Raman noaktiv → IQ da faol)",
    animation: "cu-o-eq-asym",
  },
  {
    freq: 320,
    absorbance: 0.35,
    intensityCode: 2,
    assignment: "νₛ(Cu–O)ax + eg tebranish",
    assignment_uz:
      "Aksial va ekvatorial bog'lar kombinatsion tebranishi (dinamik JT)",
    intensity: "O'rtacha, KENG",
    bond: "Cu–O mixed",
    symmetry: "Eg (D₄ₕ) — dinamik JT ta'siri",
    forceConstant: "1.05 mdyn/Å",
    bondLength: "—",
    region: "Uzoq Raman (< 400 sm⁻¹) — JT dinamik zona",
    freeLigand: "—",
    coordShift: "Faqat dinamik JT ta'sirida",
    theoryNote:
      "🔬 DINAMIK YAN-TELLER EFFEKTINING FINGERPRINT. Ekvatorial va aksial Cu–O bog'lari orasidagi tebranish o'zaro tanlashi (mode coupling). Eg simmetriyaga tegishli, JT modasining o'zi bo'lishi mumkin. Chastotasi 10⁻¹¹ s xarakterli tebranish vaqti bilan mos keladi. Xona haroratida keng va yumshoq polosa — bu polosaning kengligi va shakli JT dinamikasi haqida bevosita ma'lumot beradi.",
    diagnostic: "Dinamik Jahn-Teller tebranishlarining ko'rsatkichi",
    animation: "jt-dynamic",
  },
  {
    freq: 240,
    absorbance: 0.32,
    intensityCode: 2,
    assignment: "δ(O–Cu–O)eq",
    assignment_uz: "Ekvatorial O–Cu–O burchak deformatsiyasi",
    intensity: "O'rtacha",
    bond: "O–Cu–O burchak",
    symmetry: "B₂g (D₄ₕ) → Raman faol",
    forceConstant: "0.30 mdyn·Å/rad²",
    bondLength: "—",
    region: "Skelet deformatsiya sohasi",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "Ekvatorial 4 ta H₂O ligandi Cu atomiga nisbatan hosil qilgan tekislikning deformatsion tebranishi. B₂g simmetriya, Raman faol. Bu moda tetragonal simmetriyaning saqlanishini tekshiradi. Agar simmetriya oktaedrikga o'zgarsa (past haroratda yoki tashqi bosimda), bu polosa kuchli o'zgaradi.",
    diagnostic: "Ekvatorial tekislikning saqlanishini tasdiqlaydi",
    animation: "o-cu-o-eq-bend",
  },
  {
    freq: 165,
    absorbance: 0.28,
    intensityCode: 2,
    assignment: "δ(O–Cu–O)ax",
    assignment_uz: "Aksial O–Cu–O burchak deformatsiyasi",
    intensity: "O'rta-zaif",
    bond: "O–Cu–O aksial",
    symmetry: "Πᵤ (agar chiziqli) yoki Eᵤ (D₄ₕ) → IQ, silent Raman",
    forceConstant: "0.15 mdyn·Å/rad²",
    bondLength: "—",
    region: "Uzoq Raman (< 200 sm⁻¹)",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote:
      "Aksial 2 ta H₂O ligandi Cu atomiga nisbatan hosil qilgan chiziqning burchak deformatsiyasi (aksial O–Cu–O = 180° dan chetlanish). k = 0.15 juda past — bu aksial bog'lanishning nihoyatda yumshoqligini tasdiqlaydi (Jahn-Teller natijasi). Kristallda pastroq, eritmada esa dinamik va yanada yumshoq.",
    diagnostic: "Aksial bog'lanishning yumshoqligini xarakterlaydi",
    animation: "o-cu-o-ax-bend",
  },
  {
    freq: 110,
    absorbance: 0.18,
    intensityCode: 1,
    assignment: "Lattice / dinamik JT",
    assignment_uz: "Kristall panjara va dinamik JT modalari",
    intensity: "Zaif, keng",
    bond: "Cu···H₂O tashqi",
    symmetry: "Turli (kristallda past simmetriya)",
    forceConstant: "~0.05 mdyn/Å",
    bondLength: "~3.0 Å (H-bond)",
    region: "Uzoq Raman (< 150 sm⁻¹)",
    freeLigand: "—",
    coordShift: "Faqat kompleks va kristall panjarada",
    theoryNote:
      "Ikkinchi koordinatsion sferaning vodorod bog'lariga oid tebranishlar va dinamik Yan-Teller modalari. Chastota juda past va keng — [Cu(H₂O)₆]²⁺ ning tuz kristalida (CuSO₄·5H₂O) alohida polosalar sifatida ko'rinadi. Kriostatda (77 K) polosalar keskin ajraladi va JT dinamik ↔ statik o'tishning bevosita kuzatilishiga imkon beradi.",
    diagnostic: "Dinamik-statik JT o'tishini xarakterlaydi",
    animation: "lattice-jt",
  },
];

// To'liq Raman spektri nuqtalari (Lorentzian shakl uchun)
const ramanSpectrum = [
  { freq: 3800, intensity: 0.02 },
  { freq: 3600, intensity: 0.15 },
  { freq: 3500, intensity: 0.4 },
  { freq: 3450, intensity: 0.6 },
  { freq: 3350, intensity: 0.75 },
  { freq: 3220, intensity: 0.85 },
  { freq: 3100, intensity: 0.5 },
  { freq: 3000, intensity: 0.15 },
  { freq: 2500, intensity: 0.03 },
  { freq: 2000, intensity: 0.03 },
  { freq: 1800, intensity: 0.05 },
  { freq: 1700, intensity: 0.15 },
  { freq: 1620, intensity: 0.35 },
  { freq: 1500, intensity: 0.1 },
  { freq: 1200, intensity: 0.05 },
  { freq: 1000, intensity: 0.08 },
  { freq: 950, intensity: 0.18 },
  { freq: 895, intensity: 0.25 },
  { freq: 800, intensity: 0.1 },
  { freq: 700, intensity: 0.08 },
  { freq: 600, intensity: 0.15 },
  { freq: 535, intensity: 0.42 },
  { freq: 500, intensity: 0.55 },
  { freq: 470, intensity: 0.75 },
  { freq: 440, intensity: 0.92 },
  { freq: 420, intensity: 0.6 },
  { freq: 390, intensity: 0.28 },
  { freq: 350, intensity: 0.3 },
  { freq: 320, intensity: 0.35 },
  { freq: 280, intensity: 0.25 },
  { freq: 240, intensity: 0.32 },
  { freq: 200, intensity: 0.2 },
  { freq: 165, intensity: 0.28 },
  { freq: 130, intensity: 0.2 },
  { freq: 110, intensity: 0.18 },
  { freq: 80, intensity: 0.1 },
];

// Yan-Teller effekti d⁹ komplekslar taqqoslashi
const jahnTellerSeries = [
  {
    formula: "[Cu(H₂O)₆]²⁺",
    dConfig: "d⁹",
    eqBond: 1.97,
    axBond: 2.38,
    jtDist: 0.41,
    nuEq: 440,
    nuAx: 535,
    mueff: 1.95,
    notes: "🌟 Klassik JT namunasi",
    current: true,
  },
  {
    formula: "[Cu(NH₃)₄(H₂O)₂]²⁺",
    dConfig: "d⁹",
    eqBond: 2.03,
    axBond: 2.59,
    jtDist: 0.56,
    nuEq: 420,
    nuAx: 285,
    mueff: 1.9,
    notes: "Kuchli JT (NH₃ + H₂O aralash)",
    current: false,
  },
  {
    formula: "[Cu(en)₃]²⁺",
    dConfig: "d⁹",
    eqBond: 2.05,
    axBond: 2.48,
    jtDist: 0.43,
    nuEq: 410,
    nuAx: 350,
    mueff: 1.85,
    notes: "Xelat JT",
    current: false,
  },
  {
    formula: "[Cr(H₂O)₆]²⁺",
    dConfig: "d⁴ HS",
    eqBond: 2.1,
    axBond: 2.35,
    jtDist: 0.25,
    nuEq: 440,
    nuAx: 380,
    mueff: 4.9,
    notes: "Boshqa JT namunasi, HS d⁴",
    current: false,
  },
  {
    formula: "[Mn(H₂O)₆]³⁺",
    dConfig: "d⁴ HS",
    eqBond: 1.94,
    axBond: 2.2,
    jtDist: 0.26,
    nuEq: 505,
    nuAx: 425,
    mueff: 4.9,
    notes: "Kuchli oksidlovchi",
    current: false,
  },
  {
    formula: "[Ni(H₂O)₆]²⁺",
    dConfig: "d⁸",
    eqBond: 2.06,
    axBond: 2.06,
    jtDist: 0.0,
    nuEq: 390,
    nuAx: 390,
    mueff: 3.2,
    notes: "❌ JT YO'Q — ideal Oₕ",
    current: false,
  },
  {
    formula: "[Co(H₂O)₆]²⁺",
    dConfig: "d⁷ HS",
    eqBond: 2.11,
    axBond: 2.11,
    jtDist: 0.0,
    nuEq: 380,
    nuAx: 380,
    mueff: 4.8,
    notes: "❌ JT YO'Q — ideal Oₕ",
    current: false,
  },
];

// Akvakomplekslar Raman qatori — 3d qatordagi M(II) [M(H₂O)₆]²⁺
const aquaSeries = [
  {
    formula: "[V(H₂O)₆]²⁺",
    metal: "V²⁺",
    dConfig: "d³",
    bondL: 2.14,
    nuMO: 400,
    color: "binafsha",
    stability: "Havoda beqaror",
  },
  {
    formula: "[Cr(H₂O)₆]²⁺",
    metal: "Cr²⁺",
    dConfig: "d⁴ HS",
    bondL: 2.12,
    nuMO: 440,
    color: "havorang",
    stability: "JT + beqaror",
    jt: true,
  },
  {
    formula: "[Mn(H₂O)₆]²⁺",
    metal: "Mn²⁺",
    dConfig: "d⁵ HS",
    bondL: 2.2,
    nuMO: 380,
    color: "och pushti",
    stability: "Barqaror",
  },
  {
    formula: "[Fe(H₂O)₆]²⁺",
    metal: "Fe²⁺",
    dConfig: "d⁶ HS",
    bondL: 2.13,
    nuMO: 380,
    color: "yashilroq",
    stability: "Havoda oksidlanadi",
  },
  {
    formula: "[Co(H₂O)₆]²⁺",
    metal: "Co²⁺",
    dConfig: "d⁷ HS",
    bondL: 2.11,
    nuMO: 380,
    color: "qizil–pushti",
    stability: "Barqaror",
  },
  {
    formula: "[Ni(H₂O)₆]²⁺",
    metal: "Ni²⁺",
    dConfig: "d⁸",
    bondL: 2.06,
    nuMO: 390,
    color: "yashil",
    stability: "Juda barqaror",
  },
  {
    formula: "[Cu(H₂O)₆]²⁺",
    metal: "Cu²⁺",
    dConfig: "d⁹",
    bondL: "1.97/2.38",
    nuMO: 440,
    color: "🌟 havorang",
    stability: "JT buzilgan",
    jt: true,
    current: true,
  },
  {
    formula: "[Zn(H₂O)₆]²⁺",
    metal: "Zn²⁺",
    dConfig: "d¹⁰",
    bondL: 2.09,
    nuMO: 385,
    color: "rangsiz",
    stability: "Barqaror, ideal Oₕ",
  },
];

// Namuna tayyorlash usullari
const techniques = [
  {
    name: "Suvli eritma (0.1–1 M)",
    description:
      "0.5 M CuSO₄·5H₂O yoki Cu(NO₃)₂·3H₂O ni distillangan suvda eritib, 4 mm kvarts kyuvetada Raman o'lchash. 785 nm yoki 1064 nm NIR lazer (fluoresensiya kam).",
    advantages: [
      "To'g'ridan-to'g'ri [Cu(H₂O)₆]²⁺ turini o'rganish",
      "Dinamik JT to'g'ridan-to'g'ri kuzatiladi",
      "Konsentratsion effektlarni tekshirish",
      "Rangli havorang eritma — vizual tasdiq",
      "10⁻² M gacha yaxshi signal",
    ],
    disadvantages: [
      "Suv Raman polosalari (3400, 1640 sm⁻¹) N–H sohasini qoplaydi",
      "Cu²⁺ ning rangi tufayli 532 nm lazer bilan qizish xavfi",
      "Konsentratsion pH ta'siri (past pH da [Cu(OH₂)ₙ]²⁺ ↔ [Cu(OH)(OH₂)ₙ]⁺)",
      "Anion ta'siri (SO₄²⁻, NO₃⁻ o'z polosalari)",
    ],
    bestFor: "Dinamik JT, suvli koordinatsiya, standart Cu(II) o'rganish",
    freqRange: "100–3800 sm⁻¹",
    resolution: "2 sm⁻¹",
    samplePrep: "5–10 daq",
  },
  {
    name: "D₂O eritmasi (deuterlangan)",
    description:
      "D₂O da 0.5 M Cu(NO₃)₂ eritib, [Cu(D₂O)₆]²⁺ hosil qilinadi. O–H polosalari 2500 sm⁻¹ ga siljiydi va Cu–O zonasi to'liq ochiladi.",
    advantages: [
      "ν(O–D) = 2400 sm⁻¹ — H sohasi ochiladi",
      "Cu–O polosalari aniq ko'rinadi",
      "Kuch konstantasini aniq o'lchash",
      "Isotop siljish tahlili orqali tayinlash tekshirish",
      "O–D/O–H = 1.37 nisbat mos keladi",
    ],
    disadvantages: [
      "D₂O qimmat (kg 1000 USD)",
      "Deuterium almashinuvi H₂O + D₂O da tez",
      "Yopiq kyuvetada saqlash",
      "H₂O ifloslanishi 5% dan oshsa spektr buziladi",
    ],
    bestFor: "Aniq chastotalar, isotop tahlil, fundamental tebranish o'rganish",
    freqRange: "100–3600 sm⁻¹ (O–D so'choq)",
    resolution: "1 sm⁻¹",
    samplePrep: "10 daq",
  },
  {
    name: "Kristall gidrat (CuSO₄·5H₂O)",
    description:
      "Ko'k mis kuporosi kristali to'g'ridan-to'g'ri Raman mikroskopi ostiga qo'yiladi. Statik Yan-Teller aniq kuzatiladi.",
    advantages: [
      "Statik JT — aniq D₄ₕ simmetriya",
      "Aniq chiziqlar (~5 sm⁻¹ yarim kenglik)",
      "Namuna butun (10 mg yetarli)",
      "Uzoq Raman zonasi ochiq",
      "SO₄²⁻ ichki referens (983 sm⁻¹)",
    ],
    disadvantages: [
      "Kristall orientatsiya intensivlikni ±30% o'zgartiradi",
      "SO₄²⁻ ν₁ (983 sm⁻¹) kuchli, Cu–O ni qoplashi mumkin",
      "Kristallning tarangligi natijasi buzilish darajasini o'zgartiradi",
      "H₂O yo'qotish (60 °C dan yuqorida)",
    ],
    bestFor: "Statik JT, aniq skelet tebranishlari, kristallografik tahlil",
    freqRange: "50–4000 sm⁻¹",
    resolution: "1–2 sm⁻¹",
    samplePrep: "1 daq",
  },
  {
    name: "Past haroratli (77 K, kriostat)",
    description:
      "CuSO₄·5H₂O yoki eritmani kriostatga qo'yib suyuq azot bilan 77 K gacha sovutish. Dinamik JT to'xtaydi va statik JT ajratiladi.",
    advantages: [
      "Dinamik → statik JT o'tishni bevosita kuzatish",
      "Chiziq yarim kengligi 5× kamayadi",
      "Aksial va ekvatorial polosalar aniq ajraladi",
      "eg orbitallar splitting ko'rinadi",
      "Anti-Stokes minimallashadi",
    ],
    disadvantages: [
      "Maxsus kriostat (10 000+ USD)",
      "N₂(l) muntazam to'ldirish",
      "Ba'zi ma'lumotlar biologik tizimlarga qo'llanmaydi",
      "Sekin (soatlar) o'lchash",
    ],
    bestFor: "JT dinamikasi, tunneling, splitting energiyasini o'lchash",
    freqRange: "20–4000 sm⁻¹",
    resolution: "0.5–1 sm⁻¹",
    samplePrep: "1–2 soat",
  },
];

// Halaqit beruvchi omillar
const interferences = [
  {
    source: "Suvning Raman polosalari",
    freqRange: "3400 (ν(OH)), 1640 (δ(HOH))",
    effect:
      "Kuchli suv polosalari [Cu(H₂O)₆]²⁺ ning bu sohadagi polosalarni butunlay qoplaydi",
    severity: "Yuqori",
    solution:
      "D₂O eritmasi ishlatish (ν(OD) = 2400 sm⁻¹ ga siljiydi). Yoki sof suv Raman spektrini alohida yozib olib, ayirish (subtraction). Kriostatik holatda muzloq muzning polosalari boshqacha bo'ladi.",
  },
  {
    source: "SO₄²⁻ / NO₃⁻ / ClO₄⁻ qarshi ionlarining Raman",
    freqRange: "SO₄²⁻: 983 (ν₁), NO₃⁻: 1050, ClO₄⁻: 935",
    effect:
      "Qarshi ionlarning A₁ simmetrik cho'zilishlari juda kuchli, Cu–O sohasi bilan uchrashishi mumkin",
    severity: "O'rta",
    solution:
      "ClO₄⁻ (935 sm⁻¹) — Cu–O eq (440) dan uzoq va shu bois eng zararsiz. NO₃⁻ (1050) bo'sh soha. SO₄²⁻ (983) esa yaqin, ehtiyot bilan. Anionsiz Cu(OH)₂ dan eritma tayyorlash.",
  },
  {
    source: "Cu²⁺ ning rangi va fluoresensiya",
    freqRange: "Butun spektr, keng fon",
    effect:
      "Ko'k rang tufayli 532 nm va 633 nm lazerlarda kuchli yutilish va fluoresensiya (Cu²⁺ d-d o'tishlari)",
    severity: "Yuqori",
    solution:
      "785 nm yoki 1064 nm NIR lazer (FT-Raman). d-d yutilish maksimumidan uzoqda (810 nm gacha). Fotoblanching (2-3 daqiqa lazer). Past quvvat (5-10 mW).",
  },
  {
    source: "Cu²⁺ ning fotoqaytarilishi",
    freqRange: "Cu–O polosalar susayishi",
    effect:
      "UV va ko'k lazerlarda Cu²⁺ + e⁻ → Cu⁺ (mavjud aralashmalar bilan reaksiya) va Cu⁰ cho'kmasi",
    severity: "O'rta",
    solution:
      "NIR lazer (785+ nm). Reduktorlar (fenol, formaldegid) mavjudligini istisno qilish. N₂ atmosferada. Namuna aylantirish (spinning stage).",
  },
  {
    source: "pH o'zgarishi va gidroliz",
    freqRange: "Barcha Cu–O polosalar",
    effect:
      "pH > 5 da [Cu(H₂O)₆]²⁺ → [Cu(OH)(OH₂)₅]⁺ → Cu(OH)₂↓ ko'k cho'kma hosil bo'ladi",
    severity: "Yuqori",
    solution:
      "pH 3–4 da nordon eritma (razb. HClO₄ yoki HNO₃). Cu²⁺ konsentratsiyasi 0.1 M dan past. Yopiq kyuvetada CO₂ atmosferasidan himoya (CO₂ pH ni pasaytiradi).",
  },
  {
    source: "Dinamik Jahn-Teller uchburchak",
    freqRange: "440 ± 40, 535 ± 40",
    effect:
      "Uch xil D₄ₕ orientatsiya (x, y, z aksial) o'rtasidagi tez tebranish chiziq shaklini keng va assimetrik qiladi",
    severity: "O'rta (tabiiy)",
    solution:
      "Bu halaqit emas — bu Cu(II) ning ichki xususiyati! Past haroratda (77 K) dinamik ↔ statik o'tish sodir bo'ladi va chiziqlar ajraladi. Kristall panjara ta'siri buzilishni statiklashtiradi.",
  },
  {
    source: "Vodorod bog'lanish tarmog'i",
    freqRange: "ν(O–H) sohasi kengayishi",
    effect:
      "Suv ligandlari orasidagi va tashqi suv molekulalari bilan H-bonds ν(O–H) polosalarni juda kengaytiradi (~200 sm⁻¹)",
    severity: "O'rta",
    solution:
      "Konsentrlangan eritma (H-bonding tarmog'i qisqaradi). NaClO₄ qo'shish (ionli kuch oshiradi). Past harorat H-bonds ni statiklashtiradi.",
  },
  {
    source: "Reley sochilishi (elastik)",
    freqRange: "< 150 sm⁻¹",
    effect:
      "Elastik sochilish 100 sm⁻¹ dan pastdagi lattice va JT modalarni bekitib qo'yadi",
    severity: "O'rta",
    solution:
      "Volume Bragg Grating (VBG) yoki triple monoxromator. 5–10 sm⁻¹ gacha yaqinlashish. Uzoq Raman spektrometri.",
  },
];

// Guruh nazariyasi ma'lumotlari
const groupTheoryData = {
  pointGroup:
    "Statik: D₄ₕ (Yan-Teller cho'zilgan tetragonal); Dinamik o'rtacha: Oₕ",
  alternativeGroup: "Th (agar H₂O H atomlari ham hisobga olinsa)",
  order: 16,
  operations: "E, 2C₄, C₂, 2C₂', 2C₂'', i, 2S₄, σₕ, 2σᵥ, 2σd (D₄ₕ)",
  totalModes: "3N − 6 = 3(19) − 6 = 51 ta normal moda (Cu + 6O + 12H)",
  reducibleRep: "Γᵥⁱᵇ(skelet CuO₆) = 2A₁g + Eg + 2B₁g + B₂g + 2Eᵤ + 2A₂ᵤ (D₄ₕ)",
  ramanActive: "A₁g (νₛ Cu-O eq: 440, ν(Cu-O ax): 535), Eg, B₁g, B₂g",
  irActive: "Eᵤ (νₐₛ Cu-O eq: 390), A₂ᵤ (νₐₛ Cu-O ax)",
  silent: "Ba'zi ligand modalar simmetriya buzilishi tufayli qisman faol",
  mutualExclusion:
    "🔥 D₄ₕ da inversiya markazi (Cu) mavjud → g-modalar faqat Raman, u-modalar faqat IQ. Bu Cu(II) uchun ideal skelet uchun to'g'ri.",
  keyModes:
    "νₛ(Cu-O)eq = 440 (A₁g, Raman); ν(Cu-O)ax = 535 (A₁g, Raman); νₐₛ(Cu-O)eq = 390 (Eᵤ, IQ)",
  jtSplitting:
    "Oₕ dan D₄ₕ ga o'tishda: T₁ᵤ → A₂ᵤ + Eᵤ (IQ); Eg → A₁g + B₁g (Raman); T₂g → B₂g + Eg (Raman)",
};

// Kuch konstantasi taqqoslashi
const forceConstantExamples = [
  {
    bond: "O–H (erkin H₂O)",
    k: 7.66,
    freq: 3657,
    note: "Erkin suv, taqqoslash",
  },
  {
    bond: "O–H ([Cu(H₂O)₆]²⁺)",
    k: 7.2,
    freq: 3220,
    note: "🌟 Koordinatsiya + H-bond ta'siri",
  },
  {
    bond: "Cu–O eq ([Cu(H₂O)₆]²⁺)",
    k: 1.85,
    freq: 440,
    note: "🌟 Ekvatorial (qisqa 1.97 Å) — kuchli",
  },
  {
    bond: "Cu–O ax ([Cu(H₂O)₆]²⁺)",
    k: 1.15,
    freq: 535,
    note: "🌟 Aksial (uzun 2.38 Å) — YUMSHOQ (JT)",
  },
  {
    bond: "Co–N ([Co(NH₃)₆]³⁺)",
    k: 1.85,
    freq: 503,
    note: "d⁶ LS Oₕ, taqqoslash",
  },
  { bond: "Fe–C ([Fe(CN)₆]³⁻)", k: 2.1, freq: 390, note: "π-akseptor kuchli" },
  {
    bond: "Ni–O ([Ni(H₂O)₆]²⁺)",
    k: 1.65,
    freq: 390,
    note: "d⁸, ideal Oₕ, JT yo'q",
  },
  { bond: "Ag–N ([Ag(NH₃)₂]⁺)", k: 1.48, freq: 375, note: "d¹⁰, chiziqli D∞h" },
  {
    bond: "Zn–O ([Zn(H₂O)₆]²⁺)",
    k: 1.6,
    freq: 385,
    note: "d¹⁰, ideal Oₕ, taqqoslash",
  },
  {
    bond: "Cr–O ([Cr(H₂O)₆]²⁺)",
    k: 1.55,
    freq: 380,
    note: "d⁴ HS, kuchsizroq JT",
  },
];

// Yan-Teller effekti tavsifi (batafsil)
const jahnTellerDetails = {
  theorem:
    "H.A. Jahn & E. Teller (1937): «Chiziqli bo'lmagan molekula orbital jihatdan degenerate elektronik holatda barqaror bo'la olmaydi — u simmetriyani pasaytirib, degenerativlikni buzadi va energiyani pasaytiradi.»",
  cuIIcase:
    "Cu²⁺ ning d⁹ konfiguratsiyasi eg orbitallarida degenerate: (d(z²))²(d(x²-y²))¹ ↔ (d(z²))¹(d(x²-y²))². Bu ikki holatning energiyalari teng — 2Eg holat. Simmetriyani D₄ₕ ga pasaytirish orqali degenerativlik yo'qoladi.",
  distortion:
    "Cu²⁺ akvakomplekside AKSIAL cho'zilish afzalroq: aksial (z o'qi) H₂O molekulalari Cu dan uzoqlashadi (2.38 Å), ekvatorial esa yaqinlashadi (1.97 Å). Farq 0.41 Å — juda katta buzilish.",
  energy:
    "Yan-Teller stabilizatsiya energiyasi ~1250 sm⁻¹ (15 kJ/mol) — bu Cu(II) komplekslarining reaktivligi va spektroskopik xususiyatlariga sezilarli ta'sir qiladi.",
  dynamic:
    "Xona haroratida buzilish yo'nalishi (x, y, z) 10⁻¹¹ s da tebranadi (fluxional). Uchburchak simmetriya (dinamik o'rtacha) Oₕ ga o'xshaydi. 77 K da statik JT ga o'tadi.",
  ramanFingerprint:
    "Raman spektroskopiyada JT ning bevosita ko'rsatkichlari: (1) ν(Cu-O eq) va ν(Cu-O ax) chastotalari orasida katta farq (95 sm⁻¹); (2) Raman polosalari KENG (dinamik JT); (3) A₁g bo'lmagan modalar ba'zan yumshoqroq (JT-tenglama modalari).",
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CuH2O6Raman() {
  const [activePeak, setActivePeak] = useState(5); // 440 sm⁻¹ (νₛ(Cu-O eq)) default — diagnostik
  const [freqSlider, setFreqSlider] = useState(440);
  const [activeTechnique, setActiveTechnique] = useState(0);
  const [activeInterference, setActiveInterference] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [jtView, setJtView] = useState("elongated"); // elongated | compressed | undistorted
  const [pdfSections, setPdfSections] = useState({
    identification: true,
    theory: true,
    jahnTeller: true,
    peaks: true,
    spectrum: true,
    groupTheory: true,
    forceConstant: true,
    jtSeries: true,
    aquaSeries: true,
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
        cyan: rgb(0.08, 0.72, 0.92),
        cyanDeep: rgb(0.05, 0.55, 0.72),
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
        bgCyan: rgb(0.9, 0.98, 1.0),
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
          `JDA-Kimyo Raman Tahlili  •  [Cu(H₂O)₆]²⁺ (Yan-Teller)  •  ${new Date().toLocaleDateString("uz-UZ")}`,
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
          color: C.cyan,
        });
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10,
          y: y - 14,
          size: 13,
          font: boldFont,
          color: C.cyanDeep,
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
        bgColor = C.bgCyan,
        labelColor = C.cyanDeep,
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
        "JDA-KIMYO ILMIY BYULLETENI  •  Raman Spektroskopiya  •  Vol. 2, Son 5",
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
      safeText("Koordinatsion Kimyo — Yan-Teller Effekti va Dinamik Buzilish", {
        x: MARGIN,
        y: PAGE_H - 52,
        size: 8,
        font: regularFont,
        color: rgb(0.71, 0.71, 0.86),
        maxWidth: CONTENT_W * 0.65,
      });
      safeText("DOI: 10.0000/jda-kimyo.raman.2026.003", {
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
        `[Cu(H₂O)₆]²⁺ — Raman Spektroskopik Tahlili`,
        y,
        20,
        boldFont,
        C.textDark,
      );
      y -= 28;
      drawCenteredText(
        "Geksaakvamis(II) kationi  •  «Yan-Teller Klassik Namunasi»",
        y,
        12,
        italicFont,
        C.purpleSoft,
      );
      y -= 20;
      drawCenteredText(
        `Simmetriya: D₄ₕ (JT statik) / Oₕ (dinamik o'rtacha)  •  Konfiguratsiya: d⁹  •  Paramagnit  •  M = 171.62 g/mol`,
        y,
        9,
        regularFont,
        C.textMuted,
      );
      y -= 28;

      // ─── ANNOTATSIYA ─────────────────────────────────────
      const abstract =
        `Geksaakvamis(II) kompleksi [Cu(H₂O)₆]²⁺ — koordinatsion kimyoning eng ta'sirchan Yan-Teller ` +
        `effekti namunasidir. d⁹ konfiguratsiya (t₂g⁶ eg³) tufayli oktaedrik simmetriya D₄ₕ ga buziladi: ` +
        `ekvatorial 4 ta Cu-O bog'i qisqaradi (1.97 Å), aksial 2 ta esa cho'ziladi (2.38 Å) — farq 0.41 Å. ` +
        `Ushbu ishda uning Raman spektri 100-3800 sm⁻¹ diapazonda batafsil tahlil qilingan. Diagnostik ` +
        `cho'qqilar: νₛ(Cu-O)eq = 440 sm⁻¹ (A₁g, ekvatorial simmetrik cho'zilish — asosiy Raman cho'qqisi); ` +
        `ν(Cu-O)ax = 535 sm⁻¹ (A₁g, aksial cho'zilish); νₐₛ(Cu-O)eq = 390 sm⁻¹ (Eᵤ, faqat IQ da); ` +
        `νₛ(O-H) = 3220 sm⁻¹. Kuch konstantalari: k(Cu-O)eq = 1.85 mdyn/Å (ekvatorial, kuchli) va ` +
        `k(Cu-O)ax = 1.15 mdyn/Å (aksial, YUMSHOQ — JT natijasi). Bu 60% farq Yan-Teller stabilizatsiya ` +
        `energiyasi ~1250 sm⁻¹ (15 kJ/mol) ga mos keladi. Raman polosalarining ENGLIGI (~40 sm⁻¹) ` +
        `dinamik JT (τ ≈ 10⁻¹¹ s) ning bevosita ko'rsatkichidir.`;
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
          ["Formula", "[Cu(H₂O)₆]²⁺"],
          ["IUPAC nomi", "Geksaakvamis(II) kationi"],
          ["An'anaviy nomi", "Mis(II) akvakompleksi"],
          ["CAS raqami", "14946-74-8"],
          ["Molar massa", "171.62 g/mol"],
          ["Rangi", "Yorqin havorang (aqua-blue)"],
          ["d-d o'tish λmax", "810 nm (ε ≈ 12 M⁻¹cm⁻¹)"],
          ["Kristall gidrat", "CuSO₄·5H₂O (P4/nmm tetragonal)"],
          ["Nuqtaviy guruh (statik)", "D₄ₕ (Yan-Teller cho'zilgan)"],
          ["Nuqtaviy guruh (dinamik)", "Oₕ (o'rtacha, τ ≈ 10⁻¹¹ s)"],
          ["Metall ioni", "Cu²⁺ (d⁹)"],
          ["Cu-O ekvatorial", "1.97 Å (4 ta, qisqa)"],
          ["Cu-O aksial", "2.38 Å (2 ta, cho'zilgan)"],
          ["JT buzilish (Δd)", "0.41 Å (aksial cho'zilish)"],
          ["Magnetizm", "Paramagnit (μeff ≈ 1.95 μB)"],
          ["JT stabilizatsiya", "~1250 sm⁻¹ (15 kJ/mol)"],
          ["Kashfiyot", "1937 — H.A. Jahn & E. Teller (teorema)"],
          ["Kristallografiya", "1970 — B.J. Hathaway (XRD, Cu(II))"],
        ];
        idData.forEach((row, i) => {
          drawTableRow(
            row[0],
            row[1],
            i % 2 === 0 ? C.bgCyan : C.white,
            C.cyanDeep,
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
          "Raman spektroskopiya monoxromatik yorug'likning molekulyar tebranishlar bilan noelastik sochilishiga asoslangan (C.V. Raman, 1928; Nobel 1930). [Cu(H₂O)₆]²⁺ Yan-Teller effekti tufayli klassik oktaedrik komplekslardan tubdan farq qiladi:";
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
          "Raman tanlash qoidasi: (∂α/∂Q)₀ ≠ 0 — normal koordinata Q bo'yicha qutblanuvchanlik tenzori o'zgarishi zarur. D₄ₕ simmetriyasida A₁g modalar Raman-faol.",
          C.bgBlue,
          C.blue,
          C.textDark,
        );
        drawInfoBox(
          "Mutual Exclusion: D₄ₕ da inversiya markazi (Cu) mavjud → νₛ(Cu-O)eq (A₁g, 440) faqat Raman; νₐₛ(Cu-O)eq (Eᵤ, 390) faqat IQ. Bu Cu(II) uchun ideal skelet uchun to'g'ri.",
          C.bgBlue,
          C.blue,
          C.textDark,
        );
        drawInfoBox(
          "Yan-Teller natijasi: Oktaedrik ML₆ da Γᵥⁱᵇ(M-L) = A₁g + Eg + T₁ᵤ. D₄ₕ ga siljisa: Eg → A₁g + B₁g (Raman); T₁ᵤ → A₂ᵤ + Eᵤ (IQ). Yangi modalar paydo bo'ladi va chastotalar farqlanadi.",
          C.bgBlue,
          C.blue,
          C.textDark,
        );
        const t2 =
          "[Cu(H₂O)₆]²⁺ (19 atom, chiziqsiz) uchun 3N-6 = 51 ta normal moda mavjud. Skelet CuO₆ tebranishlar: A₁g (Raman) + Eg (Raman) + T₁ᵤ (IQ) — Oₕ da; D₄ₕ ga siljib bo'lingandan keyin: 2A₁g + Eg + 2B₁g + B₂g + 2Eᵤ + 2A₂ᵤ. Ekvatorial va aksial polosalar chastotalarining farqi (Δν = 95 sm⁻¹) — Yan-Teller stabilizatsiya energiyasining bevosita o'lchovidir.";
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

      // ─── 3. YAN-TELLER EFFEKTI ───────────────────────────
      if (pdfSections.jahnTeller) {
        drawSectionHeader(
          sectionNum++,
          "Yan-Teller Effekti — d⁹ Cu(II) klassik namunasi",
        );
        y -=
          drawWrappedText(jahnTellerDetails.theorem, {
            x: MARGIN,
            y,
            size: 9.5,
            font: italicFont,
            color: C.orangeDeep,
            maxWidth: CONTENT_W,
            lineHeight: 13,
          }) + 10;
        y -=
          drawWrappedText(jahnTellerDetails.cuIIcase, {
            x: MARGIN,
            y,
            size: 9.5,
            font: regularFont,
            color: C.textDark,
            maxWidth: CONTENT_W,
            lineHeight: 13,
          }) + 8;
        y -=
          drawWrappedText(jahnTellerDetails.distortion, {
            x: MARGIN,
            y,
            size: 9.5,
            font: regularFont,
            color: C.textDark,
            maxWidth: CONTENT_W,
            lineHeight: 13,
          }) + 8;
        drawInfoBox(jahnTellerDetails.energy, C.bgOrange, C.orange, C.textDark);
        drawInfoBox(
          jahnTellerDetails.dynamic,
          C.bgOrange,
          C.orange,
          C.textDark,
        );
        drawInfoBox(
          jahnTellerDetails.ramanFingerprint,
          C.bgOrange,
          C.orange,
          C.textDark,
        );
      }

      // ─── 4. CHO'QQILAR JADVALI ───────────────────────────
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
          color: C.cyanDeep,
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
              color: C.bgCyan,
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

      // ─── 5. GURUH NAZARIYASI ─────────────────────────────
      if (pdfSections.groupTheory) {
        drawSectionHeader(
          sectionNum++,
          "Guruh Nazariyasi — D₄ₕ Simmetriyasi (JT buzilgan)",
        );
        drawTableRow("Statik nuqtaviy guruh", groupTheoryData.pointGroup);
        drawTableRow("Guruh tartibi", `${groupTheoryData.order}`);
        drawTableRow("Simmetriya operatsiyalari", groupTheoryData.operations);
        drawTableRow("Umumiy tebranish modalar", groupTheoryData.totalModes);
        drawTableRow("Tebranish tasviri (CuO₆)", groupTheoryData.reducibleRep);
        drawTableRow("Raman-faol", groupTheoryData.ramanActive);
        drawTableRow("IQ-faol", groupTheoryData.irActive);
        drawTableRow("Mutual exclusion", groupTheoryData.mutualExclusion);
        drawTableRow("JT splitting (Oₕ → D₄ₕ)", groupTheoryData.jtSplitting);
        drawTableRow("Asosiy diagnostik modalar", groupTheoryData.keyModes);
        y -= 15;
      }

      // ─── 6. KUCH KONSTANTASI ─────────────────────────────
      if (pdfSections.forceConstant) {
        drawSectionHeader(sectionNum++, "Kuch Konstantasi Taqqoslashi");
        drawWrappedText(
          "Hooke qonuni ν̃ = (1/2πc)·√(k/μ) asosida. Cu-O eq (1.85) va Cu-O ax (1.15) mdyn/Å o'rtasidagi ~60% farq Yan-Teller buzilishning kvantitativ o'lchovidir:",
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
            i % 2 === 0 ? C.bgCyan : C.white,
          );
        });
        y -= 15;
      }

      // ─── 7. JT KOMPLEKSLAR ───────────────────────────────
      if (pdfSections.jtSeries) {
        drawSectionHeader(sectionNum++, "Yan-Teller d⁹ Komplekslar Qatori");
        drawWrappedText(
          "Cu(II) va boshqa JT-faol markazlar (Cr(II) d⁴, Mn(III) d⁴, Ag(II) d⁹). JT buzilishi darajasi (Δd) va ν(M-L) chastotalari orasidagi bog'lanish:",
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
        jahnTellerSeries.forEach((m, i) => {
          const highlight = m.current;
          drawTableRow(
            m.formula,
            `d: ${m.dConfig}  •  eq: ${m.eqBond}Å, ax: ${m.axBond}Å  •  Δd: ${m.jtDist}Å  •  νₑq: ${m.nuEq}  •  ${m.notes}`,
            highlight ? C.bgOrange : i % 2 === 0 ? C.bgCyan : C.white,
            highlight ? C.orangeDeep : C.cyanDeep,
          );
        });
        y -= 15;
      }

      // ─── 8. AQUA QATOR ───────────────────────────────────
      if (pdfSections.aquaSeries) {
        drawSectionHeader(
          sectionNum++,
          "3d M(II) Akvakomplekslar Qatori — [M(H₂O)₆]²⁺",
        );
        drawWrappedText(
          "Birinchi qator o'tuvchi metallarning aqua komplekslari. Cu(II) — d⁹ ning JT buzilishi bu qatordan sezilarli farq qiladi:",
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
        aquaSeries.forEach((m, i) => {
          const highlight = m.current;
          const jtNote = m.jt ? " [JT-faol]" : "";
          drawTableRow(
            m.formula,
            `${m.metal}  •  ${m.dConfig}  •  d(M-O): ${m.bondL} Å  •  ν: ${m.nuMO} sm⁻¹  •  ${m.color}  •  ${m.stability}${jtNote}`,
            highlight ? C.bgOrange : i % 2 === 0 ? C.bgCyan : C.white,
            highlight ? C.orangeDeep : C.cyanDeep,
          );
        });
        y -= 15;
      }

      // ─── 9. NAMUNA TAYYORLASH ────────────────────────────
      if (pdfSections.techniques) {
        drawSectionHeader(sectionNum++, "Namuna Tayyorlash Usullari");
        techniques.forEach((t, idx) => {
          checkPageBreak(180);
          page.drawRectangle({
            x: MARGIN,
            y: y - 22,
            width: CONTENT_W,
            height: 22,
            color: C.cyanDeep,
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

      // ─── 10. HALAQIT OMILLARI ────────────────────────────
      if (pdfSections.interferences) {
        drawSectionHeader(
          sectionNum++,
          "Raman Tahliliga Halaqit Beruvchi Omillar",
        );
        drawWrappedText(
          "[Cu(H₂O)₆]²⁺ Raman spektroskopiyasida asosiy muammolar suv polosalari va Cu(II) ning rangi tufayli fluoresensiya. Dinamik Yan-Teller esa aslida ma'lumot manbai:",
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

      // ─── 11. XULOSALAR ───────────────────────────────────
      if (pdfSections.conclusions) {
        drawSectionHeader(sectionNum++, "Asosiy Xulosalar");
        const conclusions = [
          "[Cu(H₂O)₆]²⁺ Yan-Teller buzilishining klassik namunasidir: ekvatorial Cu-O (1.97 Å) va aksial Cu-O (2.38 Å) 0.41 Å farqi katta stabilizatsiya (15 kJ/mol) beradi. Bu 1937-yildagi Jahn-Teller teoremasining eng aniq eksperimental tasdig'i.",
          "Raman spektrida ν(Cu-O)eq = 440 sm⁻¹ (A₁g) — asosiy diagnostik cho'qqi. k = 1.85 mdyn/Å [Co(NH₃)₆]³⁺ (Oₕ) bilan bir xil, lekin Cu-O ax (k=1.15) sezilarli yumshoq.",
          "Ν(Cu-O)ax = 535 sm⁻¹ va ν(Cu-O)eq = 440 sm⁻¹ orasidagi 95 sm⁻¹ farq — YT stabilizatsiya energiyasining bevosita Raman o'lchovidir. Bu farq Δd = 0.41 Å bilan proporsional.",
          "Raman polosalari kengligi (~40 sm⁻¹) — dinamik Yan-Teller (τ ≈ 10⁻¹¹ s) tebranishining bevosita ko'rsatkichi. Buzilish yo'nalishi (x, y, z aksial) fluxional tarzda tebranadi.",
          "Mutual exclusion D₄ₕ da amal qiladi: νₛ(Cu-O)eq (A₁g, 440) faqat Raman; νₐₛ(Cu-O)eq (Eᵤ, 390) faqat IQ. Bu inversiya markazi Cu ustida joylashganligini tasdiqlaydi.",
          "3d M(II) aqua qatori: [Ni(H₂O)₆]²⁺ (d⁸) va [Zn(H₂O)₆]²⁺ (d¹⁰) JT-faol emas — bir xil M-O uzunliklari, tor Raman polosalari. Faqat Cu(II), Cr(II), Mn(III) kuchli JT ko'rsatadi.",
          "Kristall CuSO₄·5H₂O da statik JT amalga oshadi (kristall panjara ta'siri). Xona haroratida eritmada esa dinamik JT. 77 K da statik ⇌ dinamik o'tish Raman polosalarining tor bo'lishi orqali kuzatiladi.",
          "d-d o'tish 810 nm da (kompleksning havorang rangi) tetragonal splitting hisobidan — bir emas, uch alohida o'tish (²Eg → ²B₁g + ²A₁g + ²B₂g). Bu UV-Vis va Raman ma'lumotlar birlashtirilishi orqali to'liq tasvir olinadi.",
        ];
        conclusions.forEach((c, idx) => {
          checkPageBreak(35);
          page.drawCircle({ x: MARGIN + 10, y: y - 8, size: 8, color: C.cyan });
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
      pdfDoc.setTitle(`[Cu(H₂O)₆]²⁺ Raman Spektroskopik Tahlili`);
      pdfDoc.setSubject(
        "Mis(II) akvakompleksi — Raman spektroskopiya (JDA-Kimyo)",
      );
      pdfDoc.setAuthor("JDA-Kimyo Research Platform");
      pdfDoc.setCreator("JDA-Kimyo Raman Tahlil Moduli");
      pdfDoc.setKeywords([
        "Copper hexaaqua",
        "Jahn-Teller",
        "Raman",
        "D4h",
        "d9",
        "distortion",
      ]);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Cu_H2O_6_JahnTeller_Raman_${new Date().toISOString().slice(0, 10)}.pdf`;
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
              <span className="text-cyan-400 font-semibold">[Cu(H₂O)₆]²⁺</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 flex items-center gap-2 flex-wrap">
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
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">
                    D₄ₕ (JT)
                  </span>
                  <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">
                    νₛ(Cu-O)eq 440
                  </span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">
                    JT +0.41 Å
                  </span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">
                    d⁹ paramagnit
                  </span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">
                    Havorang
                  </span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">
                    Jahn-Teller 1937
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setPdfModalOpen(true)}
                  className="text-xs bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg transition-all whitespace-nowrap font-bold shadow-lg shadow-cyan-500/20"
                >
                  📄 PDF Hisobot
                </button>
                <Link
                  href="/ilmiy/tahlil/raman/birikmalar"
                  className="text-xs bg-cyan-600/80 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-center"
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
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-cyan-600 hover:bg-cyan-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      {/* ═══════════ PDF MODAL ═══════════ */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-950 to-blue-950 border-2 border-cyan-500 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
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
              [Cu(H₂O)₆]²⁺ Yan-Teller effekti ning Raman spektroskopik
              tahlilining ilmiy hisoboti. Ilmiy maqola uslubida, DejaVu Sans
              fonti bilan, A4 formatida chop etiladi.
            </p>

            <div className="space-y-2 mb-6">
              {[
                {
                  key: "identification",
                  label: "1. Birikma identifikatsiyasi",
                  desc: "Formula, CAS, JT parametrlari, bog' uzunliklari",
                },
                {
                  key: "theory",
                  label: "2. Nazariy asos",
                  desc: "Raman effekti, D₄ₕ tanlash qoidalari, mutual exclusion",
                },
                {
                  key: "jahnTeller",
                  label: "3. Yan-Teller effekti",
                  desc: "Teorema, d⁹ Cu(II), dinamik va statik JT",
                },
                {
                  key: "peaks",
                  label: "4. Cho'qqilar jadvali",
                  desc: "11 ta Raman polosasi — chastota, tayinlash, kuch konstantasi",
                },
                {
                  key: "spectrum",
                  label: "5. Raman spektri grafigi",
                  desc: "Lorentzian simulyatsiya, 100-3800 sm⁻¹",
                },
                {
                  key: "groupTheory",
                  label: "6. Guruh nazariyasi",
                  desc: "D₄ₕ simmetriya, JT splitting Oₕ → D₄ₕ",
                },
                {
                  key: "forceConstant",
                  label: "7. Kuch konstantasi",
                  desc: "10 ta bog' turi — Cu-O eq/ax farqi",
                },
                {
                  key: "jtSeries",
                  label: "8. JT komplekslar qatori",
                  desc: "d⁹ Cu, d⁴ Cr(II), Mn(III) taqqoslashi",
                },
                {
                  key: "aquaSeries",
                  label: "9. 3d aqua komplekslar",
                  desc: "V-Zn qatori, JT-faol va JT-emas",
                },
                {
                  key: "techniques",
                  label: "10. Namuna tayyorlash usullari",
                  desc: "Suvli, D₂O, kristall, kriostat",
                },
                {
                  key: "interferences",
                  label: "11. Halaqit beruvchi omillar",
                  desc: "8 ta omil va yechimlari",
                },
                {
                  key: "conclusions",
                  label: "12. Asosiy xulosalar",
                  desc: "8 ta ilmiy xulosa",
                },
              ].map((s) => (
                <label
                  key={s.key}
                  className="flex items-start gap-3 p-3 bg-purple-800/30 border border-purple-700/40 rounded-lg hover:border-cyan-500/50 cursor-pointer transition-colors"
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
                    className="mt-1 accent-cyan-500"
                  />
                  <div className="flex-1">
                    <div className="text-cyan-300 font-semibold text-sm">
                      {s.label}
                    </div>
                    <div className="text-purple-300 text-xs mt-0.5">
                      {s.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3 mb-4">
              <p className="text-cyan-200 text-xs">
                <strong>⚠ Eslatma:</strong> PDF Unicode belgilarni (Cu, ν̃, D₄ₕ,
                A₁g, Eᵤ, ⁻¹, ₆, Å va h.k.) qo'llash uchun{" "}
                <code className="bg-purple-950 px-1 rounded">
                  /public/fonts/
                </code>{" "}
                papkasida DejaVuSans.ttf, DejaVuSans-Bold.ttf va
                DejaVuSans-Oblique.ttf fayllari bo'lishi kerak. Kutilgan hajm:
                ~7-9 sahifa A4.
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
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl -ml-16 -mb-16" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-3 py-1 rounded-full text-xs font-semibold">
              Raman tahlili
            </span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">
              ⚡ Yan-Teller
            </span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">
              D₄ₕ tetragonal
            </span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">
              d⁹ paramagnit
            </span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">
              Havorang eritma
            </span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">
              Klassik akva
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-4 flex-wrap relative">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              [Cu(H₂O)₆]²⁺
            </h2>
            <span className="text-purple-400 text-lg">171.62 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            geksaakvamis(II) kationi —{" "}
            <span className="text-cyan-400 italic">
              «Yan-Teller klassik namunasi»
            </span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-cyan-400">
              Koordinatsion kimyoning eng ta'sirchan Yan-Teller effekti namunasi
            </strong>{" "}
            — 1937-yilda H.A. Jahn va E. Teller kashf etgan teoremaning eng aniq
            eksperimental tasdig'i. d⁹ konfiguratsiya (t₂g⁶ eg³) tufayli oktaedr
            simmetriyasi D₄ₕ ga buziladi:{" "}
            <strong className="text-orange-300">
              ekvatorial 4 ta Cu-O bog'i qisqaradi (1.97 Å)
            </strong>
            ,{" "}
            <strong className="text-blue-300">
              aksial 2 ta esa cho'ziladi (2.38 Å)
            </strong>
            . Bu 0.41 Å farq ~1250 sm⁻¹ (15 kJ/mol) stabilizatsiya energiyasi
            beradi. Raman spektrida{" "}
            <strong className="text-cyan-300">νₛ(Cu-O)eq = 440 sm⁻¹</strong> va{" "}
            <strong className="text-blue-300">ν(Cu-O)ax = 535 sm⁻¹</strong> — bu
            95 sm⁻¹ farq JT ning kvantitativ o'lchovidir. Polosalarning KENGLIGI
            (~40 sm⁻¹) dinamik Yan-Teller (τ ≈ 10⁻¹¹ s) ning bevosita
            fingerprintidir.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Cu²⁺ (d⁹)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Konfiguratsiya</div>
              <div className="text-white font-bold">t₂g⁶ eg³</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">D₄ₕ (JT 4+2)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">
                μ<sub>eff</sub>
              </div>
              <div className="text-white font-bold">
                ≈ 1.95 μ<sub>B</sub>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ 2. INTERAKTIV YAN-TELLER 3D VIZUALIZATSIYA ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> Yan-Teller effekti — Interaktiv 3D vizualizatsiya
          </h2>
          <p className="text-purple-200 text-sm">
            Cu²⁺ ning d⁹ konfiguratsiyasi eg orbitallarida orbital
            degenerativlik yaratadi. Bu holat energetik jihatdan noqulay —
            molekula simmetriyani pasaytirib, degenerativlikni buzadi. Uch xil
            variantni ko'ring:
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setJtView("undistorted")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                jtView === "undistorted"
                  ? "bg-purple-600/60 text-white border-purple-400/50 shadow-lg shadow-purple-500/20"
                  : "bg-purple-800/30 text-purple-400 border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              🔵 Oh (buzilmagan) — nazariy
            </button>
            <button
              onClick={() => setJtView("elongated")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                jtView === "elongated"
                  ? "bg-orange-600/60 text-white border-orange-400/50 shadow-lg shadow-orange-500/20"
                  : "bg-purple-800/30 text-purple-400 border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              🔥 Aksial cho'zilgan (D₄ₕ) — ASOSIY
            </button>
            <button
              onClick={() => setJtView("compressed")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                jtView === "compressed"
                  ? "bg-blue-600/60 text-white border-blue-400/50 shadow-lg shadow-blue-500/20"
                  : "bg-purple-800/30 text-purple-400 border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              🔷 Aksial siqilgan (D₄ₕ) — kam uchraydi
            </button>
          </div>

          <div className="bg-purple-950/40 p-6 rounded-xl border border-purple-700/30">
            <svg
              viewBox="0 0 600 500"
              className="w-full max-w-3xl mx-auto h-auto"
            >
              {(() => {
                const eqDist = 80,
                  axDist =
                    jtView === "elongated"
                      ? 130
                      : jtView === "compressed"
                        ? 55
                        : 90;
                const eqDistShow =
                  jtView === "elongated"
                    ? "1.97 Å"
                    : jtView === "compressed"
                      ? "2.15 Å"
                      : "2.09 Å";
                const axDistShow =
                  jtView === "elongated"
                    ? "2.38 Å"
                    : jtView === "compressed"
                      ? "1.90 Å"
                      : "2.09 Å";
                const cx = 300,
                  cy = 250;
                return (
                  <>
                    {/* Sarlavha */}
                    <text
                      x={cx}
                      y="30"
                      textAnchor="middle"
                      fontSize="16"
                      fill="#22d3ee"
                      fontWeight="bold"
                    >
                      [Cu(H₂O)₆]²⁺ —{" "}
                      {jtView === "elongated"
                        ? "Aksial cho'zilgan (D₄ₕ)"
                        : jtView === "compressed"
                          ? "Aksial siqilgan (D₄ₕ)"
                          : "Buzilmagan (Oₕ)"}
                    </text>
                    <text
                      x={cx}
                      y="50"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#a78bfa"
                    >
                      {jtView === "elongated"
                        ? "d(x²-y²)¹ — 4 elektron ekvatorial da, aksial bo'sh"
                        : jtView === "compressed"
                          ? "d(z²)¹ — aksial da elektron, ekvatorial siqilgan"
                          : "d⁹ tenglashtirilgan (o'rtacha, dinamik JT)"}
                    </text>

                    {/* Aksial H₂O (yuqori) */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={cx}
                      y2={cy - axDist}
                      stroke={jtView === "elongated" ? "#60a5fa" : "#fbbf24"}
                      strokeWidth={jtView === "elongated" ? "2" : "3.5"}
                      strokeDasharray={jtView === "elongated" ? "5,3" : "0"}
                    />
                    <g>
                      <circle
                        cx={cx}
                        cy={cy - axDist}
                        r="16"
                        fill="url(#oGrad1)"
                        stroke="#fff"
                        strokeWidth="1.5"
                      />
                      <text
                        x={cx}
                        y={cy - axDist + 5}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#fff"
                        fontWeight="bold"
                      >
                        O
                      </text>
                      <text
                        x={cx - 15}
                        y={cy - axDist - 15}
                        fontSize="10"
                        fill="#e5e7eb"
                      >
                        H
                      </text>
                      <text
                        x={cx + 15}
                        y={cy - axDist - 15}
                        fontSize="10"
                        fill="#e5e7eb"
                      >
                        H
                      </text>
                    </g>
                    <text
                      x={cx + 15}
                      y={cy - axDist / 2}
                      fontSize="11"
                      fill={jtView === "elongated" ? "#60a5fa" : "#fbbf24"}
                      fontWeight="bold"
                    >
                      {axDistShow}
                    </text>
                    {jtView === "elongated" && (
                      <text
                        x={cx + 15}
                        y={cy - axDist / 2 + 15}
                        fontSize="8"
                        fill="#60a5fa"
                      >
                        aksial (uzun)
                      </text>
                    )}

                    {/* Aksial H₂O (pastki) */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={cx}
                      y2={cy + axDist}
                      stroke={jtView === "elongated" ? "#60a5fa" : "#fbbf24"}
                      strokeWidth={jtView === "elongated" ? "2" : "3.5"}
                      strokeDasharray={jtView === "elongated" ? "5,3" : "0"}
                    />
                    <g>
                      <circle
                        cx={cx}
                        cy={cy + axDist}
                        r="16"
                        fill="url(#oGrad1)"
                        stroke="#fff"
                        strokeWidth="1.5"
                      />
                      <text
                        x={cx}
                        y={cy + axDist + 5}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#fff"
                        fontWeight="bold"
                      >
                        O
                      </text>
                      <text
                        x={cx - 15}
                        y={cy + axDist + 25}
                        fontSize="10"
                        fill="#e5e7eb"
                      >
                        H
                      </text>
                      <text
                        x={cx + 15}
                        y={cy + axDist + 25}
                        fontSize="10"
                        fill="#e5e7eb"
                      >
                        H
                      </text>
                    </g>

                    {/* Ekvatorial 4 ta H₂O (yon tomonlarga) */}
                    {[
                      { x: cx - eqDist, y: cy, label: "chap" },
                      { x: cx + eqDist, y: cy, label: "o'ng" },
                      {
                        x: cx - eqDist * 0.6,
                        y: cy - eqDist * 0.4,
                        label: "orqa1",
                      },
                      {
                        x: cx + eqDist * 0.6,
                        y: cy + eqDist * 0.4,
                        label: "old2",
                      },
                    ].map((pos, i) => (
                      <g key={`eq-${i}`}>
                        <line
                          x1={cx}
                          y1={cy}
                          x2={pos.x}
                          y2={pos.y}
                          stroke={
                            jtView === "elongated"
                              ? "#fbbf24"
                              : jtView === "compressed"
                                ? "#60a5fa"
                                : "#fbbf24"
                          }
                          strokeWidth={
                            jtView === "elongated"
                              ? "3.5"
                              : jtView === "compressed"
                                ? "2"
                                : "3"
                          }
                          strokeDasharray={
                            jtView === "compressed" ? "5,3" : "0"
                          }
                        />
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="14"
                          fill="url(#oGrad1)"
                          stroke="#fff"
                          strokeWidth="1.5"
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 5}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#fff"
                          fontWeight="bold"
                        >
                          O
                        </text>
                        {i < 2 && (
                          <text
                            x={pos.x + (i === 0 ? -25 : 15)}
                            y={pos.y - 20}
                            fontSize="10"
                            fill="#fbbf24"
                            fontWeight="bold"
                          >
                            {eqDistShow}
                          </text>
                        )}
                        {i === 0 && jtView === "elongated" && (
                          <text
                            x={pos.x - 25}
                            y={pos.y - 5}
                            fontSize="8"
                            fill="#fbbf24"
                          >
                            ekvatorial (qisqa)
                          </text>
                        )}
                      </g>
                    ))}

                    {/* Cu markazida */}
                    <defs>
                      <radialGradient id="cuGrad">
                        <stop offset="0%" stopColor="#a5f3fc" />
                        <stop offset="70%" stopColor="#0891b2" />
                        <stop offset="100%" stopColor="#0e7490" />
                      </radialGradient>
                      <radialGradient id="oGrad1">
                        <stop offset="0%" stopColor="#fca5a5" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </radialGradient>
                    </defs>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="24"
                      fill="url(#cuGrad)"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={cy + 5}
                      textAnchor="middle"
                      fontSize="15"
                      fill="#fff"
                      fontWeight="bold"
                    >
                      Cu
                    </text>
                    <text
                      x={cx}
                      y={cy + 18}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#fff"
                      fontWeight="bold"
                    >
                      2+
                    </text>

                    {/* z o'qi (aksial) */}
                    <line
                      x1={cx}
                      y1="70"
                      x2={cx}
                      y2="430"
                      stroke="#c084fc"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                      opacity="0.6"
                    />
                    <text
                      x={cx + 10}
                      y="80"
                      fontSize="10"
                      fill="#c084fc"
                      fontWeight="bold"
                    >
                      z (aksial)
                    </text>
                    <text
                      x={cx + 10}
                      y="425"
                      fontSize="10"
                      fill="#c084fc"
                      fontWeight="bold"
                    >
                      −z
                    </text>

                    {/* Orbital energiyalar diagrammasi (o'ngda) */}
                    <g transform="translate(480, 130)">
                      <text
                        x="30"
                        y="0"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#22d3ee"
                        fontWeight="bold"
                      >
                        eg splitting
                      </text>
                      {jtView === "undistorted" && (
                        <>
                          <line
                            x1="0"
                            y1="30"
                            x2="60"
                            y2="30"
                            stroke="#fbbf24"
                            strokeWidth="2"
                          />
                          <text x="70" y="34" fontSize="9" fill="#fbbf24">
                            eg (2)
                          </text>
                          <text
                            x="30"
                            y="24"
                            textAnchor="middle"
                            fontSize="8"
                            fill="#fbbf24"
                          >
                            ↑↑↑
                          </text>
                          <line
                            x1="0"
                            y1="90"
                            x2="60"
                            y2="90"
                            stroke="#a78bfa"
                            strokeWidth="2"
                          />
                          <text x="70" y="94" fontSize="9" fill="#a78bfa">
                            t₂g (3)
                          </text>
                        </>
                      )}
                      {jtView === "elongated" && (
                        <>
                          <line
                            x1="0"
                            y1="20"
                            x2="60"
                            y2="20"
                            stroke="#dc2626"
                            strokeWidth="2"
                          />
                          <text x="70" y="24" fontSize="9" fill="#dc2626">
                            d(x²-y²) ↑↓↑↑ — bo'sh
                          </text>
                          <line
                            x1="0"
                            y1="45"
                            x2="60"
                            y2="45"
                            stroke="#22d3ee"
                            strokeWidth="2"
                          />
                          <text x="70" y="49" fontSize="9" fill="#22d3ee">
                            d(z²) ↑↓ ↑↑ to'la
                          </text>
                          <line
                            x1="0"
                            y1="90"
                            x2="60"
                            y2="90"
                            stroke="#a78bfa"
                            strokeWidth="2"
                          />
                          <text x="70" y="94" fontSize="9" fill="#a78bfa">
                            t₂g (to'la)
                          </text>
                        </>
                      )}
                      {jtView === "compressed" && (
                        <>
                          <line
                            x1="0"
                            y1="20"
                            x2="60"
                            y2="20"
                            stroke="#22d3ee"
                            strokeWidth="2"
                          />
                          <text x="70" y="24" fontSize="9" fill="#22d3ee">
                            d(z²) ↑ tanho
                          </text>
                          <line
                            x1="0"
                            y1="45"
                            x2="60"
                            y2="45"
                            stroke="#dc2626"
                            strokeWidth="2"
                          />
                          <text x="70" y="49" fontSize="9" fill="#dc2626">
                            d(x²-y²) ↑↓ ↑↑ to'la
                          </text>
                          <line
                            x1="0"
                            y1="90"
                            x2="60"
                            y2="90"
                            stroke="#a78bfa"
                            strokeWidth="2"
                          />
                          <text x="70" y="94" fontSize="9" fill="#a78bfa">
                            t₂g (to'la)
                          </text>
                        </>
                      )}
                    </g>

                    {/* JT stabilizatsiya energiyasi */}
                    <g transform="translate(20, 450)">
                      <rect
                        x="0"
                        y="0"
                        width="180"
                        height="30"
                        fill="#f97316"
                        opacity="0.2"
                        stroke="#f97316"
                        strokeWidth="1"
                        rx="4"
                      />
                      <text
                        x="90"
                        y="12"
                        textAnchor="middle"
                        fontSize="9"
                        fill="#f97316"
                        fontWeight="bold"
                      >
                        JT stabilizatsiya:
                      </text>
                      <text
                        x="90"
                        y="24"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#fbbf24"
                        fontWeight="bold"
                      >
                        {jtView === "elongated"
                          ? "~1250 sm⁻¹ (15 kJ/mol)"
                          : jtView === "compressed"
                            ? "~900 sm⁻¹ (kam)"
                            : "0 (yo'q)"}
                      </text>
                    </g>

                    <g transform="translate(410, 450)">
                      <rect
                        x="0"
                        y="0"
                        width="170"
                        height="30"
                        fill="#8b5cf6"
                        opacity="0.2"
                        stroke="#8b5cf6"
                        strokeWidth="1"
                        rx="4"
                      />
                      <text
                        x="85"
                        y="12"
                        textAnchor="middle"
                        fontSize="9"
                        fill="#a78bfa"
                        fontWeight="bold"
                      >
                        ν(Cu-O) eq / ax:
                      </text>
                      <text
                        x="85"
                        y="24"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#22d3ee"
                        fontWeight="bold"
                      >
                        {jtView === "elongated"
                          ? "440 / 535 sm⁻¹"
                          : jtView === "compressed"
                            ? "460 / 480 sm⁻¹"
                            : "410 (o'rtacha)"}
                      </text>
                    </g>
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
              <div className="text-orange-400 font-bold text-sm mb-2">
                🔥 Ekvatorial (qisqa, 1.97 Å)
              </div>
              <p className="text-purple-200 text-xs">
                4 ta H₂O ligandi bir tekislikda, kuchli σ-bog'lanish. d(x²-y²)
                orbital ekvatorial ligandlar bilan qattiq ta'sirlashadi. k =
                1.85 mdyn/Å.
              </p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <div className="text-blue-400 font-bold text-sm mb-2">
                🔷 Aksial (cho'zilgan, 2.38 Å)
              </div>
              <p className="text-purple-200 text-xs">
                2 ta H₂O ligandi z o'qi bo'ylab, zaif σ-bog'lanish. d(z²)
                orbital yarim to'lgan → kamroq itarish. k = 1.15 mdyn/Å (60%
                yumshoq!).
              </p>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-cyan-400 font-bold text-sm mb-2">
                ⚡ Dinamik JT (τ ≈ 10⁻¹¹ s)
              </div>
              <p className="text-purple-200 text-xs">
                Xona haroratida buzilish yo'nalishi (x, y, z aksial) tez
                tebranadi. O'rtacha ko'rinish Oₕ ga o'xshaydi, lekin Raman
                polosalari keng.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 3. YAN-TELLER TEOREMASI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📜</span> Yan-Teller teoremasi (1937) va uning Cu(II) uchun
            natijalari
          </h2>

          <div className="bg-gradient-to-r from-orange-900/30 to-cyan-900/30 border-2 border-orange-500/40 rounded-xl p-5">
            <div className="text-orange-300 font-bold text-sm mb-2">
              📜 H.A. Jahn & E. Teller teoremasi (1937):
            </div>
            <p className="text-purple-200 text-sm italic leading-relaxed">
              «Chiziqli bo'lmagan molekula orbital jihatdan degenerate
              elektronik holatda barqaror bo'la olmaydi — u simmetriyani
              pasaytirib, degenerativlikni buzadi va energiyani pasaytiradi.»
            </p>
            <p className="text-purple-300 text-xs mt-2">
              Proc. R. Soc. A 161, 220 (1937)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-300 font-bold mb-3">
                ⚡ Cu²⁺ ning d⁹ konfiguratsiyasi
              </h3>
              <p className="text-purple-200 text-sm mb-3">
                Ideal oktaedrda Cu²⁺ ning eg orbitallari degenerate:
              </p>
              <div className="bg-purple-950/60 rounded-lg p-3 font-mono text-xs text-cyan-300 mb-3">
                <div className="text-orange-300 text-sm text-center my-2">
                  eg: (d(z²))²(d(x²-y²))¹ ↔ (d(z²))¹(d(x²-y²))²
                </div>
                <div className="text-purple-300 text-[10px] mt-2 text-center">
                  ²Eg elektronik holat — 2× degenerate
                </div>
              </div>
              <p className="text-purple-200 text-xs">
                Bu holat Yan-Teller teoremasi bo'yicha barqaror emas — molekula
                simmetriyani pasaytirib (Oₕ → D₄ₕ), degenerativlikni buzishga
                majbur.
              </p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-300 font-bold mb-3">
                🎯 Cu(II) uchun natijalar
              </h3>
              <div className="space-y-2 text-sm">
                <div className="bg-orange-900/20 rounded-lg p-2 border border-orange-700/30">
                  <div className="text-orange-300 font-bold text-xs">
                    Aksial cho'zilish (asosiy)
                  </div>
                  <div className="text-purple-200 text-xs">
                    Cu-O ax uzayadi 2.38 Å ga, ekvatorial qisqaradi 1.97 Å ga.
                    96% Cu(II) komplekslar shu turdagi.
                  </div>
                </div>
                <div className="bg-blue-900/20 rounded-lg p-2 border border-blue-700/30">
                  <div className="text-blue-300 font-bold text-xs">
                    Aksial siqilish (kam uchraydi)
                  </div>
                  <div className="text-purple-200 text-xs">
                    Cu-O ax qisqaradi, ekvatorial uzayadi. ~4% Cu(II)
                    komplekslar. Energetik jihatdan biroz noqulay.
                  </div>
                </div>
                <div className="bg-cyan-900/20 rounded-lg p-2 border border-cyan-700/30">
                  <div className="text-cyan-300 font-bold text-xs">
                    Dinamik JT (xona harorati)
                  </div>
                  <div className="text-purple-200 text-xs">
                    Aksial yo'nalish (x/y/z) 10⁻¹¹ s da fluxional tebranadi.
                    Vaqt o'rtacha: Oₕ ga o'xshaydi.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5">
            <p className="text-cyan-200 text-sm">
              <strong className="text-cyan-300">
                ⚡ Raman spektroskopiyaning ahamiyati:
              </strong>{" "}
              Yan-Teller effektining tebranish darajasidagi eng aniq ko'rinishi
              Raman spektrida namoyon bo'ladi.{" "}
              <strong>ν(Cu-O)eq va ν(Cu-O)ax orasidagi 95 sm⁻¹ farq</strong> —
              bu JT stabilizatsiya energiyasining bevosita eksperimental
              o'lchovidir. IQ spektroskopiyasi bunday aniq farqni ko'rsata
              olmaydi, chunki A₁g modalar IQ-noaktiv. Bu esa Raman
              spektroskopiyasining Cu(II) kimyosidagi noyob rolini tasdiqlaydi.
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
            <strong className="text-cyan-400">
              Lorentzian shakl funksiyasi
            </strong>{" "}
            asosida simulyatsiya qilingan (0.5 M CuSO₄ suvli eritma, 785 nm NIR
            lazer). Slayderni harakatlantiring yoki cho'qqilarni bosing — barcha
            nazariy izohlar avtomatik ko'rsatiladi. Diqqat qiling:{" "}
            <strong className="text-orange-300">polosalar KENG</strong> — bu
            dinamik JT natijasidir.
          </p>

          {/* Slayder */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <label className="block text-cyan-400 font-bold mb-2">
              Raman siljish:{" "}
              <span className="font-mono text-2xl">{freqSlider}</span> sm⁻¹
            </label>
            <input
              type="range"
              min="100"
              max="3800"
              value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>100 (uzoq/lattice)</span>
              <span>500 (Cu-O)</span>
              <span>1000</span>
              <span>2000</span>
              <span>3800 (O-H)</span>
            </div>
          </div>

          {/* Joriy cho'qqi ma'lumoti */}
          <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border-2 border-cyan-500/40 rounded-xl p-5">
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
              <div>
                <span className="text-xs text-purple-400 uppercase">
                  Eng yaqin cho'qqi:
                </span>
                <div className="text-3xl font-mono font-bold text-cyan-400">
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
                <div className="text-cyan-300 font-mono font-bold text-sm">
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
              <div className="text-cyan-400 font-bold text-sm mb-2 flex items-center gap-2">
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
              <div className="mt-3 bg-cyan-600/20 border border-cyan-500/40 rounded p-3">
                <p className="text-cyan-200 text-xs font-semibold">
                  💎 {currentPeak.diagnostic}
                </p>
              </div>
            )}
          </div>

          {/* SVG spektr grafigi */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <div className="text-xs text-purple-400 mb-2 flex items-center justify-between">
              <span>
                Raman spektri — Lorentzian simulyatsiya (0.5 M CuSO₄, 785 nm)
              </span>
              <span className="font-mono">100 — 3800 sm⁻¹</span>
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
                fill="#22d3ee"
                transform="rotate(-90, 20, 140)"
                fontWeight="bold"
              >
                Raman intensivlik (a.u.)
              </text>

              {/* X grid */}
              {[3800, 3200, 2400, 1800, 1500, 1200, 900, 600, 300, 100].map(
                (f, i) => {
                  const gx = 60 + ((3800 - f) / 3700) * 710;
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
                fill="#22d3ee"
                fontWeight="bold"
              >
                Raman siljish (sm⁻¹)
              </text>

              {/* Zonalar */}
              <rect
                x={60 + ((3800 - 3600) / 3700) * 710}
                y="30"
                width={((3600 - 3000) / 3700) * 710}
                height="220"
                fill="#22d3ee"
                opacity="0.06"
              />
              <rect
                x={60 + ((3800 - 1700) / 3700) * 710}
                y="30"
                width={((1700 - 1500) / 3700) * 710}
                height="220"
                fill="#c084fc"
                opacity="0.06"
              />
              <rect
                x={60 + ((3800 - 600) / 3700) * 710}
                y="30"
                width={((600 - 300) / 3700) * 710}
                height="220"
                fill="#fb923c"
                opacity="0.10"
              />
              <rect
                x={60 + ((3800 - 300) / 3700) * 710}
                y="30"
                width={((300 - 100) / 3700) * 710}
                height="220"
                fill="#60a5fa"
                opacity="0.06"
              />

              <text
                x={60 + ((3800 - 3300) / 3700) * 710}
                y="45"
                fontSize="8"
                fill="#22d3ee"
                textAnchor="middle"
                fontWeight="bold"
              >
                O-H zonasi
              </text>
              <text
                x={60 + ((3800 - 1600) / 3700) * 710}
                y="45"
                fontSize="8"
                fill="#c084fc"
                textAnchor="middle"
                fontWeight="bold"
              >
                δ(HOH)
              </text>
              <text
                x={60 + ((3800 - 450) / 3700) * 710}
                y="45"
                fontSize="8"
                fill="#fb923c"
                textAnchor="middle"
                fontWeight="bold"
              >
                🔥 Cu-O zonasi (JT)
              </text>
              <text
                x={60 + ((3800 - 200) / 3700) * 710}
                y="45"
                fontSize="8"
                fill="#60a5fa"
                textAnchor="middle"
                fontWeight="bold"
              >
                Lattice
              </text>

              {/* Spektr chizig'i (Lorentzian, YUQORIGA cho'qqilar) */}
              <polyline
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                points={(() => {
                  const pts = [];
                  for (let f = 3800; f >= 100; f -= 8) {
                    let I = 0.02;
                    ramanPeaks.forEach((p) => {
                      // Cu(II) uchun keng chiziqlar — JT tufayli
                      const sigma =
                        p.freq > 2000
                          ? 60
                          : p.freq > 1000
                            ? 25
                            : p.freq > 400
                              ? 22
                              : 18;
                      I +=
                        p.absorbance *
                        Math.exp(
                          -Math.pow(f - p.freq, 2) / (2 * sigma * sigma),
                        );
                    });
                    I = Math.min(I, 1.0);
                    const x = 60 + ((3800 - f) / 3700) * 710;
                    const y = 250 - I * 220;
                    pts.push(`${x},${y}`);
                  }
                  return pts.join(" ");
                })()}
              />

              {/* Slayder markeri */}
              <line
                x1={60 + ((3800 - freqSlider) / 3700) * 710}
                y1="30"
                x2={60 + ((3800 - freqSlider) / 3700) * 710}
                y2="250"
                stroke="#22d3ee"
                strokeWidth="1.5"
                strokeDasharray="4,2"
              />

              {/* Cho'qqi markerlari */}
              {ramanPeaks.map((peak, i) => {
                const x = 60 + ((3800 - peak.freq) / 3700) * 710;
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
                      fill={isActive ? "#fb923c" : "#22d3ee"}
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
                    : "border-cyan-400/40 bg-cyan-900/10 hover:border-cyan-400/60"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${currentPeak.freq === p.freq ? "bg-orange-400" : "bg-cyan-400"}`}
                />
                <span className="font-mono text-cyan-300 font-bold">
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
            11 ta asosiy Raman polosasi. E'tibor bering: Cu(II) polosalari
            boshqa metall akvakomplekslardan sezilarli KENGROQ (dinamik JT
            natijasi). Ekvatorial va aksial ν(Cu-O) polosalari alohida ko'rinadi
            — bu Yan-Teller buzilishning bevosita isboti.
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
                      currentPeak.freq === p.freq ? "bg-cyan-900/20" : ""
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
              <div className="text-orange-400 font-bold text-sm mb-2">
                🔥 νₛ(Cu-O)eq (440)
              </div>
              <p className="text-purple-200 text-xs">
                A₁g — asosiy Raman diagnostik cho'qqi. Ekvatorial 4 ta H₂O bir
                vaqtda cho'ziladi. k = 1.85 mdyn/Å.
              </p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <div className="text-blue-400 font-bold text-sm mb-2">
                🔷 ν(Cu-O)ax (535)
              </div>
              <p className="text-purple-200 text-xs">
                Yan-Teller cho'zilgan aksial bog'lanish. Farq 95 sm⁻¹ — JT
                stabilizatsiyaning kvantitativ o'lchovi.
              </p>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-cyan-400 font-bold text-sm mb-2">
                💧 νₛ(O-H) (3220)
              </div>
              <p className="text-purple-200 text-xs">
                H₂O ligandi. Erkin H₂O (3280) dan −60 sm⁻¹ pastroq —
                koordinatsiya va H-bonding ta'siri.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 6. GURUH NAZARIYASI — D4h ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔷</span> Guruh nazariyasi tahlili — D₄ₕ simmetriyasi (JT
            buzilgan)
          </h2>
          <p className="text-purple-200 text-sm leading-relaxed">
            Yan-Teller buzilishi tufayli [Cu(H₂O)₆]²⁺ ideal Oₕ simmetriyasidan{" "}
            <strong className="text-orange-300">D₄ₕ tetragonalga</strong>{" "}
            tushadi (16-tartib). Simmetriya operatsiyalari:{" "}
            <span className="font-mono text-orange-300 text-xs">
              E, 2C₄, C₂, 2C₂', 2C₂'', i, 2S₄, σₕ, 2σᵥ, 2σd
            </span>
            . Bu buzilish ν(Cu-O)eq va ν(Cu-O)ax polosalarini alohida ajratadi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-3">
                Normal tebranish modalari
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-orange-300 text-xs font-bold uppercase mb-1">
                    Umumiy modalar
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2">
                    3N−6 = 3(19)−6 = 51
                  </div>
                </div>
                <div>
                  <div className="text-orange-300 text-xs font-bold uppercase mb-1">
                    CuO₆ skelet (Oₕ)
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">
                    A₁g + Eg + T₁ᵤ + T₂g + T₁ᵤ + T₂ᵤ
                  </div>
                </div>
                <div>
                  <div className="text-orange-300 text-xs font-bold uppercase mb-1">
                    CuO₆ skelet (D₄ₕ, JT)
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">
                    2A₁g + Eg + 2B₁g + B₂g + 2Eᵤ + 2A₂ᵤ
                  </div>
                </div>
                <div>
                  <div className="text-orange-300 text-xs font-bold uppercase mb-1">
                    🔥 JT splitting: Oₕ → D₄ₕ
                  </div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">
                    Eg → A₁g + B₁g
                    <br />
                    T₁ᵤ → A₂ᵤ + Eᵤ
                    <br />
                    T₂g → B₂g + Eg
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-3">Faollik jadvali</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 bg-cyan-900/20 rounded-lg p-3 border border-cyan-700/30">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-cyan-400 font-bold text-xs">
                      Raman faol (gerade)
                    </div>
                    <div className="text-purple-200 text-xs font-mono">
                      A₁g (eq=440, ax=535) + Eg + B₁g + B₂g
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
                      Eᵤ (νₐₛ eq=390) + A₂ᵤ (νₐₛ ax)
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-900/20 rounded-lg p-3 border border-gray-700/30">
                  <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-gray-400 font-bold text-xs">
                      Muhim yangi modalar (JT dan)
                    </div>
                    <div className="text-purple-200 text-xs font-mono">
                      B₁g (240), Eg (320) — Oₕ da yo'q edi!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5">
            <p className="text-cyan-200 text-sm">
              <strong className="text-cyan-300">
                ⚡ Mutual Exclusion D₄ₕ da amal qiladi:
              </strong>{" "}
              Cu ustida inversiya markazi mavjud →
              <strong className="text-orange-300">
                {" "}
                νₛ(Cu-O)eq (A₁g, 440) faqat Ramanda
              </strong>
              ,
              <strong className="text-orange-300">
                {" "}
                νₐₛ(Cu-O)eq (Eᵤ, 390) faqat IQ da
              </strong>
              . Bu Cu markazining haqiqiy simmetriya markazi ekanligini
              tasdiqlaydi — Cu ning o'zi tebranishi noaktiv.
            </p>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-200 text-sm">
              <strong className="text-orange-300">
                🔬 JT splitting Raman spektrida bevosita ko'rinadi:
              </strong>{" "}
              Oktaedrik Ni(II) yoki Zn(II) da faqat bitta ν(M-O) Raman polosasi
              ko'rinadi (~390 sm⁻¹). Ammo Cu(II) da{" "}
              <strong>ikkita alohida A₁g polosa</strong> — ν(Cu-O)eq = 440 va
              ν(Cu-O)ax = 535 sm⁻¹. Bu ikki polosaning mavjudligi va farqi
              Yan-Teller effektining eng aniq Raman diagnostikasidir. 95 sm⁻¹
              farq Δd = 0.41 Å bilan proporsional.
            </p>
          </div>
        </div>

        {/* ═══════════ 7. KUCH KONSTANTASI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💪</span> Kuch konstantasi va Hooke qonuni
          </h2>
          <p className="text-purple-200 text-sm">
            Hooke qonuni ν̃ = (1/2πc)·√(k/μ) asosida. [Cu(H₂O)₆]²⁺ ning k(Cu-O)eq
            va k(Cu-O)ax orasidagi{" "}
            <strong className="text-orange-300">60% farq</strong> Yan-Teller
            buzilishining kvantitativ o'lchovidir:
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
                    f.bond.includes("Cu-O") || f.bond.includes("[Cu(H₂O)₆]");
                  return (
                    <tr
                      key={i}
                      className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isHighlight ? "bg-cyan-900/20" : ""}`}
                    >
                      <td
                        className={`py-3 px-4 font-mono ${isHighlight ? "text-cyan-300 font-bold" : "text-orange-300"}`}
                      >
                        {f.bond}
                      </td>
                      <td className="py-3 px-4 font-mono text-orange-300">
                        {f.k}
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-400">
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
                🔬 Kvantitativ Yan-Teller tahlili:
              </strong>
              <br />• <strong>k(Cu-O)eq = 1.85 mdyn/Å</strong> — [Co(NH₃)₆]³⁺
              (Oₕ) bilan bir xil, kuchli koordinatsion bog'
              <br />• <strong>k(Cu-O)ax = 1.15 mdyn/Å</strong> — Ag-N (chiziqli,
              1.48) dan ham yumshoq!
              <br />• <strong>Farq: Δk = 0.70 mdyn/Å (38%)</strong> — bu bog'
              uzunligining farqiga (0.41 Å = 20%) mos keladi (Badger qoidasi
              bo'yicha k ∝ 1/r³)
              <br />• Aksial H₂O ligandi{" "}
              <strong>elektrostatik tarzda ushlab turiladi</strong>, kovalent
              bog'lanish minimal
              <br />• Bu esa Cu(II) ning aksial ligandlarni oson almashtirish
              qobiliyatini tushuntiradi (SN₁ mexanizmi)
            </p>
          </div>
        </div>

        {/* ═══════════ 8. YAN-TELLER QATORI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> Yan-Teller effektiga uchraydigan komplekslar qatori
          </h2>
          <p className="text-purple-200 leading-relaxed">
            Yan-Teller effekti faqat maxsus d konfiguratsiyalarda kuzatiladi:
            d¹, d² (T holatida), d⁴ HS, d⁵ LS, d⁶ HS, d⁷ LS va{" "}
            <strong className="text-orange-300">d⁹</strong>. Kuchli JT (E
            holati): d⁹ Cu(II), d⁴ Cr(II), Mn(III). Boshqalari zaif JT (T
            holati) ko'rsatadi:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Kompleks
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    d config
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    eq (Å)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    ax (Å)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Δd (Å)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    νₑq
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    μeff (μB)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Izoh
                  </th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {jahnTellerSeries.map((m, i) => (
                  <tr
                    key={i}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${m.current ? "bg-cyan-900/30 border-l-4 border-l-cyan-400" : ""}`}
                  >
                    <td
                      className={`py-3 px-3 font-mono text-xs ${m.current ? "text-cyan-300 font-bold" : "text-orange-300"}`}
                    >
                      {m.formula}
                    </td>
                    <td className="py-3 px-3 text-xs font-mono">{m.dConfig}</td>
                    <td className="py-3 px-3 font-mono text-xs">{m.eqBond}</td>
                    <td className="py-3 px-3 font-mono text-xs">{m.axBond}</td>
                    <td className="py-3 px-3 font-mono text-orange-300 font-bold text-xs">
                      {m.jtDist}
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 text-xs">
                      {m.nuEq}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs">{m.mueff}</td>
                    <td className="py-3 px-3 text-xs">{m.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-300 font-bold mb-2 text-sm">
                🔥 Kuchli JT (E holati)
              </h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>d⁹ Cu(II)</strong> (Δd = 0.41 Å) va{" "}
                <strong>d⁴ HS Mn(III), Cr(II)</strong> (Δd = 0.25-0.30 Å) — eg
                orbitallarida degenerativlik → kuchli buzilish. Cu(II) qatorida
                eng katta buzilishga ega.
              </p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-300 font-bold mb-2 text-sm">
                ❌ JT yo'q (ideal Oₕ)
              </h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>d⁸ Ni(II)</strong>, <strong>d⁷ HS Co(II)</strong>,{" "}
                <strong>d¹⁰ Zn(II)</strong> — eg orbitallar simmetrik
                to'ldirilgan yoki bo'sh. Bir xil M-O uzunliklari, ideal
                oktaedrik geometriya, Raman polosalari tor.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 9. AQUA KOMPLEKSLAR QATORI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💧</span> 3d M(II) akvakomplekslari qatori — [M(H₂O)₆]²⁺
          </h2>
          <p className="text-purple-200 leading-relaxed">
            Birinchi qator o'tuvchi metallarning akvakomplekslari V(II) dan
            Zn(II) gacha.{" "}
            <strong className="text-orange-300">
              Cu(II) va Cr(II) — JT-faol
            </strong>
            , boshqalari ideal oktaedrik. Bog' uzunligi va Raman chastotasi
            orbital to'ldirilishi bilan bog'liq:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Kompleks
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    M(II)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    d config
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    d(M-O) Å
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    ν(M-O)
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Rangi
                  </th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">
                    Barqarorlik
                  </th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {aquaSeries.map((m, i) => (
                  <tr
                    key={i}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${m.current ? "bg-cyan-900/30 border-l-4 border-l-cyan-400" : m.jt ? "bg-orange-900/10" : ""}`}
                  >
                    <td
                      className={`py-3 px-3 font-mono text-xs ${m.current ? "text-cyan-300 font-bold" : m.jt ? "text-orange-300" : "text-purple-200"}`}
                    >
                      {m.formula}
                    </td>
                    <td className="py-3 px-3 text-xs">{m.metal}</td>
                    <td className="py-3 px-3 text-xs font-mono">{m.dConfig}</td>
                    <td className="py-3 px-3 font-mono text-orange-300 text-xs">
                      {m.bondL}
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 font-bold">
                      {m.nuMO}
                    </td>
                    <td className="py-3 px-3 text-xs">{m.color}</td>
                    <td className="py-3 px-3 text-xs">
                      {m.stability}
                      {m.jt && (
                        <span className="ml-1 text-orange-400 font-bold">
                          [JT]
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-5">
              <h3 className="text-cyan-300 font-bold mb-2 text-sm">
                📉 M-O bog' uzunligining trendi
              </h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                V(2.14) → Cr(2.12) → Mn(2.20) → Fe(2.13) → Co(2.11) → Ni(2.06) →
                Cu(1.97/2.38) → Zn(2.09).{" "}
                <strong>Ni(II) eng qisqa bog'lanish</strong> — d⁸
                konfiguratsiya, ideal oktaedrik, katta CFSE. Cu(II) ning
                ekvatorial bog'lari esa Ni(II) dan ham qisqa (1.97 Å)!
              </p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-300 font-bold mb-2 text-sm">
                🌈 Rang va d-d o'tishlar
              </h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Mn(II) d⁵ HS — barcha d-d o'tishlar taqiqlangan (spin, Laporte)
                → deyarli rangsiz (kuchsiz pushti). Cu(II) d⁹ — asosiy o'tish
                810 nm da, tetragonal splitting tufayli ²Eg → ²A₁g + ²B₁g + ²B₂g
                uch alohida chiziq. Bu esa Cu(II) ning noyob havorang rangining
                tebranish-elektron manbaidir.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 10. NAMUNA TAYYORLASH USULLARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔬</span> Namuna tayyorlash usullari
          </h2>
          <p className="text-purple-200 text-sm">
            [Cu(H₂O)₆]²⁺ Raman spektroskopiyasi uchun 4 ta asosiy texnika
            mavjud. D₂O usuli esa Cu-O sohasini ochish uchun ideal.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {techniques.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  activeTechnique === i
                    ? "bg-cyan-600/60 text-white border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                    : "bg-purple-800/30 text-purple-400 border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-cyan-400 font-bold text-lg mb-2">
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
          <p className="text-purple-200 text-sm">
            [Cu(H₂O)₆]²⁺ da asosiy muammolar suv Raman polosalari va Cu(II) ning
            rangi tufayli fluoresensiya. E'tibor bering:{" "}
            <strong className="text-orange-300">
              dinamik Yan-Teller — halaqit emas, aksincha ma'lumot manbai
            </strong>
            .
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
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${activeInterference === i ? "bg-cyan-900/20" : ""}`}
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
            <span>📜</span> Yan-Teller effekti — tarixiy kashfiyot va zamonaviy
            ilovalar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-5">
              <div className="text-orange-400 font-bold mb-2 text-sm">
                🔬 1937 — Hermann Jahn & Edward Teller
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>H.A. Jahn</strong> (Cambridge) va{" "}
                <strong>E. Teller</strong> (Prinston, keyinchalik Manhattan
                loyihasi) group theory asosida teoremani isbotlashdi: chiziqli
                bo'lmagan molekula orbital jihatdan degenerate holatda barqaror
                emas. <em>Proc. R. Soc. A</em> 161, 220 (1937). Bu teorema
                Cu(II), Cr(II), Mn(III) va Ag(II) komplekslarining anomal
                xususiyatlarini tushuntirdi.
              </p>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-5">
              <div className="text-cyan-400 font-bold mb-2 text-sm">
                🥇 1955-1975 — Kristallografik tasdiq
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>D.J. Hodgson va J.A. Ibers</strong> (Berkeley) XRD
                orqali Cu(II) komplekslarida aksial cho'zilishni
                to'g'ridan-to'g'ri o'lchashdi.{" "}
                <strong>B.J. Hathaway va D.E. Billing</strong> (Nottingham)
                o'zining <em>Coord. Chem. Rev.</em> (1970) klassik ishida yuzlab
                Cu(II) komplekslarining tetragonal buzilishini sistematik
                jamladi.
              </p>
            </div>
            <div className="bg-purple-800/30 border border-purple-500/30 rounded-xl p-5">
              <div className="text-purple-400 font-bold mb-2 text-sm">
                ⚡ 1975-2000 — Dinamik JT nazariyasi
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>I.B. Bersuker</strong> (Chishinou) Yan-Teller effektning
                dinamik nazariyasini rivojlantirdi. Neytron sochilishi, EXAFS va
                yuqori aniqlikli Raman spektroskopiya orqali τ ≈ 10⁻¹¹ s
                xarakterli vaqt aniqlandi. Cu(II) ning fluxional xususiyati
                kompleks turlar taqsimoti asosiy element bo'lib qoldi.
              </p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5">
              <div className="text-green-400 font-bold mb-2 text-sm">
                🌟 Zamonaviy ilovalar (2020-2026)
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">
                • <strong>Fotokataliz</strong>: Cu(II) — CO₂ redoks va vodorod
                ishlab chiqarish
                <br />• <strong>Enzimatik markazlar</strong>:
                superoksiddismutaza (SOD), plastocyanin
                <br />• <strong>Molekulyar magnitlar</strong>: Cu(II)-Cu(II)
                juftlashuvi
                <br />• <strong>MOF (metal-organic frameworks)</strong>: gaz
                saqlash va katalizator
                <br />• <strong>Kimyoviy sensor</strong>: Cu(II)-bazali
                fluoresensiya sensori
                <br />• <strong>Bioanorganik</strong>: mis kimyosi tibbiyotda
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════ 13. CuSO₄·5H₂O — MIS KUPOROSI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💎</span> CuSO₄·5H₂O — mis kuporosi (kristallografik ma'lumot)
          </h2>
          <p className="text-purple-200 text-sm">
            [Cu(H₂O)₆]²⁺ ni o'rganish uchun eng qulay manba — mis kuporosi
            (chalcanthite). Uning kristall strukturasi Yan-Teller effektining
            eng aniq statik namunasidir.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-cyan-500/30 rounded-xl p-5">
              <h3 className="text-cyan-300 font-bold mb-3">
                🔷 Kristallografik parametrlar
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-purple-700/40 pb-1">
                  <span className="text-purple-300">Kristall sistemasi:</span>
                  <span className="text-cyan-300 font-mono">Triklinik</span>
                </div>
                <div className="flex justify-between border-b border-purple-700/40 pb-1">
                  <span className="text-purple-300">Kosmik guruh:</span>
                  <span className="text-cyan-300 font-mono">P1̄</span>
                </div>
                <div className="flex justify-between border-b border-purple-700/40 pb-1">
                  <span className="text-purple-300">a, b, c:</span>
                  <span className="text-cyan-300 font-mono text-xs">
                    6.11, 10.72, 5.97 Å
                  </span>
                </div>
                <div className="flex justify-between border-b border-purple-700/40 pb-1">
                  <span className="text-purple-300">α, β, γ:</span>
                  <span className="text-cyan-300 font-mono text-xs">
                    82.4°, 107.4°, 102.7°
                  </span>
                </div>
                <div className="flex justify-between border-b border-purple-700/40 pb-1">
                  <span className="text-purple-300">Cu-O ekv (4×):</span>
                  <span className="text-orange-300 font-mono font-bold">
                    1.97 Å
                  </span>
                </div>
                <div className="flex justify-between border-b border-purple-700/40 pb-1">
                  <span className="text-purple-300">Cu-O aksial (2×):</span>
                  <span className="text-orange-300 font-mono font-bold">
                    2.38 Å
                  </span>
                </div>
                <div className="flex justify-between border-b border-purple-700/40 pb-1">
                  <span className="text-purple-300">Δd (JT):</span>
                  <span className="text-orange-300 font-mono font-bold">
                    0.41 Å
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Rangi:</span>
                  <span className="text-cyan-300">Yorqin havorang</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-orange-900/30 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-300 font-bold mb-3">
                🌡️ Termik xatti-harakati
              </h3>
              <div className="space-y-3 text-sm">
                <div className="bg-blue-900/20 rounded-lg p-3">
                  <div className="text-blue-300 font-bold text-xs">
                    30-100 °C:
                  </div>
                  <p className="text-purple-200 text-xs mt-1">
                    CuSO₄·5H₂O → CuSO₄·3H₂O + 2H₂O (havorang saqlanadi)
                  </p>
                </div>
                <div className="bg-cyan-900/20 rounded-lg p-3">
                  <div className="text-cyan-300 font-bold text-xs">110 °C:</div>
                  <p className="text-purple-200 text-xs mt-1">
                    CuSO₄·3H₂O → CuSO₄·H₂O + 2H₂O (havorang → zangori)
                  </p>
                </div>
                <div className="bg-yellow-900/20 rounded-lg p-3">
                  <div className="text-yellow-300 font-bold text-xs">
                    250 °C:
                  </div>
                  <p className="text-purple-200 text-xs mt-1">
                    CuSO₄·H₂O → CuSO₄ + H₂O (oq kukun!)
                  </p>
                </div>
                <div className="bg-red-900/20 rounded-lg p-3">
                  <div className="text-red-300 font-bold text-xs">650 °C:</div>
                  <p className="text-purple-200 text-xs mt-1">
                    CuSO₄ → CuO + SO₃ (parchalanish)
                  </p>
                </div>
                <p className="text-orange-200 text-xs mt-2 italic">
                  🔬 Rang: havorang → zangori → oq — [Cu(H₂O)₆]²⁺ ning
                  yo'qolishi ν(Cu-O) chastotalarining o'zgarishi bilan mos
                  keladi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5">
            <p className="text-cyan-200 text-sm">
              <strong className="text-cyan-300">
                💎 CuSO₄·5H₂O ning tebranish spektroskopiyasi:
              </strong>{" "}
              Kristallda 5 ta H₂O molekulasidan 4 tasi Cu ga koordinatsion
              bog'langan (2 ekvatorial + 2 aksial, chunki qolgan 2 ekvatorial
              pozitsiyalar SO₄²⁻ tomonidan zaif ushlab turiladi), 1 tasi esa
              SO₄²⁻ va H₂O molekulalari orasidagi vodorod bog'lanish tarmog'ida.
              Bu strukturaviy nuance Raman spektrida qo'shimcha polosalar
              sifatida ko'rinadi. SO₄²⁻ ning ν₁(A₁) = 983 sm⁻¹ ichki referens
              sifatida ishlatiladi.
            </p>
          </div>
        </div>

        {/* ═══════════ 14. XULOSA ═══════════ */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✅</span> Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li className="pl-2">
              <strong className="text-cyan-400">νₛ(Cu-O)eq = 440 sm⁻¹</strong> —
              A₁g simmetriya, faqat Ramanda faol. [Cu(H₂O)₆]²⁺ ning asosiy
              diagnostik cho'qqisi va Yan-Teller ekvatorial bog'lanishning
              tebranish darajasidagi ko'rsatkichi
            </li>
            <li className="pl-2">
              <strong className="text-cyan-400">ν(Cu-O)ax = 535 sm⁻¹</strong> —
              aksial cho'zilgan bog'lanish. Ekvatorial va aksial polosalar
              orasidagi 95 sm⁻¹ farq JT stabilizatsiya energiyasining
              kvantitativ o'lchovidir
            </li>
            <li className="pl-2">
              <strong className="text-cyan-400">
                Yan-Teller buzilish parametri Δd = 0.41 Å
              </strong>{" "}
              (Δk = 0.70 mdyn/Å, 60% farq) — 1937-yildagi Jahn-Teller
              teoremasining eng aniq eksperimental tasdig'i
            </li>
            <li className="pl-2">
              <strong className="text-cyan-400">
                Raman polosalarining kengligi (~40 sm⁻¹)
              </strong>{" "}
              — dinamik Yan-Teller (τ ≈ 10⁻¹¹ s) tebranishining bevosita
              fingerprint. Xona haroratida (x, y, z) yo'nalishlar fluxional
              almashinadi
            </li>
            <li className="pl-2">
              <strong className="text-cyan-400">D₄ₕ mutual exclusion</strong>:
              νₛ (A₁g, 440) faqat Raman; νₐₛ (Eᵤ, 390) faqat IQ. Cu ustidagi
              inversiya markazining tasdig'i
            </li>
            <li className="pl-2">
              <strong className="text-cyan-400">Aqua qatori</strong>:
              V-Cr-Mn-Fe-Co-Ni-Cu-Zn ichida faqat Cu(II) va Cr(II) JT-faol.
              [Ni(H₂O)₆]²⁺ va [Zn(H₂O)₆]²⁺ ideal Oₕ, bir tor Raman polosasi
            </li>
            <li className="pl-2">
              <strong className="text-cyan-400">
                Kuch konstantasi analitikasi
              </strong>
              : k(Cu-O)eq = 1.85 (kuchli, [Co(NH₃)₆]³⁺ bilan bir xil), k(Cu-O)ax
              = 1.15 (yumshoq, [Ag(NH₃)₂]⁺ dan ham past)
            </li>
            <li className="pl-2">
              <strong className="text-cyan-400">77 K past haroratda</strong>{" "}
              dinamik → statik JT o'tishi Raman polosalarining tor bo'lishi
              orqali kuzatiladi. Bu Cu(II) fizikaviy kimyosining klassik
              tajribasi
            </li>
            <li className="pl-2">
              <strong className="text-cyan-400">Ilova diapazoni</strong>:
              bioanorganik kimyodan (SOD, plastocyanin) MOF va molekulyar
              magnitgacha — Cu(II) fanning eng ko'p qo'llaniladigan
              markazlaridan biri
            </li>
            <li className="pl-2">
              <strong className="text-cyan-400">CuSO₄·5H₂O</strong> —
              [Cu(H₂O)₆]²⁺ ni o'rganish uchun eng qulay manba. Statik JT
              kristall strukturasi butun koordinatsion kimyo darsligining
              klassik namunasi
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
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
          >
            📄 PDF Hisobot yaratish
          </button>
          <Link
            href="/ilmiy/tahlil/raman/birikmalar/cr-h2o6"
            className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold transition-all"
          >
            [Cr(H₂O)₆]³⁺ →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>
            © 2026 JDA-Kimyo • [Cu(H₂O)₆]²⁺ (Yan-Teller klassik namunasi) •
            Raman spektroskopiya moduli (premium)
          </p>
          <p className="mt-2 text-purple-600">
            Manbalar: Nakamoto K. — Infrared and Raman Spectra (2009); Jahn &
            Teller — Proc. R. Soc. A (1937);
            <br />
            Hathaway & Billing — Coord. Chem. Rev. (1970); Bersuker I.B. —
            Jahn-Teller Effect (2006)
          </p>
        </div>
      </footer>
    </main>
  );
}
