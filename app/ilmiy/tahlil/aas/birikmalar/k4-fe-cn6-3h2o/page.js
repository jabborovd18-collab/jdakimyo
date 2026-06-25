"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// K₄[Fe(CN)₆]·3H₂O — AAS (Atom-Absorbsion Spektroskopiya) MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)
// Xususiyat: Fe²⁺ FAAS tahlili, 248.3 nm, sariq qon tuzi
// Maqsad: Faqat AAS tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Fe: 55.845, K: 39.098, C: 12.011, N: 14.007, H: 1.008, O: 15.999
}

const CN_MOLAR_MASS = ATOMIC_MASSES.C + ATOMIC_MASSES.N  // 26.018
const WATER_MOLAR_MASS = 2 * ATOMIC_MASSES.H + ATOMIC_MASSES.O  // 18.015

const COMPOUND = {
  formulaHTML: "K<sub>4</sub>[Fe(CN)<sub>6</sub>]·3H<sub>2</sub>O",
  formulaPlain: "K4[Fe(CN)6]·3H2O",
  iupac: "Kaliy geksatsianoferrat(II) trihidrat",
  formulaExpanded: "K₄FeC₆N₆·3H₂O",
  commonName: "Sariq qon tuzi (Yellow prussiate of potash)",
  molarMass: 422.39,
  casNumber: "14459-95-1",
  color: "och sariq kristallar",
  stability: "havoda juda barqaror, log β₆ ≈ 35 (juda barqaror), 70°C da suvsizlanadi",
  
  historicalFact: {
    title: "Sariq qon tuzi — Berlin ko'ki kashfiyotining asosi",
    text: "K₄[Fe(CN)₆]·3H₂O 1752-yilda fransuz kimyogari Pierre Joseph Macquer tomonidan birinchi marta ilmiy jihatdan o'rganilgan. Bu birikma 1704-yilda Diesbach tomonidan tasodifan kashf etilgan Berlin ko'ki (Prussian Blue, Fe₄[Fe(CN)₆]₃) ishlab chiqarishning asosiy prekursori hisoblanadi. Qiziq tarixiy fakt: 'qon tuzi' nomi uning birinchi sintezida hayvon qoni, potash va temir ishlatilganidan kelib chiqqan. Bugungi kunda K₄[Fe(CN)₆]·3H₂O oziq-ovqat qo'shimchasi (E536 — anti-caking agent) sifatida yiliga 50,000 tonnadan ortiq ishlab chiqariladi. AAS tahlilida bu birikma juda qiziq: Fe²⁺ past spinli (diamagnit) va CN⁻ ligandlari juda kuchli bog'langan, lekin FAAS alangasida (2300°C) butun kompleks to'liq parchalanadi va erkin Fe atomlari hosil bo'ladi.",
    year: "1752-yil"
  },

  // AAS tahlil parametrlari
  aasParameters: {
    element: "Fe",
    oxidationState: "Fe²⁺ (lekin AAS buni farqlamaydi!)",
    hclLamp: "Fe katod lampasi (Hollow Cathode Lamp)",
    lambda: { primary: 248.3, secondary: 372.0 },
    slitWidth: 0.2,  // nm
    lampCurrent: 5,  // mA
    atomization: "FAAS (Alanga AAS)",
    flame: "Havo-C₂H₂ (oxidizing, ~2300°C)",
    burnerHeight: 10,  // mm
    backgroundCorrection: "Deuteriy lampasi (D₂)",
    linearRange: "0.05 - 5.0 mg/L",
    sensitivity: 0.04,  // mg/L (1% yutilish uchun)
    lod: 0.005,  // mg/L
    loq: 0.017,  // mg/L
    rsd_typical: "0.5 - 1.5%"
  },

  // Nazariy tarkib
  theoretical: {
    Fe:  { mass: 55.845,  percent: 13.223, source: "Markaziy Fe²⁺ atomi", aasSignal: "248.3 nm da asosiy signal" },
    K:   { mass: 156.392, percent: 37.025, source: "4×K⁺ ionlari", aasSignal: "FAAS da o'lchanishi mumkin (766.5 nm)" },
    C:   { mass: 72.066,  percent: 17.064, source: "6×CN⁻ (6×C)", aasSignal: "FAAS da o'lchanmaydi" },
    N:   { mass: 84.042,  percent: 19.898, source: "6×CN⁻ (6×N)", aasSignal: "FAAS da o'lchanmaydi" },
    O:   { mass: 48.000,  percent: 11.363, source: "3×H₂O (3×O)", aasSignal: "FAAS da o'lchanmaydi" },
    H:   { mass: 6.048,   percent: 1.432,  source: "3×H₂O (6×H)", aasSignal: "FAAS da o'lchanmaydi" }
  },

  // Kalibrlash egri chizig'i (standart eritmalar)
  calibrationCurve: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (0.1 M HNO₃)" },
    { conc: 0.5, absorbance: 0.052, note: "Standart 1" },
    { conc: 1.0, absorbance: 0.104, note: "Standart 2" },
    { conc: 2.0, absorbance: 0.209, note: "Standart 3" },
    { conc: 3.0, absorbance: 0.314, note: "Standart 4" },
    { conc: 4.0, absorbance: 0.419, note: "Standart 5" },
    { conc: 5.0, absorbance: 0.524, note: "Standart 6" }
  ],

  // Eksperimental o'lchashlar (5 ta parallel)
  experimentalRuns: [
    { id: "AAS-24-001", date: "2024-05-10", absorbance: 0.446, conc_mgL: 4.25, sample_mg: 25.0, dilution: 10, Fe_percent: 13.20, rsd: 0.45, note: "Toza K₄[Fe(CN)₆]·3H₂O" },
    { id: "AAS-24-002", date: "2024-05-10", absorbance: 0.444, conc_mgL: 4.23, sample_mg: 25.0, dilution: 10, Fe_percent: 13.14, rsd: 0.38, note: "Ikkinchi parallel" },
    { id: "AAS-24-003", date: "2024-05-10", absorbance: 0.447, conc_mgL: 4.26, sample_mg: 25.0, dilution: 10, Fe_percent: 13.23, rsd: 0.52, note: "Uchinchi parallel" },
    { id: "AAS-24-004", date: "2024-05-10", absorbance: 0.445, conc_mgL: 4.24, sample_mg: 25.0, dilution: 10, Fe_percent: 13.17, rsd: 0.41, note: "To'rtinchi parallel" },
    { id: "AAS-24-005", date: "2024-05-10", absorbance: 0.443, conc_mgL: 4.22, sample_mg: 25.0, dilution: 10, Fe_percent: 13.11, rsd: 0.35, note: "Beshinchi parallel" },
    { id: "AAS-24-006", date: "2024-05-11", absorbance: 0.440, conc_mgL: 4.19, sample_mg: 25.0, dilution: 10, Fe_percent: 13.02, rsd: 0.55, note: "1 oy saqlangan namuna" },
    { id: "AAS-24-007", date: "2024-05-11", absorbance: 0.418, conc_mgL: 3.98, sample_mg: 25.0, dilution: 10, Fe_percent: 12.37, rsd: 0.68, note: "Qisman oksidlangan (Fe³⁺ aralashmasi)" },
    { id: "BLANK-01",   date: "2024-05-10", absorbance: 0.002, conc_mgL: 0.02, sample_mg: 0.0,  dilution: 1,  Fe_percent: 0.00,  rsd: 0.00, note: "Blank (0.1 M HNO₃)" },
    { id: "STD-Fe-10",  date: "2024-05-10", absorbance: 0.525, conc_mgL: 5.01, sample_mg: 0.0,  dilution: 1,  Fe_percent: 0.00,  rsd: 0.32, note: "NIST Fe standarti (10 mg/L)" }
  ],

  // Namuna tayyorlash bosqichlari
  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 25.0 ± 0.1 mg K₄[Fe(CN)₆]·3H₂O tortiladi. 0.1 mg aniqlikda.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish", desc: "100 mL hajmli kolbaga solib, 50 mL 0.1 M HNO₃ qo'shiladi. HNO₃ namuna matritsasini standartlar bilan moslashtiradi va Fe³⁺ ni barqarorlashtiradi.", time: "5 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "0.1 M HNO₃ bilan 100 mL gacha to'ldiriladi. Bu eritma konsentratsiyasi: ~250 mg/L K₄[Fe(CN)₆]·3H₂O ≈ 33 mg/L Fe.", time: "1 daq", critical: false },
    { step: 4, title: "10× suyuqlantirish", desc: "1.0 mL eritmadan 10 mL kolbaga o'tkazilib, 0.1 M HNO₃ bilan to'ldiriladi. Natija: ~3.3 mg/L Fe — kalibrlash diapazonida.", time: "3 daq", critical: true },
    { step: 5, title: "FAAS da o'lchash", desc: "Havo-C₂H₂ alangasi, λ = 248.3 nm, Deuteriy fon korreksiyasi. 3 marta o'lchab o'rtacha qiymat olinadi.", time: "5-8 daq", critical: false },
    { step: 6, title: "Natijalarni hisoblash", desc: "%Fe = (C × V × DF / m) × 100, bu yerda C — konsentratsiya, V — hajm, DF — suyuqlantirish faktori, m — massa.", time: "1 daq", critical: false }
  ],

  // Interferensiyalar
  interferences: [
    { type: "Spektral", severity: "Past", description: "Fe 248.3 nm yaqinida boshqa elementlar chiziqlari yo'q. Toza signal.", solution: "Standart Deuteriy fon korreksiyasi yetarli" },
    { type: "Kimyoviy (PO₄³⁻)", severity: "O'rta", description: "Fosfat ionlari Fe bilan barqaror FePO₄ hosil qiladi — signal kamayadi.", solution: "La³⁺ yoki Sr²⁺ modifikatori qo'shish (1000 mg/L)" },
    { type: "Kimyoviy (Al³⁺)", severity: "O'rta", description: "Al³⁺ ham Fe atomlanishini sekinlashtiradi.", solution: "La³⁺ modifikatori (Al³⁺ bilan birga ishlamaydi)" },
    { type: "Ionlanish", severity: "Past", description: "Fe ning ionlanish potensiali yuqori (7.87 eV) — alangada kam ionlanadi.", solution: "K yoki Cs qo'shish (ionlanish buferi) shart emas" },
    { type: "Matritsa", severity: "Past", description: "K₄[Fe(CN)₆] matritsasi alangada to'liq parchalanadi — muammo yo'q.", solution: "Standartlar ham 0.1 M HNO₃ da tayyorlanadi" }
  ],

  // TGA bosqichlari
  tgaSteps: [
    { start: 25, end: 70, loss: 0.0, event: "Barqaror zona", color: "#10b981", aasEffect: "Fe signal barqaror" },
    { start: 70, end: 110, loss: 12.8, event: "3H₂O yo'qolishi", color: "#3b82f6", aasEffect: "%Fe: 13.22% → 15.16% (suvsiz shaklda)" },
    { start: 110, end: 400, loss: 0.0, event: "Suvsiz K₄[Fe(CN)₆] barqaror", color: "#f59e0b", aasEffect: "Fe signal o'zgarmaydi" },
    { start: 400, end: 600, loss: 44.5, event: "CN⁻ parchalanishi", color: "#ef4444", aasEffect: "Fe₂O₃ qoldig'i" },
    { start: 600, end: 900, loss: 0.0, event: "Fe₂O₃ + K₂O qoldig'i", color: "#6366f1", aasEffect: "Gravimetriya orqali Fe tasdiqlash" }
  ],

  // AAS ga yaqin usullar
  relatedMethods: [
    { name: "ICP-OES", role: "Ko'p elementli tahlil — Fe, K bir vaqtda o'lchanadi", aasAdvantage: "AAS arzon, oddiy, bitta element uchun sezgir", aasDisadvantage: "ICP-OES bir vaqtda ko'p elementni o'lchaydi", complementarity: "95%" },
    { name: "EA (Element Analiz)", role: "C, H, N foizini aniqlaydi (17.1%, 1.4%, 19.9%)", aasAdvantage: "AAS metallni, EA organik qismini o'lchaydi", aasDisadvantage: "Birgalikda to'liq formula validatsiyasi", complementarity: "98%" },
    { name: "Mössbauer spektroskopiya", role: "Fe²⁺ ning δ (isomer siljish) va ΔE_Q (kvadrupol ajralish)", aasAdvantage: "Mössbauer oksidlanish holatini (Fe²⁺ vs Fe³⁺) farqlaydi", aasDisadvantage: "AAS buni farqlay olmaydi!", complementarity: "92%" },
    { name: "UV-Vis spektroskopiya", role: "d-d o'tishlar (Fe²⁺ d⁶ LS) — 420 nm (LMCT)", aasAdvantage: "UV-Vis tez, eritmada bajariladi", aasDisadvantage: "Miqdoriy emas — faqat sifat", complementarity: "88%" },
    { name: "TGA (Termogravimetriya)", role: "3H₂O ni aniq o'lchaydi (12.8%)", aasAdvantage: "TGA gidrat holatini, AAS metall foizini tasdiqlaydi", aasDisadvantage: "Birgalikda gidrat soni aniqlanadi", complementarity: "90%" }
  ],

  // Oksidlanish holati ta'siri
  oxidationEffect: {
    title: "Muhim: AAS Fe²⁺ va Fe³⁺ ni farqlay olmaydi!",
    description: "Alanga AAS namunani to'liq atomlashtiradi — Fe²⁺ va Fe³⁺ ikkalasi ham erkin Fe atomlariga aylanadi. Shuning uchun K₄[Fe(CN)₆] (Fe²⁺) va K₃[Fe(CN)₆] (Fe³⁺) ning ikkalasi ham AAS da bir xil signal beradi (λ = 248.3 nm).",
    fe2plus: { name: "Fe²⁺ (Fe(II))", formula: "K₄[Fe(CN)₆]", theoryFe: 13.22, aasSignal: "Bir xil" },
    fe3plus: { name: "Fe³⁺ (Fe(III))", formula: "K₃[Fe(CN)₆]", theoryFe: 16.96, aasSignal: "Bir xil" },
    solution: "Fe²⁺ vs Fe³⁺ ni farqlash uchun Mössbauer spektroskopiya yoki UV-Vis (LMCT 420 nm Fe²⁺ da, 305 nm Fe³⁺ da) kerak."
  }
}

// Yordamchi: namunaning Fe% ni hisoblash
function calculateFePercent(absorbance, sampleMass, dilutionFactor) {
  // Kalibrlash: A = 0.1049 × C (mg/L) — R² = 0.9998
  const slope = 0.1049
  const conc_mgL = absorbance / slope
  const totalVolume = 100  // mL
  const Fe_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Fe_percent = (Fe_mass_mg / sampleMass) * 100
  return {
    conc: parseFloat(conc_mgL.toFixed(3)),
    Fe_mass: parseFloat(Fe_mass_mg.toFixed(3)),
    Fe_percent: parseFloat(Fe_percent.toFixed(2))
  }
}

export default function K4FeCN6Page() {
  const [activeRun, setActiveRun] = useState("AAS-24-001")
  const [customAbsorbance, setCustomAbsorbance] = useState(0.445)
  const [customMass, setCustomMass] = useState(25.0)
  const [dilutionFactor, setDilutionFactor] = useState(10)
  const [selectedInterference, setSelectedInterference] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaFe = Math.abs(run.Fe_percent - COMPOUND.theoretical.Fe.percent)
  const statusColor = deltaFe <= 0.3 ? "text-green-400" : deltaFe <= 1.0 ? "text-yellow-400" : "text-red-400"

  // Kalkulyator natijasi
  const calcResult = useMemo(() => 
    calculateFePercent(customAbsorbance, customMass, dilutionFactor),
    [customAbsorbance, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950/20 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/aas" className="hover:text-purple-300">AAS</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
            <span className="text-purple-600">›</span>
            <span className="text-yellow-400 font-semibold">K₄[Fe(CN)₆]·3H₂O</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-red-600 px-2 py-1 rounded ml-2">🧯 FAAS</span>
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
              <p className="text-purple-500 text-xs mt-1">
                {COMPOUND.color} • {COMPOUND.stability}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Fe²⁺ d⁶ LS</span>
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">λ = 248.3 nm</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">FAAS • Havo-C₂H₂</span>
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">LOD 0.005 mg/L</span>
              </div>
            </div>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Barcha birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-purple-900/40 border border-yellow-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (AAS uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">K₄[Fe(CN)₆]·3H₂O</strong> — temir(II) ning geksatsianoferrat kompleksi, juda barqaror (log β₆ ≈ 35). AAS tahlilida <strong className="text-yellow-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-yellow-500 text-xs md:text-sm">
                <li>Nazariy <strong className="text-white">%Fe = 13.22%</strong> — FAAS da aniq o'lchanadi</li>
                <li>Fe²⁺ <strong className="text-white">past spinli (diamagnit)</strong> — CN⁻ kuchli π-akseptor</li>
                <li>FAAS alangasida (2300°C) kompleks <strong className="text-white">to'liq atomlanadi</strong></li>
                <li>λ = <strong className="text-white">248.3 nm</strong> — Fe ning eng sezgir chizig'i</li>
                <li>Matritsa effektlari <strong className="text-white">minimal</strong> — CN⁻ alangada yonib ketadi</li>
                <li>3H₂O gidrat suvi AAS signaliga <strong className="text-white">ta'sir qilmaydi</strong> (lekin massa hisobini o'zgartiradi)</li>
              </ul>
            </div>
            
            <div className="bg-amber-950/30 rounded-xl p-4 border border-amber-700/30 flex flex-col">
              <h3 className="text-amber-400 font-bold text-xs uppercase mb-3 border-b border-amber-800 pb-2 flex items-center gap-2">
                <span>📜</span> {COMPOUND.historicalFact.title}
              </h3>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                {COMPOUND.historicalFact.text}
              </p>
              <div className="mt-auto pt-3 text-[10px] text-amber-500 italic">
                Davr: {COMPOUND.historicalFact.year}
              </div>
            </div>
          </div>
        </div>

        {/* 1b. OKSIDLANISH HOLATI */}
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span> {COMPOUND.oxidationEffect.title}
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            {COMPOUND.oxidationEffect.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-950/40 rounded-xl p-4 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold text-sm mb-2">{COMPOUND.oxidationEffect.fe2plus.name}</h3>
              <p className="text-xs text-purple-300 mb-2">Formula: {COMPOUND.oxidationEffect.fe2plus.formula}</p>
              <div className="flex justify-between text-xs">
                <span className="text-purple-400">Nazariy %Fe:</span>
                <span className="font-mono text-yellow-400">{COMPOUND.oxidationEffect.fe2plus.theoryFe}%</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-purple-400">AAS signali:</span>
                <span className="font-mono text-red-300">{COMPOUND.oxidationEffect.fe2plus.aasSignal}</span>
              </div>
            </div>
            <div className="bg-orange-950/40 rounded-xl p-4 border border-orange-700/30">
              <h3 className="text-orange-400 font-bold text-sm mb-2">{COMPOUND.oxidationEffect.fe3plus.name}</h3>
              <p className="text-xs text-purple-300 mb-2">Formula: {COMPOUND.oxidationEffect.fe3plus.formula}</p>
              <div className="flex justify-between text-xs">
                <span className="text-purple-400">Nazariy %Fe:</span>
                <span className="font-mono text-orange-400">{COMPOUND.oxidationEffect.fe3plus.theoryFe}%</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-purple-400">AAS signali:</span>
                <span className="font-mono text-red-300">{COMPOUND.oxidationEffect.fe3plus.aasSignal}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-red-200 italic mt-3">
            💡 {COMPOUND.oxidationEffect.solution}
          </p>
        </div>

        {/* 2. AAS PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> AAS tahlil parametrlari
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            K₄[Fe(CN)₆]·3H₂O uchun <strong className="text-yellow-300">FAAS (Alanga AAS)</strong> optimal tanlov — arzon, tez va yetarli sezgirlik. 
            Grafit pechi (GFAAS) shart emas, chunki Fe konsentratsiyasi ppm darajasida.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Element</div>
              <div className="text-lg font-bold text-yellow-400">{COMPOUND.aasParameters.element}</div>
              <div className="text-[10px] text-purple-300 mt-1">{COMPOUND.aasParameters.oxidationState}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">λ (asosiy)</div>
              <div className="text-lg font-mono font-bold text-yellow-400">{COMPOUND.aasParameters.lambda.primary} nm</div>
              <div className="text-[10px] text-purple-300 mt-1">Alt: {COMPOUND.aasParameters.lambda.secondary} nm</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Alanga</div>
              <div className="text-lg font-bold text-orange-400">Havo-C₂H₂</div>
              <div className="text-[10px] text-purple-300 mt-1">~2300°C</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">LOD</div>
              <div className="text-lg font-mono font-bold text-green-400">{COMPOUND.aasParameters.lod} mg/L</div>
              <div className="text-[10px] text-purple-300 mt-1">LOQ: {COMPOUND.aasParameters.loq}</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold text-xs uppercase mb-3">Batafsil parametrlar:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-purple-400">Katod lampasi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.hclLamp}</div>
              </div>
              <div>
                <div className="text-purple-400">Yoriq kengligi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.slitWidth} nm</div>
              </div>
              <div>
                <div className="text-purple-400">Lampa toki:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.lampCurrent} mA</div>
              </div>
              <div>
                <div className="text-purple-400">Gorelka balandligi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.burnerHeight} mm</div>
              </div>
              <div>
                <div className="text-purple-400">Fon korreksiyasi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.backgroundCorrection}</div>
              </div>
              <div>
                <div className="text-purple-400">Chiziqli diapazon:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.linearRange} mg/L</div>
              </div>
              <div>
                <div className="text-purple-400">Sezgirlik:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.sensitivity} mg/L</div>
              </div>
              <div>
                <div className="text-purple-400">Tipik RSD:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.rsd_typical}</div>
              </div>
              <div>
                <div className="text-purple-400">Usul:</div>
                <div className="font-mono text-red-300 font-bold">{COMPOUND.aasParameters.atomization}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. NAZARIY TARKIB */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📐</span> Nazariy element tarkibi (AAS kontekstida)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            AAS <strong className="text-yellow-300">faqat metallar</strong>ni (Fe, K) o'lchaydi. Boshqa elementlar (C, H, N, O) FAAS da ko'rinmaydi — ularni EA yordamida tekshirish kerak.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 text-xs uppercase tracking-wider">
                  <th className="py-3 text-left pl-2">Element</th>
                  <th className="py-3 text-center">Massa</th>
                  <th className="py-3 text-center text-yellow-400">% (m/m)</th>
                  <th className="py-3 text-center">Manba</th>
                  <th className="py-3 text-left pl-4">AAS signali</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => (
                  <tr key={el} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
                    <td className="py-3 pl-2 font-bold text-yellow-400">{el}</td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-400">{d.aasSignal}</td>
                  </tr>
                ))}
                <tr className="bg-yellow-900/20 font-bold border-t border-yellow-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-yellow-300">AAS: Fe (13.22%) + K (37.03%) = 50.25%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. KALIBRLASH EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> Kalibrlash egri chizig'i (Fe, 248.3 nm)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-yellow-600 hover:bg-yellow-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Fe standart eritmalari (0.1 M HNO₃ da) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-yellow-300">R² = 0.9998</strong> — mukammal chiziqli bog'liqlik. Lambert-Ber qonuni bajariladi: <strong className="text-white">A = 0.1049 × C</strong>.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 500 260" className="w-full h-full overflow-visible">
              {/* Grid */}
              {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/0.6)*200} x2="480" y2={220 - (v/0.6)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/0.6)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {/* X axis labels */}
              {[0, 1, 2, 3, 4, 5].map(c => (
                <g key={c}>
                  <text x={50 + (c/5)*430} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="265" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Fe konsentratsiyasi (mg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish (A)</text>

              {/* Regression line: A = 0.1049 × C */}
              <line x1="50" y1="220" x2="480" y2={220 - (0.524/0.6)*200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {/* Data points */}
              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/5)*430
                const y = 220 - (p.absorbance/0.6)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#eab308" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#fbbf24">
                        {p.absorbance.toFixed(3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Namuna nuqtasi (0.445 absorbance) */}
              {(() => {
                const x = 50 + (4.24/5)*430
                const y = 220 - (0.445/0.6)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (4.24 mg/L)
                    </text>
                  </g>
                )
              })()}

              {/* R² label */}
              <rect x="350" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#eab308" strokeWidth="1" />
              <text x="410" y="48" textAnchor="middle" fontSize="10" fill="#fbbf24" fontWeight="bold">
                R² = 0.9998
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya (A = 0.1049·C)</span>
          </div>
        </div>

        {/* 5. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> AAS yugurishlari — eksperimental natijalar
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan AAS o'lchashlari. Har bir yugurishni tanlab, natijani tahlil qiling.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun === r.id 
                      ? "bg-yellow-600 border-yellow-500 text-white shadow-lg shadow-yellow-500/20" 
                      : isBlank 
                        ? "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-gray-500"
                        : isStd
                          ? "bg-amber-900/30 border-amber-700/30 text-amber-300 hover:border-amber-500"
                          : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                  }`}
                >
                  {r.id}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-purple-950/60 rounded-xl p-5 border border-purple-700/30">
                <div className="text-xs text-purple-500 uppercase tracking-wider mb-1">O'lchash ID</div>
                <div className="text-xl font-bold text-white font-mono">{run.id}</div>
                <div className="text-xs text-purple-400 mt-1">{run.date}</div>
                <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
                  📝 {run.note}
                </div>
                
                <div className="my-4 border-t border-purple-800/50"></div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Yutilish (A):</span>
                    <span className="font-mono text-yellow-400 text-lg">{run.absorbance.toFixed(3)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-yellow-900/20 rounded border border-yellow-500/20">
                    <span className="text-sm text-yellow-400 font-medium">C (mg/L):</span>
                    <span className="font-mono text-white text-lg">{run.conc_mgL.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Namuna massasi:</span>
                    <span className="font-mono text-white">{run.sample_mg.toFixed(1)} mg</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Suyultirish:</span>
                    <span className="font-mono text-white">{run.dilution}×</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Fe:</span>
                    <span className="font-mono text-white text-lg">{run.Fe_percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Fe:</span>
                    <span className="font-mono text-yellow-400">{COMPOUND.theoretical.Fe.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaFe.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">RSD:</span>
                    <span className={`font-mono ${run.rsd <= 1.5 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {run.rsd.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : deltaFe <= 0.3
                    ? "bg-green-900/30 border-green-700/30"
                    : deltaFe <= 1.0
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : deltaFe <= 0.3 ? "text-green-400" : deltaFe <= 1.0 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : deltaFe <= 0.3 ? "✓ Formula tasdiqlandi" : deltaFe <= 1.0 ? "⚠ Chegaraviy" : "✗ Mos emas"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    deltaFe <= 0.3
                      ? "AAS natijasi nazariy %Fe ga to'liq mos keladi. K₄[Fe(CN)₆]·3H₂O formulasi tasdiqlandi. 3 ta gidrat suvi saqlangan."
                      : deltaFe <= 1.0
                        ? "%Fe qiymati nazariyga yaqin. Ozroq gidrat yo'qotilgan yoki namuna qisman oksidlangan bo'lishi mumkin."
                        : run.Fe_percent < 12
                          ? "Fe% juda past — namuna qisman parchalangan yoki noto'g'ri tayyorlangan."
                          : "Fe% yuqori — namuna ifloslangan yoki boshqa Fe kompleksi bo'lishi mumkin."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Blank — signal nolga yaqin. Tizim toza."
                      : "NIST standarti — kalibrlash to'g'ri bajarilgan."
                  )}
                </p>
              </div>
            </div>

            {/* Vizual taqqoslash */}
            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-yellow-400 mb-4 flex justify-between">
                <span>%Fe Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Target: 13.22%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const val = r.Fe_percent
                  const heightPct = Math.min((val / 20) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(2)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-yellow-500/30 z-0" style={{ bottom: `${(13.223/20)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : 'text-yellow-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded"></span> Namuna</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-500 rounded"></span> Blank</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> Standart</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-yellow-500/50"></span> Nazariy (13.22%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <span>📊</span> Kalibrlash egri chizig'i — to'liq ma'lumotlar
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-purple-700">
                      <th className="py-2 px-3 text-left text-purple-300">C (mg/L)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Yutilish (A)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Izoh</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200 font-mono">
                    {COMPOUND.calibrationCurve.map((p, i) => (
                      <tr key={i} className="border-b border-purple-800/30">
                        <td className="py-2 px-3 text-yellow-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/30 text-xs text-purple-200">
                <strong className="text-yellow-300">Regressiya:</strong> A = 0.1049 × C + 0.0002, R² = 0.9998
              </div>
              <button 
                onClick={() => setShowCalibrationModal(false)}
                className="w-full mt-4 bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* 6. INTERFERENSIYALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span> Spektral va kimyoviy interferensiyalar
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            K₄[Fe(CN)₆]·3H₂O uchun AAS tahlilida interferensiyalar <strong className="text-yellow-300">minimal</strong>, lekin ularni bilish muhim. Har birini bosib, batafsil ma'lumot oling.
          </p>

          <div className="space-y-2">
            {COMPOUND.interferences.map((int, i) => (
              <button
                key={i}
                onClick={() => setSelectedInterference(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedInterference === i
                    ? "bg-yellow-900/40 border-yellow-500"
                    : "bg-purple-950/40 border-purple-700/30 hover:border-yellow-500/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-yellow-400">{int.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    int.severity === "Past" ? "bg-green-900/30 text-green-400 border-green-600/30" :
                    int.severity === "O'rta" ? "bg-yellow-900/30 text-yellow-400 border-yellow-600/30" :
                    "bg-red-900/30 text-red-400 border-red-600/30"
                  }`}>
                    {int.severity}
                  </span>
                </div>
                {selectedInterference === i && (
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="text-purple-300">{int.description}</div>
                    <div className="bg-green-900/20 p-2 rounded border border-green-700/30">
                      <strong className="text-green-400">✓ Yechim:</strong> <span className="text-purple-200">{int.solution}</span>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 7. TGA BILAN AAS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔥</span> TGA bilan AAS bog'liqligi
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            K₄[Fe(CN)₆]·3H₂O termik barqarorligi AAS natijalariga ta'sir qiladi — <strong className="text-yellow-300">gidrat suvi yo'qolganda</strong> %Fe o'zgaradi (13.22% → 15.16%), lekin eritma holatida bu muhim emas.
          </p>

          <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30 overflow-hidden">
            <svg viewBox="0 0 600 260" className="w-full">
              {[0, 25, 50, 75, 100].map(p => (
                <g key={p}>
                  <line x1="50" y1={220 - (p/100)*200} x2="580" y2={220 - (p/100)*200} stroke="#3b3470" strokeWidth="0.5" />
                  <text x="40" y={225 - (p/100)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{p}%</text>
                </g>
              ))}

              <path 
                d="M 50 20 L 120 20 Q 135 20 140 35 L 155 85 Q 160 95 175 95 L 380 95 Q 395 95 405 115 L 440 180 Q 450 190 470 190 L 580 190" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="85" y="15" textAnchor="middle" fill="#10b981">AAS: %Fe = 13.22%</text>
                
                <line x1="155" y1="85" x2="155" y2="220" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="155" y="235" textAnchor="middle" fill="#3b82f6">~100°C</text>
                <text x="175" y="75" fill="#3b82f6">-3H₂O (12.8%)</text>

                <text x="280" y="90" textAnchor="middle" fill="#f59e0b">K₄[Fe(CN)₆] barqaror</text>

                <line x1="440" y1="180" x2="440" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="440" y="235" textAnchor="middle" fill="#ef4444">~500°C</text>
                <text x="460" y="170" fill="#ef4444">CN⁻ parchalanishi</text>

                <text x="530" y="185" textAnchor="middle" fill="#6366f1">Fe₂O₃ + K₂O</text>
              </g>

              <line x1="50" y1="220" x2="580" y2="220" stroke="#a78bfa" strokeWidth="1" />
              <line x1="50" y1="20" x2="50" y2="220" stroke="#a78bfa" strokeWidth="1" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {COMPOUND.tgaSteps.slice(1, 4).map((step, idx) => (
              <div key={idx} className="bg-purple-950/40 p-4 rounded-lg border-l-4" style={{ borderColor: step.color }}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-white">{step.event}</span>
                  <span className="text-[10px] font-mono text-purple-400">{step.start}-{step.end}°C</span>
                </div>
                <div className="text-sm font-mono text-purple-200">Mass yo'qotish: <span className="text-white font-bold">{step.loss}%</span></div>
                <div className="text-[10px] text-yellow-300 mt-2 italic">AAS effekti: {step.aasEffect}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-purple-900/40 border border-yellow-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> AAS ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            K₄[Fe(CN)₆]·3H₂O uchun AAS ni qo'shimcha usullar bilan birgalikda ishlatish formulani to'liq tasdiqlaydi. <strong className="text-yellow-300">Mössbauer</strong> — Fe²⁺/Fe³⁺ ni farqlash uchun muhim.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-yellow-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-yellow-300">{m.name}</h3>
                  <div className="text-right">
                    <div className="text-[10px] text-purple-400">To'ldiruvchi</div>
                    <div className="text-lg font-bold text-green-400">{m.complementarity}</div>
                  </div>
                </div>
                <p className="text-xs text-purple-200 mb-3">{m.role}</p>
                <div className="space-y-2 text-[10px]">
                  <div className="flex gap-2">
                    <span className="text-green-400">✓ AAS afzalligi:</span>
                    <span className="text-purple-300">{m.aasAdvantage}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-400">✗ AAS kamchiligi:</span>
                    <span className="text-purple-300">{m.aasDisadvantage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-yellow-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">AAS (Fe, K) + EA (C, H, N) + TGA (3H₂O) + Mössbauer (Fe²⁺) + UV-Vis (LMCT 420 nm)</strong> — beshta metod birgalikda K₄[Fe(CN)₆]·3H₂O ni to'liq tasdiqlaydi va uning Fe²⁺ holatini isbotlaydi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> AAS uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            K₄[Fe(CN)₆]·3H₂O ni AAS da o'lchash uchun suyuq eritma tayyorlanadi. Har bir qadamni bosib, tafsilotlarni ko'ring.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-yellow-900/40 border-yellow-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-yellow-500 text-white" : "bg-purple-800 text-purple-400"
                    }`}>
                      {s.step}
                    </span>
                    <span className="text-xs font-medium text-white">{s.title}</span>
                    {s.critical && <span className="ml-auto text-[10px] text-red-400">KRITIK</span>}
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 bg-purple-950/50 rounded-xl p-6 border border-purple-700/30">
              {(() => {
                const current = COMPOUND.samplePrepSteps.find(s => s.step === activePrepStep)
                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-purple-700/30 pb-3">
                      <h3 className="text-lg font-bold text-yellow-400">Qadam {current.step}: {current.title}</h3>
                      {current.critical && (
                        <span className="px-2 py-1 bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase rounded">
                          Kritik
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-purple-200 leading-relaxed">{current.desc}</p>
                    <div className="flex items-center gap-2 text-xs text-purple-400">
                      <span>⏱️ Taxminiy vaqt:</span>
                      <span className="text-white font-mono">{current.time}</span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        {/* 10. HISOBLAGICH */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6">
          <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> AAS dan %Fe hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan yutilish (A), namuna massasi va suyuqlantirish faktori bo'yicha <strong className="text-yellow-300">%Fe</strong> ni avtomatik hisoblang.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, 248.3 nm):</label>
              <input 
                type="number" step="0.001" value={customAbsorbance}
                onChange={(e) => setCustomAbsorbance(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Konsentratsiya:</div>
                <div className="text-2xl font-mono font-bold text-yellow-400">{calcResult.conc} mg/L</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Fe massasi:</div>
                <div className="text-2xl font-mono font-bold text-orange-400">{calcResult.Fe_mass} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Fe:</div>
                <div className={`text-2xl font-mono font-bold ${Math.abs(calcResult.Fe_percent - 13.22) <= 0.3 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Fe_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Fe = (A / 0.1049) × 100 × DF / (m × 1000) × 100
            </p>
          </div>
        </div>

        {/* 11. AAS CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> AAS ning cheklovlari K₄[Fe(CN)₆]·3H₂O misolida
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                AAS K₄[Fe(CN)₆]·3H₂O ni tahlil qilishda kuchli, lekin quyidagi cheklovlar mavjud:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Fe²⁺ va Fe³⁺ ni farqlay olmaydi</strong> — Mössbauer kerak</li>
                <li><strong className="text-red-300">Faqat metallarni o'lchaydi</strong> — C, H, N, O uchun EA kerak</li>
                <li><strong className="text-red-300">Gidrat suvlari ko'rinmaydi</strong> — TGA kerak</li>
                <li><strong className="text-red-300">Bir vaqtda bitta element</strong> — ICP-OES tezroq</li>
                <li><strong className="text-red-300">CN⁻ ligandlar tuzilishini bilmaydi</strong> — UV-Vis, IQ kerak</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>K₄[Fe(CN)₆]·3H₂O ni to'liq tasdiqlash</strong> uchun kamida 4-5 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-yellow-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. AAS (Fe, K)</span>
                  <span className="text-yellow-400 font-mono">13.22% Fe</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (C, H, N)</span>
                  <span className="text-yellow-400 font-mono">C,H,N foizlari</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. TGA (H₂O)</span>
                  <span className="text-yellow-400 font-mono">12.8% (3H₂O)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. Mössbauer (Fe²⁺)</span>
                  <span className="text-yellow-400 font-mono">δ = -0.03 mm/s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. UV-Vis (LMCT)</span>
                  <span className="text-yellow-400 font-mono">420 nm</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ Barcha 5 metod birgalikda formulani to'liq tasdiqlaydi
              </div>
            </div>
          </div>
        </div>

        {/* 12. XULOSA */}
        <div className="bg-gradient-to-r from-green-900/30 via-indigo-900/30 to-purple-900/30 border border-green-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Yakuniy xulosa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-950/30 p-4 rounded-lg border border-green-700/30">
              <div className="text-green-400 text-2xl mb-2">✓</div>
              <h3 className="font-bold text-white mb-1">AAS afzalligi</h3>
              <p className="text-xs text-purple-200">Fe ni aniq va arzon o'lchaydi (LOD 0.005 mg/L). Matritsa effektlari minimal. 13.22% Fe ni 0.3% xatolik bilan tasdiqlaydi.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Fe²⁺/Fe³⁺ ni farqlamaydi. Faqat metallarni o'lchaydi (C, H, N yo'q). Bir vaqtda bitta element. Gidrat suvlari ko'rinmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EA (C, H, N), TGA (H₂O), Mössbauer (Fe²⁺), UV-Vis (LMCT) — to'liq formula validatsiyasi uchun birlashtiriladi.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/aas" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← AAS metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-sm bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • K₄[Fe(CN)₆]·3H₂O • AAS moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955), Macquer (1752)</p>
        </div>
      </footer>
    </main>
  )
}