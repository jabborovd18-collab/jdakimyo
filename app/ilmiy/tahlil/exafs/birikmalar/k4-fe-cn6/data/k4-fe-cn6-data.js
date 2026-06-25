export const basicInfo = {
  formula: "K₄[Fe(CN)₆]",
  iupac: "kaliy geksasiyanoferrat(II)",
  tarixiy: "Sariq qon tuzi",
  oksidlanishDarajasi: "Fe²⁺",
  elektronKonfig: "t₂g⁶ (LS, d⁶)",
  spinHolati: "S = 0",
  magnitXossasi: "Diamagnit",
  geometriya: "Oktaedrik (monoklin, 3H₂O gidratlangan)",
  rang: "Sariq",
  rangSababi: "LMCT — CN⁻(π) → Fe²⁺(d) ~320 nm (UB sohada, ko'rinadigan sohada zaif yutilish)",
  redoksPotensiali: "E° = +0.36 V (SHE), [Fe(CN)₆]⁴⁻ → [Fe(CN)₆]³⁻ + e⁻",
};

export const exafsParametrlar = {
  S02: { value: 0.85, note: "FEFF8 hisobidan, K₃[Fe(CN)₆] bilan bir xil" },
  deltaE0: { value: 1.8, note: "eV — barcha qobiqlar uchun global siljish" },
  rFactor: { value: 0.010, note: "Global R-faktor (barcha qobiqlar birgalikda)" },
  kRange: "2.0−14.0 Å⁻¹",
  rRange: "1.0−5.0 Å",
};

export const qobiqlar = [
  {
    id: 1,
    name: "Fe−C",
    N: "6.0",
    R: "1.918 ± 0.007",
    sigma2: "0.0015 ± 0.0003",
    note: "1-qobiq. CN⁻ ligandlarining C uchlari. Fe³⁺ analogidan (1.942 Å) 0.024 Å qisqaroq — π-backbonding kuchliroq.",
  },
  {
    id: 2,
    name: "Fe−N",
    N: "6.0",
    R: "3.080 ± 0.010",
    sigma2: "0.0019 ± 0.0004",
    note: "2-qobiq. CN⁻ ligandlarining N uchlari. Fe−C−N deyarli chiziqli (~178°). Fokuslash effekti mavjud.",
  },
  {
    id: 3,
    name: "Fe−K",
    N: "~8 (o'rtacha)",
    R: "4.3−5.9 (tarqoq)",
    sigma2: "0.0040 ± 0.0010",
    note: "3-qobiq. K⁺ qarshi ionlari. Monoklin panjarada joylashgan. K₃[Fe(CN)₆] ga nisbatan K⁺ ko'proq (4:3).",
  },
];

export const xanesParametrlar = {
  e0: { value: "7126.0 eV", note: "Fe³⁺ (7127.5 eV) ga nisbatan −1.5 eV pastroq" },
  preEdge: {
    energy: "7111.8 eV",
    intensity: "~0.02−0.05 (juda kuchsiz)",
    note: "1s → 3d o'tish. Fe²⁺ (t₂g⁶) da bo'sh t₂g o'rni YO'Q — Pauli prinsipi taqiqlaydi. Pre-edge deyarli ko'rinmaydi.",
  },
  whiteLine: {
    intensity: "Kuchsiz",
    note: "1s → 4p o'tish. Fe²⁺ da 4p orbitallar yuqoriroq energiyada — o'tish ehtimoli pastroq.",
  },
};

export const mossbauer = {
  isomerShift: { value: "−0.04 mm/s", note: "vs α-Fe. LS Fe²⁺ uchun xarakterli. K₃[Fe(CN)₆] (−0.12) ga nisbatan musbatroq — s-elektron zichligi pastroq." },
  quadrupoleSplitting: { value: "0.00 mm/s", note: "t₂g⁶ konfiguratsiya — mukammal oktaedrik simmetriya. Elektr maydon gradienti nolga yaqin." },
  hyperfineField: { value: "—", note: "Diamagnit (S=0) — magnit o'ta nozik maydon yo'q." },
};

export const fe2vsFe3 = [
  { param: "Oksidlanish darajasi", fe2: "+2 (K₄[Fe(CN)₆])", fe3: "+3 (K₃[Fe(CN)₆])" },
  { param: "Elektron konfiguratsiya", fe2: "t₂g⁶ (LS, d⁶)", fe3: "t₂g⁵ (LS, d⁵)" },
  { param: "Spin holati", fe2: "S = 0 (diamagnit)", fe3: "S = 1/2 (paramagnit)" },
  { param: "E₀ (Fe K-chegara)", fe2: "7126.0 eV", fe3: "7127.5 eV (+1.5 eV)" },
  { param: "Pre-edge energiyasi", fe2: "7111.8 eV", fe3: "7113.0 eV (+1.2 eV)" },
  { param: "Pre-edge intensivligi", fe2: "~0.02−0.05 (deyarli yo'q)", fe3: "~0.18−0.25 (kuchli)" },
  { param: "Fe−C bog' uzunligi", fe2: "1.918 Å", fe3: "1.942 Å (+0.024 Å)" },
  { param: "Oq chiziq", fe2: "Kuchsiz", fe3: "Kuchli" },
  { param: "Rangi", fe2: "Sariq (LMCT ~320 nm)", fe3: "To'q qizil (LMCT ~420 nm)" },
  { param: "Mössbauer δ", fe2: "−0.04 mm/s", fe3: "−0.12 mm/s" },
  { param: "Mössbauer ΔE_Q", fe2: "0.00 mm/s", fe3: "0.38 mm/s" },
  { param: "EPR signali", fe2: "YO'Q (diamagnit)", fe3: "BOR (g₁≠g₂≠g₃)" },
];