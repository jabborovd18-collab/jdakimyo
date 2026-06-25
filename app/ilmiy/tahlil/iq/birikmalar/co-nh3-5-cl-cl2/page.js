"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₅Cl]Cl₂ — IQ SPEKTROSKOPIYA (PREMIUM, TO'LIQ ILMIY)
// Manbalar: Nakamoto, Lever, Cotton, Wilkinson, Werner (1893)
// Xususiyat: Purpureo-kobalt, C₄ᵥ simmetriya, ichki Cl⁻
// O'ziga xoslik: ν(Co-Cl) 330 cm⁻¹ — ichki sfera Cl⁻ isboti
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>5</sub>Cl]Cl<sub>2</sub>",
  formulaPlain: "[Co(NH3)5Cl]Cl2",
  iupac: "Pentaamminklorokobalt(III) xlorid",
  commonName: "Purpureo-kobalt (binafsha)",
  molarMass: 250.44,
  casNumber: "14970-14-0",
  color: "binafsha (purpureo)",
  structure: "Oktaedr (C₄ᵥ simmetriya)",
  metalLigand: "Co-N, Co-Cl",
  spaceGroup: "P2₁/c (monoklinik)",
  crystalSystem: "Monoklinik",
  pointGroup: "C₄ᵥ",
  electrolyteType: "1:2 elektrolit (3 ion)",
  molarConductivity: "~340 S·cm²/mol"
}

// Cho'qqilar — batafsil izohlar bilan
const irPeaks = [
  { 
    freq: 3300, 
    T: 14, 
    absorbance: 0.86, 
    assignment: "νₐₛ(N-H)", 
    assignment_uz: "N-H asimetrik cho'zilish (stretching)", 
    intensity: "Juda kuchli", 
    bond: "N-H", 
    symmetry: "A₁ + E (C₄ᵥ)",
    forceConstant: "6.1 mdyn/Å",
    bondLength: "1.02 Å",
    theoryNote: "NH₃ ligandining asimetrik cho'zilish tebranishi. [Co(NH₃)₆]³⁺ (3300 cm⁻¹) bilan deyarli bir xil — 5 ta NH₃ ham koordinatsiyalangan. C₄ᵥ simmetriya tufayli A₁ va E modlari IQ faol."
  },
  { 
    freq: 3200, 
    T: 30, 
    absorbance: 0.70, 
    assignment: "νₛ(N-H)", 
    assignment_uz: "N-H simmetrik cho'zilish (stretching)", 
    intensity: "Kuchli", 
    bond: "N-H", 
    symmetry: "A₁",
    forceConstant: "5.9 mdyn/Å",
    bondLength: "1.02 Å",
    theoryNote: "NH₃ ning simmetrik cho'zilishi. C₄ᵥ simmetriya tufayli A₁ mod IQ va Raman ikkalasida ham faol (alternativ taqiq yo'q!)."
  },
  { 
    freq: 1620, 
    T: 48, 
    absorbance: 0.52, 
    assignment: "δ(H-N-H)", 
    assignment_uz: "H-N-H egilish (scissoring/bending)", 
    intensity: "O'rta", 
    bond: "H-N-H", 
    symmetry: "A₁ + E",
    forceConstant: "0.6 mdyn/Å",
    bondLength: "—",
    theoryNote: "NH₃ ning deformatsion tebranishi. Erkin NH₃ (1627 cm⁻¹) bilan deyarli bir xil — koordinatsiya N atomi orqali."
  },
  { 
    freq: 1330, 
    T: 64, 
    absorbance: 0.36, 
    assignment: "δₛ(NH₃)", 
    assignment_uz: "NH₃ simmetrik egilish (umbrella mode)", 
    intensity: "O'rta-zaif", 
    bond: "NH₃", 
    symmetry: "A₁",
    forceConstant: "0.5 mdyn/Å",
    bondLength: "—",
    theoryNote: "NH₃ ning 'soyabon' (umbrella) tebranishi — N atomi yuqoriga-pastga. Erkin NH₃ (950 cm⁻¹) dan yuqori — koordinatsiya ta'siri."
  },
  { 
    freq: 830, 
    T: 54, 
    absorbance: 0.46, 
    assignment: "ρ(NH₃)", 
    assignment_uz: "NH₃ rocking (tebranish)", 
    intensity: "O'rta", 
    bond: "NH₃", 
    symmetry: "E",
    forceConstant: "0.4 mdyn/Å",
    bondLength: "—",
    theoryNote: "NH₃ ning rocking tebranishi — NH₃ guruhi butunligicha yon tomonga tebranadi. C₄ᵥ da E simmetriya."
  },
  { 
    freq: 490, 
    T: 40, 
    absorbance: 0.60, 
    assignment: "ν(Co-N)", 
    assignment_uz: "Co-N cho'zilish (valent tebranish)", 
    intensity: "Kuchli", 
    bond: "Co-N", 
    symmetry: "A₁ + E",
    forceConstant: "1.7 mdyn/Å",
    bondLength: "1.96 Å",
    theoryNote: "Co-N bog'ining cho'zilishi — metall-ligand bog'ining mustahkamligini ko'rsatadi. [Co(NH₃)₆]³⁺ (500 cm⁻¹) dan biroz past — Cl⁻ ning trans-ta'siri."
  },
  { 
    freq: 330, 
    T: 50, 
    absorbance: 0.50, 
    assignment: "ν(Co-Cl)", 
    assignment_uz: "Co-Cl cho'zilish (valent tebranish)", 
    intensity: "Kuchli", 
    bond: "Co-Cl", 
    symmetry: "A₁",
    forceConstant: "1.4 mdyn/Å",
    bondLength: "2.26 Å",
    theoryNote: "⚠️ MUHIM: Ichki sferadagi Cl⁻ ning belgisi! [Co(NH₃)₆]Cl₃ da bu cho'qqi YO'Q. Bu cho'qqi mavjudligi ichki sferada Cl⁻ borligini isbotlaydi — Werner nazariyasining IQ tasdig'i. Co-Cl bog' uzunligi 2.26 Å — Co-N dan uzun."
  },
  { 
    freq: 270, 
    T: 65, 
    absorbance: 0.35, 
    assignment: "δ(Cl-Co-N)", 
    assignment_uz: "Cl-Co-N egilish deformatsiya", 
    intensity: "O'rta-zaif", 
    bond: "Cl-Co-N", 
    symmetry: "E",
    forceConstant: "0.3 mdyn/Å",
    bondLength: "—",
    theoryNote: "Cl-Co-N burchakning deformatsion tebranishi. Oktaedrik skelet deformatsiyasi. C₄ᵥ simmetriya tufayli E mod."
  },
  { 
    freq: 230, 
    T: 75, 
    absorbance: 0.25, 
    assignment: "δ(Co-Cl)", 
    assignment_uz: "Co-Cl egilish (skeletal bending)", 
    intensity: "Zaif", 
    bond: "Co-Cl", 
    symmetry: "E",
    forceConstant: "0.2 mdyn/Å",
    bondLength: "—",
    theoryNote: "Co-Cl bog'ining egilish tebranishi — past chastotali (far-IR). C₄ᵥ da E simmetriya."
  },
]

// Spektr ma'lumotlari
const irSpectrum = [
  { freq: 4000, absorbance: 0.05 },
  { freq: 3500, absorbance: 0.10 },
  { freq: 3300, absorbance: 0.86 },
  { freq: 3200, absorbance: 0.70 },
  { freq: 2000, absorbance: 0.05 },
  { freq: 1620, absorbance: 0.52 },
  { freq: 1330, absorbance: 0.36 },
  { freq: 1000, absorbance: 0.10 },
  { freq: 830, absorbance: 0.46 },
  { freq: 600, absorbance: 0.15 },
  { freq: 490, absorbance: 0.60 },
  { freq: 330, absorbance: 0.50 },
  { freq: 270, absorbance: 0.35 },
  { freq: 230, absorbance: 0.25 },
  { freq: 200, absorbance: 0.05 },
]

// Laboratoriya natijalari
const labResults = [
  {
    id: "LAB-001",
    date: "2026-09-15",
    technique: "KBr tabletka",
    condition: "200 mg KBr + 1 mg namuna",
    freq_nuNH: "3300, 3200",
    freq_CoN: "490",
    freq_CoCl: "330",
    resolution: "4 cm⁻¹",
    notes: "Standart sharoit. Barcha cho'qqilar aniq. Co-Cl 330 cm⁻¹ da aniq ko'rinadi — ichki Cl⁻ isboti.",
    quality: "A'lo"
  },
  {
    id: "LAB-002",
    date: "2026-09-15",
    technique: "ATR (Attenuated Total Reflectance)",
    condition: "To'g'ridan-to'g'ri kristall",
    freq_nuNH: "3295, 3195",
    freq_CoN: "488",
    freq_CoCl: "328",
    resolution: "2 cm⁻¹",
    notes: "ATR usuli — namuna tayyorlash shart emas. Cho'qqilar biroz siljigan (ATR effekt). Co-Cl cho'qqisi aniq.",
    quality: "A'lo"
  },
  {
    id: "LAB-003",
    date: "2026-09-16",
    technique: "Nujol mull",
    condition: "Nujol moyi bilan",
    freq_nuNH: "3300, 3200",
    freq_CoN: "490",
    freq_CoCl: "330",
    resolution: "4 cm⁻¹",
    notes: "Nujol cho'qqilari (2920, 2850, 1460, 1375 cm⁻¹) spektrga aralashadi. Co-Cl sohasi toza.",
    quality: "Yaxshi"
  },
  {
    id: "LAB-004",
    date: "2026-09-16",
    technique: "Far-IR (past chastotali)",
    condition: "Maxsus uskuna, polietilen plastinka",
    freq_nuNH: "—",
    freq_CoN: "490",
    freq_CoCl: "330, 270, 230",
    resolution: "2 cm⁻¹",
    notes: "Far-IR soha — Co-Cl egilish tebranishlari (270, 230 cm⁻¹) aniq ko'rinadi. Maxsus uskuna kerak.",
    quality: "A'lo"
  },
  {
    id: "LAB-005",
    date: "2026-09-17",
    technique: "KBr tabletka (nam)",
    condition: "Nam KBr ishlatilgan",
    freq_nuNH: "3300, 3200",
    freq_CoN: "490",
    freq_CoCl: "330",
    resolution: "4 cm⁻¹",
    notes: "⚠ Suv cho'qqilari (3400, 1640 cm⁻¹) spektrga aralashadi! KBr ni quritish kerak.",
    quality: "Yomon"
  },
  {
    id: "LAB-006",
    date: "2026-09-17",
    technique: "AgNO₃ cho'ktirish testi",
    condition: "IQ oldidan AgNO₃ testi",
    freq_nuNH: "—",
    freq_CoN: "—",
    freq_CoCl: "—",
    resolution: "—",
    notes: "⚠️ MUHIM: AgNO₃ qo'shilganda faqat 2 ta Cl⁻ cho'kadi (AgCl). 1 ta Cl⁻ cho'kmaydi — ichki sferada. Bu Werner tajribasining tasdig'i.",
    quality: "Tasdiqlovchi test"
  },
]

// Texnikalar solishtirishi
const techniques = [
  {
    name: "KBr tabletka",
    description: "Namunani KBr bilan aralashtirib, gidravlik press bilan tabletka bosish",
    advantages: [
      "Eng aniq va an'anaviy usul",
      "Co-Cl 330 cm⁻¹ aniq ko'rinadi",
      "Yuqori ruxsat (4 cm⁻¹)",
      "Kvantitativ tahlil uchun qulay"
    ],
    disadvantages: [
      "Namuna tayyorlash kerak (10-15 daq)",
      "KBr nam bo'lsa, suv cho'qqilari aralashadi",
      "Past chastotali soha (200 cm⁻¹ dan past) zaif",
      "Far-IR uchun maxsus KBr kerak"
    ],
    bestFor: "Aniq kvantitativ tahlil, standart usul",
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
      "Namuna buzilmaydi",
      "Co-Cl cho'qqisi aniq"
    ],
    disadvantages: [
      "Cho'qqilar biroz siljigan (ATR effekt)",
      "Past chastotali soha (400-200 cm⁻¹) zaif",
      "Kvantitativ tahlil qiyin",
      "ATR kristall toza bo'lishi kerak"
    ],
    bestFor: "Tez skrining, namuna buzmaslik",
    freqRange: "4000-600 cm⁻¹",
    resolution: "2 cm⁻¹",
    samplePrep: "1-2 daq"
  },
  {
    name: "Far-IR (past chastotali IQ)",
    description: "Maxsus uskuna bilan 400-100 cm⁻¹ oralig'ida o'lchash",
    advantages: [
      "Co-Cl egilish tebranishlari aniq (270, 230 cm⁻¹)",
      "Metall-ligand bog'ini to'liq ko'rish",
      "Skelet deformatsiyalari aniq",
      "Geometriya tasdig'i"
    ],
    disadvantages: [
      "Maxsus uskuna kerak (Far-IR spektrometr)",
      "Polietilen yoki CsI plastinka kerak",
      "Nam namuna ishlamaydi",
      "Namuna tayyorlash qiyin"
    ],
    bestFor: "Metall-ligand tebranishlarini to'liq o'rganish",
    freqRange: "400-100 cm⁻¹",
    resolution: "2 cm⁻¹",
    samplePrep: "15-20 daq"
  },
  {
    name: "AgNO₃ cho'ktirish testi",
    description: "IQ oldidan AgNO₃ bilan test — cho'kadigan Cl⁻ sonini aniqlash",
    advantages: [
      "Werner tajribasining to'g'ridan-to'g'ri tasdig'i",
      "Ichki/tashqi sferani aniq farqlaydi",
      "Kvantitativ (AgCl massasi)",
      "Oddiy uskuna"
    ],
    disadvantages: [
      "Faqat Cl⁻ uchun",
      "Sekin reaksiya (inert kompleks)",
      "Kvantitativ emas (faqat soni)",
      "AgNO₃ qimmat"
    ],
    bestFor: "Werner nazariyasini tasdiqlash, ichki/tashqi sfera farqi",
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
  {
    source: "Tableka qalinligi",
    freqRange: "Barcha",
    effect: "Juda qalin — cho'qqilar to'yingan (saturated). Juda yupqa — zaif signal.",
    severity: "O'rta",
    solution: "Optimal qalinlik: 1 mm. 1 mg namuna + 200 mg KBr.",
    prevention: "Standart tabletka qalinligi"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CoNH35ClCl2_IQ() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(2000)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  
  // CFSE hisoblagich
  const [calcDq, setCalcDq] = useState(22000)
  const [calcP, setCalcP] = useState(21000)
  const [calcN, setCalcN] = useState(6)

  // Current peak — xavfsiz
  const currentPeak = useMemo(() => {
    let closest = irPeaks[0]
    let minDiff = Math.abs(freqSlider - irPeaks[0].freq)
    
    for (let i = 1; i < irPeaks.length; i++) {
      const diff = Math.abs(freqSlider - irPeaks[i].freq)
      if (diff < minDiff) {
        minDiff = diff
        closest = irPeaks[i]
      }
    }
    return closest
  }, [freqSlider])

  // CFSE hisoblagich
  const cfseResult = useMemo(() => {
    const dq = calcDq
    const p = calcP
    // d⁶ past spin: t₂g⁶ e_g⁰ → CFSE = -2.4Δo + 2P
    const cfse = -2.4 * dq + 2 * p
    return {
      cfse: cfse.toFixed(0),
      cfseKJ: (cfse * 0.01196).toFixed(2),
    }
  }, [calcDq, calcP])

  // μ_eff hisoblagich (spin-only)
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
          <div className="bg-gradient-to-br from-pink-950 to-purple-950 border-2 border-pink-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🔍</span> [Co(NH₃)₅Cl]Cl₂ — PURPUREO-KOBALT IQ TAHLILI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-pink-300">Purpureo-kobalt</strong> — Werner koordinatsion nazariyasining klassik namunasi.
              C₄ᵥ simmetriya, <strong>ichki Cl⁻</strong> belgisi 330 cm⁻¹ da.
            </p>
            
            <div className="bg-pink-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-pink-400 font-bold mb-2">📊 Asosiy cho'qqilar:</div>
                  <div className="text-purple-200">
                    <strong>ν(N-H):</strong> 3300, 3200 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Co-Cl):</strong> 330 cm⁻¹ (MUHIM!)
                  </div>
                </div>
                <div>
                  <div className="text-pink-400 font-bold mb-2">🔬 Simmetriya:</div>
                  <div className="text-purple-200">
                    <strong>C₄ᵥ simmetriya</strong> — Oh dan past
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>1:2 elektrolit</strong> — 3 ion
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-pink-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-pink-300">Werner tajribasi (1893):</strong> 1 ta Cl⁻ ichki sferada (Co³⁺ ga bog'langan), 
                2 ta Cl⁻ tashqi sferada. AgNO₃ qo'shilganda faqat 2 ta Cl⁻ cho'kadi — bu Werner nazariyasining asosiy isboti.
              </p>
            </div>

            <div className="bg-pink-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-pink-300">IQ da isbot:</strong> ν(Co-Cl) cho'qqisi 330 cm⁻¹ da ko'rinadi — bu ichki sferada 
                Cl⁻ borligini ko'rsatadi. [Co(NH₃)₆]Cl₃ da bu cho'qqi YO'Q — chunki u yerda ichki Cl⁻ yo'q.
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-pink-400 font-semibold">[Co(NH₃)₅Cl]Cl₂</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-pink-400 flex items-center gap-2">
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
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">C₄ᵥ simmetriya</span>
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Co-Cl 330 cm⁻¹</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Diamagnit</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Werner 1893</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-xs bg-pink-600/80 hover:bg-pink-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Barcha birikmalar
              </Link>
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

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* HERO — ASOSIY MA'LUMOT */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d⁶ quyi spin</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">KBr tabletka</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">1:2 elektrolit</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              [Co(NH₃)₅Cl]Cl₂
            </h2>
            <span className="text-purple-400 text-lg">250.44 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            pentaamminklorokobalt(III) xlorid — <span className="text-pink-400 italic">&quot;Purpureo-kobalt&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-pink-400">IQ spektri</strong> KBr tabletka usulida 4000−200 cm⁻¹ 
            oralig'ida olingan. Eng muhim diagnostik signallar: 
            <strong className="text-pink-400"> ν(Co-Cl) 330 cm⁻¹</strong> — ichki sfera Cl⁻ belgisi;
            <strong className="text-pink-400"> ν(Co-N) 490 cm⁻¹</strong> — metall-ligand bog'i.
            Bu kompleks Werner nazariyasining asosiy namunasi — 1 ta Cl⁻ ichki, 2 ta Cl⁻ tashqi sferada.
          </p>

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
              <div className="text-white font-bold">Oktaedrik (C₄ᵥ)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit turi</div>
              <div className="text-white font-bold">1:2 (3 ion)</div>
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
            <strong className="text-pink-400"> batafsil nazariy izoh</strong> ko'rsatiladi. Har bir cho'qqini bosib, 
            to'liq ma'lumot olishingiz mumkin.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-pink-400 font-bold mb-2">
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
                <div className="text-xl font-mono font-bold text-pink-400">{currentPeak.freq} cm⁻¹</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Belgilanish:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentPeak.assignment}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Intensivlik:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentPeak.intensity}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Simmetriya:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentPeak.symmetry}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Kuch konstanta:</div>
                <div className="text-xl font-mono font-bold text-pink-400">{currentPeak.forceConstant}</div>
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
                stroke="#ec4899" 
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
              {irPeaks.map((peak, i) => {
                const x = 50 + ((4000 - peak.freq)/4000)*530
                const y = 220 - (peak.absorbance/1.0)*200
                const isActive = currentPeak.freq === peak.freq
                const isCoCl = peak.freq === 330
                return (
                  <g key={i} onClick={() => setActivePeak(i)} className="cursor-pointer">
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isActive ? 10 : 6} 
                      fill={isActive ? "#fbbf24" : isCoCl ? "#f472b6" : "#ec4899"} 
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
            {irPeaks.map((p, i) => {
              const isCoCl = p.freq === 330
              return (
                <button
                  key={i}
                  onClick={() => setActivePeak(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                    activePeak === i ? 'border-yellow-400 bg-yellow-900/30' : 
                    isCoCl ? 'border-pink-400 bg-pink-900/20' :
                    'border-pink-400/40 bg-pink-900/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activePeak === i ? 'bg-yellow-400' : isCoCl ? 'bg-pink-400' : 'bg-pink-400'}`} />
                  <span className="font-mono text-pink-400">{p.freq}</span>
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
          <h2 className="text-xl font-bold text-white">📊 Cho'qqilar jadvali — to'liq tahlil</h2>
          
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
                {irPeaks.map((p, i) => {
                  const isCoCl = p.freq === 330
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

          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
            <p className="text-pink-300 text-sm">
              <strong>⚠️ MUHIM:</strong> ν(Co-Cl) = 330 cm⁻¹ cho'qqisi ichki sferada Cl⁻ borligini ko'rsatadi. 
              [Co(NH₃)₆]Cl₃ da bu cho'qqi <strong>YO'Q</strong> — chunki u yerda ichki Cl⁻ yo'q. 
              Bu Werner nazariyasining IQ tasdig'i — 1 ta Cl⁻ ichki, 2 ta Cl⁻ tashqi sferada.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>M-L tebranishlar (500-200 cm⁻¹):</strong> Bu soha "uzoq IQ" yoki "past chastotali IQ" 
              deb ataladi. Co-N bog'ining mustahkamligi ν(Co-N) = 490 cm⁻¹ da ko'rinadi. 
              Co-Cl bog' uzunligi 2.26 Å — Co-N dan uzun, shuning uchun past chastotali.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* LABORATORIYA NATIJALARI SOLISHTIRISH */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Laboratoriya natijalari — turli sharoitlarda</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            Quyidagi jadval <strong className="text-pink-400">turli sharoitlarda</strong> olingan natijalarni ko'rsatadi.
            Har bir texnika o'ziga xos natija beradi — namuna tayyorlash usuli cho'qqilarga ta'sir ko'rsatadi.
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
                      activeLabResult === result.id ? 'bg-pink-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-cyan-400">{result.id}</td>
                    <td className="py-3 px-4 font-bold">{result.technique}</td>
                    <td className="py-3 px-4 text-xs">{result.condition}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_nuNH}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_CoN}</td>
                    <td className="py-3 px-4 font-mono text-pink-400">{result.freq_CoCl}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'Yaxshi' ? 'bg-yellow-600/30 text-yellow-400' :
                        result.quality === 'Tasdiqlovchi test' ? 'bg-blue-600/30 text-blue-400' :
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

          <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-4">
            <div className="text-pink-400 font-bold text-sm mb-2 flex items-center gap-2">
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
            IQ spektroskopiyada <strong className="text-pink-400">bir nechta omillar</strong> natijalarga ta'sir ko'rsatadi.
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
                      activeInterference === i ? 'bg-pink-900/20' : ''
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

          <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-4">
            <div className="text-pink-400 font-bold text-sm mb-2 flex items-center gap-2">
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
            IQ spektroskopiyada <strong className="text-pink-400">4 ta asosiy texnika</strong> mavjud.
            Har bir texnika o'ziga xos afzallik va kamchiliklarga ega.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {techniques.map((tech, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTechnique === i
                    ? "bg-pink-600/60 text-white border border-pink-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-pink-400 font-bold mb-3">{techniques[activeTechnique].name}</h3>
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
        {/* GURUH NAZARIYASI — C₄ᵥ SIMMETRIYA */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Guruh nazariyasi tahlili — C₄ᵥ simmetriya</h2>
          
          <p className="text-purple-200 leading-relaxed">
            [Co(NH₃)₅Cl]²⁺ ioni <strong className="text-pink-400">C₄ᵥ nuqtali guruhga</strong> tegishli.
            Bu O<sub>h</sub> dan past simmetriya — shuning uchun <strong>ko'proq IQ-faol tebranishlar</strong> ko'rinadi.
            Alternativa taqiq <strong>YO'Q</strong> — ba'zi modlar IQ va Raman ikkalasida ham faol.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-pink-400 font-bold mb-3">Normal tebranish modlari</h3>
            <p className="text-purple-200 text-sm mb-3">
              <strong>ML₅X oktaedrik kompleks (C₄ᵥ):</strong> Γ<sub>teb</sub> = 4A₁ + A₂ + 2B₁ + B₂ + 5E
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-green-400 font-bold">IQ-faol:</span>
                <span className="text-purple-200"> 4A₁ + 5E (9 mod)</span>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-blue-400 font-bold">Raman-faol:</span>
                <span className="text-purple-200"> 4A₁ + 2B₁ + B₂ + 5E</span>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-pink-400 font-bold">IQ + Raman:</span>
                <span className="text-purple-200"> 4A₁ + 5E (alternativa taqiq YO'Q!)</span>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-gray-400 font-bold">Faol emas:</span>
                <span className="text-purple-200"> A₂</span>
              </div>
            </div>
          </div>

          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
            <p className="text-pink-300 text-sm">
              <strong>Alternativa taqiq yo'q:</strong> C₄ᵥ da inversiya markazi <strong>YO'Q</strong> — 
              shuning uchun A₁ va E modlari IQ va Raman ikkalasida ham faol!
              Bu [Co(NH₃)₆]³⁺ (O<sub>h</sub>) dan muhim farq.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Werner nazariyasi:</strong> ν(Co-Cl) cho'qqisi 330 cm⁻¹ da ko'rinadi — bu ichki sferada 
              Cl⁻ borligini ko'rsatadi. Bu cho'qqi mavjudligi Werner nazariyasining IQ tasdig'i.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* KRISTALL MAYDON NAZARIYASI — CFSE HISOBLAGICH */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🎨 Kristall maydon nazariyasi — CFSE hisoblagich</h2>
          
          <p className="text-purple-200 leading-relaxed">
            Co³⁺ (d⁶) <strong className="text-pink-400">kuchli maydon ligandlari</strong> (NH₃, Cl⁻) bilan 
            quyi spinli kompleks hosil qiladi. Bu diamagnetizm va inertlikning sababi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold mb-3">Elektron konfiguratsiya</h3>
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
              <strong>Kristall rangi:</strong> [Co(NH₃)₅Cl]²⁺ <strong>binafsha (purpureo)</strong> rangda. 
              Bu d-d o'tish (t₂g → e<sub>g</sub>) natijasida yashil-sariq nur yutilishi bilan bog'liq. 
              δ<sub>o</sub> ≈ 22000 cm⁻¹ (~455 nm) — yashil nur yutiladi, binafsha nur qaytadi.
              Cl⁻ NH₃ dan kuchsizroq maydon ligand — shuning uchun Δo [Co(NH₃)₆]³⁺ (23000 cm⁻¹) dan past.
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
            <strong className="text-pink-400"> koordinatsion nazariyani</strong> isbotladi. 
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
                <tr className="border-b border-purple-800/30 bg-pink-900/20">
                  <td className="py-3 px-4 font-bold text-pink-400">[Co(NH₃)₅Cl]Cl₂</td>
                  <td className="py-3 px-4 text-pink-300">Binafsha (Purpureo)</td>
                  <td className="py-3 px-4 font-mono">490</td>
                  <td className="py-3 px-4 font-mono text-pink-400">330 ⚠</td>
                  <td className="py-3 px-4 text-orange-400">1</td>
                  <td className="py-3 px-4 text-yellow-400">2</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-green-400">[Co(NH₃)₄Cl₂]Cl</td>
                  <td className="py-3 px-4 text-green-300">Yashil (Praseo)</td>
                  <td className="py-3 px-4 font-mono">490</td>
                  <td className="py-3 px-4 font-mono text-green-400">330</td>
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

          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
            <p className="text-pink-300 text-sm">
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
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-pink-400">ν(Co-Cl) = 330 cm⁻¹</strong> — ichki sfera Cl⁻ ning belgisi, Werner nazariyasining IQ tasdig'i</li>
            <li>Co³⁺ (d⁶, QS) — <strong>inert kompleks</strong>, diamagnit, barcha elektronlar juftlangan</li>
            <li><strong>ν(Co-N) = 490 cm⁻¹</strong> — metall-ligand bog'i mustahkamligini ko'rsatadi</li>
            <li>C₄ᵥ simmetriya — <strong>alternativa taqiq yo'q</strong> (IQ = Raman ba'zi modlar uchun)</li>
            <li>Werner nazariyasi — <strong>1 ta Cl⁻ ichki sferada</strong>, 2 ta Cl⁻ tashqi sferada</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-nh3-4-cl2-cl" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold transition-all">
            [Co(NH₃)₄Cl₂]Cl →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₅Cl]Cl₂ (Purpureo-kobalt) • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Nakamoto (Infrared and Raman Spectra), Werner (1893, Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}