export const basicInfo = {
  formula: "[Fe(CO)₅]",
  iupac: "pentakarboniltemir(0)",
  tarixiy: "Temir pentakarbonil",
  oksidlanishDarajasi: "Fe⁰",
  elektronKonfig: "d⁸ (18 elektron qoidasi)",
  spinHolati: "S = 0",
  magnitXossasi: "Diamagnit",
  geometriya: "Trigonal bipiramida (D₃h)",
  rang: "Sariq suyuqlik",
  rangSababi: "MLCT — Fe(dπ) → CO(π*) ~350 nm",
  kashfiyot: "1891 — Mond va Langer tomonidan kashf etilgan. Birinchi metall karbonil kompleksi.",
  ahamiyati: "Metall karbonil komplekslarining klassik namunasi. Fe⁰ — nol oksidlanish darajasi. 18 elektron qoidasi: Fe(0) = 8e⁻ + 5×CO(2e⁻) = 18e⁻. CO — kuchli π-akseptor ligand. Berry psevdorotatsiyasi orqali aksial va ekvatorial CO ligandlari almashinadi.",
  bondLength: "Fe−C(aks) = 1.807 Å (2 ta), Fe−C(ekv) = 1.827 Å (3 ta)",
};

export const exafsParametrlar = {
  S02: { value: 0.82, note: "FEFF8 hisobidan, Fe folga standarti" },
  deltaE0: { value: 1.5, note: "eV — barcha qobiqlar uchun global siljish" },
  rFactor: { value: 0.014, note: "Global R-faktor" },
  kRange: "2.5−15.0 Å⁻¹",
  rRange: "1.0−5.0 Å",
};

export const qobiqlar = [
  {
    id: 1,
    name: "Fe−C(aks)",
    N: "2.0",
    R: "1.807 ± 0.006",
    sigma2: "0.0015 ± 0.0003",
    note: "1-qobiq (aksial). 2 ta CO ligandlari z o'qida. Bog' qisqaroq — kuchli π-backbonding (Fe→CO π*).",
  },
  {
    id: 2,
    name: "Fe−C(ekv)",
    N: "3.0",
    R: "1.827 ± 0.007",
    sigma2: "0.0016 ± 0.0003",
    note: "2-qobiq (ekvatorial). 3 ta CO ligandlari xy tekisligida. Aksialga nisbatan biroz uzunroq — π-backbonding zaifroq.",
  },
  {
    id: 3,
    name: "Fe−O",
    N: "5.0",
    R: "2.95 ± 0.02",
    sigma2: "0.0030 ± 0.0008",
    note: "3-qobiq. CO ligandlarining O uchlari. Fe−C−O deyarli chiziqli (~178°). Fokuslash effekti kuchli.",
  },
];

export const xanesParametrlar = {
  e0: { value: "7114.5 eV", note: "Fe K-chegara. Fe⁰ — eng past E₀ (Fe²⁺ ~7124 eV, Fe³⁺ ~7128 eV)." },
  preEdge: {
    energy: "7111.0 eV",
    intensity: "~0.03−0.05 (kuchsiz)",
    note: "1s → 3d o'tish. Fe⁰ (d⁸) — t₂g to'lgan, e_g bo'sh. Trigonal bipiramida — simmetriya past, dipol taqiqi zaif.",
  },
  whiteLine: {
    intensity: "Minimal",
    note: "Fe⁰ da oq chiziq deyarli yo'q — CO kuchli π-akseptor, Fe elektron kambag'al. 4p orbitallar yuqori energiyada.",
  },
};

export const mossbauer = {
  isomerShift: { value: "−0.18 mm/s", note: "vs α-Fe. Fe⁰ uchun xarakterli. CO π-akseptor — s-elektron zichligi yuqori." },
  quadrupoleSplitting: { value: "2.52 mm/s", note: "Trigonal bipiramida — kuchli anizotropiya. Berry psevdorotatsiyasi tufayli haroratga bog'liq." },
  hyperfineField: { value: "—", note: "Diamagnit (S=0)." },
};

export const berryInfo = {
  title: "Berry psevdorotatsiyasi",
  desc: "Fe(CO)₅ da aksial va ekvatorial CO ligandlari Berry mexanizmi orqali almashinadi. Xona haroratida bu jarayon juda tez — YaMR da barcha 5 ta CO bitta signal beradi. Past haroratda (−100°C) almashinish sekinlashadi — 2 ta signal (2:3 nisbatda). EXAFS da ikkala masofa alohida ko'rinadi.",
  energy: "Aktivatsiya energiyasi ≈ 15 kJ/mol",
};

export const comparisonData = [
  { param: "Oksidlanish darajasi", feco5: "Fe⁰ (0)", crco6: "Cr⁰ (0)", nico4: "Ni⁰ (0)" },
  { param: "Elektron konfiguratsiya", feco5: "d⁸ (18e⁻)", crco6: "d⁶ (18e⁻)", nico4: "d¹⁰ (18e⁻)" },
  { param: "Geometriya", feco5: "Trigonal bipiramida", crco6: "Oktaedrik", nico4: "Tetraedrik" },
  { param: "CO soni", feco5: "5", crco6: "6", nico4: "4" },
  { param: "Rangi", feco5: "Sariq suyuqlik", crco6: "Rangsiz kristall", nico4: "Rangsiz suyuqlik" },
  { param: "M−C (Å)", feco5: "1.807(aks), 1.827(ekv)", crco6: "1.910", nico4: "1.838" },
  { param: "E₀ (eV)", feco5: "7114.5 (Fe K)", crco6: "5993 (Cr K)", nico4: "8335 (Ni K)" },
  { param: "Qaynash harorati", feco5: "103°C", crco6: "Sublimatsiya", nico4: "43°C" },
  { param: "Zaharliligi", feco5: "Yuqori (CO ajraladi)", crco6: "Past", nico4: "Juda yuqori" },
];