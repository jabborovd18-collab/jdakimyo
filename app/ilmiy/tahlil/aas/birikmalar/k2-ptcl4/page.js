"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// K₂[PtCl₄] — AAS (Atom-Absorbsion Spektroskopiya) MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)
// Xususiyat: Pt²⁺ GFAAS tahlili, 265.9 nm, og'ir metall
// O'ziga xoslik: FAAS da past sezgirlik → GFAAS talab qilinadi!
// Maqsad: Faqat AAS tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Pt: 195.084, K: 39.098, Cl: 35.450
}

const COMPOUND = {
  formulaHTML: "K<sub>2</sub>[PtCl<sub>4</sub>]",
  formulaPlain: "K2[PtCl4]",
  iupac: "Kaliy tetraxloroplatinat(II)",
  formulaExpanded: "K₂PtCl₄",
  commonName: "Potassium tetrachloroplatinate(II) (qizil-jigar kristallar)",
  molarMass: 415.09,
  casNumber: "13683-63-1",
  color: "qizil-jigar kristallar",
  stability: "havoda barqaror, suvda yaxshi eriydi, yorug'likda sekin parchalanadi",
  
  historicalFact: {
    title: "Sisplatin va zamonaviy kimyoterapiyaning asosi",
    text: "K₂[PtCl₄] — zamonaviy saraton dorisi sisplatin (cis-Pt(NH₃)₂Cl₂) ning asosiy prekursori. 1845-yilda Peyrone birinchi marta K₂[PtCl₄] ni NH₃ bilan reaksiyaga kiritib, ikki xil izomerni (sariq va binafsha) oldi. Keyinchalik Jørgensen va Werner bu izomerlarning cis va trans ekanligini isbotladi. 1965-yilda Barnett Rosenberg tasodifan cis-Pt(NH₃)₂Cl₂ ning bakteriyalar bo'linishini to'xtatishini kashf qildi — bu zamonaviy kimyoterapiyaning boshlanishi edi. Bugungi kunda K₂[PtCl₄] yiliga tonnalab ishlab chiqariladi — nafaqat sisplatin, balki karboplatin, oksaliplatin va boshqa platina dorilari uchun ham boshlang'ich modda. AAS tahlilida bu birikma alohida qiziq: Pt — <strong>og'ir metall</strong> va FAAS da past sezgirlikka ega (LOD 0.050 mg/L). Shuning uchun <strong>GFAAS (Grafit pechi)</strong> yoki ICP-OES afzalroq — LOD 0.50 μg/L (100× yaxshiroq!).",
    year: "1845-1965"
  },

  // Pt uchun FAAS vs GFAAS — eng muhim qism
  faasVsGfaas: {
    title: "Pt uchun nima uchun GFAAS FAAS dan 100× afzal?",
    description: "Pt og'ir metall (M = 195.08) va uning atomlanishi FAAS alangasida samarali emas. Shuning uchun Pt tahlili uchun GFAAS (Grafit pechi AAS) afzalroq usul hisoblanadi.",
    comparison: [
      { 
        method: "FAAS (Havo-C₂H₂)", 
        temp: "2300°C",
        lod: "0.050 mg/L",
        sample: "1-5 mL",
        time: "~5 soniya",
        sensitivity: "Past (og'ir metallar uchun)",
        verdict: "⚠ Yuqori konsentratsiyalar uchun"
      },
      { 
        method: "GFAAS (Grafit pechi)", 
        temp: "2500°C",
        lod: "0.50 μg/L",
        sample: "10-50 μL",
        time: "~3 daqiqa",
        sensitivity: "Yuqori (100× FAAS)",
        verdict: "✓ Pt uchun tavsiya etiladi"
      }
    ],
    whyBetter: "GFAAS da namunaning 100% i atomlanadi (FAAS da atigi ~10%). Bundan tashqari, Pt ning ionlanish potensiali yuqori (9.0 eV), shuning uchun yuqori harorat zarur.",
    aasRelevance: "K₂[PtCl₄] ni aniq tahlil qilish uchun GFAAS ishlatiladi. FAAS faqat konsentratsiyasi >1 mg/L bo'lganida ishlatiladi."
  },

  // Sisplatin prekursori sifatida
  cisplatinPrecursor: {
    title: "K₂[PtCl₄] → Sisplatin: AAS orqali sofligi nazorati",
    description: "Sisplatin sintezida K₂[PtCl₄] ning sofligi juda muhim. AAS orqali Pt miqdori va boshqa metallar (Pd, Ir, Rh) qoldiqlari tekshiriladi.",
    synthesis: "K₂[PtCl₄] + 2NH₃ → cis-Pt(NH₃)₂Cl₂ + 2KCl",
    purity: {
      pt_required: "47.00% ± 0.5%",
      pd_max: "< 10 ppm",
      ir_max: "< 10 ppm",
      rh_max: "< 5 ppm"
    }
  },

  aasParameters: {
    element: "Pt",
    oxidationState: "Pt²⁺ (lekin AAS buni farqlamaydi!)",
    hclLamp: "Pt katod lampasi (Hollow Cathode Lamp)",
    lambda: { primary: 265.9, secondary: 214.4, tertiary: 306.5 },
    slitWidth: 0.5,
    lampCurrent: 12,
    atomization: "GFAAS (Grafit pechi)",
    flame: "Elektr isitish (dasturlanadigan)",
    burnerHeight: "—",
    backgroundCorrection: "Zeyman (Zeeman)",
    linearRange: "0.5 - 50 μg/L",
    sensitivity: 0.15,
    lod: 0.50,
    loq: 1.65,
    rsd_typical: "1 - 3%",
    modifier: "Pd/Mg(NO₃)₂"
  },

  theoretical: {
    Pt:  { mass: 195.084, percent: 47.002, source: "Markaziy Pt²⁺ atomi", aasSignal: "265.9 nm da asosiy signal" },
    K:   { mass: 78.196,  percent: 18.839, source: "2×K⁺ (tashqi sfera)", aasSignal: "GFAAS da 766.5 nm (alohida)" },
    Cl:  { mass: 141.800, percent: 34.159, source: "4×Cl⁻ (koordinatsion)", aasSignal: "GFAAS da o'lchanmaydi" }
  },

  calibrationCurve: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (0.1 M HCl + modifikator)" },
    { conc: 5.0, absorbance: 0.037, note: "Standart 1" },
    { conc: 10.0, absorbance: 0.075, note: "Standart 2" },
    { conc: 20.0, absorbance: 0.150, note: "Standart 3" },
    { conc: 30.0, absorbance: 0.225, note: "Standart 4" },
    { conc: 40.0, absorbance: 0.301, note: "Standart 5" },
    { conc: 50.0, absorbance: 0.376, note: "Standart 6" }
  ],

  experimentalRuns: [
    { id: "AAS-24-601", date: "2024-11-05", absorbance: 0.315, conc_mgL: 42.00, sample_mg: 10.0, dilution: 100, Pt_percent: 47.04, rsd: 1.85, note: "Toza K₂[PtCl₄] (GFAAS)" },
    { id: "AAS-24-602", date: "2024-11-05", absorbance: 0.312, conc_mgL: 41.60, sample_mg: 10.0, dilution: 100, Pt_percent: 46.59, rsd: 1.75, note: "Ikkinchi parallel" },
    { id: "AAS-24-603", date: "2024-11-05", absorbance: 0.318, conc_mgL: 42.40, sample_mg: 10.0, dilution: 100, Pt_percent: 47.49, rsd: 1.95, note: "Uchinchi parallel" },
    { id: "AAS-24-604", date: "2024-11-05", absorbance: 0.314, conc_mgL: 41.87, sample_mg: 10.0, dilution: 100, Pt_percent: 46.89, rsd: 1.80, note: "To'rtinchi parallel" },
    { id: "AAS-24-605", date: "2024-11-05", absorbance: 0.316, conc_mgL: 42.13, sample_mg: 10.0, dilution: 100, Pt_percent: 47.19, rsd: 1.88, note: "Beshinchi parallel" },
    { id: "AAS-24-606", date: "2024-11-06", absorbance: 0.063, conc_mgL: 8.40, sample_mg: 10.0, dilution: 100, Pt_percent: 9.41, rsd: 3.25, note: "⚠ FAAS ishlatilgan — signal 5× past!" },
    { id: "AAS-24-607", date: "2024-11-06", absorbance: 0.295, conc_mgL: 39.33, sample_mg: 10.0, dilution: 100, Pt_percent: 44.05, rsd: 2.15, note: "⚠ Pd qoldig'i (50 ppm) aniqlandi" },
    { id: "BLANK-07",   date: "2024-11-05", absorbance: 0.002, conc_mgL: 0.27, sample_mg: 0.0,  dilution: 1,  Pt_percent: 0.00, rsd: 0.00, note: "Blank (modifikator bilan)" },
    { id: "STD-Pt-50",  date: "2024-11-05", absorbance: 0.375, conc_mgL: 50.00, sample_mg: 0.0, dilution: 1, Pt_percent: 0.00, rsd: 0.65, note: "NIST Pt standarti (50 μg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 10.0 ± 0.1 mg K₂[PtCl₄] tortiladi. Qizil-jigar rang — Pt²⁺ belgisi. Sariq rang — Pt(IV) aralashmasi.", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HCl da)", desc: "100 mL hajmli kolbaga solib, 50 mL 0.1 M HCl qo'shiladi. HNO₃ emas, HCl ishlatiladi — Pt(NO₃)₂ barqaror emas, PtCl₄²⁻ barqaror.", time: "10 daq", critical: true },
    { step: 3, title: "Hajmni to'ldirish", desc: "0.1 M HCl bilan 100 mL gacha to'ldiriladi. Konsentratsiya: ~100 mg/L K₂[PtCl₄] ≈ 47 mg/L Pt.", time: "1 daq", critical: false },
    { step: 4, title: "100× suyuqlantirish", desc: "10 μL eritmadan 1 mL kolbaga o'tkaziladi. Natija: ~47 μg/L Pt — GFAAS kalibrlash diapazonida (0.5-50 μg/L).", time: "3 daq", critical: true },
    { step: 5, title: "Modifikator qo'shish", desc: "10 μL Pd/Mg(NO₃)₂ modifikatori qo'shiladi. Bu Pt atomlanishini yaxshilaydi va matritsa effektini kamaytiradi.", time: "1 daq", critical: true },
    { step: 6, title: "GFAAS da o'lchash", desc: "Grafit pechi: quritish (110°C, 30s) → kullash (1200°C, 20s) → atomlanish (2500°C, 3s). λ = 265.9 nm, Zeyman fon korreksiyasi.", time: "~3 daqiqa/har bir namuna", critical: false },
    { step: 7, title: "Natijalarni hisoblash", desc: "%Pt = (C × V × DF / m) × 100. Nazariy: 47.00%. GFAAS da RSD FAAS dan yuqori (1-3%).", time: "1 daq", critical: false }
  ],

  interferences: [
    { type: "Kimyoviy (Cl⁻ matritsasi)", severity: "O'rta", description: "Yuqori Cl⁻ konsentratsiyasi PtCl₆²⁻ hosil qilishi mumkin — atomlanish o'zgaradi.", solution: "Pd/Mg(NO₃)₂ modifikatori qo'shish" },
    { type: "Kimyoviy (Pd, Ir, Rh)", severity: "O'rta", description: "Boshqa platina guruhi metallari Pt signaliga ta'sir qiladi. K₂[PtCl₄] da Pd qoldig'i muammo.", solution: "Standart qo'shish metodi yoki matritsa moslashtirish" },
    { type: "Spektral", severity: "Past", description: "Pt 265.9 nm da nisbatan toza signal. Ba'zi Fe chiziqlari yaqin, lekin muammo tug'dirmaydi.", solution: "Zeyman fon korreksiyasi yetarli" },
    { type: "Fon yutilishi", severity: "O'rta", description: "K₂[PtCl₄] matritsasi murakkab — fon yutilishi bo'lishi mumkin.", solution: "Zeyman yoki Deuteriy fon korreksiyasi majburiy" },
    { type: "Xotira effekti", severity: "Past-O'rta", description: "Pt grafit pechida qolishi mumkin — keyingi namunaga ta'sir qiladi.", solution: "Har bir namunadan keyin tozalash tsikli (2700°C, 5s)" }
  ],

  tgaSteps: [
    { start: 25, end: 200, loss: 0.0, event: "Barqaror zona (K₂[PtCl₄] suvsiz)", color: "#10b981", aasEffect: "Pt signal barqaror" },
    { start: 200, end: 350, loss: 17.1, event: "2-Cl yo'qolishi", color: "#8b5cf6", aasEffect: "K₂[PtCl₂] hosil bo'ladi" },
    { start: 350, end: 500, loss: 17.1, event: "2-Cl yo'qolishi", color: "#ef4444", aasEffect: "Pt metali qoldig'i" },
    { start: 500, end: 700, loss: 18.8, event: "K sublimatsiyasi", color: "#f59e0b", aasEffect: "Pt metali sof" },
    { start: 700, end: 900, loss: 0.0, event: "Pt metali barqaror (47.0%)", color: "#6366f1", aasEffect: "Gravimetriya: 47% Pt" }
  ],

  relatedMethods: [
    { name: "ICP-OES / ICP-MS", role: "Pt ko'p elementli tahlil, ppb-ppt darajasida, bir vaqtda Pd, Ir, Rh ham", aasAdvantage: "ICP bir vaqtda bir nechta elementni o'lchaydi, sezgirlik yuqori", aasDisadvantage: "GFAAS sekin, bir vaqtda bitta element", complementarity: "98%" },
    { name: "Gravimetriya", role: "Pt ni DMG yoki boshqa reagentlar bilan cho'ktirib, tortish", aasAdvantage: "Gravimetriya juda aniq (±0.1%), lekin sekin", aasDisadvantage: "GFAAS tez, lekin ±2% xato", complementarity: "90%" },
    { name: "UV-Vis spektroskopiya", role: "PtCl₄²⁻ ning LMCT chiziqlari (215, 260, 320 nm)", aasAdvantage: "UV-Vis Pt²⁺ holatini ko'rsatadi", aasDisadvantage: "AAS buni bilmaydi", complementarity: "88%" },
    { name: "EA (Element Analiz)", role: "C, H, N yo'qligini tekshiradi — organik ifloslanishlar", aasAdvantage: "EA organik sofligi, AAS metall sofligini tekshiradi", aasDisadvantage: "Birgalikda to'liq sofligi nazorati", complementarity: "95%" },
    { name: "XRD (Rentgen difraksiya)", role: "K₂[PtCl₄] kristall strukturasi, Pt-Cl masofa (2.31 Å)", aasAdvantage: "XRD strukturani, AAS tarkibni tasdiqlaydi", aasDisadvantage: "Birgalikda to'liq validatsiya", complementarity: "92%" },
    { name: "Elektrokimyo (CV)", role: "Pt²⁺/Pt⁰ qaytarilish (E₁/₂ ≈ -0.8 V vs SHE)", aasAdvantage: "CV oksidlanish holatini ko'rsatadi", aasDisadvantage: "AAS buni bilmaydi", complementarity: "85%" }
  ]
}

function calculatePtPercent(absorbance, sampleMass, dilutionFactor) {
  const slope = 0.00752
  const conc_ugL = absorbance / slope
  const conc_mgL = conc_ugL / 1000
  const totalVolume = 100
  const Pt_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Pt_percent = (Pt_mass_mg / sampleMass) * 100
  return {
    conc_ugL: parseFloat(conc_ugL.toFixed(2)),
    conc_mgL: parseFloat(conc_mgL.toFixed(4)),
    Pt_mass: parseFloat(Pt_mass_mg.toFixed(3)),
    Pt_percent: parseFloat(Pt_percent.toFixed(2))
  }
}

export default function K2PtCl4Page() {
  const [activeRun, setActiveRun] = useState("AAS-24-601")
  const [customAbsorbance, setCustomAbsorbance] = useState(0.315)
  const [customMass, setCustomMass] = useState(10.0)
  const [dilutionFactor, setDilutionFactor] = useState(100)
  const [selectedInterference, setSelectedInterference] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaPt = Math.abs(run.Pt_percent - COMPOUND.theoretical.Pt.percent)
  const statusColor = deltaPt <= 1.0 ? "text-green-400" : deltaPt <= 3.0 ? "text-yellow-400" : "text-red-400"

  const calcResult = useMemo(() => 
    calculatePtPercent(customAbsorbance, customMass, dilutionFactor),
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
            <span className="text-red-400 font-semibold">K₂[PtCl₄]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Pt²⁺ d⁸</span>
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">λ = 265.9 nm</span>
                <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Sisplatin Prekursori</span>
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Og'ir Metall</span>
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
        <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (AAS uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">K₂[PtCl₄]</strong> — platina(II) ning tetraxloro kompleksi, sisplatin va boshqa Pt dorilarining asosiy prekursori. AAS tahlilida <strong className="text-red-300">o'ziga xos qiyinchilik</strong> tug'diradi, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs md:text-sm">
                <li>Nazariy <strong className="text-white">%Pt = 47.00%</strong> — yuqori foiz</li>
                <li>Pt — <strong className="text-orange-300">og'ir metall</strong> (M = 195.08)</li>
                <li>FAAS da <strong className="text-red-300">past sezgirlik</strong> (LOD 0.050 mg/L)</li>
                <li><strong className="text-green-300">GFAAS tavsiya etiladi</strong> (LOD 0.50 μg/L)</li>
                <li>Pt²⁺ <strong className="text-white">diamagnit</strong> (d⁸, kvadrat-tekis)</li>
                <li>Yuqori Cl⁻ matritsasi — <strong className="text-white">modifikator talab</strong></li>
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

        {/* 1b. FAAS vs GFAAS — ENG MUHIM QISM */}
        <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border-2 border-orange-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚫</span> {COMPOUND.faasVsGfaas.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.faasVsGfaas.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {COMPOUND.faasVsGfaas.comparison.map((c, i) => (
              <div key={i} className={`rounded-xl p-5 border-2 ${
                c.method.includes("GFAAS") 
                  ? "bg-green-950/40 border-green-500/50" 
                  : "bg-red-950/40 border-red-700/30 opacity-90"
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`font-bold text-sm ${c.method.includes("GFAAS") ? "text-green-400" : "text-red-400"}`}>
                    {c.method}
                  </h3>
                  {c.method.includes("GFAAS") && (
                    <span className="text-xs bg-green-600/40 px-2 py-0.5 rounded text-green-200">✓ Tavsiya</span>
                  )}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Harorat:</span>
                    <span className="font-mono text-orange-400">{c.temp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">LOD:</span>
                    <span className="font-mono font-bold text-yellow-400">{c.lod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Namuna:</span>
                    <span className="text-white">{c.sample}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Vaqt:</span>
                    <span className="text-white">{c.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Sezgirlik:</span>
                    <span className={c.sensitivity.includes("Yuqori") ? "text-green-300" : "text-red-300"}>
                      {c.sensitivity}
                    </span>
                  </div>
                  <div className="mt-2 p-2 rounded bg-purple-950/40 text-purple-200">
                    {c.verdict}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700/50 mb-3">
            <h4 className="text-orange-300 font-bold text-sm mb-2">💡 Nima uchun GFAAS yaxshiroq?</h4>
            <p className="text-xs text-purple-200">{COMPOUND.faasVsGfaas.whyBetter}</p>
          </div>

          <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
            <h4 className="text-green-300 font-bold text-sm mb-2">✅ K₂[PtCl₄] uchun xulosa:</h4>
            <p className="text-xs text-purple-200">{COMPOUND.faasVsGfaas.aasRelevance}</p>
          </div>
        </div>

        {/* 1c. SISPLATIN PREKURSORI */}
        <div className="bg-gradient-to-r from-amber-900/40 to-red-900/40 border border-amber-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>💊</span> {COMPOUND.cisplatinPrecursor.title}
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            {COMPOUND.cisplatinPrecursor.description}
          </p>

          <div className="bg-amber-950/40 rounded-xl p-5 border border-amber-700/30 mb-4">
            <h4 className="text-amber-300 font-bold text-sm mb-3">Sintez reaksiyasi:</h4>
            <div className="bg-purple-950/60 rounded-lg p-3 font-mono text-sm text-center">
              K₂[PtCl₄] + 2NH₃ → <span className="text-red-400 font-bold">cis-Pt(NH₃)₂Cl₂</span> + 2KCl
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Pt sofligi</div>
              <div className="text-sm font-mono text-green-400 font-bold">{COMPOUND.cisplatinPrecursor.purity.pt_required}</div>
            </div>
            <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Pd max</div>
              <div className="text-sm font-mono text-yellow-400">{COMPOUND.cisplatinPrecursor.purity.pd_max}</div>
            </div>
            <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Ir max</div>
              <div className="text-sm font-mono text-yellow-400">{COMPOUND.cisplatinPrecursor.purity.ir_max}</div>
            </div>
            <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Rh max</div>
              <div className="text-sm font-mono text-yellow-400">{COMPOUND.cisplatinPrecursor.purity.rh_max}</div>
            </div>
          </div>
        </div>

        {/* 2. AAS PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> AAS tahlil parametrlari (GFAAS — Pt uchun optimallashtirilgan)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Pt²⁺ uchun <strong className="text-orange-300">GFAAS (Grafit pechi)</strong> ishlatiladi — FAAS da sezgirlik yetarli emas. 
            Pd/Mg(NO₃)₂ modifikatori Cl⁻ matritsa effektini bartaraf etadi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Element</div>
              <div className="text-lg font-bold text-red-400">{COMPOUND.aasParameters.element}</div>
              <div className="text-[10px] text-purple-300 mt-1">{COMPOUND.aasParameters.oxidationState}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">λ (asosiy)</div>
              <div className="text-lg font-mono font-bold text-red-400">{COMPOUND.aasParameters.lambda.primary} nm</div>
              <div className="text-[10px] text-purple-300 mt-1">Alt: {COMPOUND.aasParameters.lambda.secondary} nm</div>
            </div>
            <div className="bg-orange-950/60 p-3 rounded-xl border-2 border-orange-500/50">
              <div className="text-[10px] text-orange-400 uppercase mb-1">⚫ Atomlanish</div>
              <div className="text-sm font-bold text-orange-400">{COMPOUND.aasParameters.atomization}</div>
              <div className="text-[10px] text-purple-300 mt-1">~2500°C</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">LOD (μg/L)</div>
              <div className="text-lg font-mono font-bold text-green-400">{COMPOUND.aasParameters.lod}</div>
              <div className="text-[10px] text-purple-300 mt-1">LOQ: {COMPOUND.aasParameters.loq}</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-red-400 font-bold text-xs uppercase mb-3">Batafsil parametrlar (Pt uchun):</h3>
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
                <div className="font-mono text-white">{COMPOUND.aasParameters.lampCurrent} mA (yuqori)</div>
              </div>
              <div>
                <div className="text-purple-400">Modifikator:</div>
                <div className="font-mono text-orange-300">{COMPOUND.aasParameters.modifier}</div>
              </div>
              <div>
                <div className="text-purple-400">Fon korreksiyasi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.backgroundCorrection}</div>
              </div>
              <div>
                <div className="text-purple-400">Chiziqli diapazon:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.linearRange}</div>
              </div>
              <div>
                <div className="text-purple-400">Sezgirlik:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.sensitivity} μg/L</div>
              </div>
              <div>
                <div className="text-purple-400">Tipik RSD:</div>
                <div className="font-mono text-yellow-300">{COMPOUND.aasParameters.rsd_typical}</div>
              </div>
              <div>
                <div className="text-purple-400">Erituvchi:</div>
                <div className="font-mono text-white">0.1 M HCl (HNO₃ emas!)</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-orange-900/20 rounded-lg border border-orange-700/30">
            <h4 className="text-orange-300 font-bold text-xs mb-2">⚠ GFAAS dasturi (har bir namuna uchun):</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-purple-950/40 rounded p-2">
                <div className="text-purple-400">1. Quritish</div>
                <div className="font-mono text-white">110°C, 30s</div>
              </div>
              <div className="bg-purple-950/40 rounded p-2">
                <div className="text-purple-400">2. Kullash</div>
                <div className="font-mono text-white">1200°C, 20s</div>
              </div>
              <div className="bg-orange-950/40 rounded p-2 border border-orange-700/30">
                <div className="text-orange-400">3. Atomlanish</div>
                <div className="font-mono text-white">2500°C, 3s</div>
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
            K₂[PtCl₄] — <strong className="text-red-300">to'liq noorganik</strong> birikma. C, H, N, O yo'q. AAS <strong className="text-red-300">faqat Pt</strong> ni o'lchaydi (K ni ham alohida o'lchash mumkin).
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
                    <td className="py-3 pl-2 font-bold text-red-400">{el}</td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-400">{d.aasSignal}</td>
                  </tr>
                ))}
                <tr className="bg-red-900/20 font-bold border-t border-red-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-red-300">AAS: Pt (47.00%) + K (18.84%) = 65.84%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. KALIBRLASH EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> Kalibrlash egri chizig'i (Pt, 265.9 nm, GFAAS)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Pt standartlari (0.1 M HCl + modifikator) yordamida GFAAS da kalibrlash egri chizig'i qurilgan. <strong className="text-red-300">R² = 0.9998</strong> — mukammal chiziqli bog'liqlik. <strong className="text-white">A = 0.00752 × C (μg/L)</strong>.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 500 260" className="w-full h-full overflow-visible">
              {[0, 0.1, 0.2, 0.3, 0.4].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/0.4)*200} x2="480" y2={220 - (v/0.4)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/0.4)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 10, 20, 30, 40, 50].map(c => (
                <g key={c}>
                  <text x={50 + (c/50)*430} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="265" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Pt konsentratsiyasi (μg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish (A)</text>

              <line x1="50" y1="220" x2="480" y2={220 - (0.376/0.4)*200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/50)*430
                const y = 220 - (p.absorbance/0.4)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#ef4444" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#fca5a5">
                        {p.absorbance.toFixed(3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (42.0/50)*430
                const y = 220 - (0.315/0.4)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (42 μg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="350" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#ef4444" strokeWidth="1" />
              <text x="410" y="48" textAnchor="middle" fontSize="10" fill="#fca5a5" fontWeight="bold">
                R² = 0.9998
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Standart nuqta</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Namuna</span>
            <span className="flex items-center gap-1"><span className="w-6 border-t-2 border-dashed border-red-500"></span> Regressiya (GFAAS)</span>
          </div>
        </div>

        {/* 5. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> AAS yugurishlari — GFAAS vs FAAS taqqoslash
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            <strong className="text-orange-300">Diqqat:</strong> AAS-24-606 da <strong>FAAS</strong> ishlatilgan — signal 5× past! Bu Pt ning FAAS da past sezgirligini ko'rsatadi.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isFAAS = r.id === "AAS-24-606"
              const isPd = r.id === "AAS-24-607"
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun === r.id 
                      ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20" 
                      : isBlank 
                        ? "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-gray-500"
                        : isStd
                          ? "bg-amber-900/30 border-amber-700/30 text-amber-300 hover:border-amber-500"
                          : isFAAS
                            ? "bg-orange-900/30 border-orange-700/30 text-orange-300 hover:border-orange-500"
                            : isPd
                              ? "bg-purple-900/30 border-purple-700/30 text-purple-300 hover:border-purple-500"
                              : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                  }`}
                >
                  {r.id}
                  {isFAAS && " ⚠ FAAS"}
                  {isPd && " ⚠ Pd"}
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
                    <span className="font-mono text-red-400 text-lg">{run.absorbance.toFixed(3)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-red-900/20 rounded border border-red-500/20">
                    <span className="text-sm text-red-400 font-medium">C (μg/L):</span>
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
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Pt:</span>
                    <span className="font-mono text-white text-lg">{run.Pt_percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Pt:</span>
                    <span className="font-mono text-red-400">{COMPOUND.theoretical.Pt.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaPt.toFixed(2)}%</span>
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
                  : deltaPt <= 1.0
                    ? "bg-green-900/30 border-green-700/30"
                    : deltaPt <= 3.0
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : deltaPt <= 1.0 ? "text-green-400" : deltaPt <= 3.0 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : deltaPt <= 1.0 ? "✓ K₂[PtCl₄] tasdiqlandi" : deltaPt <= 3.0 ? "⚠ Qo'shimcha tekshirish" : "✗ Mos emas"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    deltaPt <= 1.0
                      ? "GFAAS natijasi K₂[PtCl₄] formulaga to'liq mos keladi (%Pt = 47.00%). Modifikator bilan yaxshi atomlanish."
                      : deltaPt <= 3.0
                        ? "%Pt qiymati chegarada — Pd qoldig'i yoki boshqa matritsa effekti bo'lishi mumkin."
                        : run.Pt_percent < 40
                          ? "FAAS ishlatilgan (signal past) yoki Pt qoldig'i aniqlangan."
                          : "%Pt yuqori — namuna ifloslangan yoki boshqa Pt kompleksi."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Blank — signal nolga yaqin. Tizim toza."
                      : "NIST standarti — kalibrlash to'g'ri bajarilgan."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-red-400 mb-4 flex justify-between">
                <span>%Pt Qiymatlari — GFAAS vs FAAS</span>
                <span className="text-[10px] text-purple-500 font-normal">Nazariy: 47.00%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isFAAS = r.id === "AAS-24-606"
                  const isPd = r.id === "AAS-24-607"
                  const val = r.Pt_percent
                  const heightPct = Math.min((val / 55) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-red-500/50 z-0" style={{ bottom: `${(47.002/55)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : isFAAS ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                                : isPd ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : isFAAS ? 'bg-orange-700/40'
                              : isPd ? 'bg-purple-700/40'
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : isFAAS ? 'text-orange-400' : isPd ? 'text-purple-400' : 'text-red-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> GFAAS ✓</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded"></span> FAAS ✗</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-red-500/50"></span> Nazariy (47.00%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
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
                        <td className="py-2 px-3 text-red-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-700/30 text-xs text-purple-200">
                <strong className="text-red-300">Regressiya:</strong> A = 0.00752 × C + 0.0004, R² = 0.9998
              </div>
              <div className="mt-3 p-3 bg-orange-900/20 rounded-lg border border-orange-700/30 text-xs text-purple-200">
                <strong className="text-orange-300">⚫ Eslatma:</strong> Bu GFAAS kalibrlash. FAAS da slope 100× past bo'lar edi (0.0000752).
              </div>
              <button 
                onClick={() => setShowCalibrationModal(false)}
                className="w-full mt-4 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* 6. INTERFERENSIYALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span> Interferensiyalar (Pt uchun muhim!)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Pt uchun <strong className="text-orange-300">matritsa effektlari</strong> muhim — ayniqsa yuqori Cl⁻ konsentratsiyasi va boshqa platina guruhi metallari (Pd, Ir, Rh). Modifikator majburiy.
          </p>

          <div className="space-y-2">
            {COMPOUND.interferences.map((int, i) => (
              <button
                key={i}
                onClick={() => setSelectedInterference(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedInterference === i
                    ? "bg-red-900/40 border-red-500"
                    : "bg-purple-950/40 border-purple-700/30 hover:border-red-500/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-red-400">{int.type}</span>
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
            K₂[PtCl₄] <strong className="text-red-300">suvsiz</strong> — gidrat suvi yo'q. 500°C dan keyin Pt metali sof qoldiq sifatida qoladi — bu gravimetriya orqali ham tasdiqlanadi.
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
                d="M 50 20 L 250 20 Q 270 20 280 45 L 310 85 Q 320 95 340 95 L 380 95 Q 395 95 405 120 L 440 160 Q 450 170 470 170 L 510 170 Q 525 170 535 185 L 580 205" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="150" y="15" textAnchor="middle" fill="#10b981">AAS: %Pt = 47.00%</text>
                
                <line x1="310" y1="85" x2="310" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="310" y="235" textAnchor="middle" fill="#8b5cf6">~280°C</text>
                <text x="330" y="75" fill="#8b5cf6">-2 Cl</text>

                <line x1="440" y1="160" x2="440" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="440" y="235" textAnchor="middle" fill="#ef4444">~430°C</text>
                <text x="460" y="150" fill="#ef4444">-2 Cl</text>

                <line x1="535" y1="185" x2="535" y2="220" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="535" y="235" textAnchor="middle" fill="#f59e0b">~600°C</text>
                <text x="555" y="175" fill="#f59e0b">-K</text>

                <text x="560" y="200" textAnchor="middle" fill="#6366f1">Pt (47%)</text>
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
                <div className="text-[10px] text-red-300 mt-2 italic">AAS effekti: {step.aasEffect}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> AAS ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            K₂[PtCl₄] uchun AAS ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-red-300">sisplatin sofligini nazorat qilish</strong> uchun muhim. <strong className="text-orange-300">ICP-MS</strong> eng kuchli qo'shimcha metod (Pd, Ir, Rh qoldiqlarini tekshirish uchun).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-red-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-red-300">{m.name}</h3>
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

          <div className="mt-5 bg-red-900/20 border border-red-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-red-300 mb-2">💡 Sisplatin sofligi nazorati uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">GFAAS (Pt%) + ICP-MS (Pd, Ir, Rh qoldiqlari) + UV-Vis (PtCl₄²⁻ LMCT) + EA (C, H, N yo'qligi) + XRD (struktura) + CV (Pt²⁺)</strong> — oltita metod birgalikda K₂[PtCl₄] ning sofligini to'liq nazorat qiladi va sisplatin sinteziga tayyorligini tasdiqlaydi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> AAS uchun namuna tayyorlash (GFAAS — maxsus sharoit)
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            K₂[PtCl₄] uchun <strong className="text-red-300">HCl erituvchi</strong> ishlatiladi (HNO₃ emas!). Modifikator majburiy — Cl⁻ matritsa effektini bartaraf etish uchun.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-red-900/40 border-red-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-red-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-red-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
          <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> GFAAS dan %Pt hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan yutilish (A), namuna massasi va suyuqlantirish faktori bo'yicha <strong className="text-red-300">%Pt</strong> ni avtomatik hisoblang. Konsentratsiya μg/L da!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, 265.9 nm, GFAAS):</label>
              <input 
                type="number" step="0.001" value={customAbsorbance}
                onChange={(e) => setCustomAbsorbance(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-purple-400">C (μg/L):</div>
                <div className="text-xl font-mono font-bold text-red-400">{calcResult.conc_ugL}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">C (mg/L):</div>
                <div className="text-xl font-mono font-bold text-orange-400">{calcResult.conc_mgL}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Pt massasi (mg):</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{calcResult.Pt_mass}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Pt:</div>
                <div className={`text-xl font-mono font-bold ${Math.abs(calcResult.Pt_percent - 47.00) <= 1.0 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Pt_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: C(μg/L) = A / 0.00752; %Pt = (C(mg/L) × 100 × DF) / (m × 1000) × 100
            </p>
          </div>
        </div>

        {/* 11. AAS CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> AAS ning K₂[PtCl₄] uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                AAS K₂[PtCl₄] ni tahlil qilishda kuchli, lekin quyidagi cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">FAAS da past sezgirlik</strong> — GFAAS yoki ICP-MS talab</li>
                <li><strong className="text-red-300">Pt²⁺ va Pt⁴⁺ ni farqlay olmaydi</strong> — CV kerak</li>
                <li><strong className="text-red-300">Faqat Pt ni o'lchaydi</strong> — K, Cl uchun boshqa metodlar</li>
                <li><strong className="text-red-300">Matritsa effektlari</strong> — modifikator majburiy</li>
                <li><strong className="text-red-300">Pd, Ir, Rh qoldiqlarini tekshirolmaydi</strong> — ICP-MS kerak</li>
                <li><strong className="text-red-300">Sekin (GFAAS: ~3 daqiqa/namuna)</strong></li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>K₂[PtCl₄] ni to'liq tasdiqlash</strong> uchun kamida 5-6 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-red-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. GFAAS (Pt%)</span>
                  <span className="text-red-400 font-mono">47.00%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. ICP-MS (Pd, Ir, Rh)</span>
                  <span className="text-red-400 font-mono">{'<'} 10 ppm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. UV-Vis (PtCl₄²⁻)</span>
                  <span className="text-red-400 font-mono">215, 260, 320 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. EA (C, H, N yo'q)</span>
                  <span className="text-red-400 font-mono">0%, 0%, 0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. XRD (struktura)</span>
                  <span className="text-red-400 font-mono">Pt-Cl 2.31 Å</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">6. CV (Pt²⁺/Pt⁰)</span>
                  <span className="text-red-400 font-mono">E₁/₂ ≈ -0.8 V</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 6 ta metod birgalikda sisplatin prekursori sofligini to'liq nazorat qiladi
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
              <p className="text-xs text-purple-200">Pt ni 47.00% aniqlikda o'lchaydi. GFAAS FAAS dan 100× sezgir (LOD 0.5 μg/L). Modifikator bilan matritsa effekti bartaraf etiladi.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200"><strong className="text-red-300">FAAS da past sezgirlik!</strong> Pt²⁺/Pt⁴⁺ farqlanmaydi. Pd, Ir, Rh qoldiqlari tekshirilmaydi. Sekin (~3 daqiqa/namuna).</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">ICP-MS (Pd, Ir, Rh), UV-Vis (215, 260, 320 nm), EA (C,H,N=0), XRD (Pt-Cl 2.31Å), CV (-0.8V) — sisplatin sofligi nazorati.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/aas" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← AAS metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-sm bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • K₂[PtCl₄] • AAS moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955), Peyrone (1845), Rosenberg (1965)</p>
        </div>
      </footer>
    </main>
  )
}