export const basicInfo = {
  formula: "sis-[PtCl₂(NH₃)₂]",
  iupac: "sis-diammindixloroplatina(II)",
  tarixiy: "SISPLATIN",
  olim: "Barnett Rosenberg — 1965 (kashfiyot), FDA 1978",
  oksidlanishDarajasi: "Pt²⁺",
  elektronKonfig: "d⁸ (kvadrat tekislik)",
  spinHolati: "S = 0",
  magnitXossasi: "Diamagnit",
  geometriya: "Kvadrat tekislik (sis-izomer)",
  rang: "Sariq kristall",
  rangSababi: "d−d o'tishlar + LMCT ~280 nm",
  kashfiyot: "1965 — Rosenberg E. coli bakteriyasi tajribasida tasodifan kashf etgan",
  ahamiyati: "Eng muhim metall asosidagi saraton dori. Moyak saratonida davolash ko'rsatkichini 10% dan 90% ga ko'targan. JSST asosiy dorilar ro'yxatida.",
};

export const exafsParametrlar = {
  S02: { value: 0.82, note: "FEFF8 hisobidan, Pt folga standarti" },
  deltaE0: { value: 2.5, note: "eV — barcha qobiqlar uchun global siljish" },
  rFactor: { value: 0.011, note: "Global R-faktor (barcha qobiqlar birgalikda)" },
  kRange: "2.5−15.0 Å⁻¹",
  rRange: "1.0−5.0 Å",
};

export const qobiqlar = [
  {
    id: 1,
    name: "Pt−Cl",
    N: "2.0",
    R: "2.328 ± 0.008",
    sigma2: "0.0016 ± 0.0003",
    note: "1-qobiq. Sis-izomerda 2 ta Cl⁻ ligandlari yonma-yon. Pt−Cl bog'i trans-ta'sir tufayli labil — gidrolizlanib faollashadi.",
  },
  {
    id: 2,
    name: "Pt−N (NH₃)",
    N: "2.0",
    R: "2.012 ± 0.007",
    sigma2: "0.0015 ± 0.0003",
    note: "2-qobiq. 2 ta NH₃ ligandlari. Pt−N bog'i Pt−Cl ga nisbatan qisqaroq va mustahkamroq — deyarli gidrolizlanmaydi.",
  },
  {
    id: 3,
    name: "Pt−Pt (stacking)",
    N: "~2−4",
    R: "3.40 ± 0.02",
    sigma2: "0.0030 ± 0.0008",
    note: "3-qobiq. Kristall panjarada Pt atomlari orasidagi stacking. Masofa d−d yoki π−π ta'sirlashuvga mos.",
  },
];

export const xanesParametrlar = {
  e0: { value: "11567 eV", note: "Pt L₃-chegara (2p₃/₂ → 5d). Pt⁰ (11564 eV) ga nisbatan +3 eV siljigan" },
  preEdge: {
    energy: "—",
    intensity: "L₃-chegarada pre-edge kuzatilmaydi",
    note: "Pt L₃-chegara 2p → 5d o'tish. Dipol ruxsat etilgan (Δl=1). Oq chiziq intensivligi bevosita 5d bo'sh orbitallar soniga bog'liq.",
  },
  whiteLine: {
    intensity: "Kuchli",
    note: "Pt²⁺ (d⁸) da 5d orbitallar to'liq to'lmagan — oq chiziq intensiv. Pt⁰ (d¹⁰) da oq chiziq minimal.",
  },
};

export const comparisonData = [
  { param: "Oksidlanish darajasi", sis: "Pt²⁺ (+2)", trans: "Pt²⁺ (+2)", karbo: "Pt²⁺ (+2)" },
  { param: "Geometriya", sis: "Kvadrat tekislik (sis)", trans: "Kvadrat tekislik (trans)", karbo: "Kvadrat tekislik" },
  { param: "Ligandlar", sis: "2×Cl⁻ (sis) + 2×NH₃ (sis)", trans: "2×Cl⁻ (trans) + 2×NH₃ (trans)", karbo: "CBDCA²⁻ + 2×NH₃" },
  { param: "Pt−Cl (Å)", sis: "2.328", trans: "2.320", karbo: "—" },
  { param: "Pt−N/O (Å)", sis: "2.012 (N)", trans: "2.005 (N)", karbo: "2.020 (O)" },
  { param: "Suvda eruvchanligi", sis: "Past (~1 mg/mL)", trans: "Juda past", karbo: "Yuqoriroq (~17 mg/mL)" },
  { param: "Antikanser faollik", sis: "YUQORI", trans: "YO'Q (faol emas)", karbo: "Yuqori (kamroq nojo'ya)" },
  { param: "DNK cross-link", sis: "1,2-intrastrend (GpG)", trans: "Hosil bo'lmaydi", karbo: "1,2-intrastrend (sekinroq)" },
  { param: "Nojo'ya ta'sir", sis: "Nefrotoksik, neyrotoksik", trans: "—", karbo: "Miyelosupressiya" },
];

export const aktivatsiya = {
  title: "Prodori → Faol shakl",
  desc: "Sisplatin qonda barqaror (Cl⁻ ~100 mM). Hujayra ichida Cl⁻ past (~4 mM) — gidrolizlanadi: [PtCl₂(NH₃)₂] + 2H₂O → [Pt(NH₃)₂(H₂O)₂]²⁺ + 2Cl⁻. Faol akvakompleks DNK bilan bog'lanadi.",
  target: "DNK — guanin N7 atomi. Asosiy mahsulot: 1,2-intrastrend GpG cross-link (65%). DNK 30-40° egiladi.",
};