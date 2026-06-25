"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Co(NH₃)₆]Cl₃ — ELEMENT ANALIZI (EA) MAHSUS SAHIFASI
// Manbalar: IUPAC Atomic Weights 2021, Vogel's Quantitative Chemical Analysis
// Xususiyat: Yuqori N%, C/S/O YO'Q, Halogen deteksiyasi cheklovi, Werner tarixi
// Maqsad: Faqat EA tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Co: 58.933, Cl: 35.450, N: 14.007, H: 1.008,
  C: 12.011, O: 15.999, S: 32.065  // C, O, S — faqat blank/limit
}

const AMMONIA_MOLAR_MASS = ATOMIC_MASSES.N + 3 * ATOMIC_MASSES.H  // 17.031

const COMPOUND = {
  formulaHTML: "[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>",
  formulaPlain: "[Co(NH3)6]Cl3",
  iupac: "Geksaamminkobalt(III) xlorid",
  molarMass: 267.469,
  casNumber: "14695-95-5",
  color: "to'q sariq (luteo) kristallar",
  stability: "kinetik inert (Co³⁺ d⁶ low-spin, t₂g⁶), havoda barqaror, ammo yorug'likda asta-sekin fotodegradatsiya",
  
  historicalFact: {
    title: "Werner-Jørgensen nizolar va Koordinatsiya nazariyasi g'alabasi",
    text: "[Co(NH₃)₆]Cl₃ — tarixiy 'Luteo kobalt tuzi' deb atalgan va 1890-yillarda Sophus Jørgensen va Alfred Werner o'rtasidagi mashhur nizo markazi bo'lgan. Jørgensen barcha 3 Cl⁻ ham bog'langan deb hisoblagan (zanjir nazariyasi), Werner esa faqat tashqi sfera Cl⁻ ekanligini va [Co(NH₃)₆]³⁺ kompleks ionini hosil qilishini taklif qilgan. EA natijalari (yuqori N%, organik fragment yo'qligi) va konduktometriya (1:3 elektrolit) Werner g'olib chiqqanini tasdiqladi. Werner bu kashfiyot uchun 1913-yilda Kimyo bo'yicha Nobel mukofotini oldi — bu EA ning tarixdagi eng muhim qo'llanilishlaridan biri.",
    year: "1893-1913"
  },

  // Koordinatsion turlari
  ligandTypes: [
    { type: "Koordinatsion NH₃", count: 6, role: "Co³⁺ markaziga oktaedr geometriyada bog'langan (d²sp³ gibridlanish)", eaImpact: "N kanalida juda kuchli signal (31.42%) — EA ning asosiy mezoni", lossTemp: "200-300°C" },
    { type: "Tashqi sfera Cl⁻", count: 3, role: "Ion bog'lar orqali [Co(NH₃)₆]³⁺ bilan bog'langan", eaImpact: "Standart CHNS-O da detektlanmaydi (Schöniger usuli kerak)", lossTemp: ">350°C (Cl₂ ↑)" },
    { type: "Kristall suv", count: 0, role: "Panjarada suv yo'q (anhidrous)", eaImpact: "H kanaliga ta'sir yo'q — toza N/H tahlili mumkin", lossTemp: "—" }
  ],
  
  theoretical: {
    C:  { atoms: 0, mass: 0.000,   percent: 0.000,  source: "Organik fragment yo'q", eaChannel: "Shovqin tekshirish" },
    H:  { atoms: 18, mass: 18.144, percent: 6.784,  source: "6×koordinatsion NH₃", eaChannel: "Kritik kanal (NH₃ soni)" },
    N:  { atoms: 6, mass: 84.042,  percent: 31.422, source: "6×koordinatsion NH₃", eaChannel: "Juda yuqori signal (asosiy mezon)" },
    S:  { atoms: 0, mass: 0.000,   percent: 0.000,  source: "Sulfur guruhi yo'q", eaChannel: "Shovqin tekshirish" },
    O:  { atoms: 0, mass: 0.000,   percent: 0.000,  source: "Kislorod guruhi yo'q", eaChannel: "Shovqin tekshirish" },
    Co: { atoms: 1, mass: 58.933,  percent: 22.034, source: "Markaziy Co³⁺ atomi", eaChannel: "Yoqilg'ida qoldiq (ICP kerak)" },
    Cl: { atoms: 3, mass: 106.350, percent: 39.761, source: "Tashqi sfera Cl⁻", eaChannel: "CHNS-O da detektlanmaydi" }
  },

  experimentalRuns: [
    { id: "EA-24-155", date: "2024-08-10", method: "CHNS-O FlashSmart", C: 0.01, H: 6.76, N: 31.38, S: 0.02, recovery: 38.2, note: "Toza, yangi sintez qilingan luteo tuz" },
    { id: "EA-24-156", date: "2024-08-10", method: "CHNS-O FlashSmart", C: 0.02, H: 6.80, N: 31.45, S: 0.01, recovery: 38.3, note: "Standart sharoit" },
    { id: "EA-24-157", date: "2024-08-11", method: "CHNS-O Vario EL",    C: 0.03, H: 6.52, N: 30.85, S: 0.02, recovery: 37.4, note: "2 hafta yorug'likda qolgan (fotodegradatsiya)" },
    { id: "EA-24-158", date: "2024-08-11", method: "CHNS-O FlashSmart", C: 0.01, H: 6.38, N: 29.70, S: 0.01, recovery: 36.1, note: "1 oy havoda — qisman NH₃ yo'qotgan" },
    { id: "EA-24-159", date: "2024-08-12", method: "CHNS-O FlashSmart", C: 5.20, H: 6.78, N: 31.40, S: 0.03, recovery: 43.4, note: "Kapsula ifloslangan (C chiqdi — ogohlantirish!)" },
    { id: "EA-24-160", date: "2024-08-12", method: "CHNS-O FlashSmart", C: 0.02, H: 5.65, N: 30.20, S: 0.02, recovery: 35.9, note: "[Co(NH₃)₅Cl]Cl₂ aralashmasi (purpureo)" },
    { id: "BLANK-05",  date: "2024-08-10", method: "Blank (Empty Capsule)", C: 0.00, H: 0.02, N: 0.01, S: 0.00, recovery: 0.0, note: "Tizim tozaligi" },
    { id: "STD-SULFA", date: "2024-08-10", method: "Standard: Sulfanilamide", C: 41.82, H: 4.69, N: 16.28, S: 18.51, recovery: 99.9, note: "NIST kalibrlash standarti" }
  ],

  tgaSteps: [
    { start: 25, end: 180, loss: 0.0,  event: "Barqaror zona (kinetik inert)", color: "#10b981", eaCorrelation: "H va N signallari barqaror" },
    { start: 180, end: 250, loss: 19.0, event: "2-3 NH₃ yo'qolishi (Deaminatsiya I)", color: "#8b5cf6", eaCorrelation: "N: 31.42% → 21.00%" },
    { start: 250, end: 320, loss: 19.0, event: "Qolgan 3-4 NH₃ yo'qolishi (II)", color: "#8b5cf6", eaCorrelation: "N: 21.00% → 0%" },
    { start: 320, end: 500, loss: 0.0,  event: "CoCl₂ qoldig'i (suyak)", color: "#f59e0b", eaCorrelation: "N=0%, H=0%" },
    { start: 500, end: 750, loss: 26.5, event: "CoCl₂ parchalanishi (Co + Cl₂ ↑)", color: "#ef4444", eaCorrelation: "Qoldiq faqat Co metali" }
  ],

  relatedMethods: [
    { name: "Konduktometriya", role: "1:3 elektrolit — [Co(NH₃)₆]³⁺ + 3Cl⁻ ionlar soni", eaAdvantage: "Werner nazariyasining asosiy isboti", eaDisadvantage: "Elementar tarkib bermaydi", complementarity: "95%" },
    { name: "UV-Vis spektroskopiya", role: "d-d o'tishlar (¹A₁_g → ¹T₁_g va ¹A₁_g → ¹T₂_g)", eaAdvantage: "Co³⁺ oktaedr geometriyasini tasdiqlaydi", eaDisadvantage: "NH₃ sonini miqdoriy bermaydi", complementarity: "90%" },
    { name: "IQ spektroskopiya", role: "N-H tebranishlari (3300-3150 cm⁻¹), Co-N bog'i (250-400 cm⁻¹)", eaAdvantage: "NH₃ koordinatsiyasini tasdiqlaydi", eaDisadvantage: "6 ta NH₃ ni aniqlay olmaydi", complementarity: "88%" },
    { name: "Schöniger usuli (halogen)", role: "Kolbadagi yoqish + AgNO₃ titrlash orqali Cl%", eaAdvantage: "Cl% ni aniq miqdoriy beradi", eaDisadvantage: "NH₃ va Co ni o'lchamaydi", complementarity: "92%" },
    { name: "ICP-OES / AAS", role: "Co miqdorini ppb darajasida o'lchaydi", eaAdvantage: "Metall tarkibini to'g'ridan-to'g'ri beradi", eaDisadvantage: "Ligandlarni o'lchamaydi", complementarity: "85%" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tanlash", desc: "To'q sariq (luteo) kristallar. Binafsha (purpureo [Co(NH₃)₅Cl]Cl₂) yoki qizil (roseo) aralashmalardan saqlanish kerak — ularning N% boshqacha.", time: "1 daq", critical: true },
    { step: 2, title: "Yorug'likdan himoya", desc: "Qorong'i yoki past yorug'lik sharoitida tayyorlanadi. Co(III) amminlar fotolabil — UV yorug'ligida NH₃ yo'qotadi.", time: "doimiy", critical: true },
    { step: 3, title: "Yengil maydalash", desc: "Aqiq hovonchada yengil eziladi. Issiqlik chiqarmaslik kerak — inert bo'lsa ham.", time: "1-2 daq", critical: false },
    { step: 4, title: "Qalay kapsulaga joylash", desc: "5×9mm Sn kapsulaga 2.5-4.0 mg namuna tortiladi (mikro-tarozida).", time: "3 daq", critical: true },
    { step: 5, title: "Zich yopish", desc: "Kapsula 10 soniya ichida yopiladi — namlik yutilishi oldini olish uchun.", time: "10 son", critical: true },
    { step: 6, title: "Analizatorga kiritish", desc: "Standart sharoitda analiz qilinadi. Kinetik inert bo'lgani uchun tez ishlash shart emas.", time: "5-8 daq (analiz)", critical: false }
  ],

  combustionPrinciple: {
    oxidationTemp: "1050°C",
    reductionTemp: "650°C (Cu)",
    products: {
      C: "CO₂ (TCD detektori)",
      H: "H₂O (TCD detektori)",
      N: "N₂ (TCD detektori)",
      S: "SO₂ (TCD detektori)",
      Cl: "HCl (CHNS-O da detektlanmaydi, Schöniger kerak)",
      Co: "Co₃O₄/Co (qattiq qoldiq)"
    },
    equations: [
      { reactant: "[Co(NH₃)₆]Cl₃", process: "+ O₂ (1050°C)", products: "Co₃O₄ (qattiq) + 3N₂ + 9H₂O + 3HCl + Cl₂" },
      { reactant: "NH₃ (6×ligand)", process: "→ O₂", products: "3N₂ (gaz) + 9H₂O (TCD detektlaydi)" },
      { reactant: "Co³⁺", process: "Kamerasida qoldiq", products: "Co₃O₄ — ICP-OES bilan tasdiqlanadi" }
    ]
  }
}

// Yordamchi: m ta NH₃ uchun nazariy %H, %N hisoblash
function calculateAmmoniateProperties(m) {
  const anhydrousMass = ATOMIC_MASSES.Co + 3 * ATOMIC_MASSES.Cl // 165.283 (CoCl₃)
  const ammoniaMass = m * AMMONIA_MOLAR_MASS
  const total = anhydrousMass + ammoniaMass
  const hMass = m * 3 * ATOMIC_MASSES.H
  const nMass = m * ATOMIC_MASSES.N
  const coMass = ATOMIC_MASSES.Co
  const clMass = 3 * ATOMIC_MASSES.Cl
  return {
    total: parseFloat(total.toFixed(3)),
    H_pct: parseFloat(((hMass / total) * 100).toFixed(3)),
    N_pct: parseFloat(((nMass / total) * 100).toFixed(3)),
    Co_pct: parseFloat(((coMass / total) * 100).toFixed(3)),
    Cl_pct: parseFloat(((clMass / total) * 100).toFixed(3)),
    ammoniaPct: parseFloat(((ammoniaMass / total) * 100).toFixed(2))
  }
}

export default function CoNH36Cl3Page() {
  const [activeRun, setActiveRun] = useState("EA-24-155")
  const [ammoniaM, setAmmoniaM] = useState(6)
  const [customN, setCustomN] = useState(31.42)
  const [selectedLigandType, setSelectedLigandType] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)

  const calc = useMemo(() => calculateAmmoniateProperties(ammoniaM), [ammoniaM])

  const allAmmoniates = useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(m => ({
      m,
      ...calculateAmmoniateProperties(m),
      name: m === 0 ? "CoCl₃" : m === 1 ? "Monoammin" : m === 4 ? "Tetraammin" : m === 5 ? "Pentaammin" : m === 6 ? "Geksaammin ✓" : m === 7 ? "Geptaammin" : `${m}-Ammin`
    }))
  }, [])

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const dH = Math.abs(run.H - COMPOUND.theoretical.H.percent)
  const dN = Math.abs(run.N - COMPOUND.theoretical.N.percent)
  const statusColor = (dN <= 0.3 && dH <= 0.3) ? "text-green-400" : (dN <= 0.8 && dH <= 0.5) ? "text-yellow-400" : "text-red-400"

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
            <Link href="/ilmiy/tahlil/element-analiz" className="hover:text-purple-300">Element Analiz (EA)</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
            <span className="text-purple-600">›</span>
            <span className="text-orange-400 font-semibold">[Co(NH₃)₆]Cl₃</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-orange-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                {COMPOUND.iupac} • M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
              </p>
              <p className="text-purple-500 text-xs mt-1">
                {COMPOUND.color} • {COMPOUND.stability}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Kinetik Inert</span>
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">C/S/O YO'Q</span>
                <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Yuqori N% (31.4%)</span>
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Werner Nobel 1913</span>
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
        <div className="bg-gradient-to-r from-orange-900/40 to-purple-900/40 border border-orange-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (EA uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Co(NH₃)₆]Cl₃</strong> — kobalt(III) ning ammiakli kompleksi bo'lib, unda 6 ta NH₃ ligandi Co³⁺ ioniga oktaedr geometriyada bog'langan, 3 ta Cl⁻ esa tashqi sferada joylashgan. EA tahlilida <strong className="text-orange-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-orange-500 text-xs md:text-sm">
                <li>Tarkibida <strong className="text-white">C, S va O mutlaqo yo'q</strong> — bu EA da toza "N va H tahlili" imkonini beradi</li>
                <li><strong className="text-white">31.4% azot</strong> — EA uchun juda yuqori signal, NH₃ sonini aniq o'lchash mumkin</li>
                <li>18 ta H atomi <strong className="text-white">faqat NH₃ ligandlarida</strong> — gidrat suvi yo'q</li>
                <li>Kinetik inert (Co³⁺ d⁶ low-spin) — havoda barqaror, namuna tayyorlash oson</li>
                <li>Cl — <strong className="text-white">halogen</strong>, standart CHNS-O da detektlanmaydi (alohida Schöniger kerak)</li>
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

        {/* 2. EA PRINSIPI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔥</span> EA ning ishlash prinsipi — CHNS-O analizatori
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            Namunani yuqori haroratda kislorod ishtirokida yoqish orqali har bir element gaz holatiga o'tkaziladi. [Co(NH₃)₆]Cl₃ uchun <strong className="text-orange-300">6 ta NH₃ ning 3N₂ ga aylanishi</strong> asosiy diagnostik hodisa hisoblanadi. Cl esa HCl sifatida chiqadi, lekin standart TCD detektori buni qayd etmaydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">1. Yoqish kamerasi</div>
              <div className="text-2xl font-mono text-orange-400">{COMPOUND.combustionPrinciple.oxidationTemp}</div>
              <div className="text-xs text-purple-300 mt-2">O₂ + 1050°C — NH₃ → N₂ + H₂O</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">2. Reduksiya kamerasi</div>
              <div className="text-2xl font-mono text-red-400">{COMPOUND.combustionPrinciple.reductionTemp}</div>
              <div className="text-xs text-purple-300 mt-2">Cu — NOₓ larni N₂ ga aylantiradi</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">3. Deteksiya</div>
              <div className="text-2xl font-mono text-blue-400">TCD</div>
              <div className="text-xs text-purple-300 mt-2">N₂ va H₂O signallari</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-orange-400 font-bold text-xs uppercase mb-3">Bu birikma uchun yoqish reaksiyalari:</h3>
            <div className="space-y-3 font-mono text-xs">
              {COMPOUND.combustionPrinciple.equations.map((eq, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-purple-900/30 rounded border-l-4 border-orange-500">
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
            <span>📐</span> Nazariy element tarkibi (CHNS-O + Co + Cl)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            E'tibor bering: <strong className="text-orange-300">C, S va O 0%</strong> — bu EA uchun noyob holat. Cl va Co esa detektlanmaydi.
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
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => (
                  <tr key={el} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
                    <td className="py-3 pl-2 font-bold text-orange-400">{el}</td>
                    <td className="py-3 text-center font-mono">{d.atoms}</td>
                    <td className="py-3 text-center font-mono text-xs opacity-70">
                      {ATOMIC_MASSES[el]?.toFixed(3) || "—"}
                    </td>
                    <td className="py-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-3 text-center text-[10px] text-purple-400">{d.eaChannel}</td>
                    <td className="py-3 pl-4 text-[10px] text-purple-500 italic">{d.source}</td>
                  </tr>
                ))}
                <tr className="bg-orange-900/20 font-bold border-t border-orange-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center text-white">28</td>
                  <td className="py-3"></td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. AMMIAKAT SIMULYATSIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🧬</span> Ammiakat holati simulyatsiyasi
            </h2>
            <span className="text-xs text-orange-400 bg-orange-950/50 px-3 py-1 rounded border border-orange-700/30">
              m (NH₃) = {ammoniaM}
            </span>
          </div>

          <p className="text-sm text-purple-300 mb-6">
            Koordinatsion NH₃ soni (m) o'zgarganda <strong className="text-yellow-300">%N va %H</strong> chiziqli o'zgaradi. [Co(NH₃)₆]Cl₃ da N% 31.4% ga yetadi — bu EA ning sezgirlik chegarasida juda aniq o'lchanadi. Slider yordamida barcha ammiakatlarni sinab ko'ring.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-purple-950/60 p-6 rounded-xl border border-purple-700/30">
                <label className="block text-xs text-purple-400 mb-2">Koordinatsion NH₃ soni (m):</label>
                <input 
                  type="range" min="0" max="7" step="1" 
                  value={ammoniaM} 
                  onChange={(e) => setAmmoniaM(Number(e.target.value))}
                  className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-orange-500 mb-2"
                />
                <div className="flex justify-between text-xs font-mono text-purple-500 mb-6">
                  <span>0 (CoCl₃)</span>
                  <span>3 (triamm.)</span>
                  <span>6 (geksa ✓)</span>
                  <span>7</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">Mol. massa</div>
                    <div className="text-xl font-mono text-white mt-1">{calc.total} <span className="text-xs text-purple-500">g/mol</span></div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-orange-400 uppercase">NH₃ ulushi</div>
                    <div className="text-xl font-mono text-orange-400 mt-1">{calc.ammoniaPct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">%H</div>
                    <div className="text-xl font-mono text-green-400 mt-1">{calc.H_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">%N</div>
                    <div className="text-xl font-mono text-yellow-400 mt-1">{calc.N_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">%Co</div>
                    <div className="text-xl font-mono text-red-400 mt-1">{calc.Co_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">%Cl</div>
                    <div className="text-xl font-mono text-cyan-400 mt-1">{calc.Cl_pct}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                <h3 className="text-orange-400 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                  <span>🧩</span> Ligand turlari
                </h3>
                <div className="space-y-2">
                  {COMPOUND.ligandTypes.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedLigandType(i)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedLigandType === i 
                          ? "bg-orange-900/40 border-orange-500" 
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
                          <div>🌡️ TGA yo'qotish: {w.lossTemp}</div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80 flex items-end justify-center">
              <svg viewBox="0 0 400 240" className="w-full h-full overflow-visible">
                {[0, 5, 10, 15, 20, 25, 30, 35].map(v => (
                  <g key={v}>
                    <line x1="40" y1={210 - (v/35)*180} x2="380" y2={210 - (v/35)*180} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="3,3" />
                    <text x="35" y={214 - (v/35)*180} textAnchor="end" fontSize="9" fill="#a78bfa">{v}%</text>
                  </g>
                ))}
                
                {/* Nazariy chiziq (m=6) - %N uchun */}
                {(() => {
                  const targetN = 31.422
                  const y = 210 - (targetN/35) * 180
                  return (
                    <g>
                      <line x1="40" y1={y} x2="380" y2={y} stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,3" />
                      <text x="385" y={y+3} fontSize="8" fill="#fbbf24">m=6 (naz.)</text>
                    </g>
                  )
                })()}

                {/* Trend Line — %N vs m */}
                <polyline 
                  fill="none" stroke="#f97316" strokeWidth="2.5" opacity="0.7"
                  points={[0,1,2,3,4,5,6,7].map(m => {
                    const props = calculateAmmoniateProperties(m)
                    const x = 40 + (m/7) * 340
                    const y = 210 - (props.N_pct / 35) * 180
                    return `${x},${y}`
                  }).join(" ")}
                />

                {[0,1,2,3,4,5,6,7].map(m => {
                  const props = calculateAmmoniateProperties(m)
                  const x = 40 + (m/7) * 340
                  const y = 210 - (props.N_pct / 35) * 180
                  const isActive = m === ammoniaM
                  return (
                    <g key={m} style={{ cursor: 'pointer' }} onClick={() => setAmmoniaM(m)}>
                      <circle cx={x} cy={y} r={isActive ? 7 : 4} 
                        fill={isActive ? "#fbbf24" : "#f97316"} 
                        stroke={isActive ? "#fff" : "#f97316"} 
                        strokeWidth={isActive ? 2 : 1} />
                      {isActive && (
                        <>
                          <line x1={x} y1={y} x2={x} y2="210" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
                          <rect x={x-34} y={y-32} width="68" height="22" rx="4" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1" />
                          <text x={x} y={y-17} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">%N: {props.N_pct.toFixed(2)}</text>
                        </>
                      )}
                    </g>
                  )
                })}

                <line x1="40" y1="210" x2="380" y2="210" stroke="#a78bfa" strokeWidth="1" />
                {[0,1,2,3,4,5,6,7].map(m => (
                  <text 
                    key={m} 
                    x={40 + (m/7)*340} 
                    y="225" 
                    textAnchor="middle" 
                    fontSize="10" 
                    fill={m===ammoniaM ? "#fbbf24" : "#64748b"} 
                    fontWeight={m===ammoniaM ? "bold" : "normal"}
                  >
                    m={m}
                  </text>
                ))}
                <text x="210" y="238" textAnchor="middle" fontSize="9" fill="#a78bfa">Koordinatsion NH₃ soni (m) | CoCl₃ asosida</text>
              </svg>
            </div>
          </div>
        </div>

        {/* 5. AMMIAKATLAR TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>📊</span> Barcha kobalt(III) ammiakatlari taqqoslanmasi
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            NH₃ soni o'zgarganda EA natijalari qanday o'zgaradi? CoCl₃ asosidagi barcha mumkin bo'lgan ammiakatlar.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 uppercase tracking-wider">
                  <th className="py-2 text-left pl-2">Ammin</th>
                  <th className="py-2 text-center">M (g/mol)</th>
                  <th className="py-2 text-center text-yellow-400">%N</th>
                  <th className="py-2 text-center text-green-400">%H</th>
                  <th className="py-2 text-center text-red-400">%Co</th>
                  <th className="py-2 text-center text-cyan-400">%Cl</th>
                  <th className="py-2 text-center">NH₃ %</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {allAmmoniates.map(a => {
                  const isTarget = a.m === 6
                  const isCurrent = a.m === ammoniaM
                  return (
                    <tr 
                      key={a.m}
                      onClick={() => setAmmoniaM(a.m)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-orange-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-orange-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {a.name}
                      </td>
                      <td className="py-2 text-center font-mono">{a.total}</td>
                      <td className="py-2 text-center font-mono text-yellow-400 font-bold">{a.N_pct}</td>
                      <td className="py-2 text-center font-mono text-green-400">{a.H_pct}</td>
                      <td className="py-2 text-center font-mono text-red-400">{a.Co_pct}</td>
                      <td className="py-2 text-center font-mono text-cyan-400">{a.Cl_pct}</td>
                      <td className="py-2 text-center font-mono text-orange-400">{a.ammoniaPct}</td>
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

        {/* 6. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> Laboratoriya natijalari — yugurishlar
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan EA yugurishlari. E'tibor bering: <strong className="text-orange-300">Recovery ~38%</strong> — bu normal, chunki Cl (39.8%) va Co (22%) detektlanmaydi!
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
                <div className="text-xs text-purple-500 uppercase tracking-wider mb-1">Protokol ID</div>
                <div className="text-xl font-bold text-white font-mono">{run.id}</div>
                <div className="text-xs text-purple-400 mt-1">{run.date} • {run.method}</div>
                <div className="text-xs text-purple-300 italic mt-2 border-t border-purple-800/50 pt-2">
                  📝 {run.note}
                </div>
                
                <div className="my-4 border-t border-purple-800/50"></div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Carbon (C)</span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{run.C.toFixed(2)}%</span>
                      <span className={`text-[9px] ${run.C <= 0.05 ? 'text-green-500' : 'text-red-400'}`}>
                        Limit: ≤0.05% (C YO'Q!)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-indigo-900/20 rounded border border-indigo-500/20">
                    <span className="text-sm text-green-500 font-medium">Hydrogen (H)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.H.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dH <= 0.3 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 6.78% | Δ: {dH.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-yellow-900/20 rounded border border-yellow-500/20">
                    <span className="text-sm text-yellow-400 font-medium">Nitrogen (N)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.N.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dN <= 0.3 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 31.42% | Δ: {dN.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Sulfur (S)</span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{run.S.toFixed(2)}%</span>
                      <span className={`text-[9px] ${run.S <= 0.05 ? 'text-green-500' : 'text-red-400'}`}>
                        Limit: ≤0.05% (S YO'Q!)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center p-2 bg-purple-900/30 rounded">
                  <span className="text-xs text-purple-400">Recovery:</span>
                  <button 
                    onClick={() => setShowRecoveryModal(true)}
                    className="font-mono text-white text-sm hover:text-orange-400 cursor-pointer"
                  >
                    {run.recovery}% ℹ️
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : (dN <= 0.3 && dH <= 0.3)
                    ? "bg-green-900/30 border-green-700/30"
                    : (dN <= 0.8 && dH <= 0.5)
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : (dN <= 0.3 && dH <= 0.3) ? "text-green-400" : (dN <= 0.8 && dH <= 0.5) ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : (dN <= 0.3 && dH <= 0.3) ? "✓ Toza namuna" : (dN <= 0.8 && dH <= 0.5) ? "⚠ Chegaraviy" : "✗ Ifloslangan"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    (dN <= 0.3 && dH <= 0.3)
                      ? "Namuna tarkibi [Co(NH₃)₆]Cl₃ formulaga to'liq mos. 6 ta NH₃ to'liq saqlangan."
                      : (dN <= 0.8 && dH <= 0.5)
                        ? "N va H miqdori nazariyga yaqin, lekin qisman fotodegradatsiya yoki NH₃ yo'qotish bo'lishi mumkin."
                        : run.C > 1
                          ? "Kapsula ifloslangan — C aniqlangan (organik modda). Qayta tayyorlang."
                          : dN > 2
                            ? "NH₃ soni kamaygan. Purpureo [Co(NH₃)₅Cl]Cl₂ yoki boshqa aralashma bo'lishi mumkin."
                            : "Namuna ifloslangan yoki boshqa kobalt(III) ammiakat."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Tizim tozaligi tekshirildi. C va N nolga yaqin bo'lishi shart."
                      : "Kalibrlash standarti. C, H, N qiymatlari nazariyga mos kelishi kerak."
                  )}
                </p>
              </div>
            </div>

            {/* %N vizual taqqoslash */}
            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-orange-400 mb-4 flex justify-between">
                <span>%N Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Target: 31.42%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const val = r.N
                  const heightPct = Math.min((val / 35) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(2)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-yellow-500/30 z-0" style={{ bottom: `${(31.422/35)*100}%` }}></div>
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
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-500 rounded"></span> Blank</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> Standart</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-yellow-500/50"></span> Nazariy (31.42%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECOVERY MODAL */}
        {showRecoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowRecoveryModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                <span>📈</span> Nima uchun Recovery atigi ~38%?
              </h3>
              <p className="text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-white">[Co(NH₃)₆]Cl₃</strong> uchun recovery past bo'lishi <strong className="text-orange-300">tabiiy va normal</strong>. Standart CHNS-O analizatori Co va Cl ni o'lchamaydi.
              </p>
              <div className="bg-purple-900/40 p-4 rounded-lg font-mono text-xs mb-3">
                <div className="text-purple-400">EA detektlaydi:</div>
                <div className="text-green-400">H (6.78%) + N (31.42%) + C (0%) + S (0%) + O (0%) = <strong>38.20%</strong></div>
                <div className="mt-2 text-purple-400">EA detektlay olmaydi:</div>
                <div className="text-red-300">Co (22.03%) + Cl (39.76%) = <strong>61.79%</strong></div>
                <div className="mt-2 text-white">JAMI: 100%</div>
                <div className="text-orange-400 mt-2">✓ Recovery 38% = Muvaffaqiyatli natija!</div>
              </div>
              <p className="text-xs text-purple-300 italic mb-4">
                Cl miqdorini aniq o'lchash uchun <strong>Schöniger kolbasi</strong> usuli (yonish + AgNO₃ titrlash) ishlatiladi. Co uchun esa <strong>ICP-OES</strong> tavsiya etiladi.
              </p>
              <button 
                onClick={() => setShowRecoveryModal(false)}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2 rounded-lg transition-colors text-sm"
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
            [Co(NH₃)₆]Cl₃ ning termik barqarorligi (kinetik inertlik) tufayli NH₃ yo'qotish 180°C dan yuqorida boshlanadi — bu EA namuna tayyorlashda xavfsizlik chegarasi hisoblanadi.
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
                d="M 50 20 L 180 20 Q 200 20 210 40 L 240 80 Q 250 95 270 95 L 300 95 Q 320 95 330 110 L 360 140 Q 370 155 390 155 L 440 155 Q 460 155 470 175 L 510 200 L 580 200" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="115" y="15" textAnchor="middle" fill="#10b981">EA: %N = 31.42%, %H = 6.78%</text>
                
                <line x1="240" y1="80" x2="240" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="240" y="235" textAnchor="middle" fill="#8b5cf6">~220°C</text>
                <text x="260" y="70" fill="#8b5cf6">2-3 NH₃ yo'q</text>

                <line x1="360" y1="140" x2="360" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="360" y="235" textAnchor="middle" fill="#8b5cf6">~300°C</text>
                <text x="380" y="130" fill="#8b5cf6">3-4 NH₃ yo'q</text>

                <text x="410" y="150" textAnchor="middle" fill="#f59e0b">CoCl₂ qoldig'i</text>

                <line x1="510" y1="200" x2="510" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="510" y="235" textAnchor="middle" fill="#ef4444">~650°C</text>
                <text x="530" y="195" fill="#ef4444">Co + Cl₂ ↑</text>
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
                <div className="text-[10px] text-orange-300 mt-2 italic">EA korrelyatsiyasi: {step.eaCorrelation}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-orange-900/40 to-purple-900/40 border border-orange-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> EA ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Co(NH₃)₆]Cl₃ uchun EA ni qo'shimcha usullar bilan birgalikda ishlatish formulani to'liq tasdiqlaydi — ayniqsa Werner nazariyasini isbotlash uchun.
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

          <div className="mt-5 bg-orange-900/20 border border-orange-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-orange-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">EA (N, H) + Konduktometriya (1:3 elektrolit) + Schöniger (Cl%) + ICP-OES (Co%) + UV-Vis (d-d)</strong> — beshta metod birgalikda Werner nazariyasini to'liq tasdiqlaydi va [Co(NH₃)₆]³⁺ kompleks ionining mavjudligini ko'rsatadi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> Namuna tayyorlash bosqichlari (EA uchun)
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Co(NH₃)₆]Cl₃ kinetik inert bo'lgani uchun tayyorlash osonroq. Ammo yorug'likdan himoya va toza rang (luteo) tanlash muhim. Har bir qadamni bosib, tafsilotlarni ko'ring.
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

        {/* 10. VALIDATSIYA KALKULYATORI */}
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-2xl p-6">
          <h3 className="text-orange-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Eksperimental %N validatsiya kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan %N qiymatini kiriting va ammiakat shaklini aniqlang.
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="block text-xs text-purple-400">O'lchangan %N qiymati:</label>
              <input 
                type="number" step="0.01" value={customN}
                onChange={(e) => setCustomN(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-orange-500 outline-none transition-colors"
              />
              <div className="text-[10px] text-purple-500 mt-1">
                Nazariy qiymat: {COMPOUND.theoretical.N.percent.toFixed(3)}% (6 ta NH₃ uchun)
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {(() => {
                const diff = Math.abs(customN - 31.422)
                let res = { s: "", c: "", m: "", icon: "" }
                
                if (diff < 0.5) res = { 
                  s: "GEKSAAMMIN", 
                  c: "text-green-400", 
                  m: "Namuna toza [Co(NH₃)₆]Cl₃ tarkibiga ega. 6 ta NH₃ to'liq saqlangan.",
                  icon: "✓"
                }
                else if (customN < 29 && customN > 25) res = { 
                  s: "PENTAAMMIN", 
                  c: "text-yellow-400", 
                  m: "Namuna [Co(NH₃)₅Cl]Cl₂ (purpureo) aralashmasiga ega. 5 ta NH₃ qolgan.",
                  icon: "⚠"
                }
                else if (customN < 25 && customN > 20) res = { 
                  s: "TETRAAMMIN", 
                  c: "text-orange-400", 
                  m: "4 ta NH₃ qolgan. Kuchli fotodegradatsiya yuz bergan.",
                  icon: "⚠"
                }
                else if (customN < 20) res = { 
                  s: "PAST AMMIN", 
                  c: "text-red-400", 
                  m: "Namuna juda ko'p NH₃ yo'qotgan yoki boshqa kobalt tuzi.",
                  icon: "✗"
                }
                else res = { 
                  s: "IFLOSLANGAN", 
                  c: "text-red-400", 
                  m: "Namuna haddan tashqari azotli modda bilan ifloslangan. Qayta tahlil kerak.",
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

        {/* 11. QIZIQ FAKT - Cl va Co cheklovi */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> EA ning chegarasi: Nima uchun Cl va Co ni o'lchamaydi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                Element analizi CHNS-O <strong className="text-white">organik va yarim-organik elementlar uchun</strong> mo'ljallangan. Yoqish jarayonida:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li>C → CO₂ (gaz) → TCD detektlanadi</li>
                <li>H → H₂O (gaz) → TCD detektlanadi</li>
                <li>N → N₂ (gaz) → TCD detektlanadi (6 ta NH₃ dan)</li>
                <li><strong className="text-red-300">Cl → HCl (gaz)</strong> — standart TCD buni qayd etmaydi!</li>
                <li><strong className="text-red-300">Co → Co₃O₄ (qattiq qoldiq)</strong> — TCD detektlay olmaydi!</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Cl uchun <strong>Schöniger usuli</strong>, Co uchun <strong>ICP-OES</strong> yoki <strong>AAS</strong> metodlari kerak.
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
                  <span>0.00%</span>
                </div>
                <div className="flex justify-between">
                  <span>− H:</span>
                  <span>6.78%</span>
                </div>
                <div className="flex justify-between">
                  <span>− N:</span>
                  <span>31.42%</span>
                </div>
                <div className="flex justify-between">
                  <span>− S:</span>
                  <span>0.00%</span>
                </div>
                <div className="flex justify-between">
                  <span>− O:</span>
                  <span>0.00%</span>
                </div>
                <div className="flex justify-between border-t border-purple-800/30 pt-1 mt-1">
                  <span className="text-red-400">= Co + Cl (qoldiq):</span>
                  <span className="text-red-400 font-bold">61.80%</span>
                </div>
                <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-700/30 text-red-200 text-[10px]">
                  Nazariy Co% + Cl% = 22.03% + 39.76% = 61.79% — qoldiq bilan mos keladi ✓
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
              <p className="text-xs text-purple-200">Yuqori N% (31.4%) va toza H/N tahlili imkoniyati. C, S, O yo'qligi blank test uchun mukammal. Kinetik inertligi sababli tayyorlash oson.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Recovery atigi ~38% — Co va Cl detektlanmaydi. Cl uchun Schöniger, Co uchun ICP-OES qo'shimcha kerak. Yorug'likda fotodegradatsiya xavfi bor.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">Konduktometriya (1:3), Schöniger (Cl%), ICP-OES (Co%), UV-Vis (d-d), IQ (Co-N) — to'liq tasdiqlash va Werner nazariyasini isbotlash uchun birlashtiriladi.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/element-analiz" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Element Analiz metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-sm bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Co(NH₃)₆]Cl₃ • Element Analizi moduli</p>
          <p className="mt-1">Manbalar: IUPAC Atomic Weights 2021, Vogel's Textbook, NIST SRP, Werner (1893)</p>
        </div>
      </footer>
    </main>
  )
}