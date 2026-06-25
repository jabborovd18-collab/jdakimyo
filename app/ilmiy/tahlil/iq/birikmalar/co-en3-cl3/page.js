"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(en)₃]Cl₃ — KONDUKTOMETRIK TAHLIL (PREMIUM)
// Manbalar: Nakamoto, Lever, Cotton, Wilkinson, Schwarzenbach (1950)
// Xususiyat: Xelat effekti, D₃ simmetriya, optik izomerlar (Δ/Λ)
// O'ziga xoslik: 1:3 elektrolit (4 ion), Λm ≈ 430, log β₃ ≈ 49
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const COMPOUND = {
  formulaHTML: "[Co(en)<sub>3</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Co(en)3]Cl3",
  iupac: "Tris(etilendiamin)kobalt(III) xlorid",
  formulaExpanded: "CoC₆H₂₄N₆Cl₃",
  commonName: "Tris(etilendiamin)kobalt(III) (sariq-to'q sariq)",
  molarMass: 345.52,
  casNumber: "14878-43-8",
  color: "sariq-to'q sariq (yellow-orange)",
  structure: "Oktaedr (D₃ simmetriya)",
  metalLigand: "Co-N (xelat)",
  spaceGroup: "P3₁21 (trigonal, Δ enantiomer); P3₂21 (Λ enantiomer)",
  crystalSystem: "Trigonal",
  pointGroup: "D₃",
  electrolyteType: "1:3 elektrolit (4 ion)",
  molarConductivity: "~430 S·cm²/mol",
  isomers: {
    delta: { symbol: "Δ", name: "Delta (o'ng qo'l spirali)", chirality: "P3₁21" },
    lambda: { symbol: "Λ", name: "Lambda (chap qo'l spirali)", chirality: "P3₂21" }
  },
  chelateInfo: {
    ligandType: "Bidentat (en = H₂N-CH₂-CH₂-NH₂)",
    ringSize: "5 a'zoli (Co-N-C-C-N)",
    ringCount: 3,
    chelateEffect: "10¹⁴ marta barqarorlik",
    logBeta3: "~49",
    entropyEffect: "ΔS > 0 (entropiya ortishi)"
  }
}

// Cho'qqilar — batafsil
const irPeaks = [
  { 
    freq: 3280, T: 14, absorbance: 0.86, 
    assignment: "νₐₛ(N-H)", assignment_uz: "N-H asimetrik cho'zilish", 
    intensity: "Juda kuchli", bond: "N-H", 
    symmetry: "A + E (D₃)", forceConstant: "6.0 mdyn/Å", bondLength: "1.02 Å",
    theoryNote: "NH₂ ning asimetrik cho'zilishi. D₃ simmetriya tufayli A va E modlari IQ faol. Koordinatsiyalangan NH₂ uchun xos (erkin NH₂ 3330 cm⁻¹)."
  },
  { 
    freq: 3180, T: 30, absorbance: 0.70, 
    assignment: "νₛ(N-H)", assignment_uz: "N-H simmetrik cho'zilish", 
    intensity: "Kuchli", bond: "N-H", 
    symmetry: "A (D₃)", forceConstant: "5.8 mdyn/Å", bondLength: "1.02 Å",
    theoryNote: "NH₂ ning simmetrik cho'zilishi. D₃ da A mod IQ va Raman ikkalasida ham faol (alternativa taqiq yo'q!)."
  },
  { 
    freq: 1580, T: 48, absorbance: 0.52, 
    assignment: "δ(NH₂)", assignment_uz: "NH₂ egilish (scissoring)", 
    intensity: "O'rta", bond: "NH₂", 
    symmetry: "A + E", forceConstant: "0.6 mdyn/Å", bondLength: "—",
    theoryNote: "NH₂ ning deformatsion tebranishi. Erkin NH₂ (1590 cm⁻¹) bilan deyarli bir xil — koordinatsiya N orqali."
  },
  { 
    freq: 1045, T: 60, absorbance: 0.40, 
    assignment: "ν(C-N)", assignment_uz: "C-N cho'zilish (en ligand)", 
    intensity: "Kuchli", bond: "C-N", 
    symmetry: "A + E", forceConstant: "5.2 mdyn/Å", bondLength: "1.48 Å",
    theoryNote: "en ligandining C-N bog'i. Koordinatsiya ta'sirida biroz kuchaygan (erkin en 1040 cm⁻¹)."
  },
  { 
    freq: 660, T: 52, absorbance: 0.48, 
    assignment: "ρ(NH₂)", assignment_uz: "NH₂ rocking (tebranish)", 
    intensity: "O'rta", bond: "NH₂", 
    symmetry: "E", forceConstant: "0.4 mdyn/Å", bondLength: "—",
    theoryNote: "NH₂ ning rocking tebranishi — en ligandining xelat halqasining tebranishi."
  },
  { 
    freq: 510, T: 40, absorbance: 0.62, 
    assignment: "ν(Co-N)", assignment_uz: "Co-N cho'zilish (valent tebranish)", 
    intensity: "Kuchli", bond: "Co-N", 
    symmetry: "A + E (D₃)", forceConstant: "1.8 mdyn/Å", bondLength: "1.95 Å",
    theoryNote: "Co-N bog'ining cho'zilishi. [Co(NH₃)₆]³⁺ (500 cm⁻¹) ga yaqin — xelat effekti bog'ni biroz mustahkamlaydi."
  },
  { 
    freq: 440, T: 50, absorbance: 0.50, 
    assignment: "ν(Co-N) + ring", assignment_uz: "Co-N va halqa deformatsiyasi", 
    intensity: "Kuchli", bond: "Co-N/ring", 
    symmetry: "E", forceConstant: "1.6 mdyn/Å", bondLength: "—",
    theoryNote: "Xelat halqasining deformatsion tebranishi — en ligandining xususiyati."
  },
  { 
    freq: 340, T: 55, absorbance: 0.45, 
    assignment: "δ(N-Co-N)", assignment_uz: "N-Co-N egilish deformatsiya", 
    intensity: "O'rta-zaif", bond: "N-Co-N", 
    symmetry: "A + E", forceConstant: "0.3 mdyn/Å", bondLength: "—",
    theoryNote: "N-Co-N burchakning deformatsiyasi. D₃ simmetriya tufayli ko'p modlar IQ faol."
  },
  { 
    freq: 280, T: 70, absorbance: 0.30, 
    assignment: "δ(Co-N)", assignment_uz: "Co-N egilish (skeletal bending)", 
    intensity: "Zaif", bond: "Co-N", 
    symmetry: "E", forceConstant: "0.2 mdyn/Å", bondLength: "—",
    theoryNote: "Co-N bog'ining egilish tebranishi — past chastotali (far-IR)."
  },
]

// Spektr ma'lumotlari
const irSpectrum = [
  { freq: 4000, absorbance: 0.05 },
  { freq: 3500, absorbance: 0.10 },
  { freq: 3280, absorbance: 0.86 },
  { freq: 3180, absorbance: 0.70 },
  { freq: 2000, absorbance: 0.05 },
  { freq: 1580, absorbance: 0.52 },
  { freq: 1045, absorbance: 0.40 },
  { freq: 800, absorbance: 0.15 },
  { freq: 660, absorbance: 0.48 },
  { freq: 510, absorbance: 0.62 },
  { freq: 440, absorbance: 0.50 },
  { freq: 340, absorbance: 0.45 },
  { freq: 280, absorbance: 0.30 },
  { freq: 200, absorbance: 0.05 },
]

// Laboratoriya natijalari
const labResults = [
  {
    id: "LAB-001", date: "2026-11-15",
    technique: "KBr tabletka",
    condition: "200 mg KBr + 1 mg [Co(en)₃]Cl₃",
    freq_nuNH: "3280, 3180", freq_CoN: "510", freq_CoCl: "—",
    resolution: "4 cm⁻¹",
    notes: "Standart sharoit. Barcha cho'qqilar aniq. Co-N 510 cm⁻¹ da — xelat effekti bog'ni mustahkamlaydi.",
    quality: "A'lo"
  },
  {
    id: "LAB-002", date: "2026-11-15",
    technique: "ATR",
    condition: "To'g'ridan-to'g'ri kristall",
    freq_nuNH: "3275, 3175", freq_CoN: "508", freq_CoCl: "—",
    resolution: "2 cm⁻¹",
    notes: "ATR usuli — cho'qqilar biroz siljigan. Xelat halqa cho'qqilari aniq.",
    quality: "A'lo"
  },
  {
    id: "LAB-003", date: "2026-11-16",
    technique: "KBr (Δ enantiomer)",
    condition: "Sof Δ enantiomer",
    freq_nuNH: "3280, 3180", freq_CoN: "510", freq_CoCl: "—",
    resolution: "4 cm⁻¹",
    notes: "Δ va Λ enantiomerlarning IQ spektrlari BIR XIL! Faqat qutblangan yorug'lik (CD) bilan farqlash mumkin.",
    quality: "A'lo"
  },
  {
    id: "LAB-004", date: "2026-11-16",
    technique: "Far-IR",
    condition: "Maxsus uskuna, polietilen plastinka",
    freq_nuNH: "—", freq_CoN: "510, 440, 340, 280", freq_CoCl: "—",
    resolution: "2 cm⁻¹",
    notes: "Far-IR soha — barcha Co-N tebranishlari aniq (510, 440, 340, 280 cm⁻¹). 4 ta cho'qqi — xelat halqa belgisi.",
    quality: "A'lo"
  },
  {
    id: "LAB-005", date: "2026-11-17",
    technique: "AgNO₃ cho'ktirish testi",
    condition: "IQ oldidan AgNO₃ testi",
    freq_nuNH: "—", freq_CoN: "—", freq_CoCl: "—",
    resolution: "—",
    notes: "⚠️ MUHIM: AgNO₃ qo'shilganda barcha 3 ta Cl⁻ cho'kadi (3AgCl). Barcha Cl⁻ tashqi sferada — 1:3 elektrolit.",
    quality: "Tasdiqlovchi test"
  },
  {
    id: "LAB-006", date: "2026-11-17",
    technique: "CD (Circular Dichroism)",
    condition: "Qutblangan yorug'lik",
    freq_nuNH: "—", freq_CoN: "—", freq_CoCl: "—",
    resolution: "—",
    notes: "⚠️ MUHIM: CD spektri Δ va Λ enantiomerlarni farqlaydi! Biri musbat, ikkinchisi manfiy CD signal beradi.",
    quality: "Enantiomer farqlash"
  },
]

// Texnikalar
const techniques = [
  {
    name: "KBr tabletka",
    description: "Namunani KBr bilan aralashtirib, gidravlik press bilan tabletka bosish",
    advantages: [
      "Eng aniq va an'anaviy usul",
      "Xelat halqa cho'qqilari aniq (1045, 660 cm⁻¹)",
      "Kvantitativ tahlil uchun qulay",
      "Standart usul"
    ],
    disadvantages: [
      "Namuna tayyorlash kerak (10-15 daq)",
      "KBr nam bo'lsa, suv cho'qqilari aralashadi",
      "Past chastotali soha (200 cm⁻¹ dan past) zaif",
      "Enantiomerlar farqlanmaydi"
    ],
    bestFor: "Aniq kvantitativ tahlil, standart usul",
    freqRange: "4000-400 cm⁻¹", resolution: "4 cm⁻¹", samplePrep: "10-15 daq"
  },
  {
    name: "ATR",
    description: "To'g'ridan-to'g'ri kristall yoki kukun namuna ustiga qo'yish",
    advantages: [
      "Namuna tayyorlash shart emas",
      "Tez o'lchash (1-2 daq)",
      "Namuna buzilmaydi",
      "Xelat halqa cho'qqilari aniq"
    ],
    disadvantages: [
      "Cho'qqilar biroz siljigan (ATR effekt)",
      "Past chastotali soha zaif",
      "Kvantitativ tahlil qiyin",
      "Enantiomerlar farqlanmaydi"
    ],
    bestFor: "Tez skrining",
    freqRange: "4000-600 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "1-2 daq"
  },
  {
    name: "Far-IR",
    description: "Maxsus uskuna bilan 400-100 cm⁻¹ oralig'ida o'lchash",
    advantages: [
      "Co-N tebranishlari to'liq (510, 440, 340, 280 cm⁻¹)",
      "Xelat halqa cho'qqilari aniq",
      "Geometriya tasdig'i",
      "Halqa tebranishlari aniq"
    ],
    disadvantages: [
      "Maxsus uskuna kerak",
      "Polietilen yoki CsI plastinka kerak",
      "Nam namuna ishlamaydi",
      "Namuna tayyorlash qiyin"
    ],
    bestFor: "Co-N va halqa tebranishlari",
    freqRange: "400-100 cm⁻¹", resolution: "2 cm⁻¹", samplePrep: "15-20 daq"
  },
  {
    name: "CD (Circular Dichroism)",
    description: "Qutblangan yorug'lik bilan Δ/Λ enantiomerlarni farqlash",
    advantages: [
      "Enantiomerlarni aniq farqlaydi",
      "Xiral komplekslar uchun yagona usul",
      "Musbat/manfiy CD signali",
      "Optik soflikni o'lchash"
    ],
    disadvantages: [
      "Faqat xiral komplekslar uchun",
      "Qimmat uskuna",
      "Murakkab spektr",
      "Faqat optik faol moddalar"
    ],
    bestFor: "Enantiomer farqlash, optik soflik",
    freqRange: "200-800 nm (UV-Vis)", resolution: "1 nm", samplePrep: "5-10 daq"
  },
]

// Halaqit beruvchi omillar
const interferences = [
  {
    source: "Suv (H₂O)",
    freqRange: "3400, 1640 cm⁻¹",
    effect: "Keng cho'qqilar — N-H va NH₂ sohasiga aralashadi",
    severity: "Yuqori",
    solution: "KBr ni 110°C da 2 soat quritish. Namuna quritgichda saqlash.",
    prevention: "KBr ni quritish, namuna quritgichda saqlash"
  },
  {
    source: "CO₂ (atmosfera)",
    freqRange: "2350, 667 cm⁻¹",
    effect: "O'tkir cho'qqilar — halqa sohasiga (660 cm⁻¹) aralashadi",
    severity: "O'rta",
    solution: "Spektrometrni N₂ bilan tozalash yoki CO₂ absorber ishlatish.",
    prevention: "N₂ bilan tozalash, CO₂ absorber"
  },
  {
    source: "Enantiomer aralashmasi",
    freqRange: "Barcha",
    effect: "IQ spektr o'zgarmaydi — Δ va Λ farqlanmaydi!",
    severity: "Yuqori (farqlash uchun)",
    solution: "CD (Circular Dichroism) ishlatish — enantiomerlarni farqlaydi.",
    prevention: "Sof enantiomer sintez qilish, CD ishlatish"
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
    source: "Namuna parchalanishi",
    freqRange: "3200-3300 cm⁻¹",
    effect: "en ligandi yo'qolishi — cho'qqilar zaiflashadi",
    severity: "O'rta",
    solution: "Namuna tayyorlashda ortiqcha isitishdan saqlanish.",
    prevention: "Past haroratda saqlash, tez tayyorlash"
  },
  {
    source: "Tableka qalinligi",
    freqRange: "Barcha",
    effect: "Juda qalin — cho'qqilar to'yingan. Juda yupqa — zaif signal.",
    severity: "O'rta",
    solution: "Optimal qalinlik: 1 mm. 1 mg namuna + 200 mg KBr.",
    prevention: "Standart tabletka qalinligi"
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CoEn3Cl3ConductometricPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [freqSlider, setFreqSlider] = useState(2000)
  const [activePeak, setActivePeak] = useState(null)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabResult, setActiveLabResult] = useState("LAB-001")
  const [activeIsomer, setActiveIsomer] = useState("delta")
  
  const [calcDq, setCalcDq] = useState(23000)
  const [calcP, setCalcP] = useState(21000)
  const [calcN, setCalcN] = useState(6)

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

  const muResult = useMemo(() => {
    const mu = Math.sqrt(calcN * (calcN + 2))
    return { mu: mu.toFixed(2) }
  }, [calcN])

  const currentLabResult = useMemo(() => {
    return labResults.find(r => r.id === activeLabResult) || labResults[0]
  }, [activeLabResult])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-orange-950 to-purple-950 border-2 border-orange-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🔍</span> [Co(en)₃]Cl₃ — XELAT EFFEKTİ!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-orange-300">Tris(etilendiamin)kobalt(III)</strong> — xelat effektining klassik namunasi.
              <strong> Δ va Λ optik izomerlar</strong>, D₃ simmetriya.
            </p>
            
            <div className="bg-orange-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-orange-400 font-bold mb-2">📊 Asosiy cho'qqilar:</div>
                  <div className="text-purple-200">
                    <strong>ν(N-H):</strong> 3280, 3180 cm⁻¹
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>ν(Co-N):</strong> 510 cm⁻¹
                  </div>
                </div>
                <div>
                  <div className="text-orange-400 font-bold mb-2">🔬 Simmetriya:</div>
                  <div className="text-purple-200">
                    <strong>D₃ simmetriya</strong> (trigonal)
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>1:3 elektrolit</strong> — 4 ion
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-orange-300">Xelat effekti:</strong> 3 ta bidentat en ligand 3 ta 5 a'zoli halqa hosil qiladi. 
                log β₃ ≈ 49 — [Co(NH₃)₆]³⁺ (log β₆ ≈ 35) dan <strong>10¹⁴ marta barqaror!</strong>
              </p>
            </div>

            <div className="bg-orange-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-orange-300">Optik izomerlar:</strong> Δ (delta) va Λ (lambda) enantiomerlar mavjud. 
                IQ spektrlari bir xil — faqat CD (Circular Dichroism) bilan farqlash mumkin!
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-orange-400 font-semibold">[Co(en)₃]Cl₃</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-orange-400 flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                  <span className="text-xs bg-cyan-600 px-2 py-1 rounded ml-2">🔍 IQ</span>
                </h1>
                <p className="text-purple-400 text-sm mt-1">{COMPOUND.iupac}</p>
                <p className="text-purple-500 text-xs mt-1 font-mono">{COMPOUND.commonName}</p>
                <p className="text-purple-500 text-xs mt-1">
                  M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">D₃ simmetriya</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Xelat effekti</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Diamagnit</span>
                  <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Δ/Λ enantiomerlar</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-xs bg-orange-600/80 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Barcha birikmalar
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-orange-600 hover:bg-orange-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d⁶ quyi spin</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">Xelat</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">1:3 elektrolit</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              [Co(en)₃]Cl₃
            </h2>
            <span className="text-purple-400 text-lg">345.52 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            tris(etilendiamin)kobalt(III) xlorid — <span className="text-orange-400 italic">&quot;Xelat effekti namunasi&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-orange-400">IQ spektri</strong> KBr tabletka usulida 4000−200 cm⁻¹ 
            oralig'ida olingan. Eng muhim diagnostik signallar: 
            <strong className="text-orange-400"> ν(Co-N) 510 cm⁻¹</strong> — xelat bog'ining mustahkamligi;
            <strong className="text-orange-400"> ν(C-N) 1045 cm⁻¹</strong> — en ligandining belgisi.
            Bu kompleks xelat effektining asosiy namunasi — log β₃ ≈ 49.
          </p>

          {/* Δ/Λ TANLASH */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveIsomer("delta")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeIsomer === "delta"
                  ? "bg-orange-600/60 text-white border border-orange-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
              }`}
            >
              Δ (Delta) — o'ng qo'l spirali
            </button>
            <button
              onClick={() => setActiveIsomer("lambda")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeIsomer === "lambda"
                  ? "bg-pink-600/60 text-white border border-pink-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
              }`}
            >
              Λ (Lambda) — chap qo'l spirali
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
              <div className="text-white font-bold">D₃ (trigonal)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Elektrolit turi</div>
              <div className="text-white font-bold">1:3 (4 ion)</div>
            </div>
          </div>
        </div>

        {/* XELAT EFFEKTİ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔗 Xelat effekti — 10¹⁴ marta barqarorlik</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            [Co(en)₃]³⁺ <strong className="text-orange-400">xelat effektining</strong> eng klassik namunasi.
            Etilendiamin (en = H₂N-CH₂-CH₂-NH₂) bidentat ligand — 2 ta N atomi orqali Co³⁺ ga bog'lanadi.
            3 ta en ligandi 3 ta 5 a'zoli xelat halqa hosil qiladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Xelat effekti</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Ligand turi:</span>
                  <span className="text-orange-400">Bidentat (en)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Halqa o'lchami:</span>
                  <span className="text-orange-400">5 a'zoli (Co-N-C-C-N)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Halqalar soni:</span>
                  <span className="text-orange-400">3 ta</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">log β₃:</span>
                  <span className="text-orange-400 font-bold">~49</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-orange-400 font-bold">10¹⁴ marta</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">Entropiya effekti</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Reaksiya:</span>
                  <span className="text-yellow-400">Co³⁺ + 3en → [Co(en)₃]³⁺</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">ΔS:</span>
                  <span className="text-yellow-400 font-bold">&gt; 0 (ortadi)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Sabab:</span>
                  <span className="text-yellow-400">1 molekula → 4 molekula</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">[Co(NH₃)₆]³⁺ bilan:</span>
                  <span className="text-yellow-400">log β₆ ≈ 35</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Farq:</span>
                  <span className="text-yellow-400 font-bold">10¹⁴ marta</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Entropiya effekti:</strong> Co³⁺ + 3en → [Co(en)₃]³⁺ reaksiyasida 1 molekula 4 molekulaga aylanadi.
              Bu <strong>entropiya ortishiga</strong> (ΔS &gt; 0) olib keladi — shuning uchun xelat komplekslar monodentat 
              komplekslardan ancha barqaror. Bu Schwarzenbach (1950) tomonidan tushuntirilgan.
            </p>
          </div>
        </div>

        {/* INTERAKTIV IQ SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv IQ spektr grafigi</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            Slayderni harakatlantirib, chastotani o'zgartiring. Eng yaqin cho'qqi avtomatik tanlanadi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-orange-400 font-bold mb-2">
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
                <div className="text-xl font-mono font-bold text-orange-400">{currentPeak.freq} cm⁻¹</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Belgilanish:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{currentPeak.assignment}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Intensivlik:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{currentPeak.intensity}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Simmetriya:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{currentPeak.symmetry}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Kuch konstanta:</div>
                <div className="text-xl font-mono font-bold text-orange-400">{currentPeak.forceConstant}</div>
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

          {/* SVG GRAFIK */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-96">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible">
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.0)*200} x2="580" y2={220 - (v/1.0)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.0)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 1000, 2000, 3000, 4000].map((f, i) => (
                <g key={i}>
                  <text x={50 + (f/4000)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{f}</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">To'lqin soni (cm⁻¹)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish</text>

              <polyline
                fill="none" 
                stroke="#f97316" 
                strokeWidth="2"
                points={irSpectrum.map(p => {
                  const x = 50 + ((4000 - p.freq)/4000)*530
                  const y = 220 - (p.absorbance/1.0)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              <line 
                x1={50 + ((4000 - currentPeak.freq)/4000)*530} 
                y1="30" 
                x2={50 + ((4000 - currentPeak.freq)/4000)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />

              {irPeaks.map((peak, i) => {
                const x = 50 + ((4000 - peak.freq)/4000)*530
                const y = 220 - (peak.absorbance/1.0)*200
                const isActive = currentPeak.freq === peak.freq
                const isCoN = peak.freq === 510
                const isCN = peak.freq === 1045
                return (
                  <g key={i} onClick={() => setActivePeak(i)} className="cursor-pointer">
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isActive ? 10 : 6} 
                      fill={isActive ? "#fbbf24" : (isCoN || isCN) ? "#f472b6" : "#f97316"} 
                      stroke={(isCoN || isCN) ? "#fbbf24" : "#fff"} 
                      strokeWidth={(isCoN || isCN) ? 3 : 2}
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
                    {(isCoN || isCN) && !isActive && (
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
              const isCoN = p.freq === 510
              const isCN = p.freq === 1045
              const isImportant = isCoN || isCN
              return (
                <button
                  key={i}
                  onClick={() => setActivePeak(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                    activePeak === i ? 'border-yellow-400 bg-yellow-900/30' : 
                    isImportant ? 'border-pink-400 bg-pink-900/20' :
                    'border-orange-400/40 bg-orange-900/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activePeak === i ? 'bg-yellow-400' : isImportant ? 'bg-pink-400' : 'bg-orange-400'}`} />
                  <span className="font-mono text-orange-400">{p.freq}</span>
                  <span className="text-purple-400">{p.assignment}</span>
                  {isImportant && <span className="text-[10px] text-yellow-400 font-bold">(MUHIM!)</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* CHO'QQILAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📊 Cho'qqilar jadvali — to'liq tahlil</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Chastota</th>
                  <th className="py-3 px-4 text-purple-300">T%</th>
                  <th className="py-3 px-4 text-purple-300">Belgilanish</th>
                  <th className="py-3 px-4 text-purple-300">Tavsif</th>
                  <th className="py-3 px-4 text-purple-300">Intensivlik</th>
                  <th className="py-3 px-4 text-purple-300">Bog'</th>
                  <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                  <th className="py-3 px-4 text-purple-300">Kuch</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {irPeaks.map((p, i) => {
                  const isCoN = p.freq === 510
                  const isCN = p.freq === 1045
                  const isImportant = isCoN || isCN
                  return (
                    <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${isImportant ? 'bg-pink-900/20' : ''}`}>
                      <td className={`py-3 px-4 font-mono font-bold ${isImportant ? 'text-pink-400' : 'text-yellow-400'}`}>
                        {p.freq}
                        {isImportant && <span className="ml-1 text-[10px] text-yellow-400">⚠</span>}
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

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>⚠️ MUHIM:</strong> ν(Co-N) = 510 cm⁻¹ cho'qqisi xelat bog'ining mustahkamligini ko'rsatadi. 
              [Co(NH₃)₆]³⁺ (500 cm⁻¹) ga yaqin — xelat effekti bog'ni biroz mustahkamlaydi.
              ν(C-N) = 1045 cm⁻¹ — en ligandining belgisi.
            </p>
          </div>
        </div>

        {/* Δ/Λ ENANTIOMERLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔄 Δ/Λ enantiomerlar — xiral kompleks</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            [Co(en)₃]³⁺ <strong className="text-orange-400">xiral kompleks</strong> — ikkita enantiomerga ega.
            <strong className="text-orange-400"> Δ (delta)</strong> — o'ng qo'l spirali,
            <strong className="text-pink-400"> Λ (lambda)</strong> — chap qo'l spirali.
            <strong className="text-yellow-400"> IQ spektrlari bir xil!</strong> Faqat CD bilan farqlash mumkin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">Δ (Delta) — o'ng qo'l spirali</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Simmetriya:</span>
                  <span className="text-orange-400">P3₁21 (trigonal)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">IQ spektr:</span>
                  <span className="text-orange-400">BIR XIL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">CD signal:</span>
                  <span className="text-orange-400 font-bold">Musbat (+)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Optik aylantirish:</span>
                  <span className="text-orange-400">[α] &gt; 0</span>
                </div>
              </div>
            </div>

            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-3">Λ (Lambda) — chap qo'l spirali</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Simmetriya:</span>
                  <span className="text-pink-400">P3₂21 (trigonal)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">IQ spektr:</span>
                  <span className="text-pink-400">BIR XIL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">CD signal:</span>
                  <span className="text-pink-400 font-bold">Manfiy (−)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Optik aylantirish:</span>
                  <span className="text-pink-400">[α] &lt; 0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-300 text-sm">
              <strong>Muhim xulosa:</strong> IQ spektroskopiya enantiomerlarni <strong>farqlamaydi</strong> — ikkalasi ham bir xil spektr beradi!
              Faqat <strong>qutblangan yorug'lik</strong> (CD — Circular Dichroism) yoki <strong>optik aylantirish</strong> ([α]) bilan farqlash mumkin.
              Bu xiral komplekslarning muhim xususiyati.
            </p>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Optik soflik:</strong> CD spektri orqali enantiomerning optik sofligini o'lchash mumkin.
              Δ enantiomer musbat CD signal, Λ enantiomer manfiy CD signal beradi.
              Bu xiral komplekslarning muhim tahlil usuli.
            </p>
          </div>
        </div>

        {/* LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Laboratoriya natijalari — turli sharoitlarda</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">ID</th>
                  <th className="py-3 px-4 text-purple-300">Texnika</th>
                  <th className="py-3 px-4 text-purple-300">Sharoit</th>
                  <th className="py-3 px-4 text-purple-300">ν(N-H)</th>
                  <th className="py-3 px-4 text-purple-300">ν(Co-N)</th>
                  <th className="py-3 px-4 text-purple-300">Sifat</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {labResults.map((result) => (
                  <tr 
                    key={result.id}
                    onClick={() => setActiveLabResult(result.id)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeLabResult === result.id ? 'bg-orange-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-cyan-400">{result.id}</td>
                    <td className="py-3 px-4 font-bold">{result.technique}</td>
                    <td className="py-3 px-4 text-xs">{result.condition}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_nuNH}</td>
                    <td className="py-3 px-4 font-mono">{result.freq_CoN}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        result.quality === 'A\'lo' ? 'bg-green-600/30 text-green-400' :
                        result.quality === 'Yaxshi' ? 'bg-yellow-600/30 text-yellow-400' :
                        result.quality === 'Tasdiqlovchi test' ? 'bg-blue-600/30 text-blue-400' :
                        result.quality === 'Enantiomer farqlash' ? 'bg-pink-600/30 text-pink-400' :
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

          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="text-orange-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan natija izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {currentLabResult.notes}
            </p>
          </div>
        </div>

        {/* HALAQIT BERUVCHI OMILLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚠️ IQ tahliliga halaqit beruvchi omillar</h2>
          
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
                      activeInterference === i ? 'bg-orange-900/20' : ''
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

          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="text-orange-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning yechimi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {interferences[activeInterference].solution}
            </p>
          </div>
        </div>

        {/* TEXNIKALAR SOLISHTIRISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Texnikalar solishtirishi</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {techniques.map((tech, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTechnique === i
                    ? "bg-orange-600/60 text-white border border-orange-400/50"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-orange-400 font-bold mb-3">{techniques[activeTechnique].name}</h3>
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

        {/* GURUH NAZARIYASI — D₃ SIMMETRIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🔬 Guruh nazariyasi tahlili — D₃ simmetriya</h2>
          
          <p className="text-purple-200 leading-relaxed">
            [Co(en)₃]³⁺ ioni <strong className="text-orange-400">D₃ nuqtali guruhga</strong> tegishli.
            Bu trigonal simmetriya — O<sub>h</sub> dan past. Alternativa taqiq <strong>YO'Q</strong>.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-orange-400 font-bold mb-3">Normal tebranish modlari</h3>
            <p className="text-purple-200 text-sm mb-3">
              <strong>ML₃ (en)₃ (D₃):</strong> Γ<sub>teb</sub> = 10A + 10E (20 mod)
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-green-400 font-bold">IQ-faol:</span>
                <span className="text-purple-200"> 10A + 10E (20 mod)</span>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-blue-400 font-bold">Raman-faol:</span>
                <span className="text-purple-200"> 10A + 10E</span>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <span className="text-orange-400 font-bold">IQ + Raman:</span>
                <span className="text-purple-200"> BARCHA (alternativa taqiq YO'Q!)</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Alternativa taqiq yo'q:</strong> D₃ da inversiya markazi <strong>YO'Q</strong> — 
              shuning uchun barcha A va E modlari IQ va Raman ikkalasida ham faol!
              Bu [Co(NH₃)₆]³⁺ (O<sub>h</sub>) dan muhim farq.
            </p>
          </div>
        </div>

        {/* KRISTALL MAYDON NAZARIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🎨 Kristall maydon nazariyasi — CFSE hisoblagich</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-3">Elektron konfiguratsiya</h3>
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
        </div>

        {/* WERNER QATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⚖️ Werner koordinatsion qatori</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th>
                  <th className="py-3 px-4 text-purple-300">Rang</th>
                  <th className="py-3 px-4 text-purple-300">Λm</th>
                  <th className="py-3 px-4 text-purple-300">Ionlar</th>
                  <th className="py-3 px-4 text-purple-300">Elektrolit</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-yellow-400">[Co(NH₃)₆]Cl₃</td>
                  <td className="py-3 px-4 text-yellow-300">Sariq (Luteo)</td>
                  <td className="py-3 px-4 font-mono">432</td>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4 text-yellow-400">1:3</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-pink-400">[Co(NH₃)₅Cl]Cl₂</td>
                  <td className="py-3 px-4 text-pink-300">Binafsha (Purpureo)</td>
                  <td className="py-3 px-4 font-mono">340</td>
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4 text-pink-400">1:2</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-green-400">[Co(NH₃)₄Cl₂]Cl</td>
                  <td className="py-3 px-4 text-green-300">Yashil (Praseo)</td>
                  <td className="py-3 px-4 font-mono">250</td>
                  <td className="py-3 px-4">2</td>
                  <td className="py-3 px-4 text-green-400">1:1</td>
                </tr>
                <tr className="border-b border-purple-800/30 bg-orange-900/20">
                  <td className="py-3 px-4 font-bold text-orange-400">[Co(en)₃]Cl₃</td>
                  <td className="py-3 px-4 text-orange-300">Sariq-to'q sariq</td>
                  <td className="py-3 px-4 font-mono">430</td>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4 text-orange-400">1:3</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <p className="text-orange-300 text-sm">
              <strong>Muhim:</strong> [Co(en)₃]Cl₃ ning Λm ≈ 430 — [Co(NH₃)₆]Cl₃ (432) ga deyarli teng.
              Ikkalasi ham 1:3 elektrolit (4 ion) — shuning uchun Λm yaqin.
              Lekin log β₃ ≈ 49 (xelat) vs log β₆ ≈ 35 (ammin) — xelat effekti!
            </p>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-orange-400">Xelat effekti:</strong> log β₃ ≈ 49 — [Co(NH₃)₆]³⁺ dan 10¹⁴ marta barqaror</li>
            <li>Co³⁺ (d⁶, QS) — <strong>inert kompleks</strong>, diamagnit</li>
            <li><strong>ν(Co-N) = 510 cm⁻¹</strong> — xelat bog'ining mustahkamligi</li>
            <li>D₃ simmetriya — <strong>alternativa taqiq yo'q</strong></li>
            <li><strong>Δ/Λ enantiomerlar</strong> — IQ bilan farqlanmaydi, faqat CD bilan</li>
            <li>1:3 elektrolit (4 ion) — Λm ≈ 430</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-en2-cl2-cl" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold transition-all">
            [Co(en)₂Cl₂]Cl →
          </Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(en)₃]Cl₃ • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Nakamoto (Infrared and Raman Spectra), Schwarzenbach (1950), Werner (1893)</p>
        </div>
      </footer>
    </main>
  )
}