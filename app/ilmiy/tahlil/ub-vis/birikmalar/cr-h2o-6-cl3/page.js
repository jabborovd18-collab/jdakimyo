"use client"

import Link from "next/link"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"
import { useState, useMemo, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Cr(H₂O)₆]Cl₃ — UB-VIS SPEKTROSKOPIYA (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar:
//   • A. B. P. Lever — Inorganic Electronic Spectroscopy (2nd ed., Elsevier, 1984)
//   • Y. Tanabe, S. Sugano — J. Phys. Soc. Japan 9, 753 (1954)
//   • H. Bethe — Ann. Physik 3, 133 (1929) — Crystal Field Theory
//   • J. H. Van Vleck — J. Chem. Phys. 3, 807 (1935) — Ligand Field Theory
//   • G. Racah — Phys. Rev. 62, 438 (1942)
//   • C. K. Jørgensen — Absorption Spectra and Chemical Bonding (Pergamon, 1962)
//   • Housecroft & Sharpe — Inorganic Chemistry (4th ed., Pearson, 2012)
//   • F. A. Cotton — Chemical Applications of Group Theory (3rd ed., Wiley, 1990)
// Til: 100% o'zbek (lotin)
// Xususiyat: TO'LIQ nazariy tahlil, interaktiv spektr, Tanabe-Sugano, PDF eksport
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Cr(H<sub>2</sub>O)<sub>6</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Cr(H2O)6]Cl3",
  formulaCation: "[Cr(H<sub>2</sub>O)<sub>6</sub>]<sup>3+</sup>",
  iupac: "Geksaakvaxrom(III) xlorid",
  commonName: "Xrom(III) geksaakva (binafsha)",
  historicalName: "Klassik Werner kompleksi (1893)",
  molarMass: 266.45,
  casNumber: "10060-12-5",
  color: "binafsha (violet)",
  colorHex: "#8B5FBF",
  absorbedHex: "#ADFF2F",
  structure: "Oktaedr (Oₕ simmetriya)",
  metalCenter: "Cr³⁺",
  dConfig: "d³",
  spinState: "Yuqori spin (S = 3/2)",
  groundTerm: "⁴A₂g",
  freeIonTerm: "⁴F (yer holati) + ⁴P (birinchi qo'zg'algan)",
  metalLigand: "Cr–O (akva)",
  crystalSystem: "Trigonal",
  spaceGroup: "R3̄c (izomorf [Al(H₂O)₆]Cl₃ bilan)",
  pointGroup: "Oₕ (ideal) / D₃d (real, biroz buzilgan)",
  bondLength: "1.98 Å (Cr–O)",
  bondAngle: "≈ 90° (real: 88–92°)",
  deltaOh: 17400,
  deltaOhKJ: 208,
  racahB: 725,
  racahB0: 918,
  beta: 0.79,
  cfseValue: "-1.2Δₒ",
  cfseKJ: 250,
  magneticMoment: 3.87,
  magneticMomentObs: 3.84,
  ligandField: "H₂O — o'rta kuchli maydon (standart)",
  discovery: "1798 (Vauquelin xromni kashf etgan yili)",
  applications: "Xrom oshlash, katalizator, ilmiy o'quv namunasi",
}

// ═══════════════════════════════════════════════════════════════════════════════
// UB-VIS CHO'QQILARI — BATAFSIL ILMIY IZOHLAR BILAN
// ═══════════════════════════════════════════════════════════════════════════════
const uvVisPeaks = [
  {
    lambda: 575, energy: 17400, wavenumber: 17400, epsilon: 13.4,
    transition: "⁴A₂g → ⁴T₂g",
    transitionType: "d–d",
    color: "text-[var(--v3-xira)]",
    intensity: "Zaif", intensityCode: 2,
    symmetryLabel: "t₂g → eg (bir elektronli)",
    selection: "Spin ruxsat (ΔS = 0), Laport taqiq (g → g)",
    vibronicNote: "Vibronik bog'lanish tufayli qisman ruxsat",
    energyKJ: 208,
    diagnostic: " Δo qiymati to'g'ridan-to'g'ri: Δo = ν₁ = 17 400 cm⁻¹",
    theoryNote: "Bu d³ konfiguratsiya uchun eng muhim polosa. Cr³⁺ ning yer holati ⁴A₂g (t₂g³) dan birinchi qo'zg'algan ⁴T₂g (t₂g²eg¹) ga o'tishni ifodalaydi. Bu o'tish davomida faqat bir elektron t₂g dan eg ga sakraydi. Chunki bu bir elektronli o'tish, uning energiyasi to'g'ridan-to'g'ri Δo ga teng (oktaedrik kristall maydon parametri). Bu unikal xususiyat: d³ va d⁸ konfiguratsiyalarda birinchi polosa aynan Δo.",
    lambdaMax_range: "570–580 nm",
    freqRange: "17 200–17 500 cm⁻¹"
  },
  {
    lambda: 407, energy: 24600, wavenumber: 24600, epsilon: 15.6,
    transition: "⁴A₂g → ⁴T₁g(F)",
    transitionType: "d–d",
    color: "text-amber-400 font-bold",
    intensity: "Zaif-o'rta", intensityCode: 2,
    symmetryLabel: "t₂g² eg¹ (bir elektronli, ⁴F termdan)",
    selection: "Spin ruxsat (ΔS = 0), Laport taqiq (g → g)",
    vibronicNote: "Vibronik bog'lanish tufayli qisman ruxsat",
    energyKJ: 294,
    diagnostic: " Racah B parametrini hisoblash uchun asosiy polosa",
    theoryNote: "Ikkinchi d–d polosa — ⁴A₂g dan ⁴T₁g(F) ga o'tish. Bu ham bir elektronli o'tish, lekin qo'zg'algan holat ⁴T₁g (F termidan kelib chiqadi). ν₂/ν₁ nisbatidan Racah B parametrini hisoblash mumkin: bu holda 24 600/17 400 = 1.41 — Tanabe-Sugano diagrammasidan Δo/B ≈ 24 qiymatini beradi, B ≈ 725 cm⁻¹. Erkin Cr³⁺ ionida B₀ = 918 cm⁻¹, demak nefelauksetik nisbat β = B/B₀ = 0.79 — kovalentlikning aniq isboti.",
    lambdaMax_range: "400–420 nm",
    freqRange: "24 000–25 000 cm⁻¹"
  },
  {
    lambda: 265, energy: 37700, wavenumber: 37700, epsilon: 20,
    transition: "⁴A₂g → ⁴T₁g(P)",
    transitionType: "d–d (ko'p LMCT bilan qoplangan)",
    color: "text-red-400",
    intensity: "O'rta (ko'p qismi LMCT)", intensityCode: 3,
    symmetryLabel: "⁴P termdan kelib chiqadi",
    selection: "Spin ruxsat, Laport taqiq",
    vibronicNote: "LMCT bilan qoplanadi",
    energyKJ: 451,
    diagnostic: "Uchinchi d–d polosa — ko'pincha LMCT bilan qoplangan",
    theoryNote: "Uchinchi d–d polosa ⁴A₂g dan ⁴T₁g(P) ga o'tish. ⁴P termi erkin ionda ⁴F dan ~15B yuqoriroq. Bu o'tish IKKI ELEKTRONLI (t₂g dan ikki elektron eg ga sakraydi), lekin Tanabe-Sugano diagrammasida bu holat ⁴F ⁴P termlar aralashishi natijasida ruxsat etilgan. Ko'pincha bu polosa suvli eritmada ligand-metall zaryad ko'chishi (LMCT: O2p → Cr 3d) tasmalar bilan qoplanadi va aniq ko'rinmaydi.",
    lambdaMax_range: "260–280 nm",
    freqRange: "36 000–38 500 cm⁻¹",
    hidden: true
  },
  {
    lambda: 700, energy: 14285, wavenumber: 14285, epsilon: 0.05,
    transition: "⁴A₂g → ²Eg",
    transitionType: "d–d (spin-taqiqlangan)",
    color: "text-gray-400",
    intensity: "Juda zaif (spin-taqiqlangan)", intensityCode: 1,
    symmetryLabel: "Spin flipping (S=3/2 → S=1/2)",
    selection: "Spin TAQIQLANGAN (ΔS ≠ 0), Laport taqiq",
    vibronicNote: "Faqat spin-orbital muhitlashish orqali",
    energyKJ: 171,
    diagnostic: "Rubinning lazer emissiyasi — ²Eg → ⁴A₂g",
    theoryNote: "Bu SPIN-TAQIQLANGAN o'tish — Cr³⁺ ning t₂g³ konfiguratsiyasi ichida spin holatining o'zgarishi (S=3/2 → S=1/2). Rasman ikkalasi ham (Laport + spin) taqiqlangan → ε juda past (~0.05). Ammo bu o'tish RUBIN LAZERINING (694.3 nm, chirog'i qizil) fizik asosidir — Al₂O₃ da Cr³⁺ ionlari huddi shu ²Eg → ⁴A₁g emissiyani beradi. Suvli eritmada odatda 700 nm da yelka sifatida ko'rinadi va kuchli d–d polosalar bilan qoplanadi.",
    lambdaMax_range: "690–710 nm",
    freqRange: "14 000–14 500 cm⁻¹",
    special: "🔴 Rubin lazerining nazariy asosi (Maiman, 1960)"
  },
]

// To'liq spektr nuqtalari (Gauss+Lorentzian shakl hosil qilish uchun)
const uvVisSpectrum = [
  { lambda: 200, absorbance: 3.5 }, { lambda: 220, absorbance: 3.2 },
  { lambda: 240, absorbance: 2.5 }, { lambda: 260, absorbance: 1.8 },
  { lambda: 265, absorbance: 1.6 }, { lambda: 280, absorbance: 0.8 },
  { lambda: 300, absorbance: 0.25 }, { lambda: 320, absorbance: 0.15 },
  { lambda: 340, absorbance: 0.18 }, { lambda: 360, absorbance: 0.30 },
  { lambda: 380, absorbance: 0.52 }, { lambda: 395, absorbance: 0.72 },
  { lambda: 407, absorbance: 0.78 }, { lambda: 420, absorbance: 0.65 },
  { lambda: 440, absorbance: 0.35 }, { lambda: 460, absorbance: 0.18 },
  { lambda: 480, absorbance: 0.15 }, { lambda: 500, absorbance: 0.20 },
  { lambda: 520, absorbance: 0.35 }, { lambda: 540, absorbance: 0.52 },
  { lambda: 560, absorbance: 0.65 }, { lambda: 575, absorbance: 0.67 },
  { lambda: 590, absorbance: 0.62 }, { lambda: 610, absorbance: 0.50 },
  { lambda: 630, absorbance: 0.35 }, { lambda: 650, absorbance: 0.22 },
  { lambda: 680, absorbance: 0.12 }, { lambda: 700, absorbance: 0.10 },
  { lambda: 720, absorbance: 0.06 }, { lambda: 750, absorbance: 0.03 },
  { lambda: 780, absorbance: 0.02 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SPEKTROXIMIK QATOR — Cr³⁺ ni turli ligandlarda
// ═══════════════════════════════════════════════════════════════════════════════
const spectrochemicalSeries = [
  { ligand: "6 Br⁻", complex: "[CrBr₆]³⁻", deltaOh: 12000, lambda1: 833, color: "yashil", current: false, note: "Zaif π-donor" },
  { ligand: "6 Cl⁻", complex: "[CrCl₆]³⁻", deltaOh: 13600, lambda1: 735, color: "yashil-sariq", current: false, note: "Zaif π-donor" },
  { ligand: "6 F⁻", complex: "[CrF₆]³⁻", deltaOh: 15200, lambda1: 658, color: "qizil-binafsha", current: false, note: "Zaif" },
  { ligand: "6 H₂O", complex: "[Cr(H₂O)₆]³⁺", deltaOh: 17400, lambda1: 575, color: "binafsha", current: true, note: "STANDART (bu kompleks)" },
  { ligand: "6 NH₃", complex: "[Cr(NH₃)₆]³⁺", deltaOh: 21500, lambda1: 465, color: "sariq", current: false, note: "σ-donor" },
  { ligand: "3 en", complex: "[Cr(en)₃]³⁺", deltaOh: 21900, lambda1: 457, color: "sariq", current: false, note: "Xelat effekti" },
  { ligand: "6 CN⁻", complex: "[Cr(CN)₆]³⁻", deltaOh: 26600, lambda1: 375, color: "och sariq", current: false, note: "Kuchli π-akseptor" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// TANABE-SUGANO d³ NUQTALARI — Δo/B ga bog'liq E/B qiymatlari
// ═══════════════════════════════════════════════════════════════════════════════
const tanabeSuganoD3 = [
  // Δo/B, ⁴A₂g (yer=0), ⁴T₂g, ⁴T₁g(F), ⁴T₁g(P), ²Eg
  { x: 0, ground: 0, t2g: 0, t1gF: 15, t1gP: 15, eg2: 8 },
  { x: 5, ground: 0, t2g: 5, t1gF: 15, t1gP: 20, eg2: 8 },
  { x: 10, ground: 0, t2g: 10, t1gF: 17, t1gP: 25, eg2: 12 },
  { x: 15, ground: 0, t2g: 15, t1gF: 21, t1gP: 32, eg2: 15 },
  { x: 20, ground: 0, t2g: 20, t1gF: 27, t1gP: 40, eg2: 18 },
  { x: 24, ground: 0, t2g: 24, t1gF: 34, t1gP: 47, eg2: 20 }, // Bu joyda [Cr(H2O)6]3+ (24)
  { x: 30, ground: 0, t2g: 30, t1gF: 43, t1gP: 56, eg2: 24 },
  { x: 40, ground: 0, t2g: 40, t1gF: 59, t1gP: 72, eg2: 32 },
  { x: 50, ground: 0, t2g: 50, t1gF: 75, t1gP: 88, eg2: 38 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// NAMUNA TAYYORLASH USULLARI (UB-Vis ga xos)
// ═══════════════════════════════════════════════════════════════════════════════
const techniques = [
  {
    name: "Suvli eritma (H₂O)",
    description: "Kompleksni distillangan suvda eritish. 1 sm kvarts kyuvetada o'lchash.",
    advantages: ["Universal usul", "Kompleks tabiiy holatida", "Kvantitativ (Beer-Lambert)", "190 nm gacha shaffof"],
    disadvantages: ["Muhit pH ga sezgir (gidroliz)", "3+ ionlar biroz gidrolizlanadi", "Konsentratsiya 10⁻³–10⁻² M optimal", "Kyuveta yaxshi tozalanmasa artefakt"],
    bestFor: "Standart tahlil, Δo va ε aniqlash",
    range: "190–1100 nm",
    resolution: "0.5 nm",
    concentration: "10⁻² – 10⁻³ M",
    prepTime: "5 daq"
  },
  {
    name: "0.1 M HClO₄ eritmasi",
    description: "Kislotali muhit kompleksni gidrolizdan himoya qiladi. Perxlorat koordinatsiyalanmaydi.",
    advantages: ["Gidrolizni bostiradi", "ClO₄⁻ koordinatsion emas", "Aniq pH nazorat", "Muhit UB da shaffof"],
    disadvantages: ["Kuchli kislota — xavfsizlik", "Yuqori ionli kuch ta'siri", "Ba'zi ligandlar protonlanishi mumkin", "Kyuveta uchun quyoshli oyna kerak"],
    bestFor: "Ilmiy o'lchov, Δo aniq qiymati",
    range: "200–1100 nm",
    resolution: "0.5 nm",
    concentration: "10⁻² – 10⁻³ M",
    prepTime: "10 daq"
  },
  {
    name: "DRS (Diffuz reflektans)",
    description: "Qattiq kristall namuna to'g'ridan-to'g'ri BaSO₄ bilan aralashtirilib o'lchanadi. Kubelka-Munk konversiyasi.",
    advantages: ["Qattiq holat spektri", "Nam yoki gigroskopik namunalar", "Kristall panjara ta'siri saqlanadi", "Namuna buzilmaydi"],
    disadvantages: ["Kubelka-Munk transformatsiyasi kerak", "Kvantitativ emas (ε ni to'g'ridan-to'g'ri o'lchamaydi)", "Kristall zarrasi 2–5 mkm bo'lishi kerak", "Nazariy asosi murakkab"],
    bestFor: "Kristall holat, katalizatorlar, kukun namunalar",
    range: "200–2500 nm (NIR ham)",
    resolution: "1 nm",
    concentration: "5% BaSO₄ da",
    prepTime: "10–15 daq"
  },
  {
    name: "Fiber-optik zond (in situ)",
    description: "Optik tolali zond eritma yoki reaktor ichiga tushiriladi. Sanoat monitoringi va kinetika uchun.",
    advantages: ["Real vaqt monitoringi", "Reaksiya kinetikasi", "Sanoat sharoiti", "Namuna olishga hojat yo'q"],
    disadvantages: ["Signal biroz kuchsiz (tolali yo'qotish)", "Zond namunaga botiriladi (ifloslanish)", "Qimmat qurilma", "Ba'zi diapazon cheklovlari"],
    bestFor: "Kinetika, sanoat nazorati, biologik namunalar",
    range: "200–2500 nm",
    resolution: "1–2 nm",
    concentration: "10⁻² – 10⁻⁴ M",
    prepTime: "0 daq (in situ)"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// HALAQIT BERUVCHI OMILLAR (UB-Vis ga xos)
// ═══════════════════════════════════════════════════════════════════════════════
const interferences = [
  {
    source: "Kompleks gidrolizi",
    range: "Butun spektr",
    effect: "[Cr(H₂O)₆]³⁺ ⇌ [Cr(H₂O)₅(OH)]²⁺ + H⁺, pH>3 da rang o'zgaradi (yashil-kul)",
    severity: "Yuqori",
    solution: "0.01–0.1 M HClO₄ yoki HNO₃ (koordinatsiyalanmaydi) qo'shish. pH<2 saqlash. Yangi eritma tayyorlash."
  },
  {
    source: "Cr³⁺ oligomerizatsiyasi",
    range: "300–500 nm",
    effect: "Konsentratsiya oshganda dimer [Cr₂(OH)₂(H₂O)₈]⁴⁺ hosil bo'ladi, ε o'zgaradi",
    severity: "O'rta",
    solution: "Konsentratsiyani 10⁻³ M dan pastda saqlash. Suyultirish egri chizig'ini o'lchash."
  },
  {
    source: "Cr(VI) aralashmasi (CrO₄²⁻)",
    range: "260–400 nm",
    effect: "Kuchli LMCT tasmalari (ε ~ 3000) Cr(III) polosalarini butunlay yashiradi",
    severity: "Yuqori",
    solution: "Reduktor bilan (askorbat, SnCl₂) Cr(VI) → Cr(III) ga aylantirish. UB spektrda cho'qqi 350 nm da yo'qolishini tekshirish."
  },
  {
    source: "Erituvchi cutoff (UB)",
    range: "λ < cutoff",
    effect: "Erituvchi o'zi UB da yutadi (H₂O: 190 nm, MeOH: 205 nm)",
    severity: "O'rta",
    solution: "Erituvchini oldindan tekshirish. Cutoff dan yuqori diapazonda o'lchash."
  },
  {
    source: "Kyuveta ifloslanishi",
    range: "Butun spektr",
    effect: "Yuqori bazaviy chiziq, tekis emas",
    severity: "O'rta",
    solution: "Kyuveta HNO₃/H₂SO₄ da yuvish, keyin distillangan suv. Boshiga H₂O bilan bazaviy chiziq o'lchash."
  },
  {
    source: "Konsentratsiya (Beer qonuni buzilishi)",
    range: "λmax da",
    effect: "c > 0.01 M → A chiziqli emas, ε o'zgaradi",
    severity: "Yuqori",
    solution: "Kalibrash egri chizig'ini har konsentratsiyaga alohida chizish. Suyultirish tavsiya etiladi."
  },
  {
    source: "Harorat ta'siri",
    range: "Butun spektr",
    effect: "T ↑ → polosalar kengayadi, ε biroz pasayadi",
    severity: "Past",
    solution: "Termostatlangan kyuveta ushlagichi (Peltier). Standart T = 25°C."
  },
  {
    source: "Yoruglik sochilish (kolloid)",
    range: "Butun UB",
    effect: "Loyqa eritma → A oshadi va λ ga chiziqli emas",
    severity: "O'rta",
    solution: "Millipor filtr (0.22 mkm) orqali o'tkazish. Yangi eritma tayyorlash."
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// GURUH NAZARIYASI VA TERMLAR
// ═══════════════════════════════════════════════════════════════════════════════
const groupTheoryData = {
  pointGroup: "Oₕ (ideal), D₃d (real)",
  order: 48,
  operations: "E, 8C₃, 6C₂, 6C₄, 3C₂(=C₄²), i, 6S₄, 8S₆, 3σₕ, 6σd",
  freeIonTerms: "⁴F (yer, L=3, S=3/2), ⁴P, ²G, ²H, ²P, ²D, ²F",
  octaheralSplitting: "⁴F → ⁴A₂g + ⁴T₂g + ⁴T₁g (Oₕ da)",
  transitionAllowed: "Faqat ΔS=0 (spin) ruxsat + Laport taqiq (g→g) — vibronik bog'lanish orqali qisman ruxsat",
  parity: "d–d o'tishlar hammasi g→g → Laport taqiqlangan",
  mutualExclusion: "Oₕ da i markazi bor → g modalar faqat Raman, u modalar faqat IQ",
  irActive: "T₁ᵤ tebranish modalar",
  ramanActive: "A₁g, Eg, T₂g",
}

// Tarixiy xronologiya
const historicalTimeline = [
  { year: "1798", event: "L. N. Vauquelin xrom elementini kashf etadi (Sibir krokoit rudasidan)" },
  { year: "1857", event: "F. Wöhler CrCl₃·6H₂O ning binafsha va yashil izomerlarini oladi" },
  { year: "1893", event: "A. Werner koordinatsion nazariyani taklif qiladi (Nobel 1913)" },
  { year: "1929", event: "H. Bethe — Kristall maydon nazariyasi (Ann. Physik)" },
  { year: "1935", event: "J. H. Van Vleck — Ligand maydon nazariyasi (J. Chem. Phys.)" },
  { year: "1942", event: "G. Racah — Racah A, B, C parametrlari (Phys. Rev.)" },
  { year: "1954", event: "Y. Tanabe, S. Sugano — d³ Tanabe-Sugano diagrammasi" },
  { year: "1960", event: "T. Maiman — Cr³⁺ da rubin lazerini yaratadi (694.3 nm)" },
  { year: "1962", event: "C. K. Jørgensen — Nefelauksetik samara, β nisbat" },
  { year: "1980-", event: "Ab initio va TDDFT hisoblashlar Cr(H₂O)₆³⁺ ni tasdiqlaydi" },
]

// Amaliy ahamiyati
const applications = [
  { field: "Xrom-kaliy achchig'ida", detail: "KCr(SO₄)₂·12H₂O — [Cr(H₂O)₆]³⁺ konfiguratsiya oshlash, mat sanoati", icon: "🏭" },
  { field: "Rubin lazerlari", detail: "Cr³⁺:Al₂O₃ da — ²Eg → ⁴A₂g emissiyasi (694.3 nm), tibbiy va harbiy lazerlar", icon: "🔴" },
  { field: "Zargarlik", detail: "Rubin (Cr³⁺:Al₂O₃, qizil), zumrad (Cr³⁺:Be₃Al₂Si₆O₁₈, yashil)", icon: "" },
  { field: "Katalizator", detail: "Xrom-oksid katalizatorlar (polietilen sintezi, Phillips jarayoni)", icon: "⚗️" },
  { field: "O'quv-metodik", detail: "d³ konfiguratsiyaning eng klassik namunasi — Δo va β ni empirik o'rgatish", icon: "🎓" },
  { field: "Biologik", detail: "Cr³⁺ — insulin faoliyatiga ta'siri; ammo Cr(VI) o'ta zaharli (kanserogen)", icon: "" },
]

export default function CrH2O6Cl3UVVis() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [showHeader, setShowHeader] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(0)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [showSpinForbidden, setShowSpinForbidden] = useState(false)
  const [comparingCompound, setComparingCompound] = useState(3) // H2O standart
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfProgress, setPdfProgress] = useState(0)
  
  // Beer-Lambert interaktiv kalkulyator
  const [blConcentration, setBlConcentration] = useState(0.005)
  const [blPathLength, setBlPathLength] = useState(1)
  const [blSelectedPeak, setBlSelectedPeak] = useState(0)
  
  const spectrumRef = useRef(null)

  // Optik zichlik hisoblash
  const blResult = useMemo(() => {
    const peak = uvVisPeaks[blSelectedPeak]
    const A = peak.epsilon * blConcentration * blPathLength
    const T = Math.pow(10, -A) * 100
    return { A: A.toFixed(3), T: T.toFixed(2), lambda: peak.lambda, epsilon: peak.epsilon }
  }, [blConcentration, blPathLength, blSelectedPeak])

  // Racah B ni ν₂/ν₁ nisbatidan hisoblash
  const racahCalc = useMemo(() => {
    const nu1 = uvVisPeaks[0].wavenumber
    const nu2 = uvVisPeaks[1].wavenumber
    const ratio = (nu2 / nu1).toFixed(3)
    // T-S diagramma yordamida
    const deltaOverB = 24  // Bu holat uchun
    const B = nu1 / deltaOverB
    const B0 = 918
    const beta = B / B0
    return { nu1, nu2, ratio, deltaOverB, B: B.toFixed(0), B0, beta: beta.toFixed(3) }
  }, [])

  // Spektrni SVG uchun tayyorlash
  const spectrumPath = useMemo(() => {
    const W = 800, H = 300
    const lambdaMin = 200, lambdaMax = 780
    const absMax = 4.0
    
    const points = uvVisSpectrum.map(p => {
      const x = ((p.lambda - lambdaMin) / (lambdaMax - lambdaMin)) * W
      const y = H - (p.absorbance / absMax) * H
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    return `M ${points.join(" L ")}`
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════════
  // 📄 PDF EKSPORT — FAQAT UB-VIS TAHLILI UCHUN, TO'LIQ ILMIY
  // ═══════════════════════════════════════════════════════════════════════════════
  const cleanText = (str) => {
    if (str === null || str === undefined) return ""
    return String(str)
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim()
  }

  const generatePDF = async () => {
    setPdfGenerating(true)
    setPdfProgress(0)
    
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib")
      const fontkit = (await import("@pdf-lib/fontkit")).default

      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)
      setPdfProgress(10)

      // ── Fontlar (UZ harflari uchun DejaVu) ──────
      let regularFont, boldFont, italicFont
      try {
        const regularBytes = await fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error("Regular font"); return r.arrayBuffer() })
        const boldBytes = await fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error("Bold font"); return r.arrayBuffer() })
        const italicBytes = await fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error("Italic font"); return r.arrayBuffer() })
        regularFont = await pdfDoc.embedFont(regularBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(boldBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(italicBytes, { subset: true })
      } catch (fontErr) {
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
        setPdfGenerating(false)
        return
      }
      setPdfProgress(20)

      // ── Ranglar (UB-Vis pink-purple palitrasi) ──
      const C = {
        pink: rgb(0.85, 0.30, 0.55),
        pinkDeep: rgb(0.60, 0.20, 0.40),
        pinkLight: rgb(0.98, 0.85, 0.92),
        purple: rgb(0.30, 0.11, 0.58),
        purpleLight: rgb(0.86, 0.78, 1.0),
        purpleMid: rgb(0.55, 0.35, 0.85),
        purpleDark: rgb(0.15, 0.10, 0.30),
        yellow: rgb(0.85, 0.60, 0.05),
        yellowDeep: rgb(0.60, 0.42, 0.02),
        textDark: rgb(0.08, 0.08, 0.16),
        textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0),
        green: rgb(0.08, 0.55, 0.31),
        blue: rgb(0.08, 0.35, 0.75),
        red: rgb(0.80, 0.20, 0.20),
        cyan: rgb(0.05, 0.65, 0.75),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.94, 1.0),
        bgPink: rgb(1.0, 0.94, 0.97),
        bgYellow: rgb(1.0, 0.98, 0.92),
        bgBlue: rgb(0.94, 0.98, 1.0),
        bgGreen: rgb(0.94, 1.0, 0.98),
        bgRed: rgb(1.0, 0.95, 0.95),
        white: rgb(1, 1, 1),
      }

      const PAGE_W = 595.28, PAGE_H = 841.89, MARGIN = 50
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30

      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNum = 1

      // ── Yordamchi funksiyalar ──
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
        const lines = []
        let current = ""
        for (const word of words) {
          const test = current ? current + " " + word : word
          if (measure(test, font, size) > maxWidth && current) {
            lines.push(current); current = word
          } else current = test
        }
        if (current) lines.push(current)
        return lines
      }
      const safeText = (text, opts) => {
        const { x, y: ty, size = 10, font = regularFont, color = C.textDark, align = "left", maxWidth = null } = opts
        const s = cleanText(text)
        const limit = maxWidth ?? (PAGE_W - MARGIN - x)
        const finalText = truncate(s, font, size, limit)
        let fx = x
        const w = measure(finalText, font, size)
        if (align === "center") fx = x - w / 2
        else if (align === "right") fx = x - w
        page.drawText(finalText, { x: fx, y: ty, size, font, color })
      }
      const drawWrappedText = (text, opts) => {
        const { x, y: sy, size = 9.5, font = regularFont, color = C.textDark, maxWidth, lineHeight = null } = opts
        const lines = wrapText(cleanText(text), font, size, maxWidth)
        const lh = lineHeight ?? size + 3
        lines.forEach((line, i) => {
          page.drawText(line, { x, y: sy - i * lh, size, font, color })
        })
        return lines.length * lh
      }
      const addFooter = () => {
        const leftText = truncate(
          `JDA-Kimyo UB-Vis Tahlili  •  [Cr(H₂O)₆]Cl₃  •  ${new Date().toLocaleDateString("uz-UZ")}`,
          regularFont, 8, CONTENT_W - 30
        )
        page.drawText(leftText, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        const pageStr = `${pageNum}`
        const w = measure(pageStr, regularFont, 8)
        page.drawText(pageStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine,
        })
      }
      const addNewPage = () => {
        addFooter()
        page = pdfDoc.addPage([PAGE_W, PAGE_H])
        pageNum++
        y = PAGE_H - MARGIN
      }
      const checkPageBreak = (need) => { if (y - need < FOOTER_Y + 25) addNewPage() }
      const drawSectionHeader = (num, title) => {
        checkPageBreak(45)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.pink })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13,
          font: boldFont, color: C.pinkDeep, maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
        })
        y -= 14
      }
      const drawTableRow = (label, value, bgColor = C.bgPink, labelColor = C.pinkDeep) => {
        const rowH = 20, labelW = 200
        checkPageBreak(rowH + 2)
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor })
        safeText(label, { x: MARGIN + 6, y: y - 13, size: 9, font: boldFont, color: labelColor, maxWidth: labelW - 8 })
        const valStr = cleanText(value)
        const finalVal = truncate(valStr, regularFont, 9, CONTENT_W - labelW - 12)
        page.drawText(finalVal, { x: MARGIN + labelW + 6, y: y - 13, size: 9, font: regularFont, color: C.textDark })
        y -= rowH
      }
      const drawInfoBox = (text, bgColor, borderColor, textColor) => {
        const padding = 10
        const maxW = CONTENT_W - 2 * padding
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

      // ═══ SARLAVHA POLOSASI ═══
      page.drawRectangle({ x: 0, y: PAGE_H - 90, width: PAGE_W, height: 90, color: C.pinkDeep })
      page.drawRectangle({ x: 0, y: PAGE_H - 92, width: PAGE_W, height: 4, color: C.yellow })
      
      safeText("UB-VIS SPEKTROSKOPIYA TAHLILI", { x: PAGE_W / 2, y: PAGE_H - 40, size: 16, font: boldFont, color: C.white, align: "center" })
      safeText("[Cr(H₂O)₆]Cl₃ — Geksaakvaxrom(III) xlorid", { x: PAGE_W / 2, y: PAGE_H - 60, size: 12, font: regularFont, color: C.pinkLight, align: "center" })
      safeText(`Sana: ${new Date().toLocaleDateString("uz-UZ")}  •  jdakimyo.uz`, { x: PAGE_W / 2, y: PAGE_H - 78, size: 8, font: italicFont, color: C.pinkLight, align: "center" })
      
      y = PAGE_H - 110
      setPdfProgress(30)

      // ═══ 1. UMUMIY MA'LUMOT ═══
      drawSectionHeader("1", "UMUMIY MA'LUMOT VA XUSUSIYATLARI")
      drawTableRow("Formula:", COMPOUND.formulaPlain)
      drawTableRow("IUPAC nomi:", COMPOUND.iupac)
      drawTableRow("An'anaviy nomi:", COMPOUND.commonName)
      drawTableRow("Molyar massa:", `${COMPOUND.molarMass} g/mol`)
      drawTableRow("CAS raqami:", COMPOUND.casNumber)
      drawTableRow("Rangi:", COMPOUND.color)
      drawTableRow("Struktura:", COMPOUND.structure)
      drawTableRow("Metall markazi:", `${COMPOUND.metalCenter} (${COMPOUND.dConfig})`)
      drawTableRow("Spin holati:", COMPOUND.spinState)
      drawTableRow("Yer holati termi:", COMPOUND.groundTerm)
      drawTableRow("Δo qiymati:", `${COMPOUND.deltaOh.toLocaleString()} cm⁻¹ (~${COMPOUND.deltaOhKJ} kJ/mol)`)
      drawTableRow("Racah B parametri:", `${COMPOUND.racahB} cm⁻¹ (β = ${COMPOUND.beta})`)
      drawTableRow("Magnit moment (kutilgan):", `${COMPOUND.magneticMoment} μB`)
      y -= 5
      setPdfProgress(40)

      // ═══ 2. NAZARIY ASOS ═══
      drawSectionHeader("2", "NAZARIY ASOS — d³ KONFIGURATSIYA")
      drawInfoBox(
        "Cr³⁺ ionining d³ konfiguratsiyasi (t₂g³ eg⁰) UB-Vis spektroskopiyada eng klassik holatlardan biri. " +
        "d–d o'tishlar Laport-taqiqlangan (g→g), lekin vibronik bog'lanish orqali qisman ruxsat etilgan (ε ~ 10–20). " +
        "Uch d–d polosa kuzatiladi: ⁴A₂g → ⁴T₂g (Δo), ⁴A₂g → ⁴T₁g(F), ⁴A₂g → ⁴T₁g(P).",
        C.bgPink, C.pink, C.textDark
      )
      setPdfProgress(50)

      // ═══ 3. YUTILISH POLOSALARI JADVALI ═══
      drawSectionHeader("3", "YUTILISH POLOSALARI VA IZOHI")
      
      const rowH = 32
      const cols = [
        { label: "λ (nm)", w: 55 },
        { label: "ν̃ (cm⁻¹)", w: 65 },
        { label: "ε", w: 45 },
        { label: "O'tish", w: 130 },
        { label: "Tur", w: 55 },
        { label: "Intensivlik", w: 100 },
      ]
      
      // Header row
      let colX = MARGIN
      page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.purpleMid })
      cols.forEach(c => {
        safeText(c.label, { x: colX + 4, y: y - 12, size: 8, font: boldFont, color: C.white, maxWidth: c.w - 6 })
        colX += c.w
      })
      y -= 18

      uvVisPeaks.filter(p => !p.hidden).forEach((p, i) => {
        checkPageBreak(rowH + 2)
        const bgc = i % 2 === 0 ? C.bgPurple : C.white
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgc })
        colX = MARGIN
        const values = [
          `${p.lambda}`,
          `${p.wavenumber.toLocaleString()}`,
          `${p.epsilon}`,
          p.transition,
          p.transitionType,
          p.intensity,
        ]
        values.forEach((v, idx) => {
          safeText(v, { x: colX + 4, y: y - 12, size: 8, font: regularFont, color: C.textDark, maxWidth: cols[idx].w - 6 })
          colX += cols[idx].w
        })
        // Diagnostika izohi
        safeText(p.diagnostic, { x: MARGIN + 4, y: y - 24, size: 7, font: italicFont, color: C.pinkDeep, maxWidth: CONTENT_W - 8 })
        y -= rowH
      })
      y -= 10
      setPdfProgress(60)

      // ═══ 4. HAR BIR POLOSA NAZARIY IZOH ═══
      drawSectionHeader("4", "POLOSALARNING NAZARIY IZOHI")
      uvVisPeaks.filter(p => !p.hidden).forEach((p, i) => {
        checkPageBreak(80)
        // Sarlavha
        page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.bgPink })
        safeText(`${i + 1}. ${p.transition}   —   λ = ${p.lambda} nm,  ε = ${p.epsilon}`, {
          x: MARGIN + 6, y: y - 12, size: 9, font: boldFont, color: C.pinkDeep, maxWidth: CONTENT_W - 12
        })
        y -= 22
        // Ilmiy izoh
        const hh = drawWrappedText(p.theoryNote, {
          x: MARGIN + 8, y: y, size: 8.5, font: regularFont, color: C.textDark,
          maxWidth: CONTENT_W - 16, lineHeight: 11
        })
        y -= hh + 8
      })
      setPdfProgress(70)

      // ═══ 5. Δo VA RACAH B HISOBI ═══
      drawSectionHeader("5", "Δo VA RACAH B PARAMETRI HISOBI")
      drawInfoBox(
        `d³ konfiguratsiya uchun birinchi polosa aynan Δo qiymatiga teng:\n` +
        `Δo = ν₁ = ${uvVisPeaks[0].wavenumber} cm⁻¹ = ${COMPOUND.deltaOhKJ} kJ/mol\n\n` +
        `ν₂/ν₁ nisbatidan Racah B ni topish:\n` +
        `Nisbat = ${uvVisPeaks[1].wavenumber}/${uvVisPeaks[0].wavenumber} = ${racahCalc.ratio}\n` +
        `Tanabe-Sugano diagrammasidan (d³) → Δo/B = ${racahCalc.deltaOverB}\n` +
        `B = Δo / (Δo/B) = ${uvVisPeaks[0].wavenumber} / ${racahCalc.deltaOverB} = ${racahCalc.B} cm⁻¹\n\n` +
        `Nefelauksetik nisbat: β = B/B₀ = ${racahCalc.B}/${racahCalc.B0} = ${racahCalc.beta}\n` +
        `β < 1 → kovalentlik alomati (Cr–O bog'ida qisman elektron sharoit)`,
        C.bgBlue, C.blue, C.textDark
      )
      setPdfProgress(80)

      // ═══ 6. SPEKTROXIMIK QATORI ═══
      drawSectionHeader("6", "SPEKTROXIMIK QATORDA O'RNI")
      drawInfoBox(
        "H₂O ligandi spektroximik qatorda standart o'rinni egallaydi. Cr³⁺ uchun turli ligandlarga qarab Δo o'zgaradi:\n\n" +
        "6 Br⁻: Δo = 12 000 cm⁻¹ (yashil)\n" +
        "6 Cl⁻: Δo = 13 600 cm⁻¹\n" +
        "6 F⁻: Δo = 15 200 cm⁻¹\n" +
        "6 H₂O: Δo = 17 400 cm⁻¹  ← STANDART (bu kompleks)\n" +
        "6 NH₃: Δo = 21 500 cm⁻¹\n" +
        "3 en: Δo = 21 900 cm⁻¹\n" +
        "6 CN⁻: Δo = 26 600 cm⁻¹ (kuchli π-akseptor)",
        C.bgGreen, C.green, C.textDark
      )
      setPdfProgress(90)

      // ═══ 7. XULOSA ═══
      drawSectionHeader("7", "ASOSIY XULOSALAR")
      const conclusions = [
        `1. λ = 575 nm (ε=13.4): ⁴A₂g → ⁴T₂g — birinchi polosa AYNI Δo qiymatiga teng`,
        `2. λ = 407 nm (ε=15.6): ⁴A₂g → ⁴T₁g(F) — ikkinchi polosa, Racah B hisobi uchun`,
        `3. Δo = 17 400 cm⁻¹ (208 kJ/mol) — o'rta kuchli maydon`,
        `4. Racah B = 725 cm⁻¹, β = 0.79 — kovalentlik alomati (β<1)`,
        `5. Kompleks binafsha rang beradi — 575 nm da sariq-yashil yutiladi`,
        `6. d³ konfiguratsiya — INERT kompleks (Taube tasnifi bo'yicha)`,
        `7. Rubin lazerining nazariy asosi (²Eg → ⁴A₂g emissiyasi, 694 nm)`,
      ]
      conclusions.forEach(c => {
        checkPageBreak(20)
        drawWrappedText(c, {
          x: MARGIN + 10, y, size: 9.5, font: regularFont, color: C.textDark,
          maxWidth: CONTENT_W - 20, lineHeight: 12
        })
        y -= 18
      })

      addFooter()
      setPdfProgress(100)

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Cr-H2O-6-Cl3_UBVis_Tahlili_${new Date().toISOString().split("T")[0]}.pdf`
      link.click()
      URL.revokeObjectURL(url)
      
      setPdfModalOpen(false)
    } catch (err) {
      console.error("PDF xato:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally {
      setPdfGenerating(false)
      setPdfProgress(0)
    }
  }

  return (
    <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">

      {/* ═══════════════ PDF MODAL ═══════════════ */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
            <h3 className="text-2xl font-bold text-pink-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">📄</span> PDF Ilmiy Hisobot
            </h3>
            <p className="text-[var(--v3-matn)] text-sm mb-4">
              [Cr(H₂O)₆]Cl₃ ning UB-Vis spektroskopik tahlili haqida to'liq ilmiy hisobot yaratiladi. 
              Hisobotga quyidagilar kiritiladi:
            </p>
            <ul className="text-xs text-[var(--v3-matn)] space-y-1 mb-6 list-disc list-inside">
              <li>Umumiy ma'lumot va fizik-kimyoviy xususiyatlari</li>
              <li>d³ konfiguratsiyaning nazariy asosi</li>
              <li>Har bir yutilish polosasining batafsil izohi</li>
              <li>Δo va Racah B parametrini hisoblash</li>
              <li>Spektroximik qatordagi o'rni</li>
              <li>Ilmiy xulosalar va manba adabiyotlar</li>
            </ul>
            
            {pdfGenerating && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-[var(--v3-matn)] mb-2">
                  <span>PDF yaratilmoqda...</span>
                  <span>{pdfProgress}%</span>
                </div>
                <div className="w-full bg-purple-900/40 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-yellow-400 h-full transition-all duration-300"
                    style={{ width: `${pdfProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-200">
                <strong> Font talablari:</strong> PDF to'g'ri chiqishi uchun <code className="bg-yellow-950/50 px-1 rounded">public/fonts/</code> papkasida
                <code className="bg-yellow-950/50 px-1 rounded ml-1">DejaVuSans.ttf</code>, 
                <code className="bg-yellow-950/50 px-1 rounded ml-1">DejaVuSans-Bold.ttf</code>, 
                <code className="bg-yellow-950/50 px-1 rounded ml-1">DejaVuSans-Oblique.ttf</code> bo'lishi shart.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPdfModalOpen(false)}
                disabled={pdfGenerating}
                className="flex-1 bg-purple-800 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors text-sm font-semibold disabled:opacity-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={generatePDF}
                disabled={pdfGenerating}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-3 rounded-lg transition-all text-sm font-bold disabled:opacity-50"
              >
                {pdfGenerating ? "⏳ Yaratilmoqda..." : "📥 PDF yuklab olish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ HEADER ═══════════════ */}
      {showHeader && (
        <header className="border-b border-[var(--v3-chiziq)] sticky top-0 z-40 bg-[var(--v3-fon-2)]/90 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-[var(--v3-xira)] flex-wrap">
              <Link href="/" className="hover:text-[var(--v3-matn)]"> Bosh</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-[var(--v3-matn)]">Tahlil</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/ub-vis" className="hover:text-[var(--v3-matn)]">UB-Vis</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="hover:text-[var(--v3-matn)]">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-pink-400 font-semibold">[Cr(H₂O)₆]Cl₃</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border-4 border-white/20 shadow-2xl" style={{background: COMPOUND.colorHex}}></div>
                <div>
                  <h1
                    className="text-2xl md:text-3xl font-bold text-pink-400"
                    dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }}
                  />
                  <p className="text-[var(--v3-matn)] text-sm mt-1">{COMPOUND.iupac}</p>
                  <p className="text-[var(--v3-xira)] text-xs italic">{COMPOUND.commonName} • {COMPOUND.dConfig} • Δo={COMPOUND.deltaOh.toLocaleString()} cm⁻¹</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setPdfModalOpen(true)}
                  className="text-xs bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-pink-500/20 font-bold"
                >
                  📄 PDF Hisobot
                </button>
                <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-xs bg-purple-800/60 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  ← Birikmalar
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-40 px-3 py-2 rounded-lg text-xs font-bold shadow-lg bg-pink-600 hover:bg-pink-500 text-white"
      >
        {showHeader ? "🔽" : "🔼"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══════════════ 1. UMUMIY MA'LUMOT ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Rangli namuna */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-40 h-40 rounded-2xl border-4 border-white/20 shadow-2xl" style={{
                background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}dd, ${COMPOUND.colorHex}99, ${COMPOUND.colorHex}66)`
              }}></div>
              <div className="text-center">
                <div className="text-xs text-[var(--v3-xira)]">Ko'rinuvchi rang</div>
                <div className="text-lg font-bold text-pink-400">{COMPOUND.color}</div>
              </div>
              <div className="w-32 h-4 rounded-full" style={{background: COMPOUND.absorbedHex}}></div>
              <div className="text-[10px] text-purple-500 text-center">Yutilgan (~575 nm sariq-yashil)</div>
            </div>

            {/* Asosiy ma'lumot */}
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-white mb-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
              </h2>
              <p className="text-[var(--v3-matn)] leading-relaxed text-sm">
                <strong className="text-pink-400">[Cr(H₂O)₆]Cl₃</strong> — Cr³⁺ ionining oktaedrik akvakompleksi bo'lib, 
                <strong className="text-amber-400 font-bold"> d³ konfiguratsiyaning eng klassik namunasi</strong> hisoblanadi. 
                Bu kompleks UB-Vis spektroskopiyaning nazariy asoslarini o'rgatish uchun ideal, chunki uning birinchi
                yutilish polosasi <strong className="text-amber-400 font-bold">to'g'ridan-to'g'ri Δo qiymatini beradi</strong>.
                Ikkinchi polosa esa Racah B parametrini hisoblashga imkon beradi.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-blue-900/30 border border-blue-700/40 rounded-xl p-3 text-center">
                  <div className="text-blue-400 text-[10px] uppercase">Konfiguratsiya</div>
                  <div className="text-white font-bold mt-1">{COMPOUND.dConfig}</div>
                </div>
                <div className="bg-purple-900/30 border border-[var(--v3-chiziq)]/40 rounded-xl p-3 text-center">
                  <div className="text-[var(--v3-xira)] text-[10px] uppercase">Yer holati</div>
                  <div className="text-white font-bold mt-1">{COMPOUND.groundTerm}</div>
                </div>
                <div className="bg-pink-900/30 border border-pink-700/40 rounded-xl p-3 text-center">
                  <div className="text-pink-400 text-[10px] uppercase">Δo (cm⁻¹)</div>
                  <div className="text-white font-bold mt-1">{COMPOUND.deltaOh.toLocaleString()}</div>
                </div>
                <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-3 text-center">
                  <div className="text-green-400 text-[10px] uppercase">μ (μB)</div>
                  <div className="text-white font-bold mt-1">{COMPOUND.magneticMoment}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Xususiyatlar jadvali */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-xl overflow-hidden">
              <div className="bg-pink-900/30 px-4 py-2 border-b border-pink-700/30">
                <h3 className="text-pink-400 font-bold text-sm"> Fizik-kimyoviy xususiyatlar</h3>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-[var(--v3-chiziq)]">
                    <td className="py-2 px-4 text-[var(--v3-xira)]">Molyar massa</td>
                    <td className="py-2 px-4 text-white font-mono">{COMPOUND.molarMass} g/mol</td>
                  </tr>
                  <tr className="border-b border-[var(--v3-chiziq)]">
                    <td className="py-2 px-4 text-[var(--v3-xira)]">CAS raqami</td>
                    <td className="py-2 px-4 text-white font-mono">{COMPOUND.casNumber}</td>
                  </tr>
                  <tr className="border-b border-[var(--v3-chiziq)]">
                    <td className="py-2 px-4 text-[var(--v3-xira)]">Kristall tizim</td>
                    <td className="py-2 px-4 text-white">{COMPOUND.crystalSystem}</td>
                  </tr>
                  <tr className="border-b border-[var(--v3-chiziq)]">
                    <td className="py-2 px-4 text-[var(--v3-xira)]">Fazoviy guruh</td>
                    <td className="py-2 px-4 text-white font-mono">{COMPOUND.spaceGroup}</td>
                  </tr>
                  <tr className="border-b border-[var(--v3-chiziq)]">
                    <td className="py-2 px-4 text-[var(--v3-xira)]">Nuqta guruhi</td>
                    <td className="py-2 px-4 text-white font-mono">{COMPOUND.pointGroup}</td>
                  </tr>
                  <tr className="border-b border-[var(--v3-chiziq)]">
                    <td className="py-2 px-4 text-[var(--v3-xira)]">Cr–O bog' uzunligi</td>
                    <td className="py-2 px-4 text-white font-mono">{COMPOUND.bondLength}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-[var(--v3-xira)]">Muhit</td>
                    <td className="py-2 px-4 text-white">Suvda erimoqda, pH~2.5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-xl overflow-hidden">
              <div className="bg-pink-900/30 px-4 py-2 border-b border-pink-700/30">
                <h3 className="text-pink-400 font-bold text-sm">⚛ Elektron struktura</h3>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-[var(--v3-chiziq)]">
                    <td className="py-2 px-4 text-[var(--v3-xira)]">Metall ioni</td>
                    <td className="py-2 px-4 text-white font-mono">{COMPOUND.metalCenter} (d³)</td>
                  </tr>
                  <tr className="border-b border-[var(--v3-chiziq)]">
                    <td className="py-2 px-4 text-[var(--v3-xira)]">Konfiguratsiya</td>
                    <td className="py-2 px-4 text-white font-mono">t₂g³ eg⁰</td>
                  </tr>
                  <tr className="border-b border-[var(--v3-chiziq)]">
                    <td className="py-2 px-4 text-[var(--v3-xira)]">Yer holati termi</td>
                    <td className="py-2 px-4 text-white font-mono">{COMPOUND.groundTerm}</td>
                  </tr>
                  <tr className="border-b border-[var(--v3-chiziq)]">
                    <td className="py-2 px-4 text-[var(--v3-xira)]">Erkin ion termlari</td>
                    <td className="py-2 px-4 text-white text-[11px] font-mono">{COMPOUND.freeIonTerm}</td>
                  </tr>
                  <tr className="border-b border-[var(--v3-chiziq)]">
                    <td className="py-2 px-4 text-[var(--v3-xira)]">CFSE</td>
                    <td className="py-2 px-4 text-white font-mono">{COMPOUND.cfseValue} = −{COMPOUND.cfseKJ} kJ/mol</td>
                  </tr>
                  <tr className="border-b border-[var(--v3-chiziq)]">
                    <td className="py-2 px-4 text-[var(--v3-xira)]">μeff (kutilgan/kuzatilgan)</td>
                    <td className="py-2 px-4 text-white font-mono">{COMPOUND.magneticMoment} / {COMPOUND.magneticMomentObs} μB</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-[var(--v3-xira)]">Ligand maydon</td>
                    <td className="py-2 px-4 text-white text-[11px]">{COMPOUND.ligandField}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ═══════════════ 2. NAZARIY ASOS ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📚</span> UB-Vis spektroskopiyasining d³ ga oid nazariy asosi
          </h2>

          <p className="text-[var(--v3-matn)] leading-relaxed text-sm">
            <strong className="text-amber-400 font-bold">Cr³⁺ (d³) konfiguratsiya</strong> UB-Vis spektroskopiyada nihoyatda o'ziga xos.
            Uch elektron t₂g orbitallarida (yer holati) joylashadi va 3 ta d–d o'tish kuzatiladi. 
            Bu <strong className="text-pink-400">d³ va d⁸ konfiguratsiyalarning unikal xususiyati</strong> — 
            birinchi polosa AYNI Δo qiymatiga teng, chunki bu bir elektronli t₂g → eg o'tish.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kvant asos */}
            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-cyan-300 font-bold mb-3 flex items-center gap-2">
                <span></span> Kvant asosi
              </h3>
              <div className="bg-purple-950/60 rounded-lg p-3 mb-3">
                <div className="text-amber-300 font-bold text-sm text-center my-2 font-mono">
                  E = hν = hc/λ = hc·ν̃
                </div>
                <div className="text-[var(--v3-matn)] text-[10px] mt-2 space-y-0.5">
                  • h — Plank doimiysi (6.626×10⁻³⁴ J·s)<br />
                  • c — yorug'lik tezligi (3×10⁸ m/s)<br />
                  • ν̃ — to'lqin soni (cm⁻¹)<br />
                  • λ (nm) → E (kJ/mol) = 119627/λ
                </div>
              </div>
              <div className="bg-purple-950/60 rounded-lg p-3">
                <div className="text-amber-300 font-bold text-sm text-center my-1 font-mono">A = ε·c·l</div>
                <div className="text-[var(--v3-matn)] text-[10px]">Beer-Lambert qonuni (chiziqli): A — zichlik, ε — molyar koeff., c — konsentratsiya, l — kyuveta</div>
              </div>
            </div>

            {/* Tanlash qoidalari */}
            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-cyan-300 font-bold mb-3 flex items-center gap-2">
                <span></span> Tanlash qoidalari (d³ da)
              </h3>
              <div className="space-y-2">
                <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-3">
                  <p className="text-green-300 font-bold text-xs mb-1"> Spin ruxsat (ΔS=0)</p>
                  <p className="text-[var(--v3-matn)] text-[11px]">⁴A₂g → ⁴T₂g, ⁴T₁g: hammasi kvartet (S=3/2 → S=3/2). Ruxsat etilgan → ε ~ 10–20</p>
                </div>
                <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-3">
                  <p className="text-red-300 font-bold text-xs mb-1">❌ Laport TAQIQ (g→g)</p>
                  <p className="text-[var(--v3-matn)] text-[11px]">d–d o'tishlarning hammasi g→g → taqiqlangan. Vibronik bog'lanish (t₁ᵤ tebranish) orqali qisman ruxsat</p>
                </div>
                <div className="bg-gray-900/20 border border-gray-700/40 rounded-lg p-3">
                  <p className="text-gray-300 font-bold text-xs mb-1">🚫 Spin TAQIQ (²Eg)</p>
                  <p className="text-[var(--v3-matn)] text-[11px]">⁴A₂g → ²Eg: S=3/2 → S=1/2, ΔS≠0 → juda kuchli taqiqlangan. ε ~ 0.05 (yashirin polosa)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">🎓 d³ konfiguratsiyaning ustunligi:</strong>{" "}
              Bu konfiguratsiyada birinchi polosa aynan Δo ga teng bo'lgani uchun (ν₁ = Δo), 
              boshqa hisob-kitobsiz kristall maydon parametrini bevosita o'lchash mumkin. 
              Bu Ti(III) (d¹), Cr(III) (d³), Ni(II) (d⁸) va Cu(II) (d⁹) da kuzatiladi. 
              Boshqa konfiguratsiyalarda (d², d⁴, d⁵, d⁶, d⁷) Tanabe-Sugano diagrammasi orqali interpolatsiya kerak.
            </p>
          </div>
        </div>

        {/* ═══════════════ 3. INTERAKTIV UB-VIS SPEKTRI (SVG) ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈</span> Interaktiv UB-Vis yutilish spektri
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            Polosalarga <strong className="text-pink-400">ustiga bosing</strong> — batafsil ilmiy izohlarni ko'ring. 
            Cho'qqilar Lorentzian shakli bilan hosil qilingan (real FT-UV-Vis o'lchov shakli).
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-4 overflow-x-auto">
            <svg viewBox="0 0 800 400" className="w-full h-auto" preserveAspectRatio="xMidYMid meet" ref={spectrumRef}>
              <defs>
                <linearGradient id="visibleSpectrum" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4B0082"/>
                  <stop offset="15%" stopColor="#8B00FF"/>
                  <stop offset="25%" stopColor="#0000FF"/>
                  <stop offset="40%" stopColor="#00FF00"/>
                  <stop offset="55%" stopColor="#FFFF00"/>
                  <stop offset="70%" stopColor="#FF8C00"/>
                  <stop offset="90%" stopColor="#FF0000"/>
                  <stop offset="100%" stopColor="#8B0000"/>
                </linearGradient>
                <linearGradient id="peakGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#f472b6" stopOpacity="0.1"/>
                </linearGradient>
              </defs>

              {/* Ko'rinuvchi spektr chizig'i (400-780 nm) */}
              <rect x={((400 - 200) / 580) * 800} y="320" width={((780 - 400) / 580) * 800} height="10" fill="url(#visibleSpectrum)" opacity="0.6"/>
              
              {/* UB soha (200-400) — binafsha) */}
              <rect x="0" y="320" width={((400 - 200) / 580) * 800} height="10" fill="#301934" opacity="0.5"/>

              {/* Grid chiziqlari */}
              {[0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5].map((abs, i) => (
                <g key={i}>
                  <line x1="0" y1={300 - (abs/4)*300} x2="800" y2={300 - (abs/4)*300} stroke="#a78bfa" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.5"/>
                  <text x="5" y={300 - (abs/4)*300 - 2} fill="#c4b5fd" fontSize="9">A={abs}</text>
                </g>
              ))}
              {[200, 300, 400, 500, 600, 700, 780].map(l => (
                <g key={l}>
                  <line x1={((l - 200) / 580) * 800} y1="0" x2={((l - 200) / 580) * 800} y2="300" stroke="#a78bfa" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.3"/>
                  <text x={((l - 200) / 580) * 800} y="345" fill="#e9d5ff" fontSize="10" textAnchor="middle">{l}</text>
                </g>
              ))}
              <text x="400" y="365" fill="#e9d5ff" fontSize="11" textAnchor="middle" fontWeight="bold">λ (nm)</text>

              {/* Y o'q label */}
              <text x="15" y="150" fill="#e9d5ff" fontSize="11" textAnchor="middle" transform="rotate(-90 15 150)" fontWeight="bold">Optik zichlik (A)</text>

              {/* Spektr chizig'i */}
              <path d={spectrumPath} fill="none" stroke="#f472b6" strokeWidth="2"/>
              <path d={`${spectrumPath} L 800,300 L 0,300 Z`} fill="url(#peakGradient)"/>

              {/* Cho'qqilar (klik qilinuvchi) */}
              {uvVisPeaks.filter(p => !p.hidden || showSpinForbidden).map((p, i) => {
                const x = ((p.lambda - 200) / 580) * 800
                const spectrumPoint = uvVisSpectrum.find(sp => Math.abs(sp.lambda - p.lambda) < 20)
                const y = spectrumPoint ? 300 - (spectrumPoint.absorbance / 4) * 300 : 200
                const isSelected = selectedPeak === i
                const isHovered = hoveredPeak === i
                
                return (
                  <g key={i} onClick={() => setSelectedPeak(i)} onMouseEnter={() => setHoveredPeak(i)} onMouseLeave={() => setHoveredPeak(null)} className="cursor-pointer">
                    {/* Chiziq */}
                    <line x1={x} y1={y - 5} x2={x} y2="15" stroke={isSelected ? "#fbbf24" : "#f472b6"} strokeWidth={isSelected || isHovered ? "2" : "1"} strokeDasharray={isSelected ? "0" : "4 2"}/>
                    
                    {/* Marker */}
                    <circle cx={x} cy={y} r={isSelected || isHovered ? "8" : "5"} fill={isSelected ? "#fbbf24" : (p.transitionType.includes("spin-taqiqlangan") ? "#6b7280" : "#f472b6")} stroke="#fff" strokeWidth="2"/>
                    
                    {/* Label */}
                    <g>
                      <rect x={x - 30} y={5} width="60" height="20" rx="4" fill={isSelected ? "#fbbf24" : "#f472b6"} opacity="0.9"/>
                      <text x={x} y="18" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">{p.lambda} nm</text>
                    </g>
                    
                    {/* Assignment */}
                    {(isSelected || isHovered) && (
                      <g>
                        <rect x={x - 55} y={y - 60} width="110" height="34" rx="4" fill="#4B0082" stroke="#fbbf24" strokeWidth="1"/>
                        <text x={x} y={y - 45} fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">{p.transition}</text>
                        <text x={x} y={y - 32} fill="#fbbf24" fontSize="9" textAnchor="middle">ε = {p.epsilon}</text>
                      </g>
                    )}
                  </g>
                )
              })}
              
              {/* Sarlavha */}
              <text x="400" y="20" fill="#f472b6" fontSize="14" textAnchor="middle" fontWeight="bold">
                [Cr(H₂O)₆]³⁺ UB-Vis spektri (0.01 M, pH ~ 2.5)
              </text>
            </svg>

            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center gap-2 text-xs text-[var(--v3-matn)]">
                <input 
                  type="checkbox" 
                  checked={showSpinForbidden}
                  onChange={(e) => setShowSpinForbidden(e.target.checked)}
                  className="accent-pink-500"
                />
                Spin-taqiqlangan ²Eg polosani ko'rsatish (rubin lazerining kelib chiqishi)
              </label>
              <span className="text-xs text-[var(--v3-xira)]">
                 {uvVisPeaks.filter(p => !p.hidden || showSpinForbidden).length} ta polosa ko'rsatilmoqda
              </span>
            </div>
          </div>

          {/* Tanlangan polosa detali */}
          {selectedPeak !== null && (
            <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-2 border-pink-500/50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-pink-400 mb-1">{uvVisPeaks[selectedPeak].transition}</h3>
                  <p className="text-[var(--v3-matn)] text-sm">{uvVisPeaks[selectedPeak].symmetryLabel}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  uvVisPeaks[selectedPeak].intensityCode === 4 ? "bg-red-900/40 border-red-500 text-red-300" :
                  uvVisPeaks[selectedPeak].intensityCode === 3 ? "bg-orange-900/40 border-orange-500 text-orange-300" :
                  uvVisPeaks[selectedPeak].intensityCode === 2 ? "bg-yellow-900/40 border-yellow-500 text-amber-300 font-bold" :
                  "bg-gray-900/40 border-gray-500 text-gray-300"
                }`}>
                  {uvVisPeaks[selectedPeak].intensity}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-[var(--v3-xira)] uppercase">λmax</div>
                  <div className="text-amber-300 font-bold font-mono font-bold">{uvVisPeaks[selectedPeak].lambda} nm</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-[var(--v3-xira)] uppercase">ν̃ (cm⁻¹)</div>
                  <div className="text-cyan-300 font-mono font-bold">{uvVisPeaks[selectedPeak].wavenumber.toLocaleString()}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-[var(--v3-xira)] uppercase">ε (M⁻¹·sm⁻¹)</div>
                  <div className="text-green-300 font-mono font-bold">{uvVisPeaks[selectedPeak].epsilon}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-[var(--v3-xira)] uppercase">E (kJ/mol)</div>
                  <div className="text-orange-300 font-mono font-bold">{uvVisPeaks[selectedPeak].energyKJ}</div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-3 mb-3">
                <div className="text-xs text-blue-400 font-bold mb-1"> Tanlash qoidasi:</div>
                <div className="text-sm text-[var(--v3-matn)]">{uvVisPeaks[selectedPeak].selection}</div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3 mb-3">
                <div className="text-xs text-amber-400 font-bold font-bold mb-1"> Diagnostik:</div>
                <div className="text-sm text-[var(--v3-matn)]">{uvVisPeaks[selectedPeak].diagnostic}</div>
              </div>

              <div className="bg-pink-900/20 border border-pink-700/40 rounded-lg p-4">
                <div className="text-xs text-pink-400 font-bold mb-2">🎓 Batafsil ilmiy izoh:</div>
                <div className="text-sm text-[var(--v3-matn)] leading-relaxed">{uvVisPeaks[selectedPeak].theoryNote}</div>
              </div>

              {uvVisPeaks[selectedPeak].special && (
                <div className="mt-3 bg-red-900/20 border border-red-700/40 rounded-lg p-3">
                  <div className="text-xs text-red-400 font-bold mb-1">⭐ Alohida ahamiyat:</div>
                  <div className="text-sm text-red-200">{uvVisPeaks[selectedPeak].special}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════ 4. CHO'QQILAR JADVALI ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Yutilish polosalari — ilmiy tayinlash jadvali
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">λ (nm)</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">ν̃ (cm⁻¹)</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">O'tish</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Tur</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">ε</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Intensivlik</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Ma'no</th>
                </tr>
              </thead>
              <tbody>
                {uvVisPeaks.filter(p => !p.hidden || showSpinForbidden).map((p, i) => (
                  <tr 
                    key={i} 
                    onClick={() => setSelectedPeak(i)}
                    className={`border-b border-[var(--v3-chiziq)] hover:bg-pink-900/20 cursor-pointer transition-colors ${selectedPeak === i ? "bg-pink-900/30" : ""}`}
                  >
                    <td className="py-3 px-3 text-amber-300 font-bold font-mono font-bold">{p.lambda}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">{p.wavenumber.toLocaleString()}</td>
                    <td className="py-3 px-3 text-[var(--v3-matn)] font-mono">{p.transition}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        p.transitionType.includes("spin-taqiq") ? "bg-gray-800/60 text-gray-400" :
                        p.transitionType.includes("LMCT") ? "bg-red-900/40 text-red-300" :
                        "bg-purple-900/40 text-[var(--v3-matn)]"
                      }`}>{p.transitionType}</span>
                    </td>
                    <td className="py-3 px-3 text-green-300 font-mono">{p.epsilon}</td>
                    <td className="py-3 px-3 text-xs">{p.intensity}</td>
                    <td className="py-3 px-3 text-xs text-[var(--v3-matn)] italic">{p.diagnostic.substring(0, 50)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[var(--v3-xira)] italic">
            Manba: Lever A.B.P., Inorganic Electronic Spectroscopy (2nd ed., 1984); ε qiymatlari Fackler-Cotton bo'yicha
          </p>
        </div>

        {/* ═══════════════ 5. KRISTALL MAYDON YORILISHI (SVG) ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Kristall maydon yorilishi va elektron o'tishlar
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            Cr³⁺ ning d-orbitallari Oₕ simmetriyada yoriladi: t₂g (past, −0.4Δo) va eg (yuqori, +0.6Δo). 
            Uch t₂g³ elektronli konfiguratsiyada d–d o'tishlar quyidagi diagrammada ko'rsatilgan.
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-6">
            <svg viewBox="0 0 700 400" className="w-full h-auto">
              {/* Yer holati chizig'i (past) */}
              <line x1="50" y1="350" x2="200" y2="350" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4 4"/>
              <text x="50" y="370" fill="#a78bfa" fontSize="10">Erkin ion (spherical)</text>
              
              {/* Yer holati (o'rta) */}
              <line x1="230" y1="350" x2="330" y2="350" stroke="#e9d5ff" strokeWidth="1" strokeDasharray="4 4"/>
              <text x="280" y="370" fill="#a78bfa" fontSize="10" textAnchor="middle">Oₕ maydonda</text>
              
              {/* d orbital lar Oh yorilishi */}
              {/* t2g (past) */}
              <line x1="230" y1="330" x2="330" y2="330" stroke="#22d3ee" strokeWidth="3"/>
              <text x="345" y="335" fill="#22d3ee" fontSize="11" fontWeight="bold">t₂g (−0.4Δo)</text>
              <text x="230" y="325" fill="#22d3ee" fontSize="9">↑↑↑ (3 e⁻)</text>
              
              {/* eg (yuqori) */}
              <line x1="230" y1="220" x2="330" y2="220" stroke="#f472b6" strokeWidth="3"/>
              <text x="345" y="225" fill="#f472b6" fontSize="11" fontWeight="bold">eg (+0.6Δo)</text>
              
              {/* Δo strelka */}
              <line x1="200" y1="330" x2="200" y2="220" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
              <text x="180" y="280" fill="#fbbf24" fontSize="14" textAnchor="end" fontWeight="bold">Δo</text>
              <text x="180" y="295" fill="#fbbf24" fontSize="9" textAnchor="end">17 400 cm⁻¹</text>
              
              {/* Yer termi */}
              <line x1="380" y1="330" x2="480" y2="330" stroke="#22d3ee" strokeWidth="2"/>
              <text x="490" y="335" fill="#22d3ee" fontSize="11">⁴A₂g</text>
              <text x="380" y="325" fill="#22d3ee" fontSize="8">t₂g³ eg⁰</text>
              
              {/* Qo'zg'algan holatlar */}
              <line x1="380" y1="230" x2="480" y2="230" stroke="#22c55e" strokeWidth="2"/>
              <text x="490" y="235" fill="#22c55e" fontSize="11">⁴T₂g</text>
              <text x="380" y="225" fill="#22c55e" fontSize="8">t₂g² eg¹</text>
              
              <line x1="380" y1="150" x2="480" y2="150" stroke="#fbbf24" strokeWidth="2"/>
              <text x="490" y="155" fill="#fbbf24" fontSize="11">⁴T₁g(F)</text>
              
              <line x1="380" y1="70" x2="480" y2="70" stroke="#ef4444" strokeWidth="2"/>
              <text x="490" y="75" fill="#ef4444" fontSize="11">⁴T₁g(P)</text>
              
              {/* O'tish strelkalari */}
              <line x1="415" y1="325" x2="415" y2="235" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrowhead2)"/>
              <text x="405" y="285" fill="#22c55e" fontSize="9" textAnchor="end">575 nm</text>
              
              <line x1="435" y1="325" x2="435" y2="155" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrowhead3)"/>
              <text x="440" y="240" fill="#fbbf24" fontSize="9">407 nm</text>
              
              <line x1="455" y1="325" x2="455" y2="75" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrowhead4)"/>
              <text x="460" y="200" fill="#ef4444" fontSize="9">265 nm</text>

              {/* Arrow markers */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <polygon points="0 0, 10 5, 0 10" fill="#fbbf24"/>
                </marker>
                <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <polygon points="0 0, 10 5, 0 10" fill="#22c55e"/>
                </marker>
                <marker id="arrowhead3" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <polygon points="0 0, 10 5, 0 10" fill="#fbbf24"/>
                </marker>
                <marker id="arrowhead4" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <polygon points="0 0, 10 5, 0 10" fill="#ef4444"/>
                </marker>
              </defs>

              <text x="350" y="30" fill="#e9d5ff" fontSize="14" textAnchor="middle" fontWeight="bold">
                Cr³⁺ (d³) energiyalar diagrammasi
              </text>
              <text x="350" y="390" fill="#a78bfa" fontSize="10" textAnchor="middle">
                Chapda: kristall maydon yorilishi   |   O'ngda: term simvollari va o'tishlar
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-cyan-400 font-bold text-sm mb-1">t₂g orbitallari</div>
              <div className="text-xs text-[var(--v3-matn)]">dxy, dxz, dyz — 3 orbital, past energiya (−0.4Δo). Cr³⁺ da 3 elektron shu erda joylashadi.</div>
            </div>
            <div className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-4">
              <div className="text-pink-400 font-bold text-sm mb-1">eg orbitallari</div>
              <div className="text-xs text-[var(--v3-matn)]">dz², dx²−y² — 2 orbital, yuqori energiya (+0.6Δo). Qo'zg'algan holatda elektron shu erga chiqadi.</div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="text-amber-400 font-bold font-bold text-sm mb-1">Δo (10Dq)</div>
              <div className="text-xs text-[var(--v3-matn)]">17 400 cm⁻¹ = 208 kJ/mol — H₂O ligandining o'rta kuchli maydoni. NH₃ (21 500) dan pastroq.</div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 6. Δo VA RACAH B HISOBI ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧮</span> Δo va Racah B parametrini spektrdan hisoblash
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            d³ konfiguratsiyaning eng chiroyli xususiyati — <strong className="text-amber-400 font-bold">Δo va B ni to'g'ridan-to'g'ri o'lchash mumkin</strong>. 
            Bu quyidagi bosqichlarda amalga oshiriladi:
          </p>

          <div className="space-y-3">
            {[
              { step: 1, task: "Birinchi polosani topish", formula: "ν₁ = 17 400 cm⁻¹ (575 nm)", result: "Δo = ν₁ = 17 400 cm⁻¹" },
              { step: 2, task: "Ikkinchi polosani topish", formula: "ν₂ = 24 600 cm⁻¹ (407 nm)", result: "" },
              { step: 3, task: "Nisbatni hisoblash", formula: "ν₂/ν₁ = 24 600/17 400 = 1.414", result: "" },
              { step: 4, task: "T-S diagrammadan Δo/B ni topish", formula: "d³ diagrammada 1.41 nisbat → Δo/B ≈ 24", result: "" },
              { step: 5, task: "Racah B ni hisoblash", formula: "B = Δo / (Δo/B) = 17 400/24 = 725 cm⁻¹", result: "B = 725 cm⁻¹" },
              { step: 6, task: "Nefelauksetik nisbat", formula: "β = B/B₀ = 725/918 = 0.79", result: "β = 0.79 → kovalentlik!" },
              { step: 7, task: "Energiyani kJ/mol ga o'tkazish", formula: "E(kJ/mol) = 11.96 × ν̃(cm⁻¹)/1000", result: "Δo = 208 kJ/mol" },
            ].map((s, i) => (
              <div key={i} className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-4 flex gap-4 items-start">
                <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className="text-amber-300 font-bold font-semibold text-sm">{s.task}</div>
                  <div className="text-xs text-[var(--v3-matn)] mt-1 font-mono bg-purple-950/50 rounded p-2">{s.formula}</div>
                  {s.result && (
                    <div className="text-xs text-green-300 mt-2 font-bold">➜ {s.result}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-2 border-pink-500/50 rounded-2xl p-6 mt-4">
            <h3 className="text-pink-400 font-bold text-lg mb-3"> Hisob-kitob natijalari</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-[var(--v3-xira)] mb-1">Δo</div>
                <div className="text-2xl font-bold text-amber-300 font-bold">{COMPOUND.deltaOh.toLocaleString()}</div>
                <div className="text-[10px] text-purple-500">cm⁻¹</div>
              </div>
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-[var(--v3-xira)] mb-1">Δo</div>
                <div className="text-2xl font-bold text-orange-300">{COMPOUND.deltaOhKJ}</div>
                <div className="text-[10px] text-purple-500">kJ/mol</div>
              </div>
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-[var(--v3-xira)] mb-1">Racah B</div>
                <div className="text-2xl font-bold text-green-300">{COMPOUND.racahB}</div>
                <div className="text-[10px] text-purple-500">cm⁻¹</div>
              </div>
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-[var(--v3-xira)] mb-1">β (nefelauksetik)</div>
                <div className="text-2xl font-bold text-cyan-300">{COMPOUND.beta}</div>
                <div className="text-[10px] text-purple-500">B₀ = {COMPOUND.racahB0}</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300"> β &lt; 1 nima demakdir?</strong> Nefelauksetik nisbat β = 0.79 
              ekanligi Cr³⁺ va H₂O orasidagi bog'da <strong>19% kovalentlik</strong> mavjud degan xulosaga olib keladi. 
              Erkin Cr³⁺ ionida B₀ = 918 cm⁻¹, kompleksda B = 725 cm⁻¹ — chunki metall d-elektronlari qisman ligandga «tarqaladi» 
              (electron cloud expansion — «bulut kengaytiruvchi» samara, shuning uchun nom «nefelauksetik»).
            </p>
          </div>
        </div>

        {/* ═══════════════ 7. TANABE-SUGANO DIAGRAMMASI ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈</span> d³ Tanabe-Sugano diagrammasi
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            Y. Tanabe va S. Sugano (1954) tomonidan yaratilgan bu diagramma d³ konfiguratsiyaning barcha
            electron holatlarini Δo/B ga nisbatan ko'rsatadi. <strong className="text-amber-400 font-bold">[Cr(H₂O)₆]³⁺ ning holati</strong> qizil doira bilan belgilangan (Δo/B ≈ 24).
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-4">
            <svg viewBox="0 0 700 400" className="w-full h-auto">
              {/* Grid */}
              <line x1="60" y1="370" x2="670" y2="370" stroke="#a78bfa" strokeWidth="1"/>
              <line x1="60" y1="370" x2="60" y2="30" stroke="#a78bfa" strokeWidth="1"/>
              
              {/* Y axis */}
              {[10, 20, 30, 40, 50, 60, 70, 80].map((v, i) => (
                <g key={i}>
                  <text x="50" y={370 - (v/80)*340 + 4} fill="#c4b5fd" fontSize="9" textAnchor="end">{v}</text>
                  <line x1="55" y1={370 - (v/80)*340} x2="670" y2={370 - (v/80)*340} stroke="#a78bfa" strokeWidth="0.2" strokeDasharray="2 3" opacity="0.3"/>
                </g>
              ))}
              <text x="25" y="200" fill="#e9d5ff" fontSize="12" textAnchor="middle" transform="rotate(-90 25 200)" fontWeight="bold">E/B</text>
              
              {/* X axis */}
              {[0, 10, 20, 30, 40, 50].map((v, i) => (
                <g key={i}>
                  <text x={60 + (v/50)*610} y="390" fill="#c4b5fd" fontSize="9" textAnchor="middle">{v}</text>
                  <line x1={60 + (v/50)*610} y1="30" x2={60 + (v/50)*610} y2="370" stroke="#a78bfa" strokeWidth="0.2" strokeDasharray="2 3" opacity="0.3"/>
                </g>
              ))}
              <text x="365" y="405" fill="#e9d5ff" fontSize="12" textAnchor="middle" fontWeight="bold">Δo / B</text>

              {/* ⁴A₂g yer holati (horizontal at 0) */}
              <line x1="60" y1="370" x2="670" y2="370" stroke="#22d3ee" strokeWidth="2.5"/>
              <text x="660" y="365" fill="#22d3ee" fontSize="11" textAnchor="end" fontWeight="bold">⁴A₂g (ground)</text>

              {/* ⁴T₂g (linear increase) */}
              <line x1="60" y1="370" x2="670" y2="30" stroke="#22c55e" strokeWidth="2.5"/>
              <text x="660" y="35" fill="#22c55e" fontSize="11" textAnchor="end" fontWeight="bold">⁴T₂g</text>

              {/* ⁴T₁g(F) (parabola) */}
              <path d="M 60 305 Q 365 200 670 60" stroke="#fbbf24" strokeWidth="2.5" fill="none"/>
              <text x="660" y="55" fill="#fbbf24" fontSize="11" textAnchor="end" fontWeight="bold">⁴T₁g(F)</text>

              {/* ⁴T₁g(P) */}
              <path d="M 60 106 Q 365 90 670 50" stroke="#ef4444" strokeWidth="2.5" fill="none"/>
              <text x="660" y="45" fill="#ef4444" fontSize="11" textAnchor="end" fontWeight="bold">⁴T₁g(P)</text>

              {/* ²Eg (spin-taqiqlangan) */}
              <path d="M 60 300 Q 365 280 670 240" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="5 3" fill="none"/>
              <text x="660" y="235" fill="#a78bfa" fontSize="10" textAnchor="end" fontStyle="italic">²Eg (spin-taqiq)</text>

              {/* [Cr(H2O)6]3+ marker */}
              {(() => {
                const xVal = 24
                const xPos = 60 + (xVal/50)*610
                return (
                  <g>
                    <line x1={xPos} y1="30" x2={xPos} y2="370" stroke="#ec4899" strokeWidth="1" strokeDasharray="4 2" opacity="0.6"/>
                    <text x={xPos + 5} y="45" fill="#ec4899" fontSize="10" fontWeight="bold">[Cr(H₂O)₆]³⁺</text>
                    
                    {/* ⁴A₂g nuqta */}
                    <circle cx={xPos} cy="370" r="5" fill="#22d3ee" stroke="#fff" strokeWidth="1.5"/>
                    
                    {/* ⁴T₂g nuqta (Δo bilan) */}
                    <circle cx={xPos} cy={370 - (24/80)*340} r="6" fill="#fbbf24" stroke="#fff" strokeWidth="2"/>
                    <text x={xPos + 8} y={370 - (24/80)*340 + 4} fill="#fbbf24" fontSize="9" fontWeight="bold">ν₁</text>
                    
                    {/* ⁴T₁g(F) */}
                    <circle cx={xPos} cy={370 - (34/80)*340} r="6" fill="#f97316" stroke="#fff" strokeWidth="2"/>
                    <text x={xPos + 8} y={370 - (34/80)*340 + 4} fill="#f97316" fontSize="9" fontWeight="bold">ν₂</text>
                    
                    {/* ⁴T₁g(P) */}
                    <circle cx={xPos} cy={370 - (52/80)*340} r="6" fill="#ef4444" stroke="#fff" strokeWidth="2"/>
                    <text x={xPos + 8} y={370 - (52/80)*340 + 4} fill="#ef4444" fontSize="9" fontWeight="bold">ν₃</text>
                  </g>
                )
              })()}

              <text x="365" y="20" fill="#f472b6" fontSize="13" textAnchor="middle" fontWeight="bold">
                d³ Tanabe-Sugano diagrammasi (soddalashtirilgan)
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-cyan-400 font-bold text-sm mb-2">ν₁ = 17 400</div>
              <div className="text-xs text-[var(--v3-matn)]">⁴A₂g → ⁴T₂g<br/>= Δo (bevosita)</div>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
              <div className="text-orange-400 font-bold text-sm mb-2">ν₂ = 24 600</div>
              <div className="text-xs text-[var(--v3-matn)]">⁴A₂g → ⁴T₁g(F)<br/>ν₂/ν₁ = 1.414 → B ni topish</div>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-bold text-sm mb-2">ν₃ = 37 700</div>
              <div className="text-xs text-[var(--v3-matn)]">⁴A₂g → ⁴T₁g(P)<br/>Ikki elektronli, ko'p LMCT bilan</div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300"> Diagrammadan foydalanish:</strong> Vertikal chiziq Δo/B = 24 
              da chizilgan — [Cr(H₂O)₆]³⁺ ning holati. Chiziq bilan har bir term chizig'ining kesishishi shu holatning 
              E/B qiymatini beradi. Umumiy energiyani topish uchun E/B × B = E ni hisoblang. 
              Masalan: ⁴T₂g uchun E/B = 24 → E = 24 × 725 = 17 400 cm⁻¹ ✓
            </p>
          </div>
        </div>

        {/* ═══════════════ 8. INTERAKTIV BEER-LAMBERT KALKULYATORI ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Interaktiv: Beer-Lambert kalkulyatori
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            Bu kompleksning haqiqiy ε qiymatlari asosida optik zichlik va transmittansni hisoblang.
          </p>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <div className="text-amber-300 font-bold text-xl font-mono">A = ε · c · l</div>
          </div>

          {/* Polosa tanlash */}
          <div className="flex flex-wrap gap-2">
            {uvVisPeaks.filter(p => !p.hidden).map((p, i) => (
              <button
                key={i}
                onClick={() => setBlSelectedPeak(i)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  blSelectedPeak === i
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-500/30"
                    : "bg-purple-800/40 text-[var(--v3-matn)] hover:bg-purple-700/60"
                }`}
              >
                λ = {p.lambda} nm (ε={p.epsilon})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <label className="text-xs text-[var(--v3-xira)] block mb-2">Konsentratsiya (mol/L)</label>
              <input
                type="range"
                min="0.00001"
                max="0.1"
                step="0.00001"
                value={blConcentration}
                onChange={(e) => setBlConcentration(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
              <div className="text-cyan-300 text-2xl font-mono text-center mt-2">
                {blConcentration.toExponential(2)} M
              </div>
              <div className="text-xs text-[var(--v3-xira)] mt-2 text-center">
                {blConcentration < 0.0001 ? " Juda suyultirilgan (mikroko'lam)" :
                 blConcentration < 0.001 ? " Standart o'lchov oralig'i" :
                 blConcentration < 0.01 ? " Yuqori — chegara" :
                 "❌ Beer qonuni buzilishi mumkin!"}
              </div>
            </div>

            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <label className="text-xs text-[var(--v3-xira)] block mb-2">Kyuveta uzunligi (sm)</label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={blPathLength}
                onChange={(e) => setBlPathLength(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
              <div className="text-green-300 text-2xl font-mono text-center mt-2">
                {blPathLength.toFixed(1)} sm
              </div>
              <div className="text-xs text-[var(--v3-xira)] mt-2 text-center">
                {blPathLength < 0.5 ? " Mikrokyuveta" :
                 blPathLength < 1.5 ? " Standart 1 sm" :
                 blPathLength < 5 ? " Uzun kyuveta" :
                 "🌊 NIR uchun ideal"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
              <div className="text-xs text-pink-400 mb-2">Optik zichlik</div>
              <div className="text-amber-300 font-bold text-4xl font-mono font-bold">A = {blResult.A}</div>
              <div className="text-xs text-[var(--v3-matn)] mt-3">
                Formula: A = {blResult.epsilon} × {blConcentration.toExponential(2)} × {blPathLength}
              </div>
              <div className="text-xs mt-2">
                {parseFloat(blResult.A) < 0.1 ? <span className="text-red-400">🔻 Signal juda past — konsentratsiyani oshiring</span> :
                 parseFloat(blResult.A) < 0.8 ? <span className="text-green-400"> Optimal oraliqda!</span> :
                 parseFloat(blResult.A) < 1.5 ? <span className="text-amber-400 font-bold"> Yuqori — chiziqlilik yo'qolishi</span> :
                 <span className="text-red-400">🔺 Juda yuqori — suyultiring</span>}
              </div>
            </div>
            <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
              <div className="text-xs text-blue-400 mb-2">Transmittans</div>
              <div className="text-cyan-300 text-4xl font-mono font-bold">T = {blResult.T}%</div>
              <div className="text-xs text-[var(--v3-matn)] mt-3">
                T = 10⁻ᴬ × 100% (nurni namunadan o'tgan qismi)
              </div>
              <div className="text-xs mt-2 text-[var(--v3-xira)]">
                λ = {blResult.lambda} nm da o'lchov
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 9. SPEKTROXIMIK QATOR — INTERAKTIV ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Spektroximik qatorda Cr³⁺ komplekslari
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            Cr³⁺ metall ioni turli ligandlar bilan komplekslar hosil qilganda Δo va rang o'zgaradi. 
            Bu qator <strong className="text-amber-400 font-bold">Tsuchida (1938)</strong> tomonidan ilk taklif qilingan.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Ligand</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Kompleks</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Δo (cm⁻¹)</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">λ₁ (nm)</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Rang</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody>
                {spectrochemicalSeries.map((s, i) => (
                  <tr key={i} className={`border-b border-[var(--v3-chiziq)] hover:bg-pink-900/20 transition-colors ${s.current ? "bg-pink-900/30 border-l-4 border-l-pink-400" : ""}`}>
                    <td className="py-3 px-3 text-amber-300 font-bold font-mono">{s.ligand}</td>
                    <td className="py-3 px-3 text-[var(--v3-matn)] font-mono text-xs">{s.complex}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">{s.deltaOh.toLocaleString()}</td>
                    <td className="py-3 px-3 text-green-300 font-mono">{s.lambda1}</td>
                    <td className="py-3 px-3 text-xs">{s.color}</td>
                    <td className="py-3 px-3 text-xs text-[var(--v3-matn)] italic">
                      {s.current ? <strong className="text-pink-400">← BU KOMPLEKS (standart)</strong> : s.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-amber-300 font-bold text-sm font-mono text-center">
              Cr³⁺ da qator: 6 Br⁻ &lt; 6 Cl⁻ &lt; 6 F⁻ &lt; <strong className="bg-pink-500/30 px-2 rounded">6 H₂O</strong> &lt; 6 NH₃ &lt; 3 en &lt; 6 CN⁻
            </div>
            <div className="text-xs text-[var(--v3-matn)] text-center mt-2">Chapdan o'ngga Δo o'sadi (12 000 → 26 600 cm⁻¹)</div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300"> Jorgensen f va g qoidalari:</strong> Δo = f(ligand) × g(metall). 
              H₂O uchun f = 1.00 (standart), Cr³⁺ uchun g = 17.4 → Δo = 17 400 cm⁻¹. NH₃ uchun f = 1.25 → 21 500 cm⁻¹. 
              Bu empirik qoida keng qo'llaniladi.
            </p>
          </div>
        </div>

        {/* ═══════════════ 10. RANG NAZARIYASI ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎨</span> Rang nazariyasi va inson idroki
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            [Cr(H₂O)₆]³⁺ ning <strong className="text-amber-400 font-bold">binafsha rangi</strong> qanday paydo bo'ladi?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rang doirasi */}
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-3">🎡 Rang doirasi</h3>
              <svg viewBox="0 0 300 300" className="w-full h-auto">
                <defs>
                  <linearGradient id="colorWheel1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B00FF"/>
                    <stop offset="50%" stopColor="#00FF00"/>
                    <stop offset="100%" stopColor="#FFFF00"/>
                  </linearGradient>
                </defs>
                
                {/* Ranglar segmenti */}
                {[
                  { name: "Qizil", color: "#FF0000", angle: 0 },
                  { name: "To'q sariq", color: "#FF8C00", angle: 45 },
                  { name: "Sariq", color: "#FFFF00", angle: 90 },
                  { name: "Sariq-yashil", color: "#ADFF2F", angle: 135, absorbed: true },
                  { name: "Yashil", color: "#00FF00", angle: 180 },
                  { name: "Ko'k", color: "#0000FF", angle: 225 },
                  { name: "Binafsha", color: "#8B00FF", angle: 270, perceived: true },
                  { name: "Qizil-binafsha", color: "#FF00FF", angle: 315 },
                ].map((c, i) => {
                  const angle = (c.angle * Math.PI) / 180
                  const nextAngle = ((c.angle + 45) * Math.PI) / 180
                  const cx = 150, cy = 150, r1 = 60, r2 = 120
                  const x1 = cx + r1 * Math.cos(angle)
                  const y1 = cy + r1 * Math.sin(angle)
                  const x2 = cx + r2 * Math.cos(angle)
                  const y2 = cy + r2 * Math.sin(angle)
                  const x3 = cx + r2 * Math.cos(nextAngle)
                  const y3 = cy + r2 * Math.sin(nextAngle)
                  const x4 = cx + r1 * Math.cos(nextAngle)
                  const y4 = cy + r1 * Math.sin(nextAngle)
                  const midAngle = ((c.angle + 22.5) * Math.PI) / 180
                  const labelX = cx + (r2 + 15) * Math.cos(midAngle)
                  const labelY = cy + (r2 + 15) * Math.sin(midAngle)
                  
                  return (
                    <g key={i}>
                      <path
                        d={`M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 0 0 ${x1} ${y1}`}
                        fill={c.color}
                        opacity={c.absorbed || c.perceived ? "1" : "0.5"}
                        stroke={c.absorbed || c.perceived ? "#fff" : "none"}
                        strokeWidth={c.absorbed || c.perceived ? "2" : "0"}
                      />
                      <text x={labelX} y={labelY} fill="#e9d5ff" fontSize="9" textAnchor="middle">{c.name}</text>
                      {c.absorbed && (
                        <text x={labelX} y={labelY + 10} fill="#fbbf24" fontSize="8" textAnchor="middle" fontWeight="bold">↓ Yutilgan (575)</text>
                      )}
                      {c.perceived && (
                        <text x={labelX} y={labelY - 10} fill="#f472b6" fontSize="8" textAnchor="middle" fontWeight="bold">↑ Ko'ringan</text>
                      )}
                    </g>
                  )
                })}
                
                {/* Markazi */}
                <circle cx="150" cy="150" r="55" fill="#301934" stroke="#a78bfa" strokeWidth="1"/>
                <text x="150" y="145" fill="#e9d5ff" fontSize="10" textAnchor="middle" fontWeight="bold">To'ldiruvchi</text>
                <text x="150" y="160" fill="#e9d5ff" fontSize="10" textAnchor="middle" fontWeight="bold">ranglar</text>
              </svg>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
                <h4 className="text-amber-400 font-bold font-bold text-sm mb-2"> Rangning mantiq</h4>
                <ol className="text-xs text-[var(--v3-matn)] space-y-1.5 list-decimal list-inside">
                  <li>Kompleks 575 nm da <strong className="text-amber-300 font-bold">sariq-yashil</strong> yutadi (ν₁ = Δo)</li>
                  <li>Ko'z yutilmagan qismini «ko'radi»</li>
                  <li>Sariq-yashilning to'ldiruvchisi — <strong className="text-pink-400">binafsha</strong></li>
                  <li>Shuning uchun eritma binafsha ko'rinadi</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
                <h4 className="text-amber-400 font-bold font-bold text-sm mb-2"> Fizik asosi</h4>
                <p className="text-xs text-[var(--v3-matn)] leading-relaxed">
                  Yutilish spektrida <strong>bir necha polosa</strong> bo'lgani uchun aynan bitta emas, 
                  bir necha rang aralashmasi ko'rinadi. 575 nm (asosiy) + 407 nm (qo'shimcha) — 
                  ikkalasi ham qisman yutilib, natijada binafsha-purpur rang paydo bo'ladi. 
                  Bu <strong className="text-amber-300 font-bold">chiroyli optik effekt</strong> deb ataladi.
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                <div className="text-blue-400 font-bold text-sm mb-2"> Amaliy tekshiruv</div>
                <p className="text-xs text-[var(--v3-matn)]">
                  Ligandni H₂O dan NH₃ ga o'zgartirilsa (Δo = 17 400 → 21 500 cm⁻¹), 
                  yutilish 575 nm dan 465 nm ga siljiadi → yutilgan rang <em>ko'k</em>ga o'tadi, 
                  ko'ringan rang <em>binafshadan sariqqa</em> o'zgaradi. Bu spektroximik qatorning tasdig'i!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 11. NAMUNA TAYYORLASH ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Namuna tayyorlash usullari
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {techniques.map((t, i) => (
              <button 
                key={i} 
                onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  activeTechnique === i
                    ? "bg-pink-600/60 text-white border-pink-400/50 shadow-lg shadow-pink-500/20"
                    : "bg-purple-800/30 text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:bg-purple-700/40"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
            <h3 className="text-pink-400 font-bold text-lg mb-2">{techniques[activeTechnique].name}</h3>
            <p className="text-[var(--v3-matn)] text-sm mb-4 italic">{techniques[activeTechnique].description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2 text-sm">✓ Afzalliklar</h4>
                <ul className="space-y-1 text-xs text-[var(--v3-matn)]">
                  {techniques[activeTechnique].advantages.map((a, i) => <li key={i}>• {a}</li>)}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2 text-sm">✗ Kamchiliklar</h4>
                <ul className="space-y-1 text-xs text-[var(--v3-matn)]">
                  {techniques[activeTechnique].disadvantages.map((d, i) => <li key={i}>• {d}</li>)}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-[var(--v3-xira)] text-[10px] uppercase">Chastota</div>
                <div className="text-white text-xs font-mono mt-1">{techniques[activeTechnique].range}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-[var(--v3-xira)] text-[10px] uppercase">Ruxsat</div>
                <div className="text-white text-xs font-mono mt-1">{techniques[activeTechnique].resolution}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-[var(--v3-xira)] text-[10px] uppercase">Konsentratsiya</div>
                <div className="text-white text-xs mt-1">{techniques[activeTechnique].concentration}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-[var(--v3-xira)] text-[10px] uppercase">Tayyorlash</div>
                <div className="text-white text-xs mt-1">{techniques[activeTechnique].prepTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 12. HALAQIT BERUVCHI OMILLAR ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>️</span> UB-Vis tahliliga halaqit beruvchi omillar
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            Aniq spektr olish uchun quyidagi omillarni nazorat qilish zarur:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] bg-purple-950/50">
                  <th className="py-3 px-4 text-left text-[var(--v3-matn)] text-xs uppercase">Manba</th>
                  <th className="py-3 px-4 text-left text-[var(--v3-matn)] text-xs uppercase">Sohasi</th>
                  <th className="py-3 px-4 text-left text-[var(--v3-matn)] text-xs uppercase">Ta'sir</th>
                  <th className="py-3 px-4 text-left text-[var(--v3-matn)] text-xs uppercase">Jiddiylik</th>
                </tr>
              </thead>
              <tbody className="text-[var(--v3-matn)]">
                {interferences.map((iv, i) => (
                  <tr 
                    key={i} 
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-[var(--v3-chiziq)] hover:bg-purple-800/30 cursor-pointer ${activeInterference === i ? "bg-pink-900/20" : ""}`}
                  >
                    <td className="py-3 px-4 font-bold">{iv.source}</td>
                    <td className="py-3 px-4 text-xs">{iv.range}</td>
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
              <span></span> Tanlangan omilning yechimi: {interferences[activeInterference].source}
            </div>
            <p className="text-xs text-[var(--v3-matn)] leading-relaxed">{interferences[activeInterference].solution}</p>
          </div>
        </div>

        {/* ═══════════════ 13. TARIXIY XRONOLOGIYA ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📜</span> Tarixiy xronologiya
          </h2>
          <p className="text-[var(--v3-matn)] text-sm">
            [Cr(H₂O)₆]³⁺ ni tushunish yo'lida asosiy bosqichlar:
          </p>

          <div className="space-y-2">
            {historicalTimeline.map((h, i) => (
              <div key={i} className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-lg p-3 flex gap-4 items-center hover:bg-purple-900/40 transition-colors">
                <div className="text-amber-300 font-bold font-mono font-bold text-sm w-16 flex-shrink-0">{h.year}</div>
                <div className="text-[var(--v3-matn)] text-xs flex-1">{h.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 14. AMALIY AHAMIYATI ═══════════════ */}
        <div className="v3-panel-karta p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💼</span> Amaliy ahamiyati va qo'llanilishi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {applications.map((app, i) => (
              <div key={i} className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-lg p-4 flex gap-3 items-start">
                <div className="text-3xl flex-shrink-0">{app.icon}</div>
                <div>
                  <div className="text-pink-400 font-bold text-sm mb-1">{app.field}</div>
                  <div className="text-[var(--v3-matn)] text-xs">{app.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 15. XULOSA ═══════════════ */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span></span> Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-[var(--v3-matn)] list-decimal list-inside">
            <li className="pl-2"><strong className="text-pink-400">λ₁ = 575 nm (ε=13.4)</strong> — ⁴A₂g → ⁴T₂g, birinchi polosa AYNAN Δo qiymatiga teng (d³ ning unikal xususiyati)</li>
            <li className="pl-2"><strong className="text-pink-400">λ₂ = 407 nm (ε=15.6)</strong> — ⁴A₂g → ⁴T₁g(F), ikkinchi polosa Racah B ni hisoblash uchun</li>
            <li className="pl-2"><strong className="text-pink-400">Δo = 17 400 cm⁻¹ (208 kJ/mol)</strong> — H₂O ning o'rta kuchli maydoni (standart)</li>
            <li className="pl-2"><strong className="text-pink-400">Racah B = 725 cm⁻¹, β = 0.79</strong> — erkin ion B₀=918 dan pastroq → kovalentlikning aniq isboti</li>
            <li className="pl-2"><strong className="text-pink-400">Cr³⁺ (d³, ⁴A₂g yer holati)</strong> — INERT kompleks (Taube tasnifi), diamagnit emas (μ=3.87 μB)</li>
            <li className="pl-2"><strong className="text-pink-400">Rubin lazerining nazariy asosi</strong> — ²Eg → ⁴A₂g emissiyasi (694.3 nm), spin-taqiqlangan lekin fosforessent</li>
            <li className="pl-2"><strong className="text-pink-400">Binafsha rang</strong> — 575 nm da sariq-yashil yutilishi → to'ldiruvchi rang</li>
            <li className="pl-2"><strong className="text-pink-400">Werner (1893) nazariyasining klassik namunasi</strong> — 6 ta ekvivalent H₂O ligandi, Oₕ simmetriya</li>
          </ol>
        </div>

        {/* ═══════════════ 16. NAVIGATSIYA ═══════════════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-[var(--v3-matn)] transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <button 
            onClick={() => setPdfModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-500/20"
          >
            📄 PDF Hisobot yaratish
          </button>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/cr-nh3-6-cl3" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold transition-all">
            [Cr(NH₃)₆]Cl₃ →
          </Link>
        </div>

      </section>

      <footer className="border-t border-[var(--v3-chiziq)] py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 jdakimyo.uz • [Cr(H₂O)₆]Cl₃ • UB-Vis spektroskopiya moduli (premium)</p>
          <p className="mt-2 text-purple-600 text-[11px]">
            Manbalar: Lever A.B.P. — Inorganic Electronic Spectroscopy • Tanabe-Sugano (1954) • Racah (1942) • Jørgensen (1962) • Housecroft & Sharpe (2012)
          </p>
        </div>
      </footer>
    </div>
  )
}
