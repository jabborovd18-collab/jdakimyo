export const basicInfo = {
  formula: "[Ag(NH₃)₂]⁺",
  iupac: "diamminkumush(I) ioni",
  tarixiy: "Tollens reaktivi",
  oksidlanishDarajasi: "Ag⁺",
  elektronKonfig: "d¹⁰ (to'liq to'lgan)",
  spinHolati: "S = 0",
  magnitXossasi: "Diamagnit",
  geometriya: "Chiziqli (D∞h)",
  rang: "Rangsiz",
  rangSababi: "d¹⁰ — d−d o'tish yo'q. LMCT UB sohada (yuqori energiya).",
  kashfiyot: "Tollens reaktivi sifatida ishlatiladi — Ag⁺ ni NH₃ da eritish orqali olinadi",
  ahamiyati: "d¹⁰ konfiguratsiyali chiziqli komplekslarning klassik namunasi. KS=2 — eng kichik koordinatsion son. sp-gibridlanish. Ag⁺ — yumshoq kislota (HSAB), NH₃ — chegaraviy asos.",
  bondLength: "Ag−N = 2.115 Å (2 ta teng bog')",
};

export const exafsParametrlar = {
  S02: { value: 0.88, note: "FEFF8 hisobidan, Ag folga standarti" },
  deltaE0: { value: 2.5, note: "eV — barcha qobiqlar uchun global siljish" },
  rFactor: { value: 0.011, note: "Global R-faktor" },
  kRange: "2.5−14.0 Å⁻¹",
  rRange: "1.0−5.0 Å",
};

export const qobiqlar = [
  {
    id: 1,
    name: "Ag−N",
    N: "2.0",
    R: "2.115 ± 0.008",
    sigma2: "0.0019 ± 0.0004",
    note: "1-qobiq. 2 ta NH₃ ligandlari — chiziqli geometriya (N−Ag−N = 180°). Bog' uzunligi Ag⁺ ion radiusi (1.15 Å) + N radiusiga mos.",
  },
  {
    id: 2,
    name: "Ag−H (NH₃)",
    N: "6.0",
    R: "2.85 ± 0.02",
    sigma2: "0.0045 ± 0.0010",
    note: "2-qobiq. NH₃ ligandlarining H atomlari. Masofalar tarqoq — signal zaif.",
  },
  {
    id: 3,
    name: "Ag−O/Ag−N (qarshi ion)",
    N: "~4",
    R: "4.0−5.5 (tarqoq)",
    sigma2: "0.0060 ± 0.0020",
    note: "3-qobiq. Nitrat yoki boshqa qarshi ionlar. Masofalar katta va tarqoq.",
  },
];

export const xanesParametrlar = {
  e0: { value: "25517 eV", note: "Ag K-chegara. Ag⁰ (25514 eV) ga nisbatan +3 eV siljigan — Ag⁺ ga mos." },
  preEdge: {
    energy: "—",
    intensity: "K-chegarada pre-edge kuzatilmaydi",
    note: "Ag K-chegara 1s → 5p o'tish. Dipol ruxsat etilgan. Pre-edge yo'q — bu K-chegara uchun xos.",
  },
  whiteLine: {
    intensity: "Minimal",
    note: "Ag⁺ (d¹⁰) — 4d orbitallar to'liq to'lgan. Oq chiziq deyarli yo'q. Bu d¹⁰ konfiguratsiyaning xarakterli belgisi.",
  },
};

export const comparisonData = [
  { param: "Oksidlanish darajasi", ag1: "Ag⁺ (+1)", cu1: "Cu⁺ (+1)", au1: "Au⁺ (+1)" },
  { param: "Elektron konfiguratsiya", ag1: "d¹⁰ (to'liq to'lgan)", cu1: "d¹⁰", au1: "d¹⁰" },
  { param: "Geometriya", ag1: "Chiziqli (KS=2)", cu1: "Chiziqli (KS=2)", au1: "Chiziqli (KS=2)" },
  { param: "Spin holati", ag1: "S=0 (diamagnit)", cu1: "S=0", au1: "S=0" },
  { param: "Rangi", ag1: "Rangsiz", cu1: "Rangsiz", au1: "Rangsiz/sariq" },
  { param: "M−N (Å)", ag1: "2.115", cu1: "~1.90", au1: "~2.05" },
  { param: "E₀ (eV)", ag1: "25517 (K)", cu1: "8982 (K)", au1: "11920 (L₃)" },
  { param: "HSAB", ag1: "Yumshoq kislota", cu1: "Yumshoq kislota", au1: "O'ta yumshoq" },
  { param: "Qo'llanilishi", ag1: "Tollens reaktivi", cu1: "Katalizator", au1: "Dorilar" },
];