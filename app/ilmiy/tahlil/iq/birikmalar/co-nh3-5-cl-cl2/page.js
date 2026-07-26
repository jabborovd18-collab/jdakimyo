"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₅Cl]Cl₂ — IQ SPEKTROSKOPIYA (PREMIUM ILMIY + PDF EKSPORT)
// Manbalar: Nakamoto K. — Infrared and Raman Spectra of Inorg. & Coord. Compounds (6-nashr),
//           Cotton F.A. — Chemical Applications of Group Theory,
//           Lever A.B.P. — Inorganic Electronic Spectroscopy,
//           Werner A. (1893), Bethe H. (1929), Tolman C. (1970) — trans effekt
// Xususiyat: Purpureo-kobalt, C₄ᵥ simmetriya, ichki sfera Cl⁻ isboti,
//            ν(Co-Cl) 330 cm⁻¹ — Werner nazariyasining ENG YAQQOL IQ isboti
// Til: 100% o'zbek (lotin)
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>Cl]Cl<sub>2</sub>",
  formulaPlain: "[Co(NH3)5Cl]Cl2",
  iupac: "Pentaamminklorokobalt(III) xlorid",
  commonName: "Purpureo-kobalt (binafsha kobalt)",
  molarMass: 250.44,
  casNumber: "13859-51-3",
  color: "to'q qizil-binafsha (purpureo)",
  structure: "Buzuq oktaedr (C₄ᵥ simmetriya)",
  metalLigand: "Co–N (5 ta), Co–Cl (1 ta)",
  spaceGroup: "P2₁/c (monoklinik)",
  crystalSystem: "Monoklinik",
  pointGroup: "C₄ᵥ",
  bondLengthCoN_trans: "1.936 Å (Cl ga qarama-qarshi)",
  bondLengthCoN_cis: "1.973 Å (Cl ga cis)",
  bondLengthCoCl: "2.261 Å",
  bondAngle: "89.4° / 90.6° / 178.2°",
  deltaOh: "20 100 cm⁻¹ (~240 kJ/mol)",
  transEffect: "Cl⁻ zaif trans-effekti (Tolman qatori)",
}

// Cho'qqilar — batafsil ilmiy izohlar bilan
const irPeaks = [
  {
    freq: 3300, T: 12, absorbance: 0.90,
    assignment: "νₐₛ(N–H)",
    assignment_uz: "N–H asimmetrik cho'zilish",
    intensity: "Juda kuchli", intensityCode: 4,
    bond: "N–H", symmetry: "A₁ + E (C₄ᵥ) — barchasi IQ faol",
    forceConstant: "6.28 mdyn/Å", bondLength: "1.021 Å",
    region: "X–H cho'zilish sohasi (3500–3200 cm⁻¹)",
    freeLigand: "Erkin NH₃: 3444 cm⁻¹ (νₐₛ)",
    coordShift: "Koordinatsiya tufayli −144 cm⁻¹ pastga",
    theoryNote: "5 ta NH₃ ligandining N–H asimmetrik cho'zilish tebranishi. C₄ᵥ simmetriyada 4 ta ekvator NH₃ va 1 ta aksial NH₃ mavjud — ular biroz farq qiladi. Ammo IQ da polosalar deyarli qo'shilib ketadi (broadening). Luteo-kobalt (3320 cm⁻¹) dan +20 cm⁻¹ pastroq — Cl⁻ ning kuchsiz elektron donorligi tufayli.",
    diagnostic: "Ammin komplekslarning umumiy diagnostik polosasi",
  },
  {
    freq: 3200, T: 26, absorbance: 0.72,
    assignment: "νₛ(N–H)",
    assignment_uz: "N–H simmetrik cho'zilish",
    intensity: "Kuchli", intensityCode: 3,
    bond: "N–H", symmetry: "A₁ — IQ + Raman faol (i markazi yo'q)",
    forceConstant: "6.15 mdyn/Å", bondLength: "1.021 Å",
    region: "X–H cho'zilish sohasi (3500–3200 cm⁻¹)",
    freeLigand: "Erkin NH₃: 3337 cm⁻¹ (νₛ)",
    coordShift: "Koordinatsiya tufayli −137 cm⁻¹ pastga",
    theoryNote: "MUHIM! C₄ᵥ da inversiya markazi (i) YO'Q — bu Oₕ (luteo-kobalt) dan asosiy farq. Shuning uchun mutual exclusion qoidasi ISHLAMAYDI: A₁ modasi bir vaqtda IQ va Raman ikkalasida ham faol. Bu C₄ᵥ ni Oₕ dan farqlash uchun spektroskopik tekshiruv.",
    diagnostic: "🔬 Simmetriyaning pasayishi (Oₕ → C₄ᵥ) belgisi",
  },
  {
    freq: 1618, T: 44, absorbance: 0.56,
    assignment: "δₐₛ(HNH)",
    assignment_uz: "H–N–H asimmetrik egilish",
    intensity: "O'rta", intensityCode: 2,
    bond: "H–N–H", symmetry: "A₁ + E",
    forceConstant: "0.63 mdyn·Å/rad²", bondLength: "—",
    region: "Egilish tebranishlar sohasi",
    freeLigand: "Erkin NH₃: 1627 cm⁻¹",
    coordShift: "Deyarli o'zgarmagan (−9 cm⁻¹)",
    theoryNote: "H–N–H burchagining asimmetrik egilish tebranishi. Koordinatsiya asosan N atomiga ta'sir qiladi, H–N–H burchak (~107°) deyarli o'zgarmaydi. Bu Luteo-kobaltdagi ν = 1618 cm⁻¹ bilan bir xil — 5 ta NH₃ ligandning muhitini uncha o'zgartirmaydi.",
    diagnostic: "Ammin komplekslarda barqaror polosа",
  },
  {
    freq: 1310, T: 55, absorbance: 0.45,
    assignment: "δₛ(NH₃) — umbrella",
    assignment_uz: "NH₃ simmetrik egilish (soyabon)",
    intensity: "O'rta-kuchli", intensityCode: 3,
    bond: "NH₃ butun", symmetry: "A₁",
    forceConstant: "0.55 mdyn·Å/rad²", bondLength: "—",
    region: "NH₃ deformatsiya sohasi",
    freeLigand: "Erkin NH₃: 950 cm⁻¹",
    coordShift: "Koordinatsiya tufayli +360 cm⁻¹ yuqoriga!",
    theoryNote: "«Soyabon» (umbrella) tebranishi — N atomi NH₃ tekisligiga perpendikulyar harakatlanadi. Erkin NH₃ da 950 cm⁻¹ (past — chunki N erkin inversiyaga uchraydi). Koordinatsiya inversiyani to'sib, chastotani sezilarli oshiradi. Luteo-kobalt (1325) dan 15 cm⁻¹ pastroq — Cl⁻ ning trans-ta'siri ekvator NH₃ larini biroz zaiflashtiradi.",
    diagnostic: "🔥 Koordinatsiyaning diagnostik ko'rsatkichi (+360 cm⁻¹ siljish)",
  },
  {
    freq: 830, T: 50, absorbance: 0.50,
    assignment: "ρᵣ(NH₃)",
    assignment_uz: "NH₃ rocking (chayqalish)",
    intensity: "O'rta-kuchli", intensityCode: 3,
    bond: "NH₃ butun", symmetry: "E (C₄ᵥ)",
    forceConstant: "0.40 mdyn·Å/rad²", bondLength: "—",
    region: "Ligand rocking sohasi",
    freeLigand: "Erkin NH₃ da mavjud emas",
    coordShift: "Faqat koordinatsion NH₃ da (770–870 cm⁻¹)",
    theoryNote: "NH₃ guruhining Co atomi atrofida chayqalish (rocking) tebranishi. Erkin NH₃ da mavjud EMAS. C₄ᵥ da E simmetriyaga tegishli — 2 karra taqsimlangan (ikki fazoviy o'q bo'yicha). Bu koordinatsiyaning bevosita isboti.",
    diagnostic: "Faqat kompleksda mavjud → koordinatsiyaning to'g'ridan-to'g'ri isboti",
  },
  {
    freq: 498, T: 35, absorbance: 0.65,
    assignment: "νₐₛ(Co–N) ekvator",
    assignment_uz: "Co–N asimmetrik cho'zilish (ekvator NH₃)",
    intensity: "Kuchli", intensityCode: 3,
    bond: "Co–N (ekvator, 4 ta)", symmetry: "E — IQ + Raman faol",
    forceConstant: "1.82 mdyn/Å", bondLength: "1.973 Å (ekvator)",
    region: "Metall–ligand cho'zilish sohasi (uzoq IQ)",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote: "Ekvator tekisligidagi 4 ta Co–N bog'ining asimmetrik cho'zilishi. Luteo-kobalt (503 cm⁻¹) dan 5 cm⁻¹ pastroq — Cl⁻ ning trans-effekti tufayli aksial Co–N bog'i zaiflashadi, lekin ekvator bog'lariga ta'siri kam. C₄ᵥ da E vakolat — 2 karra taqsimlangan.",
    diagnostic: "🔬 Ekvator Co–N bog'lari — kompleks strukturasi",
  },
  {
    freq: 475, T: 48, absorbance: 0.52,
    assignment: "νₛ(Co–N) aksial",
    assignment_uz: "Co–N cho'zilish (aksial NH₃, Cl ga trans)",
    intensity: "O'rta-kuchli", intensityCode: 3,
    bond: "Co–N (aksial, Cl ga trans)", symmetry: "A₁ — IQ + Raman",
    forceConstant: "1.68 mdyn/Å", bondLength: "1.936 Å (aksial)",
    region: "Metall–ligand cho'zilish sohasi",
    freeLigand: "—",
    coordShift: "Trans-Cl ta'sirini ko'rsatadi",
    theoryNote: "Cl⁻ ga qarama-qarshi tomondagi (trans) aksial Co–N bog'ining cho'zilishi. QIZIQ — bog' UZUNROQ (1.936 Å) va ν pastroq (475), bu Cl⁻ ning trans-influence ta'sirini isbotlaydi. Kutilgan aksial ν(Co–N) ~500 dan pastroq. Bu chastotalar farqi C₄ᵥ ning oktaedrik Oₕ ga nisbatan buzilishini o'lchash imkonini beradi.",
    diagnostic: "🎯 Trans-effekt IQ orqali kuzatiladi — aksial Co–N zaiflashuvi",
  },
  {
    freq: 328, T: 42, absorbance: 0.58,
    assignment: "ν(Co–Cl)",
    assignment_uz: "Co–Cl cho'zilish tebranishi",
    intensity: "Kuchli", intensityCode: 3,
    bond: "Co–Cl (ichki sfera)", symmetry: "A₁ — IQ + Raman",
    forceConstant: "1.42 mdyn/Å", bondLength: "2.261 Å",
    region: "Metall–halid sohasi (uzoq IQ)",
    freeLigand: "Erkin Cl⁻: bog'lanmagan, ν yo'q",
    coordShift: "Faqat ichki sfera Cl⁻ da mavjud",
    theoryNote: "🔥 ENG MUHIM DIAGNOSTIK CHO'QQI! [Co(NH₃)₆]Cl₃ da bu cho'qqi mutlaqo YO'Q. Bu polosa mavjudligi ichki sferada Cl⁻ borligini bevosita isbotlaydi — Werner nazariyasining IQ tasdig'i. Nakamoto ma'lumotlari: Co(III)–Cl bog'i uchun 350–290 cm⁻¹ oralig'i, tajribada 328 cm⁻¹ da. Kuch konstantasi k = 1.42 mdyn/Å — Co–N (1.85) dan pastroq, chunki Cl⁻ og'irroq va bog' uzunroq (2.26 Å vs 1.97 Å).",
    diagnostic: "🏆 ICHKI SFERA Cl⁻ NING BEVOSITA IQ ISBOTI — Werner nazariyasining kaliti",
  },
  {
    freq: 272, T: 68, absorbance: 0.32,
    assignment: "δ(Cl–Co–N)",
    assignment_uz: "Cl–Co–N burchak egilishi",
    intensity: "O'rta-zaif", intensityCode: 2,
    bond: "Cl–Co–N (aksial-ekvator)", symmetry: "E",
    forceConstant: "0.32 mdyn·Å/rad²", bondLength: "—",
    region: "Skelet egilish sohasi",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote: "Cl⁻ va ekvator NH₃ orasidagi burchakning egilish tebranishi. Ideal C₄ᵥ da bu burchak 90°, lekin real strukturada 89.4°/90.6° — Cl ning trans-effekti tufayli kichik og'ish. E simmetriyaga tegishli (2 karra), IQ faol.",
    diagnostic: "C₄ᵥ skelet deformatsiyasi",
  },
  {
    freq: 228, T: 82, absorbance: 0.18,
    assignment: "δ(N–Co–N) skelet",
    assignment_uz: "N–Co–N deformatsion tebranishi",
    intensity: "Zaif", intensityCode: 1,
    bond: "N–Co–N", symmetry: "E — IQ faol",
    forceConstant: "0.26 mdyn·Å/rad²", bondLength: "—",
    region: "Uzoq IQ (far-IR)",
    freeLigand: "—",
    coordShift: "Faqat kompleks tebranishi",
    theoryNote: "Ekvator tekislikdagi 4 ta N–Co–N burchagining deformatsiyasi. E simmetriya — 2 karra taqsimlangan. Bu chastota faqat FT-FIR moduli (200-30 cm⁻¹) bilan aniq o'lchanadi. C₄ᵥ ning ekvator tekisligi haqidа ma'lumot beradi.",
    diagnostic: "Ekvator tekislik strukturasi tekshiruvi",
  },
]

// Werner koordinatsion qatori — taqqoslash
const wernerSeries = [
  { formula: "[Co(NH₃)₆]Cl₃", trad: "Luteo (sariq)", color: "sariq", nuCoN: "503, 448", nuCoCl: "yo'q", agCl: 3, inner: 0, sym: "Oₕ", current: false },
  { formula: "[Co(NH₃)₅Cl]Cl₂", trad: "Purpureo (binafsha)", color: "binafsha", nuCoN: "498, 475", nuCoCl: "328", agCl: 2, inner: 1, sym: "C₄ᵥ", current: true },
  { formula: "cis-[Co(NH₃)₄Cl₂]Cl", trad: "Violeo (binafsha)", color: "to'q binafsha", nuCoN: "500, 475", nuCoCl: "355, 320", agCl: 1, inner: 2, sym: "C₂ᵥ", current: false },
  { formula: "trans-[Co(NH₃)₄Cl₂]Cl", trad: "Praseo (yashil)", color: "yashil", nuCoN: "480", nuCoCl: "355", agCl: 1, inner: 2, sym: "D₄ₕ", current: false },
]

// Namuna tayyorlash usullari
const techniques = [
  {
    name: "KBr tabletka (Pellet)",
    description: "Namunani KBr tuzi bilan aralashtirib (1:200), 10 tonna bosim ostida shaffof tabletka bosiladi.",
    advantages: ["Standart usul", "4000–400 cm⁻¹ shaffof", "Aniqlik 2–4 cm⁻¹", "Kvantitativ imkon"],
    disadvantages: ["KBr gigroskopik → suv polosalari", "400 cm⁻¹ dan pastda ko'rinmaydi", "Purpureo-Cl bilan qisman ion almashuv (KCl hosil bo'lishi mumkin)", "10–15 daqiqa tayyorlash"],
    bestFor: "Yuqori chastotalar (νN-H, δNH₃) uchun standart",
    freqRange: "4000–400 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "10–15 daq"
  },
  {
    name: "CsI tabletka (uzoq IQ)",
    description: "KBr o'rniga CsI ishlatiladi — 200 cm⁻¹ gacha shaffof. ν(Co–Cl) va uzoq IQ tebranishlar uchun MAJBURIY.",
    advantages: ["200 cm⁻¹ gacha shaffof", "ν(Co-Cl) 328 cm⁻¹ aniq ko'rinadi", "Uzoq IQ zonasi ochiladi", "Halogeno komplekslar uchun ideal"],
    disadvantages: ["Qimmat (5× KBr narxi)", "Yanada gigroskopik", "Ehtiyot bilan tayyorlash", "Kam laboratoriyalarda mavjud"],
    bestFor: "🔑 ν(Co–Cl) va uzoq IQ tebranishlar — asosiy usul",
    freqRange: "4000–200 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "10–15 daq"
  },
  {
    name: "Nujol mull",
    description: "Namuna Nujol (mineral moy) bilan aralashtirilib, NaCl yoki KBr oynasi orasiga qo'yiladi.",
    advantages: ["Ion almashuvsiz (KBr bilan bo'lmaydi)", "Nam va gigroskopik namunalar uchun", "Namuna maydalash oson", "Namuna buzilmaydi"],
    disadvantages: ["Nujol polosalari: 2920, 2850, 1460, 1375", "C–H sohasi to'liq yopiladi", "Kvantitativ chekli", "Purpureo rangi ko'rinadi"],
    bestFor: "KBr ni istamaydigan halogeno komplekslar",
    freqRange: "4000–400 cm⁻¹ (C–H bekilgan)", resolution: "4 cm⁻¹", samplePrep: "5–10 daq"
  },
  {
    name: "ATR (Attenuated Total Reflectance)",
    description: "Namuna to'g'ridan-to'g'ri ATR kristali (olmos, ZnSe, Ge) ustiga qo'yiladi.",
    advantages: ["Namuna tayyorlashsiz (30 s)", "Namuna butunligicha saqlanadi", "Zamonaviy standart", "Kristall shakli o'zgarmaydi"],
    disadvantages: ["Faqat sirt qatlami", "650 cm⁻¹ dan pastda ATR intensivligi keskin pasayadi", "ν(Co–Cl) 328 cm⁻¹ NI KO'RA OLMAYDI!", "Cho'qqi joylashuvi biroz siljigan"],
    bestFor: "Tez skrining, yuqori chastota tekshiruvi",
    freqRange: "4000–650 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "30 s"
  },
]

// Halaqit beruvchi omillar
const interferences = [
  { source: "Suv bug'i (H₂O)", freqRange: "3800–3500, 1640", effect: "Keng polosalar N–H sohasini qoplaydi", severity: "Yuqori", solution: "Spektrometr kamerasini quruq N₂ bilan puflash. KBr/CsI ni 110°C da 2 soat quritish. Purpureo namunani suvsiz muhitda ushlash — bu birikma nam bo'lganda oqva[Co(NH₃)₅(H₂O)]³⁺ ga sekin o'tadi." },
  { source: "CO₂ (atmosfera)", freqRange: "2350, 667", effect: "667 cm⁻¹ ν(Co-Cl) sohasiga yaqin!", severity: "O'rta", solution: "N₂ purge (10 daqiqa). CO₂ scrubber. Zamonaviy asboblarda avtomatik kompensatsiya." },
  { source: "KBr bilan Cl almashinishi", freqRange: "ν(Co-Cl) o'zgarishi", effect: "KBr bilan qisman [Co(NH₃)₅Br]²⁺ hosil bo'lishi mumkin (ν(Co-Br) ~ 260 cm⁻¹ paydo bo'ladi)", severity: "O'rta", solution: "🔑 CsCl yoki CsI tabletka ishlatish. Yoki Nujol mull. ATR ham yaxshi variant (kristal saqlanadi)." },
  { source: "Akvatsiya (namlik ta'siri)", freqRange: "Butun spektr o'zgaradi", effect: "Suvda [Co(NH₃)₅(H₂O)]³⁺ (aqua-purpureo) hosil bo'ladi — spektri boshqa", severity: "Yuqori", solution: "Faqat quritilgan namuna! Rekristallizatsiyani konsentrlangan HCl da o'tkazing. Desikatorda saqlash." },
  { source: "Namuna sofligini yo'qotish", freqRange: "Butun spektr", effect: "[Co(NH₃)₆]³⁺ yoki [Co(NH₃)₄Cl₂]⁺ aralashmasi qo'shimcha polosalar beradi", severity: "Yuqori", solution: "HCl da rekristallizatsiya. Element tahlil (Cl% = 42.5%) va ¹H NMR bilan sofligini tekshirish." },
  { source: "Kristall panjara ta'siri (site symmetry)", freqRange: "M-L sohasi", effect: "P2₁/c monoklinik panjara → simmetriya C₄ᵥ dan Cs ga tushishi mumkin", severity: "Past", solution: "Suyultirilgan namuna KBr da (1:1000) yoki eritmada o'lchash (agar imkoniyat bo'lsa)." },
  { source: "Yorug'lik ta'siri (fotoliz)", freqRange: "Butun spektr", effect: "UV nur ta'sirida Co(III) → Co(II) reduksiyasi. Yangi polosalar paydo bo'ladi.", severity: "O'rta", solution: "Namunani qorong'i shishada saqlash. Sarg'ish ostiga o'tishida ehtiyot bo'lish." },
  { source: "Tabletka qalinligi", freqRange: "Butun spektr", effect: "Qalin → to'yingan, yupqa → shovqin", severity: "O'rta", solution: "1 mg namuna + 200 mg CsI, 10 t bosim, 1 mm qalinlik — optimal." },
]

// Kuch konstantasi taqqoslash
const forceConstantExamples = [
  { bond: "N–H (koordinatsion)", k: 6.28, freq: 3300, note: "Yengil H → yuqori ν" },
  { bond: "Co–N (ekvator, bu kompleks)", k: 1.82, freq: 498, note: "Kuchli σ-donor" },
  { bond: "Co–N (aksial, trans-Cl)", k: 1.68, freq: 475, note: "🎯 Trans-effekt tufayli zaiflashgan" },
  { bond: "Co–N (Luteo-kobalt)", k: 1.85, freq: 503, note: "Barcha 6 ekvivalent" },
  { bond: "Co–Cl (bu kompleks)", k: 1.42, freq: 328, note: "🏆 Ichki sfera Cl⁻ isboti" },
  { bond: "Co–Cl (praseo, trans)", k: 1.52, freq: 355, note: "Ikki Cl bir tekisda" },
  { bond: "Pt–Cl (sisplatin)", k: 1.9, freq: 320, note: "Og'ir metall, mustahkam" },
  { bond: "Cr–Cl", k: 1.6, freq: 340, note: "3d³, oktaedrik" },
  { bond: "Ni–Cl (Td)", k: 1.4, freq: 295, note: "Tetraedrik" },
  { bond: "Fe–Cl (Td)", k: 1.7, freq: 380, note: "Fe(III), yuqori spin" },
]

// Trans-effekt qatori (Chatt, Duncanson, Chernyaev)
const transEffectData = [
  { ligand: "CO, CN⁻, C₂H₄", strength: "Juda kuchli", note: "π-akseptor" },
  { ligand: "PR₃, H⁻, NO", strength: "Kuchli", note: "π-akseptor / kuchli σ" },
  { ligand: "CH₃⁻, SC(NH₂)₂", strength: "O'rta-kuchli", note: "σ-donor" },
  { ligand: "I⁻, Br⁻, Cl⁻", strength: "🎯 O'rta (Cl⁻)", note: "π-donor" },
  { ligand: "NH₃, py", strength: "Kuchsiz", note: "Sof σ-donor" },
  { ligand: "OH⁻, H₂O", strength: "Juda kuchsiz", note: "π-donor lekin kuchsiz" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CoNH35Cl_Cl2_IQ() {
  const [showHeader, setShowHeader] = useState(true)
  const [freqSlider, setFreqSlider] = useState(3300)
  const [activePeak, setActivePeak] = useState(0)
  const [activeTechnique, setActiveTechnique] = useState(1) // CsI ni default
  const [activeInterference, setActiveInterference] = useState(2) // KBr almashinuv muhim
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)

  const [pdfSections, setPdfSections] = useState({
    identification: true,
    theory: true,
    peaks: true,
    spectrum: true,
    groupTheory: true,
    transEffect: true,
    forceConstant: true,
    werner: true,
    techniques: true,
    interferences: true,
    conclusions: true,
  })

  const currentPeak = useMemo(() => {
    let closest = irPeaks[0]
    let minDiff = Math.abs(freqSlider - irPeaks[0].freq)
    for (let i = 1; i < irPeaks.length; i++) {
      const diff = Math.abs(freqSlider - irPeaks[i].freq)
      if (diff < minDiff) { minDiff = diff; closest = irPeaks[i] }
    }
    return closest
  }, [freqSlider])

  const cleanText = (str) => {
    if (str === null || str === undefined) return ""
    return String(str)
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/\s+/g, " ").trim()
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 📄 PDF EKSPORT
  // ═══════════════════════════════════════════════════════════════════════════
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
        purpurea: rgb(0.55, 0.20, 0.60), // Purpureo — binafsha
        purpureaDeep: rgb(0.42, 0.12, 0.48),
        purpureaLight: rgb(0.88, 0.75, 0.92),
        textDark: rgb(0.08, 0.08, 0.16), textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0), orangeDeep: rgb(0.71, 0.39, 0),
        green: rgb(0.08, 0.47, 0.31), greenDark: rgb(0.12, 0.47, 0.27),
        blue: rgb(0.08, 0.31, 0.55), brown: rgb(0.71, 0.39, 0.12),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgPurpurea: rgb(0.98, 0.94, 1.0),
        bgOrange: rgb(1.0, 0.97, 0.94), bgBlue: rgb(0.94, 0.98, 1.0),
        bgGreen: rgb(0.94, 1.0, 0.98), bgRed: rgb(1.0, 0.95, 0.95),
        bgYellow: rgb(1.0, 0.98, 0.92), bgAbstract: rgb(0.96, 0.94, 1.0),
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
          `JDA-Kimyo IQ Tahlili  •  [Co(NH₃)₅Cl]Cl₂ (Purpureo-kobalt)  •  ${new Date().toLocaleDateString("uz-UZ")}`,
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
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.purpurea })
        safeText(`${num}. ${title}`, {
          x: MARGIN + 10, y: y - 14, size: 13, font: boldFont, color: C.purpureaDeep, maxWidth: CONTENT_W - 15,
        })
        y -= 24
        page.drawLine({
          start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
          thickness: 0.5, color: C.grayLine,
        })
        y -= 14
      }
      const drawTableRow = (label, value, bgColor = C.bgPurpurea, labelColor = C.purpureaDeep) => {
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

      // ═══ HEADER ═══
      page.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.purpleDark })
      safeText("JDA-KIMYO ILMIY BYULLETENI  •  IQ Spektroskopiya  •  Vol. 2, Son 3", {
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
      safeText("Ichki sfera Cl⁻ va C₄ᵥ Simmetriya — Werner Nazariyasining IQ Isboti", {
        x: MARGIN, y: PAGE_H - 52, size: 8, font: regularFont, color: rgb(0.71, 0.71, 0.86), maxWidth: CONTENT_W * 0.65,
      })
      safeText("DOI: 10.0000/jda-kimyo.iq.2026.002", {
        x: PAGE_W - MARGIN, y: PAGE_H - 52, size: 8,
        font: regularFont, color: rgb(0.71, 0.71, 0.86), align: "right", maxWidth: CONTENT_W * 0.3,
      })
      y = PAGE_H - HEADER_H - 30

      // ═══ TITLE ═══
      drawCenteredText(`[Co(NH₃)₅Cl]Cl₂ — IQ Spektroskopik Tahlili`, y, 20, boldFont, C.textDark)
      y -= 28
      drawCenteredText("Pentaamminklorokobalt(III) xlorid  •  «Purpureo-kobalt»", y, 12, italicFont, C.purpureaDeep)
      y -= 20
      drawCenteredText(
        `Simmetriya: C₄ᵥ  •  Konfiguratsiya: d⁶ (past spin)  •  Diamagnit  •  M = 250.44 g/mol`,
        y, 9, regularFont, C.textMuted
      )
      y -= 28

      // ═══ ANNOTATSIYA ═══
      const abstract =
        `Pentaamminklorokobalt(III) xlorid [Co(NH₃)₅Cl]Cl₂ Werner koordinatsion nazariyasining klassik ` +
        `namunasidir. Bir ammiak ligandini Cl⁻ bilan almashishi natijasida simmetriya oktaedrik Oₕ dan ` +
        `C₄ᵥ ga pasayadi. IQ spektrida buning eng yaqqol isboti — 328 cm⁻¹ dagi ν(Co–Cl) polosasi, ` +
        `luteo-kobaltda mutlaqo bo'lmagan. Asosiy polosalar: ν(N–H) 3300, 3200 cm⁻¹; δₛ(NH₃) 1310 cm⁻¹ ` +
        `(umbrella); ν(Co–N) 498 cm⁻¹ (ekvator, 4 ta) va 475 cm⁻¹ (aksial, trans-Cl — trans-effekt tufayli ` +
        `pastroq); ν(Co–Cl) 328 cm⁻¹ (ichki sfera Cl⁻ isboti). C₄ᵥ da inversiya markazi yo'q — mutual ` +
        `exclusion qoidasi ishlamaydi, ko'p modalar bir vaqtda IQ+Raman faol. Kuch konstantalari: ` +
        `k(Co–N)ₑq = 1.82, k(Co–N)ₐₓ = 1.68, k(Co–Cl) = 1.42 mdyn/Å — trans-effektning miqdoriy ` +
        `o'lchamini beradi. AgNO₃ tajribasida faqat 2 ta Cl⁻ cho'kadi (tashqi sferadan), 1 ta Cl⁻ ` +
        `ichki sferada saqlanadi — Werner nazariyasining eksperimental isboti.`

      const absPadding = 12, absInnerW = CONTENT_W - 2 * absPadding
      const absLines = wrapText(cleanText(abstract), regularFont, 9.5, absInnerW)
      const boxH = 24 + absLines.length * 13 + 8
      checkPageBreak(boxH + 20)
      page.drawRectangle({
        x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH,
        color: C.bgAbstract, borderColor: C.purpleMid, borderWidth: 1,
      })
      safeText("QISQACHA XULOSA (ANNOTATSIYA)", {
        x: MARGIN + absPadding, y: y - 16, size: 10, font: boldFont, color: C.purpurea, maxWidth: absInnerW,
      })
      absLines.forEach((line, i) => {
        page.drawText(line, {
          x: MARGIN + absPadding, y: y - 32 - i * 13,
          size: 9.5, font: regularFont, color: C.textDark,
        })
      })
      y -= boxH + 22

      let sectionNum = 1

      // ═══ 1. IDENTIFIKATSIYA ═══
      if (pdfSections.identification) {
        drawSectionHeader(sectionNum++, "Birikma Identifikatsiyasi")
        const idData = [
          ["Formula", "[Co(NH₃)₅Cl]Cl₂"],
          ["IUPAC nomi", "Pentaamminklorokobalt(III) xlorid"],
          ["An'anaviy nomi", "Purpureo-kobalt (Werner)"],
          ["CAS raqami", "13859-51-3"],
          ["Molar massa", "250.44 g/mol"],
          ["Rangi", "To'q qizil-binafsha kristall"],
          ["Kristall tizim", "Monoklinik (P2₁/c fazoviy guruh)"],
          ["Nuqtaviy guruh", "C₄ᵥ (8-tartib)"],
          ["Koordinatsion son", "6 (buzuq oktaedr)"],
          ["Metall ioni", "Co³⁺ (d⁶ past spin)"],
          ["Ichki sfera ligandlari", "5 × NH₃ + 1 × Cl⁻"],
          ["Tashqi sfera ionlari", "2 × Cl⁻"],
          ["Co–N ekvator (4 ta)", "1.973 Å"],
          ["Co–N aksial (trans-Cl)", "1.936 Å (qisqaroq)"],
          ["Co–Cl bog' uzunligi", "2.261 Å"],
          ["Erish nuqtasi", "Parchalanadi ~245°C"],
          ["Suvda eruvchanligi", "40 g/L (25°C) — o'rta"],
        ]
        idData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgPurpurea : C.white, C.purpureaDeep)
        })
        y -= 15
      }

      // ═══ 2. NAZARIY ASOS ═══
      if (pdfSections.theory) {
        drawSectionHeader(sectionNum++, "Nazariy Asos: C₄ᵥ Simmetriya va Trans-Effekt")

        const theory1 = "Purpureo-kobalt [Co(NH₃)₅Cl]²⁺ ioni — luteo-kobalt [Co(NH₃)₆]³⁺ ning bir ammiak ligandi Cl⁻ bilan almashtirilgan hosilasi. Bu almashishi tufayli molekulyar simmetriya OKTAEDRIK Oₕ (48-tartib) dan TETRAGONAL C₄ᵥ (8-tartib) ga pasayadi. Bu simmetriya buzilishi IQ spektrida bir necha muhim natijalarga olib keladi:"
        drawWrappedText(theory1, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(theory1, regularFont, 9.5, CONTENT_W).length * 13 + 8

        drawInfoBox(
          "1) Inversiya markazi (i) yo'qoladi → mutual exclusion qoidasi ISHLAMAYDI. Ko'p modalar bir vaqtda IQ va Raman ikkalasida ham faol bo'ladi. Bu C₄ᵥ ni Oₕ dan ajratishning eng oson yo'li.",
          C.bgBlue, C.blue, C.textDark
        )
        drawInfoBox(
          "2) Yangi diagnostik polosa paydo bo'ladi: ν(Co–Cl) 328 cm⁻¹ — luteo-kobaltda MUTLAQO YO'Q. Bu ichki sferada Cl⁻ borligining bevosita IQ isboti — Werner nazariyasining kaliti.",
          C.bgPurpurea, C.purpurea, C.textDark
        )
        drawInfoBox(
          "3) Trans-effekt paydo bo'ladi: Cl⁻ ligandiga qarama-qarshi joylashgan (trans) NH₃ ligand boshqacha muhitda bo'ladi. Uning Co–N bog'i cis dagilardan farqli chastotada tebranadi: ν(Co–N)ₐₓ = 475 cm⁻¹ vs ν(Co–N)ₑq = 498 cm⁻¹.",
          C.bgGreen, C.green, C.textDark
        )

        const theory2 = "Trans-effekt (trans-influence) — ligandning qarama-qarshi ligandning bog'lanishiga ta'siri. Chernyaev (1926) va Tolman (1970) qatorlariga ko'ra, Cl⁻ o'rta darajali trans-effekt beradi. Bu ta'sir orbital raqobati orqali sodir bo'ladi: Cl⁻ π-donorlik xususiyati eg orbital orqali trans-NH₃ ga o'tadi va uning Co–N bog'ini zaiflashtiradi. Natijada aksial Co–N bog'i UZUNROQ (1.936 vs 1.973 Å teskari kutilganidek), lekin ν pastroq bo'ladi — bog' kuchsizroq."
        drawWrappedText(theory2, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(theory2, regularFont, 9.5, CONTENT_W).length * 13 + 10

        const theory3 = "Hooke qonuni asosida ν̃(Co–Cl) = (1/2πc)·√(k/μ). k = 1.42 mdyn/Å, μ(Co-Cl) = 22.6 g/mol beradi ν̃ ≈ 325 cm⁻¹ — tajribadagi 328 cm⁻¹ bilan a'lo darajada mos keladi. Bu Nakamoto ma'lumotnomasidagi 350–290 cm⁻¹ oralig'iga to'g'ri tushadi."
        drawWrappedText(theory3, { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 })
        y -= wrapText(theory3, regularFont, 9.5, CONTENT_W).length * 13 + 10
      }


      // ═══ 3. CHO'QQILAR JADVALI ═══
      if (pdfSections.peaks) {
        drawSectionHeader(sectionNum++, "IQ Cho'qqilar Jadvali — Batafsil Tayinlash")

        const colW = [55, 80, 105, 45, 90, 105]
        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.purpureaDeep })
        const headers = ["ν̃ (cm⁻¹)", "Tayinlash", "Tavsif", "T%", "Simmetriya", "k (mdyn/Å)"]
        let cx = MARGIN + 4
        headers.forEach((h, i) => {
          safeText(h, { x: cx, y: y - 14, size: 8.5, font: boldFont, color: C.white, maxWidth: colW[i] - 4 })
          cx += colW[i]
        })
        y -= 20

        irPeaks.forEach((p, idx) => {
          checkPageBreak(22)
          const isCoCl = p.freq === 328
          const bg = isCoCl ? C.bgPurpurea : (idx % 2 === 0 ? C.bgPurpurea : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          let cx2 = MARGIN + 4
          const cells = [
            String(p.freq), cleanText(p.assignment), cleanText(p.assignment_uz),
            `${p.T}%`, cleanText(p.symmetry).split(" — ")[0], cleanText(p.forceConstant),
          ]
          cells.forEach((cell, i) => {
            const font = isCoCl || i === 0 ? boldFont : regularFont
            const color = i === 0 ? C.purpureaDeep : (isCoCl ? C.purpurea : C.textDark)
            safeText(cell, { x: cx2, y: y - 13, size: 8.5, font, color, maxWidth: colW[i] - 4 })
            cx2 += colW[i]
          })
          y -= 20
        })
        y -= 5

        drawInfoBox(
          "Intensivlik shkalasi (T%): Juda kuchli < 15%, Kuchli 15-40%, O'rta 40-65%, Zaif > 65%. Rangli qator 328 cm⁻¹ da — ν(Co–Cl) polosasi bu birikmaning eng muhim diagnostik cho'qqisi.",
          C.bgYellow, C.orange, C.textDark
        )

        drawWrappedText("Diagnostik cho'qqilarni batafsil tahlili:", {
          x: MARGIN, y, size: 11, font: boldFont, color: C.purpureaDeep, maxWidth: CONTENT_W, lineHeight: 14
        })
        y -= 16

        const importantPeaks = irPeaks.filter(p =>
          p.diagnostic && (p.diagnostic.includes("🔥") || p.diagnostic.includes("🔬") || p.diagnostic.includes("🏆") || p.diagnostic.includes("🎯"))
        )
        importantPeaks.forEach((p) => {
          checkPageBreak(70)
          safeText(`◆ ${p.freq} cm⁻¹  —  ${cleanText(p.assignment)}  (${cleanText(p.assignment_uz)})`, {
            x: MARGIN, y, size: 10, font: boldFont, color: C.purpurea, maxWidth: CONTENT_W,
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

      // ═══ 4. IQ SPEKTR GRAFIGI ═══
      if (pdfSections.spectrum) {
        drawSectionHeader(sectionNum++, "IQ Spektri Grafigi (4000–200 cm⁻¹)")

        const graphNeed = 230
        checkPageBreak(graphNeed)

        const gLeftPad = 40, gTopPad = 15
        const gX = MARGIN + gLeftPad
        const gW = CONTENT_W - gLeftPad - 5
        const gH = 150
        const gY = y - gH - gTopPad
        const xMax = 4000, xMin = 200

        page.drawRectangle({
          x: gX, y: gY, width: gW, height: gH,
          color: rgb(0.99, 0.98, 1.0), borderColor: C.grayLine, borderWidth: 0.5,
        })

        // Y grid
        for (let tick = 0; tick <= 100; tick += 20) {
          const ty = gY + (tick / 100) * gH
          page.drawLine({
            start: { x: gX, y: ty }, end: { x: gX + gW, y: ty },
            thickness: 0.2, color: rgb(0.92, 0.88, 0.95),
          })
          const label = `${tick}`
          const lw = measure(label, regularFont, 7)
          page.drawText(label, { x: gX - lw - 4, y: ty - 3, size: 7, font: regularFont, color: C.textMuted })
        }

        // X grid
        const xTicks = [4000, 3500, 3000, 2500, 2000, 1500, 1000, 500, 200]
        xTicks.forEach(wn => {
          const tx = gX + ((xMax - wn) / (xMax - xMin)) * gW
          page.drawLine({
            start: { x: tx, y: gY }, end: { x: tx, y: gY + gH },
            thickness: 0.2, color: rgb(0.92, 0.88, 0.95),
          })
          const label = `${wn}`
          const lw = measure(label, regularFont, 7)
          page.drawText(label, { x: tx - lw / 2, y: gY - 11, size: 7, font: regularFont, color: C.textMuted })
        })

        // Spektr Lorentzian
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
        for (let i = 0; i < totalPoints - 1; i++) {
          const wn0 = xMin + (i / totalPoints) * (xMax - xMin)
          const wn1 = xMin + ((i + 1) / totalPoints) * (xMax - xMin)
          const x0 = gX + ((xMax - wn0) / (xMax - xMin)) * gW
          const x1 = gX + ((xMax - wn1) / (xMax - xMin)) * gW
          const y0 = gY + transmittance[i] * gH
          const y1 = gY + transmittance[i + 1] * gH
          page.drawLine({ start: { x: x0, y: y0 }, end: { x: x1, y: y1 }, thickness: 0.9, color: C.purpureaDeep })
        }

        // Cho'qqi belgilari
        irPeaks.forEach((peak, idx) => {
          const px = gX + ((xMax - peak.freq) / (xMax - xMin)) * gW
          const py = gY + (1 - peak.absorbance) * gH
          const isCoCl = peak.freq === 328
          const lineColor = isCoCl ? C.purpurea : C.red
          page.drawLine({
            start: { x: px, y: py }, end: { x: px, y: gY + gH },
            thickness: isCoCl ? 0.6 : 0.3, color: lineColor,
          })
          const wnStr = `${peak.freq}`
          const wnW = measure(wnStr, boldFont, 7)
          const labelX = Math.max(gX + 2, Math.min(gX + gW - wnW - 2, px - wnW / 2))
          page.drawText(wnStr, {
            x: labelX, y: gY + gH + 4 + (idx % 3) * 8,
            size: 7, font: boldFont, color: isCoCl ? C.purpurea : C.red,
          })
        })

        // O'qlar
        const xAxisLabel = "To'lqin soni (cm⁻¹)"
        const xAxisW = measure(xAxisLabel, italicFont, 9)
        page.drawText(xAxisLabel, {
          x: gX + (gW - xAxisW) / 2, y: gY - 22, size: 9,
          font: italicFont, color: C.purpureaDeep,
        })
        page.drawText("T (%)", { x: gX - 30, y: gY + gH / 2 - 3, size: 9, font: italicFont, color: C.purpureaDeep })

        y = gY - 40

        drawWrappedText(
          "1-rasm. [Co(NH₃)₅Cl]Cl₂ ning simulyatsiyalangan IQ spektri (Lorentzian profil, CsI tabletka). Binafsha rangdagi vertikal chiziq — 328 cm⁻¹ dagi ν(Co–Cl) polosasi, bu birikmaning eng muhim diagnostik cho'qqisi. Luteo-kobaltda bu polosa YO'Q. Boshqa asosiy polosalar: ν(N–H) 3300/3200, δ(NH₃) 1618/1310, ρ(NH₃) 830, ν(Co–N) 498/475 cm⁻¹.",
          { x: MARGIN, y, size: 8.5, font: italicFont, color: C.purpureaDeep, maxWidth: CONTENT_W, lineHeight: 11 }
        )
        y -= wrapText("1-rasm. [Co(NH₃)₅Cl]Cl₂ ning simulyatsiyalangan IQ spektri (Lorentzian profil, CsI tabletka). Binafsha rangdagi vertikal chiziq — 328 cm⁻¹ dagi ν(Co–Cl) polosasi, bu birikmaning eng muhim diagnostik cho'qqisi. Luteo-kobaltda bu polosa YO'Q. Boshqa asosiy polosalar: ν(N–H) 3300/3200, δ(NH₃) 1618/1310, ρ(NH₃) 830, ν(Co–N) 498/475 cm⁻¹.", italicFont, 8.5, CONTENT_W).length * 11 + 15
      }

      // ═══ 5. GURUH NAZARIYASI ═══
      if (pdfSections.groupTheory) {
        drawSectionHeader(sectionNum++, "Guruh Nazariyasi — C₄ᵥ Simmetriyasi")

        const gtData = [
          ["Nuqtaviy guruh", "C₄ᵥ (tetragonal piramidal)"],
          ["Guruh tartibi", "8 ta simmetriya operatsiyasi"],
          ["Operatsiyalar", "E, 2C₄, C₂, 2σᵥ, 2σd"],
          ["Inversiya markazi", "YO'Q — mutual exclusion ishlamaydi"],
          ["Bu Oₕ dan asosiy farq", "Oₕ da 48 operatsiya, C₄ᵥ da faqat 8 — 6× kamayish"],
          ["Umumiy normal modalar", "3N−6 = 3(22)−6 = 60 ta"],
          ["ν(Co–N) modalar", "2A₁ + B₁ + E (ekvator + aksial)"],
          ["ν(Co–Cl) moda", "A₁ (faqat 1 ta, IQ+Raman faol)"],
          ["δ(N–Co–N) modalar", "A₁ + B₁ + B₂ + E"],
          ["IQ faol vakolatlar", "A₁, E (barcha ν va δ)"],
          ["Raman faol vakolatlar", "A₁, B₁, B₂, E (barchasi)"],
          ["Ikki tomonlama faol", "A₁ va E — IQ va Ramanda birga"],
        ]
        gtData.forEach((row, i) => {
          drawTableRow(row[0], row[1], i % 2 === 0 ? C.bgPurpurea : C.white, C.purpurea)
        })
        y -= 10

        drawInfoBox(
          "C₄ᵥ va Oₕ farqi: Luteo-kobaltda (Oₕ) inversiya markazi bor, shuning uchun mutual exclusion qoidasi ishlaydi — gerade modalar faqat Ramanda. Purpureo-kobaltda (C₄ᵥ) inversiya markazi YO'Q — barcha simmetriyaviy ruxsat etilgan modalar IQ va Ramanda BIR VAQTDA faol. Bu spektroskopik jihatdan bevosita kuzatiladigan farq.",
          C.bgBlue, C.blue, C.textDark
        )

        drawInfoBox(
          "Werner nazariyasining ikkinchi tasdig'i: agar barcha Cl⁻ tashqi sferada bo'lganda, kompleks [Co(NH₃)₅]³⁺ Cl⁻₃ tuzilishga ega bo'lardi va IQ spektrida ν(Co–Cl) polosasi bo'lmasdi. 328 cm⁻¹ da polosaning aniq ko'rinishi Cl⁻ ning ichki sferada joylashishining bevosita isbotidir. Bu Nakamoto ma'lumotnomasida keltirilgan diagnostik xususiyat.",
          C.bgPurpurea, C.purpurea, C.textDark
        )
      }

      // ═══ 6. TRANS-EFFEKT ═══
      if (pdfSections.transEffect) {
        drawSectionHeader(sectionNum++, "Trans-Effekt (Chernyaev-Tolman) va IQ da Kuzatilishi")

        drawWrappedText(
          "Trans-effekt (Chernyaev, 1926; Tolman, 1970) — ligandning qarama-qarshi joylashgan (trans) ligandning bog'lanish kuchi va uzunligiga ta'siri. Bu ta'sir bir necha mexanizm orqali sodir bo'ladi: (1) σ-boglanish orqali (ikki ligand bir xil orbitalni bo'lishadi); (2) π-donorlik/akseptorlik orqali. Cl⁻ o'rta darajali trans-effekt beradi (Chernyaev qatorining o'rtasida). Purpureo-kobaltda Cl⁻ ga qarama-qarshi joylashgan aksial NH₃ zaifroq bog'langan.",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Trans-effekt (Chernyaev, 1926; Tolman, 1970) — ligandning qarama-qarshi joylashgan (trans) ligandning bog'lanish kuchi va uzunligiga ta'siri. Bu ta'sir bir necha mexanizm orqali sodir bo'ladi: (1) σ-boglanish orqali (ikki ligand bir xil orbitalni bo'lishadi); (2) π-donorlik/akseptorlik orqali. Cl⁻ o'rta darajali trans-effekt beradi (Chernyaev qatorining o'rtasida). Purpureo-kobaltda Cl⁻ ga qarama-qarshi joylashgan aksial NH₃ zaifroq bog'langan.", regularFont, 9.5, CONTENT_W).length * 13 + 10

        // Trans-effekt qatori jadvali
        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.orange })
        const teHeaders = ["Ligand (kuchli → kuchsiz)", "Trans-effekt kuchi", "Izoh"]
        const teColW = [175, 120, 190]
        let tex = MARGIN + 6
        teHeaders.forEach((h, i) => {
          safeText(h, { x: tex, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: teColW[i] - 4 })
          tex += teColW[i]
        })
        y -= 20

        transEffectData.forEach((te, idx) => {
          checkPageBreak(20)
          const isCl = te.ligand.includes("Cl⁻")
          const bg = isCl ? C.bgPurpurea : (idx % 2 === 0 ? C.bgOrange : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let cx3 = MARGIN + 6
          const cells = [te.ligand, te.strength, te.note]
          cells.forEach((cell, i) => {
            const font = isCl ? boldFont : regularFont
            const color = isCl ? C.purpurea : C.textDark
            safeText(cell, { x: cx3, y: y - 12, size: 8.5, font, color, maxWidth: teColW[i] - 4 })
            cx3 += teColW[i]
          })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "IQ da trans-effekt kuzatilishi: Bu birikmada ν(Co–N)ₑq = 498 cm⁻¹ (k = 1.82 mdyn/Å) va ν(Co–N)ₐₓ = 475 cm⁻¹ (k = 1.68 mdyn/Å). Farq Δν = 23 cm⁻¹ va Δk = 0.14 mdyn/Å — bu Cl⁻ ning trans-effekti tufayli aksial Co–N bog'ining ~7.6% zaiflashishini ko'rsatadi. Bu kuchli π-donor ligandlar (masalan CN⁻) da yanada aniq: CN⁻ trans-holatda bog'lar 50-100 cm⁻¹ ga siljiydi.",
          C.bgGreen, C.green, C.textDark
        )
      }


      // ═══ 7. KUCH KONSTANTASI ═══
      if (pdfSections.forceConstant) {
        drawSectionHeader(sectionNum++, "Kuch Konstantasi va Hooke Qonuni")
        drawWrappedText(
          "Hooke qonuni ν̃ = (1/2πc)·√(k/μ) asosida turli bog'lar mustahkamligini taqqoslash. Bu birikmada uch xil bog' turi mavjud: Co–N ekvator (4 ta), Co–N aksial (1 ta, trans-Cl) va Co–Cl (1 ta). Ular kuch konstantalari va chastotalarida farq qiladi.",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Hooke qonuni ν̃ = (1/2πc)·√(k/μ) asosida turli bog'lar mustahkamligini taqqoslash. Bu birikmada uch xil bog' turi mavjud: Co–N ekvator (4 ta), Co–N aksial (1 ta, trans-Cl) va Co–Cl (1 ta). Ular kuch konstantalari va chastotalarida farq qiladi.", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.orangeDeep })
        const fcHeaders = ["Bog' turi", "k (mdyn/Å)", "ν̃ (cm⁻¹)", "Izoh"]
        const fcColW = [175, 90, 90, 140]
        let fcx = MARGIN + 6
        fcHeaders.forEach((h, i) => {
          safeText(h, { x: fcx, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: fcColW[i] - 4 })
          fcx += fcColW[i]
        })
        y -= 20

        forceConstantExamples.forEach((f, idx) => {
          checkPageBreak(20)
          const isHighlight = f.bond.includes("bu kompleks")
          const bg = isHighlight ? C.bgPurpurea : (idx % 2 === 0 ? C.bgOrange : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 18, width: CONTENT_W, height: 18, color: bg })
          let cx4 = MARGIN + 6
          const cells = [f.bond, String(f.k), String(f.freq), f.note]
          cells.forEach((cell, i) => {
            const font = isHighlight ? boldFont : (i === 0 ? boldFont : regularFont)
            const color = isHighlight ? C.purpurea : (i === 0 ? C.orangeDeep : C.textDark)
            safeText(cell, { x: cx4, y: y - 12, size: 8.5, font, color, maxWidth: fcColW[i] - 4 })
            cx4 += fcColW[i]
          })
          y -= 18
        })
        y -= 8

        drawInfoBox(
          "Xulosa: Co–N ekvator (k = 1.82) > Co–N aksial (k = 1.68) > Co–Cl (k = 1.42). Ekvator NH₃ bog'i Luteo-kobalt (k = 1.85) ga yaqin — normal. Aksial NH₃ trans-Cl ta'siri tufayli zaifroq. Co–Cl esa og'ir Cl atomi va uzun bog' (2.26 Å) tufayli sezilarli darajada past chastotada tebranadi. Kuch konstantalarining nisbatlari struktura haqida aniq ma'lumot beradi.",
          C.bgGreen, C.green, C.textDark
        )
      }

      // ═══ 8. WERNER QATORI ═══
      if (pdfSections.werner) {
        drawSectionHeader(sectionNum++, "Werner Koordinatsion Qatori va Purpureo-Kobaltning O'rni")
        drawWrappedText(
          "Alfred Werner 1893-yilda kobalt(III) ammin komplekslarini o'rganib, ichki va tashqi koordinatsion sfera tushunchasini kiritdi. Purpureo-kobalt bu qatorda IKKINCHI o'rinni egallaydi — bir Cl⁻ ichki sferada. Bu bosqichlar rangi va IQ spektrida progressiv o'zgarishlar bilan boshqacha kompleks izomerlarni beradi.",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Alfred Werner 1893-yilda kobalt(III) ammin komplekslarini o'rganib, ichki va tashqi koordinatsion sfera tushunchasini kiritdi. Purpureo-kobalt bu qatorda IKKINCHI o'rinni egallaydi — bir Cl⁻ ichki sferada. Bu bosqichlar rangi va IQ spektrida progressiv o'zgarishlar bilan boshqacha kompleks izomerlarni beradi.", regularFont, 9.5, CONTENT_W).length * 13 + 10

        page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: C.purple })
        const wHeaders = ["Kompleks", "Rang", "Simmetriya", "ν(Co-Cl)", "Ag+Cl"]
        const wColW = [155, 95, 75, 85, 85]
        let wcx = MARGIN + 6
        wHeaders.forEach((h, i) => {
          safeText(h, { x: wcx, y: y - 14, size: 9, font: boldFont, color: C.white, maxWidth: wColW[i] - 4 })
          wcx += wColW[i]
        })
        y -= 20

        wernerSeries.forEach((w, idx) => {
          checkPageBreak(22)
          const bg = w.current ? C.bgPurpurea : (idx % 2 === 0 ? C.bgPurple : C.white)
          page.drawRectangle({ x: MARGIN, y: y - 20, width: CONTENT_W, height: 20, color: bg })
          let cx5 = MARGIN + 6
          const cells = [w.formula, w.trad, w.sym, w.nuCoCl, `${w.agCl} × AgCl↓`]
          cells.forEach((cell, i) => {
            const font = w.current ? boldFont : (i === 0 ? boldFont : regularFont)
            const color = w.current ? C.purpurea : (i === 0 ? C.purple : C.textDark)
            safeText(cell, { x: cx5, y: y - 13, size: 8.5, font, color, maxWidth: wColW[i] - 4 })
            cx5 += wColW[i]
          })
          y -= 20
        })
        y -= 8

        drawInfoBox(
          "Werner tajribasining IQ tasdig'i: AgNO₃ eritmasi qo'shilganda faqat 2 ta Cl⁻ cho'kadi (tashqi sferadan), 1 ta Cl⁻ ichki sferada saqlanadi. Bu esa IQ spektrida 328 cm⁻¹ da yangi ν(Co–Cl) polosasi ko'rinishi bilan mos keladi. Luteo-kobaltda (barcha Cl tashqi sferada) bu polosa YO'Q, purpureoda BOR, praseoda (ikki Cl ichki sferada) YANA BOR va boshqa joyda (355 cm⁻¹) — ikki Cl bir tekislikda ekan.",
          C.bgPurpurea, C.purpurea, C.textDark
        )

        drawInfoBox(
          "Rang siljishi va Δₒ: Bu qatorda kompleksning rangi sariq (luteo) → binafsha (purpureo) → yashil (praseo) ga o'zgaradi. Bu Δₒ ning pasayishi bilan bog'liq — Cl⁻ NH₃ dan zaifroq maydon ligand. Δₒ(luteo) = 22 900 cm⁻¹, Δₒ(purpureo) = 20 100 cm⁻¹, Δₒ(praseo) = 17 500 cm⁻¹. UV-Vis va IQ bir-birini tasdiqlaydi.",
          C.bgYellow, C.orange, C.textDark
        )
      }

      // ═══ 9. NAMUNA TAYYORLASH ═══
      if (pdfSections.techniques) {
        drawSectionHeader(sectionNum++, "Namuna Tayyorlash — Halogeno Komplekslar Uchun")

        drawWrappedText(
          "Purpureo-kobalt kabi halogeno kompleks uchun namuna tayyorlash usulini tanlash muhim, chunki KBr bilan ion almashinuv sodir bo'lishi mumkin. Quyida 4 ta usul solishtiriladi:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Purpureo-kobalt kabi halogeno kompleks uchun namuna tayyorlash usulini tanlash muhim, chunki KBr bilan ion almashinuv sodir bo'lishi mumkin. Quyida 4 ta usul solishtiriladi:", regularFont, 9.5, CONTENT_W).length * 13 + 10

        techniques.forEach((t, idx) => {
          checkPageBreak(160)
          const isRecommended = t.name.includes("CsI")
          page.drawRectangle({
            x: MARGIN, y: y - 20, width: CONTENT_W, height: 20,
            color: isRecommended ? C.purpurea : C.blue,
          })
          const marker = isRecommended ? " ★ TAVSIYA" : ""
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

      // ═══ 10. HALAQIT OMILLARI ═══
      if (pdfSections.interferences) {
        drawSectionHeader(sectionNum++, "Halaqit Beruvchi Omillar — Purpureo-Kobalt Uchun Xos")

        drawWrappedText(
          "Bu birikma bilan ishlaganda o'ziga xos muammolar paydo bo'ladi: KBr bilan ion almashinishi (Cl⁻ o'rniga Br⁻) va akvatsiya (Cl⁻ ni suv ligandi o'rnini olishi). Quyida 8 ta muammo va yechim:",
          { x: MARGIN, y, size: 9.5, font: regularFont, color: C.textDark, maxWidth: CONTENT_W, lineHeight: 13 }
        )
        y -= wrapText("Bu birikma bilan ishlaganda o'ziga xos muammolar paydo bo'ladi: KBr bilan ion almashinishi (Cl⁻ o'rniga Br⁻) va akvatsiya (Cl⁻ ni suv ligandi o'rnini olishi). Quyida 8 ta muammo va yechim:", regularFont, 9.5, CONTENT_W).length * 13 + 10

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

      // ═══ 11. XULOSALAR ═══
      if (pdfSections.conclusions) {
        drawSectionHeader(sectionNum++, "Asosiy Xulosalar")

        const conclusions = [
          "[Co(NH₃)₅Cl]Cl₂ ning IQ spektridagi ENG MUHIM DIAGNOSTIK POLOSA — ν(Co–Cl) = 328 cm⁻¹. Bu polosa luteo-kobaltda MUTLAQO YO'Q va uning mavjudligi Cl⁻ ning ichki sferada joylashishining bevosita isbotidir. Bu Werner nazariyasining IQ orqali eng yaqqol tasdig'i.",
          "Simmetriya Oₕ dan C₄ᵥ ga pasayadi (48 → 8 operatsiya). Buning natijasida inversiya markazi yo'qoladi va mutual exclusion qoidasi ishlamaydi — ko'p modalar IQ va Ramanda bir vaqtda faol bo'ladi.",
          "Trans-effekt IQ orqali kuzatiladi: ν(Co–N)ₑq = 498 cm⁻¹ va ν(Co–N)ₐₓ = 475 cm⁻¹, farq Δν = 23 cm⁻¹. Bu Cl⁻ ning trans-effekti tufayli aksial NH₃ bog'ining ~7.6% zaiflashishini o'lchash imkonini beradi.",
          "Kuch konstantalari qatori: k(Co–N)ₑq = 1.82 > k(Co–N)ₐₓ = 1.68 > k(Co–Cl) = 1.42 mdyn/Å. Har bir kuch konstantasi Hooke qonuni orqali tekshirilgan va Nakamoto ma'lumotlariga mos keladi.",
          "Namuna tayyorlashda KBr tabletka o'rniga CsI tabletka MAJBURIY, chunki: (1) ν(Co–Cl) 328 cm⁻¹ da KBr shaffofligi tugaydi (400 cm⁻¹ dan pastda); (2) KBr bilan Cl⁻ almashinuvi (KCl hosil bo'lishi) mumkin. ATR usuli 650 cm⁻¹ dan pastda ishlamaydi.",
          "AgNO₃ tajribasida faqat 2 ta Cl⁻ cho'kadi — bu IQ spektrdagi natijalarga mos keladi. Ichki sferadagi 1 ta Cl⁻ Ag⁺ ga sekin reaksiyaga kirishadi (soatlar–kunlar) — chunki Co(III) INERT.",
          "Werner koordinatsion qatori (luteo→purpureo→violeo→praseo) IQ spektroskopiya orqali to'liq izlanishi mumkin. Har bir bosqichda yangi polosalar paydo bo'ladi va simmetriya pasayishi (Oₕ → C₄ᵥ → C₂ᵥ / D₄ₕ) tanlash qoidalarini o'zgartiradi.",
          "Bu kompleks pentaammin-kobalt(III) kimyosining klassik namunasi va koordinatsion kimyoning umumiy 'ligand almashinuvi' reaksiyalarini o'rganish uchun ideal model. IQ spektroskopiya kimyoviy o'zgarishlarni miqdoriy o'lchash imkonini beradi.",
        ]

        conclusions.forEach((c, idx) => {
          checkPageBreak(35)
          page.drawCircle({ x: MARGIN + 10, y: y - 8, size: 8, color: C.purpurea })
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

      pdfDoc.setTitle(`[Co(NH₃)₅Cl]Cl₂ IQ Spektroskopik Tahlili`)
      pdfDoc.setSubject("Pentaamminklorokobalt(III) xlorid — Infraqizil spektroskopiya")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo IQ Tahlil Moduli")
      pdfDoc.setKeywords(["Co(NH3)5Cl", "Purpureo-kobalt", "C4v symmetry", "trans-effect", "IR spectroscopy", "Werner"])

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Co_NH3_5_Cl_Cl2_IQ_tahlili_${new Date().toISOString().slice(0, 10)}.pdf`
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
              <span className="text-pink-400 font-semibold">[Co(NH₃)₅Cl]Cl₂</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-pink-400 flex items-center gap-2 flex-wrap">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🔍 IQ</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">C₄ᵥ simmetriya</span>
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">ν(Co-Cl) 328</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Trans-effekt</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Ichki Cl⁻</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Werner 1893</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setPdfModalOpen(true)}
                  className="text-xs bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg transition-all whitespace-nowrap font-bold shadow-lg shadow-pink-500/20"
                >
                  📄 PDF Hisobot
                </button>
                <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-xs bg-pink-600/80 hover:bg-pink-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-center">
                  ← Barcha birikmalar
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-pink-600 hover:bg-pink-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      {/* PDF MODAL */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-950 to-blue-950 border-2 border-pink-500 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-pink-400 flex items-center gap-2">
                <span className="text-3xl">📄</span> PDF Hisobot — Bo'limlarni tanlang
              </h3>
              <button onClick={() => setPdfModalOpen(false)} className="text-purple-400 hover:text-white text-2xl">×</button>
            </div>
            <p className="text-purple-200 text-sm mb-4">
              [Co(NH₃)₅Cl]Cl₂ (Purpureo-kobalt) ning IQ spektroskopik tahlili. Ilmiy maqola uslubida, A4 formatda.
            </p>

            <div className="space-y-2 mb-6">
              {[
                { key: "identification", label: "1. Birikma identifikatsiyasi", desc: "Formula, CAS, kristall tuzilma, bog' uzunliklari" },
                { key: "theory", label: "2. Nazariy asos", desc: "C₄ᵥ simmetriya, trans-effekt, Hooke qonuni" },
                { key: "peaks", label: "3. Cho'qqilar jadvali", desc: "10 ta polosa — batafsil tayinlash" },
                { key: "spectrum", label: "4. IQ spektri grafigi", desc: "Lorentzian simulyatsiya, 4000-200 cm⁻¹" },
                { key: "groupTheory", label: "5. Guruh nazariyasi", desc: "C₄ᵥ vakolatlari, Oₕ dan farqi" },
                { key: "transEffect", label: "6. Trans-effekt (Chernyaev-Tolman)", desc: "Ligandlar qatori va IQ da kuzatilishi" },
                { key: "forceConstant", label: "7. Kuch konstantasi", desc: "10 ta bog' turi taqqoslash" },
                { key: "werner", label: "8. Werner koordinatsion qatori", desc: "Luteo/Purpureo/Violeo/Praseo" },
                { key: "techniques", label: "9. Namuna tayyorlash", desc: "CsI tavsiya + KBr xatarlari" },
                { key: "interferences", label: "10. Halaqit omillari", desc: "8 ta muammo va yechim" },
                { key: "conclusions", label: "11. Asosiy xulosalar", desc: "8 ta ilmiy tezis" },
              ].map(s => (
                <label key={s.key} className="flex items-start gap-3 p-3 bg-purple-800/30 border border-purple-700/40 rounded-lg hover:border-pink-500/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={pdfSections[s.key]}
                    onChange={(e) => setPdfSections({ ...pdfSections, [s.key]: e.target.checked })}
                    className="mt-1 accent-pink-500"
                  />
                  <div className="flex-1">
                    <div className="text-pink-300 font-semibold text-sm">{s.label}</div>
                    <div className="text-purple-300 text-xs mt-0.5">{s.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-3 mb-4">
              <p className="text-pink-200 text-xs">
                <strong>⚠ Eslatma:</strong> PDF Unicode belgilar (Δ, ν̃, π, ⁻¹, ₂ va h.k.) uchun{" "}
                <code className="bg-purple-950 px-1 rounded">/public/fonts/</code> papkasida DejaVuSans*.ttf fayllari kerak.
                Kutilgan hajm: ~5-7 sahifa A4.
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
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">C₄ᵥ simmetriya</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Trans-effekt</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Ichki Cl⁻</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Inert d⁶ LS</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4 flex-wrap">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              [Co(NH₃)₅Cl]Cl₂
            </h2>
            <span className="text-purple-400 text-lg">250.44 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            pentaamminklorokobalt(III) xlorid — <span className="text-pink-400 italic">«Purpureo-kobalt» (binafsha kobalt)</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-pink-400">Werner koordinatsion nazariyasining</strong> ikkinchi klassik namunasi.
            Bir NH₃ ligandini Cl⁻ bilan almashishi natijasida simmetriya <strong className="text-yellow-300">Oₕ dan C₄ᵥ ga</strong> pasayadi.
            IQ spektridagi <strong className="text-pink-300">328 cm⁻¹</strong> dagi yangi ν(Co–Cl) polosasi — luteo-kobaltda mutlaqo yo'q edi —
            bu Cl⁻ ning ichki sferada joylashishining bevosita isbotidir. Bundan tashqari <strong className="text-orange-300">trans-effekt</strong> kuzatiladi:
            ekvator va aksial Co–N bog'lari farqli chastotalarda tebranadi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Ichki sfera</div>
              <div className="text-white font-bold">5 NH₃ + 1 Cl⁻</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Tashqi sfera</div>
              <div className="text-white font-bold">2 Cl⁻</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">C₄ᵥ (8 op.)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">ν(Co-Cl)</div>
              <div className="text-pink-400 font-bold">328 cm⁻¹</div>
            </div>
          </div>
        </div>

        {/* NAZARIY ASOS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📚</span> Nazariy asos — C₄ᵥ simmetriya va trans-effekt
          </h2>

          <p className="text-purple-200 leading-relaxed">
            Bir NH₃ ligandini Cl⁻ bilan almashishi natijasida simmetriya <strong className="text-pink-400">Oₕ (48-tartib) dan C₄ᵥ (8-tartib) ga</strong> pasayadi.
            Bu 6 barobar simmetriya operatsiyalari sonining kamayishi — IQ spektrida quyidagi 3 ta muhim natijaga olib keladi:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/40 rounded-xl p-5">
              <div className="text-4xl mb-2">🚫</div>
              <h3 className="text-blue-300 font-bold mb-2">1. Inversiya markazi (i) yo'qoladi</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Oₕ da (i) mavjud, C₄ᵥ da YO'Q. Natija — mutual exclusion qoidasi ishlamaydi. Ko'p modalar IQ va Ramanda bir vaqtda faol.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-900/30 to-purple-800/20 border border-pink-500/40 rounded-xl p-5">
              <div className="text-4xl mb-2">🆕</div>
              <h3 className="text-pink-300 font-bold mb-2">2. Yangi polosa: ν(Co–Cl)</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong className="text-pink-400">328 cm⁻¹</strong> da yangi polosa. Luteo-kobaltda YO'Q. Bu ichki sfera Cl⁻ bevosita isboti.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/30 to-red-800/20 border border-orange-500/40 rounded-xl p-5">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-orange-300 font-bold mb-2">3. Trans-effekt paydo bo'ladi</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                ν(Co–N) endi 2 ta chastotada: 498 cm⁻¹ (ekvator) va 475 cm⁻¹ (aksial trans-Cl). Δν = 23 cm⁻¹.
              </p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">Trans-effekt (Chernyaev, 1926; Tolman, 1970):</strong> Ligandning qarama-qarshi ligandning bog'lanishiga ta'siri. Cl⁻ o'rta darajali trans-donor. Uning π-donorligi eg orbital orqali trans-NH₃ ga o'tadi va uning Co–N bog'ini zaiflashtiradi. Natijada: aksial Co–N bog'i 1.936 Å (qisqaroq!) lekin ν(Co–N)ₐₓ = 475 cm⁻¹ (pastroq) — bog' zaifroq. Bu qiziq paradoks σ-bog'lanish bilan π-donorlikning bir vaqtda ishlashi bilan izohlanadi.
            </p>
          </div>
        </div>


        {/* INTERAKTIV IQ SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📈</span> Interaktiv IQ spektri — batafsil izohlar
          </h2>

          <p className="text-purple-200 leading-relaxed">
            Lorentzian profil asosida simulyatsiyalangan CsI tabletka spektri. Slayderni harakatlantiring yoki cho'qqilarni bosing —
            barcha nazariy izohlar, kuch konstantalari, simmetriya va erkin ligand bilan taqqoslash avtomatik ko'rsatiladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <label className="block text-pink-400 font-bold mb-2">
              To'lqin soni: <span className="font-mono text-2xl">{freqSlider}</span> cm⁻¹
            </label>
            <input
              type="range" min="200" max="4000" value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>200 (Co-Cl bending)</span>
              <span>1000</span>
              <span>2000</span>
              <span>3000</span>
              <span>4000 (N-H)</span>
            </div>
          </div>

          {/* Joriy cho'qqi ma'lumoti */}
          <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-2 border-pink-500/40 rounded-xl p-5">
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
              <div>
                <span className="text-xs text-purple-400 uppercase">Eng yaqin cho'qqi:</span>
                <div className="text-3xl font-mono font-bold text-pink-400">{currentPeak.freq} cm⁻¹</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-purple-400 uppercase">Zona:</span>
                <div className="text-sm text-cyan-300 font-semibold">{currentPeak.region}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">Tayinlash</div>
                <div className="text-pink-300 font-mono font-bold text-sm">{currentPeak.assignment}</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">O'tkazuvchanlik</div>
                <div className="text-white font-mono font-bold text-sm">{currentPeak.T}%</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">Simmetriya</div>
                <div className="text-cyan-300 font-mono font-bold text-sm">{currentPeak.symmetry.split(" — ")[0]}</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg p-3">
                <div className="text-[10px] text-purple-400 uppercase">Kuch konstanta</div>
                <div className="text-orange-300 font-mono font-bold text-sm">{currentPeak.forceConstant}</div>
              </div>
            </div>
            <div className="bg-purple-950/60 rounded-lg p-4 mb-3">
              <div className="text-pink-400 font-bold text-sm mb-2 flex items-center gap-2">
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
              <div className="mt-3 bg-pink-600/20 border border-pink-500/40 rounded p-3">
                <p className="text-pink-200 text-xs font-semibold">💎 {currentPeak.diagnostic}</p>
              </div>
            )}
          </div>

          {/* SVG SPEKTR */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
            <div className="text-xs text-purple-400 mb-2 flex items-center justify-between">
              <span>IQ spektr — CsI tabletka simulyatsiya</span>
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
              <text x="20" y="140" textAnchor="middle" fontSize="11" fill="#f472b6" transform="rotate(-90, 20, 140)" fontWeight="bold">O'tkazuvchanlik T (%)</text>

              {[4000, 3500, 3000, 2500, 2000, 1500, 1000, 500, 200].map((f, i) => {
                const gx = 60 + ((4000 - f) / 3800) * 710
                return (
                  <g key={i}>
                    <line x1={gx} y1="30" x2={gx} y2="250" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={gx} y="275" textAnchor="middle" fontSize="9" fill="#a78bfa">{f}</text>
                  </g>
                )
              })}
              <text x="415" y="295" textAnchor="middle" fontSize="11" fill="#f472b6" fontWeight="bold">To'lqin soni (cm⁻¹)</text>

              {/* Zonalar */}
              <rect x={60 + ((4000 - 3600) / 3800) * 710} y="30" width={((3600 - 3100) / 3800) * 710} height="220" fill="#22d3ee" opacity="0.05" />
              <rect x={60 + ((4000 - 1700) / 3800) * 710} y="30" width={((1700 - 1200) / 3800) * 710} height="220" fill="#a78bfa" opacity="0.05" />
              <rect x={60 + ((4000 - 550) / 3800) * 710} y="30" width={((550 - 380) / 3800) * 710} height="220" fill="#fb923c" opacity="0.05" />
              <rect x={60 + ((4000 - 380) / 3800) * 710} y="30" width={((380 - 200) / 3800) * 710} height="220" fill="#ec4899" opacity="0.10" />

              <text x={60 + ((4000 - 3350) / 3800) * 710} y="45" fontSize="8" fill="#22d3ee" textAnchor="middle" fontWeight="bold">X-H zonasi</text>
              <text x={60 + ((4000 - 1450) / 3800) * 710} y="45" fontSize="8" fill="#a78bfa" textAnchor="middle" fontWeight="bold">Deformatsiya</text>
              <text x={60 + ((4000 - 465) / 3800) * 710} y="45" fontSize="8" fill="#fb923c" textAnchor="middle" fontWeight="bold">Co-N</text>
              <text x={60 + ((4000 - 290) / 3800) * 710} y="45" fontSize="8" fill="#ec4899" textAnchor="middle" fontWeight="bold">🏆 Co-Cl</text>

              {/* Spektr chizig'i */}
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
                stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,2"
              />

              {irPeaks.map((peak, i) => {
                const x = 60 + ((4000 - peak.freq) / 3800) * 710
                const y = 250 - (1 - peak.T / 100) * 220
                const isActive = currentPeak.freq === peak.freq
                const isCoCl = peak.freq === 328
                return (
                  <g key={i} onClick={() => { setActivePeak(i); setFreqSlider(peak.freq) }} className="cursor-pointer">
                    <circle cx={x} cy={y} r={isActive ? 9 : (isCoCl ? 7 : 5)}
                      fill={isCoCl ? "#ec4899" : (isActive ? "#f472b6" : "#4ade80")} stroke="#fff" strokeWidth="1.5" />
                    {isActive && (
                      <>
                        <line x1={x} y1={y} x2={x} y2={y - 25} stroke="#f472b6" strokeWidth="1" strokeDasharray="1,1" />
                        <rect x={x - 40} y={y - 52} width="80" height="24" rx="3" fill="#1e1a3a" stroke="#f472b6" strokeWidth="1" />
                        <text x={x} y={y - 40} textAnchor="middle" fontSize="8" fill="#f472b6" fontWeight="bold">{peak.freq} cm⁻¹</text>
                        <text x={x} y={y - 32} textAnchor="middle" fontSize="7" fill="#a78bfa">{peak.assignment}</text>
                      </>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="flex flex-wrap gap-2">
            {irPeaks.map((p, i) => {
              const isCoCl = p.freq === 328
              return (
                <button key={i} onClick={() => { setActivePeak(i); setFreqSlider(p.freq) }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                    currentPeak.freq === p.freq
                      ? 'border-pink-400 bg-pink-900/40 shadow-lg shadow-pink-500/20'
                      : isCoCl
                        ? 'border-pink-500/60 bg-pink-950/30 hover:border-pink-400'
                        : 'border-green-400/40 bg-green-900/10 hover:border-pink-400/60'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    currentPeak.freq === p.freq ? 'bg-pink-400' : (isCoCl ? 'bg-pink-500' : 'bg-green-400')
                  }`} />
                  <span className="font-mono text-green-400 font-bold">{p.freq}</span>
                  <span className="text-purple-400">{p.assignment}</span>
                  {isCoCl && <span className="text-pink-400">🏆</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* CHO'QQILAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📊</span> Cho'qqilar jadvali — batafsil tayinlash
          </h2>
          <p className="text-purple-200 text-sm">
            10 ta asosiy cho'qqi. <strong className="text-pink-400">328 cm⁻¹ dagi ν(Co–Cl)</strong> — bu birikmaning eng muhim diagnostik polosasi.
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
                {irPeaks.map((p, i) => {
                  const isCoCl = p.freq === 328
                  return (
                    <tr key={i} onClick={() => { setActivePeak(i); setFreqSlider(p.freq) }}
                      className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer transition-colors ${
                        currentPeak.freq === p.freq ? "bg-pink-900/20" : (isCoCl ? "bg-pink-950/30" : "")
                      }`}>
                      <td className={`py-3 px-3 font-mono font-bold ${isCoCl ? "text-pink-400" : "text-yellow-400"}`}>
                        {p.freq}{isCoCl && " 🏆"}
                      </td>
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
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-cyan-400 font-bold text-sm mb-2">🔷 X–H zonasi</div>
              <p className="text-purple-200 text-xs">ν(N–H) 3300, 3200 cm⁻¹ — ammin komplekslarga xos. Luteo-dan biroz pastroq (−20 cm⁻¹).</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
              <div className="text-orange-400 font-bold text-sm mb-2">🎯 Trans-effekt</div>
              <p className="text-purple-200 text-xs">ν(Co–N)ₑq = 498 vs ν(Co–N)ₐₓ = 475 cm⁻¹. Δν = 23 cm⁻¹ Cl⁻ trans ta'siri.</p>
            </div>
            <div className="bg-pink-900/20 border border-pink-500/40 rounded-xl p-4">
              <div className="text-pink-400 font-bold text-sm mb-2">🏆 ν(Co–Cl) 328 cm⁻¹</div>
              <p className="text-purple-200 text-xs">Bu polosa LUTEO-DA YO'Q. Ichki sfera Cl⁻ bevosita isboti — Werner nazariyasining kaliti.</p>
            </div>
          </div>
        </div>


        {/* GURUH NAZARIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔷</span> Guruh nazariyasi — C₄ᵥ va Oₕ dan farqi
          </h2>
          <p className="text-purple-200 text-sm leading-relaxed">
            [Co(NH₃)₅Cl]²⁺ ioni <strong className="text-pink-400">C₄ᵥ nuqtaviy guruhga</strong> tegishli (8-tartib). Oₕ dan 6× kichikroq —
            operatsiyalar: <span className="font-mono text-cyan-300">E, 2C₄, C₂, 2σᵥ, 2σd</span>. Inversiya markazi <strong className="text-red-400">YO'Q</strong>.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold mb-3">Normal modalar (C₄ᵥ vakolatlari)</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-cyan-300 text-xs font-bold uppercase mb-1">Umumiy modalar</div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2">3N−6 = 3(22)−6 = 60</div>
                </div>
                <div>
                  <div className="text-cyan-300 text-xs font-bold uppercase mb-1">ν(Co–N) modalar</div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">2A₁ + B₁ + E (ekvator va aksial farqli)</div>
                </div>
                <div>
                  <div className="text-cyan-300 text-xs font-bold uppercase mb-1">ν(Co–Cl) moda</div>
                  <div className="font-mono text-pink-300 bg-pink-950/40 rounded p-2 text-xs">A₁ (1 ta, IQ + Raman ikkalasida faol)</div>
                </div>
                <div>
                  <div className="text-cyan-300 text-xs font-bold uppercase mb-1">δ(N–Co–N) egilish</div>
                  <div className="font-mono text-purple-200 bg-purple-950/60 rounded p-2 text-xs">A₁ + B₁ + B₂ + E</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold mb-3">Oₕ vs C₄ᵥ solishtirish</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-purple-700">
                      <th className="py-2 text-left text-purple-300">Xususiyat</th>
                      <th className="py-2 text-yellow-300">Oₕ (Luteo)</th>
                      <th className="py-2 text-pink-300">C₄ᵥ (Purpureo)</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-purple-800/30">
                      <td className="py-2">Tartib</td>
                      <td className="py-2 font-mono">48</td>
                      <td className="py-2 font-mono text-pink-300">8</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-2">Inversiya (i)</td>
                      <td className="py-2 text-green-400">MAVJUD</td>
                      <td className="py-2 text-red-400">YO'Q</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-2">Mutual exclusion</td>
                      <td className="py-2 text-green-400">Ishlaydi</td>
                      <td className="py-2 text-red-400">Ishlamaydi</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-2">ν(Co–Cl)</td>
                      <td className="py-2 text-red-400">YO'Q</td>
                      <td className="py-2 text-pink-300">328 cm⁻¹</td>
                    </tr>
                    <tr>
                      <td className="py-2">ν(Co–N)</td>
                      <td className="py-2 font-mono">1 chastota</td>
                      <td className="py-2 font-mono text-pink-300">2 chastota</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-200 text-sm">
              <strong className="text-blue-300">Muhim spektroskopik xulosa:</strong> C₄ᵥ da inversiya markazi yo'qligi tufayli mutual exclusion qoidasi ishlamaydi. Har bir simmetriya operatsiyasiga mos keluvchi tebranish moda IQ va Ramanda BIR VAQTDA faol bo'lishi mumkin. Bu Oₕ dan spektroskopik jihatdan asosiy farq — Raman va IQ spektrlarini solishtirish orqali osongina aniqlanadi.
            </p>
          </div>
        </div>

        {/* TRANS-EFFEKT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎯</span> Trans-effekt (Chernyaev-Tolman qatori)
          </h2>
          <p className="text-purple-200 leading-relaxed">
            Trans-effekt — ligandning qarama-qarshi joylashgan (trans) ligandning bog'lanishiga ta'siri. Bu tarixiy jihatdan I. I. Chernyaev tomonidan 1926-yilda kashf etilgan va 20-asrda batafsil o'rganilgan.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Ligand</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Trans-effekt kuchi</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Mexanizm izohi</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {transEffectData.map((te, i) => {
                  const isCl = te.ligand.includes("Cl⁻")
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 ${isCl ? "bg-pink-900/20" : ""}`}>
                      <td className={`py-3 px-4 font-mono ${isCl ? "text-pink-400 font-bold" : "text-cyan-300"}`}>{te.ligand}</td>
                      <td className={`py-3 px-4 ${isCl ? "text-pink-300 font-bold" : "text-yellow-300"}`}>{te.strength}</td>
                      <td className="py-3 px-4 text-xs">{te.note}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-r from-pink-900/20 to-orange-900/20 border border-pink-500/30 rounded-xl p-5">
            <p className="text-pink-200 text-sm">
              <strong className="text-pink-300">🔬 Bu birikmada trans-effekt IQ da qanday kuzatiladi:</strong>
              <br /><br />
              • ν(Co–N)<sub>ekvator</sub> = <strong>498 cm⁻¹</strong> (k = 1.82 mdyn/Å, r = 1.973 Å)<br />
              • ν(Co–N)<sub>aksial, trans-Cl</sub> = <strong>475 cm⁻¹</strong> (k = 1.68 mdyn/Å, r = 1.936 Å)
              <br /><br />
              Δν = 23 cm⁻¹, Δk = 0.14 mdyn/Å (~7.6% zaiflashish). Bog' uzunligi paradoksal — aksial QISQAROQ (1.936 vs 1.973 Å), lekin bog' ZAIFROQ (past k). Bu σ-bog'lanish (elektron zichlik) va π-donorlik (orbital konfiguratsiya) ning bir vaqtda ishlashi bilan izohlanadi. Kuchli π-donor ligandlar (CN⁻, CO) da bu farq 50–100 cm⁻¹ ga yetadi.
            </p>
          </div>
        </div>

        {/* KUCH KONSTANTASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💪</span> Kuch konstantasi va Hooke qonuni
          </h2>
          <p className="text-purple-200 text-sm">
            Hooke qonuni ν̃ = (1/2πc)·√(k/μ) asosida bog'lar mustahkamligini taqqoslash. Bu birikmada 3 xil bog' turi mavjud — trans-effekt aniq ko'rinadi.
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
                  const isHighlight = f.bond.includes("bu kompleks")
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isHighlight ? "bg-pink-900/20" : ""}`}>
                      <td className={`py-3 px-4 font-mono ${isHighlight ? "text-pink-300 font-bold" : "text-cyan-300"}`}>{f.bond}</td>
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
              <strong className="text-green-300">Xulosa qatori:</strong> k(Co–N)ₑq = 1.82 &gt; k(Co–N)ₐₓ = 1.68 &gt; k(Co–Cl) = 1.42 mdyn/Å.
              Ekvator NH₃ bog'i luteo (k = 1.85) ga yaqin — normal. Aksial NH₃ Cl⁻ trans-effekti tufayli zaifroq. Co–Cl esa og'ir Cl atomi va uzun bog' (2.26 Å) tufayli sezilarli past chastotada tebranadi.
            </p>
          </div>
        </div>

        {/* WERNER QATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚖️</span> Werner koordinatsion qatori — Purpureo o'rni
          </h2>
          <p className="text-purple-200 leading-relaxed">
            Werner 1893-yilda kobalt(III) ammin komplekslarini o'rganib, ichki/tashqi sfera tushunchasini kiritdi. Purpureo bu qatorda IKKINCHI o'rinni egallaydi. Har bir bosqichda ν(Co–Cl) polosalari soni va joylashuvi o'zgaradi — bu strukturaning IQ orqali diagnostikasi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Kompleks</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Rang</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Simm.</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">ν(Co-N)</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">ν(Co-Cl)</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">Ichki Cl</th>
                  <th className="py-3 px-3 text-purple-300 text-xs uppercase">AgNO₃</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {wernerSeries.map((w, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${w.current ? "bg-pink-900/30" : ""}`}>
                    <td className={`py-3 px-3 font-mono ${w.current ? "font-bold text-pink-400" : "text-cyan-300"}`}>{w.formula}</td>
                    <td className="py-3 px-3 text-xs">{w.trad}</td>
                    <td className="py-3 px-3 font-mono text-purple-300 text-xs">{w.sym}</td>
                    <td className="py-3 px-3 font-mono text-orange-300">{w.nuCoN}</td>
                    <td className="py-3 px-3 font-mono">
                      {w.nuCoCl === "yo'q" ? <span className="text-red-400">YO'Q</span> : <span className="text-pink-300">{w.nuCoCl}</span>}
                    </td>
                    <td className="py-3 px-3 text-center">{w.inner}</td>
                    <td className="py-3 px-3 text-red-400 font-bold">{w.agCl} × AgCl↓</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <p className="text-pink-200 text-sm">
                <strong className="text-pink-300">Werner tajribasining IQ tasdig'i:</strong> AgNO₃ qo'shilganda faqat 2 ta Cl⁻ cho'kadi. Bu IQ spektrdagi 328 cm⁻¹ dagi ν(Co–Cl) polosasi bilan bevosita mos keladi. Luteoda (0 ichki Cl) bu polosa yo'q, purpureo da (1 ichki Cl) BOR.
              </p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <p className="text-yellow-200 text-sm">
                <strong className="text-yellow-300">Rang va Δₒ:</strong> Rang sariq → binafsha → yashil yo'nalishida o'zgaradi. Δₒ pasayadi: 22900 → 20100 → 17500 cm⁻¹. Cl⁻ NH₃ dan zaifroq maydon ligand (spektrokimyoviy qator).
              </p>
            </div>
          </div>
        </div>

        {/* NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔬</span> Namuna tayyorlash — halogeno kompleks uchun
          </h2>
          <p className="text-purple-200 text-sm">
            Purpureo-kobalt bilan ishlashda usul tanlash muhim: KBr bilan ion almashinuvi mumkin. <strong className="text-pink-400">CsI tabletka</strong> — asosiy tavsiya, chunki ν(Co–Cl) 328 cm⁻¹ da KBr shaffofligi tugagan.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {techniques.map((t, i) => {
              const isRec = t.name.includes("CsI")
              return (
                <button key={i} onClick={() => setActiveTechnique(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                    activeTechnique === i
                      ? "bg-pink-600/60 text-white border-pink-400/50 shadow-lg shadow-pink-500/20"
                      : "bg-purple-800/30 text-purple-400 border-purple-700/50 hover:bg-purple-700/40"
                  }`}>
                  {t.name}{isRec && <span className="ml-1 text-yellow-300">★</span>}
                </button>
              )
            })}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
              <h3 className="text-pink-400 font-bold text-lg">{techniques[activeTechnique].name}</h3>
              {techniques[activeTechnique].name.includes("CsI") && (
                <span className="text-yellow-300 text-xs bg-yellow-900/30 border border-yellow-700/30 px-3 py-1 rounded-full">★ Bu birikma uchun tavsiya</span>
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
            <span>⚠️</span> Halaqit beruvchi omillar — purpureo uchun xos
          </h2>
          <p className="text-purple-200 text-sm">
            Bu birikma bilan ishlashda 2 ta o'ziga xos muammo bor: KBr bilan ion almashinuvi (Cl⁻ ↔ Br⁻) va akvatsiya (Cl⁻ → H₂O). Quyida 8 ta omil va yechim:
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
                    className={`border-b border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${activeInterference === i ? "bg-pink-900/20" : ""}`}>
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

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✅</span> Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li className="pl-2"><strong className="text-pink-400">ν(Co–Cl) = 328 cm⁻¹</strong> — ENG MUHIM DIAGNOSTIK POLOSA. Luteoda YO'Q, purpureo da BOR — ichki sfera Cl⁻ bevosita isboti.</li>
            <li className="pl-2"><strong className="text-pink-400">Simmetriya Oₕ → C₄ᵥ ga pasayadi</strong> — 48 → 8 operatsiya. Mutual exclusion ishlamaydi, ko'p modalar IQ+Raman ikkalasida faol.</li>
            <li className="pl-2"><strong className="text-pink-400">Trans-effekt IQ da kuzatiladi:</strong> ν(Co-N)ₑq = 498 vs ν(Co-N)ₐₓ = 475 cm⁻¹. Δν = 23 cm⁻¹ (~7.6% zaiflashish).</li>
            <li className="pl-2">Kuch konstantalari: k(Co–N)ₑq = 1.82 &gt; k(Co–N)ₐₓ = 1.68 &gt; k(Co–Cl) = 1.42 mdyn/Å — struktura miqdoriy tasvirlangan.</li>
            <li className="pl-2"><strong className="text-yellow-400">CsI tabletka MAJBURIY</strong> — KBr 400 cm⁻¹ dan pastda shaffoflikni yo'qotadi va Cl⁻/Br⁻ almashinuvi mumkin.</li>
            <li className="pl-2">AgNO₃ tajribasi (2 Cl⁻ cho'kadi) va IQ (328 cm⁻¹ paydo bo'ladi) BIR-BIRINI TASDIQLAYDI — Werner nazariyasining ikki tomonlama isboti.</li>
            <li className="pl-2">Bu kompleks pentaammin-kobalt(III) klassik namunasi — koordinatsion kimyoning ligand almashinuvi reaksiyalarini o'rganish uchun ideal model.</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-nh3-6-cl3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← [Co(NH₃)₆]Cl₃ (Luteo)
          </Link>
          <button onClick={() => setPdfModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-500/20">
            📄 PDF Hisobot yaratish
          </button>
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-nh3-4-cl2-cl" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold transition-all">
            [Co(NH₃)₄Cl₂]Cl (Praseo) →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA-Kimyo • [Co(NH₃)₅Cl]Cl₂ (Purpureo-kobalt) • IQ spektroskopiya moduli (premium)</p>
          <p className="mt-2 text-purple-600">
            Manbalar: Nakamoto K. — Infrared and Raman Spectra (6-nashr, 2009); Cotton F. A. — Chemical Applications of Group Theory; Chernyaev I. I. (1926) — trans-effekt; Tolman C. A. (1970); Werner A. (1893)
          </p>
        </div>
      </footer>
    </main>
  )
}
