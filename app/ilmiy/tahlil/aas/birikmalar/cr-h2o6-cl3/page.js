"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Cr(H₂O)₆]Cl₃ — AAS (Atom-Absorbsion Spektroskopiya) MAHSUS SAHIFASI
// Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955)
// Xususiyat: Cr³⁺ QIYIN ATOMLASHTIRILADIGAN element — N₂O-C₂H₂ alangasi talab
// O'ziga xoslik: Refrakter oksid (Cr₂O₃), kinetik inert (d³)
// Maqsad: Faqat AAS tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Cr: 51.996, Cl: 35.450, H: 1.008, O: 15.999
}

const WATER_MOLAR_MASS = 2 * ATOMIC_MASSES.H + ATOMIC_MASSES.O  // 18.015

const COMPOUND = {
  formulaHTML: "[Cr(H<sub>2</sub>O)<sub>6</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Cr(H2O)6]Cl3",
  iupac: "Geksaakvaxrom(III) xlorid",
  formulaExpanded: "CrH₁₂O₆Cl₃",
  commonName: "Xrom(III) xlorid geksagidrat (to'g'ri nom: xrom(III) xlorid)",
  molarMass: 266.45,
  casNumber: "10060-12-5",
  color: "to'q binafsha-yashil kristallar",
  stability: "havoda barqaror, d³ (t₂g³) kinetik inert, ligand almashinishi juda sekin (t₁/₂ ~ soat)",
  
  historicalFact: {
    title: "Werner nazariyasi va kinetik inertlik",
    text: "[Cr(H₂O)₆]Cl₃ — koordinatsion kimyoning eng qadimgi va muhim birikmalaridan biri. 1893-yilda Alfred Werner o'zining koordinatsion nazariyasini isbotlash uchun Cr³⁺ komplekslaridan foydalangan. Cr³⁺ ning d³ (t₂g³) elektron konfiguratsiyasi uni <strong>kinetik inert</strong> qiladi — ligand almashinishi soatlab vaqt oladi (Fe²⁺ da millisekundlar, Co³⁺ da ham inert). Qiziq fakt: [Cr(H₂O)₆]³⁺ ning 6 ta suv ligandi hammasi to'g'ridan-to'g'ri Cr³⁺ ga bog'langan — tashqi sfera suvlari yo'q. Bu uni CrCl₃·6H₂O dan farqlaydi (bu yerda turli izomerlar mavjud: [Cr(H₂O)₅Cl]Cl₂·H₂O, [Cr(H₂O)₄Cl₂]Cl·2H₂O). AAS tahlilida Cr³⁺ <strong>eng qiyin metallar</strong>dan biri — chunki u barqaror Cr₂O₃ oksidini hosil qiladi va odatiy Havo-C₂H₂ alangasida to'liq atomlanmaydi. Shuning uchun <strong>N₂O-C₂H₂ (~2900°C)</strong> issiq alanga zarur.",
    year: "1893-yil"
  },

  // AAS ning eng muhim jihati — refrakter element
  refractoryNature: {
    title: "Cr³⁺ — refrakter (qiyin atomlashtiriladigan) element!",
    description: "Cr ning odatiy Havo-C₂H₂ alangasida (~2300°C) atomlanishi juda past — chunki u barqaror Cr₂O₃ (melting point: 2435°C) oksidini hosil qiladi. Shuning uchun Cr tahlili uchun maxsus yondashuvlar talab qilinadi.",
    problem: "Havo-C₂H₂ alangasida Cr₂O₃ to'liq parchalanmaydi → signal 10-20× past",
    solution: [
      "1. N₂O-C₂H₂ alangasi (~2900°C) — eng samarali",
      "2. NH₄Cl modifikatori qo'shish — CrCl₂ hosil qiladi (barqaror emas)",
      "3. 8-hidroksikinolin bilan ekstraksiya — matritsadan ajratish",
      "4. GFAAS (Grafit pechi) — ppb darajasida"
    ],
    temperature: {
      "Havo-C₂H₂": "2300°C — yetarli emas",
      "N₂O-C₂H₂": "2900°C — Cr₂O₃ ni to'liq parchalaydi",
      "GFAAS": "2500°C — maxsus dastur bilan"
    }
  },

  aasParameters: {
    element: "Cr",
    oxidationState: "Cr³⁺ (lekin AAS buni farqlamaydi!)",
    hclLamp: "Cr katod lampasi (Hollow Cathode Lamp)",
    lambda: { primary: 357.9, secondary: 359.0, tertiary: 425.4 },
    slitWidth: 0.5,
    lampCurrent: 7,
    atomization: "FAAS (N₂O-C₂H₂)",
    flame: "N₂O-C₂H₂ (oxidizing, ~2900°C)",
    burnerHeight: 12,
    backgroundCorrection: "Zeyman (Zeeman)",
    linearRange: "0.03 - 3.0 mg/L",
    sensitivity: 0.05,
    lod: 0.003,
    loq: 0.010,
    rsd_typical: "1 - 3%",
    modifier: "NH₄Cl (1000 mg/L)"
  },

  theoretical: {
    Cr:  { mass: 51.996,  percent: 19.515, source: "Markaziy Cr³⁺ atomi", aasSignal: "357.9 nm da asosiy signal" },
    Cl:  { mass: 106.350, percent: 39.914, source: "3×Cl⁻ (tashqi sfera)", aasSignal: "FAAS da o'lchanmaydi" },
    O:   { mass: 95.994,  percent: 36.028, source: "6×koordinatsion H₂O", aasSignal: "FAAS da o'lchanmaydi" },
    H:   { mass: 12.096,  percent: 4.540,  source: "6×H₂O (12×H)", aasSignal: "FAAS da o'lchanmaydi" }
  },

  calibrationCurve: [
    { conc: 0.0, absorbance: 0.000, note: "Blank (0.1 M HNO₃ + 1000 mg/L NH₄Cl)" },
    { conc: 0.5, absorbance: 0.055, note: "Standart 1" },
    { conc: 1.0, absorbance: 0.108, note: "Standart 2" },
    { conc: 1.5, absorbance: 0.163, note: "Standart 3" },
    { conc: 2.0, absorbance: 0.217, note: "Standart 4" },
    { conc: 2.5, absorbance: 0.272, note: "Standart 5" },
    { conc: 3.0, absorbance: 0.328, note: "Standart 6" }
  ],

  experimentalRuns: [
    { id: "AAS-24-201", date: "2024-07-15", absorbance: 0.215, conc_mgL: 1.98, sample_mg: 20.0, dilution: 10, Cr_percent: 19.80, rsd: 1.8, note: "Toza [Cr(H₂O)₆]Cl₃ (N₂O-C₂H₂)" },
    { id: "AAS-24-202", date: "2024-07-15", absorbance: 0.213, conc_mgL: 1.96, sample_mg: 20.0, dilution: 10, Cr_percent: 19.60, rsd: 1.6, note: "Ikkinchi parallel" },
    { id: "AAS-24-203", date: "2024-07-15", absorbance: 0.217, conc_mgL: 1.99, sample_mg: 20.0, dilution: 10, Cr_percent: 19.90, rsd: 2.1, note: "Uchinchi parallel" },
    { id: "AAS-24-204", date: "2024-07-15", absorbance: 0.214, conc_mgL: 1.97, sample_mg: 20.0, dilution: 10, Cr_percent: 19.70, rsd: 1.9, note: "To'rtinchi parallel" },
    { id: "AAS-24-205", date: "2024-07-15", absorbance: 0.216, conc_mgL: 1.98, sample_mg: 20.0, dilution: 10, Cr_percent: 19.80, rsd: 1.7, note: "Beshinchi parallel" },
    { id: "AAS-24-206", date: "2024-07-16", absorbance: 0.085, conc_mgL: 0.78, sample_mg: 20.0, dilution: 10, Cr_percent: 7.80, rsd: 3.2, note: "⚠ Havo-C₂H₂ alangasi ishlatilgan — signal 2.5× past!" },
    { id: "AAS-24-207", date: "2024-07-16", absorbance: 0.225, conc_mgL: 2.07, sample_mg: 20.0, dilution: 10, Cr_percent: 20.70, rsd: 2.3, note: "[Cr(H₂O)₅Cl]Cl₂ aralashmasi" },
    { id: "BLANK-03",   date: "2024-07-15", absorbance: 0.003, conc_mgL: 0.03, sample_mg: 0.0,  dilution: 1,  Cr_percent: 0.00, rsd: 0.0, note: "Blank" },
    { id: "STD-Cr-10",  date: "2024-07-15", absorbance: 1.085, conc_mgL: 10.02, sample_mg: 0.0, dilution: 1, Cr_percent: 0.00, rsd: 0.8, note: "NIST Cr standarti (10 mg/L)" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tortish", desc: "Analitik tarozida 20.0 ± 0.1 mg [Cr(H₂O)₆]Cl₃ tortiladi. To'q binafsha-yashil rang — Cr³⁺ belgisi. Sariq rang — Cr(VI) aralashmasi!", time: "2 daq", critical: true },
    { step: 2, title: "Eritish (HNO₃ da)", desc: "100 mL hajmli kolbaga solib, 50 mL 0.1 M HNO₃ qo'shiladi. Cr³⁺ eritmasi binafsha-yashil bo'ladi.", time: "5 daq", critical: true },
    { step: 3, title: "NH₄Cl modifikatori qo'shish", desc: "1.0 mL 10% NH₄Cl eritmasi qo'shiladi. Bu Cr₂O₃ barqarorligini kamaytiradi va CrCl₂ hosil qiladi — atomlanish yaxshilanadi.", time: "1 daq", critical: true },
    { step: 4, title: "Hajmni to'ldirish", desc: "0.1 M HNO₃ bilan 100 mL gacha to'ldiriladi. Bu eritma konsentratsiyasi: ~200 mg/L [Cr(H₂O)₆]Cl₃ ≈ 39 mg/L Cr.", time: "1 daq", critical: false },
    { step: 5, title: "10× suyuqlantirish", desc: "1.0 mL eritmadan 10 mL kolbaga o'tkaziladi. Natija: ~3.9 mg/L Cr — kalibrlash diapazonida. Yana 1 mL 10% NH₄Cl qo'shiladi.", time: "3 daq", critical: true },
    { step: 6, title: "N₂O-C₂H₂ alangasida o'lchash", desc: "⚠ DIQQAT: N₂O-C₂H₂ alangasi XAVFLI! Faqat tajribali operator ishlatishi kerak. λ = 357.9 nm, Zeyman fon korreksiyasi.", time: "8-12 daq", critical: true },
    { step: 7, title: "Natijalarni hisoblash", desc: "%Cr = (C × V × DF / m) × 100. Nazariy: 19.52%. Havo-C₂H₂ da signal 2-3× past bo'ladi!", time: "1 daq", critical: false }
  ],

  interferences: [
    { type: "Kimyoviy (Cr₂O₃ refrakter)", severity: "Juda yuqori", description: "Cr₂O₃ (mp 2435°C) Havo-C₂H₂ alangasida to'liq parchalanmaydi — signal 80-90% gacha kamayadi.", solution: "N₂O-C₂H₂ alangasi (~2900°C) yoki NH₄Cl modifikatori qo'shish" },
    { type: "Kimyoviy (Fe, Ni)", severity: "O'rta", description: "Fe³⁺ va Ni²⁺ Cr atomlanishini sekinlashtiradi (birgalikda barqaror oksidlar).", solution: "NH₄Cl modifikatori yoki 8-hidroksikinolin ekstraksiyasi" },
    { type: "Spektral", severity: "Past-O'rta", description: "Fe 358.1 nm Cr 357.9 nm ga juda yaqin — yuqori Fe konsentratsiyalarida (+10 mg/L) ustma-ust tushishi mumkin.", solution: "Zeyman fon korreksiyasi yoki alt. λ = 425.4 nm (sezgirlik pastroq)" },
    { type: "Ionlanish", severity: "Past", description: "Cr ning ionlanish potensiali 6.77 eV — alangada kam ionlanadi.", solution: "Ionlanish buferi shart emas" },
    { type: "Matritsa (Cl⁻)", severity: "Past", description: "Yuqori Cl⁻ konsentratsiyasi CrCl₂ hosil qiladi — bu atomlanishni YAXSHILAYDI!", solution: "NH₄Cl qo'shish allaqachon matritsani optimallashtiradi" }
  ],

  tgaSteps: [
    { start: 25, end: 100, loss: 0.0, event: "Barqaror zona", color: "#10b981", aasEffect: "Cr signal barqaror" },
    { start: 100, end: 150, loss: 40.6, event: "6H₂O yo'qolishi (dehidratsiya)", color: "#3b82f6", aasEffect: "%Cr: 19.52% → 32.85% (suvsiz shaklda)" },
    { start: 150, end: 300, loss: 0.0, event: "Suvsiz CrCl₃ barqaror", color: "#f59e0b", aasEffect: "Cr signal o'zgarmaydi" },
    { start: 300, end: 500, loss: 39.9, event: "Cl₂ yo'qolishi", color: "#ef4444", aasEffect: "Cr₂O₃ qoldig'i" },
    { start: 500, end: 900, loss: 0.0, event: "Cr₂O₃ qoldig'i", color: "#8b5cf6", aasEffect: "Gravimetriya: 19.5% Cr" }
  ],

  relatedMethods: [
    { name: "EPR spektroskopiya", role: "Cr³⁺ (d³) — kuchli EPR signali (g ≈ 1.98), oltita chiziq", aasAdvantage: "EPR Cr³⁺ ni Cr(VI) dan aniq farqlaydi, simmetriyani ko'rsatadi", aasDisadvantage: "AAS oksidlanish holatini farqlay olmaydi", complementarity: "95%" },
    { name: "UV-Vis spektroskopiya", role: "d-d o'tishlar: ⁴A₂g → ⁴T₂g (405 nm, binafsha) va ⁴A₂g → ⁴T₁g (575 nm, yashil)", aasAdvantage: "UV-Vis tez va eritmada bajariladi", aasDisadvantage: "Miqdoriy emas — faqat sifat", complementarity: "92%" },
    { name: "EA (Element Analiz)", role: "H (4.54%) va O (36.03%) — 6H₂O ni tasdiqlaydi", aasAdvantage: "EA gidrat sonini, AAS metallni o'lchaydi", aasDisadvantage: "Birgalikda to'liq formula", complementarity: "96%" },
    { name: "ICP-OES", role: "Cr ko'p elementli tahlil — matritsa effekti yo'q", aasAdvantage: "ICP-OES refrakter effektlarga chidamli (plazma 6000-10000 K)", aasDisadvantage: "Qimmatroq, ko'p namuna talab qiladi", complementarity: "98%" },
    { name: "TGA (Termogravimetriya)", role: "6H₂O ni aniq o'lchaydi (40.6% yo'qotish 100-150°C da)", aasAdvantage: "TGA gidrat holatini, AAS metall foizini tasdiqlaydi", aasDisadvantage: "Birgalikda to'liq validatsiya", complementarity: "94%" },
    { name: "Konduktometriya", role: "1:3 elektrolit (Λ_M ≈ 400-450 S·cm²/mol)", aasAdvantage: "Konduktometriya [Cr(H₂O)₆]³⁺ va 3Cl⁻ ni tasdiqlaydi", aasDisadvantage: "AAS faqat metallni o'lchaydi", complementarity: "85%" }
  ],

  // Cr³⁺ ning inertligi — muhim kimyoviy xususiyat
  kineticInertness: {
    title: "Cr³⁺ — kinetik inert (d³ t₂g³)",
    description: "Cr³⁺ ning 3 ta elektroni t₂g orbitallarida joylashgan (t₂g³ e_g⁰). Bu konfiguratsiya juda barqaror va ligand almashinishini sekinlashtiradi.",
    comparison: [
      { ion: "Cr³⁺ (d³)", config: "t₂g³", exchange: "~ soatlar", magnetic: "Paramagnit (3 ta toq e⁻)" },
      { ion: "Fe²⁺ (d⁶ HS)", config: "t₂g⁴ e_g²", exchange: "~ millisekundlar", magnetic: "Paramagnit (4 ta toq e⁻)" },
      { ion: "Co³⁺ (d⁶ LS)", config: "t₂g⁶", exchange: "~ kunlar", magnetic: "Diamagnit" },
      { ion: "Ni²⁺ (d⁸)", config: "t₂g⁶ e_g²", exchange: "~ soniyalar", magnetic: "Paramagnit (2 ta toq e⁻)" }
    ]
  }
}

function calculateCrPercent(absorbance, sampleMass, dilutionFactor) {
  const slope = 0.1092  // A = 0.1092 × C (mg/L), R² = 0.9997
  const conc_mgL = absorbance / slope
  const totalVolume = 100
  const Cr_mass_mg = conc_mgL * totalVolume * dilutionFactor / 1000
  const Cr_percent = (Cr_mass_mg / sampleMass) * 100
  return {
    conc: parseFloat(conc_mgL.toFixed(3)),
    Cr_mass: parseFloat(Cr_mass_mg.toFixed(3)),
    Cr_percent: parseFloat(Cr_percent.toFixed(2))
  }
}

export default function CrH2O6Cl3Page() {
  const [activeRun, setActiveRun] = useState("AAS-24-201")
  const [customAbsorbance, setCustomAbsorbance] = useState(0.215)
  const [customMass, setCustomMass] = useState(20.0)
  const [dilutionFactor, setDilutionFactor] = useState(10)
  const [selectedInterference, setSelectedInterference] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showCalibrationModal, setShowCalibrationModal] = useState(false)
  const [flameType, setFlameType] = useState("N2O-C2H2")

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const deltaCr = Math.abs(run.Cr_percent - COMPOUND.theoretical.Cr.percent)
  const statusColor = deltaCr <= 0.5 ? "text-green-400" : deltaCr <= 1.5 ? "text-yellow-400" : "text-red-400"

  const calcResult = useMemo(() => 
    calculateCrPercent(customAbsorbance, customMass, dilutionFactor),
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
            <span className="text-violet-400 font-semibold">[Cr(H₂O)₆]Cl₃</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-violet-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-orange-600 px-2 py-1 rounded ml-2">🔥 N₂O-C₂H₂</span>
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
                <span className="px-2 py-1 rounded bg-violet-900/30 border border-violet-700/50 text-violet-400 text-[10px] uppercase tracking-wide">Cr³⁺ d³ t₂g³</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide animate-pulse">⚠ Refrakter!</span>
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">λ = 357.9 nm</span>
                <span className="px-2 py-1 rounded bg-indigo-900/30 border border-indigo-700/50 text-indigo-400 text-[10px] uppercase tracking-wide">Kinetik Inert</span>
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
        <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (AAS uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Cr(H₂O)₆]Cl₃</strong> — xrom(III) ning geksaakva kompleksi, kinetik inert (d³ t₂g³). AAS tahlilida <strong className="text-violet-300">eng qiyin birikma</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-violet-500 text-xs md:text-sm">
                <li>Cr³⁺ <strong className="text-red-300">refrakter element</strong> — Cr₂O₃ barqaror oksid</li>
                <li>Odatiy Havo-C₂H₂ alangasida <strong className="text-red-300">signal 2-3× past</strong></li>
                <li><strong className="text-orange-300">N₂O-C₂H₂ (~2900°C)</strong> alangasi ZARUR</li>
                <li>Nazariy <strong className="text-white">%Cr = 19.52%</strong> — yuqori</li>
                <li>6H₂O <strong className="text-white">koordinatsion</strong> — tashqi sfera suvlari yo'q</li>
                <li>AAS Cr³⁺ va Cr(VI) ni <strong className="text-red-300">farqlay olmaydi</strong></li>
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

        {/* 1b. REFRAKTER TABIAT - ENG MUHIM */}
        <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔥</span> {COMPOUND.refractoryNature.title}
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            {COMPOUND.refractoryNature.description}
          </p>

          <div className="bg-red-900/30 rounded-xl p-5 border border-red-700/50 mb-4">
            <h3 className="text-red-300 font-bold text-sm mb-3">⚠ Muammo:</h3>
            <p className="text-xs text-purple-200 mb-3">{COMPOUND.refractoryNature.problem}</p>
            
            <h3 className="text-green-300 font-bold text-sm mb-3">✓ Yechimlar:</h3>
            <div className="space-y-2">
              {COMPOUND.refractoryNature.solution.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-green-400 font-bold shrink-0">#{i+1}</span>
                  <span className="text-purple-200">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {Object.entries(COMPOUND.refractoryNature.temperature).map(([flame, temp]) => (
              <div key={flame} className={`rounded-xl p-4 border ${
                flame.includes("N₂O") ? "bg-green-900/30 border-green-700/50" : 
                flame.includes("GFAAS") ? "bg-blue-900/30 border-blue-700/50" : 
                "bg-red-900/30 border-red-700/50"
              }`}>
                <div className="text-xs text-purple-400 mb-1">{flame}</div>
                <div className={`text-lg font-bold font-mono ${
                  flame.includes("N₂O") ? "text-green-400" : 
                  flame.includes("GFAAS") ? "text-blue-400" : 
                  "text-red-400"
                }`}>{temp}</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-red-200 italic mt-4">
            💡 <strong>Shu sahifada:</strong> Biz <strong className="text-green-300">N₂O-C₂H₂ alangasi</strong>ni ishlatamiz — bu Cr³⁺ uchun eng samarali va keng tarqalgan usul. GFAAS esa ppb darajasida ishlatiladi.
          </p>
        </div>

        {/* 1c. KINETIK INERTLIK */}
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
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.kineticInertness.comparison.map((c, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${c.ion.includes("Cr³⁺") ? 'bg-violet-900/20' : ''}`}>
                    <td className={`py-2 px-3 font-bold ${c.ion.includes("Cr³⁺") ? 'text-violet-400' : 'text-purple-300'}`}>
                      {c.ion} {c.ion.includes("Cr³⁺") && "🎯"}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-yellow-400">{c.config}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={c.exchange.includes("soat") || c.exchange.includes("kun") ? 'text-red-300' : 'text-green-300'}>
                        {c.exchange}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center text-xs">{c.magnetic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-indigo-200 italic mt-3">
            💡 <strong>AAS uchun ahamiyati:</strong> Cr³⁺ ning inertligi namuna tayyorlashda muhim — Cr³⁺ eritmasi uzoq vaqt barqaror, oksidlanish xavfi past.
          </p>
        </div>

        {/* 2. AAS PARAMETRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔬</span> AAS tahlil parametrlari (Cr uchun maxsus)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Cr³⁺ uchun <strong className="text-violet-300">maxsus parametrlar</strong> talab qilinadi — keng yoriq, yuqori tok, N₂O-C₂H₂ alanga. 
            Zeyman fon korreksiyasi Cr ning spektral interferensiyalaridan himoya qiladi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">Element</div>
              <div className="text-lg font-bold text-violet-400">{COMPOUND.aasParameters.element}</div>
              <div className="text-[10px] text-purple-300 mt-1">{COMPOUND.aasParameters.oxidationState}</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">λ (asosiy)</div>
              <div className="text-lg font-mono font-bold text-violet-400">{COMPOUND.aasParameters.lambda.primary} nm</div>
              <div className="text-[10px] text-purple-300 mt-1">Alt: {COMPOUND.aasParameters.lambda.secondary} nm</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-orange-700/30 bg-orange-900/20">
              <div className="text-[10px] text-orange-400 uppercase mb-1">⚠ Alanga</div>
              <div className="text-sm font-bold text-orange-400">N₂O-C₂H₂</div>
              <div className="text-[10px] text-purple-300 mt-1">~2900°C</div>
            </div>
            <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-700/30">
              <div className="text-[10px] text-purple-400 uppercase mb-1">LOD</div>
              <div className="text-lg font-mono font-bold text-green-400">{COMPOUND.aasParameters.lod} mg/L</div>
              <div className="text-[10px] text-purple-300 mt-1">LOQ: {COMPOUND.aasParameters.loq}</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-violet-400 font-bold text-xs uppercase mb-3">Batafsil parametrlar (Cr uchun optimallashtirilgan):</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-purple-400">Katod lampasi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.hclLamp}</div>
              </div>
              <div>
                <div className="text-purple-400">Yoriq kengligi:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.slitWidth} nm (keng)</div>
              </div>
              <div>
                <div className="text-purple-400">Lampa toki:</div>
                <div className="font-mono text-white">{COMPOUND.aasParameters.lampCurrent} mA (yuqori)</div>
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
                <div className="text-purple-400">Modifikator:</div>
                <div className="font-mono text-orange-300">{COMPOUND.aasParameters.modifier}</div>
              </div>
              <div>
                <div className="text-purple-400">Tipik RSD:</div>
                <div className="font-mono text-yellow-300">{COMPOUND.aasParameters.rsd_typical}</div>
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
            AAS <strong className="text-violet-300">faqat Cr</strong> ni o'lchaydi. Boshqa elementlar (H, O, Cl) FAAS da ko'rinmaydi — ularni EA yordamida tekshirish kerak.
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
                    <td className="py-3 pl-2 font-bold text-violet-400">{el}</td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-500 italic">{d.source}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-400">{d.aasSignal}</td>
                  </tr>
                ))}
                <tr className="bg-violet-900/20 font-bold border-t border-violet-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3 text-[10px] text-violet-300">AAS faqat Cr (19.52%) ni o'lchaydi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. KALIBRLASH EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📈</span> Kalibrlash egri chizig'i (Cr, 357.9 nm)
            </h2>
            <button 
              onClick={() => setShowCalibrationModal(true)}
              className="text-xs bg-violet-600 hover:bg-violet-500 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
            >
              📊 To'liq ma'lumotlar
            </button>
          </div>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Cr standartlari <strong className="text-violet-300">NH₄Cl modifikatori</strong> bilan tayyorlanadi va <strong className="text-orange-300">N₂O-C₂H₂ alangasida</strong> o'lchanadi. 
            Lambert-Ber qonuni: <strong className="text-white">A = 0.1092 × C</strong>, R² = 0.9997.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-72">
            <svg viewBox="0 0 500 260" className="w-full h-full overflow-visible">
              {[0, 0.1, 0.2, 0.3, 0.4].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/0.4)*200} x2="480" y2={220 - (v/0.4)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/0.4)*200} textAnchor="end" fontSize="9" fill="#a78bfa">{v.toFixed(1)}</text>
                </g>
              ))}

              {[0, 1, 2, 3].map(c => (
                <g key={c}>
                  <text x={50 + (c/3)*430} y="245" textAnchor="middle" fontSize="9" fill="#a78bfa">{c}</text>
                </g>
              ))}
              <text x="265" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Cr konsentratsiyasi (mg/L)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Yutilish (A)</text>

              <line x1="50" y1="220" x2="480" y2={220 - (0.328/0.4)*200} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

              {COMPOUND.calibrationCurve.map((p, i) => {
                const x = 50 + (p.conc/3)*430
                const y = 220 - (p.absorbance/0.4)*200
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#a855f7" stroke="#fff" strokeWidth="1" />
                    {i > 0 && (
                      <text x={x} y={y-10} textAnchor="middle" fontSize="8" fill="#c084fc">
                        {p.absorbance.toFixed(3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {(() => {
                const x = 50 + (1.98/3)*430
                const y = 220 - (0.215/0.4)*200
                return (
                  <g>
                    <circle cx={x} cy={y} r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <text x={x+10} y={y-5} fontSize="9" fill="#22c55e" fontWeight="bold">
                      Namuna (1.98 mg/L)
                    </text>
                  </g>
                )
              })()}

              <rect x="350" y="30" width="120" height="30" rx="4" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1" />
              <text x="410" y="48" textAnchor="middle" fontSize="10" fill="#c084fc" fontWeight="bold">
                R² = 0.9997
              </text>
            </svg>
          </div>
        </div>

        {/* 5. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> AAS yugurishlari — turli alangalarda
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            <strong className="text-red-300">Diqqat:</strong> AAS-24-206 da <strong>Havo-C₂H₂ alangasi</strong> ishlatilgan — signal 2.5× past! Bu Cr ning refrakter tabiatini ko'rsatadi.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {COMPOUND.experimentalRuns.map(r => {
              const isBlank = r.id.includes("BLANK")
              const isStd = r.id.includes("STD")
              const isBadFlame = r.id === "AAS-24-206"
              return (
                <button 
                  key={r.id}
                  onClick={() => setActiveRun(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    activeRun === r.id 
                      ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20" 
                      : isBlank 
                        ? "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-gray-500"
                        : isStd
                          ? "bg-amber-900/30 border-amber-700/30 text-amber-300 hover:border-amber-500"
                          : isBadFlame
                            ? "bg-red-900/30 border-red-700/30 text-red-300 hover:border-red-500"
                            : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-purple-500"
                  }`}
                >
                  {r.id}
                  {isBadFlame && " ⚠"}
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
                    <span className="font-mono text-violet-400 text-lg">{run.absorbance.toFixed(3)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-violet-900/20 rounded border border-violet-500/20">
                    <span className="text-sm text-violet-400 font-medium">C (mg/L):</span>
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
                    <span className="text-sm text-green-400 font-medium">Eksperimental %Cr:</span>
                    <span className="font-mono text-white text-lg">{run.Cr_percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300">Nazariy %Cr:</span>
                    <span className="font-mono text-violet-400">{COMPOUND.theoretical.Cr.percent.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-purple-800/50 pt-2">
                    <span className="text-sm text-purple-300">Δ (Farq):</span>
                    <span className={`font-mono font-bold ${statusColor}`}>{deltaCr.toFixed(2)}%</span>
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
                  : deltaCr <= 0.5
                    ? "bg-green-900/30 border-green-700/30"
                    : deltaCr <= 1.5
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : deltaCr <= 0.5 ? "text-green-400" : deltaCr <= 1.5 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : deltaCr <= 0.5 ? "✓ Formula tasdiqlandi" : deltaCr <= 1.5 ? "⚠ Chegaraviy" : "✗ Mos emas"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    deltaCr <= 0.5
                      ? "AAS natijasi nazariy %Cr ga to'liq mos keladi. [Cr(H₂O)₆]Cl₃ formulasi tasdiqlandi. N₂O-C₂H₂ alangasi to'g'ri tanlangan."
                      : deltaCr <= 1.5
                        ? "%Cr qiymati nazariyga yaqin. Ehtimol [Cr(H₂O)₅Cl]Cl₂ aralashmasi yoki qisman suvsizlanish bo'lishi mumkin."
                        : run.Cr_percent < 15
                          ? "%Cr juda past — noto'g'ri alanga ishlatilgan yoki namuna parchalangan."
                          : "%Cr yuqori — namuna ifloslangan yoki boshqa Cr kompleksi."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Blank — signal nolga yaqin. Tizim toza."
                      : "NIST standarti — kalibrlash to'g'ri bajarilgan."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-violet-400 mb-4 flex justify-between">
                <span>%Cr Qiymatlari — alanga effekti</span>
                <span className="text-[10px] text-purple-500 font-normal">Target: 19.52%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const isBadFlame = r.id === "AAS-24-206"
                  const val = r.Cr_percent
                  const heightPct = Math.min((val / 25) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(1)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-violet-500/30 z-0" style={{ bottom: `${(19.515/25)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : isBadFlame ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                : 'bg-violet-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : isBadFlame ? 'bg-red-700/40'
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : isBadFlame ? 'text-red-400' : 'text-violet-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-violet-500 rounded"></span> N₂O-C₂H₂ ✓</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Havo-C₂H₂ ✗</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-500 rounded"></span> Blank</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-violet-500/50"></span> Nazariy (19.52%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALIBRATION MODAL */}
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCalibrationModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-violet-400 mb-3 flex items-center gap-2">
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
                        <td className="py-2 px-3 text-violet-400">{p.conc.toFixed(1)}</td>
                        <td className="py-2 px-3">{p.absorbance.toFixed(3)}</td>
                        <td className="py-2 px-3 text-purple-400 font-sans">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-violet-900/20 rounded-lg border border-violet-700/30 text-xs text-purple-200">
                <strong className="text-violet-300">Regressiya:</strong> A = 0.1092 × C + 0.0005, R² = 0.9997
              </div>
              <div className="mt-3 p-3 bg-orange-900/20 rounded-lg border border-orange-700/30 text-xs text-purple-200">
                <strong className="text-orange-300">⚠ Muhim:</strong> Barcha standartlar NH₄Cl modifikatori bilan va N₂O-C₂H₂ alangasida o'lchangan.
              </div>
              <button 
                onClick={() => setShowCalibrationModal(false)}
                className="w-full mt-4 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* 6. INTERFERENSIYALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span> Interferensiyalar (Cr uchun muhim!)
          </h2>
          <p className="text-sm text-purple-200 mb-4 leading-relaxed">
            Cr³⁺ uchun <strong className="text-red-300">refrakter interferensiya</strong> eng jiddiy muammo. Har birini bosib, batafsil ma'lumot oling.
          </p>

          <div className="space-y-2">
            {COMPOUND.interferences.map((int, i) => (
              <button
                key={i}
                onClick={() => setSelectedInterference(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedInterference === i
                    ? "bg-violet-900/40 border-violet-500"
                    : "bg-purple-950/40 border-purple-700/30 hover:border-violet-500/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-violet-400">{int.type}</span>
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
            [Cr(H₂O)₆]Cl₃ da 6H₂O <strong className="text-violet-300">koordinatsion</strong> — 100-150°C da yo'qoladi (40.6%). Bu TGA da aniq ko'rinadi va %Cr ni 19.52% dan 32.85% ga oshiradi.
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
                d="M 50 20 L 150 20 Q 165 20 170 45 L 185 100 Q 190 115 205 115 L 350 115 Q 365 115 375 135 L 415 190 Q 425 200 445 200 L 580 200" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="100" y="15" textAnchor="middle" fill="#10b981">AAS: %Cr = 19.52%</text>
                
                <line x1="185" y1="100" x2="185" y2="220" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="185" y="235" textAnchor="middle" fill="#3b82f6">~125°C</text>
                <text x="205" y="90" fill="#3b82f6">-6H₂O (40.6%)</text>

                <text x="280" y="110" textAnchor="middle" fill="#f59e0b">CrCl₃ barqaror</text>

                <line x1="415" y1="190" x2="415" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="415" y="235" textAnchor="middle" fill="#ef4444">~400°C</text>
                <text x="435" y="180" fill="#ef4444">-Cl₂</text>

                <text x="530" y="195" textAnchor="middle" fill="#8b5cf6">Cr₂O₃ qoldig'i</text>
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
                <div className="text-[10px] text-violet-300 mt-2 italic">AAS effekti: {step.aasEffect}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> AAS ga yaqin tahlil usullari
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Cr(H₂O)₆]Cl₃ uchun AAS ni qo'shimcha usullar bilan birgalikda ishlatish — <strong className="text-violet-300">Cr³⁺ holatini tasdiqlash</strong> uchun muhim. <strong className="text-indigo-300">EPR</strong> eng kuchli qo'shimcha metod.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-violet-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-violet-300">{m.name}</h3>
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

          <div className="mt-5 bg-violet-900/20 border border-violet-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-violet-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">AAS (Cr%) + EPR (Cr³⁺ d³) + UV-Vis (d-d o'tishlar) + EA (H, O) + TGA (6H₂O) + Konduktometriya (1:3)</strong> — oltita metod birgalikda [Cr(H₂O)₆]Cl₃ ni to'liq tasdiqlaydi va uning kinetik inertligini isbotlaydi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> AAS uchun namuna tayyorlash (Cr³⁺ uchun maxsus)
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            Cr³⁺ refrakter element — <strong className="text-orange-300">NH₄Cl modifikatori</strong> qo'shish va <strong className="text-red-300">N₂O-C₂H₂ alangasi</strong> talab qilinadi. Har bir qadamni bosib, tafsilotlarni ko'ring.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-violet-900/40 border-violet-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-violet-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-violet-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-violet-900/20 border border-violet-500/30 rounded-2xl p-6">
          <h3 className="text-violet-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> AAS dan %Cr hisoblash kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan yutilish (A), namuna massasi va suyuqlantirish faktori bo'yicha <strong className="text-violet-300">%Cr</strong> ni avtomatik hisoblang.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Yutilish (A, 357.9 nm):</label>
              <input 
                type="number" step="0.001" value={customAbsorbance}
                onChange={(e) => setCustomAbsorbance(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Namuna massasi (mg):</label>
              <input 
                type="number" step="0.1" value={customMass}
                onChange={(e) => setCustomMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Suyultirish faktori:</label>
              <input 
                type="number" step="1" value={dilutionFactor}
                onChange={(e) => setDilutionFactor(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Konsentratsiya:</div>
                <div className="text-2xl font-mono font-bold text-violet-400">{calcResult.conc} mg/L</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Cr massasi:</div>
                <div className="text-2xl font-mono font-bold text-orange-400">{calcResult.Cr_mass} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">%Cr:</div>
                <div className={`text-2xl font-mono font-bold ${Math.abs(calcResult.Cr_percent - 19.52) <= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcResult.Cr_percent}%
                </div>
              </div>
            </div>
            <p className="text-xs text-purple-300 mt-3 font-mono">
              Formula: %Cr = (A / 0.1092) × 100 × DF / (m × 1000) × 100
            </p>
          </div>
        </div>

        {/* 11. AAS CHEKLOVLARI */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> AAS ning Cr³⁺ uchun cheklovlari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                AAS [Cr(H₂O)₆]Cl₃ ni tahlil qilishda bir nechta muhim cheklovlarga ega:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li><strong className="text-red-300">Refrakter element</strong> — maxsus N₂O-C₂H₂ alanga talab</li>
                <li><strong className="text-red-300">Cr³⁺ va Cr(VI) ni farqlay olmaydi</strong> — EPR kerak</li>
                <li><strong className="text-red-300">Faqat Cr ni o'lchaydi</strong> — H, O, Cl uchun EA kerak</li>
                <li><strong className="text-red-300">Gidrat soni ko'rinmaydi</strong> — TGA kerak</li>
                <li><strong className="text-red-300">Spektral interferensiyalar</strong> (Fe 358.1 nm)</li>
                <li><strong className="text-red-300">Kinetik inertlikni bilmaydi</strong> — ligand almashinish tezligi</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun <strong>[Cr(H₂O)₆]Cl₃ ni to'liq tasdiqlash</strong> uchun kamida 5-6 ta metodni birlashtirish kerak.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-violet-400 font-bold text-xs uppercase mb-3">To'liq tahlil rejasi:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">1. AAS (Cr%)</span>
                  <span className="text-violet-400 font-mono">19.52%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">2. EA (H, O)</span>
                  <span className="text-violet-400 font-mono">4.54% H, 36.03% O</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">3. TGA (6H₂O)</span>
                  <span className="text-violet-400 font-mono">40.6% (100-150°C)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">4. EPR (Cr³⁺)</span>
                  <span className="text-violet-400 font-mono">g ≈ 1.98</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">5. UV-Vis (d-d)</span>
                  <span className="text-violet-400 font-mono">405, 575 nm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">6. Konduktometriya</span>
                  <span className="text-violet-400 font-mono">1:3 elektrolit</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-green-900/20 rounded border border-green-700/30 text-green-200 text-[10px]">
                ✓ 6 ta metod birgalikda formulani to'liq tasdiqlaydi
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
              <p className="text-xs text-purple-200">Cr ni 19.52% aniqlikda o'lchaydi (N₂O-C₂H₂ da). Matritsa effektlari NH₄Cl bilan bartaraf etiladi.</p>
            </div>
            <div className="bg-red-950/30 p-4 rounded-lg border border-red-700/30">
              <div className="text-red-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Asosiy cheklov</h3>
              <p className="text-xs text-purple-200"><strong className="text-red-300">Refrakter element!</strong> Havo-C₂H₂ da signal 2-3× past. N₂O-C₂H₂ yoki GFAAS zarur. Cr³⁺/Cr(VI) farqlanmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">EPR (Cr³⁺), UV-Vis (d-d), EA (H, O), TGA (6H₂O), Konduktometriya (1:3) — to'liq validatsiya uchun.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/aas" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← AAS metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/aas/birikmalar" className="text-sm bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Cr(H₂O)₆]Cl₃ • AAS moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, IUPAC, Walsh (1955), Werner (1893)</p>
        </div>
      </footer>
    </main>
  )
}