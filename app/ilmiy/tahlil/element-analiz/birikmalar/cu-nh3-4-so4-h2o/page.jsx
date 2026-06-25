"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Cu(NH₃)₄]SO₄·H₂O — ELEMENT ANALIZI (EA) MAHSUS SAHIFASI
// Manbalar: IUPAC Atomic Weights 2021, Vogel's Quantitative Chemical Analysis
// Xususiyat: Koordinatsion NH₃ analizi, Kristall suv, Mis(II) kompleksi
// Maqsad: Faqat EA tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Cu: 63.546, S: 32.065, O: 15.999, H: 1.008,
  N: 14.007, C: 12.011  // C — faqat blank/limit tekshirish uchun
}

const WATER_MOLAR_MASS = 2 * ATOMIC_MASSES.H + ATOMIC_MASSES.O  // 18.015
const AMMONIA_MOLAR_MASS = ATOMIC_MASSES.N + 3 * ATOMIC_MASSES.H  // 17.031

const COMPOUND = {
  formulaHTML: "[Cu(NH<sub>3</sub>)<sub>4</sub>]SO<sub>4</sub>·H<sub>2</sub>O",
  formulaPlain: "[Cu(NH3)4]SO4·H2O",
  iupac: "Tetraammismis(II) sulfat monogidrat",
  molarMass: 245.746,
  casNumber: "10380-29-7",
  color: "to'q ko'k (ultramarin) kristallar",
  stability: "havoda asta-sekin NH₃ yo'qotadi, sirtida oq CuSO₄·5H₂O kukun paydo bo'ladi",
  
  historicalFact: {
    title: "Schweizer reagenti va sellyuloza inqilobi",
    text: "[Cu(NH₃)₄]²⁺ kompleksi 1857-yilda Matthias Eduard Schweizer tomonidan kashf etilgan. Uning gidroksid shakli [Cu(NH₃)₄](OH)₂ sellyulozani erita oladigan yagona reagent bo'lib, birinchi sun'iy ipak (kuprammoniy rayoni) ishlab chiqarishda qo'llanilgan. [Cu(NH₃)₄]SO₄·H₂O — shu 'sehrli kompleks'ning sulfatli barqaror shakli bo'lib, EA tahlilida NH₃ va H₂O nometrik nisbatini aniq tekshirish imkonini beradi. Bu birikma EA orqali 'N kanali' orqali koordinatsion ligand sonini to'g'ridan-to'g'ri o'lchash mumkin bo'lgan kam sonli komplekslardandir.",
    year: "1857-yil"
  },

  // Koordinatsion vs Panjaradagi turlari
  ligandTypes: [
    { type: "Koordinatsion NH₃", count: 4, role: "Cu²⁺ markaziga kvadrat-tekis bog'langan", eaImpact: "N kanalida kuchli signal (4×N = 22.8%)", lossTemp: "150-280°C" },
    { type: "Kristall suv (H₂O)", count: 1, role: "Panjarada SO₄²⁻ bilan H-bog' orqali", eaImpact: "H kanaliga +2 atom H qo'shadi", lossTemp: "90-120°C" },
    { type: "Koordinatsion suv", count: 0, role: "Cu²⁺ ga bevosita bog'lanmagan", eaImpact: "—", lossTemp: "—" }
  ],
  
  theoretical: {
    C:  { atoms: 0, mass: 0.000,   percent: 0.000,  source: "Organik fragment yo'q", eaChannel: "Shovqin tekshirish" },
    H:  { atoms: 14, mass: 14.112, percent: 5.742,  source: "4×NH₃ (12H) + H₂O (2H)", eaChannel: "Kritik kanal (asosiy mezon)" },
    N:  { atoms: 4, mass: 56.028,  percent: 22.798, source: "4×koordinatsion NH₃", eaChannel: "NH₃ sonini tasdiqlovchi" },
    S:  { atoms: 1, mass: 32.065,  percent: 13.048, source: "Sulfat anioni", eaChannel: "SO₂ detektlanishi" },
    O:  { atoms: 5, mass: 79.995,  percent: 32.551, source: "SO₄²⁻ + kristall H₂O", eaChannel: "TCD orqali" },
    Cu: { atoms: 1, mass: 63.546,  percent: 25.858, source: "Markaziy Cu²⁺ atomi", eaChannel: "Yoqilg'ida qoldiq (ICP kerak)" }
  },

  // Laboratoriya jurnali
  experimentalRuns: [
    { id: "EA-24-117", date: "2024-07-14", method: "CHNS-O FlashSmart", C: 0.01, H: 5.72, N: 22.75, S: 13.02, recovery: 99.7, note: "Toza, yangi sintez qilingan" },
    { id: "EA-24-118", date: "2024-07-14", method: "CHNS-O FlashSmart", C: 0.02, H: 5.76, N: 22.83, S: 13.07, recovery: 100.4, note: "Inert (N₂) muhitda tayyorlangan" },
    { id: "EA-24-119", date: "2024-07-15", method: "CHNS-O Vario EL",    C: 0.04, H: 5.48, N: 21.90, S: 13.15, recovery: 98.4, note: "3 kun havoda ochiq qolgan" },
    { id: "EA-24-120", date: "2024-07-15", method: "CHNS-O FlashSmart", C: 0.03, H: 5.10, N: 20.30, S: 13.40, recovery: 96.1, note: "1 hafta havoda — NH₃ yo'qotgan" },
    { id: "EA-24-121", date: "2024-07-16", method: "CHNS-O FlashSmart", C: 0.02, H: 6.15, N: 22.85, S: 12.90, recovery: 101.6, note: "Gigroskopik nam yutilgan" },
    { id: "EA-24-122", date: "2024-07-16", method: "CHNS-O FlashSmart", C: 0.01, H: 5.33, N: 24.61, S: 14.08, recovery: 99.5, note: "Anhidrous shakl (monogidrat emas)" },
    { id: "BLANK-03",  date: "2024-07-14", method: "Blank (Empty Capsule)", C: 0.00, H: 0.02, N: 0.01, S: 0.00, recovery: 0.0, note: "Tizim tozaligi" },
    { id: "STD-SULFA", date: "2024-07-14", method: "Standard: Sulfanilamide", C: 41.82, H: 4.69, N: 16.28, S: 18.51, recovery: 99.9, note: "NIST kalibrlash standarti" }
  ],

  tgaSteps: [
    { start: 25, end: 90, loss: 0.0,  event: "Barqaror zona (Room Temp)", color: "#10b981", eaCorrelation: "N va H signallari barqaror" },
    { start: 90, end: 120, loss: 7.3, event: "1H₂O yo'qolishi (Dehydratatsiya)", color: "#3b82f6", eaCorrelation: "H: 5.74% → 5.33% | N: 22.80% → 24.63%" },
    { start: 150, end: 220, loss: 13.8, event: "2NH₃ yo'qolishi (bosqich I)", color: "#8b5cf6", eaCorrelation: "N: 24.63% → 17.50%" },
    { start: 220, end: 280, loss: 13.8, event: "2NH₃ yo'qolishi (bosqich II)", color: "#8b5cf6", eaCorrelation: "N: 17.50% → 0%" },
    { start: 280, end: 500, loss: 0.0,  event: "Suvsiz CuSO₄ platolari", color: "#f59e0b", eaCorrelation: "N=0%, faqat S va Cu" },
    { start: 500, end: 750, loss: 32.2, event: "Termik parchalanish (SO₃ ↑ + CuO)", color: "#ef4444", eaCorrelation: "S signal kamayadi, qoldiq CuO" }
  ],

  // EA ga yaqin tahlil usullari
  relatedMethods: [
    { name: "UV-Vis spektroskopiya", role: "d-d o'tishlar (²E_g → ²T₂_g) va LMCT (NH₃ → Cu²⁺) aniqlaydi", eaAdvantage: "NH₃ koordinatsiyasini optik tasdiqlaydi", eaDisadvantage: "NH₃ sonini miqdoriy bermaydi", complementarity: "92%" },
    { name: "IQ spektroskopiya", role: "N-H tebranishlari (3300-3150 cm⁻¹), Cu-N bog'i (400-250 cm⁻¹)", eaAdvantage: "Koordinatsion NH₃ vs erkin NH₃ ni farqlaydi", eaDisadvantage: "NH₃ sonini aniq hisoblamaydi", complementarity: "90%" },
    { name: "TGA (Termogravimetriya)", role: "1 H₂O + 4 NH₃ bosqichma-bosqich yo'qotilishini ko'rsatadi", eaAdvantage: "Kristall suv va ligandlarni ajratadi", eaDisadvantage: "NH₃ ning kimyoviy tabiatini bilmaydi", complementarity: "96%" },
    { name: "ICP-OES", role: "Cu va S miqdorini ppb darajasida o'lchaydi", eaAdvantage: "Metall tarkibini to'g'ridan-to'g'ri beradi", eaDisadvantage: "NH₃ va H₂O ni o'lchamaydi", complementarity: "85%" },
    { name: "Konduktometriya", role: "Eritmada ionlar sonini (1:2 elektrolit) o'lchaydi", eaAdvantage: "[Cu(NH₃)₄]²⁺ kompleksligini tasdiqlaydi", eaDisadvantage: "Elementar tarkib bermaydi", complementarity: "78%" }
  ],

  // Sample tayyorlash bosqichlari
  samplePrepSteps: [
    { step: 1, title: "Namuna tanlash", desc: "To'q ko'k, shaffof kristallar. Yuzasi oq kukunli (CuSO₄·5H₂O) namunalar — NH₃ yo'qotgan, ishlatilmaydi.", time: "1 daq", critical: true },
    { step: 2, title: "Qog'oz sochiq bilan quritish", desc: "Sirt namligini olib tashlash. Issiqlik ishlatilmaydi — NH₃ uchib ketadi.", time: "1 daq", critical: true },
    { step: 3, title: "Yengil maydalash", desc: "Aqiq hovonchada yengil eziladi. Kuchli ishqalanish NH₃ ni uchirishi mumkin.", time: "1-2 daq", critical: true },
    { step: 4, title: "Qalay kapsulaga joylash", desc: "5×9mm Sn kapsulaga 2.0-3.5 mg namuna tortiladi (mikro-tarozida).", time: "3 daq", critical: true },
    { step: 5, title: "Darhol yopish", desc: "Kapsula 10 soniya ichida yopiladi. NH₃ bug'lanishi oldini olish uchun.", time: "10 son", critical: true },
    { step: 6, title: "Tez analiz", desc: "Tayyorlanganidan keyin 30 daqiqa ichida analizatorga kiritiladi.", time: "5-8 daq (analiz)", critical: true }
  ],

  // EA ning ishlash prinsipi
  combustionPrinciple: {
    oxidationTemp: "1050°C",
    reductionTemp: "650°C (Cu)",
    products: {
      C: "CO₂ (TCD detektori)",
      H: "H₂O (TCD detektori)",
      N: "N₂ (TCD detektori)",
      S: "SO₂ (IR yoki TCD detektori)",
      O: "CO (alohida rejimda)"
    },
    equations: [
      { reactant: "[Cu(NH₃)₄]SO₄·H₂O", process: "+ O₂ (1050°C)", products: "CuO (qattiq) + 2N₂ + 7H₂O + SO₂" },
      { reactant: "NH₃ (ligand)", process: "→ O₂", products: "N₂ (gaz) + H₂O (TCD detektlaydi)" },
      { reactant: "H₂O (kristall)", process: "→ TCD", products: "Pik balandligi %H ga proportsional" },
      { reactant: "Cu²⁺", process: "Kamerasida qoldiq", products: "CuO qoldig'i — ICP-OES bilan tasdiqlanadi" }
    ]
  },

  // Validatsiya mezonlari
  validationCriteria: {
    NH3_theory_moles: 4,
    NH3_theory_pct_N: 22.798,
    H2O_theory_moles: 1,
    H2O_theory_pct_water: 7.332,
    acceptable_dN: 0.4,  // ±0.4% N
    acceptable_dH: 0.3   // ±0.3% H
  }
}

// Yordamchi: NH₃ soni (m) va H₂O soni (n) uchun nazariy %H, %N hisoblash
function calculateAmmoniateProperties(m, n) {
  const anhydrousMass = ATOMIC_MASSES.Cu + ATOMIC_MASSES.S + 4 * ATOMIC_MASSES.O // 191.639 (CuSO₄)
  const ammoniaMass = m * AMMONIA_MOLAR_MASS
  const waterMass = n * WATER_MOLAR_MASS
  const total = anhydrousMass + ammoniaMass + waterMass
  const hMass = m * 3 * ATOMIC_MASSES.H + n * 2 * ATOMIC_MASSES.H
  const nMass = m * ATOMIC_MASSES.N
  const sMass = ATOMIC_MASSES.S
  const cuMass = ATOMIC_MASSES.Cu
  const oMass = (4 + n) * ATOMIC_MASSES.O
  return {
    total: parseFloat(total.toFixed(3)),
    H_pct: parseFloat(((hMass / total) * 100).toFixed(3)),
    N_pct: parseFloat(((nMass / total) * 100).toFixed(3)),
    S_pct: parseFloat(((sMass / total) * 100).toFixed(3)),
    Cu_pct: parseFloat(((cuMass / total) * 100).toFixed(3)),
    O_pct: parseFloat(((oMass / total) * 100).toFixed(3)),
    waterPct: parseFloat(((waterMass / total) * 100).toFixed(2)),
    ammoniaPct: parseFloat(((ammoniaMass / total) * 100).toFixed(2))
  }
}

export default function CuNH34SO4Page() {
  const [activeRun, setActiveRun] = useState("EA-24-117")
  const [ammoniaM, setAmmoniaM] = useState(4)  // NH₃ soni
  const [waterN, setWaterN] = useState(1)      // H₂O soni
  const [customN, setCustomN] = useState(22.80)
  const [selectedLigandType, setSelectedLigandType] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)

  // Dinamik gidrat kalkulyatori
  const calc = useMemo(() => calculateAmmoniateProperties(ammoniaM, waterN), [ammoniaM, waterN])

  // Barcha ammiakatlar (m=0..6, n=1) — taqqoslash uchun
  const allAmmoniates = useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6].map(m => ({
      m,
      n: 1,  // doim monogidrat
      ...calculateAmmoniateProperties(m, 1),
      name: m === 0 ? "Anhidrous CuSO₄" : m === 1 ? "Monoammiakat" : m === 2 ? "Diammiakat" : m === 4 ? "Tetraammiakat ✓" : m === 6 ? "Geksaammiakat" : `${m}-Ammin`
    }))
  }, [])

  // Suvli variantlar (n=0..5, m=4)
  const allHydrates = useMemo(() => {
    return [0, 1, 2, 3, 4, 5].map(n => ({
      m: 4,
      n,
      ...calculateAmmoniateProperties(4, n),
      name: n === 0 ? "Anhidrous [Cu(NH₃)₄]SO₄" : n === 1 ? "Monogidrat ✓" : n === 5 ? "Pentagidrat" : `${n}-Gidrat`
    }))
  }, [])

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  // Validatsiya mantiqi
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const dH = Math.abs(run.H - COMPOUND.theoretical.H.percent)
  const dN = Math.abs(run.N - COMPOUND.theoretical.N.percent)
  const dS = Math.abs(run.S - COMPOUND.theoretical.S.percent)
  const statusColor = (dN <= 0.2 && dH <= 0.2) ? "text-green-400" : (dN <= 0.5 && dH <= 0.4) ? "text-yellow-400" : "text-red-400"

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
            <span className="text-cyan-400 font-semibold">[Cu(NH₃)₄]SO₄·H₂O</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                {COMPOUND.iupac} • M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
              </p>
              <p className="text-purple-500 text-xs mt-1">
                {COMPOUND.color} • {COMPOUND.stability}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Koordinatsion NH₃</span>
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Uglerodsiz Tizim</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">NH₃ Uchuvchan Ligand</span>
                <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Cu²⁺ Kompleks</span>
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
        <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (EA uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Cu(NH₃)₄]SO₄·H₂O</strong> — mis(II) ning ammiakli kompleksi bo'lib, unda 4 ta NH₃ ligandi kvadrat-tekis geometriyada Cu²⁺ ioniga bog'langan, va 1 ta suv molekulasi kristall panjarada joylashgan. Bu birikma EA tahlilida <strong className="text-cyan-300">noyob ahamiyatga ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-cyan-500 text-xs md:text-sm">
                <li>Tarkibida <strong className="text-white">C mavjud emas</strong> — blank test uchun mukammal</li>
                <li><strong className="text-white">4 ta N atomi</strong> — faqat NH₃ ligandlaridan keladi, %N bevosita ligand sonini ko'rsatadi</li>
                <li><strong className="text-white">14 ta H atomi</strong> — 12 ta NH₃ dan + 2 ta H₂O dan, gidrat holatini ko'rsatadi</li>
                <li>NH₃ <strong className="text-white">uchuvchan ligand</strong> — namunani tez tayyorlash va darhol analiz qilish talab etiladi</li>
                <li>S (sulfat) — SO₂ sifatida detektlanadi, qo'shimcha tasdiq</li>
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
            Namunani yuqori haroratda kislorod ishtirokida yoqish orqali har bir element gaz holatiga o'tkaziladi. [Cu(NH₃)₄]SO₄·H₂O uchun <strong className="text-cyan-300">NH₃ ning N₂ ga aylanishi</strong> asosiy diagnostik hodisa hisoblanadi.
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
            <h3 className="text-cyan-400 font-bold text-xs uppercase mb-3">Bu birikma uchun yoqish reaksiyalari:</h3>
            <div className="space-y-3 font-mono text-xs">
              {COMPOUND.combustionPrinciple.equations.map((eq, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-purple-900/30 rounded border-l-4 border-cyan-500">
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
            <span>📐</span> Nazariy element tarkibi (CHNS-O + Cu)
          </h2>
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
                    <td className="py-3 pl-2 font-bold text-cyan-400">{el}</td>
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
                <tr className="bg-cyan-900/20 font-bold border-t border-cyan-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center text-white">25</td>
                  <td className="py-3"></td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. NH₃ va H₂O SIMULYATSIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🧬</span> Ammiakat va Gidrat holati simulyatsiyasi
            </h2>
            <div className="flex gap-2">
              <span className="text-xs text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded border border-cyan-700/30">
                m (NH₃) = {ammoniaM}
              </span>
              <span className="text-xs text-blue-400 bg-blue-950/50 px-3 py-1 rounded border border-blue-700/30">
                n (H₂O) = {waterN}
              </span>
            </div>
          </div>

          <p className="text-sm text-purple-300 mb-6">
            Koordinatsion NH₃ soni (m) va kristall suv soni (n) o'zgarganda <strong className="text-yellow-300">%N va %H</strong> keskin o'zgaradi. EA orqali bu ikkala o'zgaruvchini bir vaqtda tekshirish mumkin — bu [Cu(NH₃)₄]SO₄·H₂O ning noyob diagnostik xususiyatidir.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-purple-950/60 p-6 rounded-xl border border-purple-700/30">
                <label className="block text-xs text-purple-400 mb-2">Koordinatsion NH₃ soni (m):</label>
                <input 
                  type="range" min="0" max="6" step="1" 
                  value={ammoniaM} 
                  onChange={(e) => setAmmoniaM(Number(e.target.value))}
                  className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 mb-2"
                />
                <div className="flex justify-between text-xs font-mono text-purple-500 mb-6">
                  <span>0 (CuSO₄)</span>
                  <span>2</span>
                  <span>4 (✓)</span>
                  <span>6</span>
                </div>

                <label className="block text-xs text-purple-400 mb-2">Kristall suv soni (n):</label>
                <input 
                  type="range" min="0" max="5" step="1" 
                  value={waterN} 
                  onChange={(e) => setWaterN(Number(e.target.value))}
                  className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-2"
                />
                <div className="flex justify-between text-xs font-mono text-purple-500 mb-6">
                  <span>0 (anh.)</span>
                  <span>1 (✓)</span>
                  <span>3</span>
                  <span>5 (pent.)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">Mol. massa</div>
                    <div className="text-xl font-mono text-white mt-1">{calc.total} <span className="text-xs text-purple-500">g/mol</span></div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-cyan-400 uppercase">NH₃ ulushi</div>
                    <div className="text-xl font-mono text-cyan-400 mt-1">{calc.ammoniaPct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-blue-400 uppercase">H₂O ulushi</div>
                    <div className="text-xl font-mono text-blue-400 mt-1">{calc.waterPct}%</div>
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
                    <div className="text-[10px] text-purple-400 uppercase">%Cu</div>
                    <div className="text-xl font-mono text-red-400 mt-1">{calc.Cu_pct}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                <h3 className="text-cyan-400 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                  <span>🧩</span> Ligand turlari (ushbu birikmada)
                </h3>
                <div className="space-y-2">
                  {COMPOUND.ligandTypes.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedLigandType(i)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedLigandType === i 
                          ? "bg-cyan-900/40 border-cyan-500" 
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
                {[0, 5, 10, 15, 20, 25].map(v => (
                  <g key={v}>
                    <line x1="40" y1={210 - (v/25)*180} x2="380" y2={210 - (v/25)*180} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="3,3" />
                    <text x="35" y={214 - (v/25)*180} textAnchor="end" fontSize="9" fill="#a78bfa">{v}%</text>
                  </g>
                ))}
                
                {/* Nazariy chiziq (m=4, n=1) - %N uchun */}
                {(() => {
                  const targetN = 22.798
                  const y = 210 - (targetN/25) * 180
                  return (
                    <g>
                      <line x1="40" y1={y} x2="380" y2={y} stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,3" />
                      <text x="385" y={y+3} fontSize="8" fill="#fbbf24">m=4 (naz. %N)</text>
                    </g>
                  )
                })()}

                {/* Trend Line — %N vs m (n=1) */}
                <polyline 
                  fill="none" stroke="#06b6d4" strokeWidth="2.5" opacity="0.7"
                  points={[0,1,2,3,4,5,6].map(m => {
                    const props = calculateAmmoniateProperties(m, 1)
                    const x = 40 + (m/6) * 340
                    const y = 210 - (props.N_pct / 25) * 180
                    return `${x},${y}`
                  }).join(" ")}
                />

                {[0,1,2,3,4,5,6].map(m => {
                  const props = calculateAmmoniateProperties(m, 1)
                  const x = 40 + (m/6) * 340
                  const y = 210 - (props.N_pct / 25) * 180
                  const isActive = m === ammoniaM
                  return (
                    <g key={m} style={{ cursor: 'pointer' }} onClick={() => setAmmoniaM(m)}>
                      <circle cx={x} cy={y} r={isActive ? 7 : 4} 
                        fill={isActive ? "#fbbf24" : "#06b6d4"} 
                        stroke={isActive ? "#fff" : "#06b6d4"} 
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
                {[0,1,2,3,4,5,6].map(m => (
                  <text 
                    key={m} 
                    x={40 + (m/6)*340} 
                    y="225" 
                    textAnchor="middle" 
                    fontSize="10" 
                    fill={m===ammoniaM ? "#fbbf24" : "#64748b"} 
                    fontWeight={m===ammoniaM ? "bold" : "normal"}
                  >
                    m={m}
                  </text>
                ))}
                <text x="210" y="238" textAnchor="middle" fontSize="9" fill="#a78bfa">Koordinatsion NH₃ soni (m) | n=1 (monogidrat)</text>
              </svg>
            </div>
          </div>
        </div>

        {/* 5. AMMIAKATLAR TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>📊</span> Barcha ammiakatlar taqqoslanmasi (monogidrat, n=1)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Agar namunada NH₃ ligandlari yo'qotilgan bo'lsa, EA qanday natija ko'rsatadi?
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 uppercase tracking-wider">
                  <th className="py-2 text-left pl-2">Ammin</th>
                  <th className="py-2 text-center">M (g/mol)</th>
                  <th className="py-2 text-center text-yellow-400">%N</th>
                  <th className="py-2 text-center text-green-400">%H</th>
                  <th className="py-2 text-center text-red-400">%Cu</th>
                  <th className="py-2 text-center">NH₃ %</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {allAmmoniates.map(a => {
                  const isTarget = a.m === 4
                  const isCurrent = a.m === ammoniaM
                  return (
                    <tr 
                      key={a.m}
                      onClick={() => setAmmoniaM(a.m)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-cyan-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-cyan-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {a.name}
                      </td>
                      <td className="py-2 text-center font-mono">{a.total}</td>
                      <td className="py-2 text-center font-mono text-yellow-400 font-bold">{a.N_pct}</td>
                      <td className="py-2 text-center font-mono text-green-400">{a.H_pct}</td>
                      <td className="py-2 text-center font-mono text-red-400">{a.Cu_pct}</td>
                      <td className="py-2 text-center font-mono text-cyan-400">{a.ammoniaPct}</td>
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

        {/* 5b. GIDRATLAR TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>💧</span> Barcha gidratlar taqqoslanmasi (m=4, NH₃ soni o'zgarmas)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Kristall suv soni o'zgarganda %H sezilarli o'zgaradi, lekin %N ham ozgina o'zgaradi.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 uppercase tracking-wider">
                  <th className="py-2 text-left pl-2">Gidrat</th>
                  <th className="py-2 text-center">M (g/mol)</th>
                  <th className="py-2 text-center text-green-400">%H</th>
                  <th className="py-2 text-center text-yellow-400">%N</th>
                  <th className="py-2 text-center">H₂O %</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {allHydrates.map(h => {
                  const isTarget = h.n === 1
                  const isCurrent = h.n === waterN
                  return (
                    <tr 
                      key={h.n}
                      onClick={() => setWaterN(h.n)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-blue-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-blue-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {h.name}
                      </td>
                      <td className="py-2 text-center font-mono">{h.total}</td>
                      <td className="py-2 text-center font-mono text-green-400 font-bold">{h.H_pct}</td>
                      <td className="py-2 text-center font-mono text-yellow-400">{h.N_pct}</td>
                      <td className="py-2 text-center font-mono text-blue-400">{h.waterPct}</td>
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
            Turli sharoitlarda o'tkazilgan EA yugurishlari. Har birini tanlab, natijani tahlil qiling.
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
                      ? "bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
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
                      <span className={`text-[9px] ${run.C <= 0.05 ? 'text-green-500' : 'text-orange-400'}`}>
                        Limit: ≤0.05%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-indigo-900/20 rounded border border-indigo-500/20">
                    <span className="text-sm text-green-500 font-medium">Hydrogen (H)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.H.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dH <= 0.2 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 5.74% | Δ: {dH.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-yellow-900/20 rounded border border-yellow-500/20">
                    <span className="text-sm text-yellow-400 font-medium">Nitrogen (N)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.N.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dN <= 0.2 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 22.80% | Δ: {dN.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-500 font-medium">Sulfur (S)</span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{run.S.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dS <= 0.3 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 13.05% | Δ: {dS.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center p-2 bg-purple-900/30 rounded">
                  <span className="text-xs text-purple-400">Recovery:</span>
                  <button 
                    onClick={() => setShowRecoveryModal(true)}
                    className="font-mono text-white text-sm hover:text-cyan-400 cursor-pointer"
                  >
                    {run.recovery}% ℹ️
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : (dN <= 0.2 && dH <= 0.2)
                    ? "bg-green-900/30 border-green-700/30"
                    : (dN <= 0.5 && dH <= 0.4)
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : (dN <= 0.2 && dH <= 0.2) ? "text-green-400" : (dN <= 0.5 && dH <= 0.4) ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : (dN <= 0.2 && dH <= 0.2) ? "✓ Toza namuna" : (dN <= 0.5 && dH <= 0.4) ? "⚠ Chegaraviy" : "✗ Ifloslangan"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    (dN <= 0.2 && dH <= 0.2)
                      ? "Namuna tarkibi [Cu(NH₃)₄]SO₄·H₂O formulaga to'liq mos. 4 ta NH₃ va 1 ta H₂O to'liq saqlangan."
                      : (dN <= 0.5 && dH <= 0.4)
                        ? "N va H miqdori nazariyga yaqin, lekin qisman NH₃ yo'qotish yoki nam yutilish bo'lishi mumkin."
                        : dN > 1.0
                          ? "NH₃ soni keskin kamaygan. Namunada degammatsiya (NH₃ yo'qotish) kuzatilgan."
                          : "Namuna ifloslangan yoki boshqa ammiakat shakliga o'tgan."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Tizim tozaligi tekshirildi. C va N nolga yaqin bo'lishi shart."
                      : "Kalibrlash standarti. C, H, N qiymatlari nazariyga mos kelishi kerak."
                  )}
                </p>
              </div>
            </div>

            {/* %N va %H vizual taqqoslash */}
            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-cyan-400 mb-4 flex justify-between">
                <span>%N Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Target: 22.80%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const val = r.N
                  const heightPct = Math.min((val / 25) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(2)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-yellow-500/30 z-0" style={{ bottom: `${(22.798/25)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : 'text-cyan-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-cyan-500 rounded"></span> Namuna</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-500 rounded"></span> Blank</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> Standart</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-yellow-500/50"></span> Nazariy (22.80%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECOVERY MODAL */}
        {showRecoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowRecoveryModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <span>📈</span> Recovery nima?
              </h3>
              <p className="text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-white">Recovery</strong> — namunadagi barcha elementlar to'liq detektlanganligini ko'rsatuvchi indikator.
              </p>
              <div className="bg-purple-900/40 p-4 rounded-lg font-mono text-xs mb-3">
                <div>Recovery = Σ(ma'lum elementlar %) / 100% × 100</div>
                <div className="mt-2 text-purple-400">[Cu(NH₃)₄]SO₄·H₂O uchun:</div>
                <div className="text-white">C + H + N + S + O + Cu = 100%</div>
                <div className="text-green-400 mt-2">✓ Qabul qilinadigan oraliq: 98% – 102%</div>
              </div>
              <p className="text-xs text-purple-300 italic mb-4">
                {run.recovery < 98 && "⚠ Recovery past — NH₃ uchib ketgan bo'lishi mumkin."}
                {run.recovery > 102 && "⚠ Recovery yuqori — nam yutilishi yoki kapsula xatosi."}
                {run.recovery >= 98 && run.recovery <= 102 && "✓ Recovery normal — natijalar ishonchli."}
              </p>
              <button 
                onClick={() => setShowRecoveryModal(false)}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg transition-colors text-sm"
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
            H₂O va NH₃ ning bosqichma-bosqich yo'qolishi TGA va EA da parallel ravishda kuzatiladi.
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
                d="M 50 20 L 120 20 Q 140 20 150 35 L 175 75 Q 185 85 200 85 L 240 85 Q 255 85 270 95 L 305 120 Q 320 128 335 128 L 380 128 Q 395 128 410 138 L 445 160 Q 455 168 470 168 L 510 168 Q 525 168 540 180 L 580 180" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="90" y="15" textAnchor="middle" fill="#10b981">EA: %N = 22.80%, %H = 5.74%</text>
                
                <line x1="150" y1="35" x2="150" y2="220" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="150" y="235" textAnchor="middle" fill="#3b82f6">~100°C</text>
                <text x="170" y="55" fill="#3b82f6">-1H₂O</text>

                <line x1="305" y1="120" x2="305" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="305" y="235" textAnchor="middle" fill="#8b5cf6">~220°C</text>
                <text x="325" y="110" fill="#8b5cf6">-2NH₃</text>

                <line x1="445" y1="160" x2="445" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="445" y="235" textAnchor="middle" fill="#8b5cf6">~280°C</text>
                <text x="465" y="155" fill="#8b5cf6">-2NH₃</text>

                <text x="485" y="165" textAnchor="middle" fill="#f59e0b">Suvsiz CuSO₄</text>

                <line x1="540" y1="180" x2="540" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="540" y="235" textAnchor="middle" fill="#ef4444">~650°C</text>
                <text x="560" y="175" fill="#ef4444">SO₃ + CuO</text>
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
                <div className="text-[10px] text-cyan-300 mt-2 italic">EA korrelyatsiyasi: {step.eaCorrelation}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> EA ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Cu(NH₃)₄]SO₄·H₂O uchun EA ni qo'shimcha usullar bilan birgalikda ishlatish formulani to'liq tasdiqlaydi.
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

          <div className="mt-5 bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-cyan-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">EA (C, H, N, S) + TGA (H₂O + NH₃) + IQ (NH₃ tebranishlari) + ICP-OES (Cu)</strong> — to'rtta metod birgalikda [Cu(NH₃)₄]SO₄·H₂O ning to'liq kimyoviy tasvirini beradi: koordinatsion NH₃ soni, kristall suv, metall tarkibi va optik xususiyatlar.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> Namuna tayyorlash bosqichlari (EA uchun)
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            NH₃ uchuvchan ligand bo'lganligi sababli, bu birikmani tayyorlashda juda ehtiyot bo'lish kerak. Har bir qadamni bosib, tafsilotlarni ko'ring.
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

        {/* 10. VALIDATSIYA KALKULYATORI */}
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
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
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 outline-none transition-colors"
              />
              <div className="text-[10px] text-purple-500 mt-1">
                Nazariy qiymat: {COMPOUND.theoretical.N.percent.toFixed(3)}% (4 ta NH₃ uchun)
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {(() => {
                const diff = Math.abs(customN - 22.798)
                let res = { s: "", c: "", m: "", icon: "" }
                
                if (diff < 0.3) res = { 
                  s: "TETRAAMMIAKAT", 
                  c: "text-green-400", 
                  m: "Namuna toza [Cu(NH₃)₄]SO₄·H₂O tarkibiga ega. 4 ta NH₃ to'liq saqlangan.",
                  icon: "✓"
                }
                else if (customN < 17 && customN > 13) res = { 
                  s: "DIAMMIAKAT", 
                  c: "text-yellow-400", 
                  m: "Namuna qisman degammatsiyaga uchragan — 2 ta NH₃ yo'qotgan. Diammiakat shakli: [Cu(NH₃)₂]SO₄",
                  icon: "⚠"
                }
                else if (customN < 13 && customN > 5) res = { 
                  s: "MONOAMMIAKAT", 
                  c: "text-orange-400", 
                  m: "3 ta NH₃ yo'qotilgan. Faqat bitta NH₃ qolgan.",
                  icon: "⚠"
                }
                else if (customN < 5) res = { 
                  s: "CU SO₄", 
                  c: "text-red-400", 
                  m: "Barcha NH₃ yo'qotilgan. Oddiy mis sulfat holatiga o'tgan.",
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
                        Δ = {diff.toFixed(3)}% (Limit: ±0.4%)
                      </span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        {/* 11. QIZIQ FAKT */}
        <div className="bg-gradient-to-r from-orange-900/20 to-purple-900/40 border border-orange-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> EA ning chegarasi: Nima uchun Cu miqdorini o'lchamaydi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                Element analizi CHNS-O <strong className="text-white">organik elementlar va ba'zi metallmaslar uchun</strong> mo'ljallangan. Yoqish jarayonida:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-orange-500 text-xs">
                <li>C → CO₂ (gaz) → TCD detektlanadi</li>
                <li>H → H₂O (gaz) → TCD detektlanadi</li>
                <li>N → N₂ (gaz) → TCD detektlanadi (4 ta NH₃ dan)</li>
                <li>S → SO₂ (gaz) → TCD detektlanadi</li>
                <li><strong className="text-red-300">Cu → CuO (qattiq qoldiq)</strong> — TCD detektlay olmaydi!</li>
              </ul>
              <p className="text-xs text-orange-200 italic mt-2">
                Cu²⁺ miqdorini tasdiqlash uchun <strong>ICP-OES</strong> yoki <strong>AAS</strong> metodlari ishlatiladi.
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-orange-400 font-bold text-xs uppercase mb-3">Qoldiqni hisoblash:</h4>
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
                  <span>5.74%</span>
                </div>
                <div className="flex justify-between">
                  <span>− N:</span>
                  <span>22.80%</span>
                </div>
                <div className="flex justify-between">
                  <span>− S:</span>
                  <span>13.05%</span>
                </div>
                <div className="flex justify-between">
                  <span>− O:</span>
                  <span>32.55%</span>
                </div>
                <div className="flex justify-between border-t border-purple-800/30 pt-1 mt-1">
                  <span className="text-orange-400">= Cu (qoldiq):</span>
                  <span className="text-orange-400 font-bold">25.86%</span>
                </div>
                <div className="mt-3 p-2 bg-orange-900/20 rounded border border-orange-700/30 text-orange-200 text-[10px]">
                  Nazariy Cu% = 25.858% — qoldiq bilan mos keladi ✓
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
              <p className="text-xs text-purple-200">%N orqali 4 ta NH₃ ligandini aniq o'lchaydi, %H orqali kristall suvni tasdiqlaydi. C yo'qligi blank test uchun mukammal.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Ehtiyot choralar</h3>
              <p className="text-xs text-purple-200">NH₃ uchuvchanligi — namunani tez tayyorlash va darhol analiz qilish kerak. Havoda ochiq qoldirilsa, natijalar past chiqadi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">TGA (H₂O+NH₃), IQ (NH₃ tebranish), UV-Vis (d-d), ICP-OES (Cu) — to'liq tasdiqlash uchun birlashtiriladi.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/element-analiz" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Element Analiz metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-sm bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Cu(NH₃)₄]SO₄·H₂O • Element Analizi moduli</p>
          <p className="mt-1">Manbalar: IUPAC Atomic Weights 2021, Vogel's Textbook, NIST SRP</p>
        </div>
      </footer>
    </main>
  )
}