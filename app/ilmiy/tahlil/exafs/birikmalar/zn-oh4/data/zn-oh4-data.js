export const basicInfo = {
  formula: "[Zn(OH)₄]²⁻",
  iupac: "tetragidroksosinkat(II) ioni",
  tarixiy: "",
  oksidlanishDarajasi: "Zn²⁺",
  elektronKonfig: "d¹⁰ (to'liq to'lgan)",
  spinHolati: "S = 0",
  magnitXossasi: "Diamagnit",
  geometriya: "Tetraedrik (T_d)",
  rang: "Rangsiz",
  rangSababi: "d¹⁰ — d−d o'tish yo'q. LMCT UB sohada (yuqori energiya).",
  kashfiyot: "Amfoter rux gidroksidning ishqorda erishi natijasida hosil bo'ladi",
  ahamiyati: "d¹⁰ konfiguratsiyali tetraedrik komplekslarning klassik namunasi. CFSE = 0 — geometriya faqat ligandlar soni va sterikasi bilan belgilanadi. Zn²⁺ — karboangidraza fermentida muhim rol o'ynaydi. Zn²⁺ — labil (tez almashinadi).",
  bondLength: "Zn−O = 1.972 Å (4 ta teng bog')",
};

export const exafsParametrlar = {
  S02: { value: 0.85, note: "FEFF8 hisobidan, Zn folga standarti" },
  deltaE0: { value: 1.5, note: "eV — barcha qobiqlar uchun global siljish" },
  rFactor: { value: 0.010, note: "Global R-faktor" },
  kRange: "2.5−13.0 Å⁻¹",
  rRange: "1.0−5.0 Å",
};

export const qobiqlar = [
  {
    id: 1,
    name: "Zn−O",
    N: "4.0",
    R: "1.972 ± 0.007",
    sigma2: "0.0020 ± 0.0004",
    note: "1-qobiq. 4 ta OH⁻ ligandlari — tetraedrik geometriya (T_d). Zn²⁺ (d¹⁰) — CFSE=0, bog' uzunligi ion radiuslari bilan belgilanadi.",
  },
  {
    id: 2,
    name: "Zn−Na/K",
    N: "~4−6",
    R: "3.8−5.5 (tarqoq)",
    sigma2: "0.0055 ± 0.0015",
    note: "2-qobiq. Qarshi ionlar (Na⁺, K⁺). Masofalar tarqoq — signal zaif.",
  },
];

export const xanesParametrlar = {
  e0: { value: "9665 eV", note: "Zn K-chegara. Zn⁰ (9659 eV) ga nisbatan +6 eV siljigan — Zn²⁺ ga mos." },
  preEdge: {
    energy: "—",
    intensity: "K-chegarada pre-edge kuzatilmaydi",
    note: "Zn K-chegara 1s → 4p o'tish. Dipol ruxsat etilgan. d¹⁰ — 3d to'liq to'lgan, pre-edge yo'q.",
  },
  whiteLine: {
    intensity: "Kuchli",
    note: "Zn²⁺ (d¹⁰) da oq chiziq kuchli — 4p orbitallar bo'sh. d¹⁰ konfiguratsiyada oq chiziq har doim mavjud (bo'sh 4p orbitallar).",
  },
};

export const comparisonData = [
  { param: "Oksidlanish darajasi", zn: "Zn²⁺ (+2)", cd: "Cd²⁺ (+2)", hg: "Hg²⁺ (+2)" },
  { param: "Elektron konfiguratsiya", zn: "d¹⁰ (to'liq to'lgan)", cd: "d¹⁰", hg: "d¹⁰" },
  { param: "Geometriya", zn: "Tetraedrik (KS=4)", cd: "Tetraedrik (KS=4)", hg: "Chiziqli (KS=2)" },
  { param: "Spin holati", zn: "S=0 (diamagnit)", cd: "S=0", hg: "S=0" },
  { param: "Rangi", zn: "Rangsiz", cd: "Rangsiz", hg: "Rangsiz" },
  { param: "M−O (Å)", zn: "1.972", cd: "2.20", hg: "2.05 (M−N)" },
  { param: "E₀ (eV)", zn: "9665 (K)", cd: "26720 (K)", hg: "12285 (L₃)" },
  { param: "CFSE", zn: "0 (d¹⁰)", cd: "0", hg: "0" },
  { param: "HSAB", zn: "Chegaraviy kislota", cd: "Yumshoq kislota", hg: "Yumshoq kislota" },
  { param: "Qo'llanilishi", zn: "Karboangidraza", cd: "Zaharli", hg: "Zaharli" },
];