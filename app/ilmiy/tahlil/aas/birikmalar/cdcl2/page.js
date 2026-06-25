"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// CdCl₂ — AAS (Atom-Absorbsion Spektroskopiya) MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)
// Xususiyat: Cd²⁺ FAAS tahlili, 228.8 nm, eng past LOD (Ag bilan birga!)
// O'ziga xoslik: Zaharli og'ir metall, atrof-muhit monitoringi uchun muhim
// Maqsad: Faqat AAS tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Cd: 112.414, Cl: 35.450
}

const COMPOUND = {
  formulaHTML: "CdCl<sub>2</sub>",
  formulaPlain: "CdCl2",
  iupac: "Kadmiy xlorid",
  formulaExpanded: "CdCl₂ (oddiy tuz)",
  commonName: "Cadmium chloride (oq gigroskopik kristallar)",
  molarMass: 183.31,
  casNumber: "10108-64-2",
  color: "oq yoki rangsiz kristallar (gigroskopik)",
  stability: "havoda barqaror, lekin namlik yutadi, suvda yaxshi eriydi",
  
  historicalFact: {
    title: "Itai-itai kasalligi — kadmiyning zaharli merosi",
    text: "CdCl₂ va boshqa kadmiy birikmalari insoniyat tarixidagi eng yomon atrof-muhit falokatlaridan birining sababchisi. 1950-yillarda Yaponiyaning Toyama prefekturasida <strong>Itai-itai ('og'riq-og'riq') kasalligi</strong> avj oldi. Jinzu daryosi bo'yidagi aholi guruch dalalarini sug'orishda ishlatilgan suv kadmiy bilan ifloslangan edi (kamioka konidan). Natijada odamlarning suyaklari yumshadi, buyraklari ishdan chiqdi va minglab odamlar halok bo'ldi. Bu falokat kadmiyning <strong>biologik to'planishi</strong> (bioakkumulyatsiya) va <strong>uzoq muddatli zaharliligi</strong>ni ko'rsatdi. Bugungi kunda Cd tahlili atrof-muhit monitoringining eng muhim qismi — WHO ichimlik suvida Cd chegarasini <strong>3 ppb (μg/L)</strong> deb belgilagan. AAS tahlilida CdCl₂ alohida qiziq: Cd²⁺ FAAS da <strong>eng sezgir elementlardan</strong> biri (LOD 0.001 mg/L — Ag bilan birga rekord!). GFAAS da esa ppb darajasida ham aniq o'lchanadi.",
    year: "1950-1968"
  },

  // Cd ning eng past LOD — Ag bilan birga rekord!
  recordLOD: {
    title: "Cd — FAAS da eng past LOD (Ag va Zn bilan birga rekord!)",
    description: "Cd ning 228.8 nm dagi chizig'i AAS ning eng kuchli signal beruvchi chiziqlaridan biri. Ag bilan birga FAAS da eng past LOD (0.001 mg/L) ga ega.",
    lodComparison: [
      { element: "Cd", lambda: "228.8", lod: "0.001", rank: "1-o'rin (teng rekord)", toxicity: "Juda zaharli" },
      { element: "Ag", lambda: "328.1", lod: "0.001", rank: "1-o'rin (teng rekord)", toxicity: "Past" },
      { element: "Zn", lambda: "213.9", lod: "0.001", rank: "1-o'rin (teng rekord)", toxicity: "O'rta" },
      { element: "Cu", lambda: "324.8", lod: "0.002", rank: "4-o'rin", toxicity: "O'rta" },
      { element: "Pb", lambda: "283.3", lod: "0.010", rank: "5-o'rin", toxicity: "Juda zaharli" },
      { element: "Fe", lambda: "248.3", lod: "0.005", rank: "6-o'rin", toxicity: "Past" },
      { element: "Pt", lambda: "265.9", lod: "0.050", rank: "Juda past", toxicity: "Past" }
    ],
    whySensitive: "Cd ning 228.8 nm chizig'ining o'tish ehtimolligi juda yuqori. Atomlanish energiyasi past (Cd → Cd⁰ oson). Ionlanish potensiali 8.99 eV — alangada deyarli ionlanmaydi.",
    environmentalRelevance: "WHO ichimlik suvida Cd chegarasi 3 ppb (μg/L). FAAS LOD 1 ppb — bu chegarani aniqlash uchun yetarli, lekin GFAAS (0.005 ppb) ancha yaxshi."
  },

  // Atrof-muhit monitoringi
  environmentalMonitoring: {
    title: "Cd — atrof-muhit monitoringining muhim elementi",
    description: "Kadmiy atrof-muhitda keng tarqalgan zaharli metall. Uning tahlili turli namunalarda turli darajada muhim.",
    limits: [
      { sample: "Ichimlik suvi", limit: "3 μg/L (WHO)", method: "GFAAS", priority: "Eng yuqori" },
      { sample: "Oqova suv", limit: "0.1-1 mg/L", method: "FAAS", priority: "Yuqori" },
      { sample: "Tuproq", limit: "1-5 mg/kg", method: "FAAS/GFAAS", priority: "Yuqori" },
      { sample: "O'simlik", limit: "0.1-0.5 mg/kg", method: "GFAAS", priority: "O'rta" },
      { sample: "Qon (odam)", limit: "5-10 μg/L", method: "GFAAS", priority: "Tibbiy" },
      { sample: "Siydik (odam)", limit: "2-5 μg/L", method: "GFAAS", priority: "Tibbiy" },
      { sample: "Dengiz suvi", limit: "0.01-0.1 μg/L", method: "GFAAS (oldindan boyitish)", priority: "Juda past" }
    ],
    bioaccumulation: "Cd biologik organizmlarda to'planadi (yarim chiqarilish davri: 10-30 yil). Shuning uchun uzoq muddatli ta'siri xavfli."
  },

  aasParameters: {
    element: "Cd",
    oxidationState: "Cd²⁺ (lekin AAS buni farqlamaydi!)",
    hclLamp: "Cd katod lampasi (Hollow Cathode Lamp)",
    lambda: { primary: 228.8, secondary: 326.1, tertiary: 340.4 },
    slitWidth: 0.5,
    lampCurrent: 4,
    atomization_FAAS: "FAAS (Alanga AAS)",
    atomization_GFAAS: "GFAAS (Grafit pechi)",
    flame: "Havo-C₂H₂ (oxidizing, ~2300°C)",
    burnerHeight: 8,
    backgroundCorrection: "Deuteriy lampasi (D₂)",
    linearRange_FAAS: "0.01 - 2.0 mg/L",
    linearRange_GFAAS: "0.05 - 10 μg/L",
    sensitivity: 0.02,
    lod_FAAS: 0.001,
    lod_GFAAS: 0.005,
    loq_FAAS: 0.003,
    loq_GFAAS: 0.017,
    rsd_typical: "0.5 - 1.5%",
    modifier: "NH₄H₂PO₄ (GFAAS uchun)"
  },

  theoretical: {
    Cd:  { mass: 112.414, percent: 61.328, source: "Markaziy Cd²⁺ atomi", aasSignal: "228.8 nm da eng kuchli signal" },
    Cl:  { mass: 70.900,  percent: 38.672, source: "2×Cl⁻", aasSignal: "FAAS da o'lchanmaydi" }
  },

  calibrationCurve: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (0.1 M HNO₃)" },
    { conc: 0.2, absorbance: 0.101, note: "Standart 1" },
    { conc: 0.5, absorbance: 0.252, note: "Standart 2" },
    { conc: 1.0, absorbance: 0.503, note: "Standart 3" },
    { conc: 1.5, absorbance: 0.755, note: "Standart 4" },
    { conc: 2.0, absorbance: 1.007, note: "Standart 5" },
    { conc: 3.0, absorbance: 1.510, note: "Standart 6 (chiziqli chegarada)" }
  ],

  experimentalRuns: [
    { id: "AAS-24-801", date: "2025-01-10", absorbance: 0.755, conc_mgL: 1.50, sample_mg: 25.0, dilution: 100, Cd_percent: 61.00, rsd: 0.65, note: "Toza CdCl₂ (FAAS)" },
    { id: "AAS-24-802", date: "2025-01-10", absorbance: 0.758, conc_mgL: 1.51, sample_mg: 25.0, dilution: 100, Cd_percent: 61.40, rsd: 0.70, note: "Ikkinchi parallel" },
    { id: "AAS-24-803", date: "2025-01-10", absorbance: 0.752, conc_mgL: 1.50, sample_mg: 25.0, dilution: 100, Cd_percent: 61.00, rsd: 0.60, note: "Uchinchi parallel" },
    { id: "AAS-24-804", date: "2025-01-10", absorbance: 0.756, conc_mgL: 1.50, sample_mg: 25.0, dilution: 100, Cd_percent: 61.00, rsd: 0.68, note: "To'rtinchi parallel" },
    { id: "AAS-24-805", date: "2025-01-10", absorbance: 0.754, conc_mgL: 1.50, sample_mg: 25.0, dilution: 100, Cd_percent: 61.00, rsd: 0.62, note: "Beshinchi parallel" },
    { id: "AAS-24-806", date: "2025-01-11", absorbance: 0.605, conc_mgL: 1.20, sample_mg: 25.0, dilution: 100, Cd_percent: 48.80, rsd: 1.85, note: "⚠ Pb²⁺ interferensiyasi (50 ppm qo'shilgan)" },
    { id: "AAS-24-807", date: "2025-01-11", absorbance: 0.075, conc_mgL: 0.15, sample_mg: 25.0, dilution: 1000, Cd_percent: 61.00, rsd: 2.25, note: "GFAAS (1000× suyuqlantirish, ppb darajasi)" },
    { id: "BLANK-09",   date: "2025-01-10", absorbance: 0.000, conc_mgL: 0.00, sample_mg: 0.0,  dilution: 1,  Cd_percent: 0.00, rsd: 0.00, note: "Blank (0.1 M HNO₃)" },
    { id: "STD-Cd-5",   date: "2025-01-10", absorbance: 2.515, conc_mgL: 5.00, sample_mg: 0.0, dilution: 1, Cd_percent: 0.00, rsd: 0.25, note: "NIST Cd standarti (5 mg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Xavfsizlik choralari", desc: "⚠ Cd²⁺ JUDA ZAHARLI! Nitril qo'lqop, laboratoriya xalati, himoya ko'zoynaklari majburiy. Faqat tortish shkafi ichida ishlash.", time: "doimiy", critical: true },
    { step: 2, title: "Namuna tortish", desc: "Analitik tarozida 25.0 ± 0.1 mg CdCl₂ tortiladi. Oq kristallar — CdCl₂ belgisi. Namlik yutilgan bo'lsa, quritish kerak (110°C, 2 soat).", time: "3 daq", critical: true },
    { step: 3, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 50 mL 0.1 M HNO₃ qo'shiladi. HCl ishlatilmaydi — Cl⁻ matritsasi allaqachon bor.", time: "5 daq", critical: true },
    { step: 4, title: "Hajmni to'ldirish", desc: "0.1 M HNO₃ bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~250 mg/L CdCl₂ ≈ 153 mg/L Cd.", time: "1 daq", critical: false },
    { step: 5, title: "100× suyuqlantirish", desc: "1.0 mL eritmadan 100 mL kolbaga o'tkaziladi. Natija: ~1.53 mg/L Cd — FAAS kalibrlash diapazonida (0.01-2.0 mg/L).", time: "3 daq", critical: true },
    { step: 6, title: "FAAS da o'lchash", desc: "Havo-C₂H₂ alangasi, λ = 228.8 nm, Deuteriy fon korreksiyasi. Cd juda yaxshi atomlanadi — LOD 0.001 mg/L.", time: "5-8 daq", critical: false },
    { step: 7, title: "Chiqindilarni utilizatsiya", desc: "⚠ Cd chiqindilarini alohida idishda yig'ish majburiy. Kanalizatsiyaga tashlamang! Maxsus utilizatsiya korxonasiga topshiring.", time: "5 daq", critical: true }
  ],

  interferences: [
    { type: "Spektral", severity: "Past", description: "Cd 228.8 nm da toza signal. Ni 228.7 nm juda yaqin — yuqori Ni konsentratsiyalarida muammo bo'lishi mumkin.", solution: "Alternativ λ = 326.1 nm (sezgirlik pastroq) yoki matritsa moslashtirish" },
    { type: "Kimyoviy (Pb²⁺)", severity: "O'rta", description: "Yuqori Pb²⁺ (>10 mg/L) Cd atomlanishini sekinlashtiradi.", solution: "Standart qo'shish metodi yoki La³⁺ modifikatori" },
    { type: "Kimyoviy (Cu²⁺)", severity: "O'rta", description: "Yuqori Cu²⁺ (>20 mg/L) Cd signaliga ta'sir qiladi.", solution: "Matritsa moslashtirish yoki oldindan ajratish" },
    { type: "Ionlanish", severity: "Past", description: "Cd ning ionlanish potensiali 8.99 eV — alangada kam ionlanadi.", solution: "Ionlanish buferi shart emas" },
    { type: "Matritsa (Cl⁻)", severity: "Past-O'rta", description: "CdCl₂ ning o'zi Cl⁻ manbai — yuqori Cl⁻ matritsasi fon yutilishini oshirishi mumkin.", solution: "Deuteriy yoki Zeyman fon korreksiyasi" },
    { type: "Xotira effekti", severity: "Past", description: "Cd FAAS da kam qoladi, lekin GFAAS da grafit pechida qolishi mumkin.", solution: "Har bir namunadan keyin tozalash tsikli" }
  ],

  tgaSteps: [
    { start: 25, end: 100, loss: 0.0, event: "Namlik bug'lanishi (agar gigroskopik bo'lsa)", color: "#3b82f6", aasEffect: "Cd signal o'zgarmaydi" },
    { start: 100, end: 500, loss: 0.0, event: "CdCl₂ barqaror (mp = 568°C)", color: "#10b981", aasEffect: "Cd signal barqaror" },
    { start: 500, end: 700, loss: 0.0, event: "Eritish (mp = 568°C)", color: "#f59e0b", aasEffect: "CdCl₂ suyuq holatda" },
    { start: 700, end: 960, loss: 38.7, event: "CdCl₂ bug'lanishi (bp = 960°C)", color: "#ef4444", aasEffect: "Cd bug'lari chiqadi — xavfli!" },
    { start: 960, end: 1000, loss: 0.0, event: "To'liq bug'lanish", color: "#a855f7", aasEffect: "Gravimetriya qiyin (bug'lanadi)" }
  ],

  relatedMethods: [
    { name: "ICP-MS", role: "Cd ppt darajasida, bir vaqtda Pb, Zn, Cu ham", aasAdvantage: "ICP-MS juda sezgir (ppt), ko'p elementli", aasDisadvantage: "FAAS arzon, oddiy, bir element uchun yetarli", complementarity: "98%" },
    { name: "Voltammetriya (ASV)", role: "Anodik stripping voltammetriyasi — Cd²⁺ ppb darajasida", aasAdvantage: "ASV juda sezgir (0.01 ppb), speciation mumkin", aasDisadvantage: "FAAS soddaroq, tezroq", complementarity: "95%" },
    { name: "GFAAS", role: "Grafit pechi AAS — Cd ppb darajasida", aasAdvantage: "GFAAS 200× sezgir FAAS dan", aasDisadvantage: "FAAS tezroq, arzonroq", complementarity: "96%" },
    { name: "UV-Vis spektroskopiya", role: "Cd²⁺ ning UV da yutilishi (past, LMCT)", aasAdvantage: "UV-Vis tez, eritmada", aasDisadvantage: "AAS ancha sezgir", complementarity: "80%" },
    { name: "Rentgen fluoressensiyasi (XRF)", role: "Cd qattiq namunalarda (tuproq, cho'kma)", aasAdvantage: "XRF in-situ, namuna tayyorlash shart emas", aasDisadvantage: "FAAS suyuq namunalarda aniqroq", complementarity: "88%" },
    { name: "Kolorimetrik usul", role: "Cd²⁺ ni organik reagentlar bilan rangli kompleks", aasAdvantage: "Kolorimetriya arzon, oddiy", aasDisadvantage: "AAS aniqroq, sezgirroq", complementarity: "85%" }
  ]
}

function calculateCdPercent(absorbance, sampleMass, dilutionFactor) {
  const slope = 0.5033  // A = 0.5033 × C (mg/L), R² = 0.99999
  const conc_mgL = absorbance / slope
  const totalVolume = 100
  const Cd_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Cd_percent = (Cd_mass_mg / sampleMass) * 100
  return {
    conc: parseFloat(conc_mgL.toFixed(4)),
    Cd_mass: parseFloat(Cd_mass_mg.toFixed(4)),
    Cd_percent: parseFloat(Cd_percent.toFixed(2))
  }
}

export default function CdCl2Page() {
  const [activeRun, setActiveRun] = useState("AAS-24-801")
  const [customAbsorbance, setCustomAbsorbance] = useState(0.755)
  const [customMass, setCustomMass] = useState(25.0)
  const [dilutionFactor, setDilutionFactor] = useState(100)
  const [selectedInterference, setSelectedInterference] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaCd = Math.abs(run.Cd_percent - COMPOUND.theoretical.Cd.percent)
  const statusColor = deltaCd <= 1.0 ? "text-green-400" : deltaCd <= 3.0 ? "text-yellow-400" : "text-red-400"

  const calcResult = useMemo(() => 
    calculateCdPercent(customAbsorbance, customMass, dilutionFactor),
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
            <span className="text-teal-400 font-semibold">CdCl₂</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-teal-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-red-600 px-2 py-1 rounded ml-2 animate-pulse">☠️ ZAHARLI</span>
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
                <span className="px-2 py-1 rounded bg-teal-900/30 border border-teal-700/50 text-teal-400 text-[10px] uppercase tracking-wide">Cd²⁺ d¹⁰</span>
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">λ = 228.8 nm</span>
                <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">⭐ LOD 0.001 mg/L</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide animate-pulse">Atrof-muhit</span>
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
        <div className="bg-gradient-to-r from-teal-900/40 to-purple-900/40 border border-teal-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (AAS uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">CdCl₂</strong> — kadmiy xlorid, zaharli og'ir metall tuzi, atrof-muhit monitoringining muhim obyekti. AAS tahlilida <strong className="text-teal-300">eng sezgir birikmalardan</strong> biri, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-teal-500 text-xs md:text-sm">
                <li>Nazariy <strong className="text-white">%Cd = 61.33%</strong> — yuqori foiz</li>
                <li>Cd²⁺ <strong className="text-green-300">FAAS ning eng sezgir elementi</strong> (LOD 0.001 mg/L — rekord!)</li>
                <li><strong className="text-white">Oddiy tuz</strong> — minimal matritsa effekti</li>
                <li>Cd²⁺ <strong className="text-white">diamagnit</strong> (d¹⁰, rangsiz)</li>
                <li><strong className="text-red-300">Juda zaharli</strong> — ehtiyot choralar majburiy</li>
                <li>Atrof-muhit namunalari uchun <strong className="text-teal-300">ppb darajasida</strong> tahlil</li>
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

        {/* 1b. REKORD LOD */}
        <div className="bg-gradient-to-r from-green-900/40 to-blue-900/40 border-2 border-green-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⭐</span> {COMPOUND.recordLOD.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.recordLOD.description}
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-2 px-3 text-left text-purple-300">Element</th>
                  <th className="py-2 px-3 text-center text-purple-300">λ (nm)</th>
                  <th className="py-2 px-3 text-center text-purple-300">LOD (mg/L)</th>
                  <th className="py-2 px-3 text-left text-purple-300">O'rin</th>
                  <th className="py-2 px-3 text-left text-purple-300">Zaharlilik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.recordLOD.lodComparison.map((l, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${l.element === "Cd" ? 'bg-green-900/20' : ''}`}>
                    <td className={`py-2 px-3 font-bold ${l.element === "Cd" ? "text-green-400" : "text-purple-300"}`}>
                      {l.element} {l.element === "Cd" && "⭐"}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-blue-400">{l.lambda}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-yellow-400">{l.lod}</td>
                    <td className={`py-2 px-3 ${l.rank.includes("1-o'rin") ? "text-green-300" : l.rank.includes("past") ? "text-red-300" : "text-purple-300"}`}>
                      {l.rank}
                    </td>
                    <td className={`py-2 px-3 ${l.toxicity === "Juda zaharli" ? "text-red-300" : l.toxicity === "O'rta" ? "text-yellow-300" : "text-green-300"}`}>
                      {l.toxicity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50">
              <h4 className="text-green-300 font-bold text-sm mb-2">💡 Nima uchun Cd shunchalik sezgir?</h4>
              <p className="text-xs text-purple-200">{COMPOUND.recordLOD.whySensitive}</p>
            </div>
            <div className="bg-teal-900/20 rounded-lg p-4 border border-teal-700/30">
              <h4 className="text-teal-300 font-bold text-sm mb-2">🌍 Atrof-muhit uchun ahamiyati:</h4>
              <p className="text-xs text-purple-200">{COMPOUND.recordLOD.environmentalRelevance}</p>
            </div>
          </div>
        </div>

        {/* 1c. ATROF-MUHIT MONITORINGI */}
        <div className="bg-gradient-to-r from-teal-900/40 to-cyan-900/40 border border-teal-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🌍</span> {COMPOUND.environmentalMonitoring.title}
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            {COMPOUND.environmentalMonitoring.description}
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-2 px-3 text-left text-purple-300">Namuna turi</th>
                  <th className="py-2 px-3 text-center text-purple-300">WHO/EPA chegarasi</th>
                  <th className="py-2 px-3 text-center text-purple-300">AAS usuli</th>
                  <th className="py-2 px-3 text-left text-purple-300">Muhimlik</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.environmentalMonitoring.limits.map((l, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-2 px-3 font-bold text-teal-300">{l.sample}</td>
                    <td className="py-2 px-3 text-center font-mono text-yellow-400">{l.limit}</td>
                    <td className="py-2 px-3 text-center font-mono text-blue-300">{l.method}</td>
                    <td className={`py-2 px-3 ${
                      l.priority === "Eng yuqori" ? "text-red-300 font-bold" :
                      l.priority === "Yuqori" ? "text-orange-300" :
                      l.priority === "O'rta" ? "text-yellow-300" :
                      l.priority === "Tibbiy" ? "text-pink-300" :
                      "text-purple-300"
                    }`}>
                      {l.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
            <h4 className="text-red-300 font-bold text-sm mb-2">⚠ Bioakkumulyatsiya:</h4>
            <p className="text-xs text-purple-200">{COMPOUND.environmentalMonitoring.bioaccumulation}</p>
          </div>
        </div>

        {/* 2. AAS PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> AAS tahlil parametrlari (Cd uchun optimal)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Cd²⁺ uchun <strong className="text-teal-300">FAAS</strong> ppm darajasida, <strong className="text-green-300">GFAAS</strong> esa ppb darajasida ishlatiladi. λ = 228.8 nm — Cd ning eng kuchli chizig'i.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Element</div>
              <div className="text-lg font-bold text-teal-400">{COMPOUND.aasParameters.element}</div>
              <div className="text-[10px] text-purple-300 mt-1">{COMPOUND.aasParameters.oxidationState}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">λ (asosiy)</div>
              <div className="text-lg font-mono font-bold text-teal-400">{COMPOUND.aasParameters.lambda.primary} nm</div>
              <div className="text-[10px] text-purple-300 mt-1">Alt: {COMPOUND.aasParameters.lambda.secondary} nm</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Alanga</div>
              <div className="text-lg font-bold text-orange-400">Havo-C₂H₂</div>
              <div className="text-[10px] text-purple-300 mt-1">~2300°C</div>
            </div>
            <div className="bg-green-950/60 p-3 rounded-xl border-2 border-green-500/50">
              <div className="text-[10px] text-green-400 uppercase mb-1">⭐ LOD (FAAS)</div>
              <div className="text-lg font-mono font-bold text-green-400">{COMPOUND.aasParameters.lod_FAAS} mg/L</div>
              <div className="text-[10px] text-purple-300 mt-1">Eng past LOD!</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-teal-400 font-bold text-xs uppercase mb-2">FAAS parametrlari:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.linearRange_FAAS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.aasParameters.lod_FAAS} mg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">LOQ:</span>
                  <span className="font-mono text-yellow-400">{COMPOUND.aasParameters.loq_FAAS} mg/L</span>
                </div>
              </div>
            </div>
            <div className="bg-green-950/40 rounded-xl p-4 border-2 border-green-500/30">
              <h4 className="text-green-400 font-bold text-xs uppercase mb-2">GFAAS parametrlari (ppb uchun):</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.linearRange_GFAAS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-green-400">{COMPOUND.aasParameters.lod_GFAAS} μg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Modifikator:</span>
                  <span className="font-mono text-orange-300">{COMPOUND.aasParameters.modifier}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-teal-400 font-bold text-xs uppercase mb-3">Umumiy parametrlar:</h3>
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
                <div className="text-purple-400">Tipik RSD:</div>
                <div className="font-mono text-green-300">{COMPOUND.aasParameters.rsd_typical}</div>
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
            CdCl₂ — <strong className="text-teal-300">oddiy tuz</strong>. AAS <strong className="text-teal-300">faqat Cd</strong> ni o'lchaydi. Cl FAAS da ko'rinmaydi.
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
                    <td className="py-3 pl-2 font-bold text-teal-400">{el}</td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-400">{d.aasSignal}</td>
                  </tr>
                ))}
                <tr className="bg-teal-900/20 font-bold border-t border-teal-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-teal-300">AAS: Cd (61.33%) — juda kuchli signal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. KALIBRLASH EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> Kalibrlash egri chizig'i (Cd, 228.8 nm)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-teal-600 hover:bg-teal-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Cd standartlari (0.1 M HNO₃ da) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-teal-300">R² = 0.99999</strong> — deyarli mukammal chiziqli bog'liqlik. <strong className="text-white">A = 0.5033 × C</strong>.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 500 260" className="w-full h-full overflow-visible">
              {[0, 0.3, 0.6, 0.9, 1.2, 1.5].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/1.6)*200} x2="480" y2={220 - (v/1.6)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/1.6)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 0.5, 1, 1.5, 2, 2.5, 3].map(c => (
                <g key={c}>
                  <text x={50 + (c/3)*430} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c.toFixed(1)}</text>
                </g>
              ))}
              <text x="265" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Cd konsentratsiyasi (mg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish (A)</text>

              <line x1="50" y1="220" x2="480" y2={220 - (1.510/1.6)*200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/3)*430
                const y = 220 - (p.absorbance/1.6)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#14b8a6" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#5eead4">
                        {p.absorbance.toFixed(3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (1.50/3)*430
                const y = 220 - (0.755/1.6)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (1.50 mg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="350" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#14b8a6" strokeWidth="1" />
              <text x="410" y="48" textAnchor="middle" fontSize="10" fill="#5eead4" fontWeight="bold">
                R² = 0.99999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-500 rounded-full"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya (A = 0.5033·C)</span>
          </div>
        </div>

        {/* 5. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> AAS yugurishlari — FAAS va GFAAS
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan AAS o'lchashlari. AAS-24-807 — <strong className="text-green-300">GFAAS</strong> (ppb darajasi), qolganlari FAAS.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isPb = r.id === "AAS-24-806"
              const isGFAAS = r.id === "AAS-24-807"
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun === r.id 
                      ? "bg-teal-600 border-teal-500 text-white shadow-lg shadow-teal-500/20" 
                      : isBlank 
                        ? "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-gray-500"
                        : isStd
                          ? "bg-amber-900/30 border-amber-700/30 text-amber-300 hover:border-amber-500"
                          : isPb
                            ? "bg-purple-900/30 border-purple-700/30 text-purple-300 hover:border-purple-500"
                            : isGFAAS
                              ? "bg-green-900/30 border-green-700/30 text-green-300 hover:border-green-500"
                              : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                  }`}
                >
                  {r.id}
                  {isPb && " ⚠ Pb"}
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
                    <span className="font-mono text-teal-400 text-lg">{run.absorbance.toFixed(3)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-teal-900/20 rounded border border-teal-500/20">
                    <span className="text-sm text-teal-400 font-medium">C (mg/L):</span>
                    <span className="font-mono text-white text-lg">{run.conc_mgL.toFixed(3)}</span>
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
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Cd:</span>
                    <span className="font-mono text-white text-lg">{run.Cd_percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Cd:</span>
                    <span className="font-mono text-teal-400">{COMPOUND.theoretical.Cd.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaCd.toFixed(2)}%</span>
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
                  : deltaCd <= 1.0
                    ? "bg-green-900/30 border-green-700/30"
                    : deltaCd <= 3.0
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : deltaCd <= 1.0 ? "text-green-400" : deltaCd <= 3.0 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : deltaCd <= 1.0 ? "✓ CdCl₂ tasdiqlandi" : deltaCd <= 3.0 ? "⚠ Interferensiya" : "✗ Mos emas"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    deltaCd <= 1.0
                      ? "AAS natijasi CdCl₂ formulaga to'liq mos keladi (%Cd = 61.33%). Cd²⁺ FAAS da juda yaxshi atomlanadi, RSD past."
                      : deltaCd <= 3.0
                        ? "%Cd qiymati chegarada — Pb²⁺ interferensiyasi yoki boshqa matritsa effekti bo'lishi mumkin."
                        : "%Cd juda past — namuna ifloslangan yoki noto'g'ri tayyorlangan."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Blank — signal nolga yaqin. Tizim toza."
                      : "NIST standarti — kalibrlash to'g'ri bajarilgan."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-teal-400 mb-4 flex justify-between">
                <span>%Cd Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Nazariy: 61.33%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isPb = r.id === "AAS-24-806"
                  const isGFAAS = r.id === "AAS-24-807"
                  const val = r.Cd_percent
                  const heightPct = Math.min((val / 70) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-teal-400/50 z-0" style={{ bottom: `${(61.328/70)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : isPb ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                : isGFAAS ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                                : 'bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : isPb ? 'bg-purple-700/40'
                              : isGFAAS ? 'bg-green-700/40'
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : isPb ? 'text-purple-400' : isGFAAS ? 'text-green-400' : 'text-teal-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-500 rounded"></span> FAAS</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> GFAAS</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded"></span> Interferensiya</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-teal-400/50"></span> Nazariy (61.33%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-teal-400 mb-3 flex items-center gap-2">
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
                        <td className="py-2 px-3 text-teal-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-teal-900/20 rounded-lg border border-teal-700/30 text-xs text-purple-200">
                <strong className="text-teal-300">Regressiya:</strong> A = 0.5033 × C + 0.0001, R² = 0.99999
              </div>
              <div className="mt-3 p-3 bg-green-900/20 rounded-lg border border-green-700/30 text-xs text-purple-200">
                <strong className="text-green-300">⭐ Eslatma:</strong> Cd — FAAS ning eng sezgir elementlaridan biri (LOD = 0.001 mg/L). Slope juda yuqori.
              </div>
              <button 
                onClick={() => setShowCalibrationModal(false)}
                className="w-full mt-4 bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg transition-colors text-sm"
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
            Cd²⁺ uchun interferensiyalar <strong className="text-teal-300">nisbatan past</strong>, lekin ba'zi elementlar (Pb²⁺, Cu²⁺, Ni²⁺) ta'sir qilishi mumkin. Har birini bosib, batafsil ma'lumot oling.
          </p>

          <div className="space-y-2">
            {COMPOUND.interferences.map((int, i) => (
              <button
                key={i}
                onClick={() => setSelectedInterference(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedInterference === i
                    ? "bg-teal-900/40 border-teal-500"
                    : "bg-purple-950/40 border-purple-700/30 hover:border-teal-500/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-teal-400">{int.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    int.severity === "Past" ? "bg-green-900/30 text-green-400 border-green-600/30" :
                    int.severity === "Past-O'rta" ? "bg-yellow-900/30 text-yellow-400 border-yellow-600/30" :
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
            CdCl₂ <strong className="text-teal-300">568°C da eriydi, 960°C da bug'lanadi</strong>. Bu gravimetriya uchun qiyin — Cd bug'lanib ketadi! Shuning uchun AAS afzalroq.
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
                d="M 50 20 L 350 20 Q 370 20 380 35 L 390 35 Q 400 35 410 50 L 450 130 Q 460 145 480 145 L 580 145" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="200" y="15" textAnchor="middle" fill="#10b981">AAS: %Cd = 61.33%</text>
                
                <line x1="390" y1="35" x2="390" y2="220" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="390" y="235" textAnchor="middle" fill="#f59e0b">568°C</text>
                <text x="410" y="25" fill="#f59e0b">Eritish</text>

                <line x1="450" y1="130" x2="450" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="450" y="235" textAnchor="middle" fill="#ef4444">960°C</text>
                <text x="470" y="120" fill="#ef4444">Bug'lanish (38.7%)</text>

                <text x="540" y="140" textAnchor="middle" fill="#6366f1">To'liq bug'lanish</text>
              </g>

              <line x1="50" y1="220" x2="580" y2="220" stroke="#a78bfa" strokeWidth="1" />
              <line x1="50" y1="20" x2="50" y2="220" stroke="#a78bfa" strokeWidth="1" />
            </svg>
          </div>

          <div className="mt-4 p-4 bg-red-900/20 rounded-lg border border-red-700/30">
            <h4 className="text-red-300 font-bold text-sm mb-2">⚠ Muhim eslatma:</h4>
            <p className="text-xs text-purple-200">
              CdCl₂ yuqori haroratda bug'lanadi — bu <strong>gravimetriya uchun qiyin</strong>. Shuning uchun Cd tahlili uchun AAS (yoki ICP) afzalroq usul hisoblanadi. Cd bug'lari zaharli — TGA da maxsus ventilyatsiya talab qilinadi!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {COMPOUND.tgaSteps.slice(1, 4).map((step, idx) => (
              <div key={idx} className="bg-purple-950/40 p-4 rounded-lg border-l-4" style={{ borderColor: step.color }}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-white">{step.event}</span>
                  <span className="text-[10px] font-mono text-purple-400">{step.start}-{step.end}°C</span>
                </div>
                <div className="text-sm font-mono text-purple-200">Mass yo'qotish: <span className="text-white font-bold">{step.loss}%</span></div>
                <div className="text-[10px] text-teal-300 mt-2 italic">AAS effekti: {step.aasEffect}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-teal-900/40 to-purple-900/40 border border-teal-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> AAS ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            CdCl₂ uchun AAS ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-teal-300">atrof-muhit monitoringi</strong> uchun muhim. <strong className="text-green-300">ICP-MS</strong> va <strong className="text-cyan-300">ASV (voltammetriya)</strong> eng kuchli qo'shimcha metodlar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-teal-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-teal-300">{m.name}</h3>
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

          <div className="mt-5 bg-teal-900/20 border border-teal-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-teal-300 mb-2">💡 Atrof-muhit monitoringi uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">FAAS (ppm) + GFAAS (ppb) + ICP-MS (ppt) + ASV (speciation) + XRF (qattiq namuna)</strong> — besh xil metod birgalikda Cd ning barcha konsentratsiya diapazonlarini va namuna turlarini qamrab oladi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> AAS uchun namuna tayyorlash (Cd²⁺ — ZAHARLI!)
          </h2>
          <p className="text-xs text-red-300 mb-5 font-bold">
            ⚠ Cd²⁺ juda zaharli! Barcha ishlar tortish shkafi ichida, himoya kiyimida bajarilishi shart. Chiqindilar maxsus utilizatsiya qilinadi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-teal-900/40 border-teal-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-teal-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-teal-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-teal-900/20 border border-teal-500/30 rounded-2xl p-6">
          <h3 className="text-teal-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> AAS dan %Cd hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan yutilish (A), namuna massasi va suyuqlantirish faktori bo'yicha <strong className="text-teal-300">%Cd</strong> ni avtomatik hisoblang.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, 228.8 nm):</label>
              <input 
                type="number" step="0.001" value={customAbsorbance}
                onChange={(e) => setCustomAbsorbance(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-teal-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-teal-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-teal-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Konsentratsiya:</div>
                <div className="text-2xl font-mono font-bold text-teal-400">{calcResult.conc} mg/L</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Cd massasi:</div>
                <div className="text-2xl font-mono font-bold text-orange-400">{calcResult.Cd_mass} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Cd:</div>
                <div className={`text-2xl font-mono font-bold ${Math.abs(calcResult.Cd_percent - 61.33) <= 1.0 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Cd_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Cd = (A / 0.5033) × 100 × DF / (m × 1000) × 100
            </p>
          </div>
        </div>

        {/* 11. AAS CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> AAS ning CdCl₂ uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                AAS CdCl₂ ni tahlil qilishda juda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Cd²⁺ va Cd⁰ ni farqlay olmaydi</strong></li>
                <li><strong className="text-red-300">Faqat Cd ni o'lchaydi</strong> — Cl uchun boshqa metodlar</li>
                <li><strong className="text-red-300">Pb²⁺, Cu²⁺, Ni²⁺ interferensiyalari</strong> — matritsa effekti</li>
                <li><strong className="text-red-300">FAAS ppm darajasida</strong> — ppb uchun GFAAS yoki ICP-MS</li>
                <li><strong className="text-red-300">Bir vaqtda bitta element</strong> — ICP ko'p elementli</li>
                <li><strong className="text-red-300">Speciation qila olmaydi</strong> — ASV yoki HPLC-ICP kerak</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>CdCl₂ ni to'liq tasdiqlash</strong> uchun kamida 4-5 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-teal-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. FAAS (Cd%, ppm)</span>
                  <span className="text-teal-400 font-mono">61.33%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. GFAAS (Cd, ppb)</span>
                  <span className="text-teal-400 font-mono">0.005 μg/L LOD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. ICP-MS (Cd, ppt)</span>
                  <span className="text-teal-400 font-mono">Pb, Zn, Cu ham</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. ASV (speciation)</span>
                  <span className="text-teal-400 font-mono">Cd²⁺ vs Cd⁰</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. Ion xromatografiya (Cl⁻)</span>
                  <span className="text-teal-400 font-mono">38.67%</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 5 ta metod birgalikda CdCl₂ ni to'liq tavsiflaydi
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
              <p className="text-xs text-purple-200">Cd ni 61.33% aniqlikda o'lchaydi. <strong className="text-teal-300">Eng yuqori sezgirlik!</strong> LOD 0.001 mg/L — rekord (Ag bilan birga). Atrof-muhit monitoringi uchun ideal.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-teal-300">Cd²⁺ juda zaharli!</strong> Ehtiyot choralar majburiy. FAAS ppm darajasida — ppb uchun GFAAS. Pb²⁺, Cu²⁺ interferensiyalari.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">GFAAS (ppb), ICP-MS (ppt), ASV (speciation), XRF (qattiq), Ion xromatografiya (Cl⁻) — atrof-muhit monitoringi uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/aas" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← AAS metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-sm bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • CdCl₂ • AAS moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955), WHO Guidelines, Itai-itai (1950-68)</p>
        </div>
      </footer>
    </main>
  )
}