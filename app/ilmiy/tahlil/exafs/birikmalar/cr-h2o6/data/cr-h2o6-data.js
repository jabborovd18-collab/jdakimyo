export const basicInfo = {
  formula: "[Cr(H₂O)₆]³⁺",
  iupac: "geksaakvaxrom(III) ioni",
  tarixiy: "",
  oksidlanishDarajasi: "Cr³⁺",
  elektronKonfig: "d³ (t₂g³ — yarim to'lgan)",
  spinHolati: "S = 3/2",
  magnitXossasi: "Paramagnit (μ ≈ 3.87 μB)",
  geometriya: "Oktaedrik (O_h)",
  rang: "Yashil-binafsha",
  rangSababi: "d−d o'tish (⁴A₂g → ⁴T₂g ~560 nm, ⁴A₂g → ⁴T₁g ~410 nm) — yashil va binafsha yutilish, to'ldiruvchi rang",
  kashfiyot: "Klassik Verner tipidagi kompleks",
  ahamiyati: "d³ konfiguratsiyaning klassik namunasi. t₂g yarim to'lgan (t₂g³) — barqaror elektron konfiguratsiya. Cr³⁺ — inert (sekin ligand almashinishi), CFSE = −1.2Δ₀ (katta). Oktaedrik komplekslar juda barqaror. Yashil-binafsha rang — xarakterli.",
  bondLength: "Cr−O = 1.966 Å (6 ta teng bog')",
};

export const exafsParametrlar = {
  S02: { value: 0.83, note: "FEFF8 hisobidan, Cr folga standarti" },
  deltaE0: { value: 1.8, note: "eV — barcha qobiqlar uchun global siljish" },
  rFactor: { value: 0.009, note: "Global R-faktor" },
  kRange: "2.5−14.0 Å⁻¹",
  rRange: "1.0−5.0 Å",
};

export const qobiqlar = [
  {
    id: 1,
    name: "Cr−O",
    N: "6.0",
    R: "1.966 ± 0.006",
    sigma2: "0.0017 ± 0.0003",
    note: "1-qobiq. 6 ta H₂O ligandlari — mukammal oktaedrik simmetriya. Cr³⁺ (d³) — t₂g yarim to'lgan, Yahn-Teller yo'q. σ² kichik — inert kompleks, tartibli.",
  },
  {
    id: 2,
    name: "Cr−H (H₂O)",
    N: "12.0",
    R: "2.68 ± 0.02",
    sigma2: "0.0040 ± 0.0010",
    note: "2-qobiq. H₂O ligandlarining H atomlari. Masofalar tarqoq — signal zaif.",
  },
];

export const xanesParametrlar = {
  e0: { value: "6005 eV", note: "Cr K-chegara. Cr⁰ (5989 eV) ga nisbatan +16 eV siljigan — Cr³⁺ ga mos." },
  preEdge: {
    energy: "5993 eV",
    intensity: "~0.03−0.05 (kuchsiz)",
    note: "1s → 3d o'tish. Cr³⁺ (d³) — t₂g yarim to'lgan, e_g bo'sh. Oktaedrik simmetriya — dipol taqiqi mavjud. Pre-edge kuchsiz.",
  },
  whiteLine: {
    intensity: "Kuchli",
    note: "1s → 4p o'tish. Cr³⁺ da 4p orbitallar pastroq energiyada — o'tish kuchli.",
  },
};

export const epr = {
  gFactor: "g ≈ 1.98 (izotrop, O_h simmetriya)",
  hyperfine: "A ≈ 17 × 10⁻⁴ sm⁻¹ (⁵³Cr, I=3/2, 9.5% tabiiy)",
  note: "Cr³⁺ (S=3/2) — EPR signali xona haroratida ham kuzatiladi. Oktaedrik simmetriya — g-faktor izotrop (g_x ≈ g_y ≈ g_z). Nol-maydon ajralishi (ZFS) kichik (D ≈ 0.1−0.5 sm⁻¹).",
  condition: "Xona haroratida va 77 K da kuchli signal kuzatiladi.",
};

export const comparisonData = [
  { param: "Oksidlanish darajasi", cr3: "Cr³⁺ (+3)", cr2: "Cr²⁺ (+2)", cr6: "Cr⁶⁺ (+6)" },
  { param: "Elektron konfiguratsiya", cr3: "d³ (t₂g³)", cr2: "d⁴ (HS, t₂g³ e_g¹)", cr6: "d⁰ (to'liq bo'sh)" },
  { param: "Geometriya", cr3: "Oktaedrik (O_h)", cr2: "Cho'zilgan oktaedr (Yahn-Teller)", cr6: "Tetraedrik (T_d)" },
  { param: "Spin holati", cr3: "S=3/2", cr2: "S=2 (HS)", cr6: "S=0" },
  { param: "Rangi", cr3: "Yashil-binafsha", cr2: "Havorang", cr6: "Sariq (CrO₄²⁻)" },
  { param: "Cr−O (Å)", cr3: "1.966", cr2: "~2.05", cr6: "~1.66" },
  { param: "E₀ (eV)", cr3: "6005", cr2: "6003", cr6: "6010" },
  { param: "CFSE", cr3: "−1.2Δ₀ (katta)", cr2: "−0.6Δ₀", cr6: "0 (d⁰)" },
  { param: "Labillik", cr3: "Inert (juda sekin)", cr2: "Labil", cr6: "Labil" },
];