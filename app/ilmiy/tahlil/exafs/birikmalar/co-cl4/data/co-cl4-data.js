export const basicInfo = {
  formula: "[CoCl₄]²⁻",
  iupac: "tetraxlorokobaltat(II) ioni",
  tarixiy: "",
  oksidlanishDarajasi: "Co²⁺",
  elektronKonfig: "d⁷ (HS, t₂g⁵ e_g² — tetraedrik)",
  spinHolati: "S = 3/2",
  magnitXossasi: "Paramagnit (μ ≈ 4.40 μB)",
  geometriya: "Tetraedrik (T_d)",
  rang: "Ko'k",
  rangSababi: "d−d o'tish (⁴A₂ → ⁴T₁(P)) ~620 nm — qizil yutilish, ko'k rang qaytadi",
  kashfiyot: "Tetraedrik Co²⁺ komplekslarining klassik namunasi",
  ahamiyati: "Co²⁺ (d⁷, HS) — tetraedrik geometriya uchun ideal (CFSE minimal). [Co(H₂O)₆]²⁺ (oktaedrik, pushti) dan farqli o'laroq ko'k rang. Geometriya farqi rang farqini keltirib chiqaradi — bu koordinatsion kimyoning klassik namunasi.",
  bondLength: "Co−Cl = 2.252 Å (4 ta teng bog')",
};

export const exafsParametrlar = {
  S02: { value: 0.80, note: "FEFF8 hisobidan, Co folga standarti" },
  deltaE0: { value: 1.8, note: "eV — barcha qobiqlar uchun global siljish" },
  rFactor: { value: 0.013, note: "Global R-faktor" },
  kRange: "2.5−13.0 Å⁻¹",
  rRange: "1.0−5.0 Å",
};

export const qobiqlar = [
  {
    id: 1,
    name: "Co−Cl",
    N: "4.0",
    R: "2.252 ± 0.008",
    sigma2: "0.0025 ± 0.0005",
    note: "1-qobiq. 4 ta Cl⁻ ligandlari — tetraedrik geometriya (T_d). Bog' uzunligi Co²⁺ (HS) ion radiusi (0.72 Å) + Cl⁻ radiusiga mos. σ² kattaroq — labil kompleks.",
  },
  {
    id: 2,
    name: "Co−K/Co−NR₄",
    N: "~4−6",
    R: "4.2−5.8 (tarqoq)",
    sigma2: "0.0060 ± 0.0020",
    note: "2-qobiq. Qarshi ionlar (K⁺, NR₄⁺). Tetraedrik anion atrofida tartibsiz joylashgan.",
  },
];

export const xanesParametrlar = {
  e0: { value: "7724.5 eV", note: "Co K-chegara. Co⁰ (7709 eV) ga nisbatan +15.5 eV siljigan — Co²⁺ ga mos." },
  preEdge: {
    energy: "7711.5 eV",
    intensity: "~0.15−0.25 (kuchli)",
    note: "1s → 3d o'tish. Tetraedrik simmetriya (T_d) — markaziy simmetriya yo'q, dipol taqiqi butunlay yo'qolgan. p-d aralashuvi tufayli pre-edge juda kuchli. Oktaedrik Co²⁺ ga nisbatan 3-5 marta intensivroq.",
  },
  whiteLine: {
    intensity: "O'rtacha",
    note: "1s → 4p o'tish. Co²⁺ (HS) da 4p orbitallar o'rtacha energiyada.",
  },
};

export const epr = {
  gFactor: "g ≈ 2.25−2.30 (keng signal)",
  note: "Co²⁺ (HS, S=3/2) — keng EPR signali. Tetraedrik simmetriyada nol-maydon ajralishi katta — signal faqat past haroratda (≤20 K) kuzatiladi.",
  condition: "Suyuq geliy haroratida (4−20 K). Xona haroratida signal juda keng — kuzatilmaydi.",
};

export const comparisonData = [
  { param: "Oksidlanish darajasi", co2tetra: "Co²⁺ (+2)", co2okta: "Co²⁺ (+2)", co3: "Co³⁺ (+3)" },
  { param: "Elektron konfiguratsiya", co2tetra: "d⁷ (HS, e⁴ t₂³)", co2okta: "d⁷ (HS, t₂g⁵ e_g²)", co3: "d⁶ (LS, t₂g⁶)" },
  { param: "Geometriya", co2tetra: "Tetraedrik (T_d)", co2okta: "Oktaedrik (O_h)", co3: "Oktaedrik (O_h)" },
  { param: "Spin holati", co2tetra: "S=3/2", co2okta: "S=3/2", co3: "S=0" },
  { param: "Rangi", co2tetra: "Ko'k", co2okta: "Pushti", co3: "Sariq" },
  { param: "Co−L (Å)", co2tetra: "Co−Cl: 2.252", co2okta: "Co−O: 2.085", co3: "Co−N: 1.961" },
  { param: "Pre-edge", co2tetra: "Kuchli (0.15−0.25)", co2okta: "Kuchsiz (0.03−0.05)", co3: "Juda kuchsiz (~0.02)" },
  { param: "CFSE", co2tetra: "−0.6Δ_t (kichik)", co2okta: "−0.8Δ₀", co3: "−2.4Δ₀ (katta)" },
  { param: "Labillik", co2tetra: "Labil (tez)", co2okta: "Labil (tez)", co3: "Inert (sekin)" },
];