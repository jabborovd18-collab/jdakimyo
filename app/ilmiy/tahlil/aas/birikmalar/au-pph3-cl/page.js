"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Au(PPh₃)Cl] — AAS (Atom-Absorbsion Spektroskopiya) MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)
// Xususiyat: Au⁺ GFAAS tahlili, 242.8 nm, organometallik kompleks
// O'ziga xoslik: Qimmat metall, katalizator, GFAAS talab
// Maqsad: Faqat AAS tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Au: 196.967, P: 30.974, C: 12.011, H: 1.008, Cl: 35.450
}

const COMPOUND = {
  formulaHTML: "[Au(PPh<sub>3</sub>)Cl]",
  formulaPlain: "[Au(PPh3)Cl]",
  iupac: "Xloro(trifenilfosfin)oltin(I)",
  formulaExpanded: "AuPC₁₈H₁₅Cl",
  commonName: "Gold(I) triphenylphosphine chloride",
  molarMass: 494.71,
  casNumber: "14243-64-2",
  color: "oq yoki och sariq kristallar",
  stability: "havoda barqaror, yorug'likda sekin parchalanadi, organik erituvchilarda eriydi",
  
  historicalFact: {
    title: "Oltin fosfin komplekslari — zamonaviy katalizning asosi",
    text: "[Au(PPh₃)Cl] — oltin(I) ning eng muhim organometallik komplekslaridan biri. 1970-yillarda oltin fosfin komplekslari birinchi marta sintez qilingan va ularning <strong>katalitik xususiyatlari</strong> kashf etilgan. Bu komplekslar C-C bog' hosil qilish reaksiyalarida, ayniqsa <strong>Sonogashira, Suzuki va Heck reaksiyalarida</strong> samarali katalizator sifatida ishlatiladi. 2010-yilda A. Stephen K. Hashmi va boshqalar oltin(I) komplekslarining <strong>alkin aktivatsiyasi</strong>dagi rolini ko'rsatdilar — bu organokataliz sohasida inqilob edi. Bugungi kunda [Au(PPh₃)Cl] va uning hosilalari farmatsevtika, materialshunoslik va nozik organik sintezda keng qo'llaniladi. AAS tahlilida bu birikma alohida qiziq: Au — <strong>qimmat metall</strong> ($60,000/kg), shuning uchun uning aniq miqdorini bilish iqtisodiy jihatdan muhim. GFAAS talab qilinadi (LOD 0.8 μg/L), chunki FAAS da sezgirlik yetarli emas.",
    year: "1970-2010"
  },

  // Au ning qimmatligi
  goldValue: {
    title: "Au — qimmat metall, aniq tahlil iqtisodiy muhim!",
    description: "Oltin dunyodagi eng qimmat metallardan biri. [Au(PPh₃)Cl] da Au ning aniq miqdorini bilish iqtisodiy jihatdan muhim.",
    currentPrice: "$60,000/kg (2026-yil)",
    pricePerGram: "$60/g",
    compoundValue: "$29.7/g (494.71 g/mol da 39.81% Au)",
    importance: [
      "Katalizator narxi yuqori — aniq miqdor kerak",
      "Reaksiya samaradorligi Au miqdoriga bog'liq",
      "Qayta ishlash (recycling) uchun aniq tahlil zarur",
      "Sifat nazorati — har bir partiyada bir xil miqdor"
    ]
  },

  // Organometallik kompleks sifatida
  organometallicNature: {
    title: "[Au(PPh₃)Cl] — organometallik kompleks",
    description: "Bu kompleks oltin(I) markaziy atomi, trifenilfosfin (PPh₃) organik ligandi va xlorid (Cl⁻) anionidan iborat.",
    structure: {
      geometry: "Chiziqli (2-koordinatsion)",
      au_ligand: "Au-P (2.23 Å), Au-Cl (2.28 Å)",
      phosphine: "PPh₃ — kuchli σ-donor, π-akseptor",
      oxidation: "Au⁺ (d¹⁰, diamagnit)"
    },
    applications: [
      { field: "Kataliz", use: "Alkin aktivatsiyasi, C-C bog' hosil qilish" },
      { field: "Materialshunoslik", use: "Oltin nanopartikullar sintezi" },
      { field: "Farmatsevtika", use: "Oltin birikmalari (revmatoid artrit)" },
      { field: "Organik sintez", use: "Nozik reaksiyalar, selektiv kataliz" }
    ]
  },

  aasParameters: {
    element: "Au",
    oxidationState: "Au⁺ (lekin AAS buni farqlamaydi!)",
    hclLamp: "Au katod lampasi (Hollow Cathode Lamp)",
    lambda: { primary: 242.8, secondary: 267.6, tertiary: 312.3 },
    slitWidth: 0.5,
    lampCurrent: 10,
    atomization_GFAAS: "GFAAS (Grafit pechi)",
    atomization_FAAS: "FAAS (Alanga AAS)",
    flame: "Havo-C₂H₂ (oxidizing, ~2300°C)",
    burnerHeight: 10,
    backgroundCorrection: "Zeyman (Zeeman)",
    linearRange_GFAAS: "0.8 - 80 μg/L",
    linearRange_FAAS: "0.05 - 5.0 mg/L",
    lod_GFAAS: 0.8,
    lod_FAAS: 0.05,
    loq_GFAAS: 2.6,
    loq_FAAS: 0.17,
    rsd_typical: "2 - 4%",
    modifier: "Pd/Mg(NO₃)₂ (GFAAS uchun)"
  },

  theoretical: {
    Au:  { mass: 196.967, percent: 39.813, source: "Markaziy Au⁺ atomi", aasSignal: "242.8 nm da asosiy signal (GFAAS)" },
    P:   { mass: 30.974,  percent: 6.261,  source: "PPh₃ (1×P)", aasSignal: "FAAS da o'lchanmaydi" },
    C:   { mass: 216.198, percent: 43.702, source: "PPh₃ (18×C)", aasSignal: "FAAS da o'lchanmaydi" },
    H:   { mass: 15.120,  percent: 3.056,  source: "PPh₃ (15×H)", aasSignal: "FAAS da o'lchanmaydi" },
    Cl:  { mass: 35.450,  percent: 7.166,  source: "Cl⁻ (1×Cl)", aasSignal: "FAAS da o'lchanmaydi" }
  },

  calibrationCurve: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (0.1 M HCl + modifikator)" },
    { conc: 10.0, absorbance: 0.075, note: "Standart 1" },
    { conc: 20.0, absorbance: 0.150, note: "Standart 2" },
    { conc: 40.0, absorbance: 0.301, note: "Standart 3" },
    { conc: 60.0, absorbance: 0.451, note: "Standart 4" },
    { conc: 80.0, absorbance: 0.602, note: "Standart 5" }
  ],

  experimentalRuns: [
    { id: "AAS-24-1001", date: "2025-03-10", absorbance: 0.300, conc_ugL: 39.95, sample_mg: 10.0, dilution: 1000, Au_percent: 39.95, rsd: 2.85, note: "Toza [Au(PPh₃)Cl] (GFAAS)" },
    { id: "AAS-24-1002", date: "2025-03-10", absorbance: 0.303, conc_ugL: 40.35, sample_mg: 10.0, dilution: 1000, Au_percent: 40.35, rsd: 2.90, note: "Ikkinchi parallel" },
    { id: "AAS-24-1003", date: "2025-03-10", absorbance: 0.298, conc_ugL: 39.68, sample_mg: 10.0, dilution: 1000, Au_percent: 39.68, rsd: 2.75, note: "Uchinchi parallel" },
    { id: "AAS-24-1004", date: "2025-03-10", absorbance: 0.302, conc_ugL: 40.22, sample_mg: 10.0, dilution: 1000, Au_percent: 40.22, rsd: 2.88, note: "To'rtinchi parallel" },
    { id: "AAS-24-1005", date: "2025-03-10", absorbance: 0.299, conc_ugL: 39.82, sample_mg: 10.0, dilution: 1000, Au_percent: 39.82, rsd: 2.80, note: "Beshinchi parallel" },
    { id: "AAS-24-1006", date: "2025-03-11", absorbance: 0.060, conc_ugL: 7.99, sample_mg: 10.0, dilution: 100, Au_percent: 7.99, rsd: 4.85, note: "⚠ FAAS ishlatilgan — signal 5× past!" },
    { id: "AAS-24-1007", date: "2025-03-11", absorbance: 0.285, conc_ugL: 37.95, sample_mg: 10.0, dilution: 1000, Au_percent: 37.95, rsd: 3.25, note: "⚠ Yorug'likda parchalangan (qisman)" },
    { id: "BLANK-11",   date: "2025-03-10", absorbance: 0.001, conc_ugL: 0.13, sample_mg: 0.0,  dilution: 1,  Au_percent: 0.00, rsd: 0.00, note: "Blank (modifikator bilan)" },
    { id: "STD-Au-50",  date: "2025-03-10", absorbance: 0.376, conc_ugL: 50.07, sample_mg: 0.0, dilution: 1, Au_percent: 0.00, rsd: 0.95, note: "NIST Au standarti (50 μg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Xavfsizlik choralari", desc: "⚠ Au birikmalari zaharli va qimmat! Nitril qo'lqop, laboratoriya xalati majburiy. Organik erituvchilar (DCM, THF) ishlatiladi — tortish shkafi ichida.", time: "doimiy", critical: true },
    { step: 2, title: "Namuna tortish", desc: "Analitik tarozida 10.0 ± 0.1 mg [Au(PPh₃)Cl] tortiladi. Oq-och sariq kristallar — Au⁺ belgisi. Qora rang — parchalanish!", time: "2 daq", critical: true },
    { step: 3, title: "Eritish (organik erituvchi)", desc: "10 mL DCM (dichloromethane) yoki THF da eritiladi. Au komplekslari organik erituvchilarda yaxshi eriydi.", time: "5 daq", critical: true },
    { step: 4, title: "Kislota qo'shish", desc: "1 mL kontsentrlangan HCl qo'shiladi — Au⁺ ni Au³⁺ ga oksidlaydi va eritmani barqarorlashtiradi.", time: "2 daq", critical: true },
    { step: 5, title: "Suv bilan ekstraksiya", desc: "10 mL deionizatsiyalangan suv qo'shiladi, aralashtiriladi. Au³⁺ suv qatlamiga o'tadi.", time: "5 daq", critical: false },
    { step: 6, title: "1000× suyuqlantirish", desc: "Suv qatlami olinib, 100 mL kolbaga o'tkaziladi. 0.1 M HCl bilan to'ldiriladi. Natija: ~40 μg/L Au — GFAAS kalibrlash diapazonida.", time: "3 daq", critical: true },
    { step: 7, title: "Modifikator qo'shish", desc: "10 μL Pd/Mg(NO₃)₂ modifikatori qo'shiladi. Bu Au atomlanishini yaxshilaydi.", time: "1 daq", critical: true },
    { step: 8, title: "GFAAS da o'lchash", desc: "Grafit pechi: quritish (110°C, 30s) → kullash (1000°C, 20s) → atomlanish (2100°C, 3s). λ = 242.8 nm, Zeyman fon korreksiyasi.", time: "~3 daqiqa/namuna", critical: false },
    { step: 9, title: "Organik chiqindilarni utilizatsiya", desc: "⚠ DCM va THF chiqindilarini alohida idishda yig'ish majburiy. Au qoldiqlarini qayta ishlash uchun saqlash.", time: "5 daq", critical: true }
  ],

  interferences: [
    { type: "Kimyoviy (organik matritsa)", severity: "Yuqori", description: "PPh₃ ligandi va organik erituvchilar grafit pechida qoldiq qoldiradi — fon yutilishini oshiradi.", solution: "Kullash haroratini oshirish (1000°C), Pd/Mg(NO₃)₂ modifikatori" },
    { type: "Kimyoviy (Cu²⁺, Ag⁺)", severity: "O'rta", description: "Boshqa metallar Au signaliga ta'sir qiladi, ayniqsa yuqori konsentratsiyalarda.", solution: "Standart qo'shish metodi yoki matritsa moslashtirish" },
    { type: "Spektral", severity: "Past", description: "Au 242.8 nm da nisbatan toza signal. Fe 242.8 nm da juda yaqin, lekin GFAAS da matritsa ajratilgan.", solution: "Zeyman fon korreksiyasi majburiy" },
    { type: "Xotira effekti", severity: "O'rta", description: "Au grafit pechida qolishi mumkin — keyingi namunaga ta'sir qiladi.", solution: "Har bir namunadan keyin tozalash tsikli (2500°C, 5s)" },
    { type: "Ionlanish", severity: "Past", description: "Au ning ionlanish potensiali 9.23 eV — alangada kam ionlanadi.", solution: "Ionlanish buferi shart emas" }
  ],

  tgaSteps: [
    { start: 25, end: 200, loss: 0.0, event: "[Au(PPh₃)Cl] barqaror", color: "#10b981", aasEffect: "Au signal barqaror" },
    { start: 200, end: 350, loss: 43.7, event: "PPh₃ ligandi parchalanishi", color: "#8b5cf6", aasEffect: "Au-P bog'i uziladi" },
    { start: 350, end: 500, loss: 7.2, event: "Cl⁻ yo'qolishi", color: "#ef4444", aasEffect: "Au-Cl bog'i uziladi" },
    { start: 500, end: 700, loss: 0.0, event: "Au metali qoldig'i (39.8%)", color: "#6366f1", aasEffect: "Gravimetriya: 39.8% Au" },
    { start: 700, end: 1064, loss: 0.0, event: "Au erish haroratiga yaqin (mp = 1064°C)", color: "#a855f7", aasEffect: "Barqaror qoldiq" }
  ],

  relatedMethods: [
    { name: "ICP-MS", role: "Au ppt darajasida, bir vaqtda P, Cl ham", aasAdvantage: "ICP-MS juda sezgir (ppt), ko'p elementli", aasDisadvantage: "GFAAS arzon, oddiy, bir element uchun yetarli", complementarity: "98%" },
    { name: "EA (Element Analiz)", role: "C, H foizini aniqlaydi — PPh₃ ligandini tasdiqlaydi", aasAdvantage: "EA organik qismini, AAS metallni o'lchaydi", aasDisadvantage: "Birgalikda to'liq formula validatsiyasi", complementarity: "95%" },
    { name: "NMR spektroskopiya", role: "³¹P NMR — PPh₃ ligandini tasdiqlaydi (δ = 43 ppm)", aasAdvantage: "NMR molekulyar strukturani ko'rsatadi", aasDisadvantage: "AAS miqdoriy, NMR sifat", complementarity: "92%" },
    { name: "UV-Vis spektroskopiya", role: "Au⁺ ning LMCT chiziqlari (240-280 nm)", aasAdvantage: "UV-Vis tez, eritmada", aasDisadvantage: "AAS aniqroq, sezgirroq", complementarity: "88%" },
    { name: "Gravimetriya", role: "Au ni cho'ktirib, tortish (klassik usul)", aasAdvantage: "Gravimetriya juda aniq (±0.1%), birlamchi metod", aasDisadvantage: "GFAAS tezroq, lekin ±3% xato", complementarity: "90%" },
    { name: "XRD (Rentgen difraksiya)", role: "Kristall strukturasi, Au-P, Au-Cl masofalar", aasAdvantage: "XRD strukturani, AAS tarkibni tasdiqlaydi", aasDisadvantage: "Birgalikda to'liq validatsiya", complementarity: "93%" }
  ]
}

function calculateAuPercent(absorbance, sampleMass, dilutionFactor) {
  const slope = 0.00752  // A = 0.00752 × C (μg/L), R² = 0.99999
  const conc_ugL = absorbance / slope
  const conc_mgL = conc_ugL / 1000
  const totalVolume = 100
  const Au_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Au_percent = (Au_mass_mg / sampleMass) * 100
  return {
    conc_ugL: parseFloat(conc_ugL.toFixed(3)),
    conc_mgL: parseFloat(conc_mgL.toFixed(6)),
    Au_mass: parseFloat(Au_mass_mg.toFixed(4)),
    Au_percent: parseFloat(Au_percent.toFixed(2))
  }
}

export default function AuPPh3ClPage() {
  const [activeRun, setActiveRun] = useState("AAS-24-1001")
  const [customAbsorbance, setCustomAbsorbance] = useState(0.300)
  const [customMass, setCustomMass] = useState(10.0)
  const [dilutionFactor, setDilutionFactor] = useState(1000)
  const [selectedInterference, setSelectedInterference] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaAu = Math.abs(run.Au_percent - COMPOUND.theoretical.Au.percent)
  const statusColor = deltaAu <= 1.0 ? "text-green-400" : deltaAu <= 3.0 ? "text-yellow-400" : "text-red-400"

  const calcResult = useMemo(() => 
    calculateAuPercent(customAbsorbance, customMass, dilutionFactor),
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
            <span className="text-yellow-400 font-semibold">[Au(PPh₃)Cl]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-orange-600 px-2 py-1 rounded ml-2">⚫ GFAAS</span>
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
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Au⁺ d¹⁰</span>
                <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">λ = 242.8 nm</span>
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">💰 Qimmat Metall</span>
                <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Katalizator</span>
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
                <strong className="text-white">[Au(PPh₃)Cl]</strong> — oltin(I) ning trifenilfosfin kompleksi, muhim katalizator. AAS tahlilida <strong className="text-yellow-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-yellow-500 text-xs md:text-sm">
                <li>Nazariy <strong className="text-white">%Au = 39.81%</strong> — yuqori foiz</li>
                <li>Au⁺ <strong className="text-orange-300">GFAAS talab qiladi</strong> (FAAS da past sezgirlik)</li>
                <li><strong className="text-yellow-300">Qimmat metall</strong> — aniq tahlil iqtisodiy muhim</li>
                <li>Au⁺ <strong className="text-white">diamagnit</strong> (d¹⁰, chiziqli geometriya)</li>
                <li><strong className="text-white">Organometallik</strong> — PPh₃ organik ligand</li>
                <li>Katalizator sifatida <strong className="text-yellow-300">ppm darajasida</strong> ishlatiladi</li>
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

        {/* 1b. QIMMAT METALL */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-amber-900/40 border-2 border-yellow-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💰</span> {COMPOUND.goldValue.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.goldValue.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-yellow-950/40 p-3 rounded-xl border border-yellow-700/30">
              <div className="text-[10px] text-yellow-400 uppercase mb-1">Au narxi</div>
              <div className="text-lg font-mono text-green-400 font-bold">{COMPOUND.goldValue.currentPrice}</div>
            </div>
            <div className="bg-yellow-950/40 p-3 rounded-xl border border-yellow-700/30">
              <div className="text-[10px] text-yellow-400 uppercase mb-1">Au / gramm</div>
              <div className="text-lg font-mono text-green-400">{COMPOUND.goldValue.pricePerGram}</div>
            </div>
            <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-700/30">
              <div className="text-[10px] text-amber-400 uppercase mb-1">Kompleks narxi</div>
              <div className="text-lg font-mono text-yellow-400">{COMPOUND.goldValue.compoundValue}</div>
            </div>
            <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">%Au</div>
              <div className="text-lg font-mono text-white">39.81%</div>
            </div>
          </div>

          <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-700/50">
            <h4 className="text-yellow-300 font-bold text-sm mb-3">Nima uchun aniq tahlil muhim?</h4>
            <div className="space-y-2">
              {COMPOUND.goldValue.importance.map((imp, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-green-400 font-bold shrink-0">#{i+1}</span>
                  <span className="text-purple-200">{imp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1c. ORGANOMETALLIK KOMPLEKS */}
        <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔗</span> {COMPOUND.organometallicNature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            {COMPOUND.organometallicNature.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-purple-300 font-bold text-sm mb-3">Struktura:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Geometriya:</span>
                  <span className="font-mono text-white">{COMPOUND.organometallicNature.structure.geometry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Au-ligand masofa:</span>
                  <span className="font-mono text-white">{COMPOUND.organometallicNature.structure.au_ligand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Fosfin:</span>
                  <span className="font-mono text-white">{COMPOUND.organometallicNature.structure.phosphine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Oksidlanish:</span>
                  <span className="font-mono text-white">{COMPOUND.organometallicNature.structure.oxidation}</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
              <h4 className="text-purple-300 font-bold text-sm mb-3">Qo'llanilish:</h4>
              <div className="space-y-2">
                {COMPOUND.organometallicNature.applications.map((app, i) => (
                  <div key={i} className="bg-indigo-950/40 rounded-lg p-2 text-xs">
                    <div className="font-bold text-purple-300">{app.field}</div>
                    <div className="text-purple-200 mt-1">{app.use}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. AAS PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> AAS tahlil parametrlari (Au uchun GFAAS)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Au⁺ uchun <strong className="text-yellow-300">GFAAS (Grafit pechi)</strong> talab qilinadi — FAAS da sezgirlik yetarli emas. λ = 242.8 nm — Au ning eng kuchli chizig'i.
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
            <div className="bg-orange-950/60 p-3 rounded-xl border-2 border-orange-500/50">
              <div className="text-[10px] text-orange-400 uppercase mb-1">⚫ Usul</div>
              <div className="text-sm font-bold text-orange-400">{COMPOUND.aasParameters.atomization_GFAAS}</div>
              <div className="text-[10px] text-purple-300 mt-1">~2100°C</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">LOD (GFAAS)</div>
              <div className="text-lg font-mono font-bold text-green-400">{COMPOUND.aasParameters.lod_GFAAS} μg/L</div>
              <div className="text-[10px] text-purple-300 mt-1">LOQ: {COMPOUND.aasParameters.loq_GFAAS}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-orange-950/40 rounded-xl p-4 border-2 border-orange-500/30">
              <h4 className="text-orange-400 font-bold text-xs uppercase mb-2">GFAAS parametrlari:</h4>
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
                  <span className="text-purple-400">LOQ:</span>
                  <span className="font-mono text-yellow-400">{COMPOUND.aasParameters.loq_GFAAS} μg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Modifikator:</span>
                  <span className="font-mono text-orange-300">{COMPOUND.aasParameters.modifier}</span>
                </div>
              </div>
            </div>
            <div className="bg-red-950/40 rounded-xl p-4 border border-red-700/30">
              <h4 className="text-red-400 font-bold text-xs uppercase mb-2">FAAS parametrlari (tavsiya etilmaydi):</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-400">Chiziqli diapazon:</span>
                  <span className="font-mono text-white">{COMPOUND.aasParameters.linearRange_FAAS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">LOD:</span>
                  <span className="font-mono text-red-400">{COMPOUND.aasParameters.lod_FAAS} mg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Xulosa:</span>
                  <span className="font-mono text-red-300">⚠ Past sezgirlik</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold text-xs uppercase mb-3">Umumiy parametrlar:</h3>
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
                <div className="text-purple-400">Fon korreksiyasi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.backgroundCorrection}</div>
              </div>
              <div>
                <div className="text-purple-400">Tipik RSD:</div>
                <div className="font-mono text-yellow-300">{COMPOUND.aasParameters.rsd_typical}</div>
              </div>
              <div>
                <div className="text-purple-400">Atomlanish harorati:</div>
                <div className="font-mono text-white">2100°C</div>
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
            [Au(PPh₃)Cl] — <strong className="text-yellow-300">organometallik kompleks</strong>. AAS <strong className="text-yellow-300">faqat Au</strong> ni o'lchaydi. P, C, H, Cl FAAS/GFAAS da ko'rinmaydi — ularni EA bilan tekshirish kerak.
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
                  <td colSpan={2} className="py-3 text-[10px] text-yellow-300">AAS: Au (39.81%) — GFAAS da kuchli signal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. KALIBRLASH EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> Kalibrlash egri chizig'i (Au, 242.8 nm, GFAAS)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-yellow-600 hover:bg-yellow-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Au standartlari (0.1 M HCl + modifikator) yordamida kalibrlash egri chizig'i qurilgan. <strong className="text-yellow-300">R² = 0.99999</strong> — deyarli mukammal chiziqli bog'liqlik. <strong className="text-white">A = 0.00752 × C (μg/L)</strong>.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 500 260" className="w-full h-full overflow-visible">
              {[0, 0.15, 0.30, 0.45, 0.60].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/0.7)*200} x2="480" y2={220 - (v/0.7)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/0.7)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v.toFixed(2)}</text>
                </g>
              ))}

              {[0, 20, 40, 60, 80].map(c => (
                <g key={c}>
                  <text x={50 + (c/80)*430} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="265" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Au konsentratsiyasi (μg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish (A)</text>

              <line x1="50" y1="220" x2="480" y2={220 - (0.602/0.7)*200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/80)*430
                const y = 220 - (p.absorbance/0.7)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#eab308" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#fde047">
                        {p.absorbance.toFixed(3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (39.95/80)*430
                const y = 220 - (0.300/0.7)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (39.95 μg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="350" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#eab308" strokeWidth="1" />
              <text x="410" y="48" textAnchor="middle" fontSize="10" fill="#fde047" fontWeight="bold">
                R² = 0.99999
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya (A = 0.00752·C)</span>
          </div>
        </div>

        {/* 5. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> AAS yugurishlari — GFAAS va FAAS taqqoslash
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan AAS o'lchashlari. AAS-24-1006 — <strong className="text-red-300">FAAS</strong> (signal past!), qolganlari GFAAS.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isFAAS = r.id === "AAS-24-1006"
              const isDegraded = r.id === "AAS-24-1007"
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
                          : isFAAS
                            ? "bg-red-900/30 border-red-700/30 text-red-300 hover:border-red-500"
                            : isDegraded
                              ? "bg-orange-900/30 border-orange-700/30 text-orange-300 hover:border-orange-500"
                              : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                  }`}
                >
                  {r.id}
                  {isFAAS && " ⚠ FAAS"}
                  {isDegraded && " ⚠ Parchalangan"}
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
                    <span className="text-sm text-yellow-400 font-medium">C (μg/L):</span>
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
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Au:</span>
                    <span className="font-mono text-white text-lg">{run.Au_percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Au:</span>
                    <span className="font-mono text-yellow-400">{COMPOUND.theoretical.Au.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaAu.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">RSD:</span>
                    <span className={`font-mono ${run.rsd <= 3.0 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {run.rsd.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : deltaAu <= 1.0
                    ? "bg-green-900/30 border-green-700/30"
                    : deltaAu <= 3.0
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : deltaAu <= 1.0 ? "text-green-400" : deltaAu <= 3.0 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : deltaAu <= 1.0 ? "✓ [Au(PPh₃)Cl] tasdiqlandi" : deltaAu <= 3.0 ? "⚠ Qisman parchalanish" : "✗ Mos emas"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    deltaAu <= 1.0
                      ? "GFAAS natijasi [Au(PPh₃)Cl] formulaga to'liq mos keladi (%Au = 39.81%). Au⁺ GFAAS da yaxshi atomlanadi, RSD qabul qilinadi."
                      : deltaAu <= 3.0
                        ? "%Au qiymati chegarada — yorug'likda qisman parchalanish yoki organik matritsa effekti bo'lishi mumkin."
                        : run.Au_percent < 35
                          ? "Kuchli parchalanish — Au qismi yo'qotilgan yoki boshqa Au birikmasi."
                          : "%Au yuqori — namuna ifloslangan yoki noto'g'ri tayyorlangan."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Blank — signal nolga yaqin. Tizim toza."
                      : "NIST standarti — kalibrlash to'g'ri bajarilgan."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-yellow-400 mb-4 flex justify-between">
                <span>%Au Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Nazariy: 39.81%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isFAAS = r.id === "AAS-24-1006"
                  const isDegraded = r.id === "AAS-24-1007"
                  const val = r.Au_percent
                  const heightPct = Math.min((val / 45) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-yellow-400/50 z-0" style={{ bottom: `${(39.813/45)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : isFAAS ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                : isDegraded ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                                : 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : isFAAS ? 'bg-red-700/40'
                              : isDegraded ? 'bg-orange-700/40'
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : isFAAS ? 'text-red-400' : isDegraded ? 'text-orange-400' : 'text-yellow-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded"></span> GFAAS</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> FAAS ⚠</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded"></span> Parchalangan</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-yellow-400/50"></span> Nazariy (39.81%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <span>📊</span> Kalibrlash egri chizig'i — to'liq ma'lumotlar (GFAAS)
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
                        <td className="py-2 px-3 text-yellow-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/30 text-xs text-purple-200">
                <strong className="text-yellow-300">Regressiya:</strong> A = 0.00752 × C + 0.0001, R² = 0.99999
              </div>
              <div className="mt-3 p-3 bg-orange-900/20 rounded-lg border border-orange-700/30 text-xs text-purple-200">
                <strong className="text-orange-300">⚫ Eslatma:</strong> Au — GFAAS talab qiladi (FAAS da LOD 0.05 mg/L — yetarli emas). Modifikator majburiy.
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
            <span>⚠️</span> Interferensiyalar (GFAAS uchun muhim!)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Au uchun interferensiyalar <strong className="text-yellow-300">asosan organik matritsa</strong> bilan bog'liq — PPh₃ ligandi grafit pechida qoldiq qoldiradi. Har birini bosib, batafsil ma'lumot oling.
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
            [Au(PPh₃)Cl] <strong className="text-yellow-300">200°C dan keyin parchalanadi</strong> — PPh₃ ligandi va Cl⁻ yo'qoladi, sof Au metali qoladi (39.8%).
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
                d="M 50 20 L 200 20 Q 220 20 230 45 L 280 120 Q 290 135 310 135 L 350 135 Q 365 135 375 150 L 420 190 Q 430 200 450 200 L 580 200" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="125" y="15" textAnchor="middle" fill="#10b981">AAS: %Au = 39.81%</text>
                
                <line x1="280" y1="120" x2="280" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="280" y="235" textAnchor="middle" fill="#8b5cf6">~280°C</text>
                <text x="300" y="110" fill="#8b5cf6">-PPh₃ (43.7%)</text>

                <line x1="420" y1="190" x2="420" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="420" y="235" textAnchor="middle" fill="#ef4444">~430°C</text>
                <text x="440" y="180" fill="#ef4444">-Cl (7.2%)</text>

                <text x="520" y="195" textAnchor="middle" fill="#6366f1">Au metali (39.8%)</text>
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
            [Au(PPh₃)Cl] uchun AAS ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-yellow-300">organometallik kompleks validatsiyasi</strong> uchun muhim. <strong className="text-amber-300">EA</strong> va <strong className="text-purple-300">NMR</strong> eng kuchli qo'shimcha metodlar.
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
            <h4 className="text-sm font-bold text-yellow-300 mb-2">💡 Organometallik kompleks validatsiyasi uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">GFAAS (Au%) + EA (C, H) + ³¹P NMR (PPh₃) + UV-Vis (LMCT) + XRD (struktura) + ICP-MS (ppb)</strong> — oltita metod birgalikda [Au(PPh₃)Cl] ni to'liq tasdiqlaydi va uning katalitik sifatini nazorat qiladi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> AAS uchun namuna tayyorlash (organometallik — maxsus)
          </h2>
          <p className="text-xs text-red-300 mb-5 font-bold">
            ⚠ Au birikmalari qimmat va zaharli! Organik erituvchilar (DCM, THF) ishlatiladi — tortish shkafi ichida ishlash majburiy.
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
            <span>🧮</span> GFAAS dan %Au hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan yutilish (A), namuna massasi va suyuqlantirish faktori bo'yicha <strong className="text-yellow-300">%Au</strong> ni avtomatik hisoblang. Konsentratsiya μg/L da!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, 242.8 nm, GFAAS):</label>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-purple-400">C (μg/L):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{calcResult.conc_ugL}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">C (mg/L):</div>
                <div className="text-xl font-mono font-bold text-orange-400">{calcResult.conc_mgL}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Au massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-amber-400">{calcResult.Au_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Au:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult.Au_percent - 39.81) <= 1.0 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Au_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: C(μg/L) = A / 0.00752; %Au = (C(mg/L) × 100 × DF) / (m × 1000) × 100
            </p>
          </div>
        </div>

        {/* 11. AAS CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> AAS ning [Au(PPh₃)Cl] uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                AAS [Au(PPh₃)Cl] ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">FAAS da past sezgirlik</strong> — GFAAS talab</li>
                <li><strong className="text-red-300">Faqat Au ni o'lchaydi</strong> — P, C, H, Cl uchun boshqa metodlar</li>
                <li><strong className="text-red-300">Organik matritsa effekti</strong> — PPh₃ qoldiq qoldiradi</li>
                <li><strong className="text-red-300">Au⁺ va Au³⁺ ni farqlay olmaydi</strong> — XPS kerak</li>
                <li><strong className="text-red-300">Sekin (GFAAS: ~3 daqiqa/namuna)</strong></li>
                <li><strong className="text-red-300">Organik erituvchilar talab</strong> — DCM, THF</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>[Au(PPh₃)Cl] ni to'liq tasdiqlash</strong> uchun kamida 5-6 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-yellow-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. GFAAS (Au%)</span>
                  <span className="text-yellow-400 font-mono">39.81%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (C, H)</span>
                  <span className="text-yellow-400 font-mono">43.70%, 3.06%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. ³¹P NMR (PPh₃)</span>
                  <span className="text-yellow-400 font-mono">δ = 43 ppm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. UV-Vis (LMCT)</span>
                  <span className="text-yellow-400 font-mono">240-280 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. XRD (struktura)</span>
                  <span className="text-yellow-400 font-mono">Au-P 2.23 Å</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">6. ICP-MS (ppb)</span>
                  <span className="text-yellow-400 font-mono">P, Cl ham</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 6 ta metod birgalikda organometallik kompleksni to'liq tasdiqlaydi
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
              <h3 className="font-bold text-white mb-1">AAS afzalligi (GFAAS)</h3>
              <p className="text-xs text-purple-200">Au ni 39.81% aniqlikda o'lchaydi. <strong className="text-yellow-300">Qimmat metall uchun muhim!</strong> LOD 0.8 μg/L — yetarli. Katalizator sifatini nazorat qilish.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-yellow-300">FAAS da past sezgirlik!</strong> GFAAS talab. Organik matritsa effekti. Au⁺/Au³⁺ farqlanmaydi. Sekin.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EA (C, H), ³¹P NMR (PPh₃), UV-Vis (LMCT), XRD (struktura), ICP-MS (ppb) — organometallik kompleks validatsiyasi.</p>
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
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Au(PPh₃)Cl] • AAS moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955), Hashmi (2010), Au price (2026)</p>
        </div>
      </footer>
    </main>
  )
}