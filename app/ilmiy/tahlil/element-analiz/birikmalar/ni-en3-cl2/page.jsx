"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// [Ni(en)₃]Cl₂ — ELEMENT ANALIZI (EA) MAHSUS SAHIFASI
// Manbalar: IUPAC Atomic Weights 2021, Vogel's Quantitative Chemical Analysis
// Xususiyat: Organik xelat ligand (en = H₂N-CH₂-CH₂-NH₂), 5 a'zoli halqa
// Maqsad: Faqat EA tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Ni: 58.693, Cl: 35.450, C: 12.011, H: 1.008, N: 14.007,
  O: 15.999, S: 32.065  // O, S — faqat blank/gidrat tekshirish uchun
}

const EN_MOLAR_MASS = 2 * ATOMIC_MASSES.C + 8 * ATOMIC_MASSES.H + 2 * ATOMIC_MASSES.N  // 60.118
const WATER_MOLAR_MASS = 2 * ATOMIC_MASSES.H + ATOMIC_MASSES.O  // 18.015

const COMPOUND = {
  formulaHTML: "[Ni(en)<sub>3</sub>]Cl<sub>2</sub>",
  formulaPlain: "[Ni(en)3]Cl2",
  iupac: "Tris(etilendiamin)nikel(II) xlorid",
  formulaExpanded: "Ni(C₂H₈N₂)₃Cl₂ = NiC₆H₂₄N₆Cl₂",
  molarMass: 309.905,
  casNumber: "15276-26-9",
  color: "to'q binafsha (violet) kristallar",
  stability: "havoda barqaror, xelat effekti tufayli monodentat NH₃ li komplekslardan 10⁸ marta barqaror",
  
  historicalFact: {
    title: "Xelat effekti va termodinamik ustunlik",
    text: "[Ni(en)₃]²⁺ — 'xelat effekti'ning klassik namunasi. 1930-yillarda Schwarzenbach va boshqalar ko'rsatdiki, [Ni(en)₃]²⁺ ning barqarorlik doimiysi (log β₃ ≈ 18) [Ni(NH₃)₆]²⁺ (log β₆ ≈ 8) dan 10¹⁰ marta katta. Bu farq asosan ENTROPIYA ga bog'liq: bitta en 2 ta NH₃ o'rnini egallaganda erkin molekulalar soni ortadi (ΔS > 0). EA tahlilida bu kompleks juda qimmatli: tarkibida C, H, N — uchala organik element ham mavjud, shuning uchun EA CHNS-O ning barcha kanallarini bir vaqtda sinash imkonini beradi. Bu birikma EA 'stress-test' emas, balki 'kalibrlash standarti' sifatida ham xizmat qiladi.",
    year: "1930-yillar"
  },

  // Koordinatsion turlari
  ligandTypes: [
    { type: "Koordinatsion en (bidentat)", count: 3, role: "Ni²⁺ ga 2 ta N orqali bog'langan, 5 a'zoli halqa hosil qiladi", eaImpact: "C kanalida 6 ta C, N kanalida 6 ta N, H kanalida 24 ta H — uchala kanal ham to'liq to'ladi", lossTemp: "220-350°C (bosqichma-bosqich)" },
    { type: "Tashqi sfera Cl⁻", count: 2, role: "Ion bog' orqali [Ni(en)₃]²⁺ bilan bog'langan", eaImpact: "Standart CHNS-O da detektlanmaydi (Schöniger kerak)", lossTemp: ">400°C (Cl₂ ↑)" },
    { type: "Koordinatsion suv", count: 0, role: "Ni²⁺ barcha 6 koordinatsion joyini en egallagan", eaImpact: "H kanaliga qo'shimcha ta'sir yo'q", lossTemp: "—" }
  ],
  
  theoretical: {
    C:  { atoms: 6,  mass: 72.066,  percent: 23.254, source: "3×en (6×C)", eaChannel: "Organik C — asosiy mezon" },
    H:  { atoms: 24, mass: 24.192,  percent: 7.806,  source: "3×en (24×H)", eaChannel: "Organik H — to'liq to'ldiriladi" },
    N:  { atoms: 6,  mass: 84.042,  percent: 27.119, source: "3×en (6×N)", eaChannel: "Organik N — ligand sonini tasdiqlaydi" },
    S:  { atoms: 0,  mass: 0.000,   percent: 0.000,  source: "Sulfur guruhi yo'q", eaChannel: "Shovqin tekshirish" },
    O:  { atoms: 0,  mass: 0.000,   percent: 0.000,  source: "Kislorod guruhi yo'q", eaChannel: "Shovqin tekshirish" },
    Ni: { atoms: 1,  mass: 58.693,  percent: 18.939, source: "Markaziy Ni²⁺ atomi", eaChannel: "Yoqilg'ida qoldiq (ICP kerak)" },
    Cl: { atoms: 2,  mass: 70.900,  percent: 22.878, source: "Tashqi sfera Cl⁻", eaChannel: "CHNS-O da detektlanmaydi" }
  },

  experimentalRuns: [
    { id: "EA-24-201", date: "2024-09-05", method: "CHNS-O FlashSmart", C: 23.22, H: 7.78, N: 27.08, S: 0.01, recovery: 58.2, note: "Toza, yangi sintez qilingan [Ni(en)₃]Cl₂" },
    { id: "EA-24-202", date: "2024-09-05", method: "CHNS-O FlashSmart", C: 23.28, H: 7.83, N: 27.15, S: 0.02, recovery: 58.3, note: "Rekristallizatsiya qilingan (toza)" },
    { id: "EA-24-203", date: "2024-09-06", method: "CHNS-O Vario EL",    C: 22.50, H: 7.55, N: 26.20, S: 0.02, recovery: 56.3, note: "3 oy havoda saqlangan (qisman degradatsiya)" },
    { id: "EA-24-204", date: "2024-09-06", method: "CHNS-O FlashSmart", C: 15.60, H: 5.25, N: 18.10, S: 0.03, recovery: 39.0, note: "[Ni(en)₂]Cl₂ aralashmasi (2-en)" },
    { id: "EA-24-205", date: "2024-09-07", method: "CHNS-O FlashSmart", C: 23.25, H: 8.45, N: 27.12, S: 0.02, recovery: 58.8, note: "Gigroskopik nam yutilgan (H oshgan)" },
    { id: "EA-24-206", date: "2024-09-07", method: "CHNS-O FlashSmart", C: 0.00, H: 2.50, N: 0.00, S: 0.01, recovery: 2.5, note: "NiCl₂·6H₂O (en yo'q)" },
    { id: "BLANK-07",  date: "2024-09-05", method: "Blank (Empty Capsule)", C: 0.00, H: 0.02, N: 0.01, S: 0.00, recovery: 0.0, note: "Tizim tozaligi" },
    { id: "STD-SULFA", date: "2024-09-05", method: "Standard: Sulfanilamide", C: 41.82, H: 4.69, N: 16.28, S: 18.51, recovery: 99.9, note: "NIST kalibrlash standarti" }
  ],

  tgaSteps: [
    { start: 25,  end: 180, loss: 0.0,  event: "Barqaror zona (anhidrous)", color: "#10b981", eaCorrelation: "C, H, N signallari barqaror" },
    { start: 180, end: 260, loss: 19.4, event: "1-en yo'qolishi (Dechelatsiya I)", color: "#8b5cf6", eaCorrelation: "C: 23.3% → 15.5% | N: 27.1% → 18.1%" },
    { start: 260, end: 320, loss: 19.4, event: "2-en yo'qolishi (Dechelatsiya II)", color: "#8b5cf6", eaCorrelation: "C: 15.5% → 7.8%" },
    { start: 320, end: 400, loss: 19.4, event: "3-en yo'qolishi (Dechelatsiya III)", color: "#8b5cf6", eaCorrelation: "C: 7.8% → 0%" },
    { start: 400, end: 600, loss: 0.0,  event: "NiCl₂ qoldig'i", color: "#f59e0b", eaCorrelation: "C=0, H=0, N=0" },
    { start: 600, end: 800, loss: 18.9, event: "NiCl₂ parchalanishi (Cl₂ ↑ + NiO)", color: "#ef4444", eaCorrelation: "Qoldiq NiO" }
  ],

  relatedMethods: [
    { name: "CD spektroskopiya", role: "Δ va Λ enantiomerlarni farqlaydi (optik faollik)", eaAdvantage: "EA enantiomerlarni farqlamaydi, CD to'ldiradi", eaDisadvantage: "Elementar tarkib bermaydi", complementarity: "95%" },
    { name: "UV-Vis spektroskopiya", role: "d-d o'tishlar (³A₂_g → ³T₂_g, ³T₁_g) va LMCT aniqlaydi", eaAdvantage: "Ni²⁺ oktaedr geometriyasini tasdiqlaydi", eaDisadvantage: "Ligand sonini miqdoriy bermaydi", complementarity: "90%" },
    { name: "IQ spektroskopiya", role: "N-H (3300-3100 cm⁻¹), C-H (2950-2850 cm⁻¹), Ni-N (400-250 cm⁻¹)", eaAdvantage: "Xelat halqani tasdiqlaydi", eaDisadvantage: "C, H, N miqdorini bermaydi", complementarity: "88%" },
    { name: "Konduktometriya", role: "1:2 elektrolit (Λ_M ≈ 250 S·cm²/mol) — [Ni(en)₃]²⁺ + 2Cl⁻", eaAdvantage: "Tashqi sferadagi Cl⁻ sonini tasdiqlaydi", eaDisadvantage: "Organik fragment bermaydi", complementarity: "82%" },
    { name: "ICP-OES / AAS", role: "Ni miqdorini ppb darajasida o'lchaydi", eaAdvantage: "Metall tarkibini to'g'ridan-to'g'ri beradi", eaDisadvantage: "Ligandlarni o'lchamaydi", complementarity: "85%" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tanlash", desc: "To'q binafsha kristallar. Och binafsha yoki yashil ranglar (NiCl₂ aralashmasi) ishlatilmaydi. Rang — en ligandining to'liq koordinatsiyasi belgisi.", time: "1 daq", critical: true },
    { step: 2, title: "Havoda quritish", desc: "Filtr qog'ozi ustida xona haroratida 10-15 daqiqa quritiladi. Issiqlik ishlatilmaydi — xelat ligandlari issiqlikda uchmaydi, lekin termik degradatsiya xavfi bor.", time: "10-15 daq", critical: false },
    { step: 3, title: "Maydalash", desc: "Aqiq hovonchada mayda kukunga aylantiriladi. Xelat komplekslari barqaror bo'lgani uchun, NH₃ uchib ketmaydi.", time: "2-3 daq", critical: false },
    { step: 4, title: "Qalay kapsulaga joylash", desc: "5×9mm Sn kapsulaga 2.0-4.0 mg namuna tortiladi (mikro-tarozida).", time: "3 daq", critical: true },
    { step: 5, title: "Kapsulani yopish", desc: "Kapsula zich yopiladi — organik ligandlar yonib, CO₂ va H₂O ga aylanadi. Qochib ketmasligi kerak.", time: "30 son", critical: true },
    { step: 6, title: "Analizatorga kiritish", desc: "Standart CHNS-O sharoitida analiz qilinadi. C, H, N — uchala element ham o'lchanadi.", time: "5-8 daq (analiz)", critical: false }
  ],

  combustionPrinciple: {
    oxidationTemp: "1050°C",
    reductionTemp: "650°C (Cu)",
    products: {
      C: "CO₂ (TCD detektori)",
      H: "H₂O (TCD detektori)",
      N: "N₂ (TCD detektori)",
      S: "SO₂ (TCD detektori)",
      Cl: "HCl (standart TCD da detektlanmaydi)",
      Ni: "NiO (qattiq qoldiq)"
    },
    equations: [
      { reactant: "[Ni(en)₃]Cl₂", process: "+ O₂ (1050°C)", products: "NiO (qattiq) + 6CO₂ + 12H₂O + 3N₂ + 2HCl" },
      { reactant: "en ligandlari (3×)", process: "→ O₂", products: "6CO₂ + 12H₂O + 3N₂ — barchasi TCD da detektlanadi" },
      { reactant: "Ni²⁺", process: "Kamerasida qoldiq", products: "NiO — ICP-OES bilan tasdiqlanadi" }
    ]
  },

  // Xelat halqasi tafsilotlari
  chelateRingInfo: {
    ringSize: "5 a'zoli halqa",
    atoms: ["Ni", "N", "C", "C", "N"],
    biteAngle: "85.5°",
    conformation: "gauche (λ yoki δ)",
    advantage: "Entropik ustunlik: 1 ta en = 2 ta NH₃ o'rniga, erkin molekula soni 1 taga ortadi"
  }
}

// Yordamchi: n ta en ligandi uchun nazariy C, H, N % hisoblash
function calculateChelateProperties(n, waterN = 0) {
  const anhydrousMass = ATOMIC_MASSES.Ni + 2 * ATOMIC_MASSES.Cl // 129.593 (NiCl₂)
  const enMass = n * EN_MOLAR_MASS
  const waterMass = waterN * WATER_MOLAR_MASS
  const total = anhydrousMass + enMass + waterMass
  const cMass = n * 2 * ATOMIC_MASSES.C
  const hMass = n * 8 * ATOMIC_MASSES.H + waterN * 2 * ATOMIC_MASSES.H
  const nMass = n * 2 * ATOMIC_MASSES.N
  const niMass = ATOMIC_MASSES.Ni
  const clMass = 2 * ATOMIC_MASSES.Cl
  const oMass = waterN * ATOMIC_MASSES.O
  return {
    total: parseFloat(total.toFixed(3)),
    C_pct: parseFloat(((cMass / total) * 100).toFixed(3)),
    H_pct: parseFloat(((hMass / total) * 100).toFixed(3)),
    N_pct: parseFloat(((nMass / total) * 100).toFixed(3)),
    Ni_pct: parseFloat(((niMass / total) * 100).toFixed(3)),
    Cl_pct: parseFloat(((clMass / total) * 100).toFixed(3)),
    O_pct: parseFloat(((oMass / total) * 100).toFixed(3)),
    enPct: parseFloat(((enMass / total) * 100).toFixed(2)),
    waterPct: parseFloat(((waterMass / total) * 100).toFixed(2))
  }
}

export default function NiEn3Cl2Page() {
  const [activeRun, setActiveRun] = useState("EA-24-201")
  const [enN, setEnN] = useState(3)
  const [waterN, setWaterN] = useState(0)
  const [customC, setCustomC] = useState(23.25)
  const [selectedLigandType, setSelectedLigandType] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)

  const calc = useMemo(() => calculateChelateProperties(enN, waterN), [enN, waterN])

  // Barcha xelat komplekslari (n=0..4)
  const allChelates = useMemo(() => {
    return [0, 1, 2, 3, 4].map(n => ({
      n,
      ...calculateChelateProperties(n, 0),
      name: n === 0 ? "NiCl₂" : n === 1 ? "[Ni(en)]Cl₂" : n === 2 ? "[Ni(en)₂]Cl₂" : n === 3 ? "[Ni(en)₃]Cl₂ ✓" : "[Ni(en)₄]Cl₂ (mavjud emas)"
    }))
  }, [])

  // Gidrat variantlari (n=3, waterN=0..3)
  const allHydrates = useMemo(() => {
    return [0, 1, 2, 3].map(n => ({
      n,
      ...calculateChelateProperties(3, n),
      name: n === 0 ? "Anhidrous ✓" : n === 1 ? "Monogidrat" : n === 2 ? "Digidrat" : "Trigidrat"
    }))
  }, [])

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const dC = Math.abs(run.C - COMPOUND.theoretical.C.percent)
  const dH = Math.abs(run.H - COMPOUND.theoretical.H.percent)
  const dN = Math.abs(run.N - COMPOUND.theoretical.N.percent)
  const statusColor = (dC <= 0.3 && dH <= 0.3 && dN <= 0.3) 
    ? "text-green-400" 
    : (dC <= 1.0 && dH <= 0.5 && dN <= 1.0) 
      ? "text-yellow-400" 
      : "text-red-400"

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
            <span className="text-fuchsia-400 font-semibold">[Ni(en)₃]Cl₂</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-fuchsia-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                {COMPOUND.iupac} • M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
              </p>
              <p className="text-purple-500 text-xs mt-1 font-mono">
                Kengaytirilgan: {COMPOUND.formulaExpanded}
              </p>
              <p className="text-purple-500 text-xs mt-1">
                {COMPOUND.color} • {COMPOUND.stability}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded bg-fuchsia-900/30 border border-fuchsia-700/50 text-fuchsia-400 text-[10px] uppercase tracking-wide">Xelat Kompleks</span>
                <span className="px-2 py-1 rounded bg-pink-900/30 border border-pink-700/50 text-pink-400 text-[10px] uppercase tracking-wide">Bidentat Ligand</span>
                <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Organik C, H, N</span>
                <span className="px-2 py-1 rounded bg-violet-900/30 border border-violet-700/50 text-violet-400 text-[10px] uppercase tracking-wide">Δ/Λ Enantiomer</span>
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
        <div className="bg-gradient-to-r from-fuchsia-900/40 to-purple-900/40 border border-fuchsia-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (EA uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">[Ni(en)₃]Cl₂</strong> — nikel(II) ning uchta etilendiamin (en = H₂N-CH₂-CH₂-NH₂) ligandlari bilan hosil qilgan oktaedr xelat kompleksi. Bu birikma EA tahlilida <strong className="text-fuchsia-300">noyob o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-fuchsia-500 text-xs md:text-sm">
                <li><strong className="text-white">C, H, N — uchala organik element ham</strong> mavjud — EA ning to'liq testi</li>
                <li><strong className="text-white">Xelat effekti</strong> tufayli havoda juda barqaror — namuna tayyorlash oson</li>
                <li>Har bir en 2 ta N va 8 ta H beradi, jami <strong className="text-white">24 H, 6 C, 6 N</strong></li>
                <li>Cl tashqi sferada — standart CHNS-O da detektlanmaydi</li>
                <li>Δ va Λ enantiomerlari bor, lekin <strong className="text-white">EA ularni farqlamaydi</strong> — bu metodning cheklovi</li>
                <li>5 a'zoli xelat halqasi — eng barqaror halqa o'lchami</li>
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
            [Ni(en)₃]Cl₂ organik ligandlarga ega bo'lgani uchun, yoqish natijasida <strong className="text-fuchsia-300">CO₂, H₂O va N₂</strong> — uchala gaz ham TCD detektorlari orqali o'lchanadi. Bu avvalgi ammin komplekslaridan farqli o'laroq, EA ning <strong className="text-fuchsia-300">barcha kanallarini to'liq sinash imkonini</strong> beradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">1. Yoqish kamerasi</div>
              <div className="text-2xl font-mono text-orange-400">{COMPOUND.combustionPrinciple.oxidationTemp}</div>
              <div className="text-xs text-purple-300 mt-2">O₂ + 1050°C — organik → CO₂ + H₂O + N₂</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">2. Reduksiya kamerasi</div>
              <div className="text-2xl font-mono text-red-400">{COMPOUND.combustionPrinciple.reductionTemp}</div>
              <div className="text-xs text-purple-300 mt-2">Cu — NOₓ larni N₂ ga aylantiradi</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">3. Deteksiya</div>
              <div className="text-2xl font-mono text-blue-400">TCD</div>
              <div className="text-xs text-purple-300 mt-2">CO₂, H₂O, N₂ — uchchovlon</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-fuchsia-400 font-bold text-xs uppercase mb-3">Bu birikma uchun yoqish reaksiyalari:</h3>
            <div className="space-y-3 font-mono text-xs">
              {COMPOUND.combustionPrinciple.equations.map((eq, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-purple-900/30 rounded border-l-4 border-fuchsia-500">
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
            <span>📐</span> Nazariy element tarkibi (CHNS-O + Ni + Cl)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            E'tibor bering: <strong className="text-fuchsia-300">C, H, N — uchala element ham organik ligandda</strong>. S va O yo'q (anhidrous shakl).
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
                    <td className="py-3 pl-2 font-bold text-fuchsia-400">{el}</td>
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
                <tr className="bg-fuchsia-900/20 font-bold border-t border-fuchsia-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center text-white">39</td>
                  <td className="py-3"></td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3b. XELAT HALQASI INFO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔗</span> Xelat halqasi tuzilishi (en ligandining EA dagi ahamiyati)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/50 p-5 rounded-xl border border-fuchsia-700/30">
              <h3 className="text-fuchsia-400 font-bold text-sm mb-3">5 a'zoli halqa tafsilotlari:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Halqa o'lchami:</span>
                  <span className="text-white font-mono">{COMPOUND.chelateRingInfo.ringSize}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Atomlar ketma-ketligi:</span>
                  <div className="flex gap-1">
                    {COMPOUND.chelateRingInfo.atoms.map((a, i) => (
                      <span key={i} className="px-2 py-1 bg-fuchsia-900/40 border border-fuchsia-700/30 rounded text-xs font-mono text-white">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Bite angle:</span>
                  <span className="text-white font-mono">{COMPOUND.chelateRingInfo.biteAngle}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Konformatsiya:</span>
                  <span className="text-white font-mono">{COMPOUND.chelateRingInfo.conformation}</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-950/50 p-5 rounded-xl border border-fuchsia-700/30">
              <h3 className="text-fuchsia-400 font-bold text-sm mb-3">EA uchun ahamiyati:</h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Har bir en ligand EA da <strong className="text-white">2 ta C, 8 ta H, 2 ta N</strong> beradi. 3 ta en bo'lgani uchun jami <strong className="text-fuchsia-300">6C, 24H, 6N</strong> — bu EA ning to'liq testi.
              </p>
              <div className="mt-4 p-3 bg-fuchsia-900/20 rounded border border-fuchsia-700/30">
                <p className="text-[11px] text-purple-200 italic">
                  {COMPOUND.chelateRingInfo.advantage}
                </p>
              </div>
              <p className="text-xs text-purple-300 mt-3">
                <strong className="text-yellow-300">Xelat halqa barqarorligi:</strong> Monodentat NH₃ ga qaraganda 10⁸-10¹⁰ marta kuchliroq bog'lanish. Shuning uchun EA tayyorlashda NH₃ uchib ketishi kabi muammolar yo'q.
              </p>
            </div>
          </div>
        </div>

        {/* 4. XELAT SONI SIMULYATSIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🧬</span> Xelat ligandi soni simulyatsiyasi
            </h2>
            <div className="flex gap-2">
              <span className="text-xs text-fuchsia-400 bg-fuchsia-950/50 px-3 py-1 rounded border border-fuchsia-700/30">
                n (en) = {enN}
              </span>
              <span className="text-xs text-blue-400 bg-blue-950/50 px-3 py-1 rounded border border-blue-700/30">
                m (H₂O) = {waterN}
              </span>
            </div>
          </div>

          <p className="text-sm text-purple-300 mb-6">
            en ligandlari soni (n) o'zgarganda <strong className="text-yellow-300">C%, H%, N% — uchala element ham</strong> chiziqli o'zgaradi. Bu EA uchun <strong className="text-fuchsia-300">eng to'liq test</strong>, chunki uchala kanal ham sinab ko'riladi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-purple-950/60 p-6 rounded-xl border border-purple-700/30">
                <label className="block text-xs text-purple-400 mb-2">Xelat en soni (n):</label>
                <input 
                  type="range" min="0" max="4" step="1" 
                  value={enN} 
                  onChange={(e) => setEnN(Number(e.target.value))}
                  className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500 mb-2"
                />
                <div className="flex justify-between text-xs font-mono text-purple-500 mb-6">
                  <span>0 (NiCl₂)</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3 (✓)</span>
                  <span>4</span>
                </div>

                <label className="block text-xs text-purple-400 mb-2">Kristall suv soni (m):</label>
                <input 
                  type="range" min="0" max="3" step="1" 
                  value={waterN} 
                  onChange={(e) => setWaterN(Number(e.target.value))}
                  className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-2"
                />
                <div className="flex justify-between text-xs font-mono text-purple-500 mb-6">
                  <span>0 (anh.)</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">Mol. massa</div>
                    <div className="text-xl font-mono text-white mt-1">{calc.total} <span className="text-xs text-purple-500">g/mol</span></div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-fuchsia-400 uppercase">en ulushi</div>
                    <div className="text-xl font-mono text-fuchsia-400 mt-1">{calc.enPct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-yellow-400 uppercase">%C</div>
                    <div className="text-xl font-mono text-yellow-400 mt-1">{calc.C_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-green-400 uppercase">%H</div>
                    <div className="text-xl font-mono text-green-400 mt-1">{calc.H_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-cyan-400 uppercase">%N</div>
                    <div className="text-xl font-mono text-cyan-400 mt-1">{calc.N_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-red-400 uppercase">%Ni</div>
                    <div className="text-xl font-mono text-red-400 mt-1">{calc.Ni_pct}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                <h3 className="text-fuchsia-400 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                  <span>🧩</span> Ligand turlari
                </h3>
                <div className="space-y-2">
                  {COMPOUND.ligandTypes.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedLigandType(i)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedLigandType === i 
                          ? "bg-fuchsia-900/40 border-fuchsia-500" 
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
                {[0, 5, 10, 15, 20, 25, 30].map(v => (
                  <g key={v}>
                    <line x1="40" y1={210 - (v/30)*180} x2="380" y2={210 - (v/30)*180} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="3,3" />
                    <text x="35" y={214 - (v/30)*180} textAnchor="end" fontSize="9" fill="#a78bfa">{v}%</text>
                  </g>
                ))}
                
                {/* Nazariy chiziq (n=3) - %C uchun */}
                {(() => {
                  const targetC = 23.254
                  const y = 210 - (targetC/30) * 180
                  return (
                    <g>
                      <line x1="40" y1={y} x2="380" y2={y} stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,3" />
                      <text x="385" y={y+3} fontSize="8" fill="#fbbf24">n=3 (naz. %C)</text>
                    </g>
                  )
                })()}

                {/* Trend Line — %C vs n */}
                <polyline 
                  fill="none" stroke="#d946ef" strokeWidth="2.5" opacity="0.7"
                  points={[0,1,2,3,4].map(n => {
                    const props = calculateChelateProperties(n, 0)
                    const x = 40 + (n/4) * 340
                    const y = 210 - (props.C_pct / 30) * 180
                    return `${x},${y}`
                  }).join(" ")}
                />

                {[0,1,2,3,4].map(n => {
                  const props = calculateChelateProperties(n, 0)
                  const x = 40 + (n/4) * 340
                  const y = 210 - (props.C_pct / 30) * 180
                  const isActive = n === enN
                  return (
                    <g key={n} style={{ cursor: 'pointer' }} onClick={() => setEnN(n)}>
                      <circle cx={x} cy={y} r={isActive ? 7 : 4} 
                        fill={isActive ? "#fbbf24" : "#d946ef"} 
                        stroke={isActive ? "#fff" : "#d946ef"} 
                        strokeWidth={isActive ? 2 : 1} />
                      {isActive && (
                        <>
                          <line x1={x} y1={y} x2={x} y2="210" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
                          <rect x={x-34} y={y-32} width="68" height="22" rx="4" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1" />
                          <text x={x} y={y-17} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">%C: {props.C_pct.toFixed(2)}</text>
                        </>
                      )}
                    </g>
                  )
                })}

                <line x1="40" y1="210" x2="380" y2="210" stroke="#a78bfa" strokeWidth="1" />
                {[0,1,2,3,4].map(n => (
                  <text 
                    key={n} 
                    x={40 + (n/4)*340} 
                    y="225" 
                    textAnchor="middle" 
                    fontSize="10" 
                    fill={n===enN ? "#fbbf24" : "#64748b"} 
                    fontWeight={n===enN ? "bold" : "normal"}
                  >
                    n={n}
                  </text>
                ))}
                <text x="210" y="238" textAnchor="middle" fontSize="9" fill="#a78bfa">Xelat en soni (n) | NiCl₂ asosida</text>
              </svg>
            </div>
          </div>
        </div>

        {/* 5. XELATLAR TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>📊</span> Barcha [Ni(en)ₙ]Cl₂ xelatlari taqqoslanmasi
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            n soni o'zgarganda EA natijalari qanday o'zgaradi? C%, H%, N% — uchala qiymat ham chiziqli bog'liq.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 uppercase tracking-wider">
                  <th className="py-2 text-left pl-2">Kompleks</th>
                  <th className="py-2 text-center">M (g/mol)</th>
                  <th className="py-2 text-center text-yellow-400">%C</th>
                  <th className="py-2 text-center text-green-400">%H</th>
                  <th className="py-2 text-center text-cyan-400">%N</th>
                  <th className="py-2 text-center text-red-400">%Ni</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {allChelates.map(a => {
                  const isTarget = a.n === 3
                  const isCurrent = a.n === enN
                  return (
                    <tr 
                      key={a.n}
                      onClick={() => setEnN(a.n)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-fuchsia-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-fuchsia-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {a.name}
                      </td>
                      <td className="py-2 text-center font-mono">{a.total}</td>
                      <td className="py-2 text-center font-mono text-yellow-400 font-bold">{a.C_pct}</td>
                      <td className="py-2 text-center font-mono text-green-400">{a.H_pct}</td>
                      <td className="py-2 text-center font-mono text-cyan-400">{a.N_pct}</td>
                      <td className="py-2 text-center font-mono text-red-400">{a.Ni_pct}</td>
                      <td className="py-2 text-[10px] italic text-purple-400">
                        {isTarget ? "✓ Maqsad" : isCurrent ? "🎯 Joriy" : a.n === 4 ? "✗ Mavjud emas" : "—"}
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
            <span>💧</span> Gidrat variantlari (n=3 doimiy)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            [Ni(en)₃]Cl₂ ning anhidrous shakli eng keng tarqalgan. Ammo ba'zida suv bilan birga kristallanishi mumkin — bu H% ni oshiradi, C% va N% ni kamaytiradi.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 uppercase tracking-wider">
                  <th className="py-2 text-left pl-2">Gidrat</th>
                  <th className="py-2 text-center">M (g/mol)</th>
                  <th className="py-2 text-center text-yellow-400">%C</th>
                  <th className="py-2 text-center text-green-400">%H</th>
                  <th className="py-2 text-center text-cyan-400">%N</th>
                  <th className="py-2 text-center">H₂O %</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {allHydrates.map(h => {
                  const isTarget = h.n === 0
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
                      <td className="py-2 text-center font-mono text-yellow-400 font-bold">{h.C_pct}</td>
                      <td className="py-2 text-center font-mono text-green-400">{h.H_pct}</td>
                      <td className="py-2 text-center font-mono text-cyan-400">{h.N_pct}</td>
                      <td className="py-2 text-center font-mono text-blue-400">{h.waterPct}</td>
                      <td className="py-2 text-[10px] italic text-purple-400">
                        {isTarget ? "✓ Asosiy" : isCurrent ? "🎯 Joriy" : "—"}
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
            Turli sharoitlarda o'tkazilgan EA yugurishlari. <strong className="text-fuchsia-300">Recovery ~58%</strong> — bu normal, chunki Cl (22.9%) va Ni (18.9%) detektlanmaydi!
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
                      ? "bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20" 
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
                  <div className="flex justify-between items-center p-2 bg-yellow-900/20 rounded border border-yellow-500/20">
                    <span className="text-sm text-yellow-400 font-medium">Carbon (C)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.C.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dC <= 0.3 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 23.25% | Δ: {dC.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-500 font-medium">Hydrogen (H)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.H.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dH <= 0.3 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 7.81% | Δ: {dH.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-cyan-900/20 rounded border border-cyan-500/20">
                    <span className="text-sm text-cyan-400 font-medium">Nitrogen (N)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.N.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dN <= 0.3 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 27.12% | Δ: {dN.toFixed(2)}%
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
                    className="font-mono text-white text-sm hover:text-fuchsia-400 cursor-pointer"
                  >
                    {run.recovery}% ℹ️
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : (dC <= 0.3 && dH <= 0.3 && dN <= 0.3)
                    ? "bg-green-900/30 border-green-700/30"
                    : (dC <= 1.0 && dH <= 0.5 && dN <= 1.0)
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : (dC <= 0.3 && dH <= 0.3 && dN <= 0.3) ? "text-green-400" : (dC <= 1.0 && dH <= 0.5 && dN <= 1.0) ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : (dC <= 0.3 && dH <= 0.3 && dN <= 0.3) ? "✓ Toza namuna" : (dC <= 1.0 && dH <= 0.5 && dN <= 1.0) ? "⚠ Chegaraviy" : "✗ Ifloslangan"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    (dC <= 0.3 && dH <= 0.3 && dN <= 0.3)
                      ? "Namuna tarkibi [Ni(en)₃]Cl₂ formulaga to'liq mos. 3 ta en ligandi to'liq saqlangan."
                      : (dC <= 1.0 && dH <= 0.5 && dN <= 1.0)
                        ? "C, H, N miqdori nazariyga yaqin. Ozroq degradatsiya yoki nam yutilishi mumkin."
                        : dC > 5
                          ? "Kapsula ifloslangan — C juda yuqori. Qayta tayyorlang."
                          : run.C < 10
                            ? "en ligandi yo'qotilgan. [Ni(en)₂]Cl₂ yoki NiCl₂ aralashmasi bo'lishi mumkin."
                            : "Namuna ifloslangan yoki boshqa nikel kompleksi."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Tizim tozaligi tekshirildi. C va N nolga yaqin bo'lishi shart."
                      : "Kalibrlash standarti. C, H, N qiymatlari nazariyga mos kelishi kerak."
                  )}
                </p>
              </div>
            </div>

            {/* %C vizual taqqoslash */}
            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-fuchsia-400 mb-4 flex justify-between">
                <span>%C Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Target: 23.25%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const val = r.C
                  const heightPct = Math.min((val / 30) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(2)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-yellow-500/30 z-0" style={{ bottom: `${(23.254/30)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : 'bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : 'text-fuchsia-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-fuchsia-500 rounded"></span> Namuna</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-500 rounded"></span> Blank</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> Standart</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-yellow-500/50"></span> Nazariy (23.25%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECOVERY MODAL */}
        {showRecoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowRecoveryModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-fuchsia-400 mb-3 flex items-center gap-2">
                <span>📈</span> Nima uchun Recovery atigi ~58%?
              </h3>
              <p className="text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-white">[Ni(en)₃]Cl₂</strong> uchun recovery past bo'lishi <strong className="text-fuchsia-300">tabiiy va normal</strong>. Standart CHNS-O analizatori Ni va Cl ni o'lchamaydi.
              </p>
              <div className="bg-purple-900/40 p-4 rounded-lg font-mono text-xs mb-3">
                <div className="text-purple-400">EA detektlaydi:</div>
                <div className="text-green-400">C (23.25%) + H (7.81%) + N (27.12%) = <strong>58.18%</strong></div>
                <div className="mt-2 text-purple-400">EA detektlay olmaydi:</div>
                <div className="text-red-300">Ni (18.94%) + Cl (22.88%) = <strong>41.82%</strong></div>
                <div className="mt-2 text-white">JAMI: 100%</div>
                <div className="text-fuchsia-400 mt-2">✓ Recovery 58% = Muvaffaqiyatli natija!</div>
              </div>
              <p className="text-xs text-purple-300 italic mb-4">
                Cl uchun <strong>Schöniger usuli</strong>, Ni uchun <strong>ICP-OES</strong> yoki <strong>AAS</strong> qo'llaniladi.
              </p>
              <button 
                onClick={() => setShowRecoveryModal(false)}
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-2 rounded-lg transition-colors text-sm"
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
            Xelat ligandlari bosqichma-bosqich yo'qoladi (19.4% har bir en uchun). EA bu yo'qotishlarni C, H, N kamayishi orqali ko'rsatadi.
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
                d="M 50 20 L 180 20 Q 200 20 210 50 L 230 80 Q 240 95 255 95 L 285 95 Q 300 95 310 125 L 330 155 Q 340 170 355 170 L 385 170 Q 400 170 410 200 L 440 220 L 510 220 Q 525 220 540 200 L 580 200" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="115" y="15" textAnchor="middle" fill="#10b981">EA: %C=23.3, %H=7.8, %N=27.1</text>
                
                <line x1="230" y1="80" x2="230" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="230" y="235" textAnchor="middle" fill="#8b5cf6">~240°C</text>
                <text x="250" y="70" fill="#8b5cf6">-1 en</text>

                <line x1="330" y1="155" x2="330" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="330" y="235" textAnchor="middle" fill="#8b5cf6">~300°C</text>
                <text x="350" y="145" fill="#8b5cf6">-2 en</text>

                <line x1="410" y1="200" x2="410" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="410" y="235" textAnchor="middle" fill="#8b5cf6">~380°C</text>
                <text x="430" y="190" fill="#8b5cf6">-3 en</text>

                <text x="480" y="215" textAnchor="middle" fill="#f59e0b">NiCl₂</text>

                <line x1="540" y1="200" x2="540" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="540" y="235" textAnchor="middle" fill="#ef4444">~750°C</text>
                <text x="560" y="195" fill="#ef4444">Cl₂ ↑ + NiO</text>
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
                <div className="text-[10px] text-fuchsia-300 mt-2 italic">EA korrelyatsiyasi: {step.eaCorrelation}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-fuchsia-900/40 to-purple-900/40 border border-fuchsia-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> EA ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Ni(en)₃]Cl₂ uchun EA ni qo'shimcha usullar bilan birgalikda ishlatish formulani to'liq tasdiqlaydi. Ayniqsa CD — enantiomerlarni farqlash uchun muhim, chunki EA ularni ajratmaydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-fuchsia-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-fuchsia-300">{m.name}</h3>
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

          <div className="mt-5 bg-fuchsia-900/20 border border-fuchsia-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-fuchsia-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">EA (C, H, N) + CD (Δ/Λ enantiomerlar) + UV-Vis (d-d) + IQ (C-H, Ni-N) + ICP-OES (Ni) + Konduktometriya (1:2)</strong> — oltita metod birgalikda [Ni(en)₃]Cl₂ ning to'liq kimyoviy va optik tasvirini beradi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> Namuna tayyorlash bosqichlari (EA uchun)
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Ni(en)₃]Cl₂ — xelat effekti tufayli juda barqaror. NH₃ uchib ketishi kabi muammolar yo'q. Shuning uchun tayyorlash nisbatan oson. Har bir qadamni bosib, tafsilotlarni ko'ring.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-fuchsia-900/40 border-fuchsia-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-fuchsia-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-fuchsia-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-fuchsia-900/20 border border-fuchsia-500/30 rounded-2xl p-6">
          <h3 className="text-fuchsia-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Eksperimental %C validatsiya kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan %C qiymatini kiriting va xelat shaklini aniqlang.
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="block text-xs text-purple-400">O'lchangan %C qiymati:</label>
              <input 
                type="number" step="0.01" value={customC}
                onChange={(e) => setCustomC(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-fuchsia-500 outline-none transition-colors"
              />
              <div className="text-[10px] text-purple-500 mt-1">
                Nazariy qiymat: {COMPOUND.theoretical.C.percent.toFixed(3)}% (3 ta en uchun)
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {(() => {
                const diff = Math.abs(customC - 23.254)
                let res = { s: "", c: "", m: "", icon: "" }
                
                if (diff < 0.5) res = { 
                  s: "TRIS-XELAT [Ni(en)₃]Cl₂", 
                  c: "text-green-400", 
                  m: "Namuna toza [Ni(en)₃]Cl₂ tarkibiga ega. 3 ta etilendiamin to'liq saqlangan.",
                  icon: "✓"
                }
                else if (customC < 18 && customC > 13) res = { 
                  s: "BIS-XELAT [Ni(en)₂]Cl₂", 
                  c: "text-yellow-400", 
                  m: "1 ta en yo'qotilgan. [Ni(en)₂]Cl₂ aralashmasi mavjud.",
                  icon: "⚠"
                }
                else if (customC < 13 && customC > 5) res = { 
                  s: "MONO-XELAT [Ni(en)]Cl₂", 
                  c: "text-orange-400", 
                  m: "2 ta en yo'qotilgan. Kuchli degradatsiya yuz bergan.",
                  icon: "⚠"
                }
                else if (customC < 5 && customC > 0.5) res = { 
                  s: "NICKEL X LORID", 
                  c: "text-red-400", 
                  m: "Barcha en ligandlari yo'qotilgan. NiCl₂ holatiga o'tgan.",
                  icon: "✗"
                }
                else res = { 
                  s: "IFLOSLANGAN", 
                  c: "text-red-400", 
                  m: "Namuna haddan tashqari uglerodli modda bilan ifloslangan. Qayta tahlil kerak.",
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

        {/* 11. QIZIQ FAKT - Cl va Ni cheklovi */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> EA ning chegarasi: Nima uchun Ni va Cl ni o'lchamaydi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                [Ni(en)₃]Cl₂ EA da yaxshi o'rganilgan bo'lsa ham, <strong className="text-white">Ni va Cl elementlari</strong> standart CHNS-O analizatorida detektlanmaydi:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li>C → CO₂ (gaz) → TCD detektlanadi</li>
                <li>H → H₂O (gaz) → TCD detektlanadi</li>
                <li>N → N₂ (gaz) → TCD detektlanadi (6 ta N — yuqori signal)</li>
                <li><strong className="text-red-300">Ni → NiO (qattiq qoldiq)</strong> — TCD detektlay olmaydi!</li>
                <li><strong className="text-red-300">Cl → HCl (gaz)</strong> — standart TCD buni qayd etmaydi!</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Shuning uchun EA ning roli — <strong>ligand tarkibini tasdiqlash</strong>, metall va halogenlarni emas.
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
                  <span>23.25%</span>
                </div>
                <div className="flex justify-between">
                  <span>− H:</span>
                  <span>7.81%</span>
                </div>
                <div className="flex justify-between">
                  <span>− N:</span>
                  <span>27.12%</span>
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
                  <span className="text-red-400">= Ni + Cl (qoldiq):</span>
                  <span className="text-red-400 font-bold">41.82%</span>
                </div>
                <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-700/30 text-red-200 text-[10px]">
                  Nazariy Ni% + Cl% = 18.94% + 22.88% = 41.82% — qoldiq bilan mos keladi ✓
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
              <p className="text-xs text-purple-200">C, H, N — uchala organik element ham mavjud, EA ning to'liq sinovi. Xelat effekti tufayli namuna barqaror, tayyorlash oson.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Recovery atigi ~58% — Ni va Cl detektlanmaydi. EA enantiomerlarni (Δ/Λ) farqlamaydi — CD qo'shimcha kerak.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">CD (enantiomerlar), UV-Vis (d-d), IQ (xelat halqa), ICP-OES (Ni), Konduktometriya (1:2) — to'liq tasdiqlash uchun birlashtiriladi.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/element-analiz" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Element Analiz metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-sm bg-fuchsia-600 hover:bg-fuchsia-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • [Ni(en)₃]Cl₂ • Element Analizi moduli</p>
          <p className="mt-1">Manbalar: IUPAC Atomic Weights 2021, Vogel's Textbook, NIST SRP, Schwarzenbach (1930)</p>
        </div>
      </footer>
    </main>
  )
}