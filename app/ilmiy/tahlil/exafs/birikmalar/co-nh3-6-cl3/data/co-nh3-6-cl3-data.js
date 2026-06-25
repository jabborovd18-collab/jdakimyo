export const basicInfo = {
  formula: "[Co(NH₃)₆]Cl₃",
  iupac: "geksaamminkobalt(III) xlorid",
  tarixiy: "Verner klassikasi",
  olim: "Alfred Werner — Nobel 1913",
  oksidlanishDarajasi: "Co³⁺",
  elektronKonfig: "t₂g⁶ (LS, d⁶)",
  spinHolati: "S = 0",
  magnitXossasi: "Diamagnit",
  geometriya: "Oktaedrik",
  rang: "Sariq-to'q sariq",
  rangSababi: "d−d o'tish (¹A₁g → ¹T₁g, ¹T₂g) + LMCT ~330 nm",
  kashfiyot: "1893 — Verner koordinatsion nazariyasi",
  ahamiyati: "Koordinatsion birikmalar kimyosining asoschisi hisoblangan kompleks. Verner Nobel mukofotini aynan shu turdagi komplekslarni o'rgangani uchun olgan (1913).",
};

export const exafsParametrlar = {
  S02: { value: 0.80, note: "FEFF8 hisobidan, Co folga standarti" },
  deltaE0: { value: 1.5, note: "eV — barcha qobiqlar uchun global siljish" },
  rFactor: { value: 0.009, note: "Global R-faktor (barcha qobiqlar birgalikda)" },
  kRange: "2.0−14.0 Å⁻¹",
  rRange: "1.0−5.0 Å",
};

export const qobiqlar = [
  {
    id: 1,
    name: "Co−N",
    N: "6.0",
    R: "1.961 ± 0.007",
    sigma2: "0.0012 ± 0.0002",
    note: "1-qobiq. 6 ta NH₃ ligandlarining N atomlari. Oktaedrik simmetriya. Co³⁺ (LS, d⁶) — diamagnit, Yahn-Teller yo'q.",
  },
  {
    id: 2,
    name: "Co−H (NH₃)",
    N: "18.0",
    R: "2.65 ± 0.015",
    sigma2: "0.0025 ± 0.0005",
    note: "2-qobiq. NH₃ ligandlarining H atomlari. Ko'p sonli (18 ta H) — signal kuchli, lekin masofalar tarqoq.",
  },
  {
    id: 3,
    name: "Co−Cl (qarshi ion)",
    N: "~8",
    R: "4.8−6.2 (tarqoq)",
    sigma2: "0.0050 ± 0.0015",
    note: "3-qobiq. Cl⁻ qarshi ionlari. Kristall panjarada tartibsiz joylashgan — signal zaif va keng.",
  },
];

export const xanesParametrlar = {
  e0: { value: "7727.5 eV", note: "Co K-chegara. Co²⁺ (7725-7726 eV) ga nisbatan +1.5-2.0 eV siljigan" },
  preEdge: {
    energy: "7713.5 eV",
    intensity: "~0.03−0.05 (juda kuchsiz)",
    note: "1s → 3d o'tish. Co³⁺ (LS, t₂g⁶) da bo'sh 3d o'rin yo'q — Pauli taqiqlaydi. Oktaedrik simmetriya — dipol taqiqi.",
  },
  whiteLine: {
    intensity: "O'rtacha",
    note: "1s → 4p o'tish. Co³⁺ da 4p orbitallar o'rtacha energiyada.",
  },
};

export const mossbauer = {
  note: "⁵⁷Co Mössbauer — murakkab, yarim yemirilish davri 271 kun. Amalda kam qo'llaniladi. Asosiy ma'lumot: Co³⁺ (LS, d⁶) — diamagnit, kvadrupol ajralish minimal.",
  alternative: "EPR signali yo'q (diamagnit, S=0).",
};

export const comparisonData = [
  { param: "Oksidlanish darajasi", co3: "Co³⁺ (+3)", co2: "Co²⁺ (+2)" },
  { param: "Elektron konfiguratsiya", co3: "t₂g⁶ (LS, d⁶)", co2: "t₂g⁵ e_g² (HS, d⁷) yoki t₂g⁶ e_g¹ (LS)" },
  { param: "Spin holati", co3: "S = 0 (diamagnit)", co2: "S = 3/2 (HS) yoki S = 1/2 (LS)" },
  { param: "Magnit xossasi", co3: "Diamagnit", co2: "Paramagnit" },
  { param: "Koordinatsion son", co3: "6 (oktaedrik)", co2: "4 (tetraedrik) yoki 6" },
  { param: "Rangi", co3: "Sariq-to'q sariq", co2: "Pushti (oktaedrik), ko'k (tetraedrik)" },
  { param: "E₀ (Co K-chegara)", co3: "7727.5 eV", co2: "7725.5 eV" },
  { param: "Pre-edge", co3: "~0.03−0.05 (kuchsiz)", co2: "~0.08−0.15 (kuchliroq)" },
  { param: "Δ₀", co3: "~23 000 sm⁻¹ (katta)", co2: "~9 000−12 000 sm⁻¹" },
  { param: "Labillik", co3: "Inert (sekin almashinadi)", co2: "Labil (tez almashinadi)" },
];