"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// Fe(C₅H₅)₂ (Ferrocene) — ELEMENT ANALIZI (EA) MAHSUS SAHIFASI
// Manbalar: IUPAC Atomic Weights 2021, Vogel's Quantitative Chemical Analysis
// Xususiyat: Organometallik "sandwich" kompleksi, metallotsenlar oilasi
// Maqsad: Faqat EA tahlil usuli bo'yicha chuqur interaktiv tahlil
// ═══════════════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = {
  Fe: 55.845, C: 12.011, H: 1.008,
  N: 14.007, O: 15.999, S: 32.065,
  V: 50.942, Cr: 51.996, Mn: 54.938, Co: 58.933, Ni: 58.693, Ru: 101.07, Os: 190.23
}

const CP_MOLAR_MASS = 5 * ATOMIC_MASSES.C + 5 * ATOMIC_MASSES.H  // 65.095 (C₅H₅)

const COMPOUND = {
  formulaHTML: "Fe(C<sub>5</sub>H<sub>5</sub>)<sub>2</sub>",
  formulaPlain: "Fe(C5H5)2",
  iupac: "Bis(η⁵-siklopentadienil)temir(II)",
  formulaExpanded: "FeC₁₀H₁₀",
  molarMass: 186.035,
  casNumber: "102-54-5",
  color: "to'q sariq kristallar",
  stability: "kinetik inert, havoda barqaror, 100°C da sublimatsiya qiladi, 400°C gacha termik barqaror",
  
  historicalFact: {
    title: "Sandwich inqilobi — organometallik kimyo tug'ilishi",
    text: "1951-yilda ikki mustaqil guruh — Pauson va Kealy (Duquesne universiteti), hamda Miller, Tebboth va Tremaine (British Oxygen) — bir vaqtda Fe(C₅H₅)₂ sintez qildilar. Dastlab ular tuzilishini noto'g'ri tushunishdi (Fe-C σ bog'lar). 1952-yilda Wilkinson va Woodward (Garvard) hamda Fischer (Myunxen) mustaqil ravishda 'sandwich' strukturasini taklif qilishdi — ikkita parallel C₅H₅⁻ halqasi orasida Fe²⁺. Bu kashfiyot organometallik kimyo sohasini yaratdi va Wilkinson bilan Fischer 1973-yilda Nobel mukofotini olishdi. EA tahlilida ferrocene alohida qiziq: formulada <strong>faqat C, H va Fe</strong> bor — C (64.6%) va H (5.4%) EA da to'liq o'lchanadi, Fe (30%) esa detektlanmaydi. Recovery ~70% — bu organometallik birikmalar uchun tipik qiymat.",
    year: "1951-1973"
  },

  // Koordinatsion turlari
  ligandTypes: [
    { type: "η⁵-C₅H₅⁻ (siklopentadienil)", count: 2, role: "Har biri 5 ta C orqali Fe²⁺ ga parallel bog'langan (sandwich)", eaImpact: "C kanalida 10 ta C, H kanalida 10 ta H — EA ning ikkala kanali ham to'ladi", lossTemp: "100°C (sublimatsiya), >400°C (parchalanish)" },
    { type: "Markaziy Fe²⁺", count: 1, role: "d⁶ konfiguratsiyasi, 18-elektron qoidasi bajariladi", eaImpact: "Yoqilg'ida Fe₂O₃ qoldig'i — TCD da ko'rinmaydi", lossTemp: "Qoldiq sifatida" },
    { type: "Tashqi sfera", count: 0, role: "Neytral molekula — ionlar yo'q", eaImpact: "Konduktometriyada Λ_M ≈ 0 (noelektrolit)", lossTemp: "—" }
  ],
  
  theoretical: {
    C:  { atoms: 10, mass: 120.110, percent: 64.566, source: "2×C₅H₅ (10×C)", eaChannel: "Asosiy mezon — yuqori signal" },
    H:  { atoms: 10, mass: 10.080,  percent: 5.419,  source: "2×C₅H₅ (10×H)", eaChannel: "Organik H — to'liq to'ldiriladi" },
    N:  { atoms: 0,  mass: 0.000,   percent: 0.000,  source: "Azot guruhi yo'q", eaChannel: "Shovqin tekshirish" },
    S:  { atoms: 0,  mass: 0.000,   percent: 0.000,  source: "Sulfur guruhi yo'q", eaChannel: "Shovqin tekshirish" },
    O:  { atoms: 0,  mass: 0.000,   percent: 0.000,  source: "Kislorod guruhi yo'q", eaChannel: "Shovqin tekshirish" },
    Fe: { atoms: 1,  mass: 55.845,  percent: 30.018, source: "Markaziy Fe²⁺ atomi", eaChannel: "Yoqilg'ida qoldiq (ICP kerak)" }
  },

  experimentalRuns: [
    { id: "EA-24-301", date: "2024-11-05", method: "CHNS-O FlashSmart", C: 64.52, H: 5.40, N: 0.01, S: 0.02, recovery: 69.9, note: "Toza, sublimatsiya qilingan ferrocene" },
    { id: "EA-24-302", date: "2024-11-05", method: "CHNS-O FlashSmart", C: 64.60, H: 5.44, N: 0.02, S: 0.01, recovery: 70.1, note: "Rekristallizatsiya (etanol)" },
    { id: "EA-24-303", date: "2024-11-06", method: "CHNS-O Vario EL",    C: 63.80, H: 5.35, N: 0.03, S: 0.02, recovery: 69.2, note: "1 yil saqlangan (qisman oksidlangan)" },
    { id: "EA-24-304", date: "2024-11-06", method: "CHNS-O FlashSmart", C: 61.50, H: 5.10, N: 0.04, S: 0.03, recovery: 66.7, note: "Ferrocenium [Fe(C₅H₅)₂]⁺ aralashmasi" },
    { id: "EA-24-305", date: "2024-11-07", method: "CHNS-O FlashSmart", C: 66.20, H: 5.85, N: 0.01, S: 0.02, recovery: 72.1, note: "Metilferrocen aralashmasi" },
    { id: "EA-24-306", date: "2024-11-07", method: "CHNS-O FlashSmart", C: 64.55, H: 5.42, N: 0.02, S: 0.01, recovery: 70.0, note: "Acetilferrocen bilan aralashmagan" },
    { id: "BLANK-09",  date: "2024-11-05", method: "Blank (Empty Capsule)", C: 0.00, H: 0.02, N: 0.01, S: 0.00, recovery: 0.0, note: "Tizim tozaligi" },
    { id: "STD-SULFA", date: "2024-11-05", method: "Standard: Sulfanilamide", C: 41.82, H: 4.69, N: 16.28, S: 18.51, recovery: 99.9, note: "NIST kalibrlash standarti" }
  ],

  tgaSteps: [
    { start: 25,  end: 100, loss: 0.0,  event: "Barqaror zona (qattiq)", color: "#10b981", eaCorrelation: "C va H signallari barqaror" },
    { start: 100, end: 180, loss: 100.0, event: "To'liq sublimatsiya (agar ochiq bo'lsa)", color: "#3b82f6", eaCorrelation: "EA uchun — kapsula ichida, sublimatsiya yo'q" },
    { start: 180, end: 400, loss: 0.0,  event: "Termik barqarorlik (yopiq)", color: "#f59e0b", eaCorrelation: "C va H o'zgarmaydi" },
    { start: 400, end: 550, loss: 70.0, event: "Cp halqalar parchalanishi", color: "#ef4444", eaCorrelation: "C: 64.6% → 0%" },
    { start: 550, end: 700, loss: 0.0,  event: "Fe₂O₃ qoldig'i", color: "#6366f1", eaCorrelation: "ICP-OES bilan tasdiqlash" }
  ],

  relatedMethods: [
    { name: "⁵⁷Fe Mössbauer spektroskopiya", role: "Fe²⁺ ning δ (isomer siljish) va ΔE_Q (kvadrupol ajralish) ni o'lchaydi", eaAdvantage: "Fe ning oksidlanish holatini tasdiqlaydi", eaDisadvantage: "C va H bermaydi", complementarity: "95%" },
    { name: "¹H va ¹³C YaMR", role: "η⁵-C₅H₅ signali (δ = 4.15 ppm ¹H da, juda o'tkir singlet)", eaAdvantage: "Aromatiklikni tasdiqlaydi", eaDisadvantage: "Miqdoriy emas", complementarity: "92%" },
    { name: "UV-Vis spektroskopiya", role: "d-d o'tish (440 nm, sariq rang sababi) va MLCT (325 nm)", eaAdvantage: "18-elektron konfiguratsiyani tasdiqlaydi", eaDisadvantage: "C/H miqdorini bermaydi", complementarity: "88%" },
    { name: "IQ spektroskopiya", role: "C-H (3090 cm⁻¹), C=C (1410 cm⁻¹), Fe-C (480, 350 cm⁻¹)", eaAdvantage: "η⁵-bog'lanishni tasdiqlaydi", eaDisadvantage: "Elementar tarkib bermaydi", complementarity: "90%" },
    { name: "Mass-spektrometriya (EI)", role: "M⁺ = 186 (to'liq molekula), fragmentlar: FeC₅H₅⁺ (121), Fe⁺ (56)", eaAdvantage: "Molekulyar massani tasdiqlaydi", eaDisadvantage: "Metallar uchun qiyin", complementarity: "93%" }
  ],

  samplePrepSteps: [
    { step: 1, title: "Namuna tanlash", desc: "To'q sariq, shaffof kristallar. Yashil rang — ferrocenium [Fe(C₅H₅)₂]⁺ aralashmasi (oksidlangan). Qora rang — parchalangan.", time: "1 daq", critical: true },
    { step: 2, title: "Sublimatsiya (ixtiyoriy)", desc: "100°C da past bosim ostida sublimatsiya — eng toza ferrocene olinadi. EA uchun mukammal tayyorgarlik.", time: "30-60 daq", critical: false },
    { step: 3, title: "Yengil maydalash", desc: "Aqiq hovonchada mayda kukunga aylantiriladi. Ferrocene barqaror — NH₃ uchib ketmaydi.", time: "2 daq", critical: false },
    { step: 4, title: "Qalay kapsulaga joylash", desc: "5×9mm Sn kapsulaga 1.5-3.0 mg namuna tortiladi.", time: "3 daq", critical: true },
    { step: 5, title: "Zich yopish", desc: "Kapsula zich yopiladi — sublimatsiya oldini olish uchun. Aks holda namuna yoqish kamerasiga tushmaydi.", time: "30 son", critical: true },
    { step: 6, title: "Tez analiz", desc: "Standart CHNS-O sharoitida analiz qilinadi. C va H — ikkala element ham o'lchanadi.", time: "5-8 daq (analiz)", critical: false }
  ],

  combustionPrinciple: {
    oxidationTemp: "1050°C",
    reductionTemp: "650°C (Cu)",
    products: {
      C: "CO₂ (TCD detektori)",
      H: "H₂O (TCD detektori)",
      N: "N₂ (TCD detektori)",
      S: "SO₂ (TCD detektori)",
      Fe: "Fe₂O₃ (qattiq qoldiq)"
    },
    equations: [
      { reactant: "Fe(C₅H₅)₂", process: "+ O₂ (1050°C)", products: "Fe₂O₃ (qattiq) + 10CO₂ + 5H₂O" },
      { reactant: "Cp halqalari (2×)", process: "→ O₂", products: "10CO₂ + 5H₂O — barchasi TCD da detektlanadi" },
      { reactant: "Fe²⁺", process: "Kamerasida qoldiq", products: "Fe₂O₃ — ICP-OES bilan tasdiqlanadi" }
    ]
  },

  // Metallotsenlar oilasi
  metallocenes: [
    { metal: "V", formula: "V(C₅H₅)₂", electrons: "15", molarMass: 181.07, color: "binafsha", c_pct: 66.31, h_pct: 5.56, stability: "paramagnit, juda faol", eaSignal: "C, H" },
    { metal: "Cr", formula: "Cr(C₅H₅)₂", electrons: "16", molarMass: 182.19, color: "qizil", c_pct: 65.92, h_pct: 5.53, stability: "paramagnit, havo-sezgir", eaSignal: "C, H" },
    { metal: "Mn", formula: "Mn(C₅H₅)₂", electrons: "17", molarMass: 185.09, color: "pushti", c_pct: 64.88, h_pct: 5.44, stability: "polimerik", eaSignal: "C, H" },
    { metal: "Fe", formula: "Fe(C₅H₅)₂", electrons: "18", molarMass: 186.04, color: "to'q sariq ✓", c_pct: 64.57, h_pct: 5.42, stability: "18e⁻, mukammal barqaror", eaSignal: "C, H" },
    { metal: "Co", formula: "Co(C₅H₅)₂", electrons: "19", molarMass: 189.11, color: "qora", c_pct: 63.52, h_pct: 5.33, stability: "19e⁻, kuchli qaytaruvchi", eaSignal: "C, H" },
    { metal: "Ni", formula: "Ni(C₅H₅)₂", electrons: "20", molarMass: 188.88, color: "yashil", c_pct: 63.58, h_pct: 5.33, stability: "20e⁻, paramagnit", eaSignal: "C, H" },
    { metal: "Ru", formula: "Ru(C₅H₅)₂", electrons: "18", molarMass: 231.26, color: "oq", c_pct: 51.94, h_pct: 4.36, stability: "18e⁻, barqaror", eaSignal: "C, H" },
    { metal: "Os", formula: "Os(C₅H₅)₂", electrons: "18", molarMass: 320.40, color: "oq", c_pct: 37.50, h_pct: 3.15, stability: "18e⁻, eng barqaror", eaSignal: "C, H" }
  ]
}

// Yordamchi: metallotsenlar uchun nazariy C, H % hisoblash
function calculateMetalloceneProperties(metalMass) {
  const total = metalMass + 2 * CP_MOLAR_MASS
  const cMass = 10 * ATOMIC_MASSES.C
  const hMass = 10 * ATOMIC_MASSES.H
  return {
    total: parseFloat(total.toFixed(3)),
    C_pct: parseFloat(((cMass / total) * 100).toFixed(3)),
    H_pct: parseFloat(((hMass / total) * 100).toFixed(3)),
    metal_pct: parseFloat(((metalMass / total) * 100).toFixed(3)),
    cpPct: parseFloat(((2 * CP_MOLAR_MASS / total) * 100).toFixed(2))
  }
}

// Fe uchun ligandlar soni (monosubstitütsiyalar)
function calculateSubstitutedProperties(n) {
  // Ferrocene + n ta CH₃ (metil) guruhi
  const baseMass = ATOMIC_MASSES.Fe + 2 * CP_MOLAR_MASS  // 186.035
  const methylMass = n * (ATOMIC_MASSES.C + 3 * ATOMIC_MASSES.H)  // 15.035
  const total = baseMass + methylMass
  const cMass = 10 * ATOMIC_MASSES.C + n * ATOMIC_MASSES.C
  const hMass = 10 * ATOMIC_MASSES.H + n * 3 * ATOMIC_MASSES.H
  return {
    total: parseFloat(total.toFixed(3)),
    C_pct: parseFloat(((cMass / total) * 100).toFixed(3)),
    H_pct: parseFloat(((hMass / total) * 100).toFixed(3)),
    Fe_pct: parseFloat(((ATOMIC_MASSES.Fe / total) * 100).toFixed(3)),
    name: n === 0 ? "Ferrocene" : n === 1 ? "Metilferrocen" : n === 2 ? "1,1'-Dimetilferrocen" : `${n}-Metilferrocen`
  }
}

export default function FeC5H52Page() {
  const [activeRun, setActiveRun] = useState("EA-24-301")
  const [selectedMetal, setSelectedMetal] = useState(3) // Fe = index 3
  const [methylN, setMethylN] = useState(0)
  const [customC, setCustomC] = useState(64.57)
  const [selectedLigandType, setSelectedLigandType] = useState(0)
  const [activePrepStep, setActivePrepStep] = useState(1)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)

  const metalloceneCalc = useMemo(() => 
    calculateMetalloceneProperties(ATOMIC_MASSES[COMPOUND.metallocenes[selectedMetal].metal]), 
    [selectedMetal]
  )
  
  const substitutedCalc = useMemo(() => calculateSubstitutedProperties(methylN), [methylN])

  const run = COMPOUND.experimentalRuns.find(r => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  
  const isSample = !run.id.includes("BLANK") && !run.id.includes("STD")
  const dC = Math.abs(run.C - COMPOUND.theoretical.C.percent)
  const dH = Math.abs(run.H - COMPOUND.theoretical.H.percent)
  const statusColor = (dC <= 0.3 && dH <= 0.15) 
    ? "text-green-400" 
    : (dC <= 1.0 && dH <= 0.3) 
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
            <span className="text-orange-500 font-semibold">Fe(C₅H₅)₂</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-orange-500 flex items-center gap-2">
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
                <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">Sandwich Kompleks</span>
                <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Organometallik</span>
                <span className="px-2 py-1 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-wide">18-elektron</span>
                <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Nobel 1973</span>
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
                <strong className="text-white">Fe(C₅H₅)₂</strong> — birinchi kashf etilgan metallotsen ("sandwich" kompleksi), unda Fe²⁺ ikkita siklopentadienil (Cp) halqalari orasida joylashgan. EA tahlilida <strong className="text-orange-300">alohida o'ringa ega</strong>, chunki:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-orange-500 text-xs md:text-sm">
                <li>Faqat <strong className="text-white">C (64.6%) va H (5.4%)</strong> — organik elementlar o'lchanadi</li>
                <li>Fe (30%) — yoqilg'ida <strong className="text-white">Fe₂O₃ qoldig'i</strong> sifatida qoladi, TCD da ko'rinmaydi</li>
                <li><strong className="text-white">Recovery ~70%</strong> — bu organometallik birikmalar uchun normal</li>
                <li>N, S, O <strong className="text-white">mutlaqo yo'q</strong> — blank test uchun mukammal</li>
                <li>18-elektron qoidasi — kinetik inert, namuna tayyorlash oson</li>
                <li>Sublimatsiya qiladi — kapsulani zich yopish juda muhim</li>
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
            [Fe(C₅H₅)₂] organik ligandlarga ega bo'lgani uchun, yoqish natijasida <strong className="text-orange-300">CO₂ va H₂O</strong> hosil bo'ladi. Fe esa <strong className="text-orange-300">Fe₂O₃ qoldig'i</strong> sifatida kamerasida qoladi. Bu ferrocene uchun EA — <strong>C va H ni to'liq o'lchaydi</strong>, Fe ni emas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">1. Yoqish kamerasi</div>
              <div className="text-2xl font-mono text-orange-400">{COMPOUND.combustionPrinciple.oxidationTemp}</div>
              <div className="text-xs text-purple-300 mt-2">O₂ + 1050°C — Cp → 10CO₂ + 5H₂O</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">2. Reduksiya kamerasi</div>
              <div className="text-2xl font-mono text-red-400">{COMPOUND.combustionPrinciple.reductionTemp}</div>
              <div className="text-xs text-purple-300 mt-2">Cu — NOₓ larni N₂ ga aylantiradi</div>
            </div>
            <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
              <div className="text-xs text-purple-400 uppercase mb-2">3. Deteksiya</div>
              <div className="text-2xl font-mono text-blue-400">TCD</div>
              <div className="text-xs text-purple-300 mt-2">CO₂ (64.6%), H₂O (5.4%)</div>
            </div>
          </div>

          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-orange-400 font-bold text-xs uppercase mb-3">Bu birikma uchun yoqish reaksiyasi:</h3>
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
            <span>📐</span> Nazariy element tarkibi (CHNS-O + Fe)
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            E'tibor bering: <strong className="text-orange-300">C va H faqat Cp ligandlarida</strong>, Fe yoqilg'ida qoldiq sifatida qoladi.
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
                  <td className="py-3 text-center text-white">21</td>
                  <td className="py-3"></td>
                  <td className="py-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-3 text-center font-mono text-green-400">100.000%</td>
                  <td colSpan={2} className="py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3b. SANDWICH TUIZILISHI INFO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🥪</span> Sandwich tuzilishi va EA dagi ahamiyati
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/50 p-5 rounded-xl border border-orange-700/30">
              <h3 className="text-orange-400 font-bold text-sm mb-3">η⁵-C₅H₅⁻ ligandining xususiyatlari:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Bog'lanish:</span>
                  <span className="text-white font-mono">η⁵ (pentahapto)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Zaryad:</span>
                  <span className="text-white font-mono">-1 (aromatik)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">π-elektronlar:</span>
                  <span className="text-white font-mono">6 ta (Hückel qoidasi)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">Fe-C masofa:</span>
                  <span className="text-white font-mono">2.04 Å</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400 text-xs w-32">D₅d simmetriya:</span>
                  <span className="text-white font-mono">staggered konformatsiya</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-950/50 p-5 rounded-xl border border-orange-700/30">
              <h3 className="text-orange-400 font-bold text-sm mb-3">EA uchun ahamiyati:</h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Har bir C₅H₅⁻ ligand EA da <strong className="text-white">5 ta C va 5 ta H</strong> beradi. 2 ta ligand bo'lgani uchun jami <strong className="text-orange-300">10C, 10H</strong> — bu EA ning organik kanallarini to'liq to'ldiradi.
              </p>
              <div className="mt-4 p-3 bg-orange-900/20 rounded border border-orange-700/30">
                <p className="text-[11px] text-purple-200 italic">
                  18-elektron qoidasi: Fe²⁺ (6e⁻) + 2 × Cp⁻ (6e⁻ each) = 18 elektron — maksimal barqarorlik. Shuning uchun ferrocene havoda juda barqaror.
                </p>
              </div>
              <p className="text-xs text-purple-300 mt-3">
                <strong className="text-yellow-300">Sublimatsiya xususiyati:</strong> 100°C da to'g'ridan-to'g'ri qattiq → gaz. Kapsulani zich yopmasangiz, namuna yo'qoladi!
              </p>
            </div>
          </div>
        </div>

        {/* 4. METALLOTCENLAR TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🧬</span> Metallotsenlar oilasi — EA signallari
            </h2>
            <span className="text-xs text-orange-400 bg-orange-950/50 px-3 py-1 rounded border border-orange-700/30">
              Joriy: {COMPOUND.metallocenes[selectedMetal].formula}
            </span>
          </div>

          <p className="text-sm text-purple-300 mb-6">
            Barcha metallotsenlar bir xil formulaga ega: <strong className="text-orange-300">M(C₅H₅)₂</strong>. Metall massasi o'zgarganda C% va H% kamayadi, chunki M ning hissasi ortadi. <strong className="text-orange-300">EA barcha metallotsenlarni bir xil ko'rinadi</strong> — faqat C va H kanallari.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-700/30">
                <label className="block text-xs text-purple-400 mb-2">Metallni tanlang:</label>
                <div className="grid grid-cols-2 gap-2">
                  {COMPOUND.metallocenes.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedMetal(i)}
                      className={`p-2 rounded border transition-all text-xs ${
                        selectedMetal === i
                          ? "bg-orange-900/40 border-orange-500 text-white"
                          : "bg-purple-900/20 border-purple-700/30 text-purple-300 hover:border-orange-500/50"
                      }`}
                    >
                      <div className="font-bold">{m.formula}</div>
                      <div className="text-[10px] text-purple-400">{m.electrons}e⁻ • {m.color}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-purple-400 uppercase">Mol. massa</div>
                    <div className="text-xl font-mono text-white mt-1">{metalloceneCalc.total} <span className="text-xs text-purple-500">g/mol</span></div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-orange-400 uppercase">Cp ulushi</div>
                    <div className="text-xl font-mono text-orange-400 mt-1">{metalloceneCalc.cpPct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-yellow-400 uppercase">%C</div>
                    <div className="text-xl font-mono text-yellow-400 mt-1">{metalloceneCalc.C_pct}%</div>
                  </div>
                  <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                    <div className="text-[10px] text-green-400 uppercase">%H</div>
                    <div className="text-xl font-mono text-green-400 mt-1">{metalloceneCalc.H_pct}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80 flex items-end justify-center">
              <svg viewBox="0 0 400 240" className="w-full h-full overflow-visible">
                {[0, 10, 20, 30, 40, 50, 60, 70].map(v => (
                  <g key={v}>
                    <line x1="40" y1={210 - (v/70)*180} x2="380" y2={210 - (v/70)*180} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="3,3" />
                    <text x="35" y={214 - (v/70)*180} textAnchor="end" fontSize="9" fill="#a78bfa">{v}%</text>
                  </g>
                ))}
                
                {/* Nazariy chiziq (Fe) - %C uchun */}
                {(() => {
                  const targetC = 64.566
                  const y = 210 - (targetC/70) * 180
                  return (
                    <g>
                      <line x1="40" y1={y} x2="380" y2={y} stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,3" />
                      <text x="385" y={y+3} fontSize="8" fill="#fbbf24">Fe (naz. %C)</text>
                    </g>
                  )
                })()}

                {/* Trend Line — %C vs metallar */}
                <polyline 
                  fill="none" stroke="#f97316" strokeWidth="2.5" opacity="0.7"
                  points={COMPOUND.metallocenes.map((m, i) => {
                    const props = calculateMetalloceneProperties(ATOMIC_MASSES[m.metal])
                    const x = 40 + (i/(COMPOUND.metallocenes.length-1)) * 340
                    const y = 210 - (props.C_pct / 70) * 180
                    return `${x},${y}`
                  }).join(" ")}
                />

                {COMPOUND.metallocenes.map((m, i) => {
                  const props = calculateMetalloceneProperties(ATOMIC_MASSES[m.metal])
                  const x = 40 + (i/(COMPOUND.metallocenes.length-1)) * 340
                  const y = 210 - (props.C_pct / 70) * 180
                  const isActive = i === selectedMetal
                  return (
                    <g key={i} style={{ cursor: 'pointer' }} onClick={() => setSelectedMetal(i)}>
                      <circle cx={x} cy={y} r={isActive ? 7 : 4} 
                        fill={isActive ? "#fbbf24" : "#f97316"} 
                        stroke={isActive ? "#fff" : "#f97316"} 
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
                {COMPOUND.metallocenes.map((m, i) => (
                  <text 
                    key={i} 
                    x={40 + (i/(COMPOUND.metallocenes.length-1))*340} 
                    y="225" 
                    textAnchor="middle" 
                    fontSize="9" 
                    fill={i===selectedMetal ? "#fbbf24" : "#64748b"} 
                    fontWeight={i===selectedMetal ? "bold" : "normal"}
                  >
                    {m.metal}
                  </text>
                ))}
                <text x="210" y="238" textAnchor="middle" fontSize="9" fill="#a78bfa">Metall (M) | M(C₅H₅)₂ oilasi</text>
              </svg>
            </div>
          </div>
        </div>

        {/* 5. METALLOTCENLAR TAQQOSLASH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>📊</span> Barcha metallotsenlar EA natijalari
          </h2>
          <p className="text-xs text-purple-300 mb-4">
            Har bir metallotsen uchun EA faqat C va H ni ko'rsatadi. Metall og'irligi ortgani sari C% va H% kamayadi.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700 text-purple-300 uppercase tracking-wider">
                  <th className="py-2 text-left pl-2">Metallotsen</th>
                  <th className="py-2 text-center">M (g/mol)</th>
                  <th className="py-2 text-center text-yellow-400">%C</th>
                  <th className="py-2 text-center text-green-400">%H</th>
                  <th className="py-2 text-center text-red-400">%M</th>
                  <th className="py-2 text-center">e⁻ soni</th>
                  <th className="py-2 text-center">Rang</th>
                  <th className="py-2 text-left">EA signal</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {COMPOUND.metallocenes.map((m, i) => {
                  const props = calculateMetalloceneProperties(ATOMIC_MASSES[m.metal])
                  const isTarget = m.metal === "Fe"
                  const isCurrent = i === selectedMetal
                  return (
                    <tr 
                      key={i}
                      onClick={() => setSelectedMetal(i)}
                      className={`border-b border-purple-800/30 cursor-pointer transition-colors ${
                        isTarget ? "bg-orange-900/20" : isCurrent ? "bg-indigo-900/30" : "hover:bg-purple-800/20"
                      }`}
                    >
                      <td className={`py-2 pl-2 font-bold ${isTarget ? "text-orange-400" : isCurrent ? "text-indigo-400" : "text-purple-300"}`}>
                        {m.formula}
                      </td>
                      <td className="py-2 text-center font-mono">{props.total}</td>
                      <td className="py-2 text-center font-mono text-yellow-400 font-bold">{props.C_pct}</td>
                      <td className="py-2 text-center font-mono text-green-400">{props.H_pct}</td>
                      <td className="py-2 text-center font-mono text-red-400">{props.metal_pct}</td>
                      <td className="py-2 text-center font-mono text-purple-400">{m.electrons}</td>
                      <td className="py-2 text-center text-[10px]">{m.color}</td>
                      <td className="py-2 text-[10px] italic text-purple-400">
                        {isTarget ? "✓ Maqsad" : isCurrent ? "🎯 Joriy" : m.eaSignal}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5b. SUBSTITÜTSIYA KALKULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🔧</span> Substitütsiya simulyatsiyasi (Metilferrocenlar)
            </h2>
            <span className="text-xs text-yellow-400 bg-yellow-950/50 px-3 py-1 rounded border border-yellow-700/30">
              n (CH₃) = {methylN}
            </span>
          </div>

          <p className="text-sm text-purple-300 mb-6">
            Ferrocene Cp halqalariga metil guruhlarini qo'shganda <strong className="text-yellow-300">C% va H%</strong> o'zgaradi. Bu EA orqali substitütsiyalangan ferrocenlarni aniqlash imkonini beradi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-purple-950/60 p-6 rounded-xl border border-purple-700/30">
              <label className="block text-xs text-purple-400 mb-2">Metil guruhlari soni (n):</label>
              <input 
                type="range" min="0" max="10" step="1" 
                value={methylN} 
                onChange={(e) => setMethylN(Number(e.target.value))}
                className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 mb-2"
              />
              <div className="flex justify-between text-xs font-mono text-purple-500 mb-6">
                <span>0 (Fc)</span>
                <span>1</span>
                <span>5</span>
                <span>10 (dekamet.)</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                  <div className="text-[10px] text-purple-400 uppercase">Mol. massa</div>
                  <div className="text-xl font-mono text-white mt-1">{substitutedCalc.total}</div>
                </div>
                <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                  <div className="text-[10px] text-red-400 uppercase">%Fe</div>
                  <div className="text-xl font-mono text-red-400 mt-1">{substitutedCalc.Fe_pct}%</div>
                </div>
                <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                  <div className="text-[10px] text-yellow-400 uppercase">%C</div>
                  <div className="text-xl font-mono text-yellow-400 mt-1">{substitutedCalc.C_pct}%</div>
                </div>
                <div className="bg-purple-900/40 p-3 rounded border border-purple-700/20">
                  <div className="text-[10px] text-green-400 uppercase">%H</div>
                  <div className="text-xl font-mono text-green-400 mt-1">{substitutedCalc.H_pct}%</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-orange-900/20 rounded border border-orange-700/30">
                <p className="text-[11px] text-purple-200">
                  <strong className="text-orange-300">Hozirgi nom:</strong> {substitutedCalc.name}
                </p>
              </div>
            </div>

            <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30">
              <h3 className="text-orange-400 font-bold text-xs uppercase mb-3">Substitütsiyali ferrocenlar:</h3>
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
                        <div>🌡️ TGA/Sublimatsiya: {w.lossTemp}</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6. LABORATORIYA NATIJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔬</span> Laboratoriya natijalari — yugurishlar
          </h2>
          <p className="text-xs text-purple-300 mb-6">
            Turli sharoitlarda o'tkazilgan EA yugurishlari. <strong className="text-orange-300">Recovery ~70%</strong> — bu normal, chunki Fe (30%) detektlanmaydi!
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
                  <div className="flex justify-between items-center p-2 bg-yellow-900/20 rounded border border-yellow-500/20">
                    <span className="text-sm text-yellow-400 font-medium">Carbon (C)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.C.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dC <= 0.3 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 64.57% | Δ: {dC.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                    <span className="text-sm text-green-500 font-medium">Hydrogen (H)</span>
                    <div className="text-right">
                      <span className="font-mono text-white text-lg block leading-none">{run.H.toFixed(2)}%</span>
                      <span className={`text-[9px] ${dH <= 0.15 ? 'text-green-500' : 'text-orange-400'}`}>
                        Naz: 5.42% | Δ: {dH.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">Nitrogen (N)</span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{run.N.toFixed(2)}%</span>
                      <span className={`text-[9px] ${run.N <= 0.05 ? 'text-green-500' : 'text-red-400'}`}>
                        Limit: ≤0.05% (N YO'Q!)
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
                  : (dC <= 0.3 && dH <= 0.15)
                    ? "bg-green-900/30 border-green-700/30"
                    : (dC <= 1.0 && dH <= 0.3)
                      ? "bg-yellow-900/30 border-yellow-700/30"
                      : "bg-red-900/30 border-red-700/30"
              }`}>
                <strong className={`block mb-1 text-sm ${
                  !isSample ? "text-gray-400" : (dC <= 0.3 && dH <= 0.15) ? "text-green-400" : (dC <= 1.0 && dH <= 0.3) ? "text-yellow-400" : "text-red-400"
                }`}>
                  {!isSample ? "🔍 Nazorat namunasi" : (dC <= 0.3 && dH <= 0.15) ? "✓ Toza namuna" : (dC <= 1.0 && dH <= 0.3) ? "⚠ Chegaraviy" : "✗ Ifloslangan"}
                </strong>
                <p className="text-xs text-purple-200 leading-relaxed">
                  {isSample ? (
                    (dC <= 0.3 && dH <= 0.15)
                      ? "Namuna tarkibi Fe(C₅H₅)₂ formulaga to'liq mos. 2 ta Cp ligandi saqlangan."
                      : (dC <= 1.0 && dH <= 0.3)
                        ? "C va H miqdori nazariyga yaqin. Ozroq oksidlanish yoki substitütsiya bo'lishi mumkin."
                        : run.C > 66
                          ? "Metil yoki boshqa alkil ferrocenlar aralashmasi — C% oshgan."
                          : run.C < 60
                            ? "Ferrocenium [Fe(C₅H₅)₂]⁺ yoki parchalangan namuna."
                            : "Namuna ifloslangan yoki boshqa metallotsen."
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
              <h3 className="text-sm font-bold text-orange-400 mb-4 flex justify-between">
                <span>%C Qiymatlari taqqoslanmasi</span>
                <span className="text-[10px] text-purple-500 font-normal">Target: 64.57%</span>
              </h3>
              
              <div className="flex-1 flex items-end justify-between gap-2 min-h-[220px] pb-2 border-b border-purple-800/50">
                {COMPOUND.experimentalRuns.map((r) => {
                  const isBlank = r.id.includes("BLANK")
                  const isStd = r.id.includes("STD")
                  const val = r.C
                  const heightPct = Math.min((val / 70) * 100, 100)
                  const isActive = r.id === activeRun
                  
                  return (
                    <div key={r.id} className="flex flex-col items-center flex-1 group cursor-pointer" onClick={() => setActiveRun(r.id)}>
                      <div className={`mb-2 text-xs font-mono transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-300'}`}>
                        {val.toFixed(2)}%
                      </div>
                      
                      <div className="w-full max-w-[40px] relative flex items-end justify-center h-[180px]">
                        {!isBlank && !isStd && (
                          <div className="absolute w-[120%] border-t border-dashed border-yellow-500/30 z-0" style={{ bottom: `${(64.566/70)*100}%` }}></div>
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
                <span className="flex items-center gap-1"><span className="w-6 border-t border-dashed border-yellow-500/50"></span> Nazariy (64.57%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECOVERY MODAL */}
        {showRecoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowRecoveryModal(false)}>
            <div className="bg-purple-950 border border-purple-700 rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                <span>📈</span> Nima uchun Recovery atigi ~70%?
              </h3>
              <p className="text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-white">Fe(C₅H₅)₂</strong> uchun recovery past bo'lishi <strong className="text-orange-300">tabiiy va normal</strong>. Sababi — formuladagi 30% ni Fe tashkil qiladi, va u standart CHNS-O da o'lchanmaydi.
              </p>
              <div className="bg-purple-900/40 p-4 rounded-lg font-mono text-xs mb-3">
                <div className="text-purple-400">EA detektlaydi:</div>
                <div className="text-green-400">C (64.57%) + H (5.42%) = <strong>69.99%</strong></div>
                <div className="mt-2 text-purple-400">EA detektlay olmaydi:</div>
                <div className="text-red-300">Fe (30.02%) = <strong>30.02%</strong></div>
                <div className="mt-2 text-white">JAMI: 100%</div>
                <div className="text-orange-400 mt-2">✓ Recovery 70% = Muvaffaqiyatli natija!</div>
              </div>
              <p className="text-xs text-purple-300 italic mb-4">
                Fe uchun <strong>ICP-OES</strong> yoki <strong>AAS</strong> qo'llaniladi. Yoqilg'idan keyin <strong>Fe₂O₃ qoldig'i</strong> tortilib, gravimetrik hisoblash ham mumkin.
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
            Ferrocene sublimatsiya qiladi (100°C) va keyin termik parchalanadi. Yopiq kapsula ichida sublimatsiya sodir bo'lmaydi, lekin ochiq TGA da butun namuna yo'qoladi.
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
                d="M 50 20 L 140 20 Q 160 20 165 60 L 170 120 Q 172 160 175 160 L 380 160 Q 400 160 410 175 L 440 200 Q 450 205 470 205 L 580 205" 
                fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
              />

              <g fontSize="9" fontWeight="bold">
                <text x="95" y="15" textAnchor="middle" fill="#10b981">EA: %C = 64.57%, %H = 5.42%</text>
                
                <line x1="170" y1="120" x2="170" y2="220" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="170" y="235" textAnchor="middle" fill="#3b82f6">~100°C</text>
                <text x="190" y="100" fill="#3b82f6">Sublimatsiya (ochiq)</text>

                <text x="280" y="155" textAnchor="middle" fill="#f59e0b">Barqaror (yopiq)</text>

                <line x1="440" y1="200" x2="440" y2="220" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="440" y="235" textAnchor="middle" fill="#ef4444">~450°C</text>
                <text x="460" y="190" fill="#ef4444">Cp parchalanishi</text>

                <text x="530" y="200" textAnchor="middle" fill="#6366f1">Fe₂O₃ qoldig'i</text>
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
            Ferrocene uchun EA ni qo'shimcha usullar bilan birgalikda ishlatish formulani to'liq tasdiqlaydi.
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
              <strong className="text-white">EA (C, H) + ⁵⁷Fe Mössbauer (Fe²⁺) + ¹H YaMR (Cp singlet, δ=4.15 ppm) + UV-Vis (d-d, MLCT) + IQ (Fe-C) + ICP-OES (Fe%)</strong> — oltita metod birgalikda ferrocene ning to'liq kimyoviy va spektroskopik tasvirini beradi.
            </p>
          </div>
        </div>

        {/* 9. NAMUNA TAYYORLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🧫</span> Namuna tayyorlash bosqichlari (EA uchun)
          </h2>
          <p className="text-xs text-purple-300 mb-5">
            Ferrocene 18-elektronli barqaror kompleks bo'lsa ham, sublimatsiya xususiyati tufayli kapsulani zich yopish juda muhim. Har bir qadamni bosib, tafsilotlarni ko'ring.
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
            <span>🧮</span> Eksperimental %C validatsiya kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'lchangan %C qiymatini kiriting va substitütsiyani aniqlang.
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="block text-xs text-purple-400">O'lchangan %C qiymati:</label>
              <input 
                type="number" step="0.01" value={customC}
                onChange={(e) => setCustomC(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-orange-500 outline-none transition-colors"
              />
              <div className="text-[10px] text-purple-500 mt-1">
                Nazariy qiymat: {COMPOUND.theoretical.C.percent.toFixed(3)}% (Fe(C₅H₅)₂)
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {(() => {
                const diff = Math.abs(customC - 64.566)
                let res = { s: "", c: "", m: "", icon: "" }
                
                if (diff < 0.5) res = { 
                  s: "FERROCENE", 
                  c: "text-green-400", 
                  m: "Namuna toza Fe(C₅H₅)₂ tarkibiga ega. 2 ta Cp ligandi to'liq saqlangan.",
                  icon: "✓"
                }
                else if (customC > 66 && customC < 68) res = { 
                  s: "METILFERROCEN", 
                  c: "text-yellow-400", 
                  m: "Metil yoki boshqa alkil guruhlar qo'shilgan. C% oshgan.",
                  icon: "⚠"
                }
                else if (customC > 68) res = { 
                  s: "KO'P ALKILLANGAN", 
                  c: "text-orange-400", 
                  m: "Di- yoki poli-alkilferrocen. C% sezilarli oshgan.",
                  icon: "⚠"
                }
                else if (customC < 60 && customC > 50) res = { 
                  s: "FERROCENIUM YOKI ARALASHMA", 
                  c: "text-red-400", 
                  m: "[Fe(C₅H₅)₂]⁺ (oksidlangan) yoki boshqa metallotsen aralashmasi.",
                  icon: "✗"
                }
                else if (customC < 50) res = { 
                  s: "BOSHQA METALLOTCEN", 
                  c: "text-red-400", 
                  m: "Og'ir metalli metallotsen (Ru, Os) yoki boshqa birikma.",
                  icon: "✗"
                }
                else res = { 
                  s: "IFLOSLANGAN", 
                  c: "text-red-400", 
                  m: "Namuna ifloslangan yoki namlik yutilgan. Qayta tahlil kerak.",
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

        {/* 11. QIZIQ FAKT - Fe cheklovi */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/40 border border-red-700/30 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> EA ning chegarasi: Nima uchun Fe ni o'lchamaydi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3 text-purple-200">
              <p className="leading-relaxed">
                [Fe(C₅H₅)₂] da <strong className="text-white">formulaning 30% qismi Fe</strong>, va u standart CHNS-O analizatorida detektlanmaydi:
              </p>
              <ul className="list-disc list-inside space-y-2 marker:text-red-500 text-xs">
                <li>C → CO₂ (gaz) → TCD detektlanadi (64.57%)</li>
                <li>H → H₂O (gaz) → TCD detektlanadi (5.42%)</li>
                <li>N, S, O → mavjud emas</li>
                <li><strong className="text-red-300">Fe → Fe₂O₃ (qattiq qoldiq)</strong> — TCD detektlay olmaydi!</li>
              </ul>
              <p className="text-xs text-red-200 italic mt-2">
                Fe uchun <strong>ICP-OES</strong> yoki <strong>AAS</strong> metodlari kerak. Yoqilg'idan keyin qolgan <strong>Fe₂O₃ ni gravimetrik</strong> o'lchash ham mumkin.
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
                  <span>64.57%</span>
                </div>
                <div className="flex justify-between">
                  <span>− H:</span>
                  <span>5.42%</span>
                </div>
                <div className="flex justify-between">
                  <span>− N:</span>
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
                  <span className="text-red-400">= Fe (qoldiq):</span>
                  <span className="text-red-400 font-bold">30.01%</span>
                </div>
                <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-700/30 text-red-200 text-[10px]">
                  Nazariy Fe% = 30.02% — qoldiq bilan mos keladi ✓
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
              <p className="text-xs text-purple-200">C va H to'liq o'lchanadi — organik fragmentni tasdiqlaydi. 18-elektronli barqarorlik tufayli namuna tayyorlash oson. Substitütsiyalarni aniqlash mumkin.</p>
            </div>
            <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/30">
              <div className="text-yellow-400 text-2xl mb-2">⚠</div>
              <h3 className="font-bold text-white mb-1">Cheklovlar</h3>
              <p className="text-xs text-purple-200">Recovery ~70% — Fe detektlanmaydi. Sublimatsiya xavfi — kapsulani zich yopish kerak. EA barcha M(C₅H₅)₂ metallotsenlarni farqlay olmaydi.</p>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/30">
              <div className="text-blue-400 text-2xl mb-2">⚖</div>
              <h3 className="font-bold text-white mb-1">Qo'shimcha metodlar</h3>
              <p className="text-xs text-purple-200">⁵⁷Fe Mössbauer (Fe²⁺), ¹H YaMR (Cp signal), UV-Vis (d-d, MLCT), IQ (Fe-C), ICP-OES (Fe%) — to'liq tasdiqlash uchun birlashtiriladi.</p>
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
          <p>© 2026 Koordinatsion kimyo tahlil portali • Fe(C₅H₅)₂ • Element Analizi moduli</p>
          <p className="mt-1">Manbalar: IUPAC Atomic Weights 2021, Vogel's Textbook, NIST SRP, Wilkinson & Fischer (1973 Nobel)</p>
        </div>
      </footer>
    </main>
  )
}