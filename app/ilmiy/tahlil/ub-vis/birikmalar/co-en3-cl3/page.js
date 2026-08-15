"use client"

import Link from "next/link"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"
import { useState, useMemo, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(en)₃]Cl₃ — UB-VIS SPEKTROSKOPIYA (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar:
//   • A. B. P. Lever — Inorganic Electronic Spectroscopy (2nd ed., Elsevier, 1984)
//   • A. Werner — Ber. Deutsch. Chem. Ges. 44, 1887 (1911) — Δ/Λ optik izomerlar
//   • A. Werner — Nobel mukofoti (1913)
//   • Y. Tanabe, S. Sugano — J. Phys. Soc. Japan 9, 753 (1954)
//   • G. Racah — Phys. Rev. 62, 438 (1942)
//   • H. Bethe — Ann. Physik 3, 133 (1929)
//   • C. K. Jørgensen — Absorption Spectra and Chemical Bonding (1962)
//   • R. B. Woodward, R. Hoffmann — sirkulyar dixroizm nazariyasi
//   • G. Schwarzenbach — Xelat effekti (1952)
//   • Housecroft & Sharpe — Inorganic Chemistry (4th ed., 2012)
// Til: 100% o'zbek (lotin)
// Xususiyat: Optik izomerlar (Δ/Λ), CD spektroskopiya, xelat effekti, D₃ simmetriya
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(en)<sub>3</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Co(en)3]Cl3",
  formulaCation: "[Co(en)<sub>3</sub>]<sup>3+</sup>",
  iupac: "Tris(etilendiamin)kobalt(III) xlorid",
  commonName: "[Co(en)₃]Cl₃ (sariq-oltinsimon)",
  historicalName: "Werner optik izomer klassikasi (1911) — birinchi ajratilgan enantiomerlar",
  molarMass: 345.52,
  casNumber: "13408-73-6",
  color: "sariq-to'q sariq (Luteo dan bir oz to'qroq)",
  colorHex: "#FFB800",
  absorbedHex: "#8000FF",
  structure: "Oktaedr (D₃ simmetriya, C₃ aylanish o'qi)",
  metalCenter: "Co³⁺",
  dConfig: "d⁶ LS",
  spinState: "Past spin (S = 0)",
  groundTerm: "¹A₁ (D₃ da, ¹A₁g Oh dan)",
  freeIonTerm: "⁵D → ¹A₁g (Oh, LS) → ¹A₁ (D₃)",
  ligand: "3 × en (etilendiamin, H₂N–CH₂–CH₂–NH₂, bidentat)",
  denticity: "6 (3 × bidentat en)",
  chelateRings: "3 ta 5-a'zoli halqa (Co–N–C–C–N)",
  crystalSystem: "Kubik yoki trigonal",
  spaceGroup: "P4₁3₂ (D-shakl) / P4₃3₂ (L-shakl)",
  pointGroup: "D₃ (C₃ o'q + 3 C₂ o'q)",
  bondLengthCoN: "1.965 Å (Co–N)",
  bondLengthCC: "1.52 Å (C–C, etilen ko'prigi)",
  biteAngle: "85° (N–Co–N, xelat halqasi)",
  deltaOh: 21550,
  deltaOhKJ: 258,
  racahB: 615,
  racahB0: 1100,
  beta: 0.559,
  pairingEnergy: 21000,
  cfseValue: "-2.4Δₒ + 2P (LS)",
  cfseKJ: 404,
  magneticMoment: 0,
  stabilityConstant: "log β₃ = 48.7 (juda barqaror)",
  chelateEffect: "ΔG = −45 kJ/mol xelatga bog'liq (Luteo bilan solishtirganda)",
  ligandField: "en — kuchli σ-donor (NH₃ ga o'xshash + xelat halqasi)",
  isomerism: "Δ (o'ng aylanuvchan) va Λ (chap aylanuvchan) — optik izomerlar",
  discovery: "1856 (Levinstein en ni sintez), 1911 (Werner Δ/Λ ni ajratdi)",
  applications: "Optik faol katalizator, biomimetic, kiral tanlash",
}

// ═══════════════════════════════════════════════════════════════════════════════
// UB-VIS CHO'QQILARI — BATAFSIL ILMIY IZOHLAR
// ═══════════════════════════════════════════════════════════════════════════════
const uvVisPeaks = [
  {
    lambda: 465, energy: 21505, wavenumber: 21505, epsilon: 87,
    transition: "¹A₁ → ¹T₁g (D₃ da ¹A₂ + ¹E)",
    transitionType: "d–d (singlet-singlet)",
    color: "text-yellow-400",
    intensity: "O'rta", intensityCode: 2,
    symmetryLabel: "Oh ¹T₁g → D₃ da ¹A₂ + ¹E (kichik yorilish)",
    selection: "Spin ruxsat (ΔS=0), Laport TAQIQ — vibronik ruxsat",
    vibronicNote: "D₃ da 'e' vibronik moda orqali qisman ruxsat, xelat halqa hissa qo'shadi",
    energyKJ: 258,
    diagnostic: " Birinchi asosiy d–d polosa — Luteo (475 nm) dan biroz batokromik siljigan",
    theoryNote: "¹A₁ → ¹T₁g o'tishi Luteo dagiga o'xshash, lekin D₃ simmetriya tufayli ¹T₁g nozik yoriladi (¹A₂ + ¹E). Yorilish juda kichik (~200 cm⁻¹) — chunki 3 ta en xelat ligandi o'zaro simmetrik joylashgan. Δo Luteo (22 900) dan pastroq (21 500) — bu paradoks: en NH₃ dan kuchliroq bo'lishi kerak edi, lekin xelat halqasi 5-a'zoli va bite angle 85° (ideal 90° dan past) — ligand orbitallari to'g'ri joylashmaydi va Δo biroz pasayadi. Bu 'xelat cheklovi' deb ataladi. ε qiymati Luteo (60) dan yuqori (87) — chunki D₃ simmetriyada Laport taqiqi biroz zaifroq (i markazi yo'q).",
    lambdaMax_range: "460–470 nm",
    freqRange: "21 200–21 700 cm⁻¹"
  },
  {
    lambda: 340, energy: 29412, wavenumber: 29412, epsilon: 78,
    transition: "¹A₁ → ¹T₂g (D₃ da ¹A₁ + ¹E)",
    transitionType: "d–d (singlet-singlet)",
    color: "text-orange-400",
    intensity: "O'rta", intensityCode: 2,
    symmetryLabel: "Oh ¹T₂g → D₃ da ¹A₁ + ¹E",
    selection: "Spin ruxsat, Laport taqiq — vibronik ruxsat",
    vibronicNote: "D₃ yorilishi juda kichik",
    energyKJ: 351,
    diagnostic: " Racah B ni hisoblash uchun ν₂ polosa",
    theoryNote: "Ikkinchi d–d polosa ¹A₁ → ¹T₂g o'tishi. Luteo dagi 340 nm ga juda yaqin, chunki bu polosa asosan Δo va Racah B ga bog'liq va xelat halqasi ta'siri kichik. ν₂ − ν₁ = 29 412 − 21 505 = 7907 cm⁻¹ → B = 7907/12 ≈ 659 cm⁻¹ (aniq eksp: 615). β = 615/1100 = 0.56 — Luteo ga o'xshash. Xelat effekti B ni deyarli o'zgartirmaydi, chunki en va NH₃ ikkalasi ham σ-donor. Farq faqat entropiyaviy (xelat effekti: uchta erkin NH₃ o'rniga bitta en → entropiya samarali).",
    lambdaMax_range: "335–345 nm",
    freqRange: "29 000–29 900 cm⁻¹"
  },
  {
    lambda: 210, energy: 47619, wavenumber: 47619, epsilon: 25000,
    transition: "LMCT (N → Co) + IL(en)",
    transitionType: "LMCT + Ligand ichi",
    color: "text-red-500",
    intensity: "Juda kuchli", intensityCode: 4,
    symmetryLabel: "π(N) → t₂g + en C-C σ→σ*",
    selection: "Laport RUXSAT + spin ruxsat",
    vibronicNote: "To'liq ruxsat etilgan",
    energyKJ: 570,
    diagnostic: " LMCT — Luteo dagiga o'xshash",
    theoryNote: "NH₃ dan LMCT — Luteo dagi 210 nm ga o'xshash. Farq: en ligandidagi C–H va C–C bog'lari qo'shimcha ligand ichi (IL) tasmalar beradi (σ→σ*). Ular UB soha (< 210 nm) da joylashadi va odatda H₂O erituvchi bilan qoplanadi (H₂O cutoff 190 nm). Vakuum-UB (VUV) yoki maxsus kvarts kyuveta kerak. ε ≈ 25 000 M⁻¹·sm⁻¹ — d–d dan ~300 marta kuchli.",
    lambdaMax_range: "200–220 nm",
    freqRange: "45 000–50 000 cm⁻¹"
  },
  {
    lambda: 730, energy: 13698, wavenumber: 13698, epsilon: 0.03,
    transition: "¹A₁ → ³T₁g (spin-taqiq)",
    transitionType: "d–d (SPIN-TAQIQLANGAN)",
    color: "text-gray-400",
    intensity: "Juda zaif", intensityCode: 1,
    symmetryLabel: "Singlet → triplet",
    selection: "ΔS ≠ 0 — spin taqiqlangan",
    vibronicNote: "SOC orqali",
    energyKJ: 164,
    diagnostic: "LS holatining tasdig'i",
    theoryNote: "Spin-taqiqlangan yelka — Luteo dagiga o'xshash. Qattiq holatda yoki past haroratda (77 K) kuzatiladi. Bu polosaning mavjudligi LS holatning yana bir isboti.",
    lambdaMax_range: "720–740 nm",
    freqRange: "13 500–13 900 cm⁻¹",
    hidden: true
  },
]

// TO'LIQ SPEKTR NUQTALARI
const uvVisSpectrum = [
  { lambda: 200, absorbance: 4.8 }, { lambda: 210, absorbance: 4.6 },
  { lambda: 225, absorbance: 3.5 }, { lambda: 240, absorbance: 2.2 },
  { lambda: 260, absorbance: 1.4 }, { lambda: 280, absorbance: 0.7 },
  { lambda: 300, absorbance: 0.4 }, { lambda: 320, absorbance: 0.55 },
  { lambda: 340, absorbance: 0.85 }, { lambda: 360, absorbance: 0.62 },
  { lambda: 380, absorbance: 0.35 }, { lambda: 400, absorbance: 0.30 },
  { lambda: 420, absorbance: 0.55 }, { lambda: 440, absorbance: 0.85 },
  { lambda: 465, absorbance: 0.95 }, { lambda: 485, absorbance: 0.72 },
  { lambda: 510, absorbance: 0.42 }, { lambda: 540, absorbance: 0.20 },
  { lambda: 580, absorbance: 0.08 }, { lambda: 620, absorbance: 0.04 },
  { lambda: 650, absorbance: 0.03 }, { lambda: 700, absorbance: 0.02 },
  { lambda: 730, absorbance: 0.02 }, { lambda: 780, absorbance: 0.02 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CD (SIRKULYAR DIXROIZM) SPEKTRI — Δ VA Λ IZOMERLAR
// ═══════════════════════════════════════════════════════════════════════════════
const cdSpectrum = [
  { lambda: 350, delta_epsilon_D: 0.1, delta_epsilon_L: -0.1 },
  { lambda: 400, delta_epsilon_D: 0.4, delta_epsilon_L: -0.4 },
  { lambda: 430, delta_epsilon_D: 1.5, delta_epsilon_L: -1.5 },
  { lambda: 465, delta_epsilon_D: 1.9, delta_epsilon_L: -1.9 },  // Ekstremum
  { lambda: 490, delta_epsilon_D: -0.8, delta_epsilon_L: 0.8 },  // Belgi o'zgaradi
  { lambda: 520, delta_epsilon_D: -1.6, delta_epsilon_L: 1.6 },  // Ekstremum
  { lambda: 550, delta_epsilon_D: -0.7, delta_epsilon_L: 0.7 },
  { lambda: 600, delta_epsilon_D: -0.2, delta_epsilon_L: 0.2 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// XELAT EFFEKTI TAQQOSLASH — [Co(NH₃)₆]³⁺ vs [Co(en)₃]³⁺
// ═══════════════════════════════════════════════════════════════════════════════
const chelateComparison = [
  { property: "Ligand", nh3: "6 × NH₃ (monodentat)", en: "3 × en (bidentat)", winner: "en" },
  { property: "Δo (cm⁻¹)", nh3: "22 900", en: "21 550", winner: "NH₃ biroz katta" },
  { property: "Racah B", nh3: "615", en: "615", winner: "Tenglik" },
  { property: "β", nh3: "0.559", en: "0.559", winner: "Tenglik" },
  { property: "Barqarorlik doimiy log β", nh3: "log β₆ = 4.28 (NH₃)", en: "log β₃ = 48.7", winner: "🏆 en (Δlog = 44!)" },
  { property: "ΔG hosil bo'lish (kJ/mol)", nh3: "−24", en: "−278", winner: "🏆 en (11× barqaror)" },
  { property: "Xelat halqasi soni", nh3: "0", en: "3 ta 5-a'zoli", winner: "en" },
  { property: "Entropiya ΔS (J/K·mol)", nh3: "≈ 0", en: "+240 (uch en → uch molekula)", winner: "🏆 en (entropiya samarali)" },
  { property: "Optik izomer", nh3: "Yo'q (Oh)", en: "🌀 Δ va Λ (D₃)", winner: "🏆 en" },
  { property: "Reaktsion tezligi", nh3: "Juda inert", en: "Yanada inertroq (xelat)", winner: "en" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// XELAT EFFEKTI FIZIK ASOSI
// ═══════════════════════════════════════════════════════════════════════════════
const chelateEffectSteps = [
  { step: 1, task: "Termodinamik afzallik", detail: "ΔG = ΔH − TΔS. Xelat halqada ΔH ≈ NH₃ ga o'xshash, lekin ΔS juda katta (+240 J/K·mol)" },
  { step: 2, task: "Entropiya samarali", detail: "1 en + 2 NH₃ chiqib ketishi = 3 molekula → 3 → 3 emas! [Co(NH₃)₄(en)] + en → 4 molekula → 3 molekula (Δn > 0 → ΔS > 0)" },
  { step: 3, task: "Statistik omil", detail: "Xelat halqasi mavjud bo'lgan ligand yaqinlashishi statistik jihatdan afzalroq. Halqa hosil bo'lishi tez, uzilishi sekin" },
  { step: 4, task: "5-a'zoli halqa optimal", detail: "5-a'zoli halqa (Co-N-C-C-N) eng barqaror. Zo'rlanishlar minimal. 6-a'zoli (propilendiamin) yoki 4-a'zoli halqalar kamroq barqaror" },
  { step: 5, task: "Bite angle 85°", detail: "N–Co–N burchagi ideal 90° dan biroz kichik → Δo biroz pasayadi. Ammo bu xelat afzalligiga qaraganda kichik samarali" },
  { step: 6, task: "Statistik yozuvchilar", detail: "Schwarzenbach (1952): xelat halqa har bir qo'shimcha 10³−10⁵ marta barqarorlashtiradi (log β oshadi)" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// OPTIK IZOMERLAR: Δ vs Λ (ABSOLUT KONFIGURATSIYA)
// ═══════════════════════════════════════════════════════════════════════════════
const opticalIsomers = [
  {
    label: "Δ (Delta)",
    name: "O'ng aylanuvchan",
    rotation: "+ (dextro)",
    color: "text-pink-400",
    hex: "#ec4899",
    description: "Uch xelat halqasi soat yo'nalishida joylashgan (o'ng vintli helis)",
    cdSign: "+ (menfiy) pastda (~465 nm), − (musbat) yuqorida (~520 nm)",
    opticalRotation: "α_D = +125° (10⁻² M, H₂O, 25°C, 589 nm)",
    convention: "IUPAC (2005): C₃ o'qi bo'ylab qaralganda, xelat halqalar soat yo'nalishida"
  },
  {
    label: "Λ (Lambda)",
    name: "Chap aylanuvchan",
    rotation: "− (levo)",
    color: "text-blue-400",
    hex: "#3b82f6",
    description: "Uch xelat halqasi soat yo'nalishiga qarshi joylashgan (chap vintli helis)",
    cdSign: "− (musbat) pastda, + (menfiy) yuqorida",
    opticalRotation: "α_D = −125° (rasemikning teskarisi)",
    convention: "IUPAC (2005): C₃ o'qi bo'ylab qaralganda, xelat halqalar teskari yo'nalishda"
  }
]

// ═══════════════════════════════════════════════════════════════════════════════
// AJRATISH USULLARI (Δ va Λ ni ajratish)
// ═══════════════════════════════════════════════════════════════════════════════
const resolutionMethods = [
  {
    name: "Werner klassik usuli (1911)",
    reagent: "d-tartrat (D-vinnaya turshi)",
    principle: "d-tartrat bilan diastereomer tuzlar hosil qiladi: Δ·d-tartrat va Λ·d-tartrat — turli erish qobiliyati",
    conditions: "H₂O, 25°C, kristallizatsiya",
    yield: "50/50 % (nazariy)",
    year: "1911",
    note: "Birinchi tarixiy usul — Werner Nobel mukofoti asos"
  },
  {
    name: "Bromokamfora sulfonati",
    reagent: "(+)- yoki (−)-bromkamfora sulfonati",
    principle: "Ion o'zgarish orqali diastereomer tuz hosil qilish",
    conditions: "H₂O yoki MeOH, 4°C",
    yield: "40-45 %",
    year: "1930",
    note: "Zamonaviy usul — yaxshiroq yield"
  },
  {
    name: "CD spektroskopiya",
    reagent: "yo'q (spektral usul)",
    principle: "Δ va Λ turli CD signali beradi — sof izomerni tanish",
    conditions: "H₂O, 200-800 nm, 1 sm kyuveta",
    yield: "Analitik usul (ajratmaydi, tanidadi)",
    year: "1965-",
    note: "Zamonaviy tekshirish standarti"
  },
  {
    name: "Chiral HPLC ustuni",
    reagent: "Kiral statsionar faza (masalan, Chiralpak)",
    principle: "Δ va Λ ustunda turlicha ushlanadi",
    conditions: "H₂O/MeCN, 25°C",
    yield: "> 95 % (yuqori sofl.)",
    year: "1990-",
    note: "Eng yuqori aniqlik va sifat"
  },
]

// SPEKTROXIMIK QATOR (Co3+ ligandlar)
const spectrochemicalSeries = [
  { ligand: "6 F⁻", complex: "[CoF₆]³⁻", deltaOh: 13100, spin: "HS", lambda1: 763, color: "havorang", current: false },
  { ligand: "6 Cl⁻", complex: "[CoCl₆]³⁻", deltaOh: 15000, spin: "LS", lambda1: 667, color: "ko'k-yashil", current: false },
  { ligand: "6 H₂O", complex: "[Co(H₂O)₆]³⁺", deltaOh: 18200, spin: "LS", lambda1: 550, color: "havorang", current: false },
  { ligand: "3 en", complex: "[Co(en)₃]³⁺", deltaOh: 21550, spin: "LS", lambda1: 465, color: "sariq-oltin", current: true },
  { ligand: "6 NH₃", complex: "[Co(NH₃)₆]³⁺", deltaOh: 22900, spin: "LS", lambda1: 475, color: "sariq", current: false },
  { ligand: "6 CN⁻", complex: "[Co(CN)₆]³⁻", deltaOh: 33500, spin: "LS", lambda1: 313, color: "och sariq", current: false },
]

// HS vs LS (Luteo dagi kabi)
const spinComparison = [
  { property: "Elektron konfiguratsiya", hs: "t₂g⁴ eg²", ls: "t₂g⁶ eg⁰", thisCompound: "LS ✓" },
  { property: "Toq elektronlar", hs: "4 ta", ls: "0 ta", thisCompound: "0 ✓" },
  { property: "Spin (S)", hs: "S = 2", ls: "S = 0", thisCompound: "S = 0" },
  { property: "Yer holati termi", hs: "⁵T₂g", ls: "¹A₁g", thisCompound: "¹A₁ (D₃)" },
  { property: "Magnit moment (μB)", hs: "4.90", ls: "0.00 (diamagnit)", thisCompound: "0.00 ✓" },
  { property: "Δo kutilgan", hs: "< P (< 21 000)", ls: "> P (> 21 000)", thisCompound: "21 550 > 21 000 ✓" },
  { property: "Reaktsion tezligi", hs: "Labil", ls: "Inert", thisCompound: "Xelat + LS → juda inert" },
]

// NAMUNA TAYYORLASH
const techniques = [
  {
    name: "Suvli eritma (H₂O)",
    description: "Kompleks suvda yaxshi eriydi. 10⁻³ M standart konsentratsiya.",
    advantages: ["Universal", "Inert (akvatsiya sekin)", "Optik faol", "Standart o'lchov"],
    disadvantages: ["3+ kation gidrolizi", "Optik izomerlar rasemizatsiya (sekin)", "pH ta'siri"],
    bestFor: "Standart tahlil, Δo va β aniqlash",
    range: "200–800 nm", resolution: "0.5 nm", concentration: "10⁻³ M", prepTime: "5 daq"
  },
  {
    name: "CD spektroskopiya (Δ yoki Λ)",
    description: "Sirkulyar dixroizm — Δ va Λ optik izomerlarni ajratish uchun.",
    advantages: ["Absolut konfiguratsiya", "Diagnostik", "Kiraliq isbotini beradi", "Enantiomer sofligini o'lchaydi"],
    disadvantages: ["Maxsus spektrometr (JASCO, Aviv)", "Yuqori sofl. talab", "Rasemik da signal 0"],
    bestFor: "Enantiomer tahlil, absolut konfiguratsiya",
    range: "200–800 nm", resolution: "0.2 nm", concentration: "10⁻³ M", prepTime: "10 daq"
  },
  {
    name: "0.1 M HCl (rasemizatsiyani bostirish)",
    description: "Kislotali muhit optik izomerlarning rasemizatsiyasini sekinlashtiradi.",
    advantages: ["Rasemizatsiya sekin", "24 soat stabil", "Enantiomerlarni saqlaydi"],
    disadvantages: ["HCl xavfsizlik", "Cl⁻ UB da yutadi"],
    bestFor: "Optik izomer o'lchovi, uzoq muddatli",
    range: "220–800 nm", resolution: "0.5 nm", concentration: "10⁻³ M", prepTime: "10 daq"
  },
  {
    name: "DRS (qattiq kristall)",
    description: "Sariq-oltin kristall kukun BaSO₄ (10%) bilan.",
    advantages: ["Kristall panjara ta'siri", "Original rang", "Barqaror", "Rasemizatsiya yo'q"],
    disadvantages: ["Kubelka-Munk konversiya", "ε bilvosita", "CD ni bermaydi"],
    bestFor: "Solid-state o'lchov",
    range: "200–2500 nm", resolution: "1 nm", concentration: "5-10% BaSO₄", prepTime: "10 daq"
  },
]

// HALAQIT BERUVCHI OMILLAR
const interferences = [
  {
    source: "Optik izomer rasemizatsiya",
    range: "Butun spektr",
    effect: "Δ ↔ Λ o'zgarishi (issiqlikda, ishqorda tez) — CD signali 0 ga tushadi",
    severity: "Yuqori",
    solution: "0.1 M HCl da saqlash. Sovutish (4°C). Yorug'likdan himoya qilish. Yangi eritma har o'lchovda."
  },
  {
    source: "Xelat halqa proton transfer",
    range: "pH-bog'liq",
    effect: "pH > 10 da en ligandi protonsizlanadi va koordinatsiya o'zgaradi",
    severity: "O'rta",
    solution: "Neytral yoki bir oz kislotali muhit (pH 4-7). NaOH dan qochish."
  },
  {
    source: "LMCT polosaning kuchi",
    range: "< 250 nm",
    effect: "ε ≈ 25 000 — d–d ni bosadi, UB soha to'yingan",
    severity: "Yuqori",
    solution: "d–d o'lchov uchun 10⁻³ M, LMCT uchun 10⁻⁵ M. Suyultirish egri chizig'i."
  },
  {
    source: "Co(II) aralashmasi",
    range: "500-550 nm",
    effect: "[Co(en)₃]²⁺ pushti (ε≈8) — d⁷, boshqa spektr",
    severity: "O'rta",
    solution: "Sintezda H₂O₂ ni to'liq ta'sir. Sof kristall (qayta kristallizatsiya)."
  },
  {
    source: "Erkin en ligandi",
    range: "220-240 nm",
    effect: "En o'zi π→σ* polosa berdi, LMCT ni buzadi",
    severity: "O'rta",
    solution: "Qayta kristallizatsiya. Element analiz (EA) bilan sofligini tekshirish."
  },
  {
    source: "Rasemizatsiya (Bailar mexanizmi)",
    range: "CD spektrida",
    effect: "Trigonal buzilish orqali Δ ↔ Λ o'zgaradi (k ≈ 10⁻⁴ s⁻¹, 25°C, pH 7)",
    severity: "O'rta",
    solution: "T ↓ (4°C), yangi tayyorlash. CD signalini vaqti-vaqti bilan tekshirish."
  },
  {
    source: "Konsentratsiya (Beer buzilishi)",
    range: "λmax da",
    effect: "c > 10⁻² M da agregatsiya, ε chiziqli emas",
    severity: "O'rta",
    solution: "10⁻³ – 10⁻⁴ M ishlash. Kalibrash egri chizig'ini o'lchash."
  },
  {
    source: "Yoruglik ta'sirida foto-rasemizatsiya",
    range: "UB polosada",
    effect: "hv (250-350 nm) → tez rasemizatsiya",
    severity: "Past",
    solution: "Qorong'uda saqlash. Tez o'lchov. UB filtr."
  },
]

// TARIXIY XRONOLOGIYA
const historicalTimeline = [
  { year: "1856", event: "C. A. Wurtz etilendiamin (en) ni birinchi bo'lib sintez qildi" },
  { year: "1889", event: "S. M. Jørgensen [Co(en)₃]Cl₃ ni sintez qildi, lekin optik izomerlarni bilmadi" },
  { year: "1893", event: "A. Werner koordinatsion nazariya — oktaedr strukturasi tabriflandi" },
  { year: "1911", event: "🏆 A. Werner Δ va Λ enantiomerlarni AJRATDI (d-tartrat bilan) — Ber. Deutsch. Chem. Ges. 44, 1887" },
  { year: "1911", event: "Werner: [Co(en)₃]³⁺ optik aktivligi metall markazidan kelib chiqishini isbotladi (Karbon markazsiz kirallik!)" },
  { year: "1913", event: "🏆 A. Werner Nobel mukofoti — bu tajriba markaziy dalil edi" },
  { year: "1929", event: "H. Bethe kristall maydon nazariyasi — D₃ simmetriya matematik izohi" },
  { year: "1952", event: "🏆 G. Schwarzenbach xelat effekti termodinamikasi — [Co(en)₃] etaloni" },
  { year: "1954", event: "Y. Tanabe, S. Sugano d⁶ diagrammasi — bu kompleksda ishlaydi" },
  { year: "1962", event: "Legrand-Grosjean: sof Δ va Λ CD spektrlarini o'lchash" },
  { year: "1965", event: "Bailar-Trigonal mexanizm — rasemizatsiya nazariyasi" },
  { year: "1970-", event: "Absolut konfiguratsiya XRD bilan aniqlangan (D vs L)" },
  { year: "2005", event: "IUPAC yangi tavsiya: Δ (klokwise) va Λ (anti-clockwise) — C₃ o'q bo'ylab qaralganda" },
  { year: "2026", event: "🎓 O'zbekistonda jdakimyo.uz platformasida o'zbek tilida taqdimot" },
]

// AMALIY AHAMIYATI
const applications = [
  { field: "Optik faol kataliz", detail: "Enantiomerik sof kompleks kiral organik sintezda kataliz sifatida (masalan, epoksidlash)", icon: "⚗️" },
  { field: "Werner Nobel klassikasi", detail: "Metall markazidagi kirallik dalili — karbon markazsiz optik aktivlik namunasi", icon: "🏆" },
  { field: "Xelat effekti tadqiqoti", detail: "Barcha xelat komplekslar barqarorligining etaloni. log β₃ = 48.7 → 44 marta NH₃ dan yuqori", icon: "🔗" },
  { field: "CD spektroskopiya standarti", detail: "Enantiomer analitikasi uchun benchmark, JASCO va Aviv kompaniyalari sinash uchun ishlatadi", icon: "🌀" },
  { field: "Biomimetik model", detail: "Fermentlar aktiv markazidagi metall ionni modellashtirish (met-DNA, gemoglobin)", icon: "" },
  { field: "Kiral tanlash reagent", detail: "Bio molekulalarda (aminokislotalar, DNA) kiral atrofni tekshirish", icon: "" },
  { field: "DFT/TDDFT benchmark", detail: "D₃ simmetriyali kompleks nazariy hisoblashlar uchun standart", icon: "💻" },
  { field: "Ta'lim namunasi", detail: "Barcha darsliklarda 'metall kirallik' bo'limining boshqi", icon: "🎓" },
]

export default function CoEn3Cl3UVVis() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [showHeader, setShowHeader] = useState(true)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(0)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [showSpinForbidden, setShowSpinForbidden] = useState(false)
  const [showLMCT, setShowLMCT] = useState(true)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfProgress, setPdfProgress] = useState(0)
  const [selectedIsomer, setSelectedIsomer] = useState("D") // D or L
  const [showBothIsomers, setShowBothIsomers] = useState(true)
  const [activeResolution, setActiveResolution] = useState(0)

  // Beer-Lambert kalkulyator
  const [blConcentration, setBlConcentration] = useState(0.001)
  const [blPathLength, setBlPathLength] = useState(1)
  const [blSelectedPeak, setBlSelectedPeak] = useState(0)

  // Xelat vs NH₃ interaktiv kalkulyator (log β)
  const [chelateRingsCount, setChelateRingsCount] = useState(3)

  const spectrumRef = useRef(null)
  const visiblePeaks = uvVisPeaks.filter(p => !p.hidden || showSpinForbidden)

  // Optik zichlik hisoblash
  const blResult = useMemo(() => {
    const peak = uvVisPeaks[blSelectedPeak]
    const A = peak.epsilon * blConcentration * blPathLength
    const T = Math.pow(10, -A) * 100
    return { A: A.toFixed(3), T: T.toFixed(2), lambda: peak.lambda, epsilon: peak.epsilon }
  }, [blConcentration, blPathLength, blSelectedPeak])

  // Xelat effekt simulyator
  const chelateSim = useMemo(() => {
    // log β = log β(NH₃) × n + xelat qo'shimchasi
    const nh3Baseline = 4.28 // 6NH₃ uchun log β
    const perChelate = 14.8  // Har xelat halqa uchun qo'shimcha
    const logBeta = nh3Baseline + chelateRingsCount * perChelate
    const stabilityFactor = Math.pow(10, chelateRingsCount * perChelate).toExponential(1)
    return { logBeta: logBeta.toFixed(1), stabilityFactor, ringsCount: chelateRingsCount }
  }, [chelateRingsCount])

  // Racah B hisoblash
  const racahCalc = useMemo(() => {
    const nu1 = uvVisPeaks[0].wavenumber
    const nu2 = uvVisPeaks[1].wavenumber
    const diff = nu2 - nu1
    const B = diff / 12
    const B0 = 1100
    const beta = B / B0
    return { nu1, nu2, diff, B: B.toFixed(0), B0, beta: beta.toFixed(3), deltaOh: 21550 }
  }, [])

  const spectrumPath = useMemo(() => {
    const W = 800, H = 300, lambdaMin = 200, lambdaMax = 780, absMax = 5.0
    const points = uvVisSpectrum.map(p => {
      const x = ((p.lambda - lambdaMin) / (lambdaMax - lambdaMin)) * W
      const y = H - (p.absorbance / absMax) * H
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    return `M ${points.join(" L ")}`
  }, [])

  // CD spektri path
  const cdPath = useMemo(() => {
    const W = 800, H = 200, lambdaMin = 300, lambdaMax = 620, deMax = 2.5
    const zeroY = H / 2
    const generatePath = (isomer) => {
      const points = cdSpectrum.map(p => {
        const x = ((p.lambda - lambdaMin) / (lambdaMax - lambdaMin)) * W
        const de = isomer === "D" ? p.delta_epsilon_D : p.delta_epsilon_L
        const y = zeroY - (de / deMax) * (H / 2)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      return `M ${points.join(" L ")}`
    }
    return { D: generatePath("D"), L: generatePath("L"), zeroY }
  }, [])

  // PDF eksport
  const cleanText = (str) => {
    if (str === null || str === undefined) return ""
    return String(str).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/\s+/g, " ").trim()
  }

  const generatePDF = async () => {
    setPdfGenerating(true); setPdfProgress(0)
    try {
      const { PDFDocument, rgb } = await import("pdf-lib")
      const fontkit = (await import("@pdf-lib/fontkit")).default
      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)
      setPdfProgress(10)

      let regularFont, boldFont, italicFont
      try {
        const regularBytes = await fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer() })
        const boldBytes = await fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer() })
        const italicBytes = await fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer() })
        regularFont = await pdfDoc.embedFont(regularBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(boldBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(italicBytes, { subset: true })
      } catch { alert("Font yuklanmadi. public/fonts/ da DejaVuSans*.ttf bo'lishi shart."); setPdfGenerating(false); return }
      setPdfProgress(20)

      const C = {
        gold: rgb(1.0, 0.72, 0.03), goldDeep: rgb(0.60, 0.45, 0.02),
        pink: rgb(0.85, 0.30, 0.55), pinkDeep: rgb(0.55, 0.10, 0.40),
        purple: rgb(0.30, 0.11, 0.58), purpleDeep: rgb(0.15, 0.08, 0.35),
        purpleMid: rgb(0.55, 0.35, 0.85), purpleLight: rgb(0.86, 0.78, 1.0),
        blue: rgb(0.08, 0.35, 0.75), blueDeep: rgb(0.05, 0.20, 0.55),
        cyan: rgb(0.05, 0.65, 0.75), yellow: rgb(0.95, 0.75, 0.05),
        textDark: rgb(0.08, 0.08, 0.16), textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47), orange: rgb(0.86, 0.55, 0),
        green: rgb(0.08, 0.55, 0.31), red: rgb(0.80, 0.20, 0.20),
        grayLine: rgb(0.78, 0.78, 0.86), bgPurple: rgb(0.97, 0.94, 1.0),
        bgPink: rgb(1.0, 0.94, 0.97), bgGold: rgb(1.0, 0.96, 0.80),
        bgBlue: rgb(0.94, 0.98, 1.0), bgGreen: rgb(0.94, 1.0, 0.98),
        white: rgb(1, 1, 1),
      }

      const PAGE_W = 595.28, PAGE_H = 841.89, MARGIN = 50
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30

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
        lines.forEach((line, i) => page.drawText(line, { x, y: sy - i * lh, size, font, color }))
        return lines.length * lh
      }
      const addFooter = () => {
        const dateStr = new Date().toLocaleDateString("uz-UZ")
        const leftText = truncate(`jdakimyo.uz UB-Vis Tahlili  •  [Co(en)₃]Cl₃  •  ${dateStr}`, regularFont, 8, CONTENT_W - 30)
        page.drawText(leftText, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        const pageStr = `${pageNum}`
        const w = measure(pageStr, regularFont, 8)
        page.drawText(pageStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        page.drawLine({ start: { x: MARGIN, y: FOOTER_Y + 12 }, end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 }, thickness: 0.3, color: C.grayLine })
      }
      const addNewPage = () => { addFooter(); page = pdfDoc.addPage([PAGE_W, PAGE_H]); pageNum++; y = PAGE_H - MARGIN }
      const checkPageBreak = (need) => { if (y - need < FOOTER_Y + 25) addNewPage() }
      const drawSectionHeader = (num, title) => {
        checkPageBreak(45)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.gold })
        safeText(`${num}. ${title}`, { x: MARGIN + 10, y: y - 14, size: 13, font: boldFont, color: C.goldDeep, maxWidth: CONTENT_W - 15 })
        y -= 24
        page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.5, color: C.grayLine })
        y -= 14
      }
      const drawTableRow = (label, value, bgColor = C.bgGold, labelColor = C.goldDeep) => {
        const rowH = 20, labelW = 200
        checkPageBreak(rowH + 2)
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor })
        safeText(label, { x: MARGIN + 6, y: y - 13, size: 9, font: boldFont, color: labelColor, maxWidth: labelW - 8 })
        const finalVal = truncate(cleanText(value), regularFont, 9, CONTENT_W - labelW - 12)
        page.drawText(finalVal, { x: MARGIN + labelW + 6, y: y - 13, size: 9, font: regularFont, color: C.textDark })
        y -= rowH
      }
      const drawInfoBox = (text, bgColor, borderColor, textColor) => {
        const padding = 10, maxW = CONTENT_W - 2 * padding
        const lines = wrapText(cleanText(text), regularFont, 9, maxW)
        const boxH = lines.length * 12 + 2 * padding
        checkPageBreak(boxH + 8)
        page.drawRectangle({ x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH, color: bgColor, borderColor: borderColor, borderWidth: 0.8 })
        lines.forEach((line, i) => page.drawText(line, { x: MARGIN + padding, y: y - padding - 10 - i * 12, size: 9, font: regularFont, color: textColor }))
        y -= boxH + 10
      }

      // SARLAVHA — pink-gold gradient (xelat + optik izomer)
      page.drawRectangle({ x: 0, y: PAGE_H - 90, width: PAGE_W, height: 90, color: C.pinkDeep })
      page.drawRectangle({ x: 0, y: PAGE_H - 92, width: PAGE_W, height: 4, color: C.gold })
      safeText("UB-VIS SPEKTROSKOPIYA TAHLILI", { x: PAGE_W / 2, y: PAGE_H - 40, size: 16, font: boldFont, color: C.white, align: "center" })
      safeText("[Co(en)₃]Cl₃ — Werner optik izomer klassikasi (1911)", { x: PAGE_W / 2, y: PAGE_H - 60, size: 12, font: regularFont, color: C.bgPink, align: "center" })
      safeText(`Sana: ${new Date().toLocaleDateString("uz-UZ")}  •  jdakimyo.uz  •  Δ / Λ enantiomerlar, xelat effekti`, { x: PAGE_W / 2, y: PAGE_H - 78, size: 8, font: italicFont, color: C.bgPink, align: "center" })
      y = PAGE_H - 110
      setPdfProgress(30)

      drawSectionHeader("1", "UMUMIY MA'LUMOT VA XUSUSIYATLARI")
      drawTableRow("Formula:", COMPOUND.formulaPlain)
      drawTableRow("IUPAC nomi:", COMPOUND.iupac)
      drawTableRow("Tarixiy ahamiyat:", COMPOUND.historicalName)
      drawTableRow("Molyar massa:", `${COMPOUND.molarMass} g/mol`)
      drawTableRow("CAS raqami:", COMPOUND.casNumber)
      drawTableRow("Rangi:", COMPOUND.color)
      drawTableRow("Struktura:", COMPOUND.structure)
      drawTableRow("Nuqta guruhi:", COMPOUND.pointGroup)
      drawTableRow("Ligand:", COMPOUND.ligand)
      drawTableRow("Denticity:", COMPOUND.denticity)
      drawTableRow("Xelat halqalar:", COMPOUND.chelateRings)
      drawTableRow("Metall:", `${COMPOUND.metalCenter} (${COMPOUND.dConfig})`)
      drawTableRow("Δo qiymati:", `${COMPOUND.deltaOh.toLocaleString()} cm⁻¹ (${COMPOUND.deltaOhKJ} kJ/mol)`)
      drawTableRow("Racah B (β):", `${COMPOUND.racahB} cm⁻¹ (β = ${COMPOUND.beta})`)
      drawTableRow("Barqarorlik doimiy:", COMPOUND.stabilityConstant)
      drawTableRow("Optik izomerlar:", COMPOUND.isomerism)
      drawTableRow("Magnit moment:", `${COMPOUND.magneticMoment} μB (diamagnit)`)
      y -= 5
      setPdfProgress(40)

      drawSectionHeader("2", "NAZARIY ASOS — XELAT EFFEKTI VA OPTIK IZOMERIYA")
      drawInfoBox(
        "[Co(en)₃]³⁺ — Werner klassikasining eng nozik namunasi. 3 ta bidentat en (etilendiamin) ligandi 3 ta 5-a'zoli xelat halqasini hosil qiladi. Bu ikki muhim natijaga olib keladi:\n\n" +
        "1) XELAT EFFEKTI: log β₃ = 48.7 (juda barqaror). NH₃ analogidan (log β₆ = 4.28) 44 log birlik yuqori. ΔG farqi ≈ −250 kJ/mol. Buning sababi entropiya: 3 en ligand 6 NH₃ ga qaraganda 3 marta kam molekulani almashtiradi.\n\n" +
        "2) OPTIK IZOMERIYA: D₃ simmetriya (C₃ o'q + 3 C₂ o'q, inversiya markazi YO'Q) → Δ (o'ng vintli helis) va Λ (chap vintli helis) enantiomerlar. Werner (1911) d-tartrat bilan ajratdi va bu KARBON MARKAZSIZ kirallik namunasi bo'ldi — Nobel mukofoti (1913) markaziy dalili.",
        C.bgGold, C.gold, C.textDark
      )
      setPdfProgress(50)

      drawSectionHeader("3", "YUTILISH POLOSALARI JADVALI")
      const rowH = 32
      const cols = [
        { label: "λ (nm)", w: 55 }, { label: "ν̃ (cm⁻¹)", w: 70 },
        { label: "ε", w: 55 }, { label: "O'tish", w: 150 },
        { label: "Tur", w: 60 }, { label: "Intensivlik", w: 90 },
      ]
      let colX = MARGIN
      page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.purpleMid })
      cols.forEach(c => { safeText(c.label, { x: colX + 4, y: y - 12, size: 8, font: boldFont, color: C.white, maxWidth: c.w - 6 }); colX += c.w })
      y -= 18

      uvVisPeaks.forEach((p, i) => {
        checkPageBreak(rowH + 2)
        const bgc = i % 2 === 0 ? C.bgGold : C.white
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgc })
        colX = MARGIN
        const values = [`${p.lambda}`, `${p.wavenumber.toLocaleString()}`, `${p.epsilon}`, p.transition.substring(0, 24), p.transitionType.substring(0, 12), p.intensity.substring(0, 15)]
        values.forEach((v, idx) => { safeText(v, { x: colX + 4, y: y - 12, size: 8, font: regularFont, color: C.textDark, maxWidth: cols[idx].w - 6 }); colX += cols[idx].w })
        safeText(p.diagnostic, { x: MARGIN + 4, y: y - 24, size: 7, font: italicFont, color: C.goldDeep, maxWidth: CONTENT_W - 8 })
        y -= rowH
      })
      y -= 10
      setPdfProgress(60)

      drawSectionHeader("4", "POLOSALARNING BATAFSIL NAZARIY IZOHI")
      uvVisPeaks.filter(p => !p.hidden).forEach((p, i) => {
        checkPageBreak(85)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: C.bgGold })
        safeText(`${i + 1}. ${p.transition}  —  λ = ${p.lambda} nm,  ε = ${p.epsilon}`, {
          x: MARGIN + 6, y: y - 12, size: 9, font: boldFont, color: C.goldDeep, maxWidth: CONTENT_W - 12
        })
        y -= 22
        const hh = drawWrappedText(p.theoryNote, { x: MARGIN + 8, y, size: 8.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W - 16, lineHeight: 11 })
        y -= hh + 8
      })
      setPdfProgress(70)

      drawSectionHeader("5", "OPTIK IZOMERLAR — Δ VA Λ")
      drawInfoBox(
        "D₃ simmetriya inversiya markazi YO'Q → optik izomerlar mavjud:\n\n" +
        "Δ (Delta): o'ng aylanuvchan (dextro)\n" +
        "  • Xelat halqalari soat yo'nalishida (C₃ o'q bo'ylab)\n" +
        "  • α_D = +125° (10⁻² M, 25°C, 589 nm)\n" +
        "  • CD: 465 nm da MUSBAT ekstremum (+1.9)\n\n" +
        "Λ (Lambda): chap aylanuvchan (levo)\n" +
        "  • Xelat halqalari soat yo'nalishiga qarshi\n" +
        "  • α_D = −125°\n" +
        "  • CD: 465 nm da MANFIY ekstremum (−1.9)\n\n" +
        "Ajratish (Werner 1911): d-tartrat bilan diastereomer tuz hosil qilib kristallizatsiya. Bu KARBON MARKAZSIZ kirallikning birinchi tarixiy namunasi — Nobel mukofoti (1913) asosi.",
        C.bgPink, C.pink, C.textDark
      )
      setPdfProgress(80)

      drawSectionHeader("6", "XELAT EFFEKTI — [Co(en)₃]³⁺ vs [Co(NH₃)₆]³⁺")
      drawInfoBox(
        "Termodinamik xelat effekti (Schwarzenbach, 1952):\n\n" +
        "  [Co(NH₃)₆]³⁺: log β₆ = 4.28,  ΔG = −24 kJ/mol,  ΔS ≈ 0\n" +
        "  [Co(en)₃]³⁺:  log β₃ = 48.7,  ΔG = −278 kJ/mol, ΔS = +240 J/K·mol\n\n" +
        "Δlog β = 44 birlik (10⁴⁴ marta barqarorroq!)\n" +
        "ΔΔG = −254 kJ/mol (asosan entropiyadan)\n\n" +
        "Sabab: entropiya samarali.\n" +
        "  [Co(H₂O)₆]³⁺ + 3 en → [Co(en)₃]³⁺ + 6 H₂O   Δn = +3 → ΔS > 0\n" +
        "  [Co(H₂O)₆]³⁺ + 6 NH₃ → [Co(NH₃)₆]³⁺ + 6 H₂O  Δn = 0 → ΔS ≈ 0\n\n" +
        "5-a'zoli halqa optimal — 6-a'zoli (propilendiamin) kamroq, 4-a'zoli mumkin emas.",
        C.bgBlue, C.blue, C.textDark
      )
      setPdfProgress(90)

      drawSectionHeader("7", "Δo VA RACAH B HISOBI")
      drawInfoBox(
        `ν₁ (¹A₁ → ¹T₁g) = ${uvVisPeaks[0].wavenumber} cm⁻¹\n` +
        `ν₂ (¹A₁ → ¹T₂g) = ${uvVisPeaks[1].wavenumber} cm⁻¹\n\n` +
        `Hisob:\n` +
        `  ν₂ − ν₁ = ${racahCalc.diff} cm⁻¹ = 12B (chunki C ≈ 4B)\n` +
        `  B = ${racahCalc.B} cm⁻¹  (aniq eksp: 615)\n` +
        `  Δo ≈ 21 550 cm⁻¹  (Luteo 22 900 dan biroz past)\n\n` +
        `Nefelauksetik: β = ${racahCalc.beta}\n\n` +
        `NIMA UCHUN en NH₃ ga o'xshash Δo beradi?\n` +
        `en va NH₃ ikkalasi ham σ-donor, elektron zichligi bir xil. Farq: xelat halqa 5-a'zoli va bite angle 85° (ideal 90° dan past) → orbital overlap biroz kamayadi → Δo pastroq. Ammo bu farq kichik (~1350 cm⁻¹).`,
        C.bgPurple, C.purple, C.textDark
      )
      setPdfProgress(95)

      drawSectionHeader("8", "ASOSIY XULOSALAR")
      const conclusions = [
        `1. λ₁ = 465 nm (ε=87): ¹A₁ → ¹T₁g — Luteo dan biroz batokromik`,
        `2. λ₂ = 340 nm (ε=78): ¹A₁ → ¹T₂g — Racah B hisoblash uchun`,
        `3. Δo = 21 550 cm⁻¹ — Luteo (22 900) dan biroz past (xelat bite angle ta'siri)`,
        `4. Racah B = 615 cm⁻¹, β = 0.56 — Luteo bilan bir xil`,
        `5. D₃ simmetriya → Δ va Λ optik izomerlar mavjud`,
        `6. Werner (1911) d-tartrat bilan ajratdi — Nobel 1913 asosiy dalil`,
        `7. Xelat effekti: log β₃ = 48.7 (Luteo dan 44 log birlik yuqori)`,
        `8. ΔS = +240 J/K·mol — entropiya samarali (uchdan uchga)`,
        `9. CD spektri: ν₁ da ± ekstremum, ν₁+ν₂ oralig'ida belgi o'zgaradi`,
        `10. Karbon markazsiz kirallikning birinchi tarixiy namunasi`,
      ]
      conclusions.forEach(c => {
        checkPageBreak(20)
        drawWrappedText(c, { x: MARGIN + 10, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W - 20, lineHeight: 12 })
        y -= 18
      })

      addFooter()
      setPdfProgress(100)

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Co-en3-Cl3_UBVis_Tahlili_${new Date().toISOString().split("T")[0]}.pdf`
      link.click()
      URL.revokeObjectURL(url)
      setPdfModalOpen(false)
    } catch (err) {
      console.error("PDF xato:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally { setPdfGenerating(false); setPdfProgress(0) }
  }

  return (
    <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">

      {/* PDF MODAL */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
            <h3 className="text-2xl font-bold text-pink-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">📄</span> PDF Ilmiy Hisobot
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              [Co(en)₃]Cl₃ ning UB-Vis va CD tahlili to'liq ilmiy hisobot.
            </p>
            <ul className="text-xs text-purple-300 space-y-1 mb-6 list-disc list-inside">
              <li>Umumiy ma'lumot va xelat effekti</li>
              <li>D₃ simmetriya va nazariy asos</li>
              <li>Har polosaning batafsil izohi</li>
              <li>Δ va Λ optik izomerlar</li>
              <li>Xelat effekti termodinamikasi</li>
              <li>Δo, Racah B parametrlari</li>
              <li>Werner tajribasi (Nobel 1913)</li>
              <li>Ilmiy xulosalar</li>
            </ul>
            {pdfGenerating && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-purple-300 mb-2">
                  <span>PDF yaratilmoqda...</span>
                  <span>{pdfProgress}%</span>
                </div>
                <div className="w-full bg-purple-900/40 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 to-yellow-400 h-full transition-all duration-300" style={{ width: `${pdfProgress}%` }} />
                </div>
              </div>
            )}
            <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-200">
                <strong> Font talablari:</strong> <code className="bg-yellow-950/50 px-1 rounded">public/fonts/</code> da <code className="bg-yellow-950/50 px-1 rounded">DejaVuSans*.ttf</code> 3 fayl.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPdfModalOpen(false)} disabled={pdfGenerating}
                className="flex-1 bg-purple-800 hover:bg-purple-700 text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-50">
                Bekor qilish
              </button>
              <button onClick={generatePDF} disabled={pdfGenerating}
                className="flex-1 bg-gradient-to-r from-pink-600 to-yellow-600 hover:from-pink-500 hover:to-yellow-500 text-white py-3 rounded-lg text-sm font-bold disabled:opacity-50">
                {pdfGenerating ? "⏳ Yaratilmoqda..." : "📥 PDF yuklab olish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      {showHeader && (
        <header className="border-b border-pink-800/50 sticky top-0 z-40 bg-[var(--v3-fon-2)]/90 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300"> Bosh</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/ub-vis" className="hover:text-purple-300">UB-Vis</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
              <span className="text-purple-600">›</span>
              <span className="text-pink-400 font-semibold">[Co(en)₃]Cl₃</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border-4 border-white/20 shadow-2xl" style={{background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}dd, ${COMPOUND.colorHex}99)`}}></div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-pink-400" dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <p className="text-purple-300 text-sm mt-1">{COMPOUND.iupac}</p>
                  <p className="text-pink-500/80 text-xs italic">D₃ simmetriya • d⁶ LS • Δ/Λ optik izomerlar</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-pink-900/40 border border-pink-700/50 text-pink-300">
                      🌀 Δ va Λ izomerlar
                    </span>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-yellow-900/40 border border-yellow-700/50 text-yellow-300">
                      🏆 Werner 1911
                    </span>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300">
                      🔗 Xelat effekti
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setPdfModalOpen(true)}
                  className="text-xs bg-gradient-to-r from-pink-600 to-yellow-600 hover:from-pink-500 hover:to-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-pink-500/20 font-bold">
                  📄 PDF Hisobot
                </button>
                <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-xs bg-purple-800/60 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                  ← Birikmalar
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      <button onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-40 px-3 py-2 rounded-lg text-xs font-bold shadow-lg bg-pink-600 hover:bg-pink-500 text-white">
        {showHeader ? "🔽" : "🔼"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. UMUMIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="w-40 h-40 rounded-2xl border-4 border-white/20 shadow-2xl" style={{
                background: `radial-gradient(circle at 30% 30%, ${COMPOUND.colorHex}, ${COMPOUND.colorHex}dd 40%, ${COMPOUND.colorHex}77 80%)`
              }}></div>
              <div className="text-center">
                <div className="text-xs text-purple-400">Ko'rinuvchi rang</div>
                <div className="text-lg font-bold text-pink-400">{COMPOUND.color.split(' ')[0]}</div>
              </div>
              <div className="w-32 h-4 rounded-full" style={{background: COMPOUND.absorbedHex}}></div>
              <div className="text-[10px] text-purple-500 text-center">Yutilgan (~465 nm binafsha)</div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-2xl font-bold text-white">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                </h2>
                <span className="text-xs px-3 py-1 rounded-full bg-pink-900/40 border border-pink-500/50 text-pink-300 font-bold">
                  🌀 Δ / Λ izomerlar
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-900/40 border border-yellow-500/50 text-yellow-300 font-bold">
                  🏆 Nobel 1913
                </span>
              </div>
              <p className="text-purple-200 leading-relaxed text-sm">
                <strong className="text-pink-400">[Co(en)₃]Cl₃</strong> — Werner klassikasining <strong className="text-yellow-300">nozik va chiroyli namunasi</strong>. 
                3 ta bidentat etilendiamin ligandi 3 ta 5-a'zoli xelat halqasini hosil qiladi. Bu ikki muhim natijaga olib keladi:
                <strong className="text-pink-400"> xelat effekti</strong> (log β₃ = 48.7, Luteo dan 44 log birlik yuqori!) va
                <strong className="text-yellow-300"> optik izomerlar</strong> (Δ va Λ enantiomerlar). Werner (1911) bularni
                d-tartrat bilan ajratib, <strong>KARBON MARKAZSIZ kirallikning birinchi tarixiy namunasini</strong> ko'rsatdi —
                Nobel mukofoti (1913) markaziy dalili.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-blue-900/30 border border-blue-700/40 rounded-xl p-3 text-center">
                  <div className="text-blue-400 text-[10px] uppercase">Simmetriya</div>
                  <div className="text-white font-bold mt-1">D₃</div>
                </div>
                <div className="bg-pink-900/30 border border-pink-700/40 rounded-xl p-3 text-center">
                  <div className="text-pink-400 text-[10px] uppercase">Xelat halqalar</div>
                  <div className="text-white font-bold mt-1">3 × 5-a'zoli</div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-xl p-3 text-center">
                  <div className="text-yellow-400 text-[10px] uppercase">Δo (cm⁻¹)</div>
                  <div className="text-white font-bold mt-1">{COMPOUND.deltaOh.toLocaleString()}</div>
                </div>
                <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-3 text-center">
                  <div className="text-purple-400 text-[10px] uppercase">log β₃</div>
                  <div className="text-white font-bold mt-1">48.7 🏆</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-xl overflow-hidden">
              <div className="bg-pink-900/30 px-4 py-2 border-b border-pink-700/30">
                <h3 className="text-pink-400 font-bold text-sm"> Fizik-kimyoviy xususiyatlar</h3>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Molyar massa</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.molarMass} g/mol</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">CAS raqami</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.casNumber}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Kristall tizim</td><td className="py-2 px-4 text-white">{COMPOUND.crystalSystem}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Nuqta guruhi</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.pointGroup}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Co–N uzunligi</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.bondLengthCoN}</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Bite angle</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.biteAngle} (ideal 90° dan past)</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Xelat halqa</td><td className="py-2 px-4 text-white text-[11px]">{COMPOUND.chelateRings}</td></tr>
                  <tr><td className="py-2 px-4 text-purple-400">Kashfiyot</td><td className="py-2 px-4 text-white text-[11px]">{COMPOUND.discovery}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-xl overflow-hidden">
              <div className="bg-pink-900/30 px-4 py-2 border-b border-pink-700/30">
                <h3 className="text-pink-400 font-bold text-sm">⚛ Elektron va termodinamik</h3>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Metall</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.metalCenter} (d⁶ LS)</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Konfiguratsiya</td><td className="py-2 px-4 text-white font-mono">t₂g⁶ eg⁰</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Yer holati</td><td className="py-2 px-4 text-white font-mono">¹A₁ (D₃)</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Δo</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.deltaOh.toLocaleString()} cm⁻¹</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Racah B</td><td className="py-2 px-4 text-white font-mono">{COMPOUND.racahB} cm⁻¹ (β={COMPOUND.beta})</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">log β₃</td><td className="py-2 px-4 text-green-300 font-mono font-bold">48.7 (rekord!)</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-2 px-4 text-purple-400">Xelat effekti</td><td className="py-2 px-4 text-white text-[10px]">{COMPOUND.chelateEffect}</td></tr>
                  <tr><td className="py-2 px-4 text-purple-400">Optik izomerlar</td><td className="py-2 px-4 text-white text-[10px]">Δ (+125°) va Λ (−125°)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-pink-900/10 border border-pink-500/30 rounded-xl p-4">
            <div className="text-pink-400 font-bold text-sm mb-2"> Etilendiamin (en) ligandining strukturasi</div>
            <div className="text-xs text-purple-200 font-mono bg-purple-950/40 rounded p-3">
              H₂N–CH₂–CH₂–NH₂  (bidentat, 2 ta N koordinatsiyalanadi)
            </div>
            <div className="text-xs text-purple-300 mt-2">
              Har bir en 2 ta koordinatsion joyni egallaydi va 5-a'zoli halqa hosil qiladi:
              <strong className="text-pink-300"> Co–N–C–C–N </strong> → halqada Co markazda, ikki N ligand, ikki C ko'prik.
              5-a'zoli halqa <strong className="text-yellow-300">eng barqaror halqa hajmi</strong> (Baeyer strain nazariyasi).
            </div>
          </div>
        </div>

        {/* 2. NAZARIY ASOS — XELAT VA OPTIK IZOMERIYA */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔗</span> Nazariy asos: Xelat effekti va D₃ simmetriya
          </h2>

          <p className="text-purple-200 leading-relaxed text-sm">
            [Co(en)₃]³⁺ <strong className="text-pink-400">ikki asosiy jihatga ega</strong>: (1) <strong>xelat effekti</strong> — 3 ta bidentat ligandning
            monodentatga qaraganda barqarorroq bo'lishi; (2) <strong className="text-yellow-400">D₃ simmetriya</strong> — inversiya markazi
            yo'q → optik izomerlar. Bu ikkalasi ham Werner nazariyasining muhim natijalari.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                <span>🔗</span> Xelat effekti
              </h3>
              <div className="bg-purple-950/60 rounded p-3 mb-3">
                <div className="text-yellow-300 text-xs font-mono text-center my-2">
                  ΔG = ΔH − TΔS
                </div>
                <div className="text-purple-300 text-[11px] mt-2 space-y-1">
                  • ΔH: NH₃ va en o'xshash (Co–N bog' bir xil)<br/>
                  • ΔS: en da JUDA katta (+240 J/K·mol)<br/>
                  • TΔS = 298 × 240 = 71.5 kJ/mol qo'shimcha<br/>
                  • Δlog β = 44 birlik!
                </div>
              </div>
              <div className="bg-purple-950/60 rounded p-3">
                <div className="text-yellow-300 text-xs my-1 font-mono">Reaksiya:</div>
                <div className="text-[10px] text-purple-200 font-mono">[Co(H₂O)₆]³⁺ + 3 en → [Co(en)₃]³⁺ + 6 H₂O</div>
                <div className="text-[10px] text-purple-300 mt-1">4 molekula → 7 molekula → ΔS &gt; 0</div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                <span>🌀</span> D₃ simmetriya va kirallik
              </h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-950/60 rounded p-3">
                  <div className="text-pink-300 font-bold mb-1">D₃ elementlari</div>
                  <div className="text-purple-200">E, 2C₃, 3C₂ (6 element, tartib 6)</div>
                  <div className="text-purple-300 text-[10px] mt-1">Inversiya markazi (i) YO'Q → kiral</div>
                </div>
                <div className="bg-pink-950/60 rounded p-3">
                  <div className="text-pink-300 font-bold mb-1">Enantiomerlar</div>
                  <div className="text-purple-200"><strong className="text-pink-400">Δ</strong> (o'ng vintli) va <strong className="text-blue-400">Λ</strong> (chap vintli)</div>
                  <div className="text-purple-300 text-[10px] mt-1">C₃ o'q bo'ylab xelat halqalari yo'nalishi</div>
                </div>
                <div className="bg-yellow-950/60 rounded p-3">
                  <div className="text-yellow-300 font-bold mb-1">Werner (1911) klassikasi</div>
                  <div className="text-purple-200">KARBON MARKAZSIZ kirallik</div>
                  <div className="text-purple-300 text-[10px] mt-1">Bu Nobel 1913 uchun asosiy dalil</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">🎓 Werner tarixiy tajriba (1911):</strong> Werner rasemik [Co(en)₃]Cl₃ eritmasiga
              (+)-d-tartrat qo'shdi. Diastereomer tuzlar hosil bo'ldi: <strong>Δ-[Co(en)₃]·d-tartrat</strong> va <strong>Λ-[Co(en)₃]·d-tartrat</strong>.
              Bu tuzlar suvda turli erish qobiliyatiga ega — kristallizatsiya bilan ajratildi. Har bir izomer sof olindi va o'ziga xos
              α_D = +125° va −125° optik aylanish ko'rsatdi. Bu tajriba
              <strong className="text-blue-300"> KARBON ATOMISIZ kirallik namunasi</strong> — 1913 yilda Nobel mukofoti asosidan biri bo'ldi.
            </p>
          </div>
        </div>

        {/* 3. INTERAKTIV UB-VIS SPEKTRI */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈</span> Interaktiv UB-Vis yutilish spektri
          </h2>
          <p className="text-purple-200 text-sm">
            [Co(en)₃]³⁺ spektri <strong className="text-pink-400">Luteo ga o'xshash</strong>, lekin ν₁ biroz batokromik siljigan (475 → 465 nm).
            <strong className="text-yellow-400"> ε qiymati kattaroq</strong> (60 → 87) — D₃ simmetriyada Laport taqiqi zaifroq (i markazi yo'q).
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-4 overflow-x-auto">
            <svg viewBox="0 0 800 400" className="w-full h-auto" preserveAspectRatio="xMidYMid meet" ref={spectrumRef}>
              <defs>
                <linearGradient id="visSpec4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4B0082"/><stop offset="15%" stopColor="#8B00FF"/>
                  <stop offset="25%" stopColor="#0000FF"/><stop offset="40%" stopColor="#00FF00"/>
                  <stop offset="55%" stopColor="#FFFF00"/><stop offset="70%" stopColor="#FF8C00"/>
                  <stop offset="90%" stopColor="#FF0000"/><stop offset="100%" stopColor="#8B0000"/>
                </linearGradient>
                <linearGradient id="peakGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1"/>
                </linearGradient>
              </defs>

              <rect x={((400 - 200) / 580) * 800} y="320" width={((780 - 400) / 580) * 800} height="10" fill="url(#visSpec4)" opacity="0.6"/>
              <rect x="0" y="320" width={((400 - 200) / 580) * 800} height="10" fill="#301934" opacity="0.5"/>

              {[1, 2, 3, 4].map((abs, i) => (
                <g key={i}>
                  <line x1="0" y1={300 - (abs/5)*300} x2="800" y2={300 - (abs/5)*300} stroke="#a78bfa" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.5"/>
                  <text x="5" y={300 - (abs/5)*300 - 2} fill="#c4b5fd" fontSize="9">A={abs}</text>
                </g>
              ))}
              {[200, 300, 400, 500, 600, 700, 780].map(l => (
                <g key={l}>
                  <line x1={((l - 200) / 580) * 800} y1="0" x2={((l - 200) / 580) * 800} y2="300" stroke="#a78bfa" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.3"/>
                  <text x={((l - 200) / 580) * 800} y="345" fill="#e9d5ff" fontSize="10" textAnchor="middle">{l}</text>
                </g>
              ))}
              <text x="400" y="365" fill="#e9d5ff" fontSize="11" textAnchor="middle" fontWeight="bold">λ (nm)</text>
              <text x="15" y="150" fill="#e9d5ff" fontSize="11" textAnchor="middle" transform="rotate(-90 15 150)" fontWeight="bold">Optik zichlik (A)</text>

              <path d={spectrumPath} fill="none" stroke="#ec4899" strokeWidth="2"/>
              <path d={`${spectrumPath} L 800,300 L 0,300 Z`} fill="url(#peakGrad4)"/>

              {visiblePeaks.filter(p => showLMCT || !p.transitionType.includes("LMCT")).map((p) => {
                const i = uvVisPeaks.indexOf(p)
                const x = ((p.lambda - 200) / 580) * 800
                const spectrumPoint = uvVisSpectrum.find(sp => Math.abs(sp.lambda - p.lambda) < 20)
                const y = spectrumPoint ? 300 - (spectrumPoint.absorbance / 5) * 300 : 200
                const isSelected = selectedPeak === i
                const isHovered = hoveredPeak === i
                const isLMCT = p.transitionType.includes("LMCT")
                const isSpinForbid = p.transitionType.includes("SPIN")

                return (
                  <g key={i} onClick={() => setSelectedPeak(i)} onMouseEnter={() => setHoveredPeak(i)} onMouseLeave={() => setHoveredPeak(null)} className="cursor-pointer">
                    <line x1={x} y1={y - 5} x2={x} y2="15" stroke={isSelected ? "#fbbf24" : (isLMCT ? "#ef4444" : (isSpinForbid ? "#6b7280" : "#ec4899"))} strokeWidth={isSelected || isHovered ? "2" : "1"} strokeDasharray={isSelected ? "0" : "4 2"}/>
                    <circle cx={x} cy={y} r={isSelected || isHovered ? "8" : "5"} fill={isSelected ? "#fbbf24" : (isLMCT ? "#ef4444" : (isSpinForbid ? "#6b7280" : "#ec4899"))} stroke="#fff" strokeWidth="2"/>
                    <g>
                      <rect x={x - 30} y={5} width="60" height="20" rx="4" fill={isSelected ? "#fbbf24" : (isLMCT ? "#ef4444" : "#ec4899")} opacity="0.9"/>
                      <text x={x} y="18" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">{p.lambda} nm</text>
                    </g>
                    {(isSelected || isHovered) && (
                      <g>
                        <rect x={x - 65} y={y - 62} width="130" height="34" rx="4" fill="#4B0082" stroke="#fbbf24" strokeWidth="1"/>
                        <text x={x} y={y - 47} fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">{p.transition.substring(0, 22)}</text>
                        <text x={x} y={y - 33} fill="#fbbf24" fontSize="9" textAnchor="middle">ε = {p.epsilon}</text>
                      </g>
                    )}
                  </g>
                )
              })}

              <text x="400" y="20" fill="#ec4899" fontSize="14" textAnchor="middle" fontWeight="bold">
                [Co(en)₃]³⁺ UB-Vis spektri (0.001 M, H₂O)
              </text>
            </svg>

            <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-xs text-purple-300">
                  <input type="checkbox" checked={showSpinForbidden} onChange={(e) => setShowSpinForbidden(e.target.checked)} className="accent-pink-500"/>
                  Spin-taqiqlangan polosani ko'rsatish
                </label>
                <label className="flex items-center gap-2 text-xs text-purple-300">
                  <input type="checkbox" checked={showLMCT} onChange={(e) => setShowLMCT(e.target.checked)} className="accent-red-500"/>
                  LMCT (210 nm)
                </label>
              </div>
            </div>
          </div>

          {/* Tanlangan polosa detali */}
          {selectedPeak !== null && (
            <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-2 border-pink-500/50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-2xl font-bold text-pink-400 mb-1">{uvVisPeaks[selectedPeak].transition}</h3>
                  <p className="text-purple-300 text-sm">{uvVisPeaks[selectedPeak].symmetryLabel}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  uvVisPeaks[selectedPeak].intensityCode === 4 ? "bg-red-900/40 border-red-500 text-red-300" :
                  uvVisPeaks[selectedPeak].intensityCode === 3 ? "bg-orange-900/40 border-orange-500 text-orange-300" :
                  uvVisPeaks[selectedPeak].intensityCode === 2 ? "bg-pink-900/40 border-pink-500 text-pink-300" :
                  "bg-gray-900/40 border-gray-500 text-gray-300"
                }`}>
                  {uvVisPeaks[selectedPeak].intensity}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">λmax</div>
                  <div className="text-yellow-300 font-mono font-bold">{uvVisPeaks[selectedPeak].lambda} nm</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">ν̃ (cm⁻¹)</div>
                  <div className="text-cyan-300 font-mono font-bold">{uvVisPeaks[selectedPeak].wavenumber.toLocaleString()}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">ε (M⁻¹·sm⁻¹)</div>
                  <div className="text-green-300 font-mono font-bold">{uvVisPeaks[selectedPeak].epsilon}</div>
                </div>
                <div className="bg-purple-950/40 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-purple-400 uppercase">E (kJ/mol)</div>
                  <div className="text-orange-300 font-mono font-bold">{uvVisPeaks[selectedPeak].energyKJ}</div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-3 mb-3">
                <div className="text-xs text-blue-400 font-bold mb-1"> Tanlash qoidasi:</div>
                <div className="text-sm text-purple-200">{uvVisPeaks[selectedPeak].selection}</div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3 mb-3">
                <div className="text-xs text-yellow-400 font-bold mb-1"> Diagnostik:</div>
                <div className="text-sm text-purple-200">{uvVisPeaks[selectedPeak].diagnostic}</div>
              </div>
              <div className="bg-pink-900/20 border border-pink-700/40 rounded-lg p-4">
                <div className="text-xs text-pink-400 font-bold mb-2">🎓 Batafsil ilmiy izoh:</div>
                <div className="text-sm text-purple-200 leading-relaxed">{uvVisPeaks[selectedPeak].theoryNote}</div>
              </div>
            </div>
          )}
        </div>

        {/* 4. OPTIK IZOMERLAR — Δ va Λ */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🌀</span> Optik izomerlar: Δ (Delta) va Λ (Lambda)
          </h2>
          <p className="text-purple-200 text-sm">
            D₃ simmetriya inversiya markazi (i) yo'q → kompleks <strong className="text-pink-400">kiral</strong>. 
            Ikki enantiomer mavjud: <strong className="text-pink-400">Δ</strong> (o'ng vintli helis) va 
            <strong className="text-blue-400"> Λ</strong> (chap vintli helis).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opticalIsomers.map((iso, i) => (
              <div key={i} className={`bg-purple-950/60 border-2 rounded-2xl p-6 ${iso.label === "Δ (Delta)" ? "border-pink-500/50" : "border-blue-500/50"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-3xl font-bold ${iso.color}`}>{iso.label}</h3>
                    <p className="text-xs text-purple-300 mt-1">{iso.name}</p>
                  </div>
                  <div className="text-4xl">{iso.label === "Δ (Delta)" ? "🌀" : ""}</div>
                </div>

                {/* SVG oktaedr diagramma */}
                <svg viewBox="0 0 200 200" className="w-full h-48 mb-4">
                  <defs>
                    <marker id={`arr${iso.label}`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                      <polygon points="0 0, 8 4, 0 8" fill={iso.hex}/>
                    </marker>
                  </defs>
                  
                  {/* Markaz — Co atomi */}
                  <circle cx="100" cy="100" r="12" fill="#facc15" stroke="#fff" strokeWidth="2"/>
                  <text x="100" y="105" fill="#000" fontSize="10" textAnchor="middle" fontWeight="bold">Co</text>

                  {/* 3 ta xelat halqasi — spiral */}
                  {iso.label === "Δ (Delta)" ? (
                    <>
                      {/* Δ: soat yo'nalishida */}
                      <path d="M 100 40 Q 130 55 130 85" stroke={iso.hex} strokeWidth="3" fill="none" markerEnd={`url(#arr${iso.label})`}/>
                      <path d="M 170 130 Q 155 155 130 155" stroke={iso.hex} strokeWidth="3" fill="none" markerEnd={`url(#arr${iso.label})`}/>
                      <path d="M 30 130 Q 45 100 70 100" stroke={iso.hex} strokeWidth="3" fill="none" markerEnd={`url(#arr${iso.label})`}/>

                      {/* N atomlar */}
                      <circle cx="100" cy="40" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1"/>
                      <circle cx="130" cy="85" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1"/>
                      <circle cx="170" cy="130" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1"/>
                      <circle cx="130" cy="155" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1"/>
                      <circle cx="30" cy="130" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1"/>
                      <circle cx="70" cy="100" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1"/>

                      <text x="100" y="180" fill={iso.hex} fontSize="11" textAnchor="middle" fontWeight="bold">⟳ Soat yo'nalishida</text>
                    </>
                  ) : (
                    <>
                      {/* Λ: teskari yo'nalishda */}
                      <path d="M 100 40 Q 70 55 70 85" stroke={iso.hex} strokeWidth="3" fill="none" markerEnd={`url(#arr${iso.label})`}/>
                      <path d="M 30 130 Q 45 155 70 155" stroke={iso.hex} strokeWidth="3" fill="none" markerEnd={`url(#arr${iso.label})`}/>
                      <path d="M 170 130 Q 155 100 130 100" stroke={iso.hex} strokeWidth="3" fill="none" markerEnd={`url(#arr${iso.label})`}/>

                      <circle cx="100" cy="40" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1"/>
                      <circle cx="70" cy="85" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1"/>
                      <circle cx="30" cy="130" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1"/>
                      <circle cx="70" cy="155" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1"/>
                      <circle cx="170" cy="130" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1"/>
                      <circle cx="130" cy="100" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1"/>

                      <text x="100" y="180" fill={iso.hex} fontSize="11" textAnchor="middle" fontWeight="bold">⟲ Teskari yo'nalishda</text>
                    </>
                  )}
                </svg>

                <div className="space-y-2 text-xs">
                  <div className="bg-purple-900/40 rounded p-2">
                    <div className={`${iso.color} font-bold`}>Aylanish yo'nalishi</div>
                    <div className="text-purple-200">{iso.description}</div>
                  </div>
                  <div className="bg-purple-900/40 rounded p-2">
                    <div className={`${iso.color} font-bold`}>Optik aylanish</div>
                    <div className="text-purple-200 font-mono">{iso.opticalRotation}</div>
                  </div>
                  <div className="bg-purple-900/40 rounded p-2">
                    <div className={`${iso.color} font-bold`}>CD signali</div>
                    <div className="text-purple-200 text-[10px]">{iso.cdSign}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-900/10 border border-yellow-500/30 rounded-xl p-4">
            <h4 className="text-yellow-300 font-bold text-sm mb-2">🎓 IUPAC (2005) konvensiya</h4>
            <p className="text-xs text-purple-200">
              Absolut konfiguratsiya aniqlash: <strong>C₃ o'q bo'ylab molekulaga qaralganda</strong> (masalan, tepadan pastga), 3 ta xelat halqasining
              yo'nalishi kuzatiladi. Agar halqalar <strong className="text-pink-300">soat yo'nalishida</strong> aylansa → <strong>Δ</strong> (delta).
              Agar <strong className="text-blue-300">soatga qarshi</strong> aylansa → <strong>Λ</strong> (lambda). Bu klassik enantiomer belgilash usuli
              tarixiy jihatdan Werner (1911) tomonidan taklif qilingan va IUPAC (2005) tomonidan rasmiylashtirilgan.
            </p>
          </div>
        </div>

        {/* 5. CD (SIRKULYAR DIXROIZM) SPEKTRI */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Sirkulyar dixroizm (CD) spektri — Δ va Λ ni ajratish
          </h2>
          <p className="text-purple-200 text-sm">
            <strong className="text-pink-400">CD (Circular Dichroism)</strong> — chap va o'ng aylanuvchan yorug'likning turlicha yutilishi. 
            Δε = ε(L) − ε(R). Rasemikda CD = 0, sof enantiomerlarda maksimum. Δ va Λ signallari 
            <strong className="text-yellow-400"> ko'zguviy aksdir</strong> (bir-birining aksi).
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-4">
            <div className="flex gap-2 mb-3 flex-wrap">
              <button onClick={() => { setSelectedIsomer("D"); setShowBothIsomers(false) }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selectedIsomer === "D" && !showBothIsomers ? "bg-pink-600 text-white" : "bg-purple-800/40 text-pink-400"
                }`}>
                🌀 Faqat Δ (Delta)
              </button>
              <button onClick={() => { setSelectedIsomer("L"); setShowBothIsomers(false) }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selectedIsomer === "L" && !showBothIsomers ? "bg-blue-600 text-white" : "bg-purple-800/40 text-blue-400"
                }`}>
                 Faqat Λ (Lambda)
              </button>
              <button onClick={() => setShowBothIsomers(true)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  showBothIsomers ? "bg-purple-600 text-white" : "bg-purple-800/40 text-purple-300"
                }`}>
                 Ikkalasi (ko'zguviy)
              </button>
            </div>

            <svg viewBox="0 0 800 250" className="w-full h-auto">
              <defs>
                <marker id="cdArr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill="#a78bfa"/>
                </marker>
              </defs>

              {/* Y = 0 chizig'i */}
              <line x1="60" y1="125" x2="770" y2="125" stroke="#a78bfa" strokeWidth="1"/>
              <text x="45" y="128" fill="#c4b5fd" fontSize="9" textAnchor="end">0</text>

              {/* Y axis */}
              <line x1="60" y1="20" x2="60" y2="230" stroke="#a78bfa" strokeWidth="1"/>
              {[-2, -1, 1, 2].map(v => {
                const yPos = 125 - (v / 2.5) * 100
                return (
                  <g key={v}>
                    <line x1="55" y1={yPos} x2="770" y2={yPos} stroke="#a78bfa" strokeWidth="0.2" strokeDasharray="2 3" opacity="0.3"/>
                    <text x="50" y={yPos + 3} fill="#c4b5fd" fontSize="9" textAnchor="end">{v > 0 ? `+${v}` : v}</text>
                  </g>
                )
              })}
              <text x="25" y="125" fill="#e9d5ff" fontSize="11" textAnchor="middle" transform="rotate(-90 25 125)" fontWeight="bold">Δε (M⁻¹·sm⁻¹)</text>

              {/* X axis */}
              {[350, 400, 450, 500, 550, 600].map(l => {
                const xPos = 60 + ((l - 300) / 320) * 710
                return (
                  <g key={l}>
                    <line x1={xPos} y1="20" x2={xPos} y2="230" stroke="#a78bfa" strokeWidth="0.2" strokeDasharray="2 3" opacity="0.3"/>
                    <text x={xPos} y="245" fill="#e9d5ff" fontSize="9" textAnchor="middle">{l}</text>
                  </g>
                )
              })}
              <text x="400" y="220" fill="#e9d5ff" fontSize="11" textAnchor="middle" fontWeight="bold">λ (nm)</text>

              {/* Δ chizig'i */}
              {(selectedIsomer === "D" || showBothIsomers) && (
                <g>
                  <path d={cdPath.D} stroke="#ec4899" strokeWidth="2.5" fill="none"/>
                  {cdSpectrum.map((p, i) => {
                    const x = 60 + ((p.lambda - 300) / 320) * 710
                    const y = 125 - (p.delta_epsilon_D / 2.5) * 100
                    return <circle key={i} cx={x} cy={y} r="4" fill="#ec4899" stroke="#fff" strokeWidth="1.5"/>
                  })}
                  <text x="720" y="55" fill="#ec4899" fontSize="11" fontWeight="bold" textAnchor="end">Δ (Delta) — +1.9 da 465 nm</text>
                </g>
              )}

              {/* Λ chizig'i */}
              {(selectedIsomer === "L" || showBothIsomers) && (
                <g>
                  <path d={cdPath.L} stroke="#3b82f6" strokeWidth="2.5" fill="none"/>
                  {cdSpectrum.map((p, i) => {
                    const x = 60 + ((p.lambda - 300) / 320) * 710
                    const y = 125 - (p.delta_epsilon_L / 2.5) * 100
                    return <circle key={i} cx={x} cy={y} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1.5"/>
                  })}
                  <text x="720" y="195" fill="#3b82f6" fontSize="11" fontWeight="bold" textAnchor="end">Λ (Lambda) — −1.9 da 465 nm</text>
                </g>
              )}

              {/* Muhim polosalarni belgilash */}
              <line x1={60 + ((465 - 300) / 320) * 710} y1="20" x2={60 + ((465 - 300) / 320) * 710} y2="230" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="4 2" opacity="0.5"/>
              <text x={60 + ((465 - 300) / 320) * 710 - 5} y="30" fill="#fbbf24" fontSize="9" textAnchor="end">ν₁ (465)</text>

              <text x="415" y="15" fill="#ec4899" fontSize="13" textAnchor="middle" fontWeight="bold">
                [Co(en)₃]³⁺ CD spektri (10⁻³ M, H₂O, 25°C)
              </text>
            </svg>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-3">
                <div className="text-pink-400 font-bold text-sm">Δ izomer</div>
                <div className="text-xs text-purple-200 mt-1">
                  • 465 nm da <strong className="text-green-300">+1.9</strong> ekstremum<br/>
                  • 520 nm da <strong className="text-red-300">−1.6</strong> ekstremum<br/>
                  • Ikki belgi almashinishi — <strong>Cotton effekti</strong>
                </div>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                <div className="text-blue-400 font-bold text-sm">Λ izomer</div>
                <div className="text-xs text-purple-200 mt-1">
                  • 465 nm da <strong className="text-red-300">−1.9</strong> ekstremum<br/>
                  • 520 nm da <strong className="text-green-300">+1.6</strong> ekstremum<br/>
                  • Δ ga aynan <strong>ko'zguviy aks</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">🎓 Cotton effekti:</strong> Yutilish polosasi sohasida CD signali belgi
              o'zgartiradi (+ dan − ga yoki teskari). Bu <strong>Aime Cotton</strong> (1895) tomonidan kashf etilgan. 
              [Co(en)₃]³⁺ da eng katta Δε qiymati ±1.9 M⁻¹·sm⁻¹ — nisbatan kuchli signal. Bu qiymat orqali 
              <strong>enantiomer sofligini</strong> aniqlash mumkin: agar Δε = 0 bo'lsa, rasemik; agar ±1.9 bo'lsa, 100% sof izomer.
            </p>
          </div>
        </div>

        {/* 6. XELAT EFFEKTI — INTERAKTIV */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔗</span> Xelat effekti — [Co(en)ₙ] barqarorligi
          </h2>
          <p className="text-purple-200 text-sm">
            Har xelat halqasi qanchalik ko'p bo'lsa, kompleks shunchalik barqaror. Sliderni harakatlantirib log β o'zgarishini kuzating:
          </p>

          <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-6">
            <div className="mb-4">
              <div className="flex justify-between text-xs text-purple-400 mb-2">
                <span>Xelat halqalar soni (n)</span>
                <span className="text-pink-300 font-mono font-bold text-xl">{chelateSim.ringsCount}</span>
              </div>
              <input type="range" min="0" max="3" step="1" value={chelateRingsCount}
                onChange={(e) => setChelateRingsCount(Number(e.target.value))}
                className="w-full accent-pink-500"/>
              <div className="flex justify-between text-[10px] text-purple-500 mt-1">
                <span>0 (NH₃ faqat)</span>
                <span>1 en + 4 NH₃</span>
                <span>2 en + 2 NH₃</span>
                <span className="text-pink-300">3 en (BU)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
                <div className="text-xs text-pink-400 mb-2">log β{chelateSim.ringsCount === 0 ? '₆' : chelateSim.ringsCount === 3 ? '₃' : ''}</div>
                <div className="text-pink-300 text-3xl font-mono font-bold">{chelateSim.logBeta}</div>
                <div className="text-[10px] text-purple-500 mt-2">Barqarorlik doimiy</div>
              </div>
              <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
                <div className="text-xs text-yellow-400 mb-2">Barqarorlik omili</div>
                <div className="text-yellow-300 text-2xl font-mono font-bold">
                  {chelateSim.ringsCount === 0 ? "1" : `10^${(chelateSim.ringsCount * 14.8).toFixed(0)}`}
                </div>
                <div className="text-[10px] text-purple-500 mt-2">marta NH₃ dan yuqori</div>
              </div>
              <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
                <div className="text-xs text-green-400 mb-2">ΔG (kJ/mol)</div>
                <div className="text-green-300 text-2xl font-mono font-bold">−{(chelateSim.ringsCount * 84).toFixed(0)}</div>
                <div className="text-[10px] text-purple-500 mt-2">Termodinamik afzallik</div>
              </div>
            </div>

            <div className="mt-4 bg-purple-900/40 rounded-lg p-4">
              <div className="text-xs text-purple-400 mb-2">Kompleks turi:</div>
              <div className="text-sm font-mono text-yellow-300">
                {chelateSim.ringsCount === 0 && "[Co(NH₃)₆]³⁺ (Luteo)"}
                {chelateSim.ringsCount === 1 && "[Co(NH₃)₄(en)]³⁺"}
                {chelateSim.ringsCount === 2 && "[Co(NH₃)₂(en)₂]³⁺"}
                {chelateSim.ringsCount === 3 && "[Co(en)₃]³⁺ ← BU KOMPLEKS ✓"}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pink-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Xususiyat</th>
                  <th className="py-3 px-3 text-left text-yellow-400 text-xs uppercase">[Co(NH₃)₆]³⁺</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">[Co(en)₃]³⁺</th>
                  <th className="py-3 px-3 text-left text-green-400 text-xs uppercase">Farq / G'olib</th>
                </tr>
              </thead>
              <tbody>
                {chelateComparison.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-pink-900/20">
                    <td className="py-3 px-3 text-white font-semibold text-xs">{r.property}</td>
                    <td className="py-3 px-3 text-yellow-300 font-mono text-xs">{r.nh3}</td>
                    <td className="py-3 px-3 text-pink-300 font-mono text-xs">{r.en}</td>
                    <td className="py-3 px-3 text-green-300 text-xs font-bold">{r.winner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <h4 className="text-yellow-300 font-bold text-sm mb-2">🎓 Xelat effektining 6 sababi (Schwarzenbach, 1952):</h4>
            <div className="space-y-2">
              {chelateEffectSteps.map((s, i) => (
                <div key={i} className="bg-purple-950/40 rounded p-3 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-purple-950 flex-shrink-0 text-sm">{s.step}</div>
                  <div>
                    <div className="text-yellow-300 font-semibold text-xs">{s.task}</div>
                    <div className="text-xs text-purple-200 mt-1">{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. AJRATISH USULLARI (Δ vs Λ) */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚗️</span> Δ va Λ ni ajratish usullari
          </h2>
          <p className="text-purple-200 text-sm">
            Rasemik aralashmadan sof Δ yoki Λ izomerni ajratish — tarixiy va zamonaviy usullar.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {resolutionMethods.map((m, i) => (
              <button key={i} onClick={() => setActiveResolution(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  activeResolution === i ? "bg-pink-600/60 text-white border-pink-400/50 shadow-lg" :
                  "bg-purple-800/30 text-purple-400 border-[var(--v3-chiziq)] hover:bg-purple-700/40"
                }`}>
                {m.name.substring(0, 25)}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
            <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
              <h3 className="text-pink-400 font-bold text-lg">{resolutionMethods[activeResolution].name}</h3>
              <span className="text-xs bg-yellow-900/40 border border-yellow-500/50 rounded-full px-3 py-1 text-yellow-300">
                {resolutionMethods[activeResolution].year} yil
              </span>
            </div>
            <p className="text-purple-200 text-sm mb-4 italic">{resolutionMethods[activeResolution].note}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-900/40 rounded-lg p-3">
                <div className="text-xs text-yellow-400 font-bold mb-1">💊 Reagent</div>
                <div className="text-sm text-purple-200 font-mono">{resolutionMethods[activeResolution].reagent}</div>
              </div>
              <div className="bg-purple-900/40 rounded-lg p-3">
                <div className="text-xs text-yellow-400 font-bold mb-1">🌡 Sharoit</div>
                <div className="text-sm text-purple-200">{resolutionMethods[activeResolution].conditions}</div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-3 mb-3">
              <div className="text-xs text-blue-400 font-bold mb-1"> Prinsip:</div>
              <div className="text-sm text-purple-200">{resolutionMethods[activeResolution].principle}</div>
            </div>

            <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-3">
              <div className="text-xs text-green-400 font-bold mb-1"> Yield / Aniqlik:</div>
              <div className="text-sm text-purple-200">{resolutionMethods[activeResolution].yield}</div>
            </div>
          </div>
        </div>

        {/* 8. Δo va RACAH B HISOBI */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧮</span> Δo va Racah B ni hisoblash
          </h2>

          <div className="space-y-3">
            {[
              { step: 1, task: "Birinchi polosa", formula: "ν₁ (¹A₁ → ¹T₁g) = 21 505 cm⁻¹ (465 nm)", result: "" },
              { step: 2, task: "Ikkinchi polosa", formula: "ν₂ (¹A₁ → ¹T₂g) = 29 412 cm⁻¹ (340 nm)", result: "" },
              { step: 3, task: "Farqni hisoblash", formula: "ν₂ − ν₁ = 29 412 − 21 505 = 7 907 cm⁻¹", result: "" },
              { step: 4, task: "d⁶ LS formulasini qo'llash", formula: "ν₂ − ν₁ = 16B − C ≈ 12B", result: "" },
              { step: 5, task: "Racah B", formula: "B = 7 907 / 12 ≈ 659 cm⁻¹  (eksp: 615)", result: "B = 615 cm⁻¹" },
              { step: 6, task: "Δo", formula: "Δo ≈ ν₁ + 4B + 3C ≈ 21 500 cm⁻¹", result: "Δo = 21 550 cm⁻¹" },
              { step: 7, task: "Luteo bilan taqqoslash", formula: "en Δo (21 550) < NH₃ Δo (22 900) — bite angle 85°", result: "Xelat cheklovi" },
              { step: 8, task: "β nefelauksetik", formula: "β = 615 / 1100 = 0.559", result: "Luteo bilan bir xil" },
            ].map((s, i) => (
              <div key={i} className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-4 flex gap-4 items-start">
                <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className="text-pink-300 font-semibold text-sm">{s.task}</div>
                  <div className="text-xs text-purple-300 mt-1 font-mono bg-purple-950/50 rounded p-2">{s.formula}</div>
                  {s.result && (<div className="text-xs text-green-300 mt-2 font-bold">➜ {s.result}</div>)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-pink-900/30 to-yellow-900/30 border-2 border-pink-500/50 rounded-2xl p-6 mt-4">
            <h3 className="text-pink-400 font-bold text-lg mb-3"> [Co(en)₃]³⁺ natijalari</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-purple-400 mb-1">Δo</div>
                <div className="text-2xl font-bold text-yellow-300">{COMPOUND.deltaOh.toLocaleString()}</div>
                <div className="text-[10px] text-purple-500">cm⁻¹</div>
              </div>
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-purple-400 mb-1">Racah B</div>
                <div className="text-2xl font-bold text-green-300">{COMPOUND.racahB}</div>
                <div className="text-[10px] text-purple-500">cm⁻¹</div>
              </div>
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-purple-400 mb-1">β</div>
                <div className="text-2xl font-bold text-cyan-300">{COMPOUND.beta}</div>
                <div className="text-[10px] text-purple-500">Luteo bilan bir xil</div>
              </div>
              <div className="text-center bg-purple-950/40 rounded-lg p-4">
                <div className="text-xs text-purple-400 mb-1">log β₃</div>
                <div className="text-2xl font-bold text-pink-300">48.7</div>
                <div className="text-[10px] text-purple-500">RECORD!</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">🎓 Nima uchun en NH₃ dan Δo past?</strong> Ikkalasi ham σ-donor va bir xil elektron zichligi.
              Farq: <strong>xelat bite angle</strong> (N–Co–N burchagi) 85° — ideal 90° dan biroz past. Bu ligand orbitalari to'g'ri
              overlap qilishga xalaqit beradi → Δo biroz pasayadi. Kompensatsiya sifatida <strong>xelat effekti</strong> katta
              termodinamik afzallik beradi (log β 44 birlik yuqori).
            </p>
          </div>
        </div>

        {/* 9. SPEKTROXIMIK QATOR */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Co³⁺ spektroximik qatorda [Co(en)₃]³⁺
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pink-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Ligand</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Kompleks</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Δo (cm⁻¹)</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Spin</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">λ₁ (nm)</th>
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Rang</th>
                </tr>
              </thead>
              <tbody>
                {spectrochemicalSeries.map((s, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-pink-900/20 ${s.current ? "bg-pink-900/30 border-l-4 border-l-pink-400" : ""}`}>
                    <td className="py-3 px-3 text-yellow-300 font-mono">{s.ligand}</td>
                    <td className="py-3 px-3 text-purple-200 font-mono text-xs">{s.complex}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">{s.deltaOh.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        s.spin.includes("HS") ? "bg-orange-900/40 text-orange-300" : "bg-blue-900/40 text-blue-300"
                      }`}>{s.spin}</span>
                    </td>
                    <td className="py-3 px-3 text-green-300 font-mono">{s.lambda1}</td>
                    <td className="py-3 px-3 text-xs">{s.current ? <strong className="text-pink-400">← BU KOMPLEKS</strong> : s.color}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-300 text-sm font-mono text-center">
              en Δo (21 550) &lt; NH₃ Δo (22 900) — bite angle 85° ta'siri (xelat cheklovi)
            </div>
          </div>
        </div>

        {/* 10. INTERAKTIV BEER-LAMBERT */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Interaktiv Beer-Lambert kalkulyatori
          </h2>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <div className="text-yellow-300 text-xl font-mono">A = ε · c · l</div>
          </div>

          <div className="flex flex-wrap gap-2">
            {uvVisPeaks.filter(p => !p.hidden).map((p, i) => (
              <button key={i} onClick={() => setBlSelectedPeak(i)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  blSelectedPeak === i ? "bg-pink-600 text-white shadow-lg shadow-pink-500/30" :
                  "bg-purple-800/40 text-purple-300 hover:bg-purple-700/60"
                }`}>
                λ={p.lambda} nm (ε={p.epsilon})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <label className="text-xs text-purple-400 block mb-2">Konsentratsiya (mol/L)</label>
              <input type="range" min="0.000001" max="0.01" step="0.000001" value={blConcentration}
                onChange={(e) => setBlConcentration(Number(e.target.value))}
                className="w-full accent-pink-500"/>
              <div className="text-cyan-300 text-2xl font-mono text-center mt-2">{blConcentration.toExponential(2)} M</div>
            </div>
            <div className="bg-purple-950/60 border border-[var(--v3-chiziq)] rounded-xl p-5">
              <label className="text-xs text-purple-400 block mb-2">Kyuveta uzunligi (sm)</label>
              <input type="range" min="0.1" max="10" step="0.1" value={blPathLength}
                onChange={(e) => setBlPathLength(Number(e.target.value))}
                className="w-full accent-pink-500"/>
              <div className="text-green-300 text-2xl font-mono text-center mt-2">{blPathLength.toFixed(1)} sm</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
              <div className="text-xs text-pink-400 mb-2">Optik zichlik</div>
              <div className="text-pink-300 text-4xl font-mono font-bold">A = {blResult.A}</div>
              <div className="text-xs text-purple-300 mt-3">A = {blResult.epsilon} × {blConcentration.toExponential(2)} × {blPathLength}</div>
            </div>
            <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
              <div className="text-xs text-blue-400 mb-2">Transmittans</div>
              <div className="text-cyan-300 text-4xl font-mono font-bold">T = {blResult.T}%</div>
              <div className="text-xs text-purple-300 mt-3">T = 10⁻ᴬ × 100%</div>
            </div>
          </div>
        </div>

        {/* 11. HS vs LS */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔀</span> [Co(en)₃]³⁺ ham LS (Δo &gt; P)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pink-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-left text-pink-400 text-xs uppercase">Xususiyat</th>
                  <th className="py-3 px-3 text-left text-orange-400 text-xs uppercase">HS d⁶</th>
                  <th className="py-3 px-3 text-left text-blue-400 text-xs uppercase">LS d⁶</th>
                  <th className="py-3 px-3 text-left text-green-400 text-xs uppercase">BU KOMPLEKS</th>
                </tr>
              </thead>
              <tbody>
                {spinComparison.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-900/30">
                    <td className="py-3 px-3 text-white font-semibold text-xs">{r.property}</td>
                    <td className="py-3 px-3 text-orange-300 font-mono text-xs">{r.hs}</td>
                    <td className="py-3 px-3 text-blue-300 font-mono text-xs">{r.ls}</td>
                    <td className="py-3 px-3 text-green-300 font-mono text-xs font-bold">{r.thisCompound}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 12. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span></span> Namuna tayyorlash usullari
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {techniques.map((t, i) => (
              <button key={i} onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  activeTechnique === i ? "bg-pink-600/60 text-white border-pink-400/50 shadow-lg" :
                  "bg-purple-800/30 text-purple-400 border-[var(--v3-chiziq)] hover:bg-purple-700/40"
                }`}>
                {t.name}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
            <h3 className="text-pink-400 font-bold text-lg mb-2">{techniques[activeTechnique].name}</h3>
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
                <div className="text-purple-400 text-[10px] uppercase">Diapazon</div>
                <div className="text-white text-xs font-mono mt-1">{techniques[activeTechnique].range}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">Ruxsat</div>
                <div className="text-white text-xs font-mono mt-1">{techniques[activeTechnique].resolution}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">Konsentratsiya</div>
                <div className="text-white text-xs mt-1">{techniques[activeTechnique].concentration}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-[10px] uppercase">Tayyorlash</div>
                <div className="text-white text-xs mt-1">{techniques[activeTechnique].prepTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 13. HALAQIT OMILLARI */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>️</span> UB-Vis/CD tahliliga halaqit beruvchi omillar
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-left text-purple-300 text-xs uppercase">Manba</th>
                  <th className="py-3 px-4 text-left text-purple-300 text-xs uppercase">Sohasi</th>
                  <th className="py-3 px-4 text-left text-purple-300 text-xs uppercase">Ta'sir</th>
                  <th className="py-3 px-4 text-left text-purple-300 text-xs uppercase">Jiddiylik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {interferences.map((iv, i) => (
                  <tr key={i} onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${activeInterference === i ? "bg-pink-900/20" : ""}`}>
                    <td className="py-3 px-4 font-bold text-xs">{iv.source}</td>
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
              <span></span> Yechim: {interferences[activeInterference].source}
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">{interferences[activeInterference].solution}</p>
          </div>
        </div>

        {/* 14. TARIXIY XRONOLOGIYA */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📜</span> Tarixiy xronologiya
          </h2>

          <div className="space-y-2">
            {historicalTimeline.map((h, i) => (
              <div key={i} className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-lg p-3 flex gap-4 items-center hover:bg-purple-900/40 transition-colors">
                <div className={`font-mono font-bold text-sm w-16 flex-shrink-0 ${h.event.includes("🏆") ? "text-yellow-300" : "text-purple-300"}`}>{h.year}</div>
                <div className={`text-xs flex-1 ${h.event.includes("🏆") ? "text-yellow-200 font-semibold" : "text-purple-200"}`}>{h.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 15. AMALIY AHAMIYATI */}
        <div className="bg-purple-900/40 border border-pink-700/40 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💼</span> Amaliy ahamiyati va qo'llanilishi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {applications.map((app, i) => (
              <div key={i} className="bg-purple-950/40 border border-[var(--v3-chiziq)] rounded-lg p-4 flex gap-3 items-start">
                <div className="text-3xl flex-shrink-0">{app.icon}</div>
                <div>
                  <div className="text-pink-400 font-bold text-sm mb-1">{app.field}</div>
                  <div className="text-purple-200 text-xs">{app.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 16. XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-yellow-600/10 border border-pink-500/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span></span> Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li className="pl-2"><strong className="text-pink-400">λ₁ = 465 nm (ε=87)</strong>: ¹A₁ → ¹T₁g — Luteo dan biroz batokromik</li>
            <li className="pl-2"><strong className="text-pink-400">λ₂ = 340 nm (ε=78)</strong>: ¹A₁ → ¹T₂g — Racah B ni hisoblash</li>
            <li className="pl-2"><strong className="text-pink-400">Δo = 21 550 cm⁻¹</strong> — Luteo (22 900) dan biroz past (xelat bite angle 85°)</li>
            <li className="pl-2"><strong className="text-pink-400">Racah B = 615 cm⁻¹, β = 0.559</strong> — Luteo bilan bir xil</li>
            <li className="pl-2"><strong className="text-pink-400">D₃ simmetriya</strong> — inversiya markazi yo'q → optik izomerlar</li>
            <li className="pl-2"><strong className="text-pink-400">Δ (o'ng) va Λ (chap)</strong> enantiomerlar — α_D = ±125°</li>
            <li className="pl-2"><strong className="text-pink-400">CD Cotton effekti</strong>: 465 nm da ±1.9 ekstremum</li>
            <li className="pl-2"><strong className="text-pink-400">Xelat effekti: log β₃ = 48.7</strong> — Luteo dan 44 log birlik yuqori</li>
            <li className="pl-2"><strong className="text-pink-400">ΔS = +240 J/K·mol</strong> — entropiya samarali (uch molekula → yetti molekula)</li>
            <li className="pl-2"><strong className="text-pink-400">Werner (1911) d-tartrat ajratishi</strong> — karbon markazsiz kirallik dalili</li>
            <li className="pl-2"><strong className="text-pink-400">Nobel mukofoti (1913)</strong> — bu kompleks Werner ishining markaziy dalili</li>
            <li className="pl-2"><strong className="text-pink-400">3 ta 5-a'zoli xelat halqasi</strong> — Baeyer strain minimal</li>
          </ol>
        </div>

        {/* 17. NAVIGATSIYA */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/co-nh3-5-cl-cl2" className="px-6 py-3 border border-violet-500 rounded-xl hover:bg-violet-900/30 text-violet-300 transition-all">
            ← [Co(NH₃)₅Cl]Cl₂ (Purpureo)
          </Link>
          <button onClick={() => setPdfModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-yellow-600 hover:from-pink-500 hover:to-yellow-500 text-white font-bold rounded-xl shadow-lg shadow-pink-500/20">
            📄 PDF Hisobot yaratish
          </button>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/cr-h2o-6-cl3" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold transition-all">
            [Cr(H₂O)₆]Cl₃ →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 jdakimyo.uz • [Co(en)₃]Cl₃ • UB-Vis + CD spektroskopiya moduli (premium)</p>
          <p className="mt-2 text-purple-600 text-[11px]">
            Manbalar: Werner A. (1911, Nobel 1913) • Schwarzenbach G. (1952) • Lever A.B.P. • Tanabe-Sugano (1954) • Racah (1942)
          </p>
        </div>
      </footer>
    </div>
  )
}
