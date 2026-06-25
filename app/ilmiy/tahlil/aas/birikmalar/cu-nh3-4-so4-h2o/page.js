"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Cu(NH₃)₄]SO₄·H₂O — AAS (Atom-Absorbsion Spektroskopiya) MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)
// Xususiyat: Cu²⁺ FAAS tahlili, 324.8 nm, kvadrat-tekis geometriya
// O'ziga xoslik: Jahn-Teller effekti (d⁹), juda yuqori sezgirlik
// Maqsad: Faqat AAS tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Cu: 63.546, S: 32.065, O: 15.999, N: 14.007, H: 1.008
}

const COMPOUND = {
  formulaHTML: "[Cu(NH<sub>3</sub>)<sub>4</sub>]SO<sub>4</sub>·H<sub>2</sub>O",
  formulaPlain: "[Cu(NH3)4]SO4·H2O",
  iupac: "Tetraammismis(II) sulfat monogidrat",
  formulaExpanded: "CuN₄H₁₄SO₅",
  commonName: "Tetraamminmis(II) sulfat (to'q ko'k kristallar)",
  molarMass: 245.75,
  casNumber: "10380-29-7",
  color: "to'q ko'k (ultramarin) kristallar",
  stability: "havoda barqaror, ammo NH₃ asta-sekin bug'lanadi, suvda yaxshi eriydi",
  
  historicalFact: {
    title: "Schweizer reagenti — sellyuloza erituvchi kashfiyoti",
    text: "[Cu(NH₃)₄]²⁺ kompleksi 1857-yilda Shveytsariya kimyogari Matthias Eduard Schweizer tomonidan kashf etilgan. Uning gidroksid shakli [Cu(NH₃)₄](OH)₂ — 'Schweizer reagenti' — sellyulozani erita oladigan yagona reagent edi. Bu kashfiyot birinchi sun'iy ipak (kuprammoniy rayoni) ishlab chiqarishga asos bo'ldi. [Cu(NH₃)₄]SO₄·H₂O — shu mashhur kompleksning barqaror sulfatli shakli. Kimyoviy jihatdan qiziq: Cu²⁺ ning <strong>d⁹ elektron konfiguratsiyasi</strong> unga <strong>Jahn-Teller effekti</strong> beradi — oktaedr geometriya buziladi va kvadrat-tekis yoki elongatsiyalangan oktaedr hosil bo'ladi. AAS tahlilida bu birikma alohida qiziq: Cu²⁺ FAAS da juda yaxshi atomlanadi, λ = 324.8 nm — AAS ning eng sezgir elementlaridan biri (LOD 0.002 mg/L).",
    year: "1857-yil"
  },

  jahnTellerEffect: {
    title: "Jahn-Teller effekti — d⁹ konfiguratsiyasining oqibati",
    description: "Cu²⁺ ning d⁹ (t₂g⁶ e_g³) elektron konfiguratsiyasi nosimmetrik to'ldirilgan e_g orbitallariga ega. Bu oktaedr geometriyaning buzilishiga olib keladi — Jahn-Teller teoremasi bo'yicha.",
    geometry: {
      ideal: "Oktaedr (6 ta ligand bir xil)",
      actual: "Elongatsiyalangan oktaedr (4 ta qisqa + 2 ta uzun bog')",
      result: "Ko'pincha kvadrat-tekis geometriya kabi ko'rinadi"
    },
    consequences: [
      "4 ta NH₃ ligand kuchli bog'langan (qisqa Cu-N: 2.00 Å)",
      "2 ta qo'shimcha pozitsiya (agar bo'lsa) kuchsiz bog'langan (uzun Cu-L: 2.50 Å)",
      "d-d o'tishlar: λ_max ≈ 620 nm (to'q ko'k rang)",
      "EPR signali: g_∥ ≈ 2.25, g_⊥ ≈ 2.05 (anisotropik)"
    ],
    aasRelevance: "Jahn-Teller effekti AAS ga to'g'ridan-to'g'ri ta'sir qilmaydi, lekin eritma barqarorligiga ta'sir qiladi — Cu²⁺ oson qaytarilmaydi, FAAS da to'liq atomlanadi."
  },

  aasParameters: {
    element: "Cu",
    oxidationState: "Cu²⁺ (lekin AAS buni farqlamaydi!)",
    hclLamp: "Cu katod lampasi (Hollow Cathode Lamp)",
    lambda: { primary: 324.8, secondary: 327.4, tertiary: 217.9 },
    slitWidth: 0.5,
    lampCurrent: 4,
    atomization: "FAAS (Alanga AAS)",
    flame: "Havo-C₂H₂ (oxidizing, ~2300°C)",
    burnerHeight: 10,
    backgroundCorrection: "Deuteriy lampasi (D₂)",
    linearRange: "0.02 - 5.0 mg/L",
    sensitivity: 0.04,
    lod: 0.002,
    loq: 0.007,
    rsd_typical: "0.3 - 1.0%"
  },

  theoretical: {
    Cu:  { mass: 63.546,  percent: 25.858, source: "Markaziy Cu²⁺ atomi", aasSignal: "324.8 nm da asosiy signal" },
    S:   { mass: 32.065,  percent: 13.048, source: "SO₄²⁻ (tashqi sfera)", aasSignal: "FAAS da o'lchanmaydi" },
    O:   { mass: 79.995,  percent: 32.551, source: "SO₄²⁻ (4×O) + H₂O (1×O)", aasSignal: "FAAS da o'lchanmaydi" },
    N:   { mass: 56.028,  percent: 22.798, source: "4×NH₃ (4×N)", aasSignal: "FAAS da o'lchanmaydi" },
    H:   { mass: 14.112,  percent: 5.742,  source: "4×NH₃ (12×H) + H₂O (2×H)", aasSignal: "FAAS da o'lchanmaydi" }
  },

  calibrationCurve: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (0.1 M HNO₃)" },
    { conc: 0.5, absorbance: 0.125, note: "Standart 1" },
    { conc: 1.0, absorbance: 0.250, note: "Standart 2" },
    { conc: 2.0, absorbance: 0.502, note: "Standart 3" },
    { conc: 3.0, absorbance: 0.753, note: "Standart 4" },
    { conc: 4.0, absorbance: 1.005, note: "Standart 5" },
    { conc: 5.0, absorbance: 1.257, note: "Standart 6" }
  ],

  experimentalRuns: [
    { id: "AAS-24-501", date: "2024-10-10", absorbance: 0.642, conc_mgL: 2.56, sample_mg: 10.0, dilution: 10, Cu_percent: 25.60, rsd: 0.45, note: "Toza [Cu(NH₃)₄]SO₄·H₂O" },
    { id: "AAS-24-502", date: "2024-10-10", absorbance: 0.640, conc_mgL: 2.55, sample_mg: 10.0, dilution: 10, Cu_percent: 25.50, rsd: 0.42, note: "Ikkinchi parallel" },
    { id: "AAS-24-503", date: "2024-10-10", absorbance: 0.645, conc_mgL: 2.57, sample_mg: 10.0, dilution: 10, Cu_percent: 25.70, rsd: 0.48, note: "Uchinchi parallel" },
    { id: "AAS-24-504", date: "2024-10-10", absorbance: 0.641, conc_mgL: 2.56, sample_mg: 10.0, dilution: 10, Cu_percent: 25.60, rsd: 0.44, note: "To'rtinchi parallel" },
    { id: "AAS-24-505", date: "2024-10-10", absorbance: 0.643, conc_mgL: 2.56, sample_mg: 10.0, dilution: 10, Cu_percent: 25.60, rsd: 0.46, note: "Beshinchi parallel" },
    { id: "AAS-24-506", date: "2024-10-11", absorbance: 0.510, conc_mgL: 2.03, sample_mg: 10.0, dilution: 10, Cu_percent: 20.30, rsd: 1.25, note: "⚠ NH₃ qisman yo'qotilgan (2 hafta ochiq)" },
    { id: "AAS-24-507", date: "2024-10-11", absorbance: 0.450, conc_mgL: 1.79, sample_mg: 10.0, dilution: 10, Cu_percent: 17.90, rsd: 1.55, note: "⚠ CuSO₄·5H₂O aralashmasi" },
    { id: "BLANK-06",   date: "2024-10-10", absorbance: 0.001, conc_mgL: 0.00, sample_mg: 0.0,  dilution: 1,  Cu_percent: 0.00, rsd: 0.00, note: "Blank (0.1 M HNO₃)" },
    { id: "STD-Cu-10",  date: "2024-10-10", absorbance: 2.514, conc_mgL: 10.02, sample_mg: 0.0, dilution: 1, Cu_percent: 0.00, rsd: 0.25, note: "NIST Cu standarti (10 mg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 10.0 ± 0.1 mg [Cu(NH₃)₄]SO₄·H₂O tortiladi. To'q ko'k rang — Cu²⁺ belgisi. Och rang yoki yashil — parchalanish yoki aralashma.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 50 mL 0.1 M HNO₃ qo'shiladi. Cu²⁺ eritmasi och ko'k bo'ladi (NH₃ chiqib ketadi).", time: "5 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "0.1 M HNO₃ bilan 100 mL gacha to'ldiriladi. Bu eritma konsentratsiyasi: ~100 mg/L [Cu(NH₃)₄]SO₄ ≈ 25.9 mg/L Cu.", time: "1 daq", critical: false },
    { step: 4, title: "10× suyuqlantirish", desc: "1.0 mL eritmadan 10 mL kolbaga o'tkaziladi. Natija: ~2.59 mg/L Cu — kalibrlash diapazonida (0.02-5.0 mg/L).", time: "3 daq", critical: true },
    { step: 5, title: "FAAS da o'lchash", desc: "Havo-C₂H₂ alangasi, λ = 324.8 nm, Deuteriy fon korreksiyasi. Cu²⁺ juda yaxshi atomlanadi — eng sezgir elementlardan biri.", time: "5-8 daq", critical: false },
    { step: 6, title: "Natijalarni hisoblash", desc: "%Cu = (C × V × DF / m) × 100. Nazariy: 25.86%. HNO₃ NH₃ ni chiqaradi, Cu²⁺ erkin ionga aylanadi.", time: "1 daq", critical: false }
  ],

  interferences: [
    { type: "Spektral", severity: "Past", description: "Cu 324.8 nm da toza signal. Boshqa elementlar yaqin chiziqlari yo'q.", solution: "Deuteriy fon korreksiyasi yetarli" },
    { type: "Kimyoviy (Ni²⁺)", severity: "Past", description: "Yuqori Ni²⁺ (>10 mg/L) ozgina ta'sir qilishi mumkin, lekin odatda muammo emas.", solution: "Standart qo'shish metodi" },
    { type: "Kimyoviy (NH₃ matritsasi)", severity: "Past", description: "HNO₃ qo'shilganda NH₃ to'liq chiqib ketadi — muammo yo'q.", solution: "Hech narsa kerak emas" },
    { type: "Ionlanish", severity: "Juda past", description: "Cu ning ionlanish potensiali 7.73 eV — alangada deyarli ionlanmaydi.", solution: "Ionlanish buferi shart emas" },
    { type: "Matritsa (SO₄²⁻)", severity: "Past", description: "SO₄²⁻ alangada to'liq parchalanadi — muammo yo'q.", solution: "Standartlar ham 0.1 M HNO₃ da" }
  ],

  tgaSteps: [
    { start: 25, end: 100, loss: 7.3, event: "H₂O yo'qolishi (kristall suv)", color: "#3b82f6", aasEffect: "%Cu: 25.86% → 27.89% (suvsiz shaklda)" },
    { start: 100, end: 200, loss: 0.0, event: "Suvsiz [Cu(NH₃)₄]SO₄ barqaror", color: "#10b981", aasEffect: "Cu signal o'zgarmaydi" },
    { start: 200, end: 300, loss: 13.8, event: "2-NH₃ yo'qolishi", color: "#8b5cf6", aasEffect: "[Cu(NH₃)₂]SO₄ hosil bo'ladi" },
    { start: 300, end: 400, loss: 13.8, event: "2-NH₃ yo'qolishi", color: "#ef4444", aasEffect: "CuSO₄ qoldig'i" },
    { start: 400, end: 700, loss: 25.5, event: "SO₃ yo'qolishi", color: "#f59e0b", aasEffect: "CuO qoldig'i (25.86% Cu)" }
  ],

  relatedMethods: [
    { name: "UV-Vis spektroskopiya", role: "d-d o'tish: ²E_g → ²T₂g (620 nm, to'q ko'k rang)", aasAdvantage: "UV-Vis Jahn-Teller effektini ko'rsatadi", aasDisadvantage: "AAS buni bilmaydi", complementarity: "95%" },
    { name: "EPR spektroskopiya", role: "Cu²⁺ (d⁹) — kuchli EPR signali (g_∥ ≈ 2.25, g_⊥ ≈ 2.05)", aasAdvantage: "EPR Cu²⁺ ni Cu⁺ dan aniq farqlaydi", aasDisadvantage: "AAS oksidlanish holatini farqlay OLMAYDI!", complementarity: "97%" },
    { name: "EA (Element Analiz)", role: "N (22.80%) va H (5.74%) — 4 ta NH₃ va 1 ta H₂O ni tasdiqlaydi", aasAdvantage: "EA organik qismini, AAS metallni o'lchaydi", aasDisadvantage: "Birgalikda to'liq formula validatsiyasi", complementarity: "98%" },
    { name: "Konduktometriya", role: "1:2 elektrolit (Λ_M ≈ 250-280 S·cm²/mol)", aasAdvantage: "Konduktometriya [Cu(NH₃)₄]²⁺ va SO₄²⁻ ni tasdiqlaydi", aasDisadvantage: "AAS faqat metallni o'lchaydi", complementarity: "88%" },
    { name: "IQ spektroskopiya", role: "N-H (3300-3150 cm⁻¹), Cu-N (400-300 cm⁻¹), SO₄²⁻ (1100, 620 cm⁻¹)", aasAdvantage: "IQ ligandlar va anionni ko'rsatadi", aasDisadvantage: "AAS buni bilmaydi", complementarity: "90%" },
    { name: "TGA (Termogravimetriya)", role: "H₂O (7.3%) va 4-NH₃ (27.6%) ni aniq o'lchaydi", aasAdvantage: "TGA gidrat va NH₃ sonini, AAS metallni tasdiqlaydi", aasDisadvantage: "Birgalikda to'liq validatsiya", complementarity: "94%" }
  ]
}

function calculateCuPercent(absorbance, sampleMass, dilutionFactor) {
  const slope = 0.2514  // A = 0.2514 × C (mg/L), R² = 0.9999
  const conc_mgL = absorbance / slope
  const totalVolume = 100
  const Cu_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Cu_percent = (Cu_mass_mg / sampleMass) * 100
  return {
    conc: parseFloat(conc_mgL.toFixed(3)),
    Cu_mass: parseFloat(Cu_mass_mg.toFixed(3)),
    Cu_percent: parseFloat(Cu_percent.toFixed(2))
  }
}

export default function CuNH34SO4Page() {
  const [activeRun, setActiveRun] = useState("AAS-24-501")
  const [customAbsorbance, setCustomAbsorbance] = useState(0.642)
  const [customMass, setCustomMass] = useState(10.0)
  const [dilutionFactor, setDilutionFactor] = useState(10)
  const [selectedInterference, setSelectedInterference] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaCu = Math.abs(run.Cu_percent - COMPOUND.theoretical.Cu.percent)
  const statusColor = deltaCu <= 0.5 ? "text-green-400" : deltaCu <= 2.0 ? "text-yellow-400" : "text-red-400"

  const calcResult = useMemo(() => 
    calculateCuPercent(customAbsorbance, customMass, dilutionFactor),
    [customAbsorbance, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      
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
            <span className="text-blue-400 font-semibold">[Cu(NH₃)₄]SO₄·H₂O</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Cu²⁺ d⁹</span>
                <span className="px-2 py-1 rounded bg-indigo-900/30 border border-indigo-700/50 text-indigo-400 text-[10px] uppercase tracking-wide">λ = 324.8 nm</span>
                <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Jahn-Teller</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">LOD 0.002 mg/L</span>
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
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (AAS uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Cu(NH₃)₄]SO₄·H₂O</strong> — mis(II) ning tetraammin kompleksi, Jahn-Teller effektining klassik namunasi. AAS tahlilida <strong className="text-blue-300">eng sezgir birikmalar</strong>dan biri, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-blue-500 text-xs md:text-sm">
                <li>Nazariy <strong className="text-white">%Cu = 25.86%</strong> — yuqori foiz, aniq o'lchanadi</li>
                <li>Cu²⁺ <strong className="text-green-300">AAS ning eng sezgir elementi</strong> (LOD 0.002 mg/L)</li>
                <li><strong className="text-blue-300">Jahn-Teller effekti</strong> (d⁹ konfiguratsiya)</li>
                <li>4 ta NH₃ ligand alangada <strong className="text-white">to'liq yonib ketadi</strong></li>
                <li>1 ta H₂O kristall suv mavjud — <strong className="text-white">monogidrat</strong></li>
                <li>Eritma HNO₃ da <strong className="text-white">barqaror</strong> — Cu²⁺ erkin ion</li>
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

        {/* 1b. JAHN-TELLER EFFEKTI */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border-2 border-indigo-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔷</span> {COMPOUND.jahnTellerEffect.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.jahnTellerEffect.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-indigo-950/40 rounded-xl p-4 border border-indigo-700/30">
              <div className="text-xs text-indigo-400 uppercase mb-2">Ideal</div>
              <div className="text-sm text-white">{COMPOUND.jahnTellerEffect.geometry.ideal}</div>
            </div>
            <div className="bg-blue-950/40 rounded-xl p-4 border-2 border-blue-500/50">
              <div className="text-xs text-blue-400 uppercase mb-2">Haqiqiy 🎯</div>
              <div className="text-sm text-white font-bold">{COMPOUND.jahnTellerEffect.geometry.actual}</div>
            </div>
            <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">Natija</div>
              <div className="text-sm text-white">{COMPOUND.jahnTellerEffect.geometry.result}</div>
            </div>
          </div>

          <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/50 mb-4">
            <h4 className="text-indigo-300 font-bold text-sm mb-3">📐 Oqibatlari:</h4>
            <div className="space-y-2">
              {COMPOUND.jahnTellerEffect.consequences.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-indigo-400 font-bold shrink-0">#{i+1}</span>
                  <span className="text-purple-200">{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
            <h4 className="text-blue-300 font-bold text-sm mb-2">💡 AAS uchun ahamiyati:</h4>
            <p className="text-xs text-purple-200">{COMPOUND.jahnTellerEffect.aasRelevance}</p>
          </div>
        </div>

        {/* 2. AAS PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> AAS tahlil parametrlari (Cu uchun eng yuqori sezgirlik)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Cu²⁺ uchun <strong className="text-blue-300">FAAS (Havo-C₂H₂)</strong> yetarli — Cu AAS ning eng sezgir elementlaridan biri. 
            λ = 324.8 nm — Cu ning eng kuchli chizig'i, LOD atigi 0.002 mg/L.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Element</div>
              <div className="text-lg font-bold text-blue-400">{COMPOUND.aasParameters.element}</div>
              <div className="text-[10px] text-purple-300 mt-1">{COMPOUND.aasParameters.oxidationState}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">λ (asosiy)</div>
              <div className="text-lg font-mono font-bold text-blue-400">{COMPOUND.aasParameters.lambda.primary} nm</div>
              <div className="text-[10px] text-purple-300 mt-1">Alt: {COMPOUND.aasParameters.lambda.secondary} nm</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Alanga</div>
              <div className="text-lg font-bold text-orange-400">Havo-C₂H₂</div>
              <div className="text-[10px] text-purple-300 mt-1">~2300°C</div>
            </div>
            <div className="bg-green-950/60 p-3 rounded-xl border-2 border-green-500/50">
              <div className="text-[10px] text-green-400 uppercase mb-1">⭐ LOD</div>
              <div className="text-lg font-mono font-bold text-green-400">{COMPOUND.aasParameters.lod} mg/L</div>
              <div className="text-[10px] text-purple-300 mt-1">Eng sezgir element!</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-blue-400 font-bold text-xs uppercase mb-3">Batafsil parametrlar:</h3>
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
                <div className="font-mono text-green-300">{COMPOUND.aasParameters.rsd_typical}</div>
              </div>
              <div>
                <div className="text-purple-400">Usul:</div>
                <div className="font-mono text-green-300 font-bold">{COMPOUND.aasParameters.atomization}</div>
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
            AAS <strong className="text-blue-300">faqat Cu</strong> ni o'lchaydi. Boshqa elementlar (S, O, N, H) FAAS da ko'rinmaydi — ularni EA yordamida tekshirish kerak.
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
                    <td className="py-3 pl-2 font-bold text-blue-400">{el}</td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-400">{d.aasSignal}</td>
                  </tr>
                ))}
                <tr className="bg-blue-900/20 font-bold border-t border-blue-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-blue-300">AAS: Cu (25.86%) — juda yuqori signal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. KALIBRLASH EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> Kalibrlash egri chizig'i (Cu, 324.8 nm)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Cu standartlari (0.1 M HNO₃ da) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-blue-300">R² = 0.9999</strong> — mukammal chiziqli bog'liqlik. Lambert-Ber qonuni: <strong className="text-white">A = 0.2514 × C</strong>.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 500 260" className="w-full h-full overflow-visible">
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.4)*200} x2="480" y2={220 - (v/1.4)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.4)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 1, 2, 3, 4, 5].map(c => (
                <g key={c}>
                  <text x={50 + (c/5)*430} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="265" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Cu konsentratsiyasi (mg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish (A)</text>

              <line x1="50" y1="220" x2="480" y2={220 - (1.257/1.4)*200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/5)*430
                const y = 220 - (p.absorbance/1.4)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#3b82f6" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#93c5fd">
                        {p.absorbance.toFixed(3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (2.56/5)*430
                const y = 220 - (0.642/1.4)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (2.56 mg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="350" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#3b82f6" strokeWidth="1" />
              <text x="410" y="48" textAnchor="middle" fontSize="10" fill="#93c5fd" fontWeight="bold">
                R² = 0.9999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya (A = 0.2514·C)</span>
          </div>
        </div>

        {/* 5. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> AAS yugurishlari — eksperimental natijalar
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan AAS o'lchashlari. Cu²⁺ FAAS da juda yaxshi atomlanadi — takroriy o'lchashlar juda mos (RSD {'<'} 0.5%).
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isDegraded = r.id === "AAS-24-506"
              const isCuSO4 = r.id === "AAS-24-507"
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun === r.id 
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                      : isBlank 
                        ? "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-gray-500"
                        : isStd
                          ? "bg-amber-900/30 border-amber-700/30 text-amber-300 hover:border-amber-500"
                          : isDegraded || isCuSO4
                            ? "bg-red-900/30 border-red-700/30 text-red-300 hover:border-red-500"
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
                    <span className="font-mono text-blue-400 text-lg">{run.absorbance.toFixed(3)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-blue-900/20 rounded border border-blue-500/20">
                    <span className="text-sm text-blue-400 font-medium">C (mg/L):</span>
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
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Cu:</span>
                    <span className="font-mono text-white text-lg">{run.Cu_percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Cu:</span>
                    <span className="font-mono text-blue-400">{COMPOUND.theoretical.Cu.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaCu.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">RSD:</span>
                    <span className={`font-mono ${run.rsd <= 1.0 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {run.rsd.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : deltaCu <= 0.5
                    ? "bg-green-900/30 border-green-700/30"
                    : deltaCu <= 2.0
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : deltaCu <= 0.5 ? "text-green-400" : deltaCu <= 2.0 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : deltaCu <= 0.5 ? "✓ [Cu(NH₃)₄]SO₄·H₂O tasdiqlandi" : deltaCu <= 2.0 ? "⚠ Qisman parchalanish" : "✗ Boshqa birikma"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    deltaCu <= 0.5
                      ? "AAS natijasi [Cu(NH₃)₄]SO₄·H₂O formulaga to'liq mos keladi (%Cu = 25.86%). Cu²⁺ FAAS da juda yaxshi atomlanadi, RSD past."
                      : deltaCu <= 2.0
                        ? "%Cu qiymati ozgina past — NH₃ qisman yo'qotilgan bo'lishi mumkin (ochiq saqlash)."
                        : run.Cu_percent < 20
                          ? "Aniq parchalanish — CuSO₄·5H₂O aralashmasi yoki kuchli NH₃ yo'qotish."
                          : "%Cu yuqori — namuna ifloslangan yoki boshqa Cu kompleksi."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Blank — signal nolga yaqin. Tizim toza."
                      : "NIST standarti — kalibrlash to'g'ri bajarilgan."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-blue-400 mb-4 flex justify-between">
                <span>%Cu Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Nazariy: 25.86%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isDegraded = r.id === "AAS-24-506"
                  const isCuSO4 = r.id === "AAS-24-507"
                  const val = r.Cu_percent
                  const heightPct = Math.min((val / 30) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-blue-500/50 z-0" style={{ bottom: `${(25.858/30)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : isDegraded || isCuSO4 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                : 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : isDegraded || isCuSO4 ? 'bg-red-700/40'
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : isDegraded || isCuSO4 ? 'text-red-400' : 'text-blue-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded"></span> [Cu(NH₃)₄]SO₄</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Parchalangan</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-blue-500/50"></span> Nazariy (25.86%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
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
                        <td className="py-2 px-3 text-blue-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-700/30 text-xs text-purple-200">
                <strong className="text-blue-300">Regressiya:</strong> A = 0.2514 × C + 0.0002, R² = 0.9999
              </div>
              <div className="mt-3 p-3 bg-green-900/20 rounded-lg border border-green-700/30 text-xs text-purple-200">
                <strong className="text-green-300">⭐ Eslatma:</strong> Cu — AAS ning eng sezgir elementlaridan biri (LOD = 0.002 mg/L).
              </div>
              <button 
                onClick={() => setShowCalibrationModal(false)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-colors text-sm"
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
            Cu²⁺ uchun interferensiyalar <strong className="text-blue-300">minimal</strong> — Cu AAS ning eng toza signal beruvchi elementlaridan biri. Har birini bosib, batafsil ma'lumot oling.
          </p>

          <div className="space-y-2">
            {COMPOUND.interferences.map((int, i) => (
              <button
                key={i}
                onClick={() => setSelectedInterference(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedInterference === i
                    ? "bg-blue-900/40 border-blue-500"
                    : "bg-purple-950/40 border-purple-700/30 hover:border-blue-500/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-blue-400">{int.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    int.severity === "Past" ? "bg-green-900/30 text-green-400 border-green-600/30" :
                    int.severity === "Juda past" ? "bg-green-900/30 text-green-400 border-green-600/30" :
                    "bg-yellow-900/30 text-yellow-400 border-yellow-600/30"
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

        {/* 7. TGA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔥</span> TGA bilan AAS bog'liqligi
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            [Cu(NH₃)₄]SO₄·H₂O da avval kristall suv (7.3%), keyin NH₃ ligandlari bosqichma-bosqich yo'qoladi. AAS eritmada Cu²⁺ to'liq atomlanadi.
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
                d="M 50 20 L 130 20 Q 145 20 150 35 L 165 70 Q 170 80 185 80 L 280 80 Q 295 80 305 100 L 345 140 Q 355 150 375 150 L 415 150 Q 430 150 440 170 L 480 200 Q 490 205 510 205 L 580 205" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="90" y="15" textAnchor="middle" fill="#10b981">AAS: %Cu = 25.86%</text>
                
                <line x1="165" y1="70" x2="165" y2="220" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="165" y="235" textAnchor="middle" fill="#3b82f6">~80°C</text>
                <text x="185" y="60" fill="#3b82f6">-H₂O (7.3%)</text>

                <line x1="345" y1="140" x2="345" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="345" y="235" textAnchor="middle" fill="#8b5cf6">~250°C</text>
                <text x="365" y="130" fill="#8b5cf6">-2 NH₃</text>

                <line x1="440" y1="170" x2="440" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="440" y="235" textAnchor="middle" fill="#ef4444">~350°C</text>
                <text x="460" y="160" fill="#ef4444">-2 NH₃</text>

                <line x1="480" y1="200" x2="480" y2="220" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="480" y="235" textAnchor="middle" fill="#f59e0b">~600°C</text>
                <text x="500" y="190" fill="#f59e0b">-SO₃</text>

                <text x="545" y="200" textAnchor="middle" fill="#6366f1">CuO (25.86%)</text>
              </g>

              <line x1="50" y1="220" x2="580" y2="220" stroke="#a78bfa" strokeWidth="1" />
              <line x1="50" y1="20" x2="50" y2="220" stroke="#a78bfa" strokeWidth="1" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {COMPOUND.tgaSteps.slice(0, 3).map((step, idx) => (
              <div key={idx} className="bg-purple-950/40 p-4 rounded-lg border-l-4" style={{ borderColor: step.color }}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-white">{step.event}</span>
                  <span className="text-[10px] font-mono text-purple-400">{step.start}-{step.end}°C</span>
                </div>
                <div className="text-sm font-mono text-purple-200">Mass yo'qotish: <span className="text-white font-bold">{step.loss}%</span></div>
                <div className="text-[10px] text-blue-300 mt-2 italic">AAS effekti: {step.aasEffect}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> AAS ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Cu(NH₃)₄]SO₄·H₂O uchun AAS ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-blue-300">Jahn-Teller effektini tasdiqlash</strong> uchun muhim. <strong className="text-indigo-300">EPR</strong> va <strong className="text-cyan-300">UV-Vis</strong> eng kuchli qo'shimcha metodlar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-blue-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-blue-300">{m.name}</h3>
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

          <div className="mt-5 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-blue-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">AAS (Cu%) + UV-Vis (d-d 620 nm) + EPR (g_∥ ≈ 2.25) + EA (N, H) + TGA (H₂O + 4NH₃) + Konduktometriya (1:2)</strong> — oltita metod birgalikda [Cu(NH₃)₄]SO₄·H₂O ni to'liq tasdiqlaydi va Jahn-Teller effektini isbotlaydi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> AAS uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Cu(NH₃)₄]SO₄·H₂O <strong className="text-blue-300">Cu²⁺ FAAS da juda yaxshi atomlanadi</strong>. Eritma HNO₃ da tayyorlanadi — NH₃ chiqib ketadi, Cu²⁺ erkin ionga aylanadi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-blue-900/40 border-blue-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-blue-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-blue-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> AAS dan %Cu hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan yutilish (A), namuna massasi va suyuqlantirish faktori bo'yicha <strong className="text-blue-300">%Cu</strong> ni avtomatik hisoblang.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, 324.8 nm):</label>
              <input 
                type="number" step="0.001" value={customAbsorbance}
                onChange={(e) => setCustomAbsorbance(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Konsentratsiya:</div>
                <div className="text-2xl font-mono font-bold text-blue-400">{calcResult.conc} mg/L</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Cu massasi:</div>
                <div className="text-2xl font-mono font-bold text-orange-400">{calcResult.Cu_mass} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Cu:</div>
                <div className={`text-2xl font-mono font-bold ${Math.abs(calcResult.Cu_percent - 25.86) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Cu_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Cu = (A / 0.2514) × 100 × DF / (m × 1000) × 100
            </p>
          </div>
        </div>

        {/* 11. AAS CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> AAS ning [Cu(NH₃)₄]SO₄·H₂O uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                AAS [Cu(NH₃)₄]SO₄·H₂O ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Cu²⁺ va Cu⁺ ni farqlay olmaydi</strong> — EPR kerak</li>
                <li><strong className="text-red-300">Faqat Cu ni o'lchaydi</strong> — S, O, N, H uchun EA kerak</li>
                <li><strong className="text-red-300">Jahn-Teller effektini bilmaydi</strong> — UV-Vis, EPR kerak</li>
                <li><strong className="text-red-300">1:2 elektrolit ekanligini ko'rmaydi</strong> — konduktometriya kerak</li>
                <li><strong className="text-red-300">NH₃ va H₂O ni farqlay olmaydi</strong> — TGA kerak</li>
                <li><strong className="text-red-300">Bir vaqtda bitta element</strong> — ICP-OES tezroq</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>[Cu(NH₃)₄]SO₄·H₂O ni to'liq tasdiqlash</strong> uchun kamida 6 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-blue-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. AAS (Cu%)</span>
                  <span className="text-blue-400 font-mono">25.86%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. UV-Vis (d-d)</span>
                  <span className="text-blue-400 font-mono">620 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. EPR (Cu²⁺)</span>
                  <span className="text-blue-400 font-mono">g_∥ ≈ 2.25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. EA (N, H)</span>
                  <span className="text-blue-400 font-mono">22.80%, 5.74%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. TGA (H₂O, 4NH₃)</span>
                  <span className="text-blue-400 font-mono">7.3% + 27.6%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">6. Konduktometriya</span>
                  <span className="text-blue-400 font-mono">1:2 elektrolit</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 6 ta metod birgalikda Jahn-Teller effektini to'liq isbotlaydi
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
              <p className="text-xs text-purple-200">Cu ni 25.86% aniqlikda o'lchaydi. Cu AAS ning eng sezgir elementi (LOD 0.002 mg/L). FAAS yetarli — juda oson atomlanadi, RSD past ({'<'} 0.5%).</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-blue-300">Cu²⁺/Cu⁺ ni farqlay olmaydi!</strong> Jahn-Teller effektini, NH₃/H₂O ni, 1:2 elektrolit ekanligini bilmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">UV-Vis (620 nm), EPR (g_∥ ≈ 2.25), EA (N, H), TGA (H₂O, 4NH₃), Konduktometriya (1:2) — Jahn-Teller effektini isbotlash uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/aas" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← AAS metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Cu(NH₃)₄]SO₄·H₂O • AAS moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955), Schweizer (1857)</p>
        </div>
      </footer>
    </main>
  )
}