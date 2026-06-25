"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// Ni(CO)₄ (Nikel tetrakarbonil) — ELEMENT ANALIZI (EA) MAHSUS SAHIFASI
// Manbalar: IUPAC Atomic Weights 2021, Vogel's Quantitative Chemical Analysis
// Xususiyat: JUDA ZAHARLI, uchuvchan suyuqlik (bp 43°C), H YO'Q
// Maqsad: Faqat EA tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Ni: 58.693, C: 12.011, O: 15.999, H: 1.008,
  N: 14.007, S: 32.065, Fe: 55.845, Cr: 51.996, Mo: 95.950, W: 183.84, Co: 58.933, V: 50.942, Mn: 54.938
}

const CO_MOLAR_MASS = ATOMIC_MASSES.C + ATOMIC_MASSES.O  // 28.010

const COMPOUND = {
  formulaHTML: "Ni(CO)<sub>4</sub>",
  formulaPlain: "Ni(CO)4",
  iupac: "Tetrakarbonilnikel(0)",
  formulaExpanded: "NiC₄O₄",
  molarMass: 170.733,
  casNumber: "13463-39-3",
  color: "rangsiz yoki och sariq suyuqlik",
  stability: "xona haroratida uchuvchan (bp 43°C), 180°C da Ni va CO ga parchalanadi, HAVODA sekin oksidlanadi",
  
  historicalFact: {
    title: "Mond jarayoni — metallurgiya inqilobi va zaharli kashfiyot",
    text: "1890-yilda Ludwig Mond va uning hamkasblari (Carl Langer va Friedrich Quincke) nikel karbonilni kashf etishdi. Ular CO gazi Ni ustidan o'tganda g'alati uchuvchan suyuqlik hosil bo'lishini payqashdi. Bu kashfiyot 'Mond jarayoni' deb nomlangan sanoat usuliga asos bo'ldi: ifloslangan nikel Ni(CO)₄ ga aylantiriladi, so'ngra 180°C da qizdirilganda 99.99% toza Ni cho'kadi. Lekin bu kashfiyotning qorong'i tomoni bor edi — Ni(CO)₄ <strong>eng zaharli kimyoviy moddalardan biri</strong>. 1 mg/L havo konsentratsiyasi o'limga olib keladi. EA tahlilida bu birikma <strong>eng xavfli namuna</strong>: uchuvchan (kapsulani zich yopish shart), H va N yo'q (faqat C va O), zaharli (maxsus ventilyatsiya kerak). Bu EA metodining 'stress-test' namunasi — tayyorlashning barcha qiyinchiliklarini sinab ko'radi.",
    year: "1890-yil"
  },

  ligandTypes: [
    { type: "Koordinatsion CO (karbonil)", count: 4, role: "Ni(0) ga tetraedral geometriyada bog'langan, σ-donor + π-akseptor", eaImpact: "C kanalida 4 ta C, O kanalida 4 ta O — H yo'q!", lossTemp: "180°C (parchalanish)" },
    { type: "Markaziy Ni(0)", count: 1, role: "d¹⁰ konfiguratsiyasi, 18-elektron qoidasi bajariladi", eaImpact: "Yoqilg'ida Ni qoldig'i — TCD da ko'rinmaydi", lossTemp: "Qoldiq sifatida" },
    { type: "Tashqi sfera", count: 0, role: "Neytral molekula — ionlar yo'q", eaImpact: "Konduktometriyada Λ_M ≈ 0 (noelektrolit)", lossTemp: "—" }
  ],
  
  theoretical: {
    C:  { atoms: 4, mass: 48.044,  percent: 28.144, source: "4×CO (4×C)", eaChannel: "CO₂ sifatida detektlanadi" },
    H:  { atoms: 0, mass: 0.000,   percent: 0.000,  source: "Vodorod YO'Q", eaChannel: "❌ Mavjud emas" },
    N:  { atoms: 0, mass: 0.000,   percent: 0.000,  source: "Azot YO'Q", eaChannel: "❌ Mavjud emas" },
    S:  { atoms: 0, mass: 0.000,   percent: 0.000,  source: "Sulfur YO'Q", eaChannel: "❌ Mavjud emas" },
    O:  { atoms: 4, mass: 63.996,  percent: 37.485, source: "4×CO (4×O)", eaChannel: "CO sifatida (maxsus O rejimi)" },
    Ni: { atoms: 1, mass: 58.693,  percent: 34.377, source: "Markaziy Ni(0)", eaChannel: "Yoqilg'ida Ni qoldig'i (ICP kerak)" }
  },

  experimentalRuns: [
    { id: "EA-24-401", date: "2025-01-10", method: "CHNS-O FlashSmart (O mode)", C: 28.10, H: 0.02, N: 0.01, S: 0.01, recovery: 65.6, note: "Toza Ni(CO)₄ — maxsus muhrda tayyorlangan" },
    { id: "EA-24-402", date: "2025-01-10", method: "CHNS-O FlashSmart (O mode)", C: 28.18, H: 0.03, N: 0.00, S: 0.02, recovery: 65.7, note: "Qayta o'lchov" },
    { id: "EA-24-403", date: "2025-01-11", method: "CHNS-O Vario EL",        C: 27.50, H: 0.05, N: 0.02, S: 0.03, recovery: 65.0, note: "1 hafta saqlangan (qisman parchalangan)" },
    { id: "EA-24-404", date: "2025-01-11", method: "CHNS-O FlashSmart",       C: 24.80, H: 0.08, N: 0.03, S: 0.04, recovery: 62.3, note: "CO yo'qotgan (Ni(CO)₃ aralashmasi)" },
    { id: "EA-24-405", date: "2025-01-12", method: "CHNS-O FlashSmart (O mode)", C: 28.14, H: 0.85, N: 0.02, S: 0.01, recovery: 66.5, note: "Kapsulada nam yutilgan — H chiqdi!" },
    { id: "EA-24-406", date: "2025-01-12", method: "CHNS-O FlashSmart",       C: 28.12, H: 0.01, N: 0.00, S: 0.02, recovery: 65.6, note: "Fe(CO)₅ bilan aralashmagan" },
    { id: "BLANK-11",  date: "2025-01-10", method: "Blank (Empty Capsule)",   C: 0.00, H: 0.02, N: 0.01, S: 0.00, recovery: 0.03, note: "Tizim tozaligi" },
    { id: "STD-SULFA", date: "2025-01-10", method: "Standard: Sulfanilamide", C: 41.82, H: 4.69, N: 16.28, S: 18.51, recovery: 99.9, note: "NIST kalibrlash standarti" }
  ],

  tgaSteps: [
    { start: -20, end: 43,  loss: 0.0,   event: "Suyuq holat (past harorat)", color: "#10b981", eaCorrelation: "EA uchun — kapsulada, o'zgarish yo'q" },
    { start: 43,  end: 100, loss: 100.0, event: "To'liq bug'lanish (ochiq)", color: "#3b82f6", eaCorrelation: "Yopiq kapsulada bug'lanmaydi" },
    { start: 100, end: 180, loss: 0.0,   event: "Gaz holatda barqaror", color: "#f59e0b", eaCorrelation: "C va O signallari barqaror" },
    { start: 180, end: 250, loss: 65.6,  event: "Ni(CO)₄ → Ni + 4CO (parchalanish)", color: "#ef4444", eaCorrelation: "C: 28.1% → 0%, O: 37.5% → 0%" },
    { start: 250, end: 500, loss: 0.0,   event: "Ni qoldig'i (oq kukun)", color: "#6366f1", eaCorrelation: "ICP-OES bilan tasdiqlash" }
  ],

  relatedMethods: [
    { name: "IQ spektroskopiya", role: "C≡O tebranishlari (2057 cm⁻¹ — erkin CO 2143 cm⁻¹ dan past, π-backbonding sababli)", eaAdvantage: "CO koordinatsiyasini tasdiqlaydi", eaDisadvantage: "C va O miqdorini bermaydi", complementarity: "92%" },
    { name: "Mass-spektrometriya (EI)", role: "M⁺ = 170, fragmentlar: Ni(CO)₃⁺ (142), Ni(CO)₂⁺ (114), NiCO⁺ (86), Ni⁺ (58)", eaAdvantage: "Molekulyar massani to'g'ridan-to'g'ri ko'rsatadi", eaDisadvantage: "Uchuvchan moddalar uchun qiyin", complementarity: "95%" },
    { name: "UV-Vis spektroskopiya", role: "MLCT (Metall→Ligand Charge Transfer) ~260 nm, d-d o'tishlar ~360 nm", eaAdvantage: "Ni(0) holatini tasdiqlaydi", eaDisadvantage: "Elementar tarkib bermaydi", complementarity: "85%" },
    { name: "ICP-OES", role: "Ni miqdorini ppb darajasida o'lchaydi", eaAdvantage: "Metall tarkibini to'g'ridan-to'g'ri beradi (34.4%)", eaDisadvantage: "CO ligandlarini o'lchamaydi", complementarity: "88%" },
    { name: "¹³C YaMR", role: "¹³C signali (δ = 192 ppm — CO koordinatsiyasi)", eaAdvantage: "CO tabiatini tasdiqlaydi", eaDisadvantage: "Miqdoriy emas", complementarity: "90%" }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ XAVFSIZLIK!", desc: "Ni(CO)₄ JUDA ZAHARLI! Faqat tortish shkafi (fume hood) ichida, to'liq himoya kiyimida ishlanadi. Zaharli gaz detektori yoqiladi.", time: "doimiy", critical: true },
    { step: 2, title: "Sovuq muhit", desc: "Barcha idishlar -20°C da sovutiladi. Ni(CO)₄ xona haroratida tez bug'lanadi (bp 43°C).", time: "10 daq", critical: true },
    { step: 3, title: "Maxsus kapsula", desc: "Standart Sn kapsula emas — maxsus muhrlangan Al yoki Pt kapsuladan foydalaniladi. Suyuqlikni mikro-shprits bilan kiritiladi.", time: "5 daq", critical: true },
    { step: 4, title: "Zich muhrlash", desc: "Kapsula darhol lazer yoki press bilan muhrlanadi. Aks holda namuna bug'lanib, EA natijalari noto'g'ri chiqadi.", time: "30 son", critical: true },
    { step: 5, title: "Sovuq saqlash", desc: "Analizgacha quruq muz (-78°C) da saqlanadi.", time: "<1 soat", critical: true },
    { step: 6, title: "CHNS-O (O rejimi)", desc: "O rejimida analiz qilinadi (CO deteksiyasi uchun). Standart CHNS rejimida O o'lchanmaydi!", time: "5-8 daq", critical: false }
  ],

  combustionPrinciple: {
    oxidationTemp: "1050°C",
    reductionTemp: "650°C (Cu)",
    products: {
      C: "CO₂ (TCD detektori)",
      H: "H₂O (TCD detektori) — YO'Q",
      N: "N₂ (TCD detektori) — YO'Q",
      S: "SO₂ (TCD detektori) — YO'Q",
      O: "CO (TCD detektori, maxsus O rejimi)",
      Ni: "Ni metali (qattiq qoldiq)"
    },
    equations: [
      { reactant: "Ni(CO)₄", process: "+ O₂ (1050°C)", products: "Ni (qattiq) + 4CO₂" },
      { reactant: "CO (4×ligand)", process: "→ O₂", products: "4CO₂ — barchasi TCD da detektlanadi" },
      { reactant: "Ni(0)", process: "Kamerasida qoldiq", products: "Ni metali — ICP-OES bilan tasdiqlanadi" }
    ]
  },

  // Metall karbonillar oilasi
  metalCarbonyls: [
    { metal: "V", formula: "V(CO)₆", electrons: "17", molarMass: 215.00, color: "qora", stability: "paramagnit, noyob 17e⁻", geometry: "oktaedr", c_pct: 33.51, o_pct: 44.67, metal_pct: 23.70 },
    { metal: "Cr", formula: "Cr(CO)₆", electrons: "18", molarMass: 220.02, color: "oq", stability: "18e⁻, sublimatsiya", geometry: "oktaedr", c_pct: 32.74, o_pct: 43.64, metal_pct: 23.63 },
    { metal: "Mn", formula: "Mn₂(CO)₁₀", electrons: "18×2", molarMass: 390.02, color: "sariq", stability: "dimer, 18e⁻", geometry: "oktaedr (Mn-Mn)", c_pct: 30.80, o_pct: 41.02, metal_pct: 28.18 },
    { metal: "Fe", formula: "Fe(CO)₅", electrons: "18", molarMass: 195.90, color: "sariq suyuqlik", stability: "18e⁻, uchuvchan", geometry: "trigonal bipiramida", c_pct: 30.65, o_pct: 40.84, metal_pct: 28.51 },
    { metal: "Co", formula: "Co₂(CO)₈", electrons: "18×2", molarMass: 341.94, color: "to'q sariq", stability: "dimer", geometry: "Co-Co bog'li", c_pct: 28.10, o_pct: 37.46, metal_pct: 34.45 },
    { metal: "Ni", formula: "Ni(CO)₄", electrons: "18", molarMass: 170.73, color: "rangsiz ✓", stability: "18e⁻, juda uchuvchan", geometry: "tetraedr", c_pct: 28.14, o_pct: 37.49, metal_pct: 34.38 },
    { metal: "Mo", formula: "Mo(CO)₆", electrons: "18", molarMass: 264.00, color: "oq", stability: "18e⁻, sublimatsiya", geometry: "oktaedr", c_pct: 27.30, o_pct: 36.36, metal_pct: 36.34 },
    { metal: "W", formula: "W(CO)₆", electrons: "18", molarMass: 351.90, color: "oq", stability: "18e⁻, eng barqaror", geometry: "oktaedr", c_pct: 20.48, o_pct: 27.27, metal_pct: 52.25 }
  ],

  safetyInfo: {
    ld50: "3 ppm (4 soat, kalamush)",
    exposureLimit: "0.001 ppm (8 soat TWA)",
    symptoms: "bosh og'rig'i, ko'ngil aynishi, o'pka shishi, o'lim",
    antidote: "maxsus antidot yo'q — simptomatik davolash",
    decontamination: "10% NaOCl (bleach) bilan parchalanadi"
  }
}

function calculateCarbonylProperties(metalMass, nCO) {
  const total = metalMass + nCO * CO_MOLAR_MASS
  const cMass = nCO * ATOMIC_MASSES.C
  const oMass = nCO * ATOMIC_MASSES.O
  return {
    total: parseFloat(total.toFixed(3)),
    C_pct: parseFloat(((cMass / total) * 100).toFixed(3)),
    O_pct: parseFloat(((oMass / total) * 100).toFixed(3)),
    metal_pct: parseFloat(((metalMass / total) * 100).toFixed(3)),
    coPct: parseFloat(((nCO * CO_MOLAR_MASS / total) * 100).toFixed(2))
  }
}

// Ni(CO)₄-nLₙ substitütsiya kalkulyatori
function calculateSubstitutedProperties(nCO) {
  const total = ATOMIC_MASSES.Ni + nCO * CO_MOLAR_MASS
  const cMass = nCO * ATOMIC_MASSES.C
  const oMass = nCO * ATOMIC_MASSES.O
  return {
    total: parseFloat(total.toFixed(3)),
    C_pct: parseFloat(((cMass / total) * 100).toFixed(3)),
    O_pct: parseFloat(((oMass / total) * 100).toFixed(3)),
    Ni_pct: parseFloat(((ATOMIC_MASSES.Ni / total) * 100).toFixed(3)),
    name: nCO === 4 ? "Ni(CO)₄ ✓" : nCO === 3 ? "Ni(CO)₃" : nCO === 2 ? "Ni(CO)₂" : nCO === 1 ? "NiCO" : "Ni"
  }
}

export default function NiCO4Page() {
  const [activeRun, setActiveRun] = useState("EA-24-401")
  const [selectedMetal, setSelectedMetal] = useState(5) // Ni = index 5
  const [nCO, setNCO] = useState(4)
  const [customC, setCustomC] = useState(28.14)
  const [selectedLigandType, setSelectedLigandType] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [showSafetyModal, setShowSafetyModal] = useState(true) // Avtomatik ochiladi!

  const metalCalc = useMemo(() => 
    calculateCarbonylProperties(ATOMIC_MASSES[COMPOUND.metalCarbonyls[selectedMetal].metal], 
      COMPOUND.metalCarbonyls[selectedMetal].formula.match(/\(CO\)(\d+)/)?.[1] ? 
        parseInt(COMPOUND.metalCarbonyls[selectedMetal].formula.match(/\(CO\)(\d+)/)[1]) : 
        COMPOUND.metalCarbonyls[selectedMetal].formula.includes("₁₀") ? 10 : 
        COMPOUND.metalCarbonyls[selectedMetal].formula.includes("₈") ? 8 :
        COMPOUND.metalCarbonyls[selectedMetal].formula.includes("₆") ? 6 :
        COMPOUND.metalCarbonyls[selectedMetal].formula.includes("₅") ? 5 : 4
    ), 
    [selectedMetal]
  )
  
  const substitutedCalc = useMemo(() => calculateSubstitutedProperties(nCO), [nCO])

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const dC = Math.abs(run.C - COMPOUND.theoretical.C.percent)
  const statusColor = dC <= 0.3 ? "text-green-400" : dC <= 1.0 ? "text-yellow-400" : "text-red-400"

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      
      {/* XAVFSIZLIK MODALI - Avtomatik ochiladi */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-red-950 border-2 border-red-500 rounded-2xl p-6 max-w-lg w-full animate-pulse">
            <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
              <span className="text-4xl">☠️</span> DIQQAT: JUDA ZAHARLI!
            </h3>
            <p className="text-sm text-red-100 leading-relaxed mb-3">
              <strong className="text-white">Ni(CO)₄</strong> — insoniyatga ma'lum <strong className="text-red-300">eng zaharli kimyoviy moddalardan biri</strong>.
            </p>
            <div className="bg-red-900/40 p-4 rounded-lg font-mono text-xs mb-3 space-y-1">
              <div><span className="text-red-400">LD50:</span> <span className="text-white">3 ppm (4 soat)</span></div>
              <div><span className="text-red-400">Exposure limit:</span> <span className="text-white">0.001 ppm</span></div>
              <div><span className="text-red-400">Antidot:</span> <span className="text-white">YO'Q!</span></div>
            </div>
            <p className="text-xs text-red-200 italic mb-4">
              Bu sahifa <strong>faqat ilmiy ma'lumot</strong> uchun. Haqiqiy laboratoriya ishida to'liq himoya talab etiladi.
            </p>
            <button 
              onClick={() => setShowSafetyModal(false)}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
            >
              Tushundim — davom etish
            </button>
          </div>
        </div>
      )}
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/element-analiz" className="hover:text-purple-300">Element Analiz (EA)</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
            <span className="text-purple-600">›</span>
            <span className="text-yellow-400 font-semibold">Ni(CO)₄</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-red-600 px-2 py-1 rounded ml-2 animate-pulse">☠️ ZAHARLI</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                {COMPOUND.iupac} • M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
              </p>
              <p className="text-purple-500 text-xs mt-1 font-mono">
                Kengaytirilgan: {COMPOUND.formulaExpanded}
              </p>
              <p className="text-purple-500 text-xs mt-1">
                {COMPOUND.color} • {COMPOUND.stability}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide animate-pulse">Juda Zaharli</span>
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Metall Karbonil</span>
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Uchuvchan (bp 43°C)</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Ni(0) d¹⁰</span>
              </div>
            </div>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Barcha birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-purple-900/40 border border-yellow-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (EA uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">Ni(CO)₄</strong> — nikel(0) ning tetraedral karbonil kompleksi, birinchi kashf etilgan metall karbonil (1890). EA tahlilida <strong className="text-yellow-300">eng qiyin va xavfli namuna</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-yellow-500 text-xs md:text-sm">
                <li><strong className="text-red-400">JUDA ZAHARLI</strong> — maxsus himoya choralar zarur</li>
                <li><strong className="text-white">Juda uchuvchan</strong> — bp 43°C, kapsulani muhrlash shart</li>
                <li>Faqat <strong className="text-white">C (28.1%) va O (37.5%)</strong> — H va N mutlaqo yo'q</li>
                <li>Ni (34.4%) — yoqilg'ida qattiq qoldiq sifatida qoladi</li>
                <li><strong className="text-white">O ni o'lchash uchun maxsus rejim</strong> kerak (standart CHNS emas, CHNS-O)</li>
                <li>Recovery ~65.6% — C + O yig'indisi</li>
              </ul>
            </div>
            
            {/* Tarixiy fakt */}
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

        {/* 1b. XAVFSIZLIK PANELI */}
        <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-2 border-red-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">☠️</span> Xavfsizlik ma'lumotlari (EA uchun muhim)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-950/40 p-4 rounded-xl border border-red-700/30">
              <div className="text-xs text-red-400 uppercase mb-2">Toksiklik</div>
              <div className="text-xl font-mono text-white">{COMPOUND.safetyInfo.ld50}</div>
              <div className="text-xs text-red-300 mt-2">Juda past — 1 mg/L o'lim</div>
            </div>
            <div className="bg-red-950/40 p-4 rounded-xl border border-red-700/30">
              <div className="text-xs text-red-400 uppercase mb-2">Ruxsat etilgan</div>
              <div className="text-xl font-mono text-white">{COMPOUND.safetyInfo.exposureLimit}</div>
              <div className="text-xs text-red-300 mt-2">Eng past chegaralardan biri</div>
            </div>
            <div className="bg-red-950/40 p-4 rounded-xl border border-red-700/30">
              <div className="text-xs text-red-400 uppercase mb-2">Antidot</div>
              <div className="text-xl font-mono text-red-400">YO'Q</div>
              <div className="text-xs text-red-300 mt-2">Simptomatik davolash</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-red-900/20 rounded-xl border border-red-700/30">
            <p className="text-xs text-red-200 leading-relaxed">
              <strong className="text-white">EA tayyorlashdagi maxsus choralar:</strong> Tortish shkafi (fume hood), to'liq himoya kiyimi, zaharli gaz detektori, maxsus muhrlangan kapsulalar, quruq muzda saqlash.
            </p>
          </div>
        </div>

        {/* 2. EA PRINSIPI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔥</span> EA ning ishlash prinsipi — CHNS-O (maxsus O rejimi)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            [Ni(CO)₄] EA uchun <strong className="text-yellow-300">noyob holat</strong> — tarkibida <strong className="text-yellow-300">C va O bor, lekin H va N yo'q</strong>. Standart CHNS rejimi emas, <strong className="text-yellow-300">CHNS-O (O mode)</strong> ishlatilishi shart — O ni CO sifatida o'lchash uchun.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">1. Yoqish kamerasi</div>
              <div className="text-2xl font-mono text-orange-400">{COMPOUND.combustionPrinciple.oxidationTemp}</div>
              <div className="text-xs text-purple-300 mt-2">O₂ + 1050°C — CO → CO₂</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">2. Reduksiya kamerasi</div>
              <div className="text-2xl font-mono text-red-400">{COMPOUND.combustionPrinciple.reductionTemp}</div>
              <div className="text-xs text-purple-300 mt-2">Cu — NOₓ larni N₂ ga (N YO'Q)</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">3. Deteksiya</div>
              <div className="text-2xl font-mono text-blue-400">C + O</div>
              <div className="text-xs text-purple-300 mt-2">CO₂ (28.1%) + CO (37.5%)</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold text-xs uppercase mb-3">Bu birikma uchun yoqish reaksiyasi:</h3>
            <div className="space-y-3 font-mono text-xs">
              {COMPOUND.combustionPrinciple.equations.map((eq, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-purple-900/30 rounded border-l-4 border-yellow-500">
                  <span className="text-white font-bold">{eq.reactant}</span>
                  <span className="text-yellow-500">{eq.process}</span>
                  <span className="text-purple-600">→</span>
                  <span className="text-green-300">{eq.products}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. NAZARIY TARKIB */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📐</span> Nazariy element tarkibi (CHNS-O + Ni)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            E'tibor bering: <strong className="text-yellow-300">C va O bor, H va N mutlaqo yo'q</strong> — bu EA uchun noyob holat.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 text-xs uppercase tracking-wider">
                  <th className="py-3 text-left pl-2">Element</th>
                  <th className="py-3 text-center">Atomlar</th>
                  <th className="py-3 text-center">Atom M.</th>
                  <th className="py-3 text-center">Umumiy</th>
                  <th className="py-3 text-center text-yellow-400">% (m/m)</th>
                  <th className="py-3 text-center">EA kanali</th>
                  <th className="py-3 text-left pl-4">Manba</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => {
                  const isZero = d.atoms === 0
                  return (
                    <tr key={el} className={`border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors ${isZero ? 'opacity-60' : ''}`}>
                      <td className="py-3 pl-2 font-bold text-yellow-400">{el}</td>
                      <td className="py-3 text-center font-mono">{d.atoms}</td>
                      <td className="py-3 text-center font-mono text-xs opacity-70">
                        {ATOMIC_MASSES[el]?.toFixed(3) || "—"}
                      </td>
                      <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                      <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                      <td className="py-3 text-center text-[10px] text-purple-400">{d.eaChannel}</td>
                      <td className="py-3 pl-4 text-[10px] text-purple-500 italic">{d.source}</td>
                    </tr>
                  )
                })}
                <tr className="bg-yellow-900/20 font-bold border-t border-yellow-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center text-white">9</td>
                  <td className="py-3"></td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3b. KARBONIL TUIZILISHI INFO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔗</span> CO ligandining xususiyatlari (σ-donor + π-akseptor)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/50 p-5 rounded-xl border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold text-sm mb-3">CO ligandining noyob tabiatı:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Bog'lanish:</span>
                  <span className="text-white font-mono">σ-donor + π-akseptor</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Geometriya:</span>
                  <span className="text-white font-mono">Tetraedral (Td)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Ni-C masofa:</span>
                  <span className="text-white font-mono">1.82 Å</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">C-O masofa:</span>
                  <span className="text-white font-mono">1.15 Å</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">IR ν(CO):</span>
                  <span className="text-white font-mono">2057 cm⁻¹</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-950/50 p-5 rounded-xl border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold text-sm mb-3">EA uchun ahamiyati:</h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Har bir CO ligand EA da <strong className="text-white">1 ta C va 1 ta O</strong> beradi. 4 ta CO bo'lgani uchun jami <strong className="text-yellow-300">4C, 4O</strong> — bu C va O kanallarini to'ldiradi. <strong className="text-red-300">H va N yo'q</strong> — bu EA uchun noyob holat.
              </p>
              <div className="mt-4 p-3 bg-yellow-900/20 rounded border border-yellow-700/30">
                <p className="text-[11px] text-purple-200 italic">
                  18-elektron qoidasi: Ni(0) d¹⁰ (10e⁻) + 4 × CO (2e⁻ each) = 18 elektron — maksimal barqarorlik. Lekin Ni(CO)₄ uchuvchan va zaharli!
                </p>
              </div>
              <p className="text-xs text-purple-300 mt-3">
                <strong className="text-yellow-300">π-backbonding:</strong> Ni(0) d-elektronlarini CO ning π* orbitaliga qaytaradi. Bu C-O bog'ini zaiflashtiradi (ν = 2057 cm⁻¹, erkin CO = 2143 cm⁻¹).
              </p>
            </div>
          </div>
        </div>

        {/* 4. METALL KARBONILLAR TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🧬</span> Metall karbonillar oilasi — 18-elektron qoidasi
            </h2>
            <span className="text-xs text-yellow-400 bg-yellow-950/50 px-3 py-1 rounded border border-yellow-700/30">
              Joriy: {COMPOUND.metalCarbonyls[selectedMetal].formula}
            </span>
          </div>

          <p className="text-sm text-purple-300 mb-6">
            Barcha metall karbonillar <strong className="text-yellow-300">18-elektron qoidasi</strong>ga bo'ysunadi. Metall o'zgarganda C% va O% kamayadi, chunki M ning hissasi ortadi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
                <label className="block text-xs text-purple-400 mb-2">Metall karbonilni tanlang:</label>
                <div className="grid grid-cols-2 gap-2">
                  {COMPOUND.metalCarbonyls.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedMetal(i)}
                      className={`p-2 rounded border transition-all text-xs ${
                        selectedMetal === i
                          ? "bg-yellow-900/40 border-yellow-500 text-white"
                          : "bg-purple-900/20 border-purple-700/30 text-purple-300 hover:border-yellow-500/50"
                      }`}
                    >
                      <div className="font-bold">{m.formula}</div>
                      <div className="text-[10px] text-purple-400">{m.electrons}e⁻ • {m.geometry}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">Mol. massa</div>
                    <div className="text-xl font-mono text-white mt-1">{metalCalc.total}</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-yellow-400 uppercase">CO ulushi</div>
                    <div className="text-xl font-mono text-yellow-400 mt-1">{metalCalc.coPct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-yellow-400 uppercase">%C</div>
                    <div className="text-xl font-mono text-yellow-400 mt-1">{metalCalc.C_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-red-400 uppercase">%O</div>
                    <div className="text-xl font-mono text-red-400 mt-1">{metalCalc.O_pct}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80 flex items-end justify-center">
              <svg viewBox="0 0 400 240" className="w-full h-full overflow-visible">
                {[0, 10, 20, 30, 40, 50].map(v => (
                  <g key={v}>
                    <line x1="40" y1={210 - (v/50)*180} x2="380" y2={210 - (v/50)*180} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="3,3" />
                    <text x="35" y={214 - (v/50)*180} textAnchor="end" fontSize="9" fill="#a78bfa">{v}%</text>
                  </g>
                ))}
                
                <polyline 
                  fill="none" stroke="#eab308" strokeWidth="2.5" opacity="0.7"
                  points={COMPOUND.metalCarbonyls.map((m, i) => {
                    const props = calculateCarbonylProperties(
                      ATOMIC_MASSES[m.metal], 
                      m.formula.match(/\(CO\)(\d+)/)?.[1] ? parseInt(m.formula.match(/\(CO\)(\d+)/)[1]) : 
                      m.formula.includes("₁₀") ? 10 : m.formula.includes("₈") ? 8 : 
                      m.formula.includes("₆") ? 6 : m.formula.includes("₅") ? 5 : 4
                    )
                    const x = 40 + (i/(COMPOUND.metalCarbonyls.length-1)) * 340
                    const y = 210 - (props.C_pct / 50) * 180
                    return `${x},${y}`
                  }).join(" ")}
                />

                {COMPOUND.metalCarbonyls.map((m, i) => {
                  const props = calculateCarbonylProperties(
                    ATOMIC_MASSES[m.metal], 
                    m.formula.match(/\(CO\)(\d+)/)?.[1] ? parseInt(m.formula.match(/\(CO\)(\d+)/)[1]) : 
                    m.formula.includes("₁₀") ? 10 : m.formula.includes("₈") ? 8 : 
                    m.formula.includes("₆") ? 6 : m.formula.includes("₅") ? 5 : 4
                  )
                  const x = 40 + (i/(COMPOUND.metalCarbonyls.length-1)) * 340
                  const y = 210 - (props.C_pct / 50) * 180
                  const isActive = i === selectedMetal
                  return (
                    <g key={i} style={{ cursor: 'pointer' }} onClick={() => setSelectedMetal(i)}>
                      <circle cx={x} cy={y} r={isActive ? 7 : 4} 
                        fill={isActive ? "#fbbf24" : "#eab308"} 
                        stroke={isActive ? "#fff" : "#eab308"} 
                        strokeWidth={isActive ? 2 : 1} />
                      {isActive && (
                        <>
                          <line x1={x} y1={y} x2={x} y2="210" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
                          <rect x={x-34} y={y-32} width="68" height="22" rx="4" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1" />
                          <text x={x} y={y-17} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">%C: {props.C_pct.toFixed(2)}</text>
                        </>
                      )}
                    </g>
                  )
                })}

                <line x1="40" y1="210" x2="380" y2="210" stroke="#a78bfa" strokeWidth="1" />
                {COMPOUND.metalCarbonyls.map((m, i) => (
                  <text 
                    key={i} 
                    x={40 + (i/(COMPOUND.metalCarbonyls.length-1))*340} 
                    y="225" 
                    textAnchor="middle" 
                    fontSize="9" 
                    fill={i===selectedMetal ? "#fbbf24" : "#64748b"} 
                    fontWeight={i===selectedMetal ? "bold" : "normal"}
                  >
                    {m.metal}
                  </text>
                ))}
                <text x="210" y="238" textAnchor="middle" fontSize="9" fill="#a78bfa">Metall (M) | Metall karbonillar oilasi</text>
              </svg>
            </div>
          </div>
        </div>

        {/* 5. KARBONILLAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>📊</span> Barcha metall karbonillari EA natijalari
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Har bir karbonil uchun EA faqat C va O ni ko'rsatadi. Metall og'irligi ortgani sari C% va O% kamayadi.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 uppercase tracking-wider">
                  <th className="py-2 text-left pl-2">Karbonil</th>
                  <th className="py-2 text-center">M (g/mol)</th>
                  <th className="py-2 text-center text-yellow-400">%C</th>
                  <th className="py-2 text-center text-red-400">%O</th>
                  <th className="py-2 text-center text-purple-400">%M</th>
                  <th className="py-2 text-center">e⁻</th>
                  <th className="py-2 text-center">Geometriya</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.metalCarbonyls.map((m, i) => {
                  const props = calculateCarbonylProperties(
                    ATOMIC_MASSES[m.metal], 
                    m.formula.match(/\(CO\)(\d+)/)?.[1] ? parseInt(m.formula.match(/\(CO\)(\d+)/)[1]) : 
                    m.formula.includes("₁₀") ? 10 : m.formula.includes("₈") ? 8 : 
                    m.formula.includes("₆") ? 6 : m.formula.includes("₅") ? 5 : 4
                  )
                  const isTarget = m.metal === "Ni"
                  const isCurrent = i === selectedMetal
                  return (
                    <tr 
                      key={i}
                      onClick={() => setSelectedMetal(i)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-yellow-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-yellow-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {m.formula}
                      </td>
                      <td className="py-2 text-center font-mono">{props.total}</td>
                      <td className="py-2 text-center font-mono text-yellow-400 font-bold">{props.C_pct}</td>
                      <td className="py-2 text-center font-mono text-red-400">{props.O_pct}</td>
                      <td className="py-2 text-center font-mono text-purple-400">{props.metal_pct}</td>
                      <td className="py-2 text-center font-mono text-purple-400">{m.electrons}</td>
                      <td className="py-2 text-center text-[10px]">{m.geometry}</td>
                      <td className="py-2 text-[10px] italic text-purple-400">
                        {isTarget ? "✓ Maqsad" : isCurrent ? "🎯 Joriy" : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5b. SUBSTITÜTSIYA KALKULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🔧</span> CO yo'qotish simulyatsiyasi
            </h2>
            <span className="text-xs text-yellow-400 bg-yellow-950/50 px-3 py-1 rounded border border-yellow-700/30">
              n (CO) = {nCO}
            </span>
          </div>

          <p className="text-sm text-purple-300 mb-6">
            Ni(CO)₄ ning CO ligandlari bosqichma-bosqich yo'qolganda <strong className="text-yellow-300">C% va O%</strong> chiziqli kamayadi. Bu EA orqali parchalanish darajasini aniqlash imkonini beradi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-purple-950/60 p-6 rounded-xl border border-purple-700/30">
              <label className="block text-xs text-purple-400 mb-2">Qolgan CO ligandlari soni:</label>
              <input 
                type="range" min="0" max="4" step="1" 
                value={nCO} 
                onChange={(e) => setNCO(Number(e.target.value))}
                className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 mb-2"
              />
              <div className="flex justify-between text-xs font-mono text-purple-500 mb-6">
                <span>0 (Ni)</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4 (✓)</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                  <div className="text-[10px] text-purple-400 uppercase">Mol. massa</div>
                  <div className="text-xl font-mono text-white mt-1">{substitutedCalc.total}</div>
                </div>
                <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                  <div className="text-[10px] text-red-400 uppercase">%Ni</div>
                  <div className="text-xl font-mono text-red-400 mt-1">{substitutedCalc.Ni_pct}%</div>
                </div>
                <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                  <div className="text-[10px] text-yellow-400 uppercase">%C</div>
                  <div className="text-xl font-mono text-yellow-400 mt-1">{substitutedCalc.C_pct}%</div>
                </div>
                <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                  <div className="text-[10px] text-red-400 uppercase">%O</div>
                  <div className="text-xl font-mono text-red-400 mt-1">{substitutedCalc.O_pct}%</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-900/20 rounded border border-yellow-700/30">
                <p className="text-[11px] text-purple-200">
                  <strong className="text-yellow-300">Hozirgi nom:</strong> {substitutedCalc.name}
                </p>
              </div>
            </div>

            <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold text-xs uppercase mb-3">Ligand turlari:</h3>
              <div className="space-y-2">
                {COMPOUND.ligandTypes.map((w, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedLigandType(i)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedLigandType === i 
                        ? "bg-yellow-900/40 border-yellow-500" 
                        : "bg-purple-900/20 border-purple-700/20 hover:border-purple-500"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white">{w.type}</span>
                      <span className="text-[10px] font-mono text-purple-400">{w.count} ta</span>
                    </div>
                    {selectedLigandType === i && (
                      <div className="mt-2 text-[10px] space-y-1 text-purple-300 border-t border-purple-700/30 pt-2">
                        <div>📍 Rol: {w.role}</div>
                        <div>🎯 EA ta'siri: {w.eaImpact}</div>
                        <div>🌡️ Parchalanish: {w.lossTemp}</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> Laboratoriya natijalari — yugurishlar
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan EA yugurishlari. <strong className="text-yellow-300">Recovery ~65.6%</strong> — bu normal, chunki Ni (34.4%) detektlanmaydi!
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono transition-all border ${
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
                <div className="text-xs text-purple-500 uppercase tracking-wider mb-1">Protokol ID</div>
                <div className="text-xl font-bold text-white font-mono">{run.id}</div>
                <div className="text-xs text-purple-400 mt-1">{run.date} • {run.method}</div>
                <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
                  📝 {run.note}
                </div>
                
                <div className="my-4 border-t border-purple-800/50"></div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-yellow-900/20 rounded border border-yellow-500/20">
                    <span className="text-sm text-yellow-400 font-medium">Carbon (C)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.C.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dC <= 0.3 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 28.14% | Δ: {dC.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Hydrogen (H)</span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{run.H.toFixed(2)}%</span>
                      <span className={`text-[9px] ${run.H <= 0.05 ? 'text-green-500' : 'text-red-400'}`}>
                        Kutilgan: 0.00%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Nitrogen (N)</span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{run.N.toFixed(2)}%</span>
                      <span className={`text-[9px] ${run.N <= 0.05 ? 'text-green-500' : 'text-red-400'}`}>
                        Kutilgan: 0.00%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-red-900/20 rounded border border-red-500/20">
                    <span className="text-sm text-red-400 font-medium">Oxygen (O)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">—</span>
                      <span className={`text-[9px] text-purple-400`}>
                        Naz: 37.49% (maxsus O rejimi kerak)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center p-2 bg-purple-900/30 rounded">
                  <span className="text-xs text-purple-400">Recovery (C only):</span>
                  <button 
                    onClick={() => setShowRecoveryModal(true)}
                    className="font-mono text-white text-sm hover:text-yellow-400 cursor-pointer"
                  >
                    {run.recovery}% ℹ️
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : dC <= 0.3
                    ? "bg-green-900/30 border-green-700/30"
                    : dC <= 1.0
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : dC <= 0.3 ? "text-green-400" : dC <= 1.0 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : dC <= 0.3 ? "✓ Toza namuna" : dC <= 1.0 ? "⚠ Chegaraviy" : "✗ Ifloslangan"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    dC <= 0.3
                      ? "Namuna tarkibi Ni(CO)₄ formulaga to'liq mos. 4 ta CO ligandi saqlangan."
                      : dC <= 1.0
                        ? "C miqdori nazariyga yaqin. Ozroq CO yo'qotilgan bo'lishi mumkin."
                        : run.H > 0.1
                          ? "Kapsula yomon muhrlangan — namlik yutilgan (H chiqdi)."
                          : run.C < 26
                            ? "CO yo'qotilgan. Ni(CO)₃ yoki Ni(CO)₂ aralashmasi bo'lishi mumkin."
                            : "Namuna ifloslangan yoki boshqa metall karbonili."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Tizim tozaligi tekshirildi. C va N nolga yaqin bo'lishi shart."
                      : "Kalibrlash standarti. C, H, N qiymatlari nazariyga mos kelishi kerak."
                  )}
                </p>
              </div>
            </div>

            {/* %C vizual taqqoslash */}
            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-yellow-400 mb-4 flex justify-between">
                <span>%C Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Target: 28.14%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const val = r.C
                  const heightPct = Math.min((val / 45) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(2)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-yellow-500/30 z-0" style={{ bottom: `${(28.144/45)*100}%` }}></div>
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
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-yellow-500/50"></span> Nazariy (28.14%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECOVERY MODAL */}
        {showRecoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowRecoveryModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <span>📈</span> Nima uchun Recovery ~65%?
              </h3>
              <p className="text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-white">Ni(CO)₄</strong> uchun recovery ~65% bo'lishi <strong className="text-yellow-300">tabiiy va normal</strong>. Sababi — formuladagi 34% ni Ni tashkil qiladi, va u standart CHNS-O da o'lchanmaydi.
              </p>
              <div className="bg-purple-900/40 p-4 rounded-lg font-mono text-xs mb-3">
                <div className="text-purple-400">EA detektlaydi:</div>
                <div className="text-green-400">C (28.14%) + O (37.49% maxsus rejimda) = <strong>65.63%</strong></div>
                <div className="mt-2 text-purple-400">EA detektlay olmaydi:</div>
                <div className="text-red-300">Ni (34.38%) = <strong>34.38%</strong></div>
                <div className="mt-2 text-white">JAMI: 100%</div>
                <div className="text-yellow-400 mt-2">✓ Recovery ~65% = Muvaffaqiyatli natija!</div>
              </div>
              <p className="text-xs text-purple-300 italic mb-4">
                Standart CHNS rejimida faqat C o'lchanadi (28.14%). O ni o'lchash uchun <strong>CHNS-O (O mode)</strong> kerak. Ni uchun <strong>ICP-OES</strong> yoki <strong>AAS</strong> qo'llaniladi.
              </p>
              <button 
                onClick={() => setShowRecoveryModal(false)}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* 7. TGA BILAN EA BOG'LIQLIGI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔥</span> TGA bilan EA ning bog'liqligi
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Ni(CO)₄ ning parchalanishi (180°C) EA da C va O kamayishi orqali ko'rinadi. TGA da esa to'liq 65.6% massa yo'qoladi (4 CO chiqib ketadi).
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
                d="M 50 20 L 220 20 Q 240 20 250 60 L 270 140 Q 280 160 300 160 L 580 160" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="135" y="15" textAnchor="middle" fill="#10b981">EA: %C=28.1, %O=37.5</text>
                
                <line x1="270" y1="140" x2="270" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="270" y="235" textAnchor="middle" fill="#ef4444">~180°C</text>
                <text x="290" y="100" fill="#ef4444">-4 CO</text>

                <text x="440" y="155" textAnchor="middle" fill="#6366f1">Ni qoldig'i (34.4%)</text>
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
                <div className="text-[10px] text-yellow-300 mt-2 italic">EA korrelyatsiyasi: {step.eaCorrelation}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-purple-900/40 border border-yellow-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> EA ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            Ni(CO)₄ uchun EA ni qo'shimcha usullar bilan birgalikda ishlatish formulani to'liq tasdiqlaydi.
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
                    <span className="text-green-400">✓ EA afzalligi:</span>
                    <span className="text-purple-300">{m.eaAdvantage}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-400">✗ EA kamchiligi:</span>
                    <span className="text-purple-300">{m.eaDisadvantage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-yellow-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">EA (C, O) + IQ (ν(CO) = 2057 cm⁻¹) + MS (M⁺=170) + ¹³C YaMR (δ=192 ppm) + ICP-OES (Ni%)</strong> — beshta metod birgalikda Ni(CO)₄ ning to'liq kimyoviy va spektroskopik tasvirini beradi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> Namuna tayyorlash bosqichlari (EA uchun — MAXSUS)
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            Ni(CO)₄ <strong className="text-red-300">JUDA ZAHARLI va uchuvchan</strong>. Tayyorlashda eng yuqori xavfsizlik talab etiladi. Har bir qadamni bosib, tafsilotlarni ko'ring.
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

        {/* 10. VALIDATSIYA KALKULYATORI */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6">
          <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Eksperimental %C validatsiya kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan %C qiymatini kiriting va karbonil holatini aniqlang.
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="block text-xs text-purple-400">O'lchangan %C qiymati:</label>
              <input 
                type="number" step="0.01" value={customC}
                onChange={(e) => setCustomC(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-yellow-500 outline-none transition-colors"
              />
              <div className="text-[10px] text-purple-500 mt-1">
                Nazariy qiymat: {COMPOUND.theoretical.C.percent.toFixed(3)}% (Ni(CO)₄)
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {(() => {
                const diff = Math.abs(customC - 28.144)
                let res = { s: "", c: "", m: "", icon: "" }
                
                if (diff < 0.5) res = { 
                  s: "NI(CO)₄", 
                  c: "text-green-400", 
                  m: "Namuna toza nikel tetrakarbonil tarkibiga ega. 4 ta CO ligandi saqlangan.",
                  icon: "✓"
                }
                else if (customC > 24 && customC < 27) res = { 
                  s: "NI(CO)₃ YOKI ARALASHMA", 
                  c: "text-yellow-400", 
                  m: "1 ta CO yo'qotilgan. Ni(CO)₃ yoki Fe(CO)₅ aralashmasi bo'lishi mumkin.",
                  icon: "⚠"
                }
                else if (customC > 20 && customC < 24) res = { 
                  s: "NI(CO)₂", 
                  c: "text-orange-400", 
                  m: "2 ta CO yo'qotilgan. Kuchli parchalanish.",
                  icon: "⚠"
                }
                else if (customC > 30 && customC < 35) res = { 
                  s: "FE(CO)₅", 
                  c: "text-orange-400", 
                  m: "C% 30.6% ga yaqin — bu Fe(CO)₅ bo'lishi mumkin!",
                  icon: "⚠"
                }
                else if (customC > 35) res = { 
                  s: "CR(CO)₆", 
                  c: "text-red-400", 
                  m: "C% yuqori — Cr(CO)₆ yoki Mo(CO)₆ bo'lishi mumkin.",
                  icon: "✗"
                }
                else res = { 
                  s: "IFLOSLANGAN", 
                  c: "text-red-400", 
                  m: "C% kutilgan oraliqda emas. Qayta tahlil kerak.",
                  icon: "✗"
                }

                return (
                  <div className="bg-purple-950/50 rounded-lg p-4 border border-purple-700/30 flex items-center gap-4">
                    <div className={`text-3xl ${res.c}`}>{res.icon}</div>
                    <div className="flex-1">
                      <div className={`text-2xl font-black tracking-tight ${res.c}`}>{res.s}</div>
                      <div className="text-sm text-purple-200 mt-1">{res.m}</div>
                      <span className="text-xs font-mono text-purple-500 mt-2 block">
                        Δ = {diff.toFixed(3)}% (Limit: ±0.5%)
                      </span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        {/* 11. QIZIQ FAKT - Ni cheklovi */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> EA ning chegarasi: Nima uchun Ni ni o'lchamaydi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                [Ni(CO)₄] da <strong className="text-white">formulaning 34% qismi Ni</strong>, va u standart CHNS-O analizatorida detektlanmaydi:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li>C → CO₂ (gaz) → TCD detektlanadi (28.14%)</li>
                <li>O → CO (gaz, maxsus rejim) → TCD detektlanadi (37.49%)</li>
                <li>H, N, S → mavjud emas</li>
                <li><strong className="text-red-300">Ni → Ni metali (qattiq qoldiq)</strong> — TCD detektlay olmaydi!</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Bundan tashqari, <strong className="text-yellow-300">standart CHNS rejimi O ni o'lchay olmaydi</strong>. CHNS-O (O mode) kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-red-400 font-bold text-xs uppercase mb-3">Qoldiqni hisoblash:</h4>
              <div className="space-y-2 font-mono text-xs text-purple-200">
                <div className="flex justify-between border-b border-purple-800/30 pb-1">
                  <span>Namuna:</span>
                  <span className="text-white">100.00%</span>
                </div>
                <div className="flex justify-between">
                  <span>− C:</span>
                  <span>28.14%</span>
                </div>
                <div className="flex justify-between">
                  <span>− O:</span>
                  <span>37.49%</span>
                </div>
                <div className="flex justify-between">
                  <span>− H:</span>
                  <span>0.00%</span>
                </div>
                <div className="flex justify-between">
                  <span>− N:</span>
                  <span>0.00%</span>
                </div>
                <div className="flex justify-between">
                  <span>− S:</span>
                  <span>0.00%</span>
                </div>
                <div className="flex justify-between border-t border-purple-800/30 pt-1 mt-1">
                  <span className="text-red-400">= Ni (qoldiq):</span>
                  <span className="text-red-400 font-bold">34.37%</span>
                </div>
                <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-700/30 text-red-200 text-[10px]">
                  Nazariy Ni% = 34.38% — qoldiq bilan mos keladi ✓
                </div>
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
              <h3 className="font-bold text-white mb-1">EA afzalligi</h3>
              <p className="text-xs text-purple-200">C va O to'liq o'lchanadi (maxsus O rejimida). CO ligandlarini tasdiqlaydi. Mond jarayoni namunalarini tahlil qilishda ishlatiladi.</p>
            </div>
            <div className="bg-red-950/30 p-4 rounded-lg border border-red-700/30">
              <div className="text-red-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-red-300">Juda zaharli!</strong> Uchuvchan — maxsus kapsulalar kerak. Recovery ~65%. Standart CHNS rejimi O ni o'lchay olmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">IQ (ν(CO)), MS (M⁺=170), ¹³C YaMR, ICP-OES (Ni%) — to'liq tasdiqlash uchun birlashtiriladi. <strong className="text-red-300">Xavfsizlik birinchi!</strong></p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/element-analiz" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Element Analiz metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-sm bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • Ni(CO)₄ • Element Analizi moduli</p>
          <p className="mt-1">Manbalar: IUPAC Atomic Weights 2021, Vogel's Textbook, NIST SRP, Mond (1890)</p>
        </div>
      </footer>
    </main>
  )
}