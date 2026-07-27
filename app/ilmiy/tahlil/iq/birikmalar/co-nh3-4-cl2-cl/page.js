"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₄Cl₂]Cl — IQ SPEKTROSKOPIYA (PREMIUM ILMIY + PDF EKSPORT)
// Manbalar: Nakamoto K. — Infrared and Raman Spectra of Inorg. & Coord. Compounds (6-nashr),
//           Cotton F.A. — Chemical Applications of Group Theory,
//           Werner A. (1893, Nobel 1913), Jorgensen S.M. (1889) — Praseo/Violeo kashfi
// XUSUSIYAT: Sis/trans geometrik izomerlar — IQ ning ENG YAQQOL diagnostikasi
//            Sis (C₂ᵥ) — 2 ta ν(Co-Cl); Trans (D₄ₕ) — 1 ta ν(Co-Cl) [mutual exclusion]
// Til: 100% o'zbek (lotin)
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>4</sub>Cl<sub>2</sub>]Cl",
  formulaPlain: "[Co(NH3)4Cl2]Cl",
  iupac: "Tetraammindiklorokobalt(III) xlorid",
  commonName: "sis: Violeo (binafsha-yashil) / trans: Praseo (yashil)",
  molarMass: 233.40,
  casNumber_cis: "13820-77-4 (sis)",
  casNumber_trans: "14040-33-6 (trans)",
  electrolyteType: "1:1 elektrolit — 2 ion",
  molarConductivity: "~110 S·cm²/mol",
  isomers: {
    cis: {
      name: "sis-[Co(NH₃)₄Cl₂]Cl",
      traditionalName: "Violeo (binafsha-yashil)",
      pointGroup: "C₂ᵥ",
      order: 4,
      operations: "E, C₂, σᵥ, σᵥ'",
      inversionCenter: "YO'Q",
      opticalActivity: "MAVJUD — Δ va Λ enantiomerlari",
      freq_CoCl_as: 330,
      freq_CoCl_s: 310,
      nuCoCl_count: 2,
    },
    trans: {
      name: "trans-[Co(NH₃)₄Cl₂]Cl",
      traditionalName: "Praseo (yashil)",
      pointGroup: "D₄ₕ",
      order: 16,
      operations: "E, 2C₄, C₂, 2C₂', 2C₂'', i, 2S₄, σₕ, 2σᵥ, 2σd",
      inversionCenter: "MAVJUD (i) — mutual exclusion ISHLAYDI",
      opticalActivity: "YO'Q — meso izomer (i markazi)",
      freq_CoCl_as: 355,
      freq_CoCl_s: null,
      nuCoCl_count: 1,
    }
  }
}

// SIS izomer cho'qqilari
const irPeaks_cis = [
  {
    freq: 3305, T: 12, absorbance: 0.88,
    assignment: "νₐₛ(N–H)", assignment_uz: "N–H asimmetrik cho'zilish",
    intensity: "Juda kuchli", intensityCode: 4,
    bond: "N–H", symmetry: "A₁ + B₁ + B₂ (C₂ᵥ)",
    forceConstant: "6.20 mdyn/Å", bondLength: "1.021 Å",
    region: "X–H cho'zilish sohasi",
    freeLigand: "Erkin NH₃: 3444 cm⁻¹",
    coordShift: "−139 cm⁻¹",
    theoryNote: "4 ta NH₃ ligandining N–H asimmetrik cho'zilishi. C₂ᵥ da uchta simmetriya modasi (A₁, B₁, B₂) BARCHASI IQ faol — mutual exclusion YO'Q. Bu Trans izomerdan (D₄ₕ) asosiy farq.",
    diagnostic: "Ammin komplekslar diagnostikasi",
  },
  {
    freq: 3205, T: 27, absorbance: 0.73,
    assignment: "νₛ(N–H)", assignment_uz: "N–H simmetrik cho'zilish",
    intensity: "Kuchli", intensityCode: 3,
    bond: "N–H", symmetry: "A₁ — IQ + Raman ikkalasida faol",
    forceConstant: "6.05 mdyn/Å", bondLength: "1.021 Å",
    region: "X–H cho'zilish sohasi",
    freeLigand: "Erkin NH₃: 3337 cm⁻¹",
    coordShift: "−132 cm⁻¹",
    theoryNote: "Sis izomerda inversiya markazi (i) YO'Q → A₁ modasi IQ va Ramanda BIR VAQTDA faol. Trans izomerda (D₄ₕ) esa A₁g faqat Raman faol — mutual exclusion ishlaydi.",
    diagnostic: "🔬 C₂ᵥ da IQ+Raman komplementarligi yo'q",
  },
  {
    freq: 1622, T: 44, absorbance: 0.56,
    assignment: "δₐₛ(HNH)", assignment_uz: "H–N–H asimmetrik egilish",
    intensity: "O'rta", intensityCode: 2,
    bond: "H–N–H", symmetry: "A₁ + B₁",
    forceConstant: "0.62 mdyn·Å/rad²", bondLength: "—",
    region: "Egilish tebranishlar",
    freeLigand: "Erkin NH₃: 1627 cm⁻¹",
    coordShift: "Deyarli o'zgarmagan",
    theoryNote: "H–N–H burchagining asimmetrik egilishi. Koordinatsiya N atomiga ta'sir qiladi, H–N–H burchak (~107°) o'zgarmaydi.",
    diagnostic: "Barqaror ammin polosasi",
  },
  {
    freq: 1298, T: 56, absorbance: 0.44,
    assignment: "δₛ(NH₃) — umbrella", assignment_uz: "NH₃ simmetrik egilish (soyabon)",
    intensity: "O'rta-kuchli", intensityCode: 3,
    bond: "NH₃ butun", symmetry: "A₁",
    forceConstant: "0.53 mdyn·Å/rad²", bondLength: "—",
    region: "NH₃ deformatsiya",
    freeLigand: "Erkin NH₃: 950 cm⁻¹",
    coordShift: "+348 cm⁻¹ (koordinatsiya diagnostikasi)",
    theoryNote: "Umbrella (soyabon) modasi. Purpureo (1310) va luteo (1325) dan biroz pastroq — 2 ta Cl⁻ ning kuchliroq elektron ta'siri.",
    diagnostic: "🔥 Koordinatsiyaning diagnostik ko'rsatkichi",
  },
  {
    freq: 838, T: 51, absorbance: 0.49,
    assignment: "ρᵣ(NH₃)", assignment_uz: "NH₃ rocking",
    intensity: "O'rta-kuchli", intensityCode: 3,
    bond: "NH₃ butun", symmetry: "B₁ + B₂ (C₂ᵥ)",
    forceConstant: "0.41 mdyn·Å/rad²", bondLength: "—",
    region: "Ligand rocking",
    freeLigand: "Erkin NH₃ da mavjud emas",
    coordShift: "Faqat kompleksda",
    theoryNote: "NH₃ ning Co atomi atrofida chayqalish tebranishi. Sis izomerda 4 ta NH₃ ekvivalent emas — polosa bir oz kengroq.",
    diagnostic: "Koordinatsiyaning bevosita isboti",
  },
  {
    freq: 500, T: 33, absorbance: 0.67,
    assignment: "νₐₛ(Co–N)", assignment_uz: "Co–N asimmetrik cho'zilish",
    intensity: "Kuchli", intensityCode: 3,
    bond: "Co–N (4 ta)", symmetry: "A₁ + B₁ + B₂",
    forceConstant: "1.84 mdyn/Å", bondLength: "1.965 Å (o'rt.)",
    region: "Metall–ligand cho'zilish",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote: "4 ta Co–N bog'ining cho'zilishi. Sis izomerda 2 xil Co–N mavjud: (a) trans-Cl bog'iga qarama-qarshi 2 ta (1.933 Å) va (b) cis-Cl ga qarama-qarshi 2 ta (1.965 Å). Bu farq polosani biroz kengaytiradi.",
    diagnostic: "🔬 Sis-izomerdа Co-N heterogenligi",
  },
  {
    freq: 475, T: 45, absorbance: 0.55,
    assignment: "νₛ(Co–N)", assignment_uz: "Co–N simmetrik cho'zilish",
    intensity: "O'rta-kuchli", intensityCode: 3,
    bond: "Co–N", symmetry: "A₁",
    forceConstant: "1.72 mdyn/Å", bondLength: "1.933 Å (trans-Cl)",
    region: "Metall–ligand cho'zilish",
    freeLigand: "—",
    coordShift: "Trans-Cl ta'siri",
    theoryNote: "Cl⁻ ga trans joylashgan NH₃ larning Co–N bog'i. Purpureoda ham kuzatilgan trans-effekt paradoksi: bog' uzunroq lekin ν pastroq.",
    diagnostic: "Cis konfiguratsiya belgisi",
  },
  {
    freq: 330, T: 38, absorbance: 0.63,
    assignment: "νₐₛ(Co–Cl) [SIS]", assignment_uz: "Co–Cl asimmetrik cho'zilish",
    intensity: "Kuchli", intensityCode: 3,
    bond: "Co–Cl (2 ta cis)", symmetry: "B₁ (C₂ᵥ) — IQ faol",
    forceConstant: "1.44 mdyn/Å", bondLength: "2.258 Å",
    region: "Metall–halid (far-IR)",
    freeLigand: "—",
    coordShift: "Sis izomer diagnostikasi",
    theoryNote: "🏆 SIS/TRANS DIAGNOSTIKASINING KALITI! Sis izomerda 2 ta Cl⁻ 90° burchakda joylashgan → simmetrik va asimmetrik cho'zilishlarga ega. B₁ (asimmetrik) IQ faol, ~330 cm⁻¹.",
    diagnostic: "🏆 CIS izomer isboti — 2 ta ν(Co-Cl) polosasidan biri",
  },
  {
    freq: 310, T: 44, absorbance: 0.56,
    assignment: "νₛ(Co–Cl) [SIS]", assignment_uz: "Co–Cl simmetrik cho'zilish",
    intensity: "Kuchli", intensityCode: 3,
    bond: "Co–Cl (2 ta cis)", symmetry: "A₁ (C₂ᵥ) — IQ + Raman",
    forceConstant: "1.38 mdyn/Å", bondLength: "2.258 Å",
    region: "Metall–halid (far-IR)",
    freeLigand: "—",
    coordShift: "Sis izomer diagnostikasi",
    theoryNote: "🏆 SIS/TRANS DIAGNOSTIKASI! Sis izomerning IKKINCHI ν(Co-Cl) polosasi. C₂ᵥ da A₁ IQ + Raman ikkala faol. Trans izomerda esa bu polosa faqat Raman (mutual exclusion) — IQ da YO'Q.",
    diagnostic: "🏆 CIS izomerni TRANS dan farqlash uchun asosiy",
  },
  {
    freq: 268, T: 66, absorbance: 0.34,
    assignment: "δ(Cl–Co–N)", assignment_uz: "Cl–Co–N burchak egilishi",
    intensity: "O'rta-zaif", intensityCode: 2,
    bond: "Cl–Co–N", symmetry: "A₁ + B₁ + B₂",
    forceConstant: "0.30 mdyn·Å/rad²", bondLength: "—",
    region: "Skelet egilish",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote: "Cl va NH₃ orasidagi burchakning egilish tebranishi. Sis Cl-Co-Cl ~89°, ideal 90° dan biroz og'ish.",
    diagnostic: "C₂ᵥ skelet deformatsiyasi",
  },
]

// TRANS izomer cho'qqilari (taqqoslash uchun)
const irPeaks_trans = [
  { freq: 3295, T: 14, absorbance: 0.86, assignment: "νₐₛ(N–H)", assignment_uz: "N–H asimmetrik", intensity: "Juda kuchli", intensityCode: 4, symmetry: "Eᵤ (D₄ₕ)", forceConstant: "6.18 mdyn/Å",
    theoryNote: "D₄ₕ da 2 karra taqsimlangan Eᵤ modasi IQ faol. E_g (Raman) esa IQ da ko'rinmaydi.", diagnostic: "D₄ₕ trans izomer" },
  { freq: 3200, T: null, absorbance: null, assignment: "νₛ(N–H)", assignment_uz: "N–H simmetrik (IQ da YO'Q)", intensity: "IQ da yo'q!", intensityCode: 0, symmetry: "A₁g — FAQAT Raman", forceConstant: "6.05 mdyn/Å",
    theoryNote: "⚠️ D₄ₕ da A₁g gerade → mutual exclusion ishlaydi → IQ da KO'RINMAYDI! Faqat Raman spektrida.", diagnostic: "🔬 Mutual exclusion isboti" },
  { freq: 1618, T: 46, absorbance: 0.54, assignment: "δ(HNH)", assignment_uz: "H-N-H egilish", intensity: "O'rta", intensityCode: 2, symmetry: "Eᵤ", forceConstant: "0.62",
    theoryNote: "Egilish tebranishi. Trans izomerda simmetriya yuqori.", diagnostic: "Ammin polosasi" },
  { freq: 1305, T: 55, absorbance: 0.45, assignment: "δₛ(NH₃)", assignment_uz: "NH₃ umbrella", intensity: "O'rta-kuchli", intensityCode: 3, symmetry: "A₂ᵤ (IQ)", forceConstant: "0.55",
    theoryNote: "Umbrella modasi. A₂ᵤ IQ faol.", diagnostic: "Koordinatsiya isboti" },
  { freq: 490, T: 36, absorbance: 0.64, assignment: "ν(Co–N)", assignment_uz: "Co-N cho'zilish", intensity: "Kuchli", intensityCode: 3, symmetry: "Eᵤ (D₄ₕ)", forceConstant: "1.80",
    theoryNote: "D₄ₕ da 4 ta ekvator Co–N EKVIVALENT. Faqat 1 ta Eᵤ IQ polosasi (sis dan farqli).", diagnostic: "🔬 Ekvator NH₃ ekvivalentligi" },
  { freq: 355, T: 40, absorbance: 0.60, assignment: "νₐₛ(Co–Cl)", assignment_uz: "Co-Cl asimmetrik", intensity: "Kuchli", intensityCode: 3, symmetry: "A₂ᵤ (IQ)", forceConstant: "1.52",
    theoryNote: "🏆 TRANS DIAGNOSTIKASI! Trans izomerda FAQAT 1 ta ν(Co-Cl) polosasi. Sis dan (330, 310 — 2 ta) osongina farqlanadi.", diagnostic: "🏆 TRANS izomer bevosita isboti" },
  { freq: 322, T: null, absorbance: null, assignment: "νₛ(Co–Cl)", assignment_uz: "Co-Cl simmetrik (IQ da YO'Q)", intensity: "IQ da yo'q!", intensityCode: 0, symmetry: "A₁g — FAQAT Raman", forceConstant: "1.50",
    theoryNote: "⚠️ D₄ₕ mutual exclusion: ν(Co-Cl) simmetrik cho'zilishi A₁g gerade → IQ da KO'RINMAYDI. Faqat Ramanda ~322 cm⁻¹.", diagnostic: "🔬 Mutual exclusion tasdig'i" },
]

// Werner koordinatsion qatori
const wernerSeries = [
  { formula: "[Co(NH₃)₆]Cl₃", trad: "Luteo (sariq)", nuCoN: "503, 448", nuCoCl: "—", agCl: 3, inner: 0, sym: "Oₕ", current: false },
  { formula: "[Co(NH₃)₅Cl]Cl₂", trad: "Purpureo (bin.)", nuCoN: "498, 475", nuCoCl: "328", agCl: 2, inner: 1, sym: "C₄ᵥ", current: false },
  { formula: "sis-[Co(NH₃)₄Cl₂]Cl", trad: "Violeo (bin-yashil)", nuCoN: "500, 475", nuCoCl: "330, 310", agCl: 1, inner: 2, sym: "C₂ᵥ", current: true, isomer: "cis" },
  { formula: "trans-[Co(NH₃)₄Cl₂]Cl", trad: "Praseo (yashil)", nuCoN: "490", nuCoCl: "355", agCl: 1, inner: 2, sym: "D₄ₕ", current: true, isomer: "trans" },
]

// Namuna tayyorlash usullari
const techniques = [
  {
    name: "CsI tabletka (uzoq IQ)",
    description: "200 cm⁻¹ gacha shaffof. ν(Co–Cl) 330/310 (sis) va 355 (trans) uchun MAJBURIY.",
    advantages: ["200 cm⁻¹ gacha shaffof", "🏆 Sis/trans ajratish uchun asosiy", "Ikkala izomerni bir vaqtda tahlil", "Kvantitativ tahlil"],
    disadvantages: ["Qimmat (5× KBr)", "Yanada gigroskopik", "Ehtiyot bilan tayyorlash", "Kam laboratoriyalarda"],
    bestFor: "🔑 Sis/trans DIAGNOSTIKASI",
    freqRange: "4000–200 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "10–15 daq"
  },
  {
    name: "KBr tabletka (standart)",
    description: "Klassik usul — 400 cm⁻¹ gacha shaffof. Sis/trans farqlash uchun ETARLI EMAS.",
    advantages: ["An'anaviy standart", "N-H va NH₃ deformatsiyalari aniq", "Aniqlik 2-4 cm⁻¹", "Kvantitativ"],
    disadvantages: ["🚫 400 cm⁻¹ dan pastda YO'Q", "🚫 ν(Co-Cl) 330/310/355 KO'RIB BO'LMAYDI", "KBr gigroskopik", "Cl⁻/Br⁻ almashinuv"],
    bestFor: "Faqat X-H va deformatsiya sohalari",
    freqRange: "4000–400 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "10–15 daq"
  },
  {
    name: "Nujol mull",
    description: "Namuna Nujol bilan aralashtiriladi. KBr bilan almashinuv YO'Q.",
    advantages: ["Cl⁻ almashinuvi yo'q", "Nam namunalar uchun", "Rangi ko'rinadi (sis vs trans)", "Namuna buzilmaydi"],
    disadvantages: ["Nujol: 2920, 2850, 1460, 1375", "C–H sohasi bekilgan", "CsI deraza kerak", "Kvantitativ chekli"],
    bestFor: "Rangli namunalar taqqoslashi",
    freqRange: "4000–200 cm⁻¹ (CsI deraza)", resolution: "4 cm⁻¹", samplePrep: "5–10 daq"
  },
  {
    name: "ATR",
    description: "Tez skrining. 650 cm⁻¹ dan pastda intensivlik pasayadi — SIS/TRANS UCHUN YARAMAYDI.",
    advantages: ["Tez (30 s)", "Namuna butun", "Zamonaviy", "Kristall shakli ko'rinadi"],
    disadvantages: ["🚫 650 cm⁻¹ dan pastda kuchli pasayish", "🚫 ν(Co-Cl) 330 KO'RIB BO'LMAYDI", "Faqat sirt", "Cho'qqi siljigan"],
    bestFor: "Faqat yuqori chastotalar",
    freqRange: "4000–650 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "30 s"
  },
]

// Halaqit beruvchi omillar
const interferences = [
  { source: "Sis/trans aralashmasi", freqRange: "300-360", effect: "Har ikki izomer bir vaqtda: 4 ta ν(Co-Cl) polosasi (330, 310, 325, 355) — chalkash spektr", severity: "Yuqori", solution: "Aniq izomer olish uchun: sis — CoCl₃·6H₂O + NH₃ (yigit HCl) sovuqda; trans — issiq. Rekristallizatsiya." },
  { source: "Sis ↔ trans izomerlanishi", freqRange: "Spektr o'zgaradi", effect: "Suvda yoki DMSO da sis→trans (kunlar davomida)", severity: "O'rta", solution: "Yangi namunani tez ishlatish. Qattiq holatda saqlash." },
  { source: "KBr bilan Cl almashinuvi", freqRange: "ν(Co-Br) ~260", effect: "KBr bosishda qisman Cl⁻/Br⁻ almashinuvi", severity: "O'rta", solution: "🔑 CsI ishlatish yoki Nujol mull." },
  { source: "Suv bug'i (H₂O)", freqRange: "3800-3500, 1640", effect: "Keng suv polosalari N-H sohasiga", severity: "Yuqori", solution: "N₂ purge. Namunani P₂O₅ ustida quritish. CsI 110°C da 2 soat." },
  { source: "CO₂ (atmosfera)", freqRange: "2350, 667", effect: "N-H yaqin sohaga aralashadi", severity: "O'rta", solution: "N₂ purge, CO₂ scrubber." },
  { source: "Akvatsiya (hidroliz)", freqRange: "Butun spektr", effect: "Suvda [Co(NH₃)₄(H₂O)Cl]²⁺ hosil bo'ladi", severity: "Yuqori", solution: "Faqat quritilgan namuna! HCl da rekristallizatsiya." },
  { source: "Kristall panjara (site)", freqRange: "M-L soha", effect: "Sis P2₁/c va trans P4/mmm panjaralar C₂ᵥ/D₄ₕ dan pasaytirishi", severity: "Past", solution: "Suyultirilgan namuna (CsI 1:2000)." },
  { source: "Yorug'lik (fotoliz)", freqRange: "Butun spektr", effect: "UV nur → Co(III) reduktsiya, sis→trans", severity: "O'rta", solution: "Qorong'i shishada saqlash." },
]

// Kuch konstantasi taqqoslash
const forceConstantExamples = [
  { bond: "N–H (koordinatsion)", k: 6.20, freq: 3305, note: "Yengil H → yuqori ν" },
  { bond: "Co–N (sis, o'rt.)", k: 1.84, freq: 500, note: "4 ta ekvivalent emas" },
  { bond: "Co–N (sis, trans-Cl)", k: 1.72, freq: 475, note: "Trans-Cl effekti" },
  { bond: "Co–N (trans, ekvator)", k: 1.80, freq: 490, note: "4 ta ekvivalent (D₄ₕ)" },
  { bond: "Co–Cl (sis, νₐₛ)", k: 1.44, freq: 330, note: "🏆 Sis diagnostikasi" },
  { bond: "Co–Cl (sis, νₛ)", k: 1.38, freq: 310, note: "🏆 Sis diagnostikasi" },
  { bond: "Co–Cl (trans, A₂ᵤ)", k: 1.52, freq: 355, note: "🏆 Trans (1 ta, IQ)" },
  { bond: "Co–Cl (purpureo)", k: 1.42, freq: 328, note: "1 ta ichki Cl" },
  { bond: "Pt–Cl (sisplatin)", k: 1.9, freq: 320, note: "Kvadrat tekislik, 2 ta" },
]

// Sis/trans farqlash usullari
const cisTransDiagnostics = [
  { method: "IQ ν(Co-Cl) polosalari soni", cisResult: "2 ta (330, 310 cm⁻¹)", transResult: "1 ta (355 cm⁻¹)", reliability: "🏆 Juda ishonchli", note: "Eng oson va tezkor" },
  { method: "Raman ν(Co-Cl)", cisResult: "IQ + Raman komplementar (bir xil chastotalar)", transResult: "1 ta Raman (322), IQ dan farqli", reliability: "🏆 Juda ishonchli", note: "IQ+Raman eng aniq" },
  { method: "Mutual exclusion", cisResult: "Modalar IQ va Raman ikkalasida", transResult: "gerade → Raman, ungerade → IQ", reliability: "🏆 Juda ishonchli", note: "D₄ₕ invariant xususiyati" },
  { method: "UV-Vis λmax", cisResult: "~535 nm (kengroq band)", transResult: "~625 nm (ikki tomonli)", reliability: "🎯 Ishonchli", note: "Rangi ham farqli" },
  { method: "Optik faollik (CD/ORD)", cisResult: "🏆 MAVJUD (Δ va Λ)", transResult: "YO'Q (i markazi)", reliability: "🏆 Aniq", note: "Sis ni ajratish uchun" },
  { method: "Konduktometriya", cisResult: "~110 S·cm²/mol", transResult: "~110 S·cm²/mol", reliability: "❌ Farq yo'q", note: "Bir xil ionlar soni" },
  { method: "Kristallografiya", cisResult: "P2₁/c monoklinik", transResult: "P4/mmm tetragonal", reliability: "🏆 Yakuniy tasdiq", note: "Bog' burchak va uzunlik aniq" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CoNH34Cl2_Cl_IQ() {
  const [showHeader, setShowHeader] = useState(true)
  const [activeIsomer, setActiveIsomer] = useState("cis")
  const [freqSlider, setFreqSlider] = useState(3305)
  const [activePeak, setActivePeak] = useState(0)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)

  const [pdfSections, setPdfSections] = useState({
    identification: true,
    theory: true,
    isomers: true,
    peaks: true,
    spectrum: true,
    groupTheory: true,
    diagnostics: true,
    forceConstant: true,
    werner: true,
    techniques: true,
    interferences: true,
    conclusions: true,
  })

  const currentPeaks = activeIsomer === "cis" ? irPeaks_cis : irPeaks_trans

  const currentPeak = useMemo(() => {
    let closest = currentPeaks[0]
    let minDiff = Math.abs(freqSlider - (currentPeaks[0].freq || 0))
    for (let i = 1; i < currentPeaks.length; i++) {
      if (!currentPeaks[i].freq) continue
      const diff = Math.abs(freqSlider - currentPeaks[i].freq)
      if (diff < minDiff) { minDiff = diff; closest = currentPeaks[i] }
    }
    return closest
  }, [freqSlider, activeIsomer, currentPeaks])

  const cleanText = (str) => {
    if (str === null || str === undefined) return ""
    return String(str)
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/\s+/g, " ").trim()
  }

  const generatePDF = async () => {
    setPdfGenerating(true)
    try {
      const { PDFDocument, rgb } = await import("pdf-lib")
      const fontkit = (await import("@pdf-lib/fontkit")).default

      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)

      let regularFont, boldFont, italicFont
      try {
        const regularBytes = await fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer() })
        const boldBytes = await fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer() })
        const italicBytes = await fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer() })
        regularFont = await pdfDoc.embedFont(regularBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(boldBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(italicBytes, { subset: true })
      } catch {
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari bo'lishi kerak.")
        setPdfGenerating(false)
        return
      }

      const C = {
        purple: rgb(0.30, 0.11, 0.58), purpleLight: rgb(0.86, 0.78, 1.0),
        purpleMid: rgb(0.65, 0.55, 0.98), purpleSoft: rgb(0.51, 0.39, 0.71),
        purpleDark: rgb(0.12, 0.11, 0.29),
        emerald: rgb(0.15, 0.55, 0.35),
        emeraldDeep: rgb(0.08, 0.42, 0.25),
        violet: rgb(0.45, 0.20, 0.55),
        violetDeep: rgb(0.32, 0.10, 0.42),
        textDark: rgb(0.08, 0.08, 0.16), textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0), orangeDeep: rgb(0.71, 0.39, 0),
        green: rgb(0.08, 0.47, 0.31), greenDark: rgb(0.12, 0.47, 0.27),
        blue: rgb(0.08, 0.31, 0.55), grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgEmerald: rgb(0.93, 1.0, 0.96),
        bgViolet: rgb(0.98, 0.94, 1.0), bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0), bgGreen: rgb(0.94, 1.0, 0.98),
        bgRed: rgb(1.0, 0.95, 0.95), bgYellow: rgb(1.0, 0.98, 0.92),
        bgAbstract: rgb(0.96, 0.94, 1.0),
        white: rgb(1, 1, 1), red: rgb(0.80, 0.20, 0.20),
      }

      const PAGE_W = 595.28, PAGE_H = 841.89
      const MARGIN = 50, CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30, HEADER_H = 65

      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNum = 1

      const measure = (t, f, s) => f.widthOfTextAtSize(String(t), s)
      const truncate = (text, font, size, maxWidth) => {
        const s = String(text)
        if (measure(s, font, size) <= maxWidth) return s
        let lo = 0, hi = s.length
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          if (measure(s.slice(0, mid) + "…", font, size) <= maxWidth) lo = mid
          else hi = mid - 1
        }
        return s.slice(0, lo) + "…"
      }
      const wrapText = (text, font, size, maxWidth) => {
        if (!text) return [""]
        const words = String(text).split(/\s+/)
        const lines = []; let current = ""
        for (const word of words) {
          const test = current ? current + " " + word : word
          if (measure(test, font, size) > maxWidth && current) { lines.push(current); current = word }
          else current = test
          if (measure(current, font, size) > maxWidth) {
            let piece = ""
            for (const ch of current) {
              if (measure(piece + ch, font, size) > maxWidth) { lines.push(piece); piece = ch } else piece += ch
            }
            current = piece
          }
        }
        if (current) lines.push(current)
        return lines
      }
      const safeText = (text, opts) => {
        const { x, y: ty, size = 10, font = regularFont, color = C.textDark, align = "left", maxWidth = null } = opts
        const s = cleanText(text)
        const limit = maxWidth ?? (PAGE_W - MARGIN - x)
        const finalText = truncate(s, font, size, limit)
        let fx = x; const w = measure(finalText, font, size)
        if (align === "center") fx = x - w / 2
        else if (align === "right") fx = x - w
        page.drawText(finalText, { x: fx, y: ty, size, font, color })
      }
      const drawCenteredText = (text, cy, size, font, color, maxW = CONTENT_W) => {
        const lines = wrapText(cleanText(text), font, size, maxW)
        lines.forEach((line, i) => {
          const w = measure(line, font, size)
          page.drawText(line, { x: (PAGE_W - w) / 2, y: cy - i * (size + 3), size, font, color })
        })
        return lines.length * (size + 3)
      }
      const drawWrappedText = (text, opts) => {
        const { x, y: sy, size = 9.5, font = regularFont, color = C.textDark, maxWidth, lineHeight = null } = opts
        const lines = wrapText(cleanText(text), font, size, maxWidth)
        const lh = lineHeight ?? size + 3
        lines.forEach((line, i) => page.drawText(line, { x, y: sy - i * lh, size, font, color }))
        return lines.length * lh
      }
      const addFooter = () => {
        const leftText = truncate(
          `JDA-Kimyo IQ Tahlili  •  [Co(NH₃)₄Cl₂]Cl (Violeo/Praseo)  •  ${new Date().toLocaleDateString("uz-UZ")}`,
          regularFont, 8, CONTENT_W - 30
        )
        page.drawText(leftText, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        const pageStr = `${pageNum}`
        const w = measure(pageStr, regularFont, 8)
        page.drawText(pageStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 }, end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine,
        })
      }
      const addNewPage = () => { addFooter(); page = pdfDoc.addPage([PAGE_W, PAGE_H]); pageNum++; y = PAGE_H - MARGIN }
      const checkPageBreak = (need) => { if (y - need < FOOTER_Y + 25) addNewPage() }

      const drawSectionHeader = (num, title) => {
        checkPageBreak(45)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.emerald })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13, font: boldFont, color: C.emeraldDeep, maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
        })
        y -= 14
      }
      const drawTableRow = (label, value, bgColor = C.bgEmerald, labelColor = C.emeraldDeep) => {
        const rowH = 20, labelW = 200
        const valueX = MARGIN + labelW + 6, valueMaxW = CONTENT_W - labelW - 12
        checkPageBreak(rowH + 2)
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor })
        safeText(label, { x: MARGIN + 6, y: y - 13, size: 9, font: boldFont, color: labelColor, maxWidth: labelW - 8 })
        const valStr = cleanText(value)
        const finalVal = truncate(valStr, regularFont, 9, valueMaxW)
        page.drawText(finalVal, { x: valueX, y: y - 13, size: 9, font: regularFont, color: C.textDark })
        y -= rowH
      }
      const drawInfoBox = (text, bgColor, borderColor, textColor) => {
        const padding = 10, maxW = CONTENT_W - 2 * padding
        const lines = wrapText(cleanText(text), regularFont, 9, maxW)
        const boxH = lines.length * 12 + 2 * padding
        checkPageBreak(boxH + 8)
        page.drawRectangle({
          x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
          color: bgColor, borderColor: borderColor, borderWidth: 0.8,
        })
        lines.forEach((line, i) => {
          page.drawText(line, {
            x: MARGIN + padding, y: y - padding - 10 - i * 12,
            size: 9, font: regularFont, color: textColor,
          })
        })
        y -= boxH + 10
      }

      // HEADER
      page.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.purpleDark })
      safeText("JDA-KIMYO ILMIY BYULLETENI  •  IQ Spektroskopiya  •  Vol. 2, Son 4", {
        x: MARGIN, y: PAGE_H - 25, size: 9, font: regularFont, color: C.purpleLight, maxWidth: CONTENT_W * 0.65,
      })
      safeText(`Chop etilgan: ${new Date().toLocaleDateString("uz-UZ")}`, {
        x: PAGE_W - MARGIN, y: PAGE_H - 25, size: 9,
        font: regularFont, color: C.purpleLight, align: "right", maxWidth: CONTENT_W * 0.3,
      })
      page.drawLine({
        start: { x: MARGIN, y: PAGE_H - 37 }, end: { x: PAGE_W - MARGIN, y: PAGE_H - 37 },
        thickness: 1, color: C.purpleMid,
      })
      safeText("Sis/Trans Geometrik Izomerlar — IQ Diagnostikasining Klassik Namunasi", {
        x: MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86), maxWidth: CONTENT_W * 0.65,
      })
      safeText("DOI: 10.0000/jda-kimyo.iq.2026.003", {
        x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8,
        font: regularFont, color: rgb(0.71, 0.71, 0.86), align: "right", maxWidth: CONTENT_W * 0.3,
      })
      y = PAGE_H - HEADER_H - 30

      drawCenteredText(`[Co(NH₃)₄Cl₂]Cl — IQ Spektroskopik Tahlili`, y, 20, boldFont, C.textDark)
      y -= 28
      drawCenteredText("Tetraammindiklorokobalt(III) xlorid  •  sis: Violeo / trans: Praseo", y, 12, italicFont, C.emeraldDeep)
      y -= 20
      drawCenteredText(
        `Sis: C₂ᵥ (2 ν(Co-Cl))  •  Trans: D₄ₕ (1 ν(Co-Cl))  •  M = 233.40 g/mol  •  d⁶ past spin`,
        y, 9, regularFont, C.textMuted
      )
      y -= 28

      // ANNOTATSIYA
      const abstract =
        `Tetraammindiklorokobalt(III) xlorid [Co(NH₃)₄Cl₂]Cl geometrik izomerlarning klassik namunasidir. ` +
        `Ikki xil izomer mavjud: sis-izomer (Violeo, binafsha-yashil, C₂ᵥ simmetriya) va trans-izomer ` +
        `(Praseo, yashil, D₄ₕ simmetriya). IQ spektroskopiya bu izomerlarni farqlashning eng oson usulidir: ` +
        `sis izomerda ν(Co–Cl) sohasida 2 ta polosa (330 va 310 cm⁻¹) ko'rinadi, chunki 2 ta Cl⁻ 90° burchakda ` +
        `joylashgan va C₂ᵥ da simmetrik hamda asimmetrik cho'zilishlar ikkalasi ham IQ faol. Trans izomerda esa ` +
        `faqat 1 ta polosa (355 cm⁻¹) ko'rinadi, chunki D₄ₕ simmetriya (inversiya markazi mavjud) tufayli mutual ` +
        `exclusion qoidasi ishlaydi — simmetrik cho'zilish A₁g gerade IQ da ko'rinmaydi (faqat Ramanda 322 cm⁻¹). ` +
        `Bundan tashqari sis izomer optik faol (Δ/Λ enantiomerlari), trans esa optik faol emas (i markaz). ` +
        `Ikkala izomer 1:1 elektrolit. Bu birikma Werner koordinatsion nazariyasining uchinchi bosqichini isbotlaydi.`

      const absPadding = 12, absInnerW = CONTENT_W - 2 * absPadding
      const absLines = wrapText(cleanText(abstract), regularFont, 9.5, absInnerW)
      const boxH = 24 + absLines.length * 13 + 8
      checkPageBreak(boxH + 20)
      page.drawRectangle({
        x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
        color: C.bgAbstract, borderColor: C.purpleMid, borderWidth: 1,
      })
      safeText("QISQACHA XULOSA (ANNOTATSIYA)", {
        x: MARGIN + absPadding, y: y - 16, size: 10, font: boldFont, color: C.emeraldDeep, maxWidth: absInnerW,
      })
      absLines.forEach((line, i) => {
        page.drawText(line, {
          x: MARGIN + absPadding, y: y - 32 - i * 13,
          size: 9.5, font: regularFont, color: C.textDark,
        })
      })
      y -= boxH + 22

      let sectionNum = 1

      // 1. IDENTIFIKATSIYA
      if (pdfSections.identification) {
        drawSectionHeader(sectionNum++, "Birikma Identifikatsiyasi")
        const idData = [
          ["Formula", "[Co(NH₃)₄Cl₂]Cl"],
          ["IUPAC nomi", "Tetraammindiklorokobalt(III) xlorid"],
          ["An'anaviy nom (sis)", "Violeo-kobalt (binafsha-yashil)"],
          ["An'anaviy nom (trans)", "Praseo-kobalt (yashil)"],
          ["CAS (sis)", "13820-77-4"],
          ["CAS (trans)", "14040-33-6"],
          ["Molar massa", "233.40 g/mol"],
          ["Elektrolit turi", "1:1 (2 ion — 1 tashqi Cl⁻)"],
          ["Nuqtaviy guruh (sis)", "C₂ᵥ (4-tartib)"],
          ["Nuqtaviy guruh (trans)", "D₄ₕ (16-tartib)"],
          ["Optik faollik (sis)", "MAVJUD — Δ va Λ enantiomerlar"],
          ["Optik faollik (trans)", "YO'Q — i markaz (meso)"],
          ["ν(Co–Cl) polosalari (sis)", "🏆 2 ta: 330, 310 cm⁻¹"],
          ["ν(Co–Cl) polosalari (trans)", "🏆 1 ta: 355 cm⁻¹ (IQ) + Raman 322"],
          ["Metall ioni", "Co³⁺ (d⁶ past spin)"],
        ]
        idData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgEmerald : C.white, C.emeraldDeep)
        })
        y -= 15
      }

      // 2. NAZARIY ASOS
      if (pdfSections.theory) {
        drawSectionHeader(sectionNum++, "Nazariy Asos: Geometrik Izomeriya va IQ Diagnostikasi")

        const t1 = "[Co(NH₃)₄Cl₂]⁺ ionida 2 ta bir xil ligand (Cl⁻) va 4 ta bir xil ligand (NH₃) mavjud. Oktaedrik kompleksda 2 ta Cl⁻ ikki xil geometrik joylashuvda bo'lishi mumkin: (a) sis — 90° burchakda, qo'shni pozitsiyalarda; (b) trans — 180° burchakda, qarama-qarshi pozitsiyalarda. Bu ikki izomer bir xil kimyoviy formulaga ega, ammo simmetriyasi va xossalari tubdan farqlanadi."
        drawWrappedText(t1, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(t1, regularFont, 9.5, CONTENT_W).length * 13 + 8

        drawInfoBox(
          "SIS izomer (C₂ᵥ, 4-tartib): 2 ta Cl⁻ qo'shni (90°). Inversiya markazi YO'Q. Ikki Cl⁻ atomining simmetrik va asimmetrik cho'zilishlari IKKALASI ham IQ faol → 2 ta ν(Co-Cl) polosasi (330 va 310 cm⁻¹).",
          C.bgViolet, C.violet, C.textDark
        )
        drawInfoBox(
          "TRANS izomer (D₄ₕ, 16-tartib): 2 ta Cl⁻ qarama-qarshi (180°). Inversiya markazi MAVJUD. Mutual exclusion qoidasi ishlaydi: simmetrik ν(Co-Cl) A₁g gerade — faqat Ramanda faol, IQ da KO'RINMAYDI. Faqat asimmetrik A₂ᵤ ungerade IQ faol → 1 ta ν(Co-Cl) polosasi (355 cm⁻¹).",
          C.bgEmerald, C.emerald, C.textDark
        )
        drawInfoBox(
          "Bu ikki spektrni yonma-yon qo'yib, ν(Co-Cl) polosalari sonini sanash — geometrik izomerlarni farqlashning ENG ISHONCHLI va ENG OSON usulidir. Boshqa usullar (UV-Vis rangi, CD spektri, XRD) tasdiqlash uchun ishlatiladi.",
          C.bgYellow, C.orange, C.textDark
        )

        const t2 = "Hooke qonuni ν̃ = (1/2πc)·√(k/μ). Sis va trans izomerlar uchun k(Co-Cl) bir xil emas: sis da ~1.44 (asimmetrik) va 1.38 (simmetrik) mdyn/Å, trans da 1.52 mdyn/Å. Trans izomerda bog' qisqaroq va mustahkamroq — chunki 2 ta Cl⁻ bir-birining trans-effektini mustahkamlaydi."
        drawWrappedText(t2, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(t2, regularFont, 9.5, CONTENT_W).length * 13 + 10
      }

      // 3. IZOMERLAR TAQQOSLASH
      if (pdfSections.isomers) {
        drawSectionHeader(sectionNum++, "Sis va Trans Izomerlar — To'liq Taqqoslash")

        // Sis
        page.drawRectangle({ x: MARGIN, y: y - 22, width: CONTENT_W / 2 - 5, height: 22, color: C.violet })
        safeText("SIS-[Co(NH₃)₄Cl₂]Cl (Violeo)", {
          x: MARGIN + 6, y: y - 15, size: 10, font: boldFont, color: C.white, maxWidth: CONTENT_W / 2 - 15,
        })
        // Trans
        page.drawRectangle({ x: MARGIN + CONTENT_W / 2 + 5, y: y - 22, width: CONTENT_W / 2 - 5, height: 22, color: C.emerald })
        safeText("TRANS-[Co(NH₃)₄Cl₂]Cl (Praseo)", {
          x: MARGIN + CONTENT_W / 2 + 11, y: y - 15, size: 10, font: boldFont, color: C.white, maxWidth: CONTENT_W / 2 - 15,
        })
        y -= 24

        const isomerComparison = [
          ["An'anaviy nom", "Violeo (binafsha-yashil)", "Praseo (yashil)"],
          ["Rangi", "To'q binafsha-yashil", "Yorqin yashil"],
          ["Simmetriya", "C₂ᵥ (4-tartib)", "D₄ₕ (16-tartib)"],
          ["Inversiya (i)", "YO'Q", "MAVJUD"],
          ["Mutual exclusion", "Ishlamaydi", "Ishlaydi"],
          ["Optik faollik", "MAVJUD (Δ/Λ)", "YO'Q (meso)"],
          ["ν(Co-Cl) IQ", "2 ta: 330, 310", "1 ta: 355"],
          ["ν(Co-Cl) Raman", "IQ bilan bir xil", "1 ta: 322 (IQ dan farqli)"],
          ["ν(Co-N) IQ", "3 ta modasi (A₁+B₁+B₂)", "1 ta (Eᵤ) — 4 ekvivalent"],
          ["UV-Vis λmax", "~535 nm", "~625 nm"],
          ["Kristall tizim", "Monoklinik P2₁/c", "Tetragonal P4/mmm"],
          ["Hosil bo'lish sharoiti", "Sovuq HCl da", "Issiq/kons. HCl da"],
        ]

        isomerComparison.forEach((row, i) => {
          const rowH = 18
          checkPageBreak(rowH + 2)
          const bg = i % 2 === 0 ? C.bgAbstract : C.white
          // Label kolonka
          page.drawRectangle({ x: MARGIN, y: y - rowH, width: 130, height: rowH, color: C.bgPurple })
          safeText(row[0], { x: MARGIN + 4, y: y - 12, size: 8.5, font: boldFont, color: C.purple, maxWidth: 122 })
          // Sis kolonka
          page.drawRectangle({ x: MARGIN + 130, y: y - rowH, width: (CONTENT_W - 130) / 2, height: rowH, color: bg })
          safeText(row[1], { x: MARGIN + 134, y: y - 12, size: 8.5, font: regularFont, color: C.violetDeep, maxWidth: (CONTENT_W - 130) / 2 - 6 })
          // Trans kolonka
          page.drawRectangle({ x: MARGIN + 130 + (CONTENT_W - 130) / 2, y: y - rowH, width: (CONTENT_W - 130) / 2, height: rowH, color: bg })
          safeText(row[2], { x: MARGIN + 134 + (CONTENT_W - 130) / 2, y: y - 12, size: 8.5, font: regularFont, color: C.emeraldDeep, maxWidth: (CONTENT_W - 130) / 2 - 6 })
          y -= rowH
        })
        y -= 10

        drawInfoBox(
          "Yorgensen (Jorgensen S. M., 1889) bu ikki izomerni birinchi bo'lib olgan va rangi bo'yicha farqlagan (Violeo — binafsha, Praseo — yashil). Werner (1893) esa ularning strukturaviy asosini nazariy jihatdan tushuntirgan. IQ spektroskopiya 1950-yillarda Nakamoto va boshqalar tomonidan bu farqni bevosita eksperimental isbotlagan.",
          C.bgYellow, C.orange, C.textDark
        )
      }


      // 4. CHO'QQILAR JADVALI — HAR IKKI IZOMER
      if (pdfSections.peaks) {
        drawSectionHeader(sectionNum++, "IQ Cho'qqilar — Sis va Trans Izomerlar")

        // SIS izomer jadvali
        safeText("SIS IZOMER (Violeo) — C₂ᵥ", {
          x: MARGIN, y, size: 11, font: boldFont, color: C.violet, maxWidth: CONTENT_W,
        })
        y -= 16

        const colW = [55, 90, 105, 45, 95, 100]
        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.violet })
        const headers = ["ν̃ (cm⁻¹)", "Tayinlash", "Tavsif", "T%", "Simmetriya", "k (mdyn/Å)"]
        let cx = MARGIN + 4
        headers.forEach((h, i) => {
          safeText(h, { x: cx, y: y - 14, size: 8.5, font: boldFont, color: C.white, maxWidth: colW[i] - 4 })
          cx += colW[i]
        })
        y -= 20

        irPeaks_cis.forEach((p, idx) => {
          checkPageBreak(22)
          const isKey = p.freq === 330 || p.freq === 310
          const bg = isKey ? C.bgViolet : (idx % 2 === 0 ? C.bgAbstract : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          let cx2 = MARGIN + 4
          const cells = [
            String(p.freq), cleanText(p.assignment), cleanText(p.assignment_uz),
            `${p.T}%`, cleanText(p.symmetry).split(" — ")[0], cleanText(p.forceConstant),
          ]
          cells.forEach((cell, i) => {
            const font = isKey || i === 0 ? boldFont : regularFont
            const color = i === 0 ? C.violetDeep : (isKey ? C.violet : C.textDark)
            safeText(cell, { x: cx2, y: y - 13, size: 8.5, font, color, maxWidth: colW[i] - 4 })
            cx2 += colW[i]
          })
          y -= 20
        })
        y -= 12

        // TRANS izomer jadvali
        checkPageBreak(60)
        safeText("TRANS IZOMER (Praseo) — D₄ₕ", {
          x: MARGIN, y, size: 11, font: boldFont, color: C.emeraldDeep, maxWidth: CONTENT_W,
        })
        y -= 16

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.emerald })
        let cx3 = MARGIN + 4
        headers.forEach((h, i) => {
          safeText(h, { x: cx3, y: y - 14, size: 8.5, font: boldFont, color: C.white, maxWidth: colW[i] - 4 })
          cx3 += colW[i]
        })
        y -= 20

        irPeaks_trans.forEach((p, idx) => {
          checkPageBreak(22)
          const isKey = p.freq === 355
          const isNoIR = p.intensityCode === 0
          const bg = isKey ? C.bgEmerald : (isNoIR ? C.bgRed : (idx % 2 === 0 ? C.bgAbstract : C.white))
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          let cx4 = MARGIN + 4
          const freqStr = p.freq ? String(p.freq) : "IQ da yo'q"
          const cells = [
            freqStr, cleanText(p.assignment), cleanText(p.assignment_uz),
            p.T !== null && p.T !== undefined ? `${p.T}%` : "—",
            cleanText(p.symmetry).split(" — ")[0], cleanText(p.forceConstant),
          ]
          cells.forEach((cell, i) => {
            const font = isKey || i === 0 ? boldFont : regularFont
            const color = i === 0 ? (isNoIR ? C.red : C.emeraldDeep) : (isKey ? C.emerald : (isNoIR ? C.red : C.textDark))
            safeText(cell, { x: cx4, y: y - 13, size: 8.5, font, color, maxWidth: colW[i] - 4 })
            cx4 += colW[i]
          })
          y -= 20
        })
        y -= 8

        drawInfoBox(
          "MUHIM: Trans izomerdagi qizil sotrlar — mutual exclusion tufayli IQ da KO'RINMAYDIGAN polosalar. Bu polosalar Raman spektroskopiyada ko'rinadi. Sis izomerda hech qanday polosa 'yo'q' emas — chunki C₂ᵥ da inversiya markazi yo'q.",
          C.bgRed, C.red, C.textDark
        )
      }

      // 5. IQ SPEKTR GRAFIGI
      if (pdfSections.spectrum) {
        drawSectionHeader(sectionNum++, "IQ Spektri Grafigi — Sis va Trans Taqqoslash")

        checkPageBreak(280)

        const gLeftPad = 40, gTopPad = 20
        const gX = MARGIN + gLeftPad
        const gW = CONTENT_W - gLeftPad - 5
        const gH = 90 // Har bir izomer uchun
        const xMax = 4000, xMin = 200

        // SIS SPEKTR
        safeText("SIS izomer (Violeo)", {
          x: MARGIN, y, size: 10, font: boldFont, color: C.violet, maxWidth: CONTENT_W,
        })
        y -= 14

        const gY1 = y - gH - gTopPad
        page.drawRectangle({
          x: gX, y: gY1, width: gW, height: gH,
          color: rgb(0.99, 0.97, 1.0), borderColor: C.violet, borderWidth: 0.5,
        })

        // Y grid
        for (let tick = 0; tick <= 100; tick += 25) {
          const ty = gY1 + (tick / 100) * gH
          page.drawLine({ start: { x: gX, y: ty }, end: { x: gX + gW, y: ty }, thickness: 0.2, color: rgb(0.92, 0.88, 0.95) })
          const lw = measure(`${tick}`, regularFont, 6.5)
          page.drawText(`${tick}`, { x: gX - lw - 4, y: ty - 3, size: 6.5, font: regularFont, color: C.textMuted })
        }
        // X grid
        const xTicks = [4000, 3000, 2000, 1500, 1000, 500, 200]
        xTicks.forEach(wn => {
          const tx = gX + ((xMax - wn) / (xMax - xMin)) * gW
          page.drawLine({ start: { x: tx, y: gY1 }, end: { x: tx, y: gY1 + gH }, thickness: 0.2, color: rgb(0.92, 0.88, 0.95) })
          const lw = measure(`${wn}`, regularFont, 6.5)
          page.drawText(`${wn}`, { x: tx - lw / 2, y: gY1 - 10, size: 6.5, font: regularFont, color: C.textMuted })
        })

        // Sis spektr Lorentzian
        const totalPoints = 400
        const transmittanceSis = new Array(totalPoints).fill(1.0)
        irPeaks_cis.forEach(peak => {
          const sigma = peak.freq > 2000 ? 25 : peak.freq > 1000 ? 20 : 12
          for (let i = 0; i < totalPoints; i++) {
            const wn_i = xMin + (i / totalPoints) * (xMax - xMin)
            const absorption = peak.absorbance * Math.exp(-Math.pow(wn_i - peak.freq, 2) / (2 * sigma * sigma))
            transmittanceSis[i] = Math.max(transmittanceSis[i] - absorption, 0.05)
          }
        })
        for (let i = 0; i < totalPoints - 1; i++) {
          const wn0 = xMin + (i / totalPoints) * (xMax - xMin)
          const wn1 = xMin + ((i + 1) / totalPoints) * (xMax - xMin)
          const x0 = gX + ((xMax - wn0) / (xMax - xMin)) * gW
          const x1 = gX + ((xMax - wn1) / (xMax - xMin)) * gW
          const y0 = gY1 + transmittanceSis[i] * gH
          const y1 = gY1 + transmittanceSis[i + 1] * gH
          page.drawLine({ start: { x: x0, y: y0 }, end: { x: x1, y: y1 }, thickness: 0.9, color: C.violetDeep })
        }
        // Sis Co-Cl cho'qqilariga urg'u
        [330, 310].forEach(fr => {
          const px = gX + ((xMax - fr) / (xMax - xMin)) * gW
          page.drawLine({ start: { x: px, y: gY1 }, end: { x: px, y: gY1 + gH }, thickness: 0.7, color: C.violet })
          safeText(`${fr}`, { x: px, y: gY1 + gH + 3, size: 7, font: boldFont, color: C.violet, align: "center" })
        })

        y = gY1 - 22
        safeText("↑ 2 ta ν(Co-Cl) polosasi (330 va 310 cm⁻¹) — sis izomer diagnostikasi", {
          x: MARGIN, y, size: 8, font: italicFont, color: C.violetDeep, maxWidth: CONTENT_W,
        })
        y -= 18

        // TRANS SPEKTR
        checkPageBreak(130)
        safeText("TRANS izomer (Praseo)", {
          x: MARGIN, y, size: 10, font: boldFont, color: C.emeraldDeep, maxWidth: CONTENT_W,
        })
        y -= 14

        const gY2 = y - gH - gTopPad
        page.drawRectangle({
          x: gX, y: gY2, width: gW, height: gH,
          color: rgb(0.97, 1.0, 0.98), borderColor: C.emerald, borderWidth: 0.5,
        })

        for (let tick = 0; tick <= 100; tick += 25) {
          const ty = gY2 + (tick / 100) * gH
          page.drawLine({ start: { x: gX, y: ty }, end: { x: gX + gW, y: ty }, thickness: 0.2, color: rgb(0.88, 0.95, 0.92) })
          const lw = measure(`${tick}`, regularFont, 6.5)
          page.drawText(`${tick}`, { x: gX - lw - 4, y: ty - 3, size: 6.5, font: regularFont, color: C.textMuted })
        }
        xTicks.forEach(wn => {
          const tx = gX + ((xMax - wn) / (xMax - xMin)) * gW
          page.drawLine({ start: { x: tx, y: gY2 }, end: { x: tx, y: gY2 + gH }, thickness: 0.2, color: rgb(0.88, 0.95, 0.92) })
          const lw = measure(`${wn}`, regularFont, 6.5)
          page.drawText(`${wn}`, { x: tx - lw / 2, y: gY2 - 10, size: 6.5, font: regularFont, color: C.textMuted })
        })

        const transmittanceTrans = new Array(totalPoints).fill(1.0)
        irPeaks_trans.forEach(peak => {
          if (!peak.freq || peak.absorbance === null) return
          const sigma = peak.freq > 2000 ? 25 : peak.freq > 1000 ? 20 : 12
          for (let i = 0; i < totalPoints; i++) {
            const wn_i = xMin + (i / totalPoints) * (xMax - xMin)
            const absorption = peak.absorbance * Math.exp(-Math.pow(wn_i - peak.freq, 2) / (2 * sigma * sigma))
            transmittanceTrans[i] = Math.max(transmittanceTrans[i] - absorption, 0.05)
          }
        })
        for (let i = 0; i < totalPoints - 1; i++) {
          const wn0 = xMin + (i / totalPoints) * (xMax - xMin)
          const wn1 = xMin + ((i + 1) / totalPoints) * (xMax - xMin)
          const x0 = gX + ((xMax - wn0) / (xMax - xMin)) * gW
          const x1 = gX + ((xMax - wn1) / (xMax - xMin)) * gW
          const y0 = gY2 + transmittanceTrans[i] * gH
          const y1 = gY2 + transmittanceTrans[i + 1] * gH
          page.drawLine({ start: { x: x0, y: y0 }, end: { x: x1, y: y1 }, thickness: 0.9, color: C.emeraldDeep })
        }
        // Trans Co-Cl cho'qqisi
        const pxTrans = gX + ((xMax - 355) / (xMax - xMin)) * gW
        page.drawLine({ start: { x: pxTrans, y: gY2 }, end: { x: pxTrans, y: gY2 + gH }, thickness: 0.7, color: C.emerald })
        safeText("355", { x: pxTrans, y: gY2 + gH + 3, size: 7, font: boldFont, color: C.emerald, align: "center" })

        // O'q label
        const xAxisLabel = "To'lqin soni (cm⁻¹)"
        const xAxisW = measure(xAxisLabel, italicFont, 9)
        page.drawText(xAxisLabel, {
          x: gX + (gW - xAxisW) / 2, y: gY2 - 22, size: 9, font: italicFont, color: C.emeraldDeep,
        })

        y = gY2 - 40

        drawWrappedText(
          "1-rasm. Sis va trans izomerlarning IQ spektrlari (Lorentzian simulyatsiya, CsI). Sis izomerda ν(Co-Cl) sohasida IKKI polosa (330 va 310 cm⁻¹) aniq ajratilgan, trans izomerda esa faqat BITTA polosa (355 cm⁻¹) mavjud. Bu farq geometrik izomerlarni farqlashning eng ishonchli IQ diagnostikasi.",
          { x: MARGIN, y, size: 8.5, font: italicFont, color: C.purpleSoft, maxWidth: CONTENT_W, lineHeight: 11 }
        )
        y -= wrapText("1-rasm. Sis va trans izomerlarning IQ spektrlari (Lorentzian simulyatsiya, CsI). Sis izomerda ν(Co-Cl) sohasida IKKI polosa (330 va 310 cm⁻¹) aniq ajratilgan, trans izomerda esa faqat BITTA polosa (355 cm⁻¹) mavjud. Bu farq geometrik izomerlarni farqlashning eng ishonchli IQ diagnostikasi.", italicFont, 8.5, CONTENT_W).length * 11 + 12
      }

      // 6. GURUH NAZARIYASI
      if (pdfSections.groupTheory) {
        drawSectionHeader(sectionNum++, "Guruh Nazariyasi — C₂ᵥ va D₄ₕ Solishtirish")

        const gtData = [
          ["Sis simmetriya", "C₂ᵥ (E, C₂, σᵥ, σᵥ')"],
          ["Sis tartibi", "4 ta operatsiya"],
          ["Sis inversiya", "YO'Q → mutual exclusion ishlamaydi"],
          ["Sis ν(Co-N) modalari", "A₁ + B₁ + B₂ (3 ta IQ+Raman faol)"],
          ["Sis ν(Co-Cl) modalari", "A₁ (simmetrik) + B₁ (asimmetrik) — 2 ta IQ"],
          ["Sis xarakteristika", "Optik faol — Δ/Λ enantiomerlari"],
          ["Trans simmetriya", "D₄ₕ (E, 2C₄, C₂, 2C₂', 2C₂'', i, 2S₄, σₕ, 2σᵥ, 2σd)"],
          ["Trans tartibi", "16 ta operatsiya (4× ko'proq)"],
          ["Trans inversiya", "MAVJUD (i) → mutual exclusion ISHLAYDI"],
          ["Trans ν(Co-N) modalari", "Eᵤ (IQ, 2-karra) + A₁g (Raman) + B₁g (Raman)"],
          ["Trans ν(Co-Cl) modalari", "A₂ᵤ (IQ, 1 ta) + A₁g (faqat Raman)"],
          ["Trans xarakteristika", "Meso — optik faol emas"],
        ]
        gtData.forEach((row, i) => {
          const bgs = i < 6 ? C.bgViolet : C.bgEmerald
          const lc = i < 6 ? C.violet : C.emerald
          drawTableRow(row[0], row[1], i % 2 === 0 ? bgs : C.white, lc)
        })
        y -= 10

        drawInfoBox(
          "MUTUAL EXCLUSION QOIDASI (D₄ₕ da): Trans izomer inversiya markaziga ega. Bu qoida bo'yicha gerade (g) modalar faqat Ramanda, ungerade (u) faqat IQ da faol. Natijada trans izomerda ν(Co-Cl) simmetrik cho'zilishi A₁g gerade — IQ da KO'RINMAYDI, faqat Ramanda (322 cm⁻¹). Asimmetrik cho'zilish A₂ᵤ ungerade — IQ da 355 cm⁻¹ da faol. Shuning uchun trans izomerda faqat 1 ta ν(Co-Cl) polosasi kuzatiladi.",
          C.bgEmerald, C.emerald, C.textDark
        )

        drawInfoBox(
          "C₂ᵥ da INVERSIYA MARKAZI YO'Q → mutual exclusion qoidasi ISHLAMAYDI. Sis izomerda barcha simmetriya modalari (A₁, B₁, B₂) IQ va Ramanda birga faol. Shuning uchun 2 ta ν(Co-Cl) polosasi (simmetrik va asimmetrik) IQ da AYRIM-AYRIM ko'rinadi.",
          C.bgViolet, C.violet, C.textDark
        )
      }

      // 7. DIAGNOSTIKA USULLARI
      if (pdfSections.diagnostics) {
        drawSectionHeader(sectionNum++, "Sis/Trans Farqlash Usullari Solishtirish")

        drawWrappedText(
          "Geometrik izomerlarni bir-biridan ajratishning bir necha usullari mavjud. IQ spektroskopiya eng oson va tezkor usul — laboratoriyada 15-20 daqiqada natija olish mumkin. Boshqa usullar tasdiqlash uchun ishlatiladi.",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Geometrik izomerlarni bir-biridan ajratishning bir necha usullari mavjud. IQ spektroskopiya eng oson va tezkor usul — laboratoriyada 15-20 daqiqada natija olish mumkin. Boshqa usullar tasdiqlash uchun ishlatiladi.", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.blue })
        const dHeaders = ["Usul", "Sis natijasi", "Trans natijasi", "Ishonchlilik"]
        const dColW = [140, 140, 140, 75]
        let dcx = MARGIN + 4
        dHeaders.forEach((h, i) => {
          safeText(h, { x: dcx, y: y - 14, size: 8.5, font: boldFont, color: C.white, maxWidth: dColW[i] - 4 })
          dcx += dColW[i]
        })
        y -= 20

        cisTransDiagnostics.forEach((d, idx) => {
          checkPageBreak(22)
          const bg = idx % 2 === 0 ? C.bgBlue : C.white
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          let dcx2 = MARGIN + 4
          const cells = [d.method, d.cisResult, d.transResult, d.reliability]
          cells.forEach((cell, i) => {
            const font = i === 0 ? boldFont : regularFont
            const color = i === 0 ? C.blue : (i === 1 ? C.violetDeep : (i === 2 ? C.emeraldDeep : C.textDark))
            safeText(cell, { x: dcx2, y: y - 13, size: 8, font, color, maxWidth: dColW[i] - 4 })
            dcx2 += dColW[i]
          })
          y -= 20
        })
        y -= 8

        drawInfoBox(
          "Amaliy strategiya: (1) IQ spektrini oling (CsI tabletka, 400-200 cm⁻¹ sohasi); (2) ν(Co-Cl) polosalari sonini sanang — 2 ta bo'lsa sis, 1 ta bo'lsa trans; (3) UV-Vis bilan tasdiqlang (~535 nm sis vs ~625 nm trans); (4) Agar shubha bo'lsa CD spektroskopiya (sis optik faol) yoki XRD ishlating.",
          C.bgGreen, C.green, C.textDark
        )
      }

      // 8. KUCH KONSTANTASI
      if (pdfSections.forceConstant) {
        drawSectionHeader(sectionNum++, "Kuch Konstantasi va Hooke Qonuni")

        drawWrappedText(
          "Sis va trans izomerlarda ν(Co-Cl) chastotalari va kuch konstantalarining farqi trans-effekt va simmetriya bilan izohlanadi. Trans izomerda 2 ta Cl⁻ bir-birining trans-holatida — natijada bog' qisqaroq va mustahkamroq (k = 1.52).",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Sis va trans izomerlarda ν(Co-Cl) chastotalari va kuch konstantalarining farqi trans-effekt va simmetriya bilan izohlanadi. Trans izomerda 2 ta Cl⁻ bir-birining trans-holatida — natijada bog' qisqaroq va mustahkamroq (k = 1.52).", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.orangeDeep })
        const fcHeaders = ["Bog'", "k (mdyn/Å)", "ν̃ (cm⁻¹)", "Izoh"]
        const fcColW = [175, 90, 90, 140]
        let fcx = MARGIN + 6
        fcHeaders.forEach((h, i) => {
          safeText(h, { x: fcx, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: fcColW[i] - 4 })
          fcx += fcColW[i]
        })
        y -= 20

        forceConstantExamples.forEach((f, idx) => {
          checkPageBreak(20)
          const isHighlight = f.bond.includes("(sis") || f.bond.includes("(trans")
          const bg = isHighlight ? C.bgYellow : (idx % 2 === 0 ? C.bgOrange : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let cx5 = MARGIN + 6
          const cells = [f.bond, String(f.k), String(f.freq), f.note]
          cells.forEach((cell, i) => {
            const font = isHighlight ? boldFont : (i === 0 ? boldFont : regularFont)
            const color = isHighlight ? C.orangeDeep : (i === 0 ? C.orangeDeep : C.textDark)
            safeText(cell, { x: cx5, y: y - 12, size: 8.5, font, color, maxWidth: fcColW[i] - 4 })
            cx5 += fcColW[i]
          })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "Kuch konstantalari qatori: k(Co-Cl, trans) = 1.52 > k(Co-Cl, sis νₐₛ) = 1.44 > k(Co-Cl, sis νₛ) = 1.38 mdyn/Å. Trans izomerda bog' mustahkamroq — chunki 2 ta Cl⁻ trans-effekti bir-birini mustahkamlaydi. Bu Hooke qonuni asosida ν farqini to'liq izohlaydi: ν̃(trans) = 355 > ν̃(sis, νₐₛ) = 330 > ν̃(sis, νₛ) = 310 cm⁻¹.",
          C.bgGreen, C.green, C.textDark
        )
      }


      // 9. WERNER QATORI
      if (pdfSections.werner) {
        drawSectionHeader(sectionNum++, "Werner Koordinatsion Qatori")

        drawWrappedText(
          "Werner (1893) qatorida bu birikma UCHINCHI o'rinni egallaydi — 2 ta Cl⁻ ichki sferada. AgNO₃ tajribasida faqat 1 ta Cl⁻ cho'kadi. Bu qator sis va trans izomerlarni ham qamrab oladi.",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Werner (1893) qatorida bu birikma UCHINCHI o'rinni egallaydi — 2 ta Cl⁻ ichki sferada. AgNO₃ tajribasida faqat 1 ta Cl⁻ cho'kadi. Bu qator sis va trans izomerlarni ham qamrab oladi.", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.purple })
        const wHeaders = ["Kompleks", "An'ana. nom", "Simm.", "ν(Co-N)", "ν(Co-Cl)", "AgCl"]
        const wColW = [155, 90, 55, 70, 75, 45]
        let wcx = MARGIN + 6
        wHeaders.forEach((h, i) => {
          safeText(h, { x: wcx, y: y - 14, size: 8.5, font: boldFont, color: C.white, maxWidth: wColW[i] - 4 })
          wcx += wColW[i]
        })
        y -= 20

        wernerSeries.forEach((w, idx) => {
          checkPageBreak(22)
          const bg = w.current ? (w.isomer === "cis" ? C.bgViolet : C.bgEmerald) : (idx % 2 === 0 ? C.bgPurple : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          let wcx2 = MARGIN + 6
          const cells = [w.formula, w.trad, w.sym, w.nuCoN, w.nuCoCl, `${w.agCl}`]
          cells.forEach((cell, i) => {
            const font = w.current ? boldFont : (i === 0 ? boldFont : regularFont)
            const color = w.current
              ? (w.isomer === "cis" ? C.violet : C.emerald)
              : (i === 0 ? C.purple : C.textDark)
            safeText(cell, { x: wcx2, y: y - 13, size: 8, font, color, maxWidth: wColW[i] - 4 })
            wcx2 += wColW[i]
          })
          y -= 20
        })
        y -= 8

        drawInfoBox(
          "ν(Co-Cl) polosalari sonining o'zgarishi: Luteo (0 ichki Cl) — YO'Q, Purpureo (1 ichki Cl) — 1 ta (328 cm⁻¹), sis-Violeo (2 ichki Cl) — 2 ta (330, 310), trans-Praseo (2 ichki Cl) — 1 ta (355). Bu qatorda IQ spektri Werner nazariyasini ham (ichki sfera) ham geometrik izomeriyani ham (sis vs trans) bir vaqtda tasdiqlaydi.",
          C.bgPurple, C.purple, C.textDark
        )
      }

      // 10. NAMUNA TAYYORLASH
      if (pdfSections.techniques) {
        drawSectionHeader(sectionNum++, "Namuna Tayyorlash — Sis/Trans Tahlili Uchun")

        drawWrappedText(
          "Sis/trans farqlash uchun CsI tabletka MAJBURIY — chunki ν(Co-Cl) 310-355 cm⁻¹ sohasida joylashgan va KBr bu sohada shaffofligini yo'qotgan (400 cm⁻¹ dan pastda). Qolgan 3 usul yordamchi.",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Sis/trans farqlash uchun CsI tabletka MAJBURIY — chunki ν(Co-Cl) 310-355 cm⁻¹ sohasida joylashgan va KBr bu sohada shaffofligini yo'qotgan (400 cm⁻¹ dan pastda). Qolgan 3 usul yordamchi.", regularFont, 9.5, CONTENT_W).length * 13 + 10

        techniques.forEach((t, idx) => {
          checkPageBreak(160)
          const isRec = t.name.includes("CsI")
          page.drawRectangle({
            x: MARGIN, y: y - 20, width: CONTENT_W, height: 20,
            color: isRec ? C.emerald : C.blue,
          })
          const marker = isRec ? " ★ TAVSIYA" : ""
          safeText(`${idx + 1}. ${t.name}${marker}`, {
            x: MARGIN + 8, y: y - 14, size: 10, font: boldFont, color: C.white, maxWidth: CONTENT_W - 16,
          })
          y -= 20

          const h = drawWrappedText(t.description, {
            x: MARGIN + 8, y: y - 12, size: 9, font: italicFont, color: C.textMuted,
            maxWidth: CONTENT_W - 16, lineHeight: 12,
          })
          y -= h + 8

          const colBoxW = (CONTENT_W - 10) / 2
          checkPageBreak(75)

          page.drawRectangle({
            x: MARGIN, y: y - 68, width: colBoxW, height: 68,
            color: C.bgGreen, borderColor: C.green, borderWidth: 0.5,
          })
          safeText("✓ Afzalliklar", {
            x: MARGIN + 6, y: y - 12, size: 9, font: boldFont, color: C.green, maxWidth: colBoxW - 12,
          })
          t.advantages.forEach((adv, i) => {
            safeText(`• ${adv}`, {
              x: MARGIN + 6, y: y - 26 - i * 10, size: 7.5,
              font: regularFont, color: C.textDark, maxWidth: colBoxW - 12,
            })
          })

          page.drawRectangle({
            x: MARGIN + colBoxW + 10, y: y - 68, width: colBoxW, height: 68,
            color: C.bgRed, borderColor: C.red, borderWidth: 0.5,
          })
          safeText("✗ Kamchiliklar", {
            x: MARGIN + colBoxW + 16, y: y - 12, size: 9, font: boldFont, color: C.red, maxWidth: colBoxW - 12,
          })
          t.disadvantages.forEach((dis, i) => {
            safeText(`• ${dis}`, {
              x: MARGIN + colBoxW + 16, y: y - 26 - i * 10, size: 7.5,
              font: regularFont, color: C.textDark, maxWidth: colBoxW - 12,
            })
          })
          y -= 74

          safeText(
            `Chastota: ${t.freqRange}  •  Ruxsat: ${t.resolution}  •  Vaqt: ${t.samplePrep}`,
            { x: MARGIN, y, size: 8, font: italicFont, color: C.purpleSoft, maxWidth: CONTENT_W }
          )
          y -= 12
          safeText(`Eng yaxshi qo'llanish: ${t.bestFor}`, {
            x: MARGIN, y, size: 8, font: italicFont, color: C.purpleSoft, maxWidth: CONTENT_W,
          })
          y -= 16
        })
      }

      // 11. HALAQIT OMILLARI
      if (pdfSections.interferences) {
        drawSectionHeader(sectionNum++, "Halaqit Omillari — Izomerlar Uchun Xos")

        drawWrappedText(
          "Bu birikma bilan ishlashda o'ziga xos ikki muammo: (1) sis/trans aralashmasi — spektrda 4 ta ν(Co-Cl) polosasi ko'rinishi; (2) sis→trans izomerlanishi. Quyida 8 ta omil:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Bu birikma bilan ishlashda o'ziga xos ikki muammo: (1) sis/trans aralashmasi — spektrda 4 ta ν(Co-Cl) polosasi ko'rinishi; (2) sis→trans izomerlanishi. Quyida 8 ta omil:", regularFont, 9.5, CONTENT_W).length * 13 + 10

        interferences.forEach((iv, idx) => {
          checkPageBreak(60)
          const sevColor = iv.severity === "Yuqori" ? C.red : (iv.severity === "O'rta" ? C.orange : C.green)
          const sevBg = iv.severity === "Yuqori" ? C.bgRed : (iv.severity === "O'rta" ? C.bgOrange : C.bgGreen)
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: sevBg })
          safeText(`${idx + 1}. ${iv.source}`, {
            x: MARGIN + 6, y: y - 12, size: 9.5, font: boldFont, color: sevColor, maxWidth: CONTENT_W * 0.5,
          })
          safeText(`ν̃: ${iv.freqRange}`, {
            x: MARGIN + CONTENT_W * 0.52, y: y - 12, size: 8.5,
            font: regularFont, color: C.textDark, maxWidth: CONTENT_W * 0.28,
          })
          safeText(`[${iv.severity}]`, {
            x: PAGE_W - MARGIN - 6, y: y - 12, size: 8.5,
            font: boldFont, color: sevColor, align: "right", maxWidth: CONTENT_W * 0.15,
          })
          y -= 20

          const h1 = drawWrappedText(`Ta'sir: ${iv.effect}`, {
            x: MARGIN + 8, y, size: 8.5, font: regularFont, color: C.textDark,
            maxWidth: CONTENT_W - 16, lineHeight: 11,
          })
          y -= h1 + 4
          const h2 = drawWrappedText(`Yechim: ${iv.solution}`, {
            x: MARGIN + 8, y, size: 8.5, font: italicFont, color: C.greenDark,
            maxWidth: CONTENT_W - 16, lineHeight: 11,
          })
          y -= h2 + 10
        })
      }

      // 12. XULOSALAR
      if (pdfSections.conclusions) {
        drawSectionHeader(sectionNum++, "Asosiy Xulosalar")

        const conclusions = [
          "[Co(NH₃)₄Cl₂]Cl ning sis va trans izomerlari IQ spektroskopiyada ENG OSON farqlanadi: sis izomerda 2 ta ν(Co-Cl) polosasi (330, 310 cm⁻¹), trans izomerda faqat 1 ta (355 cm⁻¹).",
          "Bu farq mutual exclusion qoidasi bilan izohlanadi: trans izomer D₄ₕ simmetriyaga ega (inversiya markazi bor), sis izomer esa C₂ᵥ (i yo'q). Trans da ν(Co-Cl) simmetrik cho'zilishi A₁g gerade IQ da ko'rinmaydi.",
          "Kuch konstantalari qatori: k(trans) = 1.52 > k(sis, νₐₛ) = 1.44 > k(sis, νₛ) = 1.38 mdyn/Å. Trans izomerda 2 ta Cl⁻ trans-effekti bir-birini mustahkamlaydi.",
          "Sis izomer OPTIK FAOL (Δ va Λ enantiomerlari), trans izomer OPTIK FAOL EMAS (meso, i markazi tufayli). CD spektroskopiya bu farqni tasdiqlaydi.",
          "Namuna tayyorlash uchun CsI tabletka MAJBURIY (ν(Co-Cl) 310-355 cm⁻¹ sohasida, KBr 400 cm⁻¹ da tugaydi). ATR ham yaramaydi (650 cm⁻¹ dan pastda kuchsizlanadi).",
          "Sis va trans izomerlar Jorgensen (1889) tomonidan rangi bo'yicha farqlangan (Violeo — binafsha, Praseo — yashil). Werner (1893) esa strukturaviy asosini bergan. IQ spektroskopiya bu farqni miqdoriy jihatdan isbotlaydi.",
          "AgNO₃ tajribasida ikkala izomer bir xil natija beradi (1 ta Cl⁻ cho'kadi) — konduktometriya (1:1) va molyar o'tkazuvchanlik ham bir xil. Faqat IQ (va CD/XRD) ularni ajratadi.",
          "Werner koordinatsion qatorida bu birikma UCHINCHI o'rinni egallaydi: luteo→purpureo→violeo/praseo. IQ orqali kuzatiladi: ν(Co-Cl) 0→1→2 (sis) / 1 (trans) polosaga o'zgaradi.",
        ]

        conclusions.forEach((c, idx) => {
          checkPageBreak(35)
          page.drawCircle({ x: MARGIN + 10, y: y - 8, size: 8, color: C.emerald })
          const numStr = `${idx + 1}`
          const numW = measure(numStr, boldFont, 9)
          page.drawText(numStr, {
            x: MARGIN + 10 - numW / 2, y: y - 11, size: 9, font: boldFont, color: C.white,
          })
          const h = drawWrappedText(c, {
            x: MARGIN + 25, y, size: 9, font: regularFont, color: C.textDark,
            maxWidth: CONTENT_W - 30, lineHeight: 12,
          })
          y -= h + 10
        })
      }

      addFooter()

      pdfDoc.setTitle(`[Co(NH₃)₄Cl₂]Cl IQ Spektroskopik Tahlili`)
      pdfDoc.setSubject("Sis/Trans izomerlar — Violeo va Praseo kobalt")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo IQ Tahlil Moduli")
      pdfDoc.setKeywords(["cis-trans", "Violeo", "Praseo", "C2v", "D4h", "mutual exclusion", "IR spectroscopy"])

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Co_NH3_4_Cl2_Cl_IQ_tahlili_${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setPdfModalOpen(false)
    } catch (err) {
      console.error("PDF yaratishda xato:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally {
      setPdfGenerating(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const isoColor = activeIsomer === "cis" ? "violet" : "emerald"
  const isoData = activeIsomer === "cis" ? COMPOUND.isomers.cis : COMPOUND.isomers.trans

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* HEADER */}
      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/iq" className="hover:text-purple-300">IQ spektroskopiya</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/iq/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-emerald-400 font-semibold">[Co(NH₃)₄Cl₂]Cl</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-emerald-400 flex items-center gap-2 flex-wrap">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🔍 IQ</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">M = {COMPOUND.molarMass} g/mol • 1:1 elektrolit</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-violet-900/30 border border-violet-700/50 text-violet-400 text-[10px] uppercase tracking-wide">Sis: C₂ᵥ (2 ν)</span>
                  <span className="px-2 py-1 rounded bg-emerald-900/30 border border-emerald-700/50 text-emerald-400 text-[10px] uppercase tracking-wide">Trans: D₄ₕ (1 ν)</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Geometrik izomeriya</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Mutual exclusion</span>
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Optik faollik (sis)</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setPdfModalOpen(true)}
                  className="text-xs bg-gradient-to-r from-emerald-600 to-violet-600 hover:from-emerald-500 hover:to-violet-500 text-white px-4 py-2 rounded-lg transition-all whitespace-nowrap font-bold shadow-lg shadow-emerald-500/20"
                >
                  📄 PDF Hisobot
                </button>
                <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-xs bg-emerald-600/80 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-center">
                  ← Barcha birikmalar
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      {/* PDF MODAL */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-950 to-blue-950 border-2 border-emerald-500 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                <span className="text-3xl">📄</span> PDF Hisobot — Bo'limlar
              </h3>
              <button onClick={() => setPdfModalOpen(false)} className="text-purple-400 hover:text-white text-2xl">×</button>
            </div>
            <p className="text-purple-200 text-sm mb-4">
              [Co(NH₃)₄Cl₂]Cl — sis (Violeo) va trans (Praseo) izomerlarining to'liq IQ tahlili. Ikkala izomer PDF da yonma-yon taqqoslanadi.
            </p>

            <div className="space-y-2 mb-6">
              {[
                { key: "identification", label: "1. Birikma identifikatsiyasi", desc: "Formula, CAS (sis/trans), simmetriya" },
                { key: "theory", label: "2. Nazariy asos", desc: "Geometrik izomeriya, mutual exclusion" },
                { key: "isomers", label: "3. Sis/Trans to'liq taqqoslash", desc: "12 ta parametr yonma-yon jadval" },
                { key: "peaks", label: "4. Cho'qqilar jadvali", desc: "Sis (10 ta) + Trans (7 ta) alohida" },
                { key: "spectrum", label: "5. IQ spektri grafigi", desc: "Ikkala izomer yonma-yon grafik" },
                { key: "groupTheory", label: "6. Guruh nazariyasi", desc: "C₂ᵥ vs D₄ₕ vakolatlari" },
                { key: "diagnostics", label: "7. Farqlash usullari", desc: "7 ta usul — IQ, Raman, CD, XRD" },
                { key: "forceConstant", label: "8. Kuch konstantasi", desc: "9 ta bog' taqqoslash" },
                { key: "werner", label: "9. Werner qatori", desc: "Luteo→Purpureo→Violeo/Praseo" },
                { key: "techniques", label: "10. Namuna tayyorlash", desc: "CsI ★ MAJBURIY" },
                { key: "interferences", label: "11. Halaqit omillari", desc: "8 ta muammo, izomerlanish" },
                { key: "conclusions", label: "12. Asosiy xulosalar", desc: "8 ta ilmiy tezis" },
              ].map(s => (
                <label key={s.key} className="flex items-start gap-3 p-3 bg-purple-800/30 border border-purple-700/40 rounded-lg hover:border-emerald-500/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={pdfSections[s.key]}
                    onChange={(e) => setPdfSections({ ...pdfSections, [s.key]: e.target.checked })}
                    className="mt-1 accent-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="text-emerald-300 font-semibold text-sm">{s.label}</div>
                    <div className="text-purple-300 text-xs mt-0.5">{s.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3 mb-4">
              <p className="text-emerald-200 text-xs">
                <strong>⚠ Eslatma:</strong> PDF Unicode belgilar uchun{" "}
                <code className="bg-purple-950 px-1 rounded">/public/fonts/</code> papkasida DejaVuSans*.ttf kerak.
                Kutilgan hajm: ~7-9 sahifa A4 (ikkala izomer).
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPdfModalOpen(false)}
                className="flex-1 py-3 rounded-lg border border-purple-500 text-purple-300 hover:bg-purple-800/40 transition-colors text-sm"
              >
                Bekor qilish
              </button>
              <button
                onClick={generatePDF}
                disabled={pdfGenerating || !Object.values(pdfSections).some(v => v)}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-violet-600 hover:from-emerald-500 hover:to-violet-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {pdfGenerating ? "⏳ Yaratilmoqda..." : "📥 PDF ni yuklab olish"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -ml-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4 relative">
            <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-violet-600/20 text-violet-400 border border-violet-600/30 px-3 py-1 rounded-full text-xs">Sis: C₂ᵥ</span>
            <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-3 py-1 rounded-full text-xs">Trans: D₄ₕ</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">2 ta ichki Cl⁻</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">1:1 elektrolit</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4 flex-wrap relative">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              [Co(NH₃)₄Cl₂]Cl
            </h2>
            <span className="text-purple-400 text-lg">233.40 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4 relative">
            tetraammindiklorokobalt(III) xlorid — <span className="text-violet-400 italic">sis: «Violeo»</span> / <span className="text-emerald-400 italic">trans: «Praseo»</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6 relative">
            <strong className="text-emerald-400">Geometrik izomeriyaning klassik namunasi.</strong> Ikkita bir xil ligand (Cl⁻) oktaedrik kompleksda
            ikki xil joylashishi mumkin: <strong className="text-violet-300">sis</strong> (90°, qo'shni) yoki <strong className="text-emerald-300">trans</strong> (180°, qarama-qarshi).
            IQ spektroskopiya bu izomerlarni farqlashning <strong className="text-yellow-300">ENG OSON va ENG ISHONCHLI</strong> usulidir:
            sis izomerda ν(Co–Cl) sohasida <strong className="text-violet-300">2 ta polosa</strong> (330, 310 cm⁻¹),
            trans izomerda esa <strong className="text-emerald-300">faqat 1 ta</strong> (355 cm⁻¹) — mutual exclusion qoidasi tufayli.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
            <div className="bg-violet-900/30 rounded-xl p-4 text-center border border-violet-700/40">
              <div className="text-violet-400 text-xs mb-1">SIS ν(Co-Cl)</div>
              <div className="text-white font-bold">2 ta: 330, 310</div>
            </div>
            <div className="bg-emerald-900/30 rounded-xl p-4 text-center border border-emerald-700/40">
              <div className="text-emerald-400 text-xs mb-1">TRANS ν(Co-Cl)</div>
              <div className="text-white font-bold">1 ta: 355</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Optik faollik</div>
              <div className="text-white font-bold text-sm">sis ✓ / trans ✗</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">AgNO₃ tajribasi</div>
              <div className="text-white font-bold">1 × AgCl↓</div>
            </div>
          </div>
        </div>

        {/* ═══ ASOSIY DIAGNOSTIKA KARTASI ═══ */}
        <div className="bg-gradient-to-r from-violet-900/30 to-emerald-900/30 border-2 border-yellow-500/40 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <span className="text-3xl">🏆</span> ASOSIY DIAGNOSTIKA: ν(Co–Cl) polosalari soni
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SIS */}
            <div className="bg-violet-950/50 border-2 border-violet-500/50 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-violet-400 mb-2">2</div>
                <div className="text-violet-300 font-bold text-lg">SIS izomer (Violeo)</div>
                <div className="text-purple-400 text-sm">C₂ᵥ — inversiya markazi YO'Q</div>
              </div>
              <div className="space-y-2">
                <div className="bg-violet-900/40 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-purple-300 text-sm">νₐₛ(Co-Cl) — B₁</span>
                  <span className="text-violet-300 font-mono font-bold">330 cm⁻¹</span>
                </div>
                <div className="bg-violet-900/40 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-purple-300 text-sm">νₛ(Co-Cl) — A₁</span>
                  <span className="text-violet-300 font-mono font-bold">310 cm⁻¹</span>
                </div>
              </div>
              <p className="text-purple-200 text-xs mt-3 leading-relaxed">
                Mutual exclusion ishlamaydi → <strong className="text-violet-300">ikkala moda ham IQ faol</strong>.
                2 ta Cl⁻ 90° burchakda — simmetrik va asimmetrik cho'zilishlar ajratiladi.
              </p>
            </div>

            {/* TRANS */}
            <div className="bg-emerald-950/50 border-2 border-emerald-500/50 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-emerald-400 mb-2">1</div>
                <div className="text-emerald-300 font-bold text-lg">TRANS izomer (Praseo)</div>
                <div className="text-purple-400 text-sm">D₄ₕ — inversiya markazi MAVJUD</div>
              </div>
              <div className="space-y-2">
                <div className="bg-emerald-900/40 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-purple-300 text-sm">νₐₛ(Co-Cl) — A₂ᵤ</span>
                  <span className="text-emerald-300 font-mono font-bold">355 cm⁻¹</span>
                </div>
                <div className="bg-red-900/30 border border-red-700/40 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-red-300 text-sm">νₛ(Co-Cl) — A₁g</span>
                  <span className="text-red-400 font-mono font-bold text-xs">IQ da YO'Q</span>
                </div>
              </div>
              <p className="text-purple-200 text-xs mt-3 leading-relaxed">
                Mutual exclusion ISHLAYDI → <strong className="text-emerald-300">A₁g gerade faqat Ramanda</strong> (322 cm⁻¹).
                IQ da faqat A₂ᵤ ungerade ko'rinadi.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-200 text-sm">
              <strong className="text-yellow-300">💡 Amaliy qoida:</strong> CsI tabletka bilan 400–200 cm⁻¹ sohasini o'lchang.
              Agar 2 ta polosa ko'rsangiz — <strong className="text-violet-300">SIS</strong>, 1 ta ko'rsangiz — <strong className="text-emerald-300">TRANS</strong>.
              Bu 15 daqiqada aniq javob beradi va boshqa hech qanday usul bunchalik tez emas.
            </p>
          </div>
        </div>

        {/* IZOMER TANLASH VA INTERAKTIV SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈</span> Interaktiv IQ spektri — izomerni tanlang
          </h2>

          {/* Izomer tanlash tugmalari */}
          <div className="flex gap-3">
            <button
              onClick={() => { setActiveIsomer("cis"); setFreqSlider(330) }}
              className={`flex-1 py-4 rounded-xl font-bold transition-all border-2 ${
                activeIsomer === "cis"
                  ? "bg-violet-600/40 border-violet-400 text-violet-200 shadow-lg shadow-violet-500/20"
                  : "bg-purple-950/40 border-purple-700/40 text-purple-400 hover:border-violet-500/60"
              }`}
            >
              <div className="text-lg">SIS izomer</div>
              <div className="text-xs opacity-80 mt-1">Violeo • C₂ᵥ • 2 ta ν(Co-Cl)</div>
            </button>
            <button
              onClick={() => { setActiveIsomer("trans"); setFreqSlider(355) }}
              className={`flex-1 py-4 rounded-xl font-bold transition-all border-2 ${
                activeIsomer === "trans"
                  ? "bg-emerald-600/40 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20"
                  : "bg-purple-950/40 border-purple-700/40 text-purple-400 hover:border-emerald-500/60"
              }`}
            >
              <div className="text-lg">TRANS izomer</div>
              <div className="text-xs opacity-80 mt-1">Praseo • D₄ₕ • 1 ta ν(Co-Cl)</div>
            </button>
          </div>

          {/* Slayder */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <label className={`block font-bold mb-2 ${activeIsomer === "cis" ? "text-violet-400" : "text-emerald-400"}`}>
              To'lqin soni: <span className="font-mono text-2xl">{freqSlider}</span> cm⁻¹
            </label>
            <input
              type="range" min="200" max="4000" value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className={`w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer ${activeIsomer === "cis" ? "accent-violet-500" : "accent-emerald-500"}`}
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>200 (Co-Cl)</span><span>1000</span><span>2000</span><span>3000</span><span>4000 (N-H)</span>
            </div>
          </div>

          {/* Joriy cho'qqi */}
          <div className={`bg-gradient-to-r rounded-xl p-5 border-2 ${
            activeIsomer === "cis"
              ? "from-violet-900/30 to-purple-900/30 border-violet-500/40"
              : "from-emerald-900/30 to-purple-900/30 border-emerald-500/40"
          }`}>
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
              <div>
                <span className="text-xs text-purple-400 uppercase">Eng yaqin cho'qqi:</span>
                <div className={`text-3xl font-mono font-bold ${activeIsomer === "cis" ? "text-violet-400" : "text-emerald-400"}`}>
                  {currentPeak.freq ? `${currentPeak.freq} cm⁻¹` : "IQ da yo'q"}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-purple-400 uppercase">Izomer:</span>
                <div className="text-sm text-cyan-300 font-semibold">
                  {activeIsomer === "cis" ? "SIS (Violeo, C₂ᵥ)" : "TRANS (Praseo, D₄ₕ)"}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">Tayinlash</div>
                <div className={`font-mono font-bold text-sm ${activeIsomer === "cis" ? "text-violet-300" : "text-emerald-300"}`}>{currentPeak.assignment}</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">O'tkazuvchanlik</div>
                <div className="text-white font-mono font-bold text-sm">{currentPeak.T !== null && currentPeak.T !== undefined ? `${currentPeak.T}%` : "—"}</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">Simmetriya</div>
                <div className="text-cyan-300 font-mono font-bold text-sm">{currentPeak.symmetry?.split(" — ")[0]}</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">Kuch konst.</div>
                <div className="text-orange-300 font-mono font-bold text-sm">{currentPeak.forceConstant}</div>
              </div>
            </div>
            <div className="bg-purple-950/60 rounded-lg p-4 mb-3">
              <div className={`font-bold text-sm mb-2 flex items-center gap-2 ${activeIsomer === "cis" ? "text-violet-400" : "text-emerald-400"}`}>
                <span>📚</span> Nazariy izoh:
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">{currentPeak.theoryNote}</p>
            </div>
            {currentPeak.diagnostic && (
              <div className={`rounded p-3 border ${
                activeIsomer === "cis" ? "bg-violet-600/20 border-violet-500/40" : "bg-emerald-600/20 border-emerald-500/40"
              }`}>
                <p className={`text-xs font-semibold ${activeIsomer === "cis" ? "text-violet-200" : "text-emerald-200"}`}>💎 {currentPeak.diagnostic}</p>
              </div>
            )}
          </div>

          {/* SVG SPEKTR */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <div className="text-xs text-purple-400 mb-2 flex items-center justify-between">
              <span>{activeIsomer === "cis" ? "SIS izomer (Violeo)" : "TRANS izomer (Praseo)"} — CsI simulyatsiya</span>
              <span className="font-mono">4000 — 200 cm⁻¹</span>
            </div>
            <svg viewBox="0 0 800 320" className="w-full h-auto">
              {[0, 20, 40, 60, 80, 100].map((v, i) => {
                const gy = 250 - (v / 100) * 220
                return (
                  <g key={i}>
                    <line x1="60" y1={gy} x2="770" y2={gy} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x="52" y={gy + 3} textAnchor="end" fontSize="9" fill="#a78bfa">{v}</text>
                  </g>
                )
              })}
              <text x="20" y="140" textAnchor="middle" fontSize="11" fill={activeIsomer === "cis" ? "#c4b5fd" : "#6ee7b7"} transform="rotate(-90, 20, 140)" fontWeight="bold">T (%)</text>

              {[4000, 3500, 3000, 2500, 2000, 1500, 1000, 500, 200].map((f, i) => {
                const gx = 60 + ((4000 - f) / 3800) * 710
                return (
                  <g key={i}>
                    <line x1={gx} y1="30" x2={gx} y2="250" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={gx} y="275" textAnchor="middle" fontSize="9" fill="#a78bfa">{f}</text>
                  </g>
                )
              })}
              <text x="415" y="295" textAnchor="middle" fontSize="11" fill={activeIsomer === "cis" ? "#c4b5fd" : "#6ee7b7"} fontWeight="bold">To'lqin soni (cm⁻¹)</text>

              {/* Co-Cl zonasi urg'u */}
              <rect x={60 + ((4000 - 380) / 3800) * 710} y="30" width={((380 - 280) / 3800) * 710} height="220"
                fill={activeIsomer === "cis" ? "#8b5cf6" : "#10b981"} opacity="0.12" />
              <text x={60 + ((4000 - 330) / 3800) * 710} y="45" fontSize="8"
                fill={activeIsomer === "cis" ? "#c4b5fd" : "#6ee7b7"} textAnchor="middle" fontWeight="bold">🏆 ν(Co-Cl)</text>

              {/* Spektr chizig'i */}
              <polyline
                fill="none" stroke={activeIsomer === "cis" ? "#a78bfa" : "#4ade80"} strokeWidth="2"
                points={(() => {
                  const pts = []
                  for (let f = 4000; f >= 200; f -= 10) {
                    let T = 1.0
                    currentPeaks.forEach(p => {
                      if (!p.freq || p.absorbance === null || p.absorbance === undefined) return
                      const sigma = p.freq > 2000 ? 25 : p.freq > 1000 ? 20 : 12
                      T -= p.absorbance * Math.exp(-Math.pow(f - p.freq, 2) / (2 * sigma * sigma))
                    })
                    T = Math.max(T, 0.02)
                    pts.push(`${60 + ((4000 - f) / 3800) * 710},${250 - T * 220}`)
                  }
                  return pts.join(" ")
                })()}
              />

              {/* Slayder markeri */}
              <line
                x1={60 + ((4000 - freqSlider) / 3800) * 710} y1="30"
                x2={60 + ((4000 - freqSlider) / 3800) * 710} y2="250"
                stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,2"
              />

              {currentPeaks.map((peak, i) => {
                if (!peak.freq || peak.absorbance === null || peak.absorbance === undefined) return null
                const x = 60 + ((4000 - peak.freq) / 3800) * 710
                const y = 250 - (1 - peak.T / 100) * 220
                const isActive = currentPeak.freq === peak.freq
                const isCoCl = peak.freq === 330 || peak.freq === 310 || peak.freq === 355
                return (
                  <g key={i} onClick={() => { setActivePeak(i); setFreqSlider(peak.freq) }} className="cursor-pointer">
                    <circle cx={x} cy={y} r={isActive ? 9 : (isCoCl ? 7 : 5)}
                      fill={isCoCl ? (activeIsomer === "cis" ? "#8b5cf6" : "#10b981") : (isActive ? "#fbbf24" : "#4ade80")}
                      stroke="#fff" strokeWidth="1.5" />
                    {isActive && (
                      <>
                        <line x1={x} y1={y} x2={x} y2={y - 25} stroke="#fbbf24" strokeWidth="1" strokeDasharray="1,1" />
                        <rect x={x - 42} y={y - 52} width="84" height="24" rx="3" fill="#1e1a3a" stroke="#fbbf24" strokeWidth="1" />
                        <text x={x} y={y - 40} textAnchor="middle" fontSize="8" fill="#fbbf24" fontWeight="bold">{peak.freq} cm⁻¹</text>
                        <text x={x} y={y - 32} textAnchor="middle" fontSize="7" fill="#a78bfa">{peak.assignment}</text>
                      </>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Cho'qqi tugmalari */}
          <div className="flex flex-wrap gap-2">
            {currentPeaks.map((p, i) => {
              const isCoCl = p.freq === 330 || p.freq === 310 || p.freq === 355
              const isNoIR = p.intensityCode === 0
              return (
                <button key={i} onClick={() => p.freq && setFreqSlider(p.freq)}
                  disabled={!p.freq}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                    isNoIR
                      ? 'border-red-500/40 bg-red-950/30 text-red-400 cursor-not-allowed'
                      : currentPeak.freq === p.freq
                        ? (activeIsomer === "cis" ? 'border-violet-400 bg-violet-900/40' : 'border-emerald-400 bg-emerald-900/40')
                        : isCoCl
                          ? (activeIsomer === "cis" ? 'border-violet-500/60 bg-violet-950/30' : 'border-emerald-500/60 bg-emerald-950/30')
                          : 'border-green-400/40 bg-green-900/10 hover:border-yellow-400/60'
                  }`}>
                  <span className="font-mono font-bold">{p.freq || "—"}</span>
                  <span className="text-purple-400">{p.assignment}</span>
                  {isCoCl && <span>🏆</span>}
                  {isNoIR && <span>🚫</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* CHO'QQILAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📊</span> Cho'qqilar jadvali — {activeIsomer === "cis" ? "SIS (Violeo)" : "TRANS (Praseo)"}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">ν̃ (cm⁻¹)</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Tayinlash</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Tavsif</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">T%</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Simmetriya</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">k</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Intensivlik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {currentPeaks.map((p, i) => {
                  const isCoCl = p.freq === 330 || p.freq === 310 || p.freq === 355
                  const isNoIR = p.intensityCode === 0
                  return (
                    <tr key={i} onClick={() => p.freq && setFreqSlider(p.freq)}
                      className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer transition-colors ${
                        isNoIR ? "bg-red-950/20" : (currentPeak.freq === p.freq
                          ? (activeIsomer === "cis" ? "bg-violet-900/20" : "bg-emerald-900/20")
                          : (isCoCl ? (activeIsomer === "cis" ? "bg-violet-950/30" : "bg-emerald-950/30") : ""))
                      }`}>
                      <td className={`py-3 px-3 font-mono font-bold ${
                        isNoIR ? "text-red-400" : (isCoCl ? (activeIsomer === "cis" ? "text-violet-400" : "text-emerald-400") : "text-yellow-400")
                      }`}>
                        {p.freq || "—"}{isCoCl && " 🏆"}{isNoIR && " 🚫"}
                      </td>
                      <td className="py-3 px-3 font-mono text-cyan-300">{p.assignment}</td>
                      <td className="py-3 px-3 text-xs">{p.assignment_uz}</td>
                      <td className="py-3 px-3 font-mono">{p.T !== null && p.T !== undefined ? `${p.T}%` : "—"}</td>
                      <td className="py-3 px-3 font-mono text-purple-300 text-xs">{p.symmetry?.split(" — ")[0]}</td>
                      <td className="py-3 px-3 font-mono text-orange-300 text-xs">{p.forceConstant}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          p.intensityCode === 0 ? "bg-red-600/40 text-red-300" :
                          p.intensityCode === 4 ? "bg-red-600/40 text-red-300" :
                          p.intensityCode === 3 ? "bg-orange-600/40 text-orange-300" :
                          p.intensityCode === 2 ? "bg-yellow-600/40 text-yellow-300" :
                          "bg-green-600/40 text-green-300"
                        }`}>{p.intensity}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {activeIsomer === "trans" && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-200 text-sm">
                <strong className="text-red-300">🚫 Qizil qatorlar:</strong> Mutual exclusion tufayli IQ da KO'RINMAYDIGAN polosalar.
                Trans izomer D₄ₕ simmetriyaga ega (inversiya markazi bor) → gerade (g) modalar faqat Raman spektroskopiyada faol.
                ν(Co-Cl) simmetrik cho'zilishi A₁g → Ramanda 322 cm⁻¹ da ko'rinadi.
              </p>
            </div>
          )}
        </div>

        {/* SIS/TRANS TO'LIQ TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚖️</span> Sis va Trans izomerlar — to'liq taqqoslash
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Xususiyat</th>
                  <th className="py-3 px-3 text-violet-300 text-xs uppercase bg-violet-950/40">SIS (Violeo)</th>
                  <th className="py-3 px-3 text-emerald-300 text-xs uppercase bg-emerald-950/40">TRANS (Praseo)</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["An'anaviy nom", "Violeo (binafsha-yashil)", "Praseo (yashil)"],
                  ["Cl⁻ joylashuvi", "90° — qo'shni", "180° — qarama-qarshi"],
                  ["Simmetriya", "C₂ᵥ (4-tartib)", "D₄ₕ (16-tartib)"],
                  ["Inversiya markazi (i)", "YO'Q", "MAVJUD"],
                  ["Mutual exclusion", "Ishlamaydi", "ISHLAYDI"],
                  ["Optik faollik", "MAVJUD (Δ/Λ)", "YO'Q (meso)"],
                  ["ν(Co-Cl) IQ da", "2 ta: 330, 310 cm⁻¹", "1 ta: 355 cm⁻¹"],
                  ["ν(Co-Cl) Raman", "Ikkalasi ham (IQ bilan bir xil)", "1 ta: 322 cm⁻¹ (IQ dan farqli)"],
                  ["ν(Co-N) IQ", "3 modasi (A₁+B₁+B₂)", "1 ta (Eᵤ) — 4 ta ekvivalent"],
                  ["UV-Vis λmax", "~535 nm", "~625 nm"],
                  ["Kristall tizim", "Monoklinik P2₁/c", "Tetragonal P4/mmm"],
                  ["Sintez sharoiti", "Sovuq HCl da", "Issiq/kons. HCl da"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-3 font-semibold text-purple-300">{row[0]}</td>
                    <td className="py-3 px-3 text-violet-200 bg-violet-950/20">{row[1]}</td>
                    <td className="py-3 px-3 text-emerald-200 bg-emerald-950/20">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-200 text-sm">
              <strong className="text-yellow-300">📜 Tarixiy jihat:</strong> Sofus Mads Jorgensen (1889) bu ikki izomerni birinchi bo'lib ajratgan va
              rangi bo'yicha nomlagan: <em className="text-violet-300">Violeo</em> (binafsha) va <em className="text-emerald-300">Praseo</em> (yashil, yunoncha «prasinos»).
              Alfred Werner (1893) esa ularning strukturaviy asosini — oktaedrik koordinatsiyani — nazariy jihatdan tushuntirgan.
              IQ spektroskopiya 1950-yillarda Nakamoto tomonidan bu farqni bevosita eksperimental isbotlagan.
            </p>
          </div>
        </div>

        {/* GURUH NAZARIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔷</span> Guruh nazariyasi — C₂ᵥ vs D₄ₕ
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-violet-950/30 rounded-xl p-5 border border-violet-700/40">
              <h3 className="text-violet-300 font-bold mb-3 text-lg">SIS — C₂ᵥ (4-tartib)</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-purple-950/60 rounded p-2">
                  <span className="text-cyan-300 text-xs font-bold uppercase">Operatsiyalar: </span>
                  <span className="font-mono text-purple-200">E, C₂, σᵥ, σᵥ'</span>
                </div>
                <div className="bg-purple-950/60 rounded p-2">
                  <span className="text-cyan-300 text-xs font-bold uppercase">ν(Co-Cl): </span>
                  <span className="font-mono text-violet-300">A₁ (310) + B₁ (330) — IKKALASI IQ faol</span>
                </div>
                <div className="bg-purple-950/60 rounded p-2">
                  <span className="text-cyan-300 text-xs font-bold uppercase">ν(Co-N): </span>
                  <span className="font-mono text-purple-200">A₁ + B₁ + B₂ (3 ta)</span>
                </div>
                <div className="bg-purple-950/60 rounded p-2">
                  <span className="text-cyan-300 text-xs font-bold uppercase">Inversiya: </span>
                  <span className="text-red-400 font-bold">YO'Q → mutual exclusion ishlamaydi</span>
                </div>
              </div>
              <p className="text-purple-200 text-xs mt-3 leading-relaxed">
                Inversiya markazi bo'lmagani uchun barcha simmetriyaviy ruxsat etilgan modalar IQ va Ramanda birga faol.
                Shuning uchun 2 ta Co-Cl cho'zilish polosasi IQ da ayrim-ayrim ko'rinadi.
              </p>
            </div>

            <div className="bg-emerald-950/30 rounded-xl p-5 border border-emerald-700/40">
              <h3 className="text-emerald-300 font-bold mb-3 text-lg">TRANS — D₄ₕ (16-tartib)</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-purple-950/60 rounded p-2">
                  <span className="text-cyan-300 text-xs font-bold uppercase">Operatsiyalar: </span>
                  <span className="font-mono text-purple-200 text-xs">E, 2C₄, C₂, 2C₂', 2C₂'', i, 2S₄, σₕ, 2σᵥ, 2σd</span>
                </div>
                <div className="bg-purple-950/60 rounded p-2">
                  <span className="text-cyan-300 text-xs font-bold uppercase">ν(Co-Cl): </span>
                  <span className="font-mono text-emerald-300">A₂ᵤ (355, IQ) + A₁g (322, faqat Raman)</span>
                </div>
                <div className="bg-purple-950/60 rounded p-2">
                  <span className="text-cyan-300 text-xs font-bold uppercase">ν(Co-N): </span>
                  <span className="font-mono text-purple-200">Eᵤ (IQ) + A₁g, B₁g (Raman)</span>
                </div>
                <div className="bg-purple-950/60 rounded p-2">
                  <span className="text-cyan-300 text-xs font-bold uppercase">Inversiya: </span>
                  <span className="text-green-400 font-bold">MAVJUD → mutual exclusion ISHLAYDI</span>
                </div>
              </div>
              <p className="text-purple-200 text-xs mt-3 leading-relaxed">
                Inversiya markazi tufayli gerade (g) modalar faqat Ramanda, ungerade (u) faqat IQ da faol.
                Shuning uchun IQ da faqat 1 ta Co-Cl polosasi (A₂ᵤ) ko'rinadi.
              </p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">⚡ Mutual exclusion qoidasi:</strong> Agar molekulada inversiya markazi (i) mavjud bo'lsa,
              gerade (g) simmetriya modalari faqat Raman spektroskopiyada, ungerade (u) esa faqat IQ da faol bo'ladi.
              Hech qanday moda bir vaqtda ikkala spektrda ko'rinmaydi. Bu qoida trans izomerni (D₄ₕ) sis izomerdan (C₂ᵥ)
              ajratishning nazariy asosidir — chunki C₂ᵥ da inversiya markazi yo'q.
            </p>
          </div>
        </div>

        {/* FARQLASH USULLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔬</span> Sis/Trans farqlash usullari — solishtirish
          </h2>
          <p className="text-purple-200 text-sm">
            Geometrik izomerlarni ajratishning 7 ta usuli. IQ spektroskopiya eng tez va oson — 15-20 daqiqada natija.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Usul</th>
                  <th className="py-3 px-3 text-violet-300 text-xs uppercase">Sis natijasi</th>
                  <th className="py-3 px-3 text-emerald-300 text-xs uppercase">Trans natijasi</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Ishonchlilik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {cisTransDiagnostics.map((d, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${i === 0 ? "bg-yellow-900/20" : ""}`}>
                    <td className={`py-3 px-3 font-semibold ${i === 0 ? "text-yellow-300" : "text-cyan-300"}`}>{d.method}</td>
                    <td className="py-3 px-3 text-xs text-violet-200">{d.cisResult}</td>
                    <td className="py-3 px-3 text-xs text-emerald-200">{d.transResult}</td>
                    <td className="py-3 px-3 text-xs">{d.reliability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
            <p className="text-green-200 text-sm">
              <strong className="text-green-300">🎯 Amaliy strategiya:</strong>
              <br />1️⃣ CsI tabletka tayyorlang va 400–200 cm⁻¹ sohasini o'lchang
              <br />2️⃣ ν(Co-Cl) polosalari sonini sanang — <strong className="text-violet-300">2 ta = SIS</strong>, <strong className="text-emerald-300">1 ta = TRANS</strong>
              <br />3️⃣ UV-Vis bilan tasdiqlang (~535 nm sis vs ~625 nm trans)
              <br />4️⃣ Shubha bo'lsa CD spektroskopiya (sis optik faol) yoki XRD ishlating
            </p>
          </div>
        </div>

        {/* KUCH KONSTANTASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💪</span> Kuch konstantasi va Hooke qonuni
          </h2>
          <p className="text-purple-200 text-sm">
            Trans izomerda 2 ta Cl⁻ bir-birining trans-holatida — bog' qisqaroq va mustahkamroq (k = 1.52 mdyn/Å).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Bog'</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">k (mdyn/Å)</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">ν̃ (cm⁻¹)</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {forceConstantExamples.map((f, i) => {
                  const isSis = f.bond.includes("(sis")
                  const isTrans = f.bond.includes("(trans")
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${
                      isSis ? "bg-violet-900/20" : (isTrans ? "bg-emerald-900/20" : "")
                    }`}>
                      <td className={`py-3 px-4 font-mono ${isSis ? "text-violet-300 font-bold" : (isTrans ? "text-emerald-300 font-bold" : "text-cyan-300")}`}>{f.bond}</td>
                      <td className="py-3 px-4 font-mono text-orange-300">{f.k}</td>
                      <td className="py-3 px-4 font-mono text-yellow-400">{f.freq}</td>
                      <td className="py-3 px-4 text-xs">{f.note}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-200 text-sm">
              <strong className="text-orange-300">Kuch konstantalari qatori:</strong> k(trans) = 1.52 &gt; k(sis, νₐₛ) = 1.44 &gt; k(sis, νₛ) = 1.38 mdyn/Å.
              Hooke qonuni ν̃ = (1/2πc)·√(k/μ) bo'yicha bu farq chastotalarda aks etadi: 355 &gt; 330 &gt; 310 cm⁻¹.
              Trans izomerda 2 ta Cl⁻ bir-birining trans-effektini o'zaro kuchaytiradi.
            </p>
          </div>
        </div>

        {/* WERNER QATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📜</span> Werner koordinatsion qatori
          </h2>
          <p className="text-purple-200 leading-relaxed">
            Bu birikma Werner qatorida UCHINCHI o'rinni egallaydi — 2 ta Cl⁻ ichki sferada. AgNO₃ tajribasida faqat 1 ta Cl⁻ cho'kadi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Kompleks</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">An'anaviy nom</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Simm.</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">ν(Co-N)</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">ν(Co-Cl)</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">AgNO₃</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {wernerSeries.map((w, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${
                    w.current ? (w.isomer === "cis" ? "bg-violet-900/30" : "bg-emerald-900/30") : ""
                  }`}>
                    <td className={`py-3 px-3 font-mono text-xs ${
                      w.current ? (w.isomer === "cis" ? "font-bold text-violet-400" : "font-bold text-emerald-400") : "text-cyan-300"
                    }`}>{w.formula}</td>
                    <td className="py-3 px-3 text-xs">{w.trad}</td>
                    <td className="py-3 px-3 font-mono text-purple-300 text-xs">{w.sym}</td>
                    <td className="py-3 px-3 font-mono text-orange-300 text-xs">{w.nuCoN}</td>
                    <td className="py-3 px-3 font-mono text-xs">
                      {w.nuCoCl === "—" ? <span className="text-red-400">YO'Q</span> : (
                        <span className={w.current ? (w.isomer === "cis" ? "text-violet-300 font-bold" : "text-emerald-300 font-bold") : "text-pink-300"}>{w.nuCoCl}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-red-400 font-bold text-xs">{w.agCl} × AgCl↓</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
            <p className="text-purple-200 text-sm">
              <strong className="text-purple-300">📊 ν(Co-Cl) polosalari evolyutsiyasi:</strong> Luteo (0 ichki Cl) — YO'Q →
              Purpureo (1 ichki Cl) — 1 ta (328) → sis-Violeo (2 ichki Cl) — <strong className="text-violet-300">2 ta (330, 310)</strong> →
              trans-Praseo (2 ichki Cl) — <strong className="text-emerald-300">1 ta (355)</strong>.
              IQ spektri Werner nazariyasini ham (ichki sfera) ham geometrik izomeriyani ham (sis vs trans) bir vaqtda tasdiqlaydi.
            </p>
          </div>
        </div>

        {/* NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧪</span> Namuna tayyorlash — sis/trans tahlili uchun
          </h2>
          <p className="text-purple-200 text-sm">
            <strong className="text-emerald-400">CsI tabletka MAJBURIY</strong> — ν(Co-Cl) 310-355 cm⁻¹ sohasida, KBr esa 400 cm⁻¹ da shaffofligini yo'qotadi.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {techniques.map((t, i) => {
              const isRec = t.name.includes("CsI")
              return (
                <button key={i} onClick={() => setActiveTechnique(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                    activeTechnique === i
                      ? "bg-emerald-600/60 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/20"
                      : "bg-purple-800/30 text-purple-400 border-purple-700/50 hover:bg-purple-700/40"
                  }`}>
                  {t.name}{isRec && <span className="ml-1 text-yellow-300">★</span>}
                </button>
              )
            })}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
              <h3 className="text-emerald-400 font-bold text-lg">{techniques[activeTechnique].name}</h3>
              {techniques[activeTechnique].name.includes("CsI") && (
                <span className="text-yellow-300 text-xs bg-yellow-900/30 border border-yellow-700/30 px-3 py-1 rounded-full">★ MAJBURIY</span>
              )}
            </div>
            <p className="text-purple-200 text-sm mb-4 italic">{techniques[activeTechnique].description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2 text-sm">✓ Afzalliklar</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {techniques[activeTechnique].advantages.map((a, i) => <li key={i}>• {a}</li>)}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2 text-sm">✗ Kamchiliklar</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {techniques[activeTechnique].disadvantages.map((d, i) => <li key={i}>• {d}</li>)}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">Chastota</div>
                <div className="text-white text-xs font-mono mt-1">{techniques[activeTechnique].freqRange}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">Ruxsat</div>
                <div className="text-white text-xs font-mono mt-1">{techniques[activeTechnique].resolution}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">Vaqt</div>
                <div className="text-white text-xs mt-1">{techniques[activeTechnique].samplePrep}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">Eng yaxshi</div>
                <div className="text-white text-xs mt-1">{techniques[activeTechnique].bestFor}</div>
              </div>
            </div>
          </div>
        </div>

        {/* HALAQIT OMILLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚠️</span> Halaqit omillari — izomerlar uchun xos
          </h2>
          <p className="text-purple-200 text-sm">
            Bu birikma bilan ishlashda 2 ta o'ziga xos muammo: sis/trans aralashmasi va sis→trans izomerlanishi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Manba</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">ν̃ oralig'i</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Ta'sir</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Jiddiylik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {interferences.map((iv, i) => (
                  <tr key={i} onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${activeInterference === i ? "bg-emerald-900/20" : ""}`}>
                    <td className="py-3 px-4 font-bold text-xs">{iv.source}</td>
                    <td className="py-3 px-4 font-mono text-cyan-300 text-xs">{iv.freqRange}</td>
                    <td className="py-3 px-4 text-xs">{iv.effect}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        iv.severity === "Yuqori" ? "bg-red-600/40 text-red-300" :
                        iv.severity === "O'rta" ? "bg-orange-600/40 text-orange-300" :
                        "bg-green-600/40 text-green-300"
                      }`}>{iv.severity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-5">
            <div className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>💡</span> Yechim: {interferences[activeInterference].source}
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">{interferences[activeInterference].solution}</p>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-violet-600/10 to-emerald-600/10 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✅</span> Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li className="pl-2"><strong className="text-yellow-400">ν(Co-Cl) polosalari soni</strong> — sis/trans farqlashning eng oson usuli: sis 2 ta (330, 310), trans 1 ta (355 cm⁻¹).</li>
            <li className="pl-2"><strong className="text-emerald-400">Mutual exclusion qoidasi</strong> — trans izomer D₄ₕ (i markazi bor) → A₁g gerade IQ da ko'rinmaydi (faqat Raman 322 cm⁻¹).</li>
            <li className="pl-2"><strong className="text-violet-400">Sis izomer C₂ᵥ</strong> — inversiya markazi yo'q → barcha modalar IQ va Raman ikkalasida faol.</li>
            <li className="pl-2">Kuch konstantalari: k(trans) = 1.52 &gt; k(sis νₐₛ) = 1.44 &gt; k(sis νₛ) = 1.38 mdyn/Å — Hooke qonuni bilan izohlanadi.</li>
            <li className="pl-2"><strong className="text-pink-400">Optik faollik:</strong> sis izomer Δ/Λ enantiomerlariga ega, trans izomer meso (optik faol emas).</li>
            <li className="pl-2"><strong className="text-yellow-400">CsI tabletka MAJBURIY</strong> — KBr 400 cm⁻¹ da, ATR 650 cm⁻¹ da tugaydi. ν(Co-Cl) ko'rinmaydi.</li>
            <li className="pl-2">Jorgensen (1889) rangi bo'yicha ajratgan (Violeo/Praseo), Werner (1893) strukturasini tushuntirgan, IQ esa miqdoriy isbotlaydi.</li>
            <li className="pl-2">AgNO₃, konduktometriya va molyar o'tkazuvchanlik ikkala izomer uchun BIR XIL — faqat IQ/CD/XRD ularni ajratadi.</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-nh3-5-cl-cl2" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← [Co(NH₃)₅Cl]Cl₂ (Purpureo)
          </Link>
          <button onClick={() => setPdfModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-violet-600 hover:from-emerald-500 hover:to-violet-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
            📄 PDF Hisobot yaratish
          </button>
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 bg-emerald-600/80 rounded-xl hover:bg-emerald-500 text-white font-semibold transition-all">
            Keyingi birikma →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA-Kimyo • [Co(NH₃)₄Cl₂]Cl (Violeo/Praseo) • IQ spektroskopiya moduli (premium)</p>
          <p className="mt-2 text-purple-600">
            Manbalar: Nakamoto K. — Infrared and Raman Spectra (6-nashr, 2009); Cotton F. A. — Chemical Applications of Group Theory;
            Jorgensen S. M. (1889); Werner A. (1893, Nobel 1913)
          </p>
        </div>
      </footer>
    </main>
  )
}
