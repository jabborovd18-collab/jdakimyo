"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₆]Cl₃ — AAS (Atom-Absorbsion Spektroskopiya) MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)
// Xususiyat: Co³⁺ FAAS tahlili, 240.7 nm, Werner klassik kompleksi
// O'ziga xoslik: Kinetik inert (d⁶ LS), FAAS da to'liq atomlanadi
// Maqsad: Faqat AAS tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Co: 58.933, Cl: 35.450, N: 14.007, H: 1.008
}

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Co(NH3)6]Cl3",
  iupac: "Geksaamminkobalt(III) xlorid",
  formulaExpanded: "CoN₆H₁₈Cl₃ (suvsiz)",
  commonName: "Luteo-kobalt xlorid (sariq-to'q sariq rangli)",
  molarMass: 267.48,
  casNumber: "14695-95-5",
  color: "sariq-to'q sariq kristallar",
  stability: "juda barqaror, kinetik inert (d⁶ LS, t₂g⁶), havoda yillar davomida saqlanadi",
  
  historicalFact: {
    title: "Werner koordinatsion nazariyasining asosiy isboti",
    text: "[Co(NH₃)₆]Cl₃ — Alfred Werner (1866-1919) koordinatsion nazariyasini isbotlash uchun ishlatgan eng muhim birikmalardan biri. 1893-yilda Werner taklif qilgan g'oya: Co³⁺ markaziy atom, 6 ta NH₃ ligand <strong>ichki sferada</strong> (oktaedr geometriya), 3 ta Cl⁻ esa <strong>tashqi sferada</strong> ion sifatida. Bu nazariya o'sha davrning 'zanjir nazariyasi' (Jørgensen) bilan ziddiyatda edi. Werner bu kompleksning konduktometriyasini o'lchab, uning 1:3 elektrolit ekanligini isbotladi — 4 ta ion hosil qiladi ([Co(NH₃)₆]³⁺ + 3Cl⁻). Bu Werner g'oyasining to'g'riligini tasdiqladi va 1913-yilda unga Nobel mukofotini keltirdi. AAS tahlilida bu birikma juda qiziq: Co³⁺ <strong>kinetik inert</strong> — eritma uzoq vaqt barqaror, Co²⁺ ga aylanmaydi. FAAS da to'liq atomlanadi (Cr³⁺ kabi refrakter emas).",
    year: "1893-1913"
  },

  // Co³⁺ ning inertligi — muhim kimyoviy xususiyat
  kineticInertness: {
    title: "Co³⁺ — kinetik inert (d⁶ LS, t₂g⁶)",
    description: "Co³⁺ ning 6 ta elektroni t₂g orbitallarida juftlangan (t₂g⁶ e_g⁰). Bu konfiguratsiya juda barqaror (kristall maydon stabilizatsiya energiyasi katta) va ligand almashinishini JUDA sekinlashtiradi.",
    comparison: [
      { ion: "Co³⁺ (d⁶ LS)", config: "t₂g⁶", exchange: "~ kunlar-oylar", magnetic: "Diamagnit (0 toq e⁻)", color: "sariq" },
      { ion: "Co²⁺ (d⁷ HS)", config: "t₂g⁵ e_g²", exchange: "~ millisekundlar", magnetic: "Paramagnit (3 toq e⁻)", color: "pushti" },
      { ion: "Fe³⁺ (d⁵ HS)", config: "t₂g³ e_g²", exchange: "~ soniyalar", magnetic: "Paramagnit (5 toq e⁻)", color: "sariq" },
      { ion: "Ni²⁺ (d⁸)", config: "t₂g⁶ e_g²", exchange: "~ soniyalar", magnetic: "Paramagnit (2 toq e⁻)", color: "yashil" }
    ]
  },

  // Co³⁺ vs Co²⁺ farqlash muammosi
  oxidationEffect: {
    title: "AAS Co³⁺ va Co²⁺ ni farqlay olmaydi!",
    description: "AAS alangasida barcha Co turlari erkin atomlarga aylanadi. Shuning uchun [Co(NH₃)₆]³⁺ (Co³⁺) va [Co(H₂O)₆]²⁺ (Co²⁺) AAS da BIR XIL signal beradi (λ = 240.7 nm). Farq faqat %Co qiymatida — formuladan kelib chiqadi.",
    co3plus: {
      name: "Co³⁺ (d⁶ LS)",
      formula: "[Co(NH₃)₆]Cl₃",
      M: 267.48,
      theoryCo: 22.03,
      magnetic: "Diamagnit",
      color: "sariq-to'q sariq",
      stability: "Juda barqaror"
    },
    co2plus: {
      name: "Co²⁺ (d⁷ HS)",
      formula: "[Co(H₂O)₆]Cl₂",
      M: 237.93,
      theoryCo: 24.77,
      magnetic: "Paramagnit",
      color: "pushti",
      stability: "Labill (reaktiv)"
    },
    difference: {
      Co_percent: "2.74% farq (12.4% nisbiy farq)",
      aasSignal: "BIR XIL (λ = 240.7 nm)",
      distinguishing: "Magnit o'lchash, UV-Vis yoki CV kerak"
    }
  },

  aasParameters: {
    element: "Co",
    oxidationState: "Co³⁺ (lekin AAS buni farqlamaydi!)",
    hclLamp: "Co katod lampasi (Hollow Cathode Lamp)",
    lambda: { primary: 240.7, secondary: 242.5, tertiary: 345.4 },
    slitWidth: 0.2,
    lampCurrent: 6,
    atomization: "FAAS (Alanga AAS)",
    flame: "Havo-C₂H₂ (oxidizing, ~2300°C)",
    burnerHeight: 10,
    backgroundCorrection: "Deuteriy lampasi (D₂)",
    linearRange: "0.07 - 5.0 mg/L",
    sensitivity: 0.08,
    lod: 0.007,
    loq: 0.023,
    rsd_typical: "0.5 - 2.0%"
  },

  theoretical: {
    Co:  { mass: 58.933,  percent: 22.032, source: "Markaziy Co³⁺ atomi", aasSignal: "240.7 nm da asosiy signal" },
    Cl:  { mass: 106.350, percent: 39.760, source: "3×Cl⁻ (tashqi sfera)", aasSignal: "FAAS da o'lchanmaydi" },
    N:   { mass: 84.042,  percent: 31.420, source: "6×NH₃ (6×N)", aasSignal: "FAAS da o'lchanmaydi" },
    H:   { mass: 18.144,  percent: 6.784,  source: "6×NH₃ (18×H)", aasSignal: "FAAS da o'lchanmaydi" }
  },

  calibrationCurve: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (0.1 M HNO₃)" },
    { conc: 1.0, absorbance: 0.083, note: "Standart 1" },
    { conc: 2.0, absorbance: 0.165, note: "Standart 2" },
    { conc: 3.0, absorbance: 0.248, note: "Standart 3" },
    { conc: 4.0, absorbance: 0.331, note: "Standart 4" },
    { conc: 5.0, absorbance: 0.414, note: "Standart 5" }
  ],

  experimentalRuns: [
    { id: "AAS-24-301", date: "2024-08-10", absorbance: 0.365, conc_mgL: 4.41, sample_mg: 20.0, dilution: 10, Co_percent: 22.05, rsd: 0.95, note: "Toza [Co(NH₃)₆]Cl₃" },
    { id: "AAS-24-302", date: "2024-08-10", absorbance: 0.363, conc_mgL: 4.39, sample_mg: 20.0, dilution: 10, Co_percent: 21.95, rsd: 0.88, note: "Ikkinchi parallel" },
    { id: "AAS-24-303", date: "2024-08-10", absorbance: 0.367, conc_mgL: 4.43, sample_mg: 20.0, dilution: 10, Co_percent: 22.15, rsd: 1.05, note: "Uchinchi parallel" },
    { id: "AAS-24-304", date: "2024-08-10", absorbance: 0.364, conc_mgL: 4.40, sample_mg: 20.0, dilution: 10, Co_percent: 22.00, rsd: 0.92, note: "To'rtinchi parallel" },
    { id: "AAS-24-305", date: "2024-08-10", absorbance: 0.366, conc_mgL: 4.42, sample_mg: 20.0, dilution: 10, Co_percent: 22.10, rsd: 0.85, note: "Beshinchi parallel" },
    { id: "AAS-24-306", date: "2024-08-11", absorbance: 0.410, conc_mgL: 4.95, sample_mg: 20.0, dilution: 10, Co_percent: 24.75, rsd: 1.45, note: "⚠ [Co(H₂O)₆]Cl₂ aralashmasi (Co²⁺)" },
    { id: "AAS-24-307", date: "2024-08-11", absorbance: 0.385, conc_mgL: 4.65, sample_mg: 20.0, dilution: 10, Co_percent: 23.25, rsd: 1.75, note: "[Co(NH₃)₅Cl]Cl₂ aralashmasi (purpureo)" },
    { id: "BLANK-04",   date: "2024-08-10", absorbance: 0.002, conc_mgL: 0.02, sample_mg: 0.0,  dilution: 1,  Co_percent: 0.00,  rsd: 0.00, note: "Blank (0.1 M HNO₃)" },
    { id: "STD-Co-10",  date: "2024-08-10", absorbance: 0.826, conc_mgL: 10.00, sample_mg: 0.0, dilution: 1, Co_percent: 0.00, rsd: 0.45, note: "NIST Co standarti (10 mg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 20.0 ± 0.1 mg [Co(NH₃)₆]Cl₃ tortiladi. Sariq-to'q sariq rang — Co³⁺ belgisi. Pushti rang — Co²⁺ aralashmasi!", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 50 mL 0.1 M HNO₃ qo'shiladi. Co³⁺ inert bo'lgani uchun eritma barqaror — rangi sariq bo'lib qoladi.", time: "5 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "0.1 M HNO₃ bilan 100 mL gacha to'ldiriladi. Bu eritma konsentratsiyasi: ~200 mg/L [Co(NH₃)₆]Cl₃ ≈ 44 mg/L Co.", time: "1 daq", critical: false },
    { step: 4, title: "10× suyuqlantirish", desc: "1.0 mL eritmadan 10 mL kolbaga o'tkaziladi. Natija: ~4.4 mg/L Co — kalibrlash diapazonida (0.07-5.0 mg/L).", time: "3 daq", critical: true },
    { step: 5, title: "FAAS da o'lchash", desc: "Havo-C₂H₂ alangasi, λ = 240.7 nm, Deuteriy fon korreksiyasi. Co³⁺ to'liq atomlanadi — Cr³⁺ kabi refrakter emas.", time: "5-8 daq", critical: false },
    { step: 6, title: "Natijalarni hisoblash", desc: "%Co = (C × V × DF / m) × 100. Nazariy: 22.03%. Kinetik inertlik tufayli namuna barqaror — takroriy o'lchashlar mos keladi.", time: "1 daq", critical: false }
  ],

  interferences: [
    { type: "Spektral", severity: "Past", description: "Co 240.7 nm da toza signal. Fe 240.7 nm ga juda yaqin (240.7 nm), lekin odatda muammo tug'dirmaydi.", solution: "Deuteriy fon korreksiyasi yetarli. Alt. λ = 242.5 nm (ozgina past sezgirlik)" },
    { type: "Kimyoviy (Fe³⁺)", severity: "Past-O'rta", description: "Yuqori Fe³⁺ konsentratsiyasi (>10 mg/L) Co atomlanishini ozgina sekinlashtiradi.", solution: "Standart qo'shish metodi yoki matritsa moslashtirish" },
    { type: "Kimyoviy (NH₃ matritsasi)", severity: "Past", description: "NH₃ ligandlari alangada to'liq yonib ketadi — muammo yo'q. Co³⁺ inert bo'lgani uchun eritma barqaror.", solution: "Hech narsa kerak emas" },
    { type: "Ionlanish", severity: "Past", description: "Co ning ionlanish potensiali 7.86 eV — alangada kam ionlanadi.", solution: "Ionlanish buferi (CsCl) shart emas" },
    { type: "Matritsa (Cl⁻)", severity: "Past", description: "Yuqori Cl⁻ konsentratsiyasi CoCl₂ hosil qilishi mumkin, lekin alangada to'liq parchalanadi.", solution: "Standartlar ham 0.1 M HNO₃ da tayyorlanadi" }
  ],

  tgaSteps: [
    { start: 25, end: 180, loss: 0.0, event: "Barqaror zona (suvsiz kompleks)", color: "#10b981", aasEffect: "Co signal barqaror" },
    { start: 180, end: 280, loss: 25.4, event: "2-NH₃ yo'qolishi", color: "#8b5cf6", aasEffect: "[Co(NH₃)₄]Cl₂ hosil bo'ladi" },
    { start: 280, end: 400, loss: 38.1, event: "4-NH₃ va 3-Cl yo'qolishi", color: "#ef4444", aasEffect: "Co metaligacha qaytariladi" },
    { start: 400, end: 600, loss: 0.0, event: "Co qoldig'i", color: "#6366f1", aasEffect: "Gravimetriya: 22.03% Co" },
    { start: 600, end: 900, loss: 0.0, event: "Co metali barqaror", color: "#f59e0b", aasEffect: "FAAS bilan tasdiqlash" }
  ],

  relatedMethods: [
    { name: "Magnit o'lchash (SQUID)", role: "Co³⁺ (d⁶ LS) — diamagnit (μ_eff ≈ 0), Co²⁺ (d⁷ HS) — paramagnit (μ_eff ≈ 4.8 BM)", aasAdvantage: "Magnit o'lchash Co³⁺/Co²⁺ ni aniq farqlaydi", aasDisadvantage: "AAS oksidlanish holatini farqlay OLMAYDI!", complementarity: "98%" },
    { name: "UV-Vis spektroskopiya", role: "d-d o'tishlar: ¹A₁g → ¹T₁g (475 nm, sariq), ¹A₁g → ¹T₂g (340 nm)", aasAdvantage: "UV-Vis tez va Co³⁺ ning d⁶ LS holatini ko'rsatadi", aasDisadvantage: "AAS buni bilmaydi", complementarity: "93%" },
    { name: "EA (Element Analiz)", role: "N (31.42%) va H (6.78%) — 6 ta NH₃ ni tasdiqlaydi", aasAdvantage: "EA organik qismini, AAS metallni o'lchaydi", aasDisadvantage: "Birgalikda to'liq formula validatsiyasi", complementarity: "97%" },
    { name: "Konduktometriya", role: "1:3 elektrolit (Λ_M ≈ 400-450 S·cm²/mol)", aasAdvantage: "Konduktometriya [Co(NH₃)₆]³⁺ va 3Cl⁻ ni tasdiqlaydi", aasDisadvantage: "AAS faqat metallni o'lchaydi", complementarity: "95%" },
    { name: "ICP-OES", role: "Co ko'p elementli tahlil — bir vaqtda bir nechta element", aasAdvantage: "ICP-OES tezroq va ko'p elementli", aasDisadvantage: "AAS arzon va bir element uchun sezgir", complementarity: "92%" },
    { name: "¹H YaMR (paramagnit emas)", role: "Co³⁺ (d⁶ LS) — diamagnit! ¹H YaMR signal beradi (δ = 2-3 ppm)", aasAdvantage: "YaMR molekulyar strukturani ko'rsatadi", aasDisadvantage: "AAS buni bilmaydi", complementarity: "90%" }
  ]
}

function calculateCoPercent(absorbance, sampleMass, dilutionFactor) {
  const slope = 0.0828  // A = 0.0828 × C (mg/L), R² = 0.9999
  const conc_mgL = absorbance / slope
  const totalVolume = 100
  const Co_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Co_percent = (Co_mass_mg / sampleMass) * 100
  return {
    conc: parseFloat(conc_mgL.toFixed(3)),
    Co_mass: parseFloat(Co_mass_mg.toFixed(3)),
    Co_percent: parseFloat(Co_percent.toFixed(2))
  }
}

export default function CoNH36Cl3Page() {
  const [activeRun, setActiveRun] = useState("AAS-24-301")
  const [customAbsorbance, setCustomAbsorbance] = useState(0.365)
  const [customMass, setCustomMass] = useState(20.0)
  const [dilutionFactor, setDilutionFactor] = useState(10)
  const [selectedInterference, setSelectedInterference] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaCo = Math.abs(run.Co_percent - COMPOUND.theoretical.Co.percent)
  const statusColor = deltaCo <= 0.5 ? "text-green-400" : deltaCo <= 1.5 ? "text-yellow-400" : "text-red-400"

  const calcResult = useMemo(() => 
    calculateCoPercent(customAbsorbance, customMass, dilutionFactor),
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
            <span className="text-pink-400 font-semibold">[Co(NH₃)₆]Cl₃</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-pink-400 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Co³⁺ d⁶ LS</span>
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">λ = 240.7 nm</span>
                <span className="px-2 py-1 rounded bg-indigo-900/30 border border-indigo-700/50 text-indigo-400 text-[10px] uppercase tracking-wide">Kinetik Inert</span>
                <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Nobel 1913</span>
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
        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (AAS uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Co(NH₃)₆]Cl₃</strong> — kobalt(III) ning geksaammin kompleksi, Werner nazariyasining klassik namunasi. AAS tahlilida <strong className="text-pink-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-pink-500 text-xs md:text-sm">
                <li>Nazariy <strong className="text-white">%Co = 22.03%</strong> — FAAS da aniq o'lchanadi</li>
                <li>Co³⁺ <strong className="text-white">kinetik inert</strong> — eritma barqaror, takroriy o'lchashlar mos</li>
                <li>Co³⁺ <strong className="text-green-300">refrakter emas</strong> — Havo-C₂H₂ alangasida to'liq atomlanadi</li>
                <li>6 ta NH₃ ligand alangada <strong className="text-white">to'liq yonib ketadi</strong></li>
                <li>AAS <strong className="text-red-300">Co³⁺ va Co²⁺ ni farqlay olmaydi!</strong></li>
                <li>1:3 elektrolit — konduktometriya bilan birgalikda ishlatiladi</li>
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

        {/* 1b. KINETIK INERTLIK */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⏱️</span> {COMPOUND.kineticInertness.title}
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            {COMPOUND.kineticInertness.description}
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-2 px-3 text-left text-purple-300">Ion</th>
                  <th className="py-2 px-3 text-center text-purple-300">Konfiguratsiya</th>
                  <th className="py-2 px-3 text-center text-purple-300">Ligand almashinish</th>
                  <th className="py-2 px-3 text-center text-purple-300">Magnit xususiyati</th>
                  <th className="py-2 px-3 text-center text-purple-300">Rang</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.kineticInertness.comparison.map((c, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${c.ion.includes("Co³⁺") ? 'bg-pink-900/20' : ''}`}>
                    <td className={`py-2 px-3 font-bold ${c.ion.includes("Co³⁺") ? 'text-pink-400' : 'text-purple-300'}`}>
                      {c.ion} {c.ion.includes("Co³⁺") && "🎯"}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-yellow-400">{c.config}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={c.exchange.includes("kun") || c.exchange.includes("oy") ? 'text-green-300' : 'text-red-300'}>
                        {c.exchange}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center text-xs">{c.magnetic}</td>
                    <td className="py-2 px-3 text-center text-xs">{c.color}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-indigo-200 italic mt-3">
            💡 <strong>AAS uchun ahamiyati:</strong> Co³⁺ ning inertligi — namuna uzoq vaqt barqaror, takroriy o'lchashlar bir xil natija beradi (RSD past). Bu Cr³⁺ kabi refrakter emas — FAAS da oson atomlanadi.
          </p>
        </div>

        {/* 1c. Co³⁺ vs Co²⁺ */}
        <div className="bg-gradient-to-r from-red-900/40 to-pink-900/40 border-2 border-red-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span> {COMPOUND.oxidationEffect.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.oxidationEffect.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Co³⁺ */}
            <div className="bg-pink-950/40 rounded-xl p-5 border-2 border-pink-500/50">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-pink-400 font-bold text-sm">{COMPOUND.oxidationEffect.co3plus.name}</h3>
                <span className="text-xs bg-pink-600/40 px-2 py-0.5 rounded text-pink-200">🎯 Hozirgi</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Formula:</span>
                  <span className="font-mono text-pink-300">{COMPOUND.oxidationEffect.co3plus.formula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">M:</span>
                  <span className="font-mono text-white">{COMPOUND.oxidationEffect.co3plus.M} g/mol</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Nazariy %Co:</span>
                  <span className="font-mono font-bold text-yellow-400">{COMPOUND.oxidationEffect.co3plus.theoryCo}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Magnit:</span>
                  <span className="text-green-300">{COMPOUND.oxidationEffect.co3plus.magnetic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-yellow-300">{COMPOUND.oxidationEffect.co3plus.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-green-300">{COMPOUND.oxidationEffect.co3plus.stability}</span>
                </div>
              </div>
            </div>

            {/* Co²⁺ */}
            <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30 opacity-80">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-purple-400 font-bold text-sm">{COMPOUND.oxidationEffect.co2plus.name}</h3>
                <span className="text-xs bg-purple-600/40 px-2 py-0.5 rounded text-purple-200">Taqqoslash</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Formula:</span>
                  <span className="font-mono text-purple-300">{COMPOUND.oxidationEffect.co2plus.formula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">M:</span>
                  <span className="font-mono text-white">{COMPOUND.oxidationEffect.co2plus.M} g/mol</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Nazariy %Co:</span>
                  <span className="font-mono font-bold text-yellow-400">{COMPOUND.oxidationEffect.co2plus.theoryCo}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Magnit:</span>
                  <span className="text-pink-300">{COMPOUND.oxidationEffect.co2plus.magnetic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-pink-300">{COMPOUND.oxidationEffect.co2plus.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span className="text-red-300">{COMPOUND.oxidationEffect.co2plus.stability}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
            <h4 className="text-red-300 font-bold text-sm mb-3">🔍 Farqlar:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-purple-400 mb-1">%Co farqi:</div>
                <div className="text-white font-bold">{COMPOUND.oxidationEffect.difference.Co_percent}</div>
              </div>
              <div>
                <div className="text-purple-400 mb-1">AAS signali:</div>
                <div className="text-red-300 font-bold">{COMPOUND.oxidationEffect.difference.aasSignal}</div>
              </div>
              <div>
                <div className="text-purple-400 mb-1">Farqlash usuli:</div>
                <div className="text-green-300">{COMPOUND.oxidationEffect.difference.distinguishing}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AAS PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> AAS tahlil parametrlari
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Co³⁺ uchun <strong className="text-pink-300">FAAS (Havo-C₂H₂)</strong> yetarli — Cr³⁺ kabi refrakter emas. 
            Co ning ionlanish potensiali yuqori (7.86 eV) — alangada kam ionlanadi, modifikator shart emas.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Element</div>
              <div className="text-lg font-bold text-pink-400">{COMPOUND.aasParameters.element}</div>
              <div className="text-[10px] text-purple-300 mt-1">{COMPOUND.aasParameters.oxidationState}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">λ (asosiy)</div>
              <div className="text-lg font-mono font-bold text-pink-400">{COMPOUND.aasParameters.lambda.primary} nm</div>
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
            <h3 className="text-pink-400 font-bold text-xs uppercase mb-3">Batafsil parametrlar:</h3>
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
            AAS <strong className="text-pink-300">faqat Co</strong> ni o'lchaydi. Boshqa elementlar (N, H, Cl) FAAS da ko'rinmaydi — ularni EA yordamida tekshirish kerak.
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
                    <td className="py-3 pl-2 font-bold text-pink-400">{el}</td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-400">{d.aasSignal}</td>
                  </tr>
                ))}
                <tr className="bg-pink-900/20 font-bold border-t border-pink-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-pink-300">AAS: Co (22.03%) + Cl (39.76%) = 61.79%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. KALIBRLASH EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> Kalibrlash egri chizig'i (Co, 240.7 nm)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-pink-600 hover:bg-pink-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Co standartlari (0.1 M HNO₃ da) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-pink-300">R² = 0.9999</strong> — mukammal chiziqli bog'liqlik. Lambert-Ber qonuni: <strong className="text-white">A = 0.0828 × C</strong>.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 500 260" className="w-full h-full overflow-visible">
              {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/0.5)*200} x2="480" y2={220 - (v/0.5)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/0.5)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 1, 2, 3, 4, 5].map(c => (
                <g key={c}>
                  <text x={50 + (c/5)*430} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="265" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Co konsentratsiyasi (mg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish (A)</text>

              <line x1="50" y1="220" x2="480" y2={220 - (0.414/0.5)*200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/5)*430
                const y = 220 - (p.absorbance/0.5)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#ec4899" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#f9a8d4">
                        {p.absorbance.toFixed(3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (4.41/5)*430
                const y = 220 - (0.365/0.5)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (4.41 mg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="350" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#ec4899" strokeWidth="1" />
              <text x="410" y="48" textAnchor="middle" fontSize="10" fill="#f9a8d4" fontWeight="bold">
                R² = 0.9999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-pink-500 rounded-full"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya (A = 0.0828·C)</span>
          </div>
        </div>

        {/* 5. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> AAS yugurishlari — eksperimental natijalar
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan AAS o'lchashlari. Co³⁺ inert bo'lgani uchun takroriy o'lchashlar juda mos (RSD {'<'} 1%).
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isCo2 = r.id === "AAS-24-306"
              const isPurpureo = r.id === "AAS-24-307"
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun === r.id 
                      ? "bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-500/20" 
                      : isBlank 
                        ? "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-gray-500"
                        : isStd
                          ? "bg-amber-900/30 border-amber-700/30 text-amber-300 hover:border-amber-500"
                          : isCo2
                            ? "bg-red-900/30 border-red-700/30 text-red-300 hover:border-red-500"
                            : isPurpureo
                              ? "bg-purple-900/30 border-purple-700/30 text-purple-300 hover:border-purple-500"
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
                    <span className="font-mono text-pink-400 text-lg">{run.absorbance.toFixed(3)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-pink-900/20 rounded border border-pink-500/20">
                    <span className="text-sm text-pink-400 font-medium">C (mg/L):</span>
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
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Co:</span>
                    <span className="font-mono text-white text-lg">{run.Co_percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Co:</span>
                    <span className="font-mono text-pink-400">{COMPOUND.theoretical.Co.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaCo.toFixed(2)}%</span>
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
                  : deltaCo <= 0.5
                    ? "bg-green-900/30 border-green-700/30"
                    : deltaCo <= 1.5
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : deltaCo <= 0.5 ? "text-green-400" : deltaCo <= 1.5 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : deltaCo <= 0.5 ? "✓ [Co(NH₃)₆]Cl₃ tasdiqlandi" : deltaCo <= 1.5 ? "⚠ Aralashma bo'lishi mumkin" : "✗ Boshqa birikma"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    deltaCo <= 0.5
                      ? "AAS natijasi [Co(NH₃)₆]Cl₃ formulaga to'liq mos keladi (%Co = 22.03%). Co³⁺ inert — eritma barqaror, RSD past."
                      : deltaCo <= 1.5
                        ? run.Co_percent > 24
                          ? "%Co yuqori — ehtimol [Co(H₂O)₆]Cl₂ (Co²⁺, %Co=24.77%) aralashmasi mavjud."
                          : "%Co ozgina past — [Co(NH₃)₅Cl]Cl₂ (purpureo) aralashmasi bo'lishi mumkin."
                        : run.Co_percent > 24
                          ? "Aniq Co²⁺ aralashmasi — magnit o'lchash bilan tasdiqlash kerak."
                          : "%Co juda past — namuna ifloslangan yoki boshqa Co kompleksi."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Blank — signal nolga yaqin. Tizim toza."
                      : "NIST standarti — kalibrlash to'g'ri bajarilgan."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-pink-400 mb-4 flex justify-between">
                <span>%Co Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Co³⁺: 22.03% | Co²⁺: 24.77%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isCo2 = r.id === "AAS-24-306"
                  const val = r.Co_percent
                  const heightPct = Math.min((val / 28) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <>
                            <div className="absolute w-[120%] border-t border-dashed border-pink-500/50 z-0" style={{ bottom: `${(22.032/28)*100}%` }}></div>
                            <div className="absolute w-[120%] border-t border-dashed border-purple-500/30 z-0" style={{ bottom: `${(24.77/28)*100}%` }}></div>
                          </>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : isCo2 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                : 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : isCo2 ? 'bg-red-700/40'
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : isCo2 ? 'text-red-400' : 'text-pink-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-pink-500 rounded"></span> Co³⁺ (22.03%)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Co²⁺ (24.77%)</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-pink-500/50"></span> Nazariy</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-pink-400 mb-3 flex items-center gap-2">
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
                        <td className="py-2 px-3 text-pink-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-pink-900/20 rounded-lg border border-pink-700/30 text-xs text-purple-200">
                <strong className="text-pink-300">Regressiya:</strong> A = 0.0828 × C + 0.0004, R² = 0.9999
              </div>
              <button 
                onClick={() => setShowCalibrationModal(false)}
                className="w-full mt-4 bg-pink-600 hover:bg-pink-500 text-white py-2 rounded-lg transition-colors text-sm"
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
            Co³⁺ uchun interferensiyalar <strong className="text-pink-300">minimal</strong> — Cr³⁺ kabi refrakter emas, NH₃ matritsasi alangada to'liq yonib ketadi. Har birini bosib, batafsil ma'lumot oling.
          </p>

          <div className="space-y-2">
            {COMPOUND.interferences.map((int, i) => (
              <button
                key={i}
                onClick={() => setSelectedInterference(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedInterference === i
                    ? "bg-pink-900/40 border-pink-500"
                    : "bg-purple-950/40 border-purple-700/30 hover:border-pink-500/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-pink-400">{int.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    int.severity === "Past" ? "bg-green-900/30 text-green-400 border-green-600/30" :
                    int.severity === "Past-O'rta" ? "bg-yellow-900/30 text-yellow-400 border-yellow-600/30" :
                    "bg-orange-900/30 text-orange-400 border-orange-600/30"
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
            [Co(NH₃)₆]Cl₃ da NH₃ ligandlari bosqichma-bosqich yo'qoladi (180-400°C). AAS eritmada Co³⁺ to'liq atomlanadi — TGA dagi yo'qotishlar AAS natijasiga ta'sir qilmaydi (eritma tayyorlanganidan keyin).
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
                d="M 50 20 L 200 20 Q 220 20 230 50 L 250 100 Q 260 115 280 115 L 320 115 Q 335 115 345 135 L 385 180 Q 395 190 415 190 L 580 190" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="125" y="15" textAnchor="middle" fill="#10b981">AAS: %Co = 22.03%</text>
                
                <line x1="250" y1="100" x2="250" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="250" y="235" textAnchor="middle" fill="#8b5cf6">~230°C</text>
                <text x="270" y="90" fill="#8b5cf6">-2 NH₃</text>

                <line x1="385" y1="180" x2="385" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="385" y="235" textAnchor="middle" fill="#ef4444">~340°C</text>
                <text x="405" y="170" fill="#ef4444">-4 NH₃, -3 Cl</text>

                <text x="500" y="185" textAnchor="middle" fill="#6366f1">Co qoldig'i (22%)</text>
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
                <div className="text-[10px] text-pink-300 mt-2 italic">AAS effekti: {step.aasEffect}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> AAS ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Co(NH₃)₆]Cl₃ uchun AAS ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-pink-300">Co³⁺ holatini tasdiqlash</strong> uchun muhim. <strong className="text-indigo-300">Magnit o'lchash</strong> — eng kuchli qo'shimcha metod.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-pink-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-pink-300">{m.name}</h3>
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

          <div className="mt-5 bg-pink-900/20 border border-pink-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-pink-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">AAS (Co%) + EA (N, H) + Konduktometriya (1:3) + Magnit (μ_eff ≈ 0) + UV-Vis (d-d 475 nm) + ¹H YaMR (δ = 2-3 ppm)</strong> — oltita metod birgalikda [Co(NH₃)₆]Cl₃ ni to'liq tasdiqlaydi va Werner nazariyasini isbotlaydi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> AAS uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Co(NH₃)₆]Cl₃ <strong className="text-pink-300">kinetik inert</strong> — eritma uzoq vaqt barqaror. Cr³⁺ kabi maxsus sharoit talab qilmaydi — oddiy FAAS yetarli.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-pink-900/40 border-pink-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-pink-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-pink-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-pink-900/20 border border-pink-500/30 rounded-2xl p-6">
          <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> AAS dan %Co hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan yutilish (A), namuna massasi va suyuqlantirish faktori bo'yicha <strong className="text-pink-300">%Co</strong> ni avtomatik hisoblang.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, 240.7 nm):</label>
              <input 
                type="number" step="0.001" value={customAbsorbance}
                onChange={(e) => setCustomAbsorbance(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-pink-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Konsentratsiya:</div>
                <div className="text-2xl font-mono font-bold text-pink-400">{calcResult.conc} mg/L</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Co massasi:</div>
                <div className="text-2xl font-mono font-bold text-orange-400">{calcResult.Co_mass} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Co:</div>
                <div className={`text-2xl font-mono font-bold ${Math.abs(calcResult.Co_percent - 22.03) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Co_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Co = (A / 0.0828) × 100 × DF / (m × 1000) × 100
            </p>
          </div>
        </div>

        {/* 11. AAS CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> AAS ning Co³⁺ uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                AAS [Co(NH₃)₆]Cl₃ ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Co³⁺ va Co²⁺ ni farqlay olmaydi</strong> — magnit o'lchash kerak</li>
                <li><strong className="text-red-300">Faqat Co ni o'lchaydi</strong> — N, H, Cl uchun EA kerak</li>
                <li><strong className="text-red-300">NH₃ ligandlar tuzilishini bilmaydi</strong> — UV-Vis, YaMR kerak</li>
                <li><strong className="text-red-300">1:3 elektrolit ekanligini ko'rmaydi</strong> — konduktometriya kerak</li>
                <li><strong className="text-red-300">Kinetik inertlikni bilmaydi</strong> — ligand almashinish tezligi</li>
                <li><strong className="text-red-300">Bir vaqtda bitta element</strong> — ICP-OES tezroq</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>[Co(NH₃)₆]Cl₃ ni to'liq tasdiqlash</strong> uchun kamida 5-6 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-pink-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. AAS (Co%)</span>
                  <span className="text-pink-400 font-mono">22.03%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (N, H)</span>
                  <span className="text-pink-400 font-mono">31.42% N, 6.78% H</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. Konduktometriya</span>
                  <span className="text-pink-400 font-mono">1:3 elektrolit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. Magnit (μ_eff)</span>
                  <span className="text-pink-400 font-mono">≈ 0 BM (diamagnit)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. UV-Vis (d-d)</span>
                  <span className="text-pink-400 font-mono">475, 340 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">6. ¹H YaMR</span>
                  <span className="text-pink-400 font-mono">δ = 2-3 ppm</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 6 ta metod birgalikda Werner nazariyasini to'liq isbotlaydi
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
              <p className="text-xs text-purple-200">Co ni 22.03% aniqlikda o'lchaydi. FAAS yetarli — Cr³⁺ kabi refrakter emas. Kinetik inertlik tufayli eritma barqaror, RSD past ( {'<'} 1%).</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-pink-300">Co³⁺/Co²⁺ ni farqlay olmaydi!</strong> Faqat metallni o'lchaydi. NH₃ ligandlar va 1:3 elektrolit ekanligini bilmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EA (N, H), Konduktometriya (1:3), Magnit (μ_eff≈0), UV-Vis (475 nm), ¹H YaMR — Werner nazariyasini isbotlash uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/aas" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← AAS metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-sm bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₆]Cl₃ • AAS moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955), Werner (1913 Nobel)</p>
        </div>
      </footer>
    </main>
  )
}