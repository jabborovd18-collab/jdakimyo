"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// K₃[Fe(CN)₆] — AAS (Atom-Absorbsion Spektroskopiya) MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)
// Xususiyat: Fe³⁺ FAAS tahlili, 248.3 nm, qizil qon tuzi
// O'ziga xoslik: AAS Fe²⁺ va Fe³⁺ ni farqlay olmaydi!
// Maqsad: Faqat AAS tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Fe: 55.845, K: 39.098, C: 12.011, N: 14.007, H: 1.008, O: 15.999
}

const COMPOUND = {
  formulaHTML: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
  formulaPlain: "K3[Fe(CN)6]",
  iupac: "Kaliy geksatsianoferrat(III)",
  formulaExpanded: "K₃FeC₆N₆ (gidrat YO'Q!)",
  commonName: "Qizil qon tuzi (Red prussiate of potash)",
  molarMass: 329.24,
  casNumber: "13746-66-2",
  color: "to'q qizil kristallar",
  stability: "havoda barqaror, log β₆ ≈ 42 (K₄[Fe(CN)₆] dan ham barqaror), 200°C da parchalanadi",
  
  historicalFact: {
    title: "Berlin ko'ki va Prussiya armiyasining yashirin dori",
    text: "K₃[Fe(CN)₆] — 1704-yilda Berlin rang ishlab chiqaruvchisi Johann Jacob Diesbach tomonidan tasodifan kashf etilgan Berlin ko'ki (Prussian Blue) ning oksidlangan shakli. Qiziq tarixiy fakt: Prussiya armiyasi XVIII asrda o'z formalarini ko'k rangga bo'yash uchun Berlin ko'ki dan foydalangan va bu usulni davlat siri sifatida saqlagan. K₃[Fe(CN)₆] K₄[Fe(CN)₆] ning xlor (Cl₂) yoki vodorod peroksid (H₂O₂) bilan oksidlanishidan olinadi. Kimyoviy jihatdan qiziq: Fe²⁺ → Fe³⁺ oksidlanishiga qaramasdan, kompleks barqarorligi OSHADI (log β₆ 35 dan 42 ga). AAS nuqtai nazaridan bu birikma K₄[Fe(CN)₆] bilan bir xil λ = 248.3 nm da signal beradi — AAS ularni FARQLAY OLMAYDI, faqat %Fe qiymati orqali (16.96% vs 13.22%) aniqlash mumkin.",
    year: "1704-1720"
  },

  aasParameters: {
    element: "Fe",
    oxidationState: "Fe³⁺ (lekin AAS buni farqlamaydi!)",
    hclLamp: "Fe katod lampasi (Hollow Cathode Lamp)",
    lambda: { primary: 248.3, secondary: 372.0 },
    slitWidth: 0.2,
    lampCurrent: 5,
    atomization: "FAAS (Alanga AAS)",
    flame: "Havo-C₂H₂ (oxidizing, ~2300°C)",
    burnerHeight: 10,
    backgroundCorrection: "Deuteriy lampasi (D₂)",
    linearRange: "0.05 - 5.0 mg/L",
    sensitivity: 0.04,
    lod: 0.005,
    loq: 0.017,
    rsd_typical: "0.5 - 1.5%"
  },

  theoretical: {
    Fe:  { mass: 55.845,  percent: 16.964, source: "Markaziy Fe³⁺ atomi", aasSignal: "248.3 nm da asosiy signal" },
    K:   { mass: 117.294, percent: 35.623, source: "3×K⁺ ionlari", aasSignal: "FAAS da 766.5 nm da o'lchanishi mumkin" },
    C:   { mass: 72.066,  percent: 21.886, source: "6×CN⁻ (6×C)", aasSignal: "FAAS da o'lchanmaydi" },
    N:   { mass: 84.042,  percent: 25.527, source: "6×CN⁻ (6×N)", aasSignal: "FAAS da o'lchanmaydi" },
    H:   { mass: 0.000,   percent: 0.000,  source: "Gidrat YO'Q!", aasSignal: "—" },
    O:   { mass: 0.000,   percent: 0.000,  source: "Kislorod YO'Q", aasSignal: "—" }
  },

  calibrationCurve: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (0.1 M HNO₃)" },
    { conc: 0.5, absorbance: 0.053, note: "Standart 1" },
    { conc: 1.0, absorbance: 0.105, note: "Standart 2" },
    { conc: 2.0, absorbance: 0.211, note: "Standart 3" },
    { conc: 3.0, absorbance: 0.316, note: "Standart 4" },
    { conc: 4.0, absorbance: 0.421, note: "Standart 5" },
    { conc: 5.0, absorbance: 0.528, note: "Standart 6" }
  ],

  experimentalRuns: [
    { id: "AAS-24-101", date: "2024-06-12", absorbance: 0.450, conc_mgL: 4.27, sample_mg: 20.0, dilution: 10, Fe_percent: 16.98, rsd: 0.48, note: "Toza K₃[Fe(CN)₆]" },
    { id: "AAS-24-102", date: "2024-06-12", absorbance: 0.448, conc_mgL: 4.25, sample_mg: 20.0, dilution: 10, Fe_percent: 16.90, rsd: 0.42, note: "Ikkinchi parallel" },
    { id: "AAS-24-103", date: "2024-06-12", absorbance: 0.452, conc_mgL: 4.29, sample_mg: 20.0, dilution: 10, Fe_percent: 17.06, rsd: 0.55, note: "Uchinchi parallel" },
    { id: "AAS-24-104", date: "2024-06-12", absorbance: 0.449, conc_mgL: 4.26, sample_mg: 20.0, dilution: 10, Fe_percent: 16.94, rsd: 0.44, note: "To'rtinchi parallel" },
    { id: "AAS-24-105", date: "2024-06-12", absorbance: 0.451, conc_mgL: 4.28, sample_mg: 20.0, dilution: 10, Fe_percent: 17.02, rsd: 0.38, note: "Beshinchi parallel" },
    { id: "AAS-24-106", date: "2024-06-13", absorbance: 0.455, conc_mgL: 4.32, sample_mg: 20.0, dilution: 10, Fe_percent: 17.18, rsd: 0.62, note: "K₄[Fe(CN)₆] bilan aralashma (Fe²⁺ + Fe³⁺)" },
    { id: "AAS-24-107", date: "2024-06-13", absorbance: 0.430, conc_mgL: 4.08, sample_mg: 20.0, dilution: 10, Fe_percent: 16.22, rsd: 0.75, note: "Qisman qaytarilgan (Fe²⁺ aralashmasi)" },
    { id: "BLANK-02",   date: "2024-06-12", absorbance: 0.001, conc_mgL: 0.01, sample_mg: 0.0,  dilution: 1,  Fe_percent: 0.00,  rsd: 0.00, note: "Blank (0.1 M HNO₃)" },
    { id: "STD-Fe-10",  date: "2024-06-12", absorbance: 0.526, conc_mgL: 5.00, sample_mg: 0.0,  dilution: 1,  Fe_percent: 0.00,  rsd: 0.30, note: "NIST Fe standarti (10 mg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 20.0 ± 0.1 mg K₃[Fe(CN)₆] tortiladi. Gidrat yo'qligi sababli, suvsiz massadan foydalanish mumkin.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 50 mL 0.1 M HNO₃ qo'shiladi. K₃[Fe(CN)₆] kuchli oksidlovchi — HNO₃ bilan yaxshi aralashadi.", time: "5 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "0.1 M HNO₃ bilan 100 mL gacha to'ldiriladi. Bu eritma konsentratsiyasi: ~200 mg/L K₃[Fe(CN)₆] ≈ 34 mg/L Fe.", time: "1 daq", critical: false },
    { step: 4, title: "10× suyuqlantirish", desc: "1.0 mL eritmadan 10 mL kolbaga o'tkaziladi. Natija: ~3.4 mg/L Fe — kalibrlash diapazonida (0.05-5.0 mg/L).", time: "3 daq", critical: true },
    { step: 5, title: "FAAS da o'lchash", desc: "Havo-C₂H₂ alangasi, λ = 248.3 nm. Diqqat: K₃[Fe(CN)₆] oksidlovchi — ehtiyot bo'ling!", time: "5-8 daq", critical: false },
    { step: 6, title: "Natijalarni hisoblash", desc: "%Fe = (C × V × DF / m) × 100. Nazariy: 16.96%. K₄[Fe(CN)₆] dan 3.74% ga farq qiladi.", time: "1 daq", critical: false }
  ],

  interferences: [
    { type: "Spektral", severity: "Past", description: "Fe 248.3 nm da toza signal. Hech qanday yaqin chiziqlar yo'q.", solution: "Standart Deuteriy fon korreksiyasi" },
    { type: "Kimyoviy (oksidlanish)", severity: "O'rta", description: "K₃[Fe(CN)₆] kuchli oksidlovchi — organik moddalarni oksidlaydi. Eritma tayyorlashda ehtiyot bo'ling.", solution: "Faqat HNO₃ da eritish, organik erituvchilardan saqlanish" },
    { type: "Kimyoviy (Fe²⁺ aralashmasi)", severity: "O'rta", description: "Agar K₄[Fe(CN)₆] aralashmasi bo'lsa, AAS ularni farqlamaydi. %Fe oraliq qiymat chiqadi.", solution: "Mössbauer yoki UV-Vis bilan qo'shimcha tekshirish" },
    { type: "Matritsa", severity: "Past", description: "K₃[Fe(CN)₆] matritsasi alangada to'liq parchalanadi — muammo yo'q.", solution: "Standartlar ham 0.1 M HNO₃ da" },
    { type: "Ionlanish", severity: "Past", description: "Fe ning ionlanish potensiali yuqori (7.87 eV) — alangada kam ionlanadi.", solution: "Ionlanish buferi shart emas" }
  ],

  tgaSteps: [
    { start: 25, end: 200, loss: 0.0, event: "Barqaror zona (gidrat YO'Q)", color: "#10b981", aasEffect: "Fe signal barqaror" },
    { start: 200, end: 300, loss: 8.3, event: "1-CN⁻ yo'qolishi (HCN)", color: "#8b5cf6", aasEffect: "K₃[Fe(CN)₅] hosil bo'ladi" },
    { start: 300, end: 400, loss: 25.2, event: "3-CN⁻ yo'qolishi", color: "#ef4444", aasEffect: "Fe²⁺/Fe³⁺ qoldig'i" },
    { start: 400, end: 600, loss: 23.4, event: "Qolgan CN⁻ va organik", color: "#ef4444", aasEffect: "Fe₂O₃ + K₂O" },
    { start: 600, end: 900, loss: 0.0, event: "Fe₂O₃ + K₂O qoldig'i", color: "#6366f1", aasEffect: "Gravimetriya orqali Fe" }
  ],

  relatedMethods: [
    { name: "Mössbauer spektroskopiya", role: "Fe³⁺ ning δ = -0.03 mm/s va ΔE_Q = 0.60 mm/s", aasAdvantage: "Mössbauer Fe³⁺ ni aniq tasdiqlaydi", aasDisadvantage: "AAS Fe²⁺ va Fe³⁺ ni farqlay OLMAYDI!", complementarity: "97%" },
    { name: "UV-Vis spektroskopiya", role: "LMCT 305 nm (Fe³⁺) va 420 nm (Fe²⁺) — FARQ BOR!", aasAdvantage: "UV-Vis tez va arzon — Fe²⁺/Fe³⁺ nisbatini ko'rsatadi", aasDisadvantage: "AAS buni farqlay olmaydi", complementarity: "95%" },
    { name: "EA (Element Analiz)", role: "C (21.89%), H (0.00%), N (25.53%) — gidrat yo'qligini tasdiqlaydi", aasAdvantage: "EA gidrat yo'qligini, AAS metallni o'lchaydi", aasDisadvantage: "Birgalikda to'liq formula", complementarity: "98%" },
    { name: "ICP-OES", role: "Fe va K bir vaqtda o'lchanadi", aasAdvantage: "ICP-OES ko'p elementli, AAS arzon", aasDisadvantage: "Birgalikda validatsiya", complementarity: "93%" },
    { name: "Elektrokimyo (CV)", role: "Fe³⁺/Fe²⁺ qaytarilish: E₁/₂ = +0.36 V vs SHE", aasAdvantage: "CV oksidlanish holatini ko'rsatadi", aasDisadvantage: "AAS buni bilmaydi", complementarity: "90%" }
  ],

  // K₄[Fe(CN)₆] bilan taqqoslash — bu sahifaning eng muhim qismi
  comparisonWithK4: {
    title: "AAS ning eng muhim cheklovi: Fe²⁺ vs Fe³⁺ ni farqlay olmaydi!",
    description: "AAS alangasida barcha Fe turlari erkin atomlarga aylanadi. Shuning uchun K₃[Fe(CN)₆] va K₄[Fe(CN)₆] AAS da BIR XIL signal beradi (λ = 248.3 nm). Farq faqat %Fe qiymatida — formuladan kelib chiqadi.",
    k3: {
      name: "K₃[Fe(CN)₆] (Qizil qon tuzi)",
      formula: "K₃FeC₆N₆",
      M: 329.24,
      Fe_oxidation: "Fe³⁺ (d⁵ LS)",
      theoryFe: 16.96,
      hydrate: "Gidrat YO'Q",
      color: "qizil",
      magnetic: "Paramagnit (S = 1/2)"
    },
    k4: {
      name: "K₄[Fe(CN)₆]·3H₂O (Sariq qon tuzi)",
      formula: "K₄FeC₆N₆·3H₂O",
      M: 422.39,
      Fe_oxidation: "Fe²⁺ (d⁶ LS)",
      theoryFe: 13.22,
      hydrate: "3 ta H₂O",
      color: "sariq",
      magnetic: "Diamagnit (S = 0)"
    },
    difference: {
      Fe_percent: "3.74% farq (22.5% nisbiy farq)",
      aasSignal: "BIR XIL (λ = 248.3 nm)",
      distinguishing: "Mössbauer, UV-Vis yoki CV kerak"
    }
  }
}

function calculateFePercent(absorbance, sampleMass, dilutionFactor) {
  const slope = 0.1056
  const conc_mgL = absorbance / slope
  const totalVolume = 100
  const Fe_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Fe_percent = (Fe_mass_mg / sampleMass) * 100
  return {
    conc: parseFloat(conc_mgL.toFixed(3)),
    Fe_mass: parseFloat(Fe_mass_mg.toFixed(3)),
    Fe_percent: parseFloat(Fe_percent.toFixed(2))
  }
}

export default function K3FeCN6Page() {
  const [activeRun, setActiveRun] = useState("AAS-24-101")
  const [customAbsorbance, setCustomAbsorbance] = useState(0.450)
  const [customMass, setCustomMass] = useState(20.0)
  const [dilutionFactor, setDilutionFactor] = useState(10)
  const [selectedInterference, setSelectedInterference] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaFe = Math.abs(run.Fe_percent - COMPOUND.theoretical.Fe.percent)
  const statusColor = deltaFe <= 0.3 ? "text-green-400" : deltaFe <= 1.0 ? "text-yellow-400" : "text-red-400"

  const calcResult = useMemo(() => 
    calculateFePercent(customAbsorbance, customMass, dilutionFactor),
    [customAbsorbance, customMass, dilutionFactor]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-red-950/20 to-blue-950 text-white">
      
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
            <span className="text-orange-400 font-semibold">K₃[Fe(CN)₆]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-orange-400 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Fe³⁺ d⁵ LS</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">λ = 248.3 nm</span>
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Gidrat YO'Q</span>
                <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Oksidlovchi</span>
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
        <div className="bg-gradient-to-r from-orange-900/40 to-purple-900/40 border border-orange-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (AAS uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">K₃[Fe(CN)₆]</strong> — temir(III) ning geksatsianoferrat kompleksi, Fe²⁺ shaklidan ham barqaror (log β₆ ≈ 42). AAS tahlilida <strong className="text-orange-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-orange-500 text-xs md:text-sm">
                <li>Nazariy <strong className="text-white">%Fe = 16.96%</strong> — FAAS da aniq o'lchanadi</li>
                <li>Fe³⁺ <strong className="text-white">past spinli (paramagnit, S=1/2)</strong> — Mössbauer bilan farqlanadi</li>
                <li><strong className="text-white">Gidrat YO'Q</strong> — K₄[Fe(CN)₆]·3H₂O dan farqli</li>
                <li><strong className="text-white">Kuchli oksidlovchi</strong> — ehtiyot bo'lish kerak</li>
                <li>AAS <strong className="text-red-300">Fe²⁺ va Fe³⁺ ni farqlay olmaydi!</strong></li>
                <li>Faqat <strong className="text-white">%Fe qiymati</strong> orqali K₄[Fe(CN)₆] dan farqlash mumkin</li>
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

        {/* 1b. Fe²⁺ vs Fe³⁺ — ENG MUHIM QISM */}
        <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span> {COMPOUND.comparisonWithK4.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.comparisonWithK4.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* K₃ */}
            <div className="bg-orange-950/40 rounded-xl p-5 border-2 border-orange-500/50">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-orange-400 font-bold text-sm">{COMPOUND.comparisonWithK4.k3.name}</h3>
                <span className="text-xs bg-orange-600/40 px-2 py-0.5 rounded text-orange-200">🎯 Hozirgi</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Formula:</span>
                  <span className="font-mono text-orange-300">{COMPOUND.comparisonWithK4.k3.formula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">M:</span>
                  <span className="font-mono text-white">{COMPOUND.comparisonWithK4.k3.M} g/mol</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Oksidlanish:</span>
                  <span className="font-bold text-orange-300">{COMPOUND.comparisonWithK4.k3.Fe_oxidation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Nazariy %Fe:</span>
                  <span className="font-mono font-bold text-yellow-400">{COMPOUND.comparisonWithK4.k3.theoryFe}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Gidrat:</span>
                  <span className="text-green-300">{COMPOUND.comparisonWithK4.k3.hydrate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Magnit:</span>
                  <span className="text-pink-300">{COMPOUND.comparisonWithK4.k3.magnetic}</span>
                </div>
              </div>
            </div>

            {/* K₄ */}
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30 opacity-80">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-yellow-400 font-bold text-sm">{COMPOUND.comparisonWithK4.k4.name}</h3>
                <span className="text-xs bg-yellow-600/40 px-2 py-0.5 rounded text-yellow-200">Taqqoslash</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Formula:</span>
                  <span className="font-mono text-yellow-300">{COMPOUND.comparisonWithK4.k4.formula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">M:</span>
                  <span className="font-mono text-white">{COMPOUND.comparisonWithK4.k4.M} g/mol</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Oksidlanish:</span>
                  <span className="font-bold text-yellow-300">{COMPOUND.comparisonWithK4.k4.Fe_oxidation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Nazariy %Fe:</span>
                  <span className="font-mono font-bold text-yellow-400">{COMPOUND.comparisonWithK4.k4.theoryFe}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Gidrat:</span>
                  <span className="text-blue-300">{COMPOUND.comparisonWithK4.k4.hydrate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Magnit:</span>
                  <span className="text-purple-300">{COMPOUND.comparisonWithK4.k4.magnetic}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
            <h4 className="text-red-300 font-bold text-sm mb-3">🔍 Farqlar:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-purple-400 mb-1">%Fe farqi:</div>
                <div className="text-white font-bold">{COMPOUND.comparisonWithK4.difference.Fe_percent}</div>
              </div>
              <div>
                <div className="text-purple-400 mb-1">AAS signali:</div>
                <div className="text-red-300 font-bold">{COMPOUND.comparisonWithK4.difference.aasSignal}</div>
              </div>
              <div>
                <div className="text-purple-400 mb-1">Farqlash usuli:</div>
                <div className="text-green-300">{COMPOUND.comparisonWithK4.difference.distinguishing}</div>
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
            K₃[Fe(CN)₆] uchun <strong className="text-orange-300">FAAS</strong> optimal — K₄[Fe(CN)₆] bilan bir xil sharoitda o'lchanadi. 
            Farq faqat olingan %Fe qiymatida ko'rinadi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Element</div>
              <div className="text-lg font-bold text-orange-400">{COMPOUND.aasParameters.element}</div>
              <div className="text-[10px] text-purple-300 mt-1">{COMPOUND.aasParameters.oxidationState}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">λ (asosiy)</div>
              <div className="text-lg font-mono font-bold text-orange-400">{COMPOUND.aasParameters.lambda.primary} nm</div>
              <div className="text-[10px] text-purple-300 mt-1">Alt: {COMPOUND.aasParameters.lambda.secondary} nm</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Alanga</div>
              <div className="text-lg font-bold text-red-400">Havo-C₂H₂</div>
              <div className="text-[10px] text-purple-300 mt-1">~2300°C</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">LOD</div>
              <div className="text-lg font-mono font-bold text-green-400">{COMPOUND.aasParameters.lod} mg/L</div>
              <div className="text-[10px] text-purple-300 mt-1">LOQ: {COMPOUND.aasParameters.loq}</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-orange-400 font-bold text-xs uppercase mb-3">Batafsil parametrlar:</h3>
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
            <span>📐</span> Nazariy element tarkibi
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            E'tibor bering: <strong className="text-orange-300">H va O mutlaqo yo'q</strong> — bu K₄[Fe(CN)₆]·3H₂O dan asosiy farq. Gidrat suvi yo'q.
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
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => {
                  const isZero = d.mass === 0
                  return (
                    <tr key={el} className={`border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors ${isZero ? 'opacity-50' : ''}`}>
                      <td className="py-3 pl-2 font-bold text-orange-400">{el}</td>
                      <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                      <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                      <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                      <td className="py-3 pl-4 text-[10px] text-purple-400">{d.aasSignal}</td>
                    </tr>
                  )
                })}
                <tr className="bg-orange-900/20 font-bold border-t border-orange-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-orange-300">AAS: Fe (16.96%) + K (35.62%) = 52.58%</td>
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
              className="text-xs bg-orange-600 hover:bg-orange-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            <strong className="text-orange-300">K₄[Fe(CN)₆] bilan bir xil kalibrlash egri chizig'i ishlatiladi!</strong> 
            Fe²⁺ va Fe³⁺ standartlari alangada bir xil signal beradi. Lambert-Ber qonuni: <strong className="text-white">A = 0.1056 × C</strong>.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 500 260" className="w-full h-full overflow-visible">
              {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/0.6)*200} x2="480" y2={220 - (v/0.6)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/0.6)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 1, 2, 3, 4, 5].map(c => (
                <g key={c}>
                  <text x={50 + (c/5)*430} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="265" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Fe konsentratsiyasi (mg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish (A)</text>

              <line x1="50" y1="220" x2="480" y2={220 - (0.528/0.6)*200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/5)*430
                const y = 220 - (p.absorbance/0.6)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#f97316" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#fbbf24">
                        {p.absorbance.toFixed(3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (4.27/5)*430
                const y = 220 - (0.450/0.6)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      K₃[Fe(CN)₆] (4.27 mg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="350" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#f97316" strokeWidth="1" />
              <text x="410" y="48" textAnchor="middle" fontSize="10" fill="#fbbf24" fontWeight="bold">
                R² = 0.9999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded-full"></span> Standart</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> K₃[Fe(CN)₆]</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya</span>
          </div>
        </div>

        {/* 5. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> AAS yugurishlari — eksperimental natijalar
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan AAS o'lchashlari. Diqqat: K₄[Fe(CN)₆] bilan aralashma bo'lsa, %Fe qiymati oraliq bo'ladi (13.22% dan 16.96% gacha).
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
                      ? "bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/20" 
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
                    <span className="font-mono text-orange-400 text-lg">{run.absorbance.toFixed(3)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-orange-900/20 rounded border border-orange-500/20">
                    <span className="text-sm text-orange-400 font-medium">C (mg/L):</span>
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
                    <span className="font-mono text-orange-400">{COMPOUND.theoretical.Fe.percent.toFixed(2)}%</span>
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
                  {!isSample ? "🔍 Nazorat namunasi" : deltaFe <= 0.3 ? "✓ K₃[Fe(CN)₆] tasdiqlandi" : deltaFe <= 1.0 ? "⚠ Chegaraviy" : "✗ Aralashma"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    deltaFe <= 0.3
                      ? "AAS natijasi K₃[Fe(CN)₆] formulaga to'liq mos keladi (%Fe = 16.96%). K₄[Fe(CN)₆] aralashmasi yo'q (u 13.22% beradi)."
                      : deltaFe <= 1.0
                        ? "%Fe qiymati nazariyga yaqin. Ozroq K₄[Fe(CN)₆] aralashmasi yoki qisman qaytarilish bo'lishi mumkin."
                        : run.Fe_percent > 15 && run.Fe_percent < 16.5
                          ? "K₃[Fe(CN)₆] va K₄[Fe(CN)₆] aralashmasi! Mössbauer bilan tasdiqlash kerak."
                          : run.Fe_percent < 14
                            ? "%Fe past — K₄[Fe(CN)₆] ko'p qo'shilgan yoki namuna noto'g'ri."
                            : "Namuna ifloslangan yoki boshqa Fe kompleksi."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Blank — signal nolga yaqin. Tizim toza."
                      : "NIST standarti — kalibrlash to'g'ri bajarilgan."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-orange-400 mb-4 flex justify-between">
                <span>%Fe Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">K₃: 16.96% | K₄: 13.22%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const val = r.Fe_percent
                  const heightPct = Math.min((val / 22) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(2)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <>
                            <div className="absolute w-[120%] border-t border-dashed border-orange-500/50 z-0" style={{ bottom: `${(16.964/22)*100}%` }}></div>
                            <div className="absolute w-[120%] border-t border-dashed border-yellow-500/30 z-0" style={{ bottom: `${(13.223/22)*100}%` }}></div>
                          </>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : 'text-orange-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded"></span> Namuna</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-orange-500/50"></span> K₃ (16.96%)</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-yellow-500/50"></span> K₄ (13.22%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
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
                        <td className="py-2 px-3 text-orange-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-orange-900/20 rounded-lg border border-orange-700/30 text-xs text-purple-200">
                <strong className="text-orange-300">Regressiya:</strong> A = 0.1056 × C + 0.0003, R² = 0.9999
              </div>
              <div className="mt-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/30 text-xs text-purple-200">
                <strong className="text-yellow-300">⚠ Muhim:</strong> Bu kalibrlash Fe²⁺ va Fe³⁺ uchun bir xil! AAS oksidlanish holatini farqlamaydi.
              </div>
              <button 
                onClick={() => setShowCalibrationModal(false)}
                className="w-full mt-4 bg-orange-600 hover:bg-orange-500 text-white py-2 rounded-lg transition-colors text-sm"
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
            K₃[Fe(CN)₆] <strong className="text-orange-300">kuchli oksidlovchi</strong> — bu uning o'ziga xos interferensiyasi. Har birini bosib, batafsil ma'lumot oling.
          </p>

          <div className="space-y-2">
            {COMPOUND.interferences.map((int, i) => (
              <button
                key={i}
                onClick={() => setSelectedInterference(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedInterference === i
                    ? "bg-orange-900/40 border-orange-500"
                    : "bg-purple-950/40 border-purple-700/30 hover:border-orange-500/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-orange-400">{int.type}</span>
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

        {/* 7. TGA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔥</span> TGA bilan AAS bog'liqligi
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            K₃[Fe(CN)₆] <strong className="text-orange-300">gidrat suvi yo'q</strong> — K₄[Fe(CN)₆]·3H₂O dan asosiy farq. Shuning uchun TGA da 100°C gacha hech qanday massa yo'qotmaydi.
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
                d="M 50 20 L 220 20 Q 240 20 250 40 L 270 85 Q 280 95 300 95 L 340 95 Q 355 95 365 115 L 400 170 Q 410 180 430 180 L 470 180 Q 485 180 495 190 L 580 210" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="135" y="15" textAnchor="middle" fill="#10b981">AAS: %Fe = 16.96%</text>
                <text x="135" y="32" textAnchor="middle" fill="#10b981" fontSize="8">(Gidrat YO'Q!)</text>
                
                <text x="180" y="15" textAnchor="middle" fill="#fbbf24">K₄ da: -3H₂O (100°C)</text>
                
                <line x1="270" y1="85" x2="270" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="270" y="235" textAnchor="middle" fill="#8b5cf6">~250°C</text>
                <text x="290" y="75" fill="#8b5cf6">-1 CN⁻</text>

                <line x1="400" y1="170" x2="400" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="400" y="235" textAnchor="middle" fill="#ef4444">~500°C</text>
                <text x="420" y="160" fill="#ef4444">-3 CN⁻</text>

                <text x="540" y="205" textAnchor="middle" fill="#6366f1">Fe₂O₃ + K₂O</text>
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
                <div className="text-[10px] text-orange-300 mt-2 italic">AAS effekti: {step.aasEffect}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-orange-900/40 to-purple-900/40 border border-orange-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> AAS ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            K₃[Fe(CN)₆] uchun AAS ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-orange-300">Fe²⁺/Fe³⁺ ni farqlash</strong> uchun juda muhim.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-orange-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-orange-300">{m.name}</h3>
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

          <div className="mt-5 bg-orange-900/20 border border-orange-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-orange-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">AAS (Fe%) + Mössbauer (Fe³⁺) + UV-Vis (LMCT 305 nm) + EA (C, N) + CV (E₁/₂ = +0.36 V)</strong> — beshta metod birgalikda K₃[Fe(CN)₆] ni K₄[Fe(CN)₆] dan to'liq farqlaydi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> AAS uchun namuna tayyorlash
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            K₃[Fe(CN)₆] <strong className="text-orange-300">kuchli oksidlovchi</strong> — organik erituvchilardan saqlanish kerak! Faqat HNO₃ ishlatiladi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-orange-900/40 border-orange-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-orange-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-orange-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-2xl p-6">
          <h3 className="text-orange-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> AAS dan %Fe hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan yutilish (A), namuna massasi va suyuqlantirish faktori bo'yicha <strong className="text-orange-300">%Fe</strong> ni avtomatik hisoblang. 
            <br/>💡 <strong>Maslahat:</strong> Agar %Fe 14.5-15.5% atrofida bo'lsa, bu K₃ va K₄ aralashmasi!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, 248.3 nm):</label>
              <input 
                type="number" step="0.001" value={customAbsorbance}
                onChange={(e) => setCustomAbsorbance(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-orange-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Konsentratsiya:</div>
                <div className="text-2xl font-mono font-bold text-orange-400">{calcResult.conc} mg/L</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Fe massasi:</div>
                <div className="text-2xl font-mono font-bold text-red-400">{calcResult.Fe_mass} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Fe:</div>
                <div className={`text-2xl font-mono font-bold ${
                  Math.abs(calcResult.Fe_percent - 16.96) <= 0.3 ? 'text-green-400' : 
                  calcResult.Fe_percent > 14 && calcResult.Fe_percent < 16.5 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {calcResult.Fe_percent}%
                </div>
              </div>
            </div>

            {/* Aralashma diagnostikasi */}
            <div className="mt-4 space-y-2">
              {(() => {
                const fe = calcResult.Fe_percent
                let diagnosis = { text: "", color: "" }
                if (Math.abs(fe - 16.96) <= 0.5) {
                  diagnosis = { text: "✓ K₃[Fe(CN)₆] — toza Fe³⁺", color: "text-green-400" }
                } else if (fe > 14.5 && fe < 16.5) {
                  const k3_pct = ((fe - 13.22) / (16.96 - 13.22) * 100).toFixed(0)
                  const k4_pct = (100 - k3_pct).toFixed(0)
                  diagnosis = { text: `⚠ Aralashma: ~${k3_pct}% K₃ + ~${k4_pct}% K₄`, color: "text-yellow-400" }
                } else if (Math.abs(fe - 13.22) <= 0.5) {
                  diagnosis = { text: "✓ K₄[Fe(CN)₆] — toza Fe²⁺ (boshqa birikma!)", color: "text-blue-400" }
                } else {
                  diagnosis = { text: "✗ Noto'g'ri natija — boshqa Fe kompleksi yoki xato", color: "text-red-400" }
                }
                return (
                  <div className={`p-3 rounded-lg border border-purple-700/30 ${diagnosis.color}`}>
                    <div className="text-xs text-purple-400 mb-1">Diagnostika:</div>
                    <div className="text-sm font-bold">{diagnosis.text}</div>
                  </div>
                )
              })()}
            </div>

            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Fe = (A / 0.1056) × 100 × DF / (m × 1000) × 100
            </p>
          </div>
        </div>

        {/* 11. AAS CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> AAS ning eng muhim cheklovi: Oksidlanish holatini farqlay olmaydi!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                AAS <strong className="text-orange-300">K₃[Fe(CN)₆] va K₄[Fe(CN)₆] ni farqlay olmaydi</strong>. 
                Sababi: alangada ikkalasi ham erkin Fe atomlariga aylanadi.
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">AAS:</strong> Ikkala birikma ham bir xil signal beradi (λ = 248.3 nm)</li>
                <li><strong className="text-orange-300">Farq:</strong> Faqat %Fe qiymatida (16.96% vs 13.22%)</li>
                <li><strong className="text-yellow-300">Mössbauer:</strong> Fe³⁺ va Fe²⁺ ni aniq farqlaydi</li>
                <li><strong className="text-pink-300">UV-Vis:</strong> LMCT 305 nm (Fe³⁺) vs 420 nm (Fe²⁺)</li>
                <li><strong className="text-green-300">CV:</strong> E₁/₂ = +0.36 V (Fe³⁺/Fe²⁺ jufti)</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>K₃[Fe(CN)₆] ni to'liq tasdiqlash</strong> uchun AAS + Mössbauer + UV-Vis + EA kombinatsiyasi kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-orange-400 font-bold text-xs uppercase mb-3">Farqlash strategiyasi:</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-purple-800/30 pb-2">
                  <span className="text-purple-300">1. AAS (%Fe):</span>
                  <span className="text-orange-400 font-mono">16.96% (Fe³⁺)</span>
                </div>
                <div className="flex justify-between items-center border-b border-purple-800/30 pb-2">
                  <span className="text-purple-300">2. Mössbauer (δ):</span>
                  <span className="text-orange-400 font-mono">-0.03 mm/s</span>
                </div>
                <div className="flex justify-between items-center border-b border-purple-800/30 pb-2">
                  <span className="text-purple-300">3. UV-Vis (LMCT):</span>
                  <span className="text-orange-400 font-mono">305 nm</span>
                </div>
                <div className="flex justify-between items-center border-b border-purple-800/30 pb-2">
                  <span className="text-purple-300">4. CV (E₁/₂):</span>
                  <span className="text-orange-400 font-mono">+0.36 V</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. EA (H):</span>
                  <span className="text-green-400 font-mono">0.00% (gidrat yo'q)</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 5 ta metod birgalikda K₃[Fe(CN)₆] ni to'liq isbotlaydi
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
              <p className="text-xs text-purple-200">%Fe = 16.96% ni aniq o'lchaydi. Gidrat yo'qligi sababli hisoblash oddiy. K₄[Fe(CN)₆] bilan solishtirganda 3.74% farq — yetarli.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Asosiy cheklov</h3>
              <p className="text-xs text-purple-200"><strong className="text-orange-300">Fe²⁺ va Fe³⁺ ni farqlay OLMAYDI!</strong> K₃ va K₄ bir xil signal beradi. Mössbauer yoki UV-Vis bilan qo'shimcha tekshirish shart.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">Mössbauer (Fe³⁺ δ=-0.03), UV-Vis (LMCT 305 nm), CV (E₁/₂ = +0.36 V), EA (H=0%) — to'liq validatsiya uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/aas" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← AAS metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-sm bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • K₃[Fe(CN)₆] • AAS moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955), Diesbach (1704)</p>
        </div>
      </footer>
    </main>
  )
}