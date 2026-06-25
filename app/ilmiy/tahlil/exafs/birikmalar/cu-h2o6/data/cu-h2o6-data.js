export const basicInfo = {
  formula: "[Cu(H₂O)₆]²⁺",
  iupac: "geksaakvamis(II) ioni",
  tarixiy: "",
  oksidlanishDarajasi: "Cu²⁺",
  elektronKonfig: "d⁹ (cho'zilgan oktaedr, Yahn-Teller)",
  spinHolati: "S = 1/2",
  magnitXossasi: "Paramagnit (μ ≈ 1.73 μB)",
  geometriya: "Cho'zilgan oktaedr (4 qisqa + 2 uzun bog')",
  rang: "Havorang",
  rangSababi: "d−d o'tish (²E_g → ²T₂g) ~800 nm — yaqin IQ yutilish, ko'rinadigan sohada keng yutilish",
  kashfiyot: "Yahn-Teller effektining klassik namunasi (d⁹ konfiguratsiya)",
  ahamiyati: "Yahn-Teller effektining eng klassik namunasi. Cu²⁺ (d⁹) da e_g orbitallarda 3 ta elektron — degeneratsiya buziladi. Natijada oktaedr cho'ziladi: 4 ta ekvatorial Cu−O = 1.96 Å, 2 ta aksial Cu−O = 2.28 Å. Bu EXAFS da yaqqol ko'rinadi.",
  bondLength: "Cu−O(ekv) = 1.968 Å (4 ta), Cu−O(aks) = 2.275 Å (2 ta)",
};

export const exafsParametrlar = {
  S02: { value: 0.85, note: "FEFF8 hisobidan, Cu folga standarti" },
  deltaE0: { value: 2.0, note: "eV — barcha qobiqlar uchun global siljish" },
  rFactor: { value: 0.012, note: "Global R-faktor (barcha qobiqlar birgalikda)" },
  kRange: "2.5−14.0 Å⁻¹",
  rRange: "1.0−5.0 Å",
};

export const qobiqlar = [
  {
    id: 1,
    name: "Cu−O (ekvatorial)",
    N: "4.0",
    R: "1.968 ± 0.007",
    sigma2: "0.0022 ± 0.0004",
    note: "1-qobiq (ekvatorial). 4 ta H₂O ligandlari xy tekisligida. Bog' qisqa — kuchli σ-bog'. Yahn-Teller stabillashuvi.",
  },
  {
    id: 2,
    name: "Cu−O (aksial)",
    N: "2.0",
    R: "2.275 ± 0.012",
    sigma2: "0.0035 ± 0.0008",
    note: "2-qobiq (aksial). 2 ta H₂O ligandlari z o'qida. Bog' uzun — Yahn-Teller cho'zilishi. σ² katta — ligandlar harakatchan.",
  },
  {
    id: 3,
    name: "Cu−H (H₂O)",
    N: "12.0",
    R: "2.65 ± 0.02",
    sigma2: "0.0050 ± 0.0015",
    note: "3-qobiq. H₂O ligandlarining H atomlari. Masofalar tarqoq — signal zaif va keng.",
  },
];

export const xanesParametrlar = {
  e0: { value: "8995 eV", note: "Cu K-chegara. Cu⁰ (8979 eV) ga nisbatan +16 eV siljgan — Cu²⁺ ga mos." },
  preEdge: {
    energy: "8978.5 eV",
    intensity: "~0.04−0.06 (kuchsiz-o'rtacha)",
    note: "1s → 3d o'tish. Cu²⁺ (d⁹) — 3d da 1 ta bo'sh o'rin. Oktaedrik simmetriya — dipol taqiqi mavjud. Pre-edge kuchsiz.",
  },
  whiteLine: {
    intensity: "Kuchli",
    note: "1s → 4p o'tish. Cu²⁺ da 4p orbitallar pastroq energiyada — o'tish kuchli. Oq chiziq shakli Yahn-Teller buzilishini aks ettiradi.",
  },
};

export const epr = {
  gFactor: "g∥ ≈ 2.40, g⊥ ≈ 2.08 (aksial simmetriya)",
  hyperfine: "A∥ ≈ 120−140 × 10⁻⁴ sm⁻¹ (⁶³Cu, I=3/2)",
  note: "Cu²⁺ (S=1/2) — kuchli EPR signali. g∥ > g⊥ — cho'zilgan oktaedr uchun xarakterli. 4 ta parallel chiziq (⁶³Cu yadro spini I=3/2).",
  condition: "Xona haroratida va 77 K da kuchli signal kuzatiladi.",
};

export const yahnTeller = {
  title: "Yahn-Teller effekti — d⁹ konfiguratsiya",
  desc: "Cu²⁺ (d⁹) da e_g orbitallarda 3 ta elektron: dx²−y² (2e⁻) + dz² (1e⁻). Degeneratsiya buziladi — dz² bo'ylab elektron zichligi kamroq, ligandlar yaqinlashadi (z o'qi qisqaradi). dx²−y² bo'ylab elektron zichligi ko'proq, ligandlar uzoqlashadi (xy tekisligi kengayadi). Natija: cho'zilgan oktaedr.",
  energyGain: "Yahn-Teller stabillashuv energiyasi ≈ 900 sm⁻¹ (~0.11 eV)",
  impact: "Cu−O(ekv) = 1.968 Å (qisqa), Cu−O(aks) = 2.275 Å (uzun). Farq ≈ 0.307 Å — EXAFS da yaqqol ko'rinadi.",
};

export const comparisonData = [
  { param: "Oksidlanish darajasi", cu2: "Cu²⁺ (+2)", cu1: "Cu⁺ (+1)", ni2: "Ni²⁺ (+2)" },
  { param: "Elektron konfiguratsiya", cu2: "d⁹ (Yahn-Teller)", cu1: "d¹⁰ (to'liq to'lgan)", ni2: "d⁸ (kvadrat tekislik)" },
  { param: "Geometriya", cu2: "Cho'zilgan oktaedr", cu1: "Chiziqli/tetraedrik", ni2: "Kvadrat tekislik" },
  { param: "Spin holati", cu2: "S=1/2 (paramagnit)", cu1: "S=0 (diamagnit)", ni2: "S=0 (diamagnit)" },
  { param: "Rangi", cu2: "Havorang", cu1: "Rangsiz", ni2: "Sariq/yashil" },
  { param: "M−O (Å)", cu2: "1.968 (ekv), 2.275 (aks)", cu1: "~1.85 (chiziqli)", ni2: "2.05 (oktaedrik)" },
  { param: "E₀ (eV)", cu2: "8995", cu1: "8982", ni2: "8340" },
  { param: "EPR", cu2: "Kuchli (S=1/2)", cu1: "Yo'q (S=0)", ni2: "Yo'q (S=0)" },
  { param: "Yahn-Teller", cu2: "BOR (kuchli)", cu1: "Yo'q (d¹⁰)", ni2: "Yo'q (d⁸ LS)" },
];