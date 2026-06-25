"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// Na₂[SeO₃] — AAS (Atom-Absorbsion Spektroskopiya) MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)
// Xususiyat: Se⁴⁺ HGAAS tahlili, 196.0 nm, gidrid usuli
// O'ziga xoslik: Gidrid generatsiyasi — Se uchun eng sezgir usul!
// Maqsad: Faqat AAS tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Na: 22.990, Se: 78.971, O: 15.999
}

const COMPOUND = {
  formulaHTML: "Na<sub>2</sub>[SeO<sub>3</sub>]",
  formulaPlain: "Na2[SeO3]",
  iupac: "Natriy selenit",
  formulaExpanded: "Na₂SeO₃ (oddiy tuz)",
  commonName: "Sodium selenite (oq kristallar)",
  molarMass: 172.94,
  casNumber: "10102-18-8",
  color: "oq yoki rangsiz kristallar",
  stability: "havoda barqaror, suvda yaxshi eriydi, yorug'likda barqaror",
  
  historicalFact: {
    title: "Selen — muhim mikroelement va zaharli modda",
    text: "Na₂[SeO₃] — selenning eng muhim birikmalaridan biri. Selen 1817-yilda Jöns Jacob Berzelius tomonidan kashf etilgan. 1957-yilda Schwarz va Foltz selenning <strong>muhim mikroelement</strong> ekanligini kashf qildilar — u glutatyon peroksidaza fermentining tarkibiy qismi. Ammo selen <strong>ikki tomonlama</strong> element: past dozalarda (50-200 μg/kun) zarur, yuqori dozalarda (>400 μg/kun) zaharli (selenoz). WHO ichimlik suvida Se chegarasini <strong>10 ppb (μg/L)</strong> deb belgilagan. Na₂[SeO₃] oziq-ovqat qo'shimchalarida, tibbiyotda (parrenteral oziqlantirish) va qishloq xo'jaligida (hayvonlarga qo'shimcha) ishlatiladi. AAS tahlilida bu birikma alohida qiziq: Se⁴⁺ <strong>gidrid generatsiyasi</strong> (HGAAS) usulida juda yaxshi aniqlanadi — NaBH₄ bilan H₂Se gazi hosil bo'ladi va LOD 0.001 μg/L ga yetadi!",
    year: "1817-1957"
  },

  // HGAAS — eng muhim qism
  hgaasMethod: {
    title: "HGAAS — Se uchun eng sezgir va selektiv usul!",
    description: "Gidrid generatsiyasi AAS (HGAAS) — Se tahlili uchun eng kuchli usul. Se⁴⁺ ni NaBH₄ bilan reaksiyaga kiritib, H₂Se gazi hosil qilinadi va AAS da o'lchanadi.",
    reaction: "SeO₃²⁻ + NaBH₄ + HCl → H₂Se↑ + NaCl + H₂O + B(OH)₃",
    advantages: [
      "LOD 0.001 μg/L — FAAS dan 50× sezgir",
      "Matritsadan ajratish — faqat Se o'lchanadi",
      "Interferensiyalar minimal",
      "Avtomatlashtirish oson",
      "Tez tahlil (~1 daqiqa/namuna)"
    ],
    comparison: [
      { method: "FAAS", lambda: "196.0", lod: "0.050 mg/L", sensitivity: "Past", verdict: "⚠ Yuqori konsentratsiyalar" },
      { method: "GFAAS", lambda: "196.0", lod: "0.5 μg/L", sensitivity: "Yuqori", verdict: "✓ Yaxshi" },
      { method: "HGAAS", lambda: "196.0", lod: "0.001 μg/L", sensitivity: "Eng yuqori", verdict: "✓✓ Eng yaxshi!" }
    ]
  },

  // Se ning biologik ahamiyati
  biologicalImportance: {
    title: "Se — muhim mikroelement",
    description: "Selen inson organizmi uchun zarur mikroelement. U glutatyon peroksidaza (GPx) va tioredoksin reduktaza fermentlarining tarkibiy qismi.",
    dailyRequirement: "55 μg/kun (kattalar uchun)",
    upperLimit: "400 μg/kun (yuqori chegarasi)",
    deficiency: "Keshan kasalligi (Kashin-Beck), yurak etishmovchiligi",
    toxicity: "Selenoz — soch to'kilishi, tirnoq mo'rtligi, asab tizimi buzilishi",
    applications: [
      { field: "Tibbiyot", use: "Parrenteral oziqlantirish, antioksidant" },
      { field: "Oziq-ovqat", use: "Qo'shimcha (E selene)" },
      { field: "Qishloq xo'jaligi", use: "Hayvonlarga qo'shimcha" },
      { field: "Elektronika", use: "Fotovoltaik, yarim o'tkazgichlar" }
    ]
  },

  aasParameters: {
    element: "Se",
    oxidationState: "Se⁴⁺ (lekin AAS buni farqlamaydi!)",
    hclLamp: "Se katod lampasi (Hollow Cathode Lamp) yoki EDL (Electrodeless Discharge Lamp)",
    lambda: { primary: 196.0, secondary: 203.9, tertiary: "—" },
    slitWidth: 1.0,
    lampCurrent: 10,
    atomization_HGAAS: "HGAAS (Gidrid generatsiyasi)",
    atomization_GFAAS: "GFAAS (Grafit pechi)",
    flame: "Ar-H₂ (HGAAS uchun)",
    backgroundCorrection: "Deuteriy lampasi (D₂)",
    linearRange_HGAAS: "0.001 - 20 μg/L",
    linearRange_GFAAS: "0.5 - 50 μg/L",
    lod_HGAAS: 0.001,
    lod_GFAAS: 0.5,
    loq_HGAAS: 0.003,
    loq_GFAAS: 1.7,
    rsd_typical: "1 - 3%",
    reagent: "NaBH₄ (0.6% w/v) + NaOH (0.5% w/v)",
    acid: "HCl (5 M)"
  },

  theoretical: {
    Na:  { mass: 45.980,  percent: 26.587, source: "2×Na⁺", aasSignal: "FAAS da 589.0 nm (alohida)" },
    Se:  { mass: 78.971,  percent: 45.664, source: "Markaziy Se⁴⁺ atomi", aasSignal: "196.0 nm da asosiy signal (HGAAS)" },
    O:   { mass: 47.997,  percent: 27.753, source: "SeO₃²⁻ (3×O)", aasSignal: "FAAS da o'lchanmaydi" }
  },

  calibrationCurve: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (5 M HCl)" },
    { conc: 2.0, absorbance: 0.101, note: "Standart 1" },
    { conc: 5.0, absorbance: 0.253, note: "Standart 2" },
    { conc: 10.0, absorbance: 0.505, note: "Standart 3" },
    { conc: 15.0, absorbance: 0.758, note: "Standart 4" },
    { conc: 20.0, absorbance: 1.010, note: "Standart 5" }
  ],

  experimentalRuns: [
    { id: "AAS-24-901", date: "2025-02-10", absorbance: 0.505, conc_ugL: 10.00, sample_mg: 50.0, dilution: 10000, Se_percent: 45.65, rsd: 1.85, note: "Toza Na₂[SeO₃] (HGAAS)" },
    { id: "AAS-24-902", date: "2025-02-10", absorbance: 0.508, conc_ugL: 10.06, sample_mg: 50.0, dilution: 10000, Se_percent: 45.93, rsd: 1.90, note: "Ikkinchi parallel" },
    { id: "AAS-24-903", date: "2025-02-10", absorbance: 0.502, conc_ugL: 9.94, sample_mg: 50.0, dilution: 10000, Se_percent: 45.38, rsd: 1.75, note: "Uchinchi parallel" },
    { id: "AAS-24-904", date: "2025-02-10", absorbance: 0.507, conc_ugL: 10.04, sample_mg: 50.0, dilution: 10000, Se_percent: 45.84, rsd: 1.88, note: "To'rtinchi parallel" },
    { id: "AAS-24-905", date: "2025-02-10", absorbance: 0.504, conc_ugL: 9.98, sample_mg: 50.0, dilution: 10000, Se_percent: 45.56, rsd: 1.80, note: "Beshinchi parallel" },
    { id: "AAS-24-906", date: "2025-02-11", absorbance: 0.405, conc_ugL: 8.02, sample_mg: 50.0, dilution: 10000, Se_percent: 36.61, rsd: 2.85, note: "⚠ Cu²⁺ interferensiyasi (100 ppm qo'shilgan)" },
    { id: "AAS-24-907", date: "2025-02-11", absorbance: 0.051, conc_ugL: 1.01, sample_mg: 50.0, dilution: 1000, Se_percent: 46.11, rsd: 2.55, note: "GFAAS (1000× suyuqlantirish, μg/L darajasi)" },
    { id: "BLANK-10",   date: "2025-02-10", absorbance: 0.000, conc_ugL: 0.00, sample_mg: 0.0,  dilution: 1,  Se_percent: 0.00, rsd: 0.00, note: "Blank (5 M HCl)" },
    { id: "STD-Se-20",  date: "2025-02-10", absorbance: 1.012, conc_ugL: 20.00, sample_mg: 0.0, dilution: 1, Se_percent: 0.00, rsd: 0.85, note: "NIST Se standarti (20 μg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Xavfsizlik choralari", desc: "⚠ Se⁴⁺ zaharli! Nitril qo'lqop, laboratoriya xalati majburiy. HGAAS da H₂Se gazi hosil bo'ladi — u juda zaharli, tortish shkafi ichida ishlash.", time: "doimiy", critical: true },
    { step: 2, title: "Namuna tortish", desc: "Analitik tarozida 50.0 ± 0.1 mg Na₂[SeO₃] tortiladi. Oq kristallar — Se⁴⁺ belgisi.", time: "2 daq", critical: true },
    { step: 3, title: "Eritish (HCl da)", desc: "100 mL hajmli kolbaga solib, 50 mL 5 M HCl qo'shiladi. HCl gidrid generatsiyasi uchun zarur.", time: "5 daq", critical: true },
    { step: 4, title: "Hajmni to'ldirish", desc: "5 M HCl bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~500 mg/L Na₂SeO₃ ≈ 228 mg/L Se.", time: "1 daq", critical: false },
    { step: 5, title: "10000× suyuqlantirish", desc: "10 μL eritmadan 100 mL kolbaga o'tkaziladi. Natija: ~22.8 μg/L Se — HGAAS kalibrlash diapazonida (0.001-20 μg/L).", time: "3 daq", critical: true },
    { step: 6, title: "NaBH₄ reagentini tayyorlash", desc: "0.6% NaBH₄ + 0.5% NaOH eritmasi tayyorlanadi. Bu reagent har kuni yangi tayyorlanishi kerak.", time: "5 daq", critical: true },
    { step: 7, title: "HGAAS da o'lchash", desc: "Avtomatik gidrid generatori: 1 mL namuna + 1 mL HCl + 1 mL NaBH₄ → H₂Se gazi → Ar oqimi bilan kvarts kyuvetaga → AAS (196.0 nm).", time: "~1 daqiqa/namuna", critical: false },
    { step: 8, title: "Chiqindilarni utilizatsiya", desc: "⚠ Se chiqindilarini alohida idishda yig'ish majburiy. H₂Se gazi maxsus filtr orqali o'tkaziladi.", time: "5 daq", critical: true }
  ],

  interferences: [
    { type: "Kimyoviy (Cu²⁺, Ni²⁺, Co²⁺)", severity: "Yuqori", description: "O'tish metallari gidrid generatsiyasini to'xtatadi — Se signal kamayadi.", solution: "Tiourea yoki L-sistein qo'shish, yoki oldindan ajratish (ion almashinish)" },
    { type: "Kimyoviy (As³⁺, Sb³⁺)", severity: "O'rta", description: "Boshqa gidrid hosil qiluvchi elementlar raqobat qiladi.", solution: "pH ni optimallashtirish (pH 1-2 da Se afzal)" },
    { type: "Spektral", severity: "Past", description: "Se 196.0 nm da nisbatan toza signal. Fe 196.0 nm da juda yaqin, lekin HGAAS da matritsa ajratilgan.", solution: "Deuteriy fon korreksiyasi" },
    { type: "Ionlanish", severity: "Juda past", description: "HGAAS da atomlanish kvarts kyuvetada (900°C) — ionlanish yo'q.", solution: "Hech narsa kerak emas" },
    { type: "Matritsa (yuqori tuz)", severity: "O'rta", description: "Yuqori Na⁺ konsentratsiyasi gidrid generatsiyasiga ta'sir qilishi mumkin.", solution: "Standart qo'shish metodi yoki matritsa moslashtirish" }
  ],

  tgaSteps: [
    { start: 25, end: 300, loss: 0.0, event: "Na₂SeO₃ barqaror", color: "#10b981", aasEffect: "Se signal barqaror" },
    { start: 300, end: 500, loss: 0.0, event: "Eritish (mp = ~350°C)", color: "#f59e0b", aasEffect: "Se signal o'zgarmaydi" },
    { start: 500, end: 700, loss: 23.1, event: "O₂ yo'qolishi (Na₂SeO₃ → Na₂SeO₂)", color: "#ef4444", aasEffect: "Se⁴⁺ → Se²⁺ qaytarilishi" },
    { start: 700, end: 900, loss: 23.1, event: "Qo'shimcha O₂ yo'qolishi", color: "#ef4444", aasEffect: "Na₂Se hosil bo'lishi mumkin" },
    { start: 900, end: 1000, loss: 0.0, event: "Na₂Se yoki Na₂SeOₓ qoldig'i", color: "#6366f1", aasEffect: "Gravimetriya qiyin" }
  ],

  relatedMethods: [
    { name: "ICP-MS", role: "Se ppt darajasida, bir vaqtda As, Te ham", aasAdvantage: "ICP-MS juda sezgir (ppt), ko'p elementli", aasDisadvantage: "HGAAS arzon, oddiy, bir element uchun yetarli", complementarity: "98%" },
    { name: "Voltammetriya (CSV)", role: "Katodik stripping voltammetriyasi — Se⁴⁺ ppb darajasida", aasAdvantage: "CSV juda sezgir (0.01 ppb), speciation mumkin", aasDisadvantage: "HGAAS soddaroq, tezroq", complementarity: "95%" },
    { name: "GFAAS", role: "Grafit pechi AAS — Se ppb darajasida", aasAdvantage: "GFAAS 1000× sezgir FAAS dan", aasDisadvantage: "HGAAS ancha sezgir (50×)", complementarity: "96%" },
    { name: "UV-Vis spektroskopiya", role: "Se⁴⁺ ni DAB (3,3'-diaminobenzidin) bilan rangli kompleks", aasAdvantage: "UV-Vis arzon, oddiy", aasDisadvantage: "HGAAS ancha sezgir", complementarity: "80%" },
    { name: "Fluorimetriya", role: "Se⁴⁺ ni DAN (2,3-diaminonaftalin) bilan fluoressent kompleks", aasAdvantage: "Fluorimetriya sezgir (ppb)", aasDisadvantage: "HGAAS ancha oddiy", complementarity: "88%" },
    { name: "Ion xromatografiya (IC)", role: "SeO₃²⁻ va SeO₄²⁻ ni ajratish", aasAdvantage: "IC speciation qila oladi", aasDisadvantage: "HGAAS ancha sezgir", complementarity: "90%" }
  ]
}

function calculateSePercent(absorbance, sampleMass, dilutionFactor) {
  const slope = 0.0505  // A = 0.0505 × C (μg/L), R² = 0.99999
  const conc_ugL = absorbance / slope
  const conc_mgL = conc_ugL / 1000
  const totalVolume = 100
  const Se_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Se_percent = (Se_mass_mg / sampleMass) * 100
  return {
    conc_ugL: parseFloat(conc_ugL.toFixed(3)),
    conc_mgL: parseFloat(conc_mgL.toFixed(6)),
    Se_mass: parseFloat(Se_mass_mg.toFixed(4)),
    Se_percent: parseFloat(Se_percent.toFixed(2))
  }
}

export default function Na2SeO3Page() {
  const [activeRun, setActiveRun] = useState("AAS-24-901")
  const [customAbsorbance, setCustomAbsorbance] = useState(0.505)
  const [customMass, setCustomMass] = useState(50.0)
  const [dilutionFactor, setDilutionFactor] = useState(10000)
  const [selectedInterference, setSelectedInterference] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaSe = Math.abs(run.Se_percent - COMPOUND.theoretical.Se.percent)
  const statusColor = deltaSe <= 1.0 ? "text-green-400" : deltaSe <= 3.0 ? "text-yellow-400" : "text-red-400"

  const calcResult = useMemo(() => 
    calculateSePercent(customAbsorbance, customMass, dilutionFactor),
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
            <span className="text-cyan-400 font-semibold">Na₂[SeO₃]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-orange-600 px-2 py-1 rounded ml-2">💨 HGAAS</span>
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
                <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Se⁴⁺ d¹⁰</span>
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">λ = 196.0 nm</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">⭐ LOD 0.001 μg/L</span>
                <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Mikroelement</span>
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
        <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (AAS uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">Na₂[SeO₃]</strong> — natriy selenit, selenning eng muhim birikmalaridan biri, muhim mikroelement manbai. AAS tahlilida <strong className="text-cyan-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-cyan-500 text-xs md:text-sm">
                <li>Nazariy <strong className="text-white">%Se = 45.66%</strong> — yuqori foiz</li>
                <li>Se⁴⁺ <strong className="text-green-300">HGAAS da eng sezgir elementlardan</strong> (LOD 0.001 μg/L)</li>
                <li><strong className="text-white">Gidrid generatsiyasi</strong> — matritsadan ajratish</li>
                <li>Se⁴⁺ <strong className="text-white">diamagnit</strong> (d¹⁰, rangsiz)</li>
                <li><strong className="text-cyan-300">Muhim mikroelement</strong> — tibbiyot, oziq-ovqat</li>
                <li>Atrof-muhit monitoringi uchun <strong className="text-cyan-300">ppb darajasida</strong> tahlil</li>
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

        {/* 1b. HGAAS — ENG MUHIM QISM */}
        <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border-2 border-orange-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💨</span> {COMPOUND.hgaasMethod.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.hgaasMethod.description}
          </p>

          <div className="bg-orange-950/40 rounded-xl p-4 border-2 border-orange-500/50 mb-4">
            <h4 className="text-orange-300 font-bold text-sm mb-2">Reaksiya:</h4>
            <div className="bg-purple-950/60 rounded-lg p-3 font-mono text-sm text-center">
              SeO₃²⁻ + NaBH₄ + HCl → <span className="text-orange-400 font-bold">H₂Se↑</span> + NaCl + H₂O + B(OH)₃
            </div>
          </div>

          <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700/50 mb-4">
            <h4 className="text-orange-300 font-bold text-sm mb-3">HGAAS afzalliklari:</h4>
            <div className="space-y-2">
              {COMPOUND.hgaasMethod.advantages.map((adv, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-green-400 font-bold shrink-0">#{i+1}</span>
                  <span className="text-purple-200">{adv}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-2 px-3 text-left text-purple-300">Usul</th>
                  <th className="py-2 px-3 text-center text-purple-300">λ (nm)</th>
                  <th className="py-2 px-3 text-center text-purple-300">LOD</th>
                  <th className="py-2 px-3 text-left text-purple-300">Sezgirlik</th>
                  <th className="py-2 px-3 text-left text-purple-300">Xulosa</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.hgaasMethod.comparison.map((c, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${c.method === "HGAAS" ? 'bg-green-900/20' : ''}`}>
                    <td className={`py-2 px-3 font-bold ${c.method === "HGAAS" ? "text-green-400" : "text-purple-300"}`}>
                      {c.method} {c.method === "HGAAS" && "✓✓"}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-blue-400">{c.lambda}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-yellow-400">{c.lod}</td>
                    <td className={`py-2 px-3 ${c.sensitivity.includes("Eng yuqori") ? "text-green-300" : c.sensitivity === "Yuqori" ? "text-yellow-300" : "text-red-300"}`}>
                      {c.sensitivity}
                    </td>
                    <td className="py-2 px-3 text-purple-200">
                      {c.verdict}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 1c. BIOLOGIK AHAMIYATI */}
        <div className="bg-gradient-to-r from-teal-900/40 to-cyan-900/40 border border-teal-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧬</span> {COMPOUND.biologicalImportance.title}
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            {COMPOUND.biologicalImportance.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-teal-950/40 p-3 rounded-xl border border-teal-700/30">
              <div className="text-[10px] text-teal-400 uppercase mb-1">Kunlik ehtiyoj</div>
              <div className="text-sm font-mono text-green-400 font-bold">{COMPOUND.biologicalImportance.dailyRequirement}</div>
            </div>
            <div className="bg-red-950/40 p-3 rounded-xl border border-red-700/30">
              <div className="text-[10px] text-red-400 uppercase mb-1">Yuqori chegarasi</div>
              <div className="text-sm font-mono text-yellow-400">{COMPOUND.biologicalImportance.upperLimit}</div>
            </div>
            <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Yetishmovchilik</div>
              <div className="text-xs text-white">{COMPOUND.biologicalImportance.deficiency}</div>
            </div>
            <div className="bg-orange-950/40 p-3 rounded-xl border border-orange-700/30">
              <div className="text-[10px] text-orange-400 uppercase mb-1">Zaharlilik</div>
              <div className="text-xs text-white">{COMPOUND.biologicalImportance.toxicity}</div>
            </div>
          </div>

          <div className="bg-teal-900/30 rounded-lg p-4 border border-teal-700/50">
            <h4 className="text-teal-300 font-bold text-sm mb-3">Qo'llanilish sohalari:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {COMPOUND.biologicalImportance.applications.map((app, i) => (
                <div key={i} className="bg-purple-950/40 rounded-lg p-2 text-xs">
                  <div className="font-bold text-teal-300">{app.field}</div>
                  <div className="text-purple-300 mt-1">{app.use}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. AAS PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> AAS tahlil parametrlari (Se uchun HGAAS)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Se⁴⁺ uchun <strong className="text-cyan-300">HGAAS (Gidrid generatsiyasi)</strong> eng yaxshi usul — LOD 0.001 μg/L. GFAAS ham ishlatiladi (0.5 μg/L).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Element</div>
              <div className="text-lg font-bold text-cyan-400">{COMPOUND.aasParameters.element}</div>
              <div className="text-[10px] text-purple-300 mt-1">{COMPOUND.aasParameters.oxidationState}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">λ (asosiy)</div>
              <div className="text-lg font-mono font-bold text-cyan-400">{COMPOUND.aasParameters.lambda.primary} nm</div>
              <div className="text-[10px] text-purple-300 mt-1">Alt: {COMPOUND.aasParameters.lambda.secondary} nm</div>
            </div>
            <div className="bg-orange-950/60 p-3 rounded-xl border-2 border-orange-500/50">
              <div className="text-[10px] text-orange-400 uppercase mb-1">💨 Usul</div>
              <div className="text-sm font-bold text-orange-400">{COMPOUND.aasParameters.atomization_HGAAS}</div>
              <div className="text-[10px] text-purple-300 mt-1">Ar-H₂ alangasi</div>
            </div>
            <div className="bg-green-950/60 p-3 rounded-xl border-2 border-green-500/50">
              <div className="text-[10px] text-green-400 uppercase mb-1">⭐ LOD (HGAAS)</div>
              <div className="text-lg font-mono font-bold text-green-400">{COMPOUND.aasParameters.lod_HGAAS} μg/L</div>
              <div className="text-[10px] text-purple-300 mt-1">Eng past LOD!</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-orange-950/40 rounded-xl p-4 border-2 border-orange-500/30">
              <h4 className="text-orange-400 font-bold text-xs uppercase mb-2">HGAAS parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.linearRange_HGAAS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.aasParameters.lod_HGAAS} μg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">LOQ:</span>
                  <span className="font-mono text-yellow-400">{COMPOUND.aasParameters.loq_HGAAS} μg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Reagent:</span>
                  <span className="font-mono text-orange-300">{COMPOUND.aasParameters.reagent}</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-cyan-400 font-bold text-xs uppercase mb-2">GFAAS parametrlari (alternativ):</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.linearRange_GFAAS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-yellow-400">{COMPOUND.aasParameters.lod_GFAAS} μg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">LOQ:</span>
                  <span className="font-mono text-yellow-400">{COMPOUND.aasParameters.loq_GFAAS} μg/L</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-cyan-400 font-bold text-xs uppercase mb-3">Umumiy parametrlar:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-purple-400">Lampa:</div>
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
                <div className="text-purple-400">Fon korreksiyasi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.backgroundCorrection}</div>
              </div>
              <div>
                <div className="text-purple-400">Tipik RSD:</div>
                <div className="font-mono text-green-300">{COMPOUND.aasParameters.rsd_typical}</div>
              </div>
              <div>
                <div className="text-purple-400">Kislota:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.acid}</div>
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
            Na₂[SeO₃] — <strong className="text-cyan-300">oddiy tuz</strong>. AAS <strong className="text-cyan-300">faqat Se</strong> ni o'lchaydi. Na va O FAAS da ko'rinmaydi.
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
                    <td className="py-3 pl-2 font-bold text-cyan-400">{el}</td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-400">{d.aasSignal}</td>
                  </tr>
                ))}
                <tr className="bg-cyan-900/20 font-bold border-t border-cyan-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-cyan-300">AAS: Se (45.66%) — HGAAS da kuchli signal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. KALIBRLASH EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> Kalibrlash egri chizig'i (Se, 196.0 nm, HGAAS)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Se standartlari (5 M HCl da) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-cyan-300">R² = 0.99999</strong> — deyarli mukammal chiziqli bog'liqlik. <strong className="text-white">A = 0.0505 × C (μg/L)</strong>.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 500 260" className="w-full h-full overflow-visible">
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.1)*200} x2="480" y2={220 - (v/1.1)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.1)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 5, 10, 15, 20].map(c => (
                <g key={c}>
                  <text x={50 + (c/20)*430} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="265" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Se konsentratsiyasi (μg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish (A)</text>

              <line x1="50" y1="220" x2="480" y2={220 - (1.010/1.1)*200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/20)*430
                const y = 220 - (p.absorbance/1.1)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#06b6d4" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#67e8f9">
                        {p.absorbance.toFixed(3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (10.0/20)*430
                const y = 220 - (0.505/1.1)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (10.0 μg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="350" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#06b6d4" strokeWidth="1" />
              <text x="410" y="48" textAnchor="middle" fontSize="10" fill="#67e8f9" fontWeight="bold">
                R² = 0.99999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-cyan-500 rounded-full"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya (A = 0.0505·C)</span>
          </div>
        </div>

        {/* 5. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> AAS yugurishlari — HGAAS va GFAAS
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan AAS o'lchashlari. AAS-24-907 — <strong className="text-green-300">GFAAS</strong>, qolganlari HGAAS. AAS-24-906 — Cu²⁺ interferensiyasi.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isCu = r.id === "AAS-24-906"
              const isGFAAS = r.id === "AAS-24-907"
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun === r.id 
                      ? "bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
                      : isBlank 
                        ? "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-gray-500"
                        : isStd
                          ? "bg-amber-900/30 border-amber-700/30 text-amber-300 hover:border-amber-500"
                          : isCu
                            ? "bg-red-900/30 border-red-700/30 text-red-300 hover:border-red-500"
                            : isGFAAS
                              ? "bg-green-900/30 border-green-700/30 text-green-300 hover:border-green-500"
                              : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                  }`}
                >
                  {r.id}
                  {isCu && " ⚠ Cu"}
                  {isGFAAS && " 🟢 GFAAS"}
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
                    <span className="font-mono text-cyan-400 text-lg">{run.absorbance.toFixed(3)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-cyan-900/20 rounded border border-cyan-500/20">
                    <span className="text-sm text-cyan-400 font-medium">C (μg/L):</span>
                    <span className="font-mono text-white text-lg">{run.conc_ugL.toFixed(2)}</span>
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
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Se:</span>
                    <span className="font-mono text-white text-lg">{run.Se_percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Se:</span>
                    <span className="font-mono text-cyan-400">{COMPOUND.theoretical.Se.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaSe.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">RSD:</span>
                    <span className={`font-mono ${run.rsd <= 2.0 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {run.rsd.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : deltaSe <= 1.0
                    ? "bg-green-900/30 border-green-700/30"
                    : deltaSe <= 3.0
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : deltaSe <= 1.0 ? "text-green-400" : deltaSe <= 3.0 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : deltaSe <= 1.0 ? "✓ Na₂SeO₃ tasdiqlandi" : deltaSe <= 3.0 ? "⚠ Interferensiya" : "✗ Mos emas"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    deltaSe <= 1.0
                      ? "HGAAS natijasi Na₂SeO₃ formulaga to'liq mos keladi (%Se = 45.66%). Gidrid generatsiyasi yaxshi ishlayapti, RSD past."
                      : deltaSe <= 3.0
                        ? "%Se qiymati chegarada — Cu²⁺ interferensiyasi yoki boshqa matritsa effekti bo'lishi mumkin."
                        : "%Se juda past — namuna ifloslangan yoki noto'g'ri tayyorlangan."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Blank — signal nolga yaqin. Tizim toza."
                      : "NIST standarti — kalibrlash to'g'ri bajarilgan."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-cyan-400 mb-4 flex justify-between">
                <span>%Se Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Nazariy: 45.66%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isCu = r.id === "AAS-24-906"
                  const isGFAAS = r.id === "AAS-24-907"
                  const val = r.Se_percent
                  const heightPct = Math.min((val / 50) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-cyan-400/50 z-0" style={{ bottom: `${(45.664/50)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : isCu ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                : isGFAAS ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                                : 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : isCu ? 'bg-red-700/40'
                              : isGFAAS ? 'bg-green-700/40'
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : isCu ? 'text-red-400' : isGFAAS ? 'text-green-400' : 'text-cyan-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-cyan-500 rounded"></span> HGAAS</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> GFAAS</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Interferensiya</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-cyan-400/50"></span> Nazariy (45.66%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <span>📊</span> Kalibrlash egri chizig'i — to'liq ma'lumotlar (HGAAS)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-purple-700">
                      <th className="py-2 px-3 text-left text-purple-300">C (μg/L)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Yutilish (A)</th>
                      <th className="py-2 px-3 text-left text-purple-300">Izoh</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200 font-mono">
                    {COMPOUND.calibrationCurve.map((p, i) => (
                      <tr key={i} className="border-b border-purple-800/30">
                        <td className="py-2 px-3 text-cyan-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-cyan-900/20 rounded-lg border border-cyan-700/30 text-xs text-purple-200">
                <strong className="text-cyan-300">Regressiya:</strong> A = 0.0505 × C + 0.0001, R² = 0.99999
              </div>
              <div className="mt-3 p-3 bg-green-900/20 rounded-lg border border-green-700/30 text-xs text-purple-200">
                <strong className="text-green-300">⭐ Eslatma:</strong> Se — HGAAS ning eng sezgir elementlaridan biri (LOD = 0.001 μg/L). Slope juda yuqori.
              </div>
              <button 
                onClick={() => setShowCalibrationModal(false)}
                className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* 6. INTERFERENSIYALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span> Interferensiyalar (HGAAS uchun muhim!)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            HGAAS da interferensiyalar <strong className="text-cyan-300">asosan kimyoviy</strong> — o'tish metallari gidrid generatsiyasini to'xtatadi. Har birini bosib, batafsil ma'lumot oling.
          </p>

          <div className="space-y-2">
            {COMPOUND.interferences.map((int, i) => (
              <button
                key={i}
                onClick={() => setSelectedInterference(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedInterference === i
                    ? "bg-cyan-900/40 border-cyan-500"
                    : "bg-purple-950/40 border-purple-700/30 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-cyan-400">{int.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    int.severity === "Juda past" ? "bg-green-900/30 text-green-400 border-green-600/30" :
                    int.severity === "Past" ? "bg-green-900/30 text-green-400 border-green-600/30" :
                    int.severity === "O'rta" ? "bg-orange-900/30 text-orange-400 border-orange-600/30" :
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

        {/* 7. TGA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔥</span> TGA bilan AAS bog'liqligi
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Na₂SeO₃ <strong className="text-cyan-300">350°C da eriydi, 500°C dan keyin parchalanadi</strong>. O₂ chiqib ketadi, Na₂Se yoki Na₂SeOₓ qoldig'i hosil bo'ladi.
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
                d="M 50 20 L 250 20 Q 270 20 280 35 L 290 35 Q 300 35 310 50 L 380 130 Q 390 145 410 145 L 450 145 Q 465 145 475 160 L 520 200 Q 530 210 550 210 L 580 210" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="150" y="15" textAnchor="middle" fill="#10b981">AAS: %Se = 45.66%</text>
                
                <line x1="290" y1="35" x2="290" y2="220" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="290" y="235" textAnchor="middle" fill="#f59e0b">~350°C</text>
                <text x="310" y="25" fill="#f59e0b">Eritish</text>

                <line x1="380" y1="130" x2="380" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="380" y="235" textAnchor="middle" fill="#ef4444">~600°C</text>
                <text x="400" y="120" fill="#ef4444">-O₂ (23.1%)</text>

                <line x1="520" y1="200" x2="520" y2="220" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="520" y="235" textAnchor="middle" fill="#6366f1">~900°C</text>
                <text x="540" y="190" fill="#6366f1">-O₂ (23.1%)</text>

                <text x="565" y="205" textAnchor="middle" fill="#a855f7">Na₂Se qoldig'i</text>
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
                <div className="text-[10px] text-cyan-300 mt-2 italic">AAS effekti: {step.aasEffect}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> AAS ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            Na₂SeO₃ uchun AAS ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-cyan-300">mikroelement monitoringi</strong> uchun muhim. <strong className="text-green-300">ICP-MS</strong> va <strong className="text-cyan-300">Fluorimetriya</strong> eng kuchli qo'shimcha metodlar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-cyan-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-cyan-300">{m.name}</h3>
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

          <div className="mt-5 bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-cyan-300 mb-2">💡 Se monitoringi uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">HGAAS (Se, ppb) + ICP-MS (ppt, ko'p elementli) + Fluorimetriya (DAN) + Ion xromatografiya (SeO₃²⁻/SeO₄²⁻) + Voltammetriya (CSV)</strong> — besh xil metod birgalikda Se ning barcha shakllarini va konsentratsiyalarini qamrab oladi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> AAS uchun namuna tayyorlash (HGAAS — maxsus)
          </h2>
          <p className="text-xs text-red-300 mb-5 font-bold">
            ⚠ HGAAS da H₂Se gazi hosil bo'ladi — u juda zaharli! Barcha ishlar tortish shkafi ichida, maxsus ventilyatsiya bilan bajarilishi shart.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-cyan-900/40 border-cyan-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-cyan-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-cyan-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> HGAAS dan %Se hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan yutilish (A), namuna massasi va suyuqlantirish faktori bo'yicha <strong className="text-cyan-300">%Se</strong> ni avtomatik hisoblang. Konsentratsiya μg/L da!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, 196.0 nm, HGAAS):</label>
              <input 
                type="number" step="0.001" value={customAbsorbance}
                onChange={(e) => setCustomAbsorbance(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-purple-400">C (μg/L):</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{calcResult.conc_ugL}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">C (mg/L):</div>
                <div className="text-xl font-mono font-bold text-orange-400">{calcResult.conc_mgL}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Se massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{calcResult.Se_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Se:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult.Se_percent - 45.66) <= 1.0 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Se_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: C(μg/L) = A / 0.0505; %Se = (C(mg/L) × 100 × DF) / (m × 1000) × 100
            </p>
          </div>
        </div>

        {/* 11. AAS CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> AAS ning Na₂SeO₃ uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                AAS Na₂SeO₃ ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Se⁴⁺ va Se⁶⁺ ni farqlay olmaydi</strong> — IC kerak</li>
                <li><strong className="text-red-300">Faqat Se ni o'lchaydi</strong> — Na, O uchun boshqa metodlar</li>
                <li><strong className="text-red-300">Cu²⁺, Ni²⁺, Co²⁺ interferensiyalari</strong> — HGAAS da muhim</li>
                <li><strong className="text-red-300">H₂Se gazi zaharli</strong> — maxsus ventilyatsiya</li>
                <li><strong className="text-red-300">Bir vaqtda bitta element</strong> — ICP ko'p elementli</li>
                <li><strong className="text-red-300">NaBH₄ reagent har kuni yangi</strong> — qo'shimcha ish</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>Na₂SeO₃ ni to'liq tasdiqlash</strong> uchun kamida 4-5 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-cyan-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. HGAAS (Se%, ppb)</span>
                  <span className="text-cyan-400 font-mono">45.66%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. ICP-MS (Se, ppt)</span>
                  <span className="text-cyan-400 font-mono">As, Te ham</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. Ion xromatografiya</span>
                  <span className="text-cyan-400 font-mono">SeO₃²⁻/SeO₄²⁻</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. Fluorimetriya (DAN)</span>
                  <span className="text-cyan-400 font-mono">Se⁴⁺ specifik</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. FAAS (Na)</span>
                  <span className="text-cyan-400 font-mono">26.59%</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 5 ta metod birgalikda Na₂SeO₃ ni to'liq tavsiflaydi
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
              <h3 className="font-bold text-white mb-1">AAS afzalligi (HGAAS)</h3>
              <p className="text-xs text-purple-200">Se ni 45.66% aniqlikda o'lchaydi. <strong className="text-cyan-300">Eng yuqori sezgirlik!</strong> LOD 0.001 μg/L — rekord. Matritsadan ajratish — interferensiyalar minimal.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-cyan-300">H₂Se gazi zaharli!</strong> Maxsus ventilyatsiya. Cu²⁺, Ni²⁺ interferensiyalari. Se⁴⁺/Se⁶⁺ farqlanmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">ICP-MS (ppt), Fluorimetriya (DAN), IC (SeO₃²⁻/SeO₄²⁻), Voltammetriya (CSV), FAAS (Na) — mikroelement monitoringi uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/aas" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← AAS metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-sm bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • Na₂[SeO₃] • AAS moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955), WHO Guidelines, Berzelius (1817), Schwarz (1957)</p>
        </div>
      </footer>
    </main>
  )
}