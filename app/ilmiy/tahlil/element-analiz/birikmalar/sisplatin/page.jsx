"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// Pt(NH₃)₂Cl₂ (Cisplatin/Transplatin) — ELEMENT ANALIZI (EA) MAHSUS SAHIFASI
// Manbalar: IUPAC Atomic Weights 2021, Vogel's Quantitative Chemical Analysis
// Xususiyat: Neytral kompleks, og'ir metall (Pt), geometrik izomerlar
// Maqsad: Faqat EA tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Pt: 195.084, Cl: 35.450, N: 14.007, H: 1.008,
  C: 12.011, O: 15.999, S: 32.065  // C, O, S — faqat blank/limit tekshirish uchun
}

const AMMONIA_MOLAR_MASS = ATOMIC_MASSES.N + 3 * ATOMIC_MASSES.H  // 17.031

const COMPOUND = {
  formulaHTML: "Pt(NH<sub>3</sub>)<sub>2</sub>Cl<sub>2</sub>",
  formulaPlain: "Pt(NH3)2Cl2",
  iupac: "Diammindixloroplatina(II)",
  molarMass: 300.045,
  casNumber: "15663-27-1 (cis)",
  color: "cis-: to'q sariq kristallar; trans-: och sariq kristallar",
  stability: "qattiq holda barqaror, ammo yorug'lik ta'sirida fotolabil. Suvda sekin gidrolizlanadi.",
  
  historicalFact: {
    title: "Cisplatin — tasodifiy kashfiyotdan saratonga qarshi doriga",
    text: "1965-yilda Michigan shtat universitetida biofizik Barnett Rosenberg E. coli bakteriyalarini elektr maydon bilan o'stirish tajribasini o'tkazayotganda, bakteriyalar bo'linishdan to'xtaganini kuzatdi. Keyinchalik ma'lum bo'ldiki, platina elektrodlaridan hosil bo'lgan cis-Pt(NH₃)₂Cl₂ (cisplatin) bu effektga sababchi edi. Trans izomer esa faol emas edi — bu geometrik izomerlarning biologik faolligi qanday farq qilishini ko'rsatdi. 1978-yilda FDA tomonidan tasdiqlangan cisplatin bugungi kunda saraton kasalligiga qarshi eng ko'p ishlatiladigan dorilardan biri. EA tahlilida bu birikma juda qiziq: tarkibida C, S, O yo'q, faqat N (9.34%) va H (2.02%) o'lchanadi, recovery atigi ~11%, va eng muhimi — EA cis va trans izomerlarni FARQLAY OLMAYDI.",
    year: "1965-1978"
  },

  // Koordinatsion va geometrik tafsilotlar
  ligandTypes: [
    { type: "Koordinatsion NH₃", count: 2, role: "Pt²⁺ ga kvadrat-tekis geometriyada bog'langan (d⁸ elektron konfiguratsiyasi)", eaImpact: "N kanalida past signal (9.34%) — yuqori sezgirlik talab qiladi", lossTemp: "200-270°C" },
    { type: "Koordinatsion Cl⁻", count: 2, role: "Pt²⁺ ga bevosita bog'langan (tashqi sfera EMAS)", eaImpact: "CHNS-O da detektlanmaydi — Schöniger yoki Oksigen kolbasi kerak", lossTemp: "350-500°C (Cl₂ ↑)" },
    { type: "Tashqi sfera", count: 0, role: "Neytral kompleks — ionlar yo'q", eaImpact: "Konduktometriyada Λ_M ≈ 0", lossTemp: "—" }
  ],

  // Geometrik izomerlar — EA ning asosiy cheklovi
  geometricIsomers: [
    { name: "cis-Pt(NH₃)₂Cl₂", common: "Cisplatin", angle: "90°", color: "to'q sariq", anticancer: "✓ Faol", eaSignal: "N: 9.34%, H: 2.02%", difference: "EA da trans bilan bir xil!" },
    { name: "trans-Pt(NH₃)₂Cl₂", common: "Transplatin", angle: "180°", color: "och sariq", anticancer: "✗ Faol emas", eaSignal: "N: 9.34%, H: 2.02%", difference: "EA da cis bilan bir xil!" }
  ],
  
  theoretical: {
    C:  { atoms: 0, mass: 0.000,   percent: 0.000,  source: "Organik fragment yo'q", eaChannel: "Shovqin tekshirish" },
    H:  { atoms: 6,  mass: 6.048,   percent: 2.016,  source: "2×koordinatsion NH₃", eaChannel: "Past signal — sezgirlik muhim" },
    N:  { atoms: 2,  mass: 28.014,  percent: 9.336,  source: "2×koordinatsion NH₃", eaChannel: "Yagona organik element" },
    S:  { atoms: 0,  mass: 0.000,   percent: 0.000,  source: "Sulfur guruhi yo'q", eaChannel: "Shovqin tekshirish" },
    O:  { atoms: 0,  mass: 0.000,   percent: 0.000,  source: "Kislorod guruhi yo'q", eaChannel: "Shovqin tekshirish" },
    Pt: { atoms: 1,  mass: 195.084, percent: 65.019, source: "Markaziy Pt²⁺ atomi", eaChannel: "Yoqilg'ida qoldiq (ICP kerak)" },
    Cl: { atoms: 2,  mass: 70.900,  percent: 23.627, source: "Koordinatsion Cl⁻ (tashqi sfera emas!)", eaChannel: "CHNS-O da detektlanmaydi" }
  },

  experimentalRuns: [
    { id: "EA-24-275", date: "2024-10-10", method: "CHNS-O FlashSmart", C: 0.01, H: 2.00, N: 9.31, S: 0.01, recovery: 11.3, note: "Toza cisplatin (sariq)" },
    { id: "EA-24-276", date: "2024-10-10", method: "CHNS-O FlashSmart", C: 0.02, H: 2.03, N: 9.36, S: 0.01, recovery: 11.4, note: "Rekristallizatsiya qilingan cis" },
    { id: "EA-24-277", date: "2024-10-11", method: "CHNS-O Vario EL",    C: 0.01, H: 2.01, N: 9.33, S: 0.02, recovery: 11.4, note: "Transplatin (och sariq)" },
    { id: "EA-24-278", date: "2024-10-11", method: "CHNS-O FlashSmart", C: 0.03, H: 1.85, N: 8.50, S: 0.02, recovery: 10.4, note: "1 oy yorug'likda qolgan (fotoliz)" },
    { id: "EA-24-279", date: "2024-10-12", method: "CHNS-O FlashSmart", C: 0.02, H: 1.65, N: 7.80, S: 0.01, recovery: 9.5, note: "Suvda gidrolizlangan" },
    { id: "EA-24-280", date: "2024-10-12", method: "CHNS-O FlashSmart", C: 2.15, H: 2.02, N: 9.34, S: 0.02, recovery: 13.5, note: "DMSO bilan ifloslangan (C chiqdi)" },
    { id: "BLANK-08",  date: "2024-10-10", method: "Blank (Empty Capsule)", C: 0.00, H: 0.02, N: 0.01, S: 0.00, recovery: 0.0, note: "Tizim tozaligi" },
    { id: "STD-SULFA", date: "2024-10-10", method: "Standard: Sulfanilamide", C: 41.82, H: 4.69, N: 16.28, S: 18.51, recovery: 99.9, note: "NIST kalibrlash standarti" }
  ],

  tgaSteps: [
    { start: 25,  end: 180, loss: 0.0,  event: "Barqaror zona", color: "#10b981", eaCorrelation: "N va H barqaror" },
    { start: 180, end: 250, loss: 5.7,  event: "1-NH₃ yo'qolishi (I)", color: "#8b5cf6", eaCorrelation: "N: 9.34% → 4.67%" },
    { start: 250, end: 290, loss: 5.7,  event: "2-NH₃ yo'qolishi (II)", color: "#8b5cf6", eaCorrelation: "N: 4.67% → 0%" },
    { start: 290, end: 450, loss: 0.0,  event: "PtCl₂ qoldig'i", color: "#f59e0b", eaCorrelation: "N=0, H=0" },
    { start: 450, end: 750, loss: 23.6, event: "Cl₂ yo'qolishi", color: "#ef4444", eaCorrelation: "Faqat Pt qoldi" },
    { start: 750, end: 900, loss: 0.0,  event: "Pt metali qoldig'i", color: "#6366f1", eaCorrelation: "ICP-OES bilan tasdiqlash" }
  ],

  relatedMethods: [
    { name: "XRD (SCXRD/PXRD)", role: "Cis va trans izomerlarni aniq farqlaydi — panjara simmetriyasi", eaAdvantage: "EA izomerlarni farqlamaydi — bu XRDning asosiy afzalligi", eaDisadvantage: "Elementar tarkib bermaydi", complementarity: "98%" },
    { name: "IQ spektroskopiya", role: "Pt-N (300-500 cm⁻¹), Pt-Cl (320-340 cm⁻¹ cis, 305-315 trans), N-H tebranishlari", eaAdvantage: "Cis va trans ni Pt-Cl cho'qqilari orqali farqlaydi", eaDisadvantage: "N% va H% bermaydi", complementarity: "92%" },
    { name: "¹⁹⁵Pt YaMR", role: "To'g'ridan-to'g'ri Pt²⁺ signalini ko'rsatadi (δ = -2100 ppm cis, -1600 ppm trans)", eaAdvantage: "Eng aniq izomer farqlash usuli", eaDisadvantage: "Elementar tarkib bermaydi", complementarity: "95%" },
    { name: "ICP-OES / ICP-MS", role: "Pt miqdorini ppb darajasida o'lchaydi", eaAdvantage: "Metall tarkibini to'g'ridan-to'g'ri beradi (65.02%)", eaDisadvantage: "Ligandlarni o'lchamaydi", complementarity: "88%" },
    { name: "Schöniger usuli (halogen)", role: "Oksigen kolbasida yoqish + AgNO₃ titrlash orqali Cl%", eaAdvantage: "Cl% ni aniq miqdoriy beradi (23.63%)", eaDisadvantage: "NH₃ va Pt ni o'lchamaydi", complementarity: "90%" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Izomer tanlash", desc: "To'q sariq kristallar (cisplatin) yoki och sariq (transplatin). Rang orqali izomerni aniqlash mumkin, ammo EA uchun farq yo'q!", time: "1 daq", critical: true },
    { step: 2, title: "Yorug'likdan himoya", desc: "Cisplatin fotolabil — UV va kuchli yorug'likda NH₃ va Cl yo'qotadi. Qorong'i yoki folga bilan o'ralgan idishda tayyorlanadi.", time: "doimiy", critical: true },
    { step: 3, title: "Namlikdan himoya", desc: "Suvda sekin gidrolizlanadi ([Pt(NH₃)₂(H₂O)Cl]⁺ hosil bo'ladi). Quritilgan, namliksiz sharoit kerak.", time: "doimiy", critical: true },
    { step: 4, title: "Yengil maydalash", desc: "Aqiq hovonchada yengil eziladi. Issiqlik chiqarmaslik kerak — fotoliz xavfi.", time: "1-2 daq", critical: false },
    { step: 5, title: "Qalay kapsulaga joylash", desc: "5×9mm Sn kapsulaga 3.0-5.0 mg namuna (ko'proq, chunki N% past).", time: "3 daq", critical: true },
    { step: 6, title: "Zich yopish va tez analiz", desc: "Kapsula zich yopiladi va 30 daqiqa ichida analiz qilinadi.", time: "5-8 daq (analiz)", critical: true }
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
      Pt: "Pt metali (qattiq qoldiq)"
    },
    equations: [
      { reactant: "Pt(NH₃)₂Cl₂", process: "+ O₂ (1050°C)", products: "Pt (qattiq) + N₂ + 3H₂O + 2HCl + Cl₂" },
      { reactant: "NH₃ (2×ligand)", process: "→ O₂", products: "N₂ (gaz) + 3H₂O (TCD detektlaydi)" },
      { reactant: "Pt²⁺", process: "Kamerasida qoldiq", products: "Pt metali — ICP-OES bilan tasdiqlanadi" }
    ]
  }
}

// Yordamchi: n ta NH₃ uchun nazariy %H, %N hisoblash
function calculateAmminProperties(n) {
  const anhydrousMass = ATOMIC_MASSES.Pt + 2 * ATOMIC_MASSES.Cl // 265.984 (PtCl₂)
  const ammoniaMass = n * AMMONIA_MOLAR_MASS
  const total = anhydrousMass + ammoniaMass
  const hMass = n * 3 * ATOMIC_MASSES.H
  const nMass = n * ATOMIC_MASSES.N
  const ptMass = ATOMIC_MASSES.Pt
  const clMass = 2 * ATOMIC_MASSES.Cl
  return {
    total: parseFloat(total.toFixed(3)),
    H_pct: parseFloat(((hMass / total) * 100).toFixed(3)),
    N_pct: parseFloat(((nMass / total) * 100).toFixed(3)),
    Pt_pct: parseFloat(((ptMass / total) * 100).toFixed(3)),
    Cl_pct: parseFloat(((clMass / total) * 100).toFixed(3)),
    ammoniaPct: parseFloat(((ammoniaMass / total) * 100).toFixed(2))
  }
}

export default function PtNH32Cl2Page() {
  const [activeRun, setActiveRun] = useState("EA-24-275")
  const [ammoniaN, setAmmoniaN] = useState(2)
  const [customN, setCustomN] = useState(9.34)
  const [selectedLigandType, setSelectedLigandType] = useState(0)
  const [selectedIsomer, setSelectedIsomer] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)

  const calc = useMemo(() => calculateAmminProperties(ammoniaN), [ammoniaN])

  const allAmmins = useMemo(() => {
    return [0, 1, 2, 3, 4].map(n => ({
      n,
      ...calculateAmminProperties(n),
      name: n === 0 ? "PtCl₂" : n === 1 ? "[Pt(NH₃)Cl₂]" : n === 2 ? "Pt(NH₃)₂Cl₂ ✓" : n === 3 ? "[Pt(NH₃)₃Cl]⁺" : "[Pt(NH₃)₄]²⁺"
    }))
  }, [])

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const dH = Math.abs(run.H - COMPOUND.theoretical.H.percent)
  const dN = Math.abs(run.N - COMPOUND.theoretical.N.percent)
  const statusColor = (dN <= 0.15 && dH <= 0.08) ? "text-green-400" : (dN <= 0.5 && dH <= 0.2) ? "text-yellow-400" : "text-red-400"

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
            <span className="text-amber-400 font-semibold">Pt(NH₃)₂Cl₂</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-amber-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                {COMPOUND.iupac} • M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
              </p>
              <p className="text-purple-500 text-xs mt-1">
                {COMPOUND.color}
              </p>
              <p className="text-purple-500 text-xs mt-1">
                {COMPOUND.stability}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">Saraton Dori</span>
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Neytral Kompleks</span>
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Og'ir Metall (Pt)</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Geometrik Izomerlar</span>
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
        <div className="bg-gradient-to-r from-amber-900/40 to-purple-900/40 border border-amber-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🧪</span> Birikma haqida (EA uchun muhim xususiyatlar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-200">
            <div className="space-y-3">
              <p className="leading-relaxed">
                <strong className="text-white">Pt(NH₃)₂Cl₂</strong> — platina(II) ning kvadrat-tekis kompleksi bo'lib, unda 2 ta NH₃ va 2 ta Cl⁻ ligandi Pt²⁺ ioniga bog'langan. EA tahlilida <strong className="text-amber-300">noyob o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-amber-500 text-xs md:text-sm">
                <li>Tarkibida <strong className="text-white">C, S va O mutlaqo yo'q</strong> — toza blank test</li>
                <li>N% juda past (<strong className="text-white">9.34%</strong>), H% esa <strong className="text-white">2.02%</strong> — yuqori sezgirlik talab qiladi</li>
                <li><strong className="text-white">Recovery atigi ~11.4%</strong> — chunki Pt (65%) va Cl (23.6%) detektlanmaydi</li>
                <li><strong className="text-red-300">EA cis va trans izomerlarni farqlay OLMAYDI</strong> — metodning jiddiy cheklovi</li>
                <li>Neytral kompleks — konduktometriyada Λ_M ≈ 0</li>
                <li>Fotolabil — yorug'likda degradatsiyalanadi</li>
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

        {/* 1b. GEOMETRIK IZOMERLAR - EA ning asosiy cheklovi */}
        <div className="bg-gradient-to-r from-red-900/30 to-amber-900/30 border border-red-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔄</span> Geometrik izomerlar — EA ularni farqlay olmaydi!
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            <strong className="text-red-300">Bu EA metodining eng katta cheklovi.</strong> Cis va trans izomerlar bir xil empirik formulaga ega, shuning uchun EA natijalari aynan bir xil bo'ladi. Izomerni aniqlash uchun <strong>XRD, IQ yoki ¹⁹⁵Pt YaMR</strong> kerak.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.geometricIsomers.map((iso, i) => (
              <button
                key={i}
                onClick={() => setSelectedIsomer(i)}
                className={`text-left p-5 rounded-xl border transition-all ${
                  selectedIsomer === i 
                    ? "bg-amber-900/40 border-amber-500 shadow-lg shadow-amber-500/20" 
                    : "bg-purple-950/40 border-purple-700/30 hover:border-amber-500/50"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className={`text-sm font-bold ${selectedIsomer === i ? 'text-amber-300' : 'text-white'}`}>
                      {iso.name}
                    </h3>
                    <p className="text-xs text-purple-400 mt-1">"{iso.common}" • {iso.angle}</p>
                  </div>
                  <span className={`text-lg ${iso.anticancer.includes('✓') ? 'text-green-400' : 'text-red-400'}`}>
                    {iso.anticancer}
                  </span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Rang:</span>
                    <span className="text-white">{iso.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">EA signali:</span>
                    <span className="text-amber-400 font-mono">{iso.eaSignal}</span>
                  </div>
                  <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-700/30">
                    <p className="text-[10px] text-red-200 italic">⚠ {iso.difference}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. EA PRINSIPI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔥</span> EA ning ishlash prinsipi — CHNS-O analizatori
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            [Pt(NH₃)₂Cl₂] EA da juda qiyin namuna, chunki <strong className="text-amber-300">N va H signallari juda past</strong>. Bundan tashqari, Pt — og'ir metall bo'lib, yoqish kamerasida qattiq qoldiq sifatida qoladi va Cl esa HCl sifatida chiqadi, lekin standart TCD buni qayd etmaydi.
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
              <div className="text-xs text-purple-300 mt-2">Past N₂ va H₂O signallari</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-amber-400 font-bold text-xs uppercase mb-3">Bu birikma uchun yoqish reaksiyalari:</h3>
            <div className="space-y-3 font-mono text-xs">
              {COMPOUND.combustionPrinciple.equations.map((eq, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-purple-900/30 rounded border-l-4 border-amber-500">
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
            <span>📐</span> Nazariy element tarkibi (CHNS-O + Pt + Cl)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            E'tibor bering: <strong className="text-amber-300">N va H juda past (9.34% va 2.02%)</strong>, chunki Pt (65%) va Cl (23.6%) ko'p. Bu EA uchun qiyin namuna.
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
                    <td className="py-3 pl-2 font-bold text-amber-400">{el}</td>
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
                <tr className="bg-amber-900/20 font-bold border-t border-amber-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center text-white">11</td>
                  <td className="py-3"></td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. NH₃ SONI SIMULYATSIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🧬</span> Ammin soni simulyatsiyasi
            </h2>
            <span className="text-xs text-amber-400 bg-amber-950/50 px-3 py-1 rounded border border-amber-700/30">
              n (NH₃) = {ammoniaN}
            </span>
          </div>

          <p className="text-sm text-purple-300 mb-6">
            NH₃ soni (n) o'zgarganda <strong className="text-yellow-300">%N va %H</strong> chiziqli o'zgaradi. Pt(NH₃)₂Cl₂ da faqat 2 ta NH₃ borligi sababli signal past.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-purple-950/60 p-6 rounded-xl border border-purple-700/30">
                <label className="block text-xs text-purple-400 mb-2">NH₃ ligandlari soni (n):</label>
                <input 
                  type="range" min="0" max="4" step="1" 
                  value={ammoniaN} 
                  onChange={(e) => setAmmoniaN(Number(e.target.value))}
                  className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mb-2"
                />
                <div className="flex justify-between text-xs font-mono text-purple-500 mb-6">
                  <span>0 (PtCl₂)</span>
                  <span>1</span>
                  <span>2 (✓)</span>
                  <span>3</span>
                  <span>4</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">Mol. massa</div>
                    <div className="text-xl font-mono text-white mt-1">{calc.total} <span className="text-xs text-purple-500">g/mol</span></div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-amber-400 uppercase">NH₃ ulushi</div>
                    <div className="text-xl font-mono text-amber-400 mt-1">{calc.ammoniaPct}%</div>
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
                    <div className="text-[10px] text-purple-400 uppercase">%Pt</div>
                    <div className="text-xl font-mono text-red-400 mt-1">{calc.Pt_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">%Cl</div>
                    <div className="text-xl font-mono text-cyan-400 mt-1">{calc.Cl_pct}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                <h3 className="text-amber-400 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                  <span>🧩</span> Ligand turlari
                </h3>
                <div className="space-y-2">
                  {COMPOUND.ligandTypes.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedLigandType(i)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedLigandType === i 
                          ? "bg-amber-900/40 border-amber-500" 
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
                {[0, 2, 4, 6, 8, 10, 12, 14].map(v => (
                  <g key={v}>
                    <line x1="40" y1={210 - (v/14)*180} x2="380" y2={210 - (v/14)*180} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="3,3" />
                    <text x="35" y={214 - (v/14)*180} textAnchor="end" fontSize="9" fill="#a78bfa">{v}%</text>
                  </g>
                ))}
                
                {/* Nazariy chiziq (n=2) - %N uchun */}
                {(() => {
                  const targetN = 9.336
                  const y = 210 - (targetN/14) * 180
                  return (
                    <g>
                      <line x1="40" y1={y} x2="380" y2={y} stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,3" />
                      <text x="385" y={y+3} fontSize="8" fill="#fbbf24">n=2 (naz.)</text>
                    </g>
                  )
                })()}

                {/* Trend Line — %N vs n */}
                <polyline 
                  fill="none" stroke="#f59e0b" strokeWidth="2.5" opacity="0.7"
                  points={[0,1,2,3,4].map(n => {
                    const props = calculateAmminProperties(n)
                    const x = 40 + (n/4) * 340
                    const y = 210 - (props.N_pct / 14) * 180
                    return `${x},${y}`
                  }).join(" ")}
                />

                {[0,1,2,3,4].map(n => {
                  const props = calculateAmminProperties(n)
                  const x = 40 + (n/4) * 340
                  const y = 210 - (props.N_pct / 14) * 180
                  const isActive = n === ammoniaN
                  return (
                    <g key={n} style={{ cursor: 'pointer' }} onClick={() => setAmmoniaN(n)}>
                      <circle cx={x} cy={y} r={isActive ? 7 : 4} 
                        fill={isActive ? "#fbbf24" : "#f59e0b"} 
                        stroke={isActive ? "#fff" : "#f59e0b"} 
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
                {[0,1,2,3,4].map(n => (
                  <text 
                    key={n} 
                    x={40 + (n/4)*340} 
                    y="225" 
                    textAnchor="middle" 
                    fontSize="10" 
                    fill={n===ammoniaN ? "#fbbf24" : "#64748b"} 
                    fontWeight={n===ammoniaN ? "bold" : "normal"}
                  >
                    n={n}
                  </text>
                ))}
                <text x="210" y="238" textAnchor="middle" fontSize="9" fill="#a78bfa">NH₃ soni (n) | PtCl₂ asosida</text>
              </svg>
            </div>
          </div>
        </div>

        {/* 5. AMMINLAR TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>📊</span> Barcha platina(II) amminlari taqqoslanmasi
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            NH₃ soni o'zgarganda EA natijalari qanday o'zgaradi? PtCl₂ asosidagi barcha mumkin bo'lgan amminlar.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 uppercase tracking-wider">
                  <th className="py-2 text-left pl-2">Ammin</th>
                  <th className="py-2 text-center">M (g/mol)</th>
                  <th className="py-2 text-center text-yellow-400">%N</th>
                  <th className="py-2 text-center text-green-400">%H</th>
                  <th className="py-2 text-center text-red-400">%Pt</th>
                  <th className="py-2 text-center text-cyan-400">%Cl</th>
                  <th className="py-2 text-center">NH₃ %</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {allAmmins.map(a => {
                  const isTarget = a.n === 2
                  const isCurrent = a.n === ammoniaN
                  return (
                    <tr 
                      key={a.n}
                      onClick={() => setAmmoniaN(a.n)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-amber-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-amber-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {a.name}
                      </td>
                      <td className="py-2 text-center font-mono">{a.total}</td>
                      <td className="py-2 text-center font-mono text-yellow-400 font-bold">{a.N_pct}</td>
                      <td className="py-2 text-center font-mono text-green-400">{a.H_pct}</td>
                      <td className="py-2 text-center font-mono text-red-400">{a.Pt_pct}</td>
                      <td className="py-2 text-center font-mono text-cyan-400">{a.Cl_pct}</td>
                      <td className="py-2 text-center font-mono text-amber-400">{a.ammoniaPct}</td>
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
            Turli sharoitlarda o'tkazilgan EA yugurishlari. <strong className="text-amber-300">Recovery atigi ~11%</strong> — bu normal, chunki Pt (65%) va Cl (23.6%) detektlanmaydi!
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
                      ? "bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/20" 
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
                  
                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-500 font-medium">Hydrogen (H)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.H.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dH <= 0.08 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 2.02% | Δ: {dH.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-yellow-900/20 rounded border border-yellow-500/20">
                    <span className="text-sm text-yellow-400 font-medium">Nitrogen (N)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.N.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dN <= 0.15 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 9.34% | Δ: {dN.toFixed(2)}%
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
                    className="font-mono text-white text-sm hover:text-amber-400 cursor-pointer"
                  >
                    {run.recovery}% ℹ️
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                !isSample 
                  ? "bg-gray-900/40 border-gray-700/30" 
                  : (dN <= 0.15 && dH <= 0.08)
                    ? "bg-green-900/30 border-green-700/30"
                    : (dN <= 0.5 && dH <= 0.2)
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : (dN <= 0.15 && dH <= 0.08) ? "text-green-400" : (dN <= 0.5 && dH <= 0.2) ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : (dN <= 0.15 && dH <= 0.08) ? "✓ Toza namuna" : (dN <= 0.5 && dH <= 0.2) ? "⚠ Chegaraviy" : "✗ Ifloslangan"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    (dN <= 0.15 && dH <= 0.08)
                      ? "Namuna tarkibi Pt(NH₃)₂Cl₂ formulaga to'liq mos. 2 ta NH₃ to'liq saqlangan."
                      : (dN <= 0.5 && dH <= 0.2)
                        ? "N va H miqdori nazariyga yaqin, lekin qisman fotoliz yoki gidroliz bo'lishi mumkin."
                        : run.C > 1
                          ? "Kapsula yoki erituvchi (DMSO) bilan ifloslangan — C aniqlangan."
                          : dN > 1
                            ? "NH₃ soni kamaygan. [Pt(NH₃)Cl₂] yoki PtCl₂ aralashmasi bo'lishi mumkin."
                            : "Namuna ifloslangan yoki boshqa platina kompleksi."
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
              <h3 className="text-sm font-bold text-amber-400 mb-4 flex justify-between">
                <span>%N Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Target: 9.34%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const val = r.N
                  const heightPct = Math.min((val / 18) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(2)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-yellow-500/30 z-0" style={{ bottom: `${(9.336/18)*100}%` }}></div>
                        )}

                        <div 
                          className={`w-full rounded-t transition-all duration-500 z-10 ${
                            isActive 
                              ? isBlank ? 'bg-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.4)]' 
                                : isStd ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : 'bg-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.4)]' 
                              : isBlank ? 'bg-gray-700/50' 
                              : isStd ? 'bg-amber-700/40' 
                              : 'bg-purple-700/40'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      
                      <div className={`mt-3 text-[9px] font-mono text-center truncate w-full px-1 ${
                        isActive ? (isBlank ? 'text-gray-400' : isStd ? 'text-amber-400' : 'text-amber-400') : 'text-purple-600'
                      } font-bold`}>
                        {isBlank ? 'BLANK' : isStd ? 'STD' : r.id.split('-').pop()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-purple-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> Namuna</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-500 rounded"></span> Blank</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> Standart</span>
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-yellow-500/50"></span> Nazariy (9.34%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECOVERY MODAL */}
        {showRecoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowRecoveryModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
                <span>📈</span> Nima uchun Recovery atigi ~11%?
              </h3>
              <p className="text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-white">Pt(NH₃)₂Cl₂</strong> uchun recovery juda past bo'lishi <strong className="text-amber-300">tabiiy va normal</strong>. Sababi — formuladagi eng katta massalar Pt va Cl da, va ular standart CHNS-O da o'lchanmaydi.
              </p>
              <div className="bg-purple-900/40 p-4 rounded-lg font-mono text-xs mb-3">
                <div className="text-purple-400">EA detektlaydi:</div>
                <div className="text-green-400">H (2.02%) + N (9.34%) + C (0%) + S (0%) + O (0%) = <strong>11.36%</strong></div>
                <div className="mt-2 text-purple-400">EA detektlay olmaydi:</div>
                <div className="text-red-300">Pt (65.02%) + Cl (23.63%) = <strong>88.64%</strong></div>
                <div className="mt-2 text-white">JAMI: 100%</div>
                <div className="text-amber-400 mt-2">✓ Recovery 11.4% = Muvaffaqiyatli natija!</div>
              </div>
              <p className="text-xs text-purple-300 italic mb-4">
                Pt uchun <strong>ICP-OES/MS</strong>, Cl uchun <strong>Schöniger usuli</strong> qo'llaniladi.
              </p>
              <button 
                onClick={() => setShowRecoveryModal(false)}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-lg transition-colors text-sm"
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
            [Pt(NH₃)₂Cl₂] da NH₃ va Cl ning bosqichma-bosqich yo'qolishi TGA da aniq ko'rinadi. EA esa faqat NH₃ yo'qolishini N kamayishi orqali ko'rsatadi.
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
                d="M 50 20 L 170 20 Q 190 20 200 35 L 220 60 Q 230 70 245 70 L 275 70 Q 290 70 300 80 L 320 105 Q 330 115 345 115 L 390 115 Q 405 115 415 125 L 450 170 Q 460 180 480 180 L 580 180" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="110" y="15" textAnchor="middle" fill="#10b981">EA: %N = 9.34%, %H = 2.02%</text>
                
                <line x1="220" y1="60" x2="220" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="220" y="235" textAnchor="middle" fill="#8b5cf6">~220°C</text>
                <text x="240" y="50" fill="#8b5cf6">-1 NH₃</text>

                <line x1="320" y1="105" x2="320" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="320" y="235" textAnchor="middle" fill="#8b5cf6">~270°C</text>
                <text x="340" y="95" fill="#8b5cf6">-2 NH₃</text>

                <text x="395" y="110" textAnchor="middle" fill="#f59e0b">PtCl₂ qoldig'i</text>

                <line x1="450" y1="170" x2="450" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="450" y="235" textAnchor="middle" fill="#ef4444">~650°C</text>
                <text x="470" y="160" fill="#ef4444">-2 Cl₂</text>

                <text x="530" y="175" textAnchor="middle" fill="#6366f1">Pt metali</text>
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
                <div className="text-[10px] text-amber-300 mt-2 italic">EA korrelyatsiyasi: {step.eaCorrelation}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. YAQIN USULLAR */}
        <div className="bg-gradient-to-r from-amber-900/40 to-purple-900/40 border border-amber-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> EA ga yaqin tahlil usullari bilan solishtirish
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Pt(NH₃)₂Cl₂] uchun EA <strong className="text-amber-300">cis va trans izomerlarni farqlay olmaydi</strong> — bu uning eng katta kamchiligi. Qo'shimcha metodlar juda muhim.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPOUND.relatedMethods.map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-amber-500/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-amber-300">{m.name}</h3>
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

          <div className="mt-5 bg-amber-900/20 border border-amber-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-amber-300 mb-2">💡 Bu birikma uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">EA (N, H) + XRD (cis/trans farqlash) + ¹⁹⁵Pt YaMR (Pt signali) + IQ (Pt-N, Pt-Cl) + ICP-OES (Pt%) + Schöniger (Cl%)</strong> — oltita metod birgalikda cisplatin yoki transplatin ekanligini to'liq tasdiqlaydi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> Namuna tayyorlash bosqichlari (EA uchun)
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            [Pt(NH₃)₂Cl₂] fotolabil va namlikda gidrolizlanadi. Shuning uchun tayyorlashda yorug'likdan va suvdan himoya juda muhim. Har bir qadamni bosib, tafsilotlarni ko'ring.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {COMPOUND.samplePrepSteps.map(s => (
                <button
                  key={s.step}
                  onClick={() => setActivePrepStep(s.step)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activePrepStep === s.step
                      ? "bg-amber-900/40 border-amber-500"
                      : "bg-purple-950/40 border-purple-700/20 hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activePrepStep === s.step ? "bg-amber-500 text-white" : "bg-purple-800 text-purple-400"
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
                      <h3 className="text-lg font-bold text-amber-400">Qadam {current.step}: {current.title}</h3>
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
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6">
          <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Eksperimental %N validatsiya kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan %N qiymatini kiriting va ammin shaklini aniqlang.
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="block text-xs text-purple-400">O'lchangan %N qiymati:</label>
              <input 
                type="number" step="0.01" value={customN}
                onChange={(e) => setCustomN(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-amber-500 outline-none transition-colors"
              />
              <div className="text-[10px] text-purple-500 mt-1">
                Nazariy qiymat: {COMPOUND.theoretical.N.percent.toFixed(3)}% (2 ta NH₃ uchun)
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {(() => {
                const diff = Math.abs(customN - 9.336)
                let res = { s: "", c: "", m: "", icon: "" }
                
                if (diff < 0.2) res = { 
                  s: "PT(NH₃)₂CL₂", 
                  c: "text-green-400", 
                  m: "Namuna toza diammindixloroplatina(II) tarkibiga ega. 2 ta NH₃ to'liq saqlangan.",
                  icon: "✓"
                }
                else if (customN < 7 && customN > 4) res = { 
                  s: "MONOAMMIN", 
                  c: "text-yellow-400", 
                  m: "1 ta NH₃ yo'qotilgan. [Pt(NH₃)Cl₂] aralashmasi bo'lishi mumkin.",
                  icon: "⚠"
                }
                else if (customN < 4 && customN > 1) res = { 
                  s: "PTCL₂", 
                  c: "text-orange-400", 
                  m: "Barcha NH₃ yo'qotilgan. PtCl₂ holatiga o'tgan.",
                  icon: "✗"
                }
                else if (customN > 12) res = { 
                  s: "IFLOSLANGAN", 
                  c: "text-red-400", 
                  m: "Namuna haddan tashqari azotli modda bilan ifloslangan. Qayta tahlil kerak.",
                  icon: "✗"
                }
                else res = { 
                  s: "QISMAn DEGRADATSIYA", 
                  c: "text-orange-400", 
                  m: "NH₃ qisman yo'qotilgan. Fotoliz yoki gidroliz yuz bergan bo'lishi mumkin.",
                  icon: "⚠"
                }

                return (
                  <div className="bg-purple-950/50 rounded-lg p-4 border border-purple-700/30 flex items-center gap-4">
                    <div className={`text-3xl ${res.c}`}>{res.icon}</div>
                    <div className="flex-1">
                      <div className={`text-2xl font-black tracking-tight ${res.c}`}>{res.s}</div>
                      <div className="text-sm text-purple-200 mt-1">{res.m}</div>
                      <span className="text-xs font-mono text-purple-500 mt-2 block">
                        Δ = {diff.toFixed(3)}% (Limit: ±0.2%)
                      </span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        {/* 11. QIZIQ FAKT - Pt va Cl cheklovi */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> EA ning chegarasi: Nima uchun Pt va Cl ni o'lchamaydi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                [Pt(NH₃)₂Cl₂] da formulaning <strong className="text-white">88.6% qismi</strong> (Pt + Cl) EA da o'lchanmaydi:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li>C → CO₂ (gaz) → TCD detektlanadi (C YO'Q)</li>
                <li>H → H₂O (gaz) → TCD detektlanadi (2.02%)</li>
                <li>N → N₂ (gaz) → TCD detektlanadi (9.34%)</li>
                <li><strong className="text-red-300">Pt → Pt metali (qattiq qoldiq)</strong> — TCD detektlay olmaydi!</li>
                <li><strong className="text-red-300">Cl → HCl (gaz)</strong> — standart TCD buni qayd etmaydi!</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Bundan tashqari, EA <strong className="text-amber-300">cis va trans izomerlarni farqlay olmaydi</strong>, chunki ular bir xil empirik formulaga ega.
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
                  <span>2.02%</span>
                </div>
                <div className="flex justify-between">
                  <span>− N:</span>
                  <span>9.34%</span>
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
                  <span className="text-red-400">= Pt + Cl (qoldiq):</span>
                  <span className="text-red-400 font-bold">88.64%</span>
                </div>
                <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-700/30 text-red-200 text-[10px]">
                  Nazariy Pt% + Cl% = 65.02% + 23.63% = 88.65% — qoldiq bilan mos keladi ✓
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
              <p className="text-xs text-purple-200">NH₃ ligandlarini to'g'ridan-to'g'ri o'lchaydi. C, S, O yo'qligi blank test uchun mukammal. Formulani empirik tasdiqlaydi.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Recovery atigi ~11% — Pt va Cl detektlanmaydi. <strong className="text-amber-300">Cis/trans izomerlarni farqlay OLMAYDI</strong>. Past N% va H% — yuqori sezgirlik kerak.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">XRD (cis/trans), ¹⁹⁵Pt YaMR (Pt), IQ (Pt-N, Pt-Cl), ICP-OES (Pt%), Schöniger (Cl%) — to'liq tasdiqlash uchun birlashtiriladi.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700/30 flex flex-col md:flex-row justify-between gap-3">
            <Link href="/ilmiy/tahlil/element-analiz" className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2">
              ← Element Analiz metodi haqida
            </Link>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-sm bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg text-white transition-colors text-center">
              Barcha 12 ta birikmani ko'rish →
            </Link>
          </div>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • Pt(NH₃)₂Cl₂ • Element Analizi moduli</p>
          <p className="mt-1">Manbalar: IUPAC Atomic Weights 2021, Vogel's Textbook, NIST SRP, Rosenberg (1965)</p>
        </div>
      </footer>
    </main>
  )
}