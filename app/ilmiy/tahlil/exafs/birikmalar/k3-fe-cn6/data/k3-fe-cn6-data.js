export const basicInfo = {
  formula: "K₃[Fe(CN)₆]",
  iupac: "kaliy geksasiyanoferrat(III)",
  tarixiy: "Qizil qon tuzi",
  oksidlanishDarajasi: "Fe³⁺",
  elektronKonfig: "t₂g⁵ (LS, d⁵)",
  spinHolati: "S = 1/2",
  magnitXossasi: "Paramagnit",
  geometriya: "Oktaedrik (monoklin P2₁/c)",
  rang: "To'q qizil",
  rangSababi: "LMCT — CN⁻(π) → Fe³⁺(d) ~420 nm",
  redoksPotensiali: "E° = +0.36 V (SHE), [Fe(CN)₆]³⁻/⁴⁻",
};

export const exafsParametrlar = {
  S02: { value: 0.85, note: "FEFF8 hisobidan, Fe folga standarti bilan solishtirilgan" },
  deltaE0: { value: 2.1, note: "eV — barcha qobiqlar uchun global siljish" },
  rFactor: { value: 0.012, note: "Global R-faktor (barcha qobiqlar birgalikda fit qilingan)" },
  kRange: "2.0−14.0 Å⁻¹",
  rRange: "1.0−5.0 Å",
};

export const qobiqlar = [
  {
    id: 1,
    name: "Fe−C",
    N: 6.0,
    R: "1.942 ± 0.008",
    sigma2: "0.0018 ± 0.0003",
    note: "1-qobiq. CN⁻ ligandlarining C uchlari. Fe²⁺ analogidan (1.918 Å) 0.024 Å uzunroq — π-backbonding zaifroq.",
  },
  {
    id: 2,
    name: "Fe−N",
    N: 6.0,
    R: "3.104 ± 0.012",
    sigma2: "0.0022 ± 0.0004",
    note: "2-qobiq. CN⁻ ligandlarining N uchlari. Fe−C−N deyarli chiziqli (~178°). Kuchli fokuslash effekti — MS yo'llari SS dan kuchliroq.",
  },
  {
    id: 3,
    name: "Fe−K",
    N: "~8 (o'rtacha)",
    R: "4.2−5.8 (tarqoq)",
    sigma2: "0.0035 ± 0.0008",
    note: "3-qobiq. K⁺ qarshi ionlari. Monoklin panjarada nosimmetrik joylashgan — masofalar tarqoq, signal zaif.",
  },
];

export const xanesParametrlar = {
  e0: { value: "7127.5 eV", note: "Fe²⁺ (7126.0 eV) ga nisbatan +1.5 eV siljigan" },
  preEdge: {
    energy: "7113.0 eV",
    intensity: "~0.18−0.25",
    note: "1s → 3d o'tish. Fe³⁺ (t₂g⁵) da bo'sh t₂g o'rni bor — pre-edge kuchli. Fe²⁺ (t₂g⁶, K₄[Fe(CN)₆]) da esa ~0.02−0.05.",
  },
  whiteLine: {
    intensity: "Kuchli",
    note: "1s → 4p o'tish + shakedown (liganddan metallga zaryad ko'chishi). Fe³⁺ da 4p orbitallar pastroq.",
  },
};

export const mossbauer = {
  isomerShift: { value: "−0.12 mm/s", note: "vs α-Fe. LS Fe³⁺ uchun xarakterli — s-elektron zichligi yuqori." },
  quadrupoleSplitting: { value: "0.38 mm/s", note: "t₂g⁵ konfiguratsiya — Yahn-Teller buzilishi tufayli kichik kvadrupol ajralish." },
  hyperfineField: { value: "—", note: "Paramagnit — magnit o'ta nozik maydon yo'q (xona haroratida)." },
};

export const epr = {
  gFactor: "g₁ ≈ 2.00, g₂ ≈ 2.20, g₃ ≈ 2.76",
  note: "Rombik simmetriya (g₁ ≠ g₂ ≠ g₃). t₂g orbitallarining Yahn-Teller buzilishi tufayli degeneratsiya butunlay yo'qolgan.",
  condition: "Xona haroratida va past haroratda (77 K) kuchli signal kuzatiladi.",
};

export const fe2vsFe3 = [
  { param: "Oksidlanish darajasi", fe2: "+2", fe3: "+3" },
  { param: "Elektron konfiguratsiya", fe2: "t₂g⁶ (LS, d⁶)", fe3: "t₂g⁵ (LS, d⁵)" },
  { param: "Spin holati", fe2: "S = 0 (diamagnit)", fe3: "S = 1/2 (paramagnit)" },
  { param: "E₀ (Fe K-chegara)", fe2: "7126.0 eV", fe3: "7127.5 eV (+1.5 eV)" },
  { param: "Pre-edge energiyasi", fe2: "7111.8 eV", fe3: "7113.0 eV (+1.2 eV)" },
  { param: "Pre-edge intensivligi", fe2: "~0.02−0.05 (kuchsiz)", fe3: "~0.18−0.25 (kuchli)" },
  { param: "Fe−C bog' uzunligi", fe2: "1.918 Å", fe3: "1.942 Å (+0.024 Å)" },
  { param: "Oq chiziq", fe2: "Kuchsiz", fe3: "Kuchli" },
  { param: "Rangi", fe2: "Sariq", fe3: "To'q qizil" },
];

export const msPaths = [
  { type: "SS", path: "Fe → C → Fe", legs: 2, Reff: "1.94 Å", strength: "Kuchli" },
  { type: "SS", path: "Fe → N → Fe", legs: 2, Reff: "3.10 Å", strength: "O'rtacha" },
  { type: "MS", path: "Fe → C → N → Fe", legs: 3, Reff: "3.10 Å", strength: "Juda kuchli — fokuslash!" },
  { type: "MS", path: "Fe → C → N → C → Fe", legs: 4, Reff: "3.10 Å", strength: "O'rtacha" },
];

export const temperatureData = {
  thetaE: "~750 K (Fe−C uchun Einstein harorati)",
  formula: "σ²(T) = σ²_stat + (ℏ²/2μk_BΘ_E) · coth(Θ_E/2T)",
  defaultT: 300,
  sigmaStatic: 0.0012,
};