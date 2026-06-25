"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₄Cl₂]Cl — IQ SPEKTROSKOPIYA (PREMIUM, TO'LIQ ILMIY)
// Manbalar: Nakamoto, Lever, Cotton, Wilkinson, Werner (1893)
// Xususiyat: Praseo-kobalt, sis/trans izomerlar, C₂ᵥ/D₄ₕ simmetriya
// O'ziga xoslik: 2 ta ichki Cl⁻, 1:1 elektrolit (2 ion)
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>4</sub>Cl<sub>2</sub>]Cl",
  formulaPlain: "[Co(NH3)4Cl2]Cl",
  iupac: "Tetraammindiklorokobalt(III) xlorid",
  commonName: "Praseo-kobalt (yashil)",
  molarMass: 233.40,
  casNumber: "14878-43-8",
  color: "yashil (praseo) — sis izomer; binafsha-yashil — trans izomer",
  structure: "Oktaedr (sis: C₂ᵥ; trans: D₄ₕ)",
  metalLigand: "Co-N, Co-Cl",
  spaceGroup: "P2₁/c (monoklinik, sis); P4₂/mnm (tetragonal, trans)",
  crystalSystem: "Monoklinik (sis); Tetragonal (trans)",
  pointGroup: "C₂ᵥ (sis) / D₄ₕ (trans)",
  electrolyteType: "1:1 elektrolit (2 ion)",
  molarConductivity: "~250 S·cm²/mol",
  isomers: {
    cis: { color: "yashil", pointGroup: "C₂ᵥ", freq_CoCl: "330, 310", irActive: "Ko'p (alternativa taqiq yo'q)" },
    trans: { color: "binafsha-yashil", pointGroup: "D₄ₕ", freq_CoCl: "325", irActive: "Kam (alternativa taqiq bor)" }
  }
}

// Cho'qqilar — batafsil izohlar bilan (sis izomer uchun)
const irPeaks_cis = [
  { 
    freq: 3310, 
    T: 13, 
    absorbance: 0.87, 
    assignment: "νₐₛ(N-H)", 
    assignment_uz: "N-H asimetrik cho'zilish (stretching)", 
    intensity: "Juda kuchli", 
    bond: "N-H", 
    symmetry: "A₁ + B₁ + B₂ (C₂ᵥ)",
    forceConstant: "6.1 mdyn/Å",
    bondLength: "1.02 Å",
    theoryNote: "NH₃ ligandining asimetrik cho'zilish tebranishi. C₂ᵥ simmetriya tufayli ko'p modlar IQ faol — alternativa taqiq yo'q."
  },
  { 
    freq: 3210, 
    T: 29, 
    absorbance: 0.71, 
    assignment: "νₛ(N-H)", 
    assignment_uz: "N-H simmetrik cho'zilish (stretching)", 
    intensity: "Kuchli", 
    bond: "N-H", 
    symmetry: "A₁",
    forceConstant: "5.9 mdyn/Å",
    bondLength: "1.02 Å",
    theoryNote: "NH₃ ning simmetrik cho'zilishi. C₂ᵥ da A₁ mod IQ va Raman ikkalasida ham faol."
  },
  { 
    freq: 1625, 
    T: 47, 
    absorbance: 0.53, 
    assignment: "δ(H-N-H)", 
    assignment_uz: "H-N-H egilish (scissoring/bending)", 
    intensity: "O'rta", 
    bond: "H-N-H", 
    symmetry: "A₁ + B₁",
    forceConstant: "0.6 mdyn/Å",
    bondLength: "—",
    theoryNote: "NH₃ ning deformatsion tebranishi. Erkin NH₃ (1627 cm⁻¹) bilan deyarli bir xil."
  },
  { 
    freq: 1335, 
    T: 63, 
    absorbance: 0.37, 
    assignment: "δₛ(NH₃)", 
    assignment_uz: "NH₃ simmetrik egilish (umbrella mode)", 
    intensity: "O'rta-zaif", 
    bond: "NH₃", 
    symmetry: "A₁",
    forceConstant: "0.5 mdyn/Å",
    bondLength: "—",
    theoryNote: "NH₃ ning 'soyabon' (umbrella) tebranishi. Erkin NH₃ (950 cm⁻¹) dan yuqori."
  },
  { 
    freq: 835, 
    T: 53, 
    absorbance: 0.47, 
    assignment: "ρ(NH₃)", 
    assignment_uz: "NH₃ rocking (tebranish)", 
    intensity: "O'rta", 
    bond: "NH₃", 
    symmetry: "B₁ + B₂",
    forceConstant: "0.4 mdyn/Å",
    bondLength: "—",
    theoryNote: "NH₃ ning rocking tebranishi. C₂ᵥ da B₁ va B₂ modlari IQ faol."
  },
  { 
    freq: 495, 
    T: 39, 
    absorbance: 0.61, 
    assignment: "ν(Co-N)", 
    assignment_uz: "Co-N cho'zilish (valent tebranish)", 
    intensity: "Kuchli", 
    bond: "Co-N", 
    symmetry: "A₁ + B₁",
    forceConstant: "1.7 mdyn/Å",
    bondLength: "1.96 Å",
    theoryNote: "Co-N bog'ining cho'zilishi. [Co(NH₃)₆]³⁺ (500 cm⁻¹) dan biroz past — 2 ta Cl⁻ ning trans-ta'siri."
  },
  { 
    freq: 330, 
    T: 49, 
    absorbance: 0.51, 
    assignment: "νₐₛ(Co-Cl)", 
    assignment_uz: "Co-Cl asimetrik cho'zilish (sis)", 
    intensity: "Kuchli", 
    bond: "Co-Cl", 
    symmetry: "B₁ (C₂ᵥ)",
    forceConstant: "1.4 mdyn/Å",
    bondLength: "2.26 Å",
    theoryNote: "⚠️ MUHIM: Ichki sferadagi 2 ta Cl⁻ ning belgisi! Asimetrik cho'zilish (sis pozitsiya). Co-Cl bog' uzunligi 2.26 Å."
  },
  { 
    freq: 310, 
    T: 55, 
    absorbance: 0.45, 
    assignment: "νₛ(Co-Cl)", 
    assignment_uz: "Co-Cl simmetrik cho'zilish (sis)", 
    intensity: "Kuchli", 
    bond: "Co-Cl", 
    symmetry: "A₁ (C₂ᵥ)",
    forceConstant: "1.3 mdyn/Å",
    bondLength: "2.26 Å",
    theoryNote: "⚠️ MUHIM: Ichki sferadagi 2 ta Cl⁻ ning simmetrik cho'zilishi. Trans izomerda faqat 1 ta cho'qqi (325 cm⁻¹) ko'rinadi."
  },
  { 
    freq: 275, 
    T: 64, 
    absorbance: 0.36, 
    assignment: "δ(Cl-Co-N)", 
    assignment_uz: "Cl-Co-N egilish deformatsiya", 
    intensity: "O'rta-zaif", 
    bond: "Cl-Co-N", 
    symmetry: "A₁ + B₁ + B₂",
    forceConstant: "0.3 mdyn/Å",
    bondLength: "—",
    theoryNote: "Cl-Co-N burchakning deformatsion tebranishi. C₂ᵥ simmetriya tufayli ko'p modlar IQ faol."
  },
  { 
    freq: 235, 
    T: 74, 
    absorbance: 0.26, 
    assignment: "δ(Co-Cl)", 
    assignment_uz: "Co-Cl egilish (skeletal bending)", 
    intensity: "Zaif", 
    bond: "Co-Cl", 
    symmetry: "B₂",
    forceConstant: "0.2 mdyn/Å",
    bondLength: "—",
    theoryNote: "Co-Cl bog'ining egilish tebranishi — past chastotali (far-IR). C₂ᵥ da B₂ mod."
  },
]

// Trans izomer cho'qqilari (taqqoslash uchun)
const irPeaks_trans = [
  { freq: 3300, assignment: "νₐₛ(N-H)", intensity: "Juda kuchli", symmetry: "Eᵤ (D₄ₕ)", theoryNote: "D₄ₕ da Eᵤ mod IQ faol — E_g Raman faol. Alternativa taqiq amal qiladi!" },
  { freq: 3200, assignment: "νₛ(N-H)", intensity: "Kuchli", symmetry: "A₁g (Raman)", theoryNote: "D₄ₕ da A₁g faqat Raman faol — IQ da ko'rinmaydi!" },
  { freq: 490, assignment: "ν(Co-N)", intensity: "Kuchli", symmetry: "Eᵤ", theoryNote: "Eᵤ mod IQ faol." },
  { freq: 325, assignment: "ν(Co-Cl)", intensity: "Kuchli", symmetry: "A₂ᵤ", theoryNote: "⚠️ Trans da faqat 1 ta Co-Cl cho'qqi (A₂ᵤ). Sis da 2 ta (330, 310). Bu sis/trans farqlash usuli!" },
]

// Spektr ma'lumotlari (sis izomer)
const irSpectrum = [
  { freq: 4000, absorbance: 0.05 },
  { freq: 3500, absorbance: 0.10 },
  { freq: 3310, absorbance: 0.87 },
  { freq: 3210, absorbance: 0.71 },
  { freq: 2000, absorbance: 0.05 },
  { freq: 1625, absorbance: 0.53 },
  { freq: 1335, absorbance: 0.37 },
  { freq: 1000, absorbance: 0.10 },
  { freq: 835, absorbance: 0.47 },
  { freq: 600, absorbance: 0.15 },
  { freq: 495, absorbance: 0.61 },
  { freq: 330, absorbance: 0.51 },
  { freq: 310, absorbance: 0.45 },
  { freq: 275, absorbance: 0.36 },
  { freq: 235, absorbance: 0.26 },
  { freq: 200, absorbance: 0.05 },
]

// Laboratoriya natijalari
const labResults = [
  {
    id: "LAB-001",
    date: "2026-10-15",
    technique: "KBr tabletka",
    condition: "200 mg KBr + 1 mg namuna (sis)",
    freq_nuNH: "3310, 3210",
    freq_CoN: "495",
    freq_CoCl: "330, 310",
    resolution: "4 cm⁻¹",
    notes: "Standart sharoit. Sis izomer — Co-Cl cho'qqilari 330 va 310 cm⁻¹ da aniq ko'rinadi (2 ta cho'qqi!).",
    quality: "A'lo"
  },
  {
    id: "LAB-002",
    date: "2026-10-15",
    technique: "KBr tabletka (trans)",
    condition: "200 mg KBr + 1 mg trans izomer",
    freq_nuNH: "3300",
    freq_CoN: "490",
    freq_CoCl: "325",
    resolution: "4 cm⁻¹",
    notes: "Trans izomer — Co-Cl faqat 1 ta cho'qqi (325 cm⁻¹). Sis/trans farqlash uchun asosiy belgi!",
    quality: "A'lo"
  },
  {
    id: "LAB-003",
    date: "2026-10-16",
    technique: "ATR (sis)",
    condition: "To'g'ridan-to'g'ri kristall",
    freq_nuNH: "3305, 3205",
    freq_CoN: "493",
    freq_CoCl: "328, 308",
    resolution: "2 cm⁻¹",
    notes: "ATR usuli — cho'qqilar biroz siljigan. Co-Cl cho'qqilari aniq (sis izomer).",
    quality: "A'lo"
  },
  {
    id: "LAB-004",
    date: "2026-10-16",
    technique: "Far-IR (sis)",
    condition: "Maxsus uskuna, polietilen plastinka",
    freq_nuNH: "—",
    freq_CoN: "495",
    freq_CoCl: "330, 310, 275, 235",
    resolution: "2 cm⁻¹",
    notes: "Far-IR soha — barcha Co-Cl tebranishlari aniq (330, 310, 275, 235 cm⁻¹). 4 ta cho'qqi — sis izomer belgisi.",
    quality: "A'lo"
  },
  {
    id: "LAB-005",
    date: "2026-10-17",
    technique: "AgNO₃ cho'ktirish testi",
    condition: "IQ oldidan AgNO₃ testi",
    freq_nuNH: "—",
    freq_CoN: "—",
    freq_CoCl: "—",
    resolution: "—",
    notes: "⚠️ MUHIM: AgNO₃ qo'shilganda faqat 1 ta Cl⁻ cho'kadi (AgCl). 2 ta Cl⁻ cho'kmaydi — ichki sferada. Bu Werner tajribasining tasdig'i.",
    quality: "Tasdiqlovchi test"
  },
  {
    id: "LAB-006",
    date: "2026-10-17",
    technique: "Sis/trans farqlash",
    condition: "IQ spektrlarni taqqoslash",
    freq_nuNH: "—",
    freq_CoN: "—",
    freq_CoCl: "—",
    resolution: "—",
    notes: "Sis: Co-Cl 330, 310 (2 cho'qqi). Trans: Co-Cl 325 (1 cho'qqi). Bu sis/trans izomerlarni IQ orqali farqlash usuli!",
    quality: "Farqlash testi"
  },
]

// Texnikalar solishtirishi
const techniques = [
  {
    name: "KBr tabletka",
    description: "Namunani KBr bilan aralashtirib, gidravlik press bilan tabletka bosish",
    advantages: [
      "Eng aniq va an'anaviy usul",
      "Co-Cl 330, 310 cm⁻¹ aniq ko'rinadi (sis)",
      "Sis/trans farqlash mumkin",
      "Kvantitativ tahlil uchun qulay"
    ],
    disadvantages: [
      "Namuna tayyorlash kerak (10-15 daq)",
      "KBr nam bo'lsa, suv cho'qqilari aralashadi",
      "Past chastotali soha (200 cm⁻¹ dan past) zaif",
      "Sis/trans aralashmasi aniq emas"
    ],
    bestFor: "Aniq kvantitativ tahlil, sis/trans farqlash",
    freqRange: "4000-400 cm⁻¹",
    resolution: "4 cm⁻¹",
    samplePrep: "10-15 daq"
  },
  {
    name: "ATR (Attenuated Total Reflectance)",
    description: "To'g'ridan-to'g'ri kristall yoki kukun namuna ustiga qo'yish",
    advantages: [
      "Namuna tayyorlash shart emas",
      "Tez o'lchash (1-2 daq)",
      "Sis/trans tez farqlash",
      "Namuna buzilmaydi"
    ],
    disadvantages: [
      "Cho'qqilar biroz siljigan (ATR effekt)",
      "Past chastotali soha (400-200 cm⁻¹) zaif",
      "Kvantitativ tahlil qiyin",
      "Aralashmalar aniq emas"
    ],
    bestFor: "Tez skrining, sis/trans tez farqlash",
    freqRange: "4000-600 cm⁻¹",
    resolution: "2 cm⁻¹",
    samplePrep: "1-2 daq"
  },
  {
    name: "Far-IR (past chastotali IQ)",
    description: "Maxsus uskuna bilan 400-100 cm⁻¹ oralig'ida o'lchash",
    advantages: [
      "Co-Cl tebranishlari to'liq (330, 310, 275, 235 cm⁻¹)",
      "Sis izomerda 4 ta cho'qqi — aniq belgi",
      "Trans da 1 ta cho'qqi — farqlash oson",
      "Geometriya tasdig'i"
    ],
    disadvantages: [
      "Maxsus uskuna kerak (Far-IR spektrometr)",
      "Polietilen yoki CsI plastinka kerak",
      "Nam namuna ishlamaydi",
      "Namuna tayyorlash qiyin"
    ],
    bestFor: "Sis/trans farqlash, Co-Cl to'liq o'rganish",
    freqRange: "400-100 cm⁻¹",
    resolution: "2 cm⁻¹",
    samplePrep: "15-20 daq"
  },
  {
    name: "AgNO₃ cho'ktirish testi",
    description: "IQ oldidan AgNO₃ bilan test — cho'kadigan Cl⁻ sonini aniqlash",
    advantages: [
      "Werner tajribasining to'g'ridan-to'g'ri tasdig'i",
      "Faqat 1 ta Cl⁻ cho'kadi — 1:1 elektrolit",
      "Kvantitativ (AgCl massasi)",
      "Oddiy uskuna"
    ],
    disadvantages: [
      "Faqat Cl⁻ uchun",
      "Sekin reaksiya (inert kompleks)",
      "Faqat soni (ichki Cl soni emas)",
      "AgNO₃ qimmat"
    ],
    bestFor: "Werner nazariyasini tasdiqlash, 1:1 elektrolit tasdig'i",
    freqRange: "—",
    resolution: "—",
    samplePrep: "30-60 daq (cho'kish vaqti)"
  },
]

// Halaqit beruvchi omillar
const interferences = [
  {
    source: "Suv (H₂O)",
    freqRange: "3400, 1640 cm⁻¹",
    effect: "Keng cho'qqilar — N-H va H-N-H sohasiga aralashadi",
    severity: "Yuqori",
    solution: "KBr ni 110°C da 2 soat quritish. Namuna quritgichda saqlash.",
    prevention: "KBr ni quritish, namuna quritgichda saqlash"
  },
  {
    source: "CO₂ (atmosfera)",
    freqRange: "2350, 667 cm⁻¹",
    effect: "O'tkir cho'qqilar — Co-Cl sohasiga (330 cm⁻¹) aralashishi mumkin",
    severity: "O'rta",
    solution: "Spektrometrni N₂ bilan tozalash yoki CO₂ absorber ishlatish.",
    prevention: "N₂ bilan tozalash, CO₂ absorber"
  },
  {
    source: "Sis/trans aralashmasi",
    freqRange: "330, 310 vs 325 cm⁻¹",
    effect: "Cho'qqilar murakkablashadi — sis va trans cho'qqilari aralashadi",
    severity: "Yuqori",
    solution: "Sof sis yoki trans izomer ishlatish. Xromatografiya bilan ajratish.",
    prevention: "Sof izomer sintez qilish, xromatografiya"
  },
  {
    source: "Nam KBr",
    freqRange: "3400, 1640 cm⁻¹",
    effect: "Keng suv cho'qqilari — spektrning ko'p qismini qoplaydi",
    severity: "Yuqori",
    solution: "KBr ni 110°C da 2 soat quritish. Desikatorda saqlash.",
    prevention: "KBr quritish, desikator"
  },
  {
    source: "Nujol moyi",
    freqRange: "2920, 2850, 1460, 1375 cm⁻¹",
    effect: "Kuchli C-H cho'qqilari — N-H va C-H sohasini qoplaydi",
    severity: "O'rta",
    solution: "Nujol ishlatmaslik yoki Nujol cho'qqilarini hisobga olish.",
    prevention: "KBr tabletka ishlatish"
  },
  {
    source: "Namuna parchalanishi",
    freqRange: "3200-3300 cm⁻¹",
    effect: "NH₃ yo'qolishi — cho'qqilar zaiflashadi",
    severity: "O'rta",
    solution: "Namuna tayyorlashda ortiqcha isitishdan saqlanish. Inert kompleks sekin parchalanadi.",
    prevention: "Past haroratda saqlash, tez tayyorlash"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CoNH34Cl2Cl_IQ() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(2000)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [activeIsomer, setActiveIsomer] = useState("cis")
  
  // CFSE hisoblagich
  const [calcDq, setCalcDq] = useState(21500)
  const [calcP, setCalcP] = useState(21000)
  const [calcN, setCalcN] = useState(6)

  // Current peak — xavfsiz
  const currentPeak = useMemo(() => {
    let closest = irPeaks_cis[0]
    let minDiff = Math.abs(freqSlider - irPeaks_cis[0].freq)
    
    for (let i = 1; i < irPeaks_cis.length; i++) {
      const diff = Math.abs(freqSlider - irPeaks_cis[i].freq)
      if (diff < minDiff) {
        minDiff = diff
        closest = irPeaks_cis[i]
      }
    }
    return closest
  }, [freqSlider])

  // CFSE hisoblagich
  const cfseResult = useMemo(() => {
    const dq = calcDq
    const p = calcP
    const cfse = -2.4 * dq + 2 * p
    return {
      cfse: cfse.toFixed(0),
      cfseKJ: (cfse * 0.01196).toFixed(2),
    }
  }, [calcDq, calcP])

  // μ_eff hisoblagich
  const muResult = useMemo(() => {
    const n = calcN
    const mu = Math.sqrt(n * (n + 2))
    return {
      mu: mu.toFixed(2),
    }
  }, [calcN])

  // Lab result
  const currentLabResult = useMemo(() => {
    return labResults.find(r => r.id === activeLabResult) || labResults[0]
  }, [activeLabResult])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-green-950 to-purple-950 border-2 border-green-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🔍</span> [Co(NH₃)₄Cl₂]Cl — PRASEO-KOBALT IQ TAHLILI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-green-300">Praseo-kobalt</strong> — Werner koordinatsion nazariyasining klassik namunasi.
              <strong> Sis va trans izomerlar</strong>, C₂ᵥ/D₄ₕ simmetriya.
            </p>
            
            <div className="bg-green-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-green-400 font-bold mb-2">📊 Asosiy cho'qqilar:</div>
                  <div className="text-purple-200">
                    <strong>ν(N-H):</strong> 3310, 3210 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Co-Cl):</strong> 330, 310 cm⁻¹ (sis)
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2">🔬 Simmetriya:</div>
                  <div className="text-purple-200">
                    <strong>C₂ᵥ (sis)</strong> / <strong>D₄ₕ (trans)</strong>
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>1:1 elektrolit</strong> — 2 ion
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-green-300">Sis vs Trans:</strong> Sis izomerda Co-Cl cho'qqilari 330 va 310 cm⁻¹ (2 ta cho'qqi). 
                Trans izomerda faqat 1 ta cho'qqi (325 cm⁻¹). Bu sis/trans farqlashning asosiy belgisi!
              </p>
            </div>

            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-green-300">Werner tajribasi (1893):</strong> 2 ta Cl⁻ ichki sferada, 
                1 ta Cl⁻ tashqi sferada. AgNO₃ qo'shilganda faqat 1 ta Cl⁻ cho'kadi — 1:1 elektrolit.
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
            >
              Tushundim — sahifani davom ettirish
            </button>
          </div>
        </div>
      )}
      
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
              <span className="text-green-400 font-semibold">[Co(NH₃)₄Cl₂]Cl</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-green-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🔍 IQ</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  {COMPOUND.iupac}
                </p>
                <p className="text-purple-500 text-xs mt-1 font-mono">
                  {COMPOUND.commonName}
                </p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">C₂ᵥ (sis)</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Co-Cl 330, 310</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Diamagnit</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">1:1 elektrolit</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-xs bg-green-600/80 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Barcha birikmalar
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-green-600 hover:bg-green-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* HERO — ASOSIY MA'LUMOT */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d⁶ quyi spin</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">KBr tabletka</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">1:1 elektrolit</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">Sis/Trans</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              [Co(NH₃)₄Cl₂]Cl
            </h2>
            <span className="text-purple-400 text-lg">233.40 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            tetraammindiklorokobalt(III) xlorid — <span className="text-green-400 italic">&quot;Praseo-kobalt&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-green-400">IQ spektri</strong> KBr tabletka usulida 4000−200 cm⁻¹ 
            oralig'ida olingan. Eng muhim diagnostik signallar: 
            <strong className="text-green-400"> ν(Co-Cl) 330, 310 cm⁻¹</strong> — ichki sfera Cl⁻ belgisi (sis izomer);
            <strong className="text-green-400"> ν(Co-N) 495 cm⁻¹</strong> — metall-ligand bog'i.
            Bu kompleks Werner nazariyasining asosiy namunasi — 2 ta Cl⁻ ichki, 1 ta Cl⁻ tashqi sferada.
          </p>

          {/* SIS/TRANS TANLASH */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveIsomer("cis")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeIsomer === "cis"
                  ? "bg-green-600/60 text-white border border-green-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
              }`}
            >
              Sis izomer (yashil, C₂ᵥ)
            </button>
            <button
              onClick={() => setActiveIsomer("trans")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeIsomer === "trans"
                  ? "bg-pink-600/60 text-white border border-pink-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
              }`}
            >
              Trans izomer (binafsha-yashil, D₄ₕ)
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Co³⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfiguratsiya</div>
              <div className="text-white font-bold">d⁶ (quyi spin)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">
                {activeIsomer === "cis" ? "C₂ᵥ (sis)" : "D₄ₕ (trans)"}
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit turi</div>
              <div className="text-white font-bold">1:1 (2 ion)</div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* INTERAKTIV IQ SPEKTR GRAFIGI — BATAFSIL */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv IQ spektr grafigi — batafsil</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            Slayderni harakatlantirib, chastotani o'zgartiring. Eng yaqin cho'qqi avtomatik tanlanadi va 
            <strong className="text-green-400"> batafsil nazariy izoh</strong> ko'rsatiladi. Har bir cho'qqini bosib, 
            to'liq ma'lumot olishingiz mumkin.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-green-400 font-bold mb-2">
              To'lqin soni: {freqSlider} cm⁻¹
            </label>
            <input
              type="range"
              min="200"
              max="4000"
              value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>200 cm⁻¹ (M-L)</span>
              <span>2000 cm⁻¹</span>
              <span>4000 cm⁻¹ (N-H)</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="text-xs text-purple-400">To'lqin soni:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentPeak.freq} cm⁻¹</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Belgilanish:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentPeak.assignment}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Intensivlik:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentPeak.intensity}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Simmetriya:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentPeak.symmetry}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Kuch konstanta:</div>
                <div className="text-xl font-mono font-bold text-green-400">{currentPeak.forceConstant}</div>
              </div>
            </div>
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                <span>📚</span> Batafsil tavsif:
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                {currentPeak.theoryNote}
              </p>
            </div>
          </div>

          {/* SVG GRAFIK — BATAFSIL */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-96">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible">
              {/* Grid */}
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.0)*200} x2="580" y2={220 - (v/1.0)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.0)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {/* X axis */}
              {[0, 1000, 2000, 3000, 4000].map((f, i) => (
                <g key={i}>
                  <text x={50 + (f/4000)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{f}</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">To'lqin soni (cm⁻¹)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish</text>

              {/* Spektr egri chizig'i */}
              <polyline
                fill="none" 
                stroke="#22c55e" 
                strokeWidth="2"
                points={irSpectrum.map(p => {
                  const x = 50 + ((4000 - p.freq)/4000)*530
                  const y = 220 - (p.absorbance/1.0)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* Current freq marker */}
              <line 
                x1={50 + ((4000 - currentPeak.freq)/4000)*530} 
                y1="30" 
                x2={50 + ((4000 - currentPeak.freq)/4000)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />

              {/* Peak markers — INTERAKTIV */}
              {irPeaks_cis.map((peak, i) => {
                const x = 50 + ((4000 - peak.freq)/4000)*530
                const y = 220 - (peak.absorbance/1.0)*200
                const isActive = currentPeak.freq === peak.freq
                const isCoCl = peak.freq === 330 || peak.freq === 310
                return (
                  <g key={i} onClick={() => setActivePeak(i)} className="cursor-pointer">
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isActive ? 10 : 6} 
                      fill={isActive ? "#fbbf24" : isCoCl ? "#f472b6" : "#22c55e"} 
                      stroke={isCoCl ? "#fbbf24" : "#fff"} 
                      strokeWidth={isCoCl ? 3 : 2}
                    />
                    {isActive && (
                      <>
                        <text x={x} y={y - 20} textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">
                          {peak.freq} cm⁻¹
                        </text>
                        <text x={x} y={y - 8} textAnchor="middle" fontSize="7" fill="#fbbf24">
                          {peak.assignment}
                        </text>
                      </>
                    )}
                    {isCoCl && !isActive && (
                      <text x={x} y={y - 12} textAnchor="middle" fontSize="7" fill="#fbbf24" fontWeight="bold">
                        MUHIM!
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="flex flex-wrap gap-3">
            {irPeaks_cis.map((p, i) => {
              const isCoCl = p.freq === 330 || p.freq === 310
              return (
                <button
                  key={i}
                  onClick={() => setActivePeak(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                    activePeak === i ? 'border-yellow-400 bg-yellow-900/30' : 
                    isCoCl ? 'border-pink-400 bg-pink-900/20' :
                    'border-green-400/40 bg-green-900/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activePeak === i ? 'bg-yellow-400' : isCoCl ? 'bg-pink-400' : 'bg-green-400'}`} />
                  <span className="font-mono text-green-400">{p.freq}</span>
                  <span className="text-purple-400">{p.assignment}</span>
                  {isCoCl && <span className="text-[10px] text-yellow-400 font-bold">(MUHIM!)</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CHO'QQILAR JADVALI — TO'LIQ */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📊 Cho'qqilar jadvali — to'liq tahlil (sis izomer)</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Chastota (cm⁻¹)</th>
                  <th className="py-3 px-4 text-purple-300">O'tkazuvchanlik</th>
                  <th className="py-3 px-4 text-purple-300">Belgilanish</th>
                  <th className="py-3 px-4 text-purple-300">Tavsif</th>
                  <th className="py-3 px-4 text-purple-300">Intensivlik</th>
                  <th className="py-3 px-4 text-purple-300">Bog'</th>
                  <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                  <th className="py-3 px-4 text-purple-300">Kuch (mdyn/Å)</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {irPeaks_cis.map((p, i) => {
                  const isCoCl = p.freq === 330 || p.freq === 310
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isCoCl ? 'bg-pink-900/20' : ''}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isCoCl ? 'text-pink-400' : 'text-yellow-400'}`}>
                        {p.freq}
                        {isCoCl && <span className="ml-1 text-[10px] text-yellow-400">⚠</span>}
                      </td>
                      <td className="py-3 px-4">{p.T}%</td>
                      <td className="py-3 px-4 font-mono">{p.assignment}</td>
                      <td className="py-3 px-4 text-xs">{p.assignment_uz}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-[10px] ${
                          p.intensity.includes('Juda kuchli') ? 'bg-red-600/30 text-red-400' :
                          p.intensity === 'Kuchli' ? 'bg-orange-600/30 text-orange-400' :
                          p.intensity === 'O\'rta' ? 'bg-yellow-600/30 text-yellow-400' :
                          'bg-green-600/30 text-green-400'
                        }`}>
                          {p.intensity}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-blue-400">{p.bond}</td>
                      <td className="py-3 px-4 font-mono text-cyan-400 text-xs">{p.symmetry}</td>
                      <td className="py-3 px-4 font-mono text-cyan-400">{p.forceConstant}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
            <p className="text-green-300 text-sm">
              <strong>⚠️ MUHIM:</strong> ν(Co-Cl) = 330, 310 cm⁻¹ cho'qqilari ichki sferada 2 ta Cl⁻ borligini ko'rsatadi. 
              [Co(NH₃)₆]Cl₃ da bu cho'qqilar <strong>YO'Q</strong>. 
              [Co(NH₃)₅Cl]Cl₂ da 1 ta cho'qqi (330 cm⁻¹). Bu Verner qatorining IQ tasdig'i.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>M-L tebranishlar (500-200 cm⁻¹):</strong> Bu soha "uzoq IQ" yoki "past chastotali IQ" 
              deb ataladi. Co-N bog'ining mustahkamligi ν(Co-N) = 495 cm⁻¹ da ko'rinadi. 
              Co-Cl bog' uzunligi 2.26 Å — Co-N dan uzun, shuning uchun past chastotali.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SIS/TRANS TAQQOSLASH */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Sis vs Trans izomerlar — IQ orqali farqlash</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            [Co(NH₃)₄Cl₂]⁺ ikkita geometrik izomerga ega: <strong className="text-green-400">sis</strong> (C₂ᵥ simmetriya) 
            va <strong className="text-pink-400">trans</strong> (D₄ₕ simmetriya). IQ spektroskopiya ularni aniq farqlaydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Sis izomer (yashil, C₂ᵥ)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(Co-Cl):</span>
                  <span className="text-green-400 font-mono">330, 310 cm⁻¹ (2 ta cho'qqi)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Simmetriya:</span>
                  <span className="text-green-400">C₂ᵥ (alternativa taqiq yo'q)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">IQ faol modlar:</span>
                  <span className="text-green-400">Ko'p (A₁ + B₁ + B₂)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Farqlash belgisi:</span>
                  <span className="text-green-400">2 ta Co-Cl cho'qqi</span>
                </div>
              </div>
            </div>

            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-3">Trans izomer (binafsha-yashil, D₄ₕ)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">ν(Co-Cl):</span>
                  <span className="text-pink-400 font-mono">325 cm⁻¹ (1 ta cho'qqi)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Simmetriya:</span>
                  <span className="text-pink-400">D₄ₕ (alternativa taqiq bor)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">IQ faol modlar:</span>
                  <span className="text-pink-400">Kam (A₂ᵤ, Eᵤ)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Farqlash belgisi:</span>
                  <span className="text-pink-400">1 ta Co-Cl cho'qqi</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Farqlash usuli:</strong> Sis izomerda Co-Cl cho'qqilari <strong>330 va 310 cm⁻¹</strong> (2 ta cho'qqi). 
              Trans izomerda faqat <strong>325 cm⁻¹</strong> (1 ta cho'qqi). 
              Bu sis/trans izomerlarni IQ orqali farqlashning asosiy belgisi!
            </p>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Alternativa taqiq:</strong> D₄ₕ da inversiya markazi mavjud — ba'zi modlar faqat IQ yoki Raman faol. 
              C₂ᵥ da inversiya yo'q — shuning uchun ko'p modlar ikkalasida ham faol. 
              Bu simmetriya farqining muhim natijasi.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* LABORATORIYA NATIJALARI SOLISHTIRISH */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Laboratoriya natijalari — turli sharoitlarda</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            Quyidagi jadval <strong className="text-green-400">turli sharoitlarda</strong> olingan natijalarni ko'rsatadi.
            Har bir texnika o'ziga xos natija beradi — sis/trans farqlash uchun muhim.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">ID</th>
                  <th className="py-3 px-4 text-purple-300">Texnika</th>
                  <th className="py-3 px-4 text-purple-300">Sharoit</th>
                  <th className="py-3 px-4 text-purple-300">ν(N-H)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Co-N)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Co-Cl)</th>
                  <th className="py-3 px-4 text-purple-300">Sifat</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {labResults.map((result) => (
                  <tr 
                    key={result.id}
                    onClick={() => setActiveLabResult(result.id)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeLabResult === result.id ? 'bg-green-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-cyan-400">{result.id}</td>
                    <td className="py-3 px-4 font-bold">{result.technique}</td>
                    <td className="py-3 px-4 text-xs">{result.condition}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_nuNH}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_CoN}</td>
                    <td className="py-3 px-4 font-mono text-green-400">{result.freq_CoCl}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'Yaxshi' ? 'bg-yellow-600/30 text-yellow-400' :
                        result.quality === 'Tasdiqlovchi test' ? 'bg-blue-600/30 text-blue-400' :
                        result.quality === 'Farqlash testi' ? 'bg-pink-600/30 text-pink-400' :
                        'bg-red-600/30 text-red-400'
                      }`}>
                        {result.quality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan natija izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {currentLabResult.notes}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* HALAQIT BERUVCHI OMILLAR */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚠️ IQ tahliliga halaqit beruvchi omillar</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            IQ spektroskopiyada <strong className="text-green-400">bir nechta omillar</strong> natijalarga ta'sir ko'rsatadi.
            Quyidagi jadval asosiy halaqit beruvchi omillarni va ularning yechimlarini ko'rsatadi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Manba</th>
                  <th className="py-3 px-4 text-purple-300">Chastota oralig'i</th>
                  <th className="py-3 px-4 text-purple-300">Ta'sir</th>
                  <th className="py-3 px-4 text-purple-300">Jiddiylik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {interferences.map((interference, i) => (
                  <tr 
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeInterference === i ? 'bg-green-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold">{interference.source}</td>
                    <td className="py-3 px-4 font-mono text-cyan-400">{interference.freqRange}</td>
                    <td className="py-3 px-4 text-xs">{interference.effect}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        interference.severity === 'Yuqori' ? 'bg-red-600/30 text-red-400' :
                        interference.severity === 'O\'rta' ? 'bg-yellow-600/30 text-yellow-400' :
                        'bg-green-600/30 text-green-400'
                      }`}>
                        {interference.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning yechimi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {interferences[activeInterference].solution}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TEXNIKALAR SOLISHTIRISHI */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Texnikalar solishtirishi — qaysi texnika qanday natija beradi</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            IQ spektroskopiyada <strong className="text-green-400">4 ta asosiy texnika</strong> mavjud.
            Har bir texnika o'ziga xos afzallik va kamchiliklarga ega.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {techniques.map((tech, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTechnique === i
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-green-400 font-bold mb-3">{techniques[activeTechnique].name}</h3>
            <p className="text-purple-200 text-sm mb-4">
              {techniques[activeTechnique].description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2">✓ Afzalliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {techniques[activeTechnique].advantages.map((adv, i) => (
                    <li key={i}>• {adv}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2">✗ Kamchiliklar:</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {techniques[activeTechnique].disadvantages.map((dis, i) => (
                    <li key={i}>• {dis}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Eng yaxshi:</div>
                <div className="text-white text-xs">{techniques[activeTechnique].bestFor}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Chastota oralig'i:</div>
                <div className="text-white text-xs">{techniques[activeTechnique].freqRange}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Ruxsat:</div>
                <div className="text-white text-xs">{techniques[activeTechnique].resolution}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Namuna tayyorlash:</div>
                <div className="text-white text-xs">{techniques[activeTechnique].samplePrep}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* GURUH NAZARIYASI — C₂ᵥ/D₄ₕ SIMMETRIYA */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Guruh nazariyasi tahlili — C₂ᵥ/D₄ₕ simmetriya</h2>
          
          <p className="text-purple-200 leading-relaxed">
            [Co(NH₃)₄Cl₂]⁺ ikkita simmetriyaga ega: <strong className="text-green-400">C₂ᵥ (sis)</strong> va 
            <strong className="text-pink-400"> D₄ₕ (trans)</strong>. Bu IQ spektrga sezilarli ta'sir ko'rsatadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">C₂ᵥ (sis izomer)</h3>
              <p className="text-purple-200 text-sm mb-3">
                <strong>ML₄X₂ (sis, C₂ᵥ):</strong> Γ<sub>teb</sub> = 4A₁ + 2A₂ + 3B₁ + 3B₂
              </p>
              <div className="space-y-2 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-green-400 font-bold">IQ-faol:</span>
                  <span className="text-purple-200"> 4A₁ + 3B₁ + 3B₂ (10 mod)</span>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-blue-400 font-bold">Raman-faol:</span>
                  <span className="text-purple-200"> 4A₁ + 2A₂ + 3B₁ + 3B₂</span>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-green-400 font-bold">IQ + Raman:</span>
                  <span className="text-purple-200"> 4A₁ + 3B₁ + 3B₂ (alternativa taqiq YO'Q!)</span>
                </div>
              </div>
            </div>

            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-3">D₄ₕ (trans izomer)</h3>
              <p className="text-purple-200 text-sm mb-3">
                <strong>ML₄X₂ (trans, D₄ₕ):</strong> Γ<sub>teb</sub> = 2A₁g + A₂g + B₁g + B₂g + A₂ᵤ + 3Eᵤ + 2E_g
              </p>
              <div className="space-y-2 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-green-400 font-bold">IQ-faol:</span>
                  <span className="text-purple-200"> A₂ᵤ + 3Eᵤ (4 mod)</span>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-blue-400 font-bold">Raman-faol:</span>
                  <span className="text-purple-200"> 2A₁g + B₁g + B₂g + 2E_g</span>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-pink-400 font-bold">Alternativa taqiq:</span>
                  <span className="text-purple-200"> BOR! (D₄ₕ da inversiya mavjud)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Farqning sababi:</strong> C₂ᵥ da inversiya markazi <strong>YO'Q</strong> — 
              shuning uchun A₁, B₁, B₂ modlari IQ va Raman ikkalasida ham faol!
              D₄ₕ da inversiya <strong>MAVJUD</strong> — alternativa taqiq amal qiladi.
            </p>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Co-Cl cho'qqilari:</strong> Sis da <strong>330 va 310 cm⁻¹</strong> (2 ta cho'qqi, B₁ va A₁). 
              Trans da faqat <strong>325 cm⁻¹</strong> (1 ta cho'qqi, A₂ᵤ). 
              Bu sis/trans farqlashning asosiy belgisi!
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* KRISTALL MAYDON NAZARIYASI — CFSE HISOBLAGICH */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🎨 Kristall maydon nazariyasi — CFSE hisoblagich</h2>
          
          <p className="text-purple-200 leading-relaxed">
            Co³⁺ (d⁶) <strong className="text-green-400">kuchli maydon ligandlari</strong> (NH₃, Cl⁻) bilan 
            quyi spinli kompleks hosil qiladi. Bu diamagnetizm va inertlikning sababi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-3">Elektron konfiguratsiya</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Co atomi:</span>
                  <span className="text-white font-mono">[Ar] 3d⁷ 4s²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Co³⁺ ioni:</span>
                  <span className="text-white font-mono">[Ar] 3d⁶</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Kristall maydon:</span>
                  <span className="text-white font-mono">t₂g⁶ e<sub>g</sub>⁰</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Toq elektron:</span>
                  <span className="text-white font-mono">0 (diamagnit)</span>
                </div>
              </div>
            </div>

            {/* CFSE HISOBLAGICH */}
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">CFSE hisoblagich</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-purple-400 mb-1">Δ<sub>o</sub> (cm⁻¹):</label>
                  <input
                    type="number"
                    value={calcDq}
                    onChange={(e) => setCalcDq(Number(e.target.value))}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-2 text-white font-mono focus:border-yellow-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-400 mb-1">P (juftlashish energiyasi, cm⁻¹):</label>
                  <input
                    type="number"
                    value={calcP}
                    onChange={(e) => setCalcP(Number(e.target.value))}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-2 text-white font-mono focus:border-yellow-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-400 mb-1">d-elektron soni:</label>
                  <input
                    type="number"
                    value={calcN}
                    onChange={(e) => setCalcN(Number(e.target.value))}
                    className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-2 text-white font-mono focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">CFSE:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{cfseResult.cfse} cm⁻¹</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">CFSE (kJ/mol):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{cfseResult.cfseKJ}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">μ<sub>eff</sub> (spin-only):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{muResult.mu} μ<sub>B</sub></div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono mt-3">
              CFSE = -2.4Δ<sub>o</sub> + 2P (d⁶ quyi spin) • μ = √(n(n+2)) μ<sub>B</sub>
            </p>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-blue-300 text-sm">
              <strong>Inertlik sababi:</strong> Co³⁺ (d⁶, quyi spin, t₂g⁶) — barcha t₂g orbitallar to'lgan. 
              Bu inert kompleksni anglatadi — ligand almashinishi juda sekin (kunlar-oylar). 
              Shuning uchun IQ spektrda aniq cho'qqilar ko'rinadi.
            </p>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
            <p className="text-green-300 text-sm">
              <strong>Kristall rangi:</strong> [Co(NH₃)₄Cl₂]⁺ <strong>yashil (praseo)</strong> rangda (sis izomer). 
              Bu d-d o'tish (t₂g → e<sub>g</sub>) natijasida qizil-binafsha nur yutilishi bilan bog'liq. 
              δ<sub>o</sub> ≈ 21500 cm⁻¹ (~465 nm) — qizil nur yutiladi, yashil nur qaytadi.
              2 ta Cl⁻ NH₃ dan kuchsizroq maydon ligand — shuning uchun Δo [Co(NH₃)₆]³⁺ (23000 cm⁻¹) dan past.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* WERNER QATORI — TAQQOSLASH */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚖️ Werner koordinatsion qatori</h2>
          
          <p className="text-purple-200 leading-relaxed">
            Werner 1893-yilda kobalt(III) ammin komplekslarini o'rganib, 
            <strong className="text-green-400"> koordinatsion nazariyani</strong> isbotladi. 
            Bu 4 ta klassik kompleks — luteo, purpureo, praseo va violeo.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th>
                  <th className="py-3 px-4 text-purple-300">Rang</th>
                  <th className="py-3 px-4 text-purple-300">ν(Co-N)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Co-Cl)</th>
                  <th className="py-3 px-4 text-purple-300">Ichki Cl</th>
                  <th className="py-3 px-4 text-purple-300">Cho'kadigan Cl</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-yellow-400">[Co(NH₃)₆]Cl₃</td>
                  <td className="py-3 px-4 text-yellow-300">Sariq (Luteo)</td>
                  <td className="py-3 px-4 font-mono">500</td>
                  <td className="py-3 px-4 font-mono text-gray-500">—</td>
                  <td className="py-3 px-4">0</td>
                  <td className="py-3 px-4 text-red-400">3 (barchasi)</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-pink-400">[Co(NH₃)₅Cl]Cl₂</td>
                  <td className="py-3 px-4 text-pink-300">Binafsha (Purpureo)</td>
                  <td className="py-3 px-4 font-mono">490</td>
                  <td className="py-3 px-4 font-mono text-pink-400">330</td>
                  <td className="py-3 px-4 text-orange-400">1</td>
                  <td className="py-3 px-4 text-yellow-400">2</td>
                </tr>
                <tr className="border-b border-purple-800/30 bg-green-900/20">
                  <td className="py-3 px-4 font-bold text-green-400">[Co(NH₃)₄Cl₂]Cl</td>
                  <td className="py-3 px-4 text-green-300">Yashil (Praseo)</td>
                  <td className="py-3 px-4 font-mono">495</td>
                  <td className="py-3 px-4 font-mono text-green-400">330, 310 ⚠</td>
                  <td className="py-3 px-4 text-orange-400">2</td>
                  <td className="py-3 px-4 text-orange-400">1</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-purple-500">[Co(NH₃)₃Cl₃]</td>
                  <td className="py-3 px-4 text-purple-300">Binafsha (Violeo)</td>
                  <td className="py-3 px-4 font-mono">490</td>
                  <td className="py-3 px-4 font-mono text-purple-400">330</td>
                  <td className="py-3 px-4 text-orange-400">3</td>
                  <td className="py-3 px-4 text-green-400">0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
            <p className="text-green-300 text-sm">
              <strong>Werner tajribasi:</strong> AgNO₃ qo'shilganda:
              <br/>• Luteo: <strong>3 ta Cl⁻ cho'kadi</strong> → 3AgCl
              <br/>• Purpureo: <strong>2 ta Cl⁻ cho'kadi</strong> → 2AgCl
              <br/>• Praseo: <strong>1 ta Cl⁻ cho'kadi</strong> → AgCl
              <br/>• Violeo: <strong>0 ta Cl⁻ cho'kadi</strong> (barchasi ichki sferada)
            </p>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Muhim xulosa:</strong> Werner bu tajriba orqali koordinatsion son 6 ekanligini 
              va ligandlar ichki/tashqi sferada bo'lishi mumkinligini isbotladi. 
              Bu zamonaviy koordinatsion kimyoning asosi. Werner 1913-yilda Nobel mukofotini oldi.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* XULOSA */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-green-400">ν(Co-Cl) = 330, 310 cm⁻¹</strong> — ichki sfera 2 ta Cl⁻ ning belgisi, Verner nazariyasining IQ tasdig'i</li>
            <li>Co³⁺ (d⁶, QS) — <strong>inert kompleks</strong>, diamagnit, barcha elektronlar juftlangan</li>
            <li><strong>ν(Co-N) = 495 cm⁻¹</strong> — metall-ligand bog'i mustahkamligini ko'rsatadi</li>
            <li>C₂ᵥ simmetriya (sis) — <strong>alternativa taqiq yo'q</strong> (IQ = Raman ba'zi modlar uchun)</li>
            <li>Verner nazariyasi — <strong>2 ta Cl⁻ ichki sferada</strong>, 1 ta Cl⁻ tashqi sferada</li>
            <li>Sis/trans farqlash — <strong>Co-Cl cho'qqilari soni</strong> orqali</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-nh3-3-cl3" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            [Co(NH₃)₃Cl₃] →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₄Cl₂]Cl (Praseo-kobalt) • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Nakamoto (Infrared and Raman Spectra), Werner (1893, Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}