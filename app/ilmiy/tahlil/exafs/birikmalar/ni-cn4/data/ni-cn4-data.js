export const basicInfo = {
  formula: "[Ni(CN)₄]²⁻",
  iupac: "tetrasiyanonikkolat(II) ioni",
  tarixiy: "",
  oksidlanishDarajasi: "Ni²⁺",
  elektronKonfig: "d⁸ (LS, kvadrat tekislik)",
  spinHolati: "S = 0",
  magnitXossasi: "Diamagnit",
  geometriya: "Kvadrat tekislik (D₄h)",
  rang: "Sariq",
  rangSababi: "d−d o'tish + MLCT ~380 nm",
  kashfiyot: "Klassik Werner tipidagi kompleks",
  ahamiyati: "d⁸ konfiguratsiyali kvadrat tekislik komplekslarning klassik namunasi. CN⁻ kuchli maydon ligand — Δ₀ katta, dx²−y² orbital bo'sh qoladi. Sisplatin (Pt²⁺) bilan izoelektronik.",
  bondLength: "Ni−C = 1.858 Å, C≡N = 1.157 Å",
};

export const exafsParametrlar = {
  S02: { value: 0.82, note: "FEFF8 hisobidan, Ni folga standarti" },
  deltaE0: { value: 1.8, note: "eV — barcha qobiqlar uchun global siljish" },
  rFactor: { value: 0.010, note: "Global R-faktor (barcha qobiqlar birgalikda)" },
  kRange: "2.0−14.0 Å⁻¹",
  rRange: "1.0−5.0 Å",
};

export const qobiqlar = [
  {
    id: 1,
    name: "Ni−C",
    N: "4.0",
    R: "1.858 ± 0.007",
    sigma2: "0.0014 ± 0.0003",
    note: "1-qobiq. 4 ta CN⁻ ligandlarining C uchlari. Kvadrat tekislik — ekvatorial tekislikda. Bog' juda qisqa — kuchli σ-bog' + π-backbonding.",
  },
  {
    id: 2,
    name: "Ni−N",
    N: "4.0",
    R: "3.015 ± 0.010",
    sigma2: "0.0018 ± 0.0004",
    note: "2-qobiq. CN⁻ ligandlarining N uchlari. Ni−C−N deyarli chiziqli (~178°). Fokuslash effekti kuchli.",
  },
  {
    id: 3,
    name: "Ni−K/Na",
    N: "~4",
    R: "4.0−5.5 (tarqoq)",
    sigma2: "0.0045 ± 0.0010",
    note: "3-qobiq. Qarshi ionlar (K⁺ yoki Na⁺). Masofalar tarqoq — signal zaif.",
  },
];

export const xanesParametrlar = {
  e0: { value: "8340 eV", note: "Ni K-chegara. Ni⁰ (8333 eV) ga nisbatan +7 eV siljigan — Ni²⁺ ga mos." },
  preEdge: {
    energy: "8333.5 eV",
    intensity: "~0.06−0.10 (o'rtacha)",
    note: "1s → 3d o'tish. Ni²⁺ (d⁸) — dx²−y² bo'sh. Kvadrat tekislikda dipol taqiqi zaifroq (markaziy simmetriya yo'q). Pre-edge sezilarli.",
  },
  whiteLine: {
    intensity: "Kuchli",
    note: "1s → 4p o'tish. Ni²⁺ da 4p orbitallar pastroq energiyada — o'tish kuchli. CN⁻ π-akseptorligi tufayli shakedown mavjud.",
  },
};

export const comparisonData = [
  { param: "Oksidlanish darajasi", ni2: "Ni²⁺ (+2)", pt2: "Pt²⁺ (+2)", pd2: "Pd²⁺ (+2)" },
  { param: "Elektron konfiguratsiya", ni2: "d⁸ (kvadrat tekislik)", pt2: "d⁸ (kvadrat tekislik)", pd2: "d⁸ (kvadrat tekislik)" },
  { param: "M−C (Å)", ni2: "1.858", pt2: "2.012 (M−N)", pd2: "1.98 (M−Cl)" },
  { param: "M−N (Å)", ni2: "3.015", pt2: "3.10", pd2: "3.05" },
  { param: "Spin holati", ni2: "S=0 (diamagnit)", pt2: "S=0 (diamagnit)", pd2: "S=0 (diamagnit)" },
  { param: "Rangi", ni2: "Sariq", pt2: "Sariq (sisplatin)", pd2: "Sariq-to'q sariq" },
  { param: "Δ₀ (sm⁻¹)", ni2: "~33 000", pt2: "~40 000", pd2: "~35 000" },
  { param: "Labillik", ni2: "Labil (tez almashinadi)", pt2: "Inert (sekin)", pd2: "Inert (sekin)" },
];

export const msInfo = {
  title: "Ni−C≡N — fokuslash effekti",
  desc: "Ni−C−N deyarli chiziqli (~178°). 3-leg MS (Ni→C→N→Ni) fokuslash tufayli SS dan kuchliroq. 4-leg MS (Ni→C→N→C→Ni) ham sezilarli. Bu — EXAFS yordamida bog' burchagini aniqlash imkonini beradi.",
};