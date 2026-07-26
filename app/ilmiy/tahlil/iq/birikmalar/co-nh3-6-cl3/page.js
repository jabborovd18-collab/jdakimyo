"use client"

import Link from "next/link"
import { useState, useMemo, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₆]Cl₃ — IQ SPEKTROSKOPIYA (PREMIUM ILMIY, PDF EKSPORT)
// Manbalar: Nakamoto K. (Infrared and Raman Spectra of Inorg. & Coord. Compounds, 6th ed.),
//           Cotton F.A. (Chemical Applications of Group Theory),
//           Lever A.B.P. (Inorganic Electronic Spectroscopy),
//           Werner A. (1893), Bethe H. (1929), Jahn-Teller (1937)
// Xususiyat: IQ nazariy jihatdan to'liq yoritilgan + PDF eksport (faqat IQ tahlili)
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Co(NH3)6]Cl3",
  iupac: "Geksaamminkobalt(III) xlorid",
  commonName: "Luteo-kobalt (sariq)",
  molarMass: 267.48,
  casNumber: "10534-89-1",
  color: "sariq-to'q sariq",
  structure: "Oktaedr (Oₕ simmetriya)",
  metalLigand: "Co–N",
  spaceGroup: "Fm3̄m (kubik, yuz-markazlashgan)",
  crystalSystem: "Kubik",
  pointGroup: "Oₕ",
  bondLength: "1.96 Å",
  bondAngle: "90° / 180°",
  cfseValue: "-2.4Δₒ + 2P",
  deltaOh: "22 900 cm⁻¹ (~274 kJ/mol)",
  pairingEnergy: "~21 000 cm⁻¹",
}

// Cho'qqilar — batafsil ilmiy izohlar bilan
const irPeaks = [
  {
    freq: 3320, T: 8, absorbance: 0.92,
    assignment: "νₐₛ(N–H)",
    assignment_uz: "N–H asimmetrik cho'zilish",
    intensity: "Juda kuchli", intensityCode: 4,
    bond: "N–H", symmetry: "T₁ᵤ (F₁ᵤ) — IQ faol",
    forceConstant: "6.35 mdyn/Å", bondLength: "1.021 Å",
    region: "X–H cho'zilish sohasi (3500–3200 cm⁻¹)",
    freeLigand: "Erkin NH₃: 3444 cm⁻¹ (νₐₛ)",
    coordShift: "Koordinatsiya tufayli −124 cm⁻¹ pastga siljigan",
    theoryNote: "NH₃ ligandining asimmetrik N–H cho'zilish tebranishi. Koordinatsiyalanganda ν(N–H) chastotasi pasayadi — bu N atomining Co ga elektron juftini berishi natijasida N–H bog'ining biroz zaiflashishini ko'rsatadi. Oₕ simmetriyasida t₁ᵤ vakolatiga tegishli, shuning uchun (∂μ/∂Q)₀ ≠ 0 — IQ faol.",
    diagnostic: "Ammin komplekslarni identifikatsiya qilishning asosiy diagnostik signali",
  },
  {
    freq: 3240, T: 22, absorbance: 0.75,
    assignment: "νₛ(N–H)",
    assignment_uz: "N–H simmetrik cho'zilish",
    intensity: "Kuchli", intensityCode: 3,
    bond: "N–H", symmetry: "A₁g — Raman faol",
    forceConstant: "6.20 mdyn/Å", bondLength: "1.021 Å",
    region: "X–H cho'zilish sohasi (3500–3200 cm⁻¹)",
    freeLigand: "Erkin NH₃: 3337 cm⁻¹ (νₛ)",
    coordShift: "Koordinatsiya tufayli −97 cm⁻¹ pastga siljigan",
    theoryNote: "NH₃ ning simmetrik N–H cho'zilishi. Oₕ da a₁g simmetriyaga ega — bu tebranishda dipol moment o'zgarmaydi, shuning uchun (∂μ/∂Q)₀ = 0 va IQ da rasman noaktiv. Ammo qattiq holatda kristall panjara ta'siri va koordinatsiya bir oz IQ intensivlik beradi (relaxation).",
    diagnostic: "Raman spektroskopiyada kuchli, IQ da zaif — alternativ taqiq isboti",
  },
  {
    freq: 1618, T: 42, absorbance: 0.58,
    assignment: "δₐₛ(HNH)",
    assignment_uz: "H–N–H asimmetrik egilish (deformatsiya)",
    intensity: "O'rta", intensityCode: 2,
    bond: "H–N–H", symmetry: "T₁ᵤ — IQ faol",
    forceConstant: "0.65 mdyn·Å/rad²", bondLength: "—",
    region: "Egilish tebranishlar sohasi",
    freeLigand: "Erkin NH₃: 1627 cm⁻¹",
    coordShift: "Deyarli o'zgarmagan (−9 cm⁻¹)",
    theoryNote: "NH₃ dagi H–N–H burchagining asimmetrik egilish tebranishi (scissoring). Koordinatsiya asosan N atomining elektron juftiga ta'sir qiladi, H–N–H burchak esa deyarli o'zgarmaydi (~107°). Shuning uchun ν va koordinatsion NH₃ ν deyarli teng.",
    diagnostic: "Ammin komplekslarda 1600–1650 cm⁻¹ oralig'ida barqaror",
  },
  {
    freq: 1325, T: 58, absorbance: 0.42,
    assignment: "δₛ(NH₃) — umbrella",
    assignment_uz: "NH₃ simmetrik egilish (soyabon mode)",
    intensity: "O'rta", intensityCode: 2,
    bond: "NH₃ butun", symmetry: "A₁g (asosan Raman)",
    forceConstant: "0.52 mdyn·Å/rad²", bondLength: "—",
    region: "NH₃ deformatsiya sohasi",
    freeLigand: "Erkin NH₃: 950 cm⁻¹",
    coordShift: "Koordinatsiya tufayli +375 cm⁻¹ yuqoriga siljigan!",
    theoryNote: "«Soyabon» (umbrella) tebranishi — N atomi NH₃ tekisligiga perpendikulyar harakatlanadi. Erkin NH₃ da bu tebranish 950 cm⁻¹ (past — chunki N erkin inversiyaga uchraydi). Koordinatsiyalanganda N inversiyasi to'sqinlik qiladi va chastota 1325 cm⁻¹ ga ko'tariladi — bu KOORDINATSIYANING ENG YAQQOL DIAGNOSTIK BELGISI.",
    diagnostic: "🔥 Koordinatsiyaning diagnostik ko'rsatkichi — erkin NH₃ dan katta farq",
  },
  {
    freq: 830, T: 48, absorbance: 0.52,
    assignment: "ρᵣ(NH₃)",
    assignment_uz: "NH₃ rocking (chayqalish)",
    intensity: "O'rta-kuchli", intensityCode: 3,
    bond: "NH₃ butun", symmetry: "T₁ᵤ + T₂ᵤ",
    forceConstant: "0.38 mdyn·Å/rad²", bondLength: "—",
    region: "Ligand rocking sohasi",
    freeLigand: "Erkin NH₃: bu moda mavjud emas (faqat kompleksda)",
    coordShift: "Faqat koordinatsion NH₃ da (720–890 cm⁻¹)",
    theoryNote: "NH₃ guruhining butun holda Co atomi atrofida chayqalish (rocking) tebranishi. Bu moda erkin NH₃ da mavjud EMAS — chunki erkin NH₃ da rocking translatsion harakat bo'lib qoladi. Faqat metallga bog'langanda hosil bo'ladi. Shuning uchun ρ(NH₃) — koordinatsiyaning to'g'ridan-to'g'ri isboti.",
    diagnostic: "Faqat kompleksda mavjud → koordinatsiyaning yana bir tasdig'i",
  },
  {
    freq: 503, T: 35, absorbance: 0.65,
    assignment: "νₐₛ(Co–N) ν₃",
    assignment_uz: "Co–N asimmetrik cho'zilish",
    intensity: "Kuchli", intensityCode: 3,
    bond: "Co–N", symmetry: "T₁ᵤ (ν₃) — IQ faol",
    forceConstant: "1.85 mdyn/Å", bondLength: "1.960 Å",
    region: "Metall–ligand cho'zilish sohasi (uzoq IQ)",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote: "Co–N bog'lanishining asimmetrik cho'zilish tebranishi — koordinatsion kimyoning ENG MUHIM DIAGNOSTIK CHO'QQISI. Nakamoto ma'lumotlariga ko'ra oktaedrik [M(NH₃)₆]ⁿ⁺ komplekslarda 490–520 cm⁻¹ oralig'ida joylashadi. Kuch konstantasi k = 1.85 mdyn/Å — bu Co(III)–N bog'ining mustahkamligini isbotlaydi (Co(II)–N ~1.2 mdyn/Å dan katta).",
    diagnostic: "🔬 KOORDINATSION KIMYONING ASOSIY DIAGNOSTIK CHO'QQISI",
  },
  {
    freq: 448, T: 50, absorbance: 0.50,
    assignment: "νₛ(Co–N)",
    assignment_uz: "Co–N simmetrik cho'zilish",
    intensity: "O'rta-kuchli", intensityCode: 3,
    bond: "Co–N", symmetry: "A₁g — Raman faol",
    forceConstant: "1.78 mdyn/Å", bondLength: "1.960 Å",
    region: "Metall–ligand cho'zilish sohasi (uzoq IQ)",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote: "Co–N simmetrik cho'zilishi — Oₕ da a₁g simmetriyaga ega, faqat Raman faol. Rasman IQ noaktiv (mutual exclusion), lekin qattiq namunada sitraluk kristall maydon buzilishi tufayli zaif polosa sifatida ko'rinishi mumkin. Raman spektrida esa asosiy polosa — Raman intensivlik ~10× kuchli.",
    diagnostic: "Alternativ taqiq (mutual exclusion) namunasi — Ramanda kuchli, IQ da zaif",
  },
  {
    freq: 328, T: 66, absorbance: 0.34,
    assignment: "δₐₛ(N–Co–N) ν₄",
    assignment_uz: "N–Co–N asimmetrik egilish",
    intensity: "O'rta-zaif", intensityCode: 2,
    bond: "N–Co–N", symmetry: "T₁ᵤ (ν₄) — IQ faol",
    forceConstant: "0.28 mdyn·Å/rad²", bondLength: "—",
    region: "Skelet egilish sohasi (uzoq IQ)",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote: "N–Co–N burchagining asimmetrik egilishi (oktaedrik skelet deformatsiyasi). t₁ᵤ ga tegishli, IQ faol. Bu moda cis (90°) va trans (180°) N–Co–N burchaklariga bog'liq. Kuch konstanta past (0.28) — burchak egilishi bog' cho'zilishidan ~6 baravar oson.",
    diagnostic: "Oktaedrik skelet tebranishi — Oₕ simmetriyani tasdiqlaydi",
  },
  {
    freq: 265, T: 82, absorbance: 0.18,
    assignment: "δₛ(N–Co–N)",
    assignment_uz: "N–Co–N simmetrik egilish",
    intensity: "Zaif", intensityCode: 1,
    bond: "N–Co–N", symmetry: "T₂ᵤ — IQ va Raman noaktiv",
    forceConstant: "0.22 mdyn·Å/rad²", bondLength: "—",
    region: "Uzoq IQ (far-IR) sohasi",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote: "T₂ᵤ ga tegishli skelet deformatsion moda — rasman IQ noaktiv VA Raman noaktiv («silent» moda). Faqat koherent neytron sochilish (INS) yoki kristall panjara buzilishi orqali ko'rinishi mumkin. Bu Oₕ simmetriyaning nozik tekshiruvi — agar polosa aniq ko'rinsa, simmetriya buzilgan.",
    diagnostic: "«Silent» moda — Oₕ da IQ va Raman noaktiv",
  },
]

// To'liq spektr nuqtalari (Lorentzian formalar hosil qilish uchun)
const irSpectrum = [
  { freq: 4000, absorbance: 0.02 }, { freq: 3800, absorbance: 0.03 },
  { freq: 3600, absorbance: 0.06 }, { freq: 3500, absorbance: 0.12 },
  { freq: 3400, absorbance: 0.35 }, { freq: 3320, absorbance: 0.92 },
  { freq: 3280, absorbance: 0.82 }, { freq: 3240, absorbance: 0.75 },
  { freq: 3180, absorbance: 0.30 }, { freq: 3000, absorbance: 0.05 },
  { freq: 2500, absorbance: 0.03 }, { freq: 2000, absorbance: 0.03 },
  { freq: 1800, absorbance: 0.04 }, { freq: 1700, absorbance: 0.15 },
  { freq: 1618, absorbance: 0.58 }, { freq: 1580, absorbance: 0.20 },
  { freq: 1400, absorbance: 0.15 }, { freq: 1325, absorbance: 0.42 },
  { freq: 1280, absorbance: 0.15 }, { freq: 1100, absorbance: 0.05 },
  { freq: 900, absorbance: 0.10 }, { freq: 830, absorbance: 0.52 },
  { freq: 780, absorbance: 0.15 }, { freq: 650, absorbance: 0.08 },
  { freq: 550, absorbance: 0.20 }, { freq: 503, absorbance: 0.65 },
  { freq: 475, absorbance: 0.55 }, { freq: 448, absorbance: 0.50 },
  { freq: 400, absorbance: 0.15 }, { freq: 350, absorbance: 0.12 },
  { freq: 328, absorbance: 0.34 }, { freq: 300, absorbance: 0.14 },
  { freq: 265, absorbance: 0.18 }, { freq: 200, absorbance: 0.03 },
]

// Werner koordinatsion qatori — taqqoslash uchun
const wernerSeries = [
  { formula: "[Co(NH₃)₆]Cl₃", trad: "Luteo (sariq)", color: "sariq", nuCoN: "503, 448", nuNH: "3320, 3240", agCl: 3, inner: 0, current: true },
  { formula: "[Co(NH₃)₅Cl]Cl₂", trad: "Purpureo (binafsha)", color: "binafsha", nuCoN: "490, 470", nuNH: "3280, 3200", agCl: 2, inner: 1, current: false },
  { formula: "cis-[Co(NH₃)₄Cl₂]Cl", trad: "Violeo (binafsha)", color: "to'q binafsha", nuCoN: "490, 470", nuNH: "3260, 3180", agCl: 1, inner: 2, current: false },
  { formula: "trans-[Co(NH₃)₄Cl₂]Cl", trad: "Praseo (yashil)", color: "yashil", nuCoN: "485", nuNH: "3260, 3180", agCl: 1, inner: 2, current: false },
]

// Namuna tayyorlash usullari
const techniques = [
  {
    name: "KBr tabletka (Pellet)",
    description: "Namunani KBr tuzi bilan aralashtirib (1:200), 10 tonna bosim ostida shaffof tabletka bosiladi.",
    advantages: ["An'anaviy standart usul", "4000–400 cm⁻¹ da shaffof", "Yuqori aniqlik (2–4 cm⁻¹)", "Kvantitativ tahlil imkoni"],
    disadvantages: ["KBr gigroskopik → suv polosalari", "400 cm⁻¹ dan pastda yo'q", "Ba'zi namunalar KBr bilan reaksiyaga kirishadi", "10–15 daqiqa tayyorlash"],
    bestFor: "Standart tahlil, keng chastota oralig'i, aniq kvantitativ",
    freqRange: "4000–400 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "10–15 daq"
  },
  {
    name: "CsI tabletka (uzoq IQ)",
    description: "KBr o'rniga CsI ishlatiladi — 200 cm⁻¹ gacha shaffof. M–L tebranishlarni ko'rish uchun majburiy.",
    advantages: ["200 cm⁻¹ gacha shaffof", "Barcha M–L polosalarni ko'radi", "Uzoq IQ zonasi ochiladi", "M–Cl, M–Br, M–I aniqlanadi"],
    disadvantages: ["Qimmat (CsI narxi KBr dan 5×)", "Yanada gigroskopik", "Maxsus tayyorlash ehtiyot bilan", "Chiziqli detektor kerak"],
    bestFor: "Uzoq IQ (200–400 cm⁻¹), metall–ligand, halogeno komplekslar",
    freqRange: "4000–200 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "10–15 daq"
  },
  {
    name: "Nujol mull",
    description: "Namuna Nujol (mineral moy) bilan aralashtirilib, NaCl yoki KBr oynasi orasiga qo'yiladi.",
    advantages: ["Nam va gigroskopik namunalar uchun", "Namuna maydalash oson (5 daq)", "Namuna buzilmaydi", "Tez o'lchash"],
    disadvantages: ["Nujol o'zi polosalar beradi: 2920, 2850, 1460, 1375", "C–H sohasi to'liq yopiladi", "Kvantitativ imkoniyati chekli", "NaCl namga sezgir"],
    bestFor: "Gigroskopik, KBr bilan reaksiyaga kiruvchi namunalar",
    freqRange: "4000–400 cm⁻¹ (C–H sohasi bekilgan)", resolution: "4 cm⁻¹", samplePrep: "5–10 daq"
  },
  {
    name: "ATR (Attenuated Total Reflectance)",
    description: "Namuna to'g'ridan-to'g'ri ATR kristali (olmos, ZnSe, Ge) ustiga qo'yiladi.",
    advantages: ["Namuna tayyorlashsiz (30 s)", "Namuna butunligicha saqlanadi", "Suyuq, gel, kukun — hammasi", "Zamonaviy laboratoriya standarti"],
    disadvantages: ["Faqat sirt qatlami skaner (mikrometrlar)", "Past chastotada intensivlik pasayadi (~600 dan)", "Cho'qqi joylashuvi biroz siljigan", "ATR kristal toza bo'lishi shart"],
    bestFor: "Tez skrining, sifat nazorati, farmatsevtika",
    freqRange: "4000–650 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "30 s – 2 daq"
  },
]

// Halaqit beruvchi omillar
const interferences = [
  { source: "Suv bug'i (H₂O)", freqRange: "3800–3500, 1640", effect: "Keng shovqinli polosalar N–H va H–N–H sohalarini qoplaydi", severity: "Yuqori", solution: "Spektrometr kamerasini quruq N₂ bilan puflash (5–10 daqiqa). KBr ni 110°C da 2 soat quritish. Desikatorda saqlash." },
  { source: "CO₂ (atmosfera)", freqRange: "2350, 667", effect: "O'tkir polosa 2350 cm⁻¹ va bimolekulyar 667 cm⁻¹ da", severity: "O'rta", solution: "N₂ purge yoki CO₂ scrubber (silika-ashqar). Zamonaviy asboblarda avtomatik atmosfera kompensatsiya." },
  { source: "Nam KBr", freqRange: "3400 (keng), 1640", effect: "Suv polosalari + KBr sifati pasayishi", severity: "Yuqori", solution: "KBr ni 110°C da 2 soat quritish. Namuna quritgichda saqlash. Har 1 hafta yangilash." },
  { source: "Nujol moyi (agar ishlatilsa)", freqRange: "2920, 2850, 1460, 1375", effect: "Kuchli C–H polosalar C–H sohasini butunlay qoplaydi", severity: "O'rta", solution: "KBr tabletka usulini afzal ko'ring. Agar Nujol shart bo'lsa, C–D deuteratlangan Nujol ishlatish." },
  { source: "Namuna aralashmasi", freqRange: "Butun spektr", effect: "Qo'shimcha polosalar spektrni buzadi", severity: "Yuqori", solution: "Namunani rekristallizatsiya qilish. Element tahlil (EA) va NMR bilan sofligini tekshirish." },
  { source: "Tabletka qalinligi", freqRange: "Butun spektr", effect: "Qalin → to'yingan (T=0), yupqa → shovqin ustunligi", severity: "O'rta", solution: "1 mg namuna + 200 mg KBr, 10 t bosim, 1 mm qalinlik — optimal." },
  { source: "Zarralar o'lchami", freqRange: "> 2 mkm", effect: "Sochilish (Christiansen effekt) → bazaviy chiziq egiladi", severity: "O'rta", solution: "Agat hovonchada 3–5 daqiqa yanchish. Zarralar < 2 mkm." },
  { source: "Kristal panjara ta'siri", freqRange: "M–L soha", effect: "Cho'qqilar ikkiga bo'linishi (site splitting)", severity: "Past", solution: "Suyultirilgan namuna (KBr bilan 1:1000) yoki eritmada o'lchash (agar eruvchan bo'lsa)." },
]

// Ilmiy-nazariy bloklar
const groupTheoryData = {
  pointGroup: "Oₕ",
  order: 48,
  operations: "E, 8C₃, 6C₂, 6C₄, 3C₂(=C₄²), i, 6S₄, 8S₆, 3σₕ, 6σd",
  totalModes: "3N − 6 = 3(13) − 6 = 33 ta normal moda",
  reducibleRep: "Γₜₒₜ = A₁g + Eg + T₂g + T₁ᵤ + T₂ᵤ + 6T (…)",
  MLModes: "Γ(M–L) = A₁g + Eg + T₁ᵤ",
  MLBending: "Γ(δ M–L) = T₁ᵤ + T₂g + T₂ᵤ",
  irActive: "T₁ᵤ",
  ramanActive: "A₁g, Eg, T₂g",
  silent: "T₁g, T₂ᵤ — IQ va Raman ikkalasida noaktiv",
  mutualExclusion: "Inversiya markazi (i) mavjud → gerade (g) faqat Raman, ungerade (u) faqat IQ",
}

// Kuch konstantasi va chastota bog'liqligi (Hooke)
const forceConstantExamples = [
  { bond: "C≡O (erkin)", k: 18.6, freq: 2143, note: "Uchbog', juda kuchli" },
  { bond: "C≡N (erkin)", k: 17.7, freq: 2200, note: "Uchbog'" },
  { bond: "O–H", k: 7.7, freq: 3600, note: "Yengil H → yuqori ν" },
  { bond: "N–H (erkin NH₃)", k: 6.3, freq: 3444, note: "Yengil, kuchli" },
  { bond: "N–H (koordinatsion)", k: 6.35, freq: 3320, note: "Bu kompleksda" },
  { bond: "C=O", k: 12.1, freq: 1750, note: "Ikki bog'" },
  { bond: "C=C", k: 9.6, freq: 1650, note: "Ikki bog'" },
  { bond: "C–C", k: 4.5, freq: 1000, note: "Yagona bog'" },
  { bond: "Co–N (bu kompleks)", k: 1.85, freq: 503, note: "M–L, og'ir metall" },
  { bond: "Pt–Cl", k: 1.9, freq: 320, note: "Og'ir metall, og'ir Cl" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CoNH36Cl3_IQ() {
  const [showHeader, setShowHeader] = useState(true)
  const [freqSlider, setFreqSlider] = useState(3320)
  const [activePeak, setActivePeak] = useState(0)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)

  // PDF bo'limlarini tanlash
  const [pdfSections, setPdfSections] = useState({
    identification: true,
    theory: true,
    peaks: true,
    spectrum: true,
    groupTheory: true,
    forceConstant: true,
    werner: true,
    techniques: true,
    interferences: true,
    conclusions: true,
  })

  // CFSE hisoblagich
  const [calcDq, setCalcDq] = useState(22900)
  const [calcP, setCalcP] = useState(21000)

  // Eng yaqin cho'qqi
  const currentPeak = useMemo(() => {
    let closest = irPeaks[0]
    let minDiff = Math.abs(freqSlider - irPeaks[0].freq)
    for (let i = 1; i < irPeaks.length; i++) {
      const diff = Math.abs(freqSlider - irPeaks[i].freq)
      if (diff < minDiff) { minDiff = diff; closest = irPeaks[i] }
    }
    return closest
  }, [freqSlider])

  const cfseResult = useMemo(() => {
    const cfse = -2.4 * calcDq + 2 * calcP
    return { cfse: cfse.toFixed(0), cfseKJ: (cfse * 0.01196).toFixed(2) }
  }, [calcDq, calcP])

  const muEff = useMemo(() => {
    const n = 0 // d⁶ past spin → 0 toq elektron
    return Math.sqrt(n * (n + 2)).toFixed(2)
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // 📄 PDF EKSPORT — FAQAT IQ TAHLILI UCHUN, TO'LIQ ILMIY
  // 3D snapshot va adabiyotlar YO'Q
  // ═══════════════════════════════════════════════════════════════════════════
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
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib")
      const fontkit = (await import("@pdf-lib/fontkit")).default

      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)

      // ── Fontlar ──────────────────────────────────
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

      // ── Ranglar ─────────────────────────────────
      const C = {
        purple: rgb(0.30, 0.11, 0.58),
        purpleLight: rgb(0.86, 0.78, 1.0),
        purpleMid: rgb(0.65, 0.55, 0.98),
        purpleSoft: rgb(0.51, 0.39, 0.71),
        purpleDark: rgb(0.12, 0.11, 0.29),
        yellow: rgb(0.80, 0.60, 0.05),
        yellowDeep: rgb(0.60, 0.45, 0.02),
        yellowSoft: rgb(0.55, 0.45, 0.10),
        textDark: rgb(0.08, 0.08, 0.16),
        textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0),
        orangeDeep: rgb(0.71, 0.39, 0),
        green: rgb(0.08, 0.47, 0.31),
        greenDark: rgb(0.12, 0.47, 0.27),
        blue: rgb(0.08, 0.31, 0.55),
        brown: rgb(0.71, 0.39, 0.12),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0),
        bgYellow: rgb(1.0, 0.98, 0.92),
        bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0),
        bgGreen: rgb(0.94, 1.0, 0.98),
        bgRed: rgb(1.0, 0.95, 0.95),
        bgAbstract: rgb(0.96, 0.94, 1.0),
        white: rgb(1, 1, 1),
        red: rgb(0.80, 0.20, 0.20),
      }

      // ── O'lchamlar ──────────────────────────────
      const PAGE_W = 595.28
      const PAGE_H = 841.89
      const MARGIN = 50
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30
      const HEADER_H = 65

      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNum = 1

      // ── Yordamchi funksiyalar ──────────────────
      const measure = (text, font, size) => font.widthOfTextAtSize(String(text), size)
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
          if (measure(current, font, size) > maxWidth) {
            let piece = ""
            for (const ch of current) {
              if (measure(piece + ch, font, size) > maxWidth) { lines.push(piece); piece = ch }
              else piece += ch
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
        let fx = x
        const w = measure(finalText, font, size)
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
        lines.forEach((line, i) => {
          page.drawText(line, { x, y: sy - i * lh, size, font, color })
        })
        return lines.length * lh
      }

      const addFooter = () => {
        const leftText = truncate(
          `JDA-Kimyo IQ Tahlili  •  [Co(NH₃)₆]Cl₃ (Luteo-kobalt)  •  ${new Date().toLocaleDateString("uz-UZ")}`,
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
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.yellow })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13,
          font: boldFont, color: C.yellowDeep, maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
        })
        y -= 14
      }

      const drawTableRow = (label, value, bgColor = C.bgYellow, labelColor = C.yellowDeep) => {
        const rowH = 20
        const labelW = 200
        const valueX = MARGIN + labelW + 6
        const valueMaxW = CONTENT_W - labelW - 12
        checkPageBreak(rowH + 2)
        page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: bgColor })
        safeText(label, { x: MARGIN + 6, y: y - 13, size: 9, font: boldFont, color: labelColor, maxWidth: labelW - 8 })
        const valStr = cleanText(value)
        const finalVal = truncate(valStr, regularFont, 9, valueMaxW)
        page.drawText(finalVal, { x: valueX, y: y - 13, size: 9, font: regularFont, color: C.textDark })
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

      // ═══════════════════════════════════════════════════════════
      // SARLAVHA POLOSASI
      // ═══════════════════════════════════════════════════════════
      page.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.purpleDark })
      safeText("JDA-KIMYO ILMIY BYULLETENI  •  IQ Spektroskopiya  •  Vol. 2, Son 2", {
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
      safeText("Koordinatsion Kimyo — Molekulyar Tebranish Spektroskopiyasi", {
        x: MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86), maxWidth: CONTENT_W * 0.65,
      })
      safeText("DOI: 10.0000/jda-kimyo.iq.2026.001", {
        x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8,
        font: regularFont, color: rgb(0.71, 0.71, 0.86), align: "right", maxWidth: CONTENT_W * 0.3,
      })
      y = PAGE_H - HEADER_H - 30

      // ═══════════════════════════════════════════════════════════
      // TITLE
      // ═══════════════════════════════════════════════════════════
      drawCenteredText(`[Co(NH₃)₆]Cl₃ — IQ Spektroskopik Tahlili`, y, 20, boldFont, C.textDark)
      y -= 28
      drawCenteredText("Geksaamminkobalt(III) xlorid  •  «Luteo-kobalt»", y, 12, italicFont, C.purpleSoft)
      y -= 20
      drawCenteredText(
        `Simmetriya: Oₕ  •  Konfiguratsiya: d⁶ (past spin, t₂g⁶eg⁰)  •  Diamagnit  •  M = 267.48 g/mol`,
        y, 9, regularFont, C.textMuted
      )
      y -= 28

      // ═══════════════════════════════════════════════════════════
      // ANNOTATSIYA (ABSTRACT)
      // ═══════════════════════════════════════════════════════════
      const abstract =
        `Geksaamminkobalt(III) xlorid [Co(NH₃)₆]Cl₃ Werner koordinatsion nazariyasining klassik namunasidir. ` +
        `Ushbu ishda uning IQ (infraqizil) spektri 4000–200 cm⁻¹ oralig'ida to'liq tahlil qilingan. ` +
        `Asosiy diagnostik polosalar: νₐₛ(N–H) = 3320 cm⁻¹, νₛ(N–H) = 3240 cm⁻¹ (X–H cho'zilish sohasi); ` +
        `δₐₛ(HNH) = 1618 cm⁻¹; δₛ(NH₃) umbrella = 1325 cm⁻¹ (koordinatsiyaning diagnostik ko'rsatkichi — ` +
        `erkin NH₃ dan +375 cm⁻¹ yuqoriga siljigan); ρᵣ(NH₃) = 830 cm⁻¹ (faqat kompleksda); ` +
        `νₐₛ(Co–N) = 503 cm⁻¹ va νₛ(Co–N) = 448 cm⁻¹ — koordinatsion kimyoning eng muhim ` +
        `diagnostik polosalari. Oₕ simmetriyasi tufayli mutual exclusion qoidasi ishlaydi: gerade (g) ` +
        `modalar faqat Raman, ungerade (u) faqat IQ da faol. Kuch konstantalari: k(N–H) = 6.35, ` +
        `k(Co–N) = 1.85 mdyn/Å — Co(III)–N bog'ining mustahkamligini tasdiqlaydi.`

      const absPadding = 12
      const absInnerW = CONTENT_W - 2 * absPadding
      const absLines = wrapText(cleanText(abstract), regularFont, 9.5, absInnerW)
      const boxH = 24 + absLines.length * 13 + 8
      checkPageBreak(boxH + 20)
      page.drawRectangle({
        x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
        color: C.bgAbstract, borderColor: C.purpleMid, borderWidth: 1,
      })
      safeText("QISQACHA XULOSA (ANNOTATSIYA)", {
        x: MARGIN + absPadding, y: y - 16, size: 10, font: boldFont, color: C.purple, maxWidth: absInnerW,
      })
      absLines.forEach((line, i) => {
        page.drawText(line, {
          x: MARGIN + absPadding, y: y - 32 - i * 13,
          size: 9.5, font: regularFont, color: C.textDark,
        })
      })
      y -= boxH + 22

      let sectionNum = 1

      // ═══════════════════════════════════════════════════════════
      // 1. BIRIKMA IDENTIFIKATSIYASI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.identification) {
        drawSectionHeader(sectionNum++, "Birikma Identifikatsiyasi")
        const idData = [
          ["Formula", "[Co(NH₃)₆]Cl₃"],
          ["IUPAC nomi", "Geksaamminkobalt(III) xlorid"],
          ["An'anaviy nomi", "Luteo-kobalt (Werner)"],
          ["CAS raqami", "10534-89-1"],
          ["Molar massa", "267.48 g/mol"],
          ["Rangi", "Sariq — to'q sariq kristall"],
          ["Kristall tizim", "Kubik (Fm3̄m fazoviy guruh)"],
          ["Nuqtaviy guruh", "Oₕ (48-tartib)"],
          ["Koordinatsion son", "6 (oktaedrik)"],
          ["Metall ioni", "Co³⁺ (d⁶)"],
          ["Ligand tipi", "NH₃ (kuchli maydon, σ-donor)"],
          ["Co–N bog' uzunligi", "1.960 Å (XRD ma'lumot)"],
          ["Erish nuqtasi", "Parchalanadi ~180°C"],
          ["Suvda eruvchanligi", "260 g/L (25°C) — yaxshi eriydi"],
        ]
        idData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgYellow : C.white, C.yellowDeep)
        })
        y -= 15
      }

      // ═══════════════════════════════════════════════════════════
      // 2. NAZARIY ASOS — IQ SPEKTROSKOPIYASI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.theory) {
        drawSectionHeader(sectionNum++, "IQ Spektroskopiyasining Nazariy Asosi")

        drawWrappedText(
          "IQ (infraqizil) spektroskopiya molekulaning tebranish darajalari orasidagi kvantlangan energiya o'tishlarini o'lchashga asoslangan. Kvant mexanikasi bo'yicha, molekula IQ diapazondagi (4000–200 cm⁻¹) fotonlarni yutganda, u yuqori tebranish holatiga (v=0 → v=1) o'tadi. Bu o'tish sodir bo'lishi uchun ikki asosiy shart bajarilishi kerak:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("IQ (infraqizil) spektroskopiya molekulaning tebranish darajalari orasidagi kvantlangan energiya o'tishlarini o'lchashga asoslangan. Kvant mexanikasi bo'yicha, molekula IQ diapazondagi (4000–200 cm⁻¹) fotonlarni yutganda, u yuqori tebranish holatiga (v=0 → v=1) o'tadi. Bu o'tish sodir bo'lishi uchun ikki asosiy shart bajarilishi kerak:", regularFont, 9.5, CONTENT_W).length * 13 + 8

        // Shartlar
        drawInfoBox(
          "1) Kvant tanlash qoidasi: Δv = ±1 (asosiy o'tish). Yuqori kvant sonlariga o'tish (Δv=±2, ±3) obertonlar deb ataladi va intensivligi past.",
          C.bgBlue, C.blue, C.textDark
        )
        drawInfoBox(
          "2) IQ faollik sharti: (∂μ/∂Q)₀ ≠ 0 — normal koordinata Q bo'yicha dipol moment o'zgarishi nolga teng bo'lmasligi kerak. Bu shart bajarilmasa (masalan, N₂, O₂ kabi gomonuklear molekulalarda), tebranish IQ da noaktiv, faqat Raman spektroskopiyada ko'rinadi.",
          C.bgBlue, C.blue, C.textDark
        )

        drawWrappedText(
          "Hooke qonuni asosida tebranish chastotasi ν̃ = (1/2πc)·√(k/μ), bunda k — bog' kuch konstantasi (mdyn/Å), μ — keltirilgan massa: μ = m₁m₂/(m₁+m₂). Shundan kelib chiqadiki: (a) kuchli bog' → yuqori ν; (b) og'ir atomlar → past ν. [Co(NH₃)₆]³⁺ da N–H bog'i yengil H tufayli 3320 cm⁻¹ da, Co–N bog'i esa og'ir Co atomi tufayli 503 cm⁻¹ da tebranadi.",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Hooke qonuni asosida tebranish chastotasi ν̃ = (1/2πc)·√(k/μ), bunda k — bog' kuch konstantasi (mdyn/Å), μ — keltirilgan massa: μ = m₁m₂/(m₁+m₂). Shundan kelib chiqadiki: (a) kuchli bog' → yuqori ν; (b) og'ir atomlar → past ν. [Co(NH₃)₆]³⁺ da N–H bog'i yengil H tufayli 3320 cm⁻¹ da, Co–N bog'i esa og'ir Co atomi tufayli 503 cm⁻¹ da tebranadi.", regularFont, 9.5, CONTENT_W).length * 13 + 10

        drawWrappedText(
          "N atomli chiziqsiz molekula uchun 3N−6 ta mustaqil normal tebranish moda mavjud. [Co(NH₃)₆]³⁺ (Co + 6N + 18H = 25 atom) uchun 3(25)−6 = 69 ta moda. Ammo simmetriya (Oₕ) ko'p modalarni takrorlantiradi. Faqat T₁ᵤ simmetriyali modalar IQ faol; A₁g, Eg, T₂g faqat Raman faol; T₁g va T₂ᵤ — ikkalasida ham noaktiv («silent» modalar).",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("N atomli chiziqsiz molekula uchun 3N−6 ta mustaqil normal tebranish moda mavjud. [Co(NH₃)₆]³⁺ (Co + 6N + 18H = 25 atom) uchun 3(25)−6 = 69 ta moda. Ammo simmetriya (Oₕ) ko'p modalarni takrorlantiradi. Faqat T₁ᵤ simmetriyali modalar IQ faol; A₁g, Eg, T₂g faqat Raman faol; T₁g va T₂ᵤ — ikkalasida ham noaktiv («silent» modalar).", regularFont, 9.5, CONTENT_W).length * 13 + 10
      }


      // ═══════════════════════════════════════════════════════════
      // 3. CHO'QQILAR JADVALI — TO'LIQ TAHLIL
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.peaks) {
        drawSectionHeader(sectionNum++, "IQ Cho'qqilar Jadvali — Batafsil Tayinlash")

        // Jadval sarlavhasi
        const colW = [55, 75, 105, 55, 90, 100]  // freq, assignment, description, T%, symmetry, force k
        const headerY = y
        page.drawRectangle({
          x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.yellowDeep,
        })
        const headers = ["ν̃ (cm⁻¹)", "Tayinlash", "Tavsif", "T%", "Simmetriya", "k (mdyn/Å)"]
        let cx = MARGIN + 4
        headers.forEach((h, i) => {
          safeText(h, { x: cx, y: y - 14, size: 8.5, font: boldFont, color: C.white, maxWidth: colW[i] - 4 })
          cx += colW[i]
        })
        y -= 20

        // Har bir cho'qqi qatori
        irPeaks.forEach((p, idx) => {
          checkPageBreak(22)
          const bg = idx % 2 === 0 ? C.bgYellow : C.white
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          let cx2 = MARGIN + 4
          const cells = [
            String(p.freq),
            cleanText(p.assignment),
            cleanText(p.assignment_uz),
            `${p.T}%`,
            cleanText(p.symmetry).split(" — ")[0],
            cleanText(p.forceConstant),
          ]
          cells.forEach((cell, i) => {
            const isNumeric = i === 0 || i === 3
            const font = isNumeric ? boldFont : regularFont
            const color = i === 0 ? C.yellowDeep : C.textDark
            safeText(cell, { x: cx2, y: y - 13, size: 8.5, font, color, maxWidth: colW[i] - 4 })
            cx2 += colW[i]
          })
          y -= 20
        })
        y -= 5

        // Intensivlik legendasi
        drawInfoBox(
          "Intensivlik shkalasi (T%): Juda kuchli (< 15%) — juda ko'p yorug'lik yutiladi; Kuchli (15–40%); O'rta (40–65%); Zaif (> 65%).",
          C.bgYellow, C.yellow, C.textDark
        )

        // Har bir muhim cho'qqi uchun batafsil izoh
        drawWrappedText(
          "Muhim diagnostik cho'qqilar:",
          { x: MARGIN, y, size: 11, font: boldFont, color: C.yellowDeep, maxWidth: CONTENT_W, lineHeight: 14 }
        )
        y -= 16

        const importantPeaks = irPeaks.filter(p => p.diagnostic && (p.diagnostic.includes("🔥") || p.diagnostic.includes("🔬") || p.freq === 830))
        importantPeaks.forEach((p) => {
          checkPageBreak(60)
          // Cho'qqi sarlavhasi
          safeText(`◆ ${p.freq} cm⁻¹  —  ${cleanText(p.assignment)}  (${cleanText(p.assignment_uz)})`, {
            x: MARGIN, y, size: 10, font: boldFont, color: C.orangeDeep, maxWidth: CONTENT_W,
          })
          y -= 14
          const h = drawWrappedText(cleanText(p.theoryNote), {
            x: MARGIN + 8, y, size: 9, font: regularFont, color: C.textDark,
            maxWidth: CONTENT_W - 16, lineHeight: 12,
          })
          y -= h + 6
          if (p.freeLigand && p.freeLigand !== "—") {
            safeText(`   ▸ ${cleanText(p.freeLigand)}   |   ${cleanText(p.coordShift)}`, {
              x: MARGIN + 8, y, size: 8.5, font: italicFont, color: C.purpleSoft, maxWidth: CONTENT_W - 16,
            })
            y -= 12
          }
          y -= 4
        })
      }

      // ═══════════════════════════════════════════════════════════
      // 4. IQ SPEKTR GRAFIGI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.spectrum) {
        drawSectionHeader(sectionNum++, "IQ Spektri Grafigi (4000–200 cm⁻¹)")

        const graphNeed = 230
        checkPageBreak(graphNeed)

        // Grafik joylashuvi
        const gLeftPad = 40
        const gBotPad = 25
        const gTopPad = 15
        const gX = MARGIN + gLeftPad
        const gW = CONTENT_W - gLeftPad - 5
        const gH = 150
        const gY = y - gH - gTopPad
        const xMax = 4000, xMin = 200

        // Fon
        page.drawRectangle({
          x: gX, y: gY, width: gW, height: gH,
          color: rgb(0.98, 1.0, 0.99), borderColor: C.grayLine, borderWidth: 0.5,
        })

        // Y grid + belgilar (T% 0-100)
        for (let tick = 0; tick <= 100; tick += 20) {
          const ty = gY + (tick / 100) * gH
          page.drawLine({
            start: { x: gX, y: ty }, end: { x: gX + gW, y: ty },
            thickness: 0.2, color: rgb(0.9, 0.95, 0.92),
          })
          const label = `${tick}`
          const lw = measure(label, regularFont, 7)
          page.drawText(label, {
            x: gX - lw - 4, y: ty - 3, size: 7,
            font: regularFont, color: C.textMuted,
          })
        }

        // X grid + belgilar (log scale for wavenumber - display normal)
        const xTicks = [4000, 3500, 3000, 2500, 2000, 1500, 1000, 500, 200]
        xTicks.forEach(wn => {
          // IQ spektrida x o'qi teskari yo'nalishda (yuqori chastota chapda)
          const tx = gX + ((xMax - wn) / (xMax - xMin)) * gW
          page.drawLine({
            start: { x: tx, y: gY }, end: { x: tx, y: gY + gH },
            thickness: 0.2, color: rgb(0.9, 0.95, 0.92),
          })
          const label = `${wn}`
          const lw = measure(label, regularFont, 7)
          page.drawText(label, {
            x: tx - lw / 2, y: gY - 11, size: 7,
            font: regularFont, color: C.textMuted,
          })
        })

        // Spektr chizig'i — Lorentzian shaklda simulyatsiya
        const totalPoints = 500
        const transmittance = new Array(totalPoints).fill(1.0)
        irPeaks.forEach(peak => {
          const sigma = peak.freq > 2000 ? 30 : peak.freq > 1000 ? 20 : 15
          for (let i = 0; i < totalPoints; i++) {
            const wn_i = xMin + (i / totalPoints) * (xMax - xMin)
            const absorption = peak.absorbance * Math.exp(-Math.pow(wn_i - peak.freq, 2) / (2 * sigma * sigma))
            transmittance[i] = Math.max(transmittance[i] - absorption, 0.05)
          }
        })

        // Spektr chizig'ini chizish
        for (let i = 0; i < totalPoints - 1; i++) {
          const wn0 = xMin + (i / totalPoints) * (xMax - xMin)
          const wn1 = xMin + ((i + 1) / totalPoints) * (xMax - xMin)
          const x0 = gX + ((xMax - wn0) / (xMax - xMin)) * gW
          const x1 = gX + ((xMax - wn1) / (xMax - xMin)) * gW
          const y0 = gY + transmittance[i] * gH
          const y1 = gY + transmittance[i + 1] * gH
          page.drawLine({
            start: { x: x0, y: y0 }, end: { x: x1, y: y1 },
            thickness: 0.9, color: C.greenDark,
          })
        }

        // Cho'qqi belgilari — grafik ustida
        irPeaks.forEach((peak, idx) => {
          const px = gX + ((xMax - peak.freq) / (xMax - xMin)) * gW
          const py = gY + (1 - peak.absorbance) * gH
          // Cho'qqi to'liq chizig'i
          page.drawLine({
            start: { x: px, y: py }, end: { x: px, y: gY + gH },
            thickness: 0.3, color: C.red,
          })
          // Cho'qqi to'lqin soni
          const wnStr = `${peak.freq}`
          const wnW = measure(wnStr, boldFont, 7)
          const labelX = Math.max(gX + 2, Math.min(gX + gW - wnW - 2, px - wnW / 2))
          page.drawText(wnStr, {
            x: labelX, y: gY + gH + 4 + (idx % 3) * 8,
            size: 7, font: boldFont, color: C.red,
          })
        })

        // O'q nomlari
        const xAxisLabel = "To'lqin soni (cm⁻¹)"
        const xAxisW = measure(xAxisLabel, italicFont, 9)
        page.drawText(xAxisLabel, {
          x: gX + (gW - xAxisW) / 2, y: gY - 22, size: 9,
          font: italicFont, color: C.greenDark,
        })
        // Y o'q
        page.drawText("T (%)", {
          x: gX - 30, y: gY + gH / 2 - 3, size: 9,
          font: italicFont, color: C.greenDark,
        })

        y = gY - 40

        // Zona izohlari
        drawWrappedText(
          "1-rasm. [Co(NH₃)₆]Cl₃ ning simulyatsiyalangan IQ spektri (Lorentzian profil, KBr tabletka simulyatsiyasi). Uch asosiy zona ko'rinadi: (I) X–H cho'zilish sohasi 3320/3240 cm⁻¹ da — kuchli N–H polosalari; (II) NH₃ deformatsiya sohasi 1618 va 1325 cm⁻¹ da — 1325 cm⁻¹ umbrella modasi koordinatsiyaning diagnostik ko'rsatkichi; (III) Metall–ligand cho'zilish sohasi 503/448 cm⁻¹ da — Co–N bog'ining bevosita isboti.",
          { x: MARGIN, y, size: 8.5, font: italicFont, color: C.purpleSoft, maxWidth: CONTENT_W, lineHeight: 11 }
        )
        y -= wrapText("1-rasm. [Co(NH₃)₆]Cl₃ ning simulyatsiyalangan IQ spektri (Lorentzian profil, KBr tabletka simulyatsiyasi). Uch asosiy zona ko'rinadi: (I) X–H cho'zilish sohasi 3320/3240 cm⁻¹ da — kuchli N–H polosalari; (II) NH₃ deformatsiya sohasi 1618 va 1325 cm⁻¹ da — 1325 cm⁻¹ umbrella modasi koordinatsiyaning diagnostik ko'rsatkichi; (III) Metall–ligand cho'zilish sohasi 503/448 cm⁻¹ da — Co–N bog'ining bevosita isboti.", italicFont, 8.5, CONTENT_W).length * 11 + 15
      }

      // ═══════════════════════════════════════════════════════════
      // 5. GURUH NAZARIYASI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.groupTheory) {
        drawSectionHeader(sectionNum++, "Guruh Nazariyasi — Oₕ Simmetriyasi")

        const gtData = [
          ["Nuqtaviy guruh", "Oₕ (oktaedrik)"],
          ["Guruh tartibi", "48 ta simmetriya operatsiyasi"],
          ["Operatsiyalar", "E, 8C₃, 6C₂, 6C₄, 3C₂', i, 6S₄, 8S₆, 3σₕ, 6σd"],
          ["Inversiya markazi", "MAVJUD (i) — mutual exclusion qoidasi ishlaydi"],
          ["Umumiy normal modalar", "3N−6 = 3(25)−6 = 69 ta"],
          ["Skelet ML₆ modalari", "A₁g + Eg + T₁ᵤ + T₂ᵤ + 2T₁ᵤ (6×3 = 18 ta)"],
          ["ν(M–L) cho'zilish", "A₁g + Eg + T₁ᵤ"],
          ["δ(M–L) egilish", "T₁ᵤ + T₂g + T₂ᵤ"],
          ["IQ faol modalar", "T₁ᵤ (ν₃ va ν₄) — 2 ta kuzatiladi"],
          ["Raman faol modalar", "A₁g, Eg, T₂g — 3 ta kuzatiladi"],
          ["Silent modalar", "T₁g, T₂ᵤ — IQ va Ramanda ko'rinmaydi"],
        ]
        gtData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgPurple : C.white, C.purple)
        })
        y -= 10

        drawInfoBox(
          "Mutual Exclusion qoidasi: Oₕ simmetriyada inversiya markazi (i) mavjud bo'lgani sababli, hech qaysi tebranish moda bir vaqtda IQ va Ramanda faol bo'la olmaydi. Bu qoida IQ ni tasdiqlash uchun Raman spektroskopiyasi bilan komplementar ishlatishni talab qiladi. Amaliy xulosa: agar spektrda ν(N–H) IQ da 3320 cm⁻¹ da kuchli, Raman da 3320 cm⁻¹ da yo'q va 3240 cm⁻¹ da kuchli bo'lsa — bu Oₕ simmetriyaning to'g'ridan-to'g'ri isboti.",
          C.bgBlue, C.blue, C.textDark
        )

        drawInfoBox(
          "Werner nazariyasining tasdig'i: Barcha 6 ta NH₃ ligandi ekvivalent → ν(Co–N) uchun ideal holatda faqat bitta cho'qqi kutiladi. Ammo simmetriya tahlili shuni ko'rsatadiki, 6 ta Co–N tebranishlaridan hosil bo'lgan 3 ta modadan (A₁g + Eg + T₁ᵤ) faqat T₁ᵤ IQ faol. Shuning uchun IQ da 1 ta ν(Co–N) polosasi (503 cm⁻¹) va Ramanda 2 ta (A₁g da 448, Eg da 460 cm⁻¹) kutiladi. Amaliyotda esa 503 va 448 cm⁻¹ da 2 ta polosa ko'rinadi — 448 cm⁻¹ site simmetriyasining pasayishi tufayli IQ ga zaif chiqadi.",
          C.bgYellow, C.yellow, C.textDark
        )
      }


      // ═══════════════════════════════════════════════════════════
      // 6. KUCH KONSTANTASI — HOOKE QONUNI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.forceConstant) {
        drawSectionHeader(sectionNum++, "Kuch Konstantasi va Hooke Qonuni")
        drawWrappedText(
          "Hooke qonuni bo'yicha bog' tebranish chastotasi: ν̃ = (1/2πc)·√(k/μ). Bu formula asosida biz nafaqat bog' turini, balki uning MUSTAHKAMLIGINI aniq son shaklida o'lchay olamiz. Quyidagi jadval bog' turi, kuch konstantasi (k) va kuzatilgan chastotani ko'rsatadi:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Hooke qonuni bo'yicha bog' tebranish chastotasi: ν̃ = (1/2πc)·√(k/μ). Bu formula asosida biz nafaqat bog' turini, balki uning MUSTAHKAMLIGINI aniq son shaklida o'lchay olamiz. Quyidagi jadval bog' turi, kuch konstantasi (k) va kuzatilgan chastotani ko'rsatadi:", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.orangeDeep })
        const fcHeaders = ["Bog' turi", "k (mdyn/Å)", "ν̃ (cm⁻¹)", "Izoh"]
        const fcColW = [150, 90, 90, 165]
        let fcx = MARGIN + 6
        fcHeaders.forEach((h, i) => {
          safeText(h, { x: fcx, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: fcColW[i] - 4 })
          fcx += fcColW[i]
        })
        y -= 20

        forceConstantExamples.forEach((f, idx) => {
          checkPageBreak(20)
          const isHighlight = f.bond.includes("N–H (koord") || f.bond.includes("Co–N (bu")
          const bg = isHighlight ? C.bgYellow : (idx % 2 === 0 ? C.bgOrange : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let cx3 = MARGIN + 6
          const cells = [f.bond, String(f.k), String(f.freq), f.note]
          cells.forEach((cell, i) => {
            const font = isHighlight ? boldFont : (i === 0 ? boldFont : regularFont)
            const color = isHighlight ? C.yellowDeep : (i === 0 ? C.orangeDeep : C.textDark)
            safeText(cell, { x: cx3, y: y - 12, size: 8.5, font, color, maxWidth: fcColW[i] - 4 })
            cx3 += fcColW[i]
          })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "Xulosa: Co–N bog'i k = 1.85 mdyn/Å bilan Co(II)–N (k ≈ 1.2 mdyn/Å) dan sezilarli darajada mustahkamroq. Bu Co(III) ning yuqori oksidlanish darajasi va d⁶ past spin konfiguratsiyasi tufayli σ-bog'lanish kuchayishini isbotlaydi. Shuningdek, Co–N kuch konstantasi Cr–N (k ≈ 1.4) va Ni–N (k ≈ 1.5) dan yuqori — bu ligand maydon nazariyasi kutayotgan qatorga mos keladi: Co(III) > Cr(III) > Ni(II).",
          C.bgGreen, C.green, C.textDark
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 7. WERNER QATORI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.werner) {
        drawSectionHeader(sectionNum++, "Werner Koordinatsion Qatori")
        drawWrappedText(
          "Alfred Werner 1893-yilda kobalt(III) ammin komplekslarini o'rganib, ichki va tashqi koordinatsion sfera tushunchasini kiritdi. Bu 4 ta klassik kompleks koordinatsion kimyoning asosi sifatida qabul qilingan. Werner 1913-yilda birinchi kimyo Nobel mukofotini olgan.",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Alfred Werner 1893-yilda kobalt(III) ammin komplekslarini o'rganib, ichki va tashqi koordinatsion sfera tushunchasini kiritdi. Bu 4 ta klassik kompleks koordinatsion kimyoning asosi sifatida qabul qilingan. Werner 1913-yilda birinchi kimyo Nobel mukofotini olgan.", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.purple })
        const wHeaders = ["Kompleks", "Rang (an'anaviy)", "ν(Co–N)", "Ichki Cl", "Ag⁺+Cl⁻"]
        const wColW = [155, 100, 80, 65, 95]
        let wcx = MARGIN + 6
        wHeaders.forEach((h, i) => {
          safeText(h, { x: wcx, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: wColW[i] - 4 })
          wcx += wColW[i]
        })
        y -= 20

        wernerSeries.forEach((w, idx) => {
          checkPageBreak(22)
          const bg = w.current ? C.bgYellow : (idx % 2 === 0 ? C.bgPurple : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          let cx4 = MARGIN + 6
          const cells = [w.formula, w.trad, w.nuCoN, String(w.inner), `${w.agCl} × AgCl`]
          cells.forEach((cell, i) => {
            const font = w.current ? boldFont : (i === 0 ? boldFont : regularFont)
            const color = w.current ? C.yellowDeep : (i === 0 ? C.purple : C.textDark)
            safeText(cell, { x: cx4, y: y - 13, size: 8.5, font, color, maxWidth: wColW[i] - 4 })
            cx4 += wColW[i]
          })
          y -= 20
        })
        y -= 8

        drawInfoBox(
          "Werner tajribasining mohiyati: AgNO₃ eritmasi qo'shilganda faqat TASHQI sferadagi Cl⁻ ionlari cho'kadi. [Co(NH₃)₆]Cl₃ dan 3 ta Cl⁻ cho'kadi → barcha NH₃ ichki sferada. [Co(NH₃)₅Cl]Cl₂ dan faqat 2 ta cho'kadi → 1 ta Cl⁻ ichki sferada. Bu tajriba koordinatsion son (6) va ichki/tashqi sfera tushunchasini eksperimental isbotlagan. IQ spektroskopiya bu natijalarni tasdiqlaydi: ichki Cl bo'lganda ν(Co–Cl) 330–310 cm⁻¹ da yangi polosa paydo bo'ladi.",
          C.bgPurple, C.purple, C.textDark
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 8. NAMUNA TAYYORLASH USULLARI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.techniques) {
        drawSectionHeader(sectionNum++, "Namuna Tayyorlash Usullari")

        techniques.forEach((t, idx) => {
          checkPageBreak(160)
          page.drawRectangle({
            x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.blue,
          })
          safeText(`${idx + 1}. ${t.name}`, {
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
            `Chastota: ${t.freqRange}  •  Ruxsat: ${t.resolution}  •  Namuna tayyorlash: ${t.samplePrep}`,
            { x: MARGIN, y, size: 8, font: italicFont, color: C.purpleSoft, maxWidth: CONTENT_W }
          )
          y -= 12
          safeText(`Eng yaxshi qo'llanish: ${t.bestFor}`, {
            x: MARGIN, y, size: 8, font: italicFont, color: C.purpleSoft, maxWidth: CONTENT_W,
          })
          y -= 16
        })
      }

      // ═══════════════════════════════════════════════════════════
      // 9. HALAQIT BERUVCHI OMILLAR
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.interferences) {
        drawSectionHeader(sectionNum++, "IQ Tahliliga Halaqit Beruvchi Omillar")

        drawWrappedText(
          "IQ spektroskopiyada aniq va tozalangan spektr olish uchun bir qator halaqit beruvchi omillarni bartaraf etish zarur. Quyidagi jadval eng ko'p uchraydigan muammolarni va ularning yechimlarini ko'rsatadi:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("IQ spektroskopiyada aniq va tozalangan spektr olish uchun bir qator halaqit beruvchi omillarni bartaraf etish zarur. Quyidagi jadval eng ko'p uchraydigan muammolarni va ularning yechimlarini ko'rsatadi:", regularFont, 9.5, CONTENT_W).length * 13 + 10

        interferences.forEach((iv, idx) => {
          checkPageBreak(60)
          const sevColor = iv.severity === "Yuqori" ? C.red : (iv.severity === "O'rta" ? C.orange : C.green)
          const sevBg = iv.severity === "Yuqori" ? C.bgRed : (iv.severity === "O'rta" ? C.bgOrange : C.bgGreen)
          page.drawRectangle({
            x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: sevBg,
          })
          safeText(`${idx + 1}. ${iv.source}`, {
            x: MARGIN + 6, y: y - 12, size: 9.5, font: boldFont, color: sevColor, maxWidth: CONTENT_W * 0.5,
          })
          safeText(`ν̃: ${iv.freqRange} cm⁻¹`, {
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

      // ═══════════════════════════════════════════════════════════
      // 10. XULOSALAR
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.conclusions) {
        drawSectionHeader(sectionNum++, "Asosiy Xulosalar")

        const conclusions = [
          "[Co(NH₃)₆]Cl₃ ning IQ spektri Oₕ simmetriyaga to'liq mos keladi. T₁ᵤ vakolatiga tegishli 2 ta ν(Co–N) polosasi (503 va 448 cm⁻¹) va ν(N–H) polosalari (3320 va 3240 cm⁻¹) diagnostik ahamiyatga ega.",
          "Metall–ligand tebranishlari (500–200 cm⁻¹) uzoq IQ (far-IR) sohasida joylashgan bo'lib, uni to'liq o'rganish uchun CsI oynali FT-IR yoki maxsus FIR moduli talab qilinadi. Bu soha koordinatsion kimyoning eng ma'lumotli qismidir.",
          "1325 cm⁻¹ dagi δₛ(NH₃) umbrella modasi erkin NH₃ (950 cm⁻¹) dan +375 cm⁻¹ yuqoriga siljigan — bu koordinatsiyaning eng yaqqol diagnostik ko'rsatkichi. Koordinatsiya N atomining inversiyasini to'sib, chastotani sezilarli oshiradi.",
          "Oₕ simmetriyasi tufayli mutual exclusion qoidasi ishlaydi: gerade (g) modalar faqat Raman, ungerade (u) faqat IQ da faol. Bu qoida IQ va Raman spektroskopiyalarini komplementar ishlatishni majburiy qiladi.",
          "Kuch konstantalari k(N–H) = 6.35 mdyn/Å va k(Co–N) = 1.85 mdyn/Å bo'lib, Co(III)–N bog'ining mustahkamligini isbotlaydi. Co(II)–N (k≈1.2) bilan taqqoslaganda, Co(III) yuqori oksidlanish darajasi tufayli σ-bog'lanish kuchayadi.",
          "Werner nazariyasi (1893) IQ spektroskopiya orqali to'liq tasdiqlanadi: barcha 6 ta NH₃ ichki sferada, ekvivalent — shuning uchun ν(Co–N) polosalari soni juda kam (T₁ᵤ dan 1 ta). Agar ligandlar noekvivalent bo'lganda, ko'p polosalar ko'rinardi.",
          "Namuna tayyorlash usuli sifatida KBr tabletka standart, ammo M–L tebranishlarni (< 400 cm⁻¹) o'rganish uchun CsI tabletka talab qilinadi. ATR usuli ekspress-tahlil uchun qulay, lekin far-IR sohasi zaif.",
          "Suv (H₂O) va CO₂ atmosfera ta'siri IQ tahlilida asosiy halaqit manbalari. N₂ purge va KBr ni quritish natijaning sifatini keskin oshiradi. Bu texnikaviy detallar spektrni ilmiy jihatdan qabul qilinadigan holatga keltiradi.",
        ]

        conclusions.forEach((c, idx) => {
          checkPageBreak(35)
          page.drawCircle({ x: MARGIN + 10, y: y - 8, size: 8, color: C.yellow })
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

      pdfDoc.setTitle(`[Co(NH₃)₆]Cl₃ IQ Spektroskopik Tahlili`)
      pdfDoc.setSubject("Geksaamminkobalt(III) xlorid — Infraqizil spektroskopiya")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo IQ Tahlil Moduli")
      pdfDoc.setKeywords(["Co(NH3)6Cl3", "Luteo-kobalt", "IR spectroscopy", "Werner", "Oh symmetry"])

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Co_NH3_6_Cl3_IQ_tahlili_${new Date().toISOString().slice(0, 10)}.pdf`
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
  // RENDER (JSX)
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* ═══════════ HEADER ═══════════ */}
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
              <span className="text-yellow-400 font-semibold">[Co(NH₃)₆]Cl₃</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2 flex-wrap">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🔍 IQ</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Oₕ simmetriya</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">ν(Co-N) 503</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">d⁶ past spin</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Werner 1893</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setPdfModalOpen(true)}
                  className="text-xs bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-4 py-2 rounded-lg transition-all whitespace-nowrap font-bold shadow-lg shadow-yellow-500/20"
                >
                  📄 PDF Hisobot
                </button>
                <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-center">
                  ← Barcha birikmalar
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-yellow-600 hover:bg-yellow-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      {/* ═══════════ PDF MODAL ═══════════ */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-950 to-blue-950 border-2 border-yellow-500 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <span className="text-3xl">📄</span> PDF Hisobot — Bo'limlarni tanlang
              </h3>
              <button onClick={() => setPdfModalOpen(false)} className="text-purple-400 hover:text-white text-2xl">×</button>
            </div>
            <p className="text-purple-200 text-sm mb-4">
              [Co(NH₃)₆]Cl₃ ning IQ spektroskopik tahlilining ilmiy hisoboti. Ilmiy maqola uslubida, DejaVu Sans fonti bilan, A4 formatida chop etiladi.
            </p>

            <div className="space-y-2 mb-6">
              {[
                { key: "identification", label: "1. Birikma identifikatsiyasi", desc: "Formula, CAS, molar massa, kristall tuzilma" },
                { key: "theory", label: "2. Nazariy asos", desc: "Kvant mexanikasi, Hooke qonuni, 3N-6 modalar" },
                { key: "peaks", label: "3. Cho'qqilar jadvali", desc: "9 ta polosa — chastota, tayinlash, kuch konstanta" },
                { key: "spectrum", label: "4. IQ spektri grafigi", desc: "Lorentzian simulyatsiya, 4000-200 cm⁻¹" },
                { key: "groupTheory", label: "5. Guruh nazariyasi", desc: "Oₕ simmetriya, tanlash qoidalari, mutual exclusion" },
                { key: "forceConstant", label: "6. Kuch konstantasi", desc: "10 ta bog' turi taqqoslash jadvali" },
                { key: "werner", label: "7. Werner koordinatsion qatori", desc: "Luteo, Purpureo, Violeo, Praseo" },
                { key: "techniques", label: "8. Namuna tayyorlash usullari", desc: "KBr, CsI, Nujol, ATR — afzallik/kamchilik" },
                { key: "interferences", label: "9. Halaqit beruvchi omillar", desc: "8 ta omil va yechimlari" },
                { key: "conclusions", label: "10. Asosiy xulosalar", desc: "8 ta ilmiy xulosa" },
              ].map(s => (
                <label
                  key={s.key}
                  className="flex items-start gap-3 p-3 bg-purple-800/30 border border-purple-700/40 rounded-lg hover:border-yellow-500/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={pdfSections[s.key]}
                    onChange={(e) => setPdfSections({ ...pdfSections, [s.key]: e.target.checked })}
                    className="mt-1 accent-yellow-500"
                  />
                  <div className="flex-1">
                    <div className="text-yellow-300 font-semibold text-sm">{s.label}</div>
                    <div className="text-purple-300 text-xs mt-0.5">{s.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
              <p className="text-yellow-200 text-xs">
                <strong>⚠ Eslatma:</strong> PDF Unicode belgilarni (Δ, ν̃, π, ⁻¹, ₂ va h.k.) qo'llash uchun{" "}
                <code className="bg-purple-950 px-1 rounded">/public/fonts/</code> papkasida DejaVuSans.ttf, DejaVuSans-Bold.ttf va DejaVuSans-Oblique.ttf fayllari bo'lishi kerak.
                Kutilgan hajm: ~4-6 sahifa A4.
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
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {pdfGenerating ? "⏳ Yaratilmoqda..." : "📥 PDF ni yuklab olish"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══════════ 1. HERO KARTASI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik Oₕ</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d⁶ past spin</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Inert</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4 flex-wrap">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              [Co(NH₃)₆]Cl₃
            </h2>
            <span className="text-purple-400 text-lg">267.48 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            geksaamminkobalt(III) xlorid — <span className="text-yellow-400 italic">«Luteo-kobalt» (sariq kobalt)</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">Werner koordinatsion nazariyasi</strong> (1893) ning klassik namunasi.
            IQ spektri asosiy uch zonaga bo'linadi: <strong className="text-cyan-300">X–H sohasi</strong> (3320, 3240 cm⁻¹ da
            ν(N–H)), <strong className="text-purple-300">NH₃ deformatsiya sohasi</strong> (1618 va 1325 cm⁻¹) va{" "}
            <strong className="text-orange-300">metall–ligand sohasi</strong> (503 va 448 cm⁻¹ da ν(Co–N)). Barcha 6 ta NH₃ ekvivalent —
            Oₕ simmetriya tufayli IQ da faqat T₁ᵤ modalari faol.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Co³⁺ (d⁶)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Konfiguratsiya</div>
              <div className="text-white font-bold">t₂g⁶ eg⁰</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Oktaedrik (Oₕ)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">0 μ<sub>B</sub> (diamagnit)</div>
            </div>
          </div>
        </div>

        {/* ═══════════ 2. NAZARIY ASOS ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📚</span> IQ spektroskopiyasining nazariy asosi
          </h2>

          <p className="text-purple-200 leading-relaxed">
            <strong className="text-yellow-400">Infraqizil spektroskopiya</strong> molekulaning tebranish darajalari orasidagi{" "}
            <strong>kvantlangan energiya o'tishlarini</strong> o'lchashga asoslangan. Molekula IQ diapazondagi (4000–200 cm⁻¹) foton yutganda, u yuqori tebranish holatiga o'tadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-300 font-bold mb-3">🌊 Garmonik osillator modeli</h3>
              <p className="text-purple-200 text-sm mb-3">
                Ikki atomli molekulani ideal prujina bilan bog'langan ikki massa deb tasavvur qilamiz (Hooke qonuni):
              </p>
              <div className="bg-purple-950/60 rounded-lg p-3 font-mono text-xs text-cyan-300 mb-3">
                <div className="text-yellow-300 text-sm text-center my-2">
                  ν̃ = (1/2πc) · √(k/μ)
                </div>
                <div className="text-purple-300 text-[10px] mt-2">
                  • k — bog' kuch konstantasi (mdyn/Å)<br />
                  • μ — keltirilgan massa: m₁m₂/(m₁+m₂)<br />
                  • c — yorug'lik tezligi<br />
                  • ν̃ — to'lqin soni (cm⁻¹)
                </div>
              </div>
              <div className="bg-purple-950/60 rounded-lg p-3 font-mono text-xs">
                <div className="text-yellow-300 text-sm text-center my-1">E<sub>v</sub> = ℏω(v + ½)</div>
                <div className="text-purple-300 text-[10px]">v = 0, 1, 2, 3, ... kvant soni</div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-300 font-bold mb-3">🎯 IQ faollik shartlari</h3>
              <div className="space-y-3">
                <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold text-sm mb-1">1. Kvant tanlash qoidasi</p>
                  <p className="text-purple-200 text-xs">Δv = ±1 (asosiy o'tish). Yuqoriroq (Δv=2, 3) — obertonlar, intensivligi past.</p>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold text-sm mb-1">2. Dipol moment sharti</p>
                  <p className="text-purple-200 text-xs font-mono">(∂μ/∂Q)₀ ≠ 0</p>
                  <p className="text-purple-200 text-xs mt-1">Tebranish davomida dipol moment o'zgarishi zarur — aks holda IQ noaktiv (faqat Raman).</p>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold text-sm mb-1">3. Normal modalar soni</p>
                  <p className="text-purple-200 text-xs">Chiziqsiz molekulada 3N−6, chiziqli molekulada 3N−5. [Co(NH₃)₆]³⁺ da: 3(25)−6 = <strong className="text-cyan-300">69 ta moda</strong>.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">Hooke qonunining amaliy tatbig'i:</strong> Bu kompleksda N–H bog'i yengil vodorod tufayli 3320 cm⁻¹ da (μ ~ 1), Co–N bog'i og'ir kobalt tufayli 503 cm⁻¹ da (μ ~ 12) tebranadi. Chastotalar nisbati √(k<sub>NH</sub>·μ<sub>CoN</sub> / k<sub>CoN</sub>·μ<sub>NH</sub>) = √(6.35·12 / 1.85·1) ≈ 6.6, bu 3320/503 ≈ 6.6 bilan mos keladi — Hooke qonuni to'g'ri!
            </p>
          </div>
        </div>

        {/* ═══════════ 3. INTERAKTIV IQ SPEKTR GRAFIGI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈</span> Interaktiv IQ spektri — batafsil izohlar bilan
          </h2>

          <p className="text-purple-200 leading-relaxed">
            Quyidagi spektr <strong className="text-yellow-400">Lorentzian shakl funksiyasi</strong> asosida simulyatsiya qilingan. Slayderni harakatlantiring yoki cho'qqilarni bosing — barcha nazariy izohlar avtomatik ko'rsatiladi.
          </p>

          {/* Slayder */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <label className="block text-yellow-400 font-bold mb-2">
              To'lqin soni: <span className="font-mono text-2xl">{freqSlider}</span> cm⁻¹
            </label>
            <input
              type="range" min="200" max="4000" value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>200 (M-L)</span>
              <span>1000</span>
              <span>2000</span>
              <span>3000</span>
              <span>4000 (X-H)</span>
            </div>
          </div>

          {/* Joriy cho'qqi ma'lumoti */}
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-500/40 rounded-xl p-5">
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
              <div>
                <span className="text-xs text-purple-400 uppercase">Eng yaqin cho'qqi:</span>
                <div className="text-3xl font-mono font-bold text-yellow-400">{currentPeak.freq} cm⁻¹</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-purple-400 uppercase">Zona:</span>
                <div className="text-sm text-cyan-300 font-semibold">{currentPeak.region}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">Tayinlash</div>
                <div className="text-yellow-300 font-mono font-bold text-sm">{currentPeak.assignment}</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">O'tkazuvchanlik</div>
                <div className="text-white font-mono font-bold text-sm">{currentPeak.T}%</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">Simmetriya</div>
                <div className="text-cyan-300 font-mono font-bold text-sm">{currentPeak.symmetry}</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">Kuch konstanta</div>
                <div className="text-orange-300 font-mono font-bold text-sm">{currentPeak.forceConstant}</div>
              </div>
            </div>
            <div className="bg-purple-950/60 rounded-lg p-4 mb-3">
              <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Nazariy izoh:
              </div>
              <p className="text-purple-200 text-xs leading-relaxed">{currentPeak.theoryNote}</p>
            </div>
            {currentPeak.freeLigand !== "—" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-blue-900/20 border border-blue-700/40 rounded p-3">
                  <div className="text-blue-300 text-[10px] uppercase font-bold mb-1">Erkin ligand</div>
                  <p className="text-purple-200 text-xs">{currentPeak.freeLigand}</p>
                </div>
                <div className="bg-orange-900/20 border border-orange-700/40 rounded p-3">
                  <div className="text-orange-300 text-[10px] uppercase font-bold mb-1">Koordinatsiya siljishi</div>
                  <p className="text-purple-200 text-xs">{currentPeak.coordShift}</p>
                </div>
              </div>
            )}
            {currentPeak.diagnostic && (
              <div className="mt-3 bg-yellow-600/20 border border-yellow-500/40 rounded p-3">
                <p className="text-yellow-200 text-xs font-semibold">💎 {currentPeak.diagnostic}</p>
              </div>
            )}
          </div>

          {/* SVG spektr grafigi */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <div className="text-xs text-purple-400 mb-2 flex items-center justify-between">
              <span>IQ spektr — Lorentzian simulyatsiya (KBr tabletka)</span>
              <span className="font-mono">4000 — 200 cm⁻¹</span>
            </div>
            <svg viewBox="0 0 800 320" className="w-full h-auto">
              {/* Y grid */}
              {[0, 20, 40, 60, 80, 100].map((v, i) => {
                const gy = 250 - (v / 100) * 220
                return (
                  <g key={i}>
                    <line x1="60" y1={gy} x2="770" y2={gy} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x="52" y={gy + 3} textAnchor="end" fontSize="9" fill="#a78bfa">{v}</text>
                  </g>
                )
              })}
              <text x="20" y="140" textAnchor="middle" fontSize="11" fill="#fbbf24" transform="rotate(-90, 20, 140)" fontWeight="bold">O'tkazuvchanlik T (%)</text>

              {/* X grid (teskari — chapdan 4000, o'ngdan 200) */}
              {[4000, 3500, 3000, 2500, 2000, 1500, 1000, 500, 200].map((f, i) => {
                const gx = 60 + ((4000 - f) / 3800) * 710
                return (
                  <g key={i}>
                    <line x1={gx} y1="30" x2={gx} y2="250" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={gx} y="275" textAnchor="middle" fontSize="9" fill="#a78bfa">{f}</text>
                  </g>
                )
              })}
              <text x="415" y="295" textAnchor="middle" fontSize="11" fill="#fbbf24" fontWeight="bold">To'lqin soni (cm⁻¹)</text>

              {/* Zonalar (fon ranglari) */}
              <rect x={60 + ((4000 - 3600) / 3800) * 710} y="30" width={((3600 - 3100) / 3800) * 710} height="220" fill="#22d3ee" opacity="0.05" />
              <rect x={60 + ((4000 - 1700) / 3800) * 710} y="30" width={((1700 - 1200) / 3800) * 710} height="220" fill="#a78bfa" opacity="0.05" />
              <rect x={60 + ((4000 - 600) / 3800) * 710} y="30" width={((600 - 200) / 3800) * 710} height="220" fill="#fb923c" opacity="0.05" />

              {/* Zone labels */}
              <text x={60 + ((4000 - 3350) / 3800) * 710} y="45" fontSize="8" fill="#22d3ee" textAnchor="middle" fontWeight="bold">X-H zonasi</text>
              <text x={60 + ((4000 - 1450) / 3800) * 710} y="45" fontSize="8" fill="#a78bfa" textAnchor="middle" fontWeight="bold">Deformatsiya</text>
              <text x={60 + ((4000 - 400) / 3800) * 710} y="45" fontSize="8" fill="#fb923c" textAnchor="middle" fontWeight="bold">M-L zonasi</text>

              {/* Spektr chizig'i (Lorentzian) */}
              <polyline
                fill="none" stroke="#4ade80" strokeWidth="2"
                points={(() => {
                  const pts = []
                  for (let f = 4000; f >= 200; f -= 10) {
                    let T = 1.0
                    irPeaks.forEach(p => {
                      const sigma = p.freq > 2000 ? 25 : p.freq > 1000 ? 20 : 15
                      T -= p.absorbance * Math.exp(-Math.pow(f - p.freq, 2) / (2 * sigma * sigma))
                    })
                    T = Math.max(T, 0.02)
                    const x = 60 + ((4000 - f) / 3800) * 710
                    const y = 250 - T * 220
                    pts.push(`${x},${y}`)
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

              {/* Cho'qqi markerlari */}
              {irPeaks.map((peak, i) => {
                const x = 60 + ((4000 - peak.freq) / 3800) * 710
                const y = 250 - (1 - peak.T / 100) * 220
                const isActive = currentPeak.freq === peak.freq || activePeak === i
                return (
                  <g key={i} onClick={() => { setActivePeak(i); setFreqSlider(peak.freq) }} className="cursor-pointer">
                    <circle cx={x} cy={y} r={isActive ? 8 : 5}
                      fill={isActive ? "#fbbf24" : "#4ade80"} stroke="#fff" strokeWidth="1.5" />
                    {isActive && (
                      <>
                        <line x1={x} y1={y} x2={x} y2={y - 25} stroke="#fbbf24" strokeWidth="1" strokeDasharray="1,1" />
                        <rect x={x - 35} y={y - 50} width="70" height="22" rx="3" fill="#1e1a3a" stroke="#fbbf24" strokeWidth="1" />
                        <text x={x} y={y - 38} textAnchor="middle" fontSize="8" fill="#fbbf24" fontWeight="bold">{peak.freq} cm⁻¹</text>
                        <text x={x} y={y - 30} textAnchor="middle" fontSize="7" fill="#a78bfa">{peak.assignment}</text>
                      </>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Cho'qqi tugmalari */}
          <div className="flex flex-wrap gap-2">
            {irPeaks.map((p, i) => (
              <button key={i} onClick={() => { setActivePeak(i); setFreqSlider(p.freq) }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                  currentPeak.freq === p.freq
                    ? 'border-yellow-400 bg-yellow-900/40 shadow-lg shadow-yellow-500/20'
                    : 'border-green-400/40 bg-green-900/10 hover:border-yellow-400/60'
                }`}>
                <span className={`w-2 h-2 rounded-full ${currentPeak.freq === p.freq ? 'bg-yellow-400' : 'bg-green-400'}`} />
                <span className="font-mono text-green-400 font-bold">{p.freq}</span>
                <span className="text-purple-400">{p.assignment}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════ 4. CHO'QQILAR JADVALI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📊</span> Cho'qqilar jadvali — batafsil tayinlash
          </h2>
          <p className="text-purple-200 text-sm">
            9 ta asosiy cho'qqi, ular uchun aniq chastota, tayinlash, simmetriya, kuch konstantasi va erkin ligand bilan taqqoslash.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">ν̃ (cm⁻¹)</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Tayinlash</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Tavsif</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">T%</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Simmetriya</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">k (mdyn/Å)</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Intensivlik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {irPeaks.map((p, i) => (
                  <tr key={i} onClick={() => { setActivePeak(i); setFreqSlider(p.freq) }}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer transition-colors ${
                      currentPeak.freq === p.freq ? "bg-yellow-900/20" : ""
                    }`}>
                    <td className="py-3 px-3 font-mono font-bold text-yellow-400">{p.freq}</td>
                    <td className="py-3 px-3 font-mono text-cyan-300">{p.assignment}</td>
                    <td className="py-3 px-3 text-xs">{p.assignment_uz}</td>
                    <td className="py-3 px-3 font-mono">{p.T}%</td>
                    <td className="py-3 px-3 font-mono text-purple-300 text-xs">{p.symmetry.split(" — ")[0]}</td>
                    <td className="py-3 px-3 font-mono text-orange-300">{p.forceConstant}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        p.intensityCode === 4 ? "bg-red-600/40 text-red-300" :
                        p.intensityCode === 3 ? "bg-orange-600/40 text-orange-300" :
                        p.intensityCode === 2 ? "bg-yellow-600/40 text-yellow-300" :
                        "bg-green-600/40 text-green-300"
                      }`}>{p.intensity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Muhim diagnostik cho'qqilar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-cyan-400 font-bold text-sm mb-2">🔷 X–H sohasi (3320, 3240 cm⁻¹)</div>
              <p className="text-purple-200 text-xs">Kuchli N–H tebranishlari — koordinatsiya tufayli erkin NH₃ (3444) dan pastroq. Ammin komplekslarning barmoq izi.</p>
            </div>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
              <div className="text-purple-400 font-bold text-sm mb-2">🔮 Umbrella modasi (1325 cm⁻¹)</div>
              <p className="text-purple-200 text-xs">Koordinatsiyaning DIAGNOSTIK ko'rsatkichi — erkin NH₃ (950) dan +375 cm⁻¹ yuqoriga siljigan!</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
              <div className="text-orange-400 font-bold text-sm mb-2">🔬 ν(Co–N) (503, 448 cm⁻¹)</div>
              <p className="text-purple-200 text-xs">Koordinatsion kimyoning ASOSIY diagnostik polosalari. Uzoq IQ zonasida — CsI oynali FT-IR kerak.</p>
            </div>
          </div>
        </div>

        {/* ═══════════ 5. GURUH NAZARIYASI — Oh ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔷</span> Guruh nazariyasi tahlili — Oₕ simmetriyasi
          </h2>
          <p className="text-purple-200 text-sm leading-relaxed">
            [Co(NH₃)₆]³⁺ ioni <strong className="text-yellow-400">Oₕ nuqtaviy guruhga</strong> tegishli (48-tartib). Simmetriya operatsiyalari: <span className="font-mono text-cyan-300">E, 8C₃, 6C₂, 6C₄, 3C₂', i, 6S₄, 8S₆, 3σₕ, 6σd</span>.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Normal tebranish modalari</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-cyan-300 text-xs font-bold uppercase mb-1">Umumiy modalar</div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2">3N−6 = 3(25)−6 = 69</div>
                </div>
                <div>
                  <div className="text-cyan-300 text-xs font-bold uppercase mb-1">ML₆ skelet modalar</div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">A₁g + Eg + T₁ᵤ + T₂ᵤ + 2T₁ᵤ</div>
                </div>
                <div>
                  <div className="text-cyan-300 text-xs font-bold uppercase mb-1">ν(Co–N) cho'zilish</div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">A₁g (Raman) + Eg (Raman) + T₁ᵤ (IQ)</div>
                </div>
                <div>
                  <div className="text-cyan-300 text-xs font-bold uppercase mb-1">δ(N–Co–N) egilish</div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">T₁ᵤ (IQ) + T₂g (Raman) + T₂ᵤ (silent)</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Faollik jadvali</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 bg-green-900/20 rounded-lg p-3 border border-green-700/30">
                  <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-green-400 font-bold text-xs">IQ faol</div>
                    <div className="text-purple-200 text-xs font-mono">T₁ᵤ (ν₃ + ν₄) — 2 ta</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-blue-900/20 rounded-lg p-3 border border-blue-700/30">
                  <div className="w-3 h-3 bg-blue-400 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-blue-400 font-bold text-xs">Raman faol</div>
                    <div className="text-purple-200 text-xs font-mono">A₁g, Eg, T₂g — 3 ta</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-900/20 rounded-lg p-3 border border-gray-700/30">
                  <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-gray-400 font-bold text-xs">Silent (ikkalasida ham noaktiv)</div>
                    <div className="text-purple-200 text-xs font-mono">T₁g, T₂ᵤ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">⚡ Mutual Exclusion (alternativ taqiq) qoidasi:</strong> Oₕ da inversiya markazi (i) mavjud — hech qaysi tebranish moda bir vaqtda ham IQ, ham Raman faol bo'la olmaydi. Gerade (g) modalar faqat Ramanda, ungerade (u) faqat IQ da faol. Bu qoida to'g'ridan-to'g'ri IQ+Raman komplementarligi orqali Oₕ simmetriyaning tasdig'ini beradi.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-200 text-sm">
              <strong className="text-yellow-300">🔬 Werner nazariyasining IQ isboti:</strong> Barcha 6 ta NH₃ ekvivalent → ν(Co–N) uchun ideal holatda 1 ta cho'qqi (T₁ᵤ) kutiladi. Amaliyotda 503 va 448 cm⁻¹ da 2 ta ko'rinadi — 448 cm⁻¹ site simmetriyasining pasayishi tufayli IQ ga zaif chiqadi (relaxation). Agar ligandlar noekvivalent bo'lganda (sis-[CoN₄Cl₂] kabi), ν(Co–N) ko'p polosaga bo'linardi.
            </p>
          </div>
        </div>

        {/* ═══════════ 6. KUCH KONSTANTASI JADVALI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💪</span> Kuch konstantasi va Hooke qonuni
          </h2>
          <p className="text-purple-200 text-sm">
            Hooke qonuni asosida bog' kuch konstantasi (k) tebranish chastotasiga proporsional. Quyidagi jadval turli bog'larni taqqoslaydi:
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
                  const isHighlight = f.bond.includes("Co–N (bu") || f.bond.includes("koord")
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isHighlight ? "bg-yellow-900/20" : ""}`}>
                      <td className={`py-3 px-4 font-mono ${isHighlight ? "text-yellow-300 font-bold" : "text-cyan-300"}`}>{f.bond}</td>
                      <td className="py-3 px-4 font-mono text-orange-300">{f.k}</td>
                      <td className="py-3 px-4 font-mono text-yellow-400">{f.freq}</td>
                      <td className="py-3 px-4 text-xs">{f.note}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
            <p className="text-green-200 text-sm">
              <strong className="text-green-300">Xulosa:</strong> Co(III)–N bog'i k = 1.85 mdyn/Å bilan Co(II)–N (k ≈ 1.2 mdyn/Å) dan sezilarli mustahkamroq. Bu oksidlanish darajasi ↑ → σ-bog'lanish ↑ qonuniyatini tasdiqlaydi. Shu bois Co(III) komplekslari INERT — ligand almashinuvi juda sekin (soatlar–kunlar).
            </p>
          </div>
        </div>

        {/* ═══════════ 7. WERNER QATORI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚖️</span> Werner koordinatsion qatori (1893)
          </h2>
          <p className="text-purple-200 leading-relaxed">
            Alfred Werner kobalt(III) ammin komplekslarini o'rganib, ichki va tashqi koordinatsion sfera tushunchasini kiritdi. 1913-yilda birinchi kimyo Nobel mukofotini oldi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Kompleks</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">An'anaviy nom</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">ν(Co-N)</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">ν(N-H)</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Ichki Cl</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">AgNO₃ + n Cl⁻</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {wernerSeries.map((w, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${w.current ? "bg-yellow-900/30" : ""}`}>
                    <td className={`py-3 px-3 font-mono ${w.current ? "font-bold text-yellow-400" : "text-cyan-300"}`}>{w.formula}</td>
                    <td className="py-3 px-3 text-xs">{w.trad}</td>
                    <td className="py-3 px-3 font-mono text-orange-300">{w.nuCoN}</td>
                    <td className="py-3 px-3 font-mono text-blue-300">{w.nuNH}</td>
                    <td className="py-3 px-3 text-center">{w.inner}</td>
                    <td className="py-3 px-3 text-red-400 font-bold">{w.agCl} × AgCl↓</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-200 text-sm">
              <strong className="text-yellow-300">Werner tajribasining mohiyati:</strong> AgNO₃ eritmasi qo'shilganda faqat TASHQI sferadagi Cl⁻ cho'kadi. Luteo-kobaltda 3 ta Cl⁻ cho'kadi → barcha NH₃ ichki sferada. IQ spektroskopiya bu natijalarni tasdiqlaydi: ichki Cl bo'lganda ν(Co–Cl) 330–310 cm⁻¹ da yangi polosa paydo bo'ladi (purpureo, praseo, violeo da ko'rinadi, luteoda YO'Q).
            </p>
          </div>
        </div>

        {/* ═══════════ 8. KRISTALL MAYDON — CFSE ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎨</span> Kristall maydon nazariyasi va CFSE hisoblagich
          </h2>
          <p className="text-purple-200 leading-relaxed">
            Co³⁺ (d⁶) NH₃ (kuchli maydon ligandi) bilan <strong className="text-yellow-400">past spinli t₂g⁶eg⁰</strong> konfiguratsiyasini hosil qiladi.
            Bu diamagnetizm va inertlikning sababi. IQ spektri bu holatni bavosita tasdiqlaydi (kuchli ν(Co–N)).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">📊 Elektron konfiguratsiya</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-purple-700/30 pb-1">
                  <span className="text-purple-400">Co atomi:</span>
                  <span className="text-white font-mono">[Ar] 3d⁷ 4s²</span>
                </div>
                <div className="flex justify-between border-b border-purple-700/30 pb-1">
                  <span className="text-purple-400">Co³⁺ ioni:</span>
                  <span className="text-white font-mono">[Ar] 3d⁶</span>
                </div>
                <div className="flex justify-between border-b border-purple-700/30 pb-1">
                  <span className="text-purple-400">Oktaedrik maydon:</span>
                  <span className="text-white font-mono">t₂g⁶ eg⁰</span>
                </div>
                <div className="flex justify-between border-b border-purple-700/30 pb-1">
                  <span className="text-purple-400">Toq elektron soni:</span>
                  <span className="text-yellow-400 font-mono font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Magnit xossasi:</span>
                  <span className="text-green-400 font-mono font-bold">Diamagnit</span>
                </div>
              </div>

              {/* Orbital diagramma */}
              <div className="mt-4 bg-purple-950/50 rounded-lg p-4">
                <div className="text-xs text-purple-400 mb-3 text-center">Kristall maydon ajralishi</div>
                <div className="relative h-32">
                  {/* eg sath (yuqori) */}
                  <div className="absolute top-2 left-1/4 right-1/4 flex justify-center gap-3">
                    <div className="text-center">
                      <div className="w-14 h-0.5 bg-purple-400"></div>
                      <div className="text-[9px] text-purple-500 mt-1">dz²</div>
                    </div>
                    <div className="text-center">
                      <div className="w-14 h-0.5 bg-purple-400"></div>
                      <div className="text-[9px] text-purple-500 mt-1">dx²-y²</div>
                    </div>
                  </div>
                  <div className="absolute top-1 right-4 text-xs text-purple-300 font-bold">eg (0 e⁻)</div>

                  {/* Δo strelka */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="text-orange-400 text-[10px] font-bold">↕ Δₒ</div>
                    <div className="text-orange-300 text-[9px] font-mono">22 900 cm⁻¹</div>
                  </div>

                  {/* t2g sath (past) */}
                  <div className="absolute bottom-2 left-1/6 right-1/6 flex justify-center gap-3">
                    <div className="text-center">
                      <div className="w-12 h-0.5 bg-purple-400"></div>
                      <div className="flex justify-center text-yellow-400 text-xs -mt-1">↑↓</div>
                      <div className="text-[9px] text-purple-500 mt-1">dxy</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-0.5 bg-purple-400"></div>
                      <div className="flex justify-center text-yellow-400 text-xs -mt-1">↑↓</div>
                      <div className="text-[9px] text-purple-500 mt-1">dxz</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-0.5 bg-purple-400"></div>
                      <div className="flex justify-center text-yellow-400 text-xs -mt-1">↑↓</div>
                      <div className="text-[9px] text-purple-500 mt-1">dyz</div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-4 text-xs text-purple-300 font-bold">t₂g (6 e⁻)</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">🧮 CFSE hisoblagich</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-purple-400 mb-1">Δₒ ajralishi (cm⁻¹):</label>
                  <input type="number" value={calcDq}
                    onChange={(e) => setCalcDq(Number(e.target.value))}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-3 py-2 text-white font-mono focus:border-yellow-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-purple-400 mb-1">P (juftlashish, cm⁻¹):</label>
                  <input type="number" value={calcP}
                    onChange={(e) => setCalcP(Number(e.target.value))}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-3 py-2 text-white font-mono focus:border-yellow-500 outline-none" />
                </div>
                <div className="bg-purple-950/60 rounded-lg p-3 mt-3">
                  <div className="text-[10px] text-purple-400 uppercase mb-1">CFSE (d⁶ past spin):</div>
                  <div className="font-mono text-xs text-cyan-300 mb-1">= −2.4Δₒ + 2P</div>
                  <div className="text-yellow-400 font-mono font-bold text-lg">{cfseResult.cfse} cm⁻¹</div>
                  <div className="text-purple-300 text-xs mt-1">= {cfseResult.cfseKJ} kJ/mol</div>
                </div>
                <div className="bg-purple-950/60 rounded-lg p-3">
                  <div className="text-[10px] text-purple-400 uppercase mb-1">μ<sub>eff</sub> (spin-only):</div>
                  <div className="font-mono text-xs text-cyan-300 mb-1">= √n(n+2), n=0</div>
                  <div className="text-yellow-400 font-mono font-bold text-lg">{muEff} μ<sub>B</sub></div>
                  <div className="text-green-300 text-xs mt-1">Diamagnit</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">Inertlik va IQ spektr:</strong> t₂g⁶ konfiguratsiyasida barcha 3 ta pastki orbital to'lgan. Ligandni chiqarish uchun elektronni yuqori eg orbitalga ko'chirish talab qilinadi — bu esa Δₒ energiyasini talab qiladi. Shuning uchun Co(III) komplekslari INERT (t½ = soatlar). Bu IQ spektroskopiyada aniq va o'tkir cho'qqilar sifatida namoyon bo'ladi — ligand almashinishi tez bo'lganda cho'qqilar kengayadi.
            </p>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-200 text-sm">
              <strong className="text-orange-300">Rang va d–d o'tish:</strong> Sariq rang t₂g → eg o'tishidan kelib chiqadi. λ<sub>max</sub> ≈ 435 nm (¹A₁g → ¹T₁g o'tishi) — ko'k nur yutiladi, sariq nur qaytadi. Δₒ = 22 900 cm⁻¹ ≈ hc/λ. IQ va UV-Vis birga qo'llanganda kompleksning to'liq tavsifi olinadi.
            </p>
          </div>
        </div>

        {/* ═══════════ 9. NAMUNA TAYYORLASH USULLARI ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔬</span> Namuna tayyorlash usullari
          </h2>
          <p className="text-purple-200 text-sm">
            IQ tahlilida 4 ta asosiy texnika mavjud. Har biri o'ziga xos afzallik va cheklovlarga ega.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {techniques.map((t, i) => (
              <button key={i} onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  activeTechnique === i
                    ? "bg-yellow-600/60 text-white border-yellow-400/50 shadow-lg shadow-yellow-500/20"
                    : "bg-purple-800/30 text-purple-400 border-purple-700/50 hover:bg-purple-700/40"
                }`}>
                {t.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold text-lg mb-2">{techniques[activeTechnique].name}</h3>
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

        {/* ═══════════ 10. HALAQIT BERUVCHI OMILLAR ═══════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚠️</span> IQ tahliliga halaqit beruvchi omillar
          </h2>
          <p className="text-purple-200 text-sm">
            Bir qator omillar IQ spektrni buzishi mumkin. Har birini oldini olish va yechish yo'llarini bilish ilmiy tahlilning muhim qismi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Manba</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Chastota (cm⁻¹)</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Ta'sir</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Jiddiylik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {interferences.map((iv, i) => (
                  <tr key={i} onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${activeInterference === i ? "bg-yellow-900/20" : ""}`}>
                    <td className="py-3 px-4 font-bold">{iv.source}</td>
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
              <span>💡</span> Tanlangan omilning yechimi: {interferences[activeInterference].source}
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">{interferences[activeInterference].solution}</p>
          </div>
        </div>

        {/* ═══════════ 11. XULOSA ═══════════ */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✅</span> Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li className="pl-2"><strong className="text-yellow-400">ν(N–H) = 3320, 3240 cm⁻¹</strong> — kuchli o'tkir polosalar, ammin komplekslarning asosiy diagnostik ko'rsatkichi</li>
            <li className="pl-2"><strong className="text-yellow-400">δₛ(NH₃) umbrella = 1325 cm⁻¹</strong> — koordinatsiyaning eng yaqqol isboti (erkin NH₃ 950 dan +375 cm⁻¹ siljiganl)</li>
            <li className="pl-2"><strong className="text-yellow-400">ν(Co–N) = 503, 448 cm⁻¹</strong> — metall-ligand bog'ining bevosita dalili (Nakamoto: 490–520 cm⁻¹)</li>
            <li className="pl-2"><strong className="text-yellow-400">Co³⁺ (d⁶, past spin)</strong> — INERT kompleks, diamagnit, t₂g⁶eg⁰ konfiguratsiya</li>
            <li className="pl-2"><strong className="text-yellow-400">Oₕ simmetriya + mutual exclusion</strong> — gerade (g) faqat Raman, ungerade (u) faqat IQ</li>
            <li className="pl-2"><strong className="text-yellow-400">Werner nazariyasi (1893)</strong> IQ spektroskopiya orqali to'liq tasdiqlangan — barcha 6 ta NH₃ ekvivalent</li>
            <li className="pl-2">Kuch konstantalari k(N–H) = 6.35 va k(Co–N) = 1.85 mdyn/Å — Co(III)–N bog'ining mustahkamligini isbotlaydi</li>
          </ol>
        </div>

        {/* ═══════════ NAVIGATSIYA ═══════════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <button onClick={() => setPdfModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20">
            📄 PDF Hisobot yaratish
          </button>
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-nh3-5-cl-cl2" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            [Co(NH₃)₅Cl]Cl₂ (Purpureo) →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA-Kimyo • [Co(NH₃)₆]Cl₃ (Luteo-kobalt) • IQ spektroskopiya moduli (premium)</p>
          <p className="mt-2 text-purple-600">
            Manbalar: Nakamoto K. — Infrared and Raman Spectra (6-nashr, 2009); Cotton F. A. — Chemical Applications of Group Theory; Lever A.B.P. — Inorganic Electronic Spectroscopy; Werner A. (1893); Bethe H. (1929)
          </p>
        </div>
      </footer>
    </main>
  )
}
