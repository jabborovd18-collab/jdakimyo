export const basicInfo = {
  formula: "[Fe(C₅H₅)₂]",
  iupac: "bis(η⁵-siklopentadienil)temir(II)",
  tarixiy: "Ferrosen",
  olim: "Kealy & Pauson — 1951 (kashfiyot), Wilkinson & Fischer — Nobel 1973",
  oksidlanishDarajasi: "Fe²⁺",
  elektronKonfig: "d⁶ (LS, 18 elektron qoidasi)",
  spinHolati: "S = 0",
  magnitXossasi: "Diamagnit",
  geometriya: "Sendvich (D₅d — qiya, D₅h — ustma-ust)",
  rang: "To'q sariq kristall",
  rangSababi: "d−d o'tish (¹A₁g → ¹E₁g) + MLCT ~440 nm",
  kashfiyot: "1951 — birinchi sendvich kompleks. Organometallik kimyoning boshlanishi.",
  ahamiyati: "Birinchi sintez qilingan metallosen. Organometallik kimyoning ramzi. 18 elektron qoidasining klassik namunasi. Issiqlikka chidamli (500°C gacha), suvda erimaydi.",
  bondLength: "Fe−C = 2.064 Å (barcha 10 ta C teng), C−C = 1.440 Å (Cp halqasida)",
};

export const exafsParametrlar = {
  S02: { value: 0.80, note: "FEFF8 hisobidan, Fe folga standarti" },
  deltaE0: { value: 1.2, note: "eV — barcha qobiqlar uchun global siljish" },
  rFactor: { value: 0.013, note: "Global R-faktor (barcha qobiqlar birgalikda)" },
  kRange: "2.0−14.0 Å⁻¹",
  rRange: "1.0−5.0 Å",
};

export const qobiqlar = [
  {
    id: 1,
    name: "Fe−C",
    N: "10.0",
    R: "2.064 ± 0.008",
    sigma2: "0.0021 ± 0.0004",
    note: "1-qobiq. Ikkala Cp halqasidagi 10 ta C atomi. Masofalar bir xil — η⁵-koordinatsiya simmetrik.",
  },
  {
    id: 2,
    name: "Fe−H (Cp)",
    N: "10.0",
    R: "2.85 ± 0.02",
    sigma2: "0.0040 ± 0.0010",
    note: "2-qobiq. Cp halqalaridagi H atomlari. Masofalar tarqoq — signal zaif va keng.",
  },
  {
    id: 3,
    name: "Fe−Fe (molekulalararo)",
    N: "~2",
    R: "4.20 ± 0.05",
    sigma2: "0.0060 ± 0.0020",
    note: "3-qobiq. Kristall panjarada qo'shni ferrosen molekulalari orasidagi masofa.",
  },
];

export const xanesParametrlar = {
  e0: { value: "7124.5 eV", note: "Fe K-chegara. Fe⁰ (7110 eV) va Fe³⁺ (7127.5 eV) orasida — Fe²⁺ ga mos." },
  preEdge: {
    energy: "7111.5 eV",
    intensity: "~0.04−0.06 (kuchsiz-o'rtacha)",
    note: "1s → 3d o'tish. Fe²⁺ (LS, d⁶) — t₂g to'lgan, e_g bo'sh. Oktaedrik simmetriya yo'q — dipol taqiqi zaifroq.",
  },
  whiteLine: {
    intensity: "O'rtacha",
    note: "1s → 4p o'tish. Fe²⁺ da 4p orbitallar o'rtacha energiyada. Ferrosenda oq chiziq shakli Cp ligandlari tufayli murakkab.",
  },
};

export const mossbauer = {
  isomerShift: { value: "+0.54 mm/s", note: "vs α-Fe. Fe²⁺ (LS) uchun xarakterli. K₄[Fe(CN)₆] (−0.04) dan keskin farq qiladi — Cp⁻ kuchli donor ligand." },
  quadrupoleSplitting: { value: "2.40 mm/s", note: "Juda katta! Sendvich strukturada elektr maydon gradienti kuchli — yuqori anizotropiya." },
  hyperfineField: { value: "—", note: "Diamagnit (S=0) — magnit o'ta nozik maydon yo'q." },
};

export const comparisonData = [
  { param: "Oksidlanish darajasi", ferrosen: "Fe²⁺ (+2)", ferrosenium: "Fe³⁺ (+3)", asilferrosen: "Fe²⁺ (+2)" },
  { param: "Elektron konfiguratsiya", ferrosen: "d⁶ (LS, 18e⁻)", ferrosenium: "d⁵ (LS, 17e⁻)", asilferrosen: "d⁶ (LS, 18e⁻)" },
  { param: "Rangi", ferrosen: "To'q sariq", ferrosenium: "Ko'k", asilferrosen: "Qizil-binafsha" },
  { param: "Magnit xossasi", ferrosen: "Diamagnit", ferrosenium: "Paramagnit", asilferrosen: "Diamagnit" },
  { param: "Fe−C (Å)", ferrosen: "2.064", ferrosenium: "2.075 (uzunroq)", asilferrosen: "2.060" },
  { param: "E₀ (Fe K, eV)", ferrosen: "7124.5", ferrosenium: "7126.5", asilferrosen: "7125.0" },
  { param: "Mössbauer δ (mm/s)", ferrosen: "+0.54", ferrosenium: "+0.43", asilferrosen: "+0.58" },
  { param: "Mössbauer ΔE_Q (mm/s)", ferrosen: "2.40", ferrosenium: "0.50", asilferrosen: "2.30" },
  { param: "Qo'llanilishi", ferrosen: "Organometallik kimyo", ferrosenium: "Oksidlovchi", asilferrosen: "Dori sintezi" },
];