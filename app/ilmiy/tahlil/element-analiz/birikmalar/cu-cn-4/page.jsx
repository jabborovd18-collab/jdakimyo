"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// K₃[Cu(CN)₄] — ELEMENT ANALIZI (EA) MAHSUS SAHIFASI
// Manbalar: IUPAC Atomic Weights 2021, Vogel's Quantitative Chemical Analysis
// Xususiyat: JUDA ZAHARLI (CN⁻), Cu(I) d¹⁰ kompleks, sianidlash jarayoni
// Maqsad: Faqat EA tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Cu: 63.546, K: 39.098, C: 12.011, N: 14.007,
  H: 1.008, O: 15.999, S: 32.065,
  Ag: 107.87, Au: 196.97, Zn: 65.38, Ni: 58.693, Fe: 55.845, Co: 58.933
}

const CN_MOLAR_MASS = ATOMIC_MASSES.C + ATOMIC_MASSES.N  // 26.018

const COMPOUND = {
  formulaHTML: "K<sub>3</sub>[Cu(CN)<sub>4</sub>]",
  formulaPlain: "K3[Cu(CN)4]",
  iupac: "Kaliy tetratsianokuprat(I)",
  formulaExpanded: "K₃CuC₄N₄",
  molarMass: 280.289,
  casNumber: "37378-65-3",
  color: "rangsiz yoki oq kristallar",
  stability: "havoda barqaror, suvda eriydi, KISLOTA BILAN JUDA ZAHARLI HCN AJRATADI!",
  
  historicalFact: {
    title: "Sianidlash jarayoni — oltin-kumush metallurgiyasi inqilobi",
    text: "K₃[Cu(CN)₄] — sianid metallurgiyasining muhim birikmasi. 1887-yilda MacArthur, Forrest va Forrest tomonidan ixtiro qilingan <strong>sianidlash jarayoni</strong> (cyanidation) oltin va kumush rudalaridan metallarni ajratishda inqilob qildi. Bu jarayonda Au va Ag [Au(CN)₂]⁻ va [Ag(CN)₂]⁻ komplekslari hosil qiladi, chunki CN⁻ kuchli π-akseptor ligand. K₃[Cu(CN)₄] mis rudalarida ham uchraydi va mis ajratishda muhim ahamiyatga ega. EA tahlilida bu birikma <strong>eng xavfli namunalar</strong>dan biri: tarkibida <strong>4 ta CN⁻ guruhi</strong> — bu yonish jarayonida HCN gazi hosil qilishi mumkin! Shuning uchun maxsus ventilyatsiya va filtr tizimi talab etiladi. C (17.1%) va N (20.0%) — ikkalasi ham CN⁻ dan keladi, recovery ~37%.",
    year: "1887-yil"
  },

  ligandTypes: [
    { type: "Koordinatsion CN⁻ (monodentat)", count: 4, role: "Cu(I) ga C orqali bog'langan (M-C≡N), kuchli σ-donor + π-akseptor", eaImpact: "C kanalida 4 ta C, N kanalida 4 ta N", lossTemp: ">350°C (parchalanish)" },
    { type: "K⁺ ionlari", count: 3, role: "Tashqi sfera — ion bog'lar orqali", eaImpact: "EA da detektlanmaydi (alkali metall)", lossTemp: ">800°C (KCN sifatida)" },
    { type: "Markaziy Cu(I)", count: 1, role: "d¹⁰ konfiguratsiyasi, tetraedral geometriya", eaImpact: "Yoqilg'ida Cu₂O/Cu qoldig'i", lossTemp: "Qoldiq sifatida" }
  ],
  
  theoretical: {
    C:  { atoms: 4, mass: 48.044,  percent: 17.142, source: "4×CN⁻ (4×C)", eaChannel: "CN⁻ ning C atomi" },
    H:  { atoms: 0, mass: 0.000,   percent: 0.000,  source: "Vodorod YO'Q", eaChannel: "❌ Mavjud emas" },
    N:  { atoms: 4, mass: 56.028,  percent: 20.000, source: "4×CN⁻ (4×N)", eaChannel: "CN⁻ ning N atomi (kuchli signal)" },
    S:  { atoms: 0, mass: 0.000,   percent: 0.000,  source: "Sulfur YO'Q", eaChannel: "❌ Mavjud emas" },
    O:  { atoms: 0, mass: 0.000,   percent: 0.000,  source: "Kislorod YO'Q", eaChannel: "❌ Mavjud emas" },
    Cu: { atoms: 1, mass: 63.546,  percent: 22.671, source: "Markaziy Cu(I)", eaChannel: "Yoqilg'ida Cu₂O qoldig'i" },
    K:  { atoms: 3, mass: 112.671, percent: 40.188, source: "Tashqi sfera K⁺", eaChannel: "Yoqilg'ida K₂O/KCN qoldig'i" }
  },

  experimentalRuns: [
    { id: "EA-24-501", date: "2025-03-10", method: "CHNS-O FlashSmart (maxsus filtr)", C: 17.12, H: 0.02, N: 19.95, S: 0.01, recovery: 37.1, note: "Toza K₃[Cu(CN)₄] — CN⁻ xavfsizlik choralar bilan" },
    { id: "EA-24-502", date: "2025-03-10", method: "CHNS-O FlashSmart (maxsus filtr)", C: 17.18, H: 0.03, N: 20.05, S: 0.02, recovery: 37.3, note: "Qayta o'lchov" },
    { id: "EA-24-503", date: "2025-03-11", method: "CHNS-O Vario EL",        C: 16.85, H: 0.04, N: 19.60, S: 0.02, recovery: 36.5, note: "3 oy saqlangan — qisman parchalangan" },
    { id: "EA-24-504", date: "2025-03-11", method: "CHNS-O FlashSmart",       C: 15.20, H: 0.05, N: 17.80, S: 0.03, recovery: 33.1, note: "CN⁻ qisman yo'qotilgan (K₂[Cu(CN)₃] aralashmasi)" },
    { id: "EA-24-505", date: "2025-03-12", method: "CHNS-O FlashSmart",       C: 17.15, H: 0.65, N: 20.02, S: 0.01, recovery: 37.8, note: "Namlik yutilgan (H chiqdi!)" },
    { id: "EA-24-506", date: "2025-03-12", method: "CHNS-O FlashSmart",       C: 12.90, H: 0.03, N: 15.05, S: 0.02, recovery: 28.0, note: "K[Cu(CN)₂] aralashmasi (2 CN⁻)" },
    { id: "BLANK-13",  date: "2025-03-10", method: "Blank (Empty Capsule)",   C: 0.00, H: 0.02, N: 0.01, S: 0.00, recovery: 0.03, note: "Tizim tozaligi" },
    { id: "STD-SULFA", date: "2025-03-10", method: "Standard: Sulfanilamide", C: 41.82, H: 4.69, N: 16.28, S: 18.51, recovery: 99.9, note: "NIST kalibrlash standarti" }
  ],

  tgaSteps: [
    { start: 25,  end: 200, loss: 0.0,  event: "Barqaror zona", color: "#10b981", eaCorrelation: "C va N barqaror" },
    { start: 200, end: 350, loss: 9.3,  event: "1-CN⁻ yo'qolishi", color: "#8b5cf6", eaCorrelation: "C: 17.14% → 12.86% | N: 20.00% → 15.00%" },
    { start: 350, end: 500, loss: 18.6, event: "2-CN⁻ yo'qolishi", color: "#8b5cf6", eaCorrelation: "C: 12.86% → 8.57% | N: 15.00% → 10.00%" },
    { start: 500, end: 650, loss: 9.3,  event: "3-CN⁻ yo'qolishi", color: "#8b5cf6", eaCorrelation: "C: 8.57% → 4.29%" },
    { start: 650, end: 800, loss: 39.7, event: "KCN sublimatsiyasi", color: "#f59e0b", eaCorrelation: "Cu₂O qoldig'i" },
    { start: 800, end: 1000, loss: 0.0, event: "Cu₂O qoldig'i", color: "#ef4444", eaCorrelation: "ICP-OES bilan tasdiqlash" }
  ],

  relatedMethods: [
    { name: "IQ spektroskopiya", role: "C≡N tebranishlari (2100-2150 cm⁻¹ — erkin CN⁻ 2080 cm⁻¹ dan yuqori)", eaAdvantage: "CN⁻ koordinatsiyasini tasdiqlaydi (ν(CN) siljishi)", eaDisadvantage: "C va N miqdorini bermaydi", complementarity: "92%" },
    { name: "ICP-OES / ICP-MS", role: "Cu va K miqdorini ppb darajasida o'lchaydi", eaAdvantage: "Metall tarkibini to'g'ridan-to'g'ri beradi (Cu 22.7%, K 40.2%)", eaDisadvantage: "CN⁻ ligandlarini o'lchamaydi", complementarity: "90%" },
    { name: "Ion-selektiv elektrod (ISE)", role: "CN⁻ ionini to'g'ridan-to'g'ri o'lchaydi (ppm darajasida)", eaAdvantage: "Erkin CN⁻ ni aniq o'lchaydi", eaDisadvantage: "Koordinatsion CN⁻ ni o'lchay olmaydi", complementarity: "85%" },
    { name: "UV-Vis spektroskopiya", role: "LMCT (Ligand→Metal Charge Transfer) ~250 nm, d-d o'tishlar (d¹⁰ — ko'rinmas)", eaAdvantage: "Cu(I) holatini tasdiqlaydi", eaDisadvantage: "Elementar tarkib bermaydi", complementarity: "82%" },
    { name: "¹³C YaMR", role: "CN⁻ uglerodi (δ = 145-150 ppm — koordinatsion)", eaAdvantage: "CN⁻ bog'lanishini tasdiqlaydi", eaDisadvantage: "Miqdoriy emas", complementarity: "88%" },
    { name: "XRD (SCXRD/PXRD)", role: "Kristall panjara, Cu-C masofa, tetraedral geometriya", eaAdvantage: "To'liq struktura — barcha atomlar aniqlanadi", eaDisadvantage: "Miqdoriy emas", complementarity: "93%" }
  ],

  samplePrepSteps: [
    { step: 1, title: "⚠ XAVFSIZLIK!", desc: "K₃[Cu(CN)₄] CN⁻ guruhi tufayli JUDA ZAHARLI! KISLOTA bilan aloqa qilmang — HCN (vodorod sianid) ajraladi. Faqat tortish shkafi ichida ishlang. KCN antidoti tayyor bo'lsin.", time: "doimiy", critical: true },
    { step: 2, title: "Namlikdan himoya", desc: "K₃[Cu(CN)₄] gigroskopik bo'lishi mumkin. 80°C da 2 soat quritish tavsiya etiladi (yuqori haroratda parchalanadi!).", time: "2 soat", critical: false },
    { step: 3, title: "Maydalash", desc: "Aqiq hovonchada mayda kukunga aylantiriladi. CN⁻ uchib ketmaydi, lekin chang inhalatsiyasi xavfli!", time: "2-3 daq", critical: true },
    { step: 4, title: "Qalay kapsulaga joylash", desc: "5×9mm Sn kapsulaga 2.5-4.0 mg namuna tortiladi.", time: "3 daq", critical: true },
    { step: 5, title: "Maxsus filtr tizimi", desc: "EA analizatoriga HCN va NOₓ tutib qoluvchi maxsus filtr o'rnatiladi. Bu standart CHNS-O da YO'Q!", time: "10 daq", critical: true },
    { step: 6, title: "CHNS rejimida analiz", desc: "Standart sharoitda analiz — C va N o'lchanadi. HCN chiqindilari filtr orqali tutib olinadi.", time: "5-8 daq", critical: false }
  ],

  combustionPrinciple: {
    oxidationTemp: "1050°C",
    reductionTemp: "650°C (Cu)",
    products: {
      C: "CO₂ (TCD detektori)",
      H: "H₂O (TCD detektori) — YO'Q",
      N: "N₂ (TCD detektori)",
      S: "SO₂ (TCD detektori) — YO'Q",
      O: "— YO'Q",
      Cl: "— YO'Q",
      Cu: "Cu₂O (qattiq qoldiq)",
      K: "K₂O/KCN (qattiq qoldiq)"
    },
    equations: [
      { reactant: "K₃[Cu(CN)₄]", process: "+ O₂ (1050°C)", products: "Cu₂O + K₂O + KCN + 4CO₂ + 2N₂" },
      { reactant: "CN⁻ (4×ligand)", process: "→ O₂", products: "4CO₂ + 2N₂ — barchasi TCD da detektlanadi" },
      { reactant: "Cu(I)", process: "Kamerasida qoldiq", products: "Cu₂O — ICP-OES bilan tasdiqlanadi" },
      { reactant: "⚠ XAVF!", process: "Agar nam bo'lsa", products: "HCN (zaharli gaz!) — filtr tutishi kerak" }
    ]
  },

  // Boshqa sianid komplekslari
  cyanideComplexes: [
    { metal: "Cu", formula: "K[Cu(CN)₂]", molarMass: 149.64, color: "oq", geometry: "chiziqli", electrons: "d¹⁰", c_pct: 16.05, n_pct: 18.72, metal_pct: 42.46, k_pct: 26.12, cn_count: 2 },
    { metal: "Cu", formula: "K₂[Cu(CN)₃]", molarMass: 212.68, color: "oq", geometry: "trigonal tekis", electrons: "d¹⁰", c_pct: 16.93, n_pct: 19.75, metal_pct: 29.88, k_pct: 36.78, cn_count: 3 },
    { metal: "Cu", formula: "K₃[Cu(CN)₄] ✓", molarMass: 280.29, color: "oq ✓", geometry: "tetraedr", electrons: "d¹⁰", c_pct: 17.14, n_pct: 20.00, metal_pct: 22.67, k_pct: 40.19, cn_count: 4 },
    { metal: "Ag", formula: "K[Ag(CN)₂]", molarMass: 199.00, color: "oq", geometry: "chiziqli", electrons: "d¹⁰", c_pct: 12.07, n_pct: 14.08, metal_pct: 54.21, k_pct: 19.65, cn_count: 2 },
    { metal: "Au", formula: "K[Au(CN)₂]", molarMass: 288.08, color: "oq", geometry: "chiziqli", electrons: "d¹⁰", c_pct: 8.34, n_pct: 9.73, metal_pct: 68.36, k_pct: 13.57, cn_count: 2 },
    { metal: "Zn", formula: "K₂[Zn(CN)₄]", molarMass: 257.59, color: "oq", geometry: "tetraedr", electrons: "d¹⁰", c_pct: 18.64, n_pct: 21.74, metal_pct: 25.38, k_pct: 30.35, cn_count: 4 },
    { metal: "Fe", formula: "K₄[Fe(CN)₆]", molarMass: 368.35, color: "sariq", geometry: "oktaedr", electrons: "d⁶ LS", c_pct: 19.56, n_pct: 22.83, metal_pct: 15.16, k_pct: 42.45, cn_count: 6 },
    { metal: "Fe", formula: "K₃[Fe(CN)₆]", molarMass: 329.25, color: "qizil", geometry: "oktaedr", electrons: "d⁵ LS", c_pct: 21.88, n_pct: 25.53, metal_pct: 16.96, k_pct: 35.64, cn_count: 6 }
  ],

  safetyInfo: {
    ld50_cn: "5-10 mg/kg (CN⁻ sifatida)",
    hcn_limit: "4.7 ppm (IDLH — darhol hayot uchun xavfli)",
    antidote: "Natriy nitrit + Natriy tiosulfat (Nithin antidoti)",
    symptoms: "bosh og'rig'i, nafas qisqarishi, konvulsiyalar, o'lim",
    first_aid: "Darhol amil nitrit inhalatsiyasi, so'ngra IV natriy tiosulfat"
  }
}

function calculateCyanideComplexProperties(metalMass, nCN, kCount) {
  const total = metalMass + nCN * CN_MOLAR_MASS + kCount * ATOMIC_MASSES.K
  const cMass = nCN * ATOMIC_MASSES.C
  const nMass = nCN * ATOMIC_MASSES.N
  const kMass = kCount * ATOMIC_MASSES.K
  return {
    total: parseFloat(total.toFixed(3)),
    C_pct: parseFloat(((cMass / total) * 100).toFixed(3)),
    N_pct: parseFloat(((nMass / total) * 100).toFixed(3)),
    metal_pct: parseFloat(((metalMass / total) * 100).toFixed(3)),
    K_pct: parseFloat(((kMass / total) * 100).toFixed(3)),
    cnPct: parseFloat(((nCN * CN_MOLAR_MASS / total) * 100).toFixed(2))
  }
}

// Cu-CN komplekslari uchun maxsus kalkulyator
function calculateCuCyanideProperties(nCN) {
  const metalMass = ATOMIC_MASSES.Cu
  // Cu(I) kompleksi uchun: [Cu(CN)ₙ]^(n-1)- → (n-1) ta K⁺
  const kCount = nCN - 1
  return calculateCyanideComplexProperties(metalMass, nCN, kCount)
}

export default function K3CuCN4Page() {
  const [activeRun, setActiveRun] = useState("EA-24-501")
  const [nCN, setNCN] = useState(4)
  const [selectedComplex, setSelectedComplex] = useState(2) // K₃[Cu(CN)₄] = index 2
  const [customN, setCustomN] = useState(20.00)
  const [selectedLigandType, setSelectedLigandType] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [showSafetyModal, setShowSafetyModal] = useState(true)

  const calc = useMemo(() => calculateCuCyanideProperties(nCN), [nCN])

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const dC = Math.abs(run.C - COMPOUND.theoretical.C.percent)
  const dN = Math.abs(run.N - COMPOUND.theoretical.N.percent)
  const statusColor = (dC <= 0.3 && dN <= 0.3) 
    ? "text-green-400" 
    : (dC <= 1.0 && dN <= 1.0) 
      ? "text-yellow-400" 
      : "text-red-400"

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      
      {/* XAVFSIZLIK MODALI */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-red-950 border-2 border-red-500 rounded-2xl p-6 max-w-lg w-full animate-pulse">
            <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
              <span className="text-4xl">☠️</span> DIQQAT: SIANID ZAHARLILIGI!
            </h3>
            <p className="text-sm text-red-100 leading-relaxed mb-3">
              <strong className="text-white">K₃[Cu(CN)₄]</strong> tarkibida <strong className="text-red-300">4 ta CN⁻ (sianid) guruhi</strong> bor. Bu <strong className="text-red-300">juda zaharli</strong>!
            </p>
            <div className="bg-red-900/40 p-4 rounded-lg font-mono text-xs mb-3 space-y-1">
              <div><span className="text-red-400">Kislota bilan:</span> <span className="text-white">HCN (vodorod sianid) ajraladi!</span></div>
              <div><span className="text-red-400">HCN IDLH:</span> <span className="text-white">4.7 ppm</span></div>
              <div><span className="text-red-400">Antidot:</span> <span className="text-white">Natriy nitrit + Tiosulfat</span></div>
            </div>
            <p className="text-xs text-red-200 italic mb-4">
              EA tayyorlashda <strong>maxsus filtr tizimi</strong> va <strong>tortish shkafi</strong> talab etiladi. Yonish jarayonida HCN chiqishi mumkin!
            </p>
            <button 
              onClick={() => setShowSafetyModal(false)}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
            >
              Tushundim — davom etish
            </button>
          </div>
        </div>
      )}
      
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
            <span className="text-cyan-400 font-semibold">K₃[Cu(CN)₄]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
                <span className="text-xs bg-red-600 px-2 py-1 rounded ml-2 animate-pulse">☠️ SIANID</span>
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
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide animate-pulse">Siandid Zaharli</span>
                <span className="px-2 py-1 rounded bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 text-[10px] uppercase tracking-wide">Cu(I) d¹⁰</span>
                <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Tetraedr</span>
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Metallurgiya</span>
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
                <strong className="text-white">K₃[Cu(CN)₄]</strong> — mis(I) ning tetraedral sianid kompleksi. EA tahlilida <strong className="text-cyan-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-cyan-500 text-xs md:text-sm">
                <li><strong className="text-white">C va N faqat CN⁻ da</strong> (jami 37.1%) — organik emas!</li>
                <li><strong className="text-white">H, S, O mutlaqo yo'q</strong></li>
                <li>K (40.2%) va Cu (22.7%) — detektlanmaydi</li>
                <li><strong className="text-cyan-300">Recovery ~37%</strong> — C + N yig'indisi</li>
                <li>CN⁻ yonish jarayonida <strong className="text-red-300">HCN gazi</strong> hosil qilishi mumkin — maxsus filtr kerak!</li>
                <li>Cu(I) — d¹⁰ konfiguratsiyasi, rang yo'q (oq kristallar)</li>
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

        {/* 1b. XAVFSIZLIK PANELI */}
        <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-2 border-red-700/70 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">☠️</span> Siandid xavfsizligi (EA uchun muhim)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-950/40 p-4 rounded-xl border border-red-700/30">
              <div className="text-xs text-red-400 uppercase mb-2">CN⁻ toksikligi</div>
              <div className="text-xl font-mono text-white">{COMPOUND.safetyInfo.ld50_cn}</div>
              <div className="text-xs text-red-300 mt-2">Siandid — juda past dozada o'lim</div>
            </div>
            <div className="bg-red-950/40 p-4 rounded-xl border border-red-700/30">
              <div className="text-xs text-red-400 uppercase mb-2">HCN IDLH</div>
              <div className="text-xl font-mono text-white">{COMPOUND.safetyInfo.hcn_limit}</div>
              <div className="text-xs text-red-300 mt-2">Darhol hayot uchun xavfli</div>
            </div>
            <div className="bg-red-950/40 p-4 rounded-xl border border-red-700/30">
              <div className="text-xs text-red-400 uppercase mb-2">Antidot</div>
              <div className="text-sm font-mono text-white">{COMPOUND.safetyInfo.antidote}</div>
              <div className="text-xs text-red-300 mt-2">Nithin antidoti</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-red-900/20 rounded-xl border border-red-700/30">
            <p className="text-xs text-red-200 leading-relaxed">
              <strong className="text-white">EA tayyorlashdagi maxsus choralar:</strong> Tortish shkafi, HCN detektori, maxsus filtr tizimi (NaOH eritmasi orqali), nitril qo'lqop, ko'z himoyasi. <strong className="text-red-300">KISLOTA BILAN ALOQA QILMANG — HCN ajraladi!</strong>
            </p>
          </div>
        </div>

        {/* 2. EA PRINSIPI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔥</span> EA ning ishlash prinsipi — CHNS (maxsus filtr bilan)
          </h2>
          <p className="text-sm text-purple-200 mb-5 leading-relaxed">
            K₃[Cu(CN)₄] EA uchun <strong className="text-cyan-300">noyob holat</strong> — tarkibida <strong className="text-cyan-300">C va N bor, lekin ular organik emas — CN⁻ ligandda</strong>. Yonish jarayonida CN⁻ → CO₂ + N₂ ga aylanadi, lekin <strong className="text-red-300">HCN gazi</strong> ham hosil bo'lishi mumkin. Shuning uchun maxsus filtr tizimi talab etiladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">1. Yoqish kamerasi</div>
              <div className="text-2xl font-mono text-orange-400">{COMPOUND.combustionPrinciple.oxidationTemp}</div>
              <div className="text-xs text-purple-300 mt-2">O₂ + 1050°C — CN⁻ → CO₂ + N₂</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">2. Reduksiya kamerasi</div>
              <div className="text-2xl font-mono text-red-400">{COMPOUND.combustionPrinciple.reductionTemp}</div>
              <div className="text-xs text-purple-300 mt-2">Cu — NOₓ larni N₂ ga aylantiradi</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">3. Deteksiya + FILTR</div>
              <div className="text-2xl font-mono text-blue-400">C + N</div>
              <div className="text-xs text-purple-300 mt-2">CO₂ (17.1%), N₂ (20.0%) + HCN tutib olinadi!</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-cyan-400 font-bold text-xs uppercase mb-3">Bu birikma uchun yoqish reaksiyasi:</h3>
            <div className="space-y-3 font-mono text-xs">
              {COMPOUND.combustionPrinciple.equations.map((eq, i) => (
                <div key={i} className={`flex flex-col md:flex-row md:items-center gap-2 p-3 bg-purple-900/30 rounded border-l-4 ${eq.reactant.includes('XAVF') ? 'border-red-500 bg-red-900/20' : 'border-cyan-500'}`}>
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
            <span>📐</span> Nazariy element tarkibi (CHNS + Cu + K)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            E'tibor bering: <strong className="text-cyan-300">C va N faqat CN⁻ da</strong>, H, S, O yo'q. K va Cu detektlanmaydi.
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
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => {
                  const isZero = d.atoms === 0
                  return (
                    <tr key={el} className={`border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors ${isZero ? 'opacity-60' : ''}`}>
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
                  )
                })}
                <tr className="bg-cyan-900/20 font-bold border-t border-cyan-500/30">
                  <td className="py-3 pl-2 text-white">JAMI</td>
                  <td className="py-3 text-center text-white">12</td>
                  <td className="py-3"></td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3b. CN⁻ LIGAND INFO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔗</span> CN⁻ ligandining xususiyatlari (σ-donor + π-akseptor)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/50 p-5 rounded-xl border border-cyan-700/30">
              <h3 className="text-cyan-400 font-bold text-sm mb-3">CN⁻ ligandining noyob tabiati:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Bog'lanish:</span>
                  <span className="text-white font-mono">M-C≡N (C orqali)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Donorlik:</span>
                  <span className="text-white font-mono">Kuchli σ-donor + π-akseptor</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Geometriya:</span>
                  <span className="text-white font-mono">Tetraedral (Cu(I) d¹⁰)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Cu-C masofa:</span>
                  <span className="text-white font-mono">1.97 Å</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">C≡N masofa:</span>
                  <span className="text-white font-mono">1.15 Å</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">IR ν(CN):</span>
                  <span className="text-white font-mono">2100-2150 cm⁻¹</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-950/50 p-5 rounded-xl border border-cyan-700/30">
              <h3 className="text-cyan-400 font-bold text-sm mb-3">EA uchun ahamiyati:</h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Har bir CN⁻ ligand EA da <strong className="text-white">1 ta C va 1 ta N</strong> beradi. 4 ta CN⁻ bo'lgani uchun jami <strong className="text-cyan-300">4C, 4N</strong> — bu C va N kanallarini to'ldiradi. <strong className="text-red-300">H, S, O yo'q</strong>.
              </p>
              <div className="mt-4 p-3 bg-cyan-900/20 rounded border border-cyan-700/30">
                <p className="text-[11px] text-purple-200 italic">
                  <strong className="text-yellow-300">Spektrokimyoviy qator:</strong> CN⁻ eng kuchli ligand (Δ₀ eng katta). Shuning uchun [Cu(CN)₄]³⁻ juda barqaror (log β₄ ≈ 30).
                </p>
              </div>
              <p className="text-xs text-purple-300 mt-3">
                <strong className="text-red-300">Xavf:</strong> Yonish jarayonida CN⁻ → HCN gazi hosil bo'lishi mumkin. Bu JUDA ZAHARLI — maxsus filtr tizimi talab etiladi!
              </p>
            </div>
          </div>
        </div>

        {/* 4. Cu-CN SIMULYATSIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🧬</span> CN⁻ soni simulyatsiyasi (Cu(I) komplekslari)
            </h2>
            <span className="text-xs text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded border border-cyan-700/30">
              n (CN⁻) = {nCN}
            </span>
          </div>

          <p className="text-sm text-purple-300 mb-6">
            CN⁻ soni (n) o'zgarganda <strong className="text-yellow-300">C% va N%</strong> o'zgaradi, chunki K⁺ soni ham o'zgaradi (n-1 ta K⁺). Bu EA orqali kompleksning tarkibini aniqlash imkonini beradi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-purple-950/60 p-6 rounded-xl border border-purple-700/30">
                <label className="block text-xs text-purple-400 mb-2">CN⁻ ligandlari soni (n):</label>
                <input 
                  type="range" min="1" max="6" step="1" 
                  value={nCN} 
                  onChange={(e) => setNCN(Number(e.target.value))}
                  className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 mb-2"
                />
                <div className="flex justify-between text-xs font-mono text-purple-500 mb-6">
                  <span>1 (CuCN)</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4 (✓)</span>
                  <span>5</span>
                  <span>6</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">Mol. massa</div>
                    <div className="text-xl font-mono text-white mt-1">{calc.total}</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-cyan-400 uppercase">CN⁻ ulushi</div>
                    <div className="text-xl font-mono text-cyan-400 mt-1">{calc.cnPct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-yellow-400 uppercase">%C</div>
                    <div className="text-xl font-mono text-yellow-400 mt-1">{calc.C_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-green-400 uppercase">%N</div>
                    <div className="text-xl font-mono text-green-400 mt-1">{calc.N_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-red-400 uppercase">%Cu</div>
                    <div className="text-xl font-mono text-red-400 mt-1">{calc.metal_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">%K</div>
                    <div className="text-xl font-mono text-purple-400 mt-1">{calc.K_pct}%</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-cyan-900/20 rounded border border-cyan-700/30">
                  <p className="text-[11px] text-purple-200">
                    <strong className="text-cyan-300">Hozirgi formula:</strong> K{Math.max(0, nCN-1)}[Cu(CN){nCN}]
                  </p>
                  <p className="text-[10px] text-purple-300 mt-1">
                    Zaryad: [Cu(CN){nCN}]^{nCN-1}- (Cu(I) = +1, n × CN⁻ = -n)
                  </p>
                </div>
              </div>

              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
                <h3 className="text-cyan-400 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                  <span>🧩</span> Ligand turlari
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
                
                {(() => {
                  const targetN = 20.000
                  const y = 210 - (targetN/25) * 180
                  return (
                    <g>
                      <line x1="40" y1={y} x2="380" y2={y} stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,3" />
                      <text x="385" y={y+3} fontSize="8" fill="#fbbf24">n=4 (naz. %N)</text>
                    </g>
                  )
                })()}

                <polyline 
                  fill="none" stroke="#06b6d4" strokeWidth="2.5" opacity="0.7"
                  points={[1,2,3,4,5,6].map(n => {
                    const props = calculateCuCyanideProperties(n)
                    const x = 40 + ((n-1)/5) * 340
                    const y = 210 - (props.N_pct / 25) * 180
                    return `${x},${y}`
                  }).join(" ")}
                />

                {[1,2,3,4,5,6].map(n => {
                  const props = calculateCuCyanideProperties(n)
                  const x = 40 + ((n-1)/5) * 340
                  const y = 210 - (props.N_pct / 25) * 180
                  const isActive = n === nCN
                  return (
                    <g key={n} style={{ cursor: 'pointer' }} onClick={() => setNCN(n)}>
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
                {[1,2,3,4,5,6].map(n => (
                  <text 
                    key={n} 
                    x={40 + ((n-1)/5)*340} 
                    y="225" 
                    textAnchor="middle" 
                    fontSize="10" 
                    fill={n===nCN ? "#fbbf24" : "#64748b"} 
                    fontWeight={n===nCN ? "bold" : "normal"}
                  >
                    n={n}
                  </text>
                ))}
                <text x="210" y="238" textAnchor="middle" fontSize="9" fill="#a78bfa">CN⁻ soni (n) | Cu(I) sianid komplekslari</text>
              </svg>
            </div>
          </div>
        </div>

        {/* 5. BARCHA SIANID KOMPLEKSLARI JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>📊</span> Barcha metall sianid komplekslari — EA va metallurgiya
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            <strong className="text-cyan-300">Sianid komplekslari metallurgiyada muhim</strong> — Au, Ag, Cu ajratishda ishlatiladi. EA ularni C% va N% orqali farqlaydi.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 uppercase tracking-wider">
                  <th className="py-2 text-left pl-2">Kompleks</th>
                  <th className="py-2 text-center">M (g/mol)</th>
                  <th className="py-2 text-center text-yellow-400">%C</th>
                  <th className="py-2 text-center text-green-400">%N</th>
                  <th className="py-2 text-center text-red-400">%M</th>
                  <th className="py-2 text-center text-purple-400">%K</th>
                  <th className="py-2 text-center">Geometriya</th>
                  <th className="py-2 text-left">Qo'llanilishi</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.cyanideComplexes.map((c, i) => {
                  const isTarget = c.formula.includes("K₃[Cu(CN)₄]")
                  const isCurrent = i === selectedComplex
                  return (
                    <tr 
                      key={i}
                      onClick={() => setSelectedComplex(i)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-cyan-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-cyan-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {c.formula}
                      </td>
                      <td className="py-2 text-center font-mono">{c.molarMass.toFixed(2)}</td>
                      <td className="py-2 text-center font-mono text-yellow-400 font-bold">{c.c_pct.toFixed(2)}</td>
                      <td className="py-2 text-center font-mono text-green-400">{c.n_pct.toFixed(2)}</td>
                      <td className="py-2 text-center font-mono text-red-400">{c.metal_pct.toFixed(2)}</td>
                      <td className="py-2 text-center font-mono text-purple-400">{c.k_pct.toFixed(2)}</td>
                      <td className="py-2 text-center text-[10px]">{c.geometry}</td>
                      <td className="py-2 text-[10px] italic text-purple-400">
                        {isTarget ? "✓ Maqsad" : isCurrent ? "🎯 Joriy" : c.cn_count === 2 ? "Oltin/Kumush" : "Umumiy"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-purple-400 italic mt-3">
            * <strong className="text-cyan-300">Metallurgiyada:</strong> [Au(CN)₂]⁻ va [Ag(CN)₂]⁻ eng muhim — oltin va kumush rudalaridan ajratishda ishlatiladi. Cu sianid komplekslari esa mis rudalarida uchraydi.
          </p>
        </div>

        {/* 5b. Cu-CN KOMPLEKSLARI JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔧</span> Cu(I) sianid komplekslari — CN⁻ soni o'zgarganda
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Cu(I) d¹⁰ konfiguratsiyasi turli CN⁻ sonlarini qabul qiladi: 2, 3, 4. Har biri turli geometriya va EA natijalariga ega.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 uppercase tracking-wider">
                  <th className="py-2 text-left pl-2">Kompleks</th>
                  <th className="py-2 text-center">M (g/mol)</th>
                  <th className="py-2 text-center text-yellow-400">%C</th>
                  <th className="py-2 text-center text-green-400">%N</th>
                  <th className="py-2 text-center text-red-400">%Cu</th>
                  <th className="py-2 text-center">CN⁻ %</th>
                  <th className="py-2 text-center">Geometriya</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[1,2,3,4,5,6].map(n => {
                  const props = calculateCuCyanideProperties(n)
                  const isTarget = n === 4
                  const isCurrent = n === nCN
                  return (
                    <tr 
                      key={n}
                      onClick={() => setNCN(n)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-cyan-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-cyan-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {n === 1 ? "CuCN (polimer)" : n === 2 ? "K[Cu(CN)₂]" : n === 3 ? "K₂[Cu(CN)₃]" : n === 4 ? "K₃[Cu(CN)₄] ✓" : n === 5 ? "K₄[Cu(CN)₅]" : "K₅[Cu(CN)₆]"}
                      </td>
                      <td className="py-2 text-center font-mono">{props.total}</td>
                      <td className="py-2 text-center font-mono text-yellow-400 font-bold">{props.C_pct}</td>
                      <td className="py-2 text-center font-mono text-green-400">{props.N_pct}</td>
                      <td className="py-2 text-center font-mono text-red-400">{props.metal_pct}</td>
                      <td className="py-2 text-center font-mono text-cyan-400">{props.cnPct}</td>
                      <td className="py-2 text-center text-[10px]">
                        {n === 1 ? "polimer" : n === 2 ? "chiziqli" : n === 3 ? "trigonal" : n === 4 ? "tetraedr" : "kvadrat pir."}
                      </td>
                      <td className="py-2 text-[10px] italic text-purple-400">
                        {isTarget ? "✓ Maqsad" : isCurrent ? "🎯 Joriy" : n > 4 ? "noyob" : "—"}
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
            Turli sharoitlarda o'tkazilgan EA yugurishlari. <strong className="text-cyan-300">Recovery ~37%</strong> — bu normal, chunki K (40.2%) va Cu (22.7%) detektlanmaydi!
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
                  <div className="flex justify-between items-center p-2 bg-yellow-900/20 rounded border border-yellow-500/20">
                    <span className="text-sm text-yellow-400 font-medium">Carbon (C)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.C.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dC <= 0.3 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 17.14% | Δ: {dC.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Hydrogen (H)</span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{run.H.toFixed(2)}%</span>
                      <span className={`text-[9px] ${run.H <= 0.05 ? 'text-green-500' : 'text-red-400'}`}>
                        Kutilgan: 0.00%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-500 font-medium">Nitrogen (N)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.N.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dN <= 0.3 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 20.00% | Δ: {dN.toFixed(2)}%
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
                  <span className="text-xs text-purple-400">Recovery (C+N):</span>
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
                  : (dC <= 0.3 && dN <= 0.3)
                    ? "bg-green-900/30 border-green-700/30"
                    : (dC <= 1.0 && dN <= 1.0)
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : (dC <= 0.3 && dN <= 0.3) ? "text-green-400" : (dC <= 1.0 && dN <= 1.0) ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : (dC <= 0.3 && dN <= 0.3) ? "✓ Toza namuna" : (dC <= 1.0 && dN <= 1.0) ? "⚠ Chegaraviy" : "✗ Ifloslangan"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    (dC <= 0.3 && dN <= 0.3)
                      ? "Namuna tarkibi K₃[Cu(CN)₄] formulaga to'liq mos. 4 ta CN⁻ saqlangan."
                      : (dC <= 1.0 && dN <= 1.0)
                        ? "C va N miqdori nazariyga yaqin. Ozroq CN⁻ yo'qotilgan bo'lishi mumkin."
                        : run.H > 0.1
                          ? "Namlik yutilgan — H chiqdi."
                          : run.N < 16
                            ? "CN⁻ yo'qotilgan. K₂[Cu(CN)₃] yoki K[Cu(CN)₂] aralashmasi bo'lishi mumkin."
                            : "Namuna ifloslangan yoki boshqa sianid kompleksi."
                  ) : (
                    run.id.includes("BLANK") 
                      ? "Tizim tozaligi tekshirildi. C va N nolga yaqin bo'lishi shart."
                      : "Kalibrlash standarti. C, H, N qiymatlari nazariyga mos kelishi kerak."
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-purple-950/30 rounded-xl p-6 border border-purple-700/30 flex flex-col">
              <h3 className="text-sm font-bold text-cyan-400 mb-4 flex justify-between">
                <span>%N Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Target: 20.00%</span>
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
                          <div className="absolute w-[120%] border-t border-dashed border-yellow-500/30 z-0" style={{ bottom: `${(20.000/25)*100}%` }}></div>
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
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-yellow-500/50"></span> Nazariy (20.00%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECOVERY MODAL */}
        {showRecoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowRecoveryModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <span>📈</span> Nima uchun Recovery ~37%?
              </h3>
              <p className="text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-white">K₃[Cu(CN)₄]</strong> uchun recovery ~37% bo'lishi <strong className="text-cyan-300">tabiiy va normal</strong>. Sababi — formuladagi 63% ni K va Cu tashkil qiladi, va ular standart CHNS-O da o'lchanmaydi.
              </p>
              <div className="bg-purple-900/40 p-4 rounded-lg font-mono text-xs mb-3">
                <div className="text-purple-400">EA detektlaydi:</div>
                <div className="text-green-400">C (17.14%) + N (20.00%) = <strong>37.14%</strong></div>
                <div className="mt-2 text-purple-400">EA detektlay olmaydi:</div>
                <div className="text-red-300">Cu (22.67%) + K (40.19%) = <strong>62.86%</strong></div>
                <div className="mt-2 text-white">JAMI: 100%</div>
                <div className="text-cyan-400 mt-2">✓ Recovery ~37% = Muvaffaqiyatli natija!</div>
              </div>
              <p className="text-xs text-purple-300 italic mb-4">
                K uchun <strong>AAS/Alanga fotometriyasi</strong>, Cu uchun <strong>ICP-OES</strong>, CN⁻ uchun <strong>Ion-selektiv elektrod</strong> qo'llaniladi.
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
            K₃[Cu(CN)₄] da CN⁻ ligandlari bosqichma-bosqich yo'qoladi. EA bu o'zgarishlarni C va N kamayishi orqali ko'rsatadi. <strong className="text-red-300">XAVF:</strong> CN⁻ yo'qotilganda HCN gazi chiqishi mumkin!
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
                d="M 50 20 L 200 20 Q 220 20 230 40 L 250 75 Q 260 90 280 90 L 310 90 Q 325 90 335 110 L 355 145 Q 365 160 385 160 L 410 160 Q 425 160 435 180 L 455 200 Q 465 205 485 205 L 580 205" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="125" y="15" textAnchor="middle" fill="#10b981">EA: %C=17.1, %N=20.0</text>
                
                <line x1="250" y1="75" x2="250" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="250" y="235" textAnchor="middle" fill="#8b5cf6">~280°C</text>
                <text x="270" y="65" fill="#8b5cf6">-1 CN⁻</text>

                <line x1="355" y1="145" x2="355" y2="220" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="355" y="235" textAnchor="middle" fill="#8b5cf6">~420°C</text>
                <text x="375" y="135" fill="#8b5cf6">-2 CN⁻</text>

                <line x1="455" y1="200" x2="455" y2="220" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="455" y="235" textAnchor="middle" fill="#f59e0b">~700°C</text>
                <text x="475" y="190" fill="#f59e0b">KCN subl.</text>

                <text x="530" y="200" textAnchor="middle" fill="#ef4444">Cu₂O</text>
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
            K₃[Cu(CN)₄] uchun EA ni qo'shimcha usullar bilan birgalikda ishlatish formulani to'liq tasdiqlaydi. <strong className="text-cyan-300">IQ spektroskopiya (ν(CN))</strong> va <strong className="text-cyan-300">Ion-selektiv elektrod</strong> muhim.
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
              <strong className="text-white">EA (C, N) + IQ (ν(CN) = 2100-2150 cm⁻¹) + ICP-OES (Cu, K) + Ion-selektiv elektrod (CN⁻) + ¹³C YaMR (δ = 145-150 ppm) + XRD (tetraedr)</strong> — oltita metod birgalikda K₃[Cu(CN)₄] ning to'liq kimyoviy tasvirini beradi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> Namuna tayyorlash bosqichlari (EA uchun — MAXSUS XAVFSIZLIK)
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            K₃[Cu(CN)₄] <strong className="text-red-300">CN⁻ guruhi tufayli JUDA ZAHARLI</strong>. Tayyorlashda eng yuqori xavfsizlik talab etiladi. Har bir qadamni bosib, tafsilotlarni ko'ring.
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
            O'lchangan %N qiymatini kiriting va sianid kompleksi holatini aniqlang.
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
                Nazariy qiymat: {COMPOUND.theoretical.N.percent.toFixed(3)}% (K₃[Cu(CN)₄])
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {(() => {
                const diff = Math.abs(customN - 20.000)
                let res = { s: "", c: "", m: "", icon: "" }
                
                if (diff < 0.5) res = { 
                  s: "K₃[CU(CN)₄]", 
                  c: "text-green-400", 
                  m: "Namuna toza kaliy tetratsianokuprat(I) tarkibiga ega. 4 ta CN⁻ saqlangan.",
                  icon: "✓"
                }
                else if (customN > 18 && customN < 19.5) res = { 
                  s: "K₂[CU(CN)₃]", 
                  c: "text-yellow-400", 
                  m: "N% 19.75% ga yaqin — 1 ta CN⁻ yo'qotilgan. Tritsiano kompleks aralashmasi.",
                  icon: "⚠"
                }
                else if (customN > 17 && customN < 18) res = { 
                  s: "K[CU(CN)₂]", 
                  c: "text-orange-400", 
                  m: "N% 18.72% ga yaqin — 2 ta CN⁻ yo'qotilgan. Ditsiano kompleks aralashmasi.",
                  icon: "⚠"
                }
                else if (customN > 22 && customN < 26) res = { 
                  s: "K₄[FE(CN)₆]", 
                  c: "text-orange-400", 
                  m: "N% 22.83% ga yaqin — bu kaliy ferrotsianid bo'lishi mumkin!",
                  icon: "⚠"
                }
                else if (customN < 15) res = { 
                  s: "JIDDIY PARCHALANISH", 
                  c: "text-red-400", 
                  m: "Ko'p CN⁻ yo'qotilgan yoki kuchli parchalanish yuz bergan.",
                  icon: "✗"
                }
                else res = { 
                  s: "IFLOSLANGAN", 
                  c: "text-red-400", 
                  m: "N% kutilgan oraliqda emas. Qayta tahlil kerak.",
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

        {/* 11. QIZIQ FAKT - K va Cu cheklovi */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> EA ning chegarasi: Nima uchun K va Cu ni o'lchamaydi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                K₃[Cu(CN)₄] da <strong className="text-white">formulaning 63% qismi K va Cu</strong>, va ular standart CHNS-O analizatorida detektlanmaydi:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li>C → CO₂ (gaz) → TCD detektlanadi (17.14%)</li>
                <li>N → N₂ (gaz) → TCD detektlanadi (20.00%)</li>
                <li>H, S, O → mavjud emas</li>
                <li><strong className="text-red-300">K → K₂O/KCN (qattiq qoldiq)</strong> — TCD detektlay olmaydi!</li>
                <li><strong className="text-red-300">Cu → Cu₂O (qattiq qoldiq)</strong> — TCD detektlay olmaydi!</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Bundan tashqari, <strong className="text-cyan-300">CN⁻ yonish jarayonida HCN gazi</strong> hosil bo'lishi mumkin — bu JUDA ZAHARLI va maxsus filtr tizimi talab etiladi.
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
                  <span>17.14%</span>
                </div>
                <div className="flex justify-between">
                  <span>− N:</span>
                  <span>20.00%</span>
                </div>
                <div className="flex justify-between">
                  <span>− H:</span>
                  <span>0.00%</span>
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
                  <span className="text-red-400">= K + Cu (qoldiq):</span>
                  <span className="text-red-400 font-bold">62.86%</span>
                </div>
                <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-700/30 text-red-200 text-[10px]">
                  Nazariy K% + Cu% = 40.19% + 22.67% = 62.86% — qoldiq bilan mos keladi ✓
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
              <p className="text-xs text-purple-200">C va N to'liq o'lchanadi (jami 37.1%). CN⁻ ligandlarini tasdiqlaydi. Cu(I) sianid komplekslarini aniqlashda yordam beradi.</p>
            </div>
            <div className="bg-red-950/30 p-4 rounded-lg border border-red-700/30">
              <div className="text-red-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar va xavf</h3>
              <p className="text-xs text-purple-200">Recovery ~37% — K va Cu detektlanmaydi. <strong className="text-red-300">CN⁻ juda zaharli!</strong> HCN gazi chiqishi mumkin — maxsus filtr tizimi talab etiladi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">IQ (ν(CN) = 2100-2150 cm⁻¹), ICP-OES (Cu, K), Ion-selektiv elektrod (CN⁻), ¹³C YaMR, XRD — to'liq tasdiqlash uchun birlashtiriladi.</p>
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
          <p>© 2026 Koordinatsion kimyo tahlil portali • K₃[Cu(CN)₄] • Element Analizi moduli</p>
          <p className="mt-1">Manbalar: IUPAC Atomic Weights 2021, Vogel's Textbook, NIST SRP, MacArthur-Forrest (1887)</p>
        </div>
      </footer>
    </main>
  )
}